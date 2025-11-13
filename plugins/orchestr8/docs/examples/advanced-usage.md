# Advanced Usage Examples

> **Complex patterns, optimization strategies, and production usage**

This guide covers advanced Orchestr8 usage patterns for power users, performance optimization, and production deployments.

## Table of Contents

- [Complex Query Patterns](#complex-query-patterns)
- [Token Budget Optimization](#token-budget-optimization)
- [Cross-Category Matching](#cross-category-matching)
- [Index-Based Lookup](#index-based-lookup)
- [Performance Optimization](#performance-optimization)
- [Production Usage Patterns](#production-usage-patterns)
- [Custom Integration Scenarios](#custom-integration-scenarios)

---

## Complex Query Patterns

### Multi-Technology Stack Query

**Scenario:** Building full-stack app with TypeScript, React, and PostgreSQL

**Query:**
```
orchestr8://match?query=typescript+react+hooks+api+postgresql+authentication&mode=catalog&maxResults=20
```

**Strategy:**
1. Broad query captures all technologies
2. Catalog mode for discovery
3. High maxResults for comprehensive view

**Returns:** Resources across agents, skills, patterns, and examples

**Next steps:**
```
# Load core agents
orchestr8://agents/typescript-core
orchestr8://agents/react-hooks-patterns

# Load specific skills
orchestr8://skills/api-design-rest
orchestr8://skills/database-postgresql

# Load examples
orchestr8://examples/express-jwt-auth
orchestr8://examples/react-auth-flow
```

---

### Progressive Query Refinement

**Scenario:** Start broad, narrow down based on results

**Step 1 - Broad query:**
```
orchestr8://match?query=testing&mode=catalog&maxResults=20
```

**Result:** Too many results, too generic

**Step 2 - Add technology:**
```
orchestr8://match?query=typescript+testing&mode=catalog&maxResults=15
```

**Result:** Better, but still broad

**Step 3 - Add specificity:**
```
orchestr8://match?query=typescript+testing+unit+jest+mocking&mode=catalog&maxResults=10
```

**Result:** Highly relevant resources

**Lesson:** Start specific, broaden if needed (vs. start broad, narrow down)

---

### Context-Aware Query

**Scenario:** Query based on current task context

**Example - During API development:**
```
# Context: Building authentication endpoints
orchestr8://match?query=express+middleware+jwt+validation+error+handling

# Loads relevant patterns for current context
```

**Example - During testing:**
```
# Context: Writing integration tests
orchestr8://match?query=integration+testing+api+mocking+database
```

**Benefits:**
- Highly relevant results
- Task-focused expertise
- Efficient token usage

---

## Token Budget Optimization

### Strategy 1: Catalog-First Approach

**Goal:** Maximum token efficiency

**Approach:**
```
# Step 1: Catalog discovery (100 tokens)
orchestr8://match?query=kubernetes+deployment+production&mode=catalog&maxResults=15

# Step 2: Review and plan
# Available budget: 3000 tokens
# Selected resources:
#   - kubernetes-deployment (1200 tokens)
#   - helm-charts-pattern (800 tokens)
#   - monitoring-setup (600 tokens)
# Total: 2600 tokens (within budget)

# Step 3: Load selected resources
orchestr8://guides/kubernetes-deployment
orchestr8://patterns/helm-charts
orchestr8://guides/monitoring-setup
```

**Total tokens:** 100 + 2600 = 2700 tokens
**vs. loading everything:** 5000+ tokens
**Savings:** ~46%

---

### Strategy 2: Index Mode for Speed

**Goal:** Fastest queries with minimal tokens

**Approach:**
```
orchestr8://match?query=retry+exponential+backoff+circuit+breaker&mode=index&maxResults=5
```

**Performance:**
- **Latency:** 5-10ms (vs. 15-20ms fuzzy)
- **Tokens:** 50-120 (vs. 800-3000 full mode)
- **Accuracy:** High for keyword-based queries

**Use when:**
- Production queries
- Specific keywords known
- Speed critical
- Token budget tight

---

### Strategy 3: Progressive Loading with On-Demand Examples

**Goal:** Load core content immediately, examples on-demand

**Phase 1 - Core expertise (650 tokens):**
```
orchestr8://agents/typescript-core
# Returns: Core TypeScript knowledge
```

**Phase 2 - Add skills as needed (1,370 tokens):**
```
orchestr8://skills/api-design-rest  # 720 tokens
orchestr8://skills/error-handling-resilience  # 650 tokens
```

**Phase 3 - Load examples only when needed (on-demand):**
```
# Agent with progressive loading
orchestr8://agents/mlops-specialist  # 220 tokens core

# Returns core + on-demand example references:
# → orchestr8://examples/ml/mlops-pipeline-kubeflow
# → orchestr8://examples/ml/mlops-model-versioning

# Load example when implementing (900 tokens)
orchestr8://examples/ml/mlops-pipeline-kubeflow
```

**Total comparison:**
- **Without examples**: 2,020 tokens (core + skills)
- **With 1 example**: 2,920 tokens (selective)
- **Loading all examples upfront**: 5,500+ tokens
- **Savings: 47-63%**

**Benefits:**
- Core knowledge always available
- Examples loaded only when stuck
- Adjust based on implementation needs
- Real-world agents using this: sre-specialist (52-82% savings), mlops-specialist, dynamodb-specialist, sqlserver-specialist

---

### Strategy 4: Fragment Composition

**Goal:** Build custom expertise set within budget

**Budget:** 2500 tokens

**Composition:**
```
# Core (650 tokens)
orchestr8://agents/typescript-core

# API Design (720 tokens)
orchestr8://skills/api-design-rest

# Auth Pattern (680 tokens)
orchestr8://patterns/security-auth-jwt

# Testing (450 tokens)
orchestr8://skills/testing-unit
```

**Total:** 2500 tokens (exact budget match)
**Result:** Custom expertise tailored to task

---

## Cross-Category Matching

### Multi-Category Discovery

**Scenario:** Find all authentication resources

**Query:**
```
orchestr8://match?query=authentication+jwt+security&categories=agents,skills,patterns,examples&mode=catalog&maxResults=20
```

**Returns:**
```
Agents:
- security-expert
- typescript-api-development

Skills:
- api-security-best-practices
- error-handling-resilience

Patterns:
- security-auth-jwt
- microservices-security

Examples:
- express-jwt-auth
- fastapi-oauth2
```

**Use when:**
- Need comprehensive view
- Multiple resource types relevant
- Planning implementation
- Learning new topic

---

### Category-Weighted Query

**Scenario:** Prefer examples, but include patterns

**Strategy:**
```
# Query emphasizing examples
orchestr8://examples/match?query=authentication+jwt&mode=catalog&maxResults=10

# If insufficient, expand to patterns
orchestr8://match?query=authentication+jwt&categories=examples,patterns&mode=catalog
```

**Benefits:**
- Prioritizes preferred resource type
- Falls back to broader search if needed
- Maintains relevance

---

### Hierarchical Loading

**Scenario:** Load agent → skills → examples

**Approach:**
```
# Level 1: Core agent
orchestr8://agents/typescript-core

# Level 2: Related skills
orchestr8://skills/match?query=typescript+testing+error+handling&mode=catalog

# Level 3: Specific examples
orchestr8://examples/match?query=typescript+jest+mocking&mode=catalog
```

**Benefits:**
- Structured learning
- Progressive detail
- Natural workflow

---

## Index-Based Lookup

### High-Performance Queries

**Scenario:** Production system needing fast lookups

**Implementation:**
```
orchestr8://match?query=circuit+breaker+timeout+retry&mode=index&maxResults=5
```

**Performance characteristics:**
- **Tier 1 (Quick cache):** <2ms for common queries
- **Tier 2 (Keyword index):** 5-10ms for most queries
- **Tier 3 (Fuzzy fallback):** 15-20ms when needed

**Example results:**
```
1. Error Handling Resilience (Score: 95)
   Keywords: circuit-breaker, timeout, retry, exponential-backoff

2. API Reliability Patterns (Score: 88)
   Keywords: circuit-breaker, timeout, fallback

3. Microservices Patterns (Score: 76)
   Keywords: circuit-breaker, retry, resilience
```

---

### Keyword Optimization

**Scenario:** Optimize query for index lookup

**Poor query (generic):**
```
orchestr8://match?query=error+handling&mode=index
```

**Better query (specific keywords):**
```
orchestr8://match?query=retry+exponential+backoff+circuit+breaker+timeout&mode=index
```

**Best practices:**
- Use specific technical terms
- Include multiple related keywords
- Match fragment metadata keywords
- Avoid stop words

---

### Index + Fuzzy Hybrid

**Scenario:** Use index when possible, fuzzy as fallback

**Strategy:**
```
# Try index first (fast, specific)
orchestr8://match?query=kubernetes+helm+deployment&mode=index&maxResults=5

# If insufficient results, try fuzzy catalog
orchestr8://match?query=kubernetes+helm+deployment+production&mode=catalog&maxResults=10
```

**Benefits:**
- Fast path for common queries
- Fallback for edge cases
- Optimal performance/coverage balance

---

## Performance Optimization

### Caching Strategy

**Scenario:** Repeated queries in workflow

**Implementation:**
```
# First query (cold, ~15ms)
orchestr8://match?query=typescript+testing&mode=catalog

# Subsequent queries (cached, <1ms)
orchestr8://match?query=typescript+testing&mode=catalog
```

**Cache characteristics:**
- **Resource cache TTL:** 4 hours
- **Prompt cache TTL:** 1 hour
- **Cache key:** Full URI including query params
- **Hit rate:** ~70-80% in typical usage

**Optimization tips:**
- Reuse same queries when possible
- Batch related queries together
- Consider cache TTL in workflow design

---

### Parallel Loading

**Scenario:** Load multiple resources simultaneously

**Approach:**
```
# Load in parallel (if supported by client)
Promise.all([
  loadResource('orchestr8://agents/typescript-core'),
  loadResource('orchestr8://skills/api-design-rest'),
  loadResource('orchestr8://examples/express-minimal-api')
])
```

**Benefits:**
- Reduced total latency
- Better resource utilization
- Faster workflow execution

---

### Batch Query Planning

**Scenario:** Plan all queries upfront

**Strategy:**
```
# Analyze task requirements
Task: Build authenticated API with testing

# Plan queries:
1. Agent: typescript-core
2. Skills: api-design-rest, error-handling-resilience
3. Pattern: security-auth-jwt
4. Example: express-jwt-auth
5. Skills: testing-integration

# Execute plan with optimal loading order
```

**Benefits:**
- Predictable token usage
- Optimal loading sequence
- No redundant queries

---

## Production Usage Patterns

### High-Frequency Queries

**Scenario:** CI/CD pipeline querying Orchestr8

**Implementation:**
```
# Use index mode for speed
orchestr8://match?query=deployment+production+rollback&mode=index

# Cache-friendly queries (exact same URI)
orchestr8://workflows/workflow-deploy
```

**Best practices:**
- Use index mode
- Keep queries consistent (cache hits)
- Monitor latency and adjust
- Consider local caching layer

---

### Load Balancing Strategy

**Scenario:** Multiple concurrent requests

**Strategy:**
- Use stateless MCP servers
- Horizontal scaling if needed
- Cache sharing across instances
- Request queuing for rate limiting

**Implementation considerations:**
- MCP server is lightweight
- Index loads once per process
- Cache is process-local
- Consider Redis for shared cache

---

### Error Handling & Fallbacks

**Scenario:** Handle query failures gracefully

**Implementation:**
```
try {
  // Try specific query
  result = query('orchestr8://match?query=specific+keywords&mode=index')
} catch (error) {
  // Fallback to broader fuzzy query
  result = query('orchestr8://match?query=broader+terms&mode=catalog')
}

// Ultimate fallback: Static resource
if (!result) {
  result = query('orchestr8://agents/default-agent')
}
```

---

## Custom Integration Scenarios

### Workflow Automation with JIT Loading

**Scenario:** Automated feature generation with phase-based JIT loading

**Integration:**
```
# Script that implements JIT loading pattern
async function generateFeature(description, techStack) {
  // 1. Load workflow definition (2,400 tokens)
  const workflow = await loadResource('orchestr8://workflows/workflow-add-feature')

  // 2. Phase-based JIT loading
  const phases = {
    design: {
      query: `codebase+analysis+feature+design+${techStack}`,
      maxTokens: 1000,
      phase: '0-20%'
    },
    implementation: {
      query: `${techStack}+${extractFeatureType(description)}+implementation`,
      maxTokens: 2500,
      phase: '20-70%'
    },
    qa: {
      query: `${techStack}+testing+security+quality`,
      maxTokens: 1500,
      phase: '70-90%'
    },
    deploy: {
      query: `${platform}+deployment+feature+flags`,
      maxTokens: 1000,
      phase: '90-100%',
      conditional: true  // Only if deployment requested
    }
  }

  // 3. Execute workflow with progressive loading
  return await executeWorkflowWithJIT(workflow, phases, description)
}

async function executeWorkflowWithJIT(workflow, phases, description) {
  for (const [phaseName, config] of Object.entries(phases)) {
    if (config.conditional && !shouldDeploy()) continue

    // Load expertise for this phase only
    const expertise = await query(
      `orchestr8://match?query=${config.query}&maxTokens=${config.maxTokens}&mode=full`
    )

    // Execute phase with loaded expertise
    await executePhase(phaseName, expertise, description)
  }
}

// Token efficiency:
// - Traditional: Load all 10,000 tokens upfront
// - JIT pattern: Load 2,400-6,000 tokens progressively
// - Savings: 76%
```

---

### Code Generation Pipeline

**Scenario:** Generate code using patterns and examples

**Pipeline:**
```
1. Analyze requirements
   ↓
2. Load relevant patterns
   orchestr8://patterns/match?query=...
   ↓
3. Load code examples
   orchestr8://examples/match?query=...
   ↓
4. Generate code using patterns + examples
   ↓
5. Validate and test
```

---

### Documentation Generation

**Scenario:** Generate docs from resource metadata

**Implementation:**
```
# Load all resources in category
const agents = await query('orchestr8://agents/match?query=&mode=catalog&maxResults=100')

# Extract metadata for docs
agents.forEach(agent => {
  generateDoc({
    name: agent.id,
    tags: agent.tags,
    capabilities: agent.capabilities,
    useWhen: agent.useWhen
  })
})
```

---

### Testing Infrastructure

**Scenario:** Use resources in test suites

**Implementation:**
```
describe('API Tests', () => {
  beforeAll(async () => {
    // Load testing patterns
    testPatterns = await loadResource('orchestr8://skills/testing-integration')
  })

  test('API endpoints', () => {
    // Use patterns for test implementation
    applyTestPattern(testPatterns, apiEndpoints)
  })
})
```

---

## Related Documentation

- [Basic Usage Examples](./basic-usage.md) - Common scenarios
- [Usage Guide](../usage/README.md) - Core concepts
- [Performance Guide](../matching/performance.md) - Optimization details
- [Architecture](../architecture/README.md) - System design

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
