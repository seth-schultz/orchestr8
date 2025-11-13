---
id: sre-incident-management
category: example
tags: [sre, incident, on-call, postmortem, war-room]
capabilities:
  - Complete incident commander implementation with Slack integration
  - Automated war room creation and status tracking
  - Postmortem template generation with timeline
  - Incident severity classification and escalation
useWhen:
  - Building incident management automation for production systems
  - Implementing incident commander workflows with Slack
  - Creating automated postmortem documentation
  - Setting up on-call response procedures
estimatedTokens: 2100
relatedResources:
  - orchestr8://agents/sre-specialist
  - orchestr8://skills/observability-structured-logging
---

# SRE Incident Management

Complete incident commander implementation with automated war room creation, status tracking, and postmortem generation.

## Overview

Production-ready incident management system that automates:
- War room creation in Slack
- Incident severity classification
- Status updates and timeline tracking
- Postmortem document generation
- On-call paging and escalation

## Incident Commander Implementation

```python
# incident_commander.py
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

## On-Call Runbook YAML

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

## Usage Notes

**Incident Severity Guidelines:**
- **SEV1 (Critical):** Customer-facing outage, data loss, security breach
- **SEV2 (High):** Partial degradation, performance issues affecting users
- **SEV3 (Medium):** Minor issues, workarounds available
- **SEV4 (Low):** Cosmetic issues, no user impact

**War Room Best Practices:**
- Assign incident commander within 5 minutes
- Update status every 15 minutes during active incidents
- Keep communication channels focused on resolution
- Document all actions in timeline
- Schedule postmortem within 48 hours

**Postmortem Guidelines:**
- Focus on systems and processes, not individuals
- Identify 3-5 specific action items with owners
- Include "what went well" to reinforce good practices
- Share lessons learned across teams
- Track action item completion
