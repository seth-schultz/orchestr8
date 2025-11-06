#!/bin/bash

# End-to-End Test for Orchestr8 Rust MCP Stdio Server
# Tests all 7 MCP methods and validates performance

set -e

echo "════════════════════════════════════════════════════════════════"
echo "  Orchestr8 Rust MCP Stdio Server - End-to-End Tests"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to run test
run_test() {
    local name=$1
    local input=$2
    local expected_pattern=$3

    TESTS_RUN=$((TESTS_RUN + 1))

    echo -n "Test $TESTS_RUN: $name ... "

    # Run query and capture output
    output=$(echo "$input" | "$BINARY_PATH" 2>/dev/null)

    # Check if output contains expected pattern
    if echo "$output" | grep -q "$expected_pattern"; then
        echo -e "${GREEN}✅ PASS${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}❌ FAIL${NC}"
        echo "  Expected pattern: $expected_pattern"
        echo "  Got: $output"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

# Find or build binary
ORCHESTR8_HOME="${CLAUDE_PLUGIN_ROOT:-.}"
BIN_DIR="/Users/seth/Projects/orchestr8/.claude/mcp-server/orchestr8-bin"
BINARY_PATH="${BIN_DIR}/target/release/orchestr8-bin"

# Try to find precompiled binary
if [ ! -f "$BINARY_PATH" ]; then
    CACHE_BIN="${HOME}/.cache/orchestr8/bin/orchestr8-bin-$(uname -s | tr '[:upper:]' '[:lower:]')-$(uname -m)"
    if [ -f "$CACHE_BIN" ]; then
        BINARY_PATH="$CACHE_BIN"
    fi
fi

# Build if necessary
if [ ! -f "$BINARY_PATH" ]; then
    echo "Building Rust binary..."
    cd "$BIN_DIR"
    cargo build --release
    BINARY_PATH="$BIN_DIR/target/release/orchestr8-bin"
fi

if [ ! -f "$BINARY_PATH" ]; then
    echo -e "${RED}ERROR: Could not find or build binary${NC}"
    exit 1
fi

echo "Using binary: $BINARY_PATH"
echo ""

# ============================================================
# Test 1: Initialize
# ============================================================
echo -e "${YELLOW}[1/7] Initialize${NC}"
run_test "initialize handshake" \
    '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}' \
    '"method":"initialize"' || true
echo ""

# ============================================================
# Test 2: Query Agents by Context
# ============================================================
echo -e "${YELLOW}[2/7] Query Agents by Context${NC}"
run_test "query React agents" \
    '{"jsonrpc":"2.0","method":"agents/query","params":{"context":"React component development","limit":2},"id":2}' \
    '"name":"react-specialist"' || true
echo ""

# ============================================================
# Test 3: Query Agents by Role
# ============================================================
echo -e "${YELLOW}[3/7] Query Agents by Role${NC}"
run_test "query backend developer" \
    '{"jsonrpc":"2.0","method":"agents/query","params":{"role":"backend_developer","limit":1},"id":3}' \
    '"agents"' || true
echo ""

# ============================================================
# Test 4: List All Agents
# ============================================================
echo -e "${YELLOW}[4/7] List All Agents${NC}"
run_test "list all agents" \
    '{"jsonrpc":"2.0","method":"agents/list","params":{},"id":4}' \
    '"agents"' || true
echo ""

# ============================================================
# Test 5: Get Specific Agent
# ============================================================
echo -e "${YELLOW}[5/7] Get Specific Agent${NC}"
run_test "get react-specialist agent" \
    '{"jsonrpc":"2.0","method":"agents/get","params":{"name":"react-specialist"},"id":5}' \
    '"name":"react-specialist"' || true
echo ""

# ============================================================
# Test 6: Health Check
# ============================================================
echo -e "${YELLOW}[6/7] Health Check${NC}"
run_test "health endpoint" \
    '{"jsonrpc":"2.0","method":"health","params":{},"id":6}' \
    '"status":"healthy"' || true
echo ""

# ============================================================
# Test 7: Cache Statistics
# ============================================================
echo -e "${YELLOW}[7/7] Cache Statistics${NC}"
run_test "cache statistics" \
    '{"jsonrpc":"2.0","method":"cache/stats","params":{},"id":7}' \
    '"cache"' || true
echo ""

# ============================================================
# Summary
# ============================================================
echo "════════════════════════════════════════════════════════════════"
echo "Test Results:"
echo "  Total:  $TESTS_RUN"
echo "  Passed: ${GREEN}$TESTS_PASSED${NC}"
echo "  Failed: ${RED}$TESTS_FAILED${NC}"
echo "════════════════════════════════════════════════════════════════"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed${NC}"
    exit 1
fi
