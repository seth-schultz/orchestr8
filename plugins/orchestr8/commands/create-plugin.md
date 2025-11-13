---
description: Create complete Claude Code plugin with agents, commands, skills, hooks,
  and comprehensive documentation
argument-hint:
- plugin-requirements-or-description
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- WebFetch
- WebSearch
- Write
---

# Create Plugin: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "orchestr8"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Plugin Architect** responsible for creating complete Claude Code plugins with agents, commands, skills, and comprehensive documentation.

## Phase 1: Requirements Analysis (0-20%)

**→ Load:** orchestr8://match?query=plugin+architecture+design&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Extract plugin specifications from requirements
- Identify plugin domain and category
- Determine plugin scope (agents, commands, skills)
- Assess plugin complexity and components needed
- Research similar plugins for patterns

**→ Checkpoint:** Plugin specifications documented

## Phase 2: Agent Design & Creation (20-40%)

**→ Load:** orchestr8://workflows/workflow-create-plugin

**Activities:**
- Design specialized agents needed
- Create agent markdown files with metadata
- Define agent responsibilities and tools
- Document agent activation contexts
- Implement agent prompts and capabilities

**→ Checkpoint:** Agents created and tested

## Phase 3: Command & Workflow Creation (40-60%)

**→ Load:** orchestr8://match?query=workflow+commands+orchestration&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Design slash commands and workflows
- Create command markdown files with frontmatter
- Define workflow phases and checkpoints
- Integrate agents into workflows
- Document command usage and examples

**→ Checkpoint:** Commands created and tested

## Phase 4: Skills & Documentation (60-80%)

**→ Load:** orchestr8://match?query=skills+documentation+best+practices&categories=skill&mode=index&maxResults=3

**Activities:**
- Create reusable skill fragments
- Document best practices and patterns
- Write comprehensive README
- Create usage examples
- Add troubleshooting guide

**→ Checkpoint:** Skills and documentation complete

## Phase 5: Testing & Publishing (80-100%)

**→ Load:** orchestr8://match?query=testing+validation+publishing&categories=skill&mode=index&maxResults=3

**Activities:**
- Test all plugin components
- Validate metadata and structure
- Create plugin manifest (plugin.json)
- Test installation and activation
- Publish to plugin marketplace

**→ Checkpoint:** Plugin tested and published

## Success Criteria

✅ Plugin specifications documented
✅ Specialized agents created with proper metadata
✅ Commands with workflows implemented
✅ Reusable skills documented
✅ Comprehensive README and examples
✅ Plugin tested end-to-end
✅ Plugin manifest valid
✅ Published to marketplace
