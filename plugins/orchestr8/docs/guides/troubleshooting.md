# Troubleshooting Guide

> Common issues and solutions for the Orchestr8 MCP project

## Table of Contents

1. [Server Issues](#server-issues)
2. [Prompt Issues](#prompt-issues)
3. [Resource Issues](#resource-issues)
4. [Dynamic Matching Issues](#dynamic-matching-issues)
5. [Index Building Issues](#index-building-issues)
6. [Cache Issues](#cache-issues)
7. [Performance Issues](#performance-issues)
8. [Integration Test Issues](#integration-test-issues)
9. [Build and Compilation Issues](#build-and-compilation-issues)
10. [Debugging Tips](#debugging-tips)
11. [Log Analysis](#log-analysis)
12. [Getting Help](#getting-help)

## Server Issues

### Server Won't Start

**Symptoms:**
- Server fails to start
- No output or error messages
- Process exits immediately

**Possible Causes & Solutions:**

#### 1. TypeScript Not Compiled

```bash
# Check if dist/ directory exists
ls dist/

# If missing or empty, build the project
npm run build
```

#### 2. Missing Dependencies

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### 3. Node.js Version Mismatch

```bash
# Check Node.js version (must be >= 18)
node --version

# If too old, upgrade Node.js
# Use nvm (recommended):
nvm install 18
nvm use 18
```

#### 4. Port Already in Use

```bash
# Check if port is in use
lsof -i :3000

# Kill the process if needed
kill -9 <PID>
```

#### 5. Invalid Configuration

```bash
# Verify .mcp.json is valid JSON
cat .mcp.json | jq .

# Check environment variables
env | grep -E '(PROMPTS_PATH|RESOURCES_PATH|LOG_LEVEL)'
```

### Server Starts But Doesn't Respond

**Symptoms:**
- Server starts without errors
- No response to requests
- Timeouts

**Solutions:**

#### 1. Enable Debug Logging

```bash
LOG_LEVEL=debug node dist/index.js
```

Look for initialization messages:
- "MCP server initialized"
- "Loaded X prompts"
- "Loaded X resources"

#### 2. Check MCP Protocol

```bash
# Test with MCP client or inspector
npm run ui

# Or use the web UI to test connections
```

#### 3. Verify File Permissions

```bash
# Check that resources are readable
ls -la resources/
ls -la prompts/

# Fix permissions if needed
chmod -R 755 resources/
chmod -R 755 prompts/
```

### Server Crashes Randomly

**Symptoms:**
- Server runs but crashes unexpectedly
- Errors in logs before crash
- Memory or CPU issues

**Solutions:**

#### 1. Check for Uncaught Exceptions

```bash
# Run with debug logging
LOG_LEVEL=debug node dist/index.js 2>&1 | tee server.log

# Look for stack traces in server.log
```

#### 2. Memory Issues

```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 dist/index.js

# Monitor memory usage
node --expose-gc dist/index.js
```

#### 3. Cache Size Too Large

```bash
# Reduce cache size
export CACHE_SIZE=50
node dist/index.js
```

## Prompt Issues

### Prompts Not Appearing

**Symptoms:**
- Slash commands don't work
- Prompts missing in Claude Code
- `listPrompts` returns empty

**Solutions:**

#### 1. Verify Prompt Location

```bash
# Check prompts directory
ls -la prompts/workflows/

# Ensure files are .md and have frontmatter
head -20 prompts/workflows/new-project.md
```

#### 2. Validate Frontmatter

Ensure all prompts have valid YAML frontmatter:

```yaml
---
name: new-project
description: Create a new software project
arguments:
  - name: description
    description: Project description
    required: true
---
```

#### 3. Rebuild and Restart

```bash
# Rebuild the project
npm run build

# Restart Claude Code
# (close and reopen the application)
```

#### 4. Check Logs

```bash
# Look for prompt loading errors
LOG_LEVEL=debug node dist/index.js 2>&1 | grep -i prompt
```

### Prompt Execution Fails

**Symptoms:**
- Prompt loads but execution fails
- Error messages during execution
- Arguments not substituted

**Solutions:**

#### 1. Check Argument Substitution

Ensure arguments are properly defined and used:

```markdown
---
name: my-prompt
arguments:
  - name: project
    required: true
---

# Content
Build {{project}} with TypeScript
```

#### 2. Validate Markdown Syntax

```bash
# Use a markdown linter
npx markdownlint prompts/workflows/*.md
```

#### 3. Test Prompt Directly

```bash
# Load and test the prompt
node -e "
const { PromptLoader } = require('./dist/loaders/promptLoader.js');
const loader = new PromptLoader('./prompts');
loader.loadPrompt('my-prompt').then(console.log);
"
```

## Resource Issues

### Resources Not Loading

**Symptoms:**
- Resource URIs return errors
- `getResource` fails
- "Resource not found" errors

**Solutions:**

#### 1. Verify Resource Path

```bash
# Check resource exists
ls -la resources/agents/typescript-core.md

# Or for fragments
ls -la resources/agents/typescript-core.md
```

#### 2. Check URI Format

Correct format:
```
orchestr8://agents/typescript-core
orchestr8://agents/typescript-core
orchestr8://skills/api-design-rest
```

Incorrect format:
```
orchestr8://agents/typescript-core.md  ❌ (no extension)
orchestr8://typescript-core            ❌ (missing category)
orchestr8://agents/typescript_core     ❌ (underscore instead of hyphen)
```

#### 3. Check File Extension

```bash
# All resources must be .md files
find resources/ -type f ! -name "*.md" ! -path "*/\.index/*"

# Rename if needed
mv resources/agents/my-resource.txt resources/agents/my-resource.md
```

#### 4. Validate Frontmatter

```bash
# Check for valid YAML frontmatter
head -15 resources/agents/typescript-core.md
```

Required frontmatter fields:
```yaml
---
id: typescript-core
category: agent
tags: [typescript, types]
capabilities: [...]
use-when: [...]
estimated-tokens: 650
---
```

#### 5. Test Resource Loading

```bash
# Test loading directly
LOG_LEVEL=debug node -e "
const { ResourceLoader } = require('./dist/loaders/resourceLoader.js');
const loader = new ResourceLoader('./resources');
loader.getResource('orchestr8://agents/typescript-core').then(console.log);
"
```

### Resources Return Empty Content

**Symptoms:**
- Resource loads but content is empty
- No error messages
- Frontmatter loads but not content

**Solutions:**

#### 1. Check File Content

```bash
# Verify file has content beyond frontmatter
cat resources/agents/typescript-core.md
```

#### 2. Check Encoding

```bash
# Ensure files are UTF-8 encoded
file resources/agents/typescript-core.md

# Convert if needed
iconv -f ISO-8859-1 -t UTF-8 file.md > file_utf8.md
```

#### 3. Check for Null Bytes

```bash
# Check for null bytes
cat -v resources/agents/typescript-core.md | grep "\\^@"

# Remove null bytes if found
tr -d '\000' < file.md > file_clean.md
```

## Dynamic Matching Issues

### Dynamic Matching Returns No Results

**Symptoms:**
- `orchestr8://match?query=...` returns empty
- No resources matched
- 0 results for valid queries

**Solutions:**

#### 1. Broaden Your Query

Try more general terms:

```bash
# Too specific (may return nothing)
orchestr8://match?query=typescript+express+jwt+authentication+redis

# Better (broader)
orchestr8://match?query=typescript+authentication
```

#### 2. Check Resource Metadata

Ensure fragments have relevant tags and capabilities:

```bash
# Search for matching tags
grep -r "typescript" resources/agents/*.md | grep "tags:"
```

#### 3. Increase Token Budget

```bash
# Default is 3000, try increasing
orchestr8://match?query=typescript+api&maxTokens=5000
```

#### 4. Remove Category Filter

```bash
# Too restrictive
orchestr8://match?query=python&categories=example

# Try without filter
orchestr8://match?query=python
```

#### 5. Remove Required Tags

```bash
# May be filtering out all results
orchestr8://match?query=api&tags=graphql,typescript

# Try without required tags
orchestr8://match?query=api+graphql+typescript
```

#### 6. Enable Debug Logging

```bash
LOG_LEVEL=debug node dist/index.js 2>&1 | grep -A 10 "fuzzy match"
```

Look for:
- Keywords extracted from query
- Number of resources scored
- Top scoring resources

### Dynamic Matching Returns Irrelevant Results

**Symptoms:**
- Results don't match query intent
- Wrong resources returned
- Low relevance

**Solutions:**

#### 1. Use More Specific Keywords

```bash
# Generic
orchestr8://match?query=api

# Specific
orchestr8://match?query=rest+api+authentication+typescript
```

#### 2. Use Category Filters

```bash
# Filter to specific categories
orchestr8://match?query=testing&categories=example,skill
```

#### 3. Use Required Tags

```bash
# Require specific tags
orchestr8://match?query=async+patterns&tags=typescript
```

#### 4. Reduce Token Budget

Lower budgets return fewer, higher-quality results:

```bash
orchestr8://match?query=python+api&maxTokens=1500
```

#### 5. Improve Fragment Metadata

Update fragment frontmatter with better tags and capabilities:

```yaml
---
tags: [typescript, rest-api, authentication, express]  # More specific
capabilities:
  - RESTful API design with Express.js              # More detailed
  - JWT authentication implementation               # More specific
use-when:
  - Building authenticated REST APIs                # More concrete
  - Need Express.js authentication patterns         # More specific
---
```

## Index Building Issues

### Index Building Fails

**Symptoms:**
- `npm run build-index` errors
- Index files not created
- Script exits with error

**Solutions:**

#### 1. Check TypeScript Compilation

```bash
# Ensure source is compiled
npm run build

# Then rebuild index
npm run build-index
```

#### 2. Check Resource Structure

```bash
# Verify structure is correct
npm run verify

# Check for malformed frontmatter
find resources/ -name "*.md" -exec sh -c '
  echo "Checking: $1"
  head -20 "$1" | grep -q "^---$" || echo "Missing frontmatter: $1"
' _ {} \;
```

#### 3. Check File Permissions

```bash
# Ensure resources directory is readable
chmod -R 755 resources/

# Ensure .index directory is writable
mkdir -p resources/.index
chmod 755 resources/.index
```

#### 4. Check for Syntax Errors

```bash
# Run with tsx directly for better error messages
npx tsx scripts/build-index.ts
```

### Index Files Are Stale

**Symptoms:**
- New fragments not appearing in results
- Old fragments still appearing
- Changes not reflected

**Solutions:**

#### 1. Rebuild Indexes

```bash
npm run build-index
```

#### 2. Clear Index Cache

```bash
# Remove old indexes
rm -rf resources/.index/

# Rebuild
npm run build-index
```

#### 3. Restart Server

```bash
# Stop current server (Ctrl+C)
# Rebuild indexes
npm run build-index

# Start server again
npm start
```

### Index Files Too Large

**Symptoms:**
- Slow index loading
- High memory usage
- Large file sizes in `.index/`

**Solutions:**

#### 1. Check Fragment Sizes

```bash
# Find large fragments
find resources/ -name "*.md" -exec wc -l {} + | sort -rn | head -20
```

#### 2. Split Large Fragments

Break down fragments larger than 2000 tokens into smaller, focused fragments.

#### 3. Optimize Metadata

Remove redundant or overly verbose metadata:

```yaml
# Too verbose
use-when:
  - When building a TypeScript REST API with Express.js and JWT authentication and you need patterns for error handling

# Better
use-when:
  - Building authenticated REST APIs with Express
  - Need JWT authentication patterns
```

## Cache Issues

### Cache Not Working

**Symptoms:**
- Slow performance on repeated requests
- No cache hits in logs
- Resources always loaded from disk

**Solutions:**

#### 1. Enable Cache Logging

```bash
LOG_LEVEL=debug node dist/index.js 2>&1 | grep -i cache
```

Look for "cache hit" vs "cache miss" messages.

#### 2. Check Cache Size

```bash
# Increase cache size if too small
export CACHE_SIZE=500
node dist/index.js
```

#### 3. Check TTL

Cache entries expire after:
- Prompts: 1 hour
- Resources: 4 hours

For longer TTL, modify cache settings in source code.

### Cache Serving Stale Data

**Symptoms:**
- Old content returned after updates
- Changes not reflected
- Need to restart to see updates

**Solutions:**

#### 1. Restart Server

```bash
# Stop and restart
pkill -f "node dist/index.js"
npm start
```

#### 2. Use Development Mode

Development mode has shorter cache TTL:

```bash
NODE_ENV=development npm run dev
```

#### 3. Clear Cache Manually

```bash
# Restart with clean cache
npm start
```

#### 4. Disable Caching (Development)

For development, you can disable caching:

```bash
export CACHE_SIZE=0
npm run dev
```

## Performance Issues

### Slow Resource Loading

**Symptoms:**
- Long delays loading resources
- High latency
- Timeouts

**Solutions:**

#### 1. Enable Caching

```bash
# Ensure caching is enabled
export CACHE_SIZE=200
npm start
```

#### 2. Use Index-Based Lookup

```bash
# Build indexes
npm run build-index

# Enable index lookup
export USE_INDEX_LOOKUP=true
npm start
```

#### 3. Reduce Fragment Sizes

Break large fragments into smaller pieces:
- Target: 500-1500 tokens per fragment
- Maximum: 2000 tokens per fragment

#### 4. Check Disk I/O

```bash
# Monitor disk usage
iostat -x 1

# Check for slow disk
time cat resources/agents/*.md > /dev/null
```

### High Memory Usage

**Symptoms:**
- Server uses excessive memory
- Out of memory errors
- System slow or unresponsive

**Solutions:**

#### 1. Reduce Cache Size

```bash
export CACHE_SIZE=50
npm start
```

#### 2. Increase Node.js Memory Limit

```bash
node --max-old-space-size=4096 dist/index.js
```

#### 3. Monitor Memory

```bash
# Run with memory profiling
node --expose-gc --inspect dist/index.js

# Connect Chrome DevTools to inspect memory
```

#### 4. Check for Memory Leaks

```bash
# Run with heap snapshots
node --heap-prof dist/index.js

# Analyze with Chrome DevTools
```

### Slow Fuzzy Matching

**Symptoms:**
- Dynamic matching takes >100ms
- High CPU usage during matching
- Slow queries

**Solutions:**

#### 1. Use Index-Based Lookup

```bash
npm run build-index
export USE_INDEX_LOOKUP=true
npm start
```

#### 2. Reduce Token Budget

```bash
# Lower budgets = faster matching
orchestr8://match?query=typescript&maxTokens=1500
```

#### 3. Profile Performance

```bash
# Run benchmarks
npm run benchmark

# Check results
# Target: <15ms per query
```

#### 4. Optimize Metadata

Ensure fragments have focused, relevant metadata:
- 3-8 tags (not 20+)
- 2-5 capabilities (not 10+)
- 2-5 use-when scenarios (not 15+)

## Integration Test Issues

### Tests Fail Intermittently

**Symptoms:**
- Tests pass sometimes, fail others
- Non-deterministic failures
- Race conditions

**Solutions:**

#### 1. Add Delays

```javascript
// Add small delays for async operations
await new Promise(resolve => setTimeout(resolve, 100));
```

#### 2. Increase Timeouts

```javascript
test('my test', { timeout: 10000 }, async (t) => {
  // Test code
});
```

#### 3. Isolate Tests

```javascript
// Ensure each test is independent
test('test 1', async (t) => {
  const server = new McpServer(); // Create fresh instance
  // Test code
});
```

### Tests Can't Find Resources

**Symptoms:**
- "Resource not found" in tests
- Tests fail with ENOENT errors
- Path issues

**Solutions:**

#### 1. Check Test Working Directory

```javascript
// Use absolute paths in tests
const resourcesPath = path.join(__dirname, '../../resources');
```

#### 2. Build Before Testing

```bash
npm run build && npm test
```

#### 3. Verify Test Fixtures

```bash
# Check test fixtures exist
ls -la tests/fixtures/
```

## Build and Compilation Issues

### TypeScript Compilation Errors

**Symptoms:**
- `npm run build` fails
- Type errors
- Compilation errors

**Solutions:**

#### 1. Check TypeScript Version

```bash
# Ensure TypeScript >= 5.0
npx tsc --version

# Update if needed
npm install typescript@latest --save-dev
```

#### 2. Clean and Rebuild

```bash
npm run clean
npm install
npm run build
```

#### 3. Fix Type Errors

```bash
# Run with detailed errors
npx tsc --noEmit --pretty
```

#### 4. Check for Missing Types

```bash
# Install missing types
npm install @types/node --save-dev
```

### Module Resolution Errors

**Symptoms:**
- "Cannot find module" errors
- Import errors
- Path resolution failures

**Solutions:**

#### 1. Check Import Paths

```typescript
// Correct (with .js extension for ESM)
import { logger } from './utils/logger.js';

// Incorrect (missing .js)
import { logger } from './utils/logger';
```

#### 2. Check tsconfig.json

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

#### 3. Check package.json

```json
{
  "type": "commonjs"
}
```

## Debugging Tips

### General Debugging Strategy

1. **Enable debug logging**
   ```bash
   LOG_LEVEL=debug npm start
   ```

2. **Isolate the problem**
   - Test components separately
   - Narrow down to specific function

3. **Check the logs**
   - Look for errors, warnings
   - Follow the execution flow

4. **Add strategic logging**
   ```typescript
   console.log('DEBUG: input =', input);
   console.log('DEBUG: result =', result);
   ```

5. **Use Node.js debugger**
   ```bash
   node --inspect-brk dist/index.js
   ```

6. **Test with minimal example**
   - Create simple reproduction case
   - Remove complexity

### Using the Web UI

The web UI provides interactive testing:

```bash
# Start the web UI
npm run ui

# Open in browser
# Test prompts and resources interactively
```

### Debugging in VS Code

1. **Set breakpoints** in TypeScript source
2. **Run debug configuration** (see Development Guide)
3. **Step through code** and inspect variables
4. **Use debug console** for expressions

### Common Debug Commands

```bash
# Check environment
env | grep -E '(NODE|PROMPTS|RESOURCES|CACHE|LOG)'

# Check processes
ps aux | grep node

# Check ports
lsof -i :3000

# Monitor file changes
fswatch -r src/ resources/ prompts/

# Check disk usage
du -sh resources/ prompts/ dist/

# Check memory usage
ps -o pid,vsz,rss,comm | grep node
```

## Log Analysis

### Log Levels

- **debug**: Detailed execution flow, cache hits/misses, matching scores
- **info**: Startup, initialization, major operations
- **warn**: Recoverable issues, fallbacks
- **error**: Failures, exceptions

### Key Log Messages

#### Startup

```
[info] MCP server initialized
[info] Loaded 9 prompts from ./prompts
[info] Indexed 221 resources from ./resources
[info] Cache initialized with size 200
```

#### Resource Loading

```
[debug] Loading resource: orchestr8://agents/typescript-core
[debug] Cache hit: orchestr8://agents/typescript-core
[debug] Resource loaded in 2ms
```

#### Fuzzy Matching

```
[debug] Fuzzy match query: typescript api patterns
[debug] Extracted keywords: [typescript, api, patterns]
[debug] Scored 221 resources, top score: 45
[debug] Matched 3 resources (2400 tokens)
```

#### Errors

```
[error] Failed to load resource: orchestr8://agents/nonexistent
[error] ENOENT: no such file or directory
[error] Stack: ...
```

### Analyzing Logs

```bash
# Save logs to file
LOG_LEVEL=debug npm start 2>&1 | tee debug.log

# Search for errors
grep -i error debug.log

# Search for specific resource
grep "typescript-core" debug.log

# Count cache hits vs misses
grep "cache hit" debug.log | wc -l
grep "cache miss" debug.log | wc -l

# Find slow operations
grep -E "[0-9]{3,}ms" debug.log
```

## Getting Help

### Before Asking

1. **Check this guide**: Solution might be here
2. **Search existing issues**: Problem might be known
3. **Enable debug logging**: Gather information
4. **Create minimal reproduction**: Simplify the problem

### Where to Get Help

1. **Documentation**
   - [Development Guide](./development.md)
   - [Contributing Guide](./contributing.md)
   - [Architecture Docs](../architecture/ARCHITECTURE.md)

2. **GitHub Issues**
   - Search existing issues
   - Open new issue with details

3. **Discussions**
   - Ask questions
   - Share solutions
   - Help others

### Opening an Issue

Include:

1. **Description**: What's wrong?
2. **Steps to reproduce**: How to trigger the problem?
3. **Expected behavior**: What should happen?
4. **Actual behavior**: What actually happens?
5. **Environment**:
   ```bash
   node --version
   npm --version
   cat package.json | grep version
   ```
6. **Logs**: Relevant error messages (use debug logging)
7. **Attempted solutions**: What have you tried?

### Issue Template

```markdown
## Description
Brief description of the issue.

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- Node.js version: v18.0.0
- npm version: 9.0.0
- Project version: 1.0.0
- OS: macOS 13.0

## Logs
```
Paste relevant logs here (with LOG_LEVEL=debug)
```

## Attempted Solutions
- Tried solution 1
- Tried solution 2
```

---

## Summary

- **Enable debug logging** for detailed information
- **Check logs** for errors and warnings
- **Verify structure** with `npm run verify`
- **Rebuild** when in doubt: `npm run clean && npm run build`
- **Test in isolation** to narrow down problems
- **Consult documentation** for detailed guides

---

**Still stuck?** Open an issue with detailed information and logs.
