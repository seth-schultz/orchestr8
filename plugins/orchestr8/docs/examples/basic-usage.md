# Basic Usage Examples

> **Common scenarios and simple patterns for using Orchestr8**

This guide provides practical examples for everyday Orchestr8 usage. Perfect for beginners and common development tasks.

## Table of Contents

- [Workflow Examples](#workflow-examples)
- [Static Resource Loading](#static-resource-loading)
- [Dynamic Matching Basics](#dynamic-matching-basics)
- [Catalog Mode Usage](#catalog-mode-usage)
- [Combining Resources](#combining-resources)
- [Common Patterns](#common-patterns)

---

## Workflow Examples

### Example 1: New TypeScript API Project

**Scenario:** Start a new TypeScript REST API with authentication

**Command:**
```bash
/orchestr8:new-project Build a TypeScript REST API with JWT authentication and PostgreSQL
```

**What happens:**

1. **Workflow loads** (~2KB)
2. **Analyzes requirements:**
   - Language: TypeScript
   - Type: REST API
   - Features: JWT auth, PostgreSQL

3. **Dynamic resource loading:**
   ```
   orchestr8://match?query=typescript+rest+api+authentication+postgresql&maxTokens=2500
   ```

4. **Assembles expertise:**
   - `typescript-core` - Type system fundamentals
   - `typescript-api-development` - Express, REST patterns
   - `security-auth-jwt` - JWT authentication
   - `express-jwt-auth` - Working example
   - `database-postgresql` - PostgreSQL integration

5. **Executes phases:**
   - **Phase 1 (0-20%):** Architecture design, project structure
   - **Phase 2 (20-50%):** Core setup, database, auth middleware
   - **Phase 3 (50-80%):** API endpoints, business logic
   - **Phase 4 (80-100%):** Tests, docs, deployment

**Result:** Complete project with:
- Project structure
- TypeScript configuration
- Express server with auth
- PostgreSQL integration
- Unit and integration tests
- Deployment guidance

**Token usage:** ~4500 tokens (workflow + resources)

---

### Example 2: Add Feature to Existing App

**Scenario:** Add user profile management with avatar upload

**Command:**
```bash
/orchestr8:add-feature Add user profile management with avatar upload
```

**What happens:**

1. **Codebase analysis:**
   - Scans existing project structure
   - Identifies tech stack (e.g., Express + React)
   - Finds relevant integration points

2. **Feature design:**
   - Backend: Profile API endpoints
   - Frontend: Profile UI components
   - Storage: Avatar file handling
   - Database: Profile schema updates

3. **Parallel implementation:**
   - **Backend track:** API endpoints, file upload, database
   - **Frontend track:** Profile components, forms, file input
   - **Test track:** Unit tests, integration tests

4. **Integration & deployment:**
   - API integration
   - Feature flag setup
   - Deployment steps

**Result:** Working feature with:
- Backend API endpoints
- Frontend UI components
- File upload handling
- Database schema updates
- Tests for all components
- Integration guidance

---

### Example 3: Fix Production Bug

**Scenario:** Users can't login after password reset

**Command:**
```bash
/orchestr8:fix-bug Users can't login after password reset
```

**What happens:**

1. **Investigation phase:**
   - Reproduces issue
   - Analyzes auth flow
   - Checks token generation
   - Identifies root cause: Password reset clears session but doesn't invalidate old tokens

2. **Fix implementation:**
   - Add token versioning
   - Invalidate tokens on password reset
   - Update auth middleware
   - Add defensive checks

3. **Validation:**
   - Write regression test
   - Test manually with various scenarios
   - Verify edge cases

4. **Prevention:**
   - Add monitoring for auth failures
   - Improve error messages
   - Update documentation

**Result:** Bug fixed with:
- Root cause identified
- Solution implemented
- Regression test added
- Monitoring improved
- Documentation updated

---

### Example 4: Code Review

**Scenario:** Review authentication module

**Command:**
```bash
/orchestr8:review-code Review the authentication module
```

**What happens:**

1. **Code quality check:**
   - Style consistency
   - Naming conventions
   - Code complexity
   - Documentation

2. **Architecture review:**
   - Design patterns
   - Separation of concerns
   - Error handling
   - Testing coverage

3. **Security scan:**
   - SQL injection
   - XSS vulnerabilities
   - Authentication flaws
   - Secret management

4. **Recommendations:**
   - Prioritized improvements
   - Code examples
   - Best practices

**Result:** Comprehensive review with actionable feedback

---

## Static Resource Loading

### Load Specific Agent

**Scenario:** Need TypeScript expertise

**URI:**
```
orchestr8://agents/typescript-core
```

**Returns:**
```markdown
# TypeScript Core Agent

Expert in TypeScript's type system...

## Capabilities
- Complex type system design
- Generic type constraints and inference
- Conditional and mapped types

## Best Practices
- Use strict mode
- Prefer type inference
- Avoid type assertions

[Full content: ~650 tokens]
```

**Use when:**
- Building TypeScript application
- Need type system expertise
- Designing type-safe APIs

---

### Load Specific Skill

**Scenario:** Need error handling patterns

**URI:**
```
orchestr8://skills/error-handling-resilience
```

**Returns:**
```markdown
# Error Handling & Resilience

Patterns for robust error handling...

## Techniques
- Retry with exponential backoff
- Circuit breaker pattern
- Timeout handling
- Graceful degradation

## Implementation
[Code examples and patterns]

[Full content: ~720 tokens]
```

**Use when:**
- Implementing error handling
- Building resilient services
- Need retry/timeout patterns

---

### Load Code Example

**Scenario:** Need JWT authentication example

**URI:**
```
orchestr8://examples/express-jwt-auth
```

**Returns:**
```markdown
# Express JWT Authentication

Complete JWT auth implementation...

## Setup
[Installation and configuration]

## Implementation
[Auth middleware, routes, token handling]

## Testing
[Test examples]

[Full content: ~850 tokens]
```

**Use when:**
- Implementing JWT auth
- Need working example
- Learning authentication patterns

---

### Load Pattern

**Scenario:** Need microservices architecture guidance

**URI:**
```
orchestr8://patterns/microservices-architecture
```

**Returns:**
```markdown
# Microservices Architecture Pattern

Design patterns for microservices...

## Principles
- Service independence
- API-first design
- Distributed data management

## Implementation
[Architecture diagrams and examples]

[Full content: ~1100 tokens]
```

**Use when:**
- Designing microservices
- Need architecture guidance
- Planning system design

---

## Dynamic Matching Basics

### Simple Query

**Scenario:** Find TypeScript API resources

**Query:**
```
orchestr8://match?query=typescript+api&mode=catalog
```

**Returns:**
```
Top 10 Matches for "typescript api"

1. TypeScript API Development (Score: 88)
   orchestr8://agents/typescript-api-development
   Tags: typescript, rest-api, express, nodejs
   Tokens: 900

2. API Design REST (Score: 76)
   orchestr8://skills/api-design-rest
   Tags: api, rest, design, best-practices
   Tokens: 720

3. Express Minimal API (Score: 72)
   orchestr8://examples/express-minimal-api
   Tags: express, typescript, api, minimal
   Tokens: 500

[... 7 more results ...]
```

**Next step:** Load specific resources needed

---

### Category-Specific Query

**Scenario:** Find testing skills

**Query:**
```
orchestr8://skills/match?query=testing+unit+integration
```

**Returns:**
```
Top Matches in Skills Category

1. Testing Integration Strategies (Score: 92)
   orchestr8://skills/testing-integration

2. Testing Unit Patterns (Score: 85)
   orchestr8://skills/testing-unit

3. API Testing Best Practices (Score: 78)
   orchestr8://skills/api-testing
```

**Benefits:**
- Narrower scope = better precision
- Faster matching
- More relevant results

---

### Multi-Keyword Query

**Scenario:** Find async error handling

**Query:**
```
orchestr8://match?query=async+error+handling+retry+timeout
```

**Returns:** Resources matching multiple keywords with higher relevance scores

**Scoring:**
- Matches "async": +10 per tag, +8 per capability, +5 per useWhen
- Matches "error": +10 per tag, etc.
- Matches "retry": +10 per tag, etc.
- Total score determines ranking

---

## Catalog Mode Usage

### Discover Available Resources

**Scenario:** See what's available for testing

**Query:**
```
orchestr8://match?query=testing+patterns&mode=catalog&maxResults=15
```

**Returns:**
```
15 Matches for "testing patterns"

Skills:
1. Testing Integration (Score: 88, 680 tokens)
2. Testing Unit (Score: 82, 720 tokens)
3. Testing E2E (Score: 76, 650 tokens)

Patterns:
4. Test-Driven Development (Score: 85, 800 tokens)
5. Testing Pyramid (Score: 78, 550 tokens)

Examples:
6. Jest Testing Setup (Score: 80, 500 tokens)
7. Integration Test Examples (Score: 74, 600 tokens)

[... 8 more results ...]
```

**Benefits:**
- Lightweight (~100 tokens)
- See all options
- Plan token budget
- Selective loading

---

### Review Before Loading

**Workflow:**

1. **Discover:**
```
orchestr8://match?query=kubernetes+deployment&mode=catalog&maxResults=10
```

2. **Review results:**
   - kubernetes-deployment-guide (1200 tokens)
   - helm-charts-pattern (800 tokens)
   - docker-compose-dev (600 tokens)

3. **Plan budget:**
   - Total available: 3000 tokens
   - Want: Guide + Pattern = 2000 tokens
   - Remaining: 1000 tokens for work

4. **Load selectively:**
```
orchestr8://guides/kubernetes-deployment
orchestr8://patterns/helm-charts
```

**Total tokens:** 100 (catalog) + 2000 (content) = 2100 tokens

---

## Combining Resources

### Agent + Skill + Example

**Scenario:** Build API with error handling

**Step 1 - Agent (core expertise):**
```
orchestr8://agents/typescript-api-development
→ 900 tokens
```

**Step 2 - Skill (specific technique):**
```
orchestr8://skills/error-handling-resilience
→ 720 tokens
```

**Step 3 - Example (working code):**
```
orchestr8://examples/express-error-handling
→ 650 tokens
```

**Total:** 2270 tokens
**Result:** Complete expertise (theory + technique + practice)

---

### Pattern + Guide

**Scenario:** Deploy microservices to Kubernetes

**Step 1 - Pattern (architecture):**
```
orchestr8://patterns/microservices-architecture
→ 1100 tokens
```

**Step 2 - Guide (setup):**
```
orchestr8://guides/kubernetes-deployment
→ 1200 tokens
```

**Total:** 2300 tokens
**Result:** Architecture design + deployment implementation

---

### Multi-Skill Assembly

**Scenario:** Build resilient API

**Skills needed:**
1. Error handling
2. Rate limiting
3. Caching
4. Monitoring

**Loading:**
```
orchestr8://skills/error-handling-resilience      # 720 tokens
orchestr8://skills/api-rate-limiting              # 580 tokens
orchestr8://skills/caching-strategies             # 650 tokens
orchestr8://skills/monitoring-observability       # 800 tokens
```

**Total:** 2750 tokens
**Result:** Comprehensive resilience patterns

---

## Common Patterns

### Pattern 1: Quick Reference

**Goal:** Get quick expertise on specific topic

**Approach:**
```
# Direct load
orchestr8://agents/typescript-core
```

**Token usage:** ~650 tokens
**Speed:** <5ms
**Best for:** Known resource, quick reference

---

### Pattern 2: Explore & Load

**Goal:** Discover resources, then load selectively

**Approach:**
```
# Step 1: Discover
orchestr8://match?query=authentication+jwt&mode=catalog

# Step 2: Review
# - security-auth-jwt (680 tokens)
# - express-jwt-auth (850 tokens)
# - api-security-best-practices (720 tokens)

# Step 3: Load specific
orchestr8://patterns/security-auth-jwt
orchestr8://examples/express-jwt-auth
```

**Token usage:** 100 + 1530 = 1630 tokens
**Best for:** Discovery, token optimization

---

### Pattern 3: Progressive Loading (Core-First)

**Goal:** Start with core content, load examples on-demand

**Approach:**
```
# Step 1: Core agent (650 tokens)
orchestr8://agents/typescript-core

# Step 2: Add skills during development (as needed)
orchestr8://skills/error-handling-resilience  # 720 tokens
orchestr8://skills/testing-unit  # 680 tokens

# Step 3: Load examples only when stuck (on-demand)
orchestr8://examples/express-error-handling  # 850 tokens
```

**Token usage:**
- Core + 2 skills: 2,050 tokens
- With example: 2,900 tokens
- vs loading everything: 4,500+ tokens
- **Savings: 54-64%**

**Best for:** Learning, exploration, efficient development

**Real-world example (SRE agent):**
```
# Core content (180 tokens)
orchestr8://agents/sre-specialist

# Returns core + references to examples:
# → orchestr8://examples/infrastructure/sre-slo-configuration
# → orchestr8://examples/infrastructure/sre-incident-management

# Load example when implementing (800 tokens)
orchestr8://examples/infrastructure/sre-slo-configuration

# Total: 980 tokens vs 2,000+ upfront
# Savings: 52%
```

---

### Pattern 4: Workflow-Driven with JIT Loading

**Goal:** Let workflow orchestrate phase-based resource loading

**Approach:**
```
/orchestr8:new-project Build a TypeScript API with auth

# Workflow uses JIT loading by phase:
# Phase 1 (0-20%): → Load architecture patterns (1,200 tokens)
# Phase 2 (20-30%): → Load typescript+setup (1,000 tokens)
# Phase 3 (30-70%): → Load implementation expertise (3,500 tokens)
# Phase 4 (70-90%): → Load testing+security (2,000 tokens)
# Phase 5 (90-100%): → Load deployment (1,800 tokens, conditional)
```

**Token usage:**
- Typical project: 4,500-6,000 tokens progressive
- vs loading everything: 12,000 tokens
- **Savings: 77%**

**Best for:** Complex tasks, structured development, beginners

---

## Related Documentation

- [Advanced Usage Examples](./advanced-usage.md) - Complex patterns and optimization
- [Usage Guide](../usage/README.md) - Comprehensive usage documentation
- [Resources Guide](../usage/resources.md) - Resource system details
- [Workflows Guide](../usage/workflows.md) - Workflow documentation

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
