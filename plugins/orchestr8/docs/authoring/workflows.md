# Workflow Creation Guide

Workflows represent multi-phase execution strategies with dynamic expertise loading. This guide covers creating effective workflow fragments.

## Table of Contents

1. [What is a Workflow?](#what-is-a-workflow)
2. [Workflow Design Principles](#workflow-design-principles)
3. [Phase Structure](#phase-structure)
4. [JIT Resource Loading](#jit-resource-loading)
5. [Argument Parameterization](#argument-parameterization)
6. [Testing Workflows](#testing-workflows)
7. [Examples](#examples)

## What is a Workflow?

A **workflow** represents a multi-phase execution strategy that dynamically loads expertise just-in-time as needed.

**Workflows define:**
- WHAT phases to execute
- WHEN to load specific expertise
- HOW to track progress
- WHAT success looks like

**Examples:**
- `workflow-fix-bug` - Bug fixing workflow with analysis, fix, test phases
- `workflow-add-feature` - Feature development with planning, implementation, testing
- `workflow-research-tech` - Technology research with exploration, evaluation, recommendation
- `workflow-create-agent` - Agent creation with scoping, design, implementation

**Key characteristics:**
- **Multi-phase:** 3-6 distinct phases with progress tracking
- **Dynamic loading:** Loads expertise per phase using `orchestr8://` URIs
- **Parameterized:** Accepts arguments for customization
- **Autonomous:** Can delegate to subagents (PMs, workers)
- **Trackable:** Clear progress indicators and checkpoints

## Workflow Design Principles

### 1. Phase-Based Structure

**Standard pattern:** 3-6 phases with progress ranges

```markdown
Phase 1: Analysis/Planning (0-25%)
Phase 2: Design/Preparation (25-50%)
Phase 3: Implementation (50-75%)
Phase 4: Validation/Integration (75-100%)
```

### 2. JIT Expertise Loading

**Load expertise only when needed:**

```markdown
❌ Bad: Load all expertise upfront
orchestr8://agents/typescript-core
orchestr8://agents/typescript-api-development
orchestr8://agents/typescript-testing
# Loads ~2000 tokens immediately

✅ Good: Load per phase
Phase 1: orchestr8://match?query=requirements+analysis&maxTokens=800
Phase 2: orchestr8://agents/typescript-core
Phase 3: orchestr8://agents/typescript-api-development
Phase 4: orchestr8://skills/testing-integration-patterns
# Loads 800-1200 tokens per phase
```

### 3. Token Budgeting (Phase 3 Optimization)

**Plan token budgets per phase with progressive loading:**

```markdown
Phase 1 (Research): 800-1200 tokens
├─ Load: Research skills + analysis patterns
├─ Strategy: Core concepts only, no advanced topics
└─ Example: orchestr8://skills/match?query=requirement+analysis&maxTokens=1000

Phase 2 (Design): 1200-1800 tokens
├─ Load: Core agent + design patterns
├─ Strategy: Fundamentals + architecture, defer implementation details
└─ Example: orchestr8://match?query=${tech}+architecture&categories=agent,pattern&maxTokens=1500

Phase 3 (Implementation): 2000-2500 tokens
├─ Load: Core + specialized agents + targeted examples
├─ Strategy: Now load detailed implementation knowledge
├─ Use prerequisite field to ensure core loaded first
└─ Example:
    orchestr8://agents/${tech}-core (prerequisite)
    orchestr8://agents/${tech}-${specialization}
    orchestr8://examples/${specific-pattern}

Phase 4 (Testing): 800-1200 tokens
├─ Load: Testing skills + validation patterns
├─ Strategy: Only testing-specific knowledge
└─ Example: orchestr8://skills/match?query=testing+${tech}&maxTokens=1000

Total worst case: 6000-7500 tokens
But loaded progressively across 4 phases (1500-1875 per phase average)
```

**Token budget optimization strategies:**

1. **Use maxTokens parameter:**
```markdown
# Limit expertise loaded per phase
orchestr8://match?query=python+api&maxTokens=1500

# Instead of unlimited loading that might fetch 3000+ tokens
orchestr8://match?query=python+api
```

2. **Category filtering:**
```markdown
# Phase 1: Only load patterns and skills (no examples yet)
orchestr8://match?query=api+design&categories=pattern,skill&maxTokens=1000

# Phase 3: Now load examples too
orchestr8://match?query=api+implementation&categories=agent,example&maxTokens=2000
```

3. **Progressive specificity:**
```markdown
# Phase 1: Broad query (loads core only)
orchestr8://agents/match?query=${technology}

# Phase 2: More specific (loads core + specialization)
orchestr8://agents/match?query=${technology}+${framework}

# Phase 3: Very specific (loads core + multiple specializations + examples)
orchestr8://match?query=${technology}+${framework}+${feature}&categories=agent,skill,example
```

**Example: Feature Development Workflow with Progressive Budgets**

```markdown
## Phase 1: Planning (0-25%) - Budget: 1000 tokens
**→ Load:** orchestr8://skills/match?query=feature+planning+requirements&maxTokens=1000

Load only planning skills, no implementation details yet.

## Phase 2: Architecture (25-50%) - Budget: 1500 tokens
**→ Load:**
- orchestr8://agents/${tech}-core (prerequisite)
- orchestr8://patterns/match?query=${architecture}&maxTokens=800

Load core language agent + architectural patterns.

## Phase 3: Implementation (50-80%) - Budget: 2500 tokens
**→ Load:**
- orchestr8://agents/${tech}-core (prerequisite, may already be cached)
- orchestr8://agents/${tech}-${specialization}
- orchestr8://examples/match?query=${tech}+${pattern}&maxTokens=1000

Now load specialized implementation knowledge and examples.

## Phase 4: Testing (80-100%) - Budget: 1000 tokens
**→ Load:** orchestr8://skills/match?query=testing+${tech}&maxTokens=1000

Load testing-specific skills only.

Total budget: 6000 tokens maximum
Actual usage: ~4500 tokens average (25% savings from caching core agent)
```

### 4. Parallelism Opportunities

**Identify independent workstreams:**

```markdown
Phase 2: Parallel Design (20-60%)
**Independent tracks (launch in single message):**
- Track A: Backend API design
- Track B: Frontend component design
- Track C: Database schema design

**Checkpoint:** All tracks complete (60%)
```

### 5. Checkpoints and Progress

**Each phase ends with checkpoint:**

```markdown
## Phase 1: Analysis (0-25%)
**Activities:**
- Analyze requirements
- Identify dependencies
- Plan approach

**→ Checkpoint:** Requirements understood, approach defined
```

## Phase Structure

### Phase Template

```markdown
## Phase N: Phase Name (X%-Y%)

**→ JIT Load:** orchestr8://match?query=...&maxTokens=...

**Activities:**
- Activity 1 with clear action
- Activity 2 with clear action
- Activity 3 with clear action

**Parallel tracks (if applicable):**
- Track A: Independent work
- Track B: Independent work

**→ Checkpoint:** What must be complete before next phase
```

### Common Phase Patterns

**Research → Execute:**
```markdown
Phase 1: Research (0-35%)
└─ Explore, analyze, plan

Phase 2: Implementation (35-85%)
└─ Build, create, develop

Phase 3: Validation (85-100%)
└─ Test, verify, deploy
```

**Parallel Build:**
```markdown
Phase 1: Setup (0-20%)
└─ Initialize, configure

Phase 2: Parallel Implementation (20-80%)
├─ Track A: Component 1
├─ Track B: Component 2
└─ Track C: Component 3

Phase 3: Integration (80-100%)
└─ Combine, test, validate
```

**Incremental:**
```markdown
Phase 1: MVP (0-40%)
└─ Core functionality

Phase 2: Enhancement (40-70%)
└─ Additional features

Phase 3: Polish (70-100%)
└─ Refinement, optimization
```

## JIT Resource Loading

### Static URIs

**Use for fixed dependencies:**

```markdown
## Phase 2: Design (25-50%)
**→ Load:** orchestr8://agents/typescript-core
**→ Load:** orchestr8://patterns/api-design-principles
```

### Dynamic URIs with Query Matching

**Use for variable needs:**

```markdown
## Phase 1: Research (0-25%)
**→ Load:** orchestr8://match?query=${technology}+${domain}&categories=agent,skill&maxTokens=1200

## Phase 3: Implementation (50-80%)
**→ Load:** orchestr8://agents/match?query=${language}+${framework}&maxTokens=2000
```

### Token Budget Control

```markdown
## Phase 1: Analysis (0-20%)
**→ Load:** orchestr8://skills/match?query=requirement+analysis&maxTokens=800
# Limits to ~800 tokens

## Phase 3: Implementation (40-80%)
**→ Load:** orchestr8://match?query=${tech}+development&categories=agent,skill,example&maxTokens=2500
# Allows up to ~2500 tokens for complex implementation
```

### Category Filtering

```markdown
# Load only agents
orchestr8://agents/match?query=typescript+api

# Load agents and skills
orchestr8://match?query=api+development&categories=agent,skill

# Load all relevant content
orchestr8://match?query=microservices&categories=agent,skill,pattern,example
```

## Argument Parameterization

### Defining Arguments

**Workflow frontmatter:**

```yaml
---
name: workflow-name
title: Workflow Title
description: Brief description
arguments:
  - name: arg-name
    description: What this argument is
    required: true
  - name: optional-arg
    description: Optional argument
    required: false
tags: [workflow, keywords]
estimatedTokens: 1200
---
```

### Using Arguments

**Backward compatibility ($ARGUMENTS):**

```markdown
# Workflow Title: $ARGUMENTS

**Task:** $ARGUMENTS
```

**Named argument substitution:**

```markdown
# ${arg-name} Implementation

**Project:** ${project-name}
**Technology:** ${technology}

## Phase 1: Research ${technology} (0-25%)
**→ Load:** orchestr8://match?query=${technology}+${domain}&maxTokens=1000
```

### Example with Arguments

```markdown
---
name: workflow-add-feature
arguments:
  - name: feature-description
    description: Description of feature to add
    required: true
  - name: technology
    description: Technology stack (typescript, python, etc.)
    required: false
---

# Add Feature: ${feature-description}

**Task:** $ARGUMENTS

## Phase 1: Planning (0-25%)
**→ Load:** orchestr8://skills/match?query=feature+planning&maxTokens=800

**Activities:**
- Analyze feature requirements for ${feature-description}
- Design implementation approach
- Identify dependencies

**→ Checkpoint:** Feature scope defined

## Phase 2: Implementation (25-75%)
**→ Load:** orchestr8://agents/match?query=${technology}+development&maxTokens=2000

**Activities:**
- Implement ${feature-description}
- Add tests
- Update documentation

**→ Checkpoint:** Feature implemented with tests

## Phase 3: Validation (75-100%)
**→ Load:** orchestr8://skills/match?query=testing+${technology}&maxTokens=800

**Activities:**
- Run test suite
- Manual validation
- Code review

**→ Checkpoint:** Feature validated and ready
```

## Testing Workflows

### Manual Testing

**Test with sample inputs:**

```markdown
Workflow: workflow-add-feature

Test Case 1:
Input: "Add user authentication with JWT tokens"
Verify:
- Phase 1 loads planning skills
- Phase 2 loads authentication expertise
- Phase 3 loads testing skills
- Progress tracked correctly

Test Case 2:
Input: "Implement caching layer for API responses"
Verify:
- Loads relevant caching expertise
- Identifies backend/API context
- Includes performance considerations
```

### Argument Substitution Testing

**Verify argument replacement:**

```markdown
# Test: ${technology} should replace correctly

Input arguments:
- technology: "typescript"
- feature: "authentication"

Expected in Phase 2:
orchestr8://agents/match?query=typescript+development

Actual query should contain "typescript", not "${technology}"
```

### Token Budget Validation

**Ensure phases don't exceed budgets:**

```markdown
Phase 1: maxTokens=800
└─ Verify actual loaded tokens ≤ 800

Phase 2: maxTokens=2000
└─ Verify actual loaded tokens ≤ 2000

Total workflow: Verify reasonable total (<5000 tokens)
```

## Examples

### Example 1: Bug Fix Workflow

```markdown
---
name: workflow-fix-bug
title: Bug Fix Workflow
description: Systematic approach to identifying, fixing, and validating bug fixes
arguments:
  - name: bug-description
    description: Description of the bug to fix
    required: true
tags: [workflow, bug-fix, debugging, testing]
estimatedTokens: 980
---

# Bug Fix: ${bug-description}

**Task:** $ARGUMENTS

## Phase 1: Analysis (0-30%)
**→ Load:** orchestr8://skills/match?query=debugging+root+cause&maxTokens=800

**Activities:**
- Reproduce bug: ${bug-description}
- Analyze stack traces and logs
- Identify root cause
- Document findings

**→ Checkpoint:** Root cause identified

## Phase 2: Fix Implementation (30-70%)
**→ Load:** orchestr8://match?query=${bug-description}+fix&categories=agent,skill,example&maxTokens=1500

**Activities:**
- Implement fix for identified root cause
- Add regression test
- Update related documentation
- Test fix locally

**→ Checkpoint:** Fix implemented with test

## Phase 3: Validation (70-100%)
**→ Load:** orchestr8://skills/match?query=testing+integration&maxTokens=600

**Activities:**
- Run full test suite
- Manual regression testing
- Verify no side effects
- Code review

**→ Checkpoint:** Fix validated, ready for deployment

## Success Criteria
✅ Bug no longer reproducible
✅ Regression test added
✅ All tests passing
✅ Code reviewed
```

### Example 2: Research Workflow

```markdown
---
name: workflow-research-tech
title: Technology Research Workflow
description: Comprehensive technology evaluation and recommendation
arguments:
  - name: technology
    description: Technology to research
    required: true
  - name: use-case
    description: Intended use case
    required: false
tags: [workflow, research, evaluation, decision-making]
estimatedTokens: 1100
---

# Research: ${technology} for ${use-case}

**Task:** $ARGUMENTS

## Phase 1: Discovery (0-30%)
**→ Load:** orchestr8://skills/match?query=technology+evaluation+research&maxTokens=1000

**Activities:**
- Gather information about ${technology}
- Identify key features and capabilities
- Research community and ecosystem
- Document initial findings

**→ Checkpoint:** Technology landscape understood

## Phase 2: Evaluation (30-70%)
**→ Load:** orchestr8://match?query=${technology}+${use-case}&categories=agent,pattern,example&maxTokens=2000

**Parallel tracks:**
- Technical assessment: Capabilities, performance, scalability
- Ecosystem evaluation: Libraries, tools, community support
- Risk analysis: Maturity, maintenance, learning curve

**→ Checkpoint:** Comprehensive evaluation complete

## Phase 3: Recommendation (70-100%)
**→ Load:** orchestr8://patterns/match?query=technology+selection&maxTokens=800

**Activities:**
- Synthesize findings
- Compare with alternatives
- Provide recommendation with rationale
- Document decision criteria

**→ Checkpoint:** Clear recommendation with justification

## Success Criteria
✅ Technology capabilities documented
✅ Ecosystem evaluated
✅ Risks identified
✅ Clear recommendation provided
```

### Example 3: Agent Creation Workflow

```markdown
---
name: workflow-create-agent
title: Agent Creation Workflow
description: Create domain expert agent fragments with optimal structure
arguments:
  - name: domain
    description: Domain or technology for agent
    required: true
tags: [workflow, agent-creation, meta, orchestr8]
estimatedTokens: 520
---

# Create Agent: ${domain}

**Task:** $ARGUMENTS

## Phase 1: Expertise Scoping (0-25%)
**→ Load:** orchestr8://agents/match?query=agent+designer&maxTokens=800

**Activities:**
- Define specialization: ${domain}
- Determine fragmentation strategy
- Identify core vs specialized knowledge
- Check for existing agents

**→ Checkpoint:** Agent scope defined

## Phase 2: Structure Design (25-50%)
**→ Load:** orchestr8://skills/match?query=fragment+metadata&maxTokens=600

**Activities:**
- Design content structure
- Plan metadata (tags, capabilities, useWhen)
- Determine token budgets
- Plan code examples

**→ Checkpoint:** Structure planned

## Phase 3: Content Creation (50-75%)
**→ Load:** orchestr8://match?query=${domain}&categories=agent,skill,example&maxTokens=2000

**Activities:**
- Write fragment with metadata
- Include code examples
- Add best practices
- Document pitfalls

**→ Checkpoint:** Fragment written

## Phase 4: Validation (75-100%)
**→ Load:** orchestr8://skills/match?query=fragment+discovery+testing&maxTokens=600

**Parallel tracks:**
- Discovery testing: Verify fuzzy matching
- Metadata optimization: Enhance if needed
- Integration: Save to resources/agents/

**→ Checkpoint:** Agent discoverable and integrated

## Success Criteria
✅ Clear specialization (focused domain)
✅ Appropriate size (600-750 core, 450-650 specialized)
✅ Rich metadata (6-8 tags, 4-6 capabilities/useWhen)
✅ Discoverable via test queries
✅ Saved to resources/agents/
```

## Workflow Creation Checklist

- [ ] 3-6 phases with clear progress ranges
- [ ] Each phase has activities and checkpoint
- [ ] JIT loading strategy defined
- [ ] Token budgets set per phase
- [ ] Arguments defined in frontmatter
- [ ] Argument substitution used correctly
- [ ] Parallelism identified where applicable
- [ ] Success criteria defined
- [ ] Tested with sample inputs
- [ ] Token budgets validated
- [ ] Saved to appropriate location

## Workflow Locations

**As command:**
```markdown
Location: commands/workflow-name.md
Usage: /workflow-name "input"
```

**As MCP prompt:**
```markdown
Location: prompts/workflows/workflow-name.md
Access: Via MCP prompts system
```

**As pattern fragment:**
```markdown
Location: resources/workflows/workflow-name.md
Discovery: orchestr8://workflows/match?query=...
```

## Next Steps

- Review [Fragment Authoring Guide](./fragments.md) for metadata best practices
- Use [Workflow Template](./templates/workflow-template.md) to get started
- See [Best Practices](./best-practices.md) for quality guidelines
- Test workflows manually with sample inputs
