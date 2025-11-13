---
id: self-improvement-loop-pattern
category: pattern
tags: [meta, self-improvement, learning, optimization, knowledge-capture]
capabilities:
  - Continuous improvement workflow pattern
  - Knowledge extraction from implementations
  - Fragment creation from experience
  - Resource library enhancement
useWhen:
  - Post-implementation knowledge extraction requiring systematic capture of reusable techniques, domain expertise, and architectural patterns
  - Building organizational knowledge base with fragment creation from completed projects for future discoverability
  - Creating new Orchestr8 resources including agent fragments, skill patterns, workflow templates, and code examples
  - Metadata optimization projects improving fragment discoverability through enhanced tags, capabilities, and useWhen scenarios
  - Continuous improvement initiatives expanding resource library with progressive knowledge accumulation from real implementations
estimatedTokens: 650
---

# Self-Improvement Loop Pattern

Systematic pattern for extracting knowledge from completed implementations and creating reusable fragments to continuously improve the Orchestr8 resource library.

## Pattern Overview

After completing any significant implementation:
1. **Reflect** - What techniques were reusable?
2. **Extract** - Create fragment(s) capturing knowledge
3. **Optimize** - Ensure rich metadata for discoverability
4. **Test** - Verify fragments can be found via fuzzy matching
5. **Integrate** - Add to resource library for future use

## Improvement Loop Stages

### Stage 1: Post-Implementation Reflection

**After completing a task, analyze:**
```markdown
Knowledge Assessment Questions:

□ What domain expertise was required?
  → Candidate for agent fragment

□ What techniques/methods were used?
  → Candidate for skill fragment

□ What architectural decisions were made?
  → Candidate for pattern fragment

□ What code patterns were especially useful?
  → Candidate for example fragment

□ What workflow structure worked well?
  → Candidate for workflow template
```

**Extraction triggers:**
```markdown
Create fragment when:
✅ Technique used would apply to other projects
✅ Domain knowledge not yet captured in fragments
✅ Pattern solved a common problem elegantly
✅ Workflow structure was particularly effective
✅ Example code demonstrates best practice

Don't create fragment when:
❌ One-off, project-specific logic
❌ Already well-covered by existing fragments
❌ Trivial or obvious technique
```

### Stage 2: Fragment Creation

**Agent Fragment (expertise capture):**
```markdown
If you gained expertise in a domain:

1. Identify specialization area
   - ${technology}-${specialization}
   - Example: "python-fastapi", "typescript-async-patterns"

2. Document key knowledge
   - Fundamental concepts
   - Best practices
   - Common pitfalls
   - Code patterns

3. Size appropriately
   - Core: 600-700 tokens
   - Specialized: 450-600 tokens

4. Create file: resources/agents/${id}.md
```

**Skill Fragment (technique capture):**
```markdown
If you used a reusable technique:

1. Identify technique
   - ${technique}-${context}
   - Example: "async-error-handling", "api-testing-patterns"

2. Document methodology
   - Step-by-step approach
   - Code examples (2-3 languages if applicable)
   - Common pitfalls
   - Best practices

3. Size appropriately
   - Target: 500-700 tokens

4. Create file: resources/skills/${id}.md
```

**Pattern Fragment (architecture capture):**
```markdown
If you applied an architectural pattern:

1. Identify pattern
   - ${pattern}-${domain}
   - Example: "event-driven-microservices", "layered-architecture"

2. Document approach
   - When to use
   - Structure and components
   - Implementation guidance
   - Trade-offs

3. Size appropriately
   - Target: 600-800 tokens

4. Create file: resources/patterns/${id}.md
```

**Example Fragment (code pattern capture):**
```markdown
If you created exemplary code:

1. Identify example type
   - ${technology}-${pattern}
   - Example: "typescript-express-middleware", "python-async-db-connection"

2. Document with context
   - What problem it solves
   - Full working code
   - Explanation of key parts
   - Variations

3. Size appropriately
   - Target: 400-600 tokens

4. Create file: resources/examples/${id}.md
```

### Stage 3: Metadata Optimization

**For each new fragment:**
```yaml
---
id: ${descriptive-unique-id}
category: agent | skill | pattern | example
tags:
  - ${primary-technology}
  - ${secondary-technology}
  - ${domain}
  - ${pattern-or-technique}
  - ${use-case}
  # 5-8 tags total
capabilities:
  - ${specific-capability-1-with-details}
  - ${specific-capability-2-with-details}
  - ${specific-capability-3-with-details}
useWhen:
  - ${concrete-scenario-1}
  - ${concrete-scenario-2}
  - ${concrete-scenario-3}
estimatedTokens: ${calculated-count}
---
```

**Metadata quality checklist:**
```markdown
□ ID is descriptive and unique
□ Category is correct (agent/skill/pattern/example)
□ 5-8 specific tags (technology, domain, use-case)
□ 3-5 concrete capabilities with details
□ 3-5 specific useWhen scenarios
□ Accurate token count (use wc -w | multiply by 0.75)
```

### Stage 4: Discoverability Testing

**Test fuzzy matching:**
```markdown
For each new fragment, test queries:

Agent fragment (typescript-async-patterns):
□ orchestr8://agents/match?query=typescript
□ orchestr8://agents/match?query=typescript+async
□ orchestr8://agents/match?query=async+promises+typescript
□ orchestr8://agents/match?query=concurrent+operations

Skill fragment (error-handling-async):
□ orchestr8://skills/match?query=error+handling
□ orchestr8://skills/match?query=async+errors
□ orchestr8://skills/match?query=try+catch+async

If fragment NOT selected:
→ Enhance metadata (add tags, improve capabilities/useWhen)
→ Retest until discoverable
```

### Stage 5: Knowledge Integration

**Update resource library:**
```bash
# Save new fragment
mv ${fragment}.md resources/${category}/

# Rebuild if needed (for TypeScript projects)
npm run build

# Verify structure
npm run verify
```

**Document in session:**
```markdown
Created fragments from this implementation:

- Agent: ${id}
  - Location: resources/agents/${id}.md
  - Captures: ${what-knowledge}
  - Findable via: ${sample-queries}

- Skill: ${id}
  - Location: resources/skills/${id}.md
  - Captures: ${what-technique}
  - Findable via: ${sample-queries}
```

## Workflow Integration

**Build improvement into workflows:**
```markdown
## Final Phase: Knowledge Extraction (95-100%)

After implementation complete:

1. Identify reusable knowledge from this project
2. Create fragment(s) capturing techniques/expertise
3. Optimize metadata for discoverability
4. Test fuzzy matching
5. Save to resource library

This ensures future projects benefit from today's learnings.
```

## Progressive Knowledge Building

**Start small, expand over time:**
```markdown
Session 1: Build TypeScript API
→ Create: typescript-api-development.md (500 tokens)

Session 2: Add authentication to TypeScript API
→ Create: auth-jwt-typescript.md (450 tokens)

Session 3: Build Python API
→ Create: python-api-fastapi.md (500 tokens)

Session 4: General API patterns emerge
→ Create: api-design-rest-best-practices.md (600 tokens)

Over time: Rich library covering many domains
```

## Optimization Triggers

**When to optimize existing fragments:**
```markdown
Optimize if:
✅ Used a fragment and found gaps/outdated info
✅ Learned better approach than what fragment documents
✅ Fragment has poor metadata (not discoverable)
✅ Fragment too large (>1200 tokens, should split)
✅ New version of technology changes best practices

Process:
1. Read existing fragment
2. Update content (add, modify, or split)
3. Enhance metadata if needed
4. Retest discoverability
5. Save updated fragment
```

## Meta-Workflow: Creating Workflows

**Self-improvement for workflow creation:**
```markdown
After using a workflow pattern successfully:

1. Generalize the pattern
   - What made it work?
   - What parameters would vary?
   - What phases were effective?

2. Create workflow template
   ---
   name: ${pattern}-workflow
   arguments:
     - name: ${user-input}
   ---

   # ${Pattern} Workflow

   ## Phase 1: ${stage} (0-X%)
   **→ JIT Load:** orchestr8://match?query=${argument}&...

   ## Phase 2: ...

3. Save to prompts/workflows/ or document as pattern

4. Use in future via /now command
   /now "${request matching this pattern}"
   → Dynamically loads this workflow
```

## Best Practices

✅ **Extract after doing** - Create fragments from real implementations
✅ **Rich metadata** - Optimize for fuzzy matching
✅ **Test discoverability** - Verify queries find your fragments
✅ **Size appropriately** - Follow token guidelines (500-800)
✅ **Document learnings** - Capture what worked and what didn't
✅ **Update existing** - Improve fragments when you learn better approaches
✅ **Progressive build** - Small fragments accumulate into rich library

❌ **Don't create upfront** - Don't guess what will be useful
❌ **Don't skip metadata** - Poor metadata = unfindable fragment
❌ **Don't create one-offs** - Only capture reusable knowledge
❌ **Don't create duplicates** - Check existing fragments first

## Success Metrics

**Measure improvement:**
```markdown
Library growth:
- Week 1: 20 fragments
- Week 4: 50 fragments
- Week 12: 150 fragments

Match quality:
- 80%+ of queries return relevant fragments
- Average 2-3 highly relevant matches per query
- Token utilization >85%

Reuse frequency:
- Track how often each fragment is loaded
- Optimize high-use fragments
- Remove/consolidate low-use fragments
```

## Example: Complete Improvement Loop

```markdown
Task: Built TypeScript REST API with JWT authentication

## Reflection:
- Used TypeScript + Express
- Implemented JWT middleware
- Created async error handling pattern
- Structured layered architecture

## Fragments Created:

1. Agent: typescript-api-development.md (520 tokens)
   - Express.js patterns
   - Middleware design
   - Route structuring

2. Skill: auth-jwt-middleware.md (480 tokens)
   - JWT validation
   - Middleware pattern
   - Error handling for auth

3. Pattern: api-layered-architecture.md (600 tokens)
   - Controller → Service → Repository
   - Dependency injection
   - Testing approach

## Metadata Optimized:
- 6-8 tags per fragment
- Specific capabilities
- Concrete useWhen scenarios

## Testing:
All fragments discoverable via relevant queries ✅

## Integration:
Saved to resources/{category}/ ✅
Ready for future use ✅
```
