#!/usr/bin/env bash
# Session start hook for orchestr8
# Runs when Claude Code starts a new session or resumes an existing session
# Ensures MCP binary exists and is ready for Claude Code to start
#
# NOTE: This hook does NOT start the MCP server - Claude Code manages that
# automatically via the mcpServers config in plugin.json. Each Claude Code
# session gets its own MCP server process that Claude Code starts/stops.

set -euo pipefail

# Use CLAUDE_PLUGIN_ROOT if available, otherwise determine from script location
if [ -n "${CLAUDE_PLUGIN_ROOT:-}" ]; then
    PLUGIN_ROOT="$CLAUDE_PLUGIN_ROOT"
else
    SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    PLUGIN_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
fi

MCP_DATA_DIR="$PLUGIN_ROOT/mcp-server/data"
MCP_BINARY="$PLUGIN_ROOT/mcp-server/orchestr8-bin/target/release/orchestr8-bin"

# Handle Windows .exe extension
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    MCP_BINARY="${MCP_BINARY}.exe"
fi

# Create MCP data directory if it doesn't exist
mkdir -p "$MCP_DATA_DIR"

# Check if MCP binary exists and is executable
NEEDS_DOWNLOAD=false

if [ ! -f "$MCP_BINARY" ]; then
    NEEDS_DOWNLOAD=true
elif [ ! -x "$MCP_BINARY" ]; then
    # Try to make it executable
    chmod +x "$MCP_BINARY" 2>/dev/null || NEEDS_DOWNLOAD=true
fi

# Download binary if needed
if [ "$NEEDS_DOWNLOAD" = true ]; then
    if [ -f "$PLUGIN_ROOT/hooks/post-install.sh" ]; then
        bash "$PLUGIN_ROOT/hooks/post-install.sh" || {
            echo "⚠️  orchestr8: Failed to download MCP binary"
            echo "   Run manually: bash $PLUGIN_ROOT/hooks/post-install.sh"
            exit 1
        }
    else
        echo "⚠️  orchestr8: Post-install script not found"
        exit 1
    fi

    # Verify binary was downloaded
    if [ ! -f "$MCP_BINARY" ]; then
        echo "⚠️  orchestr8: Binary not found after download"
        exit 1
    fi

    # Ensure it's executable
    chmod +x "$MCP_BINARY" 2>/dev/null || {
        echo "⚠️  orchestr8: Failed to make binary executable"
        exit 1
    }
fi

# On macOS, remove quarantine attribute if present (prevents Gatekeeper issues)
if [[ "$OSTYPE" == "darwin"* ]]; then
    xattr -d com.apple.quarantine "$MCP_BINARY" 2>/dev/null || true
fi

# Store MCP paths in environment for Claude Code's use
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
    echo "ORCHESTR8_MCP_BINARY=$MCP_BINARY" >> "$CLAUDE_ENV_FILE"
    echo "ORCHESTR8_MCP_DATA_DIR=$MCP_DATA_DIR" >> "$CLAUDE_ENV_FILE"
fi

# Success - Claude Code will start the MCP server automatically
exit 0
