# MCP Transport Layer

This document details the transport layer used by the Orchestr8 MCP server. It covers the stdio transport protocol, message framing, logging strategy, and process lifecycle management.

## Table of Contents

- [Overview](#overview)
- [Stdio Transport](#stdio-transport)
- [Message Format](#message-format)
- [Message Framing](#message-framing)
- [Logging Strategy](#logging-strategy)
- [Process Lifecycle](#process-lifecycle)
- [Implementation Details](#implementation-details)
- [Debugging](#debugging)
- [Examples](#examples)

## Overview

The Model Context Protocol (MCP) supports multiple transport layers. The Orchestr8 server uses the **stdio transport**, which communicates via standard input/output streams.

### Why Stdio?

**Advantages**:
- **Simple**: No network configuration or ports
- **Secure**: No network exposure
- **Cross-Platform**: Works on all operating systems
- **Built-in**: Every process has stdin/stdout
- **Efficient**: Direct pipe communication

**Use Cases**:
- Local processes (like Claude Code plugins)
- CLI tools
- Single-machine deployments
- Development and testing

### Architecture

```
┌─────────────────────────────────────────────┐
│          Claude Code (MCP Client)           │
│                                             │
│  1. Spawn server process                    │
│  2. Write JSON-RPC to server's stdin   ──────────┐
│  3. Read JSON-RPC from server's stdout ──────────┤
│  4. Read logs from server's stderr     ──────────┤
└─────────────────────────────────────────────┘   │
                                                   │
                                                   │
┌──────────────────────────────────────────────┐  │
│     Orchestr8 MCP Server (Node.js)           │  │
│                                              │  │
│  stdin  ←──────────────────────────────────────┘
│  stdout ←──────────────────────────────────────┐
│  stderr ←──────────────────────────────────────┤
│                                              │  │
│  StdioServerTransport                        │  │
│  - Reads from stdin (JSON-RPC requests)      │  │
│  - Writes to stdout (JSON-RPC responses)     │  │
│  - Logger writes to stderr (safe)            │  │
└──────────────────────────────────────────────┘  │
                                                   │
                ┌──────────────────────────────────┘
                │
                └──> Claude Code receives
                     responses and logs
```

## Stdio Transport

### Initialization

The server creates a stdio transport and connects it to the MCP server:

```typescript
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Set up stdio transport (communicates via stdin/stdout)
const transport = new StdioServerTransport();

// Connect server to transport
await server.connect(transport);

logger.info("orchestr8 MCP server started successfully");
```

**File**: `src/index.ts:243-249`

### Transport Behavior

The `StdioServerTransport` automatically:

1. **Reads from `process.stdin`**:
   - Buffers incoming data
   - Splits by newlines
   - Parses JSON-RPC messages
   - Routes to MCP server

2. **Writes to `process.stdout`**:
   - Formats responses as JSON-RPC
   - Appends newline
   - Flushes to stdout

3. **Error Handling**:
   - Catches parse errors
   - Returns JSON-RPC error responses
   - Logs to stderr (not stdout)

### Stream Configuration

Stdio transport expects:

- **stdin**: Line-buffered JSON-RPC messages
- **stdout**: Line-buffered JSON-RPC responses
- **stderr**: Free-form logging (doesn't affect protocol)

```javascript
// Spawning the server (in Claude Code)
const server = spawn("node", ["dist/index.js"], {
  stdio: ["pipe", "pipe", "pipe"], // [stdin, stdout, stderr]
});
```

**File**: `tests/integration/mcp-protocol.test.js:42-51`

## Message Format

All messages follow JSON-RPC 2.0 specification.

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

**Fields**:
- `jsonrpc`: Always "2.0"
- `id`: Unique request identifier (integer or string)
- `method`: MCP method name
- `params`: Method-specific parameters (object)

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

**Fields**:
- `jsonrpc`: Always "2.0"
- `id`: Matches request id
- `result`: Method result (object)

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

**Fields**:
- `jsonrpc`: Always "2.0"
- `id`: Matches request id
- `error`: Error object with code and message

**Common Error Codes**:
- `-32700`: Parse error (invalid JSON)
- `-32600`: Invalid request
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32603`: Internal error

### Notification Format

Notifications are requests without an `id`:

```json
{
  "jsonrpc": "2.0",
  "method": "notifications/progress",
  "params": {
    "progressToken": "task-123",
    "progress": 50,
    "total": 100
  }
}
```

**Note**: Server doesn't send notifications, but can receive them from client.

## Message Framing

Messages are **newline-delimited JSON** (NDJSON).

### Framing Rules

1. **One message per line**: Each JSON object is on a single line
2. **Newline separator**: Messages are separated by `\n`
3. **No trailing whitespace**: JSON should be compact
4. **UTF-8 encoding**: All messages are UTF-8

### Example Stream

```
{"jsonrpc":"2.0","id":1,"method":"initialize","params":{...}}\n
{"jsonrpc":"2.0","id":2,"method":"resources/list","params":{}}\n
{"jsonrpc":"2.0","id":3,"method":"resources/read","params":{"uri":"orchestr8://agents/typescript-core"}}\n
```

### Writing Messages

The SDK handles framing automatically:

```typescript
// SDK serializes to JSON and appends \n
process.stdout.write(JSON.stringify(response) + "\n");
```

### Reading Messages

The SDK buffers and splits by newlines:

```typescript
let buffer = "";

process.stdin.on("data", (data) => {
  buffer += data.toString();
  const lines = buffer.split("\n");
  buffer = lines.pop() || ""; // Keep incomplete line in buffer

  for (const line of lines) {
    if (!line.trim()) continue;
    const message = JSON.parse(line);
    handleMessage(message);
  }
});
```

**File**: `tests/integration/mcp-protocol.test.js:54-69`

### Partial Messages

If a message is split across multiple `data` events:

```
Event 1: {"jsonrpc":"2.0","id":1,"meth
Event 2: od":"initialize","params":{...}}\n
```

The buffer accumulates until a complete line is received.

## Logging Strategy

### Why Stderr?

**Critical**: The MCP protocol uses stdout for JSON-RPC messages. Any non-JSON output to stdout will corrupt the protocol stream and cause parsing errors.

**Solution**: All logging must go to stderr.

### Logger Implementation

```typescript
export class Logger {
  constructor(private component: string) {}

  private log(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] [${this.component}] ${message}`;

    // Always write to stderr, never stdout
    console.error(logMessage, ...args);
  }

  debug(message: string, ...args: any[]): void {
    if (process.env.LOG_LEVEL === "debug") {
      this.log("DEBUG", message, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (["debug", "info"].includes(process.env.LOG_LEVEL || "info")) {
      this.log("INFO", message, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    this.log("WARN", message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.log("ERROR", message, ...args);
  }
}
```

**File**: `src/utils/logger.ts`

**Key Points**:
- Uses `console.error()` which writes to stderr
- Never uses `console.log()` which writes to stdout
- Structured format: `[timestamp] [level] [component] message`
- Respects `LOG_LEVEL` environment variable

### Log Levels

- **debug**: Verbose logging (all details)
- **info**: General information (startup, requests)
- **warn**: Warnings (non-fatal issues)
- **error**: Errors (failures, exceptions)

**Configuration**:

```json
{
  "env": {
    "LOG_LEVEL": "info"
  }
}
```

**File**: `.mcp.json:9`

### Example Log Output

```
[2025-01-15T10:30:00.123Z] [INFO] [orchestr8-mcp] Starting orchestr8 MCP server v1.0.0
[2025-01-15T10:30:00.456Z] [INFO] [orchestr8-mcp] Loaded 3 prompts
[2025-01-15T10:30:00.789Z] [INFO] [orchestr8-mcp] Loaded 150 resources
[2025-01-15T10:30:01.012Z] [INFO] [orchestr8-mcp] Resource index pre-loaded for dynamic matching
[2025-01-15T10:30:01.234Z] [INFO] [orchestr8-mcp] orchestr8 MCP server started successfully
[2025-01-15T10:30:05.567Z] [DEBUG] [orchestr8-mcp] Loading resource: orchestr8://agents/typescript-core
[2025-01-15T10:30:05.890Z] [INFO] [orchestr8-mcp] Dynamic resource request: orchestr8://agents/match?query=api
[2025-01-15T10:30:06.123Z] [INFO] [orchestr8-mcp] Assembled 3 fragments (2456 tokens)
```

All of this goes to stderr, keeping stdout clean for JSON-RPC.

## Process Lifecycle

### Server Startup

1. **Claude Code reads `.mcp.json`**:
   ```json
   {
     "orchestr8-resources": {
       "command": "node",
       "args": ["${CLAUDE_PLUGIN_ROOT}/dist/index.js"],
       "env": { ... }
     }
   }
   ```

2. **Claude Code spawns process**:
   ```javascript
   const server = spawn("node", ["dist/index.js"], {
     env: { PROMPTS_PATH: "...", RESOURCES_PATH: "...", ... },
     stdio: ["pipe", "pipe", "pipe"],
   });
   ```

3. **Server initializes**:
   - Load environment variables
   - Create MCP server instance
   - Load prompts and resources
   - Register prompts and resources
   - Connect stdio transport
   - Log "Server started successfully" to stderr

4. **Claude Code sends `initialize` request**:
   ```json
   {"jsonrpc":"2.0","id":1,"method":"initialize","params":{...}}
   ```

5. **Server responds with capabilities**:
   ```json
   {"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05","capabilities":{...}}}
   ```

6. **Server is ready**: Handles subsequent requests

### Request Handling

```
1. Client writes request to stdin
   ↓
2. Transport reads from stdin
   ↓
3. Transport parses JSON-RPC
   ↓
4. Transport routes to MCP server
   ↓
5. MCP server dispatches to handler
   ↓
6. Handler processes request
   ↓
7. Handler returns result
   ↓
8. MCP server formats response
   ↓
9. Transport writes to stdout
   ↓
10. Client reads from stdout
```

### Graceful Shutdown

1. **Client sends signal**: `SIGINT` or `SIGTERM`

2. **Server catches signal**:
   ```typescript
   process.on("SIGINT", async () => {
     logger.info("Shutting down orchestr8 MCP server");
     await server.close();
     process.exit(0);
   });
   ```

3. **Server closes**:
   - Stop accepting new requests
   - Wait for in-flight requests to complete
   - Close stdio streams
   - Exit process with code 0

**File**: `src/index.ts:252-256`

### Error Shutdown

If server encounters fatal error:

```typescript
try {
  // ... server setup ...
} catch (error) {
  logger.error("Failed to start server:", error);
  process.exit(1); // Exit with error code
}
```

**File**: `src/index.ts:263-266`

## Implementation Details

### StdioServerTransport Internals

The SDK's `StdioServerTransport` class:

```typescript
export class StdioServerTransport implements Transport {
  private readableStream: Readable;
  private writableStream: Writable;

  constructor() {
    this.readableStream = process.stdin;
    this.writableStream = process.stdout;
  }

  async start(): Promise<void> {
    this.readableStream.setEncoding("utf-8");
    this.readableStream.on("data", this.handleData.bind(this));
    this.readableStream.on("end", this.handleEnd.bind(this));
    this.readableStream.on("error", this.handleError.bind(this));
  }

  async send(message: JSONRPCMessage): Promise<void> {
    const json = JSON.stringify(message);
    this.writableStream.write(json + "\n");
  }

  async close(): Promise<void> {
    this.readableStream.destroy();
    this.writableStream.end();
  }

  private handleData(data: string): void {
    // Buffer and parse JSON-RPC messages
    // ...
  }
}
```

**Note**: This is a conceptual representation. Actual SDK implementation may vary.

### Custom Transport (Advanced)

To implement a custom transport (e.g., HTTP, WebSocket):

```typescript
import { Transport } from "@modelcontextprotocol/sdk/server/transport.js";

class HttpTransport implements Transport {
  async start(): Promise<void> {
    // Start HTTP server
  }

  async send(message: JSONRPCMessage): Promise<void> {
    // Send HTTP response
  }

  async close(): Promise<void> {
    // Stop HTTP server
  }
}

const transport = new HttpTransport();
await server.connect(transport);
```

## Debugging

### Viewing Server Logs

When running the server, stderr is visible:

```bash
node dist/index.js

[2025-01-15T10:30:00.123Z] [INFO] [orchestr8-mcp] Starting orchestr8 MCP server v1.0.0
[2025-01-15T10:30:00.456Z] [INFO] [orchestr8-mcp] Loaded 3 prompts
...
```

### Debugging Protocol Messages

To see JSON-RPC messages, log them to stderr (not stdout):

```typescript
// In handler
logger.debug(`Received request: ${JSON.stringify(params)}`);
logger.debug(`Sending response: ${JSON.stringify(result)}`);
```

Set `LOG_LEVEL=debug` to see these logs.

### Testing Transport

The integration tests demonstrate transport usage:

```javascript
// tests/integration/mcp-protocol.test.js

const server = spawn("node", [serverPath], {
  stdio: ["pipe", "pipe", "pipe"],
});

// Write request to stdin
const request = { jsonrpc: "2.0", id: 1, method: "initialize", params: {} };
server.stdin.write(JSON.stringify(request) + "\n");

// Read response from stdout
server.stdout.on("data", (data) => {
  const response = JSON.parse(data.toString());
  console.log("Received:", response);
});

// Read logs from stderr
server.stderr.on("data", (data) => {
  console.error("Log:", data.toString());
});
```

**File**: `tests/integration/mcp-protocol.test.js:42-79`

### Common Issues

#### Issue: Protocol Parse Errors

**Symptom**: Client reports "Invalid JSON" or "Parse error"

**Cause**: Something wrote to stdout that isn't JSON-RPC

**Solution**:
1. Check for `console.log()` statements → Replace with `logger.info()`
2. Check for `process.stdout.write()` → Ensure only JSON-RPC
3. Verify no libraries write to stdout

#### Issue: Server Hangs

**Symptom**: Server starts but doesn't respond to requests

**Cause**: stdin not being read or stdout not being written

**Solution**:
1. Check transport is connected: `await server.connect(transport)`
2. Verify stdin is open: `process.stdin.isTTY === false` (good for pipes)
3. Check for blocking operations in handlers

#### Issue: Logs Not Visible

**Symptom**: Can't see server logs

**Cause**: stderr is not being captured or LOG_LEVEL is too high

**Solution**:
1. Check stderr is piped: `stdio: ["pipe", "pipe", "pipe"]`
2. Lower LOG_LEVEL: `LOG_LEVEL=debug`
3. Read stderr stream: `server.stderr.on("data", ...)`

#### Issue: Broken Pipe

**Symptom**: Server crashes with "EPIPE" error

**Cause**: Client closed stdin/stdout prematurely

**Solution**:
1. Handle `EPIPE` errors gracefully
2. Ensure client waits for server to finish
3. Implement proper shutdown sequence

## Examples

### Example 1: Manual Testing

Test the server manually using stdio:

```bash
# Terminal 1: Start server
node dist/index.js

# Terminal 2: Send requests via stdin
echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | node dist/index.js
```

Output (stdout):
```json
{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05","capabilities":{...}}}
```

Logs (stderr):
```
[2025-01-15T10:30:00.123Z] [INFO] [orchestr8-mcp] Starting orchestr8 MCP server v1.0.0
...
```

### Example 2: Programmatic Client

```javascript
const { spawn } = require("child_process");

const server = spawn("node", ["dist/index.js"], {
  stdio: ["pipe", "pipe", "pipe"],
});

let buffer = "";
server.stdout.on("data", (data) => {
  buffer += data.toString();
  const lines = buffer.split("\n");
  buffer = lines.pop() || "";

  for (const line of lines) {
    if (!line.trim()) continue;
    const response = JSON.parse(line);
    console.log("Response:", response);
  }
});

server.stderr.on("data", (data) => {
  console.error("Log:", data.toString());
});

// Send initialize request
const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: { prompts: {}, resources: {} },
    clientInfo: { name: "test-client", version: "1.0.0" },
  },
};

server.stdin.write(JSON.stringify(request) + "\n");
```

### Example 3: Streaming Responses

For large responses, data may arrive in chunks:

```javascript
let buffer = "";

server.stdout.on("data", (chunk) => {
  buffer += chunk.toString();

  // Try to parse complete messages
  const lines = buffer.split("\n");

  // Keep last (potentially incomplete) line in buffer
  buffer = lines.pop() || "";

  for (const line of lines) {
    if (!line.trim()) continue;

    try {
      const message = JSON.parse(line);
      handleMessage(message);
    } catch (error) {
      console.error("Parse error:", error);
    }
  }
});

server.stdout.on("end", () => {
  // Process any remaining buffered data
  if (buffer.trim()) {
    try {
      const message = JSON.parse(buffer);
      handleMessage(message);
    } catch (error) {
      console.error("Final parse error:", error);
    }
  }
});
```

## Summary

The Orchestr8 MCP server uses stdio transport for simple, secure, and efficient communication:

- **stdin**: Receives JSON-RPC requests (newline-delimited)
- **stdout**: Sends JSON-RPC responses (newline-delimited)
- **stderr**: Outputs logs (doesn't affect protocol)

**Key Principles**:
1. Never write non-JSON to stdout
2. Always log to stderr
3. Use newline-delimited JSON framing
4. Handle partial messages with buffering
5. Implement graceful shutdown

**For More**:
- JSON-RPC 2.0 Spec: https://www.jsonrpc.org/specification
- MCP Spec: https://spec.modelcontextprotocol.io/
- SDK Docs: https://github.com/modelcontextprotocol/typescript-sdk

---

**Related Docs**:
- [MCP Overview](./README.md)
- [Protocol Implementation](./protocol-implementation.md)
- [Prompts and Resources](./prompts-and-resources.md)
