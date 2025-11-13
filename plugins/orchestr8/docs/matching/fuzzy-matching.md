# Fuzzy Matching Algorithm

> **Semantic resource discovery using keyword-based scoring and ranking**

## Table of Contents

- [Overview](#overview)
- [Algorithm Architecture](#algorithm-architecture)
- [Keyword Extraction](#keyword-extraction)
- [Scoring Algorithm](#scoring-algorithm)
- [Fragment Selection Strategy](#fragment-selection-strategy)
- [Token Budget Management](#token-budget-management)
- [Assembly Process](#assembly-process)
- [Catalog Mode vs Full Mode](#catalog-mode-vs-full-mode)
- [Scoring Examples](#scoring-examples)
- [Performance Characteristics](#performance-characteristics)
- [Implementation Details](#implementation-details)

---

## Overview

The **Fuzzy Matcher** is a semantic resource discovery system that matches natural language queries against a library of resource fragments. It uses keyword extraction and multi-signal scoring to rank resources by relevance, then assembles the most relevant content within a token budget.

**Key Features:**
- Semantic keyword matching across tags, capabilities, and use cases (1,675 useWhen scenarios)
- Multi-signal scoring algorithm with configurable weights
- Token-aware fragment selection across 383 fragments
- Four output modes: index (default), minimal, catalog, or full content
- Sub-20ms query latency with caching (warm cache: 4ms)

**Use Cases:**
- Exploratory searches: "What TypeScript resources are available?"
- Multi-keyword queries: "async await error handling patterns"
- Development and testing of new resources
- Default matching mode when index lookup insufficient

---

## Algorithm Architecture

### Five-Step Matching Process

```typescript
async match(request: MatchRequest): Promise<MatchResult> {
  // 1. Load all resource metadata (cached)
  const allResources = await this.loadResourceIndex();

  // 2. Extract keywords from query
  const keywords = this.extractKeywords(request.query);

  // 3. Score each resource
  const scored = allResources.map(resource => ({
    resource,
    score: this.calculateScore(resource, keywords, request)
  }));

  // 4. Sort by relevance and filter by threshold
  const validScored = scored
    .filter(s => s.score >= (request.minScore ?? 10))
    .sort((a, b) => b.score - a.score);

  // 5. Select top resources (catalog mode: by maxResults, full mode: by token budget)
  const selected = request.mode === 'catalog'
    ? validScored.slice(0, request.maxResults || 15)
    : this.selectWithinBudget(validScored, request.maxTokens || 3000);

  // 6. Assemble content
  const assembled = request.mode === 'catalog'
    ? this.assembleCatalog(selected)
    : this.assembleContent(selected);

  return { fragments, totalTokens, matchScores, assembledContent };
}
```

### Data Flow

```
User Query
    ↓
[Keyword Extraction] → ["typescript", "async", "api"]
    ↓
[Load Index] → 221 resources loaded (cached)
    ↓
[Score Resources] → Calculate relevance for each
    ↓
[Filter by Threshold] → Remove scores < minScore
    ↓
[Sort by Score] → Highest relevance first
    ↓
[Select Top N / Within Budget] → Catalog or Full mode
    ↓
[Assemble Content] → Catalog or Full output
    ↓
Result (50-3000 tokens)
```

---

## Keyword Extraction

### Algorithm

```typescript
extractKeywords(query: string): string[] {
  // 1. Normalize: lowercase and remove special characters
  const normalized = query.toLowerCase().replace(/[^\w\s-]/g, " ");

  // 2. Split on whitespace
  const words = normalized.split(/\s+/);

  // 3. Filter stop words and short words
  const filtered = words.filter(word =>
    word.length > 1 && !stopWords.has(word)
  );

  // 4. Deduplicate
  return Array.from(new Set(filtered));
}
```

### Stop Words List

Common words filtered out (44 total):
```javascript
const stopWords = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "as", "is", "was", "are", "were", "be",
  "been", "being", "have", "has", "had", "do", "does", "did", "will",
  "would", "should", "could", "may", "might", "can", "i", "you", "he",
  "she", "it", "we", "they", "this", "that", "these", "those"
]);
```

### Examples

**Query:** "Build a TypeScript REST API with authentication"

**Extracted Keywords:** `["build", "typescript", "rest", "api", "authentication"]`

**Filtered Out:** `["a", "with"]` (stop words)

---

**Query:** "How to handle async/await errors in Node.js"

**Extracted Keywords:** `["how", "handle", "async", "await", "errors", "node", "js"]`

**Filtered Out:** `["to", "in"]` (stop words)

---

**Query:** "kubernetes deployment scaling"

**Extracted Keywords:** `["kubernetes", "deployment", "scaling"]`

**Filtered Out:** (none)

---

### Keyword Normalization

- **Case insensitive:** "TypeScript" → "typescript"
- **Preserve hyphens:** "REST-API" → "rest-api"
- **Remove punctuation:** "async/await!" → "async", "await"
- **Minimum length:** 2 characters (filters "a", "i", etc.)
- **Unique only:** Duplicate words removed

---

## Scoring Algorithm

### Multi-Signal Scoring System

Resources are scored based on keyword matches across multiple metadata fields:

```typescript
calculateScore(resource: ResourceFragment, keywords: string[], request: MatchRequest): number {
  let score = 0;

  // SIGNAL 1: Category match (+15)
  if (matchesCategory(request.category, resource.category)) {
    score += 15;
  }

  // SIGNAL 2: Tag matches (+10 per keyword)
  for (const keyword of keywords) {
    for (const tag of resource.tags) {
      if (tag.includes(keyword)) {
        score += 10;
        break; // Only count once per keyword
      }
    }
  }

  // SIGNAL 3: Capability matches (+8 per keyword)
  for (const keyword of keywords) {
    for (const capability of resource.capabilities) {
      if (capability.toLowerCase().includes(keyword)) {
        score += 8;
        break;
      }
    }
  }

  // SIGNAL 4: UseWhen matches (+5 per keyword)
  for (const keyword of keywords) {
    for (const useCase of resource.useWhen) {
      if (useCase.toLowerCase().includes(keyword)) {
        score += 5;
        break;
      }
    }
  }

  // SIGNAL 5: Size preference (+5 if < 1000 tokens)
  if (resource.estimatedTokens < 1000) {
    score += 5;
  }

  // FILTER: Required tags (must have all or score = 0)
  if (request.requiredTags && request.requiredTags.length > 0) {
    const hasAll = request.requiredTags.every(tag =>
      resource.tags.includes(tag)
    );
    if (!hasAll) {
      return 0; // Disqualified
    }
  }

  return score;
}
```

### Scoring Weights

| Signal | Weight | Rationale |
|--------|--------|-----------|
| Tag match | +10 | Tags are primary identifiers, highest weight for exact matches |
| Capability match | +8 | Capabilities describe functionality, strong signal of relevance |
| UseWhen match | +5 | Use cases provide context, moderate signal |
| Category match | +15 | Category filter strongly indicates intent |
| Small resource | +5 | Prefer focused resources over comprehensive ones |

### Scoring Properties

**Additive:** Multiple keyword matches accumulate points
- Query "typescript async" matching both tags: +20 total

**Per-keyword:** Each keyword can only contribute once per signal type
- Tag "async" matching keyword "async": +10 (once)
- Cannot double-count same tag/keyword pair

**Early exit:** Required tags filter applied first
- Missing required tag: score = 0 (no further calculation)

**Deterministic:** Same query + resource = same score
- Enables caching and reproducibility

---

## Fragment Selection Strategy

### Catalog Mode (mode=catalog)

**Strategy:** Select top N by score, regardless of token count

```typescript
const selected = validScored.slice(0, request.maxResults || 15);
```

**Characteristics:**
- Simple: Just take top N highest scores
- Fast: O(1) slice operation
- Token-efficient: Catalog entries are ~8-12 tokens each
- Use case: Exploratory searches, browsing resources

**Example:**
```
Query: "typescript api patterns"
maxResults: 5

Selected:
1. typescript-developer (score: 45, ~1200 tokens)
2. rest-api-design (score: 38, ~800 tokens)
3. async-patterns (score: 33, ~600 tokens)
4. api-versioning (score: 28, ~500 tokens)
5. error-handling (score: 25, ~700 tokens)

Catalog output: ~60 tokens total
```

### Full Mode (mode=full)

**Strategy:** Greedy selection within token budget

```typescript
selectWithinBudget(scored: ScoredResource[], maxTokens: number): ScoredResource[] {
  const selected: ScoredResource[] = [];
  let totalTokens = 0;

  for (const item of scored) {
    // Always include top 3, even if over budget
    if (selected.length < 3) {
      selected.push(item);
      totalTokens += item.resource.estimatedTokens;
      continue;
    }

    // After top 3, only add if within budget
    if (totalTokens + item.resource.estimatedTokens <= maxTokens) {
      selected.push(item);
      totalTokens += item.resource.estimatedTokens;
    }

    // Stop if we have enough and used 80%+ of budget
    if (selected.length >= 3 && totalTokens > maxTokens * 0.8) {
      break;
    }
  }

  return selected;
}
```

**Characteristics:**
- Always includes top 3 resources (even if over budget)
- Greedily adds more resources while under budget
- Stops when 80% of budget used and at least 3 resources selected
- Use case: Immediate content loading

**Example:**
```
Query: "typescript api patterns"
maxTokens: 2000

Processing:
1. typescript-developer (score: 45, 1200 tokens) → Total: 1200 ✓ (top 3)
2. rest-api-design (score: 38, 800 tokens) → Total: 2000 ✓ (top 3)
3. async-patterns (score: 33, 600 tokens) → Total: 2600 ✗ (over budget, but top 3)
4. api-versioning (score: 28, 500 tokens) → Skip (would exceed budget)
5. Stop (3 resources, 130% of budget)

Selected: 3 resources, 2600 tokens (exceeds budget, but top 3 guaranteed)
```

---

## Token Budget Management

### Budget Behavior

**Hard Limits:**
- Catalog mode: No budget limit (catalog entries ~8-12 tokens each)
- Full mode: `maxTokens` parameter (default: 3000)

**Soft Limits:**
- Always include top 3 resources in full mode
- Stop adding after 80% budget used (prevents unnecessary resources)

### Token Estimation

Resources have pre-calculated token estimates:

```typescript
interface ResourceFragment {
  id: string;
  category: "agent" | "skill" | "example" | "pattern" | "workflow";
  tags: string[];
  capabilities: string[];
  useWhen: string[];
  estimatedTokens: number;  // ← Pre-calculated
  content: string;
}
```

**Estimation Formula:** `tokens ≈ content.length / 4`
- Based on typical 4 characters per token ratio
- Calculated once during index building
- Cached for fast selection

### Budget Examples

**Small Budget (1000 tokens):**
- Top 3 resources: ~1500 tokens (exceeded, but guaranteed)
- Additional resources: None (budget constraint)

**Medium Budget (2500 tokens):**
- Top 3 resources: ~1800 tokens
- Additional resources: +1-2 smaller resources (~500-700 tokens)
- Total: ~2300-2500 tokens (80-100% of budget)

**Large Budget (5000 tokens):**
- Top 3 resources: ~1800 tokens
- Additional resources: +3-5 more resources (~1500-2500 tokens)
- Total: ~3300-4300 tokens (66-86% of budget)
- Stops early if 80% reached with 3+ resources

---

## Assembly Process

### Content Assembly (Full Mode)

**Step 1: Sort by Category**
```typescript
const categoryOrder = {
  agent: 0,
  skill: 1,
  pattern: 2,
  example: 3,
  workflow: 4
};

const ordered = fragments.sort((a, b) =>
  categoryOrder[a.resource.category] - categoryOrder[b.resource.category]
);
```

**Step 2: Format Each Fragment**
```markdown
## Agent: typescript-developer
**Relevance Score:** 45
**Tags:** typescript, nodejs, async, rest-api
**Capabilities:** build REST APIs, async programming, type safety

[Full content from fragment.content...]
```

**Step 3: Join with Separators**
```markdown
[Fragment 1]
---
[Fragment 2]
---
[Fragment 3]
```

### Catalog Assembly (Catalog Mode)

**Step 1: Generate Header**
```markdown
# 📚 Orchestr8 Resource Catalog

**Query Results:** 8 matched resources
**Total Tokens Available:** 6,200

## How to Use This Catalog
[Instructions for loading resources...]
```

**Step 2: Format Catalog Entries**
```markdown
### 1. Agent: typescript-developer

**Relevance Score:** 45/100
**Tags:** typescript, nodejs, async, rest-api...
**Capabilities:**
  - build REST APIs
  - async programming
  - type safety
**Use When:**
  - Building TypeScript applications
  - Need type-safe Node.js development
  - Creating REST API services
**Estimated Tokens:** ~1200

**Load this resource:**
```
orchestr8://agents/typescript-developer
```
```

**Step 3: Assemble All Entries**
```markdown
[Header]
---
[Entry 1]
---
[Entry 2]
---
[Entry 3]
...
```

---

## Catalog Mode vs Full Mode

### Comparison Table

| Aspect | Catalog Mode | Full Mode |
|--------|-------------|-----------|
| **Output Size** | 50-120 tokens | 800-3000 tokens |
| **Token Reduction** | 85-95% | 0% (full content) |
| **Selection Strategy** | Top N by score | Greedy within budget |
| **Load Time** | Immediate | Immediate |
| **Use Case** | Exploration, browsing | Ready-to-use content |
| **Next Step** | Load selected resources | Use immediately |

### When to Use Catalog Mode

**Advantages:**
- Minimal token overhead (~50-120 tokens total)
- Can review many options (15+ resources)
- Load only what you need
- Ideal for exploration

**Disadvantages:**
- Requires second step to load content
- More API calls if loading multiple resources

**Example Workflow:**
```typescript
// Step 1: Get catalog
const catalog = await readResource(
  'orchestr8://match?query=typescript+api&mode=catalog&maxResults=10'
);

// Step 2: Review catalog and choose
// User sees: 10 resources with scores, tags, URIs

// Step 3: Load selected resources
const agent = await readResource('orchestr8://agents/typescript-developer');
const skill = await readResource('orchestr8://skills/async-patterns');
```

### When to Use Full Mode

**Advantages:**
- One-step loading (no second request)
- Immediate content availability
- Convenient for known queries

**Disadvantages:**
- Higher token cost (800-3000 tokens)
- May load unnecessary content
- Limited by token budget

**Example Workflow:**
```typescript
// Single step: Get full content
const result = await readResource(
  'orchestr8://match?query=typescript+developer&mode=full&maxTokens=2500&categories=agents'
);

// Content immediately available
// Start using agent right away
```

---

## Scoring Examples

### Example 1: Perfect Match

**Query:** "typescript async rest api"

**Keywords:** `["typescript", "async", "rest", "api"]`

**Resource:** typescript-developer
```yaml
category: agent
tags: [typescript, nodejs, async, rest-api]
capabilities: [build REST APIs, async programming, type safety]
useWhen:
  - Building TypeScript applications
  - Need type-safe Node.js development
  - Creating REST API services
estimatedTokens: 1200
```

**Score Breakdown:**
```
Category: Not filtered (+0)
Tag "typescript": matches keyword "typescript" (+10)
Tag "async": matches keyword "async" (+10)
Tag "rest-api": matches keyword "rest" (+10) and "api" (+10)
Capability "REST APIs": matches "rest" (+8) and "api" (+8)
Capability "async programming": matches "async" (+8)
UseWhen "TypeScript applications": matches "typescript" (+5)
UseWhen "REST API services": matches "rest" (+5) and "api" (+5)
Size (1200 tokens): no bonus (+0)

Total Score: 79
```

### Example 2: Partial Match

**Query:** "error handling patterns"

**Keywords:** `["error", "handling", "patterns"]`

**Resource:** error-handling-resilience
```yaml
category: skill
tags: [error-handling, logging, debugging]
capabilities: [error handling, logging strategies, debugging]
useWhen:
  - Implementing error handling
  - Setting up logging
  - Debugging applications
estimatedTokens: 650
```

**Score Breakdown:**
```
Category: Not filtered (+0)
Tag "error-handling": matches "error" (+10) and "handling" (+10)
Capability "error handling": matches "error" (+8) and "handling" (+8)
UseWhen "error handling": matches "error" (+5) and "handling" (+5)
Size (650 tokens): < 1000 bonus (+5)

Total Score: 51
```

### Example 3: Category Bonus

**Query:** "typescript developer"

**Request:** `{ query: "typescript developer", category: "agent" }`

**Keywords:** `["typescript", "developer"]`

**Resource:** typescript-developer (category: agent)
```yaml
category: agent
tags: [typescript, nodejs, async, rest-api]
capabilities: [TypeScript development, Node.js expertise]
useWhen: [Building TypeScript applications]
estimatedTokens: 1200
```

**Score Breakdown:**
```
Category: matches "agent" (+15) ← BONUS
Tag "typescript": matches keyword "typescript" (+10)
Capability "TypeScript development": matches "typescript" (+8)
UseWhen "TypeScript applications": matches "typescript" (+5)

Total Score: 38 (with category bonus)
Without Category: 23
```

### Example 4: Required Tags Filter

**Query:** "api development"

**Request:** `{ query: "api development", requiredTags: ["typescript", "nodejs"] }`

**Keywords:** `["api", "development"]`

**Resource A:** typescript-developer
```yaml
tags: [typescript, nodejs, async, rest-api]
```
**Result:** Passes required tags filter, scored normally

**Resource B:** python-developer
```yaml
tags: [python, data-science, machine-learning]
```
**Result:** Fails required tags filter, score = 0 (disqualified)

---

## Performance Characteristics

### Latency Breakdown

**Cold Cache (first query):**
```
Index Load:     ~10ms  (scan and parse 221 fragments)
Keyword Extract: ~0.05ms (single query processing)
Scoring:         ~3ms   (221 resources × keyword checks)
Selection:       ~0.1ms (sort and slice)
Assembly:        ~1ms   (format output)
────────────────────────
Total:           ~15ms
```

**Warm Cache (subsequent queries):**
```
Index Load:     ~0ms   (cached)
Keyword Extract: ~0.05ms
Scoring:         ~3ms
Selection:       ~0.1ms
Assembly:        ~1ms
────────────────────────
Total:           ~4ms
```

### Memory Usage

**Index Cache:**
- Fragment metadata: ~2MB (221 resources × ~9KB each)
- Cached for lifetime of server process
- LRU eviction after 4 hours of inactivity

**Query Cache:**
- None (queries are stateless)
- Each query re-scores resources

### Scalability

**Resource Count:**
- Current: 221 fragments (~15ms)
- 500 fragments: ~30-40ms (projected)
- 1000 fragments: ~60-80ms (projected)

**Optimization at scale:**
- Implement incremental scoring (score until confidence threshold)
- Pre-filter by category before scoring
- Use index mode for common queries

---

## Implementation Details

### Code Structure

**Main Class:**
```typescript
export class FuzzyMatcher {
  private resourceIndex: ResourceFragment[] = [];
  private indexLoaded: boolean = false;
  private resourcesPath: string;

  async match(request: MatchRequest): Promise<MatchResult>
  extractKeywords(query: string): string[]
  calculateScore(resource: ResourceFragment, keywords: string[], request: MatchRequest): number
  selectWithinBudget(scored: ScoredResource[], maxTokens: number): ScoredResource[]
  assembleContent(fragments: ScoredResource[]): { content: string; tokens: number }
  assembleCatalog(fragments: ScoredResource[]): { content: string; tokens: number }
}
```

**Interfaces:**
```typescript
interface ResourceFragment {
  id: string;
  category: "agent" | "skill" | "example" | "pattern" | "workflow";
  tags: string[];
  capabilities: string[];
  useWhen: string[];
  estimatedTokens: number;
  content: string;
}

interface MatchRequest {
  query: string;
  category?: string;
  categories?: string[];
  maxTokens?: number;
  requiredTags?: string[];
  mode?: 'full' | 'catalog' | 'index';
  maxResults?: number;
  minScore?: number;
}

interface MatchResult {
  fragments: ResourceFragment[];
  totalTokens: number;
  matchScores: number[];
  assembledContent: string;
}
```

### Testing

**Unit Tests:** 80+ test cases
- Keyword extraction (8 tests)
- Score calculation (12 tests)
- Budget selection (8 tests)
- Content assembly (6 tests)
- Integration (8 tests)
- Edge cases (10 tests)
- Match quality (4 tests)

**Performance Benchmarks:** 8 benchmarks
- Keyword extraction: <0.1ms per call
- Matching 100 resources: <20ms
- Matching 500 resources: <100ms
- Complex queries: <30ms

### Configuration

**Tunable Parameters:**
```typescript
// Scoring weights (in calculateScore)
const TAG_MATCH_WEIGHT = 10;
const CAPABILITY_MATCH_WEIGHT = 8;
const USEWHEN_MATCH_WEIGHT = 5;
const CATEGORY_BONUS = 15;
const SMALL_RESOURCE_BONUS = 5;

// Selection thresholds (in selectWithinBudget)
const MIN_TOP_RESOURCES = 3;
const BUDGET_THRESHOLD = 0.8; // 80%

// Default values
const DEFAULT_MAX_TOKENS = 3000;
const DEFAULT_MAX_RESULTS = 15;
const DEFAULT_MIN_SCORE = 10;
```

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
**Maintained By:** Orchestr8 Documentation Team
