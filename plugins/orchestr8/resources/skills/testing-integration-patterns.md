---
id: testing-integration-patterns
category: skill
tags: [testing, integration-testing, test-containers, docker, transactions, advanced-patterns]
capabilities:
  - Test containers with Docker (PostgreSQL, Redis, etc.)
  - Database transaction rollback patterns
  - Advanced API testing patterns
  - Database seeding and cleanup strategies
  - Testing database transactions and concurrency
estimatedTokens: 450
useWhen:
  - Implementing test containers with @testcontainers library for isolated PostgreSQL, Redis, or other service instances
  - Using database transaction rollback pattern for fast test cleanup without truncating tables
  - Creating advanced integration test patterns with database seeding, fixtures, and realistic test datasets
  - Testing database transaction handling, rollbacks, and error scenarios with proper isolation
  - Building reproducible integration test environments with Docker Compose for CI/CD pipelines
  - Mocking external HTTP APIs with nock library to test third-party service integrations reliably
---

# Integration Testing Patterns

> **Parent skill:** orchestr8://skills/testing-strategies (Testing pyramid, test philosophy)
>
> **Related skills:**
> - orchestr8://skills/testing-integration - Basic integration testing with supertest
> - orchestr8://skills/testing-unit - Unit testing in isolation
> - orchestr8://skills/testing-e2e-best-practices - Full stack testing

**Note:** This skill covers advanced integration patterns. For basic API and database testing, see orchestr8://skills/testing-integration.

## Test Container Setup

### Docker Compose for Integration Tests

```typescript
// tests/integration/setup.ts
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { RedisContainer } from '@testcontainers/redis';

let postgresContainer: StartedPostgreSqlContainer;
let redisContainer: StartedRedisContainer;

export async function setupTestEnvironment() {
  // Start containers
  postgresContainer = await new PostgreSqlContainer('postgres:16')
    .withDatabase('test_db')
    .withUsername('test')
    .withPassword('test')
    .start();

  redisContainer = await new RedisContainer('redis:7')
    .start();

  // Set environment variables
  process.env.DATABASE_URL = postgresContainer.getConnectionUri();
  process.env.REDIS_URL = redisContainer.getConnectionUrl();
}

export async function teardownTestEnvironment() {
  await postgresContainer?.stop();
  await redisContainer?.stop();
}
```

### Database Transaction Rollback

```typescript
import { PrismaClient } from '@prisma/client';

describe('UserService Integration Tests', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    // Start transaction
    await prisma.$executeRaw`BEGIN`;
  });

  afterEach(async () => {
    // Rollback after each test
    await prisma.$executeRaw`ROLLBACK`;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create user in database', async () => {
    const user = await prisma.user.create({
      data: { email: 'test@example.com', name: 'Test' },
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@example.com');
    // Rolled back after test
  });
});
```

## API Testing Patterns

### REST API Testing with Supertest

```typescript
import request from 'supertest';
import { app } from '../src/app';

describe('POST /api/users', () => {
  it('should create user and return 201', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        email: 'test@example.com',
        name: 'Test User',
        password: 'SecurePass123',
      })
      .expect(201)
      .expect('Content-Type', /json/);

    expect(response.body).toMatchObject({
      user: {
        email: 'test@example.com',
        name: 'Test User',
      },
    });
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ email: 'invalid', password: 'test' })
      .expect(400);

    expect(response.body).toMatchObject({
      error: expect.stringContaining('email'),
    });
  });

  it('should return 409 for duplicate email', async () => {
    // Create first user
    await request(app).post('/api/users').send({
      email: 'duplicate@example.com',
      password: 'test123',
    });

    // Attempt duplicate
    await request(app)
      .post('/api/users')
      .send({
        email: 'duplicate@example.com',
        password: 'test123',
      })
      .expect(409);
  });
});
```

### Authenticated API Testing

```typescript
describe('Protected endpoints', () => {
  let authToken: string;

  beforeEach(async () => {
    // Create user and get auth token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'test123' });

    authToken = loginResponse.body.token;
  });

  it('should access protected route with token', async () => {
    await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('should reject request without token', async () => {
    await request(app)
      .get('/api/users/me')
      .expect(401);
  });

  it('should reject request with invalid token', async () => {
    await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalid_token')
      .expect(401);
  });
});
```

## Database Integration Testing

### Seeding Test Data

```typescript
// tests/integration/helpers/seedDatabase.ts
export async function seedTestData(prisma: PrismaClient) {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  const orders = await prisma.order.createMany({
    data: [
      { userId: user.id, total: 100, status: 'pending' },
      { userId: user.id, total: 200, status: 'completed' },
    ],
  });

  return { user, orders };
}

// Usage
describe('OrderService', () => {
  let testData: Awaited<ReturnType<typeof seedTestData>>;

  beforeEach(async () => {
    testData = await seedTestData(prisma);
  });

  it('should find user orders', async () => {
    const orders = await orderService.findByUserId(testData.user.id);
    expect(orders).toHaveLength(2);
  });
});
```

### Testing Transactions

```typescript
describe('Transaction handling', () => {
  it('should rollback on error', async () => {
    const orderId = 'order-1';

    await expect(
      orderService.processOrder(orderId) // Throws error mid-transaction
    ).rejects.toThrow();

    // Verify rollback - order still in pending state
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    expect(order?.status).toBe('pending');
  });

  it('should commit successful transaction', async () => {
    const orderId = 'order-1';

    await orderService.processOrder(orderId);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });
    expect(order?.status).toBe('completed');
  });
});
```

## External Service Integration

### Mocking External APIs

```typescript
import nock from 'nock';

describe('Payment service integration', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should process payment via external gateway', async () => {
    // Mock external API
    nock('https://payment-gateway.example.com')
      .post('/charge')
      .reply(200, {
        id: 'charge_123',
        status: 'succeeded',
        amount: 10000,
      });

    const result = await paymentService.charge({
      amount: 100,
      currency: 'usd',
      token: 'tok_test',
    });

    expect(result.status).toBe('succeeded');
  });

  it('should handle gateway timeout', async () => {
    nock('https://payment-gateway.example.com')
      .post('/charge')
      .delayConnection(6000) // Longer than timeout
      .reply(200, {});

    await expect(
      paymentService.charge({
        amount: 100,
        currency: 'usd',
        token: 'tok_test',
      })
    ).rejects.toThrow('timeout');
  });
});
```

## Test Data Management

### Database Cleanup Strategies

```typescript
// Strategy 1: Truncate tables
export async function cleanDatabase(prisma: PrismaClient) {
  const tables = ['Order', 'User', 'Product'];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
  }
}

// Strategy 2: Delete in reverse FK order
export async function cleanDatabase(prisma: PrismaClient) {
  await prisma.order.deleteMany({});
  await prisma.user.deleteMany({});
}

// Strategy 3: Transaction rollback (preferred)
beforeEach(async () => {
  await prisma.$executeRaw`BEGIN`;
});

afterEach(async () => {
  await prisma.$executeRaw`ROLLBACK`;
});
```

## Key Principles

✅ **Use real dependencies** - Test actual integrations
✅ **Isolate with containers** - Each test suite gets fresh environment
✅ **Clean between tests** - Transaction rollback or cleanup
✅ **Test error scenarios** - Network failures, timeouts, conflicts
✅ **Seed realistic data** - Test with production-like datasets
✅ **Test boundaries** - Where your code meets external systems

❌ **Don't mock databases** - Use real DB with test containers
❌ **Don't share test data** - Causes flaky tests
❌ **Don't test external APIs** - Mock them or use dedicated tests
❌ **Don't leave test data** - Always cleanup
