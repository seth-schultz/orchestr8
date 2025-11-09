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
- [ ] Automated security scanning in CI/CD
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
