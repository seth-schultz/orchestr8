#!/bin/bash
# Example: Query agents using the Orchestr8 MCP server

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Orchestr8 MCP Server - Query Examples ===${NC}\n"

# Start server in background
echo -e "${GREEN}Starting server...${NC}"
orchestr8-bin > /tmp/orchestr8.log 2>&1 &
SERVER_PID=$!
sleep 2

# Cleanup on exit
trap "kill $SERVER_PID 2>/dev/null || true" EXIT

# Function to send JSON-RPC request
query() {
    local method=$1
    local params=$2
    local id=$3

    if [ -z "$params" ]; then
        echo "{\"jsonrpc\":\"2.0\",\"method\":\"$method\",\"id\":$id}"
    else
        echo "{\"jsonrpc\":\"2.0\",\"method\":\"$method\",\"params\":$params,\"id\":$id}"
    fi
}

# 1. Initialize
echo -e "${GREEN}1. Initialize server${NC}"
query "initialize" "" 1 | orchestr8-bin | jq .
echo ""

# 2. Health check
echo -e "${GREEN}2. Health check${NC}"
query "health" "" 2 | orchestr8-bin | jq .
echo ""

# 3. Query by context
echo -e "${GREEN}3. Query by context: 'React development'${NC}"
query "agents/query" '{"context":"React development","limit":3}' 3 | orchestr8-bin | jq .
echo ""

# 4. Query by role
echo -e "${GREEN}4. Query by role: 'frontend_developer'${NC}"
query "agents/query" '{"role":"frontend_developer","limit":3}' 4 | orchestr8-bin | jq .
echo ""

# 5. Query by capability
echo -e "${GREEN}5. Query by capability: 'typescript'${NC}"
query "agents/query" '{"capability":"typescript","limit":3}' 5 | orchestr8-bin | jq .
echo ""

# 6. Combined query
echo -e "${GREEN}6. Combined query: context='API' + capability='graphql'${NC}"
query "agents/query" '{"context":"API","capability":"graphql","limit":3}' 6 | orchestr8-bin | jq .
echo ""

# 7. List all agents
echo -e "${GREEN}7. List all agents${NC}"
query "agents/list" '{}' 7 | orchestr8-bin | jq '.result | {total: .total, count: (.agents | length)}'
echo ""

# 8. Get specific agent
echo -e "${GREEN}8. Get specific agent: 'react-specialist'${NC}"
query "agents/get" '{"name":"react-specialist"}' 8 | orchestr8-bin | jq .
echo ""

# 9. Cache statistics
echo -e "${GREEN}9. Cache statistics${NC}"
query "cache/stats" "" 9 | orchestr8-bin | jq .
echo ""

echo -e "${BLUE}=== All queries completed ===${NC}"
