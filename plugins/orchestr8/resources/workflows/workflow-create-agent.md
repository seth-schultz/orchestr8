---
id: workflow-create-agent
category: pattern
tags: [workflow, agent-creation, fragment-design, meta, orchestr8, expertise-capture, domain-knowledge]
capabilities:
  - Create domain expert agent fragments with focused expertise
  - Design agent structure for specific capabilities
  - Optimize agent fragments for token efficiency and discoverability
useWhen:
  - Specialized domain expert agent creation requiring capability definition, tag selection, code example inclusion, and metadata optimization
  - Agent fragment design for technologies or domains needing expertise capture with 500-700 token guidelines and discoverability testing
estimatedTokens: 520
---

# Create Agent Fragment Pattern

**Phases:** Expertise Scope (0-25%) → Structure (25-50%) → Content (50-75%) → Validate (75-100%)

## Phase 1: Expertise Scoping (0-25%)
- Define specialization area: `${technology}-${focus}` (e.g., `typescript-api`, `python-fastapi`)
- Determine focus vs breadth (specialized 450-600 tokens, core 600-700 tokens)
- Identify key knowledge areas (fundamentals, patterns, best practices)
- Check for existing agents (avoid duplication, find gaps)
- **Checkpoint:** Agent scope defined, unique value identified

## Phase 2: Structure Design (25-50%)
**Content structure:**
- **Expertise:** Domain and specialization (1-2 sentences)
- **Core Knowledge:** Fundamental concepts (3-5 bullets)
- **Best Practices:** Key principles and patterns (4-6 bullets)
- **Common Pitfalls:** What to avoid (3-4 bullets)
- **Code Patterns:** Essential examples (2-3 concise snippets)
- **When to Use:** Specific scenarios for this agent (3-4 bullets)

**Metadata design:**
- **ID:** `${tech}-${specialization}` (descriptive, unique)
- **Category:** `agent`
- **Tags:** 6-8 tags (technology, domain, capabilities, use-cases)
- **Capabilities:** 4-6 specific capabilities (what this agent knows)
- **useWhen:** 4-6 concrete scenarios
- **Checkpoint:** Structure planned, expertise areas defined

## Phase 3: Content Creation (50-75%)
**Write fragment:**
- YAML frontmatter with rich metadata
- Focused content (450-700 tokens based on scope)
- Actionable knowledge (not just theory)
- Code examples (2-3 languages/contexts if applicable)
- Technology-specific best practices

**Fragmentation strategy:**
- **Core agent:** Broad fundamentals (600-700 tokens)
- **Specialized agents:** Deep dive into specific area (450-600 tokens)
- **Example:** `typescript-expert-core` + `typescript-expert-api` + `typescript-expert-testing`

**Quality checks:**
- Token count accurate
- No overlap with existing agents
- Expertise depth appropriate for size
- **Checkpoint:** Fragment written, properly scoped

## Phase 4: Validation & Integration (75-100%)
**Parallel tracks:**
- **Discovery testing:** Test queries matching intended use-cases, verify agent selected for relevant queries
- **Metadata optimization:** Enhance capabilities/useWhen if not discoverable, add missing tags, retest
- **Integration:** Save to `resources/agents/`, verify no conflicts, update index
- **Documentation:** Document agent purpose, sample queries, related fragments
- **Checkpoint:** Agent discoverable, integrated, documented

## Success Criteria
✅ Clear specialization (focused domain expertise)
✅ Appropriate size (core 600-700, specialized 450-600 tokens)
✅ Rich metadata (6-8 tags, 4-6 capabilities, 4-6 useWhen)
✅ Discoverable via domain queries (test with 5-6 queries)
✅ Actionable knowledge (not just definitions)
✅ Saved to `resources/agents/`

## Fragmentation Examples
```markdown
# Instead of one large "typescript-expert" (1500 tokens):

Create focused fragments:
- typescript-expert-core.md (600 tokens)
  - Core language features, type system, modules

- typescript-expert-api.md (500 tokens)
  - Express, REST API design, middleware

- typescript-expert-async.md (450 tokens)
  - Promises, async/await, error handling

- typescript-expert-testing.md (450 tokens)
  - Jest, unit testing, mocking

Result: Load only relevant expertise (60% token savings)
```

## Example Queries for Testing
```markdown
Agent: typescript-expert-api
□ orchestr8://agents/match?query=typescript+api
□ orchestr8://agents/match?query=rest+api+express+typescript
□ orchestr8://agents/match?query=backend+web+server
□ orchestr8://agents/match?query=node+api+development
```
