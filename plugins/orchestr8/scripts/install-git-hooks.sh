#!/bin/bash
# Install Git hooks for orchestr8 security checks

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
HOOKS_DIR="$REPO_ROOT/.git/hooks"

echo "Installing Git hooks for orchestr8..."

# Check if .git directory exists
if [ ! -d "$REPO_ROOT/.git" ]; then
    echo "Error: Not a git repository"
    exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# Install pre-commit hook
PRE_COMMIT_HOOK="$HOOKS_DIR/pre-commit"

cat > "$PRE_COMMIT_HOOK" << 'EOF'
#!/bin/bash
# Git pre-commit hook - runs security checks

# Run the security check script
SCRIPT_DIR="$(git rev-parse --show-toplevel)/plugins/orchestr8/scripts"

if [ -f "$SCRIPT_DIR/pre-commit-security.sh" ]; then
    "$SCRIPT_DIR/pre-commit-security.sh"
else
    echo "Warning: pre-commit-security.sh not found"
    exit 0
fi
EOF

chmod +x "$PRE_COMMIT_HOOK"

echo "✓ Pre-commit hook installed at $PRE_COMMIT_HOOK"
echo ""
echo "The hook will run automatically on 'git commit'"
echo "To bypass (not recommended): git commit --no-verify"
echo ""
echo "To uninstall: rm $PRE_COMMIT_HOOK"
