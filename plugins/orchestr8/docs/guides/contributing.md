# Contributing Guide

> Guidelines for contributing to the Orchestr8 MCP project

## Table of Contents

1. [How to Contribute](#how-to-contribute)
2. [Code Style Guidelines](#code-style-guidelines)
3. [Commit Message Conventions](#commit-message-conventions)
4. [Pull Request Process](#pull-request-process)
5. [Testing Requirements](#testing-requirements)
6. [Documentation Requirements](#documentation-requirements)
7. [Adding New Resources](#adding-new-resources)
8. [Adding New Features](#adding-new-features)
9. [Review Process](#review-process)
10. [Community Guidelines](#community-guidelines)

## How to Contribute

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or creating new resources, your contributions are valued.

### Ways to Contribute

- **Report Bugs**: Open an issue with details about the problem
- **Suggest Features**: Propose new features or improvements
- **Fix Issues**: Pick up an existing issue and submit a PR
- **Add Resources**: Contribute new agents, skills, patterns, or examples
- **Improve Documentation**: Fix typos, clarify instructions, add examples
- **Review PRs**: Help review and test pull requests

### Before You Start

1. **Check existing issues**: See if someone else is already working on it
2. **Open an issue**: For major changes, discuss your approach first
3. **Read the docs**: Familiarize yourself with the [Development Guide](./development.md)
4. **Set up your environment**: Follow the [Installation and Setup](./development.md#installation-and-setup)

## Code Style Guidelines

Orchestr8 follows strict TypeScript conventions for code quality and consistency.

### TypeScript Style

#### **General Principles**

- Write clear, readable, maintainable code
- Favor explicit over implicit
- Use descriptive names for variables, functions, and types
- Keep functions small and focused (single responsibility)
- Avoid premature optimization

#### **Naming Conventions**

```typescript
// Classes: PascalCase
class ResourceLoader {}
class FuzzyMatcher {}

// Interfaces and Types: PascalCase with 'I' prefix for interfaces (optional)
interface IResource {}
type ResourceCategory = 'agent' | 'skill' | 'pattern';

// Functions and Methods: camelCase
function loadResource() {}
async function matchResources() {}

// Variables and Constants: camelCase
const maxTokens = 3000;
let currentScore = 0;

// Private members: underscore prefix
private _cache: Map<string, any>;

// Constants (module-level): UPPER_SNAKE_CASE
const DEFAULT_CACHE_SIZE = 200;
const MAX_TOKEN_BUDGET = 5000;
```

#### **Type Annotations**

Always use explicit types for function parameters and return values:

```typescript
// Good
function calculateScore(query: string, tags: string[]): number {
  return query.length + tags.length;
}

// Bad (implicit any)
function calculateScore(query, tags) {
  return query.length + tags.length;
}
```

#### **Interface vs Type**

Use `interface` for object shapes that may be extended:

```typescript
// Use interface for extensible objects
interface Resource {
  id: string;
  category: string;
  content: string;
}

interface AgentResource extends Resource {
  capabilities: string[];
}
```

Use `type` for unions, intersections, and utilities:

```typescript
// Use type for unions and intersections
type ResourceCategory = 'agent' | 'skill' | 'pattern' | 'example';
type ResourceWithMetadata = Resource & { metadata: Metadata };
```

#### **Async/Await**

Always use `async/await` instead of raw promises:

```typescript
// Good
async function loadResources(): Promise<Resource[]> {
  const files = await fs.readdir(path);
  return await Promise.all(files.map(loadResource));
}

// Bad
function loadResources(): Promise<Resource[]> {
  return fs.readdir(path).then(files => {
    return Promise.all(files.map(loadResource));
  });
}
```

#### **Error Handling**

Use try/catch for async operations and proper error types:

```typescript
// Good
async function loadResource(path: string): Promise<Resource> {
  try {
    const content = await fs.readFile(path, 'utf-8');
    return parseResource(content);
  } catch (error) {
    logger.error('Failed to load resource', { path, error });
    throw new ResourceLoadError(`Cannot load resource at ${path}`, { cause: error });
  }
}

// Bad (swallowing errors)
async function loadResource(path: string): Promise<Resource | null> {
  try {
    return parseResource(await fs.readFile(path, 'utf-8'));
  } catch {
    return null;
  }
}
```

#### **Imports**

Organize imports in this order:

```typescript
// 1. Node.js built-ins
import { promises as fs } from 'fs';
import { join } from 'path';

// 2. External dependencies
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import matter from 'gray-matter';

// 3. Internal modules (absolute paths)
import { logger } from './utils/logger.js';
import { FuzzyMatcher } from './utils/fuzzyMatcher.js';

// 4. Types (separate from implementations)
import type { Resource, ResourceMetadata } from './types.js';
```

### Formatting Rules

We use consistent formatting rules:

```typescript
// Indentation: 2 spaces (not tabs)
function example() {
  if (condition) {
    doSomething();
  }
}

// Line length: 100 characters max (soft limit)
const longString =
  'This is a long string that should be broken ' +
  'into multiple lines for readability';

// Semicolons: Always use semicolons
const value = 42;
return value;

// Quotes: Single quotes for strings
const message = 'Hello, world!';

// Template literals: Use for string interpolation
const greeting = `Hello, ${name}!`;

// Object literals: Trailing commas
const options = {
  cache: true,
  timeout: 5000,
};

// Arrays: Trailing commas for multi-line
const items = [
  'item1',
  'item2',
  'item3',
];

// Arrow functions: Explicit return for multi-line
const transform = (value: string): string => {
  return value.toUpperCase();
};

// Arrow functions: Implicit return for single expression
const double = (n: number) => n * 2;
```

### JSDoc Comments

Document public APIs with JSDoc:

```typescript
/**
 * Matches resources based on a fuzzy query
 *
 * @param query - Natural language search query
 * @param options - Matching options
 * @param options.maxTokens - Maximum tokens to include in results (default: 3000)
 * @param options.categories - Filter to specific categories
 * @param options.requiredTags - Tags that must be present
 * @returns Array of matched resources sorted by relevance score
 *
 * @example
 * ```typescript
 * const results = await matcher.match('typescript api patterns', {
 *   maxTokens: 2500,
 *   categories: ['example', 'skill']
 * });
 * ```
 */
async function match(
  query: string,
  options: MatchOptions = {}
): Promise<MatchResult[]> {
  // Implementation
}
```

### ESLint Configuration

We follow these ESLint rules (if ESLint is configured):

```json
{
  "rules": {
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

## Commit Message Conventions

We follow Conventional Commits for clear, semantic commit history.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, or tooling changes

### Scopes

Common scopes in this project:

- `loader`: Prompt or resource loader changes
- `matcher`: Fuzzy matching changes
- `parser`: URI parser changes
- `cache`: Caching logic changes
- `index`: Index building changes
- `types`: Type definition changes
- `resources`: Resource content changes
- `docs`: Documentation changes

### Examples

```bash
# Feature
feat(matcher): add support for tag filtering in fuzzy matching

# Bug fix
fix(loader): handle missing frontmatter in resource files

# Documentation
docs(guides): add troubleshooting guide for common issues

# Refactor
refactor(cache): simplify LRU cache implementation

# Performance
perf(matcher): optimize keyword extraction algorithm

# Test
test(integration): add tests for dynamic resource matching

# Chore
chore(deps): update @modelcontextprotocol/sdk to v1.21.1
```

### Commit Message Guidelines

1. **Use imperative mood**: "add feature" not "added feature"
2. **Keep subject line short**: 50 characters or less
3. **Capitalize subject line**: Start with capital letter
4. **No period at end**: Don't end subject with period
5. **Separate subject and body**: Blank line between them
6. **Explain what and why**: Body explains context and reasoning
7. **Reference issues**: Use "Fixes #123" or "Closes #456"

### Good Commit Examples

```bash
feat(matcher): implement token budget management

Add logic to respect maxTokens parameter in fuzzy matching. The matcher
now ensures results stay within budget by:
- Always including top 3 results
- Adding additional results only if within 80% budget
- Prioritizing highest-scoring resources

This improves relevance while respecting context limits.

Closes #42
```

```bash
fix(loader): handle ENOENT errors gracefully

Previously, missing resource files would crash the server. Now we:
1. Log a warning with the missing file path
2. Return null instead of throwing
3. Allow server to continue operating

Fixes #89
```

## Pull Request Process

### Before Submitting

1. **Create a feature branch**
   ```bash
   git checkout -b feat/my-feature
   # or
   git checkout -b fix/bug-description
   ```

2. **Make your changes**
   - Follow code style guidelines
   - Add tests for new functionality
   - Update documentation as needed

3. **Run tests and verify**
   ```bash
   npm run build
   npm test
   npm run verify
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feat/my-feature
   ```

### Submitting a Pull Request

1. **Open a PR** on GitHub
2. **Fill out the PR template** (if available)
3. **Provide context**:
   - What problem does this solve?
   - What approach did you take?
   - Are there any trade-offs or alternatives?

### PR Title Format

Use the same format as commit messages:

```
feat(matcher): add support for tag filtering
fix(loader): handle missing frontmatter gracefully
docs(guides): add development guide
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Motivation
Why is this change needed? What problem does it solve?

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How was this tested?
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Documentation
- [ ] README updated (if needed)
- [ ] API docs updated (if needed)
- [ ] Examples added (if needed)

## Checklist
- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Commit messages follow conventions
- [ ] Documentation updated
```

### PR Size Guidelines

Keep PRs focused and manageable:

- **Small**: < 200 lines changed (ideal)
- **Medium**: 200-500 lines changed (acceptable)
- **Large**: > 500 lines changed (break into smaller PRs if possible)

## Testing Requirements

All code changes must include appropriate tests.

### Test Coverage

- **New features**: Must have tests covering main functionality
- **Bug fixes**: Must have regression tests
- **Refactoring**: Existing tests must pass
- **Target coverage**: Aim for >80% code coverage

### Types of Tests

#### **1. Unit Tests**

Test individual functions and modules:

```typescript
// tests/unit/matcher.test.js
import { test } from 'node:test';
import assert from 'node:assert';
import { extractKeywords } from '../../dist/utils/fuzzyMatcher.js';

test('extractKeywords removes common words', (t) => {
  const input = 'build a typescript api with authentication';
  const keywords = extractKeywords(input);

  assert.ok(!keywords.includes('a'));
  assert.ok(!keywords.includes('with'));
  assert.ok(keywords.includes('typescript'));
  assert.ok(keywords.includes('authentication'));
});
```

#### **2. Integration Tests**

Test component interactions:

```typescript
// tests/integration/mcp-server.test.js
import { test } from 'node:test';
import assert from 'node:assert';

test('server handles dynamic resource matching', async (t) => {
  const result = await server.getResource(
    'orchestr8://match?query=typescript+api&maxTokens=2000'
  );

  assert.ok(result.content.length > 0);
  assert.ok(result.content.includes('typescript'));
});
```

#### **3. Benchmarks**

Measure performance for critical paths:

```typescript
// tests/benchmarks/matching.bench.js
import { test } from 'node:test';

test('fuzzy matching performance', async (t) => {
  const iterations = 1000;
  const start = Date.now();

  for (let i = 0; i < iterations; i++) {
    await matcher.match('typescript api patterns');
  }

  const avgTime = (Date.now() - start) / iterations;
  console.log(`Average: ${avgTime.toFixed(2)}ms per query`);

  // Assert performance target
  assert.ok(avgTime < 20, `Performance regression: ${avgTime}ms > 20ms`);
});
```

### Running Tests

```bash
# Before submitting PR
npm test              # Run all tests
npm run verify        # Verify structure
npm run benchmark     # Check performance

# During development
npm run test:watch    # Auto-run tests on changes
```

## Documentation Requirements

All contributions should include appropriate documentation.

### What to Document

1. **New Features**
   - Add to relevant guides
   - Update README if user-facing
   - Add JSDoc comments to public APIs
   - Include code examples

2. **API Changes**
   - Update function signatures
   - Update JSDoc comments
   - Document breaking changes
   - Add migration guide if needed

3. **New Resources**
   - Include proper frontmatter
   - Write clear, concise content
   - Add examples where helpful
   - Follow resource guidelines (see below)

4. **Bug Fixes**
   - Document the issue
   - Explain the solution
   - Add comments for tricky code

### Documentation Style

- **Clear and concise**: Get to the point quickly
- **Practical examples**: Show real usage patterns
- **Explain why**: Not just what, but why
- **Consistent formatting**: Follow existing style
- **Code blocks**: Include language identifiers

### Example Documentation

```typescript
/**
 * Fuzzy matcher for semantic resource discovery
 *
 * Matches resources based on semantic similarity to a natural language query.
 * Uses keyword extraction and weighted scoring across tags, capabilities,
 * and use-when scenarios.
 *
 * @example Basic usage
 * ```typescript
 * const matcher = new FuzzyMatcher();
 * const results = await matcher.match('typescript api patterns');
 * console.log(results[0].id); // 'typescript-api-development'
 * ```
 *
 * @example With options
 * ```typescript
 * const results = await matcher.match('python async', {
 *   maxTokens: 2500,
 *   categories: ['example', 'skill'],
 *   requiredTags: ['async']
 * });
 * ```
 */
export class FuzzyMatcher {
  // Implementation
}
```

## Adding New Resources

Resources are the heart of Orchestr8. Follow these guidelines when adding new content.

### Resource Types

1. **Agents** (`resources/agents/`): AI expert personas
2. **Skills** (`resources/skills/`): Specific technical skills
3. **Patterns** (`resources/patterns/`): Design patterns and best practices
4. **Examples** (`resources/examples/`): Code examples and templates
5. **Guides** (`resources/guides/`): How-to guides and setup instructions

### Fragment Structure

Resources should be broken into focused fragments in `` subdirectories:

```
resources/
└── agents/
    ├── typescript-developer.md          # Main resource (optional)
    └── 
        ├── typescript-core.md            # Type system expertise
        ├── typescript-async-patterns.md  # Async patterns
        ├── typescript-testing.md         # Testing practices
        └── typescript-api-development.md # API patterns
```

### Fragment Template

```markdown
---
id: my-fragment
category: agent
tags: [typescript, advanced, patterns]
capabilities:
  - Advanced TypeScript patterns
  - Generic type design
  - Type-safe API development
use-when:
  - Building type-safe libraries or APIs
  - Complex type transformations needed
  - Advanced TypeScript patterns required
estimated-tokens: 800
---

# Fragment Title

## Overview

Brief introduction to what this fragment covers.

## Core Capabilities

- Capability 1
- Capability 2
- Capability 3

## Key Concepts

### Concept 1

Explanation with code examples:

\`\`\`typescript
// Example code
const example: GenericType<T> = {
  value: data
};
\`\`\`

### Concept 2

More explanation and examples.

## Best Practices

1. Practice 1
2. Practice 2
3. Practice 3

## Examples

### Example 1: Common Use Case

\`\`\`typescript
// Practical example
function useCase() {
  // Implementation
}
\`\`\`

## References

- Related documentation
- External resources
```

### Metadata Guidelines

#### **id**
- Unique identifier
- kebab-case format
- Descriptive and specific

#### **category**
- One of: `agent`, `skill`, `pattern`, `example`, `guide`

#### **tags**
- 3-8 relevant tags
- Use lowercase
- Be specific and searchable
- Include technology names, concepts, patterns

#### **capabilities**
- 2-5 specific capabilities
- Start with action verbs
- Be concrete and specific
- What can this fragment help with?

#### **use-when**
- 2-5 scenarios
- When should this fragment be loaded?
- What problems does it solve?
- Be specific about context

#### **estimated-tokens**
- Approximate token count
- Use ~10 tokens per line as rough estimate
- Round to nearest 50

### Content Guidelines

1. **Size**: 500-1500 tokens per fragment (focus on one topic)
2. **Depth**: Go deep on specific topics, don't try to cover everything
3. **Examples**: Include practical, runnable code examples
4. **Clarity**: Write for developers who need quick, actionable guidance
5. **Accuracy**: Ensure code examples work and follow best practices

### Adding a New Fragment

1. **Create the file**
   ```bash
   vim resources/agents/my-fragment.md
   ```

2. **Add frontmatter and content**
   ```markdown
   ---
   id: my-fragment
   category: agent
   tags: [...]
   capabilities: [...]
   use-when: [...]
   estimated-tokens: 800
   ---

   # Content here
   ```

3. **Rebuild indexes**
   ```bash
   npm run build-index
   ```

4. **Test discoverability**
   ```bash
   # Test that it's found by relevant queries
   LOG_LEVEL=debug npm start
   ```

5. **Submit PR**
   - Include the new fragment
   - Updated indexes (if generated)
   - Description of the fragment's purpose

## Adding New Features

### Feature Development Process

1. **Discuss First**: Open an issue to discuss major features
2. **Design**: Document the design and approach
3. **Implement**: Write code following style guidelines
4. **Test**: Add comprehensive tests
5. **Document**: Update relevant documentation
6. **Review**: Submit PR for review

### Feature Checklist

- [ ] Issue created and discussed (for major features)
- [ ] Design documented
- [ ] Code follows style guidelines
- [ ] Unit tests added
- [ ] Integration tests added (if applicable)
- [ ] Benchmarks added (if performance-critical)
- [ ] Documentation updated
- [ ] Examples provided
- [ ] Breaking changes documented (if any)

### Breaking Changes

If your feature introduces breaking changes:

1. **Document thoroughly**: What breaks and why
2. **Provide migration path**: How to upgrade
3. **Version appropriately**: Follow semver
4. **Deprecation period**: Warn before removing (when possible)

## Review Process

### What Reviewers Look For

1. **Code Quality**
   - Follows style guidelines
   - Well-structured and readable
   - Appropriate abstractions
   - No code smells

2. **Testing**
   - Adequate test coverage
   - Tests are meaningful
   - Edge cases covered
   - Tests pass locally

3. **Documentation**
   - Code is well-commented
   - Public APIs documented
   - User-facing docs updated
   - Examples provided

4. **Performance**
   - No obvious performance issues
   - Benchmarks pass (if applicable)
   - Cache usage appropriate

5. **Security**
   - No security vulnerabilities
   - Input validation where needed
   - Error handling appropriate

### Addressing Feedback

- **Be responsive**: Reply to comments promptly
- **Be open**: Consider suggestions seriously
- **Explain**: If you disagree, explain your reasoning
- **Update**: Push changes to the same PR branch
- **Re-request review**: After addressing feedback

### Approval and Merge

- PRs require at least one approval
- All tests must pass
- No unresolved conversations
- Squash and merge for clean history

## Community Guidelines

### Code of Conduct

- **Be respectful**: Treat everyone with respect
- **Be constructive**: Provide helpful, actionable feedback
- **Be patient**: Everyone is learning
- **Be collaborative**: Work together toward the best solution

### Communication

- **Issues**: For bugs, features, and discussions
- **PRs**: For code contributions
- **Discussions**: For questions and community topics

### Getting Help

- **Documentation**: Check existing docs first
- **Issues**: Search for existing issues
- **Ask**: Don't hesitate to ask questions

---

## Summary

- Follow TypeScript style guidelines
- Use Conventional Commits
- Write comprehensive tests
- Document your changes
- Keep PRs focused and small
- Be responsive to feedback
- Follow community guidelines

Thank you for contributing to Orchestr8!

---

**Questions?** Open an issue or refer to the [Development Guide](./development.md).
