---
description: Comprehensive pull request review with multi-stage analysis, GitHub integration, and automated PR comments
argumentHint: "<PR-number>"
---

# Pull Request Review Workflow

You are orchestrating a comprehensive pull request review with multi-stage code analysis, GitHub integration, and automated feedback delivery.

## Intelligence Database Integration

```bash

# Initialize workflow

echo "🚀 Starting PR Review Workflow"
echo "PR Number: $1"
echo "Workflow ID: $workflow_id"

# Query similar PR review patterns
```

## Workflow Overview

This workflow provides thorough PR review by:
1. Fetching PR details from GitHub
2. Analyzing changed files across 5 quality dimensions
3. Posting detailed review comments to the PR
4. Requesting changes or approving based on findings
5. Supporting iterative review cycles

---

## Phase 1: PR Context Gathering (0-10%)

**⚡ EXECUTE TASK TOOL:**
```
Use the code-archaeologist agent to:
1. Fetch PR details from GitHub (number, title, body, author, branches)
2. Get PR diff and identify all changed files
3. Categorize files by type (frontend, backend, tests, config, docs)
4. Analyze PR context (size, change type, risk level, related issues)
5. Create review plan with TodoWrite

subagent_type: "code-archaeologist"
description: "Gather PR context and metadata"
prompt: "Fetch and analyze Pull Request #$1:

Tasks:

1. **Get PR Details**
   \`\`\`bash
   # Fetch PR metadata
   gh pr view $1 --json number,title,body,author,headRefName,baseRefName,state,isDraft,commits,files

   # Get PR diff
   gh pr diff $1

   # Get PR commits
   gh pr view $1 --json commits
   \`\`\`

2. **Identify Changed Files**
   \`\`\`bash
   # List all files changed in PR
   gh pr diff $1 --name-only

   # Categorize files by type
   # Frontend: *.tsx, *.jsx, *.vue, *.svelte
   # Backend: *.ts, *.js, *.py, *.go, *.java, *.rs
   # Tests: *.test.*, *.spec.*
   # Config: *.json, *.yaml, *.yml
   # Docs: *.md
   \`\`\`

3. **Analyze PR Context**
   - PR size (lines changed, files modified)
   - Change type (feature, bugfix, refactor, docs)
   - Risk level (high for auth/security, medium for business logic, low for docs)
   - Related issues/tickets

4. **Create Review Plan**
   Use TodoWrite to track review stages:
   - [ ] Validate PR metadata (title, description, linked issues)
   - [ ] Stage 1: Style & Readability Review
   - [ ] Stage 2: Logic & Correctness Review
   - [ ] Stage 3: Security Audit
   - [ ] Stage 4: Performance Analysis
   - [ ] Stage 5: Architecture Review
   - [ ] Generate review summary
   - [ ] Post review to GitHub

Expected outputs:
- pr-context-$1.json - PR metadata
- changed-files-$1.txt - List of changed files
- review-plan-$1.md - Structured review plan
"
```

**Expected Outputs:**
- `pr-context-<PR#>.json` - PR metadata and context
- `changed-files-<PR#>.txt` - List of changed files with categories
- `review-plan-<PR#>.md` - Structured review plan

**Quality Gate: Context Validation**
```bash
PR_NUMBER="$1"

# Validate PR exists
if ! gh pr view "$PR_NUMBER" &>/dev/null; then
  echo "❌ PR #$PR_NUMBER not found"
  exit 1
fi

# Validate context files created
if [ ! -f "pr-context-$PR_NUMBER.json" ]; then
  echo "❌ PR context not gathered"
  exit 1
fi

echo "✅ PR context gathered successfully"
```

**Track Progress:**
```bash
TOKENS_USED=3000

# Store PR metadata
  "PR #$PR_NUMBER context and metadata" \
  "$(head -n 50 pr-context-$PR_NUMBER.json)"
```

---

## Phase 2: PR Metadata Validation (10-15%)

**⚡ EXECUTE TASK TOOL:**
```
Use the code-reviewer agent to:
1. Validate PR title follows Conventional Commits format
2. Check PR description quality (what, why, testing notes)
3. Verify linked issues/tickets
4. Check for screenshots if UI changes
5. Validate metadata (labels, reviewers, milestone)

subagent_type: "code-reviewer"
description: "Validate PR metadata quality"
prompt: "Validate metadata for PR #$PR_NUMBER:

Validation Checklist:

1. **Title Validation:**
   - [ ] Follows Conventional Commits format (feat:, fix:, docs:, etc.)
   - [ ] Clear and descriptive
   - [ ] References ticket/issue if applicable

2. **Description Validation:**
   - [ ] Explains what and why (not just what)
   - [ ] Links to related issues/tickets
   - [ ] Includes testing notes
   - [ ] Screenshots for UI changes
   - [ ] Breaking changes documented

3. **Metadata Checks:**
   - [ ] Appropriate labels applied
   - [ ] Reviewers assigned
   - [ ] Milestone set (if applicable)
   - [ ] Not a draft (or marked WIP)

If validation fails, generate comment requesting improvements:
\`\`\`bash
gh pr comment $PR_NUMBER --body \"## PR Metadata Issues

Please address the following before review:
- [ ] Add conventional commit prefix to title (feat:, fix:, etc.)
- [ ] Add description explaining changes
- [ ] Link related issue/ticket
- [ ] Add testing notes

Use \\\`gh pr edit $PR_NUMBER\\\` to update.\"
\`\`\`

Expected outputs:
- metadata-validation-$PR_NUMBER.md - Validation results
- metadata-issues-$PR_NUMBER.txt - List of issues (if any)
"
```

**Expected Outputs:**
- `metadata-validation-<PR#>.md` - Validation results
- `metadata-issues-<PR#>.txt` - Issues found (empty if valid)

**Quality Gate: Metadata Validation**
```bash
# Check if metadata validation passed
if [ -s "metadata-issues-$PR_NUMBER.txt" ]; then
  echo "⚠️ PR metadata has issues, posting comment"
  gh pr comment "$PR_NUMBER" --body-file "metadata-issues-$PR_NUMBER.txt"
  echo "Continuing with code review..."
fi

echo "✅ Metadata validation complete"
```

**Track Progress:**
```bash
TOKENS_USED=2000
```

---

## Phase 3: Multi-Stage Code Review (15-85%)

This phase executes 5 parallel review stages for comprehensive analysis.

### Stage 1: Style & Readability (15-30%)

**⚡ EXECUTE TASK TOOL:**
```
Use the code-reviewer agent to:
1. Review changed files for code style issues
2. Check naming conventions and readability
3. Verify consistent formatting
4. Identify complex functions (cyclomatic complexity)
5. Generate line-level style feedback

subagent_type: "code-reviewer"
description: "Review code style and readability"
prompt: "Review style and readability for PR #$PR_NUMBER:

Changed files: $(cat changed-files-$PR_NUMBER.txt)

Review Focus:
- Code style consistency
- Variable/function naming clarity
- Code complexity (cyclomatic complexity < 10)
- Comment quality
- Code organization

For each issue found:
- File path and line number
- Severity (critical/high/medium/low)
- Description of issue
- Suggested fix

Output format:
\`\`\`json
{
  \"stage\": \"style\",
  \"issues\": [
    {
      \"file\": \"src/file.ts\",
      \"line\": 42,
      \"severity\": \"medium\",
      \"issue\": \"Function too complex (complexity: 15)\",
      \"suggestion\": \"Break into smaller functions\"
    }
  ]
}
\`\`\`

Expected outputs:
- style-review-$PR_NUMBER.json - Style issues found
"
```

**Expected Outputs:**
- `style-review-<PR#>.json` - Style and readability issues

**Track Progress:**
```bash
TOKENS_USED=5000
```

### Stage 2: Logic & Correctness (30-45%)

**⚡ EXECUTE TASK TOOL:**
```
Use the appropriate language specialist agent to:
1. Analyze business logic in changed files
2. Identify potential logic errors
3. Check edge case handling
4. Verify error handling
5. Validate correctness of implementation

subagent_type: "typescript-specialist"
description: "Review logic and correctness"
prompt: "Review logic and correctness for PR #$PR_NUMBER:

Changed files: $(cat changed-files-$PR_NUMBER.txt)
PR context: $(cat pr-context-$PR_NUMBER.json)

Review Focus:
- Business logic correctness
- Edge case handling
- Error handling adequacy
- Input validation
- Type safety (TypeScript)

For each issue:
- File path and line number
- Severity (critical/high/medium/low)
- Logic error description
- Impact analysis
- Suggested fix with code example

Expected outputs:
- logic-review-$PR_NUMBER.json - Logic issues found
"
```

**Expected Outputs:**
- `logic-review-<PR#>.json` - Logic and correctness issues

**Track Progress:**
```bash
TOKENS_USED=6000
```

### Stage 3: Security Audit (45-60%)

**⚡ EXECUTE TASK TOOL:**
```
Use the security-auditor agent to:
1. Scan changed files for security vulnerabilities
2. Check for OWASP Top 10 issues
3. Identify hardcoded secrets or credentials
4. Review authentication/authorization changes
5. Analyze new dependency security

subagent_type: "security-auditor"
description: "Security audit of PR changes"
prompt: "Perform security audit for PR #$PR_NUMBER:

Changed files: $(cat changed-files-$PR_NUMBER.txt)

Security Checklist:
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No hardcoded secrets/API keys
- [ ] Proper input validation
- [ ] Secure authentication/authorization
- [ ] No insecure dependencies
- [ ] Proper error handling (no info leak)
- [ ] HTTPS enforced where needed

Special attention to:
- Auth/authz changes (HIGH RISK)
- Database queries
- User input handling
- New dependencies
- Cryptography usage

For each vulnerability:
- File path and line number
- Severity (critical/high/medium/low)
- CVE/CWE reference if applicable
- Attack vector description
- Impact assessment
- Remediation steps with code

Expected outputs:
- security-review-$PR_NUMBER.json - Security issues found
"
```

**Expected Outputs:**
- `security-review-<PR#>.json` - Security vulnerabilities found

**Quality Gate: Security Critical Issues**
```bash
# Check for critical security issues
CRITICAL_SECURITY=$(jq '.issues[] | select(.severity=="critical")' security-review-$PR_NUMBER.json 2>/dev/null | wc -l)

if [ "$CRITICAL_SECURITY" -gt 0 ]; then
  echo "🔴 CRITICAL: Found $CRITICAL_SECURITY critical security issues"
  # Continue but flag for blocking merge
fi

echo "✅ Security audit complete"
```

**Track Progress:**
```bash
TOKENS_USED=7000
```

### Stage 4: Performance Analysis (60-72%)

**⚡ EXECUTE TASK TOOL:**
```
Use the performance-analyzer agent to:
1. Analyze performance impact of changes
2. Check for N+1 query problems
3. Review algorithm complexity changes
4. Identify potential memory leaks
5. Check database query optimization

subagent_type: "performance-analyzer"
description: "Analyze performance impact"
prompt: "Analyze performance impact for PR #$PR_NUMBER:

Changed files: $(cat changed-files-$PR_NUMBER.txt)

Performance Checklist:
- [ ] No N+1 query problems
- [ ] Efficient algorithms (time complexity)
- [ ] No memory leaks
- [ ] Proper caching strategies
- [ ] Database queries optimized
- [ ] No blocking operations in loops
- [ ] Resource cleanup (connections, files)

Focus Areas:
- New database queries
- Loop structures
- API calls
- File I/O operations
- Memory allocation

For each issue:
- File path and line number
- Severity (high/medium/low)
- Performance impact description
- Benchmark estimate (if possible)
- Optimization suggestion with code

Expected outputs:
- performance-review-$PR_NUMBER.json - Performance issues found
"
```

**Expected Outputs:**
- `performance-review-<PR#>.json` - Performance issues

**Track Progress:**
```bash
TOKENS_USED=5000
```

### Stage 5: Architecture Review (72-85%)

**⚡ EXECUTE TASK TOOL:**
```
Use the architect agent to:
1. Review architectural consistency
2. Check SOLID principles adherence
3. Evaluate coupling and cohesion
4. Assess scalability impact
5. Verify design pattern usage

subagent_type: "architect"
description: "Review architectural impact"
prompt: "Review architecture for PR #$PR_NUMBER:

Changed files: $(cat changed-files-$PR_NUMBER.txt)
PR context: $(cat pr-context-$PR_NUMBER.json)

Architecture Checklist:
- [ ] Follows existing patterns
- [ ] SOLID principles maintained
- [ ] Appropriate coupling/cohesion
- [ ] Scalability considered
- [ ] Design patterns used correctly
- [ ] Module boundaries respected

Focus Areas:
- New abstractions introduced
- Dependency changes
- Interface changes
- Module structure changes
- Integration points

For each concern:
- Component/module affected
- Severity (high/medium/low)
- Architectural issue description
- Long-term impact analysis
- Refactoring suggestion

Expected outputs:
- architecture-review-$PR_NUMBER.json - Architecture feedback
"
```

**Expected Outputs:**
- `architecture-review-<PR#>.json` - Architecture feedback

**Track Progress:**
```bash
TOKENS_USED=6000
```

---

## Phase 4: Review Summary Generation (85-95%)

**⚡ EXECUTE TASK TOOL:**
```
Use the technical-writer agent to:
1. Aggregate findings from all 5 review stages
2. Prioritize issues by severity (critical → low)
3. Generate comprehensive review summary
4. Format for GitHub markdown
5. Include positive findings and recommendations

subagent_type: "technical-writer"
description: "Generate PR review summary"
prompt: "Generate comprehensive review summary for PR #$PR_NUMBER:

Input Files:
- pr-context-$PR_NUMBER.json
- metadata-validation-$PR_NUMBER.md
- style-review-$PR_NUMBER.json
- logic-review-$PR_NUMBER.json
- security-review-$PR_NUMBER.json
- performance-review-$PR_NUMBER.json
- architecture-review-$PR_NUMBER.json

Generate review summary with:

1. **Overall Assessment**
   - Verdict: APPROVE ✅ | APPROVE WITH MINOR CHANGES 🟡 | REQUEST CHANGES 🔴
   - Quality Score: X/10
   - Issues by severity count

2. **Critical Issues** (must fix before merge)
   - Expandable details for each issue
   - Problem description
   - Code examples
   - Fix recommendations
   - References (OWASP, CWE, etc.)

3. **High Priority Issues** (should fix before merge)

4. **Medium/Low Priority Issues**

5. **Positive Findings**
   - What was done well

6. **Recommendations**
   - Before merge (required)
   - Short term (recommended)
   - Long term (consider)

7. **Test Coverage Analysis** (if applicable)

8. **Security Checklist**

9. **Performance Impact**

10. **Next Steps**

Use GitHub markdown with collapsible sections:
\`\`\`markdown
<details>
<summary>Issue Title - <code>file:line</code></summary>

Content here...
</details>
\`\`\`

Expected outputs:
- review-summary-$PR_NUMBER.md - Complete review formatted for GitHub
"
```

**Expected Outputs:**
- `review-summary-<PR#>.md` - Complete formatted review summary

**Quality Gate: Summary Validation**
```bash
# Validate summary generated
if [ ! -f "review-summary-$PR_NUMBER.md" ]; then
  echo "❌ Review summary not generated"
  exit 1
fi

# Check summary has content
LINE_COUNT=$(wc -l < "review-summary-$PR_NUMBER.md")
if [ "$LINE_COUNT" -lt 50 ]; then
  echo "❌ Review summary too short: $LINE_COUNT lines"
  exit 1
fi

echo "✅ Review summary generated ($LINE_COUNT lines)"
```

**Track Progress:**
```bash
TOKENS_USED=4000

# Store review summary
  "Review summary for PR #$PR_NUMBER" \
  "$(head -n 100 review-summary-$PR_NUMBER.md)"
```

---

## Phase 5: Post Review to GitHub (95-100%)

**⚡ EXECUTE TASK TOOL:**
```
Use the code-reviewer agent to:
1. Post inline comments for critical issues
2. Post comprehensive review summary
3. Set PR review status (approve/request changes/comment)
4. Apply appropriate labels
5. Update PR metadata if needed

subagent_type: "code-reviewer"
description: "Post review to GitHub"
prompt: "Post review feedback to PR #$PR_NUMBER:

Review Summary: review-summary-$PR_NUMBER.md
Critical Issues: $(jq '.issues[] | select(.severity==\"critical\")' security-review-$PR_NUMBER.json logic-review-$PR_NUMBER.json 2>/dev/null | wc -l)

Tasks:

1. **Post Inline Comments** (for critical/high issues only)
   For each critical/high severity issue:
   \`\`\`bash
   gh pr review $PR_NUMBER --comment -b \"🔴 **[Issue Title]**

   [Description]

   **Fix:**
   \\\`\\\`\\\`[language]
   [suggested code]
   \\\`\\\`\\\`
   \"
   \`\`\`

2. **Post Summary Comment**
   \`\`\`bash
   gh pr comment $PR_NUMBER --body-file review-summary-$PR_NUMBER.md
   \`\`\`

3. **Set Review Status**
   \`\`\`bash
   # Count critical issues
   CRITICAL_COUNT=\$(jq '[.issues[] | select(.severity==\"critical\")] | length' */review-*.json 2>/dev/null | awk '{s+=\$1} END {print s}')

   if [ \"\$CRITICAL_COUNT\" -gt 0 ]; then
     # Request changes for critical issues
     gh pr review $PR_NUMBER --request-changes -b \"Found \$CRITICAL_COUNT critical issues. Please address before merge.\"
   else
     # Approve or comment based on findings
     gh pr review $PR_NUMBER --approve -b \"Looks good! Minor suggestions included in review.\"
   fi
   \`\`\`

4. **Apply Labels**
   \`\`\`bash
   # Apply labels based on findings
   if [ \"\$CRITICAL_COUNT\" -gt 0 ]; then
     gh pr edit $PR_NUMBER --add-label \"needs-changes\"
   fi

   # Add specific labels
   if grep -q \"security\" security-review-$PR_NUMBER.json 2>/dev/null; then
     gh pr edit $PR_NUMBER --add-label \"security-review\"
   fi

   if grep -q \"performance\" performance-review-$PR_NUMBER.json 2>/dev/null; then
     gh pr edit $PR_NUMBER --add-label \"performance\"
   fi
   \`\`\`

Expected outputs:
- github-post-$PR_NUMBER.log - Log of GitHub API calls
"
```

**Expected Outputs:**
- `github-post-<PR#>.log` - Log of review posting actions

**Quality Gate: GitHub Integration**
```bash
# Verify review was posted
if ! gh pr view "$PR_NUMBER" --json reviews | grep -q "reviews"; then
  echo "❌ Review not posted to GitHub"
  exit 1
fi

echo "✅ Review posted to GitHub successfully"
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

# Determine verdict
CRITICAL_COUNT=$(jq '[.issues[] | select(.severity=="critical")] | length' */review-*.json 2>/dev/null | awk '{s+=$1} END {print s}')
if [ "$CRITICAL_COUNT" -gt 0 ]; then
  VERDICT="REQUEST_CHANGES"
else
  VERDICT="APPROVED"
fi

  "PR #$PR_NUMBER reviewed: $VERDICT ($CRITICAL_COUNT critical issues)"

echo "
✅ PR REVIEW COMPLETE

PR Number: #$PR_NUMBER
Verdict: $VERDICT
Critical Issues: $CRITICAL_COUNT

Review Posted:
- Summary: review-summary-$PR_NUMBER.md
- GitHub: https://github.com/[owner]/[repo]/pull/$PR_NUMBER

Files Generated:
- pr-context-$PR_NUMBER.json
- changed-files-$PR_NUMBER.txt
- review-plan-$PR_NUMBER.md
- style-review-$PR_NUMBER.json
- logic-review-$PR_NUMBER.json
- security-review-$PR_NUMBER.json
- performance-review-$PR_NUMBER.json
- architecture-review-$PR_NUMBER.json
- review-summary-$PR_NUMBER.md

Next Steps:
1. Developer addresses critical issues
2. Re-review when new commits pushed
3. Approve when all critical issues resolved
"

# Display metrics
```

---

## Iterative Re-Review

**When Developer Pushes New Commits:**

1. **Detect new commits:**
   ```bash
   gh pr view $PR_NUMBER --json commits
   ```

2. **Identify changed files since last review:**
   ```bash
   git diff <last-review-commit> <new-commit> --name-only
   ```

3. **Targeted re-review:**
   - Only review files changed since last review
   - Re-run only affected stages
   - Verify previous issues are fixed
   - Check for new issues

4. **Update review status:**
   ```bash
   # If issues fixed and no new issues:
   gh pr review $PR_NUMBER --approve \
     --body "✅ All issues addressed. Looks good!"

   # If new issues or incomplete fixes:
   gh pr review $PR_NUMBER --comment \
     --body "Thanks for the fixes! Found a few remaining issues..."
   ```

5. **Iteration limit:**
   - Maximum 3 automated review iterations
   - After 3 iterations, suggest human review or pair programming

---

## Special Review Modes

### Security-Critical PR
If PR touches auth, payments, sensitive data:
```
- Deep security audit (30 minutes)
- Invoke compliance specialists (GDPR, PCI-DSS, SOC2)
- Require human security team review
- Block merge until security sign-off
```

### Hotfix PR
If labeled "hotfix" or "emergency":
```
- Fast review mode (15 minutes)
- Focus on logic + security only
- Skip style, architecture reviews
- Expedited approval process
```

### Documentation-Only PR
If only .md files changed:
```
- Skip code review stages
- Review documentation quality:
  - Accuracy
  - Completeness
  - Clarity
  - Examples included
- Quick approval (5 minutes)
```

### Dependency Update PR
If only package.json, requirements.txt, etc.:
```
- Security audit only
- Check for known vulnerabilities
- Verify license compatibility
- Check for breaking changes
```

---

## Integration with CI/CD

**GitHub Actions Workflow:**

```yaml
name: Automated Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  code-review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Run Multi-Stage Code Review
        run: |
          # Trigger /review-pr workflow
          claude run /review-pr ${{ github.event.pull_request.number }}

      - name: Block Merge on Critical Issues
        if: contains(steps.review.outputs.verdict, 'REQUEST_CHANGES')
        run: exit 1
```

**Branch Protection Rules:**
```
- Require code review approval
- Require status checks to pass (including automated review)
- Dismiss stale reviews on new commits
- Require linear history
```

---

## Success Criteria Checklist

- ✅ PR context gathered from GitHub
- ✅ PR metadata validated
- ✅ All changed files reviewed across 5 stages
- ✅ Style and readability checked
- ✅ Logic and correctness verified
- ✅ Security audit completed
- ✅ Performance impact analyzed
- ✅ Architecture consistency reviewed
- ✅ Issues identified and prioritized
- ✅ Review summary generated
- ✅ Inline comments posted for critical issues
- ✅ Review summary posted to PR
- ✅ PR status set (approved/request changes)
- ✅ Labels applied appropriately
- ✅ Developer has clear action items

---

## Best Practices

### DO ✅
- Review within 24 hours of PR creation
- Provide specific, actionable feedback
- Reference exact file:line locations
- Explain *why* something is an issue
- Acknowledge what was done well
- Be constructive and respectful
- Re-review promptly after fixes

### DON'T ❌
- Nitpick minor style issues (let linters handle)
- Block on low-priority suggestions
- Provide vague feedback
- Forget to check for new issues in fixes
- Review while rushed
- Ignore test coverage
- Skip security review

---

## Example Usage

### Basic PR Review
```
/review-pr 123
```

### Re-review After Changes
```
/review-pr 123 --mode=re-review
```

### Security-Focused Review
```
/review-pr 123 --mode=security-focused
```

### Fast Review (Hotfix)
```
/review-pr 123 --mode=fast
```

---

Your mission is to ensure every PR meets quality standards while maintaining development velocity. Thorough yet efficient, strict yet constructive.
