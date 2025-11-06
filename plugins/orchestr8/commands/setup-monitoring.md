---
description: Deploy complete observability stack with metrics, logs, traces, dashboards, and alerting
argument-hint: [infrastructure-description]
model: sonnet
---

# Setup Monitoring Workflow

## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate this entire workflow to the observability-specialist agent using the Task tool.

**Delegation Instructions:**
```
Use Task tool with:
- subagent_type: "infrastructure-monitoring:observability-specialist"
- description: "Deploy complete observability stack from scratch to production"
- prompt: "Execute the setup-monitoring workflow for: [user's infrastructure description].

Implement the complete monitoring lifecycle:
1. Analyze system architecture and define SLOs (10-15%)
2. Deploy metrics infrastructure (Prometheus, Grafana) (25-30%)
3. Instrument applications with metrics, logs, traces (40-45%)
4. Deploy logging infrastructure (55-60%)
5. Deploy distributed tracing backend (70-75%)
6. Create comprehensive dashboards (80-85%)
7. Configure alerting and incident response (90-95%)
8. Optimize and ensure high availability (100%)

Follow all phases, enforce quality gates, track with TodoWrite, and meet all success criteria defined below."
```

**After delegation:**
- The observability-specialist will handle all phases autonomously
- Return to main context only when complete or if user input required
- Do NOT attempt to execute workflow steps in main context

---

## Monitoring Setup Instructions for Orchestrator

You are orchestrating the complete deployment of a production-grade observability stack.

## Database Intelligence Integration

**At workflow start, source the database helpers:**
```bash

# Create workflow record
workflow_id="setup-monitoring-$(date +%s)"

# Query similar past workflows for estimation
echo "=== Learning from past monitoring setups ==="
```

---

## Phase 1: Requirements & Architecture (0-15%)

**⚡ EXECUTE TASK TOOL:**
```
Use the architect and sre-specialist agents to:
1. Analyze system architecture and components
2. Define SLIs and SLOs for all services
3. Design comprehensive monitoring stack
4. Create deployment plan

subagent_type: "system-architecture:architect"
description: "Design observability architecture and define SLOs"
prompt: "Design comprehensive observability architecture for: $*

Tasks:
1. **Analyze System Architecture**
   - Identify all services and components
   - Map dependencies and data flows
   - Determine monitoring requirements per service
   - Identify critical paths and user journeys
   - Document service topology

2. **Define SLIs and SLOs**
   - Availability SLO (e.g., 99.9% uptime)
   - Latency SLO (e.g., p95 < 200ms, p99 < 500ms)
   - Error rate SLO (e.g., < 0.1% errors)
   - Throughput requirements
   - Calculate error budgets for 30-day windows
   - Define burn rate thresholds

3. **Design Monitoring Stack**
   Choose appropriate tools:
   - Metrics: Prometheus, Grafana, VictoriaMetrics
   - Logs: ELK Stack, Loki + Promtail, or Fluentd
   - Traces: Jaeger, Tempo, or Zipkin
   - APM: Datadog, New Relic, or self-hosted
   - Alerting: Alertmanager, PagerDuty, Slack

4. **Create Deployment Plan**
   - Infrastructure requirements (CPU, memory, storage)
   - Network requirements (ports, firewall rules)
   - HA and redundancy strategy
   - Backup and disaster recovery
   - Phased rollout plan

Expected outputs:
- observability-architecture.md with:
  - System architecture diagram
  - Service topology
  - Monitoring stack design
- slo-definitions.md with:
  - SLIs for all services
  - SLOs with error budgets
  - Burn rate calculations
- deployment-plan.md with:
  - Infrastructure requirements
  - Deployment phases
  - Rollback procedures
"
```

**Expected Outputs:**
- `observability-architecture.md` - Complete architecture design
- `slo-definitions.md` - SLI/SLO definitions
- `deployment-plan.md` - Deployment strategy

**Quality Gate: Architecture Validation**
```bash
# Validate architecture document exists
if [ ! -f "observability-architecture.md" ]; then
  echo "❌ Architecture document not created"
  exit 1
fi

# Validate SLO definitions exist
if [ ! -f "slo-definitions.md" ]; then
  echo "❌ SLO definitions not created"
  exit 1
fi

# Validate deployment plan exists
if [ ! -f "deployment-plan.md" ]; then
  echo "❌ Deployment plan not created"
  exit 1
fi

echo "✅ Architecture designed and SLOs defined"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store architecture knowledge
  "Observability architecture and SLO definitions" \
  "$(head -n 50 observability-architecture.md)"
```

---

**🚀 PARALLEL EXECUTION OPPORTUNITY (3x speedup):** After Phase 1, Phases 2, 4, and 5 (metrics infrastructure, logging infrastructure, distributed tracing backends) can deploy in parallel as they're independent components. Use a single message with 3 Task tool calls to deploy all three infrastructure stacks concurrently. Phase 3 (application instrumentation) runs after infrastructure is ready. Phase 6-8 run sequentially after all infrastructure and instrumentation complete.

---

## Phase 2: Metrics Infrastructure (15-30%)

**⚡ EXECUTE TASK TOOL:**
```
Use the observability-specialist and kubernetes-specialist agents to:
1. Deploy Prometheus server
2. Deploy and configure exporters
3. Deploy Grafana
4. Configure recording rules

subagent_type: "infrastructure-monitoring:observability-specialist"
description: "Deploy Prometheus and Grafana metrics infrastructure"
prompt: "Deploy metrics infrastructure based on deployment-plan.md

Tasks:
1. **Deploy Prometheus**
   - Create namespace: monitoring
   - Deploy Prometheus StatefulSet/Deployment
   - Configure persistent storage (100Gi+ recommended)
   - Set retention period (30d recommended)
   - Configure service discovery (Kubernetes, Consul, static)
   - Enable lifecycle management for reloading

2. **Deploy Exporters**
   - node-exporter: System metrics (CPU, memory, disk, network)
   - kube-state-metrics: Kubernetes object state
   - Custom application exporters (/metrics endpoints)
   - Database exporters:
     - postgres_exporter for PostgreSQL
     - redis_exporter for Redis

3. **Deploy Grafana**
   - Install Grafana Deployment
   - Configure persistent storage for dashboards
   - Add Prometheus as data source
   - Set up authentication (OAuth, LDAP, or basic)
   - Configure dashboard provisioning
   - Enable plugin installation

4. **Configure Recording Rules**
   - Create aggregation rules for efficiency
   - Pre-compute SLI metrics (availability, latency percentiles)
   - Optimize for dashboard query performance
   - Add burnrate calculations for SLO alerting

Example Kubernetes manifests:
- prometheus-deployment.yaml
- prometheus-config.yaml (ConfigMap)
- grafana-deployment.yaml
- node-exporter-daemonset.yaml
- kube-state-metrics-deployment.yaml

Expected outputs:
- kubernetes/ directory with all manifests
- prometheus.yml configuration
- recording-rules.yml
- All components deployed and healthy
- Metrics scraping successfully
"
```

**Expected Outputs:**
- `kubernetes/` directory with deployment manifests
- `prometheus.yml` - Prometheus configuration
- `recording-rules.yml` - Recording rules for SLIs
- All pods running and healthy

**Quality Gate: Metrics Infrastructure**
```bash
# Log quality gate

# Check if Prometheus is deployed
if ! kubectl get pods -n monitoring | grep -q prometheus; then
  echo "❌ Prometheus not deployed"
  exit 1
fi

# Check if Grafana is deployed
if ! kubectl get pods -n monitoring | grep -q grafana; then
  echo "❌ Grafana not deployed"
  exit 1
fi

# Check if exporters are running
if ! kubectl get pods -n monitoring | grep -q node-exporter; then
  echo "⚠️  Node exporter not deployed (optional)"
fi

# Verify Prometheus is scraping targets
TARGETS_UP=$(curl -s http://prometheus:9090/api/v1/targets | jq '.data.activeTargets | map(select(.health=="up")) | length')
if [ "$TARGETS_UP" -lt 1 ]; then
  echo "❌ No targets being scraped by Prometheus"
  exit 1
fi

# Log success

echo "✅ Metrics infrastructure deployed (${TARGETS_UP} targets)"
```

**Track Progress:**
```bash
TOKENS_USED=7000
```

---

## Phase 3: Application Instrumentation (30-45%)

**⚡ EXECUTE TASK TOOL:**
```
Use the observability-specialist and language-specific developers to:
1. Add Prometheus client libraries
2. Implement structured logging
3. Integrate OpenTelemetry for distributed tracing
4. Implement health check endpoints

subagent_type: "infrastructure-monitoring:observability-specialist"
description: "Instrument applications with metrics, logs, and traces"
prompt: "Instrument all applications for observability

Tasks:
1. **Metrics Instrumentation**
   Add Prometheus client libraries:
   - Python: prometheus_client
   - Node.js/TypeScript: prom-client
   - Go: prometheus/client_golang
   - Java: micrometer

   Instrument:
   - HTTP endpoints: latency histograms, status code counters
   - Business metrics: orders, signups, revenue counters
   - Database queries: query duration, connection pool
   - Cache operations: hit/miss ratios
   - Queue operations: message processing time

   Use standard metric naming:
   - Counters: _total suffix (e.g., http_requests_total)
   - Histograms: _seconds/_bytes suffix
   - Gauges: current state

2. **Structured Logging**
   - Implement JSON logging format
   - Include fields:
     - timestamp (ISO 8601)
     - level (DEBUG, INFO, WARN, ERROR)
     - message
     - trace_id, span_id (for correlation)
     - service, environment
     - user_id (if applicable)
   - Add correlation IDs to all logs
   - Include trace context in logs
   - Log structured errors with stack traces

3. **Distributed Tracing**
   - Integrate OpenTelemetry SDK
   - Auto-instrument frameworks:
     - Flask, FastAPI, Django (Python)
     - Express, NestJS (Node.js)
     - Spring Boot (Java)
     - Chi, Gin (Go)
   - Add custom spans for:
     - Business logic functions
     - External API calls
     - Database operations
     - Cache operations
   - Configure sampling (10% for high traffic)
   - Context propagation across services (W3C Trace Context)

4. **Health Check Endpoints**
   - Implement /health endpoint
   - Liveness probe: Is process alive?
   - Readiness probe: Can accept traffic?
   - Dependency checks:
     - Database connectivity
     - Cache connectivity
     - External API availability
   - Return 200 if healthy, 503 if unhealthy

Expected outputs:
- Updated application code with instrumentation
- Metrics exposed at /metrics endpoint
- Logs in JSON format
- Traces exported to OpenTelemetry Collector
- Health checks at /health
- instrumentation-guide.md documenting changes
"
```

**Expected Outputs:**
- Application code instrumented with metrics
- `/metrics` endpoints exposing Prometheus metrics
- Structured JSON logging implemented
- OpenTelemetry tracing configured
- `/health` endpoints implemented
- `instrumentation-guide.md` - Documentation

**Quality Gate: Application Instrumentation**
```bash
# Log quality gate

# Check if /metrics endpoints exist
SERVICES=$(kubectl get services -n production -o name | wc -l)
INSTRUMENTED=0

for service in $(kubectl get services -n production -o jsonpath='{.items[*].metadata.name}'); do
  if curl -s "http://${service}:8080/metrics" | grep -q "http_requests_total"; then
    ((INSTRUMENTED++))
  fi
done

if [ "$INSTRUMENTED" -eq 0 ]; then
  echo "❌ No services instrumented with metrics"
  exit 1
fi

# Check if health checks exist
HEALTH_CHECKS=0
for service in $(kubectl get services -n production -o jsonpath='{.items[*].metadata.name}'); do
  if curl -s "http://${service}:8080/health" | grep -q "status"; then
    ((HEALTH_CHECKS++))
  fi
done

# Log success
COVERAGE=$((INSTRUMENTED * 100 / SERVICES))

echo "✅ Applications instrumented (${INSTRUMENTED}/${SERVICES} services, ${COVERAGE}%)"
```

**Track Progress:**
```bash
TOKENS_USED=9000
```

---

## Phase 4: Logging Infrastructure (45-60%)

**⚡ EXECUTE TASK TOOL:**
```
Use the observability-specialist and kubernetes-specialist agents to:
1. Deploy log aggregation platform
2. Configure log collection from all services
3. Set up log parsing and indexing
4. Create log dashboards

subagent_type: "infrastructure-monitoring:observability-specialist"
description: "Deploy logging infrastructure and aggregation"
prompt: "Deploy comprehensive logging infrastructure

Tasks:
1. **Deploy Log Aggregation Platform**
   Choose and deploy one:

   Option A: Loki + Promtail (Recommended for Kubernetes)
   - Deploy Loki StatefulSet
   - Configure S3/GCS for long-term storage
   - Set retention policies (30d active, 90d archive)

   Option B: ELK Stack
   - Deploy Elasticsearch cluster
   - Deploy Logstash for parsing
   - Deploy Kibana for visualization

   Option C: Fluentd + Elasticsearch
   - Deploy Fluentd DaemonSet
   - Configure Elasticsearch
   - Deploy Kibana

2. **Configure Log Collection**
   - Deploy Promtail DaemonSet (if using Loki)
   - OR deploy Filebeat/Fluentd DaemonSet
   - Collect container logs from /var/log/containers
   - Parse JSON log format
   - Add metadata:
     - pod_name, namespace, node
     - labels (app, version, environment)
     - container_name
   - Filter and exclude noisy logs
   - Set up log retention (30d minimum)

3. **Log Parsing and Indexing**
   - Parse JSON structured logs
   - Extract fields:
     - timestamp, level, message
     - trace_id, span_id
     - user_id, request_id
   - Create indexes for fast searching
   - Configure log levels as labels
   - Set up full-text search

4. **Create Log Dashboards**
   - Log volume over time
   - Error rate by service
   - Top error messages
   - Logs by severity level
   - Trace ID correlation
   - Log search interface

Expected outputs:
- Logging platform deployed (Loki or ELK)
- Log collectors running on all nodes
- Logs flowing from all services
- Log dashboards in Grafana/Kibana
- logging-architecture.md documenting setup
"
```

**Expected Outputs:**
- Logging platform deployed (Loki/ELK/Fluentd)
- Log collectors running (Promtail/Filebeat/Fluentd)
- Logs searchable in central platform
- Log dashboards created
- `logging-architecture.md` - Documentation

**Quality Gate: Logging Infrastructure**
```bash
# Log quality gate

# Check if Loki or Elasticsearch is deployed
if ! kubectl get pods -n monitoring | grep -qE "loki|elasticsearch"; then
  echo "❌ Log aggregation platform not deployed"
  exit 1
fi

# Check if log collectors are running
if ! kubectl get pods -n monitoring | grep -qE "promtail|filebeat|fluentd"; then
  echo "❌ Log collectors not deployed"
  exit 1
fi

# Test log query (simplified)
echo "Testing log queries..."

# Log success

echo "✅ Logging infrastructure operational"
```

**Track Progress:**
```bash
TOKENS_USED=8000
```

---

## Phase 5: Distributed Tracing (60-75%)

**⚡ EXECUTE TASK TOOL:**
```
Use the observability-specialist agent to:
1. Deploy tracing backend
2. Configure OpenTelemetry Collector
3. Set up trace visualization
4. Create service dependency maps

subagent_type: "infrastructure-monitoring:observability-specialist"
description: "Deploy distributed tracing infrastructure"
prompt: "Deploy comprehensive distributed tracing

Tasks:
1. **Deploy Tracing Backend**
   Choose and deploy one:

   Option A: Tempo (Recommended for Grafana stack)
   - Deploy Tempo StatefulSet
   - Configure S3/GCS for trace storage
   - Set retention policy (7d traces, 30d indexes)

   Option B: Jaeger
   - Deploy Jaeger All-in-One or distributed
   - Configure Elasticsearch backend
   - Set up Jaeger UI

   Option C: Zipkin
   - Deploy Zipkin server
   - Configure storage backend

2. **Configure OpenTelemetry Collector**
   - Deploy OTel Collector as DaemonSet or Deployment
   - Configure receivers:
     - OTLP gRPC (port 4317)
     - OTLP HTTP (port 4318)
     - Jaeger receiver (if migrating)
   - Configure processors:
     - Batch processor (1s timeout, 1024 batch size)
     - Resource processor (add environment attributes)
     - Probabilistic sampler (10% for high traffic)
   - Configure exporters:
     - Export to Tempo/Jaeger/Zipkin
     - Export metrics to Prometheus
   - Set up tail sampling for errors

3. **Trace Visualization**
   - Configure Grafana Tempo data source
   - Or set up Jaeger UI
   - Enable trace search by:
     - Service name
     - Operation name
     - Duration
     - Status (error/success)
     - Tag values
   - Create service dependency graph
   - Set up trace-to-logs correlation

4. **Service Dependency Mapping**
   - Visualize service call graph
   - Identify critical paths
   - Measure inter-service latencies
   - Detect circular dependencies
   - Monitor service health scores

Expected outputs:
- Tracing backend deployed (Tempo/Jaeger/Zipkin)
- OpenTelemetry Collector running
- Traces visible in UI
- Service dependency map available
- Trace-to-logs correlation working
- tracing-guide.md documenting setup
"
```

**Expected Outputs:**
- Tracing backend deployed (Tempo/Jaeger/Zipkin)
- OpenTelemetry Collector configured
- Traces searchable and visualizable
- Service dependency maps generated
- `tracing-guide.md` - Documentation

**Quality Gate: Distributed Tracing**
```bash
# Log quality gate

# Check if tracing backend is deployed
if ! kubectl get pods -n monitoring | grep -qE "tempo|jaeger|zipkin"; then
  echo "❌ Tracing backend not deployed"
  exit 1
fi

# Check if OTel Collector is deployed
if ! kubectl get pods -n monitoring | grep -q "otel-collector"; then
  echo "❌ OpenTelemetry Collector not deployed"
  exit 1
fi

# Test trace ingestion (simplified)
echo "Verifying traces are being received..."

# Log success

echo "✅ Distributed tracing operational"
```

**Track Progress:**
```bash
TOKENS_USED=7000
```

---

## Phase 6: Dashboards & Visualization (75-85%)

**⚡ EXECUTE TASK TOOL:**
```
Use the observability-specialist agent to:
1. Create infrastructure dashboards
2. Create application dashboards
3. Create SLO dashboards
4. Create database dashboards

subagent_type: "infrastructure-monitoring:observability-specialist"
description: "Create comprehensive monitoring dashboards"
prompt: "Create production-grade monitoring dashboards

Tasks:
1. **Infrastructure Dashboards**
   Create Grafana dashboards for:

   Cluster Overview:
   - Total nodes, pods, containers
   - Cluster CPU, memory, disk utilization
   - Network I/O
   - Pod status (running, pending, failed)

   Node Health:
   - Per-node CPU, memory, disk usage
   - Node status and conditions
   - System load averages
   - Disk I/O and network throughput

   Kubernetes Resources:
   - Pod CPU/memory usage
   - Pod restarts over time
   - PersistentVolume usage
   - ConfigMap and Secret counts

2. **Application Dashboards**
   Create dashboards for each service:

   RED Metrics (Request, Error, Duration):
   - Request rate (req/s) by endpoint
   - Error rate (%) by endpoint
   - Latency percentiles (p50, p95, p99)

   Dependency Health:
   - Database connection pool usage
   - Cache hit/miss rates
   - External API response times
   - Queue depth and processing time

   Business Metrics:
   - Orders per minute
   - User signups
   - Revenue (if applicable)
   - Custom KPIs

3. **SLO Dashboards**
   Create SLO tracking dashboards:

   For each SLO:
   - Current SLI value (real-time)
   - SLO target line
   - Error budget remaining (%)
   - Error budget consumption rate
   - Burn rate alerts
   - 30-day SLO compliance trend

   Multi-window burn rate:
   - 1-hour burn rate
   - 6-hour burn rate
   - 3-day burn rate

   SLO Summary:
   - All services SLO status
   - Services at risk (< 10% error budget)
   - Historical SLO compliance

4. **Database Dashboards**
   Create database performance dashboards:

   PostgreSQL/MongoDB:
   - Query performance (slow queries)
   - Connection pool usage
   - Transaction rate
   - Cache hit ratios
   - Replication lag
   - Index usage
   - Lock contention

   Redis:
   - Hit/miss rates
   - Memory usage
   - Eviction rate
   - Connected clients

5. **Dashboard Organization**
   - Use folders to organize dashboards
   - Set up dashboard variables (namespace, service, environment)
   - Configure auto-refresh intervals
   - Set up dashboard links
   - Export dashboards as JSON to version control

Expected outputs:
- grafana-dashboards/ directory with JSON files
- infrastructure-dashboard.json
- application-dashboard.json (per service)
- slo-dashboard.json
- database-dashboard.json
- All dashboards imported to Grafana
- dashboards-guide.md documenting usage
"
```

**Expected Outputs:**
- `grafana-dashboards/` directory with dashboard JSON files
- Infrastructure dashboards created
- Application dashboards for all services
- SLO tracking dashboards
- Database performance dashboards
- `dashboards-guide.md` - Documentation

**Quality Gate: Dashboards**
```bash
# Log quality gate

# Check if dashboards directory exists
if [ ! -d "grafana-dashboards" ]; then
  echo "❌ Dashboards directory not created"
  exit 1
fi

# Count dashboard files
DASHBOARD_COUNT=$(find grafana-dashboards -name "*.json" | wc -l)
if [ "$DASHBOARD_COUNT" -lt 3 ]; then
  echo "❌ Insufficient dashboards created (found $DASHBOARD_COUNT, expected at least 3)"
  exit 1
fi

# Validate dashboard JSON syntax
for dashboard in grafana-dashboards/*.json; do
  if ! jq empty "$dashboard" 2>/dev/null; then
    echo "❌ Invalid JSON in $dashboard"
    exit 1
  fi
done

# Log success

echo "✅ Dashboards created (${DASHBOARD_COUNT} dashboards)"
```

**Track Progress:**
```bash
TOKENS_USED=8000
```

---

## Phase 7: Alerting & Incident Response (85-95%)

**⚡ EXECUTE TASK TOOL:**
```
Use the sre-specialist and observability-specialist agents to:
1. Configure Prometheus alert rules
2. Deploy and configure Alertmanager
3. Set up notification channels
4. Create runbooks for common alerts

subagent_type: "infrastructure-monitoring:sre-specialist"
description: "Configure comprehensive alerting and incident response"
prompt: "Set up production alerting and incident response

Tasks:
1. **Configure Alert Rules**
   Create Prometheus alert rules:

   SLO Burn Rate Alerts (Multi-window, multi-burn-rate):
   - Page: 1h burn > 14.4x AND 5m burn > 14.4x (2% error budget in 1h)
   - Ticket: 6h burn > 6x AND 30m burn > 6x (5% error budget in 6h)

   Error Rate Alerts:
   - Critical: Error rate > 5% for 5 minutes
   - Warning: Error rate > 1% for 15 minutes

   Latency Alerts:
   - Critical: p95 latency > 500ms for 5 minutes
   - Warning: p95 latency > 200ms for 15 minutes

   Resource Alerts:
   - Critical: Node CPU > 90% for 10 minutes
   - Critical: Node memory > 90% for 10 minutes
   - Warning: Disk usage > 80%
   - Critical: Disk usage > 90%

   Application Alerts:
   - Pod restart rate high
   - Pod CrashLoopBackOff
   - Deployment rollout stuck
   - PVC nearly full

   Infrastructure Alerts:
   - Node NotReady
   - Node disk pressure
   - Certificate expiring (< 30 days)
   - Backup failed

2. **Deploy Alertmanager**
   - Deploy Alertmanager StatefulSet (HA: 3 replicas)
   - Configure clustering for HA
   - Set up persistent storage for silence/alert state
   - Configure routing by severity and team
   - Set up grouping and deduplication:
     - Group by: alertname, cluster, service
     - Group wait: 10s
     - Group interval: 5m
     - Repeat interval: 12h
   - Configure inhibition rules:
     - Don't alert on warning if critical is firing
     - Don't alert on node issues if cluster is down

3. **Set Up Notification Channels**
   Configure integrations:

   Slack:
   - Critical alerts → #incidents channel
   - Warnings → #alerts channel
   - Include alert details, graphs, runbook links

   PagerDuty:
   - Critical alerts only
   - Set up escalation policies
   - Configure on-call schedules

   Email:
   - Warning and critical alerts
   - Daily digest of alert summary

   Webhooks:
   - Custom integrations (JIRA, ServiceNow)
   - Incident management systems

4. **Create Runbooks**
   For each alert, create runbook with:
   - Alert description and impact
   - Possible causes
   - Investigation steps (commands to run)
   - Resolution procedures
   - Escalation path
   - Post-incident actions

   Common runbooks:
   - High error rate investigation
   - High latency debugging
   - Pod crash loop troubleshooting
   - Node resource exhaustion
   - Database connection issues
   - Certificate renewal

5. **Test Alert Workflow**
   - Trigger test alerts
   - Verify notifications are received
   - Test silence functionality
   - Verify grouping and deduplication
   - Test escalation policies

Expected outputs:
- prometheus-alerts/ directory with alert rules
- alertmanager.yml configuration
- Alertmanager deployed and configured
- Notification channels integrated
- runbooks/ directory with markdown files
- alerts-guide.md documenting alerting strategy
"
```

**Expected Outputs:**
- `prometheus-alerts/` directory with alert rule files
- `alertmanager.yml` - Alertmanager configuration
- Alertmanager deployed and operational
- Notification channels configured (Slack, PagerDuty, email)
- `runbooks/` directory with incident runbooks
- `alerts-guide.md` - Documentation

**Quality Gate: Alerting**
```bash
# Log quality gate

# Check if alert rules exist
if [ ! -d "prometheus-alerts" ] || [ -z "$(ls -A prometheus-alerts)" ]; then
  echo "❌ Alert rules not created"
  exit 1
fi

# Count alert rules
ALERT_COUNT=$(grep -r "alert:" prometheus-alerts/ | wc -l)
if [ "$ALERT_COUNT" -lt 5 ]; then
  echo "❌ Insufficient alert rules (found $ALERT_COUNT, expected at least 5)"
  exit 1
fi

# Check if Alertmanager is deployed
if ! kubectl get pods -n monitoring | grep -q alertmanager; then
  echo "❌ Alertmanager not deployed"
  exit 1
fi

# Check if runbooks directory exists
if [ ! -d "runbooks" ] || [ -z "$(ls -A runbooks)" ]; then
  echo "⚠️  Runbooks not created (recommended)"
fi

# Log success

echo "✅ Alerting configured (${ALERT_COUNT} alert rules)"
```

**Track Progress:**
```bash
TOKENS_USED=9000
```

---

## Phase 8: Performance & Optimization (95-100%)

**⚡ EXECUTE TASK TOOL:**
```
Use the observability-specialist and infrastructure-engineer agents to:
1. Optimize Prometheus performance
2. Configure high availability
3. Set up long-term storage
4. Implement backup and disaster recovery

subagent_type: "infrastructure-monitoring:infrastructure-engineer"
description: "Optimize monitoring stack and ensure high availability"
prompt: "Optimize and harden monitoring infrastructure

Tasks:
1. **Optimize Prometheus**
   - Tune scrape intervals based on cardinality:
     - High-frequency metrics: 15s
     - Standard metrics: 30s
     - Low-frequency metrics: 60s
   - Implement recording rules for expensive queries:
     - Pre-aggregate multi-service queries
     - Pre-calculate percentiles for dashboards
     - Pre-compute SLI metrics
   - Configure query performance:
     - Set query timeout: 2m
     - Limit max samples: 50M
     - Enable query logging
   - Optimize storage:
     - Configure block retention: 15d
     - Set up compaction
     - Enable WAL compression
   - Monitor Prometheus itself:
     - Scrape duration
     - Rule evaluation time
     - Query duration
     - Ingestion rate

2. **Configure High Availability**
   Deploy HA monitoring stack:

   Prometheus HA:
   - Deploy 2+ Prometheus replicas (active-active)
   - Use Thanos or Cortex for global view
   - Configure remote write to long-term storage

   Grafana HA:
   - Deploy 2+ Grafana replicas
   - Use external database (PostgreSQL)
   - Share dashboards via database
   - Use load balancer

   Alertmanager HA:
   - Deploy 3 Alertmanager replicas (clustering)
   - Configure gossip protocol
   - Set up persistent storage

   Loki HA (if using):
   - Deploy distributed Loki (read/write paths)
   - Use object storage (S3/GCS)
   - Configure consistent hashing

3. **Set Up Long-Term Storage**
   Configure retention tiers:

   Prometheus:
   - Local TSDB: 15 days (high resolution)
   - Remote write to long-term storage

   Option A: Thanos:
   - Deploy Thanos Sidecar with Prometheus
   - Deploy Thanos Store Gateway
   - Deploy Thanos Compactor
   - Configure S3/GCS object storage
   - Retention: 90 days or longer

   Option B: Cortex:
   - Deploy Cortex distributed components
   - Configure S3/GCS backend

   Option C: VictoriaMetrics:
   - Deploy VM single or cluster
   - Configure remote write from Prometheus

   Logs:
   - Active logs: 30 days in Loki/Elasticsearch
   - Archive logs: 90 days in S3/GCS

   Traces:
   - Active traces: 7 days in Tempo/Jaeger
   - Archive: Optional, 30 days in object storage

4. **Backup and Disaster Recovery**
   - Backup Prometheus data:
     - Snapshot TSDB regularly (daily)
     - Store snapshots in S3/GCS
   - Backup Grafana:
     - Export dashboards to Git
     - Backup Grafana database
   - Backup Alertmanager:
     - Export alert rules to Git
     - Backup silences and configurations
   - Test restore procedures:
     - Document restore steps
     - Run restore drills quarterly
   - Monitor backup jobs:
     - Alert on backup failures
     - Track backup size and duration

5. **Monitoring Stack Monitoring**
   Create meta-monitoring:
   - Monitor Prometheus health
   - Monitor Grafana availability
   - Monitor Loki ingestion rate
   - Monitor OTel Collector throughput
   - Track monitoring costs (storage, compute)

Expected outputs:
- ha-config/ directory with HA configurations
- thanos-deployment.yaml (if using Thanos)
- backup-scripts/ directory with backup automation
- restore-guide.md with disaster recovery procedures
- All monitoring components optimized and HA
- optimization-report.md documenting changes
"
```

**Expected Outputs:**
- `ha-config/` directory with HA configurations
- Long-term storage configured (Thanos/Cortex/VM)
- Backup automation scripts in `backup-scripts/`
- `restore-guide.md` - Disaster recovery procedures
- `optimization-report.md` - Performance improvements

**Quality Gate: Optimization & HA**
```bash
# Log quality gate

# Check if HA configurations exist
if [ ! -d "ha-config" ]; then
  echo "⚠️  HA configurations not created (recommended for production)"
fi

# Check if backup scripts exist
if [ ! -d "backup-scripts" ]; then
  echo "⚠️  Backup scripts not created (recommended)"
fi

# Check Prometheus replica count
PROM_REPLICAS=$(kubectl get statefulset -n monitoring prometheus -o jsonpath='{.spec.replicas}' 2>/dev/null || echo "1")
if [ "$PROM_REPLICAS" -lt 2 ]; then
  echo "⚠️  Prometheus not running in HA mode (replicas: $PROM_REPLICAS)"
fi

# Check if long-term storage is configured
if ! kubectl get pods -n monitoring | grep -qE "thanos|cortex|victoria"; then
  echo "⚠️  Long-term storage not configured (recommended for production)"
fi

# Log success

echo "✅ Monitoring stack optimized and hardened"
```

**Track Progress:**
```bash
TOKENS_USED=7000
```

---

## Workflow Completion & Learning

**At workflow end:**
```bash
# Calculate token usage across all agents
TOTAL_TOKENS=$(sum_agent_token_usage)

# Update workflow status

# Store lessons learned
  "Key learnings from monitoring setup: [summarize what worked well, challenges faced, optimization opportunities]" \
  "# Monitoring stack configuration patterns"

# Get final metrics
echo "=== Workflow Metrics ==="

# Send completion notification
DURATION=$(calculate_workflow_duration)
  "Monitoring Stack Deployed Successfully" \
  "Complete observability stack deployed in ${DURATION} minutes. All quality gates passed. Token usage: ${TOTAL_TOKENS}."

# Display token savings
echo "=== Token Usage Report ==="

echo "
✅ SETUP MONITORING WORKFLOW COMPLETE

Observability Stack Deployed:

**Metrics:**
✅ Prometheus deployed and scraping
✅ Grafana deployed with dashboards
✅ Recording rules configured
✅ ${INSTRUMENTED}/${SERVICES} services instrumented

**Logs:**
✅ Log aggregation platform operational
✅ Logs flowing from all services
✅ Log dashboards created

**Traces:**
✅ Distributed tracing backend deployed
✅ OpenTelemetry Collector configured
✅ Service dependency maps available

**Alerting:**
✅ ${ALERT_COUNT} alert rules configured
✅ Alertmanager deployed with HA
✅ Notification channels integrated (Slack, PagerDuty)
✅ Runbooks created

**Dashboards Created:**
✅ Infrastructure dashboards
✅ Application dashboards (RED metrics)
✅ SLO tracking dashboards
✅ Database performance dashboards
✅ Total: ${DASHBOARD_COUNT} dashboards

**High Availability:**
✅ Prometheus replicas: ${PROM_REPLICAS}
✅ Long-term storage configured
✅ Backup automation in place

**Quality Gates Passed:**
✅ Metrics Infrastructure
✅ Application Instrumentation (${COVERAGE}% coverage)
✅ Logging Infrastructure
✅ Distributed Tracing
✅ Dashboards (${DASHBOARD_COUNT} created)
✅ Alerting (${ALERT_COUNT} rules)
✅ Optimization & HA

**Next Steps:**
1. Review dashboards in Grafana
2. Test alert notifications
3. Verify SLO tracking
4. Train team on observability tools
5. Set up on-call rotation in PagerDuty
6. Schedule monitoring review cadence

**Documentation Generated:**
- observability-architecture.md
- slo-definitions.md
- deployment-plan.md
- instrumentation-guide.md
- logging-architecture.md
- tracing-guide.md
- dashboards-guide.md
- alerts-guide.md
- restore-guide.md
- optimization-report.md

**Access URLs:**
- Grafana: http://grafana.monitoring:3000
- Prometheus: http://prometheus.monitoring:9090
- Alertmanager: http://alertmanager.monitoring:9093
- Jaeger/Tempo UI: (see tracing-guide.md)
"
```

---

## Success Criteria

Monitoring setup is complete when:

- ✅ All monitoring components deployed and healthy
- ✅ Metrics: All services instrumented, metrics flowing to Prometheus
- ✅ Logs: Structured logs from all services, searchable in central platform
- ✅ Traces: Distributed tracing working across all services
- ✅ Dashboards: Comprehensive dashboards for infrastructure, applications, and SLOs
- ✅ Alerts: Critical alerts configured, tested, and linked to runbooks
- ✅ SLOs: SLIs tracked, error budgets calculated, burn rate alerts configured
- ✅ HA: Redundancy for critical components (Prometheus, Grafana, Alertmanager)
- ✅ Performance: Stack handles current scale with 50%+ headroom
- ✅ Backup: Backup procedures documented and tested
- ✅ Documentation: Complete documentation for operations and troubleshooting

---

## Example Invocation

```bash
# User request
"Set up complete observability for our Kubernetes cluster running 20 microservices.
We need metrics, logs, traces, and SLO monitoring with PagerDuty integration.
Services are Python FastAPI backends and React frontends."

# Workflow executes:
# 1. Analyzes architecture (20 microservices, Kubernetes, Python + React)
# 2. Designs stack (Prometheus, Grafana, Loki, Tempo, Alertmanager)
# 3. Deploys metrics infrastructure (Prometheus, Grafana, exporters)
# 4. Instruments Python and React applications
# 5. Sets up logging (Loki + Promtail)
# 6. Configures tracing (Tempo + OpenTelemetry)
# 7. Creates comprehensive dashboards
# 8. Configures alerts with PagerDuty integration
# 9. Optimizes stack and configures HA
```

---

## Anti-Patterns to Avoid

❌ Don't skip SLO definition before implementation
❌ Don't over-instrument (causes cardinality explosion)
❌ Don't ignore high availability for production
❌ Don't forget to link alerts to runbooks
❌ Don't skip testing alert notifications
❌ Don't ignore monitoring stack monitoring (meta-monitoring)
❌ Don't forget backup and disaster recovery
❌ Don't skip documentation
❌ Don't set up alerts without clear action items
❌ Don't ignore long-term storage costs

---

## Notes

- Observability specialist coordinates all phases autonomously
- All quality gates must pass - no exceptions
- HA configured for production readiness
- SLO-based alerting prevents alert fatigue
- Database tracks all phases for continuous improvement
- Each agent receives clear instructions with expected outputs
- Token usage tracked at each phase for optimization
- Comprehensive documentation ensures operational success
