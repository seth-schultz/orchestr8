#!/bin/bash
# verify-plugin.sh - Verification script for orchestr8 plugin
# Verifies GPG signatures and file checksums to prevent supply chain attacks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
CHECKSUMS_FILE="CHECKSUMS.txt"
SIGNATURE_FILE="CHECKSUMS.txt.asc"
PUBLIC_KEY_FILE="ORCHESTR8_PUBLIC_KEY.asc"

# Function to print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if GPG is installed
check_gpg_installed() {
    if ! command -v gpg &> /dev/null; then
        print_error "GPG is not installed. Please install GPG first:"
        echo "  macOS:   brew install gnupg"
        echo "  Ubuntu:  sudo apt-get install gnupg"
        echo "  Fedora:  sudo dnf install gnupg"
        exit 1
    fi
}

# Check if required files exist
check_required_files() {
    cd "$PLUGIN_DIR"

    local missing_files=()

    if [ ! -f "$CHECKSUMS_FILE" ]; then
        missing_files+=("$CHECKSUMS_FILE")
    fi

    if [ ! -f "$SIGNATURE_FILE" ]; then
        missing_files+=("$SIGNATURE_FILE")
    fi

    if [ ${#missing_files[@]} -gt 0 ]; then
        print_error "Required files not found:"
        for file in "${missing_files[@]}"; do
            echo "  - $file"
        done
        echo ""
        print_info "This plugin may not be signed. To sign it, run:"
        echo "  ./scripts/sign-plugin.sh"
        exit 1
    fi
}

# Import public key if available and not already imported
import_public_key_if_needed() {
    cd "$PLUGIN_DIR"

    if [ -f "$PUBLIC_KEY_FILE" ]; then
        local key_email=$(gpg --show-keys "$PUBLIC_KEY_FILE" 2>/dev/null | grep -oP '(?<=<)[^>]+(?=>)' | head -1)

        if [ -n "$key_email" ]; then
            if ! gpg --list-keys "$key_email" &>/dev/null; then
                print_info "Importing public key from $PUBLIC_KEY_FILE"
                gpg --import "$PUBLIC_KEY_FILE" 2>/dev/null
                print_success "Public key imported"
            else
                print_info "Public key already imported"
            fi
        fi
    else
        print_warning "Public key file ($PUBLIC_KEY_FILE) not found"
        print_info "You may need to import the orchestr8 public key manually:"
        echo "  gpg --import ORCHESTR8_PUBLIC_KEY.asc"
        echo ""
    fi
}

# Verify GPG signature
verify_gpg_signature() {
    print_info "Verifying GPG signature..."

    cd "$PLUGIN_DIR"

    # Capture verification output
    local verify_output
    verify_output=$(gpg --verify "$SIGNATURE_FILE" "$CHECKSUMS_FILE" 2>&1)
    local verify_status=$?

    if echo "$verify_output" | grep -q "Good signature"; then
        print_success "GPG signature is valid"

        # Extract signer information
        local signer=$(echo "$verify_output" | grep "Good signature" | sed 's/.*from "\(.*\)".*/\1/')
        print_info "Signed by: $signer"

        # Check if key is trusted
        if echo "$verify_output" | grep -q "WARNING.*not certified"; then
            print_warning "Key is not certified with a trusted signature"
            print_info "This is normal if you haven't explicitly trusted the key"
            print_info "To trust the key, run: gpg --edit-key <key-id> trust"
        fi

        return 0
    else
        print_error "GPG signature verification failed"
        echo "$verify_output"
        return 1
    fi
}

# Verify file checksums
verify_checksums() {
    print_info "Verifying file checksums..."

    cd "$PLUGIN_DIR"

    # Check if sha256sum is available
    if ! command -v sha256sum &> /dev/null; then
        print_error "sha256sum command not found"
        print_info "On macOS, you may need to install coreutils: brew install coreutils"
        exit 1
    fi

    # Verify checksums
    local checksum_output
    checksum_output=$(sha256sum -c "$CHECKSUMS_FILE" 2>&1)
    local checksum_status=$?

    if [ $checksum_status -eq 0 ]; then
        local file_count=$(wc -l < "$CHECKSUMS_FILE")
        print_success "All checksums verified ($file_count files)"
        return 0
    else
        print_error "Checksum verification failed"
        echo "$checksum_output" | grep -i "FAILED"
        return 1
    fi
}

# Display verification summary
display_summary() {
    local signature_status=$1
    local checksum_status=$2

    echo ""
    echo "========================================="
    echo "  Verification Summary"
    echo "========================================="
    echo ""

    if [ $signature_status -eq 0 ] && [ $checksum_status -eq 0 ]; then
        print_success "Plugin verification PASSED"
        echo ""
        echo "The orchestr8 plugin is authentic and unmodified."
        echo "All files have been cryptographically verified."
        echo ""
        return 0
    else
        print_error "Plugin verification FAILED"
        echo ""
        echo "WARNING: This plugin may have been tampered with!"
        echo "Do NOT use this plugin in production environments."
        echo ""

        if [ $signature_status -ne 0 ]; then
            echo "  - GPG signature verification failed"
        fi

        if [ $checksum_status -ne 0 ]; then
            echo "  - File checksum verification failed"
        fi
        echo ""

        return 1
    fi
}

# Display key fingerprint
display_key_info() {
    cd "$PLUGIN_DIR"

    if [ -f "$PUBLIC_KEY_FILE" ]; then
        echo "Expected Key Fingerprint:"
        gpg --show-keys "$PUBLIC_KEY_FILE" 2>/dev/null | grep -A 1 "Key fingerprint" || true
        echo ""
    fi
}

# Main execution
main() {
    echo ""
    echo "========================================="
    echo "  orchestr8 Plugin Verification"
    echo "========================================="
    echo ""

    check_gpg_installed
    check_required_files
    import_public_key_if_needed
    display_key_info

    # Run verification steps
    verify_gpg_signature
    local signature_status=$?

    verify_checksums
    local checksum_status=$?

    # Display summary and exit with appropriate code
    display_summary $signature_status $checksum_status
    local summary_status=$?

    exit $summary_status
}

# Run main function
main
