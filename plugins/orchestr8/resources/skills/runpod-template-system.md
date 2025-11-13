---
id: runpod-template-system
category: skill
tags: [runpod, templates, docker, configuration, reproducibility]
capabilities:
  - Create and manage reusable pod templates
  - Configure Docker images for RunPod deployment
  - Implement template versioning strategies
useWhen:
  - Creating reusable pod configurations with pre-configured Docker images and environment variables
  - Building reproducible environments for team collaboration with standardized templates
  - Implementing template versioning for different project stages or model versions
  - Configuring serverless templates with appropriate GPU types and worker settings
  - Sharing pod configurations across team members or deploying consistent environments
estimatedTokens: 450
---

# RunPod Template System

## Template Types

**Pod Templates** (for GPU/CPU pods):
```yaml
volumeInGb: 100           # Persistent storage
isServerless: false
```

**Serverless Templates** (for endpoints):
```yaml
volumeInGb: 0             # Always 0 for serverless
isServerless: true
```

## Creating Templates

**Via GraphQL:**
```graphql
mutation {
  saveTemplate(input: {
    name: "PyTorch Training v2.1"
    imageName: "runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel"
    dockerArgs: "--shm-size=10g --ipc=host"
    containerDiskInGb: 30
    volumeInGb: 100
    ports: "8888/http,6006/http"
    env: [
      { key: "JUPYTER_PASSWORD", value: "changeme" }
      { key: "WANDB_PROJECT", value: "my-project" }
    ]
    isServerless: false
    isPublic: false        # Private to your account
  }) {
    id
    name
  }
}
```

**Via Dashboard:**
1. Deploy a pod with desired configuration
2. Test and verify setup
3. Save as template from pod settings
4. Name and optionally share publicly

## Docker Image Requirements

**Platform:**
```bash
# Must be linux/amd64
docker build --platform linux/amd64 -t image:tag .
```

**Base Images (Recommended):**
- `runpod/pytorch:latest` - PyTorch + CUDA
- `runpod/tensorflow:latest` - TensorFlow + CUDA
- `runpod/base:latest` - CUDA + Python only
- Custom: Build on official NVIDIA CUDA images

**Best Practices:**
```dockerfile
FROM runpod/pytorch:2.1.0-py3.10-cuda11.8.0-runtime

# Install dependencies
RUN pip install --no-cache-dir transformers wandb

# Pre-download models (faster startup)
RUN python -c "from transformers import AutoModel; \
    AutoModel.from_pretrained('bert-base-uncased')"

# Set working directory
WORKDIR /workspace

# Copy startup scripts
COPY setup.sh /
RUN chmod +x /setup.sh

# Optional: Auto-run on start
CMD ["/bin/bash", "/setup.sh"]
```

## Template Configuration

**Docker Args:**
```yaml
dockerArgs: "--shm-size=10g --ipc=host --ulimit memlock=-1"
# --shm-size: Shared memory for DataLoaders
# --ipc=host: Inter-process communication
# --ulimit: Memory locking for performance
```

**Ports:**
```yaml
ports: "8888/http,6006/http,22/tcp,5000/http"
# 8888: Jupyter
# 6006: TensorBoard
# 22: SSH
# 5000: Custom API
```

**Environment Variables:**
```yaml
env:
  - { key: "NODE_ENV", value: "production" }
  - { key: "API_KEY", value: "$RUNPOD_SECRET_API_KEY" }  # Use secrets
  - { key: "CUDA_VISIBLE_DEVICES", value: "0" }
```

## Template Versioning

**Naming Strategy:**
```
project-stage-version
└─ ml-training-v1.0
└─ ml-training-v1.1
└─ ml-production-v2.0
```

**Update Pattern:**
```python
# Update template
client.update_template(
    template_id="template_abc123",
    image_name="yourname/project:v1.1",
    volume_gb=150  # Increased storage
)
```

## Using Templates

**Deploy from Template:**
```graphql
mutation {
  podFindAndDeployOnDemand(input: {
    templateId: "template_abc123"
    cloudType: SECURE
    gpuCount: 1
  }) {
    id
  }
}
```

**Override Template Settings:**
```graphql
mutation {
  podFindAndDeployOnDemand(input: {
    templateId: "template_abc123"
    gpuCount: 2              # Override: use 2 GPUs
    volumeInGb: 200          # Override: more storage
  }) {
    id
  }
}
```

## Template Management

**List Templates:**
```graphql
query {
  myself {
    templates {
      id
      name
      imageName
      isServerless
      isPublic
    }
  }
}
```

**Delete Template:**
- Must not be in use by any pods/endpoints
- Wait 2 minutes after last use
- Use `deleteTemplate` mutation

## Best Practices

✅ **Version your images** (use tags, not `latest`)
✅ **Test before templating** (deploy pod first)
✅ **Use descriptive names** (include version/purpose)
✅ **Document in README** (template metadata field)
✅ **Bake dependencies** (faster startup)
✅ **Use secrets for credentials** (not hardcoded env)
✅ **Keep templates updated** (security patches)

## Common Mistakes

❌ Using `latest` tag (not reproducible)
❌ Large images without optimization (slow pulls)
❌ Hardcoding secrets in templates
❌ Not testing before deployment
❌ Mixing serverless/pod configurations
❌ Deleting in-use templates

## Related Resources

**Agent overview**: `orchestr8://agents/runpod-specialist`
**Pod management**: `orchestr8://skills/runpod-pod-management`
**Serverless deployment**: `orchestr8://skills/runpod-serverless-deployment`
**GraphQL examples**: `orchestr8://examples/runpod-graphql-operations`
