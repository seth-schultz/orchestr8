# Security Policy

## Supported Versions

We release security updates for the following versions of Orchestr8:

| Version | Supported          |
| ------- | ------------------ |
| 6.x.x   | :white_check_mark: |
| 5.x.x   | :white_check_mark: |
| < 5.0   | :x:                |

## Security Features

Orchestr8 implements comprehensive security hardening including:

### Layer 1: Sandboxed Execution
- **OS-Level Isolation**: All agents run in Claude Code's `/sandbox` with filesystem and network restrictions
- **Tiered Security**: 3 security tiers (Read-Only, Standard Development, Infrastructure)
- **Protected Paths**: System files, SSH keys, cloud credentials are inaccessible
- **Network Filtering**: Only approved domains (package registries, cloud providers) are accessible

### Layer 2: Input Validation
- **Command Injection Prevention**: All inputs validated against dangerous patterns
- **Path Traversal Protection**: File paths validated to prevent `../` attacks
- **Allowlist-Based Filtering**: Per-agent command allowlists enforced
- **Parameter Sanitization**: All workflow parameters validated before use

### Layer 3: Audit Logging
- **Comprehensive Logging**: All agent executions, commands, and security events logged
- **Structured Format**: JSON logs for easy analysis and monitoring
- **Violation Detection**: Automatic detection of suspicious patterns
- **90-Day Retention**: Security audit trail maintained

### Layer 4: Supply Chain Security
- **Code Signing**: Official plugins are cryptographically signed
- **Verification on Load**: Unsigned plugins are rejected
- **Dependency Scanning**: Automated scanning for vulnerable dependencies
- **Update Monitoring**: Security advisories tracked and patched promptly

## Reporting a Vulnerability

We take security seriously and appreciate responsible disclosure of security vulnerabilities.

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please report security vulnerabilities via one of the following methods:

1. **Email**: Send details to **security@orchestr8.dev** (preferred)
2. **GitHub Security Advisories**: Use the [private vulnerability reporting feature](https://github.com/your-org/orchestr8/security/advisories/new)

### What to Include

Please include the following in your report:

- **Description**: Clear description of the vulnerability
- **Impact**: What an attacker could achieve
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Proof of Concept**: Code or commands demonstrating the vulnerability (if applicable)
- **Affected Versions**: Which versions are affected
- **Suggested Fix**: If you have ideas for how to fix it (optional)

### Response Timeline

We are committed to responding quickly to security reports:

- **Initial Response**: Within 24 hours of report
- **Vulnerability Confirmation**: Within 3 business days
- **Fix Development**: Depends on severity:
  - **Critical**: 7 days
  - **High**: 14 days
  - **Medium**: 30 days
  - **Low**: 60 days
- **Disclosure**: After fix is released (coordinated disclosure)

### Security Severity Levels

We use the following severity classification:

#### Critical
- Arbitrary command execution
- Complete system compromise
- Widespread data exfiltration
- Credential theft affecting all users

#### High
- Limited command execution
- Unauthorized file access
- Data exfiltration from specific contexts
- Privilege escalation

#### Medium
- Information disclosure
- Denial of service
- Bypass of security features
- Incomplete input validation

#### Low
- Security configuration issues
- Low-impact information leaks
- Theoretical vulnerabilities requiring unusual conditions

## Dependency Management & Supply Chain Security

### Automated Dependency Scanning

Orchestr8 employs comprehensive automated dependency scanning:

#### Continuous Monitoring
- **npm audit**: Runs on every PR and push to main
- **Weekly Scans**: Automated security scans every Monday at 9am UTC
- **Dependabot**: Automatic dependency updates and security patches
- **CodeQL**: Static analysis for security vulnerabilities
- **Secret Scanning**: Detects accidentally committed credentials

#### Build Failure Policy
Builds automatically fail on:
- High or critical severity vulnerabilities in dependencies
- Detected secrets or credentials in code
- Copyleft licenses (GPL/AGPL) in production dependencies
- Missing package-lock.json when package.json changes

### Dependency Update Process

#### For Users

**Keeping Dependencies Secure:**

1. **Monitor Security Advisories**: Watch for security advisories via:
   - GitHub Security tab
   - npm audit output
   - Dependabot alerts

2. **Update Regularly**:
   ```bash
   cd plugins/orchestr8
   npm audit                    # Check for vulnerabilities
   npm audit fix                # Auto-fix compatible updates
   npm audit fix --force        # Fix breaking changes (review carefully)
   npm outdated                 # Check for outdated packages
   ```

3. **Review Before Updating**:
   - Read release notes for major version updates
   - Check for breaking changes
   - Test thoroughly in development environment

4. **Install Pre-commit Hooks** (recommended):
   ```bash
   ./plugins/orchestr8/scripts/install-git-hooks.sh
   ```
   This prevents commits with known vulnerabilities.

#### For Contributors

**Contributing Dependency Updates:**

1. **Automated Updates**: Dependabot creates PRs automatically:
   - Security updates: Immediately reviewed and merged
   - Minor/patch updates: Grouped weekly
   - Major updates: Reviewed individually

2. **Manual Updates**: If updating dependencies manually:
   ```bash
   # Update a specific package
   npm update <package-name>
   
   # Update all packages (respecting semver)
   npm update
   
   # Update to latest (including major versions)
   npm install <package-name>@latest
   ```

3. **Before Submitting PR**:
   - Run `npm audit` - must pass for high/critical
   - Run `npm test` - all tests must pass
   - Run `npm run build` - build must succeed
   - Update `package-lock.json` - always commit lock file
   - Document breaking changes in PR description

4. **Pre-commit Checks**: Run locally before committing:
   ```bash
   ./plugins/orchestr8/scripts/pre-commit-security.sh
   ```

#### For Maintainers

**Reviewing Dependency Updates:**

1. **Security Updates** (high priority):
   - Review Dependabot PR
   - Check changelog for breaking changes
   - Run CI/CD pipeline
   - Merge immediately if tests pass
   - Release patch version

2. **Regular Updates**:
   - Review grouped dependency PRs weekly
   - Check for breaking changes
   - Test locally if significant updates
   - Merge when CI passes

3. **Major Version Updates**:
   - Schedule dedicated time for review
   - Read migration guides thoroughly
   - Update code for breaking changes
   - Add tests for new functionality
   - Update documentation
   - Release minor/major version

### Supply Chain Verification

**SBOM (Software Bill of Materials):**
- Generated automatically on every release
- Available in GitHub Actions artifacts
- CycloneDX format for compatibility
- Attached to release assets

**License Compliance:**
- Automated weekly license scanning
- Only permissive licenses allowed in production:
  - MIT, Apache-2.0, ISC
  - BSD-2-Clause, BSD-3-Clause
  - CC0-1.0, Unlicense
- Copyleft licenses (GPL/AGPL) blocked

**Dependency Audit Trail:**
- All dependency changes tracked in git
- Security scan results archived (90 days)
- Audit reports available in CI/CD artifacts

### Vulnerability Response Timeline

When vulnerabilities are discovered in dependencies:

1. **Detection** (automated):
   - Dependabot alert created
   - Security workflow runs
   - Team notified immediately

2. **Assessment** (within 24 hours):
   - Review vulnerability details
   - Assess impact on Orchestr8
   - Determine severity level
   - Check for available patches

3. **Remediation**:
   - **Critical**: Patch within 24-48 hours
   - **High**: Patch within 7 days
   - **Medium**: Patch within 14 days
   - **Low**: Include in next regular update

4. **Release**:
   - Release patch version for critical/high
   - Update security advisory
   - Notify users via release notes

5. **Verification**:
   - Re-run security scans
   - Verify vulnerability resolved
   - Update documentation

## Security Update Process

When we release security fixes:

1. **Fix Development**: We develop and test the fix privately
2. **Security Advisory**: We prepare a security advisory describing:
   - Affected versions
   - Vulnerability description (minimal details to prevent exploitation)
   - Mitigation steps
   - Fixed versions
3. **Release**: We release fixed versions
4. **Notification**: We notify users via:
   - GitHub Security Advisories
   - Release notes
   - Email (for registered users)
5. **Full Disclosure**: 30 days after fix release, we publish full technical details

## Security Best Practices for Users

### For All Users

1. **Keep Updated**: Always use the latest version of Orchestr8
2. **Review Commands**: Review proposed commands before approval (especially Tier 3 agents)
3. **Monitor Logs**: Regularly check `.orchestr8/logs/audit-*.log` for suspicious activity
4. **Report Anomalies**: Report unusual behavior immediately
5. **Secure Your Environment**: Protect your cloud credentials, SSH keys, and secrets

### For Plugin Developers

1. **Validate All Inputs**: Use `InputValidator` for all user inputs
2. **Follow Allowlists**: Design agents with least privilege
3. **No Hardcoded Secrets**: Never commit credentials or API keys
4. **Test Security**: Include security tests in your test suite
5. **Sign Your Plugins**: Sign custom plugins if distributing publicly
6. **Document Security**: Document any security assumptions or requirements

### For Infrastructure Users

1. **Approve Carefully**: Infrastructure agents (Tier 3) require careful review
2. **Least Privilege**: Use IAM roles with minimal required permissions
3. **Separate Environments**: Use separate AWS/cloud accounts for development vs production
4. **Monitor Cloud Logs**: Enable CloudTrail/cloud audit logs
5. **Backup Before Changes**: Always backup before infrastructure changes

## Known Security Limitations

### Documented Escape Hatches

Some tools require access outside the sandbox:

1. **Docker**: Requires host Docker socket (`/var/run/docker.sock`)
   - **Mitigation**: Command validation, audit logging, user awareness
   - **Risk**: Docker commands can access host filesystem via mounts

2. **Kubectl**: Requires kubeconfig and cluster access
   - **Mitigation**: Command validation, audit logging, user approval
   - **Risk**: Kubectl commands can modify cluster resources

3. **Terraform**: May require cloud provider credentials
   - **Mitigation**: Command validation, audit logging, user approval
   - **Risk**: Terraform can create/destroy cloud resources

**Trade-off**: We accept these escape hatches as necessary for functionality, with comprehensive logging and validation as compensating controls.

### Network Domain Filtering

Sandbox allows broad domains (e.g., `*.amazonaws.com`):

- **Limitation**: Could enable data exfiltration to attacker-controlled S3 bucket
- **Mitigation**: Command validation blocks suspicious patterns, audit logging tracks all requests
- **Future**: More granular domain filtering in future versions

## Security Roadmap

Our planned security enhancements:

### Short Term (Next 3 Months)
- [ ] Bug bounty program launch
- [x] Automated security scanning in CI/CD
- [ ] Enhanced anomaly detection in audit logs
- [ ] Security dashboard for real-time monitoring

### Medium Term (3-6 Months)
- [ ] MCP migration for critical infrastructure agents
- [ ] More granular network filtering
- [ ] Optional secrets encryption at rest
- [ ] Security compliance certifications (SOC 2, ISO 27001)

### Long Term (6-12 Months)
- [ ] Zero-trust architecture for agent communication
- [ ] Hardware security module (HSM) integration for signing
- [ ] Advanced threat detection with ML
- [ ] Formal security audit by third party

## Security Contacts

- **General Security Questions**: security@orchestr8.dev
- **Vulnerability Reports**: security@orchestr8.dev
- **Security Team Lead**: [Name/Handle]
- **PGP Key**: [PGP key fingerprint or link]

## Acknowledgments

We thank the following security researchers for responsible disclosure:

<!-- This section will be updated as we receive and address reports -->

*No security reports received yet.*

## Additional Resources

- [Security Guide](./plugins/orchestr8/docs/SECURITY_GUIDE.md) - Detailed security architecture and best practices
- [Contributing Security](./CONTRIBUTING.md#security) - How to contribute security improvements
- [Audit Logs Documentation](./.orchestr8/docs/security/) - How to analyze security logs
- [OWASP Top 10 Compliance](./plugins/orchestr8/docs/SECURITY_GUIDE.md#owasp-compliance) - Our OWASP coverage

---

**Last Updated**: 2025-11-09  
**Policy Version**: 1.0  
**Next Review**: 2026-02-09
