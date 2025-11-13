---
id: performance-optimization
category: skill
tags: [performance, optimization, caching, database, scalability]
capabilities:
  - Performance optimization strategies overview
  - Cross-cutting performance principles
  - Performance domain navigation
useWhen:
  - Getting overview of performance optimization approaches
  - Understanding performance optimization principles
  - Identifying which specific performance optimization domain to focus on
estimatedTokens: 180
---

# Performance Optimization Best Practices

## Overview

Performance optimization is a multi-faceted discipline covering API response times, database queries, frontend rendering, and system diagnostics. This guide provides high-level principles and directs you to domain-specific optimization resources.

## Core Performance Principles

### Measure Before Optimizing
- Profile to identify actual bottlenecks, not assumed ones
- Establish baseline metrics (P50, P95, P99 latencies)
- Set performance budgets and track regressions

### Layer-Specific Optimization
Different application layers require different optimization strategies:

- **API Layer**: Pagination, rate limiting, compression, request batching
- **Database Layer**: Indexing, query optimization, connection pooling, N+1 prevention
- **Frontend Layer**: Code splitting, lazy loading, bundle optimization, Web Vitals
- **System Layer**: CPU profiling, memory leak detection, resource monitoring

### Common Cross-Cutting Patterns
- **Caching**: Cache-aside pattern, TTL strategies, invalidation patterns
- **Resource Pooling**: Database connections, HTTP clients, worker threads
- **Async Processing**: Background jobs, message queues, event-driven architecture
- **Monitoring**: APM tools, custom metrics, distributed tracing

## Key Metrics to Monitor

- **Response Time**: P50, P95, P99 latencies
- **Throughput**: Requests per second
- **Error Rate**: 4xx and 5xx responses
- **Database**: Query time, connection pool usage
- **Cache**: Hit rate, miss rate
- **Memory**: Heap usage, garbage collection
- **CPU**: Usage percentage

## Related Performance Skills

### Domain-Specific Optimization

**API Performance:**
- orchestr8://skills/performance-api-optimization - REST/GraphQL optimization, pagination strategies, rate limiting, request batching, GraphQL DataLoader patterns

**Database Performance:**
- orchestr8://skills/performance-database-optimization - Query optimization, indexing strategies, N+1 query prevention, connection pooling, read replicas

**Frontend Performance:**
- orchestr8://skills/performance-frontend-optimization - Bundle optimization, code splitting, lazy loading, React performance, Web Vitals improvement

### Tools and Diagnostics

**Profiling and Diagnostics:**
- orchestr8://skills/performance-profiling-techniques - CPU profiling, flame graphs, memory leak detection, production profiling, metrics collection

### Related Patterns

**Architecture Patterns:**
- orchestr8://patterns/performance-caching - Comprehensive caching strategies and patterns
- orchestr8://patterns/database-connection-pooling-scaling - Connection pooling best practices
- orchestr8://patterns/database-indexing-strategies - Index design and optimization
- orchestr8://patterns/database-query-optimization - Query performance patterns

### Implementation Examples

**Code Examples:**
- orchestr8://examples/* - Performance optimization implementation examples across different tech stacks

## When to Use Specific Skills

- **Slow API responses** → performance-api-optimization
- **Database bottlenecks** → performance-database-optimization
- **Large frontend bundles** → performance-frontend-optimization
- **Unknown bottlenecks** → performance-profiling-techniques (profile first!)
- **Memory leaks** → performance-profiling-techniques
- **High latency** → Start with profiling, then target specific layer
