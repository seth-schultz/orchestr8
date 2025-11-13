---
id: observability-structured-logging
category: skill
tags: [observability, logging, structured-logs, winston, elk, json-logs, correlation-id]
capabilities:
  - Structured logging with Winston and JSON format
  - Log levels and contextual logging patterns
  - Correlation ID tracking across requests
  - ELK stack integration (Elasticsearch, Logstash, Kibana)
useWhen:
  - Implementing structured logging with Pino for Node.js application enabling JSON log parsing and Elasticsearch indexing
  - Building centralized logging pipeline aggregating logs from multiple microservices into CloudWatch with log correlation
  - Creating searchable log infrastructure with ELK stack enabling fast debugging with field-based queries and filters
  - Designing log enrichment strategy adding request IDs, user context, and operation metadata for distributed tracing
  - Implementing log sampling for high-traffic endpoints reducing storage costs while maintaining debug capability
estimatedTokens: 780
---

# Structured Logging

Implement structured logging with context, correlation IDs, and JSON formatting for effective debugging and analysis.

## Structured Logging with Winston

```javascript
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

// Structured logs with context
logger.info('User login', {
    userId: 'user123',
    ip: req.ip,
    userAgent: req.get('user-agent'),
    duration: 234,
    success: true
});

logger.error('Database query failed', {
    query: 'SELECT * FROM users',
    error: err.message,
    stack: err.stack,
    retryCount: 3
});
```

## Log Levels

```javascript
logger.debug('Detailed diagnostic info');      // Development only
logger.info('General informational messages'); // Normal operations
logger.warn('Warning: potential issue');       // Unexpected but handled
logger.error('Error occurred', { error });     // Errors requiring attention
logger.fatal('Critical failure', { error });   // System-level failures
```

## Correlation IDs

```javascript
// Track requests across services
app.use((req, res, next) => {
    req.correlationId = req.get('X-Correlation-ID') || uuid();
    res.set('X-Correlation-ID', req.correlationId);

    // Add to all logs
    logger.child({ correlationId: req.correlationId });
    next();
});
```

## ELK Stack Integration

```yaml
# Logstash pipeline
input {
  file {
    path => "/var/log/app/*.log"
    codec => json
    type => "app-logs"
  }
}

filter {
  if [type] == "app-logs" {
    # Parse timestamp
    date {
      match => ["timestamp", "ISO8601"]
    }

    # Extract fields
    grok {
      match => {
        "message" => "%{COMBINEDAPACHELOG}"
      }
    }

    # GeoIP enrichment
    geoip {
      source => "client_ip"
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "app-logs-%{+YYYY.MM.dd}"
  }
}
```

## Retention Policies

```yaml
# Different retention for different data types
logs:
  error_logs: 90 days
  access_logs: 30 days
  debug_logs: 7 days
```

## Best Practices

✅ **Structured format** - Use JSON for machine-readable logs
✅ **Contextual info** - Include userId, correlationId, timestamp
✅ **Appropriate levels** - Use debug/info/warn/error correctly
✅ **Correlation IDs** - Track requests across services
✅ **No sensitive data** - Redact passwords, tokens, PII
✅ **Centralized logging** - Aggregate logs from all services

## Related Observability Skills

**Three Pillars of Observability:**
- orchestr8://skills/observability-structured-logging - Logs pillar (this skill)
- orchestr8://skills/observability-metrics-prometheus - Metrics pillar for quantitative data
- orchestr8://skills/observability-distributed-tracing - Traces pillar for request flows

**Reliability & Debugging:**
- orchestr8://skills/observability-sli-slo-monitoring - Using logs for incident response
- orchestr8://skills/error-handling-logging - Error handling patterns

**Log Infrastructure:**
- orchestr8://patterns/architecture-microservices - Distributed logging design
- orchestr8://skills/observability-distributed-tracing - Correlation IDs and trace context
