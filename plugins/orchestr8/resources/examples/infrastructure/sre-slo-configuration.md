---
id: sre-slo-configuration
category: example
tags: [sre, slo, sli, monitoring, error-budget, reliability]
capabilities:
  - Complete SLO/SLI configuration with YAML and Python calculator
  - Error budget tracking and burn rate alerting
  - Multi-window SLO targets (monthly, weekly)
  - Automated error budget calculation and deployment gating
useWhen:
  - Implementing Service Level Objectives for production systems
  - Setting up error budget policies and burn rate alerts
  - Building SLO calculators for deployment decisions
  - Establishing reliability targets with automated monitoring
estimatedTokens: 1800
relatedResources:
  - orchestr8://agents/sre-specialist
  - orchestr8://patterns/observability-sli-slo-monitoring
---

# SRE SLO Configuration

Complete implementation of Service Level Objectives with error budgets, burn rate alerts, and automated deployment gating.

## Overview

This example demonstrates a production-ready SLO configuration including:
- YAML-based SLO definitions with multiple time windows
- Python SLO calculator for error budget tracking
- Burn rate alerting for rapid error budget consumption
- Deployment gating based on remaining error budget

## SLO YAML Configuration

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

**Error Budget Calculation:**
- For 99.9% SLO over 30 days: 43.2 minutes of allowed downtime
- For 99.95% SLO over 7 days: 5.04 minutes of allowed downtime

**Burn Rate Alerting:**
- Burn rate of 14.4x means error budget will be exhausted in 72 hours (1/14.4 of 30 days)
- Burn rate of 6x means error budget will be exhausted in 5 hours (1/6 of 30 days)

**Deployment Gating:**
- Requires 20% error budget remaining before allowing deployments
- Prevents deployments when reliability is already compromised

**Integration Points:**
- SLO calculator can be called from CI/CD pipelines
- Burn rate alerts should trigger PagerDuty notifications
- Error budget tracking should update deployment dashboards
