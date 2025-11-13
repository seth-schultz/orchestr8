---
description: Validate architectural assumptions and design decisions through empirical
  testing
argument-hint:
- architectural-assumptions
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

# Validate Architecture: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Architecture Validator** responsible for testing architectural assumptions and design decisions through empirical validation.

This command is an alias for the `/orchestr8:validate-assumptions` workflow, optimized for architecture validation.

## Dynamic Resource Loading (JIT Pattern)

This workflow uses **Just-In-Time (JIT) resource loading** for maximum token efficiency:

**Traditional Approach (WASTEFUL):**
- Load all architecture agents upfront: ~15,000 tokens
- Load all validation skills: ~10,000 tokens
- Load all testing patterns: ~8,000 tokens
- **Total: ~33,000 tokens loaded, only ~12% used**

**JIT Approach (OPTIMAL):**
- Load lightweight resource catalog: ~300 tokens
- Dynamically fetch only needed expertise: ~2,900 tokens
- **Total: ~3,200 tokens - 90% reduction!**

### Resources Loaded On-Demand

The delegated validation workflow will load these resources progressively:

```
# Phase 1: Assumption Identification
orchestr8://registry                                   # Lightweight catalog (~300 tokens)
orchestr8://agents/research-specialist                 # Hypothesis formulation (~800 tokens)
orchestr8://skills/requirement-analysis-framework      # Assumption extraction (~600 tokens)

# Phase 2: Test Design (per assumption type)
orchestr8://match?query=<architecture>+validation&mode=index&maxResults=8

# Examples based on assumption type:
orchestr8://skills/performance-profiling-techniques    # For performance assumptions (~700 tokens)
orchestr8://skills/observability-metrics-prometheus    # For monitoring assumptions (~600 tokens)
orchestr8://patterns/architecture-decision-records     # For design decisions (~800 tokens)

# Phase 3: Validation Execution
orchestr8://match?query=testing+benchmark+validation&mode=index&maxResults=5

# Phase 4: Risk Assessment
orchestr8://patterns/trade-off-analysis-framework      # Risk evaluation (~500 tokens)
```

**Token Efficiency:**
- Without JIT: ~33,000 tokens loaded upfront
- With JIT: ~3,200 tokens loaded progressively
- **Savings: 90% fewer tokens**

## Use This When

You have architectural assumptions or design decisions that need empirical validation before committing to implementation.

## Common Architectural Assumptions to Validate

- **Performance:** "API can handle 10k requests/sec"
- **Scalability:** "Database can efficiently store 100M records"
- **Cost:** "Infrastructure will cost <$5k/month at target scale"
- **Technology:** "Framework X supports all our required features"
- **Integration:** "System can integrate with legacy SOAP APIs"
- **Reliability:** "Microservices won't add >50ms latency per hop"

## Workflow Execution

This command delegates immediately to `/orchestr8:validate-assumptions` with focus on architectural assumptions.

The validation workflow will:
- Identify critical architectural assumptions (stated and implicit)
- Classify by type (performance, scalability, cost, capability, etc.)
- Validate each assumption through controlled experiments
- Collect empirical evidence (pass/fail with confidence levels)
- Assess risk if assumptions prove false
- Provide mitigation strategies for invalidated assumptions

## Example Usage

```
/orchestr8:validate-architecture "
1. Our microservices architecture can handle 50k req/sec with <100ms latency
2. Kubernetes complexity is manageable for our 5-person team
3. Service mesh overhead won't exceed 10ms
4. Inter-service communication won't create reliability issues
5. Cost will stay under $10k/month at production scale
"
```

This will test each assumption empirically and provide:
- Validated assumptions (proceed with confidence)
- Invalidated assumptions (with mitigation options)
- Uncertain assumptions (needs more testing or accept risk)

## Difference from General Validation

- `validate-architecture`: Focus on system architecture and design decisions
- `validate-assumptions`: Broader scope (can include business, UX, or technical assumptions)

## See Also

`/orchestr8:validate-assumptions` for complete workflow documentation.
