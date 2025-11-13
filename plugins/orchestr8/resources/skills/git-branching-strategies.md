---
id: git-branching-strategies
category: skill
tags: [git, branching, git-flow, github-flow, trunk-based, workflow, strategy]
capabilities:
  - Git Flow branching model
  - GitHub Flow simplicity
  - GitLab Flow hybrid approach
  - Trunk-Based Development
  - Branch naming conventions
  - Branching strategy selection
useWhen:
  - Choosing branching strategy for team
  - Setting up Git workflow
  - Need branching conventions
  - Planning release management
  - Implementing CI/CD with Git
  - Scaling team collaboration
  - Comparing branching models
relatedResources:
  - orchestr8://agents/git-expert
  - orchestr8://skills/git-workflow
  - orchestr8://skills/git-commit-best-practices
  - orchestr8://patterns/git-collaboration-workflow
estimatedTokens: 820
---

# Git Branching Strategies

## Strategy Comparison

| Feature | Git Flow | GitHub Flow | GitLab Flow | Trunk-Based |
|---------|----------|-------------|-------------|-------------|
| Complexity | High | Low | Medium | Low |
| Release Model | Scheduled | Continuous | Flexible | Continuous |
| Team Size | Large | Small-Medium | Any | Experienced |
| Best For | Enterprise | Startups, Web | Versatile | Fast iteration |
| Branches | 5 types | 2 types | 3-4 types | 1 main + short-lived |

## Git Flow

### Branch Types

```
main (production)
  ├── develop (integration)
  │   ├── feature/* (new features)
  │   └── release/* (release prep)
  └── hotfix/* (urgent fixes)
```

### Workflow

```bash
# Feature development
git checkout develop
git checkout -b feature/user-profile

# Work on feature...
git add .
git commit -m "feat(profile): add user bio section"

# Finish feature
git checkout develop
git merge --no-ff feature/user-profile
git branch -d feature/user-profile
git push origin develop

# Start release
git checkout develop
git checkout -b release/1.2.0

# Release prep (version bumps, last fixes)
git commit -m "chore: bump version to 1.2.0"

# Finish release
git checkout main
git merge --no-ff release/1.2.0
git tag -a v1.2.0 -m "Release version 1.2.0"
git checkout develop
git merge --no-ff release/1.2.0
git branch -d release/1.2.0

# Hotfix
git checkout main
git checkout -b hotfix/security-patch

# Fix urgent issue
git commit -m "fix(security): patch XSS vulnerability"

# Merge to both main and develop
git checkout main
git merge --no-ff hotfix/security-patch
git tag -a v1.2.1
git checkout develop
git merge --no-ff hotfix/security-patch
git branch -d hotfix/security-patch
```

**✅ When to use Git Flow:**
- Large teams with scheduled releases
- Products with multiple version support
- Need strict release control
- Complex deployment pipelines

**❌ When to avoid:**
- Continuous deployment environments
- Small teams needing agility
- Web apps with single production version

## GitHub Flow

### Branch Types

```
main (production-ready)
  └── feature-branches (all work)
```

### Workflow

```bash
# Create branch for work
git checkout -b add-user-authentication
git push -u origin add-user-authentication

# Make changes
git add .
git commit -m "feat(auth): implement JWT authentication"
git push

# Create pull request on GitHub
# Request review, discuss, iterate
# CI/CD runs automated tests

# Merge to main via PR
# Deploys automatically to production

# Delete feature branch
git branch -d add-user-authentication
git push origin --delete add-user-authentication
```

**Branch lifecycle:**
1. Create branch from main
2. Commit changes
3. Open pull request
4. Review & discussion
5. Deploy to staging (optional)
6. Merge to main
7. Automatic production deploy
8. Delete branch

**✅ When to use GitHub Flow:**
- Continuous deployment
- Web applications
- Small to medium teams
- Fast iteration needed
- Single production environment

**❌ When to avoid:**
- Need multiple production versions
- Scheduled release cycles
- Complex approval processes

## GitLab Flow

### Environment Branches

```
main (development)
  ├── pre-production
  └── production
```

### Workflow

```bash
# Feature development (like GitHub Flow)
git checkout -b feature/new-dashboard
# Work, commit, push
# Create merge request to main

# After merge to main
# Automated deploy to development environment

# Promote to pre-production
git checkout pre-production
git merge main
git push
# Automated deploy to staging

# Production release
git checkout production
git merge pre-production
git tag v1.0.0
git push --tags
# Automated deploy to production

# Hotfix approach
git checkout -b hotfix/critical-bug production
# Fix bug
# Create MR to production
# Cherry-pick to pre-production and main
```

**✅ When to use GitLab Flow:**
- Multiple environments (dev, staging, prod)
- Need deployment pipelines
- Hybrid of Git Flow and GitHub Flow benefits
- Different release cadences per environment

## Trunk-Based Development

### Model

```
main (trunk)
  └── short-lived feature branches (< 2 days)
```

### Workflow

```bash
# Short-lived feature branch
git checkout -b feat-quick-fix
# Work for < 2 days
git commit -m "feat: add validation"
git push

# Fast review and merge to main
# PR reviewed within hours
# Merge to main
# Deploy to production

# Alternative: Commit directly to main (with feature flags)
git checkout main
git pull
# Make small change
git commit -m "feat: add new button (behind feature flag)"
git push
# CI/CD deploys to production
# Feature enabled via feature flag
```

**Key practices:**
- Branches live < 2 days
- Merge to main at least daily
- Use feature flags for incomplete work
- Comprehensive automated testing
- Fast code review (< 4 hours)

**✅ When to use:**
- Experienced teams
- Strong CI/CD and testing
- Need fast integration
- Microservices architecture

**❌ When to avoid:**
- Junior teams
- Weak automated testing
- Slow code review process

## Branch Naming Conventions

### Structured Naming

```bash
# Pattern: <type>/<ticket-id>-<description>

# Features
feature/USER-123-add-profile-page
feature/add-user-authentication
feat/dashboard-redesign

# Bug fixes
bugfix/AUTH-456-fix-token-expiration
fix/resolve-memory-leak
bug/payment-processing

# Hotfixes
hotfix/security-patch-xss
hotfix/URGENT-database-connection

# Releases
release/v1.2.0
release/2024-Q1

# Experiments
experiment/new-algorithm
spike/evaluate-graphql
```

### Team Conventions

```bash
# With owner prefix
john/feature/add-comments
sarah/fix/api-timeout

# Environment branches
develop
staging
production
qa

# Version branches
support/1.x
support/2.x
```

## Branch Protection Rules

### Recommended Settings

```yaml
# For main/production branches:
Protection Rules:
  - Require pull request reviews (2+ approvals)
  - Require status checks to pass
    - ✓ CI/CD pipeline
    - ✓ Automated tests
    - ✓ Code coverage (> 80%)
    - ✓ Security scan
  - Require branches to be up to date
  - Require signed commits (optional)
  - Include administrators (enforce rules for all)
  - Restrict who can push
  - Require linear history (no merge commits)
  - Do not allow force pushes
  - Do not allow deletions
```

## Choosing the Right Strategy

### Decision Tree

```
Do you need multiple production versions?
├─ YES → Git Flow
└─ NO → Continue

Do you deploy continuously?
├─ YES → Continue
└─ NO → GitLab Flow (environment branches)

Is your team experienced with Git and testing?
├─ YES → Trunk-Based Development
└─ NO → GitHub Flow

Do you need multiple environments?
├─ YES → GitLab Flow
└─ NO → GitHub Flow
```

### Hybrid Approaches

**GitHub Flow + Environment Branches:**
```
main → staging → production
```

**Trunk-Based + Release Branches:**
```
main (continuous)
  └── release/v1.x (for fixes)
```

## Migration Strategies

### From Git Flow to GitHub Flow

```bash
# 1. Merge all feature branches to develop
# 2. Merge develop to main
git checkout main
git merge develop

# 3. Delete develop branch
git branch -d develop
git push origin --delete develop

# 4. Update branch protection
# 5. Communicate new workflow to team
```

### From Any Strategy to Trunk-Based

```bash
# 1. Ensure strong CI/CD and testing
# 2. Implement feature flags
# 3. Train team on small commits
# 4. Start with short-lived branches (1 week)
# 5. Gradually reduce to 2-3 days
# 6. Eventually allow direct main commits
```

## Common Pitfalls

❌ **Long-lived feature branches**
- Merge conflicts multiply
- Drift from main
- Hard to review
Solution: Merge daily, use feature flags

❌ **Too many branch types**
- Confusion about which to use
- Overhead in maintenance
Solution: Simplify to 2-3 types max

❌ **No branch protection**
- Broken main branch
- Lost work
Solution: Protect main immediately

❌ **Inconsistent naming**
- Hard to find branches
- Automation breaks
Solution: Enforce naming convention
