---
# Workflow name: Used for command invocation
# Pattern: workflow-${purpose}
# Examples: workflow-fix-bug, workflow-add-feature, workflow-research-tech
name: workflow-${purpose}

# Title: Human-readable title
title: ${Workflow-Title}

# Description: Brief description of workflow purpose (1-2 sentences)
description: ${Brief-description-of-what-this-workflow-accomplishes}

# Version: Semantic versioning for tracking changes
version: 1.0.0

# Arguments: Define inputs this workflow accepts
# Use descriptive names and clear descriptions
arguments:
  - name: ${arg-name}
    description: ${What-this-argument-represents}
    required: true
  - name: ${optional-arg}
    description: ${What-this-optional-argument-is}
    required: false

# Tags: Keywords for categorization and discovery
tags: [workflow, ${purpose}, ${domain}, ${keywords}]

# Estimated Tokens: Total workflow size
# Typically 800-1500 tokens for workflows
estimatedTokens: ${calculated-count}
---

# ${Workflow-Title}: ${arg-name}

**Task:** $ARGUMENTS

## Overview

${Brief-explanation-of-workflow} (2-3 sentences describing purpose, approach, and expected outcome).

**Key Characteristics:**
- ${Characteristic-1}
- ${Characteristic-2}
- ${Characteristic-3}

## Phase 1: ${Phase-Name} (0-X%)

**→ JIT Load:** orchestr8://match?query=${relevant-query}&categories=${relevant-categories}&maxTokens=${token-budget}

**Activities:**
- ${Activity-1}: ${Description-of-what-to-do}
- ${Activity-2}: ${Description-of-what-to-do}
- ${Activity-3}: ${Description-of-what-to-do}

**Parallel tracks (if applicable):**
- **Track A:** ${Independent-work-stream-1}
- **Track B:** ${Independent-work-stream-2}

**→ Checkpoint:** ${What-must-be-complete-before-next-phase}

## Phase 2: ${Phase-Name} (X%-Y%)

**→ JIT Load:** orchestr8://agents/match?query=${technology}+${domain}&maxTokens=${token-budget}

**Activities:**
- ${Activity-1}: ${Specific-action-with-${arg-name}-reference}
- ${Activity-2}: ${Another-action}
- ${Activity-3}: ${Another-action}

**Dependencies:**
- ${What-this-phase-depends-on}

**→ Checkpoint:** ${Completion-criteria}

## Phase 3: ${Phase-Name} (Y%-Z%)

**→ JIT Load:** orchestr8://match?query=${specific-need}&categories=agent,skill,example&maxTokens=${token-budget}

**Activities:**
- ${Activity-1}: ${Action}
- ${Activity-2}: ${Action}

**Parallel tracks (if applicable):**
- **Track A:** ${Independent-work-1}
- **Track B:** ${Independent-work-2}
- **Track C:** ${Independent-work-3}

**→ Checkpoint:** ${What-must-be-complete}

## Phase 4-N: ${Additional-Phases}

... (repeat structure for additional phases)

## Success Criteria

Clear checklist of what "done" looks like:

✅ ${Criterion-1}: ${Specific-measurable-outcome}
✅ ${Criterion-2}: ${Specific-measurable-outcome}
✅ ${Criterion-3}: ${Specific-measurable-outcome}
✅ ${Criterion-4}: ${Specific-measurable-outcome}

## Notes / Guidelines (Optional)

**Important Considerations:**
- ${Important-note-1}
- ${Important-note-2}

**Common Challenges:**
- ${Challenge-1}: ${How-to-handle}
- ${Challenge-2}: ${How-to-handle}

---

## Workflow Template Guidelines

### Workflow Structure

**Standard structure:**
- **Frontmatter:** Metadata and arguments
- **Title and Task:** Show user input
- **Overview:** Brief explanation
- **Phases (3-6):** With progress ranges, JIT loading, activities, checkpoints
- **Success Criteria:** Clear completion checklist

**Phase structure:**
```markdown
## Phase N: Name (X%-Y%)
**→ JIT Load:** orchestr8://...
**Activities:** [list]
**Parallel tracks:** [if applicable]
**→ Checkpoint:** [criteria]
```

### Progress Ranges

**Standard patterns:**

**Research → Execute (3 phases):**
```
Phase 1: Research/Analysis (0-35%)
Phase 2: Implementation (35-85%)
Phase 3: Validation (85-100%)
```

**Parallel Build (3 phases):**
```
Phase 1: Setup (0-20%)
Phase 2: Parallel Implementation (20-80%)
Phase 3: Integration (80-100%)
```

**Incremental (4 phases):**
```
Phase 1: Planning (0-25%)
Phase 2: Core Implementation (25-60%)
Phase 3: Enhancement (60-85%)
Phase 4: Validation (85-100%)
```

**Complex Multi-phase (5-6 phases):**
```
Phase 1: Analysis (0-15%)
Phase 2: Design (15-30%)
Phase 3: Foundation (30-50%)
Phase 4: Implementation (50-75%)
Phase 5: Testing (75-90%)
Phase 6: Deployment (90-100%)
```

### JIT Resource Loading

**Token budgeting by phase:**

```markdown
Phase 1 (Research/Planning): 800-1200 tokens
└─ orchestr8://match?query=research+analysis&maxTokens=1000

Phase 2 (Design): 1200-1800 tokens
└─ orchestr8://match?query=${domain}+architecture&maxTokens=1500

Phase 3 (Implementation): 2000-2500 tokens
└─ orchestr8://match?query=${tech}+${feature}&categories=agent,skill,example&maxTokens=2500

Phase 4 (Testing): 800-1200 tokens
└─ orchestr8://skills/match?query=testing+${tech}&maxTokens=1000
```

**Loading strategies:**

**Static URI (fixed dependency):**
```markdown
orchestr8://agents/typescript-core
orchestr8://patterns/autonomous-organization
```

**Dynamic query (variable need):**
```markdown
orchestr8://match?query=${technology}+${domain}&categories=agent,skill
orchestr8://agents/match?query=${language}+${framework}
```

**With constraints:**
```markdown
orchestr8://match?query=${need}&categories=agent,skill&maxTokens=1500&minScore=20
```

### Argument Usage

**Define in frontmatter:**
```yaml
arguments:
  - name: feature-description
    required: true
  - name: technology
    required: false
```

**Use in content:**
```markdown
# Backward compatible
**Task:** $ARGUMENTS

# Named substitution
## Implementing ${feature-description}
**→ Load:** orchestr8://match?query=${technology}+${feature-description}
```

### Parallelism

**Identify independent work:**

```markdown
## Phase 2: Parallel Implementation (20-70%)

**Parallel tracks (launch in single message):**
- **Track A - Backend:** API implementation
  └─ Load: orchestr8://agents/backend-${technology}
- **Track B - Frontend:** UI implementation
  └─ Load: orchestr8://agents/frontend-${framework}
- **Track C - Database:** Schema design
  └─ Load: orchestr8://patterns/database-design

**→ Checkpoint:** All tracks complete (70%)
```

**When to use parallelism:**
- Tracks are independent (no dependencies between them)
- Can start simultaneously
- Different domains/technologies
- No shared file conflicts

### Checkpoints

**Every phase ends with checkpoint:**

```markdown
**→ Checkpoint:** ${Clear-completion-criteria}

Examples:
- Requirements understood, approach defined
- Design documented and reviewed
- Implementation complete with tests passing
- All validation checks passed, ready for deployment
```

### Success Criteria

**Clear, measurable outcomes:**

```markdown
## Success Criteria

✅ ${Specific-deliverable}: ${What-"done"-looks-like}
✅ ${Quality-metric}: ${How-to-verify}
✅ ${Validation-check}: ${Pass-condition}
✅ ${Documentation}: ${What-must-be-documented}
```

**Examples:**
- ✅ Feature fully implements ${feature-description}
- ✅ All tests passing (unit + integration)
- ✅ Code reviewed and approved
- ✅ Documentation updated
- ✅ No regression in existing functionality

### Workflow Locations

**As command:**
```
Location: commands/workflow-name.md
Usage: /workflow-name "user input"
```

**As MCP prompt:**
```
Location: prompts/workflows/workflow-name.md
Registration: Automatic via MCP
```

**As pattern fragment:**
```
Location: resources/workflows/workflow-name.md
Discovery: orchestr8://workflows/match?query=...
```

### Quality Checklist for Workflows

Before committing workflow:

- [ ] Name follows convention (workflow-${purpose})
- [ ] Description is clear and concise
- [ ] Arguments defined with descriptions
- [ ] 3-6 phases with progress ranges
- [ ] Each phase has JIT loading strategy
- [ ] Token budgets set appropriately
- [ ] Activities are clear and actionable
- [ ] Checkpoints defined for each phase
- [ ] Parallelism identified where applicable
- [ ] Success criteria are measurable
- [ ] Argument substitution works (tested)
- [ ] Total size appropriate (800-1500 tokens)

### Testing Workflows

**Manual testing:**
```bash
# Test with real inputs
/workflow-name "actual user input"

# Verify:
✅ Argument substitution works
✅ JIT loading executes correctly
✅ Phases flow logically
✅ Token budgets respected
✅ Checkpoints meaningful
✅ Success criteria achievable
```

**Test cases:**
```markdown
Test Case 1: Typical usage
Input: "Standard use case input"
Verify: All phases execute, success criteria met

Test Case 2: Edge case
Input: "Unusual but valid input"
Verify: Handles gracefully

Test Case 3: Missing optional args
Input: Only required arguments
Verify: Workflow completes successfully
```

### Common Workflow Patterns

**Bug Fix:**
```
Analysis → Fix → Validation
```

**Feature Development:**
```
Planning → Design → Implementation → Testing
```

**Research:**
```
Discovery → Evaluation → Recommendation
```

**Deployment:**
```
Preparation → Execution → Verification → Rollback Plan
```

**Refactoring:**
```
Analysis → Planning → Incremental Changes → Validation
```
