#!/bin/bash
# Post-Edit Hook: Auto-index file after Edit tool
# This keeps database synchronized automatically

FILE_PATH="$1"

# Only index if file exists
if [ -f "$FILE_PATH" ]; then
    # Run indexer in background
    python3 "$(dirname "$0")/../database/autonomous_db.py" --index "$FILE_PATH" > /dev/null 2>&1 &
fi
