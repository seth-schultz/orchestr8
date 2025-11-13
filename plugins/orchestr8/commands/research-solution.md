---
description: Research multiple solution approaches for a problem and recommend best
  option with evidence
argument-hint:
- problem-description
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

# Research Solution: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "orchestr8"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Solution Researcher** responsible for exploring multiple solution approaches and recommending the best option with empirical evidence.

This command is an alias for the `/orchestr8:research` workflow, optimized for solution discovery.

## Dynamic Resource Loading (JIT Pattern)

This workflow uses **Just-In-Time (JIT) resource loading** for maximum token efficiency:

**Traditional Approach (WASTEFUL):**
- Load all research agents upfront: ~12,000 tokens
- Load all analysis skills: ~8,000 tokens
- Load all comparison patterns: ~5,000 tokens
- **Total: ~25,000 tokens loaded, only ~15% used**

**JIT Approach (OPTIMAL):**
- Load lightweight resource catalog: ~300 tokens
- Dynamically fetch only needed expertise: ~2,200 tokens
- **Total: ~2,500 tokens - 90% reduction!**

### Resources Loaded On-Demand

The delegated research workflow will load these resources progressively:

```
# Phase 1: Hypothesis Formation
orchestr8://registry                              # Lightweight catalog (~300 tokens)
orchestr8://agents/research-specialist            # Research methodology (~800 tokens)
orchestr8://skills/requirement-analysis-framework # Problem analysis (~600 tokens)

# Phase 2: Parallel Testing (per approach)
orchestr8://match?query=<technology>+implementation&mode=index&maxResults=8

# Phase 3: Comparative Analysis
orchestr8://skills/competitive-analysis           # Comparison framework (~700 tokens)
orchestr8://skills/technology-evaluation          # Evaluation criteria (~600 tokens)

# Phase 4: Recommendation
orchestr8://patterns/trade-off-analysis-framework # Decision framework (~500 tokens)
```

**Token Efficiency:**
- Without JIT: ~25,000 tokens loaded upfront
- With JIT: ~2,500 tokens loaded progressively
- **Savings: 90% fewer tokens**

## Use This When

You have a problem and want to explore multiple solution approaches before implementing.

## Workflow Execution

This command delegates immediately to `/orchestr8:research` with the same parameters.

The research workflow will:
- Generate multiple solution hypotheses (typically 3-5 alternatives)
- Prototype and test each approach in parallel
- Collect empirical evidence (performance, complexity, cost, etc.)
- Perform comparative analysis with scoring matrix
- Recommend optimal solution with implementation roadmap

## Example Usage

```
/orchestr8:research-solution "How should we implement real-time notifications? Push notifications, WebSockets, Server-Sent Events, or polling?"
```

This will:
1. Analyze your problem statement
2. Generate 3-5 solution hypotheses (may include approaches you didn't mention)
3. Test each approach with prototypes
4. Collect empirical evidence on performance, complexity, and cost
5. Compare solutions with weighted scoring
6. Recommend the best solution with confidence levels
7. Provide implementation roadmap

## What You Get

- **Hypothesis formulation** - Multiple solution approaches identified
- **Parallel testing** - All approaches tested simultaneously (3-5x faster)
- **Empirical evidence** - Real data, not opinions
- **Comparison matrix** - Weighted scoring across all criteria
- **Clear recommendation** - Best solution with justification
- **Implementation roadmap** - How to implement the winning approach

## Difference from Other Commands

- `research-solution`: Focus on finding the best solution for a specific problem
- `research`: General research workflow (broader scope)
- `compare-approaches`: You specify exact approaches to compare
- `explore-alternatives`: More open-ended exploration of possibilities

## See Also

`/orchestr8:research` for complete workflow documentation.
