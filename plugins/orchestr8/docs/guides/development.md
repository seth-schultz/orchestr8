# Development Guide

> Comprehensive guide for setting up, developing, and maintaining the Orchestr8 MCP project

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation and Setup](#installation-and-setup)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Building the Project](#building-the-project)
6. [Running Tests](#running-tests)
7. [Building Indexes](#building-indexes)
8. [Hot Reload and Development Mode](#hot-reload-and-development-mode)
9. [Debugging Techniques](#debugging-techniques)
10. [Environment Variables](#environment-variables)
11. [Common Development Tasks](#common-development-tasks)

## Prerequisites

Before you begin, ensure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | >= 18.0.0 | Runtime environment |
| **npm** | >= 9.0.0 | Package manager |
| **TypeScript** | >= 5.0.0 | Type-safe development (installed via npm) |
| **Git** | Any recent version | Version control |

**Verify your installation:**

```bash
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 9.0.0 or higher
git --version     # Any recent version
```

**Recommended Tools:**

- **VS Code** or any TypeScript-aware editor
- **Claude Code** for testing plugin integration
- **Terminal** with Unix-like commands (bash/zsh)

## Installation and Setup

### 1. Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd orchestr8-mcp/plugins/orchestr8

# Or if you already have the repository
cd /path/to/orchestr8-mcp/plugins/orchestr8
```

### 2. Install Dependencies

```bash
# Install all required packages
npm install
```

This installs:
- `@modelcontextprotocol/sdk` - MCP protocol implementation
- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution and watch mode
- `gray-matter` - Frontmatter parsing
- `lru-cache` - Performance caching
- `chokidar` - File system watching for hot reload
- `dotenv` - Environment variable management
- `zod` - Runtime type validation

### 3. Build the Project

```bash
# Compile TypeScript to JavaScript
npm run build
```

This creates the `dist/` directory with compiled JavaScript files.

### 4. Verify Installation

```bash
# Verify project structure
npm run verify

# Run tests
npm test
```

If all tests pass, your development environment is ready!

## Project Structure

Understanding the project structure is crucial for effective development:

```
plugins/orchestr8/
├── src/                      # TypeScript source code
│   ├── index.ts             # MCP server entry point
│   ├── loaders/             # Prompt and resource loading
│   │   ├── promptLoader.ts  # Loads workflow prompts
│   │   └── resourceLoader.ts # Loads resources and fragments
│   ├── utils/               # Utility functions
│   │   ├── logger.ts        # Structured logging
│   │   ├── uriParser.ts     # URI parsing (static/dynamic)
│   │   ├── fuzzyMatcher.ts  # Dynamic resource matching
│   │   └── indexBuilder.ts  # Index generation utilities
│   ├── registry/            # Resource registry
│   └── types.ts             # TypeScript type definitions
│
├── dist/                     # Compiled JavaScript (generated)
│   ├── index.js             # Entry point
│   ├── loaders/             # Compiled loaders
│   ├── utils/               # Compiled utilities
│   └── .tsbuildinfo         # TypeScript incremental build info
│
├── tests/                    # Test suites
│   ├── unit/                # Unit tests
│   │   ├── loaders.test.js  # Loader tests
│   │   ├── matcher.test.js  # Fuzzy matcher tests
│   │   └── parser.test.js   # URI parser tests
│   ├── integration/         # Integration tests
│   │   ├── mcp-server.test.js    # Server integration tests
│   │   └── mcp-protocol.test.js  # Protocol compliance tests
│   ├── benchmarks/          # Performance benchmarks
│   │   └── matching.bench.js     # Matching performance tests
│   └── verify-structure.sh  # Project structure validator
│
├── prompts/                  # Workflow prompts (slash commands)
│   └── workflows/           # Organized workflows
│       ├── new-project.md
│       ├── add-feature.md
│       └── ...
│
├── resources/               # On-demand resources
│   ├── agents/             # AI agent definitions
│   │   ├── typescript-developer.md
│   │   └──      # Agent expertise fragments
│   ├── skills/             # Reusable skill fragments
│   │   └── 
│   ├── patterns/           # Design patterns
│   │   └── 
│   ├── examples/           # Code examples
│   │   └── 
│   ├── guides/             # Setup and configuration guides
│   │   └── 
│   └── .index/             # Generated indexes (from build-index)
│       ├── usewhen-index.json
│       ├── keyword-index.json
│       └── quick-lookup.json
│
├── scripts/                 # Build and utility scripts
│   └── build-index.ts      # Index generation script
│
├── docs/                    # Documentation
│   ├── architecture/       # Architecture documentation
│   ├── mcp/               # MCP implementation docs
│   ├── resources/         # Resource system docs
│   ├── matching/          # Matching system docs
│   └── guides/            # Developer guides (this file)
│
├── web-ui/                  # MCP testing web UI
│
├── package.json            # npm configuration and scripts
├── tsconfig.json          # TypeScript compiler configuration
├── tsconfig.dev.json      # Development TypeScript config
├── .mcp.json              # MCP server configuration
└── .claude-plugin/        # Claude Code plugin metadata
    └── plugin.json
```

### Key Directories

- **src/**: All TypeScript source code - this is where you'll spend most of your time
- **dist/**: Compiled output - generated by `npm run build`, do not edit directly
- **tests/**: All test files - organized by type (unit, integration, benchmarks)
- **prompts/**: Workflow definitions - markdown files with frontmatter
- **resources/**: Knowledge base - organized by category with fragment subdirectories
- **scripts/**: Build utilities - currently just index building

## Development Workflow

The typical development workflow follows this pattern:

### 1. Make Changes

Edit TypeScript files in the `src/` directory:

```bash
# Example: editing the fuzzy matcher
vim src/utils/fuzzyMatcher.ts
```

### 2. Build (if needed)

For most changes, use watch mode (see below). For manual builds:

```bash
npm run build
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Or run specific test suites
npm run test:unit
npm run test:integration
```

### 4. Verify

```bash
# Verify project structure
npm run verify
```

### 5. Test in Claude Code

If developing plugin functionality, test integration:

1. Build the project: `npm run build`
2. Restart Claude Code
3. Test your changes with workflows

## Building the Project

### Build Commands

```bash
# Production build (default)
npm run build

# Development build (with source maps)
npm run build:dev

# Watch mode (auto-rebuild on changes)
npm run watch

# Clean build artifacts
npm run clean

# Clean and rebuild
npm run clean && npm run build
```

### Build Configurations

The project uses two TypeScript configurations:

#### **tsconfig.json** (Production)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "sourceMap": false,        // No source maps
    "declaration": true,        // Generate .d.ts files
    "removeComments": true,     // Strip comments
    "incremental": true         // Fast rebuilds
  }
}
```

#### **tsconfig.dev.json** (Development)

Extends `tsconfig.json` with development-friendly settings:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "sourceMap": true,          // Enable source maps
    "removeComments": false,    // Keep comments
    "declarationMap": true      // Generate declaration maps
  }
}
```

### Build Output

After building, the `dist/` directory contains:

```
dist/
├── index.js                 # Main entry point
├── loaders/
│   ├── promptLoader.js
│   └── resourceLoader.js
├── utils/
│   ├── logger.js
│   ├── uriParser.js
│   ├── fuzzyMatcher.js
│   └── indexBuilder.js
├── types.js                 # Type definitions
├── *.d.ts                   # TypeScript declarations
└── .tsbuildinfo            # Incremental build cache
```

## Running Tests

Orchestr8 uses Node.js's native test runner (`node --test`) for fast, dependency-free testing.

### Test Commands

```bash
# Run all tests (unit + integration)
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run specific integration test
npm run test:integration:protocol
npm run test:integration:server

# Watch mode (auto-run tests on changes)
npm run test:watch

# Run performance benchmarks
npm run benchmark
```

### Test Structure

#### **Unit Tests** (`tests/unit/`)

Test individual functions and modules in isolation:

```javascript
// Example: tests/unit/matcher.test.js
import { test } from 'node:test';
import assert from 'node:assert';
import { FuzzyMatcher } from '../../dist/utils/fuzzyMatcher.js';

test('fuzzy matcher scores resources correctly', async (t) => {
  const matcher = new FuzzyMatcher();
  const results = await matcher.match('typescript api');

  assert.ok(results.length > 0);
  assert.ok(results[0].score > 0);
});
```

**Running unit tests:**

```bash
npm run test:unit
```

#### **Integration Tests** (`tests/integration/`)

Test MCP server functionality end-to-end:

```javascript
// Example: tests/integration/mcp-protocol.test.js
import { test } from 'node:test';
import { McpServer } from '../../dist/index.js';

test('MCP server handles resource requests', async (t) => {
  const server = new McpServer();
  await server.initialize();

  const resource = await server.getResource('orchestr8://agents/typescript-core');
  assert.ok(resource.content);
});
```

**Running integration tests:**

```bash
npm run test:integration
```

#### **Benchmarks** (`tests/benchmarks/`)

Measure performance of critical operations:

```javascript
// Example: tests/benchmarks/matching.bench.js
import { test } from 'node:test';
import { FuzzyMatcher } from '../../dist/utils/fuzzyMatcher.js';

test('benchmark fuzzy matching performance', async (t) => {
  const matcher = new FuzzyMatcher();
  const iterations = 1000;

  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    await matcher.match('typescript api patterns');
  }
  const duration = Date.now() - start;

  console.log(`Average: ${duration / iterations}ms per query`);
});
```

**Running benchmarks:**

```bash
npm run benchmark
```

### Test Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up resources after tests
3. **Descriptive Names**: Use clear, descriptive test names
4. **Fast**: Keep unit tests under 100ms each
5. **Coverage**: Aim for >80% code coverage

## Building Indexes

Orchestr8 uses pre-built indexes for fast resource lookup and fuzzy matching.

### Index Generation

```bash
# Build all indexes
npm run build-index
```

This generates three index files in `resources/.index/`:

1. **usewhen-index.json** - Maps use-when scenarios to fragments
2. **keyword-index.json** - Inverted index of keywords to fragments
3. **quick-lookup.json** - Cache of common queries

### Index Files

#### **usewhen-index.json**

Maps use-when scenarios to fragments for semantic matching:

```json
{
  "version": "1.0.0",
  "generatedAt": "2025-11-11T10:00:00Z",
  "totalFragments": 221,
  "fragments": {
    "typescript-core": {
      "path": "agents/typescript-core.md",
      "category": "agent",
      "scenarios": [
        "designing type-safe APIs",
        "advanced TypeScript patterns needed",
        "complex type transformations required"
      ],
      "keywords": ["typescript", "types", "generics", "type-safe"],
      "estimatedTokens": 650
    }
  }
}
```

#### **keyword-index.json**

Inverted index mapping keywords to fragments:

```json
{
  "typescript": ["typescript-core", "typescript-api-development"],
  "async": ["python-async-fundamentals", "typescript-async-patterns"],
  "security": ["security-auth-jwt", "security-owasp-top10"]
}
```

#### **quick-lookup.json**

Pre-computed results for common queries:

```json
{
  "commonQueries": {
    "typescript api": ["typescript-core", "typescript-api-development"],
    "python async": ["python-async-fundamentals", "python-async-concurrency"]
  }
}
```

### When to Rebuild Indexes

Rebuild indexes when:

1. Adding new fragments to `resources/*/`
2. Modifying fragment metadata (tags, capabilities, use-when)
3. Index-based lookup returns stale results
4. After pulling changes that add/modify resources

### Using Index-Based Lookup

By default, Orchestr8 uses runtime fuzzy matching. To use index-based lookup:

```bash
# Enable index-based lookup
export USE_INDEX_LOOKUP=true

# Run the server
npm start
```

Index-based lookup is faster but requires rebuilding indexes when resources change.

## Hot Reload and Development Mode

For rapid development, use development mode with hot reload:

### Development Mode

```bash
# Start in development mode with hot reload
npm run dev
```

This:
1. Uses `tsx watch` to monitor file changes
2. Automatically recompiles TypeScript on changes
3. Restarts the MCP server on changes
4. Preserves source maps for debugging

### Watch Mode (Compilation Only)

If you only need auto-compilation without server restart:

```bash
npm run watch
```

This runs TypeScript in watch mode, recompiling on changes but not restarting the server.

### File Watching

The development server watches:
- `src/**/*.ts` - TypeScript source files
- `prompts/**/*.md` - Workflow prompts
- `resources/**/*.md` - Resource fragments

**Note:** Changes to tests require manually re-running tests.

## Debugging Techniques

### Enable Debug Logging

```bash
# Set log level to debug
export LOG_LEVEL=debug

# Run the server
npm start
```

Or inline:

```bash
LOG_LEVEL=debug npm start
```

### Debug with VS Code

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug MCP Server",
      "type": "node",
      "request": "launch",
      "runtimeArgs": ["--inspect-brk", "${workspaceFolder}/dist/index.js"],
      "console": "integratedTerminal",
      "env": {
        "LOG_LEVEL": "debug",
        "NODE_ENV": "development"
      }
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "runtimeArgs": ["--test", "--inspect-brk", "${workspaceFolder}/tests/unit/**/*.test.js"],
      "console": "integratedTerminal"
    }
  ]
}
```

### Debugging Tips

1. **Check Logs**: Always start with log output
   ```bash
   LOG_LEVEL=debug npm start 2>&1 | tee debug.log
   ```

2. **Test in Isolation**: Test components separately
   ```bash
   npm run test:unit tests/unit/matcher.test.js
   ```

3. **Verify Structure**: Ensure files are in correct locations
   ```bash
   npm run verify
   ```

4. **Check Build Output**: Ensure TypeScript compiled correctly
   ```bash
   ls -la dist/
   ```

5. **Inspect Indexes**: Check generated indexes
   ```bash
   cat resources/.index/usewhen-index.json | jq .
   ```

6. **Use Console Logging**: Add strategic console.log statements
   ```typescript
   console.log('DEBUG: fuzzy match query:', query);
   console.log('DEBUG: matched resources:', results.length);
   ```

7. **Test MCP Protocol**: Use the web UI for interactive testing
   ```bash
   npm run ui
   ```

## Environment Variables

Configure the MCP server using environment variables:

### Core Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment: `development`, `production`, `test` |
| `LOG_LEVEL` | `info` | Log level: `debug`, `info`, `warn`, `error` |
| `PROMPTS_PATH` | `./prompts` | Path to prompts directory |
| `RESOURCES_PATH` | `./resources` | Path to resources directory |
| `CACHE_SIZE` | `200` | LRU cache size (number of items) |
| `USE_INDEX_LOOKUP` | `false` | Use pre-built indexes instead of runtime matching |

### Setting Environment Variables

#### **In .mcp.json** (Claude Code Plugin)

```json
{
  "orchestr8-resources": {
    "command": "node",
    "args": ["${CLAUDE_PLUGIN_ROOT}/dist/index.js"],
    "env": {
      "PROMPTS_PATH": "${CLAUDE_PLUGIN_ROOT}/prompts",
      "RESOURCES_PATH": "${CLAUDE_PLUGIN_ROOT}/resources",
      "LOG_LEVEL": "info",
      "CACHE_SIZE": "200",
      "NODE_ENV": "production"
    }
  }
}
```

#### **In Shell** (Development/Testing)

```bash
# Inline for single command
LOG_LEVEL=debug npm start

# Export for session
export LOG_LEVEL=debug
export CACHE_SIZE=500
npm start
```

#### **In .env File**

Create `.env` in the project root:

```bash
NODE_ENV=development
LOG_LEVEL=debug
CACHE_SIZE=500
USE_INDEX_LOOKUP=true
```

Then load it:

```bash
# Automatically loaded if using dotenv
npm start
```

## Common Development Tasks

### Adding a New Feature

1. **Create a branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Write tests first** (TDD approach)
   ```bash
   vim tests/unit/my-feature.test.js
   npm run test:watch
   ```

3. **Implement the feature**
   ```bash
   vim src/utils/myFeature.ts
   ```

4. **Build and test**
   ```bash
   npm run build
   npm test
   ```

5. **Test integration**
   ```bash
   npm run test:integration
   ```

### Adding a New Resource Fragment

1. **Create the fragment file**
   ```bash
   vim resources/agents/my-fragment.md
   ```

2. **Add frontmatter metadata**
   ```yaml
   ---
   id: my-fragment
   category: agent
   tags: [typescript, advanced, patterns]
   capabilities:
     - Advanced TypeScript patterns
     - Generic type design
   use-when:
     - Building type-safe libraries
     - Complex type transformations needed
   estimated-tokens: 800
   ---

   # Fragment Content
   ...
   ```

3. **Rebuild indexes**
   ```bash
   npm run build-index
   ```

4. **Test discovery**
   ```bash
   # Test that fragment is discoverable
   LOG_LEVEL=debug npm start
   # Then test a query that should match your fragment
   ```

### Modifying the Fuzzy Matcher

1. **Edit the matcher**
   ```bash
   vim src/utils/fuzzyMatcher.ts
   ```

2. **Update tests**
   ```bash
   vim tests/unit/matcher.test.js
   ```

3. **Run benchmarks**
   ```bash
   npm run benchmark
   ```

4. **Verify performance**
   - Target: <15ms per query
   - Check results with different query types

### Debugging a Failing Test

1. **Run the test in isolation**
   ```bash
   npm run test:unit tests/unit/specific.test.js
   ```

2. **Add debug output**
   ```javascript
   console.log('DEBUG: input =', input);
   console.log('DEBUG: result =', result);
   ```

3. **Run with debug logging**
   ```bash
   LOG_LEVEL=debug npm run test:unit
   ```

4. **Check for race conditions** (integration tests)
   ```javascript
   // Add delays if needed
   await new Promise(resolve => setTimeout(resolve, 100));
   ```

### Performance Profiling

1. **Use Node.js profiler**
   ```bash
   node --prof dist/index.js
   node --prof-process isolate-*.log > profile.txt
   ```

2. **Run benchmarks**
   ```bash
   npm run benchmark
   ```

3. **Check cache effectiveness**
   ```bash
   LOG_LEVEL=debug npm start 2>&1 | grep "cache hit"
   ```

### Updating Dependencies

1. **Check for updates**
   ```bash
   npm outdated
   ```

2. **Update specific package**
   ```bash
   npm update @modelcontextprotocol/sdk
   ```

3. **Update all packages**
   ```bash
   npm update
   ```

4. **Test after updates**
   ```bash
   npm run build
   npm test
   npm run verify
   ```

### Creating a Release Build

1. **Clean previous builds**
   ```bash
   npm run clean
   ```

2. **Run full test suite**
   ```bash
   npm test
   npm run verify
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Rebuild indexes**
   ```bash
   npm run build-index
   ```

5. **Verify the build**
   ```bash
   node dist/index.js --version
   ```

## Next Steps

- Read the [Contributing Guide](./contributing.md) for code style and PR process
- Check [Troubleshooting Guide](./troubleshooting.md) for common issues
- Review [Architecture Documentation](../architecture/ARCHITECTURE.md) for system design
- Explore [MCP Implementation](../mcp/) for protocol details

---

**Questions?** Open an issue or refer to the [main documentation](../../README.md).
