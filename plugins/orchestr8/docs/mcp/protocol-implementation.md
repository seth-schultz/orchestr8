# MCP Protocol Implementation

This document provides a detailed technical overview of how the Orchestr8 server implements the Model Context Protocol (MCP). It covers the complete server lifecycle, request handling, and integration with Claude Code.

## Table of Contents

- [Server Architecture](#server-architecture)
- [Initialization Sequence](#initialization-sequence)
- [Prompt Registration](#prompt-registration)
- [Resource Registration](#resource-registration)
- [Request/Response Handling](#requestresponse-handling)
- [Error Handling](#error-handling)
- [Graceful Shutdown](#graceful-shutdown)
- [Code References](#code-references)

## Server Architecture

The Orchestr8 MCP server is implemented in TypeScript using the `@modelcontextprotocol/sdk` package. The architecture follows a modular design:

```
src/
├── index.ts                 # Main server entry point
├── loaders/
│   ├── promptLoader.ts     # Prompt loading and caching
│   └── resourceLoader.ts   # Resource loading and fuzzy matching
├── utils/
│   ├── logger.ts           # Logging utility (stderr)
│   ├── uriParser.ts        # URI parsing for static/dynamic resources
│   ├── fuzzyMatcher.ts     # Fuzzy matching engine
│   └── indexLookup.ts      # Index-based resource lookup
└── types.ts                # TypeScript type definitions
```

### Key Dependencies

```typescript
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod"; // Schema validation for prompt arguments
```

**File**: `src/index.ts:3-7`

## Initialization Sequence

The server initialization follows this sequence:

### 1. Environment Setup

```typescript
// Load environment variables
dotenv.config();

// Initialize logger (writes to stderr to avoid corrupting MCP protocol)
const logger = new Logger("orchestr8-mcp");

logger.info("Starting orchestr8 MCP server v1.0.0");
```

**File**: `src/index.ts:14-21`

**Important**: The logger writes to `stderr`, not `stdout`. This is critical because:
- MCP protocol uses `stdout` for JSON-RPC messages
- Logging to `stdout` would corrupt the protocol stream
- `stderr` is safe for debugging and monitoring

### 2. Create MCP Server Instance

```typescript
const server = new McpServer({
  name: "orchestr8",
  version: "1.0.0",
});
```

**File**: `src/index.ts:24-28`

The `McpServer` instance handles:
- Protocol negotiation
- Request routing
- Response formatting
- Capability advertisement

### 3. Initialize Loaders

```typescript
const promptLoader = new PromptLoader(logger);
const resourceLoader = new ResourceLoader(logger);

// Load all prompts and resources
const prompts = await promptLoader.loadAllPrompts();
const resources = await resourceLoader.loadAllResources();

logger.info(`Loaded ${prompts.length} prompts`);
logger.info(`Loaded ${resources.length} resources`);
```

**File**: `src/index.ts:30-39`

**Loaders Responsibilities**:
- `PromptLoader`: Scans `./prompts/**/*.md` and extracts metadata
- `ResourceLoader`: Scans `./resources/**/*.md` and builds resource index (383 fragments)
- `IndexBuilder`: Pre-builds keyword and useWhen indexes (1,675 scenarios, 4,036 keywords)

### 4. Pre-load Resource Index

```typescript
try {
  await resourceLoader.loadResourceIndex();
  logger.info("Resource index pre-loaded for dynamic matching");
} catch (error) {
  logger.warn("Failed to pre-load resource index, will load on-demand:", error);
}
```

**File**: `src/index.ts:42-48`

The resource index enables intelligent matching. It contains:
- All 383 resource fragments with metadata (tags, capabilities, useWhen scenarios)
- Pre-built keyword index (4,036 unique keywords → scenario hashes)
- UseWhen index (1,675 scenarios with extracted keywords)
- Quick lookup cache (top 20 common queries)
- Token estimates for budget management
- Category mappings for filtering
- Cross-references between related resources (207+ bidirectional links)

**Note**: Index loading is optional at startup. If it fails, the index loads on first dynamic query.

### 5. Register Prompts

Iterate through all loaded prompts and register each with the MCP server:

```typescript
for (const prompt of prompts) {
  // Convert prompt arguments to Zod schema
  const argsSchema: any = {};
  if (prompt.arguments && prompt.arguments.length > 0) {
    for (const arg of prompt.arguments) {
      const zodType = arg.required ? z.string() : z.string().optional();
      argsSchema[arg.name] = zodType;
    }
  }

  server.registerPrompt(
    prompt.name,
    {
      title: prompt.title,
      description: prompt.description,
      argsSchema: Object.keys(argsSchema).length > 0 ? argsSchema : undefined,
    },
    async (args: any, _extra: any) => {
      logger.debug(`Loading prompt: ${prompt.name}`);

      const argValues: Record<string, any> = args || {};

      // Load prompt content with argument substitution
      const content = await promptLoader.loadPromptContent(prompt, argValues);

      return {
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: content,
            },
          },
        ],
      };
    }
  );
}
```

**File**: `src/index.ts:51-94`

See [Prompt Registration](#prompt-registration) section for details.

### 6. Register Static Resources

Register each static resource discovered during loading:

```typescript
for (const resource of resources) {
  server.registerResource(
    resource.name,
    resource.uri,
    {
      mimeType: resource.mimeType,
      description: resource.description,
    },
    async (uri) => {
      logger.debug(`Loading resource: ${resource.uri}`);

      // Load resource content
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
}
```

**File**: `src/index.ts:96-124`

See [Resource Registration](#resource-registration) section for details.

### 7. Register Dynamic Resource Templates

Register templates for fuzzy matching queries:

```typescript
const dynamicCategories = [
  { category: "agents", description: "Dynamic agent matching..." },
  { category: "skills", description: "Dynamic skill matching..." },
  { category: "examples", description: "Dynamic example matching..." },
  { category: "patterns", description: "Dynamic pattern matching..." },
  { category: "guides", description: "Dynamic guide matching..." },
  { category: "best-practices", description: "Dynamic best practice matching..." },
];

for (const { category, description } of dynamicCategories) {
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
}
```

**File**: `src/index.ts:126-198`

**Template Wildcards**:
- `{+rest}` captures everything after the prefix
- Enables URIs like `orchestr8://agents/match?query=api&maxTokens=2000`

### 8. Register Global Template

A global template matches across all categories:

```typescript
const globalTemplateUri = "orchestr8://match{+rest}";
server.registerResource(
  "global-dynamic",
  new ResourceTemplate(globalTemplateUri, { list: undefined }),
  {
    mimeType: "text/markdown",
    description: "Dynamic resource matching across all categories",
  },
  async (uri, params: Record<string, any>) => {
    const fullUri = uri.toString();
    const content = await resourceLoader.loadResourceContent(fullUri);

    return {
      contents: [{ uri: fullUri, mimeType: "text/markdown", text: content }],
    };
  }
);
```

**File**: `src/index.ts:200-234`

### 9. Setup Hot Reload (Development Mode)

```typescript
if (process.env.NODE_ENV !== "production") {
  promptLoader.watchForChanges(() => {
    logger.info("Prompts changed - restart server to reload");
  });
}
```

**File**: `src/index.ts:236-241`

Uses `chokidar` to watch `./prompts/**/*.md` files for changes. In development, changes are detected but require server restart.

### 10. Connect Transport

```typescript
// Set up stdio transport (communicates via stdin/stdout)
const transport = new StdioServerTransport();

// Connect server to transport
await server.connect(transport);

logger.info("orchestr8 MCP server started successfully");
```

**File**: `src/index.ts:243-249`

The `StdioServerTransport` handles:
- Reading JSON-RPC messages from `stdin`
- Writing JSON-RPC responses to `stdout`
- Message framing (newline-delimited JSON)

### 11. Setup Signal Handlers

```typescript
// Handle graceful shutdown
process.on("SIGINT", async () => {
  logger.info("Shutting down orchestr8 MCP server");
  await server.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Shutting down orchestr8 MCP server");
  await server.close();
  process.exit(0);
});
```

**File**: `src/index.ts:251-262`

See [Graceful Shutdown](#graceful-shutdown) section for details.

## Prompt Registration

Prompts are converted into MCP prompts and become slash commands in Claude Code.

### Prompt Lifecycle

```
1. Scan ./prompts/**/*.md
2. Parse frontmatter (name, title, description, arguments)
3. Build Zod schema from arguments
4. Register with MCP server
5. Client lists prompts → Claude Code shows slash commands
6. User invokes /command → Server loads content + substitutes args
```

### Prompt File Structure

```markdown
---
name: now
title: Orchestr8 Now - Autonomous Workflow
description: Dynamic expertise assembly with JIT loading
version: 1.0.0
arguments:
  - name: task
    required: true
    description: The task to accomplish
tags:
  - autonomous
  - workflow
---

Your task: {{task}}

Load relevant expertise dynamically using:
orchestr8://match?query={{task}}&maxTokens=3000
```

### Frontmatter Parsing

```typescript
const content = await fs.readFile(filePath, "utf-8");
const { data } = matter(content);

return {
  name: data.name || fileName,
  title: data.title || name,
  description: data.description || `${category} prompt: ${name}`,
  version: data.version || "1.0.0",
  arguments: data.arguments,
  tags: data.tags,
  estimatedTokens: data.estimatedTokens,
  category,
};
```

**File**: `src/loaders/promptLoader.ts:102-119`

### Argument Substitution

When a prompt is invoked, arguments are substituted:

```typescript
// Replace individual argument placeholders like ${argument-name}
for (const [key, value] of Object.entries(args)) {
  if (value === undefined || value === null) continue;

  const placeholder = `\$\{${key}\}`;
  processedContent = processedContent.replace(
    new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    String(value)
  );
}
```

**File**: `src/loaders/promptLoader.ts:171-180`

**Pattern**: `{{argument_name}}` in markdown → replaced with argument value

### Zod Schema Generation

Arguments are converted to Zod schemas for validation:

```typescript
const argsSchema: any = {};
if (prompt.arguments && prompt.arguments.length > 0) {
  for (const arg of prompt.arguments) {
    const zodType = arg.required ? z.string() : z.string().optional();
    argsSchema[arg.name] = zodType;
  }
}
```

**File**: `src/index.ts:52-59`

This ensures:
- Required arguments are validated
- Optional arguments can be omitted
- Type safety for prompt invocation

### Prompt Handler

The prompt handler loads content and returns it as a message:

```typescript
async (args: any, _extra: any) => {
  logger.debug(`Loading prompt: ${prompt.name}`);

  const argValues: Record<string, any> = args || {};

  // Load prompt content with argument substitution
  const content = await promptLoader.loadPromptContent(prompt, argValues);

  return {
    messages: [
      {
        role: "user" as const,
        content: {
          type: "text" as const,
          text: content,
        },
      },
    ],
  };
}
```

**File**: `src/index.ts:69-91`

The returned message format follows MCP specification:
- Array of messages (supports multi-turn)
- Each message has `role` and `content`
- Content is typed (text, image, etc.)

## Resource Registration

Resources are the core of Orchestr8's expertise delivery. There are two types:

### 1. Static Resources

Static resources map directly to files:

```
URI:  orchestr8://agents/typescript-core
File: ./resources/agents/typescript-core.md
```

**Registration**:

```typescript
server.registerResource(
  resource.name,           // "typescript-core"
  resource.uri,            // "orchestr8://agents/typescript-core"
  {
    mimeType: resource.mimeType,    // "text/markdown"
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

**File**: `src/index.ts:97-123`

### 2. Dynamic Resources (Templates)

Dynamic resources use templates with wildcards:

```
Template: orchestr8://agents/match{+rest}
Matches:  orchestr8://agents/match?query=typescript+api&maxTokens=2000
```

**Registration**:

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

**File**: `src/index.ts:161-196`

### Resource Loading Flow

```
1. Client requests URI (e.g., orchestr8://agents/match?query=api)
2. Server receives resources/read request
3. URI parser determines: static or dynamic?
4. If static  → Read file from disk
5. If dynamic → Parse query params → Fuzzy match → Assemble content
6. Cache result
7. Return content
```

### URI Parsing

```typescript
const parsed = this.uriParser.parse(uri);

if (parsed.type === "static") {
  // Static URI: Load file directly
  return await this._loadStaticResource(uri, parsed);
} else {
  // Dynamic URI: Use fuzzy matcher to assemble content
  return await this._loadDynamicResource(uri, parsed);
}
```

**File**: `src/loaders/resourceLoader.ts:466-477`

### Fuzzy Matching Process

For dynamic URIs:

```typescript
// 1. Ensure resource index is loaded
await this.loadResourceIndex();

// 2. Perform fuzzy matching
const matchResult = await this.fuzzyMatcher.match({
  query: parsed.matchParams.query,           // "typescript api"
  maxTokens: parsed.matchParams.maxTokens,   // 2000
  requiredTags: parsed.matchParams.tags,     // ["api"]
  category: parsed.category,                 // "agents"
  mode: parsed.matchParams.mode || "catalog",
});

// 3. Cache assembled content
this.cache.set(uri, matchResult.assembledContent);

// 4. Log results
logger.info(
  `Assembled ${matchResult.fragments.length} fragments (${matchResult.totalTokens} tokens)`
);

return matchResult.assembledContent;
```

**File**: `src/loaders/resourceLoader.ts:543-569`

### Caching Strategy

Both static and dynamic resources are cached:

```typescript
private cache: LRUCache<string, string>;

constructor(logger: Logger) {
  const cacheSize = parseInt(process.env.CACHE_SIZE || "200", 10);
  this.cache = new LRUCache<string, string>({
    max: cacheSize,
    ttl: 1000 * 60 * 60 * 4, // 4 hour TTL
    updateAgeOnGet: true,
  });
}
```

**File**: `src/loaders/resourceLoader.ts:34-38`

**Cache Key**: Full URI including query parameters
- `orchestr8://agents/typescript-core` → Cached
- `orchestr8://agents/match?query=api&maxTokens=2000` → Cached
- `orchestr8://agents/match?query=database&maxTokens=2000` → Separate cache entry

## Request/Response Handling

MCP uses JSON-RPC 2.0 over stdio. The SDK handles protocol details, but understanding the flow is useful.

### Request Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/read",
  "params": {
    "uri": "orchestr8://agents/typescript-core"
  }
}
```

### Response Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "contents": [
      {
        "uri": "orchestr8://agents/typescript-core",
        "mimeType": "text/markdown",
        "text": "# TypeScript Core Expert\n\n..."
      }
    ]
  }
}
```

### Common Methods

The server handles these MCP methods:

#### `initialize`

Establishes connection and negotiates capabilities.

**Request**:
```json
{
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "prompts": {}, "resources": {} },
    "clientInfo": { "name": "claude-code", "version": "1.0.0" }
  }
}
```

**Response**:
```json
{
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "prompts": { "listChanged": false },
      "resources": { "subscribe": false, "listChanged": false }
    },
    "serverInfo": { "name": "orchestr8", "version": "1.0.0" }
  }
}
```

#### `prompts/list`

Lists all available prompts.

**Response**:
```json
{
  "result": {
    "prompts": [
      {
        "name": "now",
        "title": "Orchestr8 Now - Autonomous Workflow",
        "description": "Dynamic expertise assembly with JIT loading",
        "arguments": [
          { "name": "task", "required": true, "description": "The task to accomplish" }
        ]
      }
    ]
  }
}
```

#### `prompts/get`

Retrieves prompt content with argument substitution.

**Request**:
```json
{
  "method": "prompts/get",
  "params": {
    "name": "now",
    "arguments": { "task": "Build a REST API" }
  }
}
```

**Response**:
```json
{
  "result": {
    "messages": [
      {
        "role": "user",
        "content": {
          "type": "text",
          "text": "Your task: Build a REST API\n\nLoad relevant expertise..."
        }
      }
    ]
  }
}
```

#### `resources/list`

Lists all static resources and templates.

**Response**:
```json
{
  "result": {
    "resources": [
      {
        "uri": "orchestr8://agents/typescript-core",
        "name": "typescript-core",
        "description": "Resource: orchestr8://agents/typescript-core",
        "mimeType": "text/markdown"
      },
      {
        "uri": "orchestr8://agents/match{+rest}",
        "name": "agents-dynamic",
        "description": "Dynamic agent matching...",
        "mimeType": "text/markdown"
      }
    ]
  }
}
```

#### `resources/read`

Reads resource content (static or dynamic).

**Request**:
```json
{
  "method": "resources/read",
  "params": {
    "uri": "orchestr8://agents/match?query=typescript+api&maxTokens=2000"
  }
}
```

**Response**:
```json
{
  "result": {
    "contents": [
      {
        "uri": "orchestr8://agents/match?query=typescript+api&maxTokens=2000",
        "mimeType": "text/markdown",
        "text": "# Assembled Expertise\n\n..."
      }
    ]
  }
}
```

## Error Handling

### Error Response Format

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32602,
    "message": "Resource not found: orchestr8://agents/non-existent"
  }
}
```

### Common Error Scenarios

#### 1. Resource Not Found

```typescript
// File doesn't exist
const filePath = this.uriToFilePath(uri);
const content = await fs.readFile(filePath, "utf-8"); // Throws ENOENT
```

**Error**: "ENOENT: no such file or directory"

#### 2. Invalid URI Format

```typescript
// URI doesn't match orchestr8:// protocol
if (!uri.startsWith("orchestr8://")) {
  throw new Error("Invalid URI protocol");
}
```

#### 3. Missing Query Parameter

```typescript
// Dynamic URI without query parameter
if (parsed.type === "dynamic" && !parsed.matchParams.query) {
  throw new Error("Missing required query parameter");
}
```

**File**: `src/utils/uriParser.ts` (validation logic)

#### 4. Template Not Matched

If a URI doesn't match any registered resource or template, MCP returns error -32602 (Invalid params).

### Error Propagation

The SDK automatically catches thrown errors and converts them to MCP error responses:

```typescript
async (uri) => {
  try {
    const content = await resourceLoader.loadResourceContent(uri);
    return { contents: [{ uri: uri.toString(), mimeType: "text/markdown", text: content }] };
  } catch (error) {
    // SDK catches and converts to MCP error response
    throw error;
  }
}
```

### Logging Errors

Errors are logged to stderr:

```typescript
this.logger.error(`Error loading resource content for ${uri}:`, error);
```

**File**: `src/loaders/resourceLoader.ts:478`

## Graceful Shutdown

### Signal Handlers

The server handles `SIGINT` (Ctrl+C) and `SIGTERM` (kill):

```typescript
process.on("SIGINT", async () => {
  logger.info("Shutting down orchestr8 MCP server");
  await server.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.info("Shutting down orchestr8 MCP server");
  await server.close();
  process.exit(0);
});
```

**File**: `src/index.ts:252-262`

### Cleanup Steps

When `server.close()` is called:

1. **Stop accepting new requests**: Server closes transport
2. **Complete in-flight requests**: Wait for pending handlers
3. **Close watchers**: Stop file system watchers (development mode)
4. **Clear caches**: Release memory (optional)
5. **Exit process**: `process.exit(0)`

### Ungraceful Shutdown

If initialization fails:

```typescript
try {
  // ... server setup ...
} catch (error) {
  logger.error("Failed to start server:", error);
  process.exit(1);
}
```

**File**: `src/index.ts:263-266`

### Process Exit Codes

- `0`: Graceful shutdown
- `1`: Initialization failure or fatal error

## Code References

All code references in this document follow the format: `path/to/file.ts:line`

### Key Files

- **Main Entry**: `src/index.ts:1-274`
- **Prompt Loader**: `src/loaders/promptLoader.ts:1-228`
- **Resource Loader**: `src/loaders/resourceLoader.ts:1-591`
- **URI Parser**: `src/utils/uriParser.ts`
- **Fuzzy Matcher**: `src/utils/fuzzyMatcher.ts`
- **Logger**: `src/utils/logger.ts`

### Integration Tests

- **Protocol Tests**: `tests/integration/mcp-protocol.test.js:1-662`
- **Server Tests**: `tests/integration/mcp-server.test.js:1-300`

### Configuration

- **MCP Config**: `.mcp.json:1-13`
- **Package**: `package.json`
- **TypeScript**: `tsconfig.json`

## Next Steps

- Read [Prompts and Resources](./prompts-and-resources.md) to learn how to create content
- Read [Transport Layer](./transport.md) for stdio protocol details
- Review integration tests for practical examples
- Explore the SDK docs: https://github.com/modelcontextprotocol/typescript-sdk

---

**Related Docs**:
- [MCP Overview](./README.md)
- [Prompts and Resources](./prompts-and-resources.md)
- [Transport Layer](./transport.md)
