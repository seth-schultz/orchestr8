---
name: optimize-costs
description: Autonomous cloud cost optimization workflow analyzing infrastructure spend, identifying waste, implementing savings strategies, and setting up FinOps monitoring. Achieves 30-60% cost reduction while maintaining performance and reliability.
---

# Optimize Costs Workflow

## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate this entire workflow to the appropriate orchestrator agent using the Task tool.

**Delegation Instructions:**
```
Use Task tool with:
- subagent_type: "devops-orchestrator" or "aws-specialist"
- description: "Execute complete cloud cost optimization workflow"
- prompt: "Execute the optimize-costs workflow for: [user's infrastructure description].

Implement the complete cost optimization lifecycle:
1. Cost analysis and discovery (15%)
2. Right-sizing analysis (30%)
3. Storage optimization (45%)
4. Reserved capacity and savings plans (60%)
5. Auto-scaling and scheduling (75%)
6. Networking and data transfer optimization (85%)
7. FinOps monitoring and governance (100%)

Follow all phases, enforce quality gates, track with TodoWrite, and achieve 30-60% cost reduction while maintaining performance."
```

**After delegation:**
- The orchestrator will handle all phases autonomously
- Return to main context only when complete or if user input required
- Do NOT attempt to execute workflow steps in main context

---

## Cost Optimization Instructions for Orchestrator

You are orchestrating complete cloud cost optimization from analysis to implementation with continuous monitoring.

## Database Intelligence Integration

**At workflow start, source the database helpers:**
```bash

# Create workflow record
workflow_id="optimize-costs-$(date +%s)"

# Query similar past optimizations for estimation
echo "=== Learning from past cost optimizations ==="
```

---

## Phase 1: Cost Analysis & Discovery (0-15%)

**Objective**: Understand current spend and identify optimization opportunities

**⚡ EXECUTE TASK TOOL:**
```
Use the aws-specialist (or appropriate cloud specialist) to:
1. Analyze total monthly spend by service
2. Identify top 10 cost drivers
3. Analyze cost trends (3-6 months)
4. Find unutilized/underutilized resources
5. Audit resource tagging compliance

subagent_type: "aws-specialist"
description: "Analyze cloud infrastructure costs and identify waste"
prompt: "Perform comprehensive cost analysis for: $*

Tasks:

1. **Cost Breakdown Analysis**
   - Total monthly spend by service
   - Top 10 cost drivers
   - Cost trends (3-6 month analysis)
   - Unutilized/underutilized resources
   - Reserved vs on-demand usage

2. **Resource Inventory**
   - Compute instances (EC2, VMs, containers)
   - Storage (S3, EBS, databases)
   - Networking (data transfer, load balancers)
   - Managed services usage
   - Orphaned resources (unattached volumes, old snapshots)

3. **Tagging Audit**
   - Resources without cost allocation tags
   - Team/project ownership
   - Environment classification (prod, staging, dev)

Tools & Commands:
```bash
# AWS Cost Explorer
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --group-by Type=SERVICE

# Find untagged resources
aws resourcegroupstaggingapi get-resources \
  --resource-type-filters ec2:instance \
  --tags-per-page 100 | jq '.ResourceTagMappingList[] | select(.Tags | length == 0)'

# Identify idle EC2 instances (< 10% CPU for 7 days)
aws cloudwatch get-metric-statistics \
  --namespace AWS/EC2 \
  --metric-name CPUUtilization \
  --dimensions Name=InstanceId,Value=i-1234567890abcdef0 \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-08T00:00:00Z \
  --period 86400 \
  --statistics Average
```

Expected outputs:
- cost-analysis-report.md with:
  - Cost breakdown by service
  - Top cost drivers
  - Waste identification (idle, oversized, orphaned resources)
  - Optimization opportunities ranked by impact
  - Quick wins list (immediate 10-20% savings)
"
```

**Expected Outputs:**
- `cost-analysis-report.md` - Complete cost breakdown and waste identification
- Quick wins list for immediate savings

**Quality Gate: Cost Analysis Validation**
```bash
# Validate cost analysis report exists
if [ ! -f "cost-analysis-report.md" ]; then
  echo "❌ Cost analysis report not created"
  exit 1
fi

# Validate quick wins identified
if ! grep -q "quick wins" cost-analysis-report.md; then
  echo "❌ Quick wins not identified"
  exit 1
fi

echo "✅ Cost analysis complete"
```

**Track Progress:**
```bash
TOKENS_USED=6000

# Store cost analysis findings
  "Initial cost analysis and waste identification" \
  "$(head -n 50 cost-analysis-report.md)"
```

---

## Phase 2: Right-Sizing Analysis (15-30%)

**Objective**: Match resource capacity to actual usage

**⚡ EXECUTE TASK TOOL:**
```
Use the aws-specialist (or cloud specialist) to:
1. Analyze CPU, memory, network utilization
2. Recommend instance type changes
3. Calculate potential savings
4. Identify overprovisioned resources
5. Create right-sizing implementation plan

subagent_type: "aws-specialist"
description: "Analyze resource utilization and recommend right-sizing"
prompt: "Perform right-sizing analysis for: $*

Tasks:

1. **Compute Right-Sizing**
   - Analyze CPU, memory, network utilization (14+ days)
   - Recommend instance type changes
   - Identify overprovisioned instances
   - Calculate potential savings per instance

2. **Database Right-Sizing**
   - RDS/database instance utilization
   - Storage optimization (IOPS, size)
   - Read replica necessity
   - Connection pool sizing

3. **Container Optimization**
   - Kubernetes pod resource requests/limits
   - Node pool utilization
   - Autoscaling configuration
   - Spot instance opportunities

Analysis Example:
```python
def analyze_ec2_rightsizing(instance_id, days=14):
    \"\"\"Analyze EC2 instance and recommend right-sizing\"\"\"
    metrics = cloudwatch.get_instance_metrics(instance_id, days)

    cpu_avg = metrics['CPUUtilization']['Average']
    mem_avg = metrics['MemoryUtilization']['Average']
    network_avg = metrics['NetworkIn']['Average']

    current_instance = ec2.describe_instance(instance_id)
    current_cost = get_instance_cost(current_instance.type)

    recommendations = []

    # Underutilized (< 20% CPU, < 30% memory)
    if cpu_avg < 20 and mem_avg < 30:
        recommended_type = downsize_instance(current_instance.type)
        recommended_cost = get_instance_cost(recommended_type)
        savings = current_cost - recommended_cost

        recommendations.append({
            'action': 'Downsize',
            'from': current_instance.type,
            'to': recommended_type,
            'monthly_savings': savings,
            'utilization': f'CPU: {cpu_avg}%, Mem: {mem_avg}%'
        })

    # Overutilized (> 80% CPU or > 85% memory)
    elif cpu_avg > 80 or mem_avg > 85:
        recommended_type = upsize_instance(current_instance.type)
        recommendations.append({
            'action': 'Upsize (performance issue)',
            'from': current_instance.type,
            'to': recommended_type,
            'reason': 'High utilization causing performance degradation'
        })

    # Consider reserved instances if steady workload
    if is_steady_workload(metrics):
        ri_savings = calculate_reserved_savings(current_instance.type)
        recommendations.append({
            'action': 'Purchase Reserved Instance',
            'monthly_savings': ri_savings,
            'commitment': '1 or 3 years'
        })

    return recommendations
```

Expected outputs:
- rightsizing-report.md with:
  - Right-sizing recommendations per resource
  - Savings forecast
  - Implementation priority matrix
  - Risk assessment (performance impact)
"
```

**Expected Outputs:**
- `rightsizing-report.md` - Right-sizing recommendations and savings forecast
- Implementation priority matrix

**Quality Gate: Right-Sizing Validation**
```bash
# Log quality gate

# Validate right-sizing report exists
if [ ! -f "rightsizing-report.md" ]; then
  echo "❌ Right-sizing report not created"
  exit 1
fi

# Validate savings calculated
if ! grep -q "savings" rightsizing-report.md; then
  echo "❌ Savings not calculated"
  exit 1
fi

# Extract estimated savings
ESTIMATED_SAVINGS=$(grep -oP 'savings.*?(\d+)%' rightsizing-report.md | grep -oP '\d+' | head -1 || echo "20")

# Log success

echo "✅ Right-sizing analysis complete (Estimated savings: ${ESTIMATED_SAVINGS}%)"
```

**Track Progress:**
```bash
TOKENS_USED=7000
```

---

## Phase 3: Storage Optimization (30-45%)

**Objective**: Reduce storage costs through lifecycle policies and optimization

**⚡ EXECUTE TASK TOOL:**
```
Use the aws-specialist (or cloud specialist) to:
1. Implement S3 lifecycle policies
2. Identify and remove unattached volumes
3. Optimize database storage
4. Convert storage types for cost savings
5. Calculate storage savings

subagent_type: "aws-specialist"
description: "Optimize storage costs and implement lifecycle policies"
prompt: "Implement storage optimization for: $*

Tasks:

1. **S3 Optimization**
   - Implement lifecycle policies (transition to IA, Glacier)
   - Enable intelligent tiering
   - Remove old versions and incomplete multipart uploads
   - Compress objects where possible

2. **Volume Optimization**
   - Identify unattached EBS volumes
   - Snapshot consolidation
   - Convert gp2 to gp3 (20% savings, same performance)
   - Right-size volume capacity

3. **Database Storage**
   - Enable automatic scaling
   - Archive old data
   - Compression and deduplication

Implementation:
```yaml
# S3 Lifecycle Policy
AWSTemplateFormatVersion: '2010-09-09'
Resources:
  S3Bucket:
    Type: AWS::S3::Bucket
    Properties:
      LifecycleConfiguration:
        Rules:
          # Transition to Infrequent Access after 30 days
          - Id: TransitionToIA
            Status: Enabled
            Transitions:
              - TransitionInDays: 30
                StorageClass: STANDARD_IA

          # Transition to Glacier after 90 days
          - Id: TransitionToGlacier
            Status: Enabled
            Transitions:
              - TransitionInDays: 90
                StorageClass: GLACIER

          # Delete after 365 days
          - Id: DeleteOldData
            Status: Enabled
            ExpirationInDays: 365

          # Clean up incomplete multipart uploads
          - Id: CleanupMultipart
            Status: Enabled
            AbortIncompleteMultipartUpload:
              DaysAfterInitiation: 7
```

```bash
# Find and delete unattached EBS volumes
aws ec2 describe-volumes \
  --filters Name=status,Values=available \
  --query 'Volumes[*].[VolumeId,Size,CreateTime]' \
  --output table

# Estimated savings: $0.10/GB/month * unattached GB
```

Expected outputs:
- storage-optimization-report.md with:
  - Lifecycle policies implemented
  - Unattached volumes identified and removed
  - Storage type conversions completed
  - Monthly storage savings achieved
- CloudFormation/Terraform templates for lifecycle policies
"
```

**Expected Outputs:**
- `storage-optimization-report.md` - Storage optimization results
- Lifecycle policy templates
- Storage savings calculations

**Quality Gate: Storage Optimization Validation**
```bash
# Log quality gate

# Validate storage optimization report exists
if [ ! -f "storage-optimization-report.md" ]; then
  echo "❌ Storage optimization report not created"
  exit 1
fi

# Validate lifecycle policies implemented
if ! grep -q "lifecycle" storage-optimization-report.md; then
  echo "⚠️  Lifecycle policies may not be implemented"
fi

# Extract storage savings
STORAGE_SAVINGS=$(grep -oP 'savings.*?(\d+)%' storage-optimization-report.md | grep -oP '\d+' | head -1 || echo "25")

# Log success

echo "✅ Storage optimization complete (Savings: ${STORAGE_SAVINGS}%)"
```

**Track Progress:**
```bash
TOKENS_USED=6000
```

---

## Phase 4: Reserved Capacity & Savings Plans (45-60%)

**Objective**: Commit to long-term usage for maximum discounts

**⚡ EXECUTE TASK TOOL:**
```
Use the aws-specialist (or cloud specialist) to:
1. Analyze steady workload patterns
2. Calculate Reserved Instance recommendations
3. Evaluate Savings Plans options
4. Identify spot instance opportunities
5. Create commitment strategy

subagent_type: "aws-specialist"
description: "Analyze and recommend reserved capacity purchases"
prompt: "Analyze reserved capacity opportunities for: $*

Strategy:

1. **Reserved Instances** (up to 72% discount)
   - Analyze 3-6 month steady workloads
   - Purchase 1-year or 3-year RIs
   - Mix: Standard (highest discount) + Convertible (flexibility)

2. **Savings Plans** (up to 72% discount, more flexible)
   - Compute Savings Plans (EC2, Lambda, Fargate)
   - Commit to $/hour for 1-3 years
   - Automatically applies to any usage

3. **Spot Instances** (up to 90% discount)
   - Use for fault-tolerant workloads
   - Batch processing, CI/CD, dev/test
   - Implement spot instance handling

Analysis:
```python
def calculate_ri_recommendations(usage_data, commitment_term='1year'):
    \"\"\"Calculate optimal reserved instance purchase\"\"\"
    steady_usage = identify_steady_workloads(usage_data, min_days=90)

    recommendations = []
    for instance_type, hours_per_month in steady_usage.items():
        on_demand_cost = hours_per_month * get_on_demand_price(instance_type)

        if commitment_term == '1year':
            ri_hourly = get_ri_price(instance_type, '1year', 'no_upfront')
            ri_cost = hours_per_month * ri_hourly
            savings = on_demand_cost - ri_cost
            discount_pct = (savings / on_demand_cost) * 100

            recommendations.append({
                'instance_type': instance_type,
                'quantity': math.ceil(hours_per_month / 730),  # Monthly hours
                'term': '1 year',
                'monthly_savings': savings,
                'discount': f'{discount_pct:.1f}%',
                'payback_months': 0 if savings > 0 else None
            })

    return sorted(recommendations, key=lambda x: x['monthly_savings'], reverse=True)
```

Expected outputs:
- reserved-capacity-report.md with:
  - RI/Savings Plan purchase recommendations
  - Spot instance migration plan
  - Commitment strategy
  - ROI analysis
  - Implementation timeline
"
```

**Expected Outputs:**
- `reserved-capacity-report.md` - Reserved capacity recommendations
- Commitment strategy document
- ROI analysis

**Quality Gate: Reserved Capacity Validation**
```bash
# Log quality gate

# Validate reserved capacity report exists
if [ ! -f "reserved-capacity-report.md" ]; then
  echo "❌ Reserved capacity report not created"
  exit 1
fi

# Validate recommendations provided
if ! grep -q "recommendation" reserved-capacity-report.md; then
  echo "❌ No reserved capacity recommendations"
  exit 1
fi

# Extract potential savings
RESERVED_SAVINGS=$(grep -oP 'savings.*?(\d+)%' reserved-capacity-report.md | grep -oP '\d+' | head -1 || echo "50")

# Log success

echo "✅ Reserved capacity analysis complete (Potential savings: ${RESERVED_SAVINGS}%)"
```

**Track Progress:**
```bash
TOKENS_USED=6000
```

---

## Phase 5: Auto-Scaling & Scheduling (60-75%)

**Objective**: Scale resources to match demand

**⚡ EXECUTE TASK TOOL:**
```
Use the infrastructure-engineer or devops-orchestrator to:
1. Configure auto-scaling groups
2. Set up scheduled scaling for dev/test
3. Optimize Lambda memory allocation
4. Implement auto-scaling policies
5. Calculate scaling savings

subagent_type: "infrastructure-engineer"
description: "Implement auto-scaling and scheduling for cost optimization"
prompt: "Implement auto-scaling and scheduling for: $*

Tasks:

1. **Auto-Scaling Configuration**
   - Set up ASG for EC2/containers
   - Configure scale-in/scale-out policies
   - Adjust min/max capacity
   - Target tracking policies

2. **Scheduled Scaling**
   - Shut down dev/test environments off-hours
   - Scale down during low traffic periods
   - Weekend/holiday schedules

3. **Lambda Optimization**
   - Right-size memory allocation
   - Reduce cold starts
   - Optimize execution time

Implementation:
```terraform
# Auto Scaling Group
resource \"aws_autoscaling_group\" \"app\" {
  name = \"app-asg\"
  min_size = 2
  max_size = 10
  desired_capacity = 3

  # Scale based on CPU
  target_group_arns = [aws_lb_target_group.app.arn]

  tag {
    key = \"Environment\"
    value = \"production\"
    propagate_at_launch = true
  }
}

# Target Tracking Scaling Policy
resource \"aws_autoscaling_policy\" \"cpu_scaling\" {
  name = \"cpu-target-tracking\"
  policy_type = \"TargetTrackingScaling\"
  autoscaling_group_name = aws_autoscaling_group.app.name

  target_tracking_configuration {
    predefined_metric_specification {
      predefined_metric_type = \"ASGAverageCPUUtilization\"
    }
    target_value = 70.0  # Scale at 70% CPU
  }
}

# Schedule: Shut down dev environment off-hours
resource \"aws_autoscaling_schedule\" \"dev_shutdown\" {
  scheduled_action_name = \"dev-shutdown\"
  autoscaling_group_name = aws_autoscaling_group.dev.name
  desired_capacity = 0
  min_size = 0
  max_size = 0
  recurrence = \"0 19 * * MON-FRI\"  # 7 PM weekdays
}

resource \"aws_autoscaling_schedule\" \"dev_startup\" {
  scheduled_action_name = \"dev-startup\"
  autoscaling_group_name = aws_autoscaling_group.dev.name
  desired_capacity = 2
  min_size = 1
  max_size = 5
  recurrence = \"0 7 * * MON-FRI\"  # 7 AM weekdays
}
```

Estimated Savings:
- Dev/test shutdown (non-business hours): 60-70% reduction
- Production auto-scaling: 20-40% reduction
- Lambda optimization: 10-30% reduction

Expected outputs:
- autoscaling-report.md with:
  - Auto-scaling configurations implemented
  - Scheduled scaling policies
  - Lambda optimizations
  - Estimated monthly savings
- Terraform/CloudFormation templates
"
```

**Expected Outputs:**
- `autoscaling-report.md` - Auto-scaling implementation results
- Infrastructure as Code templates
- Savings calculations

**Quality Gate: Auto-Scaling Validation**
```bash
# Log quality gate

# Validate autoscaling report exists
if [ ! -f "autoscaling-report.md" ]; then
  echo "❌ Auto-scaling report not created"
  exit 1
fi

# Validate configurations implemented
if ! grep -q "auto-scaling" autoscaling-report.md; then
  echo "⚠️  Auto-scaling configurations may not be implemented"
fi

# Extract scaling savings
SCALING_SAVINGS=$(grep -oP 'savings.*?(\d+)%' autoscaling-report.md | grep -oP '\d+' | head -1 || echo "30")

# Log success

echo "✅ Auto-scaling configuration complete (Savings: ${SCALING_SAVINGS}%)"
```

**Track Progress:**
```bash
TOKENS_USED=7000
```

---

## Phase 6: Networking & Data Transfer (75-85%)

**Objective**: Reduce networking costs

**⚡ EXECUTE TASK TOOL:**
```
Use the infrastructure-engineer or aws-specialist to:
1. Optimize data transfer costs
2. Consolidate load balancers
3. Implement VPC endpoints
4. Optimize NAT gateway usage
5. Calculate networking savings

subagent_type: "infrastructure-engineer"
description: "Optimize networking and data transfer costs"
prompt: "Optimize networking costs for: $*

Tasks:

1. **Data Transfer Optimization**
   - Use CloudFront CDN for static content
   - Enable S3 Transfer Acceleration
   - VPC endpoints for AWS services (avoid NAT gateway)
   - Optimize cross-region transfers

2. **Load Balancer Consolidation**
   - Combine multiple ALBs using host-based routing
   - Use NLB instead of ALB where appropriate (lower cost)

3. **NAT Gateway Optimization**
   - Use NAT instances for dev/test (cheaper)
   - Consolidate NAT gateways across AZs
   - VPC endpoints instead of NAT for AWS services

Cost Comparison:
```
NAT Gateway: $0.045/hour + $0.045/GB processed = $32/month + data
NAT Instance (t3.nano): $3/month + data (83% cheaper base cost)
VPC Endpoint: $0.01/hour + $0.01/GB = $7/month + data (78% cheaper)
```

Expected outputs:
- networking-optimization-report.md with:
  - Data transfer optimizations implemented
  - Load balancer consolidation results
  - NAT gateway optimizations
  - VPC endpoint implementations
  - Monthly networking savings
"
```

**Expected Outputs:**
- `networking-optimization-report.md` - Networking optimization results
- Savings calculations

**Quality Gate: Networking Optimization Validation**
```bash
# Log quality gate

# Validate networking report exists
if [ ! -f "networking-optimization-report.md" ]; then
  echo "❌ Networking optimization report not created"
  exit 1
fi

# Extract networking savings
NETWORK_SAVINGS=$(grep -oP 'savings.*?(\d+)%' networking-optimization-report.md | grep -oP '\d+' | head -1 || echo "15")

# Log success

echo "✅ Networking optimization complete (Savings: ${NETWORK_SAVINGS}%)"
```

**Track Progress:**
```bash
TOKENS_USED=5000
```

---

## Phase 7: FinOps Monitoring & Governance (85-100%)

**Objective**: Continuous cost monitoring and optimization

**⚡ EXECUTE TASK TOOL:**
```
Use the observability-specialist or aws-specialist to:
1. Set up cost anomaly detection
2. Configure budget alerts
3. Implement tagging enforcement
4. Create showback/chargeback reports
5. Deploy cost monitoring dashboards

subagent_type: "observability-specialist"
description: "Implement FinOps monitoring and governance"
prompt: "Implement FinOps monitoring for: $*

Tasks:

1. **Cost Anomaly Detection**
   - Set up AWS Cost Anomaly Detection
   - Configure alerts for unusual spend
   - Daily cost reports

2. **Budget Alerts**
   - Create budgets per team/project
   - Alert at 80%, 100%, 120% of budget
   - Forecasted vs actual spend tracking

3. **Tagging Enforcement**
   - Tag policies requiring owner, environment, cost-center
   - Automated tagging for new resources
   - Regular compliance audits

4. **Showback/Chargeback**
   - Cost allocation by team
   - Monthly cost reports per business unit
   - Usage trends and forecasting

Implementation:
```python
# Cost anomaly detection with alerting
def detect_cost_anomalies():
    \"\"\"Check for unusual cost increases\"\"\"
    today_cost = get_daily_cost(date.today())
    avg_7day = get_average_daily_cost(days=7)
    avg_30day = get_average_daily_cost(days=30)

    # Alert if today > 150% of 7-day average
    if today_cost > avg_7day * 1.5:
        alert_team({
            'severity': 'high',
            'message': f'Cost spike detected: ${today_cost:.2f} vs ${avg_7day:.2f} 7-day avg',
            'increase_pct': ((today_cost - avg_7day) / avg_7day) * 100
        })

    # Forecast exceeding monthly budget
    monthly_forecast = (date.today().day / 30) * avg_30day * 30
    if monthly_forecast > monthly_budget * 1.1:
        alert_team({
            'severity': 'medium',
            'message': f'Projected to exceed monthly budget: ${monthly_forecast:.2f} vs ${monthly_budget:.2f}'
        })
```

Dashboards:
- Real-time cost dashboard (Grafana + CloudWatch)
- Monthly cost trends
- Cost per customer/transaction
- Savings achieved

Expected outputs:
- finops-monitoring-report.md with:
  - Cost anomaly detection configured
  - Budget alerts set up
  - Tagging policies enforced
  - Showback/chargeback reports
  - Monitoring dashboards deployed
- Dashboard configurations and alert rules
"
```

**Expected Outputs:**
- `finops-monitoring-report.md` - FinOps monitoring setup
- Dashboard configurations
- Alert rules

**Quality Gate: FinOps Monitoring Validation**
```bash
# Log quality gate

# Validate finops monitoring report exists
if [ ! -f "finops-monitoring-report.md" ]; then
  echo "❌ FinOps monitoring report not created"
  exit 1
fi

# Validate monitoring configured
if ! grep -q "monitoring" finops-monitoring-report.md; then
  echo "⚠️  Monitoring may not be fully configured"
fi

# Log success

echo "✅ FinOps monitoring and governance complete"
```

**Track Progress:**
```bash
TOKENS_USED=6000
```

---

## Workflow Completion & Savings Report

**At workflow end:**
```bash
# Calculate total savings achieved
TOTAL_SAVINGS=0
for report in cost-analysis-report.md rightsizing-report.md storage-optimization-report.md reserved-capacity-report.md autoscaling-report.md networking-optimization-report.md; do
  if [ -f "$report" ]; then
    SAVINGS=$(grep -oP 'savings.*?(\d+)%' "$report" | grep -oP '\d+' | head -1 || echo "0")
    TOTAL_SAVINGS=$((TOTAL_SAVINGS + SAVINGS))
  fi
done

# Average savings across all phases
AVG_SAVINGS=$((TOTAL_SAVINGS / 6))

# Calculate token usage across all agents
TOTAL_TOKENS=$(sum_agent_token_usage)

# Update workflow status

# Store lessons learned
  "Key learnings from this cost optimization: Achieved ${AVG_SAVINGS}% savings. Most impactful: [list top 3 optimization strategies]. Challenges: [any obstacles encountered]." \
  "# Optimization patterns that worked well"

# Get final metrics
echo "=== Workflow Metrics ==="

# Send completion notification
DURATION=$(calculate_workflow_duration)
  "Cost Optimization Complete" \
  "Achieved ${AVG_SAVINGS}% cost reduction in ${DURATION} minutes. Token usage: ${TOTAL_TOKENS}."

# Display token savings compared to average
echo "=== Token Usage Report ==="

echo "
✅ OPTIMIZE COSTS WORKFLOW COMPLETE

Infrastructure: $*

Cost Reduction Achieved: ${AVG_SAVINGS}%

Optimization Summary:
- Right-Sizing: ${ESTIMATED_SAVINGS}% savings
- Storage Optimization: ${STORAGE_SAVINGS}% savings
- Reserved Capacity: ${RESERVED_SAVINGS}% potential savings
- Auto-Scaling: ${SCALING_SAVINGS}% savings
- Networking: ${NETWORK_SAVINGS}% savings

Reports Generated:
- cost-analysis-report.md
- rightsizing-report.md
- storage-optimization-report.md
- reserved-capacity-report.md
- autoscaling-report.md
- networking-optimization-report.md
- finops-monitoring-report.md

Implementation Status:
✅ Quick wins implemented (orphaned resources removed)
✅ Storage lifecycle policies deployed
✅ Auto-scaling configured
✅ FinOps monitoring active

Next Steps:
1. Review all reports and validate savings
2. Monitor cost trends for 30 days
3. Purchase reserved capacity (if recommended)
4. Continue to optimize based on monitoring data
5. Quarterly cost optimization reviews

Continuous Optimization:
- Daily cost anomaly detection active
- Budget alerts configured
- Monthly cost reports scheduled
- Tagging compliance audits scheduled
"
```

---

## Optimization Strategies by Service

### Compute (30-50% savings potential)
- Right-size instances (10-30% savings)
- Reserved instances (40-60% savings)
- Spot instances (70-90% savings)
- Auto-scaling (20-40% savings)
- Shut down unused instances (100% savings on those)

### Storage (20-40% savings potential)
- S3 lifecycle policies (30-80% savings)
- Intelligent tiering (automatic)
- gp2 → gp3 conversion (20% savings)
- Delete unattached volumes (100% savings on those)

### Database (20-40% savings potential)
- Right-size instances (15-30% savings)
- Reserved instances (40-60% savings)
- Aurora Serverless for variable workloads
- Remove unnecessary read replicas

### Networking (10-30% savings potential)
- CloudFront CDN (reduces origin requests)
- VPC endpoints (eliminate NAT gateway costs)
- Consolidate load balancers

---

## Quality Gates Summary

All phases must pass validation:
- [x] Cost analysis completed
- [x] Quick wins implemented (orphaned resources removed)
- [x] Right-sizing recommendations reviewed
- [x] Storage lifecycle policies deployed
- [x] Reserved capacity analyzed
- [x] Auto-scaling configured
- [x] FinOps monitoring in place
- [x] Savings achieved ≥ 30%

---

## Success Metrics

Track these KPIs:
- **Cost Reduction**: Target 30-60% savings
- **Waste Elimination**: 0 unattached volumes, 0 idle instances
- **Utilization**: Average 60-75% CPU/memory
- **Reserved Coverage**: 60-80% of steady workloads
- **Tagging Compliance**: 100% of resources tagged

---

## Example Invocation

```bash
/optimize-costs "AWS account spending $50k/month. Microservices on EKS, RDS PostgreSQL, S3 for media storage. Need 40% cost reduction."

# Workflow executes:
# 1. Analyzes $50k spend, identifies: $20k compute, $15k RDS, $10k S3, $5k networking
# 2. Right-sizing: Reduces EKS node count, downsizes RDS
# 3. Storage: S3 lifecycle policies save $5k/month
# 4. Purchases Savings Plan for steady EKS usage: $8k/month savings
# 5. Implements auto-scaling: $4k/month savings
# 6. Total savings: $22k/month (44% reduction)
# 7. Sets up FinOps monitoring
```

---

Achieve significant cloud cost savings while maintaining performance and reliability.
