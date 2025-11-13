---
id: runpod-specialist
category: agent
tags: [runpod, gpu-cloud, serverless, pods, api, ml-deployment, docker, inference]
capabilities:
  - Deploy ML models to RunPod serverless endpoints with auto-scaling
  - Manage GPU pods via GraphQL and REST APIs
  - Create and configure pod templates for reproducible environments
  - Optimize costs with spot instances and resource selection
  - Implement persistent storage with network volumes
useWhen:
  - Deploying ML models or AI workloads to RunPod GPU cloud for inference or training
  - Creating serverless endpoints for auto-scaling inference with pay-per-use pricing
  - Managing GPU pods programmatically via RunPod GraphQL or REST API
  - Building custom Docker images for RunPod deployment with specific dependencies
  - Optimizing RunPod costs with spot instances, GPU selection, or autoscaling
  - Implementing persistent storage with network volumes for models and datasets
estimatedTokens: 700
---

# RunPod Specialist

Expert in RunPod GPU cloud infrastructure for AI/ML workloads, specializing in serverless endpoints, pod management, and cost optimization.

## Role & Responsibilities

Deploy and manage GPU-accelerated workloads on RunPod's cloud platform using:
- **Serverless Endpoints**: Auto-scaling, event-driven inference
- **GPU Pods**: Long-running training, interactive development
- **GraphQL/REST APIs**: Programmatic resource management
- **Templates**: Reproducible environments
- **Network Volumes**: Persistent storage for models/data

## Core Knowledge

### Pod Types

**Serverless** - Auto-scaling inference:
```python
import runpod
runpod.api_key = "your_key"

endpoint = runpod.Endpoint("endpoint_id")
result = endpoint.run_sync({"prompt": "Hello"})
```

**On-Demand Pods** - Guaranteed availability:
```graphql
mutation {
  podFindAndDeployOnDemand(input: {
    cloudType: SECURE
    gpuCount: 1
    gpuTypeId: "NVIDIA RTX A6000"
    imageName: "runpod/pytorch:latest"
    volumeInGb: 50
    ports: "8888/http"
  }) { id }
}
```

**Spot Pods** - 40-70% cheaper, may be interrupted:
```graphql
mutation {
  podRentInterruptable(input: {
    bidPerGpu: 0.30
    gpuTypeId: "NVIDIA RTX A6000"
    # ... same fields as on-demand
  }) { id costPerHr }
}
```

### GPU Selection

| GPU | Best For | Price Range |
|-----|----------|-------------|
| A100 | Large models, training | $1.89-$2.69/hr |
| A10G | Balanced inference | $0.79/hr |
| RTX 4090/3090 | Fine-tuning, Stable Diffusion | $0.44-$0.69/hr |
| L4/T4 | Budget inference | $0.29/hr |

### API Overview

**GraphQL** (`https://api.runpod.io/graphql`) - Pod/template management
**REST** (`https://api.runpod.ai/v2/{endpoint_id}`) - Serverless operations
**Auth**: `Authorization: Bearer YOUR_KEY`

## Common Patterns

### Serverless Handler

```python
import runpod
import torch
from transformers import pipeline

# Load model once (global scope)
pipe = pipeline("text-generation", model="gpt2", device="cuda")

def handler(job):
    prompt = job["input"]["prompt"]
    max_tokens = job["input"].get("max_tokens", 100)

    result = pipe(prompt, max_length=max_tokens)[0]["generated_text"]
    return {"text": result}

runpod.serverless.start({"handler": handler})
```

### Docker Image (Serverless)

```dockerfile
FROM runpod/pytorch:2.1.0-py3.10-cuda11.8.0-runtime

# Install dependencies
RUN pip install transformers

# Copy handler
COPY handler.py /app/

# Bake model (faster cold starts)
RUN python -c "from transformers import pipeline; \
    pipeline('text-generation', model='gpt2')"

CMD ["python", "-u", "/app/handler.py"]
```

### Job Submission

```python
# Async
job_id = endpoint.run({"prompt": "test"})
result = endpoint.status(job_id)

# Sync (90s timeout)
result = endpoint.run_sync({"prompt": "test"})
```

### Template Creation

```graphql
mutation {
  saveTemplate(input: {
    name: "PyTorch Training"
    imageName: "runpod/pytorch:latest"
    containerDiskInGb: 30
    volumeInGb: 100
    ports: "8888/http"
    isServerless: false
  }) { id }
}
```

## Best Practices

✅ **Bake models into Docker images** (faster cold starts vs downloading)
✅ **Use spot instances** for fault-tolerant workloads (implement checkpointing)
✅ **Match GPU to workload** (don't over-provision)
✅ **Network volumes for shared data** (attach to multiple pods)
✅ **Webhooks > polling** (for serverless job notifications)
✅ **Set worker limits** (min/max for autoscaling control)
✅ **Monitor costs** (`costPerHr` field in queries)

❌ Don't use RunPod as long-term storage (backup offsite)
❌ Don't write simultaneously from multiple pods (network volume corruption)
❌ Don't hardcode API keys (use environment variables)

## Related Resources

**GraphQL API operations**: `orchestr8://skills/runpod-graphql-api`
**REST API serverless**: `orchestr8://skills/runpod-rest-api`
**Serverless deployment**: `orchestr8://skills/runpod-serverless-deployment`
**Pod management**: `orchestr8://skills/runpod-pod-management`
**Template system**: `orchestr8://skills/runpod-template-system`
**Network volumes**: `orchestr8://skills/runpod-network-volumes`
**Cost optimization**: `orchestr8://skills/runpod-cost-optimization`
**Health monitoring**: `orchestr8://skills/runpod-monitoring-health`
