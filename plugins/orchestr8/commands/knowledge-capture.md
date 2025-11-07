---
description: Capture organizational knowledge including patterns, anti-patterns, performance baselines, validated assumptions, technology comparisons, and refactoring opportunities
argument-hint: [type] [details]
model: claude-sonnet-4-5-20250929
---

# Knowledge Capture Command

Capture organizational knowledge to build a searchable, evidence-based knowledge base that improves decision-making and prevents repeated mistakes.

## Usage

```bash
# Capture a discovered pattern
/orchestr8:knowledge-capture pattern "category:architecture title:'Microservices API Gateway' ..."

# Record an anti-pattern
/orchestr8:knowledge-capture anti-pattern "category:code title:'God Object' ..."

# Log performance baseline
/orchestr8:knowledge-capture performance "component:api operation:get-users p50:45ms p95:120ms ..."

# Validate assumption
/orchestr8:knowledge-capture assumption "category:scalability assumption:'Horizontal scaling...' ..."

# Compare technologies
/orchestr8:knowledge-capture comparison "PostgreSQL vs MongoDB for user data"

# Identify refactoring opportunity
/orchestr8:knowledge-capture refactoring "component:auth-service priority:high ..."
```

## Knowledge Types

### 1. Pattern
Successful approaches that work well in practice.

**Required fields:**
- `category`: architecture|code|deployment|testing|security|performance
- `title`: Pattern name
- `problem`: What problem does this solve?
- `solution`: How does this pattern address it?
- `implementation`: Code/config examples

**Optional fields:**
- `contexts`: Where this applies
- `tags`: Searchable tags

**Example:**
```bash
/orchestr8:knowledge-capture pattern "
category: architecture
title: API Gateway with Circuit Breaker
problem: Microservices need centralized routing and fault tolerance
solution: Implement API Gateway with circuit breaker pattern to prevent cascade failures
implementation: Using Kong Gateway with circuit breaker plugin configured for 50% failure rate threshold
contexts: [microservices, high-availability, distributed-systems]
tags: [api-gateway, circuit-breaker, resilience, kong]
"
```

### 2. Anti-Pattern
Approaches that should be avoided, with evidence of failures.

**Required fields:**
- `category`: architecture|code|deployment|testing|security|performance
- `title`: Anti-pattern name
- `description`: What is this anti-pattern?
- `why_bad`: Why should it be avoided?
- `alternative`: What to do instead

**Optional fields:**
- `severity`: low|medium|high|critical
- `tags`: Searchable tags

**Example:**
```bash
/orchestr8:knowledge-capture anti-pattern "
category: performance
title: N+1 Query Problem
description: Loading a list of entities then making separate queries for each entity's relationships
why_bad: Causes exponential query growth. 100 users = 101 queries instead of 2 queries. Degrades performance by 50-100x.
alternative: Use eager loading with JOIN or IN clauses to load all data in 1-2 queries
severity: high
tags: [database, performance, orm, sql]
"
```

### 3. Performance Baseline
Performance benchmarks and historical trends.

**Required fields:**
- `component`: Component name
- `operation`: Operation being measured
- `environment`: development|staging|production
- `p50`: 50th percentile response time (ms)
- `p95`: 95th percentile response time (ms)
- `p99`: 99th percentile response time (ms)
- `throughput`: Requests per second

**Optional fields:**
- `tags`: Searchable tags

**Example:**
```bash
/orchestr8:knowledge-capture performance "
component: user-api
operation: GET /api/users
environment: production
p50: 45
p95: 120
p99: 250
throughput: 1500
tags: [api, rest, users]
"
```

### 4. Validated Assumption
Tested assumptions with validation results.

**Required fields:**
- `category`: architecture|performance|scalability|security|user-behavior|cost
- `assumption`: The assumption being tested
- `status`: validated|invalidated|partially-validated|inconclusive
- `test_method`: How was this tested?
- `results`: What did the test show?
- `conclusion`: What does this mean?

**Optional fields:**
- `confidence`: 0.0-1.0
- `tags`: Searchable tags

**Example:**
```bash
/orchestr8:knowledge-capture assumption "
category: performance
assumption: Redis caching will reduce database load by 80%
status: validated
test_method: Load test with and without Redis cache over 1 hour with 1000 concurrent users
results: Database queries reduced from 50000/min to 8000/min (84% reduction). Response time improved from 250ms p95 to 85ms p95.
conclusion: Assumption validated. Redis caching achieves >80% database load reduction with 3x response time improvement.
confidence: 0.95
tags: [caching, redis, performance, database]
"
```

### 5. Technology Comparison
Comparative analysis of technology choices.

**Required fields:**
- `category`: language|framework|database|infrastructure|tool
- `comparison`: Technology A vs Technology B
- `context`: Use case or project context
- `decision`: Which option was chosen
- `rationale`: Why was it chosen?

**Optional fields:**
- `tags`: Searchable tags

**Example:**
```bash
/orchestr8:knowledge-capture comparison "
category: database
comparison: PostgreSQL vs MongoDB
context: User profile storage with complex queries and ACID requirements
decision: PostgreSQL
rationale: Need for ACID transactions, complex joins, and strong schema validation. PostgreSQL provides better query performance for our relational data model and has excellent JSON support for flexibility.
tags: [database, postgresql, mongodb, sql, nosql]
"
```

### 6. Refactoring Opportunity
Identified improvements ranked by ROI.

**Required fields:**
- `component`: Component or file path
- `category`: code-smell|architecture|performance|security|maintainability
- `priority`: low|medium|high|critical
- `estimated_effort`: Time estimate (e.g., "2 days", "40 hours")
- `estimated_impact`: low|medium|high
- `description`: Current problematic state
- `proposed_solution`: What changes should be made

**Optional fields:**
- `tags`: Searchable tags

**Example:**
```bash
/orchestr8:knowledge-capture refactoring "
component: src/services/auth-service.ts
category: maintainability
priority: high
estimated_effort: 3 days
estimated_impact: high
description: Auth service has grown to 1200 lines with mixed responsibilities (authentication, authorization, token management, password reset, email verification)
proposed_solution: Split into separate services following Single Responsibility Principle: AuthenticationService, AuthorizationService, TokenService, PasswordService, EmailVerificationService
tags: [refactoring, solid, maintainability, auth]
"
```

## Execution Instructions

### Phase 1: Parse Input (5%)

**Parse the knowledge capture request**:

1. Extract knowledge type: pattern|anti-pattern|performance|assumption|comparison|refactoring
2. Parse all required fields for that type
3. Parse optional fields if provided
4. Validate all required fields are present

**Validation**:
```bash
if [ -z "$type" ]; then
  echo "Error: Knowledge type not specified"
  exit 1
fi

# Type-specific validation
case "$type" in
  pattern)
    # Validate required fields: category, title, problem, solution, implementation
    ;;
  anti-pattern)
    # Validate required fields: category, title, description, why_bad, alternative
    ;;
  performance)
    # Validate required fields: component, operation, environment, p50, p95, p99, throughput
    ;;
  assumption)
    # Validate required fields: category, assumption, status, test_method, results, conclusion
    ;;
  comparison)
    # Validate required fields: category, comparison, context, decision, rationale
    ;;
  refactoring)
    # Validate required fields: component, category, priority, estimated_effort, estimated_impact, description, proposed_solution
    ;;
esac
```

**CHECKPOINT**: All required fields validated ✓

### Phase 2: Knowledge Capture (80%)

**Load knowledge capture library**:
```bash
source .claude/knowledge/lib/knowledge-capture.sh
init_knowledge_system
```

**Capture knowledge based on type**:

#### For Pattern
```bash
file_path=$(capture_pattern \
  "$category" \
  "$title" \
  "$problem" \
  "$solution" \
  "$implementation" \
  "$contexts" \
  "$tags")

echo "Pattern captured: $file_path"
```

#### For Anti-Pattern
```bash
file_path=$(capture_anti_pattern \
  "$category" \
  "$title" \
  "$description" \
  "$why_bad" \
  "$alternative" \
  "$severity" \
  "$tags")

echo "Anti-pattern captured: $file_path"
```

#### For Performance Baseline
```bash
file_path=$(capture_performance_baseline \
  "$component" \
  "$operation" \
  "$environment" \
  "$p50" \
  "$p95" \
  "$p99" \
  "$throughput" \
  "$tags")

echo "Performance baseline captured: $file_path"
```

#### For Assumption
```bash
file_path=$(capture_assumption \
  "$category" \
  "$assumption" \
  "$status" \
  "$test_method" \
  "$results" \
  "$conclusion" \
  "$confidence" \
  "$tags")

echo "Assumption captured: $file_path"
```

#### For Technology Comparison
```bash
file_path=$(capture_technology_comparison \
  "$category" \
  "$comparison" \
  "$context" \
  "$decision" \
  "$rationale" \
  "$tags")

echo "Technology comparison captured: $file_path"
```

#### For Refactoring Opportunity
```bash
file_path=$(capture_refactoring_opportunity \
  "$component" \
  "$category" \
  "$priority" \
  "$estimated_effort" \
  "$estimated_impact" \
  "$description" \
  "$proposed_solution" \
  "$tags")

echo "Refactoring opportunity captured: $file_path"
```

**CHECKPOINT**: Knowledge captured to file ✓

### Phase 3: Verification and Enhancement (10%)

**Verify file was created**:
```bash
if [ ! -f "$file_path" ]; then
  echo "Error: Failed to create knowledge file"
  exit 1
fi

echo "Knowledge file created successfully: $file_path"
```

**Display capture summary**:
```bash
echo ""
echo "=== Knowledge Capture Summary ==="
echo "Type: $type"
echo "File: $file_path"
echo ""
echo "Preview:"
head -30 "$file_path"
echo ""
echo "Full content available at: $file_path"
```

**Provide enhancement suggestions**:
```bash
echo ""
echo "=== Next Steps ==="
echo "1. Review and enhance the captured knowledge with additional details"
echo "2. Add code examples, benchmarks, or evidence as needed"
echo "3. Link to related knowledge items"
echo "4. Use /orchestr8:knowledge-search to find related items"
echo "5. Update this item as you gain more experience with this knowledge"
```

**CHECKPOINT**: Knowledge capture complete ✓

### Phase 4: Knowledge Base Update (5%)

**Update knowledge base statistics**:
```bash
echo ""
echo "=== Updated Knowledge Base Statistics ==="
knowledge_stats
```

**CHECKPOINT**: Statistics updated ✓

## Success Criteria

Knowledge capture is complete when:
- ✅ Knowledge type identified and validated
- ✅ All required fields extracted
- ✅ Knowledge file created successfully
- ✅ File contains properly formatted frontmatter
- ✅ Content is searchable and retrievable
- ✅ Knowledge base statistics updated
- ✅ User can immediately search for this knowledge

## Example Usage

### Example 1: Capturing a Successful Pattern
```bash
/orchestr8:knowledge-capture pattern "
category: architecture
title: Event-Driven Microservices with Kafka
problem: Services need to communicate asynchronously with guaranteed delivery and event replay capability
solution: Implement event-driven architecture using Kafka as message broker with event sourcing
implementation: Each service publishes domain events to Kafka topics. Consumers process events asynchronously. Events are immutable and retained for replay.
contexts: [microservices, event-driven, distributed-systems, high-throughput]
tags: [kafka, event-sourcing, messaging, microservices, async]
"
```

**Autonomous execution**:
1. Parse input and validate fields (5%)
2. Capture pattern to .claude/knowledge/patterns/ (80%)
3. Verify file creation and display preview (10%)
4. Update knowledge base statistics (5%)

**Duration**: ~30 seconds

### Example 2: Recording an Anti-Pattern
```bash
/orchestr8:knowledge-capture anti-pattern "
category: security
title: Hardcoded Credentials
description: Storing API keys, passwords, or secrets directly in source code
why_bad: Credentials are visible to anyone with code access, committed to version control, and difficult to rotate. Leads to security breaches and compliance violations.
alternative: Use environment variables, secret management services (AWS Secrets Manager, HashiCorp Vault), or encrypted configuration files with restricted access
severity: critical
tags: [security, credentials, secrets, compliance]
"
```

**Duration**: ~30 seconds

### Example 3: Establishing Performance Baseline
```bash
/orchestr8:knowledge-capture performance "
component: checkout-api
operation: POST /api/checkout
environment: production
p50: 450
p95: 890
p99: 1500
throughput: 350
tags: [api, checkout, payment, critical-path]
"
```

**Duration**: ~30 seconds

## Anti-Patterns

### DON'T ❌
- Capture knowledge without evidence or experience
- Use vague or generic descriptions
- Skip required fields
- Forget to add searchable tags
- Capture opinions as facts
- Ignore context and constraints
- Fail to link related knowledge items

### DO ✅
- Base knowledge on real experience and data
- Be specific and concrete in descriptions
- Include all required fields
- Add descriptive, searchable tags
- Distinguish facts from opinions
- Document context and applicability
- Cross-reference related knowledge
- Update knowledge items as you learn more
- Quantify benefits and trade-offs when possible

## Notes

- Knowledge items are automatically timestamped
- Files use unique IDs to prevent conflicts
- All knowledge is searchable via /orchestr8:knowledge-search
- Knowledge items can be updated with new evidence over time
- The knowledge base grows with every capture, building organizational memory
- Use knowledge-researcher agent to query and synthesize captured knowledge
