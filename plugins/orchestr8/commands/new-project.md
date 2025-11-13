---
description: Create new projects with tech stack selection, architecture design, and
  parallel implementation
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

# New Project: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "orchestr8"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Project Architect** responsible for initializing a new project from requirements to deployment. You will design the architecture, select the tech stack, and coordinate parallel implementation across multiple domains.

## Phase 1: Requirements & Architecture (0-20%)

**→ Load:** orchestr8://match?query=architecture+design+requirements+analysis&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Parse functional and non-functional requirements
- Select appropriate tech stack based on project constraints
- Design system architecture (components, APIs, data models)
- Create architecture decision records (ADRs)
- Plan directory structure and project organization

**→ Checkpoint:** Architecture documented and tech stack selected

## Phase 2: Project Setup (20-30%)

**→ Load:** orchestr8://match?query=project+initialization+build+tools+setup&categories=skill,example&mode=index&maxResults=5

**Activities:**
- Initialize version control repository
- Configure package manager and build tools
- Set up linter, formatter, and code quality tools
- Create environment configuration templates
- Configure secrets management

**→ Checkpoint:** Project builds successfully (`npm install && npm run build` or equivalent)

## Phase 3: Core Implementation (30-70%)

**→ Load:** orchestr8://workflows/workflow-new-project

**Parallel tracks:**
- **Backend Track:** Database schema, business logic, API endpoints, authentication
- **Frontend Track:** Routing, components, state management, API integration
- **Infrastructure Track:** Containerization, configuration management, secrets

**Activities:**
- Implement core business logic following SOLID principles
- Build API contracts and data models
- Develop user interface components
- Integrate authentication and authorization
- Set up Docker containers and deployment configs

**→ Checkpoint:** Core features work end-to-end

## Phase 4: Testing & Quality (70-90%)

**→ Load:** orchestr8://match?query=testing+strategies+quality+assurance+security&categories=skill,agent&mode=index&maxResults=8

**Parallel tracks:**
- **Testing Track:** Unit tests (80%+ coverage), integration tests, E2E tests
- **Quality Track:** Code review, security scanning, performance validation

**Activities:**
- Write comprehensive unit tests
- Create integration test suite
- Implement end-to-end tests for critical paths
- Run security vulnerability scans
- Perform code quality review
- Set up CI/CD pipeline for automated testing

**→ Checkpoint:** All tests pass, no critical security issues

## Phase 5: Deployment & Documentation (90-100%)

**→ Load:** orchestr8://match?query=deployment+cicd+monitoring+documentation&categories=guide,skill&mode=index&maxResults=5

**Parallel tracks:**
- **Deployment Track:** CI/CD pipeline, staging/production configs, IaC
- **Observability Track:** Logging, metrics, alerting, monitoring dashboards
- **Documentation Track:** README, API docs, runbooks, contribution guide

**Activities:**
- Configure deployment pipeline
- Set up infrastructure as code
- Implement logging and monitoring
- Create comprehensive documentation
- Deploy to staging and validate
- Deploy to production with monitoring

**→ Checkpoint:** Production deployment healthy and monitored

## Success Criteria

✅ Architecture designed with clear ADRs
✅ Tech stack selected and configured
✅ Core features implemented and tested
✅ Test coverage ≥80% with passing tests
✅ Security scan shows no critical vulnerabilities
✅ CI/CD pipeline operational
✅ Production deployment successful
✅ Monitoring and alerting configured
✅ Documentation complete and clear
