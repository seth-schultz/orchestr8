use crate::db::{AsyncTask, TaskPriority};
use crate::{AsyncSystem, WorkflowStatus};
use anyhow::{Context, Result};
use mcp_server::{
    router::RouterService, ByteTransport, Router, Server as McpServer,
};
use serde_json::{json, Value};
use std::sync::Arc;
use tokio::io::{stdin, stdout};
use tracing::{info, error};
use uuid::Uuid;

/// MCP server implementation for orchestr8-async
pub struct Orchestr8McpServer {
    system: Arc<AsyncSystem>,
}

impl Orchestr8McpServer {
    pub fn new(system: Arc<AsyncSystem>) -> Self {
        Self { system }
    }

    /// Start the MCP server
    pub async fn start(self) -> Result<()> {
        info!("Starting orchestr8-async MCP server");

        let router = self.create_router();
        let service = RouterService::new(router);

        let transport = ByteTransport::new(stdin(), stdout());
        let server = McpServer::new(service);

        server
            .run(transport)
            .await
            .context("Failed to run MCP server")?;

        Ok(())
    }

    /// Create MCP router with all tools and resources
    fn create_router(&self) -> Router {
        let mut router = Router::new();

        // Register tools
        self.register_task_tools(&mut router);
        self.register_workflow_tools(&mut router);
        self.register_query_tools(&mut router);

        // Register resources
        self.register_resources(&mut router);

        router
    }

    fn register_task_tools(&self, router: &mut Router) {
        let system = Arc::clone(&self.system);

        // TaskAsync - Fire and forget task execution
        router.add_tool(
            "task_async",
            "Execute a task asynchronously (fire-and-forget). Returns immediately with task ID for later polling.",
            json!({
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Task name"
                    },
                    "agent_name": {
                        "type": "string",
                        "description": "Name of the agent to execute"
                    },
                    "agent_instructions": {
                        "type": "string",
                        "description": "Instructions for the agent"
                    },
                    "priority": {
                        "type": "string",
                        "enum": ["low", "normal", "high", "critical"],
                        "description": "Task priority (default: normal)"
                    },
                    "webhook_url": {
                        "type": "string",
                        "description": "Optional webhook URL to receive results"
                    },
                    "timeout_seconds": {
                        "type": "integer",
                        "description": "Optional timeout in seconds"
                    }
                },
                "required": ["name", "agent_name", "agent_instructions"]
            }),
            move |args: Value| {
                let system = Arc::clone(&system);
                Box::pin(async move {
                    let name = args["name"].as_str().context("Missing name")?;
                    let agent_name = args["agent_name"].as_str().context("Missing agent_name")?;
                    let agent_instructions = args["agent_instructions"].as_str().context("Missing agent_instructions")?;

                    let mut task = AsyncTask::new(
                        name.to_string(),
                        agent_name.to_string(),
                        agent_instructions.to_string(),
                    );

                    if let Some(priority_str) = args["priority"].as_str() {
                        task.priority = match priority_str {
                            "low" => TaskPriority::Low,
                            "high" => TaskPriority::High,
                            "critical" => TaskPriority::Critical,
                            _ => TaskPriority::Normal,
                        };
                    }

                    if let Some(webhook) = args["webhook_url"].as_str() {
                        task.webhook_url = Some(webhook.to_string());
                    }

                    if let Some(timeout) = args["timeout_seconds"].as_i64() {
                        task.timeout_seconds = Some(timeout as i32);
                    }

                    system.db.insert_task(&task)?;
                    system.queue.submit_task(task.id)?;

                    Ok(vec![json!({
                        "type": "text",
                        "text": format!("Task created: {}\nTask ID: {}\nStatus: pending\n\nUse task_status tool to check progress.", name, task.id)
                    })])
                })
            },
        );

        let system = Arc::clone(&self.system);

        // task_status - Get task status and results
        router.add_tool(
            "task_status",
            "Get the status and results of an async task",
            json!({
                "type": "object",
                "properties": {
                    "task_id": {
                        "type": "string",
                        "description": "UUID of the task"
                    }
                },
                "required": ["task_id"]
            }),
            move |args: Value| {
                let system = Arc::clone(&system);
                Box::pin(async move {
                    let task_id_str = args["task_id"].as_str().context("Missing task_id")?;
                    let task_id = Uuid::parse_str(task_id_str).context("Invalid task ID")?;

                    let task = system
                        .db
                        .get_task(task_id)?
                        .context("Task not found")?;

                    let logs = system.db.get_task_logs(task_id)?;

                    let mut output = format!(
                        "Task: {}\nStatus: {}\nCreated: {}\n",
                        task.name,
                        task.status.as_str(),
                        task.created_at
                    );

                    if let Some(started) = task.started_at {
                        output.push_str(&format!("Started: {}\n", started));
                    }

                    if let Some(completed) = task.completed_at {
                        output.push_str(&format!("Completed: {}\n", completed));
                    }

                    if let Some(result) = &task.result {
                        output.push_str(&format!("\nResult:\n{}\n", result));
                    }

                    if let Some(error) = &task.error {
                        output.push_str(&format!("\nError:\n{}\n", error));
                    }

                    if !logs.is_empty() {
                        output.push_str("\nLogs:\n");
                        for (timestamp, level, message) in logs {
                            output.push_str(&format!("[{}] {}: {}\n", timestamp, level, message));
                        }
                    }

                    Ok(vec![json!({
                        "type": "text",
                        "text": output
                    })])
                })
            },
        );

        let system = Arc::clone(&self.system);

        // task_cancel - Cancel a running task
        router.add_tool(
            "task_cancel",
            "Cancel a pending or running task",
            json!({
                "type": "object",
                "properties": {
                    "task_id": {
                        "type": "string",
                        "description": "UUID of the task to cancel"
                    }
                },
                "required": ["task_id"]
            }),
            move |args: Value| {
                let system = Arc::clone(&system);
                Box::pin(async move {
                    let task_id_str = args["task_id"].as_str().context("Missing task_id")?;
                    let task_id = Uuid::parse_str(task_id_str).context("Invalid task ID")?;

                    system.queue.cancel_task(task_id)?;

                    Ok(vec![json!({
                        "type": "text",
                        "text": format!("Task {} cancelled successfully", task_id)
                    })])
                })
            },
        );
    }

    fn register_workflow_tools(&self, router: &mut Router) {
        let system = Arc::clone(&self.system);

        // workflow_create - Create a new workflow
        router.add_tool(
            "workflow_create",
            "Create a new multi-phase workflow for complex orchestration",
            json!({
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "Workflow name"
                    },
                    "description": {
                        "type": "string",
                        "description": "Optional workflow description"
                    }
                },
                "required": ["name"]
            }),
            move |args: Value| {
                let system = Arc::clone(&system);
                Box::pin(async move {
                    let name = args["name"].as_str().context("Missing name")?;
                    let description = args["description"].as_str().map(|s| s.to_string());

                    let workflow_id = system
                        .executor
                        .create_workflow(name.to_string(), description)?;

                    Ok(vec![json!({
                        "type": "text",
                        "text": format!("Workflow created: {}\nWorkflow ID: {}\n\nUse workflow_add_phase to add phases, then workflow_add_task to add tasks.", name, workflow_id)
                    })])
                })
            },
        );

        let system = Arc::clone(&self.system);

        // workflow_add_phase - Add a phase to a workflow
        router.add_tool(
            "workflow_add_phase",
            "Add a phase to a workflow with optional dependencies on other phases",
            json!({
                "type": "object",
                "properties": {
                    "workflow_id": {
                        "type": "string",
                        "description": "UUID of the workflow"
                    },
                    "phase_id": {
                        "type": "string",
                        "description": "Unique identifier for this phase (e.g., 'design', 'implementation')"
                    },
                    "name": {
                        "type": "string",
                        "description": "Human-readable phase name"
                    },
                    "depends_on": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of phase IDs this phase depends on"
                    }
                },
                "required": ["workflow_id", "phase_id", "name"]
            }),
            move |args: Value| {
                let system = Arc::clone(&system);
                Box::pin(async move {
                    let workflow_id_str = args["workflow_id"].as_str().context("Missing workflow_id")?;
                    let workflow_id = Uuid::parse_str(workflow_id_str).context("Invalid workflow ID")?;
                    let phase_id = args["phase_id"].as_str().context("Missing phase_id")?;
                    let name = args["name"].as_str().context("Missing name")?;

                    let depends_on = if let Some(deps) = args["depends_on"].as_array() {
                        deps.iter()
                            .filter_map(|v| v.as_str().map(|s| s.to_string()))
                            .collect()
                    } else {
                        Vec::new()
                    };

                    system.executor.add_phase(
                        workflow_id,
                        phase_id.to_string(),
                        name.to_string(),
                        depends_on,
                    )?;

                    Ok(vec![json!({
                        "type": "text",
                        "text": format!("Phase '{}' added to workflow", name)
                    })])
                })
            },
        );

        let system = Arc::clone(&self.system);

        // workflow_add_task - Add a task to a workflow phase
        router.add_tool(
            "workflow_add_task",
            "Add a task to a specific workflow phase",
            json!({
                "type": "object",
                "properties": {
                    "workflow_id": {
                        "type": "string",
                        "description": "UUID of the workflow"
                    },
                    "phase_id": {
                        "type": "string",
                        "description": "Phase ID to add the task to"
                    },
                    "name": {
                        "type": "string",
                        "description": "Task name"
                    },
                    "agent_name": {
                        "type": "string",
                        "description": "Name of the agent to execute"
                    },
                    "agent_instructions": {
                        "type": "string",
                        "description": "Instructions for the agent"
                    },
                    "dependencies": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "List of task IDs this task depends on"
                    }
                },
                "required": ["workflow_id", "phase_id", "name", "agent_name", "agent_instructions"]
            }),
            move |args: Value| {
                let system = Arc::clone(&system);
                Box::pin(async move {
                    let workflow_id_str = args["workflow_id"].as_str().context("Missing workflow_id")?;
                    let workflow_id = Uuid::parse_str(workflow_id_str).context("Invalid workflow ID")?;
                    let phase_id = args["phase_id"].as_str().context("Missing phase_id")?;
                    let name = args["name"].as_str().context("Missing name")?;
                    let agent_name = args["agent_name"].as_str().context("Missing agent_name")?;
                    let agent_instructions = args["agent_instructions"].as_str().context("Missing agent_instructions")?;

                    let mut task = AsyncTask::new(
                        name.to_string(),
                        agent_name.to_string(),
                        agent_instructions.to_string(),
                    );

                    if let Some(deps) = args["dependencies"].as_array() {
                        task.dependencies = deps
                            .iter()
                            .filter_map(|v| v.as_str().and_then(|s| Uuid::parse_str(s).ok()))
                            .collect();
                    }

                    let task_id = system
                        .executor
                        .add_phase_task(workflow_id, phase_id.to_string(), task)?;

                    Ok(vec![json!({
                        "type": "text",
                        "text": format!("Task '{}' added to phase '{}'\nTask ID: {}", name, phase_id, task_id)
                    })])
                })
            },
        );

        let system = Arc::clone(&self.system);

        // workflow_start - Start a workflow
        router.add_tool(
            "workflow_start",
            "Start executing a workflow (all phases and tasks)",
            json!({
                "type": "object",
                "properties": {
                    "workflow_id": {
                        "type": "string",
                        "description": "UUID of the workflow to start"
                    }
                },
                "required": ["workflow_id"]
            }),
            move |args: Value| {
                let system = Arc::clone(&system);
                Box::pin(async move {
                    let workflow_id_str = args["workflow_id"].as_str().context("Missing workflow_id")?;
                    let workflow_id = Uuid::parse_str(workflow_id_str).context("Invalid workflow ID")?;

                    system.executor.start_workflow(workflow_id)?;

                    Ok(vec![json!({
                        "type": "text",
                        "text": format!("Workflow {} started\n\nUse workflow_status to check progress.", workflow_id)
                    })])
                })
            },
        );

        let system = Arc::clone(&self.system);

        // workflow_status - Get workflow status
        router.add_tool(
            "workflow_status",
            "Get the status of a workflow including all phases and tasks",
            json!({
                "type": "object",
                "properties": {
                    "workflow_id": {
                        "type": "string",
                        "description": "UUID of the workflow"
                    }
                },
                "required": ["workflow_id"]
            }),
            move |args: Value| {
                let system = Arc::clone(&system);
                Box::pin(async move {
                    let workflow_id_str = args["workflow_id"].as_str().context("Missing workflow_id")?;
                    let workflow_id = Uuid::parse_str(workflow_id_str).context("Invalid workflow ID")?;

                    let status: WorkflowStatus = system.executor.get_workflow_status(workflow_id)?;

                    let mut output = format!(
                        "Workflow: {}\nStatus: {}\nCreated: {}\n\n",
                        status.workflow.name,
                        status.workflow.status.as_str(),
                        status.workflow.created_at
                    );

                    output.push_str(&format!(
                        "Progress: {}/{} tasks completed\n",
                        status.completed_tasks, status.total_tasks
                    ));

                    if status.failed_tasks > 0 {
                        output.push_str(&format!("Failed: {} tasks\n", status.failed_tasks));
                    }

                    if status.running_tasks > 0 {
                        output.push_str(&format!("Running: {} tasks\n", status.running_tasks));
                    }

                    output.push_str("\nPhases:\n");
                    for phase in &status.phases {
                        output.push_str(&format!(
                            "  - {} ({}): {}\n",
                            phase.name,
                            phase.phase_id,
                            phase.status.as_str()
                        ));
                    }

                    Ok(vec![json!({
                        "type": "text",
                        "text": output
                    })])
                })
            },
        );
    }

    fn register_query_tools(&self, router: &mut Router) {
        let system = Arc::clone(&self.system);

        // list_tasks - List all tasks
        router.add_tool(
            "list_tasks",
            "List tasks with optional filtering",
            json!({
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "enum": ["pending", "running", "completed", "failed", "cancelled"],
                        "description": "Filter by task status"
                    },
                    "workflow_id": {
                        "type": "string",
                        "description": "Filter by workflow ID"
                    },
                    "limit": {
                        "type": "integer",
                        "description": "Maximum number of tasks to return (default: 10)"
                    }
                }
            }),
            move |args: Value| {
                let system = Arc::clone(&system);
                Box::pin(async move {
                    let limit = args["limit"].as_i64().unwrap_or(10) as usize;

                    let tasks = if let Some(workflow_id_str) = args["workflow_id"].as_str() {
                        let workflow_id = Uuid::parse_str(workflow_id_str).context("Invalid workflow ID")?;
                        system.db.get_workflow_tasks(workflow_id)?
                    } else {
                        system.db.get_pending_tasks(limit)?
                    };

                    let mut output = format!("Found {} tasks:\n\n", tasks.len());

                    for task in tasks.iter().take(limit) {
                        output.push_str(&format!(
                            "ID: {}\nName: {}\nStatus: {}\nAgent: {}\nCreated: {}\n\n",
                            task.id, task.name, task.status.as_str(), task.agent_name, task.created_at
                        ));
                    }

                    Ok(vec![json!({
                        "type": "text",
                        "text": output
                    })])
                })
            },
        );
    }

    fn register_resources(&self, _router: &mut Router) {
        // Resources can be added here for read-only access to data
        // For example: task definitions, workflow templates, etc.
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::init_system;

    #[tokio::test]
    async fn test_mcp_server_creation() {
        let db = crate::Database::in_memory().unwrap();
        let system = Arc::new(AsyncSystem {
            db: Arc::new(db),
            queue: Arc::new(crate::TaskQueue::new(
                Arc::new(crate::Database::in_memory().unwrap()),
                2,
            )),
            executor: Arc::new(crate::WorkflowExecutor::new(
                Arc::new(crate::Database::in_memory().unwrap()),
                Arc::new(crate::TaskQueue::new(
                    Arc::new(crate::Database::in_memory().unwrap()),
                    2,
                )),
            )),
            webhook_manager: Arc::new(
                crate::WebhookManager::with_defaults(Arc::new(
                    crate::Database::in_memory().unwrap(),
                ))
                .unwrap(),
            ),
        });

        let server = Orchestr8McpServer::new(system);
        let router = server.create_router();

        // Verify tools are registered
        assert!(router.has_tool("task_async"));
        assert!(router.has_tool("task_status"));
        assert!(router.has_tool("workflow_create"));
    }
}
