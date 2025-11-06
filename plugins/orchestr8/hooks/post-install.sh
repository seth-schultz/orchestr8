#!/usr/bin/env bash
# Post-installation hook for orchestr8 plugin
# Automatically runs after plugin installation to:
# 1. Download pre-built MCP server binary from GitHub releases
# 2. Initialize intelligence database

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ORCHESTR8_DIR="$PROJECT_ROOT/.orchestr8"
DB_PATH="$ORCHESTR8_DIR/intelligence.db"
MCP_BIN_DIR="$PROJECT_ROOT/.claude/mcp-server/orchestr8-bin/target/release"
MCP_BIN_PATH="$MCP_BIN_DIR/orchestr8-bin"

echo "============================================"
echo "orchestr8 Plugin - Post-Installation Setup"
echo "============================================"
echo ""

# Detect OS and architecture
echo "🔍 Detecting OS and architecture..."
OS=$(uname -s)
ARCH=$(uname -m)

case "$OS" in
  Darwin)
    if [ "$ARCH" = "x86_64" ]; then
      BINARY_NAME="orchestr8-bin-darwin-x86_64"
      ARCHIVE_EXT="tar.gz"
    elif [ "$ARCH" = "arm64" ]; then
      BINARY_NAME="orchestr8-bin-darwin-arm64"
      ARCHIVE_EXT="tar.gz"
    else
      echo "❌ Unsupported macOS architecture: $ARCH"
      exit 1
    fi
    ;;
  Linux)
    if [ "$ARCH" = "x86_64" ]; then
      BINARY_NAME="orchestr8-bin-linux-x86_64"
      ARCHIVE_EXT="tar.gz"
    elif [ "$ARCH" = "aarch64" ]; then
      BINARY_NAME="orchestr8-bin-linux-arm64"
      ARCHIVE_EXT="tar.gz"
    else
      echo "❌ Unsupported Linux architecture: $ARCH"
      exit 1
    fi
    ;;
  MINGW*|MSYS*|CYGWIN*)
    if [ "$ARCH" = "x86_64" ]; then
      BINARY_NAME="orchestr8-bin-windows-x86_64"
      ARCHIVE_EXT="zip"
    else
      echo "❌ Unsupported Windows architecture: $ARCH"
      exit 1
    fi
    ;;
  *)
    echo "❌ Unsupported OS: $OS"
    exit 1
    ;;
esac

echo "   OS: $OS, Architecture: $ARCH"
echo "   Binary: $BINARY_NAME.$ARCHIVE_EXT"

# Download MCP binary from GitHub releases
echo ""
echo "⬇️  Downloading MCP server binary..."

# Create binary directory
mkdir -p "$MCP_BIN_DIR"

# Get latest release version
LATEST_VERSION=$(curl -s https://api.github.com/repos/seth-schultz/orchestr8/releases/latest | grep '"tag_name"' | head -1 | sed 's/.*"v\([^"]*\)".*/\1/')

if [ -z "$LATEST_VERSION" ]; then
  echo "❌ Could not determine latest version from GitHub releases"
  exit 1
fi

echo "   Latest version: v$LATEST_VERSION"

# Download binary
DOWNLOAD_URL="https://github.com/seth-schultz/orchestr8/releases/download/v$LATEST_VERSION/$BINARY_NAME.$ARCHIVE_EXT"

echo "   Downloading from: $DOWNLOAD_URL"

TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

cd "$TEMP_DIR"
if ! curl -fsSL -o "binary.$ARCHIVE_EXT" "$DOWNLOAD_URL"; then
  echo "❌ Failed to download binary from $DOWNLOAD_URL"
  exit 1
fi

# Extract binary
if [ "$ARCHIVE_EXT" = "tar.gz" ]; then
  tar -xzf "binary.$ARCHIVE_EXT"
elif [ "$ARCHIVE_EXT" = "zip" ]; then
  unzip -q "binary.$ARCHIVE_EXT"
fi

# Move binary to correct location
if [ "$OS" = "MINGW" ] || [ "$OS" = "MSYS" ] || [ "$OS" = "CYGWIN" ]; then
  mv orchestr8-bin.exe "$MCP_BIN_PATH.exe"
else
  mv orchestr8-bin "$MCP_BIN_PATH"
  chmod +x "$MCP_BIN_PATH"
fi

echo "   ✅ MCP server binary installed at: $MCP_BIN_PATH"

# Create .orchestr8 directory
echo ""
echo "📁 Creating .orchestr8 directory..."
mkdir -p "$ORCHESTR8_DIR"
mkdir -p "$ORCHESTR8_DIR/results"
mkdir -p "$ORCHESTR8_DIR/logs"
mkdir -p "$ORCHESTR8_DIR/cache"

# Initialize intelligence database
echo "🗄️  Initializing intelligence database..."

if [ -f "$DB_PATH" ]; then
    echo "   ⚠️  Database already exists at: $DB_PATH"
    echo "   To reinitialize, run: rm $DB_PATH && bash .claude/hooks/post-install.sh"
else
    # Run database initialization script
    bash "$SCRIPT_DIR/../scripts/init-intelligence-db.sh"

    if [ -f "$DB_PATH" ]; then
        echo "   ✅ Database created successfully"
    else
        echo "   ❌ Database creation failed"
        exit 1
    fi
fi

# Verify database schema
echo "🔍 Verifying database schema..."
TABLES=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
echo "   Tables created: $TABLES"

if [ "$TABLES" -lt 10 ]; then
    echo "   ❌ Schema incomplete (expected 10+ tables)"
    exit 1
fi

# Create sample data for testing
echo "📊 Creating sample data..."
sqlite3 "$DB_PATH" << 'EOF'
-- Insert welcome notification
INSERT OR IGNORE INTO notifications (
    notification_type, priority, title, message, created_at
) VALUES (
    'info',
    'normal',
    'orchestr8 Plugin Installed',
    'Intelligence database initialized successfully. All agents now have access to persistent code intelligence, error learning, and autonomous workflow tracking.',
    datetime('now')
);
EOF

# Set permissions
echo "🔒 Setting permissions..."
chmod 755 "$ORCHESTR8_DIR"
chmod 644 "$DB_PATH"
chmod -R 755 "$ORCHESTR8_DIR/results"
chmod -R 755 "$ORCHESTR8_DIR/logs"

# Create database health check script
echo "🏥 Creating health check script..."
cat > "$ORCHESTR8_DIR/health-check.sh" << 'HEALTH_EOF'
#!/usr/bin/env bash
# Health check for orchestr8 intelligence database

DB_PATH=".orchestr8/intelligence.db"

echo "=== orchestr8 Intelligence Database Health Check ==="
echo ""

# Check database exists
if [ ! -f "$DB_PATH" ]; then
    echo "❌ Database not found at: $DB_PATH"
    exit 1
fi
echo "✅ Database file exists"

# Check database is not corrupted
if ! sqlite3 "$DB_PATH" "PRAGMA integrity_check;" | grep -q "ok"; then
    echo "❌ Database integrity check failed"
    exit 1
fi
echo "✅ Database integrity OK"

# Check tables exist
TABLES=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM sqlite_master WHERE type='table';")
echo "✅ Tables: $TABLES"

# Check indexes exist
INDEXES=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM sqlite_master WHERE type='index';")
echo "✅ Indexes: $INDEXES"

# Check notifications table
NOTIFICATIONS=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM notifications;")
echo "✅ Notifications: $NOTIFICATIONS"

# Database size
SIZE=$(du -h "$DB_PATH" | awk '{print $1}')
echo "✅ Database size: $SIZE"

echo ""
echo "=== All health checks passed ==="
HEALTH_EOF

chmod +x "$ORCHESTR8_DIR/health-check.sh"

# Run health check
echo "🏥 Running health check..."
bash "$ORCHESTR8_DIR/health-check.sh"

echo ""
echo "============================================"
echo "✅ orchestr8 Plugin Installation Complete!"
echo "============================================"
echo ""
echo "📚 Next Steps:"
echo "   1. View notifications: sqlite3 .orchestr8/intelligence.db 'SELECT * FROM notifications;'"
echo "   2. Run health check: bash .orchestr8/health-check.sh"
echo "   3. Start background manager: bash .claude/agents/orchestration/start-background-manager.sh"
echo "   4. Test workflow: /add-feature 'Your feature description'"
echo ""
echo "📖 Documentation:"
echo "   - Architecture: README.md"
echo "   - Database Schema: .claude/scripts/init-intelligence-db.sh"
echo "   - Background Orchestration: BACKGROUND-ORCHESTRATION.md"
echo ""
