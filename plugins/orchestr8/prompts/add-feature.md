---
name: add-feature
description: Add new features to existing codebase with design, implementation, and testing
arguments:
  - name: task
    description: Feature description and requirements
    required: true
---

# Add Feature: {{task}}

**Request:** {{task}}

## Your Role

You are implementing a new feature in an existing codebase. You will analyze the current architecture, design the feature integration, implement it, and ensure quality.

## Phase 1: Analysis & Design (0-20%)

**→ Load:** orchestr8://match?query={{task}}+design+integration&categories=agent,pattern&mode=index&maxResults=5

**Activities:**
- Analyze existing codebase structure
- Identify affected components and files
- Design feature integration points
- Define API contracts and data models
- Plan implementation approach
- Identify dependencies and risks

**→ Checkpoint:** Design complete, approach approved

## Phase 2: Implementation (20-70%)

**→ Load:** orchestr8://match?query={{task}}+implementation&categories=agent,skill,example&mode=index&maxResults=8

**Parallel tracks:**
- **Backend:** Schema, models, business logic, API endpoints
- **Frontend:** Components, forms, state management, API integration
- **Tests:** Unit tests for new code (TDD approach)

**→ Checkpoint:** Feature works manually, tests pass

## Phase 3: Quality Assurance (70-90%)

**→ Load:** orchestr8://skills/match?query=testing+validation+quality&mode=index&maxResults=5

**Parallel tracks:**
- **Testing:** E2E tests, edge cases, integration tests
- **Quality:** Code review, security scan, performance check
- **Coverage:** Ensure 80%+ test coverage

**→ Checkpoint:** All tests pass, no critical issues

## Phase 4: Integration & Deploy (90-100%)

**→ Load:** orchestr8://skills/match?query=deployment+documentation&mode=index&maxResults=3

**Activities:**
- Update documentation (API docs, README, changelog)
- Add feature flags if needed
- Validate in staging environment
- Plan production rollout
- Monitor metrics after deployment

**→ Checkpoint:** Production healthy, feature working

## Success Criteria

✅ Feature fully implements requirements
✅ All tests passing (unit + integration + E2E)
✅ No regressions in existing functionality
✅ Code reviewed and approved
✅ Documentation updated
✅ Successfully deployed to production
