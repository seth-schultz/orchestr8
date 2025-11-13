---
id: git-collaboration-workflow
category: pattern
tags: [git, collaboration, code-review, pull-request, team-workflow, branching, trunk-based, feature-branch, pr-workflow, github]
capabilities:
  - Team collaboration workflows with Git
  - Code review culture and PR best practices
  - Branch protection and merge strategies
  - Git workflow selection (trunk-based vs feature-branch)
  - Conflict resolution and collaboration patterns
  - Commit message conventions and standards
useWhen:
  - Multi-developer teams needing structured Git workflows with branch protection, PR templates, and automated code review enforcement
  - Code review culture establishment requiring PR workflows, review assignment strategies, and quality gate automation with CI integration
  - Feature branch management with naming conventions, lifecycle policies, and stale branch cleanup automation strategies
  - Trunk-based development adoption requiring short-lived branches, feature flags, and continuous integration with main branch stability
  - Merge conflict prevention through regular rebasing, branch synchronization patterns, and communication protocols between team members
  - Distributed team collaboration requiring async code review practices, timezone-aware workflows, and clear PR expectations documentation
  - Open-source project contribution workflows with fork-based development, contributor guidelines, and maintainer review processes
  - Legacy codebase migration to modern Git workflows requiring gradual adoption, team training, and workflow documentation creation
  - Code quality enforcement through commit hooks, PR checks, linting automation, and standardized commit message conventions like Conventional Commits
  - Repository access control with branch permissions, required reviewers, merge queue management, and deployment protection rules
  - Large-scale refactoring coordination requiring feature branches, incremental merges, backward compatibility, and team communication
  - Documentation of decisions through PR descriptions, code comments, and architectural decision records linked to specific changes
  - Cross-functional team collaboration between frontend, backend, DevOps with clear ownership boundaries and review requirements
  - Release train coordination with multiple parallel development streams, integration branches, and scheduled merge windows
  - Emergency hotfix workflows requiring fast-track PR processes, minimal review requirements, and immediate production deployment paths
relatedResources:
  - orchestr8://patterns/git-release-management
  - orchestr8://patterns/git-monorepo-strategies
  - orchestr8://skills/git-workflow
  - orchestr8://skills/code-quality-standards
  - orchestr8://skills/quality-code-review-checklist
  - orchestr8://patterns/phased-delivery
  - orchestr8://agents/project-manager
  - orchestr8://workflows/workflow-code-review
  - orchestr8://workflows/workflow-review-pr
  - orchestr8://skills/agile-scrum-practices
estimatedTokens: 950
---

# Git Collaboration Workflow Pattern

## Overview

Effective Git collaboration workflows enable teams to work concurrently on codebases while maintaining code quality, preventing conflicts, and fostering a strong code review culture. The choice between trunk-based development, feature-branch workflows, or hybrid approaches depends on team size, release cadence, and organizational maturity.

## When to Use This Pattern

Use structured Git collaboration workflows when:
- Multiple developers work on the same codebase simultaneously
- Code review is required before merging changes
- You need to maintain code quality standards through automated checks
- Teams are distributed across timezones requiring async collaboration
- Contributing to open-source projects with external contributors

## Implementation

### Workflow Selection Strategy

**Trunk-Based Development**
```bash
# Short-lived feature branches (< 2 days)
git checkout -b feature/user-auth
# Work, commit frequently
git commit -m "feat: add user authentication middleware"
# Rebase before merging
git rebase main
git push origin feature/user-auth
# Create PR, quick review, merge to main
```

**Best for**: Small teams, continuous deployment, feature flags, high automation maturity

**Feature-Branch Workflow**
```bash
# Long-lived feature branches
git checkout -b feature/payment-integration
# Multiple commits over days/weeks
git commit -m "feat: integrate Stripe payment API"
git commit -m "test: add payment integration tests"
# Regular sync with main
git fetch origin
git rebase origin/main
# Comprehensive PR review before merge
```

**Best for**: Larger teams, scheduled releases, complex features, learning teams

### Branch Protection Rules

```yaml
# .github/branch-protection.yml
main:
  required_reviews: 2
  required_checks:
    - "ci/tests"
    - "ci/lint"
    - "ci/security-scan"
  enforce_admins: true
  require_linear_history: true
  allow_force_push: false
  require_signed_commits: true
```

### Pull Request Templates

```markdown
## Description
<!-- Clear description of what this PR does -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
<!-- How has this been tested? -->

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added to complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated and passing
- [ ] Dependent changes merged

## Related Issues
Closes #123
```

### Commit Message Convention

```bash
# Conventional Commits format
<type>(<scope>): <subject>

<body>

<footer>

# Examples:
git commit -m "feat(auth): add OAuth 2.0 integration

Implemented Google and GitHub OAuth providers using Passport.js.
Added user account linking logic for existing users.

Closes #456"

git commit -m "fix(api): resolve race condition in user creation

Added transaction wrapper to prevent duplicate user records
when concurrent requests occur.

Fixes #789"

git commit -m "docs(readme): update installation instructions

Added Node.js version requirements and troubleshooting section."
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`, `ci`, `build`

### Code Review Best Practices

**Review Assignment Strategy**
```javascript
// CODEOWNERS file
# Global owners
* @team/core-maintainers

# Component-specific owners
/src/api/ @team/backend
/src/ui/ @team/frontend
/infrastructure/ @team/devops
/docs/ @team/tech-writers

# Require specific experts
/src/security/ @security-team
/src/payment/ @payment-team @compliance-team
```

**Review Process Guidelines**
1. **Author Responsibilities**:
   - Self-review before requesting review
   - Provide context in PR description
   - Respond to feedback within 24 hours
   - Keep PRs small (< 400 lines)

2. **Reviewer Responsibilities**:
   - Review within 1 business day
   - Provide constructive, specific feedback
   - Approve only if you'd be comfortable maintaining the code
   - Use suggestion blocks for minor changes

3. **Review Comments**:
   ```
   [blocking] Security: User input not validated
   [nit] Consider renaming `data` to `userData` for clarity
   [question] Why async here? Is this I/O bound?
   [praise] Excellent test coverage!
   ```

### Merge Strategies

**Squash and Merge** (Recommended for feature branches)
```bash
# Combines all commits into one clean commit on main
git merge --squash feature/user-auth
git commit -m "feat: add user authentication system"
```
**Pros**: Clean history, easy revert
**Cons**: Loses detailed commit history

**Rebase and Merge** (Recommended for trunk-based)
```bash
# Maintains linear history with all commits
git rebase main
git push --force-with-lease
# Fast-forward merge to main
```
**Pros**: Linear history, preserves commits
**Cons**: Requires discipline, can be confusing for beginners

**Merge Commit** (For release branches)
```bash
# Creates explicit merge commit
git merge --no-ff feature/major-refactor
```
**Pros**: Preserves branch context, easy to see feature scope
**Cons**: Messy history with many branches

## Examples

### Conflict Resolution Pattern

```bash
# Developer A and B both modify same file
# Developer A merges first

# Developer B updates branch
git fetch origin
git rebase origin/main

# Conflict occurs
# CONFLICT (content): Merge conflict in src/auth.ts

# Resolve conflict in editor
git add src/auth.ts
git rebase --continue

# Run tests to ensure no breakage
npm test

# Force push (safe with --force-with-lease)
git push --force-with-lease origin feature/auth-refactor
```

### Draft PR Workflow

```bash
# Create draft PR for early feedback
gh pr create --draft --title "WIP: Refactor authentication layer" \
  --body "Early feedback wanted on architecture approach"

# Mark ready when complete
gh pr ready
```

### Hotfix Workflow

```bash
# Critical production bug
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# Fix, test, commit
git commit -m "fix(security): patch XSS vulnerability

CVE-2024-12345 - Sanitize user input in comment rendering.

BREAKING: Comments now strip HTML tags by default."

# Fast-track PR with minimal required reviewers
gh pr create --title "HOTFIX: Critical security patch" \
  --label "hotfix" --label "security"

# Deploy immediately after merge
```

## Trade-offs

### Trunk-Based vs Feature-Branch

| Aspect | Trunk-Based | Feature-Branch |
|--------|-------------|----------------|
| **Merge Frequency** | Multiple/day | Few/week |
| **Integration Conflicts** | Rare, small | Common, large |
| **Code Review** | Quick, focused | Comprehensive |
| **Feature Flags** | Required | Optional |
| **Team Maturity** | High required | Any level |
| **Release Flexibility** | Continuous | Scheduled |
| **Rollback Complexity** | Feature flag toggle | Git revert |

### Squash vs Rebase vs Merge

- **Squash**: Clean history but loses granular commits—use for most features
- **Rebase**: Linear history with all commits—use for trunk-based or well-structured work
- **Merge**: Explicit merge commits—use for release branches or long-lived features

## Best Practices

1. **Keep PRs Small**: Target < 400 lines, focus on single responsibility
2. **Automate Quality Gates**: Lint, test, security scan before review
3. **Review Daily**: Don't let PRs sit; stale PRs create merge conflicts
4. **Use Feature Flags**: Enable trunk-based development with safe deployments
5. **Document Decisions**: PR descriptions should explain "why," not just "what"
6. **Protect Main**: Require reviews, passing tests, and signed commits
7. **Regular Sync**: Rebase frequently to avoid large merge conflicts
8. **Clear Ownership**: Use CODEOWNERS for automatic review assignment
9. **Async Communication**: Write detailed PR descriptions for distributed teams
10. **Celebrate Quality**: Recognize great PRs and helpful reviews

## When to Avoid

- **Solo Projects**: Overhead not worth benefits (use simpler workflow)
- **Rapid Prototyping**: Slow down experimentation (use separate repo)
- **Non-Code Repos**: Documentation repos may not need strict PR process
