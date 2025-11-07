---
description: Parallel hypothesis testing workflow for exploring multiple approaches simultaneously
argument-hint: [research-question-or-problem]
model: claude-sonnet-4-5-20250929
---

# Research Workflow

Autonomous workflow for parallel hypothesis testing and multi-approach exploration with evidence-based decision making.

## Overview

This workflow enables systematic exploration of multiple hypotheses or approaches in parallel, collecting evidence, comparing results, and making data-driven decisions about the best path forward.

**Use Cases:**
- Evaluate multiple technical approaches for a problem
- Test competing hypotheses about system behavior
- Explore alternative architectural patterns
- Compare different algorithm implementations
- Validate design decisions with empirical evidence

## Workflow Phases

### Phase 1: Hypothesis Formulation (0-15%)

**Objective:** Define research question, formulate testable hypotheses, and establish success criteria.

**Tasks:**
1. **Problem Analysis**
   - Parse research question or problem statement
   - Identify constraints and requirements
   - Define scope and boundaries
   - Establish success metrics

2. **Hypothesis Generation**
   - Brainstorm 3-5 alternative approaches
   - For each hypothesis, define:
     - Core assumption or claim
     - Expected benefits
     - Potential drawbacks
     - Success criteria
     - Validation method

3. **Experiment Design**
   - Define test scenarios
   - Identify required resources
   - Establish measurement methodology
   - Create evaluation criteria
   - Design data collection strategy

**Outputs:**
- `research-plan.md` - Overall research plan
- `hypotheses/` - Directory with one file per hypothesis
  - `hypothesis-1-[name].md`
  - `hypothesis-2-[name].md`
  - `hypothesis-3-[name].md`
- `evaluation-criteria.md` - Success metrics and scoring rubric

**Example Hypotheses:**
```markdown
# Hypothesis 1: Microservices Architecture

**Claim:** Microservices architecture will provide better scalability and deployment flexibility.

**Assumptions:**
- Team can handle distributed system complexity
- Service boundaries are well-defined
- Infrastructure supports container orchestration

**Success Criteria:**
- Deployment time < 5 minutes per service
- Independent scaling of components
- Fault isolation between services
- Development team velocity maintained

**Validation Method:**
- Prototype with 3-4 core services
- Load test to measure scaling behavior
- Measure deployment complexity
- Assess team feedback
```

### Phase 2: Parallel Hypothesis Testing (15-70%)

**Objective:** Execute all hypotheses in parallel, collecting evidence and measuring outcomes.

**Execution Pattern:**
```
Main Orchestrator
  ├─→ Hypothesis 1 Agent (parallel) → Evidence 1
  ├─→ Hypothesis 2 Agent (parallel) → Evidence 2
  ├─→ Hypothesis 3 Agent (parallel) → Evidence 3
  └─→ Hypothesis 4 Agent (parallel) → Evidence 4

[All execute simultaneously in separate contexts]
```

**For Each Hypothesis:**

1. **Implementation**
   - Create proof-of-concept or prototype
   - Implement minimal viable version
   - Focus on testable aspects
   - Document assumptions made

2. **Data Collection**
   - Run defined test scenarios
   - Measure performance metrics
   - Collect qualitative observations
   - Document challenges encountered

3. **Evidence Gathering**
   - Performance benchmarks
   - Code complexity metrics
   - Resource utilization
   - Developer experience feedback
   - Scalability testing results
   - Security assessment
   - Cost analysis

4. **Documentation**
   - Implementation notes
   - Test results
   - Pros and cons observed
   - Unexpected findings
   - Edge cases discovered

**Parallel Execution Strategy:**

Each hypothesis is tested by a specialized agent in a forked context:

```bash
# Hypothesis 1: Microservices (assigned to architect)
Task: "Test microservices architecture hypothesis
- Implement 3-service prototype
- Measure deployment time, scaling, fault isolation
- Document complexity and team impact
- Output: results/hypothesis-1-microservices.md"

# Hypothesis 2: Modular Monolith (assigned to architect)
Task: "Test modular monolith hypothesis
- Implement modular structure with clear boundaries
- Measure deployment simplicity, performance
- Document complexity and maintainability
- Output: results/hypothesis-2-modular-monolith.md"

# Hypothesis 3: Serverless (assigned to cloud specialist)
Task: "Test serverless architecture hypothesis
- Implement with AWS Lambda/Azure Functions
- Measure cold start, scaling, cost
- Document deployment and debugging complexity
- Output: results/hypothesis-3-serverless.md"

# All 3 agents execute in parallel, each in their own forked context
```

**Outputs:**
- `results/hypothesis-1-[name].md` - Evidence and findings
- `results/hypothesis-2-[name].md` - Evidence and findings
- `results/hypothesis-3-[name].md` - Evidence and findings
- `prototypes/hypothesis-1/` - Prototype code (optional)
- `prototypes/hypothesis-2/` - Prototype code (optional)
- `prototypes/hypothesis-3/` - Prototype code (optional)
- `benchmarks/` - Performance data and metrics

### Phase 3: Comparative Analysis (70-85%)

**Objective:** Synthesize findings, compare hypotheses objectively, and identify the optimal approach.

**Tasks:**

1. **Data Synthesis**
   - Aggregate results from all hypotheses
   - Normalize metrics for comparison
   - Identify patterns and outliers
   - Validate data quality

2. **Comparative Evaluation**
   - Score each hypothesis against criteria
   - Create comparison matrix
   - Analyze trade-offs
   - Identify clear winners/losers

3. **Risk Assessment**
   - Identify implementation risks
   - Assess technical debt implications
   - Evaluate team capability requirements
   - Consider long-term maintainability

4. **Cost-Benefit Analysis**
   - Implementation cost
   - Operational cost
   - Performance benefits
   - Developer productivity impact
   - Time-to-market considerations

**Comparison Matrix Example:**
```markdown
| Criterion          | Weight | Microservices | Modular Monolith | Serverless |
|-------------------|--------|---------------|------------------|------------|
| Scalability       | 20%    | 9/10          | 6/10             | 10/10      |
| Deployment Speed  | 15%    | 7/10          | 9/10             | 8/10       |
| Complexity        | 20%    | 4/10          | 8/10             | 6/10       |
| Cost (ops)        | 15%    | 6/10          | 8/10             | 7/10       |
| Dev Velocity      | 15%    | 6/10          | 9/10             | 7/10       |
| Fault Isolation   | 15%    | 9/10          | 5/10             | 8/10       |
| **Weighted Score**|        | **6.8/10**    | **7.4/10**       | **7.8/10** |
```

**Outputs:**
- `analysis/comparative-analysis.md` - Detailed comparison
- `analysis/comparison-matrix.md` - Scoring matrix
- `analysis/risk-assessment.md` - Risk analysis
- `analysis/cost-benefit.md` - Financial analysis
- `visualizations/` - Charts and graphs (optional)

### Phase 4: Recommendation & Knowledge Capture (85-100%)

**Objective:** Make evidence-based recommendation and capture learnings for future use.

**Tasks:**

1. **Recommendation Formulation**
   - Identify top-ranked approach
   - Justify decision with evidence
   - Acknowledge limitations
   - Provide implementation roadmap
   - Define success metrics for rollout

2. **Alternative Scenarios**
   - When to use each approach
   - Conditions that would change recommendation
   - Hybrid approaches to consider
   - Migration paths between options

3. **Knowledge Capture**
   - Store findings in knowledge base
   - Document decision rationale
   - Capture lessons learned
   - Create reusable patterns
   - Update architectural guidelines

4. **Presentation Materials**
   - Executive summary (1 page)
   - Detailed findings report
   - Stakeholder presentation
   - Technical deep-dive documentation
   - Implementation guide

**Outputs:**
- `recommendation.md` - Final recommendation with evidence
- `executive-summary.md` - 1-page summary for stakeholders
- `implementation-roadmap.md` - Next steps and timeline
- `knowledge-base/` - Captured patterns and learnings
- `presentation/` - Stakeholder presentation materials

## Agent Coordination

### Agent Selection by Hypothesis Type

**Architecture Hypotheses:**
- Primary: `architect`
- Secondary: `fullstack-developer`, domain specialists

**Performance Hypotheses:**
- Primary: `performance-analyzer`
- Secondary: `backend-developer`, `database-specialist`

**Technology Stack Hypotheses:**
- Primary: Language/framework specialists
- Secondary: `architect`, `devops-engineer`

**Algorithm Hypotheses:**
- Primary: Domain specialists (ML, data, etc.)
- Secondary: `performance-analyzer`

**Infrastructure Hypotheses:**
- Primary: Cloud specialists (AWS, GCP, Azure)
- Secondary: `devops-engineer`, `cost-optimizer`

### Parallel Execution Pattern

```
1. Formulate 3-5 hypotheses (sequential)
2. Launch hypothesis testing in parallel:
   - Single message with 3-5 Task tool calls
   - Each agent gets focused hypothesis to test
   - Each outputs to separate files (no conflicts)
   - All execute simultaneously for maximum speed
3. Aggregate results (sequential)
4. Comparative analysis (sequential)
5. Final recommendation (sequential)
```

**Speed Advantage:**
- Sequential: 5 hypotheses × 2 hours each = 10 hours
- Parallel: 5 hypotheses in parallel = 2 hours (5x speedup)

## Success Criteria

Research is complete when:
- All hypotheses tested with empirical evidence
- Quantitative metrics collected for each approach
- Qualitative observations documented
- Comparative analysis completed objectively
- Clear recommendation made with justification
- Risks and trade-offs acknowledged
- Implementation roadmap defined
- Knowledge captured in reusable format
- Stakeholder materials prepared

## Quality Gates

### Gate 1: Hypothesis Quality
- Each hypothesis is testable
- Success criteria are measurable
- Test methodology is sound
- Validation approach is practical

### Gate 2: Evidence Quality
- Data collected systematically
- Metrics are objective and reproducible
- Sample sizes are adequate
- Edge cases considered

### Gate 3: Analysis Quality
- Comparison is fair and unbiased
- Trade-offs are honestly assessed
- Risks are identified
- Recommendation is evidence-based

## Fire-and-Forget Pattern

This workflow supports async execution for long-running research:

```bash
# Launch research in background
/orchestr8:research "Should we migrate to microservices or keep modular monolith?"

# Workflow runs autonomously:
# - Formulates hypotheses
# - Tests in parallel
# - Analyzes results
# - Generates recommendation

# Returns when complete with summary and detailed reports
```

## Example Usage

### Example 1: Architecture Decision
```
/orchestr8:research "What's the best architecture for our e-commerce platform: microservices, modular monolith, or serverless?"

Hypotheses Generated:
1. Microservices with Kubernetes
2. Modular monolith with domain modules
3. Serverless with AWS Lambda
4. Hybrid: Monolith + selective microservices

Tests Each Approach:
- Prototype implementation
- Load testing (10k concurrent users)
- Deployment complexity
- Development velocity
- Cost analysis

Recommendation: Modular monolith with migration path
Rationale: Lower complexity, faster development, easier to start, can extract services later
Evidence: 7.4/10 score vs 6.8 (microservices) and 7.1 (serverless)
```

### Example 2: Database Selection
```
/orchestr8:research "Which database should we use: PostgreSQL, MongoDB, or DynamoDB?"

Hypotheses Generated:
1. PostgreSQL with JSONB for flexibility
2. MongoDB for document model
3. DynamoDB for serverless scaling
4. Multi-database: PostgreSQL + Redis

Tests Each Approach:
- Schema design for use case
- Query performance benchmarks
- Write throughput testing
- Cost at scale
- Developer experience

Recommendation: PostgreSQL with JSONB
Rationale: Best query flexibility, ACID guarantees, cost-effective, team expertise
Evidence: Handles required queries 3x faster, 40% lower cost than DynamoDB
```

### Example 3: Frontend Framework
```
/orchestr8:research "Should we use React, Vue, or Svelte for our new dashboard?"

Hypotheses Generated:
1. React with Next.js
2. Vue 3 with Nuxt
3. Svelte with SvelteKit
4. Solid.js for performance

Tests Each Approach:
- Build sample dashboard
- Bundle size comparison
- Runtime performance
- Developer experience
- Ecosystem maturity

Recommendation: React with Next.js
Rationale: Largest talent pool, mature ecosystem, good performance, team familiarity
Evidence: 10% larger bundle but 3x more libraries available, easier hiring
```

## Best Practices

### DO
- Formulate 3-5 testable hypotheses
- Define clear, measurable success criteria
- Execute hypothesis testing in parallel
- Collect both quantitative and qualitative data
- Compare approaches objectively with evidence
- Document assumptions and limitations
- Capture learnings in knowledge base
- Present findings to stakeholders
- Acknowledge trade-offs honestly

### DON'T
- Start with predetermined conclusion
- Test only one approach
- Use subjective criteria without data
- Ignore negative findings
- Skip risk assessment
- Forget to capture knowledge
- Make recommendations without evidence
- Oversimplify trade-offs

## Integration with Knowledge Base

All research findings are automatically stored for future reference:

```bash
# Store research patterns
db_store_knowledge "research" "architecture-decision" "$PROBLEM_DOMAIN" \
  "Research findings for $RESEARCH_QUESTION" \
  "$(cat recommendation.md)"

# Store successful approaches
db_store_knowledge "research" "validated-approach" "$HYPOTHESIS_NAME" \
  "Validated approach with evidence: $EVIDENCE_SUMMARY" \
  "$(cat results/winning-hypothesis.md)"

# Query similar past research
db_query_knowledge "research" "$PROBLEM_DOMAIN" 10
```

## Notes

- Research is time-boxed: typically 2-4 hours for complete workflow
- Hypothesis testing is embarrassingly parallel: maximum speedup opportunity
- Focus on evidence over opinion
- Prototypes can be minimal: just enough to test hypothesis
- Not all hypotheses need code: some can be analyzed theoretically
- Results inform future architectural decision records (ADRs)
- Knowledge capture ensures findings are reusable across projects
- Fire-and-forget execution allows long-running research without blocking

**Remember:** The goal is not to be right, but to find the truth through systematic exploration and evidence-based decision making.
