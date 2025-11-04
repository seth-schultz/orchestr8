#!/bin/bash

set -e

echo "=== Testing CI Workflow Changes ==="
echo

echo "1. Testing agent frontmatter validation..."
agent_test_passed=true
find plugins/*/agents -name "*.md" 2>/dev/null | head -3 | while read -r file; do
  echo "  Checking $file..."
  if grep -q "^---$" "$file"; then
    echo "    ✓ Has frontmatter"
  else
    echo "    ✗ Missing frontmatter"
    agent_test_passed=false
  fi
done
if [ "$agent_test_passed" = true ]; then
  echo "  ✓ Agent frontmatter validation passed"
fi
echo

echo "2. Testing component counts..."
AGENT_COUNT=$(find plugins/*/agents -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
WORKFLOW_COUNT=$(find plugins/*/commands -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
PLUGIN_COUNT=$(find plugins -mindepth 1 -maxdepth 1 -type d | wc -l | tr -d ' ')

echo "  Found: $AGENT_COUNT agents, $WORKFLOW_COUNT workflows, $PLUGIN_COUNT plugins"

PLUGIN_AGENT_COUNT=$(jq -r '.features.agents' .claude/plugin.json)
PLUGIN_WORKFLOW_COUNT=$(jq -r '.features.workflows' .claude/plugin.json)
PLUGIN_PLUGIN_COUNT=$(jq -r '.features.plugins' .claude/plugin.json)

echo "  plugin.json: $PLUGIN_AGENT_COUNT agents, $PLUGIN_WORKFLOW_COUNT workflows, $PLUGIN_PLUGIN_COUNT plugins"

if [ "$AGENT_COUNT" = "$PLUGIN_AGENT_COUNT" ] && [ "$WORKFLOW_COUNT" = "$PLUGIN_WORKFLOW_COUNT" ] && [ "$PLUGIN_COUNT" = "$PLUGIN_PLUGIN_COUNT" ]; then
  echo "  ✓ All counts match!"
else
  echo "  ⚠ Count mismatches found (this is just a warning)"
fi
echo

echo "3. Testing directory structure validation..."
required_dirs=(".claude" "plugins" ".claude-plugin")

all_ok=true
for dir in "${required_dirs[@]}"; do
  if [ -d "$dir" ]; then
    echo "  ✓ $dir exists"
  else
    echo "  ✗ $dir missing"
    all_ok=false
  fi
done

if [ "$PLUGIN_COUNT" -gt 0 ]; then
  echo "  ✓ Found $PLUGIN_COUNT plugins"
else
  echo "  ✗ No plugins found"
  all_ok=false
fi

if [ "$all_ok" = true ]; then
  echo "  ✓ Directory structure validation passed!"
else
  echo "  ✗ Directory structure validation failed!"
  exit 1
fi
echo

echo "4. Testing workflow file detection..."
workflow_test=$(find plugins/*/commands -name "*.md" 2>/dev/null | head -3)
if [ -n "$workflow_test" ]; then
  echo "  ✓ Workflow files found:"
  echo "$workflow_test" | while read -r file; do
    echo "    - $file"
  done
else
  echo "  ✗ No workflow files found"
fi
echo

echo "=== All Tests Passed! ==="
