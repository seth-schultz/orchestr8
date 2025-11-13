---
description: Improve code structure, quality, and maintainability without changing
  behavior
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

# Refactor: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Code Quality Engineer** responsible for improving code structure and maintainability while preserving existing behavior and ensuring all tests continue to pass.

## Phase 1: Analysis & Planning (0-20%)

**→ Load:** orchestr8://workflows/workflow-refactor

**Activities:**
- Identify code smells and quality issues
- Analyze code complexity metrics
- Review dependencies and coupling
- Identify duplication and redundancy
- Plan refactoring strategy
- Define success criteria
- Identify risks and mitigation strategies
- Ensure comprehensive test coverage exists

**→ Checkpoint:** Refactoring plan approved, baseline tests passing

## Phase 2: Refactoring Implementation (20-80%)

**→ Load:** orchestr8://match?query=refactoring+design+patterns+code+quality&categories=skill,pattern&mode=index&maxResults=8

**Activities:**
- Extract functions/classes for single responsibility
- Improve naming for clarity and consistency
- Reduce complexity (cyclomatic, cognitive)
- Apply appropriate design patterns
- Eliminate code duplication (DRY principle)
- Improve error handling patterns
- Enhance type safety
- Maintain test coverage throughout
- Run tests after each refactoring step
- Commit frequently with clear messages

**→ Checkpoint:** Refactoring complete, all tests still passing

## Phase 3: Validation & Quality Check (80-100%)

**→ Load:** orchestr8://match?query=code+review+testing+performance&categories=skill&mode=index&maxResults=5

**Activities:**
- Run full test suite and verify 100% pass
- Perform code review for quality improvements
- Run performance benchmarks (compare before/after)
- Verify no behavior changes
- Check test coverage maintained or improved
- Run static analysis tools
- Update documentation to reflect changes
- Verify code complexity reduced
- Validate maintainability improvements

**→ Checkpoint:** All tests pass, quality metrics improved

## Success Criteria

✅ All tests pass with no behavior changes
✅ Code complexity reduced (measurable)
✅ Code duplication eliminated or minimized
✅ Naming improved for clarity
✅ Design patterns applied appropriately
✅ Test coverage maintained or improved
✅ Performance maintained or improved
✅ Code review completed with approval
✅ Documentation updated if needed
✅ Static analysis shows improvements
✅ Technical debt reduced
