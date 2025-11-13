---
id: database-indexing-strategies
category: pattern
tags: [database, indexing, performance, sql, optimization, postgres, mysql]
capabilities:
  - Database index type selection
  - Composite index design
  - Partial and covering indexes
  - ORM indexing patterns
useWhen:
  - Slow query performance requiring B-tree, hash, GIN, or GiST index selection based on query patterns and data types
  - Database lookup optimization needing composite index design for multi-column WHERE clauses and covering indexes for SELECT optimization
  - Schema design requiring partial index creation for filtered queries and expression indexes for function-based lookups
  - TypeScript ORM usage with Sequelize, TypeORM, or Prisma requiring @Index decorators and migration-based index management
  - Query analysis scenarios using EXPLAIN ANALYZE to identify missing indexes and sequential scan bottlenecks
estimatedTokens: 720
---

# Database Indexing Strategies

Comprehensive indexing patterns for optimizing database query performance through proper index selection and design.

## Index Types

### B-Tree Indexes (Default)
```sql
-- Single column: Equality and range queries
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_created ON orders(created_at);

-- Composite Index: Multiple columns (order matters!)
CREATE INDEX idx_orders_user_status ON orders(user_id, status, created_at);

-- Good for: WHERE user_id = ? AND status = ?
-- Also good for: WHERE user_id = ?
-- NOT efficient for: WHERE status = ? (leading column not used)
```

**Key principle:** Composite indexes work left-to-right. Can use for queries on leading columns, but not trailing columns alone.

### Partial Indexes
```sql
-- Index subset of rows
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';

-- Much smaller index, faster queries for active users
-- Use when frequently querying specific subset
```

### Covering Indexes
```sql
-- Include extra columns to avoid table lookup
CREATE INDEX idx_orders_with_total ON orders(user_id, created_at)
  INCLUDE (total_amount, status);

-- Query can be satisfied entirely from index
-- No need to read table data
-- Faster queries, but larger index size
```

## TypeScript ORM Indexing

### Sequelize
```typescript
import { Table, Column, Model, Index } from 'sequelize-typescript';

@Table
@Index(['email'], { unique: true })
@Index(['lastName', 'firstName'])
@Index({ fields: ['status'], where: { status: 'active' } }) // Partial index
class User extends Model {
  @Column({ unique: true })
  @Index
  email: string;

  @Column
  lastName: string;

  @Column
  firstName: string;

  @Column
  status: string;
}
```

### TypeORM
```typescript
import { Entity, Column, Index } from 'typeorm';

@Entity()
@Index(['email'], { unique: true })
@Index(['lastName', 'firstName'])
export class User {
  @Column()
  @Index()
  email: string;

  @Column()
  lastName: string;

  @Column()
  firstName: string;
}
```

## Index Design Principles

### 1. What to Index

**Always index:**
✅ Primary keys (automatic)
✅ Foreign keys (for joins)
✅ Columns in WHERE clauses
✅ Columns in ORDER BY
✅ Columns in GROUP BY
✅ Columns in JOIN conditions

**Consider indexing:**
- Columns in SELECT DISTINCT
- Columns with high cardinality (many unique values)
- Columns frequently used for lookups

**Avoid indexing:**
❌ Columns with low cardinality (gender: M/F)
❌ Columns rarely queried
❌ Small tables (<1000 rows)
❌ Columns with frequent updates

### 2. Composite Index Order

```sql
-- Query: WHERE user_id = ? AND status = ? ORDER BY created_at
CREATE INDEX idx_optimal ON orders(user_id, status, created_at);

Order matters:
1. Equality conditions first (user_id, status)
2. Range/sort conditions last (created_at)
3. Most selective columns first
```

### 3. Index Trade-offs

**Benefits:**
- Faster SELECT queries
- Faster WHERE, JOIN, ORDER BY
- Can prevent table scans

**Costs:**
- Slower INSERT/UPDATE/DELETE
- Additional disk space
- Index maintenance overhead

**Rule of thumb:** Index heavily-read tables, avoid over-indexing write-heavy tables.

## Common Index Patterns

### Pattern 1: Search by Email (Unique)
```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
-- Fast lookups, enforces uniqueness
```

### Pattern 2: User's Orders (Foreign Key)
```sql
CREATE INDEX idx_orders_user_id ON orders(user_id);
-- Fast: SELECT * FROM orders WHERE user_id = ?
```

### Pattern 3: Recent Active Orders
```sql
CREATE INDEX idx_orders_status_date ON orders(status, created_at DESC)
  WHERE status IN ('pending', 'processing');

-- Fast: SELECT * FROM orders
--       WHERE status = 'pending'
--       ORDER BY created_at DESC
--       LIMIT 10
```

### Pattern 4: Full-Text Search
```sql
-- PostgreSQL
CREATE INDEX idx_products_name_fts ON products
  USING GIN (to_tsvector('english', name));

-- Query
SELECT * FROM products
WHERE to_tsvector('english', name) @@ to_tsquery('english', 'laptop');
```

## Index Monitoring

### Find Missing Indexes
```sql
-- PostgreSQL: Find sequential scans on large tables
SELECT
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  idx_scan,
  seq_tup_read / seq_scan AS avg_seq_read
FROM pg_stat_user_tables
WHERE seq_scan > 0
ORDER BY seq_tup_read DESC
LIMIT 20;
```

### Find Unused Indexes
```sql
-- PostgreSQL: Indexes never used
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND indexname NOT LIKE 'pg_%'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### Check Index Usage
```sql
-- PostgreSQL: Index usage statistics
SELECT
  tablename,
  indexname,
  idx_scan AS index_scans,
  idx_tup_read AS tuples_read,
  idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## Best Practices

✅ **Index foreign keys** - Essential for joins
✅ **Composite for common queries** - Match WHERE clause patterns
✅ **Partial indexes for subsets** - Smaller, faster for common filters
✅ **Monitor query plans** - Use EXPLAIN to verify index usage
✅ **Remove unused indexes** - Reduce write overhead
✅ **Consider covering indexes** - For frequently-run queries

❌ **Don't index everything** - Slows writes, wastes space
❌ **Don't duplicate indexes** - (id) and (id, name) - first is redundant
❌ **Don't index low-cardinality** - Boolean columns rarely benefit
❌ **Don't ignore maintenance** - Rebuild fragmented indexes periodically

## When to Apply

- Queries taking >100ms on indexed columns
- Full table scans in EXPLAIN plans
- High database CPU during queries
- Slow JOIN operations
- Slow ORDER BY queries

## Related Database Patterns

- **orchestr8://patterns/database-query-optimization** - Eliminate N+1 queries and optimize ORM usage
- **orchestr8://patterns/database-connection-pooling-scaling** - Scale database with pooling and replicas
- **orchestr8://patterns/performance-caching** - Cache query results to reduce database load
