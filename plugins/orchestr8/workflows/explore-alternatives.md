---
description: Multi-approach exploration workflow for discovering optimal solutions through parallel experimentation
argument-hint: [problem-or-goal]
model: claude-sonnet-4-5-20250929
---

# Explore Alternatives Workflow

Comprehensive exploration workflow for discovering and evaluating multiple solution approaches in parallel, optimizing for the best outcome across multiple dimensions.

## Overview

This workflow explores the solution space systematically, discovering diverse alternatives and identifying optimal approaches through parallel experimentation and multi-criteria evaluation.

**Use Cases:**
- Find optimal algorithm for a specific problem
- Discover best data structure for use case
- Explore UI/UX design alternatives
- Identify optimal API design pattern
- Find best deployment strategy
- Discover performance optimization approaches
- Explore architectural patterns for system
- Identify best testing strategy

**Key Difference from /research:**
- **Research:** Tests predefined hypotheses
- **Explore-alternatives:** Discovers solutions creatively, then evaluates


### Output Locations

All workflow outputs are saved to `.orchestr8/docs/` with proper categorization:

- `alternatives-analysis.md` → `.orchestr8/docs/research/alternatives/analysis-YYYY-MM-DD.md`
- `comparison-matrix.md` → `.orchestr8/docs/research/alternatives/comparison-YYYY-MM-DD.md`
- `recommendation.md` → `.orchestr8/docs/research/alternatives/recommendation-YYYY-MM-DD.md`
- `detailed-evaluations/` → `.orchestr8/docs/research/alternatives/evaluations/`

## Workflow Phases

### Phase 1: Problem Framing & Solution Discovery (0-20%)

**Objective:** Deeply understand the problem and generate diverse solution alternatives.

**Tasks:**

1. **Problem Analysis**
   - Parse problem statement or goal
   - Identify constraints and requirements
   - Define success criteria
   - Establish evaluation dimensions
   - Identify non-functional requirements

2. **Solution Space Exploration**
   - Brainstorm diverse approaches
   - Research existing solutions
   - Consider unconventional alternatives
   - Look at solutions from other domains
   - Generate 5-10 candidate approaches

3. **Alternative Generation Strategies**
   - **Analogical:** What solutions exist in similar domains?
   - **Combinatorial:** Can we combine existing approaches?
   - **Constraint Relaxation:** What if we removed constraint X?
   - **Extreme Thinking:** What would extreme solutions look like?
   - **Pattern-Based:** Which design patterns apply?

4. **Initial Filtering**
   - Eliminate obviously infeasible approaches
   - Group similar alternatives
   - Identify most promising 4-6 alternatives
   - Define evaluation criteria

**Outputs:**
- `problem-analysis.md` - Deep problem understanding
- `solution-space.md` - All alternatives considered
- `alternatives/` - Directory with one file per alternative
  - `alternative-1-[name].md`
  - `alternative-2-[name].md`
  - `alternative-3-[name].md`
  - `alternative-4-[name].md`
- `evaluation-framework.md` - How to compare alternatives

**Example Problem Analysis:**
```markdown
# Problem: Optimize API Response Time

## Current Situation
- API responding in 500ms (p95)
- Need to reduce to <100ms (p95)
- 5k requests/second peak load
- Database queries are bottleneck (400ms avg)

## Constraints
- Cannot change database technology (PostgreSQL)
- Budget: $2k/month additional infrastructure
- Team: 3 backend developers
- Timeline: 4 weeks to implement

## Success Criteria
- p95 latency <100ms
- Maintain 5k req/sec throughput
- No data consistency issues
- Cost within budget
- Implementation within timeline

## Evaluation Dimensions
1. Performance improvement (weight: 35%)
2. Implementation complexity (weight: 20%)
3. Cost (weight: 15%)
4. Maintainability (weight: 15%)
5. Risk (weight: 15%)
```

**Example Solution Space:**
```markdown
# Alternative Solutions

## Alternative 1: Query Optimization + Database Indexing
**Approach:** Optimize slow queries, add strategic indexes
**Rationale:** Address root cause directly
**Expected Impact:** 50-70% latency reduction
**Complexity:** Low
**Cost:** $0
**Risk:** Low

## Alternative 2: Redis Caching Layer
**Approach:** Cache frequent queries with TTL
**Rationale:** Reduce database load
**Expected Impact:** 80-90% latency reduction (cache hits)
**Complexity:** Medium
**Cost:** $200/month (ElastiCache)
**Risk:** Medium (cache invalidation complexity)

## Alternative 3: Read Replicas + Query Routing
**Approach:** Distribute read load across replicas
**Rationale:** Scale database horizontally
**Expected Impact:** 60-80% latency reduction
**Complexity:** Medium-High
**Cost:** $800/month (2 replicas)
**Risk:** Medium (replication lag)

## Alternative 4: Response Caching at CDN
**Approach:** Cache entire responses at edge
**Rationale:** Serve from edge locations
**Expected Impact:** 95% latency reduction (cacheable requests)
**Complexity:** Low
**Cost:** $300/month (CloudFront)
**Risk:** Low (only works for cacheable responses)

## Alternative 5: Async Processing + Webhooks
**Approach:** Process async, notify when complete
**Rationale:** Move slow operations out of request path
**Expected Impact:** 100% API latency reduction
**Complexity:** High (requires client changes)
**Cost:** $100/month (queuing system)
**Risk:** High (changes API contract)

## Alternative 6: Materialized Views
**Approach:** Pre-compute expensive queries
**Rationale:** Trade freshness for speed
**Expected Impact:** 90% latency reduction
**Complexity:** Medium
**Cost:** $0 (uses existing DB)
**Risk:** Medium (data freshness concerns)

## Alternative 7: Hybrid Approach
**Approach:** Combine #1 (query opt) + #2 (caching) + #4 (CDN)
**Rationale:** Multi-layered optimization
**Expected Impact:** 95% latency reduction
**Complexity:** Medium-High
**Cost:** $500/month
**Risk:** Medium

## Selected for Deep Exploration (Top 5)
1. Alternative 1: Query Optimization
2. Alternative 2: Redis Caching
3. Alternative 6: Materialized Views
4. Alternative 7: Hybrid Approach
5. Alternative 3: Read Replicas
```

### Phase 2: Parallel Alternative Exploration (20-65%)

**Objective:** Deeply explore each alternative through prototyping and empirical testing.

**Execution Pattern:**
```
Main Orchestrator
  ├─→ Alternative 1 Explorer (parallel) → Prototype + Results
  ├─→ Alternative 2 Explorer (parallel) → Prototype + Results
  ├─→ Alternative 3 Explorer (parallel) → Prototype + Results
  ├─→ Alternative 4 Explorer (parallel) → Prototype + Results
  └─→ Alternative 5 Explorer (parallel) → Prototype + Results

[All execute simultaneously with isolated resources]
```

**For Each Alternative:**

1. **Prototype Development**
   - Implement minimal viable version
   - Focus on critical aspects
   - Use representative data
   - Apply best practices for approach

2. **Empirical Testing**
   - Performance benchmarking
   - Load testing
   - Edge case testing
   - Failure mode testing
   - Resource utilization measurement

3. **Qualitative Assessment**
   - Implementation complexity (LOC, concepts)
   - Code maintainability
   - Developer experience
   - Operational complexity
   - Debugging difficulty

4. **Cost Analysis**
   - Infrastructure costs
   - Development time
   - Ongoing maintenance
   - Training requirements

5. **Risk Evaluation**
   - Technical risks
   - Operational risks
   - Business risks
   - Mitigation strategies

**Exploration Depth by Alternative:**
- **High Promise:** Full prototype + comprehensive testing
- **Medium Promise:** Focused prototype + targeted testing
- **Low Promise:** Analytical assessment + minimal testing

**Example Exploration (Redis Caching):**
```python
# Alternative 2: Redis Caching Layer

# Prototype Implementation
import redis
import json
from functools import wraps

cache = redis.Redis(host='localhost', port=6379, decode_responses=True)

def cached(ttl_seconds=300):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Create cache key
            cache_key = f"{func.__name__}:{json.dumps(args)}:{json.dumps(kwargs)}"

            # Check cache
            cached_result = cache.get(cache_key)
            if cached_result:
                return json.loads(cached_result)

            # Execute and cache
            result = func(*args, **kwargs)
            cache.setex(cache_key, ttl_seconds, json.dumps(result))
            return result
        return wrapper
    return decorator

# Apply to expensive endpoint
@cached(ttl_seconds=60)
def get_user_dashboard(user_id):
    # Expensive database queries here
    pass

# Benchmark Results
# Without cache: 450ms avg, 520ms p95
# With cache (hit): 3ms avg, 5ms p95
# With cache (miss): 455ms avg, 525ms p95
# Cache hit rate: 87% (in production simulation)
# Effective latency: 0.87 * 5ms + 0.13 * 525ms = 72ms p95 ✅

# Complexity Analysis
# Lines of code added: 45
# New dependencies: redis-py
# Operational complexity: Medium (need to manage cache invalidation)
# Learning curve: Low (team familiar with Redis)

# Cost Analysis
# ElastiCache r6g.large: $175/month
# Additional monitoring: $25/month
# Total: $200/month ✅

# Risks
# - Cache invalidation bugs (Medium risk)
#   Mitigation: Comprehensive invalidation tests, TTL safety net
# - Redis failure (Low risk)
#   Mitigation: Fallback to database on cache miss
# - Memory pressure (Low risk)
#   Mitigation: LRU eviction policy, monitoring alerts
```

**Outputs:**
- `explorations/alternative-1-[name]/`
  - `prototype/` - Proof-of-concept code
  - `benchmarks.md` - Performance results
  - `analysis.md` - Deep analysis
  - `trade-offs.md` - Pros and cons
  - `recommendation.md` - Viability assessment
- `explorations/alternative-2-[name]/` (same structure)
- `explorations/alternative-3-[name]/` (same structure)
- `comparative-data/` - Raw data for comparison

### Phase 3: Multi-Criteria Evaluation (65-80%)

**Objective:** Compare alternatives systematically across all evaluation dimensions.

**Tasks:**

1. **Data Normalization**
   - Aggregate results from all alternatives
   - Normalize metrics for comparison
   - Handle missing data
   - Validate consistency

2. **Scoring Framework**
   - Define scoring scale (0-10 or 0-100)
   - Score each alternative on each dimension
   - Apply dimension weights
   - Calculate overall scores

3. **Trade-off Analysis**
   - Identify Pareto-optimal solutions
   - Analyze trade-offs between dimensions
   - Consider risk-adjusted scores
   - Identify scenario-dependent winners

4. **Sensitivity Analysis**
   - How do scores change with weight adjustments?
   - Which alternatives are robust?
   - Which are sensitive to assumptions?

**Multi-Criteria Decision Matrix:**
```markdown
# Alternative Comparison Matrix

## Raw Scores (0-10 scale)

| Criterion               | Weight | Alt1:Query | Alt2:Redis | Alt3:Replicas | Alt6:MatViews | Alt7:Hybrid |
|------------------------|--------|------------|------------|---------------|---------------|-------------|
| **Performance**         | 35%    | 6          | 9          | 7             | 9             | 10          |
| - Latency Reduction     |        | 5          | 9          | 7             | 9             | 10          |
| - Throughput            |        | 7          | 9          | 8             | 9             | 10          |
| - Consistency           |        | 10         | 7          | 6             | 8             | 8           |
| **Implementation**      | 20%    | 9          | 7          | 5             | 6             | 4           |
| - Complexity            |        | 9          | 7          | 5             | 6             | 3           |
| - Development Time      |        | 10         | 8          | 4             | 7             | 4           |
| - Code Maintainability  |        | 8          | 7          | 6             | 5             | 5           |
| **Cost**                | 15%    | 10         | 9          | 4             | 10            | 7           |
| - Infrastructure        |        | 10         | 9          | 3             | 10            | 7           |
| - Operational           |        | 10         | 8          | 5             | 10            | 7           |
| **Maintainability**     | 15%    | 8          | 6          | 5             | 7             | 5           |
| - Debugging Ease        |        | 9          | 6          | 4             | 7             | 4           |
| - Operational Burden    |        | 9          | 7          | 5             | 8             | 5           |
| - Monitoring Required   |        | 7          | 6          | 6             | 6             | 6           |
| **Risk**                | 15%    | 9          | 7          | 6             | 7             | 6           |
| - Technical Risk        |        | 9          | 7          | 6             | 7             | 5           |
| - Operational Risk      |        | 9          | 8          | 5             | 7             | 6           |
| - Business Risk         |        | 8          | 6          | 7             | 7             | 7           |
| **WEIGHTED TOTAL**      |        | **7.85**   | **7.95**   | **6.05**      | **7.85**      | **7.45**    |

## Detailed Breakdown

### Alternative 1: Query Optimization (Score: 7.85)
**Strengths:**
- Zero cost solution
- Low risk, battle-tested approach
- Easy to maintain and debug
- Quick to implement (1 week)

**Weaknesses:**
- Moderate performance gain (60% improvement)
- May not meet <100ms target alone
- Limited scalability ceiling

**Best For:** First step, foundational optimization

### Alternative 2: Redis Caching (Score: 7.95) ⭐ WINNER
**Strengths:**
- Excellent performance (95% reduction on cache hits)
- Reasonable cost ($200/month)
- Proven technology, team familiar
- Achieves <100ms target

**Weaknesses:**
- Cache invalidation complexity
- Additional infrastructure to manage
- Only helps cached queries

**Best For:** Read-heavy APIs with cacheable responses

### Alternative 6: Materialized Views (Score: 7.85)
**Strengths:**
- Excellent performance
- Zero infrastructure cost
- Uses existing database
- Good for complex aggregations

**Weaknesses:**
- Data freshness concerns
- Refresh strategy complexity
- Not suitable for real-time data

**Best For:** Analytics and reporting queries

### Alternative 7: Hybrid Approach (Score: 7.45)
**Strengths:**
- Best absolute performance
- Multi-layered defense
- Handles diverse use cases

**Weaknesses:**
- High implementation complexity
- Multiple systems to maintain
- Longer development time (4 weeks)
- Higher cost ($500/month)

**Best For:** Mission-critical APIs needing maximum performance

## Pareto Analysis

Pareto-optimal alternatives (not strictly dominated):
- Alternative 1: Best on cost and simplicity
- Alternative 2: Best balance of performance and complexity
- Alternative 7: Best absolute performance

Dominated alternatives (strictly worse than another):
- Alternative 3: Worse than Alt2 on all dimensions

## Sensitivity Analysis

If we increase Performance weight to 50% (from 35%):
- Alternative 7 becomes winner (8.13)
- Alternative 2 drops to second (8.08)

If we increase Cost weight to 30% (from 15%):
- Alternative 1 becomes winner (8.25)
- Alternative 2 drops to third (7.55)

**Robustness:** Alternative 2 (Redis) scores well across most weight scenarios
```

**Outputs:**
- `evaluation/scoring-matrix.md` - Detailed scores
- `evaluation/trade-off-analysis.md` - Trade-off insights
- `evaluation/sensitivity-analysis.md` - Robustness testing
- `evaluation/pareto-frontier.md` - Optimal alternatives
- `visualizations/` - Comparison charts
  - `radar-chart.png` - Multi-dimensional comparison
  - `scatter-plot.png` - Performance vs complexity
  - `cost-benefit.png` - Cost vs benefit analysis

### Phase 4: Recommendation & Implementation Roadmap (80-100%)

**Objective:** Make evidence-based recommendation and provide clear implementation path.

**Tasks:**

1. **Primary Recommendation**
   - Identify top-ranked alternative
   - Justify selection with evidence
   - Acknowledge limitations and trade-offs
   - Define success metrics

2. **Scenario-Based Recommendations**
   - "If performance is critical..." → Alternative X
   - "If budget is tight..." → Alternative Y
   - "If time is limited..." → Alternative Z
   - Hybrid approaches to consider

3. **Implementation Roadmap**
   - Phase 1: Quick wins (Alternative 1)
   - Phase 2: High-impact changes (Alternative 2)
   - Phase 3: Advanced optimizations (Alternative 7)
   - Timeline and resource requirements

4. **Risk Mitigation Plan**
   - For each identified risk, define:
     - Probability and impact
     - Mitigation strategy
     - Contingency plan
     - Monitoring approach

5. **Knowledge Capture**
   - Document exploration process
   - Capture lessons learned
   - Create decision record
   - Store reusable patterns

**Outputs:**
- `recommendation.md` - Primary recommendation with evidence
- `scenario-guide.md` - When to use which alternative
- `implementation-roadmap.md` - Phased rollout plan
- `risk-mitigation.md` - Risk management strategy
- `decision-record.md` - ADR documenting decision
- `knowledge-base/` - Captured patterns and learnings

**Example Recommendation:**
```markdown
# Recommendation: Phased Approach

## Phase 1 (Week 1): Query Optimization
**Alternative 1**
- Implement immediately
- Zero cost, low risk
- Expected: 60% latency reduction (500ms → 200ms p95)
- Foundation for further optimization

## Phase 2 (Weeks 2-3): Redis Caching
**Alternative 2**
- Build on Phase 1 optimizations
- $200/month cost
- Expected: Additional 80% reduction (200ms → 40ms p95 effective)
- Achieves <100ms target ✅

## Phase 3 (Month 2+): Advanced Optimizations (Optional)
**Alternative 7 (Hybrid)**
- Only if needed for further improvement
- Evaluate after Phase 2 results
- Additional $300/month
- Expected: 30-60ms p95

## Total Impact
- Timeline: 3 weeks to production
- Cost: $200/month (Phase 2 only)
- Performance: 500ms → 40ms p95 (92% reduction) ✅
- Risk: Low (battle-tested technologies)

## Success Metrics
- p95 latency <100ms ✅
- Cache hit rate >80%
- Zero data consistency issues
- Cost <$2k/month ✅
- Implemented within 4 weeks ✅

## Why This Approach?
1. **Progressive de-risking:** Start simple, add complexity only if needed
2. **Quick wins:** Phase 1 delivers value in Week 1
3. **Cost-effective:** Achieves goals for $200/month
4. **Reversible:** Can roll back caching if issues arise
5. **Team-appropriate:** Matches team skills and timeline
```

## Agent Coordination

### Agent Selection by Problem Type

**Performance Problems:**
- Primary: `performance-analyzer`
- Secondary: `backend-developer`, `database-specialist`

**Architecture Problems:**
- Primary: `architect`
- Secondary: Domain specialists, `fullstack-developer`

**Algorithm Problems:**
- Primary: Language specialists, domain experts
- Secondary: `performance-analyzer`

**Design Problems:**
- Primary: `frontend-developer`, UX specialists
- Secondary: `architect`

**Infrastructure Problems:**
- Primary: Cloud specialists, `devops-engineer`
- Secondary: `cost-optimizer`, `infrastructure-engineer`

### Parallel Execution Pattern

```
1. Frame problem and discover alternatives (sequential)
2. Launch alternative exploration in parallel:
   - Single message with N Task tool calls (one per alternative)
   - Each agent prototypes and tests their alternative
   - Each outputs to separate directory
   - All execute simultaneously for maximum speed
3. Evaluate and compare (sequential)
4. Create recommendation (sequential)
```

**Speed Advantage:**
- Sequential: 5 alternatives × 3 hours each = 15 hours
- Parallel: 5 alternatives in parallel = 3 hours (5x speedup)

## Success Criteria

Exploration is complete when:
- Diverse alternatives discovered and explored
- Each alternative prototyped and tested
- Empirical performance data collected
- Multi-criteria evaluation completed
- Clear recommendation made with evidence
- Implementation roadmap defined
- Risks identified and mitigated
- Knowledge captured for reuse

## Quality Gates

### Gate 1: Solution Space Quality
- Diverse alternatives generated (5-10)
- Alternatives span solution space well
- Unconventional options considered
- Evaluation framework is comprehensive

### Gate 2: Exploration Quality
- Prototypes are realistic
- Testing is empirical and fair
- Data collected systematically
- Analysis is thorough

### Gate 3: Evaluation Quality
- Comparison is objective and data-driven
- Trade-offs are honestly assessed
- Sensitivity analysis performed
- Recommendation is well-justified

## Example Usage

### Example 1: API Design Pattern
```
/orchestr8:explore-alternatives "What's the best API design for our mobile app backend?"

Alternatives Explored:
1. RESTful with OpenAPI
2. GraphQL with Apollo
3. gRPC with Protocol Buffers
4. tRPC for type-safe APIs
5. REST + GraphQL hybrid

Evaluation Dimensions:
- Performance (latency, payload size)
- Developer experience (frontend + backend)
- Type safety
- Ecosystem maturity
- Learning curve

Recommendation: GraphQL with Apollo
- Best DX for mobile (flexible queries)
- Type-safe with codegen
- Reduces over-fetching (40% less data)
- Team already knows it
Trade-off: Slightly more complex than REST
```

### Example 2: State Management
```
/orchestr8:explore-alternatives "Best state management for complex React dashboard?"

Alternatives Explored:
1. Redux Toolkit
2. Zustand
3. Jotai (atomic)
4. TanStack Query (server state)
5. XState (state machines)
6. Hybrid: Zustand + TanStack Query

Evaluation Dimensions:
- Bundle size
- DevTools quality
- Learning curve
- Boilerplate required
- Performance (re-renders)

Recommendation: Hybrid (Zustand + TanStack Query)
- Zustand for local state (1KB)
- TanStack Query for server state (12KB)
- Best performance (minimal re-renders)
- Simple APIs, low boilerplate
Trade-off: Two libraries instead of one
```

### Example 3: Deployment Strategy
```
/orchestr8:explore-alternatives "How should we deploy our Node.js microservices?"

Alternatives Explored:
1. Kubernetes on EKS
2. AWS ECS Fargate
3. Serverless (Lambda)
4. Railway/Render (PaaS)
5. Docker Swarm
6. Hybrid: ECS for services + Lambda for functions

Evaluation Dimensions:
- Cost at scale
- Operational complexity
- Auto-scaling capability
- Developer experience
- Cold start latency

Recommendation: AWS ECS Fargate
- Good balance of control and simplicity
- No K8s complexity for 3-person team
- Auto-scaling built-in
- Cost: $800/month (vs $1200 for EKS)
Trade-off: Less portable than K8s, AWS lock-in
```

## Best Practices

### DO
- Generate diverse alternatives (5-10 initially)
- Consider unconventional approaches
- Prototype and test empirically
- Use multi-criteria evaluation
- Weight criteria by business importance
- Perform sensitivity analysis
- Create phased implementation plans
- Capture knowledge for future use

### DON'T
- Settle for first solution that works
- Only explore obvious alternatives
- Make decisions without prototyping
- Use single-criterion evaluation (e.g., just performance)
- Ignore implementation complexity
- Forget about operational costs
- Skip risk assessment

## Integration with Knowledge Base

All exploration results are stored for future reference:

```bash
# Store exploration methodology
db_store_knowledge "explore-alternatives" "problem-type" "$DOMAIN" \
  "Solution exploration for $PROBLEM" \
  "$(cat problem-analysis.md)"

# Store winning alternative
db_store_knowledge "explore-alternatives" "solution" "$WINNER_NAME" \
  "Optimal solution for $PROBLEM with evidence" \
  "$(cat recommendation.md)"

# Store lessons learned
db_store_knowledge "explore-alternatives" "lessons" "$PROBLEM_DOMAIN" \
  "Key learnings from exploration: $INSIGHTS" \
  "$(cat knowledge-base/lessons.md)"

# Query similar past explorations
db_query_knowledge "explore-alternatives" "$PROBLEM_TYPE" 10
```

## Fire-and-Forget Pattern

This workflow supports async execution:

```bash
# Launch exploration in background
/orchestr8:explore-alternatives "How to optimize our API response time?"

# Workflow runs autonomously:
# - Analyzes problem deeply
# - Generates diverse alternatives
# - Prototypes and tests in parallel
# - Evaluates objectively
# - Creates recommendation and roadmap

# Returns when complete with recommendation and implementation plan
```

## Notes

- Exploration is creative: don't constrain thinking too early
- Diverse alternatives lead to better final solutions
- Prototyping beats speculation every time
- Multi-criteria evaluation prevents tunnel vision
- Phased implementation reduces risk
- Fire-and-forget execution allows deep exploration without blocking
- Knowledge capture ensures insights aren't lost

**Remember:** "The best way to have a good idea is to have lots of ideas." Explore widely, then choose wisely based on evidence.
