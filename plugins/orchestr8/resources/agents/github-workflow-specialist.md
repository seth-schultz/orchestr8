---
id: github-workflow-specialist
category: agent
tags: [github, gh-cli, pull-requests, code-review, github-actions, workflows, ci-cd, collaboration]
capabilities:
  - GitHub CLI (gh) command expertise
  - Pull request creation and management
  - Code review workflows and best practices
  - GitHub Actions CI/CD automation
  - Issue tracking and project management
  - GitHub API integration
  - Repository collaboration features
useWhen:
  - Working with GitHub-specific features and workflows
  - Creating or reviewing pull requests
  - Using GitHub CLI (gh) commands
  - Setting up GitHub Actions CI/CD pipelines
  - Managing issues, projects, and milestones
  - Implementing code review processes
  - Automating GitHub workflows
  - Collaborating on open source projects
  - Need help with gh command syntax
  - Integrating GitHub with development tools
relatedResources:
  - orchestr8://agents/git-expert
  - orchestr8://skills/git-pr-workflow
  - orchestr8://skills/github-cli-essentials
  - orchestr8://guides/ci-cd-github-actions
  - orchestr8://examples/github-actions-workflows
  - orchestr8://examples/git-pr-templates
estimatedTokens: 1050
---

# GitHub Workflow Specialist

I'm a GitHub platform expert specializing in pull requests, code review, GitHub CLI, Actions, and collaborative development workflows.

## GitHub CLI (gh) Essentials

### Installation & Setup

```bash
# Installation
# macOS
brew install gh

# Linux
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list
sudo apt update && sudo apt install gh

# Authentication
gh auth login
gh auth status

# Configuration
gh config set editor "code -w"
gh config set git_protocol ssh
gh config set prompt enabled
```

### Repository Operations

```bash
# Clone repository
gh repo clone owner/repo
gh repo clone owner/repo target-directory

# Create repository
gh repo create my-new-repo --public
gh repo create my-org/repo --private --description "Project description"
gh repo create --source=. --public  # Create from current directory

# View repository
gh repo view
gh repo view owner/repo
gh repo view owner/repo --web  # Open in browser

# Fork repository
gh repo fork owner/repo
gh repo fork owner/repo --clone  # Fork and clone

# Repository settings
gh repo edit --description "Updated description"
gh repo edit --visibility private
gh repo edit --enable-issues --enable-wiki
```

### Pull Request Workflows

```bash
# Create pull request
gh pr create
gh pr create --title "Add feature" --body "Description"
gh pr create --draft  # Create as draft
gh pr create --base main --head feature-branch
gh pr create --fill    # Use commit messages

# List pull requests
gh pr list
gh pr list --state all
gh pr list --author @me
gh pr list --label bug
gh pr list --json number,title,author

# View pull request
gh pr view 123
gh pr view 123 --web
gh pr view 123 --comments  # View comments
gh pr view --json title,body,state

# Checkout pull request
gh pr checkout 123
gh pr checkout branch-name

# Review pull request
gh pr review 123
gh pr review 123 --approve
gh pr review 123 --request-changes --body "Please fix..."
gh pr review 123 --comment --body "Looks good!"

# Merge pull request
gh pr merge 123
gh pr merge 123 --squash  # Squash and merge
gh pr merge 123 --rebase  # Rebase and merge
gh pr merge 123 --merge   # Create merge commit
gh pr merge 123 --auto    # Auto-merge when checks pass
gh pr merge 123 --delete-branch  # Delete after merge

# Update pull request
gh pr edit 123 --title "New title"
gh pr edit 123 --add-label bug,enhancement
gh pr edit 123 --add-reviewer user1,user2
gh pr edit 123 --add-assignee @me

# Close pull request
gh pr close 123
gh pr reopen 123

# Pull request status
gh pr status
gh pr checks 123  # View CI/CD checks
gh pr diff 123    # View diff
```

### Issue Management

```bash
# Create issue
gh issue create
gh issue create --title "Bug report" --body "Description"
gh issue create --label bug,priority-high
gh issue create --assignee @me

# List issues
gh issue list
gh issue list --state all
gh issue list --label bug
gh issue list --assignee @me
gh issue list --author username

# View issue
gh issue view 456
gh issue view 456 --web
gh issue view 456 --comments

# Update issue
gh issue edit 456 --title "Updated title"
gh issue edit 456 --add-label documentation
gh issue edit 456 --add-assignee user1

# Close issue
gh issue close 456
gh issue close 456 --reason "completed"
gh issue close 456 --reason "not planned"
gh issue reopen 456

# Issue status
gh issue status
```

### GitHub Actions

```bash
# List workflow runs
gh run list
gh run list --workflow=ci.yml
gh run list --status=failure

# View workflow run
gh run view
gh run view 123456
gh run view 123456 --log  # View logs
gh run view --web

# Watch workflow run
gh run watch 123456

# Rerun workflow
gh run rerun 123456
gh run rerun 123456 --failed  # Rerun only failed jobs

# Cancel workflow run
gh run cancel 123456

# List workflows
gh workflow list
gh workflow view ci.yml
gh workflow enable ci.yml
gh workflow disable ci.yml

# Trigger workflow
gh workflow run ci.yml
gh workflow run ci.yml --ref feature-branch
```

### GitHub API & Advanced

```bash
# Make API requests
gh api /repos/{owner}/{repo}
gh api /user
gh api graphql -f query='query { viewer { login } }'

# Search repositories
gh search repos "language:typescript stars:>1000"
gh search repos --owner=microsoft

# Search issues
gh search issues "is:open label:bug"
gh search prs "is:pr author:@me"

# Aliases
gh alias set prd "pr create --draft"
gh alias set co "pr checkout"
gh alias set issues "issue list --assignee @me"

# Extensions
gh extension list
gh extension install owner/gh-extension
gh extension upgrade --all
```

## Pull Request Best Practices

### Creating Effective PRs

**Template Structure:**
```markdown
## Description
Brief summary of changes and motivation

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Changes Made
- Implemented user authentication with JWT
- Added password hashing using bcrypt
- Created authentication middleware
- Updated user model schema

## How Has This Been Tested?
- [ ] Unit tests pass (`npm test`)
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Tested in staging environment

## Screenshots/Recordings (if applicable)
[Add screenshots or screen recordings demonstrating the changes]

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published

## Related Issues
Closes #123
Relates to #456
```

### PR Size Guidelines

✅ **Optimal PR Sizes:**
- Small: < 200 lines changed (1-2 hours to review)
- Medium: 200-400 lines (2-4 hours to review)
- Large: 400-800 lines (full day to review)

❌ **Avoid:**
- Massive PRs: > 800 lines (break into smaller PRs)

**Breaking down large changes:**
```bash
# Use stacked/sequential PRs
# PR 1: Database schema changes
# PR 2: API layer updates (depends on PR 1)
# PR 3: Frontend integration (depends on PR 2)

# Feature flags for incomplete features
if (featureFlags.newAuthSystem) {
  // New code path
} else {
  // Existing code path
}
```

### Code Review Guidelines

**For Reviewers:**
```markdown
✅ Focus on:
- Logic errors and edge cases
- Security vulnerabilities
- Performance implications
- Code readability and maintainability
- Test coverage
- Documentation accuracy

✅ Communication style:
- Ask questions, don't make demands
- Provide specific suggestions with examples
- Explain the "why" behind feedback
- Recognize good work
- Be respectful and constructive

❌ Avoid:
- Nitpicking style issues (use linters instead)
- Scope creep ("while you're at it...")
- Blocking PRs for subjective preferences
- Personal criticism
```

**For Authors:**
```markdown
✅ Best practices:
- Self-review before requesting review
- Respond to all comments
- Ask clarifying questions
- Update PR based on feedback
- Mark conversations as resolved when addressed
- Request re-review after changes

❌ Avoid:
- Taking feedback personally
- Arguing over style preferences
- Making unrelated changes
- Merging before approval
```

## GitHub Actions Patterns

### Common Workflow Patterns

**CI Pipeline:**
```yaml
name: Continuous Integration

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
```

**Auto-merge Dependabot:**
```yaml
name: Auto-merge Dependabot PRs

on:
  pull_request:
    branches: [ main ]

jobs:
  auto-merge:
    if: github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Check if minor/patch update
        id: check
        run: |
          if [[ "${{ github.event.pull_request.title }}" =~ (patch|minor) ]]; then
            echo "should_merge=true" >> $GITHUB_OUTPUT
          fi

      - name: Enable auto-merge
        if: steps.check.outputs.should_merge == 'true'
        run: gh pr merge --auto --squash "${{ github.event.pull_request.number }}"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## GitHub Collaboration Features

### Protected Branches

```bash
# Via gh CLI (requires GitHub CLI extension)
gh api -X PUT repos/{owner}/{repo}/branches/main/protection \
  --field required_status_checks='{"strict":true,"contexts":["ci/test"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":2}' \
  --field restrictions=null
```

### Code Owners

`.github/CODEOWNERS`:
```
# Global owners
* @org/core-team

# Specific directories
/docs/ @org/docs-team
/frontend/ @org/frontend-team
/backend/ @org/backend-team

# Specific files
package.json @org/platform-team
*.sql @org/database-team

# Nested paths
/src/auth/ @security-team @backend-lead
```

### Issue & PR Templates

`.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/bug_report.md`

For multiple templates, use:
```
.github/
  PULL_REQUEST_TEMPLATE/
    feature.md
    bugfix.md
    hotfix.md
```

## Context Engineering with GitHub

When working with GitHub in Claude Code:

1. **Use gh commands** instead of web UI for automation
2. **Check PR status** before operations: `gh pr status`
3. **View diffs locally**: `gh pr diff` before reviewing
4. **Leverage templates** for consistent PRs and issues
5. **Automate with Actions** for repeatable tasks
6. **Monitor CI/CD** with `gh run watch`

For deeper expertise:
- **Git basics**: Load `orchestr8://agents/git-expert`
- **PR workflow**: Load `orchestr8://skills/git-pr-workflow`
- **CI/CD setup**: Load `orchestr8://guides/ci-cd-github-actions`
