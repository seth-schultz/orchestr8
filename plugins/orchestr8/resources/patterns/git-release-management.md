---
id: git-release-management
category: pattern
tags: [git, release, versioning, semantic-versioning, changelog, git-tags, deployment, release-automation, semver, github-releases]
capabilities:
  - Semantic versioning strategy and automation
  - Git tag management and release branches
  - Automated changelog generation from commits
  - Release branch workflows and hotfix management
  - Version bumping and pre-release versioning
  - Release notes creation and distribution
useWhen:
  - Production release management requiring semantic versioning, git tags, automated changelog generation, and release branch coordination
  - Version tracking across multiple environments with promotion workflows from dev to staging to production with rollback capabilities
  - Changelog automation from conventional commit messages using tools like standard-version, release-please, or semantic-release
  - Breaking change communication requiring major version bumps, migration guides, deprecation notices, and backward compatibility documentation
  - Hotfix release workflows requiring patch version branches, emergency fixes, and fast-track deployment to production environments
  - Multi-version support scenarios maintaining LTS releases, security patches for older versions, and parallel version development streams
  - Monorepo versioning with independent package versions, coordinated releases, or unified versioning strategies across workspaces
  - Pre-release and beta version management with alpha, beta, rc tagging conventions and early access distribution channels
  - Release notes generation requiring PR aggregation, contributor attribution, breaking change highlights, and upgrade instructions
  - GitHub/GitLab release automation with artifact uploads, Docker image publishing, npm package releases, and deployment triggers
  - Version pinning in dependencies, infrastructure as code, and deployment manifests requiring consistent versioning across systems
  - Compliance and audit requirements needing version traceability, change documentation, and release approval workflows for regulated industries
  - Mobile app versioning with App Store and Play Store version codes, build numbers, and semantic version synchronization
  - API versioning coordination between code versions, API versions, and client compatibility with deprecation timelines
  - Release calendar management with scheduled releases, feature freezes, code cutoff dates, and stakeholder communication
relatedResources:
  - orchestr8://patterns/git-collaboration-workflow
  - orchestr8://patterns/git-monorepo-strategies
  - orchestr8://skills/git-workflow
  - orchestr8://workflows/workflow-deploy
  - orchestr8://agents/devops-expert-cicd
  - orchestr8://patterns/phased-delivery
  - orchestr8://skills/deployment-zero-downtime
  - orchestr8://skills/deployment-rollback-strategies
  - orchestr8://workflows/workflow-setup-cicd
  - orchestr8://skills/agile-scrum-practices
estimatedTokens: 980
---

# Git Release Management Pattern

## Overview

Git release management encompasses versioning strategies, tag management, changelog generation, and release branch workflows. Effective release management provides clear version history, enables rollbacks, communicates changes to users, and supports multiple release channels (stable, beta, LTS).

## When to Use This Pattern

Use structured release management when:
- Shipping software to production environments or end users
- Managing multiple versions simultaneously (LTS, stable, beta)
- Need to communicate changes clearly to stakeholders
- Supporting rollback and hotfix scenarios
- Coordinating releases across distributed teams

## Implementation

### Semantic Versioning (SemVer)

**Format**: `MAJOR.MINOR.PATCH` (e.g., `2.4.3`)

- **MAJOR**: Breaking changes (incompatible API changes)
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

**Pre-release**: `1.0.0-alpha.1`, `1.0.0-beta.2`, `1.0.0-rc.1`
**Build metadata**: `1.0.0+20240115.abc123`

```bash
# Version progression examples
1.0.0      # Initial stable release
1.0.1      # Bug fix (patch)
1.1.0      # New feature (minor)
2.0.0      # Breaking change (major)
2.0.0-beta.1  # Pre-release beta
2.0.0-rc.1    # Release candidate
```

### Release Branch Strategy

**GitFlow Approach** (Recommended for scheduled releases)
```bash
# Create release branch from develop
git checkout develop
git checkout -b release/2.1.0

# Version bump and changelog
npm version minor  # 2.0.5 -> 2.1.0
npm run changelog

# Commit version changes
git commit -am "chore(release): bump version to 2.1.0"

# Test release candidate
npm run test:e2e
npm run build

# Merge to main with tag
git checkout main
git merge --no-ff release/2.1.0
git tag -a v2.1.0 -m "Release version 2.1.0"

# Merge back to develop
git checkout develop
git merge --no-ff release/2.1.0

# Cleanup
git branch -d release/2.1.0
git push origin main develop --tags
```

**Trunk-Based Approach** (Recommended for continuous deployment)
```bash
# Tag directly from main
git checkout main
git pull origin main

# Automated version bump
npm run release  # Uses semantic-release

# Or manual
npm version patch  # 1.2.3 -> 1.2.4
git push --follow-tags

# Release automation triggers CI/CD
```

### Automated Changelog Generation

**Using Conventional Commits with standard-version**

```bash
# Install
npm install --save-dev standard-version

# package.json script
{
  "scripts": {
    "release": "standard-version",
    "release:minor": "standard-version --release-as minor",
    "release:major": "standard-version --release-as major",
    "release:patch": "standard-version --release-as patch"
  }
}

# Run release (analyzes commits, bumps version, generates changelog)
npm run release
```

**Generated CHANGELOG.md**:
```markdown
# Changelog

## [2.1.0](https://github.com/org/repo/compare/v2.0.0...v2.1.0) (2024-01-15)

### Features

* **auth**: add OAuth 2.0 support ([abc123](https://github.com/org/repo/commit/abc123))
* **api**: implement rate limiting ([def456](https://github.com/org/repo/commit/def456))

### Bug Fixes

* **db**: resolve connection pool leak ([ghi789](https://github.com/org/repo/commit/ghi789))
* **ui**: fix responsive layout on mobile ([jkl012](https://github.com/org/repo/commit/jkl012))

### BREAKING CHANGES

* **auth**: Session-based auth removed, migrate to JWT tokens
```

**Using semantic-release** (Fully automated)
```javascript
// .releaserc.json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    "@semantic-release/git"
  ]
}

// CI automatically:
// 1. Analyzes commits
// 2. Determines version bump
// 3. Generates changelog
// 4. Creates GitHub release
// 5. Publishes to npm
// 6. Commits changes back
```

### Git Tag Management

**Creating Annotated Tags**
```bash
# Annotated tag (recommended - includes metadata)
git tag -a v1.2.3 -m "Release version 1.2.3

- Added user authentication
- Fixed memory leak in background worker
- Updated dependencies"

# Lightweight tag (not recommended for releases)
git tag v1.2.3

# Push tags
git push origin v1.2.3
git push origin --tags  # All tags

# Sign tags for security
git tag -s v1.2.3 -m "Signed release 1.2.3"
```

**Tag Naming Conventions**
```bash
v1.2.3           # Standard release
v1.2.3-beta.1    # Beta release
v1.2.3-rc.2      # Release candidate
v1.2.3-alpha.4   # Alpha release
v2.0.0-lts       # LTS version marker
```

**Tag Management**
```bash
# List tags
git tag -l "v2.*"

# Delete tag locally and remotely
git tag -d v1.2.3
git push origin :refs/tags/v1.2.3

# Checkout specific version
git checkout v1.2.3

# Create branch from tag for hotfix
git checkout -b hotfix/1.2.4 v1.2.3
```

### Hotfix Workflow

```bash
# Critical bug in production v2.1.0
git checkout v2.1.0
git checkout -b hotfix/2.1.1

# Fix bug
git commit -m "fix(security): patch XSS vulnerability"

# Version bump (patch)
npm version patch  # 2.1.0 -> 2.1.1

# Update changelog
echo "## [2.1.1] - 2024-01-16
### Security
- Patched XSS vulnerability in user comments" >> CHANGELOG.md

git commit -am "chore(release): hotfix 2.1.1"

# Tag and merge to main
git checkout main
git merge --no-ff hotfix/2.1.1
git tag -a v2.1.1 -m "Hotfix: Security patch"

# Merge to develop
git checkout develop
git merge --no-ff hotfix/2.1.1

# Push
git push origin main develop --tags
```

## Examples

### Monorepo Independent Versioning

```bash
# Using Lerna or Changesets
npx lerna version --conventional-commits

# Updates package.json in changed packages
packages/auth:     1.2.0 -> 1.3.0
packages/api:      2.1.4 -> 2.1.5
packages/ui:       0.9.0 -> 1.0.0 (major)

# Generates individual changelogs
```

### GitHub Release Automation

```yaml
# .github/workflows/release.yml
name: Release
on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          generate_release_notes: true
          files: |
            dist/*.tar.gz
            dist/*.zip
          prerelease: ${{ contains(github.ref, 'beta') || contains(github.ref, 'alpha') }}
```

### Pre-release Workflow

```bash
# Create beta release
git checkout develop
npm version prerelease --preid=beta  # 1.2.3 -> 1.2.4-beta.0

# Or specify version
npm version 2.0.0-beta.1

# Tag and push
git tag -a v2.0.0-beta.1 -m "Beta release for testing"
git push --follow-tags

# Publish to npm with beta tag
npm publish --tag beta

# Users install via:
# npm install package@beta
```

## Trade-offs

### GitFlow vs Trunk-Based Releases

| Aspect | GitFlow | Trunk-Based |
|--------|---------|-------------|
| **Release Frequency** | Scheduled | Continuous |
| **Branch Complexity** | High (develop, release, hotfix) | Low (main only) |
| **QA Window** | Dedicated on release branch | Continuous in main |
| **Hotfix Process** | Separate branch from main | Tag and patch |
| **Best For** | Enterprise, scheduled releases | SaaS, rapid deployment |
| **Rollback** | Revert merge | Revert commit or deploy previous tag |

### Manual vs Automated Versioning

- **Manual**: Full control, but error-prone and time-consuming
- **Automated**: Consistent, fast, but requires disciplined commit messages

## Best Practices

1. **Use Semantic Versioning**: Communicate impact of changes clearly
2. **Automate Changelog**: Generate from conventional commits
3. **Sign Tags**: Use GPG signatures for release tags in secure environments
4. **Annotated Tags**: Always use `git tag -a` with descriptive messages
5. **Lock Versions**: Use lock files (package-lock.json, yarn.lock) in releases
6. **Release Notes**: Include upgrade instructions for breaking changes
7. **Version Everything**: Docker images, APIs, databases should track versions
8. **Keep CHANGELOG**: Maintain human-readable changelog alongside generated ones
9. **Pre-releases**: Use beta/alpha for early feedback before stable release
10. **LTS Support**: Define LTS policy and clearly mark supported versions

## When to Avoid

- **Internal-only tools**: Simple timestamp-based versioning may suffice
- **Continuous deployment without user impact**: Every commit can be a "release"
- **Proof-of-concept projects**: Versioning overhead not needed
