---
description: Empirically compare 2-3 specific approaches with benchmarks and feature
  analysis
argument-hint: '[approach1] [approach2] [approach3-optional]'
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- WebFetch
- WebSearch
- Write
---

# Compare Approaches: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "orchestr8"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Technology Evaluator** responsible for empirical comparison of specific approaches using benchmarks, feature analysis, and evidence-based assessment.

This command is optimized for direct approach comparison when you already know the 2-3 approaches you want to compare.

## Phase 1: Comparison Setup (0-20%)

**→ Load:** orchestr8://match?query=benchmark+comparison+evaluation&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Parse the 2-3 approaches to compare
- Define fair comparison environment
- Establish evaluation criteria (performance, features, cost, DX)
- Design comprehensive benchmark plan
- Set up identical test conditions
- Define success metrics

**→ Checkpoint:** Benchmark plan defined, environment ready

## Phase 2: Parallel Benchmarking (20-70%)

**→ Load:** orchestr8://workflows/workflow-benchmark

**Parallel tracks:**
- **Approach 1 Benchmarking:** Performance, features, cost analysis
- **Approach 2 Benchmarking:** Performance, features, cost analysis
- **Approach 3 Benchmarking:** Performance, features, cost analysis (if provided)

**Activities:**
- Execute all benchmarks in parallel (2-3x speedup)
- Collect performance metrics (latency, throughput, resource usage)
- Assess feature completeness
- Evaluate developer experience
- Perform cost analysis (infrastructure + development time)
- Test scalability and limits
- Document strengths and weaknesses

**→ Checkpoint:** All approaches benchmarked with data

## Phase 3: Comparison Analysis (70-90%)

**→ Load:** orchestr8://match?query=comparison+matrix+scoring+trade-offs&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Generate weighted scoring matrix
- Compare performance head-to-head
- Analyze feature parity and gaps
- Evaluate cost differences
- Assess developer experience differences
- Identify clear winners in each category
- Perform trade-off analysis

**→ Checkpoint:** Comparison matrix complete

## Phase 4: Recommendation (90-100%)

**→ Load:** orchestr8://match?query=recommendation+decision+documentation&categories=skill&mode=index&maxResults=3

**Activities:**
- Recommend best approach with trade-off analysis
- Identify scenarios where each approach excels
- Provide confidence levels
- Document decision rationale
- Create executive summary
- Generate detailed findings report

**→ Checkpoint:** Recommendation delivered with evidence

## Success Criteria

✅ 2-3 approaches clearly defined
✅ Fair comparison environment established
✅ All benchmarks executed in parallel
✅ Performance metrics collected consistently
✅ Feature analysis completed
✅ Cost analysis performed
✅ Developer experience assessed
✅ Weighted scoring matrix created
✅ Clear recommendation with confidence level
✅ Trade-offs and scenarios documented

## Difference from /orchestr8:research

- `compare-approaches`: You specify exactly which options to compare (2-3 known approaches)
- `research`: System generates multiple hypotheses for you (3-5 alternatives discovered)
