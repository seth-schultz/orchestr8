#!/bin/bash
# add-mcp-instructions.sh - Add MCP resource loading instructions to all commands
# This ensures all commands that use orchestr8:// URIs have proper instructions

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMMANDS_DIR="$SCRIPT_DIR/../commands"
HEADER_SECTION="## How to Load MCP Resources

**CRITICAL:** All \`orchestr8://\` URIs in this workflow must be loaded using \`ReadMcpResourceTool\` with \`server: \"orchestr8\"\` and the \`uri\` parameter set to the resource URI shown.

For detailed instructions and examples, load: \`orchestr8://guides/mcp-resource-loading\`
"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}Adding MCP resource loading instructions to commands...${NC}"
echo ""

processed=0
skipped=0

for file in "$COMMANDS_DIR"/*.md; do
    filename=$(basename "$file")

    # Check if file uses orchestr8:// URIs
    if ! grep -q "orchestr8://" "$file"; then
        echo "⊘ Skipping $filename (no orchestr8:// URIs)"
        skipped=$((skipped + 1))
        continue
    fi

    # Check if file already has MCP instructions
    if grep -q "How to Load MCP Resources" "$file"; then
        echo "✓ $filename already has MCP instructions"
        skipped=$((skipped + 1))
        continue
    fi

    # Find the line with "## Your Role" or first "##" heading after frontmatter
    role_line=$(grep -n "^## Your Role$" "$file" | head -1 | cut -d: -f1)

    if [ -z "$role_line" ]; then
        # Try to find any ## heading after frontmatter
        role_line=$(awk '/^---$/,/^---$/{next} /^## /{print NR; exit}' "$file")
    fi

    if [ -z "$role_line" ]; then
        echo "⚠ Cannot determine insertion point in $filename"
        skipped=$((skipped + 1))
        continue
    fi

    # Insert the header section before "## Your Role"
    insert_line=$((role_line - 1))

    # Create temp file with inserted header
    {
        head -n "$insert_line" "$file"
        echo ""
        echo "$HEADER_SECTION"
        echo ""
        tail -n +"$role_line" "$file"
    } > "$file.tmp"

    mv "$file.tmp" "$file"

    echo -e "${GREEN}✓ Added MCP instructions to $filename${NC}"
    processed=$((processed + 1))
done

echo ""
echo -e "${GREEN}Done!${NC}"
echo "  Processed: $processed files"
echo "  Skipped: $skipped files"
