pub mod api;
pub mod db;
pub mod mcp;
pub mod queue;
pub mod webhook;

pub use db::{AsyncTask, Database, TaskPriority, TaskStatus, Workflow, WorkflowPhase};
pub use queue::{TaskQueue, WorkflowExecutor, WorkflowStatus};
pub use webhook::{WebhookConfig, WebhookManager, WebhookPayload};

use anyhow::Result;
use std::sync::Arc;

/// Initialize the async execution system
pub async fn init_system(db_path: &str, worker_count: usize) -> Result<AsyncSystem> {
    let db = Arc::new(Database::new(db_path)?);
    let queue = Arc::new(TaskQueue::new(db.clone(), worker_count));
    let executor = Arc::new(WorkflowExecutor::new(db.clone(), queue.clone()));
    let webhook_manager = Arc::new(WebhookManager::with_defaults(db.clone())?);

    // Start workers
    queue.start().await?;
    webhook_manager.start_worker().await?;

    Ok(AsyncSystem {
        db,
        queue,
        executor,
        webhook_manager,
    })
}

/// Complete async execution system
pub struct AsyncSystem {
    pub db: Arc<Database>,
    pub queue: Arc<TaskQueue>,
    pub executor: Arc<WorkflowExecutor>,
    pub webhook_manager: Arc<WebhookManager>,
}

impl AsyncSystem {
    /// Create API state for HTTP server
    pub fn api_state(&self) -> api::ApiState {
        api::ApiState {
            db: self.db.clone(),
            queue: self.queue.clone(),
            executor: self.executor.clone(),
            webhook_manager: self.webhook_manager.clone(),
        }
    }

    /// Shutdown the system
    pub fn shutdown(&self) -> Result<()> {
        self.queue.shutdown()?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_system_initialization() {
        let db = Database::in_memory().unwrap();
        let system = AsyncSystem {
            db: Arc::new(db),
            queue: Arc::new(TaskQueue::new(
                Arc::new(Database::in_memory().unwrap()),
                2,
            )),
            executor: Arc::new(WorkflowExecutor::new(
                Arc::new(Database::in_memory().unwrap()),
                Arc::new(TaskQueue::new(
                    Arc::new(Database::in_memory().unwrap()),
                    2,
                )),
            )),
            webhook_manager: Arc::new(
                WebhookManager::with_defaults(Arc::new(Database::in_memory().unwrap())).unwrap(),
            ),
        };

        assert!(system.db.get_conn().is_ok());
    }
}
