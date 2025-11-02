---
description: Complete agent creation lifecycle from requirements to integration with automated validation and plugin metadata updates
argumentHint: "[agent-requirements-description]"
---

# Create Agent Workflow

You are orchestrating the complete creation of a new Claude Code agent from requirements analysis to plugin integration.

## Workflow Overview

This workflow uses the `agent-architect` specialist to design and implement a new agent following established orchestr8 patterns, then uses `plugin-developer` to update plugin metadata.

## Execution Instructions

### Phase 1: Requirements Analysis (20%)

**Use `agent-architect` to analyze requirements:**

1. **Extract Agent Specifications**
   - Domain and specialty identification
   - Use case analysis
   - Tool requirements
   - Model selection (Opus vs Sonnet)

2. **Category Determination**
   - Language specialist → `development/languages/`
   - Framework specialist → `development/frontend/`, `development/api/`, etc.
   - Quality assurance → `quality/`
   - Infrastructure → `infrastructure/databases/`, `infrastructure/messaging/`, etc.
   - DevOps → `devops/cloud/`, `devops/infrastructure/`
   - Compliance → `compliance/`
   - Meta-system → `meta/`

3. **Research Similar Agents**
   - Find agents in the same category
   - Identify patterns to follow
   - Ensure no duplicates exist

**CHECKPOINT**: Requirements clear, category identified, no duplicates ✓

### Phase 2: Agent Design (25%)

**Use `agent-architect` to design the agent:**

1. **Frontmatter Design**
   - Name (kebab-case)
   - Description (expert role + use cases)
   - Model selection
   - Tool list (appropriate for agent type)

2. **Documentation Structure**
   - Core Competencies section
   - Implementation examples (5+)
   - Best practices (DO/DON'T)
   - Testing patterns
   - Closing deliverables statement

3. **Tool Selection Strategy**
   - **Technical Specialists**: Read, Write, Edit, Bash, Glob, Grep
   - **Quality/Review**: Read, Glob, Grep, Bash (NO Write/Edit)
   - **Orchestrators**: Task, Read, Write, Bash, Glob, Grep, TodoWrite
   - **Compliance**: Read, Write, Edit, Bash, Glob, Grep, Task

4. **Model Selection**
   - **Opus 4**: Meta-orchestrators only
   - **Sonnet 4.5**: All specialized agents

**CHECKPOINT**: Design complete and validated ✓

### Phase 3: Implementation (35%)

**Use `agent-architect` to implement the agent:**

1. **Create Agent File**
   - Path: `.claude/agents/[category]/[subcategory]/[agent-name].md`
   - Frontmatter with all required fields
   - Title and introduction

2. **Write Core Content**
   - Core Competencies (bullet lists)
   - Development Standards (for technical agents)
   - Implementation Examples (5-10 detailed examples)
   - Testing Patterns
   - Best Practices (DO/DON'T with explanations)

3. **Add Code Examples**
   - Real-world, practical examples
   - 50-200 lines per example
   - Well-commented code
   - Multiple scenarios

4. **Write Closing Statement**
   - "Your deliverables should be [quality attributes]..."

**CHECKPOINT**: Agent file created, 300-500 lines for specialists ✓

### Phase 4: Validation (10%)

**Validate agent implementation:**

1. **Frontmatter Validation**
   - All required fields present (name, description, model, tools)
   - Name matches filename
   - Description follows pattern
   - Model appropriate
   - Tools correctly selected

2. **Content Quality Validation**
   - Core Competencies section present
   - 5+ implementation examples (for technical agents)
   - DO/DON'T best practices included
   - Appropriate detail level (300-500 lines)
   - Closing statement present

3. **File Placement Validation**
   - Correct category directory
   - Kebab-case filename
   - No naming conflicts

4. **Integration Validation**
   - Verify agent file is readable
   - Check no syntax errors
   - Validate YAML frontmatter

**CHECKPOINT**: All validations passed ✓

### Phase 5: Plugin Metadata Update (10%)

**Use `plugin-developer` to update metadata:**

1. **Count Agents**
   ```bash
   find .claude/agents -name "*.md" -type f | wc -l
   ```

2. **Update VERSION**
   - Increment MINOR version (e.g., 1.4.0 → 1.5.0)
   - Update `.claude/VERSION` file

3. **Update plugin.json**
   - Update `version` field
   - Update agent count in `description`
   - Add relevant `keywords` if new domain

4. **Verify Synchronization**
   - VERSION matches plugin.json version
   - Component counts accurate
   - JSON is valid

**CHECKPOINT**: Plugin metadata updated and synchronized ✓

### Phase 6: Documentation (10%)

**Use `plugin-developer` to update CHANGELOG:**

1. **Add CHANGELOG Entry**
   - Create new `## [X.Y.Z] - YYYY-MM-DD` section
   - Document new agent with category
   - Include capabilities and use cases
   - Use appropriate emoji category

2. **Update README** (if applicable)
   - Add agent to relevant lists
   - Update capability descriptions
   - Add usage examples if major agent

**CHECKPOINT**: Documentation updated ✓

## Success Criteria

Agent creation is complete when:
- ✅ Requirements analyzed and validated
- ✅ Agent designed following established patterns
- ✅ Agent file created in correct location
- ✅ Frontmatter complete and valid
- ✅ Documentation comprehensive (300-500 lines)
- ✅ 5+ code examples included (for technical agents)
- ✅ Best practices (DO/DON'T) documented
- ✅ All validations passed
- ✅ Plugin metadata updated
- ✅ VERSION incremented (MINOR bump)
- ✅ VERSION and plugin.json synchronized
- ✅ CHANGELOG.md updated
- ✅ Agent ready for git commit

## Example Usage

### Example 1: Language Specialist

```bash
/create-agent "Create a Svelte framework specialist that can build Svelte applications with SvelteKit, focusing on reactive programming patterns, component design, and state management"
```

The workflow will autonomously:
1. Analyze requirements → Determine it's a frontend framework specialist
2. Design agent → Category: `development/frontend/`, Model: Sonnet 4.5, Tools: Read/Write/Edit/Bash/Glob/Grep
3. Implement agent → Create `svelte-specialist.md` with 400+ lines including:
   - Svelte component examples
   - SvelteKit routing patterns
   - Reactive state management
   - Testing with Vitest
   - Best practices
4. Validate → Check all requirements met
5. Update metadata → Increment version, update counts
6. Document → Add CHANGELOG entry

**Estimated Time**: ~10 minutes

### Example 2: Infrastructure Specialist

```bash
/create-agent "Create a HashiCorp Vault specialist for secrets management, dynamic credentials, encryption as a service, and security automation"
```

The workflow will create an infrastructure specialist in `infrastructure/security/vault-specialist.md` with:
- Vault architecture and deployment
- Secrets engine configuration
- Dynamic credential generation
- Encryption patterns
- Security best practices

**Estimated Time**: ~12 minutes

### Example 3: Quality Agent

```bash
/create-agent "Create an accessibility auditor that checks WCAG 2.1 compliance, reviews semantic HTML, validates ARIA labels, and ensures keyboard navigation support"
```

The workflow will create a quality agent in `quality/accessibility-auditor.md` with:
- WCAG 2.1 compliance checklist
- Accessibility review process
- Common issues and fixes
- Testing tools and techniques
- NO Write/Edit tools (review-only)

**Estimated Time**: ~10 minutes

## Anti-Patterns

### DON'T ❌

- Don't skip requirements analysis - understand the domain first
- Don't place in wrong category - research existing structure
- Don't use wrong model - Sonnet for specialists, Opus only for orchestrators
- Don't give review agents Write tools - they should only read and review
- Don't skip code examples - technical agents need 5+ examples
- Don't forget validation - frontmatter and content must be correct
- Don't skip metadata update - keep plugin.json synchronized
- Don't forget CHANGELOG - document all new agents
- Don't create duplicates - search for similar agents first
- Don't use underscores - always kebab-case

### DO ✅

- Research similar agents in the same category first
- Follow established patterns from existing agents
- Use appropriate tools for agent type
- Include rich code examples (5-10 for technical agents)
- Validate frontmatter and content quality
- Update plugin metadata immediately
- Document in CHANGELOG with details
- Use semantic versioning (MINOR bump for new agents)
- Test that agent file is valid and loadable
- Commit all related files together

## Agent Selection Guide

**Backend/API Agents:**
- Category: `development/languages/` or `development/api/`
- Model: Sonnet 4.5
- Tools: Read, Write, Edit, Bash, Glob, Grep
- Examples: Language patterns, API design, testing

**Frontend Agents:**
- Category: `development/frontend/`
- Model: Sonnet 4.5
- Tools: Read, Write, Edit, Bash, Glob, Grep
- Examples: Components, state, testing, accessibility

**Infrastructure Agents:**
- Category: `infrastructure/[subcategory]/`
- Model: Sonnet 4.5
- Tools: Read, Write, Edit, Bash, Glob, Grep
- Examples: Configuration, deployment, optimization

**Quality/Review Agents:**
- Category: `quality/`
- Model: Sonnet 4.5
- Tools: Read, Glob, Grep, Bash (NO Write/Edit)
- Content: Checklists, severity classification, review process

**Compliance Agents:**
- Category: `compliance/`
- Model: Sonnet 4.5
- Tools: Read, Write, Edit, Bash, Glob, Grep, Task
- Content: Regulations, compliance checks, remediation

## Notes

- **agent-architect** handles all design and implementation
- **plugin-developer** handles all metadata updates
- Version bumps are always MINOR for new agents
- All related files must be committed together
- Agent is immediately usable after creation via Task tool
- No user intervention needed unless requirements are ambiguous

**This workflow makes the orchestr8 plugin self-extending!**
