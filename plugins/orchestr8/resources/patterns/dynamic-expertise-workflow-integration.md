---
id: dynamic-expertise-workflow-integration
category: pattern
tags: [workflow, dynamic, jit, integration, implementation]
capabilities:
  - Integrating dynamic URIs into workflows
  - Workflow template patterns
  - Phase-based expertise loading
  - Complete workflow example
useWhen:
  - Adaptive workflow creation requiring dynamic orchestr8:// URIs with query parameters determined by user input or prior phase results
  - Static-to-dynamic workflow conversion replacing hardcoded fragment inclusions with JIT resource loading for token efficiency
  - Token-efficient workflow design loading 500-2500 tokens per phase based on context instead of 10K+ tokens upfront
  - Multi-phase workflow implementation where Phase 1 research guides Phase 2-3 expertise loading with progressive specialization
estimatedTokens: 620
---

# Dynamic Expertise - Workflow Integration

Patterns for integrating dynamic resource assembly into workflows for adaptive, token-efficient execution.

## Workflow Integration Pattern

### Complete Dynamic Workflow Template

```markdown
---
name: dynamic-workflow
title: Dynamic Adaptive Workflow
description: Workflow that adapts expertise to request
version: 1.0.0
arguments:
  - name: project-description
    description: What to build
    required: true
---

# Dynamic Workflow: ${project-description}

## Phase 1: Requirements (0-15%)

**Task:** ${project-description}

**→ Research Assembly:**
orchestr8://agents/match?query=research+requirements&mode=index&maxResults=3

Activities:
- Analyze project description
- Extract technology stack
- Identify key features
- Assess complexity

Extract for next phase: ${tech-stack}, ${features}, ${architecture}

## Phase 2: Design (15-30%)

**→ Design Assembly (based on Phase 1):**
orchestr8://match?query=${tech-stack}+${architecture}&categories=agent,pattern&mode=index&maxResults=8

Activities:
- Design system architecture
- Plan component structure
- Define integration points
- Create implementation plan

## Phase 3: Implementation (30-85%)

**→ Implementation Assembly (based on Phases 1-2):**
orchestr8://match?query=${tech-stack}+${features}+${patterns}&categories=agent,skill,example&mode=index&maxResults=10

Activities:
- Implement core functionality
- Apply best practices
- Handle errors and edge cases
- Write tests

## Phase 4: Validation (85-100%)

**→ Testing Assembly:**
orchestr8://skills/match?query=testing+${tech-stack}&mode=index&maxResults=5

Activities:
- Run test suites
- Validate requirements met
- Performance testing
- Documentation complete
```

### Static vs Dynamic Comparison

**Static Workflow (Fixed):**
```markdown
## Phase 2: Implementation

**→ Load Static Resources:**
orchestr8://agents/typescript-developer
orchestr8://skills/api-development
orchestr8://patterns/rest-architecture

Always loads same 3 resources (total: 3500 tokens)
Even if user needs Python, or doesn't need REST
```

**Dynamic Workflow (Adaptive):**
```markdown
## Phase 2: Implementation

**→ Load Dynamic Resources:**
orchestr8://match?query=${task-description}&categories=agent,skill,pattern&mode=index&maxResults=10

Adapts based on actual request:
- TypeScript request → TypeScript agent
- Python request → Python agent
- REST API → REST patterns
- GraphQL API → GraphQL patterns
```

## Phase-Based Loading Patterns

### Pattern 1: Research → Targeted Loading

```markdown
## Phase 1: Research (0-20%)
**→ Broad Research:**
orchestr8://agents/match?query=research+${domain}&mode=index&maxResults=3

Determine: Need FastAPI + PostgreSQL + JWT

## Phase 2: Implementation (20-90%)
**→ Targeted Loading (based on Phase 1 findings):**
orchestr8://match?query=python+fastapi+postgresql+jwt&categories=agent,skill,example&mode=index&maxResults=10

Load exactly what's needed based on research
```

### Pattern 2: Progressive Refinement

```markdown
## Phase 1: Core (0-40%)
**→ Core Expertise:**
orchestr8://agents/match?query=${tech}+core&mode=index&maxResults=5

## Phase 2: Features (40-75%)
**→ Feature-Specific:**
orchestr8://match?query=${tech}+${features}&categories=skill,example&mode=index&maxResults=8

## Phase 3: Polish (75-100%)
**→ Quality & Testing:**
orchestr8://skills/match?query=testing+optimization+${tech}&mode=index&maxResults=5
```

### Pattern 3: Parallel with Dynamic Loading

```markdown
## Phase 2: Parallel Implementation (30-85%)

**→ Load Comprehensive Expertise:**
orchestr8://match?query=${full-stack-description}&categories=agent,skill,pattern&mode=index&maxResults=15

Launch parallel subagents:
- Track A: Backend (uses backend-relevant fragments)
- Track B: Frontend (uses frontend-relevant fragments)
- Track C: Infrastructure (uses infra-relevant fragments)

Single load, multiple workstreams benefit
```

## Argument Substitution Patterns

### Direct Substitution

```markdown
Workflow argument: ${task-description}
User provides: "Build TypeScript REST API"

Direct use in URI:
orchestr8://match?query=${task-description}&mode=index&maxResults=8

Expands to:
orchestr8://match?query=Build+TypeScript+REST+API&mode=index&maxResults=8

FuzzyMatcher extracts keywords automatically
```

### Extracted Substitution

```markdown
## Phase 1: Extract from user input
Parse ${task-description} to extract:
- Technology: ${tech}
- Pattern: ${pattern}
- Features: ${features}

## Phase 2: Use extracted values
orchestr8://match?query=${tech}+${pattern}+${features}&mode=index&maxResults=10

More controlled than direct substitution
```

## Multi-Query Patterns

### Sequential Queries

```markdown
## Phase 1: Domain Expertise
**→ Query 1:**
orchestr8://agents/match?query=${domain}+expert&mode=index&maxResults=8

## Phase 2: Specific Skills
**→ Query 2:**
orchestr8://skills/match?query=${specific-technique}+${tech}&mode=index&maxResults=5

Load different resources at different phases
```

### Complementary Queries

```markdown
## Phase 2: Implementation

**→ Core Query (expertise):**
orchestr8://agents/match?query=${tech}+${domain}&mode=index&maxResults=8

**→ Supplementary Query (techniques):**
orchestr8://skills/match?query=${pattern}+${technique}&mode=index&maxResults=5

Load complementary resources together
```

## Real-World Example

### User Request:
"Build a Python microservice for processing payments with Stripe integration"

### Dynamic Workflow Execution:

```markdown
## Phase 1: Requirements (0-15%)

**→ Query:**
orchestr8://match?query=python+microservice+payment+stripe&categories=agent,pattern&mode=index&maxResults=8

**FuzzyMatcher assembles:**
- python-core (agent, 600 tokens)
- python-api-fastapi (agent, 500 tokens)
- architecture-microservices (pattern, 600 tokens)
- payment-integration-patterns (pattern, 450 tokens)

Total: 2150 tokens (over budget)

**FuzzyMatcher selects top 3 by score:**
- python-api-fastapi (500 tokens, score: 85)
- architecture-microservices (600 tokens, score: 72)
- payment-integration-patterns (450 tokens, score: 68)

**Final load: 1550 tokens, 100% relevant**

Extract: Need FastAPI, microservice pattern, Stripe SDK

## Phase 2: Implementation (15-85%)

**→ Query (based on Phase 1):**
orchestr8://match?query=python+fastapi+stripe+api+integration&categories=agent,skill,example&mode=index&maxResults=10

**Assembles:**
- python-fastapi-advanced (agent, 600 tokens)
- api-integration-patterns (skill, 550 tokens)
- error-handling-payment (skill, 480 tokens)
- python-stripe-integration (example, 500 tokens)

Total: 2130 tokens, highly relevant to implementation

## Phase 3: Testing (85-100%)

**→ Query:**
orchestr8://skills/match?query=testing+python+fastapi+integration&mode=index&maxResults=5

**Assembles:**
- testing-integration-api (skill, 580 tokens)
- testing-payment-flows (skill, 450 tokens)

Total: 1030 tokens, focused on testing

**Result:**
- Total loaded: 4710 tokens across all phases
- All highly relevant to request
- vs Static approach: Would load 8000+ tokens with 50% relevance
- Savings: 41% fewer tokens, higher quality
```

## Best Practices

✅ **Use argument substitution** - Let user input drive queries
✅ **Phase-based budgeting** - Allocate tokens appropriately per phase
✅ **Progressive refinement** - Use early phase findings to refine later queries
✅ **Extract key terms** - Parse user input for better queries
✅ **Test with real requests** - Verify workflows adapt correctly

❌ **Don't hardcode static URIs** - Loses adaptation benefit
❌ **Don't use same query all phases** - Each phase needs different expertise
❌ **Don't ignore phase findings** - Use discoveries to refine next phase
❌ **Don't over-budget early phases** - Save tokens for implementation

## Integration Checklist

```markdown
Converting static workflow to dynamic:

□ Replace static URIs with dynamic match URIs
□ Add argument substitution (${arg-name})
□ Set appropriate token budgets per phase
□ Use category filters to narrow search
□ Extract key findings between phases
□ Use findings to refine subsequent queries
□ Test with diverse user requests
□ Verify token efficiency improvements
```
