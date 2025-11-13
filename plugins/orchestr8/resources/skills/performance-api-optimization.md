---
id: performance-api-optimization
category: skill
tags: [performance, api, rest, graphql, rate-limiting, pagination, batching, optimization]
capabilities:
  - API response time optimization
  - Pagination strategies
  - Rate limiting implementation
  - Request batching and debouncing
estimatedTokens: 650
useWhen:
  - Optimizing REST API response times with database query optimization, caching, and response compression
  - Building API performance monitoring with APM tools tracking endpoint latency percentiles and error rates
  - Implementing GraphQL DataLoader pattern preventing N+1 queries and batching database requests efficiently
  - Designing API pagination strategy with cursor-based pagination and efficient database offset queries
  - Creating API rate limiting with token bucket algorithm protecting backend services from traffic spikes
---

# API Performance Optimization

## Response Time Optimization

```javascript
// Compression middleware
const compression = require('compression');
app.use(compression({
  level: 6, // Balance speed vs size
  threshold: 1024, // Only compress >1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));

// Stream large responses
app.get('/api/export', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Transfer-Encoding', 'chunked');

  res.write('[');
  const stream = db.collection('items').find().stream();

  let first = true;
  stream.on('data', (item) => {
    if (!first) res.write(',');
    res.write(JSON.stringify(item));
    first = false;
  });

  stream.on('end', () => {
    res.write(']');
    res.end();
  });
});

// Parallel data fetching
app.get('/api/dashboard', async (req, res) => {
  // ❌ Sequential (slow)
  // const users = await fetchUsers();
  // const orders = await fetchOrders();
  // const metrics = await fetchMetrics();

  // ✅ Parallel (fast)
  const [users, orders, metrics] = await Promise.all([
    fetchUsers(),
    fetchOrders(),
    fetchMetrics()
  ]);

  res.json({ users, orders, metrics });
});
```

## Pagination Strategies

```javascript
// Offset-based pagination (simple, inconsistent with updates)
app.get('/api/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  const [products, total] = await Promise.all([
    db.product.findMany({ skip: offset, take: limit }),
    db.product.count()
  ]);

  res.json({
    data: products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: offset + limit < total
    }
  });
});

// Cursor-based pagination (consistent, efficient)
app.get('/api/products', async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const cursor = req.query.cursor;

  const products = await db.product.findMany({
    take: limit + 1,
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1 // Skip cursor item
    }),
    orderBy: { id: 'asc' }
  });

  const hasNext = products.length > limit;
  const data = hasNext ? products.slice(0, -1) : products;

  res.json({
    data,
    pagination: {
      nextCursor: hasNext ? data[data.length - 1].id : null,
      hasNext
    }
  });
});

// Seek/keyset pagination (fastest for large datasets)
app.get('/api/products', async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const lastId = req.query.lastId;
  const lastDate = req.query.lastDate;

  const products = await db.product.findMany({
    where: lastId ? {
      OR: [
        { createdAt: { lt: lastDate } },
        { createdAt: lastDate, id: { lt: lastId } }
      ]
    } : undefined,
    orderBy: [
      { createdAt: 'desc' },
      { id: 'desc' }
    ],
    take: limit + 1
  });

  const hasNext = products.length > limit;
  const data = hasNext ? products.slice(0, -1) : products;
  const last = data[data.length - 1];

  res.json({
    data,
    pagination: {
      lastId: last?.id,
      lastDate: last?.createdAt,
      hasNext
    }
  });
});
```

## Rate Limiting

```javascript
// express-rate-limit
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: req.rateLimit.resetTime
    });
  }
});

app.use('/api/', apiLimiter);

// Tiered rate limits
const tierLimits = {
  free: rateLimit({ windowMs: 60000, max: 10 }),
  premium: rateLimit({ windowMs: 60000, max: 100 }),
  enterprise: rateLimit({ windowMs: 60000, max: 1000 })
};

app.use('/api/', (req, res, next) => {
  const tier = req.user?.tier || 'free';
  tierLimits[tier](req, res, next);
});

// Redis-based distributed rate limiting
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const limiter = rateLimit({
  store: new RedisStore({
    client: redis.createClient(),
    prefix: 'rl:'
  }),
  windowMs: 60000,
  max: 100
});

// Token bucket algorithm (smooth rate limiting)
class TokenBucket {
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate; // tokens per second
    this.lastRefill = Date.now();
  }

  async consume(tokens = 1) {
    this.refill();
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    return false;
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsed * this.refillRate
    );
    this.lastRefill = now;
  }
}
```

## Request Batching

```javascript
// DataLoader for batching (GraphQL pattern)
const DataLoader = require('dataloader');

const userLoader = new DataLoader(async (ids) => {
  const users = await db.user.findMany({
    where: { id: { in: ids } }
  });
  return ids.map(id => users.find(u => u.id === id));
}, {
  batch: true,
  cache: true,
  maxBatchSize: 100
});

// Usage - multiple calls batched into single query
const user1 = await userLoader.load(1);
const user2 = await userLoader.load(2);
const user3 = await userLoader.load(3);
// Single DB query: SELECT * FROM users WHERE id IN (1, 2, 3)

// REST batch endpoint
app.post('/api/batch', async (req, res) => {
  const requests = req.body.requests; // [{ method, url, body }]

  const results = await Promise.allSettled(
    requests.map(async ({ method, url, body }) => {
      // Execute each request
      return await handleRequest(method, url, body);
    })
  );

  res.json({
    results: results.map((r, i) => ({
      status: r.status === 'fulfilled' ? 200 : 500,
      data: r.status === 'fulfilled' ? r.value : null,
      error: r.status === 'rejected' ? r.reason.message : null
    }))
  });
});

// Client-side batching
class RequestBatcher {
  constructor(batchDelay = 10) {
    this.queue = [];
    this.timer = null;
    this.batchDelay = batchDelay;
  }

  async request(method, url, body) {
    return new Promise((resolve, reject) => {
      this.queue.push({ method, url, body, resolve, reject });

      if (!this.timer) {
        this.timer = setTimeout(() => this.flush(), this.batchDelay);
      }
    });
  }

  async flush() {
    const batch = this.queue.splice(0);
    this.timer = null;

    const response = await fetch('/api/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: batch.map(({ method, url, body }) => ({ method, url, body }))
      })
    });

    const { results } = await response.json();
    results.forEach((result, i) => {
      if (result.status === 200) {
        batch[i].resolve(result.data);
      } else {
        batch[i].reject(new Error(result.error));
      }
    });
  }
}

const batcher = new RequestBatcher();
const user = await batcher.request('GET', '/api/users/1');
```

## GraphQL N+1 Prevention

```javascript
// DataLoader integration
const resolvers = {
  Query: {
    posts: () => db.post.findMany()
  },
  Post: {
    author: (post, args, { loaders }) => {
      return loaders.user.load(post.authorId); // Batched
    },
    comments: (post, args, { loaders }) => {
      return loaders.commentsByPost.load(post.id); // Batched
    }
  }
};

// Context setup
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    loaders: {
      user: new DataLoader(ids => batchGetUsers(ids)),
      commentsByPost: new DataLoader(postIds => batchGetComments(postIds))
    }
  })
});
```

## Field Filtering

```javascript
// Sparse fieldsets (JSON:API style)
app.get('/api/users', async (req, res) => {
  const fields = req.query.fields?.split(',') || ['id', 'name', 'email'];

  const select = fields.reduce((acc, field) => {
    acc[field] = true;
    return acc;
  }, {});

  const users = await db.user.findMany({ select });
  res.json({ data: users });
});

// Usage: /api/users?fields=id,name,email
```

## Caching Headers

```javascript
// ETags for conditional requests
const etag = require('etag');

app.get('/api/products', async (req, res) => {
  const products = await getProducts();
  const etagValue = etag(JSON.stringify(products));

  if (req.headers['if-none-match'] === etagValue) {
    return res.status(304).end();
  }

  res.set('ETag', etagValue);
  res.set('Cache-Control', 'private, max-age=300');
  res.json(products);
});

// Vary header for content negotiation
res.set('Vary', 'Accept-Encoding, Authorization');
```

## Key Principles

✅ **Paginate always** - Never return unbounded lists
✅ **Use cursor pagination** - Better consistency than offset
✅ **Rate limit** - Protect from abuse, distributed with Redis
✅ **Batch requests** - Reduce network overhead with DataLoader
✅ **Compress responses** - gzip/brotli for >1KB payloads
✅ **Stream large data** - Don't buffer everything in memory

## Related Skills

**Performance Family:**
- orchestr8://skills/performance-optimization - Overview of performance optimization principles and when to use each domain
- orchestr8://skills/performance-database-optimization - Database query optimization to complement API performance
- orchestr8://skills/performance-profiling-techniques - Profile to identify API bottlenecks before optimizing

**Related Patterns:**
- orchestr8://patterns/performance-caching - Caching strategies for API responses
- orchestr8://patterns/event-driven-pubsub - Async processing patterns for background jobs

**Implementation Examples:**
- orchestr8://examples/express-error-handling - Express.js error handling patterns
- orchestr8://examples/fastapi-async-crud - FastAPI async CRUD operations
