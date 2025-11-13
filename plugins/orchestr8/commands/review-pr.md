---
description: Comprehensive PR review with code analysis, security audit, and automated
  GitHub feedback
argument-hint:
- pr-number
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- WebFetch
- Write
---

# Review Pull Request: $ARGUMENTS

**Request:** Review Pull Request #$ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "orchestr8"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Code Reviewer** responsible for comprehensive PR review across style, logic, security, performance, and architecture dimensions with automated GitHub integration.

## Phase 1: PR Context Gathering (0-15%)

**→ Load:** orchestr8://workflows/workflow-review-pr

**Activities:**
- Fetch PR details from GitHub (title, description, author, branches)
- Get PR diff and identify all changed files
- Categorize files by type (frontend, backend, tests, config, docs)
- Analyze PR context (size, change type, risk level)
- Validate PR metadata (title format, description, linked issues)
- Check for screenshots if UI changes
- Create review plan

**→ Checkpoint:** PR context gathered, metadata validated

## Phase 2: Multi-Stage Code Review (15-80%)

**→ Load:** orchestr8://match?query=code+review+security+performance+architecture&categories=skill,pattern&mode=index&maxResults=8

**Parallel Review Stages:**
- **Style & Readability:** Code style, naming, complexity, formatting
- **Logic & Correctness:** Business logic, edge cases, error handling, type safety
- **Security Audit:** OWASP Top 10, secrets, auth/authz, vulnerabilities
- **Performance Analysis:** N+1 queries, algorithm complexity, memory leaks
- **Architecture Review:** SOLID principles, patterns, coupling, scalability

**Activities:**
- Review changed files across all quality dimensions
- Check naming conventions and readability
- Verify correctness of business logic
- Scan for security vulnerabilities
- Analyze performance impact
- Assess architectural consistency
- Identify issues with severity ratings (critical/high/medium/low)
- Generate line-level feedback for critical issues
- Document positive findings

**→ Checkpoint:** All dimensions reviewed, issues identified

## Phase 3: Review Summary & GitHub Posting (80-100%)

**→ Load:** orchestr8://match?query=code+review+github+automation&categories=skill&mode=index&maxResults=5

**Activities:**
- Aggregate findings from all review stages
- Prioritize issues by severity
- Generate comprehensive review summary
- Calculate quality score (0-10)
- Determine verdict (approve/approve with changes/request changes)
- Post inline comments for critical issues
- Post review summary to PR
- Set PR review status (gh pr review)
- Apply appropriate labels
- Update PR metadata if needed

**→ Checkpoint:** Review posted to GitHub, status set

## Special Review Modes

### Security-Critical PR
If PR touches auth, payments, sensitive data:
- Deep security audit (extended)
- Require human security review
- Block merge until sign-off

### Hotfix PR
If labeled "hotfix" or "emergency":
- Fast review mode (15 minutes)
- Focus on logic + security only
- Skip style, architecture reviews

### Documentation-Only PR
If only .md files changed:
- Skip code review stages
- Review docs quality, accuracy, completeness
- Quick approval (5 minutes)

### Dependency Update PR
If only package.json, requirements.txt, etc.:
- Security audit only
- Check for vulnerabilities
- Verify license compatibility
- Check for breaking changes

## Success Criteria

✅ PR context gathered from GitHub
✅ Metadata validated (title, description, links)
✅ All changed files reviewed across 5 dimensions
✅ Security vulnerabilities identified
✅ Performance impact analyzed
✅ Architecture consistency checked
✅ Issues prioritized by severity
✅ Inline comments posted for critical issues
✅ Review summary posted to PR
✅ PR status set appropriately
✅ Labels applied
✅ Developer has clear action items

## Example Usage

```bash
# Basic PR review
/orchestr8:review-pr 123

# Re-review after changes
/orchestr8:review-pr 123 --mode=re-review

# Security-focused review
/orchestr8:review-pr 123 --mode=security-focused

# Fast review (hotfix)
/orchestr8:review-pr 123 --mode=fast
```

## Best Practices

**DO:**
- Review within 24 hours of PR creation
- Provide specific, actionable feedback
- Reference exact file:line locations
- Explain *why* something is an issue
- Acknowledge what was done well
- Be constructive and respectful

**DON'T:**
- Nitpick minor style issues (let linters handle)
- Block on low-priority suggestions
- Provide vague feedback
- Ignore test coverage
- Skip security review
