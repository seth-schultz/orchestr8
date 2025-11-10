#!/bin/bash

echo "=========================================="
echo "SHA VERIFICATION REPORT"
echo "=========================================="
echo ""
echo "Extracting all action references with SHAs..."
echo ""

# Create temporary file for results
RESULTS_FILE="/tmp/sha_verification_results.txt"
> "$RESULTS_FILE"

# Define color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Extract all uses: lines with @ from workflow files
WORKFLOW_FILES=$(find .github/workflows -name "*.yml" -type f)

declare -A sha_map
declare -A action_map
declare -A file_map

echo "Parsing workflow files..."
for file in $WORKFLOW_FILES; do
    while IFS= read -r line; do
        if echo "$line" | grep -q "uses:.*@[0-9a-f]\{40\}"; then
            # Extract action and SHA
            action=$(echo "$line" | sed -n 's/.*uses: *\([^@]*\)@.*/\1/p' | xargs)
            sha=$(echo "$line" | sed -n 's/.*@\([0-9a-f]\{40\}\).*/\1/p' | xargs)
            
            if [ -n "$action" ] && [ -n "$sha" ]; then
                sha_map["$action"]="$sha"
                file_map["$action"]="$file"
                
                # Extract version from comment if present
                if echo "$line" | grep -q "#"; then
                    version=$(echo "$line" | sed -n 's/.*# *\(v\?[0-9.]*\).*/\1/p' | xargs)
                    action_map["$action"]="$version"
                fi
            fi
        fi
    done < "$file"
done

echo ""
echo "Found ${#sha_map[@]} unique action references"
echo ""
echo "=========================================="
echo "VERIFYING SHAs WITH GITHUB API"
echo "=========================================="
echo ""

VALID_COUNT=0
INVALID_COUNT=0

for action in "${!sha_map[@]}"; do
    sha="${sha_map[$action]}"
    version="${action_map[$action]}"
    file="${file_map[$action]}"
    
    # Extract owner and repo from action
    owner=$(echo "$action" | cut -d'/' -f1)
    repo=$(echo "$action" | cut -d'/' -f2)
    
    echo "Checking: $action @ $sha"
    if [ -n "$version" ]; then
        echo "  Version: $version"
    fi
    echo "  File: $file"
    
    # Verify SHA exists using GitHub API
    status_code=$(curl -s -o /dev/null -w "%{http_code}" \
        "https://api.github.com/repos/$owner/$repo/git/commits/$sha")
    
    if [ "$status_code" = "200" ]; then
        echo -e "  ${GREEN}✓ VALID${NC}"
        VALID_COUNT=$((VALID_COUNT + 1))
    else
        echo -e "  ${RED}✗ INVALID (HTTP $status_code)${NC}"
        INVALID_COUNT=$((INVALID_COUNT + 1))
        
        # Try to get correct SHA for version if available
        if [ -n "$version" ]; then
            echo "  Attempting to find correct SHA for $version..."
            
            # Try to get SHA for version tag
            tag_sha=$(curl -s "https://api.github.com/repos/$owner/$repo/git/ref/tags/$version" | \
                jq -r '.object.sha // empty' 2>/dev/null)
            
            if [ -n "$tag_sha" ]; then
                echo -e "  ${YELLOW}→ Found SHA for $version: $tag_sha${NC}"
                echo "INVALID|$action|$sha|$version|$tag_sha|$file" >> "$RESULTS_FILE"
            else
                echo -e "  ${RED}→ Could not find SHA for version $version${NC}"
                echo "INVALID|$action|$sha|$version|NOTFOUND|$file" >> "$RESULTS_FILE"
            fi
        else
            echo "INVALID|$action|$sha||NOVERSION|$file" >> "$RESULTS_FILE"
        fi
    fi
    echo ""
    
    # Rate limiting
    sleep 0.5
done

echo "=========================================="
echo "SUMMARY"
echo "=========================================="
echo ""
echo "Total actions checked: ${#sha_map[@]}"
echo -e "${GREEN}Valid SHAs: $VALID_COUNT${NC}"
echo -e "${RED}Invalid SHAs: $INVALID_COUNT${NC}"
echo ""

if [ $INVALID_COUNT -gt 0 ]; then
    echo "=========================================="
    echo "INVALID SHAs REQUIRING FIXES"
    echo "=========================================="
    echo ""
    
    while IFS='|' read -r status action old_sha version new_sha file; do
        if [ "$status" = "INVALID" ]; then
            echo "Action: $action"
            echo "  File: $file"
            echo "  Current SHA: $old_sha"
            echo "  Version: ${version:-UNKNOWN}"
            if [ "$new_sha" != "NOTFOUND" ] && [ "$new_sha" != "NOVERSION" ]; then
                echo "  Correct SHA: $new_sha"
            else
                echo "  Correct SHA: NEEDS MANUAL LOOKUP"
            fi
            echo ""
        fi
    done < "$RESULTS_FILE"
fi

echo "Full results saved to: $RESULTS_FILE"
echo ""

if [ $INVALID_COUNT -gt 0 ]; then
    exit 1
else
    exit 0
fi
