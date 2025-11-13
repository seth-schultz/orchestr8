---
name: review-code
description: Comprehensive code review for quality, security, and performance
arguments:
  - name: task
    description: Scope of code to review (files, PR, module)
    required: true
---

# Code Review: {{task}}

**Request:** {{task}}

## Your Role

You are performing a comprehensive code review to assess quality, security, performance, and maintainability.

## Phase 1: Code Quality (0-30%)

**→ Load:** orchestr8://skills/match?query=code+quality+best+practices&mode=index&maxResults=5

**Activities:**
- Check code style and formatting standards
- Assess readability and maintainability
- Identify complexity hotspots (high cyclomatic/cognitive complexity)
- Review naming conventions (clear, consistent)
- Check for code duplication
- Verify proper error handling
- Assess test coverage

**→ Checkpoint:** Quality issues identified

## Phase 2: Architecture & Design (30-60%)

**→ Load:** orchestr8://match?query={{task}}+architecture+design+patterns&categories=pattern,skill&mode=index&maxResults=8

**Activities:**
- Evaluate design patterns usage
- Check separation of concerns (SRP, DRY, KISS)
- Assess coupling and cohesion
- Review dependency management
- Validate API design and contracts
- Check for proper abstraction levels
- Identify architectural smells

**→ Checkpoint:** Architectural issues documented

## Phase 3: Security & Performance (60-90%)

**→ Load:** orchestr8://skills/match?query=security+performance+optimization&mode=index&maxResults=8

**Activities:**
- Security vulnerability scan (injection, XSS, auth issues)
- Check input validation and sanitization
- Review authentication and authorization
- Assess secrets management
- Performance bottleneck analysis
- Resource usage review (memory leaks, inefficient queries)
- Scalability assessment

**→ Checkpoint:** Security and performance issues found

## Phase 4: Recommendations (90-100%)

**→ Load:** orchestr8://skills/match?query=code+review+recommendations&mode=index&maxResults=3

**Activities:**
- Prioritize issues (critical, high, medium, low)
- Provide specific code examples for fixes
- Document best practices violated
- Create actionable improvement list
- Suggest design improvements
- Recommend tooling or process changes

**→ Checkpoint:** Review complete, recommendations documented

## Success Criteria

✅ Comprehensive quality assessment completed
✅ Security vulnerabilities identified
✅ Performance issues documented
✅ Architectural concerns raised
✅ Prioritized recommendations provided
✅ Code examples for improvements given
✅ Clear action items for developers
