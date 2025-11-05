# Orchestr8 Rearchitecture: MCP-Centric JIT Agent Loading

## Core Design Principle: Just-In-Time Agent Discovery

**Key Insight:** Agent definitions are NOT loaded upfront. Instead:
1. Workflow (slash command) executes
2. Workflow identifies agents it needs
3. Workflow queries MCP server JIT: "Give me architect agent definition"
4. MCP server loads agent definition from `/agents/` on demand
5. Workflow uses agent definition to invoke @agent
6. When done, agent definition discarded (no global state)

```
User: /add-feature "Build payment system"
    ↓
Workflow Starts (from /commands/add-feature.md)
    ├─ Step 1: Need architect for design review
    ├─ Query MCP: "Give me architect definition"
    ├─ MCP loads: /agents/development/architect.md (JIT)
    ├─ MCP returns: {name, description, model, full_instructions}
    ├─ Workflow invokes: @architect with architecture task
    │   (Agent stays in memory while working)
    ├─ Agent returns: Architecture design
    │   (Agent unloaded)
    │
    ├─ Step 2: Need frontend developer
    ├─ Query MCP: "Give me frontend-developer definition"
    ├─ MCP loads: /agents/frontend/react-specialist.md (JIT)
    ├─ MCP returns: {name, description, model, full_instructions}
    ├─ Workflow invokes: @frontend-developer with UI implementation task
    │   (Agent stays in memory while working)
    ├─ Agent returns: Component implementation
    │   (Agent unloaded)
    │
    └─ Step 3: Synthesize results and return to user
```

## Target Architecture (Revised)

```
orchestr8/                           # Project root
├── .claude/
│   ├── plugin.json                  # ONLY CONFIG: MCP server definition
│   ├── VERSION                      # Single source of truth
│   ├── CLAUDE.md
│   ├── CHANGELOG.md
│   ├── agent-registry.yml           # Role → Agent mapping (for MCP queries)
│   └── mcp-server/
│       └── orchestr8-bin/           # Rust MCP server
│           ├── src/
│           │   ├── main.rs          # Stdio MCP protocol handler
│           │   ├── loader.rs        # Loads agent defs JIT from /agents/
│           │   ├── db.rs            # DuckDB caches metadata (not full defs)
│           │   ├── queries.rs       # Discovery queries
│           │   └── ...
│           └── target/release/
│               └── orchestr8-bin    # Precompiled binary
│
├── agents/                          # Agent definitions (loaded JIT by MCP)
│   ├── development/
│   │   ├── architect.md             ← MCP loads on demand
│   │   └── fullstack-developer.md   ← MCP loads on demand
│   ├── languages/
│   ├── frontend/
│   ├── database/
│   └── ... (organized by category)
│
├── commands/                        # Slash command workflows
│   ├── add-feature.md               ← /add-feature (queries MCP JIT)
│   ├── fix-bug.md                   ← /fix-bug (queries MCP JIT)
│   ├── new-project.md
│   └── ... (20 total)
│
├── skills/                          # Reusable expertise (optional)
│   ├── meta/
│   ├── patterns/
│   └── practices/
│
├── README.md
├── ARCHITECTURE.md
└── plugins/                         # DELETED
```

## How Workflows Query MCP JIT

### Example Workflow: add-feature.md

```markdown
---
description: Add a new feature to the project with full development lifecycle
argument-hint: "[feature-description]"
---

# Add Feature Workflow

You are orchestrating complete feature development. Query the MCP orchestr8 server
JIT to get agent definitions as you need them.

## Phase 1: Design Review

First, get the architect agent definition from MCP:

**Query MCP:** `discover_agent("architect")` or `get_agent_definition("development:architect")`

MCP Response:
```json
{
  "name": "architect",
  "description": "Designs system architecture...",
  "model": "sonnet",
  "instructions": "[full architect prompt]",
  "capabilities": ["system-design", "scalability", "architecture"]
}
```

Now invoke the architect with the architecture task:

Use the architect agent to:
1. Review current architecture
2. Design feature integration points
3. Identify scalability concerns
4. Document architecture decisions

Once architect completes, the agent is released.

## Phase 2: Implementation

Get the appropriate developer agent from MCP based on tech stack:

**Query MCP:** `discover_agents_by_capability("implementation", tech_stack)`

MCP might return multiple options, pick the best one:
- For React: `get_agent_definition("frontend:react-specialist")`
- For Python: `get_agent_definition("languages:python-developer")`
- For Node.js: `get_agent_definition("languages:typescript-developer")`

Invoke the selected developer agent to implement the feature...

## Phase 3: Testing

Get test engineer from MCP:

**Query MCP:** `get_agent_definition("quality:test-engineer")`

Invoke test engineer to write comprehensive tests...

## Phase 4: Security Review

Get security auditor from MCP:

**Query MCP:** `get_agent_definition("quality:security-auditor")`

Invoke security auditor to check for vulnerabilities...
```

## MCP Server Responsibilities

The Rust MCP server needs to support:

### 1. **Discovery Tools** (Exposed to workflows)
```rust
// Tool 1: Discover agents by query
discover_agents(query: String) -> Vec<AgentMetadata>
  // Returns: List of matching agents with basic metadata

// Tool 2: Get full agent definition
get_agent_definition(agent_name: String) -> AgentDefinition
  // Loads: /agents/[category]/[agent].md file JIT
  // Returns: Full markdown + frontmatter

// Tool 3: Discover by capability
discover_agents_by_capability(capability: String) -> Vec<AgentMetadata>
  // Returns: Agents matching capability tag

// Tool 4: Discover by role (from agent-registry.yml)
discover_agents_by_role(role: String) -> Vec<AgentMetadata>
  // Maps role -> primary + fallback agents
  // Returns: Best match and alternatives
```

### 2. **Caching Strategy**
```
Metadata Cache (DuckDB):
├── agent_names: "architect", "python-developer", etc.
├── capabilities: "architecture", "python", "testing", etc.
├── descriptions: "Designs system architecture..."
├── file_paths: "agents/development/architect.md"
└── categories: "development", "languages", etc.

Definition Cache (LRU in-memory):
├── Recently accessed agent definitions (full markdown)
├── TTL: 5 minutes
├── Size limit: Keep last 20 agent defs in memory
└── Evict least recently used when full
```

### 3. **Lazy Loading**
```
When workflow queries: "get_agent_definition('architect')"
  ↓
MCP checks in-memory cache
  → Cache hit? Return immediately (<1ms)
  → Cache miss? Continue
  ↓
MCP checks DuckDB metadata (already indexed)
  → Path: agents/development/architect.md
  → File found? Continue
  → File missing? Return error
  ↓
MCP reads agent definition from disk (first time)
  → Parse YAML frontmatter
  → Load full markdown prompt
  → Cache result (LRU)
  → Return to workflow
  ↓
Total latency: <10ms for uncached, <1ms for cached
```

## Loader.rs Changes

```rust
// OLD: Load ALL agents on startup
pub async fn load_all_agents() -> Vec<AgentMetadata> {
    glob(".claude/agents/**/*.md")?
        .iter()
        .map(|path| parse_agent_metadata(path))
        .collect()
}

// NEW: Load metadata only, defer full definitions to JIT
pub async fn index_agent_metadata() -> Vec<AgentMetadata> {
    // Just gather names, descriptions, capabilities
    // Don't load full prompt text yet
    glob("agents/**/*.md")?
        .iter()
        .map(|path| parse_agent_metadata_only(path))
        .collect()
}

pub async fn get_agent_definition_jit(agent_name: &str) -> Result<AgentDefinition> {
    // Called JIT by workflow
    // Actually loads and parses the full .md file
    let path = find_agent_path(agent_name)?;
    load_full_agent_definition(&path)
}
```

## Database Schema (DuckDB)

```sql
-- Metadata only (loaded at startup)
CREATE TABLE agent_metadata (
    id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    category VARCHAR,              -- "development", "languages", etc.
    description TEXT NOT NULL,
    file_path VARCHAR NOT NULL,    -- agents/development/architect.md
    model VARCHAR,                 -- "sonnet" or "haiku"
    capabilities TEXT[]            -- ["architecture", "design", "scalability"]
);

-- NOT stored in DB: Full agent instructions (too large)
-- Instead: Loaded JIT from disk when needed
```

## MCP Server Tools Exposed to Workflows

```json
{
  "tools": [
    {
      "name": "discover_agents",
      "description": "Search for agents by name, description, or capability",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": {"type": "string"},
          "limit": {"type": "integer", "default": 5}
        }
      }
    },
    {
      "name": "get_agent_definition",
      "description": "Get complete agent definition (instructions) - loads JIT",
      "inputSchema": {
        "type": "object",
        "properties": {
          "agent_name": {"type": "string"}
        }
      }
    },
    {
      "name": "discover_agents_by_capability",
      "description": "Find agents with specific capability",
      "inputSchema": {
        "type": "object",
        "properties": {
          "capability": {"type": "string"}
        }
      }
    },
    {
      "name": "discover_agents_by_role",
      "description": "Find agents matching a business role (architect, test-engineer, etc.)",
      "inputSchema": {
        "type": "object",
        "properties": {
          "role": {"type": "string"}
        }
      }
    }
  ]
}
```

## Workflow Flow Example: Complete Add-Feature

```
1. User: /add-feature "Add OAuth2 authentication"
   ↓
2. Workflow loads: commands/add-feature.md
   ↓
3. Workflow: "I need an architect"
   → MCP Query: discover_agents_by_role("system_architect")
   → MCP Response:
     {
       "primary": "architect",
       "fallbacks": ["fullstack-developer"],
       "definition": "[full architect prompt loaded JIT]"
     }
   ↓
4. Workflow invokes: @architect
   → Task tool with architect definition
   → Agent thinks & responds
   → Agent released from memory
   ↓
5. Workflow: "I need a backend developer"
   → MCP Query: discover_agents_by_capability("backend")
   → MCP Response: List of options
   → Workflow picks: "typescript-developer"
   → MCP Query: get_agent_definition("languages:typescript-developer")
   → MCP Response: [full definition loaded JIT]
   ↓
6. Workflow invokes: @typescript-developer
   → Task tool with definition
   → Agent implements feature
   → Agent released
   ↓
7. Workflow: "I need a test engineer"
   → MCP Query: discover_agents_by_role("test_engineer")
   → MCP Response: test-engineer definition loaded JIT
   ↓
8. Workflow invokes: @test-engineer
   → Task tool
   → Agent writes tests
   → Agent released
   ↓
9. Workflow: "I need security review"
   → MCP Query: get_agent_definition("quality:security-auditor")
   → MCP Response: security-auditor definition loaded JIT
   ↓
10. Workflow invokes: @security-auditor
    → Task tool
    → Agent reviews security
    → Agent released
    ↓
11. Workflow: Complete! Return feature implementation
```

## File Organization (Unchanged from Previous)

```
agents/development/architect.md
agents/development/fullstack-developer.md
agents/languages/python-developer.md
agents/languages/typescript-developer.md
... (all 74 agents)

commands/add-feature.md
commands/fix-bug.md
commands/new-project.md
... (all 20 workflows)
```

## Performance Characteristics

| Scenario | Latency | Notes |
|----------|---------|-------|
| MCP discover agents (metadata only) | <1ms | DuckDB in-memory lookup |
| MCP get uncached agent definition | <10ms | Disk read + parse |
| MCP get cached agent definition | <1ms | Memory lookup |
| Workflow query + agent invocation | 100-500ms | Network + Claude processing |
| Entire workflow (5 agents) | 30-60 seconds | Sequential agent invocations |

## Benefits of JIT Loading

✅ **Memory Efficient:** Only active agent definitions in memory
✅ **Scalable:** Can add 1000+ agents without startup overhead
✅ **Flexible:** Workflows choose agents dynamically at runtime
✅ **Observable:** Can track which agents are used and when
✅ **Testable:** Easy to mock/stub agent definitions for testing
✅ **Maintainable:** Agent definitions separate from runtime state

## Migration Tasks (Same as Before)

1. Create `/agents/` directory structure (root level)
2. Copy agent files from `plugins/*/agents/`
3. Copy commands from `plugins/*/commands/`
4. Update MCP loader for JIT loading
5. Implement discovery tools in MCP server
6. Update workflows to query MCP JIT
7. Update documentation
8. Delete `plugins/` directory
9. Test and release

## Key Difference from Original Plan

| Aspect | Original Plan | JIT Plan |
|--------|---------------|----------|
| Agent Loading | All loaded on startup | Loaded on-demand JIT |
| Memory Model | All 74 agents in memory | Only active agents in memory |
| Workflow Access | Direct reference | MCP query → definition → invoke |
| Scaling | Limited (must fit in memory) | Unlimited (disk-based) |
| Latency | <100ms startup | <500ms with caching |
| Cache | Query result cache | Definition + metadata cache |
| Flexibility | Static at startup | Dynamic at runtime |

## Success Criteria

- ✅ Workflows query MCP for agent definitions (not direct file access)
- ✅ Agent definitions loaded JIT when needed
- ✅ Only active agent definitions in memory at any time
- ✅ MCP discovery tools provide all query types (by role, capability, name)
- ✅ Slash commands work normally for end users
- ✅ No global state for agents (all JIT)
- ✅ Performance acceptable (<1s for typical workflow start)
- ✅ Can add agents without restart/rebuild
