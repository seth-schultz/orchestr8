---
id: runpod-network-volumes
category: skill
tags: [runpod, storage, volumes, persistent, data, nvme]
capabilities:
  - Implement persistent storage with network volumes
  - Share data across multiple pods
  - Optimize storage performance and costs
useWhen:
  - Implementing persistent storage for ML models, datasets, or checkpoints with RunPod network volumes
  - Sharing data across multiple pods by attaching same network volume to different instances
  - Storing large datasets or models requiring fast NVMe SSD access with 200-400 MB/s transfer speeds
  - Preventing data loss when pods terminate by using network volumes instead of container disk
  - Optimizing cold starts for serverless by storing models on network volumes
estimatedTokens: 500
---

# RunPod Network Volumes

## Overview

Network volumes provide **persistent storage** that:
- Survives pod termination
- Can be shared across multiple pods
- NVMe SSD backed (200-400 MB/s, peaks 10 GB/s)
- Exists independently of compute resources
- Billed separately from pod costs

## Creating Volumes

**Via GraphQL:**
```graphql
mutation {
  createNetworkVolume(input: {
    name: "ml-models-storage"
    size: 500                  # GB
    dataCenterId: "US-TX-2"    # Must match pod location
  }) {
    id
    name
    size
  }
}
```

**Via Dashboard:**
1. Storage > Network Volumes > Create
2. Select datacenter (match pod region)
3. Set size (GB)
4. Name volume

**Datacenter Regions:**
- US-TX-2 (Texas)
- EU-RO-1 (Romania)
- CA-MTL-1 (Montreal)

## Attaching to Pods

**During Pod Creation:**
```graphql
mutation {
  podFindAndDeployOnDemand(input: {
    # ... other config ...
    networkVolumeId: "volume_id_here"
    volumeMountPath: "/workspace"
  }) {
    id
  }
}
```

**Important:**
- Attach during creation only (can't attach to running pod)
- Volume replaces default pod volume disk
- Can't detach without deleting pod
- Must be in same datacenter as pod

## Multi-Pod Access

**Sharing Data:**
```python
# Pod 1: Training pod writes checkpoints
torch.save(model.state_dict(), "/workspace/models/checkpoint.pt")

# Pod 2: Inference pod reads same checkpoint
model.load_state_dict(torch.load("/workspace/models/checkpoint.pt"))
```

**Concurrency Rules:**
- ✅ Multiple pods can **read** simultaneously
- ⚠️ Avoid simultaneous **writes** to same file
- ✅ Write to different files/directories
- ❌ No built-in file locking

**Safe Multi-Write Pattern:**
```python
# Each pod writes to unique files
pod_id = os.environ.get("RUNPOD_POD_ID")
checkpoint_path = f"/workspace/checkpoints/{pod_id}/model.pt"
torch.save(model, checkpoint_path)
```

## Storage vs Container Disk

**Container Disk:**
- Ephemeral (deleted on pod terminate)
- Fast (local SSD)
- Free (included with pod)
- Use for: temp files, cache, scratch space

**Network Volume:**
- Persistent (survives termination)
- Fast (NVMe SSD network attached)
- Paid (separate billing)
- Use for: models, datasets, checkpoints, results

**Optimal Strategy:**
```python
# Container disk for temp processing
temp_dir = "/tmp/processing"

# Network volume for persistent data
models_dir = "/workspace/models"
data_dir = "/workspace/datasets"
results_dir = "/workspace/results"
```

## Cost Optimization

**Pricing:**
- ~$0.10-0.20 per GB/month
- Billed even when pod stopped
- Keep volumes funded to prevent deletion

**Optimization Strategies:**
- Delete unused volumes promptly
- Compress datasets before uploading
- Use container disk for disposable data
- Share volumes across projects
- Archive old data to cheaper storage (S3, GCS)

**Cost Calculation:**
```python
# 500 GB volume @ $0.15/GB/month
monthly_cost = 500 * 0.15  # $75/month
daily_cost = monthly_cost / 30  # $2.50/day
```

## Serverless Cold Start Optimization

**Option 1: Bake into Image (Fastest)**
```dockerfile
# Fastest cold start, larger image
RUN python -c "from transformers import AutoModel; \
    AutoModel.from_pretrained('bert-base-uncased')"
```

**Option 2: Network Volume (Smaller Image)**
```python
# handler.py - Load from volume
MODEL_PATH = "/runpod-volume/models/bert"

if os.path.exists(MODEL_PATH):
    model = AutoModel.from_pretrained(MODEL_PATH)
else:
    # First run: download and cache
    model = AutoModel.from_pretrained("bert-base-uncased")
    model.save_pretrained(MODEL_PATH)
```

**Trade-offs:**
- Image: Faster cold start, larger image size
- Volume: Smaller image, ~2-5s slower cold start

## Data Management

**Upload Data:**
```python
# From local machine to pod with volume attached
import paramiko

ssh = paramiko.SSHClient()
ssh.connect(
    hostname="pod-id-22.proxy.runpod.net",
    port=443,
    username="root",
    password="password"
)

sftp = ssh.open_sftp()
sftp.put("local_dataset.tar.gz", "/workspace/datasets/dataset.tar.gz")
sftp.close()
```

**Or use rsync:**
```bash
rsync -avz -e "ssh -p 443" \
  ./datasets/ \
  root@pod-id-22.proxy.runpod.net:/workspace/datasets/
```

**Backup Strategy:**
```bash
# Regular backups to external storage
rclone sync /workspace/critical-data s3:my-bucket/backups/
```

## Critical Warnings

⚠️ **Account Funding:**
- Insufficient funds → volume may be terminated
- Data deleted immediately, **cannot be recovered**
- Keep account balance positive

⚠️ **Not a Backup Solution:**
- RunPod is compute platform, not archival storage
- Always backup critical data offsite
- Use S3, GCS, Backblaze, etc. for long-term storage

⚠️ **No Data Recovery:**
- Deleted volumes are **permanently lost**
- No recovery service available
- Implement your own backup strategy

## Best Practices

✅ **Backup critical data offsite** (S3, GCS)
✅ **Keep account funded** (prevent volume deletion)
✅ **Match datacenter to pods** (same region)
✅ **Use for persistent data only** (models, datasets)
✅ **Avoid simultaneous writes** (file corruption risk)
✅ **Monitor storage usage** (avoid overage)
✅ **Clean up regularly** (delete unused data)

## Common Mistakes

❌ Relying on RunPod as only backup
❌ Writing simultaneously from multiple pods
❌ Not monitoring account balance
❌ Mismatched datacenter regions
❌ Storing temp files on network volume
❌ No offsite backup strategy

## Related Resources

**Agent overview**: `orchestr8://agents/runpod-specialist`
**Pod management**: `orchestr8://skills/runpod-pod-management`
**GraphQL API**: `orchestr8://skills/runpod-graphql-api`
**GraphQL examples**: `orchestr8://examples/runpod-graphql-operations`
