---
id: security-authentication-jwt
category: skill
tags: [security, authentication, jwt, tokens, refresh-tokens, authorization, oauth, bearer]
capabilities:
  - JWT token generation and validation concepts
  - Refresh token implementation and rotation strategies
  - Token expiration and rotation best practices
  - Secure token storage patterns (httpOnly cookies)
  - Token-based authentication flow design
  - Claims and payload design principles
  - Token revocation and blacklisting strategies
  - JWT security best practices and compliance
relatedResources:
  - orchestr8://examples/security/jwt-authentication-implementation
  - orchestr8://skills/security-owasp-top10
  - orchestr8://skills/security-authentication-oauth
  - orchestr8://skills/security-api-security
  - orchestr8://skills/security-secrets-management
estimatedTokens: 350
useWhen:
  - Implementing JWT authentication for REST API with access tokens, refresh tokens, and secure cookie storage
  - Building JWT token validation middleware verifying signature, expiration, and issuer claims
  - Designing JWT refresh token rotation strategy preventing token theft with automatic refresh on API calls
  - Creating secure JWT implementation with RS256 asymmetric signing and short token expiration (15 minutes)
  - Implementing JWT logout mechanism with token blacklist using Redis for immediate session invalidation
  - Stateless API authentication requiring horizontally scalable token validation without centralized session storage
  - REST API or microservices authentication needing cryptographically signed claims with role-based access control
  - OAuth 2.0 or OpenID Connect implementations requiring access token and refresh token pair with rotation strategy
  - Mobile app or SPA authentication requiring secure token storage in httpOnly cookies with CSRF protection
  - Cross-domain authentication scenarios needing bearer token propagation across multiple services with audience validation
  - Token revocation requirements needing blacklist management with Redis and refresh token family tracking
---

# JWT Authentication Security

## Overview

JWT (JSON Web Tokens) provide a stateless, scalable authentication mechanism for modern APIs. This skill covers the security concepts, strategies, and best practices for implementing JWT authentication.

For complete implementation code, see: `orchestr8://examples/security/jwt-authentication-implementation`

## Core Concepts

### Token Types
1. **Access Token**: Short-lived (15 minutes), contains user claims, used for API authentication
2. **Refresh Token**: Long-lived (7 days), used to obtain new access tokens, stored securely

### Token Structure
- **Header**: Algorithm and token type
- **Payload**: Claims (user ID, roles, email, expiration)
- **Signature**: HMAC or RSA signature for verification

## Authentication Flow Design

### Login Flow
1. User provides credentials (email/password)
2. Server validates credentials
3. Generate access token (short-lived, 15 min)
4. Generate refresh token (long-lived, 7 days)
5. Hash refresh token before database storage
6. Return both tokens to client

### Token Refresh Flow
1. Client sends expired access token + refresh token
2. Server validates refresh token
3. Generate new access token
4. Optionally rotate refresh token (recommended)
5. Return new token(s) to client

### Logout Flow
1. Client sends logout request with tokens
2. Server invalidates refresh token (delete from DB)
3. Add access token to Redis blacklist (if needed)
4. Client discards tokens

## Best Practices

### Token Configuration
- **Short-lived access tokens**: 15 minutes or less
- **Rotate refresh tokens**: Issue new one on each refresh
- **Hash refresh tokens**: Before storing in database (use bcrypt or SHA-256)
- **Use RS256 in production**: Asymmetric signing for microservices
- **Include standard claims**: `iss`, `aud`, `exp`, `iat`, `nbf`, `jti`

### Security Measures
- **Validate all claims**: Check issuer, audience, expiration
- **HttpOnly cookies**: For web apps (prevents XSS)
- **Secure storage**: iOS Keychain, Android Keystore for mobile
- **Token blacklisting**: Use Redis for revoked tokens
- **Rate limiting**: On auth and refresh endpoints
- **Token cleanup**: Periodic deletion of expired refresh tokens

### Signing Algorithms
- **HS256 (HMAC)**: Symmetric, same secret for signing and verification, suitable for single server
- **RS256 (RSA)**: Asymmetric, private key signs, public key verifies, ideal for microservices

## Standard JWT Claims

| Claim | Description | Required |
|-------|-------------|----------|
| `sub` | Subject (user ID) | Yes |
| `iss` | Issuer (your API domain) | Yes |
| `aud` | Audience (intended recipient) | Yes |
| `exp` | Expiration timestamp | Yes |
| `iat` | Issued at timestamp | Yes |
| `nbf` | Not before timestamp | Optional |
| `jti` | JWT ID (for revocation tracking) | Recommended |

## Token Revocation Strategies

### Database-Based Revocation
- Store refresh tokens in database
- Delete on logout or password change
- Query database on each refresh request

### Redis Blacklist
- Add revoked token JTI to Redis set
- Set TTL matching token expiration
- Check blacklist on each request (fast)
- Use for immediate invalidation needs

### Token Families
- Track refresh token "family" in database
- Detect token reuse (security breach)
- Invalidate entire family on suspicious activity

## Storage Patterns

### Web Applications (Browser)
- **Recommended**: httpOnly, secure, sameSite cookies
- **Protects against**: XSS attacks
- **CSRF protection**: Use sameSite=strict or CSRF tokens

### Mobile/Native Applications
- **iOS**: Keychain Services API
- **Android**: Android Keystore System
- **Never**: SharedPreferences, UserDefaults (unencrypted)

### Single Page Applications (SPA)
- **Option 1**: httpOnly cookies (if same domain)
- **Option 2**: Memory storage (lost on refresh, need refresh token)
- **Avoid**: localStorage or sessionStorage (XSS vulnerable)

## Common Security Pitfalls

### What NOT to Do
1. **Sensitive data in payload**: JWTs are base64 encoded, not encrypted
2. **Weak secrets**: Use minimum 256 bits of cryptographic entropy
3. **No expiration**: Always set `expiresIn` for access tokens
4. **localStorage storage**: Vulnerable to XSS attacks
5. **Algorithm confusion**: Always specify and verify algorithm
6. **Skip signature verification**: Never trust token without verification

### Attack Vectors to Prevent
- **Token theft**: Use httpOnly cookies, short expiration
- **XSS attacks**: Never store tokens in localStorage
- **CSRF attacks**: Use sameSite cookies or CSRF tokens
- **Replay attacks**: Include `jti` and maintain blacklist
- **Algorithm confusion**: Explicitly validate signing algorithm

## Related Security Skills

### Parent Skills
- **OWASP Top 10**: `orchestr8://skills/security-owasp-top10`
  - General authentication security principles
  - Maps to A07:2021 Authentication Failures

### Sibling Skills
- **OAuth 2.0 Authentication**: `orchestr8://skills/security-authentication-oauth`
  - OAuth uses JWT for ID tokens (OpenID Connect)
  - JWT and OAuth complement each other (JWT for internal APIs, OAuth for third-party)
  - Similar token management and storage patterns

### Related Domain Skills
- **API Security**: `orchestr8://skills/security-api-security`
  - JWT used as Bearer tokens in API authentication
  - Rate limiting on auth endpoints
  - API key management patterns

- **Secrets Management**: `orchestr8://skills/security-secrets-management`
  - JWT signing key storage and rotation
  - Refresh token encryption at rest
  - Secret manager integration for JWT secrets

## Compliance and Standards

### Security Standards
- **OWASP**: A02:2021 Cryptographic Failures, A07:2021 Identification Failures
- **NIST**: SP 800-63B Digital Identity Guidelines
- **OAuth 2.0**: RFC 6749 (Authorization Framework)
- **OpenID Connect**: Identity layer protocol

### Regulatory Compliance
- **PCI DSS**: 8.2.3 Multi-factor authentication requirements
- **GDPR**: Article 17 Right to erasure (token invalidation)
- **SOC 2**: CC6.1 Logical access controls
- **HIPAA**: 164.312(a)(1) Access control requirements
