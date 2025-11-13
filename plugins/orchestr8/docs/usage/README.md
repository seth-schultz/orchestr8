# Orchestr8 Usage Guide

> **Comprehensive guide to using Orchestr8 MCP in Claude Code**

This guide covers everything you need to know to effectively use Orchestr8 for autonomous software development workflows.

## Table of Contents

- [Overview](#overview)
- [Core Concepts](#core-concepts)
- [Using Workflows](#using-workflows)
- [Loading Resources](#loading-resources)
- [Dynamic Matching](#dynamic-matching)
- [Token Budget Strategies](#token-budget-strategies)
- [Best Practices](#best-practices)
- [Related Documentation](#related-documentation)

---

## Overview

Orchestr8 provides two primary ways to interact with its knowledge system:

1. **Workflows (Slash Commands)**: Pre-built processes for common development tasks
2. **Resources**: On-demand loading of agents, skills, patterns, and examples

Both approaches use **just-in-time loading** to minimize token usage while providing comprehensive expertise when needed.

## Core Concepts

### Just-In-Time (JIT) Loading

Instead of loading all resources upfront, Orchestr8 loads only what's needed, phase by phase:

**Traditional approach** (inefficient):
```
Load: 200KB of resources upfront
Use: 5KB for current task
Waste: 195KB (97.5% unused)
```

**Orchestr8 approach with JIT** (efficient):
```
Phase 1: Load architecture patterns (1,200 tokens)
Phase 2: Load implementation expertise (2,500 tokens)
Phase 3: Load testing/QA skills (1,500 tokens)
Phase 4: Load deployment (only if needed, 1,000 tokens)

Total: 2,400-6,200 tokens progressive
Savings: 76-83% vs loading everything upfront
```

**Real-world examples:**
- **New Project workflow**: 77% savings (2,800 vs 12,000 tokens)
- **Add Feature workflow**: 76% savings (2,400 vs 10,000 tokens)
- **Performance Optimization**: 79% savings (3,200 vs 15,000 tokens)
- **Security Audit**: 83% savings (2,500 vs 15,000 tokens)
- **Refactor workflow**: 73% savings (2,200 vs 8,000 tokens)

### Fragment-Based Resources

Resources are broken into small, focused fragments with **progressive loading**:

```
typescript-developer agent
├── typescript-core (~650 tokens) ← Load first
├── typescript-async-patterns (~580 tokens) ← Load when needed
├── typescript-testing (~720 tokens) ← Load for testing phase
└── typescript-api-development (~900 tokens) ← Load for API work
```

**Progressive loading example:**
```
# Core content loaded immediately (650 tokens)
orchestr8://agents/typescript-core

# Additional examples loaded on-demand via orchestr8:// URIs:
→ orchestr8://examples/typescript-generics-example
→ orchestr8://examples/typescript-async-patterns
→ orchestr8://skills/typescript-testing-jest

Typical savings: 60-75% vs loading all examples upfront
```

**Benefits:**
- Load only relevant fragments
- Fine-grained token control with phase-based loading
- Easy to maintain and update
- Composable for complex tasks
- Real-world savings: 52-82% (e.g., sre-specialist: 180 core + on-demand examples)

### Static vs Dynamic Loading

**Static loading** - Direct URI reference:
```
orchestr8://agents/typescript-core
```
- O(1) lookup (instant)
- Predictable token cost
- Use when resource is known

**Dynamic loading** - Query-based discovery with phase budgets:
```
orchestr8://match?query=typescript+api+auth&maxTokens=2500&mode=catalog
```
- Finds relevant resources automatically
- Token budget-aware (respects maxTokens limit)
- Use when needs are inferred from context
- Typical in workflows: "→ Load" markers indicate JIT loading points

### Resource Discovery System

Orchestr8 maintains optimized indexes for fast resource discovery:

**Index Statistics (v8.0):**
- **383 fragments** indexed (agents, skills, patterns, examples, guides, workflows)
- **1,675 useWhen scenarios** for context matching
- **4,036 unique keywords** across all categories
- **Quick-lookup cache** for common queries (<2ms response)

**Matching Performance:**
- **Index mode**: 5-10ms (keyword-based matching)
- **Catalog mode**: 15-20ms (semantic scoring)
- **Full mode**: 15-20ms + assembly time
- **Cache hits**: <1ms for repeated queries

**Discovery Benefits:**
- Find relevant expertise without knowing exact resource names
- Automatic relevance ranking (0-100 score)
- Category filtering for precision
- Token budget awareness in full mode

## Using Workflows

Workflows are accessible via slash commands in Claude Code. Each workflow orchestrates a specific development process with **phase-based JIT loading**.

### Available Workflows

| Workflow | Command | Purpose |
|----------|---------|---------|
| **New Project** | `/new-project <description>` | Start new projects from scratch |
| **Add Feature** | `/add-feature <feature>` | Add features to existing codebase |
| **Fix Bug** | `/fix-bug <issue>` | Debug and fix issues |
| **Refactor** | `/refactor <goal>` | Improve code structure |
| **Review Code** | `/review-code <scope>` | Comprehensive code review |
| **Security Audit** | `/security-audit <target>` | Security vulnerability assessment |
| **Optimize Performance** | `/optimize-performance <issue>` | Performance optimization |
| **Deploy** | `/deploy <target>` | Deployment automation |
| **Setup CI/CD** | `/setup-cicd <platform>` | CI/CD pipeline configuration |

See [Workflows Guide](./workflows.md) for detailed documentation.

### Workflow Execution Flow

```
1. User runs slash command with description
   ↓
2. Workflow loads (~2KB)
   ↓
3. Workflow analyzes requirements
   ↓
4. Dynamic resource matching loads relevant expertise
   ↓
5. Workflow executes phases (design → implement → test → deploy)
   ↓
6. Result: Complete implementation with guidance
```

### Example: Adding a Feature with JIT Loading

```bash
/orchestr8:add-feature Add user authentication with JWT and refresh tokens
```

**What happens (with JIT loading markers):**

1. **Analysis & Design** (0-20%)
   - Parse requirements, analyze existing codebase

   **→ Load (JIT):**
   ```
   orchestr8://match?query=codebase+analysis+feature+design+${tech-stack}&maxTokens=1000
   ```
   - Loaded: requirement-analysis-framework, architecture-decision-records
   - **Tokens used: ~1,000**

2. **Implementation** (20-70%)
   - Parallel tracks: Backend + Frontend + Tests

   **→ Load (JIT):**
   ```
   orchestr8://match?query=${tech-stack}+authentication+jwt+implementation&maxTokens=2500
   ```
   - Loaded: Agent (typescript-api-development), Skills (security-auth-jwt), Examples (express-jwt-auth)
   - **Tokens used: ~2,500** (single load supports all parallel tracks)

3. **Quality** (70-90%)
   - Code review, Security scan, Test coverage

   **→ Load (JIT):**
   ```
   orchestr8://match?query=${tech-stack}+testing+security+quality&maxTokens=1500
   ```
   - Loaded: testing-e2e-best-practices, security-input-validation, quality-code-review-checklist
   - **Tokens used: ~1,500**

4. **Integration & Deploy** (90-100%)
   - Documentation, Deployment guidance

   **→ Load (JIT - CONDITIONAL):**
   ```
   # Only if production deployment requested
   orchestr8://match?query=${platform}+deployment+feature+flags&maxTokens=1000
   ```
   - Loaded: deployment-zero-downtime (if needed)
   - **Tokens used: ~1,000** (optional)

**Total Token Usage:**
- **Simple feature** (no deployment): ~5,000 tokens
- **With deployment**: ~6,000 tokens
- **vs loading everything upfront**: ~10,000 tokens
- **Savings: 76%**

## Loading Resources

Resources provide specialized expertise on-demand.

### Resource URI Format

```
orchestr8://category/resource
orchestr8://category/fragment-id
```

### Categories

| Category | Content | Example URI |
|----------|---------|-------------|
| **agents** | AI agent definitions | `orchestr8://agents/typescript-core` |
| **skills** | Reusable techniques | `orchestr8://skills/error-handling-resilience` |
| **patterns** | Design patterns | `orchestr8://patterns/microservices-architecture` |
| **examples** | Code examples | `orchestr8://examples/express-jwt-auth` |
| **guides** | Setup guides | `orchestr8://guides/aws-eks-setup` |
| **workflows** | Process templates | `orchestr8://workflows/workflow-new-project` |

### Loading a Specific Resource

```
Load TypeScript core expertise:
orchestr8://agents/typescript-core

Load JWT auth pattern:
orchestr8://patterns/security-auth-jwt

Load Express example:
orchestr8://examples/express-minimal-api
```

See [Resources Guide](./resources.md) for comprehensive resource documentation.

## Dynamic Matching

Dynamic matching finds relevant resources based on semantic queries.

### Matching Modes

Orchestr8 provides three matching modes:

#### 1. Index Mode (Recommended)

**Fastest, most token-efficient:**
```
orchestr8://match?query=retry+exponential+backoff&mode=index&maxResults=5
```

**Characteristics:**
- Latency: 5-10ms (index), <2ms (quick cache)
- Tokens: 50-120 tokens
- Method: Pre-built keyword indexes
- Best for: Specific queries, production use

#### 2. Catalog Mode (Default)

**Lightweight resource discovery:**
```
orchestr8://match?query=typescript+testing&mode=catalog&maxResults=10
```

**Characteristics:**
- Latency: 15-20ms
- Tokens: 50-120 tokens
- Method: Semantic scoring
- Best for: Exploratory queries, browsing

#### 3. Full Mode

**Complete content immediately:**
```
orchestr8://match?query=typescript+api&mode=full&maxTokens=2500&maxResults=3
```

**Characteristics:**
- Latency: 15-20ms
- Tokens: 800-3000 tokens
- Method: Semantic scoring + assembly
- Best for: Ready to use content

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `query` | string | required | Search terms (use `+` for spaces) |
| `mode` | enum | catalog | `index`, `catalog`, or `full` |
| `maxTokens` | number | 3000 | Token budget (full mode only) |
| `maxResults` | number | 15 | Max results (catalog/index mode) |
| `minScore` | number | 10 | Minimum relevance score (0-100) |
| `categories` | string | all | Category filter (comma-separated) |

### Query Examples

**Find TypeScript API expertise:**
```
orchestr8://match?query=typescript+rest+api+authentication&mode=catalog
```

**Fast lookup for specific pattern:**
```
orchestr8://match?query=circuit+breaker+timeout&mode=index&maxResults=5
```

**Load complete content:**
```
orchestr8://match?query=python+fastapi+async&mode=full&maxTokens=2500
```

**Category-specific search:**
```
orchestr8://agents/match?query=build+graphql+api&mode=catalog
```

**Multi-category search:**
```
orchestr8://match?query=testing+strategies&categories=skills,patterns&mode=catalog
```

## Token Budget Strategies

Optimize token usage based on task complexity and requirements.

### Budget Guidelines

| Task Complexity | Budget | Use Case |
|----------------|--------|----------|
| **Quick reference** | 500-1000 | Single concept, pattern, or example |
| **Task context** | 1500-2500 | Feature implementation, bug fix |
| **Deep expertise** | 3000-5000 | Complex architecture, system design |
| **Comprehensive** | 5000+ | New project, major refactoring |

### Strategy 1: Catalog First, Load Selectively

**Most token-efficient:**

1. Query with catalog mode
2. Review results
3. Load only what you need

```
Step 1: Discover
orchestr8://match?query=kubernetes+deployment&mode=catalog&maxResults=10

Step 2: Review catalog (100 tokens)
- kubernetes-deployment-guide
- helm-charts-pattern
- docker-compose-example

Step 3: Load specific resources (2000 tokens)
orchestr8://guides/kubernetes-deployment
orchestr8://patterns/helm-charts
```

**Token usage:** 100 + 2000 = 2100 tokens (vs 5000+ for loading everything)

### Strategy 2: Use Index Mode for Speed

**Fastest queries:**

```
orchestr8://match?query=retry+exponential+backoff&mode=index&maxResults=5
```

**Token usage:** 50-120 tokens
**Latency:** <10ms

### Strategy 3: Full Mode for Convenience

**When you need content immediately:**

```
orchestr8://match?query=typescript+developer&mode=full&maxTokens=2000&categories=agents
```

**Token usage:** ~2000 tokens (complete agent content)
**Trade-off:** Higher tokens, but saves separate load step

### Strategy 4: Category Filtering

**Narrow search scope:**

```
orchestr8://skills/match?query=error+handling&mode=catalog
```

**Benefits:**
- More relevant results
- Faster matching
- Lower token cost (fewer results)

### Strategy 5: Progressive Loading

**Start small, expand as needed:**

```
Step 1: Core expertise (1000 tokens)
orchestr8://agents/typescript-core

Step 2: Add specific skills (500 tokens)
orchestr8://skills/api-design-rest

Step 3: Add examples if needed (800 tokens)
orchestr8://examples/express-jwt-auth
```

**Total:** 2300 tokens, loaded progressively

## Best Practices

### Writing Effective Queries

**Good queries** (specific keywords):
```
typescript async error handling retry
kubernetes deployment helm charts production
jwt authentication refresh tokens security
```

**Avoid** (too generic):
```
api development
error handling
backend code
```

### Choosing the Right Mode

**Use index mode when:**
- You have specific keywords
- Speed is critical
- Token budget is tight
- Query is well-defined

**Use catalog mode when:**
- Exploring resources
- Unsure what's available
- Want to review options first
- Budget allows 100-200 tokens for discovery

**Use full mode when:**
- You know exactly what you need
- Ready to use content immediately
- Budget allows 2000-5000 tokens
- Convenience over efficiency

### Resource Selection

**Load specific resources when:**
- You know the exact resource needed
- O(1) lookup is preferred
- Predictable token cost required

**Use dynamic matching when:**
- Discovery is needed
- Resource names are unknown
- Context determines requirements
- Flexible composition needed

### Token Budget Allocation

**For feature development:**
```
Workflow: ~2KB
Resources: 2-3KB
Working space: Remaining tokens
```

**For bug fixing:**
```
Workflow: ~2KB
Diagnostics: 1-2KB
Working space: Remaining tokens
```

**For new project:**
```
Workflow: ~2KB
Architecture: 3-5KB
Working space: Remaining tokens
```

## Related Documentation

- [Workflows Guide](./workflows.md) - Detailed workflow documentation
- [Resources Guide](./resources.md) - Comprehensive resource guide
- [Examples](../examples/README.md) - Practical usage examples
- [Matching System](../matching/README.md) - How dynamic matching works
- [Architecture](../architecture/README.md) - System design and implementation

---

**Next Steps:**
- Read [Workflows Guide](./workflows.md) for workflow details
- Explore [Resources Guide](./resources.md) for resource system
- Try [Basic Examples](../examples/basic-usage.md) for hands-on practice

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
