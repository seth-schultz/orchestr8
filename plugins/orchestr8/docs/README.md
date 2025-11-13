# Orchestr8 MCP Documentation

> **Complete documentation for the Orchestr8 Model Context Protocol server**

Welcome to the Orchestr8 MCP Server documentation. This guide will help you understand, use, and extend the Orchestr8system for autonomous software development workflows.

## Quick Links

- [Getting Started](./getting-started.md) - Get up and running in 10 minutes
- [Usage Guide](./usage/README.md) - How to use Orchestr8 in Claude Code
- [Examples](./examples/README.md) - Practical usage examples
- [Web UI](./web-ui.md) - Interactive dashboard for testing and monitoring

## Documentation Structure

### Getting Started

**New to Orchestr8?** Start here:

- [Getting Started Guide](./getting-started.md) - Installation, setup, and first workflows
- [Quick Start](../README.md#quick-start) - 5-minute overview

### Usage Guides

**How to use Orchestr8 in Claude Code:**

- [Usage Overview](./usage/README.md) - Core concepts and usage patterns
- [Workflows](./usage/workflows.md) - Using slash commands for development workflows
- [Resources](./usage/resources.md) - Loading agents, skills, patterns, and examples

### Examples

**Practical examples and patterns:**

- [Basic Usage](./examples/basic-usage.md) - Common scenarios and simple patterns
- [Advanced Usage](./examples/advanced-usage.md) - Complex queries, optimization, and integration

### Architecture

**Understanding how Orchestr8 works:**

- [Architecture Overview](./architecture/README.md) - High-level system design
- [System Design](./architecture/system-design.md) - Component details and data flows
- [Architecture Diagrams](./architecture/architecture-diagram.md) - Visual representations
- [Design Decisions](./architecture/design-decisions.md) - ADRs and rationale

### MCP Implementation

**Model Context Protocol integration:**

- [MCP Overview](./mcp/README.md) - Protocol implementation summary
- [Protocol Implementation](./mcp/protocol-implementation.md) - JSON-RPC and server lifecycle
- [Prompts and Resources](./mcp/prompts-and-resources.md) - Prompt/resource registration
- [Transport Layer](./mcp/transport.md) - stdio communication

### Resources

**The knowledge system:**

- [Resource System](./resources/README.md) - Overview and organization
- [Fragments](./resources/fragments.md) - Fragment-based composition
- [Categories](./resources/categories.md) - Agents, skills, patterns, examples
- [Authoring Guide](./resources/authoring-guide.md) - Creating new resources

### Matching System

**Dynamic resource discovery:**

- [Matching Overview](./matching/README.md) - Fuzzy matching and index lookup
- [Fuzzy Matching](./matching/fuzzy-matching.md) - Semantic scoring algorithm
- [Index Lookup](./matching/index-lookup.md) - Pre-built indexes for fast queries
- [Performance](./matching/performance.md) - Benchmarks and optimization

### Testing

**Quality assurance:**

- [Testing Overview](./testing/README.md) - Test strategy and coverage
- [Unit Tests](./testing/unit-tests.md) - Component testing
- [Integration Tests](./testing/integration-tests.md) - End-to-end testing
- [Benchmarks](./testing/benchmarks.md) - Performance testing

### Development Guides

**Contributing and extending:**

- [Development Guide](./guides/development.md) - Development workflow and setup
- [Contributing](./guides/contributing.md) - How to contribute
- [Troubleshooting](./guides/troubleshooting.md) - Common issues and solutions

### Tools

**Interactive tools:**

- [Web UI Documentation](./web-ui.md) - Dashboard for testing and monitoring
- [Index Builder](./resources/README.md#index-system-architecture) - Pre-built index generation

## Key Concepts

### Just-In-Time Loading

Orchestr8 minimizes token usage by loading resources on-demand:

- **Workflows**: ~2KB each, loaded at startup (9 workflows = 18KB)
- **Resources**: 200KB+ available, loaded only when needed
- **Token reduction**: 91-97% compared to loading everything upfront

### Dynamic Resource Matching

Find relevant resources without hard-coding references:

```
orchestr8://match?query=typescript+api+authentication&maxTokens=2500
```

**Two matching modes:**
- **Fuzzy Matching**: Semantic scoring (15-20ms)
- **Index Lookup**: Pre-built indexes (5-10ms, 85-95% token reduction)

### Fragment-Based Resources

Knowledge broken into small, composable units:

- **Size**: 500-1000 tokens per fragment
- **Metadata**: Tags, capabilities, useWhen scenarios
- **Composition**: Dynamically assembled based on context

### Three-Tier Architecture

```
TIER 1: Workflows (Claude Code)
   ↓ Static/Dynamic reference
TIER 2: MCP Server (stdio)
   ↓ Load on-demand
TIER 3: Resources (Fragments)
```

## Common Tasks

### Run a Workflow

```bash
# In Claude Code
/orchestr8:new-project Build a TypeScript REST API with authentication
```

### Load Specific Resource

```
orchestr8://agents/typescript-core
```

### Discover Resources Dynamically

```
orchestr8://match?query=error+handling+retry&mode=catalog&maxResults=10
```

### Use Web UI

```bash
cd /path/to/orchestr8-mcp/plugins/orchestr8
npm run ui
# Open http://localhost:3000
```

## Documentation by Role

### I'm a User (Claude Code)

1. [Getting Started](./getting-started.md) - Install and first workflow
2. [Usage Guide](./usage/README.md) - Workflows and resources
3. [Examples](./examples/README.md) - Common patterns
4. [Web UI](./web-ui.md) - Visual testing interface

### I'm a Developer (Contributing)

1. [Architecture](./architecture/README.md) - System design
2. [Development Guide](./guides/development.md) - Setup and workflow
3. [Testing](./testing/README.md) - Test strategy
4. [Contributing](./guides/contributing.md) - Contribution guidelines

### I'm a Resource Author

1. [Authoring Guide](./resources/authoring-guide.md) - Creating fragments
2. [Fragments](./resources/fragments.md) - Fragment structure
3. [Categories](./resources/categories.md) - Where to place resources
4. [Matching System](./matching/README.md) - How matching works

### I'm an Architect

1. [Architecture Overview](./architecture/README.md) - High-level design
2. [System Design](./architecture/system-design.md) - Component details
3. [Design Decisions](./architecture/design-decisions.md) - ADRs
4. [MCP Implementation](./mcp/README.md) - Protocol details

## Documentation Conventions

### URI Examples

All URIs in documentation follow the `orchestr8://` protocol:

```
orchestr8://category/resource
orchestr8://category/fragment-id
orchestr8://match?query=search+terms
orchestr8://category/match?query=search+terms
```

### Code Blocks

- **Bash commands**: Shell commands and CLI usage
- **Markdown**: Resource content and frontmatter
- **TypeScript**: Code implementation examples
- **JSON**: Configuration and data structures

### Callouts

- **Important**: Critical information you must know
- **Note**: Additional context or clarification
- **Tip**: Helpful suggestions and best practices
- **Warning**: Potential issues or gotchas

## Version Information

- **Documentation Version**: 1.0.0
- **Orchestr8 Version**: 1.0.0
- **MCP Protocol**: 2024-11-05
- **Last Updated**: 2025-11-11

## Getting Help

### Documentation Issues

- Check [Troubleshooting Guide](./guides/troubleshooting.md)
- Review [Examples](./examples/README.md)
- Search existing documentation

### Technical Support

- Review [Architecture](./architecture/README.md) for system understanding
- Check [Development Guide](./guides/development.md) for setup issues
- Use [Web UI](./web-ui.md) for interactive debugging

### Contributing

- See [Contributing Guide](./guides/contributing.md)
- Review [Development Guide](./guides/development.md)
- Read [Authoring Guide](./resources/authoring-guide.md) for new resources

## What's Next?

**New users**: Start with [Getting Started](./getting-started.md)

**Experienced users**: Browse [Examples](./examples/README.md) for advanced patterns

**Developers**: Dive into [Architecture](./architecture/README.md)

**Resource authors**: Read [Authoring Guide](./resources/authoring-guide.md)

---

**Need a specific topic?** Use the navigation above or search the documentation.

**Have feedback?** See [Contributing Guide](./guides/contributing.md) to improve these docs.
