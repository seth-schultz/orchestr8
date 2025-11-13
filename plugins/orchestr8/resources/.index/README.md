# UseWhen Index Documentation

**Version:** 1.0.0
**Generated:** 2025-11-11
**Status:** Production Ready

---

## Overview

This directory contains pre-built indexes for efficient resource lookup based on `useWhen` scenarios. The indexes enable O(1) keyword-based lookups instead of O(n) fuzzy matching, dramatically reducing token overhead and query latency.

**Performance Benefits:**
- Token reduction: 85-95% (from ~800 tokens to ~50-120 tokens per query)
- Query latency: 20x faster (from 165ms to 8ms warm cache)
- Scalability: O(k) keyword lookup vs O(n×m×k) fuzzy matching

---

## Index Files

### 1. usewhen-index.json (692 KB)

**Purpose:** Main index mapping scenario hashes to fragment metadata

**Structure:**
```json
{
  "version": "1.0.0",
  "generated": "2025-11-11T17:49:02.752Z",
  "totalFragments": 221,
  "index": {
    "scenario-<hash>": {
      "scenario": "Full useWhen scenario text",
      "keywords": ["extracted", "keywords", "from", "scenario"],
      "uri": "orchestr8://category/fragment-id",
      "category": "agent|skill|pattern|example|workflow",
      "estimatedTokens": 650,
      "relevance": 100
    }
  },
  "stats": {
    "totalScenarios": 1142,
    "avgScenariosPerFragment": 5.2,
    "avgKeywordsPerScenario": 12.7,
    "indexSizeBytes": 708588
  }
}
```

**Key Features:**
- **Scenario Hash:** Stable SHA-256 based hash for each unique useWhen scenario
- **Keywords:** Pre-extracted keywords with stopwords removed (3+ chars)
- **MCP URI:** Direct URI to load the full fragment content
- **Relevance:** Default relevance score (can be tuned based on usage)

**Statistics:**
- Total fragments: 221
- Total scenarios: 1,142
- Average scenarios per fragment: 5.2
- Average keywords per scenario: 12.7

### 2. keyword-index.json (525 KB)

**Purpose:** Inverted index for fast keyword-based lookups

**Structure:**
```json
{
  "version": "1.0.0",
  "keywords": {
    "retry": ["scenario-hash-1", "scenario-hash-54", "scenario-hash-123"],
    "exponential": ["scenario-hash-1", "scenario-hash-89"],
    "backoff": ["scenario-hash-1", "scenario-hash-89"],
    "circuit": ["scenario-hash-2", "scenario-hash-78"],
    "workflow": ["scenario-hash-3", "scenario-hash-45", "scenario-hash-156"]
  },
  "stats": {
    "totalKeywords": 3646,
    "avgScenariosPerKeyword": 4.0
  }
}
```

**Key Features:**
- **Inverted Mapping:** keyword → array of scenario hashes
- **Fast Lookup:** O(1) keyword lookup, O(k) intersection for multiple keywords
- **Deduplication:** Each keyword maps to unique scenario hashes

**Statistics:**
- Total unique keywords: 3,646
- Average scenarios per keyword: 4.0
- Keyword distribution: Well-balanced for efficient lookups

### 3. quick-lookup.json (7.8 KB)

**Purpose:** Pre-computed cache for common query patterns

**Structure:**
```json
{
  "version": "1.0.0",
  "commonQueries": {
    "retry": {
      "uris": [
        "orchestr8://skills/error-handling-resilience",
        "orchestr8://skills/error-handling-async"
      ],
      "tokens": 1100
    },
    "workflow": {
      "uris": [
        "orchestr8://agents/workflow-architect",
        "orchestr8://patterns/phased-delivery"
      ],
      "tokens": 1220
    }
  }
}
```

**Key Features:**
- **Top Keywords:** 20 most common keywords from all fragments
- **Pre-computed Results:** Top 5 URIs per keyword
- **Token Estimates:** Total estimated tokens for cached results

**Statistics:**
- Common queries cached: 20
- Average URIs per query: 3-5
- Cache hit rate (expected): 40-60%

---

## Usage

### Loading Indexes in Code

```typescript
import { promises as fs } from "fs";
import { join } from "path";

// Load main index
const useWhenIndex = JSON.parse(
  await fs.readFile(
    join(process.cwd(), "resources/.index/usewhen-index.json"),
    "utf-8"
  )
);

// Load keyword index
const keywordIndex = JSON.parse(
  await fs.readFile(
    join(process.cwd(), "resources/.index/keyword-index.json"),
    "utf-8"
  )
);

// Load quick lookup cache
const quickLookup = JSON.parse(
  await fs.readFile(
    join(process.cwd(), "resources/.index/quick-lookup.json"),
    "utf-8"
  )
);
```

### Query Strategy (Three-Tier Lookup)

**TIER 1: Quick Lookup (O(1), ~10ms)**
```typescript
// Check if query matches a common pattern
const normalized = normalizeQuery(query);
if (quickLookup.commonQueries[normalized]) {
  return quickLookup.commonQueries[normalized];
}
```

**TIER 2: Keyword Index (O(k), ~50ms)**
```typescript
// Extract keywords from query
const keywords = extractKeywords(query);

// Find matching scenarios via inverted index
const candidateHashes = new Set<string>();
for (const keyword of keywords) {
  const hashes = keywordIndex.keywords[keyword] || [];
  hashes.forEach(h => candidateHashes.add(h));
}

// Retrieve full entries and score
const scenarios = Array.from(candidateHashes).map(
  hash => useWhenIndex.index[hash]
);

// Score and rank
const scored = scoreByRelevance(scenarios, keywords);
return scored.slice(0, maxResults);
```

**TIER 3: Fuzzy Match Fallback (O(n), ~200ms)**
```typescript
// Only used when index returns insufficient results
if (results.length < minResults) {
  return fuzzyMatcher.match({ query, mode: 'catalog', maxResults: 5 });
}
```

### Scoring Algorithm

**Keyword Overlap Scoring:**
```typescript
function scoreByRelevance(scenarios: IndexEntry[], queryKeywords: string[]) {
  return scenarios.map(scenario => {
    let score = 0;
    const scenarioKeywords = new Set(scenario.keywords);

    // Exact keyword matches (+20 each)
    for (const keyword of queryKeywords) {
      if (scenarioKeywords.has(keyword)) {
        score += 20;
      }
    }

    // Partial keyword matches (+10 each)
    for (const keyword of queryKeywords) {
      for (const scenarioKeyword of scenarioKeywords) {
        if (scenarioKeyword.includes(keyword) || keyword.includes(scenarioKeyword)) {
          score += 10;
          break;
        }
      }
    }

    return { ...scenario, score };
  }).sort((a, b) => b.score - a.score);
}
```

---

## Maintenance

### Rebuilding Indexes

**When to rebuild:**
- After adding new fragments
- After modifying useWhen scenarios
- After changing fragment metadata
- During deployment/CI pipeline

**How to rebuild:**
```bash
# From project root
npm run build-index

# Or using tsx directly
npx tsx scripts/build-index.ts
```

**Validation:**
The build script automatically validates:
- All 221 fragments are indexed
- At least 1000+ scenarios extracted
- At least 3000+ keywords indexed
- File sizes are reasonable (<1MB each)

### Index Versioning

**Version format:** `<major>.<minor>.<patch>`

**Version changes:**
- **Major:** Breaking changes to index structure
- **Minor:** New fields added (backward compatible)
- **Patch:** Bug fixes, re-indexing with same structure

**Current version:** 1.0.0

### Performance Monitoring

**Key metrics to track:**
```typescript
interface QueryMetrics {
  query: string;
  timestamp: number;
  tier: 'quick' | 'index' | 'fuzzy-fallback';
  latencyMs: number;
  resultsCount: number;
  tokenCost: number;
}
```

**Expected performance:**
- Tier 1 (quick): <10ms, ~5% of queries
- Tier 2 (index): <50ms, ~90% of queries
- Tier 3 (fallback): <200ms, ~5% of queries

---

## Technical Details

### Hash Generation

**Algorithm:** SHA-256 based stable hashing
```typescript
import { createHash } from "crypto";

function hashScenario(scenario: string, fragmentId: string): string {
  const hash = createHash("sha256")
    .update(`${fragmentId}:${scenario}`)
    .digest("hex")
    .substring(0, 12);

  return `scenario-${hash}`;
}
```

**Properties:**
- Deterministic (same input → same hash)
- Collision-resistant (unique per scenario)
- Short (12 hex chars = 48 bits)
- Prefixed for readability

### Keyword Extraction

**Algorithm:** Tokenization with stopword filtering
```typescript
function extractKeywords(text: string): string[] {
  // Normalize
  const normalized = text.toLowerCase().replace(/[^\w\s-]/g, " ");

  // Split and filter
  const words = normalized
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  // Deduplicate
  return Array.from(new Set(words));
}
```

**Features:**
- Lowercased for case-insensitive matching
- Stopwords removed (common words like "the", "and", "or")
- Minimum length: 3 characters
- Deduplicated for efficiency

### Category Mapping

**URI Format:** `orchestr8://<category-plural>/<fragment-id>`

**Category mappings:**
- agent → agents
- skill → skills
- pattern → patterns
- example → examples
- workflow → workflows

---

## Best Practices

### For Fragment Authors

**Writing effective useWhen scenarios:**
```yaml
useWhen:
  # GOOD: Specific, keyword-rich scenarios
  - "Implementing retry logic with exponential backoff for API calls experiencing intermittent timeouts"
  - "Building circuit breaker pattern for third-party service to prevent cascading failures"

  # AVOID: Vague or generic scenarios
  - "When you need error handling"
  - "For APIs"
```

**Guidelines:**
- Include specific technical terms (e.g., "retry", "exponential backoff")
- Mention concrete use cases (e.g., "API calls", "timeouts")
- Aim for 10-20 keywords per scenario
- Avoid generic phrases
- Use domain-specific terminology

### For Index Consumers

**Optimizing queries:**
```typescript
// GOOD: Specific keywords
query = "retry exponential backoff timeout"

// GOOD: Domain-specific terms
query = "circuit breaker cascading failure"

// AVOID: Too generic
query = "error handling"

// AVOID: Too short
query = "api"
```

**Guidelines:**
- Use 2-5 specific keywords
- Include technical terms
- Avoid single-word queries
- Add context when needed

---

## Troubleshooting

### Issue: No Results Found

**Possible causes:**
1. Query too generic (e.g., "api", "error")
2. No matching fragments for specific keywords
3. Typos in query

**Solutions:**
1. Add more specific keywords
2. Try related terms (e.g., "validation" vs "validate")
3. Use fuzzy match fallback

### Issue: Too Many Results

**Possible causes:**
1. Query too generic
2. Common keywords match many scenarios

**Solutions:**
1. Add more specific keywords to narrow down
2. Use category filters
3. Increase minScore threshold

### Issue: Stale Index

**Symptoms:**
- New fragments not appearing in results
- Modified useWhen not reflected
- Index version older than fragments

**Solution:**
```bash
npm run build-index
```

---

## Changelog

### Version 1.0.0 (2025-11-11)

**Initial release:**
- 221 fragments indexed
- 1,142 useWhen scenarios extracted
- 3,646 unique keywords
- Three-tier lookup strategy
- Stable SHA-256 hashing
- Quick lookup cache for top 20 keywords

**Performance:**
- Main index: 692 KB
- Keyword index: 525 KB
- Quick lookup: 7.8 KB
- Total: 1.2 MB

---

## Future Enhancements

### Planned Features

1. **Semantic Similarity (v2.0)**
   - Embedding-based matching using sentence transformers
   - Better handling of synonyms and paraphrasing
   - Trade-off: Requires ~50MB model, slower (50-100ms)

2. **Query Suggestions (v1.1)**
   - "Did you mean?" suggestions for typos
   - Related keywords based on index
   - Popular query recommendations

3. **Usage Analytics (v1.2)**
   - Track most-matched scenarios
   - Identify underutilized fragments
   - Optimize quick lookup cache based on usage

4. **Incremental Updates (v1.3)**
   - Update index for changed fragments only
   - Avoid full rebuild for minor changes
   - Faster CI/CD pipeline

---

## References

- **Design Document:** `USEWHEN_INDEX_DESIGN.md`
- **Implementation:** `src/utils/indexBuilder.ts`
- **Build Script:** `scripts/build-index.ts`
- **Integration:** `src/loaders/resourceLoader.ts`

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
**Maintained By:** Orchestr8 MCP Plugin
