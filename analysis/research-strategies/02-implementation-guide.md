# Orchestr8 Research-Oriented Workflows: Implementation Guide

## Introduction

This guide provides concrete implementations of research-oriented workflows that align with Simon Willison's async code research strategies. These workflows enable orchestr8 to support hypothesis testing, parallel exploration, and experimental code validation.

## Part 1: Pattern Analysis from Current Workflows

### Pattern 1: Sequential Phase Execution

**From `add-feature.md` (5 phases):**
```
Phase 1: Analysis & Design (0-20%)
Phase 2: Implementation (20-70%)
  ├─ 2A: Backend (20-45%)
  ├─ 2B: Frontend (45-60%)
  └─ 2C: Integration (60-70%)
Phase 3: Quality Gates (70-90%) - PARALLEL OPPORTUNITY
Phase 4: Documentation (90-95%)
Phase 5: Deployment (95-100%)
```

**Key Insight:**
Only Phase 3 (quality gates) uses parallelism. Phases 1-2 are strictly sequential despite some independence possible between backend/frontend.

### Pattern 2: Parallel Quality Gates

**From `review-code.md`:**
```markdown
## Phase 1: Scope Detection (0-5%)
[Sequential - must happen first]

**🚀 PARALLEL EXECUTION OPPORTUNITY (5x speedup):** 
Phases 2-6 can run concurrently

## Phase 2: Style & Readability Review (5-20%)
## Phase 3: Logic & Correctness Review (20-35%)
## Phase 4: Security Audit (35-50%)
## Phase 5: Performance Analysis (50-65%)
## Phase 6: Synthesis & Report (65-100%)
```

**Key Insight:**
All 5 review types are independent, so they CAN run in parallel, but current workflow executes them sequentially. The comment documents opportunity but doesn't implement it.

### Pattern 3: Documented Strategies (Not Executed)

**From `deploy.md`:**
```markdown
## Deployment Strategies

**Blue-Green Deployment:**
- Description of how it works
- When to use
- Advantages/disadvantages

**Rolling Deployment:**
- Description of how it works
- When to use
- Advantages/disadvantages

**Canary Deployment:**
- Description of how it works
- When to use
- Advantages/disadvantages
```

**Key Insight:**
Multiple strategies are described but NO RUNTIME SELECTION. Single linear execution path chosen. No comparison or experimentation.

### Pattern 4: Result Aggregation (No Synthesis)

**From `optimize-performance.md`:**
```
Phase 1: Baseline (0-20%) → baseline-metrics.json
Phase 2: Strategy Design (20-35%) → OPTIMIZATION-STRATEGY.md
Phase 3: Frontend Optimizations (35-55%) → FRONTEND-OPTIMIZATIONS.md
Phase 4: Backend Optimizations (55-75%) → BACKEND-OPTIMIZATIONS.md
Phase 5: Database Optimizations (75-90%) → DATABASE-OPTIMIZATIONS.md
Phase 6: Benchmarking (90-100%) → final-benchmarks.json
```

**Key Insight:**
6 different output files but NO SYNTHESIS. No document that says "combined optimizations improved performance by X%, here's the recommended configuration."

## Part 2: Research-Enhanced Patterns

### Research Pattern 1: Hypothesis Testing

**Template Structure:**
```
## Phase: Hypothesis Definition

Define H0 (null hypothesis) and H1 (alternative)
Set success metrics
Establish baseline for comparison
Define exit criteria (when to stop testing)

Expected Outputs:
- hypothesis.md (explicit H0/H1/metrics)
- baseline-metrics.json
- test-plan.md
```

**Example: "Will adding caching reduce database load?"**
```yaml
H0: "Adding caching does not reduce database load"
H1: "Adding caching reduces database load by >30%"
Baseline: Current avg query time: 50ms, DB load: 75%
Success Metrics:
  - Average query time < 35ms (30% improvement)
  - Peak DB load < 60%
  - Query cache hit rate > 80%
Exit Criteria:
  - Test 100 representative queries
  - Run for minimum 10 minutes production traffic
  - Measure 5 successful cache hits per query type
```

### Research Pattern 2: Parallel Branch Exploration

**Template Structure:**
```
## Phase: Parallel Strategy Testing

🚀 PARALLEL EXECUTION: All branches execute concurrently

### Branch A: Strategy A
Agent 1 investigates Strategy A
Creates: branch-a-output/

### Branch B: Strategy B
Agent 2 investigates Strategy B
Creates: branch-b-output/

### Branch C: Strategy C
Agent 3 investigates Strategy C
Creates: branch-c-output/

## Phase: Results Synthesis

Consolidate outputs from all branches
Compare against evaluation criteria
Generate ranking/recommendation
```

**Concrete Example: Testing 3 caching strategies**
```
Branch A: In-Memory Cache (Redis)
- Agent: Backend Developer
- Implementation: Add Redis layer
- Tests: Latency, memory usage, cache invalidation
- Outputs: redis-implementation/, redis-benchmarks.json

Branch B: Database Query Cache
- Agent: Database Specialist
- Implementation: Add query result caching at DB layer
- Tests: Latency, storage requirements, staleness handling
- Outputs: db-cache-implementation/, db-cache-benchmarks.json

Branch C: HTTP Cache Headers
- Agent: Frontend Developer
- Implementation: Leverage browser/CDN caching
- Tests: Client-side cache hit rates, invalidation
- Outputs: http-cache-implementation/, http-cache-benchmarks.json

Synthesis Phase:
- Compare: Implementation complexity, performance gains, infrastructure cost
- Measure: Which provides best latency improvement?
- Identify: Do branches conflict? Can we combine?
- Recommend: "Redis provides 45% improvement, simpler than B, complements C"
```

### Research Pattern 3: Fire-and-Forget Async Execution

**Template Structure:**
```
Quick Planning Phase (Sync - completes in seconds)
├─ Parse arguments
├─ Create execution plan
├─ Return workflow ID
└─ User gets: "Workflow ABC started. Status: /orchestr8:status ABC"

Background Execution (Async - runs in background)
├─ Phase 1-N executed asynchronously
├─ Results stored to database/file system
└─ User continues with other work

Result Retrieval (User-Initiated)
├─ Poll: /orchestr8:status ABC → shows progress
├─ Get results: /orchestr8:results ABC → final report
└─ Stream: /orchestr8:watch ABC → realtime updates
```

**Implementation Pattern:**
```bash
# Quick planning phase (returns in <10 seconds)
/orchestr8:compare-strategies "caching" "indexing" "partitioning" --async

# System responds:
# ✅ Workflow Started: workflow-id-12345
# Status: /orchestr8:status workflow-id-12345
# Results: /orchestr8:results workflow-id-12345
# Watch: /orchestr8:watch workflow-id-12345

# User continues with other work...
# Later, check status:
/orchestr8:status workflow-id-12345
# ✓ Phase 1 (10%) - Done
# ≈ Phase 2 (40%) - Running (Branch B complete, C at 75%)
# ≈ Phase 3 (25%) - Waiting
# ≈ Phase 4 (25%) - Waiting
# ETA: 2 minutes remaining

# Much later, retrieve results:
/orchestr8:results workflow-id-12345
# [Generates comparison-report.md with all findings]
```

### Research Pattern 4: Comparative Analysis & Ranking

**Template Structure:**
```
Inputs:
- Results from multiple parallel branches
- Evaluation criteria (weighted scoring)
- Success thresholds

Process:
1. Score each solution against criteria
2. Build comparison matrix
3. Identify trade-offs
4. Generate recommendation

Outputs:
- comparison-matrix.md (clear visual table)
- scoring-analysis.md (how each scored)
- recommendation.md (what to do and why)
- decision-log.md (reasoning trail)
```

**Concrete Example: Scoring 3 caching strategies**
```markdown
# Caching Strategy Comparison

## Scoring Matrix

| Criterion | Weight | Redis | DB Cache | HTTP Cache |
|-----------|--------|-------|----------|------------|
| Implementation Complexity | 0.20 | 3/5 | 2/5 | 5/5 |
| Performance Gain (latency) | 0.35 | 5/5 | 4/5 | 3/5 |
| Infrastructure Cost | 0.15 | 2/5 | 5/5 | 5/5 |
| Operational Overhead | 0.15 | 2/5 | 4/5 | 5/5 |
| Maintainability | 0.15 | 3/5 | 4/5 | 4/5 |
| **Weighted Score** | 1.00 | **3.85** | **4.10** | **4.25** |

## Detailed Analysis

### Redis Score: 3.85/5
✓ Best performance gains (avg 45% latency reduction)
✗ Requires new infrastructure
✗ Cache invalidation complexity
→ Best for: high-traffic, strict performance requirements

### DB Cache Score: 4.10/5
✓ No new infrastructure
✓ Fewer moving parts
✗ Slightly slower than Redis (38% improvement)
→ Best for: teams wanting simplicity

### HTTP Cache Score: 4.25/5
✓ No backend infrastructure
✓ Highest operational simplicity
✗ Limited benefit for non-cacheable requests
→ Best for: mostly static content

## Recommendation

**Primary:** Implement Redis (3.85) + HTTP Cache (4.25)
- Redis handles dynamic data caching (45% improvement)
- HTTP Cache handles static assets (no server load)
- Combined approach: Best of both worlds
- Migration: Implement HTTP cache first (fastest), then Redis

**Alternative:** If budget-constrained, choose DB Cache (4.10)
- Acceptable performance without infrastructure cost
- Can upgrade to Redis later if needed
```

## Part 3: Concrete Workflow Examples

### Example 1: Research Approach Workflow

```markdown
---
description: Research and validate a code approach with hypothesis testing, POC, and metrics-driven evaluation
argument-hint: "[approach-description]"
model: claude-sonnet-4-5-20250929
---

# Research Approach Workflow

Autonomous research workflow for validating code approaches.

## Phase 1: Hypothesis Definition (0-15%)

**⚡ EXECUTE TASK TOOL:**
\`\`\`
Use architect agent to:
1. Parse approach description into testable hypothesis
2. Define H0 (null: approach doesn't improve things)
3. Define H1 (alternative: approach improves things)
4. Identify success metrics (measurable, quantifiable)
5. Establish baseline (current state)

subagent_type: "development:architect"
description: "Define research hypothesis and success metrics"
prompt: "
Define research hypothesis for: $1

Tasks:
1. **Parse Approach**
   - What specific improvement does this approach target?
   - What is the current pain point?
   - What would success look like?

2. **Define Hypothesis**
   - H0: This approach will NOT improve [metric] by [threshold]
   - H1: This approach WILL improve [metric] by [threshold]
   - Example: 'H1: Caching will reduce response time by >30%'

3. **Success Metrics**
   - Metric 1: [specific measurement]
   - Metric 2: [specific measurement]
   - Metric 3: [specific measurement]
   - Each must be: measurable, quantifiable, time-boxed

4. **Baseline Measurement**
   - Current value for each metric
   - How measured?
   - When measured?
   - Against what load/conditions?

Expected outputs:
- hypothesis.md with H0, H1, metrics, baseline
- evaluation-criteria.json with thresholds
- baseline-measurements.json with current state
"
\`\`\`

## Phase 2: Research & Design (15-30%)

**⚡ EXECUTE TASK TOOL:**
\`\`\`
Use architect agent to:
1. Research similar approaches in literature/open source
2. Identify potential issues/gotchas
3. Design minimal POC
4. List assumptions being made
5. Create risk assessment

subagent_type: "development:architect"
description: "Research approach design and risk assessment"
prompt: "
Research approach for: $1

Based on hypothesis from Phase 1:

Tasks:
1. **Literature Review**
   - Search for similar implementations
   - What worked? What didn't?
   - Common pitfalls?

2. **Design POC**
   - Minimal viable test of hypothesis
   - What's the smallest thing to implement?
   - What dependencies needed?
   - Estimated implementation effort

3. **Assumptions List**
   - What are we assuming?
   - Are those assumptions valid?
   - How would we know if wrong?

4. **Risk Assessment**
   - What could go wrong?
   - How likely? How severe?
   - Mitigation strategies?

Expected outputs:
- research-notes.md (findings from research)
- poc-design.md (what we'll build)
- assumptions.md (what we're assuming)
- risk-assessment.md (what could go wrong)
"
\`\`\`

## Phase 3: POC Implementation (30-60%)

**⚡ EXECUTE TASK TOOL:**
\`\`\`
Use appropriate developer agent to:
1. Implement minimal POC
2. Create test cases
3. Document implementation decisions
4. Note trade-offs discovered

subagent_type: "development:[language-appropriate]-developer"
description: "Implement proof-of-concept for approach"
prompt: "
Implement POC for: $1

Based on design from Phase 2:

Tasks:
1. **Implementation**
   - Build minimal POC
   - Focus on testing hypothesis, not production code
   - Document as you go
   - Note design decisions

2. **Test Suite**
   - Test that POC works as designed
   - Test happy path
   - Test edge cases
   - Measure metrics from Phase 1

3. **Decision Log**
   - Why did you make choices you did?
   - Trade-offs discovered?
   - Simplifications made?
   - What would production version need?

Expected outputs:
- poc-implementation/ (code)
- test-suite/ (tests)
- implementation-notes.md (decisions and trade-offs)
- metrics-baseline-poc.json (metrics for POC)
"
\`\`\`

## Phase 4: Evaluation (60-80%)

🚀 PARALLEL EXECUTION: Run both evaluation tasks concurrently

### 4A: Testing (60-70%)

**⚡ EXECUTE TASK TOOL:**
\`\`\`
Use test-engineer agent to:
1. Run comprehensive test suite
2. Measure code quality
3. Document test results
4. Flag any issues

subagent_type: "quality:test-engineer"
description: "Test POC and measure quality"
prompt: "
Test POC for: $1

Tasks:
1. **Execute Tests**
   - Run test suite (from Phase 3)
   - All tests passing?
   - Code coverage? (aim for >80%)

2. **Code Quality Metrics**
   - Complexity (cyclomatic, cognitive)
   - Duplication
   - Best practices followed?

3. **Maintainability**
   - Is code understandable?
   - Good variable names?
   - Comments where needed?

Expected outputs:
- test-results.md
- coverage-report.md
- quality-metrics.json
"
\`\`\`

### 4B: Performance (70-80%)

**⚡ EXECUTE TASK TOOL:**
\`\`\`
Use performance-analyzer agent to:
1. Benchmark POC against metrics
2. Compare to baseline
3. Measure improvement
4. Identify performance issues

subagent_type: "infrastructure:performance-analyzer"
description: "Benchmark POC performance"
prompt: "
Benchmark POC for: $1

Metrics from Phase 1: [load baseline metrics]

Tasks:
1. **Run Benchmarks**
   - Measure each metric from Phase 1
   - Use representative test data
   - Run sufficient iterations
   - Measure in stable environment

2. **Compare to Baseline**
   - Baseline: [from Phase 1]
   - Current: [measured in this phase]
   - Improvement: [delta and percentage]
   - Meets hypothesis threshold? YES/NO

3. **Performance Analysis**
   - Any bottlenecks in POC?
   - Scalability concerns?
   - Resource usage (CPU, memory, etc)?

Expected outputs:
- performance-report.md
- benchmark-results.json (measured metrics)
- comparison-analysis.md (vs baseline)
"
\`\`\`

## Phase 5: Analysis & Recommendation (80-95%)

**⚡ EXECUTE TASK TOOL:**
\`\`\`
Use architect agent to:
1. Evaluate: Did we support H1 or H0?
2. Compare results to hypothesis
3. Identify trade-offs
4. Make recommendation: Pursue/Refine/Abandon

subagent_type: "development:architect"
description: "Analyze results and make recommendation"
prompt: "
Analyze research results for: $1

From previous phases:
- Hypothesis: [from Phase 1]
- Baseline metrics: [from Phase 1]
- POC metrics: [from Phase 4]
- Quality metrics: [from Phase 4]
- Risk assessment: [from Phase 2]

Tasks:

1. **Hypothesis Evaluation**
   - Did results support H1? (approach improves things)
   - Or did they support H0? (approach doesn't help)
   - Confidence level: High/Medium/Low
   - Why this confidence level?

2. **Trade-off Analysis**
   - Performance improvement: [X%]
   - Implementation complexity: [High/Med/Low]
   - Operational overhead: [High/Med/Low]
   - Code quality impact: [Positive/Neutral/Negative]
   - Worth the trade-offs?

3. **Recommendation**
   - Pursue: Implement in production
   - Refine: Good idea but needs work
   - Abandon: Hypothesis not supported
   - If Pursue/Refine: What's next step?

4. **Alternative Approaches**
   - Did we discover better approaches?
   - Any pivot suggestions?
   - Related ideas to explore?

Expected outputs:
- analysis-report.md (detailed analysis)
- recommendation.md (what to do)
- next-steps.md (if pursuing or refining)
"
\`\`\`

## Phase 6: Synthesis (95-100%)

**⚡ EXECUTE TASK TOOL:**
\`\`\`
Use architect agent to:
1. Synthesize all findings into research report
2. Create executive summary
3. Generate decision log
4. Document learnings

subagent_type: "development:architect"
description: "Generate research report"
prompt: "
Synthesize research findings for: $1

Tasks:

1. **Executive Summary** (1-2 pages)
   - Question being researched
   - Hypothesis tested
   - Result: Supported / Not supported / Inconclusive
   - Bottom line recommendation

2. **Findings Summary**
   - Key discoveries
   - Metrics comparison (baseline vs POC)
   - Quality assessment
   - Trade-offs identified

3. **Decision Log**
   - What did we learn?
   - What surprised us?
   - What would we do differently?
   - What should future implementations know?

4. **Implementation Guide** (if pursuing)
   - Steps to implement in production
   - Risks to watch for
   - Monitoring to set up
   - Rollback plan

Expected outputs:
- research-summary.md (complete report)
- findings.json (structured metrics)
- decision-log.md (learnings)
- implementation-guide.md (if pursuing)
"
\`\`\`

## Success Criteria

Research Approach workflow is complete when:
- ✅ Hypothesis clearly defined with metrics
- ✅ POC implemented and tested
- ✅ Baseline vs POC metrics compared
- ✅ Hypothesis evaluation completed
- ✅ Recommendation (Pursue/Refine/Abandon) made
- ✅ Research report generated
- ✅ Implementation guide provided (if pursuing)

## Example Usage

```bash
/orchestr8:research-approach "Add Redis caching layer to reduce database load"
```

The workflow will autonomously:
1. Define hypothesis: "Redis will reduce database queries by >50%"
2. Research similar implementations
3. Design minimal POC
4. Implement Redis caching POC
5. Benchmark against current system
6. Analyze: Did it work? By how much?
7. Recommend: Pursue production implementation with these steps...

```

---

### Example 2: Compare Strategies Workflow (Excerpt)

```markdown
---
description: Compare multiple implementation strategies in parallel with metrics-driven ranking
argument-hint: "[strategies-to-compare]"
model: claude-sonnet-4-5-20250929
---

# Compare Strategies Workflow

Parallel evaluation of multiple approaches.

## Phase 1: Comparison Framework (0-15%)

Define what we're comparing and how we'll evaluate.

**Expected Outputs:**
- `comparison-framework.md` - Evaluation criteria and weights
- `strategies-to-evaluate.json` - List of strategies

Example framework:
```json
{
  "criteria": [
    {
      "name": "Performance Improvement",
      "description": "How much does this improve latency?",
      "weight": 0.35,
      "measurement": "Response time p95 reduction %",
      "threshold": ">20%"
    },
    {
      "name": "Implementation Complexity",
      "description": "How hard is this to implement?",
      "weight": 0.25,
      "measurement": "Estimated days of work",
      "threshold": "<5 days"
    },
    {
      "name": "Infrastructure Cost",
      "description": "Additional infrastructure cost?",
      "weight": 0.20,
      "measurement": "Monthly cost delta",
      "threshold": "<$1000/month"
    },
    {
      "name": "Operational Overhead",
      "description": "How much will it cost to operate?",
      "weight": 0.20,
      "measurement": "Operations hours per month",
      "threshold": "<10 hours/month"
    }
  ],
  "scoring": "1-5 scale for each criterion"
}
```

## Phase 2: Implement Strategies in Parallel (15-55%)

🚀 PARALLEL EXECUTION: All strategies implemented simultaneously

Each strategy gets its own agent:

```markdown
### Strategy A: Redis Caching
Agent: Backend Developer (Agent 1)
Task: Implement Redis layer for query caching
Branch: branch-redis/
Outputs:
- redis-implementation/
- redis-design-doc.md
- estimated-complexity.md

### Strategy B: Database Query Cache
Agent: Database Specialist (Agent 2)
Task: Implement caching at database layer
Branch: branch-db-cache/
Outputs:
- db-cache-implementation/
- db-cache-design-doc.md
- estimated-complexity.md

### Strategy C: HTTP Caching Headers
Agent: Frontend Developer (Agent 3)
Task: Implement browser/CDN caching via headers
Branch: branch-http-cache/
Outputs:
- http-cache-implementation/
- http-cache-design-doc.md
- estimated-complexity.md
```

**Agents execute in parallel. Each produces:**
- Implementation code
- Design documentation
- Complexity estimate
- Trade-offs document

## Phase 3: Evaluate All in Parallel (55-80%)

🚀 PARALLEL EXECUTION: Each strategy benchmarked concurrently

```markdown
### Evaluator 1: Benchmark Strategy A

Measure against framework criteria:
- Performance: Run load test with 1000 req/s, measure p95 latency improvement
- Complexity: Estimate implementation effort based on code
- Cost: Calculate Redis infrastructure cost
- Overhead: Estimate ops hours (monitoring, scaling, failover)

Output:
- strategy-a-benchmarks.json
- strategy-a-evaluation.md
- strategy-a-metrics.json

### Evaluator 2: Benchmark Strategy B

Similar evaluation process...

### Evaluator 3: Benchmark Strategy C

Similar evaluation process...
```

All three evaluators work simultaneously. Results:
```json
{
  "strategy_a_redis": {
    "performance_improvement": 45,
    "implementation_days": 3,
    "monthly_cost": 800,
    "ops_hours_per_month": 8,
    "weighted_score": 4.2
  },
  "strategy_b_db_cache": {
    "performance_improvement": 38,
    "implementation_days": 2,
    "monthly_cost": 0,
    "ops_hours_per_month": 4,
    "weighted_score": 4.1
  },
  "strategy_c_http_cache": {
    "performance_improvement": 22,
    "implementation_days": 1,
    "monthly_cost": 0,
    "ops_hours_per_month": 2,
    "weighted_score": 3.8
  }
}
```

## Phase 4: Comparative Analysis (80-95%)

Compare all results and generate recommendation.

**Output: comparison-matrix.md**
```markdown
| Strategy | Performance | Complexity | Cost | Overhead | Score |
|----------|-------------|------------|------|----------|-------|
| Redis    | 45% (5/5)   | 3d (3/5)   | $800 (2/5) | 8h (2/5) | 4.2   |
| DB Cache | 38% (4/5)   | 2d (5/5)   | $0 (5/5)   | 4h (4/5) | 4.1   |
| HTTP     | 22% (2/5)   | 1d (5/5)   | $0 (5/5)   | 2h (5/5) | 3.8   |

Winner: Redis (4.2) - Best performance despite cost
Runner-up: DB Cache (4.1) - Best value-for-money
```

**Output: recommendation.md**
```markdown
# Recommendation

## Primary: Implement Redis + HTTP Cache
- Redis for dynamic query caching (45% improvement)
- HTTP headers for static assets (complementary)
- Combined score: 4.3 (best of both)
- Total cost: $800/month + 10 ops hours
- Total implementation: 4 days

## Fallback: Just DB Cache
- If budget constrained
- Acceptable 38% improvement
- No infrastructure cost
- Can upgrade to Redis later
```

## Phase 5: Synthesis (95-100%)

Final report with all findings.

**Output: final-comparison-report.md**

This document becomes the decision artifact that stakeholders use to approve which strategy to implement.
```

---

## Part 4: Integration with Existing Workflows

### How to Enhance `optimize-performance.md`

**Current Structure:**
```
Phase 1: Baseline (20%)
Phase 2: Strategy Design (15%)
Phase 3: Optimizations (20%)
Phase 4: Implementation (20%)
Phase 5: Benchmarking (15%)
Phase 6: Documentation (10%)
```

**Research-Enhanced Structure:**
```
Phase 1: Baseline (15%)
  - Current performance metrics
  - Identify bottlenecks

Phase 2: Design Multiple Strategies (20%)
  - Strategy A: Fix algorithm
  - Strategy B: Add caching
  - Strategy C: Optimize DB queries
  - Rank by estimated impact

Phase 3: Test Strategies in Parallel (40%)
  🚀 Each strategy tested on isolated branch
  - Branch A: Implement & benchmark
  - Branch B: Implement & benchmark
  - Branch C: Implement & benchmark
  Results: strategy-a-results.json, strategy-b-results.json, strategy-c-results.json

Phase 4: Combination Testing (15%)
  - Which strategies combine well?
  - A + B = combined improvement?
  - A + B + C = diminishing returns?
  - Recommend optimal combination

Phase 5: Implement Best Approach (10%)
Phase 6: Monitor & Verify (10%)
```

**Key Change:**
- From: "Pick best strategy, implement it"
- To: "Test all strategies in parallel, compare, combine strategically"

### How to Enhance `review-code.md`

**Current Structure:**
```
Phase 1: Scope Detection (5%)
Phase 2-6: Five review stages in parallel (95%)
  - Style Review
  - Logic Review
  - Security Review
  - Performance Review
  - Synthesis
```

**Research-Enhanced Structure:**
```
Phase 1: Scope Detection (5%)

Phase 2-6: Parallel Reviews with Hypotheses (75%)
  - Style: "What patterns of violations exist?"
  - Logic: "What logic errors exist and why?"
  - Security: "What security issues exist and what's the common theme?"
  - Performance: "What performance hotspots and why do they occur?"
  - Each generates: findings.md, pattern-analysis.md, root-cause.md

Phase 7: Pattern Synthesis (15%)
  - What themes emerge across all 5 reviews?
  - Are there root causes explaining multiple issues?
  - Prioritize fixes by leverage (fixes that address multiple issues)

Phase 8: Recommendation & Plan (5%)
  - Top N issues by leverage
  - Recommended fix approach
  - Estimated refactor effort
```

**Key Change:**
- From: "Review code, produce 5 reports"
- To: "Analyze code with hypothesis about patterns, synthesize findings, recommend highest-leverage fixes"

