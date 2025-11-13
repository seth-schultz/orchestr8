---
id: workflow-add-feature
category: pattern
tags: [workflow, feature-development, implementation, testing, integration, parallel, incremental, production-ready]
capabilities:
  - Complete feature implementation with design and testing
  - Seamless integration into existing codebase
  - Concurrent backend/frontend/test development
useWhen:
  - Feature addition workflows requiring codebase analysis, design alignment verification, implementation with tests, and integration validation
  - Existing codebase enhancement needing non-breaking changes with backward compatibility and incremental rollout strategies
estimatedTokens: 2400
---

# Add Feature Pattern

**Phases:** Design (0-20%) → Implementation (20-70%) → Quality (70-90%) → Deploy (90-100%)

**Token Efficiency:**
- Without JIT: ~10,000 tokens upfront (all development resources loaded)
- With JIT: ~2,400 tokens progressive (loaded by phase as needed)
- **Savings: 76%**

## Phase 1: Analysis & Design (0-20%)

**→ Load Analysis & Design Expertise (JIT):**
```
orchestr8://match?query=codebase+analysis+feature+design+${tech-stack}&categories=skill,pattern&mode=index&maxResults=5
orchestr8://skills/requirement-analysis-framework
orchestr8://patterns/architecture-decision-records
```

**Activities:**
- Parse requirements, define acceptance criteria
- Analyze affected components, integration points
- Design API contracts, data models, UI components
- Choose approach (new module vs extension)

**Checkpoint:** Design approved

## Phase 2: Implementation (20-70%)

**→ Load Implementation Expertise (JIT):**
```
orchestr8://match?query=${tech-stack}+${feature-type}+implementation&categories=agent,skill,example&mode=index&maxResults=10
```

**Note:** Single comprehensive load supports parallel backend, frontend, and testing tracks with tech-specific expertise.

**Parallel tracks:**
- **Backend:** Schema/migrations, models, business logic, API endpoints + auth
  - Backend track uses loaded expertise for: `${backend-framework}+api+database+${feature-type}`
- **Frontend:** Components, forms, state, API integration, error handling, UX
  - Frontend track uses loaded expertise for: `${frontend-framework}+components+${feature-type}`
- **Tests:** Unit (80%+), integration tests (TDD - test alongside code)
  - Testing track uses loaded expertise for: `${tech-stack}+testing+tdd`

**Checkpoint:** Feature works manually, tests pass

## Phase 3: Quality Assurance (70-90%)

**→ Load QA & Security Expertise (JIT):**
```
orchestr8://match?query=${tech-stack}+testing+security+quality&categories=skill,agent&mode=index&maxResults=8
orchestr8://skills/testing-e2e-best-practices
orchestr8://skills/security-input-validation
orchestr8://skills/quality-code-review-checklist
```

**Parallel tracks:**
- **Testing:** E2E for critical paths, edge cases, 80%+ coverage verified
- **Quality:** Code review, security scan (validation, auth), performance check

**Checkpoint:** All tests pass, no critical issues

## Phase 4: Integration & Deploy (90-100%)

**→ Load Deployment Expertise (JIT - CONDITIONAL):**
```
# Only if deployment to production requested
orchestr8://match?query=${platform}+deployment+feature+flags+monitoring&categories=skill,pattern&mode=index&maxResults=5
orchestr8://skills/deployment-zero-downtime
```

**Parallel tracks:**
- **Docs:** API docs, comments, changelog, migration notes
- **Deploy:** Feature flags, staging → validate → production, monitor

**Checkpoint:** Production healthy, metrics good

## Parallelism
- **Independent:** Backend + Frontend + Tests (Phase 2), Testing + Quality (Phase 3), Docs + Deploy (Phase 4)
- **Dependencies:** Frontend integration needs backend API, E2E needs both, production needs staging validation

## JIT Loading Strategy

**Progressive Refinement:**
1. Phase 1: Load analysis and design patterns (1000 tokens)
2. Phase 2: Load comprehensive implementation expertise for all tracks (2500 tokens)
   - Single load covers backend, frontend, and testing with tech-specific guidance
3. Phase 3: Load QA, security, and quality expertise (1500 tokens)
4. Phase 4: Conditionally load deployment if production release needed (1000 tokens)

**Adaptive Budget:**
- Simple feature (no deployment): ~5,000 tokens (analysis + implementation + QA)
- Typical feature (with deployment): ~6,000 tokens
- Complex feature (full scope): ~6,000 tokens

**Resource Reuse:**
Phase 2's comprehensive implementation load is reused across all parallel tracks (backend, frontend, tests), avoiding separate loads for each track.
