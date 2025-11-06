#!/bin/bash
# Performance benchmark for Orchestr8 MCP server

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}=== Orchestr8 MCP Server - Performance Benchmark ===${NC}\n"

# Build release binary
echo -e "${GREEN}Building release binary...${NC}"
cargo build --release --quiet
echo ""

# Start server
echo -e "${GREEN}Starting server...${NC}"
./target/release/orchestr8-bin &
SERVER_PID=$!
sleep 1

# Cleanup on exit
trap "kill $SERVER_PID 2>/dev/null || true" EXIT

# Benchmark function
benchmark() {
    local name=$1
    local query=$2
    local iterations=${3:-1000}

    echo -e "${YELLOW}Benchmarking: $name ($iterations iterations)${NC}"

    local start=$(date +%s%N)
    for i in $(seq 1 $iterations); do
        echo "$query" | ./target/release/orchestr8-bin > /dev/null
    done
    local end=$(date +%s%N)

    local duration_ns=$((end - start))
    local duration_ms=$((duration_ns / 1000000))
    local avg_ms=$((duration_ms / iterations))
    local qps=$((iterations * 1000 / duration_ms))

    echo "  Total time: ${duration_ms}ms"
    echo "  Average: ${avg_ms}ms per query"
    echo "  Throughput: ${qps} queries/second"
    echo ""
}

# Initialize
echo '{"jsonrpc":"2.0","method":"initialize","id":1}' | ./target/release/orchestr8-bin > /dev/null

# Run benchmarks
benchmark "Health check" '{"jsonrpc":"2.0","method":"health","id":1}' 100

benchmark "Query by role" '{"jsonrpc":"2.0","method":"agents/query","params":{"role":"frontend_developer"},"id":2}' 100

benchmark "Query by capability" '{"jsonrpc":"2.0","method":"agents/query","params":{"capability":"react"},"id":3}' 100

benchmark "Query by context" '{"jsonrpc":"2.0","method":"agents/query","params":{"context":"web development"},"id":4}' 100

benchmark "List agents" '{"jsonrpc":"2.0","method":"agents/list","id":5}' 100

# Memory usage
echo -e "${YELLOW}Memory usage:${NC}"
ps -o rss=,vsz= -p $SERVER_PID | awk '{printf "  RSS: %.2f MB\n  VSZ: %.2f MB\n", $1/1024, $2/1024}'
echo ""

# Cache stats
echo -e "${YELLOW}Cache statistics:${NC}"
echo '{"jsonrpc":"2.0","method":"cache/stats","id":6}' | ./target/release/orchestr8-bin | jq '.result'

echo -e "${BLUE}=== Benchmark completed ===${NC}"
