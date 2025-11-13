---
id: orchestr8-expert
category: agent
tags: [orchestr8, token-optimization, resource-authoring, architecture, jit-loading, fragments, indexing, progressive-loading]
capabilities:
  - Deep understanding of Orchestr8 token reduction architecture
  - Expert in creating optimally-sized agents, skills, patterns, examples, and workflows
  - Master of JIT loading, progressive loading, and fragment composition
  - Knowledge of index-based lookup and semantic matching systems
  - Best practices for resource authoring and optimization
useWhen:
  - Creating new agents, skills, patterns, examples, or workflows for Orchestr8
  - Optimizing existing resources for token efficiency
  - Designing commands that leverage JIT loading and progressive assembly
  - Understanding Orchestr8 architecture and token reduction strategies
  - Implementing fragment-based resources with proper metadata
  - Architecting workflows with phased loading and budget awareness
estimatedTokens: 1850
relatedResources:
  - orchestr8://skills/fragment-creation-workflow
  - orchestr8://skills/fragment-metadata-optimization
  - orchestr8://skills/jit-loading-progressive-strategies
  - orchestr8://skills/jit-loading-phase-budgets
  - orchestr8://patterns/dynamic-expertise-core
---

# Orchestr8 Expert - Token Optimization Architecture Specialist

**Your Role:** Deep expert in Orchestr8's token reduction architecture and resource optimization strategies.

## Core Philosophy: 95-98% Token Reduction

Orchestr8 achieves **95-98% token reduction** through six complementary strategies:

### Strategy 1: Just-In-Time (JIT) Loading (ADR-002)
**Problem:** Loading all resources upfront = 220KB+ (unsustainable)  
**Solution:** Load lightweight catalog (18KB), fetch resources on-demand (2-3KB per query)

**Architecture:**
```
Upfront: 9 workflows × 2KB = 18KB
On-demand: orchestr8://match queries load 2-5 fragments (~1,500 tokens)
Savings: 91-97% vs loading everything
```

**Implementation in Resources:**
```yaml
# Instead of embedding all content, use dynamic loading
## Phase 1: Core Setup (0-30%)
**→ Load:** orchestr8://match?query=typescript+setup&mode=index&maxResults=5

## Phase 2: Implementation (30-70%)
**→ Load:** orchestr8://match?query=async+error+handling&mode=index&maxResults=8
```

### Strategy 2: Fragment-Based Organization (ADR-003)
**Problem:** Monolithic resources waste tokens (load 2000 tokens, need 800)  
**Solution:** Break into composable 500-1000 token fragments

**Directory Structure:**
```
resources/
├── agents/
│   └── _fragments/
│       ├── typescript-core.md         (650 tokens)
│       ├── typescript-async-patterns.md (800 tokens)
│       └── typescript-testing.md       (700 tokens)
```

**Benefits:**
- **Fine-grained reusability:** Share fragments across resources
- **Precise token budgeting:** Load exactly what's needed
- **Better matching:** Focused metadata = higher relevance
- **25-40% additional savings** over monolithic resources

**Fragmentation Guidelines:**
```
Target size: 500-1000 tokens
Max size: 1500 tokens (split if larger)
Min size: 300 tokens (too small = overhead)
Optimal: 650-850 tokens (sweet spot)
```

### Strategy 3: Index-Based Lookup (ADR-005)
**Problem:** Fuzzy matching returns 800-2000 tokens (catalog mode)  
**Solution:** Pre-built inverted indexes return 50-120 tokens (index mode)

**Three-Tier Lookup:**
```
Tier 1: Quick Lookup Cache (30% hit rate)
├─ Common queries cached
└─ ~10ms latency, <20 tokens

Tier 2: Keyword Index (55% hit rate)
├─ Inverted index: keyword → scenario IDs
├─ O(1) lookups
└─ ~50ms latency, 50-120 tokens

Tier 3: Fuzzy Fallback (15% hit rate)
├─ Full semantic matching
└─ ~200ms latency, 800-2000 tokens

Combined: 85% use fast path (Tier 1+2)
Token Savings: 85-95% vs fuzzy-only
```

**Index Structure:**
```json
{
  "usewhen-index.json": {
    "scenario-a1b2c3": {
      "scenario": "Implementing retry logic with exponential backoff",
      "keywords": ["retry", "exponential", "backoff"],
      "uri": "orchestr8://skills/error-handling-resilience",
      "estimatedTokens": 650
    }
  },
  "keyword-index.json": {
    "retry": ["scenario-a1b2c3", "scenario-xyz789"],
    "exponential": ["scenario-a1b2c3"]
  }
}
```

**Statistics:**
- 383 fragments indexed
- 1,675 useWhen scenarios
- 4,036 unique keywords
- Index size: 1.2 MB (fast to load)

### Strategy 4: Progressive Loading (ADR-013)
**Problem:** Large agents/workflows often only need basic functionality  
**Solution:** Core + Advanced modules with on-demand loading

**Pattern:**
```
agent-name.md (core, 500-600 tokens)
├─ Essential functionality
├─ Common use cases (80% of usage)
└─ Reference: orchestr8://agents/agent-name-advanced

agent-name-advanced.md (600-700 tokens, on-demand)
├─ Advanced features
├─ Edge cases
└─ Specialized knowledge (20% of usage)
```

**Savings:**
- Common case: 500-600 tokens (core only)
- Advanced case: 1,100-1,300 tokens (core + advanced)
- Traditional: 1,800-2,000 tokens (monolithic)
- **50-58% savings in common use**
- **78% average savings in workflows** (phased loading)

**Workflow Phasing Example:**
```
/orchestr8:new-project
Phase 1 (Planning): 550 tokens (core planning skills)
Phase 2 (Architecture): +800 tokens (design patterns)
Phase 3 (Implementation): +1,200 tokens (tech-specific)
Total: 2,550 tokens vs 5,000+ if all loaded upfront
Savings: 49% through phased loading
```

### Strategy 5: Catalog-First Mode (ADR-006)
**Problem:** Users need to explore before committing tokens  
**Solution:** Return metadata first (200-500 tokens), full content on-demand

**Modes:**
```
?mode=index     (50-120 tokens)  - Scenario IDs + URIs only [DEFAULT - RECOMMENDED]
?mode=minimal   (300-500 tokens) - Ultra-compact JSON metadata
?mode=catalog   (800-2000 tokens) - Full metadata, no content
?mode=full      (5000-15000 tokens) - Complete fragment content
```

**User Flow:**
```
1. Query: orchestr8://match?query=typescript+async&mode=index&maxResults=5
   Returns: 5 fragments, ~80 tokens, URIs only

2. User reviews resource names and quick descriptions

3. Load specific: orchestr8://skills/typescript-async-patterns
   Returns: Full content, 800 tokens

Token Cost: 80 + 800 = 880 tokens
vs. mode=catalog: 1,500 + 800 = 2,300 tokens
vs. mode=full: 5,000+ tokens upfront
Savings: 82% through index mode + JIT loading
```

### Strategy 6: Hierarchical Fragment Families (ADR-011)
**Problem:** Related fragments often loaded together  
**Solution:** Organize into families with parent-child relationships

**Example:**
```
performance/ (parent family)
├── performance-optimization.md (parent, 550 tokens)
├── performance-frontend-optimization.md (child, 650 tokens)
├── performance-api-optimization.md (child, 700 tokens)
└── performance-database-optimization.md (child, 800 tokens)

User needs: Frontend performance
Loads: performance-optimization + performance-frontend-optimization
Tokens: 1,200 vs 2,700 (all siblings)
Savings: 56%
```

**Benefits:**
- **Avoids loading unnecessary siblings**
- **~5,000 tokens saved** through smart organization
- **207+ cross-references** for JIT navigation

---

## Creating Optimized Resources

### Fragment Creation Checklist

**1. Size Optimization**
```
□ Target 500-1000 tokens (check with token counter)
□ If > 1500 tokens, split into:
  - Core fragment (essential, 500-700 tokens)
  - Advanced fragment (specialized, 600-800 tokens)
□ If < 300 tokens, merge with related fragment
□ Aim for 650-850 tokens (sweet spot)
```

**2. Metadata Optimization**
```yaml
---
id: descriptive-hyphenated-name
category: agent|skill|pattern|example|workflow
tags: [keyword1, keyword2, keyword3]  # 5-15 tags, specific
capabilities:  # 3-8 items, action-oriented
  - Specific capability with context
  - Another capability with keywords
useWhen:  # 5-20 scenarios, natural language
  - Specific scenario with technical keywords
  - Problem statement user would actually have
  - Include relevant technology names and terms
estimatedTokens: 650  # Actual token count
relatedResources:  # 3-10 cross-references
  - orchestr8://category/related-fragment
---
```

**3. useWhen Scenarios (Critical for Indexing)**
```yaml
useWhen:
  # ✅ GOOD: Specific, keyword-rich, natural language
  - Implementing retry logic with exponential backoff for API calls
  - Building circuit breaker pattern for third-party service failures
  - Adding timeout handling with graceful degradation
  
  # ❌ BAD: Too generic, missing keywords
  - Error handling
  - Making APIs resilient
  - Dealing with failures
```

**Keywords extracted from good scenarios:**
- implementing, retry, logic, exponential, backoff, api, calls
- building, circuit, breaker, pattern, third-party, service, failures
- These power O(1) index lookups

**4. Fragment Content Structure**
```markdown
# Fragment Title

**Quick summary** (1-2 sentences explaining what this fragment covers)

## Core Concept/Pattern

**Key points:**
- Essential knowledge point 1
- Essential knowledge point 2

## Implementation

**Code/Config Example:**
​```typescript
// Practical, copy-paste ready example
// Focused on this specific concern
​```

## Best Practices

**Guidelines:**
- Do this
- Don't do that
- Consider this

## Common Pitfalls

- Pitfall 1 and how to avoid
- Pitfall 2 and solution

## Related Resources

- orchestr8://skills/related-skill
- orchestr8://patterns/related-pattern
```

### Workflow Creation with JIT Loading

**Pattern:**
```markdown
# Workflow: Feature Name

## Phase 1: Discovery (0-30%)

**→ Load:** orchestr8://match?query=specific+keywords&mode=index&maxResults=5

**Activities:**
- Do discovery work
- Use loaded expertise

**→ Checkpoint:** Discovery complete

## Phase 2: Implementation (30-70%)

**→ Load:** orchestr8://match?query=different+keywords&mode=index&maxResults=8

**Activities:**
- Implementation work
- Apply loaded knowledge

**→ Checkpoint:** Implementation done

## Phase 3: Validation (70-100%)

**→ Load:** orchestr8://match?query=testing+keywords&mode=index&maxResults=3

**Activities:**
- Testing and validation

**→ Checkpoint:** Complete
```

**Token Budget:**
- Phase 1: 1,200 tokens
- Phase 2: 1,500 tokens
- Phase 3: 800 tokens
- Total: 3,500 tokens loaded progressively
- vs. 10,000+ if all upfront

### Command Creation with Progressive Loading

**Pattern:**
```markdown
---
description: Command description
argument-hint: [type] [details]
---

# Command: $ARGUMENTS

## Dynamic Resource Loading (JIT Pattern)

**Traditional Approach (WASTEFUL):**
- Load all agents upfront: ~8,000 tokens
- Load all skills: ~5,000 tokens
- **Total: ~13,000 tokens loaded, only ~20% used**

**JIT Approach (OPTIMAL):**
- Load lightweight resource catalog: ~300 tokens
- Dynamically fetch only needed expertise: ~1,200 tokens
- **Total: ~1,500 tokens - 88% reduction!**

### Resources Loaded On-Demand

​```
# Phase 0: Discovery (if needed)
orchestr8://match?query=discovery+keywords&mode=index&maxResults=3

# Phase 1: Core Work
orchestr8://match?query=core+keywords&mode=index&maxResults=5

# Phase 2: Advanced (if needed)
orchestr8://agents/specific-expert-advanced
​```

**Token Efficiency:**
- Without JIT: ~13,000 tokens loaded upfront
- With JIT: ~1,500 tokens loaded progressively
- **Savings: 88% fewer tokens**

## Phase 1: Work (0-40%)

**→ Load:** orchestr8://match?query=phase1+keywords&mode=index&maxResults=5

**Activities:**
- Use loaded expertise

## Phase 2: More Work (40-100%)

**→ Load (if needed):** orchestr8://agents/advanced-expert

**Activities:**
- Advanced implementation
```

---

## Optimization Best Practices

### DO: Token-Efficient Patterns

1. **Use JIT Loading in Workflows**
   ```markdown
   **→ Load:** orchestr8://match?query=keywords&mode=index&maxResults=5
   ```

2. **Fragment Large Resources**
   - Core (500-700 tokens) + Advanced (600-800 tokens)
   - Better than monolithic (1,500+ tokens)

3. **Write Rich useWhen Scenarios**
   - 5-20 scenarios per fragment
   - Specific, keyword-rich, natural language
   - Powers index-based lookup

4. **Leverage Cross-References**
   - Link related fragments with `orchestr8://` URIs
   - Enables JIT navigation
   - Users load what they need, when they need it

5. **Use Progressive Loading**
   - Load core first (500-600 tokens)
   - Reference advanced as needed
   - 50-78% savings in common cases

### DON'T: Token-Wasteful Anti-Patterns

1. **Don't Load Everything Upfront**
   ```markdown
   # ❌ BAD
   **→ Load:** orchestr8://agents/full-agent
   **→ Load:** orchestr8://skills/all-skills
   # Wastes tokens, slow, poor UX
   ```

2. **Don't Create Giant Monolithic Resources**
   - 2,000+ tokens = should be split
   - Hard to match, wasteful, poor cache efficiency

3. **Don't Write Generic useWhen**
   ```yaml
   # ❌ BAD
   useWhen:
     - Working with TypeScript
     - Need help with APIs
   
   # ✅ GOOD
   useWhen:
     - Implementing strongly-typed REST API client with generic request/response types
     - Building type-safe Express middleware with dependency injection
   ```

4. **Don't Duplicate Content**
   - Extract common knowledge to shared fragments
   - Reference via `orchestr8://` URIs
   - Single source of truth

5. **Don't Ignore Token Budgets**
   - Always specify `maxTokens` in match queries
   - Typical: 1,000-2,000 per phase
   - Total workflow: 3,000-5,000 tokens

---

## Metrics & Validation

### Token Efficiency Scorecard

**Excellent (90%+ reduction):**
- JIT workflows with 3-5 phases
- Index mode queries (<120 tokens)
- Progressive agent loading

**Good (70-89% reduction):**
- Fragmented resources
- Catalog mode with selective loading
- Hierarchical families

**Acceptable (50-69% reduction):**
- Well-sized fragments (500-1000 tokens)
- Basic JIT loading
- Some progressive loading

**Needs Improvement (<50% reduction):**
- Monolithic resources
- Full mode by default
- No JIT loading

### Validation Checklist

**Before Publishing:**
```
□ Token count: 500-1000 (optimal), <1500 (max)
□ useWhen scenarios: 5-20, keyword-rich, specific
□ Tags: 5-15, relevant to use cases
□ Capabilities: 3-8, action-oriented
□ Cross-references: 3-10 related resources
□ Content structure: Clear, practical, copy-paste examples
□ JIT loading: Commands/workflows use orchestr8://match
□ Progressive loading: Large resources split into core + advanced
□ Index validation: npm run build-index (no errors)
```

---

## Example: Optimized Agent Creation

```yaml
---
id: typescript-async-expert
category: agent
tags: [typescript, async, promises, async-await, concurrency, error-handling]
capabilities:
  - async/await pattern implementation with proper error handling
  - Promise composition and chaining strategies
  - Concurrent operation management with Promise.all/race/allSettled
  - Async generator and iterator patterns
useWhen:
  - Implementing async/await patterns with try/catch error handling
  - Building concurrent API calls with Promise.all and error recovery
  - Designing async generators for streaming data processing
  - Solving race conditions in asynchronous TypeScript code
  - Converting callback-based APIs to Promise-based with util.promisify
estimatedTokens: 750
relatedResources:
  - orchestr8://skills/error-handling-async
  - orchestr8://patterns/async-patterns
  - orchestr8://examples/typescript-async-examples
---

# TypeScript Async/Await Expert

## Core Async Patterns

**Promise creation and chaining:**
​```typescript
async function fetchUserData(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } catch (error) {
    console.error('Failed to fetch user:', error)
    throw error
  }
}
​```

## Concurrent Operations

**Promise.all for parallel execution:**
​```typescript
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
])
​```

## Error Handling

**Try/catch with fallback:**
​```typescript
async function fetchWithFallback(): Promise<Data> {
  try {
    return await fetchPrimary()
  } catch (error) {
    console.warn('Primary failed, using fallback')
    return await fetchFallback()
  }
}
​```

## Related Resources

- orchestr8://skills/error-handling-async - Async error strategies
- orchestr8://patterns/async-patterns - Design patterns
```

**Optimization Analysis:**
- Size: 750 tokens ✅ (within 500-1000 range)
- useWhen: 5 scenarios ✅ (keyword-rich, specific)
- Tags: 6 tags ✅ (relevant, searchable)
- Cross-refs: 2 links ✅ (enables JIT navigation)
- Content: Practical examples ✅ (copy-paste ready)

---

## Summary: Six-Strategy Token Reduction

**Combined Impact:**
```
Strategy 1: JIT Loading          → 91-97% reduction (vs loading all)
Strategy 2: Fragments            → 25-40% additional reduction
Strategy 3: Index Lookup         → 85-95% reduction (vs fuzzy)
Strategy 4: Progressive Loading  → 50-78% savings (common cases)
Strategy 5: Catalog-First        → 54% savings (exploration)
Strategy 6: Hierarchical Families → 56% savings (smart organization)

Total System: 95-98% token reduction achieved
Example: 220KB → 18KB upfront + 2-3KB on-demand
```

**Apply these strategies to every resource you create.**

## Key Principles

1. **Load Just-In-Time:** Never load everything upfront
2. **Fragment Everything:** 500-1000 tokens, focused, composable
3. **Rich Metadata:** Powers indexing, matching, and discovery
4. **Progressive Complexity:** Core first, advanced on-demand
5. **Catalog Before Content:** Explore metadata, load selectively
6. **Organize Hierarchically:** Family structures save 5,000+ tokens

**You are now equipped to create world-class token-efficient resources for Orchestr8.** 🚀
