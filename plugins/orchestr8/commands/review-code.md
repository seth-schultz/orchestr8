---
description: Comprehensive code review covering quality, architecture, security, and
  performance
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

# Code Review: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Code Reviewer** responsible for comprehensive analysis of code quality, architecture, security, and performance, providing actionable feedback and recommendations.

## Phase 1: Code Quality Analysis (0-30%)

**→ Load:** orchestr8://workflows/workflow-code-review

**Activities:**
- Check code style and formatting consistency
- Assess readability and clarity
- Identify complexity hotspots
- Review naming conventions
- Check for code duplication
- Verify error handling patterns
- Assess test coverage
- Review documentation quality

**Deliverable:** Code quality report with issues and recommendations

**→ Checkpoint:** Quality issues identified and categorized

## Phase 2: Architecture & Design (30-60%)

**→ Load:** orchestr8://match?query=architecture+design+patterns+best+practices&categories=pattern,skill&mode=index&maxResults=8

**Activities:**
- Evaluate design patterns usage
- Check separation of concerns
- Assess coupling and cohesion
- Review module boundaries
- Verify SOLID principles adherence
- Check dependency management
- Evaluate error handling strategy
- Review API design and contracts

**Deliverable:** Architecture assessment with recommendations

**→ Checkpoint:** Design issues identified with improvement suggestions

## Phase 3: Security & Performance (60-90%)

**→ Load:** orchestr8://match?query=security+vulnerabilities+performance+optimization&categories=skill,pattern&mode=index&maxResults=8

**Activities:**
- Scan for security vulnerabilities
- Check input validation and sanitization
- Review authentication and authorization
- Verify secrets management
- Check for common security issues (OWASP Top 10)
- Identify performance bottlenecks
- Review database query efficiency
- Assess resource usage patterns
- Check for memory leaks
- Evaluate scalability concerns

**Deliverable:** Security and performance report

**→ Checkpoint:** Critical issues flagged for immediate attention

## Phase 4: Recommendations & Report (90-100%)

**→ Load:** orchestr8://match?query=code+review+best+practices&categories=skill&mode=index&maxResults=3

**Activities:**
- Prioritize findings by severity
- Provide code examples for fixes
- Document best practices to follow
- Create actionable improvement plan
- Suggest refactoring opportunities
- Recommend additional testing
- Provide learning resources
- Generate comprehensive report

**Deliverable:** Comprehensive review report with prioritized action items

**→ Checkpoint:** Report delivered with clear next steps

## Review Report Structure

### Summary
- Overall assessment (Excellent/Good/Fair/Needs Work)
- Critical issues count
- Major issues count
- Minor issues count

### Critical Issues
- Security vulnerabilities
- Performance blockers
- Correctness bugs

### Major Issues
- Design problems
- Maintainability concerns
- Missing tests

### Minor Issues
- Style inconsistencies
- Documentation gaps
- Optimization opportunities

### Positive Aspects
- Well-implemented features
- Good practices observed
- Quality improvements

### Recommendations
1. Immediate actions (critical fixes)
2. Short-term improvements (major issues)
3. Long-term enhancements (optimization)

### Code Examples
- Before/after examples for key issues
- Reference implementations

## Success Criteria

✅ Comprehensive review completed
✅ Code quality issues identified and categorized
✅ Architecture patterns evaluated
✅ Security vulnerabilities identified
✅ Performance concerns documented
✅ Prioritized improvement plan created
✅ Code examples provided for fixes
✅ Best practices documented
✅ Clear action items with severity levels
✅ Report delivered in actionable format
