---
id: security-api-security
category: skill
tags: [security, api, rate-limiting, cors, api-keys, request-signing, ddos]
capabilities:
  - API rate limiting strategies and patterns
  - CORS configuration security principles
  - API key authentication design
  - Request signing and verification concepts
  - DDoS protection and threat mitigation
relatedResources:
  - orchestr8://examples/security/api-rate-limiting-implementation
  - orchestr8://skills/security-owasp-top10
  - orchestr8://skills/security-authentication-jwt
  - orchestr8://skills/security-authentication-oauth
  - orchestr8://skills/security-input-validation
estimatedTokens: 250
useWhen:
  - Implementing API security best practices with authentication, authorization, rate limiting, and input validation
  - Building API security layer with CORS configuration, CSRF protection, and security headers (HSTS, CSP)
  - Designing API key management system with rotation, revocation, and usage tracking per client
  - Creating API threat protection with request size limits, timeout configuration, and SQL injection prevention
  - Implementing API audit logging tracking authentication attempts, authorization failures, and sensitive operations
---

# API Security Patterns

## Overview

Comprehensive API security requires multiple layers of protection including rate limiting, CORS configuration, authentication, and DDoS mitigation. This skill covers security concepts and strategies for production APIs.

For complete implementation code, see: `orchestr8://examples/security/api-rate-limiting-implementation`

## Rate Limiting Strategies

### Why Rate Limiting
- Prevent API abuse and resource exhaustion
- Protect against brute force attacks
- Ensure fair usage across clients
- Prevent DDoS attacks

### Rate Limiting Patterns
1. **Fixed Window**: Simple, counts requests in time window
2. **Sliding Window**: More accurate, accounts for request timing
3. **Token Bucket**: Allows bursts, refills over time
4. **Leaky Bucket**: Smooths traffic, processes at constant rate

### Implementation Approaches
- **In-Memory**: Simple, single server only
- **Redis**: Distributed, scales horizontally
- **Per-IP**: Basic protection, can be circumvented
- **Per-User**: More accurate for authenticated APIs
- **Cost-Based**: Different endpoints consume different quotas

## CORS Configuration Security

### CORS Risks
- **Misconfiguration**: Allowing `origin: '*'` with credentials
- **Open access**: Exposing sensitive endpoints to all origins
- **Subdomain attacks**: Not validating subdomain patterns

### CORS Best Practices
- **Whitelist specific origins**: Never use wildcard in production with credentials
- **Validate dynamically**: Use callback function for origin validation
- **Restrict methods**: Only allow needed HTTP methods
- **Limit headers**: Specify allowed and exposed headers
- **Cache preflight**: Set appropriate `maxAge` for OPTIONS requests
- **No origin requests**: Handle mobile apps and Postman (no origin header)

### Origin Validation Strategies
1. **Exact match**: Compare against allowed list
2. **Subdomain pattern**: Regex validation for `*.example.com`
3. **Environment-based**: Different origins for dev/staging/prod

## API Key Authentication

### API Key Design
- **Format**: Prefix + random bytes (e.g., `sk_abc123...`)
- **Storage**: Hash with SHA-256 before storing
- **Rotation**: Support key rotation with grace periods
- **Scoping**: Limit keys to specific resources/permissions
- **Revocation**: Immediate invalidation on compromise

### Key Generation Process
1. Generate cryptographically random bytes
2. Add readable prefix (e.g., `sk_`, `pk_`)
3. Hash key before database storage
4. Return plain key only once (show-once pattern)
5. Store metadata (user, name, permissions, last used)

### Validation Flow
1. Extract key from header (`X-API-Key`)
2. Hash provided key
3. Query database for matching hash
4. Validate expiration and permissions
5. Update last used timestamp
6. Attach user context to request

## Request Signing (HMAC)

### Why Request Signing
- **Integrity**: Verify request hasn't been modified
- **Authenticity**: Prove request came from valid client
- **Replay protection**: Timestamp prevents reuse
- **Non-repudiation**: Client can't deny sending request

### Signing Components
- **Method**: HTTP verb (GET, POST, etc.)
- **Path**: Request URI path
- **Body**: Request payload (JSON stringified)
- **Timestamp**: Current Unix timestamp
- **Secret**: Shared secret between client/server

### Security Measures
- **Timing-safe comparison**: Prevent timing attacks
- **Timestamp validation**: Reject old requests (5-10 min window)
- **Nonce support**: Optional unique ID per request
- **Algorithm specification**: Always use SHA-256 or better

## DDoS Protection Strategies

### Protection Layers
1. **Rate limiting**: Per-IP and per-user limits
2. **Request throttling**: Add delays after threshold
3. **Body size limits**: Prevent memory exhaustion
4. **Request timeouts**: Limit long-running requests
5. **IP blacklisting**: Block repeat offenders
6. **Security headers**: Helmet.js configuration

### Security Headers (Helmet.js)
- **HSTS**: Force HTTPS connections
- **CSP**: Content Security Policy
- **X-Frame-Options**: Prevent clickjacking
- **X-Content-Type-Options**: Prevent MIME sniffing
- **Referrer-Policy**: Control referrer information

### Abuse Detection
- **Track violations**: Count 429 responses per IP
- **Automatic blacklisting**: Ban IPs exceeding threshold
- **Grace period**: Temporary blocks before permanent ban
- **Alert on patterns**: Monitor for distributed attacks

## Best Practices Summary

### Essential Security Measures
1. **Rate limit everything**: Apply tiered limits based on endpoint sensitivity
2. **Whitelist CORS origins**: Never use wildcard with credentials
3. **Hash API keys**: Use SHA-256 before database storage
4. **Sign sensitive requests**: HMAC with timestamp prevents replay attacks
5. **Set security headers**: Deploy helmet.js for comprehensive protection
6. **Limit request sizes**: Prevent memory exhaustion (typically 1MB)
7. **Implement timeouts**: 30 seconds for most endpoints
8. **Monitor abuse patterns**: Track violations and auto-blacklist
9. **Version your API**: Enforce minimum versions, deprecate old ones
10. **Audit everything**: Log auth failures, rate limits, suspicious activity

### Tiered Rate Limiting Strategy
| Endpoint Type | Window | Limit | Reason |
|--------------|---------|-------|---------|
| Authentication | 15 min | 5 | Prevent brute force |
| Write operations | 1 min | 10 | Protect resources |
| Read operations | 15 min | 100 | Allow normal usage |
| Public endpoints | 15 min | 50 | Prevent scraping |
| Search/export | 1 min | 3 | Resource intensive |

### Security Headers Checklist
- [ ] HSTS (HTTP Strict Transport Security)
- [ ] CSP (Content Security Policy)
- [ ] X-Frame-Options (clickjacking protection)
- [ ] X-Content-Type-Options (MIME sniffing)
- [ ] X-XSS-Protection (XSS filtering)
- [ ] Referrer-Policy (referrer information control)

## Common Pitfalls to Avoid

### Critical Mistakes
- ❌ **No rate limiting**: Allows unlimited requests, API abuse
- ❌ **CORS misconfiguration**: `origin: '*'` with `credentials: true`
- ❌ **API keys in URLs**: Logged in browser history, server logs
- ❌ **No request timeouts**: Enables slowloris attacks
- ❌ **Trusting X-Forwarded-For**: Can be spoofed by attackers
- ❌ **Missing input validation**: SQL injection, XSS vulnerabilities
- ❌ **No audit logging**: Can't detect or investigate attacks

## Related Security Skills

### Parent Skills
- **OWASP Top 10**: `orchestr8://skills/security-owasp-top10`
  - General security vulnerabilities and mitigation strategies
  - Maps to API1 (Access Control), API4 (Rate Limiting), API8 (Misconfiguration)

### Authentication Skills
- **JWT Authentication**: `orchestr8://skills/security-authentication-jwt`
  - Token-based API authentication
  - Access token validation in API middleware

- **OAuth 2.0**: `orchestr8://skills/security-authentication-oauth`
  - Third-party API access delegation
  - OAuth token management for APIs

### Input Validation
- **Input Validation**: `orchestr8://skills/security-input-validation`
  - Request payload validation
  - Protection against injection attacks in API parameters

## Compliance and Standards

### OWASP API Security Top 10 (2023)
- **API1**: Broken Object Level Authorization
- **API2**: Broken Authentication (see JWT/OAuth skills)
- **API3**: Broken Object Property Level Authorization
- **API4**: Unrestricted Resource Consumption (rate limiting)
- **API5**: Broken Function Level Authorization
- **API6**: Unrestricted Access to Sensitive Business Flows
- **API7**: Server Side Request Forgery (SSRF)
- **API8**: Security Misconfiguration (CORS, headers)
- **API9**: Improper Inventory Management
- **API10**: Unsafe Consumption of APIs

### Regulatory Standards
- **PCI DSS**: Requirement 6.5.10 (Broken authentication and session management)
- **SOC 2**: CC6.6 (Logical and physical access controls)
- **GDPR**: Article 32 (Security of processing)
- **HIPAA**: 164.312(a)(1) (Access control)
