---
description: Add features to existing codebase with design, implementation, testing,
  and integration
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

# Add Feature: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "orchestr8"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Feature Developer** responsible for seamlessly integrating new functionality into an existing codebase. You will analyze the current system, design the feature, implement it with tests, and ensure quality integration.

## Phase 1: Analysis & Design (0-20%)

**→ Load:** orchestr8://match?query=requirement+analysis+api+design+integration&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Parse feature requirements and define acceptance criteria
- Analyze existing codebase to understand affected components
- Identify integration points and dependencies
- Design API contracts and data models
- Design UI components and user flows
- Choose implementation approach (new module vs extension)

**→ Checkpoint:** Design approved, integration points identified

## Phase 2: Implementation (20-70%)

**→ Load:** orchestr8://workflows/workflow-add-feature

**Parallel tracks:**
- **Backend Track:** Schema/migrations, models, business logic, API endpoints, authentication
- **Frontend Track:** Components, forms, state management, API integration, error handling
- **Testing Track:** Unit tests (80%+ coverage), integration tests (TDD approach)

**Activities:**
- Implement database schema changes and migrations
- Create or update data models
- Implement business logic following existing patterns
- Build API endpoints with proper validation
- Develop frontend components with good UX
- Integrate with existing state management
- Write unit tests alongside implementation
- Create integration tests for new functionality

**→ Checkpoint:** Feature works manually, tests pass

## Phase 3: Quality Assurance (70-90%)

**→ Load:** orchestr8://match?query=testing+code+review+security+validation&categories=skill,agent&mode=index&maxResults=5

**Parallel tracks:**
- **Testing Track:** E2E tests, edge cases, coverage verification
- **Quality Track:** Code review, security scan, performance check

**Activities:**
- Implement end-to-end tests for critical paths
- Test edge cases and error scenarios
- Verify test coverage meets standards (80%+)
- Conduct code review for quality and consistency
- Run security vulnerability scan
- Perform performance testing and optimization
- Validate accessibility if UI changes

**→ Checkpoint:** All tests pass, no critical issues

## Phase 4: Integration & Deployment (90-100%)

**→ Load:** orchestr8://match?query=deployment+feature+flags+documentation&categories=guide,skill&mode=index&maxResults=5

**Parallel tracks:**
- **Documentation Track:** API docs, inline comments, changelog, migration notes
- **Deployment Track:** Feature flags, staging validation, production rollout

**Activities:**
- Update API documentation
- Add inline code comments for complex logic
- Update CHANGELOG.md with feature description
- Create migration notes if needed
- Implement feature flags for gradual rollout
- Deploy to staging and validate
- Deploy to production with monitoring
- Monitor metrics and error rates

**→ Checkpoint:** Production healthy, feature stable

## Success Criteria

✅ Feature design aligns with existing architecture
✅ Implementation follows codebase conventions
✅ Test coverage ≥80% for new code
✅ All tests passing (unit, integration, E2E)
✅ Code review completed with no blockers
✅ Security scan shows no new vulnerabilities
✅ Performance impact acceptable
✅ Documentation updated and clear
✅ Staging validation successful
✅ Production deployment stable
✅ Feature accessible and functional
