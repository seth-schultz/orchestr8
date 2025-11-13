---
id: dynamic-expertise-core
category: pattern
tags: [dynamic, jit, fuzzy-matching, context-optimization, mcp, uri]
capabilities:
  - Dynamic resource assembly fundamentals
  - Static vs dynamic URI patterns
  - Query construction strategies
  - Token budget management
useWhen:
  - Variable requirements across workflow invocations requiring JIT resource loading with orchestr8:// URIs and fuzzy matching queries
  - Token budget optimization needing dynamic expertise assembly instead of static fragment inclusion to minimize upfront token usage
  - Adaptive workflow construction requiring context-specific resource selection based on user input and runtime conditions
  - Multi-phase workflows where Phase 1 research results determine Phase 2 expertise needs with maxTokens budget control
estimatedTokens: 680
---

# Dynamic Expertise Assembly - Core Pattern

Assemble custom expertise on-demand using fuzzy matching instead of loading fixed resources, optimizing token usage while maximizing relevance.

## Problem Statement

**Traditional (Static) Approach:**
```markdown
Always load:
- orchestr8://agents/typescript-developer (1500 tokens)
- orchestr8://skills/testing (1000 tokens)
- orchestr8://patterns/rest-api (800 tokens)

Total: 3300 tokens
Problem: User might only need async patterns
Result: 400 tokens relevant, 2900 wasted (88% waste)
```

**Dynamic Assembly Solution:**
```markdown
Load based on actual query:
orchestr8://match?query=typescript+async+error+handling&mode=index&maxResults=8

Assembles only relevant fragments:
- typescript-core.md (600 tokens)
- typescript-async-patterns.md (450 tokens)
- error-handling-async.md (400 tokens)

Total: 1450 tokens, 100% relevant
Savings: 56% token reduction with better relevance
```

## URI Types

### Static URIs (Traditional)
```markdown
orchestr8://agents/typescript-developer
orchestr8://skills/error-handling
orchestr8://examples/typescript/rest-api

Always loads complete resource
Same content every time
No adaptation to request
```

### Dynamic URIs (Adaptive)
```markdown
Single-category:
orchestr8://agents/match?query=python+fastapi+api&mode=index&maxResults=8
orchestr8://skills/match?query=error+handling+async&mode=index&maxResults=5

Multi-category:
orchestr8://match?query=typescript+api+auth&categories=agent,skill,example&mode=index&maxResults=10

Tag-filtered:
orchestr8://skills/match?query=testing&tags=integration,api&mode=index&maxResults=8

Loads relevant fragments only
Adapts to specific request
Maximizes token efficiency
```

## Assembly Mechanisms

### 1. Single-Category Assembly

**Agent-only:**
```markdown
Use when need domain expertise only

Example:
orchestr8://agents/match?query=python+fastapi+api&mode=index&maxResults=8

Assembles:
- python-core (600 tokens) - Core Python expertise
- python-api-development (500 tokens) - API-specific knowledge

Total: 1100 tokens of focused Python API expertise
```

**Skill-only:**
```markdown
Use when need techniques/methods only

Example:
orchestr8://skills/match?query=error+handling+async+validation&mode=index&maxResults=5

Assembles:
- async-error-handling-patterns (520 tokens)
- input-validation (480 tokens)

Total: 1000 tokens of error handling techniques
```

**Pattern-only:**
```markdown
Use when need architectural guidance only

Example:
orchestr8://patterns/match?query=microservices+event+driven&mode=index&maxResults=5

Assembles:
- architecture-microservices (600 tokens)
- event-driven-patterns (400 tokens)

Total: 1000 tokens of architectural patterns
```

### 2. Multi-Category Assembly

**Full expertise:**
```markdown
Use when need comprehensive knowledge

Example:
orchestr8://match?query=typescript+api+rest+auth+testing&categories=agent,skill,pattern,example&mode=index&maxResults=15

Assembles:
- typescript-api-development (agent, 520 tokens)
- auth-jwt-middleware (skill, 480 tokens)
- api-layered-architecture (pattern, 600 tokens)
- testing-integration-api (skill, 580 tokens)
- typescript-express-auth (example, 450 tokens)

Total: 2630 tokens of comprehensive, relevant expertise
```

**Filtered assembly:**
```markdown
Use when need specific categories only

Example:
orchestr8://match?query=python+data+pipeline&categories=agent,skill&mode=index&maxResults=8

Assembles only agents and skills (excludes patterns/examples):
- python-core (agent, 600 tokens)
- python-async-patterns (agent, 450 tokens)
- error-handling-async (skill, 520 tokens)
- data-pipeline-orchestration (skill, 400 tokens)

Total: 1970 tokens focused on expertise and techniques
```

### 3. Tag-Filtered Assembly

**Require specific tags:**
```markdown
Use when need precise filtering

Example:
orchestr8://skills/match?query=testing&tags=integration,api&mode=index&maxResults=8

Only loads fragments tagged with BOTH "integration" AND "api":
- testing-integration-api (580 tokens)
- api-mock-strategies (450 tokens)

Excludes:
- testing-unit (tagged "unit", not "integration")
- testing-e2e (tagged "e2e", not "api")

Ensures high precision in results
```

## Query Construction Strategies

### Strategy 1: Argument-Based Queries

Extract key terms from user input:
```markdown
Workflow argument: ${task-description}
User provides: "Build a real-time chat application with TypeScript and WebSockets"

Extract keywords:
- Technology: typescript
- Feature: real-time, chat, websockets
- Type: application

Construct query:
orchestr8://match?query=typescript+real-time+websockets+chat&categories=agent,skill,example&mode=index&maxResults=10
```

### Strategy 2: Progressive Refinement

Start broad, refine based on findings:
```markdown
## Phase 1: Initial Requirements
orchestr8://agents/match?query=research+${domain}&mode=index&maxResults=3

Phase 1 determines: Need Python + FastAPI + PostgreSQL

## Phase 2: Targeted Implementation
orchestr8://match?query=python+fastapi+postgresql+api&categories=agent,skill&mode=index&maxResults=10

Load specific expertise based on Phase 1 discovery
```

### Strategy 3: Feature-Driven Queries

Query based on specific features:
```markdown
Core feature: API with authentication
Additional features: Caching, rate limiting, logging

Query 1 (core):
orchestr8://match?query=api+authentication+${tech}&mode=index&maxResults=8

Query 2 (enhancements):
orchestr8://skills/match?query=caching+rate-limiting+logging&mode=index&maxResults=5

Separate queries for core vs enhancements to control token allocation
```

### Strategy 4: Problem-Oriented Queries

Query based on problems to solve:
```markdown
Problem: Slow database queries in production

Query:
orchestr8://match?query=database+performance+optimization+query+indexing&categories=agent,skill,pattern&mode=index&maxResults=8

Assembles expertise relevant to the specific problem
```

## Token Budget Strategies

### Adaptive Budgeting
```markdown
Simple task: mode=index&maxResults=8
orchestr8://match?query=${simple-crud-api}&mode=index&maxResults=8

Medium complexity: mode=index&maxResults=10
orchestr8://match?query=${multi-service-integration}&mode=index&maxResults=10

High complexity: mode=index&maxResults=15
orchestr8://match?query=${distributed-system-event-driven}&mode=index&maxResults=15
```

### Phased Budgeting
```markdown
## Phase 1: Research (smaller budget)
orchestr8://agents/match?query=research+${domain}&mode=index&maxResults=3

## Phase 2: Design (medium budget)
orchestr8://match?query=${tech}+architecture&categories=agent,pattern&mode=index&maxResults=8

## Phase 3: Implementation (largest budget)
orchestr8://match?query=${tech}+${features}&categories=agent,skill,example&mode=index&maxResults=10

## Phase 4: Testing (focused budget)
orchestr8://skills/match?query=testing+${tech}&mode=index&maxResults=5
```

## Best Practices

✅ **Use argument substitution** - `${arg-name}` in dynamic URIs
✅ **Set appropriate budgets** - 1500-4000 based on complexity
✅ **Filter by category** - Narrow search space when possible
✅ **Extract keywords** - Pull key terms from user requests
✅ **Progressive refinement** - Use phase findings for next phase queries
✅ **Tag filtering** - Use `&tags=` when need specific techniques
✅ **Monitor relevance** - Aim for >85% token utilization

❌ **Don't use static URIs when requirements vary** - Miss optimization opportunity
❌ **Don't over-budget** - Wastes tokens on lower-relevance matches
❌ **Don't under-budget** - May miss important expertise
❌ **Don't skip category filters** - Increases noise in results
❌ **Don't use vague queries** - "development" vs "typescript api authentication"
