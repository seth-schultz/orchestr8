# Architecture Diagrams - Orchestr8 MCP Server

> **Visual representations of system components, data flows, and request processing**

## Table of Contents

- [System Component Diagram](#system-component-diagram)
- [Data Flow Diagrams](#data-flow-diagrams)
- [Request Processing Flows](#request-processing-flows)
- [Resource Loading Pipeline](#resource-loading-pipeline)
- [Caching Architecture](#caching-architecture)
- [Index-Based Lookup Flow](#index-based-lookup-flow)
- [Sequence Diagrams](#sequence-diagrams)

---

## System Component Diagram

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLAUDE CODE                                    │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  Workflows (Slash Commands)                                            │ │
│  │  /new-project  /add-feature  /fix-bug  /refactor  /review-code        │ │
│  │  /security-audit  /optimize  /deploy  /setup-cicd                     │ │
│  │  • Auto-loaded at startup (~2KB each)                                 │ │
│  │  • Registered as MCP prompts                                          │ │
│  │  • Accessible via slash commands                                      │ │
│  └─────────────────────────┬─────────────────────────────────────────────┘ │
│                            │                                                │
│         ┌──────────────────┼──────────────────┐                            │
│         │ Static Reference │ Dynamic Matching │                            │
│         │                  │                  │                            │
└─────────┼──────────────────┼──────────────────┼────────────────────────────┘
          │                  │                  │
          │                  │                  │
┌─────────▼──────────────────▼──────────────────▼────────────────────────────┐
│                        MCP SERVER (stdio)                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Core Engine (src/index.ts)                                         │   │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │   │
│  │  │  Server Init     │  │  Prompt Registry │  │  Resource Reg.   │  │   │
│  │  │  • MCP instance  │  │  • Static URIs   │  │  • Dynamic tmpls │  │   │
│  │  │  • stdio setup   │  │  • Arg schemas   │  │  • Wildcards     │  │   │
│  │  │  • Signal hdlrs  │  │  • Handlers      │  │  • Callbacks     │  │   │
│  │  └──────────────────┘  └──────────────────┘  └──────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────┐   │
│  │  Prompt Loader               │  │  Resource Loader                 │   │
│  │  (src/loaders/promptLoader)  │  │  (src/loaders/resourceLoader)    │   │
│  │  ┌────────────────────────┐  │  │  ┌────────────────────────────┐ │   │
│  │  │  Directory Scanner     │  │  │  │  Index Manager             │ │   │
│  │  │  • prompts/workflows/  │  │  │  │  • Lazy loading            │ │   │
│  │  │  • prompts/agents/     │  │  │  │  • Singleton pattern       │ │   │
│  │  │  • prompts/skills/     │  │  │  │  • Parallel scanning       │ │   │
│  │  └────────────────────────┘  │  │  └────────────────────────────┘ │   │
│  │  ┌────────────────────────┐  │  │  ┌────────────────────────────┐ │   │
│  │  │  Frontmatter Parser    │  │  │  │  URI Router                │ │   │
│  │  │  • YAML parsing        │  │  │  │  • Static → file load      │ │   │
│  │  │  • Metadata extraction │  │  │  │  • Dynamic → matching      │ │   │
│  │  │  • Arg definitions     │  │  │  │  • Mode selection          │ │   │
│  │  └────────────────────────┘  │  │  └────────────────────────────┘ │   │
│  │  ┌────────────────────────┐  │  │  ┌────────────────────────────┐ │   │
│  │  │  Arg Substitution      │  │  │  │  Fragment Scanner          │ │   │
│  │  │  • ${arg-name}         │  │  │  │  •  subdirs     │ │   │
│  │  │  • $ARGUMENTS          │  │  │  │  • Metadata extraction     │ │   │
│  │  │  • Template filling    │  │  │  │  • Index building          │ │   │
│  │  └────────────────────────┘  │  │  └────────────────────────────┘ │   │
│  │  ┌────────────────────────┐  │  │  ┌────────────────────────────┐ │   │
│  │  │  LRU Cache (1hr TTL)   │  │  │  │  LRU Cache (4hr TTL)       │ │   │
│  │  │  • 100 entries         │  │  │  │  • 200 entries             │ │   │
│  │  │  • Key: name:args      │  │  │  │  • Key: full URI           │ │   │
│  │  └────────────────────────┘  │  │  └────────────────────────────┘ │   │
│  │  ┌────────────────────────┐  │  │                                  │   │
│  │  │  File Watcher (dev)    │  │  │                                  │   │
│  │  │  • chokidar            │  │  │                                  │   │
│  │  │  • Hot reload trigger  │  │  │                                  │   │
│  │  └────────────────────────┘  │  │                                  │   │
│  └──────────────────────────────┘  └──────────────────────────────────┘   │
│                                                                             │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐  │
│  │  URI Parser          │  │  Fuzzy Matcher       │  │  Index Lookup   │  │
│  │  (src/utils/)        │  │  (src/utils/)        │  │  (src/utils/)   │  │
│  │  ┌────────────────┐  │  │  ┌────────────────┐  │  │  ┌───────────┐  │  │
│  │  │ Static Parser  │  │  │  │ Keyword Extract│  │  │  │ Tier 1    │  │  │
│  │  │ • category/id  │  │  │  │ • Normalize    │  │  │  │ Quick     │  │  │
│  │  └────────────────┘  │  │  │ • Stop words   │  │  │  │ Cache     │  │  │
│  │  ┌────────────────┐  │  │  └────────────────┘  │  │  └───────────┘  │  │
│  │  │ Dynamic Parser │  │  │  ┌────────────────┐  │  │  ┌───────────┐  │  │
│  │  │ • match?query  │  │  │  │ Scoring Engine │  │  │  │ Tier 2    │  │  │
│  │  │ • Query params │  │  │  │ • Tags (+10)   │  │  │  │ Keyword   │  │  │
│  │  └────────────────┘  │  │  │ • Caps (+8)    │  │  │  │ Index     │  │  │
│  │                      │  │  │ • UseWhen (+5) │  │  │  └───────────┘  │  │
│  │                      │  │  │ • Category (+15)│  │  │  ┌───────────┐  │  │
│  │                      │  │  └────────────────┘  │  │  │ Tier 3    │  │  │
│  │                      │  │  ┌────────────────┐  │  │  │ Fuzzy     │  │  │
│  │                      │  │  │ Budget Manager │  │  │  │ Fallback  │  │  │
│  │                      │  │  │ • Top 3 always │  │  │  └───────────┘  │  │
│  │                      │  │  │ • 80% cutoff   │  │  │                 │  │
│  │                      │  │  └────────────────┘  │  │                 │  │
│  │                      │  │  ┌────────────────┐  │  │                 │  │
│  │                      │  │  │ Assembler      │  │  │                 │  │
│  │                      │  │  │ • Full mode    │  │  │                 │  │
│  │                      │  │  │ • Catalog mode │  │  │                 │  │
│  │                      │  │  └────────────────┘  │  │                 │  │
│  └──────────────────────┘  └──────────────────────┘  └─────────────────┘  │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Index Builder (src/utils/indexBuilder.ts)                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │   │
│  │  │ Fragment Scan│  │ UseWhen Index│  │ Keyword Index (Inverted) │  │   │
│  │  │ • All _frags │  │ • Hash → meta│  │ • keyword → hashes       │  │   │
│  │  │ • Parallel   │  │ • Scenarios  │  │ • O(1) lookups           │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────┬───────────────────────────────────────────────────┘
                          │
                          │ File System Access
                          │
┌─────────────────────────▼───────────────────────────────────────────────────┐
│                          RESOURCES (Filesystem)                             │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   agents/    │  │   skills/    │  │  examples/   │  │  patterns/   │   │
│  │  • Main docs │  │  • Main docs │  │  • Main docs │  │  • Main docs │   │
│  │  • │  │  • │  │  • │  │  • │   │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────────────┐ │
│  │   guides/    │  │best-practices│  │  .index/                        │ │
│  │  • Main docs │  │  • Main docs │  │  • usewhen-index.json (~125KB)  │ │
│  │  • │  │  • │  │  • keyword-index.json (~80KB)   │ │
│  └──────────────┘  └──────────────┘  └──────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Static Resource Request Flow

```
┌───────────┐
│  Claude   │
│   Code    │
└─────┬─────┘
      │
      │ Read Resource
      │ orchestr8://agents/typescript-developer
      │
      ▼
┌─────────────────────────────────────────┐
│  MCP Server (Resource Handler)          │
│                                         │
│  1. Receive URI                         │
│     └─ orchestr8://agents/...           │
│                                         │
│  2. Check cache                         │
│     ├─ Hit? Return cached (<1ms) ──────┼──┐
│     └─ Miss? Continue...                │  │
│                                         │  │
│  3. Call resourceLoader.loadContent()   │  │
│     └─ URI: orchestr8://agents/...      │  │
└─────┬───────────────────────────────────┘  │
      │                                      │
      ▼                                      │
┌─────────────────────────────────────────┐  │
│  URI Parser                             │  │
│                                         │  │
│  1. Validate protocol                   │  │
│     └─ Starts with "orchestr8://"?      │  │
│                                         │  │
│  2. Parse components                    │  │
│     ├─ category: "agents"               │  │
│     └─ resourceId: "typescript-developer"│ │
│                                         │  │
│  3. Return parsed                       │  │
│     └─ { type: "static", ... }          │  │
└─────┬───────────────────────────────────┘  │
      │                                      │
      ▼                                      │
┌─────────────────────────────────────────┐  │
│  Resource Loader (Static Path)          │  │
│                                         │  │
│  1. Convert URI to file path            │  │
│     └─ resources/agents/typescript-...  │  │
│                                         │  │
│  2. Read file (fs.readFile)             │  │
│     └─ ~2000 tokens                     │  │
│                                         │  │
│  3. Cache content (4hr TTL)             │  │
│     └─ Key: full URI                    │  │
│                                         │  │
│  4. Return content                      │  │
└─────┬───────────────────────────────────┘  │
      │                                      │
      ▼                                      │
┌─────────────────────────────────────────┐  │
│  MCP Server (Response)                  │  │
│                                         │  │
│  Return to Claude Code:                 │  │
│  {                                      │  │
│    contents: [{                         │  │
│      uri: "orchestr8://...",            │  │
│      mimeType: "text/markdown",         │  │
│      text: "[content]"                  │  │
│    }]                                   │  │
│  }                                      │  │
└─────┬───────────────────────────────────┘  │
      │                                      │
      ▼                                      │
┌───────────┐                                │
│  Claude   │ <──────────────────────────────┘
│   Code    │
└───────────┘
```

### Dynamic Resource Request Flow (Fuzzy Matching)

```
┌───────────┐
│  Claude   │
│   Code    │
└─────┬─────┘
      │
      │ Read Resource
      │ orchestr8://match?query=typescript+async&maxTokens=2500&mode=catalog
      │
      ▼
┌──────────────────────────────────────────────────────────────┐
│  MCP Server (Dynamic Resource Handler)                       │
│                                                              │
│  1. Receive URI with query params                           │
│  2. Check cache (full URI as key)                           │
│     ├─ Hit? Return cached (~800 tokens) ──────────────────┐ │
│     └─ Miss? Continue...                                   │ │
│                                                            │ │
│  3. Call resourceLoader.loadResourceContent(fullUri)       │ │
└─────┬────────────────────────────────────────────────────┐ │ │
      │                                                    │ │ │
      ▼                                                    │ │ │
┌─────────────────────────────────────────────────────┐   │ │ │
│  URI Parser                                         │   │ │ │
│                                                     │   │ │ │
│  1. Validate protocol                               │   │ │ │
│  2. Detect dynamic URI ("/match?" present)          │   │ │ │
│  3. Parse query parameters:                         │   │ │ │
│     ├─ query: "typescript async"                    │   │ │ │
│     ├─ maxTokens: 2500                              │   │ │ │
│     └─ mode: "catalog"                              │   │ │ │
│                                                     │   │ │ │
│  4. Return parsed                                   │   │ │ │
│     └─ { type: "dynamic", matchParams: {...} }      │   │ │ │
└─────┬───────────────────────────────────────────────┘   │ │ │
      │                                                    │ │ │
      ▼                                                    │ │ │
┌─────────────────────────────────────────────────────┐   │ │ │
│  Resource Loader (Dynamic Path)                     │   │ │ │
│                                                     │   │ │ │
│  1. Check mode                                      │   │ │ │
│     └─ mode === "catalog" → Fuzzy Matcher           │   │ │ │
│                                                     │   │ │ │
│  2. Load resource index (lazy, cached)              │   │ │ │
│     └─ 200 fragments with metadata                  │   │ │ │
│                                                     │   │ │ │
│  3. Call fuzzyMatcher.match(request)                │   │ │ │
└─────┬───────────────────────────────────────────────┘   │ │ │
      │                                                    │ │ │
      ▼                                                    │ │ │
┌─────────────────────────────────────────────────────┐   │ │ │
│  Fuzzy Matcher                                      │   │ │ │
│                                                     │   │ │ │
│  1. Extract keywords                                │   │ │ │
│     └─ ["typescript", "async"]                      │   │ │ │
│                                                     │   │ │ │
│  2. Score all resources                             │   │ │ │
│     ├─ typescript-core: 25                          │   │ │ │
│     ├─ typescript-async-patterns: 45 (top!)         │   │ │ │
│     ├─ error-handling-async: 30                     │   │ │ │
│     └─ ... (200 total)                              │   │ │ │
│                                                     │   │ │ │
│  3. Filter by minScore (default: 10)                │   │ │ │
│     └─ 35 resources pass threshold                  │   │ │ │
│                                                     │   │ │ │
│  4. Sort by score (descending)                      │   │ │ │
│                                                     │   │ │ │
│  5. Select top N (catalog mode: maxResults=15)      │   │ │ │
│     └─ Top 15 resources                             │   │ │ │
│                                                     │   │ │ │
│  6. Assemble catalog (~800 tokens)                  │   │ │ │
│     ├─ Header with instructions                     │   │ │ │
│     ├─ Resource entries (15)                        │   │ │ │
│     │  ├─ Relevance score                           │   │ │ │
│     │  ├─ Tags, capabilities                        │   │ │ │
│     │  ├─ UseWhen scenarios                         │   │ │ │
│     │  ├─ Token estimate                            │   │ │ │
│     │  └─ MCP URI for loading                       │   │ │ │
│     └─ Usage instructions                           │   │ │ │
│                                                     │   │ │ │
│  7. Return match result                             │   │ │ │
│     └─ { fragments, totalTokens, assembledContent } │   │ │ │
└─────┬───────────────────────────────────────────────┘   │ │ │
      │                                                    │ │ │
      ▼                                                    │ │ │
┌─────────────────────────────────────────────────────┐   │ │ │
│  Resource Loader                                    │   │ │ │
│                                                     │   │ │ │
│  1. Cache assembled content (4hr TTL)               │   │ │ │
│  2. Return content                                  │   │ │ │
└─────┬───────────────────────────────────────────────┘   │ │ │
      │                                                    │ │ │
      ▼                                                    │ │ │
┌─────────────────────────────────────────────────────┐   │ │ │
│  MCP Server (Response)                              │   │ │ │
│                                                     │   │ │ │
│  Return to Claude Code (~800 tokens)                │   │ │ │
└─────┬───────────────────────────────────────────────┘   │ │ │
      │                                                    │ │ │
      │ <────────────────────────────────────────────────┼─┘ │
      │                                                    │   │
      │ <────────────────────────────────────────────────┼───┘
      ▼
┌───────────┐
│  Claude   │
│   Code    │
└───────────┘
```

---

## Request Processing Flows

### Prompt Request Processing

```
User Types: /new-project "Build a REST API"
                │
                ▼
┌───────────────────────────────────────┐
│  Claude Code                          │
│  1. Recognize slash command           │
│  2. Parse arguments                   │
│     └─ description: "Build a REST API"│
│  3. Call MCP: getPrompt()             │
└───────┬───────────────────────────────┘
        │
        │ MCP Protocol (JSON-RPC over stdio)
        │
        ▼
┌───────────────────────────────────────┐
│  MCP Server (Prompt Handler)         │
│  1. Lookup prompt: "new-project"      │
│  2. Validate arguments (Zod)          │
│  3. Call promptLoader.loadContent()   │
└───────┬───────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│  Prompt Loader                        │
│  1. Check cache                       │
│     ├─ Key: "new-project:{...}"       │
│     ├─ Hit? Return cached             │
│     └─ Miss? Continue...              │
│                                       │
│  2. Read file                         │
│     └─ prompts/workflows/new-project.md│
│                                       │
│  3. Parse frontmatter (gray-matter)   │
│     └─ Extract metadata               │
│                                       │
│  4. Parse content                     │
│     └─ Body after frontmatter         │
│                                       │
│  5. Substitute arguments              │
│     ├─ Replace ${description}         │
│     │  with "Build a REST API"        │
│     └─ Result: processed content      │
│                                       │
│  6. Cache result (1hr TTL)            │
│  7. Return content (~2000 tokens)     │
└───────┬───────────────────────────────┘
        │
        ▼
┌───────────────────────────────────────┐
│  MCP Server (Response)                │
│  Return:                              │
│  {                                    │
│    messages: [{                       │
│      role: "user",                    │
│      content: {                       │
│        type: "text",                  │
│        text: "[workflow content]"     │
│      }                                │
│    }]                                 │
│  }                                    │
└───────┬───────────────────────────────┘
        │
        │ MCP Response
        │
        ▼
┌───────────────────────────────────────┐
│  Claude Code                          │
│  1. Receive workflow content          │
│  2. Add to conversation context       │
│  3. Execute workflow instructions     │
└───────────────────────────────────────┘
```

---

## Resource Loading Pipeline

### Decision Tree

```
loadResourceContent(uri)
        │
        ▼
    Check Cache
        │
    ┌───┴────┐
    │        │
   Hit      Miss
    │        │
    │        ▼
    │   Parse URI
    │        │
    │    ┌───┴─────┐
    │    │         │
    │  Static   Dynamic
    │    │         │
    │    │         ▼
    │    │    Check Mode
    │    │         │
    │    │    ┌────┼────┐
    │    │    │    │    │
    │    │  Index Full Catalog
    │    │    │    │    │
    │    │    │    │    └─────┐
    │    │    │    └──────┐   │
    │    │    │           │   │
    │    ▼    ▼           ▼   ▼
    │  ┌──────────────────────────┐
    │  │  Load File / Match       │
    │  └──────────┬───────────────┘
    │             │
    │             ▼
    │        Cache Result
    │             │
    └─────────────┤
                  │
                  ▼
            Return Content
```

### Static Loading Pipeline

```
Static URI: orchestr8://agents/typescript-developer
                    │
                    ▼
        ┌─────────────────────┐
        │ uriToFilePath()     │
        │ • Remove protocol   │
        │ • Append category   │
        │ • Try extensions    │
        │   - .md (primary)   │
        │   - .json           │
        │   - .yaml           │
        └──────────┬──────────┘
                   │
                   ▼
        Path: resources/agents/typescript-developer.md
                   │
                   ▼
        ┌─────────────────────┐
        │ fs.readFile()       │
        │ • Read file         │
        │ • UTF-8 encoding    │
        └──────────┬──────────┘
                   │
                   ▼
        Content (~2000 tokens)
                   │
                   ▼
        ┌─────────────────────┐
        │ Cache                │
        │ • Key: full URI     │
        │ • TTL: 4 hours      │
        └──────────┬──────────┘
                   │
                   ▼
             Return Content
```

### Dynamic Loading Pipeline (Fuzzy)

```
Dynamic URI: orchestr8://match?query=typescript+async&mode=catalog
                    │
                    ▼
        ┌─────────────────────────┐
        │ Parse Query Params       │
        │ • query: "typescript async"│
        │ • mode: "catalog"        │
        │ • maxResults: 15 (default)│
        └──────────┬───────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │ Load Resource Index      │
        │ • Lazy load (first use)  │
        │ • 200 fragments          │
        │ • Cached in memory       │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │ Extract Keywords         │
        │ • Normalize query        │
        │ • Remove stop words      │
        │ • Result: ["typescript", │
        │           "async"]       │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │ Score All Resources      │
        │ • Tag matches: +10       │
        │ • Capability matches: +8 │
        │ • UseWhen matches: +5    │
        │ • Category bonus: +15    │
        └──────────┬───────────────┘
                   │
                   ▼
        Scored Resources (200 total)
                   │
                   ▼
        ┌─────────────────────────┐
        │ Filter by minScore       │
        │ • Threshold: 10 (default)│
        │ • Result: 35 resources   │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │ Sort by Score (desc)     │
        │ • Highest first          │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │ Select Top N             │
        │ • Catalog: maxResults=15 │
        │ • Full: token budget     │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │ Assemble Content         │
        │ • Catalog: lightweight   │
        │   (~800 tokens)          │
        │ • Full: complete content │
        │   (~2-3KB)               │
        └──────────┬───────────────┘
                   │
                   ▼
        ┌─────────────────────────┐
        │ Cache Result             │
        │ • Key: full query URI    │
        │ • TTL: 4 hours           │
        └──────────┬───────────────┘
                   │
                   ▼
             Return Content
```

---

## Caching Architecture

### Multi-Level Cache Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  LEVEL 1: Quick Lookup Cache (IndexLookup)                  │
│  • Type: Map<string, CachedResult>                          │
│  • TTL: 15 minutes                                          │
│  • Scope: Common queries only                               │
│  • Hit rate: ~30%                                           │
│  • Latency: ~10ms                                           │
│  • Token cost: 50-120 tokens                                │
└────────────────────┬────────────────────────────────────────┘
                     │ Miss
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  LEVEL 2: Prompt Cache (PromptLoader)                       │
│  • Type: LRUCache<string, string>                           │
│  • Size: 100 entries                                        │
│  • TTL: 1 hour                                              │
│  • Key: "{name}:{JSON.stringify(args)}"                     │
│  • Hit rate: ~70-80%                                        │
│  • Latency: <1ms (hit), ~5ms (miss)                         │
└────────────────────┬────────────────────────────────────────┘
                     │ Miss
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  LEVEL 3: Resource Cache (ResourceLoader)                   │
│  • Type: LRUCache<string, string>                           │
│  • Size: 200 entries                                        │
│  • TTL: 4 hours                                             │
│  • Key: Full URI (static or dynamic query URI)              │
│  • Hit rate: ~70-80%                                        │
│  • Latency: <1ms (hit), ~8-15ms (miss)                      │
└────────────────────┬────────────────────────────────────────┘
                     │ Miss
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  LEVEL 4: In-Memory Indexes (FuzzyMatcher, IndexLookup)     │
│  • Type: ResourceFragment[] (fuzzy), UseWhenIndex (index)   │
│  • Lifetime: Server runtime                                 │
│  • Loaded: Once at startup or first dynamic query           │
│  • Size: ~200 fragments, ~125KB index                       │
│  • Latency: ~100ms (initial load), 0ms (cached)             │
└────────────────────┬────────────────────────────────────────┘
                     │ Miss
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  LEVEL 5: Filesystem                                        │
│  • Type: Physical files on disk                             │
│  • Latency: ~5-15ms per file                                │
│  • Accessed: Only on cache misses                           │
└─────────────────────────────────────────────────────────────┘
```

### Cache Flow Example

```
Request: orchestr8://agents/typescript-developer

1. Check Resource Cache (Level 3)
   ├─ Key: "orchestr8://agents/typescript-developer"
   ├─ Hit? Return cached content (<1ms) ─────────────────┐
   └─ Miss? Continue...                                  │
                                                         │
2. Parse URI (determine static)                          │
                                                         │
3. Convert to file path                                  │
   └─ resources/agents/typescript-developer.md           │
                                                         │
4. Read from filesystem (~5-15ms)                        │
   └─ Content: 2000 tokens                               │
                                                         │
5. Store in Resource Cache (Level 3)                     │
   ├─ Key: "orchestr8://agents/typescript-developer"     │
   ├─ Value: content                                     │
   └─ TTL: 4 hours                                       │
                                                         │
6. Return content ──────────────────────────────────────>│
                                                         │
Next Request (within 4 hours):                           │
   Cache hit at Level 3 (<1ms) ──────────────────────────┘
```

---

## Index-Based Lookup Flow

### Three-Tier Strategy

```
Query: "typescript async error"
        │
        ▼
┌─────────────────────────────────────┐
│  TIER 1: Quick Lookup Cache         │
│  1. Normalize query                 │
│     └─ "typescript-async-error"     │
│                                     │
│  2. Check cache                     │
│     └─ Map.get(normalized)          │
│                                     │
│  3. If hit (timestamp < 15min)      │
│     └─ Return cached (~10ms) ──────┼──┐
│                                     │  │
│  4. If miss, continue...            │  │
└─────┬───────────────────────────────┘  │
      │                                  │
      ▼                                  │
┌─────────────────────────────────────┐  │
│  TIER 2: Keyword Index Lookup       │  │
│  1. Extract keywords                │  │
│     └─ ["typescript", "async",      │  │
│         "error"]                    │  │
│                                     │  │
│  2. Intersect keyword matches       │  │
│     ├─ keywords["typescript"]       │  │
│     │  → [hash1, hash2, hash3]      │  │
│     ├─ keywords["async"]            │  │
│     │  → [hash2, hash4, hash5]      │  │
│     └─ keywords["error"]            │  │
│        → [hash2, hash6, hash7]      │  │
│     Intersection: [hash2]           │  │
│                                     │  │
│  3. Get full entries                │  │
│     └─ index.index[hash2]           │  │
│        → IndexEntry                 │  │
│                                     │  │
│  4. Filter by category (optional)   │  │
│                                     │  │
│  5. Score by keyword overlap        │  │
│     ├─ Exact match: +20             │  │
│     └─ Partial match: +10           │  │
│                                     │  │
│  6. Check if sufficient matches     │  │
│     ├─ >= 2 matches?                │  │
│     │  └─ Format compact result     │  │
│     │     (~50-120 tokens)          │  │
│     │     Return (~50ms) ──────────┼──┤
│     └─ < 2 matches? Continue...     │  │
└─────┬───────────────────────────────┘  │
      │                                  │
      ▼                                  │
┌─────────────────────────────────────┐  │
│  TIER 3: Fuzzy Fallback             │  │
│  1. Load full resource index        │  │
│     └─ 200 fragments                │  │
│                                     │  │
│  2. Run fuzzy matching              │  │
│     ├─ Keyword extraction           │  │
│     ├─ Score all resources          │  │
│     ├─ Select top N                 │  │
│     └─ Assemble catalog             │  │
│                                     │  │
│  3. Return full result (~200ms)     │  │
│     └─ ~800-2000 tokens ────────────┼──┤
└─────────────────────────────────────┘  │
                                         │
                                         │
        Return to caller  <───────────────┘
```

### Performance Characteristics

```
┌──────────┬─────────────┬──────────┬──────────────┬──────────┐
│  Tier    │ Method      │ Latency  │ Token Cost   │ Hit Rate │
├──────────┼─────────────┼──────────┼──────────────┼──────────┤
│  1       │ Quick Cache │ ~10ms    │ 50-120       │ 30%      │
│  2       │ Keyword Idx │ ~50ms    │ 50-120       │ 55%      │
│  3       │ Fuzzy Match │ ~200ms   │ 800-2000     │ 15%      │
└──────────┴─────────────┴──────────┴──────────────┴──────────┘

Combined:
• Average latency: ~60ms
• Average token cost: ~120-300 tokens
• Token reduction: 85-95% vs fuzzy catalog mode
```

---

## Sequence Diagrams

### Workflow Execution Sequence

```
User         Claude       MCP        Prompt      Resource
             Code         Server     Loader      Loader
 │            │            │           │            │
 │ /new-project "REST API" │           │            │
 ├───────────>│            │           │            │
 │            │ getPrompt("new-project", │           │
 │            │    {description: "REST API"})        │
 │            ├───────────>│           │            │
 │            │            │ loadContent(metadata, args)
 │            │            ├──────────>│            │
 │            │            │           │ Check cache│
 │            │            │           │ (miss)     │
 │            │            │           │ Read file  │
 │            │            │           │ Parse      │
 │            │            │           │ Substitute │
 │            │            │           │ Cache      │
 │            │            │<──────────┤            │
 │            │            │ Content   │            │
 │            │<───────────┤           │            │
 │            │ Messages   │           │            │
 │<───────────┤            │           │            │
 │ Execute    │            │           │            │
 │ workflow   │            │           │            │
 │            │            │           │            │
 │            │ (Workflow references dynamic resource)  │
 │            │ readResource("orchestr8://match?...")   │
 │            ├───────────>│           │            │
 │            │            │ loadResourceContent(uri)
 │            │            ├───────────────────────>│
 │            │            │           │            │ Parse URI
 │            │            │           │            │ (dynamic)
 │            │            │           │            │ Load index
 │            │            │           │            │ Fuzzy match
 │            │            │           │            │ Assemble
 │            │            │           │            │ Cache
 │            │            │<───────────────────────┤
 │            │            │ Content   │            │
 │            │<───────────┤           │            │
 │            │ Contents   │           │            │
 │<───────────┤            │           │            │
 │ Use        │            │           │            │
 │ resources  │            │           │            │
```

---

## Hierarchical Resource Organization

### Fragment Family Structure (Post-Optimization)

```
┌──────────────────────────────────────────────────────────────────────┐
│                   RESOURCE LIBRARY (384 fragments)                    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  SKILL FAMILIES (86 fragments, 6 families)                      │ │
│  │                                                                  │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │  Performance Family (5 skills, ~570 tokens saved)          │ │ │
│  │  │                                                            │ │ │
│  │  │  performance-optimization (core, 500 tokens)               │ │ │
│  │  │  ├──> performance-api-optimization (specialized, 450)      │ │ │
│  │  │  ├──> performance-database-optimization (specialized, 480) │ │ │
│  │  │  ├──> performance-frontend-optimization (specialized, 460) │ │ │
│  │  │  └──> performance-profiling-techniques (specialized, 420)  │ │ │
│  │  │                                                            │ │ │
│  │  │  Cross-refs: 15 orchestr8:// URIs                          │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │                                                                  │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │  Security Family (7 skills, ~3,320 tokens saved)           │ │ │
│  │  │                                                            │ │ │
│  │  │  security-api-security (core, 550 tokens)                  │ │ │
│  │  │  ├──> security-authentication-jwt (specialized, 480)       │ │ │
│  │  │  ├──> security-authentication-oauth (specialized, 520)     │ │ │
│  │  │  ├──> security-input-validation (specialized, 450)         │ │ │
│  │  │  ├──> security-owasp-top10 (specialized, 680)             │ │ │
│  │  │  └──> security-secrets-management (specialized, 440)       │ │ │
│  │  │                                                            │ │ │
│  │  │  Cross-refs: 28 orchestr8:// URIs                          │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │                                                                  │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │  Testing Family (5 skills, ~570 tokens saved)              │ │ │
│  │  │  Observability Family (4 skills, +365 tokens, 26 refs)     │ │ │
│  │  │  Error Handling Family (4 skills, ~150 tokens saved)       │ │ │
│  │  │  IaC Family (5 skills, +130 tokens, 20 refs)               │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  PATTERN FAMILIES (29 fragments, 9 families)                   │ │
│  │                                                                  │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │  Event-Driven Family (6 patterns)                          │ │ │
│  │  │                                                            │ │ │
│  │  │  event-driven-pubsub (core messaging)                      │ │ │
│  │  │  ├──> event-driven-cqrs (command-query separation)         │ │ │
│  │  │  ├──> event-driven-eventsourcing (event store)             │ │ │
│  │  │  ├──> event-driven-saga (distributed transactions)         │ │ │
│  │  │  ├──> event-driven-best-practices (design patterns)        │ │ │
│  │  │  └──> message-broker-comparison (Kafka/RabbitMQ/NATS)      │ │ │
│  │  │                                                            │ │ │
│  │  │  Cross-refs: 18 orchestr8:// URIs                          │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │                                                                  │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │  Database Family (3 patterns)                              │ │ │
│  │  │  database-connection-pooling-scaling                       │ │ │
│  │  │  database-indexing-strategies                              │ │ │
│  │  │  database-query-optimization                               │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  │                                                                  │ │
│  │  ┌────────────────────────────────────────────────────────────┐ │ │
│  │  │  Architecture Family (3 patterns) + 6 more families        │ │ │
│  │  └────────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  EXAMPLES (28 fragments, extracted from skills/agents)         │ │
│  │                                                                  │ │
│  │  docker-multistage-go.md, docker-multistage-nodejs.md          │ │
│  │  express-error-handling.md, express-jwt-auth.md                │ │
│  │  fastapi-async-crud.md, go-grpc-service.md                     │ │
│  │  kubernetes-deployment-basic.md, rust-actix-handlers.md        │ │
│  │  typescript-rest-api-complete.md, ...                          │ │
│  │                                                                  │ │
│  │  Token savings: ~45,000 tokens                                  │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  AGENTS (149 fragments) + WORKFLOWS (36) + GUIDES (10)         │ │
│  │                                                                  │ │
│  │  Progressive Loading Examples:                                  │ │
│  │  • project-manager.md (500 tokens core)                         │ │
│  │    └──> project-manager-advanced.md (700 tokens, on-demand)     │ │
│  │  • knowledge-base-agent.md (600 tokens core)                    │ │
│  │    └──> knowledge-base-agent-advanced.md (600 tokens, on-demand)│ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │  CROSS-REFERENCE NETWORK (207+ total)                          │ │
│  │                                                                  │ │
│  │  Sibling References (horizontal):                               │ │
│  │  performance-api ↔ performance-database ↔ performance-frontend  │ │
│  │                                                                  │ │
│  │  Parent-Child References (vertical):                            │ │
│  │  testing-strategies → testing-unit → testing-integration        │ │
│  │                                                                  │ │
│  │  Cross-Category References:                                     │ │
│  │  security-jwt (skill) → express-jwt-auth (example)              │ │
│  │  performance-caching (pattern) → performance-api (skill)        │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────┘
```

### Optimization Metrics

**Token Efficiency:**
```
Phase 1 (Example Extraction):
  37 files optimized → 77 examples → ~45,000 tokens saved

Phase 2 (Hierarchical Families):
  6 skill families → ~5,000 tokens net saved
  9 pattern families → organized, cross-referenced

Phase 3 (Progressive Loading):
  2 agents split → 50-58% savings in common cases
  5 workflows enhanced → 78% average savings

Total Impact:
  384 fragments indexed
  1,675 useWhen scenarios (+40% vs pre-optimization)
  4,036 unique keywords
  207+ cross-references
  ~50,000+ tokens saved overall
```

---

**Last Updated:** 2025-11-12
**Document Version:** 2.0.0 (Post-Optimization)
**Resource Library:** 384 fragments, 1,675 scenarios, 207+ cross-refs
