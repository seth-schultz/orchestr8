---
description: Comprehensive architecture review covering design patterns, SOLID principles, scalability, security, technical debt, and API design
argument-hint: [scope-or-path]
model: claude-opus-4-1-20250805
---

# Architecture Review Workflow

You are orchestrating a comprehensive architecture review that evaluates system design, architectural patterns, scalability, security architecture, and long-term maintainability.

## Workflow Overview

This workflow provides deep architectural analysis focusing on:
1. **System Design** - Overall architecture patterns and structure
2. **Design Patterns** - SOLID principles, DRY, separation of concerns
3. **Scalability** - Horizontal/vertical scaling capabilities
4. **Security Architecture** - Defense in depth, auth/authz design
5. **Technical Debt** - Code quality, maintainability, refactoring needs
6. **Integration** - API design, coupling, cohesion
7. **Future-Proofing** - Extensibility, evolution capability

## Intelligence Database Integration

```bash

# Initialize workflow

echo "🚀 Starting Architecture Review Workflow"
echo "Scope: $1"
echo "Workflow ID: $workflow_id"

# Query similar architecture patterns
```

---

## Phase 1: Architecture Discovery & Mapping (0-15%)

**⚡ EXECUTE TASK TOOL:**
```
Use the architect agent to:
1. Identify architecture type (monolith, microservices, serverless, layered)
2. Map components and dependencies
3. Identify key concerns (auth, data, business logic, integrations)
4. Create architecture map document
5. Create analysis task list

subagent_type: "orchestr8:development:architect"
description: "Discover and map system architecture"
prompt: "Analyze the system architecture and create a comprehensive map:

Scope: $1

Tasks:

1. **Identify Architecture Type**
   Use database queries to understand project structure:
   ```bash
   # Query for architectural patterns
   ```

   Determine if:
   - Monolith: Single app directory
   - Microservices: Multiple service directories
   - Serverless: Lambda/function directories
   - Layered: Clear layer separation (controllers, services, repositories)
   - Clean/Hexagonal: Ports and adapters pattern
   - Event-Driven: Message/event infrastructure
   - CQRS: Separate read/write models

2. **Map Components and Dependencies**
   ```bash
   # Find main entry points
   find . -name 'main.*' -o -name 'index.*' -o -name 'app.*'

   # Identify major modules/services
   ls -d */ | grep -E '(src|lib|services|api|modules)'

   # Check dependencies
   cat package.json requirements.txt pom.xml Cargo.toml go.mod 2>/dev/null
   ```

3. **Identify Key Concerns**
   - Authentication & Authorization
   - Data storage & access
   - Business logic location
   - External integrations
   - Caching strategy
   - Messaging/events
   - Deployment model

4. **Create Architecture Map Document**
   Create 'architecture-map.md' with:
   - Architecture type and rationale
   - Component diagram (text-based)
   - Dependency relationships
   - Key technical decisions
   - Areas of concern

Expected outputs:
- architecture-map.md
- Component and dependency mapping
- List of key architectural concerns
"
```

**Expected Outputs:**
- `architecture-map.md` - Complete architecture mapping
- Component and dependency relationships documented
- Key concerns identified

**Quality Gate: Discovery Validation**
```bash
# Validate architecture map exists
if [ ! -f "architecture-map.md" ]; then
  echo "❌ Architecture map not created"
  exit 1
fi

# Check for minimum content
LINE_COUNT=$(wc -l < "architecture-map.md")
if [ "$LINE_COUNT" -lt 20 ]; then
  echo "❌ Architecture map incomplete: $LINE_COUNT lines"
  exit 1
fi

echo "✅ Architecture discovery complete"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store architecture map
  "Architecture map for codebase" \
  "$(head -n 50 architecture-map.md)"
```

---

**🚀 PARALLEL EXECUTION OPPORTUNITY (6x speedup):** After Phase 1 completes, Phases 2-7 can run in parallel since each analyzes independent dimensions (patterns, SOLID, scalability, security, technical debt, API design). Use a single message with 6 Task tool calls to execute all analysis phases concurrently. Each writes to separate output files (pattern-analysis.md, solid-analysis.md, scalability-analysis.md, security-architecture.md, technical-debt.md, api-architecture.md), so no conflicts. Phase 8 synthesizes results after all complete.

---

## Phase 2: Architecture Pattern Analysis (15-30%)

**⚡ EXECUTE TASK TOOL:**
```
Use the architect agent to:
1. Evaluate current architecture pattern appropriateness
2. Identify pattern violations (layer violations, circular dependencies)
3. Assess pattern strengths and weaknesses
4. Generate pattern analysis report
5. Provide pattern recommendations

subagent_type: "orchestr8:development:architect"
description: "Analyze architecture patterns and violations"
prompt: "Evaluate the architecture pattern for appropriateness and violations:

Based on architecture-map.md, analyze:

1. **Current Architecture Pattern Assessment**
   Evaluate if pattern is:
   - Monolithic
   - Microservices
   - Serverless
   - Layered (N-tier)
   - Clean Architecture / Hexagonal
   - Event-Driven
   - CQRS
   - Hybrid

2. **Pattern Appropriateness**
   Rate as:
   - ✅ Fits requirements perfectly
   - ⚠️ Suboptimal but workable
   - ❌ Wrong pattern for use case

   Consider:
   - Team size and skill level
   - System complexity
   - Scalability requirements
   - Deployment constraints
   - Performance requirements

3. **Architecture Violations**
   Search for:
   - Layer violations (UI calling database directly)
   - Circular dependencies
   - Tight coupling
   - Missing abstractions
   - Dependency direction violations
   - God classes/modules

   Use database queries:
   ```bash
   ```

4. **Generate Pattern Analysis**
   Create 'pattern-analysis.md' with:
   ```markdown
   ## Architecture Pattern Analysis

   **Current Pattern:** [Pattern Name]

   **Assessment:** [✅ Appropriate | ⚠️ Needs Improvement | ❌ Wrong Pattern]

   **Strengths:**
   - [What works well with file references]

   **Weaknesses:**
   - [What doesn't work with file references]

   **Violations Found:**
   - [Specific violations with file:line references]

   **Recommendation:**
   [Keep current / Migrate to X / Refactor to fix violations]
   ```

Expected outputs:
- pattern-analysis.md
- List of violations with file references
- Specific recommendations
"
```

**Expected Outputs:**
- `pattern-analysis.md` - Complete pattern evaluation
- Violation list with file references
- Pattern recommendations

**Quality Gate: Pattern Analysis Validation**
```bash
# Validate pattern analysis exists
if [ ! -f "pattern-analysis.md" ]; then
  echo "❌ Pattern analysis not created"
  exit 1
fi

# Validate contains assessment
if ! grep -q "Assessment:" "pattern-analysis.md"; then
  echo "❌ Pattern analysis incomplete"
  exit 1
fi

echo "✅ Pattern analysis validated"
```

**Track Progress:**
```bash
TOKENS_USED=6000

# Store pattern analysis
  "Architecture pattern evaluation" \
  "$(head -n 50 pattern-analysis.md)"
```

---

## Phase 3: Design Patterns & Principles Review (30-45%)

**⚡ EXECUTE TASK TOOL:**
```
Use the architect agent to:
1. Evaluate SOLID principles compliance
2. Identify design pattern usage and appropriateness
3. Find violations of Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion
4. Assess design pattern implementation quality
5. Generate SOLID compliance report

subagent_type: "orchestr8:development:architect"
description: "Review SOLID principles and design patterns"
prompt: "Evaluate SOLID principles and design pattern usage:

Based on codebase analysis, evaluate:

## SOLID Principles Analysis

**Single Responsibility Principle (SRP):**
Search for:
- Classes/modules doing too much (God classes)
- Multiple reasons to change
- Mixed concerns

Query examples:
```bash
```

Check for:
- Files > 500 lines
- Classes with > 10 methods
- Mixed concerns (auth + persistence + notifications)

**Open/Closed Principle (OCP):**
Search for:
- Code requiring modification for extension
- Missing abstractions
- Hardcoded logic that should be pluggable

Look for if/else chains for type checking:
```bash
```

**Liskov Substitution Principle (LSP):**
Search for:
- Derived classes breaking contracts
- Overridden methods changing behavior unexpectedly
- Instanceof checks instead of polymorphism

**Interface Segregation Principle (ISP):**
Search for:
- Fat interfaces (too many methods)
- Clients forced to depend on unused methods
- Missing interface decomposition

**Dependency Inversion Principle (DIP):**
Search for:
- High-level modules depending on low-level modules
- Concrete dependencies instead of abstractions
- Missing dependency injection

## Design Patterns Assessment

**Check usage and appropriateness:**
- **Creational:** Factory, Builder, Singleton (check for overuse)
- **Structural:** Adapter, Decorator, Facade
- **Behavioral:** Strategy, Observer, Command

Query for patterns:
```bash
```

## Generate Report

Create 'solid-analysis.md' with:
```markdown
## Design Patterns & Principles

### SOLID Compliance: [Score/5]

**Violations Found:**

#### 1. SRP Violation - [ClassName] (Priority: High/Medium/Low)
**File:** `path/to/file.ext:line`
**Problem:** [Description]
**Impact:** [Why this matters]
**Fix:** [Specific recommendation]

---

### Design Patterns Used:

✅ **Well Applied:**
- [Pattern]: [file] ([Why it works])

⚠️ **Needs Improvement:**
- [Pattern]: [file] ([What needs fixing])

❌ **Anti-Patterns:**
- [Anti-pattern]: [file] ([Why it's problematic])
```

Expected outputs:
- solid-analysis.md
- List of SOLID violations with severity
- Design pattern assessment
- Specific refactoring recommendations
"
```

**Expected Outputs:**
- `solid-analysis.md` - Complete SOLID and design pattern evaluation
- Violation list with priorities
- Refactoring recommendations

**Quality Gate: SOLID Analysis Validation**
```bash
# Validate SOLID analysis exists
if [ ! -f "solid-analysis.md" ]; then
  echo "❌ SOLID analysis not created"
  exit 1
fi

# Validate contains SOLID score
if ! grep -q "SOLID Compliance:" "solid-analysis.md"; then
  echo "❌ SOLID compliance score missing"
  exit 1
fi

echo "✅ SOLID analysis validated"
```

**Track Progress:**
```bash
TOKENS_USED=7000

# Store SOLID analysis
  "SOLID principles compliance analysis" \
  "$(head -n 50 solid-analysis.md)"
```

---

## Phase 4: Scalability & Performance Architecture (45-60%)

**⚡ EXECUTE TASK TOOL:**
```
Use the architect agent to:
1. Evaluate horizontal scalability (stateless design, load balancing)
2. Assess vertical scalability (resource usage, memory management)
3. Review database scalability (read replicas, sharding, indexing)
4. Analyze caching strategy
5. Evaluate async processing architecture
6. Generate scalability report

subagent_type: "orchestr8:development:architect"
description: "Analyze scalability and performance architecture"
prompt: "Evaluate the system's scalability and performance architecture:

Analyze these dimensions:

## Scalability Dimensions

**1. Horizontal Scalability (Add more servers)**
Check for:
- [ ] Stateless design (no server affinity)
- [ ] Load balancer friendly
- [ ] Shared session storage (Redis)
- [ ] Database connection pooling
- [ ] No local file storage

Query for issues:
```bash
```

**2. Vertical Scalability (Add more resources)**
Check for:
- [ ] Efficient resource usage
- [ ] No memory leaks
- [ ] Configurable resource limits
- [ ] Graceful degradation under load

**3. Database Scalability**
Check for:
- [ ] Read replica support
- [ ] Sharding strategy
- [ ] Proper indexing
- [ ] Query optimization
- [ ] Connection pooling

Query database patterns:
```bash
```

**4. Caching Strategy**
Evaluate:
- [ ] Cache layers defined (browser, CDN, app, DB)
- [ ] Cache invalidation strategy
- [ ] Appropriate cache TTLs
- [ ] Cache hit/miss monitoring

Search for caching:
```bash
```

**5. Async Processing**
Check for:
- [ ] Background jobs for expensive operations
- [ ] Message queue for async workflows
- [ ] Event-driven architecture where appropriate
- [ ] Job retry and error handling

## Generate Report

Create 'scalability-analysis.md' with:
```markdown
## Scalability Architecture

### Horizontal Scalability: [✅ Good | ⚠️ Partial | ❌ Poor]

**Assessment:** [Status with explanation]

**Issues:**
- ❌ [Critical issue with file reference]
- ⚠️ [Warning with file reference]
- ✅ [What works well]

**Recommendations:**
1. [HIGH PRIORITY] [Specific recommendation]
2. [MEDIUM] [Specific recommendation]
3. [LOW] [Specific recommendation]

---

### Vertical Scalability: [Status]
[Similar analysis]

---

### Database Scalability: [Status]
[Similar analysis]

---

### Caching Strategy: [Status]
**Current State:**
- [What exists]

**Impact:**
- [Performance implications]

**Recommendations:**
[Specific improvements needed]

---

### Async Processing: [Status]
[Similar analysis]
```

Expected outputs:
- scalability-analysis.md
- Scalability issues with priorities
- Specific recommendations for each dimension
"
```

**Expected Outputs:**
- `scalability-analysis.md` - Complete scalability evaluation
- Issue list with priorities
- Specific recommendations

**Quality Gate: Scalability Analysis Validation**
```bash
# Validate scalability analysis exists
if [ ! -f "scalability-analysis.md" ]; then
  echo "❌ Scalability analysis not created"
  exit 1
fi

# Validate contains assessments for key dimensions
if ! grep -q "Horizontal Scalability:" "scalability-analysis.md"; then
  echo "❌ Scalability analysis incomplete"
  exit 1
fi

echo "✅ Scalability analysis validated"
```

**Track Progress:**
```bash
TOKENS_USED=6000

# Store scalability analysis
  "Scalability architecture analysis" \
  "$(head -n 50 scalability-analysis.md)"
```

---

## Phase 5: Security Architecture Review (60-75%)

**⚡ EXECUTE TASK TOOL:**
```
Use the security-auditor agent to:
1. Evaluate defense in depth (network, application, data layers)
2. Review authentication and authorization architecture
3. Assess encryption at rest and in transit
4. Analyze secrets management
5. Check security best practices compliance
6. Generate security architecture report

subagent_type: "orchestr8:quality:security-auditor"
description: "Review security architecture and design"
prompt: "Evaluate the security architecture design:

Analyze security at multiple layers:

## Defense in Depth

**1. Network Security:**
Check for:
- [ ] Firewall rules defined
- [ ] Network segmentation
- [ ] Private subnets for databases
- [ ] VPN for internal access
- [ ] DDoS protection

**2. Application Security:**
Check for:
- [ ] Input validation at boundaries
- [ ] Output encoding
- [ ] Authentication required for protected resources
- [ ] Authorization checked for actions
- [ ] CSRF protection
- [ ] Security headers configured

Query for security patterns:
```bash
```

**3. Data Security:**
Check for:
- [ ] Encryption at rest (database, files)
- [ ] Encryption in transit (TLS 1.3)
- [ ] Secrets management (Vault, AWS Secrets Manager)
- [ ] PII protection and minimization
- [ ] Secure key storage

Query for encryption:
```bash
```

## Authentication & Authorization Architecture

Evaluate:
- [ ] Centralized auth (not scattered)
- [ ] Token-based (JWT) or session-based
- [ ] Refresh token rotation
- [ ] MFA support
- [ ] RBAC or ABAC model
- [ ] Principle of least privilege

Query auth patterns:
```bash
```

## Generate Report

Create 'security-architecture.md' with:
```markdown
## Security Architecture

### Defense in Depth: [✅ Good | ⚠️ Partial | ❌ Poor]

**Layer Analysis:**

**Network:** [Status]
- [Strengths and weaknesses]

**Application:** [Status]
- ❌ [Critical issue with file reference]
- ⚠️ [Warning with file reference]
- ✅ [What works]

**Data:** [Status]
- [Analysis]

---

### Authentication Architecture: [Status]

**Pattern:** [JWT/Session/OAuth/etc.]

**Strengths:**
- [What works well]

**Weaknesses:**
- [Critical issues]
- [Improvements needed]

**Recommendations:**
1. [HIGH PRIORITY] [Specific recommendation]
2. [MEDIUM] [Specific recommendation]
3. [LOW] [Specific recommendation]

---

### Authorization Architecture: [Status]
[Similar analysis]

---

### Secrets Management: [Status]
[Analysis and recommendations]
```

Expected outputs:
- security-architecture.md
- Security issues prioritized by severity
- Specific remediation recommendations
"
```

**Expected Outputs:**
- `security-architecture.md` - Complete security evaluation
- Security issues with severity ratings
- Remediation recommendations

**Quality Gate: Security Architecture Validation**
```bash
# Validate security architecture analysis exists
if [ ! -f "security-architecture.md" ]; then
  echo "❌ Security architecture analysis not created"
  exit 1
fi

# Validate contains defense in depth analysis
if ! grep -q "Defense in Depth:" "security-architecture.md"; then
  echo "❌ Security analysis incomplete"
  exit 1
fi

echo "✅ Security architecture analysis validated"
```

**Track Progress:**
```bash
TOKENS_USED=6000

# Store security analysis
  "Security architecture analysis" \
  "$(head -n 50 security-architecture.md)"
```

---

## Phase 6: Technical Debt & Code Quality (75-85%)

**⚡ EXECUTE TASK TOOL:**
```
Use the code-reviewer agent to:
1. Identify code smells (God classes, long methods, high complexity)
2. Detect structural issues (circular dependencies, tight coupling)
3. Assess documentation debt
4. Quantify technical debt by impact and effort
5. Generate technical debt report with prioritization

subagent_type: "orchestr8:quality:code-reviewer"
description: "Assess technical debt and code quality"
prompt: "Analyze technical debt and maintainability issues:

Focus on these areas:

## Code Smells

**Search for:**
- God classes (>500 lines)
- Long methods (>50 lines)
- High cyclomatic complexity (>10)
- Duplicate code
- Deep nesting (>4 levels)
- Magic numbers
- Dead code

Use queries:
```bash
```

Use file analysis:
```bash
# Find large files
find . -name '*.ts' -o -name '*.js' -o -name '*.py' -o -name '*.java' | \
  xargs wc -l | sort -rn | head -20
```

## Structural Issues

**Look for:**
- Circular dependencies
- Tight coupling
- Missing tests
- Low cohesion
- Inappropriate intimacy

```bash
```

## Documentation Debt

**Check for:**
- Missing README
- No architecture docs
- Uncommented complex logic
- No API documentation
- Missing ADRs

## Generate Report

Create 'technical-debt.md' with:
```markdown
## Technical Debt Assessment

**Overall Debt Level:** [Low | Medium | High | Critical]

**Debt Score:** X/10

### High-Impact Debt (Fix Soon)

**1. [Issue Name] - [Component]**
- **File:** `path/to/file:line`
- **Size/Metrics:** [Lines, complexity, etc.]
- **Impact:** [Why this matters]
- **Effort:** [Time estimate]
- **Benefit:** [What improves]

**2. [Next issue]**
[Similar format]

---

### Medium-Impact Debt (Plan to Fix)

**3. [Issue Name]**
[Similar format]

---

### Low-Impact Debt (Future Cleanup)

**4. [Issue Name]**
[Similar format]

---

### Documentation Debt

- ❌ [Missing documentation]
- ⚠️ [Incomplete documentation]
- ✅ [What exists]

**Recommendation:** [Time investment needed]

---

## Debt Prioritization Matrix

| Issue | Impact | Effort | Priority | ROI |
|-------|--------|--------|----------|-----|
| [Name] | High | 3d | P1 | High |
| [Name] | High | 5d | P1 | Med |
| [Name] | Med | 2d | P2 | High |
```

Expected outputs:
- technical-debt.md
- Prioritized debt list
- Effort and impact estimates
- ROI analysis
"
```

**Expected Outputs:**
- `technical-debt.md` - Complete technical debt analysis
- Prioritized debt list with metrics
- ROI analysis for fixing debt

**Quality Gate: Technical Debt Analysis Validation**
```bash
# Validate technical debt analysis exists
if [ ! -f "technical-debt.md" ]; then
  echo "❌ Technical debt analysis not created"
  exit 1
fi

# Validate contains debt score
if ! grep -q "Debt Score:" "technical-debt.md"; then
  echo "❌ Technical debt score missing"
  exit 1
fi

echo "✅ Technical debt analysis validated"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store technical debt analysis
  "Technical debt analysis and prioritization" \
  "$(head -n 50 technical-debt.md)"
```

---

## Phase 7: API Design & Integration Review (85-95%)

**⚡ EXECUTE TASK TOOL:**
```
Use the api-designer agent to:
1. Evaluate API design principles (REST/GraphQL/gRPC)
2. Review API best practices (versioning, pagination, error handling)
3. Assess integration patterns (sync/async, resilience)
4. Check circuit breaker, retry, timeout configurations
5. Generate API architecture report

subagent_type: "api-design:openapi-specialist"
description: "Review API and integration architecture"
prompt: "Evaluate API design and integration patterns:

Analyze these aspects:

## API Design Principles

**For REST APIs:**
Check for:
- [ ] Resource-based URLs (/users/123, not /getUser?id=123)
- [ ] HTTP methods used correctly (GET, POST, PUT, DELETE, PATCH)
- [ ] HTTP status codes appropriate
- [ ] Stateless interactions
- [ ] HATEOAS if applicable

Query for API patterns:
```bash
```

**For GraphQL APIs:**
Check for:
- [ ] Schema design
- [ ] Query complexity limits
- [ ] N+1 query prevention
- [ ] Proper error handling

**For gRPC APIs:**
Check for:
- [ ] Protocol buffer definitions
- [ ] Service contracts
- [ ] Streaming usage

## API Best Practices

Check for:
- [ ] Versioning (/v1/users)
- [ ] Pagination for collections
- [ ] Filtering and sorting
- [ ] Rate limiting
- [ ] Error responses consistent
- [ ] API documentation (OpenAPI/Swagger)

```bash
```

## Integration Patterns

Evaluate:
- Synchronous vs Asynchronous communication
- API contracts defined
- Circuit breaker pattern (for resilience)
- Retry logic with exponential backoff
- Timeout configuration
- Graceful degradation

```bash
```

## Generate Report

Create 'api-architecture.md' with:
```markdown
## API Architecture

### REST API Design: [✅ Good | ⚠️ Needs Improvement | ❌ Poor]

**Compliance:**
- ✅ [What follows best practices]
- ⚠️ [What needs improvement]
- ❌ [Critical issues]

**Critical Issues:**
1. **[Issue Name]** (Priority: HIGH/MEDIUM/LOW)
   - **Impact:** [Description]
   - **Fix:** [Specific recommendation]

---

### API Best Practices: [Status]

**Missing Features:**
- [What's missing with examples]

**Recommendations:**
1. [Priority] [Specific recommendation]

---

### Integration Resilience: [Status]

**Issues:**
- [What's missing for resilience]

**Impact:**
- [Why this matters]

**Recommendations:**
1. [HIGH PRIORITY] [Specific implementation]
2. [MEDIUM] [Specific implementation]
```

Expected outputs:
- api-architecture.md
- API design issues with priorities
- Integration resilience recommendations
"
```

**Expected Outputs:**
- `api-architecture.md` - Complete API and integration evaluation
- API design issues prioritized
- Resilience recommendations

**Quality Gate: API Architecture Validation**
```bash
# Validate API architecture analysis exists
if [ ! -f "api-architecture.md" ]; then
  echo "❌ API architecture analysis not created"
  exit 1
fi

# Validate contains API assessment
if ! grep -q "API" "api-architecture.md"; then
  echo "❌ API architecture analysis incomplete"
  exit 1
fi

echo "✅ API architecture analysis validated"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store API architecture analysis
  "API and integration architecture analysis" \
  "$(head -n 50 api-architecture.md)"
```

---

## Phase 8: Architecture Report & Recommendations (95-100%)

**⚡ EXECUTE TASK TOOL:**
```
Use the architect agent to:
1. Synthesize all analyses into executive summary
2. Create architecture scorecard with ratings
3. Generate prioritized improvement roadmap
4. Create Architecture Decision Records (ADRs) for recommendations
5. Provide clear next steps
6. Generate final comprehensive report

subagent_type: "orchestr8:development:architect"
description: "Generate comprehensive architecture review report"
prompt: "Synthesize all architecture analyses into final report:

Consolidate these documents:
- architecture-map.md
- pattern-analysis.md
- solid-analysis.md
- scalability-analysis.md
- security-architecture.md
- technical-debt.md
- api-architecture.md

Create 'architecture-review-report.md' with:

# Architecture Review Report

**Review Date:** $(date +%Y-%m-%d)
**Scope:** $1
**Reviewer:** Orchestr8 Architecture Review Workflow

---

## Executive Summary

**Overall Architecture Health:** [Score/10]

**Pattern:** [Current architecture pattern]
**Maturity Level:** [Initial | Developing | Defined | Managed | Optimizing]

**Key Findings:**
- 🔴 Critical: X issues requiring immediate attention
- 🟠 High: Y issues to address soon
- 🟡 Medium: Z improvements recommended
- 💡 Suggestions: W optimization opportunities

**Quick Wins:** [1-2 high-impact, low-effort improvements]
**Major Initiatives:** [1-2 strategic improvements]

---

## Architecture Scorecard

| Dimension | Score | Status | Key Issues |
|-----------|-------|--------|------------|
| Architecture Pattern | X/10 | [Status] | [Main issue] |
| SOLID Principles | X/10 | [Status] | [Main issue] |
| Scalability | X/10 | [Status] | [Main issue] |
| Security Architecture | X/10 | [Status] | [Main issue] |
| Technical Debt | X/10 | [Status] | [Main issue] |
| API Design | X/10 | [Status] | [Main issue] |
| **Overall** | **X/10** | **[Status]** | |

---

## Critical Issues (Must Address)

[Consolidated critical issues from all phases with priorities]

1. **[Issue Name]** - [Component]
   - **Severity:** CRITICAL
   - **File:** `path/to/file`
   - **Impact:** [Business/technical impact]
   - **Effort:** [Time estimate]
   - **Recommendation:** [Specific action]

---

## Architecture Decision Records (Recommended)

### ADR-001: [Decision Title]

**Status:** Proposed

**Context:**
[Why this decision is needed]

**Decision:**
[What we recommend]

**Consequences:**
**Positive:**
- [Benefits]

**Negative:**
- [Trade-offs]

**Alternatives Considered:**
- [Option 1]: [Why rejected]
- [Option 2]: [Why rejected]

**Implementation:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

---

[Repeat for 3-5 key ADRs]

---

## Improvement Roadmap

### Immediate (Next Sprint) - Week 1-2
**Priority: CRITICAL**
- [ ] [Action item] (enables [benefit])
- [ ] [Action item]

**Effort:** X weeks
**Impact:** [Key benefits]

---

### Short Term (Next Quarter) - Months 1-3
**Priority: HIGH**
- [ ] [Action item]
- [ ] [Action item]

**Effort:** X weeks
**Impact:** [Key benefits]

---

### Medium Term (6 Months) - Months 3-6
**Priority: MEDIUM**
- [ ] [Action item]
- [ ] [Action item]

**Effort:** X months
**Impact:** [Key benefits]

---

### Long Term (12+ Months) - Strategic
**Priority: LOW**
- [ ] [Action item]
- [ ] [Action item]

**Effort:** X+ months
**Impact:** [Key benefits]

---

## Recommended Next Steps

1. **Review & Prioritize** - Stakeholder meeting to prioritize roadmap
2. **Allocate Resources** - Assign X% time for technical debt
3. **Create ADRs** - Document critical decisions
4. **Track Progress** - Quarterly architecture reviews
5. **Update Documentation** - Architecture diagrams and decisions

---

## Appendices

### A. Detailed Findings
- Link to architecture-map.md
- Link to pattern-analysis.md
- Link to solid-analysis.md
- Link to scalability-analysis.md
- Link to security-architecture.md
- Link to technical-debt.md
- Link to api-architecture.md

### B. Metrics Summary
- Total files analyzed: X
- Lines of code: X
- Technical debt score: X/10
- Test coverage: X%
- Critical issues: X
- High priority issues: X

---

<sub>🤖 Generated by [orchestr8](https://github.com/seth-schultz/orchestr8) architecture review on $(date +%Y-%m-%d)</sub>

Expected outputs:
- Complete architecture-review-report.md (comprehensive final report)
- 3-5 ADRs for key recommendations
- Prioritized improvement roadmap
- Clear next steps
"
```

**Expected Outputs:**
- `architecture-review-report.md` - Comprehensive final report
- ADRs for key recommendations
- Prioritized roadmap
- Next steps

**Quality Gate: Final Report Validation**
```bash
# Validate final report exists
if [ ! -f "architecture-review-report.md" ]; then
  echo "❌ Architecture review report not created"
  exit 1
fi

# Check report has minimum sections
if ! grep -q "Architecture Scorecard" "architecture-review-report.md"; then
  echo "❌ Report missing scorecard"
  exit 1
fi

if ! grep -q "Improvement Roadmap" "architecture-review-report.md"; then
  echo "❌ Report missing roadmap"
  exit 1
fi

# Check report length
LINE_COUNT=$(wc -l < "architecture-review-report.md")
if [ "$LINE_COUNT" -lt 100 ]; then
  echo "❌ Report too short: $LINE_COUNT lines"
  exit 1
fi

echo "✅ Architecture review report validated ($LINE_COUNT lines)"
```

**Track Progress:**
```bash
TOKENS_USED=8000

# Store final report
  "Complete architecture review report" \
  "$(head -n 100 architecture-review-report.md)"
```

---

## Workflow Complete

```bash
# Complete workflow tracking
WORKFLOW_END=$(date +%s)

  "Architecture review completed for: $1"

echo "
✅ ARCHITECTURE REVIEW COMPLETE

Scope: $1

Reports Generated:
- architecture-map.md
- pattern-analysis.md
- solid-analysis.md
- scalability-analysis.md
- security-architecture.md
- technical-debt.md
- api-architecture.md
- architecture-review-report.md (MAIN REPORT)

Key Deliverables:
- Architecture scorecard with ratings
- Critical issues prioritized
- 3-5 ADRs for key decisions
- Improvement roadmap (immediate → long-term)
- Clear next steps

Next Steps:
1. Review architecture-review-report.md
2. Schedule stakeholder review meeting
3. Prioritize roadmap with team
4. Create tickets for critical issues
5. Schedule quarterly follow-up review
"

# Display metrics
```

---

## Success Criteria Checklist

- ✅ Architecture type identified and mapped
- ✅ Pattern appropriateness evaluated
- ✅ SOLID principles compliance assessed
- ✅ Scalability dimensions analyzed
- ✅ Security architecture reviewed
- ✅ Technical debt quantified and prioritized
- ✅ API design and integration patterns evaluated
- ✅ Architecture scorecard created with ratings
- ✅ Critical issues identified with priorities
- ✅ ADRs recommended for key decisions
- ✅ Improvement roadmap created (immediate → long-term)
- ✅ Next steps clearly defined

---

## Best Practices

### DO ✅
- Consider long-term maintainability and evolution
- Evaluate fitness for purpose (right pattern for use case)
- Recommend pragmatic improvements (not perfection)
- Prioritize by business impact and ROI
- Document key decisions with ADRs
- Provide clear, actionable roadmap
- Balance ideal architecture vs practical constraints
- Consider team capabilities and skills

### DON'T ❌
- Recommend complete rewrites lightly
- Ignore business constraints and timeline
- Focus only on latest trends and hype
- Forget about team size and skill level
- Overwhelm with too many changes at once
- Skip documentation of decisions
- Pursue perfection over pragmatic progress
- Apply patterns without understanding context

---

## Example Usage

### Full System Review
```
/review-architecture full
```

### Module Review
```
/review-architecture src/services/payments
```

### Pre-Release Architecture Audit
```
/review-architecture . --pre-release
```

### Focus on Scalability
```
/review-architecture . --focus=scalability
```

---

Your mission is to ensure the system architecture supports current and future business needs while maintaining quality, security, and scalability. Provide actionable recommendations that balance ideal architecture with practical constraints.
