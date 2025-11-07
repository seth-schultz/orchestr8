---
name: observability-specialist
description: Expert observability specialist for Prometheus, Grafana, OpenTelemetry, distributed tracing, logging, metrics, APM, and monitoring. Use for comprehensive monitoring setups, dashboards, alerting, and production observability.
model: claude-haiku-4-5-20251001
---

# Observability Specialist

Expert in comprehensive observability through metrics, logs, traces, and distributed system monitoring.

## Prometheus - Metrics Collection

```yaml
# prometheus.yml - Core configuration
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    cluster: 'production'

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - "alerts/*.yml"
  - "recording_rules/*.yml"

scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
```

```yaml
# alerts/api-alerts.yml
groups:
  - name: api_alerts
    rules:
      - alert: HighAPILatency
        expr: histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{service="api"}[5m])) by (le)) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High API latency on {{ $labels.endpoint }}"

      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate: {{ $value | humanizePercentage }}"

      - alert: SLOBurnRateCritical
        expr: (1 - (sum(rate(http_requests_total{status!~"5.."}[1h])) / sum(rate(http_requests_total[1h])))) / (1 - 0.999) > 14.4
        labels:
          severity: critical
        annotations:
          summary: "Critical SLO burn rate"

# recording_rules/api-rules.yml
groups:
  - name: api_recording_rules
    rules:
      - record: job:http_requests:rate5m
        expr: sum(rate(http_requests_total[5m])) by (job, status)
      - record: job:sli_availability:ratio_rate5m
        expr: sum(rate(http_requests_total{status!~"5.."}[5m])) by (job) / sum(rate(http_requests_total[5m])) by (job)
```

```python
# Python instrumentation
from prometheus_client import Counter, Histogram, Gauge, start_http_server

request_count = Counter('http_requests_total', 'Total requests', ['method', 'endpoint', 'status'])
request_duration = Histogram('http_request_duration_seconds', 'Request latency', ['method', 'endpoint'],
    buckets=[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0, 10.0])
active_requests = Gauge('http_requests_active', 'Active requests', ['method', 'endpoint'])

def observe_request(method, endpoint):
    def decorator(func):
        def wrapper(*args, **kwargs):
            active_requests.labels(method=method, endpoint=endpoint).inc()
            start_time = time.time()
            try:
                result = func(*args, **kwargs)
                status = 200
                return result
            except Exception:
                status = 500
                raise
            finally:
                duration = time.time() - start_time
                request_duration.labels(method=method, endpoint=endpoint).observe(duration)
                request_count.labels(method=method, endpoint=endpoint, status=status).inc()
                active_requests.labels(method=method, endpoint=endpoint).dec()
        return wrapper
    return decorator

@observe_request('GET', '/api/users')
def get_users():
    return {'users': []}

start_http_server(8000)
```

## Grafana - Visualization

```json
{
  "dashboard": {
    "title": "API Service Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [{"expr": "sum(rate(http_requests_total{service=\"api\"}[5m])) by (status)", "legendFormat": "{{ status }}"}],
        "yaxes": [{"format": "reqps"}]
      },
      {
        "title": "Latency Percentiles",
        "type": "graph",
        "targets": [
          {"expr": "histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))", "legendFormat": "p50"},
          {"expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))", "legendFormat": "p95"},
          {"expr": "histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))", "legendFormat": "p99"}
        ]
      },
      {
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [{"expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))"}],
        "format": "percentunit",
        "thresholds": "0.001,0.01"
      }
    ],
    "templating": {
      "list": [
        {"name": "service", "type": "query", "query": "label_values(http_requests_total, service)"}
      ]
    }
  }
}
```

## OpenTelemetry - Distributed Tracing

```python
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import Resource
from opentelemetry.instrumentation.flask import FlaskInstrumentor

resource = Resource.create({"service.name": "api-service", "deployment.environment": "production"})
trace.set_tracer_provider(TracerProvider(resource=resource))
otlp_exporter = OTLPSpanExporter(endpoint="http://otel-collector:4317", insecure=True)
trace.get_tracer_provider().add_span_processor(BatchSpanProcessor(otlp_exporter))

FlaskInstrumentor().instrument()

tracer = trace.get_tracer(__name__)

def process_order(order_id):
    with tracer.start_as_current_span("process_order") as span:
        span.set_attribute("order.id", order_id)

        with tracer.start_as_current_span("validate_order"):
            validate(order_id)

        with tracer.start_as_current_span("check_inventory") as inv_span:
            inventory = check_inventory(order_id)
            inv_span.set_attribute("inventory.available", inventory > 0)
            if inventory == 0:
                span.add_event("inventory_unavailable", {"order.id": order_id})
                raise InventoryError("Out of stock")

        with tracer.start_as_current_span("process_payment") as pay_span:
            payment_result = process_payment(order_id)
            pay_span.set_attribute("payment.status", payment_result["status"])
            if payment_result["status"] == "failed":
                span.record_exception(PaymentError("Payment failed"))
                raise PaymentError("Payment declined")

        tracking = ship_order(order_id)
        return {"status": "success", "tracking": tracking}
```

## Structured Logging

```python
import logging
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName
        }

        if hasattr(record, 'trace_id'):
            log_entry['trace_id'] = record.trace_id
            log_entry['span_id'] = record.span_id

        if record.exc_info:
            log_entry['exception'] = {
                'type': record.exc_info[0].__name__,
                'message': str(record.exc_info[1])
            }

        if hasattr(record, 'extra_fields'):
            log_entry.update(record.extra_fields)

        return json.dumps(log_entry)

logger = logging.getLogger('api')
handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logger.addHandler(handler)

logger.info("User logged in", extra={'extra_fields': {'user_id': 12345, 'login_method': 'oauth'}})
```

## Log Aggregation - ELK Stack

```yaml
# filebeat.yml
filebeat.inputs:
  - type: container
    paths: [/var/lib/docker/containers/*/*.log]
    processors:
      - add_kubernetes_metadata:
          host: ${NODE_NAME}
      - decode_json_fields:
          fields: ["message"]
          target: "json"

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  indices:
    - index: "logs-api-%{+yyyy.MM.dd}"
      when.equals:
        kubernetes.labels.app: "api"

setup.kibana:
  host: "kibana:5601"
```

```json
// Elasticsearch error analysis
{
  "query": {
    "bool": {
      "must": [
        {"match": {"level": "ERROR"}},
        {"range": {"timestamp": {"gte": "now-1h"}}}
      ]
    }
  },
  "aggs": {
    "errors_by_type": {
      "terms": {"field": "exception.type.keyword", "size": 10}
    }
  }
}
```

## APM - Application Performance Monitoring

```python
# Datadog APM
from ddtrace import tracer, patch_all

patch_all()

@tracer.wrap(service="api", resource="calculate_recommendation")
def calculate_recommendation(user_id):
    tracer.current_span().set_tag("user.id", user_id)

    with tracer.trace("fetch_user_data") as span:
        user_data = db.query(f"SELECT * FROM users WHERE id = {user_id}")
        span.set_metric("rows_fetched", len(user_data))

    with tracer.trace("ml_inference") as span:
        recommendations = model.predict(user_data)
        span.set_metric("recommendations_count", len(recommendations))

    return recommendations
```

## Alertmanager Configuration

```yaml
# alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/XXX'

route:
  group_by: ['alertname', 'cluster', 'service']
  group_wait: 10s
  repeat_interval: 12h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: pagerduty
      continue: true
    - match:
        severity: critical
      receiver: slack-critical
    - match:
        severity: warning
      receiver: slack-warnings

receivers:
  - name: 'pagerduty'
    pagerduty_configs:
      - service_key: 'YOUR_PAGERDUTY_KEY'
        description: '{{ .GroupLabels.alertname }}'

  - name: 'slack-critical'
    slack_configs:
      - channel: '#incidents'
        color: 'danger'
        title: 'CRITICAL: {{ .GroupLabels.alertname }}'
        text: '{{ .CommonAnnotations.summary }}'

  - name: 'slack-warnings'
    slack_configs:
      - channel: '#warnings'
        title: 'WARNING: {{ .GroupLabels.alertname }}'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'cluster', 'service']
```
