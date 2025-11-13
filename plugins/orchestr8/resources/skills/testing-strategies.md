---
id: testing-strategies
category: skill
tags: [testing, test-strategy, test-pyramid, tdd, quality, best-practices]
capabilities:
  - Testing pyramid strategy and philosophy
  - Test-Driven Development (TDD) workflow
  - Testing best practices and principles
  - Test data management strategies
  - Flaky test prevention techniques
useWhen:
  - Designing overall testing strategy for project choosing right balance of unit, integration, and E2E tests
  - Implementing testing pyramid with 70% unit tests, 20% integration tests, 10% E2E tests for cost-effective coverage
  - Practicing Test-Driven Development (TDD) with Red-Green-Refactor cycle writing tests before implementation
  - Establishing test coverage thresholds (80%+ lines, branches, functions) with CI/CD integration
  - Creating testing philosophy and standards for development team ensuring consistent quality practices
  - Preventing flaky tests with deterministic test data, proper timing strategies, and isolation techniques
estimatedTokens: 280
---

# Testing Strategies and Best Practices

## Testing Pyramid Philosophy

The testing pyramid guides test distribution for optimal coverage and speed:

```
        /\
       /E2E\        10% - End-to-end tests (slow, expensive)
      /------\
     /  INT   \     20% - Integration tests (medium)
    /----------\
   /    UNIT    \   70% - Unit tests (fast, cheap)
  /--------------\
```

**Why this distribution:**
- **Unit tests (70%)**: Fast feedback, isolate bugs, easy to maintain
- **Integration tests (20%)**: Verify component interactions, catch integration bugs
- **E2E tests (10%)**: Validate critical user journeys, expensive to run

## Testing Levels

### Unit Testing
**Focus:** Individual functions, classes, components in isolation

**See:** orchestr8://skills/testing-unit

**Key principles:** Test behavior not implementation, mock all dependencies, fast execution (<1ms per test)

### Integration Testing
**Focus:** Multiple components working together (API + database, service interactions)

**See:**
- orchestr8://skills/testing-integration - Basic integration patterns
- orchestr8://skills/testing-integration-patterns - Advanced patterns with test containers

**Key principles:** Use real dependencies (databases, queues), test boundaries between systems, proper cleanup

### End-to-End Testing
**Focus:** Complete user workflows through the full application stack

**See:** orchestr8://skills/testing-e2e-best-practices

**Key principles:** Test critical paths only, stable selectors, retry logic for flakiness

## Test-Driven Development (TDD)

### Red-Green-Refactor Cycle

```typescript
// 1. RED: Write failing test
describe('calculateDiscount', () => {
  it('should apply 10% discount for orders over $100', () => {
    expect(calculateDiscount(150)).toBe(135);
  });
});

// 2. GREEN: Write minimal code to pass
function calculateDiscount(amount: number): number {
  if (amount > 100) {
    return amount * 0.9;
  }
  return amount;
}

// 3. REFACTOR: Improve while keeping tests green
function calculateDiscount(amount: number): number {
  const DISCOUNT_THRESHOLD = 100;
  const DISCOUNT_RATE = 0.1;

  return amount > DISCOUNT_THRESHOLD
    ? amount * (1 - DISCOUNT_RATE)
    : amount;
}
```

**TDD Benefits:**
- Tests guide design (better APIs)
- Built-in regression suite
- Higher confidence in refactoring
- Living documentation

## Test Data Management

### Factory Pattern

```typescript
class UserFactory {
  static create(overrides?: Partial<User>): User {
    return {
      id: uuid(),
      email: `test-${uuid()}@example.com`, // Unique per test
      name: 'Test User',
      createdAt: new Date(),
      ...overrides
    };
  }
}

// Usage
const admin = UserFactory.create({ role: 'admin' });
const user = UserFactory.create({ email: 'specific@example.com' });
```

### Fixture Pattern

```typescript
// For consistent reference data
const fixtures = {
  users: {
    admin: { email: 'admin@example.com', role: 'admin' },
    regular: { email: 'user@example.com', role: 'user' }
  },
  products: {
    book: { name: 'Test Book', price: 29.99 },
    course: { name: 'Test Course', price: 99.99 }
  }
};
```

## Flaky Test Prevention

### Deterministic Values

```typescript
// ❌ BAD: Random or time-dependent values
it('should process value', () => {
  const value = Math.random(); // Different every run
  expect(process(value)).toBe(/* ??? */);
});

it('should expire after 1 second', async () => {
  const token = createToken();
  await sleep(1000); // Real time dependency
  expect(isExpired(token)).toBe(true);
});

// ✅ GOOD: Deterministic values
it('should process specific values', () => {
  expect(process(0.5)).toBe(1.0);
  expect(process(0.75)).toBe(1.5);
});

it('should expire after 1 second', () => {
  jest.useFakeTimers();
  const token = createToken();
  jest.advanceTimersByTime(1000); // Mocked time
  expect(isExpired(token)).toBe(true);
  jest.useRealTimers();
});
```

### Test Isolation

Each test must be completely independent:

```typescript
// ✅ Fresh state per test
beforeEach(() => {
  // Reset state before each test
  database.clear();
  mockService.reset();
});

// ❌ Shared state causes flakiness
let sharedUser; // Don't do this!

it('test 1', () => {
  sharedUser = createUser(); // Side effect
});

it('test 2', () => {
  // Depends on test 1 running first - fragile!
  expect(sharedUser).toBeDefined();
});
```

## Test Coverage Guidelines

```bash
# Run with coverage
npm test -- --coverage

# Coverage thresholds in jest.config.js
{
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

**Coverage best practices:**
- Focus on branch coverage (not just line coverage)
- 100% coverage doesn't mean bug-free
- Critical paths require higher coverage
- Test edge cases and error paths

## Testing Best Practices

### Universal Principles

✅ **Write tests first** - TDD leads to better design
✅ **Test behavior, not implementation** - Tests should survive refactoring
✅ **Descriptive test names** - Test name explains scenario and expected outcome
✅ **Fast tests** - Slow tests discourage running them
✅ **Independent tests** - Tests can run in any order
✅ **One assertion per test** - Clear failure messages (when possible)
✅ **Fix flaky tests immediately** - Flakiness erodes confidence

❌ **Don't test framework code** - Trust your dependencies
❌ **Don't test private methods** - Test public API only
❌ **Don't share state** - Fresh setup per test
❌ **Don't use fixed delays** - Wait for conditions, not arbitrary timeouts

## Related Skills

- **orchestr8://skills/testing-unit** - Unit testing patterns and test doubles
- **orchestr8://skills/testing-integration** - Integration test setup and API testing
- **orchestr8://skills/testing-integration-patterns** - Advanced integration patterns with test containers
- **orchestr8://skills/testing-e2e-best-practices** - E2E testing with Playwright, page objects, flaky test prevention
