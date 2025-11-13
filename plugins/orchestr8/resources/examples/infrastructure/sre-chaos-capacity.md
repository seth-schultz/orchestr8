---
id: sre-chaos-capacity
category: example
tags: [sre, chaos-engineering, capacity-planning, toil, automation]
capabilities:
  - Chaos engineering experiments for resilience testing
  - Capacity planning with forecast modeling
  - Toil tracking and automation ROI calculation
  - Load forecasting and peak pattern analysis
useWhen:
  - Implementing chaos engineering to test system resilience
  - Planning capacity upgrades based on growth trends
  - Calculating automation ROI for manual operations
  - Analyzing usage patterns for auto-scaling strategies
estimatedTokens: 1900
relatedResources:
  - orchestr8://agents/sre-specialist
  - orchestr8://skills/performance-optimization
---

# SRE Chaos Engineering & Capacity Planning

Complete implementations for chaos experiments, capacity forecasting, and toil automation.

## Chaos Engineering Implementation

```python
# chaos_experiments.py
from chaoslib.exceptions import ActivityFailed
from chaoslib.types import Configuration, Secrets
import random

def terminate_random_pod(namespace='production', label='app=api'):
    """Terminate random pod to test resilience"""
    import subprocess

    # Get pods
    result = subprocess.run(
        ['kubectl', 'get', 'pods', '-n', namespace, '-l', label, '-o', 'name'],
        capture_output=True,
        text=True
    )

    pods = result.stdout.strip().split('\n')

    if not pods:
        raise ActivityFailed(f"No pods found with label {label}")

    # Select random pod
    target_pod = random.choice(pods)

    print(f"Terminating pod: {target_pod}")

    # Terminate
    subprocess.run(
        ['kubectl', 'delete', '-n', namespace, target_pod],
        check=True
    )

def introduce_network_latency(service, latency_ms=500, duration_seconds=60):
    """Introduce network latency to test resilience"""
    import subprocess

    # Use tc (traffic control) to add latency
    cmd = f"""
    kubectl exec -n production deploy/{service} -- \
      tc qdisc add dev eth0 root netem delay {latency_ms}ms
    """

    subprocess.run(cmd, shell=True, check=True)
    print(f"Added {latency_ms}ms latency to {service}")

    # Wait
    import time
    time.sleep(duration_seconds)

    # Remove latency
    cleanup = f"""
    kubectl exec -n production deploy/{service} -- \
      tc qdisc del dev eth0 root netem
    """
    subprocess.run(cleanup, shell=True, check=True)
    print(f"Removed latency from {service}")

def chaos_experiment_cpu_stress(deployment, cpu_cores=2, duration_seconds=60):
    """Stress test CPU to validate auto-scaling"""
    import subprocess

    cmd = f"""
    kubectl run cpu-stress-{deployment} \
      --image=containerstack/cpustress \
      --restart=Never \
      --limits=cpu={cpu_cores} \
      -- --cpu={cpu_cores} --timeout={duration_seconds}s
    """

    subprocess.run(cmd, shell=True, check=True)
    print(f"Started CPU stress test for {duration_seconds}s")

# Chaos experiment configuration
chaos_experiment = {
    'name': 'API Pod Failure',
    'description': 'Validate that API can handle pod failures',
    'steady_state_hypothesis': {
        'title': 'API is healthy and responsive',
        'probes': [
            {
                'type': 'probe',
                'name': 'api-health-check',
                'tolerance': 200,
                'provider': {
                    'type': 'http',
                    'url': 'https://api.company.com/health'
                }
            },
            {
                'type': 'probe',
                'name': 'error-rate-low',
                'tolerance': 0.01,  # <1% errors
                'provider': {
                    'type': 'python',
                    'func': 'get_error_rate'
                }
            }
        ]
    },
    'method': [
        {
            'type': 'action',
            'name': 'terminate-random-pod',
            'provider': {
                'type': 'python',
                'func': 'terminate_random_pod',
                'arguments': {
                    'namespace': 'production',
                    'label': 'app=api'
                }
            }
        }
    ],
    'rollbacks': [
        {
            'type': 'action',
            'name': 'ensure-replicas',
            'provider': {
                'type': 'python',
                'func': 'scale_deployment',
                'arguments': {
                    'deployment': 'api',
                    'replicas': 3
                }
            }
        }
    ]
}
```

## Capacity Planning

```python
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

class CapacityPlanner:
    def __init__(self, metrics_data):
        self.data = metrics_data

    def forecast_resource_needs(self, resource_type='cpu', days_ahead=90):
        """Forecast resource needs based on historical trends"""

        # Prepare data
        df = self.data[['timestamp', resource_type]].copy()
        df['days'] = (df['timestamp'] - df['timestamp'].min()).dt.days

        X = df[['days']].values
        y = df[resource_type].values

        # Train model
        model = LinearRegression()
        model.fit(X, y)

        # Forecast
        future_days = np.arange(X[-1][0], X[-1][0] + days_ahead).reshape(-1, 1)
        forecast = model.predict(future_days)

        # Calculate when capacity will be exceeded
        current_capacity = 1000  # Current CPU cores
        days_until_capacity = np.where(forecast > current_capacity)[0]

        if len(days_until_capacity) > 0:
            days_left = days_until_capacity[0]
            print(f"⚠️ Capacity will be exceeded in {days_left} days")
            print(f"Action needed: Add {forecast[days_left] - current_capacity:.0f} {resource_type} units")
        else:
            print(f"✓ Sufficient capacity for next {days_ahead} days")

        return {
            'forecast': forecast,
            'days_until_capacity': days_left if len(days_until_capacity) > 0 else None,
            'recommended_capacity': np.max(forecast) * 1.2  # 20% buffer
        }

    def analyze_peak_patterns(self, metric='requests_per_second'):
        """Analyze peak usage patterns for scaling strategy"""

        df = self.data.copy()
        df['hour'] = df['timestamp'].dt.hour
        df['day_of_week'] = df['timestamp'].dt.dayofweek

        # Peak by hour
        hourly_avg = df.groupby('hour')[metric].agg(['mean', 'max', 'std'])

        # Peak by day of week
        daily_avg = df.groupby('day_of_week')[metric].agg(['mean', 'max', 'std'])

        # Identify scaling schedule
        peak_hours = hourly_avg[hourly_avg['mean'] > hourly_avg['mean'].quantile(0.75)].index
        peak_days = daily_avg[daily_avg['mean'] > daily_avg['mean'].quantile(0.75)].index

        return {
            'peak_hours': peak_hours.tolist(),
            'peak_days': peak_days.tolist(),
            'hourly_pattern': hourly_avg,
            'daily_pattern': daily_avg
        }

# Usage
planner = CapacityPlanner(metrics_data=historical_metrics)

# Forecast
forecast = planner.forecast_resource_needs(resource_type='cpu', days_ahead=90)

# Analyze patterns
patterns = planner.analyze_peak_patterns(metric='requests_per_second')
print(f"Peak hours: {patterns['peak_hours']}")
print(f"Peak days: {patterns['peak_days']}")
```

## Toil Automation Tracking

```python
# toil_tracker.py
from dataclasses import dataclass
from typing import List
import json

@dataclass
class ToilTask:
    name: str
    frequency: str  # daily, weekly, monthly
    time_minutes: int
    automatable: bool
    priority: int  # 1-5

class ToilTracker:
    def __init__(self):
        self.tasks: List[ToilTask] = []

    def add_task(self, task: ToilTask):
        self.tasks.append(task)

    def calculate_toil_cost(self, period_days=30):
        """Calculate time spent on toil"""

        total_minutes = 0

        for task in self.tasks:
            if task.frequency == 'daily':
                occurrences = period_days
            elif task.frequency == 'weekly':
                occurrences = period_days // 7
            elif task.frequency == 'monthly':
                occurrences = period_days // 30
            else:
                occurrences = 0

            total_minutes += task.time_minutes * occurrences

        total_hours = total_minutes / 60
        toil_percentage = (total_hours / (period_days * 8)) * 100  # 8hr workday

        return {
            'total_hours': total_hours,
            'toil_percentage': toil_percentage,
            'exceeds_50_percent': toil_percentage > 50
        }

    def automation_roi(self, task_name, automation_time_hours):
        """Calculate ROI for automating a task"""

        task = next(t for t in self.tasks if t.name == task_name)

        # Annual time saved
        if task.frequency == 'daily':
            annual_occurrences = 365
        elif task.frequency == 'weekly':
            annual_occurrences = 52
        else:
            annual_occurrences = 12

        annual_hours_saved = (task.time_minutes / 60) * annual_occurrences

        # ROI
        payback_months = automation_time_hours / (annual_hours_saved / 12)

        return {
            'annual_hours_saved': annual_hours_saved,
            'automation_cost_hours': automation_time_hours,
            'payback_months': payback_months,
            'recommended': payback_months < 6  # Automate if <6 month payback
        }

# Track toil
tracker = ToilTracker()

tracker.add_task(ToilTask(
    name='Manual log analysis',
    frequency='daily',
    time_minutes=30,
    automatable=True,
    priority=5
))

tracker.add_task(ToilTask(
    name='Certificate renewal',
    frequency='monthly',
    time_minutes=120,
    automatable=True,
    priority=4
))

# Calculate cost
cost = tracker.calculate_toil_cost(period_days=30)
print(f"Monthly toil: {cost['total_hours']:.1f} hours ({cost['toil_percentage']:.1f}%)")

# ROI analysis
roi = tracker.automation_roi('Manual log analysis', automation_time_hours=16)
print(f"Payback period: {roi['payback_months']:.1f} months")
if roi['recommended']:
    print("✓ AUTOMATE THIS TASK")
```

## Usage Notes

**Chaos Engineering:**
- Always run chaos experiments in non-production first
- Define steady-state hypothesis before experiments
- Monitor system behavior during experiments
- Have rollback procedures ready
- Document findings and improve resilience

**Capacity Planning:**
- Use linear regression for stable growth patterns
- Consider seasonal variations in forecasting
- Add 20% buffer to forecasted capacity needs
- Review forecasts monthly for accuracy
- Plan capacity additions 90 days in advance

**Toil Automation:**
- Track all recurring manual tasks
- Calculate ROI before automating
- Prioritize tasks with payback < 6 months
- Aim for < 50% toil in SRE workload
- Measure automation success quarterly
