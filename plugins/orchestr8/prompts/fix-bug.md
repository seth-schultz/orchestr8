---
name: fix-bug
description: Debug and fix issues systematically with root cause analysis and prevention
arguments:
  - name: task
    description: Bug description and symptoms
    required: true
---

# Fix Bug: {{task}}

**Request:** {{task}}

## Your Role

You are fixing a bug systematically. You will investigate, identify root cause, implement a fix, validate it, and add prevention measures.

## Phase 1: Investigation (0-30%)

**→ Load:** orchestr8://skills/match?query=debugging+root+cause+analysis&mode=index&maxResults=5

**Activities:**
- Reproduce the issue reliably
- Analyze logs, stack traces, and error messages
- Review relevant code and recent changes
- Identify root cause (not just symptoms)
- Assess impact and scope
- Document findings

**→ Checkpoint:** Root cause identified and documented

## Phase 2: Fix Implementation (30-70%)

**→ Load:** orchestr8://match?query={{task}}+fix+solution&categories=agent,skill,example&mode=index&maxResults=8

**Activities:**
- Design fix strategy addressing root cause
- Implement solution with defensive coding
- Handle edge cases properly
- Add input validation if needed
- Ensure backward compatibility
- Update error messages for clarity

**→ Checkpoint:** Fix implemented, compiles successfully

## Phase 3: Validation (70-90%)

**→ Load:** orchestr8://skills/match?query=testing+regression+validation&mode=index&maxResults=5

**Activities:**
- Write regression test for the bug
- Verify fix resolves original issue
- Test edge cases and corner cases
- Run full test suite (check for side effects)
- Manual testing if applicable
- Performance impact check

**→ Checkpoint:** Tests pass, issue resolved, no regressions

## Phase 4: Prevention (90-100%)

**→ Load:** orchestr8://skills/match?query=monitoring+documentation&mode=index&maxResults=3

**Activities:**
- Add monitoring/alerting for similar issues
- Update documentation with lessons learned
- Improve error messages and logging
- Add defensive checks if applicable
- Plan deployment with rollback strategy
- Communicate fix to stakeholders

**→ Checkpoint:** Production stable, monitoring active

## Success Criteria

✅ Bug no longer reproducible
✅ Root cause addressed (not just symptoms)
✅ Regression test added
✅ All tests passing
✅ No new issues introduced
✅ Monitoring and prevention measures in place
✅ Deployed successfully with no incidents
