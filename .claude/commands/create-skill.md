---
description: Complete skill creation lifecycle from requirements to integration with auto-activation context design and cross-agent applicability validation
argumentHint: "[skill-requirements-description]"
---

# Create Skill Workflow

## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate this entire workflow to the skill-architect using the Task tool.

**Delegation Instructions:**
```
Use Task tool with:
- subagent_type: "skill-architect"
- description: "Create new auto-activated skill"
- prompt: "Execute the create-skill workflow for: [user's skill requirements].

Create a complete new skill:
1. Validate this should be a skill (not agent) (25%)
2. Design skill with auto-activation triggers and methodology (30%)
3. Implement skill file with comprehensive patterns and examples (25%)
4. Test skill auto-activation behavior (10%)
5. Update plugin.json metadata and VERSION (5%)
6. Update CHANGELOG.md with skill addition (5%)

Follow all phases, enforce quality gates, and meet all success criteria."
```

**After delegation:**
- The skill-architect will handle entire skill creation autonomously
- Returns to main context when complete or if user input required

---

## Skill Creation Instructions for Orchestrator

You are orchestrating the complete creation of a new auto-activated skill from requirements analysis to plugin integration.

## Workflow Overview

This workflow uses the `skill-architect` specialist to design and implement a new skill following established orchestr8 patterns, then uses `plugin-developer` to update plugin metadata.

## Execution Instructions

### Phase 1: Requirements Analysis & Skill Validation (25%)

**Use `skill-architect` to analyze requirements:**

1. **Skill vs Agent Decision**

   **CREATE A SKILL if:**
   - ✅ Providing methodology guidance (TDD, security practices, etc.)
   - ✅ Defining reusable patterns (design patterns, architectural patterns)
   - ✅ Creating cross-cutting expertise (testing, performance, accessibility)
   - ✅ Auto-activation desired based on context
   - ✅ No direct tool execution needed
   - ✅ Augmenting multiple agents' capabilities
   - ✅ Knowledge should be always available

   **CREATE AN AGENT if:**
   - ❌ Need autonomous task execution
   - ❌ Tool access required (file operations, bash, etc.)
   - ❌ Specific task completion with clear start/end
   - ❌ Strategic decision-making independently
   - ❌ Model selection needed
   - ❌ Explicit invocation required

   **If this should be an agent, STOP and use `/create-agent` instead.**

2. **Extract Skill Specifications**
   - What methodology or practice does this skill cover?
   - When should it auto-activate?
   - What agents will benefit from it?
   - What expertise does it provide?

3. **Category Determination**
   - `practices/` - Development methodologies (TDD, BDD, etc.)
   - `patterns/` - Design patterns, architectural patterns
   - `languages/` - Language-specific idioms
   - `frameworks/` - Framework-specific patterns
   - `tools/` - Tool usage patterns
   - `domains/` - Domain-specific knowledge
   - `meta/` - System-level patterns

4. **Activation Context Analysis**
   - What tasks trigger this skill?
   - What keywords indicate relevance?
   - What agent types need this skill?
   - When should it NOT activate?

**CHECKPOINT**: Confirmed this should be a skill (not agent), category identified ✓

### Phase 2: Skill Design (25%)

**Use `skill-architect` to design the skill:**

1. **Frontmatter Design**

   Simple structure (no model or tools):

   ```yaml
   ---
   name: skill-name
   description: Expertise in [methodology/pattern/practice]. Activate when [context/task]. [What it guides you to do], ensuring [quality outcome].
   ---
   ```

   **Description Pattern:**
   ```
   "Expertise in [what].
   Activate when [when].
   [Guidance], ensuring [outcome]."
   ```

2. **Content Structure Design**

   **Recommended Sections:**
   ```markdown
   # Skill Name

   [Introduction]

   ## Core Concept / Core Methodology

   [Fundamental approach]

   ### Subsection 1
   [Detailed explanation with code examples]

   ### Subsection 2
   [More details]

   ## Best Practices

   ### DO ✅
   [Good practices with examples]

   ### DON'T ❌
   [Anti-patterns with explanations]

   ## Workflow / Application Scenarios

   ### Scenario 1: [Use Case]
   [Step-by-step application]

   ### Scenario 2: [Different Use Case]
   [More scenarios]

   ## When to Use

   **Use [skill name] for:**
   - ✅ Use case 1
   - ✅ Use case 2

   **[Skill name] Less Critical for:**
   - Alternative approach scenarios

   ## Remember

   1. [Key point 1]
   2. [Key point 2]
   [Summary of critical principles]
   ```

3. **Code Example Planning**
   - 5+ examples minimum
   - Multiple languages OK
   - Real-world, practical examples
   - Well-commented code
   - Before/after patterns

4. **Cross-Agent Applicability**
   - Identify which agents benefit
   - Ensure reusability
   - Avoid agent-specific content

**CHECKPOINT**: Design complete, structure validated ✓

### Phase 3: Implementation (35%)

**Use `skill-architect` to implement the skill:**

1. **Create Skill Directory and File**
   - Directory: `.claude/skills/[category]/[skill-name]/`
   - File: `SKILL.md` (uppercase, exactly this name)

2. **Write Frontmatter**
   - name (kebab-case, matches directory)
   - description (expertise/activate/outcome pattern)
   - NO other fields (no model, tools, etc.)

3. **Write Core Content**

   **Section 1: Title and Introduction**
   ```markdown
   # Skill Name

   [1-2 paragraph introduction explaining what this skill covers
   and how it helps agents]
   ```

   **Section 2: Core Concept**
   ```markdown
   ## Core Concept / Core Methodology

   [Fundamental principle or approach]

   ### Subsection: [Aspect]

   [Detailed explanation]

   ```language
   // Code example
   ```

   [Additional explanation]
   ```

   **Section 3: Best Practices**
   ```markdown
   ## Best Practices

   ### DO ✅

   ```language
   // Good example
   ```

   - Explanation and benefits

   ### DON'T ❌

   ```language
   // Bad example
   ```

   - Explanation and problems
   ```

   **Section 4: Workflows/Scenarios**
   ```markdown
   ## Application Workflows

   ### Workflow 1: [Scenario]

   ```
   1. Step 1
   2. Step 2
   ```

   [Code example]

   ### Workflow 2: [Different Scenario]
   [...]
   ```

   **Section 5: Common Patterns**
   ```markdown
   ## Common Patterns

   ### Pattern 1: [Name]

   [Explanation and code example]

   ### Pattern 2: [Name]

   [Explanation and code example]
   ```

   **Section 6: When to Use**
   ```markdown
   ## When to Use [Skill Name]

   **Use [skill name] for:**
   - ✅ Situation 1
   - ✅ Situation 2

   **[Skill name] Less Critical for:**
   - Optional situation 1
   ```

   **Section 7: Summary**
   ```markdown
   ## Remember

   1. **Key Point 1** - Explanation
   2. **Key Point 2** - Explanation
   3. **Key Point 3** - Explanation

   [Closing statement]
   ```

4. **Add Code Examples**
   - Real-world examples
   - Multiple languages if applicable
   - Well-commented
   - Varied complexity
   - 50-150 lines per major example

**CHECKPOINT**: Skill file created, 200-300 lines typical ✓

### Phase 4: Validation (10%)

**Validate skill implementation:**

1. **Frontmatter Validation**
   - `name` present (kebab-case, matches directory)
   - `description` present (follows pattern)
   - NO extra fields (no model, tools, categories, etc.)
   - Valid YAML syntax

2. **File Structure Validation**
   - Directory: `.claude/skills/[category]/[skill-name]/`
   - File: `SKILL.md` (uppercase)
   - Category appropriate

3. **Content Quality Validation**
   - Clear core concept explanation
   - 5+ code examples
   - DO/DON'T sections present
   - Workflow/scenarios included
   - When to use guidance
   - Summary/key takeaways

4. **Skill vs Agent Re-Validation**
   - Confirms this should be a skill
   - No tool execution requirements
   - Methodology/pattern/practice focused
   - Auto-activation context clear

5. **Cross-Agent Value Validation**
   - Useful to multiple agent types
   - Not specific to one agent
   - Reusable expertise
   - Broadly applicable

**CHECKPOINT**: All validations passed ✓

### Phase 5: Plugin Metadata Update (5%)

**Use `plugin-developer` to update metadata:**

1. **Count Skills**
   ```bash
   find .claude/skills -type d -mindepth 2 -maxdepth 2 | wc -l
   ```

2. **Update VERSION**
   - Increment MINOR version (e.g., 1.4.0 → 1.5.0)
   - Update `.claude/VERSION` file

3. **Update plugin.json**
   - Update `version` field
   - Update description if skills mentioned
   - Note: Skills may not have explicit count in plugin.json yet

4. **Verify Synchronization**
   - VERSION matches plugin.json version
   - JSON is valid

**CHECKPOINT**: Plugin metadata updated and synchronized ✓

### Phase 6: Documentation (5%)

**Use `plugin-developer` to update CHANGELOG:**

1. **Add CHANGELOG Entry**
   - Create new `## [X.Y.Z] - YYYY-MM-DD` section
   - Document new skill with category
   - Include activation context and benefits
   - Use appropriate emoji category

2. **Update Documentation** (if applicable)
   - Add skill to relevant documentation
   - Explain auto-activation behavior
   - List applicable agent types

**CHECKPOINT**: Documentation updated ✓

## Success Criteria

Skill creation is complete when:
- ✅ Validated this should be a skill (not an agent)
- ✅ Requirements analyzed and category identified
- ✅ Skill designed with structure and examples
- ✅ Skill directory and SKILL.md file created
- ✅ Frontmatter complete (name, description only)
- ✅ Core concept clearly explained
- ✅ 5+ code examples included
- ✅ Best practices (DO/DON'T) documented
- ✅ Application workflows/scenarios provided
- ✅ When to use guidance included
- ✅ Summary/key takeaways present
- ✅ All validations passed
- ✅ Plugin metadata updated
- ✅ VERSION incremented (MINOR bump)
- ✅ VERSION and plugin.json synchronized
- ✅ CHANGELOG.md updated
- ✅ Skill ready to auto-activate based on context

## Example Usage

### Example 1: Methodology Skill

```bash
/create-skill "Create a skill for Behavior-Driven Development (BDD) methodology that guides writing scenarios in Gherkin format, implementing step definitions, and ensuring collaboration between developers and stakeholders"
```

The workflow will autonomously:
1. Analyze requirements → Confirmed it's a methodology skill, not an agent
2. Design skill → Category: `practices/`, includes:
   - BDD cycle (Feature → Scenario → Step → Implementation)
   - Gherkin syntax examples
   - Step definition patterns
   - Collaboration workflows
3. Implement skill → Create `.claude/skills/practices/behavior-driven-development/SKILL.md` with:
   - Core BDD methodology
   - Gherkin examples
   - DO/DON'T patterns
   - When to use BDD
4. Validate → All sections complete
5. Update metadata → Increment version
6. Document → Add CHANGELOG entry

**Estimated Time**: ~10 minutes

### Example 2: Pattern Library Skill

```bash
/create-skill "Create a skill for microservices architecture patterns including service discovery, circuit breakers, saga patterns, API gateway, and event-driven communication"
```

The workflow will create `.claude/skills/patterns/microservices-patterns/SKILL.md` with:
- Pattern catalog (Circuit Breaker, Saga, API Gateway, Event Sourcing, CQRS)
- When to use each pattern
- Implementation examples
- Pattern combinations
- Anti-patterns to avoid

**Estimated Time**: ~12 minutes

### Example 3: Best Practices Skill

```bash
/create-skill "Create a skill for API security best practices covering authentication strategies, authorization patterns, input validation, rate limiting, and OWASP API Security Top 10"
```

The workflow will create `.claude/skills/domains/api-security/SKILL.md` with:
- Security principles
- Authentication patterns (OAuth2, JWT, API keys)
- Authorization approaches (RBAC, ABAC)
- Input validation techniques
- Rate limiting strategies
- OWASP API Security checklist

**Estimated Time**: ~10 minutes

## Anti-Patterns

### DON'T ❌

- Don't create a skill when you need an agent - use decision matrix
- Don't add model or tools fields - skills don't have these
- Don't make it agent-specific - should benefit multiple agents
- Don't skip code examples - need 5+ examples minimum
- Don't use lowercase for filename - must be SKILL.md
- Don't place in wrong category - choose appropriate directory
- Don't create thin skills - needs substantial content (200+ lines)
- Don't skip activation context - description must clarify when to use
- Don't forget validation - ensure it's truly a skill
- Don't skip metadata update - keep plugin synchronized
- Don't forget CHANGELOG - document all new skills

### DO ✅

- Use skill vs agent decision matrix first
- Keep frontmatter simple (name and description only)
- Make it reusable across multiple agents
- Include rich code examples (5+ examples)
- Use SKILL.md filename (uppercase)
- Place in appropriate skills category
- Create comprehensive content (200-300 lines)
- Define clear activation context
- Validate it should be a skill (not agent)
- Update plugin metadata immediately
- Use semantic versioning (MINOR bump)
- Document thoroughly in CHANGELOG
- Test skill concept with multiple agent scenarios

## Skill vs Agent Decision Guide

| Aspect | Create Skill | Create Agent |
|--------|--------------|--------------|
| Purpose | Methodology/patterns/practices | Autonomous task execution |
| Invocation | Auto-activated by context | Explicitly invoked via Task tool |
| Tools | None (knowledge only) | Specific tools (Read, Write, Bash, etc.) |
| Model | Not specified | Opus 4 or Sonnet 4.5 |
| Scope | Cross-agent expertise | Focused task completion |
| Example | TDD methodology | Python code implementation |

## Skill Categories

- **practices/** - TDD, BDD, pair programming, code review practices
- **patterns/** - Design patterns, architectural patterns, coding patterns
- **languages/** - Python idioms, JavaScript patterns, Go conventions
- **frameworks/** - React patterns, Django best practices, Spring Boot patterns
- **tools/** - Git workflows, Docker patterns, Kubernetes best practices
- **domains/** - Web security, API design, database optimization
- **meta/** - Agent design, workflow orchestration, plugin architecture

## Notes

- **skill-architect** handles all design and implementation
- **plugin-developer** handles all metadata updates
- Version bumps are always MINOR for new skills
- Skills auto-activate based on context (no explicit invocation)
- Skills augment agent capabilities (don't replace them)
- No user intervention needed unless requirements are ambiguous
- All related files must be committed together

**This workflow makes the orchestr8 plugin self-extending with reusable expertise!**
