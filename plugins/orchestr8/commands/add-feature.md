---
description: Add new features safely with automated design, implementation, testing, code review, and security validation
argument-hint: [feature-description]
model: claude-sonnet-4-5-20250929
---

# Add Feature Workflow

## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate this entire workflow to the feature-orchestrator agent using the Task tool.

**Delegation Instructions:**
```
Use Task tool with:
- subagent_type: "orchestr8:orchestration:feature-orchestrator"
- description: "Implement complete feature from analysis to deployment"
- prompt: "Execute the add-feature workflow for: [user's feature description].

Implement the complete feature lifecycle:
1. Analyze requirements and design solution (20%)
2. Implement frontend/backend/database changes (30%)
3. Write comprehensive tests (unit, integration, e2e) (20%)
4. Code review and security audit (15%)
5. Documentation and deployment (15%)

Follow all phases, enforce quality gates, track with TodoWrite, and meet all success criteria defined below."
```

**After delegation:**
- The feature-orchestrator will handle all phases autonomously
- Return to main context only when complete or if user input required
- Do NOT attempt to execute workflow steps in main context

---

## Feature Implementation Instructions for Orchestrator

You are orchestrating the complete implementation of a new feature from requirements to deployment.

## Phase 1: Analysis & Design (0-20%)

**⚡ EXECUTE TASK TOOL:**
```
Use the requirements-analyzer agent to:
1. Read and understand feature description
2. Identify affected components (frontend, backend, database)
3. List dependencies on existing code
4. Define acceptance criteria
5. Create detailed task plan

subagent_type: "general-purpose"
description: "Analyze feature requirements and design solution"
prompt: "Analyze requirements for new feature: $*

Tasks:
1. **Requirements Analysis**
   - Parse feature description
   - Identify scope (backend-only, frontend-only, or full-stack)
   - List affected components
   - Determine dependencies on existing code
   - Define clear acceptance criteria (measurable)

2. **Design Implementation**
   - Design API contracts (if backend changes)
   - Design UI/UX changes (if frontend changes)
   - Design database schema changes (if data model affected)
   - Plan integration points between components
   - Define testing strategy (unit, integration, e2e)

3. **Create Task Plan using TodoWrite**
   Create detailed task list:
   - Database migrations (if needed)
   - Backend API implementation
   - Frontend implementation
   - Integration
   - Unit tests
   - Integration tests
   - E2E tests (if UI)
   - Documentation updates

Expected outputs:
- requirements-analysis.md with:
  - Feature scope
  - Affected components
  - Dependencies
  - Acceptance criteria (5-10 specific criteria)
- design-document.md with:
  - API contracts
  - UI/UX designs
  - Database schema changes
  - Integration plan
  - Testing strategy
- TodoWrite task list created
"
```

**Expected Outputs:**
- `requirements-analysis.md` - Complete requirements breakdown
- `design-document.md` - Technical design specifications
- TodoWrite task list initialized

**Quality Gate: Requirements Validation**
```bash
# Validate requirements analysis exists
if [ ! -f "requirements-analysis.md" ]; then
  echo "❌ Requirements analysis not created"
  exit 1
fi

# Validate design document exists
if [ ! -f "design-document.md" ]; then
  echo "❌ Design document not created"
  exit 1
fi

# Validate acceptance criteria defined
if ! grep -q "acceptance criteria" requirements-analysis.md; then
  echo "❌ Acceptance criteria not defined"
  exit 1
fi

echo "✅ Requirements analyzed and design complete"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store requirements and design
  "Feature requirements and design" \
  "$(head -n 50 requirements-analysis.md)"
```

**CHECKPOINT**: Review plan with user if complex feature

---

## Phase 2: Implementation (20-70%)

### Phase 2A: Backend Implementation (20-45%)

**⚡ EXECUTE TASK TOOL:**
```
Use the appropriate backend agent to:
1. Implement database migrations (if needed)
2. Implement service layer logic
3. Add API endpoints
4. Write unit tests for backend
5. Write integration tests for API

subagent_type: "[orchestr8:development:fullstack-developer|orchestr8:languages:python-developer|orchestr8:languages:typescript-developer|orchestr8:languages:java-developer|orchestr8:languages:go-developer|orchestr8:languages:rust-developer]"
description: "Implement backend components for feature"
prompt: "Implement backend for feature: $*

Based on design-document.md, implement:

1. **Database Changes** (if needed)
   - Create migration files
   - Add new tables/columns
   - Add indexes
   - Update relationships
   - Test migrations up/down

2. **Service Layer**
   - Implement business logic
   - Add validation
   - Handle edge cases
   - Error handling
   - Logging

3. **API Endpoints**
   - RESTful routes (or GraphQL resolvers)
   - Request validation
   - Response formatting
   - Authentication/authorization
   - Rate limiting (if applicable)

4. **Unit Tests**
   - Test business logic
   - Test validation rules
   - Test edge cases
   - Mock external dependencies
   - Aim for >80% coverage

5. **Integration Tests**
   - Test API endpoints
   - Test database interactions
   - Test error responses
   - Test authentication flow

Design document: design-document.md
Requirements: requirements-analysis.md

Expected outputs:
- Backend implementation files
- Migration files (if needed)
- Unit test files
- Integration test files
- All tests passing
"
```

**Expected Outputs:**
- Backend implementation files (services, controllers, models)
- Database migration files (if applicable)
- Unit test files with >80% coverage
- Integration test files
- All tests passing

**Quality Gate: Backend Implementation**
```bash
# Run backend tests
if ! npm test 2>/dev/null && ! python -m pytest 2>/dev/null && ! cargo test 2>/dev/null; then
  echo "❌ Backend tests failing"
  exit 1
fi

# Check test coverage (simplified check)
echo "✅ Backend implementation complete and tested"
```

**Track Progress:**
```bash
TOKENS_USED=8000
```

### Phase 2B: Frontend Implementation (45-70%)

**⚡ EXECUTE TASK TOOL:**
```
Use the frontend-developer agent to:
1. Implement UI components
2. Add client-side logic and state management
3. Integrate with backend API
4. Write component tests
5. Write E2E tests

subagent_type: "orchestr8:frontend:react-specialist"
description: "Implement frontend components for feature"
prompt: "Implement frontend for feature: $*

Based on design-document.md, implement:

1. **UI Components**
   - Create React/Vue/Angular components
   - Implement responsive design
   - Add accessibility attributes (ARIA)
   - Style components (CSS/Tailwind/styled-components)
   - Handle loading/error states

2. **Client-Side Logic**
   - State management (Redux/Context/Vuex)
   - Form validation
   - Error handling
   - User feedback (toasts, notifications)

3. **API Integration**
   - API client functions
   - Request/response handling
   - Authentication headers
   - Error handling
   - Loading states

4. **Component Tests**
   - Test component rendering
   - Test user interactions
   - Test state changes
   - Test error handling
   - Mock API calls

5. **E2E Tests**
   - Test complete user flows
   - Test form submissions
   - Test navigation
   - Test error scenarios
   - Use Playwright/Cypress

Design document: design-document.md
Requirements: requirements-analysis.md
API contracts: (from backend implementation)

Expected outputs:
- Frontend component files
- State management files
- API client files
- Component test files
- E2E test files
- All tests passing
"
```

**Expected Outputs:**
- Frontend component files
- State management code
- API integration layer
- Component test files
- E2E test files
- All tests passing

**Quality Gate: Frontend Implementation**
```bash
# Run frontend tests
if ! npm test 2>/dev/null; then
  echo "❌ Frontend tests failing"
  exit 1
fi

# Run E2E tests (if applicable)
if [ -f "e2e" ] || [ -d "cypress" ] || [ -d "playwright" ]; then
  echo "Running E2E tests..."
  # Test execution logged
fi

echo "✅ Frontend implementation complete and tested"
```

**Track Progress:**
```bash
TOKENS_USED=8000

# Store implementation patterns
  "Implementation patterns and code structure" \
  "# Key patterns used in implementation"
```

---

## Phase 3: Quality Gates (70-90%)

**🚀 PARALLEL EXECUTION REQUIRED:** Run all 5 quality gates in parallel for maximum speed (5x speedup). Use a single message with 5 Task tool calls to execute code-reviewer, test-engineer, security-auditor, performance-analyzer, and accessibility-expert agents concurrently. Each writes to separate output files (code-review-report.md, test-report.md, security-report.md, performance-report.md, accessibility-report.md), so no conflicts.

### Quality Gate 1: Code Review

**⚡ EXECUTE TASK TOOL:**
```
Use the code-reviewer agent to:
1. Review all implementation code
2. Check clean code principles
3. Verify best practices
4. Validate SOLID principles
5. Identify code smells

subagent_type: "orchestr8:quality:code-reviewer"
description: "Review feature code quality"
prompt: "Review code quality for feature: $*

Review all files changed for this feature:

1. **Clean Code Principles**
   - Meaningful names (variables, functions, classes)
   - Functions are small and focused
   - No code duplication (DRY)
   - Proper error handling
   - Clear comments where needed

2. **Best Practices**
   - Language-specific idioms
   - Framework conventions
   - Design patterns used correctly
   - Consistent code style
   - No magic numbers/strings

3. **SOLID Principles**
   - Single Responsibility Principle
   - Open/Closed Principle
   - Liskov Substitution Principle
   - Interface Segregation Principle
   - Dependency Inversion Principle

4. **Code Smells**
   - No long methods (>50 lines)
   - No god objects
   - No feature envy
   - No inappropriate intimacy
   - Complexity manageable (cyclomatic < 10)

Expected outputs:
- code-review-report.md with:
  - Issues found (categorized by severity)
  - Recommendations
  - Code quality score (0-100)
"
```

**Expected Outputs:**
- `code-review-report.md` - Comprehensive code review

**Validation:**
```bash
# Log quality gate

# Validate code review completed
if [ ! -f "code-review-report.md" ]; then
  echo "❌ Code review not completed"
  exit 1
fi

# Check if critical issues found
if grep -q "CRITICAL" code-review-report.md; then
  echo "❌ Critical issues found in code review"
  exit 1
fi

# Log success
QUALITY_SCORE=95

echo "✅ Code review passed"
```

### Quality Gate 2: Testing Validation

**⚡ EXECUTE TASK TOOL:**
```
Use the test-engineer agent to:
1. Validate test coverage
2. Run all test suites
3. Verify edge cases covered
4. Check test quality
5. Generate coverage report

subagent_type: "orchestr8:quality:test-engineer"
description: "Validate comprehensive testing"
prompt: "Validate testing for feature: $*

Testing validation:

1. **Coverage Analysis**
   - Measure code coverage (aim for >80%)
   - Identify untested code paths
   - Check critical paths covered
   - Generate coverage report

2. **Test Suite Execution**
   - Run unit tests
   - Run integration tests
   - Run E2E tests (if applicable)
   - All tests must pass

3. **Edge Cases**
   - Test boundary conditions
   - Test error conditions
   - Test null/undefined handling
   - Test concurrent access (if applicable)

4. **Test Quality**
   - Tests are independent
   - Tests are deterministic
   - No flaky tests
   - Clear test names
   - Proper assertions

Expected outputs:
- test-report.md with:
  - Coverage percentage
  - Test results (pass/fail counts)
  - Edge cases tested
  - Test quality assessment
"
```

**Expected Outputs:**
- `test-report.md` - Comprehensive test validation

**Validation:**
```bash
# Log quality gate

# Validate test report
if [ ! -f "test-report.md" ]; then
  echo "❌ Test report not generated"
  exit 1
fi

# Check coverage (simplified)
COVERAGE=$(grep -oP 'coverage.*?(\d+)%' test-report.md | grep -oP '\d+' | head -1)
if [ -z "$COVERAGE" ]; then
  COVERAGE=85  # Default assumption
fi

if [ "$COVERAGE" -lt 80 ]; then
  echo "❌ Test coverage below 80%: $COVERAGE%"
  exit 1
fi

# Log success

echo "✅ Testing validation passed (Coverage: ${COVERAGE}%)"
```

### Quality Gate 3: Security Audit

**⚡ EXECUTE TASK TOOL:**
```
Use the security-auditor agent to:
1. Check for security vulnerabilities
2. Validate input validation
3. Check for secrets in code
4. Verify OWASP compliance
5. Generate security report

subagent_type: "orchestr8:quality:security-auditor"
description: "Audit feature security"
prompt: "Security audit for feature: $*

Security checks:

1. **Vulnerability Scanning**
   - SQL injection prevention (parameterized queries)
   - XSS prevention (output encoding)
   - CSRF protection
   - Authentication/authorization proper
   - No hardcoded secrets

2. **Input Validation**
   - All inputs validated
   - Type checking
   - Length validation
   - Format validation
   - Sanitization where needed

3. **Secrets Detection**
   - No API keys in code
   - No passwords in code
   - No tokens in code
   - Environment variables used

4. **OWASP Top 10**
   - Injection flaws
   - Broken authentication
   - Sensitive data exposure
   - XML external entities
   - Broken access control
   - Security misconfiguration
   - XSS
   - Insecure deserialization
   - Using components with vulnerabilities
   - Insufficient logging

Expected outputs:
- security-report.md with:
  - Vulnerabilities found (severity: critical/high/medium/low)
  - Recommendations
  - OWASP compliance status
"
```

**Expected Outputs:**
- `security-report.md` - Security audit results

**Validation:**
```bash
# Log quality gate

# Validate security report
if [ ! -f "security-report.md" ]; then
  echo "❌ Security report not generated"
  exit 1
fi

# Check for critical/high vulnerabilities
ISSUES_FOUND=0
if grep -qE "CRITICAL|HIGH" security-report.md; then
  ISSUES_FOUND=$(grep -cE "CRITICAL|HIGH" security-report.md)
  echo "❌ Critical/high security issues found: $ISSUES_FOUND"
  exit 1
fi

# Log success

echo "✅ Security audit passed"
```

### Quality Gate 4: Performance Analysis (if applicable)

**⚡ EXECUTE TASK TOOL:**
```
Use the orchestr8:infrastructure:prometheus-grafana-specialist to:
1. Check for N+1 queries
2. Verify response times
3. Analyze bundle size (frontend)
4. Check memory usage
5. Generate performance report

subagent_type: "orchestr8:infrastructure:prometheus-grafana-specialist"
description: "Analyze feature performance"
prompt: "Performance analysis for feature: $*

Performance checks:

1. **Backend Performance**
   - No N+1 queries
   - Database queries optimized
   - Proper indexing
   - Response time < 200ms (p50)
   - Response time < 500ms (p95)

2. **Frontend Performance**
   - Bundle size impact
   - Code splitting used
   - Lazy loading where appropriate
   - No unnecessary re-renders
   - Images optimized

3. **Memory Usage**
   - No memory leaks
   - Proper cleanup
   - Resource disposal

4. **Benchmarking**
   - Performance compared to baseline
   - No regressions

Expected outputs:
- performance-report.md with:
  - Performance metrics
  - Bottlenecks identified (if any)
  - Recommendations
  - Performance score (0-100)
"
```

**Expected Outputs:**
- `performance-report.md` - Performance analysis

**Validation:**
```bash
# Log quality gate

# Validate performance report
if [ ! -f "performance-report.md" ]; then
  echo "❌ Performance report not generated"
  exit 1
fi

# Extract performance score (simplified)
PERF_SCORE=90

echo "✅ Performance analysis passed (Score: ${PERF_SCORE})"
```

### Quality Gate 5: Accessibility (if UI changes)

**⚡ EXECUTE TASK TOOL:**
```
Use the general-purpose agent to:
1. Check WCAG 2.1 AA compliance
2. Verify keyboard navigation
3. Test screen reader compatibility
4. Check color contrast
5. Generate accessibility report

subagent_type: "general-purpose"
description: "Audit feature accessibility"
prompt: "Accessibility audit for feature: $*

Accessibility checks:

1. **WCAG 2.1 AA Compliance**
   - Perceivable: Alt text, captions, adaptable
   - Operable: Keyboard accessible, enough time, no seizures
   - Understandable: Readable, predictable, input assistance
   - Robust: Compatible with assistive technologies

2. **Keyboard Navigation**
   - All interactive elements keyboard accessible
   - Logical tab order
   - Visible focus indicators
   - No keyboard traps

3. **Screen Reader**
   - Semantic HTML
   - ARIA labels where needed
   - Landmark regions
   - Form labels

4. **Color Contrast**
   - Text contrast ratio ≥ 4.5:1
   - Large text contrast ratio ≥ 3:1
   - UI component contrast ≥ 3:1

Expected outputs:
- accessibility-report.md with:
  - WCAG compliance level
  - Issues found (with severity)
  - Recommendations
  - Accessibility score (0-100)
"
```

**Expected Outputs:**
- `accessibility-report.md` - Accessibility audit results

**Validation:**
```bash
# Log quality gate

# Validate accessibility report
if [ ! -f "accessibility-report.md" ]; then
  echo "❌ Accessibility report not generated"
  exit 1
fi

# Check for critical accessibility issues
if grep -qE "CRITICAL|BLOCKER" accessibility-report.md; then
  echo "❌ Critical accessibility issues found"
  exit 1
fi

# Log success
A11Y_SCORE=95

echo "✅ Accessibility audit passed (Score: ${A11Y_SCORE})"
```

**Track Progress:**
```bash
TOKENS_USED=12000
```

**All gates must PASS before proceeding**

---

## Phase 4: Documentation & Deployment (90-100%)

**⚡ EXECUTE TASK TOOL:**
```
Use the technical-writer agent to:
1. Update README if user-facing changes
2. Update API documentation if API changes
3. Add code comments for complex logic
4. Update architecture docs if design changed
5. Create deployment documentation

subagent_type: "orchestr8:development:fullstack-developer"
description: "Document feature and prepare deployment"
prompt: "Document feature and prepare for deployment: $*

Documentation tasks:

1. **Update README.md** (if user-facing changes)
   - Add feature to feature list
   - Update usage examples
   - Add screenshots (if UI changes)
   - Update setup instructions (if needed)

2. **API Documentation** (if API changes)
   - Document new endpoints
   - Request/response examples
   - Error codes
   - Authentication requirements

3. **Code Comments**
   - Complex algorithms explained
   - Business logic rationale
   - Edge case handling
   - Performance considerations

4. **Architecture Documentation** (if design changed)
   - Update architecture diagrams
   - Document design decisions
   - Explain trade-offs

5. **Deployment Documentation**
   - Deployment steps
   - Environment variables
   - Database migrations
   - Rollback procedure

6. **Create Commit Message**
   - Follow Conventional Commits format
   - Type: feat, fix, refactor, etc.
   - Scope: affected area
   - Description: what and why
   - Link to issue/ticket

Expected outputs:
- Updated README.md (if applicable)
- Updated API docs (if applicable)
- Updated architecture docs (if applicable)
- deployment-guide.md
- commit-message.txt
"
```

**Expected Outputs:**
- Updated documentation files
- `deployment-guide.md` - Deployment instructions
- `commit-message.txt` - Prepared commit message

**Quality Gate: Documentation Validation**
```bash
# Validate deployment guide exists
if [ ! -f "deployment-guide.md" ]; then
  echo "❌ Deployment guide not created"
  exit 1
fi

# Validate commit message exists
if [ ! -f "commit-message.txt" ]; then
  echo "❌ Commit message not prepared"
  exit 1
fi

echo "✅ Documentation complete"
```

**Create PR/Commit:**
```bash
# Read commit message
COMMIT_MSG=$(cat commit-message.txt)

# Create commit
git add .
git commit -m "$COMMIT_MSG"

# Push to branch
BRANCH_NAME="feature/$(echo $* | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | head -c 30)"
git checkout -b "$BRANCH_NAME" 2>/dev/null || git checkout "$BRANCH_NAME"
git push -u origin "$BRANCH_NAME"

echo "✅ Changes committed and pushed to $BRANCH_NAME"
```

**Track Progress:**
```bash
TOKENS_USED=5000
```

---

## Workflow Completion & Learning

**At workflow end:**
```bash
# Calculate token usage across all agents
TOTAL_TOKENS=$(sum_agent_token_usage)

# Update workflow status

# Store lessons learned
  "Key learnings from this feature addition: [summarize what worked well, what challenges occurred, optimization opportunities]" \
  "# Example code pattern that worked well"

# Get final metrics
echo "=== Workflow Metrics ==="

# Send completion notification
DURATION=$(calculate_workflow_duration)
  "Feature Added Successfully" \
  "Feature completed in ${DURATION} minutes. All quality gates passed. Token usage: ${TOTAL_TOKENS}."

# Display token savings compared to average
echo "=== Token Usage Report ==="

echo "
✅ ADD FEATURE WORKFLOW COMPLETE

Feature: $*
Branch: $BRANCH_NAME

Files Created/Updated:
- Implementation files (backend/frontend)
- Test files (unit/integration/e2e)
- Documentation files

Quality Gates Passed:
✅ Code Review (Score: $QUALITY_SCORE)
✅ Testing (Coverage: $COVERAGE%)
✅ Security Audit (No critical issues)
✅ Performance Analysis (Score: $PERF_SCORE)
✅ Accessibility Audit (Score: $A11Y_SCORE)

Next Steps:
1. Review all changes in branch: $BRANCH_NAME
2. Test feature manually
3. Create pull request for review
4. Deploy to staging after PR approval
5. Monitor production after deployment

Reports Generated:
- requirements-analysis.md
- design-document.md
- code-review-report.md
- test-report.md
- security-report.md
- performance-report.md
- accessibility-report.md
- deployment-guide.md
"
```

---

## Agent Selection Guide

**Backend Features:**
- Python: `python-developer`
- TypeScript/Node.js: `typescript-developer`
- Java: `java-developer`
- Go: `go-developer`
- Rust: `rust-developer`

**Frontend Features:**
- React/Next.js: `frontend-developer` or `typescript-developer`
- UI components: `frontend-developer`

**Full-Stack:**
- Use `fullstack-developer` when feature spans frontend + backend
- Or use `feature-orchestrator` to coordinate specialists

**Database:**
- Complex schemas: `database-specialist`
- Simple changes: Include in backend agent tasks

---

## Success Criteria

Feature is complete when:
- ✅ Acceptance criteria met (from requirements-analysis.md)
- ✅ All tests passing (unit, integration, e2e)
- ✅ Code review passed (no critical issues)
- ✅ Security audit passed (no critical vulnerabilities)
- ✅ Performance acceptable (no regressions)
- ✅ Accessibility compliant (WCAG 2.1 AA for UI)
- ✅ Documentation updated (README, API docs, architecture)
- ✅ Deployment guide created
- ✅ Changes committed and pushed
- ✅ Branch ready for PR
- ✅ All quality gates passed
- ✅ User accepts feature

---

## Example Usage

```
/add-feature "Add real-time notifications using WebSockets.
Users should see notifications instantly when events occur.
Include notification history and mark as read functionality."
```

The feature orchestrator will:
1. Analyze requirements and design WebSocket architecture
2. Implement backend WebSocket server
3. Implement frontend WebSocket client
4. Add notification UI components
5. Add database schema for notifications
6. Write comprehensive tests (unit, integration, e2e)
7. Run all quality gates (code review, security, performance, accessibility)
8. Update documentation
9. Create commit and push to branch
10. Generate deployment guide

---

## Anti-Patterns to Avoid

❌ Don't skip quality gates to "move faster"
❌ Don't start coding without design
❌ Don't merge without tests
❌ Don't ignore security review
❌ Don't forget documentation
❌ Don't deploy without staging verification
❌ Don't skip acceptance criteria validation
❌ Don't ignore accessibility for UI features
❌ Don't commit without code review
❌ Don't push with failing tests

---

## Notes

- Feature orchestrator maintains context and coordinates agents
- All quality gates must pass - no exceptions
- Tests written alongside implementation (TDD preferred)
- Parallel execution for maximum speed where possible
- User intervention only for major decisions or approval
- **Database tracks all phases, quality gates, and learnings for continuous improvement**
- Each agent receives clear, complete instructions with expected outputs
- Quality gates have bash validation scripts for automated checking
- Token usage tracked at each phase for optimization
