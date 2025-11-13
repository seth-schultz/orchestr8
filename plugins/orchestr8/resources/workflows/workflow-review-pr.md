---
id: workflow-review-pr
category: pattern
tags: [workflow, pull-request, code-review, quality, git, collaboration, feedback]
capabilities:
  - Efficient pull request review process
  - Multi-dimensional code quality assessment
  - Actionable feedback delivery
  - Review automation integration
  - Merge decision framework
useWhen:
  - Pull request review automation requiring code quality checks, test validation, security scanning, and reviewer assignment
  - Code review orchestration needing automated checks, human review coordination, and approval workflow management
estimatedTokens: 500
---

# Pull Request Review Pattern

**Methodology:** Overview → Deep Review → Decision

**Goal:** Thorough, efficient review that maintains quality while respecting developer time

## Phase 1: PR Overview (0-15%)
**Goals:** Understand scope and context

**Activities:**
- Read PR title and description (purpose, approach, related issues)
- Review commit history (logical, well-scoped commits?)
- Check PR size (<500 lines ideal, >1000 lines = request split)
- Identify files changed (scope appropriate?)
- Note CI/CD status (tests passing, builds green?)
- Check for breaking changes, migrations, or config updates

**→ Load Review Framework:** `orchestr8://patterns/match?query=code+review+quality&mode=index&maxResults=3`

**Red Flags (Request Changes Immediately):**
- ❌ Mixed concerns (feature + refactor + bug fix → split PRs)
- ❌ No tests for new functionality
- ❌ Failing CI checks
- ❌ No description or unclear purpose
- ❌ Massive PR (>1000 lines without justification)

**Output:** PR summary and review focus areas

## Phase 2: Multi-Track Review (15-80%)
**Goals:** Evaluate quality across dimensions

**Track A: Code Quality (15-35%)**
- **Readability:** Clear naming, logical flow, appropriate comments
- **Maintainability:** DRY principle, low complexity, modular design
- **Standards:** Follows codebase conventions and style guide
- **SOLID Principles:** Single responsibility, proper abstractions
- **Error Handling:** Comprehensive, informative error messages

**Track B: Functionality (20-40%)**
- **Requirements:** Addresses stated problem completely
- **Edge Cases:** Handles boundary conditions, null/empty values
- **Business Logic:** Correct implementation, no regressions
- **User Experience:** Intuitive, meets acceptance criteria

**Track C: Testing (25-45%)**
- **Coverage:** New code covered (80%+ threshold)
- **Test Quality:** Tests behavior not implementation, clear names
- **Edge Cases:** Boundary conditions, error scenarios tested
- **Integration:** API contracts, data flows validated

**Track D: Security (30-50%)**
- **Input Validation:** All user input sanitized
- **Injection Prevention:** SQL, XSS, command injection protected
- **Authentication:** Proper auth checks on protected routes
- **Authorization:** Permissions enforced correctly
- **Secrets:** No hardcoded credentials or keys
- **Dependencies:** No known vulnerabilities introduced

**Track E: Performance (35-55%)**
- **Database:** No N+1 queries, proper indexing
- **Algorithms:** Efficient complexity for data size
- **Caching:** Used appropriately where beneficial
- **Memory:** No leaks, proper resource cleanup
- **Bundle Impact:** Frontend changes minimize size increase

**Track F: Documentation (40-60%)**
- **Code Comments:** Explain "why" for complex logic
- **API Docs:** Public interfaces documented
- **README:** Updated if setup/usage changes
- **Migration Notes:** Breaking changes documented

**Review Efficiency:**
- Use automated tools (linters, security scanners) for mechanical checks
- Focus human review on logic, architecture, design decisions
- Comment on specific lines with suggestions, not just problems

**Output:** Findings by category with severity

## Phase 3: Decision & Feedback (80-100%)
**Goals:** Clear, actionable feedback and merge decision

**Feedback Categorization:**
- **🔴 BLOCKING (Must Fix):** Security issues, critical bugs, breaking changes
- **🟡 MAJOR (Should Fix):** Missing tests, SOLID violations, performance issues
- **🟢 MINOR (Nice to Have):** Naming improvements, comment additions
- **💡 SUGGESTION:** Alternative approaches, optimization opportunities

**Feedback Format:**
```markdown
### 🔴 BLOCKING: SQL Injection Vulnerability
**File:** `src/api/users.ts:42`
**Issue:** User input directly in SQL query
**Fix:**
```typescript
// Current (vulnerable)
const query = `SELECT * FROM users WHERE name = '${req.query.name}'`;

// Recommended (secure)
const query = 'SELECT * FROM users WHERE name = ?';
db.query(query, [req.query.name]);
```
**Effort:** 10 minutes
```

**Merge Decision Framework:**
```
✅ APPROVE & MERGE
- No blocking issues
- All tests passing
- Minor issues can be addressed in follow-up

⚠️ APPROVE WITH COMMENTS
- No blocking issues
- Suggestions for future improvements
- Trust author to address feedback

🔄 REQUEST CHANGES
- Blocking issues present
- Must be fixed before merge
- Re-review required after changes

❌ REJECT
- Fundamentally wrong approach
- Major rework needed
- Suggest alternative strategy
```

**Best Practices:**
- ✅ Be specific (line numbers, code examples)
- ✅ Explain "why" not just "what"
- ✅ Suggest solutions, don't just criticize
- ✅ Praise good patterns and clever solutions
- ✅ Balance thoroughness with velocity
- ❌ Don't nitpick trivial style issues (use linters)
- ❌ Don't review in one giant comment (line-by-line feedback)

**Output:** Categorized feedback and clear merge decision

## Success Criteria
- All quality dimensions evaluated
- Blocking issues clearly identified
- Feedback is specific, actionable, constructive
- Merge decision communicated with rationale
- Review completed in reasonable time (<1 hour for typical PR)
