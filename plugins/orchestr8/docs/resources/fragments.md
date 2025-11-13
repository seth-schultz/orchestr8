# Fragment System Documentation

Fragments are the fundamental building blocks of the Orchestr8 resource system. They are small, focused, composable units of knowledge designed for efficient just-in-time loading and dynamic assembly.

## What Are Fragments?

**Fragments** are self-contained markdown files containing specialized knowledge, code examples, patterns, or workflows. Each fragment:

- **Focuses on a single concept** (e.g., "TypeScript async patterns", "JWT authentication", "circuit breaker pattern")
- **Contains 500-1000 tokens** of content (ideal range)
- **Includes rich metadata** for discovery and matching
- **Lives in `` subdirectories** within resource categories
- **Can be loaded individually** or combined with other fragments

### Why Fragments?

Traditional monolithic resources have several problems:
- **Token waste:** Loading entire documents when only specific sections are needed
- **Poor composability:** Hard to mix and match expertise
- **Slow discovery:** Must scan full documents to find relevant content
- **Cache inefficiency:** Small changes invalidate large cached content

Fragments solve these problems by:
- **Token efficiency:** Load only what's needed (500-1000 tokens vs 5000+)
- **Dynamic composition:** Mix fragments to create custom expertise
- **Fast indexing:** Small units enable O(1) keyword lookups
- **Granular caching:** Cache individual fragments independently

## Fragment Structure

### File System Organization

```
resources/
├── agents/
│   ├──                       # Fragment subdirectory
│   │   ├── typescript-core.md           # Core TypeScript expertise
│   │   ├── typescript-async-patterns.md # Async/await patterns
│   │   ├── typescript-api-development.md # API development
│   │   ├── python-core.md
│   │   ├── python-async-fundamentals.md
│   │   └── ...
│   └── (optional full resources)        # Not recommended
├── skills/
│   └── 
│       ├── error-handling-resilience.md
│       ├── testing-integration.md
│       └── ...
└── patterns/
    └── 
        ├── autonomous-organization.md
        └── ...
```

**Key principles:**
- All fragments go in `` subdirectories
- One fragment per file
- Descriptive filenames (lowercase, hyphen-separated)
- Filename becomes part of fragment ID

### Fragment Anatomy

A fragment consists of two parts:

#### 1. Frontmatter (YAML metadata)

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

#### 2. Content (Markdown body)

```markdown
# TypeScript Core Expertise

## Generic Constraints & Inference

**Constraint patterns:**
```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>
```
...
```

See [Frontmatter Schema](#frontmatter-schema) for field details.

## Frontmatter Schema

### Required Fields

#### `id` (string)

Unique identifier for the fragment within its category.

```yaml
id: typescript-core
```

**Guidelines:**
- Lowercase, hyphen-separated
- Descriptive and specific
- Unique within category
- Should match filename (without .md extension)

**Examples:**
- `typescript-core`
- `python-async-fundamentals`
- `error-handling-resilience`
- `workflow-new-project`

#### `category` (enum)

The resource category this fragment belongs to.

```yaml
category: agent
```

**Valid values:**
- `agent` - AI agent expertise
- `skill` - Reusable technique or best practice
- `pattern` - Design or architectural pattern
- `example` - Code example
- `workflow` - Execution strategy

**Note:** Must match the directory the fragment is in:
- `agents/` → `category: agent`
- `skills/` → `category: skill`
- etc.

#### `tags` (array of strings)

Keywords for discovery and matching. Used heavily by index-based lookup.

```yaml
tags: [typescript, async, error-handling, retry, circuit-breaker]
```

**Guidelines:**
- **Lowercase only** (case-insensitive matching)
- **Specific keywords**, not generic (e.g., "jwt-auth" not "security")
- **Technology names** (typescript, python, kubernetes)
- **Technique names** (retry, circuit-breaker, memoization)
- **Domain terms** (authentication, validation, monitoring)
- **5-10 tags** ideal (more is better for discoverability)

**Good examples:**
```yaml
tags: [python, fastapi, pydantic, validation, async, rest-api]
tags: [kubernetes, helm, deployment, rolling-update, health-checks]
tags: [react, hooks, useeffect, context, state-management]
```

**Avoid:**
```yaml
tags: [code, programming, backend]  # Too generic
tags: [TypeScript, Python]          # Use lowercase
tags: [good, best, awesome]         # Subjective/unhelpful
```

#### `capabilities` (array of strings)

What this fragment enables you to do. Focus on outcomes, not features.

```yaml
capabilities:
  - Complex type system design
  - Generic type constraints and inference
  - Conditional and mapped types
  - Type-level programming
```

**Guidelines:**
- Start with **action verbs** (Design, Implement, Solve, Build)
- Focus on **outcomes** (what you can do with this knowledge)
- Be **specific** (not "use TypeScript" but "design type-safe APIs")
- **3-6 capabilities** per fragment

**Good examples:**
```yaml
capabilities:
  - Implement exponential backoff retry logic
  - Design circuit breaker patterns for fault tolerance
  - Handle transient failures in distributed systems
```

**Avoid:**
```yaml
capabilities:
  - Know error handling    # Not an outcome
  - Use try/catch          # Too basic
  - Write good code        # Too vague
```

#### `useWhen` (array of strings)

Specific scenarios when this fragment is relevant. MOST IMPORTANT for matching.

```yaml
useWhen:
  - Designing type-safe APIs using generic constraints (T extends keyof Type)
  - Solving complex type transformations with utility types
  - Implementing discriminated unions for type-safe state machines
  - Resolving type inference issues using type predicates
```

**Guidelines:**
- **Very specific scenarios** with concrete keywords
- Include **technical terms** (exponential backoff, circuit breaker, JWT)
- Mention **concrete use cases** (API calls, database queries, file uploads)
- **Action-oriented** (Implementing X, Building Y, Designing Z)
- **10-20 keywords per scenario** ideal for indexing
- **3-6 scenarios** per fragment

**Formula:** `[Action] [specific technique] for [concrete use case] with [technical details]`

**Excellent examples:**
```yaml
useWhen:
  - Implementing retry logic with exponential backoff for API calls experiencing intermittent timeouts
  - Building circuit breaker pattern for third-party service integration to prevent cascading failures
  - Designing fault-tolerant microservices with bulkhead isolation and fallback strategies
```

**Good examples:**
```yaml
useWhen:
  - Setting up JWT authentication for REST APIs
  - Validating request payloads using Pydantic models
  - Deploying containerized applications to Kubernetes clusters
```

**Avoid:**
```yaml
useWhen:
  - When you need error handling              # Too generic
  - For APIs                                   # No context
  - Building applications                      # Too vague
  - When using TypeScript                      # Not specific enough
```

#### `estimatedTokens` (number)

Approximate token count for the fragment content.

```yaml
estimatedTokens: 650
```

**Guidelines:**
- Rough approximation: **~4 characters per token**
- Include content only (not frontmatter)
- Round to nearest 10
- Validate with actual token counter if critical

**Calculation:**
```javascript
const content = "# Fragment content...";
const estimatedTokens = Math.ceil(content.length / 4);
```

**Typical ranges:**
- Small fragment: 400-600 tokens
- Medium fragment: 600-900 tokens
- Large fragment: 900-1200 tokens
- Very large: 1200-1800 tokens

### Optional Fields

#### `relatedFragments` (array of strings)

URIs of related fragments that complement this one.

```yaml
relatedFragments:
  - orchestr8://agents/typescript-async-patterns
  - orchestr8://skills/error-handling-async
```

**Use cases:**
- Suggest complementary expertise
- Build learning paths
- Enable "if you liked this, try that"

#### `dependencies` (array of strings)

Fragments that should be loaded before this one (prerequisite knowledge).

```yaml
dependencies:
  - orchestr8://agents/python-core
```

**Use cases:**
- Ensure foundational knowledge
- Build hierarchical expertise
- Support progressive loading

#### `version` (string)

Version of the fragment content (semantic versioning).

```yaml
version: 1.2.0
```

**Use cases:**
- Track content changes
- Deprecate old fragments
- Support backward compatibility

## Fragment Sizing Guidelines

### Ideal Size: 500-1000 Tokens

This range balances:
- **Focused scope** - Single concept or technique
- **Sufficient depth** - Enough detail to be useful
- **Efficient loading** - Small enough for quick load
- **Good composition** - Easily combined with others

### Size Categories

| Token Range | Category | Use Case | Examples |
|-------------|----------|----------|----------|
| 300-500 | **Micro** | Single technique or example | Code snippet, specific pattern |
| 500-800 | **Small** | Focused skill or concept | Error handling technique, API pattern |
| 800-1200 | **Medium** | Core expertise area | Language core concepts, framework fundamentals |
| 1200-1800 | **Large** | Comprehensive pattern | Complex workflow, multi-phase process |
| 1800+ | **Very Large** | Extensive guide | Full architectural pattern, detailed workflow |

### When to Split Fragments

**Split large topics into multiple fragments when:**

1. **Multiple distinct subtopics**
   ```
   Instead of: python-async (2500 tokens)
   Split into:
   - python-async-fundamentals (700 tokens)
   - python-async-context-managers (600 tokens)
   - python-async-iterators (550 tokens)
   - python-async-synchronization (650 tokens)
   ```

2. **Different use cases**
   ```
   Instead of: api-security (3000 tokens)
   Split into:
   - security-auth-jwt (680 tokens) - JWT authentication
   - security-auth-oauth (820 tokens) - OAuth flows
   - security-input-validation (590 tokens) - Input validation
   - security-rate-limiting (710 tokens) - Rate limiting
   ```

3. **Progressive complexity**
   ```
   Instead of: kubernetes-deployment (2800 tokens)
   Split into:
   - kubernetes-deployment-basic (650 tokens) - Basic deployments
   - kubernetes-deployment-patterns (780 tokens) - Advanced patterns
   - kubernetes-deployment-strategies (890 tokens) - Rolling, canary, blue-green
   ```

### When to Keep Large Fragments

**Keep fragments large (1200-1800 tokens) when:**

1. **Highly cohesive process** that loses value when split
   - Example: `autonomous-organization` (1800 tokens) - Complex workflow
   - Example: `workflow-new-project` (1600 tokens) - End-to-end process

2. **Strong narrative flow** where order matters
   - Example: Setup guides with sequential steps
   - Example: Debugging workflows with decision trees

3. **Cross-cutting concerns** that reference each other constantly
   - Example: State management pattern (components + hooks + context)
   - Example: Authentication flow (frontend + backend + middleware)

## Fragment Reusability Patterns

### Pattern 1: Core + Extensions

Create a core fragment with common fundamentals, plus extension fragments for specialized topics.

```
typescript-core (650 tokens)
  ├── Foundation: Type system, generics, utility types
  └── Extensions:
      ├── typescript-async-patterns (580 tokens)
      ├── typescript-testing (720 tokens)
      └── typescript-api-development (720 tokens)
```

**Benefits:**
- Load core for basic tasks
- Add extensions for specialized needs
- Avoid duplication

**Loading:**
```typescript
// Basic task: Load core only
orchestr8://agents/typescript-core

// API task: Load core + API extension
orchestr8://agents/typescript-core
orchestr8://agents/typescript-api-development
```

### Pattern 2: Skill Composition

Combine complementary skills for complex tasks.

```
Error-Resilient API Client
├── error-handling-resilience (710 tokens)  - Retry, circuit breaker
├── error-handling-logging (650 tokens)     - Structured logging
└── api-design-rest (720 tokens)            - REST best practices

Total: 2,080 tokens
```

**Benefits:**
- Mix and match skills
- Build custom expertise
- Token budget control

**Loading:**
```typescript
orchestr8://match?query=resilient+api+error+retry&maxTokens=2500
// Returns: All three fragments (2,080 tokens)
```

### Pattern 3: Workflow + Supporting Skills

Combine workflow with supporting skills it references.

```
Deployment Workflow
├── workflow-deploy (650 tokens)            - Deployment process
├── kubernetes-deployment-patterns (780 tokens) - K8s deployment
├── ci-cd-github-actions (690 tokens)       - CI/CD setup
└── observability-monitoring (720 tokens)   - Monitoring setup

Total: 2,840 tokens
```

**Benefits:**
- Workflow provides structure
- Skills provide details
- Self-contained expertise

**Loading:**
```typescript
orchestr8://workflows/workflow-deploy
// Workflow references other fragments
// System can auto-load referenced fragments
```

### Pattern 4: Language + Framework

Combine language core with framework-specific patterns.

```
FastAPI Developer
├── python-core (680 tokens)                - Python fundamentals
├── python-async-fundamentals (700 tokens)  - Async/await
├── python-fastapi-validation (650 tokens)  - Pydantic validation
└── python-fastapi-dependencies (620 tokens) - Dependency injection

Total: 2,650 tokens
```

**Benefits:**
- Foundation + specialization
- Progressive expertise
- Reuse language core across frameworks

**Loading:**
```typescript
orchestr8://agents/match?query=fastapi+pydantic+async&maxTokens=3000
// Returns: Combination of python and fastapi fragments
```

## Fragment Naming Conventions

### Naming Structure

```
{topic}-{subtopic}-{variant}.md
```

**Examples:**
- `typescript-core.md` - Core topic
- `typescript-async-patterns.md` - Topic + subtopic
- `python-fastapi-validation.md` - Topic + framework + subtopic
- `error-handling-resilience.md` - Topic + variant

### Category-Specific Conventions

#### Agents (`agents/`)

```
{language/domain}-{specialization}.md
```

**Examples:**
- `typescript-core.md`
- `python-async-fundamentals.md`
- `rust-expert-core.md`
- `frontend-react-expert.md`
- `database-architect-sql.md`

#### Skills (`skills/`)

```
{category}-{specific-skill}.md
```

**Examples:**
- `error-handling-resilience.md`
- `testing-integration-patterns.md`
- `security-authentication-jwt.md`
- `performance-database-optimization.md`

#### Patterns (`patterns/`)

```
{pattern-category}-{pattern-name}.md
```

**Examples:**
- `architecture-microservices.md`
- `event-driven-cqrs.md`
- `security-auth-oauth.md`
- `autonomous-organization.md`

#### Examples (`examples/`)

```
{technology}-{example-type}.md
```

**Examples:**
- `express-jwt-auth.md`
- `react-hooks-context.md`
- `kubernetes-deployment-basic.md`
- `terraform-vpc-setup.md`

#### Workflows (`workflows/`)

```
workflow-{task-name}.md
```

**Examples:**
- `workflow-new-project.md`
- `workflow-refactor.md`
- `workflow-deploy.md`
- `workflow-security-audit.md`

## Fragment Best Practices

### Content Writing

1. **Start with a clear title** (H1 heading)
   ```markdown
   # TypeScript Core Expertise
   ```

2. **Use structured sections** (H2, H3 headings)
   ```markdown
   ## Generic Constraints
   ### Constraint Patterns
   ### Inference Optimization
   ```

3. **Include code examples** liberally
   ```markdown
   **Pattern:**
   ```typescript
   function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>
   ```
   ```

4. **Bullet points for guidelines**
   ```markdown
   **Best practices:**
   - Use const assertions for literal types
   - Prefer unknown over any
   - Avoid deep recursive types (>5 levels)
   ```

5. **Tables for comparisons**
   ```markdown
   | Pattern | Use Case | Performance |
   |---------|----------|-------------|
   | Index signature | Dynamic keys | O(1) |
   | Mapped types | Type transformations | Compile-time |
   ```

### Metadata Writing

1. **Write specific useWhen scenarios**
   - Include 10-20 keywords per scenario
   - Use concrete technical terms
   - Describe specific situations

2. **Choose relevant tags**
   - Technology names (lowercase)
   - Technique names
   - Domain terms
   - 5-10 tags ideal

3. **Define clear capabilities**
   - Start with action verbs
   - Focus on outcomes
   - Be specific

4. **Estimate tokens accurately**
   - Use ~4 chars per token formula
   - Round to nearest 10
   - Exclude frontmatter from count

### Cross-Referencing

1. **Reference related fragments** in content
   ```markdown
   For async patterns, see [typescript-async-patterns](orchestr8://agents/typescript-async-patterns).
   ```

2. **Use relatedFragments** frontmatter
   ```yaml
   relatedFragments:
     - orchestr8://agents/typescript-async-patterns
   ```

3. **Mention dependencies**
   ```yaml
   dependencies:
     - orchestr8://agents/typescript-core
   ```

### Common Pitfalls

❌ **Don't duplicate content** across fragments
- Extract common content to a shared fragment
- Reference the shared fragment

❌ **Don't make fragments too small**
- <300 tokens often lack useful context
- Consider combining with related content

❌ **Don't make fragments too large**
- >1800 tokens hard to compose
- Consider splitting into subtopics

❌ **Don't write generic useWhen scenarios**
- "When building APIs" → too vague
- "Implementing JWT authentication with refresh token rotation for Express.js REST APIs" → specific

❌ **Don't use subjective tags**
- Avoid: "best", "good", "advanced", "easy"
- Use: specific technologies, techniques, domains

## Fragment Composition Examples

### Example 1: TypeScript API Developer

**Query:** "Build TypeScript Express API with JWT auth and error handling"

**Fragments assembled:**
```yaml
1. typescript-core (650 tokens)
   - Type system fundamentals

2. typescript-api-development (720 tokens)
   - Express, REST API patterns

3. express-jwt-auth (680 tokens)
   - JWT authentication implementation

4. error-handling-api-patterns (710 tokens)
   - API error handling strategies

Total: 2,760 tokens
```

**URI:**
```typescript
orchestr8://match?query=typescript+express+jwt+error+handling&maxTokens=3000
```

### Example 2: Kubernetes Deployment

**Query:** "Deploy Node.js app to Kubernetes with health checks and monitoring"

**Fragments assembled:**
```yaml
1. kubernetes-deployment-basic (650 tokens)
   - Basic K8s deployment concepts

2. kubernetes-health-checks (580 tokens)
   - Liveness and readiness probes

3. docker-multistage-nodejs (620 tokens)
   - Multi-stage Docker build for Node.js

4. observability-prometheus (740 tokens)
   - Prometheus monitoring setup

Total: 2,590 tokens
```

**URI:**
```typescript
orchestr8://match?query=kubernetes+nodejs+health+checks+monitoring&maxTokens=3000
```

### Example 3: React Frontend with State Management

**Query:** "Build React app with hooks, context, and API integration"

**Fragments assembled:**
```yaml
1. frontend-react-expert (820 tokens)
   - React fundamentals and patterns

2. react-hooks-state-management (690 tokens)
   - useState, useEffect, custom hooks

3. react-context-api (620 tokens)
   - Context API for global state

4. api-integration-fetch (580 tokens)
   - API calls with error handling

Total: 2,710 tokens
```

**URI:**
```typescript
orchestr8://agents/match?query=react+hooks+context+api+integration&maxTokens=3000
```

## Fragment Versioning

### Version Format

Use semantic versioning: `major.minor.patch`

```yaml
version: 1.2.0
```

**Version bumps:**
- **Major (1.0.0 → 2.0.0):** Breaking changes (incompatible structure)
- **Minor (1.0.0 → 1.1.0):** New content added (backward compatible)
- **Patch (1.0.0 → 1.0.1):** Bug fixes, typos, minor corrections

### Deprecation Strategy

**When deprecating a fragment:**

1. **Add deprecation notice** to content
   ```markdown
   > **DEPRECATED:** This fragment is deprecated. Use `new-fragment-id` instead.
   ```

2. **Update frontmatter** with deprecation info
   ```yaml
   deprecated: true
   deprecatedBy: orchestr8://agents/new-fragment-id
   deprecationReason: "Split into multiple focused fragments"
   ```

3. **Keep fragment available** for 2-3 versions
   - Allows graceful migration
   - Prevents breaking existing references

4. **Eventually remove** after deprecation period

## Fragment Testing

### Discoverability Testing

Test if fragments can be discovered with expected queries:

```bash
# Test query
orchestr8://match?query=retry+exponential+backoff&mode=index

# Expected result should include:
# orchestr8://skills/error-handling-resilience
```

**Validation:**
- Query with expected keywords
- Check if fragment appears in results
- Verify relevance score is high

### Token Budget Testing

Test if fragment respects sizing guidelines:

```javascript
const content = fs.readFileSync('fragment.md', 'utf-8');
const parsed = matter(content);
const estimatedTokens = Math.ceil(parsed.content.length / 4);

console.log(`Declared: ${parsed.data.estimatedTokens}`);
console.log(`Actual: ${estimatedTokens}`);
console.log(`Difference: ${Math.abs(parsed.data.estimatedTokens - estimatedTokens)}`);

// Should be within 10%
const withinRange = Math.abs(parsed.data.estimatedTokens - estimatedTokens) / estimatedTokens < 0.1;
```

### Composition Testing

Test if fragments compose well together:

```typescript
// Test assembly
orchestr8://match?query=typescript+api+jwt&maxTokens=3000

// Validate:
// 1. Total tokens < maxTokens
// 2. No duplicate content
// 3. Logical ordering
// 4. Complementary expertise
```

## Fragment Migration Guide

### Migrating from Monolithic Resources

**Before (monolithic):**
```
typescript-developer.md (5000 tokens)
├── Type system (1200 tokens)
├── Async patterns (900 tokens)
├── API development (1100 tokens)
├── Testing (1000 tokens)
└── Best practices (800 tokens)
```

**After (fragments):**
```

├── typescript-core.md (650 tokens)
├── typescript-async-patterns.md (580 tokens)
├── typescript-api-development.md (720 tokens)
├── typescript-testing.md (680 tokens)
└── typescript-best-practices.md (620 tokens)

Total: 3,250 tokens (but can load individually!)
```

**Migration steps:**

1. **Identify natural sections** in monolithic resource
2. **Split into separate files** (one per section)
3. **Write frontmatter** for each fragment
4. **Extract cross-cutting content** to shared fragments
5. **Update references** to point to new fragments
6. **Test discoverability** with expected queries
7. **Rebuild indexes**

## Advanced Fragment Patterns

### Pattern: Progressive Disclosure

Load fragments progressively based on task complexity:

```
Level 1 (Simple task): typescript-core (650 tokens)
Level 2 (Medium task): typescript-core + typescript-api-development (1,370 tokens)
Level 3 (Complex task): typescript-core + typescript-api-development + typescript-async-patterns (1,950 tokens)
```

### Pattern: Domain-Specific Assembly

Combine fragments from multiple categories:

```
Full-Stack Developer
├── agents/typescript-core
├── agents/frontend-react-expert
├── skills/api-design-rest
├── patterns/authentication-jwt
└── examples/express-jwt-auth

Total: ~3,200 tokens
```

### Pattern: Conditional Loading

Load fragments based on context:

```
if (language === 'typescript') {
  load('agents/typescript-core');
} else if (language === 'python') {
  load('agents/python-core');
}

if (framework === 'express') {
  load('examples/express-jwt-auth');
} else if (framework === 'fastapi') {
  load('examples/fastapi-async-crud');
}
```

## Related Documentation

- [README.md](./README.md) - Resource system overview
- [categories.md](./categories.md) - Category descriptions
- [authoring-guide.md](./authoring-guide.md) - Step-by-step authoring guide
- `resources/.index/README.md` - Index system documentation

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
**Maintained By:** Orchestr8 Documentation Team
