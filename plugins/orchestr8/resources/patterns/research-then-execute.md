---
id: research-then-execute-pattern
category: pattern
tags: [workflow, research, planning, execution, knowledge-building, meta]
capabilities:
  - Research-driven development workflow
  - Knowledge gathering before implementation
  - Risk reduction through upfront research
  - Informed decision making pattern
useWhen:
  - Unfamiliar technology stacks requiring upfront research of best practices, architectural patterns, and common pitfalls before implementation
  - High-risk implementations with compliance, security, or scalability constraints demanding thorough design validation upfront
  - Multiple viable architectural approaches requiring systematic evaluation with trade-off analysis before commitment
  - Complex integration scenarios needing API research, third-party service evaluation, and compatibility validation
  - Knowledge-building initiatives requiring documented research findings and extracted learnings as reusable fragments
  - Greenfield projects where technology selection and architecture design require informed decision-making
estimatedTokens: 620
---

# Research → Execute Pattern

Systematic workflow pattern that prioritizes knowledge gathering and planning before implementation, reducing risk and improving solution quality.

## Pattern Structure

```markdown
Phase 1: Research & Requirements (0-20%)
↓
Phase 2: Design & Planning (20-35%)
↓
Phase 3: Implementation (35-90%)
↓
Phase 4: Validation & Knowledge Extraction (90-100%)
```

## Phase Breakdown

### Phase 1: Research & Requirements (0-20%)

**Goal:** Build knowledge and extract clear requirements before any coding.

**Activities:**
```markdown
1. Requirement Analysis
   - Extract core objectives from user request
   - Identify explicit and implicit constraints
   - Determine success criteria

2. Domain Research (if unfamiliar)
   - WebSearch for current best practices (2024-2025)
   - Review technology documentation
   - Identify common pitfalls
   - Research security considerations

3. Technology Evaluation (if multiple options)
   - Compare alternatives
   - Evaluate trade-offs
   - Use AskUserQuestion for major decisions
   - Recommend approach with rationale

4. Resource Identification
   - What agents/skills/patterns exist?
   - What gaps need new fragments?
   - What examples would help?
```

**JIT Loading:**
```markdown
**→ Research Expertise:**
orchestr8://agents/match?query=research+${domain}+requirements&mode=index&maxResults=5

**→ Research Skills:**
orchestr8://skills/match?query=domain+research+requirement+analysis&mode=index&maxResults=3
```

**Output:**
```markdown
- Clear requirement document
- Technology stack selection
- Architecture recommendation
- Risk assessment
- Resource plan for next phases
```

### Phase 2: Design & Planning (20-35%)

**Goal:** Create detailed design based on Phase 1 findings.

**Activities:**
```markdown
1. Architecture Design
   - Apply chosen architectural pattern
   - Define component structure
   - Plan data models
   - Identify integration points

2. Execution Strategy
   - Identify independent workstreams
   - Plan for parallel execution if applicable
   - Define phase boundaries
   - Set integration checkpoints

3. Risk Mitigation Planning
   - Address risks identified in Phase 1
   - Plan error handling approach
   - Define testing strategy
   - Security implementation plan
```

**JIT Loading:**
```markdown
**→ Domain Experts (based on Phase 1 findings):**
orchestr8://agents/match?query=${tech-stack}+${domain}&mode=index&maxResults=8

**→ Architectural Patterns:**
orchestr8://patterns/match?query=${architecture-style}+${domain}&mode=index&maxResults=5
```

**Output:**
```markdown
- Detailed architecture design
- Component diagrams (textual)
- Execution plan with phases
- Integration strategy
- Test plan outline
```

### Phase 3: Implementation (35-90%)

**Goal:** Execute the design with informed decisions and parallel execution where applicable.

**Sub-pattern: Sequential Implementation**
```markdown
When components have dependencies:

Phase 3a: Core Infrastructure (35-55%)
- Database schema
- Core models
- Base services

Phase 3b: Feature Implementation (55-80%)
- Business logic
- API endpoints
- Integrations

Phase 3c: Testing & Error Handling (80-90%)
- Unit tests
- Integration tests
- Error handling
- Logging
```

**Sub-pattern: Parallel Implementation**
```markdown
When components are independent:

Phase 3: Parallel Tracks (35-90%)

Launch ALL subagents in SINGLE message:

Track A: Backend API
- API endpoints
- Business logic
- Database integration

Track B: Frontend (if applicable)
- UI components
- State management
- API integration

Track C: Testing & CI/CD
- Test suites
- CI/CD pipeline
- Deployment config

Track D: Documentation
- API docs
- README
- Architecture docs
```

**JIT Loading:**
```markdown
**→ Implementation Expertise:**
orchestr8://match?query=${tech}+${features}+${architecture}&categories=agent,skill,example&mode=index&maxResults=10

**→ Testing Skills:**
orchestr8://skills/match?query=testing+${tech}+${test-types}&mode=index&maxResults=5
```

**Output:**
```markdown
- Working implementation
- Tests passing (>80% coverage)
- Error handling in place
- Code documented
```

### Phase 4: Validation & Knowledge Extraction (90-100%)

**Goal:** Validate solution and extract learnings for future use.

**Activities:**
```markdown
1. Validation
   - End-to-end testing
   - Verify all success criteria met
   - Performance validation
   - Security review

2. Knowledge Extraction (Self-Improvement Loop)
   - Identify reusable techniques → Create skill fragments
   - Capture domain expertise → Create agent fragments
   - Document patterns used → Create pattern fragments
   - Save code examples → Create example fragments

3. Optimization
   - Metadata optimization for new fragments
   - Test discoverability
   - Integration into resource library

4. Documentation
   - Update project docs
   - Document decisions and rationale
   - Create runbook if needed
```

**JIT Loading:**
```markdown
**→ Validation Skills:**
orchestr8://skills/match?query=testing+validation+${domain}&mode=index&maxResults=3

**→ Meta-Skills for Knowledge Extraction:**
orchestr8://skills/match?query=fragment+design+optimization&mode=index&maxResults=3
```

**Output:**
```markdown
- Validated, working solution
- New fragments added to library
- Complete documentation
- Learnings documented for future projects
```

## Workflow Template

```markdown
---
name: research-execute-workflow
title: Research → Execute Workflow
description: Research-driven development with knowledge extraction
version: 1.0.0
arguments:
  - name: task-description
    description: What to build or accomplish
    required: true
  - name: domain
    description: Domain or technology area
    required: false
---

# Research → Execute: ${task-description}

**Task:** ${task-description}
**Domain:** ${domain}

## Phase 1: Research & Requirements (0-20%)

**→ Research Expertise:**
orchestr8://match?query=research+requirements+${domain}&categories=agent,skill&mode=index&maxResults=5

**Activities:**
1. Extract requirements from task description
2. Research ${domain} best practices (WebSearch if unfamiliar)
3. Evaluate technology options
4. Identify risks and constraints
5. Create requirement document

**Success Criteria:**
✅ Clear requirements documented
✅ Technology stack selected
✅ Risks identified
✅ Success criteria defined

## Phase 2: Design & Planning (20-35%)

**→ Domain Expertise:**
orchestr8://match?query=${tech-stack}+${architecture}+${domain}&categories=agent,pattern&mode=index&maxResults=8

**Activities:**
1. Design architecture based on Phase 1 findings
2. Plan component structure
3. Define execution strategy (sequential vs parallel)
4. Plan integration and testing approach

**Success Criteria:**
✅ Architecture designed
✅ Execution plan created
✅ Integration strategy defined

## Phase 3: Implementation (35-90%)

**→ Implementation Expertise:**
orchestr8://match?query=${tech}+${features}&categories=agent,skill,example&mode=index&maxResults=10

**Activities:**
If parallel possible:
- Launch subagents for independent tracks
If sequential required:
- Implement in dependency order

**Success Criteria:**
✅ Implementation complete
✅ Tests passing (>80% coverage)
✅ Error handling in place

## Phase 4: Validation & Knowledge Extraction (90-100%)

**→ Validation & Meta-Skills:**
orchestr8://match?query=validation+fragment+design&categories=skill&mode=index&maxResults=5

**Activities:**
1. End-to-end validation
2. Extract learnings as new fragments
3. Optimize fragment metadata
4. Update documentation

**Success Criteria:**
✅ All requirements met
✅ New fragments created
✅ Documentation complete
```

## When to Use This Pattern

**Ideal for:**
```markdown
✅ Unfamiliar technologies or domains
✅ High-risk or high-complexity projects
✅ Multiple valid architectural approaches
✅ Need to evaluate technology options
✅ Building foundation for future work
✅ Compliance or security-critical implementations
```

**Not ideal for:**
```markdown
❌ Simple, well-understood tasks
❌ Tight deadlines with no time for research
❌ Maintenance of existing, familiar codebases
❌ Trivial features or bug fixes
```

## Benefits

✅ **Risk Reduction** - Identify issues before coding
✅ **Informed Decisions** - Choose best approach based on research
✅ **Knowledge Building** - Create reusable fragments from learnings
✅ **Quality** - Design before implementation leads to better architecture
✅ **Efficiency** - Less rework from poor initial choices
✅ **Scalability** - Research phase identifies scalability needs upfront

## Trade-offs

**Advantages:**
- Higher quality solutions
- Better architectural decisions
- Reduced rework
- Knowledge accumulation

**Disadvantages:**
- Slower initial progress (20-35% before coding)
- Requires discipline to research first
- May over-engineer simple problems

## Integration with Other Patterns

**Combine with Autonomous Parallel:**
```markdown
Phase 1-2: Research → Execute (research and design)
Phase 3: Autonomous Parallel (parallel implementation)
Phase 4: Research → Execute (validation and knowledge extraction)
```

**Combine with Phased Delivery:**
```markdown
Phase 1: Research → Execute (research)
Phase 2: Phased Delivery MVP (quick first version)
Phase 3: Research → Execute (validate, extract learnings)
Phase 4: Phased Delivery Enhancements (incremental improvements)
```

## Best Practices

✅ **Time-box research** - Don't over-research (max 20% of effort)
✅ **Document findings** - Create clear requirement/design docs
✅ **Use WebSearch** - Get current best practices (2024-2025)
✅ **Ask when needed** - Use AskUserQuestion for major decisions
✅ **Extract knowledge** - Always create fragments from learnings
✅ **Validate thoroughly** - End-to-end validation before completion

❌ **Don't skip research** - Jumping to code increases rework risk
❌ **Don't research forever** - Set time limits
❌ **Don't ignore findings** - Act on research insights
❌ **Don't forget extraction** - Capture learnings for future use
