---
id: runpod-serverless-deployment
category: skill
tags: [runpod, serverless, deployment, docker, handlers, inference]
capabilities:
  - Build serverless handler functions for RunPod endpoints
  - Create Docker images optimized for serverless deployment
  - Deploy and configure autoscaling serverless endpoints
useWhen:
  - Creating serverless handler functions for ML model inference with RunPod auto-scaling
  - Building Docker images for serverless deployment with model baking for faster cold starts
  - Deploying serverless endpoints from GitHub repositories or custom Docker images
  - Configuring worker counts, GPU types, and timeouts for serverless autoscaling
  - Implementing serverless inference APIs with pay-per-use GPU pricing
estimatedTokens: 500
---

# RunPod Serverless Deployment

## Handler Function

```python
import runpod
import torch
from transformers import pipeline

# Load model globally (once per worker, not per request)
model = pipeline("text-generation", model="gpt2", device="cuda")

def handler(job):
    """
    job = {
        "input": {...},      # User input
        "id": "job_id",
        "webhook": "url"     # Optional
    }
    """
    job_input = job["input"]

    # Extract parameters
    prompt = job_input["prompt"]
    max_tokens = job_input.get("max_tokens", 100)

    # Run inference
    result = model(prompt, max_length=max_tokens)[0]["generated_text"]

    # Return output (auto JSON-serialized)
    return {"text": result}

# Start serverless worker
runpod.serverless.start({"handler": handler})
```

## Docker Image

```dockerfile
FROM runpod/pytorch:2.1.0-py3.10-cuda11.8.0-runtime

WORKDIR /app

# Install dependencies
RUN pip install --no-cache-dir transformers accelerate

# Copy handler
COPY handler.py .

# Bake model into image (faster cold starts)
RUN python -c "from transformers import pipeline; \
    pipeline('text-generation', model='gpt2')"

# Start handler
CMD ["python", "-u", "handler.py"]
```

## Build & Push

```bash
# Build for linux/amd64 (required by RunPod)
docker build --platform linux/amd64 -t yourname/model:v1 .

# Push to registry
docker push yourname/model:v1
```

## Deploy from GitHub

1. Fork RunPod worker template
2. Customize `handler.py`
3. Push to GitHub
4. RunPod Dashboard > Serverless > New Endpoint
5. Import Git Repository > Select your repo
6. Configure:
   - **GPU**: A100, A10G, RTX 4090, etc.
   - **Workers Min/Max**: 0-10 (scale to zero)
   - **Timeout**: 300s
   - **Container Disk**: 20GB
7. Deploy

## Deploy from Docker Image

```
RunPod Dashboard > Serverless > New Endpoint
> Custom Image
> Enter: yourname/model:v1
> Configure GPU and workers
> Deploy
```

## Template Configuration

```graphql
mutation {
  saveTemplate(input: {
    name: "GPT-2 Serverless"
    imageName: "yourname/model:v1"
    containerDiskInGb: 20
    volumeInGb: 0              # Always 0 for serverless
    env: [
      { key: "MODEL_ID", value: "gpt2" }
    ]
    isServerless: true
  }) { id }
}
```

## Cold Start Optimization

**1. Bake Models (Best)**
```dockerfile
# Download model during build
RUN python -c "from transformers import AutoModel; \
    AutoModel.from_pretrained('bert-base-uncased')"
```

**2. Use Network Volume (Alternative)**
```python
# Mount network volume at /runpod-volume
model = pipeline("text-generation",
                model="/runpod-volume/models/gpt2",
                device="cuda")
```
**Trade-off**: Slower cold start vs smaller image

**3. Optimize Image Size**
```dockerfile
# Use slim base images
FROM python:3.10-slim

# Multi-stage build
FROM builder AS final
COPY --from=builder /app /app
```

## Best Practices

✅ **Load models globally** (not inside handler)
✅ **Bake models into image** (fastest cold starts)
✅ **Use GPU-optimized base images** (runpod/pytorch, runpod/tensorflow)
✅ **Set min workers to 0** (scale to zero when idle)
✅ **Optimize image size** (faster pulls)
✅ **Handle errors gracefully** (return error in output)
✅ **Test locally first** (docker run with sample input)

## Common Mistakes

❌ Loading model inside handler (slow every request)
❌ Not using `--platform linux/amd64` on Mac
❌ Large images without optimization (slow cold starts)
❌ Not handling missing input parameters
❌ Blocking operations (use async for I/O)
❌ Not testing locally before deployment

## Testing Locally

```bash
# Run container
docker run -it --gpus all yourname/model:v1

# In another terminal, simulate job
curl -X POST http://localhost:8000/run \
  -H "Content-Type: application/json" \
  -d '{"input": {"prompt": "Hello", "max_tokens": 50}}'
```

## Related Resources

**Agent overview**: `orchestr8://agents/runpod-specialist`
**REST API**: `orchestr8://skills/runpod-rest-api`
**Complete example**: `orchestr8://examples/runpod-serverless-handler`
