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

## Execution Instructions

### Phase 1: Performance Baseline & Profiling (20%)

**Use appropriate agents to establish baseline:**

#### 1. Define Performance Scope

```markdown
SCOPE DEFINITION:
Target: [Frontend | Backend | Database | Fullstack]

METRICS TO MEASURE:
- Response times
- Throughput
- Resource utilization (CPU, memory, network)
- User-perceived performance
- Core Web Vitals (if frontend)

OPTIMIZATION GOALS:
- Target metrics (specific numbers)
- Acceptable trade-offs
- Must-preserve functionality
```

#### 2. Frontend Performance Profiling

**Use `frontend-developer` or framework specialist:**

```bash
# Lighthouse CI
npm install -g @lhci/cli
lhci autorun --collect.url=http://localhost:3000

# Web Vitals measurement
npm install web-vitals
# Add to app for real user monitoring

# Bundle analysis
npm run build -- --analyze
# or
npx webpack-bundle-analyzer dist/stats.json

# Chrome DevTools Performance
# Record while performing key user flows
# Identify:
# - Long tasks (> 50ms)
# - Excessive JavaScript execution
# - Layout thrashing
# - Memory leaks
# - Render blocking resources

# Network analysis
# Check for:
# - Unnecessary requests
# - Large payloads
# - Missing compression
# - Inefficient caching
# - Render blocking resources
```

**Key Metrics to Capture:**
```json
{
  "lighthouse": {
    "performance": 65,
    "fcp": 3200,
    "lcp": 4500,
    "tbt": 850,
    "cls": 0.25
  },
  "bundle": {
    "total": "2.5 MB",
    "vendor": "1.8 MB",
    "app": "700 KB"
  },
  "runtime": {
    "jsExecution": "2100ms",
    "rendering": "800ms",
    "painting": "300ms"
  }
}
```

#### 3. Backend Performance Profiling

**Use `backend-developer` or language specialist:**

```bash
# Node.js
# Install clinic.js
npm install -g clinic
clinic doctor -- node server.js
clinic flame -- node server.js
clinic bubbleprof -- node server.js

# Python
# Install py-spy for sampling profiler
pip install py-spy
py-spy record -o profile.svg -- python app.py

# Or use cProfile
python -m cProfile -o profile.stats app.py
snakeviz profile.stats

# Go
# Built-in pprof
import _ "net/http/pprof"
go tool pprof http://localhost:6060/debug/pprof/profile

# Java
# Use JProfiler, YourKit, or async-profiler
java -agentpath:/path/to/libasyncProfiler.so -jar app.jar

# Rust
# Use flamegraph
cargo install flamegraph
cargo flamegraph

# Identify:
# - CPU hotspots
# - Memory allocation hotspots
# - Blocking I/O
# - Lock contention
# - Event loop blocking (Node.js)
```

**Application Performance Monitoring:**
```bash
# Add APM instrumentation
# - New Relic
# - DataDog
# - Dynatrace
# - Application Insights

# Measure:
# - Request throughput
# - Response times (p50, p95, p99)
# - Error rates
# - Database query times
# - External API calls
# - Memory usage
# - CPU usage
```

#### 4. Database Performance Profiling

**Use `database-specialist`:**

```sql
-- PostgreSQL
-- Enable pg_stat_statements
CREATE EXTENSION pg_stat_statements;

-- Find slow queries
SELECT
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 20;

-- Find missing indexes
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
  AND n_distinct > 100
  AND correlation < 0.1;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- MySQL
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 0.1;

-- Find slow queries
SELECT
  query_time,
  lock_time,
  rows_sent,
  rows_examined,
  sql_text
FROM mysql.slow_log
ORDER BY query_time DESC;

-- MongoDB
-- Enable profiler
db.setProfilingLevel(2);

-- Find slow queries
db.system.profile.find({
  millis: { $gt: 100 }
}).sort({ millis: -1 }).limit(10);

-- Check for missing indexes
db.collection.aggregate([
  { $indexStats: {} }
]);
```

**Identify:**
- N+1 query patterns
- Full table scans
- Missing indexes
- Inefficient joins
- Large result sets
- Excessive database round trips

#### 5. Infrastructure Performance Profiling

**Use `infrastructure-engineer` or cloud specialist:**

```bash
# AWS CloudWatch metrics
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-xxxxx \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 300 \
  --statistics Average

# Kubernetes metrics
kubectl top nodes
kubectl top pods

# Container resource usage
docker stats

# Network performance
# - Latency between services
# - Bandwidth utilization
# - Connection pooling
```

**CHECKPOINT**: Baseline established, bottlenecks identified ✓

### Phase 2: Optimization Strategy (15%)

**Use `architect` to design optimization strategy:**

```markdown
PERFORMANCE ANALYSIS:

CURRENT STATE:
- Lighthouse: 65/100
- API p95: 1200ms
- Database p95: 150ms
- Bundle size: 2.5 MB

BOTTLENECKS IDENTIFIED:
1. Large JavaScript bundle (1.8 MB vendor code)
2. N+1 queries in user dashboard (47 queries)
3. Missing database indexes on user_events table
4. Synchronous image processing blocking API
5. No CDN for static assets
6. React re-renders on every state change

OPTIMIZATION STRATEGY:

HIGH IMPACT (Do first):
1. Database: Add indexes, fix N+1 queries (expect 80% improvement)
2. Backend: Move image processing to background job (expect 90% improvement)
3. Frontend: Code splitting + lazy loading (expect 60% reduction in bundle)

MEDIUM IMPACT:
4. Frontend: Implement React.memo and useMemo (expect 40% render improvement)
5. Backend: Add Redis caching for frequently accessed data (expect 70% improvement)
6. Infrastructure: Add CDN for static assets (expect 50% improvement in FCP)

LOW IMPACT:
7. Frontend: Image optimization and lazy loading
8. Backend: Connection pooling optimization
9. Database: Query result caching

TRADE-OFFS:
- Code splitting increases complexity but reduces initial load
- Caching increases memory usage but reduces database load
- Background jobs increase latency for async operations but improve API response

PERFORMANCE BUDGET:
- JavaScript bundle: < 500 KB
- API response time p95: < 300ms
- Lighthouse score: > 90
```

**CHECKPOINT**: Strategy approved, priorities clear ✓

### Phase 3: Frontend Optimizations (20%)

**Use `frontend-developer` or framework specialist:**

#### 1. Bundle Size Optimization

```typescript
// Code splitting with React lazy loading
import { lazy, Suspense } from 'react';

// Before: Import everything upfront
// import Dashboard from './Dashboard';
// import AdminPanel from './AdminPanel';

// After: Lazy load routes
const Dashboard = lazy(() => import('./Dashboard'));
const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  );
}

// Dynamic imports for heavy libraries
async function handleExport() {
  const { exportToPDF } = await import('./pdf-export');
  await exportToPDF(data);
}

// Tree shaking - import only what you need
// Before:
// import _ from 'lodash';  // 70 KB

// After:
import debounce from 'lodash/debounce';  // 2 KB
```

**Webpack/Vite configuration:**
```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@mui/material', '@emotion/react'],
        },
      },
    },
  },
};
```

#### 2. React Performance Optimization

```typescript
// Prevent unnecessary re-renders
import { memo, useMemo, useCallback } from 'react';

// Before: Re-renders on every parent update
function UserList({ users, onUserClick }) {
  return users.map(user => (
    <UserCard key={user.id} user={user} onClick={onUserClick} />
  ));
}

// After: Memoized to prevent re-renders
const UserList = memo(function UserList({ users, onUserClick }) {
  return users.map(user => (
    <UserCard key={user.id} user={user} onClick={onUserClick} />
  ));
});

const UserCard = memo(function UserCard({ user, onClick }) {
  const handleClick = useCallback(() => {
    onClick(user.id);
  }, [user.id, onClick]);

  return <div onClick={handleClick}>{user.name}</div>;
});

// Expensive computations
function Dashboard({ users, filters }) {
  // Before: Recalculates every render
  // const filteredUsers = users.filter(u => filters.status === u.status);

  // After: Only recalculates when dependencies change
  const filteredUsers = useMemo(
    () => users.filter(u => filters.status === u.status),
    [users, filters.status]
  );

  return <UserList users={filteredUsers} />;
}

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';

function LargeUserList({ users }) {
  // Before: Renders 10,000 items (slow!)
  // return users.map(user => <UserRow user={user} />);

  // After: Only renders visible items
  return (
    <FixedSizeList
      height={600}
      itemCount={users.length}
      itemSize={50}
      width="100%"
    >
      {({ index, style }) => (
        <div style={style}>
          <UserRow user={users[index]} />
        </div>
      )}
    </FixedSizeList>
  );
}
```

#### 3. Image and Asset Optimization

```typescript
// Next.js Image optimization
import Image from 'next/image';

// Before:
// <img src="/hero.jpg" alt="Hero" />  // 2.5 MB, not optimized

// After:
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority  // LCP image
  placeholder="blur"
/>

// Lazy loading images below the fold
<Image
  src="/product.jpg"
  alt="Product"
  width={400}
  height={300}
  loading="lazy"
/>

// Responsive images
<picture>
  <source
    srcSet="/hero-mobile.webp"
    media="(max-width: 768px)"
    type="image/webp"
  />
  <source
    srcSet="/hero-desktop.webp"
    media="(min-width: 769px)"
    type="image/webp"
  />
  <img src="/hero.jpg" alt="Hero" />
</picture>
```

#### 4. Caching and Service Workers

```javascript
// Service worker for offline caching
// sw.js
const CACHE_NAME = 'app-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/app.js',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
```

**CHECKPOINT**: Frontend optimized ✓

### Phase 4: Backend Optimizations (20%)

**Use `backend-developer` or language specialist:**

#### 1. Database Query Optimization

```python
# Before: N+1 query problem
def get_users_with_posts():
    users = User.query.all()
    for user in users:
        # This triggers a new query for EACH user!
        posts = Post.query.filter_by(user_id=user.id).all()
        user.posts = posts
    return users

# After: Use eager loading (1 query instead of N+1)
def get_users_with_posts():
    users = User.query.options(
        joinedload(User.posts)
    ).all()
    return users

# Or with SQLAlchemy ORM
users = db.session.query(User).options(
    selectinload(User.posts),
    selectinload(User.posts).selectinload(Post.comments)
).all()

# Raw SQL with JOIN (most performant)
query = """
    SELECT u.*, p.*
    FROM users u
    LEFT JOIN posts p ON p.user_id = u.id
    WHERE u.active = true
"""
```

```javascript
// TypeScript with Prisma
// Before: N+1
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({
    where: { userId: user.id }
  });
}

// After: Include relation
const users = await prisma.user.findMany({
  include: {
    posts: {
      include: {
        comments: true
      }
    }
  }
});
```

#### 2. Caching Strategy

```typescript
// Redis caching
import Redis from 'ioredis';
const redis = new Redis();

async function getUser(id: number) {
  const cacheKey = `user:${id}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Cache miss - fetch from database
  const user = await db.user.findUnique({ where: { id } });

  // Store in cache (1 hour TTL)
  await redis.setex(cacheKey, 3600, JSON.stringify(user));

  return user;
}

// Cache invalidation
async function updateUser(id: number, data: any) {
  const user = await db.user.update({
    where: { id },
    data,
  });

  // Invalidate cache
  await redis.del(`user:${id}`);

  return user;
}

// Cache warming (populate cache before requests)
async function warmCache() {
  const popularUsers = await db.user.findMany({
    take: 100,
    orderBy: { views: 'desc' }
  });

  for (const user of popularUsers) {
    await redis.setex(
      `user:${user.id}`,
      3600,
      JSON.stringify(user)
    );
  }
}
```

#### 3. Async Processing

```typescript
// Before: Synchronous image processing blocks API
app.post('/upload', async (req, res) => {
  const file = req.file;

  // This takes 3 seconds and blocks the response!
  await processImage(file);
  await generateThumbnail(file);
  await uploadToS3(file);

  res.json({ success: true });
});

// After: Background job with queue
import Bull from 'bull';
const imageQueue = new Bull('image-processing');

app.post('/upload', async (req, res) => {
  const file = req.file;

  // Add to queue (returns immediately)
  await imageQueue.add({
    fileId: file.id,
    path: file.path
  });

  // Return immediately (50ms instead of 3000ms!)
  res.json({
    success: true,
    processing: true,
    jobId: job.id
  });
});

// Worker processes jobs in background
imageQueue.process(async (job) => {
  const { fileId, path } = job.data;
  await processImage(path);
  await generateThumbnail(path);
  await uploadToS3(path);
});
```

#### 4. Connection Pooling

```python
# Database connection pooling
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    'postgresql://user:pass@localhost/db',
    poolclass=QueuePool,
    pool_size=20,        # Max connections
    max_overflow=10,     # Extra connections under load
    pool_timeout=30,     # Wait time for connection
    pool_recycle=3600,   # Recycle connections after 1 hour
)
```

```javascript
// Node.js with connection pooling
import { Pool } from 'pg';

const pool = new Pool({
  max: 20,              // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Reuse connections
async function query(sql, params) {
  const client = await pool.connect();
  try {
    return await client.query(sql, params);
  } finally {
    client.release();  // Return to pool
  }
}
```

#### 5. Response Compression

```typescript
// Express.js
import compression from 'compression';
app.use(compression());

// Custom compression for specific routes
app.get('/api/large-data',
  compression({ level: 9 }),  // Max compression
  async (req, res) => {
    const data = await getLargeDataset();
    res.json(data);
  }
);
```

**CHECKPOINT**: Backend optimized ✓

### Phase 5: Database Optimizations (15%)

**Use `database-specialist`:**

#### 1. Index Creation

```sql
-- PostgreSQL
-- Find queries that would benefit from indexes
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'test@example.com';

-- If you see "Seq Scan" on large table, add index
CREATE INDEX idx_users_email ON users(email);

-- Composite indexes for multi-column queries
CREATE INDEX idx_events_user_date
ON events(user_id, created_at DESC);

-- Partial indexes for filtered queries
CREATE INDEX idx_active_users
ON users(email)
WHERE active = true;

-- Index for LIKE queries
CREATE INDEX idx_users_name_pattern
ON users USING gin(name gin_trgm_ops);

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  pg_size_pretty(pg_relation_size(indexrelid)) as size
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;

-- Drop unused indexes
DROP INDEX idx_unused;
```

#### 2. Query Rewriting

```sql
-- Before: Inefficient subquery
SELECT * FROM users
WHERE id IN (
  SELECT user_id FROM orders WHERE total > 1000
);

-- After: JOIN (often faster)
SELECT DISTINCT u.*
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.total > 1000;

-- Before: COUNT(*) on large table
SELECT COUNT(*) FROM orders WHERE user_id = 123;

-- After: Use approximate count for large tables
SELECT reltuples::bigint AS estimate
FROM pg_class
WHERE relname = 'orders';

-- Before: SELECT *
SELECT * FROM users WHERE id = 123;

-- After: Select only needed columns
SELECT id, email, name FROM users WHERE id = 123;
```

#### 3. Materialized Views

```sql
-- For expensive aggregations
CREATE MATERIALIZED VIEW user_stats AS
SELECT
  user_id,
  COUNT(*) as order_count,
  SUM(total) as total_spent,
  MAX(created_at) as last_order
FROM orders
GROUP BY user_id;

-- Add index on materialized view
CREATE INDEX idx_user_stats_user ON user_stats(user_id);

-- Refresh periodically (cron job or trigger)
REFRESH MATERIALIZED VIEW CONCURRENTLY user_stats;

-- Query the view (fast!)
SELECT * FROM user_stats WHERE user_id = 123;
```

#### 4. Database Configuration Tuning

```ini
# PostgreSQL (postgresql.conf)
shared_buffers = 4GB           # 25% of RAM
effective_cache_size = 12GB    # 75% of RAM
work_mem = 64MB                # Per operation
maintenance_work_mem = 512MB   # For VACUUM, CREATE INDEX
max_connections = 200
random_page_cost = 1.1         # SSD
effective_io_concurrency = 200 # SSD

# Query planner
default_statistics_target = 100
```

**CHECKPOINT**: Database optimized ✓

### Phase 6: Benchmarking & Validation (15%)

**Run comprehensive benchmarks:**

#### 1. Frontend Benchmarking

```bash
# Lighthouse (before and after)
lhci autorun

# Results comparison:
# BEFORE:
# Performance: 65
# FCP: 3.2s
# LCP: 4.5s
# TBT: 850ms

# AFTER:
# Performance: 92 (+42%)
# FCP: 1.5s (-53%)
# LCP: 2.1s (-53%)
# TBT: 180ms (-79%)

# Bundle size comparison
# BEFORE: 2.5 MB
# AFTER: 780 KB (-69%)

# Real User Monitoring
# Track metrics for 1000+ users
```

#### 2. Backend Benchmarking

```bash
# Load testing with k6
import http from 'k6/http';
import { check } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 },   // Ramp up
    { duration: '5m', target: 100 },   // Stay at 100
    { duration: '2m', target: 200 },   // Spike
    { duration: '5m', target: 200 },   // Stay at 200
    { duration: '2m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% under 500ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function() {
  let response = http.get('http://api.example.com/users');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
}

# Results:
# BEFORE:
# p50: 450ms
# p95: 1200ms
# p99: 2500ms
# Errors: 2.3%

# AFTER:
# p50: 85ms (-81%)
# p95: 210ms (-82%)
# p99: 450ms (-82%)
# Errors: 0.05% (-98%)
```

#### 3. Database Benchmarking

```bash
# pgbench for PostgreSQL
pgbench -c 50 -j 4 -T 300 mydatabase

# Results:
# BEFORE:
# TPS: 458 transactions/sec
# Latency avg: 109ms

# AFTER:
# TPS: 2341 transactions/sec (+411%)
# Latency avg: 21ms (-81%)

# Query performance
# BEFORE:
# User dashboard query: 847ms
# Search query: 1230ms

# AFTER:
# User dashboard query: 23ms (-97%)
# Search query: 89ms (-93%)
```

#### 4. Validation Checklist

```markdown
FRONTEND:
✓ Lighthouse score > 90
✓ FCP < 1.8s
✓ LCP < 2.5s
✓ TBT < 300ms
✓ CLS < 0.1
✓ Bundle size < 500 KB
✓ No console errors
✓ All features working

BACKEND:
✓ p95 response time < 500ms
✓ Error rate < 0.1%
✓ CPU usage < 70% under load
✓ Memory stable (no leaks)
✓ All tests passing

DATABASE:
✓ All queries < 100ms
✓ No full table scans
✓ Indexes used effectively
✓ Connection pool healthy

INFRASTRUCTURE:
✓ Auto-scaling working
✓ Health checks passing
✓ Monitoring configured
✓ Alerts configured
```

**CHECKPOINT**: Improvements validated, targets met ✓

### Phase 7: Documentation & Monitoring (10%)

```markdown
# Performance Optimization Report

## Summary
Optimized [component] performance, achieving [X]% improvement in [metric].

## Metrics Comparison

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Lighthouse Score | 65 | 92 | +42% |
| FCP | 3.2s | 1.5s | -53% |
| LCP | 4.5s | 2.1s | -53% |
| API p95 | 1200ms | 210ms | -82% |
| Database p95 | 150ms | 21ms | -86% |
| Bundle Size | 2.5 MB | 780 KB | -69% |

## Optimizations Implemented

### Frontend
1. **Code Splitting**: Reduced initial bundle from 2.5 MB to 780 KB
2. **React.memo**: Reduced re-renders by 60%
3. **Lazy Loading**: Images and routes
4. **Service Worker**: Offline caching

### Backend
1. **Fixed N+1 Queries**: 47 queries → 2 queries per request
2. **Redis Caching**: 70% of requests served from cache
3. **Background Jobs**: Image processing moved to queue
4. **Connection Pooling**: Optimized database connections

### Database
1. **Added Indexes**: 12 new indexes on hot queries
2. **Query Optimization**: Rewrote 8 slow queries
3. **Materialized Views**: For expensive aggregations

### Infrastructure
1. **CDN**: CloudFront for static assets
2. **Auto-scaling**: Based on CPU/memory metrics
3. **Compression**: Gzip for API responses

## Performance Budget

Established ongoing performance budget:
- JavaScript bundle: < 500 KB
- API p95: < 300ms
- Lighthouse: > 90
- Database queries: < 50ms

## Monitoring

Configured:
- Real User Monitoring (RUM) with Web Vitals
- APM with DataDog
- Database slow query log
- Lighthouse CI on every deployment

## Next Steps

1. Continue monitoring metrics
2. Review performance monthly
3. Update performance budget as needed
4. Consider further optimizations:
   - Server-side rendering for faster FCP
   - HTTP/3 for better network performance
   - Database read replicas for scaling
```

**CHECKPOINT**: Documented and monitoring configured ✓

## Success Criteria

Performance optimization complete when:
- ✅ Baseline metrics captured
- ✅ Bottlenecks identified
- ✅ Optimizations implemented
- ✅ Performance targets met
- ✅ All tests still passing
- ✅ No regressions introduced
- ✅ Before/after benchmarks documented
- ✅ Monitoring configured
- ✅ Performance budget established
- ✅ Team trained on maintaining performance

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
7. Generates report showing 103% improvement

**Time: 2-3 hours**

### Example 2: API Performance Degradation

```bash
/optimize-performance "API response times increased from 200ms to 1500ms after recent feature launch. Need to identify and fix performance regression."
```

**Autonomous execution:**
1. Profiles API with APM
2. Identifies N+1 query in new feature (127 queries per request!)
3. Identifies missing database index
4. Backend-developer fixes N+1 with eager loading
5. Database-specialist adds indexes
6. Response time drops to 180ms (88% improvement)
7. Load testing confirms fix under production load
8. Adds monitoring alert for query count

**Time: 1-2 hours**

### Example 3: Database Scaling Issues

```bash
/optimize-performance "Database hitting 100% CPU during peak hours. Need to optimize queries and add proper indexes before we scale up hardware."
```

**Autonomous execution:**
1. Analyzes pg_stat_statements for slow queries
2. Identifies: 5 full table scans, missing indexes, inefficient aggregations
3. Creates 8 new indexes
4. Rewrites 3 queries with better JOINs
5. Creates materialized view for expensive aggregation
6. CPU drops from 100% to 35% during peak
7. Query times improve by 90%
8. Configures monitoring for slow queries

**Time: 2-4 hours**

## Anti-Patterns

### DON'T
❌ Optimize without profiling (premature optimization)
❌ Focus only on micro-optimizations
❌ Ignore real user metrics
❌ Break functionality for performance gains
❌ Add caching everywhere without measuring
❌ Skip benchmarking before/after
❌ Ignore performance in code reviews
❌ Deploy without load testing

### DO
✅ Profile first, optimize second
✅ Focus on biggest bottlenecks
✅ Measure real user experience
✅ Maintain functionality while optimizing
✅ Cache strategically based on data
✅ Document all improvements with metrics
✅ Establish performance budgets
✅ Load test before production

## Continuous Performance

```
ON EVERY PULL REQUEST:
- Lighthouse CI (fail if score drops)
- Bundle size check (fail if > budget)
- Load test critical endpoints

DAILY:
- Monitor RUM metrics
- Check for slow queries
- Review error rates

WEEKLY:
- Performance dashboard review
- Slow query analysis
- Dependency updates

MONTHLY:
- Full performance audit
- Review and update budgets
- Capacity planning

QUARTERLY:
- Load testing at scale
- Infrastructure optimization
- Performance roadmap
```

Autonomous, measurable, and production-ready performance optimization that delivers real improvements to user experience.
