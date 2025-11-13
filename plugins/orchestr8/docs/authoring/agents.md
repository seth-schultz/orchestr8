# Agent Creation Guide

Agents represent domain expertise and specialized knowledge. This guide covers creating effective agent fragments for the Orchestr8 dynamic expertise system.

## Table of Contents

1. [What is an Agent?](#what-is-an-agent)
2. [Agent vs Skill vs Pattern](#agent-vs-skill-vs-pattern)
3. [Agent Fragmentation Strategy](#agent-fragmentation-strategy)
4. [Creating Core Agent Fragments](#creating-core-agent-fragments)
5. [Creating Specialized Agent Fragments](#creating-specialized-agent-fragments)
6. [Agent Composition](#agent-composition)
7. [Testing Agent Effectiveness](#testing-agent-effectiveness)
8. [Examples & Patterns](#examples--patterns)

## What is an Agent?

An **agent** represents **WHO knows** a technology, domain, or role. Agents embody expertise and provide domain-specific knowledge.

**Agents answer:**
- WHO has expertise in this technology?
- WHO can help with this domain?
- WHO understands this framework/platform?

**Examples:**
- `typescript-core` - TypeScript language expert
- `python-fastapi-dependencies` - FastAPI dependency injection specialist
- `rust-expert-advanced` - Advanced Rust programming expert
- `devops-expert-cicd` - CI/CD pipeline specialist
- `database-architect-sql` - SQL database design expert

**Key characteristics:**
- **Domain-focused:** Represents expertise in specific technology/domain
- **Composable:** Core + specialized fragments combine for complete expertise
- **Role-based:** Often maps to job roles (Developer, Architect, Engineer)
- **Technology-specific:** Tied to particular frameworks, languages, or platforms

## Agent vs Skill vs Pattern

Understanding the distinction is critical for proper categorization.

### Agent: WHO (Domain Expertise)

**Create an agent for:**
- Technology expertise: TypeScript Developer, Rust Expert, Python Engineer
- Platform knowledge: AWS Architect, GCP Specialist, Kubernetes Expert
- Domain specialization: Frontend Developer, Backend Developer, Data Engineer
- Role-based expertise: DevOps Engineer, Security Specialist, QA Engineer

**Examples:**
```yaml
# Agent fragments
typescript-core
typescript-api-development
python-fastapi-validation
rust-expert-core
devops-expert-cicd
frontend-react-expert
database-architect-sql
```

### Skill: HOW (Technique)

**Create a skill for:**
- Reusable techniques applicable across technologies
- Methodologies and approaches
- Cross-cutting concerns
- Implementation patterns

**Examples:**
```yaml
# Skill fragments (NOT agents)
error-handling-resilience
testing-integration-patterns
security-authentication-jwt
api-design-rest
performance-optimization
git-workflow
```

### Pattern: WHY/WHEN (Architecture)

**Create a pattern for:**
- Architectural approaches
- Design patterns
- System design strategies
- Structural decisions

**Examples:**
```yaml
# Pattern fragments (NOT agents)
architecture-microservices
event-driven-cqrs
database-indexing-strategies
performance-caching
autonomous-organization
```

### Decision Tree

```
Is this domain expertise tied to a specific technology?
├─ YES → Agent
│  └─ Examples: typescript-core, python-fastapi
└─ NO → Is this an architectural approach?
   ├─ YES → Pattern
   │  └─ Examples: microservices, event-driven
   └─ NO → Skill
      └─ Examples: error-handling, testing-strategies
```

## Agent Fragmentation Strategy

### The Monolithic Problem

**❌ Don't create monolithic agents:**

```markdown
python-expert.md (3000 tokens)
├─ Python fundamentals
├─ FastAPI development
├─ Async programming
├─ Data science
├─ Testing
├─ Deployment
└─ Database integration

Problems:
- Always loads 3000 tokens
- User may only need FastAPI (500 tokens)
- 83% token waste
- Slow to load
- Hard to maintain
```

### The Fragmented Solution

**✅ Create focused agent fragments:**

```markdown
Core Fragment (always-relevant):
python-core.md (650 tokens)
├─ Language fundamentals
├─ Type system (type hints)
├─ Common patterns
├─ Standard library
└─ Package management

Specialized Fragments (load as needed):
python-fastapi-dependencies.md (500 tokens)
python-fastapi-validation.md (480 tokens)
python-async-fundamentals.md (450 tokens)
python-async-concurrency.md (520 tokens)

Benefits:
- Load only what's needed
- Generic query: python-core (650 tokens)
- Specific query: python-core + python-fastapi-dependencies (1150 tokens)
- 62% token savings on specific queries
- 78% savings on generic queries
```

### Fragmentation Guidelines

**When to fragment:**
1. **Domain has multiple specializations**
   - TypeScript: core, api, async, testing
   - Python: core, fastapi, async, data-science

2. **Knowledge exceeds 1000 tokens**
   - Split into core (600-750) + specializations (450-650 each)

3. **Users need different subsets**
   - Some need API development
   - Others need async programming
   - Few need both

**How to fragment:**

```markdown
Step 1: Identify core knowledge (always relevant)
└─ Language fundamentals, syntax, common patterns

Step 2: Identify specializations (sometimes relevant)
└─ API development, async, testing, data science

Step 3: Create fragments
├─ Core: 600-750 tokens (always loaded)
└─ Specializations: 450-650 tokens each (load as needed)

Step 4: Link via tags and metadata
└─ Ensure fuzzy matching loads relevant combination
```

## Creating Core Agent Fragments

Core fragments contain **always-relevant** fundamentals for a technology/domain.

### Core Fragment Characteristics

- **Size:** 600-750 tokens
- **Scope:** Foundational knowledge applicable to all use cases
- **Content:** Fundamentals, syntax, common patterns, key concepts
- **Naming:** `${technology}-core` or `${domain}-${technology}`

### Core Fragment Structure

```markdown
---
id: typescript-core
category: agent
tags: [typescript, javascript, types, node, programming, fundamentals]
capabilities:
  - TypeScript language fundamentals including syntax and type system
  - Type annotations, interfaces, and type inference
  - Generics and advanced type features (conditional, mapped types)
  - Module system and import/export patterns
useWhen:
  - Working with TypeScript in any context
  - Need TypeScript type system expertise
  - Building TypeScript applications or libraries
  - Reviewing or writing TypeScript code
estimatedTokens: 650
---

# TypeScript Core Expertise

Core TypeScript language knowledge covering fundamentals, type system, and common patterns.

## Language Fundamentals

**Type System:**
- Static typing on top of JavaScript
- Type inference and annotations
- Structural typing (duck typing)

**Core Types:**
\`\`\`typescript
// Primitive types
let name: string = "John";
let age: number = 30;
let active: boolean = true;

// Object types
interface User {
  id: number;
  name: string;
  email?: string; // Optional
}

// Union types
type Status = "active" | "inactive";
\`\`\`

## Advanced Type Features

**Generics:**
\`\`\`typescript
function identity<T>(value: T): T {
  return value;
}

interface Repository<T> {
  find(id: string): Promise<T>;
  save(entity: T): Promise<void>;
}
\`\`\`

**Conditional Types:**
\`\`\`typescript
type NonNullable<T> = T extends null | undefined ? never : T;
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
\`\`\`

## Best Practices

✅ Use strict mode (`strict: true` in tsconfig.json)
✅ Prefer interfaces for object shapes
✅ Use type inference when obvious
✅ Avoid `any` - use `unknown` for truly unknown types
✅ Leverage utility types (Partial, Pick, Omit, etc.)

❌ Don't overuse complex type gymnastics
❌ Don't ignore type errors
❌ Don't use `any` as escape hatch

## Common Patterns

**Type Guards:**
\`\`\`typescript
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === "number";
}
\`\`\`

**Discriminated Unions:**
\`\`\`typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };
\`\`\`

## See Also

- [TypeScript API Development](orchestr8://agents/typescript-api-development)
- [TypeScript Async Patterns](orchestr8://agents/typescript-async-patterns)
- [TypeScript Testing](orchestr8://agents/typescript-testing)
```

### Core Fragment Checklist

- [ ] 600-750 tokens
- [ ] Always-relevant knowledge only
- [ ] No specialization-specific content
- [ ] Clear foundational structure
- [ ] Links to specialized fragments
- [ ] Named `${tech}-core` or similar

## Creating Specialized Agent Fragments

Specialized fragments contain **use-case-specific** deep expertise.

### Specialized Fragment Characteristics

- **Size:** 450-650 tokens
- **Scope:** Deep dive into specific area or use case
- **Content:** Specialized patterns, frameworks, advanced techniques
- **Naming:** `${technology}-${specialization}`

### Specialized Fragment Structure

```markdown
---
id: typescript-api-development
category: agent
tags: [typescript, api, rest, express, backend, middleware, node]
capabilities:
  - Express.js REST API development with TypeScript
  - Type-safe route handlers and middleware patterns
  - Request/response validation with TypeScript schemas
  - Error handling middleware and async error boundaries
useWhen:
  - Building Node.js REST APIs with Express.js and TypeScript
  - Implementing Express middleware pipeline with type safety
  - Designing type-safe API routes with request/response validation
  - Creating authentication and authorization middleware
estimatedTokens: 520
---

# TypeScript API Development

TypeScript expertise for building REST APIs with Express.js, focusing on type safety and middleware patterns.

## Express with TypeScript

**Type-safe Route Handlers:**
\`\`\`typescript
import { Request, Response, NextFunction } from "express";

interface UserRequest extends Request {
  user?: { id: string; email: string };
}

app.get("/users/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await userService.findById(userId);
  res.json(user);
});
\`\`\`

## Middleware Patterns

**Type-safe Middleware:**
\`\`\`typescript
const authMiddleware = (
  req: UserRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = verifyToken(token);
  next();
};
\`\`\`

## Request/Response Validation

**Zod Schema Validation:**
\`\`\`typescript
import { z } from "zod";

const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().min(18).optional(),
});

type CreateUserDto = z.infer<typeof CreateUserSchema>;

app.post("/users", async (req: Request, res: Response) => {
  const data = CreateUserSchema.parse(req.body);
  const user = await userService.create(data);
  res.json(user);
});
\`\`\`

## Error Handling

**Async Error Wrapper:**
\`\`\`typescript
const asyncHandler = (fn: Function) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
\`\`\`

## Best Practices

✅ Use typed Request/Response interfaces
✅ Validate input with schemas (Zod, Joi)
✅ Implement centralized error handling
✅ Use async/await with proper error handling
✅ Type your middleware properly

## See Also

- [TypeScript Core](orchestr8://agents/typescript-core)
- [Error Handling Patterns](orchestr8://skills/error-handling-api-patterns)
- [API Design REST](orchestr8://skills/api-design-rest)
```

### Specialized Fragment Checklist

- [ ] 450-650 tokens
- [ ] Focused on single specialization
- [ ] Deep technical content
- [ ] Code examples for specific use case
- [ ] References core fragment
- [ ] Named `${tech}-${specialization}`

## Agent Composition

### Designing Agent Families (Phase 2 Optimization)

**Strategy:** Core + Specializations with Cross-References

```markdown
Agent Family: TypeScript Developer
├─ typescript-core (650 tokens)
│  └─ Always loaded for TypeScript queries
│  └─ Cross-refs: typescript-api-development, typescript-async-patterns, typescript-testing
├─ typescript-api-development (520 tokens)
│  └─ Loaded for: "typescript api", "express typescript"
│  └─ Cross-refs: typescript-core, error-handling-api-patterns, api-design-rest
├─ typescript-async-patterns (480 tokens)
│  └─ Loaded for: "typescript async", "promises typescript"
│  └─ Cross-refs: typescript-core, error-handling-resilience
└─ typescript-testing (450 tokens)
   └─ Loaded for: "typescript testing", "jest typescript"
   └─ Cross-refs: typescript-core, testing-integration-patterns

Query Behavior:
- "typescript development" → typescript-core (650 tokens)
- "typescript express api" → typescript-core + typescript-api-development (1170 tokens)
- "typescript async testing" → typescript-core + typescript-async + typescript-testing (1580 tokens)
```

### Cross-Reference ROI Analysis

**Investment vs Return:**

**Cost of cross-references:**
```yaml
# Adding cross-references costs 50-100 tokens per fragment
---
id: typescript-api-development
relatedTo:
  - typescript-core
  - error-handling-api-patterns
  - api-design-rest
  - security-api-security
---

## Related Expertise
- [TypeScript Core](orchestr8://agents/typescript-core)
- [Error Handling Patterns](orchestr8://skills/error-handling-api-patterns)
- [API Design](orchestr8://skills/api-design-rest)

Token cost: ~80 tokens
```

**Return on investment:**
```
Discoverability improvement: 15-20%
- Users find related content faster
- Reduced need for multiple queries
- Better exploration of expertise

ROI calculation:
- Cost: 80 tokens per fragment
- Benefit: 3-5x improved related content discovery
- Worthwhile when: Fragment is frequently used with specific others

Example:
typescript-api-development is almost always used with:
- error-handling-api-patterns (85% co-occurrence)
- api-design-rest (70% co-occurrence)

Cross-refs save users from making 2-3 additional queries
```

**When cross-references are worthwhile:**
1. **High co-occurrence:** Fragments used together >60% of the time
2. **Complementary expertise:** Skills that enhance the agent's domain
3. **Related workflows:** Commonly used in same development tasks
4. **Learning paths:** Logical progression of related concepts

### Composition Rules

**Rule 1: Core is standalone**
```markdown
Core fragment must be useful by itself
✅ typescript-core → Complete TypeScript fundamentals
❌ typescript-core → Incomplete, requires specializations
```

**Rule 2: Specializations reference core**
```markdown
Each specialization should:
✅ Link to core fragment
✅ Assume core knowledge
✅ Focus on specialized area
```

**Rule 3: Specializations are independent**
```markdown
Specializations shouldn't depend on each other:
✅ typescript-api + typescript-async can load separately
❌ typescript-api requires typescript-async to make sense
```

**Rule 4: Avoid overlap**
```markdown
No duplicate content between fragments:
✅ Core: fundamentals, Specialized: advanced
❌ Core: fundamentals + API basics, Specialized: API basics + advanced
```

### Multi-Level Agent Families with Prerequisites

**Pattern:** Language → Framework → Specialization

```markdown
Python Agent Family:

Level 1: Language Core (prerequisite for all)
python-core (650 tokens)
├─ relatedTo: [python-fastapi-dependencies, python-async-fundamentals]

Level 2: Framework Specializations
python-fastapi-dependencies (500 tokens)
├─ prerequisite: [python-core]
├─ relatedTo: [python-fastapi-validation, python-fastapi-middleware]

python-fastapi-validation (480 tokens)
├─ prerequisite: [python-core, python-fastapi-dependencies]
├─ relatedTo: [python-fastapi-middleware]

python-fastapi-middleware (520 tokens)
├─ prerequisite: [python-core, python-fastapi-dependencies]
├─ relatedTo: [python-fastapi-validation]

Level 3: Cross-cutting Specializations
python-async-fundamentals (450 tokens)
├─ prerequisite: [python-core]
├─ relatedTo: [python-async-concurrency, python-async-context-managers]

python-async-concurrency (520 tokens)
├─ prerequisite: [python-core, python-async-fundamentals]
├─ relatedTo: [python-async-context-managers]

Composition Examples:
- "python fastapi" → python-core + python-fastapi-dependencies (1150 tokens)
- "python async" → python-core + python-async-fundamentals (1100 tokens)
- "fastapi async validation" → python-core + python-fastapi-dependencies +
  python-fastapi-validation + python-async-fundamentals (2080 tokens)
```

**Using relatedTo field for family relationships:**

```yaml
---
id: python-fastapi-dependencies
category: agent
prerequisite: [python-core]  # Must load first
relatedTo:  # Suggest loading together
  - python-fastapi-validation
  - python-fastapi-middleware
  - python-async-fundamentals
tags: [python, fastapi, dependencies, injection, async]
---

## Related FastAPI Expertise
**Core prerequisite:**
- [Python Core](orchestr8://agents/python-core) - Required foundation

**Related specializations:**
- [FastAPI Validation](orchestr8://agents/python-fastapi-validation)
- [FastAPI Middleware](orchestr8://agents/python-fastapi-middleware)

**Complementary skills:**
- [Python Async Fundamentals](orchestr8://agents/python-async-fundamentals)
```

**Token efficiency with families:**
```
Single specialization query: Core + 1 specialized (1150 tokens)
Multiple specialization query: Core + 2-3 specialized (1630-2080 tokens)
Savings vs monolithic: 40-60% for single specialization queries
```

## Testing Agent Effectiveness

### Discovery Testing

**Test queries for agent fragments:**

```markdown
Agent: typescript-api-development

Required matches (should appear in top 3):
✅ "typescript api"
✅ "express typescript"
✅ "node api typescript"
✅ "typescript rest api"
✅ "typescript backend"

Should NOT match:
❌ "graphql typescript" (different specialization)
❌ "typescript frontend" (wrong domain)
❌ "python api" (wrong language)
```

**Testing process:**

1. **Launch MCP UI:**
   ```bash
   /orchestr8:mcp-ui
   ```

2. **Test core queries:**
   ```
   orchestr8://agents/match?query=typescript
   orchestr8://agents/match?query=typescript+development
   ```

3. **Test specialized queries:**
   ```
   orchestr8://agents/match?query=typescript+api+express
   orchestr8://agents/match?query=typescript+rest+backend
   ```

4. **Test composition:**
   ```
   orchestr8://agents/match?query=typescript+api+async
   # Should load: typescript-core + typescript-api + typescript-async
   ```

### Effectiveness Metrics

**Good agent fragment:**
- Appears in top 3 for core queries
- Loads with appropriate complementary fragments
- Has unique value (not redundant with others)
- Stays within token budget (600-750 core, 450-650 specialized)

**Signs of problems:**
- Doesn't appear for expected queries → Fix metadata
- Always loads with unrelated fragments → Tags too generic
- Overlaps with other agents → Refine scope or merge
- Too large (>750 core, >650 specialized) → Split further

## Examples & Patterns

### Example 1: Language Expert (Multi-level)

```markdown
Rust Expert Agent Family:

rust-expert-core.md (700 tokens)
├─ Ownership and borrowing
├─ Type system
├─ Common patterns
└─ Standard library

rust-expert-advanced.md (600 tokens)
├─ Lifetimes
├─ Trait objects
├─ Unsafe code
└─ Macros

Queries:
- "rust programming" → rust-expert-core
- "rust lifetimes" → rust-expert-core + rust-expert-advanced
- "rust advanced" → rust-expert-core + rust-expert-advanced
```

### Example 2: Framework Specialist (Micro-specializations)

```markdown
Python FastAPI Agent Family:

python-core.md (650 tokens) [language fundamentals]

python-fastapi-dependencies.md (500 tokens)
├─ Dependency injection system
├─ Request-scoped resources
└─ Testing with overrides

python-fastapi-validation.md (480 tokens)
├─ Pydantic models
├─ Request/response validation
└─ Custom validators

python-fastapi-middleware.md (520 tokens)
├─ Middleware creation
├─ Request/response processing
└─ CORS, authentication

Queries:
- "fastapi validation" → python-core + python-fastapi-validation
- "fastapi dependencies" → python-core + python-fastapi-dependencies
- "fastapi middleware auth" → python-core + python-fastapi-middleware
```

### Example 3: Role-based Agent

```markdown
DevOps Expert Agent Family:

devops-expert-cicd.md (680 tokens)
├─ CI/CD principles
├─ GitHub Actions
├─ GitLab CI
└─ Jenkins

infrastructure-kubernetes.md (720 tokens)
├─ K8s architecture
├─ Deployment patterns
├─ Service mesh
└─ Scaling

infrastructure-terraform.md (650 tokens)
├─ IaC principles
├─ Module design
├─ State management
└─ Best practices

Queries:
- "cicd pipeline" → devops-expert-cicd
- "kubernetes deployment" → infrastructure-kubernetes
- "terraform infrastructure" → infrastructure-terraform
- "devops kubernetes cicd" → devops-expert-cicd + infrastructure-kubernetes
```

## Agent Creation Workflow

```markdown
1. Define Scope
   ├─ What expertise does this agent represent?
   ├─ What technology/domain/role?
   ├─ Core or specialized?
   └─ Check for existing agents

2. Design Structure
   ├─ Identify core knowledge (always relevant)
   ├─ Identify specializations (sometimes relevant)
   ├─ Plan fragmentation strategy
   └─ Determine token budgets

3. Write Metadata
   ├─ ID: ${tech}-${specialization}
   ├─ Category: agent
   ├─ Tags: 6-8 specific tags
   ├─ Capabilities: 4-6 concrete capabilities
   └─ UseWhen: 4-6 specific scenarios

4. Write Content
   ├─ Core concepts/fundamentals
   ├─ Code examples (2-3)
   ├─ Best practices
   ├─ Common pitfalls
   └─ Cross-references

5. Test Discovery
   ├─ Create 6-8 test queries
   ├─ Verify top-3 ranking for core queries
   ├─ Test composition with other agents
   └─ Optimize metadata if needed

6. Validate
   ├─ Token count (600-750 core, 450-650 specialized)
   ├─ No duplication
   ├─ Code examples work
   └─ Links valid

7. Deploy
   ├─ Save to resources/agents/
   ├─ Commit with descriptive message
   └─ Index rebuilds automatically
```

## Quick Reference

### Agent Checklist

**Core Agent:**
- [ ] 600-750 tokens
- [ ] Always-relevant fundamentals
- [ ] Named `${tech}-core`
- [ ] References specialized fragments
- [ ] 6-8 tags, 4-6 capabilities, 4-6 useWhen

**Specialized Agent:**
- [ ] 450-650 tokens
- [ ] Focused on single specialization
- [ ] Named `${tech}-${specialization}`
- [ ] References core fragment
- [ ] 6-8 tags, 4-6 capabilities, 4-6 useWhen

**Both:**
- [ ] Category: `agent`
- [ ] Discoverable via test queries
- [ ] Code examples (2-3)
- [ ] No duplication
- [ ] Saved to `resources/agents/`

## Next Steps

- Review [Fragment Authoring Guide](./fragments.md) for metadata best practices
- Use [Agent Template](./templates/agent-template.md) to get started
- See [Best Practices](./best-practices.md) for quality guidelines
- Test agents using `/orchestr8:mcp-ui`
