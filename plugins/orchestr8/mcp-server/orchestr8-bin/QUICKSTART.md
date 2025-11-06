# Orchestr8 MCP Server - Quick Start Guide

Get up and running with the Rust MCP server in 5 minutes.

## Prerequisites

- Rust 1.75+ (install from [rustup.rs](https://rustup.rs))
- Git

## 1. Build the Server

```bash
# Clone repository (if not already cloned)
cd orchestr8/.claude/mcp-server/orchestr8-bin

# Build release binary
cargo build --release

# Binary is at: target/release/orchestr8-bin
```

Build time: ~2 minutes on first build (downloads dependencies)

## 2. Test Basic Functionality

```bash
# Test startup (from project root or any subdirectory)
./target/release/orchestr8-bin &
SERVER_PID=$!
sleep 1

# Send initialize request
echo '{"jsonrpc":"2.0","method":"initialize","id":1}' | ./target/release/orchestr8-bin

# Kill server
kill $SERVER_PID
```

Expected output:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "protocolVersion": "2024-11-05",
    "serverInfo": {
      "name": "orchestr8-mcp-server",
      "version": "1.0.0"
    },
    "capabilities": { ... }
  },
  "id": 1
}
```

## 3. Run Demo Script

```bash
# Make scripts executable
chmod +x examples/*.sh

# Run interactive demo
./examples/query_agents.sh
```

This will:
- Initialize the server
- Check health
- Query agents by context, role, capability
- Show cache statistics

## 4. Install Globally (Optional)

```bash
# Install to /usr/local/bin
sudo cp target/release/orchestr8-bin /usr/local/bin/

# Now run from anywhere
cd ~/my-project
orchestr8-bin
```

## 5. Common Queries

### Query by Context
```bash
echo '{"jsonrpc":"2.0","method":"agents/query","params":{"context":"React development"},"id":1}' \
  | orchestr8-bin
```

### Query by Role
```bash
echo '{"jsonrpc":"2.0","method":"agents/query","params":{"role":"frontend_developer"},"id":2}' \
  | orchestr8-bin
```

### Query by Capability
```bash
echo '{"jsonrpc":"2.0","method":"agents/query","params":{"capability":"typescript"},"id":3}' \
  | orchestr8-bin
```

### List All Agents
```bash
echo '{"jsonrpc":"2.0","method":"agents/list","id":4}' | orchestr8-bin
```

### Health Check
```bash
echo '{"jsonrpc":"2.0","method":"health","id":5}' | orchestr8-bin
```

## 6. Performance Benchmark

```bash
# Run benchmark script
./examples/benchmark.sh
```

Expected results:
- Health check: ~0.01ms per query
- Query by role: ~0.08ms per query
- Query by capability: ~0.15ms per query
- Query by context: ~0.35ms per query
- Memory usage: ~40MB

## Troubleshooting

### "Could not find project root"

The server auto-detects by finding `.claude` directory. Either:
```bash
# Option 1: Run from project directory
cd /path/to/project
orchestr8-bin

# Option 2: Specify root explicitly
orchestr8-bin --root /path/to/project
```

### Build Errors

```bash
# Update Rust
rustup update

# Clean and rebuild
cargo clean
cargo build --release
```

### Missing Dependencies

All dependencies are bundled except system libraries. On Linux:
```bash
# Ubuntu/Debian
sudo apt-get install pkg-config libssl-dev

# Fedora/CentOS
sudo dnf install pkgconfig openssl-devel
```

## Development Setup

### Run Tests
```bash
cargo test
```

### Run Benchmarks
```bash
cargo bench
```

### Format Code
```bash
cargo fmt
```

### Lint Code
```bash
cargo clippy
```

## Docker Setup

### Build Image
```bash
docker build -t orchestr8-bin .
```

### Run Container
```bash
# Mount project directory
docker run -i --rm \
  -v $(pwd):/data \
  orchestr8-bin \
  --root /data
```

### Test in Docker
```bash
echo '{"jsonrpc":"2.0","method":"health","id":1}' | \
  docker run -i --rm -v $(pwd):/data orchestr8-bin --root /data
```

## Integration with Claude Code

The server is designed to integrate with Claude Code via the MCP protocol:

1. **Start server** in background
2. **Connect Claude** to stdio streams
3. **Query agents** via JSON-RPC
4. **Receive results** for context loading

Example integration (pseudocode):
```typescript
const server = spawn('orchestr8-bin');
const query = {
  jsonrpc: '2.0',
  method: 'agents/query',
  params: { context: 'React hooks' },
  id: 1
};
server.stdin.write(JSON.stringify(query) + '\n');
const response = await readLine(server.stdout);
```

## Performance Tips

### 1. Cache Settings

For long-running sessions, increase cache:
```bash
orchestr8-bin --cache-size 2000 --cache-ttl 600
```

### 2. Logging

Reduce logging overhead in production:
```bash
orchestr8-bin --log-level warn
```

### 3. Memory

If memory is constrained:
```bash
orchestr8-bin --cache-size 100 --cache-ttl 60
```

## Next Steps

1. **Read full docs**: Check [README.md](README.md) for complete reference
2. **Explore architecture**: See [ARCHITECTURE.md](ARCHITECTURE.md) for design
3. **Contribute**: See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
4. **Report issues**: GitHub Issues for bugs/features

## Quick Reference

### CLI Options
```
orchestr8-bin [OPTIONS]

OPTIONS:
  -r, --root <ROOT>         Project root (auto-detected)
  -d, --data-dir <DIR>      Data directory [default: .claude/mcp-server/data]
  -l, --log-level <LEVEL>   Log level [default: info]
      --json-logs           Enable JSON logs
      --cache-ttl <SEC>     Cache TTL [default: 300]
      --cache-size <SIZE>   Cache size [default: 1000]
  -h, --help               Print help
  -V, --version            Print version
```

### MCP Methods
- `initialize` - Initialize server
- `agents/query` - Query agents
- `agents/list` - List agents
- `agents/get` - Get specific agent
- `health` - Server health
- `cache/stats` - Cache statistics
- `cache/clear` - Clear cache

### Environment Variables
```bash
export ORCHESTR8_LOG_LEVEL=debug
export RUST_LOG=info
```

## Support

- **Documentation**: [README.md](README.md)
- **Issues**: https://github.com/seth-schultz/orchestr8/issues
- **Email**: orchestr8@sethschultz.com

---

**You're all set!** The server is running and ready to serve agent queries at lightning speed. 🚀
