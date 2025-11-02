#!/bin/bash
set -e

# Orchestr8 Intelligence Database Installation
# This script sets up everything needed for autonomous coding with database intelligence

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="$(dirname "$SCRIPT_DIR")"

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   Orchestr8 Intelligence Database Installation            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Setup database
echo "📦 Step 1/4: Setting up PostgreSQL + pgvector database..."
cd "$SCRIPT_DIR"
./setup.sh

# Step 2: Install Python dependencies
echo ""
echo "📦 Step 2/4: Installing Python dependencies..."
pip3 install psycopg2-binary openai

# Step 3: Make scripts executable
echo ""
echo "📦 Step 3/4: Making scripts executable..."
chmod +x "$SCRIPT_DIR/lib/db_client.py"
chmod +x "$SCRIPT_DIR/mcp-server/orchestr8_db_server.py"

# Step 4: Configure MCP server
echo ""
echo "📦 Step 4/4: Configuring MCP server..."

MCP_CONFIG_FILE="$HOME/.config/claude-code/mcp_settings.json"
MCP_CONFIG_DIR="$(dirname "$MCP_CONFIG_FILE")"

# Create config directory if needed
mkdir -p "$MCP_CONFIG_DIR"

# Check if config exists
if [ -f "$MCP_CONFIG_FILE" ]; then
    echo "⚠ MCP configuration already exists at $MCP_CONFIG_FILE"
    echo "  Please manually add the following to your mcpServers:"
    echo ""
    cat <<EOF
  "orchestr8-db": {
    "command": "python3",
    "args": ["$SCRIPT_DIR/mcp-server/orchestr8_db_server.py"],
    "env": {
      "DATABASE_URL": "postgresql://orchestr8:orchestr8_dev_password@localhost:5433/orchestr8_intelligence",
      "OPENAI_API_KEY": "your-openai-api-key-here"
    }
  }
EOF
else
    # Create new config
    cat > "$MCP_CONFIG_FILE" <<EOF
{
  "mcpServers": {
    "orchestr8-db": {
      "command": "python3",
      "args": ["$SCRIPT_DIR/mcp-server/orchestr8_db_server.py"],
      "env": {
        "DATABASE_URL": "postgresql://orchestr8:orchestr8_dev_password@localhost:5433/orchestr8_intelligence",
        "OPENAI_API_KEY": "your-openai-api-key-here"
      }
    }
  }
}
EOF
    echo "✓ Created MCP configuration at $MCP_CONFIG_FILE"
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   Installation Complete!                                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

echo "📋 Next Steps:"
echo ""
echo "  1. Update OPENAI_API_KEY in .env file:"
echo "     nano $SCRIPT_DIR/.env"
echo ""
echo "  2. Update OPENAI_API_KEY in MCP config:"
echo "     nano $MCP_CONFIG_FILE"
echo ""
echo "  3. Index your first project:"
echo "     cd /path/to/your/project"
echo "     python3 $SCRIPT_DIR/lib/indexer.py ."
echo ""
echo "  4. Test database queries:"
echo "     python3 $SCRIPT_DIR/lib/db_client.py --function authenticateUser"
echo ""
echo "  5. Restart Claude Code to load MCP server"
echo ""
echo "🎯 How to Use:"
echo ""
echo "  In any Claude Code session, you can now:"
echo "  - Use query_function tool instead of reading files"
echo "  - Use semantic_search to find code by description"
echo "  - Use query_lines to get specific line ranges"
echo ""
echo "  Token savings: 80-90% reduction!"
echo "  Autonomous coding: Work for 8+ hours without limits!"
echo ""
echo "📖 Documentation:"
echo "  - Database guide: $SCRIPT_DIR/README.md"
echo "  - System instructions: $CLAUDE_DIR/SYSTEM_INSTRUCTIONS.md"
echo "  - Agent guidelines: $CLAUDE_DIR/CLAUDE.md"
echo ""
