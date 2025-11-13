---
id: performance-caching
category: pattern
tags: [performance, caching, redis, memcached, cdn, http-cache, optimization, memory, distributed]
capabilities:
  - Application-level caching (in-memory)
  - Distributed caching with Redis
  - CDN and edge caching strategies
  - Cache invalidation patterns
  - Cache-aside, write-through, and write-behind patterns
  - HTTP caching headers and CDN integration
  - Cache warming strategies
  - Multi-level cache hierarchies
useWhen:
  - Database load reduction requiring Redis distributed caching with cache-aside or write-through patterns and TTL management
  - API response time optimization needing in-memory LRU caching for hot data and CDN edge caching for static assets
  - High-traffic applications with 10K+ req/sec requiring multi-layer caching strategy across application, distributed, and edge layers
  - Cache invalidation scenarios requiring event-driven invalidation, cache versioning, or time-based expiration strategies
  - Read-heavy workloads with 90%+ cache hit rate potential requiring query result caching and memoization patterns
  - Implementing Redis caching layer for frequently accessed data reducing database load by 80% with TTL strategies
  - Building multi-level cache hierarchy with in-memory L1 cache and distributed L2 cache for optimal hit rates
  - Designing cache invalidation strategy with write-through, write-behind, and event-driven cache updates
  - Creating cache-aside pattern for database queries with automatic cache warming and stale data eviction
  - Implementing HTTP caching with ETag headers and CDN integration for static assets and API responses
estimatedTokens: 650
relatedResources:
  - orchestr8://examples/patterns/performance-caching-implementations
---

# Caching Strategies Pattern

Comprehensive caching strategies to reduce latency, database load, and improve application performance through intelligent data storage and retrieval at multiple layers.

## Cache Layers Overview

### 1. Application-Level Cache (In-Memory)
- **Technology**: NodeCache, memory-cache, lru-cache
- **TTL**: 1-5 minutes for hot data
- **Size Limit**: Configure based on available memory
- **Use Case**: Frequently accessed data within single application instance
- **Hit Rate Target**: >80%

### 2. Distributed Cache (Redis/Memcached)
- **Technology**: Redis (recommended), Memcached
- **TTL**: 5-60 minutes depending on data volatility
- **Use Case**: Shared cache across application instances
- **Features**: Pub/sub, persistence, advanced data structures
- **Hit Rate Target**: >70%

### 3. HTTP Cache (CDN/Browser)
- **Technology**: CloudFlare, Fastly, CloudFront, Akamai
- **TTL**: Hours to days for static assets
- **Use Case**: Static assets, API responses, edge caching
- **Features**: Geographic distribution, DDoS protection
- **Cache Control**: Via HTTP headers

## Core Caching Strategies

### Cache-Aside (Lazy Loading)
**How it works:**
1. Application checks cache first
2. If miss, fetch from database
3. Store result in cache
4. Return to user

**Best for**: Read-heavy workloads, data that doesn't change often
**Pros**: Only caches requested data, simple to implement
**Cons**: Cache misses cause latency, initial requests slower

### Write-Through
**How it works:**
1. Write to database
2. Immediately update cache
3. Return success

**Best for**: Write-heavy workloads, consistency critical
**Pros**: Cache always up-to-date, read performance consistent
**Cons**: Write latency increased, cache stores unused data

### Write-Behind (Write-Back)
**How it works:**
1. Write to cache immediately
2. Acknowledge to user
3. Async worker writes to database

**Best for**: High write throughput, eventual consistency OK
**Pros**: Fast writes, batching possible
**Cons**: Data loss risk, complexity, eventual consistency

## Cache Invalidation Strategies

### 1. Time-Based (TTL)
- **Simple TTL**: Set expiration time on write
- **Sliding Expiration**: Reset TTL on each access
- **Use Case**: Data with predictable staleness tolerance

### 2. Event-Based
- **Trigger**: Application events (user.updated, product.deleted)
- **Action**: Invalidate related cache keys
- **Use Case**: Immediate consistency requirements
- **Implementation**: Event bus + invalidation listeners

### 3. Tag-Based
- **Concept**: Associate cache entries with tags
- **Action**: Invalidate all entries with specific tag
- **Use Case**: Related data invalidation (e.g., all products in category)

### 4. Pattern-Based
- **Action**: Invalidate keys matching pattern (user:123:*)
- **Use Case**: Hierarchical data structures
- **Caution**: Can be slow with large keyspaces

## Multi-Level Cache Hierarchy

```
┌─────────────────────────────────────┐
│   Request                           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   L1: In-Memory Cache               │
│   - NodeCache                       │
│   - TTL: 1-5 min                    │
│   - Hit Rate: 80%+                  │
└──────────────┬──────────────────────┘
               │ Miss
               ▼
┌─────────────────────────────────────┐
│   L2: Distributed Cache (Redis)     │
│   - Shared across instances         │
│   - TTL: 5-60 min                   │
│   - Hit Rate: 70%+                  │
└──────────────┬──────────────────────┘
               │ Miss
               ▼
┌─────────────────────────────────────┐
│   Database                          │
│   - Populate caches on read         │
└─────────────────────────────────────┘
```

## Cache Warming

**Strategies:**
1. **Startup Warming**: Pre-populate cache on application start
2. **Scheduled Warming**: Periodic refresh of hot data
3. **Predictive Warming**: Pre-fetch based on patterns
4. **Manual Warming**: Admin-triggered cache population

**What to warm:**
- Popular products/content
- Configuration data
- Featured items
- User preferences (for active users)

## Performance Considerations

### Cache Key Design
- **Hierarchical**: `user:123:profile`, `product:456:inventory`
- **Versioned**: `api:v2:users:123`
- **Namespaced**: `app:cache:user:123`

### Serialization
- **JSON**: Easy, readable, slower
- **MessagePack**: Compact, faster
- **Protocol Buffers**: Fastest, requires schemas

### Compression
- Enable for values >1KB
- Use gzip or LZ4
- Balance CPU vs network/memory

### Thundering Herd Prevention
- Use locks during cache population
- Probabilistic early expiration
- Request coalescing

## Monitoring and Metrics

**Key Metrics:**
- **Hit Rate**: cache_hits / (cache_hits + cache_misses)
  - Target: >70% for distributed, >80% for in-memory
- **Miss Rate**: Inverse of hit rate
- **Eviction Rate**: How often cache runs out of space
- **Latency**: p50, p95, p99 response times
- **Memory Usage**: Track cache size and growth

**Alerts:**
- Hit rate <70%
- Memory usage >80%
- High eviction rate
- Cache service unavailable

## Best Practices

### Do's ✅
- **Cache immutable data longer**: Static assets with extended TTL
- **Invalidate proactively**: Event-driven invalidation on updates
- **Monitor hit rates**: Target >70% for optimal performance
- **Use appropriate TTL**: Balance freshness vs load (hot: 5-15min, static: hours/days)
- **Multi-level caching**: Memory (L1), Redis (L2), CDN (edge)
- **Cache warming**: Preload frequently accessed data
- **Consistent key naming**: Use hierarchical patterns
- **Compression**: For large cached values
- **Stampede prevention**: Use locks or probabilistic expiration

### Don'ts ❌
- **Don't over-cache**: Rapidly changing or rarely accessed data
- **Don't cache sensitive data unencrypted**: Encrypt PII/sensitive info
- **Don't use unbounded keys**: Implement size limits and eviction
- **Don't ignore monitoring**: Track hit rates and performance
- **Don't forget to invalidate**: Stale data causes bugs

## When to Use

**Good candidates for caching:**
- Frequently accessed, infrequently updated data
- Expensive database queries or API calls
- Session storage and user preferences
- Rate limiting and API throttling
- Static or semi-static content
- Computed aggregations

**Poor candidates:**
- Data that changes constantly
- User-specific sensitive data
- Data accessed once
- Very large objects (>10MB)
- Data requiring strong consistency

## Decision Matrix

| Scenario | Cache Layer | Strategy | TTL |
|----------|-------------|----------|-----|
| API responses | Redis + HTTP | Cache-aside | 5-15 min |
| Static assets | CDN | HTTP headers | Days/Weeks |
| User sessions | Redis | Write-through | 30 min |
| Query results | In-memory + Redis | Cache-aside | 5 min |
| Configuration | In-memory | Write-through | 1 hour |
| Real-time data | None | - | - |

## Complete Implementation

See complete TypeScript implementations with:
- In-memory cache with NodeCache
- Distributed Redis cache with race condition prevention
- HTTP caching with ETag middleware
- All three caching strategies (cache-aside, write-through, write-behind)
- Event-based and tag-based invalidation
- Cache warming and monitoring

```
orchestr8://examples/patterns/performance-caching-implementations
```
