---
description: Systematic validation of technical assumptions and constraints through empirical testing
argument-hint: [assumptions-to-validate]
model: claude-sonnet-4-5-20250929
---

# Validate Assumptions Workflow

Systematic workflow for testing and validating technical assumptions, architectural constraints, and design decisions through empirical evidence.

## Overview

This workflow challenges assumptions systematically, replacing "we think" with "we know" through controlled experiments and data collection.

**Use Cases:**
- Validate performance assumptions ("Can it handle 10k concurrent users?")
- Test scalability claims ("Will it scale to 1M records?")
- Verify technology constraints ("Does it support our use case?")
- Check architectural assumptions ("Is microservices overkill?")
- Validate cost estimates ("Will it stay under budget?")
- Test security assumptions ("Is this approach secure?")
- Verify compatibility claims ("Does it work with our stack?")


### Output Locations

All workflow outputs are saved to `.orchestr8/docs/` with proper categorization:

- `assumption-validation.md` → `.orchestr8/docs/research/assumptions/validation-YYYY-MM-DD.md`
- `poc-results/` → `.orchestr8/docs/research/poc/`

## Why Validate Assumptions?

**Risks of Invalid Assumptions:**
- Costly rewrites when reality doesn't match expectations
- Performance issues discovered too late
- Architectural decisions based on incorrect beliefs
- Budget overruns from underestimated costs
- Security vulnerabilities from false security assumptions

**Benefits of Validation:**
- Make informed decisions based on facts
- Identify issues early when they're cheap to fix
- Build confidence in architectural choices
- Reduce technical risk
- Justify technology decisions with evidence

## Workflow Phases

### Phase 1: Assumption Identification & Classification (0-15%)

**Objective:** Extract, categorize, and prioritize assumptions that need validation.

**Tasks:**

1. **Assumption Extraction**
   - Parse problem statement or project context
   - Identify stated assumptions
   - Uncover implicit assumptions
   - Review architecture/design documents
   - Interview stakeholders for unstated beliefs

2. **Assumption Classification**
   - **Critical:** Project viability depends on this
   - **High Impact:** Significant cost/effort if wrong
   - **Medium Impact:** Affects approach but not viability
   - **Low Impact:** Nice to know, minimal consequence

3. **Assumption Types**
   - **Performance:** "System can handle X requests/sec"
   - **Scalability:** "Database can store Y records"
   - **Cost:** "Infrastructure will cost $Z/month"
   - **Capability:** "Technology supports feature X"
   - **Compatibility:** "Works with our existing stack"
   - **Security:** "Approach is secure against threat X"
   - **Usability:** "Users can complete task in N steps"
   - **Reliability:** "Uptime will be >99.9%"

4. **Validation Strategy**
   - Define test methodology for each assumption
   - Identify success criteria
   - Determine resources needed
   - Estimate validation time
   - Prioritize by risk and impact

**Outputs:**
- `assumptions-inventory.md` - All identified assumptions
- `assumptions-classified.md` - Categorized and prioritized list
- `validation-plan.md` - Strategy for testing each assumption
- `risk-matrix.md` - Risk assessment if assumptions are wrong

**Example Assumptions Inventory:**
```markdown
# Assumptions to Validate

## Critical Assumptions (Must Validate)

### A1: Performance - API Response Time
**Assumption:** Our API will respond in <100ms at p95 for 95% of requests
**Impact if Wrong:** User experience degraded, may violate SLA
**Validation Method:** Load test with realistic traffic pattern
**Success Criteria:** p95 latency <100ms at 5k req/sec
**Priority:** Critical
**Risk Level:** High

### A2: Scalability - Database Growth
**Assumption:** PostgreSQL can handle our projected 10M records efficiently
**Impact if Wrong:** Need to migrate database, significant rework
**Validation Method:** Load test database with 10M+ records
**Success Criteria:** Query time <50ms at 10M records
**Priority:** Critical
**Risk Level:** High

### A3: Cost - Infrastructure Spend
**Assumption:** AWS costs will stay under $5k/month at target scale
**Impact if Wrong:** Business model may not be viable
**Validation Method:** Cost modeling + load test extrapolation
**Success Criteria:** Projected cost ≤$5k at 100k users
**Priority:** Critical
**Risk Level:** Medium

## High Impact Assumptions

### A4: Compatibility - Existing System Integration
**Assumption:** New system can integrate with legacy API (SOAP)
**Impact if Wrong:** Need middleware layer, adds complexity
**Validation Method:** Build integration prototype
**Success Criteria:** Successfully call all 5 legacy endpoints
**Priority:** High
**Risk Level:** Medium

### A5: Security - JWT Token Approach
**Assumption:** JWT with 1-hour expiry is secure for our use case
**Impact if Wrong:** Security vulnerability, need different auth
**Validation Method:** Security review + penetration test
**Success Criteria:** No critical vulnerabilities found
**Priority:** High
**Risk Level:** High

## Medium Impact Assumptions

### A6: Developer Productivity
**Assumption:** TypeScript will improve code quality without slowing team
**Impact if Wrong:** Slower development, may revert to JavaScript
**Validation Method:** Prototype sprint with TS, measure velocity
**Success Criteria:** Velocity unchanged, <10 type errors/week
**Priority:** Medium
**Risk Level:** Low
```

### Phase 2: Parallel Validation Execution (15-70%)

**Objective:** Test all critical assumptions in parallel through experiments and data collection.

**Execution Pattern:**
```
Main Orchestrator
  ├─→ Assumption 1 Validator (parallel) → Evidence 1
  ├─→ Assumption 2 Validator (parallel) → Evidence 2
  ├─→ Assumption 3 Validator (parallel) → Evidence 3
  └─→ Assumption 4 Validator (parallel) → Evidence 4

[All execute simultaneously with isolated resources]
```

**For Each Assumption:**

1. **Experiment Setup**
   - Create test environment
   - Prepare test data
   - Install necessary tools
   - Configure monitoring

2. **Experiment Execution**
   - Run controlled test
   - Collect quantitative data
   - Document qualitative observations
   - Test edge cases
   - Stress test boundaries

3. **Data Collection**
   - Performance metrics
   - Resource utilization
   - Error rates
   - Cost projections
   - User feedback (if applicable)

4. **Result Documentation**
   - Pass/fail determination
   - Confidence level (high/medium/low)
   - Evidence supporting conclusion
   - Limitations of test
   - Recommendations if assumption fails

**Validation Methods by Type:**

**Performance Assumptions:**
```python
# Load test for API response time assumption
import locust

class APILoadTest(locust.HttpUser):
    @locust.task
    def test_endpoint(self):
        response = self.client.get("/api/endpoint")
        # Measure response time
        # Target: p95 <100ms

# Run: locust -f test.py --users 5000 --spawn-rate 100
# Analyze p95 latency from results
```

**Scalability Assumptions:**
```sql
-- Database scalability test
-- Generate 10M test records
INSERT INTO users
SELECT
    generate_series(1, 10000000) as id,
    'user' || generate_series(1, 10000000) as username,
    NOW() as created_at;

-- Test query performance
EXPLAIN ANALYZE
SELECT * FROM users WHERE username LIKE 'user123%';

-- Target: <50ms execution time
```

**Cost Assumptions:**
```bash
# Infrastructure cost validation
# 1. Deploy to staging at target scale
# 2. Run for 24 hours
# 3. Check AWS Cost Explorer

aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-02 \
  --granularity DAILY \
  --metrics BlendedCost \
  --group-by Type=DIMENSION,Key=SERVICE

# Extrapolate to monthly cost
# Target: ≤$5k/month
```

**Compatibility Assumptions:**
```typescript
// Integration test for legacy system compatibility
describe('Legacy SOAP API Integration', () => {
  it('should successfully call user lookup', async () => {
    const client = await soap.createClientAsync('http://legacy/api?wsdl');
    const result = await client.GetUserAsync({ userId: '12345' });

    expect(result.statusCode).toBe(200);
    expect(result.data.user).toBeDefined();
  });

  // Test all 5 required endpoints
});
```

**Security Assumptions:**
```bash
# Security validation for JWT approach
# 1. Token expiry test
# 2. Token tampering test
# 3. Token replay attack test
# 4. Penetration test

# Run OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://staging.example.com \
  -r security-report.html

# Check for critical vulnerabilities
# Target: 0 critical/high vulnerabilities
```

**Outputs:**
- `validation-results/assumption-1-[name]/`
  - `test-setup.md` - Experiment configuration
  - `raw-data.json` - Performance metrics, logs
  - `analysis.md` - Result interpretation
  - `conclusion.md` - Pass/fail + confidence level
- `validation-results/assumption-2-[name]/` (same structure)
- `validation-results/assumption-3-[name]/` (same structure)
- `evidence/` - Supporting artifacts (screenshots, logs, traces)

### Phase 3: Evidence Synthesis & Risk Assessment (70-85%)

**Objective:** Analyze all validation results, identify invalidated assumptions, and assess project risk.

**Tasks:**

1. **Result Aggregation**
   - Compile all validation results
   - Categorize by outcome (validated, invalidated, uncertain)
   - Calculate confidence levels
   - Identify conflicting evidence

2. **Risk Analysis**
   - Assess impact of invalidated assumptions
   - Identify project risks
   - Determine mitigation strategies
   - Update project plan if needed

3. **Decision Points**
   - **Validated Assumptions:** Proceed with confidence
   - **Invalidated Assumptions:** Revise approach or find alternatives
   - **Uncertain Assumptions:** Gather more evidence or accept risk

4. **Contingency Planning**
   - For each invalidated assumption, define plan B
   - Estimate impact on timeline and cost
   - Identify alternative approaches

**Results Summary Example:**
```markdown
# Validation Results Summary

## Validated Assumptions ✅ (3/6)

### A1: API Performance - VALIDATED ✅
**Evidence:** Load test shows p95 latency of 85ms at 5k req/sec
**Confidence:** High (95%)
**Impact:** Can proceed with planned architecture
**Details:** Tested with realistic payload sizes, actual database queries

### A2: Database Scalability - VALIDATED ✅
**Evidence:** Query performance remains <40ms at 12M records
**Confidence:** High (90%)
**Impact:** PostgreSQL sufficient, no need to migrate
**Details:** Tested with proper indexes, query optimization applied

### A4: Legacy Integration - VALIDATED ✅
**Evidence:** Successfully integrated with all 5 SOAP endpoints
**Confidence:** Medium (75%)
**Impact:** Integration layer feasible
**Details:** Some endpoints slow (200ms), may need caching
**Caveat:** Legacy API has undocumented rate limits (50 req/min)

## Invalidated Assumptions ❌ (2/6)

### A3: Infrastructure Cost - INVALIDATED ❌
**Evidence:** 24-hour test projects $7.2k/month, exceeds $5k target
**Confidence:** High (90%)
**Impact:** Need to optimize or revise budget
**Root Cause:** Database RDS costs higher than estimated ($3.5k vs $2k)
**Mitigation Options:**
1. Use smaller RDS instance with read replicas ($5.5k/month)
2. Migrate to Aurora Serverless ($4.8k/month)
3. Aggressive caching to reduce DB load
**Recommendation:** Option 2 (Aurora Serverless) + caching

### A5: JWT Security - INVALIDATED ❌
**Evidence:** Penetration test found token replay vulnerability
**Confidence:** High (95%)
**Impact:** Security risk, need different approach
**Root Cause:** No token revocation mechanism, compromised token valid until expiry
**Mitigation Options:**
1. Add token blacklist with Redis
2. Shorter token expiry (15min) + refresh tokens
3. Switch to session-based auth
**Recommendation:** Option 2 (short-lived tokens + refresh)

## Uncertain Assumptions ⚠️ (1/6)

### A6: Developer Productivity - UNCERTAIN ⚠️
**Evidence:** Mixed results from prototype sprint
**Details:**
- Velocity: 90% of baseline (acceptable)
- Type errors: 18/week (above 10 target)
- Team feedback: 3 positive, 2 negative
**Confidence:** Low (60%)
**Impact:** May affect long-term productivity
**Recommendation:** Extended trial (1 month) with training
**Alternative:** Gradually adopt TS for new code only
```

**Outputs:**
- `synthesis/validation-summary.md` - Overall results
- `synthesis/invalidated-assumptions.md` - Failed assumptions + mitigations
- `synthesis/risk-assessment.md` - Updated risk profile
- `synthesis/decision-matrix.md` - Recommendations for each assumption
- `synthesis/revised-plan.md` - Updated project plan

### Phase 4: Action Plan & Knowledge Capture (85-100%)

**Objective:** Create actionable recommendations and capture learnings for future reference.

**Tasks:**

1. **Action Plan Creation**
   - For validated assumptions: document evidence
   - For invalidated assumptions: implement mitigations
   - For uncertain assumptions: define next steps
   - Update architecture documents
   - Revise estimates and timelines

2. **Stakeholder Communication**
   - Executive summary of findings
   - Impact on project timeline/budget
   - Recommended course of action
   - Risk mitigation strategies

3. **Knowledge Capture**
   - Store validation methodology
   - Document learnings
   - Create reusable test templates
   - Update organizational knowledge

4. **Continuous Validation**
   - Set up monitoring for validated assumptions
   - Schedule re-validation for uncertain assumptions
   - Create alerts for assumption drift

**Outputs:**
- `action-plan.md` - Concrete next steps
- `executive-summary.md` - Stakeholder-friendly summary
- `implementation-guide.md` - How to address invalidated assumptions
- `monitoring-plan.md` - Ongoing validation strategy
- `knowledge-base/` - Captured patterns and learnings

## Agent Coordination

### Agent Selection by Assumption Type

**Performance Assumptions:**
- Primary: `performance-analyzer`
- Secondary: `backend-developer`, `database-specialist`

**Scalability Assumptions:**
- Primary: `database-specialist`, `infrastructure-engineer`
- Secondary: `performance-analyzer`

**Cost Assumptions:**
- Primary: `cost-optimizer`, cloud specialists
- Secondary: `architect`

**Security Assumptions:**
- Primary: `security-auditor`
- Secondary: `backend-developer`

**Compatibility Assumptions:**
- Primary: Domain specialists
- Secondary: `fullstack-developer`

### Parallel Execution Pattern

```
1. Identify and classify assumptions (sequential)
2. Launch validation in parallel:
   - Single message with N Task tool calls (one per critical assumption)
   - Each agent runs complete validation
   - Each outputs to separate results directory
   - All execute simultaneously for maximum speed
3. Synthesize results (sequential)
4. Create action plan (sequential)
```

**Speed Advantage:**
- Sequential: 5 assumptions × 2 hours each = 10 hours
- Parallel: 5 assumptions in parallel = 2 hours (5x speedup)

## Success Criteria

Validation is complete when:
- All critical assumptions tested empirically
- Clear pass/fail determination for each
- Confidence levels assessed
- Invalidated assumptions have mitigation plans
- Project risk reassessed
- Stakeholders informed of findings
- Action plan created and approved
- Knowledge captured for reuse

## Quality Gates

### Gate 1: Assumption Identification Quality
- All critical assumptions identified
- Assumptions are testable
- Success criteria are clear
- Validation methods are sound

### Gate 2: Validation Quality
- Tests are realistic and fair
- Data collected systematically
- Results are reproducible
- Confidence levels are justified

### Gate 3: Analysis Quality
- Evidence supports conclusions
- Mitigation strategies are practical
- Risks are honestly assessed
- Recommendations are actionable

## Example Usage

### Example 1: E-commerce Platform Assumptions
```
/orchestr8:validate-assumptions "
We're building an e-commerce platform with these assumptions:
1. PostgreSQL can handle 50M products efficiently
2. Stripe can process 1000 transactions/sec
3. AWS costs will be under $10k/month at 100k users
4. Next.js can achieve Lighthouse score >90
5. Redis can handle 100k concurrent sessions
"

Validation Results:
✅ A1: PostgreSQL - VALIDATED (indexed queries <30ms at 50M products)
✅ A2: Stripe - VALIDATED (supports 1k/sec, tested in sandbox)
❌ A3: AWS Costs - INVALIDATED ($14k projected, need optimization)
✅ A4: Next.js - VALIDATED (Lighthouse 94 achieved)
⚠️ A5: Redis - UNCERTAIN (works but high memory usage, may need cluster)

Actions Required:
- Implement cost optimizations (estimated savings: $4.5k/month)
- Extended Redis testing under production load
- All other assumptions validated, proceed with confidence
```

### Example 2: Microservices Migration Assumptions
```
/orchestr8:validate-assumptions "
Migrating to microservices with assumptions:
1. Team can handle distributed system complexity
2. Service boundaries are clear
3. Network latency won't degrade performance
4. Kubernetes learning curve is manageable
5. Monitoring overhead is acceptable
"

Validation Results:
⚠️ A1: Team Capability - UNCERTAIN (need training, mixed skill levels)
✅ A2: Service Boundaries - VALIDATED (clear domain boundaries found)
❌ A3: Network Latency - INVALIDATED (adds 50-80ms per service hop)
❌ A4: K8s Learning Curve - INVALIDATED (steeper than expected, 3-month ramp)
✅ A5: Monitoring - VALIDATED (Prometheus/Grafana working well)

Recommendation: Delay migration
- Start with modular monolith
- Extract 1-2 services to gain experience
- Invest in team training
- Re-evaluate in 6 months
```

### Example 3: Security Architecture Assumptions
```
/orchestr8:validate-assumptions "
Security architecture assumes:
1. OAuth2 + JWT is sufficient for our use case
2. Data encryption at rest is enough
3. API rate limiting prevents abuse
4. HTTPS everywhere covers transport security
5. Regular dependency updates prevent vulnerabilities
"

Validation Results:
❌ A1: OAuth2/JWT - INVALIDATED (token revocation issue found)
✅ A2: Encryption at Rest - VALIDATED (compliant with requirements)
❌ A3: Rate Limiting - INVALIDATED (sophisticated attacks bypass simple limits)
✅ A4: HTTPS - VALIDATED (all endpoints secured)
✅ A5: Dependencies - VALIDATED (automated updates working)

Actions Required:
- Implement token blacklist (Redis) for revocation
- Add intelligent rate limiting (per-user + IP + pattern detection)
- Security audit passed after fixes
```

## Best Practices

### DO
- Identify assumptions early in project lifecycle
- Test critical assumptions before significant investment
- Use realistic test scenarios and data
- Document methodology for reproducibility
- Be honest about invalidated assumptions
- Create mitigation plans for failures
- Share findings with stakeholders promptly
- Capture learnings for future projects

### DON'T
- Assume your assumptions are correct
- Skip validation to "save time"
- Use unrealistic test scenarios
- Hide or downplay negative results
- Proceed without mitigation plans
- Ignore uncertain assumptions
- Forget to re-validate as context changes

## Integration with Knowledge Base

All validation results are stored for future reference:

```bash
# Store validation methodology
db_store_knowledge "validation" "methodology" "$ASSUMPTION_TYPE" \
  "Validation approach for $ASSUMPTION" \
  "$(cat validation-plan.md)"

# Store invalidated assumptions and fixes
db_store_knowledge "validation" "lesson-learned" "$ASSUMPTION_NAME" \
  "Assumption invalidated: $FINDING, mitigation: $FIX" \
  "$(cat mitigation-plan.md)"

# Query similar past validations
db_query_knowledge "validation" "$ASSUMPTION_TYPE" 10
```

## Fire-and-Forget Pattern

This workflow supports async execution:

```bash
# Launch validation in background
/orchestr8:validate-assumptions "List of assumptions..."

# Workflow runs autonomously:
# - Classifies and prioritizes assumptions
# - Runs validation experiments in parallel
# - Analyzes results and creates mitigation plans
# - Generates stakeholder reports

# Returns when complete with validation summary and action plan
```

## Notes

- Validation is an investment that pays off through risk reduction
- Failed assumptions discovered early are much cheaper to fix
- Not all assumptions need validation: prioritize by risk and impact
- Re-validate assumptions as context changes
- Build continuous validation into monitoring
- Fire-and-forget execution allows long-running validations without blocking

**Remember:** "In God we trust; all others bring data." Validate assumptions before they become costly mistakes.
