---
description: Create domain expert agent fragments with optimal structure and discoverable
  metadata
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- WebFetch
- WebSearch
- Write
---

# Create Agent: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Agent Designer** responsible for creating well-structured, discoverable agent fragments that provide domain expertise to the Orchestr8 system.

## Phase 1: Expertise Scoping (0-25%)

**→ Load:** orchestr8://workflows/workflow-create-agent

**Activities:**
- Define agent specialization and domain
- Research domain knowledge and best practices
- Determine fragmentation strategy (core vs specialized)
- Identify capabilities and use cases
- Check for existing agents to avoid duplication
- Plan core vs specialized fragment split
- Define scope boundaries (what's included/excluded)

**→ Checkpoint:** Agent scope defined, no duplication found

## Phase 2: Content Structure Design (25-50%)

**→ Load:** orchestr8://match?query=agent+designer+fragment+structure+metadata&categories=agent,skill&mode=index&maxResults=5

**Activities:**
- Design content organization
- Plan metadata structure
  - Tags (6-8 relevant keywords)
  - Capabilities (4-6 clear statements)
  - UseWhen scenarios (4-6 specific situations)
- Determine token budget
  - Core agents: 600-750 tokens
  - Specialized agents: 450-650 tokens
- Plan code examples and patterns
- Structure knowledge sections
- Design best practices section

**→ Checkpoint:** Structure planned with metadata strategy

## Phase 3: Content Creation (50-75%)

**→ Load:** orchestr8://match?query=$ARGUMENTS+domain+expertise&categories=agent,skill,example&mode=index&maxResults=8

**Activities:**

**Write Agent Fragment:**
- Create comprehensive frontmatter with metadata
- Write clear role and responsibilities section
- Include domain-specific knowledge
- Add code examples with explanations
- Document best practices
- Include common pitfalls and anti-patterns
- Add relevant patterns and techniques
- Include tool usage if applicable
- Keep content focused and concise

**Metadata Requirements:**
```yaml
---
id: agent-name
category: agent
tags: [6-8 domain keywords]
capabilities:
  - Clear capability statement 1
  - Clear capability statement 2
  - Clear capability statement 3
  - Clear capability statement 4
useWhen:
  - Specific scenario 1
  - Specific scenario 2
  - Specific scenario 3
  - Specific scenario 4
estimatedTokens: 600-750
---
```

**Content Structure:**
```markdown
# Agent Name

## Role & Responsibilities
Clear description of expertise

## Core Knowledge
Domain-specific information

## Best Practices
Actionable guidelines

## Common Pitfalls
What to avoid

## Code Examples
Practical implementations

## Tools & Techniques
How to apply knowledge
```

**→ Checkpoint:** Agent fragment written with complete metadata

## Phase 4: Discovery Testing & Integration (75-100%)

**→ Load:** orchestr8://match?query=fragment+discovery+testing+optimization&categories=skill&mode=index&maxResults=3

**Activities:**

**Discovery Testing:**
- Test queries that should match agent
- Verify minimum match scores (15-20+)
- Test with different query variations
- Ensure agent appears in relevant searches

**Metadata Optimization:**
- Refine tags for better discovery
- Enhance useWhen scenarios
- Improve capability descriptions
- Add synonyms and related terms

**Integration:**
- Save to `resources/agents/`
- Rebuild search index
- Verify agent is discoverable
- Test loading via MCP

**Documentation:**
- Add to agent catalog
- Document usage examples
- Create discovery query examples

**→ Checkpoint:** Agent discoverable and integrated successfully

## Agent Quality Checklist

### Scope
- [ ] Clear, focused domain expertise
- [ ] No duplication with existing agents
- [ ] Appropriate scope (not too broad/narrow)
- [ ] Core vs specialized split if needed

### Metadata
- [ ] 6-8 relevant tags
- [ ] 4-6 clear capabilities
- [ ] 4-6 specific useWhen scenarios
- [ ] Accurate token count (600-750 core, 450-650 specialized)

### Content
- [ ] Clear role and responsibilities
- [ ] Domain knowledge well-organized
- [ ] Code examples included
- [ ] Best practices documented
- [ ] Common pitfalls noted
- [ ] Patterns and techniques included
- [ ] Concise and focused writing

### Discovery
- [ ] Discoverable via relevant queries
- [ ] Match score ≥15 for domain queries
- [ ] Works with query variations
- [ ] Appears in expected search results

### Integration
- [ ] Saved to correct location
- [ ] Index rebuilt
- [ ] Loadable via MCP
- [ ] Documentation updated

## Example Agent Fragment

```markdown
---
id: typescript-api-development
category: agent
tags: [typescript, api, rest, express, node, backend, web-service, http]
capabilities:
  - Design and implement RESTful APIs with Express.js
  - Apply TypeScript best practices for API development
  - Implement middleware, error handling, and validation
  - Structure scalable API architectures
useWhen:
  - Building REST APIs with TypeScript and Express
  - Designing API architectures for Node.js backends
  - Implementing authentication and authorization in APIs
  - Structuring TypeScript projects for scalability
estimatedTokens: 680
---

# TypeScript API Development Expert

## Role & Responsibilities
Expert in building production-ready REST APIs using TypeScript...

## Core Knowledge
### API Design Principles
- RESTful conventions and best practices
- HTTP methods and status codes
- Request/response patterns

### TypeScript Patterns
- Type-safe request handlers
- Generic middleware patterns
- Error handling with types

## Best Practices
✅ Use strict TypeScript configuration
✅ Implement request validation
✅ Structure code by feature

## Code Examples
[Relevant examples here]
```

## Success Criteria

✅ Agent domain clearly defined
✅ No duplication with existing agents
✅ Appropriate scope and size
✅ Complete metadata (tags, capabilities, useWhen)
✅ Token count within guidelines
✅ Code examples included
✅ Best practices documented
✅ Discoverable via relevant queries
✅ Match scores appropriate (15-20+)
✅ Saved to correct location
✅ Index rebuilt successfully
✅ Loadable via MCP
✅ Documentation updated
