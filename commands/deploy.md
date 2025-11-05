# Deploy Workflow

Autonomous, safe production deployment from pre-deployment validation to post-deployment monitoring with automatic rollback capabilities.

## Deployment Strategies

**Blue-Green Deployment:**
- Two identical environments (blue = current, green = new)
- Deploy to green, test, then switch traffic
- Instant rollback by switching back to blue
- Zero downtime
- **Use for**: Critical applications, major releases

**Rolling Deployment:**
- Gradually replace instances with new version
- Partial rollback possible
- Minimal additional infrastructure
- **Use for**: Standard updates, microservices

**Canary Deployment:**
- Deploy to small subset of users first
- Monitor metrics, gradually increase traffic
- Rollback before full deployment if issues
- **Use for**: High-risk changes, A/B testing

## Execution Instructions

### Phase 1: Pre-Deployment Validation (0-20%)

**Use all quality agents in parallel:**

#### 1. Code Quality Gates

**⚡ EXECUTE TASK TOOL:**
```
Use the code-reviewer agent to:
1. Validate all PR comments addressed
2. Check for TODO comments in critical paths
3. Verify no debug logging left in code
4. Check for commented-out code
5. Validate consistent code style
6. Verify proper error handling
7. Check for hardcoded values
8. Validate security best practices

subagent_type: "quality-assurance:code-reviewer"
description: "Pre-deployment code review validation"
prompt: "Perform pre-deployment code review:

CODE REVIEW CHECKLIST:
✓ All PR comments addressed
✓ No TODO comments in critical paths
✓ No debug logging left in code
✓ No commented-out code
✓ Consistent code style
✓ Proper error handling
✓ No hardcoded values
✓ Security best practices followed

BLOCKER ISSUES:
- Critical bugs
- Security vulnerabilities
- Breaking changes without migration path
- Missing required tests

Expected outputs:
- pre-deployment-code-review.md with:
  - Checklist status
  - Blocker issues (if any)
  - Approval status (PASS/FAIL)
"
```

**Expected Outputs:**
- `pre-deployment-code-review.md` - Code review validation results

**Quality Gate: Code Review**
```bash
# Validate code review
if [ ! -f "pre-deployment-code-review.md" ]; then
  echo "❌ Code review not completed"
  exit 1
fi

if grep -q "BLOCKER" pre-deployment-code-review.md; then
  echo "❌ Blocker issues found"
  exit 1
fi

echo "✅ Code review passed"
```

**Track Progress:**
```bash
```

#### 2. Test Coverage Validation

**⚡ EXECUTE TASK TOOL:**
```
Use the test-engineer agent to:
1. Run all unit tests with coverage
2. Run integration tests
3. Run E2E tests
4. Run performance tests
5. Run load tests
6. Validate coverage > 80%
7. Ensure no flaky tests
8. Verify performance within baseline

subagent_type: "quality-assurance:test-engineer"
description: "Pre-deployment test validation"
prompt: "Execute comprehensive test suite:

# Unit tests
npm test -- --coverage
# Require > 80% coverage

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Performance tests
npm run test:performance

# Load tests
k6 run load-test.js

VALIDATION:
✓ All tests passing (100%)
✓ Coverage > 80%
✓ No flaky tests
✓ Performance within baseline
✓ Load test successful (target RPS)

Expected outputs:
- test-validation-report.md with:
  - Test results (pass/fail counts)
  - Coverage percentage
  - Performance metrics
  - Load test results
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `test-validation-report.md` - Test execution results

**Quality Gate: Test Coverage**
```bash
# Run tests
if ! npm test -- --coverage 2>/dev/null; then
  echo "❌ Tests failing"
  exit 1
fi

echo "✅ All tests passing"
```

**Track Progress:**
```bash
```

#### 3. Security Scan

**⚡ EXECUTE TASK TOOL:**
```
Use the security-auditor agent to:
1. Run dependency vulnerability scan
2. Run SAST (static analysis)
3. Run secrets detection
4. Run container scanning (if applicable)
5. Validate no critical/high vulnerabilities
6. Ensure no secrets in code

subagent_type: "quality-assurance:security-auditor"
description: "Pre-deployment security scanning"
prompt: "Execute security scans:

# Dependency vulnerabilities
npm audit --audit-level=moderate

# SAST
semgrep --config=auto

# Secrets detection
gitleaks detect

# Container scanning (if applicable)
trivy image app:latest

VALIDATION:
✓ No critical/high vulnerabilities
✓ No secrets in code
✓ No security misconfigurations
✓ Container images scanned and clean

Expected outputs:
- security-scan-report.md with:
  - Vulnerability summary
  - Secrets detection results
  - Container scan results
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `security-scan-report.md` - Security scan results

**Quality Gate: Security**
```bash
# Run security scans
npm audit --audit-level=moderate 2>/dev/null
semgrep --config=auto 2>/dev/null
gitleaks detect 2>/dev/null

echo "✅ Security scans passed"
```

**Track Progress:**
```bash
```

#### 4. Build Validation

**⚡ EXECUTE TASK TOOL:**
```
Use the appropriate language specialist agent to:
1. Build the application
2. Verify build artifacts
3. Check bundle size within budget
4. Validate all assets generated
5. Build Docker image (if applicable)
6. Push to registry

subagent_type: "[typescript-developer|python-developer|java-developer|go-developer|rust-developer]"
description: "Build and validate application artifacts"
prompt: "Build application and validate artifacts:

# Build the application
npm run build
# or: mvn clean package
# or: cargo build --release
# or: go build

# Verify build artifacts
- Check bundle size within budget
- Verify all assets generated
- Check for build warnings
- Validate source maps

# Docker build (if applicable)
docker build -t app:${VERSION} .

# Push to registry
docker push registry.example.com/app:${VERSION}

VALIDATION:
✓ Build successful
✓ No build errors
✓ Bundle size within budget
✓ Docker image built and pushed

Expected outputs:
- build-validation-report.md with:
  - Build status
  - Bundle size
  - Artifact checksums
  - Docker image details
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `build-validation-report.md` - Build validation results
- Build artifacts
- Docker image (if applicable)

**Quality Gate: Build**
```bash
# Build application
if ! npm run build 2>/dev/null; then
  echo "❌ Build failed"
  exit 1
fi

echo "✅ Build successful"
```

**Track Progress:**
```bash
```

#### 5. Database Migration Validation

**⚡ EXECUTE TASK TOOL:**
```
Use the database-specialist agent to:
1. Create test database
2. Run migrations
3. Verify schema changes
4. Test rollback
5. Re-apply migrations
6. Validate data integrity

subagent_type: "infrastructure-monitoring:database-specialist"
description: "Validate database migrations"
prompt: "Test database migrations:

# Create test database
createdb deployment_test

# Run migrations
npm run migrate:up
# or: alembic upgrade head
# or: flyway migrate

# Verify schema
- Check all tables created
- Check all indexes created
- Check constraints in place
- Verify seed data

# Test rollback
npm run migrate:down
# Verify clean rollback

# Re-apply migrations
npm run migrate:up

VALIDATION:
✓ Migrations run successfully
✓ Rollback works
✓ No data loss during migration
✓ Performance impact acceptable

Expected outputs:
- migration-validation-report.md with:
  - Migration execution results
  - Rollback test results
  - Schema validation
  - Performance impact
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `migration-validation-report.md` - Migration validation results

**Quality Gate: Database Migrations**
```bash
# Validate migrations
if [ ! -f "migration-validation-report.md" ]; then
  echo "❌ Migration validation not completed"
  exit 1
fi

echo "✅ Database migrations validated"
```

**Track Progress:**
```bash
```

#### 6. Infrastructure Validation

**⚡ EXECUTE TASK TOOL:**
```
Use the infrastructure-engineer or cloud specialist agent to:
1. Validate infrastructure code
2. Check for destructive changes
3. Validate Kubernetes manifests
4. Validate scaling configuration
5. Check resource limits

subagent_type: "[infrastructure-monitoring:infrastructure-engineer|devops-cloud:aws-specialist|devops-cloud:azure-specialist|devops-cloud:gcp-specialist]"
description: "Validate infrastructure configuration"
prompt: "Validate infrastructure:

# Validate infrastructure code
terraform validate
terraform plan -out=tfplan

# Check for destructive changes
terraform show tfplan | grep -i 'will be destroyed'

# Validate Kubernetes manifests
kubectl apply --dry-run=client -f k8s/
kubectl apply --dry-run=server -f k8s/

# Validate scaling configuration
- Min/max instances
- Auto-scaling thresholds
- Health check configuration
- Resource limits

VALIDATION:
✓ Infrastructure code valid
✓ No unexpected destructive changes
✓ Kubernetes manifests valid
✓ Scaling properly configured

Expected outputs:
- infrastructure-validation-report.md with:
  - Terraform plan summary
  - Destructive changes (if any)
  - Kubernetes validation results
  - Scaling configuration
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `infrastructure-validation-report.md` - Infrastructure validation results

**Quality Gate: Infrastructure**
```bash
# Validate infrastructure
terraform validate 2>/dev/null
kubectl apply --dry-run=client -f k8s/ 2>/dev/null

echo "✅ Infrastructure validated"
```

**Track Progress:**
```bash
```

**CHECKPOINT**: All pre-deployment validations passed ✓

---

### Phase 2: Staging Deployment (20-35%)

**Deploy to staging environment first:**

#### 1. Deploy to Staging

**⚡ EXECUTE TASK TOOL:**
```
Use the ci-cd-engineer agent to:
1. Set staging environment
2. Apply database migrations
3. Deploy application
4. Wait for rollout completion
5. Validate deployment status

subagent_type: "devops-cloud:devops-engineer"
description: "Deploy to staging environment"
prompt: "Deploy application to staging:

# Set environment
export ENV=staging

# Apply database migrations
npm run migrate -- --env=staging

# Deploy application
# Kubernetes
kubectl apply -f k8s/staging/

# Wait for rollout
kubectl rollout status deployment/app -n staging

# AWS ECS
aws ecs update-service \
  --cluster staging \
  --service app \
  --task-definition app:${VERSION}

# Heroku
git push heroku-staging main

# Serverless
serverless deploy --stage staging

VALIDATION:
✓ Deployment successful
✓ All pods/instances healthy
✓ Database migrations applied
✓ Configuration loaded correctly

Expected outputs:
- staging-deployment-log.md with:
  - Deployment steps executed
  - Status of each component
  - Health check results
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `staging-deployment-log.md` - Staging deployment results

**Quality Gate: Staging Deployment**
```bash
# Validate staging deployment
kubectl rollout status deployment/app -n staging 2>/dev/null

echo "✅ Staging deployment successful"
```

**Track Progress:**
```bash
```

#### 2. Staging Smoke Tests

**⚡ EXECUTE TASK TOOL:**
```
Use the test-engineer agent to:
1. Run health checks
2. Execute smoke tests
3. Test critical user paths
4. Run performance smoke test
5. Validate all systems operational

subagent_type: "quality-assurance:test-engineer"
description: "Execute staging smoke tests"
prompt: "Run staging smoke tests:

# Health check
curl https://staging.example.com/health
# Expected: {\"status\": \"healthy\"}

# Database connectivity
curl https://staging.example.com/health/database
# Expected: {\"status\": \"connected\"}

# External dependencies
curl https://staging.example.com/health/dependencies
# Expected: {\"redis\": \"connected\", \"s3\": \"accessible\"}

# Basic functionality tests
npm run test:smoke -- --env=staging

# Critical user paths
- User registration
- User login
- Core feature workflows
- Payment processing (test mode)
- Third-party integrations

# Performance smoke test
k6 run smoke-test.js --env staging

VALIDATION:
✓ Health check passing
✓ Smoke tests passing
✓ Core features working
✓ No errors in logs
✓ Performance acceptable

Expected outputs:
- staging-smoke-test-report.md with:
  - Health check results
  - Smoke test results
  - Critical path validation
  - Performance metrics
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `staging-smoke-test-report.md` - Smoke test results

**Quality Gate: Smoke Tests**
```bash
# Run smoke tests
npm run test:smoke -- --env=staging 2>/dev/null

echo "✅ Smoke tests passed"
```

**Track Progress:**
```bash
```

#### 3. Staging Validation

**⚡ EXECUTE TASK TOOL:**
```
Use the performance-analyzer agent to:
1. Monitor metrics for 15 minutes
2. Check error rates
3. Check response times
4. Check resource usage
5. Review logs
6. Validate no issues

subagent_type: "quality-assurance:performance-analyzer"
description: "Monitor staging environment"
prompt: "Monitor staging for 15 minutes:

# Watch for:
- Error rates
- Response times
- Memory usage
- CPU usage
- Database connections
- External API calls

# Check logs
kubectl logs -l app=myapp -n staging --tail=100

# No errors, warnings acceptable
# No memory leaks
# No connection pool exhaustion

VALIDATION:
✓ No errors in 15-minute window
✓ Metrics within normal range
✓ No resource leaks
✓ Logs clean

Expected outputs:
- staging-monitoring-report.md with:
  - Metrics collected
  - Error analysis
  - Resource usage
  - Log analysis
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `staging-monitoring-report.md` - Staging monitoring results

**Quality Gate: Staging Validation**
```bash
# Validate staging metrics
if [ ! -f "staging-monitoring-report.md" ]; then
  echo "❌ Staging validation not completed"
  exit 1
fi

echo "✅ Staging validation passed"
```

**Track Progress:**
```bash
```

**CHECKPOINT**: Staging deployment validated ✓

---

### Phase 3: Production Deployment (35-65%)

**Choose deployment strategy based on requirements:**

#### Strategy A: Blue-Green Deployment

**⚡ EXECUTE TASK TOOL:**
```
Use the ci-cd-engineer agent to:
1. Prepare green environment
2. Run smoke tests on green
3. Apply database migrations
4. Warm up green environment
5. Switch traffic from blue to green
6. Monitor green environment
7. Validate or rollback

subagent_type: "devops-cloud:devops-engineer"
description: "Execute blue-green deployment"
prompt: "Perform blue-green deployment to production:

# Step 1: Prepare Green Environment
# Green is the new version, Blue is current production

# Deploy to green environment
kubectl apply -f k8s/production/green/

# Wait for green to be ready
kubectl wait --for=condition=ready pod \
  -l app=myapp,env=green \
  -n production \
  --timeout=300s

# Step 2: Run smoke tests on green (internal traffic only)
curl https://green.internal.example.com/health

npm run test:smoke -- --env=production-green

# Step 3: Database migration (if needed)
# Run migrations with both blue and green running
# Ensure backward compatibility
npm run migrate -- --env=production

# Step 4: Warm up green environment
# Send small amount of traffic to warm caches
for i in {1..100}; do
  curl https://green.internal.example.com/api/users
  sleep 0.1
done

# Step 5: Switch traffic from blue to green
# Update load balancer / ingress
kubectl patch service myapp-service \
  -n production \
  -p '{\"spec\":{\"selector\":{\"env\":\"green\"}}}'

# Or AWS ALB target group
aws elbv2 modify-rule \
  --rule-arn $RULE_ARN \
  --actions Type=forward,TargetGroupArn=$GREEN_TG_ARN

# Step 6: Monitor green environment
# Watch for 10 minutes
- Error rates (should be < 0.1%)
- Response times (should be < baseline)
- Resource usage
- User complaints

# Step 7: Decision point
if [ $ERROR_RATE -lt 0.1 ]; then
  echo 'Deployment successful'
  # Keep green, decommission blue after 24 hours
else
  echo 'Rollback required'
  # Switch back to blue
  kubectl patch service myapp-service \
    -n production \
    -p '{\"spec\":{\"selector\":{\"env\":\"blue\"}}}'
fi

VALIDATION:
✓ Green environment healthy
✓ Traffic switched successfully
✓ Error rates normal
✓ Response times acceptable
✓ No user complaints

Expected outputs:
- blue-green-deployment-log.md with:
  - Each step executed
  - Monitoring metrics
  - Decision rationale
  - Final status (SUCCESS/ROLLBACK)
"
```

**Expected Outputs:**
- `blue-green-deployment-log.md` - Blue-green deployment results

**Quality Gate: Blue-Green Deployment**
```bash
# Validate deployment
if [ ! -f "blue-green-deployment-log.md" ]; then
  echo "❌ Blue-green deployment not completed"
  exit 1
fi

if grep -q "ROLLBACK" blue-green-deployment-log.md; then
  echo "❌ Deployment rolled back"
  exit 1
fi

echo "✅ Blue-green deployment successful"
```

**Track Progress:**
```bash
```

#### Strategy B: Rolling Deployment

**⚡ EXECUTE TASK TOOL:**
```
Use the ci-cd-engineer agent to:
1. Update deployment with new version
2. Configure rolling update strategy
3. Watch rollout
4. Monitor during rollout
5. Validate complete rollout

subagent_type: "devops-cloud:devops-engineer"
description: "Execute rolling deployment"
prompt: "Perform rolling deployment to production:

# Step 1: Update deployment with new version
kubectl set image deployment/myapp \
  myapp=registry.example.com/myapp:${VERSION} \
  -n production

# Configure rolling update strategy
kubectl patch deployment myapp -n production -p '{
  \"spec\": {
    \"strategy\": {
      \"type\": \"RollingUpdate\",
      \"rollingUpdate\": {
        \"maxSurge\": 1,
        \"maxUnavailable\": 0
      }
    }
  }
}'

# Step 2: Watch rollout
kubectl rollout status deployment/myapp -n production

# Rollout updates pods one at a time:
# 1. Create new pod with new version
# 2. Wait for pod to be ready
# 3. Terminate old pod
# 4. Repeat

# Step 3: Monitor during rollout
watch kubectl get pods -n production

# Check metrics every 30 seconds
while kubectl rollout status deployment/myapp -n production | grep -q 'Waiting'; do
  ERROR_RATE=$(check_error_rate)
  if [ $ERROR_RATE -gt 1 ]; then
    echo 'High error rate detected, pausing rollout'
    kubectl rollout pause deployment/myapp -n production
    exit 1
  fi
  sleep 30
done

# Step 4: Validate complete rollout
kubectl rollout status deployment/myapp -n production
# Should output: 'deployment successfully rolled out'

VALIDATION:
✓ All pods updated
✓ All pods healthy
✓ Error rates normal during rollout
✓ Zero downtime achieved

Expected outputs:
- rolling-deployment-log.md with:
  - Rollout progress
  - Monitoring metrics
  - Final status (SUCCESS/PAUSED)
"
```

**Expected Outputs:**
- `rolling-deployment-log.md` - Rolling deployment results

**Quality Gate: Rolling Deployment**
```bash
# Validate deployment
kubectl rollout status deployment/myapp -n production 2>/dev/null

echo "✅ Rolling deployment successful"
```

**Track Progress:**
```bash
```

#### Strategy C: Canary Deployment

**⚡ EXECUTE TASK TOOL:**
```
Use the ci-cd-engineer agent to:
1. Deploy canary (5% of traffic)
2. Monitor canary (30 minutes)
3. Gradual rollout if metrics good
4. Make canary the new stable
5. Decommission old stable

subagent_type: "devops-cloud:devops-engineer"
description: "Execute canary deployment"
prompt: "Perform canary deployment to production:

# Step 1: Deploy canary (5% of traffic)
kubectl apply -f k8s/production/canary/

# Configure traffic split (Istio/Nginx)
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: myapp
spec:
  hosts:
  - myapp.example.com
  http:
  - match:
    - headers:
        canary:
          exact: 'true'
    route:
    - destination:
        host: myapp-canary
        port:
          number: 80
  - route:
    - destination:
        host: myapp-stable
        port:
          number: 80
      weight: 95
    - destination:
        host: myapp-canary
        port:
          number: 80
      weight: 5

# Step 2: Monitor canary (30 minutes)
# Compare metrics: canary vs stable
- Error rates: canary ≈ stable
- Response times: canary ≤ stable
- Resource usage
- User feedback

# Step 3: Gradual rollout if metrics good
# 5% → 10% → 25% → 50% → 100%
for WEIGHT in 10 25 50 100; do
  # Update traffic split
  kubectl patch virtualservice myapp -n production -p \"{
    \\\"spec\\\": {
      \\\"http\\\": [{
        \\\"route\\\": [
          {\\\"destination\\\": {\\\"host\\\": \\\"myapp-stable\\\"}, \\\"weight\\\": $((100-WEIGHT))},
          {\\\"destination\\\": {\\\"host\\\": \\\"myapp-canary\\\"}, \\\"weight\\\": $WEIGHT}
        ]
      }]
    }
  }\"

  # Monitor for 15 minutes at each stage
  sleep 900

  # Check metrics
  if [ $CANARY_ERROR_RATE -gt $STABLE_ERROR_RATE ]; then
    echo 'Canary showing higher errors, rolling back'
    # Set weight back to 0
    exit 1
  fi
done

# Step 4: Make canary the new stable
kubectl patch service myapp-service \
  -n production \
  -p '{\"spec\":{\"selector\":{\"version\":\"canary\"}}}'

# Decommission old stable
kubectl delete deployment myapp-stable -n production

VALIDATION:
✓ Canary metrics match or exceed stable
✓ Gradual rollout successful
✓ 100% traffic on new version
✓ Old version decommissioned

Expected outputs:
- canary-deployment-log.md with:
  - Each traffic split stage
  - Comparative metrics
  - Decision rationale at each stage
  - Final status (SUCCESS/ROLLBACK)
"
```

**Expected Outputs:**
- `canary-deployment-log.md` - Canary deployment results

**Quality Gate: Canary Deployment**
```bash
# Validate deployment
if [ ! -f "canary-deployment-log.md" ]; then
  echo "❌ Canary deployment not completed"
  exit 1
fi

if grep -q "ROLLBACK" canary-deployment-log.md; then
  echo "❌ Deployment rolled back"
  exit 1
fi

echo "✅ Canary deployment successful"
```

**Track Progress:**
```bash
```

#### Database Migrations (Production)

**⚡ EXECUTE TASK TOOL:**
```
Use the database-specialist agent to:
1. Backup database
2. Run migrations (backward compatible)
3. Deploy application
4. Backfill data (if needed)
5. Run cleanup migrations (after 24 hours)

subagent_type: "infrastructure-monitoring:database-specialist"
description: "Execute production database migrations"
prompt: "Execute zero-downtime database migrations:

# Step 1: Backup database
pg_dump production_db > backup_$(date +%Y%m%d_%H%M%S).sql
# Upload to S3
aws s3 cp backup_*.sql s3://backups/database/

# Step 2: Run migrations
# For zero-downtime, migrations must be backward compatible
# Phase 1: Additive changes only
# - Add new columns (nullable)
# - Add new tables
# - Add new indexes (CONCURRENTLY)

npm run migrate:up -- --env=production

# Step 3: Deploy application (can read old and new schema)

# Step 4: Backfill data (if needed)
npm run backfill -- --env=production

# Step 5: Phase 2 migrations (after deployment)
# - Make columns NOT NULL
# - Drop old columns
# - Drop old tables

# Run this after 24 hours of successful deployment
npm run migrate:cleanup -- --env=production

VALIDATION:
✓ Backup created and stored
✓ Migrations successful
✓ No downtime during migration
✓ Data integrity maintained

Expected outputs:
- production-migration-log.md with:
  - Backup details
  - Migration execution log
  - Backfill results
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `production-migration-log.md` - Migration execution results

**Quality Gate: Database Migrations**
```bash
# Validate migrations
if [ ! -f "production-migration-log.md" ]; then
  echo "❌ Migration log not found"
  exit 1
fi

echo "✅ Database migrations successful"
```

**CHECKPOINT**: Production deployment complete ✓

---

### Phase 4: Post-Deployment Validation (65-85%)

**Monitor and validate deployment:**

#### 1. Automated Health Checks

**⚡ EXECUTE TASK TOOL:**
```
Use the test-engineer agent to:
1. Check application health
2. Check database connectivity
3. Check external dependencies
4. Run production smoke tests
5. Validate all systems operational

subagent_type: "quality-assurance:test-engineer"
description: "Post-deployment health checks"
prompt: "Execute post-deployment health checks:

# Application health
curl https://api.example.com/health
# Expected: {\"status\": \"healthy\", \"version\": \"1.2.3\"}

# Database connectivity
curl https://api.example.com/health/database
# Expected: {\"status\": \"connected\"}

# External dependencies
curl https://api.example.com/health/dependencies
# Expected: {\"redis\": \"connected\", \"s3\": \"accessible\"}

# Smoke tests in production
npm run test:smoke -- --env=production

VALIDATION:
✓ All health checks passing
✓ Database connected
✓ External services accessible
✓ Smoke tests passing

Expected outputs:
- post-deployment-health-report.md with:
  - Health check results
  - Smoke test results
  - System status
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `post-deployment-health-report.md` - Health check results

**Quality Gate: Health Checks**
```bash
# Validate health checks
curl https://api.example.com/health 2>/dev/null

echo "✅ Health checks passed"
```

**Track Progress:**
```bash
```

#### 2. Metrics Monitoring (Critical Window: First Hour)

**⚡ EXECUTE TASK TOOL:**
```
Use the performance-analyzer agent to:
1. Monitor error rates
2. Monitor response times
3. Monitor throughput
4. Monitor resource usage
5. Monitor business metrics
6. Compare to baseline

subagent_type: "quality-assurance:performance-analyzer"
description: "Monitor production metrics"
prompt: "Monitor production metrics for 1 hour:

# Track for 1 hour minimum:

ERROR RATES:
- Current vs Baseline
- Threshold: 0.5%
- Status: GOOD/WARNING/CRITICAL

RESPONSE TIMES:
- p50, p95, p99 vs baseline
- Status: GOOD/WARNING/CRITICAL

THROUGHPUT:
- Current vs baseline
- Status: GOOD/WARNING/CRITICAL

RESOURCE USAGE:
- CPU vs baseline
- Memory vs baseline
- Status: GOOD/WARNING/CRITICAL

BUSINESS METRICS:
- Successful transactions vs baseline
- User activity vs baseline
- Status: GOOD/WARNING/CRITICAL

Expected outputs:
- production-metrics-report.md with:
  - All metric comparisons
  - Baseline vs current
  - Status for each category
  - Overall validation (PASS/FAIL)
"
```

**Expected Outputs:**
- `production-metrics-report.md` - Production metrics analysis

**Quality Gate: Metrics**
```bash
# Validate metrics
if [ ! -f "production-metrics-report.md" ]; then
  echo "❌ Metrics report not found"
  exit 1
fi

if grep -q "CRITICAL" production-metrics-report.md; then
  echo "❌ Critical metrics issues"
  exit 1
fi

echo "✅ Metrics within normal range"
```

**Track Progress:**
```bash
```

#### 3. Log Analysis

**⚡ EXECUTE TASK TOOL:**
```
Use the devops-engineer agent to:
1. Check for errors in logs
2. Identify suspicious patterns
3. Search for critical issues
4. Analyze error rates
5. Validate log health

subagent_type: "devops-cloud:devops-engineer"
description: "Analyze production logs"
prompt: "Analyze production logs post-deployment:

# Check for errors in logs
kubectl logs -l app=myapp -n production --since=1h | grep -i error

# Alert on suspicious patterns
- Database connection errors
- External API timeouts
- Unexpected exceptions
- Memory warnings
- Authentication failures

# Use log aggregation (ELK, Splunk, Datadog)
# Search for:
- 5xx errors
- Slow queries (> 1s)
- Failed background jobs
- Security events

VALIDATION:
✓ No critical errors
✓ Error rate within normal range
✓ No new error patterns
✓ Warnings are expected and documented

Expected outputs:
- log-analysis-report.md with:
  - Error summary
  - Suspicious patterns
  - Critical issues (if any)
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `log-analysis-report.md` - Log analysis results

**Quality Gate: Log Analysis**
```bash
# Validate logs
if [ ! -f "log-analysis-report.md" ]; then
  echo "❌ Log analysis not completed"
  exit 1
fi

echo "✅ Log analysis passed"
```

**Track Progress:**
```bash
```

#### 4. User Impact Analysis

**⚡ EXECUTE TASK TOOL:**
```
Use the performance-analyzer agent to:
1. Check Real User Monitoring (RUM)
2. Calculate Apdex score
3. Monitor user feedback
4. Check A/B test results (if canary)
5. Validate user satisfaction

subagent_type: "quality-assurance:performance-analyzer"
description: "Analyze user impact"
prompt: "Analyze user impact post-deployment:

# Real User Monitoring (RUM)
# Check Web Vitals from actual users

# Apdex Score (User Satisfaction)
# Score = (Satisfied + Tolerating/2) / Total
# Target: > 0.95

# User feedback monitoring
- Support tickets: No increase
- Social media mentions: Normal
- Error reporting (Sentry): No spike
- Customer complaints: None

# A/B test results (if canary)
- Conversion rate: Equal or better
- User engagement: Equal or better
- Feature usage: As expected

VALIDATION:
✓ No user complaints
✓ Apdex score > 0.95
✓ No support ticket spike
✓ Business metrics stable or improved

Expected outputs:
- user-impact-report.md with:
  - RUM metrics
  - Apdex score
  - User feedback summary
  - A/B test results (if applicable)
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `user-impact-report.md` - User impact analysis

**Quality Gate: User Impact**
```bash
# Validate user impact
if [ ! -f "user-impact-report.md" ]; then
  echo "❌ User impact analysis not completed"
  exit 1
fi

echo "✅ User impact analysis passed"
```

**Track Progress:**
```bash
```

**CHECKPOINT**: Post-deployment validation successful ✓

---

### Phase 5: Monitoring & Alerting (85-95%)

**Configure ongoing monitoring:**

**⚡ EXECUTE TASK TOOL:**
```
Use the devops-engineer agent to:
1. Configure Prometheus alerts
2. Set up dashboards
3. Configure notification channels
4. Validate alert thresholds
5. Test alerting

subagent_type: "devops-cloud:devops-engineer"
description: "Configure production monitoring and alerting"
prompt: "Set up production monitoring and alerting:

# Prometheus alerts
groups:
  - name: deployment
    interval: 30s
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~\"5..\"}[5m]) > 0.05
        for: 5m
        annotations:
          summary: 'High error rate detected'
          description: 'Error rate is {{ $value }} (threshold: 0.05)'

      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 1.0
        for: 10m
        annotations:
          summary: 'High response time'
          description: 'p95 latency is {{ $value }}s'

      - alert: MemoryUsageHigh
        expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
        for: 5m
        annotations:
          summary: 'Memory usage high'
          description: 'Memory usage at {{ $value }}%'

      - alert: DeploymentReplicasMismatch
        expr: kube_deployment_status_replicas_available != kube_deployment_spec_replicas
        for: 15m
        annotations:
          summary: 'Deployment replicas mismatch'
          description: 'Deployment has {{ $value }} available replicas'

# Dashboards
## Deployment Dashboard

### Key Metrics
- Error Rate: 0.05% ✓
- p95 Response Time: 380ms ✓
- Throughput: 1,240 req/s ✓
- Apdex Score: 0.97 ✓

### Resource Usage
- CPU: 45% ✓
- Memory: 2.1 GB ✓
- Network: 120 Mbps ✓
- Disk I/O: 5 MB/s ✓

### Business Metrics
- Active Users: 8,234 ✓
- Transactions/min: 450 ✓
- Revenue/hr: $12,450 ✓

### Deployment Info
- Version: v1.2.3
- Deployed: 2024-01-15 14:30 UTC
- Deployed By: CI/CD (commit: abc123)
- Strategy: Blue-Green
- Rollback Plan: Switch to blue (v1.2.2)

Expected outputs:
- monitoring-config.yaml with:
  - Alert rules
  - Dashboard configuration
  - Notification channels
  - Validation status (PASS/FAIL)
"
```

**Expected Outputs:**
- `monitoring-config.yaml` - Monitoring configuration

**Quality Gate: Monitoring**
```bash
# Validate monitoring config
if [ ! -f "monitoring-config.yaml" ]; then
  echo "❌ Monitoring configuration not found"
  exit 1
fi

echo "✅ Monitoring and alerting configured"
```

**Track Progress:**
```bash
```

**CHECKPOINT**: Monitoring and alerting configured ✓

---

### Phase 6: Rollback Procedures (If Needed) (5%)

**Automatic rollback triggers:**

**⚡ EXECUTE TASK TOOL:**
```
Use the ci-cd-engineer agent to:
1. Monitor deployment success
2. Execute rollback if needed
3. Validate rollback
4. Restore database if needed
5. Verify system health post-rollback

subagent_type: "devops-cloud:devops-engineer"
description: "Execute rollback if needed"
prompt: "Monitor and execute rollback if needed:

# Monitor deployment success
# Rollback if:
- Error rate > 1% for 5 minutes
- p95 response time > 2x baseline for 10 minutes
- Critical health checks failing for 3 minutes
- Memory usage > 95% sustained
- Manual rollback requested

# Blue-Green Rollback (Instant)
kubectl patch service myapp-service \
  -n production \
  -p '{\"spec\":{\"selector\":{\"env\":\"blue\"}}}'
# Traffic switched back in < 5 seconds

# Rolling Deployment Rollback
kubectl rollout undo deployment/myapp -n production
# Rolls back to previous version

# Canary Rollback
kubectl patch virtualservice myapp -n production -p '{
  \"spec\": {
    \"http\": [{
      \"route\": [{
        \"destination\": {\"host\": \"myapp-stable\"},
        \"weight\": 100
      }]
    }]
  }
}'
kubectl delete deployment myapp-canary -n production

# Database Rollback (if needed)
# Restore from backup
pg_restore -d production_db backup_20240115_143000.sql

# Run down migrations
npm run migrate:down -- --env=production --steps=1

VALIDATION:
✓ Rolled back to previous version
✓ Application healthy
✓ Metrics normal
✓ Users can access application

Expected outputs:
- rollback-log.md (only if rollback executed) with:
  - Rollback trigger
  - Steps executed
  - Post-rollback validation
  - Status (SUCCESS/FAILED)
"
```

**Expected Outputs:**
- `rollback-log.md` (only if rollback needed)

**Track Progress:**
```bash
```

---

## Post-Deployment Actions

```markdown
### Within 1 Hour
- ✓ Validate all metrics normal
- ✓ Check error logs
- ✓ Verify user-facing features
- ✓ Update status page (if applicable)
- ✓ Notify stakeholders of successful deployment

### Within 24 Hours
- ✓ Review deployment metrics
- ✓ Analyze any warnings or issues
- ✓ Clean up old blue environment (if blue-green)
- ✓ Update documentation (if needed)
- ✓ Post-mortem if any issues occurred

### Within 1 Week
- ✓ Review business metrics impact
- ✓ Gather user feedback
- ✓ Identify deployment process improvements
- ✓ Update runbooks based on learnings
```

## Success Criteria

Deployment successful when:
- ✅ All pre-deployment validations passed
- ✅ Staging deployment and validation successful
- ✅ Production deployment completed
- ✅ Zero downtime achieved
- ✅ All health checks passing
- ✅ Error rates within acceptable range
- ✅ Response times meet SLA
- ✅ No user-facing issues
- ✅ Business metrics stable or improved
- ✅ Monitoring and alerting configured
- ✅ Rollback plan tested and ready
- ✅ Stakeholders notified

## Example Usage

### Example 1: Standard Production Deployment

```bash
/deploy "Deploy v2.5.0 to production using blue-green strategy. Includes database migrations for new user preferences feature."
```

**Autonomous execution:**
1. Runs all pre-deployment validations (code review, tests, security, build)
2. Validates database migrations in test environment
3. Deploys to staging, runs smoke tests (15 min validation)
4. Deploys green environment to production
5. Applies database migrations (backward compatible)
6. Runs smoke tests on green environment
7. Switches traffic from blue to green
8. Monitors for 1 hour (error rate: 0.04%, p95: 380ms - within threshold)
9. Deployment successful, keeps blue for 24hr then decommissions
10. Sends success notification

**Time: 1.5-2 hours**

### Example 2: Hotfix Deployment

```bash
/deploy "Emergency hotfix for payment processing bug. Deploy immediately to production with rolling strategy."
```

**Autonomous execution:**
1. Fast-track validation (critical tests only)
2. Skip staging (emergency)
3. Rolling deployment to production
4. Monitors closely during rollout
5. Validates payment processing working
6. All instances updated in 10 minutes
7. Zero downtime, bug fixed

**Time: 20-30 minutes**

### Example 3: Canary Deployment for High-Risk Feature

```bash
/deploy "Deploy new recommendation algorithm (v3.0.0) using canary strategy. Monitor conversion rates closely."
```

**Autonomous execution:**
1. Full pre-deployment validation
2. Staging deployment and validation
3. Deploys canary to 5% of users
4. Monitors for 30 minutes (metrics good)
5. Increases to 10%, monitors 15 min
6. Increases to 25%, monitors 15 min
7. Increases to 50%, monitors 15 min
8. Increases to 100%, monitors 30 min
9. Canary metrics show 15% improvement in conversion!
10. Makes canary the new stable, decommissions old version

**Time: 3-4 hours**

## Anti-Patterns

### DON'T
❌ Deploy on Friday afternoon (deploy early week)
❌ Deploy during peak traffic hours
❌ Skip staging validation
❌ Deploy without rollback plan
❌ Deploy multiple changes at once
❌ Ignore monitoring during deployment
❌ Deploy without database backup
❌ Deploy without notifying team
❌ Deploy when on-call person unavailable

### DO
✅ Deploy early in week (Mon-Wed)
✅ Deploy during low traffic periods
✅ Always validate in staging first
✅ Test rollback procedure beforehand
✅ Deploy small, incremental changes
✅ Monitor closely during and after deployment
✅ Always backup database before migrations
✅ Notify team and stakeholders
✅ Ensure on-call coverage during deployment

## Deployment Checklist

```markdown
PRE-DEPLOYMENT:
□ All tests passing (unit, integration, e2e)
□ Code review approved
□ Security scan passed
□ Build successful
□ Database migrations tested
□ Staging deployment successful
□ Rollback plan documented
□ Team notified
□ On-call person available

DURING DEPLOYMENT:
□ Monitoring dashboard open
□ Error logs streaming
□ Smoke tests ready
□ Communication channel open
□ Rollback command ready

POST-DEPLOYMENT:
□ Health checks passing
□ Smoke tests passed
□ Metrics within normal range
□ No error spike
□ User feedback monitored
□ Stakeholders notified
□ Deployment documented
□ Retrospective scheduled (if issues)
```

## Deployment Frequency

```markdown
RECOMMENDED CADENCE:

SMALL TEAMS:
- Weekly deployments
- Hotfixes as needed
- Deploy on Tuesday/Wednesday

MEDIUM TEAMS:
- Daily deployments (main branch)
- Continuous deployment for non-critical
- Scheduled deployment for critical

LARGE TEAMS:
- Multiple deployments per day
- Continuous deployment
- Canary for high-risk changes
- Blue-green for critical services

ENTERPRISE:
- Continuous deployment (automated)
- Canary for all changes
- Blue-green for tier-1 services
- Scheduled maintenance windows for major changes
```

Autonomous, safe, and production-ready deployments with comprehensive validation and instant rollback capabilities.
