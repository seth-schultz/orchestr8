use crate::db::{AsyncTask, Database};
use anyhow::{Context, Result};
use chrono::Utc;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use std::time::Duration;
use tokio::time::sleep;
use tracing::{debug, error, info, warn};
use uuid::Uuid;

/// Webhook payload for task completion
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WebhookPayload {
    pub task_id: Uuid,
    pub task_name: String,
    pub status: String,
    pub result: Option<String>,
    pub error: Option<String>,
    pub completed_at: Option<chrono::DateTime<Utc>>,
    pub metadata: Option<serde_json::Value>,
}

impl WebhookPayload {
    pub fn from_task(task: &AsyncTask) -> Self {
        Self {
            task_id: task.id,
            task_name: task.name.clone(),
            status: task.status.as_str().to_string(),
            result: task.result.clone(),
            error: task.error.clone(),
            completed_at: task.completed_at,
            metadata: task
                .metadata
                .as_ref()
                .and_then(|m| serde_json::from_str(m).ok()),
        }
    }
}

/// Webhook delivery configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WebhookConfig {
    pub max_retries: u32,
    pub retry_delay_seconds: u64,
    pub timeout_seconds: u64,
}

impl Default for WebhookConfig {
    fn default() -> Self {
        Self {
            max_retries: 3,
            retry_delay_seconds: 5,
            timeout_seconds: 30,
        }
    }
}

/// Webhook delivery manager
pub struct WebhookManager {
    db: Arc<Database>,
    client: Client,
    config: WebhookConfig,
}

impl WebhookManager {
    pub fn new(db: Arc<Database>, config: WebhookConfig) -> Result<Self> {
        let client = Client::builder()
            .timeout(Duration::from_secs(config.timeout_seconds))
            .build()
            .context("Failed to create HTTP client")?;

        Ok(Self { db, client, config })
    }

    pub fn with_defaults(db: Arc<Database>) -> Result<Self> {
        Self::new(db, WebhookConfig::default())
    }

    /// Deliver webhook for a completed task
    pub async fn deliver_webhook(&self, task_id: Uuid) -> Result<()> {
        let task = self
            .db
            .get_task(task_id)?
            .context("Task not found")?;

        if let Some(webhook_url) = &task.webhook_url {
            if task.is_complete() {
                info!("Delivering webhook for task {} to {}", task_id, webhook_url);

                let payload = WebhookPayload::from_task(&task);

                match self.send_webhook(webhook_url, &payload).await {
                    Ok(response) => {
                        info!(
                            "Webhook delivered successfully for task {}: status {}",
                            task_id, response.status
                        );
                        self.log_delivery(task_id, webhook_url, &payload, Some(response.status), Some(&response.body))
                            .await?;
                    }
                    Err(e) => {
                        error!("Failed to deliver webhook for task {}: {}", task_id, e);
                        self.log_delivery(task_id, webhook_url, &payload, None, Some(&e.to_string()))
                            .await?;

                        // Retry with exponential backoff
                        self.retry_webhook(task_id, webhook_url, &payload).await?;
                    }
                }
            }
        }

        Ok(())
    }

    /// Send webhook with retries
    async fn send_webhook(&self, url: &str, payload: &WebhookPayload) -> Result<WebhookResponse> {
        debug!("Sending webhook to {}", url);

        let response = self
            .client
            .post(url)
            .json(payload)
            .send()
            .await
            .context("Failed to send webhook")?;

        let status = response.status().as_u16();
        let body = response
            .text()
            .await
            .unwrap_or_else(|_| "Failed to read response".to_string());

        if status >= 200 && status < 300 {
            Ok(WebhookResponse { status, body })
        } else {
            Err(anyhow::anyhow!(
                "Webhook delivery failed with status {}: {}",
                status,
                body
            ))
        }
    }

    /// Retry webhook delivery with exponential backoff
    async fn retry_webhook(
        &self,
        task_id: Uuid,
        url: &str,
        payload: &WebhookPayload,
    ) -> Result<()> {
        for retry in 1..=self.config.max_retries {
            let delay = Duration::from_secs(self.config.retry_delay_seconds * retry as u64);
            warn!(
                "Retrying webhook for task {} (attempt {}/{}) after {:?}",
                task_id, retry, self.config.max_retries, delay
            );

            sleep(delay).await;

            match self.send_webhook(url, payload).await {
                Ok(response) => {
                    info!(
                        "Webhook retry succeeded for task {} on attempt {}",
                        task_id, retry
                    );
                    self.log_delivery(task_id, url, payload, Some(response.status), Some(&response.body))
                        .await?;
                    return Ok(());
                }
                Err(e) => {
                    error!(
                        "Webhook retry {} failed for task {}: {}",
                        retry, task_id, e
                    );
                    self.log_delivery(task_id, url, payload, None, Some(&e.to_string()))
                        .await?;
                }
            }
        }

        Err(anyhow::anyhow!(
            "Webhook delivery failed after {} retries",
            self.config.max_retries
        ))
    }

    /// Log webhook delivery attempt
    async fn log_delivery(
        &self,
        task_id: Uuid,
        url: &str,
        payload: &WebhookPayload,
        status_code: Option<u16>,
        response: Option<&str>,
    ) -> Result<()> {
        let conn = self.db.get_conn()?;

        conn.execute(
            "INSERT INTO webhook_deliveries (task_id, webhook_url, payload, status_code, response, attempted_at, delivered_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)",
            duckdb::params![
                task_id.to_string(),
                url,
                serde_json::to_string(payload)?,
                status_code.map(|s| s as i32),
                response,
                Utc::now(),
                status_code.map(|_| Utc::now()),
            ],
        )?;

        Ok(())
    }

    /// Get webhook delivery history for a task
    pub fn get_delivery_history(&self, task_id: Uuid) -> Result<Vec<WebhookDelivery>> {
        let conn = self.db.get_conn()?;

        let mut stmt = conn.prepare(
            "SELECT id, task_id, webhook_url, payload, status_code, response, attempted_at, delivered_at
             FROM webhook_deliveries
             WHERE task_id = ?
             ORDER BY attempted_at DESC",
        )?;

        let rows = stmt.query_map(duckdb::params![task_id.to_string()], |row| {
            let task_id_str: String = row.get(1)?;
            let status_code_opt: Option<i32> = row.get(4)?;

            Ok(WebhookDelivery {
                id: row.get(0)?,
                task_id: Uuid::parse_str(&task_id_str).unwrap(),
                webhook_url: row.get(2)?,
                payload: row.get(3)?,
                status_code: status_code_opt.map(|s| s as u16),
                response: row.get(5)?,
                attempted_at: row.get(6)?,
                delivered_at: row.get(7)?,
            })
        })?;

        let mut deliveries = Vec::new();
        for delivery in rows {
            deliveries.push(delivery?);
        }

        Ok(deliveries)
    }

    /// Start webhook delivery worker
    pub async fn start_worker(&self) -> Result<()> {
        info!("Starting webhook delivery worker");

        let db = Arc::clone(&self.db);
        let manager = Arc::new(Self::with_defaults(db)?);

        tokio::spawn(async move {
            loop {
                tokio::time::sleep(Duration::from_secs(10)).await;

                // Find completed tasks with webhooks that haven't been delivered
                match manager.find_pending_webhooks().await {
                    Ok(task_ids) => {
                        for task_id in task_ids {
                            if let Err(e) = manager.deliver_webhook(task_id).await {
                                error!("Error delivering webhook for task {}: {}", task_id, e);
                            }
                        }
                    }
                    Err(e) => {
                        error!("Error finding pending webhooks: {}", e);
                    }
                }
            }
        });

        Ok(())
    }

    /// Find tasks with pending webhook deliveries
    async fn find_pending_webhooks(&self) -> Result<Vec<Uuid>> {
        let conn = self.db.get_conn()?;

        let mut stmt = conn.prepare(
            "SELECT DISTINCT t.id
             FROM tasks t
             WHERE t.webhook_url IS NOT NULL
               AND t.status IN ('completed', 'failed')
               AND NOT EXISTS (
                   SELECT 1 FROM webhook_deliveries wd
                   WHERE wd.task_id = t.id
                     AND wd.status_code IS NOT NULL
                     AND wd.status_code >= 200
                     AND wd.status_code < 300
               )
             ORDER BY t.completed_at ASC
             LIMIT 100",
        )?;

        let rows = stmt.query_map([], |row| {
            let id_str: String = row.get(0)?;
            Ok(Uuid::parse_str(&id_str).unwrap())
        })?;

        let mut task_ids = Vec::new();
        for id in rows {
            task_ids.push(id?);
        }

        Ok(task_ids)
    }
}

/// Webhook delivery response
#[derive(Debug)]
struct WebhookResponse {
    status: u16,
    body: String,
}

/// Webhook delivery record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WebhookDelivery {
    pub id: i64,
    pub task_id: Uuid,
    pub webhook_url: String,
    pub payload: String,
    pub status_code: Option<u16>,
    pub response: Option<String>,
    pub attempted_at: chrono::DateTime<Utc>,
    pub delivered_at: Option<chrono::DateTime<Utc>>,
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::AsyncTask;

    #[test]
    fn test_webhook_payload_creation() {
        let task = AsyncTask::new(
            "Test Task".to_string(),
            "test-agent".to_string(),
            "Do something".to_string(),
        );

        let payload = WebhookPayload::from_task(&task);
        assert_eq!(payload.task_id, task.id);
        assert_eq!(payload.task_name, "Test Task");
    }

    #[tokio::test]
    async fn test_webhook_manager_creation() {
        let db = Arc::new(Database::in_memory().unwrap());
        let manager = WebhookManager::with_defaults(db);
        assert!(manager.is_ok());
    }
}
