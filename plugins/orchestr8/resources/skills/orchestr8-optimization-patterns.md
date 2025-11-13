---
id: orchestr8-optimization-patterns
category: skill
tags: [orchestr8, token-optimization, jit-loading, fragments, best-practices, performance]
capabilities:
  - Quick reference for Orchestr8 token optimization patterns
  - Practical examples of JIT loading implementation
  - Fragment sizing and organization guidelines
  - Token budget management strategies
useWhen:
  - Need quick reference for token optimization patterns
  - Implementing JIT loading in workflows or commands
  - Deciding how to structure and size fragments
  - Optimizing existing resources for better token efficiency
  - Creating commands with progressive resource loading
estimatedTokens: 900
relatedResources:
  - orchestr8://agents/orchestr8-expert
  - orchestr8://skills/fragment-creation-workflow
  - orchestr8://skills/jit-loading-progressive-strategies
  - orchestr8://patterns/dynamic-expertise-core
---

# Orchestr8 Optimization Patterns - Quick Reference

## Pattern 1: JIT Loading in Workflows

**Problem:** Loading all resources upfront wastes 10,000+ tokens

**Solution:** Load resources progressively as needed

```markdown
## Phase 1: Discovery (0-30%)

**→ Load:** orchestr8://match?query=requirement+analysis&mode=index&maxResults=5

**Activities:**
- Analyze requirements
- Use loaded analysis skills

**→ Checkpoint:** Requirements documented

## Phase 2: Implementation (30-70%)

**→ Load:** orchestr8://match?query=typescript+api+implementation&mode=index&maxResults=8

**Activities:**
- Implement features
- Apply loaded expertise

**→ Checkpoint:** Implementation complete

## Phase 3: Testing (70-100%)

**→ Load:** orchestr8://match?query=testing+validation&mode=index&maxResults=3

**Activities:**
- Write tests
- Validate implementation

**→ Checkpoint:** Complete
```

**Token Savings:**
- Traditional: 10,000+ tokens upfront
- JIT: 3,500 tokens progressively (65% reduction)

---

## Pattern 2: Progressive Agent Loading

**Problem:** Large monolithic agents waste tokens for common use cases

**Solution:** Split into core + advanced modules

```
typescript-expert.md (600 tokens)
├─ Essential TypeScript patterns
├─ Common use cases (80% usage)
└─ Reference: orchestr8://agents/typescript-expert-advanced

typescript-expert-advanced.md (700 tokens, loaded on-demand)
├─ Advanced type system features
├─ Complex generics and conditional types
└─ Edge cases (20% usage)
```

**Usage:**
```yaml
# Common case: Load core only
→ orchestr8://agents/typescript-expert
Tokens: 600

# Advanced case: Load both
→ orchestr8://agents/typescript-expert
→ orchestr8://agents/typescript-expert-advanced
Tokens: 1,300 (vs 1,800 monolithic = 28% savings)
```

---

## Pattern 3: Index-Optimized Metadata

**Problem:** Poor metadata = fuzzy fallback = 800-2000 tokens

**Solution:** Write keyword-rich useWhen scenarios for O(1) index lookup

```yaml
# ❌ BAD: Generic, no keywords, triggers fuzzy fallback
useWhen:
  - Working with APIs
  - Need TypeScript help
  - Error handling

# ✅ GOOD: Specific, keyword-rich, enables index lookup
useWhen:
  - Implementing retry logic with exponential backoff for HTTP API calls
  - Building circuit breaker pattern for third-party REST service failures
  - Adding request timeout handling with graceful degradation strategies
  - Designing rate limiting middleware for Express API endpoints
  - Creating typed error responses with consistent HTTP status codes
```

**Token Savings:**
- Bad metadata → Fuzzy: 800-2000 tokens
- Good metadata → Index: 50-120 tokens (85-95% reduction)

---

## Pattern 4: Fragment Size Optimization

**Decision Tree:**

```
Token Count < 300?
├─ YES → Too small, merge with related fragment
└─ NO → Continue

Token Count 500-1000?
├─ YES → ✅ Optimal size, publish as-is
└─ NO → Continue

Token Count 1000-1500?
├─ YES → Acceptable, but consider splitting
└─ NO → Continue

Token Count > 1500?
└─ YES → Must split into:
          - Core (500-700 tokens)
          - Advanced (600-800 tokens)
```

**Example Split:**

```yaml
# Before: 2,100 tokens (too large)
typescript-expert.md

# After: Split into optimal sizes
typescript-expert-core.md          (650 tokens) ✅
typescript-expert-async.md         (750 tokens) ✅
typescript-expert-advanced-types.md (700 tokens) ✅
```

**Benefits:**
- Better matching relevance
- Precise token budgeting
- Improved cache efficiency
- 25-40% reduction vs monolithic

---

## Pattern 5: Catalog-First Exploration

**Problem:** Users need to explore before committing tokens

**Solution:** Use catalog mode, then load specific resources

```typescript
// Step 1: Explore options (index mode - RECOMMENDED)
const query = "orchestr8://match?query=async+patterns&mode=index&maxResults=5"
// Returns: 5 fragments, URIs + names only, ~80 tokens

// Step 2: User reviews options:
// - typescript-async-patterns (~750 tokens)
// - python-async-fundamentals (~680 tokens)
// - rust-async-tokio (~800 tokens)
// - error-handling-async (~650 tokens)
// - performance-async-optimization (~720 tokens)

// Step 3: Load specific choice
const specific = "orchestr8://skills/typescript-async-patterns"
// Returns: Full content, 750 tokens

// Token cost: 80 + 750 = 830 tokens
// vs mode=catalog: 1,500 + 750 = 2,250 tokens
// vs mode=full: 5,000+ tokens upfront
// Savings: 83% with index mode
```

---

## Pattern 6: Token Budget Management

**Workflow Budget Guidelines:**

```
Small workflow (bug fix, quick feature):
├─ 2-3 phases
├─ 800-1,200 tokens per phase
└─ Total: 2,000-3,000 tokens

Medium workflow (feature development):
├─ 3-5 phases
├─ 1,000-1,500 tokens per phase
└─ Total: 4,000-6,000 tokens

Large workflow (system design, migration):
├─ 5-8 phases
├─ 1,200-2,000 tokens per phase
└─ Total: 8,000-12,000 tokens
```

**Phase Budget Example:**

```markdown
## Phase 1: Analysis (Budget: 1,200 tokens)

**→ Load:** orchestr8://match?query=system+analysis&mode=index&maxResults=5

**If needed (conditional):**
**→ Load:** orchestr8://patterns/architecture-analysis (add 600 tokens)

**Phase budget tracking:**
- Base: 1,200 tokens
- Conditional: +600 tokens
- Max: 1,800 tokens
- Actual: Monitor and adjust next phase if exceeded
```

---

## Pattern 7: Cross-Reference Navigation

**Problem:** Users can't discover related resources

**Solution:** Rich relatedResources for JIT navigation

```yaml
relatedResources:
  # Related skills (complementary knowledge)
  - orchestr8://skills/error-handling-async
  - orchestr8://skills/testing-async-patterns
  
  # Related patterns (design approaches)
  - orchestr8://patterns/async-concurrency-patterns
  
  # Related examples (practical code)
  - orchestr8://examples/typescript-async-api-client
  
  # Advanced module (progressive loading)
  - orchestr8://agents/typescript-expert-advanced
```

**Benefits:**
- Users load what they need, when they need it
- ~207 cross-references across 383 fragments
- Enables organic discovery
- Reduces upfront token cost

---

## Pattern 8: Command JIT Loading

**Structure:**

```markdown
---
description: Command description
argument-hint: [arguments]
---

# Command: $ARGUMENTS

## Token Efficiency Note

**Traditional (WASTEFUL):** Load all experts upfront (~13,000 tokens)
**JIT (OPTIMAL):** Load catalog + on-demand expertise (~1,500 tokens)
**Savings:** 88% reduction

## Phase 0: Planning (0-20%)

**→ Load:** orchestr8://match?query=project+planning&mode=index&maxResults=3

**Activities:**
- Create project plan
- Define architecture

**→ Checkpoint:** Plan approved

## Phase 1: Implementation (20-70%)

**→ Load:** orchestr8://match?query=typescript+backend+api&mode=index&maxResults=8

**Activities:**
- Implement backend
- Create API endpoints

**→ Checkpoint:** Implementation complete

## Phase 2: Testing (70-100%)

**→ Load:** orchestr8://match?query=e2e+testing+playwright&mode=index&maxResults=5

**Activities:**
- Write tests
- Validate functionality

**→ Checkpoint:** Complete
```

**Token Breakdown:**
- Phase 0: 800 tokens
- Phase 1: 1,500 tokens
- Phase 2: 1,000 tokens
- Total: 3,300 tokens (vs 13,000 = 75% reduction)

---

## Pattern 9: Hierarchical Organization

**Family Structure:**

```
performance/ (parent category)
├── performance-optimization.md (parent, 550 tokens)
│   └── Cross-refs to children for specific areas
├── performance-frontend-optimization.md (child, 650 tokens)
│   └── Frontend-specific deep dive
├── performance-api-optimization.md (child, 700 tokens)
│   └── API-specific deep dive
└── performance-database-optimization.md (child, 800 tokens)
    └── Database-specific deep dive
```

**User Journey:**

```
User query: "optimize API performance"

Match: performance-api-optimization.md (700 tokens)
Cross-ref loads: performance-optimization.md (550 tokens)
Total: 1,250 tokens

Without hierarchy: Would load all performance fragments (2,700 tokens)
Savings: 54%
```

---

## Pattern 10: Validation Checklist

**Before Publishing Any Resource:**

```
Size & Structure:
□ Token count: 500-1000 (optimal) or <1500 (max)
□ If >1500: Split into core + advanced
□ If <300: Merge with related fragment

Metadata:
□ id: descriptive-hyphenated-name
□ category: correct category
□ tags: 5-15 specific, searchable tags
□ capabilities: 3-8 action-oriented items
□ useWhen: 5-20 keyword-rich scenarios
□ estimatedTokens: accurate count
□ relatedResources: 3-10 cross-references

Content:
□ Clear structure (## headings)
□ Practical code examples
□ Best practices section
□ Common pitfalls section
□ Copy-paste ready snippets

Integration:
□ Commands use orchestr8://match JIT loading
□ Workflows use progressive phased loading
□ maxTokens specified for all match queries
□ Cross-references use orchestr8:// URIs
□ Index rebuilt: npm run build-index
```

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: Upfront Loading
```markdown
# BAD: Load everything at start
**→ Load:** orchestr8://agents/full-expert
**→ Load:** orchestr8://skills/all-skills
**→ Load:** orchestr8://patterns/all-patterns

# Result: 10,000+ tokens wasted, slow, poor UX
```

### ❌ Anti-Pattern 2: Monolithic Resources
```yaml
# BAD: Giant 2,500 token resource
---
id: giant-expert
estimatedTokens: 2500
---
# Everything about TypeScript in one file
```

### ❌ Anti-Pattern 3: Generic Metadata
```yaml
# BAD: Triggers fuzzy fallback (800-2000 tokens)
useWhen:
  - TypeScript help
  - API work
  - Need assistance
```

### ❌ Anti-Pattern 4: No Token Budgets
```markdown
# BAD: Unbounded loading
**→ Load:** orchestr8://match?query=typescript
# Could return 5,000+ tokens!
```

### ❌ Anti-Pattern 5: Missing Cross-References
```yaml
# BAD: Dead-end resource
relatedResources: []
# Users can't discover related content
```

---

## Quick Reference: Token Targets

**Fragment Sizes:**
- Optimal: 650-850 tokens (sweet spot)
- Good: 500-1000 tokens
- Acceptable: 300-1500 tokens
- Too small: <300 tokens (merge)
- Too large: >1500 tokens (split)

**Query Budgets:**
- Discovery: 500-800 tokens
- Implementation: 1,000-1,500 tokens
- Advanced: 1,500-2,000 tokens
- Per phase: 1,000-2,000 tokens
- Per workflow: 3,000-6,000 tokens

**Mode Token Costs:**
- index: 50-120 tokens (IDs + URIs)
- minimal: 300-500 tokens (JSON metadata)
- catalog: 800-2000 tokens (full metadata)
- full: 5,000-15,000 tokens (all content)

**Match Query Guidelines:**
- Always specify: `mode=index&maxResults=5`
- Typical range: 800-2000 tokens
- Discovery: 500-1000 tokens
- Implementation: 1,000-1,500 tokens
- Comprehensive: 1,500-2,000 tokens

---

## Real-World Example: Optimized Workflow

```markdown
---
description: Build TypeScript REST API with testing
---

# Workflow: TypeScript REST API

## Token Efficiency

**Traditional:** Load all TypeScript + API + testing expertise = ~15,000 tokens
**JIT Approach:** Progressive loading = ~4,200 tokens (72% reduction)

## Phase 1: Setup & Architecture (0-25%)

**→ Load:** orchestr8://match?query=typescript+api+architecture+setup&mode=index&maxResults=5

**Activities:**
1. Initialize TypeScript project
2. Configure Express + dependencies
3. Design API architecture

**Loaded expertise:**
- TypeScript configuration best practices
- Express setup and middleware patterns
- API design principles

**→ Checkpoint:** Project initialized, architecture designed

## Phase 2: Implementation (25-70%)

**→ Load:** orchestr8://match?query=express+routes+validation+error+handling&mode=index&maxResults=8

**Activities:**
1. Implement API endpoints
2. Add request validation
3. Implement error handling
4. Add logging middleware

**Loaded expertise:**
- Express route handlers
- Request validation with Zod
- Error handling patterns
- Middleware implementation

**→ Checkpoint:** API implemented

## Phase 3: Testing (70-90%)

**→ Load:** orchestr8://match?query=api+testing+jest+supertest&mode=index&maxResults=5

**Activities:**
1. Write integration tests
2. Test error cases
3. Validate responses

**Loaded expertise:**
- Jest configuration
- Supertest API testing
- Test organization patterns

**→ Checkpoint:** Tests passing

## Phase 4: Documentation (90-100%)

**→ Load:** orchestr8://match?query=api+documentation+openapi&mode=index&maxResults=3

**Activities:**
1. Generate OpenAPI spec
2. Write README

**Loaded expertise:**
- OpenAPI specification
- API documentation best practices

**→ Checkpoint:** Complete

## Token Budget Summary

- Phase 1: 1,200 tokens
- Phase 2: 1,500 tokens
- Phase 3: 1,000 tokens
- Phase 4: 500 tokens
- **Total: 4,200 tokens (vs 15,000 traditional = 72% savings)**
```

---

## Summary: Apply These Patterns

**Every time you create a resource:**

1. ✅ Size it optimally (500-1000 tokens)
2. ✅ Write keyword-rich useWhen scenarios
3. ✅ Add 3-10 cross-references
4. ✅ Use JIT loading in workflows/commands
5. ✅ Specify maxTokens in all queries
6. ✅ Split if >1500 tokens (core + advanced)
7. ✅ Organize into families when related
8. ✅ Enable catalog-first exploration
9. ✅ Track token budgets per phase
10. ✅ Validate before publishing

**Result: 95-98% token reduction across the system** 🎯
