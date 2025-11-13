---
id: api-rate-limiting-implementation
category: example
tags: [security, api, rate-limiting, express, redis, ddos-protection, typescript]
capabilities:
  - Complete rate limiting implementation with in-memory and Redis storage
  - Tiered rate limits by endpoint sensitivity
  - Cost-based rate limiting for different endpoint weights
  - Per-user and per-IP rate limiting strategies
  - DDoS protection with request throttling
  - IP blacklisting and abuse detection
useWhen:
  - When implementing production-ready API rate limiting
  - When protecting APIs from abuse and DDoS attacks
  - When building distributed rate limiting with Redis
  - When implementing tiered rate limits by endpoint
  - When creating cost-based API quotas
estimatedTokens: 350
relatedResources:
  - orchestr8://skills/security-api-security
---

# API Rate Limiting Implementation

Complete TypeScript implementation of API rate limiting with basic in-memory, Redis-backed distributed limiting, and advanced patterns.

## Basic Rate Limiting (In-Memory)

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

// Basic in-memory rate limiting
const basicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true, // Return RateLimit-* headers
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
    },
  },
});

app.use('/api/', basicLimiter);
```

## Redis-Backed Distributed Rate Limiting

```typescript
// Redis-backed rate limiting (distributed)
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

await redisClient.connect();

const distributedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  store: new RedisStore({
    client: redisClient,
    prefix: 'rl:',
  }),
});

app.use('/api/', distributedLimiter);
```

## Tiered Rate Limits by Endpoint Sensitivity

```typescript
// Strict limit for sensitive endpoints
const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
});

// Auth-specific limiter (only count failed attempts)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 5 login attempts per 15 minutes
  skipSuccessfulRequests: true, // Only count failed attempts
});

// Apply different limits to different endpoints
app.post('/auth/login', authLimiter, loginHandler);
app.post('/users', strictLimiter, createUserHandler);
app.get('/users', basicLimiter, getUsersHandler);
```

## Per-User Rate Limiting

```typescript
// Custom key generator (per user, not IP)
const perUserLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  keyGenerator: (req) => {
    // Rate limit by user ID if authenticated, IP otherwise
    return req.user?.userId || req.ip;
  },
});

app.use('/api/', perUserLimiter);
```

## Cost-Based Rate Limiting

```typescript
// Cost-based rate limiting (different endpoints cost different amounts)
interface RateLimitCost {
  [key: string]: number;
}

const costs: RateLimitCost = {
  '/api/search': 5,
  '/api/users': 1,
  '/api/export': 10,
};

const costBasedLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100, // 100 "points" per minute
  skip: (req) => !costs[req.path],
  keyGenerator: (req) => req.user?.userId || req.ip,
  handler: (req, res) => {
    const cost = costs[req.path] || 1;
    res.status(429).json({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Too many requests. Cost: ${cost}`,
      },
    });
  },
});

app.use('/api/', costBasedLimiter);
```

## DDoS Protection with Request Throttling

```typescript
import helmet from 'helmet';
import slowDown from 'express-slow-down';

// Security headers
app.use(helmet({
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
}));

// Slow down repeated requests
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50, // Start delaying after 50 requests
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Max 20 second delay
});

app.use('/api/', speedLimiter);

// Body size limits
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request timeout
import timeout from 'connect-timeout';

app.use(timeout('30s'));
app.use((req, res, next) => {
  if (!req.timedout) next();
});
```

## IP Blacklisting and Abuse Detection

```typescript
// IP blacklisting
const BLACKLISTED_IPS = new Set<string>();

app.use((req, res, next) => {
  const ip = req.ip;

  if (BLACKLISTED_IPS.has(ip)) {
    logger.warn('Blocked blacklisted IP', { ip });
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
});

// Automatic blacklisting on abuse
const abuseTracker = new Map<string, number>();

app.use((req, res, next) => {
  const ip = req.ip;
  const count = abuseTracker.get(ip) || 0;

  if (count > 1000) {
    BLACKLISTED_IPS.add(ip);
    logger.error('IP blacklisted for abuse', { ip, count });
  }

  res.on('finish', () => {
    if (res.statusCode === 429) {
      abuseTracker.set(ip, count + 1);
    }
  });

  next();
});
```

## Usage Notes

### Integration Steps
1. Install required packages: `express-rate-limit`, `rate-limit-redis`, `redis`, `helmet`, `express-slow-down`
2. Configure Redis for distributed rate limiting (production)
3. Apply appropriate limiters to routes based on sensitivity
4. Monitor rate limit violations and adjust limits as needed
5. Implement abuse tracking and automatic blacklisting

### Best Practices
- **Rate limit everything**: Different limits per sensitivity
- **Use Redis in production**: For distributed systems
- **Tiered limits**: Stricter for auth, moderate for writes, lenient for reads
- **Per-user limits**: Rate limit authenticated users by ID, not IP
- **Cost-based limits**: Different endpoints consume different quota amounts
- **Monitor and alert**: Track rate limit violations
- **Return proper headers**: `RateLimit-*` headers for client awareness
- **Implement backoff**: Add delays for repeated violations

### What to Avoid
- ❌ Don't skip rate limiting on sensitive endpoints
- ❌ Don't use only IP-based limiting (can be circumvented)
- ❌ Don't use same limit for all endpoints
- ❌ Don't trust X-Forwarded-For without validation
- ❌ Don't forget to limit request body sizes
