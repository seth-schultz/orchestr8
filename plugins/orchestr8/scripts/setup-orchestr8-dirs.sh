#!/bin/bash

##############################################################################
# Orchestr8 Directory Setup Helper
#
# This script ensures the .orchestr8 folder structure exists and provides
# helper functions for consistent path resolution across all workflows.
#
# Usage:
#   source setup-orchestr8-dirs.sh
#   ANALYSIS_FILE=$(get_orchestr8_path "requirements" "analysis.md")
#   echo "Content" > "$ANALYSIS_FILE"
#
# Environment Variables:
#   ORCHESTR8_BASE  - Base path for .orchestr8 folder (default: .orchestr8)
#   ORCHESTR8_QUIET - Set to 1 to suppress output (default: 0)
##############################################################################

set -euo pipefail

# Configuration
ORCHESTR8_BASE="${ORCHESTR8_BASE:-.orchestr8}"
ORCHESTR8_QUIET="${ORCHESTR8_QUIET:-0}"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

##############################################################################
# Helper Functions
##############################################################################

# Log a message (respects ORCHESTR8_QUIET)
log_info() {
    if [ "$ORCHESTR8_QUIET" -eq 0 ]; then
        echo -e "${BLUE}[orchestr8]${NC} $1" >&2
    fi
}

# Log a warning
log_warn() {
    if [ "$ORCHESTR8_QUIET" -eq 0 ]; then
        echo -e "${YELLOW}[orchestr8]${NC} WARNING: $1" >&2
    fi
}

# Log an error
log_error() {
    echo -e "${RED}[orchestr8]${NC} ERROR: $1" >&2
}

# Log success
log_success() {
    if [ "$ORCHESTR8_QUIET" -eq 0 ]; then
        echo -e "${GREEN}[orchestr8]${NC} $1" >&2
    fi
}

##############################################################################
# Directory Management
##############################################################################

# Create orchestr8 directory structure
init_orchestr8_dirs() {
    local base_path="$1"

    # Define all subdirectories
    local dirs=(
        "docs/requirements"
        "docs/design"
        "docs/quality"
        "docs/security"
        "docs/performance"
        "docs/accessibility"
        "docs/deployment"
        "docs/analysis"
        "docs/infrastructure"
        "docs/testing"
        "scripts"
    )

    # Create base directory
    if [ ! -d "$base_path" ]; then
        mkdir -p "$base_path"
        log_success "Created .orchestr8 directory: $base_path"
    fi

    # Create all subdirectories
    for dir in "${dirs[@]}"; do
        local full_path="$base_path/$dir"
        if [ ! -d "$full_path" ]; then
            mkdir -p "$full_path"
            log_info "Created directory: $dir"
        fi
    done

    log_success "Orchestr8 directory structure initialized"
}

# Verify directory structure exists
verify_orchestr8_dirs() {
    local base_path="$1"

    if [ ! -d "$base_path/docs" ]; then
        return 1
    fi

    # Check for at least one subdirectory
    if [ ! -d "$base_path/docs/requirements" ]; then
        return 1
    fi

    return 0
}

##############################################################################
# Path Resolution
##############################################################################

# Get path for orchestr8 file by category and filename
# Usage: get_orchestr8_path "requirements" "analysis.md"
get_orchestr8_path() {
    local category="$1"
    local filename="$2"

    # Validate category
    case "$category" in
        requirements|design|quality|security|performance|accessibility|deployment|analysis|infrastructure|testing)
            ;;
        *)
            log_error "Invalid category: $category"
            return 1
            ;;
    esac

    # Validate filename
    if [ -z "$filename" ]; then
        log_error "Filename cannot be empty"
        return 1
    fi

    echo "$ORCHESTR8_BASE/docs/$category/$filename"
}

# Get base docs path
get_orchestr8_docs_path() {
    echo "$ORCHESTR8_BASE/docs"
}

# Get category path
get_orchestr8_category_path() {
    local category="$1"
    echo "$ORCHESTR8_BASE/docs/$category"
}

##############################################################################
# File Management
##############################################################################

# Save file to orchestr8 with automatic path resolution
# Usage: save_to_orchestr8 "requirements" "analysis.md" "Content here"
save_to_orchestr8() {
    local category="$1"
    local filename="$2"
    local content="$3"

    local filepath
    filepath=$(get_orchestr8_path "$category" "$filename")

    # Ensure directory exists
    mkdir -p "$(dirname "$filepath")"

    # Save content
    echo "$content" > "$filepath"

    log_info "Saved: $category/$filename"
    echo "$filepath"
}

# Copy file to orchestr8
# Usage: copy_to_orchestr8 "/path/to/file.md" "quality" "review.md"
copy_to_orchestr8() {
    local source="$1"
    local category="$2"
    local filename="$3"

    if [ ! -f "$source" ]; then
        log_error "Source file not found: $source"
        return 1
    fi

    local target
    target=$(get_orchestr8_path "$category" "$filename")

    # Ensure directory exists
    mkdir -p "$(dirname "$target")"

    # Copy file
    cp "$source" "$target"

    log_info "Copied: $category/$filename"
    echo "$target"
}

# Check if file exists in orchestr8
# Usage: if orchestr8_file_exists "quality" "code-review.md"; then ...
orchestr8_file_exists() {
    local category="$1"
    local filename="$2"

    local filepath
    filepath=$(get_orchestr8_path "$category" "$filename")

    [ -f "$filepath" ]
}

# Get content of orchestr8 file
# Usage: content=$(get_orchestr8_content "quality" "code-review.md")
get_orchestr8_content() {
    local category="$1"
    local filename="$2"

    local filepath
    filepath=$(get_orchestr8_path "$category" "$filename")

    if [ -f "$filepath" ]; then
        cat "$filepath"
    else
        log_warn "File not found: $category/$filename"
        return 1
    fi
}

##############################################################################
# Cleanup
##############################################################################

# Clean old documentation files (for migrations)
# Usage: cleanup_old_file "requirements-analysis.md"
cleanup_old_file() {
    local filename="$1"

    if [ -f "$filename" ]; then
        rm -f "$filename"
        log_info "Cleaned up: $filename"
    fi
}

# List all files in a category
# Usage: list_orchestr8_files "quality"
list_orchestr8_files() {
    local category="$1"

    local dir
    dir=$(get_orchestr8_category_path "$category")

    if [ -d "$dir" ]; then
        find "$dir" -type f | sort
    fi
}

##############################################################################
# Export Functions
##############################################################################

# Export all functions for use in sourcing script
export -f log_info log_warn log_error log_success
export -f init_orchestr8_dirs verify_orchestr8_dirs
export -f get_orchestr8_path get_orchestr8_docs_path get_orchestr8_category_path
export -f save_to_orchestr8 copy_to_orchestr8 orchestr8_file_exists
export -f get_orchestr8_content cleanup_old_file list_orchestr8_files
export ORCHESTR8_BASE ORCHESTR8_QUIET

##############################################################################
# Initialization
##############################################################################

# Initialize directories on first load
if ! verify_orchestr8_dirs "$ORCHESTR8_BASE"; then
    init_orchestr8_dirs "$ORCHESTR8_BASE"
fi

log_success "Orchestr8 directory helper loaded (base: $ORCHESTR8_BASE)"

# Return 0 to indicate successful loading
return 0 2>/dev/null || true
