---
id: observability-distributed-tracing
category: skill
tags: [observability, tracing, opentelemetry, jaeger, distributed-systems, spans, microservices]
capabilities:
  - Distributed tracing with OpenTelemetry
  - Span creation and context propagation
  - Trace instrumentation for microservices
  - Jaeger integration for trace visualization
useWhen:
  - Implementing distributed tracing with OpenTelemetry tracking requests across Node.js microservices and external APIs
  - Building request flow visualization with Jaeger identifying performance bottlenecks in multi-service transactions
  - Creating trace context propagation across HTTP and message queue boundaries with W3C Trace Context headers
  - Debugging latency issues in distributed system using span analysis to pinpoint slow database queries and external calls
  - Designing sampling strategy for traces balancing observability needs with infrastructure costs for high-throughput services
estimatedTokens: 800
---

# Distributed Tracing

Implement distributed tracing with OpenTelemetry to track requests across microservices and understand system behavior.

## OpenTelemetry Tracing

```javascript
const { trace, context } = require('@opentelemetry/api');
const tracer = trace.getTracer('user-service');

async function processOrder(orderId) {
    // Start span
    const span = tracer.startSpan('process_order');

    try {
        // Add attributes
        span.setAttribute('order.id', orderId);
        span.setAttribute('order.amount', order.amount);

        // Nested spans for sub-operations
        await fetchUserData(orderId, span);
        await validateInventory(orderId, span);
        await chargePayment(orderId, span);

        span.setStatus({ code: SpanStatusCode.OK });
    } catch (err) {
        span.setStatus({
            code: SpanStatusCode.ERROR,
            message: err.message
        });
        span.recordException(err);
        throw err;
    } finally {
        span.end();
    }
}

async function fetchUserData(orderId, parentSpan) {
    const span = tracer.startSpan('fetch_user_data', {
        parent: parentSpan
    });

    try {
        const user = await db.query('SELECT...');
        span.setAttribute('user.id', user.id);
        return user;
    } finally {
        span.end();
    }
}
```

## Trace Sampling

```javascript
// Trace sampling for high-volume systems
const sampler = new TraceIdRatioBasedSampler(0.1); // Sample 10%

// Adaptive sampling
const sampler = new AdaptiveSampler({
    baseRate: 0.01,        // 1% baseline
    errorRate: 1.0,        // 100% of errors
    slowRequestRate: 0.5   // 50% of slow requests
});
```

## Cross-Service Propagation

```javascript
// Service A - Create trace context
const span = tracer.startSpan('call_service_b');
const headers = {};

// Inject trace context into headers
propagation.inject(context.active(), headers);

await fetch('http://service-b/api/endpoint', {
    headers
});

span.end();

// Service B - Extract trace context
app.use((req, res, next) => {
    const ctx = propagation.extract(context.active(), req.headers);
    context.with(ctx, () => {
        const span = tracer.startSpan('handle_request');
        // Request handled within trace context
        next();
        span.end();
    });
});
```

## Jaeger Integration

```javascript
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const exporter = new JaegerExporter({
    endpoint: 'http://jaeger:14268/api/traces',
    serviceName: 'user-service'
});

const provider = new NodeTracerProvider({
    resource: new Resource({
        'service.name': 'user-service',
        'service.version': '1.0.0'
    })
});

provider.addSpanProcessor(new BatchSpanProcessor(exporter));
provider.register();
```

## Debugging Workflow

```bash
# 1. Check metrics - is there a spike/drop?
# 2. Find affected traces
# 3. Examine logs with correlation ID
# 4. Analyze span attributes
# 5. Identify root cause
```

## Best Practices

✅ **Span attributes** - Add contextual data (user ID, order ID, etc.)
✅ **Sampling strategy** - Sample intelligently (errors always, slow requests often)
✅ **Context propagation** - Propagate trace context across services
✅ **Error recording** - Record exceptions in spans
✅ **Semantic conventions** - Follow OpenTelemetry naming standards
✅ **Performance** - Minimize tracing overhead with sampling

## Related Observability Skills

**Three Pillars of Observability:**
- orchestr8://skills/observability-structured-logging - Logs pillar for contextual debugging
- orchestr8://skills/observability-metrics-prometheus - Metrics pillar for quantitative monitoring
- orchestr8://skills/observability-distributed-tracing - Traces pillar (this skill)

**Reliability & SRE:**
- orchestr8://skills/observability-sli-slo-monitoring - SLI/SLO tracking and error budgets

**Performance:**
- orchestr8://patterns/performance-caching - Caching strategies
- orchestr8://skills/performance-profiling-techniques - Profiling and optimization
