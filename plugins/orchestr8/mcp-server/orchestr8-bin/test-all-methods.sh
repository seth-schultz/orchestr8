#!/bin/bash
# Comprehensive MCP server test

BIN="./target/release/orchestr8-bin"
ROOT="/Users/seth/Projects/orchestr8"

echo "=== Orchestr8 MCP Server Test Suite ==="
echo ""

# Clean database
rm -rf "$ROOT/.claude/mcp-server/data/orchestr8.duckdb"* 2>/dev/null

run_test() {
    local name="$1"
    local request="$2"

    echo "▶ Test: $name"
    result=$(echo "$request" | $BIN --root "$ROOT" --log-level error 2>&1 | head -1)
    echo "$result" | python3 -m json.tool 2>/dev/null || echo "$result"
    echo ""
}

# Test 1: Initialize
run_test "initialize" '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}'

# Test 2: Health check
run_test "health" '{"jsonrpc":"2.0","method":"health","params":{},"id":2}'

# Test 3: List all agents
run_test "agents/list (first 5)" '{"jsonrpc":"2.0","method":"agents/list","params":{},"id":3}'

# Test 4: Query by context
run_test "agents/query (context: react)" '{"jsonrpc":"2.0","method":"agents/query","params":{"context":"react","limit":3},"id":4}'

# Test 5: Query by role
run_test "agents/query (role: frontend)" '{"jsonrpc":"2.0","method":"agents/query","params":{"role":"frontend","limit":3},"id":5}'

# Test 6: Query by capability
run_test "agents/query (capability: typescript)" '{"jsonrpc":"2.0","method":"agents/query","params":{"capability":"typescript","limit":3},"id":6}'

# Test 7: Get specific agent
run_test "agents/get (react-specialist)" '{"jsonrpc":"2.0","method":"agents/get","params":{"name":"react-specialist"},"id":7}'

# Test 8: Cache stats
run_test "cache/stats" '{"jsonrpc":"2.0","method":"cache/stats","params":{},"id":8}'

# Test 9: Query again (should hit cache)
run_test "agents/query (context: react - cached)" '{"jsonrpc":"2.0","method":"agents/query","params":{"context":"react","limit":3},"id":9}'

# Test 10: Clear cache
run_test "cache/clear" '{"jsonrpc":"2.0","method":"cache/clear","params":{},"id":10}'

echo "=== All tests completed ==="
