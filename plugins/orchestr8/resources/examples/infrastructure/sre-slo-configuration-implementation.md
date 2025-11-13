---
id: sre-slo-configuration-implementation
category: example
tags: [sre, slo, sli, monitoring, error-budget, reliability]
capabilities:
  - Complete SLO/SLI configuration with error budget tracking
  - Burn rate alerting for proactive incident management
  - Error budget calculation and deployment gating
  - Multi-window SLO objectives (weekly, monthly)
useWhen:
  - Implementing service level objectives and indicators for production systems
  - Setting up error budget tracking and burn rate monitoring
  - Configuring multi-tier alerting based on error budget consumption
  - Building deployment gating based on error budget availability
  - Establishing SRE practices for reliability engineering teams
estimatedTokens: 1800
relatedResources:
  - orchestr8://agents/sre-specialist
  - orchestr8://skills/observability-sli-slo-monitoring
  - orchestr8://patterns/performance-caching
---

# SRE SLO Configuration Implementation

Complete implementation of Service Level Objectives with error budget tracking, burn rate alerting, and deployment gating.

## Overview

This example demonstrates production-ready SLO/SLI implementation with:
- YAML-based SLO definitions with multiple windows
- Python SLO calculator for error budget management
- Burn rate thresholds for proactive alerting
- Deployment gating based on error budget availability

## SLO Configuration (YAML)

```yaml
# slo.yaml - Service Level Objectives
apiVersion: sre.google.com/v1
kind: ServiceLevelObjective
metadata:
  name: api-availability
spec:
  service: customer-api
  sli:
    name: availability
    description: Percentage of successful requests
    query: |
      sum(rate(http_requests_total{status!~"5.."}[5m]))
      /
      sum(rate(http_requests_total[5m]))

  objectives:
    - displayName: "99.9% Availability (Monthly)"
      target: 0.999
      window: 30d

    - displayName: "99.95% Availability (Weekly)"
      target: 0.9995
      window: 7d

  errorBudget:
    policy: burn_rate
    alerting:
      - burn_rate: 14.4  # 72h to exhaust 30d budget
        duration: 1h
        severity: warning
      - burn_rate: 6     # 5h to exhaust 30d budget
        duration: 30m
        severity: critical
```

## SLO Calculator Implementation

```python
# SLO calculator
from datetime import datetime, timedelta
import pandas as pd

class SLOCalculator:
    def __init__(self, target_slo=0.999):
        self.target_slo = target_slo

    def calculate_error_budget(self, window_days=30):
        """Calculate error budget for time window"""
        total_minutes = window_days * 24 * 60
        allowed_downtime = total_minutes * (1 - self.target_slo)

        return {
            'total_minutes': total_minutes,
            'allowed_downtime_minutes': allowed_downtime,
            'allowed_downtime_hours': allowed_downtime / 60,
            'target_slo': self.target_slo
        }

    def check_error_budget_burn_rate(self, failures, requests, window='1h'):
        """Check if error budget is burning too fast"""
        error_rate = failures / requests if requests > 0 else 0
        current_slo = 1 - error_rate

        # Calculate burn rate
        budget_remaining = self.target_slo - (1 - current_slo)
        burn_rate = (1 - current_slo) / (1 - self.target_slo)

        return {
            'current_slo': current_slo,
            'error_rate': error_rate,
            'burn_rate': burn_rate,
            'alert': burn_rate > 14.4  # Critical threshold
        }

    def remaining_error_budget(self, actual_uptime, window_days=30):
        """Calculate remaining error budget"""
        budget = self.calculate_error_budget(window_days)
        used_downtime = window_days * 24 * 60 * (1 - actual_uptime)
        remaining = budget['allowed_downtime_minutes'] - used_downtime

        return {
            'used_minutes': used_downtime,
            'remaining_minutes': remaining,
            'budget_consumed_pct': (used_downtime / budget['allowed_downtime_minutes']) * 100,
            'can_deploy': remaining > budget['allowed_downtime_minutes'] * 0.2  # 20% buffer
        }

# Usage
slo = SLOCalculator(target_slo=0.999)

# Calculate monthly budget
budget = slo.calculate_error_budget(window_days=30)
print(f"Monthly error budget: {budget['allowed_downtime_hours']:.2f} hours")

# Check current burn rate
burn = slo.check_error_budget_burn_rate(failures=100, requests=100000)
if burn['alert']:
    print(f"ALERT: High burn rate {burn['burn_rate']:.2f}x")

# Check if we can deploy
remaining = slo.remaining_error_budget(actual_uptime=0.9992, window_days=30)
if remaining['can_deploy']:
    print("✓ Safe to deploy - sufficient error budget")
else:
    print("✗ STOP - error budget exhausted")
```

## Usage Notes

### SLO Target Selection
- **99.9% (three nines)**: 43.8 minutes downtime/month - Standard for internal services
- **99.95%**: 21.9 minutes downtime/month - Production customer-facing services
- **99.99% (four nines)**: 4.38 minutes downtime/month - Critical infrastructure
- **99.999% (five nines)**: 26.3 seconds downtime/month - Mission-critical systems

### Burn Rate Thresholds
- **14.4x burn rate**: Budget exhausted in 72 hours → Warning alert
- **6x burn rate**: Budget exhausted in 5 hours → Critical alert
- **2x burn rate**: Budget exhausted on schedule → Monitor closely

### Deployment Gating
- Maintain 20% error budget buffer before deployments
- Block deployments when budget < 20%
- Require manual override for emergency fixes

### Implementation Steps
1. Define SLI metrics based on user-facing behavior
2. Set SLO targets aligned with business requirements
3. Configure burn rate alerts in monitoring system
4. Implement error budget tracking dashboard
5. Integrate deployment gating into CI/CD pipeline
6. Schedule regular SLO reviews (monthly/quarterly)

### Common Pitfalls
- **Too many SLOs**: Focus on 2-3 critical user journeys per service
- **Too strict SLOs**: Leave room for maintenance and deployments
- **Ignoring burn rate**: Alert on budget consumption speed, not just remaining budget
- **No action on violations**: Define clear escalation paths and remediation procedures
