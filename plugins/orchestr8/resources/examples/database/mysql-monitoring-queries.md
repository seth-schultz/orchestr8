---
id: mysql-monitoring-queries
category: example
tags: [database, mysql, monitoring, troubleshooting, performance]
capabilities:
  - Active connection monitoring
  - Long-running query detection
  - Deadlock analysis
  - Buffer pool metrics
  - Connection statistics
useWhen:
  - Troubleshooting performance issues
  - Monitoring active connections
  - Identifying blocking queries
  - Analyzing deadlocks
  - Checking buffer pool efficiency
estimatedTokens: 450
relatedResources:
  - orchestr8://agents/mysql-specialist
  - orchestr8://agents/database-architect-sql
  - orchestr8://skills/observability-metrics-prometheus
---

# MySQL Monitoring Queries

## Overview
Essential queries for monitoring MySQL database health, identifying performance issues, and troubleshooting problems in production environments.

## Connection Monitoring

### Active Connections

```sql
-- Active connections
SELECT
    ID,
    USER,
    HOST,
    DB,
    COMMAND,
    TIME,
    STATE,
    LEFT(INFO, 100) as QUERY
FROM information_schema.PROCESSLIST
WHERE COMMAND != 'Sleep'
ORDER BY TIME DESC;
```

### Long-Running Queries

```sql
-- Long-running queries
SELECT
    ID,
    USER,
    HOST,
    DB,
    TIME,
    STATE,
    INFO
FROM information_schema.PROCESSLIST
WHERE TIME > 300
AND COMMAND != 'Sleep';

-- Kill long-running query
KILL QUERY 12345;
KILL CONNECTION 12345;
```

### Connection Statistics

```sql
-- Connection statistics
SHOW STATUS LIKE 'Threads%';
SHOW STATUS LIKE 'Connections';
SHOW STATUS LIKE 'Max_used_connections';

-- Connection details
SELECT
    SUBSTRING_INDEX(host, ':', 1) as host_short,
    COUNT(*) as connections,
    SUM(IF(command = 'Sleep', 1, 0)) as idle,
    SUM(IF(command != 'Sleep', 1, 0)) as active
FROM information_schema.PROCESSLIST
GROUP BY host_short
ORDER BY connections DESC;
```

## Lock and Deadlock Analysis

### Table Locks

```sql
-- Table locks
SHOW OPEN TABLES WHERE In_use > 0;

-- Lock wait status
SELECT
    waiting.ID as waiting_id,
    waiting.USER as waiting_user,
    waiting.HOST as waiting_host,
    waiting_query.SQL_TEXT as waiting_query,
    blocking.ID as blocking_id,
    blocking.USER as blocking_user,
    blocking.HOST as blocking_host,
    blocking_query.SQL_TEXT as blocking_query
FROM sys.innodb_lock_waits AS ilw
INNER JOIN information_schema.PROCESSLIST AS waiting ON ilw.waiting_pid = waiting.ID
INNER JOIN information_schema.PROCESSLIST AS blocking ON ilw.blocking_pid = blocking.ID
INNER JOIN performance_schema.events_statements_current AS waiting_query
    ON waiting.ID = waiting_query.THREAD_ID
INNER JOIN performance_schema.events_statements_current AS blocking_query
    ON blocking.ID = blocking_query.THREAD_ID;
```

### Deadlocks

```sql
-- Deadlock information (from InnoDB status)
SHOW ENGINE INNODB STATUS\G

-- Find potential deadlock queries
SELECT
    r.trx_id waiting_trx_id,
    r.trx_mysql_thread_id waiting_thread,
    r.trx_query waiting_query,
    b.trx_id blocking_trx_id,
    b.trx_mysql_thread_id blocking_thread,
    b.trx_query blocking_query
FROM information_schema.innodb_lock_waits w
INNER JOIN information_schema.innodb_trx b ON b.trx_id = w.blocking_trx_id
INNER JOIN information_schema.innodb_trx r ON r.trx_id = w.requesting_trx_id;
```

## Performance Metrics

### InnoDB Buffer Pool Status

```sql
-- Buffer pool hit ratio (should be > 99%)
SHOW STATUS LIKE 'Innodb_buffer_pool_read%';

-- Calculate hit ratio
SELECT
    CONCAT(
        ROUND(
            (1 - (reads / requests)) * 100,
            2
        ),
        '%'
    ) as buffer_pool_hit_ratio
FROM (
    SELECT
        VARIABLE_VALUE as requests
    FROM information_schema.GLOBAL_STATUS
    WHERE VARIABLE_NAME = 'Innodb_buffer_pool_read_requests'
) requests,
(
    SELECT
        VARIABLE_VALUE as reads
    FROM information_schema.GLOBAL_STATUS
    WHERE VARIABLE_NAME = 'Innodb_buffer_pool_reads'
) reads;
```

### InnoDB Status

```sql
-- Comprehensive InnoDB status
SHOW ENGINE INNODB STATUS\G

-- Key sections to review:
-- SEMAPHORES: Mutex contention
-- TRANSACTIONS: Active transactions
-- FILE I/O: I/O thread status
-- INSERT BUFFER: Change buffer status
-- LOG: Redo log status
-- BUFFER POOL AND MEMORY: Buffer pool stats
-- ROW OPERATIONS: Row-level operations
```

## System Health Checks

### Database Size

```sql
-- Database and table sizes
SELECT
    TABLE_SCHEMA as 'Database',
    ROUND(SUM(DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024, 2) as 'Size (MB)'
FROM information_schema.TABLES
GROUP BY TABLE_SCHEMA
ORDER BY SUM(DATA_LENGTH + INDEX_LENGTH) DESC;
```

### Server Uptime and Version

```sql
-- Server info
SELECT VERSION() as version;
SHOW VARIABLES LIKE 'uptime';
SHOW GLOBAL STATUS LIKE 'uptime';

-- Server configuration
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
SHOW VARIABLES LIKE 'max_connections';
SHOW VARIABLES LIKE 'thread_cache_size';
```

## Usage Notes

- Run monitoring queries frequently via external monitoring tools
- Set up alerts for long-running queries (>300 seconds)
- Monitor buffer pool hit ratio - should be >99%
- Watch for increasing deadlocks in production
- Use Performance Schema for detailed query analysis
- Monitor connection count vs max_connections
- Check replication lag on slave servers
- Review InnoDB status regularly for anomalies
