#!/usr/bin/env bash
# Session start hook for orchestr8
# Runs when Claude Code starts a new session or resumes an existing session
# Ensures MCP server is initialized and ready for agent discovery

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ORCHESTR8_DIR="$PROJECT_ROOT/.claude"
MCP_DATA_DIR="$ORCHESTR8_DIR/mcp-server/data"
MCP_DB="$MCP_DATA_DIR/orchestr8.duckdb"
MCP_BINARY="$ORCHESTR8_DIR/mcp-server/orchestr8-bin/target/release/orchestr8-bin"

# Create MCP data directory if it doesn't exist
mkdir -p "$MCP_DATA_DIR"

# Check if MCP binary exists
if [ ! -f "$MCP_BINARY" ]; then
    echo "⚠️  Warning: MCP binary not found at $MCP_BINARY"
    exit 0  # Don't fail, MCP will be started by Claude Code's mcpServers registration
fi

# Check if database exists and is valid
if [ -f "$MCP_DB" ]; then
    # Verify database is not corrupted (if sqlite3 is available)
    if command -v sqlite3 &> /dev/null; then
        if ! sqlite3 "$MCP_DB" "PRAGMA integrity_check;" 2>/dev/null | grep -q "ok"; then
            echo "🔄 Repairing corrupted MCP database..."
            rm -f "$MCP_DB"
            rm -f "$MCP_DB-wal"
            rm -f "$MCP_DB-shm"
        fi
    fi
fi

# Store MCP binary path in environment for Claude Code's use
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
    echo "ORCHESTR8_MCP_BINARY=$MCP_BINARY" >> "$CLAUDE_ENV_FILE"
    echo "ORCHESTR8_MCP_DATA_DIR=$MCP_DATA_DIR" >> "$CLAUDE_ENV_FILE"
fi

# Log session initialization
if [ -d "$PROJECT_ROOT/.orchestr8" ]; then
    LOGS_DIR="$PROJECT_ROOT/.orchestr8/logs"
    mkdir -p "$LOGS_DIR"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Session started - MCP server ready for initialization" >> "$LOGS_DIR/session.log"
fi

exit 0
