/*!
 * DuckDB database for ultra-fast agent queries
 *
 * Schema:
 * - agents: Main agent index with full-text search
 * - agent_capabilities: Many-to-many relationship for capabilities
 * - query_patterns: Learned orchestration patterns
 */

use anyhow::{Context, Result};
use duckdb::{params, Connection};
use std::path::Path;
use std::sync::{Arc, Mutex};
use tracing::{debug, info};

use crate::loader::AgentMetadata;
use crate::mcp::AgentQueryParams;

/// Database wrapper with connection pool
#[derive(Clone)]
pub struct Database {
    conn: Arc<Mutex<Connection>>,
}

impl Database {
    /// Create or open database
    pub fn new(path: &Path) -> Result<Self> {
        let conn = Connection::open(path)
            .context("Failed to open DuckDB database")?;

        Ok(Self {
            conn: Arc::new(Mutex::new(conn)),
        })
    }

    /// Initialize database schema
    pub fn initialize_schema(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();

        // Agents table with full-text search support
        conn.execute_batch(
            r#"
            CREATE TABLE IF NOT EXISTS agents (
                id INTEGER PRIMARY KEY,
                name VARCHAR NOT NULL UNIQUE,
                description TEXT NOT NULL,
                model VARCHAR NOT NULL,
                plugin VARCHAR NOT NULL,
                role VARCHAR,
                use_when TEXT,
                file_path VARCHAR NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_agents_name ON agents(name);
            CREATE INDEX IF NOT EXISTS idx_agents_plugin ON agents(plugin);
            CREATE INDEX IF NOT EXISTS idx_agents_model ON agents(model);
            CREATE INDEX IF NOT EXISTS idx_agents_role ON agents(role);
            "#,
        )?;

        // Capabilities table (many-to-many)
        conn.execute_batch(
            r#"
            CREATE TABLE IF NOT EXISTS agent_capabilities (
                agent_id INTEGER NOT NULL,
                capability VARCHAR NOT NULL,
                PRIMARY KEY (agent_id, capability)
            );

            CREATE INDEX IF NOT EXISTS idx_capabilities ON agent_capabilities(capability);
            "#,
        )?;

        // Fallbacks table (many-to-many)
        conn.execute_batch(
            r#"
            CREATE TABLE IF NOT EXISTS agent_fallbacks (
                agent_id INTEGER NOT NULL,
                fallback_agent VARCHAR NOT NULL,
                priority INTEGER NOT NULL,
                PRIMARY KEY (agent_id, fallback_agent)
            );
            "#,
        )?;

        // Query patterns table (for learning)
        conn.execute_batch(
            r#"
            CREATE TABLE IF NOT EXISTS query_patterns (
                id INTEGER PRIMARY KEY,
                context_hash VARCHAR NOT NULL,
                agents_used TEXT NOT NULL,
                success_count INTEGER DEFAULT 0,
                failure_count INTEGER DEFAULT 0,
                avg_duration_ms DOUBLE DEFAULT 0.0,
                last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(context_hash)
            );

            CREATE INDEX IF NOT EXISTS idx_patterns_hash ON query_patterns(context_hash);
            CREATE INDEX IF NOT EXISTS idx_patterns_success ON query_patterns(success_count);
            "#,
        )?;

        info!("Database schema initialized");
        Ok(())
    }

    /// Index agents in database
    pub fn index_agents(&self, agents: &[AgentMetadata]) -> Result<()> {
        let conn = self.conn.lock().unwrap();

        // Clear existing data
        conn.execute("DELETE FROM agent_fallbacks", [])?;
        conn.execute("DELETE FROM agent_capabilities", [])?;
        conn.execute("DELETE FROM agents", [])?;

        // Insert agents
        for (idx, agent) in agents.iter().enumerate() {
            let agent_id = (idx + 1) as i32;

            conn.execute(
                r#"
                INSERT INTO agents (id, name, description, model, plugin, role, use_when, file_path)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                "#,
                params![
                    agent_id,
                    &agent.name,
                    &agent.description,
                    &agent.model,
                    &agent.plugin,
                    agent.role.as_ref(),
                    agent.use_when.as_ref(),
                    &agent.file_path,
                ],
            )?;

            // Insert capabilities
            for capability in &agent.capabilities {
                conn.execute(
                    "INSERT INTO agent_capabilities (agent_id, capability) VALUES (?, ?)",
                    params![agent_id, capability],
                )?;
            }

            // Insert fallbacks
            if let Some(fallbacks) = &agent.fallbacks {
                for (priority, fallback) in fallbacks.iter().enumerate() {
                    conn.execute(
                        "INSERT INTO agent_fallbacks (agent_id, fallback_agent, priority) VALUES (?, ?, ?)",
                        params![agent_id, fallback, priority as i32],
                    )?;
                }
            }
        }

        info!("Indexed {} agents", agents.len());
        Ok(())
    }

    /// Query agents with context, role, or capability filters
    pub fn query_agents(&self, params: &AgentQueryParams) -> Result<Vec<AgentMetadata>> {
        let conn = self.conn.lock().unwrap();
        let limit = params.limit.unwrap_or(10);

        let mut query = String::from(
            r#"
            SELECT DISTINCT
                a.id,
                a.name,
                a.description,
                a.model,
                a.plugin,
                a.role,
                a.use_when,
                a.file_path,
                COALESCE(
                    (SELECT STRING_AGG(capability, ',')
                     FROM agent_capabilities
                     WHERE agent_id = a.id),
                    ''
                ) as capabilities_str,
                COALESCE(
                    (SELECT STRING_AGG(fallback_agent, ',')
                     FROM (SELECT fallback_agent FROM agent_fallbacks
                           WHERE agent_id = a.id
                           ORDER BY priority)),
                    ''
                ) as fallbacks_str
            FROM agents a
            "#,
        );

        let mut conditions = Vec::new();
        let mut bind_params: Vec<Box<dyn duckdb::ToSql>> = Vec::new();

        // Role filter
        if let Some(role) = &params.role {
            conditions.push("a.role = ?");
            bind_params.push(Box::new(role.clone()));
        }

        // Capability filter
        if let Some(capability) = &params.capability {
            query.push_str(" LEFT JOIN agent_capabilities ac ON a.id = ac.agent_id");
            conditions.push("ac.capability LIKE ?");
            bind_params.push(Box::new(format!("%{}%", capability)));
        }

        // Context filter (full-text search on description + use_when)
        if let Some(context) = &params.context {
            conditions.push("(a.description LIKE ? OR a.use_when LIKE ?)");
            let pattern = format!("%{}%", context);
            bind_params.push(Box::new(pattern.clone()));
            bind_params.push(Box::new(pattern));
        }

        // Add WHERE clause if needed
        if !conditions.is_empty() {
            query.push_str(" WHERE ");
            query.push_str(&conditions.join(" AND "));
        }

        query.push_str(" ORDER BY a.name LIMIT ?");
        bind_params.push(Box::new(limit as i32));

        debug!("Query: {}", query);
        debug!("Params: {} bindings", bind_params.len());

        // Execute query
        let mut stmt = conn.prepare(&query)?;

        let param_refs: Vec<&dyn duckdb::ToSql> = bind_params.iter().map(|b| b.as_ref()).collect();

        let agents = stmt
            .query_map(param_refs.as_slice(), |row| {
                let capabilities_str: String = row.get(8)?;
                let fallbacks_str: String = row.get(9)?;

                let capabilities: Vec<String> = if capabilities_str.is_empty() {
                    Vec::new()
                } else {
                    capabilities_str.split(',').map(|s| s.to_string()).collect()
                };

                let fallbacks = if fallbacks_str.is_empty() {
                    None
                } else {
                    Some(fallbacks_str.split(',').map(|s| s.to_string()).collect())
                };

                Ok(AgentMetadata {
                    name: row.get(1)?,
                    description: row.get(2)?,
                    model: row.get(3)?,
                    plugin: row.get(4)?,
                    role: row.get(5)?,
                    use_when: row.get(6)?,
                    file_path: row.get(7)?,
                    capabilities,
                    fallbacks,
                })
            })?
            .collect::<Result<Vec<_>, _>>()?;

        debug!("Found {} agents", agents.len());
        Ok(agents)
    }

    /// Get database size in MB
    pub fn get_size_mb(&self) -> Result<f64> {
        let conn = self.conn.lock().unwrap();

        let mut stmt = conn.prepare(
            "SELECT SUM(estimated_size) / 1024.0 / 1024.0 FROM duckdb_tables()"
        )?;

        let size: Option<f64> = stmt.query_row([], |row| row.get(0))?;

        Ok(size.unwrap_or(0.0))
    }

    /// Record query pattern for learning
    pub fn record_pattern(&self, context_hash: &str, agents_used: &[String], success: bool) -> Result<()> {
        let conn = self.conn.lock().unwrap();

        let agents_json = serde_json::to_string(agents_used)?;

        conn.execute(
            r#"
            INSERT INTO query_patterns (context_hash, agents_used, success_count, failure_count)
            VALUES (?, ?, ?, ?)
            ON CONFLICT (context_hash) DO UPDATE SET
                success_count = success_count + ?,
                failure_count = failure_count + ?,
                last_used = CURRENT_TIMESTAMP
            "#,
            params![
                context_hash,
                &agents_json,
                if success { 1 } else { 0 },
                if !success { 1 } else { 0 },
                if success { 1 } else { 0 },
                if !success { 1 } else { 0 },
            ],
        )?;

        Ok(())
    }

    /// Get most successful patterns for a context
    pub fn get_patterns(&self, context_hash: &str) -> Result<Vec<(Vec<String>, f64)>> {
        let conn = self.conn.lock().unwrap();

        let mut stmt = conn.prepare(
            r#"
            SELECT
                agents_used,
                CAST(success_count AS DOUBLE) / CAST(success_count + failure_count AS DOUBLE) as success_rate
            FROM query_patterns
            WHERE context_hash = ?
            ORDER BY success_rate DESC, success_count DESC
            LIMIT 5
            "#,
        )?;

        let patterns = stmt
            .query_map(params![context_hash], |row| {
                let agents_json: String = row.get(0)?;
                let success_rate: f64 = row.get(1)?;

                let agents: Vec<String> = serde_json::from_str(&agents_json)
                    .unwrap_or_default();

                Ok((agents, success_rate))
            })?
            .collect::<Result<Vec<_>, _>>()?;

        Ok(patterns)
    }

    /// Get agent file path by name (for JIT definition loading)
    pub fn get_agent_file_path(&self, agent_name: &str) -> Result<std::path::PathBuf> {
        let conn = self.conn.lock().unwrap();

        let mut stmt = conn.prepare("SELECT file_path FROM agents WHERE name = ?")?;

        let file_path: String = stmt.query_row(params![agent_name], |row| row.get(0))?;

        Ok(std::path::PathBuf::from(file_path))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn test_database_creation() {
        let dir = tempdir().unwrap();
        let db_path = dir.path().join("test.duckdb");

        let db = Database::new(&db_path).unwrap();
        db.initialize_schema().unwrap();

        assert!(db_path.exists());
    }

    #[test]
    fn test_agent_indexing() {
        let dir = tempdir().unwrap();
        let db_path = dir.path().join("test.duckdb");

        let db = Database::new(&db_path).unwrap();
        db.initialize_schema().unwrap();

        let agents = vec![
            AgentMetadata {
                name: "test-agent".to_string(),
                description: "Test agent for React".to_string(),
                model: "haiku".to_string(),
                capabilities: vec!["react".to_string(), "typescript".to_string()],
                plugin: "test-plugin".to_string(),
                role: Some("frontend".to_string()),
                fallbacks: None,
                use_when: Some("building React apps".to_string()),
                file_path: "/path/to/agent.md".to_string(),
            },
        ];

        db.index_agents(&agents).unwrap();

        // Query by capability
        let query_params = AgentQueryParams {
            context: None,
            role: None,
            capability: Some("react".to_string()),
            limit: Some(10),
        };

        let results = db.query_agents(&query_params).unwrap();
        assert_eq!(results.len(), 1);
        assert_eq!(results[0].name, "test-agent");
    }
}
