---
name: optimize-performance
description: Performance optimization with profiling, analysis, and improvements
arguments:
  - name: task
    description: Performance issue or optimization goal
    required: true
---

# Optimize Performance: {{task}}

**Request:** {{task}}

## Your Role

You are optimizing performance by identifying bottlenecks and implementing targeted improvements.

## Phase 1: Profiling & Analysis (0-30%)

**→ Load:** orchestr8://skills/match?query=profiling+performance+analysis&mode=index&maxResults=5

**Activities:**
- Measure current performance (baseline metrics)
- Identify bottlenecks (CPU, memory, I/O, network)
- Profile application (flamegraphs, traces)
- Analyze database query performance
- Review resource usage patterns
- Collect performance metrics (latency, throughput)
- Prioritize optimization targets (80/20 rule)

**→ Checkpoint:** Bottlenecks identified, metrics baselined

## Phase 2: Optimization (30-70%)

**→ Load:** orchestr8://match?query={{task}}+optimization+performance&categories=agent,skill,pattern&mode=index&maxResults=8

**Parallel tracks:**
- **Database:** Query optimization, indexing, connection pooling
- **Caching:** Implement caching layers (Redis, in-memory)
- **Code:** Algorithmic improvements, reduce complexity
- **Assets:** Minification, compression, lazy loading

**→ Checkpoint:** Optimizations implemented

## Phase 3: Validation (70-90%)

**→ Load:** orchestr8://skills/match?query=performance+testing+benchmarking&mode=index&maxResults=5

**Activities:**
- Run performance benchmarks (before/after)
- Load testing (stress test, spike test)
- Regression testing (ensure functionality intact)
- Metric comparison (latency, throughput, resource usage)
- Identify remaining bottlenecks
- Validate improvements meet goals

**→ Checkpoint:** Performance improved, tests pass

## Phase 4: Monitoring (90-100%)

**→ Load:** orchestr8://skills/match?query=monitoring+observability+alerting&mode=index&maxResults=3

**Activities:**
- Set up performance monitoring (APM tools)
- Define SLAs and performance budgets
- Configure alerts for degradation
- Document optimizations and trade-offs
- Create performance maintenance plan
- Set up continuous performance testing

**→ Checkpoint:** Monitoring active, documentation complete

## Success Criteria

✅ Performance bottlenecks identified and addressed
✅ Measurable improvement (latency, throughput)
✅ Load testing validates improvements
✅ No regressions in functionality
✅ Monitoring and alerting configured
✅ Performance budgets defined
✅ Documentation updated with benchmarks
