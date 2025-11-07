use anyhow::{Context, Result};
use orchestr8_async::{init_system, mcp::Orchestr8McpServer};
use std::env;
use std::path::PathBuf;
use std::sync::Arc;
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize logging
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .with_writer(std::io::stderr) // Write logs to stderr to not interfere with MCP protocol
        .finish();

    tracing::subscriber::set_global_default(subscriber)
        .context("Failed to set tracing subscriber")?;

    info!("Starting orchestr8-async server");

    // Get database path from environment or use default
    let db_path = env::var("ORCHESTR8_DB_PATH").unwrap_or_else(|_| {
        let mut path = PathBuf::from(env::var("HOME").expect("HOME not set"));
        path.push(".claude");
        path.push("plugins");
        path.push("orchestr8");
        path.push("orchestr8-async.duckdb");
        path.to_string_lossy().to_string()
    });

    info!("Using database: {}", db_path);

    // Get worker count from environment or use default
    let worker_count = env::var("ORCHESTR8_WORKERS")
        .ok()
        .and_then(|s| s.parse::<usize>().ok())
        .unwrap_or(4);

    info!("Worker count: {}", worker_count);

    // Initialize the async execution system
    let system = init_system(&db_path, worker_count)
        .await
        .context("Failed to initialize async system")?;

    info!("Async system initialized successfully");

    // Check if we should run in API mode or MCP mode
    let mode = env::var("ORCHESTR8_MODE").unwrap_or_else(|_| "mcp".to_string());

    match mode.as_str() {
        "api" => {
            // Run HTTP API server
            info!("Starting in API mode");
            run_api_server(system).await?;
        }
        "mcp" => {
            // Run MCP server
            info!("Starting in MCP mode");
            let mcp_server = Orchestr8McpServer::new(Arc::new(system));
            mcp_server.start().await?;
        }
        _ => {
            anyhow::bail!("Invalid mode: {}. Use 'mcp' or 'api'", mode);
        }
    }

    Ok(())
}

async fn run_api_server(system: orchestr8_async::AsyncSystem) -> Result<()> {
    use axum::Router;
    use orchestr8_async::api::create_router;
    use std::net::SocketAddr;

    let host = env::var("ORCHESTR8_HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port = env::var("ORCHESTR8_PORT")
        .ok()
        .and_then(|s| s.parse::<u16>().ok())
        .unwrap_or(3000);

    let addr = format!("{}:{}", host, port)
        .parse::<SocketAddr>()
        .context("Invalid address")?;

    info!("Starting API server on http://{}", addr);

    let app = create_router(system.api_state());

    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .context("Failed to bind to address")?;

    axum::serve(listener, app)
        .await
        .context("Failed to run server")?;

    Ok(())
}
