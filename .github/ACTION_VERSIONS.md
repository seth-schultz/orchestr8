# GitHub Actions Version Reference

This document tracks all GitHub Actions used in our workflows with their SHA-pinned versions for security and reproducibility.

**Last Updated:** 2025-11-09

## Why SHA Pinning?

Per [OpenSSF Scorecard](https://github.com/ossf/scorecard) security best practices, all GitHub Actions should be pinned to specific SHA commits rather than tags to prevent:

1. **Supply chain attacks** - Tags can be moved to point to malicious code
2. **Unexpected breaking changes** - Actions can change behavior under the same tag
3. **Reproducibility issues** - Same workflow may behave differently over time

## Action Version Mapping

### Core GitHub Actions

| Action | Version Tag | SHA Commit | Last Verified |
|--------|-------------|------------|---------------|
| `actions/checkout` | v4.2.2 | `11bd71901bbe5b1630ceea73d27597364c9af683` | 2025-11-09 |
| `actions/setup-node` | v4.1.0 | `39370e3970a6d050c480ffad4ff0ed4d3fdee5af` | 2025-11-09 |
| `actions/upload-artifact` | v4.5.0 | `6f51ac03b9356f520e9adb1b1b7802705f340c2b` | 2025-11-09 |
| `actions/download-artifact` | v4.1.8 | `fa0a91b85d4f404e444e00e005971372dc801d16` | 2025-11-09 |
| `actions/github-script` | v7.0.1 | `60a0d83039c74a4aee543508d2ffcb1c3799cdea` | 2025-11-09 |
| `actions/create-release` | v1.1.4 | `0cb9c9b65d5d1901c1f53e5e66eaf4afd303e70e` | 2025-11-09 |
| `actions/upload-release-asset` | v1.0.2 | `e8f9f06c4b078e705bd2ea027f0926603fc9b4d5` | 2025-11-09 |

### Path Filtering

| Action | Version Tag | SHA Commit | Last Verified |
|--------|-------------|------------|---------------|
| `dorny/paths-filter` | v2.12.0 | `de90cc6fb38fc0963ad72b210f1f284cd68cea36` | 2025-11-09 |

### PR Validation

| Action | Version Tag | SHA Commit | Last Verified |
|--------|-------------|------------|---------------|
| `amannn/action-semantic-pull-request` | v5.5.3 | `0723387faaf9b38adef4775cd42cfd5155ed6017` | 2025-11-09 |

### Security Actions

| Action | Version Tag | SHA Commit | Last Verified |
|--------|-------------|------------|---------------|
| `trufflesecurity/trufflehog` | main | `fca954587c60352120abcd6c5a6958fc809f575d` | 2025-11-09 |
| `gitleaks/gitleaks-action` | v2.3.6 | `44c470ffc35caa8b1eb3e8012ca53c2f9bea4eb5` | 2025-11-09 |

### CodeQL Actions

| Action | Version Tag | SHA Commit | Last Verified |
|--------|-------------|------------|---------------|
| `github/codeql-action/init` | v3.27.9 | `df409f7d9260372bd5f19e5b04e83cb3c43714ae` | 2025-11-09 |
| `github/codeql-action/analyze` | v3.27.9 | `df409f7d9260372bd5f19e5b04e83cb3c43714ae` | 2025-11-09 |
| `github/codeql-action/upload-sarif` | v3.27.9 | `df409f7d9260372bd5f19e5b04e83cb3c43714ae` | 2025-11-09 |

### Dependency Security

| Action | Version Tag | SHA Commit | Last Verified |
|--------|-------------|------------|---------------|
| `actions/dependency-review-action` | v4.4.0 | `5a2ce3f5b92ee19cbb1541a4984c76d921601d7c` | 2025-11-09 |
| `ossf/scorecard-action` | v2.4.0 | `62b2cac7ed8198b15735ed49ab1e5cf35480ba46` | 2025-11-09 |

### Release Management

| Action | Version Tag | SHA Commit | Last Verified |
|--------|-------------|------------|---------------|
| `softprops/action-gh-release` | v1.0.0 | `c062e08bd532815e2082a85e87e3ef29c3e6d191` | 2025-11-09 |

## Workflow Files Using These Actions

- `.github/workflows/ci.yml` - CI pipeline for validation and testing
- `.github/workflows/pr-checks.yml` - PR quality gates and validation
- `.github/workflows/release.yml` - Release automation
- `.github/workflows/security.yml` - Security scanning (CodeQL, Scorecard, etc.)
- `.github/workflows/license-check.yml` - License compliance and SBOM generation
- `.github/workflows/sign-release.yml` - Code signing and release verification

## Updating Actions

When updating an action to a newer version:

1. **Check the release notes** for breaking changes
2. **Find the commit SHA** for the new version tag:
   ```bash
   # For most actions
   gh api /repos/{owner}/{repo}/git/ref/tags/{version}
   
   # Example
   gh api /repos/actions/checkout/git/ref/tags/v4.2.2
   ```
3. **Update the SHA** in the workflow file with a comment indicating the version
4. **Update this document** with the new SHA and verification date
5. **Test the workflow** to ensure it works as expected

## Security Notes

- All actions are pinned to specific SHA commits
- SHAs are verified against official repositories
- Comments in workflow files indicate the human-readable version
- Regular security audits should verify these SHAs haven't been compromised

## Verification

To verify an action SHA matches its version tag:

```bash
# Get the SHA for a tag
gh api /repos/actions/checkout/git/ref/tags/v4.2.2 | jq -r '.object.sha'

# Compare with what's in the workflow
grep "actions/checkout@" .github/workflows/*.yml
```

## Resources

- [OpenSSF Scorecard Documentation](https://github.com/ossf/scorecard)
- [GitHub Actions Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Dependabot for Actions](https://docs.github.com/en/code-security/dependabot/working-with-dependabot/keeping-your-actions-up-to-date-with-dependabot)
