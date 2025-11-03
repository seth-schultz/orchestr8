# Orchestr8 Release Scripts

## Overview

This directory contains automation scripts for managing releases of the orchestr8 plugin.

## Release Process

### Automated Release (Recommended)

Use the `release.sh` script to automate the entire release process:

```bash
./scripts/release.sh <version>
```

**Example:**
```bash
./scripts/release.sh 2.2.1
```

### What the Script Does

The release script handles all aspects of creating a release:

1. **Validates version format** (X.Y.Z semantic versioning)
2. **Checks git status** (ensures working directory is clean)
3. **Updates all version files:**
   - `.claude/VERSION`
   - `.claude/plugin.json`
   - `.claude-plugin/marketplace.json` (both version fields)
4. **Verifies all versions match** (prevents version mismatch errors)
5. **Extracts release notes** from `CHANGELOG.md`
6. **Shows preview** of release notes for review
7. **Creates git commit** with standardized message
8. **Creates annotated git tag**
9. **Pushes to remote** (with confirmation prompt)
10. **Creates GitHub release** (with confirmation prompt)

### Prerequisites

**Required:**
- `bash` - Shell script interpreter
- `git` - Version control
- Write access to the repository

**Optional but recommended:**
- `jq` - For JSON manipulation (version file updates)
- `gh` - GitHub CLI (for creating GitHub releases)

Install optional tools:
```bash
# macOS
brew install jq gh

# Ubuntu/Debian
sudo apt-get install jq gh

# Other platforms
# See: https://stedolan.github.io/jq/download/
# See: https://cli.github.com/manual/installation
```

### Release Checklist

Before running the release script:

1. **Update CHANGELOG.md**
   ```markdown
   ## [X.Y.Z] - YYYY-MM-DD

   ### 🎯 Feature Category

   **Feature Description:**
   - ✅ Change 1
   - ✅ Change 2
   ```

2. **Commit all changes**
   ```bash
   git add .
   git commit -m "feat: description of changes"
   ```

3. **Ensure you're on main branch**
   ```bash
   git checkout main
   git pull origin main
   ```

4. **Run release script**
   ```bash
   ./scripts/release.sh 2.2.1
   ```

5. **Verify release**
   - Check GitHub releases page
   - Test plugin installation
   - Announce release (if applicable)

### Manual Release (Not Recommended)

If you need to create a release manually:

```bash
# 1. Update version files
echo "2.2.1" > .claude/VERSION
jq '.version = "2.2.1"' .claude/plugin.json > tmp.json && mv tmp.json .claude/plugin.json
jq '.metadata.version = "2.2.1" | .plugins[0].version = "2.2.1"' .claude-plugin/marketplace.json > tmp.json && mv tmp.json .claude-plugin/marketplace.json

# 2. Verify versions match
cat .claude/VERSION
jq -r '.version' .claude/plugin.json
jq -r '.metadata.version' .claude-plugin/marketplace.json
jq -r '.plugins[0].version' .claude-plugin/marketplace.json

# 3. Update CHANGELOG.md manually

# 4. Commit changes
git add .claude/VERSION .claude/plugin.json .claude-plugin/marketplace.json .claude/CHANGELOG.md
git commit -m "release: v2.2.1"

# 5. Create tag
git tag -a v2.2.1 -m "Release v2.2.1"

# 6. Push
git push origin main
git push origin v2.2.1

# 7. Create GitHub release
gh release create v2.2.1 --title "v2.2.1" --notes-file <(sed -n '/^## \[2\.2\.1\]/,/^## \[/p' .claude/CHANGELOG.md | sed '1d;$d')
```

**Why not manual?** Manual releases are error-prone:
- Version mismatches between files
- Inconsistent commit messages
- Forgetting to update marketplace.json
- Release note extraction errors
- Skipped validation steps

The automated script prevents these issues.

## Troubleshooting

### "jq not installed"

The script will warn but continue. Version files won't be automatically updated. Install jq:
```bash
brew install jq  # macOS
sudo apt-get install jq  # Ubuntu
```

### "gh not installed"

The script will skip GitHub release creation. Install gh:
```bash
brew install gh  # macOS
gh auth login  # Authenticate
```

### "Working directory not clean"

Commit or stash your changes:
```bash
git status
git add .
git commit -m "..."
# Or
git stash
```

### "Version not found in CHANGELOG.md"

Update CHANGELOG.md first:
```markdown
## [X.Y.Z] - YYYY-MM-DD

### Changes
...
```

### "Not on main branch"

Switch to main:
```bash
git checkout main
git pull origin main
```

The script allows continuing anyway (with confirmation).

## CI/CD Integration

The `.github/workflows/release.yml` workflow automatically runs when a tag matching `v*.*.*` is pushed:

1. **Validates release:**
   - Tag matches VERSION file
   - All version files match
   - CHANGELOG.md has entry for this version

2. **Extracts release notes:**
   - Uses same logic as release.sh
   - Ensures consistent release note formatting

3. **Creates GitHub release:**
   - Publishes release
   - Attaches release notes

**The workflow is automatically triggered when you push a tag via the release script.**

## Version Format

Always use semantic versioning: `MAJOR.MINOR.PATCH`

- **MAJOR:** Breaking changes
- **MINOR:** New features (backward-compatible)
- **PATCH:** Bug fixes (backward-compatible)

Examples:
- `2.2.1` - Patch release
- `2.3.0` - Minor release (new features)
- `3.0.0` - Major release (breaking changes)

## Support

For issues with the release process:

1. Check this README
2. Review `.github/workflows/release.yml`
3. Examine the release.sh script
4. Open an issue: https://github.com/seth-schultz/orchestr8/issues
