---
id: agent-designer-metadata-optimization
category: agent
tags: [agent-design, meta, metadata, tags, discoverability, fuzzy-matching]
capabilities:
  - Metadata tag selection and optimization
  - Capability statement design for matching
  - UseWhen scenario definition
  - Improving agent discoverability
useWhen:
  - Optimizing agent metadata with 5-8 specific tags (technology, ecosystem, domain, specialization, related tools) avoiding generic buzzwords like "expert" or "advanced"
  - Improving agent discoverability through fuzzy matching by testing with orchestr8://agents/match?query= and ensuring correct fragments appear for expected queries
  - Creating capability descriptions using [Technology] + [Specific Area] + [Details] format like "TypeScript advanced type system (generics, conditional types, mapped types)"
  - Writing concrete useWhen scenarios with [Action Verb] + [Specific Technology/Pattern] + [Context] structure avoiding vague phrases like "Working with TypeScript"
  - Designing metadata that enables token-efficient loading where generic queries return core fragments and specific queries return core + specialized combinations
  - Enhancing metadata through iterative testing with representative queries, expanding capabilities to be more specific, and refining useWhen based on matching performance
estimatedTokens: 600
---

# Agent Designer - Metadata Optimization

Strategies for optimizing agent metadata (tags, capabilities, useWhen) to maximize discoverability through fuzzy matching.

## Tag Strategy

### Include Hierarchical Tags

```markdown
Core fragment:
tags: [typescript, javascript, types, programming, node]

API specialization:
tags: [typescript, api, rest, express, node, backend]

Testing specialization:
tags: [typescript, testing, jest, unit-test, integration]

Async specialization:
tags: [typescript, async, promises, concurrency, performance]
```

### Tag Selection Rules

```markdown
✅ Technology name (typescript, python, rust)
✅ Ecosystem (node, deno, bun for JS)
✅ Domain (api, cli, web, mobile)
✅ Specialization (testing, async, security)
✅ Related technologies (express, fastapi, actix)

❌ Generic terms (expert, best, advanced)
❌ Redundant (api, apis, api-dev)
❌ Too many (>8 tags)
```

### Example Tag Sets

```markdown
TypeScript API Agent:
[typescript, api, rest, express, node, backend]

Python FastAPI Agent:
[python, fastapi, api, async, pydantic, rest]

Rust Web Agent:
[rust, web, actix, tokio, async, backend]

Cloud Architect AWS:
[aws, cloud, lambda, s3, serverless, architecture]
```

## Capabilities - Knowledge Areas

**Concrete, Specific Knowledge Statements:**

```markdown
GOOD:
- TypeScript advanced type system (generics, conditional types, mapped types)
- Express.js REST API design with middleware patterns
- PostgreSQL query optimization and indexing strategies
- AWS Lambda serverless architecture and deployment

BAD:
- TypeScript expertise
- Good at APIs
- Database knowledge
- Cloud deployment
```

**Format Guidelines:**
```markdown
Structure: [Technology] + [Specific Area] + [Details]

Examples:
- FastAPI dependency injection system for authentication
- React hooks patterns (useState, useEffect, useContext)
- Kubernetes deployment strategies with Helm charts
- MongoDB aggregation pipeline optimization
```

## UseWhen - Trigger Scenarios

**Specific, Actionable Situations:**

```markdown
GOOD:
- Building REST APIs with TypeScript and Express
- Need to optimize PostgreSQL queries for high throughput
- Deploying serverless functions to AWS Lambda
- Implementing real-time features with WebSockets

BAD:
- Working with TypeScript
- Database performance issues
- Cloud deployment
- Real-time applications
```

**Format Guidelines:**
```markdown
Structure: [Action Verb] + [Specific Technology/Pattern] + [Context]

Examples:
- Implementing JWT authentication in FastAPI applications
- Designing microservices architecture with event-driven patterns
- Building React applications with TypeScript and Redux
- Optimizing Spark jobs for large-scale data processing
```

## Metadata Quality Checklist

**For Each Fragment:**

□ **5-8 tags** covering technology stack
□ **3-4 capabilities** with specific details
□ **3-4 useWhen** scenarios with concrete actions
□ **Accurate estimatedTokens** (count with `wc -c`)
□ **Unique ID** following pattern: `${tech}-${specialization}`

## Discoverability Testing

**Test Queries After Creating Agent:**

```markdown
Core fragment:
orchestr8://agents/match?query=typescript
orchestr8://agents/match?query=typescript+development

API specialization:
orchestr8://agents/match?query=typescript+api+rest
orchestr8://agents/match?query=express+api+typescript

Async specialization:
orchestr8://agents/match?query=typescript+async+promises
orchestr8://agents/match?query=concurrent+typescript

Testing specialization:
orchestr8://agents/match?query=typescript+testing+jest
orchestr8://agents/match?query=unit+test+typescript
```

**If fragment doesn't appear in expected queries:**
1. Review tags - add missing technology terms
2. Expand capabilities - be more specific
3. Add useWhen scenarios - cover more use cases
4. Check for typos in metadata

## Metadata Enhancement Process

**Step 1: Extract Core Terms**
- Primary technology (typescript, python, rust)
- Domain area (api, web, cli, data)
- Key patterns (async, rest, streaming)

**Step 2: Expand Capabilities**
```markdown
Before: "API development"
After: "REST API design with Express.js and OpenAPI specification"

Before: "Testing"
After: "Unit and integration testing with Jest and TypeScript"
```

**Step 3: Refine UseWhen**
```markdown
Before: "When building APIs"
After: "Building REST APIs with TypeScript and Express.js"

Before: "Testing code"
After: "Testing TypeScript applications with Jest and Vitest"
```

## Best Practices

✅ Use specific, technical language in metadata
✅ Include technology stack terms in tags
✅ Write actionable useWhen scenarios
✅ Test discoverability with representative queries
✅ Update metadata based on matching performance

❌ Don't use generic buzzwords
❌ Don't duplicate tags across related terms
❌ Don't write vague capabilities
❌ Don't forget to test matching
