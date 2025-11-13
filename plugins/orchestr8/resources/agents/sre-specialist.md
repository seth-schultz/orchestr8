---
id: sre-specialist
category: agent
tags: [specialized, expert, domain-specific]
capabilities:

useWhen:
  - Working with Sre technology stack requiring deep expertise in configuration, optimization, best practices, and production deployment patterns
  - Implementing Sre-specific features, integrations, or troubleshooting complex issues requiring specialized domain knowledge
estimatedTokens: 180
---



# SRE Specialist

Expert in site reliability engineering, SLOs/SLIs, error budgets, incident response, and production system reliability.

## SLOs and SLIs - Service Level Objectives

Define and track Service Level Objectives with error budgets and burn rate alerts.

**Complete Implementation:**
```
orchestr8://examples/infrastructure/sre-slo-configuration
```

**Key Concepts:**
- **SLI (Service Level Indicator)**: Quantitative measure of service level (e.g., availability, latency)
- **SLO (Service Level Objective)**: Target value or range for an SLI (e.g., 99.9% availability)
- **Error Budget**: Amount of unreliability permitted (e.g., 43.2 minutes/month for 99.9%)
- **Burn Rate**: Rate at which error budget is consumed (alerts when too fast)

## Incident Response & On-Call

Automated incident management with war room creation, timeline tracking, and postmortem generation.

**Complete Implementation:**
```
orchestr8://examples/infrastructure/sre-incident-management
```

**Key Components:**
- **Incident Commander**: Orchestrates response, creates Slack war rooms, tracks timeline
- **Severity Classification**: SEV1 (critical) through SEV4 (cosmetic) with appropriate escalation
- **Runbooks**: YAML-based step-by-step procedures for common incidents
- **Postmortems**: Automated template generation with timeline, action items, lessons learned

## Original Code (To Remove)

```python
# THIS SECTION WILL BE DELETED - incident_commander.py
from dataclasses import dataclass
from datetime import datetime
from enum import Enum
import slack_sdk

class Severity(Enum):
    SEV1 = "Critical - Customer impact"
    SEV2 = "High - Partial degradation"
    SEV3 = "Medium - Minor issues"
    SEV4 = "Low - Cosmetic"

@dataclass
class Incident:
    id: str
    title: str
    severity: Severity
    status: str
    started_at: datetime
    resolved_at: datetime = None
    commander: str = None
    responders: list = None
    timeline: list = None

class IncidentCommander:
    def __init__(self, slack_token, pagerduty_token):
        self.slack = slack_sdk.WebClient(token=slack_token)
        self.incidents = {}

    def create_incident(self, title, severity, detected_by):
        """Create new incident and assemble war room"""

        incident_id = f"INC-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}"

        incident = Incident(
            id=incident_id,
            title=title,
            severity=severity,
            status='investigating',
            started_at=datetime.utcnow(),
            timeline=[]
        )

        # Create Slack war room
        response = self.slack.conversations_create(
            name=f"incident-{incident_id.lower()}",
            is_private=False
        )
        channel_id = response['channel']['id']

        # Post initial message
        self.slack.chat_postMessage(
            channel=channel_id,
            text=f"""
🚨 *INCIDENT DECLARED* 🚨
*ID:* {incident_id}
*Severity:* {severity.value}
*Title:* {title}
*Detected by:* {detected_by}
*Status:* Investigating

*Incident Commander:* TBD - React with 🎖️ to volunteer
*Next Steps:*
1. Acknowledge incident
2. Assign incident commander
3. Assess impact
4. Begin mitigation
            """.strip()
        )

        # Page on-call if SEV1/SEV2
        if severity in [Severity.SEV1, Severity.SEV2]:
            self.page_oncall(incident)

        self.incidents[incident_id] = incident
        return incident

    def update_status(self, incident_id, status, message):
        """Update incident status with timeline"""

        incident = self.incidents[incident_id]
        incident.status = status

        # Add to timeline
        incident.timeline.append({
            'timestamp': datetime.utcnow(),
            'status': status,
            'message': message
        })

        # Post update to Slack
        self.slack.chat_postMessage(
            channel=f"incident-{incident_id.lower()}",
            text=f"*Status Update:* {status}\n{message}"
        )

    def resolve_incident(self, incident_id, resolution):
        """Resolve incident and trigger postmortem"""

        incident = self.incidents[incident_id]
        incident.status = 'resolved'
        incident.resolved_at = datetime.utcnow()

        duration = (incident.resolved_at - incident.started_at).total_seconds() / 60

        # Post resolution
        self.slack.chat_postMessage(
            channel=f"incident-{incident_id.lower()}",
            text=f"""
✅ *INCIDENT RESOLVED* ✅
*Duration:* {duration:.1f} minutes
*Resolution:* {resolution}

*Next Steps:*
1. Schedule postmortem within 48h
2. Update status page
3. Communicate to stakeholders
            """.strip()
        )

        # Create postmortem doc
        self.create_postmortem(incident)

    def create_postmortem(self, incident):
        """Generate postmortem template"""

        template = f"""
# Incident Postmortem: {incident.id}

## Incident Summary
- **Date:** {incident.started_at.strftime('%Y-%m-%d')}
- **Duration:** {(incident.resolved_at - incident.started_at).total_seconds() / 60:.1f} minutes
- **Severity:** {incident.severity.value}
- **Commander:** {incident.commander}

## Impact
- **User Impact:** [Describe customer impact]
- **Revenue Impact:** [Estimate if applicable]
- **Affected Services:** [List services]

## Timeline
{self._format_timeline(incident)}

## Root Cause
[What was the underlying cause?]

## Resolution
[How was it fixed?]

## Action Items
- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]

## What Went Well
- [Positive observation 1]
- [Positive observation 2]

## What Could Be Improved
- [Improvement area 1]
- [Improvement area 2]

## Lessons Learned
[Key takeaways]
        """.strip()

        # Post to incident channel
        self.slack.chat_postMessage(
            channel=f"incident-{incident.id.lower()}",
            text=f"📝 Postmortem template created: [Link to doc]"
        )

    def _format_timeline(self, incident):
        lines = []
        for event in incident.timeline:
            timestamp = event['timestamp'].strftime('%H:%M:%S')
            lines.append(f"- **{timestamp}** - {event['status']}: {event['message']}")
        return '\n'.join(lines)

# Usage
commander = IncidentCommander(slack_token='...', pagerduty_token='...')

# Declare incident
incident = commander.create_incident(
    title="API latency spike - 95th percentile > 5s",
    severity=Severity.SEV1,
    detected_by="Datadog alert"
)

# Update status
commander.update_status(
    incident.id,
    'investigating',
    'Database queries running slow. Checking connection pool'
)

commander.update_status(
    incident.id,
    'mitigating',
    'Increased connection pool size from 50 to 200'
)

# Resolve
commander.resolve_incident(
    incident.id,
    'Increased DB connection pool. Latency back to normal (<100ms p95)'
)
```

## On-Call Runbooks

```yaml
# runbooks/high-api-latency.yaml
name: High API Latency
triggers:
  - alert: APILatencyHigh
    expr: http_request_duration_seconds{quantile="0.95"} > 1
    for: 5m

severity: SEV2

steps:
  - name: Acknowledge
    description: Acknowledge the alert in PagerDuty
    commands:
      - pd incident acknowledge --id $INCIDENT_ID

  - name: Check Dashboard
    description: Open the API performance dashboard
    links:
      - https://grafana.company.com/d/api-performance

  - name: Identify Bottleneck
    description: Check which component is slow
    commands:
      - kubectl top pods -n production
      - kubectl logs -n production -l app=api --tail=100
    checks:
      - Is database slow? Check query performance
      - Is external API slow? Check third-party status
      - Is cache miss rate high? Check Redis

  - name: Quick Mitigation
    description: Immediate actions to reduce impact
    options:
      - action: Scale up pods
        command: kubectl scale deployment api --replicas=10
      - action: Enable circuit breaker
        command: kubectl set env deployment/api CIRCUIT_BREAKER=true
      - action: Increase rate limits
        command: kubectl set env deployment/api RATE_LIMIT=1000

  - name: Root Cause Analysis
    description: Investigate the underlying cause
    commands:
      - Check Datadog APM traces
      - Review recent deployments
      - Check database slow query log

  - name: Long-term Fix
    description: Prevent recurrence
    actions:
      - Create JIRA ticket for investigation
      - Schedule postmortem
      - Update alerts if needed

escalation:
  - after: 15m
    contact: senior-sre
  - after: 30m
    contact: engineering-manager
```

## Chaos Engineering, Capacity Planning & Toil Automation

Test system resilience, forecast resource needs, and quantify automation ROI.

**Complete Implementation:**
```
orchestr8://examples/infrastructure/sre-chaos-capacity
```

**Key Components:**
- **Chaos Experiments**: Pod termination, network latency injection, CPU stress testing
- **Capacity Planning**: Linear regression forecasting, peak pattern analysis, growth projections
- **Toil Tracking**: Calculate time spent on manual work, automation ROI, payback period analysis

Deliver highly reliable production systems with proactive incident management and continuous improvement.

## Progressive Loading Strategy

This agent uses progressive loading to minimize token usage:

**Core Content:** ~180 tokens (loaded by default)
- SLO/SLI concepts and error budget principles
- Incident response workflows and runbook structure
- Chaos engineering and capacity planning overview

**Implementation Examples:** Load on-demand via:
- `orchestr8://examples/infrastructure/sre-slo-configuration` (~250 tokens)
- `orchestr8://examples/infrastructure/sre-incident-management` (~300 tokens)
- `orchestr8://examples/infrastructure/sre-chaos-capacity` (~280 tokens)

**Typical Usage Pattern:**
1. Load this agent for SRE concepts, best practices, and decision-making
2. Load specific examples when implementing SLO monitoring, incident response, or chaos testing
3. Reference examples during code review and production deployment

**Token Efficiency:**
- Concepts only: ~180 tokens
- Concepts + 1 example: ~430-480 tokens
- Traditional (all embedded): ~1,010 tokens
- **Savings: 52-82%**

## Output Locations

This agent saves all documentation outputs to `.orchestr8/docs/` with consistent categorization.

**Output Directory**: `.orchestr8/docs/infrastructure/`

**Naming Convention**: `[type]-[name]-YYYY-MM-DD.md`

### Output Examples:
- **Report**: `.orchestr8/docs/infrastructure/[component]-YYYY-MM-DD.md`

All outputs are automatically saved with:
- Clear component/feature identifier
- Current date in YYYY-MM-DD format
- Appropriate category for easy discovery and organization
