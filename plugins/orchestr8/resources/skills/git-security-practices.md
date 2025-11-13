---
id: git-security-practices
category: skill
tags: [git, security, gpg, signing, secrets-scanning, credential-management, audit, compliance, security-best-practices]
capabilities:
  - Implement GPG signing for commits and tags
  - Prevent secrets from entering Git history
  - Manage Git credentials securely
  - Audit repository for security vulnerabilities
  - Apply security best practices to Git workflows
useWhen:
  - Setting up GPG commit signing for verification
  - Implementing secret scanning in Git repositories
  - Configuring secure credential management
  - Auditing Git history for leaked secrets
  - Enforcing signed commits in repositories
  - Managing SSH keys for Git authentication
  - Implementing Git security policies
  - Preventing sensitive data commits
  - Setting up pre-commit security hooks
  - Configuring Git for compliance requirements
  - Managing repository access controls
  - Implementing branch protection rules
  - Scanning for vulnerabilities in dependencies
  - Securing CI/CD Git operations
  - Implementing Git forensics and audit trails
relatedResources:
  - orchestr8://agents/security-auditor
  - orchestr8://agents/git-expert
  - orchestr8://skills/git-workflow
  - orchestr8://skills/git-hooks-automation
  - orchestr8://skills/security-owasp-top10
  - orchestr8://skills/security-secrets-management
  - orchestr8://patterns/security-audit-practices
estimatedTokens: 870
---

# Git Security Practices

## GPG Commit Signing

```bash
# Generate GPG key
gpg --full-generate-key
# Select: (1) RSA and RSA
# Key size: 4096
# Expiration: 1y (or appropriate for your policy)
# Enter name and email matching Git config

# List GPG keys
gpg --list-secret-keys --keyid-format=long

# Output:
# sec   rsa4096/ABC123DEF456 2024-01-01 [SC] [expires: 2025-01-01]
# uid   [ultimate] Your Name <your.email@example.com>

# Export GPG public key
gpg --armor --export ABC123DEF456

# Configure Git to use GPG key
git config --global user.signingkey ABC123DEF456
git config --global commit.gpgsign true    # Sign all commits
git config --global tag.gpgsign true       # Sign all tags

# Set GPG program (if needed)
git config --global gpg.program gpg

# Sign individual commit
git commit -S -m "feat: add secure authentication"

# Sign tag
git tag -s v1.0.0 -m "Release version 1.0.0"

# Verify signed commit
git log --show-signature
git verify-commit abc123

# Verify signed tag
git verify-tag v1.0.0
git tag -v v1.0.0

# Upload GPG key to GitHub
# Copy output from: gpg --armor --export ABC123DEF456
# Paste to: GitHub Settings > SSH and GPG keys > New GPG key

# Configure Git to always verify signatures
git config --global log.showSignature true

# Export and backup GPG keys
gpg --export-secret-keys --armor ABC123DEF456 > private-key.asc
gpg --export --armor ABC123DEF456 > public-key.asc
# Store securely (encrypted backup, password manager)

# Import GPG keys on new machine
gpg --import private-key.asc
gpg --import public-key.asc
gpg --edit-key ABC123DEF456
# Type "trust" then "5" (ultimate trust) then "quit"
```

## Secret Scanning and Prevention

```bash
# Install git-secrets
# macOS
brew install git-secrets

# Linux
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
sudo make install

# Initialize in repository
cd your-repo
git secrets --install
git secrets --register-aws  # AWS patterns

# Add custom patterns
git secrets --add 'password\s*=\s*[^\s]+'
git secrets --add 'api[_-]?key\s*=\s*[^\s]+'
git secrets --add --allowed 'example\.com/api-key'  # Whitelist

# Scan repository
git secrets --scan                    # Scan uncommitted files
git secrets --scan-history            # Scan entire history
git secrets --scan-history --branch main

# Install globally for all repos
git secrets --install ~/.git-templates/git-secrets
git config --global init.templatedir ~/.git-templates/git-secrets

# Alternative: gitleaks
# Install gitleaks
brew install gitleaks

# Scan repository
gitleaks detect --source . --verbose
gitleaks detect --source . --report-path report.json

# Scan specific commits
gitleaks detect --log-opts "HEAD~10..HEAD"

# Custom gitleaks config
cat > .gitleaks.toml << 'EOF'
title = "Custom Gitleaks Config"

[[rules]]
id = "api-key"
description = "API Key"
regex = '''(?i)(api[_-]?key|apikey)\s*[:=]\s*['"]?[a-zA-Z0-9]{32,}['"]?'''
tags = ["key", "api"]

[[rules]]
id = "private-key"
description = "Private Key"
regex = '''-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----'''
tags = ["key", "private"]

[allowlist]
paths = ['''^\.gitleaks\.toml$''']
commits = ["abc123def456"]  # Known safe commits
EOF

gitleaks detect --config .gitleaks.toml

# Alternative: truffleHog
pip install truffleHog
trufflehog git file://. --json --regex
```

## Pre-commit Security Hooks

```bash
# Install pre-commit framework
pip install pre-commit

# Create .pre-commit-config.yaml
cat > .pre-commit-config.yaml << 'EOF'
repos:
  # General security checks
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: detect-private-key
      - id: check-added-large-files
        args: ['--maxkb=1000']
      - id: check-merge-conflict
      - id: check-yaml
      - id: end-of-file-fixer
      - id: trailing-whitespace

  # Secret scanning
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']

  # Gitleaks
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks

  # Python security
  - repo: https://github.com/PyCQA/bandit
    rev: '1.7.5'
    hooks:
      - id: bandit
        args: ['-r', 'src/']

  # JavaScript security
  - repo: local
    hooks:
      - id: npm-audit
        name: npm audit
        entry: npm audit --audit-level=moderate
        language: system
        pass_filenames: false

  # Terraform security
  - repo: https://github.com/antonbabenko/pre-commit-terraform
    rev: v1.83.5
    hooks:
      - id: terraform_tfsec
EOF

# Install hooks
pre-commit install
pre-commit install --hook-type commit-msg

# Run manually
pre-commit run --all-files

# Update hooks
pre-commit autoupdate

# Skip hooks (emergency only)
git commit --no-verify -m "emergency fix"
```

## Secure Credential Management

```bash
# Configure credential helper
# macOS Keychain
git config --global credential.helper osxkeychain

# Linux (libsecret)
git config --global credential.helper /usr/share/doc/git/contrib/credential/libsecret/git-credential-libsecret

# Windows Credential Manager
git config --global credential.helper wincred

# Cache credentials temporarily
git config --global credential.helper 'cache --timeout=3600'

# Store credentials (less secure - use with caution)
git config --global credential.helper store
# Creates ~/.git-credentials in plain text

# Use SSH keys instead of passwords
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com" -f ~/.ssh/id_ed25519_github
# Add passphrase for additional security

# Add SSH key to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_github

# Configure SSH config
cat >> ~/.ssh/config << 'EOF'
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_github
  IdentitiesOnly yes
EOF

# Add public key to GitHub
cat ~/.ssh/id_ed25519_github.pub
# Add to: GitHub Settings > SSH and GPG keys

# Test SSH connection
ssh -T git@github.com

# Use SSH URLs for remotes
git remote set-url origin git@github.com:owner/repo.git

# Personal Access Tokens (PAT)
# Generate at: GitHub Settings > Developer settings > Personal access tokens
# Use in place of password for HTTPS
# Store in credential helper, not in code or scripts

# Environment variable for CI/CD
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxx
git clone https://oauth2:${GITHUB_TOKEN}@github.com/owner/repo.git
```

## Repository Audit and Cleanup

```bash
# Scan for large files
git rev-list --objects --all | \
  git cat-file --batch-check='%(objecttype) %(objectname) %(objectsize) %(rest)' | \
  sed -n 's/^blob //p' | \
  sort --numeric-sort --key=2 | \
  tail -20

# Find large files by path
git rev-list --all --objects | \
  awk '{print $1}' | \
  git cat-file --batch-check | \
  grep blob | \
  sort -k3 -n -r | \
  head -20

# Remove sensitive file from history (use BFG Repo-Cleaner)
# Install BFG
brew install bfg

# Remove file from history
bfg --delete-files secrets.env
bfg --replace-text passwords.txt  # Replace with ***REMOVED***

# Alternative: git-filter-repo
pip install git-filter-repo

# Remove specific files
git filter-repo --path secrets.env --invert-paths

# Remove by regex pattern
git filter-repo --path-regex '.*/\.env.*' --invert-paths

# Force push to rewrite history (DANGER - coordinate with team!)
git push origin --force --all
git push origin --force --tags

# Invalidate cached data on GitHub
# Contact GitHub support to clear cached data

# Audit commit authors
git log --format='%aN <%aE>' | sort -u

# Find unsigned commits
git log --pretty="format:%H %G?" | grep -v " G$"

# Audit branch protection
gh api repos/owner/repo/branches/main/protection

# Review collaborator access
gh api repos/owner/repo/collaborators
```

## Security Best Practices

```bash
# 1. Never commit secrets
# Add to .gitignore immediately
cat >> .gitignore << 'EOF'
# Secrets and credentials
.env
.env.*
*.pem
*.key
*.p12
*.pfx
secrets.yaml
credentials.json
service-account.json

# OS and IDE
.DS_Store
.vscode/settings.json
.idea/
EOF

# 2. Use environment variables
# Instead of: API_KEY = "abc123"
# Use: API_KEY = os.getenv("API_KEY")

# 3. Rotate exposed secrets immediately
# If secret committed:
# - Revoke the secret
# - Generate new secret
# - Remove from Git history
# - Update all dependent systems

# 4. Enable branch protection
gh api repos/owner/repo/branches/main/protection -X PUT --input - << 'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci/test", "security/scan"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismissal_restrictions": {},
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": true,
    "required_approving_review_count": 2
  },
  "restrictions": null,
  "required_signatures": true
}
EOF

# 5. Enable security features
gh api repos/owner/repo -X PATCH --input - << 'EOF'
{
  "security_and_analysis": {
    "secret_scanning": {"status": "enabled"},
    "secret_scanning_push_protection": {"status": "enabled"},
    "dependabot_security_updates": {"status": "enabled"}
  }
}
EOF

# 6. Regular security audits
# Weekly: Scan for secrets
gitleaks detect --source . --report-path weekly-report.json

# Monthly: Review access
gh api repos/owner/repo/collaborators | jq -r '.[].login'

# Quarterly: Audit dependencies
npm audit
pip-audit

# 7. Secure CI/CD
# Use secrets management in CI
# GitHub Actions: Use encrypted secrets
# Never echo secrets in logs
# Use --quiet flags for commands handling secrets
```

## Compliance and Audit Trail

```bash
# Git forensics - track changes to sensitive files
git log --follow --all --patch -- config/database.yml

# Audit specific time period
git log --since="2024-01-01" --until="2024-12-31" --all

# Export audit log
git log --all --pretty=format:"%H|%an|%ae|%ad|%s" --date=iso > audit-log.csv

# Find who deleted file
git log --all --full-history -- path/to/deleted/file

# Track file renames and moves
git log --follow --find-renames --stat -- original-name.js

# Sign past commits (with care)
git rebase --exec 'git commit --amend --no-edit -n -S' -i main
```
