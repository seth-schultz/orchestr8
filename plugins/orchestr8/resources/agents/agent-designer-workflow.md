---
id: agent-designer-workflow
category: agent
tags: [agent-design, meta, workflow, best-practices, creation-process]
capabilities:
  - Agent creation workflow and process
  - Agent discovery testing methodology
  - Best practices for agent design
  - Systematic agent documentation approach
useWhen:
  - Creating new domain expert agents following systematic 6-step workflow: identify expertise domain, decompose into core + specializations, document systematically, optimize metadata, test discoverability, save to library
  - Ensuring agent quality through pre-publication checklist covering fragment size (core 600-700, specialized 450-600), specific metadata, runnable code examples, and discovery testing
  - Testing agent discoverability with fuzzy match queries across generic (technology), specialized (tech + specialization), and use-case (problem + technology) patterns
  - Documenting specialized knowledge systematically with sections for fundamental concepts (what), patterns and idioms (how), common pitfalls (what not to do), and non-functional considerations
  - Avoiding common mistakes like monolithic agents (2500+ tokens), generic metadata ("Good at TypeScript"), skill confusion (creating agents for techniques), or overlapping fragments
  - Following file naming convention ${technology}-${specialization}.md in resources/agents/ directory with metadata including 5-8 tags, 3-4 capabilities, 3-4 useWhen scenarios
estimatedTokens: 580
---

# Agent Designer - Creation Workflow

Systematic workflow for creating high-quality, discoverable agent fragments from domain expertise.

## Agent Creation Workflow

### Step 1: Identify Expertise Domain
```markdown
Questions to answer:
- What technology/domain does this agent cover?
- Is this truly expertise (agent) or technique (skill)?
- What are the main specializations within this domain?
- Who would need this expertise and when?

Example:
Domain: TypeScript development
Specializations: Core, API, Async, Testing, Frontend
Agent family: typescript-core, typescript-api-development, etc.
```

### Step 2: Decompose into Core + Specializations
```markdown
Core fragment (600-700 tokens):
- Always-relevant fundamentals
- Language/framework essentials
- Common patterns and best practices
- Foundation for all specializations

Specialized fragments (450-600 tokens each):
- Use-case specific knowledge
- Specialized patterns and techniques
- Integration with specific tools/frameworks
- Focused problem-solving approaches
```

### Step 3: Document Knowledge Systematically
```markdown
For each fragment:

1. Fundamental concepts (what)
   - Core ideas and principles
   - Key terminology and definitions

2. Patterns and idioms (how)
   - Practical implementation patterns
   - Code examples with annotations
   - Best practices for common scenarios

3. Common pitfalls (what not to do)
   - Frequent mistakes
   - Anti-patterns to avoid
   - Correct alternatives

4. Non-functional considerations
   - Performance implications
   - Security considerations
   - Scalability factors
```

### Step 4: Optimize Metadata
```markdown
Tags (5-8):
- Technology name
- Framework/ecosystem
- Domain area
- Specialization
- Related technologies

Capabilities (3-4):
- Specific knowledge statements
- Include technology + detail
- Measurable/concrete

UseWhen (3-4):
- Actionable scenarios
- Specific technology context
- Real-world use cases
```

### Step 5: Test Discoverability
```markdown
Run fuzzy match queries:

Generic queries:
orchestr8://agents/match?query=${technology}

Specialized queries:
orchestr8://agents/match?query=${tech}+${specialization}

Use-case queries:
orchestr8://agents/match?query=${problem}+${technology}

Verify:
✓ Correct fragments appear in results
✓ Match scores are appropriate
✓ No unexpected fragments included
✓ Token budget is reasonable
```

### Step 6: Save to Resource Library
```markdown
File naming: ${technology}-${specialization}.md
Location: resources/agents/

Examples:
- typescript-core.md
- typescript-api-development.md
- python-async-patterns.md
- cloud-architect-aws.md
```

## Agent Discovery Testing

**Test Matrix:**
```markdown
For typescript-core + specializations:

Core only:
orchestr8://agents/match?query=typescript
→ Expect: typescript-core

API focus:
orchestr8://agents/match?query=typescript+rest+api+express
→ Expect: typescript-core + typescript-api-development

Async focus:
orchestr8://agents/match?query=typescript+async+concurrent
→ Expect: typescript-core + typescript-async-patterns

Testing focus:
orchestr8://agents/match?query=typescript+jest+testing
→ Expect: typescript-core + typescript-testing
```

## Quality Checklist

**Before Publishing Agent:**

□ Fragment size appropriate (core 600-700, specialized 450-600)
□ Metadata is specific and technical
□ Code examples are runnable and realistic
□ Common pitfalls documented with corrections
□ Best practices clearly stated
□ useWhen scenarios are actionable
□ Tags cover technology stack
□ Fragments are complementary, not overlapping
□ Discovery testing passed
□ Token estimates accurate

## Common Mistakes to Avoid

❌ **Creating monolithic agents**
```markdown
DON'T: typescript-expert.md (2500 tokens)
DO: typescript-core + 4-5 specialized fragments
```

❌ **Generic metadata**
```markdown
DON'T: "Good at TypeScript development"
DO: "TypeScript type system with generics and conditional types"
```

❌ **Skill confusion**
```markdown
DON'T: Create agent for "error handling" (this is a skill)
DO: Create agent for "Python expert" with error handling knowledge
```

❌ **Overlapping fragments**
```markdown
DON'T: typescript-api and typescript-rest-api (redundant)
DO: typescript-api-development (covers REST/GraphQL/etc.)
```

## Best Practices Summary

✅ Fragment by logical specialization
✅ Keep core fragment focused on essentials
✅ Size fragments appropriately
✅ Include rich, specific metadata
✅ Provide runnable code examples
✅ Document common pitfalls
✅ Test discoverability thoroughly
✅ Design for composability

✅ Core 600-700 tokens, specialized 450-600 tokens
✅ 5-8 tags, 3-4 capabilities, 3-4 useWhen scenarios
✅ Test with multiple query patterns
✅ Ensure fragments combine well together
