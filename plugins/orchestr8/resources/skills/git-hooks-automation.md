---
id: git-hooks-automation
category: skill
tags: [git, hooks, pre-commit, post-commit, automation, linting, testing, husky]
capabilities:
  - Git hooks implementation
  - Pre-commit hook automation
  - Post-commit notifications
  - Commit message validation
  - Code quality enforcement
  - Pre-push testing
  - Hook management with Husky
useWhen:
  - Setting up automated code quality checks
  - Enforcing commit message standards
  - Running tests before commits/pushes
  - Preventing commits with errors
  - Automating code formatting
  - Implementing pre-commit linting
  - Scanning for secrets before commit
relatedResources:
  - orchestr8://agents/git-expert
  - orchestr8://skills/git-commit-best-practices
  - orchestr8://skills/cicd-pipeline-optimization
  - orchestr8://examples/git-hooks-implementations
estimatedTokens: 880
---

# Git Hooks Automation

## Hook Types Overview

```bash
# Client-side hooks (local repository)
pre-commit        # Before commit is created
prepare-commit-msg # Before commit message editor
commit-msg        # After commit message entered
post-commit       # After commit is created
pre-push          # Before push to remote
pre-rebase        # Before rebase operation
post-checkout     # After checkout
post-merge        # After merge completes

# Server-side hooks (remote repository)
pre-receive       # Before refs are updated
update            # Once per branch being updated
post-receive      # After refs are updated
```

## Pre-Commit Hook

### Manual Installation

Create `.git/hooks/pre-commit`:
```bash
#!/bin/sh

echo "Running pre-commit checks..."

# Run linter
echo "→ Running linter..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Commit aborted."
  exit 1
fi

# Run tests
echo "→ Running tests..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Commit aborted."
  exit 1
fi

# Check for console.log statements
echo "→ Checking for debug statements..."
if git diff --cached | grep -E "console\.(log|debug|info)"; then
  echo "❌ Found console.log statements. Please remove them."
  exit 1
fi

# Check for TODOs
echo "→ Checking for TODOs..."
if git diff --cached | grep -i "TODO"; then
  echo "⚠️  Found TODO comments. Consider creating an issue."
  # Non-blocking warning
fi

echo "✅ Pre-commit checks passed!"
exit 0
```

Make executable:
```bash
chmod +x .git/hooks/pre-commit
```

### Using pre-commit Framework

**Installation:**
```bash
# Install pre-commit
pip install pre-commit

# Or with homebrew
brew install pre-commit

# Verify installation
pre-commit --version
```

**Configuration (.pre-commit-config.yaml):**
```yaml
repos:
  # General file checks
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-added-large-files
        args: ['--maxkb=500']
      - id: check-case-conflict
      - id: check-merge-conflict
      - id: detect-private-key
      - id: no-commit-to-branch
        args: ['--branch', 'main', '--branch', 'production']

  # JavaScript/TypeScript
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.56.0
    hooks:
      - id: eslint
        files: \.(js|ts|tsx)$
        additional_dependencies:
          - eslint@8.56.0
          - '@typescript-eslint/parser@6.19.0'

  # Python
  - repo: https://github.com/psf/black
    rev: 23.12.1
    hooks:
      - id: black
        language_version: python3.11

  - repo: https://github.com/pycqa/flake8
    rev: 7.0.0
    hooks:
      - id: flake8

  # Secret detection
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']

  # Commit message linting
  - repo: https://github.com/compilerla/conventional-pre-commit
    rev: v3.0.0
    hooks:
      - id: conventional-pre-commit
        stages: [commit-msg]

  # Custom local hooks
  - repo: local
    hooks:
      - id: npm-test
        name: Run npm tests
        entry: npm test
        language: system
        pass_filenames: false
        stages: [pre-push]
```

**Setup:**
```bash
# Install hooks
pre-commit install
pre-commit install --hook-type commit-msg
pre-commit install --hook-type pre-push

# Run on all files
pre-commit run --all-files

# Update hooks
pre-commit autoupdate

# Skip hooks for one commit
git commit --no-verify
```

## Husky Implementation

### Setup Husky

```bash
# Install
npm install --save-dev husky

# Initialize
npx husky-init
npm install

# Or manual setup
npx husky install
npm pkg set scripts.prepare="husky install"
```

### Pre-Commit Hook

```bash
# Create pre-commit hook
npx husky add .husky/pre-commit "npm run lint"
npx husky add .husky/pre-commit "npm test"
```

**.husky/pre-commit:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run prettier
echo "→ Formatting code..."
npm run format

# Stage formatted files
git add .

# Run ESLint
echo "→ Linting code..."
npm run lint

# Run type checking
echo "→ Type checking..."
npm run type-check

# Run tests on changed files
echo "→ Running tests..."
npm test -- --findRelatedTests $(git diff --cached --name-only --diff-filter=ACMRTUXB | grep -E '\.(js|jsx|ts|tsx)$' | tr '\n' ' ')

echo "✅ Pre-commit checks passed!"
```

### Commit Message Hook

```bash
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

**.husky/commit-msg:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Validate commit message format
npx --no -- commitlint --edit $1

# Check for WIP or FIXUP commits
if grep -qE "^(WIP|FIXUP|wip|fixup)" "$1"; then
  echo "❌ WIP/FIXUP commits are not allowed on this branch"
  exit 1
fi
```

### Pre-Push Hook

```bash
npx husky add .husky/pre-push "npm run test:ci"
```

**.husky/pre-push:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🚀 Running pre-push checks..."

# Get current branch
current_branch=$(git symbolic-ref --short HEAD)

# Prevent push to protected branches
if [ "$current_branch" = "main" ] || [ "$current_branch" = "production" ]; then
  echo "❌ Direct push to $current_branch is not allowed!"
  echo "Please use a pull request instead."
  exit 1
fi

# Run full test suite
echo "→ Running full test suite..."
npm run test:ci

# Check for vulnerabilities
echo "→ Checking for vulnerabilities..."
npm audit --audit-level=moderate

# Build check
echo "→ Verifying build..."
npm run build

echo "✅ Pre-push checks passed!"
```

## Lint-Staged Integration

### Setup

```bash
npm install --save-dev lint-staged
```

**package.json:**
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "git add"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write",
      "git add"
    ],
    "*.css": [
      "stylelint --fix",
      "prettier --write",
      "git add"
    ]
  }
}
```

**.husky/pre-commit with lint-staged:**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

## Secret Detection

### Using git-secrets

```bash
# Install (macOS)
brew install git-secrets

# Initialize in repository
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'password\s*=\s*["\047][^"\047]+'
git secrets --add 'api[_-]?key\s*=\s*["\047][^"\047]+'
git secrets --add '[0-9a-f]{32}'  # API tokens

# Scan
git secrets --scan
git secrets --scan-history
```

### Using GitLeaks

```bash
# Install
brew install gitleaks

# Scan staged changes
gitleaks protect --staged

# Scan entire history
gitleaks detect --source . --verbose
```

**Pre-commit with GitLeaks:**
```bash
#!/usr/bin/env sh
echo "🔒 Scanning for secrets..."
gitleaks protect --staged --verbose
if [ $? -ne 0 ]; then
  echo "❌ Secret detected! Commit aborted."
  echo "Remove sensitive data or use --no-verify to skip (not recommended)"
  exit 1
fi
```

## Advanced Patterns

### Conditional Hooks

```bash
#!/usr/bin/env sh

# Skip hooks in CI environment
if [ -n "$CI" ]; then
  echo "CI environment detected, skipping hooks"
  exit 0
fi

# Skip for merge commits
if git rev-parse -q --verify MERGE_HEAD; then
  echo "Merge commit detected, skipping hooks"
  exit 0
fi

# Run checks
npm run lint
```

### Parallel Hook Execution

```bash
#!/usr/bin/env sh

# Run multiple checks in parallel
pids=""

npm run lint &
pids="$pids $!"

npm run type-check &
pids="$pids $!"

npm run format:check &
pids="$pids $!"

# Wait for all background jobs
for pid in $pids; do
  wait $pid
  status=$?
  if [ $status -ne 0 ]; then
    echo "❌ One or more checks failed"
    exit $status
  fi
done

echo "✅ All checks passed"
```

### Hook Bypassing

```bash
# Bypass hooks for single commit
git commit --no-verify

# Bypass with alias
git config --global alias.yolo 'commit --no-verify'
git yolo -m "Quick fix"

# Team communication
# Create .git/hooks/pre-commit-msg to warn:
echo "⚠️  You're bypassing hooks! Use with caution."
```

## Package.json Scripts

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint src --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:ci": "jest --ci --coverage --maxWorkers=2",
    "test:related": "jest --findRelatedTests",
    "validate": "npm run lint && npm run type-check && npm test"
  }
}
```

## Troubleshooting

### Hook Not Running

```bash
# Check if hooks are installed
ls -la .git/hooks/

# Verify hook is executable
chmod +x .git/hooks/pre-commit

# Reinstall hooks
husky install
# or
pre-commit install
```

### Hook Fails in CI

```bash
# Skip hooks in CI
if [ "$CI" = "true" ]; then exit 0; fi

# Or use different logic
if [ -z "$CI" ]; then
  # Run expensive checks only locally
  npm run lint
fi
```

### Performance Issues

```bash
# Use lint-staged for only changed files
npx lint-staged

# Run tests only on related files
jest --findRelatedTests $(git diff --cached --name-only)

# Cache results
npm run lint -- --cache
```

## Best Practices

✅ **DO:**
- Keep hooks fast (< 10 seconds)
- Only check staged files (lint-staged)
- Provide clear error messages
- Allow bypass with `--no-verify` for emergencies
- Document hooks in README
- Version control hook configurations

❌ **DON'T:**
- Run full test suite in pre-commit (use pre-push)
- Block commits for warnings (only errors)
- Make hooks too strict initially
- Forget to make hooks executable
- Commit without testing hooks
