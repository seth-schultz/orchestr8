# Orchestr8 Research/Sandbox Environment Analysis
## Adopting Simon's Dedicated Research Repository Pattern

**Analysis Date**: November 6, 2025
**Scope**: Current workspace/environment handling, agent file system interactions, security boundaries, and opportunities for isolated research repositories

---

## Executive Summary

orchestr8 is an enterprise-grade multi-agent orchestration system with **74+ specialized agents** organized by domain expertise. Currently, orchestr8 uses a **file-based architecture** with agents as markdown files stored in `/agents/` directory, but **lacks dedicated isolation mechanisms** for research/experimental work.

**Key Findings**:
1. ✅ **Architecture**: Clean, modular, file-based system with excellent separation of concerns
2. ⚠️  **Environment Handling**: No explicit workspace isolation or sandboxing mechanisms
3. ⚠️  **File System Access**: All agents and workflows operate in the same project context
4. ⚠️  **Security Boundaries**: Implicit through agent definitions but no hard isolation
5. ✅ **Opportunity**: Adopt "dedicated research repo" pattern for experimental workflows

---

## Part 1: Current Architecture Analysis

### 1.1 System Architecture Overview

```
Claude Code Session
    ↓
Orchestr8 Plugin
    ├─ Meta-Orchestrators (Layer 1) - coordinate entire workflows
    ├─ Specialized Agents (Layer 2) - 74+ agents in /agents/ directory
    ├─ Skills (Layer 3) - auto-activated expertise in /skills/
    └─ Workflows (Layer 4) - slash commands in /commands/
```

**File-Based Agent System:**
- Each agent is a `.md` file with YAML frontmatter
- Frontmatter specifies: name, description, model, capabilities, tools
- Agents stored in `/agents/[category]/[agent].md`
- Direct filesystem operations: read agent files, parse YAML, invoke via Task tool
- No persistent state, no infrastructure, no databases

### 1.2 Agent Organization Structure

```
orchestr8/
├── agents/
│   ├── orchestration/
│   │   ├── project-orchestrator.md     # Coordinates end-to-end projects
│   │   └── feature-orchestrator.md     # Coordinates feature development
│   ├── development/
│   │   ├── architect.md                # System design (Haiku 4.5)
│   │   ├── fullstack-developer.md      # Full-stack features
│   │   ├── backend-developer.md
│   │   ├── frontend-developer.md
│   │   └── ...
│   ├── quality/
│   │   ├── code-reviewer.md
│   │   ├── security-auditor.md
│   │   ├── test-engineer.md
│   │   └── ...
│   ├── languages/               # 15+ language specialists
│   ├── databases/               # 9 database specialists
│   ├── devops/                  # Cloud & infrastructure
│   └── ... (14+ other categories)
├── commands/                    # 20 workflow slash commands
│   ├── new-project.md
│   ├── add-feature.md
│   ├── fix-bug.md
│   └── ...
└── skills/                      # Auto-activated expertise
    ├── languages/
    ├── frameworks/
    ├── tools/
    └── practices/
```

**Key Agent Specifications:**

| Agent | Model | Purpose |
|-------|-------|---------|
| project-orchestrator | claude-sonnet-4-5 | End-to-end project coordination |
| feature-orchestrator | claude-haiku-4-5 | Feature development lifecycle |
| architect | claude-haiku-4-5 | System design & architecture |
| security-auditor | claude-sonnet-4-5 | Security & compliance |
| code-reviewer | claude-sonnet-4-5 | Code quality validation |

---

## Part 2: Current Environment/Workspace Handling

### 2.1 How Orchestr8 Currently Manages Context

**Context Management Strategy** (from ARCHITECTURE.md):

```
Main Agent (Orchestrator)
    Context: 50k tokens (high-level plan, progress, results)

    ├─→ Subagent A (forked context via Task tool)
    │   Context: 20k tokens (specific task details)
    │
    └─→ Subagent B (forked context via Task tool)
        Context: 15k tokens (specific task details)
```

**Key Principles:**
1. **Context Isolation**: Each agent maintains independent context via Task tool
2. **No Context Pollution**: Agents released after task completion
3. **Memory Efficiency**: Only active agents loaded into context window
4. **File-Based Storage**: Results stored in project files, not context

### 2.2 How Agents Interact with the File System

**Current Agent Tool Access** (from agent definitions):

```yaml
---
name: architect
description: System design and architecture decisions
model: claude-haiku-4-5
---

# ⚠️ NOTE: Agents do NOT specify tools in YAML frontmatter
# Tools inherited from Claude Code environment
```

**Standard Claude Code Tools Available to Agents:**
- `Read` - Read files from project
- `Write` - Write/create files in project
- `Bash` - Execute commands
- `Grep` - Search code content
- `Glob` - Find files by pattern

**File System Scope:**
- ✅ All agents can read/write **anywhere in project**
- ✅ All agents can execute bash commands
- ❌ **No isolation** between experiment and production code
- ❌ **No sandboxing** mechanism for risky operations

### 2.3 Workflow Execution Pattern

**add-feature workflow shows current approach:**

```markdown
## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate this entire workflow to the feature-orchestrator 
agent using the Task tool.
```

**Current Delegation Pattern:**
1. Workflow command invoked (e.g., `/orchestr8:add-feature`)
2. Delegated to feature-orchestrator via Task tool
3. Feature-orchestrator coordinates specialized agents
4. All agents operate on same codebase in same context
5. No isolation between experimental and production work

### 2.4 Example: Feature Implementation Flow

**From feature-orchestrator.md:**

```
Phase 1: Analysis & Design (20%)
    └─→ Select requirements-analyzer agent
        └─→ Analyze requirements
        └─→ Return design document

Phase 2: Implementation (50%)
    ├─→ database-specialist (if schema changes)
    ├─→ backend-developer (if API changes)
    └─→ frontend-developer (if UI changes)

Phase 3: Testing (20%)
    └─→ test-engineer
        └─→ Run comprehensive tests
        └─→ Validate coverage >80%

Phase 4: Quality Gates (5%)
    ├─→ code-reviewer
    ├─→ security-auditor
    ├─→ performance-analyzer
    └─→ accessibility-expert
```

**Problem Identified**: All phases operate on **same project files** with **no experimental isolation**

---

## Part 3: Security Boundaries & Permission Model

### 3.1 Current Security Model

**Implicit Security Through:**
1. **Agent Specialization**: Each agent has specific role/expertise
2. **Clear Instructions**: Agent definitions specify appropriate use cases
3. **Quality Gates**: Security-auditor agent reviews for vulnerabilities
4. **OWASP Compliance**: Security agent checks OWASP Top 10

**Example from security-auditor.md:**

```markdown
## Security Audit Checklist

### OWASP Top 10 (2025)

#### A01:2025 - Broken Access Control
- [ ] Authentication required for protected resources
- [ ] Authorization checked for every action
- [ ] No insecure direct object references (IDOR)

#### A03:2025 - Injection
- [ ] All inputs validated and sanitized
- [ ] Parameterized queries used (no string concatenation)
```

### 3.2 Limitations of Current Model

**❌ Hard Boundaries Missing:**
- No filesystem sandboxing
- No environment variable isolation
- No database/service isolation
- All agents can read/write all project files
- All agents can execute arbitrary bash commands

**⚠️  Risk Scenarios:**
1. **Experimental code pollution**: Unfinished research code committed alongside production
2. **Accidental deletion**: Agent could delete important files during experimentation
3. **Breaking changes**: Experimental architecture changes affect production code
4. **Dependency conflicts**: Research dependencies conflict with production requirements
5. **Data exposure**: Sensitive data accessed during experimentation

### 3.3 Current Quality Gates

**From CLAUDE.md - Five Automated Gates:**

```
Gate 1: Design Review
    - Architecture sound
    - Technology choices justified
    - Scalability considered
    - Security by design

Gate 2: Code Review
    - SOLID principles
    - Best practices followed
    - No code smells
    - Documentation adequate

Gate 3: Testing Validation
    - Coverage >80%
    - All tests passing
    - Edge cases covered

Gate 4: Security Audit
    - No vulnerabilities
    - Input validation complete
    - No secrets exposed

Gate 5: Performance Analysis
    - No bottlenecks
    - Response times acceptable
    - Resource usage reasonable
```

**However**: These gates run **after** implementation on **shared codebase**

---

## Part 4: Opportunities for Isolated Research Repositories

### 4.1 Simon's "Dedicated Research Repo" Pattern

**Key Principles:**
1. **Separate Repository**: Experimental work in isolated repo
2. **Clear Promotion Path**: Curated work moves from research → production
3. **Risk Isolation**: Failed experiments don't affect main codebase
4. **Knowledge Capture**: Research findings documented separately
5. **Integration Control**: Careful review before merging research into production

### 4.2 How orchestr8 Could Adopt This Pattern

#### Option A: Research Branch Strategy (Lightweight)

**Mechanism:**
```
orchestr8/
├── main/                           # Production codebase
│   ├── agents/
│   ├── commands/
│   ├── skills/
│   └── ...
├── research/                       # Dedicated research repo
│   ├── agents/                     # Experimental agents
│   ├── commands/                   # Experimental workflows
│   ├── RESEARCH_LOG.md            # Research findings
│   ├── EXPERIMENTS.md              # Active experiments
│   └── PROMOTION_QUEUE.md          # Ready for promotion
└── docs/
    ├── RESEARCH_PROCESS.md         # Guidelines
    └── PROMOTION_CRITERIA.md       # Quality bar for merging
```

**Workflow Implementation:**
1. User invokes `/orchestr8:research:new-experiment "experiment name"`
2. Research orchestrator creates isolated context
3. Experiments run in research/ directory
4. Findings documented in RESEARCH_LOG.md
5. Successful experiments promoted to main/ through PR

**Benefits:**
- ✅ Minimal code changes
- ✅ Git-based isolation
- ✅ Clear audit trail
- ✅ Existing tools work unchanged
- ❌ Not true sandboxing (agents still have file access)

#### Option B: Workspace Isolation (Moderate)

**Mechanism:**
```
Project Structure:
projectRoot/
├── production/                     # Main codebase
├── research/                       # Research workspace
│   ├── experiment-001/
│   │   ├── codebase/              # Isolated project files
│   │   ├── notes.md
│   │   └── results.md
│   └── experiment-002/
└── shared/                         # Shared resources
    ├── RESEARCH_FINDINGS.md
    └── PROMOTION_QUEUE.md

Agent Extension:
Research orchestrator operates in workspace context:
- RESEARCH_ROOT env var points to research/
- Read/Write operations scoped to research/
- Cross-contamination prevented through directory isolation
```

**Implementation Pattern:**

```yaml
---
name: research-orchestrator
description: Orchestrate research and experimental work in isolated workspace
model: claude-sonnet-4-5
---

# Research Orchestrator Agent

## Operating Principles

1. **Workspace Isolation**
   - All operations scoped to `$RESEARCH_ROOT` directory
   - Never read from main codebase (except shared schemas)
   - Never modify production agents/commands/skills

2. **Experiment Tracking**
   - Create unique directory: research/experiment-TIMESTAMP/
   - Log all decisions in experiment/notes.md
   - Record results in experiment/results.md

3. **Promotion Pipeline**
   - Successful experiments → PROMOTION_QUEUE.md
   - Manual review before merging to production
   - Full test suite run on promoted code
```

**Benefits:**
- ✅ Strong isolation through directory boundaries
- ✅ Natural experiment tracking
- ✅ Promotion visibility
- ✅ Reproducible research environments
- ⚠️  Requires coordination layer for promotion

#### Option C: Dynamic Environment Variables (Moderate)

**Mechanism:**
```
Research Workflow:
1. Launch research orchestrator with environment:
   - ORCHESTR8_MODE=research
   - ORCHESTR8_WORKSPACE=/research/experiment-001
   - ORCHESTR8_ISOLATION=strict

2. All agents check environment and scope operations:
   if [ "$ORCHESTR8_MODE" = "research" ]; then
     WORK_DIR="$ORCHESTR8_WORKSPACE"
   else
     WORK_DIR="$(pwd)"
   fi

3. Agent toolkit respects scoping:
   - Bash operations restricted to $WORK_DIR
   - Write operations only in $WORK_DIR
   - Read operations blocked outside shared/ and main/ (with flag)

4. Research findings automatically documented:
   - ORCHESTR8_MODE=research implies documentation
   - Auto-generate research report at completion
   - Track experiment metadata
```

**Benefits:**
- ✅ Runtime control without code changes
- ✅ Can enable/disable safety dynamically
- ✅ Supports multiple concurrent experiments
- ⚠️  Requires agent cooperation (not enforced)

#### Option D: Plugin-Level Isolation (Advanced)

**Mechanism:**
```
Plugin Architecture:

orchestr8-main/
├── agents/
├── commands/
└── skills/

orchestr8-research/ (NEW PLUGIN)
├── agents/
│   └── research-orchestrator.md
├── commands/
│   └── new-experiment.md
│   └── promote-experiment.md
└── research-workspace/
    └── experiments/

Command Flow:
/orchestr8:new-experiment → research-orchestrator
    ↓
Creates isolated experiment context
    ↓
Operates in research-workspace/
    ↓
/orchestr8:promote-experiment → promotion-reviewer
    ↓
Validates against production standards
    ↓
Creates PR to merge into main orchestr8
```

**Benefits:**
- ✅ Complete separation from main plugin
- ✅ Independent versioning
- ✅ Can manage risk profile separately
- ✅ Clear promotion pipeline
- ⚠️  Requires new plugin infrastructure

---

## Part 5: Recommended Implementation

### 5.1 Phased Approach

**Phase 1: Lightweight Research Pattern (Weeks 1-2)**

Implement Option A with supporting documentation:

**1. Create Research Structure**
```bash
orchestr8/
├── research/
│   ├── .gitignore
│   ├── RESEARCH_LOG.md           # All experiments documented
│   ├── EXPERIMENTS.md            # Currently active experiments
│   ├── PROMOTION_QUEUE.md        # Ready for production
│   └── experiments/
│       └── [experiment-id]/
│           ├── notes.md          # Hypothesis, decisions, findings
│           ├── code/             # Experimental code
│           ├── results.md        # Results & metrics
│           └── comparison.md     # Before/after analysis
└── docs/
    ├── RESEARCH_PROCESS.md       # How to run experiments
    └── RESEARCH_STANDARDS.md     # What makes experiment successful
```

**2. Create Research Orchestrator Agent**
```yaml
---
name: research-orchestrator
description: Orchestrate experimental research and development work
model: claude-sonnet-4-5
---

# Research Orchestrator Agent

Your role is to conduct systematic research while maintaining clear 
documentation and promoting successful experiments to production.

## Core Responsibilities

1. Experiment Planning
2. Research Documentation
3. Results Analysis
4. Promotion Preparation
5. Knowledge Capture
```

**3. Create Experiment Workflow Command**
```yaml
---
description: Start a new research experiment
argument-hint: [experiment-description]
model: claude-sonnet-4-5
---

# New Experiment Workflow

Delegates to research-orchestrator to:
1. Create isolated experiment directory
2. Document hypothesis and approach
3. Execute research
4. Analyze results
5. Determine promotion readiness
```

**4. Create Promotion Workflow**
```yaml
---
description: Review and promote successful experiments
argument-hint: [experiment-id]
model: claude-sonnet-4-5
---

# Promote Experiment Workflow

Validates experimental code against production standards:
1. Security audit
2. Performance validation
3. Integration testing
4. Code review
5. Documentation completeness
6. Create promotion PR
```

**Timeline**: 1-2 weeks
**Risk**: Low (no changes to existing agents/workflows)
**Value**: Immediate improvement in research organization

---

**Phase 2: Workspace Isolation (Weeks 3-4)**

Enhance with directory-level isolation:

**1. Add Environment Variables**
```bash
# research/config.sh
export RESEARCH_ROOT="$(pwd)/research"
export RESEARCH_ID="experiment-$(date +%s)"
export RESEARCH_DIR="$RESEARCH_ROOT/experiments/$RESEARCH_ID"

# Source in research orchestrator
source ./config.sh
```

**2. Scope Agent Operations**

Modify research orchestrator to:
```bash
# All operations respect RESEARCH_DIR
cd "$RESEARCH_DIR" || exit 1

# Read/Write operations scoped
Write() {
  local file="$1"
  # Ensure writes stay in research directory
  if [[ ! "$file" = "$RESEARCH_DIR"* ]]; then
    echo "⚠️  Sandboxing: Cannot write outside $RESEARCH_DIR"
    return 1
  fi
  # ... proceed with write
}
```

**3. Cross-Reference Control**

Research code can reference production:
```bash
# Allow reading from main agents (read-only)
if [[ "$ORCHESTR8_MODE" = "research" ]]; then
  # Can read main agents for context
  cat "$MAIN_AGENTS_DIR/architect.md"
  
  # But cannot modify
  Write "$MAIN_AGENTS_DIR/modified.md"  # BLOCKED
fi
```

**Timeline**: 1-2 weeks
**Risk**: Low-Medium (requires agent coordination)
**Value**: True isolation for most operations

---

**Phase 3: Dynamic Safety Framework (Weeks 5-6)**

Add runtime controls:

**1. Create Safety Configuration**
```yaml
# research/safety.yml
isolation_level: strict  # strict, moderate, permissive
allowed_operations:
  - read_from_main: false      # Cannot read production code
  - write_to_main: false        # Cannot write to production
  - execute_tests: true         # Can run tests
  - modify_dependencies: false  # Cannot change prod deps
  - access_secrets: restricted  # Limited secret access
  - network_access: local_only  # No external network
```

**2. Implement Policy Enforcement**

```bash
# In research-orchestrator
check_safety_policy() {
  local operation="$1"
  local target="$2"
  
  # Check against safety.yml
  if is_blocked_by_policy "$operation" "$target"; then
    log_blocked_operation "$operation" "$target"
    return 1
  fi
  return 0
}

# Before any file operation
check_safety_policy "write" "$target_file" || return 1
```

**3. Audit Logging**

```bash
# Log all research operations
log_research_operation() {
  local timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local operation="$1"
  local status="$2"
  
  echo "{
    \"timestamp\": \"$timestamp\",
    \"experiment_id\": \"$RESEARCH_ID\",
    \"operation\": \"$operation\",
    \"status\": \"$status\"
  }" >> "$RESEARCH_DIR/audit.log"
}
```

**Timeline**: 1-2 weeks
**Risk**: Low (additive, no changes to existing system)
**Value**: Comprehensive audit trail and safety enforcement

---

### 5.2 Recommended Implementation: Phase 1 + Lightweight Workspace

**Quick Win** (2-3 weeks): Combine Phase 1 + Part of Phase 2

**Deliverables:**

1. **New Directory Structure**
```
orchestr8/plugins/orchestr8/
├── agents/
│   ├── orchestration/
│   │   ├── project-orchestrator.md       # Existing
│   │   ├── feature-orchestrator.md       # Existing
│   │   ├── research-orchestrator.md      # NEW
│   │   └── promotion-reviewer.md         # NEW
│   └── ...
├── commands/
│   ├── add-feature.md                    # Existing
│   ├── new-experiment.md                 # NEW
│   ├── promote-experiment.md             # NEW
│   └── ...
├── research/                             # NEW
│   ├── .gitignore
│   ├── RESEARCH_LOG.md
│   ├── EXPERIMENTS.md
│   ├── PROMOTION_QUEUE.md
│   ├── experiments/
│   └── docs/
│       ├── RESEARCH_PROCESS.md
│       ├── RESEARCH_STANDARDS.md
│       └── SAFETY_GUIDELINES.md
└── ...
```

2. **New Agents** (3 files)

`research-orchestrator.md` - Main research conductor
`promotion-reviewer.md` - Quality gate for promoting research
(Repurpose existing agents as needed)

3. **New Workflows** (2 commands)

`new-experiment.md` - `/orchestr8:new-experiment`
`promote-experiment.md` - `/orchestr8:promote-experiment`

4. **Documentation** (3 files)

`RESEARCH_PROCESS.md` - How to use research workflows
`RESEARCH_STANDARDS.md` - Quality bar for promotion
`SAFETY_GUIDELINES.md` - Safety and isolation practices

---

## Part 6: Implementation Guide

### 6.1 Research Orchestrator Agent Structure

```yaml
---
name: research-orchestrator
description: Orchestrate research experiments with clear documentation, 
             isolation, and promotion path to production
model: claude-sonnet-4-5
---

# Research Orchestrator Agent

You are specialized in conducting systematic research while maintaining 
clear documentation and promoting successful findings to production.

## Core Workflow

### Phase 1: Experiment Setup (10%)
- Create experiment directory: research/experiments/TIMESTAMP/
- Document hypothesis
- Define success criteria
- Identify affected components

### Phase 2: Research Execution (60%)
- Implement experimental code
- Document decisions in notes.md
- Run experiments
- Collect metrics

### Phase 3: Results Analysis (20%)
- Analyze findings
- Document comparison vs baseline
- Identify production readiness
- Record lessons learned

### Phase 4: Promotion Preparation (10%)
- Prepare promotion documentation
- Add to PROMOTION_QUEUE.md
- Tag with confidence level
- Specify integration requirements

## Research Documentation Template

```
research/experiments/TIMESTAMP/

├── notes.md
│   - Hypothesis
│   - Approach
│   - Key decisions
│   - Issues encountered
│   - Lessons learned
│
├── code/
│   - Experimental implementation
│   - Test suite
│   - Performance benchmarks
│
├── results.md
│   - What worked
│   - What didn't
│   - Metrics collected
│   - Unexpected findings
│
└── comparison.md
    - Before/after analysis
    - Performance impact
    - Complexity trade-offs
    - Recommendation
```
```

### 6.2 Promotion Reviewer Agent Structure

```yaml
---
name: promotion-reviewer
description: Review experimental code against production standards before promotion
model: claude-sonnet-4-5
---

# Promotion Reviewer Agent

You validate that experimental code meets production standards.

## Promotion Checklist

### 1. Research Quality
- [ ] Clear hypothesis documented
- [ ] Results reproducible
- [ ] Lessons learned captured
- [ ] Decision rationale explained

### 2. Code Quality
- [ ] SOLID principles followed
- [ ] No technical debt introduced
- [ ] Performance acceptable
- [ ] Test coverage >80%

### 3. Security
- [ ] OWASP compliance
- [ ] No new vulnerabilities
- [ ] Data handling correct
- [ ] Dependencies safe

### 4. Integration
- [ ] Compatible with main codebase
- [ ] Breaking changes identified
- [ ] Migration plan clear
- [ ] Rollback strategy defined

### 5. Documentation
- [ ] Research findings documented
- [ ] Integration guide clear
- [ ] Examples provided
- [ ] Known limitations listed

## Promotion Decision

If all criteria met:
- Approve promotion
- Create PR with research findings
- Tag with findings level (experimental, proven, foundational)
- Recommend for next development cycle
```

### 6.3 New Experiment Workflow

```yaml
---
description: Start a new research experiment with systematic documentation
argument-hint: [experiment-description]
model: claude-sonnet-4-5
---

# New Experiment Workflow

## Phase 1: Experiment Setup

**Delegate to research-orchestrator:**

```
Task tool invocation:
- Description: "Conduct research experiment"
- Agent: research-orchestrator
- Prompt: "Execute research experiment:

$1

Conduct the following phases:
1. Create experiment directory with clear structure
2. Document hypothesis and approach  
3. Execute research
4. Analyze results
5. Prepare promotion assessment

Expected outputs:
- experiment/notes.md - Complete documentation
- experiment/results.md - Findings and metrics
- experiment/comparison.md - vs baseline analysis
- experiment/READY_FOR_PROMOTION - if successful
"
```

## Success Criteria

- ✅ Experiment directory created
- ✅ Hypothesis documented
- ✅ Code implemented and tested
- ✅ Results analyzed
- ✅ Promotion readiness assessed
```

### 6.4 Promote Experiment Workflow

```yaml
---
description: Review and promote successful experiments to production
argument-hint: [experiment-id]
model: claude-sonnet-4-5
---

# Promote Experiment Workflow

## Phase 1: Validation Review

**Delegate to promotion-reviewer:**

```
Task tool invocation:
- Description: "Review and promote research experiment"
- Agent: promotion-reviewer
- Prompt: "Review experiment ready for promotion:

Experiment ID: $1

Tasks:
1. Validate experiment meets production standards
2. Check security and code quality
3. Assess integration complexity
4. Create promotion summary
5. Generate PR description

Expected outputs:
- PROMOTION_ASSESSMENT.md
- integration-plan.md
- PR description with findings
"
```

## Success Criteria

- ✅ Passes security audit
- ✅ Passes code review
- ✅ Passes integration test
- ✅ Promotion PR created
```

---

## Part 7: Benefits & Trade-offs

### 7.1 Benefits of Dedicated Research Pattern

**For orchestr8:**
1. ✅ **Safe Experimentation**: Failed research doesn't break production
2. ✅ **Clear Audit Trail**: All research documented and visible
3. ✅ **Knowledge Capture**: Findings recorded for future reference
4. ✅ **Controlled Promotion**: Quality gates before merging to main
5. ✅ **Risk Isolation**: Experimental agents/commands separate from production
6. ✅ **Scalable**: Support multiple concurrent experiments
7. ✅ **Extensible**: Foundation for more advanced isolation
8. ✅ **Observable**: Clear visibility into research activities

**For Users:**
1. ✅ **Confidence**: Experiments proven before production use
2. ✅ **Reproducibility**: Research methods documented
3. ✅ **Learning**: Access to research findings and lessons
4. ✅ **Control**: Manual approval gate for major changes
5. ✅ **Traceability**: Know why changes were made

### 7.2 Trade-offs & Considerations

**Resource Cost:**
- ⚠️  Requires creation of 2-3 new agents
- ⚠️  Requires 2-3 new workflow commands
- ⚠️  Requires documentation updates
- **Effort**: ~200 lines of markdown per new agent

**Operational Complexity:**
- ⚠️  Adds promotion workflow (human review step)
- ⚠️  Requires discipline in using research workflows
- ⚠️  Increases codebase size slightly
- **Mitigation**: Clear documentation and examples

**Limitations of Phase 1:**
- ❌ Not true sandboxing (directory-based isolation only)
- ❌ Relies on agent cooperation for safety
- ❌ Manual promotion process (could add bot)
- ❌ Can still access production files (with discipline)

**Path to Stronger Isolation:**
- Phase 2 adds environment variable scoping
- Phase 3 adds policy enforcement
- Phase D explores plugin-level separation if needed

---

## Part 8: Concrete Example

### 8.1 Using Research Workflow

**User Initiative:**
```
I want to experiment with using Claude Opus for all agents 
instead of Haiku/Sonnet to see if we get better results.
```

**Step 1: Start Experiment**
```bash
/orchestr8:new-experiment "Evaluate Opus model for all agent tasks

Hypothesis: Using claude-opus-4 for all agents improves:
- Code quality output
- Complex reasoning capability
- Overall faster delivery despite higher token cost

Success Criteria:
- Generated code passes all quality gates
- Test coverage maintained at >80%
- Measurable improvement in quality metrics
- Cost/benefit analysis complete
"
```

**Step 2: Research Orchestrator Executes**

The research-orchestrator:
1. Creates: `research/experiments/experiment-opus-001/`
2. Documents hypothesis in `notes.md`
3. Creates experimental agents in `code/agents/`
4. Runs quality gates on experimental code
5. Compares results vs baseline
6. Documents findings in `results.md`

**Step 3: Results Documented**

```
research/experiments/experiment-opus-001/

notes.md:
- Hypothesis: Opus improves code quality
- Approach: Replace all Haiku agents with Opus
- Decision: Tested 5 representative workflows
- Finding: 15% improvement in code quality metrics
- Issue: 40% increase in token usage
- Learning: Opus beneficial for complex tasks, not simple ones

results.md:
- Code quality: +15% (SOLID violations down 8)
- Test coverage: Maintained 82%
- Speed: Slightly slower (larger context windows)
- Cost: $0.47 per workflow vs $0.12 baseline

comparison.md:
- Recommendation: Use Opus selectively for complex tasks
- Integration plan: Create hybrid model selection
- Known limitations: Higher cost may not justify for all agents
- Next steps: Explore model-specific agent assignments
```

**Step 4: Review for Promotion**

```bash
/orchestr8:promote-experiment "experiment-opus-001"
```

The promotion-reviewer:
1. ✅ Validates research quality
2. ✅ Checks code quality of experimental agents
3. ✅ Runs security audit
4. ✅ Assesses integration complexity
5. ✅ Creates promotion assessment

**Step 5: Decision**

```
PROMOTION_ASSESSMENT.md:

Status: APPROVED with recommendations
Findings:
- Experimental agents meet production standards
- 15% quality improvement justified for complex workflows
- Cost trade-off acceptable for premium features
- Low risk integration

Recommendation:
Promote subset of high-value agents to production:
- project-orchestrator: PROMOTE (Opus - highest complexity)
- architect: PROMOTE (Opus - design critical)
- code-reviewer: PROMOTE (Opus - detailed analysis)
- feature-orchestrator: KEEP HAIKU (routine coordination)
- fullstack-developer: KEEP HAIKU (standard features)

Integration Plan:
- Create model-specific agent variants
- Update agent selection logic
- Add cost tracking per agent
- Monitor quality metrics monthly
```

**Step 6: Integration**

Promotion workflow creates PR:
- Merges experimental agents into production
- Updates agent selection logic
- Creates model assignment strategy
- Documents decision in ADR

---

## Part 9: Comparison Matrix

| Aspect | Current | Phase 1 | Phase 2 | Phase 3 |
|--------|---------|---------|---------|---------|
| **Isolation** | Implicit | Directory | Env + Dir | Env + Dir + Policy |
| **Experiment Tracking** | Manual | Automatic | Automatic | Automatic |
| **Promotion Control** | Ad-hoc | Structured | Structured | Structured |
| **Safety Enforcement** | Trust | Trust + Docs | Trust + Scoping | Enforced |
| **Audit Trail** | None | Full | Full | Full |
| **Implementation Cost** | N/A | 2-3 weeks | +1-2 weeks | +1-2 weeks |
| **Operational Overhead** | Low | Low | Low-Medium | Medium |
| **Risk Level** | High | Medium | Low | Very Low |

---

## Part 10: Recommendations

### 10.1 Immediate Actions (Week 1)

1. **Create Research Directory Structure**
   ```bash
   mkdir -p orchestr8/plugins/orchestr8/research/{experiments,docs}
   touch research/RESEARCH_LOG.md
   touch research/EXPERIMENTS.md
   touch research/PROMOTION_QUEUE.md
   ```

2. **Document Research Process**
   - Create `RESEARCH_PROCESS.md` with workflow steps
   - Create `RESEARCH_STANDARDS.md` with quality bar
   - Add to main README under "Research Mode"

3. **Create Example Experiment**
   - Demonstrate directory structure
   - Show documentation format
   - Document lessons learned

### 10.2 Short-term (Weeks 2-3)

1. **Implement Phase 1 + Lightweight Workspace**
   - Create `research-orchestrator.md` agent
   - Create `promotion-reviewer.md` agent
   - Create `/orchestr8:new-experiment` workflow
   - Create `/orchestr8:promote-experiment` workflow

2. **Add Safety Guidelines**
   - Document what should/shouldn't be in research/
   - Clarify promotion decision-making
   - Establish frequency of promotion reviews

3. **Integration Testing**
   - Test research workflow with real experiment
   - Validate promotion flow works
   - Document any issues

### 10.3 Medium-term (Month 2)

1. **Enhance with Workspace Isolation** (Phase 2)
   - Add environment variable scoping
   - Implement safety boundaries
   - Add directory-level access controls

2. **Build Research Dashboard** (Optional)
   - Query `RESEARCH_LOG.md` to show active experiments
   - Display promotion queue
   - Track experiment success rate

3. **Gather Feedback**
   - Collect user feedback on research workflow
   - Identify pain points
   - Plan improvements for next iteration

### 10.4 Long-term (Quarter 2)

1. **Implement Policy Framework** (Phase 3)
   - Add `safety.yml` configuration
   - Implement policy enforcement
   - Add comprehensive audit logging

2. **Advanced Features**
   - Automated safety checks before promotion
   - Integration with CI/CD for research branch
   - Metrics tracking and reporting

---

## Conclusion

orchestr8 is exceptionally well-positioned to adopt Simon's "dedicated research repository" pattern. The clean, file-based architecture and clear agent separation make this both straightforward to implement and valuable to adopt.

**Recommended Path:**
1. **Phase 1 + Lightweight Workspace** (2-3 weeks, low risk)
2. **Test with real experiment** (1 week)
3. **Gather feedback and iterate** (ongoing)
4. **Phase 2 enhancements** (4-6 weeks, medium risk)
5. **Phase 3 policy framework** (if needed for higher safety bar)

**Expected Outcomes:**
- ✅ Experiments conducted with clear documentation
- ✅ Failed experiments don't affect production
- ✅ Successful experiments promoted through quality gates
- ✅ Full audit trail of all research activities
- ✅ Knowledge captured for future reference
- ✅ Scalable platform for continuous experimentation and improvement

