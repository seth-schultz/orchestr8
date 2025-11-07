---
name: assumption-validation
description: Expert at testing architectural assumptions through proof-of-concepts, transforming beliefs into testable hypotheses, delivering confidence-scored validation results, and de-risking major technical decisions. Activate when validating architectural decisions, testing assumptions, or reducing technical risk.
---

# Assumption Validation Skill

Expert knowledge in systematic assumption validation through proof-of-concept implementations, hypothesis-driven testing, confidence scoring, and risk mitigation for major technical decisions.


## Documentation Output Locations

This skill generates outputs in the following `.orchestr8/docs/` locations:

- **Assumption validation reports**: `.orchestr8/docs/research/assumptions/`
- **POC documentation**: `.orchestr8/docs/research/poc/`

### Output Naming Convention
All outputs follow the pattern: `[type]-[name]-YYYY-MM-DD.md`

Example outputs:
- `.orchestr8/docs/research/assumptions/validation-microservices-2025-01-15.md`
- `.orchestr8/docs/research/poc/poc-event-sourcing-2025-01-15.md`
- `.orchestr8/docs/patterns/library/pattern-factory-2025-01-15.md`

## When to Use This Skill

**Use assumption-validation for:**
- ✅ Testing architectural assumptions before major decisions
- ✅ Validating performance claims for critical systems
- ✅ De-risking technology migrations
- ✅ Proving feasibility of novel approaches
- ✅ Challenging conventional wisdom with evidence
- ✅ Reducing uncertainty in high-stakes decisions
- ✅ Building confidence before large investments
- ✅ Testing integration compatibility assumptions

**Less critical for:**
- ❌ Well-established patterns with proven track records
- ❌ Low-risk, easily reversible decisions
- ❌ When assumptions have already been validated
- ❌ Trivial technology choices

## Core Validation Methodology

### Phase 1: Assumption Identification & Formulation

**Objective**: Transform vague beliefs into testable hypotheses.

**Assumption Categories:**

```typescript
interface AssumptionCategory {
  type: 'performance' | 'scalability' | 'compatibility' | 'feasibility' |
        'security' | 'cost' | 'usability' | 'reliability';
  risk: 'low' | 'medium' | 'high' | 'critical';
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100 (current confidence level)
}
```

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

**Expected Outputs:**
- List of critical assumptions
- Testable hypotheses for each
- Risk/impact matrix
- Prioritized validation plan

### Phase 2: Proof of Concept Design

**Objective**: Design minimal POC that tests assumptions rigorously.

**POC Scoping Framework:**

```typescript
interface POCScope {
  // What to include
  include: {
    criticalPath: string[];      // Must test these flows
    riskAreas: string[];          // High-risk components
    integrations: string[];       // Key integration points
    edgeCases: string[];          // Important edge cases
  };

  // What to exclude
  exclude: {
    ui: boolean;                  // Skip UI unless testing UX assumption
    authentication: boolean;      // Skip unless testing auth assumption
    errorHandling: boolean;       // Basic only, not comprehensive
    optimization: boolean;        // No premature optimization
    scalability: boolean;         // Unless testing scale assumption
  };

  // Quality bar
  quality: {
    production: boolean;          // Production-ready code?
    tests: 'none' | 'basic' | 'comprehensive';
    documentation: 'minimal' | 'standard' | 'comprehensive';
    codeReview: boolean;
  };

  // Timeline
  timeline: {
    duration: number;             // Hours or days
    checkpoint: number;           // When to assess progress
    deadline: Date;               // Hard deadline
  };
}
```

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

**POC Requirements Document:**

```markdown
# POC: [Assumption Being Tested]

## Objective
Test the hypothesis that [specific claim] to inform decision on [decision].

## Scope

### In Scope
1. [Component/Feature 1] - [Why needed for test]
2. [Component/Feature 2] - [Why needed for test]
3. [Component/Feature 3] - [Why needed for test]

### Out of Scope
1. [Feature 1] - [Why excluded]
2. [Feature 2] - [Why excluded]
3. [Feature 3] - [Why excluded]

## Architecture
```
[Simple architecture diagram]
```

## Implementation Plan

### Phase 1: Setup (X hours)
- [ ] Environment setup
- [ ] Dependencies installed
- [ ] Basic structure

### Phase 2: Core Implementation (Y hours)
- [ ] [Critical component 1]
- [ ] [Critical component 2]
- [ ] [Integration point 1]

### Phase 3: Testing & Measurement (Z hours)
- [ ] Test scenarios implemented
- [ ] Metrics collection
- [ ] Baseline measurements

### Phase 4: Analysis (W hours)
- [ ] Data analysis
- [ ] Hypothesis validation
- [ ] Report generation

## Measurement Plan

### Metrics to Collect
| Metric | Tool | Success Threshold |
|--------|------|------------------|
| [Metric 1] | [Tool] | [Threshold] |
| [Metric 2] | [Tool] | [Threshold] |
| [Metric 3] | [Tool] | [Threshold] |

### Test Scenarios
1. **Scenario 1**: [Description]
   - Input: [Test input]
   - Expected: [Expected outcome]
   - Measure: [What to measure]

2. **Scenario 2**: [Description]
   - Input: [Test input]
   - Expected: [Expected outcome]
   - Measure: [What to measure]

## Success Criteria
- ✅ [Criterion 1 with threshold]
- ✅ [Criterion 2 with threshold]
- ✅ [Criterion 3 with threshold]

## Timeline
- **Start**: [Date]
- **Checkpoint**: [Date] - Assess progress, adjust if needed
- **Complete**: [Date]
- **Presentation**: [Date]

## Resources
- **Engineers**: [Who is working on this]
- **Budget**: [If any costs involved]
- **Access**: [What access/permissions needed]

## Risks
1. **Risk**: [Potential risk]
   - **Mitigation**: [How to mitigate]

2. **Risk**: [Potential risk]
   - **Mitigation**: [How to mitigate]

## Decision Tree
```
IF [metric 1] >= [threshold] AND [metric 2] >= [threshold]
  THEN: Assumption VALIDATED → Proceed with [decision]

ELSE IF [metric 1] < [threshold] OR [metric 2] < [threshold]
  THEN: Assumption INVALIDATED → Fallback to [alternative]

ELSE:
  THEN: INCONCLUSIVE → [Next steps]
```
```

**Expected Outputs:**
- POC requirements document
- Architecture diagram
- Implementation plan
- Measurement plan
- Timeline and resource allocation

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

### Medium-Speed POC (3-5 days)
✅ **Do:**
- All high-speed techniques
- Plus: Basic tests for critical path
- Plus: Realistic data samples
- Plus: Minimal documentation
- Plus: One level of error handling

### Rigorous POC (1-2 weeks)
✅ **Do:**
- Production-quality code
- Comprehensive tests
- Full documentation
- Proper error handling
- Code review
- Security considerations
```

**Implementation Shortcuts (Use Wisely):**

```typescript
// Shortcut 1: Hardcode instead of config
// DON'T in production, OK in POC
const DB_URL = 'postgresql://localhost:5432/poc_db';
const API_KEY = 'test-key-12345';

// Shortcut 2: Skip validation (only if not testing this)
async function createUser(data: any) {
  // TODO: Add validation in production
  return db.users.create(data);
}

// Shortcut 3: Minimal error handling
try {
  const result = await riskyOperation();
  return result;
} catch (err) {
  console.error('Error:', err);
  throw err; // Good enough for POC
}

// Shortcut 4: In-memory instead of persistent (if not testing persistence)
const cache = new Map(); // Instead of Redis

// Shortcut 5: Synchronous instead of async (if not testing performance)
function processData(data: any[]) {
  return data.map(processItem); // Instead of Promise.all
}
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

**Expected Outputs:**
- Working POC implementation
- Measurement data
- Code repository
- Running demo

### Phase 4: Measurement & Data Collection

**Objective**: Collect rigorous data to validate or invalidate hypothesis.

**Measurement Framework:**

```typescript
interface MeasurementPlan {
  // What to measure
  metrics: {
    name: string;
    type: 'performance' | 'quality' | 'usability' | 'cost';
    unit: string;
    tool: string;
    frequency: 'once' | 'continuous' | 'periodic';
  }[];

  // How to measure
  methodology: {
    environment: 'production' | 'staging' | 'local';
    dataSize: 'small' | 'medium' | 'large' | 'production-scale';
    duration: number; // seconds/minutes/hours
    iterations: number;
    warmup: boolean;
  };

  // What constitutes success
  thresholds: {
    metric: string;
    operator: '>=' | '<=' | '==' | '!=' | '<' | '>';
    value: number;
    required: boolean; // Must pass for validation
  }[];

  // Statistical rigor
  statistics: {
    sampleSize: number;
    confidenceLevel: number; // e.g., 0.95 for 95%
    marginOfError: number;   // e.g., 0.05 for ±5%
  };
}
```

**Example Measurement Plans:**

**Performance Assumption:**
```typescript
// Testing: "Switching to WebSockets will reduce latency by 50%"

const measurementPlan = {
  metrics: [
    {
      name: 'Message Latency',
      type: 'performance',
      unit: 'milliseconds',
      tool: 'custom instrumentation',
      frequency: 'continuous'
    },
    {
      name: 'Messages per Second',
      type: 'performance',
      unit: 'ops/sec',
      tool: 'load testing tool',
      frequency: 'continuous'
    },
    {
      name: 'Server CPU Usage',
      type: 'performance',
      unit: 'percentage',
      tool: 'system monitor',
      frequency: 'continuous'
    }
  ],

  methodology: {
    environment: 'staging',
    dataSize: 'medium', // 1000 concurrent connections
    duration: 300, // 5 minutes
    iterations: 10, // Run 10 times
    warmup: true // 30 second warmup
  },

  thresholds: [
    { metric: 'Message Latency', operator: '<=', value: 50, required: true },
    { metric: 'Messages per Second', operator: '>=', value: 10000, required: true },
    { metric: 'Server CPU Usage', operator: '<=', value: 80, required: false }
  ],

  statistics: {
    sampleSize: 100000, // messages
    confidenceLevel: 0.95,
    marginOfError: 0.05
  }
};
```

**Measurement Implementation:**

```typescript
// benchmark/measure.ts
import { performance } from 'perf_hooks';
import stats from 'stats-lite';

interface Measurement {
  timestamp: number;
  metric: string;
  value: number;
}

class MeasurementCollector {
  private measurements: Measurement[] = [];

  record(metric: string, value: number) {
    this.measurements.push({
      timestamp: Date.now(),
      metric,
      value
    });
  }

  async measure<T>(metric: string, fn: () => T | Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      this.record(metric, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.record(`${metric}_error`, duration);
      throw error;
    }
  }

  getStatistics(metric: string) {
    const values = this.measurements
      .filter(m => m.metric === metric)
      .map(m => m.value);

    return {
      count: values.length,
      mean: stats.mean(values),
      median: stats.median(values),
      stddev: stats.stdev(values),
      p50: stats.percentile(values, 0.5),
      p95: stats.percentile(values, 0.95),
      p99: stats.percentile(values, 0.99),
      min: Math.min(...values),
      max: Math.max(...values)
    };
  }

  export() {
    const allMetrics = [...new Set(this.measurements.map(m => m.metric))];
    const report = {};

    allMetrics.forEach(metric => {
      report[metric] = this.getStatistics(metric);
    });

    return report;
  }
}

// Usage
const collector = new MeasurementCollector();

for (let i = 0; i < 10000; i++) {
  await collector.measure('websocket-latency', async () => {
    await sendWebSocketMessage('test');
  });

  await collector.measure('http-latency', async () => {
    await sendHttpRequest('test');
  });
}

const report = collector.export();
console.log(JSON.stringify(report, null, 2));
```

**Comparison Testing:**

```typescript
// Compare baseline vs new approach
interface ComparisonResult {
  baseline: Statistics;
  candidate: Statistics;
  improvement: {
    absolute: number;
    percentage: number;
    significant: boolean; // Statistically significant?
  };
  threshold: number;
  passed: boolean;
}

function compareApproaches(
  baselineData: number[],
  candidateData: number[],
  threshold: number // e.g., 0.5 for 50% improvement
): ComparisonResult {
  const baseline = calculateStatistics(baselineData);
  const candidate = calculateStatistics(candidateData);

  const improvement = {
    absolute: baseline.mean - candidate.mean,
    percentage: (baseline.mean - candidate.mean) / baseline.mean,
    significant: tTest(baselineData, candidateData) // p < 0.05
  };

  return {
    baseline,
    candidate,
    improvement,
    threshold,
    passed: improvement.percentage >= threshold && improvement.significant
  };
}

// Example
const httpLatencies = [120, 125, 118, 130, 122, ...]; // ms
const wsLatencies = [45, 48, 43, 50, 46, ...]; // ms

const result = compareApproaches(httpLatencies, wsLatencies, 0.5);
console.log(`Improvement: ${(result.improvement.percentage * 100).toFixed(1)}%`);
console.log(`Threshold: ${(result.threshold * 100)}%`);
console.log(`Passed: ${result.passed ? '✅' : '❌'}`);
```

**Expected Outputs:**
- Raw measurement data
- Statistical analysis
- Comparison report
- Visualization (charts/graphs)

### Phase 5: Confidence Scoring

**Objective**: Quantify confidence in assumption validation with rigorous scoring.

**Confidence Scoring Framework:**

```typescript
interface ConfidenceScore {
  overall: number; // 0-100
  dimensions: {
    dataQuality: number;        // 0-100
    sampleSize: number;         // 0-100
    methodology: number;        // 0-100
    consistency: number;        // 0-100
    expertise: number;          // 0-100
  };
  factors: {
    positive: string[];         // What increases confidence
    negative: string[];         // What decreases confidence
    assumptions: string[];      // Remaining assumptions
    limitations: string[];      // Known limitations
  };
  recommendation: 'high-confidence' | 'moderate-confidence' | 'low-confidence' | 'insufficient-data';
}

function calculateConfidence(validation: ValidationResult): ConfidenceScore {
  // Data Quality (0-100)
  const dataQuality = calculateDataQuality({
    realistic: validation.usedProductionData ? 100 : 50,
    complete: validation.coveredAllScenarios ? 100 : 70,
    accurate: validation.measurementAccuracy // 0-100
  });

  // Sample Size (0-100)
  const sampleSize = calculateSampleSize({
    n: validation.measurements.length,
    required: validation.requiredSampleSize,
    variance: validation.dataVariance
  });

  // Methodology (0-100)
  const methodology = calculateMethodology({
    controlled: validation.controlledEnvironment ? 100 : 60,
    repeatable: validation.repeatedMultipleTimes ? 100 : 50,
    isolated: validation.isolatedVariables ? 100 : 70,
    instrumented: validation.properInstrumentation ? 100 : 80
  });

  // Consistency (0-100)
  const consistency = calculateConsistency({
    variance: validation.resultVariance, // Low variance = high score
    outliers: validation.outlierCount,   // Few outliers = high score
    reproducible: validation.reproducibleResults ? 100 : 50
  });

  // Expertise (0-100)
  const expertise = calculateExpertise({
    experience: validation.teamExperienceLevel, // 0-100
    reviewed: validation.expertReviewed ? 100 : 70,
    researched: validation.industryResearchConsulted ? 100 : 80
  });

  const overall = (
    dataQuality * 0.25 +
    sampleSize * 0.20 +
    methodology * 0.25 +
    consistency * 0.15 +
    expertise * 0.15
  );

  return {
    overall,
    dimensions: { dataQuality, sampleSize, methodology, consistency, expertise },
    factors: identifyFactors(validation),
    recommendation: getRecommendation(overall)
  };
}

function getRecommendation(score: number): string {
  if (score >= 85) return 'high-confidence';
  if (score >= 70) return 'moderate-confidence';
  if (score >= 50) return 'low-confidence';
  return 'insufficient-data';
}
```

**Confidence Score Report:**

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

**Known Limitations**:
- POC tested only 3 of 12 API endpoints
- Cache warming not tested
- Long-term performance degradation unknown
- Monitoring and debugging complexity not assessed

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

**Expected Outputs:**
- Quantified confidence score (0-100)
- Dimension breakdown
- Positive/negative factors
- Remaining assumptions
- Risk-adjusted recommendation

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

**Risk Mitigation Plan:**

```markdown
# Risk Mitigation Plan

## Identified Risks

### Risk 1: Production performance differs from POC
**Likelihood**: Medium
**Impact**: High
**Confidence Gap**: POC environment ≠ production

**Mitigation**:
1. Deploy to 5% of traffic (canary deployment)
2. Monitor key metrics (latency, error rate, CPU)
3. A/B test GraphQL vs REST for 2 weeks
4. Automatic rollback if metrics degrade >10%
5. Gradual ramp to 100% over 4 weeks

**Success Criteria**:
- P95 latency <200ms (vs current 285ms)
- Error rate <0.1% (same as current)
- CPU increase <30% (vs POC 21%)

**Rollback Plan**:
- Keep REST endpoints for 3 months
- Feature flag to switch between GraphQL/REST
- Automated rollback on metric thresholds
- Manual rollback option (1-click)

### Risk 2: Team struggles with GraphQL complexity
**Likelihood**: Medium
**Impact**: Medium
**Confidence Gap**: Limited GraphQL expertise

**Mitigation**:
1. 2-week GraphQL training for team (before adoption)
2. Hire 1 GraphQL expert (consultant for 3 months)
3. Pair programming for first 2 sprints
4. GraphQL best practices documentation
5. Code review by expert for first month
6. Slack channel for GraphQL questions

**Success Criteria**:
- Team self-sufficient after 2 months
- Code quality maintained (no increase in bugs)
- Development velocity returns to baseline in 6 weeks

**Fallback Plan**:
- Extend consultant engagement if needed
- Additional training budget
- Simplify GraphQL schema if too complex

### Risk 3: GraphQL doesn't scale to 10k RPS
**Likelihood**: Low
**Impact**: Critical
**Confidence Gap**: POC tested at 2k RPS, need 10k

**Mitigation**:
1. Load test in staging at 15k RPS (150% of target)
2. Implement caching (DataLoader, Redis)
3. Query complexity limits
4. Rate limiting per client
5. Horizontal scaling plan ready
6. Monitor N+1 query patterns

**Success Criteria**:
- Sustain 10k RPS with p95 <200ms
- Linear scaling with additional instances
- No memory leaks over 24 hours
- CPU <70% at peak load

**Contingency**:
- If doesn't scale: Hybrid approach (GraphQL for mobile, REST for high-volume)
- Query optimization sprint
- Infrastructure scaling (more instances)

### Risk 4: Complexity increases faster than productivity
**Likelihood**: Medium
**Impact**: Medium
**Confidence Gap**: POC showed increased complexity

**Mitigation**:
1. Track development velocity metrics
2. Developer satisfaction surveys (monthly)
3. Complexity metrics (cyclomatic, cognitive)
4. Regular retrospectives on GraphQL DX
5. Simplify schema based on feedback
6. Tooling investment (codegen, debugging)

**Success Criteria**:
- Velocity returns to baseline in 6 weeks
- Developer satisfaction >7/10
- Complexity metrics stable or improving
- Bug rate same or lower

**Adjustment Plan**:
- If complexity too high: Simplify schema, remove unused features
- If velocity doesn't recover: Additional training or tooling
- If team unhappy: Reevaluate decision after 3 months

## Monitoring Plan

### Metrics to Track

| Metric | Current Baseline | Target | Alert Threshold |
|--------|-----------------|--------|----------------|
| P95 Latency | 285ms | <200ms | >250ms |
| P99 Latency | 450ms | <350ms | >400ms |
| Error Rate | 0.08% | <0.1% | >0.15% |
| Data Transfer | 124 KB | <75 KB | >100 KB |
| Server CPU | 42% | <60% | >70% |
| Memory Usage | 1.2 GB | <1.5 GB | >2.0 GB |

### Dashboards
1. Real-time performance dashboard (Grafana)
2. Error tracking (Sentry)
3. Business metrics (conversion, revenue)
4. Team velocity (Jira)

### Review Cadence
- **Daily**: Check key metrics during rollout
- **Weekly**: Team retro on GraphQL experience
- **Monthly**: Stakeholder review of benefits vs costs
- **Quarterly**: Re-validate assumptions with production data

## Go/No-Go Checkpoints

### Checkpoint 1: After Training (Week 2)
**Criteria**:
- ✅ Team completes GraphQL training
- ✅ POC code reviewed and approved
- ✅ Monitoring infrastructure ready

**Decision**: Proceed to Pilot or Delay?

### Checkpoint 2: After Pilot (Week 6)
**Criteria**:
- ✅ 5% traffic handled successfully
- ✅ Metrics meet targets
- ✅ No major incidents

**Decision**: Expand to 25% or Rollback?

### Checkpoint 3: Mid-Rollout (Week 10)
**Criteria**:
- ✅ 50% traffic handled successfully
- ✅ Team velocity recovering
- ✅ Developer satisfaction >7/10

**Decision**: Continue to 100% or Pause?

### Checkpoint 4: Full Rollout (Week 14)
**Criteria**:
- ✅ 100% traffic on GraphQL
- ✅ All metrics meeting targets
- ✅ Team confident and productive

**Decision**: Declare Success or Rollback?

### Checkpoint 5: Post-Launch (Month 3)
**Criteria**:
- ✅ 3 months of stable production use
- ✅ Benefits realized (performance, DX)
- ✅ No unexpected issues

**Decision**: Decommission REST or Keep as Fallback?
```

**Expected Outputs:**
- Clear go/no-go decision
- Risk mitigation plan
- Monitoring strategy
- Rollback procedures
- Checkpoint schedule

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

**Use For**: Major technology decisions, architectural changes, migrations

### Workflow 3: Continuous Validation

**Goal**: Ongoing validation of assumptions in production.

**Approach:**
```yaml
# Continuous validation pipeline
validation:
  - assumption: "API latency <200ms"
    frequency: "continuous"
    tool: "monitoring"
    alert_threshold: ">250ms for 5 minutes"

  - assumption: "Error rate <0.1%"
    frequency: "continuous"
    tool: "error tracking"
    alert_threshold: ">0.2% for 10 minutes"

  - assumption: "Team velocity maintained"
    frequency: "weekly"
    tool: "jira metrics"
    alert_threshold: "<80% of baseline for 2 weeks"

  - assumption: "User satisfaction high"
    frequency: "monthly"
    tool: "NPS survey"
    alert_threshold: "<7/10 for 2 months"
```

**Benefits:**
- Early detection of assumption breakdown
- Confidence decay tracking
- Proactive risk mitigation

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
