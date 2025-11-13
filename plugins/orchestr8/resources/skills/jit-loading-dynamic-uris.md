---
id: jit-loading-dynamic-uris
category: skill
tags: [jit, loading, dynamic-uris, fuzzy-matching, query-construction, orchestr8, meta]
capabilities:
  - Dynamic MCP URI construction from user input
  - Query-based resource loading with fuzzy matching
  - Conditional loading based on project requirements
  - Tag-filtered and category-filtered queries
useWhen:
  - Implementing dynamic resource URIs for JIT fragment loading with fuzzy query parameters and match thresholds
  - Building orchestr8:// URI scheme for agent and skill discovery enabling declarative workflow composition
  - Designing URI-based fragment resolution with fallback strategies when exact matches are unavailable
  - Creating parameterized resource loading patterns supporting wildcard queries and multi-fragment selection
  - Implementing lazy evaluation for workflow resources deferring fragment loading until execution context requires it
estimatedTokens: 680
---

# JIT Loading: Dynamic URI Construction

Construct dynamic orchestr8:// URIs for query-based resource loading using fuzzy matching and filtering.

## Static vs Dynamic

**Static (when requirements are fixed):**
```markdown
orchestr8://agents/typescript-developer
orchestr8://skills/error-handling

→ Use when: Specific expertise always needed
```

**Dynamic (when requirements vary):**
```markdown
orchestr8://agents/match?query=${project-type}+${technology}
orchestr8://skills/match?query=${technique}+${context}

→ Use when: Expertise depends on user request
```

## Dynamic URI Patterns

### Pattern 1: Query from User Input

```markdown
User request: "Build a TypeScript REST API with JWT auth"

Phase 1:
orchestr8://agents/match?query=research+api+requirements&mode=index&maxResults=3

Phase 2:
orchestr8://agents/match?query=typescript+api+rest+backend&mode=index&maxResults=8

Phase 3:
orchestr8://skills/match?query=jwt+authentication+typescript&mode=index&maxResults=5
```

### Pattern 2: Query from Phase Findings

```markdown
## Phase 1: Research (0-15%)
Determine: Need Python FastAPI + PostgreSQL + JWT

## Phase 2: Implementation (15-85%)
**→ Load based on Phase 1:**
orchestr8://match?query=python+fastapi+postgresql+jwt&categories=agent,skill&mode=index&maxResults=10

→ Loads exactly what Phase 1 identified
```

### Pattern 3: Category Filtering

```markdown
Early phases (research/design):
orchestr8://agents/match?query=${domain}
→ Load expert agents only

Middle phases (implementation):
orchestr8://match?query=${tech}+${feature}&categories=agent,skill,example
→ Load agents + skills + code examples

Late phases (testing/deployment):
orchestr8://skills/match?query=testing+deployment+${tech}
→ Load skills only
```

### Pattern 4: Tag-Filtered Queries

```markdown
## Phase 3: Security (60-75%)
**→ Load security expertise:**
orchestr8://skills/match?query=security+authentication+authorization&tags=jwt,oauth&mode=index&maxResults=8

Filter to specific techniques using tags parameter
```

## Argument Substitution

```markdown
---
arguments:
  - name: project-description
    required: true
  - name: tech-stack
    required: false
---

## Phase 1
**→ Reference:** `orchestr8://match?query=${project-description}&categories=agent&mode=index&maxResults=8`

## Phase 2
**→ Reference:** `orchestr8://match?query=${tech-stack}+architecture&categories=pattern&mode=index&maxResults=5`

Variables are substituted at runtime
```

## Conditional Loading

```markdown
## Phase 2: Implementation (30-80%)

If building API:
**→ Load:** `orchestr8://match?query=${language}+api+rest&mode=index&maxResults=8`

If building CLI:
**→ Load:** `orchestr8://match?query=${language}+cli+command&mode=index&maxResults=8`

If building web app:
**→ Load:** `orchestr8://match?query=${language}+web+frontend&mode=index&maxResults=10`

Load different expertise based on project type
```

## Complete Example

```markdown
---
name: build-api
arguments:
  - name: api-description
    required: true
---

# Build API Workflow

**Request:** ${api-description}

## Phase 1: Requirements Analysis (0-15%)

**→ Research Expertise:**
orchestr8://agents/match?query=research+api+requirements&mode=index&maxResults=3

Tasks:
- Extract technology stack from ${api-description}
- Identify features and endpoints
- Determine authentication needs

## Phase 2: Architecture Design (15-30%)

**→ Domain Experts (based on Phase 1 findings):**
orchestr8://match?query=${tech-stack}+api+architecture&categories=agent,pattern&mode=index&maxResults=8

Tasks:
- Design API structure
- Plan data models
- Choose patterns (REST, GraphQL, etc.)

## Phase 3: Implementation (30-80%)

**→ Implementation Expertise:**
orchestr8://match?query=${tech}+${features}+${auth-method}&categories=agent,skill,example&mode=index&maxResults=10

Tasks:
- Implement endpoints
- Add authentication
- Error handling
- Validation

## Phase 4: Testing & Deployment (80-100%)

**→ Testing & Deployment Skills:**
orchestr8://skills/match?query=testing+deployment+api+${tech}&mode=index&maxResults=5

Tasks:
- Write tests (>80% coverage)
- Setup CI/CD
- Deployment configuration

Total budget: ~5900 tokens
Utilization: ~90%+ (highly relevant content)
```

## Best Practices

✅ **Use dynamic URIs** - Query-based matching when requirements vary
✅ **Category filters** - Narrow search space (agents vs skills vs patterns)
✅ **Argument substitution** - Use ${arg-name} in dynamic URIs
✅ **Conditional loading** - Load based on project-specific requirements
✅ **Tag filtering** - Further narrow results by technology tags
✅ **Progressive refinement** - Use Phase N findings for Phase N+1 queries

❌ **Static when dynamic** - Use dynamic URIs when requirements vary
❌ **No category filter** - Always filter when possible
❌ **Hardcoded queries** - Use argument substitution
❌ **Generic queries** - Be specific for better matches
