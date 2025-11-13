# Orchestr8 Workflows Guide

> **Complete guide to using Orchestr8 workflows (slash commands) in Claude Code**

Workflows are pre-built autonomous processes that orchestrate complex development tasks. Each workflow dynamically loads relevant expertise and guides you through implementation phases.

## Table of Contents

- [Overview](#overview)
- [Core Development Workflows](#core-development-workflows)
- [Quality & Review Workflows](#quality--review-workflows)
- [Deployment Workflows](#deployment-workflows)
- [Knowledge & Meta Workflows](#knowledge--meta-workflows)
- [Workflow Execution Flow](#workflow-execution-flow)
- [Customizing Workflows](#customizing-workflows)
- [Creating New Workflows](#creating-new-workflows)

---

## Overview

### What Are Workflows?

Workflows are **slash commands** in Claude Code that trigger autonomous development processes. Each workflow:

- Loads ~2KB upfront (minimal context)
- Dynamically assembles relevant resources (agents, skills, patterns, examples)
- Executes in phases with progress tracking (0-20%, 20-70%, 70-90%, 90-100%)
- Provides step-by-step implementation guidance
- Adapts to your specific codebase and requirements

### How Workflows Work

```
User: /orchestr8:new-project Build a TypeScript REST API
   ↓
Workflow loads (~2KB)
   ↓
Analyzes requirements: "TypeScript", "REST API"
   ↓
Dynamic matching: orchestr8://match?query=typescript+rest+api&maxTokens=2500
   ↓
Assembles expertise:
  - typescript-core
  - typescript-api-development
  - api-design-rest
  - express-minimal-api
   ↓
Executes phases:
  Phase 1: Architecture design
  Phase 2: Implementation
  Phase 3: Testing
  Phase 4: Documentation & deployment
   ↓
Result: Complete project with guidance
```

### Token Efficiency with JIT Loading

Workflows use **phase-based JIT loading** for maximum token efficiency:

| Component | Tokens | When Loaded |
|-----------|--------|-------------|
| Workflow definition | ~2000 | At command invocation |
| Phase 1 resources | 1000-1500 | Analysis/Design phase |
| Phase 2 resources | 2000-3500 | Implementation phase |
| Phase 3 resources | 1500-2000 | Testing/QA phase |
| Phase 4 resources | 1000-1800 | Deployment (conditional) |
| **Total progressive** | **2,400-9,500** | **Loaded phase-by-phase as needed** |

**Real-world token savings:**
- **New Project**: 77% savings (2,800 vs 12,000 tokens)
- **Add Feature**: 76% savings (2,400 vs 10,000 tokens)
- **Performance Optimization**: 79% savings (3,200 vs 15,000 tokens)
- **Security Audit**: 83% savings (2,500 vs 15,000 tokens)
- **Refactor**: 73% savings (2,200 vs 8,000 tokens)

**Average savings:** ~78% across all workflows

---

## Core Development Workflows

### /orchestr8:new-project

**Start new projects from scratch**

**Usage:**
```bash
/orchestr8:new-project <project description>
```

**Examples:**
```bash
/orchestr8:new-project Build a TypeScript REST API with authentication and PostgreSQL
/orchestr8:new-project Create a Python FastAPI microservice with async database
/orchestr8:new-project Build a React dashboard with real-time data visualization
```

**What It Does:**

**Phase 1: Planning (0-20%)**
- Parse requirements and tech stack
- Design project architecture
- Define directory structure
- Choose patterns and best practices

**Phase 2: Foundation (20-50%)**
- Set up project structure
- Configure build tools and dependencies
- Implement core infrastructure
- Set up database and models

**Phase 3: Features (50-80%)**
- Implement business logic
- Build API endpoints or UI components
- Add authentication and authorization
- Integrate external services

**Phase 4: Quality & Deploy (80-100%)**
- Write tests (unit, integration, E2E)
- Add documentation
- Configure deployment
- Set up CI/CD

**JIT Loading Example (TypeScript REST API):**

**Phase 1 (0-20%) - Requirements & Architecture:**
```
→ Load: orchestr8://match?query=requirements+analysis+architecture+design&maxTokens=1200
Loaded: requirement-analysis-framework, architecture-decision-records
Tokens: ~1,200
```

**Phase 2 (20-30%) - Project Setup:**
```
→ Load: orchestr8://match?query=typescript+project+initialization+tooling&maxTokens=1000
Loaded: typescript-core, git-workflow, docker-best-practices
Tokens: ~1,000
```

**Phase 3 (30-70%) - Core Implementation:**
```
→ Load: orchestr8://match?query=typescript+rest+api+implementation&maxTokens=3500
Loaded: typescript-api-development, api-design-rest, express-jwt-auth (examples)
Tokens: ~3,500 (supports all parallel tracks: backend, frontend, infra)
```

**Phase 4 (70-90%) - Testing & Quality:**
```
→ Load: orchestr8://match?query=typescript+testing+quality+security&maxTokens=2000
Loaded: testing-strategies, security-owasp-top10, quality-code-review-checklist
Tokens: ~2,000
```

**Phase 5 (90-100%) - Deployment (conditional):**
```
→ Load: orchestr8://match?query=${deployment-platform}+cicd+infrastructure&maxTokens=1800
Loaded: deployment-zero-downtime, ci-cd-github-actions (if deployment requested)
Tokens: ~1,800 (optional)
```

**Total:** 2,800-9,500 tokens progressive vs 12,000 upfront (77% savings)

---

### /orchestr8:add-feature

**Add features to existing codebase**

**Usage:**
```bash
/orchestr8:add-feature <feature description>
```

**Examples:**
```bash
/orchestr8:add-feature Add user profile management with avatar upload
/orchestr8:add-feature Implement real-time notifications using WebSockets
/orchestr8:add-feature Add multi-factor authentication to login flow
```

**What It Does:**

**Phase 1: Analysis & Design (0-20%)**
- Analyze existing codebase
- Identify affected components
- Design feature integration
- Define API contracts and data models
- **Checkpoint:** Design approved

**Phase 2: Implementation (20-70%)**
- **Backend track:** Schema, models, business logic, API endpoints
- **Frontend track:** Components, forms, state management, API integration
- **Test track:** Unit tests, integration tests (TDD approach)
- **Checkpoint:** Feature works manually, tests pass

**Phase 3: Quality Assurance (70-90%)**
- **Testing:** E2E tests, edge cases, 80%+ coverage
- **Quality:** Code review, security scan, performance check
- **Checkpoint:** All tests pass, no critical issues

**Phase 4: Integration & Deploy (90-100%)**
- **Documentation:** API docs, comments, changelog
- **Deployment:** Feature flags, staging validation, production rollout
- **Checkpoint:** Production healthy, metrics good

**Dynamic Resources Loaded:**
- Relevant language agent
- Feature-specific patterns
- Integration examples
- Testing strategies

**Parallelism:**
- Phase 2: Backend + Frontend + Tests (independent tracks)
- Phase 3: Testing + Quality (parallel execution)
- Phase 4: Docs + Deploy (parallel execution)

---

### /orchestr8:fix-bug

**Debug and fix issues systematically**

**Usage:**
```bash
/orchestr8:fix-bug <issue description>
```

**Examples:**
```bash
/orchestr8:fix-bug Users can't login after password reset
/orchestr8:fix-bug API returns 500 error for large file uploads
/orchestr8:fix-bug Memory leak in WebSocket connection handler
```

**What It Does:**

**Phase 1: Investigation (0-30%)**
- Reproduce the issue
- Analyze logs and stack traces
- Identify root cause
- Assess impact and scope
- **Checkpoint:** Root cause identified

**Phase 2: Fix Implementation (30-70%)**
- Design fix strategy
- Implement solution
- Add defensive checks
- Handle edge cases
- **Checkpoint:** Fix implemented

**Phase 3: Validation (70-90%)**
- Write regression tests
- Test fix manually
- Verify edge cases
- Check for side effects
- **Checkpoint:** Tests pass, issue resolved

**Phase 4: Prevention (90-100%)**
- Add monitoring/alerting
- Update documentation
- Improve error messages
- Deploy with rollback plan
- **Checkpoint:** Production stable

**Dynamic Resources Loaded:**
- Debugging techniques
- Error handling patterns
- Testing strategies
- Monitoring and observability guides

---

### /orchestr8:refactor

**Improve code structure and quality**

**Usage:**
```bash
/orchestr8:refactor <refactoring goal>
```

**Examples:**
```bash
/orchestr8:refactor Improve error handling in authentication service
/orchestr8:refactor Extract user management into separate module
/orchestr8:refactor Optimize database queries in reporting system
```

**What It Does:**

**Phase 1: Analysis (0-20%)**
- Identify code smells
- Analyze dependencies
- Plan refactoring strategy
- Define success criteria
- **Checkpoint:** Plan approved

**Phase 2: Refactoring (20-80%)**
- Extract functions/classes
- Improve naming
- Reduce complexity
- Apply design patterns
- Maintain test coverage throughout
- **Checkpoint:** Tests still pass

**Phase 3: Validation (80-100%)**
- Run full test suite
- Performance benchmarks
- Code review
- Documentation updates
- **Checkpoint:** All green, no regressions

**Dynamic Resources Loaded:**
- Refactoring patterns
- Design principles
- Code quality metrics
- Testing strategies

---

## Quality & Review Workflows

### /orchestr8:review-code

**Comprehensive code review**

**Usage:**
```bash
/orchestr8:review-code <scope>
```

**Examples:**
```bash
/orchestr8:review-code Review the entire authentication module
/orchestr8:review-code Review changes in pull request #123
/orchestr8:review-code Review user-service for security issues
```

**What It Does:**

**Phase 1: Code Quality (0-30%)**
- Check code style and standards
- Assess readability and maintainability
- Identify complexity hotspots
- Review naming conventions

**Phase 2: Architecture (30-60%)**
- Evaluate design patterns
- Check separation of concerns
- Assess coupling and cohesion
- Review error handling

**Phase 3: Security & Performance (60-90%)**
- Security vulnerability scan
- Performance bottleneck analysis
- Resource usage review
- Scalability assessment

**Phase 4: Recommendations (90-100%)**
- Prioritized improvement list
- Code examples for fixes
- Best practices documentation
- Action items

**Dynamic Resources Loaded:**
- Code quality patterns
- Security best practices
- Performance optimization guides
- Review checklists

---

### /orchestr8:security-audit

**Security vulnerability assessment**

**Usage:**
```bash
/orchestr8:security-audit <target>
```

**Examples:**
```bash
/orchestr8:security-audit Audit API endpoints for vulnerabilities
/orchestr8:security-audit Review authentication and authorization system
/orchestr8:security-audit Check for OWASP Top 10 vulnerabilities
```

**What It Does:**

**Phase 1: Authentication & Authorization (0-25%)**
- Review auth implementation
- Check token handling
- Validate RBAC/ABAC
- Test session management

**Phase 2: Input & Output (25-50%)**
- SQL injection checks
- XSS vulnerability scan
- CSRF protection review
- Input validation assessment

**Phase 3: Infrastructure (50-75%)**
- Secrets management
- HTTPS/TLS configuration
- CORS policy review
- Rate limiting and throttling

**Phase 4: Report & Remediation (75-100%)**
- Vulnerability report
- Risk assessment
- Remediation steps
- Prevention strategies

**Dynamic Resources Loaded:**
- Security patterns
- OWASP guidelines
- Vulnerability examples
- Remediation guides

---

### /orchestr8:optimize-performance

**Performance optimization**

**Usage:**
```bash
/orchestr8:optimize-performance <performance issue>
```

**Examples:**
```bash
/orchestr8:optimize-performance API response times are slow
/orchestr8:optimize-performance Database queries taking too long
/orchestr8:optimize-performance Frontend bundle size is too large
```

**What It Does:**

**Phase 1: Profiling (0-30%)**
- Measure current performance
- Identify bottlenecks
- Collect metrics
- Analyze resource usage

**Phase 2: Optimization (30-70%)**
- Database query optimization
- Caching implementation
- Code optimization
- Asset optimization

**Phase 3: Validation (70-90%)**
- Performance benchmarks
- Load testing
- Regression checks
- Metric comparison

**Phase 4: Monitoring (90-100%)**
- Set up performance monitoring
- Define SLAs and alerts
- Document optimizations
- Create maintenance plan

**Dynamic Resources Loaded:**
- Performance patterns
- Caching strategies
- Database optimization
- Profiling tools and techniques

---

## Deployment Workflows

### /orchestr8:deploy

**Deployment automation**

**Usage:**
```bash
/orchestr8:deploy <deployment target>
```

**Examples:**
```bash
/orchestr8:deploy Deploy to production with zero downtime
/orchestr8:deploy Deploy to staging for testing
/orchestr8:deploy Rollback to previous version
```

**What It Does:**

**Phase 1: Pre-deployment (0-20%)**
- Run test suite
- Build artifacts
- Generate deployment plan
- Check prerequisites

**Phase 2: Staging (20-50%)**
- Deploy to staging
- Run smoke tests
- Validate functionality
- Performance check

**Phase 3: Production (50-80%)**
- Blue-green or canary deployment
- Health checks
- Monitor metrics
- Gradual rollout

**Phase 4: Post-deployment (80-100%)**
- Verify production health
- Monitor error rates
- Update documentation
- Notify stakeholders

**Dynamic Resources Loaded:**
- Deployment patterns
- Platform-specific guides (AWS, Kubernetes, etc.)
- Monitoring setup
- Rollback procedures

---

### /orchestr8:setup-cicd

**CI/CD pipeline configuration**

**Usage:**
```bash
/orchestr8:setup-cicd <CI/CD platform>
```

**Examples:**
```bash
/orchestr8:setup-cicd Setup GitHub Actions for automated testing
/orchestr8:setup-cicd Configure GitLab CI for deployment pipeline
/orchestr8:setup-cicd Add CircleCI with Docker builds
```

**What It Does:**

**Phase 1: Requirements (0-20%)**
- Assess current setup
- Define pipeline stages
- Choose tools and platforms
- Plan integration

**Phase 2: Build Pipeline (20-50%)**
- Configure build steps
- Set up test automation
- Configure linting and formatting
- Add security scanning

**Phase 3: Deployment Pipeline (50-80%)**
- Configure deployment stages
- Set up environments (dev, staging, prod)
- Implement approval gates
- Configure secrets management

**Phase 4: Monitoring & Optimization (80-100%)**
- Add pipeline monitoring
- Optimize build times
- Document processes
- Train team

**Dynamic Resources Loaded:**
- CI/CD patterns
- Platform-specific guides
- Docker and containerization
- Secrets management

---

## Knowledge & Meta Workflows

### /create-agent

**Create new AI agent definitions**

**Usage:**
```bash
/create-agent <agent description>
```

**Example:**
```bash
/create-agent Create a Rust systems programming expert agent
```

Creates new agent fragments with proper metadata, capabilities, and knowledge structure.

---

### /create-skill

**Create new reusable skill fragments**

**Usage:**
```bash
/create-skill <skill description>
```

**Example:**
```bash
/create-skill Create circuit breaker resilience pattern skill
```

Creates new skill fragments with use cases and examples.

---

### /create-workflow

**Create new workflow definitions**

**Usage:**
```bash
/create-workflow <workflow description>
```

**Example:**
```bash
/create-workflow Create data migration workflow
```

Creates new workflow with phases, checkpoints, and dynamic resource loading.

---

## Workflow Execution Flow

### Typical Execution Pattern

```
1. User invokes workflow
   /orchestr8:new-project Build a REST API

2. Workflow loads (~2KB)
   - Metadata parsed
   - Phases defined
   - Progress tracking initialized

3. Requirement analysis
   - Parse user description
   - Extract keywords
   - Identify tech stack
   - Determine complexity

4. Dynamic resource loading
   orchestr8://match?query=typescript+rest+api&maxTokens=2500
   → Assembles relevant fragments

5. Phase-by-phase execution
   Phase 1: Design (0-20%)
   Phase 2: Implementation (20-70%)
   Phase 3: Quality (70-90%)
   Phase 4: Deploy (90-100%)

6. Progress tracking
   - Checkpoint validation
   - Phase completion markers
   - Success criteria verification

7. Result delivery
   - Implementation guidance
   - Code examples
   - Next steps
```

### Checkpoint System

Workflows use checkpoints to validate progress:

**Example (Add Feature workflow):**
- Checkpoint 1 (20%): Design approved
- Checkpoint 2 (70%): Feature works, tests pass
- Checkpoint 3 (90%): All tests pass, no critical issues
- Checkpoint 4 (100%): Production healthy

Checkpoints ensure:
- Progress validation
- Quality gates
- Rollback points
- Phase dependencies met

---

## Customizing Workflows

### Modifying Existing Workflows

Workflows are stored as markdown files in `resources/workflows/`:

```
resources/workflows/
├── workflow-new-project.md
├── workflow-add-feature.md
├── workflow-fix-bug.md
└── ...
```

**To customize:**

1. Locate workflow file
2. Edit phases and checkpoints
3. Modify dynamic resource queries
4. Update metadata (tags, capabilities, useWhen)
5. Rebuild index: `npm run build-index`

**Example customization:**

```markdown
---
id: workflow-new-project
category: pattern
tags: [workflow, project-setup, architecture]
capabilities:
  - Complete project initialization
useWhen:
  - Starting new projects with custom architecture
estimatedTokens: 580
---

# New Project Workflow

## Phase 1: Custom Architecture Design (0-30%)
<!-- Custom phase definition -->

## Phase 2: Implementation (30-80%)
<!-- Custom implementation steps -->
```

---

## Creating New Workflows

### Workflow Template

```markdown
---
id: workflow-my-workflow
category: pattern
tags: [workflow, my-domain, custom]
capabilities:
  - What this workflow enables
useWhen:
  - Scenario 1 when this workflow applies
  - Scenario 2 when this workflow applies
estimatedTokens: 600
---

# My Workflow Name

**Phases:** Phase1 (0-25%) → Phase2 (25-75%) → Phase3 (75-100%)

## Phase 1: Initial Phase (0-25%)
- Step 1
- Step 2
- **Checkpoint:** Validation criteria

## Phase 2: Main Phase (25-75%)
**Parallel tracks:**
- **Track A:** Task A1, Task A2
- **Track B:** Task B1, Task B2
- **Checkpoint:** Validation criteria

## Phase 3: Final Phase (75-100%)
- Final step 1
- Final step 2
- **Checkpoint:** Success criteria

## Dynamic Resources
Load relevant expertise:
orchestr8://match?query=relevant+keywords&maxTokens=2500

## Parallelism
- **Independent:** Track A + Track B (Phase 2)
- **Dependencies:** Phase 2 requires Phase 1 completion
```

### Best Practices for Workflows

1. **Clear phases** with percentage ranges
2. **Checkpoints** at phase boundaries
3. **Parallel tracks** where possible
4. **Dynamic resource loading** for flexibility
5. **Estimated tokens** for budgeting
6. **Specific useWhen scenarios** for matching

### Testing New Workflows

1. Create workflow fragment file
2. Rebuild index: `npm run build-index`
3. Restart MCP server
4. Test via Claude Code or Web UI
5. Iterate based on results

---

## Related Documentation

- [Usage Overview](./README.md) - Core usage concepts
- [Resources Guide](./resources.md) - Resource loading and URIs
- [Examples](../examples/README.md) - Practical workflow examples
- [Authoring Guide](../resources/authoring-guide.md) - Creating fragments

---

**Document Version:** 1.0.0
**Last Updated:** 2025-11-11
