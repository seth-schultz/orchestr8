---
id: oauth-flows-implementation
category: example
tags: [security, authentication, oauth, oauth2, pkce, openid-connect, typescript]
capabilities:
  - Complete OAuth 2.0 authorization code flow implementation
  - PKCE flow for public clients (SPAs, mobile apps)
  - OpenID Connect ID token verification
  - Token storage and encryption best practices
  - Refresh token flow with automatic rotation
  - State validation for CSRF protection
useWhen:
  - When implementing OAuth 2.0 provider integration
  - When building social login (Google, GitHub, Facebook)
  - When creating secure authentication for SPAs or mobile apps
  - When implementing OpenID Connect identity layer
  - When handling OAuth token refresh and rotation
estimatedTokens: 420
relatedResources:
  - orchestr8://skills/security-authentication-oauth
---

# OAuth 2.0 Flows Implementation

Complete TypeScript implementation of OAuth 2.0 authorization code flow, PKCE, and OpenID Connect.

## Authorization Code Flow (Server-Side)

```typescript
import { randomBytes } from 'crypto';
import axios from 'axios';

interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  scope: string;
}

// Step 1: Redirect user to OAuth provider
app.get('/auth/oauth/login', (req, res) => {
  const state = randomBytes(32).toString('hex');

  // Store state in session to verify callback
  req.session.oauthState = state;

  const params = new URLSearchParams({
    client_id: oauthConfig.clientId,
    redirect_uri: oauthConfig.redirectUri,
    response_type: 'code',
    scope: oauthConfig.scope,
    state,
  });

  res.redirect(`${oauthConfig.authorizationUrl}?${params}`);
});

// Step 2: Handle callback and exchange code for token
app.get('/auth/oauth/callback', async (req, res) => {
  const { code, state } = req.query;

  // Verify state to prevent CSRF
  if (state !== req.session.oauthState) {
    return res.status(400).json({
      error: { code: 'INVALID_STATE', message: 'State mismatch - possible CSRF' }
    });
  }

  delete req.session.oauthState;

  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      oauthConfig.tokenUrl,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: oauthConfig.redirectUri,
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Fetch user info from provider
    const userResponse = await axios.get('https://provider.com/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const oauthUser = userResponse.data;

    // Create or update user in database
    const user = await findOrCreateUser(oauthUser);

    // Create session
    req.session.userId = user.id;

    res.redirect('/dashboard');
  } catch (error) {
    logger.error('OAuth callback error', { error });
    res.status(500).json({
      error: { code: 'OAUTH_ERROR', message: 'Authentication failed' }
    });
  }
});
```

## PKCE Flow (Public Clients)

```typescript
import { createHash, randomBytes } from 'crypto';

// Generate code verifier and challenge
function generatePKCEPair() {
  const codeVerifier = randomBytes(32).toString('base64url');

  const codeChallenge = createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  return { codeVerifier, codeChallenge };
}

// Step 1: Authorization request with PKCE
app.get('/auth/oauth/login-pkce', (req, res) => {
  const state = randomBytes(32).toString('hex');
  const { codeVerifier, codeChallenge } = generatePKCEPair();

  // Store code_verifier in session
  req.session.codeVerifier = codeVerifier;
  req.session.oauthState = state;

  const params = new URLSearchParams({
    client_id: oauthConfig.clientId,
    redirect_uri: oauthConfig.redirectUri,
    response_type: 'code',
    scope: oauthConfig.scope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  res.redirect(`${oauthConfig.authorizationUrl}?${params}`);
});

// Step 2: Token exchange with code_verifier (no client_secret)
app.get('/auth/oauth/callback-pkce', async (req, res) => {
  const { code, state } = req.query;

  if (state !== req.session.oauthState) {
    return res.status(400).json({ error: 'State mismatch' });
  }

  const codeVerifier = req.session.codeVerifier;
  delete req.session.codeVerifier;
  delete req.session.oauthState;

  try {
    const tokenResponse = await axios.post(
      oauthConfig.tokenUrl,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code as string,
        redirect_uri: oauthConfig.redirectUri,
        client_id: oauthConfig.clientId,
        code_verifier: codeVerifier, // Instead of client_secret
      })
    );

    const { access_token } = tokenResponse.data;

    // Fetch and create user...
    res.redirect('/dashboard');
  } catch (error) {
    logger.error('PKCE callback error', { error });
    res.status(500).json({ error: 'Authentication failed' });
  }
});
```

## OpenID Connect (ID Token Verification)

```typescript
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// Verify ID token from OIDC provider
const client = jwksClient({
  jwksUri: 'https://provider.com/.well-known/jwks.json',
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

async function verifyIdToken(idToken: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      idToken,
      getKey,
      {
        audience: oauthConfig.clientId,
        issuer: 'https://provider.com',
        algorithms: ['RS256'],
      },
      (err, decoded) => {
        if (err) return reject(err);
        resolve(decoded);
      }
    );
  });
}

// Use ID token for user info (faster than /userinfo endpoint)
app.get('/auth/oidc/callback', async (req, res) => {
  const { code } = req.query;

  const tokenResponse = await exchangeCodeForToken(code as string);
  const { id_token, access_token } = tokenResponse.data;

  try {
    // Verify and decode ID token
    const userInfo = await verifyIdToken(id_token);

    const user = await findOrCreateUser({
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    });

    req.session.userId = user.id;
    res.redirect('/dashboard');
  } catch (error) {
    logger.error('ID token verification failed', { error });
    res.status(401).json({ error: 'Invalid ID token' });
  }
});
```

## Secure Token Storage

```typescript
// Server-side: Store tokens securely
interface OAuthToken {
  userId: string;
  provider: string;
  accessToken: string; // Encrypted
  refreshToken: string; // Encrypted
  expiresAt: Date;
}

import { encrypt, decrypt } from './encryption';

async function saveOAuthToken(userId: string, tokenData: any) {
  await db.oauthToken.create({
    data: {
      userId,
      provider: 'google',
      accessToken: encrypt(tokenData.access_token),
      refreshToken: encrypt(tokenData.refresh_token),
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    },
  });
}

async function getOAuthToken(userId: string, provider: string) {
  const token = await db.oauthToken.findFirst({
    where: { userId, provider },
  });

  if (!token) return null;

  return {
    accessToken: decrypt(token.accessToken),
    refreshToken: decrypt(token.refreshToken),
    expiresAt: token.expiresAt,
  };
}
```

## Refresh Token Flow

```typescript
async function refreshOAuthToken(userId: string, provider: string) {
  const storedToken = await getOAuthToken(userId, provider);

  if (!storedToken || !storedToken.refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(
      oauthConfig.tokenUrl,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: storedToken.refreshToken,
        client_id: oauthConfig.clientId,
        client_secret: oauthConfig.clientSecret,
      })
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // Update stored tokens
    await db.oauthToken.update({
      where: { userId_provider: { userId, provider } },
      data: {
        accessToken: encrypt(access_token),
        refreshToken: refresh_token ? encrypt(refresh_token) : undefined,
        expiresAt: new Date(Date.now() + expires_in * 1000),
      },
    });

    return access_token;
  } catch (error) {
    logger.error('Token refresh failed', { userId, provider, error });
    throw new Error('Failed to refresh token');
  }
}
```

## Usage Notes

### Integration Steps
1. Register OAuth application with provider (Google, GitHub, etc.)
2. Configure redirect URIs in provider dashboard
3. Store client credentials securely in environment variables
4. Implement state validation to prevent CSRF
5. Use PKCE for public clients (SPAs, mobile apps)
6. Encrypt tokens before storing in database
7. Implement automatic token refresh before expiration

### Security Best Practices
- **Always validate state**: Prevent CSRF attacks
- **Use PKCE for public clients**: SPAs, mobile apps
- **Verify ID tokens**: Check signature, issuer, audience
- **Encrypt stored tokens**: Use AES-256-GCM
- **Request minimal scopes**: Only what's needed
- **Use HTTPS only**: Required for OAuth
- **Validate redirect URIs**: Whitelist exact matches
- **Implement token refresh**: Before expiration
- **Revoke on logout**: Call provider's revocation endpoint

### What to Avoid
- ❌ Don't skip state validation (CSRF vulnerability)
- ❌ Don't use implicit flow (deprecated and insecure)
- ❌ Don't store tokens in localStorage (XSS risk)
- ❌ Don't expose client_secret in frontend code
- ❌ Don't trust tokens without verification
