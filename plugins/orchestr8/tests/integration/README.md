# MCP Protocol Integration Tests

## Overview

Comprehensive integration test suite for the orchestr8 MCP server that validates the complete MCP protocol implementation.

## Test File

- **Location**: `tests/integration/mcp-protocol.test.js`
- **Test Framework**: Node.js native test runner (`node:test`)
- **Test Count**: 51 tests across 10 test suites

## Running Tests

### Prerequisites

1. Build the project:
   ```bash
   npm run build
   ```

2. Ensure the following directories exist:
   - `prompts/workflows/` - Contains workflow prompt files
   - `resources/agents/` - Contains agent resource files
   - `resources/skills/` - Contains skill resource files
   - `resources/examples/` - Contains example resource files

### Run All Integration Tests

```bash
npm run test:integration
```

### Run Specific Test File

```bash
node --test tests/integration/mcp-protocol.test.js
```

### Run with Verbose Output

```bash
node --test --test-reporter=spec tests/integration/mcp-protocol.test.js
```

## Test Scenarios

### ✅ 1. Server Startup and MCP Handshake (3 tests)
- Initialize server with proper protocol version
- Verify prompts capability is supported
- Verify resources capability is supported

### ✅ 2. List All Prompts (5 tests)
- Returns array of prompts
- Returns exactly 9 workflow prompts
- Includes all expected workflow names:
  - `new-project`
  - `add-feature`
  - `fix-bug`
  - `refactor`
  - `review-code`
  - `security-audit`
  - `optimize-performance`
  - `deploy`
  - `setup-cicd`
- Each prompt has required metadata (name, description)
- Prompts with arguments have proper schema

### ✅ 3. Get Specific Prompt with Arguments (5 tests)
- Retrieve prompt by name with arguments
- Returns proper message structure (role, content, type)
- Substitutes `$ARGUMENTS` placeholder with first argument
- Content is substantial (>500 characters)
- Content includes `orchestr8://` resource references

### ✅ 4. List All Static Resources (7 tests)
- Returns array of resources
- Includes agent resources (`orchestr8://agents/*`)
- Includes skill resources (`orchestr8://skills/*`)
- Includes example resources (`orchestr8://examples/*`)
- Includes pattern resources (`orchestr8://patterns/*`)
- Each resource has required metadata (uri, name, mimeType)
- MIME types are valid (text/markdown, text/plain, application/json, etc.)

### ✅ 5. Read Static Resource (6 tests)
- Read specific resource by URI (`orchestr8://agents/typescript-developer`)
- Returns content array with text property
- Content is substantial (>500 characters)
- Correct MIME type (text/markdown or text/plain)
- Response includes the requested URI
- Can read nested resource paths (`orchestr8://examples/typescript/api-rest`)

### ⚠️ 6. Read Dynamic Resource with Fuzzy Matching (5 tests)
- Handle dynamic URI with query parameter
- Return assembled content from matching fragments
- Support `maxTokens` parameter to limit response size
- Decode URL-encoded query parameters (e.g., `+` as space)
- Filter by category in URI path

**Status**: Tests fail - dynamic resources not yet fully implemented

### ⚠️ 7. Dynamic Resource Assembly from Multiple Fragments (5 tests)
- Assemble content from multiple matching fragments
- Include relevance scores in assembled content
- Include tags metadata in output
- Respect `maxTokens` budget constraint
- Match across different resource categories

**Status**: Tests fail - fuzzy matching not fully functional

### ✅ 8. Invalid URIs Return Proper Errors (5 tests)
- Non-existent resource returns error
- Malformed URI (wrong protocol) returns error
- Dynamic URI without query parameter returns error
- Non-existent prompt returns error
- Missing required arguments handled gracefully

### ⚠️ 9. Cache Hit on Second Request (4 tests)
- Static resource content is cached
- Dynamic resource content is cached (fails - not implemented)
- Prompt content with arguments is cached
- Different arguments produce different cached content

### ✅ 10. Argument Substitution in Prompts (6 tests)
- Substitute `${argument-name}` placeholders
- Substitute `$ARGUMENTS` with first argument value
- Handle multiple arguments
- Preserve unmatched placeholders gracefully
- Handle special characters in arguments (`"quotes"`, `$symbols`, `@chars`)
- Handle multi-line argument values

## Test Results Summary

### Current Status
- **Total Tests**: 51
- **Passing**: 40 (78%)
- **Failing**: 11 (22%)

### Passing Test Suites
1. ✅ Server Startup and MCP Handshake (3/3)
2. ✅ List All Prompts (5/5)
3. ✅ Get Specific Prompt with Arguments (5/5)
4. ✅ List All Static Resources (7/7)
5. ✅ Read Static Resource (6/6)
6. ✅ Invalid URIs Return Proper Errors (5/5)
7. ✅ Argument Substitution in Prompts (6/6)

### Failing Test Suites
1. ❌ Read Dynamic Resource with Fuzzy Matching (0/5)
2. ❌ Dynamic Resource Assembly from Multiple Fragments (0/5)
3. ⚠️ Cache Hit on Second Request (3/4 - only dynamic cache test fails)

### Known Issues

**Dynamic Resource Matching Not Fully Implemented**
- Error: `MCP error -32602: Resource orchestr8://agents/match?query=typescript+api not found`
- Root cause: Dynamic resource templates are registered in `index.ts` but the URI matching logic may not be properly resolving the template URIs
- The fuzzy matcher and URI parser are implemented but not being invoked correctly by the MCP server

**Required Fixes**:
1. Verify ResourceTemplate registration in MCP server
2. Ensure dynamic URIs are properly matched against registered templates
3. Verify resource index is loaded before dynamic resource requests
4. Test URI parsing with actual MCP protocol URIs

## Architecture

### Test Client (MCPClient)

The test suite includes a custom MCP client that:
- Spawns the MCP server as a child process
- Communicates via JSON-RPC over stdin/stdout
- Handles request/response correlation with message IDs
- Manages request timeouts (10 seconds)
- Provides clean async/await interface for tests

### Test Structure

Each test suite follows this pattern:

```javascript
describe("Test Suite Name", () => {
  // Optional: Setup before all tests
  before(async () => {
    // Load data, initialize state
  });

  it("should do something specific", async () => {
    const result = await client.sendRequest("method", params);
    assert.ok(result);
  });
});
```

## Environment Variables

The test suite sets these environment variables for the server:

- `PROMPTS_PATH`: Path to prompts directory
- `RESOURCES_PATH`: Path to resources directory
- `LOG_LEVEL`: Set to "error" to minimize noise during tests
- `NODE_ENV`: Set to "test" to disable hot-reload and other dev features

## Debugging Tests

### View Server Logs

To see detailed server logs during tests, modify the `LOG_LEVEL`:

```javascript
env: {
  ...process.env,
  LOG_LEVEL: "debug", // Change from "error" to "debug"
}
```

### Test Individual Scenarios

Use `node:test` filtering:

```bash
node --test --test-name-pattern="Server Startup" tests/integration/mcp-protocol.test.js
```

### Inspect MCP Protocol Messages

Add console.log statements in the MCPClient:

```javascript
this.server.stdout.on("data", (data) => {
  console.log("SERVER OUT:", data.toString());
  // ... rest of handler
});
```

## Future Improvements

1. **Implement Dynamic Resource Matching**: Complete the fuzzy matching system
2. **Add Performance Tests**: Measure response times and cache effectiveness
3. **Test Concurrent Requests**: Verify server handles multiple simultaneous requests
4. **Test Hot Reload**: Verify file watching and cache invalidation
5. **Add Stress Tests**: Test with large prompts and resources
6. **Test Error Recovery**: Verify server recovers from various error conditions

## Related Files

- Source: `src/index.ts` - Main MCP server implementation
- Source: `src/loaders/promptLoader.ts` - Prompt loading and caching
- Source: `src/loaders/resourceLoader.ts` - Resource loading and dynamic matching
- Source: `src/utils/fuzzyMatcher.ts` - Fuzzy matching algorithm
- Source: `src/utils/uriParser.ts` - URI parsing for dynamic resources
- Unit Tests: `tests/unit/promptLoader.test.js`
- Unit Tests: `tests/unit/resourceLoader.test.js`
