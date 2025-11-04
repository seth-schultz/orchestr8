#!/bin/bash
# Version Validation Script
# Ensures VERSION file and plugin.json version are synchronized

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
CLAUDE_DIR="$(dirname "$SCRIPT_DIR")"
VERSION_FILE="$CLAUDE_DIR/VERSION"
PLUGIN_JSON="$CLAUDE_DIR/plugin.json"

echo "🔍 Validating version synchronization..."

# Check files exist
if [[ ! -f "$VERSION_FILE" ]]; then
    echo -e "${RED}❌ ERROR: VERSION file not found${NC}"
    exit 1
fi

if [[ ! -f "$PLUGIN_JSON" ]]; then
    echo -e "${RED}❌ ERROR: plugin.json not found${NC}"
    exit 1
fi

# Read versions
VERSION_FILE_CONTENT=$(cat "$VERSION_FILE" | tr -d '[:space:]')

if command -v python3 &> /dev/null; then
    PLUGIN_VERSION=$(python3 -c "import json; print(json.load(open('$PLUGIN_JSON'))['version'])")
elif command -v python &> /dev/null; then
    PLUGIN_VERSION=$(python -c "import json; print(json.load(open('$PLUGIN_JSON'))['version'])")
else
    PLUGIN_VERSION=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$PLUGIN_JSON" | head -1 | sed 's/.*"\([0-9.]*\)".*/\1/')
fi

echo "📄 VERSION file:     $VERSION_FILE_CONTENT"
echo "📦 plugin.json:      $PLUGIN_VERSION"

# Compare
if [[ "$VERSION_FILE_CONTENT" == "$PLUGIN_VERSION" ]]; then
    echo -e "${GREEN}✅ SUCCESS: Versions match!${NC}"
    exit 0
else
    echo -e "${RED}❌ ERROR: Version mismatch!${NC}"
    echo "Please synchronize versions before releasing."
    exit 1
fi
