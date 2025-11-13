---
description: Create multi-phase workflow definitions with JIT resource loading and
  progress tracking
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

# Create Workflow: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Workflow Architect** responsible for designing structured, multi-phase workflows with dynamic resource loading and clear execution strategies.

## Phase 1: Workflow Definition & Analysis (0-25%)

**→ Load:** orchestr8://workflows/workflow-create-workflow

**Activities:**
- Define workflow purpose and scope
- Identify workflow type (development, quality, deployment, research)
- Analyze typical execution phases
- Identify required resources and expertise
- Check for existing workflows to avoid duplication
- Define success criteria
- Determine parallelism opportunities
- Plan dependency flow

**→ Checkpoint:** Workflow scope and phases defined

## Phase 2: Phase Structure Design (25-50%)

**→ Load:** orchestr8://match?query=workflow+phased+delivery+jit+loading&categories=pattern,skill&mode=index&maxResults=5

**Activities:**

**Design Phase Structure:**
- Define 3-6 execution phases
- Assign progress ranges (0-20%, 20-70%, etc.)
- Identify phase activities
- Define phase checkpoints
- Plan JIT resource loading per phase
- Identify parallel tracks within phases
- Map dependencies between phases

**Plan Token Budgets:**
- Phase 1 (Research/Analysis): 800-1200 tokens
- Phase 2 (Design/Planning): 1200-1800 tokens
- Phase 3 (Implementation): 2000-2500 tokens
- Phase 4 (Testing/Validation): 800-1200 tokens
- Total workflow: ~500-600 tokens (workflow structure only)

**Design Metadata:**
- Tags (6-8 workflow-related keywords)
- Capabilities (3-5 workflow outcomes)
- UseWhen scenarios (3-5 specific situations)

**→ Checkpoint:** Phase structure and resource loading strategy defined

## Phase 3: Content Creation (50-80%)

**→ Load:** orchestr8://match?query=$ARGUMENTS+implementation&categories=pattern,skill,example&mode=index&maxResults=8

**Activities:**

**Write Workflow Fragment:**
- Create comprehensive frontmatter
- Write workflow overview with phases summary
- Document each phase with:
  - Phase name and progress range
  - JIT load directives with orchestr8:// URIs
  - Activities list
  - Parallel tracks if applicable
  - Checkpoint criteria
- Document parallelism opportunities
- Define dependencies
- Include success criteria

**Metadata Requirements:**
```yaml
---
id: workflow-name
category: pattern
tags: [workflow, domain, keywords]
capabilities:
  - What workflow accomplishes 1
  - What workflow accomplishes 2
  - What workflow accomplishes 3
useWhen:
  - Specific scenario 1
  - Specific scenario 2
  - Specific scenario 3
estimatedTokens: 500-600
---
```

**Workflow Structure:**
```markdown
# Workflow Name

**Phases:** Phase1 (0-X%) → Phase2 (X-Y%) → Phase3 (Y-100%)

## Phase 1: Name (0-X%)
**→ JIT Load:** orchestr8://match?query=...&mode=index&maxResults=5

**Activities:**
- Activity 1
- Activity 2

**Parallel tracks (if applicable):**
- Track A: Independent work
- Track B: Independent work

**→ Checkpoint:** Completion criteria

## Phase 2-N: [Additional phases]

## Parallelism
- **Independent:** What can run in parallel
- **Dependencies:** What must run sequentially

## Success Criteria
✅ Criterion 1
✅ Criterion 2
```

**JIT Loading Patterns:**
```markdown
# Static URI (specific agent/skill)
orchestr8://agents/typescript-core

# Dynamic URI (query matching)
orchestr8://match?query=testing+validation&mode=index&maxResults=5

# Category filtering
orchestr8://match?query=deployment&categories=guide,skill&mode=index&maxResults=3

# With argument substitution (for commands)
orchestr8://match?query=${technology}+${domain}&mode=index&maxResults=8
```

**→ Checkpoint:** Workflow content complete with JIT loading

## Phase 4: Testing & Integration (80-100%)

**→ Load:** orchestr8://match?query=workflow+testing+discovery&categories=skill&mode=index&maxResults=3

**Activities:**

**Validation:**
- Verify phases have clear activities
- Check checkpoints are measurable
- Validate JIT loading URIs
- Verify token budgets reasonable
- Check parallelism opportunities identified
- Validate dependencies documented

**Discovery Testing:**
- Test queries that should match workflow
- Verify match scores appropriate
- Test with different query variations
- Ensure workflow discoverable for use cases

**Integration:**
- Save to `resources/workflows/`
- Rebuild search index
- Verify workflow is discoverable
- Test loading via MCP
- Create command wrapper if needed

**Command Wrapper (optional):**
```markdown
---
description: Brief description
---

# Workflow Name: $ARGUMENTS

**Request:** $ARGUMENTS

## Your Role
Brief role description

## Phase 1: Name (0-X%)
**→ Load:** orchestr8://workflows/workflow-name

[Additional command-specific content]
```

**→ Checkpoint:** Workflow tested and integrated

## Workflow Quality Checklist

### Definition
- [ ] Clear purpose and scope
- [ ] No duplication with existing workflows
- [ ] Appropriate type (development, quality, etc.)
- [ ] Success criteria defined

### Phase Structure
- [ ] 3-6 well-defined phases
- [ ] Clear progress ranges
- [ ] Phase activities specific
- [ ] Checkpoints measurable
- [ ] Dependencies documented

### JIT Loading
- [ ] Resources loaded per phase
- [ ] Token budgets appropriate
- [ ] URIs correct and loadable
- [ ] Query parameters optimal
- [ ] Category filtering used where needed

### Parallelism
- [ ] Parallel opportunities identified
- [ ] Independent tracks documented
- [ ] Dependencies clear
- [ ] Blocking relationships noted

### Metadata
- [ ] 6-8 relevant tags
- [ ] 3-5 clear capabilities
- [ ] 3-5 specific useWhen scenarios
- [ ] Accurate token count (500-600)

### Content
- [ ] Phases well-organized
- [ ] Activities clear and actionable
- [ ] Checkpoints defined
- [ ] Parallelism documented
- [ ] Success criteria listed

### Discovery
- [ ] Discoverable via relevant queries
- [ ] Match scores appropriate
- [ ] Works with query variations

### Integration
- [ ] Saved to correct location
- [ ] Index rebuilt
- [ ] Loadable via MCP
- [ ] Command wrapper created if needed
- [ ] Documentation updated

## Example Workflow Fragment

```markdown
---
id: workflow-add-feature
category: pattern
tags: [workflow, feature-development, implementation, testing, integration]
capabilities:
  - Complete feature implementation with design and testing
  - Seamless integration into existing codebase
  - Concurrent backend/frontend/test development
useWhen:
  - Adding features to existing codebase
  - Implementing new functionality with tests
  - Integrating features with validation
estimatedTokens: 520
---

# Add Feature Pattern

**Phases:** Design (0-20%) → Implementation (20-70%) → Quality (70-90%) → Deploy (90-100%)

## Phase 1: Analysis & Design (0-20%)
**→ Load:** orchestr8://match?query=requirement+analysis+design&mode=index&maxResults=5

**Activities:**
- Parse requirements, define acceptance criteria
- Analyze affected components
- Design API contracts and data models

**→ Checkpoint:** Design approved

## Phase 2: Implementation (20-70%)
**→ Load:** orchestr8://match?query=implementation+testing&mode=index&maxResults=8

**Parallel tracks:**
- **Backend:** Schema, models, API endpoints
- **Frontend:** Components, state, integration
- **Tests:** Unit, integration tests

**→ Checkpoint:** Feature works, tests pass

## Phase 3-4: [Additional phases]

## Parallelism
- **Independent:** Backend + Frontend + Tests (Phase 2)
- **Dependencies:** Frontend needs backend API
```

## Workflow Types

### Development Workflows
- New project creation
- Feature addition
- Bug fixing
- Refactoring

### Quality Workflows
- Code review
- Security audit
- Performance optimization
- Testing strategies

### Deployment Workflows
- Deployment automation
- CI/CD setup
- Infrastructure provisioning
- Monitoring setup

### Research Workflows
- Technology evaluation
- Pattern discovery
- Solution research
- Knowledge capture

## Success Criteria

✅ Workflow purpose clearly defined
✅ No duplication with existing workflows
✅ 3-6 well-structured phases
✅ Progress ranges assigned
✅ Activities clear and actionable
✅ Checkpoints measurable
✅ JIT loading strategy defined
✅ Token budgets appropriate
✅ Parallelism opportunities identified
✅ Dependencies documented
✅ Complete metadata (tags, capabilities, useWhen)
✅ Token count within guidelines (500-600)
✅ Discoverable via relevant queries
✅ Saved to correct location
✅ Index rebuilt successfully
✅ Loadable via MCP
✅ Command wrapper created if needed
✅ Documentation updated
