#!/bin/bash
# sign-plugin.sh - Code signing script for orchestr8 plugin
# Prevents supply chain attacks by cryptographically signing plugin files

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
GPG_KEY_EMAIL="${GPG_KEY_EMAIL:-security@orchestr8.dev}"
GPG_KEY_NAME="${GPG_KEY_NAME:-Orchestr8 Security}"
CHECKSUMS_FILE="CHECKSUMS.txt"
SIGNATURE_FILE="CHECKSUMS.txt.asc"

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

# Generate GPG key if it doesn't exist
generate_gpg_key_if_needed() {
    if gpg --list-keys "$GPG_KEY_EMAIL" &>/dev/null; then
        print_info "GPG key already exists for $GPG_KEY_EMAIL"
        return 0
    fi

    print_info "Generating new GPG key for $GPG_KEY_EMAIL..."
    print_warning "This will create a GPG key without a passphrase for CI/CD automation"
    print_warning "For production use, consider adding a passphrase and storing it securely"

    # Generate key with batch mode
    gpg --batch --gen-key <<EOF
Key-Type: RSA
Key-Length: 4096
Subkey-Type: RSA
Subkey-Length: 4096
Name-Real: $GPG_KEY_NAME
Name-Email: $GPG_KEY_EMAIL
Expire-Date: 2y
%no-protection
%commit
EOF

    if [ $? -eq 0 ]; then
        print_success "GPG key generated successfully"
        print_info "Key details:"
        gpg --list-keys "$GPG_KEY_EMAIL"
    else
        print_error "Failed to generate GPG key"
        exit 1
    fi
}

# Export public key for distribution
export_public_key() {
    local public_key_file="$PLUGIN_DIR/ORCHESTR8_PUBLIC_KEY.asc"

    print_info "Exporting public key to $public_key_file"
    gpg --armor --export "$GPG_KEY_EMAIL" > "$public_key_file"

    if [ -s "$public_key_file" ]; then
        print_success "Public key exported successfully"
        print_info "Users can import this key with: gpg --import ORCHESTR8_PUBLIC_KEY.asc"
    else
        print_error "Failed to export public key"
        exit 1
    fi
}

# Generate checksums for all plugin files
generate_checksums() {
    print_info "Generating checksums for plugin files..."

    cd "$PLUGIN_DIR"

    # Remove old checksums file if it exists
    rm -f "$CHECKSUMS_FILE" "$SIGNATURE_FILE"

    # Find and hash all important files
    # Includes: .json, .js, .md files but excludes node_modules, coverage, tests
    find . -type f \( \
        -name "*.json" -o \
        -name "*.js" -o \
        -name "*.md" \
    \) \
        -not -path "*/node_modules/*" \
        -not -path "*/coverage/*" \
        -not -path "*/tests/*" \
        -not -path "*/.git/*" \
        -not -path "*/target/*" \
        -not -name "package-lock.json" \
        -not -name "CHECKSUMS.txt*" \
        -not -name "ORCHESTR8_PUBLIC_KEY.asc" \
        | sort | while read -r file; do
        sha256sum "$file" >> "$CHECKSUMS_FILE"
    done

    if [ -s "$CHECKSUMS_FILE" ]; then
        local file_count=$(wc -l < "$CHECKSUMS_FILE")
        print_success "Generated checksums for $file_count files"
        print_info "Checksum file: $CHECKSUMS_FILE"
    else
        print_error "Failed to generate checksums"
        exit 1
    fi
}

# Sign the checksums file
sign_checksums() {
    print_info "Signing checksums with GPG..."

    cd "$PLUGIN_DIR"

    # Create detached signature
    gpg --detach-sign --armor --local-user "$GPG_KEY_EMAIL" "$CHECKSUMS_FILE"

    if [ -f "$SIGNATURE_FILE" ]; then
        print_success "Checksums signed successfully"
        print_info "Signature file: $SIGNATURE_FILE"
    else
        print_error "Failed to sign checksums"
        exit 1
    fi
}

# Verify the signature (self-check)
verify_signature() {
    print_info "Verifying signature (self-check)..."

    cd "$PLUGIN_DIR"

    if gpg --verify "$SIGNATURE_FILE" "$CHECKSUMS_FILE" 2>&1 | grep -q "Good signature"; then
        print_success "Signature verification passed"
    else
        print_error "Signature verification failed"
        exit 1
    fi
}

# Display signing summary
display_summary() {
    echo ""
    echo "========================================="
    echo "  Code Signing Complete"
    echo "========================================="
    echo ""
    print_success "Plugin signed successfully!"
    echo ""
    echo "Generated files:"
    echo "  - $CHECKSUMS_FILE (SHA256 checksums)"
    echo "  - $SIGNATURE_FILE (GPG signature)"
    echo "  - ORCHESTR8_PUBLIC_KEY.asc (Public key for verification)"
    echo ""
    echo "Next steps:"
    echo "  1. Verify: ./scripts/verify-plugin.sh"
    echo "  2. Commit signature files to repository"
    echo "  3. Distribute ORCHESTR8_PUBLIC_KEY.asc to users"
    echo ""
    echo "For GitHub Actions setup:"
    echo "  1. Export private key: gpg --armor --export-secret-keys $GPG_KEY_EMAIL > orchestr8-private-key.asc"
    echo "  2. Add as GitHub secret: GPG_PRIVATE_KEY"
    echo "  3. Never commit private key to repository!"
    echo ""
    echo "GPG Key Fingerprint:"
    gpg --fingerprint "$GPG_KEY_EMAIL" | grep -A 1 "Key fingerprint"
    echo ""
}

# Main execution
main() {
    echo ""
    echo "========================================="
    echo "  orchestr8 Plugin Code Signing"
    echo "========================================="
    echo ""

    check_gpg_installed
    generate_gpg_key_if_needed
    export_public_key
    generate_checksums
    sign_checksums
    verify_signature
    display_summary
}

# Run main function
main
