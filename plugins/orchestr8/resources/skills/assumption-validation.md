---
id: assumption-validation
category: skill
tags: [research, assumptions, validation, poc, proof-of-concept, hypothesis-testing, risk-mitigation]
capabilities:
  - Transforming vague beliefs into testable hypotheses with measurable criteria
  - Designing minimal POCs that test assumptions rigorously
  - Rigorous performance benchmarking and statistical validation
  - Confidence scoring (0-100) based on data quality and methodology
  - Risk mitigation planning with go/no-go checkpoints
estimatedTokens: 350
useWhen:
  - Testing architectural assumptions before major decisions requiring transformation of beliefs into testable hypotheses with specific metrics, success criteria, and validation methods
  - Validating performance claims for critical systems through proof-of-concept implementations with vertical slice, horizontal spike, isolated experiment, or comparative POC patterns
  - De-risking technology migrations by building minimal POCs (1-2 weeks maximum) that test critical path, measure rigorously, and validate assumptions with statistical significance
  - Proving feasibility of novel approaches through systematic assumption validation covering performance, scalability, compatibility, feasibility, security, cost, usability, and reliability
  - Building confidence before large investments using evidence-based decision-making with confidence scores (0-100) calculated from data quality, sample size, methodology, consistency, and expertise
  - Creating risk mitigation plans with identified risks, mitigation strategies, success criteria, rollback procedures, monitoring plans, and go/no-go checkpoints for major technology adoption
---

# Assumption Validation Skill

Expert knowledge in systematic assumption validation through proof-of-concept implementations, hypothesis-driven testing, confidence scoring, and risk mitigation for major technical decisions.

## When to Use This Skill

**Use assumption-validation for:**
- Testing architectural assumptions before major decisions
- Validating performance claims for critical systems
- De-risking technology migrations
- Proving feasibility of novel approaches
- Challenging conventional wisdom with evidence
- Reducing uncertainty in high-stakes decisions
- Building confidence before large investments
- Testing integration compatibility assumptions

**Less critical for:**
- Well-established patterns with proven track records
- Low-risk, easily reversible decisions
- When assumptions have already been validated
- Trivial technology choices

## Core Validation Methodology

### Phase 1: Assumption Identification & Formulation

**Objective**: Transform vague beliefs into testable hypotheses.

**From Belief to Hypothesis:**

```markdown
# Bad (Vague Assumption)
"GraphQL will be faster than REST"

# Good (Testable Hypothesis)
**Hypothesis**: GraphQL will reduce data transfer by >40% and response time by >30%
for our product catalog API compared to our current REST implementation, when
serving mobile clients fetching product lists with reviews.

**Assumptions:**
1. Mobile clients typically need only 5 of 20+ product fields
2. Current REST API requires 3 separate calls (products, reviews, inventory)
3. GraphQL can combine into single query
4. Network latency is primary bottleneck (not server processing)
5. 40% data reduction threshold justifies GraphQL complexity

**Success Criteria:**
- ✅ Data payload reduced by ≥40% (measured in KB)
- ✅ Response time reduced by ≥30% (p95 latency)
- ✅ Single GraphQL query replaces ≥2 REST calls
- ✅ Server CPU increase <20% (acceptable trade-off)
- ✅ Client-side complexity increase acceptable to mobile team

**Failure Criteria:**
- ❌ Data reduction <25% (insufficient benefit)
- ❌ Response time improvement <15% (not worth it)
- ❌ Server CPU increase >50% (infrastructure cost too high)
- ❌ GraphQL query complexity makes client code worse
```

**Assumption Template:**

```markdown
# Assumption: [Clear statement of what we believe]

## Context
**Decision**: [What decision depends on this assumption?]
**Stakes**: [What happens if assumption is wrong?]
**Current Confidence**: [0-100%]
**Risk Level**: [Low | Medium | High | Critical]

## Hypothesis
**We believe that**: [Specific, measurable claim]
**Will result in**: [Expected outcome with metrics]
**When**: [Under what conditions]
**Because**: [Underlying reasoning]

## Testable Predictions
1. [Specific prediction 1 with metric]
2. [Specific prediction 2 with metric]
3. [Specific prediction 3 with metric]

## Success Criteria
- ✅ [Measurable criterion 1]
- ✅ [Measurable criterion 2]
- ✅ [Measurable criterion 3]

## Failure Criteria
- ❌ [What would invalidate assumption 1]
- ❌ [What would invalidate assumption 2]
- ❌ [What would invalidate assumption 3]

## Validation Method
[How we'll test this - POC, benchmark, prototype, etc.]

## Effort Estimate
- **POC Development**: [hours/days]
- **Testing & Measurement**: [hours/days]
- **Analysis**: [hours/days]
- **Total**: [hours/days]

## Decision Impact
- **If Validated**: [What we'll do]
- **If Invalidated**: [What we'll do instead]
- **If Inconclusive**: [How we'll proceed]
```

### Phase 2: Proof of Concept Design

**Objective**: Design minimal POC that tests assumptions rigorously.

**POC Design Patterns:**

**Pattern 1: Vertical Slice**
```markdown
## Vertical Slice POC

**Goal**: Test assumption end-to-end with minimal scope

**Approach**:
- One complete user flow (e.g., "Add to cart")
- All layers (UI → API → Database)
- Real integration (no mocks for what we're testing)
- Minimal features (just enough to test assumption)

**Example**: Testing "Serverless can handle our checkout flow"
- ✅ Include: Complete checkout flow, payment integration, order creation
- ❌ Exclude: Product catalog, user management, admin panel

**Effort**: 3-5 days
**Confidence Gain**: High (tests real integration)
```

**Pattern 2: Horizontal Spike**
```markdown
## Horizontal Spike POC

**Goal**: Test assumption across multiple components at surface level

**Approach**:
- Touch many components
- Shallow implementation
- Focus on integration points
- Mock liberally

**Example**: Testing "Microservices architecture will improve our deploy speed"
- ✅ Include: Split 3 services, separate deploys, API gateway
- ❌ Exclude: Full feature implementation, complete data model

**Effort**: 2-3 days
**Confidence Gain**: Medium (integration tested, not depth)
```

**Pattern 3: Isolated Experiment**
```markdown
## Isolated Experiment POC

**Goal**: Test specific technical claim in isolation

**Approach**:
- Isolated environment
- Controlled conditions
- Measure specific metric
- No dependencies

**Example**: Testing "Redis caching will reduce DB load by 70%"
- ✅ Include: Redis cache layer, load testing, metrics
- ❌ Exclude: Full application, UI, authentication

**Effort**: 1-2 days
**Confidence Gain**: High (for specific claim), Low (for overall system)
```

**Pattern 4: Comparative POC**
```markdown
## Comparative POC

**Goal**: Test assumption by comparing alternatives

**Approach**:
- Implement 2-3 alternatives
- Same feature/scenario
- Measure differences
- Side-by-side comparison

**Example**: Testing "PostgreSQL is better than MongoDB for our use case"
- ✅ Include: Both databases, same queries, load testing
- ❌ Exclude: Full schema, all features

**Effort**: 4-6 days
**Confidence Gain**: Very High (relative comparison validates choice)
```

### Phase 3: Rapid POC Implementation

**Objective**: Build and test POC as quickly as possible while maintaining rigor.

**Speed Optimization Techniques:**

```markdown
## Speed vs. Rigor Trade-offs

### High-Speed POC (1-2 days)
✅ **Do:**
- Use scaffolding tools (create-react-app, etc.)
- Copy-paste boilerplate liberally
- Mock non-critical dependencies
- Use simple, obvious implementations
- Skip documentation (temporary)
- Skip tests (only for non-critical parts)
- Hardcode configuration
- Use in-memory databases

❌ **Don't:**
- Skip measuring the actual hypothesis
- Mock what you're trying to test
- Use unrealistic data
- Skip the critical path
- Ignore integration points
```

**Critical Path Focus:**

```markdown
## Example: Testing "Event-Driven Architecture will reduce coupling"

### Critical Path (Must Implement)
1. ✅ Event Bus (Redis/RabbitMQ/EventBridge)
2. ✅ 3 Sample Services (Producer, Consumer 1, Consumer 2)
3. ✅ Event Publishing
4. ✅ Event Consumption
5. ✅ Measure: Coupling metrics, deploy independence

### Nice-to-Have (Skip in POC)
6. ❌ Event Schema Registry (hardcode schemas)
7. ❌ Event Replay (not testing this)
8. ❌ Dead Letter Queue (out of scope)
9. ❌ Monitoring Dashboard (manual metrics ok)
10. ❌ Event Versioning (assume v1 only)

**Result**: 3-day POC instead of 2-week implementation
```

### Phase 4: Measurement & Data Collection

**Objective**: Collect rigorous data to validate or invalidate hypothesis.

**Performance Measurement Plan:**

Design comprehensive measurement plans covering:
- **Metrics**: Define what to measure (latency, throughput, resource usage)
- **Methodology**: Environment, data size, duration, iterations, warmup
- **Thresholds**: Success criteria with operators and required vs optional
- **Statistics**: Sample size, confidence level, margin of error

For complete measurement plan structure and TypeScript implementation:
→ `orchestr8://examples/skills/assumption-validation-measurement-plan`

### Phase 5: Confidence Scoring

**Objective**: Quantify confidence in assumption validation with rigorous scoring.

**Confidence Scoring Framework:**

Multi-dimensional scoring system calculating confidence (0-100) across:
- **Data Quality** (25%): Realistic data, complete scenarios, measurement accuracy
- **Sample Size** (20%): Sufficient samples, statistical validity
- **Methodology** (25%): Controlled environment, repeatability, isolation
- **Consistency** (15%): Low variance, few outliers, reproducibility
- **Expertise** (15%): Team experience, expert review, research

**Recommendations:**
- ≥85: High confidence → Proceed with adoption
- 70-84: Moderate confidence → Pilot with monitoring
- 50-69: Low confidence → Extended validation needed
- <50: Insufficient data → More testing required

For complete TypeScript implementation with all calculation functions:
→ `orchestr8://examples/skills/assumption-validation-confidence-scoring`

**Confidence Score Report Example:**

```markdown
# Assumption Validation Report
## GraphQL Performance vs REST

**Overall Confidence**: 87/100 (High Confidence)

### Dimension Scores

| Dimension | Score | Assessment |
|-----------|-------|------------|
| **Data Quality** | 92/100 | ✅ Excellent - Production data, all scenarios |
| **Sample Size** | 85/100 | ✅ Good - 100k requests, statistically significant |
| **Methodology** | 88/100 | ✅ Excellent - Controlled, repeatable, isolated |
| **Consistency** | 82/100 | ✅ Good - Low variance, reproducible |
| **Expertise** | 78/100 | ✅ Good - Experienced team, expert reviewed |

### Validation Results

**Hypothesis**: GraphQL will reduce data transfer by >40% and response time by >30%

| Metric | Baseline (REST) | Candidate (GraphQL) | Improvement | Threshold | Result |
|--------|----------------|---------------------|-------------|-----------|--------|
| **Data Transfer** | 124 KB | 68 KB | -45.2% | -40% | ✅ PASS |
| **Response Time (p95)** | 285 ms | 187 ms | -34.4% | -30% | ✅ PASS |
| **API Calls** | 3.2 avg | 1.0 avg | -68.8% | N/A | ✅ Better |
| **Server CPU** | 42% | 51% | +21.4% | <20% | ✅ PASS |

**Statistical Significance**: p < 0.001 (highly significant)

### Confidence Factors

**Positive Factors (+confidence)**:
- ✅ Used production data (realistic workload)
- ✅ Large sample size (100,000 requests)
- ✅ Controlled environment (isolated variables)
- ✅ Multiple runs (consistent results)
- ✅ Statistical significance (p < 0.001)
- ✅ Expert validation (reviewed by performance team)
- ✅ All success criteria met
- ✅ Results align with industry benchmarks

**Negative Factors (-confidence)**:
- ⚠️ POC environment not identical to production
- ⚠️ Limited to mobile client use case (not tested desktop)
- ⚠️ Only tested read operations (not writes)
- ⚠️ Team has limited GraphQL production experience

**Remaining Assumptions**:
1. Production hardware will yield similar improvements
2. Desktop clients will see similar benefits
3. Write operations won't negate performance gains
4. Team can maintain GraphQL expertise long-term
5. GraphQL ecosystem will remain stable

### Recommendation

**Status**: VALIDATED with High Confidence (87/100)

**Decision**: ✅ **Proceed with GraphQL adoption** for mobile API

**Next Steps**:
1. Pilot GraphQL for mobile API (2 sprints)
2. Validate remaining assumptions (desktop, writes)
3. Build team GraphQL expertise (training)
4. Establish monitoring and alerting
5. Plan gradual migration (6-month timeline)

**Risk Mitigation**:
- Run parallel REST + GraphQL for 3 months
- Monitor production metrics closely
- Establish rollback plan
- Invest in team training
- Regular performance reviews

**Confidence Level**: We are **highly confident** (87/100) that GraphQL will
deliver the expected performance improvements for our mobile API use case,
based on rigorous testing with production data and statistically significant
results. Some production unknowns remain but are manageable with proper
monitoring and gradual rollout.
```

### Phase 6: Decision & Risk Mitigation

**Objective**: Make evidence-based decision with clear risk mitigation plan.

**Decision Framework:**

```markdown
# Decision Matrix

## Assumption Validation Summary

| Hypothesis | Confidence | Result | Decision |
|------------|-----------|--------|----------|
| GraphQL performance | 87/100 | ✅ Validated | Proceed |
| Team can learn GraphQL | 72/100 | ⚠️ Moderate | Proceed with training |
| GraphQL scales to 10k RPS | 65/100 | ⚠️ Uncertain | Pilot first |
| GraphQL reduces complexity | 45/100 | ❌ Invalidated | Reconsider |

## Decision Tree

```
IF all critical assumptions validated (confidence >80%)
  AND no showstoppers discovered
  THEN: ✅ PROCEED with full adoption

ELSE IF most assumptions validated (confidence 60-80%)
  AND benefits outweigh risks
  THEN: ⚠️ PROCEED with PILOT (limited scope, close monitoring)

ELSE IF assumptions inconclusive (confidence 40-60%)
  OR benefits unclear
  THEN: ⚠️ EXTEND validation (more testing needed)

ELSE IF assumptions invalidated (confidence <40%)
  OR showstoppers discovered
  THEN: ❌ ABANDON or REVISIT approach
```

## Our Decision: PROCEED WITH PILOT

**Rationale**:
- ✅ Core performance assumption validated (87% confidence)
- ⚠️ Team capability moderate confidence (72%)
- ⚠️ Scale assumption needs production validation (65%)
- ❌ Complexity assumption invalidated but acceptable trade-off

**Approach**: Gradual adoption with risk mitigation
```

## Validation Workflows

### Workflow 1: Rapid Assumption Check (1-3 days)

**Goal**: Quickly validate or invalidate critical assumption.

**Steps:**
1. **Formulate Hypothesis** (2 hours)
   - Clear, testable claim
   - Success/failure criteria
   - Measurement approach

2. **Build Minimal POC** (1-2 days)
   - Bare minimum to test hypothesis
   - Focus on critical path only
   - Skip non-essentials

3. **Measure & Decide** (4 hours)
   - Collect data
   - Compare to thresholds
   - Clear yes/no decision

**Total Time**: ~60 minutes
**Use For**: Time-sensitive decisions, low-complexity assumptions

### Workflow 2: Comprehensive Validation (1-2 weeks)

**Goal**: Thoroughly validate high-stakes assumption with high confidence.

**Steps:**
1. **Assumption Analysis** (1 day)
   - Identify all assumptions
   - Formulate testable hypotheses
   - Design validation approach
   - Stakeholder alignment

2. **POC Development** (3-5 days)
   - Production-quality POC
   - Realistic data and scenarios
   - Comprehensive measurement
   - Multiple alternatives if comparing

3. **Testing & Measurement** (2-3 days)
   - Load testing
   - Performance profiling
   - Integration testing
   - Edge case validation

4. **Analysis & Confidence Scoring** (1-2 days)
   - Statistical analysis
   - Confidence scoring
   - Risk identification
   - Mitigation planning

5. **Decision & Planning** (1 day)
   - Evidence-based recommendation
   - Risk mitigation plan
   - Rollout strategy
   - Monitoring plan

**Total Time**: ~1-2 weeks
**Use For**: Major technology decisions, architectural changes, migrations

## Best Practices

### DO ✅

**Assumption Formulation:**
- Make assumptions explicit and testable
- Quantify with specific metrics and thresholds
- Separate assumptions from facts
- Prioritize by risk and impact
- Get stakeholder alignment on assumptions
- Document underlying reasoning
- Challenge conventional wisdom
- Consider multiple alternatives

**POC Development:**
- Focus on critical path only
- Use realistic data and scenarios
- Measure what you're actually testing
- Don't mock what you're validating
- Build just enough to test hypothesis
- Iterate quickly, fail fast
- Document limitations clearly
- Share progress early and often

**Measurement:**
- Use statistical rigor (significance testing)
- Collect sufficient sample size
- Control for confounding variables
- Measure multiple times for consistency
- Use production-like environments
- Automate measurement collection
- Visualize results clearly
- Compare to baseline or alternatives

**Decision Making:**
- Let evidence guide decision, not bias
- Quantify confidence explicitly
- Identify remaining risks and assumptions
- Plan mitigation for identified risks
- Establish clear go/no-go criteria
- Build in checkpoints for reassessment
- Prepare rollback plans
- Document decision rationale

### DON'T ❌

**Assumption Formulation:**
- Don't assume without validating
- Don't make untestable claims
- Don't skip risk assessment
- Don't ignore stakeholder concerns
- Don't confuse assumptions with requirements
- Don't treat opinions as facts
- Don't validate only happy path
- Don't forget edge cases

**POC Development:**
- Don't build production-ready code unnecessarily
- Don't test multiple assumptions in one POC
- Don't skip measurement instrumentation
- Don't optimize prematurely
- Don't let scope creep derail timeline
- Don't forget about the hypothesis
- Don't build what you can validate otherwise
- Don't spend weeks on days-long POC

**Measurement:**
- Don't cherry-pick favorable results
- Don't skip statistical validation
- Don't test on toy data
- Don't measure only once
- Don't ignore outliers without investigation
- Don't forget to measure baseline
- Don't conflate correlation with causation
- Don't trust measurements from biased environment

**Decision Making:**
- Don't ignore evidence that contradicts belief
- Don't make decision before validation complete
- Don't skip risk mitigation planning
- Don't forget to monitor post-decision
- Don't treat inconclusive as validation
- Don't commit without rollback plan
- Don't ignore team concerns
- Don't forget to validate assumptions in production

## Remember

1. **Make Assumptions Explicit**: What you believe should be testable and measurable
2. **Build Minimal POCs**: Test hypothesis with least effort, maximum rigor
3. **Measure Rigorously**: Statistical significance, sufficient sample size, controlled conditions
4. **Quantify Confidence**: Explicit confidence scores based on data quality and methodology
5. **Plan for Risk**: Even validated assumptions have remaining risks - mitigate them
6. **Validate in Production**: POC validation is not final - monitor in production
7. **Iterate and Learn**: Invalidation is valuable - it prevents costly mistakes
8. **Document Everything**: Future you (and your team) will thank you

Assumption validation transforms risky bets into evidence-based decisions, replacing hope with confidence and reducing the cost of being wrong by catching bad assumptions before they become expensive production problems.
