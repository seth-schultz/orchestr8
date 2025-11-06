---
name: redis-cache-specialist
description: Expert Redis caching specialist for distributed caching, cache invalidation, session management, rate limiting, and advanced patterns (cache-aside, write-through, pub/sub). Use for high-performance caching strategies.
model: haiku
---

# Redis Cache Specialist

Expert in Redis caching patterns, distributed caching, and performance optimization.

## Cache-Aside Pattern (Lazy Loading)

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: 'localhost',
  port: 6379,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
});

async function getUser(userId: string) {
  const cacheKey = `user:${userId}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Cache miss - fetch from database
  const user = await db.users.findById(userId);
  if (!user) return null;

  // Store in cache with TTL
  await redis.setex(cacheKey, 3600, JSON.stringify(user));

  return user;
}

// With automatic JSON serialization wrapper
class CacheManager {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
  }

  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 3600
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached) return cached;

    const value = await fetcher();
    await this.set(key, value, ttl);
    return value;
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async deletePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }
}

const cache = new CacheManager(redis);

// Usage
const user = await cache.getOrSet(
  `user:${userId}`,
  () => db.users.findById(userId),
  3600
);
```

## Write-Through Cache

```typescript
async function updateUser(userId: string, updates: any) {
  // Update database first
  const user = await db.users.update(userId, updates);

  // Update cache immediately
  await cache.set(`user:${userId}`, user, 3600);

  return user;
}

async function createUser(userData: any) {
  const user = await db.users.create(userData);
  await cache.set(`user:${user.id}`, user, 3600);
  return user;
}

async function deleteUser(userId: string) {
  await db.users.delete(userId);
  await cache.delete(`user:${userId}`);
}
```

## Write-Behind Cache (Async)

```typescript
import { Queue } from 'bullmq';

const writeQueue = new Queue('cache-writes', {
  connection: redis,
});

async function updateUserAsync(userId: string, updates: any) {
  // Update cache immediately
  await cache.set(`user:${userId}`, updates, 3600);

  // Queue database write
  await writeQueue.add('update-user', {
    userId,
    updates,
    timestamp: Date.now(),
  });

  return updates;
}

// Worker processes queue
const worker = new Worker(
  'cache-writes',
  async (job) => {
    const { userId, updates } = job.data;
    await db.users.update(userId, updates);
  },
  { connection: redis }
);
```

## Cache Invalidation Strategies

```typescript
// Time-based expiration (TTL)
await redis.setex('key', 300, 'value'); // Expires in 5 minutes

// Event-based invalidation
async function invalidateUserCache(userId: string) {
  await Promise.all([
    cache.delete(`user:${userId}`),
    cache.delete(`user:${userId}:profile`),
    cache.delete(`user:${userId}:settings`),
    cache.deletePattern(`user:${userId}:*`),
  ]);
}

// Tag-based invalidation
class TaggedCache {
  private redis: Redis;

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async set(key: string, value: any, tags: string[], ttl: number = 3600) {
    const pipeline = this.redis.pipeline();

    // Store value
    pipeline.setex(key, ttl, JSON.stringify(value));

    // Associate with tags
    tags.forEach((tag) => {
      pipeline.sadd(`tag:${tag}`, key);
      pipeline.expire(`tag:${tag}`, ttl);
    });

    await pipeline.exec();
  }

  async invalidateTag(tag: string) {
    const keys = await this.redis.smembers(`tag:${tag}`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
    await this.redis.del(`tag:${tag}`);
  }
}

const taggedCache = new TaggedCache(redis);

// Usage
await taggedCache.set('product:123', product, ['products', 'category:electronics'], 3600);
await taggedCache.invalidateTag('products'); // Invalidates all products
```

## Distributed Locking (Redlock)

```typescript
import Redlock from 'redlock';

const redlock = new Redlock([redis], {
  driftFactor: 0.01,
  retryCount: 10,
  retryDelay: 200,
  retryJitter: 200,
});

async function processWithLock(resourceId: string) {
  const lock = await redlock.acquire([`locks:${resourceId}`], 5000);

  try {
    // Critical section - only one process can execute this
    await performCriticalOperation(resourceId);
  } finally {
    await lock.release();
  }
}

// Optimistic locking with WATCH
async function optimisticUpdate(key: string, updater: (val: any) => any) {
  while (true) {
    await redis.watch(key);

    const value = await redis.get(key);
    const parsed = value ? JSON.parse(value) : null;
    const updated = updater(parsed);

    const result = await redis
      .multi()
      .set(key, JSON.stringify(updated))
      .exec();

    if (result) break; // Success

    // Transaction failed (value changed) - retry
  }
}
```

## Rate Limiting

```typescript
// Fixed window
async function rateLimitFixed(userId: string, maxRequests: number, windowSeconds: number) {
  const key = `ratelimit:${userId}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }

  return {
    allowed: current <= maxRequests,
    remaining: Math.max(0, maxRequests - current),
    resetAt: Math.ceil(Date.now() / 1000 / windowSeconds) * windowSeconds,
  };
}

// Sliding window
async function rateLimitSliding(userId: string, maxRequests: number, windowMs: number) {
  const key = `ratelimit:sliding:${userId}`;
  const now = Date.now();
  const windowStart = now - windowMs;

  const pipeline = redis.pipeline();

  // Remove old entries
  pipeline.zremrangebyscore(key, 0, windowStart);

  // Count requests in window
  pipeline.zcard(key);

  // Add current request
  pipeline.zadd(key, now, `${now}`);

  // Set expiration
  pipeline.expire(key, Math.ceil(windowMs / 1000));

  const results = await pipeline.exec();
  const count = results?.[1]?.[1] as number;

  return {
    allowed: count < maxRequests,
    remaining: Math.max(0, maxRequests - count),
    current: count + 1,
  };
}

// Token bucket
async function rateLimitTokenBucket(userId: string, capacity: number, refillRate: number) {
  const key = `ratelimit:bucket:${userId}`;

  const script = `
    local key = KEYS[1]
    local capacity = tonumber(ARGV[1])
    local refillRate = tonumber(ARGV[2])
    local now = tonumber(ARGV[3])

    local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill')
    local tokens = tonumber(bucket[1]) or capacity
    local lastRefill = tonumber(bucket[2]) or now

    local elapsed = now - lastRefill
    local refillAmount = elapsed * refillRate
    tokens = math.min(capacity, tokens + refillAmount)

    if tokens >= 1 then
      tokens = tokens - 1
      redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', now)
      redis.call('EXPIRE', key, 3600)
      return {1, math.floor(tokens)}
    else
      return {0, 0}
    end
  `;

  const result = await redis.eval(script, 1, key, capacity, refillRate / 1000, Date.now());
  const [allowed, remaining] = result as number[];

  return {
    allowed: allowed === 1,
    remaining,
  };
}
```

## Session Management

```typescript
import session from 'express-session';
import RedisStore from 'connect-redis';

// Express session with Redis
const sessionStore = new RedisStore({ client: redis });

app.use(
  session({
    store: sessionStore,
    secret: 'session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// Custom session management
class SessionManager {
  private redis: Redis;
  private prefix = 'session:';

  constructor(redis: Redis) {
    this.redis = redis;
  }

  async create(userId: string, data: any): Promise<string> {
    const sessionId = crypto.randomUUID();
    const key = `${this.prefix}${sessionId}`;

    await this.redis.setex(
      key,
      86400, // 24 hours
      JSON.stringify({ userId, ...data, createdAt: Date.now() })
    );

    return sessionId;
  }

  async get(sessionId: string): Promise<any | null> {
    const key = `${this.prefix}${sessionId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async update(sessionId: string, data: any): Promise<void> {
    const key = `${this.prefix}${sessionId}`;
    const existing = await this.get(sessionId);
    if (!existing) return;

    await this.redis.setex(key, 86400, JSON.stringify({ ...existing, ...data }));
  }

  async destroy(sessionId: string): Promise<void> {
    await this.redis.del(`${this.prefix}${sessionId}`);
  }

  async refresh(sessionId: string): Promise<void> {
    const key = `${this.prefix}${sessionId}`;
    await this.redis.expire(key, 86400);
  }
}
```

## Pub/Sub Patterns

```typescript
// Simple pub/sub
const subscriber = redis.duplicate();

await subscriber.subscribe('notifications', (message) => {
  console.log('Notification:', message);
});

await redis.publish('notifications', JSON.stringify({ type: 'alert', message: 'Hello' }));

// Pattern-based subscription
await subscriber.psubscribe('user:*:notifications', (message, channel) => {
  const userId = channel.split(':')[1];
  console.log(`Notification for user ${userId}:`, message);
});

await redis.publish('user:123:notifications', 'You have a new message');

// Cache invalidation via pub/sub
class DistributedCache {
  private redis: Redis;
  private subscriber: Redis;
  private localCache = new Map<string, any>();

  constructor(redis: Redis) {
    this.redis = redis;
    this.subscriber = redis.duplicate();

    this.subscriber.subscribe('cache:invalidate', (message) => {
      const { key, pattern } = JSON.parse(message);
      if (key) {
        this.localCache.delete(key);
      } else if (pattern) {
        // Clear matching keys
        for (const k of this.localCache.keys()) {
          if (k.startsWith(pattern)) {
            this.localCache.delete(k);
          }
        }
      }
    });
  }

  async get(key: string): Promise<any> {
    // Check local cache first
    if (this.localCache.has(key)) {
      return this.localCache.get(key);
    }

    // Check Redis
    const value = await this.redis.get(key);
    if (value) {
      const parsed = JSON.parse(value);
      this.localCache.set(key, parsed);
      return parsed;
    }

    return null;
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.redis.setex(key, ttl, JSON.stringify(value));
    this.localCache.set(key, value);
  }

  async invalidate(key: string): Promise<void> {
    await this.redis.del(key);
    await this.redis.publish('cache:invalidate', JSON.stringify({ key }));
  }
}
```

## Caching Query Results

```typescript
async function getCachedQueryResults<T>(
  queryKey: string,
  query: () => Promise<T>,
  ttl: number = 300
): Promise<T> {
  const cached = await cache.get<T>(queryKey);
  if (cached) return cached;

  const results = await query();
  await cache.set(queryKey, results, ttl);
  return results;
}

// Usage with database query
const products = await getCachedQueryResults(
  'products:category:electronics:page:1',
  async () => {
    return db.products.find({ category: 'electronics' }).limit(20);
  },
  600 // 10 minutes
);

// Cache with automatic invalidation
class SmartQueryCache {
  private cache: CacheManager;
  private dependencies = new Map<string, Set<string>>();

  constructor(cache: CacheManager) {
    this.cache = cache;
  }

  async query<T>(
    key: string,
    fetcher: () => Promise<T>,
    deps: string[] = [],
    ttl: number = 600
  ): Promise<T> {
    // Track dependencies
    deps.forEach((dep) => {
      if (!this.dependencies.has(dep)) {
        this.dependencies.set(dep, new Set());
      }
      this.dependencies.get(dep)!.add(key);
    });

    return this.cache.getOrSet(key, fetcher, ttl);
  }

  async invalidate(dependency: string): Promise<void> {
    const affectedKeys = this.dependencies.get(dependency);
    if (affectedKeys) {
      await Promise.all([...affectedKeys].map((key) => this.cache.delete(key)));
      this.dependencies.delete(dependency);
    }
  }
}

const queryCache = new SmartQueryCache(cache);

// Query with dependencies
const user = await queryCache.query(
  `user:${userId}`,
  () => db.users.findById(userId),
  [`user:${userId}`],
  3600
);

// Invalidate all queries depending on this user
await queryCache.invalidate(`user:${userId}`);
```

## Python Implementation

```python
import redis
import json
from typing import Any, Optional, Callable
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379, decode_responses=True)

class CacheManager:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client

    def get(self, key: str) -> Optional[Any]:
        value = self.redis.get(key)
        return json.loads(value) if value else None

    def set(self, key: str, value: Any, ttl: int = 3600):
        self.redis.setex(key, ttl, json.dumps(value))

    def get_or_set(self, key: str, fetcher: Callable, ttl: int = 3600):
        cached = self.get(key)
        if cached is not None:
            return cached

        value = fetcher()
        self.set(key, value, ttl)
        return value

    def delete(self, key: str):
        self.redis.delete(key)

    def delete_pattern(self, pattern: str):
        keys = self.redis.keys(pattern)
        if keys:
            self.redis.delete(*keys)

# Decorator for caching
def cached(key_pattern: str, ttl: int = 3600):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = key_pattern.format(*args, **kwargs)
            cached = cache.get(key)
            if cached is not None:
                return cached

            result = func(*args, **kwargs)
            cache.set(key, result, ttl)
            return result
        return wrapper
    return decorator

cache = CacheManager(redis_client)

# Usage
@cached("user:{0}", ttl=3600)
def get_user(user_id: str):
    return db.users.find_one({"_id": user_id})
```

Build high-performance distributed caching with Redis and advanced patterns.
