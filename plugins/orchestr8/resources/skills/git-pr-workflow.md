---
id: git-pr-workflow
category: skill
tags: [git, github, pull-request, code-review, pr-workflow, github-actions, collaboration, merge-strategy]
capabilities:
  - Create and manage pull requests effectively
  - Implement PR review workflows and automation
  - Handle PR conflicts and update strategies
  - Optimize PR templates and descriptions
useWhen:
  - Creating pull requests with detailed descriptions
  - Setting up PR templates and automation
  - Reviewing pull requests systematically
  - Managing PR conflicts and merge strategies
  - Implementing PR checks and CI integration
  - Handling draft PRs and WIP workflows
  - Automating PR labeling and assignment
  - Implementing PR approval workflows
  - Managing PR branch protection rules
  - Optimizing PR size and scope
  - Setting up CODEOWNERS for automatic reviews
  - Implementing semantic PR titles
  - Using PR comments and review threads
  - Managing PR dependencies and stacked PRs
relatedResources:
  - orchestr8://agents/github-workflow-specialist
  - orchestr8://agents/git-expert
  - orchestr8://skills/git-workflow
  - orchestr8://skills/git-rebase-merge
  - orchestr8://skills/github-cli-essentials
  - orchestr8://skills/cicd-pipeline-optimization
  - orchestr8://skills/code-quality-standards
estimatedTokens: 750
---

# Git Pull Request Workflow

## Creating Effective Pull Requests

```bash
# Create feature branch with descriptive name
git checkout -b feature/user-profile-enhancement

# Make focused, atomic commits
git add src/profile/
git commit -m "feat(profile): add avatar upload functionality"

git add tests/profile/
git commit -m "test(profile): add avatar upload tests"

# Push and create PR
git push -u origin feature/user-profile-enhancement

# Create PR with gh CLI
gh pr create \
  --title "feat: Add user profile avatar upload" \
  --body "$(cat <<EOF
## Summary
Implements avatar upload functionality for user profiles with image validation and resizing.

## Changes
- Added file upload endpoint with multipart/form-data support
- Integrated ImageMagick for image resizing and optimization
- Added S3 storage integration for avatar persistence
- Implemented validation for file types and size limits

## Testing
- Unit tests for upload validation logic
- Integration tests for S3 storage
- E2E tests for complete upload flow
- Manual testing with various image formats

## Screenshots
![Avatar Upload UI](./docs/images/avatar-upload.png)

## Related Issues
Closes #234
Related to #189

## Checklist
- [x] Tests added and passing
- [x] Documentation updated
- [x] No breaking changes
- [x] Backwards compatible
EOF
)" \
  --reviewer @team/backend-reviewers \
  --assignee @me \
  --label "enhancement,backend" \
  --draft  # Mark as draft initially
```

## PR Template Configuration

```markdown
<!-- .github/pull_request_template.md -->
## Type of Change
<!-- Check relevant options -->
- [ ] 🐛 Bug fix (non-breaking change fixing an issue)
- [ ] ✨ New feature (non-breaking change adding functionality)
- [ ] 💥 Breaking change (fix or feature causing existing functionality to change)
- [ ] 📝 Documentation update
- [ ] ♻️ Refactoring (no functional changes)
- [ ] ⚡ Performance improvement
- [ ] ✅ Test updates

## Description
<!-- Provide clear description of changes -->

## Motivation and Context
<!-- Why is this change required? What problem does it solve? -->

## How Has This Been Tested?
<!-- Describe testing performed -->
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing
- [ ] Performance testing

## Screenshots (if applicable)

## Breaking Changes
<!-- List any breaking changes and migration steps -->

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings or errors
- [ ] Tests added/updated and passing
- [ ] Dependent changes merged and published
```

## Automated PR Workflows

```yaml
# .github/workflows/pr-checks.yml
name: PR Checks

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]

jobs:
  validate-pr:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Validate PR title follows conventional commits
      - uses: amannn/action-semantic-pull-request@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          types: |
            feat
            fix
            docs
            style
            refactor
            perf
            test
            chore
          requireScope: false

      # Auto-label based on changed files
      - uses: actions/labeler@v4
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}

      # Check PR size
      - uses: andymckay/labeler@master
        with:
          add-labels: "size/large"
          repo-token: ${{ secrets.GITHUB_TOKEN }}
        if: github.event.pull_request.additions > 500

      # Comment on first-time contributor PRs
      - uses: actions/first-interaction@v1
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          pr-message: |
            Thanks for your first contribution! 🎉
            A maintainer will review your PR soon.

  lint-and-test:
    runs-on: ubuntu-latest
    if: github.event.pull_request.draft == false
    steps:
      - uses: actions/checkout@v4
      - name: Run linters
        run: npm run lint
      - name: Run tests
        run: npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## CODEOWNERS for Auto-Review Assignment

```bash
# .github/CODEOWNERS
# Default owners for everything
* @org/engineering-leads

# Backend code
/src/api/ @org/backend-team
/src/services/ @org/backend-team

# Frontend code
/src/components/ @org/frontend-team
/src/pages/ @org/frontend-team

# Infrastructure
/terraform/ @org/devops-team
/kubernetes/ @org/devops-team
/.github/workflows/ @org/devops-team

# Documentation
/docs/ @org/tech-writers
*.md @org/tech-writers

# Security-sensitive files
/src/auth/ @org/security-team
/src/crypto/ @org/security-team

# Database migrations require DBA review
/migrations/ @org/dba-team
```

## PR Review Best Practices

```bash
# Check out PR locally for testing
gh pr checkout 123

# Review changes with detailed diff
git diff main...feature-branch

# Add review comments
gh pr review 123 --comment --body "Great work! Few suggestions..."

# Request changes
gh pr review 123 --request-changes --body "Please address memory leak in line 45"

# Approve PR
gh pr review 123 --approve --body "LGTM! ✅"

# Add inline comments via web UI for specific code lines

# Re-request review after updates
gh pr ready 123  # Mark draft as ready
```

## Handling PR Updates

```bash
# Updating PR with new commits
git checkout feature-branch
# Make changes
git add .
git commit -m "fix: address review comments"
git push origin feature-branch

# Squashing commits before merge
git rebase -i main  # Interactive rebase
# Mark commits as 'squash' or 'fixup'
git push --force-with-lease origin feature-branch

# Syncing PR branch with latest main
git checkout feature-branch
git fetch origin
git rebase origin/main  # Or merge if team prefers
git push --force-with-lease origin feature-branch

# Resolving conflicts during PR
git fetch origin
git rebase origin/main
# Fix conflicts
git add .
git rebase --continue
git push --force-with-lease origin feature-branch
```

## PR Merge Strategies

```bash
# Merge commit (preserves all commits and history)
gh pr merge 123 --merge --delete-branch

# Squash merge (combines all commits into one)
gh pr merge 123 --squash --delete-branch \
  --body "Squashed commit message with full context"

# Rebase merge (replays commits on top of main)
gh pr merge 123 --rebase --delete-branch

# Auto-merge when checks pass
gh pr merge 123 --auto --squash --delete-branch
```

## Stacked/Dependent PRs

```bash
# Create PR chain for large features
git checkout -b feature/step1-database-schema
# ... make changes ...
git push -u origin feature/step1-database-schema
gh pr create --base main --title "Step 1: Database schema"

git checkout -b feature/step2-api-endpoints
# ... make changes ...
git push -u origin feature/step2-api-endpoints
gh pr create --base feature/step1-database-schema --title "Step 2: API endpoints"

git checkout -b feature/step3-frontend
# ... make changes ...
git push -u origin feature/step3-frontend
gh pr create --base feature/step2-api-endpoints --title "Step 3: Frontend UI"

# Update base after merge
gh pr edit 456 --base main  # Update step2 to target main after step1 merges
```
