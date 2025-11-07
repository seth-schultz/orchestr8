---
description: Technology and pattern comparison workflow with empirical performance and feature analysis
argument-hint: [comparison-question]
model: claude-sonnet-4-5-20250929
---

# Benchmark Workflow

Systematic comparison workflow for evaluating technologies, frameworks, patterns, or approaches using empirical benchmarks and structured analysis.

## Overview

This workflow provides rigorous, data-driven comparison of alternatives through controlled benchmarking, feature analysis, and comprehensive evaluation.

**Use Cases:**
- Compare web frameworks (Next.js vs Remix vs SvelteKit)
- Evaluate databases (PostgreSQL vs MySQL vs MongoDB)
- Test algorithm performance (sorting, searching, compression)
- Compare cloud providers (AWS vs GCP vs Azure)
- Evaluate state management solutions (Redux vs Zustand vs Jotai)
- Test API patterns (REST vs GraphQL vs gRPC)
- Compare ORMs (Prisma vs TypeORM vs Drizzle)


### Output Locations

All workflow outputs are saved to `.orchestr8/docs/` with proper categorization:

- `benchmark-plan.md` → `.orchestr8/docs/performance/benchmarks/benchmark-plan-YYYY-MM-DD.md`
- `candidates/` → `.orchestr8/docs/performance/benchmarks/candidates/`
- `test-scenarios.md` → `.orchestr8/docs/performance/benchmarks/test-scenarios-YYYY-MM-DD.md`
- `evaluation-criteria.md` → `.orchestr8/docs/performance/benchmarks/evaluation-criteria-YYYY-MM-DD.md`
- `benchmark-results.md` → `.orchestr8/docs/performance/benchmarks/results-YYYY-MM-DD.md`

## Workflow Phases

### Phase 1: Benchmark Definition (0-15%)

**Objective:** Define what to compare, how to compare, and what success looks like.

**Tasks:**

1. **Identify Candidates**
   - Parse comparison question
   - List all alternatives to compare (typically 3-5)
   - Validate candidates are comparable
   - Research current versions and maturity

2. **Define Comparison Dimensions**
   - Performance metrics (speed, memory, throughput)
   - Feature completeness
   - Developer experience
   - Ecosystem maturity
   - Learning curve
   - Community support
   - Cost (licensing, infrastructure)
   - Security posture
   - Maintainability

3. **Design Benchmarks**
   - Create realistic test scenarios
   - Define workload characteristics
   - Establish measurement methodology
   - Set up fair comparison environment
   - Define statistical rigor (sample size, iterations)

4. **Establish Baseline**
   - Define "acceptable" performance
   - Set minimum requirements
   - Identify deal-breakers
   - Weight comparison criteria

**Outputs:**
- `benchmark-plan.md` - Complete benchmark strategy
- `candidates/` - Directory with one file per candidate
  - `candidate-1-[name].md` - Overview and specifications
  - `candidate-2-[name].md`
  - `candidate-3-[name].md`
- `test-scenarios.md` - Test cases and workloads
- `evaluation-criteria.md` - Scoring methodology

**Example Benchmark Plan:**
```markdown
# Database Benchmark Plan

## Candidates
1. PostgreSQL 16 (relational)
2. MongoDB 7 (document)
3. DynamoDB (managed NoSQL)

## Test Scenarios
1. Simple CRUD operations (10k records)
2. Complex joins (5 tables, 100k records)
3. Full-text search (1M documents)
4. Concurrent writes (1k/sec)
5. Read-heavy workload (10k reads/sec)

## Performance Metrics
- Latency (p50, p95, p99)
- Throughput (ops/sec)
- Resource usage (CPU, memory, disk)
- Scalability (1x, 10x, 100x data)

## Feature Comparison
- ACID compliance
- Query language flexibility
- Schema flexibility
- Built-in features (FTS, JSON, GIS)
- Replication/HA options

## Environment
- AWS t3.medium instances
- Same region, same AZ
- Network isolated for fairness
- Clean install, default config
```

### Phase 2: Parallel Benchmark Execution (15-70%)

**Objective:** Run all benchmarks in parallel, collecting comprehensive performance and feature data.

**Execution Pattern:**
```
Main Orchestrator
  ├─→ Candidate 1 Benchmarker (parallel) → Results 1
  ├─→ Candidate 2 Benchmarker (parallel) → Results 2
  ├─→ Candidate 3 Benchmarker (parallel) → Results 3
  └─→ Candidate 4 Benchmarker (parallel) → Results 4

[All execute simultaneously in isolated environments]
```

**For Each Candidate:**

1. **Environment Setup**
   - Install candidate technology
   - Configure for production-like settings
   - Apply best practices for optimization
   - Warm up caches and connections

2. **Performance Benchmarking**
   - Run all test scenarios
   - Measure latency (p50, p95, p99)
   - Measure throughput (ops/sec, requests/sec)
   - Monitor resource usage (CPU, memory, disk, network)
   - Test under different loads (1x, 10x, 100x)
   - Stress test to find breaking points

3. **Feature Analysis**
   - Test each required feature
   - Assess ease of implementation
   - Document limitations discovered
   - Test edge cases and error handling
   - Evaluate documentation quality

4. **Developer Experience Assessment**
   - Setup time and complexity
   - API ergonomics
   - Debugging capabilities
   - Error messages quality
   - Tooling ecosystem
   - IDE support

5. **Operational Characteristics**
   - Deployment complexity
   - Monitoring capabilities
   - Backup/restore procedures
   - Upgrade path
   - Configuration management

**Benchmark Script Example:**
```python
# Automated benchmark runner
import time
import psutil
from statistics import mean, median, stdev

class Benchmarker:
    def __init__(self, candidate_name):
        self.name = candidate_name
        self.results = []

    def run_scenario(self, scenario_name, operation, iterations=1000):
        latencies = []

        # Warm up
        for _ in range(100):
            operation()

        # Measure
        for _ in range(iterations):
            start = time.perf_counter()
            operation()
            latencies.append((time.perf_counter() - start) * 1000)

        # Calculate statistics
        return {
            'scenario': scenario_name,
            'iterations': iterations,
            'p50': median(latencies),
            'p95': sorted(latencies)[int(0.95 * len(latencies))],
            'p99': sorted(latencies)[int(0.99 * len(latencies))],
            'mean': mean(latencies),
            'stddev': stdev(latencies),
            'min': min(latencies),
            'max': max(latencies)
        }

    def measure_throughput(self, operation, duration_sec=60):
        start = time.time()
        count = 0

        while time.time() - start < duration_sec:
            operation()
            count += 1

        return count / duration_sec  # ops/sec
```

**Outputs:**
- `results/candidate-1-[name]/`
  - `performance-metrics.json` - Raw performance data
  - `resource-usage.csv` - CPU, memory over time
  - `feature-test-results.md` - Feature completeness
  - `dev-experience-notes.md` - Qualitative assessment
- `results/candidate-2-[name]/` (same structure)
- `results/candidate-3-[name]/` (same structure)
- `benchmark-logs/` - Detailed execution logs
- `visualizations/` - Performance graphs

### Phase 3: Comparative Analysis (70-85%)

**Objective:** Analyze results, create comparison visualizations, and identify winner(s).

**Tasks:**

1. **Data Validation**
   - Verify benchmark ran correctly
   - Check for outliers or anomalies
   - Validate statistical significance
   - Ensure fair comparison (same conditions)

2. **Performance Comparison**
   - Create performance comparison charts
   - Calculate relative speedups/slowdowns
   - Identify performance leaders per scenario
   - Analyze resource efficiency

3. **Feature Matrix**
   - Build comprehensive feature comparison
   - Identify unique capabilities
   - Highlight gaps and limitations
   - Score feature completeness

4. **Trade-off Analysis**
   - Performance vs complexity
   - Features vs learning curve
   - Cost vs capabilities
   - Flexibility vs simplicity

5. **Recommendation Engine**
   - Score each candidate across all dimensions
   - Weight criteria by importance
   - Calculate overall scores
   - Identify best-fit scenarios for each

**Comparison Table Example:**
```markdown
## Performance Comparison

| Scenario              | PostgreSQL | MongoDB  | DynamoDB | Winner      |
|----------------------|------------|----------|----------|-------------|
| Simple CRUD (p95)    | 2.1ms      | 1.8ms    | 3.2ms    | MongoDB     |
| Complex Joins (p95)  | 45ms       | N/A      | N/A      | PostgreSQL  |
| Full-Text Search     | 120ms      | 85ms     | N/A      | MongoDB     |
| Concurrent Writes    | 8.5k/s     | 12k/s    | 25k/s    | DynamoDB    |
| Read-Heavy (p95)     | 1.5ms      | 1.2ms    | 0.8ms    | DynamoDB    |

## Resource Efficiency

| Metric               | PostgreSQL | MongoDB  | DynamoDB |
|---------------------|------------|----------|----------|
| Memory (10k records) | 256MB      | 512MB    | N/A      |
| CPU (avg load)       | 15%        | 25%      | N/A      |
| Disk (storage)       | 1.2GB      | 2.1GB    | Pay/use  |

## Feature Completeness (Score out of 10)

| Feature Category     | PostgreSQL | MongoDB  | DynamoDB |
|---------------------|------------|----------|----------|
| ACID Transactions   | 10         | 8        | 7        |
| Query Flexibility   | 10         | 7        | 5        |
| Schema Flexibility  | 6          | 10       | 9        |
| Scalability         | 7          | 8        | 10       |
| Built-in Features   | 9          | 7        | 6        |
| **Average**         | **8.4**    | **8.0**  | **7.4**  |

## Developer Experience (Score out of 10)

| Aspect              | PostgreSQL | MongoDB  | DynamoDB |
|--------------------|------------|----------|----------|
| Learning Curve      | 7          | 8        | 6        |
| Documentation       | 9          | 8        | 7        |
| Tooling             | 9          | 8        | 7        |
| Error Messages      | 8          | 7        | 6        |
| Community Support   | 10         | 9        | 7        |
| **Average**         | **8.6**    | **8.0**  | **6.6**  |

## Overall Weighted Score

| Candidate   | Performance | Features | DX  | Cost | Total  |
|------------|-------------|----------|-----|------|--------|
|            | (30%)       | (30%)    | 20% | 20%  |        |
| PostgreSQL | 7.2         | 8.4      | 8.6 | 9.0  | **8.1**|
| MongoDB    | 8.1         | 8.0      | 8.0 | 7.5  | **7.9**|
| DynamoDB   | 8.8         | 7.4      | 6.6 | 6.0  | **7.3**|
```

**Outputs:**
- `analysis/performance-comparison.md` - Detailed performance analysis
- `analysis/feature-matrix.md` - Feature-by-feature comparison
- `analysis/cost-analysis.md` - TCO comparison
- `analysis/trade-offs.md` - Pros/cons for each candidate
- `analysis/recommendation.md` - Final recommendation
- `visualizations/` - Charts and graphs
  - `latency-comparison.png`
  - `throughput-comparison.png`
  - `resource-usage.png`
  - `feature-radar.png`

### Phase 4: Reporting & Decision Support (85-100%)

**Objective:** Create actionable reports and decision-making materials.

**Tasks:**

1. **Executive Summary**
   - One-page overview
   - Clear winner(s) identified
   - Key differentiators highlighted
   - Recommendation justified

2. **Technical Deep Dive**
   - Complete benchmark methodology
   - Detailed results for each candidate
   - Statistical analysis
   - Reproducibility instructions

3. **Decision Matrix**
   - When to use each candidate
   - Best-fit scenarios
   - Migration considerations
   - Risk assessment

4. **Implementation Guide**
   - Getting started with winner
   - Best practices
   - Common pitfalls
   - Performance tuning tips

**Outputs:**
- `executive-summary.md` - 1-page summary for stakeholders
- `technical-report.md` - Comprehensive findings
- `decision-matrix.md` - Scenario-based recommendations
- `getting-started-with-[winner].md` - Implementation guide
- `benchmark-reproducibility.md` - How to reproduce benchmarks
- `presentation/` - Stakeholder presentation deck

## Agent Coordination

### Agent Selection by Benchmark Type

**Framework/Library Benchmarks:**
- Primary: Framework specialists (React, Vue, etc.)
- Secondary: `performance-analyzer`, `frontend-developer`

**Database Benchmarks:**
- Primary: `database-specialist`, DB-specific specialists
- Secondary: `performance-analyzer`, `backend-developer`

**Cloud Provider Benchmarks:**
- Primary: Cloud specialists (AWS, GCP, Azure)
- Secondary: `cost-optimizer`, `infrastructure-engineer`

**Algorithm Benchmarks:**
- Primary: Language specialists
- Secondary: `performance-analyzer`, domain experts

**API Pattern Benchmarks:**
- Primary: `api-designer`, `backend-developer`
- Secondary: `performance-analyzer`, `architect`

### Parallel Execution Pattern

```
1. Define benchmark plan (sequential)
2. Launch benchmarking in parallel:
   - Single message with N Task tool calls (one per candidate)
   - Each agent runs complete benchmark suite
   - Each outputs to separate results directory
   - All execute simultaneously for maximum speed
3. Aggregate and analyze results (sequential)
4. Generate reports (sequential)
```

**Speed Advantage:**
- Sequential: 4 candidates × 3 hours each = 12 hours
- Parallel: 4 candidates in parallel = 3 hours (4x speedup)

## Success Criteria

Benchmark is complete when:
- All candidates tested under identical conditions
- Performance metrics collected systematically
- Feature completeness assessed objectively
- Developer experience documented
- Cost analysis completed
- Statistical significance validated
- Clear recommendation made
- Results reproducible
- Decision support materials prepared

## Quality Gates

### Gate 1: Benchmark Validity
- All candidates tested under same conditions
- Sufficient sample size for statistical validity
- No confounding variables
- Fair comparison methodology

### Gate 2: Data Quality
- Outliers identified and explained
- Results reproducible
- Measurements accurate
- No systematic bias

### Gate 3: Analysis Quality
- Comparison is objective
- Trade-offs acknowledged
- Limitations documented
- Recommendation is evidence-based

## Example Usage

### Example 1: Web Framework Comparison
```
/orchestr8:benchmark "Compare Next.js, Remix, and SvelteKit for building our new dashboard"

Benchmarks Run:
- Build time and bundle size
- Initial page load (Lighthouse)
- Time to Interactive (TTI)
- Client-side navigation speed
- Data fetching patterns
- Developer productivity (measured task completion)
- TypeScript support quality
- Deployment complexity

Results:
- Next.js: Best ecosystem, largest bundle
- Remix: Best data loading, steeper learning curve
- SvelteKit: Smallest bundle, fastest builds, smaller ecosystem

Recommendation: Next.js
Rationale: Mature ecosystem, team familiarity, best documentation
Trade-off: 15% larger bundle acceptable for better DX
```

### Example 2: Database ORM Comparison
```
/orchestr8:benchmark "Should we use Prisma, Drizzle, or TypeORM?"

Benchmarks Run:
- Query performance (simple, complex, joins)
- Type safety quality
- Schema migration experience
- Generated SQL quality
- Learning curve (measured)
- Bundle size impact

Results:
- Prisma: Best DX, slower queries, schema-first
- Drizzle: Fastest queries, type-safe, code-first
- TypeORM: Most features, complex API, decorator-based

Recommendation: Drizzle
Rationale: 2x faster queries, excellent type safety, minimal overhead
Trade-off: Smaller ecosystem than Prisma
```

### Example 3: State Management Comparison
```
/orchestr8:benchmark "Compare Redux Toolkit, Zustand, and Jotai for React state"

Benchmarks Run:
- Bundle size impact
- Render performance (1k components)
- DevTools quality
- Learning curve
- Boilerplate required
- TypeScript support

Results:
- Redux Toolkit: Most features, most boilerplate, 8KB
- Zustand: Simple API, good performance, 1KB
- Jotai: Atomic, minimal re-renders, 3KB

Recommendation: Zustand
Rationale: Best balance of simplicity and features, 1KB bundle
Trade-off: Less mature ecosystem than Redux
```

## Best Practices

### DO
- Test 3-5 candidates for meaningful comparison
- Use realistic workloads and data sizes
- Run benchmarks multiple times for statistical validity
- Test under production-like conditions
- Document methodology for reproducibility
- Consider both quantitative and qualitative factors
- Weight criteria by business importance
- Acknowledge trade-offs honestly
- Provide scenario-based recommendations

### DON'T
- Cherry-pick favorable benchmarks
- Use toy workloads that don't reflect reality
- Compare different versions or configurations
- Ignore developer experience factors
- Forget to measure resource usage
- Skip cost analysis
- Make recommendations without data
- Assume benchmarks from internet are accurate

## Integration with Knowledge Base

All benchmark results are stored for future reference:

```bash
# Store benchmark results
db_store_knowledge "benchmark" "$CATEGORY" "$COMPARISON_TOPIC" \
  "Benchmark results for $CANDIDATES" \
  "$(cat technical-report.md)"

# Store winning approach
db_store_knowledge "benchmark" "recommended-choice" "$WINNER" \
  "Winner of $COMPARISON with evidence" \
  "$(cat recommendation.md)"

# Query similar past benchmarks
db_query_knowledge "benchmark" "$CATEGORY" 10
```

## Fire-and-Forget Pattern

This workflow supports async execution for long-running benchmarks:

```bash
# Launch benchmark in background
/orchestr8:benchmark "Compare PostgreSQL vs MongoDB vs DynamoDB for our use case"

# Workflow runs autonomously:
# - Sets up isolated test environments
# - Runs comprehensive benchmarks
# - Analyzes results
# - Generates recommendation

# Returns when complete with full report and decision matrix
```

## Advanced Features

### Automated Benchmark Reproduction

All benchmarks include reproduction scripts:

```bash
# Run benchmark yourself
cd benchmark-reproducibility/
./setup-candidate-1.sh
./run-benchmark.sh candidate-1
./analyze-results.sh
```

### Continuous Benchmarking

Benchmarks can be scheduled to track performance over time:

```yaml
# .github/workflows/continuous-benchmark.yml
name: Weekly Framework Benchmark
on:
  schedule:
    - cron: '0 0 * * 0'  # Every Sunday

jobs:
  benchmark:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Benchmark
        run: ./orchestr8-benchmark.sh "Compare framework versions"
      - name: Store Results
        run: ./store-benchmark-history.sh
```

## Notes

- Benchmarks are time-boxed: typically 3-6 hours for complete workflow
- Focus on realistic workloads: synthetic benchmarks can be misleading
- Document all assumptions and constraints
- Consider total cost of ownership, not just performance
- Remember: "The best tool is the one your team knows well"
- Results are a snapshot: re-benchmark as technologies evolve
- Fire-and-forget execution allows long-running benchmarks without blocking
- Statistical rigor is important: run multiple iterations, calculate confidence intervals

**Remember:** Benchmarks inform decisions but don't make them. Consider team expertise, ecosystem maturity, and long-term maintainability alongside raw performance numbers.
