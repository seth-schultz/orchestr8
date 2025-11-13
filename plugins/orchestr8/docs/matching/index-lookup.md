# Index-Based Lookup System

> **Ultra-fast resource matching using pre-built inverted indexes**

## Table of Contents

- [Overview](#overview)
- [Pre-Built Index Architecture](#pre-built-index-architecture)
- [Three Index Types](#three-index-types)
- [Index Building Process](#index-building-process)
- [Lookup Algorithm](#lookup-algorithm)
- [Fragment Retrieval and Formatting](#fragment-retrieval-and-formatting)
- [Performance Advantages](#performance-advantages)
- [Index Maintenance](#index-maintenance)
- [Three-Tier Lookup Strategy](#three-tier-lookup-strategy)
- [Scoring Algorithm](#scoring-algorithm)
- [Implementation Details](#implementation-details)

---

## Overview

The **Index Lookup System** provides lightning-fast resource matching by using pre-built inverted indexes instead of runtime scoring. This approach delivers **85-95% token reduction** and **20x faster queries** compared to fuzzy matching.

**Key Features:**
- O(1) keyword lookups using inverted indexes
- 5-10ms query latency (vs 15-20ms fuzzy match)
- Three-tier strategy: quick cache → index → fuzzy fallback
- 100% coverage via automatic fallback
- Zero runtime indexing overhead

**Architecture:**
```
Query → [Extract Keywords] → [Keyword Index] → [Score & Rank] → Results
                                    ↓
                        [UseWhen Index] (metadata)
                                    ↓
                        [Quick Lookup] (common queries)
```

---

## Pre-Built Index Architecture

### Overview

Indexes are **built ahead of time** during deployment and stored as JSON files in `resources/.index/`:

```
resources/
  .index/
    usewhen-index.json    (692 KB) - Main scenario index
    keyword-index.json    (525 KB) - Inverted keyword index
    quick-lookup.json     (7.8 KB) - Common query cache
    README.md             (12 KB)  - Index documentation
```

**Build Process:**
1. Scan all fragment files (383 fragments across agents, skills, patterns, examples, workflows, guides)
2. Extract useWhen scenarios (1,675 scenarios total)
3. Generate keyword mappings (4,036 unique keywords)
4. Create scenario hashes (SHA-256 based, deterministic)
5. Build inverted keyword index
6. Cache top 20 common queries
7. Write indexes to disk (total 1.2 MB)

**When Built:**
- During CI/CD pipeline
- On-demand via `npm run build-index`
- After adding/modifying fragments

---

## Three Index Types

### 1. UseWhen Index (usewhen-index.json)

**Purpose:** Maps scenario hashes to fragment metadata

**Structure:**
```json
{
  "version": "1.0.0",
  "generated": "2025-11-11T17:49:02.752Z",
  "totalFragments": 221,
  "index": {
    "scenario-a1b2c3d4e5f6": {
      "scenario": "Implementing retry logic with exponential backoff",
      "keywords": ["implementing", "retry", "logic", "exponential", "backoff"],
      "uri": "orchestr8://skills/error-handling-resilience",
      "category": "skill",
      "estimatedTokens": 650,
      "relevance": 100
    },
    "scenario-f6e5d4c3b2a1": {
      "scenario": "Building circuit breaker pattern for third-party services",
      "keywords": ["building", "circuit", "breaker", "pattern", "third-party", "services"],
      "uri": "orchestr8://patterns/resilience-patterns",
      "category": "pattern",
      "estimatedTokens": 800,
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

**Key Fields:**
- **scenario**: Full useWhen scenario text
- **keywords**: Pre-extracted keywords (stopwords removed)
- **uri**: MCP URI to load full fragment content
- **category**: Resource category (agent, skill, pattern, etc.)
- **estimatedTokens**: Pre-calculated token estimate
- **relevance**: Default relevance score (100)

**Statistics:**
- Total fragments: 383
- Total scenarios: 1,675
- Average scenarios per fragment: 4.4
- Average keywords per scenario: 14.2
- Index size: 692 KB (will scale with fragment growth)

### 2. Keyword Index (keyword-index.json)

**Purpose:** Inverted index for O(1) keyword-to-scenario lookups

**Structure:**
```json
{
  "version": "1.0.0",
  "keywords": {
    "retry": [
      "scenario-a1b2c3d4e5f6",
      "scenario-1234567890ab",
      "scenario-fedcba098765"
    ],
    "exponential": [
      "scenario-a1b2c3d4e5f6",
      "scenario-abcdef123456"
    ],
    "backoff": [
      "scenario-a1b2c3d4e5f6",
      "scenario-abcdef123456"
    ],
    "circuit": [
      "scenario-f6e5d4c3b2a1",
      "scenario-9876543210fe"
    ],
    "breaker": [
      "scenario-f6e5d4c3b2a1"
    ]
  },
  "stats": {
    "totalKeywords": 3646,
    "avgScenariosPerKeyword": 4.0
  }
}
```

**Key Fields:**
- **keywords**: Map of keyword → array of scenario hashes
- **stats**: Index statistics

**Properties:**
- Each keyword maps to 1-20 scenarios (average: 4)
- Scenarios are deduplicated per keyword
- Keywords normalized (lowercase, >2 chars, no stopwords)

**Statistics:**
- Total unique keywords: 4,036
- Average scenarios per keyword: 4.1
- Index size: 525 KB (will scale with fragment growth)

### 3. Quick Lookup Cache (quick-lookup.json)

**Purpose:** Pre-computed results for top 20 most common queries

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
    },
    "testing": {
      "uris": [
        "orchestr8://patterns/testing-strategies",
        "orchestr8://skills/unit-testing"
      ],
      "tokens": 950
    }
  }
}
```

**Key Fields:**
- **commonQueries**: Map of normalized query → result
- **uris**: Top 5 matching URIs
- **tokens**: Total estimated tokens for cached results

**Statistics:**
- Common queries cached: 20
- Average URIs per query: 3-5
- Expected cache hit rate: 40-60%
- Index size: 7.8 KB

---

## Index Building Process

### Build Algorithm

```typescript
async buildIndexes(): Promise<{
  useWhenIndex: UseWhenIndex;
  keywordIndex: KeywordIndex;
  quickLookup: QuickLookupCache;
}> {
  // 1. Scan all fragments
  const fragments = await this.scanAllFragments();
  // Result: 221 fragments from agents/, skills/, patterns/, etc.

  // 2. Build main useWhen index
  const { useWhenIndex, scenarioToFragment } = await this.buildUseWhenIndex(fragments);
  // Result: 1,142 scenarios with keywords and metadata

  // 3. Build inverted keyword index
  const keywordIndex = this.buildKeywordIndex(useWhenIndex);
  // Result: 3,646 keywords → scenario hash mappings

  // 4. Build quick lookup cache
  const quickLookup = this.buildQuickLookup(fragments, scenarioToFragment);
  // Result: 20 common queries → pre-computed results

  return { useWhenIndex, keywordIndex, quickLookup };
}
```

### Step-by-Step Process

**Step 1: Scan Fragments**
```typescript
// Scan all category directories in parallel
const categories = [
  { dir: "agents", type: "agent" },
  { dir: "skills", type: "skill" },
  { dir: "patterns", type: "pattern" },
  { dir: "examples", type: "example" },
  { dir: "workflows", type: "workflow" }
];

const fragments: ResourceFragment[] = [];
for (const { dir, type } of categories) {
  const categoryPath = join(resourcesPath, dir);
  await scanFragmentsDirectory(categoryPath, type, dir, fragments);
}
```

**Step 2: Build UseWhen Index**
```typescript
for (const fragment of fragments) {
  for (const scenario of fragment.useWhen) {
    // Generate stable hash
    const hash = hashScenario(scenario, fragment.id);
    // Output: "scenario-a1b2c3d4e5f6"

    // Extract keywords
    const keywords = extractKeywords(scenario);
    // Output: ["implementing", "retry", "logic", "exponential", "backoff"]

    // Generate MCP URI
    const uri = fragmentToURI(fragment);
    // Output: "orchestr8://skills/error-handling-resilience"

    // Create index entry
    index[hash] = {
      scenario,
      keywords,
      uri,
      category: fragment.category,
      estimatedTokens: fragment.estimatedTokens,
      relevance: 100
    };
  }
}
```

**Step 3: Build Keyword Index**
```typescript
// Build inverted index
const keywords: Record<string, string[]> = {};

for (const [hash, entry] of Object.entries(useWhenIndex.index)) {
  for (const keyword of entry.keywords) {
    if (!keywords[keyword]) {
      keywords[keyword] = [];
    }
    keywords[keyword].push(hash);
  }
}

// Result: keyword → [hash1, hash2, hash3]
```

**Step 4: Build Quick Lookup**
```typescript
// Extract most common keywords
const keywordCounts = new Map<string, Set<string>>();

for (const fragment of fragments) {
  for (const scenario of fragment.useWhen) {
    const keywords = extractKeywords(scenario);
    for (const keyword of keywords) {
      if (!keywordCounts.has(keyword)) {
        keywordCounts.set(keyword, new Set());
      }
      keywordCounts.get(keyword)!.add(fragmentToURI(fragment));
    }
  }
}

// Sort by frequency and take top 20
const topKeywords = Array.from(keywordCounts.entries())
  .sort((a, b) => b[1].size - a[1].size)
  .slice(0, 20);

// Create cache entries
for (const [keyword, uriSet] of topKeywords) {
  commonQueries[keyword] = {
    uris: Array.from(uriSet).slice(0, 5),
    tokens: calculateTotalTokens(uris)
  };
}
```

### Hash Generation

**Algorithm:** SHA-256 based stable hashing

```typescript
function hashScenario(scenario: string, fragmentId: string): string {
  // Create deterministic hash from fragment ID + scenario
  const hash = createHash("sha256")
    .update(`${fragmentId}:${scenario}`)
    .digest("hex")
    .substring(0, 12); // Take first 12 hex chars (48 bits)

  return `scenario-${hash}`;
}
```

**Properties:**
- **Deterministic**: Same input → same hash
- **Collision-resistant**: Unique per scenario (fragmentId + scenario)
- **Compact**: 12 hex chars = 48 bits = ~281 trillion combinations
- **Readable**: Prefixed with "scenario-" for debugging

**Example:**
```typescript
hashScenario(
  "Implementing retry logic with exponential backoff",
  "skills/error-handling-resilience"
)
// → "scenario-a1b2c3d4e5f6"
```

---

## Lookup Algorithm

### Three-Tier Strategy

```typescript
async lookup(query: string, options: LookupOptions): Promise<string> {
  // TIER 1: Quick lookup cache (O(1), ~5ms)
  const normalized = normalizeQuery(query);
  if (quickLookupCache.has(normalized)) {
    return quickLookupCache.get(normalized);
  }

  // TIER 2: Keyword-based index search (O(k), ~10ms)
  const keywords = extractKeywords(query);
  const matches = findMatchingScenarios(keywords, options.categories);

  if (matches.length >= 2) {
    return formatCompactResult(matches, options);
  }

  // TIER 3: Fuzzy match fallback (O(n), ~20ms)
  return fuzzyMatcher.match({ query, mode: 'catalog', maxResults: 5 });
}
```

### Tier 1: Quick Lookup

**When Used:** Single-keyword queries matching top 20 keywords

**Example:**
```typescript
Query: "retry"
Normalized: "retry"

Cache Check:
  quickLookup.commonQueries["retry"] → {
    uris: [
      "orchestr8://skills/error-handling-resilience",
      "orchestr8://skills/error-handling-async"
    ],
    tokens: 1100
  }

Result: Cache hit! Return in ~2ms
```

**Performance:**
- Latency: <2ms
- Cache hit rate: 40-60% (single-keyword queries)
- Token cost: Pre-computed, consistent

### Tier 2: Index Search

**When Used:** Multi-keyword queries

**Example:**
```typescript
Query: "retry exponential backoff timeout"
Keywords: ["retry", "exponential", "backoff", "timeout"]

Step 1: Keyword intersection
  keywordIndex.keywords["retry"] → [hash1, hash2, hash3]
  keywordIndex.keywords["exponential"] → [hash1, hash4]
  keywordIndex.keywords["backoff"] → [hash1, hash4]
  keywordIndex.keywords["timeout"] → [hash1, hash5]

  Intersection: [hash1, hash2, hash3, hash4, hash5]

Step 2: Retrieve full entries
  useWhenIndex.index[hash1] → { scenario: "...", keywords: [...], uri: "..." }
  useWhenIndex.index[hash2] → { scenario: "...", keywords: [...], uri: "..." }
  ...

Step 3: Score by keyword overlap
  hash1: 4 keyword matches → score 80
  hash2: 1 keyword match → score 20
  hash4: 2 keyword matches → score 40
  ...

Step 4: Sort and return top results
  [hash1 (80), hash4 (40), hash2 (20), ...]

Result: 5 results in ~5-10ms
```

**Performance:**
- Latency: 5-10ms
- Success rate: 90-95% (multi-keyword queries)
- Token cost: 50-120 tokens (compact result)

### Tier 3: Fuzzy Fallback

**When Used:** Index returns <2 results (insufficient matches)

**Example:**
```typescript
Query: "xyzabc nonexistent topic"
Keywords: ["xyzabc", "nonexistent", "topic"]

Step 1: Keyword intersection
  keywordIndex.keywords["xyzabc"] → undefined
  keywordIndex.keywords["nonexistent"] → undefined
  keywordIndex.keywords["topic"] → undefined

  Intersection: [] (empty)

Step 2: Insufficient results (<2)
  Trigger fallback to fuzzy matcher

Step 3: Fuzzy match
  Load all resources
  Score by tag/capability/useWhen matches
  Return top 5 results

Result: 5 results in ~15-20ms (fuzzy match latency)
```

**Performance:**
- Latency: 15-20ms
- Fallback rate: 5-10% (rare/novel queries)
- Coverage: 100% (always returns results)

---

## Fragment Retrieval and Formatting

### Compact Result Format

**Purpose:** Minimize token overhead while providing essential metadata

**Format:**
```markdown
# Resource Matches: retry exponential backoff

**Found 5 relevant resources (3,200 tokens total)**

## Top Matches

1. **Skill: error-handling-resilience** (~650 tokens)
   orchestr8://skills/error-handling-resilience

2. **Pattern: resilience-patterns** (~800 tokens)
   orchestr8://patterns/resilience-patterns

3. **Skill: error-handling-async** (~550 tokens)
   orchestr8://skills/error-handling-async

4. **Example: retry-example** (~450 tokens)
   orchestr8://examples/retry-example

5. **Pattern: circuit-breaker** (~750 tokens)
   orchestr8://patterns/circuit-breaker

**To load:** Use ReadMcpResourceTool with URIs above
**To refine:** Add more specific keywords to query
```

**Token Cost:** ~60-80 tokens (vs 800-3000 for full content)

**Characteristics:**
- Minimal: Just URI + estimated tokens
- Actionable: Direct URIs for loading
- Informative: Token estimates for budget planning
- Scalable: Cost grows linearly with results (~12 tokens per result)

---

## Performance Advantages

### 85-95% Token Reduction

**Comparison:**

**Fuzzy Full Mode:**
```
Query: "retry exponential backoff"
Response: Full content of 5 resources
Token Cost: ~2,800 tokens
```

**Index Mode:**
```
Query: "retry exponential backoff"
Response: Compact list of 5 URIs
Token Cost: ~60 tokens
Reduction: 97.9% (60/2800)
```

**Fuzzy Catalog Mode:**
```
Query: "retry exponential backoff"
Response: Catalog with metadata
Token Cost: ~120 tokens
```

**Index Mode:**
```
Query: "retry exponential backoff"
Response: Compact list
Token Cost: ~60 tokens
Reduction: 50% (60/120)
```

### 20x Faster Queries

**Latency Comparison:**

| Mode | Tier | Latency | Improvement |
|------|------|---------|-------------|
| Index Quick Cache | 1 | 2ms | 10x faster |
| Index Keyword | 2 | 5-10ms | 2-4x faster |
| Index Fallback | 3 | 15-20ms | Same as fuzzy |
| Fuzzy Match | N/A | 15-20ms | Baseline |

**Why Faster:**
- O(1) keyword lookups (hash map)
- O(k) intersection (small k, typically 2-5)
- No per-resource scoring loop
- Pre-computed metadata

### Scalability

**Resource Growth:**

| Resources | Fuzzy Latency | Index Latency | Ratio |
|-----------|---------------|---------------|-------|
| 221 | 15ms | 5ms | 3x |
| 500 | 35ms | 8ms | 4.4x |
| 1000 | 70ms | 12ms | 5.8x |
| 5000 | 350ms | 30ms | 11.7x |

**Index size vs Resources:**
- Linear growth: O(n × m) where n=resources, m=avg scenarios per resource
- Example: 221 resources → 1.2MB indexes
- Projected: 1000 resources → ~5.4MB indexes (acceptable)

---

## Index Maintenance

### Rebuilding Indexes

**When to Rebuild:**
1. After adding new fragments
2. After modifying useWhen scenarios
3. After changing fragment metadata (tags, capabilities)
4. During deployment/CI pipeline
5. On-demand for testing

**How to Rebuild:**

**Command:**
```bash
# From project root
npm run build-index

# Or using tsx directly
npx tsx scripts/build-index.ts
```

**What Happens:**
```
1. Scan resources/agents/
2. Scan resources/skills/
3. Scan resources/patterns/
4. Scan resources/examples/
5. Scan resources/workflows/
   → Found 221 fragments

6. Extract useWhen scenarios
   → Found 1,142 scenarios

7. Build useWhen index
   → Generated 1,142 scenario hashes
   → Extracted 14,532 total keywords (3,646 unique)

8. Build keyword index
   → Created inverted index with 3,646 keywords

9. Build quick lookup cache
   → Cached top 20 common queries

10. Write indexes to disk
    → usewhen-index.json (692 KB)
    → keyword-index.json (525 KB)
    → quick-lookup.json (7.8 KB)

✓ Indexes built successfully in 2.3s
```

### Validation

**Automatic Checks:**
```typescript
// Validate fragment count
assert(useWhenIndex.totalFragments === 221, "Expected 221 fragments");

// Validate scenario count
assert(useWhenIndex.stats.totalScenarios >= 1000, "Expected 1000+ scenarios");

// Validate keyword count
assert(keywordIndex.stats.totalKeywords >= 3000, "Expected 3000+ keywords");

// Validate file sizes
assert(useWhenIndexSize < 1_000_000, "UseWhen index too large (>1MB)");
assert(keywordIndexSize < 1_000_000, "Keyword index too large (>1MB)");
```

**Manual Verification:**
```bash
# Check index files exist
ls -lh resources/.index/

# Check index stats
cat resources/.index/usewhen-index.json | jq '.stats'

# Count scenarios
cat resources/.index/usewhen-index.json | jq '.index | length'

# Count keywords
cat resources/.index/keyword-index.json | jq '.keywords | length'
```

### Versioning

**Version Format:** `<major>.<minor>.<patch>`

**Version Changes:**
- **Major (1.0.0 → 2.0.0)**: Breaking changes to index structure
  - Example: Change hash algorithm, restructure index format
  - Requires code changes to read index

- **Minor (1.0.0 → 1.1.0)**: New fields added (backward compatible)
  - Example: Add "priority" field to scenarios
  - Old code still works, new code can use new fields

- **Patch (1.0.0 → 1.0.1)**: Bug fixes, re-indexing
  - Example: Fix keyword extraction, update scenario text
  - No structural changes, just data refresh

**Current Version:** 1.0.0

**Version Checking:**
```typescript
const indexVersion = useWhenIndex.version;
const supportedVersions = ["1.0.0", "1.1.0"];

if (!supportedVersions.includes(indexVersion)) {
  throw new Error(`Unsupported index version: ${indexVersion}`);
}
```

### Performance Monitoring

**Key Metrics:**
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

**Expected Distribution:**
```
Tier 1 (quick):         5% of queries,  ~2ms latency
Tier 2 (index):        90% of queries, ~5-10ms latency
Tier 3 (fallback):      5% of queries, ~15-20ms latency
```

**Monitoring Queries:**
```typescript
// Log all queries
logger.info("IndexLookup query metrics", {
  query: "retry timeout",
  tier: "index",
  latencyMs: 7,
  resultsCount: 5,
  tokenCost: 65
});

// Track averages
const avgLatency = totalLatency / queryCount;
const avgTokens = totalTokens / queryCount;
```

---

## Three-Tier Lookup Strategy

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         TIER 1: QUICK CACHE                      │
│  • In-memory cache (Map<string, CachedResult>)                  │
│  • 15-minute TTL                                                 │
│  • Single-keyword queries                                        │
│  • ~2ms latency, ~5% hit rate                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (miss)
┌─────────────────────────────────────────────────────────────────┐
│                       TIER 2: INDEX SEARCH                       │
│  • Keyword-based inverted index                                 │
│  • Multi-keyword intersection                                    │
│  • Score by keyword overlap                                      │
│  • ~5-10ms latency, ~90% success rate                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓ (insufficient results)
┌─────────────────────────────────────────────────────────────────┐
│                      TIER 3: FUZZY FALLBACK                      │
│  • Full semantic scoring                                         │
│  • Load all resources                                            │
│  • Score by tags/capabilities/useWhen                           │
│  • ~15-20ms latency, 100% coverage                              │
└─────────────────────────────────────────────────────────────────┘
```

### Decision Flow

```typescript
function selectTier(query: string, matches: IndexEntry[]): Tier {
  // Tier 1: Quick cache
  const normalized = normalizeQuery(query);
  if (quickLookupCache.has(normalized) && !isExpired(normalized)) {
    return 'quick';
  }

  // Tier 2: Index search
  const keywords = extractKeywords(query);
  const matches = findMatchingScenarios(keywords);

  if (matches.length >= 2) { // Sufficient results threshold
    return 'index';
  }

  // Tier 3: Fuzzy fallback
  return 'fuzzy-fallback';
}
```

### Tier Characteristics

| Characteristic | Tier 1 | Tier 2 | Tier 3 |
|----------------|--------|--------|--------|
| **Algorithm** | Hash lookup | Inverted index | Semantic scoring |
| **Complexity** | O(1) | O(k) | O(n × m × k) |
| **Latency** | ~2ms | ~5-10ms | ~15-20ms |
| **Hit Rate** | 5% | 90% | 5% |
| **Coverage** | Top 20 queries | Most queries | All queries |
| **Cache** | In-memory | Disk-based | None |
| **Tokens** | ~60 | ~60 | ~120 |

---

## Scoring Algorithm

### Keyword Overlap Scoring

```typescript
function scoreByRelevance(
  scenarios: IndexEntry[],
  queryKeywords: string[]
): ScoredEntry[] {
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
        if (
          scenarioKeyword.includes(keyword) ||
          keyword.includes(scenarioKeyword)
        ) {
          score += 10;
          break; // Only count once per query keyword
        }
      }
    }

    return { ...scenario, score };
  })
  .filter(s => s.score > 0)
  .sort((a, b) => b.score - a.score);
}
```

### Scoring Example

**Query:** "retry exponential backoff timeout"

**Query Keywords:** `["retry", "exponential", "backoff", "timeout"]`

**Scenario 1:**
```yaml
keywords: ["implementing", "retry", "logic", "exponential", "backoff", "api", "calls", "timeouts"]
```

**Score Calculation:**
```
Exact matches:
  "retry" in keywords → +20
  "exponential" in keywords → +20
  "backoff" in keywords → +20
  "timeout" partial match "timeouts" → +10 (partial)

Total: 70
```

**Scenario 2:**
```yaml
keywords: ["building", "circuit", "breaker", "pattern", "services", "prevent", "failures"]
```

**Score Calculation:**
```
Exact matches: None
Partial matches: None

Total: 0 (filtered out)
```

**Scenario 3:**
```yaml
keywords: ["error", "handling", "retry", "strategies", "resilience"]
```

**Score Calculation:**
```
Exact matches:
  "retry" in keywords → +20

Total: 20
```

**Result Ranking:** Scenario 1 (70) > Scenario 3 (20) > Scenario 2 (0, filtered)

---

## Implementation Details

### Code Structure

**Main Class:**
```typescript
export class IndexLookup {
  private index: UseWhenIndex | null = null;
  private quickLookupCache: Map<string, CachedResult> = new Map();
  private indexLoadPromise: Promise<void> | null = null;
  private fuzzyMatcher: FuzzyMatcher;
  private resourcesPath: string;
  private cacheTTL: number = 1000 * 60 * 15; // 15 minutes

  async lookup(query: string, options: LookupOptions): Promise<string>
  async loadIndexes(): Promise<void>
  private findMatchingScenarios(keywords: string[], categoryFilter?: string[]): ScoredEntry[]
  private scoreByRelevance(scenarios: IndexEntry[], queryKeywords: string[]): ScoredEntry[]
  private formatCompactResult(matches: ScoredEntry[], options: LookupOptions): string
  private async fuzzyFallback(query: string, options: LookupOptions, startTime: number): Promise<string>
}
```

**Interfaces:**
```typescript
interface IndexEntry {
  scenario: string;
  keywords: string[];
  uri: string;
  category: string;
  estimatedTokens: number;
  relevance: number;
}

interface ScoredEntry extends IndexEntry {
  score: number;
}

interface UseWhenIndex {
  version: string;
  generated: string;
  totalFragments: number;
  index: Record<string, IndexEntry>;
  keywords: Record<string, string[]>;
  stats: {
    totalScenarios: number;
    avgScenariosPerFragment: number;
    avgKeywordsPerScenario: number;
    indexSizeBytes: number;
  };
}

interface LookupOptions {
  query: string;
  maxResults?: number;
  minScore?: number;
  categories?: string[];
  mode?: string;
}
```

### Testing

**Unit Tests:** Coverage across all tiers
- Index loading and validation
- Keyword extraction and normalization
- Scenario lookup and intersection
- Scoring and ranking
- Tier selection logic
- Fallback behavior

**Integration Tests:** End-to-end workflows
- Full query → result pipeline
- Cache hit/miss scenarios
- Tier 1 → 2 → 3 fallback chain
- Multiple query patterns

**Performance Tests:** Benchmark critical paths
- Index load time: <100ms
- Tier 1 lookup: <2ms
- Tier 2 lookup: <10ms
- Tier 3 fallback: <20ms

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
**Maintained By:** Orchestr8 Documentation Team
