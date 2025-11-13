---
id: security-authentication-oauth
category: skill
tags: [security, authentication, oauth, oauth2, pkce, openid-connect, sso]
capabilities:
  - OAuth 2.0 flow concepts and security principles
  - PKCE for public clients (SPAs, mobile apps)
  - Authorization code flow design
  - OpenID Connect integration strategies
  - OAuth token management best practices
relatedResources:
  - orchestr8://examples/security/oauth-flows-implementation
  - orchestr8://skills/security-owasp-top10
  - orchestr8://skills/security-authentication-jwt
  - orchestr8://skills/security-api-security
  - orchestr8://skills/security-secrets-management
estimatedTokens: 280
useWhen:
  - Implementing OAuth 2.0 authorization code flow for third-party authentication with PKCE for enhanced security
  - Building OAuth provider integration with Google, GitHub, and Facebook for social login functionality
  - Designing OAuth token management with secure storage, automatic refresh, and revocation handling
  - Creating OAuth consent screen implementation with granular permission scopes and user authorization tracking
  - Implementing OpenID Connect on top of OAuth 2.0 for standardized identity layer with JWT ID tokens
---

# OAuth 2.0 Authentication Security

## Overview

OAuth 2.0 is an authorization framework that enables secure third-party access to user resources without sharing credentials. This skill covers OAuth flows, security concepts, and implementation strategies.

For complete implementation code, see: `orchestr8://examples/security/oauth-flows-implementation`

## OAuth 2.0 Core Concepts

### Key Terminology
- **Resource Owner**: User who owns the data
- **Client**: Application requesting access
- **Authorization Server**: Issues access tokens (Google, GitHub, etc.)
- **Resource Server**: API that holds protected resources
- **Scope**: Permission level (read, write, admin)
- **State**: CSRF protection parameter

### OAuth 2.0 Grant Types
1. **Authorization Code**: Server-side apps (most secure)
2. **PKCE**: Public clients (SPAs, mobile apps)
3. **Client Credentials**: Server-to-server (no user)
4. **Implicit**: Deprecated (insecure)
5. **Resource Owner Password**: Deprecated (avoid)

## Authorization Code Flow (Server-Side)

### Flow Steps
1. **Authorization Request**: Redirect user to provider with client_id, redirect_uri, scope, state
2. **User Consent**: User authenticates and authorizes app
3. **Authorization Code**: Provider redirects back with code and state
4. **State Validation**: Verify state parameter matches (CSRF protection)
5. **Token Exchange**: Exchange code for access_token using client_secret
6. **User Info**: Fetch user details from provider
7. **Session Creation**: Create local session for user

### Security Measures
- **State parameter**: Random value to prevent CSRF
- **HTTPS only**: Required for OAuth 2.0
- **Client secret**: Kept server-side only
- **Short-lived codes**: Authorization codes expire quickly (10 min)
- **One-time use**: Codes can only be exchanged once

## PKCE Flow (Public Clients)

### What is PKCE?
Proof Key for Code Exchange - enhances OAuth security for public clients (SPAs, mobile apps) that cannot securely store client secrets.

### PKCE Process
1. **Generate code_verifier**: Random 43-128 character string
2. **Create code_challenge**: SHA256 hash of verifier (base64url encoded)
3. **Authorization request**: Include code_challenge and method (S256)
4. **Token exchange**: Send code_verifier instead of client_secret
5. **Verification**: Provider validates verifier matches challenge

### Why PKCE?
- **No client secret needed**: Safe for public clients
- **Authorization code interception**: Attacker can't use code without verifier
- **PKCE recommended**: Even for server-side apps (defense in depth)

## OpenID Connect (OIDC)

### OIDC = OAuth 2.0 + Identity Layer
OpenID Connect extends OAuth 2.0 with standardized identity features:
- **ID Token**: JWT containing user identity claims
- **UserInfo Endpoint**: Retrieve additional user details
- **Standard Scopes**: openid, profile, email, address, phone
- **Discovery**: .well-known/openid-configuration

### ID Token vs Access Token
| Feature | ID Token | Access Token |
|---------|----------|--------------|
| Purpose | User identity | Resource access |
| Format | JWT (always) | Opaque or JWT |
| Audience | Client app | Resource server |
| Contains | User claims | Permission scopes |
| Verifiable | Yes (signature) | Opaque tokens: no |

### ID Token Verification
1. Decode JWT without verification
2. Fetch provider's public keys (JWKS)
3. Verify signature using RS256/ES256
4. Validate claims: issuer, audience, expiration
5. Extract user identity claims

## Token Management

### Token Storage
- **Server-side**: Encrypt with AES-256-GCM before database storage
- **Never localStorage**: XSS vulnerable
- **httpOnly cookies**: Best for web apps
- **Secure storage**: iOS Keychain, Android Keystore for mobile

### Token Refresh Strategy
1. Check token expiration before API calls
2. Refresh proactively (before expiry)
3. Handle refresh failures (re-auth user)
4. Update stored tokens in database
5. Some providers issue new refresh token (rotation)

### Token Revocation
- **Logout**: Call provider's revocation endpoint
- **Password change**: Revoke all tokens
- **Compromised account**: Immediate revocation
- **Delete from database**: Remove stored tokens

## Best Practices Summary

### Essential Security Measures
1. **Always validate state**: Prevent CSRF attacks in callback
2. **Use PKCE**: For all public clients (SPAs, mobile, desktop)
3. **Verify ID tokens**: Check signature, issuer, audience, expiration
4. **Encrypt stored tokens**: AES-256-GCM before database storage
5. **Request minimal scopes**: Only permissions you actually need
6. **Implement token refresh**: Proactive refresh before expiration
7. **HTTPS everywhere**: Mandatory for OAuth 2.0
8. **Whitelist redirect URIs**: Exact match validation, no wildcards
9. **Revoke on logout**: Call provider revocation endpoint
10. **Monitor abuse**: Rate limiting on auth endpoints

### OAuth Provider Configuration
| Provider | Auth URL | Token URL | UserInfo URL |
|----------|----------|-----------|--------------|
| Google | accounts.google.com/o/oauth2/v2/auth | oauth2.googleapis.com/token | googleapis.com/oauth2/v1/userinfo |
| GitHub | github.com/login/oauth/authorize | github.com/login/oauth/access_token | api.github.com/user |
| Facebook | facebook.com/v12.0/dialog/oauth | graph.facebook.com/v12.0/oauth/access_token | graph.facebook.com/me |

### Common Scopes
- **OpenID**: `openid`, `profile`, `email`, `address`, `phone`
- **Google**: `https://www.googleapis.com/auth/userinfo.profile`
- **GitHub**: `user`, `user:email`, `read:user`
- **Facebook**: `public_profile`, `email`, `user_birthday`

## Security Pitfalls to Avoid

### Critical Mistakes
- ❌ **Skip state validation**: CSRF vulnerability, attacker can hijack flow
- ❌ **Use implicit flow**: Deprecated, tokens exposed in URL
- ❌ **Store tokens in localStorage**: XSS attacks can steal tokens
- ❌ **Expose client_secret**: Never in frontend, mobile apps, or version control
- ❌ **Skip token verification**: Trust but verify all ID tokens
- ❌ **Wildcards in redirect_uri**: Open redirect vulnerability
- ❌ **No HTTPS**: Tokens transmitted in clear text

### Attack Vectors
- **Authorization code interception**: Mitigated by PKCE
- **CSRF attacks**: Prevented by state parameter
- **Open redirects**: Validate redirect_uri strictly
- **Token theft**: Use secure storage, short expiration
- **Replay attacks**: One-time use authorization codes

## Related Security Skills

### Parent Skills
- **OWASP Top 10**: `orchestr8://skills/security-owasp-top10`
  - General authentication security principles
  - Maps to A07:2021 Authentication Failures

### Sibling Skills
- **JWT Authentication**: `orchestr8://skills/security-authentication-jwt`
  - OpenID Connect extends OAuth with JWT ID tokens
  - OAuth access tokens can be JWTs
  - Similar token validation and storage patterns
  - JWT for internal APIs, OAuth for third-party delegation

### Related Domain Skills
- **API Security**: `orchestr8://skills/security-api-security`
  - OAuth tokens used as Bearer tokens in API calls
  - Rate limiting on OAuth endpoints
  - CORS configuration for OAuth redirects

- **Secrets Management**: `orchestr8://skills/security-secrets-management`
  - OAuth client secret storage
  - Access and refresh token encryption at rest
  - Token encryption before database storage

## Compliance and Standards

### Security Standards
- **OWASP**: A07:2021 Identification and Authentication Failures
- **OAuth 2.0 Core**: RFC 6749 (Authorization Framework)
- **OAuth 2.0 Security**: RFC 6819 (Threat Model and Security Considerations)
- **PKCE**: RFC 7636 (Proof Key for Code Exchange)
- **OAuth 2.0 for Native Apps**: RFC 8252
- **OAuth 2.0 Security Best Practices**: BCP (Best Current Practice) draft

### Regulatory Compliance
- **GDPR**: Article 7 (Conditions for consent), Article 13 (Information to be provided)
- **SOC 2**: CC6.1 (Logical and physical access controls)
- **PCI DSS**: 8.2 (User authentication and passwords)
- **CCPA**: User consent and data access rights
