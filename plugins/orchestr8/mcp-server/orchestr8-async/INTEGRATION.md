# Integration Guide: Orchestr8 Async Execution

This guide explains how to integrate the orchestr8-async MCP server with Claude Code and orchestr8.

## Installation

### 1. Build the Binary

```bash
cd /Users/seth/Projects/orchestr8/plugins/orchestr8/mcp-server/orchestr8-async
cargo build --release
```

Binary will be at: `target/release/orchestr8-async-server`

### 2. Add to Claude Code MCP Configuration

Edit `~/.claude/config.json`:

```json
{
  "mcpServers": {
    "orchestr8-async": {
      "command": "/Users/seth/Projects/orchestr8/plugins/orchestr8/mcp-server/orchestr8-async/target/release/orchestr8-async-server",
      "env": {
        "ORCHESTR8_DB_PATH": "/Users/seth/.claude/plugins/orchestr8/orchestr8-async.duckdb",
        "ORCHESTR8_WORKERS": "4",
        "ORCHESTR8_MODE": "mcp"
      }
    }
  }
}
```

### 3. Verify Installation

Restart Claude Code and check available tools:

```bash
# In Claude Code
/tools
```

You should see:
- `task_async` - Execute task asynchronously
- `task_status` - Check task status
- `task_cancel` - Cancel task
- `workflow_create` - Create workflow
- `workflow_add_phase` - Add workflow phase
- `workflow_add_task` - Add task to phase
- `workflow_start` - Start workflow
- `workflow_status` - Check workflow status
- `list_tasks` - List tasks

## Integration with Orchestr8 Plugin

### Directory Structure

```
orchestr8/
├── agents/                          # Existing agent definitions
│   ├── development/
│   ├── quality/
│   └── ...
├── commands/                        # Existing slash commands
│   ├── add-feature.md
│   ├── new-project.md
│   └── ...
└── mcp-server/                      # NEW: Async execution
    └── orchestr8-async/
        ├── src/
        ├── Cargo.toml
        └── README.md
```

### Workflow Integration

The async execution system integrates with existing orchestr8 workflows:

#### Before (Synchronous Execution)

```markdown
# In /commands/add-feature.md

1. Read agent from /agents/development/architect.md
2. Invoke via Task tool (blocks until complete)
3. Wait for result
4. Read next agent from /agents/development/backend-developer.md
5. Invoke via Task tool (blocks until complete)
6. Continue...
```

**Problems:**
- Long-running tasks block conversation
- No ability to check progress
- Can't parallelize independent tasks
- Context grows with each agent invocation

#### After (Async Execution)

```markdown
# In /commands/add-feature.md

1. Create workflow via task_async:
   - workflow_create("Feature Development")

2. Add phases:
   - workflow_add_phase(workflow_id, "design", [], [])
   - workflow_add_phase(workflow_id, "implementation", ["design"], [])
   - workflow_add_phase(workflow_id, "testing", ["implementation"], [])

3. Add tasks to phases:
   - workflow_add_task(workflow_id, "design", architect_task)
   - workflow_add_task(workflow_id, "implementation", backend_task)
   - workflow_add_task(workflow_id, "testing", test_task)

4. Start workflow:
   - workflow_start(workflow_id)

5. Return workflow ID to user for monitoring:
   - "Workflow started! ID: {workflow_id}"
   - "Use workflow_status({workflow_id}) to check progress"
```

**Benefits:**
- Non-blocking execution
- Progress monitoring
- Automatic phase dependency handling
- Persistent state (survives Claude Code restarts)
- Webhook notifications when complete

## Usage Patterns

### Pattern 1: Long-Running Research Tasks

For tasks that take hours (code analysis, research, etc.):

```javascript
// Create async task
task_async({
  name: "Analyze codebase security",
  agent_name: "security-auditor",
  agent_instructions: "Perform comprehensive security audit of entire codebase",
  priority: "normal",
  webhook_url: "https://webhook.site/your-unique-url",
  timeout_seconds: 7200  // 2 hours
})

// Returns immediately with task ID
// User can close Claude Code
// Webhook receives result when complete
```

### Pattern 2: Parallel Independent Tasks

For quality gates that can run in parallel:

```javascript
// Create workflow
workflow_id = workflow_create({
  name: "Quality Gates",
  description: "Run all quality checks in parallel"
})

// Add single phase (all tasks run in parallel)
workflow_add_phase(workflow_id, "quality", "Quality Checks", [])

// Add independent tasks (no dependencies)
workflow_add_task(workflow_id, "quality", {
  name: "Code Review",
  agent_name: "code-reviewer",
  agent_instructions: "Review all changed files"
})

workflow_add_task(workflow_id, "quality", {
  name: "Security Scan",
  agent_name: "security-auditor",
  agent_instructions: "Scan for vulnerabilities"
})

workflow_add_task(workflow_id, "quality", {
  name: "Performance Check",
  agent_name: "performance-analyzer",
  agent_instructions: "Check for performance issues"
})

// Start workflow - all tasks execute in parallel
workflow_start(workflow_id)
```

### Pattern 3: Multi-Phase Dependencies

For complex workflows with sequential phases:

```javascript
// Create workflow
workflow_id = workflow_create({
  name: "Feature Pipeline",
  description: "Complete feature development"
})

// Phase 1: Design (no dependencies)
workflow_add_phase(workflow_id, "design", "Design", [])
workflow_add_task(workflow_id, "design", {
  name: "Architecture",
  agent_name: "architect",
  agent_instructions: "Design feature architecture"
})

// Phase 2: Implementation (depends on design)
workflow_add_phase(workflow_id, "implementation", "Implementation", ["design"])
workflow_add_task(workflow_id, "implementation", {
  name: "Backend",
  agent_name: "backend-developer",
  agent_instructions: "Implement backend"
})
workflow_add_task(workflow_id, "implementation", {
  name: "Frontend",
  agent_name: "frontend-developer",
  agent_instructions: "Implement frontend"
})

// Phase 3: Testing (depends on implementation)
workflow_add_phase(workflow_id, "testing", "Testing", ["implementation"])
workflow_add_task(workflow_id, "testing", {
  name: "Tests",
  agent_name: "test-engineer",
  agent_instructions: "Create tests"
})

// Start workflow - phases execute in order, tasks within phase run in parallel
workflow_start(workflow_id)
```

## Migrating Existing Commands

### Example: /orchestr8:add-feature

**Before (Synchronous):**
```markdown
---
description: Add new feature with design, implementation, and testing
---

# Add Feature

You are orchestrating complete feature development.

## Steps

1. Read architect agent
2. Task tool: Design feature
3. Wait for result
4. Read backend developer agent
5. Task tool: Implement backend
6. Wait for result
...
```

**After (Async):**
```markdown
---
description: Add new feature with design, implementation, and testing (async)
---

# Add Feature (Async)

You are orchestrating complete feature development using async execution.

## Steps

1. Create workflow:
   ```
   workflow_create({
     name: "Feature: [feature description]",
     description: "Complete feature development pipeline"
   })
   ```

2. Define phases:
   ```
   workflow_add_phase(workflow_id, "design", "Design Phase", [])
   workflow_add_phase(workflow_id, "implementation", "Implementation Phase", ["design"])
   workflow_add_phase(workflow_id, "testing", "Testing Phase", ["implementation"])
   workflow_add_phase(workflow_id, "review", "Review Phase", ["testing"])
   workflow_add_phase(workflow_id, "deploy", "Deployment Phase", ["review"])
   ```

3. Add tasks to each phase:
   ```
   # Design phase
   workflow_add_task(workflow_id, "design", {
     name: "Architecture Design",
     agent_name: "architect",
     agent_instructions: "Read from /agents/development/architect.md and design feature architecture"
   })

   # Implementation phase
   workflow_add_task(workflow_id, "implementation", {
     name: "Backend Implementation",
     agent_name: "backend-developer",
     agent_instructions: "Read from /agents/development/backend-developer.md and implement backend"
   })

   # ... more tasks
   ```

4. Start workflow:
   ```
   workflow_start(workflow_id)
   ```

5. Provide monitoring instructions:
   ```
   Workflow started successfully!

   Workflow ID: {workflow_id}

   Monitor progress:
   - workflow_status({workflow_id})
   - list_tasks(workflow_id={workflow_id})

   The workflow will execute all phases in order, with tasks within each phase
   running in parallel. You will be notified when complete.
   ```
```

## Best Practices

### 1. Use Async for Long Tasks

If a task takes > 30 seconds, use async execution:
- Code analysis
- Research tasks
- Large refactoring
- Comprehensive testing
- Security audits

### 2. Use Workflows for Pipelines

If you have multiple phases with dependencies:
- Feature development (design → implement → test → deploy)
- Project creation (scaffold → configure → document)
- Refactoring (analyze → plan → refactor → validate)

### 3. Set Appropriate Timeouts

```javascript
task_async({
  // ...
  timeout_seconds: 3600  // 1 hour for research
  timeout_seconds: 7200  // 2 hours for full codebase analysis
  timeout_seconds: 300   // 5 minutes for simple tasks
})
```

### 4. Use Webhooks for Notifications

```javascript
task_async({
  // ...
  webhook_url: "https://your-domain.com/webhook",
  // or use webhook.site for testing
  webhook_url: "https://webhook.site/unique-id"
})
```

### 5. Set Task Priorities

```javascript
task_async({
  // ...
  priority: "critical"  // For urgent tasks
  priority: "high"      // For important tasks
  priority: "normal"    // Default
  priority: "low"       // For background tasks
})
```

## Monitoring and Debugging

### Check Task Status

```javascript
task_status({
  task_id: "550e8400-e29b-41d4-a716-446655440000"
})
```

Returns:
- Current status
- Execution logs
- Result or error
- Timestamps

### Check Workflow Status

```javascript
workflow_status({
  workflow_id: "660e8400-e29b-41d4-a716-446655440000"
})
```

Returns:
- Overall status
- Phase statuses
- Task counts
- Progress percentage

### List All Tasks

```javascript
list_tasks({
  status: "pending",  // or "running", "completed", "failed"
  limit: 10
})
```

### Cancel Tasks

```javascript
task_cancel({
  task_id: "550e8400-e29b-41d4-a716-446655440000"
})
```

## Troubleshooting

### Database Location

If tasks aren't persisting:
```bash
# Check database path
echo $ORCHESTR8_DB_PATH

# Verify database exists
ls -l ~/.claude/plugins/orchestr8/orchestr8-async.duckdb
```

### MCP Server Not Starting

Check Claude Code logs:
```bash
tail -f ~/.claude/logs/mcp-*.log
```

### Tasks Stuck in Pending

Check worker count:
```bash
# In config.json
"ORCHESTR8_WORKERS": "4"  # Increase if needed
```

### Webhook Not Receiving Results

Test webhook URL:
```bash
curl -X POST https://webhook.site/your-id \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

## Performance Tuning

### Worker Count

Adjust based on CPU cores:
```json
"ORCHESTR8_WORKERS": "8"  // For 8+ core systems
"ORCHESTR8_WORKERS": "4"  // For 4 core systems
"ORCHESTR8_WORKERS": "2"  // For low-power systems
```

### Database Path

Use SSD for better performance:
```json
"ORCHESTR8_DB_PATH": "/fast-ssd/orchestr8-async.duckdb"
```

### Batch Operations

For many small tasks, batch them into phases:
```javascript
// Instead of 100 individual tasks
// Create 10 tasks that each handle 10 items
```

## Security Considerations

### Webhook Security

1. Use HTTPS only
2. Implement webhook signature verification
3. Use secret tokens in webhook URLs
4. Rate limit webhook endpoints

### Database Security

1. Restrict file permissions:
```bash
chmod 600 ~/.claude/plugins/orchestr8/orchestr8-async.duckdb
```

2. Use separate database for sensitive tasks

### Task Isolation

Tasks execute in isolated contexts - no shared state between tasks.

## Future Enhancements

- [ ] Task result streaming
- [ ] Real-time progress updates via WebSocket
- [ ] Task scheduling (cron-like)
- [ ] Task templates
- [ ] Workflow templates
- [ ] Task result caching
- [ ] Distributed execution (multiple machines)
- [ ] Task retry policies
- [ ] Task result compression
- [ ] Task execution metrics

## Support

For issues and questions:
- Repository: https://github.com/seth-schultz/orchestr8
- Issues: https://github.com/seth-schultz/orchestr8/issues
