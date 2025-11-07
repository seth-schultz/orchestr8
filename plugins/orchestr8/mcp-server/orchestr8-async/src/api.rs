use crate::db::{AsyncTask, Database, TaskPriority, TaskStatus};
use crate::queue::{TaskQueue, WorkflowExecutor, WorkflowStatus};
use crate::webhook::WebhookManager;
use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Json, Response},
    routing::{delete, get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tower_http::cors::CorsLayer;
use tracing::info;
use uuid::Uuid;

/// API server state
#[derive(Clone)]
pub struct ApiState {
    pub db: Arc<Database>,
    pub queue: Arc<TaskQueue>,
    pub executor: Arc<WorkflowExecutor>,
    pub webhook_manager: Arc<WebhookManager>,
}

/// API error response
#[derive(Debug, Serialize, Deserialize)]
pub struct ApiError {
    pub error: String,
    pub message: String,
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(self)).into_response()
    }
}

impl From<anyhow::Error> for ApiError {
    fn from(err: anyhow::Error) -> Self {
        ApiError {
            error: "internal_error".to_string(),
            message: err.to_string(),
        }
    }
}

/// Create API router
pub fn create_router(state: ApiState) -> Router {
    Router::new()
        // Task endpoints
        .route("/api/tasks", post(create_task))
        .route("/api/tasks/:id", get(get_task))
        .route("/api/tasks/:id", delete(cancel_task))
        .route("/api/tasks/:id/retry", post(retry_task))
        .route("/api/tasks/:id/logs", get(get_task_logs))
        .route("/api/tasks", get(list_tasks))
        // Workflow endpoints
        .route("/api/workflows", post(create_workflow))
        .route("/api/workflows/:id", get(get_workflow))
        .route("/api/workflows/:id/status", get(get_workflow_status))
        .route("/api/workflows/:id/start", post(start_workflow))
        .route("/api/workflows/:id/phases", post(add_workflow_phase))
        .route("/api/workflows/:id/tasks", post(add_workflow_task))
        .route("/api/workflows/:id/tasks", get(get_workflow_tasks))
        // Webhook endpoints
        .route("/api/webhooks/:task_id/history", get(get_webhook_history))
        // Health check
        .route("/health", get(health_check))
        .layer(CorsLayer::permissive())
        .with_state(state)
}

// ===== Task Endpoints =====

/// Request to create a new task
#[derive(Debug, Deserialize)]
pub struct CreateTaskRequest {
    pub name: String,
    pub description: Option<String>,
    pub agent_name: String,
    pub agent_instructions: String,
    pub priority: Option<String>,
    pub dependencies: Option<Vec<Uuid>>,
    pub webhook_url: Option<String>,
    pub timeout_seconds: Option<i32>,
    pub metadata: Option<serde_json::Value>,
}

/// Response for task creation
#[derive(Debug, Serialize)]
pub struct CreateTaskResponse {
    pub task_id: Uuid,
    pub status: String,
    pub message: String,
}

async fn create_task(
    State(state): State<ApiState>,
    Json(req): Json<CreateTaskRequest>,
) -> Result<Json<CreateTaskResponse>, ApiError> {
    info!("Creating task: {}", req.name);

    let mut task = AsyncTask::new(req.name, req.agent_name, req.agent_instructions);

    task.description = req.description;

    if let Some(priority_str) = req.priority {
        task.priority = match priority_str.as_str() {
            "low" => TaskPriority::Low,
            "normal" => TaskPriority::Normal,
            "high" => TaskPriority::High,
            "critical" => TaskPriority::Critical,
            _ => TaskPriority::Normal,
        };
    }

    if let Some(deps) = req.dependencies {
        task.dependencies = deps;
    }

    if let Some(webhook) = req.webhook_url {
        task.webhook_url = Some(webhook);
    }

    if let Some(timeout) = req.timeout_seconds {
        task.timeout_seconds = Some(timeout);
    }

    if let Some(metadata) = req.metadata {
        task.metadata = Some(metadata.to_string());
    }

    state.db.insert_task(&task)?;
    state.queue.submit_task(task.id)?;

    Ok(Json(CreateTaskResponse {
        task_id: task.id,
        status: task.status.as_str().to_string(),
        message: "Task created and queued for execution".to_string(),
    }))
}

/// Response for task details
#[derive(Debug, Serialize)]
pub struct TaskResponse {
    pub task: AsyncTask,
}

async fn get_task(
    State(state): State<ApiState>,
    Path(id): Path<Uuid>,
) -> Result<Json<TaskResponse>, ApiError> {
    let task = state
        .db
        .get_task(id)?
        .ok_or_else(|| anyhow::anyhow!("Task not found"))?;

    Ok(Json(TaskResponse { task }))
}

async fn cancel_task(
    State(state): State<ApiState>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    state.queue.cancel_task(id)?;

    Ok(Json(serde_json::json!({
        "success": true,
        "message": "Task cancelled"
    })))
}

async fn retry_task(
    State(state): State<ApiState>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    state.queue.retry_task(id)?;

    Ok(Json(serde_json::json!({
        "success": true,
        "message": "Task retry scheduled"
    })))
}

/// Query parameters for listing tasks
#[derive(Debug, Deserialize)]
pub struct ListTasksQuery {
    pub status: Option<String>,
    pub workflow_id: Option<Uuid>,
    pub limit: Option<usize>,
}

/// Response for listing tasks
#[derive(Debug, Serialize)]
pub struct ListTasksResponse {
    pub tasks: Vec<AsyncTask>,
    pub total: usize,
}

async fn list_tasks(
    State(state): State<ApiState>,
    Query(query): Query<ListTasksQuery>,
) -> Result<Json<ListTasksResponse>, ApiError> {
    let tasks = if let Some(workflow_id) = query.workflow_id {
        state.db.get_workflow_tasks(workflow_id)?
    } else if let Some(status_str) = query.status {
        if status_str == "pending" {
            state.db.get_pending_tasks(query.limit.unwrap_or(100))?
        } else {
            // For other statuses, we'd need to add more DB methods
            Vec::new()
        }
    } else {
        state.db.get_pending_tasks(query.limit.unwrap_or(100))?
    };

    let total = tasks.len();

    Ok(Json(ListTasksResponse { tasks, total }))
}

/// Response for task logs
#[derive(Debug, Serialize)]
pub struct TaskLogsResponse {
    pub task_id: Uuid,
    pub logs: Vec<LogEntry>,
}

#[derive(Debug, Serialize)]
pub struct LogEntry {
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub level: String,
    pub message: String,
}

async fn get_task_logs(
    State(state): State<ApiState>,
    Path(id): Path<Uuid>,
) -> Result<Json<TaskLogsResponse>, ApiError> {
    let logs = state.db.get_task_logs(id)?;

    let log_entries = logs
        .into_iter()
        .map(|(timestamp, level, message)| LogEntry {
            timestamp,
            level,
            message,
        })
        .collect();

    Ok(Json(TaskLogsResponse {
        task_id: id,
        logs: log_entries,
    }))
}

// ===== Workflow Endpoints =====

/// Request to create a workflow
#[derive(Debug, Deserialize)]
pub struct CreateWorkflowRequest {
    pub name: String,
    pub description: Option<String>,
}

/// Response for workflow creation
#[derive(Debug, Serialize)]
pub struct CreateWorkflowResponse {
    pub workflow_id: Uuid,
    pub status: String,
}

async fn create_workflow(
    State(state): State<ApiState>,
    Json(req): Json<CreateWorkflowRequest>,
) -> Result<Json<CreateWorkflowResponse>, ApiError> {
    info!("Creating workflow: {}", req.name);

    let workflow_id = state.executor.create_workflow(req.name, req.description)?;

    Ok(Json(CreateWorkflowResponse {
        workflow_id,
        status: "pending".to_string(),
    }))
}

async fn get_workflow(
    State(state): State<ApiState>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let workflow = state
        .db
        .get_workflow(id)?
        .ok_or_else(|| anyhow::anyhow!("Workflow not found"))?;

    Ok(Json(serde_json::json!({ "workflow": workflow })))
}

async fn get_workflow_status(
    State(state): State<ApiState>,
    Path(id): Path<Uuid>,
) -> Result<Json<WorkflowStatus>, ApiError> {
    let status = state.executor.get_workflow_status(id)?;
    Ok(Json(status))
}

async fn start_workflow(
    State(state): State<ApiState>,
    Path(id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    state.executor.start_workflow(id)?;

    Ok(Json(serde_json::json!({
        "success": true,
        "message": "Workflow started"
    })))
}

/// Request to add a workflow phase
#[derive(Debug, Deserialize)]
pub struct AddPhaseRequest {
    pub phase_id: String,
    pub name: String,
    pub depends_on: Vec<String>,
}

async fn add_workflow_phase(
    State(state): State<ApiState>,
    Path(workflow_id): Path<Uuid>,
    Json(req): Json<AddPhaseRequest>,
) -> Result<Json<serde_json::Value>, ApiError> {
    state
        .executor
        .add_phase(workflow_id, req.phase_id, req.name, req.depends_on)?;

    Ok(Json(serde_json::json!({
        "success": true,
        "message": "Phase added to workflow"
    })))
}

/// Request to add a task to a workflow
#[derive(Debug, Deserialize)]
pub struct AddWorkflowTaskRequest {
    pub phase_id: String,
    pub name: String,
    pub description: Option<String>,
    pub agent_name: String,
    pub agent_instructions: String,
    pub priority: Option<String>,
    pub dependencies: Option<Vec<Uuid>>,
    pub webhook_url: Option<String>,
}

async fn add_workflow_task(
    State(state): State<ApiState>,
    Path(workflow_id): Path<Uuid>,
    Json(req): Json<AddWorkflowTaskRequest>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let mut task = AsyncTask::new(req.name, req.agent_name, req.agent_instructions);

    task.description = req.description;

    if let Some(priority_str) = req.priority {
        task.priority = match priority_str.as_str() {
            "low" => TaskPriority::Low,
            "normal" => TaskPriority::Normal,
            "high" => TaskPriority::High,
            "critical" => TaskPriority::Critical,
            _ => TaskPriority::Normal,
        };
    }

    if let Some(deps) = req.dependencies {
        task.dependencies = deps;
    }

    if let Some(webhook) = req.webhook_url {
        task.webhook_url = Some(webhook);
    }

    let task_id = state
        .executor
        .add_phase_task(workflow_id, req.phase_id, task)?;

    Ok(Json(serde_json::json!({
        "success": true,
        "task_id": task_id,
        "message": "Task added to workflow"
    })))
}

async fn get_workflow_tasks(
    State(state): State<ApiState>,
    Path(workflow_id): Path<Uuid>,
) -> Result<Json<ListTasksResponse>, ApiError> {
    let tasks = state.db.get_workflow_tasks(workflow_id)?;
    let total = tasks.len();

    Ok(Json(ListTasksResponse { tasks, total }))
}

// ===== Webhook Endpoints =====

async fn get_webhook_history(
    State(state): State<ApiState>,
    Path(task_id): Path<Uuid>,
) -> Result<Json<serde_json::Value>, ApiError> {
    let history = state.webhook_manager.get_delivery_history(task_id)?;

    Ok(Json(serde_json::json!({
        "task_id": task_id,
        "deliveries": history
    })))
}

// ===== Health Check =====

async fn health_check() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "status": "healthy",
        "service": "orchestr8-async",
        "version": env!("CARGO_PKG_VERSION")
    }))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::webhook::WebhookConfig;
    use axum::http::Request;
    use tower::ServiceExt;

    async fn create_test_state() -> ApiState {
        let db = Arc::new(Database::in_memory().unwrap());
        let queue = Arc::new(TaskQueue::new(db.clone(), 2));
        let executor = Arc::new(WorkflowExecutor::new(db.clone(), queue.clone()));
        let webhook_manager = Arc::new(
            WebhookManager::new(db.clone(), WebhookConfig::default()).unwrap(),
        );

        ApiState {
            db,
            queue,
            executor,
            webhook_manager,
        }
    }

    #[tokio::test]
    async fn test_health_check() {
        let state = create_test_state().await;
        let app = create_router(state);

        let response = app
            .oneshot(
                Request::builder()
                    .uri("/health")
                    .body(axum::body::Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }
}
