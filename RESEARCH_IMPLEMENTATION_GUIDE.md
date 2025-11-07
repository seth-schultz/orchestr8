# Orchestr8 Research Agent Implementation Guide

Quick visual reference for implementing research agents in orchestr8.

---

## Visual: Current Architecture vs. Enhanced

### Current Flow
```
                        ┌─────────────┐
                        │  architect  │
                        │   (2 hours) │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │  developer  │
                        │  (5 hours)  │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │ test-engineer
                        │  (1 hour)   │
                        └──────┬──────┘
                               │
                        ┌──────▼──────┐
                        │code-reviewer│
                        │ (30 mins)   │
                        └──────┬──────┘
                               │
                            DEPLOY
                        
TIMELINE: ~8.5 hours (sequential)
PROBLEM: If design wrong, huge rework cost
```

### Enhanced with Research
```
                        ┌─────────────┐
                        │  architect  │
                        │  (2 hours)  │
                        └──────┬──────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
            ┌───────▼────────┐    ┌──────▼──────────┐
            │    developer   │    │ code-researcher │
            │   (5 hours)    │    │  (1.5 hours)    │
            └───────┬────────┘    └──────┬──────────┘
                    │                    │
                    │  ASYNC (parallel)  │
                    │                    │
                    └────────┬───────────┘
                             │
                        DECISION:
                   Keep main or switch?
                   (15 mins analysis)
                             │
                    ┌────────▼────────┐
                    │ test-engineer   │
                    │   (1 hour)      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ code-reviewer   │
                    │  (30 mins)      │
                    └────────┬────────┘
                             │
                          DEPLOY
                        
TIMELINE: ~7.5 hours + decision (no delay vs current)
BENEFIT: Data-driven decision + confidence
```

---

## New Agents Overview

```
Research Agent Family
│
├─ code-researcher ⭐⭐⭐ PRIORITY: HIGH
│  ├─ Purpose: Explore alternative implementations
│  ├─ Input: Problem description
│  ├─ Process: 
│  │  1. Generate 3-5 approaches
│  │  2. Implement minimal versions
│  │  3. Benchmark/compare
│  │  4. Create comparison report
│  └─ Output: Research findings JSON
│
├─ performance-researcher ⭐⭐ PRIORITY: MEDIUM
│  ├─ Purpose: Benchmark different approaches
│  ├─ Input: Code samples or approaches
│  ├─ Process:
│  │  1. Profile current implementation
│  │  2. Test optimization strategies
│  │  3. Load test at scale
│  │  4. Create benchmark report
│  └─ Output: Performance metrics + recommendations
│
├─ architecture-researcher ⭐⭐ PRIORITY: MEDIUM
│  ├─ Purpose: Validate architectural assumptions
│  ├─ Input: Architecture design + assumptions
│  ├─ Process:
│  │  1. Extract assumptions
│  │  2. Design validation PoCs
│  │  3. Test each assumption
│  │  4. Create validation report
│  └─ Output: Assumption validation results
│
├─ pattern-experimenter ⭐⭐ PRIORITY: MEDIUM
│  ├─ Purpose: Test design patterns
│  ├─ Input: Pattern options + use case
│  ├─ Process:
│  │  1. Implement each pattern
│  │  2. Compare on metrics
│  │  3. Test applicability
│  │  4. Create pattern comparison
│  └─ Output: Pattern recommendation + guidance
│
└─ pattern-learner ⭐ PRIORITY: LOW
   ├─ Purpose: Extract organizational patterns
   ├─ Input: Multiple implementations + research
   ├─ Process:
   │  1. Analyze patterns
   │  2. Extract generalizations
   │  3. Synthesize learnings
   │  4. Create pattern specs
   └─ Output: Organizational pattern library
```

---

## Step-by-Step Implementation

### PHASE 1: Foundation (5 hours, HIGH PRIORITY)

#### Task 1.1: Create code-researcher Agent (2 hours)

**File**: `/plugins/orchestr8/agents/research/code-researcher.md`

**Checklist:**
- [ ] Create `/agents/research/` directory
- [ ] Create `code-researcher.md` file
- [ ] Add YAML frontmatter (name, description, model)
- [ ] Write core responsibilities section
- [ ] Add "Exploration Mode" section (generate alternatives)
- [ ] Add "Benchmarking Mode" section (compare)
- [ ] Add "Output Format" section (JSON structure)
- [ ] Add examples (2-3 concrete examples)
- [ ] Add best practices (DO/DON'T)

**Key Sections:**
```
---
name: code-researcher
description: Research specialist exploring alternatives...
model: claude-sonnet-4-5-20250929
---

# Code Researcher Agent

## Core Responsibilities
[What this agent does]

## Exploration Mode
[How to explore 3-5 alternatives]

## Implementation Guidelines
[How to implement minimal versions]

## Benchmarking
[How to compare approaches]

## Output Format
[JSON structure of findings]

## Examples
[2-3 concrete research examples]

## Best Practices
[DO/DON'T lists]
```

---

#### Task 1.2: Create /orchestr8:research Command (1 hour)

**File**: `/plugins/orchestr8/commands/research.md`

**Checklist:**
- [ ] Create file in `/commands/` directory
- [ ] Add YAML frontmatter
- [ ] Write command description
- [ ] Show usage examples (3+ examples)
- [ ] Document input format
- [ ] Document output format
- [ ] Add "When to use" section
- [ ] Add integration notes

**Key Content:**
```
---
description: Research code strategies, validate assumptions
argument-hint: [research-topic]
model: claude-sonnet-4-5-20250929
---

# Research Command

## Description
Spawn code-researcher to explore alternatives on any topic.

## Usage
/orchestr8:research "Compare X strategies for Y use case"

## Examples
- /orchestr8:research "Compare pagination strategies for 1M records"
- /orchestr8:research "Validate caching assumption for this API"
- /orchestr8:research "Compare error handling patterns"

## Output
Research findings report with recommendations
```

---

#### Task 1.3: Enhance feature-orchestrator (1 hour)

**File**: `/plugins/orchestr8/agents/orchestration/feature-orchestrator.md`

**Checklist:**
- [ ] Find "Phase 1: Analysis & Design" section
- [ ] Add new subsection "Phase 1.5: Optional Research"
- [ ] Document when to use research phase
- [ ] Show how to spawn async research tasks
- [ ] Document how research feeds into Phase 2
- [ ] Add example (feature with research)
- [ ] Document task parallelism
- [ ] Add decision framework

**Key Addition:**
```markdown
## Phase 1.5: Optional Research (Async)

Use this phase when:
- Feature involves algorithm/data structure choices
- Multiple implementation approaches possible
- Performance characteristics unknown
- Architectural assumptions need validation

## Async Research Tasks

Spawn parallel research tasks:
- code-researcher: Explore 3-5 implementation approaches
- performance-researcher: Benchmark if performance-critical
- architecture-validator: Test assumptions if present

Research runs IN PARALLEL with Phase 2 development.
Results available before Phase 3 quality gates.

## Research Integration

When research complete:
1. Compare main implementation with research findings
2. Decision: Keep main approach or adopt research suggestion?
3. Document decision and rationale
4. Store findings for future reference
5. Continue with Phase 3+ as normal

Benefit: Main development not blocked by research
```

---

#### Task 1.4: Enhance code-reviewer (1 hour)

**File**: `/plugins/orchestr8/agents/quality/code-reviewer.md`

**Checklist:**
- [ ] Find review checklist section
- [ ] Add new section "Research Recommendations"
- [ ] Document when to recommend research
- [ ] Show how to identify research opportunities
- [ ] Document output format for recommendations
- [ ] Add examples of research recommendations
- [ ] Integrate into final checklist

**Key Addition:**
```markdown
## Research Recommendations Section

For each code area, evaluate:

1. Are there multiple valid approaches?
   - If yes: Note as potential research area

2. Are there unknown performance characteristics?
   - If yes: Recommend performance research

3. Are there design assumptions?
   - If yes: Note for future assumption validation

4. Could pattern selection be improved?
   - If yes: Recommend pattern research

## Output Format

```
RESEARCH RECOMMENDATIONS:

Area: [Code area with uncertain approach]
Current: [How it's currently done]
Alternatives: [Possible alternatives]
Research Type: [code-researcher / performance-researcher / pattern-experimenter]
Expected Benefit: [What improvement might result]
Effort: [Estimated research time]
Priority: [High/Medium/Low for future work]
```

## Example

```
RESEARCH RECOMMENDED:

Area: Pagination implementation (lines 45-67)
Current: Offset/limit based pagination
Alternatives: Cursor-based, search-based
Research Type: performance-researcher
Expected Benefit: Better performance at scale (1M+ records)
Effort: 2-3 hours research
Priority: Medium (consider for v2)
```
```

---

### PHASE 2: Research Infrastructure (8 hours, MEDIUM PRIORITY)

#### Task 2.1: Create performance-researcher Agent (2 hours)

**File**: `/plugins/orchestr8/agents/research/performance-researcher.md`

**Key Sections:**
- Core responsibilities
- Algorithm comparison mode
- Optimization research mode
- Scaling research mode
- Benchmarking methodology
- Output format (metrics + recommendations)
- Examples (2-3 performance comparisons)

---

#### Task 2.2: Create assumption-validator Agent (2 hours)

**File**: `/plugins/orchestr8/agents/research/assumption-validator.md`

**Key Sections:**
- Core responsibilities
- Assumption extraction
- Proof-of-concept design
- Validation execution
- Results reporting
- Output format (validation report)
- Examples

---

#### Task 2.3: Create pattern-experimenter Agent (2 hours)

**File**: `/plugins/orchestr8/agents/research/pattern-experimenter.md`

**Key Sections:**
- Core responsibilities
- Pattern comparison mode
- Pattern applicability testing
- Evaluation criteria
- Recommendation methodology
- Output format
- Pattern library

---

#### Task 2.4: Build research findings KB structure (2 hours)

**Directory structure** to create:

```
/research-findings/
├─ pattern-comparisons/
│  ├─ README.md (index)
│  ├─ pagination-strategies.md
│  ├─ error-handling-patterns.md
│  └─ caching-strategies.md
│
├─ performance-benchmarks/
│  ├─ README.md (index)
│  ├─ database-queries.md
│  ├─ api-response-times.md
│  └─ algorithm-comparison.md
│
├─ architecture-validation/
│  ├─ README.md (index)
│  ├─ monolith-vs-microservices.md
│  ├─ scaling-assumptions.md
│  └─ performance-assumptions.md
│
└─ template.md
```

**Each document includes:**
- Topic description
- Approaches explored
- Comparison table
- Recommendation
- Rationale
- Related findings
- Date added

---

### PHASE 3: Advanced Features (7 hours, LOWER PRIORITY)

#### Task 3.1: Create /orchestr8:research-then-build Command (2 hours)

**Enhanced feature workflow with integrated research**

#### Task 3.2: Create pattern-learner Agent (2 hours)

**Extracts organizational patterns from implementations**

#### Task 3.3: Enhance architect with memory (2 hours)

**Architect queries past research findings when designing**

#### Task 3.4: Documentation & examples (1 hour)

**Best practices, integration patterns, examples**

---

## Testing Each Component

### Test code-researcher

```bash
# Test 1: Basic exploration
Input: "Compare quick sort vs merge sort for array sorting"
Expected: 
  - Both algorithms implemented
  - Performance comparison
  - Recommendation with rationale

# Test 2: With constraints
Input: "Compare caching strategies for <100ms p95 requirement"
Expected:
  - Multiple caching approaches explored
  - Performance data for each
  - Recommendation matching constraints

# Test 3: Complex scenario
Input: "Validate database architecture for 1M user scale"
Expected:
  - Multiple DB approaches tested
  - Scaling characteristics analyzed
  - Scaling recommendation with data
```

### Test /orchestr8:research command

```bash
/orchestr8:research "Compare error handling patterns"
# Expected: research findings report

/orchestr8:research "Validate assumption: Redis reduces load by 60%"
# Expected: validation report with measured impact

/orchestr8:research "Which framework: React vs Vue vs Angular?"
# Expected: framework comparison report
```

### Test feature-orchestrator enhancement

```bash
# Feature with research enabled:
/orchestr8:add-feature "Implement user pagination" --enable-research

Expected flow:
1. architect designs approach
2. code-researcher spawns (ASYNC)
3. developer implements (non-blocking)
4. Research findings received
5. Evaluation: keep or switch?
6. Integration with main development
```

---

## Success Criteria

### Phase 1 Complete When:
- [ ] code-researcher agent functional
- [ ] /orchestr8:research command works
- [ ] feature-orchestrator enhanced with research phase
- [ ] code-reviewer shows research recommendations
- [ ] First feature successfully uses research

### Phase 2 Complete When:
- [ ] All 4 research agents created (code, performance, architecture, pattern)
- [ ] Research findings KB created and populated
- [ ] Can validate any architectural decision
- [ ] Async task management proven reliable

### Phase 3 Complete When:
- [ ] /orchestr8:research-then-build command functional
- [ ] pattern-learner extracting patterns
- [ ] architect using past research findings
- [ ] Organizational knowledge base established

---

## Integration Checklist

- [ ] All new agents in `/agents/research/` and `/agents/learning/` directories
- [ ] All new commands in `/commands/` directory  
- [ ] Existing agents enhanced (not replaced)
- [ ] No breaking changes to current workflows
- [ ] Research tasks spawn as async (non-blocking)
- [ ] Research findings documented in project files
- [ ] Knowledge base queryable by other agents
- [ ] Examples added to documentation
- [ ] Best practices documented
- [ ] Team trained on new workflows

---

## Common Patterns

### Pattern: Parallel Implementation + Research

```
Task(architect.design) 
  ↓
Task(developer.implement, MAIN) + Task(code-researcher.explore, ASYNC)
  ↓
When both complete:
  if research.better_approach():
    refactor_or_plan_v2()
  else:
    proceed_to_testing()
```

### Pattern: Assumption Validation Before Commitment

```
Task(architect.design, with_assumptions)
  ↓
Task(assumption-validator.test_all_assumptions, ASYNC)
  ↓
When validated:
  if all_assumptions_valid():
    proceed_to_implementation()
  else:
    update_design(validated_assumptions)
    re-implement()
```

### Pattern: Performance-Driven Optimization

```
code-reviewer.identifies_performance_areas()
  ↓
Task(performance-researcher.benchmark, ASYNC)
  ↓
When benchmarks complete:
  create_optimization_backlog()
```

---

## Metrics to Track

### Adoption Metrics
- Number of features using research
- Average research time per feature
- Research recommendations implemented vs. ignored

### Quality Metrics
- Reduction in architectural rework
- Performance improvements (before/after research)
- Assumption validity rate

### Organizational Metrics
- Number of patterns documented
- Repeat research avoided
- Knowledge reuse frequency

---

## Quick Reference: File Locations

```
New Directories:
/agents/research/              - Core research agents
/agents/learning/              - Learning/knowledge agents  
/research-findings/            - Research knowledge base

New Agents:
/agents/research/code-researcher.md
/agents/research/performance-researcher.md
/agents/research/architecture-researcher.md
/agents/research/pattern-experimenter.md
/agents/learning/pattern-learner.md
/agents/learning/assumption-validator.md

New Commands:
/commands/research.md
/commands/research-then-build.md (Phase 3)

Enhanced Agents:
/agents/orchestration/feature-orchestrator.md (add Phase 1.5)
/agents/quality/code-reviewer.md (add research section)
/agents/development/architect.md (optional: add alternatives)
```

---

## Next Steps

1. **Week 1**: Implement Phase 1 (5 hours)
   - code-researcher agent
   - /orchestr8:research command
   - feature-orchestrator enhancement
   - code-reviewer enhancement

2. **Week 2**: Implement Phase 2 (8 hours)
   - performance-researcher agent
   - assumption-validator agent
   - pattern-experimenter agent
   - Research findings KB

3. **Week 3**: Implement Phase 3 (7 hours)
   - /orchestr8:research-then-build command
   - pattern-learner agent
   - Architect memory enhancement
   - Full documentation

4. **Week 4**: Testing & refinement
   - User feedback
   - Iteration
   - Best practices documentation

---

## Questions & Answers

**Q: Does research block main development?**
A: No. Research spawns as async tasks. Main development proceeds in parallel.

**Q: What if research findings conflict with main implementation?**
A: Three options: (1) Refactor immediately if critical, (2) Plan switch for v2, (3) Reject research and document why.

**Q: How do we avoid repeating research?**
A: Store findings in `/research-findings/` KB. Architect queries KB when designing. pattern-learner synthesizes patterns.

**Q: What's the overhead of research?**
A: Phase 1 adds 1.5 hours research time but prevents 10+ hours of rework if design is wrong. ROI positive immediately.

**Q: Can research be skipped for simple features?**
A: Yes. Research phase is optional. Useful for complex/uncertain features only.

