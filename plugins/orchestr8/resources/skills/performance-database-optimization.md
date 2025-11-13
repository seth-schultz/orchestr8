---
id: performance-database-optimization
category: skill
tags: [performance, database, sql, mongodb, indexing, query-optimization, n+1]
capabilities:
  - Query optimization techniques
  - Index strategy and design
  - N+1 query prevention
  - Connection pooling
estimatedTokens: 650
useWhen:
  - Optimizing PostgreSQL queries with EXPLAIN ANALYZE identifying missing indexes and inefficient joins
  - Building database indexing strategy balancing read performance with write overhead for high-traffic tables
  - Implementing connection pooling with Prisma reducing database connection overhead and improving throughput
  - Designing query optimization approach with N+1 query detection, eager loading, and projection optimization
  - Creating database performance monitoring with slow query logging and automated index recommendation alerts
---

# Database Performance Optimization

## Index Strategy

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);
-- Fast for: WHERE user_id = X ORDER BY created_at DESC
-- Slow for: WHERE created_at > X (user_id not specified)

-- Covering index (includes all SELECT columns)
CREATE INDEX idx_users_covering ON users(email, name, status);
-- SELECT name, status FROM users WHERE email = 'x'
-- No table lookup needed - data in index

-- Partial index (PostgreSQL)
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
-- Smaller, faster for common queries

-- Full-text index
CREATE FULLTEXT INDEX idx_articles_content ON articles(title, content);
SELECT * FROM articles WHERE MATCH(title, content) AGAINST('search term');
```

## Query Optimization

```javascript
// EXPLAIN ANALYZE - see execution plan
const result = await db.query(`
  EXPLAIN ANALYZE
  SELECT * FROM orders
  WHERE user_id = $1 AND created_at > $2
  ORDER BY created_at DESC
  LIMIT 10
`, [userId, date]);

// Look for:
// - Seq Scan → Add index
// - Index Scan → Good
// - Bitmap Heap Scan → Large result sets
// - High cost numbers → Optimize

// Use projection (select only needed columns)
// ❌ Slow
const users = await db.user.findMany();

// ✅ Fast
const users = await db.user.findMany({
  select: { id: true, email: true, name: true }
});

// Limit result sets
// ❌ Loads all records
const orders = await db.order.findMany({ where: { userId } });

// ✅ Paginate
const orders = await db.order.findMany({
  where: { userId },
  take: 20,
  skip: page * 20,
  orderBy: { createdAt: 'desc' }
});
```

## N+1 Query Prevention

```javascript
// ❌ N+1 Problem (1 query + N queries)
const posts = await db.post.findMany(); // 1 query
for (const post of posts) {
  post.author = await db.user.findById(post.authorId); // N queries
}

// ✅ Solution 1: Join/Include
const posts = await db.post.findMany({
  include: { author: true } // Single query with JOIN
});

// ✅ Solution 2: DataLoader (batching)
const DataLoader = require('dataloader');

const userLoader = new DataLoader(async (ids) => {
  const users = await db.user.findMany({
    where: { id: { in: ids } }
  });
  // Return in same order as ids
  return ids.map(id => users.find(u => u.id === id));
});

// Usage
const posts = await db.post.findMany();
const authors = await Promise.all(
  posts.map(post => userLoader.load(post.authorId))
);

// ✅ Solution 3: Aggregation pipeline (MongoDB)
const results = await db.collection('posts').aggregate([
  {
    $lookup: {
      from: 'users',
      localField: 'authorId',
      foreignField: '_id',
      as: 'author'
    }
  },
  { $unwind: '$author' }
]);
```

## Connection Pooling

```javascript
// PostgreSQL with pg-pool
const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  database: 'mydb',
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000, // Close idle clients after 30s
  connectionTimeoutMillis: 2000, // Error if no connection in 2s
});

const client = await pool.connect();
try {
  await client.query('BEGIN');
  const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
  await client.query('COMMIT');
  return result.rows[0];
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release(); // Return to pool
}

// Monitor pool metrics
pool.on('connect', () => {
  poolConnections.inc();
});

pool.on('error', (err) => {
  logger.error('Pool error', err);
});

setInterval(() => {
  poolSize.set(pool.totalCount);
  poolIdle.set(pool.idleCount);
  poolWaiting.set(pool.waitingCount);
}, 5000);
```

## Query Batching

```javascript
// Batch multiple queries in transaction
async function batchUpdate(updates) {
  return await db.$transaction(
    updates.map(({ id, data }) =>
      db.user.update({ where: { id }, data })
    )
  );
}

// Bulk insert
// ❌ Slow (N queries)
for (const item of items) {
  await db.item.create({ data: item });
}

// ✅ Fast (1 query)
await db.item.createMany({
  data: items,
  skipDuplicates: true
});
```

## MongoDB Optimization

```javascript
// Index creation
await db.collection('users').createIndex({ email: 1 }, { unique: true });
await db.collection('orders').createIndex({ userId: 1, createdAt: -1 });

// Compound index for sort + filter
await db.collection('products').createIndex({
  category: 1,
  price: -1,
  createdAt: -1
});

// Query with projection
const users = await db.collection('users').find(
  { status: 'active' },
  { projection: { email: 1, name: 1, _id: 0 } }
).toArray();

// Aggregation pipeline optimization
const results = await db.collection('orders').aggregate([
  { $match: { status: 'completed' } }, // Filter early
  { $sort: { createdAt: -1 } }, // Sort before grouping
  {
    $group: {
      _id: '$userId',
      total: { $sum: '$amount' },
      count: { $sum: 1 }
    }
  },
  { $limit: 100 } // Limit results
]);

// Use $lookup carefully (can be slow)
// ✅ Good: lookup with match
db.collection('posts').aggregate([
  { $match: { status: 'published' } }, // Filter first
  {
    $lookup: {
      from: 'users',
      localField: 'authorId',
      foreignField: '_id',
      as: 'author'
    }
  }
]);
```

## Read Replicas

```javascript
// Prisma with read replicas
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL // Primary
    }
  }
});

// Read from replica
const users = await prisma.$queryRaw`
  SELECT * FROM users
  -- @replica
`;

// Manual replica routing
const primary = new Pool({ connectionString: PRIMARY_URL });
const replica = new Pool({ connectionString: REPLICA_URL });

async function query(sql, params, { write = false } = {}) {
  const pool = write ? primary : replica;
  return await pool.query(sql, params);
}

// Usage
const users = await query('SELECT * FROM users', []); // From replica
await query('INSERT INTO users VALUES ($1)', [user], { write: true }); // Primary
```

## Query Caching

```javascript
// Cache query results
async function getCachedQuery(key, queryFn, ttl = 300) {
  const cached = await redis.get(`query:${key}`);
  if (cached) return JSON.parse(cached);

  const result = await queryFn();
  await redis.setex(`query:${key}`, ttl, JSON.stringify(result));
  return result;
}

// Usage
const users = await getCachedQuery(
  'users:active',
  () => db.user.findMany({ where: { status: 'active' } }),
  600
);
```

## Monitoring

```javascript
// Query duration histogram
const queryDuration = new promClient.Histogram({
  name: 'db_query_duration_seconds',
  help: 'Database query duration',
  labelNames: ['operation', 'table'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5]
});

// Instrument queries
async function instrumentedQuery(sql, params) {
  const end = queryDuration.startTimer({
    operation: sql.split(' ')[0].toLowerCase(),
    table: extractTable(sql)
  });

  try {
    return await pool.query(sql, params);
  } finally {
    end();
  }
}
```

## Key Principles

✅ **Index wisely** - Cover WHERE, JOIN, ORDER BY columns
✅ **Avoid N+1** - Use joins, includes, or DataLoader
✅ **Limit results** - Always paginate or set LIMIT
✅ **Project columns** - Select only needed fields
✅ **Pool connections** - Reuse database connections
✅ **Monitor slow queries** - Log queries >100ms

## Related Skills

**Performance Family:**
- orchestr8://skills/performance-optimization - Overview of performance optimization principles and when to use each domain
- orchestr8://skills/performance-api-optimization - API optimization patterns that depend on efficient database queries
- orchestr8://skills/performance-profiling-techniques - Profile to identify database bottlenecks and slow queries

**Related Patterns:**
- orchestr8://patterns/database-indexing-strategies - Advanced indexing strategies and trade-offs
- orchestr8://patterns/database-query-optimization - Query optimization patterns and techniques
- orchestr8://patterns/database-connection-pooling-scaling - Connection pooling best practices

**Implementation Examples:**
- orchestr8://examples/go-postgres-pgx - PostgreSQL with Go using pgx driver
- orchestr8://examples/rust-sqlx-queries - Rust SQLx query patterns
- orchestr8://examples/typescript-rest-api-complete - Complete TypeScript API with database integration
