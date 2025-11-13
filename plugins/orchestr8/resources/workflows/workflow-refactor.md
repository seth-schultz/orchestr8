---
id: workflow-refactor
category: pattern
tags: [workflow, refactoring, code-quality, technical-debt, SOLID, continuous-testing, behavior-preservation, incremental]
capabilities:
  - Safe code refactoring with behavior preservation
  - Test-driven refactoring approach
  - Incremental transformation with continuous validation
useWhen:
  - Code quality improvement requiring behavior-preserving refactoring with comprehensive test coverage and continuous validation
  - Technical debt reduction needing SOLID principle application, design pattern introduction, and incremental transformation
  - Code simplification scenarios addressing complexity, duplication, or poor readability with extract method and extract class patterns
  - Test-driven refactoring requiring red-green-refactor cycle with legacy code characterization and seam creation
estimatedTokens: 2200
---

# Refactor Code Pattern

**Core Principle:** Preserve behavior while improving structure. Never change both simultaneously.

**Phases:** Analyze (0-20%) → Test Coverage (20-40%) → Transform (40-85%) → Validate (85-100%)

**Token Efficiency:**
- Without JIT: ~8,000 tokens upfront (all refactoring resources loaded)
- With JIT: ~2,200 tokens progressive (loaded by refactoring phase)
- **Savings: 73%**

## Phase 1: Analysis & Planning (0-20%)

**→ Load Code Analysis Expertise (JIT):**
```
orchestr8://match?query=code+analysis+smells+complexity+${tech-stack}&categories=skill,pattern&mode=index&maxResults=5
orchestr8://skills/quality-code-review-checklist
orchestr8://patterns/architecture-decision-records
```

**Activities:**
- Analyze code smells: duplication, complexity (>10), coupling, long methods (>50 lines), deep nesting (>3 levels)
- Identify SOLID violations
- Map dependencies and usage
- Plan refactoring strategy (extract, rename, move, simplify)
- Assess risk and scope

## Phase 2: Test Coverage (20-40%)

**→ Load Testing & Legacy Code Expertise (JIT):**
```
orchestr8://match?query=${tech-stack}+testing+coverage+characterization&categories=skill,agent&mode=index&maxResults=5
orchestr8://skills/testing-strategies
orchestr8://skills/testing-unit
```

**Activities:**
- Check current coverage
- Add tests to achieve 80%+ coverage
- Verify tests pass consistently (green baseline)
- Create characterization tests for legacy code
- **CRITICAL:** NEVER refactor without comprehensive tests

**Checkpoint:** 80%+ coverage, all passing

## Phase 3: Refactoring (40-85%)

**→ Load Refactoring Techniques (JIT):**
```
orchestr8://match?query=${tech-stack}+refactoring+patterns+SOLID&categories=skill,pattern&mode=index&maxResults=8
orchestr8://skills/quality-refactoring-techniques
orchestr8://patterns/architecture-layered
```

**Continuous testing runs alongside transformation:**
- **Atomic commits:** (1) ONE refactoring change, (2) Run full test suite, (3) Commit if pass, (4) Repeat
- **Techniques:** Extract method/function, Rename, Move method/field, Replace conditional with polymorphism, Introduce parameter object
- **Avoid:** Large multi-pattern changes, changing behavior, refactoring without tests

**Checkpoint:** Refactored, all tests still pass

## Phase 4: Validation & Cleanup (85-100%)

**→ Load Validation Expertise (JIT - CONDITIONAL):**
```
# Only if comprehensive validation needed beyond basic testing
orchestr8://match?query=${tech-stack}+integration+testing+metrics&categories=skill&mode=index&maxResults=3
```

**Activities:**
- Run full test suite (unit, integration, E2E)
- Verify metrics improved: complexity reduced, duplication eliminated, coverage maintained
- Review for missed opportunities
- Update documentation
- Clean up temporary code

**Checkpoint:** Production-ready, behavior preserved

## Critical Safety Rules
1. **Green → Green → Green** (tests ALWAYS pass during refactoring)
2. **NOT Green → Red → Green** (that's TDD for new features)
3. **One change at a time** (atomic commits)
4. **Tests first** (80%+ coverage before starting)
5. **Behavior preservation** (zero functional changes)

## JIT Loading Strategy

**Progressive Expertise Loading:**
1. Phase 1: Load code analysis and smell detection expertise (1000 tokens)
2. Phase 2: Load testing and characterization techniques (1200 tokens)
3. Phase 3: Load refactoring patterns and SOLID principles (1500 tokens)
4. Phase 4: Conditionally load validation expertise if needed (800 tokens)

**Adaptive Budget:**
- Simple refactoring (basic cleanup): ~3,700 tokens (analysis + testing + refactoring)
- Typical refactoring (with validation): ~4,500 tokens
- Complex refactoring (full scope): ~4,500 tokens

**Sequential Loading Benefits:**
Refactoring requires step-by-step approach with different expertise at each phase:
- Phase 1: Analysis skills to identify issues
- Phase 2: Testing skills to build safety net
- Phase 3: Refactoring techniques to transform code
- Phase 4: Validation skills to ensure quality

**Token Savings:**
- Traditional approach: Load all refactoring knowledge upfront = ~8,000 tokens
- JIT approach: Load expertise as each phase begins = ~3,700-4,500 tokens
- **Savings: 44-54% with safer, more focused refactoring process**
