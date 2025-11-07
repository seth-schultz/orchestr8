---
description: Create complete projects end-to-end with requirements analysis, architecture design, implementation, testing, and deployment
argument-hint: [project-description]
model: claude-opus-4-1-20250805
---

# New Project Workflow

Autonomous workflow for creating complete projects from requirements to deployment with multi-phase orchestration and quality gates.

## Intelligence Database Integration

```bash

# Initialize workflow

echo "🚀 Starting New Project Workflow"
echo "Project Description: $1"
echo "Workflow ID: $workflow_id"

# Query similar project patterns
```

---

## Phase 1: Requirements Analysis (0-10%)

**⚡ EXECUTE TASK TOOL:**
```
Use the requirements-analyzer agent to:
1. Extract functional and non-functional requirements from project description
2. Identify technical constraints and dependencies
3. Define clear acceptance criteria
4. Create user stories if applicable
5. Assess project scope and complexity

subagent_type: "general-purpose"
description: "Analyze project requirements and define scope"
prompt: "Analyze requirements for new project:

Project Description: $1

Tasks:
1. **Extract Requirements**
   - Functional requirements: What features are needed?
   - Non-functional requirements: Performance, scalability, security needs
   - Technical constraints: Platform, compatibility, integrations
   - Dependencies: External services, APIs, databases

2. **Define Scope**
   - Core features (MVP)
   - Nice-to-have features
   - Out of scope items
   - Success metrics

3. **Create User Stories** (if applicable)
   - As a [user type], I want [feature] so that [benefit]
   - Include acceptance criteria for each story

4. **Acceptance Criteria**
   - Clear, measurable criteria
   - Test scenarios
   - Performance benchmarks

Expected outputs:
- requirements.md - Detailed requirements document
- user-stories.md - User stories (if applicable)
- acceptance-criteria.md - Success criteria
"
```

**Expected Outputs:**
- `requirements.md` - Detailed requirements document
- `user-stories.md` - User stories with acceptance criteria
- `acceptance-criteria.md` - Measurable success criteria

**Quality Gate: Requirements Validation**
```bash
# Validate requirements provided
if [ -z "$1" ]; then
  echo "❌ Project description not provided"
  exit 1
fi

# Validate requirements document
if [ ! -f "requirements.md" ]; then
  echo "❌ Requirements document not created"
  exit 1
fi

echo "✅ Requirements analyzed and validated"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store requirements
  "Requirements for new project" \
  "$(head -n 50 requirements.md)"
```

---

## Phase 2: Architecture Design (10-25%)

**⚡ EXECUTE TASK TOOL:**
```
Use the architect agent to:
1. Design system architecture based on requirements
2. Choose optimal technology stack (languages, frameworks, databases)
3. Define component structure and interactions
4. Create architecture decision records (ADRs)
5. Design data models and API contracts
6. Present architecture to user for approval

subagent_type: "orchestr8:development:architect"
description: "Design system architecture and tech stack"
prompt: "Design complete system architecture for project:

Requirements: $(cat requirements.md)

Tasks:
1. **Technology Stack Selection**
   - Backend: Language and framework (Node.js/FastAPI/Spring Boot/Go)
   - Frontend: Framework (React/Next.js/Vue/Angular) if applicable
   - Database: Type and specific solution (PostgreSQL/MongoDB/Redis)
   - Infrastructure: Hosting and deployment platform
   - Rationale for each choice

2. **Architecture Design**
   - Overall system architecture (monolith/microservices/serverless)
   - Component diagram
   - Data flow diagrams
   - API design (REST/GraphQL/gRPC)
   - Authentication/authorization strategy

3. **Data Model Design**
   - Entity relationships
   - Schema design
   - Indexes and constraints
   - Migration strategy

4. **Architecture Decision Records (ADRs)**
   - Document key architectural decisions
   - Context, options considered, decision, consequences

5. **Scalability & Performance**
   - Caching strategy
   - Load balancing approach
   - Database optimization
   - Performance targets

Expected outputs:
- architecture.md - System architecture document
- tech-stack.md - Technology stack with rationale
- data-model.md - Database schema and relationships
- adr/ - Architecture decision records directory
"
```

**Expected Outputs:**
- `architecture.md` - Complete system architecture document
- `tech-stack.md` - Technology stack with rationale
- `data-model.md` - Database schema and entity relationships
- `adr/` - Directory with architecture decision records

**Quality Gate: Architecture Review**
```bash
# Validate architecture document
if [ ! -f "architecture.md" ]; then
  echo "❌ Architecture document not created"
  exit 1
fi

# Validate tech stack defined
if [ ! -f "tech-stack.md" ]; then
  echo "❌ Technology stack not defined"
  exit 1
fi

echo "✅ Architecture designed and documented"
```

**⚠️ CHECKPOINT: Get user approval before proceeding**

Ask user: "Review the architecture in architecture.md and tech-stack.md. Approve to proceed with implementation?"

**Track Progress:**
```bash
TOKENS_USED=8000

# Store architecture
  "System architecture and tech stack" \
  "$(head -n 50 architecture.md)"
```

---

## Phase 3: Project Initialization (25-35%)

**⚡ EXECUTE TASK TOOL:**
```
Use the appropriate language-specific agent to:
1. Initialize project structure based on chosen tech stack
2. Set up package management and dependencies
3. Configure build tools and TypeScript/compilation
4. Initialize database schema and migrations
5. Create basic configuration files (.env.example, etc.)
6. Set up code quality tools (linting, formatting)

subagent_type: "[orchestr8:languages:typescript-developer|orchestr8:languages:python-developer|orchestr8:languages:java-developer|orchestr8:languages:go-developer|orchestr8:languages:rust-developer]"
description: "Initialize project structure and dependencies"
prompt: "Initialize project based on architecture:

Tech Stack: $(cat tech-stack.md)
Architecture: $(cat architecture.md)

Tasks:
1. **Project Structure**
   - Create directory structure
   - Initialize version control (git)
   - Create .gitignore with appropriate patterns

2. **Package Management**
   - Initialize package manager (npm/pip/maven/cargo)
   - Install core dependencies
   - Set up dependency management

3. **Build Configuration**
   - Configure build tools
   - Set up TypeScript/compilation if applicable
   - Configure module resolution
   - Add build scripts

4. **Database Setup**
   - Initialize ORM/ODM (Prisma/SQLAlchemy/Hibernate)
   - Create initial schema
   - Set up migrations
   - Create seed data scripts

5. **Configuration**
   - Create .env.example with all required variables
   - Set up configuration management
   - Add development/production configs

6. **Code Quality Tools**
   - Configure linter (ESLint/Pylint/Checkstyle)
   - Set up formatter (Prettier/Black/gofmt)
   - Add pre-commit hooks
   - Configure editor settings (.editorconfig)

Expected outputs:
- Complete project structure
- package.json/pyproject.toml/pom.xml/Cargo.toml
- Configuration files
- Database schema and migrations
"
```

**Expected Outputs:**
- Complete project directory structure
- `package.json` / `pyproject.toml` / `pom.xml` / `Cargo.toml` - Dependency manifest
- Build configuration files (tsconfig.json, webpack.config.js, etc.)
- Database schema and migration files
- `.env.example` - Environment variables template
- Code quality configuration (.eslintrc, .prettierrc, etc.)

**Quality Gate: Project Structure Validation**
```bash
# Validate project initialized
if [ ! -f "package.json" ] && [ ! -f "pyproject.toml" ] && [ ! -f "pom.xml" ] && [ ! -f "Cargo.toml" ]; then
  echo "❌ Project not initialized (no package manifest found)"
  exit 1
fi

# Validate .env.example exists
if [ ! -f ".env.example" ]; then
  echo "❌ Missing .env.example file"
  exit 1
fi

# Validate database schema
if [ ! -d "prisma" ] && [ ! -d "migrations" ] && [ ! -f "alembic.ini" ]; then
  echo "❌ Database schema not initialized"
  exit 1
fi

echo "✅ Project structure initialized"
```

**Track Progress:**
```bash
TOKENS_USED=6000

# Store project structure
  "Project initialized with dependencies" \
  "$(ls -la)"
```

---

## Phase 4: Backend Implementation (35-55%)

**⚡ EXECUTE TASK TOOL:**
```
Use the backend-developer agent to:
1. Implement data models based on schema
2. Create API endpoints (REST/GraphQL/gRPC)
3. Implement business logic and services
4. Add authentication and authorization
5. Set up error handling and logging
6. Implement input validation and sanitization

subagent_type: "orchestr8:development:fullstack-developer"
description: "Implement backend APIs and business logic"
prompt: "Implement complete backend based on design:

Requirements: $(cat requirements.md)
Architecture: $(cat architecture.md)
Data Model: $(cat data-model.md)

Tasks:
1. **Data Models**
   - Implement all entity models
   - Add relationships and constraints
   - Create repository/DAO layer
   - Implement data validation

2. **API Endpoints**
   - Create all required endpoints per requirements
   - Implement CRUD operations
   - Add pagination, filtering, sorting
   - Document with OpenAPI/Swagger

3. **Business Logic**
   - Implement service layer
   - Add business rules and validations
   - Handle edge cases
   - Implement transactions

4. **Authentication & Authorization**
   - Implement auth strategy (JWT/OAuth/Session)
   - Add user registration and login
   - Implement role-based access control
   - Add password hashing and security

5. **Error Handling**
   - Consistent error responses
   - Structured logging
   - Error tracking setup
   - Graceful degradation

6. **Input Validation**
   - Validate all inputs
   - Sanitize user data
   - Prevent SQL injection
   - OWASP Top 10 compliance

Expected outputs:
- src/models/ - Data models
- src/controllers/ or src/routes/ - API endpoints
- src/services/ - Business logic
- src/middleware/ - Auth and validation
- API documentation
"
```

**Expected Outputs:**
- `src/models/` - Complete data models with relationships
- `src/controllers/` or `src/routes/` - API endpoint implementations
- `src/services/` - Business logic layer
- `src/middleware/` - Authentication, authorization, validation
- `docs/api/` - API documentation (OpenAPI/Swagger)

**Quality Gate: Backend Implementation Validation**
```bash
# Validate models directory exists
if [ ! -d "src/models" ] && [ ! -d "src/entities" ]; then
  echo "❌ Models not implemented"
  exit 1
fi

# Validate API routes exist
if [ ! -d "src/routes" ] && [ ! -d "src/controllers" ]; then
  echo "❌ API routes not implemented"
  exit 1
fi

# Validate auth middleware
if ! grep -r "auth" src/middleware/ 2>/dev/null; then
  echo "⚠️ Warning: No authentication middleware found"
fi

echo "✅ Backend implementation complete"
```

**Track Progress:**
```bash
TOKENS_USED=12000

# Store backend code patterns
  "Backend API implementation" \
  "$(find src -name '*.ts' -o -name '*.py' -o -name '*.java' | head -5 | xargs head -20)"
```

---

## Phase 5: Frontend Implementation (55-65%)

**Note:** Skip this phase if project is backend-only (API/service).

**⚡ EXECUTE TASK TOOL:**
```
Use the frontend-developer agent to:
1. Set up component structure based on architecture
2. Implement UI components per requirements
3. Add state management (Redux/Context/Zustand)
4. Connect to backend APIs
5. Implement routing and navigation
6. Add form validation and error handling
7. Ensure responsive design and accessibility

subagent_type: "orchestr8:frontend:react-specialist"
description: "Implement frontend UI and integration"
prompt: "Implement complete frontend based on design:

Requirements: $(cat requirements.md)
Architecture: $(cat architecture.md)
API Documentation: $(cat docs/api/openapi.json)

Tasks:
1. **Component Structure**
   - Create component hierarchy
   - Implement reusable components
   - Add styling (CSS/Tailwind/styled-components)
   - Follow design system

2. **UI Implementation**
   - Implement all required pages/views
   - Add forms with validation
   - Implement data tables/lists
   - Add loading and error states

3. **State Management**
   - Set up state management solution
   - Implement global state
   - Add local component state
   - Cache API responses

4. **API Integration**
   - Create API client
   - Implement data fetching
   - Add error handling
   - Implement optimistic updates

5. **Routing & Navigation**
   - Set up routing
   - Add navigation components
   - Implement protected routes
   - Add route guards

6. **Responsive Design**
   - Mobile-first approach
   - Breakpoints for tablet/desktop
   - Touch-friendly interactions
   - Test across devices

7. **Accessibility**
   - WCAG 2.1 AA compliance
   - Semantic HTML
   - ARIA labels
   - Keyboard navigation

Expected outputs:
- src/components/ - UI components
- src/pages/ - Page components
- src/store/ - State management
- src/api/ - API client
- src/styles/ - Styling
"
```

**Expected Outputs:**
- `src/components/` - Reusable UI components
- `src/pages/` or `src/views/` - Page components
- `src/store/` or `src/state/` - State management
- `src/api/` - API client and data fetching
- `src/styles/` - Styling and themes

**Quality Gate: Frontend Implementation Validation**
```bash
# Check if frontend exists (skip if backend-only)
if [ -d "src/components" ] || [ -d "src/pages" ]; then
  # Validate components directory
  if [ ! -d "src/components" ]; then
    echo "❌ Components not implemented"
    exit 1
  fi

  # Validate API client
  if [ ! -d "src/api" ] && [ ! -f "src/api.ts" ]; then
    echo "⚠️ Warning: No API client found"
  fi

  echo "✅ Frontend implementation complete"
else
  echo "ℹ️ Skipping frontend validation (backend-only project)"
fi
```

**Track Progress:**
```bash
TOKENS_USED=10000

# Store frontend patterns
  "Frontend UI implementation" \
  "$(find src/components -name '*.tsx' -o -name '*.jsx' 2>/dev/null | head -5 | xargs head -20)"
```

---

## Phase 6: Testing (65-80%)

**⚡ EXECUTE TASK TOOL:**
```
Use the test-engineer agent to:
1. Write comprehensive unit tests (80%+ coverage)
2. Create integration tests for critical paths
3. Add E2E tests for key user journeys
4. Set up test infrastructure and fixtures
5. Add performance tests if applicable
6. Run all tests and ensure they pass

subagent_type: "orchestr8:quality:test-engineer"
description: "Implement comprehensive test suite"
prompt: "Create complete test suite for project:

Requirements: $(cat requirements.md)
Source Code: Backend (src/) and Frontend (src/)

Tasks:
1. **Unit Tests**
   - Test all models and services
   - Test utility functions
   - Test API endpoints (mocked)
   - Test UI components (mocked)
   - Achieve 80%+ code coverage

2. **Integration Tests**
   - Test API with real database
   - Test authentication flow
   - Test critical business logic
   - Test error scenarios

3. **E2E Tests**
   - Test complete user journeys
   - Test authentication flow
   - Test core features end-to-end
   - Test error handling

4. **Test Infrastructure**
   - Set up test database
   - Create test fixtures/seeds
   - Add test utilities
   - Configure test runner

5. **Performance Tests** (if applicable)
   - Load testing for APIs
   - Frontend performance tests
   - Database query performance

6. **Run Tests**
   - Execute all test suites
   - Generate coverage report
   - Fix any failing tests
   - Document test results

Expected outputs:
- tests/unit/ - Unit tests
- tests/integration/ - Integration tests
- tests/e2e/ - E2E tests
- Test coverage report
- All tests passing
"
```

**Expected Outputs:**
- `tests/unit/` or `__tests__/` - Unit tests
- `tests/integration/` - Integration tests
- `tests/e2e/` - End-to-end tests
- Test fixtures and utilities
- Coverage report showing 80%+ coverage

**Quality Gate: Testing Validation**
```bash
# Validate test directory exists
if [ ! -d "tests" ] && [ ! -d "__tests__" ] && [ ! -d "test" ]; then
  echo "❌ No tests directory found"
  exit 1
fi

# Run tests (this will vary by tech stack)
echo "Running test suite..."
if [ -f "package.json" ]; then
  npm test || {
    echo "❌ Tests failed"
    exit 1
  }
elif [ -f "pyproject.toml" ]; then
  pytest || {
    echo "❌ Tests failed"
    exit 1
  }
fi

# Check coverage (if coverage tool available)
if command -v coverage &> /dev/null; then
  COVERAGE=$(coverage report | grep TOTAL | awk '{print $4}' | sed 's/%//')
  if [ "$COVERAGE" -lt 80 ]; then
    echo "⚠️ Warning: Coverage is ${COVERAGE}% (target: 80%)"
  fi
fi

echo "✅ All tests passing"
```

**Track Progress:**
```bash
TOKENS_USED=10000

# Store test patterns
  "Test suite with coverage" \
  "$(find tests -name '*.test.*' 2>/dev/null | head -5 | xargs head -20)"
```

---

## Phase 7: Quality Gates (80-90%)

**🚀 PARALLEL EXECUTION REQUIRED:** Run all 3 quality gates in parallel for maximum speed. Use a single message with 3 Task tool calls to execute code-reviewer, security-auditor, and performance-analyzer agents concurrently. Each writes to separate output files, so no conflicts.

### Gate 7.1: Code Review

**⚡ EXECUTE TASK TOOL:**
```
Use the code-reviewer agent to:
1. Review all code for quality and best practices
2. Check for code smells and anti-patterns
3. Verify SOLID principles adherence
4. Review error handling and edge cases
5. Check documentation and comments
6. Generate code review report

subagent_type: "orchestr8:quality:code-reviewer"
description: "Comprehensive code quality review"
prompt: "Review all project code for quality:

Source Code: Entire project directory

Tasks:
1. **Code Quality**
   - Check for code smells
   - Verify naming conventions
   - Check function/method complexity
   - Review code organization

2. **Best Practices**
   - SOLID principles adherence
   - DRY principle
   - Separation of concerns
   - Proper abstraction

3. **Error Handling**
   - Proper try-catch blocks
   - Error messages clear and actionable
   - Graceful degradation
   - Logging in place

4. **Documentation**
   - Functions documented
   - Complex logic explained
   - API documented
   - README complete

5. **Security**
   - Input validation
   - No hardcoded secrets
   - Proper authentication
   - OWASP compliance

Expected outputs:
- code-review-report.md - Detailed review findings
"
```

### Gate 7.2: Security Audit

**⚡ EXECUTE TASK TOOL:**
```
Use the security-auditor agent to:
1. Scan for security vulnerabilities
2. Check for dependency vulnerabilities
3. Detect hardcoded secrets
4. Review authentication/authorization
5. Verify OWASP Top 10 compliance
6. Generate security audit report

subagent_type: "orchestr8:quality:security-auditor"
description: "Security audit and vulnerability scan"
prompt: "Perform comprehensive security audit:

Project Directory: Entire project

Tasks:
1. **Vulnerability Scanning**
   - Run npm audit / pip-audit
   - Check for known CVEs
   - Identify outdated dependencies

2. **Secret Detection**
   - Scan for hardcoded API keys
   - Check for credentials in code
   - Verify .env files not committed

3. **Code Security Review**
   - SQL injection prevention
   - XSS prevention
   - CSRF protection
   - Input validation

4. **Authentication & Authorization**
   - Proper password hashing
   - Secure session management
   - Role-based access control
   - JWT security

5. **OWASP Top 10**
   - Check all OWASP categories
   - Document any findings
   - Provide remediation steps

Expected outputs:
- security-audit-report.md - Security findings
"
```

### Gate 7.3: Performance Analysis

**⚡ EXECUTE TASK TOOL:**
```
Use the performance-analyzer agent to:
1. Profile application performance
2. Identify bottlenecks
3. Review database query performance
4. Check bundle size (if frontend)
5. Test API response times
6. Generate performance report

subagent_type: "orchestr8:quality:load-testing-specialist"
description: "Performance profiling and optimization"
prompt: "Analyze project performance:

Project: Complete application

Tasks:
1. **Backend Performance**
   - Profile API endpoints
   - Check response times (target: <200ms p50)
   - Identify slow database queries
   - Review N+1 query issues

2. **Frontend Performance** (if applicable)
   - Run Lighthouse audit
   - Check bundle size
   - Analyze render performance
   - Check for unnecessary re-renders

3. **Database Performance**
   - Review query execution plans
   - Check for missing indexes
   - Identify slow queries
   - Review connection pooling

4. **Bottleneck Identification**
   - CPU-intensive operations
   - Memory usage patterns
   - I/O bottlenecks
   - Network latency

5. **Recommendations**
   - Prioritized optimization opportunities
   - Quick wins
   - Long-term improvements

Expected outputs:
- performance-report.md - Performance findings and recommendations
"
```

**Expected Outputs (Quality Gates):**
- `code-review-report.md` - Code quality findings
- `security-audit-report.md` - Security vulnerabilities and fixes
- `performance-report.md` - Performance analysis and recommendations

**Quality Gate: All Gates Must Pass**
```bash
# Validate all reports exist
for report in code-review-report.md security-audit-report.md performance-report.md; do
  if [ ! -f "$report" ]; then
    echo "❌ Missing report: $report"
    exit 1
  fi
done

# Check for critical issues in reports
if grep -i "critical" *.md | grep -v "✅"; then
  echo "❌ Critical issues found in quality gates"
  exit 1
fi

echo "✅ All quality gates passed"
```

**Track Progress:**
```bash
TOKENS_USED=9000

# Store quality gate results
  "Quality gate results" \
  "$(cat code-review-report.md security-audit-report.md performance-report.md)"
```

---

## Phase 8: DevOps & Deployment (90-100%)

### Step 8.1: CI/CD Setup

**⚡ EXECUTE TASK TOOL:**
```
Use the ci-cd-engineer agent to:
1. Set up GitHub Actions / GitLab CI / Jenkins
2. Configure automated testing pipeline
3. Add linting and code quality checks
4. Set up security scanning
5. Configure deployment automation
6. Add environment-specific configurations

subagent_type: "orchestr8:devops:terraform-specialist"
description: "Set up CI/CD pipeline"
prompt: "Set up complete CI/CD pipeline:

Project: Complete application
Tech Stack: $(cat tech-stack.md)

Tasks:
1. **CI Pipeline**
   - Create .github/workflows/ or .gitlab-ci.yml
   - Add build job
   - Add test job (unit, integration, e2e)
   - Add linting job
   - Add security scanning

2. **Quality Checks**
   - Code coverage threshold (80%)
   - Linting must pass
   - Security scan must pass
   - Performance budgets

3. **CD Pipeline**
   - Staging deployment
   - Production deployment (manual approval)
   - Rollback strategy
   - Health checks

4. **Notifications**
   - Build status notifications
   - Deployment notifications
   - Failure alerts

Expected outputs:
- .github/workflows/ or .gitlab-ci.yml - CI/CD configuration
"
```

### Step 8.2: Infrastructure Setup

**⚡ EXECUTE TASK TOOL:**
```
Use appropriate infrastructure agent to:
1. Set up infrastructure as code (Terraform/CDK)
2. Configure hosting environment
3. Set up database (managed service)
4. Configure environment variables
5. Set up monitoring and logging
6. Configure backups

subagent_type: "[orchestr8:devops:terraform-specialist|orchestr8:devops:aws-specialist|orchestr8:devops:terraform-specialist]"
description: "Set up infrastructure and hosting"
prompt: "Set up complete infrastructure:

Architecture: $(cat architecture.md)
Tech Stack: $(cat tech-stack.md)

Tasks:
1. **Infrastructure as Code**
   - Create Terraform/CDK configuration
   - Define all resources
   - Use variables for configuration
   - Add state management

2. **Hosting Setup**
   - Configure application hosting
   - Set up load balancer
   - Configure auto-scaling
   - Set up CDN (if applicable)

3. **Database Setup**
   - Provision managed database
   - Configure backups
   - Set up read replicas (if needed)
   - Configure connection pooling

4. **Environment Configuration**
   - Set up environment variables
   - Configure secrets management
   - Add SSL certificates
   - Configure DNS

5. **Monitoring & Logging**
   - Set up application monitoring
   - Configure log aggregation
   - Add error tracking (Sentry/Rollbar)
   - Set up alerts

Expected outputs:
- infrastructure/ - Terraform/CDK code
- docker-compose.yml - Local development setup
"
```

### Step 8.3: Documentation

**⚡ EXECUTE TASK TOOL:**
```
Use the technical-writer agent to:
1. Create comprehensive README
2. Write setup and installation guide
3. Document API endpoints
4. Create architecture documentation
5. Write deployment guide
6. Add troubleshooting guide

subagent_type: "orchestr8:development:fullstack-developer"
description: "Create complete project documentation"
prompt: "Create comprehensive documentation:

Project: Complete application
Requirements: $(cat requirements.md)
Architecture: $(cat architecture.md)

Tasks:
1. **README.md**
   - Project overview and features
   - Prerequisites
   - Installation instructions
   - Usage examples
   - Development guide
   - Contributing guidelines

2. **docs/SETUP.md**
   - Detailed setup steps
   - Environment configuration
   - Database setup
   - Local development

3. **docs/API.md**
   - All endpoints documented
   - Request/response examples
   - Authentication guide
   - Error codes

4. **docs/ARCHITECTURE.md**
   - System overview
   - Component diagrams
   - Data flow
   - Technology decisions

5. **docs/DEPLOYMENT.md**
   - Deployment process
   - Environment setup
   - CI/CD pipeline
   - Rollback procedures

6. **docs/TROUBLESHOOTING.md**
   - Common issues
   - Solutions
   - FAQ

Expected outputs:
- README.md - Main documentation
- docs/ - Comprehensive documentation directory
"
```

### Step 8.4: Deployment

**⚡ EXECUTE TASK TOOL:**
```
Use the devops-engineer agent to:
1. Deploy to staging environment
2. Run smoke tests
3. Verify monitoring and logging
4. Deploy to production (if approved)
5. Verify deployment health
6. Set up rollback plan

subagent_type: "orchestr8:devops:terraform-specialist"
description: "Deploy application to environments"
prompt: "Deploy application to production:

Infrastructure: infrastructure/
CI/CD: .github/workflows/

Tasks:
1. **Staging Deployment**
   - Deploy to staging environment
   - Run database migrations
   - Verify deployment
   - Run smoke tests

2. **Staging Validation**
   - Check application health
   - Test key features
   - Verify monitoring data
   - Check logs

3. **Production Deployment**
   - Get user approval
   - Deploy to production
   - Run migrations (zero-downtime)
   - Monitor deployment

4. **Production Validation**
   - Verify health checks
   - Test key endpoints
   - Monitor error rates
   - Check performance metrics

5. **Post-Deployment**
   - Document deployment
   - Set up alerts
   - Plan rollback if needed
   - Monitor for 24 hours

Expected outputs:
- Deployment logs
- Health check results
- Deployment summary
"
```

**Expected Outputs (DevOps):**
- `.github/workflows/` or `.gitlab-ci.yml` - CI/CD pipeline
- `infrastructure/` - Infrastructure as code
- `docker-compose.yml` - Local development setup
- `README.md` - Complete project documentation
- `docs/` - Detailed documentation
- Application deployed to staging and production

**Quality Gate: Deployment Validation**
```bash
# Validate CI/CD configuration
if [ ! -d ".github/workflows" ] && [ ! -f ".gitlab-ci.yml" ]; then
  echo "❌ No CI/CD configuration found"
  exit 1
fi

# Validate infrastructure code
if [ ! -d "infrastructure" ] && [ ! -f "docker-compose.yml" ]; then
  echo "⚠️ Warning: No infrastructure code found"
fi

# Validate README
if [ ! -f "README.md" ]; then
  echo "❌ README.md missing"
  exit 1
fi

# Check README length (should be comprehensive)
README_LINES=$(wc -l < README.md)
if [ "$README_LINES" -lt 50 ]; then
  echo "⚠️ Warning: README seems too short ($README_LINES lines)"
fi

echo "✅ DevOps setup and deployment complete"
```

**Track Progress:**
```bash
TOKENS_USED=12000

# Store deployment info
  "Deployment configuration and documentation" \
  "$(cat README.md | head -50)"
```

---

## Workflow Complete

```bash
# Complete workflow tracking
WORKFLOW_END=$(date +%s)

  "Project created and deployed successfully"

echo "
✅ NEW PROJECT WORKFLOW COMPLETE

Project: $1

Deliverables:
✅ Requirements documented (requirements.md)
✅ Architecture designed (architecture.md, tech-stack.md)
✅ Project initialized with dependencies
✅ Backend implemented with APIs and business logic
✅ Frontend implemented (if applicable)
✅ Comprehensive test suite (80%+ coverage)
✅ Code review passed
✅ Security audit passed
✅ Performance analysis completed
✅ CI/CD pipeline configured
✅ Infrastructure as code created
✅ Complete documentation (README.md, docs/)
✅ Deployed to staging and production

Key Files Created:
- requirements.md, architecture.md, tech-stack.md
- Source code (src/)
- Tests (tests/ or __tests__/)
- CI/CD (.github/workflows/ or .gitlab-ci.yml)
- Infrastructure (infrastructure/)
- Documentation (README.md, docs/)

Quality Reports:
- code-review-report.md
- security-audit-report.md
- performance-report.md

Next Steps:
1. Review all documentation
2. Test the deployed application
3. Monitor application health
4. Set up ongoing maintenance
5. Plan feature iterations
"

# Display metrics
```

## Success Criteria Checklist

- ✅ Requirements analyzed and documented
- ✅ System architecture designed and approved
- ✅ Technology stack selected with rationale
- ✅ Project structure initialized
- ✅ All dependencies installed and configured
- ✅ Backend APIs implemented with authentication
- ✅ Frontend UI implemented (if applicable)
- ✅ Comprehensive test suite (80%+ coverage)
- ✅ All tests passing
- ✅ Code review passed with no critical issues
- ✅ Security audit passed with no critical vulnerabilities
- ✅ Performance analysis completed
- ✅ CI/CD pipeline functional
- ✅ Infrastructure as code created
- ✅ Application deployed to staging
- ✅ Application deployed to production (if approved)
- ✅ Monitoring and logging in place
- ✅ Complete documentation created
- ✅ README with setup and usage instructions
- ✅ Rollback plan documented

## Example Usage

```bash
/new-project "Build a task management API with user authentication, task CRUD operations, task assignment, priority levels, and deadline notifications. Should support 10,000 concurrent users, integrate with email service for notifications, and include real-time updates via WebSockets."
```

The workflow will:
1. Analyze requirements and extract functional/non-functional requirements
2. Design system architecture and choose tech stack (e.g., Node.js + PostgreSQL)
3. Initialize project with all dependencies and configuration
4. Implement backend APIs with authentication, tasks, notifications
5. Create comprehensive test suite with 80%+ coverage
6. Run quality gates (code review, security audit, performance)
7. Set up CI/CD pipeline with GitHub Actions
8. Create infrastructure as code (Terraform/Docker)
9. Deploy to staging and production
10. Generate complete documentation

## Technology Stack Examples

**Node.js + TypeScript:**
- Backend: Express/Fastify + Prisma + PostgreSQL
- Frontend: Next.js + React + TailwindCSS
- Testing: Jest + Supertest + Playwright
- Deployment: Vercel + Railway/Heroku

**Python:**
- Backend: FastAPI + SQLAlchemy + PostgreSQL
- Frontend: Next.js (separate) or Jinja templates
- Testing: pytest + httpx + Selenium
- Deployment: AWS Lambda/ECS + RDS

**Java:**
- Backend: Spring Boot + Hibernate + PostgreSQL
- Frontend: React (separate) or Thymeleaf
- Testing: JUnit + Mockito + Selenium
- Deployment: AWS ECS/EKS + RDS

**Go:**
- Backend: Gin/Echo + GORM + PostgreSQL
- Frontend: React/Next.js (separate)
- Testing: go test + testify + Selenium
- Deployment: AWS ECS/Lambda + RDS

## Anti-Patterns

### DO NOT
- ❌ Skip architecture approval checkpoint
- ❌ Implement without requirements analysis
- ❌ Deploy without passing all quality gates
- ❌ Skip testing (must have 80%+ coverage)
- ❌ Commit secrets or credentials
- ❌ Deploy without CI/CD pipeline
- ❌ Skip documentation
- ❌ Ignore security vulnerabilities
- ❌ Deploy without monitoring

### DO
- ✅ Get user approval on architecture before implementation
- ✅ Follow all phases sequentially
- ✅ Ensure all quality gates pass
- ✅ Write tests throughout development
- ✅ Use environment variables for configuration
- ✅ Set up CI/CD early
- ✅ Document as you build
- ✅ Fix security issues before deployment
- ✅ Set up monitoring before going live

## Notes

- This workflow is fully autonomous after architecture approval
- All quality gates must pass before deployment
- Failures trigger automatic remediation attempts
- Progress tracked via database throughout execution
- Token usage optimized via database queries
- Infrastructure costs estimated and documented
- Rollback procedures in place for all deployments
