#!/bin/bash

# Orchestr8 MCP Stdio Server Initialization
# Called by SessionStart hook when Claude Code opens a project with orchestr8 plugin
# Downloads precompiled Rust binary and starts stdio MCP stdio server
#
# Environment Variables:
#   CLAUDE_PLUGIN_ROOT: Plugin installation directory (set by Claude Code)
#   HOME: User home directory (standard)

set -e

# Error handling
trap 'echo "[orchestr8] Initialization failed: $?" >&2' EXIT

ORCHESTR8_HOME="${CLAUDE_PLUGIN_ROOT}"
CACHE_DIR="${HOME}/.cache/orchestr8"
BIN_DIR="${CACHE_DIR}/bin"
LOG_DIR="${CACHE_DIR}/logs"
AGENT_CACHE_DIR="${CACHE_DIR}/agents"

# Detect platform and architecture
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "${ARCH}" in
    x86_64) ARCH="x86_64" ;;
    aarch64|arm64) ARCH="arm64" ;;
    *)
        echo "[orchestr8] ERROR: Unsupported architecture: ${ARCH}"
        exit 1
        ;;
esac

case "${OS}" in
    linux|darwin)
        BINARY_NAME="orchestr8-bin-${OS}-${ARCH}"
        ;;
    mingw*|msys*|cygwin*)
        OS="windows"
        BINARY_NAME="orchestr8-bin-windows-${ARCH}.exe"
        ;;
    *)
        echo "[orchestr8] ERROR: Unsupported OS: ${OS}"
        exit 1
        ;;
esac

BINARY_PATH="${BIN_DIR}/${BINARY_NAME}"

# Create directories
mkdir -p "${BIN_DIR}" "${LOG_DIR}" "${AGENT_CACHE_DIR}"

# Download binary if missing
if [ ! -f "${BINARY_PATH}" ]; then
    # Get version from plugin.json
    VERSION=$(grep '"version"' "${ORCHESTR8_HOME}/plugin.json" 2>/dev/null | head -1 | grep -o '[0-9][0-9.]*[0-9]' | head -1)

    if [ -z "${VERSION}" ]; then
        VERSION="latest"
    fi

    echo "[orchestr8] Downloading agent discovery system for ${OS}-${ARCH}..."

    # Determine archive type based on OS
    if [ "${OS}" = "windows" ]; then
        ARCHIVE_NAME="${BINARY_NAME%.exe}.zip"
        ARCHIVE_PATH="${BIN_DIR}/${ARCHIVE_NAME}"
    else
        ARCHIVE_NAME="${BINARY_NAME}.tar.gz"
        ARCHIVE_PATH="${BIN_DIR}/${ARCHIVE_NAME}"
    fi

    DOWNLOAD_URL="https://github.com/seth-schultz/orchestr8/releases/download/v${VERSION}/${ARCHIVE_NAME}"

    # Try to download from GitHub releases
    if ! curl -fsSL --progress-bar --max-time 30 "${DOWNLOAD_URL}" -o "${ARCHIVE_PATH}"; then
        # Fallback: try without version (latest tag)
        DOWNLOAD_URL="https://github.com/seth-schultz/orchestr8/releases/download/latest/${ARCHIVE_NAME}"
        if ! curl -fsSL --progress-bar --max-time 30 "${DOWNLOAD_URL}" -o "${ARCHIVE_PATH}"; then
            echo "[orchestr8] ERROR: Failed to download binary from ${DOWNLOAD_URL}"
            echo "[orchestr8] You can manually download from: https://github.com/seth-schultz/orchestr8/releases"
            exit 1
        fi
    fi

    # Extract binary from archive
    if [ "${OS}" = "windows" ]; then
        unzip -q "${ARCHIVE_PATH}" -d "${BIN_DIR}" || {
            echo "[orchestr8] ERROR: Failed to extract ${ARCHIVE_NAME}"
            exit 1
        }
    else
        tar -xzf "${ARCHIVE_PATH}" -C "${BIN_DIR}" || {
            echo "[orchestr8] ERROR: Failed to extract ${ARCHIVE_NAME}"
            exit 1
        }
    fi

    # Clean up archive
    rm -f "${ARCHIVE_PATH}"

    chmod +x "${BINARY_PATH}"
    echo "[orchestr8] Downloaded and extracted successfully"
fi

# Verify binary exists and is executable
if [ ! -x "${BINARY_PATH}" ]; then
    chmod +x "${BINARY_PATH}"
fi

# Copy agent registry to cache if updated
if [ -d "${ORCHESTR8_HOME}/.claude/agents" ]; then
    if [ ! -d "${AGENT_CACHE_DIR}" ] || [ "${ORCHESTR8_HOME}/.claude/agents" -nt "${AGENT_CACHE_DIR}" ]; then
        cp -r "${ORCHESTR8_HOME}/.claude/agents"/* "${AGENT_CACHE_DIR}/" 2>/dev/null || true
    fi
fi

# Also check for plugin agent directories
if [ -d "${ORCHESTR8_HOME}/plugins" ]; then
    for plugin_dir in "${ORCHESTR8_HOME}/plugins"/*/agents; do
        if [ -d "$plugin_dir" ]; then
            cp -r "$plugin_dir"/* "${AGENT_CACHE_DIR}/" 2>/dev/null || true
        fi
    done
fi

# Start the Rust binary as MCP stdio server
# The binary will read from stdin and write responses to stdout
# This becomes the MCP interface for Claude Code
echo "[orchestr8] Starting agent discovery system (v${VERSION})..." >&2

# Clear trap before exec (exec will replace the process)
trap - EXIT

exec "${BINARY_PATH}" \
    --project-root "$(pwd)" \
    --agent-dir "${AGENT_CACHE_DIR}" \
    --log-level info \
    --log-file "${LOG_DIR}/orchestr8.log" \
    --cache-ttl 300 \
    --cache-size 1000
