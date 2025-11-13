---
id: mysql-innodb-configuration
category: example
tags: [database, mysql, innodb, configuration, tuning]
capabilities:
  - InnoDB buffer pool optimization
  - Log file configuration
  - I/O performance tuning
  - Connection management
  - Binary logging setup
useWhen:
  - Configuring MySQL for production workloads
  - Optimizing InnoDB performance
  - Setting up replication
  - Tuning MySQL for SSD storage
  - Configuring logging and monitoring
estimatedTokens: 480
relatedResources:
  - orchestr8://agents/mysql-specialist
  - orchestr8://agents/database-architect-sql
---

# MySQL InnoDB Configuration

## Overview
Production-ready MySQL configuration optimized for InnoDB storage engine with focus on performance, reliability, and replication support.

## Production Configuration (my.cnf)

```ini
# my.cnf - Production configuration

# GENERAL
datadir = /var/lib/mysql
socket = /var/lib/mysql/mysql.sock
pid-file = /var/run/mysqld/mysqld.pid

# CONNECTIONS
max_connections = 500
max_connect_errors = 100000
max_allowed_packet = 64M

# INNODB BUFFER POOL (Most Important Setting)
# Set to 70-80% of available RAM
innodb_buffer_pool_size = 16G
innodb_buffer_pool_instances = 16  # 1 instance per GB

# INNODB LOG FILES
innodb_log_file_size = 2G
innodb_log_buffer_size = 64M
innodb_flush_log_at_trx_commit = 2  # 1=safe, 2=faster
innodb_flush_method = O_DIRECT

# INNODB PERFORMANCE
innodb_read_io_threads = 8
innodb_write_io_threads = 8
innodb_io_capacity = 2000           # SSD
innodb_io_capacity_max = 4000       # SSD max
innodb_lru_scan_depth = 2000

# QUERY CACHE (Deprecated in 8.0)
query_cache_type = 0
query_cache_size = 0

# THREAD POOL
thread_cache_size = 100
thread_stack = 256K

# TABLE CACHE
table_open_cache = 4000
table_definition_cache = 2000

# TEMP TABLES
tmp_table_size = 128M
max_heap_table_size = 128M

# SORT & JOIN
sort_buffer_size = 2M
join_buffer_size = 2M
read_rnd_buffer_size = 4M

# LOGGING
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow-query.log
long_query_time = 1
log_queries_not_using_indexes = 1
log_slow_admin_statements = 1

general_log = 0
log_error = /var/log/mysql/error.log

# BINARY LOGGING (Required for replication)
server_id = 1
log_bin = /var/log/mysql/mysql-bin
binlog_format = ROW
expire_logs_days = 7
max_binlog_size = 1G
sync_binlog = 1

# REPLICATION
relay_log = /var/log/mysql/relay-bin
relay_log_recovery = 1
```

## Key Settings Explained

### Buffer Pool Size
- **Setting**: `innodb_buffer_pool_size = 16G`
- **Purpose**: Cache data and indexes in memory
- **Recommendation**: 70-80% of available RAM
- **Impact**: Most critical performance setting

### Log File Size
- **Setting**: `innodb_log_file_size = 2G`
- **Purpose**: Transaction log size
- **Recommendation**: Larger for write-heavy workloads
- **Impact**: Affects recovery time and write performance

### Flush Log at Transaction Commit
- **Setting**: `innodb_flush_log_at_trx_commit = 2`
- **Options**:
  - `1`: Full ACID compliance (safe, slower)
  - `2`: Flush to OS cache (faster, small risk)
  - `0`: No flush (fastest, higher risk)

### I/O Capacity
- **Setting**: `innodb_io_capacity = 2000`
- **Purpose**: Background I/O operations rate
- **Recommendation**: 2000-4000 for SSD, 200-400 for HDD

### Binary Logging
- **Format**: ROW (safest for replication)
- **Alternatives**: STATEMENT (smaller), MIXED (hybrid)
- **Purpose**: Enables point-in-time recovery and replication

## Usage Notes

- Always test configuration changes in staging first
- Monitor buffer pool hit ratio (should be >99%)
- Adjust buffer pool size based on available RAM
- Use O_DIRECT to avoid double buffering
- Enable slow query log to identify performance issues
- Set appropriate binlog retention based on backup strategy
- Consider using MySQL Tuner or MySQLTuner scripts for recommendations
