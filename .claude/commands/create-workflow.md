---
description: Complete workflow creation lifecycle from requirements to integration with multi-phase design, quality gates, and automated metadata updates
argumentHint: "[workflow-requirements-description]"
---

# Create Workflow Workflow

You are orchestrating the complete creation of a new autonomous workflow (slash command) from requirements analysis to plugin integration.

## Workflow Overview

This workflow uses the `workflow-architect` specialist to design and implement a new workflow following established orchestr8 patterns, then uses `plugin-developer` to update plugin metadata.

## Execution Instructions

### Phase 1: Requirements Analysis (20%)

**Use `workflow-architect` to analyze requirements:**

1. **Extract Workflow Specifications**
   - What end-to-end process does this automate?
   - What are the inputs (arguments)?
   - What are the outputs (deliverables)?
   - What agents are needed?
   - What quality gates are required?

2. **Complexity Assessment**
   - Simple: 3-4 phases, 1-2 agents
   - Moderate: 5-7 phases, 3-5 agents
   - Complex: 8+ phases, 5+ agents, orchestrator needed

3. **Workflow Type Identification**
   - Feature Development (analysis → implement → test → deploy)
   - Bug Fixing (triage → root cause → fix → test → deploy)
   - Audit/Review (scan → review → report → remediate)
   - Deployment (validate → stage → deploy → monitor → rollback)
   - Optimization (profile → strategy → optimize → benchmark)

4. **Research Similar Workflows**
   - Find workflows with similar patterns
   - Identify agent coordination approaches
   - Understand quality gate patterns

**CHECKPOINT**: Requirements clear, workflow type identified ✓

### Phase 2: Workflow Design (30%)

**Use `workflow-architect` to design the workflow:**

1. **Frontmatter Design**
   ```yaml
   ---
   description: [Action verb] [scope] with [capabilities] - [benefits]
   argumentHint: "[argument-format or description]"
   ---
   ```

2. **Phase Breakdown**
   - Determine number of phases (typically 4-8)
   - Assign percentage to each phase (must total 100%)
   - Define phase objectives clearly
   - Examples:
     - Feature: Analysis (20%), Implementation (50%), Quality Gates (20%), Documentation & Deployment (10%)
     - Bug Fix: Triage (15%), Root Cause (20%), Implementation (25%), Testing (25%), Deployment (15%)
     - Audit: Reconnaissance (15%), Automated Scan (30%), Manual Review (25%), Reporting (20%), Remediation (10%)

3. **Agent Coordination Design**
   - Sequential execution (when dependencies exist)
   - Parallel execution (when tasks are independent)
   - Conditional execution (based on workflow specifics)
   - Orchestrator usage (for complex coordination)

4. **Quality Gates Design**
   - Code Review (code-reviewer)
   - Testing (test-engineer)
   - Security (security-auditor)
   - Performance (performance-analyzer) if applicable
   - Accessibility (accessibility-expert) if UI changes
   - **All gates must PASS** - no escape hatches

5. **Success Criteria Definition**
   - 8-12 specific, measurable criteria
   - Cover all aspects: tests, security, deployment, monitoring
   - Use ✅ checkbox format

**CHECKPOINT**: Design complete and validated ✓

### Phase 3: Implementation (35%)

**Use `workflow-architect` to implement the workflow:**

1. **Create Workflow File**
   - Path: `.claude/commands/[workflow-name].md`
   - Kebab-case filename
   - Frontmatter with description and argumentHint

2. **Write Workflow Structure**
   ```markdown
   # Workflow Name

   [Brief introduction]

   ## [Optional] Workflow Overview / Context

   [Background information]

   ## Execution Instructions

   ### Phase 1: [Name] (X%)

   [Detailed steps with agent assignments]

   **CHECKPOINT**: [Validation] ✓

   ### Phase 2: [Name] (Y%)

   [More phases...]

   ## Success Criteria

   [Workflow name] is complete when:
   - ✅ [Criterion 1]
   - ✅ [Criterion 2]
   [... 8-12 total ...]

   ## Example Usage

   ### Example 1: [Use Case]
   ```bash
   /workflow-name "description"
   ```

   [Expected execution steps]
   [Estimated time]

   ## Anti-Patterns

   ### DON'T ❌
   - [Anti-pattern 1]
   - [Anti-pattern 2]

   ### DO ✅
   - [Best practice 1]
   - [Best practice 2]
   ```

3. **Phase Documentation**
   - Each phase has clear objective
   - Specific agent assignments (by name, not generic)
   - Expected outputs listed
   - Validation criteria stated
   - Checkpoint at phase end

4. **Agent Assignment Pattern**
   ```markdown
   **Use `specific-agent-name` to:**
   1. [Subtask 1 with details]
   2. [Subtask 2 with details]
   ```

   Or for conditional:
   ```markdown
   **Backend Features:**
   - Python: `python-developer`
   - TypeScript: `typescript-developer`
   - Java: `java-developer`
   ```

5. **Quality Gates Implementation**
   ```markdown
   ### Phase N: Quality Gates (X%)

   Run all gates in parallel:

   1. **Code Review** - `code-reviewer`:
      - Clean code principles
      - SOLID principles
      - Best practices

   2. **Testing** - `test-engineer`:
      - Coverage >80%
      - All tests passing
      - Edge cases covered

   3. **Security** - `security-auditor`:
      - No vulnerabilities
      - No secrets in code
      - OWASP compliance

   **All gates must PASS before proceeding**

   **CHECKPOINT**: All quality gates passed ✓
   ```

6. **Example Usage**
   - At least 2 real-world examples
   - Show command syntax
   - Describe autonomous execution
   - Include time estimates

7. **Anti-Patterns and Best Practices**
   - DON'T list (what to avoid)
   - DO list (what to follow)

**CHECKPOINT**: Workflow file created with all sections ✓

### Phase 4: Validation (10%)

**Validate workflow implementation:**

1. **Frontmatter Validation**
   - `description` present and descriptive
   - `argumentHint` included if workflow accepts arguments
   - Valid YAML syntax

2. **Phase Validation**
   - Phases add to 100%
   - Each phase has clear objective
   - Agent assignments specific (not generic)
   - Checkpoints mark phase completion with ✓

3. **Quality Gates Validation**
   - All critical gates included
   - Pass/fail conditions explicit
   - No "skip if time permits" language
   - Gates enforce quality standards

4. **Success Criteria Validation**
   - 8-12 specific criteria
   - All measurable and verifiable
   - Cover all workflow aspects
   - No ambiguous statements

5. **Documentation Validation**
   - At least 2 usage examples
   - Anti-patterns documented
   - Best practices included
   - Time estimates provided

6. **File Validation**
   - Markdown syntax correct
   - No spelling errors in critical sections
   - Code blocks properly formatted
   - Links valid (if any)

**CHECKPOINT**: All validations passed ✓

### Phase 5: Plugin Metadata Update (10%)

**Use `plugin-developer` to update metadata:**

1. **Count Workflows**
   ```bash
   find .claude/commands -name "*.md" | wc -l
   ```

2. **Update VERSION**
   - Increment MINOR version (e.g., 1.4.0 → 1.5.0)
   - Update `.claude/VERSION` file

3. **Update plugin.json**
   - Update `version` field
   - Update workflow count in `description`
   - Add workflow name if major feature

4. **Verify Synchronization**
   - VERSION matches plugin.json version
   - Component counts accurate
   - JSON is valid

**CHECKPOINT**: Plugin metadata updated and synchronized ✓

### Phase 6: Documentation (5%)

**Use `plugin-developer` to update CHANGELOG:**

1. **Add CHANGELOG Entry**
   - Create new `## [X.Y.Z] - YYYY-MM-DD` section
   - Document new workflow with use cases
   - Include capabilities and benefits
   - Use appropriate emoji category

2. **Update README** (if applicable)
   - Add workflow to usage guide
   - Update capability descriptions
   - Add example invocations

**CHECKPOINT**: Documentation updated ✓

## Success Criteria

Workflow creation is complete when:
- ✅ Requirements analyzed and workflow type identified
- ✅ Workflow designed with phases, agents, and quality gates
- ✅ Workflow file created in .claude/commands/
- ✅ Frontmatter complete and valid
- ✅ All phases documented with checkpoints
- ✅ Agent assignments specific and appropriate
- ✅ Quality gates included and mandatory
- ✅ Success criteria defined (8-12 items)
- ✅ Example usage provided (2+ examples)
- ✅ Anti-patterns and best practices documented
- ✅ All validations passed
- ✅ Plugin metadata updated
- ✅ VERSION incremented (MINOR bump)
- ✅ VERSION and plugin.json synchronized
- ✅ CHANGELOG.md updated
- ✅ Workflow ready for use via /workflow-name

## Example Usage

### Example 1: Database Migration Workflow

```bash
/create-workflow "Create a workflow for database migration management that handles schema changes, data migration, rollback procedures, and zero-downtime deployments with validation at each step"
```

The workflow will autonomously:
1. Analyze requirements → Database migration workflow
2. Design workflow → 6 phases:
   - Schema Design & Validation (15%)
   - Migration Script Generation (20%)
   - Testing on Staging (25%)
   - Production Migration (25%)
   - Verification & Monitoring (10%)
   - Rollback Preparation (5%)
3. Implement workflow → Create `/migrate-database` command with:
   - Agent assignments (database-specialist, backend-developer)
   - Quality gates (testing, security, data integrity)
   - Rollback procedures
   - Example usage scenarios
4. Validate → All sections complete
5. Update metadata → Increment version
6. Document → Add CHANGELOG entry

**Estimated Time**: ~12 minutes

### Example 2: API Versioning Workflow

```bash
/create-workflow "Create a workflow for API versioning that manages backward compatibility, deprecation notices, migration guides, and ensures smooth transitions for API consumers"
```

The workflow will create `/version-api` command with:
- Phases for compatibility analysis, version implementation, documentation, migration support
- Quality gates for API contracts, backward compatibility testing
- Success criteria for zero breaking changes

**Estimated Time**: ~10 minutes

### Example 3: Load Testing Workflow

```bash
/create-workflow "Create a comprehensive load testing workflow that profiles baseline performance, designs test scenarios, executes load tests, analyzes bottlenecks, and generates performance reports"
```

The workflow will create `/load-test` command using load-testing-specialist with phases for profiling, test execution, analysis, and optimization recommendations.

**Estimated Time**: ~10 minutes

## Anti-Patterns

### DON'T ❌

- Don't skip requirements analysis - understand the process first
- Don't create ambiguous phases - each needs clear objective
- Don't use generic agent references - specify exact agent names
- Don't skip quality gates - they're mandatory
- Don't allow gate skipping - no "if time permits" language
- Don't forget checkpoints - mark phase boundaries with ✓
- Don't use vague success criteria - must be measurable
- Don't skip examples - workflows need usage documentation
- Don't forget anti-patterns - show what NOT to do
- Don't skip metadata update - keep plugin.json synchronized
- Don't forget CHANGELOG - document all new workflows
- Don't create partial workflows - all sections required

### DO ✅

- Research similar workflows for patterns
- Design phases that add to 100%
- Assign specific agents by name
- Include all critical quality gates
- Make gates mandatory (no escape hatches)
- Use checkpoints at phase boundaries
- Define 8-12 specific success criteria
- Provide 2+ real usage examples
- Document anti-patterns and best practices
- Update plugin metadata immediately
- Use semantic versioning (MINOR bump)
- Commit all related files together
- Test workflow invocation after creation

## Workflow Type Patterns

**Feature Development:**
- Analysis & Design (20%) → Implementation (50%) → Quality Gates (20%) → Documentation & Deployment (10%)

**Bug Fixing:**
- Triage & Reproduction (15%) → Root Cause Analysis (20%) → Implementation (25%) → Testing (25%) → Deployment (15%)

**Audit/Review:**
- Reconnaissance (15%) → Automated Scanning (30%) → Manual Review (25%) → Reporting (20%) → Remediation (10%)

**Deployment:**
- Pre-Deployment Validation (20%) → Staging (15%) → Production (30%) → Post-Deployment (20%) → Monitoring (15%)

**Optimization:**
- Profiling & Baseline (20%) → Strategy (15%) → Implementation (40%) → Benchmarking (15%) → Documentation (10%)

## Notes

- **workflow-architect** handles all design and implementation
- **plugin-developer** handles all metadata updates
- Version bumps are always MINOR for new workflows
- All related files must be committed together
- Workflow is immediately usable via `/workflow-name` after creation
- No user intervention needed unless requirements are ambiguous
- Workflows enforce quality gates - no shortcuts allowed

**This workflow makes the orchestr8 plugin self-extending!**
