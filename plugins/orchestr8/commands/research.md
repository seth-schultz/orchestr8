---
description: Parallel hypothesis testing workflow for exploring multiple approaches
  simultaneously
argument-hint:
- research-question-or-problem
allowed-tools:
- Bash
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- WebFetch
- WebSearch
- Write
---

# Research Workflow


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Research Orchestrator** responsible for systematic hypothesis testing and evidence-based decision making. You will formulate testable hypotheses, test them in parallel, analyze results, and generate recommendations.

## Phase 1: Hypothesis Formulation (0-15%)

**→ Load:** orchestr8://match?query=research+hypothesis+testing+requirements&categories=pattern,skill&mode=index&maxResults=5

**Activities:**
- Parse research question deeply
- Generate 3-5 testable hypotheses or alternative approaches
- Define success criteria for each hypothesis
- Establish evaluation methodology
- Design experiments to test each hypothesis
- Plan for parallel hypothesis testing

**→ Checkpoint:** 3-5 hypotheses formulated with test plans

## Phase 2: Parallel Hypothesis Testing (15-70%)

**→ Load:** orchestr8://workflows/workflow-research

**Parallel tracks:**
- **Hypothesis 1 Testing:** Prototype, benchmark, gather evidence
- **Hypothesis 2 Testing:** Prototype, benchmark, gather evidence
- **Hypothesis 3 Testing:** Prototype, benchmark, gather evidence
- **Hypothesis 4 Testing:** Prototype, benchmark, gather evidence (if exists)
- **Hypothesis 5 Testing:** Prototype, benchmark, gather evidence (if exists)

**Activities:**
- Implement minimal viable prototypes for each hypothesis
- Run defined test scenarios
- Measure performance metrics (latency, throughput, resource usage)
- Collect quantitative and qualitative data
- Test edge cases and failure modes
- Document pros, cons, and unexpected findings
- Gather empirical evidence

**→ Checkpoint:** All hypotheses tested with empirical data

## Phase 3: Comparative Analysis (70-85%)

**→ Load:** orchestr8://match?query=analysis+comparison+trade-offs+decision&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Aggregate results from all hypothesis tests
- Normalize metrics for fair comparison
- Create comparison matrix with weighted scoring
- Identify Pareto-optimal solutions
- Perform risk assessment for each approach
- Conduct cost-benefit analysis
- Perform sensitivity analysis

**→ Checkpoint:** Comparison matrix complete with scoring

## Phase 4: Recommendation & Knowledge Capture (85-100%)

**→ Load:** orchestr8://match?query=recommendation+decision+records+documentation&categories=skill,guide&mode=index&maxResults=5

**Activities:**
- Formulate evidence-based recommendation
- Identify scenarios where each approach works best
- Create implementation roadmap for winning approach
- Document decision rationale (ADR format)
- Capture learnings in knowledge base
- Generate executive summary
- Create stakeholder presentation materials

**→ Checkpoint:** Recommendation complete with evidence and roadmap

## Success Criteria

✅ Research question clearly defined
✅ 3-5 testable hypotheses formulated
✅ All hypotheses tested with empirical evidence
✅ Quantitative metrics collected for each approach
✅ Qualitative observations documented
✅ Comparative analysis completed objectively
✅ Clear recommendation made with justification
✅ Trade-offs and risks acknowledged
✅ Implementation roadmap defined
✅ Knowledge captured in reusable format
✅ Stakeholder materials prepared
