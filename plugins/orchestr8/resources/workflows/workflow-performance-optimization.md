---
id: workflow-performance-optimization
category: pattern
tags: [workflow, performance, optimization, profiling, bottleneck-analysis, scalability, monitoring, benchmarking]
capabilities:
  - Systematic performance profiling and bottleneck identification
  - Multi-layer optimization (database, backend, frontend, infrastructure)
  - Baseline measurement and improvement validation
  - Load testing and scalability assessment
  - Performance monitoring and alerting setup
useWhen:
  - Application performance below target metrics requiring systematic profiling, bottleneck identification, and multi-layer optimization
  - Response time, throughput, or page load optimization needing database indexing, caching strategies, and query optimization
  - Traffic scalability preparation requiring load testing, baseline measurement, and horizontal scaling strategy validation
  - Performance bottleneck resolution needing profiling tools, code optimization, infrastructure tuning, and monitoring setup
estimatedTokens: 3200
---

# Performance Optimization Pattern

**Methodology:** Baseline → Optimize → Validate → Monitor

**Target Metrics:** Response time, throughput, page load, memory usage, CPU utilization

**Token Efficiency:**
- Without JIT: ~15,000 tokens upfront (all performance optimization resources)
- With JIT: ~3,200 tokens progressive (loaded by optimization phase)
- **Savings: 79%**

## Phase Structure (0% → 100%)

### Phase 1: Baseline & Profiling (0-25%)

**→ Load Profiling & Analysis Expertise (JIT):**
```
orchestr8://match?query=performance+profiling+bottleneck+analysis+${tech-stack}&categories=skill,agent&mode=index&maxResults=8
orchestr8://skills/performance-profiling-techniques
```

**Goals:** Establish current performance and identify bottlenecks

**Key Activities:**
- Define performance metrics and target thresholds (e.g., "p95 response time <200ms")
- Measure current performance (response times, throughput, load times)
- Profile application across all layers:
  - **CPU:** Identify hot code paths and algorithm complexity
  - **Memory:** Detect leaks, excessive allocations, large objects
  - **Network:** Measure request counts, payload sizes, latency
  - **Database:** Profile slow queries, query counts, connection pool usage
- Identify top 3-5 bottlenecks by impact (Pareto principle: fix 20% causing 80% of issues)
- Document baseline metrics for comparison

**Profiling Tools:**
- Backend: Node.js profiler, Python cProfile, Go pprof, Java VisualVM
- Frontend: Chrome DevTools, Lighthouse, WebPageTest
- Database: EXPLAIN ANALYZE, slow query logs, query profilers
- Infrastructure: APM tools (New Relic, Datadog), Prometheus

**Output:** Performance baseline report with identified bottlenecks ranked by impact

### Phase 2: Optimization (25-80%)

**→ Load Optimization Expertise by Layer (JIT):**
```
# Load based on identified bottlenecks from Phase 1
orchestr8://match?query=${bottleneck-type}+optimization+${tech-stack}&categories=skill,pattern&mode=index&maxResults=12
```

**Layer-Specific JIT Loading:**

**Goals:** Optimize bottlenecks across all layers

**Parallel Tracks:**

**Track A: Database Optimization (25-60%)**

**→ Load Database Optimization (JIT - if database bottleneck found):**
```
orchestr8://match?query=${database-type}+query+optimization+indexing&categories=skill,agent&mode=index&maxResults=5
orchestr8://skills/performance-database-optimization
```
- **Indexing:** Add missing indexes for slow queries (use EXPLAIN to verify)
- **N+1 Queries:** Eliminate with eager loading, batching, or DataLoader
- **Query Optimization:** Simplify complex joins, use CTEs, avoid subqueries in SELECT
- **Caching:** Implement query result caching (Redis, in-memory)
- **Connection Pooling:** Tune pool size and connection limits
- **Denormalization:** Strategic denormalization for read-heavy workloads

**Track B: Backend Optimization (25-65%)**

**→ Load Backend Optimization (JIT - if backend bottleneck found):**
```
orchestr8://match?query=${backend-tech}+performance+caching+async&categories=skill,agent&mode=index&maxResults=5
orchestr8://skills/performance-api-optimization
```
- **Algorithm Complexity:** Optimize O(n²) → O(n log n) or O(n)
- **Caching:** Implement multi-tier caching (in-memory → Redis → CDN)
- **External APIs:** Batch requests, cache responses, add timeouts
- **Serialization:** Optimize JSON parsing, use binary formats (Protocol Buffers, MessagePack)
- **Async Processing:** Move slow operations to background jobs (queue systems)
- **Resource Pooling:** Reuse connections, threads, expensive objects

**Track C: Frontend Optimization (30-70%)**

**→ Load Frontend Optimization (JIT - if frontend bottleneck found):**
```
orchestr8://match?query=${frontend-framework}+performance+rendering+bundle&categories=skill,agent&mode=index&maxResults=5
orchestr8://skills/performance-frontend-optimization
```
- **Code Splitting:** Lazy load routes and heavy components
- **Bundle Size:** Tree shaking, minification, compression (gzip/brotli)
- **Virtual Scrolling:** For long lists (react-window, vue-virtual-scroller)
- **Image Optimization:** Compression, lazy loading, WebP format, responsive images
- **Render Optimization:** Memoization (React.memo, useMemo), prevent unnecessary re-renders
- **Critical CSS:** Inline critical styles, defer non-critical CSS

**Track D: Infrastructure Optimization (35-75%)**

**→ Load Infrastructure Optimization (JIT - if infrastructure bottleneck found):**
```
orchestr8://match?query=${platform}+infrastructure+scaling+cdn&categories=skill,pattern&mode=index&maxResults=5
orchestr8://skills/performance-caching
```
- **HTTP/2:** Enable for multiplexing and header compression
- **Compression:** Enable gzip/brotli for text responses
- **CDN:** Serve static assets from edge locations
- **Load Balancing:** Distribute traffic efficiently
- **Horizontal Scaling:** Add instances/pods for stateless components
- **Resource Limits:** Right-size CPU/memory allocations

**Output:** Optimizations implemented across all identified bottlenecks

### Phase 3: Validation & Monitoring (80-100%)

**→ Load Testing & Monitoring Expertise (JIT):**
```
orchestr8://match?query=performance+testing+monitoring+benchmarking+${tech-stack}&categories=skill,pattern&mode=index&maxResults=8
orchestr8://skills/observability-sli-slo-monitoring
```

**Goals:** Verify improvements and establish ongoing monitoring

**Parallel Tracks:**

**Track A: Performance Testing (80-92%)**
- Re-run profiling and benchmarks with same methodology
- Load testing with realistic traffic patterns (Gatling, k6, JMeter)
- Compare metrics to baseline and targets
- Verify no regressions in other areas
- Test under stress conditions (2x-5x normal load)

**Track B: Monitoring Setup (85-100%)**
- Set up Application Performance Monitoring (APM)
- Create dashboards for key metrics:
  - Response time (p50, p95, p99)
  - Error rate
  - Throughput (requests/sec)
  - Resource utilization (CPU, memory, disk)
- Configure alerts for performance degradation:
  - p95 response time exceeds threshold
  - Error rate spike (>5% increase)
  - Resource exhaustion (>80% memory/CPU)
- Implement SLI/SLO tracking (Service Level Indicators/Objectives)

**Performance Comparison:**
| Metric | Baseline | Target | Achieved | Improvement |
|--------|----------|--------|----------|-------------|
| p95 Response Time | 850ms | 200ms | 180ms | 78% faster |
| Throughput | 100 req/s | 500 req/s | 520 req/s | 5.2x |
| Page Load (p75) | 4.2s | 2.0s | 1.8s | 57% faster |

**Output:** Performance improvements validated, monitoring active

## Optimization Prioritization

**Impact vs Effort Matrix:**
- **High Impact, Low Effort:** Do first (e.g., add database index)
- **High Impact, High Effort:** Schedule strategically (e.g., architecture refactor)
- **Low Impact, Low Effort:** Quick wins (e.g., enable compression)
- **Low Impact, High Effort:** Deprioritize (e.g., rewrite in different language)

## Parallelism Strategy

**All optimization tracks run concurrently:**
- Database, backend, frontend, infrastructure optimized simultaneously
- Testing and monitoring setup happen in parallel during validation

## Success Criteria
- Performance metrics meet or exceed targets
- Top bottlenecks addressed with measurable improvement (>50%)
- No performance regressions in other areas
- Load testing validates improvements under realistic traffic
- Ongoing monitoring and alerting configured

## JIT Loading Strategy

**Conditional Loading by Bottleneck Type:**
1. Phase 1: Always load profiling expertise (1500 tokens)
2. Phase 2: Load ONLY the optimization expertise needed for identified bottlenecks:
   - Database bottleneck? Load database optimization (1200 tokens)
   - Backend bottleneck? Load backend optimization (1200 tokens)
   - Frontend bottleneck? Load frontend optimization (1200 tokens)
   - Infrastructure bottleneck? Load infrastructure optimization (1000 tokens)
3. Phase 3: Load testing and monitoring expertise (1500 tokens)

**Adaptive Budget:**
- Minimal (1 bottleneck): ~4,200 tokens (profiling + 1 optimization + validation)
- Typical (2-3 bottlenecks): ~6,000-7,500 tokens
- Comprehensive (all layers): ~9,600 tokens

**Token Savings:**
- Traditional approach: Load all optimization expertise upfront = ~15,000 tokens
- JIT approach: Load only needed layers = ~4,200-9,600 tokens
- **Savings: 36-72% depending on bottleneck scope**
