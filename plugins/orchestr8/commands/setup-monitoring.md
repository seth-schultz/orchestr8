---
description: Deploy complete observability stack with metrics, logs, traces, dashboards,
  and alerting
argument-hint:
- infrastructure-description
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- WebFetch
- Write
---

# Setup Monitoring: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Observability Architect** responsible for deploying a production-grade observability stack including metrics, logs, traces, dashboards, and alerting.

## Phase 1: Requirements & Architecture (0-15%)

**→ Load:** orchestr8://match?query=observability+monitoring+architecture+slo&categories=pattern,guide&mode=index&maxResults=5

**Activities:**
- Analyze system architecture and components
- Define SLIs and SLOs for all services
- Design comprehensive monitoring stack
- Create deployment plan with HA strategy

**→ Checkpoint:** Architecture designed and SLOs defined

## Phase 2: Metrics Infrastructure (15-30%)

**→ Load:** orchestr8://match?query=prometheus+grafana+metrics&categories=guide,example&mode=index&maxResults=5

**Activities:**
- Deploy Prometheus server with persistent storage
- Deploy and configure exporters (node, kube-state, custom)
- Deploy Grafana with authentication
- Configure recording rules for SLI metrics

**→ Checkpoint:** Metrics infrastructure deployed and scraping

## Phase 3: Application Instrumentation (30-45%)

**→ Load:** orchestr8://match?query=application+instrumentation+metrics+logging&categories=guide,example&mode=index&maxResults=5

**Activities:**
- Add Prometheus client libraries to applications
- Implement structured JSON logging
- Integrate OpenTelemetry for distributed tracing
- Implement health check endpoints (/health, /metrics)

**→ Checkpoint:** Applications instrumented and exposing metrics

## Phase 4: Logging Infrastructure (45-60%)

**→ Load:** orchestr8://match?query=logging+loki+elasticsearch&categories=guide,example&mode=index&maxResults=5

**Activities:**
- Deploy log aggregation platform (Loki/ELK/Fluentd)
- Configure log collection from all services
- Set up log parsing and indexing
- Create log dashboards and search interfaces

**→ Checkpoint:** Logging infrastructure operational

## Phase 5: Distributed Tracing (60-75%)

**→ Load:** orchestr8://match?query=distributed+tracing+jaeger+tempo&categories=guide,example&mode=index&maxResults=5

**Activities:**
- Deploy tracing backend (Tempo/Jaeger/Zipkin)
- Configure OpenTelemetry Collector
- Set up trace visualization and search
- Create service dependency maps

**→ Checkpoint:** Distributed tracing operational

## Phase 6: Dashboards & Visualization (75-85%)

**→ Load:** orchestr8://match?query=grafana+dashboards+visualization&categories=guide,example&mode=index&maxResults=5

**Activities:**
- Create infrastructure dashboards (cluster, nodes, resources)
- Create application dashboards (RED metrics)
- Create SLO dashboards with error budgets
- Create database performance dashboards

**→ Checkpoint:** Comprehensive dashboards created

## Phase 7: Alerting & Incident Response (85-95%)

**→ Load:** orchestr8://match?query=alerting+prometheus+pagerduty&categories=guide,example&mode=index&maxResults=5

**Activities:**
- Configure Prometheus alert rules (SLO burn rate, errors, latency)
- Deploy and configure Alertmanager with HA
- Set up notification channels (Slack, PagerDuty, email)
- Create runbooks for common alerts

**→ Checkpoint:** Alerting configured and tested

## Phase 8: Performance & Optimization (95-100%)

**→ Load:** orchestr8://match?query=monitoring+optimization+high+availability&categories=guide&mode=index&maxResults=3

**Activities:**
- Optimize Prometheus performance (scrape intervals, recording rules)
- Configure high availability for all components
- Set up long-term storage (Thanos/Cortex/VictoriaMetrics)
- Implement backup and disaster recovery

**→ Checkpoint:** Monitoring stack optimized and production-ready

## Success Criteria

✅ All monitoring components deployed and healthy
✅ Metrics flowing from all services to Prometheus
✅ Structured logs searchable in central platform
✅ Distributed tracing working across services
✅ Comprehensive dashboards for infrastructure, applications, and SLOs
✅ Critical alerts configured with runbooks
✅ SLOs tracked with error budgets and burn rate alerts
✅ HA configured for critical components
✅ Backup procedures documented and tested
✅ Complete operational documentation
