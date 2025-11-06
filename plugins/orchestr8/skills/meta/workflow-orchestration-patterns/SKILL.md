---
name: workflow-orchestration-patterns
description: Expertise in autonomous workflow design patterns including multi-phase execution, quality gates, agent coordination, and success criteria definition. Activate when designing or creating workflow slash commands. Guides multi-phase workflow design with checkpoints and quality gates, ensuring workflows are autonomous, reliable, and production-ready.
---

# Workflow Orchestration Patterns Skill

Expert knowledge of workflow orchestration patterns for Claude Code, covering multi-phase execution design, quality gate implementation, agent coordination strategies, and autonomous process automation.

## When to Use This Skill

**Use workflow-orchestration-patterns for:**
- ✅ Creating new workflow slash commands for Claude Code
- ✅ Designing multi-phase execution strategies with checkpoints
- ✅ Implementing quality gates and validation logic in workflows
- ✅ Coordinating multiple agents in complex autonomous processes
- ✅ Defining success criteria and progress tracking for workflows
- ✅ Adding parallelism instructions for performance optimization

**Less critical for:**
- ❌ Creating simple single-agent tasks (use agent definitions instead)
- ❌ Agent or skill creation (use those specific skills)
- ❌ Direct agent invocation without orchestration

## Core Workflow Architecture

### Frontmatter Structure

All workflows require YAML frontmatter:

```yaml
---
description: [Action verb] [scope] with [capabilities] - [benefits]
argumentHint: "[optional: argument format or description]"
---
```

**Examples:**

```yaml
description: Add a complete feature with full lifecycle - analysis, implementation, testing, review, deployment
argumentHint: "[feature-description]"
```

```yaml
description: Comprehensive security audit with OWASP Top 10, vulnerability scanning, secrets detection, and automated remediation
argumentHint: "[scope: full|quick|component]"
```

```yaml
description: Autonomous production deployment with staging validation, blue-green deployment, monitoring, and automatic rollback
argumentHint: "[environment] [strategy: blue-green|rolling|canary]"
```

## Multi-Phase Execution Pattern

### Phase Structure Template

```markdown
## Execution Instructions

### Phase 1: [Specific Task Name] (X%)

[Brief introduction to this phase]

**Use `specific-agent-name` to:**
1. [Subtask 1 with details]
2. [Subtask 2 with details]

**Expected Outputs:**
- Output 1
- Output 2

**Validation:**
- Check 1
- Check 2

**CHECKPOINT**: [Specific validation criteria] ✓

### Phase 2: [Next Task] (Y%)

[Continue pattern...]
```

### Phase Percentage Patterns

| Workflow Type | Typical Distribution |
|---------------|---------------------|
| Feature Development | Analysis & Design (20%), Implementation (50%), Quality Gates (20%), Documentation & Deployment (10%) |
| Bug Fixing | Triage & Reproduction (15%), Root Cause Analysis (20%), Implementation (25%), Testing (25%), Deployment (15%) |
| Deployment | Pre-Deployment (20%), Staging (15%), Production (30%), Post-Deployment (20%), Monitoring (15%) |
| Security Audit | Reconnaissance (15%), Automated Scanning (30%), Manual Review (25%), Compliance (15%), Remediation (15%) |
| Performance Optimization | Profiling (20%), Strategy (15%), Optimizations (40%), Benchmarking (15%), Documentation (10%) |
| Code Review | Scope Detection (5%), Multi-Stage Review (80%), Report Generation (10%), Iteration (5%) |

**Rule: Phase percentages must add to 100%**

## Quality Gate Patterns

### Pattern 1: Parallel Quality Gates

```markdown
### Phase N: Quality Gates (20%)

Run all gates in parallel:

1. **Code Review** - `code-reviewer`:
   - Clean code principles
   - SOLID principles
   - No code smells
   - Best practices followed

2. **Testing** - `test-engineer`:
   - Test coverage >80%
   - All tests passing
   - Edge cases covered
   - Regression tests added

3. **Security** - `security-auditor`:
   - No vulnerabilities
   - No secrets in code
   - Input validation present
   - OWASP compliance

4. **Performance** - `performance-analyzer` (if applicable):
   - Response times acceptable
   - No N+1 queries
   - Bundle size reasonable

5. **Accessibility** - `accessibility-expert` (if UI changes):
   - WCAG 2.1 AA compliance
   - Keyboard navigation
   - Screen reader compatible

**All gates must PASS before proceeding**

**CHECKPOINT**: All quality gates passed ✓
```

### Pattern 2: Sequential Quality Gates

```markdown
### Phase 3: Code Review (15%)

**Use `code-reviewer` to review all changes:**
- Clean code principles
- Best practices
- No code smells

**CHECKPOINT**: Code review passed ✓

### Phase 4: Testing Validation (15%)

**Use `test-engineer` to validate tests:**
- Coverage >80%
- All tests passing

**CHECKPOINT**: Tests passed ✓

### Phase 5: Security Audit (10%)

**Use `security-auditor` to check security:**
- No vulnerabilities
- No secrets

**CHECKPOINT**: Security validated ✓
```

### Pattern 3: Conditional Quality Gates

```markdown
### Phase 4: Quality Gates (20%)

**REQUIRED GATES** (all workflows):
1. Code Review - `code-reviewer`
2. Testing - `test-engineer`
3. Security - `security-auditor`

**CONDITIONAL GATES** (based on changes):

If UI changes:
4. Accessibility - `accessibility-expert`

If performance-critical:
5. Performance - `performance-analyzer`

If database changes:
6. Database Review - `database-specialist`

**All applicable gates must PASS**

**CHECKPOINT**: All quality gates passed ✓
```

## Agent Coordination Patterns

### Pattern 1: Sequential Dependencies

```markdown
### Phase 1: Analysis (20%)

Use `requirements-analyzer` to extract requirements.

**CHECKPOINT**: Requirements documented ✓

### Phase 2: Design (25%)

Use `architect` with results from Phase 1 to design solution.

**CHECKPOINT**: Design approved ✓

### Phase 3: Implementation (35%)

Use `backend-developer` with design from Phase 2.

**CHECKPOINT**: Implementation complete ✓
```

### Pattern 2: Parallel Independent

```markdown
### Phase 2: Implementation (50%)

Execute in parallel:

**Backend Track:**
Use `backend-developer` for:
- API implementation
- Business logic
- Database integration

**Frontend Track:**
Use `frontend-developer` for:
- UI components
- Client-side logic
- API integration

**Documentation Track:**
Use `technical-writer` for:
- README updates
- API documentation

Wait for all tracks to complete before proceeding.

**CHECKPOINT**: All tracks complete ✓
```

### Pattern 3: Conditional Agent Selection

```markdown
### Phase 2: Implementation (50%)

**Agent Selection based on stack:**

#### For Backend-Only Features
Use `backend-developer` or language specialist:
- Python: `python-developer`
- TypeScript/Node.js: `typescript-developer`
- Java: `java-developer`
- Go: `go-developer`

#### For Frontend-Only Features
Use `frontend-developer` or framework specialist:
- React/Next.js: `react-specialist`
- Vue: `vue-specialist`
- Angular: `angular-specialist`

#### For Full-Stack Features
Use `fullstack-developer` to coordinate both layers.

**CHECKPOINT**: Implementation complete ✓
```

### Pattern 4: Orchestrator Delegation

```markdown
## Workflow Overview

Use the `feature-orchestrator` agent to coordinate this entire workflow.

The feature orchestrator will:
1. Analyze requirements
2. Design solution architecture
3. Coordinate specialized agents (backend, frontend, database)
4. Enforce all quality gates
5. Handle deployment
6. Generate documentation

## Execution Instructions

### Phase 1: Delegate to Feature Orchestrator (100%)

Provide the feature orchestrator with:
- Feature description
- Acceptance criteria
- Technical constraints
- Quality requirements

The orchestrator will autonomously:
- Break down into tasks
- Assign to appropriate agents
- Manage dependencies
- Validate at each gate
- Deliver production-ready feature

**CHECKPOINT**: Feature complete and deployed ✓
```

## Success Criteria Pattern

### Template Structure

```markdown
## Success Criteria

[Workflow name] is complete when:
- ✅ [Input criterion]
- ✅ [Process criterion]
- ✅ [Quality criterion]
- ✅ [Testing criterion]
- ✅ [Security criterion]
- ✅ [Documentation criterion]
- ✅ [Deployment criterion]
- ✅ [Monitoring criterion]
- ✅ [User validation criterion]
```

### Examples by Workflow Type

**Feature Development:**
```markdown
- ✅ Acceptance criteria met
- ✅ All tests passing (>80% coverage)
- ✅ All quality gates passed
- ✅ Code reviewed and approved
- ✅ Documentation updated
- ✅ Deployed successfully
- ✅ Monitoring shows no errors
- ✅ User accepts feature
```

**Bug Fix:**
```markdown
- ✅ Bug reproduced with failing test
- ✅ Root cause identified and documented
- ✅ Fix implemented (root cause, not symptom)
- ✅ Regression test passes
- ✅ All existing tests pass
- ✅ All quality gates passed
- ✅ Deployed to production
- ✅ Verified in production
- ✅ No new issues introduced
```

**Deployment:**
```markdown
- ✅ All pre-deployment validations passed
- ✅ Staging deployment successful
- ✅ Production deployment completed
- ✅ Zero downtime achieved
- ✅ All health checks passing
- ✅ Error rates within SLA
- ✅ Response times meet requirements
- ✅ Monitoring and alerting configured
- ✅ Rollback plan tested and ready
```

## Checkpoint Pattern

### Checkpoint Usage

```markdown
**CHECKPOINT**: [Specific, measurable validation] ✓

Examples:
**CHECKPOINT**: All tests passing ✓
**CHECKPOINT**: Security scan clean ✓
**CHECKPOINT**: Design approved by user ✓
**CHECKPOINT**: Deployed to staging ✓
**CHECKPOINT**: Performance baseline met ✓
```

**Rules:**
- One checkpoint per phase minimum
- Use ✓ symbol consistently
- Make validation criteria specific
- Ensure checkpoints are measurable

## Example Usage Pattern

### Template

```markdown
## Example Usage

### Example 1: [Specific Scenario]

```bash
/workflow-name "detailed description of task"
```

The workflow will autonomously:
1. [Step 1] - ~X minutes
2. [Step 2] - ~Y minutes
3. [Step 3] - ~Z minutes
4. [Final deliverable]

**Estimated Time**: [total time range]

### Example 2: [Different Scenario]

```bash
/workflow-name "[different task]"
```

[Different autonomous execution steps]

**Estimated Time**: [time range]
```

## Anti-Patterns and Best Practices

### Workflow DO/DON'T Pattern

```markdown
## Anti-Patterns

### DON'T ❌

- Don't skip quality gates to "move faster"
- Don't start coding without design
- Don't merge without tests
- Don't ignore security review
- Don't forget documentation
- Don't deploy without staging validation

### DO ✅

- Plan thoroughly before executing
- Use appropriate orchestrators/agents
- Execute agents in parallel when possible
- Validate at each quality gate
- Write comprehensive tests
- Document decisions and changes
- Follow security best practices
- Ensure accessibility
- Handle errors gracefully
```

## Best Practices

### DO ✅

**Workflow Design:**
- Design phases that add to 100%
- Include all critical quality gates
- Use checkpoints at phase boundaries
- Assign specific agents by name (not generic)
- Support parallelization explicitly
- Define 8-12 specific success criteria
- Provide 2+ usage examples with time estimates
- Document anti-patterns and best practices

**Quality Gates:**
- Make all critical gates mandatory
- Run independent gates in parallel
- Use explicit "All gates must PASS" language
- No "skip if time permits" escape hatches
- Include severity classification where applicable

**Agent Coordination:**
- Use specific agent names, not "use an agent"
- Declare parallel execution explicitly
- Handle sequential dependencies correctly
- Use orchestrators for complex coordination
- Provide context and expected outputs

### DON'T ❌

**Workflow Design:**
- Don't create ambiguous phase objectives
- Don't allow quality gate skipping
- Don't forget checkpoints at phase ends
- Don't use generic "use an agent" language
- Don't ignore parallelization opportunities
- Don't use vague success criteria
- Don't skip usage examples
- Don't forget time estimates

**Quality Gates:**
- Don't make gates optional
- Don't allow "if time permits" language
- Don't skip critical gates (code review, testing, security)
- Don't create escape hatches
- Don't ignore accessibility for UI changes

## Workflow File Structure

```markdown
---
description: [One-line description]
argumentHint: "[Optional argument format]"
---

# Workflow Name

[Brief introduction paragraph]

## [Optional] Workflow Overview / Context / Strategies

[Background information, options, or context]

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
[Example and execution description]

### Example 2: [Different Use Case]
[Another example]

## Anti-Patterns

### DON'T ❌
[Anti-patterns]

### DO ✅
[Best practices]

## [Optional] Notes / Special Considerations

[Additional guidance]
```

## Common Pitfalls

1. **Ambiguous Phases** - Each phase needs a clear, specific objective
2. **Missing Quality Gates** - Every workflow needs validation stages
3. **Generic Agent References** - Always specify exact agent names
4. **Skippable Gates** - Quality gates must be mandatory
5. **No Checkpoints** - Mark phase boundaries explicitly
6. **Vague Success Criteria** - Must be specific and measurable
7. **Missing Examples** - Workflows need usage documentation
8. **No Parallelization** - Identify and declare parallel opportunities

## Remember

1. **Phase Design**: Must add to 100%, clear objectives, checkpoints
2. **Quality Gates**: All critical gates mandatory, no escape hatches
3. **Agent Coordination**: Specific names, parallel when possible
4. **Success Criteria**: 8-12 specific, measurable criteria
5. **Examples**: 2+ usage scenarios with time estimates
6. **Anti-Patterns**: Document what NOT to do
7. **Validation**: Checkpoints at every phase boundary

Well-designed workflows enable fully autonomous end-to-end process execution with quality assurance at every stage, transforming complex multi-step tasks into reliable, repeatable slash commands.
