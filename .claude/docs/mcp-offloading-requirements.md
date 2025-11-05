# MCP Offloading Feature - Requirements Analysis

## Executive Summary

This document analyzes the requirements for implementing MCP (Model Context Protocol) offloading in the Claude Code Enterprise Orchestration System. The goal is to reduce orchestrator token usage by 50%+ while maintaining orchestration quality through just-in-time (JIT) context loading.

## Current State Analysis

### System Architecture (v4.1.0)
- **74 specialized agents** across 18 modular plugins
- **20 autonomous workflows** for end-to-end automation
- **4 reusable skills** for context-specific expertise
- **Plugin-based architecture** with opt-in loading
- **Agent registry** (agent-registry.yml) for role-based agent mapping

### Token Usage Problem
**Current orchestrator context loading:**
- Full agent definitions loaded into orchestrator context
- Agent registry embedded in system prompts
- Average orchestrator context: ~100KB per invocation
- Skills and workflow definitions loaded upfront
- Repetitive context across similar tasks

**Impact:**
- High token usage per orchestration task
- Context limits reached faster on complex projects
- Reduced capacity for task-specific context
- Inefficient for repetitive agent queries

## Requirements

### Functional Requirements

#### FR1: Local MCP Server
- **FR1.1:** Run locally as background process
- **FR1.2:** Initialize automatically on plugin installation
- **FR1.3:** Auto-start on system boot (optional)
- **FR1.4:** Graceful shutdown on plugin uninstall
- **FR1.5:** Health check endpoint for monitoring
- **FR1.6:** Port configuration (default: 3700, configurable)

#### FR2: Agent Registry Queries
- **FR2.1:** Query agents by capability tags
- **FR2.2:** Query agents by role (from agent-registry.yml)
- **FR2.3:** Return agent metadata (name, description, model, capabilities)
- **FR2.4:** Return fallback agent recommendations
- **FR2.5:** Support fuzzy capability matching
- **FR2.6:** Cache query results (in-memory and persistent)

#### FR3: Orchestration Pattern Library
- **FR3.1:** Store successful orchestration sequences
- **FR3.2:** Pattern matching for similar goals
- **FR3.3:** Return recommended agent sequence
- **FR3.4:** Include success rate and confidence score
- **FR3.5:** Learn from orchestration outcomes

#### FR4: Decision History
- **FR4.1:** Log all agent selection decisions
- **FR4.2:** Track task outcomes (success/failure)
- **FR4.3:** Store task duration and token usage
- **FR4.4:** Support historical queries
- **FR4.5:** Export decision history for analysis

#### FR5: Skill Auto-Discovery
- **FR5.1:** Index skill definitions from all loaded plugins
- **FR5.2:** Query skills by context keywords
- **FR5.3:** Return relevant skill categories
- **FR5.4:** Cache skill metadata

#### FR6: Workflow Discovery
- **FR6.1:** Index workflow definitions
- **FR6.2:** Query workflows by goal or description
- **FR6.3:** Return workflow sequence and dependencies
- **FR6.4:** Cache workflow definitions

#### FR7: Graceful Fallback
- **FR7.1:** Detect MCP server unavailability
- **FR7.2:** Fall back to embedded agent registry
- **FR7.3:** Log fallback events
- **FR7.4:** Continue orchestration without interruption
- **FR7.5:** Retry connection on next query

### Non-Functional Requirements

#### NFR1: Performance
- **NFR1.1:** Agent query response time <50ms (p50)
- **NFR1.2:** Pattern matching response time <100ms (p50)
- **NFR1.3:** Cache hit rate >80% for repeated queries
- **NFR1.4:** Server startup time <2 seconds
- **NFR1.5:** Memory footprint <50MB

#### NFR2: Token Efficiency
- **NFR2.1:** Reduce orchestrator context by 50%+ on average
- **NFR2.2:** Measure token savings per orchestration task
- **NFR2.3:** Log token usage before/after comparison
- **NFR2.4:** Target: <2KB context per agent query vs ~100KB full definition

#### NFR3: Reliability
- **NFR3.1:** 99.9% uptime during active use
- **NFR3.2:** Automatic recovery from crashes
- **NFR3.3:** Persist cache to disk (survive restarts)
- **NFR3.4:** Transaction-safe decision logging
- **NFR3.5:** No data corruption on ungraceful shutdown

#### NFR4: Security
- **NFR4.1:** No secrets in code or logs
- **NFR4.2:** Local-only server (no remote connections)
- **NFR4.3:** Input validation on all queries
- **NFR4.4:** Parameterized database queries (prevent injection)
- **NFR4.5:** Secure file permissions on data files

#### NFR5: Compatibility
- **NFR5.1:** Works on macOS, Linux, Windows
- **NFR5.2:** Requires Node.js >=18.0.0
- **NFR5.3:** Zero breaking changes to existing orchestration
- **NFR5.4:** Backward compatible with v4.x plugins
- **NFR5.5:** Works with Claude Code >=1.0.0

#### NFR6: Maintainability
- **NFR6.1:** TypeScript for type safety
- **NFR6.2:** Unit test coverage >80%
- **NFR6.3:** Integration tests for all handlers
- **NFR6.4:** Clear separation of concerns
- **NFR6.5:** Comprehensive logging (structured JSON)

#### NFR7: Observability
- **NFR7.1:** Log all queries with correlation IDs
- **NFR7.2:** Track query latency metrics
- **NFR7.3:** Monitor cache hit/miss rates
- **NFR7.4:** Export metrics for analysis
- **NFR7.5:** Health check includes resource usage

## Architecture Components

### Component Breakdown

#### 1. MCP Server (Node.js/TypeScript)
**Location:** `.claude/mcp-server/`

**Modules:**
- `src/index.ts` - Server bootstrap, lifecycle management
- `src/server.ts` - HTTP/JSON-RPC server setup
- `src/handlers.ts` - Tool request handlers
- `src/agent-registry.ts` - Agent capability indexing
- `src/query-engine.ts` - Intelligent agent matching
- `src/cache-store.ts` - In-memory + persistent caching (SQLite)
- `src/orchestration-patterns.ts` - Pattern library with similarity matching
- `src/decision-logger.ts` - Decision history tracking
- `src/skill-indexer.ts` - Skill discovery and indexing
- `src/workflow-indexer.ts` - Workflow discovery and indexing
- `src/health.ts` - Health check and metrics endpoint

**Dependencies:**
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `express` - HTTP server
- `better-sqlite3` - Persistent storage
- `node-cache` - In-memory caching
- `zod` - Input validation
- `winston` - Structured logging

#### 2. Plugin Integration
**Files:**
- `.claude/init.sh` - Installation and server startup script
- `.claude/stop.sh` - Graceful server shutdown script
- `.claude/status.sh` - Server health check script
- `.claude/plugin.json` - Updated with lifecycle hooks

**Lifecycle:**
1. User installs plugin (copies `.claude/` directory)
2. `init.sh` runs automatically (or user runs manually)
3. Script checks Node.js availability
4. Installs MCP server dependencies (`npm install`)
5. Starts MCP server in background
6. Registers server in Claude Code config
7. Verifies server health
8. Reports success or fallback to embedded mode

#### 3. Orchestrator MCP Client
**File:** `.claude/lib/orchestrator-mcp-client.ts`

**Responsibilities:**
- Connect to local MCP server
- Query agents by capability or role
- Cache responses (orchestrator-level cache)
- Handle server unavailable (fallback to embedded registry)
- Log queries and responses
- Track token savings

**Integration Points:**
- `plugins/orchestration/agents/project-orchestrator.md` - Updated to use MCP client
- `plugins/orchestration/agents/feature-orchestrator.md` - Updated to use MCP client
- `.claude/CLAUDE.md` - Updated orchestration guidelines

#### 4. Skill Auto-Discovery
**File:** `.claude/lib/skill-mcp-loader.ts`

**Responsibilities:**
- Query MCP for skill categories by context
- Auto-discover skills based on task keywords
- Cache skill definitions
- Fall back to static skill loading

#### 5. Workflow Discovery
**File:** `.claude/lib/workflow-mcp-client.ts`

**Responsibilities:**
- Query MCP for workflow definitions
- Match workflows by goal or description
- Cache workflow sequences
- Fall back to static workflow loading

### Data Storage

#### SQLite Database Schema

**Table: agent_queries**
- `id` - Primary key
- `timestamp` - Query timestamp
- `capability` - Capability string queried
- `context` - Optional context provided
- `agents_returned` - JSON array of agent IDs
- `cache_hit` - Boolean (cache hit or miss)
- `duration_ms` - Query duration

**Table: orchestration_patterns**
- `id` - Primary key
- `goal` - Task goal description
- `agent_sequence` - JSON array of agent IDs
- `dependencies` - JSON object of dependencies
- `success` - Boolean (task outcome)
- `duration_ms` - Task duration
- `tokens_used` - Token count
- `timestamp` - Completion timestamp

**Table: decision_history**
- `id` - Primary key
- `task_id` - Unique task identifier
- `task_description` - Task description
- `agents_used` - JSON array of agent IDs
- `result` - Task outcome (success/failure/partial)
- `duration_ms` - Task duration
- `tokens_saved` - Estimated token savings
- `timestamp` - Completion timestamp

#### Cache Strategy
- **In-Memory Cache (node-cache):**
  - Agent query results (TTL: 5 minutes)
  - Orchestration patterns (TTL: 10 minutes)
  - Skill metadata (TTL: 5 minutes)
  - Workflow definitions (TTL: 5 minutes)

- **Persistent Cache (SQLite):**
  - All queries and patterns stored
  - Decision history (no TTL)
  - Metrics and analytics data

## MCP Tool Interfaces

### Tool: queryAgents
**Description:** Query agents by capability or role

**Input Schema:**
```json
{
  "capability": "string (optional)",
  "role": "string (optional)",
  "context": "string (optional)",
  "limit": "number (default: 5)"
}
```

**Output Schema:**
```json
{
  "agents": [
    {
      "name": "agent-name",
      "description": "Agent description",
      "model": "sonnet | haiku | opus",
      "capabilities": ["tag1", "tag2"],
      "plugin": "plugin-name"
    }
  ],
  "reasoning": "Why these agents were selected",
  "confidence": 0.95,
  "cache_hit": true
}
```

### Tool: getOrchestrationPattern
**Description:** Get recommended agent sequence for a goal

**Input Schema:**
```json
{
  "goal": "string (required)",
  "context": "string (optional)"
}
```

**Output Schema:**
```json
{
  "pattern": {
    "sequence": ["agent1", "agent2", "agent3"],
    "dependencies": {
      "agent2": ["agent1"],
      "agent3": ["agent2"]
    },
    "parallel": [["agent1", "agent4"]]
  },
  "success_rate": 0.85,
  "avg_duration_ms": 12000,
  "tokens_saved": 5000,
  "similar_tasks": 3
}
```

### Tool: cacheDecision
**Description:** Store orchestration decision and outcome

**Input Schema:**
```json
{
  "task_id": "string (required)",
  "task_description": "string (required)",
  "agents_used": ["agent1", "agent2"],
  "result": "success | failure | partial",
  "duration_ms": 10000,
  "tokens_saved": 5000
}
```

**Output Schema:**
```json
{
  "stored": true,
  "decision_id": "uuid"
}
```

### Tool: queryPattern
**Description:** Find similar orchestration patterns

**Input Schema:**
```json
{
  "goal": "string (required)",
  "min_similarity": 0.7
}
```

**Output Schema:**
```json
{
  "matches": [
    {
      "pattern": { ... },
      "similarity": 0.85,
      "task_count": 5
    }
  ]
}
```

## Integration with Existing System

### Orchestrator Integration

**Before (v4.1.0):**
```markdown
You have access to 74 specialized agents:
- architect: System architecture and design...
- python-developer: Expert Python development...
- react-specialist: React and Next.js expert...
... (72 more agent definitions embedded in context)
```
**Context size: ~100KB**

**After (v4.2.0 with MCP):**
```markdown
You have access to an MCP server for agent discovery.
Query agents by capability using the orchestrator-mcp-client.

Example:
const agents = await queryAgents({ capability: "react" });
// Returns: [{ name: "react-specialist", description: "...", model: "haiku" }]
```
**Context size: ~2KB + query results on-demand**

### Skill Integration

**Before:**
Skills auto-activated based on static file scanning.

**After:**
Skills queried from MCP based on task context:
```typescript
const skills = await querySkills({ context: "building a REST API" });
// Returns: ["api-design", "security-best-practices"]
```

### Workflow Integration

**Before:**
Workflows discovered by scanning `.claude/commands/` directory.

**After:**
Workflows queried from MCP:
```typescript
const workflow = await queryWorkflow({ goal: "add new feature" });
// Returns: { name: "add-feature", steps: [...], agents: [...] }
```

## Acceptance Criteria

### AC1: Installation and Initialization
- [ ] User runs `.claude/init.sh`
- [ ] Script detects Node.js >=18.0.0
- [ ] Script installs dependencies in `.claude/mcp-server/`
- [ ] MCP server starts in background
- [ ] Server registered in Claude Code config
- [ ] Health check confirms server running
- [ ] Success message displayed

### AC2: Agent Query Performance
- [ ] Query by capability returns results in <50ms
- [ ] Query by role returns results in <50ms
- [ ] Cache hit returns results in <10ms
- [ ] Fuzzy matching works correctly
- [ ] Fallback agents recommended

### AC3: Orchestration Pattern Matching
- [ ] Pattern query returns relevant matches
- [ ] Similarity scoring works (0.0-1.0)
- [ ] Success rate calculated correctly
- [ ] Pattern recommendations improve over time

### AC4: Decision History
- [ ] All orchestration decisions logged
- [ ] Outcomes tracked (success/failure)
- [ ] Token savings calculated
- [ ] Historical queries work

### AC5: Context Reduction
- [ ] Orchestrator context reduced by 50%+ on average
- [ ] Token savings measured and logged
- [ ] No quality degradation in orchestration
- [ ] Agent selection accuracy maintained

### AC6: Graceful Fallback
- [ ] Server unavailable detected automatically
- [ ] Falls back to embedded agent registry
- [ ] Orchestration continues without interruption
- [ ] Fallback event logged
- [ ] Retry on next query

### AC7: Cross-Platform Compatibility
- [ ] Works on macOS
- [ ] Works on Linux
- [ ] Works on Windows
- [ ] Installation script supports all platforms
- [ ] Path handling platform-agnostic

### AC8: Quality Gates
- [ ] Code review passed (no critical issues)
- [ ] Test coverage >80%
- [ ] All tests passing
- [ ] No security vulnerabilities (critical/high)
- [ ] Performance targets met

### AC9: Documentation
- [ ] README.md updated
- [ ] MCP.md created (architecture docs)
- [ ] CLAUDE.md updated (orchestrator usage)
- [ ] CHANGELOG.md updated
- [ ] Deployment guide created

### AC10: Zero Breaking Changes
- [ ] Existing orchestrators work without changes
- [ ] Existing workflows work without changes
- [ ] Existing skills work without changes
- [ ] Plugin loading unchanged
- [ ] Backward compatible with v4.x

## Risks and Mitigations

### Risk 1: Node.js Not Available
**Impact:** MCP server cannot run
**Likelihood:** Medium
**Mitigation:**
- Detect Node.js in init script
- Provide clear installation instructions
- Fall back to embedded mode gracefully
- Document Node.js requirement

### Risk 2: Port Conflict
**Impact:** MCP server cannot bind to port
**Likelihood:** Low
**Mitigation:**
- Use uncommon port (3700)
- Make port configurable
- Detect port conflicts in init script
- Try alternative ports automatically

### Risk 3: Performance Degradation
**Impact:** Queries slower than embedded
**Likelihood:** Low
**Mitigation:**
- Aggressive caching (in-memory + persistent)
- Optimize query engine
- Benchmark against targets
- Profile and optimize hot paths

### Risk 4: Data Corruption
**Impact:** Decision history lost
**Likelihood:** Low
**Mitigation:**
- Use transaction-safe SQLite
- Regular backups
- Validate data on startup
- Recover from corruption automatically

### Risk 5: Token Savings Not Achieved
**Impact:** Feature doesn't meet goals
**Likelihood:** Low
**Mitigation:**
- Measure baseline context sizes
- Track savings per query
- Optimize context further if needed
- Document actual savings achieved

## Dependencies

### External Dependencies
- Node.js >=18.0.0
- npm (for dependency installation)
- SQLite (included with better-sqlite3)

### NPM Dependencies
- `@modelcontextprotocol/sdk` - MCP protocol
- `express` - HTTP server
- `better-sqlite3` - Database
- `node-cache` - Caching
- `zod` - Validation
- `winston` - Logging
- TypeScript and @types packages

### System Dependencies
- Claude Code >=1.0.0
- Plugin system v4.x

## Success Metrics

### Quantitative Metrics
- **Token Reduction:** 50%+ average context reduction
- **Query Performance:** <50ms p50, <100ms p95
- **Cache Hit Rate:** >80%
- **Test Coverage:** >80%
- **Uptime:** 99.9% during active use

### Qualitative Metrics
- Zero breaking changes to existing functionality
- No user complaints about orchestration quality
- Positive feedback on installation experience
- Clear, comprehensive documentation

## Timeline Estimate

**Phase 1: Analysis & Design** - 4 hours
**Phase 2: Implementation** - 16 hours (parallel execution: 8 hours)
**Phase 3: Quality Gates** - 8 hours (parallel execution: 4 hours)
**Phase 4: Documentation & Release** - 4 hours

**Total:** 32 hours (optimized: 20 hours with maximum parallelism)

## Conclusion

The MCP offloading feature is a critical enhancement to reduce token usage while maintaining orchestration quality. The design leverages a local MCP server for JIT context loading, intelligent caching, and graceful fallback. With careful implementation and comprehensive testing, this feature will achieve 50%+ token savings and set the foundation for future context optimization.

**Next Steps:**
1. Design MCP server architecture (Phase 1B)
2. Implement MCP server (Phase 2A)
3. Create plugin integration scripts (Phase 2B)
4. Integrate orchestrators with MCP (Phase 2C)
5. Run quality gates (Phase 3)
6. Document and release (Phase 4)
