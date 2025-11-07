use anyhow::{Context, Result};
use chrono::{DateTime, Utc};
use duckdb::{params, Connection, ToSql};
use r2d2::{Pool, PooledConnection};
use serde::{Deserialize, Serialize};
use std::path::Path;
use uuid::Uuid;

pub type DbPool = Pool<r2d2_duckdb::DuckdbConnectionManager>;
pub type DbConn = PooledConnection<r2d2_duckdb::DuckdbConnectionManager>;

/// Task status enum
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum TaskStatus {
    Pending,
    Running,
    Completed,
    Failed,
    Cancelled,
}

impl TaskStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            TaskStatus::Pending => "pending",
            TaskStatus::Running => "running",
            TaskStatus::Completed => "completed",
            TaskStatus::Failed => "failed",
            TaskStatus::Cancelled => "cancelled",
        }
    }

    pub fn from_str(s: &str) -> Option<Self> {
        match s {
            "pending" => Some(TaskStatus::Pending),
            "running" => Some(TaskStatus::Running),
            "completed" => Some(TaskStatus::Completed),
            "failed" => Some(TaskStatus::Failed),
            "cancelled" => Some(TaskStatus::Cancelled),
            _ => None,
        }
    }
}

impl ToSql for TaskStatus {
    fn to_sql(&self) -> duckdb::Result<duckdb::types::ToSqlOutput<'_>> {
        Ok(duckdb::types::ToSqlOutput::Borrowed(
            duckdb::types::ValueRef::Text(self.as_str().as_bytes()),
        ))
    }
}

/// Task priority levels
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, PartialOrd, Ord)]
#[serde(rename_all = "snake_case")]
pub enum TaskPriority {
    Low = 1,
    Normal = 5,
    High = 10,
    Critical = 20,
}

impl TaskPriority {
    pub fn as_i32(&self) -> i32 {
        *self as i32
    }

    pub fn from_i32(v: i32) -> Self {
        match v {
            1 => TaskPriority::Low,
            5 => TaskPriority::Normal,
            10 => TaskPriority::High,
            20 => TaskPriority::Critical,
            _ => TaskPriority::Normal,
        }
    }
}

/// Async task record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AsyncTask {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub workflow_id: Option<Uuid>,
    pub phase_id: Option<String>,
    pub agent_name: String,
    pub agent_instructions: String,
    pub status: TaskStatus,
    pub priority: TaskPriority,
    pub dependencies: Vec<Uuid>,
    pub created_at: DateTime<Utc>,
    pub started_at: Option<DateTime<Utc>>,
    pub completed_at: Option<DateTime<Utc>>,
    pub result: Option<String>,
    pub error: Option<String>,
    pub webhook_url: Option<String>,
    pub retry_count: i32,
    pub max_retries: i32,
    pub timeout_seconds: Option<i32>,
    pub metadata: Option<String>,
}

impl AsyncTask {
    pub fn new(
        name: String,
        agent_name: String,
        agent_instructions: String,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            name,
            description: None,
            workflow_id: None,
            phase_id: None,
            agent_name,
            agent_instructions,
            status: TaskStatus::Pending,
            priority: TaskPriority::Normal,
            dependencies: Vec::new(),
            created_at: Utc::now(),
            started_at: None,
            completed_at: None,
            result: None,
            error: None,
            webhook_url: None,
            retry_count: 0,
            max_retries: 3,
            timeout_seconds: None,
            metadata: None,
        }
    }

    pub fn with_workflow(mut self, workflow_id: Uuid) -> Self {
        self.workflow_id = Some(workflow_id);
        self
    }

    pub fn with_phase(mut self, phase_id: String) -> Self {
        self.phase_id = Some(phase_id);
        self
    }

    pub fn with_priority(mut self, priority: TaskPriority) -> Self {
        self.priority = priority;
        self
    }

    pub fn with_dependencies(mut self, dependencies: Vec<Uuid>) -> Self {
        self.dependencies = dependencies;
        self
    }

    pub fn with_webhook(mut self, webhook_url: String) -> Self {
        self.webhook_url = Some(webhook_url);
        self
    }

    pub fn with_timeout(mut self, seconds: i32) -> Self {
        self.timeout_seconds = Some(seconds);
        self
    }

    pub fn with_metadata(mut self, metadata: serde_json::Value) -> Self {
        self.metadata = Some(metadata.to_string());
        self
    }

    pub fn is_ready(&self) -> bool {
        self.status == TaskStatus::Pending
    }

    pub fn is_complete(&self) -> bool {
        matches!(
            self.status,
            TaskStatus::Completed | TaskStatus::Failed | TaskStatus::Cancelled
        )
    }

    pub fn can_retry(&self) -> bool {
        self.status == TaskStatus::Failed && self.retry_count < self.max_retries
    }
}

/// Workflow definition for coordinating multiple tasks
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Workflow {
    pub id: Uuid,
    pub name: String,
    pub description: Option<String>,
    pub status: TaskStatus,
    pub created_at: DateTime<Utc>,
    pub started_at: Option<DateTime<Utc>>,
    pub completed_at: Option<DateTime<Utc>>,
    pub metadata: Option<String>,
}

/// Phase definition for workflow stages
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkflowPhase {
    pub workflow_id: Uuid,
    pub phase_id: String,
    pub name: String,
    pub depends_on: Vec<String>,
    pub status: TaskStatus,
    pub created_at: DateTime<Utc>,
    pub started_at: Option<DateTime<Utc>>,
    pub completed_at: Option<DateTime<Utc>>,
}

/// Database manager for async task persistence
pub struct Database {
    pool: DbPool,
}

impl Database {
    /// Create a new database instance with connection pool
    pub fn new<P: AsRef<Path>>(db_path: P) -> Result<Self> {
        let manager = r2d2_duckdb::DuckdbConnectionManager::file(db_path.as_ref())
            .context("Failed to create connection manager")?;

        let pool = Pool::builder()
            .max_size(10)
            .build(manager)
            .context("Failed to create connection pool")?;

        let db = Self { pool };
        db.init_schema()?;
        Ok(db)
    }

    /// Create in-memory database for testing
    pub fn in_memory() -> Result<Self> {
        let manager = r2d2_duckdb::DuckdbConnectionManager::memory()
            .context("Failed to create in-memory connection manager")?;

        let pool = Pool::builder()
            .max_size(10)
            .build(manager)
            .context("Failed to create connection pool")?;

        let db = Self { pool };
        db.init_schema()?;
        Ok(db)
    }

    pub fn get_conn(&self) -> Result<DbConn> {
        self.pool.get().context("Failed to get database connection")
    }

    /// Initialize database schema
    fn init_schema(&self) -> Result<()> {
        let conn = self.get_conn()?;

        // Tasks table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS tasks (
                id VARCHAR PRIMARY KEY,
                name VARCHAR NOT NULL,
                description VARCHAR,
                workflow_id VARCHAR,
                phase_id VARCHAR,
                agent_name VARCHAR NOT NULL,
                agent_instructions TEXT NOT NULL,
                status VARCHAR NOT NULL,
                priority INTEGER NOT NULL DEFAULT 5,
                dependencies VARCHAR[], -- Array of task IDs
                created_at TIMESTAMP NOT NULL,
                started_at TIMESTAMP,
                completed_at TIMESTAMP,
                result TEXT,
                error TEXT,
                webhook_url VARCHAR,
                retry_count INTEGER NOT NULL DEFAULT 0,
                max_retries INTEGER NOT NULL DEFAULT 3,
                timeout_seconds INTEGER,
                metadata TEXT
            )",
            [],
        )?;

        // Workflows table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS workflows (
                id VARCHAR PRIMARY KEY,
                name VARCHAR NOT NULL,
                description VARCHAR,
                status VARCHAR NOT NULL,
                created_at TIMESTAMP NOT NULL,
                started_at TIMESTAMP,
                completed_at TIMESTAMP,
                metadata TEXT
            )",
            [],
        )?;

        // Workflow phases table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS workflow_phases (
                workflow_id VARCHAR NOT NULL,
                phase_id VARCHAR NOT NULL,
                name VARCHAR NOT NULL,
                depends_on VARCHAR[], -- Array of phase IDs
                status VARCHAR NOT NULL,
                created_at TIMESTAMP NOT NULL,
                started_at TIMESTAMP,
                completed_at TIMESTAMP,
                PRIMARY KEY (workflow_id, phase_id)
            )",
            [],
        )?;

        // Task execution log
        conn.execute(
            "CREATE TABLE IF NOT EXISTS task_logs (
                id INTEGER PRIMARY KEY,
                task_id VARCHAR NOT NULL,
                timestamp TIMESTAMP NOT NULL,
                level VARCHAR NOT NULL,
                message TEXT NOT NULL,
                metadata TEXT
            )",
            [],
        )?;

        // Webhook delivery log
        conn.execute(
            "CREATE TABLE IF NOT EXISTS webhook_deliveries (
                id INTEGER PRIMARY KEY,
                task_id VARCHAR NOT NULL,
                webhook_url VARCHAR NOT NULL,
                payload TEXT NOT NULL,
                status_code INTEGER,
                response TEXT,
                attempted_at TIMESTAMP NOT NULL,
                delivered_at TIMESTAMP
            )",
            [],
        )?;

        // Create indexes for performance
        conn.execute("CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)", [])?;
        conn.execute("CREATE INDEX IF NOT EXISTS idx_tasks_workflow ON tasks(workflow_id)", [])?;
        conn.execute("CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority DESC)", [])?;
        conn.execute("CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at)", [])?;
        conn.execute("CREATE INDEX IF NOT EXISTS idx_task_logs_task_id ON task_logs(task_id)", [])?;
        conn.execute("CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_task_id ON webhook_deliveries(task_id)", [])?;

        Ok(())
    }

    // ===== Task Operations =====

    /// Insert a new task
    pub fn insert_task(&self, task: &AsyncTask) -> Result<()> {
        let conn = self.get_conn()?;

        let dependencies_json = serde_json::to_string(&task.dependencies)?;

        conn.execute(
            "INSERT INTO tasks (
                id, name, description, workflow_id, phase_id, agent_name, agent_instructions,
                status, priority, dependencies, created_at, started_at, completed_at,
                result, error, webhook_url, retry_count, max_retries, timeout_seconds, metadata
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?::VARCHAR[], ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            params![
                task.id.to_string(),
                task.name,
                task.description,
                task.workflow_id.map(|id| id.to_string()),
                task.phase_id,
                task.agent_name,
                task.agent_instructions,
                task.status.as_str(),
                task.priority.as_i32(),
                dependencies_json,
                task.created_at,
                task.started_at,
                task.completed_at,
                task.result,
                task.error,
                task.webhook_url,
                task.retry_count,
                task.max_retries,
                task.timeout_seconds,
                task.metadata,
            ],
        )?;

        Ok(())
    }

    /// Get task by ID
    pub fn get_task(&self, id: Uuid) -> Result<Option<AsyncTask>> {
        let conn = self.get_conn()?;

        let mut stmt = conn.prepare(
            "SELECT id, name, description, workflow_id, phase_id, agent_name, agent_instructions,
                    status, priority, dependencies, created_at, started_at, completed_at,
                    result, error, webhook_url, retry_count, max_retries, timeout_seconds, metadata
             FROM tasks WHERE id = ?",
        )?;

        let mut rows = stmt.query(params![id.to_string()])?;

        if let Some(row) = rows.next()? {
            Ok(Some(self.row_to_task(row)?))
        } else {
            Ok(None)
        }
    }

    /// Update task status
    pub fn update_task_status(&self, id: Uuid, status: TaskStatus) -> Result<()> {
        let conn = self.get_conn()?;

        let now = Utc::now();
        match status {
            TaskStatus::Running => {
                conn.execute(
                    "UPDATE tasks SET status = ?, started_at = ? WHERE id = ?",
                    params![status.as_str(), now, id.to_string()],
                )?;
            }
            TaskStatus::Completed | TaskStatus::Failed | TaskStatus::Cancelled => {
                conn.execute(
                    "UPDATE tasks SET status = ?, completed_at = ? WHERE id = ?",
                    params![status.as_str(), now, id.to_string()],
                )?;
            }
            _ => {
                conn.execute(
                    "UPDATE tasks SET status = ? WHERE id = ?",
                    params![status.as_str(), id.to_string()],
                )?;
            }
        }

        Ok(())
    }

    /// Update task result
    pub fn update_task_result(&self, id: Uuid, result: String) -> Result<()> {
        let conn = self.get_conn()?;
        conn.execute(
            "UPDATE tasks SET result = ?, status = ?, completed_at = ? WHERE id = ?",
            params![result, TaskStatus::Completed.as_str(), Utc::now(), id.to_string()],
        )?;
        Ok(())
    }

    /// Update task error
    pub fn update_task_error(&self, id: Uuid, error: String) -> Result<()> {
        let conn = self.get_conn()?;
        conn.execute(
            "UPDATE tasks SET error = ?, status = ?, completed_at = ? WHERE id = ?",
            params![error, TaskStatus::Failed.as_str(), Utc::now(), id.to_string()],
        )?;
        Ok(())
    }

    /// Get pending tasks ordered by priority
    pub fn get_pending_tasks(&self, limit: usize) -> Result<Vec<AsyncTask>> {
        let conn = self.get_conn()?;

        let mut stmt = conn.prepare(
            "SELECT id, name, description, workflow_id, phase_id, agent_name, agent_instructions,
                    status, priority, dependencies, created_at, started_at, completed_at,
                    result, error, webhook_url, retry_count, max_retries, timeout_seconds, metadata
             FROM tasks
             WHERE status = 'pending'
             ORDER BY priority DESC, created_at ASC
             LIMIT ?",
        )?;

        let rows = stmt.query_map(params![limit as i64], |row| {
            Ok(self.row_to_task(row).unwrap())
        })?;

        let mut tasks = Vec::new();
        for task in rows {
            tasks.push(task?);
        }

        Ok(tasks)
    }

    /// Get tasks by workflow ID
    pub fn get_workflow_tasks(&self, workflow_id: Uuid) -> Result<Vec<AsyncTask>> {
        let conn = self.get_conn()?;

        let mut stmt = conn.prepare(
            "SELECT id, name, description, workflow_id, phase_id, agent_name, agent_instructions,
                    status, priority, dependencies, created_at, started_at, completed_at,
                    result, error, webhook_url, retry_count, max_retries, timeout_seconds, metadata
             FROM tasks
             WHERE workflow_id = ?
             ORDER BY created_at ASC",
        )?;

        let rows = stmt.query_map(params![workflow_id.to_string()], |row| {
            Ok(self.row_to_task(row).unwrap())
        })?;

        let mut tasks = Vec::new();
        for task in rows {
            tasks.push(task?);
        }

        Ok(tasks)
    }

    /// Get tasks by phase ID
    pub fn get_phase_tasks(&self, workflow_id: Uuid, phase_id: &str) -> Result<Vec<AsyncTask>> {
        let conn = self.get_conn()?;

        let mut stmt = conn.prepare(
            "SELECT id, name, description, workflow_id, phase_id, agent_name, agent_instructions,
                    status, priority, dependencies, created_at, started_at, completed_at,
                    result, error, webhook_url, retry_count, max_retries, timeout_seconds, metadata
             FROM tasks
             WHERE workflow_id = ? AND phase_id = ?
             ORDER BY created_at ASC",
        )?;

        let rows = stmt.query_map(params![workflow_id.to_string(), phase_id], |row| {
            Ok(self.row_to_task(row).unwrap())
        })?;

        let mut tasks = Vec::new();
        for task in rows {
            tasks.push(task?);
        }

        Ok(tasks)
    }

    /// Check if all task dependencies are completed
    pub fn are_dependencies_completed(&self, task: &AsyncTask) -> Result<bool> {
        if task.dependencies.is_empty() {
            return Ok(true);
        }

        let conn = self.get_conn()?;

        for dep_id in &task.dependencies {
            let mut stmt = conn.prepare("SELECT status FROM tasks WHERE id = ?")?;
            let mut rows = stmt.query(params![dep_id.to_string()])?;

            if let Some(row) = rows.next()? {
                let status_str: String = row.get(0)?;
                if let Some(status) = TaskStatus::from_str(&status_str) {
                    if status != TaskStatus::Completed {
                        return Ok(false);
                    }
                } else {
                    return Ok(false);
                }
            } else {
                return Ok(false);
            }
        }

        Ok(true)
    }

    // ===== Workflow Operations =====

    /// Insert a new workflow
    pub fn insert_workflow(&self, workflow: &Workflow) -> Result<()> {
        let conn = self.get_conn()?;

        conn.execute(
            "INSERT INTO workflows (id, name, description, status, created_at, started_at, completed_at, metadata)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            params![
                workflow.id.to_string(),
                workflow.name,
                workflow.description,
                workflow.status.as_str(),
                workflow.created_at,
                workflow.started_at,
                workflow.completed_at,
                workflow.metadata,
            ],
        )?;

        Ok(())
    }

    /// Get workflow by ID
    pub fn get_workflow(&self, id: Uuid) -> Result<Option<Workflow>> {
        let conn = self.get_conn()?;

        let mut stmt = conn.prepare(
            "SELECT id, name, description, status, created_at, started_at, completed_at, metadata
             FROM workflows WHERE id = ?",
        )?;

        let mut rows = stmt.query(params![id.to_string()])?;

        if let Some(row) = rows.next()? {
            Ok(Some(self.row_to_workflow(row)?))
        } else {
            Ok(None)
        }
    }

    /// Update workflow status
    pub fn update_workflow_status(&self, id: Uuid, status: TaskStatus) -> Result<()> {
        let conn = self.get_conn()?;

        let now = Utc::now();
        match status {
            TaskStatus::Running => {
                conn.execute(
                    "UPDATE workflows SET status = ?, started_at = ? WHERE id = ?",
                    params![status.as_str(), now, id.to_string()],
                )?;
            }
            TaskStatus::Completed | TaskStatus::Failed | TaskStatus::Cancelled => {
                conn.execute(
                    "UPDATE workflows SET status = ?, completed_at = ? WHERE id = ?",
                    params![status.as_str(), now, id.to_string()],
                )?;
            }
            _ => {
                conn.execute(
                    "UPDATE workflows SET status = ? WHERE id = ?",
                    params![status.as_str(), id.to_string()],
                )?;
            }
        }

        Ok(())
    }

    // ===== Phase Operations =====

    /// Insert a workflow phase
    pub fn insert_phase(&self, phase: &WorkflowPhase) -> Result<()> {
        let conn = self.get_conn()?;

        let depends_on_json = serde_json::to_string(&phase.depends_on)?;

        conn.execute(
            "INSERT INTO workflow_phases (workflow_id, phase_id, name, depends_on, status, created_at, started_at, completed_at)
             VALUES (?, ?, ?, ?::VARCHAR[], ?, ?, ?, ?)",
            params![
                phase.workflow_id.to_string(),
                phase.phase_id,
                phase.name,
                depends_on_json,
                phase.status.as_str(),
                phase.created_at,
                phase.started_at,
                phase.completed_at,
            ],
        )?;

        Ok(())
    }

    /// Get workflow phases
    pub fn get_workflow_phases(&self, workflow_id: Uuid) -> Result<Vec<WorkflowPhase>> {
        let conn = self.get_conn()?;

        let mut stmt = conn.prepare(
            "SELECT workflow_id, phase_id, name, depends_on, status, created_at, started_at, completed_at
             FROM workflow_phases
             WHERE workflow_id = ?
             ORDER BY created_at ASC",
        )?;

        let rows = stmt.query_map(params![workflow_id.to_string()], |row| {
            Ok(self.row_to_phase(row).unwrap())
        })?;

        let mut phases = Vec::new();
        for phase in rows {
            phases.push(phase?);
        }

        Ok(phases)
    }

    /// Update phase status
    pub fn update_phase_status(&self, workflow_id: Uuid, phase_id: &str, status: TaskStatus) -> Result<()> {
        let conn = self.get_conn()?;

        let now = Utc::now();
        match status {
            TaskStatus::Running => {
                conn.execute(
                    "UPDATE workflow_phases SET status = ?, started_at = ? WHERE workflow_id = ? AND phase_id = ?",
                    params![status.as_str(), now, workflow_id.to_string(), phase_id],
                )?;
            }
            TaskStatus::Completed | TaskStatus::Failed | TaskStatus::Cancelled => {
                conn.execute(
                    "UPDATE workflow_phases SET status = ?, completed_at = ? WHERE workflow_id = ? AND phase_id = ?",
                    params![status.as_str(), now, workflow_id.to_string(), phase_id],
                )?;
            }
            _ => {
                conn.execute(
                    "UPDATE workflow_phases SET status = ? WHERE workflow_id = ? AND phase_id = ?",
                    params![status.as_str(), workflow_id.to_string(), phase_id],
                )?;
            }
        }

        Ok(())
    }

    /// Check if all phase dependencies are completed
    pub fn are_phase_dependencies_completed(&self, workflow_id: Uuid, phase: &WorkflowPhase) -> Result<bool> {
        if phase.depends_on.is_empty() {
            return Ok(true);
        }

        let conn = self.get_conn()?;

        for dep_phase_id in &phase.depends_on {
            let mut stmt = conn.prepare("SELECT status FROM workflow_phases WHERE workflow_id = ? AND phase_id = ?")?;
            let mut rows = stmt.query(params![workflow_id.to_string(), dep_phase_id])?;

            if let Some(row) = rows.next()? {
                let status_str: String = row.get(0)?;
                if let Some(status) = TaskStatus::from_str(&status_str) {
                    if status != TaskStatus::Completed {
                        return Ok(false);
                    }
                } else {
                    return Ok(false);
                }
            } else {
                return Ok(false);
            }
        }

        Ok(true)
    }

    // ===== Logging Operations =====

    /// Add task log entry
    pub fn add_task_log(&self, task_id: Uuid, level: &str, message: &str, metadata: Option<serde_json::Value>) -> Result<()> {
        let conn = self.get_conn()?;

        conn.execute(
            "INSERT INTO task_logs (task_id, timestamp, level, message, metadata)
             VALUES (?, ?, ?, ?, ?)",
            params![
                task_id.to_string(),
                Utc::now(),
                level,
                message,
                metadata.map(|m| m.to_string()),
            ],
        )?;

        Ok(())
    }

    /// Get task logs
    pub fn get_task_logs(&self, task_id: Uuid) -> Result<Vec<(DateTime<Utc>, String, String)>> {
        let conn = self.get_conn()?;

        let mut stmt = conn.prepare(
            "SELECT timestamp, level, message FROM task_logs WHERE task_id = ? ORDER BY timestamp ASC",
        )?;

        let rows = stmt.query_map(params![task_id.to_string()], |row| {
            Ok((
                row.get(0)?,
                row.get(1)?,
                row.get(2)?,
            ))
        })?;

        let mut logs = Vec::new();
        for log in rows {
            logs.push(log?);
        }

        Ok(logs)
    }

    // ===== Helper Methods =====

    fn row_to_task(&self, row: &duckdb::Row) -> Result<AsyncTask> {
        let id_str: String = row.get(0)?;
        let workflow_id_str: Option<String> = row.get(3)?;
        let status_str: String = row.get(7)?;
        let priority_int: i32 = row.get(8)?;
        let dependencies_json: String = row.get(9)?;

        Ok(AsyncTask {
            id: Uuid::parse_str(&id_str)?,
            name: row.get(1)?,
            description: row.get(2)?,
            workflow_id: workflow_id_str.and_then(|s| Uuid::parse_str(&s).ok()),
            phase_id: row.get(4)?,
            agent_name: row.get(5)?,
            agent_instructions: row.get(6)?,
            status: TaskStatus::from_str(&status_str).unwrap_or(TaskStatus::Pending),
            priority: TaskPriority::from_i32(priority_int),
            dependencies: serde_json::from_str(&dependencies_json).unwrap_or_default(),
            created_at: row.get(10)?,
            started_at: row.get(11)?,
            completed_at: row.get(12)?,
            result: row.get(13)?,
            error: row.get(14)?,
            webhook_url: row.get(15)?,
            retry_count: row.get(16)?,
            max_retries: row.get(17)?,
            timeout_seconds: row.get(18)?,
            metadata: row.get(19)?,
        })
    }

    fn row_to_workflow(&self, row: &duckdb::Row) -> Result<Workflow> {
        let id_str: String = row.get(0)?;
        let status_str: String = row.get(3)?;

        Ok(Workflow {
            id: Uuid::parse_str(&id_str)?,
            name: row.get(1)?,
            description: row.get(2)?,
            status: TaskStatus::from_str(&status_str).unwrap_or(TaskStatus::Pending),
            created_at: row.get(4)?,
            started_at: row.get(5)?,
            completed_at: row.get(6)?,
            metadata: row.get(7)?,
        })
    }

    fn row_to_phase(&self, row: &duckdb::Row) -> Result<WorkflowPhase> {
        let workflow_id_str: String = row.get(0)?;
        let status_str: String = row.get(4)?;
        let depends_on_json: String = row.get(3)?;

        Ok(WorkflowPhase {
            workflow_id: Uuid::parse_str(&workflow_id_str)?,
            phase_id: row.get(1)?,
            name: row.get(2)?,
            depends_on: serde_json::from_str(&depends_on_json).unwrap_or_default(),
            status: TaskStatus::from_str(&status_str).unwrap_or(TaskStatus::Pending),
            created_at: row.get(5)?,
            started_at: row.get(6)?,
            completed_at: row.get(7)?,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_database_creation() {
        let db = Database::in_memory().unwrap();
        assert!(db.get_conn().is_ok());
    }

    #[test]
    fn test_task_crud() {
        let db = Database::in_memory().unwrap();

        let task = AsyncTask::new(
            "Test Task".to_string(),
            "test-agent".to_string(),
            "Do something".to_string(),
        );

        // Insert
        db.insert_task(&task).unwrap();

        // Get
        let retrieved = db.get_task(task.id).unwrap().unwrap();
        assert_eq!(retrieved.name, task.name);
        assert_eq!(retrieved.status, TaskStatus::Pending);

        // Update status
        db.update_task_status(task.id, TaskStatus::Running).unwrap();
        let updated = db.get_task(task.id).unwrap().unwrap();
        assert_eq!(updated.status, TaskStatus::Running);
        assert!(updated.started_at.is_some());
    }

    #[test]
    fn test_workflow_and_phases() {
        let db = Database::in_memory().unwrap();

        let workflow = Workflow {
            id: Uuid::new_v4(),
            name: "Test Workflow".to_string(),
            description: Some("Test".to_string()),
            status: TaskStatus::Pending,
            created_at: Utc::now(),
            started_at: None,
            completed_at: None,
            metadata: None,
        };

        db.insert_workflow(&workflow).unwrap();

        let phase = WorkflowPhase {
            workflow_id: workflow.id,
            phase_id: "phase1".to_string(),
            name: "Phase 1".to_string(),
            depends_on: vec![],
            status: TaskStatus::Pending,
            created_at: Utc::now(),
            started_at: None,
            completed_at: None,
        };

        db.insert_phase(&phase).unwrap();

        let phases = db.get_workflow_phases(workflow.id).unwrap();
        assert_eq!(phases.len(), 1);
        assert_eq!(phases[0].phase_id, "phase1");
    }
}
