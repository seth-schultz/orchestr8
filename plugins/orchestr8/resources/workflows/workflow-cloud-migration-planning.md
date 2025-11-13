---
id: workflow-cloud-migration-planning
category: workflow
tags: [cloud-migration, modernization, azure, aws, gcp, ha-dr, planning, architecture]
capabilities:
  - End-to-end cloud migration planning from on-premises or legacy hosting
  - Multi-cloud architecture design (Azure, AWS, Google Cloud)
  - HA/DR strategy with RPO/RTO targets and failover procedures
  - Good/better/best migration approach recommendations with cost analysis
  - TCO calculations and ROI projections for migration justification
  - Implementation roadmap with phased migration plan
useWhen:
  - Planning cloud migration for legacy monolithic applications or distributed systems to public cloud providers
  - Designing HA/DR strategies for critical systems requiring specific RPO/RTO targets and multi-region deployment
  - Evaluating migration approaches with cost-benefit analysis comparing lift-and-shift, re-architecture, and microservices options
  - Creating comprehensive migration roadmaps with phased execution plans including pilot, core services, and full cutover
estimatedTokens: 480
relatedResources:
  - orchestr8://examples/workflows/cloud-migration-planning-details
  - orchestr8://patterns/session-output-management
---

# Cloud Migration Planning Workflow

**Methodology:** Assess → Design → Strategy → Cost → Plan

**Objective:** Create comprehensive cloud migration plan with architecture design, HA/DR strategy, cost analysis, and implementation roadmap.

## Workflow Overview

```
Phase 1: Initialize & Assess (0-25%)
  → Analyze legacy system, identify drivers

Phase 2: Architecture Design (25-50%)
  → Design target cloud architecture

Phase 3: HA/DR Strategy (50-70%)
  → High availability and disaster recovery

Phase 4: Migration Strategy & Cost (70-90%)
  → Good/better/best approaches, TCO

Phase 5: Implementation Roadmap (90-100%)
  → Phased plan with milestones
```

## Phase 1: Initialize & Legacy Assessment (0-25%)

**Load:**
- `orchestr8://patterns/session-output-management`
- `orchestr8://agents/legacy-system-analyst`

**Activities:**
1. Initialize session with metadata (target cloud, HA/DR required, compliance)
2. Legacy system analysis (discover services, map dependencies, identify bottlenecks)
3. Gather requirements (availability targets, RPO/RTO, compliance, budget, timeline)

**Outputs:**
- `analysis-overview.md`
- `dependencies/service-map.yaml`
- `performance/performance-analysis.yaml`
- `security/security-analysis.yaml`
- `modernization/cloud-readiness-report.yaml`

**Checkpoint:** ✅ Legacy system analyzed, requirements documented

## Phase 2: Cloud Architecture Design (25-50%)

**Load:**
- `orchestr8://agents/cloud-migration-architect`

**Activities:**
1. **Cloud Service Selection**:
   - Compute: App Services, AKS/EKS, VMs, Functions
   - Data: Managed databases, caching, object storage
   - Network: Load balancers, API Gateway, CDN, VPN
   - Security: IAM, Key Vault, WAF, Network security

2. **Architecture Design**:
   - Multi-tier architecture
   - Network topology
   - Security architecture
   - Scaling strategy

3. **Documentation**: High-level diagrams, component specs, network design, data flows

**Outputs:**
- `architecture/target-architecture.yaml`
- `architecture/architecture-diagrams.md` (Mermaid)
- `architecture/service-selection-rationale.md`

**Checkpoint:** ✅ Target cloud architecture designed and documented

## Phase 3: HA/DR Strategy Design (50-70%)

**Activities:**
1. **HA Design** (for availability target, e.g., 99.95%):
   - Multi-zone deployment
   - Load balancing across zones
   - Database replication (synchronous within region)
   - Health checks and auto-healing
   - Auto-scaling policies

2. **DR Strategy Selection**:
   - **Backup/Restore**: RTO 4-24h, RPO 1-24h, Cost ~10%
   - **Pilot Light**: RTO 1-4h, RPO 15min-1h, Cost ~20-30%
   - **Warm Standby**: RTO 15-60min, RPO 5-15min, Cost ~50-70%
   - **Hot/Active-Active**: RTO <5min, RPO near-zero, Cost 100%+

3. **Failover Procedures**: Detection → Decision → Execution → Verification → Failback

4. **Testing Plan**: DR drill schedule, scenarios, success criteria

**Outputs:**
- `modernization/ha-dr-strategy.yaml`
- `modernization/failover-procedures.md`
- `modernization/dr-testing-plan.md`

**Checkpoint:** ✅ HA/DR strategy designed with procedures

## Phase 4: Migration Strategy & Cost Analysis (70-90%)

**Activities:**
1. **Migration Approaches**:
   - **GOOD**: Lift-and-shift (2-3 months, lower initial cost, quick)
   - **BETTER**: Containerize + re-architecture (4-6 months, balanced, recommended)
   - **BEST**: Microservices (8-12 months, higher initial, lowest long-term)

2. **Cost Analysis**:
   - Current on-premises costs (infrastructure, datacenter, personnel)
   - Cloud costs per approach (compute, storage, network, security, ops)
   - Migration costs (services, refactoring, training)
   - 3-year TCO and break-even analysis

3. **Risk Assessment**: Technical, schedule, cost, organizational risks with mitigations

4. **Recommendation**: Based on requirements, costs, and risks (typically "Better")

**Outputs:**
- `modernization/migration-strategies.yaml`
- `modernization/cost-analysis.yaml`
- `modernization/risk-assessment.md`
- `modernization/recommendation.md`

**Checkpoint:** ✅ Strategies evaluated, costs calculated, recommendation provided

## Phase 5: Implementation Roadmap (90-100%)

**Activities:**
1. **Service Prioritization**: By dependencies, risk, business value, complexity

2. **Phased Plan**:
   - **Phase 0**: Pilot (1-2 weeks) - Single non-critical service
   - **Phase 1**: Foundation (3-4 weeks) - Infrastructure, networking, security, CI/CD
   - **Phase 2**: Core Services (6-8 weeks) - Business-critical applications
   - **Phase 3**: Remaining (4-6 weeks) - Secondary services
   - **Phase 4**: Cutover (2-4 weeks) - Final migration, optimization

3. **Milestones**: Entry criteria, activities, deliverables, exit criteria per phase

4. **Resources**: Team composition, skills, training, external support

**Outputs:**
- `modernization/implementation-roadmap.yaml`
- `modernization/service-migration-order.md`
- `modernization/milestones-and-deliverables.md`
- `modernization/resource-plan.md`

**Checkpoint:** ✅ Implementation roadmap complete

## Final Phase: Summary Report

**Generate:**
- `executive-summary.md` - High-level overview for stakeholders
- `complete-migration-plan.md` - Comprehensive technical document
- `presentation-deck.md` - Slide-ready content

**User Communication:**
```
✅ Cloud Migration Planning Complete!

📂 Session: ${sessionDir}

📋 Executive Summary:
   - Current: ${serviceCount} services, ${framework}
   - Target: ${targetCloud} with ${computePlatform}
   - Approach: ${recommendedApproach}
   - Timeline: ${timelineEstimate}
   - TCO Savings: ${tcoSavings} over 3 years

📄 Key Deliverables:
   ✅ Target architecture
   ✅ HA/DR strategy (RTO: ${rto}, RPO: ${rpo})
   ✅ Migration approaches comparison
   ✅ Cost analysis with 3-year TCO
   ✅ Phased implementation roadmap

💡 Next Steps:
   1. Review executive-summary.md
   2. Present to stakeholders
   3. Select migration approach
   4. Begin Phase 0 (Pilot)
```

## Integration with Other Workflows

**Combine with Microservices Transformation:**
```
orchestr8://workflows/workflow-microservices-transformation
```

For "Best" approach, adds domain-driven design, service boundaries, and data decomposition.

**Combine with Security Audit:**
```
orchestr8://workflows/workflow-security-audit
```

For compliance-heavy migrations (HIPAA, SOC2, PCI-DSS).

## Best Practices

### Do's ✅
- Session isolation (all outputs in session directory)
- Comprehensive legacy assessment
- Realistic timelines with buffers
- Multiple migration options (good/better/best)
- Transparent cost analysis (all costs, including hidden)
- Risk assessment with mitigations
- Phased approach with pilot
- Complete documentation (executive + technical)

### Don'ts ❌
- Don't over-architect ("Better" is often best choice)
- Don't skip pilot (validate approach first)
- Don't ignore costs (cloud costs can surprise)
- Don't forget compliance (address from start)

## Detailed Templates

See complete templates for:
- Migration approach comparison (lift-and-shift vs re-architecture vs microservices)
- HA/DR strategy details with RPO/RTO calculations
- Phased roadmap with entry/exit criteria
- Cloud service selection matrices
- Cost analysis and TCO calculations
- Risk assessment frameworks

```
orchestr8://examples/workflows/cloud-migration-planning-details
```

## Success Criteria

✅ Legacy system analyzed (structure, dependencies, performance, security)
✅ Target architecture designed (all components, diagrams)
✅ HA/DR strategy complete (design, procedures, testing plan)
✅ Migration strategies compared (good/better/best with costs)
✅ TCO calculated with ROI projections
✅ Implementation roadmap ready (phased plan, milestones, resources)
✅ Documentation package complete (executive summary + technical details)
