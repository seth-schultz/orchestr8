---
name: create-skill
description: Create new reusable skill fragments for specific techniques
arguments:
  - name: task
    description: Skill or technique to document
    required: true
---

# Create Skill: {{task}}

**Request:** {{task}}

## Your Role

You are creating a new skill fragment documenting a specific technique or capability.

## Phase 1: Skill Definition (0-25%)

**→ Load:** orchestr8://skills/match?query=skill+authoring+fragment&mode=index&maxResults=5

**Activities:**
- Define skill scope for {{task}}
- Identify when this skill applies (useWhen scenarios)
- Determine skill category (testing, deployment, architecture, etc.)
- Check for existing similar skills (avoid duplication)
- Plan granularity (focused on single capability)
- Define target token budget (400-600 tokens)

**→ Checkpoint:** Skill defined, no duplicates

## Phase 2: Structure Planning (25-50%)

**→ Load:** orchestr8://skills/match?query=fragment+metadata&mode=index&maxResults=3

**Activities:**
- Plan content structure (technique, steps, examples)
- Design frontmatter metadata
- Select 4-6 relevant tags (lowercase, specific)
- Define 3-4 capabilities (what skill enables)
- Write 3-4 useWhen scenarios (when to apply)
- Plan practical examples (1-2 code examples)

**→ Checkpoint:** Structure planned

## Phase 3: Content Creation (50-80%)

**→ Load:** orchestr8://match?query={{task}}&categories=skill,pattern,example&mode=index&maxResults=8

**Activities:**
- Write skill frontmatter (YAML metadata)
- Document the technique clearly
- Provide step-by-step instructions
- Include practical code examples
- Document prerequisites and dependencies
- Add common pitfalls and troubleshooting
- Include related skills references
- Ensure token estimate accurate

**→ Checkpoint:** Skill content written

## Phase 4: Validation & Integration (80-100%)

**→ Load:** orchestr8://skills/match?query=testing+discovery&mode=index&maxResults=3

**Activities:**
- Test fuzzy matching with queries
- Verify metadata enables discovery
- Optimize tags if needed
- Save to /resources/skills/
- Test loading via orchestr8:// URI
- Verify token count matches estimate
- Rebuild resource index
- Test integration in workflows

**→ Checkpoint:** Skill discoverable, integrated

## Success Criteria

✅ Focused on single technique or capability
✅ Appropriate size (400-600 tokens)
✅ Rich metadata (4-6 tags, 3-4 capabilities, 3-4 useWhen)
✅ Clear step-by-step instructions
✅ Practical examples included
✅ Discoverable via fuzzy matching
✅ Saved to correct location
✅ Index rebuilt successfully
