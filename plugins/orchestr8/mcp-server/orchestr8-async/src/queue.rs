use crate::db::{AsyncTask, Database, TaskPriority, TaskStatus, Workflow, WorkflowPhase};
use anyhow::{Context, Result};
use crossbeam::channel::{bounded, Receiver, Sender};
use std::sync::Arc;
use std::thread;
use std::time::Duration;
use tokio::sync::RwLock;
use tracing::{debug, error, info, warn};
use uuid::Uuid;

/// Task execution result
#[derive(Debug, Clone)]
pub struct TaskResult {
    pub task_id: Uuid,
    pub success: bool,
    pub result: Option<String>,
    pub error: Option<String>,
}

/// Background job queue manager
pub struct TaskQueue {
    db: Arc<Database>,
    tx: Sender<TaskCommand>,
    rx: Arc<RwLock<Receiver<TaskCommand>>>,
    worker_count: usize,
    result_tx: Sender<TaskResult>,
    result_rx: Arc<RwLock<Receiver<TaskResult>>>,
}

/// Commands for task queue management
#[derive(Debug)]
enum TaskCommand {
    Execute(Uuid),
    Cancel(Uuid),
    Retry(Uuid),
    Shutdown,
}

impl TaskQueue {
    /// Create a new task queue
    pub fn new(db: Arc<Database>, worker_count: usize) -> Self {
        let (tx, rx) = bounded::<TaskCommand>(1000);
        let (result_tx, result_rx) = bounded::<TaskResult>(1000);

        Self {
            db,
            tx,
            rx: Arc::new(RwLock::new(rx)),
            worker_count,
            result_tx,
            result_rx: Arc::new(RwLock::new(result_rx)),
        }
    }

    /// Start the background workers
    pub async fn start(&self) -> Result<()> {
        info!("Starting task queue with {} workers", self.worker_count);

        // Start worker threads
        for worker_id in 0..self.worker_count {
            let db = Arc::clone(&self.db);
            let rx = Arc::clone(&self.rx);
            let result_tx = self.result_tx.clone();

            tokio::spawn(async move {
                info!("Worker {} started", worker_id);

                loop {
                    let rx_guard = rx.read().await;
                    match rx_guard.recv_timeout(Duration::from_secs(1)) {
                        Ok(TaskCommand::Execute(task_id)) => {
                            drop(rx_guard); // Release lock before processing
                            Self::execute_task(worker_id, &db, task_id, &result_tx).await;
                        }
                        Ok(TaskCommand::Cancel(task_id)) => {
                            drop(rx_guard);
                            Self::cancel_task(&db, task_id).await;
                        }
                        Ok(TaskCommand::Retry(task_id)) => {
                            drop(rx_guard);
                            Self::retry_task(worker_id, &db, task_id, &result_tx).await;
                        }
                        Ok(TaskCommand::Shutdown) => {
                            drop(rx_guard);
                            info!("Worker {} shutting down", worker_id);
                            break;
                        }
                        Err(_) => {
                            // Timeout, check for new tasks
                            drop(rx_guard);
                        }
                    }
                }
            });
        }

        // Start task scheduler
        let db = Arc::clone(&self.db);
        let tx = self.tx.clone();

        tokio::spawn(async move {
            info!("Task scheduler started");

            loop {
                tokio::time::sleep(Duration::from_secs(5)).await;

                match Self::schedule_pending_tasks(&db, &tx).await {
                    Ok(count) => {
                        if count > 0 {
                            debug!("Scheduled {} pending tasks", count);
                        }
                    }
                    Err(e) => {
                        error!("Error scheduling tasks: {}", e);
                    }
                }
            }
        });

        // Start result processor
        let db = Arc::clone(&self.db);
        let result_rx = Arc::clone(&self.result_rx);

        tokio::spawn(async move {
            info!("Result processor started");

            loop {
                let rx_guard = result_rx.read().await;
                match rx_guard.recv_timeout(Duration::from_secs(1)) {
                    Ok(result) => {
                        drop(rx_guard);
                        if let Err(e) = Self::process_task_result(&db, result).await {
                            error!("Error processing result: {}", e);
                        }
                    }
                    Err(_) => {
                        drop(rx_guard);
                    }
                }
            }
        });

        Ok(())
    }

    /// Submit a task for execution
    pub fn submit_task(&self, task_id: Uuid) -> Result<()> {
        self.tx
            .send(TaskCommand::Execute(task_id))
            .context("Failed to submit task")?;
        Ok(())
    }

    /// Cancel a task
    pub fn cancel_task(&self, task_id: Uuid) -> Result<()> {
        self.tx
            .send(TaskCommand::Cancel(task_id))
            .context("Failed to cancel task")?;
        Ok(())
    }

    /// Retry a failed task
    pub fn retry_task(&self, task_id: Uuid) -> Result<()> {
        self.tx
            .send(TaskCommand::Retry(task_id))
            .context("Failed to retry task")?;
        Ok(())
    }

    /// Shutdown the queue
    pub fn shutdown(&self) -> Result<()> {
        for _ in 0..self.worker_count {
            self.tx
                .send(TaskCommand::Shutdown)
                .context("Failed to send shutdown signal")?;
        }
        Ok(())
    }

    // ===== Internal Methods =====

    async fn schedule_pending_tasks(db: &Database, tx: &Sender<TaskCommand>) -> Result<usize> {
        let pending_tasks = db.get_pending_tasks(100)?;
        let mut scheduled = 0;

        for task in pending_tasks {
            // Check if dependencies are met
            if db.are_dependencies_completed(&task)? {
                // Check if phase dependencies are met (if task is part of a workflow)
                if let (Some(workflow_id), Some(phase_id)) = (task.workflow_id, &task.phase_id) {
                    let phases = db.get_workflow_phases(workflow_id)?;
                    if let Some(phase) = phases.iter().find(|p| p.phase_id == *phase_id) {
                        if !db.are_phase_dependencies_completed(workflow_id, phase)? {
                            continue;
                        }
                    }
                }

                tx.send(TaskCommand::Execute(task.id))?;
                scheduled += 1;
            }
        }

        Ok(scheduled)
    }

    async fn execute_task(
        worker_id: usize,
        db: &Database,
        task_id: Uuid,
        result_tx: &Sender<TaskResult>,
    ) {
        info!("Worker {} executing task {}", worker_id, task_id);

        // Get task details
        let task = match db.get_task(task_id) {
            Ok(Some(task)) => task,
            Ok(None) => {
                error!("Task {} not found", task_id);
                return;
            }
            Err(e) => {
                error!("Error fetching task {}: {}", task_id, e);
                return;
            }
        };

        // Update status to running
        if let Err(e) = db.update_task_status(task_id, TaskStatus::Running) {
            error!("Error updating task status: {}", e);
            return;
        }

        if let Err(e) = db.add_task_log(task_id, "INFO", "Task started", None) {
            warn!("Error adding log: {}", e);
        }

        // Execute the task (this is where we'd integrate with Claude Code Task tool)
        // For now, simulate execution
        let result = Self::simulate_task_execution(&task).await;

        // Send result for processing
        if let Err(e) = result_tx.send(result) {
            error!("Error sending task result: {}", e);
        }
    }

    async fn simulate_task_execution(task: &AsyncTask) -> TaskResult {
        // TODO: Replace with actual Claude Code Task tool integration
        // This would involve:
        // 1. Reading agent definition from file
        // 2. Invoking Task tool with agent instructions
        // 3. Collecting result or error

        tokio::time::sleep(Duration::from_secs(2)).await;

        TaskResult {
            task_id: task.id,
            success: true,
            result: Some(format!("Simulated result for task: {}", task.name)),
            error: None,
        }
    }

    async fn cancel_task(db: &Database, task_id: Uuid) {
        info!("Cancelling task {}", task_id);

        if let Err(e) = db.update_task_status(task_id, TaskStatus::Cancelled) {
            error!("Error cancelling task: {}", e);
            return;
        }

        if let Err(e) = db.add_task_log(task_id, "INFO", "Task cancelled", None) {
            warn!("Error adding log: {}", e);
        }
    }

    async fn retry_task(
        worker_id: usize,
        db: &Database,
        task_id: Uuid,
        result_tx: &Sender<TaskResult>,
    ) {
        info!("Worker {} retrying task {}", worker_id, task_id);

        let task = match db.get_task(task_id) {
            Ok(Some(task)) => task,
            Ok(None) => {
                error!("Task {} not found", task_id);
                return;
            }
            Err(e) => {
                error!("Error fetching task {}: {}", task_id, e);
                return;
            }
        };

        if !task.can_retry() {
            warn!("Task {} cannot be retried", task_id);
            return;
        }

        // Reset status to pending
        if let Err(e) = db.update_task_status(task_id, TaskStatus::Pending) {
            error!("Error resetting task status: {}", e);
            return;
        }

        if let Err(e) = db.add_task_log(task_id, "INFO", "Task retry scheduled", None) {
            warn!("Error adding log: {}", e);
        }
    }

    async fn process_task_result(db: &Database, result: TaskResult) -> Result<()> {
        info!("Processing result for task {}", result.task_id);

        if result.success {
            if let Some(result_data) = result.result {
                db.update_task_result(result.task_id, result_data)?;
                db.add_task_log(result.task_id, "INFO", "Task completed successfully", None)?;
            }
        } else {
            if let Some(error) = result.error {
                db.update_task_error(result.task_id, error)?;
                db.add_task_log(result.task_id, "ERROR", "Task failed", None)?;
            }
        }

        // Check if we need to trigger webhook
        if let Some(task) = db.get_task(result.task_id)? {
            if let Some(webhook_url) = task.webhook_url {
                // Webhook will be handled by webhook module
                debug!("Task {} has webhook: {}", result.task_id, webhook_url);
            }

            // Check if workflow needs status update
            if let Some(workflow_id) = task.workflow_id {
                Self::update_workflow_status(db, workflow_id).await?;
            }
        }

        Ok(())
    }

    async fn update_workflow_status(db: &Database, workflow_id: Uuid) -> Result<()> {
        let tasks = db.get_workflow_tasks(workflow_id)?;

        let all_completed = tasks.iter().all(|t| t.status == TaskStatus::Completed);
        let any_failed = tasks.iter().any(|t| t.status == TaskStatus::Failed);
        let all_done = tasks.iter().all(|t| t.is_complete());

        if any_failed {
            db.update_workflow_status(workflow_id, TaskStatus::Failed)?;
        } else if all_completed {
            db.update_workflow_status(workflow_id, TaskStatus::Completed)?;
        } else if all_done {
            // Some cancelled, but none failed
            db.update_workflow_status(workflow_id, TaskStatus::Completed)?;
        }

        Ok(())
    }
}

/// Workflow executor for managing multi-phase workflows
pub struct WorkflowExecutor {
    db: Arc<Database>,
    queue: Arc<TaskQueue>,
}

impl WorkflowExecutor {
    pub fn new(db: Arc<Database>, queue: Arc<TaskQueue>) -> Self {
        Self { db, queue }
    }

    /// Create a new workflow
    pub fn create_workflow(&self, name: String, description: Option<String>) -> Result<Uuid> {
        let workflow = Workflow {
            id: Uuid::new_v4(),
            name,
            description,
            status: TaskStatus::Pending,
            created_at: chrono::Utc::now(),
            started_at: None,
            completed_at: None,
            metadata: None,
        };

        self.db.insert_workflow(&workflow)?;
        Ok(workflow.id)
    }

    /// Add a phase to a workflow
    pub fn add_phase(
        &self,
        workflow_id: Uuid,
        phase_id: String,
        name: String,
        depends_on: Vec<String>,
    ) -> Result<()> {
        let phase = WorkflowPhase {
            workflow_id,
            phase_id,
            name,
            depends_on,
            status: TaskStatus::Pending,
            created_at: chrono::Utc::now(),
            started_at: None,
            completed_at: None,
        };

        self.db.insert_phase(&phase)?;
        Ok(())
    }

    /// Add a task to a workflow phase
    pub fn add_phase_task(
        &self,
        workflow_id: Uuid,
        phase_id: String,
        task: AsyncTask,
    ) -> Result<Uuid> {
        let task = task.with_workflow(workflow_id).with_phase(phase_id);

        self.db.insert_task(&task)?;
        Ok(task.id)
    }

    /// Start a workflow
    pub fn start_workflow(&self, workflow_id: Uuid) -> Result<()> {
        self.db
            .update_workflow_status(workflow_id, TaskStatus::Running)?;

        // Get all tasks and submit those without dependencies
        let tasks = self.db.get_workflow_tasks(workflow_id)?;

        for task in tasks {
            if task.dependencies.is_empty() {
                if let (Some(phase_id), Some(wf_id)) = (&task.phase_id, task.workflow_id) {
                    let phases = self.db.get_workflow_phases(wf_id)?;
                    if let Some(phase) = phases.iter().find(|p| p.phase_id == *phase_id) {
                        if phase.depends_on.is_empty() {
                            self.queue.submit_task(task.id)?;
                        }
                    }
                } else {
                    self.queue.submit_task(task.id)?;
                }
            }
        }

        Ok(())
    }

    /// Get workflow status
    pub fn get_workflow_status(&self, workflow_id: Uuid) -> Result<WorkflowStatus> {
        let workflow = self
            .db
            .get_workflow(workflow_id)?
            .context("Workflow not found")?;
        let phases = self.db.get_workflow_phases(workflow_id)?;
        let tasks = self.db.get_workflow_tasks(workflow_id)?;

        let total_tasks = tasks.len();
        let completed_tasks = tasks
            .iter()
            .filter(|t| t.status == TaskStatus::Completed)
            .count();
        let failed_tasks = tasks
            .iter()
            .filter(|t| t.status == TaskStatus::Failed)
            .count();
        let running_tasks = tasks
            .iter()
            .filter(|t| t.status == TaskStatus::Running)
            .count();

        Ok(WorkflowStatus {
            workflow,
            phases,
            total_tasks,
            completed_tasks,
            failed_tasks,
            running_tasks,
        })
    }
}

/// Workflow status summary
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct WorkflowStatus {
    pub workflow: Workflow,
    pub phases: Vec<WorkflowPhase>,
    pub total_tasks: usize,
    pub completed_tasks: usize,
    pub failed_tasks: usize,
    pub running_tasks: usize,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_task_queue_creation() {
        let db = Arc::new(Database::in_memory().unwrap());
        let queue = TaskQueue::new(db, 2);
        assert!(queue.start().await.is_ok());
    }

    #[tokio::test]
    async fn test_workflow_creation() {
        let db = Arc::new(Database::in_memory().unwrap());
        let queue = Arc::new(TaskQueue::new(db.clone(), 2));
        let executor = WorkflowExecutor::new(db, queue);

        let workflow_id = executor
            .create_workflow("Test Workflow".to_string(), None)
            .unwrap();
        assert!(!workflow_id.is_nil());
    }
}
