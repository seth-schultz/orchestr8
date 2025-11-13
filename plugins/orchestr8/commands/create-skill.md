---
description: Create reusable skill fragments with techniques, patterns, and practical
  examples
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

# Create Skill: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Skills Architect** responsible for creating focused, reusable skill fragments that provide specific techniques and patterns to the Orchestr8 system.

## Phase 1: Skill Definition & Research (0-25%)

**→ Load:** orchestr8://workflows/workflow-create-skill

**Activities:**
- Define specific skill or technique
- Research best practices and patterns
- Identify use cases and applications
- Check for existing skills to avoid duplication
- Determine skill scope (technique, pattern, or practice)
- Identify target audience (developers, QA, DevOps, etc.)
- Plan content structure

**→ Checkpoint:** Skill scope defined, no duplication

## Phase 2: Structure & Metadata Design (25-50%)

**→ Load:** orchestr8://match?query=skill+fragment+structure+metadata&categories=skill&mode=index&maxResults=5

**Activities:**
- Design content organization
- Plan metadata structure
  - Tags (5-7 specific keywords)
  - Capabilities (3-5 what skill enables)
  - UseWhen scenarios (3-5 specific situations)
- Determine token budget (400-600 tokens)
- Plan examples and code snippets
- Structure technique sections
- Design best practices section

**→ Checkpoint:** Structure and metadata strategy defined

## Phase 3: Content Creation (50-80%)

**→ Load:** orchestr8://match?query=$ARGUMENTS+technique+pattern&categories=skill,example&mode=index&maxResults=8

**Activities:**

**Write Skill Fragment:**
- Create comprehensive frontmatter
- Write clear skill description
- Document when to use the skill
- Explain the technique or pattern
- Provide step-by-step guidance
- Include practical code examples
- Document best practices
- Note common mistakes
- Add variations and alternatives

**Metadata Requirements:**
```yaml
---
id: skill-name
category: skill
tags: [5-7 specific keywords]
capabilities:
  - What this skill enables 1
  - What this skill enables 2
  - What this skill enables 3
useWhen:
  - Specific use case 1
  - Specific use case 2
  - Specific use case 3
estimatedTokens: 400-600
---
```

**Content Structure:**
```markdown
# Skill Name

## Overview
Brief description of the skill

## When to Use
Scenarios where this skill applies

## Technique
Step-by-step explanation

## Implementation
How to apply the technique

## Code Examples
Practical implementations

## Best Practices
Guidelines for success

## Common Mistakes
What to avoid

## Variations
Alternative approaches
```

**→ Checkpoint:** Skill fragment written with examples

## Phase 4: Discovery Testing & Integration (80-100%)

**→ Load:** orchestr8://match?query=fragment+discovery+testing&categories=skill&mode=index&maxResults=3

**Activities:**

**Discovery Testing:**
- Test queries that should match skill
- Verify appropriate match scores
- Test with different phrasings
- Ensure skill appears in relevant searches

**Quality Review:**
- Verify examples are clear and correct
- Check that technique is well-explained
- Ensure use cases are specific
- Validate metadata completeness

**Integration:**
- Save to `resources/skills/`
- Rebuild search index
- Verify skill is discoverable
- Test loading via MCP

**Documentation:**
- Add to skills catalog
- Document usage examples
- Create query examples

**→ Checkpoint:** Skill integrated and discoverable

## Skill Quality Checklist

### Definition
- [ ] Clear, focused technique or pattern
- [ ] No duplication with existing skills
- [ ] Appropriate scope (single technique/pattern)
- [ ] Specific and actionable

### Metadata
- [ ] 5-7 relevant tags
- [ ] 3-5 clear capabilities
- [ ] 3-5 specific useWhen scenarios
- [ ] Accurate token count (400-600)

### Content
- [ ] Clear overview and description
- [ ] When to use explained
- [ ] Technique well-documented
- [ ] Step-by-step guidance provided
- [ ] Code examples included
- [ ] Best practices documented
- [ ] Common mistakes noted
- [ ] Concise and focused

### Examples
- [ ] Practical and relevant
- [ ] Working code snippets
- [ ] Properly commented
- [ ] Cover common scenarios

### Discovery
- [ ] Discoverable via relevant queries
- [ ] Match scores appropriate
- [ ] Works with query variations
- [ ] Appears in expected results

### Integration
- [ ] Saved to correct location
- [ ] Index rebuilt
- [ ] Loadable via MCP
- [ ] Documentation updated

## Example Skill Fragment

```markdown
---
id: testing-integration-patterns
category: skill
tags: [testing, integration-testing, test-patterns, api-testing, database-testing]
capabilities:
  - Design effective integration test strategies
  - Test API endpoints and database interactions
  - Implement test isolation and cleanup
useWhen:
  - Testing interactions between system components
  - Validating API endpoint functionality
  - Testing database operations and transactions
estimatedTokens: 480
---

# Integration Testing Patterns

## Overview
Integration testing validates interactions between components...

## When to Use
- Testing API endpoints with database
- Validating service-to-service communication
- Testing external integrations

## Technique

### Test Isolation
Each test should be independent...

### Setup and Teardown
Proper test environment management...

### Data Management
Strategies for test data...

## Code Examples

### API Integration Test
\`\`\`typescript
describe('User API Integration', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it('should create and retrieve user', async () => {
    // Test implementation
  });
});
\`\`\`

## Best Practices
✅ Use test database separate from production
✅ Clean data between tests
✅ Test both success and failure paths

## Common Mistakes
❌ Shared state between tests
❌ Testing implementation details
❌ Slow tests without optimization
```

## Skill Types

### Techniques
- How to do something specific
- Step-by-step procedures
- Implementation patterns

### Patterns
- Reusable solutions to common problems
- Design approaches
- Architectural patterns

### Practices
- Best practices and guidelines
- Quality standards
- Development workflows

## Success Criteria

✅ Skill clearly defined and scoped
✅ No duplication with existing skills
✅ Complete metadata (tags, capabilities, useWhen)
✅ Token count within guidelines (400-600)
✅ Technique or pattern well-explained
✅ Step-by-step guidance provided
✅ Practical code examples included
✅ Best practices documented
✅ Common mistakes noted
✅ Discoverable via relevant queries
✅ Match scores appropriate
✅ Saved to correct location
✅ Index rebuilt successfully
✅ Loadable via MCP
✅ Documentation updated
