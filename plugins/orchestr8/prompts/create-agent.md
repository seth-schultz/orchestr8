---
name: create-agent
description: Create new domain expert agent fragments with optimal structure
arguments:
  - name: task
    description: Domain or technology for the agent
    required: true
---

# Create Agent: {{task}}

**Request:** {{task}}

## Your Role

You are creating a new agent fragment for domain expertise in the Orchestr8 system.

## Phase 1: Expertise Scoping (0-25%)

**→ Load:** orchestr8://agents/agent-designer

**Activities:**
- Define agent specialization for {{task}}
- Determine fragmentation strategy (core vs specialized)
- Identify core knowledge vs edge cases
- Check for existing similar agents (avoid duplication)
- Plan knowledge boundaries
- Define target token budget (600-750 for core, 450-650 for specialized)

**→ Checkpoint:** Agent scope defined, no duplicates

## Phase 2: Structure Design (25-50%)

**→ Load:** orchestr8://skills/match?query=fragment+metadata+authoring&mode=index&maxResults=5

**Activities:**
- Design content structure (role, capabilities, best practices)
- Plan frontmatter metadata (tags, capabilities, useWhen)
- Determine category (agent)
- Select 6-8 relevant tags (lowercase, specific)
- Define 4-6 capabilities (what expertise provides)
- Write 3-5 useWhen scenarios (when to load this)
- Plan code examples (2-3 practical examples)

**→ Checkpoint:** Structure planned, metadata defined

## Phase 3: Content Creation (50-80%)

**→ Load:** orchestr8://match?query={{task}}&categories=agent,skill,example&mode=index&maxResults=10

**Activities:**
- Write agent frontmatter (YAML with all metadata)
- Define role and responsibilities
- Document core capabilities
- Add best practices and patterns
- Include practical code examples
- Document common pitfalls and anti-patterns
- Add cross-references to related fragments
- Ensure estimated tokens accurate

**→ Checkpoint:** Fragment content written

## Phase 4: Validation & Integration (80-100%)

**→ Load:** orchestr8://skills/match?query=fragment+testing+discovery&mode=index&maxResults=3

**Activities:**
- Test fuzzy matching with queries
- Verify metadata enables discovery
- Optimize tags and capabilities if needed
- Save to /resources/agents/
- Test loading via orchestr8:// URI
- Verify token count (should match estimate)
- Rebuild resource index
- Document in catalog

**→ Checkpoint:** Agent discoverable, integrated

## Success Criteria

✅ Clear, focused specialization (single domain)
✅ Appropriate size (600-750 core, 450-650 specialized)
✅ Rich metadata (6-8 tags, 4-6 capabilities, 3-5 useWhen)
✅ Practical code examples included
✅ Discoverable via fuzzy matching
✅ Saved to correct location
✅ Index rebuilt successfully
