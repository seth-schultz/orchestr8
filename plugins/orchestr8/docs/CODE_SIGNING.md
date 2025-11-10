# Code Signing for orchestr8 Plugin

## Overview

The orchestr8 plugin implements cryptographic code signing to prevent supply chain attacks and ensure users can verify they're installing legitimate, unmodified versions of the plugin.

This document covers:
- Why code signing matters
- How to verify plugin authenticity
- How to sign releases (for maintainers)
- Troubleshooting common issues

## Why Code Signing?

Supply chain attacks target the software distribution process by injecting malicious code into legitimate packages. Code signing provides:

1. **Authenticity** - Verify the plugin comes from orchestr8 maintainers
2. **Integrity** - Detect any modifications to plugin files
3. **Non-repudiation** - Cryptographic proof of origin
4. **Trust** - Build confidence in the software supply chain

## Security Model

orchestr8 uses a multi-layered security approach:

```
┌─────────────────────────────────────────────┐
│         GPG Signature (CHECKSUMS.txt.asc)    │
│         Proves: Authentic & Authorized       │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│         SHA256 Checksums (CHECKSUMS.txt)     │
│         Proves: Integrity & Completeness     │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│         Plugin Files (*.js, *.json, *.md)    │
│         Actual code and configuration        │
└─────────────────────────────────────────────┘
```

## For Users: Verifying Plugin Authenticity

### Quick Verification

The simplest way to verify the plugin:

```bash
cd plugins/orchestr8
./scripts/verify-plugin.sh
```

This script automatically:
1. Checks if GPG is installed
2. Imports the orchestr8 public key
3. Verifies the GPG signature
4. Verifies all file checksums
5. Reports any issues

### Manual Verification

If you prefer to verify manually:

#### Step 1: Install GPG

**macOS:**
```bash
brew install gnupg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install gnupg
```

**Fedora/RHEL:**
```bash
sudo dnf install gnupg
```

#### Step 2: Import Public Key

```bash
cd plugins/orchestr8
gpg --import ORCHESTR8_PUBLIC_KEY.asc
```

#### Step 3: Verify Signature

```bash
gpg --verify CHECKSUMS.txt.asc CHECKSUMS.txt
```

Expected output:
```
gpg: Signature made [DATE]
gpg: using RSA key [KEY_ID]
gpg: Good signature from "Orchestr8 Security <security@orchestr8.dev>"
```

#### Step 4: Verify Checksums

```bash
sha256sum -c CHECKSUMS.txt
```

All files should show `OK`.

### Verifying Downloaded Releases

When downloading from GitHub Releases:

1. Download the plugin archive
2. Download `CHECKSUMS.txt` and `CHECKSUMS.txt.asc`
3. Download `ORCHESTR8_PUBLIC_KEY.asc`
4. Run verification:

```bash
gpg --import ORCHESTR8_PUBLIC_KEY.asc
gpg --verify CHECKSUMS.txt.asc CHECKSUMS.txt
sha256sum -c CHECKSUMS.txt
```

### Expected Key Fingerprint

The orchestr8 signing key fingerprint is:

```
pub   rsa4096 [DATE]
      [FINGERPRINT]
uid   Orchestr8 Security <security@orchestr8.dev>
```

Verify this matches by running:
```bash
gpg --fingerprint security@orchestr8.dev
```

## For Maintainers: Signing Releases

### Prerequisites

1. GPG installed (see user verification section)
2. Access to orchestr8 private signing key
3. Write access to orchestr8 repository

### Local Signing

#### First-Time Setup

Generate a signing key (only needed once):

```bash
cd plugins/orchestr8
export GPG_KEY_EMAIL="security@orchestr8.dev"
export GPG_KEY_NAME="Orchestr8 Security"
./scripts/sign-plugin.sh
```

The script will:
1. Generate a 4096-bit RSA key pair
2. Export the public key to `ORCHESTR8_PUBLIC_KEY.asc`
3. Generate checksums for all plugin files
4. Sign the checksums with GPG
5. Verify the signature

#### Subsequent Releases

```bash
cd plugins/orchestr8
./scripts/sign-plugin.sh
```

This will:
1. Use the existing GPG key
2. Regenerate checksums for all files
3. Create a new signature
4. Verify everything

### Automated Signing with GitHub Actions

orchestr8 includes a GitHub Actions workflow that automatically signs releases when you push a tag.

#### Setup

1. **Export Private Key**

```bash
gpg --armor --export-secret-keys security@orchestr8.dev > orchestr8-private-key.asc
```

**WARNING:** Keep this file secure! Never commit it to the repository.

2. **Add GitHub Secret**

- Go to GitHub repository settings
- Navigate to Secrets and Variables > Actions
- Add a new secret named `GPG_PRIVATE_KEY`
- Paste the contents of `orchestr8-private-key.asc`
- Delete the local file securely:

```bash
shred -u orchestr8-private-key.asc  # Linux
rm -P orchestr8-private-key.asc     # macOS
```

3. **Create Release**

```bash
git tag v1.2.3
git push origin v1.2.3
```

The workflow will automatically:
- Sign the plugin
- Verify the signature
- Create a GitHub Release
- Attach signature files
- Commit signatures to the repository

### What Gets Signed

The signing process creates checksums for:

- `plugin.json` - Plugin metadata
- `package.json` - Node.js dependencies
- All `.js` files in `lib/` - Core functionality
- All `.md` files - Documentation
- Command and agent definitions

Excluded from signing:
- `node_modules/` - Third-party dependencies
- `coverage/` - Test coverage reports
- `tests/` - Test files
- `package-lock.json` - Auto-generated
- Build artifacts

## Security Best Practices

### For Users

1. **Always Verify** - Run `verify-plugin.sh` before using the plugin
2. **Check Fingerprints** - Verify the key fingerprint matches expected values
3. **Use Official Sources** - Only download from official GitHub repository
4. **Keep GPG Updated** - Ensure GPG is up to date with security patches
5. **Report Issues** - Contact security@orchestr8.dev if verification fails

### For Maintainers

1. **Protect Private Keys** - Never commit private keys to repositories
2. **Use Strong Passphrases** - Protect keys with strong passphrases
3. **Rotate Keys** - Rotate signing keys every 2 years
4. **Audit Signatures** - Review all signature operations
5. **Separate Environments** - Use different keys for dev/staging/production
6. **Backup Keys** - Securely backup private keys
7. **Revoke Compromised Keys** - Immediately revoke if keys are compromised

## Troubleshooting

### "GPG not installed"

Install GPG:
- macOS: `brew install gnupg`
- Ubuntu: `sudo apt-get install gnupg`
- Fedora: `sudo dnf install gnupg`

### "Signature verification failed"

Possible causes:
1. Plugin files were modified after signing
2. Wrong public key imported
3. Signature file is corrupted

Solutions:
- Re-download the plugin from official source
- Verify you imported the correct public key
- Check the GPG key fingerprint

### "Key is not certified with a trusted signature"

This warning is normal if you haven't explicitly trusted the key.

To trust the key:
```bash
gpg --edit-key security@orchestr8.dev
> trust
> 5 (ultimate trust)
> quit
```

### "sha256sum command not found" (macOS)

Install coreutils:
```bash
brew install coreutils
```

### "No secret key" when signing

You don't have the private signing key. This is normal for users.

For maintainers: Import the private key or generate a new one.

### Files missing from CHECKSUMS.txt

The signing script may have excluded certain files. Check:
- File is not in `node_modules/`
- File is not in `coverage/` or `tests/`
- File has extension `.js`, `.json`, or `.md`

Re-run the signing script to regenerate checksums.

## Key Rotation

orchestr8 signing keys expire after 2 years. When a key expires:

1. Generate a new key pair
2. Sign the new public key with the old private key (continuity)
3. Update GitHub secrets with new private key
4. Release announcement with new public key
5. Revoke old key after transition period

## Reporting Security Issues

If you discover a security issue with code signing:

1. **DO NOT** open a public GitHub issue
2. Email security@orchestr8.dev with details
3. Use PGP encryption for sensitive information
4. Allow 90 days for coordinated disclosure

## References

- [GPG Documentation](https://gnupg.org/documentation/)
- [GitHub Code Signing](https://docs.github.com/en/authentication/managing-commit-signature-verification)
- [Supply Chain Security Best Practices](https://slsa.dev/)
- [NIST Cryptographic Standards](https://csrc.nist.gov/publications)

## FAQ

### Q: Why GPG instead of other signing methods?

GPG is industry-standard, widely supported, and provides strong cryptographic guarantees. It's used by major projects like Linux kernel, Debian packages, and npm packages.

### Q: Can I use my own GPG key to verify?

No. You must use the orchestr8 public key to verify signatures. However, you can sign the orchestr8 key with your own key to build a web of trust.

### Q: What if verification fails?

Do not use the plugin. Download from the official source and verify again. If it still fails, report to security@orchestr8.dev.

### Q: Is code signing required?

While not technically required, it's strongly recommended for production use. Verification ensures you're running authentic orchestr8 code.

### Q: How often should I verify?

Verify:
- On first installation
- After updates
- Before production deployments
- Periodically (monthly recommended)

### Q: What algorithms are used?

- **Signing**: RSA 4096-bit
- **Hashing**: SHA-256
- **Signature format**: GPG/PGP (RFC 4880)

These provide strong security for the foreseeable future.

---

**Last Updated:** 2025-11-09  
**Version:** 1.0.0  
**Contact:** security@orchestr8.dev
