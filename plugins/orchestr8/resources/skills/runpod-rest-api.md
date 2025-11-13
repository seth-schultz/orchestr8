---
id: runpod-rest-api
category: skill
tags: [runpod, rest, api, http, serverless, jobs]
capabilities:
  - Submit and monitor serverless job requests via REST API
  - Check endpoint health and worker status
  - Configure webhooks for asynchronous workflows
useWhen:
  - Submitting inference jobs to RunPod serverless endpoints with async or sync execution patterns
  - Monitoring job status, checking completion, or polling for results with REST API status endpoints
  - Implementing webhook-based notifications for job completion instead of polling for efficiency
  - Checking serverless endpoint health including worker states (idle, running) and queue metrics
  - Canceling running jobs or purging queues for serverless endpoint management
estimatedTokens: 520
---

# RunPod REST API for Serverless

## Endpoints

```
Pod Management: https://rest.runpod.io/v1/pods
Serverless Jobs: https://api.runpod.ai/v2/{endpoint_id}/
Auth: Authorization: Bearer YOUR_API_KEY
```

## Serverless Operations

### Submit Async Job

```bash
POST https://api.runpod.ai/v2/{endpoint_id}/run

{
  "input": {
    "prompt": "astronaut riding a horse",
    "steps": 30
  },
  "webhook": "https://yourapi.com/webhook"
}

Response:
{
  "id": "job_abc123",
  "status": "IN_QUEUE"
}
```

### Submit Sync Job

```bash
POST https://api.runpod.ai/v2/{endpoint_id}/runsync

{
  "input": { "prompt": "test" }
}

# Waits 90s max, returns immediately if completes
Response (completed):
{
  "id": "job_abc123",
  "status": "COMPLETED",
  "output": { "result": "..." },
  "executionTime": 1234
}
```

### Check Job Status

```bash
GET https://api.runpod.ai/v2/{endpoint_id}/status/{job_id}

Response:
{
  "id": "job_abc123",
  "status": "COMPLETED",          # IN_QUEUE | IN_PROGRESS | COMPLETED | FAILED
  "output": { "result": "..." },
  "executionTime": 2345,
  "delayTime": 120
}
```

### Cancel Job

```bash
POST https://api.runpod.ai/v2/{endpoint_id}/cancel/{job_id}

Response:
{ "id": "job_abc123", "status": "CANCELLED" }
```

### Purge Queue

```bash
POST https://api.runpod.ai/v2/{endpoint_id}/purge-queue

# Removes all IN_QUEUE jobs (not IN_PROGRESS)
Response:
{ "removed": 15 }
```

### Health Check

```bash
GET https://api.runpod.ai/v2/{endpoint_id}/health

Response:
{
  "jobs": {
    "completed": 1245,
    "failed": 23,
    "inProgress": 3,
    "inQueue": 7
  },
  "workers": {
    "idle": 2,
    "running": 3,
    "throttled": 0
  }
}
```

## Python Implementation

```python
import requests
import time

class RunPodClient:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.runpod.ai/v2"

    def _headers(self):
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def run_async(self, endpoint_id: str, input_data: dict, webhook: str = None):
        """Submit async job"""
        payload = {"input": input_data}
        if webhook:
            payload["webhook"] = webhook

        response = requests.post(
            f"{self.base_url}/{endpoint_id}/run",
            headers=self._headers(),
            json=payload
        )
        return response.json()["id"]

    def run_sync(self, endpoint_id: str, input_data: dict, timeout: int = 95):
        """Submit sync job (90s max RunPod side)"""
        response = requests.post(
            f"{self.base_url}/{endpoint_id}/runsync",
            headers=self._headers(),
            json={"input": input_data},
            timeout=timeout
        )
        return response.json()

    def status(self, endpoint_id: str, job_id: str):
        """Check job status"""
        response = requests.get(
            f"{self.base_url}/{endpoint_id}/status/{job_id}",
            headers=self._headers()
        )
        return response.json()

    def wait_for_completion(self, endpoint_id: str, job_id: str,
                           poll_interval: int = 2, max_wait: int = 300):
        """Poll until completion"""
        start = time.time()
        while time.time() - start < max_wait:
            result = self.status(endpoint_id, job_id)
            if result["status"] in ["COMPLETED", "FAILED", "CANCELLED"]:
                return result
            time.sleep(poll_interval)
        raise TimeoutError("Job timeout")

# Usage
client = RunPodClient("your_api_key")

# Async
job_id = client.run_async("endpoint_id", {"prompt": "test"})
result = client.wait_for_completion("endpoint_id", job_id)

# Sync (fast inference)
result = client.run_sync("endpoint_id", {"prompt": "test"})
```

## Webhook Handler

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/runpod-webhook", methods=["POST"])
def handle_webhook():
    data = request.json
    job_id = data["id"]
    status = data["status"]

    if status == "COMPLETED":
        output = data["output"]
        # Process result...
    elif status == "FAILED":
        error = data.get("error")
        # Handle error...

    return jsonify({"received": True}), 200
```

## Best Practices

✅ **Use webhooks** (eliminates polling overhead)
✅ **Sync for fast inference** (<90s expected)
✅ **Async for long jobs** (with webhook notifications)
✅ **Exponential backoff** (for retries on 429/5xx)
✅ **Timeout handling** (set appropriate client timeouts)
✅ **Error checking** (validate HTTP status codes)

## Common Mistakes

❌ Aggressive polling (use webhooks instead)
❌ No timeout on sync requests
❌ Not handling 429 rate limits
❌ Missing error response parsing
❌ Forgetting to cancel/purge stuck jobs

## Related Resources

**GraphQL alternative**: `orchestr8://skills/runpod-graphql-api`
**Agent overview**: `orchestr8://agents/runpod-specialist`
**Serverless deployment**: `orchestr8://skills/runpod-serverless-deployment`
**Complete client example**: `orchestr8://examples/runpod-api-integration`
