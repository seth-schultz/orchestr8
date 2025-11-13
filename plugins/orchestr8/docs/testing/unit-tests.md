# Unit Tests

Comprehensive guide to unit tests in the orchestr8 MCP server. Unit tests validate individual components in isolation with fast, focused test cases.

## Table of Contents

- [Overview](#overview)
- [Test Files](#test-files)
- [Running Unit Tests](#running-unit-tests)
- [Test Components](#test-components)
- [Writing Unit Tests](#writing-unit-tests)
- [Best Practices](#best-practices)

## Overview

Unit tests verify that individual components work correctly in isolation. They are:

- **Fast**: Complete in seconds
- **Isolated**: Test one component at a time
- **Deterministic**: Same input always produces same output
- **Independent**: Can run in any order

### Test Statistics

- **Total Test Suites**: 5
- **Total Assertions**: 150+
- **Execution Time**: ~3-5 seconds
- **Framework**: Node.js native test runner

## Test Files

### Location

All unit tests are located in `tests/unit/`:

```
tests/unit/
├── promptLoader.test.js      # Prompt loading and substitution
├── resourceLoader.test.js    # Resource loading and caching
├── uriParser.test.js         # URI parsing logic
├── fuzzyMatcher.test.js      # Fuzzy matching algorithm
└── (compiled from src/)
    └── indexLookup.test.ts   # Index-based lookup
```

### Test Naming

- Pattern: `*.test.js` or `*.test.ts`
- Named after component being tested
- Located parallel to source files or in `tests/unit/`

## Running Unit Tests

### All Unit Tests

```bash
npm run test:unit
```

### Watch Mode

Auto-rerun tests on file changes:

```bash
npm run test:watch
```

### Single Test File

```bash
node --test tests/unit/promptLoader.test.js
```

### Specific Test

Use the test description to filter:

```bash
node --test tests/unit/promptLoader.test.js --test-name-pattern="should load all prompts"
```

## Test Components

### 1. PromptLoader Tests

**File**: `tests/unit/promptLoader.test.js`

**What It Tests**:
- Loading prompts from directory structure
- Parsing YAML frontmatter metadata
- Argument substitution (`$ARGUMENTS` and `${arg-name}`)
- Content caching
- Category inference from directory
- Error handling for missing files

**Test Coverage**:

```javascript
describe('PromptLoader', () => {
  // Initialization
  it('should initialize with correct path')

  // Loading
  it('should load all prompts from workflows directory')
  it('should load prompt metadata correctly')

  // Argument Substitution
  it('should substitute $ARGUMENTS placeholder with first argument')
  it('should substitute ${argument-name} placeholders')

  // Caching
  it('should cache prompt content')

  // Error Handling
  it('should handle missing category directories gracefully')
})
```

**Example Test**:

```javascript
it('should substitute $ARGUMENTS placeholder with first argument', async () => {
  const loader = new PromptLoader(logger);
  const prompts = await loader.loadAllPrompts();
  const prompt = prompts[0];

  const content = await loader.loadPromptContent(prompt, {
    'task-description': 'Build a REST API'
  });

  assert.ok(content.includes('**Task:** Build a REST API'));
});
```

**Key Assertions**:
- Prompt structure matches expected schema
- Arguments are correctly substituted
- Metadata is parsed from YAML frontmatter
- Cache returns identical content on second load

### 2. ResourceLoader Tests

**File**: `tests/unit/resourceLoader.test.js`

**What It Tests**:
- Loading resources from multiple categories
- URI generation (orchestr8://category/resource)
- MIME type detection
- Content caching
- Parallel directory scanning
- Error handling for missing resources

**Test Coverage**:

```javascript
describe('ResourceLoader', () => {
  // Initialization
  it('should initialize with correct path')

  // Resource Loading
  it('should load all resources from all categories')
  it('should load agent resources with correct URIs')
  it('should load skill resources with correct URIs')
  it('should load example resources with correct URIs')

  // Content Loading
  it('should load resource content correctly')
  it('should cache resource content')

  // Error Handling
  it('should throw error for non-existent resource')
  it('should handle empty resource directories')

  // MIME Types
  it('should generate correct MIME types for markdown files')
})
```

**Example Test**:

```javascript
it('should load agent resources with correct URIs', async () => {
  const loader = new ResourceLoader(logger);
  const resources = await loader.loadAllResources();

  const agent = resources.find(r => r.uri.includes('orchestr8://agents/'));
  assert.ok(agent);
  assert.strictEqual(agent.uri, 'orchestr8://agents/test-agent');
  assert.strictEqual(agent.name, 'test-agent');
  assert.strictEqual(agent.mimeType, 'text/markdown');
  assert.strictEqual(agent.category, 'agents');
});
```

**Key Assertions**:
- Resources loaded from all categories
- URIs follow orchestr8:// protocol format
- Metadata includes name, category, MIME type
- Content is cached after first load
- Errors thrown for invalid URIs

### 3. URIParser Tests

**File**: `tests/unit/uriParser.test.js`

**What It Tests**:
- Static URI parsing (orchestr8://category/resource)
- Dynamic URI parsing (orchestr8://category/match?query=...)
- Query parameter decoding
- URL encoding/decoding
- Error handling for malformed URIs
- Edge cases (empty params, special characters)

**Test Coverage** (450+ lines, 70+ assertions):

```javascript
describe('URIParser', () => {
  describe('Static URI Parsing', () => {
    it('should parse simple static URI with category and resource ID')
    it('should parse static URI with multi-part resource ID')
    it('should parse static URI with different categories')
    it('should throw error for static URI with missing resource ID')
  })

  describe('Dynamic URI Parsing', () => {
    it('should parse dynamic URI with required query parameter')
    it('should parse dynamic URI with all query parameters')
    it('should decode URL-encoded query string')
    it('should parse tags as comma-separated array')
    it('should parse categories as comma-separated array')
    it('should use default maxTokens when not provided')
    it('should throw error for missing query parameter')
  })

  describe('Invalid URI Handling', () => {
    it('should throw error for invalid protocol')
    it('should throw error for missing protocol')
    it('should throw error for empty URI after protocol')
  })

  describe('Edge Cases', () => {
    it('should handle query with special characters')
    it('should handle resource ID with hyphens and underscores')
    it('should handle very long query strings')
    it('should handle maxTokens as zero')
  })
})
```

**Example Test**:

```javascript
it('should parse dynamic URI with all query parameters', () => {
  setup();
  const uri =
    'orchestr8://agents/match?query=typescript+developer&maxTokens=2000&tags=typescript,async&categories=agents,skills';
  const result = parser.parse(uri);

  assert.strictEqual(result.type, 'dynamic');
  assert.strictEqual(result.category, 'agents');
  assert.strictEqual(result.matchParams.query, 'typescript developer');
  assert.strictEqual(result.matchParams.maxTokens, 2000);
  assert.deepStrictEqual(result.matchParams.tags, ['typescript', 'async']);
  assert.deepStrictEqual(result.matchParams.categories, ['agents', 'skills']);
});
```

**Key Assertions**:
- Static URIs parsed into category and resourceId
- Dynamic URIs extract query parameters
- URL encoding properly decoded (+ becomes space, %20 becomes space)
- Tags and categories parsed as arrays
- maxTokens converted to number
- Invalid URIs throw descriptive errors

### 4. FuzzyMatcher Tests

**File**: `tests/unit/fuzzyMatcher.test.js`

**What It Tests**:
- Keyword extraction from queries
- Scoring algorithm (tags, capabilities, useWhen)
- Token budget selection
- Content assembly
- Category filtering
- Required tags enforcement
- Performance characteristics

**Test Coverage** (880+ lines, 60+ assertions):

```javascript
describe('FuzzyMatcher', () => {
  describe('Keyword Extraction', () => {
    it('should extract simple keywords from query')
    it('should convert keywords to lowercase')
    it('should remove stop words')
    it('should filter out single-character words')
    it('should handle special characters')
  })

  describe('Score Calculation', () => {
    it('should give high score for tag matches')
    it('should give points for capability matches')
    it('should give bonus for category match')
    it('should give bonus for smaller resources')
    it('should return zero if required tags are missing')
  })

  describe('Budget Selection', () => {
    it('should select resources within token budget')
    it('should always include top 3 resources even if over budget')
    it('should stop after top 3 if budget 80% used')
  })

  describe('Content Assembly', () => {
    it('should assemble content with proper formatting')
    it('should calculate total tokens')
    it('should order by category priority')
  })

  describe('Match Integration', () => {
    it('should perform complete matching workflow')
    it('should filter by category')
    it('should enforce required tags')
    it('should respect token budget')
  })

  describe('Match Quality', () => {
    it('should rank exact tag matches highest')
    it('should prefer focused resources over general ones')
    it('should combine multiple signal types for ranking')
  })
})
```

**Example Test**:

```javascript
it('should give high score for tag matches', () => {
  setup();
  const resource = createTestResources()[0]; // typescript-developer
  const keywords = ['typescript', 'nodejs'];
  const request = { query: 'typescript nodejs', maxTokens: 3000 };

  const score = matcher.calculateScore(resource, keywords, request);

  // Should get +10 per tag match = 20
  assert.ok(score >= 20);
});
```

**Key Assertions**:
- Keywords extracted and normalized correctly
- Scoring weights applied (tags: 10, capabilities: 8, useWhen: 5)
- Budget selection respects token limits
- Top 3 resources always included
- Content assembled with proper formatting
- Category priority ordering (agents > skills > patterns)

### 5. IndexLookup Tests

**File**: `src/__tests__/indexLookup.test.ts`

**What It Tests**:
- Index loading from JSON files
- Keyword-based scenario matching
- Category filtering
- Result formatting
- Cache functionality
- Performance characteristics

**Test Coverage**:

```typescript
describe('IndexLookup', () => {
  describe('Index Loading', () => {
    it('should load the useWhen index successfully')
  })

  describe('Keyword-based Lookup', () => {
    it('should find matches for common queries')
    it('should handle multi-word queries')
    it('should return compact results under token budget')
  })

  describe('Category Filtering', () => {
    it('should filter by category')
  })

  describe('Cache Functionality', () => {
    it('should cache results')
    it('should clear cache')
  })

  describe('Performance', () => {
    it('should complete lookup in under 100ms (warm cache)')
  })
})
```

**Key Assertions**:
- Index loads successfully
- Queries match relevant scenarios
- Results stay within token budget (50-120 tokens per result)
- Category filtering works correctly
- Cache hits return identical results
- Performance under 100ms for cached lookups

## Writing Unit Tests

### Setup Pattern

Use temporary directories for file-based tests:

```javascript
const { before, after } = require('node:test');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');

describe('ComponentTest', () => {
  let tempDir;

  before(async () => {
    // Create temp directory
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'test-'));

    // Create test files
    await fs.writeFile(
      path.join(tempDir, 'test-file.md'),
      'test content'
    );
  });

  after(async () => {
    // Clean up
    await fs.rm(tempDir, { recursive: true, force: true });
  });
});
```

### Testing Compiled Code

Tests run against compiled JavaScript in `dist/`:

```javascript
// Test the compiled version
const { PromptLoader } = require('../../dist/loaders/promptLoader.js');
const { Logger } = require('../../dist/utils/logger.js');
```

Always rebuild before running tests:

```bash
npm run build && npm run test:unit
```

### Mocking and Fixtures

Create test data in setup:

```javascript
const createTestResources = () => [
  {
    id: 'typescript-developer',
    category: 'agent',
    tags: ['typescript', 'nodejs'],
    capabilities: ['build REST APIs', 'async programming'],
    useWhen: ['Building TypeScript applications'],
    estimatedTokens: 800,
    content: '# TypeScript Developer\n\nExpert in TypeScript.'
  }
];
```

### Assertion Helpers

```javascript
// Array membership
assert.ok(array.includes(expectedValue));

// Array length
assert.strictEqual(array.length, expectedLength);

// Object properties
assert.ok(object.property);
assert.strictEqual(object.property, expectedValue);

// Deep equality
assert.deepStrictEqual(actualObject, expectedObject);

// Error matching with regex
assert.throws(() => {
  dangerousFunction();
}, /Expected error pattern/);

// Async error handling
await assert.rejects(
  async () => await asyncFunction(),
  /Expected error pattern/
);
```

## Best Practices

### 1. Test Structure

Use **Arrange-Act-Assert** pattern:

```javascript
it('should do something', () => {
  // Arrange: Setup test data
  const input = 'test input';
  const expected = 'expected output';

  // Act: Execute the operation
  const result = component.process(input);

  // Assert: Verify the result
  assert.strictEqual(result, expected);
});
```

### 2. Test Naming

Use descriptive "should" statements:

```javascript
// Good
it('should substitute $ARGUMENTS placeholder with first argument')
it('should cache prompt content')
it('should throw error for non-existent resource')

// Bad
it('tests arguments')
it('caching works')
it('errors')
```

### 3. One Concept Per Test

Focus each test on a single behavior:

```javascript
// Good: Each test focuses on one thing
it('should parse static URI')
it('should parse dynamic URI')
it('should throw error for invalid protocol')

// Bad: Tests multiple things
it('should parse URIs and handle errors')
```

### 4. Use Strict Equality

Prefer `strictEqual` over `equal`:

```javascript
// Good
assert.strictEqual(result, 'expected');  // === comparison
assert.deepStrictEqual(obj, expected);   // Deep === comparison

// Avoid
assert.equal(result, 'expected');        // == comparison (coercion)
```

### 5. Test Error Cases

Include negative tests:

```javascript
describe('URIParser', () => {
  // Positive tests
  it('should parse valid URI')

  // Negative tests
  it('should throw error for invalid protocol')
  it('should throw error for missing resource ID')
  it('should throw error for empty query parameter')
});
```

### 6. Avoid Test Interdependence

Each test should be independent:

```javascript
// Good: Each test is self-contained
it('test 1', () => {
  const loader = new Loader();
  // test logic
});

it('test 2', () => {
  const loader = new Loader();
  // test logic
});

// Bad: Tests depend on shared state
let sharedLoader;

it('test 1', () => {
  sharedLoader = new Loader();
  sharedLoader.loadData();
});

it('test 2', () => {
  // Depends on test 1 running first
  const data = sharedLoader.getData();
});
```

### 7. Meaningful Error Messages

Include context in assertions:

```javascript
// Good
assert.ok(
  result.length > 0,
  `Expected result to have content, got length: ${result.length}`
);

// Okay
assert.ok(result.length > 0);
```

### 8. Test Both Sync and Async

```javascript
// Synchronous
it('should parse synchronously', () => {
  const result = parser.parse(uri);
  assert.strictEqual(result.type, 'static');
});

// Asynchronous
it('should load asynchronously', async () => {
  const result = await loader.loadResource(uri);
  assert.ok(result.content);
});
```

## Common Patterns

### Testing Caching

```javascript
it('should cache content', async () => {
  const uri = 'orchestr8://agents/test';

  // First load (cache miss)
  const content1 = await loader.loadContent(uri);

  // Second load (cache hit)
  const content2 = await loader.loadContent(uri);

  // Should return identical content
  assert.strictEqual(content1, content2);
});
```

### Testing Array Operations

```javascript
it('should filter and map correctly', () => {
  const input = [1, 2, 3, 4, 5];
  const result = processor.process(input);

  assert.ok(Array.isArray(result));
  assert.strictEqual(result.length, 3);
  assert.deepStrictEqual(result, [2, 4, 6]);
});
```

### Testing String Manipulation

```javascript
it('should format content correctly', () => {
  const result = formatter.format(data);

  assert.ok(typeof result === 'string');
  assert.ok(result.includes('expected substring'));
  assert.ok(result.length > minLength);
  assert.ok(result.startsWith('prefix'));
});
```

### Testing Object Properties

```javascript
it('should have correct metadata', () => {
  const resource = loader.load('test');

  assert.ok(resource.uri);
  assert.strictEqual(resource.name, 'test');
  assert.strictEqual(resource.category, 'agents');
  assert.ok(Array.isArray(resource.tags));
});
```

## Summary

Unit tests provide fast feedback on individual component behavior:

- **150+ assertions** validate component functionality
- **Test coverage** includes happy path, edge cases, and errors
- **Fast execution** completes in 3-5 seconds
- **Isolation** ensures reliable, repeatable results
- **Node.js native testing** requires no external dependencies

For integration testing, see [Integration Tests](./integration-tests.md).

For performance validation, see [Benchmarks](./benchmarks.md).
