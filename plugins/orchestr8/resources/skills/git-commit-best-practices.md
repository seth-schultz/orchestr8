---
id: git-commit-best-practices
category: skill
tags: [git, commits, conventional-commits, commit-messages, best-practices, semantic-versioning]
capabilities:
  - Conventional Commits specification
  - Atomic commit strategies
  - Commit message formatting
  - Semantic versioning integration
  - Commit hygiene practices
useWhen:
  - Writing commit messages
  - Need commit message conventions
  - Implementing semantic versioning
  - Setting up commit linting
  - Defining team commit standards
  - Generating changelogs from commits
  - Creating atomic, reviewable commits
relatedResources:
  - orchestr8://agents/git-expert
  - orchestr8://skills/git-workflow
  - orchestr8://examples/git-commit-examples
  - orchestr8://patterns/git-collaboration-workflow
estimatedTokens: 750
---

# Git Commit Best Practices

## Conventional Commits Specification

### Format Structure

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

```bash
feat:     # New feature for the user
fix:      # Bug fix for the user
docs:     # Documentation only changes
style:    # Formatting, missing semicolons, etc. (not CSS)
refactor: # Code change that neither fixes a bug nor adds a feature
perf:     # Performance improvement
test:     # Adding or correcting tests
build:    # Changes to build system or dependencies
ci:       # CI configuration files and scripts
chore:    # Other changes that don't modify src or test files
revert:   # Reverts a previous commit
```

### Examples

```bash
# Simple feature
git commit -m "feat(auth): add JWT token validation"

# Bug fix with scope
git commit -m "fix(api): handle null values in user response"

# Documentation update
git commit -m "docs: update API endpoint documentation for v2"

# Performance improvement
git commit -m "perf(database): add index on users.email for faster lookups"

# Breaking change (note the !)
git commit -m "feat(api)!: rename /user endpoint to /users

BREAKING CHANGE: The user endpoint path has changed from /user to /users.
Update all API clients accordingly."

# Multi-line with details
git commit -m "fix(auth): resolve token expiration edge case

- Update token refresh logic to check expiration before use
- Add validation for expired tokens at middleware level
- Improve error messages for authentication failures

Closes #123
Relates to #456"
```

## Atomic Commits

### What Makes a Commit Atomic

✅ **A good atomic commit:**
- Contains ONE logical change
- All tests pass after the commit
- Can be reverted independently
- Has a clear, single purpose
- Compiles/builds successfully

❌ **Not atomic:**
- Multiple unrelated changes
- Partial implementation
- Commented-out code
- Debug statements
- Mixed refactoring and features

### Examples

**❌ BAD - Non-atomic commit:**
```bash
git add .
git commit -m "updates"

# Contains:
# - New user authentication feature
# - Unrelated bug fix in payments
# - Reformatting of comments
# - Debug console.logs
# - Dependency updates
```

**✅ GOOD - Atomic commits:**
```bash
# Commit 1: Infrastructure change
git add package.json package-lock.json
git commit -m "build: update bcrypt to v5.1.1 for security patch"

# Commit 2: Implementation
git add src/auth/password.js src/auth/password.test.js
git commit -m "feat(auth): add password hashing with bcrypt

- Implement hash() and verify() functions
- Add unit tests for password operations
- Use cost factor of 12 for optimal security/performance"

# Commit 3: Integration
git add src/models/user.js src/middleware/auth.js
git commit -m "feat(auth): integrate password hashing in user model

- Hash password on user creation
- Hash password on password update
- Verify password in authentication middleware"
```

## Commit Message Guidelines

### Subject Line Rules

1. **Limit to 50 characters** (hard limit: 72)
2. **Use imperative mood** - "add feature" not "added feature"
3. **No period at end**
4. **Capitalize first letter** (unless using conventional commits)
5. **Be specific and descriptive**

**✅ Good subject lines:**
```
feat(auth): add password reset functionality
fix(api): prevent null pointer in user lookup
docs: update contribution guidelines
perf(db): optimize user query with indexes
```

**❌ Bad subject lines:**
```
fixed stuff
updates
WIP
asdfasdf
minor changes
bug fix
```

### Body Guidelines

1. **Wrap at 72 characters**
2. **Explain what and why, not how**
3. **Use bullet points for multiple changes**
4. **Reference issues and PRs**

**Example:**
```
fix(payments): resolve race condition in transaction processing

Previously, concurrent payment requests could result in duplicate
charges when processing transactions simultaneously. This occurred
because the transaction lock was released before the database
write completed.

Changes:
- Extend transaction lock until database commit finishes
- Add unique constraint on transaction_id in database
- Implement retry logic with exponential backoff

This fix ensures that duplicate transactions are caught at both
the application and database levels.

Closes #789
Relates to #654
```

### Footer Conventions

```bash
# Close issues
Closes #123
Fixes #456
Resolves #789

# Reference related issues
Relates to #321
See also #654

# Mark breaking changes
BREAKING CHANGE: Authentication now requires API version header.
All requests must include 'X-API-Version: 2' header.

# Reviewed by
Reviewed-by: John Doe <john@example.com>

# Co-authored by
Co-authored-by: Jane Smith <jane@example.com>
```

## Commit Hygiene

### Before Committing

```bash
# Review what you're committing
git status
git diff
git diff --staged

# Use interactive add for precise staging
git add -p  # Patch mode

# Verify no debug code
grep -r "console.log" src/
grep -r "debugger" src/
grep -r "TODO" src/

# Run tests
npm test

# Run linters
npm run lint
```

### Commit Message Templates

Create `~/.gitmessage`:
```
<type>(<scope>): <subject>

# Body: Explain what and why (not how)
#
# -
# -

# Footer: Reference issues
# Closes #
# BREAKING CHANGE:

# Type: feat, fix, docs, style, refactor, perf, test, build, ci, chore
# Scope: auth, api, database, ui, etc.
# Subject: imperative mood, no period, < 50 chars
# Body: wrap at 72 chars
```

Configure Git to use template:
```bash
git config --global commit.template ~/.gitmessage
```

### Commit Message Linting

**Setup commitlint:**
```bash
# Install
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Configure
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

# Add to husky pre-commit hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

**Example .commitlintrc.json:**
```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "feat", "fix", "docs", "style", "refactor",
        "perf", "test", "build", "ci", "chore", "revert"
      ]
    ],
    "subject-max-length": [2, "always", 50],
    "body-max-line-length": [2, "always", 72]
  }
}
```

## Semantic Versioning from Commits

### Version Bumping Rules

```bash
# MAJOR version (1.0.0 → 2.0.0)
feat(api)!: change authentication method
BREAKING CHANGE: Removed support for API keys

# MINOR version (1.0.0 → 1.1.0)
feat(auth): add OAuth2 support

# PATCH version (1.0.0 → 1.0.1)
fix(api): handle edge case in date parsing
```

### Automated Changelog Generation

**Using standard-version:**
```bash
# Install
npm install --save-dev standard-version

# Add npm script
"scripts": {
  "release": "standard-version"
}

# Create release
npm run release  # Analyzes commits, bumps version, generates CHANGELOG

# First release
npm run release -- --first-release
```

**CHANGELOG.md output:**
```markdown
# Changelog

## [2.0.0] - 2025-01-15

### ⚠ BREAKING CHANGES

* **api:** authentication now requires OAuth2 tokens

### Features

* **auth:** add OAuth2 support ([abc1234](link))
* **api:** add rate limiting middleware ([def5678](link))

### Bug Fixes

* **database:** fix connection pool exhaustion ([ghi9012](link))

## [1.1.0] - 2025-01-10

### Features

* **ui:** add dark mode toggle ([jkl3456](link))
```

## Quick Reference

```bash
# Good commit workflow
git add -p              # Selectively stage changes
git diff --staged       # Review staged changes
git commit              # Opens editor with template
# Write clear commit message following conventions
git log --oneline -5    # Verify commit looks good

# Amend last commit (if not pushed)
git commit --amend

# Split a large commit
git reset HEAD~1        # Undo commit, keep changes
git add -p              # Stage changes selectively
git commit -m "feat: first logical change"
git add -p
git commit -m "feat: second logical change"

# Combine commits (interactive rebase)
git rebase -i HEAD~3
# Mark commits as 'squash' or 'fixup'
```
