---
description: Transform legacy codebases to modern patterns, languages, and architectures with risk assessment and incremental migration
argument-hint: [legacy-system-path-or-description]
model: claude-opus-4-1-20250805
---

# Modernize Legacy Workflow

Autonomous transformation of legacy codebases to modern patterns, languages, and architectures.

## Intelligence Database Integration

```bash

# Initialize workflow

echo "🚀 Starting Legacy Modernization Workflow"
echo "Target: $1"
echo "Workflow ID: $workflow_id"

# Query similar modernization patterns
```

---

## Phase 1: Assessment & Strategy (0-20%)

**Objective**: Analyze legacy system and create modernization roadmap

**⚡ EXECUTE TASK TOOL:**
```
Use the code-archaeologist agent to:
1. Identify technologies, frameworks, versions
2. Calculate code metrics (lines, complexity, test coverage)
3. Map dependencies and architecture
4. Identify deprecated APIs and libraries
5. Assess security vulnerabilities
6. Create risk assessment
7. Develop modernization strategy

subagent_type: "orchestr8:quality:debugger"
description: "Analyze legacy codebase and create modernization roadmap"
prompt: "Analyze legacy system for modernization: $1

Tasks:

1. **Codebase Analysis**
   - Identify all technologies and frameworks in use
   - Detect language versions (e.g., Python 2.7, Java 8, Node 10)
   - Calculate code metrics:
     \`\`\`bash
     # Lines of code
     find . -name '*.py' -o -name '*.js' -o -name '*.java' | xargs wc -l

     # Cyclomatic complexity
     radon cc . -a  # Python
     # or appropriate tool for language

     # Test coverage
     pytest --cov=. --cov-report=term  # Python
     # or appropriate test runner
     \`\`\`
   - Map dependency tree
   - Generate architecture diagram
   - Identify deprecated APIs via:
     \`\`\`bash
     # Check for deprecated dependencies
     npm audit  # Node.js
     pip check  # Python
     mvn versions:display-dependency-updates  # Java
     \`\`\`

2. **Risk Assessment**
   - Identify business-critical code paths
   - Assess data migration complexity
   - Map integration touchpoints (external APIs, services)
   - Determine downtime tolerance
   - Define rollback requirements
   - Create risk matrix (likelihood × impact)

3. **Modernization Strategy**
   - Choose approach:
     * Strangler Fig (recommended for large systems)
     * Branch by Abstraction
     * Parallel Run
     * Big Bang (only for small systems)
   - Select target technology stack
   - Prioritize migration phases
   - Define success metrics (performance, maintainability, test coverage)
   - Estimate timeline and effort

Expected outputs:
- code-analysis-report.md with:
  - Technology inventory
  - Code metrics dashboard
  - Complexity hotspots
  - Test coverage gaps
  - Deprecated API list
  - Security vulnerabilities
- dependency-graph.png (visualization)
- migration-strategy.md with:
  - Chosen approach and rationale
  - Target stack
  - Phase prioritization
  - Timeline (weeks/months)
- risk-matrix.md (risks with mitigation plans)
"
```

**Expected Outputs:**
- `code-analysis-report.md` - Complete analysis with metrics
- `dependency-graph.png` - Dependency visualization
- `migration-strategy.md` - Detailed modernization strategy
- `risk-matrix.md` - Risk assessment with mitigations

**Quality Gate: Assessment Validation**
```bash
# Validate analysis report exists
if [ ! -f "code-analysis-report.md" ]; then
  echo "❌ Code analysis report not created"
  exit 1
fi

# Validate strategy document exists
if [ ! -f "migration-strategy.md" ]; then
  echo "❌ Migration strategy not created"
  exit 1
fi

# Validate risk assessment exists
if [ ! -f "risk-matrix.md" ]; then
  echo "❌ Risk matrix not created"
  exit 1
fi

echo "✅ Assessment and strategy complete"
```

**Track Progress:**
```bash
TOKENS_USED=6000

# Store assessment results
  "Legacy system assessment and strategy" \
  "$(head -n 50 code-analysis-report.md)"
```

---

## Phase 2: Test Coverage Establishment (20-40%)

**Objective**: Create comprehensive test suite for legacy code

**⚡ EXECUTE TASK TOOL:**
```
Use the test-engineer agent to:
1. Create characterization tests documenting current behavior
2. Create snapshot tests for critical paths
3. Implement integration tests for external dependencies
4. Implement end-to-end tests for business workflows
5. Establish performance baselines

subagent_type: "orchestr8:quality:test-engineer"
description: "Create comprehensive test suite for legacy code"
prompt: "Create test coverage for legacy system: $1

Based on code-analysis-report.md, implement:

1. **Characterization Tests**
   - Document current behavior before changes
   - Test all critical code paths identified in analysis
   - Include edge cases and error conditions
   - Establish performance baselines

   Example:
   \`\`\`python
   # Characterization test - captures current behavior
   def test_legacy_calculation_behavior():
       '''Test documents current behavior before refactoring'''
       assert legacy_calculate(100, 10) == 110  # Current output
       assert legacy_calculate(0, 5) == 5
       assert legacy_calculate(-10, 10) == 0

       # Edge cases
       assert legacy_calculate(None, 5) == 5  # Handles None
       assert legacy_calculate(100, None) == 100

   # Approval testing for complex outputs
   import approvaltests
   @approvaltests.verify()
   def test_legacy_report_generation():
       return legacy_generate_report(sample_data)
   \`\`\`

2. **Integration Tests**
   - Test database operations (CRUD operations)
   - Test external API integrations
   - Test file system operations
   - Test message queue interactions
   - Mock external dependencies appropriately

3. **End-to-End Tests**
   - Test critical user journeys end-to-end
   - Test business workflows completely
   - Validate data integrity across system
   - Test error handling and recovery

4. **Performance Baselines**
   \`\`\`python
   import time
   import pytest

   def test_performance_baseline():
       start = time.time()
       result = legacy_fetch_users(limit=1000)
       execution_time = time.time() - start

       # Record baseline (will compare after modernization)
       pytest.baseline_time = execution_time
       assert execution_time < 5.0  # Max acceptable time
   \`\`\`

5. **Coverage Analysis**
   \`\`\`bash
   # Run coverage
   pytest --cov=. --cov-report=html --cov-report=term

   # Target: 80%+ coverage on critical paths
   \`\`\`

Expected outputs:
- tests/characterization/ - Characterization test suite
- tests/integration/ - Integration test suite
- tests/e2e/ - End-to-end test suite
- performance-baselines.json - Performance metrics
- coverage-report/ - HTML coverage report
"
```

**Expected Outputs:**
- `tests/characterization/` - Characterization tests
- `tests/integration/` - Integration tests
- `tests/e2e/` - End-to-end tests
- `performance-baselines.json` - Performance metrics
- `coverage-report/` - HTML coverage report

**Quality Gate: Test Coverage Validation**
```bash
# Validate test directories exist
if [ ! -d "tests/characterization" ]; then
  echo "❌ Characterization tests not created"
  exit 1
fi

# Run tests to ensure they pass
if ! pytest tests/ -v; then
  echo "❌ Tests failing"
  exit 1
fi

# Check coverage (target: 80%+ on critical paths)
COVERAGE=$(pytest --cov=. --cov-report=term | grep "TOTAL" | awk '{print $4}' | sed 's/%//')
if [ "$COVERAGE" -lt 80 ]; then
  echo "⚠️  Coverage below 80%: ${COVERAGE}%"
  echo "Continue with caution"
fi

echo "✅ Test coverage established (${COVERAGE}%)"
```

**Track Progress:**
```bash
TOKENS_USED=7000

# Store test suite info
  "Test suite with ${COVERAGE}% coverage" \
  "Characterization, integration, and e2e tests created"
```

---

## Phase 3: Incremental Modernization (40-70%)

**Objective**: Modernize codebase incrementally with continuous validation

**⚡ EXECUTE TASK TOOL:**
```
Use the appropriate language specialist agent to:
1. Implement modernization strategy (from migration-strategy.md)
2. Apply appropriate pattern (Strangler Fig, Branch by Abstraction, Parallel Run)
3. Modernize incrementally with continuous testing
4. Handle language upgrades, framework migrations, or architecture refactoring
5. Validate at each increment

subagent_type: "[orchestr8:languages:python-developer|orchestr8:languages:typescript-developer|orchestr8:languages:java-developer|orchestr8:languages:go-developer|orchestr8:languages:rust-developer|orchestr8:development:architect]"
description: "Modernize legacy code incrementally"
prompt: "Modernize legacy system incrementally: $1

Based on migration-strategy.md, implement modernization:

**Modernization Patterns:**

1. **Strangler Fig Pattern** (recommended for large systems):
   \`\`\`python
   # Step 1: Create modern implementation alongside legacy
   class ModernUserService:
       def create_user(self, data: UserCreateDTO) -> User:
           validated_data = UserCreateSchema.validate(data)
           return self.repository.create(validated_data)

   # Step 2: Route traffic conditionally
   class UserServiceRouter:
       def create_user(self, data):
           if feature_flags.use_modern_user_service():
               return modern_user_service.create_user(data)
           else:
               return legacy_user_service.create_user(data)

   # Step 3: Gradually increase traffic to modern service
   # Step 4: Remove legacy code once 100% migrated
   \`\`\`

2. **Branch by Abstraction**:
   \`\`\`typescript
   // Step 1: Extract interface
   interface PaymentProcessor {
     process(amount: number, card: CardDetails): Promise<PaymentResult>;
   }

   // Step 2: Legacy wrapper
   class LegacyPaymentProcessor implements PaymentProcessor {
     async process(amount: number, card: CardDetails): Promise<PaymentResult> {
       return legacyProcessPayment(amount, card);
     }
   }

   // Step 3: Modern implementation
   class StripePaymentProcessor implements PaymentProcessor {
     async process(amount: number, card: CardDetails): Promise<PaymentResult> {
       return this.stripe.charges.create({ amount, source: card.token });
     }
   }

   // Step 4: Switch implementations via config
   const processor: PaymentProcessor = config.useModernPayment
     ? new StripePaymentProcessor()
     : new LegacyPaymentProcessor();
   \`\`\`

3. **Parallel Run**:
   \`\`\`java
   public class ParallelRunMigration {
       public Result processOrder(Order order) {
           Result legacyResult = legacyOrderProcessor.process(order);

           CompletableFuture.runAsync(() -> {
               try {
                   Result modernResult = modernOrderProcessor.process(order);

                   if (!legacyResult.equals(modernResult)) {
                       logger.warn(\"Discrepancy: {} vs {}\", legacyResult, modernResult);
                       metrics.incrementDiscrepancies();
                   }
               } catch (Exception e) {
                   logger.error(\"Modern implementation failed\", e);
               }
           });

           return legacyResult;  // Safe fallback
       }
   }
   \`\`\`

**Modernization by Type:**

**A. Language Upgrade** (e.g., Python 2→3, Java 8→17):
1. Update syntax (print statements → functions)
2. Replace deprecated APIs
3. Update dependencies
4. Add/fix type annotations
5. Run automated tools (2to3, OpenRewrite)
   \`\`\`bash
   # Python 2 to 3
   2to3 --print-diff src/  # Preview changes
   2to3 -w src/  # Apply changes
   pytest tests/  # Validate
   \`\`\`

**B. Framework Migration** (e.g., Django 2→4, React class→hooks):
1. Update routing/middleware
2. Migrate ORM changes
3. Update template/component syntax
4. Replace deprecated components
5. Update auth/session handling

**C. Architecture Refactoring** (e.g., Monolith→Microservices):
1. Identify bounded contexts
2. Extract domain logic
3. Create service interfaces
4. Implement event-driven communication
5. Deploy services incrementally

**Incremental Process:**
For each increment:
1. Make small, focused change
2. Run full test suite
3. Validate no regressions
4. Commit
5. Move to next increment

Expected outputs:
- Modernized codebase (incremental commits)
- All tests passing after each increment
- Feature flag configuration (if using flags)
- Migration log documenting changes
"
```

**Expected Outputs:**
- Modernized codebase with incremental commits
- All tests passing
- `feature-flags.yaml` - Feature flag configuration (if applicable)
- `migration-log.md` - Detailed change log

**Quality Gate: Modernization Validation**
```bash
# Run full test suite
if ! pytest tests/ -v; then
  echo "❌ Tests failing after modernization"
  exit 1
fi

# Check coverage hasn't decreased
CURRENT_COVERAGE=$(pytest --cov=. --cov-report=term | grep "TOTAL" | awk '{print $4}' | sed 's/%//')
if [ "$CURRENT_COVERAGE" -lt "$COVERAGE" ]; then
  echo "❌ Coverage decreased from ${COVERAGE}% to ${CURRENT_COVERAGE}%"
  exit 1
fi

# Security scan
if command -v bandit &> /dev/null; then
  if ! bandit -r . -ll; then
    echo "❌ Security issues detected"
    exit 1
  fi
fi

echo "✅ Modernization complete with all tests passing"
```

**Track Progress:**
```bash
TOKENS_USED=10000

# Store modernization results
  "Modernized with ${CURRENT_COVERAGE}% coverage" \
  "$(tail -n 50 migration-log.md)"
```

---

## Phase 4: Data Migration (70-80%)

**Objective**: Migrate data with zero data loss (if applicable)

**⚡ EXECUTE TASK TOOL:**
```
Use the database-specialist agent to:
1. Design new database schema
2. Create migration scripts
3. Implement dual-write strategy
4. Create data transformation pipelines
5. Plan cutover strategy

subagent_type: "database-specialists:postgresql-specialist"
description: "Migrate data with zero data loss"
prompt: "Implement data migration for modernization: $1

Based on code-analysis-report.md and migration-strategy.md:

1. **Schema Migration Design**
   - Design new schema matching modern architecture
   - Create migration scripts (up/down)
   - Plan for data type changes
   - Design indexes for performance
   - Test on production-like data

2. **Data Transformation**
   - Create ETL pipelines
   - Handle data type conversions
   - Validate data integrity
   - Handle nulls and edge cases
   - Implement data quality checks

3. **Dual-Write Strategy**
   \`\`\`python
   def save_user(user_data):
       # Write to both databases during transition
       try:
           legacy_db.save_user(transform_to_legacy(user_data))
           new_db.save_user(user_data)
       except Exception as e:
           # Rollback both on failure
           logger.error(f\"Dual-write failed: {e}\")
           raise

   def get_user(user_id):
       # Read from new, fallback to legacy
       user = new_db.get_user(user_id)
       if not user:
           user = legacy_db.get_user(user_id)
           if user:
               # Backfill new DB
               new_db.save_user(user)
       return user
   \`\`\`

4. **Cutover Plan**
   - Phase 1: Start dual-write (writes to both DBs)
   - Phase 2: Backfill data from legacy to new
   - Phase 3: Verify data consistency
   - Phase 4: Switch reads to new DB
   - Phase 5: Stop writes to legacy DB
   - Phase 6: Keep legacy as backup for rollback

5. **Data Validation**
   \`\`\`bash
   # Compare record counts
   legacy_count=\$(psql -c \"SELECT COUNT(*) FROM users\" legacy_db)
   new_count=\$(psql -c \"SELECT COUNT(*) FROM users\" new_db)

   # Sample validation
   # Compare random samples from both DBs
   \`\`\`

Expected outputs:
- migration-scripts/ - Database migration files
- data-transformation.py - ETL pipeline
- validation-report.md - Data consistency validation
- cutover-plan.md - Step-by-step cutover procedure
- rollback-plan.md - Emergency rollback procedure
"
```

**Expected Outputs:**
- `migration-scripts/` - Database migration files
- `data-transformation.py` - ETL pipeline
- `validation-report.md` - Data consistency checks
- `cutover-plan.md` - Cutover procedure
- `rollback-plan.md` - Rollback procedure

**Quality Gate: Data Migration Validation**
```bash
# Validate migration scripts exist (if schema changes needed)
if grep -q "database schema" migration-strategy.md; then
  if [ ! -d "migration-scripts" ]; then
    echo "❌ Migration scripts not created"
    exit 1
  fi

  # Test migrations
  if ! bash migration-scripts/test-migrations.sh; then
    echo "❌ Migration tests failed"
    exit 1
  fi
fi

echo "✅ Data migration prepared and validated"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store migration info
  "Data migration with dual-write strategy" \
  "$(head -n 30 cutover-plan.md)"
```

---

## Phase 5: Performance Optimization (80-90%)

**Objective**: Ensure modern code performs better than legacy

**⚡ EXECUTE TASK TOOL:**
```
Use the performance-analyzer agent to:
1. Benchmark modern vs legacy performance
2. Identify bottlenecks
3. Implement optimizations (caching, query optimization)
4. Run load testing
5. Validate performance improvements

subagent_type: "orchestr8:quality:load-testing-specialist"
description: "Optimize performance and validate improvements"
prompt: "Optimize modernized codebase performance: $1

Based on performance-baselines.json:

1. **Benchmark Comparison**
   \`\`\`python
   import pytest
   import time

   def test_performance_comparison():
       # Load baseline from characterization tests
       baseline_time = pytest.baseline_time

       # Modern implementation
       start = time.time()
       modern_result = modern_fetch_users(limit=1000)
       modern_time = time.time() - start

       # Assert improvement or parity
       assert modern_time <= baseline_time * 1.2  # Allow 20% variance

       print(f\"Legacy: {baseline_time:.2f}s, Modern: {modern_time:.2f}s\")
       print(f\"Improvement: {((baseline_time - modern_time) / baseline_time * 100):.1f}%\")
   \`\`\`

2. **Identify Bottlenecks**
   \`\`\`bash
   # Profile application
   python -m cProfile -o profile.stats app.py
   python -m pstats profile.stats

   # Or use py-spy for production
   py-spy record -o profile.svg -- python app.py
   \`\`\`

3. **Optimization Implementation**
   - Add caching (Redis, Memcached)
   - Optimize database queries (fix N+1 problems)
   - Add database indexes
   - Implement lazy loading
   - Use connection pooling
   - Compress responses
   - Enable CDN for static assets

4. **Load Testing**
   \`\`\`bash
   # Use k6, Locust, or JMeter
   k6 run --vus 100 --duration 30s load-test.js
   \`\`\`

5. **Memory Analysis**
   - Check for memory leaks
   - Profile memory usage
   - Optimize resource cleanup

Expected outputs:
- performance-report.md with:
  - Benchmark comparisons (legacy vs modern)
  - Identified bottlenecks
  - Optimization strategies implemented
  - Load testing results
- profile-analysis/ - Profiling data
- optimization-log.md - Changes made for performance
"
```

**Expected Outputs:**
- `performance-report.md` - Performance analysis
- `profile-analysis/` - Profiling data
- `optimization-log.md` - Optimization changes
- `load-test-results/` - Load testing data

**Quality Gate: Performance Validation**
```bash
# Validate performance report exists
if [ ! -f "performance-report.md" ]; then
  echo "❌ Performance report not created"
  exit 1
fi

# Run performance tests
if ! pytest tests/performance/ -v; then
  echo "⚠️  Performance tests failed"
  echo "Review performance-report.md for details"
fi

echo "✅ Performance optimization complete"
```

**Track Progress:**
```bash
TOKENS_USED=4000

# Store performance results
  "Performance optimized" \
  "$(head -n 30 performance-report.md)"
```

---

## Phase 6: Documentation & Deployment (90-100%)

**Objective**: Document changes, create runbooks, and deploy with zero downtime

**⚡ EXECUTE TASK TOOL:**
```
Use the technical-writer agent to:
1. Create comprehensive technical documentation
2. Write migration guide for team
3. Create deployment runbooks
4. Document rollback procedures
5. Create monitoring and alerting guide

subagent_type: "orchestr8:development:fullstack-developer"
description: "Create documentation and deployment guides"
prompt: "Document modernization and create deployment guides: $1

Based on all previous phases:

1. **Technical Documentation**
   - Architecture diagrams (before/after)
   - API changes documentation
   - Database schema changes
   - Configuration changes
   - Performance improvements
   - Security enhancements

2. **Migration Guide**
   - What changed and why
   - Breaking changes (if any)
   - Migration path for remaining legacy code
   - Code examples (old vs new)
   - Troubleshooting guide
   - FAQ

3. **Deployment Runbooks**
   - Pre-deployment checklist
   - Blue-Green deployment procedure
   - Canary deployment procedure
   - Feature flag configuration
   - Smoke testing procedures
   - Post-deployment validation

4. **Rollback Procedures**
   - When to rollback
   - Emergency rollback steps
   - Database rollback procedures
   - Feature flag rollback
   - Communication plan

5. **Monitoring & Alerting**
   - Key metrics to monitor
   - Alert thresholds
   - Dashboard configurations
   - Log aggregation queries
   - On-call procedures

Expected outputs:
- docs/architecture.md - Architecture documentation
- docs/migration-guide.md - Team migration guide
- docs/deployment-runbook.md - Deployment procedures
- docs/rollback-procedures.md - Emergency procedures
- docs/monitoring-guide.md - Observability setup
"
```

**Expected Outputs:**
- `docs/architecture.md` - Architecture documentation
- `docs/migration-guide.md` - Migration guide
- `docs/deployment-runbook.md` - Deployment procedures
- `docs/rollback-procedures.md` - Rollback procedures
- `docs/monitoring-guide.md` - Monitoring setup

**Quality Gate: Documentation Validation**
```bash
# Validate documentation exists
REQUIRED_DOCS=(
  "docs/architecture.md"
  "docs/migration-guide.md"
  "docs/deployment-runbook.md"
  "docs/rollback-procedures.md"
)

for doc in "${REQUIRED_DOCS[@]}"; do
  if [ ! -f "$doc" ]; then
    echo "❌ Required documentation missing: $doc"
    exit 1
  fi
done

echo "✅ Documentation complete"
```

**Deployment Strategy:**

After documentation, implement zero-downtime deployment:

**Option A: Blue-Green Deployment**
```bash
# 1. Deploy modern version (Green)
# 2. Run smoke tests on Green
# 3. Switch traffic to Green
# 4. Keep Blue as instant rollback
```

**Option B: Canary Deployment**
```bash
# 1. Deploy to 5% of servers
# 2. Monitor for 24h
# 3. Gradually increase: 5% → 25% → 50% → 100%
# 4. Rollback if issues detected
```

**Option C: Feature Flags**
```typescript
if (featureFlags.isEnabled('modern_user_service', userId)) {
  return modernUserService.getUser(userId);
} else {
  return legacyUserService.getUser(userId);
}
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store documentation
  "Complete documentation and deployment guides" \
  "$(ls -lh docs/)"
```

---

## Workflow Complete

```bash
# Complete workflow tracking
WORKFLOW_END=$(date +%s)

  "Legacy system modernization complete: $1"

echo "
✅ LEGACY MODERNIZATION COMPLETE

Target System: $1

Deliverables:
- ✅ Code analysis report
- ✅ Migration strategy
- ✅ Risk assessment
- ✅ Comprehensive test suite (${CURRENT_COVERAGE}% coverage)
- ✅ Modernized codebase
- ✅ Data migration scripts (if applicable)
- ✅ Performance optimization
- ✅ Complete documentation
- ✅ Deployment runbooks

Quality Gates Passed:
- ✅ All tests passing
- ✅ Code coverage ≥ 80%
- ✅ Performance equal or better
- ✅ Security scan clean
- ✅ Documentation complete

Files Created:
- code-analysis-report.md
- migration-strategy.md
- risk-matrix.md
- tests/ (characterization, integration, e2e)
- migration-log.md
- performance-report.md
- docs/ (architecture, migration guide, runbooks)

Next Steps:
1. Review deployment-runbook.md
2. Configure monitoring and alerts
3. Schedule deployment window
4. Execute deployment with team
5. Monitor metrics during rollout
6. Celebrate successful modernization! 🎉
"

# Display metrics
```

---

## Success Criteria Checklist

- ✅ Legacy system analyzed with metrics and dependency mapping
- ✅ Modernization strategy chosen (Strangler Fig, Branch by Abstraction, etc.)
- ✅ Risk assessment completed with mitigation plans
- ✅ Comprehensive test suite created (80%+ coverage)
- ✅ Characterization tests documenting current behavior
- ✅ Integration and E2E tests passing
- ✅ Code modernized incrementally with continuous validation
- ✅ All tests passing after modernization
- ✅ Data migration strategy implemented (if applicable)
- ✅ Dual-write and cutover plan validated
- ✅ Performance benchmarked and optimized
- ✅ Modern code performs equal to or better than legacy
- ✅ Technical documentation complete
- ✅ Migration guide created for team
- ✅ Deployment runbooks created
- ✅ Rollback procedures documented
- ✅ Monitoring and alerting configured
- ✅ Zero-downtime deployment strategy selected
- ✅ Security vulnerabilities addressed
- ✅ Ready for production deployment

---

## Common Modernization Scenarios

### Scenario 1: Python 2 → Python 3
```bash
# Assessment
2to3 --print-diff src/

# Test Coverage
pytest tests/ --cov=src/

# Migration
2to3 -w src/
# Fix: print statements, unicode, iterators, exceptions

# Validation
pytest tests/
mypy src/
```

### Scenario 2: jQuery → React
```javascript
// Legacy jQuery
$('#userList').html(users.map(u => `<li>${u.name}</li>`).join(''));

// Modern React
function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### Scenario 3: Monolith → Microservices
```
1. Identify bounded contexts (Users, Orders, Payments)
2. Extract domain logic into modules
3. Create API layer for each module
4. Deploy as separate services
5. Implement event-driven communication
6. Migrate data to service-specific databases
```

---

## Rollback Plan

If issues arise during deployment:

1. **Immediate Rollback**
   - Feature flag to legacy code (instant)
   - Blue-Green: Switch traffic back to Blue
   - Canary: Reduce traffic to 0%

2. **Database Rollback**
   - Revert schema migrations
   - Switch back to legacy database
   - Verify data integrity

3. **Investigation**
   - Review logs and metrics
   - Identify root cause
   - Document issue

4. **Fix & Retry**
   - Address issues in development
   - Re-test thoroughly
   - Schedule new deployment

---

## Anti-Patterns to Avoid

**DO NOT:**
- ❌ Skip test coverage creation (high risk of breaking functionality)
- ❌ Big-bang rewrite without incremental validation
- ❌ Ignore performance baselines
- ❌ Deploy without rollback plan
- ❌ Skip documentation
- ❌ Modernize without understanding why legacy code exists
- ❌ Ignore business-critical code paths
- ❌ Deploy during peak hours

**DO:**
- ✅ Create comprehensive tests before any changes
- ✅ Modernize incrementally with continuous validation
- ✅ Use feature flags for gradual rollout
- ✅ Monitor metrics during deployment
- ✅ Keep legacy as fallback during transition
- ✅ Document all changes and decisions
- ✅ Communicate with stakeholders
- ✅ Celebrate wins with the team

---

## Example Invocation

```bash
/modernize-legacy "Migrate Django 2.2 app to Django 4.2. Database: PostgreSQL with 10M+ records. Zero downtime required."

# Workflow executes:
# 1. Analyzes Django 2.2 app, identifies deprecated APIs (20%)
# 2. Creates comprehensive test suite with 85% coverage (40%)
# 3. Incrementally updates 2.2 → 3.0 → 3.2 → 4.0 → 4.2 (70%)
# 4. Migrates database schema with dual-write strategy (80%)
# 5. Performance testing and optimization (90%)
# 6. Documentation and runbooks (95%)
# 7. Canary deployment with monitoring (100%)
```

---

Transform legacy systems into modern, maintainable codebases with confidence and zero risk.
