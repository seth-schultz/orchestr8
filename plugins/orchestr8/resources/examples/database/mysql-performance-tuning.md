---
id: mysql-performance-tuning
category: example
tags: [database, mysql, performance, optimization, monitoring]
capabilities:
  - Query performance analysis with EXPLAIN
  - Slow query identification and optimization
  - Index usage statistics and analysis
  - Table fragmentation detection
  - Performance Schema queries
useWhen:
  - Diagnosing slow query performance
  - Identifying unused or redundant indexes
  - Analyzing database performance bottlenecks
  - Monitoring table health and fragmentation
  - Optimizing query execution plans
estimatedTokens: 620
relatedResources:
  - orchestr8://agents/mysql-specialist
  - orchestr8://agents/database-architect-sql
---

# MySQL Performance Tuning

## Overview
Comprehensive queries and techniques for analyzing and optimizing MySQL database performance using Performance Schema and information_schema.

## Query Optimization

### Analyze Query Performance with EXPLAIN

```sql
-- Use EXPLAIN to analyze query performance
EXPLAIN FORMAT=JSON
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY u.id, u.name
ORDER BY order_count DESC
LIMIT 10;

-- Key indicators:
-- type: ALL = BAD (full table scan)
-- type: index = OK (index scan)
-- type: ref = GOOD (index lookup)
-- type: const = BEST (primary key lookup)
-- Extra: Using filesort = Consider index
-- Extra: Using temporary = Suboptimal
```

### Create Strategic Indexes

```sql
-- Create indexes to improve performance
CREATE INDEX idx_users_created_at ON users(created_at);

-- Composite index for common query patterns
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at);

-- Covering index (includes all needed columns)
CREATE INDEX idx_users_email_name ON users(email, name, status);

-- Partial index (MySQL 8.0+)
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';

-- Full-text index for search
CREATE FULLTEXT INDEX idx_products_search ON products(name, description);

-- Spatial index for geospatial data
CREATE SPATIAL INDEX idx_locations_coords ON locations(coordinates);
```

### Index Usage Statistics

```sql
-- Show index usage statistics
SELECT
    TABLE_SCHEMA,
    TABLE_NAME,
    INDEX_NAME,
    CARDINALITY,
    INDEX_TYPE
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'mydb'
ORDER BY TABLE_NAME, INDEX_NAME;
```

## Performance Analysis

### Find Slow Queries

```sql
-- Analyze query performance
ANALYZE TABLE users;

-- Find slow queries using Performance Schema
SELECT
    DIGEST_TEXT as query,
    COUNT_STAR as exec_count,
    AVG_TIMER_WAIT/1000000000000 as avg_seconds,
    MAX_TIMER_WAIT/1000000000000 as max_seconds,
    SUM_ROWS_EXAMINED as rows_examined,
    SUM_ROWS_SENT as rows_sent
FROM performance_schema.events_statements_summary_by_digest
ORDER BY AVG_TIMER_WAIT DESC
LIMIT 20;
```

### Find Unused Indexes

```sql
-- Find unused indexes
SELECT
    object_schema,
    object_name,
    index_name
FROM performance_schema.table_io_waits_summary_by_index_usage
WHERE index_name IS NOT NULL
AND count_star = 0
AND object_schema NOT IN ('mysql', 'performance_schema')
ORDER BY object_schema, object_name;
```

### Table Statistics and Fragmentation

```sql
-- Table statistics
SELECT
    TABLE_SCHEMA,
    TABLE_NAME,
    TABLE_ROWS,
    DATA_LENGTH,
    INDEX_LENGTH,
    ROUND(DATA_LENGTH / 1024 / 1024, 2) as data_mb,
    ROUND(INDEX_LENGTH / 1024 / 1024, 2) as index_mb
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'mydb'
ORDER BY DATA_LENGTH DESC;

-- Check table fragmentation
SELECT
    TABLE_NAME,
    DATA_FREE / 1024 / 1024 as fragmented_mb,
    (DATA_FREE / (DATA_LENGTH + INDEX_LENGTH + DATA_FREE)) * 100 as fragmentation_pct
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'mydb'
AND DATA_FREE > 0
ORDER BY DATA_FREE DESC;

-- Optimize fragmented tables
OPTIMIZE TABLE users;

-- Update table statistics
ANALYZE TABLE users, orders, products;
```

## Usage Notes

- Run EXPLAIN on all slow queries to understand execution plans
- Monitor Performance Schema regularly for query patterns
- Remove unused indexes to reduce write overhead
- Use ANALYZE TABLE after significant data changes
- Consider partitioning for very large tables
- Test index changes in staging before production
