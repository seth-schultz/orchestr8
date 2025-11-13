---
description: Multi-approach exploration workflow for discovering optimal solutions
  through parallel experimentation
argument-hint:
- problem-or-goal
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

# Explore Alternatives: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Solution Explorer** responsible for discovering and evaluating multiple solution approaches in parallel, optimizing for the best outcome across multiple dimensions.

## Phase 1: Problem Framing & Solution Discovery (0-20%)

**→ Load:** orchestr8://match?query=problem+analysis+solution+discovery&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Deeply analyze the problem or goal
- Generate diverse solution alternatives (5-10 ideas)
- Apply creative discovery techniques (analogical, combinatorial, extreme thinking)
- Filter to top 4-6 alternatives for deep exploration
- Define comprehensive evaluation framework with weighted criteria

**→ Checkpoint:** 4-6 alternatives discovered with evaluation framework

## Phase 2: Parallel Alternative Exploration (20-65%)

**→ Load:** orchestr8://workflows/workflow-explore-alternatives

**Parallel tracks:**
- **Alternative 1 Exploration:** Prototype, benchmark, analyze, score
- **Alternative 2 Exploration:** Prototype, benchmark, analyze, score
- **Alternative 3 Exploration:** Prototype, benchmark, analyze, score
- **Alternative 4 Exploration:** Prototype, benchmark, analyze, score (if exists)
- **Alternative 5 Exploration:** Prototype, benchmark, analyze, score (if exists)
- **Alternative 6 Exploration:** Prototype, benchmark, analyze, score (if exists)

**Activities:**
- Implement minimal viable prototypes
- Perform empirical testing and benchmarking
- Conduct qualitative assessment (complexity, maintainability, DX)
- Perform cost analysis (infrastructure, development, maintenance)
- Evaluate risks and mitigation strategies
- Score against evaluation framework with evidence

**→ Checkpoint:** All alternatives explored with prototypes and scores

## Phase 3: Multi-Criteria Evaluation (65-85%)

**→ Load:** orchestr8://match?query=evaluation+comparison+trade-offs+pareto&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Aggregate exploration results
- Create multi-criteria decision matrix with weighted scoring
- Perform trade-off analysis (performance vs complexity, cost vs capabilities)
- Identify Pareto-optimal solutions
- Conduct sensitivity analysis (ranking robustness to weight changes)
- Generate scenario-based recommendations

**→ Checkpoint:** Multi-criteria evaluation complete with scoring matrix

## Phase 4: Recommendation & Implementation Roadmap (85-100%)

**→ Load:** orchestr8://match?query=recommendation+implementation+roadmap+adr&categories=skill&mode=index&maxResults=3

**Activities:**
- Formulate primary recommendation with evidence
- Create scenario-based guidance (if X is critical → Alternative Y)
- Build phased implementation roadmap
- Document decision rationale (ADR)
- Develop risk mitigation plan
- Capture knowledge for future use

**→ Checkpoint:** Recommendation delivered with implementation roadmap

## Success Criteria

✅ Problem clearly defined with constraints
✅ Diverse alternatives discovered (4-6 explored)
✅ Each alternative prototyped and tested
✅ Empirical performance data collected
✅ Multi-criteria evaluation completed
✅ Clear recommendation made with evidence
✅ Implementation roadmap defined
✅ Risks identified and mitigated
✅ Knowledge captured for reuse

## Evaluation Dimensions

- **Performance** (speed, throughput, latency)
- **Implementation Complexity** (LOC, concepts, learning curve)
- **Cost** (infrastructure, development time, licensing)
- **Maintainability** (debugging ease, operational burden)
- **Risk** (technical risk, business risk, team capability)
- **Scalability** (growth potential)

## Example Usage

### API Design Pattern
```
/orchestr8:explore-alternatives "Best API design for our mobile app backend?"

Alternatives: REST, GraphQL, gRPC, tRPC, REST+GraphQL hybrid
Recommendation: GraphQL (best DX, reduces over-fetching by 40%)
```

### State Management
```
/orchestr8:explore-alternatives "State management for complex React dashboard?"

Alternatives: Redux Toolkit, Zustand, Jotai, TanStack Query, XState, Hybrid
Recommendation: Zustand + TanStack Query (best performance, simple APIs)
```
