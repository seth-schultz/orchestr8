---
description: Performance optimization through profiling, bottleneck identification,
  and systematic improvements
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- Write
---

# Optimize Performance: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Performance Engineer** responsible for identifying bottlenecks, optimizing critical paths, and improving system performance while maintaining functionality.

## Phase 1: Profiling & Analysis (0-30%)

**→ Load:** orchestr8://workflows/workflow-performance-optimization

**Activities:**
- Measure current performance baselines
- Profile application execution
- Identify CPU hotspots
- Analyze memory usage patterns
- Review database query performance
- Check network request patterns
- Analyze frontend bundle sizes
- Collect performance metrics
- Identify bottlenecks and slowest operations

**Deliverable:** Performance analysis report with bottlenecks identified

**→ Checkpoint:** Bottlenecks identified with baseline metrics

## Phase 2: Optimization Implementation (30-70%)

**→ Load:** orchestr8://match?query=performance+optimization+caching+database+queries&categories=skill,pattern&mode=index&maxResults=8

**Parallel tracks:**
- **Backend Track:** Database optimization, caching, algorithm improvements
- **Frontend Track:** Bundle optimization, lazy loading, rendering optimization
- **Infrastructure Track:** Resource scaling, CDN configuration

**Activities:**

**Database Optimization:**
- Add missing indexes
- Optimize slow queries
- Implement query result caching
- Use connection pooling
- Add database read replicas if needed

**Caching Implementation:**
- Add application-level caching
- Implement HTTP caching headers
- Use CDN for static assets
- Cache expensive computations

**Code Optimization:**
- Optimize algorithms (O(n²) → O(n log n))
- Reduce redundant computations
- Implement pagination for large datasets
- Use batch processing where applicable
- Optimize loops and iterations

**Frontend Optimization:**
- Code splitting and lazy loading
- Optimize bundle size
- Implement virtual scrolling for long lists
- Optimize images and assets
- Use web workers for heavy computations

**→ Checkpoint:** Optimizations implemented

## Phase 3: Validation & Benchmarking (70-90%)

**→ Load:** orchestr8://match?query=performance+testing+benchmarking+load+testing&categories=skill&mode=index&maxResults=5

**Activities:**
- Run performance benchmarks
- Compare before/after metrics
- Perform load testing
- Test under various conditions
- Verify no functionality regressions
- Run full test suite
- Profile optimized code
- Measure improvement percentages
- Document performance gains

**Deliverable:** Performance improvement report with metrics

**→ Checkpoint:** Performance improvements validated with data

## Phase 4: Monitoring & Documentation (90-100%)

**→ Load:** orchestr8://match?query=monitoring+observability+performance+metrics&categories=guide,skill&mode=index&maxResults=5

**Activities:**
- Set up performance monitoring
- Configure performance alerts
- Define SLAs and performance targets
- Create performance dashboards
- Document optimizations made
- Create performance maintenance plan
- Document performance best practices
- Set up continuous performance testing
- Deploy optimizations to production

**Deliverable:** Monitoring setup and documentation

**→ Checkpoint:** Production performance improved and monitored

## Performance Report Structure

### Executive Summary
- Overall performance improvement (%)
- Key optimizations implemented
- Resources saved
- User experience impact

### Baseline Metrics
- Response times (p50, p95, p99)
- Throughput (requests/second)
- CPU usage
- Memory usage
- Database query times
- Frontend load times

### Optimizations Implemented

#### Database Optimizations
- Indexes added
- Queries optimized
- Caching implemented

#### Code Optimizations
- Algorithms improved
- Redundancy eliminated
- Caching added

#### Frontend Optimizations
- Bundle size reduced
- Lazy loading implemented
- Assets optimized

### Results

#### Performance Improvements
- Response time: 500ms → 150ms (70% faster)
- Throughput: 100 rps → 500 rps (5x increase)
- CPU usage: 80% → 40% (50% reduction)
- Memory usage: 2GB → 1GB (50% reduction)

#### Cost Savings
- Server costs reduced
- Database costs optimized
- CDN costs analyzed

### Monitoring & Alerts
- Metrics tracked
- Alert thresholds
- Dashboard links

### Recommendations
- Further optimization opportunities
- Scaling strategies
- Performance budget guidelines

## Success Criteria

✅ Performance baseline established
✅ Bottlenecks identified and prioritized
✅ Database queries optimized
✅ Caching implemented effectively
✅ Code algorithms improved
✅ Frontend bundle optimized
✅ Performance improvements validated with data
✅ Load testing completed successfully
✅ No functionality regressions
✅ Monitoring and alerts configured
✅ Performance improvements documented
✅ Production performance improved measurably
✅ SLAs met or exceeded
