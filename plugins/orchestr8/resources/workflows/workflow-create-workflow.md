---
id: workflow-create-workflow
category: pattern
tags: [workflow, workflow-design, meta, orchestr8, jit-loading, autonomous, parallel-execution, phase-based]
capabilities:
  - Design autonomous workflows with JIT resource loading
  - Structure multi-phase workflows with progress tracking
  - Integrate dynamic resource assembly and parallel execution
useWhen:
  - Workflow template creation requiring phase definition, JIT resource loading, argument parameterization, and success criteria
  - Adaptive workflow design needing dynamic expertise assembly with orchestr8:// URIs and progressive refinement patterns
estimatedTokens: 580
---

# Create Workflow Pattern

**Phases:** Requirements (0-25%) → Structure (25-50%) → JIT Design (50-75%) → Finalize (75-100%)

## Phase 1: Workflow Requirements (0-25%)
- Define workflow purpose and target use-cases
- Identify input arguments (what user provides)
- Determine phases and milestones (3-6 phases typical)
- Plan parallelism opportunities (independent workstreams)
- Estimate complexity and token budgets per phase
- **Checkpoint:** Workflow purpose clear, phases outlined

## Phase 2: Phase Structure Design (25-50%)
**Design each phase:**
- **Progress ranges:** (0-20%, 20-40%, 40-70%, 70-90%, 90-100%)
- **Phase purpose:** Single clear objective per phase
- **Activities:** 3-5 concrete activities with checkpoints
- **Dependencies:** What must complete before next phase
- **Parallelism:** Identify independent tracks (launch in single message)

**Standard patterns:**
- **Research → Execute:** Research/design (0-35%) → Implement (35-90%) → Validate (90-100%)
- **Parallel Build:** Setup (0-20%) → Parallel tracks (20-80%) → Integration (80-100%)
- **Incremental:** MVP (0-40%) → Enhance (40-70%) → Polish (70-100%)
- **Checkpoint:** Phases structured, dependencies mapped, parallelism identified

## Phase 3: JIT Loading Strategy (50-75%)
**Design dynamic resource loading:**

**Phase-based token budgeting:**
```markdown
Phase 1 (Research): 1200-1500 tokens
- orchestr8://agents/match?query=research+${domain}&mode=index&maxResults=5
- orchestr8://skills/match?query=requirements+analysis&mode=index&maxResults=3

Phase 2 (Design): 1500-2000 tokens
- orchestr8://match?query=${tech}+architecture&categories=agent,pattern&mode=index&maxResults=8

Phase 3 (Implementation): 2500-3000 tokens
- orchestr8://match?query=${tech}+${features}&categories=agent,skill,example&mode=index&maxResults=10

Phase 4 (Validation): 800-1200 tokens
- orchestr8://skills/match?query=testing+${tech}&mode=index&maxResults=3
```

**Argument substitution:**
- Use `$ARGUMENTS` for first argument (backward compatibility)
- Use `${arg-name}` for named arguments in queries
- Make queries specific (better matches)

**Resource selection:**
- Static URIs for fixed dependencies: `orchestr8://agents/typescript-developer`
- Dynamic URIs for variable needs: `orchestr8://agents/match?query=${project-type}`
- **Checkpoint:** JIT loading designed, token budgets set, URIs constructed

## Phase 4: Finalization & Testing (75-100%)
**Parallel tracks:**

**Workflow file:**
```markdown
---
name: workflow-name
title: Workflow Title
description: Brief description (1-2 sentences)
version: 1.0.0
arguments:
  - name: arg-name
    description: What this argument is
    required: true
tags: [category, keywords]
estimatedTokens: total-size
---

# Workflow Title: ${arg-name}

**Task:** $ARGUMENTS

## Phase 1: Name (0-X%)
**→ JIT Load:** orchestr8://...

**Activities:**
- Activity 1
- Activity 2
- Checkpoint

## Phase 2-N: ...

## Success Criteria
✅ Criteria 1
✅ Criteria 2
```

**Testing strategy:**
- Test argument substitution works correctly
- Verify JIT URIs load appropriate resources
- Validate token budgets don't exceed limits
- Test parallelism launches correctly
- **Checkpoint:** Workflow tested, ready for use

## Success Criteria
✅ Clear phase structure (3-6 phases with progress ranges)
✅ JIT loading strategy (dynamic URIs with token budgets)
✅ Parallelism identified (independent tracks in single message)
✅ Success criteria defined (how to verify completion)
✅ Argument substitution works (${arg} replaced correctly)
✅ Token efficient (only loads needed expertise per phase)

## Integration Patterns

**As slash command:**
```markdown
Save to: commands/workflow-name.md
Use: /workflow-name "user input"
```

**As MCP prompt:**
```markdown
Save to: prompts/workflows/workflow-name.md
Accessible via MCP prompts system
```

**As pattern reference:**
```markdown
Save to: resources/patterns/workflow-name.md
Discoverable via: orchestr8://patterns/match?query=...
```

## Example: Minimal Workflow
```markdown
---
name: quick-fix
arguments:
  - name: bug-description
    required: true
---

# Quick Fix: ${bug-description}

## Phase 1: Analysis (0-30%)
**→ Load:** orchestr8://skills/match?query=debugging+${bug-description}&mode=index&maxResults=3
- Reproduce issue, analyze root cause
- **Checkpoint:** Cause identified

## Phase 2: Fix (30-80%)
**→ Load:** orchestr8://match?query=${bug-description}+solution&mode=index&maxResults=5
- Implement fix, add test
- **Checkpoint:** Test passes

## Phase 3: Validate (80-100%)
- End-to-end test, verify no regression
- **Checkpoint:** Fix deployed
```
