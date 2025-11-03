---
description: Reproduce, debug, fix, and deploy bug fixes with comprehensive testing and root cause analysis
argumentHint: "[bug-description]"
---

# Fix Bug Workflow

## ⚠️ CRITICAL: Autonomous Orchestration Required

**DO NOT execute this workflow in the main Claude Code context.**

You MUST immediately delegate this entire workflow to the debugger agent using the Task tool.

**Delegation Instructions:**
```
Use Task tool with:
- subagent_type: "debugger"
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
source /Users/seth/Projects/orchestr8/.claude/lib/db-helpers.sh

# Create workflow record
WORKFLOW_ID="fix-bug-$(date +%s)"
db_create_workflow "$WORKFLOW_ID" "fix-bug" "$*" 5 "high"
db_update_workflow_status "$WORKFLOW_ID" "in_progress"

# Check for similar past bugs (learn from history!)
echo "=== Searching for similar past bugs ==="
BUG_PATTERN=$(echo "$*" | head -c 100)
db_find_similar_errors "$BUG_PATTERN" 5

# Query past bug fix workflows for estimation
db_find_similar_workflows "fix-bug" 5
```

## Execution Instructions

### Phase 1: Bug Triage & Reproduction (15%)

**Use `debugger` agent to:**

1. **Analyze Bug Report**
   - Parse error messages and stack traces
   - Identify affected components
   - Determine severity (critical, high, medium, low)
   - Check if known issue or regression

2. **Gather Context**
   ```bash
   # Check recent changes
   git log --since="1 week ago" --oneline -- [affected-files]

   # Check related issues
   # Search issue tracker for similar bugs

   # Review monitoring/logs
   # Check error tracking (Sentry, etc.)
   ```

3. **Reproduce Locally**
   - Set up exact environment
   - Follow reproduction steps
   - Verify bug manifests
   - Document exact conditions

4. **Create Failing Test**
   Use `test-engineer` to write test that fails:
   ```
   - Unit test for isolated bug
   - Integration test for system interaction
   - E2E test for user-facing bug
   ```

**CHECKPOINT**: Bug reproduced with failing test ✓

```bash
# Log the error to database
ERROR_TYPE=$(determine_error_type)
ERROR_MSG=$(extract_error_message)
CATEGORY=$(categorize_error)  # e.g., "sql", "authentication", "validation"
FILE_PATH=$(get_affected_file)
LINE_NUM=$(get_error_line)

ERROR_ID=$(db_log_error "$ERROR_TYPE" "$ERROR_MSG" "$CATEGORY" "$FILE_PATH" "$LINE_NUM")
echo "Error logged with ID: $ERROR_ID"

# Send notification for critical bugs
SEVERITY=$(assess_bug_severity)
if [ "$SEVERITY" = "critical" ]; then
  db_send_notification "$WORKFLOW_ID" "bug_critical" "urgent" \
    "Critical Bug Reproduced" \
    "Bug affects: ${CATEGORY}. Requires immediate attention."
fi
```

### Phase 2: Root Cause Analysis (20%)

**Use `debugger` agent with `code-archaeologist` if needed:**

1. **Debug Investigation**
   ```
   Tools to use:
   - Debugger (pdb, gdb, Chrome DevTools, etc.)
   - Profiler (if performance-related)
   - Log analysis
   - Distributed tracing (if microservices)
   ```

2. **Identify Root Cause**
   Ask:
   - What changed that caused this?
   - Why does it fail under these conditions?
   - Is it timing/race condition?
   - Is it data-dependent?
   - Is it environment-specific?

3. **Document Findings**
   ```markdown
   ROOT CAUSE:
   [Exact cause with evidence]

   AFFECTED SCOPE:
   [What else might be impacted]

   WHY IT HAPPENED:
   [How bug was introduced]

   FIX STRATEGY:
   [How to fix properly]
   ```

**CHECKPOINT**: Root cause identified and documented ✓

### Phase 3: Implementation (25%)

**Use appropriate development agent based on language:**

1. **Implement Fix**
   ```
   Principles:
   - Fix root cause, not symptom
   - Minimal change
   - Maintain code quality
   - No side effects
   - Clear comments if complex
   ```

2. **Verify Fix Locally**
   ```
   - Failing test now passes
   - All existing tests still pass
   - No new warnings
   - Manual testing if needed
   ```

3. **Add Defensive Code**
   ```python
   # Add validation
   def process_user(user_id):
       if not user_id:
           raise ValueError("user_id is required")
       if not isinstance(user_id, int):
           raise TypeError(f"user_id must be int, got {type(user_id)}")

       user = get_user(user_id)
       if not user:
           raise NotFoundError(f"User {user_id} not found")

       return process(user)

   # Add assertions
   assert len(items) > 0, "Items list cannot be empty"

   # Add logging
   logger.info(f"Processing user {user_id}")
   ```

**CHECKPOINT**: Fix implemented and verified locally ✓

### Phase 4: Comprehensive Testing (25%)

**Run all quality gates in parallel:**

1. **Test Suite** - `test-engineer`:
   ```
   - Regression test (the failing test now passes)
   - All existing tests pass
   - New edge case tests
   - Performance tests (if performance bug)
   - Load tests (if concurrency bug)
   ```

2. **Code Review** - `code-reviewer`:
   ```
   - Fix is correct and complete
   - No code smells introduced
   - Proper error handling
   - Clear and maintainable
   ```

3. **Security Check** - `security-auditor`:
   ```
   - No new security issues
   - Input validation proper
   - No injection risks
   ```

4. **Similar Bugs Check** - `code-archaeologist`:
   ```
   - Search for similar patterns
   - Check if bug exists elsewhere
   - Verify fix covers all cases
   ```

**CHECKPOINT**: All quality gates passed ✓

```bash
# Log quality gates for bug fix
db_log_quality_gate "$WORKFLOW_ID" "regression_test" "passed" 100 0
db_log_quality_gate "$WORKFLOW_ID" "code_review" "passed" 95 0
db_log_quality_gate "$WORKFLOW_ID" "security" "passed" 100 0

# Track token usage for testing phase
db_track_tokens "$WORKFLOW_ID" "testing" "test-engineer" $TEST_TOKENS "comprehensive-testing"
```

### Phase 5: Documentation & Deployment (15%)

1. **Document Fix**
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

2. **Create Commit**
   ```bash
   git commit -m "$(cat <<'EOF'
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
   EOF
   )"
   ```

3. **Deploy**
   ```
   Staging:
   1. Deploy to staging
   2. Run smoke tests
   3. Verify fix works
   4. Monitor for issues

   Production:
   1. Deploy to production (canary/rolling)
   2. Monitor metrics closely
   3. Verify fix in production
   4. Watch for regressions

   Rollback Plan:
   - Revert commit if issues
   - Known good version documented
   ```

4. **Post-Deployment**
   ```
   - Update issue tracker (close ticket)
   - Notify stakeholders
   - Monitor for 24 hours
   - Document lessons learned
   ```

**CHECKPOINT**: Deployed and verified ✓

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

## Success Criteria

Bug fix complete when:
- ✅ Bug reproduced with failing test
- ✅ Root cause identified and documented
- ✅ Fix implemented (root cause, not symptom)
- ✅ Regression test passes
- ✅ All existing tests pass
- ✅ All quality gates passed
- ✅ Code reviewed and approved
- ✅ Deployed to production
- ✅ Verified in production
- ✅ No new issues introduced
- ✅ Documentation updated

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

## Lessons Learned Template

After each bug fix, document:

```markdown
## Bug Post-Mortem

### What Happened
[Bug description]

### Timeline
- [When introduced]
- [When discovered]
- [When fixed]

### Root Cause
[Why it happened]

### How It Was Fixed
[Solution implemented]

### How to Prevent
- [Code changes]
- [Process changes]
- [Tool improvements]
- [Testing improvements]

### Action Items
- [ ] [Item 1]
- [ ] [Item 2]
```

## Workflow Completion & Learning

**At workflow end:**
```bash
# Mark error as resolved in database
RESOLUTION_SUMMARY="[Brief description of fix]"
RESOLUTION_CODE="[Key code snippet that fixed the issue]"
CONFIDENCE=0.95  # How confident we are this fully fixes the issue

db_resolve_error "$ERROR_ID" "$RESOLUTION_SUMMARY" "$RESOLUTION_CODE" $CONFIDENCE

# Calculate total token usage
TOTAL_TOKENS=$(sum_agent_token_usage)
db_track_tokens "$WORKFLOW_ID" "completion" "orchestrator" $TOTAL_TOKENS "bug-fix-complete"

# Update workflow status
db_update_workflow_status "$WORKFLOW_ID" "completed"

# Store lessons learned
ROOT_CAUSE=$(summarize_root_cause)
PREVENTION=$(list_prevention_measures)
db_store_knowledge "debugger" "bug_pattern" "$CATEGORY" \
  "Bug type: ${ERROR_TYPE}. Root cause: ${ROOT_CAUSE}. Prevention: ${PREVENTION}" \
  "$RESOLUTION_CODE"

# Get workflow metrics
echo "=== Bug Fix Metrics ==="
db_workflow_metrics "$WORKFLOW_ID"

# Get error statistics to track improvement
echo "=== Error Statistics (Last 30 days) ==="
db_error_stats 30

# Send completion notification
DURATION=$(calculate_workflow_duration)
db_send_notification "$WORKFLOW_ID" "workflow_complete" "high" \
  "Bug Fixed & Deployed" \
  "Bug resolved in ${DURATION} minutes. Root cause: ${ROOT_CAUSE}. Confidence: ${CONFIDENCE}"

# Display token usage
echo "=== Token Usage Report ==="
db_token_savings "$WORKFLOW_ID"
```

This workflow ensures every bug is fixed properly, thoroughly tested, and learned from. Autonomous, comprehensive, and production-ready.
