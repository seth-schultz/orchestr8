# Orchestr8 Async Execution Architecture

Enterprise-grade async execution system for orchestr8 with DuckDB persistence, background job queue, webhook callbacks, and MCP integration.

## Features

- **DuckDB Persistence**: Reliable task and workflow storage with full SQL capabilities
- **Background Job Queue**: Multi-worker task execution with priority support
- **Webhook Callbacks**: Automatic result delivery to HTTP endpoints
- **Result Polling API**: REST API for checking task status and results
- **Phase Dependencies**: Complex workflow orchestration with phase-based execution
- **MCP Integration**: Native Model Context Protocol server for Claude Code
- **Fire-and-Forget Execution**: Submit long-running tasks without blocking

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    MCP Server / HTTP API                │
├─────────────────────────────────────────────────────────┤
│  task_async     │  workflow_create  │  task_status     │
│  task_cancel    │  workflow_start   │  list_tasks      │
├─────────────────────────────────────────────────────────┤
│                   Task Queue Manager                     │
│  - Priority-based scheduling                            │
│  - Dependency resolution                                │
│  - Multi-worker execution                               │
│  - Automatic retries                                    │
├─────────────────────────────────────────────────────────┤
│                  Workflow Executor                       │
│  - Phase-based orchestration                            │
│  - Phase dependency management                          │
│  - Workflow status tracking                             │
├─────────────────────────────────────────────────────────┤
│                  Webhook Manager                         │
│  - Automatic delivery                                   │
│  - Retry with backoff                                   │
│  - Delivery logging                                     │
├─────────────────────────────────────────────────────────┤
│                   DuckDB Database                        │
│  - Task persistence                                     │
│  - Workflow state                                       │
│  - Execution logs                                       │
│  - Webhook history                                      │
└─────────────────────────────────────────────────────────┘
```

## Installation

### As MCP Server

Add to your Claude Code configuration (`~/.claude/config.json`):

```json
{
  "mcpServers": {
    "orchestr8-async": {
      "command": "/path/to/orchestr8-async-server",
      "env": {
        "ORCHESTR8_DB_PATH": "~/.claude/plugins/orchestr8/orchestr8-async.duckdb",
        "ORCHESTR8_WORKERS": "4",
        "ORCHESTR8_MODE": "mcp"
      }
    }
  }
}
```

### As Standalone API Server

```bash
export ORCHESTR8_MODE=api
export ORCHESTR8_HOST=127.0.0.1
export ORCHESTR8_PORT=3000
export ORCHESTR8_DB_PATH=./orchestr8-async.duckdb
export ORCHESTR8_WORKERS=4

./orchestr8-async-server
```

## Building

```bash
cargo build --release
```

The binary will be available at `target/release/orchestr8-async-server`.

## Usage

### MCP Tools

#### task_async - Fire-and-Forget Task Execution

Execute a task asynchronously without waiting for completion:

```javascript
{
  "name": "Research AI safety papers",
  "agent_name": "research-agent",
  "agent_instructions": "Search for and summarize the top 10 papers on AI safety from 2024",
  "priority": "high",
  "webhook_url": "https://example.com/webhook",
  "timeout_seconds": 3600
}
```

Returns immediately with task ID for later status checking.

#### task_status - Check Task Progress

```javascript
{
  "task_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

Returns:
- Current status (pending/running/completed/failed)
- Result data (if completed)
- Error information (if failed)
- Execution logs

#### task_cancel - Cancel Running Task

```javascript
{
  "task_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### workflow_create - Create Multi-Phase Workflow

```javascript
{
  "name": "Feature Development Pipeline",
  "description": "Complete feature development with design, implementation, and testing phases"
}
```

#### workflow_add_phase - Add Phase to Workflow

```javascript
{
  "workflow_id": "660e8400-e29b-41d4-a716-446655440000",
  "phase_id": "design",
  "name": "Design Phase",
  "depends_on": []
}
```

#### workflow_add_task - Add Task to Phase

```javascript
{
  "workflow_id": "660e8400-e29b-41d4-a716-446655440000",
  "phase_id": "design",
  "name": "Create Architecture Document",
  "agent_name": "architect",
  "agent_instructions": "Design system architecture for user authentication feature",
  "dependencies": []
}
```

#### workflow_start - Start Workflow Execution

```javascript
{
  "workflow_id": "660e8400-e29b-41d4-a716-446655440000"
}
```

#### workflow_status - Check Workflow Progress

```javascript
{
  "workflow_id": "660e8400-e29b-41d4-a716-446655440000"
}
```

Returns complete workflow status including:
- Overall progress
- Phase statuses
- Task completion counts
- Failed task information

### REST API Endpoints

When running in API mode:

**Tasks:**
- `POST /api/tasks` - Create task
- `GET /api/tasks/:id` - Get task details
- `DELETE /api/tasks/:id` - Cancel task
- `POST /api/tasks/:id/retry` - Retry failed task
- `GET /api/tasks/:id/logs` - Get task logs
- `GET /api/tasks` - List tasks (with filters)

**Workflows:**
- `POST /api/workflows` - Create workflow
- `GET /api/workflows/:id` - Get workflow
- `GET /api/workflows/:id/status` - Get workflow status
- `POST /api/workflows/:id/start` - Start workflow
- `POST /api/workflows/:id/phases` - Add phase
- `POST /api/workflows/:id/tasks` - Add task to workflow
- `GET /api/workflows/:id/tasks` - List workflow tasks

**Webhooks:**
- `GET /api/webhooks/:task_id/history` - Get webhook delivery history

**Health:**
- `GET /health` - Health check

## Example Workflows

### Simple Research Task

```bash
# Using MCP tool
task_async({
  "name": "Research latest LLM developments",
  "agent_name": "research-agent",
  "agent_instructions": "Compile a comprehensive report on LLM developments in 2024",
  "priority": "normal",
  "webhook_url": "https://example.com/results"
})

# Check status later
task_status({
  "task_id": "..."
})
```

### Multi-Phase Feature Development

```bash
# 1. Create workflow
workflow_create({
  "name": "Auth Feature",
  "description": "Complete authentication feature"
})

# 2. Add phases
workflow_add_phase({
  "workflow_id": "...",
  "phase_id": "design",
  "name": "Design",
  "depends_on": []
})

workflow_add_phase({
  "workflow_id": "...",
  "phase_id": "implementation",
  "name": "Implementation",
  "depends_on": ["design"]
})

workflow_add_phase({
  "workflow_id": "...",
  "phase_id": "testing",
  "name": "Testing",
  "depends_on": ["implementation"]
})

# 3. Add tasks to phases
workflow_add_task({
  "workflow_id": "...",
  "phase_id": "design",
  "name": "Architecture Design",
  "agent_name": "architect",
  "agent_instructions": "Design auth system architecture"
})

workflow_add_task({
  "workflow_id": "...",
  "phase_id": "implementation",
  "name": "Implement Backend",
  "agent_name": "backend-developer",
  "agent_instructions": "Implement authentication API"
})

# 4. Start workflow
workflow_start({
  "workflow_id": "..."
})

# 5. Check progress
workflow_status({
  "workflow_id": "..."
})
```

## Database Schema

### Tables

- **tasks** - Task definitions and status
- **workflows** - Workflow definitions
- **workflow_phases** - Phase definitions with dependencies
- **task_logs** - Execution logs
- **webhook_deliveries** - Webhook delivery history

### Indexes

Optimized for:
- Status-based queries
- Workflow task lookups
- Priority-based scheduling
- Log retrieval

## Configuration

Environment variables:

- `ORCHESTR8_DB_PATH` - Database file path (default: `~/.claude/plugins/orchestr8/orchestr8-async.duckdb`)
- `ORCHESTR8_WORKERS` - Number of worker threads (default: 4)
- `ORCHESTR8_MODE` - Server mode: `mcp` or `api` (default: `mcp`)
- `ORCHESTR8_HOST` - API host (default: `127.0.0.1`, API mode only)
- `ORCHESTR8_PORT` - API port (default: `3000`, API mode only)

## Development

### Run Tests

```bash
cargo test
```

### Run in Development

```bash
# MCP mode
cargo run

# API mode
ORCHESTR8_MODE=api cargo run
```

### Format Code

```bash
cargo fmt
```

### Lint

```bash
cargo clippy
```

## Architecture Benefits

### Scalability

- **Horizontal**: Multiple workers process tasks in parallel
- **Vertical**: DuckDB handles large datasets efficiently
- **Async**: Non-blocking I/O for maximum throughput

### Reliability

- **Persistence**: All state stored in database
- **Retries**: Automatic retry with exponential backoff
- **Logging**: Complete execution history
- **Webhooks**: Guaranteed delivery with retry

### Flexibility

- **Priority**: Control task execution order
- **Dependencies**: Complex task orchestration
- **Phases**: Multi-stage workflow support
- **Timeouts**: Prevent runaway tasks

## Integration with Orchestr8

This async execution architecture integrates seamlessly with orchestr8's existing agent system:

1. **Agent Loading**: Tasks can reference any agent from the `/agents/` directory
2. **JIT Execution**: Agents are loaded on-demand when tasks execute
3. **Context Isolation**: Each task runs in isolated context
4. **Result Storage**: Task results stored in database for retrieval
5. **Webhook Delivery**: Results automatically delivered to configured endpoints

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Repository: https://github.com/seth-schultz/orchestr8
- Issues: https://github.com/seth-schultz/orchestr8/issues
