---
id: performance-caching-implementations
category: example
tags: [caching, redis, performance, typescript, implementation, cache-strategies]
capabilities:
  - Complete cache implementations for multiple layers
  - In-memory cache with NodeCache
  - Distributed Redis cache with race condition prevention
  - HTTP caching with ETag middleware
  - Cache-aside, write-through, and write-behind patterns
  - Event-based and tag-based invalidation strategies
useWhen:
  - Implementing multi-layer caching in TypeScript applications
  - Need complete Redis cache with thundering herd prevention
  - Building HTTP caching middleware with ETag support
  - Implementing cache invalidation with events or tags
  - Creating cache warming and monitoring utilities
estimatedTokens: 1500
relatedResources:
  - orchestr8://patterns/performance-caching
---

# Performance Caching - Complete Implementations

Production-ready caching implementations for in-memory, distributed (Redis), and HTTP layers with advanced patterns.

## In-Memory Cache Implementation

```typescript
import NodeCache from 'node-cache';

class InMemoryCache {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({
      stdTTL: 300,           // Default TTL: 5 minutes
      checkperiod: 60,       // Cleanup interval: 60 seconds
      useClones: false,      // Store references for performance
      maxKeys: 1000          // Limit memory usage
    });
  }

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    this.cache.set(key, value, ttl || 300);
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== undefined) {
      return cached;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  invalidate(pattern: string): void {
    const keys = this.cache.keys();
    keys.filter(k => k.startsWith(pattern))
        .forEach(k => this.cache.del(k));
  }
}

// Usage in service
class UserService {
  constructor(
    private cache: InMemoryCache,
    private repository: UserRepository
  ) {}

  async getUserById(id: string): Promise<User> {
    return this.cache.getOrSet(
      `user:${id}`,
      () => this.repository.findById(id),
      600 // 10 minutes
    );
  }
}
```

## Distributed Redis Cache

```typescript
import Redis from 'ioredis';

class RedisCache {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    if (ttlSeconds) {
      await this.redis.setex(key, ttlSeconds, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }

  // Cache-aside pattern with race condition prevention
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    // Try to get from cache
    const cached = await this.get<T>(key);
    if (cached) return cached;

    // Use lock to prevent thundering herd
    const lockKey = `lock:${key}`;
    const acquired = await this.redis.set(
      lockKey, '1', 'EX', 10, 'NX'
    );

    if (!acquired) {
      // Another process is fetching, wait and retry
      await new Promise(resolve => setTimeout(resolve, 100));
      return this.getOrSet(key, factory, ttl);
    }

    try {
      const value = await factory();
      await this.set(key, value, ttl);
      return value;
    } finally {
      await this.redis.del(lockKey);
    }
  }

  // Invalidate by pattern
  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // Batch operations
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    const values = await this.redis.mget(...keys);
    return values.map(v => v ? JSON.parse(v) : null);
  }
}
```

## HTTP Caching with ETag

```typescript
class CacheHeaderService {
  // Immutable assets (versioned files)
  static immutableAsset(res: Response): void {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('Vary', 'Accept-Encoding');
  }

  // Dynamic content with validation
  static revalidate(res: Response, seconds: number = 60): void {
    res.setHeader('Cache-Control', `public, max-age=${seconds}, must-revalidate`);
    res.setHeader('ETag', this.generateETag(res));
  }

  // Private user-specific content
  static privateContent(res: Response, seconds: number = 300): void {
    res.setHeader('Cache-Control', `private, max-age=${seconds}`);
  }

  // No caching for sensitive data
  static noCache(res: Response): void {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }

  // ETag for conditional requests
  private static generateETag(res: Response): string {
    const crypto = require('crypto');
    return crypto.createHash('md5')
      .update(JSON.stringify(res.locals.data))
      .digest('hex');
  }
}

// Middleware for ETag support
class ETagMiddleware {
  static conditional(req: Request, res: Response, next: NextFunction): void {
    const originalSend = res.send;

    res.send = function(body: any): Response {
      if (req.method === 'GET') {
        const etag = crypto.createHash('md5').update(body).digest('hex');
        res.setHeader('ETag', `"${etag}"`);

        // Check If-None-Match header
        if (req.headers['if-none-match'] === `"${etag}"`) {
          res.status(304).end();
          return res;
        }
      }

      return originalSend.call(this, body);
    };

    next();
  }
}
```

## Caching Strategy Patterns

### Cache-Aside (Lazy Loading)

```typescript
class ProductService {
  async getProduct(id: string): Promise<Product> {
    // 1. Check cache first
    const cached = await this.cache.get(`product:${id}`);
    if (cached) return cached;

    // 2. Cache miss: fetch from database
    const product = await this.db.products.findById(id);

    // 3. Store in cache
    await this.cache.set(`product:${id}`, product, 3600);

    return product;
  }
}
```

### Write-Through

```typescript
class ProductService {
  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    // 1. Update database
    const product = await this.db.products.update(id, data);

    // 2. Update cache immediately
    await this.cache.set(`product:${id}`, product, 3600);

    return product;
  }
}
```

### Write-Behind (Write-Back)

```typescript
class AnalyticsService {
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    // 1. Write to cache immediately
    await this.cache.lpush('analytics:queue', JSON.stringify(event));

    // 2. Async worker writes to database later
    // (Handled by background job)
  }

  // Background worker
  async flushEvents(): Promise<void> {
    const events = await this.cache.lrange('analytics:queue', 0, 99);
    if (events.length > 0) {
      await this.db.analytics.bulkInsert(events.map(e => JSON.parse(e)));
      await this.cache.ltrim('analytics:queue', events.length, -1);
    }
  }
}
```

## Cache Invalidation Strategies

### Time-Based (TTL)

```typescript
// Simple TTL
await cache.set('user:123', user, 600); // 10 minutes

// Sliding expiration
class SlidingExpirationCache {
  async get<T>(key: string, ttl: number): Promise<T | null> {
    const value = await this.redis.get<T>(key);
    if (value) {
      // Reset TTL on access
      await this.redis.expire(key, ttl);
    }
    return value;
  }
}
```

### Event-Based Invalidation

```typescript
class CacheInvalidationService {
  constructor(private eventBus: EventBus, private cache: RedisCache) {
    this.setupListeners();
  }

  private setupListeners(): void {
    this.eventBus.on('user.updated', async (event) => {
      await this.cache.invalidatePattern(`user:${event.userId}*`);
    });

    this.eventBus.on('product.updated', async (event) => {
      await Promise.all([
        this.cache.invalidatePattern(`product:${event.productId}*`),
        this.cache.invalidatePattern('products:list*'),
        this.cache.invalidatePattern(`category:${event.categoryId}*`)
      ]);
    });
  }
}
```

### Tag-Based Invalidation

```typescript
class TaggedCache {
  async set(key: string, value: any, tags: string[], ttl: number): Promise<void> {
    // Store value
    await this.redis.set(key, value, ttl);

    // Associate with tags
    for (const tag of tags) {
      await this.redis.sadd(`tag:${tag}`, key);
    }
  }

  async invalidateByTag(tag: string): Promise<void> {
    const keys = await this.redis.smembers(`tag:${tag}`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
      await this.redis.del(`tag:${tag}`);
    }
  }
}
```

## Cache Warming

```javascript
// Pre-populate cache on startup
async function warmCache() {
  console.log('Warming cache...');

  // Load popular items
  const popular = await db.product.find({ views: { $gt: 1000 } });
  for (const product of popular) {
    await redis.setex(`product:${product.id}`, 3600, JSON.stringify(product));
  }

  // Load configuration
  const config = await db.config.findAll();
  await redis.setex('app:config', 300, JSON.stringify(config));

  console.log(`Cache warmed with ${popular.length} products`);
}

// Periodic refresh
setInterval(async () => {
  const featured = await db.product.find({ featured: true });
  await redis.setex('products:featured', 600, JSON.stringify(featured));
}, 300000); // Refresh every 5 minutes
```

## Cache Metrics and Monitoring

```javascript
const cacheHits = new promClient.Counter({
  name: 'cache_hits_total',
  help: 'Total cache hits',
  labelNames: ['cache_type']
});

const cacheMisses = new promClient.Counter({
  name: 'cache_misses_total',
  help: 'Total cache misses',
  labelNames: ['cache_type']
});

async function getCached(key) {
  const value = await redis.get(key);
  if (value) {
    cacheHits.inc({ cache_type: 'redis' });
    return JSON.parse(value);
  }
  cacheMisses.inc({ cache_type: 'redis' });
  return null;
}

// Alert on low hit rate
// (cache_hits_total / (cache_hits_total + cache_misses_total)) < 0.7
```
