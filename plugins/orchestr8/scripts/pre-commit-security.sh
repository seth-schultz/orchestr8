#!/bin/bash
# Pre-commit security check script for orchestr8
# This script runs security checks before allowing a commit

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔒 Running pre-commit security checks...${NC}"
echo ""

# Change to plugin directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PLUGIN_DIR"

# Track if any checks fail
FAILED=0

# ============================================================================
# Check 1: Scan for hardcoded secrets
# ============================================================================
echo -e "${BLUE}[1/5] Checking for hardcoded secrets...${NC}"

# Common secret patterns
SECRET_PATTERNS=(
    "password.*[:=].*['\"][^'\"]{8,}['\"]"
    "api[_-]?key.*[:=].*['\"][A-Za-z0-9+/]{20,}['\"]"
    "secret.*[:=].*['\"][A-Za-z0-9+/]{20,}['\"]"
    "token.*[:=].*['\"][A-Za-z0-9+/]{20,}['\"]"
    "bearer [A-Za-z0-9+/]{20,}"
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
    "GITHUB_TOKEN"
    "OPENAI_API_KEY"
    "ANTHROPIC_API_KEY"
)

# Files to check (staged files only)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|json|ts|tsx|jsx|md|yml|yaml)$' || true)

if [ -z "$STAGED_FILES" ]; then
    echo -e "${GREEN}  ✓ No relevant files staged${NC}"
else
    SECRET_FOUND=0
    for pattern in "${SECRET_PATTERNS[@]}"; do
        if echo "$STAGED_FILES" | xargs grep -i -E "$pattern" 2>/dev/null | grep -v -E "(test|mock|example|sample)" > /dev/null; then
            if [ $SECRET_FOUND -eq 0 ]; then
                echo -e "${RED}  ✗ Potential secrets detected:${NC}"
                SECRET_FOUND=1
                FAILED=1
            fi
            echo "$STAGED_FILES" | xargs grep -i -E "$pattern" 2>/dev/null | grep -v -E "(test|mock|example|sample)" | head -n 5
        fi
    done

    if [ $SECRET_FOUND -eq 0 ]; then
        echo -e "${GREEN}  ✓ No hardcoded secrets detected${NC}"
    else
        echo -e "${RED}  → Please remove hardcoded secrets before committing${NC}"
    fi
fi

echo ""

# ============================================================================
# Check 2: NPM Audit for high/critical vulnerabilities
# ============================================================================
echo -e "${BLUE}[2/5] Running npm audit...${NC}"

if [ -f "package.json" ] && [ -f "package-lock.json" ]; then
    AUDIT_OUTPUT=$(npm audit --audit-level=high 2>&1 || true)
    AUDIT_EXITCODE=$?

    if [ $AUDIT_EXITCODE -eq 0 ]; then
        echo -e "${GREEN}  ✓ No high/critical vulnerabilities found${NC}"
    else
        echo -e "${RED}  ✗ High or critical vulnerabilities detected:${NC}"
        echo "$AUDIT_OUTPUT" | grep -E "(high|critical|found)" | head -n 10
        echo ""
        echo -e "${YELLOW}  → Run 'npm audit fix' to resolve${NC}"
        FAILED=1
    fi
else
    echo -e "${YELLOW}  ⊘ Skipped (no package.json found)${NC}"
fi

echo ""

# ============================================================================
# Check 3: Check for sensitive file patterns
# ============================================================================
echo -e "${BLUE}[3/5] Checking for sensitive files...${NC}"

SENSITIVE_PATTERNS=(
    "*.pem"
    "*.key"
    "*.p12"
    "*.pfx"
    "*.jks"
    ".env.local"
    ".env.production"
    "credentials.json"
    "serviceAccount.json"
    "id_rsa"
    "id_dsa"
)

SENSITIVE_FOUND=0
for pattern in "${SENSITIVE_PATTERNS[@]}"; do
    if echo "$STAGED_FILES" | grep -E "$pattern" > /dev/null 2>&1; then
        if [ $SENSITIVE_FOUND -eq 0 ]; then
            echo -e "${RED}  ✗ Sensitive files detected:${NC}"
            SENSITIVE_FOUND=1
            FAILED=1
        fi
        echo "$STAGED_FILES" | grep -E "$pattern"
    fi
done

if [ $SENSITIVE_FOUND -eq 0 ]; then
    echo -e "${GREEN}  ✓ No sensitive files detected${NC}"
else
    echo -e "${RED}  → Please remove sensitive files from commit${NC}"
fi

echo ""

# ============================================================================
# Check 4: Check for debug/console statements in production code
# ============================================================================
echo -e "${BLUE}[4/5] Checking for debug statements...${NC}"

JS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(js|ts)$' | grep -v -E "(test|spec|mock)" || true)

if [ -z "$JS_FILES" ]; then
    echo -e "${GREEN}  ✓ No JavaScript files to check${NC}"
else
    DEBUG_FOUND=0

    # Check for console.log, debugger, etc.
    if echo "$JS_FILES" | xargs grep -n -E "(console\.(log|debug|info|warn)|debugger)" 2>/dev/null | grep -v "// eslint-disable" > /dev/null; then
        echo -e "${YELLOW}  ⚠ Debug statements found (consider removing):${NC}"
        echo "$JS_FILES" | xargs grep -n -E "(console\.(log|debug|info|warn)|debugger)" 2>/dev/null | grep -v "// eslint-disable" | head -n 5
        # Don't fail, just warn
        DEBUG_FOUND=1
    fi

    if [ $DEBUG_FOUND -eq 0 ]; then
        echo -e "${GREEN}  ✓ No debug statements found${NC}"
    fi
fi

echo ""

# ============================================================================
# Check 5: Verify package-lock.json is in sync
# ============================================================================
echo -e "${BLUE}[5/5] Checking package-lock.json sync...${NC}"

if [ -f "package.json" ]; then
    # Check if package.json is staged
    if echo "$STAGED_FILES" | grep "package.json" > /dev/null; then
        # Check if package-lock.json is also staged
        if ! echo "$STAGED_FILES" | grep "package-lock.json" > /dev/null; then
            echo -e "${RED}  ✗ package.json modified but package-lock.json not staged${NC}"
            echo -e "${YELLOW}  → Run 'npm install' and stage package-lock.json${NC}"
            FAILED=1
        else
            echo -e "${GREEN}  ✓ package.json and package-lock.json both staged${NC}"
        fi
    else
        echo -e "${GREEN}  ✓ package.json not modified${NC}"
    fi
else
    echo -e "${YELLOW}  ⊘ Skipped (no package.json found)${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ============================================================================
# Final result
# ============================================================================
if [ $FAILED -eq 1 ]; then
    echo -e "${RED}❌ Security checks FAILED${NC}"
    echo ""
    echo "Please fix the issues above before committing."
    echo "If you need to bypass (not recommended), use: git commit --no-verify"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ All security checks passed!${NC}"
    echo ""
    exit 0
fi
