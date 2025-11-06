# MCP Client Usage Guide

This guide provides reusable patterns for orchestrators and agents to query the MCP server for agent, skill, and workflow discovery.

## Quick Reference

### Query Agents by Capability
```
Task to execute:
Query the MCP server to find agents with "react" capability:

POST http://localhost:3700
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "queryAgents",
  "params": {
    "capability": "react",
    "limit": 5
  },
  "id": 1
}

Expected response: 4-5 agents matching React capability
```

### Query Agents by Role
```
{
  "jsonrpc": "2.0",
  "method": "queryAgents",
  "params": {
    "role": "frontend_developer",
    "limit": 3
  },
  "id": 2
}
```

### Query Agents by Context
```
{
  "jsonrpc": "2.0",
  "method": "queryAgents",
  "params": {
    "context": "implementing user authentication with JWT",
    "limit": 5
  },
  "id": 3
}
```

### Query Skills
```
{
  "jsonrpc": "2.0",
  "method": "querySkills",
  "params": {
    "context": "building REST API with Express and PostgreSQL",
    "limit": 5
  },
  "id": 4
}
```

### Query Workflows
```
{
  "jsonrpc": "2.0",
  "method": "queryWorkflows",
  "params": {
    "goal": "add new feature to application",
    "limit": 3
  },
  "id": 5
}
```

## Orchestrator Integration Pattern

### For Feature Orchestrator

**Scenario:** Need to select specialized agents for a feature implementation

1. **Analyze the task** to determine required capabilities
2. **Query MCP server** for matching agents
3. **Select top matches** (highest confidence scores)
4. **Delegate work** to those agents

**Example:**

```markdown
# Feature: Add OAuth2 Authentication

## Step 1: Determine Required Capabilities
- Security: OAuth2, JWT, authentication
- Backend: Express, Node.js, REST API
- Database: User models, PostgreSQL
- Testing: Security testing, integration tests

## Step 2: Query MCP for Agents

Query 1 - Security agents:
POST http://localhost:3700
{
  "method": "queryAgents",
  "params": {
    "context": "OAuth2 authentication implementation",
    "limit": 3
  }
}

Query 2 - Backend agents:
POST http://localhost:3700
{
  "method": "queryAgents",
  "params": {
    "role": "backend_developer",
    "limit": 3
  }
}

Query 3 - Test agents:
POST http://localhost:3700
{
  "method": "queryAgents",
  "params": {
    "capability": "security_testing",
    "limit": 2
  }
}

## Step 3: Use Results
Selected agents:
- security-auditor (confidence: 0.92)
- backend-developer (confidence: 0.88)
- test-engineer (confidence: 0.85)

## Step 4: Delegate
Use Task tool to delegate to selected agents...
```

### For Project Orchestrator

**Scenario:** Need to determine which agents to coordinate for a full project

```markdown
# New Project: E-commerce Platform

## Required Domains:
- Frontend: React/Next.js
- Backend: Node.js, REST API
- Database: PostgreSQL
- DevOps: Deployment, CI/CD
- Testing: E2E, performance
- Documentation: API docs, architecture

## Query MCP for Each Domain:

Query 1 - Frontend specialists
Query 2 - Backend specialists
Query 3 - Database specialists
Query 4 - DevOps specialists
Query 5 - QA specialists
Query 6 - Documentation specialists

## Coordinate All Agents
Create project structure and coordinate parallel work across all agents
```

## Fallback Strategy

**If MCP server unavailable:**

```markdown
# Fallback to Embedded Agent Registry

If curl returns error or MCP server is down:

1. Use agent-registry.yml for role-based lookups
2. Known agents: feature-orchestrator, project-orchestrator, backend-developer, etc.
3. Fall back to Task tool with agent names directly

Example:
Task tool → "Use backend-developer agent to implement API"
```

## Best Practices

### 1. Cache Query Results
```
First query for "react" → cache for 5 minutes
Future queries for "react" → use cached results
This reduces MCP server load
```

### 2. Batch Queries When Possible
```
Instead of 3 separate queries:
- Query 1: capability=react
- Query 2: capability=typescript
- Query 3: capability=testing

Use one query with broader context:
- Query: context="building React TypeScript app with tests"
This returns all relevant agents in one query
```

### 3. Use Appropriate Limits
```
- Single task → limit: 1-2 (most relevant)
- Feature implementation → limit: 3-5
- Project planning → limit: 5-10 (broader view)
```

### 4. Handle Connection Timeouts
```
If MCP server takes >5 seconds to respond:
- Assume server is busy or crashed
- Fall back to embedded agent registry
- Log the timeout for debugging
```

## Performance Metrics

**Typical Query Times:**
- Agent query (cold): <50ms
- Agent query (cache hit): <10ms
- Pattern matching: <100ms
- Skill discovery: <50ms
- Workflow matching: <100ms

**Memory Usage:**
- Baseline: ~80MB
- Per 1000 queries: ~5MB additional
- Cache TTL: 5 minutes (automatic cleanup)

## Debugging

### Check Server Status
```
curl http://localhost:3700/health
```

### View Metrics
```
curl http://localhost:3700/metrics
```

### Reindex Agents
```
curl -X POST http://localhost:3700/reindex
```

### Check Logs
```
tail -f .claude/mcp-server/logs/mcp.log
```

## Integration Checklist

- [ ] MCP server running on localhost:3700
- [ ] Health endpoint responding
- [ ] Agent index contains 74 agents
- [ ] Orchestrators configured to query MCP
- [ ] Workflows using MCP for discovery
- [ ] Fallback strategy in place
- [ ] Error handling implemented
- [ ] Caching configured

---

**Related Documentation:**
- [MCP Implementation Summary](./mcp-implementation-summary.md)
- [MCP Integration Guide](./mcp-integration-guide.md)
- [MCP Server Architecture](./mcp-server-architecture.md)
