---
description: Search and retrieve organizational knowledge across patterns, anti-patterns,
  performance baselines, assumptions, technology comparisons, and refactoring opportunities
argument-hint: '[query] [optional-category]'
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

# Knowledge Search: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Knowledge Retriever** responsible for searching the organizational knowledge base to find patterns, anti-patterns, performance insights, validated assumptions, technology decisions, and refactoring opportunities relevant to current work.

## Search Modes

### 1. Full-Text Search
Default mode. Searches across all knowledge content.

### 2. Category-Specific Search
Searches within a specific knowledge category:
- `patterns`
- `anti-patterns`
- `performance-baselines`
- `assumptions-validated`
- `technology-comparisons`
- `refactoring-opportunities`

### 3. Top Refactorings
Special search that returns refactoring opportunities ranked by ROI.

### 4. Knowledge Statistics
Returns knowledge base statistics and health metrics.

## Phase 1: Initialize and Parse Query (0-10%)

**Activities:**
- Load knowledge system
- Parse search request
- Identify search mode (full-text, category-specific, special)
- Validate search parameters

**→ Checkpoint:** Search parameters validated

## Phase 2: Execute Search (10-40%)

**→ Load:** orchestr8://match?query=knowledge+search+retrieval&categories=skill&mode=index&maxResults=3

**Activities:**
- Execute search based on query type
- Find all matching knowledge items
- Rank by relevance
- Filter by category if specified
- Count results

**→ Checkpoint:** Search executed, results found

## Phase 3: Analyze and Rank Results (40-75%)

**→ Load:** orchestr8://agents/knowledge-base-agent

**Activities:**
- Read and analyze all matching knowledge items
- Rank by relevance to the query
- Synthesize findings into actionable insights
- Identify patterns across multiple knowledge items
- Highlight anti-patterns to avoid
- Provide confidence levels
- Generate comprehensive research report

**→ Checkpoint:** Results analyzed and synthesized

## Phase 4: Present Findings (75-100%)

**Activities:**
- Display research report with:
  - Summary of findings
  - Relevant patterns (with confidence scores)
  - Anti-patterns to avoid (with severity)
  - Performance insights (if applicable)
  - Validated assumptions (if applicable)
  - Technology decisions (if applicable)
  - Top refactorings (if applicable)
  - Recommendations based on evidence
  - Knowledge gaps identified
  - References to all source files
- Provide next steps
- Suggest related searches

**→ Checkpoint:** Research report presented

## Success Criteria

✅ Search query executed successfully
✅ All matching knowledge items found
✅ Results analyzed for relevance and quality
✅ Findings synthesized into actionable insights
✅ Patterns identified and ranked by confidence
✅ Anti-patterns highlighted with severity
✅ Recommendations provided with evidence
✅ Source files referenced for deep dive
✅ Knowledge gaps explicitly identified
✅ Next steps clearly articulated

## Example Usage

### Pre-Implementation Research
```
/orchestr8:knowledge-search "authentication OAuth2"
```

### Find Anti-Patterns
```
/orchestr8:knowledge-search "database queries" "anti-patterns"
```

### Check Performance Baselines
```
/orchestr8:knowledge-search "api" "performance-baselines"
```

### Get Top Refactoring Opportunities
```
/orchestr8:knowledge-search "refactorings"
```

### Knowledge Base Statistics
```
/orchestr8:knowledge-search "stats"
```

## Integration with Development Workflow

**Before Implementation:**
Review patterns and anti-patterns before starting work.

**During Code Review:**
Check if identified issues are known anti-patterns.

**During Performance Optimization:**
Compare current performance to baselines.

**During Architecture Design:**
Learn from past architectural decisions.

**During Sprint Planning:**
Identify high-ROI refactoring opportunities to schedule.
