---
id: runpod-graphql-api
category: skill
tags: [runpod, graphql, api, pods, mutations, queries, templates]
capabilities:
  - Execute GraphQL mutations for pod lifecycle management
  - Query pod status, configuration, and resource details
  - Create and manage pod templates via GraphQL
useWhen:
  - Creating, stopping, resuming, or terminating RunPod pods programmatically via GraphQL API
  - Querying pod status, GPU metrics, runtime information, or cost details through GraphQL queries
  - Managing pod templates with saveTemplate, updateTemplate, and deleteTemplate mutations for reproducible environments
  - Implementing bidding for spot instances with podRentInterruptable mutation for cost-optimized GPU workloads
  - Building automated pod provisioning workflows requiring precise control over GPU type, storage, and networking configuration
estimatedTokens: 550
---

# RunPod GraphQL API Operations

## Endpoint & Authentication

```
URL: https://api.runpod.io/graphql
Auth: Authorization: Bearer YOUR_RUNPOD_API_KEY
```

## Core Mutations

### Create On-Demand Pod

```graphql
mutation {
  podFindAndDeployOnDemand(input: {
    cloudType: SECURE          # SECURE | COMMUNITY | ALL
    gpuCount: 1
    volumeInGb: 50
    containerDiskInGb: 20
    minVcpuCount: 4
    minMemoryInGb: 16
    gpuTypeId: "NVIDIA RTX A6000"
    imageName: "runpod/pytorch:latest"
    ports: "8888/http,6006/http"
    volumeMountPath: "/workspace"
    env: [
      { key: "JUPYTER_PASSWORD", value: "secure123" }
    ]
  }) {
    id
    desiredStatus
    costPerHr
    machine { gpuDisplayName gpuCount }
  }
}
```

### Create Spot Pod

```graphql
mutation {
  podRentInterruptable(input: {
    bidPerGpu: 0.30            # Max price per GPU/hour
    gpuTypeId: "NVIDIA RTX A6000"
    # ... same fields as on-demand
  }) {
    id
    costPerHr
  }
}
```

### Stop/Resume/Terminate

```graphql
# Stop (pause, keeps config)
mutation { podStop(input: { podId: "abc123" }) { id desiredStatus } }

# Resume
mutation { podResume(input: { podId: "abc123" }) { id desiredStatus } }

# Terminate (permanent deletion)
mutation { podTerminate(input: { podId: "abc123" }) { id } }
```

### Create Template

```graphql
mutation {
  saveTemplate(input: {
    name: "PyTorch Training Template"
    imageName: "runpod/pytorch:latest"
    containerDiskInGb: 30
    volumeInGb: 100            # 0 for serverless
    ports: "8888/http"
    env: [{ key: "KEY", value: "value" }]
    isServerless: false
  }) {
    id
    name
  }
}
```

### Create Network Volume

```graphql
mutation {
  createNetworkVolume(input: {
    name: "shared-models"
    size: 500                  # GB
    dataCenterId: "US-TX-2"
  }) {
    id
    name
  }
}
```

## Core Queries

### Get My Pods

```graphql
query {
  myself {
    pods {
      id
      name
      desiredStatus
      imageName
      costPerHr
      machine { gpuDisplayName gpuCount }
      runtime {
        uptimeInSeconds
        ports { privatePort publicPort type }
      }
    }
  }
}
```

### Get Pod Details

```graphql
query GetPod($podId: String!) {
  pod(input: { podId: $podId }) {
    id
    name
    desiredStatus
    imageName
    costPerHr
    machine {
      gpuDisplayName
      gpuCount
      cpuCores
      memoryInGb
    }
    runtime {
      uptimeInSeconds
      gpuUtilPercent
      ports { ip publicPort type }
    }
  }
}
```

Variables: `{ "podId": "abc123" }`

### Get GPU Types

```graphql
query {
  gpuTypes {
    id
    displayName
    memoryInGb
    securePrice               # On-demand price/hr
    communityPrice
    lowestPrice(input: { gpuCount: 1 }) {
      minimumBidPrice
    }
  }
}
```

## Python Implementation

```python
import requests

GRAPHQL_ENDPOINT = "https://api.runpod.io/graphql"
API_KEY = "your_api_key"

def run_query(query, variables=None):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {"query": query}
    if variables:
        payload["variables"] = variables

    response = requests.post(GRAPHQL_ENDPOINT, headers=headers, json=payload)
    return response.json()

# Create pod
result = run_query("""
  mutation {
    podFindAndDeployOnDemand(input: {
      cloudType: SECURE
      gpuCount: 1
      gpuTypeId: "NVIDIA RTX A6000"
      imageName: "runpod/pytorch:latest"
      volumeInGb: 50
      ports: "8888/http"
    }) { id desiredStatus }
  }
""")

pod_id = result["data"]["podFindAndDeployOnDemand"]["id"]
```

## Best Practices

✅ **Use variables** for dynamic values (don't interpolate strings)
✅ **Request only needed fields** (minimize response size)
✅ **Monitor costs** (query `costPerHr` in all pod operations)
✅ **Handle errors** (check response for `errors` array)
✅ **Implement retries** (transient errors common in provisioning)
✅ **Use Secrets** (never hardcode credentials in mutations)

## Common Mistakes

❌ Forgetting to check `errors` in response
❌ Not specifying `cloudType: ALL` when resources are scarce
❌ Hardcoding sensitive values instead of using RunPod Secrets
❌ Querying all fields when only needing subset
❌ Not terminating unused pods (ongoing charges)

## Related Resources

**Agent overview**: `orchestr8://agents/runpod-specialist`
**REST API alternative**: `orchestr8://skills/runpod-rest-api`
**Complete examples**: `orchestr8://examples/runpod-graphql-operations`
