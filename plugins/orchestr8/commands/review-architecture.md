---
description: Comprehensive architecture review covering design patterns, SOLID principles,
  scalability, security, technical debt, and API design
argument-hint:
- scope-or-path
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- Write
---

# Architecture Review: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Architecture Auditor** responsible for comprehensive evaluation of system design, architectural patterns, scalability, security architecture, and long-term maintainability.

## Phase 1: Architecture Discovery & Mapping (0-15%)

**→ Load:** orchestr8://match?query=architecture+discovery+mapping&categories=pattern,skill&mode=index&maxResults=5

**Activities:**
- Identify architecture type (monolith, microservices, serverless, layered)
- Map components and dependencies
- Identify key concerns (auth, data, business logic, integrations)
- Create architecture map document

**→ Checkpoint:** Architecture discovered and mapped

## Phase 2: Architecture Pattern Analysis (15-30%)

**→ Load:** orchestr8://match?query=architecture+patterns+evaluation&categories=pattern,skill&mode=index&maxResults=5

**Activities:**
- Evaluate current architecture pattern appropriateness
- Identify pattern violations (layer violations, circular dependencies)
- Assess pattern strengths and weaknesses
- Generate pattern analysis report

**→ Checkpoint:** Pattern analysis complete with violations identified

## Phase 3: Design Patterns & Principles Review (30-45%)

**→ Load:** orchestr8://workflows/workflow-review-architecture

**Activities:**
- Evaluate SOLID principles compliance
- Identify design pattern usage and appropriateness
- Find SOLID violations (SRP, OCP, LSP, ISP, DIP)
- Assess design pattern implementation quality

**→ Checkpoint:** SOLID analysis complete with recommendations

## Phase 4: Scalability & Performance Architecture (45-60%)

**→ Load:** orchestr8://match?query=scalability+performance+architecture&categories=pattern,skill&mode=index&maxResults=5

**Activities:**
- Evaluate horizontal scalability (stateless design, load balancing)
- Assess vertical scalability (resource usage, memory management)
- Review database scalability (read replicas, sharding, indexing)
- Analyze caching strategy and async processing

**→ Checkpoint:** Scalability analysis complete

## Phase 5: Security Architecture Review (60-75%)

**→ Load:** orchestr8://match?query=security+architecture+defense+depth&categories=pattern,skill&mode=index&maxResults=5

**Activities:**
- Evaluate defense in depth (network, application, data layers)
- Review authentication and authorization architecture
- Assess encryption at rest and in transit
- Analyze secrets management

**→ Checkpoint:** Security architecture reviewed

## Phase 6: Technical Debt & Code Quality (75-85%)

**→ Load:** orchestr8://match?query=technical+debt+code+quality&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Identify code smells (God classes, long methods, high complexity)
- Detect structural issues (circular dependencies, tight coupling)
- Assess documentation debt
- Quantify technical debt by impact and effort

**→ Checkpoint:** Technical debt quantified and prioritized

## Phase 7: API Design & Integration Review (85-95%)

**→ Load:** orchestr8://match?query=api+design+integration+resilience&categories=pattern,skill&mode=index&maxResults=5

**Activities:**
- Evaluate API design principles (REST/GraphQL/gRPC)
- Review API best practices (versioning, pagination, error handling)
- Assess integration patterns (sync/async, resilience)
- Check circuit breaker, retry, timeout configurations

**→ Checkpoint:** API architecture evaluated

## Phase 8: Architecture Report & Recommendations (95-100%)

**→ Load:** orchestr8://match?query=architecture+report+decision+records&categories=skill&mode=index&maxResults=3

**Activities:**
- Synthesize all analyses into executive summary
- Create architecture scorecard with ratings
- Generate prioritized improvement roadmap
- Create Architecture Decision Records (ADRs)
- Provide clear next steps

**→ Checkpoint:** Comprehensive report delivered

## Success Criteria

✅ Architecture type identified and mapped
✅ Pattern appropriateness evaluated
✅ SOLID principles compliance assessed
✅ Scalability dimensions analyzed
✅ Security architecture reviewed
✅ Technical debt quantified and prioritized
✅ API design evaluated
✅ Architecture scorecard created
✅ Critical issues identified with priorities
✅ ADRs recommended for key decisions
✅ Improvement roadmap created
✅ Next steps clearly defined
