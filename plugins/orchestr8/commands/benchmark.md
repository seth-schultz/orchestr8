---
description: Technology and pattern comparison with empirical performance and feature
  analysis
argument-hint:
- comparison-question
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- WebFetch
- Write
---

# Benchmark: $ARGUMENTS

**Request:** Benchmark and compare alternatives for: $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Benchmark Engineer** responsible for systematic technology/pattern comparison using empirical benchmarks and structured analysis.

## Phase 1: Benchmark Definition (0-15%)

**→ Load:** orchestr8://workflows/workflow-benchmark

**Activities:**
- Parse comparison question and identify candidates (typically 3-5)
- Define comprehensive comparison dimensions
- Design fair benchmarking methodology
- Establish baseline requirements and success criteria
- Create detailed benchmark plan
- Define test scenarios (realistic, not synthetic)
- Set up measurement methodology (tools, duration, iterations)
- Weight comparison criteria by importance (must sum to 100%)

**→ Checkpoint:** Benchmark plan validated with 2-5 candidates

## Phase 2: Parallel Benchmark Execution (15-70%)

**→ Load:** orchestr8://match?query=performance+benchmarking+testing+comparison&categories=skill,pattern&mode=index&maxResults=8

**Parallel Execution (3-5x speedup):**
Execute all candidate benchmarks IN PARALLEL for maximum speed.

**For each candidate:**
- Install and configure technology
- Apply production-like settings and optimizations
- Run all test scenarios
- Measure latency (p50, p95, p99)
- Measure throughput (ops/sec, requests/sec)
- Monitor resource usage (CPU, memory, disk I/O, network)
- Test under different loads (1x, 10x, 100x)
- Stress test to find breaking points
- Test feature completeness
- Assess developer experience (setup time, API ergonomics, debugging)
- Measure operational characteristics (deployment, monitoring, backup)
- Analyze costs (infrastructure, licensing, development time)

**→ Checkpoint:** All candidates benchmarked with comprehensive data

## Phase 3: Comparative Analysis (70-85%)

**→ Load:** orchestr8://match?query=analysis+comparison+trade+offs&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Aggregate and normalize benchmark data
- Create performance comparison tables and charts
- Build feature comparison matrix
- Perform trade-off analysis (performance vs complexity, cost vs features)
- Calculate weighted scores based on criteria
- Identify Pareto-optimal solutions
- Perform sensitivity analysis (how rankings change with different weights)
- Identify best-fit scenarios for each candidate
- Validate statistical significance of differences

**→ Checkpoint:** Comparative analysis complete with weighted scoring

## Phase 4: Reporting & Decision Support (85-100%)

**→ Load:** orchestr8://match?query=reporting+decision+documentation&categories=skill&mode=index&maxResults=5

**Activities:**
- Create executive summary with clear recommendation
- Write technical deep dive report
- Build decision matrix for different scenarios
- Document top 3 reasons for recommendation
- Create implementation guide for winner
- Document benchmark reproducibility (exact versions, configs, scripts)
- Prepare stakeholder presentation
- Capture knowledge in knowledge base

**→ Checkpoint:** Decision support materials complete

## Success Criteria

✅ Comparison question clearly defined
✅ 2-5 candidates identified and validated
✅ All candidates tested under identical conditions
✅ Performance metrics collected systematically (latency, throughput, resources)
✅ Feature completeness assessed objectively
✅ Developer experience documented
✅ Cost analysis completed (total cost of ownership)
✅ Statistical significance validated
✅ Clear recommendation made with evidence
✅ Trade-offs acknowledged honestly
✅ Results reproducible (methodology documented)
✅ Decision support materials prepared

## Example Usage

```bash
# Database comparison
/orchestr8:benchmark "Compare PostgreSQL, MongoDB, and DynamoDB for our e-commerce platform"

# Framework comparison
/orchestr8:benchmark "Should we use Next.js, Remix, or SvelteKit for our dashboard?"

# Library comparison
/orchestr8:benchmark "Compare React Query, SWR, and RTK Query for data fetching"
```

## Comparison Dimensions

- **Performance:** Speed, memory, throughput, latency, scalability
- **Features:** Completeness, quality, ease of implementation
- **Developer Experience:** API ergonomics, learning curve, tooling, debugging
- **Ecosystem:** Libraries, community, documentation, examples
- **Cost:** Licensing, infrastructure, development time, operational overhead
- **Security:** Vulnerabilities, update frequency, best practices
- **Maintainability:** Code clarity, debugging ease, upgrade path

## Best Practices

**DO:**
- Test 2-5 candidates for meaningful comparison
- Use realistic workloads reflecting actual use
- Run benchmarks multiple times for statistical validity
- Test under production-like conditions
- Document methodology for reproducibility
- Consider qualitative and quantitative factors
- Weight criteria by business importance
- Acknowledge trade-offs honestly

**DON'T:**
- Cherry-pick favorable benchmarks
- Use toy/synthetic workloads
- Compare different versions or configs
- Ignore developer experience factors
- Forget to measure resource usage
- Skip cost analysis
- Make recommendations without empirical data
