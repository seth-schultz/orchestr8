# MCP Integration Guide

## Overview

This guide explains how to integrate the MCP server with orchestrators, skills, and workflows for JIT context loading.

## Orchestrator Integration

### Direct HTTP/JSON-RPC Queries

Orchestrators can query the MCP server directly using standard HTTP requests:

```typescript
// Query agents by capability
const response = await fetch('http://localhost:3700', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'queryAgents',
    params: { capability: 'react', limit: 5 },
    id: 1
  })
});

const result = await response.json();
// result.result.agents = [{ name, description, model, capabilities, plugin }, ...]
```

### Updated Orchestrator Pattern

**Before (v4.1.0):**
```markdown
You have access to 74 specialized agents:
- react-specialist: Expert in React...
- python-developer: Expert in Python...
... (72 more agent definitions)
```

**After (v4.2.0):**
```markdown
You have access to an MCP server for agent discovery.

To query agents, use HTTP POST to http://localhost:3700:
- Query by capability: { "method": "queryAgents", "params": { "capability": "react" } }
- Query by role: { "method": "queryAgents", "params": { "role": "frontend_developer" } }
- Query by context: { "method": "queryAgents", "params": { "context": "building a REST API" } }

If MCP server unavailable, fall back to agent-registry.yml for role-based lookups.
```

### Example Orchestrator Usage

```markdown
# project-orchestrator (Updated for MCP)

When selecting agents for a task:

1. Determine required capabilities from task description
2. Query MCP server for matching agents
3. Use returned agent recommendations
4. Fall back to known agents if MCP unavailable

Example task: "Add authentication to API"
- Query: { "method": "queryAgents", "params": { "context": "add authentication to API" } }
- Expected agents: security-auditor, backend-developer, test-engineer
- Confidence: 0.85+
```

## Skill Auto-Discovery Integration

### Pattern: Context-Based Skill Loading

Skills can be discovered on-demand based on task context:

```markdown
# Example Task Context
"Building a REST API with Express.js and PostgreSQL"

# MCP Query
{
  "method": "querySkills",
  "params": {
    "context": "REST API Express PostgreSQL",
    "limit": 5
  }
}

# Expected Skills
- api-design
- postgresql-optimization
- express-middleware
- security-best-practices
- api-documentation
```

### Integration in Orchestrators

```markdown
When orchestrating a task:
1. Extract keywords from task description
2. Query MCP for relevant skills
3. Include skill names in agent instructions
4. Skills auto-activate based on context
```

## Workflow Discovery Integration

### Pattern: Goal-Based Workflow Matching

Workflows can be recommended based on user goals:

```markdown
# User Goal
"I want to add a new feature to my application"

# MCP Query
{
  "method": "queryWorkflows",
  "params": {
    "goal": "add new feature",
    "limit": 3
  }
}

# Expected Workflows
- add-feature (exact match, confidence: 0.95)
- implement-feature (similar, confidence: 0.85)
- new-project (partial match, confidence: 0.60)
```

### Integration in Claude Code

When a user types a command, Claude Code can:
1. Query MCP for workflow suggestions
2. Present top matches to user
3. Execute selected workflow

## Fallback Strategy

### Embedded Agent Registry

If MCP server is unavailable, use the embedded `agent-registry.yml`:

```yaml
roles:
  frontend_developer:
    primary: frontend-developer
    fallbacks: [fullstack-developer, react-specialist]
  backend_developer:
    primary: backend-developer
    fallbacks: [fullstack-developer, python-developer]
```

### Fallback Implementation

```typescript
async function queryAgents(params: any) {
  try {
    // Try MCP server
    const response = await fetch('http://localhost:3700', {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'queryAgents',
        params,
        id: Date.now()
      })
    });

    if (response.ok) {
      const result = await response.json();
      return result.result;
    }
  } catch (error) {
    // MCP server unavailable
    console.warn('MCP server unavailable, falling back to embedded registry');
  }

  // Fallback: Use embedded agent registry
  return fallbackQueryAgents(params);
}

function fallbackQueryAgents(params: any) {
  // Load agent-registry.yml
  const registry = loadAgentRegistry();

  if (params.role && registry.roles[params.role]) {
    const roleInfo = registry.roles[params.role];
    return {
      agents: [
        { name: roleInfo.primary, fallbacks: roleInfo.fallbacks }
      ],
      reasoning: `Using embedded registry for role '${params.role}'`,
      confidence: 0.8,
      cache_hit: false
    };
  }

  // No match in embedded registry
  return {
    agents: [],
    reasoning: 'MCP unavailable and no embedded match found',
    confidence: 0,
    cache_hit: false
  };
}
```

## Testing Integration

### Test Agent Query

```bash
curl -X POST http://localhost:3700 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "queryAgents",
    "params": {
      "role": "frontend_developer",
      "limit": 5
    },
    "id": 1
  }'
```

**Expected Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "agents": [
      {
        "name": "frontend-developer",
        "description": "Expert in...",
        "model": "haiku",
        "capabilities": ["react", "vue", "angular"],
        "plugin": "frontend-frameworks"
      }
    ],
    "reasoning": "Matched role 'frontend_developer': primary agent...",
    "confidence": 0.95,
    "cache_hit": false
  },
  "id": 1
}
```

### Test Pattern Query

```bash
curl -X POST http://localhost:3700 \
  -H "Content-Type": "application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "getOrchestrationPattern",
    "params": {
      "goal": "add authentication to API"
    },
    "id": 2
  }'
```

### Test Skill Query

```bash
curl -X POST http://localhost:3700 \
  -H "Content-Type": "application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "querySkills",
    "params": {
      "context": "building REST API",
      "limit": 5
    },
    "id": 3
  }'
```

## Performance Monitoring

### Track Token Savings

Before MCP:
```
Orchestrator context: 110KB (full agent definitions)
Average task: 3 agent queries × 110KB = 330KB total
```

After MCP:
```
Orchestrator context: 2KB (MCP instructions only)
Average task: 3 agent queries × 1KB = 3KB + 2KB overhead = 5KB total
Token savings: 330KB → 5KB = 98.5% reduction
```

### Monitor Cache Hit Rate

```bash
curl http://localhost:3700/metrics
```

**Expected Metrics:**
```json
{
  "cache": {
    "hits": 150,
    "misses": 50,
    "hit_rate": 0.75
  }
}
```

Target: >80% cache hit rate for optimal performance.

## Best Practices

### 1. Capability-Based Queries

✅ **Good:**
```json
{ "method": "queryAgents", "params": { "capability": "react" } }
```

❌ **Avoid:**
```json
{ "method": "queryAgents", "params": { "context": "agent for frontend" } }
```

Use specific capabilities when known, context for exploratory queries.

### 2. Role-Based Queries for Standard Tasks

✅ **Good:**
```json
{ "method": "queryAgents", "params": { "role": "backend_developer" } }
```

Role queries use the agent registry for consistent, predictable results.

### 3. Cache Decision Outcomes

```json
{
  "method": "cacheDecision",
  "params": {
    "task_id": "task-123",
    "task_description": "Add OAuth2 authentication",
    "agents_used": ["security-auditor", "backend-developer"],
    "result": "success",
    "tokens_saved": 5000
  }
}
```

This helps the pattern matcher improve recommendations over time.

### 4. Limit Query Results

```json
{ "method": "queryAgents", "params": { "capability": "python", "limit": 3 } }
```

Request only the agents you need to minimize response size.

### 5. Handle Errors Gracefully

```typescript
try {
  const result = await queryMCP(params);
  // Use MCP result
} catch (error) {
  // Fallback to embedded registry or default agents
  const fallback = fallbackQuery(params);
}
```

Never let MCP unavailability block orchestration.

## Future Enhancements

### Phase 2: Full Client Library

Create `orchestrator-mcp-client.ts` with:
- Connection pooling
- Automatic retries
- Response caching
- Fallback logic
- Metrics tracking

### Phase 3: Pattern Learning

Implement machine learning for:
- Agent selection optimization
- Pattern matching improvement
- Success rate prediction
- Token savings estimation

### Phase 4: Remote MCP Server

Support remote MCP servers for:
- Team-wide pattern sharing
- Centralized agent registry
- Cross-project learning
- Enterprise analytics

## Troubleshooting

### MCP Server Not Responding

**Symptoms:**
- Connection refused errors
- Timeout on queries

**Solutions:**
1. Check if server is running: `.claude/status.sh`
2. Restart server: `.claude/stop.sh && .claude/init.sh`
3. Check logs: `.claude/mcp-server/logs/mcp.log`
4. Verify port 3700 not in use: `lsof -i :3700`

### No Agents Returned

**Symptoms:**
- Empty agents array in response

**Solutions:**
1. Re-index plugins: `curl -X POST http://localhost:3700/reindex`
2. Check plugin structure (agents in `plugins/*/agents/*.md`)
3. Verify frontmatter format in agent files
4. Check indexer logs

### Low Cache Hit Rate

**Symptoms:**
- Cache hit rate <50%

**Solutions:**
1. Increase cache TTL: Set `MCP_CACHE_TTL=600` in `.env`
2. Review query patterns (too many unique queries)
3. Consider pattern normalization

### High Memory Usage

**Symptoms:**
- Memory >100MB

**Solutions:**
1. Reduce cache TTL
2. Limit query result sizes
3. Restart server periodically
4. Check for memory leaks in logs

## Summary

The MCP integration enables:
- ✅ **50-90% token reduction** via JIT context loading
- ✅ **Intelligent agent matching** with fuzzy search and context analysis
- ✅ **Pattern learning** for continuous improvement
- ✅ **Graceful fallback** ensuring zero downtime
- ✅ **Cross-platform support** via HTTP/JSON-RPC

Integration is incremental:
1. **MVP (v4.2.0):** Server operational, direct HTTP queries
2. **Phase 2:** Client library for orchestrators
3. **Phase 3:** Full skill/workflow integration
4. **Phase 4:** Advanced features (ML, remote server, analytics)

---

**Document Version:** 1.0
**Date:** 2025-11-04
**For Questions:** See `.claude/docs/mcp-server-architecture.md`
