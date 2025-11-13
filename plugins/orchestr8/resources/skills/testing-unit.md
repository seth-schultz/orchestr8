---
id: testing-unit
category: skill
tags: [testing, unit-testing, test-strategy, mocking, isolation, jest, vitest, typescript]
capabilities:
  - Unit test structure and patterns (AAA pattern)
  - Test doubles: mocks, stubs, spies
  - Test assertions and matchers
  - Dependency injection for testability
  - Test organization and file structure
  - Parameterized testing
estimatedTokens: 620
useWhen:
  - Writing unit tests for TypeScript/JavaScript business logic with Jest or Vitest covering edge cases and error paths
  - Building test suites with AAA pattern (Arrange, Act, Assert) for readable and maintainable unit tests
  - Creating test doubles (mocks, stubs, spies) to isolate dependencies and control test conditions
  - Implementing dependency injection patterns for highly testable code with mockable dependencies
  - Designing parameterized tests with test.each validating multiple input scenarios efficiently
  - Testing async functions, error handling, and boundary conditions in isolated unit tests
  - Organizing unit tests with descriptive naming, test factories, and proper file structure
  - Writing fast, deterministic unit tests with proper isolation using beforeEach/afterEach hooks
---

# Unit Testing Best Practices

> **Parent skill:** orchestr8://skills/testing-strategies (Testing philosophy, TDD, test pyramid)
>
> **Related skills:**
> - orchestr8://skills/testing-integration - Testing component interactions
> - orchestr8://skills/testing-e2e-best-practices - Full workflow testing

## Test Structure: AAA Pattern

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { UserService } from './userService';

describe('UserService', () => {
  let userService: UserService;
  let mockDb: any;

  beforeEach(() => {
    // Arrange: Setup fresh mocks before each test
    mockDb = {
      user: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    };
    userService = new UserService(mockDb);
  });

  it('should create a user with hashed password', async () => {
    // Arrange
    const input = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123',
    };
    const expectedUser = { id: '1', email: input.email, name: input.name };
    mockDb.user.create.mockResolvedValue(expectedUser);

    // Act
    const result = await userService.createUser(input);

    // Assert
    expect(mockDb.user.create).toHaveBeenCalledWith({
      data: {
        email: input.email,
        name: input.name,
        password: expect.any(String), // Hashed password
      },
      select: expect.any(Object),
    });
    expect(result).toEqual(expectedUser);
    expect(result.password).toBeUndefined(); // Should not return password
  });
});
```

## Mocking Dependencies

```typescript
// Mock entire modules
vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashed_password'),
  compare: vi.fn().mockResolvedValue(true),
}));

// Mock with factory
vi.mock('./logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
  },
}));

// Partial mock - keep some real implementations
vi.mock('./utils', async () => {
  const actual = await vi.importActual('./utils');
  return {
    ...actual,
    sendEmail: vi.fn().mockResolvedValue(true), // Mock this
    // Other functions use real implementation
  };
});
```

## Testing Async Functions

```typescript
describe('Async operations', () => {
  it('should handle successful API call', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: '1', name: 'Test' }),
    });
    global.fetch = mockFetch;

    const result = await fetchUser('1');

    expect(result).toEqual({ id: '1', name: 'Test' });
    expect(mockFetch).toHaveBeenCalledWith('/api/users/1');
  });

  it('should throw error on failed API call', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });
    global.fetch = mockFetch;

    await expect(fetchUser('999')).rejects.toThrow('HTTP 404: Not Found');
  });
});
```

## Testing Error Handling

```typescript
describe('Error scenarios', () => {
  it('should throw ValidationError for invalid email', async () => {
    const input = { email: 'invalid', password: 'test123' };

    await expect(userService.createUser(input)).rejects.toThrow(
      ValidationError
    );
  });

  it('should throw ConflictError for duplicate email', async () => {
    mockDb.user.findUnique.mockResolvedValue({ id: '1', email: 'test@example.com' });

    await expect(
      userService.createUser({ email: 'test@example.com', password: 'test' })
    ).rejects.toThrow(ConflictError);
  });

  it('should handle database errors gracefully', async () => {
    mockDb.user.create.mockRejectedValue(new Error('Connection failed'));

    await expect(
      userService.createUser({ email: 'test@example.com', password: 'test' })
    ).rejects.toThrow('Failed to create user');
  });
});
```

## Test Doubles: Mocks, Stubs, Spies

```typescript
// Stub - returns predefined values
const stub = vi.fn().mockReturnValue(42);

// Mock - tracks calls and returns values
const mock = vi.fn()
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default');

// Spy - wraps real function
const spy = vi.spyOn(userService, 'findById');
await userService.findById('1');
expect(spy).toHaveBeenCalledWith('1');
spy.mockRestore(); // Restore original implementation
```

## Testing Pure Functions

```typescript
describe('calculateDiscount', () => {
  it('should apply 10% discount for orders over $100', () => {
    expect(calculateDiscount(150)).toBe(135);
  });

  it('should return original price for orders under $100', () => {
    expect(calculateDiscount(50)).toBe(50);
  });

  it('should handle edge case at $100', () => {
    expect(calculateDiscount(100)).toBe(100);
  });

  it('should handle zero and negative values', () => {
    expect(calculateDiscount(0)).toBe(0);
    expect(calculateDiscount(-10)).toBe(-10);
  });
});
```

## Parameterized Tests

```typescript
describe('validatePassword', () => {
  it.each([
    ['short', false, 'too short'],
    ['nouppercase123', false, 'no uppercase'],
    ['NOLOWERCASE123', false, 'no lowercase'],
    ['NoNumbers', false, 'no numbers'],
    ['ValidPass123', true, 'valid password'],
  ])('should validate password: %s', (password, expected, reason) => {
    const result = isValidPassword(password);
    expect(result).toBe(expected);
  });
});
```

## Test Coverage Best Practices

```typescript
describe('UserService - Complete Coverage', () => {
  // Test happy path
  it('should successfully create user', async () => { /* ... */ });

  // Test validation
  it('should reject invalid email', async () => { /* ... */ });
  it('should reject weak password', async () => { /* ... */ });

  // Test business rules
  it('should prevent duplicate emails', async () => { /* ... */ });
  
  // Test error conditions
  it('should handle database errors', async () => { /* ... */ });
  it('should handle network timeouts', async () => { /* ... */ });

  // Test edge cases
  it('should handle empty input', async () => { /* ... */ });
  it('should handle special characters in email', async () => { /* ... */ });
});
```

## Test Utilities

```typescript
// Test factory functions
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    ...overrides,
  };
}

// Common assertions
function expectValidUser(user: User) {
  expect(user).toHaveProperty('id');
  expect(user).toHaveProperty('email');
  expect(user).not.toHaveProperty('password');
  expect(user.email).toMatch(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
}

// Usage
it('should return valid user', async () => {
  const user = await userService.findById('1');
  expectValidUser(user);
});
```

## Test Isolation Strategies

### Dependency Injection for Testability

```typescript
// Bad: Hard-coded dependencies
class OrderService {
  private db = new Database();
  private emailer = new EmailService();

  async createOrder(data: OrderData) {
    // Can't test without real DB/email
  }
}

// Good: Injected dependencies
class OrderService {
  constructor(
    private db: IDatabase,
    private emailer: IEmailService
  ) {}

  async createOrder(data: OrderData) {
    // Easy to mock dependencies
  }
}

// Test with mocks
const mockDb = createMockDatabase();
const mockEmailer = createMockEmailService();
const service = new OrderService(mockDb, mockEmailer);
```

## Test Organization Patterns

### File Structure

```
src/
├── services/
│   ├── userService.ts
│   └── orderService.ts
tests/
├── unit/
│   ├── services/
│   │   ├── userService.test.ts
│   │   └── orderService.test.ts
│   └── utils/
│       └── validation.test.ts
└── helpers/
    ├── mockFactories.ts
    └── testUtils.ts
```

### Test Factories

```typescript
// tests/helpers/mockFactories.ts
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    createdAt: new Date(),
    ...overrides,
  };
}

export function createMockOrder(overrides?: Partial<Order>): Order {
  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    total: faker.number.float({ min: 10, max: 1000 }),
    status: 'pending',
    ...overrides,
  };
}

// Usage in tests
it('should process order', async () => {
  const user = createMockUser({ email: 'test@example.com' });
  const order = createMockOrder({ userId: user.id, total: 100 });
  // Test with realistic data
});
```

## Boundary Testing

```typescript
describe('calculateShipping', () => {
  it('should charge $5 for orders under $50', () => {
    expect(calculateShipping(49.99)).toBe(5);
  });

  it('should be free for orders $50 and above', () => {
    expect(calculateShipping(50)).toBe(0);
    expect(calculateShipping(100)).toBe(0);
  });

  it('should handle edge cases', () => {
    expect(calculateShipping(0)).toBe(5);
    expect(calculateShipping(49.99)).toBe(5);
    expect(calculateShipping(50.00)).toBe(0);
  });
});
```

## Key Principles

✅ **Test behavior, not implementation** - Focus on inputs/outputs
✅ **Test isolation** - Each test runs independently, mock all external dependencies
✅ **One assertion per test** - Single logical assertion per test when possible, clear failure messages
✅ **Descriptive names** - Test name explains what's being tested and expected outcome
✅ **AAA pattern** - Arrange, Act, Assert structure for clarity
✅ **Fast tests** - Unit tests should run in milliseconds
✅ **Deterministic** - Same input = same output, always
✅ **Independent tests** - Can run in any order without side effects

❌ **Don't test frameworks** - Trust library behavior
❌ **Don't test private methods** - Test public API
❌ **Don't use real dependencies** - Always mock external systems
❌ **Don't share state** - Fresh setup per test
