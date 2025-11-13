---
id: runpod-pod-management
category: skill
tags: [runpod, pods, lifecycle, management, gpu, docker]
capabilities:
  - Manage GPU pod lifecycle and configuration
  - Implement pod monitoring and maintenance strategies
  - Handle pod networking and port configuration
useWhen:
  - Managing long-running GPU pods for training, development, or persistent services
  - Configuring pod networking with port forwarding for Jupyter, SSH, or custom services
  - Implementing pod lifecycle automation with start, stop, resume, and terminate operations
  - Setting up persistent development environments with GPU access and storage configuration
  - Monitoring pod resource utilization including GPU usage, memory, and uptime metrics
estimatedTokens: 480
---

# RunPod Pod Management

## Pod Types

**On-Demand Pods:**
- Guaranteed availability
- Predictable pricing
- Best for critical workloads
- Use `podFindAndDeployOnDemand` mutation

**Spot Pods (Interruptable):**
- 40-70% cost savings
- May be interrupted
- Best for fault-tolerant training
- Use `podRentInterruptable` mutation
- Implement checkpointing every 5-10 min

**CPU Pods:**
- No GPU required
- Cheaper for prep/post-processing
- Support Docker and network volumes

## Configuration

**GPU Selection:**
```yaml
gpuTypeId: "NVIDIA RTX A6000"   # Specific model
gpuCount: 1                      # Number of GPUs
minVcpuCount: 4                  # Minimum CPU cores
minMemoryInGb: 16                # Minimum RAM
```

**Storage:**
```yaml
containerDiskInGb: 20           # Ephemeral (deleted on terminate)
volumeInGb: 50                  # Persistent network volume
volumeMountPath: "/workspace"   # Mount point
```

**Networking:**
```yaml
ports: "8888/http,6006/http,22/tcp"  # Jupyter, TensorBoard, SSH
```

**Environment:**
```yaml
env:
  - key: "JUPYTER_PASSWORD"
    value: "secure123"
  - key: "WANDB_API_KEY"
    value: "$RUNPOD_SECRET_WANDB"  # Use secrets for credentials
```

## Lifecycle Operations

**Start/Stop Pattern:**
```python
# Stop when not in use (save compute costs, keep storage)
client.stop_pod(pod_id)
# Storage charges continue, but no compute charges

# Resume when needed
client.resume_pod(pod_id)
# May get different GPU/host, same storage
```

**State Transitions:**
```
PENDING → RUNNING → EXITED (stopped)
                  → TERMINATED (deleted)
```

## Monitoring

**Check Status:**
```graphql
query {
  pod(input: { podId: "abc123" }) {
    desiredStatus         # Target state
    runtime {
      uptimeInSeconds
      gpuUtilPercent     # GPU utilization
      memoryUtilPercent  # RAM usage
    }
  }
}
```

**Health Checks:**
- Monitor GPU utilization (avoid idle pods)
- Check memory usage (prevent OOM)
- Track uptime for cost analysis
- Verify network connectivity

## Networking

**Port Access:**
```
Public URL: https://[pod-id]-[port].proxy.runpod.net
Example: https://abc123-8888.proxy.runpod.net
```

**SSH Access:**
```bash
# If SSH enabled (port 22/tcp)
ssh root@[pod-id]-22.proxy.runpod.net -p 443
```

**Custom Domains:**
- Use CloudFlare tunnels
- Configure reverse proxy
- Set up SSL certificates

## Best Practices

✅ **Stop pods when idle** (save 80%+ on costs)
✅ **Use spot for training** (implement checkpointing)
✅ **Monitor GPU utilization** (avoid waste)
✅ **Attach network volumes** (persist data)
✅ **Use templates** (reproducible environments)
✅ **Set strong passwords** (especially Jupyter)
✅ **Backup critical data** (offsite storage)

## Common Mistakes

❌ Leaving pods running idle (costly)
❌ Not using spot instances for training
❌ Storing only on container disk (lost on terminate)
❌ Weak passwords on public endpoints
❌ Not monitoring resource usage
❌ Forgetting to terminate when done

## Pod Lifecycle Best Practices

**Development Workflow:**
1. Create pod with template
2. Develop/train/experiment
3. Stop pod when not actively using
4. Resume when needed
5. Terminate when project complete
6. Backup data to external storage first

**Training Workflow:**
1. Use spot instance for cost savings
2. Implement checkpointing (every epoch)
3. Save checkpoints to network volume
4. Handle interruptions gracefully
5. Auto-resume on new pod if interrupted

## Related Resources

**Agent overview**: `orchestr8://agents/runpod-specialist`
**GraphQL API**: `orchestr8://skills/runpod-graphql-api`
**Templates**: `orchestr8://skills/runpod-template-system`
**Storage**: `orchestr8://skills/runpod-network-volumes`
**GraphQL examples**: `orchestr8://examples/runpod-graphql-operations`
