# Orchestr8 Usage Examples

> **Practical examples of using Orchestr8 MCP for development workflows**

This section provides real-world examples of using Orchestr8 workflows and resources to solve common development tasks.

## Overview

Examples are organized into two categories:

- **[Basic Usage](./basic-usage.md)** - Common scenarios and simple patterns
- **[Advanced Usage](./advanced-usage.md)** - Complex queries, optimization, and integration

## Quick Examples

### Example 1: Start a New TypeScript API Project (with JIT Loading)

```bash
/orchestr8:new-project Build a TypeScript REST API with JWT authentication and PostgreSQL

# The workflow uses phase-based JIT loading:
# Phase 1 (0-20%): → Load requirements+architecture (1,200 tokens)
# Phase 2 (20-30%): → Load typescript+project+setup (1,000 tokens)
# Phase 3 (30-70%): → Load typescript+api+implementation (3,500 tokens)
# Phase 4 (70-90%): → Load testing+security (2,000 tokens)
# Phase 5 (90-100%): → Load deployment (1,800 tokens, if needed)
#
# Total: 2,800-9,500 tokens progressive vs 12,000 upfront
# Savings: 77%
```

### Example 2: Add Authentication to Existing App (with JIT Loading)

```bash
/orchestr8:add-feature Add JWT authentication with refresh tokens

# The workflow uses progressive JIT loading:
# Phase 1 (0-20%): → Load codebase+analysis+design (1,000 tokens)
# Phase 2 (20-70%): → Load ${tech}+authentication+jwt (2,500 tokens)
#                      Single load supports backend, frontend, and tests
# Phase 3 (70-90%): → Load testing+security+quality (1,500 tokens)
# Phase 4 (90-100%): → Load deployment (1,000 tokens, conditional)
#
# Total: 5,000-6,000 tokens vs 10,000 upfront
# Savings: 76%
```

### Example 3: Find Testing Patterns (Progressive Discovery)

```
# Step 1: Fast lookup with index mode (5-10ms, 50-120 tokens)
orchestr8://match?query=testing+unit+integration&mode=index&maxResults=5

# Returns: testing-integration, testing-unit, testing-e2e, etc.

# Step 2: Load specific resource (680 tokens)
orchestr8://skills/testing-integration

# Total: 730-800 tokens vs 2,000+ loading all testing resources
# Savings: 60-70%
```

### Example 4: Load Specific Expertise (Static + Progressive)

```
# Core agent (immediate load, 650 tokens)
orchestr8://agents/typescript-core

# Skill fragment (720 tokens)
orchestr8://skills/error-handling-resilience

# Working example (850 tokens)
orchestr8://examples/express-jwt-auth

# Total: 2,220 tokens for complete expertise
# Progressive: Load core first, add skills/examples as needed
```

### Example 5: Progressive Agent Loading

```
# Agent with core content + on-demand examples
orchestr8://agents/sre-specialist

# Returns core (180 tokens) with references:
# → orchestr8://examples/infrastructure/sre-slo-configuration
# → orchestr8://examples/infrastructure/sre-incident-management

# Load examples only when needed:
orchestr8://examples/infrastructure/sre-slo-configuration  # 800 tokens

# Total: 980 tokens vs 2,000+ loading all SRE content upfront
# Savings: 52%
```

### Example 6: Fast Pattern Lookup (Index Mode)

```
# Use index mode for ultra-fast lookup (5-10ms)
orchestr8://match?query=retry+exponential+backoff+circuit+breaker&mode=index&maxResults=5

# Returns:
# 1. error-handling-resilience (Score: 95)
# 2. api-reliability-patterns (Score: 88)
# 3. microservices-patterns (Score: 76)

# Token cost: 50-120 tokens
# Latency: 5-10ms (tier 2), <2ms if cached (tier 1)
# vs Catalog mode: 15-20ms, same token cost
```

## Example Categories

### Basic Examples

**[Basic Usage Guide](./basic-usage.md)** covers:

- Loading specific agents and skills
- Using fuzzy matching for discovery
- Loading code examples
- Combining multiple resources
- Using catalog mode
- Running simple workflows

**Best for:**
- Getting started with Orchestr8
- Learning core concepts
- Common daily tasks
- Simple queries

### Advanced Examples

**[Advanced Usage Guide](./advanced-usage.md)** covers:

- Complex query patterns
- Token budget optimization
- Cross-category matching
- Index-based lookup strategies
- Custom integration scenarios
- Performance optimization
- Production usage patterns

**Best for:**
- Power users
- Complex projects
- Performance optimization
- Production deployments
- Custom integrations

## Common Scenarios

### Scenario: Starting a New Project

**Goal:** Build a new TypeScript REST API with authentication

**Approach:**
```bash
# Use new-project workflow
/orchestr8:new-project Build a TypeScript REST API with JWT auth, PostgreSQL, and Docker

# Workflow loads:
# - TypeScript developer agent
# - REST API patterns
# - JWT authentication examples
# - PostgreSQL integration guides
# - Docker configuration examples

# Result: Complete project setup with guidance
```

See [Basic Usage - New Project](./basic-usage.md#new-project-workflow) for details.

---

### Scenario: Adding a Feature

**Goal:** Add user profile management to existing app

**Approach:**
```bash
# Use add-feature workflow
/orchestr8:add-feature Add user profile management with avatar upload

# Workflow:
# 1. Analyzes codebase
# 2. Designs feature integration
# 3. Implements backend + frontend + tests
# 4. Provides deployment steps

# Result: Feature implemented with tests
```

See [Basic Usage - Add Feature](./basic-usage.md#add-feature-workflow) for details.

---

### Scenario: Debugging Production Issue

**Goal:** Fix API timeouts under high load

**Approach:**
```bash
# Use fix-bug workflow
/orchestr8:fix-bug API timeouts under high load

# Workflow:
# 1. Investigates timeout causes
# 2. Loads performance optimization patterns
# 3. Implements fixes (caching, connection pooling)
# 4. Adds monitoring
# 5. Validates solution

# Result: Performance improvements with monitoring
```

See [Basic Usage - Fix Bug](./basic-usage.md#fix-bug-workflow) for details.

---

### Scenario: Finding Specific Pattern

**Goal:** Find circuit breaker pattern for microservices

**Approach:**
```
# Step 1: Fast lookup with index
orchestr8://match?query=circuit+breaker+resilience&mode=index&maxResults=5

# Step 2: Review results
# - error-handling-resilience (Score: 95)
# - microservices-patterns (Score: 82)

# Step 3: Load specific resource
orchestr8://skills/error-handling-resilience
```

See [Advanced Usage - Index Lookup](./advanced-usage.md#index-based-lookup) for details.

---

### Scenario: Token Budget Optimization

**Goal:** Load expertise within 2000 token budget

**Approach:**
```
# Strategy 1: Catalog first (most efficient)
orchestr8://match?query=typescript+api+testing&mode=catalog

# Review (~100 tokens), then load selectively
orchestr8://agents/typescript-core       # 650 tokens
orchestr8://skills/api-design-rest       # 720 tokens
orchestr8://examples/express-minimal-api # 500 tokens

# Total: 1970 tokens (within budget)
```

See [Advanced Usage - Token Optimization](./advanced-usage.md#token-budget-optimization) for details.

---

### Scenario: Cross-Category Discovery

**Goal:** Find all resources related to authentication

**Approach:**
```
# Multi-category search
orchestr8://match?query=authentication+jwt+security&categories=skills,patterns,examples&mode=catalog&maxResults=15

# Results from:
# - Skills: error-handling, api-design
# - Patterns: security-auth-jwt, microservices
# - Examples: express-jwt-auth, fastapi-oauth
```

See [Advanced Usage - Cross-Category](./advanced-usage.md#cross-category-matching) for details.

---

## Example Workflows

### Development Workflows

| Workflow | Command | Example Scenario |
|----------|---------|------------------|
| New Project | `/new-project` | Start TypeScript REST API from scratch |
| Add Feature | `/add-feature` | Add user authentication to app |
| Fix Bug | `/fix-bug` | Debug and fix login issue |
| Refactor | `/refactor` | Improve error handling in service |

See [Basic Usage - Workflows](./basic-usage.md#workflow-examples) for examples.

### Quality Workflows

| Workflow | Command | Example Scenario |
|----------|---------|------------------|
| Review Code | `/review-code` | Review authentication module |
| Security Audit | `/security-audit` | Audit API endpoints |
| Optimize Performance | `/optimize-performance` | Optimize slow database queries |

See [Basic Usage - Quality Workflows](./basic-usage.md#quality-workflows) for examples.

### Deployment Workflows

| Workflow | Command | Example Scenario |
|----------|---------|------------------|
| Deploy | `/deploy` | Deploy to production with zero downtime |
| Setup CI/CD | `/setup-cicd` | Configure GitHub Actions pipeline |

See [Basic Usage - Deployment](./basic-usage.md#deployment-workflows) for examples.

---

## Resource Loading Examples

### Static Loading

**Load known resources directly:**

```
# TypeScript core expertise
orchestr8://agents/typescript-core

# Error handling skill
orchestr8://skills/error-handling-resilience

# JWT authentication pattern
orchestr8://patterns/security-auth-jwt

# Express API example
orchestr8://examples/express-jwt-auth
```

See [Basic Usage - Static Loading](./basic-usage.md#static-resource-loading) for examples.

### Dynamic Matching

**Discover resources with queries:**

```
# Catalog mode (discovery)
orchestr8://match?query=typescript+testing&mode=catalog&maxResults=10

# Index mode (fast lookup)
orchestr8://match?query=retry+backoff&mode=index&maxResults=5

# Full mode (complete content)
orchestr8://match?query=python+async&mode=full&maxTokens=2500
```

See [Basic Usage - Dynamic Matching](./basic-usage.md#dynamic-matching) for examples.

---

## Token Budget Examples

### Quick Reference (500-1000 tokens)

```
orchestr8://agents/typescript-core
```

**Use case:** Need quick expertise reference

### Task Context (1500-2500 tokens)

```
orchestr8://match?query=typescript+api+testing&mode=full&maxTokens=2500
```

**Use case:** Feature implementation, bug fix

### Deep Expertise (3000-5000 tokens)

```
orchestr8://match?query=microservices+kubernetes+deployment&mode=full&maxTokens=5000
```

**Use case:** Architecture design, complex system

See [Advanced Usage - Token Budgets](./advanced-usage.md#token-budget-strategies) for more.

---

## Performance Examples

### Fast Queries (<10ms)

```
# Index mode for specific keywords
orchestr8://match?query=circuit+breaker+timeout&mode=index
```

### Efficient Discovery (~100 tokens)

```
# Catalog mode for browsing
orchestr8://match?query=testing+patterns&mode=catalog&maxResults=10
```

### Progressive Loading

```
# Step 1: Core (1000 tokens)
orchestr8://agents/typescript-core

# Step 2: Skills as needed (500 tokens)
orchestr8://skills/api-design-rest

# Step 3: Examples if needed (800 tokens)
orchestr8://examples/express-jwt-auth
```

See [Advanced Usage - Performance](./advanced-usage.md#performance-optimization) for more.

---

## Web UI Examples

The Web UI provides interactive testing and exploration.

**Launch:**
```bash
npm run ui
# Open http://localhost:3000
```

**Features:**
- Browse all resources by category
- Test dynamic matching queries
- View resource content
- Monitor MCP server activity

See [Web UI Documentation](../web-ui.md) for full guide.

---

## Next Steps

**New users:** Start with [Basic Usage Examples](./basic-usage.md)

**Experienced users:** Explore [Advanced Usage Examples](./advanced-usage.md)

**Interactive learning:** Try the [Web UI](../web-ui.md)

**Deep dive:** Read the [Usage Guide](../usage/README.md)

---

## Related Documentation

- [Getting Started](../getting-started.md) - Installation and setup
- [Usage Guide](../usage/README.md) - Comprehensive usage documentation
- [Workflows Guide](../usage/workflows.md) - Workflow details
- [Resources Guide](../usage/resources.md) - Resource system
- [Web UI](../web-ui.md) - Interactive dashboard

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
