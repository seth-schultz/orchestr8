# System Design - Orchestr8 MCP Server

> **Detailed component breakdown, data flows, and implementation details**

## Table of Contents

- [Component Architecture](#component-architecture)
- [MCP Protocol Integration](#mcp-protocol-integration)
- [Resource Loading Pipeline](#resource-loading-pipeline)
- [Dynamic Matching System](#dynamic-matching-system)
- [Index-Based Lookup System](#index-based-lookup-system)
- [Caching Architecture](#caching-architecture)
- [Fragment System](#fragment-system)
- [Hot Reload Mechanism](#hot-reload-mechanism)
- [Error Handling Strategy](#error-handling-strategy)
- [Performance Optimizations](#performance-optimizations)

---

## Component Architecture

### 1. MCP Server Core (src/index.ts)

#### Initialization Sequence

```
1. Load environment variables (.env)
2. Initialize logger (stderr output)
3. Create MCP server instance
   ├─ name: "orchestr8"
   └─ version: "1.0.0"
4. Initialize loaders
   ├─ PromptLoader(logger)
   └─ ResourceLoader(logger)
5. Load all prompts and resources
   ├─ loadAllPrompts() → PromptMetadata[]
   └─ loadAllResources() → ResourceMetadata[]
6. Pre-load resource index (optional, for faster first query)
7. Register prompts with MCP server
   ├─ Convert arguments to Zod schemas
   └─ Register handlers with async callbacks
8. Register resources with MCP server
   ├─ Static resources (direct URIs)
   └─ Dynamic templates (wildcard URIs)
9. Register dynamic resource templates
   ├─ Category-specific: orchestr8://{category}/match{+rest}
   └─ Global: orchestr8://match{+rest}
10. Setup hot reload (development mode only)
11. Create stdio transport
12. Connect server to transport
13. Setup signal handlers (SIGINT, SIGTERM)
```

#### Prompt Registration

**Source Location:** `src/index.ts:50-94`

```typescript
// Convert prompt arguments to Zod schema
const argsSchema: any = {};
for (const arg of prompt.arguments) {
  const zodType = arg.required ? z.string() : z.string().optional();
  argsSchema[arg.name] = zodType;
}

// Register with MCP server
server.registerPrompt(
  prompt.name,
  {
    title: prompt.title,
    description: prompt.description,
    argsSchema: Object.keys(argsSchema).length > 0 ? argsSchema : undefined,
  },
  async (args: any, _extra: any) => {
    // Load prompt content with argument substitution
    const content = await promptLoader.loadPromptContent(prompt, args);

    return {
      messages: [
        {
          role: "user" as const,
          content: { type: "text" as const, text: content },
        },
      ],
    };
  }
);
```

#### Resource Registration

**Source Location:** `src/index.ts:96-124`

**Static Resources:**
```typescript
server.registerResource(
  resource.name,
  resource.uri,
  {
    mimeType: resource.mimeType,
    description: resource.description,
  },
  async (uri) => {
    const content = await resourceLoader.loadResourceContent(resource.uri);

    return {
      contents: [
        {
          uri: uri.toString(),
          mimeType: resource.mimeType,
          text: content,
        },
      ],
    };
  }
);
```

**Dynamic Templates:**
```typescript
const templateUri = `orchestr8://${category}/match{+rest}`;

server.registerResource(
  `${category}-dynamic`,
  new ResourceTemplate(templateUri, { list: undefined }),
  {
    mimeType: "text/markdown",
    description: description,
  },
  async (uri, params: Record<string, any>) => {
    const fullUri = uri.toString();
    const content = await resourceLoader.loadResourceContent(fullUri);

    return {
      contents: [
        {
          uri: fullUri,
          mimeType: "text/markdown",
          text: content,
        },
      ],
    };
  }
);
```

---

### 2. Prompt Loader (src/loaders/promptLoader.ts)

#### Directory Scanning

**Source Location:** `src/loaders/promptLoader.ts:36-61`

```
loadAllPrompts()
├─ loadPromptsFromCategory("workflows", "workflow")
├─ loadPromptsFromCategory("agents", "agent")
└─ loadPromptsFromCategory("skills", "skill")

loadPromptsFromCategory(directory, category)
├─ Check directory exists: fs.access(categoryPath)
├─ Read directory: fs.readdir(categoryPath)
├─ Filter .md files
└─ For each file:
    └─ loadPromptMetadata(filePath, category) → PromptMetadata
```

#### Metadata Extraction

**Source Location:** `src/loaders/promptLoader.ts:98-127`

**Frontmatter Format:**
```yaml
---
name: new-project
title: Create New Project
description: Create a new software project with best practices
version: 1.0.0
arguments:
  - name: description
    description: Project description
    required: true
tags: [project, setup, initialization]
estimatedTokens: 2000
---
```

**Parsed Structure:**
```typescript
interface PromptMetadata {
  name: string;              // Unique identifier
  title: string;             // Display title
  description: string;       // User-facing description
  version: string;           // Semantic version
  arguments?: Array<{        // Optional arguments
    name: string;
    description: string;
    required: boolean;
  }>;
  tags?: string[];          // Keywords
  estimatedTokens?: number; // Size estimate
  category: "workflow" | "agent" | "skill";
}
```

#### Argument Substitution

**Source Location:** `src/loaders/promptLoader.ts:156-180`

**Substitution Rules:**
1. **Backward compatibility**: Replace `$ARGUMENTS` with first argument value
2. **Named placeholders**: Replace `${argument-name}` with argument value
3. **Skip undefined/null**: Don't substitute missing arguments

**Example:**
```markdown
Input:
  "Build a ${language} application for ${purpose}"
  args = { language: "TypeScript", purpose: "REST API" }

Output:
  "Build a TypeScript application for REST API"
```

#### Caching Strategy

**Source Location:** `src/loaders/promptLoader.ts:12-26`

```typescript
this.cache = new LRUCache<string, string>({
  max: cacheSize,              // Default: 100
  ttl: 1000 * 60 * 60,        // 1 hour
  updateAgeOnGet: true,        // Extend TTL on access
});

// Cache key includes arguments
const cacheKey = `${metadata.name}:${JSON.stringify(args)}`;
```

**Why 1 hour TTL?**
- Prompts change frequently during development
- Shorter TTL ensures developers see changes quickly
- Still provides performance benefit for repeated calls

#### Hot Reload

**Source Location:** `src/loaders/promptLoader.ts:199-216`

```typescript
this.watcher = chokidar.watch(`${this.promptsPath}/**/*.md`, {
  persistent: true,
  ignoreInitial: true,
});

this.watcher.on("all", (event: string, filePath: string) => {
  logger.info(`Prompt file ${event}: ${filePath}`);
  this.cache.clear(); // Clear cache on any change
  callback();         // Notify caller
});
```

---

### 3. Resource Loader (src/loaders/resourceLoader.ts)

#### Resource Index Loading

**Source Location:** `src/loaders/resourceLoader.ts:139-165`

**Lazy Singleton Pattern:**
```typescript
async loadResourceIndex(): Promise<ResourceFragment[]> {
  // Return cached index if available
  if (this.resourceIndex !== null) {
    return this.resourceIndex;
  }

  // If already loading, wait for that promise
  if (this.indexLoadPromise !== null) {
    return this.indexLoadPromise;
  }

  // Start loading
  this.indexLoadPromise = this._loadResourceIndexImpl();

  try {
    this.resourceIndex = await this.indexLoadPromise;
    return this.resourceIndex;
  } finally {
    this.indexLoadPromise = null;
  }
}
```

**Why this pattern?**
- Prevents duplicate loads if multiple requests arrive during initial load
- Ensures only one index in memory
- Avoids race conditions

#### Parallel Directory Scanning

**Source Location:** `src/loaders/resourceLoader.ts:172-217`

```typescript
const categories = ["agents", "skills", "examples", "patterns", "guides", "workflows"];

// Scan all categories in parallel
const categoryPromises = categories.map(async (category) => {
  const categoryPath = join(this.resourcesPath, category);
  const categoryFragments: ResourceFragment[] = [];

  try {
    await fs.access(categoryPath);
    await this._scanForFragments(categoryPath, category, category, categoryFragments);
  } catch (error) {
    logger.debug(`Category directory not found: ${category}`);
  }

  return categoryFragments;
});

// Wait for all categories to be scanned
const fragmentArrays = await Promise.all(categoryPromises);

// Flatten results
const fragments = fragmentArrays.flat();
```

**Performance Benefit:**
- Sequential: ~600ms (6 directories × 100ms each)
- Parallel: ~100ms (max single directory scan time)
- **6x speedup** for initial load

#### Fragment Metadata Extraction

**Source Location:** `src/loaders/resourceLoader.ts:266-299`

**Extraction Strategy:**

1. **Tags** (Priority Order):
   - Frontmatter `tags` array (preferred)
   - Extract from first heading
   - Common programming keywords in content

2. **Capabilities** (Priority Order):
   - Frontmatter `capabilities` array (preferred)
   - Extract from "Capabilities" section

3. **UseWhen** (Priority Order):
   - Frontmatter `useWhen` array (preferred)
   - Extract from "When to Use" section

**Example Extraction:**
```markdown
---
tags: [typescript, async, patterns]
capabilities:
  - Async/await error handling
  - Promise composition
useWhen:
  - Building async TypeScript applications
  - Need robust error handling patterns
---

# Async Patterns

Content here...
```

#### Static vs Dynamic Resource Loading

**Source Location:** `src/loaders/resourceLoader.ts:459-481`

```
loadResourceContent(uri)
├─ Check cache first
├─ Parse URI (URIParser)
└─ Route based on type:
    ├─ type === "static"
    │   └─ _loadStaticResource(uri, parsed)
    │       ├─ Convert URI to file path
    │       ├─ Read file (fs.readFile)
    │       ├─ Cache content
    │       └─ Return content
    └─ type === "dynamic"
        └─ _loadDynamicResource(uri, parsed)
            ├─ Check mode (index vs fuzzy)
            ├─ mode === "index"
            │   └─ indexLookup.lookup(query, options)
            └─ mode !== "index"
                ├─ Load resource index
                ├─ fuzzyMatcher.match(request)
                ├─ Cache assembled content
                └─ Return assembled content
```

---

### 4. URI Parser (src/utils/uriParser.ts)

#### URI Format

**Static URI:**
```
orchestr8://category/resource-id
         ↑        ↑            ↑
      protocol  category   identifier
```

**Dynamic URI:**
```
orchestr8://category/match?query=typescript+api&maxTokens=2000
         ↑        ↑     ↑              ↑
      protocol category path      query params
```

**Global Dynamic URI:**
```
orchestr8://match?query=python+async&categories=skill,example
         ↑     ↑              ↑
      protocol path     query params
```

#### Parsing Logic

**Source Location:** `src/utils/uriParser.ts:91-113`

```typescript
parse(uri: string): ParsedURI {
  // Validate protocol
  if (!uri.startsWith("orchestr8://")) {
    throw new Error("Invalid URI protocol");
  }

  // Remove protocol
  const withoutProtocol = uri.substring("orchestr8://".length);

  // Check if dynamic matching URI
  if (withoutProtocol.includes("/match?") || withoutProtocol.startsWith("match?")) {
    return this.parseDynamicURI(withoutProtocol);
  }

  // Parse as static URI
  return this.parseStaticURI(withoutProtocol);
}
```

#### Query Parameter Parsing

**Source Location:** `src/utils/uriParser.ts:192-274`

**Supported Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | required | Search query (URL-encoded) |
| `maxTokens` | number | 3000 | Maximum tokens in response |
| `tags` | string[] | undefined | Required tags (comma-separated) |
| `categories` | string[] | undefined | Category filter (comma-separated) |
| `mode` | enum | "catalog" | Response mode: "full" \| "catalog" \| "index" |
| `maxResults` | number | 15 | Max results in catalog mode |
| `minScore` | number | 10 | Minimum relevance score threshold |

**Parsing Example:**
```
Input:
  "orchestr8://agents/match?query=typescript+api&maxTokens=2500&tags=async&mode=catalog"

Output:
  {
    type: "dynamic",
    category: "agents",
    matchParams: {
      query: "typescript api",
      maxTokens: 2500,
      tags: ["async"],
      mode: "catalog"
    }
  }
```

---

## MCP Protocol Integration

### Protocol Version

**Implemented:** MCP Protocol 2024-11-05
**SDK Version:** @modelcontextprotocol/sdk v1.21.1

### Transport Layer

**Type:** stdio (Standard Input/Output)

```typescript
const transport = new StdioServerTransport();
await server.connect(transport);
```

**Why stdio?**
- Simple process-based communication
- Standard for Claude Code plugins
- Easy debugging (separate stderr for logs)
- No network overhead

### Message Flow

```
┌────────────────┐                    ┌─────────────────┐
│  Claude Code   │                    │  MCP Server     │
└────────┬───────┘                    └────────┬────────┘
         │                                     │
         │ 1. Initialize                       │
         ├────────────────────────────────────>│
         │                                     │
         │ 2. List Prompts                     │
         ├────────────────────────────────────>│
         │ <────────────────────────────────── │
         │    [prompt1, prompt2, ...]          │
         │                                     │
         │ 3. List Resources                   │
         ├────────────────────────────────────>│
         │ <────────────────────────────────── │
         │    [resource1, resource2, ...]      │
         │                                     │
         │ 4. Get Prompt (name, args)          │
         ├────────────────────────────────────>│
         │                                     │
         │                                     │ Load prompt
         │                                     │ Substitute args
         │                                     │ Check cache
         │ <────────────────────────────────── │
         │    { messages: [...] }              │
         │                                     │
         │ 5. Read Resource (uri)              │
         ├────────────────────────────────────>│
         │                                     │
         │                                     │ Parse URI
         │                                     │ Load content
         │                                     │ Check cache
         │ <────────────────────────────────── │
         │    { contents: [...] }              │
         │                                     │
```

### Error Handling

**Protocol-Level Errors:**
- Malformed JSON-RPC requests
- Invalid method names
- Missing required parameters

**Application-Level Errors:**
- File not found
- Invalid URI format
- Query parsing errors
- Resource loading failures

**Error Response Format:**
```json
{
  "jsonrpc": "2.0",
  "id": "request-id",
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": {
      "details": "Resource not found: orchestr8://agents/nonexistent"
    }
  }
}
```

---

## Resource Loading Pipeline

### Request Processing Flow

```
1. URI arrives at ResourceLoader.loadResourceContent(uri)
   ├─ Check cache
   │  └─ If hit: return cached content (<1ms)
   │
2. Parse URI (URIParser)
   ├─ Validate protocol
   ├─ Extract components
   └─ Determine type: static or dynamic
   │
3. Route based on type
   │
   ├─ STATIC PATH:
   │  ├─ Convert URI to file path
   │  │  └─ orchestr8://agents/typescript-developer
   │  │     → resources/agents/typescript-developer.md
   │  ├─ Read file (fs.readFile)
   │  ├─ Cache content (4hr TTL)
   │  └─ Return content
   │
   └─ DYNAMIC PATH:
      ├─ Check mode parameter
      │
      ├─ MODE: "index"
      │  ├─ Load indexes (lazy)
      │  ├─ indexLookup.lookup(query, options)
      │  │  ├─ Extract keywords
      │  │  ├─ Quick lookup cache check
      │  │  ├─ Keyword index search
      │  │  │  ├─ Intersect keyword matches
      │  │  │  ├─ Score by relevance
      │  │  │  └─ Format compact result (50-120 tokens)
      │  │  └─ Fallback to fuzzy if insufficient matches
      │  └─ Return formatted result
      │
      └─ MODE: "catalog" or "full"
         ├─ Load resource index (lazy)
         ├─ fuzzyMatcher.match(request)
         │  ├─ Extract keywords from query
         │  ├─ Score all resources
         │  │  ├─ Tag matches (+10 each)
         │  │  ├─ Capability matches (+8 each)
         │  │  ├─ UseWhen matches (+5 each)
         │  │  ├─ Category bonus (+15)
         │  │  └─ Size bonus (+5 if < 1000 tokens)
         │  ├─ Filter by minScore threshold
         │  ├─ Sort by score (descending)
         │  ├─ Select resources
         │  │  ├─ Mode "catalog": Top N by maxResults
         │  │  └─ Mode "full": Within token budget
         │  └─ Assemble content
         │     ├─ Mode "catalog": Lightweight index
         │     └─ Mode "full": Full content
         ├─ Cache assembled content (4hr TTL)
         └─ Return assembled content
```

### Static Resource Example

**Request:**
```
URI: orchestr8://agents/typescript-developer
```

**Processing:**
1. Cache miss (first request)
2. Parse URI → `{ type: "static", category: "agents", resourceId: "typescript-developer" }`
3. Convert to path → `resources/agents/typescript-developer.md`
4. Read file → 2000 tokens
5. Cache with key `orchestr8://agents/typescript-developer`
6. Return content

**Subsequent Requests:**
- Cache hit (<1ms)
- Return cached content

### Dynamic Resource Example (Fuzzy Mode)

**Request:**
```
URI: orchestr8://match?query=typescript+async+error&maxTokens=2500&mode=catalog
```

**Processing:**
1. Cache miss
2. Parse URI → `{ type: "dynamic", matchParams: { query: "typescript async error", maxTokens: 2500, mode: "catalog" } }`
3. Load index (200 fragments, cached after first load)
4. Extract keywords → `["typescript", "async", "error"]`
5. Score all fragments:
   - `typescript-async-patterns` → 45 (3 tag matches)
   - `error-handling-async` → 40 (2 tag + 1 capability)
   - `typescript-core` → 25 (1 tag + 1 capability)
6. Sort and select top 15 (catalog mode)
7. Assemble catalog (~800 tokens):
   - Header with instructions
   - Top 15 matches with metadata
   - URIs for on-demand loading
8. Cache assembled content
9. Return catalog

### Dynamic Resource Example (Index Mode)

**Request:**
```
URI: orchestr8://match?query=typescript+async+error&mode=index
```

**Processing:**
1. Cache miss
2. Parse URI → `{ type: "dynamic", matchParams: { query: "typescript async error", mode: "index" } }`
3. Load indexes (usewhen-index.json, keyword-index.json)
4. Extract keywords → `["typescript", "async", "error"]`
5. Quick lookup cache check → miss
6. Keyword index intersection:
   - keyword "typescript" → [hash1, hash2, hash3, ...]
   - keyword "async" → [hash2, hash4, hash5, ...]
   - keyword "error" → [hash2, hash6, ...]
   - Intersection → [hash2, ...]
7. Score by keyword overlap
8. Format compact result (50-120 tokens):
   - List of top 5 URIs
   - Brief descriptions
   - Token estimates
9. Cache in quick lookup
10. Return compact result

**Token Comparison:**
- Fuzzy catalog mode: ~800 tokens
- Index mode: ~50-120 tokens
- **85-93% reduction**

---

## Dynamic Matching System

### Fuzzy Matcher Deep Dive

#### Keyword Extraction

**Source Location:** `src/utils/fuzzyMatcher.ts:179-241`

**Algorithm:**
1. Normalize: lowercase, remove special characters
2. Split on whitespace
3. Filter stop words (the, and, or, etc.)
4. Filter short words (length <= 1)
5. Return unique keywords

**Example:**
```
Input: "Build a TypeScript REST API with authentication"
Output: ["build", "typescript", "rest", "api", "authentication"]
```

#### Scoring Algorithm

**Source Location:** `src/utils/fuzzyMatcher.ts:271-343`

**Multi-Factor Scoring:**

```typescript
let score = 0;

// 1. Category match (+15)
if (request.category && resource.category === request.category) {
  score += 15;
}

// 2. Tag matches (+10 per keyword)
for (const keyword of keywords) {
  for (const tag of resource.tags) {
    if (tag.includes(keyword)) {
      score += 10;
      break; // Only count once per keyword
    }
  }
}

// 3. Capability matches (+8 per keyword)
for (const keyword of keywords) {
  for (const cap of resource.capabilities) {
    if (cap.toLowerCase().includes(keyword)) {
      score += 8;
      break;
    }
  }
}

// 4. UseWhen matches (+5 per keyword)
for (const keyword of keywords) {
  for (const use of resource.useWhen) {
    if (use.toLowerCase().includes(keyword)) {
      score += 5;
      break;
    }
  }
}

// 5. Size preference (+5 if < 1000 tokens)
if (resource.estimatedTokens < 1000) {
  score += 5;
}

// 6. Required tags (must have all or disqualified)
if (request.requiredTags) {
  const hasAll = request.requiredTags.every(tag => resource.tags.includes(tag));
  if (!hasAll) {
    return 0; // Disqualified
  }
}
```

**Scoring Example:**

**Resource:** `typescript-async-patterns.md`
```yaml
tags: [typescript, async, patterns, promises]
capabilities:
  - Async/await error handling
  - Promise composition patterns
useWhen:
  - Building async TypeScript applications
  - Need error handling for promises
estimatedTokens: 800
```

**Query:** "typescript async error"
**Keywords:** ["typescript", "async", "error"]

**Score Calculation:**
- Category match: +0 (no category filter)
- Tag "typescript": +10 (match)
- Tag "async": +10 (match)
- Capability "error handling": +8 (contains "error")
- UseWhen "error handling": +5 (contains "error")
- Size bonus: +5 (800 < 1000)
- **Total: 38**

#### Fragment Selection

**Source Location:** `src/utils/fuzzyMatcher.ts:361-395`

**Budget-Aware Selection:**

```typescript
selectWithinBudget(scored: ScoredResource[], maxTokens: number): ScoredResource[] {
  const selected: ScoredResource[] = [];
  let totalTokens = 0;

  for (const item of scored) {
    const wouldExceedBudget = totalTokens + item.resource.estimatedTokens > maxTokens;

    // Always include top 3, even if over budget
    if (selected.length < 3) {
      selected.push(item);
      totalTokens += item.resource.estimatedTokens;
      continue;
    }

    // After top 3, only add if within budget
    if (!wouldExceedBudget) {
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

**Selection Strategy:**
1. **Guarantee top 3**: Always include 3 highest-scoring resources
2. **Budget-aware**: After top 3, only add if within budget
3. **Early exit**: Stop at 80% budget utilization (diminishing returns)

#### Content Assembly

**Source Location:** `src/utils/fuzzyMatcher.ts:413-452` (full mode), `src/utils/fuzzyMatcher.ts:463-564` (catalog mode)

**Full Mode:**
```markdown
## Agent: typescript-core
**Relevance Score:** 38
**Tags:** typescript, types, generics
**Capabilities:** Complex type system design, Generic constraints

[Full content here...]

---

## Skill: error-handling-async
**Relevance Score:** 32
**Tags:** async, error, promises
**Capabilities:** Async error handling, Try/catch patterns

[Full content here...]
```

**Catalog Mode:**
```markdown
# Resource Catalog

**Query Results:** 15 matched resources
**Total Tokens Available:** 12,500

## How to Use This Catalog

Load resources on-demand when needed:

### 1. Agent: typescript-core
**Relevance Score:** 38/100
**Tags:** typescript, types, generics
**Capabilities:**
  - Complex type system design
  - Generic type constraints
**Use When:**
  - Designing type-safe APIs
  - Need advanced TypeScript patterns
**Estimated Tokens:** ~650

**Load this resource:**
```
orchestr8://agents/typescript-core
```

[... more entries ...]
```

---

## Index-Based Lookup System

### Index Structure

#### UseWhen Index

**File:** `resources/.index/usewhen-index.json`

```json
{
  "version": "1.0.0",
  "generated": "2025-11-11T10:00:00.000Z",
  "totalFragments": 150,
  "index": {
    "scenario-a1b2c3d4e5f6": {
      "scenario": "Building async TypeScript applications",
      "keywords": ["building", "async", "typescript", "applications"],
      "uri": "orchestr8://agents/typescript-async-patterns",
      "category": "agent",
      "estimatedTokens": 800,
      "relevance": 100
    },
    "scenario-f6e5d4c3b2a1": {
      "scenario": "Need error handling for promises",
      "keywords": ["need", "error", "handling", "promises"],
      "uri": "orchestr8://skills/error-handling-async",
      "category": "skill",
      "estimatedTokens": 650,
      "relevance": 100
    }
  },
  "stats": {
    "totalScenarios": 450,
    "avgScenariosPerFragment": 3.0,
    "avgKeywordsPerScenario": 4.5,
    "indexSizeBytes": 125000
  }
}
```

#### Keyword Index (Inverted)

**File:** `resources/.index/keyword-index.json`

```json
{
  "version": "1.0.0",
  "keywords": {
    "typescript": [
      "scenario-a1b2c3d4e5f6",
      "scenario-b2c3d4e5f6a1",
      "scenario-c3d4e5f6a1b2"
    ],
    "async": [
      "scenario-a1b2c3d4e5f6",
      "scenario-f6e5d4c3b2a1",
      "scenario-d4e5f6a1b2c3"
    ],
    "error": [
      "scenario-f6e5d4c3b2a1",
      "scenario-e5f6a1b2c3d4"
    ]
  },
  "stats": {
    "totalKeywords": 280,
    "avgScenariosPerKeyword": 3.2
  }
}
```

### Three-Tier Lookup Strategy

**Source Location:** `src/utils/indexLookup.ts:111-195`

#### Tier 1: Quick Lookup Cache

**Purpose:** O(1) lookup for common queries
**TTL:** 15 minutes
**Size:** Unlimited (memory-based)

```typescript
const normalized = this.normalizeQuery(query); // "typescript-async-error"
const cached = this.quickLookupCache.get(normalized);

if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
  return cached.content; // ~10ms
}
```

#### Tier 2: Keyword Index

**Purpose:** O(k) lookup via keyword intersection
**Performance:** ~50ms

```typescript
// Extract keywords
const keywords = this.extractKeywords(query); // ["typescript", "async", "error"]

// Get candidate hashes from inverted index
const candidateHashes = new Set<string>();
for (const keyword of keywords) {
  const hashes = this.index.keywords[keyword] || [];
  hashes.forEach(h => candidateHashes.add(h));
}

// Get full entries
const candidates = Array.from(candidateHashes)
  .map(hash => this.index.index[hash])
  .filter(entry => entry !== undefined);

// Filter by category
const filtered = categoryFilter
  ? candidates.filter(c => categoryFilter.includes(c.category))
  : candidates;

// Score by keyword overlap
const scored = this.scoreByRelevance(filtered, keywords);
```

**Scoring:**
- Exact keyword match: +20
- Partial keyword match: +10

#### Tier 3: Fuzzy Fallback

**Purpose:** Full fuzzy matching for edge cases
**Performance:** ~200ms

```typescript
if (matches.length < minResults) {
  return await this.fuzzyFallback(query, options, startTime);
}
```

### Performance Comparison

| Tier | Lookup Method | Time | Token Cost | Hit Rate |
|------|---------------|------|------------|----------|
| 1 | Quick Cache | ~10ms | 50-120 | 30% |
| 2 | Keyword Index | ~50ms | 50-120 | 55% |
| 3 | Fuzzy Fallback | ~200ms | 800-2000 | 15% |

**Overall Performance:**
- Average: ~60ms
- Token reduction: 85-95% vs fuzzy catalog mode
- Combined hit rate: 85%

---

## Caching Architecture

### LRU Cache Implementation

**Library:** `lru-cache` v11.2.2

**Configuration:**

```typescript
// Prompt Cache
new LRUCache<string, string>({
  max: 100,                    // Max entries
  ttl: 1000 * 60 * 60,        // 1 hour TTL
  updateAgeOnGet: true,        // Extend TTL on access
});

// Resource Cache
new LRUCache<string, string>({
  max: 200,                    // Max entries
  ttl: 1000 * 60 * 60 * 4,    // 4 hour TTL
  updateAgeOnGet: true,        // Extend TTL on access
});
```

### Cache Key Strategies

#### Prompt Cache

**Key Format:** `{name}:{JSON.stringify(args)}`

**Examples:**
```
"new-project:{\"description\":\"REST API\"}"
"add-feature:{\"description\":\"user auth\"}"
"fix-bug:{}"
```

**Why include args?**
- Same prompt with different args produces different content
- Argument substitution is deterministic
- Enables caching of variations

#### Resource Cache

**Static Resources:**
```
Key: Full URI
Example: "orchestr8://agents/typescript-developer"
```

**Dynamic Resources:**
```
Key: Full query URI (including all parameters)
Example: "orchestr8://match?query=typescript+async&maxTokens=2500&mode=catalog"
```

### Cache Invalidation

**Manual Invalidation:**
```typescript
// Hot reload (development)
promptLoader.watchForChanges(() => {
  this.cache.clear();
});
```

**Automatic Invalidation:**
- TTL expiration (time-based)
- LRU eviction (size-based)

**No Preemptive Invalidation:**
- No file watching in production (performance)
- Restart server to pick up resource changes

---

## Fragment System

### Fragment Organization

**Post-Optimization Structure (384 fragments total):**

```
resources/
├── agents/ (149 fragments)
│   ├── typescript-developer.md      # Main resource (references fragments)
│   ├── typescript-core.md           # Type system (~650 tokens)
│   ├── typescript-async-patterns.md # Async patterns (~800 tokens)
│   ├── typescript-testing.md        # Testing (~700 tokens)
│   └── typescript-api-development.md # APIs (~900 tokens)
│
├── skills/ (86 fragments - 6 hierarchical families)
│   ├── Performance Family (5 skills, ~570 tokens saved)
│   │   ├── performance-optimization.md (core)
│   │   ├── performance-api-optimization.md
│   │   ├── performance-database-optimization.md
│   │   ├── performance-frontend-optimization.md
│   │   └── performance-profiling-techniques.md
│   │
│   ├── Security Family (7 skills, ~3,320 tokens saved)
│   │   ├── security-api-security.md
│   │   ├── security-authentication-jwt.md
│   │   ├── security-authentication-oauth.md
│   │   ├── security-input-validation.md
│   │   ├── security-owasp-top10.md
│   │   └── security-secrets-management.md
│   │
│   ├── Testing Family (5 skills, ~570 tokens saved)
│   │   ├── testing-strategies.md (core)
│   │   ├── testing-unit.md
│   │   ├── testing-integration.md
│   │   └── testing-e2e-best-practices.md
│   │
│   ├── Observability Family (4 skills, +365 tokens invested)
│   │   ├── observability-structured-logging.md (26 cross-refs)
│   │   ├── observability-metrics-prometheus.md
│   │   ├── observability-distributed-tracing.md
│   │   └── observability-sli-slo-monitoring.md
│   │
│   ├── Error Handling Family (4 skills, ~150 tokens saved)
│   │   ├── error-handling-api-patterns.md
│   │   ├── error-handling-logging.md
│   │   ├── error-handling-resilience.md
│   │   └── error-handling-validation.md
│   │
│   └── IaC Family (5 skills, +130 tokens invested)
│       ├── iac-terraform-modules.md (20 cross-refs)
│       ├── iac-pulumi-programming.md
│       ├── iac-gitops-workflows.md
│       ├── iac-state-management.md
│       └── iac-testing-validation.md
│
├── examples/ (28 fragments - extracted from skills/agents)
│   ├── docker-multistage-go.md          # ~45,000 tokens saved
│   ├── docker-multistage-nodejs.md      # across all examples
│   ├── express-error-handling.md
│   ├── express-jwt-auth.md
│   ├── fastapi-async-crud.md
│   ├── go-grpc-service.md
│   ├── kubernetes-deployment-basic.md
│   └── typescript-rest-api-complete.md
│
├── patterns/ (29 fragments - 9 families)
│   ├── Event-Driven Family (6 patterns)
│   │   ├── event-driven-pubsub.md
│   │   ├── event-driven-cqrs.md
│   │   ├── event-driven-eventsourcing.md
│   │   ├── event-driven-saga.md
│   │   ├── event-driven-best-practices.md
│   │   └── message-broker-comparison.md
│   │
│   ├── Database Family (3 patterns)
│   │   ├── database-connection-pooling-scaling.md
│   │   ├── database-indexing-strategies.md
│   │   └── database-query-optimization.md
│   │
│   └── Architecture Family (3 patterns)
│       ├── architecture-microservices.md
│       ├── architecture-layered.md
│       └── architecture-decision-records.md
│
├── workflows/ (36 fragments)
│   ├── workflow-new-project.md          # Progressive loading
│   ├── workflow-add-feature.md          # 78% avg savings
│   └── ...
│
└── guides/ (10 fragments)
    ├── aws-eks-cluster.md
    ├── ci-cd-github-actions.md
    └── ...
```

### Fragment Metadata Schema

```yaml
---
id: typescript-core                          # Unique identifier
category: agent                              # Resource type
tags: [typescript, types, generics]         # Keywords for matching
capabilities:                                # What this fragment provides
  - Complex type system design
  - Generic type constraints and inference
  - Conditional and mapped types
useWhen:                                     # When to use this fragment
  - Designing type-safe APIs or libraries
  - Need advanced TypeScript patterns
  - Complex type transformations required
estimatedTokens: 650                         # Size estimate
---

# Fragment Content

Markdown content here...
```

### Fragment Discovery

**Automatic Discovery:**
- Scanned at server startup
- No registration required
- Indexed for fuzzy matching

**Discovery Process:**
1. Scan `resources/{category}/` directories recursively
2. Parse frontmatter from each `.md` file
3. Extract metadata (tags, capabilities, useWhen)
4. Build in-memory index (ResourceFragment[])
5. Pass to FuzzyMatcher for scoring

### Fragment Composition

**Manual Reference (in main resources):**
```markdown
# TypeScript Developer Agent

Expert in TypeScript development...

## Core Capabilities

**→ Fragment:** Uses knowledge from `typescript-core.md`
**→ Fragment:** Async patterns from `typescript-async-patterns.md`
```

**Automatic Assembly (dynamic matching):**
- Query: "typescript async error handling"
- System assembles:
  1. `typescript-core.md` (type system)
  2. `typescript-async-patterns.md` (async patterns)
  3. `error-handling-async.md` (error handling)
- Total: ~2050 tokens of precisely relevant content

---

## Hot Reload Mechanism

### Development Mode

**Enabled when:** `process.env.NODE_ENV !== "production"`

**Source Location:** `src/index.ts:237-241`

```typescript
if (process.env.NODE_ENV !== "production") {
  promptLoader.watchForChanges(() => {
    logger.info("Prompts changed - restart server to reload");
  });
}
```

### File Watching

**Library:** `chokidar` v4.0.3

**Watch Pattern:** `${promptsPath}/**/*.md`

**Watched Events:**
- `add` - New file created
- `change` - File modified
- `unlink` - File deleted

**On Change:**
1. Log event
2. Clear prompt cache
3. Notify caller (log message)

**Why not auto-reload?**
- MCP server registration is static (at startup)
- Would require re-registering all prompts
- Simpler to restart server (development only)

---

## Error Handling Strategy

### Layered Error Handling

```
┌─────────────────────────────────────┐
│  Layer 1: Protocol-Level Errors     │ MCP SDK handles
│  (Malformed JSON-RPC, invalid IDs)  │ automatically
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Layer 2: Application-Level Errors  │ Try-catch in
│  (File not found, parse errors)     │ async handlers
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│  Layer 3: Graceful Degradation      │ Fallbacks and
│  (Cache misses, index load failures)│ default values
└─────────────────────────────────────┘
```

### Error Handling Patterns

#### Prompt Loading

```typescript
try {
  const content = await fs.readFile(filePath, "utf-8");
  const { content } = matter(fileContent);
  return content;
} catch (error) {
  this.logger.error(`Error loading prompt content for ${metadata.name}:`, error);
  throw error; // Propagate to caller
}
```

#### Resource Loading

```typescript
try {
  // Attempt static load
  const content = await this._loadStaticResource(uri, parsed);
  return content;
} catch (error) {
  this.logger.error(`Error loading resource content for ${uri}:`, error);
  throw error; // Propagate to MCP server
}
```

#### Index Loading

```typescript
try {
  const result = await this.indexLookup.lookup(query, options);
  return result;
} catch (error) {
  this.logger.warn("Index lookup failed, falling back to fuzzy match", error);
  // Graceful fallback
  return await this.fuzzyMatcher.match(request);
}
```

### Logging Strategy

**Logger Output:** stderr (doesn't interfere with MCP protocol on stdout)

**Log Levels:**
- `debug` - Verbose details (cache hits, scoring)
- `info` - Important events (server start, resource loads)
- `warn` - Non-fatal issues (missing directories, fallbacks)
- `error` - Fatal errors (file not found, parse failures)

**Configuration:**
```typescript
const logger = new Logger("component-name");
logger.setLevel(process.env.LOG_LEVEL || "info");
```

---

## Performance Optimizations

### 1. Parallel Directory Scanning

**Before:** Sequential scanning (~600ms)
```typescript
for (const category of categories) {
  await scanCategory(category); // Blocks
}
```

**After:** Parallel scanning (~100ms)
```typescript
const promises = categories.map(category => scanCategory(category));
const results = await Promise.all(promises);
```

**Improvement:** 6x faster

### 2. Lazy Index Loading

**Pattern:** Don't load index until first dynamic query

```typescript
if (parsed.type === "dynamic" && !this.resourceIndex) {
  await this.loadResourceIndex(); // Load once on first use
}
```

**Benefit:** Faster server startup (~50ms saved)

### 3. LRU Caching

**Hit Rate:** ~70-80% in typical usage

**Benefit:**
- Cache hit: <1ms
- Cache miss: ~5-15ms
- **5-15x speedup** for repeated queries

### 4. Single-Pass Keyword Matching

**Before:** Nested loops for each factor
```typescript
// O(n * m * k) - keywords × resources × fields
for (const keyword of keywords) {
  for (const resource of resources) {
    for (const tag of resource.tags) {
      if (tag.includes(keyword)) score += 10;
    }
  }
}
```

**After:** Batch processing
```typescript
// O(n * m) - keywords × resources
const tagsLower = resource.tags; // Pre-normalized
for (const keyword of keywords) {
  for (const tag of tagsLower) {
    if (tag.includes(keyword)) {
      score += 10;
      break; // Only count once
    }
  }
}
```

**Improvement:** Reduces redundant work

### 5. Index-Based Lookup

**Fuzzy Matching:**
- Scores all 200 resources: O(n * m * k)
- Time: ~15-20ms
- Token cost: 800-2000 tokens

**Index-Based Lookup:**
- Keyword intersection: O(k)
- Time: ~5-10ms
- Token cost: 50-120 tokens

**Improvement:**
- 2-3x faster
- 85-95% token reduction

### 6. Pre-Built Indexes

**At Build Time:**
```bash
npm run build-index
```

**Generates:**
- `resources/.index/usewhen-index.json` (~125KB)
- `resources/.index/keyword-index.json` (~80KB)

**Runtime:**
- Load indexes once at startup (~50ms)
- In-memory lookups (~5-10ms)

**Benefit:** No runtime index building overhead

---

**Last Updated:** 2025-11-12
**Document Version:** 2.0.0 (Post-Optimization)
**Resource Library:** 384 fragments, 1,675 scenarios, 207+ cross-refs
