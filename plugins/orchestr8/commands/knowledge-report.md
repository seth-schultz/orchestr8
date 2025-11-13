---
description: Generate comprehensive knowledge base reports with visualizations, trends,
  and insights for organizational learning
argument-hint: '[report-type] [optional-filters]'
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

# Knowledge Report: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "orchestr8"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Knowledge Analyst** responsible for generating comprehensive reports from the organizational knowledge base to visualize patterns, track trends, identify gaps, and measure learning effectiveness.

## Report Types

### 1. Full Knowledge Base Report
Comprehensive overview of all knowledge captured.

### 2. Pattern Effectiveness Report
Analysis of pattern success rates and confidence scores.

### 3. Anti-Pattern Frequency Report
Most common anti-patterns and their impact.

### 4. Performance Trends Report
Performance baseline trends over time.

### 5. Refactoring ROI Analysis
Refactoring opportunities ranked by ROI.

### 6. Knowledge Health Report
Health metrics for the knowledge base.

### 7. Learning Effectiveness Report
Metrics showing how knowledge is improving outcomes.

## Phase 1: Initialize (0-10%)

**Activities:**
- Load knowledge systems
- Parse report type
- Identify required data sources
- Validate report type

**→ Checkpoint:** System initialized, report type identified

## Phase 2: Data Collection (10-40%)

**→ Load:** orchestr8://match?query=data+analysis+metrics+statistics&categories=skill&mode=index&maxResults=5

**Activities:**
- Collect knowledge statistics
- Parse frontmatter from all knowledge items
- Extract metrics based on report type
- Aggregate data for analysis
- Sort and rank items

**→ Checkpoint:** Data collected and aggregated

## Phase 3: Analysis and Visualization (40-80%)

**→ Load:** orchestr8://agents/knowledge-base-agent

**Activities:**
- Analyze collected data
- Identify trends and patterns
- Generate insights and recommendations
- Create visualizations (text-based charts)
- Calculate health metrics
- Identify knowledge gaps
- Compute ROI for refactorings
- Track performance trends

**→ Checkpoint:** Analysis complete with visualizations

## Phase 4: Report Generation (80-100%)

**Activities:**
- Generate final report with:
  - Executive Summary
  - Knowledge Health Metrics (coverage, quality, utilization)
  - Pattern Effectiveness (top patterns, confidence distribution)
  - Anti-Pattern Impact (frequency, severity, avoidance rate)
  - Performance Insights (baselines, trends, optimizations)
  - Validated Assumptions (validation status, high-impact)
  - Technology Decisions (outcomes, lessons learned)
  - Refactoring Pipeline (ROI distribution, top opportunities)
  - Learning Effectiveness (growth, reuse, impact)
  - Knowledge Gaps (underrepresented categories, missing data)
  - Recommendations (prioritized, actionable)
- Format for readability
- Provide actionable next steps

**→ Checkpoint:** Report generated and delivered

## Success Criteria

✅ All requested data collected
✅ Analysis performed with statistical rigor
✅ Trends identified and visualized
✅ Health metrics calculated
✅ Insights and recommendations provided
✅ Gaps explicitly identified
✅ Report formatted for readability
✅ Actionable next steps provided

## Example Report Structure

```markdown
# Organizational Knowledge Base Report

Generated: [timestamp]

## Executive Summary

Total Knowledge Items: [count]
- Patterns: [count] (avg confidence: [score])
- Anti-Patterns: [count] (avg severity: [level])
- Performance Baselines: [count]
- Validated Assumptions: [count]
- Technology Comparisons: [count]
- Refactoring Opportunities: [count]

## Knowledge Health Metrics

### Coverage
- Categories covered: [count/6]
- Knowledge density: [items per category]
- Staleness: [% items not updated in 6+ months]

### Quality
- Average pattern confidence: [0.0-1.0]
- Evidence-based items: [%]
- Cross-referenced items: [%]

### Utilization
- Items referenced in last 30 days: [count]
- Knowledge reuse rate: [%]
- New knowledge captured: [count in last 30 days]

[... additional sections ...]

## Recommendations

### High Priority
1. [Recommendation 1]
2. [Recommendation 2]

### Medium Priority
1. [Recommendation 1]
2. [Recommendation 2]

### Low Priority
1. [Recommendation 1]
2. [Recommendation 2]
```

## Integration

**Monthly Review:**
```
/orchestr8:knowledge-report full
```

**Sprint Planning:**
```
/orchestr8:knowledge-report refactorings
```

**Architecture Review:**
```
/orchestr8:knowledge-report patterns
/orchestr8:knowledge-report anti-patterns
```

**Performance Review:**
```
/orchestr8:knowledge-report performance
```
