# Orchestr8 MCP Server Architecture

> **High-level architecture overview for the Orchestr8 Model Context Protocol server**

## Table of Contents

- [Overview](#overview)
- [Three-Tier Architecture](#three-tier-architecture)
- [Key Components](#key-components)
- [Token Optimization Strategy](#token-optimization-strategy)
- [Technology Stack](#technology-stack)
- [Architectural Patterns](#architectural-patterns)
- [Related Documentation](#related-documentation)

---

## Overview

Orchestr8 is an MCP (Model Context Protocol) server plugin for Claude Code that provides **just-in-time (JIT) loading** of development workflows, AI agents, and reusable patterns. The architecture minimizes token usage by loading only what's needed, when it's needed, with intelligent fuzzy matching for dynamic resource discovery.

**Core Design Principles:**

1. **Token Efficiency**: Load minimal context upfront (~18KB), access 200KB+ resources on-demand
2. **Dynamic Discovery**: Semantic fuzzy matching finds relevant resources without hard-coding references
3. **Composable Knowledge**: Fragment-based resources enable fine-grained reusability
4. **Performance**: Multi-tier caching (LRU + TTL) with parallel loading
5. **Standards-Based**: Full MCP protocol compliance with stdio transport

---

## Three-Tier Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          TIER 1: CLAUDE CODE                          │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  Workflows (Auto-loaded at startup, ~2KB each)                  │ │
│  │  • /new-project   • /add-feature    • /fix-bug                 │ │
│  │  • /refactor      • /review-code    • /security-audit          │ │
│  │  • /optimize      • /deploy         • /setup-cicd              │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                 │                                     │
│                Static Reference │ Dynamic Matching                    │
│                                 │                                     │
└─────────────────────────────────┼─────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼─────────────────────────────────────┐
│                    TIER 2: MCP SERVER (stdio)                         │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Core Engine (src/index.ts)                                    │   │
│  │  • Server initialization • Protocol handling                   │   │
│  │  • Prompt registration   • Resource registration               │   │
│  │  • Dynamic templates     • Graceful shutdown                   │   │
│  └───────────────────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Prompt Loader (src/loaders/promptLoader.ts)                   │   │
│  │  • Workflow scanning     • Frontmatter parsing                 │   │
│  │  • Argument substitution • LRU cache (1hr TTL)                 │   │
│  │  • Hot reload (dev mode) • Category organization               │   │
│  └───────────────────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Resource Loader (src/loaders/resourceLoader.ts)               │   │
│  │  • Static URI resolution • Dynamic URI matching                │   │
│  │  • Fragment scanning     • LRU cache (4hr TTL)                 │   │
│  │  • Index management      • Category filtering                  │   │
│  └───────────────────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  URI Parser (src/utils/uriParser.ts)                           │   │
│  │  • Static: orchestr8://agents/typescript-developer             │   │
│  │  • Dynamic: orchestr8://match?query=typescript+api             │   │
│  │  • Query param extraction • Category filtering                 │   │
│  └───────────────────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Fuzzy Matcher (src/utils/fuzzyMatcher.ts)                     │   │
│  │  • Keyword extraction    • Semantic scoring                    │   │
│  │  • Fragment selection    • Content assembly                    │   │
│  │  • Token budget mgmt     • Catalog/full modes                  │   │
│  └───────────────────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Index Lookup (src/utils/indexLookup.ts)                       │   │
│  │  • Pre-built indexes     • O(1) keyword lookups                │   │
│  │  • Quick lookup cache    • Fuzzy fallback                      │   │
│  │  • 85-95% token reduction • 3-tier strategy                    │   │
│  └───────────────────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Index Builder (src/utils/indexBuilder.ts)                     │   │
│  │  • UseWhen index         • Keyword index                       │   │
│  │  • Quick lookup cache    • Parallel scanning                   │   │
│  │  • Metadata extraction   • Hash generation                     │   │
│  └───────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────┼─────────────────────────────────────┐
│                   TIER 3: RESOURCES (On-Demand)                       │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Optimized Resource Library (384 fragments, ~200KB+ total)     │   │
│  │  • agents/    (149 fragments) - Domain experts & specialists   │   │
│  │  • skills/    (86 fragments)  - Hierarchical skill families    │   │
│  │  • examples/  (28 fragments)  - Extracted code examples        │   │
│  │  • patterns/  (29 fragments)  - Design pattern families        │   │
│  │  • workflows/ (36 fragments)  - Progressive loading workflows  │   │
│  │  • guides/    (10 fragments)  - Setup & deployment guides      │   │
│  └───────────────────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Hierarchical Organization (Fragment Families)                 │   │
│  │  • Performance (5 skills): ~570 tokens saved                   │   │
│  │  • Security (7 skills): ~3,320 tokens saved                    │   │
│  │  • Testing (5 skills): ~570 tokens saved                       │   │
│  │  • Observability (4 skills): +365 tokens, 26 cross-refs        │   │
│  │  • IaC (5 skills): +130 tokens, 20 cross-refs                  │   │
│  │  • Error Handling (4 skills): ~150 tokens saved                │   │
│  │  • Event-Driven (6 patterns): Saga, CQRS, PubSub, etc.         │   │
│  │  • Database (3 patterns): Pooling, Indexing, Query Opt.        │   │
│  │  • Architecture (3 patterns): Microservices, Layered, ADRs     │   │
│  └───────────────────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Cross-Reference Network (207+ total references)               │   │
│  │  • Sibling references: Related fragments in same family        │   │
│  │  • Parent-child: Core → specialized fragments                  │   │
│  │  • Cross-category: Skills ↔ Patterns ↔ Examples                │   │
│  │  • orchestr8:// URIs for JIT loading                           │   │
│  └───────────────────────────────────────────────────────────────┘   │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │  Indexes (.index/)                                             │   │
│  │  • usewhen-index.json  - 1,675 scenarios indexed               │   │
│  │  • keyword-index.json  - 4,036 unique keywords                 │   │
│  │  • quick-lookup.json   - Common query cache                    │   │
│  │  Pre-built at build time for O(1) lookups                      │   │
│  └───────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Key Components

### 1. MCP Server Core (src/index.ts)

**Responsibilities:**
- Initialize MCP server with protocol version 2024-11-05
- Register prompts (workflows) with metadata and argument schemas
- Register resources (static URIs and dynamic templates)
- Handle stdio transport for Claude Code communication
- Manage graceful shutdown (SIGINT/SIGTERM)

**Key Features:**
- Dynamic resource templates with wildcard support (`{+rest}`)
- Category-specific matching (e.g., `orchestr8://agents/match?query=...`)
- Global cross-category matching (e.g., `orchestr8://match?query=...`)
- Hot reload support in development mode

**Source:** `/Users/seth/Projects/orchestr8-mcp/plugins/orchestr8/src/index.ts`

### 2. Prompt Loader (src/loaders/promptLoader.ts)

**Responsibilities:**
- Scan `prompts/workflows/` directory for workflow definitions
- Parse YAML frontmatter for metadata (name, title, description, arguments)
- Load prompt content with argument substitution
- Cache processed prompts in LRU cache (1 hour TTL)
- Watch for file changes and trigger reload

**Caching Strategy:**
- Cache key: `{name}:{JSON.stringify(args)}`
- Size: 100 entries (configurable via `CACHE_SIZE`)
- TTL: 1 hour
- Update on get: Yes (extends TTL on access)

**Source:** `/Users/seth/Projects/orchestr8-mcp/plugins/orchestr8/src/loaders/promptLoader.ts`

### 3. Resource Loader (src/loaders/resourceLoader.ts)

**Responsibilities:**
- Scan resource directories recursively (agents, skills, examples, etc.)
- Parse resource frontmatter for metadata
- Resolve static URIs to file paths
- Handle dynamic URIs via fuzzy matching or index lookup
- Cache assembled content in LRU cache (4 hour TTL)
- Manage resource index loading (lazy + singleton pattern)

**Dual Loading Modes:**
1. **Static**: Direct file access via URI → filepath mapping
2. **Dynamic**: Fuzzy matching or index-based lookup

**Source:** `/Users/seth/Projects/orchestr8-mcp/plugins/orchestr8/src/loaders/resourceLoader.ts`

### 4. URI Parser (src/utils/uriParser.ts)

**Responsibilities:**
- Parse `orchestr8://` protocol URIs
- Distinguish static vs dynamic URIs
- Extract query parameters (query, maxTokens, tags, categories, mode, maxResults, minScore)
- Validate URI format and required parameters

**URI Types:**
- **Static**: `orchestr8://agents/typescript-developer`
- **Dynamic (category-specific)**: `orchestr8://agents/match?query=build+api`
- **Dynamic (global)**: `orchestr8://match?query=python+async`

**Source:** `/Users/seth/Projects/orchestr8-mcp/plugins/orchestr8/src/utils/uriParser.ts`

### 5. Fuzzy Matcher (src/utils/fuzzyMatcher.ts)

**Responsibilities:**
- Extract keywords from natural language queries
- Score resources based on semantic relevance
- Select top resources within token budget
- Assemble content with metadata and separators
- Support catalog mode (lightweight index) vs full mode (complete content)

**Scoring Algorithm:**
- Tag matches: +10 per keyword
- Capability matches: +8 per keyword
- UseWhen matches: +5 per keyword
- Category filter: +15 if matches
- Size preference: +5 if < 1000 tokens
- Required tags: Must have all or score = 0

**Performance:**
- Parallel directory scanning (~100ms initial load)
- In-memory index caching
- Query processing: ~5ms
- Fragment assembly: ~10ms

**Source:** `/Users/seth/Projects/orchestr8-mcp/plugins/orchestr8/src/utils/fuzzyMatcher.ts`

### 6. Index Lookup (src/utils/indexLookup.ts)

**Responsibilities:**
- Three-tier lookup strategy (quick cache → keyword index → fuzzy fallback)
- Load pre-built useWhen and keyword indexes
- O(1) keyword-based lookups via inverted index
- Score scenarios by keyword overlap
- Format compact results (50-120 tokens)

**Performance Tiers:**
1. **Quick lookup cache**: O(1), ~10ms (common queries)
2. **Keyword-based index**: O(k), ~50ms (keyword intersection)
3. **Fuzzy fallback**: O(n), ~200ms (edge cases)

**Token Reduction:** 85-95% vs fuzzy matching

**Source:** `/Users/seth/Projects/orchestr8-mcp/plugins/orchestr8/src/utils/indexLookup.ts`

### 7. Index Builder (src/utils/indexBuilder.ts)

**Responsibilities:**
- Scan all fragment files at build time
- Extract useWhen scenarios from frontmatter
- Build useWhen index (scenario hash → metadata)
- Build inverted keyword index (keyword → scenario hashes)
- Generate quick lookup cache (top keywords → URIs)
- Write indexes to `.index/` directory

**Generated Files:**
- `resources/.index/usewhen-index.json` - Main scenario index
- `resources/.index/keyword-index.json` - Inverted keyword index

**Source:** `/Users/seth/Projects/orchestr8-mcp/plugins/orchestr8/src/utils/indexBuilder.ts`

---

## Resource Optimization Strategy

### Overview

The Orchestr8 resource library has undergone comprehensive optimization across three phases, achieving significant token efficiency improvements while enhancing discoverability through hierarchical organization and cross-referencing.

**Optimization Results:**
- **Phase 1 (Example Extraction):** 77 examples extracted, ~45,000 tokens saved
- **Phase 2 (Hierarchical Families):** 6 skill families + 9 pattern families, ~4,145 net tokens saved
- **Phase 3 (Progressive Loading):** 2 agents split, 5 workflows enhanced, 78% average savings
- **Total Impact:** 384 fragments indexed with 1,675 scenarios and 207+ cross-references

### Phase 1: Example Extraction (Token Savings)

**Approach:** Extract verbose code examples from core skills/agents into dedicated example fragments

**Results:**
- 37 files optimized with examples extracted
- 77 new example files created in `resources/examples/`
- ~45,000 tokens saved across the library
- Examples referenced via `orchestr8://examples/...` URIs

**Example Families Created:**
- `docker-multistage-*` (Go, Node.js)
- `express-*` (error handling, JWT auth, validation)
- `fastapi-*` (async CRUD, Pydantic validation)
- `go-*` (gRPC services, Postgres with pgx)
- `kubernetes-*` (deployments, HPA autoscaling)
- `rust-*` (Actix handlers, SQLx queries)
- `typescript-rest-api-complete` (full REST API example)

### Phase 2: Hierarchical Organization (Structural Efficiency)

**Approach:** Group related fragments into families with core-to-specialized hierarchy

**Skill Families (6 total):**

1. **Performance Skills** (5 skills)
   - Core: `performance-optimization`
   - Specialized: API, database, frontend, profiling
   - Savings: ~570 tokens through shared core

2. **Security Skills** (7 skills)
   - Core fragments: API security, authentication patterns
   - Specialized: JWT, OAuth, input validation, OWASP Top 10, secrets mgmt
   - Savings: ~3,320 tokens (largest family)

3. **Testing Skills** (5 skills)
   - `testing-strategies` → unit, integration, e2e patterns
   - Savings: ~570 tokens

4. **Observability Skills** (4 skills, investment for connectivity)
   - Core: structured logging, metrics
   - Advanced: distributed tracing, SLI/SLO monitoring
   - Investment: +365 tokens for 26 cross-references
   - ROI: Better discoverability, JIT loading efficiency

5. **Infrastructure as Code (IaC)** (5 skills)
   - Terraform modules, Pulumi programming, GitOps workflows
   - Investment: +130 tokens for 20 cross-references
   - ROI: Comprehensive IaC coverage with granular loading

6. **Error Handling** (4 skills)
   - Core patterns → API, logging, resilience, validation
   - Savings: ~150 tokens

**Pattern Families (9 total):**

1. **Event-Driven Patterns** (6 patterns)
   - Core: PubSub, CQRS, Event Sourcing
   - Advanced: Saga pattern, best practices
   - Comparison: Message broker evaluation

2. **Database Patterns** (3 patterns)
   - Connection pooling & scaling
   - Indexing strategies
   - Query optimization

3. **Architecture Patterns** (3 patterns)
   - Microservices architecture
   - Layered architecture
   - Architecture Decision Records (ADRs)

**Cross-Reference Network:**
- 207+ orchestr8:// URI references
- Sibling references within families
- Parent-child references (core → specialized)
- Cross-category links (skills ↔ patterns ↔ examples)

### Phase 3: Progressive Loading (Advanced JIT)

**Approach:** Split large agents/workflows into core + on-demand advanced modules

**Agents Split (2 total):**

1. **Project Manager Agent**
   - Before: 1,200 tokens (monolithic)
   - After: 500 tokens (core) + 700 tokens (advanced, on-demand)
   - Savings: 58% in common use cases

2. **Knowledge Base Agent**
   - Before: 1,200 tokens (monolithic)
   - After: 600 tokens (core) + 600 tokens (advanced, on-demand)
   - Savings: 50% in common use cases

**Workflows Enhanced (5 total):**
- Progressive loading of expertise based on project phase
- JIT resource loading documentation
- Average savings: 78% through phased loading

**Progressive Loading Documentation:**
- 7 resources document JIT strategies
- Phase-based expertise loading
- Budget-aware fragment selection
- Dynamic URI assembly patterns

### Token Optimization Strategy

### Problem: Context Window Constraints

Claude Code operates with limited context windows. Loading all available resources upfront would consume 200KB+ of tokens, leaving little room for actual code.

### Solution: Just-In-Time Loading with Three-Tier Strategy

#### Tier 1: Workflows (Always Loaded)
- **Size**: 9 workflows × 2KB = 18KB
- **Why**: Workflows are lightweight entry points that orchestrate resource loading
- **Impact**: 18KB is acceptable overhead for immediate access to all workflows

#### Tier 2: Dynamic Matching (Loaded on Demand)
- **Size**: 2-5 fragments × 500-1000 tokens = 2-3KB per query
- **Why**: Fuzzy matching or index lookup finds relevant resources based on query
- **Impact**: 91-97% reduction vs loading everything

#### Tier 3: Static References (Explicit Loading)
- **Size**: Variable, user-controlled
- **Why**: Workflows can explicitly reference specific resources when needed
- **Impact**: Maximum control over token usage

### Token Budget Comparison

| Approach | Upfront | On-Demand | Total (avg) | Reduction |
|----------|---------|-----------|-------------|-----------|
| **Load All** | 220KB | 0KB | 220KB | 0% |
| **Orchestr8 (Static)** | 18KB | 2-8KB | 20-26KB | 88-91% |
| **Orchestr8 (Dynamic - Fuzzy)** | 18KB | 2-3KB | 20-21KB | 91-95% |
| **Orchestr8 (Dynamic - Index)** | 18KB | 50-120 tokens | ~18KB | 95-97% |

### Caching Strategy

**Two-Level Caching:**

1. **Prompt Cache (Short TTL)**
   - TTL: 1 hour (prompts change during development)
   - Size: 100 entries
   - Key: `{name}:{args}`

2. **Resource Cache (Long TTL)**
   - TTL: 4 hours (resources are more stable)
   - Size: 200 entries
   - Key: URI (static) or full query URI (dynamic)

**Cache Efficiency:**
- Cold load: ~5-15ms
- Cached load: <1ms
- Hit rate: ~70-80% in typical usage

---

## Technology Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | >= 18.0.0 | Runtime environment |
| **TypeScript** | 5.9.3 | Type-safe development |
| **MCP SDK** | 1.21.1 | Model Context Protocol implementation |
| **Zod** | 3.25.76 | Schema validation for prompt arguments |

### Key Dependencies

| Package | Purpose |
|---------|---------|
| `gray-matter` | YAML frontmatter parsing |
| `lru-cache` | Least Recently Used caching with TTL |
| `chokidar` | File watching for hot reload |
| `dotenv` | Environment variable management |

### Build & Development

| Tool | Purpose |
|------|---------|
| `tsx` | TypeScript execution and watch mode |
| `tsc` | TypeScript compilation |
| `node --test` | Native Node.js test runner |

---

## Architectural Patterns

### 1. Plugin Architecture

Orchestr8 integrates with Claude Code as a plugin:
- Registered via `.mcp.json` configuration
- Communicates via stdio transport (stdin/stdout)
- Isolated process with environment variables

### 2. Protocol-Based Communication

Full MCP protocol compliance:
- JSON-RPC 2.0 over stdio
- Prompt registration with typed arguments
- Resource registration (static and template-based)
- Graceful error handling

### 3. Lazy Loading with Singleton Pattern

Resource indexes loaded on first use:
- Singleton promise prevents duplicate loads
- Cached in memory for lifetime of server
- Parallel directory scanning for performance

### 4. Fragment-Based Composition

Resources decomposed into fragments:
- Small, focused knowledge units (500-1000 tokens)
- Frontmatter metadata for matching
- Composable via fuzzy matching
- Independently maintainable

### 5. Discriminated Unions for Type Safety

URI parsing uses discriminated unions:
```typescript
type ParsedURI =
  | { type: "static"; category: string; resourceId: string }
  | { type: "dynamic"; category?: string; matchParams: MatchParams }
```

### 6. Multi-Tier Caching

Three levels of caching:
1. **Quick lookup cache** (IndexLookup) - Common queries
2. **LRU caches** (PromptLoader, ResourceLoader) - Recent access
3. **In-memory indexes** (FuzzyMatcher) - Runtime metadata

### 7. Semantic Scoring with Weighted Factors

Fuzzy matching uses multi-factor scoring:
- Keyword matches (tags, capabilities, useWhen)
- Category filtering
- Size preferences
- Required tag enforcement

---

## Related Documentation

- [System Design](./system-design.md) - Detailed component breakdown and data flows
- [Architecture Diagrams](./architecture-diagram.md) - Visual representations and flows
- [Design Decisions](./design-decisions.md) - ADRs and rationale for key choices
- [README](../../README.md) - Project overview and quick start
- [USAGE](../../USAGE.md) - Usage examples and workflows

---

## Resource Library Statistics

**Current Status (Post-Optimization):**

| Category | Fragments | Token Savings | Key Features |
|----------|-----------|---------------|--------------|
| **Agents** | 149 | N/A (domain expertise) | Specialized domain experts |
| **Skills** | 86 | ~5,000 saved | 6 hierarchical families |
| **Examples** | 28 | ~45,000 saved | Extracted code examples |
| **Patterns** | 29 | Included in skills | 9 pattern families |
| **Workflows** | 36 | 78% avg (progressive) | Phased loading |
| **Guides** | 10 | N/A (infrastructure) | Setup & deployment |
| **Total** | **384** | **~50,000+** | **1,675 scenarios** |

**Index Metrics:**
- UseWhen scenarios: 1,675 (up from ~1,200, +40%)
- Unique keywords: 4,036 (comprehensive coverage)
- Cross-references: 207+ orchestr8:// URIs
- Avg scenarios per fragment: 4.4
- Avg keywords per scenario: 11.4

**Performance:**
- Token efficiency: 91-97% reduction via JIT loading
- Query latency: ~60ms average (3-tier strategy)
- Cache hit rate: 70-80%
- Index lookup: 85-95% token reduction vs fuzzy matching

---

**Last Updated:** 2025-11-12
**Architecture Version:** 2.0.0 (Post-Optimization)
**MCP Protocol:** 2024-11-05
**Resource Library:** 384 fragments, 1,675 scenarios, 207+ cross-refs
