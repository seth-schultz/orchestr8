---
id: runpod-monitoring-health
category: skill
tags: [runpod, monitoring, health, metrics, observability, debugging]
capabilities:
  - Monitor serverless endpoint health and worker status
  - Track job states and execution metrics
  - Implement logging and debugging strategies
useWhen:
  - Monitoring RunPod serverless endpoint health including worker states and job queue metrics
  - Tracking job execution states from IN_QUEUE through COMPLETED or FAILED status
  - Debugging serverless handlers with logging and error tracking for production issues
  - Monitoring pod GPU utilization, memory usage, and performance metrics
  - Implementing alerts for endpoint issues including high queue depth or worker failures
estimatedTokens: 500
---

# RunPod Monitoring and Health

## Serverless Health Monitoring

**Health Endpoint:**
```bash
GET https://api.runpod.ai/v2/{endpoint_id}/health

Response:
{
  "jobs": {
    "completed": 1245,
    "failed": 23,
    "inProgress": 3,
    "inQueue": 7,
    "retried": 5
  },
  "workers": {
    "idle": 2,
    "running": 3,
    "throttled": 0,
    "initializing": 1
  }
}
```

**Worker States:**
- `idle` - Available for work
- `initializing` - Starting up (cold start)
- `ready` - Initialized and available
- `running` - Processing job
- `throttled` - Rate limited
- `unhealthy` - Failed health checks

**Key Metrics:**
```python
health = client.health(endpoint_id)

# Alert if queue growing
if health['jobs']['inQueue'] > 50:
    alert("High queue depth")

# Alert if workers unhealthy
if 'unhealthy' in health['workers']:
    alert("Unhealthy workers detected")

# Alert if high failure rate
total = health['jobs']['completed'] + health['jobs']['failed']
failure_rate = health['jobs']['failed'] / total if total > 0 else 0
if failure_rate > 0.05:  # >5% failures
    alert(f"High failure rate: {failure_rate:.1%}")
```

## Job State Tracking

**Job States:**
```
IN_QUEUE → IN_PROGRESS → COMPLETED
                       → FAILED
                       → TIMED_OUT
                       → CANCELLED
```

**State Monitoring:**
```python
def monitor_job(endpoint_id: str, job_id: str,
                callback: callable = None):
    """Monitor job with state change notifications"""
    previous_state = None

    while True:
        result = client.status(endpoint_id, job_id)
        current_state = result.status

        # State changed
        if current_state != previous_state:
            if callback:
                callback(current_state, result)
            previous_state = current_state

        # Terminal states
        if current_state in ["COMPLETED", "FAILED", "CANCELLED", "TIMED_OUT"]:
            return result

        time.sleep(2)

# Usage
def on_state_change(state, result):
    logger.info(f"Job state: {state}")
    if state == "IN_PROGRESS":
        logger.info("Job started processing")
    elif state == "FAILED":
        logger.error(f"Job failed: {result.error}")

monitor_job(endpoint_id, job_id, callback=on_state_change)
```

## Pod Monitoring

**Pod Metrics:**
```graphql
query {
  pod(input: { podId: "abc123" }) {
    runtime {
      uptimeInSeconds
      gpuUtilPercent        # GPU usage
      memoryUtilPercent     # RAM usage
      ports {
        publicPort
        type
      }
    }
  }
}
```

**GPU Utilization Tracking:**
```python
def monitor_gpu_utilization(pod_id: str, interval: int = 60):
    """Monitor GPU usage over time"""
    while True:
        pod = client.get_pod_details(pod_id)
        gpu_util = pod['runtime']['gpuUtilPercent']
        mem_util = pod['runtime']['memoryUtilPercent']

        logger.info(f"GPU: {gpu_util}%, Memory: {mem_util}%")

        # Alert if underutilized
        if gpu_util < 10:
            alert(f"Low GPU utilization: {gpu_util}%")

        time.sleep(interval)
```

## Logging Strategies

**Handler Logging:**
```python
import logging
import sys

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

def handler(job):
    job_id = job['id']
    logger.info(f"Processing job {job_id}")

    try:
        # Your logic
        result = process(job['input'])
        logger.info(f"Job {job_id} completed successfully")
        return result

    except Exception as e:
        logger.error(f"Job {job_id} failed: {e}", exc_info=True)
        return {"error": str(e)}
```

**Log Aggregation:**
```python
# Send logs to external service
import requests

class CloudLogger:
    def __init__(self, endpoint: str):
        self.endpoint = endpoint

    def log(self, level: str, message: str, metadata: dict = None):
        payload = {
            "level": level,
            "message": message,
            "metadata": metadata or {},
            "timestamp": time.time()
        }
        requests.post(self.endpoint, json=payload)

cloud_logger = CloudLogger("https://logs.example.com/ingest")

def handler(job):
    cloud_logger.log("INFO", "Job started", {"job_id": job['id']})
    # Process job
    cloud_logger.log("INFO", "Job completed", {"job_id": job['id']})
```

## Error Tracking

**Categorize Errors:**
```python
class ErrorTracker:
    def __init__(self):
        self.errors = {
            'validation': 0,
            'timeout': 0,
            'oom': 0,  # Out of memory
            'unknown': 0
        }

    def track(self, error: Exception):
        error_str = str(error).lower()

        if 'validation' in error_str or 'invalid' in error_str:
            self.errors['validation'] += 1
        elif 'timeout' in error_str:
            self.errors['timeout'] += 1
        elif 'out of memory' in error_str or 'oom' in error_str:
            self.errors['oom'] += 1
        else:
            self.errors['unknown'] += 1

    def report(self):
        return self.errors

tracker = ErrorTracker()

def handler(job):
    try:
        return process(job)
    except Exception as e:
        tracker.track(e)
        logger.error(f"Error: {e}")
        return {"error": str(e)}
```

## Performance Metrics

**Execution Time Tracking:**
```python
import time

execution_times = []

def handler(job):
    start_time = time.time()

    try:
        result = process(job['input'])
        execution_time = time.time() - start_time

        # Track metrics
        execution_times.append(execution_time)
        avg_time = sum(execution_times) / len(execution_times)

        logger.info(f"Execution time: {execution_time:.2f}s (avg: {avg_time:.2f}s)")

        return {
            **result,
            "execution_time": execution_time
        }

    except Exception as e:
        execution_time = time.time() - start_time
        logger.error(f"Failed after {execution_time:.2f}s: {e}")
        return {"error": str(e)}
```

## Alerting

**Alert Conditions:**
```python
class AlertManager:
    def __init__(self, webhook_url: str):
        self.webhook_url = webhook_url

    def send_alert(self, title: str, message: str, severity: str = "warning"):
        payload = {
            "title": title,
            "message": message,
            "severity": severity,
            "timestamp": time.time()
        }
        requests.post(self.webhook_url, json=payload)

alerts = AlertManager("https://alerts.example.com/webhook")

# High queue alert
if health['jobs']['inQueue'] > 100:
    alerts.send_alert(
        "High Queue Depth",
        f"Queue depth: {health['jobs']['inQueue']}",
        severity="warning"
    )

# High failure rate
if failure_rate > 0.10:
    alerts.send_alert(
        "High Failure Rate",
        f"Failure rate: {failure_rate:.1%}",
        severity="critical"
    )

# No idle workers
if health['workers']['idle'] == 0 and health['jobs']['inQueue'] > 0:
    alerts.send_alert(
        "No Idle Workers",
        "All workers busy, queue building up",
        severity="warning"
    )
```

## Debugging

**Common Issues:**

**1. High Cold Start Times:**
```python
# Check initialization time
logger.info(f"Handler initialized at {time.time()}")

# Solution: Bake models into image
```

**2. Memory Issues:**
```python
import torch

# Monitor GPU memory
allocated = torch.cuda.memory_allocated() / 1024**3
reserved = torch.cuda.memory_reserved() / 1024**3
logger.info(f"GPU memory: {allocated:.2f}GB allocated, {reserved:.2f}GB reserved")

# Solution: Use smaller batch size, clear cache
torch.cuda.empty_cache()
```

**3. Timeout Issues:**
```python
# Track operation time
with Timer("model_inference"):
    result = model.generate(...)

# Solution: Increase timeout, optimize model
```

## Dashboards

**Key Metrics to Track:**
- Jobs per hour
- Average execution time
- Failure rate
- Queue depth
- Worker utilization
- Cost per job
- Cold start frequency

**Prometheus/Grafana Integration:**
```python
from prometheus_client import Counter, Histogram, Gauge

jobs_total = Counter('runpod_jobs_total', 'Total jobs processed')
job_duration = Histogram('runpod_job_duration_seconds', 'Job duration')
queue_depth = Gauge('runpod_queue_depth', 'Current queue depth')

def handler(job):
    jobs_total.inc()

    with job_duration.time():
        result = process(job)

    return result

# Periodic metrics update
health = client.health(endpoint_id)
queue_depth.set(health['jobs']['inQueue'])
```

## Best Practices

✅ **Monitor health regularly** (every 1-5 minutes)
✅ **Track all job states** (not just success/failure)
✅ **Log structured data** (JSON format)
✅ **Set up alerts** (queue depth, failures, latency)
✅ **Track execution time** (identify bottlenecks)
✅ **Monitor GPU utilization** (avoid waste)
✅ **Aggregate logs externally** (searchable history)

## Common Mistakes

❌ No logging in handlers (blind debugging)
❌ Ignoring queue depth growth
❌ Not tracking failure rates
❌ No alerts for critical issues
❌ Logging sensitive data (PII, API keys)
❌ No performance metrics
❌ Not monitoring costs

## Related Resources

**Agent overview**: `orchestr8://agents/runpod-specialist`
**REST API**: `orchestr8://skills/runpod-rest-api`
**Serverless deployment**: `orchestr8://skills/runpod-serverless-deployment`
**API integration example**: `orchestr8://examples/runpod-api-integration`
