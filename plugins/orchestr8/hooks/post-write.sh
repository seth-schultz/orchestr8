#!/bin/bash
# Post-Write Hook: Auto-index file after Write tool
# This makes the system AUTONOMOUS - no manual indexing needed

FILE_PATH="$1"

# Only index if file exists and is a code file
if [ -f "$FILE_PATH" ]; then
    # Run indexer in background (don't block)
    python3 "$(dirname "$0")/../database/autonomous_db.py" --index "$FILE_PATH" > /dev/null 2>&1 &
fi
