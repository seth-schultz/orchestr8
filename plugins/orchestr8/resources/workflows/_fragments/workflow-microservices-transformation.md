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
estimatedTokens: 750
---

# Microservices Transformation Workflow

**Methodology:** Analyze → Decompose → Design → Strategy → Plan

**Objective:** Transform monolithic or tightly-coupled systems into microservices architecture with clear service boundaries, data decomposition, and phased migration plan.

## Workflow Overview

```
Phase 1: Monolith Analysis (0-25%)
  ↓
Phase 2: Service Boundary Identification (25-50%)
  ↓
Phase 3: Data Decomposition Strategy (50-70%)
  ↓
Phase 4: Transformation Approach (70-90%)
  ↓
Phase 5: Implementation Roadmap (90-100%)
```

## Phase 1: Monolith Analysis (0-25%)

**Goals:**
- Understand current monolith structure
- Identify coupling and cohesion patterns
- Map dependencies and data flows

**→ Load Patterns:**
```
orchestr8://patterns/_fragments/session-output-management
```

**→ Load Agents:**
```
orchestr8://agents/_fragments/legacy-system-analyst
orchestr8://agents/_fragments/knowledge-base-agent
```

**Activities:**

1. **Initialize Session**
   ```typescript
   const sessionDir = await initSession({
     workflowType: 'microservices-transformation',
     analyzedCodebase: userProvidedPath,
     metadata: {
       monolithType: 'layered', // or modular, big-ball-of-mud
       targetArchitecture: 'microservices',
       approachPreference: 'strangler-fig' // or parallel, big-bang
     }
   })
   ```

2. **Codebase Structure Analysis**
   ```markdown
   Using Legacy System Analyst + Knowledge Base Agent:
   - Map current architecture (layers, modules, components)
   - Identify code organization patterns
   - Analyze project/package structure
   - Document existing boundaries (if any)
   ```

3. **Dependency Analysis**
   ```markdown
   Deep dependency mapping:
   - Module-to-module dependencies
   - Class-level coupling analysis
   - Database table usage per module
   - Shared code identification
   - Cross-cutting concerns (logging, auth, etc.)
   ```

4. **Complexity Assessment**
   ```markdown
   Evaluate:
   - Cyclomatic complexity per module
   - Code duplication
   - Technical debt hotspots
   - Testing coverage
   - Deployment coupling
   ```

**Outputs:**
- `analysis/monolith-structure.yaml` - Current architecture
- `analysis/dependency-analysis.yaml` - Module dependencies
- `analysis/complexity-assessment.md` - Technical debt and complexity
- `analysis/coupling-cohesion-report.md` - Coupling analysis

**Checkpoint:** ✅ Monolith fully analyzed, dependencies mapped

---

## Phase 2: Service Boundary Identification (25-50%)

**Goals:**
- Apply domain-driven design principles
- Identify bounded contexts
- Recommend service boundaries

**→ Load Skills:**
```
orchestr8://skills/match?query=domain-driven+design+bounded+context
orchestr8://skills/match?query=service+decomposition+patterns
```

**Activities:**

1. **Domain Discovery**
   ```markdown
   Identify business domains:
   - What are the core business capabilities?
   - What are the subdomains?
   - What are the bounded contexts?
   
   Example domains:
   - User Management
   - Product Catalog
   - Order Processing
   - Payment Processing
   - Inventory Management
   - Shipping & Fulfillment
   - Customer Support
   ```

2. **Bounded Context Mapping**
   ```markdown
   For each domain:
   - Define ubiquitous language
   - Identify domain models
   - Map context boundaries
   - Define context relationships (upstream/downstream)
   ```

3. **Service Extraction Candidates**
   ```markdown
   Evaluate each bounded context for:
   
   Good service candidates:
   ✅ Clear business capability
   ✅ Bounded context identified
   ✅ Minimal dependencies
   ✅ Independent data model
   ✅ Could scale independently
   ✅ Different change frequency than monolith
   
   Poor service candidates:
   ❌ Highly coupled to other modules
   ❌ Shares database tables extensively
   ❌ No clear business boundary
   ❌ Too small (micro-microservices)
   ❌ Changes require coordinated deployments
   ```

4. **Service Boundary Recommendations**
   ```markdown
   Recommend microservices with:
   - Service name and responsibility
   - Business capability scope
   - Bounded context definition
   - Key domain models
   - API contracts (inputs/outputs)
   - Dependencies on other services
   - Database ownership
   ```

**Outputs:**
- `architecture/domain-model.yaml` - Identified domains and bounded contexts
- `architecture/service-boundaries.yaml` - Recommended microservices
- `architecture/context-map.md` - Domain relationships (Mermaid)
- `architecture/service-api-contracts.yaml` - Service interfaces

**Checkpoint:** ✅ Service boundaries identified with domain-driven design

---

## Phase 3: Data Decomposition Strategy (50-70%)

**Goals:**
- Plan database per service migration
- Design data decomposition approach
- Handle shared data and referential integrity

**→ Load Patterns:**
```
orchestr8://patterns/match?query=database+per+service+data+decomposition
```

**Activities:**

1. **Current Data Model Analysis**
   ```markdown
   Analyze monolith database:
   - Identify all tables
   - Map table ownership to domains
   - Find shared tables
   - Identify foreign key relationships
   - Detect data coupling hotspots
   ```

2. **Database Ownership Assignment**
   ```markdown
   Assign tables to services:
   
   Clear ownership:
   - Users table → User Service
   - Products table → Product Service
   - Orders table → Order Service
   
   Shared data challenges:
   - Reference data (countries, categories)
   - User identity (referenced by many services)
   - Aggregate data (reporting across services)
   ```

3. **Data Decomposition Patterns**
   ```markdown
   Apply patterns:
   
   Database per Service:
   - Each service owns its database
   - No direct database access across services
   - Services expose APIs for data access
   
   Shared Reference Data:
   - Option 1: Replicate in each service (eventual consistency)
   - Option 2: Reference data service
   - Option 3: Cache shared reference data
   
   Data Duplication:
   - Strategic duplication for autonomy
   - Example: Order Service stores user email (copy)
   - Sync via events when source changes
   
   Saga Pattern:
   - Distributed transactions across services
   - Choreography or orchestration
   - Compensation for failures
   ```

4. **Data Migration Strategy**
   ```markdown
   Phased data migration:
   
   Phase 1: Dual-write pattern
   - Write to both monolith DB and new service DB
   - Read from monolith DB (existing behavior)
   - Validate data consistency
   
   Phase 2: Switch reads
   - Read from new service DB
   - Keep dual-write for safety
   - Monitor for issues
   
   Phase 3: Remove monolith writes
   - Stop writing to monolith DB
   - Service owns data completely
   - Archive or delete monolith data
   ```

**Outputs:**
- `architecture/data-decomposition.yaml` - Table-to-service mapping
- `architecture/data-patterns.md` - Patterns applied (replication, saga, etc.)
- `architecture/data-migration-strategy.yaml` - Phased migration approach
- `architecture/shared-data-strategy.md` - Handling shared data

**Checkpoint:** ✅ Data decomposition strategy defined with migration plan

---

## Phase 4: Transformation Approach (70-90%)

**Goals:**
- Define good/better/best transformation approaches
- Select migration pattern (strangler fig, parallel, big bang)
- Assess risks and timelines

**→ Load Cloud Migration Architect (for infrastructure planning)**

**Activities:**

1. **Transformation Approaches**
   ```markdown
   Design three tiers:
   
   GOOD (Gradual Extraction):
   - Approach: Extract one service at a time (Strangler Fig)
   - Pattern: Monolith remains, services extracted gradually
   - Timeline: 6-12 months
   - Risk: Low (incremental, reversible)
   - Complexity: Moderate (maintain both systems)
   
   Pros:
   + Low risk, incremental value
   + Learn and adjust as you go
   + No big-bang cutover
   + Monolith shrinks over time
   
   Cons:
   - Longer timeline
   - Maintain both architectures
   - Data migration complexity
   - Potential for tech debt in transition state
   
   BETTER (Parallel Implementation):
   - Approach: Build new microservices, run parallel, cutover
   - Pattern: New system built alongside old
   - Timeline: 8-14 months
   - Risk: Moderate (parallel systems, larger cutover)
   - Complexity: High (two systems running)
   
   Pros:
   + Clean break from monolith
   + Can redesign without constraints
   + Controlled cutover
   + Fallback to monolith if needed
   
   Cons:
   - Higher cost (running both)
   - Data synchronization complexity
   - Larger cutover event
   - Potential for drift
   
   BEST (Complete Rewrite):
   - Approach: Build microservices from scratch, big-bang cutover
   - Pattern: Greenfield microservices system
   - Timeline: 10-18 months
   - Risk: High (all-at-once cutover)
   - Complexity: Very high (entire system)
   
   Pros:
   + Clean architecture, no baggage
   + Modern tech stack throughout
   + Optimal service boundaries
   + No migration complexity during build
   
   Cons:
   - Longest timeline
   - Highest risk (big-bang)
   - Business feature parity needed
   - Potential to miss requirements
   ```

2. **Strangler Fig Pattern (Recommended for Most)**
   ```markdown
   Phased extraction strategy:
   
   Phase 1: API Gateway Introduction
   - Add API Gateway in front of monolith
   - All requests route through gateway
   - No functional changes yet
   
   Phase 2: Extract First Service (Pilot)
   - Choose low-risk, low-dependency service
   - Build as microservice
   - Route specific requests to new service
   - Monolith handles rest
   
   Phase 3: Extract Core Services
   - User Management
   - Product Catalog
   - Order Processing
   - Each extraction:
     1. Build service
     2. Migrate data
     3. Update gateway routing
     4. Decommission from monolith
   
   Phase 4: Extract Remaining Services
   - Continue until monolith is empty
   - Eventually decommission monolith
   ```

3. **Inter-Service Communication**
   ```markdown
   Design communication patterns:
   
   Synchronous (REST, gRPC):
   - Use for: Read queries, immediate responses
   - Pattern: Service A calls Service B directly
   - Pros: Simple, immediate consistency
   - Cons: Coupling, cascading failures
   
   Asynchronous (Events, Message Queues):
   - Use for: Updates, eventual consistency OK
   - Pattern: Service A publishes event, Service B subscribes
   - Pros: Loose coupling, resilience
   - Cons: Eventual consistency, complexity
   
   Hybrid:
   - Synchronous for queries
   - Asynchronous for commands/updates
   - Example: Order Service queries Product Service (sync),
             publishes OrderCreated event (async)
   ```

4. **Cross-Cutting Concerns**
   ```markdown
   Design shared capabilities:
   
   API Gateway:
   - Request routing
   - Rate limiting
   - Authentication/Authorization
   - API versioning
   
   Service Mesh (optional):
   - Service-to-service auth (mTLS)
   - Observability
   - Traffic management
   - Circuit breaking
   
   Centralized Logging:
   - Structured logs from all services
   - Correlation IDs for tracing
   - Log aggregation (ELK, Splunk, etc.)
   
   Distributed Tracing:
   - Request tracing across services
   - Performance profiling
   - Dependency mapping
   ```

**Outputs:**
- `modernization/transformation-approaches.yaml` - Good/better/best options
- `modernization/strangler-fig-plan.yaml` - Phased extraction plan
- `modernization/communication-patterns.md` - Service communication design
- `modernization/cross-cutting-concerns.md` - Shared infrastructure design

**Checkpoint:** ✅ Transformation approach selected with communication patterns

---

## Phase 5: Implementation Roadmap (90-100%)

**Goals:**
- Create detailed implementation timeline
- Define service extraction order
- Plan infrastructure and tooling

**Activities:**

1. **Service Extraction Order**
   ```markdown
   Prioritize services by:
   
   Priority 1: Foundation Services
   - Authentication/Authorization
   - API Gateway
   - Configuration Service
   - Logging/Monitoring
   
   Priority 2: Pilot Service
   - Low risk, low dependencies
   - Proves patterns and processes
   - Example: Notification Service, Reporting Service
   
   Priority 3: Core Business Services
   - High value, moderate dependencies
   - User Management
   - Product Catalog
   - Order Processing
   
   Priority 4: Dependent Services
   - Services that depend on Priority 3
   - Payment Processing
   - Inventory Management
   - Shipping
   
   Priority 5: Remaining Services
   - Lower priority capabilities
   - Admin tools
   - Analytics
   - Background jobs
   ```

2. **Phased Roadmap**
   ```yaml
   roadmap:
     phase0:
       name: Foundation & Pilot
       duration: 8 weeks
       services:
         - API Gateway setup
         - Authentication Service (extraction)
         - Monitoring infrastructure
         - Pilot Service (low-risk extraction)
       goals:
         - Prove strangler fig pattern
         - Establish service patterns
         - Set up tooling and processes
       deliverables:
         - API Gateway operational
         - First service extracted
         - CI/CD pipeline established
         - Monitoring dashboards created
         
     phase1:
       name: Core Services Extraction
       duration: 12 weeks
       services:
         - User Management Service
         - Product Catalog Service
         - Order Processing Service
       goals:
         - Extract core business capabilities
         - Establish data migration patterns
         - Validate communication patterns
       deliverables:
         - Core services running in production
         - Data migration validated
         - Event-driven patterns operational
         
     phase2:
       name: Dependent Services
       duration: 10 weeks
       services:
         - Payment Service
         - Inventory Service
         - Shipping Service
       goals:
         - Complete business capability extraction
         - Reduce monolith to minimal functionality
       deliverables:
         - All business services extracted
         - Monolith handles only legacy features
         
     phase3:
       name: Remaining Services & Decommission
       duration: 6 weeks
       services:
         - Admin Services
         - Reporting Services
         - Background Jobs
       goals:
         - Complete extraction
         - Decommission monolith
       deliverables:
         - Monolith decommissioned
         - Full microservices architecture operational
   ```

3. **Infrastructure Requirements**
   ```markdown
   Platform:
   - Container orchestration (Kubernetes, ECS, etc.)
   - Service mesh (Istio, Linkerd) - optional
   - API Gateway (Kong, Apigee, Azure API Management, etc.)
   
   Data:
   - Database per service
   - Message queue (RabbitMQ, Kafka, Azure Service Bus)
   - Cache (Redis)
   
   Observability:
   - Centralized logging (ELK, Splunk)
   - Distributed tracing (Jaeger, Zipkin, Application Insights)
   - Metrics and alerting (Prometheus, Grafana, CloudWatch)
   
   CI/CD:
   - Per-service pipelines
   - Automated testing (unit, integration, contract)
   - Blue-green or canary deployments
   ```

4. **Team Organization**
   ```markdown
   Recommended structure:
   
   Platform Team:
   - API Gateway
   - Service Mesh
   - Monitoring/Logging
   - CI/CD infrastructure
   
   Service Teams (per domain):
   - Own services in their domain
   - End-to-end ownership (dev, deploy, operate)
   - Example: "Order Team" owns Order Service, Payment Service
   
   Cross-Functional:
   - Architecture review board
   - API design standards
   - Security review
   ```

**Outputs:**
- `modernization/implementation-roadmap.yaml` - Detailed timeline
- `modernization/service-extraction-order.md` - Prioritized list
- `modernization/infrastructure-requirements.md` - Platform needs
- `modernization/team-organization.md` - Recommended structure

**Checkpoint:** ✅ Implementation roadmap complete with timeline and resources

---

## Final Phase: Summary Report (95-100%)

**Activities:**

1. **Executive Summary**
   ```markdown
   - Current monolith assessment
   - Recommended microservices architecture
   - Service boundary justification
   - Data decomposition approach
   - Transformation strategy (strangler fig recommended)
   - Timeline and phases
   - Team and infrastructure needs
   ```

2. **Technical Documentation Package**
   ```markdown
   - Domain model and bounded contexts
   - Service boundary specifications
   - Data decomposition strategy
   - API contracts
   - Communication patterns
   - Infrastructure design
   - Implementation roadmap
   ```

**Outputs:**
- `executive-summary.md` - High-level overview
- `transformation-playbook.md` - Complete transformation guide

---

## Success Criteria

✅ **Monolith Analyzed:**
- Structure and dependencies mapped
- Complexity and debt assessed
- Current data model documented

✅ **Service Boundaries Defined:**
- Domains and bounded contexts identified
- Microservices recommended
- API contracts specified

✅ **Data Strategy:**
- Database ownership assigned
- Data decomposition patterns applied
- Migration strategy defined

✅ **Transformation Approach:**
- Good/better/best options provided
- Strangler fig or parallel approach detailed
- Communication patterns designed
- Cross-cutting concerns addressed

✅ **Implementation Roadmap:**
- Phased plan with timelines
- Service extraction order prioritized
- Infrastructure requirements specified
- Team organization recommended

✅ **Documentation:**
- All outputs in session directory
- Executive and technical docs complete
- Playbook ready for execution

---

## Integration with Other Workflows

### Combine with Cloud Migration Planning

```markdown
Microservices transformation often goes hand-in-hand with cloud migration:

→ First run Cloud Migration Planning
`orchestr8://workflows/_fragments/workflow-cloud-migration-planning`

→ Then run Microservices Transformation
`orchestr8://workflows/_fragments/workflow-microservices-transformation`

This provides:
- Cloud infrastructure design (from migration planning)
- Kubernetes/container platform
- Microservices architecture (from this workflow)
- Complete modernization strategy
```

---

## Best Practices

✅ **Start with domain-driven design** - Bounded contexts first
✅ **Strangler fig pattern** - Incremental, low-risk
✅ **Database per service** - True service autonomy
✅ **API-first design** - Contract-driven development
✅ **Event-driven where appropriate** - Loose coupling
✅ **Observability from day one** - Distributed tracing essential
✅ **Pilot before scale** - Prove patterns with pilot service
✅ **Team autonomy** - Services owned by teams

❌ **Don't create micro-microservices** - Too granular is bad
❌ **Don't skip data migration planning** - Hardest part
❌ **Don't big-bang cutover** - Too risky
❌ **Don't ignore operational complexity** - Microservices = more ops
