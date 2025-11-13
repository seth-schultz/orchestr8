---
id: sqlserver-always-on-availability
category: example
tags: [sql-server, high-availability, always-on, disaster-recovery, replication]
capabilities:
  - Configure Always On Availability Groups
  - Monitor synchronization status and lag
  - Manage failover operations
  - Multi-region disaster recovery setup
useWhen:
  - Implementing SQL Server high availability
  - Setting up disaster recovery with RPO/RTO requirements
  - Configuring read-scale out with read replicas
  - Multi-region database replication
estimatedTokens: 750
relatedResources:
  - orchestr8://agents/sqlserver-specialist
---

# SQL Server Always On Availability Groups

## Overview
Always On Availability Groups provide high availability and disaster recovery for SQL Server databases with automatic failover, read replicas, and multi-region support.

## Implementation

```sql
-- Create Availability Group
CREATE AVAILABILITY GROUP AG_MyApp
WITH (
    AUTOMATED_BACKUP_PREFERENCE = SECONDARY,
    DB_FAILOVER = ON,
    DTC_SUPPORT = PER_DB
)
FOR DATABASE MyDB, MyDB_Reporting
REPLICA ON
    'SQL01' WITH (
        ENDPOINT_URL = 'TCP://SQL01.domain.com:5022',
        AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,
        FAILOVER_MODE = AUTOMATIC,
        SECONDARY_ROLE (ALLOW_CONNECTIONS = NO)
    ),
    'SQL02' WITH (
        ENDPOINT_URL = 'TCP://SQL02.domain.com:5022',
        AVAILABILITY_MODE = SYNCHRONOUS_COMMIT,
        FAILOVER_MODE = AUTOMATIC,
        SECONDARY_ROLE (ALLOW_CONNECTIONS = READ_ONLY)
    ),
    'SQL03' WITH (
        ENDPOINT_URL = 'TCP://SQL03.domain.com:5022',
        AVAILABILITY_MODE = ASYNCHRONOUS_COMMIT,
        FAILOVER_MODE = MANUAL,
        SECONDARY_ROLE (ALLOW_CONNECTIONS = READ_ONLY)
    );
GO

-- Check AG status
SELECT
    ag.name as AGName,
    ar.replica_server_name,
    ar.availability_mode_desc,
    ar.failover_mode_desc,
    ars.role_desc,
    ars.operational_state_desc,
    ars.connected_state_desc,
    ars.synchronization_health_desc
FROM sys.availability_groups ag
JOIN sys.availability_replicas ar ON ag.group_id = ar.group_id
JOIN sys.dm_hadr_availability_replica_states ars ON ar.replica_id = ars.replica_id;

-- Monitor synchronization lag
SELECT
    ag.name as AGName,
    ar.replica_server_name,
    db_name(drs.database_id) as DatabaseName,
    drs.synchronization_state_desc,
    drs.synchronization_health_desc,
    drs.log_send_queue_size / 1024.0 as log_send_queue_mb,
    drs.redo_queue_size / 1024.0 as redo_queue_mb,
    drs.last_commit_time
FROM sys.dm_hadr_database_replica_states drs
JOIN sys.availability_replicas ar ON drs.replica_id = ar.replica_id
JOIN sys.availability_groups ag ON ar.group_id = ag.group_id
ORDER BY AGName, replica_server_name, DatabaseName;

-- Manual failover
ALTER AVAILABILITY GROUP AG_MyApp FAILOVER;

-- Add database to AG
ALTER AVAILABILITY GROUP AG_MyApp ADD DATABASE MyNewDB;
```

## Usage Notes

**Availability Modes:**
- **SYNCHRONOUS_COMMIT**: Zero data loss, higher latency (within same region)
- **ASYNCHRONOUS_COMMIT**: Potential data loss, lower latency (cross-region)

**Failover Modes:**
- **AUTOMATIC**: Failover without intervention (requires synchronous mode)
- **MANUAL**: Requires explicit failover command
- **FORCED**: Data loss possible, for disaster scenarios

**Read Replicas:**
- Configure `SECONDARY_ROLE (ALLOW_CONNECTIONS = READ_ONLY)`
- Offload reporting and analytics to secondary replicas
- Use `ApplicationIntent=ReadOnly` in connection string

**Monitoring:**
- `log_send_queue_mb` - Data waiting to be sent to secondary
- `redo_queue_mb` - Data waiting to be applied on secondary
- `synchronization_health_desc` - Overall replication health
- Alert on HEALTHY → NOT_HEALTHY transitions

**Best Practices:**
- Use synchronous mode within region for zero data loss
- Use asynchronous mode across regions to avoid latency
- Configure at least 3 replicas for quorum
- Test failover procedures regularly
- Monitor network latency between replicas
