# Resource Authoring Guide

This guide walks you through creating effective resource fragments for the Orchestr8 system, from planning to testing and publishing. Follow these steps to create discoverable, composable, and high-quality resources.

## Quick Start Checklist

Before you begin, ensure you have:

- [ ] Identified the knowledge or expertise to document
- [ ] Determined the appropriate category (agents, skills, patterns, examples, guides, workflows)
- [ ] Checked for existing similar fragments (avoid duplication)
- [ ] Planned the fragment scope (single concept, 500-1000 tokens)
- [ ] Prepared examples, code snippets, or references

## Step-by-Step Authoring Process

### Step 1: Choose the Right Category

Use the category decision tree to select where your fragment belongs:

```
Is it a multi-step process? → workflows/
Is it primarily code? → examples/
Is it setup/installation? → guides/
Is it architectural/high-level? → patterns/
Is it comprehensive tech expertise? → agents/
Is it a quality standard? → best-practices/
Is it a specific technique? → skills/
```

See [categories.md](./categories.md) for detailed category descriptions.

**Example decisions:**
- "TypeScript type system expertise" → `agents/`
- "Retry logic with exponential backoff" → `skills/`
- "Microservices architecture" → `patterns/`
- "Express.js JWT auth implementation" → `examples/`
- "AWS EKS cluster setup" → `guides/`
- "REST API design conventions" → `best-practices/`
- "New project initialization process" → `workflows/`

### Step 2: Plan Fragment Scope

Define the boundaries of your fragment:

**Scope questions:**
- What is the single concept or technique?
- What are the learning objectives?
- What examples or patterns will you include?
- What is the expected token count? (aim for 500-1000)

**Good scope (focused):**
```
Fragment: typescript-async-patterns
Covers: async/await, promises, error handling, patterns
Token estimate: 580 tokens
```

**Poor scope (too broad):**
```
Fragment: typescript-everything
Covers: types, async, testing, APIs, deployment, etc.
Token estimate: 3500 tokens (too large!)
```

**Solution: Split into multiple fragments:**
```
typescript-core (650 tokens)
typescript-async-patterns (580 tokens)
typescript-api-development (720 tokens)
typescript-testing (680 tokens)
```

### Step 3: Create the File

**File location:**
```
resources/{category}/{fragment-name}.md
```

**Naming conventions:**
- Lowercase letters
- Hyphens for word separation (no underscores or spaces)
- Descriptive and specific
- Matches the id in frontmatter

**Examples:**
```bash
resources/agents/typescript-core.md
resources/skills/error-handling-resilience.md
resources/patterns/autonomous-organization.md
resources/examples/express-jwt-auth.md
```

### Step 4: Write Effective Frontmatter

Start your file with YAML frontmatter containing metadata:

```yaml
---
id: typescript-core
category: agent
tags: [typescript, types, generics, type-inference, advanced-types]
capabilities:
  - Complex type system design
  - Generic type constraints and inference
  - Conditional and mapped types
  - Type-level programming
useWhen:
  - Designing type-safe APIs using generic constraints (T extends keyof Type)
  - Solving complex type transformations with utility types
  - Implementing discriminated unions for type-safe state machines
  - Resolving type inference issues using type predicates
estimatedTokens: 650
---
```

#### Writing the `id` Field

**Rules:**
- Unique within the category
- Lowercase, hyphen-separated
- Match the filename (without .md)
- Descriptive and specific

**Examples:**
```yaml
id: typescript-core               # ✓ Good
id: typescript-async-patterns      # ✓ Good
id: error-handling-resilience      # ✓ Good

id: typescript                     # ✗ Too generic
id: TypeScript-Core                # ✗ Use lowercase
id: typescript_core                # ✗ Use hyphens, not underscores
```

#### Writing the `category` Field

**Rules:**
- Must be one of: `agent`, `skill`, `pattern`, `example`, `workflow`
- Must match the directory the fragment is in

**Examples:**
```yaml
# File: agents/typescript-core.md
category: agent                    # ✓ Correct

# File: skills/error-handling.md
category: skill                    # ✓ Correct

# File: agents/typescript-core.md
category: skill                    # ✗ Wrong - doesn't match directory
```

#### Writing Effective Tags

**Guidelines:**
- **5-10 tags** per fragment (more is better for discoverability)
- **Lowercase only** (case-insensitive matching)
- **Specific keywords** (not generic)
- **Technology names** (typescript, python, kubernetes)
- **Technique names** (retry, circuit-breaker, jwt)
- **Domain terms** (authentication, validation, async)

**Tag categories to include:**
1. Primary technology (typescript, python, react)
2. Related technologies (express, fastapi, jest)
3. Techniques (async, error-handling, validation)
4. Domains (security, performance, testing)
5. Concepts (generics, hooks, containers)

**Good examples:**
```yaml
tags: [typescript, types, generics, type-inference, advanced-types]
tags: [python, fastapi, pydantic, validation, async, rest-api]
tags: [kubernetes, deployment, helm, rolling-update, health-checks]
tags: [error-handling, resilience, retry, circuit-breaker, timeout]
```

**Poor examples:**
```yaml
tags: [code, programming]           # ✗ Too generic
tags: [TypeScript, React]           # ✗ Use lowercase
tags: [good, best, awesome]         # ✗ Subjective/unhelpful
tags: [typescript]                  # ✗ Too few tags
```

#### Writing Effective Capabilities

**Guidelines:**
- **3-6 capabilities** per fragment
- **Start with action verbs** (Design, Implement, Build, Create)
- **Focus on outcomes** (what you can do with this knowledge)
- **Be specific** (not "know TypeScript" but "design type-safe APIs")

**Formula:**
```
[Action Verb] [Specific Outcome] [with/using] [Technical Detail]
```

**Excellent examples:**
```yaml
capabilities:
  - Design type-safe APIs using generic constraints and conditional types
  - Implement exponential backoff retry logic with configurable parameters
  - Build fault-tolerant microservices with circuit breaker patterns
  - Create production-ready Kubernetes deployments with health checks
```

**Good examples:**
```yaml
capabilities:
  - Complex type system design
  - Generic type constraints
  - Conditional and mapped types
```

**Poor examples:**
```yaml
capabilities:
  - Know TypeScript                 # ✗ Not an outcome
  - Use generics                    # ✗ Too basic
  - Write code                      # ✗ Too vague
  - Be good at programming          # ✗ Subjective
```

#### Writing Effective useWhen Scenarios

**MOST IMPORTANT FIELD for matching and discoverability!**

**Guidelines:**
- **3-6 scenarios** per fragment
- **Very specific** with concrete keywords
- **10-20 keywords per scenario** (for index matching)
- **Action-oriented** (Implementing X, Building Y, Designing Z)
- **Include technical terms** (exponential backoff, JWT, circuit breaker)
- **Mention concrete use cases** (API calls, database queries, authentication)

**Formula:**
```
[Action] [specific technique] for [concrete use case] with/experiencing [technical details/conditions]
```

**Excellent examples (10-20 keywords each):**
```yaml
useWhen:
  - Implementing retry logic with exponential backoff for API calls experiencing intermittent timeouts and network failures
  - Building circuit breaker pattern for third-party service integration to prevent cascading failures in microservices architecture
  - Designing fault-tolerant distributed systems with bulkhead isolation and fallback strategies for high availability
  - Resolving transient errors in database connections using retry policies with jitter and maximum attempt limits
```

**Good examples:**
```yaml
useWhen:
  - Designing type-safe APIs using generic constraints
  - Setting up JWT authentication for REST APIs
  - Deploying containerized applications to Kubernetes clusters
```

**Poor examples:**
```yaml
useWhen:
  - When you need error handling      # ✗ Too generic (2 keywords)
  - For APIs                           # ✗ No context (1 keyword)
  - Building applications              # ✗ Too vague (2 keywords)
  - When using TypeScript              # ✗ Not specific (2 keywords)
```

**Pro tips:**
- Include the problem/symptom (e.g., "experiencing intermittent timeouts")
- Mention specific technologies (e.g., "Express.js REST APIs", not just "APIs")
- Describe the context (e.g., "microservices architecture", "distributed systems")
- Use domain terminology (e.g., "cascading failures", "bulkhead isolation")

#### Estimating Token Count

**Formula:**
```javascript
estimatedTokens = Math.ceil(contentLength / 4)
```

**Process:**
1. Write the full content (without frontmatter)
2. Count characters: `content.length`
3. Divide by 4: `content.length / 4`
4. Round up: `Math.ceil(result)`
5. Round to nearest 10 for readability

**Example:**
```javascript
// Content is 2,637 characters
const estimatedTokens = Math.ceil(2637 / 4);  // 660
const rounded = Math.round(estimatedTokens / 10) * 10;  // 660

// In frontmatter:
estimatedTokens: 660
```

**Validation:**
- Use actual token counter for critical fragments
- Aim for 500-1000 token range
- If >1200 tokens, consider splitting

### Step 5: Write Compelling Content

#### Content Structure

**Recommended structure:**

```markdown
# Fragment Title

Brief introduction (1-2 sentences explaining what this fragment covers)

## Primary Section

Core content with examples

### Subsection

Detailed information

## Secondary Section

Additional content

### Subsection

More details

## Best Practices

Guidelines and tips

## Common Pitfalls

What to avoid

## Examples

Concrete examples (if applicable)
```

#### Writing Guidelines

**1. Start with a clear title (H1)**
```markdown
# TypeScript Core Expertise
```

**2. Brief introduction**
```markdown
This fragment covers TypeScript's type system, including generics,
conditional types, and advanced type patterns for building type-safe applications.
```

**3. Use structured sections (H2, H3)**
```markdown
## Generic Constraints
### Basic Constraints
### Advanced Patterns
```

**4. Include abundant code examples**
```markdown
**Pattern:**
```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  // implementation
}
```
```

**5. Use bullet points for guidelines**
```markdown
**Best practices:**
- Use const assertions for literal types
- Prefer unknown over any
- Avoid deep recursive types (>5 levels)
```

**6. Use tables for comparisons**
```markdown
| Pattern | Use Case | Performance |
|---------|----------|-------------|
| Mapped types | Type transformations | Compile-time |
| Index signature | Dynamic keys | O(1) |
```

**7. Include visual separators**
```markdown
---

## Next Section
```

**8. Highlight important information**
```markdown
> **Important:** Always validate input before processing
```

**9. Use inline code for technical terms**
```markdown
Use `async/await` instead of raw promises.
```

**10. End with practical takeaways**
```markdown
## Summary

Key points:
- Generics enable reusable type-safe code
- Conditional types allow type-level branching
- Utility types reduce boilerplate
```

### Step 6: Test Fragment Quality

#### Discoverability Testing

**Test if your fragment can be discovered:**

```bash
# Query with expected keywords
orchestr8://match?query=typescript+generics+constraints&mode=index

# Expected: Your fragment should appear in results
# Check: Is the relevance score high?
```

**Validation checklist:**
- [ ] Fragment appears in search results
- [ ] Relevance score is >70
- [ ] Appears in top 5 results
- [ ] Query matches your useWhen scenarios

**If fragment doesn't appear:**
- Add more specific keywords to tags
- Write more detailed useWhen scenarios
- Include technical terms in useWhen

#### Token Budget Testing

**Test if token estimate is accurate:**

```bash
# Count actual tokens using a token counter
# Compare with estimatedTokens in frontmatter
# Should be within 10% difference
```

**Validation:**
```javascript
const content = fs.readFileSync('fragment.md', 'utf-8');
const parsed = matter(content);
const actualTokens = countTokens(parsed.content);  // Use actual counter
const declaredTokens = parsed.data.estimatedTokens;
const difference = Math.abs(actualTokens - declaredTokens);
const withinRange = (difference / actualTokens) < 0.1;  // Within 10%

console.log(`Declared: ${declaredTokens}`);
console.log(`Actual: ${actualTokens}`);
console.log(`Within range: ${withinRange}`);
```

#### Composition Testing

**Test if fragment composes well with others:**

```bash
# Test assembly with related fragments
orchestr8://match?query=typescript+api+error+handling&maxTokens=3000

# Validate:
# 1. Your fragment is included
# 2. Complements other fragments (no duplication)
# 3. Total tokens < maxTokens
# 4. Logical ordering
```

#### Content Quality Checklist

- [ ] Title is clear and descriptive
- [ ] Introduction explains scope
- [ ] Sections are well-organized
- [ ] Code examples are correct and runnable
- [ ] Guidelines are actionable
- [ ] No typos or grammatical errors
- [ ] Technical accuracy verified
- [ ] Formatting is consistent

### Step 7: Build Indexes

After creating or modifying fragments, rebuild the indexes:

```bash
# From project root
npm run build-index

# Or using tsx directly
npx tsx scripts/build-index.ts
```

**Validation output:**
```
Starting index generation...
Scanned 221 fragments
Built useWhen index with 1142 scenarios
Built keyword index with 3646 keywords
Built quick lookup cache with 20 queries
✓ Index generation complete
```

**Verify:**
- All fragments are indexed
- Keyword count increased (if adding new fragments)
- No errors during build
- Index files updated in `resources/.index/`

### Step 8: Test End-to-End

**Test the full loading flow:**

```bash
# Static loading (direct URI)
orchestr8://agents/your-fragment-id

# Dynamic loading (query-based)
orchestr8://match?query=your+expected+keywords&mode=index

# Category-specific matching
orchestr8://agents/match?query=your+keywords
```

**Validation:**
- Static loading returns your fragment content
- Dynamic loading includes your fragment in results
- Relevance score is appropriate
- Token budget is respected

### Step 9: Document Related Fragments

**Add cross-references in content:**

```markdown
For async patterns, see [typescript-async-patterns](orchestr8://agents/typescript-async-patterns).
```

**Add relatedFragments in frontmatter (optional):**

```yaml
relatedFragments:
  - orchestr8://agents/typescript-async-patterns
  - orchestr8://skills/error-handling-async
```

### Step 10: Commit and Share

**Before committing:**
- [ ] Run index build
- [ ] Test discoverability
- [ ] Verify content quality
- [ ] Check for typos
- [ ] Validate token estimate

**Commit message format:**
```bash
git add resources/{category}/{fragment-name}.md
git add resources/.index/*.json
git commit -m "Add {fragment-name} fragment to {category}

- Covers {brief description}
- {X} tokens
- {Y} useWhen scenarios"
```

## Advanced Authoring Techniques

### Tag Selection Strategies

**Strategy 1: Technology Stack Tags**
```yaml
tags: [python, fastapi, pydantic, uvicorn, async, rest-api]
# Covers: language, framework, library, server, pattern, domain
```

**Strategy 2: Problem-Solution Tags**
```yaml
tags: [error-handling, retry, exponential-backoff, circuit-breaker, timeout, resilience]
# Covers: problem domain, solutions, patterns
```

**Strategy 3: Domain-Technique Tags**
```yaml
tags: [security, authentication, jwt, bearer-token, oauth, refresh-token]
# Covers: domain, approach, specifics
```

**Strategy 4: Technology-Use-Case Tags**
```yaml
tags: [kubernetes, deployment, rolling-update, health-checks, liveness, readiness]
# Covers: platform, action, strategies, features
```

### UseWhen Scenario Patterns

**Pattern 1: Problem-Solution-Context**
```yaml
useWhen:
  - [Problem] Implementing retry logic
    [Solution] with exponential backoff
    [Context] for API calls experiencing intermittent timeouts
```

**Pattern 2: Task-Technology-Constraint**
```yaml
useWhen:
  - [Task] Building production-ready Kubernetes deployments
    [Technology] with rolling updates and health checks
    [Constraint] ensuring zero-downtime releases
```

**Pattern 3: Goal-Approach-Detail**
```yaml
useWhen:
  - [Goal] Designing type-safe APIs
    [Approach] using generic constraints and conditional types
    [Detail] with automatic type inference and validation
```

**Pattern 4: Context-Challenge-Solution**
```yaml
useWhen:
  - [Context] In microservices architecture
    [Challenge] preventing cascading failures
    [Solution] using circuit breaker pattern with fallback strategies
```

### Fragment Sizing Strategies

**Strategy 1: Core + Extensions**
```
Core fragment (600-800 tokens):
  - Fundamentals
  - Common patterns
  - Essential knowledge

Extension fragments (400-600 tokens each):
  - Specialized topics
  - Advanced patterns
  - Domain-specific applications
```

**Strategy 2: Progressive Complexity**
```
Level 1 (500 tokens): Basics
Level 2 (700 tokens): Intermediate
Level 3 (900 tokens): Advanced
```

**Strategy 3: Topic Decomposition**
```
Large topic (2500 tokens) split into:
  - Sub-topic 1 (700 tokens)
  - Sub-topic 2 (650 tokens)
  - Sub-topic 3 (600 tokens)
  - Sub-topic 4 (550 tokens)
```

### Content Organization Patterns

**Pattern 1: Concept → Example → Practice**
```markdown
## Concept
[Explanation of the concept]

## Example
[Code example demonstrating concept]

## Best Practices
[Guidelines for applying concept]
```

**Pattern 2: Problem → Solution → Implementation**
```markdown
## The Problem
[Describe the problem]

## The Solution
[Explain the solution approach]

## Implementation
[Show how to implement]
```

**Pattern 3: Overview → Details → Summary**
```markdown
## Overview
[High-level introduction]

## Detailed Sections
[In-depth coverage]

## Summary
[Key takeaways]
```

## Common Mistakes and Solutions

### Mistake 1: Generic UseWhen Scenarios

**Problem:**
```yaml
useWhen:
  - When building APIs
  - When using TypeScript
  - For error handling
```

**Solution:**
```yaml
useWhen:
  - Building Express.js REST APIs with TypeScript requiring type-safe request validation using Zod schemas
  - Implementing error handling middleware for Express applications with custom error types and status codes
  - Creating production-ready API endpoints with authentication, rate limiting, and comprehensive logging
```

### Mistake 2: Too Few Tags

**Problem:**
```yaml
tags: [typescript, api]
```

**Solution:**
```yaml
tags: [typescript, express, rest-api, validation, zod, middleware, error-handling, authentication, jwt]
```

### Mistake 3: Fragment Too Large

**Problem:**
```
typescript-everything.md (3500 tokens)
- Types, async, testing, APIs, deployment, best practices
```

**Solution:**
```
typescript-core.md (650 tokens) - Types and generics
typescript-async-patterns.md (580 tokens) - Async/await
typescript-testing.md (680 tokens) - Testing strategies
typescript-api-development.md (720 tokens) - API patterns
```

### Mistake 4: Wrong Category

**Problem:**
```
File: agents/express-auth-example.md
Content: Complete code example with no explanation
```

**Solution:**
```
File: examples/express-jwt-auth.md
Content: Code example with minimal explanation
Category: example
```

### Mistake 5: Inaccurate Token Estimate

**Problem:**
```yaml
estimatedTokens: 500
# Actual content: 2,400 characters = ~600 tokens
```

**Solution:**
```yaml
estimatedTokens: 600
# Calculate: Math.ceil(2400 / 4) = 600
```

### Mistake 6: No Cross-References

**Problem:**
```markdown
# Fragment with no links to related content
```

**Solution:**
```markdown
# Fragment Title

For foundational knowledge, see [typescript-core](orchestr8://agents/typescript-core).

Related patterns:
- [Error Handling](orchestr8://skills/error-handling-resilience)
- [API Design](orchestr8://skills/api-design-rest)
```

### Mistake 7: Code Without Explanation

**Problem:**
```markdown
```typescript
function example() { ... }
```
```

**Solution:**
```markdown
## Pattern Explanation

This pattern solves X by doing Y.

**Implementation:**
```typescript
function example() {
  // Comment explaining key parts
  ...
}
```

**Why this works:**
- Benefit 1
- Benefit 2
```

## Quality Checklist

Before finalizing your fragment, verify:

### Metadata Quality
- [ ] `id` is unique and descriptive
- [ ] `category` matches directory
- [ ] 5-10 specific tags (lowercase)
- [ ] 3-6 outcome-focused capabilities
- [ ] 3-6 detailed useWhen scenarios (10-20 keywords each)
- [ ] Accurate estimatedTokens (±10%)

### Content Quality
- [ ] Clear title and introduction
- [ ] Well-organized sections
- [ ] Abundant code examples
- [ ] Actionable guidelines
- [ ] No typos or errors
- [ ] Technical accuracy verified
- [ ] 500-1000 token range (ideal)

### Discoverability
- [ ] Fragment appears in expected searches
- [ ] Relevance score >70
- [ ] Keywords match likely queries
- [ ] UseWhen scenarios are specific

### Composition
- [ ] Complements existing fragments
- [ ] No significant content duplication
- [ ] Appropriate cross-references
- [ ] Clear dependencies (if any)

### Testing
- [ ] Static loading works
- [ ] Dynamic matching includes fragment
- [ ] Token budget respected
- [ ] Index rebuilt successfully

## Example: Complete Fragment

Here's a complete, high-quality fragment example:

```yaml
---
id: error-handling-resilience
category: skill
tags: [error-handling, resilience, retry, exponential-backoff, circuit-breaker, timeout, fault-tolerance, distributed-systems]
capabilities:
  - Implement exponential backoff retry logic with configurable parameters
  - Design circuit breaker patterns for fault tolerance
  - Handle transient failures in distributed systems
  - Build resilient microservices with bulkhead isolation
useWhen:
  - Implementing retry logic with exponential backoff for API calls experiencing intermittent timeouts and network failures
  - Building circuit breaker pattern for third-party service integration to prevent cascading failures in microservices architecture
  - Designing fault-tolerant distributed systems with bulkhead isolation and fallback strategies for high availability
  - Resolving transient errors in database connections using retry policies with jitter and maximum attempt limits
  - Creating resilient message queue consumers with error handling, dead letter queues, and exponential backoff
estimatedTokens: 710
---

# Error Handling & Resilience

Comprehensive patterns for building fault-tolerant systems with retry logic, circuit breakers, and bulkhead isolation.

## Retry Patterns

### Exponential Backoff

Exponential backoff prevents overwhelming failing services while allowing for recovery.

**Implementation:**
```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (error) {
      attempt++;

      if (attempt >= maxAttempts) {
        throw error;
      }

      const delay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 0.3 * delay;

      await sleep(delay + jitter);
    }
  }
}
```

**Key features:**
- Exponential delay: 1s → 2s → 4s → 8s
- Jitter: Prevents thundering herd
- Max attempts: Fail fast after threshold

### Retry with Circuit Breaker

Combine retry logic with circuit breaker to protect failing services.

**Pattern:**
```typescript
class CircuitBreaker {
  private failures = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      throw new Error('Circuit breaker is open');
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
}
```

## Circuit Breaker Pattern

### States

| State | Behavior | Transitions To |
|-------|----------|----------------|
| Closed | Normal operation | Open (on failure threshold) |
| Open | Reject all requests | Half-Open (after timeout) |
| Half-Open | Test with single request | Closed (success) / Open (failure) |

### Implementation

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private threshold = 5,
    private timeout = 60000  // 60 seconds
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // State machine logic
  }

  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'open';
      this.lastFailureTime = Date.now();
    }
  }
}
```

## Bulkhead Isolation

Isolate failures to prevent cascade.

**Pattern:**
```typescript
class Bulkhead {
  private active = 0;

  async execute<T>(fn: () => Promise<T>, maxConcurrent: number): Promise<T> {
    if (this.active >= maxConcurrent) {
      throw new Error('Bulkhead limit reached');
    }

    this.active++;
    try {
      return await fn();
    } finally {
      this.active--;
    }
  }
}
```

## Best Practices

- **Use jitter** in retry delays to prevent thundering herd
- **Set max attempts** to fail fast (typically 3-5)
- **Implement circuit breakers** for external services
- **Monitor failure rates** and adjust thresholds
- **Use bulkheads** to isolate failures
- **Provide fallbacks** when possible

## Common Pitfalls

- **No jitter:** Causes synchronized retry storms
- **Infinite retries:** Wastes resources, delays failure detection
- **No circuit breaker:** Cascading failures across services
- **Tight timeouts:** False positives under load
- **No monitoring:** Can't tune thresholds

## Related Patterns

For async error handling, see [error-handling-async](orchestr8://skills/error-handling-async).
For logging strategies, see [error-handling-logging](orchestr8://skills/error-handling-logging).
```

**Why this is a high-quality fragment:**
- Comprehensive metadata with 8 tags and 4 detailed useWhen scenarios
- Clear structure with explanations and examples
- Practical code examples with comments
- Actionable guidelines and common pitfalls
- Appropriate cross-references
- ~710 tokens (ideal range)

## Resources and Tools

### Helpful Commands

```bash
# Build indexes
npm run build-index

# Count tokens (using tiktoken or similar)
npx tiktoken-count resources/agents/typescript-core.md

# Search for similar fragments
grep -r "typescript" resources/agents/

# Validate YAML frontmatter
npx js-yaml-cli resources/agents/typescript-core.md
```

### Token Estimation Tool

```javascript
// estimate-tokens.js
import { readFileSync } from 'fs';
import matter from 'gray-matter';

const file = process.argv[2];
const content = readFileSync(file, 'utf-8');
const parsed = matter(content);
const estimated = Math.ceil(parsed.content.length / 4);

console.log(`Declared: ${parsed.data.estimatedTokens}`);
console.log(`Estimated: ${estimated}`);
console.log(`Difference: ${Math.abs(parsed.data.estimatedTokens - estimated)}`);
```

### Discoverability Test Tool

```bash
# Test if fragment is discoverable
# Usage: ./test-discovery.sh "query keywords" expected-fragment-id

#!/bin/bash
QUERY="$1"
EXPECTED_ID="$2"

RESULT=$(curl -s "http://localhost:3000/match?query=${QUERY}&mode=index")

if echo "$RESULT" | grep -q "$EXPECTED_ID"; then
  echo "✓ Fragment found in results"
else
  echo "✗ Fragment NOT found in results"
fi
```

## Related Documentation

- [README.md](./README.md) - Resource system overview
- [fragments.md](./fragments.md) - Fragment system details
- [categories.md](./categories.md) - Category descriptions
- `resources/.index/README.md` - Index system documentation

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
**Maintained By:** Orchestr8 Documentation Team
