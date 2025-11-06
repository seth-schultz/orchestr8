/*!
 * Orchestr8 MCP Server - Ultra-fast agent discovery via stdio
 *
 * Performance targets:
 * - Startup: <100ms
 * - Query latency: <1ms
 * - Memory usage: <100MB
 */

use anyhow::Result;
use clap::Parser;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt};
use tracing::{debug, error, info};

mod cache;
mod db;
mod loader;
mod mcp;
mod queries;

use cache::QueryCache;
use db::Database;
use loader::AgentLoader;
use mcp::{JsonRpcRequest, JsonRpcResponse, McpHandler};

/// Orchestr8 MCP Server - Agent discovery via stdio with JIT loading
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Project root directory (default: auto-detect from .claude directory)
    #[arg(short, long)]
    root: Option<PathBuf>,

    /// Agent directory for JIT loading (default: {root}/agents)
    /// Override with ORCHESTR8_AGENT_DIR environment variable
    #[arg(short, long, env = "ORCHESTR8_AGENT_DIR")]
    agent_dir: Option<PathBuf>,

    /// Data directory for DuckDB database
    #[arg(short, long, default_value = ".claude/mcp-server/data")]
    data_dir: PathBuf,

    /// Log level (trace, debug, info, warn, error)
    #[arg(short, long, default_value = "info", env = "ORCHESTR8_LOG_LEVEL")]
    log_level: String,

    /// Enable JSON logging for structured output
    #[arg(long)]
    json_logs: bool,

    /// Cache TTL in seconds
    #[arg(long, default_value = "300")]
    cache_ttl: u64,

    /// Maximum cache entries for metadata and definitions
    #[arg(long, default_value = "1000")]
    cache_size: usize,

    /// Maximum cached agent definitions (LRU, separate from query cache)
    #[arg(long, default_value = "20")]
    definition_cache_size: usize,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();

    // Initialize logging
    init_logging(&args)?;

    info!(
        "Starting Orchestr8 MCP Server v{} with JIT agent loading",
        env!("CARGO_PKG_VERSION")
    );

    // Find project root
    let root_dir = match args.root {
        Some(path) => path,
        None => detect_project_root()?,
    };

    info!("Project root: {}", root_dir.display());

    // Determine agent directory with fallback chain
    let agent_dir = match args.agent_dir {
        Some(path) => {
            // Explicit argument takes precedence
            if path.is_absolute() {
                path
            } else {
                root_dir.join(&path)
            }
        }
        None => {
            // Default to root/agents
            root_dir.join("agents")
        }
    };

    if !agent_dir.exists() {
        anyhow::bail!(
            "Agent directory not found: {}. Use --agent-dir or set ORCHESTR8_AGENT_DIR",
            agent_dir.display()
        );
    }

    info!("Agent directory: {}", agent_dir.display());

    // Initialize database
    let data_dir = root_dir.join(&args.data_dir);
    std::fs::create_dir_all(&data_dir)?;

    let db_path = data_dir.join("orchestr8.duckdb");
    info!("Database path: {}", db_path.display());

    let db = Database::new(&db_path)?;
    db.initialize_schema()?;

    // Load agent metadata (JIT - fast startup)
    let startup_start = std::time::Instant::now();
    info!("Loading agent metadata for JIT discovery...");
    let mut loader = AgentLoader::new(&root_dir, &agent_dir);
    let agents = loader.load_agent_metadata()?;
    let startup_duration = startup_start.elapsed();
    info!(
        "Loaded metadata for {} agents in {:.2}ms (JIT enabled)",
        agents.len(),
        startup_duration.as_secs_f64() * 1000.0
    );

    // Index agents in database (metadata only)
    db.index_agents(&agents)?;
    info!("Indexed agent metadata in DuckDB");

    // Initialize cache
    let cache = QueryCache::new(args.cache_size, args.cache_ttl);

    // Create handler with JIT support
    let handler = Arc::new(McpHandler::new(
        db,
        cache,
        agents,
        agent_dir.clone(),
        args.definition_cache_size,
    ));

    info!("MCP Server ready - listening on stdio (definition cache size: {})", args.definition_cache_size);

    // Stdio protocol loop
    run_stdio_loop(handler).await?;

    Ok(())
}

/// Initialize tracing/logging
fn init_logging(args: &Args) -> Result<()> {
    use tracing_subscriber::prelude::*;
    use tracing_subscriber::{fmt, EnvFilter};

    let filter = EnvFilter::try_from_default_env()
        .unwrap_or_else(|_| EnvFilter::new(&args.log_level));

    if args.json_logs {
        tracing_subscriber::registry()
            .with(filter)
            .with(fmt::layer().json())
            .init();
    } else {
        tracing_subscriber::registry()
            .with(filter)
            .with(fmt::layer().with_target(false).compact())
            .init();
    }

    Ok(())
}

/// Detect project root by finding .claude directory
fn detect_project_root() -> Result<PathBuf> {
    let cwd = std::env::current_dir()?;

    // Try current directory
    if cwd.join(".claude").exists() {
        return Ok(cwd);
    }

    // Try parent directories
    let mut current = cwd.as_path();
    while let Some(parent) = current.parent() {
        if parent.join(".claude").exists() {
            return Ok(parent.to_path_buf());
        }
        current = parent;
    }

    // Check if we're inside .claude/mcp-server
    if cwd.ends_with(".claude/mcp-server") || cwd.ends_with(".claude/mcp-server/orchestr8-bin") {
        if let Some(parent) = cwd.ancestors().find(|p| p.join(".claude").exists()) {
            return Ok(parent.to_path_buf());
        }
    }

    anyhow::bail!("Could not find project root with .claude directory. Use --root to specify.")
}

/// Run the stdio protocol loop
async fn run_stdio_loop(handler: Arc<McpHandler>) -> Result<()> {
    let stdin = tokio::io::stdin();
    let mut stdout = tokio::io::stdout();
    let mut reader = tokio::io::BufReader::new(stdin);
    let mut line = String::new();

    loop {
        line.clear();

        match reader.read_line(&mut line).await {
            Ok(0) => {
                // EOF reached
                debug!("EOF received, shutting down");
                break;
            }
            Ok(_) => {
                let trimmed = line.trim();
                if trimmed.is_empty() {
                    continue;
                }

                debug!("Received: {}", trimmed);

                // Parse JSON-RPC request
                match serde_json::from_str::<JsonRpcRequest>(trimmed) {
                    Ok(request) => {
                        let start = std::time::Instant::now();

                        // Handle request
                        let response = handler.handle_request(request).await;

                        let duration = start.elapsed();
                        debug!("Request handled in {:?}", duration);

                        // Send response
                        let response_json = serde_json::to_string(&response)?;
                        stdout.write_all(response_json.as_bytes()).await?;
                        stdout.write_all(b"\n").await?;
                        stdout.flush().await?;

                        debug!("Sent: {}", response_json);
                    }
                    Err(e) => {
                        error!("Failed to parse JSON-RPC request: {}", e);

                        // Send error response
                        let error_response = JsonRpcResponse::error(
                            serde_json::Value::Null,
                            -32700,
                            "Parse error",
                            Some(serde_json::json!({ "error": e.to_string() })),
                        );

                        let response_json = serde_json::to_string(&error_response)?;
                        stdout.write_all(response_json.as_bytes()).await?;
                        stdout.write_all(b"\n").await?;
                        stdout.flush().await?;
                    }
                }
            }
            Err(e) => {
                error!("Error reading from stdin: {}", e);
                break;
            }
        }
    }

    info!("Stdio loop terminated");
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_detect_project_root() {
        // Test will vary based on where it runs
        // Just ensure it doesn't panic
        let _ = detect_project_root();
    }
}
