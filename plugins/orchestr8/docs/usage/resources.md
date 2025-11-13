# Orchestr8 Resources Usage Guide

> **Complete guide to loading and using resources in Orchestr8**

Resources are the knowledge system powering Orchestr8. This guide covers how to load agents, skills, patterns, examples, and other resources effectively.

## Table of Contents

- [Overview](#overview)
- [Resource Categories](#resource-categories)
- [Static Resource Loading](#static-resource-loading)
- [Dynamic Resource Matching](#dynamic-resource-matching)
- [Query Parameters Reference](#query-parameters-reference)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

---

## Overview

### What Are Resources?

Resources are **fragments of specialized knowledge** that can be loaded on-demand. Each resource contains:

- **Metadata**: Tags, capabilities, use-case scenarios
- **Content**: Expertise, patterns, examples, code
- **Token estimate**: Size for budget management

### Resource Organization with Progressive Loading

```
resources/
├── agents/           # AI agent definitions with progressive loading
│   ├── Core content (500-1000 tokens) ← Load immediately
│   └── Examples via orchestr8:// URIs ← Load on-demand
│       Example: sre-specialist
│       - Core: 180 tokens
│       - Examples: orchestr8://examples/infrastructure/sre-slo-configuration
│       - Savings: 52-82% typical
│
├── skills/           # Reusable techniques (focused fragments)
│   └── 600-900 token fragments with concrete examples
│
├── patterns/         # Design patterns
│   └── Architecture and implementation guidance
│
├── examples/         # Code examples (loaded on-demand)
│   └── Working code referenced by orchestr8:// URIs
│
├── guides/           # Setup guides
│   └── Step-by-step instructions
│
└── workflows/        # Process templates with JIT loading
    └── Phase-based resource loading with "→ Load" markers
```

**Progressive Loading Benefits:**
- **Core-first**: Essential knowledge loaded immediately
- **On-demand examples**: Load via orchestr8:// URIs when needed
- **Token efficiency**: 52-82% savings vs loading all content
- **Real example**: rust-expert-core (700 tokens) + advanced patterns (orchestr8://agents/rust-expert-advanced) loaded when needed

### Loading Modes

| Mode | Use Case | Syntax | Tokens | Speed |
|------|----------|--------|--------|-------|
| **Static** | Known resource | `orchestr8://category/id` | Exact | <5ms |
| **Catalog** | Discovery | `orchestr8://match?query=...&mode=catalog` | 50-120 | ~15ms |
| **Index** | Fast lookup | `orchestr8://match?query=...&mode=index` | 50-120 | ~5ms |
| **Full** | Ready-to-use | `orchestr8://match?query=...&mode=full` | 800-3000 | ~15ms |

### Resource Discovery Improvements (v8.0)

Orchestr8 maintains optimized indexes for efficient resource discovery:

**Index Statistics:**
- **383 fragments** indexed across all categories
- **1,675 useWhen scenarios** for context-aware matching
- **4,036 unique keywords** for semantic search
- **Quick-lookup cache** for common queries (<2ms response)

**Matching Performance:**
- **Index mode**: 5-10ms (keyword-based, tier 2)
- **Quick cache**: <2ms for common queries (tier 1)
- **Fuzzy fallback**: 15-20ms when needed (tier 3)
- **Cache hit rate**: 70-80% in typical usage

**Discovery Examples:**

**Fast lookup (index mode):**
```
orchestr8://match?query=retry+exponential+backoff&mode=index&maxResults=5
→ Returns top 5 in 5-10ms with keyword matching
```

**Catalog discovery:**
```
orchestr8://match?query=typescript+api+authentication&mode=catalog&maxResults=15
→ Returns 15 ranked results in 15-20ms with semantic scoring
```

**Full content assembly:**
```
orchestr8://match?query=python+async+patterns&mode=full&maxTokens=2500
→ Returns assembled content within token budget in 15-20ms
```

---

## Resource Categories

### Agents

**AI agent definitions with specialized expertise**

**What they contain:**
- Core language/framework knowledge
- Best practices and conventions
- Common patterns and anti-patterns
- Problem-solving approaches

**Example agents:**
- `typescript-core` - Type system expertise
- `python-async-fundamentals` - Python async/await
- `rust-ownership-lifetimes` - Rust memory safety
- `react-hooks-patterns` - React hooks best practices

**When to use:**
- Need expertise in specific language/framework
- Building features in particular tech stack
- Want best practices and conventions
- Need architectural guidance

**Example URIs:**
```
orchestr8://agents/typescript-core
orchestr8://agents/python-async-fundamentals
orchestr8://agents/go-concurrency-patterns
```

**Dynamic loading:**
```
orchestr8://agents/match?query=typescript+generics+api
```

---

### Skills

**Reusable techniques and best practices**

**What they contain:**
- Specific techniques and patterns
- Implementation examples
- Common pitfalls and solutions
- Testing strategies

**Example skills:**
- `error-handling-resilience` - Retry, circuit breakers, timeouts
- `api-design-rest` - REST API best practices
- `testing-integration` - Integration testing strategies
- `caching-strategies` - Cache patterns and implementations

**When to use:**
- Need specific technique or pattern
- Solving common problems
- Implementing cross-cutting concerns
- Learning best practices for specific topic

**Example URIs:**
```
orchestr8://skills/error-handling-resilience
orchestr8://skills/api-design-rest
orchestr8://skills/database-optimization
```

**Dynamic loading:**
```
orchestr8://skills/match?query=retry+exponential+backoff
```

---

### Patterns

**Design patterns and architectural approaches**

**What they contain:**
- Architectural patterns
- Design principles
- System design approaches
- Implementation guidance

**Example patterns:**
- `microservices-architecture` - Microservices design
- `security-auth-jwt` - JWT authentication pattern
- `autonomous-organization` - Self-organizing systems
- `event-sourcing` - Event-driven architecture

**When to use:**
- Designing system architecture
- Solving architectural problems
- Need design pattern guidance
- Implementing complex systems

**Example URIs:**
```
orchestr8://patterns/microservices-architecture
orchestr8://patterns/security-auth-jwt
orchestr8://patterns/event-sourcing
```

**Dynamic loading:**
```
orchestr8://patterns/match?query=microservices+api+gateway
```

---

### Examples

**Code examples and reference implementations**

**What they contain:**
- Working code examples
- Implementation patterns
- Configuration examples
- Best practices demonstrations

**Example examples:**
- `express-jwt-auth` - Express JWT authentication
- `fastapi-async-crud` - FastAPI async CRUD
- `docker-multistage-nodejs` - Docker multi-stage builds
- `kubernetes-deployment` - Kubernetes deployment configs

**When to use:**
- Need working code reference
- Want implementation example
- Learning new technology
- Starting new implementation

**Example URIs:**
```
orchestr8://examples/express-jwt-auth
orchestr8://examples/fastapi-async-crud
orchestr8://examples/docker-multistage-nodejs
```

**Dynamic loading:**
```
orchestr8://examples/match?query=express+middleware+auth
```

---

### Guides

**Setup and configuration guides**

**What they contain:**
- Step-by-step setup instructions
- Configuration examples
- Tool setup and usage
- Platform-specific guidance

**Example guides:**
- `aws-eks-setup` - AWS EKS cluster setup
- `docker-compose-development` - Docker Compose for dev
- `github-actions-cicd` - GitHub Actions setup
- `monitoring-prometheus-grafana` - Monitoring stack

**When to use:**
- Setting up infrastructure
- Configuring tools and platforms
- Need deployment guidance
- Platform-specific setup

**Example URIs:**
```
orchestr8://guides/aws-eks-setup
orchestr8://guides/docker-compose-development
orchestr8://guides/github-actions-cicd
```

**Dynamic loading:**
```
orchestr8://guides/match?query=kubernetes+aws+setup
```

---

### Best Practices

**Code standards and quality guidelines**

**What they contain:**
- Coding standards
- Quality metrics
- Review checklists
- Industry best practices

**Example best practices:**
- `code-review-checklist` - Code review guidelines
- `security-owasp-top10` - OWASP security practices
- `testing-coverage-standards` - Testing standards
- `documentation-standards` - Documentation guidelines

**When to use:**
- Setting up standards
- Code review process
- Quality assurance
- Team guidelines

**Example URIs:**
```
orchestr8://best-practices/code-review-checklist
orchestr8://best-practices/security-owasp-top10
orchestr8://best-practices/api-versioning
```

**Dynamic loading:**
```
orchestr8://best-practices/match?query=api+design+standards
```

---

### Workflows

**Process templates and execution strategies**

**What they contain:**
- Process workflows
- Phase-based execution
- Checkpoint systems
- Parallel execution strategies

**Example workflows:**
- `workflow-new-project` - New project workflow
- `workflow-add-feature` - Feature addition workflow
- `workflow-fix-bug` - Bug fixing workflow
- `workflow-deploy` - Deployment workflow

**When to use:**
- Need process guidance
- Complex multi-phase tasks
- Want structured approach
- Learning workflow patterns

**Example URIs:**
```
orchestr8://workflows/workflow-new-project
orchestr8://workflows/workflow-add-feature
orchestr8://workflows/workflow-code-review
```

**Dynamic loading:**
```
orchestr8://workflows/match?query=deployment+production+rollback
```

---

## Static Resource Loading

### Direct URI Loading

Load a specific resource when you know exactly what you need.

**URI Format:**
```
orchestr8://category/fragment-id
```

**Examples:**

Load TypeScript core expertise:
```
orchestr8://agents/typescript-core
```

Load error handling skill:
```
orchestr8://skills/error-handling-resilience
```

Load JWT auth pattern:
```
orchestr8://patterns/security-auth-jwt
```

Load Express example:
```
orchestr8://examples/express-jwt-auth
```

### When to Use Static Loading

**Use static loading when:**
- You know the exact resource needed
- O(1) lookup is preferred (instant)
- Predictable token cost is required
- Resource name is explicit in requirements

**Advantages:**
- Fastest loading (<5ms)
- Predictable token usage
- No matching overhead
- Direct file access

**Token usage:**
- Exact fragment size (typically 500-1000 tokens)
- No matching overhead
- Cached for subsequent loads (4-hour TTL)

---

## Dynamic Resource Matching

### Query-Based Discovery

Find relevant resources based on semantic queries.

**URI Format:**
```
orchestr8://[category]/match?query=<search>&[options]
```

### Matching Modes

#### 1. Catalog Mode (Default)

**Lightweight resource discovery**

```
orchestr8://match?query=typescript+testing&mode=catalog&maxResults=10
```

**Returns:**
```
Top 10 Matches for "typescript testing"

1. TypeScript Testing Patterns (Score: 85)
   URI: orchestr8://agents/typescript-testing
   Tokens: 720
   Tags: typescript, testing, jest, unit-tests

2. Integration Testing Strategies (Score: 72)
   URI: orchestr8://skills/testing-integration
   Tokens: 680
   Tags: testing, integration, api, e2e

[... 8 more results ...]
```

**Characteristics:**
- **Tokens:** 50-120 (lightweight)
- **Latency:** 15-20ms
- **Use case:** Discovery, browsing, planning

**When to use:**
- Exploring available resources
- Planning token budget
- Want to review options first
- Unsure what's available

---

#### 2. Index Mode

**Ultra-fast keyword-based lookup**

```
orchestr8://match?query=retry+exponential+backoff&mode=index&maxResults=5
```

**Returns:**
```
Top 5 Matches (Index Lookup)

1. Error Handling Resilience (Score: 95)
   URI: orchestr8://skills/error-handling-resilience
   Matches: retry, exponential, backoff, timeout

2. API Reliability Patterns (Score: 78)
   URI: orchestr8://patterns/api-reliability
   Matches: retry, exponential, timeout

[... 3 more results ...]
```

**Characteristics:**
- **Tokens:** 50-120 (same as catalog)
- **Latency:** 5-10ms (much faster)
- **Use case:** Specific queries, production

**When to use:**
- Specific keyword-based queries
- Speed is critical
- Token budget is tight
- Well-defined requirements

---

#### 3. Full Mode

**Complete content immediately**

```
orchestr8://match?query=typescript+developer&mode=full&maxTokens=2000&categories=agents
```

**Returns:**
```
## Agent: typescript-core
**Score:** 95
**Tags:** typescript, types, generics, type-inference
**Capabilities:**
- Complex type system design
- Generic type constraints
- Conditional and mapped types

[Full fragment content...]

---

## Agent: typescript-async-patterns
**Score:** 82
**Tags:** typescript, async, promises, error-handling

[Full fragment content...]

Total: 1,950 tokens
```

**Characteristics:**
- **Tokens:** 800-3000 (full content)
- **Latency:** 15-20ms
- **Use case:** Ready-to-use content

**When to use:**
- Need content immediately
- Know exactly what you want
- Budget allows 2000-5000 tokens
- Convenience over efficiency

---

## Query Parameters Reference

### Required Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `query` | string | Search terms (use `+` for spaces) | `typescript+async+api` |

### Optional Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `mode` | enum | `catalog` | `catalog`, `full`, or `index` |
| `maxTokens` | number | 3000 | Max tokens (full mode only) |
| `maxResults` | number | 15 | Max results (catalog/index) |
| `minScore` | number | 10 | Min relevance score (0-100) |
| `categories` | string | all | Category filter (comma-separated) |
| `tags` | string | none | Required tags (comma-separated) |

### Parameter Examples

**Basic query:**
```
orchestr8://match?query=error+handling
```

**With mode:**
```
orchestr8://match?query=error+handling&mode=index
```

**With token budget:**
```
orchestr8://match?query=typescript+api&mode=full&maxTokens=2500
```

**With category filter:**
```
orchestr8://match?query=testing&categories=skills,patterns
```

**With result limit:**
```
orchestr8://match?query=kubernetes&mode=catalog&maxResults=5
```

**With score threshold:**
```
orchestr8://match?query=security&minScore=20
```

**With required tags:**
```
orchestr8://match?query=api&tags=typescript,rest
```

**Category-specific:**
```
orchestr8://agents/match?query=build+graphql+api
```

---

## Best Practices

### Choosing Resources

**1. Use specific resources when known:**
```
orchestr8://agents/typescript-core
```
Better than:
```
orchestr8://match?query=typescript&mode=full
```

**2. Use catalog mode for discovery:**
```
# First: Discover
orchestr8://match?query=testing+patterns&mode=catalog

# Then: Load specific
orchestr8://skills/testing-integration
```

**3. Use index mode for speed:**
```
orchestr8://match?query=retry+backoff&mode=index
```

**4. Category filters for precision:**
```
orchestr8://skills/match?query=error+handling
```
Better than:
```
orchestr8://match?query=error+handling
```

### Writing Queries

**Good queries** (specific keywords):
```
typescript async error handling retry
kubernetes deployment helm production
jwt authentication refresh tokens security
```

**Avoid** (too generic):
```
api development
error handling
backend code
```

**Use specific terms:**
- ✅ `retry exponential backoff circuit breaker`
- ❌ `error handling`

**Include context:**
- ✅ `express middleware jwt authentication`
- ❌ `authentication`

**Technology-specific:**
- ✅ `typescript generics constraints inference`
- ❌ `typescript`

### Token Budget Management

**Quick reference** (500-1000 tokens):
```
orchestr8://agents/typescript-core
```

**Task context** (1500-2500 tokens):
```
orchestr8://match?query=typescript+api+testing&mode=full&maxTokens=2500
```

**Deep expertise** (3000-5000 tokens):
```
orchestr8://match?query=microservices+kubernetes+deployment&mode=full&maxTokens=5000
```

**Progressive loading:**
```
# Step 1: Core (1000 tokens)
orchestr8://agents/typescript-core

# Step 2: Skills (500 tokens)
orchestr8://skills/api-design-rest

# Step 3: Examples (800 tokens)
orchestr8://examples/express-jwt-auth
```

---

## Common Patterns

### Pattern 1: Catalog → Load

**Most token-efficient approach**

```
# Step 1: Discover (100 tokens)
orchestr8://match?query=kubernetes+deployment&mode=catalog&maxResults=10

# Step 2: Review results
# - kubernetes-deployment-guide (1200 tokens)
# - helm-charts-pattern (800 tokens)
# - docker-compose-dev (600 tokens)

# Step 3: Load specific (2000 tokens)
orchestr8://guides/kubernetes-deployment
orchestr8://patterns/helm-charts
```

**Total:** 2100 tokens (vs 5000+ loading everything)

### Pattern 2: Index Lookup

**Fastest approach**

```
orchestr8://match?query=circuit+breaker+timeout&mode=index&maxResults=5
```

**Result:** Top 5 in <10ms, 50-120 tokens

### Pattern 3: Agent + Skills

**Comprehensive expertise**

```
# Agent for core expertise
orchestr8://agents/typescript-core

# Skills for specific techniques
orchestr8://skills/error-handling-resilience
orchestr8://skills/testing-integration
```

### Pattern 4: Pattern + Example

**Theory + practice**

```
# Pattern for design
orchestr8://patterns/microservices-architecture

# Example for implementation
orchestr8://examples/nodejs-microservice
```

### Pattern 5: Multi-Category Search

**Broad discovery**

```
orchestr8://match?query=authentication+jwt&categories=skills,patterns,examples&mode=catalog
```

---

## Troubleshooting

### No Results Returned

**Problem:** Query returns no matches

**Solutions:**
1. Try broader keywords
2. Remove category filter
3. Lower minScore threshold
4. Use catalog mode (more forgiving)
5. Check spelling of keywords

**Example:**
```
# Too specific
orchestr8://match?query=typescript+generic+type+constraints+inference+advanced&minScore=50

# Better
orchestr8://match?query=typescript+generics&minScore=10
```

### Too Many Results

**Problem:** Too many irrelevant results

**Solutions:**
1. Add more specific keywords
2. Use category filter
3. Increase minScore
4. Add required tags
5. Use index mode

**Example:**
```
# Too broad
orchestr8://match?query=api

# Better
orchestr8://match?query=rest+api+authentication+jwt&categories=skills,patterns
```

### Wrong Resources Loaded

**Problem:** Results don't match intent

**Solutions:**
1. Use more specific keywords
2. Review catalog first
3. Add technology-specific terms
4. Use category filters
5. Try index mode

### Performance Issues

**Problem:** Queries are slow

**Solutions:**
1. Use index mode for speed
2. Add category filters
3. Reduce maxResults
4. Check cache (should be fast on repeat)
5. Use static URIs when known

---

## Related Documentation

- [Usage Overview](./README.md) - Core usage concepts
- [Workflows Guide](./workflows.md) - Workflow documentation
- [Resource System](../resources/README.md) - Resource architecture
- [Matching System](../matching/README.md) - How matching works
- [Examples](../examples/README.md) - Practical examples

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
