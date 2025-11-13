#!/bin/bash
# bump-version.sh - Bump version across all required files
# Usage: ./scripts/bump-version.sh <new-version>
#        ./scripts/bump-version.sh patch|minor|major (auto-increment)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# File paths
VERSION_FILE="$PROJECT_ROOT/VERSION"
PACKAGE_JSON="$PROJECT_ROOT/plugins/orchestr8/package.json"
PLUGIN_JSON="$PROJECT_ROOT/plugins/orchestr8/.claude-plugin/plugin.json"
MARKETPLACE_JSON="$PROJECT_ROOT/.claude-plugin/marketplace.json"

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required but not installed${NC}"
    echo "Install with: brew install jq (macOS) or apt-get install jq (Linux)"
    exit 1
fi

# Function to get current version
get_current_version() {
    cat "$VERSION_FILE" | tr -d '\n'
}

# Function to validate semantic version
validate_semver() {
    local version=$1
    if ! echo "$version" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*)?$'; then
        echo -e "${RED}Error: Version '$version' does not follow semantic versioning (X.Y.Z or X.Y.Z-prerelease)${NC}"
        exit 1
    fi
}

# Function to increment version
increment_version() {
    local version=$1
    local part=$2

    # Extract base version (without prerelease)
    local base_version=$(echo "$version" | sed 's/-.*$//')

    IFS='.' read -r major minor patch <<< "$base_version"

    case "$part" in
        major)
            major=$((major + 1))
            minor=0
            patch=0
            ;;
        minor)
            minor=$((minor + 1))
            patch=0
            ;;
        patch)
            patch=$((patch + 1))
            ;;
        *)
            echo -e "${RED}Error: Invalid increment type '$part'. Use: major, minor, or patch${NC}"
            exit 1
            ;;
    esac

    echo "$major.$minor.$patch"
}

# Check arguments
if [ $# -ne 1 ]; then
    echo "Usage: $0 <new-version>"
    echo "       $0 <patch|minor|major>"
    echo ""
    echo "Examples:"
    echo "  $0 8.0.5           # Set explicit version"
    echo "  $0 patch           # Increment patch version"
    echo "  $0 minor           # Increment minor version"
    echo "  $0 major           # Increment major version"
    exit 1
fi

NEW_VERSION=$1
CURRENT_VERSION=$(get_current_version)

# Check if we need to auto-increment
if [[ "$NEW_VERSION" =~ ^(major|minor|patch)$ ]]; then
    echo -e "${YELLOW}Current version: $CURRENT_VERSION${NC}"
    NEW_VERSION=$(increment_version "$CURRENT_VERSION" "$NEW_VERSION")
    echo -e "${YELLOW}New version: $NEW_VERSION${NC}"
fi

# Validate the new version
validate_semver "$NEW_VERSION"

# Confirm with user
echo ""
echo -e "${YELLOW}This will update version from $CURRENT_VERSION to $NEW_VERSION in:${NC}"
echo "  - $VERSION_FILE"
echo "  - $PACKAGE_JSON"
echo "  - $PLUGIN_JSON"
echo "  - $MARKETPLACE_JSON"
echo ""
read -p "Continue? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted"
    exit 0
fi

# Update VERSION file
echo -e "${GREEN}Updating VERSION file...${NC}"
echo "$NEW_VERSION" > "$VERSION_FILE"

# Update package.json
echo -e "${GREEN}Updating package.json...${NC}"
jq --arg version "$NEW_VERSION" '.version = $version' "$PACKAGE_JSON" > "$PACKAGE_JSON.tmp"
mv "$PACKAGE_JSON.tmp" "$PACKAGE_JSON"

# Update plugin.json
echo -e "${GREEN}Updating plugin.json...${NC}"
jq --arg version "$NEW_VERSION" '.version = $version' "$PLUGIN_JSON" > "$PLUGIN_JSON.tmp"
mv "$PLUGIN_JSON.tmp" "$PLUGIN_JSON"

# Update marketplace.json
echo -e "${GREEN}Updating marketplace.json...${NC}"
jq --arg version "$NEW_VERSION" '.version = $version' "$MARKETPLACE_JSON" > "$MARKETPLACE_JSON.tmp"
mv "$MARKETPLACE_JSON.tmp" "$MARKETPLACE_JSON"

# Verify all files match
echo ""
echo -e "${GREEN}Verifying version consistency...${NC}"
VERSION_FILE_VERSION=$(cat "$VERSION_FILE" | tr -d '\n')
PACKAGE_VERSION=$(jq -r '.version' "$PACKAGE_JSON")
PLUGIN_VERSION=$(jq -r '.version' "$PLUGIN_JSON")
MARKETPLACE_VERSION=$(jq -r '.version' "$MARKETPLACE_JSON")

echo "  VERSION file:      $VERSION_FILE_VERSION"
echo "  package.json:      $PACKAGE_VERSION"
echo "  plugin.json:       $PLUGIN_VERSION"
echo "  marketplace.json:  $MARKETPLACE_VERSION"

if [ "$VERSION_FILE_VERSION" = "$PACKAGE_VERSION" ] && \
   [ "$VERSION_FILE_VERSION" = "$PLUGIN_VERSION" ] && \
   [ "$VERSION_FILE_VERSION" = "$MARKETPLACE_VERSION" ]; then
    echo ""
    echo -e "${GREEN}✓ Version successfully updated to $NEW_VERSION${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Update CHANGELOG.md with release notes"
    echo "  2. Review changes: git diff"
    echo "  3. Commit: git add -A && git commit -m 'chore: Bump version to $NEW_VERSION'"
    echo "  4. Tag: git tag v$NEW_VERSION"
    echo "  5. Push: git push && git push --tags"
else
    echo ""
    echo -e "${RED}✗ Version mismatch detected! Manual intervention required.${NC}"
    exit 1
fi
