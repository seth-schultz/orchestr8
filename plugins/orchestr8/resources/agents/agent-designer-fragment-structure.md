---
id: agent-designer-fragment-structure
category: agent
tags: [agent-design, meta, templates, structure, documentation]
capabilities:
  - Core fragment template design
  - Specialized fragment template design
  - Content structure for agent fragments
  - Multi-language agent example patterns
useWhen:
  - Creating new agent fragments from scratch using standardized templates for core fragments (600-700 tokens) and specialized fragments (450-600 tokens)
  - Structuring agent knowledge systematically with sections for Fundamental Concepts, Common Patterns, Best Practices, and Common Pitfalls with corrections
  - Designing complementary fragment sets like typescript-core + typescript-api-development + typescript-async-patterns that compose via orchestr8://match queries
  - Following content organization patterns with 60% code examples, 25% explanatory text, and 15% best practices for code-heavy fragments
  - Building multi-technology agent families like cloud-architect-core + cloud-architect-aws + cloud-architect-gcp with provider-specific specializations
  - Ensuring fragments are independently useful, follow consistent structure, don't exceed 1000 token maximum, and avoid duplicate content across fragments
estimatedTokens: 650
---

# Agent Designer - Fragment Structure Templates

Standard templates and structure patterns for creating well-organized, reusable agent fragments.

## Core Fragment Template

```markdown
---
id: ${technology}-core
category: agent
tags: [${tech}, ${domain}, fundamentals, core]
capabilities:
  - Language/framework fundamentals
  - Common patterns and idioms
  - Best practices overview
useWhen:
  - Working with ${technology}
  - Need ${domain} expertise
  - ${specific-use-case}
estimatedTokens: 650
---

# ${Technology} Core Expertise

## Fundamental Concepts

Key language/framework concepts that are always relevant.

## Common Patterns

Idiomatic patterns for this technology:
```code
// Pattern examples
```

## Best Practices

✅ Core best practices
✅ Performance considerations
✅ Security fundamentals

## Common Pitfalls

❌ Mistake 1
✅ Correct approach

## Type System / Module System / Core Architecture

Technology-specific fundamentals.

Total: ~650 tokens
```

## Specialized Fragment Template

```markdown
---
id: ${technology}-${specialization}
category: agent
tags: [${tech}, ${specialization}, ${patterns}, ${use-case}]
capabilities:
  - Specific specialized capability 1
  - Specific specialized capability 2
useWhen:
  - Building ${specific-thing} with ${technology}
  - Need ${specialization} expertise
estimatedTokens: 550
---

# ${Technology} ${Specialization} Expertise

## ${Specialization} Overview

What this specialization covers.

## Implementation Patterns

```code
// Specialized patterns and examples
```

## Integration Points

How this integrates with other parts.

## Best Practices

Specialization-specific best practices.

Total: ~550 tokens
```

## Example: TypeScript Agent Family

### Core Fragment
```markdown
---
id: typescript-core
category: agent
tags: [typescript, javascript, types, node]
capabilities:
  - TypeScript type system (generics, conditional types, mapped types)
  - Type inference and narrowing
  - Module system and declarations
useWhen:
  - Working with TypeScript projects
  - Need type-safe code design
  - TypeScript compiler configuration
estimatedTokens: 650
---

# TypeScript Core Expertise

[Core TypeScript knowledge - always relevant]
```

### API Specialization
```markdown
---
id: typescript-api-development
category: agent
tags: [typescript, api, rest, express, node, backend]
capabilities:
  - REST API design with Express.js and TypeScript
  - OpenAPI/Swagger integration
  - Middleware patterns and error handling
useWhen:
  - Building REST APIs with TypeScript
  - Express.js backend development
  - Need API documentation with OpenAPI
estimatedTokens: 520
---

# TypeScript API Development Expertise

[API-specific patterns and practices]
```

### Async Specialization
```markdown
---
id: typescript-async-patterns
category: agent
tags: [typescript, async, promises, concurrency, performance]
capabilities:
  - Async/await patterns and error handling
  - Promise composition and chaining
  - Concurrent operations with Promise.all/race
useWhen:
  - Handling async operations in TypeScript
  - Need concurrent request processing
  - Complex async workflows
estimatedTokens: 480
---

# TypeScript Async Patterns Expertise

[Async-specific knowledge]
```

## Multi-Cloud Agent Example

### Multi-Cloud Core
```markdown
---
id: cloud-architect-core
category: agent
tags: [cloud, architecture, aws, gcp, azure, infrastructure]
capabilities:
  - Cloud architecture design patterns
  - Cost optimization strategies
  - Multi-cloud deployment approaches
useWhen:
  - Designing cloud infrastructure
  - Need cloud architecture guidance
  - Multi-cloud deployments
estimatedTokens: 600
---
```

### AWS Specialization
```markdown
---
id: cloud-architect-aws
category: agent
tags: [aws, cloud, lambda, s3, dynamodb, cloudformation]
capabilities:
  - AWS service selection and integration
  - Lambda + API Gateway serverless patterns
  - CloudFormation/CDK infrastructure as code
useWhen:
  - Deploying to AWS
  - AWS Lambda serverless applications
  - Need AWS architecture patterns
estimatedTokens: 550
---
```

## Content Organization Patterns

**Code-heavy fragments:**
- 60% code examples
- 25% explanatory text
- 15% best practices/pitfalls

**Concept-heavy fragments:**
- 40% conceptual explanation
- 40% code examples
- 20% best practices/patterns

**Pattern-heavy fragments:**
- 50% pattern documentation
- 30% code examples
- 20% when to use / alternatives

## Best Practices

✅ Follow consistent template structure
✅ Include code examples for all patterns
✅ Document common pitfalls with corrections
✅ Keep fragments complementary, not overlapping
✅ Size appropriately (core 600-700, specialized 450-600)

❌ Don't mix multiple specializations in one fragment
❌ Don't duplicate content across fragments
❌ Don't exceed 1000 tokens per fragment
