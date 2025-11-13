---
name: refactor
description: Improve code structure and quality while maintaining functionality
arguments:
  - name: task
    description: Refactoring goal and target code
    required: true
---

# Refactor: {{task}}

**Request:** {{task}}

## Your Role

You are refactoring code to improve quality, maintainability, and performance while preserving functionality.

## Phase 1: Analysis (0-20%)

**→ Load:** orchestr8://skills/match?query=refactoring+code+quality+analysis&mode=index&maxResults=5

**Activities:**
- Analyze current code structure
- Identify code smells and anti-patterns
- Map dependencies and coupling
- Assess complexity metrics
- Define success criteria
- Plan refactoring strategy
- Identify risks

**→ Checkpoint:** Plan approved, risks identified

## Phase 2: Refactoring (20-80%)

**→ Load:** orchestr8://match?query={{task}}+refactoring+patterns&categories=agent,skill,pattern&mode=index&maxResults=8

**Activities:**
- Extract functions/classes for better separation
- Improve naming for clarity
- Reduce complexity (cyclomatic, cognitive)
- Apply design patterns where appropriate
- Remove duplication (DRY principle)
- Improve error handling
- **Run tests after each change** (ensure no breakage)

**→ Checkpoint:** Refactoring complete, tests still pass

## Phase 3: Validation (80-100%)

**→ Load:** orchestr8://skills/match?query=testing+performance+validation&mode=index&maxResults=5

**Activities:**
- Run full test suite (unit, integration, E2E)
- Performance benchmarks (before/after comparison)
- Code review for quality improvements
- Update documentation reflecting changes
- Verify test coverage maintained or improved
- Check for unintended behavior changes

**→ Checkpoint:** All green, no regressions, quality improved

## Success Criteria

✅ Code is more readable and maintainable
✅ Complexity reduced (measurable metrics)
✅ All tests passing
✅ No regressions or behavior changes
✅ Performance maintained or improved
✅ Documentation updated
✅ Code review approved
