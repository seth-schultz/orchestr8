---
id: jit-loading-phase-budgets
category: skill
tags: [jit, loading, optimization, token-budgeting, phases, context-management, meta]
capabilities:
  - Phase-based token budget allocation strategies
  - Per-phase resource loading patterns
  - Token utilization optimization across workflow phases
  - Progressive expertise loading by complexity
useWhen:
  - Managing token budgets across workflow assembly phases allocating context window for agent, skill, and pattern loading
  - Implementing progressive disclosure strategy loading essential fragments first with conditional deep-dive expansion
  - Designing multi-phase JIT loading balancing initial context with on-demand expertise based on task complexity
  - Creating budget allocation heuristics prioritizing high-impact fragments within Claude model context limits
  - Optimizing workflow token efficiency with fragment chunking and selective loading based on relevance scores
estimatedTokens: 700
---

# JIT Loading: Phase-Based Token Budgets

Optimize token usage by allocating appropriate budgets per workflow phase and loading resources exactly when needed.

## Load Per Phase, Not Upfront

**Anti-pattern:**
```markdown
## Workflow Start

Load everything upfront:
- orchestr8://agents/typescript-developer (1500 tokens)
- orchestr8://agents/database-expert (1200 tokens)
- orchestr8://skills/testing (1000 tokens)
- orchestr8://skills/deployment (900 tokens)
- orchestr8://patterns/microservices (800 tokens)

Total: 5400 tokens loaded immediately
Usage: ~40% actually used (3600 tokens wasted)
```

**JIT Pattern:**
```markdown
## Phase 1: Requirements (0-15%)
**→ Load:** `orchestr8://agents/match?query=research+requirements&mode=index&maxResults=3`
(800 tokens, 100% utilized)

## Phase 2: Design (15-30%)
**→ Load:** `orchestr8://match?query=${tech-stack}+architecture&categories=agent,pattern&mode=index&maxResults=8`
(1500 tokens, 95% utilized)

## Phase 3: Implementation (30-85%)
**→ Load:** `orchestr8://match?query=${tech}+${features}&categories=agent,skill,example&mode=index&maxResults=10`
(2500 tokens, 90% utilized)

## Phase 4: Integration (85-100%)
**→ Load:** `orchestr8://skills/match?query=testing+integration+${tech}&mode=index&maxResults=5`
(1000 tokens, 100% utilized)

Total: 5800 tokens across 4 phases, 93% utilization
Effective savings: 47% reduction in wasted tokens
```

## Token Budget Allocation

### Phase-based budgets

```markdown
Total workflow budget: 4000-6000 tokens

Phase 1 - Research (0-15%): 800-1200 tokens
- Focus: Understanding requirements
- Load: Research agents, requirement skills
- Budget: 800-1200 (smaller, focused)

Phase 2 - Design (15-30%): 1500-2000 tokens
- Focus: Architecture planning
- Load: Domain experts, architectural patterns
- Budget: 1500-2000 (medium)

Phase 3 - Implementation (30-85%): 2000-3000 tokens
- Focus: Building the solution
- Load: Technical experts, implementation skills, code examples
- Budget: 2000-3000 (largest, need details)

Phase 4 - Integration (85-100%): 500-1000 tokens
- Focus: Testing and validation
- Load: Testing skills, integration patterns
- Budget: 500-1000 (smaller, focused)
```

### Budget by complexity

```markdown
Simple tasks (CRUD API):
- Total: 3000-4000 tokens
- Per phase: 600, 1000, 1500, 600

Medium complexity (microservice):
- Total: 4000-5500 tokens
- Per phase: 1000, 1500, 2500, 800

High complexity (distributed system):
- Total: 5500-7000 tokens
- Per phase: 1200, 2000, 3000, 1000
```

## Dynamic URI Construction

### Pattern 1: Argument-Based Queries

```markdown
---
arguments:
  - name: project-description
    required: true
---

## Phase 1
**→ Dynamic:** `orchestr8://match?query=${project-description}&categories=agent&mode=index&maxResults=8`

This analyzes user's full request and loads relevant agents.
```

### Pattern 2: Multi-Stage Refinement

```markdown
## Phase 1: Research (0-15%)
**→ Load:** `orchestr8://agents/match?query=research+${domain}&mode=index&maxResults=3`

Identify: Technology stack, architecture pattern

## Phase 2: Design (15-30%)
**→ Load based on Phase 1 findings:**
orchestr8://match?query=${tech-stack}+${architecture}&categories=agent,pattern&mode=index&maxResults=8`

Refine based on what Phase 1 learned
```

### Pattern 3: Category Filtering

```markdown
Early phases (research/design):
orchestr8://agents/match?query=${domain}
→ Load expert agents only

Middle phases (implementation):
orchestr8://match?query=${tech}+${feature}&categories=agent,skill,example
→ Load agents + skills + code examples

Late phases (testing/deployment):
orchestr8://skills/match?query=testing+deployment+${tech}
→ Load skills only
```

## Monitoring & Adjustment

### Track Token Usage

```markdown
Workflow execution:

## Phase 1: Research
Loaded: 850 tokens (budget: 1000)
Utilization: 85% ✅
Remaining total budget: 5150 tokens

## Phase 2: Design
Loaded: 1700 tokens (budget: 1800)
Utilization: 94% ✅
Remaining total budget: 3450 tokens

## Phase 3: Implementation
Loaded: 2600 tokens (budget: 2800)
Utilization: 93% ✅
Remaining total budget: 850 tokens

→ Adjust Phase 4 budget to 850 or use static minimal resource
```

### Optimization Signals

**When to reduce budgets:**
```markdown
- Loaded content had low utilization (<60%)
- Simple task, over-budgeted
- Remaining phases simple, save tokens

Action: Reduce maxTokens in subsequent phases
```

**When to increase budgets:**
```markdown
- Content was insufficient, need more detail
- Task more complex than anticipated
- Critical implementation phase needs thorough guidance

Action: Increase maxTokens, potentially reduce later phases
```

## Best Practices

✅ **Load per phase** - Don't load everything upfront
✅ **Budget appropriately** - Higher for implementation, lower for planning/integration
✅ **Monitor usage** - Track token utilization and adjust
✅ **Progressive refinement** - Use Phase N findings to load Phase N+1 resources
✅ **Lazy loading** - Load optimization/deployment only if needed

❌ **Upfront loading** - Don't load all resources at start
❌ **Over-budgeting** - Don't set maxTokens too high
❌ **No monitoring** - Track and adjust based on actual usage
