---
id: mysql-replication-ha
category: example
tags: [database, mysql, replication, high-availability, failover]
capabilities:
  - Master-slave replication setup
  - Replication monitoring
  - Group replication configuration
  - Failover procedures
  - Replication lag monitoring
useWhen:
  - Setting up MySQL replication
  - Implementing high availability
  - Configuring read replicas
  - Monitoring replication health
  - Performing failover operations
estimatedTokens: 480
relatedResources:
  - orchestr8://agents/mysql-specialist
  - orchestr8://agents/database-architect-sql
  - orchestr8://patterns/database-connection-pooling-scaling
---

# MySQL Replication & High Availability

## Overview
Complete setup and management procedures for MySQL replication, including master-slave configuration, Group Replication, and failover strategies.

## Master-Slave Replication

### Master Configuration

```sql
-- Check master status
SHOW MASTER STATUS;

-- Create replication user
CREATE USER 'replicator'@'%' IDENTIFIED BY 'strong_password';
GRANT REPLICATION SLAVE ON *.* TO 'replicator'@'%';
FLUSH PRIVILEGES;
```

### Slave Configuration

```sql
-- Configure slave to connect to master
CHANGE MASTER TO
    MASTER_HOST='10.0.1.10',
    MASTER_USER='replicator',
    MASTER_PASSWORD='strong_password',
    MASTER_LOG_FILE='mysql-bin.000001',
    MASTER_LOG_POS=154;

-- Start replication
START SLAVE;

-- Check slave status
SHOW SLAVE STATUS\G

-- Key fields to monitor:
-- Slave_IO_Running: Yes
-- Slave_SQL_Running: Yes
-- Seconds_Behind_Master: <1
-- Last_SQL_Error: (empty)
```

## Replication Monitoring

### Monitor Replication Lag

```sql
-- Monitor replication lag
SELECT
    TIMESTAMPDIFF(SECOND,
        MAX(ts),
        NOW()
    ) as seconds_behind
FROM (
    SELECT MAX(ts) as ts
    FROM replication_heartbeat
) t;
```

### Check Replication Status

```sql
-- Detailed slave status
SHOW SLAVE STATUS\G

-- Check for replication errors
SELECT
    CHANNEL_NAME,
    SERVICE_STATE,
    LAST_ERROR_NUMBER,
    LAST_ERROR_MESSAGE,
    LAST_ERROR_TIMESTAMP
FROM performance_schema.replication_connection_status;
```

## Group Replication (MySQL 8.0+)

### Initialize Group Replication

```sql
-- Initialize group replication on first node
SET GLOBAL group_replication_bootstrap_group=ON;
START GROUP_REPLICATION;
SET GLOBAL group_replication_bootstrap_group=OFF;

-- Check group members
SELECT * FROM performance_schema.replication_group_members;

-- Add additional nodes (on each new node)
START GROUP_REPLICATION;
```

### Group Replication Configuration (my.cnf)

```ini
[mysqld]
# Group Replication
disabled_storage_engines="MyISAM,BLACKHOLE,FEDERATED,ARCHIVE,MEMORY"
gtid_mode = ON
enforce_gtid_consistency = ON
binlog_checksum = NONE

# Group Replication settings
plugin_load_add='group_replication.so'
group_replication_group_name="aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
group_replication_start_on_boot=off
group_replication_local_address="10.0.1.10:33061"
group_replication_group_seeds="10.0.1.10:33061,10.0.1.11:33061,10.0.1.12:33061"
group_replication_bootstrap_group=off
```

## Failover Procedures

### Manual Failover (Promote Slave to Master)

```sql
-- On slave to be promoted:
STOP SLAVE;
RESET SLAVE ALL;
SET GLOBAL read_only = 0;

-- Verify it's now writable
SHOW VARIABLES LIKE 'read_only';

-- On other slaves, point to new master:
STOP SLAVE;
CHANGE MASTER TO
    MASTER_HOST='10.0.1.11',
    MASTER_USER='replicator',
    MASTER_PASSWORD='strong_password',
    MASTER_AUTO_POSITION=1;
START SLAVE;
```

### Check Replication Health

```sql
-- Active connections
SELECT
    ID,
    USER,
    HOST,
    DB,
    COMMAND,
    TIME,
    STATE
FROM information_schema.PROCESSLIST
WHERE COMMAND = 'Binlog Dump';

-- Binary log position on master
SHOW MASTER STATUS;

-- Relay log position on slave
SHOW SLAVE STATUS\G
```

## Replication Topologies

### Master-Slave (Read Scaling)
```
Master (Write) → Slave 1 (Read)
              → Slave 2 (Read)
              → Slave 3 (Read)
```

### Master-Master (Active-Active)
```
Master 1 ←→ Master 2
```

### Group Replication (Multi-Master)
```
Node 1 ←→ Node 2 ←→ Node 3
   ↑                    ↓
   └────────────────────┘
```

## Usage Notes

- Always use ROW-based replication format for safety
- Monitor replication lag continuously
- Test failover procedures regularly
- Use GTID-based replication for easier failover
- Implement monitoring alerts for replication errors
- Consider ProxySQL or HAProxy for connection routing
- Use orchestrator or MHA for automated failover
- Keep slave servers with identical hardware for consistent performance
