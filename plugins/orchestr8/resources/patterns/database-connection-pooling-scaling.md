---
id: database-connection-pooling-scaling
category: pattern
tags: [database, connection-pooling, scaling, read-replicas, sharding, performance]
capabilities:
  - Connection pool configuration
  - Read replica pattern implementation
  - Database sharding strategies
  - Connection management best practices
useWhen:
  - Connection pool exhaustion scenarios requiring pgBouncer or connection pooling middleware with max pool size tuning
  - Read scaling requirements needing read replica configuration with round-robin load balancing across 2+ replicas
  - High-traffic applications experiencing connection overhead requiring persistent connection reuse and prepared statement caching
  - Distributed systems requiring horizontal database scaling through sharding strategies with consistent hashing
  - Write-heavy workloads needing connection queue management and idle connection timeout configuration
estimatedTokens: 380
relatedResources:
  - orchestr8://examples/database/connection-pooling-implementations
---

# Database Connection Pooling & Scaling

Patterns for efficient connection management and scaling database access through pooling, read replicas, and sharding.

## Core Concepts

### Connection Pooling
Reuse database connections instead of creating new ones for each query:
- **Pool Size**: Balance between resource usage and throughput
- **Idle Timeout**: Close connections that aren't being used
- **Connection Timeout**: Fail fast when pool exhausted
- **Health Checks**: Detect and remove dead connections

### Read Replicas
Separate read and write traffic to scale reads horizontally:
- **Primary**: Handles all writes and critical reads
- **Replicas**: Handle read-only queries
- **Load Balancing**: Distribute reads across replicas (round-robin, least-connections)
- **Replication Lag**: Consider staleness tolerance

### Sharding
Partition data across multiple databases to scale writes:
- **Shard Key**: Determines data distribution (user_id, region, etc.)
- **Strategies**: Hash-based, range-based, geographic
- **Trade-offs**: Complexity vs scalability

## Connection Pool Configuration

### Development Environment
```
max: 10 connections
min: 2 connections
idleTimeout: 10 seconds
```

### Production (Moderate Traffic)
```
max: 20 connections
min: 5 connections
idleTimeout: 30 seconds
```

### Production (High Traffic)
```
max: 50 connections
min: 10 connections
idleTimeout: 60 seconds
```

**Sizing Formula**: `max = (available_db_connections * 0.8) / num_app_instances`

Example: Database allows 100 connections, 4 app instances
- Max per instance: (100 * 0.8) / 4 = 20 connections

## Read Replica Pattern

### Architecture
```
Application
    ↓
Database Router
    ├─→ Primary (writes + critical reads)
    └─→ Replicas (read queries)
        ├─→ Replica 1
        └─→ Replica 2
```

### When to Use Primary vs Replica

**Use Primary For:**
- All write operations (INSERT, UPDATE, DELETE)
- Read-after-write scenarios
- Strong consistency requirements
- Critical transactions

**Use Replicas For:**
- List/search queries
- Reporting and analytics
- Public data display
- Eventual consistency acceptable

### Load Balancing Strategies

**Round-Robin**: Distribute evenly across replicas
- Simple, fair distribution
- Good for uniform replica capacity

**Least Connections**: Route to replica with fewest active connections
- Better for varying query complexity
- Requires connection tracking

**Geographic**: Route to nearest replica
- Lowest latency
- Good for global applications

## Sharding Strategies

### 1. Hash-Based Sharding
- **Method**: Hash shard key (user_id) → determine shard
- **Pros**: Even distribution, simple
- **Cons**: Hard to add shards, no range queries
- **Use Case**: User data, sessions

### 2. Range-Based Sharding
- **Method**: Partition by ranges (IDs 1-1M → Shard 1, 1M-2M → Shard 2)
- **Pros**: Easy to add shards, supports range queries
- **Cons**: Uneven distribution risk, hot shards
- **Use Case**: Time-series data, ordered data

### 3. Geographic Sharding
- **Method**: Partition by region (US-East, EU, Asia)
- **Pros**: Data locality, regulatory compliance
- **Cons**: Uneven distribution, cross-region queries expensive
- **Use Case**: Multi-region applications

### Cross-Shard Queries
**Problem**: Queries spanning multiple shards are expensive

**Solutions:**
- **Avoid**: Design schema to minimize cross-shard queries
- **Denormalize**: Duplicate data to avoid joins
- **Aggregation Service**: Dedicated service for cross-shard analytics
- **CQRS**: Separate read models with pre-aggregated data

## Connection Management Best Practices

### Do's ✅
- **Use connection pooling**: Never create connections per request
- **Always release connections**: Use try/finally or async/await properly
- **Monitor pool health**: Track total, idle, waiting connections
- **Use transactions for related writes**: Ensure consistency
- **Implement health checks**: Detect dead connections
- **Set appropriate timeouts**: Fail fast on pool exhaustion
- **Size pools correctly**: Use sizing formula

### Don'ts ❌
- **Don't create pool per request**: Create once at startup
- **Don't set max too high**: Can overwhelm database
- **Don't set max too low**: Causes connection wait times
- **Don't forget to close pools**: On application shutdown
- **Don't shard prematurely**: Only when necessary (>1TB or write bottleneck)
- **Don't use SELECT * in pooled queries**: Increases network overhead
- **Don't leak connections**: Always release in finally block

## Scaling Decision Matrix

| Symptom | Root Cause | Solution |
|---------|------------|----------|
| Connection pool exhaustion | Too many concurrent requests | Increase pool size or add app instances |
| High read latency | Database CPU saturated with reads | Add read replicas |
| High write latency | Database write capacity limit | Scale primary vertically or shard |
| Slow queries globally | Geographic distance | Geographic sharding or edge caching |
| Database size >1TB | Single database too large | Consider sharding |
| Replication lag >5s | Too much write traffic | Reduce writes or scale primary |

## Monitoring Metrics

### Pool Metrics
- **Total Connections**: Current pool size
- **Idle Connections**: Available connections
- **Waiting Requests**: Requests waiting for connection
- **Connection Errors**: Failed connection attempts

### Database Metrics
- **Query Latency**: p50, p95, p99 response times
- **Slow Queries**: Queries >1 second
- **Connection Count**: Active database connections
- **Replication Lag**: Time behind primary (for replicas)

### Alerts
- Pool utilization >80%
- Waiting requests >0
- Query latency p95 >1s
- Replication lag >10s

## Implementation Guide

See complete TypeScript implementations with:
- PostgreSQL connection pool with monitoring
- Read replica router with round-robin load balancing
- Hash-based, range-based, and geographic sharding
- Transaction management and health checks
- Connection lifecycle management

```
orchestr8://examples/database/connection-pooling-implementations
```

## When to Apply

**Connection Pooling**: Always use for production applications

**Read Replicas**: When...
- Read:write ratio >5:1
- Database CPU >70% from reads
- Need to scale reads without sharding complexity

**Sharding**: When...
- Database size >1TB
- Write throughput hits single-database limits
- Need geographic data distribution
- Vertical scaling no longer cost-effective

## Success Criteria

✅ Connection pool utilization <80%
✅ No waiting requests in steady state
✅ Query latency p95 <100ms
✅ Read replica lag <5 seconds
✅ No connection leaks
✅ Graceful degradation on database issues
