---
id: sqlserver-dmv-performance-tuning
category: example
tags: [sql-server, performance, dmv, query-optimization, indexing]
capabilities:
  - Identify missing and unused indexes using DMVs
  - Find top CPU and I/O consuming queries
  - Analyze buffer pool usage and wait statistics
  - Performance monitoring and troubleshooting
useWhen:
  - Need to diagnose SQL Server performance issues
  - Identifying query optimization opportunities
  - Finding missing or unused indexes
  - Analyzing system bottlenecks and resource consumption
estimatedTokens: 950
relatedResources:
  - orchestr8://agents/sqlserver-specialist
---

# SQL Server DMV Performance Tuning

## Overview
Dynamic Management Views (DMVs) provide real-time insights into SQL Server performance, enabling identification of missing indexes, expensive queries, and system bottlenecks.

## Implementation

```sql
-- Find missing indexes
SELECT
    d.statement,
    d.equality_columns,
    d.inequality_columns,
    d.included_columns,
    s.avg_user_impact,
    s.user_seeks,
    s.user_scans,
    'CREATE INDEX IX_' + REPLACE(REPLACE(d.statement, '[', ''), ']', '') +
    ' ON ' + d.statement +
    ' (' + ISNULL(d.equality_columns, '') +
    CASE WHEN d.inequality_columns IS NOT NULL
        THEN CASE WHEN d.equality_columns IS NOT NULL THEN ',' ELSE '' END + d.inequality_columns
        ELSE '' END + ')' +
    CASE WHEN d.included_columns IS NOT NULL
        THEN ' INCLUDE (' + d.included_columns + ')'
        ELSE '' END as create_statement
FROM sys.dm_db_missing_index_details d
INNER JOIN sys.dm_db_missing_index_groups g ON d.index_handle = g.index_handle
INNER JOIN sys.dm_db_missing_index_group_stats s ON g.index_group_handle = s.group_handle
WHERE s.avg_user_impact > 50
ORDER BY s.avg_user_impact DESC;

-- Find unused indexes
SELECT
    OBJECT_NAME(i.object_id) as TableName,
    i.name as IndexName,
    i.type_desc,
    s.user_seeks,
    s.user_scans,
    s.user_lookups,
    s.user_updates
FROM sys.indexes i
LEFT JOIN sys.dm_db_index_usage_stats s
    ON i.object_id = s.object_id
    AND i.index_id = s.index_id
    AND s.database_id = DB_ID()
WHERE i.type_desc <> 'HEAP'
    AND OBJECTPROPERTY(i.object_id, 'IsUserTable') = 1
    AND (s.user_seeks + s.user_scans + s.user_lookups = 0
         OR s.index_id IS NULL)
ORDER BY TableName, IndexName;

-- Top CPU consuming queries
SELECT TOP 20
    qs.total_worker_time / qs.execution_count as avg_cpu_time,
    qs.total_worker_time as total_cpu_time,
    qs.execution_count,
    SUBSTRING(qt.text, (qs.statement_start_offset/2)+1,
        ((CASE qs.statement_end_offset
            WHEN -1 THEN DATALENGTH(qt.text)
            ELSE qs.statement_end_offset
        END - qs.statement_start_offset)/2) + 1) as query_text,
    qp.query_plan
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
CROSS APPLY sys.dm_exec_query_plan(qs.plan_handle) qp
ORDER BY qs.total_worker_time DESC;

-- Top I/O consuming queries
SELECT TOP 20
    (qs.total_logical_reads + qs.total_logical_writes) / qs.execution_count as avg_io,
    qs.execution_count,
    SUBSTRING(qt.text, (qs.statement_start_offset/2)+1,
        ((CASE qs.statement_end_offset
            WHEN -1 THEN DATALENGTH(qt.text)
            ELSE qs.statement_end_offset
        END - qs.statement_start_offset)/2) + 1) as query_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) qt
ORDER BY avg_io DESC;

-- Buffer pool usage by database
SELECT
    DB_NAME(database_id) as DatabaseName,
    COUNT(*) * 8 / 1024 as BufferPoolMB
FROM sys.dm_os_buffer_descriptors
WHERE database_id <> 32767
GROUP BY database_id
ORDER BY BufferPoolMB DESC;

-- Wait statistics
SELECT
    wait_type,
    wait_time_ms / 1000.0 as wait_time_sec,
    waiting_tasks_count,
    wait_time_ms / waiting_tasks_count as avg_wait_ms
FROM sys.dm_os_wait_stats
WHERE wait_type NOT IN (
    'CLR_SEMAPHORE', 'LAZYWRITER_SLEEP', 'RESOURCE_QUEUE',
    'SLEEP_TASK', 'SLEEP_SYSTEMTASK', 'WAITFOR'
)
AND waiting_tasks_count > 0
ORDER BY wait_time_ms DESC;
```

## Usage Notes

**Missing Indexes:**
- Focus on indexes with `avg_user_impact > 50`
- Review generated CREATE INDEX statements before executing
- Consider table size and update frequency

**Unused Indexes:**
- Verify usage stats before dropping
- Keep primary keys and unique constraints
- Consider maintenance window before removing

**CPU/IO Queries:**
- Analyze execution plans for optimization opportunities
- Look for table scans, missing indexes, or inefficient joins
- Consider parameter sniffing issues

**Wait Statistics:**
- Common waits: PAGEIOLATCH (disk I/O), CXPACKET (parallelism), LCK (locking)
- Reset wait stats after changes: `DBCC SQLPERF('sys.dm_os_wait_stats', CLEAR)`
