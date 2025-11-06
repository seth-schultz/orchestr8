---
description: Comprehensive multi-stage code review evaluating style, logic, security, performance, and architecture quality
argument-hint: [scope-path-or-all]
model: sonnet
---

# Multi-Stage Code Review Workflow

You are orchestrating a comprehensive multi-stage iterative code review that evaluates code quality across multiple dimensions: style, logic, security, performance, and architecture.

## Workflow Overview

This workflow provides thorough code quality validation through specialized review stages, each focusing on a different aspect of code quality. The review is iterative, allowing developers to fix issues and re-submit for validation.

## Intelligence Database Integration

```bash

# Initialize workflow

echo "🚀 Starting Multi-Stage Code Review Workflow"
echo "Scope: $1"
echo "Workflow ID: $workflow_id"

# Query similar code review patterns
```

---

## Phase 1: Scope Detection & Preparation (0-5%)

**⚡ EXECUTE TASK TOOL:**
```
Use the debugger agent to:
1. Identify what to review (full codebase, directory, file, PR, or changed files)
2. Gather context about the scope
3. Collect file lists and change information
4. Create review task list with TodoWrite
5. Estimate review complexity and duration

subagent_type: "quality-assurance:debugger"
description: "Determine review scope and prepare context"
prompt: "Analyze and prepare the code review scope:

Argument provided: $1

Tasks:

1. **Identify Review Scope:**
   - If no argument or 'all': Full codebase review
   - If directory path provided: Directory-specific review
   - If file path provided: Single file review
   - If PR number (PR-XXX): Pull request review
   - If 'changed': Review uncommitted changes

2. **Gather Context:**
   ```bash
   # For PR reviews
   if [[ \"$1\" =~ ^PR-[0-9]+$ ]]; then
     PR_NUMBER=\${1#PR-}
     gh pr view \$PR_NUMBER --json files,title,body,commits
   fi

   # For changed files
   if [ \"$1\" = \"changed\" ] || [ -z \"$1\" ]; then
     git diff --name-only
     git status --short
   fi

   # For directory/file reviews
   if [ -d \"$1\" ]; then
     find \"$1\" -type f -name \"*.{ts,js,py,java,go,rs,tsx,jsx}\" | head -100
   elif [ -f \"$1\" ]; then
     echo \"Single file: $1\"
   fi
   ```

3. **Estimate Complexity:**
   - Count files to review
   - Identify languages involved
   - Estimate review duration (5 min per file for thorough review)
   - Total expected time

4. **Create Review Task List:**
   Use TodoWrite to create tasks:
   - Stage 1: Style & Readability Review
   - Stage 2: Logic & Correctness Review
   - Stage 3: Security Audit
   - Stage 4: Performance Analysis
   - Stage 5: Architecture Review
   - Stage 6: Synthesis & Report Generation

Expected outputs:
- Review scope summary
- File list (up to 100 files)
- Complexity estimate
- Task list created
"
```

**Expected Outputs:**
- Review scope identified (full/directory/file/PR/changed)
- File list generated
- Complexity estimate (file count, duration)
- TodoWrite task list created

**Quality Gate: Scope Validation**
```bash
# Validate scope was determined
if [ -z "$1" ]; then
  SCOPE="changed"
else
  SCOPE="$1"
fi

# Check if scope is valid
if [[ "$SCOPE" =~ ^PR-[0-9]+$ ]]; then
  PR_NUMBER=${SCOPE#PR-}
  if ! gh pr view $PR_NUMBER &>/dev/null; then
    echo "❌ Invalid PR number: $PR_NUMBER"
    exit 1
  fi
elif [ "$SCOPE" != "changed" ] && [ ! -d "$SCOPE" ] && [ ! -f "$SCOPE" ]; then
  echo "❌ Invalid scope: $SCOPE (not a file, directory, or PR)"
  exit 1
fi

echo "✅ Review scope validated: $SCOPE"
```

**Track Progress:**
```bash
TOKENS_USED=2000

# Store scope info
  "Review scope: $SCOPE" \
  "Type: [full|directory|file|PR|changed], Files: [count]"
```

---

**🚀 PARALLEL EXECUTION OPPORTUNITY (5x speedup):** Phases 2-6 (all 5 review stages) can run in parallel since each analyzes different quality dimensions independently. Use a single message with 5 Task tool calls to execute style, logic, security, performance, and architecture reviews concurrently. Each writes to separate output files (style-review.md, logic-review.md, security-review.md, performance-review.md, architecture-review.md), so no conflicts.

---

## Phase 2: Stage 1 - Style & Readability Review (5-20%)

**⚡ EXECUTE TASK TOOL:**
```
Use the code-reviewer agent to:
1. Review code formatting and style consistency
2. Check naming conventions (variables, functions, classes)
3. Evaluate documentation completeness (comments, docstrings)
4. Assess code readability and clarity
5. Identify style violations and inconsistencies

subagent_type: "quality-assurance:code-reviewer"
description: "Review code style and readability"
prompt: "Perform Stage 1: Style & Readability Review

Scope: $SCOPE

Focus areas:

1. **Formatting & Style**
   - Consistent indentation and spacing
   - Line length compliance
   - Brace/bracket style consistency
   - Import/require organization

2. **Naming Conventions**
   - Variables: descriptive, clear purpose
   - Functions: verb-based, action-oriented
   - Classes: noun-based, clear responsibility
   - Constants: UPPERCASE with underscores
   - Follow language idioms

3. **Documentation**
   - Function/method documentation
   - Complex logic comments
   - Module/class documentation
   - README accuracy
   - API documentation

4. **Readability**
   - Code clarity
   - Function length (< 50 lines ideal)
   - Nesting depth (< 4 levels)
   - Cognitive complexity

Expected outputs:
- style-review-report.md with findings
- Issues categorized by severity (critical/high/medium/low)
- Specific line numbers and recommendations
"
```

**Expected Outputs:**
- `style-review-report.md` - Style findings
- Issues categorized by severity
- Line-specific recommendations

**Quality Gate: Style Review Completion**
```bash
if [ ! -f "style-review-report.md" ]; then
  echo "❌ Style review report missing"
  exit 1
fi

# Check report has content
if [ $(wc -l < style-review-report.md) -lt 20 ]; then
  echo "❌ Style review report too short"
  exit 1
fi

echo "✅ Stage 1: Style & Readability Review complete"
```

**Track Progress:**
```bash
TOKENS_USED=8000

# Store review findings
  "Style review findings for $SCOPE" \
  "$(head -n 50 style-review-report.md)"
```

---

## Phase 3: Stage 2 - Logic & Correctness Review (20-35%)

**⚡ EXECUTE TASK TOOL:**
```
Use the appropriate language specialist agent to:
1. Review business logic correctness
2. Identify logic errors and edge cases
3. Check error handling completeness
4. Validate input validation and sanitization
5. Review algorithm correctness and efficiency

subagent_type: "language-developers:python-developer"  # or language-developers:typescript-developer, language-developers:java-developer, etc. based on detected language
description: "Review logic and correctness"
prompt: "Perform Stage 2: Logic & Correctness Review

Scope: $SCOPE

Focus areas:

1. **Business Logic**
   - Correct implementation of requirements
   - Edge case handling
   - Boundary conditions
   - State management correctness

2. **Error Handling**
   - Try-catch blocks appropriate
   - Error messages informative
   - Graceful degradation
   - Resource cleanup (finally blocks)
   - Error propagation correct

3. **Input Validation**
   - All inputs validated
   - Type checking
   - Range validation
   - Sanitization for security

4. **Algorithms**
   - Correctness verified
   - Complexity acceptable
   - Edge cases handled
   - Off-by-one errors checked

5. **Logic Errors**
   - Dead code identified
   - Unreachable code
   - Incorrect conditionals
   - Race conditions
   - Null/undefined handling

Expected outputs:
- logic-review-report.md with findings
- Critical logic errors highlighted
- Edge cases not handled
- Recommendations for fixes
"
```

**Expected Outputs:**
- `logic-review-report.md` - Logic findings
- Critical errors identified
- Edge case analysis
- Fix recommendations

**Quality Gate: Logic Review Completion**
```bash
if [ ! -f "logic-review-report.md" ]; then
  echo "❌ Logic review report missing"
  exit 1
fi

# Check for critical logic errors
if grep -q "🔴 Critical" logic-review-report.md; then
  CRITICAL_COUNT=$(grep -c "🔴 Critical" logic-review-report.md)
  echo "⚠️  Warning: $CRITICAL_COUNT critical logic errors found"
fi

echo "✅ Stage 2: Logic & Correctness Review complete"
```

**Track Progress:**
```bash
TOKENS_USED=10000

# Store logic findings
  "Logic review findings for $SCOPE" \
  "$(head -n 50 logic-review-report.md)"
```

---

## Phase 4: Stage 3 - Security Audit (35-50%)

**⚡ EXECUTE TASK TOOL:**
```
Use the security-auditor agent to:
1. Scan for OWASP Top 10 vulnerabilities
2. Detect hardcoded secrets and credentials
3. Review authentication and authorization
4. Check for injection vulnerabilities
5. Identify security misconfigurations

subagent_type: "quality-assurance:security-auditor"
description: "Perform comprehensive security audit"
prompt: "Perform Stage 3: Security Audit

Scope: $SCOPE

Focus areas:

1. **OWASP Top 10 (2021)**
   - A01: Broken Access Control
   - A02: Cryptographic Failures
   - A03: Injection (SQL, Command, XSS)
   - A04: Insecure Design
   - A05: Security Misconfiguration
   - A06: Vulnerable Components
   - A07: Authentication Failures
   - A08: Data Integrity Failures
   - A09: Logging/Monitoring Failures
   - A10: SSRF

2. **Secret Detection**
   - API keys, tokens, passwords
   - Private keys, certificates
   - Database credentials
   - AWS/cloud credentials
   - Use regex patterns and entropy analysis

3. **Authentication & Authorization**
   - Proper authentication checks
   - Authorization before sensitive operations
   - Session management
   - Password handling (hashing, not plaintext)

4. **Input Validation**
   - SQL injection prevention
   - XSS prevention
   - Command injection prevention
   - Path traversal prevention
   - Parameterized queries

5. **Dependency Security**
   ```bash
   # Check for known vulnerabilities
   npm audit || pip audit || cargo audit
   ```

Expected outputs:
- security-audit-report.md with findings
- Critical vulnerabilities highlighted
- CVE references where applicable
- Remediation guidance
"
```

**Expected Outputs:**
- `security-audit-report.md` - Security findings
- Critical vulnerabilities identified
- CVE references
- Remediation guidance

**Quality Gate: Security Audit Completion (MANDATORY)**
```bash
if [ ! -f "security-audit-report.md" ]; then
  echo "❌ Security audit report missing"
  exit 1
fi

# Check for critical security vulnerabilities
if grep -q "🔴 Critical" security-audit-report.md; then
  CRITICAL_COUNT=$(grep -c "🔴 Critical" security-audit-report.md)
  echo "❌ BLOCKING: $CRITICAL_COUNT critical security vulnerabilities found"
  echo "Cannot merge until critical vulnerabilities are fixed"
  # Don't exit - continue to generate full report, but mark as failed
fi

# Check for hardcoded secrets
if grep -q "Hardcoded secret" security-audit-report.md; then
  SECRET_COUNT=$(grep -c "Hardcoded secret" security-audit-report.md)
  echo "❌ BLOCKING: $SECRET_COUNT hardcoded secrets found"
  echo "Remove all secrets before merge"
fi

echo "✅ Stage 3: Security Audit complete"
```

**Track Progress:**
```bash
TOKENS_USED=12000

# Store security findings
  "Security audit findings for $SCOPE" \
  "$(head -n 50 security-audit-report.md)"
```

---

## Phase 5: Stage 4 - Performance Analysis (50-65%)

**⚡ EXECUTE TASK TOOL:**
```
Use the performance-analyzer agent to:
1. Identify performance bottlenecks
2. Review algorithm complexity (Big O)
3. Check for N+1 queries and inefficient database access
4. Identify memory leaks and resource management issues
5. Suggest optimization opportunities

subagent_type: "infrastructure-monitoring:performance-analyzer"
description: "Analyze code performance and efficiency"
prompt: "Perform Stage 4: Performance Analysis

Scope: $SCOPE

Focus areas:

1. **Algorithm Complexity**
   - Identify O(n²) or worse algorithms
   - Suggest more efficient alternatives
   - Check loop efficiency
   - Reduce unnecessary iterations

2. **Database Performance**
   - N+1 query detection
   - Missing indexes
   - Inefficient queries
   - Connection pooling
   - Query optimization opportunities

3. **Memory Management**
   - Memory leaks (unclosed resources)
   - Large object allocations
   - Cache efficiency
   - Garbage collection pressure

4. **I/O Operations**
   - Synchronous I/O in async contexts
   - Unnecessary file reads/writes
   - Network call efficiency
   - Batching opportunities

5. **Optimization Opportunities**
   - Caching candidates
   - Lazy loading opportunities
   - Pagination for large datasets
   - Background processing candidates

Expected outputs:
- performance-analysis-report.md with findings
- Bottlenecks identified with impact assessment
- Optimization recommendations with expected gains
- Profiling suggestions
"
```

**Expected Outputs:**
- `performance-analysis-report.md` - Performance findings
- Bottlenecks identified
- Optimization recommendations
- Expected performance gains

**Quality Gate: Performance Review Completion**
```bash
if [ ! -f "performance-analysis-report.md" ]; then
  echo "❌ Performance analysis report missing"
  exit 1
fi

# Check for high-impact performance issues
if grep -q "🔴 Critical" performance-analysis-report.md; then
  CRITICAL_COUNT=$(grep -c "🔴 Critical" performance-analysis-report.md)
  echo "⚠️  Warning: $CRITICAL_COUNT critical performance issues found"
fi

echo "✅ Stage 4: Performance Analysis complete"
```

**Track Progress:**
```bash
TOKENS_USED=9000

# Store performance findings
  "Performance analysis for $SCOPE" \
  "$(head -n 50 performance-analysis-report.md)"
```

---

## Phase 6: Stage 5 - Architecture Review (65-80%)

**⚡ EXECUTE TASK TOOL:**
```
Use the architect agent to:
1. Review overall system design and patterns
2. Evaluate SOLID principle adherence
3. Check separation of concerns
4. Assess scalability and maintainability
5. Identify technical debt and refactoring opportunities

subagent_type: "development-core:architect"
description: "Review architecture and design patterns"
prompt: "Perform Stage 5: Architecture Review

Scope: $SCOPE

Focus areas:

1. **Design Patterns**
   - Appropriate pattern usage
   - Pattern misuse or overuse
   - Missing patterns where beneficial
   - Anti-patterns identified

2. **SOLID Principles**
   - Single Responsibility: One reason to change
   - Open/Closed: Open for extension, closed for modification
   - Liskov Substitution: Subclasses substitutable
   - Interface Segregation: No fat interfaces
   - Dependency Inversion: Depend on abstractions

3. **Code Organization**
   - Separation of concerns
   - Module cohesion
   - Coupling (loose preferred)
   - Layer separation (presentation, business, data)
   - File/folder structure

4. **Scalability & Maintainability**
   - Code duplication (DRY violations)
   - Testability
   - Extensibility
   - Configuration management
   - Dependency management

5. **Technical Debt**
   - Quick fixes vs. proper solutions
   - Temporary workarounds
   - TODOs and FIXMEs
   - Refactoring opportunities
   - Long-term maintenance costs

Expected outputs:
- architecture-review-report.md with findings
- Design pattern recommendations
- SOLID principle violations
- Refactoring suggestions with priorities
"
```

**Expected Outputs:**
- `architecture-review-report.md` - Architecture findings
- Design pattern recommendations
- SOLID violations identified
- Refactoring priorities

**Quality Gate: Architecture Review Completion**
```bash
if [ ! -f "architecture-review-report.md" ]; then
  echo "❌ Architecture review report missing"
  exit 1
fi

echo "✅ Stage 5: Architecture Review complete"
```

**Track Progress:**
```bash
TOKENS_USED=10000

# Store architecture findings
  "Architecture review for $SCOPE" \
  "$(head -n 50 architecture-review-report.md)"
```

---

## Phase 7: Stage 6 - Synthesis & Report Generation (80-95%)

**⚡ EXECUTE TASK TOOL:**
```
Use the code-review-orchestrator agent to:
1. Aggregate findings from all 5 stages
2. Deduplicate and prioritize issues by severity
3. Calculate overall quality score
4. Generate master review report
5. Create actionable recommendations with priorities

subagent_type: "quality-assurance:code-reviewer"
description: "Synthesize findings and generate master report"
prompt: "Perform Stage 6: Synthesis & Report Generation

Aggregate findings from:
- style-review-report.md
- logic-review-report.md
- security-audit-report.md
- performance-analysis-report.md
- architecture-review-report.md

Tasks:

1. **Aggregate All Findings**
   - Read all 5 stage reports
   - Extract all issues
   - Categorize by severity: 🔴 Critical, 🟠 High, 🟡 Medium, 🔵 Low, 💡 Suggestion

2. **Deduplicate Issues**
   - Same issue reported by multiple stages
   - Consolidate with references to all stages

3. **Calculate Quality Score (0-10)**
   - Critical issues: -3 points each
   - High issues: -1 point each
   - Medium issues: -0.3 points each
   - Low issues: -0.1 points each
   - Start from 10, subtract penalties
   - Minimum score: 0

4. **Determine Verdict**
   - APPROVE: Score ≥ 9.0, no critical/high issues
   - APPROVE WITH CHANGES: Score ≥ 7.0, no critical issues
   - REQUEST CHANGES: Score ≥ 5.0 or has critical issues
   - REJECT: Score < 5.0 or >3 critical issues

5. **Generate Master Report**
   Create review-report-$(date +%Y%m%d-%H%M%S).md with:
   - Executive Summary
   - Verdict and quality score
   - Issue counts by severity
   - Stage pass/fail status
   - Critical issues section (must fix before merge)
   - High priority section
   - Medium priority section
   - Suggestions section
   - Positive findings
   - Links to detailed stage reports
   - Recommendations (immediate, short-term, long-term)

Expected outputs:
- review-report-YYYYMMDD-HHMMSS.md - Master report
- Overall quality score (0-10)
- Verdict (APPROVE/APPROVE WITH CHANGES/REQUEST CHANGES/REJECT)
- Prioritized issue list
"
```

**Expected Outputs:**
- `review-report-YYYYMMDD-HHMMSS.md` - Master review report
- Overall quality score (0-10)
- Verdict (APPROVE/APPROVE WITH CHANGES/REQUEST CHANGES/REJECT)
- Prioritized action items

**Quality Gate: Report Generation**
```bash
# Find most recent review report
REPORT_FILE=$(ls -t review-report-*.md 2>/dev/null | head -1)

if [ -z "$REPORT_FILE" ]; then
  echo "❌ Master review report not generated"
  exit 1
fi

# Validate report has key sections
REQUIRED_SECTIONS=("Executive Summary" "Verdict" "Quality Score" "Critical Issues" "Recommendations")
for SECTION in "${REQUIRED_SECTIONS[@]}"; do
  if ! grep -q "$SECTION" "$REPORT_FILE"; then
    echo "❌ Master report missing required section: $SECTION"
    exit 1
  fi
done

echo "✅ Stage 6: Synthesis & Report Generation complete"
echo "Master report: $REPORT_FILE"
```

**Track Progress:**
```bash
TOKENS_USED=6000

# Store master report
REPORT_FILE=$(ls -t review-report-*.md | head -1)
  "Master review report for $SCOPE" \
  "$(head -n 100 \"$REPORT_FILE\")"
```

---

## Phase 8: Delivery & Iterative Improvement (95-100%)

**⚡ EXECUTE TASK TOOL:**
```
Use the technical-writer agent to:
1. Save master report to file
2. Post report to PR if applicable
3. Create follow-up plan if issues found
4. Document iteration strategy
5. Generate review metrics summary

subagent_type: "development-core:architect"
description: "Deliver report and plan iterations"
prompt: "Deliver review results and plan iterations:

Master report file: $REPORT_FILE
Scope: $SCOPE

Tasks:

1. **Save Report**
   - Ensure report saved with timestamp
   - Create backup copy

2. **Post to PR (if applicable)**
   ```bash
   if [[ \"$SCOPE\" =~ ^PR-[0-9]+$ ]]; then
     PR_NUMBER=\${SCOPE#PR-}
     gh pr comment \$PR_NUMBER --body-file \"$REPORT_FILE\"
     echo \"✅ Posted review to PR #\$PR_NUMBER\"
   fi
   ```

3. **Create Follow-Up Plan**
   If issues found:
   - Identify which issues must be fixed before merge
   - Which stages need re-review after fixes
   - Iteration limit (max 3 iterations)
   - Escalation path if >3 iterations needed

4. **Iteration Strategy**
   - If critical issues: BLOCK merge, require fixes and re-review
   - If high issues: REQUEST changes, targeted re-review
   - If medium/low issues: APPROVE WITH CHANGES, optional re-review
   - Only re-run affected stages (e.g., if security fix → Stage 3 only)

5. **Generate Metrics**
   Create review-metrics.txt:
   - Total files reviewed
   - Total issues found (by severity)
   - Quality score
   - Review duration
   - Token usage
   - Verdict

Expected outputs:
- Report saved and delivered
- PR comment posted (if applicable)
- iteration-plan.md if changes needed
- review-metrics.txt
"
```

**Expected Outputs:**
- Master report saved permanently
- PR comment posted (if PR review)
- `iteration-plan.md` (if changes required)
- `review-metrics.txt` - Review statistics

**Quality Gate: Delivery Validation**
```bash
REPORT_FILE=$(ls -t review-report-*.md | head -1)

# Validate report exists
if [ ! -f "$REPORT_FILE" ]; then
  echo "❌ Master report file missing"
  exit 1
fi

# Extract verdict from report
VERDICT=$(grep "Verdict:" "$REPORT_FILE" | head -1 | cut -d':' -f2 | tr -d ' *')

echo "✅ Review delivery complete"
echo "Final Verdict: $VERDICT"

# Post to PR if applicable
if [[ "$SCOPE" =~ ^PR-[0-9]+$ ]]; then
  PR_NUMBER=${SCOPE#PR-}
  if gh pr comment $PR_NUMBER --body-file "$REPORT_FILE"; then
    echo "✅ Review posted to PR #$PR_NUMBER"
  else
    echo "⚠️  Warning: Could not post to PR #$PR_NUMBER"
  fi
fi
```

**Track Progress:**
```bash
TOKENS_USED=2000
```

---

## Workflow Complete

```bash
# Complete workflow tracking
WORKFLOW_END=$(date +%s)

REPORT_FILE=$(ls -t review-report-*.md | head -1)
VERDICT=$(grep "Verdict:" "$REPORT_FILE" | head -1 | cut -d':' -f2 | tr -d ' *')
QUALITY_SCORE=$(grep "Quality Score:" "$REPORT_FILE" | head -1 | grep -oE '[0-9]+\.[0-9]+')

  "Code review complete. Verdict: $VERDICT, Score: $QUALITY_SCORE/10"

echo "
✅ MULTI-STAGE CODE REVIEW COMPLETE

Scope: $SCOPE
Verdict: $VERDICT
Quality Score: $QUALITY_SCORE/10

Reports Generated:
- $REPORT_FILE (master report)
- style-review-report.md
- logic-review-report.md
- security-audit-report.md
- performance-analysis-report.md
- architecture-review-report.md

Review Stages:
✅ Stage 1: Style & Readability
✅ Stage 2: Logic & Correctness
✅ Stage 3: Security Audit
✅ Stage 4: Performance Analysis
✅ Stage 5: Architecture Review
✅ Stage 6: Synthesis & Report

Next Steps:
"

# Generate next steps based on verdict
case "$VERDICT" in
  "APPROVE")
    echo "1. ✅ Code is ready to merge"
    echo "2. No changes required"
    echo "3. Merge PR or commit changes"
    ;;
  "APPROVE WITH CHANGES")
    echo "1. ⚠️  Address medium/low priority issues"
    echo "2. Optional: Re-review after fixes"
    echo "3. Can merge with acknowledgment of technical debt"
    ;;
  "REQUEST CHANGES")
    echo "1. ❌ Must fix high priority issues"
    echo "2. Address critical issues immediately"
    echo "3. Re-run targeted review after fixes"
    echo "4. Iteration required before merge"
    ;;
  "REJECT")
    echo "1. ❌ BLOCKING: Multiple critical issues"
    echo "2. Comprehensive fixes required"
    echo "3. Consider pair programming or design review"
    echo "4. Full re-review after fixes"
    ;;
esac

echo "

Review Report: $REPORT_FILE
"

# Display metrics
```

---

## Review Modes

### Full Review (Default)
All 5 stages, comprehensive analysis
- **Use for:** New features, major changes, pre-release
- **Time:** ~50 minutes
- **Stages:** All (1-5)

### Fast Review (Emergency)
Stages 2 & 3 only (Logic + Security)
- **Use for:** Hotfixes, time-critical
- **Time:** ~15 minutes
- **Stages:** Logic & Security only

### Security-Focused
Deep dive on Stage 3, plus compliance checks
- **Use for:** Auth changes, payment handling, sensitive data
- **Time:** ~30 minutes
- **May invoke:** `soc2-specialist`, `gdpr-specialist`, `pci-dss-specialist`

### Performance-Focused
Deep dive on Stage 4, with benchmarks
- **Use for:** Performance optimization, database changes
- **Time:** ~30 minutes
- **May invoke:** `load-testing-specialist`

### Architecture-Focused
Deep dive on Stage 5, system design
- **Use for:** Major refactoring, new modules, design changes
- **Time:** ~30 minutes

---

## Quality Gates (Mandatory - Cannot Merge Without)

### Critical Gates (BLOCKING)
- ✅ No critical security vulnerabilities
- ✅ No logic errors that cause crashes
- ✅ No hardcoded secrets or credentials
- ✅ Tests exist and pass

### Recommended Gates (Should Fix)
- ✅ No high priority issues
- ✅ Code style consistent
- ✅ Performance acceptable (no O(n²) on large datasets)
- ✅ Architecture sound (SOLID principles followed)

### Nice-to-Have (Suggestions)
- 💡 Medium/low priority improvements
- 💡 Optimization opportunities
- 💡 Better design patterns
- 💡 Documentation enhancements

---

## Success Criteria Checklist

- ✅ Review scope identified and validated
- ✅ All 5 review stages completed (or subset for mode)
- ✅ Style & readability reviewed
- ✅ Logic & correctness validated
- ✅ Security audit performed (MANDATORY)
- ✅ Performance analysis completed
- ✅ Architecture review conducted
- ✅ Master report generated with quality score
- ✅ Critical issues identified and documented
- ✅ Verdict determined (APPROVE/REQUEST CHANGES/REJECT)
- ✅ Developer has clear, prioritized action items
- ✅ Re-review plan established (if needed)
- ✅ Report delivered (file + PR comment if applicable)
- ✅ Metrics tracked and reported

---

## Example Usage

### Review Specific File
```
/review-code src/auth/login.ts
```

### Review Directory
```
/review-code src/features/payments
```

### Review Pull Request
```
/review-code PR-123
```

### Review All Changes
```
/review-code
```
(Reviews all uncommitted changes)

### Security-Only Review
```
/review-code --mode=security-only src/auth
```

### Fast Review (Hotfix)
```
/review-code --mode=fast src/fix/critical-bug.ts
```

---

## Integration with Development Workflow

### Pre-Commit Review
```
# Developer runs before committing
/review-code

# Fix issues
# Commit
git commit -m "feat: add new feature"
```

### Pre-PR Review
```
# Before creating PR, ensure quality
/review-code

# Create PR only after approval
gh pr create
```

### Automated PR Review
```
# GitHub Action triggers on PR creation
# Runs /review-code PR-<number>
# Posts results as PR comment
# Blocks merge if critical issues
```

### Pre-Release Review
```
# Before release, review entire codebase
/review-code --scope=full

# Generate quality report
# Fix any critical/high issues
# Proceed with release
```

---

## Iteration & Re-Review Process

### If Issues Found

1. **Developer Fixes Issues**
   - Address critical and high priority issues
   - Commit changes

2. **Targeted Re-review**
   ```
   # Only re-run stages affected by changes
   # If security fix: re-run Stage 3 only
   # If logic fix: re-run Stage 2 only
   # If performance fix: re-run Stage 4 only
   ```

3. **Validate Fixes**
   - Ensure issues are resolved
   - Check no new issues introduced
   - Update review report

4. **Iterate or Approve**
   - If all critical/high issues resolved: **APPROVE**
   - If new issues or incomplete fixes: **ITERATE** (max 3 iterations)
   - If >3 iterations needed: **ESCALATE** (suggest pair programming or design review)

---

## Output Artifacts

1. **Master Review Report** (`review-report-YYYYMMDD-HHMMSS.md`)
2. **Stage Reports:**
   - `style-review-report.md`
   - `logic-review-report.md`
   - `security-audit-report.md`
   - `performance-analysis-report.md`
   - `architecture-review-report.md`
3. **Iteration Plan** (`iteration-plan.md` - if changes needed)
4. **Review Metrics** (`review-metrics.txt`)
5. **PR Comments** (if PR review)

---

## Best Practices

### DO ✅
- Run review before creating PR
- Address critical/high issues immediately
- Use fast mode only for true emergencies
- Iterate based on feedback (max 3 times)
- Track review metrics over time
- Automate in CI/CD pipeline
- Use database queries for efficient code access

### DON'T ❌
- Skip review for "small" changes
- Ignore low-priority issues indefinitely
- Review while tired or rushed
- Approve without reading report
- Merge with open critical issues
- Disable quality gates
- Read entire files when specific functions needed

---

## Notes

- **Parallel Execution:** Stages 1-3 can run in parallel for speed (if resources allow)
- **Iterative:** Re-review only affected stages after fixes
- **Customizable:** Adjust stages/focus based on change type
- **Automated:** Can integrate with CI/CD for automatic reviews
- **Learning:** System improves over time by tracking patterns
- **Database-First:** Uses Orchestr8 Intelligence Database for efficient code access

Your code deserves thorough review. This workflow ensures nothing slips through while maintaining development velocity.
