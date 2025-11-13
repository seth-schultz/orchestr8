# Fragment Authoring Guide

Fragments are the foundation of the Orchestr8 dynamic expertise system. This guide covers everything you need to create high-quality, discoverable fragments.

## Table of Contents

1. [What is a Fragment?](#what-is-a-fragment)
2. [Fragment Anatomy](#fragment-anatomy)
3. [Frontmatter Best Practices](#frontmatter-best-practices)
4. [Content Guidelines](#content-guidelines)
5. [Token Management](#token-management)
6. [Discoverability Optimization](#discoverability-optimization)
7. [Testing & Validation](#testing--validation)
8. [Common Mistakes](#common-mistakes)

## What is a Fragment?

A **fragment** is a focused, self-contained unit of knowledge (500-1000 tokens) that is:

- **Discoverable:** Found via semantic fuzzy matching based on tags, capabilities, and useWhen scenarios
- **Composable:** Can be combined with other fragments to build complete expertise
- **Efficient:** Loaded just-in-time, only when needed
- **Specialized:** Covers a single topic or area deeply

### Fragment vs Monolithic Content

**❌ Bad: Monolithic approach**
```markdown
python-expert.md (3000 tokens)
- Python fundamentals
- FastAPI development
- Async patterns
- Data science
- Testing
- Deployment

Problem: Always loads 3000 tokens even if user only needs FastAPI knowledge
```

**✅ Good: Fragment approach**
```markdown
python-core.md (600 tokens)
- Language fundamentals
- Type hints
- Common patterns

python-fastapi-dependencies.md (500 tokens)
- FastAPI dependency injection
- Request lifecycle
- Testing with dependencies

python-async-fundamentals.md (450 tokens)
- Async/await basics
- Event loop
- Common patterns

Result: Load only what's needed (600 + 500 = 1100 tokens, 63% savings)
```

## Fragment Anatomy

Every fragment consists of two parts:

### 1. YAML Frontmatter (Metadata)

```yaml
---
id: fragment-unique-identifier
category: agent | skill | pattern | example | guide | workflow
tags: [tag1, tag2, tag3, tag4, tag5]
capabilities:
  - Specific capability 1 with details
  - Specific capability 2 with details
  - Specific capability 3 with details
useWhen:
  - Concrete scenario 1 with context
  - Concrete scenario 2 with context
  - Concrete scenario 3 with context
estimatedTokens: 650
---
```

### 2. Markdown Content

```markdown
# Fragment Title

Brief overview (1-2 sentences).

## Core Concepts

Key principles and fundamentals.

## Practical Application

Concrete examples and code.

## Best Practices

Guidelines and recommendations.

## Common Pitfalls

What to avoid and why.
```

## Frontmatter Best Practices

### ID Naming Convention

**Pattern:** `${category}-${technology}-${specialization}`

**Examples:**
```yaml
# Agent fragments
id: typescript-core
id: typescript-api-development
id: python-fastapi-validation
id: rust-expert-advanced

# Skill fragments
id: error-handling-resilience
id: testing-integration-patterns
id: security-authentication-jwt

# Pattern fragments
id: architecture-microservices
id: event-driven-pubsub
id: database-indexing-strategies
```

**Guidelines:**
- Lowercase with hyphens (kebab-case)
- Start with category or technology
- Include specialization if focused
- Be specific but concise
- Unique across all fragments

### Category Selection

| Category | Use When | Examples |
|----------|----------|----------|
| `agent` | Domain expertise or role | `typescript-core`, `devops-expert-cicd` |
| `skill` | Reusable technique | `testing-unit`, `api-design-rest` |
| `pattern` | Architectural approach | `microservices`, `event-driven-saga` |
| `example` | Concrete code example | `express-jwt-auth`, `docker-multistage-go` |
| `guide` | Step-by-step how-to | `aws-eks-cluster`, `ci-cd-github-actions` |
| `workflow` | Multi-phase execution | `workflow-fix-bug`, `workflow-add-feature` |

### Tag Selection Strategy

**Target:** 5-8 specific tags

**Tag categories to include:**

1. **Primary technology** (typescript, python, rust)
2. **Secondary technologies** (express, fastapi, react)
3. **Domain/area** (api, web, cli, backend)
4. **Patterns/techniques** (async, rest, testing)
5. **Use case descriptors** (authentication, caching, validation)

**❌ Bad tags (too generic):**
```yaml
tags: [programming, development, coding, software, backend]
```

**✅ Good tags (specific and searchable):**
```yaml
tags: [typescript, express, rest-api, middleware, error-handling, backend]
```

**Examples by category:**

**Agent fragments:**
```yaml
# TypeScript core
tags: [typescript, javascript, types, generics, node]

# TypeScript API specialization
tags: [typescript, api, rest, express, backend, middleware]

# Python FastAPI
tags: [python, fastapi, api, async, pydantic, validation]
```

**Skill fragments:**
```yaml
# Error handling
tags: [error-handling, async, resilience, logging, try-catch]

# Testing strategies
tags: [testing, integration, unit-test, mocking, assertions]

# Security authentication
tags: [security, authentication, jwt, oauth, authorization]
```

### Capabilities - Make Them Specific

Capabilities describe **what this fragment enables you to do**.

**Formula:** `${Action} + ${Technology/Context} + ${Specific Details}`

**❌ Bad capabilities (vague):**
```yaml
capabilities:
  - TypeScript knowledge
  - API development
  - Testing
```

**✅ Good capabilities (concrete):**
```yaml
capabilities:
  - TypeScript advanced type system including generics, conditional types, and mapped types
  - REST API design with Express.js middleware patterns and centralized error handling
  - Integration testing with Jest including database mocking and test data management
```

**More examples:**

```yaml
# Agent: Python FastAPI dependencies
capabilities:
  - FastAPI dependency injection system for request-scoped resources
  - Database connection management with async context managers
  - Authentication and authorization using dependency injection
  - Testing FastAPI applications with dependency overrides

# Skill: Error handling resilience
capabilities:
  - Retry strategies with exponential backoff and jitter
  - Circuit breaker pattern implementation for fault isolation
  - Graceful degradation techniques for partial failures
  - Error recovery patterns with compensation logic

# Pattern: Event-driven CQRS
capabilities:
  - Command Query Responsibility Segregation pattern design
  - Event sourcing integration with CQRS
  - Read model projection strategies
  - Eventual consistency handling in distributed systems
```

### UseWhen - Concrete Scenarios

UseWhen describes **specific situations** where this fragment should be loaded.

**Formula:** `${Action} + ${Technology/Context} + ${Specific Requirement}`

**❌ Bad useWhen (too generic):**
```yaml
useWhen:
  - Building APIs
  - Working with TypeScript
  - Need error handling
```

**✅ Good useWhen (specific situations):**
```yaml
useWhen:
  - Designing Express.js REST API with middleware patterns and error handling
  - Implementing TypeScript advanced types for type-safe API contracts
  - Building authentication system with JWT tokens and refresh logic
  - Creating integration tests for API endpoints with database fixtures
```

**More examples:**

```yaml
# Agent: TypeScript API development
useWhen:
  - Building Node.js REST APIs with Express.js and TypeScript
  - Implementing middleware pipeline for request processing
  - Designing type-safe API routes with request/response validation
  - Setting up authentication and authorization middleware
  - Creating error handling middleware with proper status codes

# Skill: Testing integration patterns
useWhen:
  - Writing integration tests for API endpoints with database interactions
  - Testing async operations with proper teardown and cleanup
  - Mocking external services and APIs in integration tests
  - Setting up test fixtures and seeding test databases
  - Implementing test isolation to prevent test interference

# Pattern: Microservices architecture
useWhen:
  - Designing distributed systems with multiple independent services
  - Breaking monolith into service-oriented architecture
  - Implementing service communication patterns and API gateways
  - Planning microservices deployment and orchestration strategy
  - Handling distributed transactions and eventual consistency
```

### Estimated Tokens

**How to calculate:**
```bash
# Method 1: Word count approximation
wc -w fragment.md
# Multiply by 0.75 for token estimate

# Method 2: Use actual token counter
# Count tokens using Claude or GPT tokenizer

# Method 3: Conservative estimate
# 1 token ≈ 0.75 words (English text)
```

**Guidelines:**
- Count **content only** (exclude frontmatter)
- Round to nearest 10 or 50
- Err on high side (better to overestimate)
- Update if content changes significantly

**Target ranges:**
```yaml
# Core fragments
estimatedTokens: 600-750

# Specialized fragments
estimatedTokens: 450-650

# Skill fragments
estimatedTokens: 500-700

# Maximum (any fragment)
estimatedTokens: 1000
```

## Content Guidelines

### Structure

**Standard structure for most fragments:**

```markdown
# Fragment Title

Brief overview describing what this fragment covers (1-2 sentences).

## Core Concepts / Fundamentals

Key principles and foundational knowledge.
- Bullet point 1
- Bullet point 2
- Bullet point 3

## Practical Application / Implementation

Concrete examples with code.

\`\`\`typescript
// Example code
\`\`\`

## Best Practices / Patterns

Guidelines and recommendations.

✅ Do this
❌ Don't do that

## Common Pitfalls / What to Avoid

Mistakes and how to prevent them.

## Related Concepts / See Also

Links to related fragments or topics.
```

### Writing Style

**Be concise:**
- Target 500-1000 tokens
- Every sentence must add value
- Remove fluff and redundancy
- Use bullets for lists

**Be specific:**
- Include concrete examples
- Name actual technologies/tools
- Provide real code snippets
- Use exact terminology

**Be actionable:**
- Focus on practical application
- Show how, not just what
- Include implementation details
- Provide decision criteria

**Be accurate:**
- Verify all code examples
- Use current best practices
- Note version dependencies
- Test before publishing

### Code Examples

**Guidelines:**
- **2-3 examples** per fragment (not more)
- **Concise** (5-20 lines each)
- **Working code** (tested and verified)
- **Well-commented** when needed
- **Multiple languages** if applicable

**❌ Bad example (too long, uncommented):**
```typescript
// 50+ lines of code with no context
```

**✅ Good example (concise, clear):**
```typescript
// FastAPI dependency injection for database
from fastapi import Depends

async def get_db():
    db = Database()
    try:
        yield db
    finally:
        await db.close()

@app.get("/users")
async def get_users(db = Depends(get_db)):
    return await db.query("SELECT * FROM users")
```

**Multi-language examples:**
```typescript
// TypeScript
const retry = async (fn, retries = 3) => {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) return retry(fn, retries - 1);
    throw err;
  }
};
```

```python
# Python
async def retry(fn, retries=3):
    try:
        return await fn()
    except Exception as err:
        if retries > 0:
            return await retry(fn, retries - 1)
        raise
```

### Cross-References

Link to related fragments:

```markdown
## Related Skills

- [Error Handling Patterns](orchestr8://skills/error-handling-resilience)
- [Testing Strategies](orchestr8://skills/testing-integration-patterns)
- [API Security](orchestr8://skills/security-api-security)

## See Also

- Pattern: [Microservices Architecture](orchestr8://patterns/architecture-microservices)
- Example: [Express JWT Auth](orchestr8://examples/express-jwt-auth)
```

## Token Management

### Target Sizes

| Fragment Type | Target Range | Maximum |
|---------------|--------------|---------|
| Core agent | 600-750 tokens | 750 |
| Specialized agent | 450-650 tokens | 650 |
| Skill | 500-700 tokens | 700 |
| Pattern | 600-800 tokens | 800 |
| Example | 300-500 tokens | 500 |
| Any fragment | 500-1000 tokens | 1000 |

### Example Extraction Pattern (Phase 1 Optimization)

**When to extract examples to separate files:**

1. **Fragment exceeds 100 lines** with multiple code examples
2. **Examples consume >30%** of fragment token count
3. **Complex implementations** (>50 lines) that could be referenced
4. **Multiple variations** of same pattern

**Before extraction:**
```markdown
# error-handling-resilience.md (1200 tokens)

## Retry Pattern
Brief explanation...

### TypeScript Implementation
```typescript
// 50 lines of retry implementation
// Multiple variations and edge cases
// Detailed comments
```

### Python Implementation
```python
# 45 lines of Python retry code
# Multiple variations
```

### Go Implementation
```go
// 40 lines of Go retry code
```

## Circuit Breaker Pattern
// Another 60 lines...
```

**After extraction:**
```markdown
# error-handling-resilience.md (680 tokens - 43% reduction)

## Retry Pattern
Brief explanation with key concepts.

**Basic pattern:**
```typescript
// 10-line minimal example showing core concept
async function retry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); }
    catch (err) { if (i === maxRetries - 1) throw err; }
  }
}
```

**See detailed implementations:**
- [TypeScript Retry Patterns](orchestr8://examples/typescript-retry-patterns)
- [Python Retry Patterns](orchestr8://examples/python-retry-patterns)
- [Go Retry Patterns](orchestr8://examples/go-retry-patterns)

## Circuit Breaker Pattern
// Concise explanation with minimal example...
```

**Example files:**
```markdown
# examples/typescript-retry-patterns.md (450 tokens)
Complete TypeScript retry implementations:
- Basic retry with exponential backoff
- Advanced retry with jitter
- Conditional retry with error types
- Integration with circuit breaker
```

**Token savings calculation:**
```
Original: 1200 tokens (always loaded)
Optimized: 680 tokens (core) + 450 tokens (on-demand examples)
Savings: 43% for users who don't need detailed examples
Load time: 520 tokens saved when examples not needed
```

### Example File Naming Conventions

**Pattern:** `${language-or-framework}-${pattern-name}.md`

**Examples:**
- `typescript-retry-patterns.md`
- `python-async-context-managers.md`
- `express-middleware-patterns.md`
- `fastapi-dependency-injection.md`
- `docker-multistage-builds.md`

**Frontmatter for example files:**
```yaml
---
id: typescript-retry-patterns
category: example
tags: [typescript, retry, error-handling, resilience, async]
capabilities:
  - Complete retry pattern implementations in TypeScript
  - Exponential backoff with jitter strategies
  - Error classification and conditional retry logic
useWhen:
  - Implementing retry logic in TypeScript applications
  - Need detailed retry pattern implementations with variations
  - Building resilient async operations with proper error handling
estimatedTokens: 450
relatedTo:
  - error-handling-resilience  # Main skill fragment
  - typescript-async-patterns  # Related agent
---
```

### Progressive Loading Pattern (Phase 3 Optimization)

**Splitting fragments into core + advanced modules:**

**When to use progressive loading:**
1. Fragment has clear **always-needed** vs **sometimes-needed** split
2. Advanced content is >40% of total tokens
3. Most queries need only core concepts
4. Advanced topics are independent from core

**Example: Python Async Programming**

**Before (monolithic):**
```markdown
# python-async-fundamentals.md (1400 tokens)
- Async/await basics (400 tokens) ← Always needed
- Event loop internals (300 tokens) ← Always needed
- Advanced concurrency patterns (400 tokens) ← Sometimes needed
- Context managers (350 tokens) ← Sometimes needed
```

**After (progressive):**
```markdown
# python-async-fundamentals.md (700 tokens - Core)
---
id: python-async-fundamentals
estimatedTokens: 700
advancedTopics:
  - orchestr8://agents/python-async-concurrency
  - orchestr8://agents/python-async-context-managers
---

Core async/await concepts and event loop basics.

**For advanced topics:**
- [Advanced Concurrency Patterns](orchestr8://agents/python-async-concurrency)
- [Async Context Managers](orchestr8://agents/python-async-context-managers)

# python-async-concurrency.md (400 tokens - Advanced)
---
id: python-async-concurrency
prerequisite: [python-async-fundamentals]
estimatedTokens: 400
---

Advanced concurrency patterns (loaded only when needed).

# python-async-context-managers.md (350 tokens - Advanced)
---
id: python-async-context-managers
prerequisite: [python-async-fundamentals]
estimatedTokens: 350
---

Async context manager patterns (loaded only when needed).
```

**Token efficiency:**
```
Generic query "python async": Load core only (700 tokens)
Specific query "python async concurrency": Load core + concurrency (1100 tokens)
Specific query "python async context managers": Load core + context (1050 tokens)

Average savings: 50% for generic queries
```

**Using prerequisite field:**
```yaml
---
id: advanced-module
category: agent
prerequisite: [core-module-id]  # Ensures core loads first
estimatedTokens: 450
---
```

### When to Split

**Split a fragment if:**
- Size exceeds 1000 tokens
- Covers multiple distinct topics
- Contains multiple specializations
- Only part is relevant for most queries

**How to split:**

```markdown
# Before: python-expert.md (2000 tokens)
All Python knowledge in one file

# After: Split into focused fragments
python-core.md (650 tokens)
├─ Language fundamentals
├─ Type system
└─ Common patterns

python-fastapi-dependencies.md (500 tokens)
├─ Dependency injection
├─ Request lifecycle
└─ Testing

python-async-fundamentals.md (450 tokens)
├─ Async/await
├─ Event loop
└─ Error handling
```

### Reducing Token Count

**Strategies:**

1. **Remove redundancy**
   ```markdown
   ❌ "TypeScript is a programming language that adds types to JavaScript..."
   ✅ "TypeScript adds static typing to JavaScript"
   ```

2. **Condense examples**
   ```markdown
   ❌ 30-line code example
   ✅ 10-line code example with comments
   ```

3. **Use bullets instead of prose**
   ```markdown
   ❌ Paragraph explaining three concepts
   ✅ Three bulleted concepts
   ```

4. **Move details to examples**
   ```markdown
   ❌ Detailed implementation in fragment
   ✅ Link to example fragment with full implementation
   ```

## Discoverability Optimization

### Metadata is Critical

**Discoverability depends on:**
1. **Tags** (40% weight) - Must match common search terms
2. **Capabilities** (30% weight) - Describe what fragment enables
3. **UseWhen** (30% weight) - Match user intent/scenarios

### Tag Selection for SEO

Think about **how users will search**:

**Example: TypeScript API fragment**

**User queries:**
- "typescript api"
- "express rest api"
- "node backend typescript"
- "typescript middleware"

**Optimal tags:**
```yaml
tags: [typescript, express, api, rest, backend, middleware, node]
```

**Why these work:**
- Direct matches for common queries
- Mix of technology and domain terms
- Specific enough to avoid noise
- Cover variations (api/rest, express/node)

### Capability Clarity

Capabilities should be **searchable phrases**:

**❌ Not searchable:**
```yaml
capabilities:
  - Advanced TypeScript
```

**✅ Searchable:**
```yaml
capabilities:
  - TypeScript advanced type system including generics, conditional types, and mapped types for building type-safe APIs
```

Why? Users search for "typescript generics api" or "conditional types", which matches the detailed capability.

### UseWhen Specificity

UseWhen should match **user intent**:

**Think about the user's mental model:**
- What are they trying to build?
- What problem are they solving?
- What technologies are they using?
- What is their specific context?

**Example:**

**❌ Generic (won't match):**
```yaml
useWhen:
  - Building APIs
```

**✅ Specific (will match):**
```yaml
useWhen:
  - Building Node.js REST API with Express.js and TypeScript
  - Implementing Express middleware pipeline for authentication and validation
  - Designing type-safe API routes with Zod schema validation
```

## Testing & Validation

### Discovery Testing

Test that your fragment is discoverable:

**Method 1: Using MCP UI**
```bash
# Launch MCP UI
/orchestr8:mcp-ui

# Test queries in the UI:
orchestr8://match?query=typescript+api&categories=agent
orchestr8://match?query=express+middleware&categories=agent,skill
orchestr8://match?query=rest+api+typescript&minScore=20
```

**Method 2: Using MCP Resources**
```markdown
Load resource and check if your fragment appears:
orchestr8://agents/match?query=typescript+api+development
orchestr8://skills/match?query=error+handling+async
orchestr8://patterns/match?query=microservices+architecture
```

**Create test queries (4-6 per fragment):**

```markdown
# For: typescript-api-development

Test queries:
1. "typescript api" → Should match (core terms)
2. "express rest api" → Should match (technology specific)
3. "node backend typescript" → Should match (domain terms)
4. "typescript middleware patterns" → Should match (specific feature)
5. "api error handling typescript" → Should match (use case)
6. "graphql typescript" → Should NOT match (different specialization)
```

### Validation Checklist

Before committing:

**Metadata validation:**
- [ ] ID follows convention: `${category}-${tech}-${specialization}`
- [ ] Category is correct
- [ ] 5-8 specific tags (not generic)
- [ ] 3-6 concrete capabilities (not vague)
- [ ] 3-6 specific useWhen scenarios
- [ ] Accurate token count (±10%)

**Content validation:**
- [ ] 500-1000 tokens (appropriate for type)
- [ ] Single focused topic
- [ ] 2-3 code examples (tested)
- [ ] Best practices included
- [ ] Common pitfalls documented
- [ ] No duplication with existing fragments

**Discovery validation:**
- [ ] Tested with 4-6 relevant queries
- [ ] Appears in top 3 results for core queries
- [ ] Does NOT appear for unrelated queries
- [ ] Unique value compared to similar fragments

**Technical validation:**
- [ ] Code examples work
- [ ] No syntax errors
- [ ] Framework versions noted if relevant
- [ ] Links and cross-references valid

## Common Mistakes

### 1. Generic Metadata

**❌ Problem:**
```yaml
tags: [programming, development, backend]
capabilities:
  - Programming knowledge
useWhen:
  - Building applications
```

**✅ Solution:**
```yaml
tags: [typescript, express, api, rest, middleware, backend]
capabilities:
  - TypeScript Express.js REST API development with middleware
useWhen:
  - Building Node.js REST APIs with Express and TypeScript
```

### 2. Fragment Too Large

**❌ Problem:**
```markdown
typescript-expert.md (2500 tokens)
- Everything about TypeScript
```

**✅ Solution:**
```markdown
Split into focused fragments:
- typescript-core.md (650 tokens)
- typescript-api-development.md (500 tokens)
- typescript-async-patterns.md (450 tokens)
```

### 3. Weak UseWhen

**❌ Problem:**
```yaml
useWhen:
  - Using TypeScript
  - Building APIs
  - Need error handling
```

**✅ Solution:**
```yaml
useWhen:
  - Designing Express.js REST API with TypeScript and middleware patterns
  - Implementing type-safe API routes with Zod schema validation
  - Building authentication middleware with JWT and refresh tokens
```

### 4. Poor Code Examples

**❌ Problem:**
```typescript
// 100 lines of uncommented code
// No context
// Not tested
```

**✅ Solution:**
```typescript
// FastAPI dependency injection for database connection
from fastapi import Depends

async def get_db():
    """Create database connection for request lifecycle"""
    db = await Database.connect()
    try:
        yield db
    finally:
        await db.disconnect()
```

### 5. Wrong Category

**❌ Problem:**
```yaml
# Technique but marked as agent
id: error-handling
category: agent
```

**✅ Solution:**
```yaml
# Technique should be skill
id: error-handling-resilience
category: skill
```

### 6. No Testing

**❌ Problem:**
- Create fragment
- Commit immediately
- Fragment not discoverable

**✅ Solution:**
- Create fragment
- Test with 4-6 queries
- Optimize metadata if needed
- Verify discoverability
- Then commit

### 7. Duplicate Content

**❌ Problem:**
- Create `typescript-error-handling`
- Already exists: `error-handling-resilience` with TS examples

**✅ Solution:**
- Search existing fragments first
- Reference existing instead of duplicate
- Add language-specific details to existing if needed
- Or create truly differentiated fragment

## Quick Reference

### Fragment Creation Workflow

```markdown
1. Plan
   - Define scope and purpose
   - Check for existing similar fragments
   - Determine target size (500-1000 tokens)

2. Create
   - Copy template
   - Write rich metadata (5-8 tags, 3-6 capabilities/useWhen)
   - Write focused content with examples
   - Count tokens

3. Test
   - Create 4-6 test queries
   - Verify discoverability
   - Optimize metadata if needed

4. Validate
   - Run through checklist
   - Verify code examples
   - Check for duplicates

5. Deploy
   - Save to resources/*/\
   - Index rebuilds automatically
   - Commit with descriptive message
```

### Metadata Template

```yaml
---
id: ${category}-${technology}-${specialization}
category: agent | skill | pattern | example | guide | workflow
tags: [primary-tech, secondary-tech, domain, pattern, use-case, keyword6, keyword7]
capabilities:
  - ${Action} + ${Technology} + ${Specific Details}
  - ${Action} + ${Technology} + ${Specific Details}
  - ${Action} + ${Technology} + ${Specific Details}
useWhen:
  - ${Action} + ${Context} + ${Specific Requirement}
  - ${Action} + ${Context} + ${Specific Requirement}
  - ${Action} + ${Context} + ${Specific Requirement}
estimatedTokens: ${calculated-count}
---
```

## Next Steps

- Review [Agent Creation Guide](./agents.md) for agent-specific guidance
- Review [Skill Creation Guide](./skills.md) for skill-specific guidance
- Use [Fragment Template](./templates/fragment-template.md) to get started
- See [Best Practices](./best-practices.md) for comprehensive guidelines
- Test your fragments using `/orchestr8:mcp-ui`
