# Code Signing Quick Reference

## For Users: Verify Plugin

```bash
cd plugins/orchestr8
./scripts/verify-plugin.sh
```

Expected: "Plugin verification PASSED"

## For Maintainers: Sign Release

### First Time Setup

```bash
# 1. Install GPG
brew install gnupg  # macOS
# OR
sudo apt-get install gnupg  # Ubuntu

# 2. Generate signing key
cd plugins/orchestr8
./scripts/sign-plugin.sh

# 3. Export private key for GitHub
gpg --armor --export-secret-keys security@orchestr8.dev > orchestr8-private-key.asc

# 4. Add to GitHub Secrets
# Repository Settings > Secrets > Actions > New secret
# Name: GPG_PRIVATE_KEY
# Value: <paste contents of orchestr8-private-key.asc>

# 5. IMPORTANT: Delete private key file securely
shred -u orchestr8-private-key.asc  # Linux
rm -P orchestr8-private-key.asc     # macOS
```

### Sign Each Release

```bash
# Manual signing
cd plugins/orchestr8
./scripts/sign-plugin.sh
git add CHECKSUMS.txt CHECKSUMS.txt.asc ORCHESTR8_PUBLIC_KEY.asc
git commit -m "chore: add code signatures"

# Create and push tag (triggers automated signing)
git tag v1.2.3
git push origin v1.2.3
```

## Troubleshooting

### GPG not installed
```bash
brew install gnupg  # macOS
```

### Verification fails
```bash
# Re-download from official source
git clone https://github.com/seth-schultz/orchestr8.git
cd orchestr8/plugins/orchestr8
./scripts/verify-plugin.sh
```

### Missing signature files
```bash
# Generate signatures
./scripts/sign-plugin.sh
```

## Files Generated

- `CHECKSUMS.txt` - SHA256 checksums of all plugin files
- `CHECKSUMS.txt.asc` - GPG signature of checksums
- `ORCHESTR8_PUBLIC_KEY.asc` - Public key for verification

## Key Information

- **Email**: security@orchestr8.dev
- **Algorithm**: RSA 4096-bit
- **Expiration**: 2 years from generation
- **Hash**: SHA256

## Documentation

- Full Guide: `docs/CODE_SIGNING.md`
- Test Results: `scripts/test-signing-workflow.md`
- Implementation Report: `.orchestr8/docs/security/code-signing-implementation-2025-11-09.md`

## Security Contact

Report security issues: security@orchestr8.dev
