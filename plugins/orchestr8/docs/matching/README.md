# Dynamic Resource Matching

> **Intelligent resource discovery using fuzzy matching and index-based lookups**

## Table of Contents

- [Overview](#overview)
- [Two Matching Modes](#two-matching-modes)
- [When to Use Each Mode](#when-to-use-each-mode)
- [URI Syntax](#uri-syntax)
- [Query Parameters](#query-parameters)
- [Token Optimization](#token-optimization)
- [Quick Start Examples](#quick-start-examples)
- [Related Documentation](#related-documentation)

---

## Overview

Orchestr8 provides **dynamic resource matching** to discover relevant agents, skills, patterns, and examples without hard-coding references. The system supports two complementary approaches:

**1. Index Lookup (Default)** - Pre-built indexes for ultra-fast keyword-based lookups
- O(1) keyword lookups using inverted indexes with 1,675 useWhen scenarios
- 85-95% token reduction (200-500 tokens vs 5,000-10,000+)
- Three-tier strategy: quick cache → keyword index → fuzzy fallback
- 5-10ms latency (warm cache), <2ms with quick cache hits
- 4,036 unique keywords indexed across 383 fragments

**2. Fuzzy Matching** - Semantic scoring algorithm that ranks resources by relevance
- Scores resources based on keyword matches in tags, capabilities, and useWhen scenarios
- Flexible and works for any query (100% coverage)
- Four output modes: index (default), minimal, catalog, full
- 15-20ms latency, best for exploratory searches

Both systems use the same `orchestr8://` URI protocol with query parameters to specify search criteria.

---

## Four Response Modes

Orchestr8 provides four response modes optimized for different use cases. The default mode is **index** for maximum token efficiency.

### Index Lookup (mode=index) - DEFAULT

**How it works:**
1. Check quick lookup cache for common queries (TIER 1)
2. Extract keywords and lookup in inverted keyword index with 1,675 scenarios (TIER 2)
3. Score matches by keyword overlap (+20 exact, +10 partial)
4. Fallback to fuzzy match if insufficient results (TIER 3)

**Characteristics:**
- **Latency**: 5-10ms (index), <2ms (quick cache)
- **Tokens**: 200-500 tokens (useWhen-based index)
- **Coverage**: 100% via fallback to fuzzy matching
- **Index**: 4,036 keywords across 383 fragments
- **Best for**: Quick discovery, production workloads, JIT loading (DEFAULT)

**Scoring Algorithm:**
- Exact keyword match: +20 per keyword
- Partial keyword match: +10 per keyword

### Minimal Mode (mode=minimal) - NEW

**How it works:**
1. Run fuzzy matching to score resources
2. Return ultra-compact JSON with URIs, scores, tokens, and top 5 tags
3. Client loads specific resources based on JSON URIs

**Characteristics:**
- **Latency**: 15-20ms (cold), <5ms (warm cache)
- **Tokens**: 300-500 tokens (compact JSON output)
- **Coverage**: 100% of resources
- **Best for**: Registry-first workflows, automation, programmatic access

**Output Format:**
```json
{
  "matches": 5,
  "totalTokens": 4200,
  "results": [
    {
      "uri": "orchestr8://agents/typescript-developer",
      "score": 45,
      "tokens": 1200,
      "tags": ["typescript", "nodejs", "api", "async", "testing"]
    }
  ],
  "usage": "Load resources via ReadMcpResourceTool using the uri field"
}
```

### Catalog Mode (mode=catalog)

**How it works:**
1. Extract keywords from query (remove stop words, normalize)
2. Score all resources against extracted keywords
3. Rank by relevance score
4. Select top matches within maxResults limit
5. Return full metadata with capabilities

**Characteristics:**
- **Latency**: 15-20ms (cold), <5ms (warm cache)
- **Tokens**: 1,500-2,000 tokens (full metadata)
- **Coverage**: 100% of resources
- **Best for**: Browsing resources, exploration, understanding capabilities

**Scoring Algorithm:**
- Tag matches: +10 per keyword
- Capability matches: +8 per keyword
- UseWhen matches: +5 per keyword
- Category filter: +15 bonus
- Small resource (<1000 tokens): +5 bonus

### Full Mode (mode=full)

**How it works:**
1. Same fuzzy matching as catalog mode
2. Select top matches within token budget
3. Return complete resource content

**Characteristics:**
- **Latency**: 15-20ms (cold), <5ms (warm cache)
- **Tokens**: 5,000-10,000+ tokens (complete content)
- **Coverage**: 100% of resources
- **Best for**: Immediate execution, known queries, convenience

---

## When to Use Each Mode

### Use Index Mode (DEFAULT) when:

- **Quick discovery**: Find relevant resources fast with minimal tokens
- **Production**: High-frequency queries in production workloads
- **Performance-critical**: Need <10ms latency
- **JIT loading**: Registry-first workflows that load on-demand
- **Token budget**: Strict token limits (200-500 tokens)
- **Default choice**: When unsure, index mode is optimal

**Example:**
```
orchestr8://match?query=typescript+api+patterns
orchestr8://match?query=retry+exponential+backoff&mode=index&maxResults=5
```

### Use Minimal Mode when:

- **Automation**: Programmatic resource selection
- **Registry-first**: Need URIs and scores for later loading
- **Compact results**: Want ultra-lightweight JSON output (300-500 tokens)
- **Batch operations**: Building resource lists for processing
- **API integration**: Exposing resource discovery via API

**Example:**
```
orchestr8://match?query=typescript+api&mode=minimal&maxResults=5
```

### Use Catalog Mode when:

- **Exploring**: "Show me all TypeScript-related resources"
- **Multi-keyword**: "async await error handling patterns"
- **Browsing**: Review capabilities before loading
- **Development**: Testing new resources or queries
- **Rich metadata**: Need full capabilities and tags

**Example:**
```
orchestr8://match?query=typescript+api+patterns&mode=catalog&maxResults=10
```

### Use Full Mode when:

- **Ready to use**: You know exactly what you need and want full content immediately
- **Small result set**: Query will match 1-3 resources
- **Token budget**: You have 5,000-10,000 tokens available
- **Convenience**: Want to avoid separate load step

**Example:**
```
orchestr8://match?query=typescript+developer&mode=full&maxResults=2&maxTokens=2500
```

---

## URI Syntax

### Dynamic Match URI Format

```
orchestr8://[category]/match?query=<search-terms>&[options]
```

**Components:**
- `orchestr8://` - Protocol prefix
- `[category]/` - Optional category filter (agents, skills, patterns, examples, workflows)
- `match` - Dynamic matching endpoint
- `?query=<terms>` - Required search query (use `+` for spaces or URL encoding)
- `&[options]` - Optional query parameters

### Examples

**Basic query (all categories):**
```
orchestr8://match?query=typescript+api
```

**Category-filtered query:**
```
orchestr8://agents/match?query=typescript+developer
orchestr8://agents/match?query=typescript+developer&mode=index  # same (index is default)
```

**Multi-category query:**
```
orchestr8://match?query=error+handling&categories=skills,patterns
```

**Index mode (default):**
```
orchestr8://match?query=retry+timeout
orchestr8://match?query=retry+timeout&mode=index&maxResults=5
```

**Minimal mode with compact JSON:**
```
orchestr8://match?query=testing+patterns&mode=minimal&maxResults=5
```

**Catalog mode with full metadata:**
```
orchestr8://match?query=testing+patterns&mode=catalog&maxResults=8&minScore=15
```

**Full content mode:**
```
orchestr8://match?query=kubernetes+deployment&mode=full&maxTokens=3000
```

---

## Query Parameters

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `query` | string | Search terms (use `+` for spaces) | `typescript+async+api` |

### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `mode` | enum | `index` | Output mode: `index`, `minimal`, `catalog`, or `full` |
| `maxTokens` | number | 3000 | Maximum tokens in response (full mode only) |
| `maxResults` | number | 5 | Maximum number of results (index/minimal/catalog modes) |
| `minScore` | number | 10 | Minimum relevance score threshold (0-100) |
| `categories` | string | all | Comma-separated category filter |
| `tags` | string | none | Required tags (comma-separated) |

### Parameter Details

**mode** - Controls output format and matching strategy
- `index` (default): Uses pre-built indexes for fastest lookups with useWhen scenarios (~200-500 tokens)
- `minimal`: Returns ultra-compact JSON with URIs, scores, and top 5 tags (~300-500 tokens)
- `catalog`: Returns full metadata with capabilities and tags (~1,500-2,000 tokens)
- `full`: Returns complete resource content within token budget (~5,000-10,000+ tokens)

**maxTokens** - Token budget for full mode
- Only applies to `mode=full`
- Determines how many resources are included
- Always includes top 3 resources even if over budget
- Typical values: 1500-5000

**maxResults** - Number of results for index/minimal/catalog modes
- Only applies to `mode=index`, `mode=minimal`, or `mode=catalog`
- Limits the number of resources in the response
- Does not affect token count significantly
- Typical values: 5-15 (default: 5)

**minScore** - Relevance threshold
- Filters out low-relevance matches
- Higher values (20-30) = stricter matching
- Lower values (5-10) = more permissive
- Default (10) works well for most queries

**categories** - Filter by resource type
- Values: `agents`, `skills`, `patterns`, `examples`, `workflows`
- Can specify multiple: `categories=agents,skills`
- Narrows search space for better precision

**tags** - Required tag filter
- All specified tags must be present
- Useful for strict matching
- Example: `tags=typescript,async` requires both tags

---

## Token Optimization

### Mode Comparison Examples

**Index Mode (Default)** (95-98% token reduction):
```
Query: "typescript async patterns"
Index Response (~400 tokens):
  ## Resources Found: 3

  **1. TypeScript Developer Agent**
  - URI: orchestr8://agents/typescript-developer
  - Use When: Building TypeScript APIs, need type safety and async patterns
  - Score: 45

  **2. Async Patterns Skill**
  - URI: orchestr8://skills/async-patterns
  - Use When: Implementing promise chains, async/await error handling
  - Score: 42

  **3. Error Handling Pattern**
  - URI: orchestr8://patterns/error-handling
  - Use When: Robust error handling in async operations
  - Score: 38

Load on-demand: Only fetch what you need
```

**Minimal Mode** (96% token reduction):
```
Query: "typescript async patterns"
Minimal Response (~350 tokens):
{
  "matches": 3,
  "totalTokens": 3400,
  "results": [
    {
      "uri": "orchestr8://agents/typescript-developer",
      "score": 45,
      "tokens": 1200,
      "tags": ["typescript", "async", "api", "patterns", "testing"]
    },
    {
      "uri": "orchestr8://skills/async-patterns",
      "score": 42,
      "tokens": 800,
      "tags": ["async", "promises", "error-handling", "patterns", "javascript"]
    },
    {
      "uri": "orchestr8://patterns/error-handling",
      "score": 38,
      "tokens": 1400,
      "tags": ["error-handling", "resilience", "async", "patterns", "best-practices"]
    }
  ]
}
```

**Catalog Mode** (85-92% token reduction):
```
Query: "typescript async patterns"
Catalog Response (~1800 tokens):
  [Full metadata with all tags, capabilities, and useWhen scenarios for each resource]
```

**Full Mode** (full content immediately):
```
Query: "typescript async patterns"
Full Response (~8000 tokens):
  [Complete content of all matched resources]
```

### Comparison Table

| Metric | Index (Default) | Minimal | Catalog | Full |
|--------|----------------|---------|---------|------|
| Latency | 5-10ms | 15-20ms | 15-20ms | 15-20ms |
| Tokens | 200-500 | 300-500 | 1,500-2,000 | 5,000-10,000+ |
| Coverage | 100% (fallback) | 100% | 100% | 100% |
| Precision | High | High | High | High |
| Use Case | Quick discovery | Automation | Exploration | Immediate use |
| Format | UseWhen index | Compact JSON | Full metadata | Complete content |

---

## Quick Start Examples

### Example 1: Explore TypeScript Resources

**Goal:** See what TypeScript-related resources are available

**Query:**
```
orchestr8://match?query=typescript+api+development&mode=catalog&maxResults=10
```

**Response:** Catalog with ~10 resources (~100 tokens)

**Next Step:** Review catalog, then load specific resources:
```
orchestr8://agents/typescript-developer
```

### Example 2: Fast Lookup for Specific Pattern

**Goal:** Find retry/timeout handling patterns quickly

**Query:**
```
orchestr8://match?query=retry+timeout+exponential&mode=index&maxResults=5
```

**Response:** Top 5 matches from index (~60 tokens, ~5ms)

**Next Step:** Load the most relevant resource

### Example 3: Get Full Content Immediately

**Goal:** Load complete TypeScript agent content in one request

**Query:**
```
orchestr8://match?query=typescript+developer&mode=full&maxTokens=2000&categories=agents
```

**Response:** Full agent content (~1200 tokens)

**Next Step:** Start using the agent immediately

### Example 4: Find Testing Patterns

**Goal:** Discover testing-related patterns with good relevance

**Query:**
```
orchestr8://patterns/match?query=testing+unit+integration&mode=catalog&minScore=20
```

**Response:** High-relevance testing patterns only

**Next Step:** Review and load selected patterns

### Example 5: Multi-Category Search

**Goal:** Find error handling across skills and patterns

**Query:**
```
orchestr8://match?query=error+handling+resilience&categories=skills,patterns&mode=catalog
```

**Response:** Mixed results from skills and patterns

**Next Step:** Load both types as needed

---

## Related Documentation

### Matching System Details
- [Fuzzy Matching Algorithm](./fuzzy-matching.md) - Scoring algorithm, keyword extraction, selection strategy
- [Index Lookup System](./index-lookup.md) - Pre-built indexes, three-tier strategy, maintenance
- [Performance Comparison](./performance.md) - Benchmarks, token usage, optimization tips

### Architecture
- [System Design](../architecture/system-design.md) - Overall architecture and components
- [MCP Resources](../mcp/resources.md) - Resource loading and URI resolution

### Resources
- [Index Documentation](../../resources/.index/README.md) - Technical details of pre-built indexes
- [Resource Fragments](../../resources/) - Browse available agents, skills, patterns

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
**Maintained By:** Orchestr8 Documentation Team
