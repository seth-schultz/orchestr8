---
id: performance-profiling-techniques
category: skill
tags: [performance, profiling, cpu, memory, diagnostics, debugging, optimization]
capabilities:
  - CPU profiling and flame graphs
  - Memory leak detection
  - Network performance analysis
  - Profiling tool integration
estimatedTokens: 660
useWhen:
  - Profiling Node.js application performance with Chrome DevTools identifying CPU bottlenecks and memory leaks
  - Building performance monitoring strategy with custom metrics tracking response time percentiles and throughput
  - Creating benchmark suite comparing algorithm implementations and database query optimization strategies
  - Implementing production profiling with low-overhead sampling to identify performance regressions without impacting users
  - Designing performance testing pipeline with load testing tools (k6, Artillery) validating scalability under stress
---

# Performance Profiling Techniques

## CPU Profiling (Node.js)

```javascript
// Built-in profiler
node --prof app.js
node --prof-process isolate-0x*.log > profile.txt

// Chrome DevTools CPU profiler
node --inspect app.js
// Open chrome://inspect, click "Inspect", go to Profiler tab

// Programmatic profiling
const v8Profiler = require('v8-profiler-next');
const profile = v8Profiler.startProfiling('API Request');
// ... run code ...
const result = v8Profiler.stopProfiling();
result.export((error, result) => {
  fs.writeFileSync('profile.cpuprofile', result);
});
```

## Flame Graphs

```bash
# Install tools
npm install -g 0x

# Generate flame graph
0x app.js
# Access endpoint to trigger load
# Ctrl+C to stop and generate flamegraph.html

# Analyze:
# - Width = CPU time consumed
# - Height = call stack depth
# - Red/orange = CPU-intensive functions
```

## Memory Profiling

```javascript
// Heap snapshots
const v8 = require('v8');
const fs = require('fs');

function takeHeapSnapshot(filename) {
  const stream = v8.writeHeapSnapshot(filename);
  console.log(`Heap snapshot written to ${stream}`);
}

// Usage
takeHeapSnapshot('before.heapsnapshot');
// ... run code that may leak ...
takeHeapSnapshot('after.heapsnapshot');
// Compare in Chrome DevTools Memory tab

// Memory usage tracking
setInterval(() => {
  const usage = process.memoryUsage();
  console.log({
    rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
    external: Math.round(usage.external / 1024 / 1024) + 'MB'
  });
}, 5000);
```

## Memory Leak Detection

```javascript
// clinic doctor - automated diagnosis
npm install -g clinic
clinic doctor -- node app.js
// Generates report with memory leak indicators

// memwatch-next - leak event detection
const memwatch = require('@airbnb/node-memwatch');

memwatch.on('leak', (info) => {
  console.error('Memory leak detected:', info);
  takeHeapSnapshot(`leak-${Date.now()}.heapsnapshot`);
});

memwatch.on('stats', (stats) => {
  console.log('GC stats:', {
    numFullGC: stats.num_full_gc,
    numIncGC: stats.num_inc_gc,
    heapCompactions: stats.heap_compactions,
    usage: stats.current_base / 1024 / 1024 + 'MB'
  });
});
```

## Network Profiling

```javascript
// HTTP request timing
const https = require('https');
const { performance } = require('perf_hooks');

function timedRequest(url) {
  const start = performance.now();
  const timings = {};

  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      timings.firstByte = performance.now() - start;

      res.on('data', () => {});
      res.on('end', () => {
        timings.total = performance.now() - start;
        resolve({ timings, statusCode: res.statusCode });
      });
    });

    req.on('socket', (socket) => {
      socket.on('lookup', () => {
        timings.dns = performance.now() - start;
      });
      socket.on('connect', () => {
        timings.tcp = performance.now() - start;
      });
      socket.on('secureConnect', () => {
        timings.tls = performance.now() - start;
      });
    });

    req.on('error', reject);
  });
}

// Chrome DevTools Network tab
// node --inspect app.js
// Network tab shows requests, timing, waterfall
```

## Production Profiling

```javascript
// clinic.js suite - production-safe profiling
clinic doctor -- node app.js  // General diagnostics
clinic bubbleprof -- node app.js  // Async operations
clinic flame -- node app.js  // Flame graphs

// pprof (Google format)
const pprof = require('pprof');

// Start CPU profiling
pprof.time.start();
setTimeout(() => {
  const profile = pprof.time.stop();
  const buf = pprof.encode(profile);
  fs.writeFileSync('profile.pb.gz', buf);
}, 60000);

// Heap profiling
pprof.heap.start(512 * 1024); // Sample every 512KB
const profile = pprof.heap.profile();
const buf = pprof.encode(profile);
fs.writeFileSync('heap.pb.gz', buf);
```

## Metrics Collection

```javascript
const promClient = require('prom-client');

// CPU usage gauge
const cpuUsage = new promClient.Gauge({
  name: 'process_cpu_usage_percent',
  help: 'Process CPU usage percentage',
  collect() {
    const usage = process.cpuUsage();
    this.set(usage.user / 1000); // microseconds to milliseconds
  }
});

// Event loop lag
const eventLoopLag = new promClient.Gauge({
  name: 'nodejs_eventloop_lag_seconds',
  help: 'Event loop lag in seconds'
});

setInterval(() => {
  const start = Date.now();
  setImmediate(() => {
    eventLoopLag.set((Date.now() - start) / 1000);
  });
}, 5000);
```

## Key Principles

✅ **Profile production** - Use low-overhead tools like clinic.js
✅ **Compare snapshots** - Baseline vs problem state
✅ **Focus on hot paths** - Top 10% of flame graph width
✅ **Track over time** - Memory should stabilize, not grow
✅ **Measure first** - Profile before optimizing

## Related Skills

**Performance Family:**
- orchestr8://skills/performance-optimization - Overview of performance optimization principles and when to use each domain
- orchestr8://skills/performance-api-optimization - API optimization after identifying bottlenecks with profiling
- orchestr8://skills/performance-database-optimization - Database optimization guided by profiling data
- orchestr8://skills/performance-frontend-optimization - Frontend optimization using browser profiling tools

**Related Patterns:**
- orchestr8://patterns/performance-caching - Caching patterns to address profiling-identified bottlenecks

**Implementation Examples:**
- orchestr8://examples/* - Performance examples across different tech stacks

## Profiling Workflow

1. **Identify symptoms** - Slow responses, high CPU, memory growth
2. **Profile first** - Use this skill to identify actual bottlenecks
3. **Optimize specific layer** - Use domain-specific performance skills
4. **Measure improvement** - Re-profile to validate changes
5. **Repeat** - Continue until performance targets are met
