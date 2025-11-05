# MCP Server Architecture Design

## Executive Summary

This document defines the architecture for the MCP (Model Context Protocol) offloading server that will reduce orchestrator token usage by 50%+ through just-in-time context loading. The server runs locally, indexes agent/skill/workflow metadata, and provides intelligent query interfaces with caching and pattern matching.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     Claude Code Environment                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │            Orchestrator (project/feature)                   │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐  │ │
│  │  │     Orchestrator MCP Client                          │  │ │
│  │  │  - Query agents by capability/role                   │  │ │
│  │  │  - Get orchestration patterns                        │  │ │
│  │  │  - Cache decisions locally                           │  │ │
│  │  │  - Fallback to embedded registry                     │  │ │
│  │  └────────────────┬─────────────────────────────────────┘  │ │
│  └───────────────────┼────────────────────────────────────────┘ │
│                      │                                           │
│                      │ HTTP/JSON-RPC                             │
│                      │ (localhost:3700)                          │
└──────────────────────┼───────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MCP Server (Node.js)                          │
│                  (.claude/mcp-server/)                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   HTTP Server (Express)                   │   │
│  │                 JSON-RPC Handler                          │   │
│  └────────────────┬─────────────────────────────────────────┘   │
│                   │                                              │
│  ┌────────────────┴─────────────────────────────────────────┐   │
│  │              Request Router & Validation                  │   │
│  │                    (Zod schemas)                          │   │
│  └────────────────┬─────────────────────────────────────────┘   │
│                   │                                              │
│    ┌──────────────┼──────────────┬──────────────┬──────────┐    │
│    │              │              │              │          │    │
│    ▼              ▼              ▼              ▼          ▼    │
│  ┌─────┐      ┌─────┐      ┌─────┐      ┌─────┐      ┌─────┐  │
│  │Agent│      │Orch.│      │Skill│      │Work-│      │Health│  │
│  │Query│      │Pattern│    │Index│      │flow │      │Check│  │
│  │Eng. │      │Match.│     │     │      │Index│      │     │  │
│  └──┬──┘      └──┬──┘      └──┬──┘      └──┬──┘      └─────┘  │
│     │            │            │            │                    │
│  ┌──┴────────────┴────────────┴────────────┴─────────────────┐ │
│  │                Cache Layer (node-cache)                    │ │
│  │  - Agent queries (5min TTL)                               │ │
│  │  - Patterns (10min TTL)                                   │ │
│  │  - Skills/Workflows (5min TTL)                            │ │
│  └──┬─────────────────────────────────────────────────────────┘ │
│     │                                                            │
│  ┌──┴─────────────────────────────────────────────────────────┐ │
│  │           Persistent Storage (SQLite)                      │ │
│  │  - agent_queries table                                     │ │
│  │  - orchestration_patterns table                            │ │
│  │  - decision_history table                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │               Indexing Layer (On Startup)                  │ │
│  │  - Scan plugins/*/agents/*.md                              │ │
│  │  - Parse agent frontmatter                                 │ │
│  │  - Build capability index                                  │ │
│  │  - Index skills and workflows                              │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### 1. HTTP Server Layer

**Technology:** Express.js
**Port:** 3700 (configurable via environment variable `MCP_PORT`)
**Protocol:** JSON-RPC 2.0 over HTTP

**Responsibilities:**
- Accept HTTP POST requests at `/`
- Parse JSON-RPC requests
- Route to appropriate handlers
- Return JSON-RPC responses
- Health check endpoint at `/health`
- Metrics endpoint at `/metrics`

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "queryAgents",
  "params": {
    "capability": "react",
    "limit": 5
  },
  "id": 1
}
```

**Example Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "agents": [
      {
        "name": "react-specialist",
        "description": "Expert in React...",
        "model": "haiku",
        "capabilities": ["react", "hooks", "performance"],
        "plugin": "frontend-frameworks"
      }
    ],
    "reasoning": "Matched by 'react' capability tag",
    "confidence": 0.95,
    "cache_hit": false
  },
  "id": 1
}
```

### 2. Request Router & Validation

**Technology:** Zod for schema validation
**File:** `src/router.ts`

**Responsibilities:**
- Validate JSON-RPC format
- Validate method names
- Validate parameter schemas
- Route to appropriate handler
- Return validation errors

**Supported Methods:**
- `queryAgents` - Query agents by capability/role
- `getOrchestrationPattern` - Get recommended agent sequence
- `cacheDecision` - Store orchestration decision
- `queryPattern` - Find similar patterns
- `querySkills` - Find relevant skills
- `queryWorkflows` - Find relevant workflows
- `getHealth` - Server health check

### 3. Agent Query Engine

**File:** `src/agent-query-engine.ts`

**Data Structure:**
```typescript
interface AgentIndex {
  name: string;
  description: string;
  model: 'sonnet' | 'haiku' | 'opus';
  capabilities: string[];
  plugin: string;
  role?: string; // From agent-registry.yml
  fallbacks?: string[]; // From agent-registry.yml
}

interface AgentQueryParams {
  capability?: string;
  role?: string;
  context?: string;
  limit?: number;
}

interface AgentQueryResult {
  agents: AgentIndex[];
  reasoning: string;
  confidence: number;
  cache_hit: boolean;
}
```

**Query Algorithm:**

1. **Exact Match:**
   - If `role` provided, lookup in agent-registry.yml
   - Return primary + fallback agents

2. **Capability Match:**
   - If `capability` provided, find agents with matching capability tags
   - Use exact match first, then fuzzy match (Levenshtein distance)

3. **Context Match:**
   - If `context` provided, extract keywords
   - Match against agent descriptions and capabilities
   - Use TF-IDF scoring for relevance

4. **Ranking:**
   - Combine scores from capability + context
   - Prioritize agents with higher match confidence
   - Consider agent model (Sonnet for complex, Haiku for simple)

5. **Caching:**
   - Check in-memory cache first (key: hash of query params)
   - Return cached result if found and not expired
   - Store new results in cache

**Example Usage:**
```typescript
// Query by capability
const result = await agentQueryEngine.query({
  capability: 'react',
  limit: 3
});

// Query by role
const result = await agentQueryEngine.query({
  role: 'frontend_developer',
  limit: 5
});

// Query with context
const result = await agentQueryEngine.query({
  context: 'building a REST API with authentication',
  limit: 5
});
```

### 4. Orchestration Pattern Matcher

**File:** `src/orchestration-pattern-matcher.ts`

**Data Structure:**
```typescript
interface OrchestrationPattern {
  id: string;
  goal: string;
  agent_sequence: string[];
  dependencies: Record<string, string[]>;
  parallel_groups: string[][];
  success_count: number;
  failure_count: number;
  avg_duration_ms: number;
  avg_tokens_saved: number;
  created_at: string;
  updated_at: string;
}

interface PatternMatchResult {
  pattern: OrchestrationPattern;
  success_rate: number;
  similarity: number;
  task_count: number;
}
```

**Pattern Matching Algorithm:**

1. **Similarity Calculation:**
   - Use cosine similarity on TF-IDF vectors of goal descriptions
   - Extract keywords from goal and compare
   - Calculate string similarity (Levenshtein)
   - Combine scores: `similarity = 0.5 * cosine + 0.3 * keyword + 0.2 * string`

2. **Ranking:**
   - Filter patterns by minimum similarity (default 0.7)
   - Rank by combined score: `score = similarity * success_rate`
   - Return top N patterns

3. **Learning:**
   - When pattern used, increment success/failure count
   - Update avg_duration_ms and avg_tokens_saved
   - Prune patterns with low success rates (<0.3)

**Example Usage:**
```typescript
// Get pattern for a goal
const pattern = await patternMatcher.getPattern({
  goal: 'add authentication to existing API'
});

// Find similar patterns
const matches = await patternMatcher.findSimilar({
  goal: 'implement user authentication',
  min_similarity: 0.75
});

// Store new pattern
await patternMatcher.storePattern({
  goal: 'add OAuth2 authentication',
  agent_sequence: ['security-auditor', 'backend-developer', 'test-engineer'],
  dependencies: {
    'backend-developer': ['security-auditor'],
    'test-engineer': ['backend-developer']
  },
  parallel_groups: [['security-auditor'], ['backend-developer'], ['test-engineer']]
});
```

### 5. Skill Indexer

**File:** `src/skill-indexer.ts`

**Data Structure:**
```typescript
interface SkillIndex {
  name: string;
  category: string;
  keywords: string[];
  description: string;
  plugin: string;
}

interface SkillQueryResult {
  skills: SkillIndex[];
  reasoning: string;
  confidence: number;
}
```

**Indexing Strategy:**
- Scan all loaded plugins for `skills/` directories
- Parse skill markdown files
- Extract frontmatter metadata
- Build keyword index for fast lookup

**Query Algorithm:**
- Match context keywords against skill keywords
- Rank by relevance score
- Return top N skills

### 6. Workflow Indexer

**File:** `src/workflow-indexer.ts`

**Data Structure:**
```typescript
interface WorkflowIndex {
  name: string;
  description: string;
  arguments: string;
  steps: string[];
  agents: string[];
  plugin: string;
}

interface WorkflowQueryResult {
  workflows: WorkflowIndex[];
  reasoning: string;
  confidence: number;
}
```

**Indexing Strategy:**
- Scan plugins/*/commands/*.md
- Parse workflow frontmatter
- Build description index

**Query Algorithm:**
- Match goal against workflow descriptions
- Fuzzy string matching
- Return best matches

### 7. Cache Layer

**Technology:** node-cache (in-memory) + SQLite (persistent)

**Cache Strategy:**

**In-Memory Cache (node-cache):**
```typescript
interface CacheConfig {
  'agent-queries': { ttl: 300 }, // 5 minutes
  'patterns': { ttl: 600 },       // 10 minutes
  'skills': { ttl: 300 },         // 5 minutes
  'workflows': { ttl: 300 }       // 5 minutes
}
```

**Persistent Cache (SQLite):**
- All queries logged to database
- Patterns stored with success/failure counts
- Decision history persisted
- No TTL (data retained indefinitely)

**Cache Key Generation:**
```typescript
function generateCacheKey(method: string, params: any): string {
  const sorted = JSON.stringify(params, Object.keys(params).sort());
  return `${method}:${hash(sorted)}`;
}
```

**Cache Invalidation:**
- Time-based (TTL)
- Manual invalidation on pattern updates
- LRU eviction when memory limit reached

### 8. Persistent Storage (SQLite)

**File:** `.claude/mcp-server/data/mcp.db`

**Schema:**

```sql
-- Agent queries log
CREATE TABLE agent_queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  capability TEXT,
  role TEXT,
  context TEXT,
  agents_returned TEXT, -- JSON array
  cache_hit INTEGER,
  duration_ms INTEGER
);

CREATE INDEX idx_agent_queries_timestamp ON agent_queries(timestamp);
CREATE INDEX idx_agent_queries_capability ON agent_queries(capability);

-- Orchestration patterns
CREATE TABLE orchestration_patterns (
  id TEXT PRIMARY KEY,
  goal TEXT NOT NULL,
  agent_sequence TEXT NOT NULL, -- JSON array
  dependencies TEXT, -- JSON object
  parallel_groups TEXT, -- JSON array
  success_count INTEGER DEFAULT 0,
  failure_count INTEGER DEFAULT 0,
  avg_duration_ms INTEGER DEFAULT 0,
  avg_tokens_saved INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patterns_goal ON orchestration_patterns(goal);

-- Decision history
CREATE TABLE decision_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  task_id TEXT UNIQUE NOT NULL,
  task_description TEXT NOT NULL,
  agents_used TEXT NOT NULL, -- JSON array
  result TEXT NOT NULL, -- 'success' | 'failure' | 'partial'
  duration_ms INTEGER,
  tokens_saved INTEGER,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_decision_history_timestamp ON decision_history(timestamp);
CREATE INDEX idx_decision_history_result ON decision_history(result);
```

**Database Operations:**
- All writes use transactions
- Prepared statements for security
- Connection pooling (better-sqlite3 handles this)
- Automatic backups (daily)

### 9. Indexing Layer

**File:** `src/indexer.ts`

**Startup Sequence:**

1. **Load Agent Registry:**
   - Read `.claude/agent-registry.yml`
   - Parse role mappings
   - Store in memory

2. **Scan Agent Definitions:**
   - Find all `plugins/*/agents/*.md` files
   - Parse frontmatter (name, description, model, capabilities)
   - Build in-memory index

3. **Scan Skills:**
   - Find all `plugins/*/skills/*.md` files
   - Parse metadata and keywords
   - Build skill index

4. **Scan Workflows:**
   - Find all `plugins/*/commands/*.md` files
   - Parse frontmatter and descriptions
   - Build workflow index

5. **Load Patterns:**
   - Load orchestration patterns from SQLite
   - Build similarity index

**Re-indexing:**
- Watch for file changes (optional, for development)
- Manual re-index endpoint: `POST /reindex`
- Scheduled re-index (every 1 hour)

### 10. Health Check & Metrics

**File:** `src/health.ts`

**Health Check Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "uptime_ms": 123456,
  "memory_mb": 42.5,
  "cache": {
    "hits": 150,
    "misses": 50,
    "hit_rate": 0.75
  },
  "database": {
    "connected": true,
    "size_mb": 1.2
  },
  "indexes": {
    "agents": 74,
    "skills": 4,
    "workflows": 20,
    "patterns": 15
  }
}
```

**Metrics Endpoint:** `GET /metrics`

**Response:**
```json
{
  "queries": {
    "total": 200,
    "by_method": {
      "queryAgents": 120,
      "getOrchestrationPattern": 50,
      "cacheDecision": 30
    }
  },
  "performance": {
    "avg_query_time_ms": 35,
    "p50_query_time_ms": 28,
    "p95_query_time_ms": 65,
    "p99_query_time_ms": 120
  },
  "cache": {
    "hits": 150,
    "misses": 50,
    "hit_rate": 0.75
  },
  "patterns": {
    "total": 15,
    "avg_success_rate": 0.82
  }
}
```

## Deployment Architecture

### Installation Flow

```bash
# User installs plugin
cp -r orchestr8/.claude /path/to/project/.claude

# User runs init script (or automatic on first use)
cd /path/to/project
./.claude/init.sh

# Init script:
# 1. Check Node.js version (>=18.0.0)
# 2. Navigate to .claude/mcp-server/
# 3. Run npm install
# 4. Start MCP server in background
# 5. Register server in ~/.claude/config.json
# 6. Verify server health
# 7. Report success or fallback

# Server runs as background process
# PID stored in .claude/mcp-server/mcp.pid
```

### Server Lifecycle Management

**Start:**
```bash
./.claude/init.sh
# or
cd .claude/mcp-server && npm start
```

**Stop:**
```bash
./.claude/stop.sh
# or
kill $(cat .claude/mcp-server/mcp.pid)
```

**Status:**
```bash
./.claude/status.sh
# Checks if server is running
# Queries health endpoint
# Reports metrics
```

**Restart:**
```bash
./.claude/stop.sh && ./.claude/init.sh
```

### Process Management

**Server starts as background daemon:**
- Detached from terminal
- Logs to `.claude/mcp-server/logs/mcp.log`
- PID file at `.claude/mcp-server/mcp.pid`
- Auto-restart on crash (using node process manager)

**Graceful Shutdown:**
- SIGTERM handler
- Close database connections
- Flush cache to disk
- Write final metrics
- Exit cleanly

## Orchestrator Integration Architecture

### Orchestrator MCP Client

**File:** `.claude/lib/orchestrator-mcp-client.ts`

**Interface:**
```typescript
class OrchestratorMCPClient {
  private baseUrl: string = 'http://localhost:3700';
  private cache: Map<string, any> = new Map();
  private fallback: EmbeddedAgentRegistry;

  async queryAgents(params: AgentQueryParams): Promise<AgentQueryResult> {
    // 1. Check local cache
    // 2. Try MCP server
    // 3. Fall back to embedded registry if server unavailable
    // 4. Cache result
    // 5. Return result
  }

  async getOrchestrationPattern(goal: string): Promise<PatternMatchResult> {
    // Similar flow with fallback
  }

  async cacheDecision(decision: DecisionParams): Promise<void> {
    // Store decision in MCP server
    // Best-effort (don't fail if server unavailable)
  }

  private async request(method: string, params: any): Promise<any> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method,
          params,
          id: Date.now()
        })
      });
      return await response.json();
    } catch (error) {
      // Server unavailable, fall back
      return this.fallback.handle(method, params);
    }
  }
}
```

**Fallback Strategy:**

If MCP server unavailable:
1. Use embedded agent-registry.yml (minimal metadata)
2. Log fallback event
3. Continue orchestration without interruption
4. Retry MCP connection on next query

**Embedded Registry Format:**
```typescript
// Minimal agent metadata (embedded in orchestrator)
const EMBEDDED_AGENTS = {
  'frontend_developer': {
    primary: 'frontend-developer',
    fallbacks: ['fullstack-developer', 'react-specialist']
  },
  'backend_developer': {
    primary: 'backend-developer',
    fallbacks: ['fullstack-developer', 'python-developer']
  },
  // ... minimal role mappings
};
```

### Orchestrator Modifications

**Before (v4.1.0):**
```markdown
# project-orchestrator.md

You have access to 74 specialized agents:

**Development:**
- architect: Expert in system architecture...
- frontend-developer: Expert in React, Vue, Angular...
- backend-developer: Expert in API design...
... (71 more agents)
```

**After (v4.2.0):**
```markdown
# project-orchestrator.md

You have access to an MCP server for agent discovery.

Use the orchestrator-mcp-client to query agents:

```typescript
// Query agents by capability
const agents = await mcpClient.queryAgents({
  capability: 'react',
  limit: 3
});

// Query agents by role
const agents = await mcpClient.queryAgents({
  role: 'frontend_developer',
  limit: 5
});

// Get orchestration pattern
const pattern = await mcpClient.getOrchestrationPattern({
  goal: 'add authentication to API'
});
```

The MCP client handles fallback automatically if server unavailable.
```

## Security Architecture

### Threat Model

**Threats:**
1. SQL injection in database queries
2. Path traversal in file operations
3. Denial of service (resource exhaustion)
4. Information leakage in error messages
5. Secrets exposed in logs

**Mitigations:**
1. Use parameterized queries (better-sqlite3 prepared statements)
2. Validate all file paths, use allowlist
3. Rate limiting, resource limits
4. Generic error messages to clients
5. Sanitize logs, never log secrets

### Input Validation

**All inputs validated with Zod:**
```typescript
const AgentQuerySchema = z.object({
  capability: z.string().max(100).optional(),
  role: z.string().max(50).optional(),
  context: z.string().max(500).optional(),
  limit: z.number().min(1).max(20).optional()
});

// Usage
const validated = AgentQuerySchema.parse(params);
```

### Authentication & Authorization

**Current:** None (local-only server)
**Future:** API key authentication if remote access needed

### Secrets Management

**Rules:**
- No secrets in code
- No secrets in database
- No secrets in logs
- Use environment variables for configuration

### Network Security

**Current:** Listen on localhost only
**Future:** Add TLS if remote access needed

## Performance Architecture

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Agent query (cache miss) | <50ms (p50) | Response time |
| Agent query (cache hit) | <10ms (p50) | Response time |
| Pattern matching | <100ms (p50) | Response time |
| Server startup | <2s | Time to healthy |
| Memory footprint | <50MB | RSS |
| Cache hit rate | >80% | hits / (hits + misses) |

### Optimization Strategies

1. **In-Memory Indexing:**
   - All agent/skill/workflow metadata in memory
   - Fast lookups (O(1) for exact, O(log n) for fuzzy)

2. **Aggressive Caching:**
   - In-memory cache for all queries
   - Persistent cache for patterns
   - Cache warming on startup

3. **Efficient Algorithms:**
   - Use TF-IDF for text similarity (precomputed)
   - Use Levenshtein with early termination
   - Use cosine similarity (vectorized)

4. **Database Optimization:**
   - Indexes on all query columns
   - Prepared statements (compiled once)
   - Batch writes with transactions

5. **Connection Pooling:**
   - better-sqlite3 handles this automatically
   - Reuse database connections

### Profiling & Monitoring

**Metrics Tracked:**
- Query latency (p50, p95, p99)
- Cache hit/miss rates
- Memory usage (RSS, heap)
- Database size and query time
- Index rebuild time

**Profiling Tools:**
- Node.js built-in profiler
- Chrome DevTools
- Clinic.js for production profiling

## Error Handling Architecture

### Error Categories

1. **Validation Errors:**
   - Invalid input parameters
   - Malformed JSON-RPC requests
   - Response: 400 Bad Request

2. **Server Errors:**
   - Database errors
   - Indexing failures
   - Response: 500 Internal Server Error

3. **Not Found Errors:**
   - No agents match query
   - No patterns found
   - Response: 404 Not Found (with helpful message)

### Error Response Format

**JSON-RPC Error:**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": {
      "validation_errors": [
        "capability must be a string"
      ]
    }
  },
  "id": 1
}
```

### Logging Strategy

**Levels:**
- DEBUG: Detailed internal state
- INFO: Request/response logs
- WARN: Degraded performance, fallbacks
- ERROR: Failures, exceptions

**Format:**
```json
{
  "timestamp": "2025-11-04T22:00:00.000Z",
  "level": "INFO",
  "message": "Agent query",
  "correlation_id": "uuid",
  "method": "queryAgents",
  "params": { "capability": "react" },
  "duration_ms": 35,
  "cache_hit": false
}
```

### Recovery Strategies

1. **Database Corruption:**
   - Detect on startup (integrity check)
   - Restore from backup
   - Rebuild from scratch if needed

2. **Index Corruption:**
   - Re-index on startup
   - Background re-indexing

3. **Cache Corruption:**
   - Clear cache
   - Rebuild from database

4. **Server Crash:**
   - Auto-restart (process manager)
   - Log crash details
   - Recover state from persistent storage

## Testing Architecture

### Test Levels

1. **Unit Tests:**
   - Each module tested independently
   - Mock dependencies
   - Coverage target: >80%

2. **Integration Tests:**
   - Test module interactions
   - Use in-memory SQLite
   - Test all endpoints

3. **E2E Tests:**
   - Full server lifecycle
   - Real database
   - Test client integration

### Test Structure

```
tests/
├── unit/
│   ├── agent-query-engine.test.ts
│   ├── pattern-matcher.test.ts
│   ├── cache.test.ts
│   ├── indexer.test.ts
│   └── validation.test.ts
├── integration/
│   ├── server.test.ts
│   ├── endpoints.test.ts
│   └── fallback.test.ts
└── e2e/
    ├── full-flow.test.ts
    └── orchestrator-integration.test.ts
```

### Test Data

**Fixtures:**
- Sample agent definitions
- Sample patterns
- Sample queries

**Mocks:**
- File system (for indexing)
- Database (in-memory SQLite)
- HTTP client (for orchestrator tests)

## Monitoring & Observability Architecture

### Metrics Collection

**Metrics Library:** Custom (simple counters and histograms)

**Metrics Collected:**
- Request count by method
- Request latency (histogram)
- Cache hit/miss counts
- Error counts by type
- Memory usage (sampled every 60s)
- Database size (sampled every 60s)

**Metrics Export:**
- `/metrics` endpoint (JSON format)
- Future: Prometheus format

### Logging

**Logger:** Winston
**Transport:** File (`.claude/mcp-server/logs/mcp.log`)
**Rotation:** Daily, keep 7 days

**Log Aggregation:**
- Future: ELK stack integration
- Future: CloudWatch/Datadog

### Tracing

**Current:** Correlation IDs in logs
**Future:** OpenTelemetry integration

## Deployment Considerations

### Cross-Platform Compatibility

**macOS:**
- Standard Node.js installation
- Use `launchctl` for auto-start (optional)

**Linux:**
- Standard Node.js installation
- Use `systemd` for auto-start (optional)

**Windows:**
- Standard Node.js installation
- Use Windows Task Scheduler for auto-start (optional)

**Path Handling:**
```typescript
import path from 'path';
import os from 'os';

// Cross-platform paths
const dataDir = path.join(os.homedir(), '.claude', 'mcp-server', 'data');
```

### Environment Variables

```bash
# Port configuration
MCP_PORT=3700

# Data directory
MCP_DATA_DIR=./.claude/mcp-server/data

# Log level
MCP_LOG_LEVEL=info

# Cache TTL (seconds)
MCP_CACHE_TTL=300

# Enable auto-restart
MCP_AUTO_RESTART=true
```

### Resource Limits

**Memory:**
- Soft limit: 50MB
- Hard limit: 100MB
- Alert if exceeded

**Database:**
- Soft limit: 100MB
- Hard limit: 500MB
- Prune old data if exceeded

**Logs:**
- Rotate daily
- Keep 7 days
- Compress old logs

## Future Enhancements

### Phase 2 Features (Post v4.2.0)

1. **Remote MCP Server:**
   - Run on shared server
   - Team-wide pattern sharing
   - Authentication required

2. **Advanced Pattern Learning:**
   - Machine learning for pattern matching
   - Continuous improvement from outcomes

3. **Visualization Dashboard:**
   - Web UI for metrics
   - Pattern visualization
   - Real-time monitoring

4. **Plugin Hot-Reload:**
   - Watch for plugin changes
   - Auto re-index on changes
   - Zero-downtime updates

5. **Multi-Project Support:**
   - Multiple project indexes
   - Project-specific patterns
   - Context isolation

6. **Distributed Caching:**
   - Redis integration
   - Shared cache across servers

## Conclusion

This architecture provides a robust, scalable foundation for MCP offloading in the Claude Code Orchestration System. The design prioritizes performance, reliability, and token efficiency while maintaining backward compatibility and graceful fallback.

**Key Architectural Decisions:**

1. **Local-First:** Server runs locally for zero-latency queries
2. **Graceful Fallback:** Embedded registry ensures no disruption
3. **Aggressive Caching:** In-memory + persistent caching for speed
4. **Type Safety:** TypeScript + Zod for runtime validation
5. **Pattern Learning:** Continuous improvement from orchestration outcomes
6. **Cross-Platform:** Works on macOS, Linux, Windows

**Next Steps:**
1. Implement MCP server (Phase 2A)
2. Create plugin integration scripts (Phase 2B)
3. Integrate orchestrators with MCP client (Phase 2C)
4. Run quality gates (Phase 3)
5. Document and release (Phase 4)

---

**Document Version:** 1.0
**Date:** 2025-11-04
**Author:** Claude Code Enterprise Orchestration System
