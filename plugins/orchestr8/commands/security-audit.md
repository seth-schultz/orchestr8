---
description: Security vulnerability assessment covering authentication, authorization,
  input validation, and infrastructure
allowed-tools:
- Bash
- Edit
- Glob
- Grep
- Read
- SlashCommand
- TodoWrite
- Write
---

# Security Audit: $ARGUMENTS

**Request:** $ARGUMENTS


## How to Load MCP Resources

**CRITICAL:** All `orchestr8://` URIs in this workflow must be loaded using `ReadMcpResourceTool` with `server: "plugin:orchestr8:orchestr8-resources"` and the `uri` parameter set to the resource URI shown.

For detailed instructions and examples, load: `orchestr8://guides/mcp-resource-loading`


## Your Role

You are the **Security Auditor** responsible for comprehensive security assessment, vulnerability identification, risk analysis, and remediation guidance.

## Phase 1: Authentication & Authorization (0-25%)

**→ Load:** orchestr8://workflows/workflow-security-audit

**Activities:**
- Review authentication implementation
- Check password/credential handling
- Verify token generation and validation
- Test session management
- Review RBAC/ABAC implementation
- Check authorization enforcement
- Test privilege escalation scenarios
- Verify logout and session invalidation

**Deliverable:** Authentication security report

**→ Checkpoint:** Auth vulnerabilities identified

## Phase 2: Input Validation & Output Encoding (25-50%)

**→ Load:** orchestr8://match?query=security+validation+sql+injection+xss&categories=skill,pattern&mode=index&maxResults=8

**Activities:**
- Test for SQL injection vulnerabilities
- Check for XSS (reflected, stored, DOM-based)
- Verify input validation on all endpoints
- Test output encoding and sanitization
- Check for CSRF protection
- Review file upload security
- Test for command injection
- Verify API input validation
- Check for path traversal vulnerabilities

**Deliverable:** Input/output security report

**→ Checkpoint:** Injection vulnerabilities documented

## Phase 3: Infrastructure & Configuration (50-75%)

**→ Load:** orchestr8://match?query=security+infrastructure+secrets+tls+cors&categories=skill,guide&mode=index&maxResults=8

**Activities:**
- Review secrets management
- Check environment variable security
- Verify HTTPS/TLS configuration
- Review CORS policy
- Check rate limiting and throttling
- Test for information disclosure
- Review error handling (no sensitive info leaked)
- Check dependency vulnerabilities
- Verify security headers
- Review logging (no sensitive data logged)

**Deliverable:** Infrastructure security report

**→ Checkpoint:** Configuration issues identified

## Phase 4: Risk Assessment & Remediation (75-100%)

**→ Load:** orchestr8://match?query=security+remediation+owasp+risk+assessment&categories=skill,pattern&mode=index&maxResults=5

**Activities:**
- Map findings to OWASP Top 10
- Assess risk levels (Critical/High/Medium/Low)
- Calculate CVSS scores where applicable
- Prioritize remediation based on risk
- Create remediation plans with steps
- Provide code examples for fixes
- Document prevention strategies
- Recommend security tools and practices
- Create security improvement roadmap

**Deliverable:** Comprehensive security audit report with remediation plan

**→ Checkpoint:** Report complete with prioritized action plan

## Security Audit Report Structure

### Executive Summary
- Overall security posture
- Critical vulnerabilities count
- High-risk issues count
- Compliance status

### Vulnerability Details

#### Critical Vulnerabilities
- Description and impact
- Proof of concept
- Remediation steps
- CVSS score

#### High-Risk Issues
- Security concerns
- Exploitation scenarios
- Mitigation strategies

#### Medium/Low-Risk Issues
- Findings
- Recommendations
- Best practices

### OWASP Top 10 Assessment
- A01: Broken Access Control
- A02: Cryptographic Failures
- A03: Injection
- A04: Insecure Design
- A05: Security Misconfiguration
- A06: Vulnerable Components
- A07: Authentication Failures
- A08: Software/Data Integrity Failures
- A09: Security Logging/Monitoring Failures
- A10: Server-Side Request Forgery

### Remediation Plan
1. **Immediate (Critical):** Fix within 24-48 hours
2. **Urgent (High):** Fix within 1-2 weeks
3. **Important (Medium):** Fix within 1-2 months
4. **Planned (Low):** Include in roadmap

### Prevention Strategies
- Secure coding practices
- Security testing integration
- Developer training recommendations
- Security tools and automation

## Success Criteria

✅ Authentication/authorization thoroughly tested
✅ Input validation assessed on all endpoints
✅ Injection vulnerabilities identified
✅ Infrastructure security reviewed
✅ Secrets management evaluated
✅ TLS/HTTPS configuration verified
✅ OWASP Top 10 assessment complete
✅ Risk levels assigned to all findings
✅ Remediation plans provided with code examples
✅ Prevention strategies documented
✅ Comprehensive report delivered
✅ Prioritized action plan created
