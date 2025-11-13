# Resource System Overview

The Orchestr8 resource system is a sophisticated knowledge management platform that provides AI agents with dynamic access to expertise, patterns, examples, and workflows. Resources are organized into fragments—small, composable units of knowledge that can be loaded on-demand or assembled dynamically based on context.

## What Are Resources?

Resources are structured knowledge artifacts that contain expertise, code examples, architectural patterns, workflows, and best practices. They serve as a dynamic library that AI agents can query and load to enhance their capabilities for specific tasks.

**Key characteristics:**
- **Fragment-based:** Resources are broken into 500-1000 token fragments for efficient loading
- **Metadata-rich:** Each fragment has tags, capabilities, and use-case scenarios for matching
- **Composable:** Fragments can be combined to create comprehensive expertise
- **Indexed:** Pre-built indexes enable fast O(1) lookups instead of O(n) scanning
- **Dynamic:** Resources are loaded just-in-time based on the task at hand

## Resource Categories

The system organizes resources into seven primary categories:

| Category | Purpose | Example URIs |
|----------|---------|--------------|
| **agents** | AI agent definitions with specialized expertise | `orchestr8://agents/typescript-core` |
| **skills** | Reusable techniques and best practices | `orchestr8://skills/error-handling-resilience` |
| **patterns** | Design patterns and architectural approaches | `orchestr8://patterns/autonomous-organization` |
| **examples** | Code examples and reference implementations | `orchestr8://examples/express-jwt-auth` |
| **guides** | Setup and configuration guides | `orchestr8://guides/aws-eks-cluster` |
| **best-practices** | Code standards and quality guidelines | `orchestr8://best-practices/api-design-rest` |
| **workflows** | Execution strategies and process templates | `orchestr8://workflows/workflow-new-project` |

See [categories.md](./categories.md) for detailed information about each category.

## Fragment-Based Organization

Resources are organized using a **fragment architecture** where knowledge is broken into small, focused units:

```
resources/
├── agents/
│   └── 
│       ├── typescript-core.md              (~650 tokens)
│       ├── typescript-async-patterns.md    (~580 tokens)
│       └── typescript-api-development.md   (~720 tokens)
├── skills/
│   └── 
│       ├── error-handling-resilience.md
│       └── testing-integration.md
└── patterns/
    └── 
        ├── autonomous-organization.md
        └── security-auth-jwt.md
```

Each fragment is a self-contained markdown file with:
- **Frontmatter metadata** (id, category, tags, capabilities, useWhen, estimatedTokens)
- **Content** (expertise, examples, guidelines)
- **Token budget** (typically 500-1000 tokens)

See [fragments.md](./fragments.md) for comprehensive fragment documentation.

## Loading Modes: Static vs Dynamic

The resource system supports two loading modes:

### Static Loading

Load specific resources by direct URI reference:

```typescript
// Load a specific agent fragment
orchestr8://agents/typescript-core

// Load a specific workflow
orchestr8://workflows/workflow-new-project
```

**Characteristics:**
- Direct file access (O(1) lookup)
- Predictable token cost
- Used when exact resource is known
- Cached for performance

### Dynamic Loading

Dynamically assemble resources based on query matching:

```typescript
// Match against use-case scenarios
orchestr8://match?query=typescript+api+error+handling&maxTokens=2000

// Category-specific matching
orchestr8://agents/match?query=build+rest+api

// Index-based lookup (85-95% faster)
orchestr8://match?query=retry+exponential+backoff&mode=index
```

**Characteristics:**
- Query-based matching (keyword or semantic)
- Token budget-aware assembly
- Used when expertise needs are inferred from context
- Multiple matching strategies (index, catalog, fuzzy)

See [Resource Discovery and Matching](#resource-discovery-and-matching) for details.

## Resource Discovery and Matching

The system provides multiple strategies for discovering and matching resources:

### 1. Index-Based Lookup (Fastest, 85-95% token reduction)

Pre-built indexes map keywords to resource fragments:

```
Query: "retry exponential backoff"
  ↓
Keyword Index: ["retry", "exponential", "backoff"]
  ↓
UseWhen Index: Matching scenarios from fragments
  ↓
Result: orchestr8://skills/error-handling-resilience
```

**Performance:**
- Tier 1 (Quick Lookup): <10ms for common queries
- Tier 2 (Keyword Index): <50ms for most queries
- Tier 3 (Fuzzy Fallback): <200ms when needed

**Token efficiency:**
- Traditional fuzzy match: ~800 tokens overhead
- Index lookup: ~50-120 tokens overhead
- 85-95% reduction in matching cost

See `resources/.index/README.md` for index architecture.

### 2. Catalog Mode (Lightweight, returns URIs)

Returns a lightweight catalog of matching resources without full content:

```typescript
orchestr8://match?query=typescript+testing&mode=catalog&maxResults=5
```

**Returns:**
```json
{
  "matches": [
    {
      "uri": "orchestr8://agents/typescript-testing",
      "score": 95,
      "estimatedTokens": 720
    }
  ]
}
```

**Use cases:**
- Browse available resources
- Check token costs before loading
- Multi-stage selection (catalog → selective load)

### 3. Full Content Assembly (Traditional)

Scores and assembles full content from matching fragments:

```typescript
orchestr8://match?query=express+middleware&mode=full&maxTokens=3000
```

**Returns:**
- Complete assembled content from matching fragments
- Respects token budget
- Includes relevance scores

## Frontmatter Metadata Schema

Every fragment includes YAML frontmatter with structured metadata:

```yaml
---
id: typescript-core
category: agent
tags: [typescript, types, generics, type-inference, advanced-types]
capabilities:
  - Complex type system design
  - Generic type constraints and inference
  - Conditional and mapped types
  - Type-level programming
useWhen:
  - Designing type-safe APIs using generic constraints
  - Solving complex type transformations with utility types
  - Implementing discriminated unions for state machines
  - Resolving type inference issues with type predicates
estimatedTokens: 650
---
```

**Field descriptions:**

| Field | Type | Purpose | Matching Weight |
|-------|------|---------|----------------|
| `id` | string | Unique identifier for the fragment | N/A |
| `category` | enum | Resource category (agent, skill, pattern, example, workflow) | High (category filters) |
| `tags` | array | Keywords for matching (lowercase) | High (keyword matching) |
| `capabilities` | array | What this resource enables you to do | Medium (capability matching) |
| `useWhen` | array | Scenarios when this resource applies | Very High (use-case matching) |
| `estimatedTokens` | number | Approximate token count for content | N/A (budget management) |

See [authoring-guide.md](./authoring-guide.md) for writing effective metadata.

## How Resources Are Used

### Use Case 1: Static Reference in Prompts

```markdown
You are a TypeScript expert. Load core expertise:

orchestr8://agents/typescript-core

Your task: Design a type-safe API client...
```

### Use Case 2: Dynamic Just-In-Time Loading

```markdown
Load relevant expertise for this task:

orchestr8://match?query=error+handling+async+retry&maxTokens=1500

Task: Implement resilient API client with retry logic...
```

### Use Case 3: Category-Specific Matching

```markdown
Load TypeScript experts from agent catalog:

orchestr8://agents/match?query=advanced+type+patterns&maxResults=3

Task: Design complex type transformations...
```

### Use Case 4: Index-Based Lookup (Recommended)

```markdown
Load expertise using index lookup:

orchestr8://match?query=circuit+breaker+resilience&mode=index

Task: Implement fault tolerance for microservices...
```

## Index System Architecture

Pre-built indexes enable O(1) keyword lookups instead of O(n) fragment scanning:

```
resources/.index/
├── README.md              # Index documentation
├── usewhen-index.json     # Scenario hash → metadata (692 KB)
├── keyword-index.json     # Keyword → scenario hashes (525 KB)
└── quick-lookup.json      # Common queries → cached results (7.8 KB)
```

**Index building:**
```bash
npm run build-index
```

**Statistics:**
- 221 fragments indexed
- 1,142 use-case scenarios extracted
- 3,646 unique keywords
- ~1.2 MB total index size

**Three-tier lookup strategy:**
1. **Quick Lookup** (O(1), ~10ms): Pre-cached common queries
2. **Keyword Index** (O(k), ~50ms): Inverted index for keyword matching
3. **Fuzzy Fallback** (O(n), ~200ms): Full-text search when needed

See `resources/.index/README.md` for comprehensive index documentation.

## Resource Loading Flow

```
User Query: "Build TypeScript API with JWT auth"
    ↓
URI Parser: Determines static vs dynamic
    ↓
┌─────────────────────┬─────────────────────┐
│   Static URI        │    Dynamic URI      │
│   (O(1) lookup)     │   (Query matching)  │
└─────────────────────┴─────────────────────┘
    ↓                         ↓
File System Read      Index/Fuzzy Matcher
    ↓                         ↓
    └──────────┬──────────────┘
               ↓
         LRU Cache (4 hour TTL)
               ↓
       Resource Content
```

**Implementation files:**
- `src/loaders/resourceLoader.ts` - Main loader with caching
- `src/utils/uriParser.ts` - URI parsing (static vs dynamic)
- `src/utils/fuzzyMatcher.ts` - Content-based matching (fallback)
- `src/utils/indexLookup.ts` - Index-based lookup (primary)
- `src/utils/indexBuilder.ts` - Index generation

## Performance Characteristics

### Static Loading
- **Latency:** 1-5ms (cached) / 10-30ms (uncached)
- **Token cost:** 0 (direct content load)
- **Scalability:** O(1) - constant time
- **Cache TTL:** 4 hours

### Dynamic Loading (Index Mode)
- **Latency:** 10-50ms (Tier 1-2) / 50-200ms (Tier 3 fallback)
- **Token cost:** 50-120 tokens (85-95% reduction)
- **Scalability:** O(k) keyword lookups vs O(n×m) fuzzy
- **Cache TTL:** 4 hours (assembled content)

### Dynamic Loading (Fuzzy Mode - Legacy)
- **Latency:** 100-200ms
- **Token cost:** ~800 tokens overhead
- **Scalability:** O(n×m×k) - scales with fragments × tags × query keywords
- **Use case:** Fallback when index insufficient

## Token Budget Management

The system respects token budgets during dynamic assembly:

```typescript
// Request up to 2000 tokens of content
orchestr8://match?query=kubernetes+deployment&maxTokens=2000
```

**Budget allocation strategy:**
1. Score all matching fragments by relevance
2. Sort by score (descending)
3. Select top fragments until budget exhausted
4. Always include highest-scoring fragment even if exceeds budget

**Typical token costs:**
- Single fragment: 500-1000 tokens
- Small expertise assembly: 1000-2000 tokens
- Comprehensive expertise: 2000-4000 tokens
- Maximum practical: 4000-6000 tokens

## Fragment Sizing Guidelines

Fragments are designed to be small, focused, and composable:

| Size Range | Use Case | Examples |
|------------|----------|----------|
| 500-800 tokens | Single concept/skill | Error handling pattern, specific API technique |
| 800-1200 tokens | Agent core expertise | TypeScript core types, Python async fundamentals |
| 1200-1800 tokens | Comprehensive pattern | Autonomous organization, microservices architecture |
| 1800+ tokens | Complex workflows | Multi-phase project workflows, integration guides |

**Sizing guidelines:**
- Prefer smaller fragments (more composable)
- Split large topics into sub-fragments (e.g., `python-async-fundamentals`, `python-async-context-managers`)
- Each fragment should be independently useful
- Estimate: ~4 characters per token

See [fragments.md](./fragments.md) for detailed sizing strategies.

## Resource Composition Patterns

Fragments can be combined to build comprehensive expertise:

### Pattern 1: Core + Extensions

```
TypeScript Developer Agent
├── typescript-core (650 tokens)          - Type system fundamentals
├── typescript-async-patterns (580 tokens) - Async/await, promises
└── typescript-api-development (720 tokens) - Express, REST APIs

Total: 1,950 tokens
```

### Pattern 2: Domain-Specific Assembly

```
API Security Specialist
├── security-auth-jwt (680 tokens)        - JWT authentication
├── security-owasp-top10 (890 tokens)     - Common vulnerabilities
└── api-design-rest (720 tokens)          - REST API best practices

Total: 2,290 tokens
```

### Pattern 3: Workflow + Supporting Skills

```
Refactoring Task
├── workflow-refactor (580 tokens)        - Refactoring process
├── quality-refactoring-techniques (750 tokens) - Refactoring patterns
└── testing-unit (680 tokens)             - Unit testing strategies

Total: 2,010 tokens
```

## Maintenance and Updates

### Index Rebuilding

Indexes must be rebuilt when:
- New fragments are added
- Fragment metadata changes (tags, useWhen, capabilities)
- Fragment content is significantly modified

```bash
npm run build-index
```

**Validation:**
- All fragments indexed
- 1000+ scenarios extracted
- 3000+ keywords indexed
- File sizes reasonable (<1MB each)

### Cache Invalidation

Static resource cache automatically expires after 4 hours. To force invalidation:
- Restart the MCP server
- Modify the file (updates mtime)
- Clear the LRU cache programmatically

### Version Management

- **Index version:** Tracked in `usewhen-index.json` (currently 1.0.0)
- **Major:** Breaking changes to index structure
- **Minor:** New fields added (backward compatible)
- **Patch:** Bug fixes, re-indexing with same structure

## Best Practices

### For Resource Authors

1. **Write specific useWhen scenarios** with concrete keywords
   - Good: "Implementing retry logic with exponential backoff for API calls"
   - Avoid: "When you need error handling"

2. **Use keyword-rich tags** (lowercase, specific)
   - Good: `[typescript, async, error-handling, retry, circuit-breaker]`
   - Avoid: `[code, programming, backend]`

3. **Keep fragments focused** (500-1000 tokens ideal)
   - One concept per fragment
   - Split large topics into sub-fragments

4. **Estimate tokens accurately** (~4 chars per token)
   - Include frontmatter in estimate
   - Test with actual token counters

5. **Write capabilities as outcomes**, not features
   - Good: "Design type-safe APIs with generic constraints"
   - Avoid: "Know TypeScript generics"

### For Resource Consumers

1. **Use index mode for efficiency**
   ```typescript
   orchestr8://match?query=keywords&mode=index
   ```

2. **Include specific keywords** in queries
   - Good: "retry exponential backoff circuit breaker"
   - Avoid: "error handling"

3. **Set appropriate token budgets**
   - Small task: 1000-2000 tokens
   - Medium task: 2000-3000 tokens
   - Large task: 3000-5000 tokens

4. **Prefer static URIs when resource is known**
   - Faster (O(1) lookup)
   - No matching overhead
   - Predictable token cost

5. **Use category filters** to narrow scope
   ```typescript
   orchestr8://agents/match?query=typescript+api
   ```

## Architecture Diagrams

### Resource Organization
```
┌─────────────────────────────────────────────┐
│           Resources Directory               │
├─────────────────────────────────────────────┤
│  agents/       - AI agent definitions       │
│  skills/       - Reusable techniques        │
│  patterns/     - Design patterns            │
│  examples/     - Code examples              │
│  guides/       - Setup guides               │
│  best-practices/ - Code standards           │
│  workflows/    - Execution strategies       │
│  .index/       - Pre-built indexes          │
└─────────────────────────────────────────────┘
```

### Fragment Lifecycle
```
1. Author Fragment
   ↓
2. Write Frontmatter (id, category, tags, capabilities, useWhen, tokens)
   ↓
3. Place in  subdirectory
   ↓
4. Run build-index (extracts metadata, builds indexes)
   ↓
5. Resource available via MCP (static or dynamic loading)
   ↓
6. LRU cache (4 hour TTL)
```

### Matching Strategies
```
Query → URI Parser
           ↓
    ┌──────┴──────┐
    │             │
Static URI    Dynamic URI
    │             │
    ↓             ↓
File Read    Mode Check
    │             │
    │      ┌──────┴──────┐
    │      │             │
    │   Index Mode   Fuzzy Mode
    │      │             │
    │      ↓             ↓
    │  Keyword      Content
    │  Lookup       Scoring
    │      │             │
    └──────┴──────┬──────┘
                  ↓
             Assemble
                  ↓
            LRU Cache
                  ↓
         Content Delivery
```

## Related Documentation

- [fragments.md](./fragments.md) - Comprehensive fragment documentation
- [categories.md](./categories.md) - Detailed category descriptions
- [authoring-guide.md](./authoring-guide.md) - Step-by-step authoring guide
- [../architecture/](../architecture/) - Overall system architecture
- [../mcp/](../mcp/) - MCP integration details
- `resources/.index/README.md` - Index system documentation

## Statistics (As of 2025-11-11)

- **Total fragments:** 221
- **Categories:** 7 (agents, skills, patterns, examples, guides, best-practices, workflows)
- **Average fragment size:** ~750 tokens
- **Total scenarios:** 1,142
- **Total keywords:** 3,646
- **Index size:** 1.2 MB
- **Cache size:** 200 entries (configurable)
- **Cache TTL:** 4 hours

## Future Enhancements

### Planned (v1.x)
- Query suggestions for typos
- Related resources recommendations
- Usage analytics and optimization
- Incremental index updates

### Experimental (v2.x)
- Semantic similarity matching (embeddings)
- Multi-language support
- Resource versioning
- A/B testing for matching algorithms

## Support

For questions about the resource system:
- Review this documentation and related docs
- Check `resources/.index/README.md` for index details
- Examine example fragments in `resources/*/fragments/`
- Review source code in `src/loaders/` and `src/utils/`

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
**Maintained By:** Orchestr8 Documentation Team
