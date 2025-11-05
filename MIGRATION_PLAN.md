# Orchestr8 Rearchitecture: Single Plugin MCP-Centric Design

## Migration Overview

**Goal:** Consolidate from 18 plugin directories into single `.claude/` plugin structure

**Current State:** 74 agents + 20 workflows spread across `plugins/*/`
**Target State:** All definitions in `.claude/agents/`, `.claude/commands/`, `.claude/skills/`

## Directory Structure Migration

### Current (Multi-Plugin)
```
plugins/
├── development-core/
│   ├── plugin.json
│   ├── agents/
│   ├── commands/
│   └── skills/
├── language-developers/
│   ├── plugin.json
│   ├── agents/
│   └── ...
└── ... (18 total plugins)
```

### Target (Single MCP Plugin)
```
.claude/
├── VERSION (5.6.2)
├── plugin.json (only one!)
├── CLAUDE.md
├── agents/
│   ├── development/
│   │   ├── architect.md
│   │   └── fullstack-developer.md
│   ├── languages/
│   │   ├── python-developer.md
│   │   ├── typescript-developer.md
│   │   └── ... (11 languages)
│   ├── frontend/
│   │   ├── react-specialist.md
│   │   ├── nextjs-specialist.md
│   │   └── ... (4 frameworks)
│   ├── mobile/
│   ├── database/
│   ├── devops/
│   ├── quality/
│   ├── compliance/
│   ├── infrastructure/
│   ├── ai-ml/
│   ├── blockchain/
│   ├── game/
│   └── orchestration/
├── commands/
│   ├── new-project.md
│   ├── add-feature.md
│   ├── fix-bug.md
│   └── ... (20 total)
├── skills/
│   ├── meta/
│   ├── patterns/
│   └── practices/
└── mcp-server/
    └── orchestr8-bin/
```

## Migration Tasks

### Phase 1: Directory Structure Setup
- [ ] Create `.claude/agents/` subdirectories
- [ ] Create `.claude/commands/` directory
- [ ] Create `.claude/skills/` directory

### Phase 2: Copy Agent Files
- [ ] Copy `plugins/development-core/agents/*.md` → `.claude/agents/development/`
- [ ] Copy `plugins/language-developers/agents/*.md` → `.claude/agents/languages/`
- [ ] Copy `plugins/frontend-frameworks/agents/*.md` → `.claude/agents/frontend/`
- [ ] Copy `plugins/mobile-development/agents/*.md` → `.claude/agents/mobile/`
- [ ] Copy `plugins/database-specialists/agents/*.md` → `.claude/agents/database/`
- [ ] Copy `plugins/devops-cloud/agents/*.md` → `.claude/agents/devops/`
- [ ] Copy `plugins/quality-assurance/agents/*.md` → `.claude/agents/quality/`
- [ ] Copy `plugins/compliance/agents/*.md` → `.claude/agents/compliance/`
- [ ] Copy `plugins/infrastructure-*/agents/*.md` → `.claude/agents/infrastructure/`
- [ ] Copy `plugins/ai-ml-engineering/agents/*.md` → `.claude/agents/ai-ml/`
- [ ] Copy `plugins/blockchain-web3/agents/*.md` → `.claude/agents/blockchain/`
- [ ] Copy `plugins/game-development/agents/*.md` → `.claude/agents/game/`
- [ ] Copy `plugins/api-design/agents/*.md` → `.claude/agents/api/`
- [ ] Copy `plugins/meta-development/agents/*.md` → `.claude/agents/meta/`
- [ ] Copy `plugins/orchestration/agents/*.md` → `.claude/agents/orchestration/`

### Phase 3: Copy Workflow Commands
- [ ] Copy all `plugins/*/commands/*.md` → `.claude/commands/`
- [ ] Flatten structure (commands don't need category subdirs)

### Phase 4: Copy Skills
- [ ] Copy all `plugins/*/skills/*` → `.claude/skills/`

### Phase 5: Update MCP Server
- [ ] Update `mcp-server/orchestr8-bin/src/loader.rs` for new paths
- [ ] Update agent discovery glob patterns
- [ ] Update database initialization

### Phase 6: Update Configuration
- [ ] Update `.claude/plugin.json` (remove plugin dependencies)
- [ ] Update `.claude/agent-registry.yml` (verify namespacing still works)
- [ ] Update `.claude/CLAUDE.md` (document new structure)
- [ ] Update `ARCHITECTURE.md` (explain single-plugin design)

### Phase 7: Cleanup & Testing
- [ ] Verify all files copied successfully
- [ ] Test MCP server loads agents from new locations
- [ ] Run CI/CD pipeline
- [ ] Verify no broken references

### Phase 8: Finalize
- [ ] Delete `plugins/` directory entirely
- [ ] Update CHANGELOG.md
- [ ] Commit with message: "refactor: migrate to single MCP plugin architecture"
- [ ] Tag and release

## Parallel Execution Strategy

**Groups that can run in parallel:**

1. **Group A: Directory Setup** (dependencies: none)
   - Create all `.claude/` subdirectories

2. **Group B: Copy Agent Categories** (dependencies: Group A)
   - Copy development agents
   - Copy language agents
   - Copy frontend agents
   - Copy mobile agents
   - Copy database agents
   - *These can all run in parallel*

3. **Group C: Copy Remaining Agent Categories** (dependencies: Group A)
   - Copy devops agents
   - Copy quality agents
   - Copy compliance agents
   - Copy infrastructure agents
   - Copy ai-ml agents
   - Copy blockchain agents
   - Copy game agents
   - Copy orchestration agents
   - *These can all run in parallel*

4. **Group D: Copy Commands & Skills** (dependencies: Group A)
   - Copy commands
   - Copy skills
   - *These can run in parallel*

5. **Group E: MCP Server Updates** (dependencies: Group B-D copies complete)
   - Update loader.rs
   - Update agent registry validation

6. **Group F: Configuration Updates** (dependencies: Group E)
   - Update plugin.json
   - Update CLAUDE.md
   - Update ARCHITECTURE.md
   - Update agent-registry.yml

7. **Group G: Verification & Testing** (dependencies: Group F)
   - Verify directory structure
   - Test MCP server
   - Run CI/CD

8. **Group H: Finalization** (dependencies: Group G)
   - Cleanup
   - Create commit
   - Update CHANGELOG

## Implementation Notes

### agent-registry.yml Updates
Current namespaced references should continue to work, but we may want to simplify:
- Before: `primary: development-core:architect`
- After: `primary: architect` (since no more plugins)
- Or keep namespacing for clarity: `primary: development:architect`

**Decision:** Keep category prefixing for clarity
- `development:architect`
- `languages:python-developer`
- `frontend:react-specialist`
- etc.

### MCP Server Loader Changes
Update glob patterns in `src/loader.rs`:
```rust
// Before
let agents = glob(".claude/agents/**/*.md")?;  // Still works, but unclear

// After
let patterns = vec![
    ".claude/agents/development/*.md",
    ".claude/agents/languages/*.md",
    ".claude/agents/frontend/*.md",
    // ... etc
];
```

Or simpler:
```rust
let agents = glob(".claude/agents/**/*.md")?;  // Recursive glob works either way
```

### Plugin.json Structure
Remove all plugin dependencies, simplify to:
```json
{
  "name": "orchestr8",
  "version": "5.6.2",
  "description": "...",
  "mcpServers": {
    "orchestr8": { ... }
  },
  "features": {
    "agents": 74,
    "workflows": 20,
    "skills": 4,
    "plugins": 1  // Changed from 18 to 1
  }
}
```

## File Count Summary

**Current State:**
- 18 `plugin.json` files
- 74 agent `.md` files
- 20 command `.md` files
- ~50 skill files
- 94 `.md` files total in `plugins/`

**After Migration:**
- 1 `.claude/plugin.json` file ✅
- 74 agent `.md` files (reorganized) ✅
- 20 command `.md` files ✅
- ~50 skill files ✅
- All in `.claude/` structure ✅
- `plugins/` directory deleted ✅

## Risk Assessment

**Low Risk:**
- ✅ Pure file reorganization (no code logic changes)
- ✅ No database migrations needed
- ✅ MCP server loader already supports flexible paths
- ✅ Agent definitions unchanged (only location)

**Mitigation:**
- Keep `plugins/` directory until fully tested
- Git branch for safe testing
- Verify every agent loads in new structure
- Test all workflows with new agent locations

## Success Criteria

- [ ] All 74 agents discoverable from `.claude/agents/`
- [ ] All 20 workflows accessible from `.claude/commands/`
- [ ] MCP server <1ms query latency with new structure
- [ ] Single `plugin.json` in `.claude/` only
- [ ] All tests pass
- [ ] CI/CD pipeline green
- [ ] Documentation updated
- [ ] Release notes reflect architectural change
