---
id: security-owasp-top10
category: skill
tags: [security, owasp, vulnerabilities, best-practices]
capabilities:
  - OWASP Top 10 vulnerabilities overview
  - Security mitigation strategies framework
  - Common attack prevention patterns
  - Security vulnerability identification
relatedResources:
  - orchestr8://skills/security-api-security
  - orchestr8://skills/security-authentication-jwt
  - orchestr8://skills/security-authentication-oauth
  - orchestr8://skills/security-input-validation
  - orchestr8://skills/security-secrets-management
useWhen:
  - Implementing security controls to prevent OWASP Top 10 vulnerabilities including broken access control, injection, and auth failures
  - Building secure applications requiring parameterized SQL queries, bcrypt password hashing, and HTTPS-only with secure cookies
  - Reviewing code for security vulnerabilities like SQL injection, XSS, CSRF, and SSRF with proper input validation and sanitization
  - Implementing authentication requiring strong password policies (12+ chars, complexity), account lockout, and multi-factor authentication
  - Deploying production applications requiring security headers (Helmet.js), CORS configuration, rate limiting, and dependency auditing
  - Building APIs with proper access control checking user ownership, role-based permissions, and preventing insecure direct object references
estimatedTokens: 380
---

# OWASP Top 10 2025 - Prevention Guide

## Overview

This skill provides a high-level overview of the OWASP Top 10 security vulnerabilities and prevention strategies. For detailed implementations and domain-specific guidance, refer to the specialized security skills listed in the "Related Security Skills" section below.

## 1. Broken Access Control

**Prevention:**
```typescript
// ❌ BAD: Direct object reference
app.get('/users/:id', (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);  // Any user can access any user's data
});

// ✅ GOOD: Check ownership
app.get('/users/:id', authenticate, (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'admin') {
    throw new ForbiddenError();
  }
  const user = await User.findById(req.params.id);
  res.json(user);
});
```

## 2. Cryptographic Failures

**Key Prevention Strategies:**
- Hash passwords with bcrypt (work factor 12+)
- Use HTTPS only (enforce with redirects)
- Encrypt sensitive data at rest (AES-256-GCM)
- Never store secrets in plaintext
- Use secure random number generation
- Implement proper key management

**For detailed implementation:** See `orchestr8://skills/security-secrets-management`

## 3. Injection (SQL, NoSQL, Command)

**Key Prevention Strategies:**
- Use parameterized queries (prepared statements)
- Use ORM/query builders with proper escaping
- Validate and sanitize all user input
- Avoid shell command execution with user input
- Whitelist allowed values, never blacklist

**For detailed implementation:** See `orchestr8://skills/security-input-validation`

## 4. Insecure Design

**Prevention:**
- Implement rate limiting
- Use multi-factor authentication
- Design with principle of least privilege
- Threat modeling during design phase

```typescript
// Rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests'
});
app.use('/api/', limiter);
```

## 5. Security Misconfiguration

**Key Prevention Strategies:**
- Set security headers (Helmet.js)
- Disable unnecessary features (X-Powered-By)
- Configure secure cookies (httpOnly, secure, sameSite)
- Properly configure CORS (whitelist origins)
- Regular dependency updates and security audits
- Minimal exposed services and endpoints

**For detailed implementation:** See `orchestr8://skills/security-api-security`

## 6. Vulnerable and Outdated Components

**Prevention:**
```bash
# Regular dependency audits
npm audit
npm audit fix

# Use Snyk or Dependabot
# Check package.json for outdated versions
npm outdated

# Pin versions in package-lock.json
# Review security advisories
```

## 7. Authentication Failures

**Key Prevention Strategies:**
- Implement multi-factor authentication
- Enforce strong password policies (12+ chars, complexity)
- Account lockout after failed attempts (5 tries, 15 min lockout)
- Secure session management with httpOnly cookies
- Use modern authentication protocols (OAuth 2.0, OpenID Connect)

**For detailed implementation:**
- JWT authentication: `orchestr8://skills/security-authentication-jwt`
- OAuth 2.0/OIDC: `orchestr8://skills/security-authentication-oauth`

## 8. Software and Data Integrity Failures

**Prevention:**
```typescript
// ✅ Verify dependencies with SRI
<script src="https://cdn.example.com/lib.js" 
  integrity="sha384-hash" 
  crossorigin="anonymous"></script>

// ✅ Sign and verify data
import jwt from 'jsonwebtoken';
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

// ✅ Use package lock files
// ✅ Implement CI/CD security checks
```

## 9. Security Logging and Monitoring

**Prevention:**
```typescript
// ✅ Log security events
logger.warn('Failed login attempt', {
  email,
  ip: req.ip,
  timestamp: new Date()
});

// ✅ Monitor for suspicious activity
// ✅ Set up alerts for anomalies
// ✅ Implement audit trails for sensitive operations
```

## 10. Server-Side Request Forgery (SSRF)

**Key Prevention Strategies:**
- Whitelist allowed domains for external requests
- Block access to internal IPs and private networks
- Validate and sanitize URLs before fetching
- Use network segmentation
- Disable unnecessary URL schemas (file://, gopher://)

**For detailed implementation:** See `orchestr8://skills/security-input-validation`

## Related Security Skills

This OWASP Top 10 overview provides high-level guidance. For detailed implementations, patterns, and code examples, refer to these specialized security skills:

### Authentication & Authorization
- **JWT Authentication**: `orchestr8://skills/security-authentication-jwt`
  - Token generation, validation, and rotation
  - Refresh token implementation
  - Token revocation strategies

- **OAuth 2.0 & OpenID Connect**: `orchestr8://skills/security-authentication-oauth`
  - Authorization code flow with PKCE
  - Social login integration
  - Token management best practices

### API Security
- **API Security Patterns**: `orchestr8://skills/security-api-security`
  - Rate limiting strategies
  - CORS configuration
  - API key management
  - DDoS protection

### Input Validation & Injection Prevention
- **Input Validation**: `orchestr8://skills/security-input-validation`
  - SQL injection prevention
  - XSS attack prevention
  - Command injection prevention
  - Schema validation with Zod

### Secrets & Key Management
- **Secrets Management**: `orchestr8://skills/security-secrets-management`
  - Secure credential storage
  - Secret rotation strategies
  - Vault and cloud secret managers
  - Encryption at rest

## OWASP Top 10 to Skills Mapping

| OWASP Category | Related Skills |
|---------------|----------------|
| A01: Broken Access Control | API Security |
| A02: Cryptographic Failures | Secrets Management |
| A03: Injection | Input Validation |
| A04: Insecure Design | API Security |
| A05: Security Misconfiguration | API Security, Secrets Management |
| A06: Vulnerable Components | General Best Practices |
| A07: Authentication Failures | JWT Auth, OAuth |
| A08: Data Integrity Failures | Secrets Management |
| A09: Logging & Monitoring | General Best Practices |
| A10: SSRF | Input Validation, API Security |
