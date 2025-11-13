---
id: observability-metrics-prometheus
category: skill
tags: [observability, metrics, prometheus, monitoring, timeseries, counters, gauges, histograms]
capabilities:
  - Prometheus metrics implementation (counters, gauges, histograms)
  - HTTP request instrumentation patterns
  - Metric naming and labeling best practices
  - Performance metrics collection with Prometheus
useWhen:
  - Implementing Prometheus metrics instrumentation for Node.js API tracking HTTP request duration, error rates, and throughput
  - Building custom application metrics with Prometheus client libraries exposing business-level KPIs for monitoring dashboards
  - Creating Prometheus alerting rules for SLO violations triggering PagerDuty notifications for high error rates
  - Designing metrics collection strategy for distributed microservices with consistent labeling and cardinality management
  - Instrumenting Express.js middleware with RED metrics (Rate, Errors, Duration) for service health monitoring
estimatedTokens: 750
---

# Metrics with Prometheus

Implement Prometheus metrics for quantitative monitoring using counters, gauges, and histograms to track system behavior.

## Metric Types

```prometheus
# Counter - monotonically increasing
http_requests_total{method="GET", endpoint="/api/users", status="200"} 1523

# Gauge - can go up or down
database_connections_active 45
system_cpu_usage_percent 73.5

# Histogram - distribution of values
http_request_duration_seconds{endpoint="/api/users", quantile="0.95"} 0.235
```

## Implementation

```javascript
const promClient = require('prom-client');

// Counter - monotonically increasing
const httpRequestCounter = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'endpoint', 'status']
});

// Gauge - can go up or down
const activeConnections = new promClient.Gauge({
    name: 'database_connections_active',
    help: 'Active database connections'
});

// Histogram - distribution of values
const httpDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration',
    labelNames: ['endpoint'],
    buckets: [0.1, 0.3, 0.5, 1, 2, 5]
});

// Usage
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = (Date.now() - start) / 1000;
        httpRequestCounter.inc({
            method: req.method,
            endpoint: req.route?.path || req.path,
            status: res.statusCode
        });
        httpDuration.observe(
            { endpoint: req.route?.path },
            duration
        );
    });
    next();
});
```

## OpenTelemetry + Prometheus

```javascript
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');
const { Resource } = require('@opentelemetry/resources');

const sdk = new NodeSDK({
    resource: new Resource({
        'service.name': 'api-server',
        'service.version': '1.0.0',
        'deployment.environment': 'production'
    }),
    metricReader: new PrometheusExporter({
        port: 9464,
        endpoint: '/metrics'
    }),
    traceExporter: new JaegerExporter({
        endpoint: 'http://jaeger:14268/api/traces'
    })
});

sdk.start();
```

## Alerting Rules

```yaml
groups:
  - name: api_alerts
    interval: 30s
    rules:
      # High error rate
      - alert: HighErrorRate
        expr: |
          (
            sum(rate(http_requests_total{status=~"5.."}[5m]))
            /
            sum(rate(http_requests_total[5m]))
          ) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }}"

      # High latency
      - alert: HighLatency
        expr: |
          histogram_quantile(0.95,
            rate(http_request_duration_seconds_bucket[5m])
          ) > 2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High API latency"
          description: "P95 latency is {{ $value }}s"

      # Service down
      - alert: ServiceDown
        expr: up{job="api-server"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service is down"
```

## Best Practices

✅ **Naming conventions** - Use `<namespace>_<metric>_<unit>` format
✅ **Label cardinality** - Keep label combinations under control
✅ **Histogram buckets** - Choose buckets based on expected distribution
✅ **Counter vs gauge** - Use counters for cumulative values, gauges for snapshots
✅ **Instrument middleware** - Automatically track all requests
✅ **Expose /metrics** - Standard endpoint for Prometheus scraping

## Related Observability Skills

**Three Pillars of Observability:**
- orchestr8://skills/observability-structured-logging - Logs pillar for contextual debugging
- orchestr8://skills/observability-metrics-prometheus - Metrics pillar (this skill)
- orchestr8://skills/observability-distributed-tracing - Traces pillar for request flow analysis

**Reliability & SRE:**
- orchestr8://skills/observability-sli-slo-monitoring - SLI/SLO tracking using Prometheus metrics

**Monitoring Infrastructure:**
- orchestr8://guides/prometheus-monitoring-setup - Prometheus deployment guide
- orchestr8://skills/observability-sli-slo-monitoring - Alerting and dashboards
