# Getting Started with Orchestr8 MCP

> **Get productive with Orchestr8 in under 10 minutes**

This guide will walk you through installing, configuring, and using Orchestr8 MCP for autonomous development workflows in Claude Code.

## What is Orchestr8?

Orchestr8 is a Claude Code plugin that provides **just-in-time loading** of development workflows, AI agents, and reusable patterns through the Model Context Protocol (MCP). It enables:

- **Autonomous workflows** via slash commands (/new-project, /add-feature, etc.)
- **Dynamic resource matching** to find relevant expertise on-demand
- **Token-efficient loading** - only load what you need, when you need it
- **200+ knowledge fragments** covering TypeScript, Python, Go, patterns, and more

## Prerequisites

Before you begin, ensure you have:

- **Claude Code** installed and configured
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Basic familiarity with command-line tools

## Installation

### Step 1: Get the Plugin

Clone or download the Orchestr8 repository:

```bash
git clone <repository-url>
cd orchestr8-mcp/plugins/orchestr8
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the MCP Server

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Step 4: Install in Claude Code

The plugin should be automatically detected by Claude Code. If not, you can manually install it:

1. Open Claude Code settings
2. Navigate to **Plugins** → **Install from Directory**
3. Select the `orchestr8-mcp/plugins/orchestr8` directory
4. Restart Claude Code

### Step 5: Verify Installation

Check that the MCP server is running:

```bash
# In Claude Code, try a workflow
/orchestr8:new-project Test project
```

If you see the workflow prompt, installation was successful!

## First Workflows

Let's try some basic workflows to get familiar with Orchestr8.

### Example 1: Create a New Project

```bash
/orchestr8:new-project Build a TypeScript REST API with JWT authentication and PostgreSQL
```

**What happens:**
1. Workflow loads (~2KB)
2. Dynamically assembles relevant resources:
   - TypeScript developer agent
   - REST API patterns
   - JWT authentication examples
   - PostgreSQL integration guides
3. Provides step-by-step implementation plan

**Result:** Complete project structure and implementation guidance

### Example 2: Add a Feature

```bash
/orchestr8:add-feature Add user profile management with avatar upload
```

**What happens:**
1. Analyzes your existing codebase
2. Designs the feature to fit your architecture
3. Implements backend + frontend + tests in parallel
4. Provides integration and deployment steps

**Result:** Feature implementation with tests and documentation

### Example 3: Fix a Bug

```bash
/orchestr8:fix-bug Users can't login after password reset
```

**What happens:**
1. Investigates the issue systematically
2. Identifies root cause
3. Implements fix with tests
4. Validates the solution

**Result:** Bug fix with test coverage and explanation

## Understanding Resources

Orchestr8 organizes knowledge into **resources** - fragments of expertise that can be loaded on-demand.

### Resource Categories

| Category | Purpose | Example |
|----------|---------|---------|
| **agents** | AI agent definitions | `typescript-developer`, `python-expert` |
| **skills** | Reusable techniques | `error-handling`, `testing-strategies` |
| **patterns** | Design patterns | `microservices`, `authentication` |
| **examples** | Code examples | `express-jwt-auth`, `fastapi-async` |
| **guides** | Setup guides | `aws-eks-setup`, `docker-compose` |
| **workflows** | Process templates | `new-project`, `add-feature` |

### Loading Resources

**Static loading** (specific resource):
```
orchestr8://agents/typescript-core
```

**Dynamic matching** (find by query):
```
orchestr8://match?query=error+handling+retry&maxTokens=2000
```

**Category-specific** (narrow scope):
```
orchestr8://agents/match?query=build+graphql+api
```

## Common Workflows

Orchestr8 provides several built-in workflows accessible via slash commands:

### Development Workflows

**Create new project:**
```bash
/orchestr8:new-project <description>
```

**Add feature:**
```bash
/orchestr8:add-feature <feature description>
```

**Fix bug:**
```bash
/orchestr8:fix-bug <issue description>
```

**Refactor code:**
```bash
/orchestr8:refactor <refactoring goal>
```

### Quality Workflows

**Review code:**
```bash
/orchestr8:review-code <scope>
```

**Security audit:**
```bash
/orchestr8:security-audit <target>
```

**Optimize performance:**
```bash
/orchestr8:optimize-performance <performance issue>
```

### Deployment Workflows

**Deploy application:**
```bash
/orchestr8:deploy <deployment target>
```

**Setup CI/CD:**
```bash
/orchestr8:setup-cicd <CI/CD platform>
```

## Using Dynamic Matching

Dynamic matching is Orchestr8's superpower - it finds relevant resources without hard-coding references.

### Basic Query

Find TypeScript API expertise:
```
orchestr8://match?query=typescript+rest+api+authentication&maxTokens=2500
```

**Returns:** Top-scored fragments on TypeScript APIs and authentication (~2400 tokens)

### Catalog Mode (Lightweight)

Browse available resources without loading full content:
```
orchestr8://match?query=testing+patterns&mode=catalog&maxResults=10
```

**Returns:** List of 10 matching resources with URIs and scores (~100 tokens)

### Index Mode (Fastest)

Use pre-built indexes for ultra-fast lookups:
```
orchestr8://match?query=retry+exponential+backoff&mode=index&maxResults=5
```

**Returns:** Top 5 matches from keyword index (~60 tokens, <10ms)

## Using the Web UI

Orchestr8 includes a powerful web dashboard for testing and monitoring.

### Launch the Dashboard

```bash
cd /path/to/orchestr8-mcp/plugins/orchestr8
npm run ui
```

Open your browser to: **http://localhost:3000**

### What You Can Do

1. **Browse Resources**: Explore all available agents, skills, patterns, and examples
2. **Test Queries**: Try dynamic matching queries interactively
3. **View Statistics**: Monitor MCP server performance and activity
4. **Debug Issues**: Watch real-time server logs and requests

### Features

- **Resource Explorer**: Browse 200+ fragments by category
- **Testing Interface**: Test prompts and resources with parameters
- **Live Activity**: Real-time MCP server event streaming
- **Charts**: Latency distribution and resource usage metrics

See [Web UI Documentation](./web-ui.md) for full details.

## Quick Tips

### Token Budget Guidelines

Choose token budgets based on task complexity:

- **Quick reference**: 500-1000 tokens
- **Task context**: 1500-2500 tokens
- **Deep expertise**: 3000-5000 tokens
- **Comprehensive**: 5000+ tokens

### Query Optimization

Write better queries for more relevant results:

**Good queries** (specific keywords):
- `typescript async error handling retry`
- `kubernetes deployment helm charts`
- `jwt authentication refresh tokens`

**Avoid** (too generic):
- `api development`
- `error handling`
- `backend code`

### Resource Discovery

Not sure what's available? Use catalog mode:

```
orchestr8://match?query=your+topic&mode=catalog&maxResults=20
```

Then load specific resources you need.

## Common Scenarios

### Scenario 1: Starting a New TypeScript API

```bash
# Run the workflow
/orchestr8:new-project Build a TypeScript REST API with Express, PostgreSQL, and JWT auth

# The workflow will:
# 1. Load relevant expertise dynamically
# 2. Set up project structure
# 3. Implement core features
# 4. Add tests and documentation
# 5. Provide deployment guidance
```

### Scenario 2: Adding Authentication to Existing App

```bash
# Add the feature
/orchestr8:add-feature Add JWT authentication with refresh tokens

# The workflow will:
# 1. Analyze your codebase
# 2. Design auth to fit your architecture
# 3. Implement auth endpoints + middleware
# 4. Add tests for auth flows
# 5. Integrate with existing routes
```

### Scenario 3: Debugging Production Issue

```bash
# Fix the bug
/orchestr8:fix-bug API timeouts under high load

# The workflow will:
# 1. Investigate timeout causes
# 2. Analyze performance bottlenecks
# 3. Implement fixes (caching, connection pooling, etc.)
# 4. Add monitoring and alerting
# 5. Validate solution
```

### Scenario 4: Finding Specific Pattern

```
# Search for patterns
orchestr8://patterns/match?query=circuit+breaker+resilience&mode=catalog

# Review results and load:
orchestr8://patterns/resilience-patterns
```

## Troubleshooting

### Workflows Not Appearing

**Problem:** Slash commands don't show up in Claude Code

**Solution:**
1. Rebuild the project: `npm run build`
2. Restart Claude Code
3. Verify MCP server is running (check logs)

### Resources Not Loading

**Problem:** Dynamic matching returns no results

**Solution:**
1. Try broader keywords in query
2. Use catalog mode to see what's available
3. Check index is built: `npm run build-index`
4. Enable debug logging: `LOG_LEVEL=debug`

### Server Won't Start

**Problem:** MCP server fails to initialize

**Solution:**
1. Check Node.js version: `node --version` (>= 18.0.0)
2. Reinstall dependencies: `npm install`
3. Rebuild: `npm run build`
4. Check file permissions

### Performance Issues

**Problem:** Queries are slow

**Solution:**
1. Use index mode: `mode=index`
2. Add category filters: `orchestr8://agents/match?...`
3. Reduce maxResults in catalog mode
4. Check cache is working (should be fast on second query)

For more troubleshooting, see [Troubleshooting Guide](./guides/troubleshooting.md).

## Next Steps

### Learn More

- [Usage Guide](./usage/README.md) - Comprehensive usage documentation
- [Examples](./examples/README.md) - Practical usage examples
- [Architecture](./architecture/README.md) - How Orchestr8 works

### Explore Resources

- Browse the [Resource System](./resources/README.md)
- Understand [Fragments](./resources/fragments.md)
- Learn about [Categories](./resources/categories.md)

### Advanced Topics

- [Fuzzy Matching](./matching/fuzzy-matching.md) - How matching works
- [Index Lookup](./matching/index-lookup.md) - Fast query optimization
- [Performance](./matching/performance.md) - Benchmarks and tuning

### Contribute

- [Contributing Guide](./guides/contributing.md) - How to contribute
- [Development Guide](./guides/development.md) - Development workflow
- [Authoring Guide](./resources/authoring-guide.md) - Create new resources

## Getting Help

- **Documentation**: Browse the [docs](./README.md)
- **Examples**: Check [usage examples](./examples/README.md)
- **Troubleshooting**: See [troubleshooting guide](./guides/troubleshooting.md)
- **Web UI**: Use [dashboard](./web-ui.md) for interactive debugging

## Summary

You now know how to:

- ✅ Install and configure Orchestr8 MCP
- ✅ Run workflows via slash commands
- ✅ Load resources (static and dynamic)
- ✅ Use dynamic matching for discovery
- ✅ Launch and use the Web UI
- ✅ Troubleshoot common issues

**Ready to dive deeper?** Continue to the [Usage Guide](./usage/README.md) for comprehensive documentation.

---

**Questions?** Check the [documentation index](./README.md) or [troubleshooting guide](./guides/troubleshooting.md).
