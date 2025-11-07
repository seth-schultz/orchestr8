---
description: Search and retrieve organizational knowledge across patterns, anti-patterns, performance baselines, assumptions, technology comparisons, and refactoring opportunities
argument-hint: [query] [optional-category]
model: claude-sonnet-4-5-20250929
---

# Knowledge Search Command

Search the organizational knowledge base to find patterns, anti-patterns, performance insights, validated assumptions, technology decisions, and refactoring opportunities relevant to your current work.

## Usage

```bash
# Search across all categories
/orchestr8:knowledge-search "authentication"

# Search specific category
/orchestr8:knowledge-search "microservices" "patterns"

# Search for anti-patterns
/orchestr8:knowledge-search "N+1 queries" "anti-patterns"

# Search for performance baselines
/orchestr8:knowledge-search "api" "performance-baselines"

# Get top refactoring opportunities
/orchestr8:knowledge-search "refactorings"
```

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

## Execution Instructions

### Phase 1: Initialize and Parse Query (5%)

**Load knowledge system**:
```bash
source .claude/knowledge/lib/knowledge-capture.sh
init_knowledge_system
```

**Parse search request**:
```bash
QUERY="$1"
CATEGORY="${2:-all}"

if [ -z "$QUERY" ]; then
  echo "Error: Search query not provided"
  exit 1
fi

echo "Searching knowledge base..."
echo "Query: $QUERY"
echo "Category: $CATEGORY"
echo ""
```

**CHECKPOINT**: Search parameters validated ✓

### Phase 2: Execute Search (40%)

**Search based on query type**:

#### For Standard Search
```bash
if [ "$QUERY" = "refactorings" ]; then
  # Special case: top refactorings
  echo "=== Top Refactoring Opportunities (by ROI) ==="
  get_top_refactorings 10
elif [ "$QUERY" = "stats" ]; then
  # Special case: knowledge statistics
  knowledge_stats
elif [ "$CATEGORY" = "all" ]; then
  # Search across all categories
  search_knowledge "$QUERY"
else
  # Search specific category
  search_knowledge "$QUERY" "$CATEGORY"
fi > /tmp/knowledge-search-results.txt

RESULT_COUNT=$(wc -l < /tmp/knowledge-search-results.txt)
echo "Found $RESULT_COUNT matching knowledge items"
echo ""
```

**CHECKPOINT**: Search executed ✓

### Phase 3: Process and Rank Results (30%)

**Use knowledge-researcher agent to analyze results**:

Invoke the knowledge-researcher agent with:
```
Task: Analyze and synthesize knowledge search results

Query: $QUERY
Category: $CATEGORY
Results: $(cat /tmp/knowledge-search-results.txt)

Instructions:
1. Read and analyze all matching knowledge items
2. Rank by relevance to the query
3. Synthesize findings into actionable insights
4. Identify patterns across multiple knowledge items
5. Highlight anti-patterns to avoid
6. Provide confidence levels
7. Generate comprehensive research report

Output: Knowledge research report with:
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
```

**CHECKPOINT**: Results analyzed and synthesized ✓

### Phase 4: Present Findings (25%)

**Display research report**:

The knowledge-researcher agent will provide a comprehensive report. Display it with:

```bash
echo ""
echo "=== Knowledge Research Report ==="
echo ""
# Report content from knowledge-researcher agent
echo ""
```

**Provide next steps**:
```bash
echo ""
echo "=== Next Steps ==="
echo ""
echo "1. Review recommended patterns and apply where appropriate"
echo "2. Avoid identified anti-patterns in your implementation"
echo "3. Consider performance baselines when setting targets"
echo "4. Use validated assumptions to guide decisions"
echo "5. Learn from past technology decisions"
echo "6. Prioritize high-ROI refactoring opportunities"
echo "7. Capture new knowledge as you work: /orchestr8:knowledge-capture"
echo "8. Update existing knowledge items with new evidence"
echo ""
```

**CHECKPOINT**: Research report presented ✓

## Success Criteria

Knowledge search is complete when:
- ✅ Search query executed successfully
- ✅ All matching knowledge items found
- ✅ Results analyzed for relevance and quality
- ✅ Findings synthesized into actionable insights
- ✅ Patterns identified and ranked by confidence
- ✅ Anti-patterns highlighted with severity
- ✅ Recommendations provided with evidence
- ✅ Source files referenced for deep dive
- ✅ Knowledge gaps explicitly identified
- ✅ Next steps clearly articulated

## Example Usage

### Example 1: Pre-Implementation Research
```bash
/orchestr8:knowledge-search "authentication OAuth2"
```

**Autonomous execution**:
1. Parse query (5%)
2. Search across all categories for "authentication" and "OAuth2" (40%)
3. Invoke knowledge-researcher to analyze results (30%)
4. Present comprehensive research report (25%)

**Expected output**:
```
=== Knowledge Research Report ===

Summary:
Found 5 patterns, 2 anti-patterns, and 1 technology comparison related to authentication and OAuth2.

Relevant Patterns:

1. OAuth2 with JWT Tokens (Confidence: 0.9)
   - Problem: Stateless authentication for APIs
   - Solution: OAuth2 flow with JWT access tokens
   - Success Rate: 0.95
   - Recommendation: Apply - proven pattern with high success rate
   - Source: .claude/knowledge/patterns/pattern-security-oauth2-jwt-1699876543.md

2. Refresh Token Rotation (Confidence: 0.85)
   - Problem: Long-lived tokens security risk
   - Solution: Rotate refresh tokens on every use
   - Success Rate: 0.9
   - Recommendation: Apply - enhances security significantly
   - Source: .claude/knowledge/patterns/pattern-security-refresh-rotation-1699876544.md

Anti-Patterns to Avoid:

1. Storing JWT in localStorage (Severity: High)
   - Why Avoid: Vulnerable to XSS attacks
   - Alternative: Use httpOnly cookies
   - Failure Rate: 0.4 (40% of implementations had security issues)
   - Source: .claude/knowledge/anti-patterns/anti-pattern-security-jwt-localstorage-1699876545.md

Technology Decisions:

1. Auth0 vs Custom OAuth2 Implementation
   - Context: User authentication for SaaS product
   - Decision: Auth0
   - Rationale: Faster time to market, better security, lower maintenance
   - Outcome: Positive - saved 3 months development time
   - Source: .claude/knowledge/technology-comparisons/comparison-auth-auth0-vs-custom-1699876546.md

Recommendations:

1. Use OAuth2 with JWT pattern (High confidence)
   - Based on: 5 successful implementations
   - Action: Implement OAuth2 flow with JWT access tokens and refresh token rotation

2. Avoid storing tokens in localStorage (Critical)
   - Based on: 40% failure rate, high security risk
   - Action: Use httpOnly cookies for token storage

3. Consider Auth0 for faster implementation (Medium confidence)
   - Based on: 1 successful comparison, 3 months time savings
   - Action: Evaluate Auth0 vs custom implementation based on budget and timeline

Next Steps:
1. Review full pattern implementations in source files
2. Implement OAuth2 with JWT following documented pattern
3. Use httpOnly cookies for token storage
4. Set up refresh token rotation
5. Consider Auth0 for managed authentication
```

**Duration**: ~1-2 minutes

### Example 2: Performance Optimization Research
```bash
/orchestr8:knowledge-search "database queries" "anti-patterns"
```

**Expected output**:
```
=== Knowledge Research Report ===

Summary:
Found 3 anti-patterns related to database queries.

Anti-Patterns to Avoid:

1. N+1 Query Problem (Severity: High)
   - Why Avoid: Causes exponential query growth
   - Performance Impact: 50-100x degradation
   - Alternative: Use eager loading with JOINs
   - Occurrences: 15 times observed
   - Source: .claude/knowledge/anti-patterns/anti-pattern-performance-n-plus-1-1699876547.md

2. Missing Database Indexes (Severity: High)
   - Why Avoid: Full table scans on large tables
   - Performance Impact: Query time increases linearly with data
   - Alternative: Add indexes on frequently queried columns
   - Source: .claude/knowledge/anti-patterns/anti-pattern-performance-missing-indexes-1699876548.md

3. SELECT * in Production (Severity: Medium)
   - Why Avoid: Fetches unnecessary data, wastes bandwidth
   - Performance Impact: 2-5x more data transferred
   - Alternative: Select only needed columns
   - Source: .claude/knowledge/anti-patterns/anti-pattern-performance-select-star-1699876549.md

Recommendations:

1. Check for N+1 queries in ORM code (Critical)
   - Use query logging to identify
   - Refactor to use eager loading or batch loading

2. Ensure indexes exist on foreign keys and frequently queried columns (High priority)
   - Run EXPLAIN on slow queries
   - Add indexes based on query patterns

3. Avoid SELECT * in production code (Medium priority)
   - Specify exact columns needed
   - Reduces bandwidth and improves performance
```

**Duration**: ~1 minute

### Example 3: Architecture Decision Research
```bash
/orchestr8:knowledge-search "microservices" "patterns"
```

**Expected output**:
```
=== Knowledge Research Report ===

Summary:
Found 8 patterns related to microservices architecture.

Relevant Patterns:

1. API Gateway Pattern (Confidence: 0.95)
   - Problem: Multiple microservices need single entry point
   - Solution: Centralized API Gateway for routing and cross-cutting concerns
   - Success Rate: 0.98
   - Contexts: [microservices, distributed-systems, api-management]
   - Recommendation: Apply - essential for microservices

2. Circuit Breaker Pattern (Confidence: 0.9)
   - Problem: Cascading failures in distributed systems
   - Solution: Circuit breaker to prevent calls to failing services
   - Success Rate: 0.92
   - Recommendation: Apply - critical for resilience

3. Event-Driven Architecture (Confidence: 0.85)
   - Problem: Tight coupling between services
   - Solution: Services communicate via events
   - Success Rate: 0.88
   - Recommendation: Consider - reduces coupling significantly

[... more patterns ...]

Recommendations:

1. Implement API Gateway (High confidence, essential)
2. Add Circuit Breaker for resilience (High confidence, critical)
3. Consider event-driven architecture for loose coupling (Medium confidence, beneficial)
```

**Duration**: ~1-2 minutes

### Example 4: Get Top Refactoring Opportunities
```bash
/orchestr8:knowledge-search "refactorings"
```

**Expected output**:
```
=== Top Refactoring Opportunities (by ROI) ===

1. ROI: 4.0 | Priority: high | Component: auth-service
   Split monolithic auth service into focused services
   Effort: 3 days | Impact: high
   File: .claude/knowledge/refactoring-opportunities/refactor-maintainability-auth-service-1699876550.md

2. ROI: 3.5 | Priority: high | Component: api-gateway
   Add caching layer to reduce database load
   Effort: 2 days | Impact: high
   File: .claude/knowledge/refactoring-opportunities/refactor-performance-api-caching-1699876551.md

3. ROI: 2.8 | Priority: medium | Component: user-service
   Extract user notification logic to separate service
   Effort: 4 days | Impact: medium
   File: .claude/knowledge/refactoring-opportunities/refactor-architecture-notifications-1699876552.md

[... more refactorings ...]

Recommendations:

1. Prioritize auth-service refactoring (ROI: 4.0)
   - High impact on maintainability
   - Reasonable effort (3 days)
   - Will unblock other improvements

2. Implement API caching next (ROI: 3.5)
   - Significant performance improvement
   - Quick win (2 days)
   - Reduces infrastructure costs
```

**Duration**: ~30 seconds

### Example 5: Knowledge Base Statistics
```bash
/orchestr8:knowledge-search "stats"
```

**Expected output**:
```
=== Knowledge Base Statistics ===

Patterns: 45
Anti-Patterns: 23
Performance Baselines: 12
Validated Assumptions: 8
Technology Comparisons: 15
Refactoring Opportunities: 31

Total Knowledge Items: 134

Knowledge Health:
- Average confidence (patterns): 0.78
- Coverage by category: Balanced
- Recent updates (last 30 days): 18 items
- Staleness: 12 items not updated in 6+ months

Recommendations:
- Review and update stale knowledge items
- Capture more validated assumptions (low count)
- Continue pattern documentation (good coverage)
```

**Duration**: ~10 seconds

## Anti-Patterns

### DON'T ❌
- Search without specific query (too broad)
- Ignore low-confidence results (may still provide value)
- Skip reading source files for full context
- Apply patterns without understanding context
- Forget to capture new knowledge discovered during research

### DO ✅
- Use specific, targeted search queries
- Review full knowledge items for context and details
- Consider confidence levels and evidence strength
- Apply patterns appropriate to your context
- Cross-reference multiple knowledge sources
- Capture new patterns or anti-patterns you discover
- Update existing knowledge with new evidence
- Use research findings to inform decisions

## Integration with Development Workflow

**Before Implementation**:
```bash
/orchestr8:knowledge-search "[technology/domain]"
```
Review patterns and anti-patterns before starting work.

**During Code Review**:
```bash
/orchestr8:knowledge-search "[code issue]" "anti-patterns"
```
Check if identified issues are known anti-patterns.

**During Performance Optimization**:
```bash
/orchestr8:knowledge-search "[component]" "performance-baselines"
```
Compare current performance to baselines.

**During Architecture Design**:
```bash
/orchestr8:knowledge-search "[architecture style]" "patterns"
/orchestr8:knowledge-search "[technology]" "technology-comparisons"
```
Learn from past architectural decisions.

**During Sprint Planning**:
```bash
/orchestr8:knowledge-search "refactorings"
```
Identify high-ROI refactoring opportunities to schedule.

## Notes

- Search uses fuzzy matching - similar terms will be found
- Results are ranked by relevance and confidence
- Source files are always referenced for deep dive
- Knowledge base grows over time - recent searches may find more results
- Use knowledge-researcher agent for complex research questions
- Combine with /orchestr8:knowledge-capture to build organizational memory
