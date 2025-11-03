---
description: Add a complete feature with full lifecycle - analysis, implementation, testing, review, deployment
argumentHint: "[feature-description]"
---

# Add Feature Workflow

## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate this entire workflow to the feature-orchestrator agent using the Task tool.

**Delegation Instructions:**
```
Use Task tool with:
- subagent_type: "feature-orchestrator"
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

## Database Intelligence Integration

**At workflow start, source the database helpers:**
```bash
source /Users/seth/Projects/orchestr8/.claude/lib/db-helpers.sh

# Create workflow record
WORKFLOW_ID="add-feature-$(date +%s)"
db_create_workflow "$WORKFLOW_ID" "add-feature" "$*" 4 "normal"
db_update_workflow_status "$WORKFLOW_ID" "in_progress"

# Query similar past workflows for estimation
echo "=== Learning from past feature additions ==="
db_find_similar_workflows "add-feature" 5
```

## Execution Steps

### Phase 1: Analysis & Design (20%)

1. **Analyze Requirements**
   - Read and understand feature description
   - Identify affected components (frontend, backend, database)
   - List dependencies on existing code
   - Define acceptance criteria

2. **Design Implementation**
   - Design API contracts (if backend changes)
   - Design UI/UX changes (if frontend changes)
   - Design database changes (if data model affected)
   - Plan integration points
   - Define testing strategy

3. **Create Task Plan**
   Use TodoWrite to create detailed task list:
   - [ ] Database migrations (if needed)
   - [ ] Backend API implementation
   - [ ] Frontend implementation
   - [ ] Integration
   - [ ] Unit tests
   - [ ] Integration tests
   - [ ] E2E tests (if UI)
   - [ ] Documentation updates

**CHECKPOINT**: Review plan with user if complex feature

### Phase 2: Implementation (50%)

Execute tasks based on feature scope:

#### For Backend-Only Features
```
1. Use backend-developer or language-specific agent
2. Implement service layer
3. Add API endpoints
4. Write unit tests
5. Write integration tests
```

#### For Frontend-Only Features
```
1. Use frontend-developer
2. Implement UI components
3. Add client-side logic
4. Write component tests
5. Write E2E tests
```

#### For Full-Stack Features
```
1. Database changes (database-specialist if complex)
2. Backend implementation (parallel)
3. Frontend implementation (parallel, if API contract clear)
4. Integration
5. Comprehensive testing
```

**Parallelization:**
- Frontend and backend can develop in parallel if API contract is defined
- Different backend services can be developed in parallel
- Test writing can happen alongside implementation

### Phase 3: Quality Gates (20%)

Run all gates in parallel:

1. **Code Review** - `code-reviewer`:
   ```bash
   # Log quality gate
   db_log_quality_gate "$WORKFLOW_ID" "code_review" "running"

   # Run review
   # - Clean code principles
   # - Best practices
   # - SOLID principles
   # - No code smells

   # Log result
   db_log_quality_gate "$WORKFLOW_ID" "code_review" "passed" 95 0
   db_send_notification "$WORKFLOW_ID" "quality_gate" "normal" "Code Review Passed" "Feature code meets quality standards"
   ```

2. **Testing** - `test-engineer`:
   ```bash
   # Log quality gate
   db_log_quality_gate "$WORKFLOW_ID" "testing" "running"

   # Run tests
   # - Adequate test coverage (>80%)
   # - All tests passing
   # - Edge cases covered

   # Log result with coverage score
   COVERAGE=$(get_test_coverage)
   db_log_quality_gate "$WORKFLOW_ID" "testing" "passed" $COVERAGE 0
   db_send_notification "$WORKFLOW_ID" "quality_gate" "normal" "Tests Passed" "Coverage: ${COVERAGE}%"
   ```

3. **Security** - `security-auditor`:
   ```bash
   # Log quality gate
   db_log_quality_gate "$WORKFLOW_ID" "security" "running"

   # Run security checks
   # - Input validation
   # - No vulnerabilities
   # - No secrets in code
   # - OWASP compliance

   ISSUES_FOUND=$(count_security_issues)
   db_log_quality_gate "$WORKFLOW_ID" "security" "passed" 100 $ISSUES_FOUND
   db_send_notification "$WORKFLOW_ID" "quality_gate" "high" "Security Scan Clean" "No vulnerabilities found"
   ```

4. **Performance** - `performance-analyzer` (if performance-critical):
   ```bash
   # Log quality gate
   db_log_quality_gate "$WORKFLOW_ID" "performance" "running"

   # Check performance
   # - No N+1 queries
   # - Response times acceptable
   # - Bundle size reasonable (frontend)

   PERF_SCORE=$(calculate_performance_score)
   db_log_quality_gate "$WORKFLOW_ID" "performance" "passed" $PERF_SCORE 0
   db_send_notification "$WORKFLOW_ID" "quality_gate" "normal" "Performance Check Passed" "Score: ${PERF_SCORE}"
   ```

5. **Accessibility** - `accessibility-expert` (if UI changes):
   ```bash
   # Log quality gate
   db_log_quality_gate "$WORKFLOW_ID" "accessibility" "running"

   # Check accessibility
   # - WCAG 2.1 AA compliance
   # - Keyboard navigation
   # - Screen reader compatible

   A11Y_SCORE=$(run_accessibility_audit)
   db_log_quality_gate "$WORKFLOW_ID" "accessibility" "passed" $A11Y_SCORE 0
   db_send_notification "$WORKFLOW_ID" "quality_gate" "normal" "Accessibility Passed" "WCAG 2.1 AA compliant"
   ```

**All gates must PASS before proceeding**

### Phase 4: Documentation & Deployment (10%)

1. **Update Documentation**
   - README if user-facing changes
   - API docs if API changes
   - Code comments for complex logic
   - Architecture docs if design changed

2. **Create PR/Commit**
   - Descriptive commit message (Conventional Commits)
   - Link to issue/ticket
   - Summary of changes
   - Testing notes

3. **Deploy**
   - Deploy to staging
   - Run smoke tests
   - Deploy to production (if approved)
   - Monitor for errors

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

## Success Criteria

Feature is complete when:
- ✅ Acceptance criteria met
- ✅ All tests passing
- ✅ All quality gates passed
- ✅ Code reviewed and approved
- ✅ Documentation updated
- ✅ Deployed successfully
- ✅ Monitoring shows no errors
- ✅ User accepts feature

## Example Usage

```
/add-feature "Add real-time notifications using WebSockets.
Users should see notifications instantly when events occur.
Include notification history and mark as read functionality."
```

The feature orchestrator will:
1. Design WebSocket architecture
2. Implement backend WebSocket server
3. Implement frontend WebSocket client
4. Add notification UI components
5. Add database schema for notifications
6. Write comprehensive tests
7. Run all quality gates
8. Update documentation
9. Deploy to production

## Anti-Patterns to Avoid

❌ Don't skip quality gates to "move faster"
❌ Don't start coding without design
❌ Don't merge without tests
❌ Don't ignore security review
❌ Don't forget documentation
❌ Don't deploy without staging verification

## Workflow Completion & Learning

**At workflow end:**
```bash
# Calculate token usage across all agents
TOTAL_TOKENS=$(sum_agent_token_usage)
db_track_tokens "$WORKFLOW_ID" "completion" "orchestrator" $TOTAL_TOKENS "workflow-complete"

# Update workflow status
db_update_workflow_status "$WORKFLOW_ID" "completed"

# Store lessons learned
db_store_knowledge "feature-orchestrator" "best_practice" "add-feature" \
  "Key learnings from this feature addition: [summarize what worked well, what challenges occurred, optimization opportunities]" \
  "# Example code pattern that worked well"

# Get final metrics
echo "=== Workflow Metrics ==="
db_workflow_metrics "$WORKFLOW_ID"

# Send completion notification
DURATION=$(calculate_workflow_duration)
db_send_notification "$WORKFLOW_ID" "workflow_complete" "high" \
  "Feature Added Successfully" \
  "Feature completed in ${DURATION} minutes. All quality gates passed. Token usage: ${TOTAL_TOKENS}."

# Display token savings compared to average
echo "=== Token Usage Report ==="
db_token_savings "$WORKFLOW_ID"
```

## Notes

- Feature orchestrator maintains context and coordinates agents
- All quality gates must pass - no exceptions
- Tests written alongside implementation (TDD preferred)
- Parallel execution for maximum speed
- User intervention only for major decisions
- **Database tracks all phases, quality gates, and learnings for continuous improvement**
