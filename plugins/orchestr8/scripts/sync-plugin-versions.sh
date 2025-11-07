#!/bin/bash

##############################################################################
# Sync Plugin Versions (v3.0)
#
# Purpose: Automatically synchronize version across ALL version locations
#
# This script ensures ALL version files stay synchronized with the primary
# version defined in VERSION (root). It updates:
# - VERSION (root - source of truth)
# - .claude-plugin/marketplace.json
# - plugins/orchestr8/.claude-plugin/plugin.json (plugin metadata)
#
# Usage:
#   ./sync-plugin-versions.sh              # Use version from VERSION file
#   ./sync-plugin-versions.sh 5.9.0        # Manually specify version
#
# Returns:
#   0 - Success (all versions synchronized)
#   1 - Error (version validation or file update failed)
#
# Architecture:
#   Plugin with agents in /agents/ directory
#   Plugin structure: plugins/orchestr8/
##############################################################################

# Don't exit on error - we'll handle errors explicitly
set +e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get version from argument or VERSION file
if [ -z "$1" ]; then
  if [ ! -f "VERSION" ]; then
    echo -e "${RED}❌ Error: VERSION file not found${NC}"
    echo "Usage: $0 [version]"
    exit 1
  fi
  VERSION=$(cat VERSION | tr -d '[:space:]')
else
  VERSION="$1"
fi

# Validate version format (semantic versioning)
if ! [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo -e "${RED}❌ Error: Invalid version format: $VERSION${NC}"
  echo "Expected format: MAJOR.MINOR.PATCH (e.g., 5.9.0)"
  exit 1
fi

echo -e "${BLUE}📋 Version Sync Script v3.0${NC}"
echo -e "${YELLOW}🔄 Synchronizing all version locations to $VERSION${NC}"
echo ""

# Track updated files
UPDATED_FILES=0
FAILED_FILES=0
FAILED_FILE_LIST=()

# Helper function to update a file
update_file() {
  local file_path="$1"
  local description="$2"
  local search_pattern="$3"

  if [ ! -f "$file_path" ]; then
    echo -e "${YELLOW}⊘ Skipped (not found): $description${NC}"
    return 0
  fi

  # macOS compatible sed (requires '' for in-place backup)
  sed -i '' "$search_pattern" "$file_path" 2>/dev/null
  local result=$?

  if [ $result -eq 0 ]; then
    echo -e "${GREEN}✓ Updated: $description${NC}"
    ((UPDATED_FILES++))
    return 0
  else
    echo -e "${RED}✗ Failed: $description${NC}"
    FAILED_FILE_LIST+=("$file_path")
    ((FAILED_FILES++))
    return 1
  fi
}

# 1. Update VERSION (source of truth)
if [ "$VERSION" != "$(cat VERSION | tr -d '[:space:]')" ]; then
  echo "Updating VERSION..."
  echo "$VERSION" > VERSION
  echo -e "${GREEN}✓ Updated: VERSION${NC}"
  ((UPDATED_FILES++))
else
  echo -e "${YELLOW}⊘ Already correct: VERSION${NC}"
fi

echo ""

# 2. Update .claude-plugin/marketplace.json
update_file ".claude-plugin/marketplace.json" \
  ".claude-plugin/marketplace.json" \
  "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$VERSION\"/g"

# 3. Update plugins/orchestr8/.claude-plugin/plugin.json
update_file "plugins/orchestr8/.claude-plugin/plugin.json" \
  "plugins/orchestr8/.claude-plugin/plugin.json" \
  "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"$VERSION\"/g"

# No additional files to update (MCP server removed)

echo ""

# Summary
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
if [ $FAILED_FILES -eq 0 ]; then
  echo -e "${GREEN}✅ All version files synchronized successfully!${NC}"
  echo ""
  echo "Summary:"
  echo -e "  Updated files: ${GREEN}$UPDATED_FILES${NC}"
  echo -e "  Failed files:  ${GREEN}0${NC}"
  echo ""
  echo "Version locations updated:"
  echo "  ✓ VERSION (root)"
  echo "  ✓ .claude-plugin/marketplace.json"
  echo "  ✓ plugins/orchestr8/.claude-plugin/plugin.json"
  echo ""
  echo "All versions now: ${GREEN}$VERSION${NC}"
  echo ""

  # Show what changed
  if [ -n "$(git diff --name-only 2>/dev/null)" ]; then
    echo "Changed files:"
    git diff --name-only | sed 's/^/  /'
    echo ""
  fi

  echo "Next steps:"
  echo "  1. Review: git diff"
  echo "  2. Stage:  git add ."
  echo "  3. Commit: git commit -m 'chore: bump version to $VERSION'"
  echo ""
else
  echo -e "${RED}❌ Version sync failed!${NC}"
  echo ""
  echo "Summary:"
  echo -e "  Updated files: ${GREEN}$UPDATED_FILES${NC}"
  echo -e "  Failed files:  ${RED}$FAILED_FILES${NC}"
  echo ""
  echo "Failed files:"
  for file in "${FAILED_FILE_LIST[@]}"; do
    echo -e "  ${RED}✗ $file${NC}"
  done
  echo ""
  exit 1
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
