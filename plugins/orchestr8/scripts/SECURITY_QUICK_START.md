# Security Infrastructure Quick Start

## For New Contributors

### 1. Install Security Hooks (Required)

```bash
cd /path/to/orchestr8
./plugins/orchestr8/scripts/install-git-hooks.sh
```

This installs pre-commit checks that run automatically before each commit:
- ✅ Secret detection
- ✅ npm audit (high/critical)
- ✅ Sensitive file detection
- ✅ Package lock sync

### 2. Run Security Checks Manually

```bash
cd plugins/orchestr8

# Check for vulnerabilities
npm audit

# Fix compatible vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated
```

### 3. Bypass Hook (Emergency Only)

```bash
git commit --no-verify  # Not recommended!
```

## For Maintainers

### Daily Tasks

**Check Security Alerts**:
- GitHub → Security tab
- Review Dependabot alerts
- Check CodeQL findings

**Review PRs**:
- Ensure CI security checks passed
- Review dependency updates
- Verify no new vulnerabilities

### Weekly Tasks

**Review Dependabot PRs**:
```bash
# Prioritize by type:
1. Security updates (merge immediately if tests pass)
2. Production dependency updates (review changes)
3. Dev dependency updates (lower priority)
```

**Check Security Reports**:
- Actions → Security Scan workflow
- Download audit artifacts
- Review trends

### Responding to Vulnerabilities

**Critical/High (Immediate)**:
1. Review Dependabot alert
2. Check if exploitable
3. Update dependency: `npm update <package>`
4. Test: `npm test && npm run build`
5. Merge and release patch

**Medium/Low (Scheduled)**:
1. Add to next sprint
2. Group with other updates
3. Include in next minor release

## Security Workflow Status

**View Current Status**:
- [Security Scan Results](https://github.com/seth-skocelas/orchestr8/actions/workflows/security.yml)
- [License Compliance](https://github.com/seth-skocelas/orchestr8/actions/workflows/license-check.yml)
- [Security Policy](../../../SECURITY.md)

**CI/CD Checks**:
- ✅ npm audit (fails on high/critical)
- ✅ CodeQL (static analysis)
- ✅ Secret scanning (Gitleaks)
- ✅ License compliance (blocks GPL/AGPL)
- ✅ Dependency review (PR only)
- ✅ OpenSSF Scorecard

## Quick Commands

### Check for Issues
```bash
# Security audit
npm audit --audit-level=high

# License check
npx license-checker --production --onlyAllow "MIT;Apache-2.0;ISC;BSD-2-Clause;BSD-3-Clause"

# Check for secrets (manual)
grep -r -E "(api_key|password|secret)" --include="*.js" .
```

### Fix Issues
```bash
# Auto-fix vulnerabilities
npm audit fix

# Force fix (may have breaking changes)
npm audit fix --force

# Update specific package
npm update <package-name>

# Update to latest (including major)
npm install <package-name>@latest
```

### View Reports
```bash
# Generate audit report
npm audit --json > audit-report.json

# Generate license report
npx license-checker --json > license-report.json

# Generate SBOM
npx @cyclonedx/cyclonedx-npm --output-file sbom.json
```

## Security Artifacts

**Location**: GitHub Actions → Workflow run → Artifacts

**Available Reports** (90-day retention):
- `security-audit-report-{sha}` - npm audit results (JSON + text)
- `license-reports-{sha}` - License compliance (JSON + CSV)
- `sbom-{sha}` - Software Bill of Materials (CycloneDX)

**Download**:
```bash
gh run download <run-id> -n security-audit-report-{sha}
```

## Troubleshooting

### Hook Not Running
```bash
# Verify hook exists
ls -la .git/hooks/pre-commit

# Reinstall
./plugins/orchestr8/scripts/install-git-hooks.sh

# Make executable
chmod +x .git/hooks/pre-commit
```

### False Positive Secret Detection
```bash
# Add inline comment to suppress
const API_KEY = "test123"; // gitleaks:allow

# Or update .gitleaksignore file
```

### npm audit Failing on Dev Dependencies
```bash
# Audit production only
npm audit --production --audit-level=high

# Or fix dev dependencies separately
npm audit fix --dev
```

## Emergency Contacts

**Security Issues**: security@orchestr8.dev  
**Urgent Vulnerabilities**: File [Security Advisory](https://github.com/seth-skocelas/orchestr8/security/advisories/new)

---

**More Information**:
- [Full Security Documentation](../../../.orchestr8/docs/devops/security-infrastructure-2025-11-09.md)
- [Security Policy](../../../SECURITY.md)
- [Contributing Guidelines](../../../CONTRIBUTING.md)
