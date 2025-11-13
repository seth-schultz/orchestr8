---
name: create-workflow
description: Create new workflow definitions with phases and checkpoints
arguments:
  - name: task
    description: Workflow purpose and domain
    required: true
---

# Create Workflow: {{task}}

**Request:** {{task}}

## Your Role

You are creating a new workflow that orchestrates multi-phase execution with dynamic expertise loading.

## Phase 1: Workflow Design (0-25%)

**→ Load:** orchestr8://patterns/match?query=workflow+design+phases&mode=index&maxResults=5

**Activities:**
- Define workflow purpose for {{task}}
- Identify 3-6 distinct phases
- Map phase dependencies
- Determine progress ranges (0-X%, X-Y%, etc.)
- Identify parallel execution opportunities
- Plan checkpoints for each phase
- Define success criteria

**→ Checkpoint:** Workflow structure designed

## Phase 2: Resource Planning (25-50%)

**→ Load:** orchestr8://skills/match?query=jit+loading+resources&mode=index&maxResults=5

**Activities:**
- Plan JIT loading per phase
- Design dynamic queries for expertise
- Set token budgets per phase (800-2500)
- Identify static vs dynamic resources
- Plan category filters (agent, skill, pattern, example)
- Map expertise needs to workflow phases
- Ensure progressive loading (not all upfront)

**→ Checkpoint:** Resource loading strategy planned

## Phase 3: Content Creation (50-80%)

**→ Load:** orchestr8://match?query={{task}}&categories=pattern,skill,example&mode=index&maxResults=8

**Activities:**
- Write workflow frontmatter (name, description, arguments)
- Define each phase with activities
- Add checkpoint criteria for each phase
- Include JIT load directives (orchestr8:// URIs)
- Document parallel tracks where applicable
- Add success criteria at end
- Include phase progress percentages
- Ensure token estimate accurate (target ~600-800)

**→ Checkpoint:** Workflow content written

## Phase 4: Testing & Integration (80-100%)

**→ Load:** orchestr8://skills/match?query=workflow+testing&mode=index&maxResults=3

**Activities:**
- Test workflow with sample inputs
- Verify JIT loading works correctly
- Validate phase transitions
- Test checkpoint criteria
- Check parallel execution logic
- Save as MCP prompt to /prompts/
- Test via Claude Code slash command
- Document usage examples

**→ Checkpoint:** Workflow tested, integrated

## Success Criteria

✅ 3-6 clear phases with progress ranges
✅ Each phase has activities and checkpoint
✅ JIT loading strategy per phase
✅ Token budgets appropriate (800-2500/phase)
✅ Parallel execution identified where applicable
✅ Success criteria clearly defined
✅ Saved to /prompts/ directory
✅ Tested via slash command
