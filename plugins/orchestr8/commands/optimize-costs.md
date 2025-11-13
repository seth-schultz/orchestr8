---
description: Comprehensive cloud cost optimization covering right-sizing, storage,
  reserved capacity, auto-scaling, and FinOps governance
argument-hint:
- infrastructure-description
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- Write
---

# Optimize Costs: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Cost Optimizer** responsible for comprehensive cloud cost optimization from analysis to implementation with continuous monitoring.

## Phase 1: Cost Analysis & Discovery (0-15%)

**→ Load:** orchestr8://match?query=cost+analysis+cloud+finops&categories=skill,guide&mode=index&maxResults=5

**Activities:**
- Analyze current cloud costs by service
- Identify top cost drivers
- Detect cost anomalies and waste
- Benchmark against industry standards
- Set optimization goals and targets

**→ Checkpoint:** Cost analysis complete with baseline

## Phase 2: Right-Sizing Analysis (15-30%)

**→ Load:** orchestr8://match?query=right-sizing+cloud+resources&categories=skill,guide&mode=index&maxResults=5

**Activities:**
- Analyze resource utilization (CPU, memory, disk)
- Identify oversized instances
- Recommend optimal instance types
- Calculate potential savings
- Prioritize by impact

**→ Checkpoint:** Right-sizing recommendations ready

## Phase 3: Storage Optimization (30-45%)

**→ Load:** orchestr8://match?query=storage+optimization+lifecycle&categories=skill,guide&mode=index&maxResults=3

**Activities:**
- Analyze storage usage patterns
- Implement lifecycle policies
- Optimize S3/blob storage tiers
- Clean up unused volumes and snapshots
- Compress and deduplicate data

**→ Checkpoint:** Storage optimized

## Phase 4: Reserved Capacity & Savings Plans (45-60%)

**→ Load:** orchestr8://match?query=reserved+instances+savings+plans&categories=skill,guide&mode=index&maxResults=3

**Activities:**
- Analyze usage patterns for commitment discounts
- Recommend reserved instances or savings plans
- Calculate ROI for commitments
- Implement reservation strategy
- Track utilization

**→ Checkpoint:** Commitment discounts implemented

## Phase 5: Auto-Scaling & Scheduling (60-75%)

**→ Load:** orchestr8://match?query=auto-scaling+scheduling+elasticity&categories=skill,pattern&mode=index&maxResults=3

**Activities:**
- Configure auto-scaling policies
- Implement resource scheduling (dev/test environments)
- Set up scale-to-zero for non-production
- Optimize load balancing
- Test scaling behavior

**→ Checkpoint:** Auto-scaling and scheduling active

## Phase 6: Networking & Data Transfer (75-85%)

**→ Load:** orchestr8://match?query=network+optimization+data+transfer&categories=skill&mode=index&maxResults=3

**Activities:**
- Optimize data transfer costs
- Configure CDN caching
- Reduce cross-region traffic
- Optimize VPN/Direct Connect
- Minimize egress charges

**→ Checkpoint:** Network costs optimized

## Phase 7: FinOps Monitoring & Governance (85-100%)

**→ Load:** orchestr8://workflows/workflow-optimize-costs

**Activities:**
- Set up cost monitoring dashboards
- Configure budget alerts
- Implement tagging strategy
- Create cost allocation reports
- Establish FinOps governance

**→ Checkpoint:** FinOps monitoring in place

## Success Criteria

✅ Cost baseline established
✅ Top cost drivers identified
✅ Right-sizing implemented
✅ Storage optimized with lifecycle policies
✅ Reserved capacity or savings plans active
✅ Auto-scaling and scheduling configured
✅ Network costs reduced
✅ Cost monitoring and alerting active
✅ 30-60% cost reduction achieved
✅ FinOps governance established
