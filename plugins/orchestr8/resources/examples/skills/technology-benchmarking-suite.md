---
id: technology-benchmarking-suite
category: example
tags: [benchmarking, performance-testing, benchmark-js, automation]
capabilities:
  - Performance benchmark suite implementation
  - Operations per second measurement
  - Statistical validity testing
  - Result collection and analysis
useWhen:
  - Building performance comparison frameworks
  - Automating benchmark execution
  - Collecting statistically valid performance data
estimatedTokens: 280
relatedResources:
  - orchestr8://skills/technology-benchmarking
---

# Technology Benchmarking: Performance Suite

Complete TypeScript implementation of a performance benchmarking suite using Benchmark.js.

## Benchmark Suite Implementation

```typescript
import Benchmark from 'benchmark';

interface BenchmarkResult {
  name: string;
  opsPerSecond: number;
  mean: number;
  standardDeviation: number;
  sampleSize: number;
}

class TechnologyBenchmark {
  private suite = new Benchmark.Suite();
  private results: BenchmarkResult[] = [];

  add(name: string, fn: () => void): this {
    this.suite.add(name, fn);
    return this;
  }

  async run(): Promise<BenchmarkResult[]> {
    return new Promise((resolve) => {
      this.suite
        .on('cycle', (event: any) => {
          const bench = event.target;
          this.results.push({
            name: bench.name,
            opsPerSecond: bench.hz,
            mean: bench.stats.mean,
            standardDeviation: bench.stats.deviation,
            sampleSize: bench.stats.sample.length
          });
        })
        .on('complete', () => resolve(this.results))
        .run({ async: true });
    });
  }

  getFastest(): BenchmarkResult | undefined {
    return this.results.reduce((fastest, current) =>
      current.opsPerSecond > fastest.opsPerSecond ? current : fastest
    );
  }

  getComparison(): string {
    const fastest = this.getFastest();
    if (!fastest) return 'No results';

    return this.results
      .map(result => {
        const pctSlower = ((fastest.opsPerSecond - result.opsPerSecond) / fastest.opsPerSecond) * 100;
        return `${result.name}: ${result.opsPerSecond.toFixed(0)} ops/sec (${pctSlower.toFixed(1)}% slower)`;
      })
      .join('\n');
  }
}

// Usage Example
const benchmark = new TechnologyBenchmark();

// State Management Library Comparison
benchmark
  .add('Redux: Add 1000 todos', () => {
    for (let i = 0; i < 1000; i++) {
      store.dispatch(addTodo(`Todo ${i}`));
    }
  })
  .add('Zustand: Add 1000 todos', () => {
    for (let i = 0; i < 1000; i++) {
      useTodoStore.getState().addTodo(`Todo ${i}`);
    }
  })
  .add('Jotai: Add 1000 todos', () => {
    for (let i = 0; i < 1000; i++) {
      addTodoAtom(`Todo ${i}`);
    }
  });

const results = await benchmark.run();
console.log(benchmark.getComparison());

// Output:
// Zustand: Add 1000 todos: 12300 ops/sec (0.0% slower)
// Jotai: Add 1000 todos: 11800 ops/sec (4.1% slower)
// Redux: Add 1000 todos: 8450 ops/sec (31.3% slower)
```

## Performance Metrics Interface

```typescript
interface PerformanceMetrics {
  operationsPerSecond: number;

  latency: {
    p50: number;      // Median
    p95: number;      // 95th percentile
    p99: number;      // 99th percentile
    max: number;      // Worst case
  };

  memory: {
    initial: number;      // Baseline memory (MB)
    peak: number;         // Peak memory (MB)
    average: number;      // Average during test (MB)
  };

  cpu: {
    average: number;      // Average CPU % during test
    peak: number;         // Peak CPU %
  };

  frontend?: {
    bundleSize: {
      minified: number;         // Minified size (KB)
      gzipped: number;          // Gzipped size (KB)
    };
    renderCount: number;        // Number of re-renders
  };
}
```

## Load Testing Integration

```bash
# Backend load testing with autocannon
npm install -g autocannon
autocannon -c 100 -d 30 http://localhost:3000/api/todos

# Results:
# 100 connections, 30 second duration
# Requests/sec: 15234
# Latency p50: 6.2ms
# Latency p99: 23.4ms
```
