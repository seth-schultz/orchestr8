---
description: Configure CI/CD pipeline with automated testing, security scanning, and
  deployment automation
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

# Setup CI/CD: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "orchestr8"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **DevOps Engineer** responsible for establishing a comprehensive CI/CD pipeline with automated testing, security scanning, build automation, and deployment orchestration.

## Phase 1: Requirements & Planning (0-20%)

**→ Load:** orchestr8://workflows/workflow-setup-cicd

**Activities:**
- Assess current development workflow
- Define pipeline stages (build, test, scan, deploy)
- Choose CI/CD platform (GitHub Actions, GitLab CI, CircleCI, etc.)
- Plan environment strategy (dev, staging, production)
- Define branch strategy (main, develop, feature branches)
- Plan secrets management approach
- Define deployment gates and approval processes
- Document pipeline architecture

**→ Checkpoint:** CI/CD plan approved, platform selected

## Phase 2: Build Pipeline (20-50%)

**→ Load:** orchestr8://match?query=cicd+build+automation+testing&categories=guide,skill&mode=index&maxResults=8

**Activities:**

**Build Automation:**
- Configure build triggers (push, PR, schedule)
- Set up build environment and dependencies
- Configure linting and formatting checks
- Set up code quality analysis
- Configure artifact generation
- Implement build caching for speed

**Test Automation:**
- Configure unit test execution
- Set up integration test pipeline
- Configure E2E test execution
- Set up test result reporting
- Configure test coverage reporting
- Set up test failure notifications

**Code Quality:**
- Configure static analysis tools
- Set up code coverage thresholds
- Configure complexity analysis
- Set up dependency vulnerability scanning

**→ Checkpoint:** Build pipeline functional with automated testing

## Phase 3: Security & Quality Gates (50-80%)

**→ Load:** orchestr8://match?query=security+scanning+code+quality+cicd&categories=skill,guide&mode=index&maxResults=8

**Activities:**

**Security Scanning:**
- Configure SAST (static analysis) scanning
- Set up dependency vulnerability scanning
- Configure secrets detection
- Set up container image scanning
- Configure license compliance checking

**Quality Gates:**
- Define quality thresholds (coverage, complexity)
- Configure automatic PR checks
- Set up required status checks
- Configure approval workflows
- Set up branch protection rules

**Secrets Management:**
- Configure secrets storage (GitHub Secrets, Vault, etc.)
- Set up environment-specific secrets
- Configure secret rotation policies
- Document secrets usage

**→ Checkpoint:** Security scanning and quality gates active

## Phase 4: Deployment Pipeline (80-100%)

**→ Load:** orchestr8://match?query=deployment+automation+infrastructure+monitoring&categories=guide,pattern&mode=index&maxResults=8

**Activities:**

**Deployment Configuration:**
- Configure staging deployment automation
- Set up production deployment workflow
- Configure deployment strategies (blue-green, canary, rolling)
- Set up database migration automation
- Configure health checks

**Environment Management:**
- Configure environment provisioning
- Set up infrastructure as code integration
- Configure environment-specific configurations
- Set up deployment notifications

**Monitoring & Observability:**
- Configure deployment metrics tracking
- Set up deployment status notifications
- Configure rollback automation
- Set up deployment dashboards
- Configure alerting for failed deployments

**Documentation:**
- Document pipeline architecture
- Create runbooks for common scenarios
- Document troubleshooting procedures
- Create team training materials

**→ Checkpoint:** Full CI/CD pipeline operational

## CI/CD Pipeline Structure

### Pipeline Stages

#### 1. Build Stage
```yaml
- Checkout code
- Install dependencies
- Lint and format check
- Build artifacts
- Cache dependencies
```

#### 2. Test Stage
```yaml
- Run unit tests
- Run integration tests
- Run E2E tests
- Generate coverage report
- Upload test results
```

#### 3. Security Stage
```yaml
- SAST scanning
- Dependency scanning
- Secret detection
- Container scanning
- License compliance
```

#### 4. Quality Gate
```yaml
- Check test coverage >80%
- Check code quality scores
- Verify no critical vulnerabilities
- Require approvals
- Check branch protection
```

#### 5. Deploy Staging
```yaml
- Deploy to staging
- Run smoke tests
- Validate deployment
- Manual approval gate
```

#### 6. Deploy Production
```yaml
- Create backup
- Run migrations
- Deploy application
- Run health checks
- Monitor metrics
- Send notifications
```

## Configuration Examples

### GitHub Actions Example
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  test:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage

  security:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: snyk/actions/node@master

  deploy-staging:
    needs: [test, security]
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        run: ./scripts/deploy-staging.sh
```

## Best Practices

### Pipeline Design
✅ Keep pipelines fast (<10 minutes)
✅ Fail fast (run quick checks first)
✅ Cache dependencies
✅ Parallelize independent jobs
✅ Use matrix strategies for multi-platform testing

### Security
✅ Never commit secrets
✅ Use secret management systems
✅ Scan for vulnerabilities automatically
✅ Enforce code review before merge
✅ Sign commits and artifacts

### Deployment
✅ Automate everything
✅ Use infrastructure as code
✅ Implement gradual rollouts
✅ Have rollback automation
✅ Monitor deployments actively

### Maintenance
✅ Keep dependencies updated
✅ Monitor pipeline performance
✅ Document procedures
✅ Train team on usage
✅ Continuously improve

## Success Criteria

✅ CI/CD platform configured and operational
✅ Build automation functional
✅ Automated testing integrated
✅ Test coverage reporting active
✅ Code quality gates enforced
✅ Security scanning automated
✅ Dependency vulnerability checks active
✅ Secrets management configured securely
✅ Staging deployment automated
✅ Production deployment automated with gates
✅ Health checks configured
✅ Monitoring and alerting active
✅ Rollback procedures documented and tested
✅ Team trained on pipeline usage
✅ Documentation complete and accessible
