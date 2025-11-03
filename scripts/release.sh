#!/bin/bash

# Release script for orchestr8 plugin
# Usage: ./scripts/release.sh <version>
# Example: ./scripts/release.sh 2.2.1

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
error() {
    echo -e "${RED}ERROR: $1${NC}" >&2
    exit 1
}

success() {
    echo -e "${GREEN}✓ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

info() {
    echo -e "$1"
}

# Check if version provided
if [ -z "$1" ]; then
    error "Version number required. Usage: ./scripts/release.sh <version>"
fi

VERSION="$1"
TAG="v$VERSION"

info "================================"
info "Orchestr8 Release Script"
info "Version: $VERSION"
info "Tag: $TAG"
info "================================"
info ""

# Step 1: Validate version format
info "[1/10] Validating version format..."
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    error "Invalid version format. Expected: X.Y.Z (e.g., 2.2.1)"
fi
success "Version format valid"

# Step 2: Check git status
info "[2/10] Checking git status..."
if [[ -n $(git status -s) ]]; then
    error "Working directory not clean. Commit or stash changes first."
fi
success "Working directory clean"

# Step 3: Check if on main branch
info "[3/10] Checking current branch..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    warn "Not on main branch (current: $CURRENT_BRANCH)"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
success "Branch check complete"

# Step 4: Update VERSION files
info "[4/10] Updating version files..."

# Update .claude/VERSION
echo "$VERSION" > .claude/VERSION
success "Updated .claude/VERSION"

# Update .claude/plugin.json
if command -v jq &> /dev/null; then
    jq ".version = \"$VERSION\"" .claude/plugin.json > .claude/plugin.json.tmp && mv .claude/plugin.json.tmp .claude/plugin.json
    success "Updated .claude/plugin.json"
else
    warn "jq not installed, skipping plugin.json update (manual edit required)"
fi

# Update .claude-plugin/marketplace.json
if command -v jq &> /dev/null; then
    jq ".metadata.version = \"$VERSION\" | .plugins[0].version = \"$VERSION\"" .claude-plugin/marketplace.json > .claude-plugin/marketplace.json.tmp && mv .claude-plugin/marketplace.json.tmp .claude-plugin/marketplace.json
    success "Updated .claude-plugin/marketplace.json"
else
    warn "jq not installed, skipping marketplace.json update (manual edit required)"
fi

# Step 5: Verify all versions match
info "[5/10] Verifying all version files match..."
VERSION_FILE=$(cat .claude/VERSION | tr -d '\n')
if [ "$VERSION" != "$VERSION_FILE" ]; then
    error ".claude/VERSION mismatch: $VERSION_FILE"
fi

if command -v jq &> /dev/null; then
    PLUGIN_VERSION=$(jq -r '.version' .claude/plugin.json)
    MARKETPLACE_META=$(jq -r '.metadata.version' .claude-plugin/marketplace.json)
    MARKETPLACE_PLUGIN=$(jq -r '.plugins[0].version' .claude-plugin/marketplace.json)

    if [ "$VERSION" != "$PLUGIN_VERSION" ]; then
        error ".claude/plugin.json mismatch: $PLUGIN_VERSION"
    fi

    if [ "$VERSION" != "$MARKETPLACE_META" ]; then
        error ".claude-plugin/marketplace.json metadata.version mismatch: $MARKETPLACE_META"
    fi

    if [ "$VERSION" != "$MARKETPLACE_PLUGIN" ]; then
        error ".claude-plugin/marketplace.json plugins[0].version mismatch: $MARKETPLACE_PLUGIN"
    fi
fi
success "All version files match"

# Step 6: Extract release notes from CHANGELOG
info "[6/10] Extracting release notes from CHANGELOG..."

# Find line numbers for version headers
START_LINE=$(grep -n "^## \[$VERSION\]" .claude/CHANGELOG.md | cut -d: -f1)
if [ -z "$START_LINE" ]; then
    error "Version $VERSION not found in CHANGELOG.md"
fi

# Find the next version header
NEXT_LINE=$(awk "NR > $START_LINE && /^## \[/ {print NR; exit}" .claude/CHANGELOG.md)

if [ -z "$NEXT_LINE" ]; then
    # No next version, extract to end of file
    TOTAL_LINES=$(wc -l < .claude/CHANGELOG.md)
    END_LINE=$TOTAL_LINES
else
    END_LINE=$((NEXT_LINE - 1))
fi

# Extract release notes (skip the version header line)
EXTRACT_START=$((START_LINE + 1))
sed -n "${EXTRACT_START},${END_LINE}p" .claude/CHANGELOG.md > /tmp/release-notes-$VERSION.md

# Trim empty lines at start and end
sed -i.bak '/./,$!d' /tmp/release-notes-$VERSION.md  # Remove leading blank lines
sed -i.bak -e :a -e '/^\n*$/{$d;N;ba' -e '}' /tmp/release-notes-$VERSION.md  # Remove trailing blank lines

if [ ! -s /tmp/release-notes-$VERSION.md ]; then
    error "Could not extract release notes for version $VERSION"
fi

success "Release notes extracted"
info ""
info "Release notes preview:"
info "---"
head -15 /tmp/release-notes-$VERSION.md
info "..."
info "---"
info ""

# Step 7: Confirm release
read -p "Continue with release? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    info "Release cancelled"
    rm -f /tmp/release-notes-$VERSION.md
    exit 0
fi

# Step 8: Create git commit
info "[7/10] Creating git commit..."
git add .claude/VERSION .claude/plugin.json .claude-plugin/marketplace.json .claude/CHANGELOG.md
git commit -m "release: v$VERSION

Version bump to $VERSION

Updated files:
- .claude/VERSION: $VERSION
- .claude/plugin.json: $VERSION
- .claude-plugin/marketplace.json: $VERSION (both fields)

See CHANGELOG.md for full release notes.

🤖 Generated with [Claude Code](https://claude.com/claude-code)"

success "Commit created"

# Step 9: Create git tag
info "[8/10] Creating git tag..."
git tag -a "$TAG" -m "Release $TAG

$(cat /tmp/release-notes-$VERSION.md | head -30)"

success "Tag created: $TAG"

# Step 10: Push to remote
info "[9/10] Pushing to remote..."
read -p "Push commit and tag to origin? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin main
    git push origin "$TAG"
    success "Pushed to remote"
else
    warn "Skipped push to remote (remember to push manually: git push origin main && git push origin $TAG)"
fi

# Step 11: Create GitHub release
info "[10/10] Creating GitHub release..."
if command -v gh &> /dev/null; then
    read -p "Create GitHub release? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        gh release create "$TAG" \
            --title "$TAG - $(head -1 /tmp/release-notes-$VERSION.md | sed 's/^### *//')" \
            --notes-file /tmp/release-notes-$VERSION.md

        success "GitHub release created: https://github.com/seth-schultz/orchestr8/releases/tag/$TAG"
    else
        info "Skipped GitHub release creation"
    fi
else
    warn "gh CLI not installed, skipping GitHub release creation"
    info "Create manually at: https://github.com/seth-schultz/orchestr8/releases/new?tag=$TAG"
fi

# Cleanup
rm -f /tmp/release-notes-$VERSION.md

info ""
success "================================"
success "Release $VERSION complete!"
success "================================"
info ""
info "Next steps:"
info "  1. Verify release on GitHub: https://github.com/seth-schultz/orchestr8/releases"
info "  2. Test installation: cd /tmp && git clone https://github.com/seth-schultz/orchestr8.git .claude"
info "  3. Announce release (if applicable)"
