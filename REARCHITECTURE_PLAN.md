# Orchestr8 Rearchitecture: MCP-Centric Single Plugin Design

## Key Insight from Claude Code Documentation

Based on Claude Code's architecture:
- **Plugins** can contain: commands, agents, skills, hooks, MCP servers
- **MCP Servers** are the "nervous system" - they provide tools and capabilities
- **Skills** are the AI's playbook - procedural knowledge encoded for reuse
- **Commands & Agents** are specialized workflows orchestrated by MCP

**Critical Design Decision:** Force orchestr8 to use ONLY the MCP server for agent discovery and resource loading. This means:
- ✅ Plugin contains ONLY the MCP server configuration
- ✅ Agent definitions live in root `/agents/` directory
- ✅ MCP server loads agents and returns them as discoverable resources
- ✅ Workflows/skills come through MCP-provided tools
- ✅ No "direct" agents or commands in the plugin - everything goes through MCP

## Target Architecture

```
orchestr8/                           # Project root
├── .claude/
│   ├── plugin.json                  # ONLY CONFIG: MCP server definition
│   ├── VERSION
│   ├── CLAUDE.md
│   ├── CHANGELOG.md
│   ├── agent-registry.yml
│   └── mcp-server/
│       └── orchestr8-bin/           # Rust MCP server
│           ├── src/
│           │   ├── main.rs
│           │   ├── loader.rs        # LOADS FROM: /agents/
│           │   ├── db.rs
│           │   └── ...
│           └── target/release/
│               └── orchestr8-bin    # Precompiled binary
│
├── agents/                          # ROOT LEVEL - MCP loads from here
│   ├── development/
│   │   ├── architect.md
│   │   └── fullstack-developer.md
│   ├── languages/
│   │   ├── python-developer.md
│   │   ├── typescript-developer.md
│   │   └── ... (11 total)
│   ├── frontend/
│   │   ├── react-specialist.md
│   │   └── ... (4 total)
│   ├── mobile/
│   ├── database/
│   ├── devops/
│   ├── quality/
│   ├── compliance/
│   ├── infrastructure/
│   ├── api/
│   ├── ai-ml/
│   ├── blockchain/
│   ├── game/
│   ├── meta/
│   └── orchestration/
│
├── commands/                        # ROOT LEVEL - MCP provides these as tools
│   ├── new-project.md
│   ├── add-feature.md
│   ├── fix-bug.md
│   └── ... (20 total)
│
├── skills/                          # ROOT LEVEL - MCP provides these as tools
│   ├── meta/
│   ├── patterns/
│   └── practices/
│
├── README.md
├── ARCHITECTURE.md
└── plugins/                         # DELETED (no longer needed)
```

## Why This Architecture is Correct

### ✅ Forces MCP Usage
- Users cannot access agents directly
- All agent discovery goes through MCP server
- MCP server is single source of truth
- Guarantees consistency and scalability

### ✅ Follows Claude Code Patterns
- Plugin.json defines MCP server only
- Agent/command/skill definitions stored externally
- MCP server "owns" the discovery and orchestration
- Aligns with how Claude integrates tools

### ✅ Better Separation of Concerns
- Plugin layer: Configuration only
- MCP layer: Discovery and coordination
- Agent layer: Implementation details
- Clean boundaries, easy to reason about

### ✅ Enables Enterprise Features
- MCP server can enforce quality gates
- MCP server can audit agent usage
- MCP server can manage versioning
- MCP server can provide monitoring/logging

### ✅ Simplifies Distribution
- Single plugin to install (not 18)
- No nested plugin.json files
- Clear entry point (MCP server)
- User experience: `/plugin install orchestr8` → done

## Migration Plan

### Phase 1: Create Root Directory Structure
```bash
mkdir -p agents/{development,languages,frontend,mobile,database,devops,quality,compliance,infrastructure,api,ai-ml,blockchain,game,meta,orchestration}
mkdir -p commands
mkdir -p skills/{meta,patterns,practices}
```

### Phase 2: Copy Agent Files (Parallel)
Copy from `plugins/*/agents/*.md` to `agents/[category]/`
- development-core → agents/development/
- language-developers → agents/languages/
- frontend-frameworks → agents/frontend/
- mobile-development → agents/mobile/
- database-specialists → agents/database/
- devops-cloud → agents/devops/
- quality-assurance → agents/quality/
- compliance → agents/compliance/
- infrastructure-* → agents/infrastructure/
- api-design → agents/api/
- ai-ml-engineering → agents/ai-ml/
- blockchain-web3 → agents/blockchain/
- game-development → agents/game/
- meta-development → agents/meta/
- orchestration → agents/orchestration/

### Phase 3: Copy Commands & Skills (Parallel)
- Copy `plugins/*/commands/*.md` → `commands/`
- Copy `plugins/*/skills/` → `skills/`

### Phase 4: Update MCP Server Loader
- Update `loader.rs` to look for agents in project root: `{root}/agents/**/*.md`
- Update agent loading to scan root directories
- Update database indexing for new structure

### Phase 5: Update .claude/plugin.json
Current (incorrect):
```json
{
  "name": "orchestr8",
  "features": {
    "plugins": 18  // Multiple plugins
  },
  "mcpServers": { ... }
}
```

New (correct):
```json
{
  "name": "orchestr8",
  "version": "5.6.2",
  "description": "Enterprise orchestration via MCP - all agent discovery through MCP server",
  "mcpServers": {
    "orchestr8": {
      "command": "${CLAUDE_PLUGIN_ROOT}/mcp-server/orchestr8-bin/target/release/orchestr8-bin",
      "args": [
        "--root",
        "${CLAUDE_WORKSPACE_ROOT}",
        "--agent-dir",
        "${CLAUDE_WORKSPACE_ROOT}/agents"
      ]
    }
  },
  "features": {
    "agents": 74,
    "workflows": 20,
    "skills": 4,
    "mcp_only": true,
    "agent_discovery": "mcp-required"
  }
}
```

### Phase 6: Update MCP Loader Arguments
Modify `Cargo.toml` args to accept agent directory:
```rust
#[arg(short, long, default_value = "agents")]
agent_dir: PathBuf,
```

Update `main.rs` to use this:
```rust
let agents_dir = root_dir.join(&args.agent_dir);
let agents = loader.load_all_agents(&agents_dir)?;
```

### Phase 7: Update Documentation
- Update ARCHITECTURE.md to explain MCP-centric design
- Update CLAUDE.md to explain agent discovery flow
- Update README.md to clarify plugin is MCP-based

### Phase 8: Testing & Validation
- ✅ All 74 agents loadable from root `/agents/`
- ✅ MCP server <1ms query latency
- ✅ Verify workflows cannot be called directly (only through MCP)
- ✅ Verify skills only accessible through MCP
- ✅ All tests pass

### Phase 9: Cleanup
- Delete `plugins/` directory
- Delete all 18 `plugins/*/plugin.json` files
- Update `.gitignore` if needed

### Phase 10: Release
- Update CHANGELOG.md
- Commit: "refactor: migrate to MCP-centric single plugin architecture"
- Tag v5.7.0
- Update README with new architecture diagram

## File Structure Comparison

### Before (Wrong)
```
plugins/
├── development-core/plugin.json
├── development-core/agents/architect.md
├── language-developers/plugin.json
├── language-developers/agents/python-developer.md
├── ... (18 plugin.json files)
└── orchestration/agents/project-orchestrator.md

.claude/plugin.json (incomplete config)
```
**Problems:**
- 18 separate plugin definitions
- Plugins not actual Claude Code plugins
- Confusing structure
- Hard to maintain versioning

### After (Correct)
```
.claude/plugin.json (ONLY plugin definition)
  └── Defines MCP server

agents/development/architect.md
agents/languages/python-developer.md
agents/orchestration/project-orchestrator.md
... (organized by category in root)

commands/new-project.md
skills/meta/*.md
```
**Benefits:**
- Single plugin definition
- Clear MCP ownership
- Root-level organization
- Easier versioning
- Aligns with Claude Code architecture

## Key Differences from Original Plan

**Original (Incorrect):**
- Move agents to `.claude/agents/` (inside plugin dir)
- Keep 18 plugin.json files
- Mixed concerns (plugin config + agent definitions)

**Revised (Correct):**
- Move agents to root `agents/` (MCP loads from root)
- Delete all `plugins/` and nested plugin.json files
- Keep ONLY `.claude/plugin.json` with MCP config
- Force MCP usage - no direct agent access possible

## Implementation Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| MCP server must find agents in root | Pass `--agent-dir` argument to MCP binary |
| .gitignore might exclude root dirs | Update .gitignore to include `/agents/`, `/commands/`, `/skills/` |
| Relative path resolution | Use `${CLAUDE_WORKSPACE_ROOT}` env var in plugin.json |
| Backward compatibility | Major version bump (v5.7.0) with migration guide |
| Tests assume old structure | Update test fixtures to use root `/agents/` |

## Success Criteria

- ✅ Only one plugin.json in entire repo (`.claude/plugin.json`)
- ✅ All agents in `/agents/` directory (root level)
- ✅ All commands in `/commands/` directory (root level)
- ✅ All skills in `/skills/` directory (root level)
- ✅ MCP server discovers agents from root paths
- ✅ Users cannot access agents/workflows directly (MCP-required)
- ✅ No files in `plugins/` directory (deleted entirely)
- ✅ All tests pass
- ✅ Plugin installs with single `/plugin install` command
- ✅ Architecture documentation updated

## Execution Order

**Sequential (dependencies):**
1. Phase 1: Create directories
2. Phase 2-3: Copy files (can run in parallel)
3. Phase 4-6: Update MCP server (must happen after copying)
4. Phase 7: Documentation
5. Phase 8: Testing
6. Phase 9: Cleanup
7. Phase 10: Release

**Parallel opportunities:**
- All directory creation
- All file copying
- All documentation updates
