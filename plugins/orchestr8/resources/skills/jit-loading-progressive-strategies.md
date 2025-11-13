---
id: jit-loading-progressive-strategies
category: skill
tags: [jit, loading, progressive-loading, lazy-loading, incremental-detail, reuse, meta]
capabilities:
  - Lazy loading patterns for optional resources
  - Incremental detail loading (general → specific)
  - Resource reuse across workflow phases
  - Conditional loading based on runtime conditions
useWhen:
  - Designing progressive fragment loading strategy starting with high-level overview then drilling into specifics
  - Implementing iterative refinement pattern loading additional expertise fragments based on subtask requirements
  - Creating hierarchical loading approach starting with architectural patterns then loading implementation details
  - Building adaptive loading system adjusting fragment selection based on user feedback and workflow success metrics
  - Designing load-on-demand strategy for specialized fragments activating deep expertise only when task complexity requires it
estimatedTokens: 640
---

# JIT Loading: Progressive Strategies

Advanced strategies for progressive, lazy, and incremental resource loading to maximize token efficiency.

## Strategy 1: Lazy Loading

**Don't load what you might not need:**
```markdown
## Phase 3: Implementation (30-80%)
Implement core features

## Phase 4: Optimization (80-90%) [CONDITIONAL]
Only if Phase 3 reveals performance issues:
**→ Load:** `orchestr8://skills/match?query=performance+optimization+${tech}&mode=index&maxResults=5`

Don't load performance optimization upfront if not needed
```

**Example:**
```markdown
## Phase 5: Security Hardening [OPTIONAL]
Only if handling sensitive data or production deployment:
**→ Load:** `orchestr8://skills/match?query=security+${threat-model}+${tech}&mode=index&maxResults=5`

## Phase 6: Deployment [CONDITIONAL]
Only if user requests deployment:
**→ Load:** `orchestr8://skills/match?query=deployment+${platform}+${tech}&mode=index&maxResults=5`
```

## Strategy 2: Incremental Detail

**Load general → specific:**
```markdown
## Phase 1: High-level design (0-20%)
**→ Load:** `orchestr8://patterns/match?query=architecture+${type}&mode=index&maxResults=5`
General architectural patterns

## Phase 2: Detailed design (20-40%)
**→ Load:** `orchestr8://agents/match?query=${specific-tech}+${component}&mode=index&maxResults=8`
Specific technology expertise for implementation
```

**Example:**
```markdown
## Phase 1: API Design (0-20%)
**→ Load:** `orchestr8://patterns/match?query=api+design+rest&mode=index&maxResults=3`
General REST API patterns

## Phase 2: Framework Implementation (20-60%)
**→ Load:** `orchestr8://agents/match?query=${framework}+api+implementation&mode=index&maxResults=8`
Framework-specific implementation details
```

## Strategy 3: Reuse Across Phases

**Load once, use multiple times:**
```markdown
## Phase 2 + 3: Design and Implementation (15-85%)
**→ Load once:** `orchestr8://match?query=${tech-stack}+${architecture}&categories=agent,skill,pattern&mode=index&maxResults=12`

Use loaded expertise for both:
- Phase 2: Architecture decisions
- Phase 3: Implementation guidance

Avoid reloading same content
```

**Example:**
```markdown
## Phases 2-4: Design Through Testing (20-90%)
**→ Comprehensive Load:**
orchestr8://match?query=${tech}+${domain}+full-stack&categories=agent,skill,example&mode=index&maxResults=15

Single load supports:
- Phase 2: Architecture design
- Phase 3: Implementation
- Phase 4: Testing patterns

→ Reuse across 3 phases instead of 3 separate loads
```

## Strategy 4: Conditional Branching

```markdown
## Phase 3: Data Layer (40-60%)

**If user selected SQL database:**
**→ Load:** `orchestr8://match?query=sql+${database}+orm&mode=index&maxResults=8`

**Else if user selected NoSQL:**
**→ Load:** `orchestr8://match?query=nosql+${database}+modeling&mode=index&maxResults=7`

**Else if user selected in-memory:**
**→ Load:** `orchestr8://match?query=cache+${cache-tech}+patterns&mode=index&maxResults=5`

Load different expertise based on runtime decisions
```

## Strategy 5: Adaptive Budgeting

```markdown
## Phase 3: Implementation (30-80%)

**Initial budget:** 2500 tokens

**If simple CRUD:**
Reduce budget: 1800 tokens
**→ Load:** `orchestr8://match?query=${tech}+crud+basic&mode=index&maxResults=8`

**If complex business logic:**
Increase budget: 3000 tokens
**→ Load:** `orchestr8://match?query=${tech}+${domain}+complex&mode=index&maxResults=12`

**If microservices:**
Split across sub-phases: 2 × 1500 tokens
**→ Load Service A:** `orchestr8://match?query=${tech}+${service-a}&mode=index&maxResults=8`
**→ Load Service B:** `orchestr8://match?query=${tech}+${service-b}&mode=index&maxResults=8`

Adjust budgets based on actual complexity
```

## Optimization Patterns

### Pattern 1: Fallback Loading

```markdown
## Phase 2: Implementation

**Primary:** Try dynamic loading
orchestr8://match?query=${specific-requirements}&mode=index&maxResults=8

**Fallback:** If no good matches, use static reliable resource
orchestr8://agents/typescript-developer

→ Ensures expertise always available
```

### Pattern 2: Incremental Budget Allocation

```markdown
Total budget: 5000 tokens
Reserved: 1000 tokens for contingency

Phase 1: 800 tokens (16%)
Phase 2: 1500 tokens (30%)
Phase 3: Budget remaining 2700 tokens (54%)
Contingency: 1000 tokens

→ Allocate largest budget to most critical phase
→ Keep reserve for unexpected needs
```

### Pattern 3: Context Accumulation

```markdown
## Phase 1: Research (0-15%)
Load: 800 tokens
Findings: Tech stack, requirements

## Phase 2: Design (15-30%)
Load: 1500 tokens
Context: Phase 1 findings + Phase 2 expertise
Total context: 2300 tokens

## Phase 3: Implementation (30-80%)
Load: 2500 tokens
Context: Phase 1 + Phase 2 findings + Phase 3 expertise
Total context: 4800 tokens

→ Context grows progressively
→ Only load new information each phase
```

## Best Practices

✅ **Lazy load optional phases** - Don't load optimization if not needed
✅ **General → specific** - High-level patterns first, detailed implementation later
✅ **Reuse across phases** - Load once if applicable to multiple phases
✅ **Conditional branching** - Load different resources based on decisions
✅ **Adaptive budgeting** - Adjust budgets based on actual complexity

❌ **Don't load everything** - Progressive loading saves tokens
❌ **Don't reload** - Reuse when applicable
❌ **Don't use fixed budgets** - Adapt to actual needs
❌ **Don't ignore context** - Leverage accumulated knowledge
