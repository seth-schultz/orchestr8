# Model Context Protocol (MCP) Implementation

## Overview

This directory contains comprehensive documentation for the Orchestr8 MCP server implementation. The Orchestr8 plugin implements the **Model Context Protocol (MCP)** to provide dynamic, composable expertise delivery to Claude Code.

## What is MCP?

The **Model Context Protocol (MCP)** is an open protocol that standardizes how applications provide context to Large Language Models (LLMs). It enables:

- **Standardized Communication**: A JSON-RPC 2.0 based protocol for client-server communication
- **Dynamic Context Loading**: Load relevant context just-in-time rather than upfront
- **Composable Architecture**: Mix and match different context providers (MCP servers)
- **Tool Extensibility**: Expose tools, prompts, and resources to LLMs

MCP was developed by Anthropic and is an open standard designed to work across different LLM applications.

## Why Orchestr8 Uses MCP

Orchestr8 uses MCP to create a **plugin architecture for Claude Code** that enables:

### 1. Dynamic Expertise Delivery

Rather than loading all expertise upfront (which would consume 100,000+ tokens), MCP enables:
- **Just-in-Time Loading**: Load only relevant expertise when needed
- **Three-Tier Matching**: Quick cache → Index lookup → Fuzzy fallback
- **Token Budget Management**: Assemble content within specified token limits or maxResults
- **Progressive Loading**: Start with minimal/index mode, load full content as needed
- **85-95% Token Reduction**: Index mode uses 200-500 tokens vs 5,000-10,000+ for full mode

### 2. Modular Knowledge Organization

MCP's resource model maps perfectly to Orchestr8's knowledge structure:
- **Agents**: Specialized expert personas (83 agents across TypeScript, Python, Rust, etc.)
- **Skills**: Specific capabilities (87 skills for API design, error handling, testing, etc.)
- **Examples**: Reference implementations and code patterns (16 working examples)
- **Patterns**: Architectural patterns and best practices (24 patterns)
- **Guides**: Step-by-step implementation guides (10 deployment guides)
- **Workflows**: Multi-step procedures for complex tasks (26 workflows)

**Total**: 383 fragments with 1,675 useWhen scenarios and 4,036 unique keywords

### 3. Slash Command Integration

MCP prompts become **slash commands** in Claude Code:
- `/orchestr8:now` - Autonomous workflow with dynamic expertise loading
- `/orchestr8:mcp-ui` - Web UI for testing and exploration
- Custom prompts automatically available as commands

### 4. Cross-Context Sharing

Because MCP is a standard protocol:
- **Reusable Servers**: Same server works across different Claude Code installations
- **Plugin Ecosystem**: Multiple MCP servers can coexist
- **Standard Tools**: Tools like `claude-mcp-tools` work with any MCP server

## How MCP Enables Plugin Architecture

### Traditional Approach (Without MCP)
```
Claude Code
    └─> Hard-coded tools
    └─> Static documentation
    └─> No extensibility
```

### MCP Approach (Current)
```
Claude Code
    ├─> MCP Server: Orchestr8 (Dynamic Expertise)
    ├─> MCP Server: GitHub (Repository Access)
    ├─> MCP Server: Database (Query Tools)
    └─> MCP Server: Custom Plugin
```

Each MCP server provides:
- **Prompts**: Slash commands for specific workflows
- **Resources**: Dynamic content delivery (static + fuzzy matching)
- **Tools**: Executable functions (future capability)

## Benefits of MCP for Claude Code

### For Users

1. **Discoverability**: Resources and prompts are listed in Claude Code UI
2. **Standard Interface**: Consistent way to interact with all plugins
3. **Composability**: Mix expertise from multiple servers
4. **Efficiency**: Only load what you need, when you need it

### For Developers

1. **Simple Protocol**: JSON-RPC 2.0 over stdio (easy to implement)
2. **Clear Specification**: Well-documented protocol with examples
3. **Language Agnostic**: Implement in any language that supports stdio
4. **Rich SDK**: Official TypeScript SDK with utilities

### For Orchestr8

1. **Token Efficiency**: 85-95% reduction through index-based loading
2. **Query Performance**: 5-10ms latency (index mode), <2ms with quick cache
3. **Scalability**: 383 fragments with room to grow to 1,000+ without performance degradation
4. **Flexibility**: Users query what they need, three-tier system finds best matches
5. **Evolution**: Update resources without protocol changes, rebuild indexes automatically

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Claude Code                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MCP Client (Built-in)                   │  │
│  │  - Discovers MCP servers from .mcp.json             │  │
│  │  - Manages server lifecycle                         │  │
│  │  - Converts prompts to slash commands               │  │
│  │  - Provides resource:// URI access                  │  │
│  └─────────┬────────────────────────────────────────────┘  │
│            │ JSON-RPC 2.0 over stdio                       │
└────────────┼───────────────────────────────────────────────┘
             │
             │ stdin/stdout
             │
┌────────────▼───────────────────────────────────────────────┐
│              Orchestr8 MCP Server (Node.js)                │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Server Core (@modelcontextprotocol/sdk)            │ │
│  │  - Protocol handling                                │ │
│  │  - Request routing                                  │ │
│  │  - Response formatting                              │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Prompt System                                      │ │
│  │  - Load from ./prompts/*.md                        │ │
│  │  - Argument substitution                           │ │
│  │  - Register as MCP prompts                         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Resource System                                    │ │
│  │  - Static URIs (orchestr8://category/name)        │ │
│  │  - Dynamic templates (orchestr8://match?query=...)│ │
│  │  - Fuzzy matching engine                          │ │
│  │  - Token budget management                        │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  File System (./resources/)                        │ │
│  │  - agents/*.md                         │ │
│  │  - skills/*.md                         │ │
│  │  - examples/*.md                       │ │
│  │  - patterns/*.md                       │ │
│  └──────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## Key Concepts

### 1. Resources (Static)

Static resources are direct file mappings:

```
URI:  orchestr8://agents/typescript-core
File: ./resources/agents/typescript-core.md
```

When Claude Code requests this URI, the server reads the file and returns its contents.

### 2. Resources (Dynamic)

Dynamic resources use intelligent matching to assemble content:

```
URI: orchestr8://match?query=build+typescript+api&maxTokens=2000

Process:
1. Parse query: "build typescript api"
2. Extract keywords and check quick lookup cache (TIER 1)
3. If not cached, search keyword index for matches (TIER 2)
4. If insufficient results, fallback to fuzzy matching (TIER 3)
5. Score and rank fragments by relevance
6. Select top matches within budget or maxResults
7. Assemble into format based on mode (index/minimal/catalog/full)
8. Return assembled content
```

**Four Response Modes:**
- `mode=index` (default): Ultra-compact useWhen scenarios (~200-500 tokens)
- `mode=minimal`: Compact JSON with URIs and scores (~300-500 tokens)
- `mode=catalog`: Full metadata with capabilities (~1,500-2,000 tokens)
- `mode=full`: Complete resource content (~5,000-10,000+ tokens)

### 3. Resource Templates

Templates use wildcards to capture parameters:

```
Template: orchestr8://agents/match{+rest}
Matches:  orchestr8://agents/match?query=...
          orchestr8://agents/match?query=...&mode=index&maxResults=5

Template: orchestr8://match{+rest}
Matches:  orchestr8://match?query=...
          orchestr8://match?query=...&categories=agents,skills&mode=catalog
```

The `{+rest}` wildcard captures everything after `/match`, including query parameters.

### 4. Advanced URI Patterns

**Cross-References:**
```
orchestr8://skills/api-design-rest?refs=true
  → Returns resource with cross-references to related skills and patterns
```

**Example References:**
```
orchestr8://examples/express-jwt-auth
  → Code example that references prerequisite skills
```

**Match Queries with Filters:**
```
orchestr8://match?query=retry+timeout&mode=index&maxResults=5&categories=skills,patterns
orchestr8://match?query=kubernetes&mode=minimal&minScore=20
orchestr8://match?query=typescript+api&mode=catalog&tags=async,rest
```

**Registry Access:**
```
orchestr8://registry
  → Returns catalog of all available resources with statistics
```

### 5. Prompts

Prompts are registered as slash commands:

```yaml
# prompts/workflows/now.md
---
name: now
title: Orchestr8 Now - Autonomous Workflow
description: Dynamic expertise assembly with JIT loading
arguments:
  - name: task
    required: true
    description: The task to accomplish
---

Your task: {{task}}

Load expertise dynamically using orchestr8://match?query=...
```

Becomes slash command: `/orchestr8:now task="build an API"`

## Documentation Structure

This documentation is organized into four sections:

### [Protocol Implementation](./protocol-implementation.md)

Detailed documentation of the MCP protocol implementation:
- Server initialization and handshake
- Prompt registration and handling
- Resource registration (static + dynamic)
- Request/response flow
- Error handling
- Graceful shutdown

**Audience**: Developers implementing or extending the MCP server

### [Prompts and Resources](./prompts-and-resources.md)

Guide to creating and using prompts and resources:
- How prompts work (slash commands)
- Argument substitution patterns
- Static resource URIs
- Dynamic resource templates
- Template wildcards and parameters
- Resource resolution

**Audience**: Content creators and power users

### [Transport Layer](./transport.md)

Technical details of the stdio transport:
- JSON-RPC 2.0 over stdin/stdout
- Message framing
- stderr for logging
- Process lifecycle

**Audience**: Developers working with MCP protocol directly

## Quick Start

### Using Orchestr8 Resources

```javascript
// In Claude Code, resources are accessed via ReadMcpResourceTool

// Static resource
ReadMcpResourceTool({
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://agents/typescript-core"
})

// Index mode (DEFAULT) - ultra-fast, minimal tokens
ReadMcpResourceTool({
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://match?query=retry+timeout&mode=index&maxResults=5"
})

// Minimal mode - compact JSON output
ReadMcpResourceTool({
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://match?query=typescript+api&mode=minimal"
})

// Catalog mode - full metadata
ReadMcpResourceTool({
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://agents/match?query=build+api&mode=catalog&maxResults=10"
})

// Full mode - complete content
ReadMcpResourceTool({
  server: "plugin:orchestr8:orchestr8-resources",
  uri: "orchestr8://agents/match?query=typescript&mode=full&maxTokens=2500"
})
```

### Using Slash Commands

```bash
# In Claude Code chat

/orchestr8:now task="Build a REST API with TypeScript"

# This loads the /now prompt which then dynamically loads
# relevant expertise using orchestr8://match?query=...
```

### Listing Available Resources

```javascript
ListMcpResourcesTool({
  server: "plugin:orchestr8:orchestr8-resources"
})

// Returns array of all available static resources
// Dynamic templates are also listed
```

## Configuration

The server is configured via `.mcp.json`:

```json
{
  "orchestr8-resources": {
    "command": "node",
    "args": ["${CLAUDE_PLUGIN_ROOT}/dist/index.js"],
    "env": {
      "PROMPTS_PATH": "${CLAUDE_PLUGIN_ROOT}/prompts",
      "RESOURCES_PATH": "${CLAUDE_PLUGIN_ROOT}/resources",
      "CACHE_SIZE": "100",
      "LOG_LEVEL": "info",
      "NODE_ENV": "production"
    }
  }
}
```

## Environment Variables

- `PROMPTS_PATH`: Directory containing prompt .md files (default: ./prompts)
- `RESOURCES_PATH`: Directory containing resource files (default: ./resources)
- `CACHE_SIZE`: LRU cache size for content (default: 100)
- `LOG_LEVEL`: Logging verbosity - debug, info, warn, error (default: info)
- `NODE_ENV`: Environment mode - production, development, test (default: production)

## Further Reading

- **MCP Specification**: https://spec.modelcontextprotocol.io/
- **MCP SDK Docs**: https://github.com/modelcontextprotocol/typescript-sdk
- **Claude Code Plugins**: https://claude.com/docs/code/plugins
- **Orchestr8 README**: ../../README.md

## Contributing

When extending the MCP implementation:

1. **Follow MCP Spec**: Adhere to the official MCP specification
2. **Test Protocol Compliance**: Run integration tests (`npm test`)
3. **Document Changes**: Update this documentation
4. **Maintain Backwards Compatibility**: Don't break existing URIs or prompts

## Support

For questions or issues:
- Check the [Protocol Implementation](./protocol-implementation.md) docs
- Review test examples in `tests/integration/`
- Open an issue on GitHub

---

**Next**: Read [Protocol Implementation](./protocol-implementation.md) for detailed implementation docs.
