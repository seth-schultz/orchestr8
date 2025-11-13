# Content Authoring Guide

Complete guide for creating high-quality content for the Orchestr8 plugin.

## Overview

The Orchestr8 plugin uses a **dynamic expertise system** powered by fragments - focused, discoverable content units that are loaded just-in-time based on semantic matching. Creating effective content requires understanding how to structure, tag, and optimize these fragments for maximum discoverability and token efficiency.

## Content Types

### 1. **Fragments** (Building Blocks)
Small, focused units of knowledge (500-1000 tokens) that are dynamically loaded based on semantic matching.

**Location:** `resources/*/\`

**Categories:**
- **Agents:** Domain expertise (e.g., TypeScript Developer, DevOps Expert)
- **Skills:** Reusable techniques (e.g., Error Handling, Testing Strategies)
- **Patterns:** Architectural approaches (e.g., Microservices, Event-Driven)
- **Examples:** Concrete code examples (e.g., REST API setup, Docker configuration)
- **Guides:** How-to guides (e.g., AWS setup, CI/CD pipelines)
- **Workflows:** Execution workflows (e.g., bug fixing, feature development)

**Guide:** [Fragment Authoring](./fragments.md)

### 2. **Agents** (Domain Experts)
Specialized domain expertise representing "who" knows a technology or domain.

**Examples:**
- `typescript-core` + `typescript-api-development` + `typescript-testing`
- `python-core` + `python-fastapi-dependencies` + `python-async-fundamentals`
- `rust-expert-core` + `rust-expert-advanced`

**Guide:** [Agent Creation](./agents.md)

### 3. **Skills** (Techniques)
Reusable techniques representing "how" to accomplish something, typically language-agnostic.

**Examples:**
- `error-handling-resilience`
- `testing-integration-patterns`
- `security-authentication-jwt`
- `observability-structured-logging`

**Guide:** [Skill Creation](./skills.md)

### 4. **Workflows** (Execution Strategies)
Multi-phase execution patterns with JIT expertise loading.

**Examples:**
- `workflow-fix-bug`
- `workflow-add-feature`
- `workflow-research-tech`
- `workflow-create-agent`

**Guide:** [Workflow Creation](./workflows.md)

### 5. **Commands/Prompts** (Slash Commands)
User-facing slash commands that execute workflows or provide specialized functionality.

**Location:** `commands/` or `prompts/`

**Examples:**
- `/orchestr8:now` - Autonomous organization workflow
- `/orchestr8:mcp-ui` - Launch MCP UI

**Guide:** [Command Creation](./commands.md)

## Content Lifecycle

```
1. Create → Write fragment with rich metadata
2. Test → Verify discoverability with queries
3. Optimize → Enhance metadata if needed
4. Index → Rebuild index (automatic)
5. Deploy → Commit to repository
```

## Quality Standards

All content must meet these standards:

### Discoverability
- **Rich metadata:** 5-8 specific tags, concrete capabilities, actionable useWhen scenarios
- **Semantic matching:** Fragment appears in top results for relevant queries
- **Unique value:** Provides distinct expertise not covered by other fragments

### Token Efficiency
- **Size guidelines:**
  - Core fragments: 600-750 tokens
  - Specialized fragments: 450-650 tokens
  - Skills: 500-700 tokens
  - Maximum: 1000 tokens per fragment
- **Focused scope:** Single clear purpose, not multiple topics
- **No redundancy:** Avoid duplicating existing content

## Optimization Patterns

Orchestr8 uses several optimization patterns to maximize token efficiency while maintaining discoverability:

### Phase 1: Example Extraction
**When to extract examples to separate files:**
- Fragment exceeds 100 lines with multiple code examples
- Examples are >30% of fragment content
- Complex implementations that could be referenced

**Pattern:**
```markdown
Main Fragment (reduced by 200-300 tokens):
- Core concepts and principles
- Brief inline examples (5-10 lines)
- References to detailed examples

Example File (orchestr8://examples/example-name):
- Complete working implementation
- Detailed comments and explanations
- Multiple variations
```

**Benefits:**
- 25-40% token savings on main fragment
- Examples loaded on-demand
- Better maintainability

### Phase 2: Structural Organization
**Creating skill families with parent-child relationships:**
- Group related skills under parent concepts
- Add cross-references between related resources
- Reorganize pattern families by domain

**Pattern:**
```markdown
Parent Skill: error-handling (overview)
├─ error-handling-resilience (retry, circuit breaker)
├─ error-handling-logging (structured logging)
└─ error-handling-validation (input validation)

Cross-references improve discoverability by 15-20%
```

**ROI Analysis:**
- Investment: 50-100 tokens per fragment for cross-refs
- Return: 3-5x improved discoverability
- Worthwhile when: Fragment is frequently used with others

### Phase 3: Progressive Loading
**Splitting mega-fragments into core + advanced modules:**
- Identify always-needed vs sometimes-needed content
- Create prerequisite relationships
- Use phase-based JIT loading in workflows

**Pattern:**
```markdown
Core Module (600-750 tokens):
- Fundamentals everyone needs
- Common patterns
- Basic examples

Advanced Module (450-650 tokens):
prerequisite: [core-module-id]
- Advanced techniques
- Edge cases
- Performance optimizations
```

**Token Savings:**
- Generic queries: Load core only (40-60% savings)
- Specific queries: Load core + advanced (selective loading)
- Total efficiency: 50-70% reduction in unnecessary token loading

### Clarity
- **Clear structure:** Organized sections with headers
- **Actionable content:** Practical knowledge, not just theory
- **Code examples:** 2-3 concise, working examples where applicable
- **Cross-references:** Link to related fragments

### Accuracy
- **Technically correct:** Verified, up-to-date information
- **Best practices:** Industry-standard approaches
- **Tested patterns:** Code examples that actually work

### Reusability
- **Composable:** Can be combined with other fragments
- **Context-independent:** Works standalone or in combination
- **Language-appropriate:** Multi-language examples when generic

### Maintainability
- **Clear naming:** `${category}-${technology}-${specialization}`
- **Version awareness:** Note framework/language versions when relevant
- **Update-friendly:** Easy to modify when technologies evolve

## When to Create Each Type

| Content Type | Create When... |
|-------------|----------------|
| **Agent** | Representing domain expertise or role-based knowledge (TypeScript Developer, Cloud Architect) |
| **Skill** | Capturing reusable technique applicable across contexts (Error Handling, Testing) |
| **Pattern** | Documenting architectural approach or design pattern (Microservices, CQRS) |
| **Example** | Providing concrete code implementation (Express API setup, Docker config) |
| **Guide** | Writing step-by-step how-to (AWS setup, CI/CD pipeline creation) |
| **Workflow** | Designing multi-phase execution strategy (Bug fix workflow, Feature development) |
| **Command** | Creating user-facing slash command (Autonomous organization, UI tools) |

## Frontmatter Validation Requirements

All fragments MUST include valid YAML frontmatter with these fields:

### Required Fields
- **id:** Unique identifier following naming conventions
- **category:** One of: agent, skill, pattern, example, guide, workflow
- **tags:** Array of 5-8 specific, searchable tags
- **capabilities:** Array of 3-6 concrete capability statements
- **useWhen:** Array of 3-6 specific scenario descriptions
- **estimatedTokens:** Integer estimate accurate within ±10%

### Optional Fields (for optimization)
- **prerequisite:** Array of fragment IDs that should be loaded first
- **relatedTo:** Array of fragment IDs for cross-referencing
- **examples:** Array of orchestr8:// URIs to example files
- **advancedTopics:** Array of orchestr8:// URIs to advanced modules

### Validation Rules
```yaml
# ✅ Valid frontmatter
---
id: typescript-core
category: agent
tags: [typescript, javascript, types, generics, node]
capabilities:
  - TypeScript type system with generics and conditional types
  - Module system and import/export patterns
useWhen:
  - Building TypeScript applications or libraries
  - Reviewing or writing TypeScript code
estimatedTokens: 650
examples:
  - orchestr8://examples/typescript-generics-advanced
---

# ❌ Invalid - missing required fields
---
id: typescript-core
tags: [typescript]
---

# ❌ Invalid - inaccurate token count
---
id: typescript-core
estimatedTokens: 650  # Actual: 1200 tokens (>10% error)
---
```

## Review Process

Before committing new content:

1. **Metadata check:**
   - [ ] ID follows naming convention: `${category}-${tech}-${specialization}`
   - [ ] Category is correct (agent, skill, pattern, example, guide, workflow)
   - [ ] 5-8 specific tags included
   - [ ] 3-6 concrete capabilities defined
   - [ ] 3-6 actionable useWhen scenarios
   - [ ] Accurate token count within ±10% (use `wc -w file.md | multiply by 0.75`)
   - [ ] Optional optimization fields used when appropriate

2. **Content quality:**
   - [ ] Focused on single topic
   - [ ] 500-1000 tokens (target based on type)
   - [ ] Code examples included and tested
   - [ ] No duplication with existing fragments
   - [ ] Cross-references to related content

3. **Discoverability testing:**
   - [ ] Test 4-6 relevant queries using MCP UI or match resources
   - [ ] Fragment appears in top results for intended use cases
   - [ ] Metadata accurately reflects content

4. **Integration:**
   - [ ] Saved to correct `resources/*/\` directory
   - [ ] No file conflicts
   - [ ] Index rebuilt (automatic on file changes)

## Common Issues & Fixes

### Issue: Fragment not discoverable
**Symptoms:** Doesn't appear in fuzzy matching results for relevant queries

**Fixes:**
- Add more specific tags (avoid generic like "development", use "typescript-api")
- Make capabilities concrete (not "TypeScript expertise", use "TypeScript advanced type system with generics and conditional types")
- Write specific useWhen scenarios (not "building APIs", use "Designing Express.js REST API with middleware patterns and error handling")
- Ensure tags match expected user queries

### Issue: Fragment too large
**Symptoms:** Token count >1000, loads unnecessary content

**Fixes:**
- Split into core + specialized fragments
- Remove redundant explanations
- Condense code examples (keep only essential parts)
- Move detailed examples to separate example fragments

### Issue: Poor reusability
**Symptoms:** Fragment only useful in very narrow context

**Fixes:**
- Remove project-specific details
- Make code examples generic
- Focus on transferable patterns
- Add variations for different contexts

### Issue: Overlap with existing fragments
**Symptoms:** Similar content in multiple fragments, conflicting results

**Fixes:**
- Search existing fragments before creating new ones
- Specialize or merge overlapping fragments
- Cross-reference instead of duplicate
- Differentiate with more specific focus

## Best Practices Summary

See [Best Practices Guide](./best-practices.md) for comprehensive checklist and guidelines.

**Quick checklist:**
- ✅ Fragment focused on single topic (500-1000 tokens)
- ✅ Rich, specific metadata (5-8 tags, concrete capabilities/useWhen)
- ✅ Discoverable via relevant queries (test with 4-6 queries)
- ✅ Code examples included and tested
- ✅ No duplication with existing content
- ✅ Saved to correct directory
- ✅ Index rebuilds automatically

## Templates

Copy-paste ready templates for all content types:

- [Fragment Template](./templates/fragment-template.md)
- [Agent Template](./templates/agent-template.md)
- [Skill Template](./templates/skill-template.md)
- [Workflow Template](./templates/workflow-template.md)
- [Command Template](./templates/command-template.md)

## Getting Help

- **Documentation:** Browse [existing fragments](../../resources/) for examples
- **Web UI:** Use `/orchestr8:mcp-ui` to test fragment matching
- **Guides:** See individual authoring guides for detailed instructions
- **Troubleshooting:** Consult [troubleshooting guide](../guides/troubleshooting.md)

## Next Steps

1. Read [Fragment Authoring Guide](./fragments.md) to understand the foundation
2. Choose your content type and read the specific guide
3. Copy the appropriate template
4. Create your content following the guidelines
5. Test discoverability before committing
6. Submit for review (if applicable)

---

**Remember:** Good metadata is as important as good content. Fragments are only useful if they can be discovered and loaded when needed.
