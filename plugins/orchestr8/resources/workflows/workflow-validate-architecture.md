---
id: workflow-validate-architecture
category: pattern
tags: [workflow, architecture, validation, requirements, alignment, verification, traceability]
capabilities:
  - Architecture-to-requirements traceability
  - Functional requirement coverage validation
  - Non-functional requirement verification
  - Constraint compliance checking
  - Gap analysis and remediation
useWhen:
  - Architecture validation requiring design verification, scalability testing, security assessment, and compliance checking
  - System design validation needing load testing, failure mode analysis, and architectural decision record review
estimatedTokens: 480
---

# Architecture Validation Pattern

**Methodology:** Extract → Map → Verify → Report Gaps

**Scope:** Validate architecture against documented requirements

## Phase 1: Requirements Extraction (0-20%)
**Goals:** Gather all requirements and constraints

**→ Load Skills:** `orchestr8://skills/match?query=requirement+analysis+extraction&mode=index&maxResults=3`

**Activities:**
- Extract functional requirements (what system must do)
- Extract non-functional requirements (performance, security, scalability)
- Identify business constraints (budget, timeline, compliance)
- List technical constraints (tech stack, infrastructure, integrations)
- Capture quality attributes (availability, maintainability, usability)

**Output:** Comprehensive requirements matrix

## Phase 2: Traceability Mapping (20-50%)
**Goals:** Map architecture elements to requirements

**Mapping Process:**
1. For each functional requirement → identify implementing component(s)
2. For each non-functional requirement → identify architectural decision(s)
3. For each constraint → identify compliance mechanism(s)
4. For each quality attribute → identify enabling pattern(s)

**Traceability Matrix:**
```
Requirement ID | Type | Architecture Element | Status | Notes
REQ-001 | Functional | UserService.authenticate() | ✅ Covered |
REQ-002 | NFR-Performance | Redis caching layer | ✅ Covered |
REQ-003 | NFR-Security | JWT auth middleware | ⚠️ Partial | Missing refresh tokens
REQ-004 | Constraint | PostgreSQL database | ✅ Covered |
REQ-005 | Functional | Order processing | ❌ Missing | No component identified
```

**Output:** Requirements-to-architecture traceability matrix

## Phase 3: Gap Analysis (50-85%)
**Goals:** Identify coverage gaps and over-engineering

**Parallel Verification:**

**Track A: Functional Coverage (50-65%)**
- Every functional requirement has implementing component
- Every component traces to at least one requirement
- No orphaned components (over-engineering)
- Integration points validated

**Track B: Non-Functional Verification (55-70%)**
- **Performance:** Meets latency, throughput targets
- **Scalability:** Handles projected load (users, data, traffic)
- **Security:** Implements required controls (auth, encryption, audit)
- **Availability:** Meets uptime SLA (redundancy, failover)
- **Maintainability:** Code organization, documentation, testability

**Track C: Constraint Compliance (60-75%)**
- Technology stack matches constraints
- Budget within limits (infrastructure costs)
- Timeline achievable with architecture complexity
- Regulatory compliance built-in
- Integration requirements satisfied

**Track D: Quality Attribute Validation (65-80%)**
- Testability: Test strategy exists for all components
- Observability: Logging, metrics, tracing present
- Deployability: CI/CD pipeline supports architecture
- Usability: UX requirements reflected in design

**Gap Categories:**
- ❌ **Missing:** Requirement not addressed (critical)
- ⚠️ **Partial:** Requirement partially addressed (needs completion)
- ⚡ **Risk:** Approach uncertain, needs validation (spike/POC)
- 🔄 **Over-engineered:** Component not traced to requirement

**Output:** Categorized gap analysis with severity

## Phase 4: Remediation Plan (85-100%)
**Goals:** Plan to close gaps

**For Each Gap:**
1. **Impact:** What happens if not addressed?
2. **Options:** Alternative approaches to close gap
3. **Recommendation:** Preferred approach with rationale
4. **Effort:** Estimate (hours/days)
5. **Priority:** Critical / High / Medium / Low

**Report Structure:**
```markdown
## Validation Summary
- Requirements: [X total]
- Coverage: [Y% functional, Z% non-functional]
- Gaps: [Critical: A, High: B, Medium: C]
- Over-engineering: [D components]

## Critical Gaps (MUST FIX)
[Each gap with impact, recommendation, effort]

## High Priority Gaps
[Each gap with analysis]

## Over-Engineered Components
[Components to simplify or remove]

## Validation Status
✅ Architecture approved with conditions
⚠️ Architecture needs revisions
❌ Architecture does not meet requirements
```

**Output:** Gap remediation plan with priorities

## Success Criteria
- 100% functional requirement coverage (or gaps documented)
- All non-functional requirements verified
- All constraints validated for compliance
- Gaps categorized by severity with remediation plans
- Traceability matrix complete and accurate
- Architecture validation status: Approved/Conditional/Rejected
