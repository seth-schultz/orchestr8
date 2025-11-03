#!/usr/bin/env bash
# Workflow Configuration Validation Script

set -e

RED='\033[0;31m'
GREEN='\033[0.32m'
NC='\033[0m'

WORKFLOWS_DIR=".claude/commands"
PASS_COUNT=0
FAIL_COUNT=0

echo "🔍 Validating workflow configurations..."
echo ""

for file in .claude/commands/*.md; do
    filename=$(basename "$file")
    errors=()
    
    if ! head -n 1 "$file" | grep -q "^---$"; then
        errors+=("Missing frontmatter")
    fi
    
    if ! grep -q "^executor:" "$file"; then
        errors+=("Missing executor field")
    fi
    
    if ! grep -q "^delegation_required: true" "$file"; then
        errors+=("Missing delegation_required")
    fi
    
    if [ ${#errors[@]} -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC} $filename"
        ((PASS_COUNT++))
    else
        echo -e "${RED}❌ FAIL${NC} $filename: ${errors[*]}"
        ((FAIL_COUNT++))
    fi
done

echo ""
TOTAL=$((PASS_COUNT + FAIL_COUNT))
echo "Result: $PASS_COUNT/$TOTAL passing"
