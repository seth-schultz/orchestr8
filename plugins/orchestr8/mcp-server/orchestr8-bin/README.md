# Orchestr8 MCP Server (Rust)

**Ultra-fast Rust implementation of the Orchestr8 MCP stdio server for agent discovery using DuckDB.**

## Performance Targets

- 🚀 **Startup**: <100ms (cold start with 74 agents)
- ⚡ **Query latency**: <1ms (p95 with caching)
- 💾 **Memory usage**: <100MB (including DuckDB in-memory indexes)
- 📦 **Binary size**: ~5MB (stripped release build)

## Features

- **Stdio-based MCP protocol** - No network overhead, direct stdin/stdout communication
- **DuckDB in-memory database** - Blazing-fast SQL queries with full-text search
- **LRU caching** - Query results cached with configurable TTL
- **Three query patterns**:
  - **Context-based**: Full-text search on agent descriptions
  - **Role-based**: Exact role matching with fallback agents
  - **Capability-based**: Tag/capability matching
- **Cross-platform** - Linux, macOS (Intel + ARM), Windows
- **Zero-copy deserialization** - Optimized JSON parsing with serde
- **Comprehensive testing** - Unit tests, integration tests, benchmarks

## Architecture

```
┌─────────────────────────────────────────────────┐
│            stdio MCP Protocol Loop              │
│  (JSON-RPC 2.0 via stdin/stdout)               │
└──────────────────┬──────────────────────────────┘
                   │
        ┌──────────▼──────────┐
        │   McpHandler        │
        │  (Request Router)   │
        └──────────┬──────────┘
                   │
     ┌─────────────┼─────────────┐
     │             │             │
┌────▼────┐  ┌────▼────┐  ┌────▼────┐
│ Cache   │  │Database │  │ Loader  │
│ (LRU)   │  │(DuckDB) │  │ (YAML)  │
└─────────┘  └─────────┘  └─────────┘
     │             │             │
     └─────────────┴─────────────┘
                   │
          Query Results (JSON)
```

## Installation

### From Pre-built Binaries

Download the latest release for your platform:

```bash
# macOS ARM64 (M1/M2)
curl -LO https://github.com/seth-schultz/orchestr8/releases/latest/download/orchestr8-bin-aarch64-apple-darwin.tar.gz
tar -xzf orchestr8-bin-aarch64-apple-darwin.tar.gz
sudo mv orchestr8-bin /usr/local/bin/

# macOS x86_64 (Intel)
curl -LO https://github.com/seth-schultz/orchestr8/releases/latest/download/orchestr8-bin-x86_64-apple-darwin.tar.gz
tar -xzf orchestr8-bin-x86_64-apple-darwin.tar.gz
sudo mv orchestr8-bin /usr/local/bin/

# Linux x86_64
curl -LO https://github.com/seth-schultz/orchestr8/releases/latest/download/orchestr8-bin-x86_64-unknown-linux-gnu.tar.gz
tar -xzf orchestr8-bin-x86_64-unknown-linux-gnu.tar.gz
sudo mv orchestr8-bin /usr/local/bin/

# Linux ARM64
curl -LO https://github.com/seth-schultz/orchestr8/releases/latest/download/orchestr8-bin-aarch64-unknown-linux-gnu.tar.gz
tar -xzf orchestr8-bin-aarch64-unknown-linux-gnu.tar.gz
sudo mv orchestr8-bin /usr/local/bin/

# Windows x86_64
# Download orchestr8-bin-x86_64-pc-windows-msvc.zip
# Extract and add to PATH
```

### From Source

```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Clone repository
git clone https://github.com/seth-schultz/orchestr8.git
cd orchestr8/.claude/mcp-server/orchestr8-bin

# Build release binary
cargo build --release

# Install
sudo cp target/release/orchestr8-bin /usr/local/bin/
```

### Via Docker

```bash
# Pull image
docker pull ghcr.io/seth-schultz/orchestr8-bin:latest

# Run (mount your project directory)
docker run -i --rm \
  -v $(pwd):/data \
  ghcr.io/seth-schultz/orchestr8-bin:latest \
  --root /data
```

## Usage

### Basic Usage

The server auto-detects the project root by finding the `.claude` directory:

```bash
# Run from anywhere in your project
orchestr8-bin

# Or specify root directory explicitly
orchestr8-bin --root /path/to/project
```

### Command-Line Options

```
orchestr8-bin [OPTIONS]

OPTIONS:
  -r, --root <ROOT>            Project root directory (auto-detected if omitted)
  -d, --data-dir <DATA_DIR>    Data directory for DuckDB [default: .claude/mcp-server/data]
  -l, --log-level <LOG_LEVEL>  Log level: trace, debug, info, warn, error [default: info]
      --json-logs              Enable JSON structured logging
      --cache-ttl <SECONDS>    Cache TTL in seconds [default: 300]
      --cache-size <SIZE>      Max cache entries [default: 1000]
  -h, --help                   Print help
  -V, --version                Print version
```

### Environment Variables

```bash
export ORCHESTR8_LOG_LEVEL=debug  # Override log level
export RUST_LOG=debug             # Rust logging control
```

## MCP Protocol

The server implements JSON-RPC 2.0 over stdio. All requests/responses are newline-delimited JSON.

### Available Methods

#### `initialize`

Initialize the MCP server and get capabilities.

```bash
echo '{"jsonrpc":"2.0","method":"initialize","id":1}' | orchestr8-bin
```

Response:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "protocolVersion": "2024-11-05",
    "serverInfo": {
      "name": "orchestr8-mcp-server",
      "version": "1.0.0"
    },
    "capabilities": {
      "agents": {
        "query": true,
        "list": true,
        "get": true
      },
      "cache": {
        "stats": true,
        "clear": true
      },
      "health": true
    }
  },
  "id": 1
}
```

#### `agents/query`

Query agents by context, role, or capability.

```bash
# Query by context (full-text search)
echo '{"jsonrpc":"2.0","method":"agents/query","params":{"context":"React development"},"id":2}' | orchestr8-bin

# Query by role
echo '{"jsonrpc":"2.0","method":"agents/query","params":{"role":"frontend_developer"},"id":3}' | orchestr8-bin

# Query by capability
echo '{"jsonrpc":"2.0","method":"agents/query","params":{"capability":"typescript"},"id":4}' | orchestr8-bin

# Combined query
echo '{"jsonrpc":"2.0","method":"agents/query","params":{"context":"API","capability":"graphql","limit":5},"id":5}' | orchestr8-bin
```

Response:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "agents": [
      {
        "name": "react-specialist",
        "description": "Expert React developer...",
        "model": "haiku",
        "capabilities": ["react", "typescript", "hooks"],
        "plugin": "frontend-frameworks",
        "role": "frontend_developer",
        "file_path": "/path/to/agent.md"
      }
    ],
    "reasoning": "Found agents for: context matching 'React development'",
    "confidence": 0.95,
    "cache_hit": false,
    "query_time_ms": 0.42
  },
  "id": 2
}
```

#### `agents/list`

List all agents or filter by plugin.

```bash
# List all agents
echo '{"jsonrpc":"2.0","method":"agents/list","id":6}' | orchestr8-bin

# Filter by plugin
echo '{"jsonrpc":"2.0","method":"agents/list","params":{"plugin":"frontend-frameworks"},"id":7}' | orchestr8-bin
```

#### `agents/get`

Get a specific agent by name.

```bash
echo '{"jsonrpc":"2.0","method":"agents/get","params":{"name":"react-specialist"},"id":8}' | orchestr8-bin
```

#### `health`

Get server health status and metrics.

```bash
echo '{"jsonrpc":"2.0","method":"health","id":9}' | orchestr8-bin
```

Response:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "status": "healthy",
    "uptime_ms": 12345,
    "memory_mb": 42.3,
    "cache": {
      "hits": 150,
      "misses": 50,
      "hit_rate": 0.75
    },
    "database": {
      "connected": true,
      "size_mb": 2.5
    },
    "indexes": {
      "agents": 74,
      "plugins": 18
    }
  },
  "id": 9
}
```

#### `cache/stats`

Get cache statistics.

```bash
echo '{"jsonrpc":"2.0","method":"cache/stats","id":10}' | orchestr8-bin
```

#### `cache/clear`

Clear the query cache.

```bash
echo '{"jsonrpc":"2.0","method":"cache/clear","id":11}' | orchestr8-bin
```

## Development

### Prerequisites

- Rust 1.75+ (install via [rustup](https://rustup.rs/))
- DuckDB (bundled via `duckdb` crate)

### Build

```bash
# Debug build
cargo build

# Release build (optimized)
cargo build --release

# With all features
cargo build --release --features metrics
```

### Test

```bash
# Run all tests
cargo test

# Run tests with output
cargo test -- --nocapture

# Run specific test
cargo test test_agent_indexing

# Run with coverage
cargo install cargo-tarpaulin
cargo tarpaulin --out Html
```

### Benchmark

```bash
# Run all benchmarks
cargo bench

# Run specific benchmark
cargo bench query_by_role

# View HTML reports
open target/criterion/report/index.html
```

### Lint & Format

```bash
# Format code
cargo fmt

# Check formatting
cargo fmt -- --check

# Run clippy
cargo clippy -- -D warnings

# Check for common mistakes
cargo clippy --all-targets --all-features
```

## Performance Benchmarks

Measured on MacBook Pro M2 (16GB RAM) with 100 test agents:

| Operation              | Mean     | Notes                          |
|------------------------|----------|--------------------------------|
| Query by context       | 0.95 ms  | Full-text search ✅ <1ms       |
| Query by role          | 2.26 ms  | Exact role matching            |
| Query by capability    | 2.50 ms  | Tag/capability filtering       |
| Combined query         | 2.60 ms  | All filters applied            |
| Startup (74 agents)    | ~80 ms   | Load + index + cache init      |

**Real-world performance (74 agents)**:
- Context query: ~1-5ms depending on complexity
- Cache hit: <0.5ms
- Memory usage: 36-40 MB typical
- Binary size: 32 MB (stripped release)

## Project Structure

```
orchestr8-bin/
├── Cargo.toml              # Dependencies and build config
├── src/
│   ├── main.rs            # Entry point & stdio loop
│   ├── mcp.rs             # JSON-RPC protocol handlers
│   ├── db.rs              # DuckDB database & queries
│   ├── loader.rs          # YAML agent registry loader
│   ├── cache.rs           # LRU cache with TTL
│   └── queries.rs         # SQL query builders
├── benches/
│   └── query_benchmark.rs # Performance benchmarks
├── .github/workflows/
│   └── release.yml        # CI/CD for cross-platform builds
├── Dockerfile             # Container image
└── README.md              # This file
```

## Database Schema

```sql
-- Agents table
CREATE TABLE agents (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    description TEXT NOT NULL,
    model VARCHAR NOT NULL,
    plugin VARCHAR NOT NULL,
    role VARCHAR,
    use_when TEXT,
    file_path VARCHAR NOT NULL
);

-- Capabilities (many-to-many)
CREATE TABLE agent_capabilities (
    agent_id INTEGER NOT NULL,
    capability VARCHAR NOT NULL,
    PRIMARY KEY (agent_id, capability)
);

-- Fallbacks (many-to-many with priority)
CREATE TABLE agent_fallbacks (
    agent_id INTEGER NOT NULL,
    fallback_agent VARCHAR NOT NULL,
    priority INTEGER NOT NULL,
    PRIMARY KEY (agent_id, fallback_agent)
);

-- Query patterns (for learning)
CREATE TABLE query_patterns (
    id INTEGER PRIMARY KEY,
    context_hash VARCHAR NOT NULL UNIQUE,
    agents_used TEXT NOT NULL,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0
);
```

## Troubleshooting

### "Could not find project root"

The server looks for a `.claude` directory. Either:
- Run from your project directory
- Use `--root /path/to/project` to specify the location

### "Database locked"

Only one instance can access the database at a time. Stop other instances:

```bash
# Find running instances
ps aux | grep orchestr8-bin

# Kill process
kill <PID>
```

### Memory usage too high

Reduce cache size:

```bash
orchestr8-bin --cache-size 100 --cache-ttl 60
```

### Slow queries

Check database size and consider rebuilding:

```bash
rm -rf .claude/mcp-server/data/orchestr8.duckdb
orchestr8-bin  # Will rebuild on startup
```

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Run `cargo fmt` and `cargo clippy`
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Related Projects

- [Orchestr8 Main System](../../..) - Full orchestration system
- [TypeScript MCP Server](../README.md) - Original TypeScript implementation
- [DuckDB](https://duckdb.org/) - In-memory analytical database

## Support

- GitHub Issues: https://github.com/seth-schultz/orchestr8/issues
- Documentation: https://github.com/seth-schultz/orchestr8/tree/main/.claude
- Email: orchestr8@sethschultz.com
