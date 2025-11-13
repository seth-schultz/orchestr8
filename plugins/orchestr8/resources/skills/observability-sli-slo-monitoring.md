---
id: observability-sli-slo-monitoring
category: skill
tags: [observability, sli, slo, sla, error-budget, sre, reliability, monitoring]
capabilities:
  - Service Level Indicators (SLIs) definition and measurement
  - Service Level Objectives (SLOs) setting and tracking
  - Error budget calculation and burn rate alerting
  - Grafana dashboard creation for SLI/SLO visualization
useWhen:
  - Implementing SRE practices defining Service Level Indicators for API availability, latency, and error rates
  - Creating SLO dashboards tracking error budget consumption with burn rate alerts for threshold violations
  - Designing reliability metrics framework measuring 99.9% availability target with automated alerting on budget depletion
  - Building SLI/SLO monitoring for distributed system tracking request success rate and p99 latency across microservices
  - Establishing error budget policies triggering feature freeze when reliability targets are breached
estimatedTokens: 750
---

# SLI/SLO/SLA Monitoring

Define and monitor Service Level Indicators (SLIs), Objectives (SLOs), and Agreements (SLAs) for reliable service delivery.

## Service Level Indicators (SLIs)

```yaml
SLIs:
  availability:
    metric: "uptime_percentage"
    query: "sum(up{job='api'}) / count(up{job='api'})"

  latency:
    metric: "p95_response_time"
    query: "histogram_quantile(0.95, rate(http_duration_bucket[5m]))"

  error_rate:
    metric: "error_percentage"
    query: "rate(http_errors[5m]) / rate(http_requests[5m])"
```

## Service Level Objectives (SLOs)

```yaml
SLOs:
  availability: "99.9%"  # 43.8 minutes downtime/month
  latency_p95: "< 200ms"
  error_rate: "< 0.1%"
```

## Error Budget

```python
# Calculate error budget
def calculate_error_budget(slo_target, time_period_seconds):
    """
    SLO target: 99.9% (0.999)
    Time period: 30 days = 2,592,000 seconds
    """
    allowed_downtime = time_period_seconds * (1 - slo_target)
    # 2,592,000 * (1 - 0.999) = 2,592 seconds = 43.2 minutes
    return allowed_downtime

# Burn rate alert
if current_error_rate > (1 - slo_target) * 10:
    alert("Burning error budget 10x faster than allowed!")
```

## Grafana Dashboard

```json
{
  "dashboard": {
    "title": "API Performance",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [{
          "expr": "rate(http_requests_total[5m])"
        }]
      },
      {
        "title": "Error Rate",
        "targets": [{
          "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m])"
        }]
      },
      {
        "title": "Latency (P50, P95, P99)",
        "targets": [
          {
            "expr": "histogram_quantile(0.50, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "P50"
          },
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "P95"
          },
          {
            "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "P99"
          }
        ]
      }
    ]
  }
}
```

## Incident Response Workflow

```markdown
1. **Alert fired** → PagerDuty/Opsgenie
2. **Acknowledge** within 5 minutes
3. **Triage** using dashboards and logs
4. **Mitigate** incident
5. **Communicate** to stakeholders
6. **Post-mortem** (blameless)
```

## Best Practices

✅ **User-centric SLIs** - Measure what users experience
✅ **Realistic SLOs** - Set achievable targets (99.9% not 100%)
✅ **Error budget** - Use budget to balance reliability and velocity
✅ **Multi-window alerts** - Fast burn (1h) and slow burn (24h)
✅ **Blameless post-mortems** - Focus on systems, not people
✅ **Regular reviews** - Adjust SLOs quarterly based on reality

## Related Observability Skills

**Three Pillars of Observability:**
- orchestr8://skills/observability-structured-logging - Logs for incident investigation
- orchestr8://skills/observability-metrics-prometheus - Metrics foundation for SLI/SLO
- orchestr8://skills/observability-distributed-tracing - Traces for debugging SLO violations

**SRE & Reliability:**
- orchestr8://skills/observability-sli-slo-monitoring - SLI/SLO practices (this skill)
- orchestr8://guides/prometheus-monitoring-setup - Monitoring infrastructure setup

**Infrastructure:**
- orchestr8://patterns/architecture-microservices - Distributed system design
- orchestr8://skills/error-handling-resilience - Building reliable systems
