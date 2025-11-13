---
id: dynamic-expertise-metadata-matching
category: pattern
tags: [fuzzy-matching, metadata, scoring, fragment-quality, optimization]
capabilities:
  - Fragment metadata design for matching
  - Match score optimization
  - Discoverability enhancement
  - Quality metrics for fragments
useWhen:
  - New resource fragment creation requiring rich metadata with 6-8 specific tags, detailed capabilities, and concrete useWhen scenarios
  - Fragment discoverability optimization needing enhanced tags, capability descriptions, and useWhen items to improve fuzzy match scores
  - Understanding TF-IDF fuzzy matching algorithm to optimize fragment metadata for search query term frequency and relevance
  - Match quality improvement scenarios requiring metadata testing with sample queries to ensure top 3 ranking for target searches
estimatedTokens: 750
---

# Dynamic Expertise - Metadata & Matching

Understanding how fuzzy matching works and how to optimize fragment metadata for maximum discoverability and relevance.

## Fragment Metadata Format

High-quality metadata drives match quality:

```yaml
---
id: typescript-expert-api
category: agent
tags: [typescript, javascript, api, rest, node, express]
capabilities:
  - REST API development with Express.js
  - API endpoint design and middleware patterns
  - TypeScript type-safe API implementation
useWhen:
  - Building REST APIs with TypeScript
  - Need API architecture guidance
  - Setting up Express.js servers with TypeScript
estimatedTokens: 500
---
```

**Metadata Fields:**
- `id` - Unique, descriptive identifier
- `category` - agent | skill | pattern | example
- `tags` - 5-8 keywords for matching (technologies, domains, use-cases)
- `capabilities` - 3-5 specific, detailed capabilities
- `useWhen` - 3-5 concrete usage scenarios
- `estimatedTokens` - Accurate size hint

## Match Scoring Algorithm

### Scoring Factors

FuzzyMatcher uses keyword-based scoring:

```markdown
Tag matches: +10 points per keyword
Capability matches: +8 points per keyword
UseWhen matches: +5 points per keyword
Category filter bonus: +15 points
Size preference: +5 points (for <1000 tokens)
Required tag filter: 0 points if missing any required tag
```

### Example Scoring

**Query:** "typescript async error handling"

**Fragment A (typescript-async-patterns):**
```yaml
tags: [typescript, async, promises, error-handling]
capabilities:
  - Async/await patterns and error handling
  - Promise-based error propagation
useWhen:
  - Handling errors in async/await code
```

**Score calculation:**
- Tags: typescript(+10), async(+10), error-handling(+10) = +30
- Capabilities: async(+8), error(+8), handling(+8) = +24
- UseWhen: handling(+5), errors(+5), async(+5) = +15
- Size: 450 tokens = +5
- **Total: 74 points → HIGH match**

**Fragment B (typescript-core):**
```yaml
tags: [typescript, javascript, types]
capabilities:
  - TypeScript type system expertise
  - Core language features
useWhen:
  - Working on TypeScript projects
```

**Score calculation:**
- Tags: typescript(+10) = +10
- Capabilities: typescript(+8) = +8
- UseWhen: typescript(+5) = +5
- Size: 650 tokens = +5
- **Total: 28 points → MEDIUM match**

**Fragment C (python-async):**
```yaml
tags: [python, async, asyncio]
capabilities:
  - Python async/await patterns
useWhen:
  - Async operations in Python
```

**Score calculation:**
- Tags: async(+10) = +10
- Capabilities: async(+8) = +8
- UseWhen: async(+5) = +5
- **Total: 23 points → LOW match** (wrong language)

## Metadata Quality Comparison

### Poor Metadata Example
```yaml
---
id: typescript
category: agent
tags: [typescript]
capabilities:
  - TypeScript expertise
useWhen:
  - Working with TypeScript
---
```

**Problems:**
- Vague tags (only 1, too general)
- Generic capabilities (no detail)
- Broad useWhen (not actionable)
- Low match scores on specific queries

### High-Quality Metadata Example
```yaml
---
id: typescript-async-error-handling
category: agent
tags: [typescript, async, promises, error-handling, try-catch, resilience]
capabilities:
  - Async error handling with try-catch and error boundaries
  - Promise rejection handling and propagation patterns
  - Graceful degradation in async workflows
  - Error recovery and retry strategies
useWhen:
  - Handling errors in async/await code
  - Need to prevent unhandled promise rejections
  - Building resilient async workflows
  - Implementing error boundaries in async operations
estimatedTokens: 480
---
```

**Strengths:**
- Specific, varied tags (6 tags covering different angles)
- Detailed capabilities (concrete patterns mentioned)
- Concrete useWhen scenarios (actionable situations)
- High match scores on relevant queries

## Optimization Guidelines

### Tag Selection
```markdown
Include tags for:
✅ Primary technology (typescript, python, rust)
✅ Secondary technologies (express, fastapi, tokio)
✅ Domain/pattern (api, async, microservices)
✅ Techniques (error-handling, testing, caching)
✅ Use-cases (rest, authentication, performance)

Aim for 5-8 tags total
Mix broad and specific terms
Include synonyms (javascript for typescript)
```

### Capability Design
```markdown
Good capabilities:
✅ "REST API development with Express.js and middleware patterns"
✅ "Async error handling with try-catch and error boundaries"
✅ "JWT authentication with token validation and refresh"

Poor capabilities:
❌ "API development"
❌ "Error handling"
❌ "Authentication"

Make capabilities:
- Specific and detailed
- Include technology names
- Mention concrete patterns/approaches
```

### UseWhen Scenarios
```markdown
Good useWhen:
✅ "Building REST APIs with TypeScript and Express"
✅ "Need to handle errors in async/await code"
✅ "Implementing JWT authentication with refresh tokens"

Poor useWhen:
❌ "Working on TypeScript"
❌ "Need error handling"
❌ "Building APIs"

Make useWhen:
- Concrete and actionable
- Specific situations
- Include context (technologies, patterns)
```

## Discoverability Testing

### Test Queries

For each new fragment, test multiple queries:

**Agent fragment (typescript-async-patterns):**
```markdown
Test queries:
□ orchestr8://agents/match?query=typescript
□ orchestr8://agents/match?query=typescript+async
□ orchestr8://agents/match?query=async+promises+typescript
□ orchestr8://agents/match?query=concurrent+operations

Expected: High match scores on queries 2-3, good on query 4
```

**Skill fragment (error-handling-async):**
```markdown
Test queries:
□ orchestr8://skills/match?query=error+handling
□ orchestr8://skills/match?query=async+errors
□ orchestr8://skills/match?query=try+catch+async
□ orchestr8://skills/match?query=promise+rejection

Expected: High match scores on all queries
```

### Improving Discoverability

If fragment NOT selected in expected queries:

```markdown
1. Check match scores (enable debug logging)
2. Identify missing keywords in metadata
3. Add relevant tags
4. Enhance capabilities with missing terms
5. Expand useWhen with more scenarios
6. Retest until discoverable

Example:
Fragment for "database connection pooling" not found via query "db pool"
→ Add tags: [database, db, connection, pool, pooling]
→ Retest: "db pool" now matches ✅
```

## Performance Characteristics

### Matching Performance
```markdown
Index loading: ~50ms (first request, cached thereafter)
Fuzzy matching: ~5-10ms (100 fragments)
Content assembly: ~2ms
Total overhead: ~60ms first request, ~10ms subsequent
```

### Token Efficiency
```markdown
Without dynamic matching:
- Typical load: 5000-8000 tokens
- Utilization: 40-60%
- Waste: 2000-4000 tokens

With dynamic matching:
- Typical load: 2500-4000 tokens
- Utilization: 85-95%
- Waste: 200-600 tokens
- Savings: 40-60% reduction in wasted tokens
```

## Best Practices

✅ **Rich metadata** - 5-8 tags, 3-5 capabilities, 3-5 useWhen
✅ **Specific terms** - Include technology names, pattern names
✅ **Test discoverability** - Verify fragments can be found
✅ **Include synonyms** - "javascript" for "typescript", "db" for "database"
✅ **Update metadata** - Improve when fragments aren't discovered
✅ **Accurate token counts** - Use wc -w | multiply by 0.75

❌ **Don't use vague terms** - "development", "coding", "programming"
❌ **Don't skip testing** - Untested fragments may be unfindable
❌ **Don't over-tag** - >10 tags dilutes relevance
❌ **Don't under-specify** - <3 tags makes matching difficult
