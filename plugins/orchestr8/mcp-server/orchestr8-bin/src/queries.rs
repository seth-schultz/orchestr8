/*!
 * SQL query builders for different agent discovery patterns
 *
 * Supports three query patterns:
 * 1. Context-based: Full-text search on descriptions
 * 2. Role-based: Exact role matching with fallbacks
 * 3. Capability-based: Tag/capability matching
 */

/// Query builder for agent discovery
pub struct QueryBuilder {
    base_query: String,
    conditions: Vec<String>,
    order_by: String,
    limit: usize,
}

impl QueryBuilder {
    pub fn new() -> Self {
        Self {
            base_query: String::from(
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
                         FROM agent_fallbacks
                         WHERE agent_id = a.id
                         ORDER BY priority),
                        ''
                    ) as fallbacks_str
                FROM agents a
                "#,
            ),
            conditions: Vec::new(),
            order_by: String::from("a.name"),
            limit: 10,
        }
    }

    /// Add context-based search (full-text on description + use_when)
    pub fn with_context(mut self, context: &str) -> Self {
        let pattern = format!("%{}%", context.to_lowercase());

        // Search in description and use_when fields
        self.conditions.push(format!(
            "(LOWER(a.description) LIKE '{}' OR LOWER(a.use_when) LIKE '{}')",
            pattern, pattern
        ));

        self
    }

    /// Add role-based filter
    pub fn with_role(mut self, role: &str) -> Self {
        self.conditions.push(format!("a.role = '{}'", role));
        self
    }

    /// Add capability-based filter
    pub fn with_capability(mut self, capability: &str) -> Self {
        // Need to join with agent_capabilities table
        if !self.base_query.contains("agent_capabilities ac") {
            self.base_query
                .push_str(" LEFT JOIN agent_capabilities ac ON a.id = ac.agent_id");
        }

        let pattern = format!("%{}%", capability.to_lowercase());
        self.conditions
            .push(format!("LOWER(ac.capability) LIKE '{}'", pattern));

        self
    }

    /// Add plugin filter
    pub fn with_plugin(mut self, plugin: &str) -> Self {
        self.conditions.push(format!("a.plugin = '{}'", plugin));
        self
    }

    /// Add model filter
    pub fn with_model(mut self, model: &str) -> Self {
        self.conditions.push(format!("a.model = '{}'", model));
        self
    }

    /// Set custom ordering
    pub fn order_by(mut self, field: &str, desc: bool) -> Self {
        self.order_by = if desc {
            format!("a.{} DESC", field)
        } else {
            format!("a.{}", field)
        };
        self
    }

    /// Set result limit
    pub fn limit(mut self, limit: usize) -> Self {
        self.limit = limit;
        self
    }

    /// Build the final SQL query
    pub fn build(self) -> String {
        let mut query = self.base_query;

        // Add WHERE clause if conditions exist
        if !self.conditions.is_empty() {
            query.push_str(" WHERE ");
            query.push_str(&self.conditions.join(" AND "));
        }

        // Add ORDER BY
        query.push_str(&format!(" ORDER BY {}", self.order_by));

        // Add LIMIT
        query.push_str(&format!(" LIMIT {}", self.limit));

        query
    }
}

impl Default for QueryBuilder {
    fn default() -> Self {
        Self::new()
    }
}

/// Prebuilt query templates for common patterns
pub struct QueryTemplates;

impl QueryTemplates {
    /// Find agents for a specific task description
    pub fn for_task(task_description: &str) -> QueryBuilder {
        QueryBuilder::new()
            .with_context(task_description)
            .order_by("name", false)
            .limit(5)
    }

    /// Find agents by role with fallbacks
    pub fn by_role(role: &str) -> QueryBuilder {
        QueryBuilder::new()
            .with_role(role)
            .order_by("name", false)
            .limit(10)
    }

    /// Find agents by capability
    pub fn by_capability(capability: &str) -> QueryBuilder {
        QueryBuilder::new()
            .with_capability(capability)
            .order_by("name", false)
            .limit(10)
    }

    /// Find all agents for a specific plugin
    pub fn by_plugin(plugin: &str) -> QueryBuilder {
        QueryBuilder::new()
            .with_plugin(plugin)
            .order_by("name", false)
            .limit(100)
    }

    /// Find strategic orchestrators (sonnet model)
    pub fn orchestrators() -> QueryBuilder {
        QueryBuilder::new()
            .with_model("sonnet")
            .order_by("name", false)
            .limit(10)
    }

    /// Find tactical executors (haiku model)
    pub fn executors() -> QueryBuilder {
        QueryBuilder::new()
            .with_model("haiku")
            .order_by("name", false)
            .limit(50)
    }

    /// Smart query that combines multiple criteria
    pub fn smart_search(
        context: Option<&str>,
        role: Option<&str>,
        capability: Option<&str>,
    ) -> QueryBuilder {
        let mut builder = QueryBuilder::new();

        if let Some(ctx) = context {
            builder = builder.with_context(ctx);
        }

        if let Some(r) = role {
            builder = builder.with_role(r);
        }

        if let Some(cap) = capability {
            builder = builder.with_capability(cap);
        }

        builder.order_by("name", false).limit(10)
    }
}

/// Query optimizer - analyzes and suggests optimal query strategies
pub struct QueryOptimizer;

impl QueryOptimizer {
    /// Analyze query and suggest optimizations
    pub fn analyze(query: &str) -> QueryAnalysis {
        let has_context = query.contains("LIKE");
        let has_role = query.contains("a.role =");
        let has_capability = query.contains("ac.capability");
        let has_join = query.contains("JOIN");

        let complexity = if has_join { 3 } else if has_context { 2 } else { 1 };

        let estimated_ms = match complexity {
            1 => 0.1,  // Simple indexed lookup
            2 => 0.5,  // Full-text search
            3 => 1.0,  // Join with filtering
            _ => 2.0,
        };

        QueryAnalysis {
            complexity,
            estimated_ms,
            uses_indexes: has_role || has_capability,
            recommendations: vec![],
        }
    }

    /// Suggest indexes for common query patterns
    pub fn suggest_indexes() -> Vec<String> {
        vec![
            "CREATE INDEX IF NOT EXISTS idx_agents_description ON agents(description);"
                .to_string(),
            "CREATE INDEX IF NOT EXISTS idx_agents_model_role ON agents(model, role);"
                .to_string(),
            "CREATE INDEX IF NOT EXISTS idx_capabilities_lower ON agent_capabilities(LOWER(capability));"
                .to_string(),
        ]
    }
}

/// Query analysis result
#[derive(Debug)]
pub struct QueryAnalysis {
    pub complexity: u8,
    pub estimated_ms: f64,
    pub uses_indexes: bool,
    pub recommendations: Vec<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_query_builder_basic() {
        let query = QueryBuilder::new().build();
        assert!(query.contains("SELECT DISTINCT"));
        assert!(query.contains("FROM agents a"));
        assert!(query.contains("LIMIT 10"));
    }

    #[test]
    fn test_query_with_context() {
        let query = QueryBuilder::new().with_context("react").build();
        assert!(query.contains("LOWER(a.description) LIKE"));
        assert!(query.contains("%react%"));
    }

    #[test]
    fn test_query_with_role() {
        let query = QueryBuilder::new().with_role("frontend_developer").build();
        assert!(query.contains("a.role = 'frontend_developer'"));
    }

    #[test]
    fn test_query_with_capability() {
        let query = QueryBuilder::new().with_capability("typescript").build();
        assert!(query.contains("agent_capabilities ac"));
        assert!(query.contains("ac.capability"));
    }

    #[test]
    fn test_query_with_multiple_filters() {
        let query = QueryBuilder::new()
            .with_context("web development")
            .with_role("fullstack")
            .with_capability("api")
            .limit(5)
            .build();

        assert!(query.contains("LOWER(a.description) LIKE"));
        assert!(query.contains("a.role = 'fullstack'"));
        assert!(query.contains("ac.capability"));
        assert!(query.contains("LIMIT 5"));
    }

    #[test]
    fn test_template_for_task() {
        let query = QueryTemplates::for_task("build a React app").build();
        assert!(query.contains("%build a react app%"));
    }

    #[test]
    fn test_template_orchestrators() {
        let query = QueryTemplates::orchestrators().build();
        assert!(query.contains("a.model = 'sonnet'"));
    }

    #[test]
    fn test_template_smart_search() {
        let query = QueryTemplates::smart_search(
            Some("frontend"),
            Some("react_specialist"),
            Some("typescript"),
        )
        .build();

        assert!(query.contains("%frontend%"));
        assert!(query.contains("a.role = 'react_specialist'"));
        assert!(query.contains("ac.capability"));
    }

    #[test]
    fn test_query_optimizer_simple() {
        let query = "SELECT * FROM agents WHERE a.role = 'test'";
        let analysis = QueryOptimizer::analyze(query);
        assert_eq!(analysis.complexity, 1);
        assert!(analysis.estimated_ms < 1.0);
    }

    #[test]
    fn test_query_optimizer_complex() {
        let query = "SELECT * FROM agents a JOIN agent_capabilities ac WHERE ac.capability LIKE '%test%'";
        let analysis = QueryOptimizer::analyze(query);
        assert_eq!(analysis.complexity, 3);
        assert!(analysis.estimated_ms >= 1.0);
    }
}
