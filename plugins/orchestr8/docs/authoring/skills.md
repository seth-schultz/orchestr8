# Skill Creation Guide

Skills represent reusable techniques and methodologies. This guide covers creating effective skill fragments for the Orchestr8 dynamic expertise system.

## Table of Contents

1. [What is a Skill?](#what-is-a-skill)
2. [Skill vs Agent vs Pattern](#skill-vs-agent-vs-pattern)
3. [Skill Scope and Focus](#skill-scope-and-focus)
4. [Creating Skill Fragments](#creating-skill-fragments)
5. [Reusability Patterns](#reusability-patterns)
6. [Skill Composition](#skill-composition)
7. [Testing Skills](#testing-skills)
8. [Examples & Patterns](#examples--patterns)

## What is a Skill?

A **skill** represents **HOW to do** something - reusable techniques, methodologies, and practices that can be applied across different technologies and contexts.

**Skills answer:**
- HOW do I implement this technique?
- HOW do I handle this concern?
- HOW do I apply this methodology?
- HOW do I solve this common problem?

**Examples:**
- `error-handling-resilience` - How to handle errors with resilience patterns
- `testing-integration-patterns` - How to write integration tests
- `security-authentication-jwt` - How to implement JWT authentication
- `api-design-rest` - How to design REST APIs
- `performance-optimization` - How to optimize performance

**Key characteristics:**
- **Technique-focused:** Describes HOW to accomplish something
- **Technology-agnostic or multi-tech:** Often applicable across languages/frameworks
- **Reusable:** Can be applied in many contexts
- **Practical:** Focuses on implementation and application
- **Cross-cutting:** Often addresses cross-cutting concerns

## Skill vs Agent vs Pattern

### Skill: HOW (Technique/Method)

**Create a skill for:**
- Implementation techniques applicable across technologies
- Cross-cutting concerns (logging, error handling, security)
- Methodologies and practices
- "How-to" knowledge

**Examples:**
```yaml
# Skill fragments
error-handling-resilience
testing-integration-patterns
security-authentication-jwt
api-design-rest
performance-optimization
git-workflow
observability-structured-logging
deployment-zero-downtime
```

### Agent: WHO (Domain Expertise)

**Create an agent for:**
- Technology-specific expertise
- Role-based knowledge
- Platform/framework specialization

**Examples:**
```yaml
# Agent fragments (NOT skills)
typescript-api-development
python-fastapi-validation
rust-expert-core
devops-expert-cicd
```

### Pattern: WHY/WHEN (Architecture)

**Create a pattern for:**
- Architectural approaches
- System design decisions
- Strategic patterns

**Examples:**
```yaml
# Pattern fragments (NOT skills)
architecture-microservices
event-driven-cqrs
database-indexing-strategies
autonomous-organization
```

### Decision Tree

```
Is this about HOW to do something?
├─ YES → Is it technology-specific?
│  ├─ YES → Agent (technology-specific HOW)
│  │  └─ Example: typescript-api-development
│  └─ NO → Skill (cross-technology HOW)
│     └─ Example: error-handling-resilience
└─ NO → Is it about system architecture?
   ├─ YES → Pattern
   │  └─ Example: microservices
   └─ NO → Agent (domain expertise)
      └─ Example: python-core
```

**Examples of the distinction:**

```markdown
Scenario: Authentication with JWT

Agent: typescript-api-development
└─ TypeScript-specific implementation with Express.js

Skill: security-authentication-jwt
└─ JWT authentication technique (language-agnostic)

Pattern: security-auth-oauth
└─ OAuth architectural approach


Scenario: Error Handling

Agent: python-fastapi-error-handling
└─ FastAPI-specific error handling with exception handlers

Skill: error-handling-resilience
└─ Resilience patterns (retry, circuit breaker, fallback)

Pattern: event-driven-saga
└─ Saga pattern for distributed transaction error handling
```

## Skill Scope and Focus

### Single Technique Rule

**Each skill should focus on ONE technique or closely related set of techniques.**

**❌ Bad scope (too broad):**
```yaml
id: backend-development
# Covers: APIs, databases, caching, queuing, auth, testing
# Problem: Too many unrelated techniques
```

**✅ Good scope (focused):**
```yaml
id: api-design-rest
# Covers: REST API design principles, HTTP methods, resource naming
# Focused on single technique
```

### Size Guidelines

**Target:** 500-700 tokens
**Maximum:** 1000 tokens

**If exceeding 700 tokens:**
- Split into related skills
- Remove redundant content
- Focus on core technique
- Move examples to example fragments

### Depth vs Breadth

**Skills should be:**
- **Deep enough:** Provide actionable implementation guidance
- **Focused enough:** Cover single technique thoroughly
- **Broad enough:** Show variations and contexts

**Example: Error Handling Resilience**

```markdown
✅ Right depth:
├─ Retry patterns with exponential backoff
├─ Circuit breaker implementation
├─ Fallback strategies
├─ Timeout handling
└─ Code examples in 2-3 languages

❌ Too shallow:
└─ "Use try-catch and retry on failure"

❌ Too broad:
├─ All error handling approaches
├─ Logging strategies
├─ Monitoring and alerting
├─ Recovery procedures
└─ Post-mortem analysis
```

## Creating Skill Fragments

### Skill Structure Template

```markdown
---
id: ${technique}-${context}
category: skill
tags: [technique, domain, use-case, tech1, tech2]
capabilities:
  - ${Technique} implementation with ${specific-approach}
  - ${Specific-capability} with ${technology/context}
  - ${Application} in ${scenario} with ${details}
useWhen:
  - ${Action} requiring ${technique} with ${specific-context}
  - ${Scenario} needing ${approach} for ${outcome}
  - ${Problem} solved with ${technique} in ${context}
estimatedTokens: 600
---

# Skill Title

Brief overview of technique and when to use it.

## Technique Overview

What this technique is and why it's useful.

## When to Use

Specific scenarios where this technique applies.

## Implementation

### Approach 1
Code example and explanation.

### Approach 2
Alternative implementation.

## Best Practices

✅ Do this
✅ Do that

❌ Don't do this
❌ Don't do that

## Common Pitfalls

What to avoid and why.

## Examples

### Language/Framework 1
\`\`\`language
code example
\`\`\`

### Language/Framework 2
\`\`\`language
code example
\`\`\`

## Related Skills

- [Related Skill 1](orchestr8://skills/related-1)
- [Related Skill 2](orchestr8://skills/related-2)
```

### Metadata Best Practices

**ID Naming:**
```yaml
# Pattern: ${technique}-${context}
id: error-handling-resilience
id: testing-integration-patterns
id: security-authentication-jwt
id: performance-api-optimization
id: deployment-zero-downtime
```

**Tags (5-7 tags):**
```yaml
# Include:
# 1. Technique name
# 2. Domain/area
# 3. Use cases (2-3)
# 4. Related technologies (optional)

tags: [error-handling, resilience, retry, circuit-breaker, fault-tolerance]
tags: [testing, integration, api, mocking, assertions]
tags: [security, authentication, jwt, oauth, authorization]
```

**Capabilities (3-5 capabilities):**
```yaml
# Focus on what the skill enables

capabilities:
  - Retry strategies with exponential backoff and jitter for transient failures
  - Circuit breaker pattern implementation for fault isolation
  - Graceful degradation techniques for partial system failures
  - Timeout handling with deadline propagation across service boundaries
```

**UseWhen (3-5 scenarios):**
```yaml
# Describe concrete situations

useWhen:
  - Implementing resilient API calls to external services with retry logic
  - Building fault-tolerant microservices with circuit breaker patterns
  - Handling transient network failures with exponential backoff
  - Creating robust systems that gracefully degrade under load
```

## Reusability Patterns

### Multi-Language Skills

**Many skills are language-agnostic - provide examples in multiple languages.**

**Example: Error Handling Resilience**

```markdown
## Retry with Exponential Backoff

### TypeScript
\`\`\`typescript
async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
}
\`\`\`

### Python
\`\`\`python
async def retry(fn, max_retries=3, base_delay=1.0):
    for i in range(max_retries):
        try:
            return await fn()
        except Exception as error:
            if i == max_retries - 1:
                raise
            delay = base_delay * (2 ** i)
            await asyncio.sleep(delay)
\`\`\`

### Go
\`\`\`go
func Retry[T any](fn func() (T, error), maxRetries int) (T, error) {
    var result T
    for i := 0; i < maxRetries; i++ {
        result, err := fn()
        if err == nil {
            return result, nil
        }
        if i == maxRetries-1 {
            return result, err
        }
        time.Sleep(time.Second * time.Duration(math.Pow(2, float64(i))))
    }
    return result, fmt.Errorf("max retries exceeded")
}
\`\`\`
```

### Framework-Specific Skills

**Some skills are tied to specific frameworks but still represent HOW.**

**Example: Testing Integration Patterns**

```markdown
## Database Test Fixtures

### Jest (Node.js)
\`\`\`typescript
beforeEach(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

afterEach(async () => {
  await db.migrate.rollback();
});
\`\`\`

### Pytest (Python)
\`\`\`python
@pytest.fixture
async def db():
    await run_migrations()
    await seed_database()
    yield database
    await rollback_migrations()
\`\`\`

### Testing (Rust)
\`\`\`rust
#[tokio::test]
async fn test_with_db() {
    let db = setup_test_db().await;
    // test code
    teardown_test_db(db).await;
}
\`\`\`
```

### Domain-Specific Skills

**Skills can be specialized for domains while remaining technique-focused.**

**Example: Performance API Optimization**

```markdown
## Caching Strategies

### Response Caching
\`\`\`typescript
app.get("/users/:id", cache({ ttl: 300 }), async (req, res) => {
  const user = await userService.findById(req.params.id);
  res.json(user);
});
\`\`\`

### Database Query Caching
\`\`\`typescript
const getUser = memoize(
  async (id: string) => db.query("SELECT * FROM users WHERE id = $1", [id]),
  { ttl: 300 }
);
\`\`\`

### Content Negotiation
\`\`\`typescript
app.get("/data", async (req, res) => {
  if (req.accepts("json")) {
    res.json(data);
  } else if (req.accepts("xml")) {
    res.type("xml").send(toXML(data));
  }
});
\`\`\`
```

## Skill Composition

### Complementary Skills

**Skills often work together - reference related skills.**

```markdown
Skill: api-design-rest
├─ Related: error-handling-api-patterns
├─ Related: security-api-security
├─ Related: performance-api-optimization
└─ Related: api-documentation-patterns

Skill: testing-integration-patterns
├─ Related: testing-unit
├─ Related: testing-e2e-best-practices
├─ Related: testing-strategies
└─ Related: git-workflow
```

### Skill Chains

**Some workflows require multiple skills in sequence:**

```markdown
Workflow: Building Resilient API

Step 1: API Design
└─ Load: api-design-rest

Step 2: Error Handling
└─ Load: error-handling-resilience

Step 3: Security
└─ Load: security-authentication-jwt

Step 4: Observability
└─ Load: observability-structured-logging

Step 5: Performance
└─ Load: performance-api-optimization
```

### Skill Hierarchies (Phase 2 Optimization)

**Skills can have parent-child relationships with cross-references:**

```markdown
Parent: testing-strategies (600 tokens)
├─ Overview of testing approaches
├─ When to use each type
├─ relatedTo: [testing-unit, testing-integration-patterns, testing-e2e-best-practices]
│
├─ Child: testing-unit (550 tokens)
│  ├─ prerequisite: [testing-strategies]
│  ├─ relatedTo: [testing-integration-patterns, testing-strategies]
│
├─ Child: testing-integration-patterns (650 tokens)
│  ├─ prerequisite: [testing-strategies, testing-unit]
│  ├─ relatedTo: [testing-e2e-best-practices, testing-unit]
│
├─ Child: testing-e2e-best-practices (580 tokens)
│  ├─ prerequisite: [testing-strategies]
│  ├─ relatedTo: [testing-integration-patterns]
│
└─ Child: testing-performance (520 tokens)
   ├─ prerequisite: [testing-strategies]
   ├─ relatedTo: [performance-optimization, performance-profiling-techniques]

Parent: security (500 tokens - Overview)
├─ Security principles and overview
├─ relatedTo: [security-authentication-jwt, security-api-security, security-input-validation]
│
├─ Child: security-authentication-jwt (620 tokens)
│  ├─ prerequisite: [security]
│  ├─ relatedTo: [security-authentication-oauth, security-api-security]
│
├─ Child: security-authentication-oauth (680 tokens)
│  ├─ prerequisite: [security]
│  ├─ relatedTo: [security-authentication-jwt, security-api-security]
│
├─ Child: security-api-security (600 tokens)
│  ├─ prerequisite: [security]
│  ├─ relatedTo: [security-authentication-jwt, security-input-validation]
│
└─ Child: security-input-validation (540 tokens)
   ├─ prerequisite: [security]
   ├─ relatedTo: [security-api-security, error-handling-validation]
```

**Implementing skill families in frontmatter:**

```yaml
# Parent skill
---
id: testing-strategies
category: skill
tags: [testing, strategies, unit, integration, e2e, performance]
capabilities:
  - Overview of testing approaches and when to use each
  - Testing strategy selection based on project needs
  - Balancing test types in testing pyramid
useWhen:
  - Planning testing strategy for a project
  - Deciding which types of tests to implement
  - Understanding testing trade-offs
estimatedTokens: 600
relatedTo:
  - testing-unit
  - testing-integration-patterns
  - testing-e2e-best-practices
---

# Child skill
---
id: testing-integration-patterns
category: skill
tags: [testing, integration, api, mocking, fixtures, test-isolation]
prerequisite: [testing-strategies, testing-unit]
relatedTo:
  - testing-unit
  - testing-e2e-best-practices
  - testing-strategies
capabilities:
  - Integration test structure with database fixtures
  - Test isolation strategies preventing test interference
  - External service mocking and stubbing
useWhen:
  - Writing integration tests for API endpoints with database
  - Testing async operations with proper setup and teardown
  - Mocking external services in integration tests
estimatedTokens: 650
---
```

**Token efficiency with hierarchies:**
```
Query "testing overview": Load parent only (600 tokens)
Query "integration testing": Load parent + child (1250 tokens)
Query "testing strategies unit integration": Load parent + 2 children (1800 tokens)

Savings: 50-60% when only high-level overview needed
```

## Testing Skills

### Discovery Testing

**Skills should be discoverable by technique name and use case.**

**Example: Error Handling Resilience**

```markdown
Test queries (should match):
✅ "error handling"
✅ "resilience patterns"
✅ "retry logic"
✅ "circuit breaker"
✅ "fault tolerance"
✅ "error recovery"

Should NOT match:
❌ "typescript errors" (too technology-specific → agent)
❌ "system architecture" (wrong category → pattern)
❌ "logging" (different skill)
```

### Effectiveness Testing

**Test with real scenarios:**

```markdown
Scenario: Building API with resilience

1. Query: "api error handling resilience"
   Expected: error-handling-resilience + api-design-rest

2. Query: "retry failed requests"
   Expected: error-handling-resilience

3. Query: "circuit breaker pattern"
   Expected: error-handling-resilience

4. Query: "fault tolerant system"
   Expected: error-handling-resilience + other resilience skills
```

### Testing Process

```bash
# 1. Launch MCP UI
/orchestr8:mcp-ui

# 2. Test technique queries
orchestr8://skills/match?query=error+handling

# 3. Test use-case queries
orchestr8://skills/match?query=retry+failed+requests

# 4. Test cross-domain queries
orchestr8://skills/match?query=api+resilience

# 5. Verify complementary loading
orchestr8://match?query=resilient+api&categories=skill,pattern
```

## Examples & Patterns

### Example 1: Cross-Cutting Concern

```markdown
---
id: error-handling-resilience
category: skill
tags: [error-handling, resilience, retry, circuit-breaker, fault-tolerance]
capabilities:
  - Retry strategies with exponential backoff and jitter
  - Circuit breaker pattern for fault isolation
  - Graceful degradation techniques for partial failures
  - Timeout handling with deadline propagation
useWhen:
  - Implementing resilient API calls to external services
  - Building fault-tolerant microservices with circuit breakers
  - Handling transient network failures with retry logic
  - Creating systems that gracefully degrade under load
estimatedTokens: 680
---

# Error Handling: Resilience Patterns

Techniques for building resilient systems that handle failures gracefully.

## Retry Strategies

### Exponential Backoff
\`\`\`typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      const jitter = Math.random() * 1000;
      await sleep(delay + jitter);
    }
  }
  throw new Error("Unreachable");
}
\`\`\`

## Circuit Breaker Pattern

\`\`\`typescript
class CircuitBreaker {
  private failures = 0;
  private state: "closed" | "open" | "half-open" = "closed";

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      throw new Error("Circuit breaker is open");
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failures = 0;
    this.state = "closed";
  }

  private onFailure() {
    this.failures++;
    if (this.failures >= 5) {
      this.state = "open";
      setTimeout(() => (this.state = "half-open"), 60000);
    }
  }
}
\`\`\`

## Best Practices

✅ Add jitter to retry delays (prevent thundering herd)
✅ Use circuit breakers for cascading failures
✅ Implement timeout propagation
✅ Provide fallback mechanisms
✅ Log failures for monitoring

❌ Retry indefinitely without backoff
❌ Ignore circuit breaker state
❌ Use fixed retry delays
❌ Fail completely instead of degrading

## Related Skills

- [Error Handling: API Patterns](orchestr8://skills/error-handling-api-patterns)
- [Observability: Structured Logging](orchestr8://skills/observability-structured-logging)
- [Performance: API Optimization](orchestr8://skills/performance-api-optimization)
```

### Example 2: Methodology Skill

```markdown
---
id: testing-integration-patterns
category: skill
tags: [testing, integration, api, mocking, fixtures, test-isolation]
capabilities:
  - Integration test structure with database fixtures
  - Test isolation strategies preventing test interference
  - External service mocking and stubbing
  - Test data management and cleanup
useWhen:
  - Writing integration tests for API endpoints with database
  - Testing async operations with proper setup and teardown
  - Mocking external services in integration tests
  - Ensuring test isolation and preventing test pollution
estimatedTokens: 650
---

# Testing: Integration Patterns

Patterns for writing effective integration tests with database and external services.

## Test Structure

### Setup and Teardown
\`\`\`typescript
describe("User API", () => {
  let db: Database;

  beforeAll(async () => {
    db = await setupTestDatabase();
  });

  beforeEach(async () => {
    await db.migrate.latest();
    await seedTestData(db);
  });

  afterEach(async () => {
    await db.migrate.rollback();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it("creates user", async () => {
    const response = await request(app)
      .post("/users")
      .send({ name: "John", email: "john@example.com" });

    expect(response.status).toBe(201);
    const user = await db("users").where({ id: response.body.id }).first();
    expect(user.name).toBe("John");
  });
});
\`\`\`

## Test Isolation

### Transaction Rollback
\`\`\`typescript
beforeEach(async () => {
  await db.raw("BEGIN");
});

afterEach(async () => {
  await db.raw("ROLLBACK");
});
\`\`\`

## Mocking External Services

### HTTP Mock
\`\`\`typescript
import nock from "nock";

beforeEach(() => {
  nock("https://api.external.com")
    .get("/users/123")
    .reply(200, { id: 123, name: "External User" });
});

afterEach(() => {
  nock.cleanAll();
});
\`\`\`

## Best Practices

✅ Use test database separate from development
✅ Reset database state between tests
✅ Mock external services consistently
✅ Use factories for test data
✅ Test error scenarios

❌ Share database state between tests
❌ Use production data in tests
❌ Skip cleanup in afterEach
❌ Hardcode test data in tests

## Related Skills

- [Testing: Unit](orchestr8://skills/testing-unit)
- [Testing: E2E Best Practices](orchestr8://skills/testing-e2e-best-practices)
- [Testing: Strategies](orchestr8://skills/testing-strategies)
```

### Example 3: Domain-Specific Technique

```markdown
---
id: api-design-rest
category: skill
tags: [api, rest, http, resource-design, best-practices]
capabilities:
  - REST API design principles and resource modeling
  - HTTP method selection and idempotency
  - Resource naming and URI structure
  - Status code selection for API responses
useWhen:
  - Designing REST APIs with proper resource modeling
  - Implementing HTTP methods for CRUD operations
  - Structuring API endpoints and URI hierarchy
  - Selecting appropriate HTTP status codes for responses
estimatedTokens: 620
---

# API Design: REST Principles

Principles and patterns for designing effective RESTful APIs.

## Resource Modeling

### Resource Naming
\`\`\`
✅ Good:
GET    /users              # Collection
GET    /users/123          # Individual
GET    /users/123/orders   # Nested collection
POST   /users              # Create
PUT    /users/123          # Update (full)
PATCH  /users/123          # Update (partial)
DELETE /users/123          # Delete

❌ Bad:
GET    /getUsers
POST   /createUser
GET    /user/123/getOrders
POST   /users/delete/123
\`\`\`

## HTTP Methods

### Method Selection
\`\`\`typescript
// GET - Retrieve resource(s)
app.get("/users/:id", async (req, res) => {
  const user = await userService.findById(req.params.id);
  res.json(user);
});

// POST - Create resource
app.post("/users", async (req, res) => {
  const user = await userService.create(req.body);
  res.status(201).json(user);
});

// PUT - Replace resource completely
app.put("/users/:id", async (req, res) => {
  const user = await userService.replace(req.params.id, req.body);
  res.json(user);
});

// PATCH - Update resource partially
app.patch("/users/:id", async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  res.json(user);
});

// DELETE - Remove resource
app.delete("/users/:id", async (req, res) => {
  await userService.delete(req.params.id);
  res.status(204).send();
});
\`\`\`

## Status Codes

### Common Codes
\`\`\`
Success:
200 OK                  - Successful GET, PUT, PATCH
201 Created            - Successful POST
204 No Content         - Successful DELETE

Client Errors:
400 Bad Request        - Invalid input
401 Unauthorized       - Missing/invalid authentication
403 Forbidden          - Valid auth but insufficient permissions
404 Not Found          - Resource doesn't exist
409 Conflict           - Duplicate resource
422 Unprocessable      - Validation failed

Server Errors:
500 Internal Server    - Unexpected server error
503 Service Unavailable - Temporary unavailability
\`\`\`

## Best Practices

✅ Use nouns for resources, not verbs
✅ Use HTTP methods for actions
✅ Return appropriate status codes
✅ Support filtering with query parameters
✅ Version your API (/v1/users)

❌ Use verbs in URIs (/getUser)
❌ Mix singular/plural inconsistently
❌ Return 200 for all responses
❌ Deep nesting (max 2-3 levels)

## Related Skills

- [Error Handling: API Patterns](orchestr8://skills/error-handling-api-patterns)
- [Security: API Security](orchestr8://skills/security-api-security)
- [API Documentation Patterns](orchestr8://skills/api-documentation-patterns)
```

## Skill Creation Workflow

```markdown
1. Identify Technique
   ├─ What HOW are you documenting?
   ├─ Is it reusable across contexts?
   ├─ Is it truly a technique (not domain expertise)?
   └─ Check for existing skills

2. Define Scope
   ├─ Single technique or related set?
   ├─ Language-agnostic or framework-specific?
   ├─ Target size: 500-700 tokens
   └─ Identify use cases

3. Write Metadata
   ├─ ID: ${technique}-${context}
   ├─ Category: skill
   ├─ Tags: 5-7 specific tags
   ├─ Capabilities: 3-5 concrete capabilities
   └─ UseWhen: 3-5 specific scenarios

4. Write Content
   ├─ Technique overview
   ├─ When to use
   ├─ Implementation (2-3 examples)
   ├─ Best practices
   ├─ Common pitfalls
   └─ Related skills

5. Add Code Examples
   ├─ 2-3 languages if applicable
   ├─ Concise (5-15 lines each)
   ├─ Working code (tested)
   └─ Well-commented

6. Test Discovery
   ├─ Create 5-6 test queries
   ├─ Verify top-3 ranking
   ├─ Test use-case queries
   └─ Optimize metadata if needed

7. Validate
   ├─ Token count (500-700)
   ├─ Single technique focus
   ├─ Code examples work
   └─ No duplication

8. Deploy
   ├─ Save to resources/skills/
   ├─ Commit with descriptive message
   └─ Index rebuilds automatically
```

## Quick Reference

### Skill Checklist

- [ ] 500-700 tokens (max 1000)
- [ ] Single technique focus
- [ ] Category: `skill`
- [ ] ID: `${technique}-${context}`
- [ ] 5-7 specific tags
- [ ] 3-5 concrete capabilities
- [ ] 3-5 specific useWhen scenarios
- [ ] 2-3 code examples (tested)
- [ ] Best practices included
- [ ] Common pitfalls documented
- [ ] Related skills referenced
- [ ] Discoverable via test queries
- [ ] No duplication with existing skills
- [ ] Saved to `resources/skills/`

## Next Steps

- Review [Fragment Authoring Guide](./fragments.md) for metadata best practices
- Use [Skill Template](./templates/skill-template.md) to get started
- See [Best Practices](./best-practices.md) for quality guidelines
- Test skills using `/orchestr8:mcp-ui`
