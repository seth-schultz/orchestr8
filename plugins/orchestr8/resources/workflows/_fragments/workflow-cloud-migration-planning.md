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
estimatedTokens: 800
---

# Cloud Migration Planning Workflow

**Methodology:** Assess → Design → Strategy → Cost → Plan

**Objective:** Create comprehensive cloud migration plan with architecture design, HA/DR strategy, cost analysis, and implementation roadmap.

## Workflow Overview

```
Phase 1: Initialize & Assess (0-25%)
  ↓
Phase 2: Architecture Design (25-50%)
  ↓
Phase 3: HA/DR Strategy (50-70%)
  ↓
Phase 4: Migration Strategy & Cost (70-90%)
  ↓
Phase 5: Implementation Roadmap (90-100%)
```

## Phase 1: Initialize & Legacy Assessment (0-25%)

**Goals:**
- Initialize session output management
- Analyze current legacy system state
- Identify migration drivers and constraints

**→ Load Patterns:**
```
orchestr8://patterns/_fragments/session-output-management
```

**→ Load Agents:**
```
orchestr8://agents/_fragments/legacy-system-analyst
```

**Activities:**

1. **Initialize Session**
   ```typescript
   const sessionDir = await initSession({
     workflowType: 'cloud-migration-planning',
     analyzedCodebase: userProvidedPath,
     metadata: {
       targetCloud: 'Azure', // or AWS, GCP
       hadrRequired: true,
       complianceRequirements: ['HIPAA', 'SOC2']
     }
   })
   ```

2. **Legacy System Analysis**
   ```markdown
   Using Legacy System Analyst:
   - Discover all solutions, projects, and services
   - Map dependencies (services, databases, queues, external APIs)
   - Flag performance bottlenecks
   - Identify security vulnerabilities
   - Assess cloud migration readiness
   ```

3. **Gather Requirements**
   ```markdown
   From user or inferred from analysis:
   - Availability targets (99.9%, 99.95%, 99.99%)
   - RPO/RTO requirements
   - Compliance needs (HIPAA, SOC2, PCI-DSS, GDPR)
   - Budget constraints
   - Timeline expectations
   - Geographic distribution needs
   ```

**Outputs:**
- `analysis-overview.md` - Executive summary
- `dependencies/service-map.yaml` - Complete service dependency map
- `performance/performance-analysis.yaml` - Bottlenecks and issues
- `security/security-analysis.yaml` - Vulnerabilities and gaps
- `modernization/cloud-readiness-report.yaml` - Migration readiness

**Checkpoint:** ✅ Legacy system fully analyzed, requirements documented

---

## Phase 2: Cloud Architecture Design (25-50%)

**Goals:**
- Design target cloud architecture
- Select cloud services (compute, data, network, security)
- Define infrastructure components

**→ Load Agents:**
```
orchestr8://agents/_fragments/cloud-migration-architect
```

**→ Load Skills:**
```
orchestr8://skills/match?query=cloud+architecture+design+azure+aws
```

**Activities:**

1. **Cloud Provider & Services Selection**
   ```markdown
   Based on requirements and current state:
   
   Compute:
   - Azure: App Services, AKS, VMs, Functions
   - AWS: Elastic Beanstalk, EKS, EC2, Lambda
   - GCP: Cloud Run, GKE, Compute Engine, Cloud Functions
   
   Data:
   - Databases (managed SQL, NoSQL)
   - Caching (Redis, Memcached)
   - Object storage (Blob, S3, Cloud Storage)
   
   Network:
   - Load balancers
   - API Gateway
   - CDN
   - VPN/Private connectivity
   
   Security:
   - IAM/RBAC
   - Key Vault/Secrets Manager
   - WAF
   - Network security groups
   ```

2. **Architecture Design**
   ```typescript
   Using Cloud Migration Architect:
   - Design multi-tier architecture
   - Select appropriate cloud services
   - Plan network topology
   - Design security architecture
   - Define scaling strategy
   ```

3. **Architecture Documentation**
   ```markdown
   Generate:
   - High-level architecture diagram
   - Component specifications
   - Network diagram
   - Security architecture
   - Data flow diagrams
   ```

**Outputs:**
- `architecture/target-architecture.yaml` - Detailed architecture specification
- `architecture/architecture-diagrams.md` - Visual representations (Mermaid)
- `architecture/service-selection-rationale.md` - Why specific services chosen

**Checkpoint:** ✅ Target cloud architecture designed and documented

---

## Phase 3: HA/DR Strategy Design (50-70%)

**Goals:**
- Design high availability strategy
- Design disaster recovery plan
- Define failover procedures

**→ Continue with Cloud Migration Architect**

**Activities:**

1. **HA Design**
   ```markdown
   Design for availability target (e.g., 99.95%):
   - Multi-zone deployment within region
   - Load balancing across zones
   - Database replication (synchronous within region)
   - Health checks and auto-healing
   - Circuit breakers and retry policies
   - Auto-scaling policies
   ```

2. **DR Strategy Selection**
   ```markdown
   Based on RPO/RTO requirements:
   
   Backup/Restore:
   - RTO: 4-24 hours, RPO: 1-24 hours
   - Cost: ~10% of primary
   - Use case: Non-critical systems
   
   Pilot Light:
   - RTO: 1-4 hours, RPO: 15 min - 1 hour
   - Cost: ~20-30% of primary
   - Use case: Moderate criticality
   
   Warm Standby:
   - RTO: 15-60 minutes, RPO: 5-15 minutes
   - Cost: ~50-70% of primary
   - Use case: Business-critical systems
   
   Hot Standby/Active-Active:
   - RTO: < 5 minutes, RPO: Near-zero
   - Cost: 100%+ of primary
   - Use case: Mission-critical systems
   ```

3. **Failover Procedures**
   ```markdown
   Define step-by-step:
   1. Detection (automated health checks)
   2. Decision (automatic vs manual trigger)
   3. Execution (scale DR, promote database, switch traffic)
   4. Verification (smoke tests)
   5. Communication (stakeholder notification)
   6. Failback (return to primary when recovered)
   ```

4. **Testing Plan**
   ```markdown
   - DR drill schedule (quarterly recommended)
   - Test scenarios
   - Success criteria (RTO/RPO met)
   - Rollback procedures
   ```

**Outputs:**
- `modernization/ha-dr-strategy.yaml` - Complete HA/DR design
- `modernization/failover-procedures.md` - Step-by-step runbook
- `modernization/dr-testing-plan.md` - Drill schedule and procedures

**Checkpoint:** ✅ HA/DR strategy designed with procedures and testing plan

---

## Phase 4: Migration Strategy & Cost Analysis (70-90%)

**Goals:**
- Define good/better/best migration approaches
- Calculate TCO and ROI
- Recommend optimal approach

**→ Continue with Cloud Migration Architect**

**Activities:**

1. **Migration Approaches**
   ```markdown
   Design three tiers:
   
   GOOD (Minimum Viable):
   - Approach: Lift-and-shift with minimal changes
   - Timeline: 2-3 months
   - Cost: Lower initial, higher operational
   - Use case: Quick datacenter exit
   
   BETTER (Recommended):
   - Approach: Containerize and re-architecture
   - Timeline: 4-6 months
   - Cost: Balanced
   - Use case: Most enterprises
   
   BEST (Future-Proof):
   - Approach: Full microservices transformation
   - Timeline: 8-12 months
   - Cost: Higher initial, lower long-term
   - Use case: Strategic transformation
   ```

2. **Cost Analysis**
   ```markdown
   Calculate for each approach:
   
   Current State (On-Premises):
   - Infrastructure costs
   - Datacenter costs
   - Personnel costs
   - Maintenance costs
   
   Cloud Costs (per approach):
   - Compute costs
   - Storage costs
   - Networking costs
   - Security costs
   - Operations costs
   
   Migration Costs (one-time):
   - Professional services
   - Refactoring effort
   - Training
   - Testing
   
   TCO (3-year):
   - Total cost comparison
   - Break-even analysis
   - ROI calculation
   ```

3. **Risk Assessment**
   ```markdown
   For each approach:
   - Technical risks
   - Schedule risks
   - Cost overrun risks
   - Organizational risks
   - Mitigation strategies
   ```

4. **Recommendation**
   ```markdown
   Provide recommendation with rationale:
   - Recommended approach (typically "Better")
   - Justification based on requirements, costs, risks
   - Key decision factors
   - Alternative considerations
   ```

**Outputs:**
- `modernization/migration-strategies.yaml` - Good/better/best approaches
- `modernization/cost-analysis.yaml` - Detailed cost breakdown and TCO
- `modernization/risk-assessment.md` - Risks and mitigations
- `modernization/recommendation.md` - Final recommendation with rationale

**Checkpoint:** ✅ Migration strategies evaluated, costs calculated, recommendation provided

---

## Phase 5: Implementation Roadmap (90-100%)

**Goals:**
- Create phased implementation plan
- Define service migration order
- Establish milestones and deliverables

**→ Continue with Cloud Migration Architect**

**Activities:**

1. **Service Prioritization**
   ```markdown
   Order services by:
   - Dependencies (foundation services first)
   - Risk (pilot with low-risk service)
   - Business value (core services prioritized)
   - Complexity (simple first for learning)
   ```

2. **Phased Plan**
   ```markdown
   Define phases:
   
   Phase 0: Pilot (1-2 weeks)
   - Single non-critical service
   - Establish patterns and processes
   - Validate tooling and approach
   
   Phase 1: Foundation (3-4 weeks)
   - Cloud infrastructure setup
   - Networking and security configuration
   - CI/CD pipeline establishment
   - Monitoring and logging setup
   - Authentication/authorization services
   
   Phase 2: Core Services (6-8 weeks)
   - Business-critical services
   - Database migration
   - Integration testing
   - Performance validation
   
   Phase 3: Remaining Services (4-6 weeks)
   - Secondary services
   - Background jobs
   - Reporting services
   
   Phase 4: Cutover & Optimization (2-4 weeks)
   - Final cutover from on-premises
   - Decommission old infrastructure
   - Optimization and tuning
   - Post-migration validation
   ```

3. **Milestones & Deliverables**
   ```markdown
   Per phase:
   - Entry criteria
   - Activities
   - Deliverables
   - Exit criteria
   - Go/no-go decision points
   ```

4. **Resource Planning**
   ```markdown
   - Team composition
   - Skills needed
   - Training requirements
   - External support (if needed)
   ```

**Outputs:**
- `modernization/implementation-roadmap.yaml` - Complete phased plan
- `modernization/service-migration-order.md` - Prioritized service list
- `modernization/milestones-and-deliverables.md` - Phase definitions
- `modernization/resource-plan.md` - Team and skills requirements

**Checkpoint:** ✅ Implementation roadmap complete with clear phases and milestones

---

## Final Phase: Summary Report (95-100%)

**Goal:** Generate executive summary and complete documentation package

**Activities:**

1. **Executive Summary**
   ```markdown
   Generate high-level summary:
   - Current state assessment
   - Target architecture overview
   - Recommended approach
   - Key benefits
   - Timeline and cost summary
   - Next steps
   ```

2. **Documentation Package**
   ```markdown
   Organize all outputs:
   - Executive summary (1-2 pages)
   - Technical architecture (detailed)
   - Cost analysis (with comparisons)
   - Implementation roadmap
   - All supporting analysis
   ```

3. **User Communication**
   ```markdown
   Inform user of completion:
   - Session directory location
   - Key files to review
   - Recommended next actions
   - Stakeholder presentation materials
   ```

**Outputs:**
- `executive-summary.md` - High-level overview for stakeholders
- `complete-migration-plan.md` - Comprehensive document
- `presentation-deck.md` - Slide-ready content

---

## Success Criteria

✅ **Analysis Complete:**
- Legacy system fully analyzed
- Dependencies mapped
- Performance and security assessed
- Cloud readiness evaluated

✅ **Architecture Designed:**
- Target cloud architecture documented
- All components specified
- Network and security designed
- Diagrams generated

✅ **HA/DR Strategy:**
- Availability strategy designed
- DR plan created
- Failover procedures documented
- Testing plan established

✅ **Migration Strategy:**
- Good/better/best approaches defined
- TCO calculated
- Risks assessed
- Recommendation provided

✅ **Implementation Plan:**
- Phased roadmap created
- Service migration order determined
- Milestones defined
- Resources identified

✅ **Documentation:**
- All outputs in session directory
- Executive summary generated
- Presentation materials ready
- User informed of completion

---

## User Communication Template

### Workflow Start

```
🚀 Starting Cloud Migration Planning workflow...

📁 Session: ${sessionDir}
🔍 Analyzing: ${analyzedCodebase}
☁️  Target Cloud: ${targetCloud}
🎯 HA/DR Required: ${hadrRequired ? 'Yes' : 'No'}

Phase 1: Legacy System Assessment...
```

### Phase Completion

```
✅ Phase 1: Legacy System Assessment Complete

Discovered:
- ${serviceCount} services
- ${databaseCount} databases
- ${externalAPICount} external integrations

Key Findings:
- Cloud Readiness: ${readinessScore}%
- Critical Issues: ${criticalCount}
- Performance Flags: ${perfFlagCount}

📄 Outputs:
   - dependencies/service-map.yaml
   - performance/performance-analysis.yaml
   - security/security-analysis.yaml

Phase 2: Cloud Architecture Design...
```

### Workflow Completion

```
✅ Cloud Migration Planning Complete!

📂 Session: ${sessionDir}

📋 Executive Summary:
   - Current System: ${serviceCount} services, ${framework}
   - Target: ${targetCloud} with ${computePlatform}
   - Recommended Approach: ${recommendedApproach}
   - Timeline: ${timelineEstimate}
   - TCO Savings: ${tcoSavings} over 3 years

📄 Key Deliverables:
   ✅ Target architecture design
   ✅ HA/DR strategy (RTO: ${rto}, RPO: ${rpo})
   ✅ Good/better/best migration approaches
   ✅ Cost analysis with TCO
   ✅ Implementation roadmap

📂 All outputs in: ${sessionDir}

💡 Next Steps:
   1. Review executive-summary.md
   2. Present findings to stakeholders
   3. Select migration approach
   4. Begin Phase 0 (Pilot) planning
```

---

## Integration with Other Workflows

### Combine with Microservices Transformation

```markdown
If "Best" approach selected:
→ Launch Microservices Transformation Workflow
`orchestr8://workflows/_fragments/workflow-microservices-transformation`

This will add:
- Domain-driven design analysis
- Service boundary recommendations
- Data decomposition strategy
- Event-driven architecture design
```

### Combine with Security Audit

```markdown
For compliance-heavy migrations:
→ Launch Security Audit Workflow
`orchestr8://workflows/_fragments/workflow-security-audit`

This will provide:
- OWASP Top 10 assessment
- Compliance gap analysis (HIPAA, SOC2, etc.)
- Security architecture recommendations
```

---

## Best Practices

✅ **Session isolation** - All outputs in session directory
✅ **Comprehensive analysis** - Don't skip legacy assessment
✅ **Realistic timelines** - Account for learning curves
✅ **Multiple options** - Always provide good/better/best
✅ **Cost transparency** - Show all costs, including hidden ones
✅ **Risk assessment** - Identify and mitigate risks upfront
✅ **Phased approach** - Pilot before full migration
✅ **Documentation** - Executive and technical docs

❌ **Don't over-architect** - "Better" is often best choice
❌ **Don't skip pilot** - Always validate approach first
❌ **Don't ignore costs** - Cloud costs can surprise
❌ **Don't forget compliance** - Address requirements from start
