---
description: Create a new project from requirements to deployed application with full orchestration
argumentHint: "[project-description]"
---

# New Project Workflow

## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate this entire workflow to the project-orchestrator agent using the Task tool.

**Delegation Instructions:**
```
Use Task tool with:
- subagent_type: "project-orchestrator"
- description: "Create new project from requirements to deployment"
- prompt: "Execute the new-project workflow for: [user's project description].

Create a complete project from scratch:
1. Analyze requirements and define scope
2. Design system architecture and tech stack
3. Set up project structure and dependencies
4. Implement core features
5. Add comprehensive testing (unit, integration, e2e)
6. Set up CI/CD pipeline
7. Deploy to environment
8. Generate complete documentation

Follow all phases, enforce quality gates at each step, and meet all success criteria defined below."
```

**After delegation:**
- The project-orchestrator will handle entire project creation autonomously
- Return to main context only when complete or if user input required
- Do NOT attempt to execute workflow steps in main context

---

## Project Creation Instructions for Orchestrator

You are orchestrating the complete creation of a new project from requirements to deployment.

## Workflow Overview

This workflow will:
1. Analyze requirements
2. Design system architecture
3. Set up project structure
4. Implement core features
5. Add comprehensive testing
6. Set up CI/CD
7. Deploy to environment
8. Generate documentation

## Execution Instructions

### Step 1: Requirements Analysis
Use the `requirements-analyzer` agent to:
- Extract functional and non-functional requirements
- Identify technical constraints
- Define acceptance criteria
- Create user stories if applicable

### Step 2: Architecture Design
Use the `architect` agent to:
- Design system architecture
- Choose technology stack
- Define component structure
- Create architecture decision records (ADRs)
- Present architecture to user for approval

**⚠️ CHECKPOINT: Get user approval before proceeding**

### Step 3: Project Initialization
Based on chosen stack, use appropriate agents:
- **TypeScript/Node.js**: `typescript-developer` for Next.js/Node.js setup
- **Python**: `python-developer` for FastAPI/Django setup
- **Java**: `java-developer` for Spring Boot setup
- **Go**: `go-developer` for Go service setup
- **Rust**: `rust-developer` for Rust application setup

Initialize:
- Project structure
- Package management (package.json, pyproject.toml, etc.)
- TypeScript/build configuration
- Database schema (Prisma, SQLAlchemy, etc.)
- Basic configuration files

### Step 4: Core Implementation
Use the `project-orchestrator` agent to coordinate:

**Backend Development** (parallel):
- Use `backend-developer` or language-specific agent
- Implement data models
- Create API endpoints
- Add authentication/authorization
- Implement business logic

**Frontend Development** (parallel if applicable):
- Use `frontend-developer`
- Set up component structure
- Implement UI components
- Add state management
- Connect to backend APIs

**Database**:
- Use `database-specialist` for complex schemas
- Create migrations
- Add indexes
- Set up seed data

### Step 5: Quality Assurance (parallel)
Run all quality gates:

1. **Testing** - `test-engineer`:
   - Unit tests (80%+ coverage)
   - Integration tests
   - E2E tests for critical paths

2. **Code Review** - `code-reviewer`:
   - Code quality check
   - Best practices validation
   - Performance review

3. **Security Audit** - `security-auditor`:
   - Vulnerability scan
   - Dependency audit
   - Security best practices check

4. **Performance** - `performance-analyzer` (if applicable):
   - Load testing
   - Query optimization
   - Bundle size analysis

### Step 6: DevOps Setup
Use appropriate agents:

**CI/CD** - `ci-cd-engineer`:
- Set up GitHub Actions / GitLab CI
- Add automated tests
- Add linting and formatting
- Add security scanning

**Infrastructure** - Based on deployment target:
- **AWS**: `aws-specialist` for serverless/ECS/EKS
- **Terraform**: `terraform-specialist` for IaC
- **Docker**: `docker-specialist` for containerization
- **Kubernetes**: `kubernetes-expert` for K8s deployment

**Monitoring**:
- Add logging
- Set up error tracking
- Add performance monitoring
- Configure alerts

### Step 7: Documentation
Use documentation agents (parallel):

1. **README** - `technical-writer`:
   - Project overview
   - Setup instructions
   - Usage examples
   - Development guide

2. **API Docs** - `api-documenter`:
   - API reference
   - Endpoint documentation
   - Request/response examples
   - Authentication guide

3. **Architecture Docs** - `architecture-documenter`:
   - System design
   - Component diagrams
   - Data flow diagrams
   - Deployment architecture

### Step 8: Deployment

1. Deploy to staging environment
2. Run smoke tests
3. Verify monitoring and logging
4. Deploy to production (if approved)
5. Verify deployment
6. Set up rollback plan

## Success Criteria

Project is complete when:
- ✅ All requirements implemented
- ✅ All tests passing (80%+ coverage)
- ✅ Security audit passed
- ✅ Code review passed
- ✅ CI/CD pipeline functional
- ✅ Documentation complete
- ✅ Deployed to environment
- ✅ Monitoring in place
- ✅ User acceptance

## Deliverables

1. **Codebase**: Complete, tested, production-ready code
2. **Tests**: Comprehensive test suite
3. **Documentation**: README, API docs, architecture docs
4. **Infrastructure**: IaC code for deployment
5. **CI/CD**: Automated pipeline configuration
6. **Deployment**: Application deployed and monitored

## Example Usage

```
/new-project "Build a task management API with user authentication,
task CRUD operations, task assignment, and deadline notifications.
Should support 10,000 concurrent users and integrate with email service."
```

The orchestrator will analyze requirements, design architecture, implement features, test thoroughly, set up infrastructure, and deploy—all autonomously with quality gates at each step.

## Notes

- This is a fully autonomous workflow
- User approval required only at architecture checkpoint
- All quality gates must pass before deployment
- Failures trigger automatic remediation
- Progress tracked via todo list throughout execution
