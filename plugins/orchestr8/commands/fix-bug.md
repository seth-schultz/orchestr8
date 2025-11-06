---
description: Debug and fix bugs systematically with root cause analysis, regression tests, and validation
argument-hint: [bug-description-and-reproduction-steps]
model: haiku
---

# Fix Bug Workflow

## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate this entire workflow to the debugger agent using the Task tool.

**Delegation Instructions:**
```
Use Task tool with:
- subagent_type: "quality-assurance:debugger"
- description: "Debug and fix reported bug with regression test"
- prompt: "Execute the fix-bug workflow for: [user's bug description and reproduction steps].

Complete bug fix lifecycle:
1. Reproduce the bug and confirm behavior
2. Identify root cause through debugging
3. Design and implement fix
4. Write regression test to prevent recurrence
5. Validate fix and ensure no new issues
6. Document fix and update relevant docs

Follow all phases, enforce quality gates, and meet all success criteria."
```

**After delegation:**
- The debugger will handle bug fix autonomously
- Returns to main context when complete or if user input required

---

## Bug Fix Instructions for Orchestrator

Autonomous bug fixing from reproduction to production deployment with root cause analysis and regression prevention.

## Database Intelligence Integration

**At workflow start:**
```bash

# Create workflow record
WORKFLOW_ID="fix-bug-$(date +%s)"

# Check for similar past bugs (learn from history!)
echo "=== Searching for similar past bugs ==="
BUG_PATTERN=$(echo "$*" | head -c 100)

# Query past bug fix workflows for estimation
```

## Execution Instructions

### Phase 1: Bug Triage & Reproduction (0-15%)

**⚡ EXECUTE TASK TOOL:**
```
Use the debugger agent to:
1. Analyze bug report and parse error messages/stack traces
2. Gather context from recent changes and logs
3. Reproduce bug locally with exact environment
4. Create failing test that captures the bug

subagent_type: "quality-assurance:debugger"
description: "Reproduce bug and create failing test"
prompt: "Analyze and reproduce the reported bug:

Bug Report: $*

Tasks:

1. **Analyze Bug Report**
   - Parse error messages and stack traces
   - Identify affected components
   - Determine severity (critical, high, medium, low)
   - Check if known issue or regression

2. **Gather Context**
   ```bash
   # Check recent changes
   git log --since='1 week ago' --oneline -- [affected-files]

   # Search for similar bugs in issue tracker
   # Review monitoring/logs for patterns
   ```

3. **Reproduce Locally**
   - Set up exact environment
   - Follow reproduction steps
   - Verify bug manifests
   - Document exact conditions

4. **Create Failing Test**
   Coordinate with test-engineer to write test that fails:
   - Unit test for isolated bug
   - Integration test for system interaction
   - E2E test for user-facing bug

Expected outputs:
- Bug reproduction steps documented
- Failing test created
- Environment details captured
"
```

**Expected Outputs:**
- `bug-reproduction.md` - Reproduction steps and environment details
- Failing test in appropriate test suite
- Error logs and stack traces captured

**Quality Gate: Bug Reproduction**
```bash
if [ ! -f "bug-reproduction.md" ]; then
  echo "❌ Bug reproduction documentation missing"
  exit 1
fi

# Verify failing test exists
TEST_COUNT=$(find . -name "*test*" -newer /tmp/workflow-start-$WORKFLOW_ID | wc -l)
if [ "$TEST_COUNT" -eq 0 ]; then
  echo "❌ No failing test created"
  exit 1
fi

echo "✅ Bug reproduced with failing test"
```

**Track Progress:**
```bash
# Log the error to database
ERROR_TYPE=$(determine_error_type)
ERROR_MSG=$(extract_error_message)
CATEGORY=$(categorize_error)  # e.g., "sql", "authentication", "validation"
FILE_PATH=$(get_affected_file)
LINE_NUM=$(get_error_line)

echo "Error logged with ID: $ERROR_ID"

# Send notification for critical bugs
SEVERITY=$(assess_bug_severity)
if [ "$SEVERITY" = "critical" ]; then
    "Critical Bug Reproduced" \
    "Bug affects: ${CATEGORY}. Requires immediate attention."
fi

TOKENS_USED=3000
```

---

### Phase 2: Root Cause Analysis (15-35%)

**⚡ EXECUTE TASK TOOL:**
```
Use the debugger agent with code-archaeologist if needed to:
1. Debug and investigate using appropriate tools
2. Identify exact root cause with evidence
3. Determine affected scope and impact
4. Document findings and fix strategy

subagent_type: "quality-assurance:debugger"
description: "Identify root cause through debugging"
prompt: "Perform root cause analysis for the bug:

Bug Details: [from Phase 1]
Failing Test: [test file path]

Tasks:

1. **Debug Investigation**
   Tools to use:
   - Debugger (pdb, gdb, Chrome DevTools, etc.)
   - Profiler (if performance-related)
   - Log analysis
   - Distributed tracing (if microservices)

2. **Identify Root Cause**
   Answer:
   - What changed that caused this?
   - Why does it fail under these conditions?
   - Is it timing/race condition?
   - Is it data-dependent?
   - Is it environment-specific?

3. **Assess Impact**
   - What else might be affected?
   - Similar patterns in codebase?
   - User impact scope?

4. **Document Findings**
   Create root-cause-analysis.md with:
   - ROOT CAUSE: [Exact cause with evidence]
   - AFFECTED SCOPE: [What else might be impacted]
   - WHY IT HAPPENED: [How bug was introduced]
   - FIX STRATEGY: [How to fix properly]

If needed, use code-archaeologist agent to:
- Search for similar patterns
- Analyze code history
- Identify related bugs

Expected outputs:
- root-cause-analysis.md
- Debug logs and evidence
- Fix strategy documented
"
```

**Expected Outputs:**
- `root-cause-analysis.md` - Complete root cause documentation
- Debug logs and evidence files
- Fix strategy with approach

**Quality Gate: Root Cause Validation**
```bash
if [ ! -f "root-cause-analysis.md" ]; then
  echo "❌ Root cause analysis missing"
  exit 1
fi

# Verify root cause is documented
if ! grep -q "ROOT CAUSE:" "root-cause-analysis.md"; then
  echo "❌ Root cause not documented"
  exit 1
fi

echo "✅ Root cause identified and documented"
```

**Track Progress:**
```bash
TOKENS_USED=4000

# Store root cause for learning
ROOT_CAUSE=$(grep -A 3 "ROOT CAUSE:" root-cause-analysis.md | tail -n 2)
  "Root cause for $ERROR_TYPE: $ROOT_CAUSE" \
  "$FILE_PATH:$LINE_NUM"
```

---

### Phase 3: Implementation (35-60%)

**⚡ EXECUTE TASK TOOL:**
```
Use appropriate development agent based on language to:
1. Implement fix targeting root cause
2. Add defensive code and validation
3. Verify fix locally with all tests
4. Ensure minimal changes with no side effects

subagent_type: "[language-developers:python-developer|language-developers:typescript-developer|language-developers:java-developer|language-developers:go-developer|language-developers:rust-developer]"  # e.g., python-developer, typescript-developer
description: "Implement bug fix with defensive code"
prompt: "Implement the bug fix based on root cause analysis:

Root Cause: [from root-cause-analysis.md]
Fix Strategy: [from root-cause-analysis.md]
Failing Test: [test file path]

Tasks:

1. **Implement Fix**
   Principles:
   - Fix root cause, not symptom
   - Minimal change
   - Maintain code quality
   - No side effects
   - Clear comments if complex

2. **Add Defensive Code**
   Add validation, assertions, and logging:
   ```python
   # Example patterns
   def process_user(user_id):
       if not user_id:
           raise ValueError('user_id is required')
       if not isinstance(user_id, int):
           raise TypeError(f'user_id must be int, got {type(user_id)}')

       user = get_user(user_id)
       if not user:
           raise NotFoundError(f'User {user_id} not found')

       logger.info(f'Processing user {user_id}')
       return process(user)
   ```

3. **Verify Fix Locally**
   - Failing test now passes
   - All existing tests still pass
   - No new warnings
   - Manual testing if needed

Expected outputs:
- Fixed code files
- All tests passing
- Fix implementation notes
"
```

**Expected Outputs:**
- Fixed source code files
- Implementation notes in `fix-implementation.md`
- All tests passing (green)

**Quality Gate: Implementation Validation**
```bash
# Run the previously failing test
echo "Running regression test..."
if ! run_tests; then
  echo "❌ Tests still failing"
  exit 1
fi

# Verify no new test failures
echo "Running full test suite..."
if ! run_all_tests; then
  echo "❌ New test failures introduced"
  exit 1
fi

echo "✅ Fix implemented and verified locally"
```

**Track Progress:**
```bash
TOKENS_USED=5000

# Store fix code
FIX_CODE=$(git diff HEAD -- "$FILE_PATH" | head -n 50)
  "Fix for $ERROR_TYPE in $FILE_PATH" \
  "$FIX_CODE"
```

---

### Phase 4: Comprehensive Testing (60-85%)

**⚡ EXECUTE TASK TOOL:**
```
Run all quality gates in parallel using multiple agents:
1. test-engineer: Comprehensive test suite
2. code-reviewer: Review fix quality
3. security-auditor: Security validation
4. code-archaeologist: Check for similar bugs

Execute quality gates concurrently for speed.

subagent_type: "quality-assurance:test-engineer"
description: "Run comprehensive test suite and regression tests"
prompt: "Execute comprehensive testing for bug fix:

Fixed Files: [list of changed files]
Bug Category: $CATEGORY

Tasks:

1. **Regression Test**
   - The failing test now passes
   - Document test results

2. **Full Test Suite**
   - All existing tests pass
   - No new failures
   - No flaky tests

3. **New Edge Case Tests**
   - Test boundary conditions
   - Test error cases
   - Test similar scenarios

4. **Performance Tests** (if performance bug)
   - Benchmark before/after
   - Verify no degradation

5. **Load Tests** (if concurrency bug)
   - Test under high load
   - Verify thread safety

Expected outputs:
- test-report.md with all results
- Coverage report
- Performance benchmarks (if applicable)
"
```

**⚡ EXECUTE TASK TOOL:**
```
Use the code-reviewer agent to:
1. Review fix correctness and completeness
2. Check for code smells
3. Verify error handling
4. Ensure maintainability

subagent_type: "quality-assurance:code-reviewer"
description: "Review bug fix code quality"
prompt: "Review the bug fix implementation:

Changed Files: [list]
Root Cause: [summary]
Fix Strategy: [summary]

Review for:
- Fix is correct and complete
- No code smells introduced
- Proper error handling
- Clear and maintainable
- Follows project conventions
- No unnecessary changes

Expected outputs:
- code-review-report.md
"
```

**⚡ EXECUTE TASK TOOL:**
```
Use the security-auditor agent to:
1. Verify no new security issues
2. Check input validation
3. Ensure no injection risks

subagent_type: "quality-assurance:security-auditor"
description: "Audit bug fix for security issues"
prompt: "Security audit of bug fix:

Changed Files: [list]

Check for:
- No new security vulnerabilities
- Input validation proper
- No injection risks (SQL, XSS, etc.)
- No credential exposure
- Proper error handling (no info leak)

Expected outputs:
- security-audit.md
"
```

**⚡ EXECUTE TASK TOOL:**
```
Use the code-archaeologist agent to:
1. Search for similar bug patterns
2. Verify fix covers all cases
3. Check if bug exists elsewhere

subagent_type: "quality-assurance:debugger"
description: "Check for similar bugs in codebase"
prompt: "Search for similar bug patterns:

Bug Pattern: [from root cause]
Fixed File: $FILE_PATH

Search for:
- Similar code patterns
- Related functionality
- Potential similar bugs
- Other locations needing fix

Expected outputs:
- similar-bugs-analysis.md
- List of potential issues
"
```

**Expected Outputs:**
- `test-report.md` - Complete test results
- `code-review-report.md` - Code review findings
- `security-audit.md` - Security validation
- `similar-bugs-analysis.md` - Similar pattern analysis

**Quality Gate: All Quality Gates Pass**
```bash
# Check test report
if [ ! -f "test-report.md" ]; then
  echo "❌ Test report missing"
  exit 1
fi

if grep -q "FAILED" "test-report.md"; then
  echo "❌ Tests failed"
  exit 1
fi

# Check code review
if [ ! -f "code-review-report.md" ]; then
  echo "❌ Code review missing"
  exit 1
fi

if grep -q "REJECT" "code-review-report.md"; then
  echo "❌ Code review rejected"
  exit 1
fi

# Check security audit
if [ ! -f "security-audit.md" ]; then
  echo "❌ Security audit missing"
  exit 1
fi

if grep -q "VULNERABILITY" "security-audit.md"; then
  echo "❌ Security vulnerabilities found"
  exit 1
fi

echo "✅ All quality gates passed"
```

**Track Progress:**
```bash
# Log quality gates for bug fix

# Track token usage for testing phase
TOKENS_USED=6000
```

---

### Phase 5: Documentation & Deployment (85-100%)

**⚡ EXECUTE TASK TOOL:**
```
Use the technical-writer agent to:
1. Document the bug fix comprehensively
2. Create deployment documentation
3. Prepare post-mortem analysis

subagent_type: "development-core:fullstack-developer"
description: "Document bug fix and deployment"
prompt: "Document the bug fix:

Bug: [summary]
Root Cause: [from analysis]
Fix: [description]
Testing: [results]

Create documentation:

1. **Bug Fix Documentation** (bug-fix-docs.md)
   ```markdown
   ## Bug Fix Documentation

   ### Issue
   [Bug description with ticket #]

   ### Root Cause
   [What caused the bug]

   ### Fix
   [What was changed]

   ### Testing
   [How it was tested]

   ### Impact
   [What systems/users affected]

   ### Prevention
   [How to prevent similar bugs]
   ```

2. **Commit Message** (commit-message.txt)
   ```
   fix(component): brief description

   Fixes #123

   Root cause: [explanation]
   - [What was wrong]
   - [Why it happened]

   Solution: [explanation]
   - [What was changed]
   - [Why this fixes it]

   Testing:
   - Added regression test
   - All tests passing
   - Verified in staging

   Impact: [users/systems affected]
   ```

3. **Post-Mortem** (post-mortem.md)
   - What happened
   - Timeline
   - Root cause
   - How it was fixed
   - Prevention measures
   - Action items

Expected outputs:
- bug-fix-docs.md
- commit-message.txt
- post-mortem.md
"
```

**⚡ EXECUTE TASK TOOL:**
```
Use the ci-cd-engineer agent to:
1. Deploy to staging and verify
2. Deploy to production (canary/rolling)
3. Monitor metrics and verify
4. Prepare rollback plan

subagent_type: "devops-cloud:terraform-specialist"
description: "Deploy bug fix with monitoring"
prompt: "Deploy the bug fix:

Fixed Files: [list]
Testing Status: All passed

Deployment tasks:

1. **Staging Deployment**
   - Deploy to staging environment
   - Run smoke tests
   - Verify fix works
   - Monitor for issues

2. **Production Deployment**
   - Deploy using canary/rolling strategy
   - Monitor metrics closely
   - Verify fix in production
   - Watch for regressions

3. **Rollback Plan**
   - Document revert procedure
   - Known good version documented
   - Rollback triggers defined

4. **Post-Deployment**
   - Update issue tracker
   - Notify stakeholders
   - Monitor for 24 hours

Expected outputs:
- deployment-report.md
- rollback-plan.md
"
```

**Expected Outputs:**
- `bug-fix-docs.md` - Complete documentation
- `commit-message.txt` - Formatted commit message
- `post-mortem.md` - Lessons learned
- `deployment-report.md` - Deployment status
- `rollback-plan.md` - Rollback procedures

**Quality Gate: Documentation & Deployment**
```bash
# Validate documentation
if [ ! -f "bug-fix-docs.md" ]; then
  echo "❌ Bug fix documentation missing"
  exit 1
fi

if [ ! -f "commit-message.txt" ]; then
  echo "❌ Commit message not prepared"
  exit 1
fi

# Validate deployment
if [ ! -f "deployment-report.md" ]; then
  echo "❌ Deployment report missing"
  exit 1
fi

if grep -q "FAILED" "deployment-report.md"; then
  echo "❌ Deployment failed"
  exit 1
fi

echo "✅ Documented and deployed"
```

**Track Progress:**
```bash
TOKENS_USED=4000

# Store post-mortem
  "Post-mortem for $ERROR_TYPE" \
  "$(head -n 50 post-mortem.md)"
```

---

## Workflow Completion & Learning

**At workflow end:**
```bash
# Mark error as resolved in database
RESOLUTION_SUMMARY="[Brief description of fix]"
RESOLUTION_CODE="[Key code snippet that fixed the issue]"
CONFIDENCE=0.95  # How confident we are this fully fixes the issue


# Calculate total token usage
TOTAL_TOKENS=$(sum_agent_token_usage)

# Update workflow status

# Store lessons learned
ROOT_CAUSE=$(summarize_root_cause)
PREVENTION=$(list_prevention_measures)
  "Bug type: ${ERROR_TYPE}. Root cause: ${ROOT_CAUSE}. Prevention: ${PREVENTION}" \
  "$RESOLUTION_CODE"

# Get workflow metrics
echo "=== Bug Fix Metrics ==="

# Get error statistics to track improvement
echo "=== Error Statistics (Last 30 days) ==="

# Send completion notification
DURATION=$(calculate_workflow_duration)
  "Bug Fixed & Deployed" \
  "Bug resolved in ${DURATION} minutes. Root cause: ${ROOT_CAUSE}. Confidence: ${CONFIDENCE}"

# Display token usage
echo "=== Token Usage Report ==="

echo "
✅ BUG FIX COMPLETE

Bug: $ERROR_TYPE in $FILE_PATH
Root Cause: $ROOT_CAUSE
Resolution: $RESOLUTION_SUMMARY
Confidence: $CONFIDENCE

Deliverables:
- bug-reproduction.md
- root-cause-analysis.md
- fix-implementation.md
- test-report.md
- code-review-report.md
- security-audit.md
- similar-bugs-analysis.md
- bug-fix-docs.md
- post-mortem.md
- deployment-report.md

Next Steps:
1. Monitor production for 24 hours
2. Review post-mortem.md for lessons learned
3. Implement prevention measures
4. Update documentation if needed
"
```

---

## Special Bug Types

### Production-Only Bugs

```
1. Enable debug logging in production (temporarily)
2. Collect telemetry (logs, metrics, traces)
3. Reproduce in staging with production data (anonymized)
4. Add instrumentation
5. Deploy instrumentation to production
6. Gather more data
7. Fix and deploy
8. Verify in production
```

### Race Conditions

```
1. Add thread-safe logging
2. Use thread sanitizers
3. Reproduce multiple times
4. Add synchronization
5. Test under load
6. Verify no deadlocks
```

### Memory Leaks

```
1. Profile memory usage
2. Use memory profilers (valgrind, heaptrack, etc.)
3. Identify leak source
4. Fix resource management
5. Verify memory stable over time
```

### Performance Bugs

```
1. Profile CPU/memory/network
2. Identify bottleneck
3. Optimize (algorithm, query, etc.)
4. Benchmark before/after
5. Verify no regression
```

### Intermittent Bugs

```
1. Add extensive logging
2. Increase reproduction attempts
3. Check for timing issues
4. Monitor over time
5. Statistical analysis
6. Fix when pattern found
```

### Security Bugs

**CRITICAL - Handle with care:**
```
1. Assess severity immediately
2. DO NOT commit fix to public repo (if serious)
3. Notify security team
4. Prepare patch privately
5. Deploy emergency hotfix
6. Notify affected users (if data breach)
7. Public disclosure after fix deployed
```

---

## Success Criteria

Bug fix complete when:
- ✅ Bug reproduced with failing test
- ✅ Root cause identified and documented
- ✅ Fix implemented (root cause, not symptom)
- ✅ Regression test passes
- ✅ All existing tests pass
- ✅ All quality gates passed (test, review, security)
- ✅ Similar bugs checked and addressed
- ✅ Code reviewed and approved
- ✅ Deployed to staging and verified
- ✅ Deployed to production and monitored
- ✅ No new issues introduced
- ✅ Documentation complete (fix docs, post-mortem)
- ✅ Stakeholders notified
- ✅ Lessons learned captured

---

## Example Usage

### Example 1: Simple Bug

```bash
/fix-bug "User login fails with 500 error when password contains special characters.
Error: 'tuple' object has no attribute 'decode'"
```

**Autonomous execution:**
1. Debugger reproduces bug
2. Identifies root cause: password not properly escaped in SQL
3. Python-developer implements parameterized query
4. Test-engineer adds regression test
5. Security-auditor verifies no SQL injection
6. Deployed to production
7. Verified working

**Time: 30-60 minutes**

### Example 2: Performance Bug

```bash
/fix-bug "/api/products endpoint takes 5+ seconds to load when there are 10,000+ products.
Users experiencing timeouts."
```

**Autonomous execution:**
1. Debugger profiles the endpoint
2. Identifies N+1 query problem
3. Database-specialist redesigns query with JOIN
4. Performance-analyzer benchmarks (5s → 200ms)
5. Test-engineer adds performance test
6. Deployed to production

**Time: 1-2 hours**

### Example 3: Race Condition

```bash
/fix-bug "Occasional duplicate charges when user clicks checkout button multiple times.
Happens ~1% of the time under load."
```

**Autonomous execution:**
1. Debugger identifies race condition in payment processing
2. Backend-developer adds idempotency key
3. Adds database constraint for uniqueness
4. Test-engineer writes concurrent test
5. Load testing confirms fix
6. Deployed with monitoring

**Time: 2-3 hours**

---

## Anti-Patterns

### DON'T
❌ Fix without reproducing first
❌ Fix symptom instead of root cause
❌ Skip writing regression test
❌ Make changes without understanding impact
❌ Deploy without testing in staging
❌ Ignore quality gates
❌ Leave debug code in production
❌ Forget to document the fix

### DO
✅ Reproduce consistently first
✅ Find and fix root cause
✅ Write regression test
✅ Test thoroughly
✅ Review and validate
✅ Deploy carefully with monitoring
✅ Document for future
✅ Learn from each bug

---

## Monitoring Post-Deployment

```
Key metrics to watch:
- Error rates
- Response times
- Resource usage
- User complaints
- Related metrics

Alert on:
- Error rate increase
- Performance degradation
- Resource spikes
- New error types

Rollback if:
- Error rate > 2x baseline
- Critical functionality broken
- Data corruption risk
- Security vulnerability exposed
```

This workflow ensures every bug is fixed properly, thoroughly tested, and learned from. Autonomous, comprehensive, and production-ready.
