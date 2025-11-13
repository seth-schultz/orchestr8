---
id: testing-integration
category: skill
tags: [testing, integration-testing, api-testing, database-testing, supertest]
capabilities:
  - API endpoint testing with supertest
  - Database test setup and cleanup
  - Authenticated endpoint testing
  - Test data factories
  - External service mocking
estimatedTokens: 480
useWhen:
  - Writing integration tests for REST API endpoints with supertest validating request/response contracts and status codes
  - Building database integration tests with real test database ensuring proper setup, cleanup, and data isolation
  - Testing authenticated API endpoints with JWT or session tokens validating authorization logic
  - Creating test data factories generating unique test data for each integration test run
  - Mocking external services with nock to test integration points without calling real third-party APIs
  - Implementing integration test suite with beforeAll/afterAll hooks for database setup and teardown
---

# Integration Testing Patterns

> **Parent skill:** orchestr8://skills/testing-strategies (Testing pyramid, test philosophy)
>
> **Related skills:**
> - orchestr8://skills/testing-unit - Testing components in isolation
> - orchestr8://skills/testing-integration-patterns - Advanced integration patterns with test containers
> - orchestr8://skills/testing-e2e-best-practices - Full user workflow testing

## Test Database Setup

```typescript
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { beforeAll, afterAll, beforeEach } from 'vitest';

const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_TEST_URL },
  },
});

beforeAll(async () => {
  // Run migrations on test database
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_TEST_URL },
  });
});

beforeEach(async () => {
  // Clean database before each test
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  // Or use transactions for isolation
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

## API Endpoint Testing

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { app } from './app';
import { prisma } from './db';

const request = supertest(app);

describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'SecurePass123',
    };

    const response = await request
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body).toMatchObject({
      user: {
        id: expect.any(String),
        email: userData.email,
        name: userData.name,
      },
    });
    expect(response.body.user.password).toBeUndefined();

    // Verify in database
    const user = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    expect(user).toBeTruthy();
  });

  it('should reject duplicate email', async () => {
    const userData = { email: 'test@example.com', password: 'test123' };
    
    // Create first user
    await request.post('/api/users').send(userData).expect(201);
    
    // Attempt duplicate
    const response = await request
      .post('/api/users')
      .send(userData)
      .expect(409);

    expect(response.body.error.code).toBe('CONFLICT');
  });

  it('should validate required fields', async () => {
    const response = await request
      .post('/api/users')
      .send({ email: 'invalid' })
      .expect(400);

    expect(response.body.error.code).toBe('VALIDATION_ERROR');
    expect(response.body.error.details).toBeDefined();
  });
});
```

## Authenticated API Testing

```typescript
describe('Protected endpoints', () => {
  let authToken: string;
  let userId: string;

  beforeEach(async () => {
    // Create user and get auth token
    const response = await request
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123',
      });

    authToken = response.body.token;
    userId = response.body.user.id;
  });

  it('should get current user profile', async () => {
    const response = await request
      .get('/api/users/me')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.user.id).toBe(userId);
  });

  it('should reject request without token', async () => {
    await request.get('/api/users/me').expect(401);
  });

  it('should reject request with invalid token', async () => {
    await request
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });
});
```

## Test Data Factories

```typescript
// factories/user.factory.ts
let userCounter = 0;

export async function createTestUser(
  overrides?: Partial<User>
): Promise<User> {
  userCounter++;
  
  return prisma.user.create({
    data: {
      email: `test${userCounter}@example.com`,
      name: `Test User ${userCounter}`,
      password: await bcrypt.hash('password123', 10),
      ...overrides,
    },
  });
}

export async function createTestPost(
  userId: string,
  overrides?: Partial<Post>
): Promise<Post> {
  return prisma.post.create({
    data: {
      title: 'Test Post',
      content: 'Test content',
      authorId: userId,
      ...overrides,
    },
  });
}

// Usage in tests
it('should list user posts', async () => {
  const user = await createTestUser();
  await createTestPost(user.id, { title: 'First Post' });
  await createTestPost(user.id, { title: 'Second Post' });

  const response = await request
    .get(`/api/users/${user.id}/posts`)
    .expect(200);

  expect(response.body.posts).toHaveLength(2);
});
```

## Database Transaction Isolation

```typescript
import { PrismaClient } from '@prisma/client';

// Wrap each test in a transaction and rollback
export function withTransaction(testFn: () => Promise<void>) {
  return async () => {
    await prisma.$transaction(async (tx) => {
      // Run test with transaction client
      try {
        await testFn();
      } finally {
        // Transaction automatically rolls back if error thrown
        throw new Error('Rollback test transaction');
      }
    }).catch((err) => {
      // Ignore rollback error
      if (err.message !== 'Rollback test transaction') {
        throw err;
      }
    });
  };
}

// Usage
it('should create user', withTransaction(async () => {
  const user = await createTestUser();
  expect(user.id).toBeDefined();
  // Automatically rolled back after test
}));
```

## External Service Mocking

```typescript
import nock from 'nock';

describe('External API integration', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should fetch data from external API', async () => {
    // Mock external API
    nock('https://api.external.com')
      .get('/users/123')
      .reply(200, {
        id: '123',
        name: 'External User',
      });

    const response = await request
      .get('/api/external/users/123')
      .expect(200);

    expect(response.body.name).toBe('External User');
  });

  it('should handle external API errors', async () => {
    nock('https://api.external.com')
      .get('/users/999')
      .reply(404);

    const response = await request
      .get('/api/external/users/999')
      .expect(404);

    expect(response.body.error.code).toBe('NOT_FOUND');
  });
});
```

## Testing File Uploads

```typescript
import path from 'path';

describe('POST /api/uploads', () => {
  it('should upload and process image', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'test-image.jpg');

    const response = await request
      .post('/api/uploads')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', filePath)
      .expect(201);

    expect(response.body.file).toMatchObject({
      id: expect.any(String),
      filename: expect.stringContaining('.jpg'),
      url: expect.stringContaining('http'),
    });
  });

  it('should reject non-image files', async () => {
    const filePath = path.join(__dirname, 'fixtures', 'test.txt');

    await request
      .post('/api/uploads')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', filePath)
      .expect(400);
  });
});
```

## Test Environment Configuration

```typescript
// test-setup.ts
import { config } from 'dotenv';
import { execSync } from 'child_process';

// Load test environment variables
config({ path: '.env.test' });

// Verify test database
if (!process.env.DATABASE_TEST_URL?.includes('test')) {
  throw new Error('DATABASE_TEST_URL must include "test" for safety');
}

// Setup test database
export async function setupTestDatabase() {
  execSync('npx prisma migrate reset --force', {
    env: { ...process.env, DATABASE_URL: process.env.DATABASE_TEST_URL },
    stdio: 'inherit',
  });
}

// vitest.config.ts
export default {
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./test-setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    },
  },
};
```

## Key Principles

1. **Isolated tests**: Each test runs with clean state
2. **Real database**: Use test database, not mocks
3. **Transaction rollback**: Fast cleanup between tests
4. **Factory functions**: Generate realistic test data
5. **Mock external services**: Don't call real APIs
6. **Test authentication**: Include auth flows in tests
7. **Cleanup after tests**: Remove test data, close connections
