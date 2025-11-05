/*!
 * MCP (Model Context Protocol) JSON-RPC message types and handlers
 */

use anyhow::Result;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use tracing::{debug, error, info};

use crate::cache::QueryCache;
use crate::db::Database;
use crate::loader::{AgentDefinition, AgentLoader, AgentMetadata};
use std::num::NonZeroUsize;
use lru::LruCache;
use std::sync::Mutex;

/// JSON-RPC 2.0 Request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JsonRpcRequest {
    pub jsonrpc: String,
    pub method: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub params: Option<Value>,
    pub id: Value,
}

/// JSON-RPC 2.0 Response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JsonRpcResponse {
    pub jsonrpc: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub result: Option<Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<JsonRpcError>,
    pub id: Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JsonRpcError {
    pub code: i32,
    pub message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<Value>,
}

impl JsonRpcResponse {
    pub fn success(id: Value, result: Value) -> Self {
        Self {
            jsonrpc: "2.0".to_string(),
            result: Some(result),
            error: None,
            id,
        }
    }

    pub fn error(id: Value, code: i32, message: &str, data: Option<Value>) -> Self {
        Self {
            jsonrpc: "2.0".to_string(),
            result: None,
            error: Some(JsonRpcError {
                code,
                message: message.to_string(),
                data,
            }),
            id,
        }
    }
}

/// Agent query parameters
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentQueryParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub role: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub capability: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<usize>,
}

/// Agent query result
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentQueryResult {
    pub agents: Vec<AgentMetadata>,
    pub reasoning: String,
    pub confidence: f64,
    pub cache_hit: bool,
    pub query_time_ms: f64,
}

/// Health check response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HealthStatus {
    pub status: String,
    pub uptime_ms: u64,
    pub memory_mb: f64,
    pub cache: CacheStats,
    pub database: DatabaseStats,
    pub indexes: IndexStats,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CacheStats {
    pub hits: u64,
    pub misses: u64,
    pub hit_rate: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DatabaseStats {
    pub connected: bool,
    pub size_mb: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IndexStats {
    pub agents: usize,
    pub plugins: usize,
}

/// MCP Handler - processes JSON-RPC requests with JIT agent loading support
pub struct McpHandler {
    db: Database,
    cache: QueryCache,
    agents: Vec<AgentMetadata>,
    agent_dir: std::path::PathBuf,
    loader: AgentLoader,
    /// LRU cache for full agent definitions (loaded on-demand)
    definition_cache: std::sync::Arc<Mutex<LruCache<String, AgentDefinition>>>,
    start_time: std::time::Instant,
}

impl McpHandler {
    /// Create new handler with JIT agent loading support
    pub fn new(
        db: Database,
        cache: QueryCache,
        agents: Vec<AgentMetadata>,
        agent_dir: std::path::PathBuf,
        definition_cache_size: usize,
    ) -> Self {
        let cache_size = NonZeroUsize::new(definition_cache_size).unwrap_or(NonZeroUsize::new(20).unwrap());

        // Create loader for JIT definition fetching
        let root_dir = agent_dir.parent().unwrap_or_else(|| std::path::Path::new("/")).to_path_buf();
        let loader = AgentLoader::new(&root_dir, &agent_dir);

        Self {
            db,
            cache,
            agents,
            agent_dir,
            loader,
            definition_cache: std::sync::Arc::new(Mutex::new(LruCache::new(cache_size))),
            start_time: std::time::Instant::now(),
        }
    }

    pub async fn handle_request(&self, request: JsonRpcRequest) -> JsonRpcResponse {
        let start = std::time::Instant::now();

        debug!("Handling method: {}", request.method);

        let result = match request.method.as_str() {
            "initialize" => self.handle_initialize(request.params).await,
            "agents/query" => self.handle_agent_query(request.params).await,
            "agents/list" => self.handle_agent_list(request.params).await,
            "agents/get" => self.handle_agent_get(request.params).await,
            "agents/get_definition" => self.handle_agent_get_definition(request.params).await,
            "agents/discover_by_capability" => self.handle_discover_by_capability(request.params).await,
            "agents/discover_by_role" => self.handle_discover_by_role(request.params).await,
            "agents/discover" => self.handle_discover_agents(request.params).await,
            "health" => self.handle_health(request.params).await,
            "cache/stats" => self.handle_cache_stats(request.params).await,
            "cache/clear" => self.handle_cache_clear(request.params).await,
            method => {
                error!("Unknown method: {}", method);
                return JsonRpcResponse::error(
                    request.id,
                    -32601,
                    "Method not found",
                    Some(serde_json::json!({ "method": method })),
                );
            }
        };

        let duration = start.elapsed();
        debug!("Method {} completed in {:?}", request.method, duration);

        match result {
            Ok(value) => JsonRpcResponse::success(request.id, value),
            Err(e) => {
                error!("Error handling {}: {}", request.method, e);
                JsonRpcResponse::error(
                    request.id,
                    -32603,
                    "Internal error",
                    Some(serde_json::json!({ "error": e.to_string() })),
                )
            }
        }
    }

    async fn handle_initialize(&self, _params: Option<Value>) -> Result<Value> {
        info!("MCP server initialized");

        Ok(serde_json::json!({
            "protocolVersion": "2024-11-05",
            "serverInfo": {
                "name": "orchestr8-mcp-server",
                "version": env!("CARGO_PKG_VERSION"),
            },
            "capabilities": {
                "agents": {
                    "query": true,
                    "list": true,
                    "get": true,
                },
                "cache": {
                    "stats": true,
                    "clear": true,
                },
                "health": true,
            }
        }))
    }

    async fn handle_agent_query(&self, params: Option<Value>) -> Result<Value> {
        let query_params: AgentQueryParams = match params {
            Some(p) => serde_json::from_value(p)?,
            None => AgentQueryParams {
                context: None,
                role: None,
                capability: None,
                limit: Some(10),
            },
        };

        let start = std::time::Instant::now();

        // Check cache
        let cache_key = format!(
            "query:{}:{}:{}",
            query_params.context.as_deref().unwrap_or(""),
            query_params.role.as_deref().unwrap_or(""),
            query_params.capability.as_deref().unwrap_or("")
        );

        if let Some(cached) = self.cache.get(&cache_key) {
            debug!("Cache hit for query: {}", cache_key);
            return Ok(cached);
        }

        // Execute query
        let agents = self.db.query_agents(&query_params)?;
        let query_time_ms = start.elapsed().as_secs_f64() * 1000.0;

        let result = AgentQueryResult {
            agents,
            reasoning: self.generate_reasoning(&query_params),
            confidence: 0.95, // TODO: implement confidence scoring
            cache_hit: false,
            query_time_ms,
        };

        let result_json = serde_json::to_value(&result)?;

        // Cache result
        self.cache.put(cache_key, result_json.clone());

        Ok(result_json)
    }

    async fn handle_agent_list(&self, params: Option<Value>) -> Result<Value> {
        #[derive(Deserialize)]
        struct ListParams {
            #[serde(default)]
            plugin: Option<String>,
        }

        let list_params: ListParams = match params {
            Some(p) => serde_json::from_value(p)?,
            None => ListParams { plugin: None },
        };

        let agents: Vec<&AgentMetadata> = if let Some(plugin) = &list_params.plugin {
            self.agents
                .iter()
                .filter(|a| &a.plugin == plugin)
                .collect()
        } else {
            self.agents.iter().collect()
        };

        Ok(serde_json::json!({
            "agents": agents,
            "total": agents.len(),
        }))
    }

    async fn handle_agent_get(&self, params: Option<Value>) -> Result<Value> {
        #[derive(Deserialize)]
        struct GetParams {
            name: String,
        }

        let get_params: GetParams = serde_json::from_value(params.unwrap_or(Value::Null))?;

        let agent = self
            .agents
            .iter()
            .find(|a| a.name == get_params.name)
            .ok_or_else(|| anyhow::anyhow!("Agent not found: {}", get_params.name))?;

        Ok(serde_json::to_value(agent)?)
    }

    async fn handle_health(&self, _params: Option<Value>) -> Result<Value> {
        let uptime_ms = self.start_time.elapsed().as_millis() as u64;
        let memory_mb = get_memory_usage_mb();
        let cache_stats = self.cache.stats();

        let db_size_mb = self.db.get_size_mb()?;

        let health = HealthStatus {
            status: "healthy".to_string(),
            uptime_ms,
            memory_mb,
            cache: CacheStats {
                hits: cache_stats.hits,
                misses: cache_stats.misses,
                hit_rate: cache_stats.hit_rate(),
            },
            database: DatabaseStats {
                connected: true,
                size_mb: db_size_mb,
            },
            indexes: IndexStats {
                agents: self.agents.len(),
                plugins: self
                    .agents
                    .iter()
                    .map(|a| a.plugin.as_str())
                    .collect::<std::collections::HashSet<_>>()
                    .len(),
            },
        };

        Ok(serde_json::to_value(health)?)
    }

    async fn handle_cache_stats(&self, _params: Option<Value>) -> Result<Value> {
        let stats = self.cache.stats();
        Ok(serde_json::json!({
            "hits": stats.hits,
            "misses": stats.misses,
            "hit_rate": stats.hit_rate(),
            "size": stats.size,
        }))
    }

    async fn handle_cache_clear(&self, _params: Option<Value>) -> Result<Value> {
        self.cache.clear();
        info!("Cache cleared");
        Ok(serde_json::json!({ "cleared": true }))
    }

    /// Get full agent definition (JIT loaded with LRU caching)
    async fn handle_agent_get_definition(&self, params: Option<Value>) -> Result<Value> {
        #[derive(Deserialize)]
        struct DefParams {
            name: String,
        }

        let def_params: DefParams = serde_json::from_value(params.unwrap_or(Value::Null))?;

        // Check definition cache first
        {
            let mut cache = self.definition_cache.lock().unwrap();
            if let Some(def) = cache.get(&def_params.name) {
                debug!("Definition cache hit for: {}", def_params.name);
                return Ok(serde_json::to_value(def)?);
            }
        }

        // Get file path from database
        let file_path = self.db.get_agent_file_path(&def_params.name)?;

        // Load full definition via JIT
        let start = std::time::Instant::now();
        let definition = self.loader.get_agent_definition_jit(&file_path)?;
        let load_time = start.elapsed().as_secs_f64() * 1000.0;

        debug!("Loaded agent definition in {:.2}ms", load_time);

        // Cache the definition
        {
            let mut cache = self.definition_cache.lock().unwrap();
            cache.put(def_params.name.clone(), definition.clone());
        }

        Ok(serde_json::to_value(definition)?)
    }

    /// Discover agents by capability
    async fn handle_discover_by_capability(&self, params: Option<Value>) -> Result<Value> {
        #[derive(Deserialize)]
        struct CapabilityParams {
            capability: String,
            #[serde(default)]
            limit: Option<usize>,
        }

        let cap_params: CapabilityParams = serde_json::from_value(params.unwrap_or(Value::Null))?;

        let query_params = AgentQueryParams {
            context: None,
            role: None,
            capability: Some(cap_params.capability),
            limit: cap_params.limit.or(Some(10)),
        };

        let agents = self.db.query_agents(&query_params)?;

        Ok(serde_json::json!({
            "agents": agents,
            "total": agents.len(),
            "discovery_method": "capability",
        }))
    }

    /// Discover agents by role
    async fn handle_discover_by_role(&self, params: Option<Value>) -> Result<Value> {
        #[derive(Deserialize)]
        struct RoleParams {
            role: String,
            #[serde(default)]
            limit: Option<usize>,
        }

        let role_params: RoleParams = serde_json::from_value(params.unwrap_or(Value::Null))?;

        let query_params = AgentQueryParams {
            context: None,
            role: Some(role_params.role),
            capability: None,
            limit: role_params.limit.or(Some(10)),
        };

        let agents = self.db.query_agents(&query_params)?;

        Ok(serde_json::json!({
            "agents": agents,
            "total": agents.len(),
            "discovery_method": "role",
        }))
    }

    /// Discover agents with multiple criteria
    async fn handle_discover_agents(&self, params: Option<Value>) -> Result<Value> {
        #[derive(Deserialize)]
        struct DiscoverParams {
            #[serde(default)]
            query: Option<String>,
            #[serde(default)]
            capability: Option<String>,
            #[serde(default)]
            role: Option<String>,
            #[serde(default)]
            limit: Option<usize>,
        }

        let discover_params: DiscoverParams = serde_json::from_value(params.unwrap_or(Value::Null))?;

        let query_params = AgentQueryParams {
            context: discover_params.query,
            role: discover_params.role,
            capability: discover_params.capability,
            limit: discover_params.limit.or(Some(10)),
        };

        let agents = self.db.query_agents(&query_params)?;

        Ok(serde_json::json!({
            "agents": agents,
            "total": agents.len(),
            "discovery_method": "multi-criteria",
        }))
    }

    fn generate_reasoning(&self, params: &AgentQueryParams) -> String {
        let mut parts = Vec::new();

        if let Some(context) = &params.context {
            parts.push(format!("context matching '{}'", context));
        }
        if let Some(role) = &params.role {
            parts.push(format!("role '{}'", role));
        }
        if let Some(capability) = &params.capability {
            parts.push(format!("capability '{}'", capability));
        }

        if parts.is_empty() {
            "Listing all available agents".to_string()
        } else {
            format!("Found agents for: {}", parts.join(", "))
        }
    }
}

/// Get current process memory usage in MB
fn get_memory_usage_mb() -> f64 {
    #[cfg(target_os = "linux")]
    {
        use std::fs;
        if let Ok(status) = fs::read_to_string("/proc/self/status") {
            for line in status.lines() {
                if line.starts_with("VmRSS:") {
                    if let Some(kb) = line.split_whitespace().nth(1) {
                        if let Ok(kb_val) = kb.parse::<f64>() {
                            return kb_val / 1024.0;
                        }
                    }
                }
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        use std::process::Command;
        if let Ok(output) = Command::new("ps")
            .args(&["-o", "rss=", "-p", &std::process::id().to_string()])
            .output()
        {
            if let Ok(rss) = String::from_utf8(output.stdout) {
                if let Ok(kb) = rss.trim().parse::<f64>() {
                    return kb / 1024.0;
                }
            }
        }
    }

    0.0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_json_rpc_request_parse() {
        let json = r#"{"jsonrpc":"2.0","method":"agents/query","params":{"context":"react"},"id":1}"#;
        let req: JsonRpcRequest = serde_json::from_str(json).unwrap();
        assert_eq!(req.method, "agents/query");
    }

    #[test]
    fn test_json_rpc_response_success() {
        let resp = JsonRpcResponse::success(
            serde_json::json!(1),
            serde_json::json!({"result": "ok"}),
        );
        assert!(resp.error.is_none());
        assert!(resp.result.is_some());
    }

    #[test]
    fn test_json_rpc_response_error() {
        let resp = JsonRpcResponse::error(serde_json::json!(1), -32601, "Method not found", None);
        assert!(resp.result.is_none());
        assert!(resp.error.is_some());
    }
}
