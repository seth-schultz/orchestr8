---
id: workflow-review-architecture
category: pattern
tags: [workflow, architecture, review, quality-gates, validation, scalability, maintainability]
capabilities:
  - Architecture assessment with quality gates
  - Scalability and performance evaluation
  - Maintainability and technical debt analysis
  - Security and compliance verification
  - Trade-off evaluation and recommendations
useWhen:
  - Architecture review requiring design analysis, scalability assessment, security evaluation, and improvement recommendations
  - System design validation needing architectural pattern compliance, SOLID principle verification, and bottleneck identification
estimatedTokens: 520
---

# Architecture Review Pattern

**Methodology:** Discover → Evaluate → Gate → Report

**Scope:** System, service, or component architecture

## Phase 1: Discovery (0-20%)
**Goals:** Map current architecture state

**Activities:**
- Document components, services, layers, boundaries
- Identify key architectural patterns in use
- Map data flows and dependencies
- Review architecture documentation vs reality
- Identify recent changes and evolution

**→ Load Patterns:** `orchestr8://patterns/match?query=architecture+layered+microservices&mode=index&maxResults=3`

**Output:** Architecture inventory and diagram

## Phase 2: Quality Gate Evaluation (20-80%)
**Goals:** Assess against quality attributes

**Parallel Tracks:**

**Track A: Scalability (20-40%)**
- Horizontal scaling capability (stateless services?)
- Load balancing and distribution strategy
- Database scaling approach (sharding, replication)
- Caching strategy and effectiveness
- Resource bottlenecks identified

**Track B: Reliability (25-45%)**
- Single points of failure eliminated
- Failure recovery mechanisms (circuit breakers, retries)
- Data consistency guarantees
- Monitoring and alerting coverage
- Disaster recovery plan exists

**Track C: Maintainability (30-50%)**
- Module coupling (low coupling, high cohesion)
- Code organization and discoverability
- Technical debt level and trend
- Documentation quality and completeness
- Onboarding complexity for new developers

**Track D: Performance (35-55%)**
- Response time targets met
- Resource utilization efficiency
- Database query performance
- Network latency optimization
- Caching effectiveness

**Track E: Security (40-60%)**
- Authentication and authorization model
- Data encryption (in-transit and at-rest)
- API security (rate limiting, validation)
- Secrets management approach
- Compliance requirements met

**Track F: Evolvability (45-65%)**
- Ease of adding new features
- Deployment independence of services
- Breaking change management
- API versioning strategy
- Technology flexibility

**Quality Gates:**
- ✅ **Gate 1:** No critical security vulnerabilities
- ✅ **Gate 2:** Scalability proven for 10x current load
- ✅ **Gate 3:** <15% technical debt ratio
- ✅ **Gate 4:** <2 hour recovery time for incidents
- ✅ **Gate 5:** Clear separation of concerns across layers

**Output:** Quality attribute scorecard with pass/fail gates

## Phase 3: Trade-off Analysis (80-95%)
**Goals:** Evaluate architectural trade-offs

**→ Load Framework:** `orchestr8://patterns/match?query=trade+off+analysis+architecture&mode=index&maxResults=3`

**Key Trade-offs:**
- Consistency vs availability (CAP theorem)
- Complexity vs flexibility (microservices vs monolith)
- Performance vs maintainability (optimization vs clarity)
- Cost vs scalability (over-provisioning vs elasticity)

**Output:** Trade-off matrix with recommendations

## Phase 4: Report & Recommendations (95-100%)
**Goals:** Deliver actionable findings

**Report Structure:**
```markdown
## Executive Summary
- Overall architecture health: [Excellent/Good/Fair/Poor]
- Quality gates: [X/5 passed]
- Critical issues: [count]
- Major recommendations: [3-5 bullet points]

## Quality Gate Results
[Gate-by-gate pass/fail with evidence]

## Critical Issues
[Severity: Critical - must address immediately]

## Major Recommendations
[Priority improvements with effort estimates]

## Architecture Strengths
[What's working well]

## Technical Debt Assessment
[Current state, trend, prioritized paydown plan]
```

**Output:** Comprehensive architecture review report

## Success Criteria
- All quality gates evaluated
- Trade-offs documented and analyzed
- Critical issues identified with remediation plans
- Recommendations prioritized by impact/effort
- Architecture health score established
