---
id: workflow-microservices-transformation
category: workflow
tags: [microservices, transformation, decomposition, domain-driven-design, monolith, modernization]
capabilities:
  - Monolith to microservices decomposition analysis
  - Domain-driven design boundary identification
  - Service boundary recommendations with bounded contexts
  - Data decomposition strategy and database per service pattern
  - Migration approach selection (strangler fig, parallel run, big bang)
  - Good/better/best transformation paths with phased execution
useWhen:
  - Decomposing monolithic applications into microservices architecture with domain-driven design principles
  - Analyzing service boundaries for existing distributed systems requiring better separation of concerns
  - Planning microservices transformation with data decomposition strategy and database migration approach
  - Evaluating transformation approaches comparing strangler fig pattern, parallel run, and big bang cutover strategies
estimatedTokens: 520
relatedResources:
  - orchestr8://examples/workflows/microservices-transformation-roadmap
  - orchestr8://patterns/session-output-management
---

# Microservices Transformation Workflow

**Methodology:** Analyze → Decompose → Design → Strategy → Plan

**Objective:** Transform monolithic or tightly-coupled systems into microservices architecture with clear service boundaries, data decomposition, and phased migration plan.

## Workflow Overview

```
Phase 1: Monolith Analysis (0-25%)
  → Understand structure, dependencies, complexity

Phase 2: Service Boundary Identification (25-50%)
  → Apply DDD, identify bounded contexts, recommend services

Phase 3: Data Decomposition Strategy (50-70%)
  → Database per service, shared data handling, migration plan

Phase 4: Transformation Approach (70-90%)
  → Good/better/best approaches, strangler fig pattern

Phase 5: Implementation Roadmap (90-100%)
  → Phased plan, service priorities, infrastructure needs
```

## Phase 1: Monolith Analysis (0-25%)

**Load:**
- `orchestr8://patterns/session-output-management`
- `orchestr8://agents/legacy-system-analyst`
- `orchestr8://agents/knowledge-base-agent`

**Activities:**
1. Initialize session with metadata
2. Map codebase structure (layers, modules, components)
3. Deep dependency analysis (module-to-module, class-level coupling)
4. Complexity assessment (cyclomatic complexity, tech debt, coverage)

**Outputs:**
- `analysis/monolith-structure.yaml`
- `analysis/dependency-analysis.yaml`
- `analysis/complexity-assessment.md`

**Checkpoint:** ✅ Monolith fully analyzed, dependencies mapped

## Phase 2: Service Boundary Identification (25-50%)

**Load:**
- `orchestr8://skills/match?query=domain-driven+design+bounded+context`

**Activities:**
1. **Domain Discovery**: Identify business capabilities and subdomains
2. **Bounded Context Mapping**: Define ubiquitous language, domain models, boundaries
3. **Service Extraction Candidates**: Evaluate each context for:
   - Clear business capability
   - Minimal dependencies
   - Independent data model
   - Could scale independently
4. **Service Boundary Recommendations**: Define name, responsibility, scope, API contracts

**Outputs:**
- `architecture/domain-model.yaml`
- `architecture/service-boundaries.yaml`
- `architecture/context-map.md` (Mermaid diagrams)
- `architecture/service-api-contracts.yaml`

**Checkpoint:** ✅ Service boundaries identified with DDD

## Phase 3: Data Decomposition Strategy (50-70%)

**Activities:**
1. **Data Model Analysis**: Map tables to domains, find shared tables, identify foreign keys
2. **Database Ownership Assignment**: Assign tables to services
3. **Data Decomposition Patterns**:
   - Database per Service
   - Shared Reference Data (replicate, service, or cache)
   - Strategic Duplication (with event-driven sync)
   - Saga Pattern (distributed transactions)
4. **Data Migration Strategy**:
   - Phase 1: Dual-write (both DBs)
   - Phase 2: Switch reads (new DB)
   - Phase 3: Remove monolith writes

**Outputs:**
- `architecture/data-decomposition.yaml`
- `architecture/data-patterns.md`
- `architecture/data-migration-strategy.yaml`
- `architecture/shared-data-strategy.md`

**Checkpoint:** ✅ Data decomposition strategy defined with migration plan

## Phase 4: Transformation Approach (70-90%)

**Activities:**
1. **Transformation Approaches**:
   - **GOOD**: Strangler Fig (6-12 months, low risk, incremental)
   - **BETTER**: Parallel (8-14 months, moderate risk, clean break)
   - **BEST**: Rewrite (10-18 months, high risk, greenfield)

2. **Strangler Fig Pattern** (Recommended):
   - Phase 1: API Gateway Introduction
   - Phase 2: Extract First Service (Pilot)
   - Phase 3: Extract Core Services
   - Phase 4: Extract Remaining Services

3. **Inter-Service Communication**:
   - Synchronous: REST/gRPC for queries
   - Asynchronous: Events/queues for updates
   - Hybrid: Recommended approach

4. **Cross-Cutting Concerns**:
   - API Gateway (routing, rate limiting, auth)
   - Service Mesh (optional: mTLS, observability)
   - Centralized Logging (structured logs, correlation IDs)
   - Distributed Tracing (request tracing, profiling)

**Outputs:**
- `modernization/transformation-approaches.yaml`
- `modernization/strangler-fig-plan.yaml`
- `modernization/communication-patterns.md`
- `modernization/cross-cutting-concerns.md`

**Checkpoint:** ✅ Transformation approach selected with communication patterns

## Phase 5: Implementation Roadmap (90-100%)

**Activities:**
1. **Service Extraction Order**:
   - Priority 1: Foundation (auth, gateway, monitoring)
   - Priority 2: Pilot (low-risk service)
   - Priority 3: Core Business (user, product, order)
   - Priority 4: Dependent (payment, inventory, shipping)
   - Priority 5: Remaining (admin, analytics)

2. **Phased Roadmap**:
   - Phase 0: Foundation & Pilot (8 weeks)
   - Phase 1: Core Services (12 weeks)
   - Phase 2: Dependent Services (10 weeks)
   - Phase 3: Remaining & Decommission (6 weeks)

3. **Infrastructure**: Kubernetes, message queue, Redis, monitoring, CI/CD

4. **Team Organization**: Platform team, service teams per domain, architecture review board

**Outputs:**
- `modernization/implementation-roadmap.yaml`
- `modernization/service-extraction-order.md`
- `modernization/infrastructure-requirements.md`
- `modernization/team-organization.md`

**Checkpoint:** ✅ Implementation roadmap complete with timeline and resources

## Final Phase: Summary Report

**Generate:**
- `executive-summary.md` - High-level overview
- `transformation-playbook.md` - Complete transformation guide

## Integration with Other Workflows

**Combine with Cloud Migration:**
```
orchestr8://workflows/workflow-cloud-migration-planning
```

This provides cloud infrastructure design + microservices architecture for complete modernization.

## Best Practices

### Do's ✅
- Start with domain-driven design
- Use strangler fig pattern (incremental, low-risk)
- Database per service (true autonomy)
- API-first design
- Event-driven where appropriate
- Observability from day one
- Pilot before scale
- Team autonomy

### Don'ts ❌
- Don't create micro-microservices (too granular)
- Don't skip data migration planning
- Don't big-bang cutover
- Don't ignore operational complexity

## Detailed Roadmap Template

See complete roadmap template with:
- Good/better/best approach details
- Strangler fig phase-by-phase plan
- Service extraction priorities
- Infrastructure requirements
- Team organization
- Communication patterns

```
orchestr8://examples/workflows/microservices-transformation-roadmap
```

## Success Criteria

✅ Monolith analyzed (structure, dependencies, complexity)
✅ Service boundaries defined (domains, contexts, APIs)
✅ Data strategy complete (ownership, patterns, migration)
✅ Transformation approach selected (strangler fig recommended)
✅ Implementation roadmap ready (phased plan, priorities, infrastructure)
✅ Documentation complete (executive + technical)
