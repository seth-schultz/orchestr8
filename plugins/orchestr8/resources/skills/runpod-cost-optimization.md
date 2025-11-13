---
id: runpod-cost-optimization
category: skill
tags: [runpod, cost, optimization, spot, pricing, budget]
capabilities:
  - Optimize RunPod infrastructure costs
  - Implement spot instance strategies
  - Configure autoscaling for serverless
useWhen:
  - Reducing RunPod costs with spot instances offering 40-70% savings for fault-tolerant workloads
  - Implementing autoscaling for serverless endpoints to scale to zero when idle
  - Optimizing GPU selection by matching workload requirements to appropriate GPU tiers
  - Managing storage costs with network volume cleanup and container disk optimization
  - Implementing cost monitoring and budget alerts for RunPod infrastructure spend
estimatedTokens: 520
---

# RunPod Cost Optimization

## Strategy 1: Spot Instances (40-70% Savings)

**When to Use:**
- Training jobs (with checkpointing)
- Batch processing
- Development/testing
- Non-time-critical workloads

**Implementation:**
```graphql
mutation {
  podRentInterruptable(input: {
    bidPerGpu: 0.30           # Set max price
    gpuTypeId: "NVIDIA RTX A6000"
    # ... rest of config
  }) {
    id
    costPerHr                 # Actual price (usually lower)
  }
}
```

**Bidding Strategy:**
- Check current market: Query `lowestPrice`
- Set bid 10-20% above market price
- Monitor interruption frequency
- Adjust bid based on urgency

**Fault Tolerance:**
```python
# Save checkpoints frequently
for epoch in range(epochs):
    train_epoch()

    # Checkpoint every epoch
    if epoch % 1 == 0:
        torch.save({
            'epoch': epoch,
            'model_state': model.state_dict(),
            'optimizer_state': optimizer.state_dict(),
        }, f'/workspace/checkpoints/epoch_{epoch}.pt')
```

**Resume Pattern:**
```python
# Resume from latest checkpoint
checkpoint_dir = "/workspace/checkpoints"
checkpoints = sorted(glob(f"{checkpoint_dir}/*.pt"))

if checkpoints:
    latest = checkpoints[-1]
    checkpoint = torch.load(latest)
    model.load_state_dict(checkpoint['model_state'])
    start_epoch = checkpoint['epoch'] + 1
else:
    start_epoch = 0
```

## Strategy 2: GPU Selection (Right-Sizing)

**GPU Tier Selection:**

| Workload | GPU | Price | Use Case |
|----------|-----|-------|----------|
| Large models, training | A100 80GB | $2.69/hr | LLaMA 70B, GPT training |
| Balanced inference | A10G 24GB | $0.79/hr | Production APIs |
| Fine-tuning | RTX 4090 24GB | $0.69/hr | LoRA, QLoRA |
| Stable Diffusion | RTX 3090 24GB | $0.44/hr | Image generation |
| Small inference | L4 24GB | $0.29/hr | BERT, small models |

**Cost Comparison:**
```python
# Training 100 hours
a100_cost = 100 * 2.69  # $269
a10g_cost = 100 * 0.79  # $79
savings = a100_cost - a10g_cost  # $190 (71% savings)
```

**Selection Criteria:**
- Model size → VRAM requirements
- Batch size → Memory needs
- Speed requirements → CUDA cores
- Budget → Price tier

## Strategy 3: Serverless Autoscaling

**Configuration:**
```yaml
workers:
  min: 0                  # Scale to zero when idle
  max: 10                 # Cap at 10 for cost control

gpuIds:                   # Prefer cheaper GPUs first
  - "NVIDIA L4"           # Try L4 first ($0.29/hr)
  - "NVIDIA RTX A6000"    # Fallback to A6000 ($0.79/hr)
```

**Cost Impact:**
```python
# Without scale-to-zero: 1 worker always running
always_on = 24 * 30 * 0.79  # $568/month

# With scale-to-zero: 4 hours/day actual usage
scale_to_zero = 4 * 30 * 0.79  # $95/month
savings = always_on - scale_to_zero  # $473/month (83%)
```

**Optimization:**
- Set `workersMin: 0` for intermittent workloads
- Use `workersMin: 1-2` for consistent traffic
- Monitor queue depth to adjust max workers
- Set appropriate timeout (don't pay for idle)

## Strategy 4: Storage Optimization

**Storage Costs:**
- Network volume: ~$0.15/GB/month
- Container disk: Free (included)

**Optimization:**
```python
# Compress datasets
tar -czf dataset.tar.gz dataset/  # 70-80% reduction
```

**Storage Strategy:**
```yaml
Container Disk (Free):
  - Temporary files
  - Cache
  - Intermediate results
  - Application code

Network Volume (Paid):
  - Models
  - Training data
  - Checkpoints
  - Final results
```

**Cleanup Pattern:**
```bash
# Delete old checkpoints
find /workspace/checkpoints -mtime +7 -delete

# Keep only best N checkpoints
ls -t /workspace/checkpoints/*.pt | tail -n +6 | xargs rm
```

## Strategy 5: Pod Lifecycle Management

**Stop When Idle:**
```python
import time
from datetime import datetime, timedelta

last_activity = datetime.now()
IDLE_TIMEOUT = timedelta(hours=1)

while True:
    if datetime.now() - last_activity > IDLE_TIMEOUT:
        # Stop pod via API
        client.stop_pod(pod_id)
        break

    time.sleep(300)  # Check every 5 min
```

**Cost Impact:**
```python
# Always running
always_on = 24 * 30 * 0.79  # $568/month

# 8 hours/day actual use, stopped when idle
optimized = 8 * 30 * 0.79   # $190/month
savings = 568 - 190         # $378/month (67%)
```

**Development Pattern:**
- Start pod when needed
- Work for session
- Stop at end of day
- Resume next day

## Strategy 6: Community vs Secure Cloud

**Community Cloud:**
- 40-70% cheaper
- Less reliable (interruptions)
- Best for dev/test
- May have availability issues

**Secure Cloud:**
- Guaranteed availability
- Higher reliability
- Production workloads
- Predictable performance

**Hybrid Strategy:**
```yaml
Development: Community Cloud (cheap)
Training: Spot instances (Secure Cloud)
Production: On-demand (Secure Cloud)
```

## Cost Monitoring

**Track Spending:**
```python
# Query all pods with costs
pods = client.get_pods()

total_cost = 0
for pod in pods:
    uptime_hours = pod['runtime']['uptimeInSeconds'] / 3600
    cost = uptime_hours * pod['costPerHr']
    total_cost += cost
    print(f"{pod['name']}: ${cost:.2f}")

print(f"Total: ${total_cost:.2f}")
```

**Budget Alerts:**
- Set billing alerts in dashboard
- Monitor daily/weekly spend
- Review underutilized resources
- Terminate forgotten pods

## ROI Analysis

**Calculate Savings:**
```python
def calculate_savings(
    hours_per_month: int,
    on_demand_price: float,
    spot_price: float,
    use_scale_to_zero: bool = False
):
    on_demand = hours_per_month * on_demand_price

    if use_scale_to_zero:
        # Only pay for actual usage
        spot = hours_per_month * spot_price
    else:
        # 24/7 spot instance
        spot = 24 * 30 * spot_price

    savings = on_demand - spot
    percent = (savings / on_demand) * 100

    return {
        'on_demand': on_demand,
        'optimized': spot,
        'savings': savings,
        'percent': percent
    }

# Example: 100 hours/month A100
result = calculate_savings(100, 2.69, 0.85, use_scale_to_zero=True)
print(f"Savings: ${result['savings']:.2f} ({result['percent']:.0f}%)")
```

## Best Practices

✅ **Use spot for training** (40-70% savings)
✅ **Right-size GPUs** (match workload)
✅ **Scale to zero** (serverless idle savings)
✅ **Stop idle pods** (manual stop saves 100% compute)
✅ **Compress data** (reduce storage costs)
✅ **Delete old checkpoints** (storage cleanup)
✅ **Monitor spending** (set budget alerts)
✅ **Use Community Cloud for dev** (cheaper testing)

## Common Mistakes

❌ Always-on pods for dev (huge waste)
❌ Over-provisioned GPUs (paying for unused power)
❌ No checkpointing on spot instances
❌ Storing everything on network volumes
❌ Forgetting to terminate after experiments
❌ Not monitoring costs regularly
❌ Using A100s for small models

## Quick Wins

**Immediate 50%+ savings:**
1. Stop idle pods (100% compute savings)
2. Use spot instances (40-70% savings)
3. Right-size GPUs (30-70% savings)
4. Enable scale-to-zero (80%+ for intermittent loads)
5. Clean up unused volumes (100% storage savings)

## Related Resources

**Agent overview**: `orchestr8://agents/runpod-specialist`
**Pod management**: `orchestr8://skills/runpod-pod-management`
**Serverless deployment**: `orchestr8://skills/runpod-serverless-deployment`
**Network volumes**: `orchestr8://skills/runpod-network-volumes`
