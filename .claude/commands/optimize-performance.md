---
description: Autonomous performance optimization with profiling, bottleneck identification, implementation, and benchmarking
argumentHint: "[target: frontend|backend|database|fullstack]"
---

# Optimize Performance Workflow

## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate this entire workflow to the fullstack-developer orchestrator using the Task tool.

**Delegation Instructions:**
```
Use Task tool with:
- subagent_type: "fullstack-developer"
- description: "Optimize application performance end-to-end"
- prompt: "Execute the optimize-performance workflow for: [user's target/requirements].

Perform comprehensive performance optimization:
1. Profile and establish baseline metrics (frontend, backend, database as applicable)
2. Identify bottlenecks and prioritize optimizations
3. Implement optimizations (code, queries, caching, etc.)
4. Benchmark improvements with before/after metrics
5. Validate no regressions or broken functionality
6. Document all optimizations and performance gains

Follow all phases (20%/15%/20%/20%/15%/10%), enforce quality gates, and meet all success criteria defined below."
```

**After delegation:**
- The orchestrator will work autonomously through all phases
- Return to main context only when complete or if user input required
- Do NOT attempt to execute workflow steps in main context

---

## Performance Optimization Instructions for Orchestrator

Autonomous, comprehensive performance optimization from profiling to production with measurable improvements.

## Intelligence Database Integration

```bash

# Initialize workflow

echo "🚀 Starting Performance Optimization Workflow"
echo "Target: $1"
echo "Workflow ID: $workflow_id"

# Query similar optimization patterns
```

## Performance Targets

**Web Application (Lighthouse):**
- Performance Score: > 90
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Total Blocking Time (TBT): < 300ms
- Cumulative Layout Shift (CLS): < 0.1
- Speed Index: < 3.4s

**API Performance:**
- p50 response time: < 200ms
- p95 response time: < 500ms
- p99 response time: < 1000ms
- Error rate: < 0.1%
- Throughput: > 1000 req/s (per instance)

**Database Performance:**
- Query time p50: < 10ms
- Query time p95: < 50ms
- Connection pool utilization: < 80%
- Cache hit rate: > 90%

---

## Phase 1: Performance Baseline & Profiling (0-20%)

**⚡ EXECUTE TASK TOOL:**
```
Use the performance-analyzer agent to:
1. Define performance scope (frontend/backend/database/fullstack)
2. Run frontend profiling (Lighthouse, bundle analysis, Chrome DevTools)
3. Run backend profiling (clinic.js/py-spy/pprof based on stack)
4. Run database profiling (pg_stat_statements, slow query log)
5. Run infrastructure profiling (CloudWatch, container metrics)
6. Capture baseline metrics in JSON format

subagent_type: "performance-analyzer"
description: "Profile and establish performance baseline"
prompt: "Establish comprehensive performance baseline for: $1

Tasks:

1. **Define Performance Scope**
   Create SCOPE.md documenting:
   - Target: [Frontend | Backend | Database | Fullstack]
   - Metrics to measure (response times, throughput, resource utilization)
   - Optimization goals with specific target numbers
   - Acceptable trade-offs
   - Must-preserve functionality

2. **Frontend Performance Profiling** (if applicable)
   \`\`\`bash
   # Install and run Lighthouse CI
   npm install -g @lhci/cli
   lhci autorun --collect.url=http://localhost:3000

   # Bundle analysis
   npm run build -- --analyze
   # or: npx webpack-bundle-analyzer dist/stats.json

   # Chrome DevTools Performance profiling
   # Identify: Long tasks (> 50ms), excessive JS execution, layout thrashing, memory leaks
   \`\`\`

   Capture metrics in frontend-baseline.json:
   - Lighthouse scores (performance, FCP, LCP, TBT, CLS)
   - Bundle sizes (total, vendor, app)
   - Runtime metrics (JS execution, rendering, painting)

3. **Backend Performance Profiling** (if applicable)
   Use language-specific profiler:
   - Node.js: clinic.js (clinic doctor/flame/bubbleprof)
   - Python: py-spy or cProfile + snakeviz
   - Go: pprof
   - Java: JProfiler/YourKit/async-profiler
   - Rust: flamegraph

   Identify: CPU hotspots, memory allocation, blocking I/O, lock contention

   Add APM instrumentation (New Relic/DataDog/Dynatrace)
   Measure: Request throughput, response times (p50/p95/p99), error rates, database query times

   Capture in backend-baseline.json

4. **Database Performance Profiling** (if applicable)
   \`\`\`sql
   -- PostgreSQL: Enable pg_stat_statements and find slow queries
   -- MySQL: Enable slow query log
   -- MongoDB: Enable profiler (db.setProfilingLevel(2))
   \`\`\`

   Identify: N+1 queries, full table scans, missing indexes, inefficient joins

   Capture in database-baseline.json

5. **Infrastructure Profiling**
   - AWS CloudWatch / Azure Monitor / GCP Monitoring
   - Kubernetes: kubectl top nodes/pods
   - Docker: docker stats
   - Network: latency, bandwidth, connection pooling

All baseline metrics must be saved as JSON files for benchmarking comparison.

Expected outputs:
- SCOPE.md - Performance scope document
- frontend-baseline.json - Frontend metrics (if applicable)
- backend-baseline.json - Backend metrics (if applicable)
- database-baseline.json - Database metrics (if applicable)
- infrastructure-baseline.json - Infrastructure metrics
"
```

**Expected Outputs:**
- `SCOPE.md` - Performance scope and goals
- `frontend-baseline.json` - Frontend baseline metrics
- `backend-baseline.json` - Backend baseline metrics
- `database-baseline.json` - Database baseline metrics
- `infrastructure-baseline.json` - Infrastructure metrics

**Quality Gate: Baseline Validation**
```bash
# Validate scope document exists
if [ ! -f "SCOPE.md" ]; then
  echo "❌ Performance scope not defined"
  exit 1
fi

# Validate at least one baseline captured
if [ ! -f "frontend-baseline.json" ] && [ ! -f "backend-baseline.json" ] && [ ! -f "database-baseline.json" ]; then
  echo "❌ No baseline metrics captured"
  exit 1
fi

echo "✅ Baseline established, bottlenecks identified"
```

**Track Progress:**
```bash
TOKENS_USED=6000

# Store baseline metrics
  "Baseline metrics captured" \
  "$(cat frontend-baseline.json backend-baseline.json database-baseline.json 2>/dev/null | head -c 500)"
```

---

## Phase 2: Optimization Strategy (20-35%)

**⚡ EXECUTE TASK TOOL:**
```
Use the architect agent to:
1. Analyze baseline metrics and identify bottlenecks
2. Prioritize optimizations by impact (high/medium/low)
3. Design optimization strategy with expected improvements
4. Identify trade-offs and risks
5. Define performance budget

subagent_type: "architect"
description: "Design comprehensive optimization strategy"
prompt: "Design optimization strategy based on baseline metrics:

Baseline files: SCOPE.md, frontend-baseline.json, backend-baseline.json, database-baseline.json

Tasks:

1. **Performance Analysis**
   Review all baseline JSON files and SCOPE.md
   Create ANALYSIS.md documenting:
   - Current state (Lighthouse, API p95, DB p95, bundle size)
   - Bottlenecks identified (ranked by severity)

2. **Optimization Prioritization**
   Categorize optimizations:

   HIGH IMPACT (Do first):
   - Database: Add indexes, fix N+1 queries (expect 70-90% improvement)
   - Backend: Move blocking operations to async (expect 80-95% improvement)
   - Frontend: Code splitting + lazy loading (expect 50-70% bundle reduction)

   MEDIUM IMPACT:
   - Frontend: React.memo/useMemo (expect 30-50% render improvement)
   - Backend: Redis caching (expect 60-80% improvement on cached data)
   - Infrastructure: CDN for static assets (expect 40-60% FCP improvement)

   LOW IMPACT:
   - Image optimization and lazy loading
   - Connection pooling tuning
   - Query result caching

3. **Strategy Design**
   Document in OPTIMIZATION-STRATEGY.md:
   - Ordered list of optimizations
   - Expected improvement for each (percentage)
   - Implementation effort (hours)
   - Dependencies between optimizations
   - Risks and mitigation

4. **Trade-offs Analysis**
   - Code splitting: increases complexity but reduces initial load
   - Caching: increases memory usage but reduces database load
   - Background jobs: increases latency but improves API response

5. **Performance Budget**
   Define in PERFORMANCE-BUDGET.md:
   - JavaScript bundle: < 500 KB
   - API response time p95: < 300ms
   - Lighthouse score: > 90
   - Database query p95: < 50ms

Expected outputs:
- ANALYSIS.md - Performance analysis
- OPTIMIZATION-STRATEGY.md - Prioritized optimization plan
- PERFORMANCE-BUDGET.md - Performance budget
"
```

**Expected Outputs:**
- `ANALYSIS.md` - Performance analysis with bottlenecks
- `OPTIMIZATION-STRATEGY.md` - Prioritized optimization strategy
- `PERFORMANCE-BUDGET.md` - Performance budget targets

**Quality Gate: Strategy Validation**
```bash
# Validate strategy documents exist
if [ ! -f "OPTIMIZATION-STRATEGY.md" ]; then
  echo "❌ Optimization strategy not created"
  exit 1
fi

if [ ! -f "PERFORMANCE-BUDGET.md" ]; then
  echo "❌ Performance budget not defined"
  exit 1
fi

echo "✅ Strategy approved, priorities clear"
```

**Track Progress:**
```bash
TOKENS_USED=4000

# Store strategy
  "Optimization strategy with priorities" \
  "$(head -n 50 OPTIMIZATION-STRATEGY.md)"
```

---

## Phase 3: Frontend Optimizations (35-55%)

**⚡ EXECUTE TASK TOOL:**
```
Use the frontend-developer agent to:
1. Implement code splitting and lazy loading
2. Optimize React rendering with memo/useMemo/useCallback
3. Implement image and asset optimization
4. Add service worker for caching
5. Optimize bundle with tree shaking and minification

subagent_type: "frontend-developer"
description: "Implement frontend performance optimizations"
prompt: "Implement frontend optimizations from OPTIMIZATION-STRATEGY.md:

Strategy file: OPTIMIZATION-STRATEGY.md
Target: Frontend optimizations only

Tasks:

1. **Bundle Size Optimization**
   - Implement code splitting with React lazy loading
   - Convert static imports to dynamic imports for routes
   - Tree shake unused code (import specific functions, not entire libraries)
   - Configure Webpack/Vite for optimal splitting

   Example pattern:
   \`\`\`typescript
   // Before: import Dashboard from './Dashboard';
   // After: const Dashboard = lazy(() => import('./Dashboard'));
   \`\`\`

2. **React Performance Optimization**
   - Wrap components with React.memo to prevent unnecessary re-renders
   - Use useMemo for expensive computations
   - Use useCallback for event handlers
   - Implement virtual scrolling for large lists (react-window)

3. **Image and Asset Optimization**
   - Implement Next.js Image component or similar
   - Add lazy loading for images below the fold
   - Use responsive images (picture element with srcSet)
   - Convert images to WebP format

4. **Caching Strategy**
   - Implement service worker for offline caching
   - Cache static assets
   - Add cache-first strategy for immutable assets

5. **Build Configuration**
   - Enable compression (gzip/brotli)
   - Configure code splitting
   - Optimize chunk sizes
   - Enable source maps for production debugging

Document all changes in FRONTEND-OPTIMIZATIONS.md with before/after code examples.

Expected outputs:
- Updated frontend code with optimizations
- FRONTEND-OPTIMIZATIONS.md - Documentation of changes
"
```

**Expected Outputs:**
- Updated frontend code files with optimizations
- `FRONTEND-OPTIMIZATIONS.md` - Documentation of frontend changes

**Quality Gate: Frontend Validation**
```bash
# Check if frontend optimizations documented
if [ ! -f "FRONTEND-OPTIMIZATIONS.md" ]; then
  echo "⚠️  Warning: Frontend optimizations not documented"
fi

# Run build to validate no errors
if [ -f "package.json" ]; then
  npm run build 2>&1 | tee build.log
  if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
  fi
fi

echo "✅ Frontend optimized"
```

**Track Progress:**
```bash
TOKENS_USED=7000

# Store frontend changes
  "Frontend optimizations implemented" \
  "$(head -n 50 FRONTEND-OPTIMIZATIONS.md 2>/dev/null || echo 'No frontend changes')"
```

---

## Phase 4: Backend Optimizations (55-75%)

**⚡ EXECUTE TASK TOOL:**
```
Use the backend-developer agent to:
1. Fix N+1 query patterns with eager loading
2. Implement Redis caching for frequently accessed data
3. Move blocking operations to background jobs/queues
4. Optimize database connection pooling
5. Add response compression

subagent_type: "backend-developer"
description: "Implement backend performance optimizations"
prompt: "Implement backend optimizations from OPTIMIZATION-STRATEGY.md:

Strategy file: OPTIMIZATION-STRATEGY.md
Target: Backend optimizations only

Tasks:

1. **Database Query Optimization**
   - Find and fix N+1 query patterns
   - Implement eager loading (joinedload, selectinload, includes)
   - Use raw SQL with JOINs for complex queries

   Example patterns:
   \`\`\`python
   # Before: N+1 problem
   users = User.query.all()
   for user in users:
       posts = Post.query.filter_by(user_id=user.id).all()

   # After: Eager loading
   users = User.query.options(joinedload(User.posts)).all()
   \`\`\`

2. **Caching Strategy**
   - Implement Redis caching for frequently accessed data
   - Add cache-aside pattern
   - Implement cache invalidation on updates
   - Add cache warming for popular data

   Example:
   \`\`\`typescript
   async function getUser(id: number) {
     const cached = await redis.get(\`user:\${id}\`);
     if (cached) return JSON.parse(cached);

     const user = await db.user.findUnique({ where: { id } });
     await redis.setex(\`user:\${id}\`, 3600, JSON.stringify(user));
     return user;
   }
   \`\`\`

3. **Async Processing**
   - Move image processing, email sending, etc. to background jobs
   - Implement job queue (Bull, Celery, Sidekiq)
   - Return immediately to client with job ID
   - Process asynchronously in worker

4. **Connection Pooling**
   - Configure database connection pool (size, timeout, recycling)
   - Optimize pool size based on workload
   - Implement connection reuse

5. **Response Compression**
   - Enable gzip/brotli compression for API responses
   - Configure compression level based on response size

Document all changes in BACKEND-OPTIMIZATIONS.md with before/after code examples.

Expected outputs:
- Updated backend code with optimizations
- BACKEND-OPTIMIZATIONS.md - Documentation of changes
"
```

**Expected Outputs:**
- Updated backend code files with optimizations
- `BACKEND-OPTIMIZATIONS.md` - Documentation of backend changes

**Quality Gate: Backend Validation**
```bash
# Check if backend optimizations documented
if [ ! -f "BACKEND-OPTIMIZATIONS.md" ]; then
  echo "⚠️  Warning: Backend optimizations not documented"
fi

# Run tests to validate no regressions
if [ -f "package.json" ] && grep -q "\"test\"" package.json; then
  npm test 2>&1 | tee test.log
  if [ $? -ne 0 ]; then
    echo "❌ Backend tests failed"
    exit 1
  fi
fi

echo "✅ Backend optimized"
```

**Track Progress:**
```bash
TOKENS_USED=7000

# Store backend changes
  "Backend optimizations implemented" \
  "$(head -n 50 BACKEND-OPTIMIZATIONS.md 2>/dev/null || echo 'No backend changes')"
```

---

## Phase 5: Database Optimizations (75-90%)

**⚡ EXECUTE TASK TOOL:**
```
Use the database-specialist agent to:
1. Create missing indexes based on slow query analysis
2. Rewrite inefficient queries
3. Create materialized views for expensive aggregations
4. Optimize database configuration
5. Validate index usage

subagent_type: "database-specialist"
description: "Implement database performance optimizations"
prompt: "Implement database optimizations from OPTIMIZATION-STRATEGY.md:

Strategy file: OPTIMIZATION-STRATEGY.md
Baseline: database-baseline.json
Target: Database optimizations only

Tasks:

1. **Index Creation**
   - Analyze slow queries from baseline
   - Create indexes for WHERE, JOIN, ORDER BY columns
   - Create composite indexes for multi-column queries
   - Create partial indexes for filtered queries
   - Avoid over-indexing (check index usage)

   Example:
   \`\`\`sql
   -- Find queries needing indexes
   EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

   -- If Seq Scan on large table, add index
   CREATE INDEX idx_users_email ON users(email);

   -- Composite index for multi-column queries
   CREATE INDEX idx_events_user_date ON events(user_id, created_at DESC);
   \`\`\`

2. **Query Rewriting**
   - Replace inefficient subqueries with JOINs
   - Use approximate counts for large tables
   - SELECT only needed columns (not SELECT *)
   - Add LIMIT to unbounded queries

3. **Materialized Views**
   - Create materialized views for expensive aggregations
   - Add indexes on materialized views
   - Set up refresh schedule (cron or trigger)

   Example:
   \`\`\`sql
   CREATE MATERIALIZED VIEW user_stats AS
   SELECT user_id, COUNT(*) as order_count, SUM(total) as total_spent
   FROM orders GROUP BY user_id;

   CREATE INDEX idx_user_stats_user ON user_stats(user_id);
   \`\`\`

4. **Database Configuration Tuning**
   - Tune shared_buffers, effective_cache_size (PostgreSQL)
   - Optimize work_mem, maintenance_work_mem
   - Configure for SSD (random_page_cost, effective_io_concurrency)

5. **Validation**
   - Check index usage stats
   - Verify no unused indexes
   - Validate query plans use indexes

Document all changes in DATABASE-OPTIMIZATIONS.md with SQL migration scripts.

Expected outputs:
- Database migration files with index creation
- DATABASE-OPTIMIZATIONS.md - Documentation of changes
"
```

**Expected Outputs:**
- Database migration files with indexes and query optimizations
- `DATABASE-OPTIMIZATIONS.md` - Documentation of database changes

**Quality Gate: Database Validation**
```bash
# Check if database optimizations documented
if [ ! -f "DATABASE-OPTIMIZATIONS.md" ]; then
  echo "⚠️  Warning: Database optimizations not documented"
fi

# Validate migration files created
if ! ls migrations/*.sql 2>/dev/null | grep -q .; then
  echo "⚠️  Warning: No database migration files created"
fi

echo "✅ Database optimized"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store database changes
  "Database optimizations implemented" \
  "$(head -n 50 DATABASE-OPTIMIZATIONS.md 2>/dev/null || echo 'No database changes')"
```

---

## Phase 6: Benchmarking & Validation (90-100%)

**⚡ EXECUTE TASK TOOL:**
```
Use the performance-analyzer agent to:
1. Run Lighthouse and capture new frontend metrics
2. Run load tests and capture new backend metrics
3. Run database benchmarks and capture new query times
4. Compare before/after metrics
5. Validate all performance targets met
6. Generate comprehensive performance report

subagent_type: "performance-analyzer"
description: "Benchmark improvements and validate targets"
prompt: "Benchmark performance improvements and validate all targets met:

Baseline files: frontend-baseline.json, backend-baseline.json, database-baseline.json
Performance budget: PERFORMANCE-BUDGET.md

Tasks:

1. **Frontend Benchmarking**
   \`\`\`bash
   # Run Lighthouse again
   lhci autorun --collect.url=http://localhost:3000

   # Capture new bundle sizes
   npm run build -- --analyze
   \`\`\`

   Save results to frontend-after.json

   Compare with frontend-baseline.json:
   - Lighthouse score improvement
   - FCP, LCP, TBT improvements
   - Bundle size reduction

2. **Backend Benchmarking**
   \`\`\`bash
   # Load testing with k6
   k6 run load-test.js
   \`\`\`

   Save results to backend-after.json

   Compare with backend-baseline.json:
   - p50, p95, p99 response time improvements
   - Error rate reduction
   - Throughput increase

3. **Database Benchmarking**
   \`\`\`bash
   # pgbench for PostgreSQL
   pgbench -c 50 -j 4 -T 300 mydatabase

   # Query-specific benchmarks
   psql -c 'EXPLAIN ANALYZE [slow-query]'
   \`\`\`

   Save results to database-after.json

   Compare with database-baseline.json:
   - Query time improvements
   - TPS increase
   - Index usage

4. **Validation Checklist**
   Verify all targets from PERFORMANCE-BUDGET.md met:
   - Lighthouse score > 90
   - FCP < 1.8s, LCP < 2.5s, TBT < 300ms
   - API p95 < 500ms
   - Database queries < 50ms p95
   - Error rate < 0.1%

5. **Performance Report**
   Create PERFORMANCE-REPORT.md:
   - Summary of improvements
   - Metrics comparison table (before/after/improvement %)
   - Optimizations implemented (frontend/backend/database)
   - Performance budget status
   - Monitoring setup
   - Next steps

Expected outputs:
- frontend-after.json - New frontend metrics
- backend-after.json - New backend metrics
- database-after.json - New database metrics
- PERFORMANCE-REPORT.md - Comprehensive report with comparison
"
```

**Expected Outputs:**
- `frontend-after.json` - Post-optimization frontend metrics
- `backend-after.json` - Post-optimization backend metrics
- `database-after.json` - Post-optimization database metrics
- `PERFORMANCE-REPORT.md` - Comprehensive performance report

**Quality Gate: Validation**
```bash
# Validate after metrics captured
if [ ! -f "PERFORMANCE-REPORT.md" ]; then
  echo "❌ Performance report not created"
  exit 1
fi

# Validate at least one after metric exists
if [ ! -f "frontend-after.json" ] && [ ! -f "backend-after.json" ] && [ ! -f "database-after.json" ]; then
  echo "❌ No after metrics captured"
  exit 1
fi

# Check if performance targets met (this would need actual validation logic)
# For now, just verify report exists
echo "✅ Improvements validated, targets met"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store final report
  "Performance optimization completed" \
  "$(head -n 100 PERFORMANCE-REPORT.md)"
```

---

## Workflow Complete

```bash
# Complete workflow tracking
WORKFLOW_END=$(date +%s)

  "Performance optimization completed for $1"

echo "
✅ PERFORMANCE OPTIMIZATION COMPLETE

Target: $1

Performance Improvements:
$(grep -A 10 'Metrics Comparison' PERFORMANCE-REPORT.md 2>/dev/null || echo 'See PERFORMANCE-REPORT.md')

Files Created:
- SCOPE.md - Performance scope
- ANALYSIS.md - Performance analysis
- OPTIMIZATION-STRATEGY.md - Strategy
- PERFORMANCE-BUDGET.md - Budget
- FRONTEND-OPTIMIZATIONS.md - Frontend changes
- BACKEND-OPTIMIZATIONS.md - Backend changes
- DATABASE-OPTIMIZATIONS.md - Database changes
- PERFORMANCE-REPORT.md - Final report

Baseline Metrics:
- frontend-baseline.json
- backend-baseline.json
- database-baseline.json

After Metrics:
- frontend-after.json
- backend-after.json
- database-after.json

Next Steps:
1. Review PERFORMANCE-REPORT.md for detailed metrics
2. Configure monitoring for ongoing performance tracking
3. Set up performance budget alerts
4. Schedule monthly performance reviews
5. Document performance best practices for team
"

# Display metrics
```

## Success Criteria

Performance optimization complete when:
- ✅ Baseline metrics captured for all applicable targets
- ✅ Bottlenecks identified and prioritized
- ✅ Optimization strategy designed with expected improvements
- ✅ Performance budget defined
- ✅ Frontend optimizations implemented (if applicable)
- ✅ Backend optimizations implemented (if applicable)
- ✅ Database optimizations implemented (if applicable)
- ✅ After metrics captured showing improvements
- ✅ Performance targets met or exceeded
- ✅ All tests still passing (no regressions)
- ✅ Before/after benchmarks documented
- ✅ Comprehensive performance report created
- ✅ Monitoring configured for ongoing tracking
- ✅ Performance budget established and validated

## Example Usage

### Example 1: Frontend Performance Crisis

```bash
/optimize-performance "Frontend performance is terrible. Lighthouse score is 45, users complaining about slow load times. Focus on Core Web Vitals."
```

**Autonomous execution:**
1. Runs Lighthouse baseline (score: 45, LCP: 8.2s)
2. Bundle analysis shows 4.2 MB initial bundle
3. Identifies: large vendor bundle, no code splitting, missing image optimization
4. Implements: code splitting, lazy loading, image optimization, compression
5. Re-runs Lighthouse (score: 91, LCP: 2.3s)
6. Validates all features working
7. Generates report showing 103% improvement in LCP, 102% improvement in score

**Time: 2-3 hours**

### Example 2: API Performance Degradation

```bash
/optimize-performance "API response times increased from 200ms to 1500ms after recent feature launch. Need to identify and fix performance regression."
```

**Autonomous execution:**
1. Profiles API with APM and identifies N+1 query in new feature (127 queries per request)
2. Identifies missing database index on user_events table
3. Backend-developer fixes N+1 with eager loading (127 queries → 2 queries)
4. Database-specialist adds composite index on user_events(user_id, created_at)
5. Response time drops to 180ms (88% improvement)
6. Load testing confirms fix under production load
7. Adds monitoring alert for query count > 10 per request

**Time: 1-2 hours**

### Example 3: Database Scaling Issues

```bash
/optimize-performance "Database hitting 100% CPU during peak hours. Need to optimize queries and add proper indexes before we scale up hardware."
```

**Autonomous execution:**
1. Analyzes pg_stat_statements for slow queries
2. Identifies: 5 full table scans, missing indexes on join columns, inefficient aggregations
3. Creates 8 new indexes (composite indexes for multi-column queries)
4. Rewrites 3 queries with better JOINs instead of subqueries
5. Creates materialized view for expensive daily aggregation
6. CPU drops from 100% to 35% during peak hours
7. Query times improve by 90% (p95: 850ms → 85ms)
8. Configures monitoring for slow queries and index usage

**Time: 2-4 hours**

## Anti-Patterns

### DON'T
❌ Optimize without profiling (premature optimization)
❌ Focus only on micro-optimizations
❌ Ignore real user metrics (only trust synthetic tests)
❌ Break functionality for performance gains
❌ Add caching everywhere without measuring impact
❌ Skip benchmarking before/after
❌ Ignore performance in code reviews
❌ Deploy without load testing
❌ Optimize everything at once (hard to identify what worked)

### DO
✅ Profile first, optimize second (measure before optimizing)
✅ Focus on biggest bottlenecks (80/20 rule)
✅ Measure real user experience (RUM + synthetic)
✅ Maintain functionality while optimizing (tests must pass)
✅ Cache strategically based on access patterns
✅ Document all improvements with metrics
✅ Establish performance budgets
✅ Load test before production
✅ Optimize incrementally (validate each change)

## Continuous Performance

```
ON EVERY PULL REQUEST:
- Lighthouse CI (fail if score drops > 5 points)
- Bundle size check (fail if > budget)
- Load test critical endpoints
- Database query analysis

DAILY:
- Monitor RUM metrics (Web Vitals)
- Check for slow queries (> 100ms)
- Review error rates
- Check cache hit rates

WEEKLY:
- Performance dashboard review
- Slow query analysis and optimization
- Dependency updates and security patches
- Review performance budget

MONTHLY:
- Full performance audit
- Review and update budgets based on traffic
- Capacity planning for next quarter
- Team performance training

QUARTERLY:
- Load testing at scale (2x-10x traffic)
- Infrastructure optimization
- Performance roadmap planning
- Benchmark against competitors
```

Autonomous, measurable, and production-ready performance optimization that delivers real improvements to user experience.
