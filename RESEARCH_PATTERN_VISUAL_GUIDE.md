# orchestr8 Research/Sandbox Pattern - Visual Guide

## Current Architecture vs Proposed

### CURRENT STATE (All Work in Same Context)

```
┌─────────────────────────────────────────────────────────┐
│                  Claude Code Session                    │
└──────────────────────┬──────────────────────────────────┘
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
    ┌─────────┐  ┌──────────┐  ┌──────────┐
    │ Feature │  │   Bug    │  │ Research │
    │   Work  │  │   Fix    │  │   Work   │
    └────┬────┘  └────┬─────┘  └────┬─────┘
         │             │             │
         └─────────────┼─────────────┘
                       │
              ┌────────▼──────────┐
              │   Same Codebase   │
              │   Same Agents     │
              │   Same Context    │
              └─────────┬─────────┘
                        │
                        ▼
              ┌──────────────────┐
              │   Production     │
              │    (At Risk!)    │
              └──────────────────┘

PROBLEM: Failed research can break production
```

---

### PROPOSED STATE (Research Isolated)

```
┌──────────────────────────────────────────────────────────┐
│                  Claude Code Session                     │
└────────────────────┬─────────────────────────────────────┘
                     │
        ┌────────────┼────────────┬──────────────┐
        ▼            ▼            ▼              ▼
   ┌─────────┐ ┌────────┐ ┌──────────┐  ┌───────────┐
   │ Feature │ │  Bug   │ │ Research │  │ Promotion │
   │ Develop │ │  Work  │ │ Workflow │  │  Reviewer │
   └────┬────┘ └───┬────┘ └────┬─────┘  └─────┬─────┘
        │          │           │              │
        └──────────┼───────────┼──────────────┘
                   │           │
         ┌─────────▼───┐  ┌────▼──────────┐
         │  Production │  │ /research/    │
         │  /agents/   │  │  experiments/ │
         │  /commands/ │  │  code/        │
         └─────────────┘  └────┬──────────┘
                               │
                      ┌────────▼─────────┐
                      │ PROMOTION QUEUE  │
                      │ Manual Review    │
                      │ Quality Gates    │
                      └────────┬─────────┘
                               │
                        ✓ Approved
                               │
                               ▼
                      ┌──────────────────┐
                      │   Production     │
                      │    (Safe!)       │
                      └──────────────────┘

SOLUTION: Research isolated until promotion approved
```

---

## Phase 1: Lightweight Research Pattern

### Directory Structure

```
orchestr8/
├── agents/                     ← Production agents
│   ├── development/
│   ├── quality/
│   └── ...
├── commands/                   ← Production workflows
│   ├── add-feature.md
│   ├── new-experiment.md       ← NEW
│   ├── promote-experiment.md   ← NEW
│   └── ...
├── plugins/
├── skills/
└── research/                   ← NEW: Dedicated research space
    ├── RESEARCH_LOG.md         ← All experiments logged
    ├── EXPERIMENTS.md          ← Currently active
    ├── PROMOTION_QUEUE.md      ← Ready for production
    ├── experiments/
    │   ├── experiment-opus-001/
    │   │   ├── notes.md        (Hypothesis, approach, findings)
    │   │   ├── code/
    │   │   │   ├── agents/     (Experimental agents)
    │   │   │   └── code/       (Experimental code)
    │   │   ├── results.md      (Metrics & findings)
    │   │   └── comparison.md   (vs baseline)
    │   └── experiment-002/
    └── docs/
        ├── RESEARCH_PROCESS.md
        ├── RESEARCH_STANDARDS.md
        └── SAFETY_GUIDELINES.md
```

---

## Workflow Comparison

### Feature Development

```
CURRENT:                          PROPOSED:
/add-feature                      /add-feature
    ↓                                ↓
feature-orchestrator              feature-orchestrator
    ↓                                ↓
(Implementation)                  (Implementation)
    ↓                                ↓
Same codebase                     Same codebase
    ↓                                ↓
Quality gates                     Quality gates
    ↓                                ↓
Production                        Production

(Works - features are safe)       (Works - features are safe)
```

### Research/Experimentation

```
CURRENT (RISKY):                  PROPOSED (SAFE):
Manual editing                    /new-experiment
    ↓                                ↓
ad-hoc testing                    research-orchestrator
    ↓                                ↓
Commit or revert                  research/experiment-id/
    ↓                                ├─ notes.md
Lost documentation               ├─ code/
Lost findings                     ├─ results.md
Risk to production                └─ comparison.md
                                      ↓
                                  /promote-experiment
                                      ↓
                                  promotion-reviewer
                                      ↓
                                  ✓ Security audit
                                  ✓ Code review
                                  ✓ Integration test
                                      ↓
                                  Production (if approved)
```

---

## Agent Invocation Patterns

### Production Agents (Unchanged)

```
┌─────────────────────────────────────┐
│        orchestr8 Workflow           │
│  (e.g., /add-feature, /fix-bug)     │
└────────────────────┬────────────────┘
                     │
            ┌────────▼────────┐
            │ Feature          │ ← from /agents/orchestration/
            │ Orchestrator     │
            └────────┬────────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    ┌────────┐ ┌────────┐ ┌────────┐
    │Backend │ │Frontend│ │  Test  │
    │  Dev   │ │  Dev   │ │Engineer│
    └────┬───┘ └───┬────┘ └───┬────┘
         │         │          │
         └────┬────┴────┬─────┘
              │         │
          ┌───▼─────────▼──┐
          │ Same Codebase  │ ← /agents/ + current files
          └────────────────┘
```

### Research Agents (New Pattern)

```
┌──────────────────────────────────────┐
│   /orchestr8:new-experiment          │
│   "Evaluate Opus model..."           │
└────────────────────┬─────────────────┘
                     │
            ┌────────▼───────────┐
            │  Research          │ ← NEW: from /agents/
            │  Orchestrator      │   orchestration/
            └────────┬───────────┘
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
   ┌────────┐  ┌────────┐  ┌──────────┐
   │Analyzer│  │Executor│  │Validator │
   └───┬────┘  └────┬───┘  └────┬─────┘
       │            │           │
       └────────┬───┴───────┬───┘
                │           │
         ┌──────▼───────────▼──┐
         │ research/           │ ← ISOLATED
         │ experiments/        │   directory
         │ experiment-id/      │
         └─────────────────────┘

         Results:
         ├─ notes.md (hypothesis, findings)
         ├─ code/ (experimental agents)
         ├─ results.md (metrics)
         └─ comparison.md (vs baseline)
```

---

## Promotion Pipeline

### Simple Case: Successful Experiment

```
EXPERIMENT READY
   ↓
✓ Hypothesis documented
✓ Results reproducible
✓ Code passes quality gates
   ↓
PROMOTION QUEUE
   ↓
/promote-experiment experiment-id
   ↓
Promotion Reviewer
   ├─ Code quality check (SOLID, best practices)
   ├─ Security audit (OWASP, vulnerabilities)
   ├─ Integration test (compatible with main)
   ├─ Documentation (clear integration plan)
   └─ Team approval (if needed)
   ↓
✓ APPROVED
   ↓
Create PR to main orchestr8
├─ Merge experimental agents
├─ Update agent selection logic
├─ Document in CHANGELOG
└─ Record decision (ADR)
   ↓
PRODUCTION
```

### Complex Case: Needs Revision

```
EXPERIMENT READY
   ↓
/promote-experiment experiment-id
   ↓
Promotion Reviewer
   ├─ Code quality: ✗ FAILED
   │  Reason: High cyclomatic complexity
   ├─ Security: ✓ PASSED
   ├─ Integration: ✓ PASSED
   └─ Documentation: ⚠ INCOMPLETE
   ↓
❌ REJECTED
   ↓
FEEDBACK to researcher:
- Refactor complex functions
- Add integration examples
- Document performance impact
   ↓
RESUBMIT (revised experiment)
   ↓
Promotion Reviewer (again)
   ├─ Code quality: ✓ PASSED
   ├─ Security: ✓ PASSED
   ├─ Integration: ✓ PASSED
   └─ Documentation: ✓ PASSED
   ↓
✓ APPROVED
   ↓
PRODUCTION
```

---

## Implementation Timeline

### Week 1: Planning Phase

```
Day 1: Review Analysis
├─ Read RESEARCH_ENVIRONMENTS_ANALYSIS.md
├─ Read RESEARCH_ENVIRONMENTS_SUMMARY.md
└─ Discuss with team

Day 2-3: Design
├─ Decide on Phase 1 scope
├─ Design agents (research-orchestrator, promotion-reviewer)
├─ Design workflows (/new-experiment, /promote-experiment)
└─ Plan directory structure

Day 4-5: Preparation
├─ Create directory structure
├─ Plan agent files and content
├─ Create documentation templates
└─ Set up git/branch if needed
```

### Week 2-3: Implementation Phase

```
Day 1-2: Research Orchestrator Agent
├─ Create /agents/orchestration/research-orchestrator.md
├─ Implement experiment setup logic
├─ Implement research execution framework
└─ Implement documentation patterns

Day 3-4: Promotion Reviewer Agent
├─ Create /agents/orchestration/promotion-reviewer.md
├─ Implement quality gate checks
├─ Implement decision logic
└─ Implement feedback generation

Day 5-6: Workflow Commands
├─ Create /commands/new-experiment.md
├─ Create /commands/promote-experiment.md
└─ Test delegation patterns

Day 7-10: Documentation
├─ Create RESEARCH_PROCESS.md
├─ Create RESEARCH_STANDARDS.md
├─ Create SAFETY_GUIDELINES.md
└─ Create example experiments
```

### Week 4: Testing & Refinement

```
Day 1-3: E2E Testing
├─ Conduct real experiment (e.g., model evaluation)
├─ Test workflow execution end-to-end
├─ Test promotion pipeline
└─ Validate documentation

Day 4-5: Feedback & Iteration
├─ Gather team feedback
├─ Refine templates based on experience
├─ Improve documentation clarity
└─ Fix any issues discovered

Day 6-7: Launch
├─ Announce new research workflows
├─ Publish documentation
├─ Train users
└─ Monitor initial usage
```

---

## Key Metrics to Track

### Experiment Level
```
experiment-opus-001/metrics.json
{
  "hypothesis_clarity": "High",
  "results_reproducible": true,
  "findings_documented": "Complete",
  "promotion_ready": true,
  "approval_status": "APPROVED"
}
```

### Portfolio Level
```
RESEARCH_LOG.md summary
Total Experiments: 15
├─ Completed: 12
├─ In Progress: 2
└─ On Hold: 1

Promoted to Production: 8 (53%)
├─ Successful: 8
├─ Reverted: 0
└─ Pending: 2

Knowledge Captured: 12 documents
├─ Findings published: 10
├─ Lessons learned: 12
└─ Best practices: 5
```

---

## Phase 2: Workspace Isolation (Optional)

### Environment Variable Scoping

```
BEFORE (Phase 1):
agent can read/write:
├─ /agents/ ✓
├─ /research/experiments/experiment-id/ ✓
└─ /production/code/ ✓ (risky!)

AFTER (Phase 2):
ORCHESTR8_MODE=research
RESEARCH_ROOT=/research/experiments/experiment-id

agent can read/write:
├─ /research/experiments/experiment-id/ ✓
├─ /agents/ (read-only) ✓
└─ /production/code/ ✗ BLOCKED

SAFETY IMPROVED:
✓ Cannot accidentally modify production code
✓ Cannot modify production agents
✓ Can reference production code (read-only)
✓ All operations scoped to experiment directory
```

---

## Phase 3: Policy Framework (Advanced)

### Safety Configuration

```
research/experiments/experiment-id/safety.yml

isolation_level: strict

allowed_operations:
  read_production_code: false        # Cannot read main code
  write_production_code: false       # Cannot write to main
  modify_production_agents: false    # Cannot change agents
  read_production_agents: true       # Can reference for context
  modify_dependencies: false         # Cannot change requirements
  execute_tests: true                # Can run tests
  access_secrets: restricted         # Limited secret access
  network_access: local_only         # No external network

audit_logging: enabled
safety_validation: strict
```

---

## Success Indicators

### Phase 1 Success
- [ ] Research workflows created and documented
- [ ] First experiment conducted successfully
- [ ] Findings documented and retrievable
- [ ] Promotion pipeline validated
- [ ] Team using research workflows
- [ ] No research pollution in production

### Phase 2 Success
- [ ] Environment variable scoping working
- [ ] Agents respect isolation boundaries
- [ ] Safety validated by tests
- [ ] Audit logs complete and useful
- [ ] No cross-contamination incidents

### Phase 3 Success
- [ ] Safety policies enforced at runtime
- [ ] Policy violations detected and logged
- [ ] Audit trail comprehensive
- [ ] Advanced experiments possible safely
- [ ] Dashboard/reporting available

---

## Summary: Current vs Proposed

| Aspect | Current | Phase 1 | Phase 2 | Phase 3 |
|--------|---------|---------|---------|---------|
| Research isolation | None | Directory | Env vars | Policies |
| Documentation | Manual | Automatic | Automatic | Automatic |
| Promotion control | Ad-hoc | Structured | Structured | Strict |
| Safety | Implicit | Trust+Docs | Enforced | Enforced |
| Audit trail | None | Full | Full | Full |
| Implementation | N/A | 2-3 wks | +1-2 wks | +1-2 wks |
| Complexity | Low | Low | Medium | Medium |
| Risk | High | Medium | Low | Very Low |
