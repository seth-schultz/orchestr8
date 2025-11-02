# CI/CD Workflows

This directory contains GitHub Actions workflows for the orchestr8 plugin. The CI/CD system ensures quality, consistency, and automated releases.

## Workflows

### 1. CI (`ci.yml`)

**Triggers:** Push to `main`, Pull Requests
**Purpose:** Comprehensive quality validation

**Jobs:**
- **validate-structure** - Validates plugin directory structure, markdown syntax, YAML frontmatter
- **validate-versions** - Ensures all version files are consistent
- **validate-metadata** - Validates plugin.json and marketplace.json structure
- **security-scan** - Scans for secrets and malicious patterns using TruffleHog
- **validate-links** - Checks for broken links in documentation
- **all-checks-passed** - Summary job that depends on all others

**Quality Gates:**
- ✅ All markdown files have valid syntax
- ✅ All agents have required frontmatter (name, description)
- ✅ All workflows have required frontmatter (description)
- ✅ All version files match (.claude/VERSION, plugin.json, marketplace.json)
- ✅ Semantic versioning is followed (X.Y.Z)
- ✅ No secrets detected in codebase
- ✅ No broken links in documentation

### 2. Release (`release.yml`)

**Triggers:** Push of version tags (`v*.*.*`)
**Purpose:** Automated release creation and validation

**Jobs:**
- **validate-release** - Validates tag matches all version files
- **extract-release-notes** - Extracts release notes from CHANGELOG.md
- **create-release** - Creates GitHub release with notes
- **notify-success** - Logs release URL and installation instructions

**Release Process:**
1. Tag must match `.claude/VERSION` exactly
2. All version files must be consistent
3. CHANGELOG.md must have entry for this version
4. Release notes are extracted from CHANGELOG
5. GitHub release is created with comprehensive notes

**Example:**
```bash
git tag -a v1.5.0 -m "Release v1.5.0"
git push origin v1.5.0
# Workflow automatically creates GitHub release
```

### 3. PR Quality Gates (`pr-checks.yml`)

**Triggers:** Pull request opened, synchronized, or reopened
**Purpose:** Validate PR quality before merge

**Jobs:**
- **pr-validation** - Validates PR title (conventional commits) and description
- **detect-changes** - Detects which files changed (agents, workflows, docs, config, versions)
- **validate-agents** - Validates new/modified agent files
- **validate-workflows** - Validates new/modified workflow files
- **validate-version-change** - Ensures version consistency if versions changed
- **pr-comment** - Posts validation summary as PR comment

**PR Title Format:**
Must follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: add new agent`
- `fix: correct version mismatch`
- `docs: update README`
- `refactor: reorganize agents`
- `test: add validation tests`
- `chore: update dependencies`
- `release: v1.5.0 - Feature Summary`

**PR Description:**
- Minimum 20 characters
- Should describe what changed and why

## Configuration Files

### `.markdownlint.json`

Markdown linting configuration that allows:
- Long lines (MD013: false) - documentation can have long lines
- HTML in markdown (MD033: false) - for badges and special formatting
- No first heading requirement (MD041: false)
- Duplicate headings allowed if not siblings (MD024)
- Code blocks without language (MD040: false)

### `.github/markdown-link-check.json`

Link validation configuration:
- Ignores localhost links
- Ignores Claude.ai links (login required)
- Retries on 429 (rate limiting)
- 3 retry attempts with 30s delay

## Version Consistency

All workflows enforce version consistency across:
1. `.claude/VERSION` - Primary version file
2. `.claude/plugin.json` - Plugin metadata (`version` field)
3. `.claude-plugin/marketplace.json` - Marketplace metadata (`metadata.version`)
4. `.claude-plugin/marketplace.json` - Plugin entry (`plugins[0].version`)

**All four must match exactly** or CI will fail.

## Security Scanning

### TruffleHog
Scans for:
- API keys, tokens, secrets
- Private keys, certificates
- Database credentials
- Cloud provider credentials (AWS, Azure, GCP)

### Pattern Scanning
Checks for potentially malicious patterns:
- `eval()` usage
- `exec()` usage
- Suspicious scripts

## Release Checklist

Before creating a release tag, ensure:

- [ ] All version files updated to same version
- [ ] CHANGELOG.md has entry for new version
- [ ] README.md updated with accurate agent/workflow counts
- [ ] All changes committed
- [ ] CI checks passing on main branch

Then:
```bash
# Update versions (example for v1.5.0)
echo "1.5.0" > .claude/VERSION
# Edit .claude/plugin.json - set version to "1.5.0"
# Edit .claude-plugin/marketplace.json - set both version fields to "1.5.0"
# Update CHANGELOG.md - add "## [1.5.0] - YYYY-MM-DD"
# Update README.md - update agent/workflow counts

# Commit
git add .claude/VERSION .claude/plugin.json .claude-plugin/marketplace.json .claude/CHANGELOG.md README.md
git commit -m "release: v1.5.0 - Feature Summary"
git push origin main

# Tag and push
git tag -a v1.5.0 -m "Release v1.5.0 - Feature Summary"
git push origin v1.5.0

# GitHub Actions will automatically create the release
```

## Troubleshooting

### CI Failing: Version Mismatch
**Problem:** Different versions in VERSION, plugin.json, or marketplace.json
**Solution:** Update all four version locations to match exactly

### CI Failing: Missing CHANGELOG Entry
**Problem:** Tagged version but forgot to update CHANGELOG
**Solution:** Update CHANGELOG.md with entry for this version, amend commit, force-push tag

### CI Failing: Markdown Linting
**Problem:** Markdown syntax errors
**Solution:** Run `npx markdownlint '**/*.md' --fix` locally to auto-fix

### CI Failing: Broken Links
**Problem:** Documentation has broken links
**Solution:** Run `npx markdown-link-check README.md` locally to identify broken links

### Release Not Created
**Problem:** Pushed tag but no release appeared
**Solution:** Check Actions tab for errors. Ensure tag format is `vX.Y.Z` (with 'v' prefix)

### PR Checks Not Running
**Problem:** PR checks workflow not triggering
**Solution:** Ensure PR is targeting `main` branch. Check workflow file syntax.

## Local Testing

### Test Markdown Linting
```bash
npm install -g markdownlint-cli
markdownlint '**/*.md' --config .markdownlint.json
```

### Test Link Checking
```bash
npm install -g markdown-link-check
markdown-link-check README.md --config .github/markdown-link-check.json
```

### Test Version Consistency
```bash
# Install jq
brew install jq  # macOS
# or
sudo apt-get install jq  # Linux

# Check versions
VERSION_FILE=$(cat .claude/VERSION | tr -d '\n')
PLUGIN_VERSION=$(jq -r '.version' .claude/plugin.json)
MARKETPLACE_META=$(jq -r '.metadata.version' .claude-plugin/marketplace.json)
MARKETPLACE_PLUGIN=$(jq -r '.plugins[0].version' .claude-plugin/marketplace.json)

echo "VERSION: $VERSION_FILE"
echo "plugin.json: $PLUGIN_VERSION"
echo "marketplace (meta): $MARKETPLACE_META"
echo "marketplace (plugin): $MARKETPLACE_PLUGIN"

# All should match
```

### Test Secret Scanning
```bash
# Install TruffleHog
brew install trufflesecurity/trufflehog/trufflehog  # macOS
# or
docker pull trufflesecurity/trufflehog:latest

# Scan repository
trufflehog filesystem . --no-update
```

## Workflow Badges

Add to README.md:

```markdown
[![CI](https://github.com/seth-schultz/orchestr8/actions/workflows/ci.yml/badge.svg)](https://github.com/seth-schultz/orchestr8/actions/workflows/ci.yml)
[![Release](https://github.com/seth-schultz/orchestr8/actions/workflows/release.yml/badge.svg)](https://github.com/seth-schultz/orchestr8/actions/workflows/release.yml)
```

## Best Practices

1. **Never skip CI checks** - They catch real issues
2. **Test locally first** - Run linting and validation before pushing
3. **Keep versions in sync** - Use the version sync checklist
4. **Write good PR descriptions** - Helps reviewers and future maintainers
5. **Follow conventional commits** - Enables automatic changelog generation
6. **Update CHANGELOG for every release** - Required for automated releases
7. **Review workflow runs** - Check Actions tab after pushing

## Security

- Never commit secrets or API keys
- TruffleHog scans every commit
- Secrets should be stored in GitHub Secrets
- Use environment variables for sensitive data
- Review security scan results carefully

## Maintenance

### Updating Workflows

1. Edit workflow files in `.github/workflows/`
2. Test changes on a feature branch first
3. Create PR to review workflow changes
4. Merge after verification

### Updating Dependencies

Workflows use GitHub Actions from marketplace:
- `actions/checkout@v4` - Checkout code
- `actions/setup-node@v4` - Setup Node.js
- `actions/upload-artifact@v4` - Upload artifacts
- `actions/download-artifact@v4` - Download artifacts
- `softprops/action-gh-release@v1` - Create releases
- `trufflesecurity/trufflehog@main` - Secret scanning
- `amannn/action-semantic-pull-request@v5` - PR validation
- `dorny/paths-filter@v2` - Detect file changes

Update versions periodically by changing `@vX` to newer version.

## Support

For issues with CI/CD workflows:
1. Check [Actions](https://github.com/seth-schultz/orchestr8/actions) tab for logs
2. Review this documentation
3. Open issue with workflow run URL
4. Tag with `ci-cd` label
