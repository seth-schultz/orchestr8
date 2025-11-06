---
name: test-driven-development
description: Expertise in Test-Driven Development (TDD) methodology. Activate when implementing new features, fixing bugs, or refactoring code. Guides writing tests first, then implementing code to pass tests, ensuring high quality and comprehensive test coverage.
---

# Test-Driven Development (TDD) Skill

Expert knowledge of Test-Driven Development methodology, covering red-green-refactor cycles, test-first development, behavior-driven testing, and comprehensive test coverage strategies.

## When to Use This Skill

**Use test-driven-development for:**
- ✅ Implementing new features with test-first approach
- ✅ Fixing bugs with regression test creation
- ✅ Refactoring code while maintaining test coverage
- ✅ Building business logic and complex algorithms
- ✅ Creating API endpoints with contract testing
- ✅ Security-critical code requiring validation

**Less critical for:**
- ❌ Experimental or throwaway prototype code
- ❌ Simple UI components with visual testing only
- ❌ Well-tested CRUD operations using established frameworks
- ❌ One-time scripts or utilities

## TDD Cycle: Red-Green-Refactor

### 1. RED: Write a Failing Test
Write the smallest test that fails for the feature you want to implement.

```typescript
// users.test.ts
describe('createUser', () => {
  it('should create a user with email and name', async () => {
    const user = await createUser({
      email: 'test@example.com',
      name: 'Test User'
    });

    expect(user).toMatchObject({
      email: 'test@example.com',
      name: 'Test User'
    });
    expect(user.id).toBeDefined();
  });
});

// Run test: ❌ FAIL - createUser is not defined
```

### 2. GREEN: Write Minimum Code to Pass
Implement just enough code to make the test pass.

```typescript
// users.ts
interface User {
  id: number;
  email: string;
  name: string;
}

let nextId = 1;
const users: User[] = [];

export async function createUser(data: { email: string; name: string }): Promise<User> {
  const user = {
    id: nextId++,
    email: data.email,
    name: data.name
  };
  users.push(user);
  return user;
}

// Run test: ✅ PASS
```

### 3. REFACTOR: Improve Code Quality
Refactor while keeping tests green.

```typescript
// users.ts - Refactored
export class UserService {
  private users = new Map<number, User>();
  private nextId = 1;

  async createUser(data: CreateUserDTO): Promise<User> {
    const user: User = {
      id: this.nextId++,
      ...data,
      createdAt: new Date()
    };

    this.users.set(user.id, user);
    return user;
  }
}

// Run tests: ✅ PASS (all tests still pass after refactor)
```

## TDD Best Practices

### Start with the Simplest Test
```typescript
// Start simple
it('should return empty array when no users exist', () => {
  const users = getUsers();
  expect(users).toEqual([]);
});

// Then add complexity
it('should return all users when users exist', () => {
  createUser({ email: 'test@example.com', name: 'Test' });
  const users = getUsers();
  expect(users).toHaveLength(1);
});
```

### One Test, One Assertion (Mostly)
```typescript
// ❌ Bad: Multiple concerns in one test
it('should create and retrieve user', async () => {
  const created = await createUser(userData);
  expect(created.id).toBeDefined();

  const retrieved = await getUser(created.id);
  expect(retrieved).toEqual(created);
});

// ✅ Good: Separate concerns
it('should create user with generated ID', async () => {
  const user = await createUser(userData);
  expect(user.id).toBeDefined();
});

it('should retrieve created user by ID', async () => {
  const created = await createUser(userData);
  const retrieved = await getUser(created.id);
  expect(retrieved).toEqual(created);
});
```

### Test Behavior, Not Implementation
```typescript
// ❌ Bad: Tests internal implementation
it('should call database.insert', async () => {
  const spy = jest.spyOn(database, 'insert');
  await createUser(userData);
  expect(spy).toHaveBeenCalled();
});

// ✅ Good: Tests observable behavior
it('should persist user and return with ID', async () => {
  const user = await createUser(userData);
  expect(user.id).toBeDefined();

  const retrieved = await getUser(user.id);
  expect(retrieved).toMatchObject(userData);
});
```

## TDD Workflow for Different Scenarios

### New Feature
```
1. Write acceptance test (E2E) - RED
2. Write unit test for first component - RED
3. Implement component - GREEN
4. Refactor - GREEN
5. Repeat steps 2-4 for each component
6. Run acceptance test - GREEN
```

### Bug Fix
```
1. Write test that reproduces bug - RED
2. Fix the bug - GREEN
3. Verify test passes - GREEN
4. Add edge case tests - RED/GREEN
5. Refactor if needed - GREEN
```

### Refactoring
```
1. Ensure tests exist and pass - GREEN
2. Refactor code
3. Run tests frequently
4. Keep tests GREEN throughout
5. Add tests for new edge cases discovered
```

## Common Patterns

### Testing Edge Cases
```typescript
describe('calculateDiscount', () => {
  it('should apply standard discount for valid amount', () => {
    expect(calculateDiscount(100)).toBe(90);
  });

  it('should handle zero amount', () => {
    expect(calculateDiscount(0)).toBe(0);
  });

  it('should handle very large amounts', () => {
    expect(calculateDiscount(1000000)).toBe(900000);
  });

  it('should throw error for negative amounts', () => {
    expect(() => calculateDiscount(-10)).toThrow('Invalid amount');
  });

  it('should handle decimal amounts', () => {
    expect(calculateDiscount(99.99)).toBeCloseTo(89.99);
  });
});
```

### Testing Async Code
```typescript
it('should fetch user from API', async () => {
  const user = await fetchUser(1);
  expect(user.id).toBe(1);
});

it('should handle API errors', async () => {
  await expect(fetchUser(999)).rejects.toThrow('User not found');
});

it('should timeout after 5 seconds', async () => {
  await expect(fetchUser(1, { timeout: 5000 })).rejects.toThrow('Timeout');
}, 10000); // Test timeout longer than operation timeout
```

## Multi-Language TDD Examples

### Python TDD with pytest

```python
# test_calculator.py
import pytest
from calculator import Calculator

def test_add_two_numbers():
    calc = Calculator()
    result = calc.add(2, 3)
    assert result == 5

def test_divide_by_zero_raises_error():
    calc = Calculator()
    with pytest.raises(ZeroDivisionError):
        calc.divide(10, 0)

# calculator.py
class Calculator:
    def add(self, a, b):
        return a + b

    def divide(self, a, b):
        if b == 0:
            raise ZeroDivisionError("Cannot divide by zero")
        return a / b
```

### Java TDD with JUnit 5

```java
// CalculatorTest.java
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CalculatorTest {
    @Test
    void shouldAddTwoNumbers() {
        Calculator calc = new Calculator();
        int result = calc.add(2, 3);
        assertEquals(5, result);
    }

    @Test
    void shouldThrowExceptionWhenDividingByZero() {
        Calculator calc = new Calculator();
        assertThrows(ArithmeticException.class, () -> {
            calc.divide(10, 0);
        });
    }
}

// Calculator.java
public class Calculator {
    public int add(int a, int b) {
        return a + b;
    }

    public int divide(int a, int b) {
        if (b == 0) {
            throw new ArithmeticException("Cannot divide by zero");
        }
        return a / b;
    }
}
```

### Go TDD with testing package

```go
// calculator_test.go
package calculator

import "testing"

func TestAdd(t *testing.T) {
    calc := New()
    result := calc.Add(2, 3)
    if result != 5 {
        t.Errorf("Add(2, 3) = %d; want 5", result)
    }
}

func TestDivideByZero(t *testing.T) {
    calc := New()
    _, err := calc.Divide(10, 0)
    if err == nil {
        t.Error("Divide(10, 0) should return error")
    }
}

// calculator.go
package calculator

import "errors"

type Calculator struct{}

func New() *Calculator {
    return &Calculator{}
}

func (c *Calculator) Add(a, b int) int {
    return a + b
}

func (c *Calculator) Divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("cannot divide by zero")
    }
    return a / b, nil
}
```

## Mocking and Test Doubles

### Dependency Injection for Testability

```typescript
// Bad: Hard to test (direct dependency)
class UserService {
  async getUser(id: number) {
    const db = new Database();  // ❌ Hard-coded dependency
    return db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// Good: Easy to test (injected dependency)
class UserService {
  constructor(private db: Database) {}  // ✅ Injected

  async getUser(id: number) {
    return this.db.query('SELECT * FROM users WHERE id = ?', [id]);
  }
}

// Test with mock
it('should fetch user from database', async () => {
  const mockDb = {
    query: jest.fn().mockResolvedValue({ id: 1, name: 'Test' })
  };

  const service = new UserService(mockDb as any);
  const user = await service.getUser(1);

  expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM users WHERE id = ?', [1]);
  expect(user).toEqual({ id: 1, name: 'Test' });
});
```

### Test Doubles: Mocks, Stubs, Spies

```typescript
// Stub: Returns predetermined values
const stub = {
  getUser: () => ({ id: 1, name: 'Stub User' })
};

// Mock: Verifies interactions
const mock = {
  getUser: jest.fn().mockReturnValue({ id: 1, name: 'Mock User' })
};
// expect(mock.getUser).toHaveBeenCalledWith(1);

// Spy: Wraps real object, tracks calls
const spy = jest.spyOn(service, 'getUser');
await service.getUser(1);
expect(spy).toHaveBeenCalledWith(1);
```

## TDD Anti-Patterns

### ❌ Anti-Pattern 1: Testing Implementation Details

```typescript
// Bad: Brittle test coupled to implementation
it('should call setName and setEmail', () => {
  const user = new User();
  const setNameSpy = jest.spyOn(user, 'setName');
  const setEmailSpy = jest.spyOn(user, 'setEmail');

  user.update({ name: 'John', email: 'john@example.com' });

  expect(setNameSpy).toHaveBeenCalled();  // ❌ Testing HOW
  expect(setEmailSpy).toHaveBeenCalled();
});

// Good: Test observable behavior
it('should update user name and email', () => {
  const user = new User();
  user.update({ name: 'John', email: 'john@example.com' });

  expect(user.name).toBe('John');  // ✅ Testing WHAT
  expect(user.email).toBe('john@example.com');
});
```

### ❌ Anti-Pattern 2: Over-Mocking

```typescript
// Bad: Mocking everything, not testing real integration
it('should create order', async () => {
  const mockValidator = { validate: jest.fn().mockReturnValue(true) };
  const mockInventory = { checkStock: jest.fn().mockReturnValue(true) };
  const mockPayment = { charge: jest.fn().mockResolvedValue({ id: '123' }) };
  const mockDb = { save: jest.fn().mockResolvedValue({ id: 1 }) };
  // ... testing nothing real
});

// Good: Integration test with real dependencies (or fewer mocks)
it('should create order with real validation and inventory check', async () => {
  const validator = new OrderValidator();
  const inventory = new InventoryService(testDb);
  const mockPayment = { charge: jest.fn().mockResolvedValue({ id: '123' }) };

  const service = new OrderService(validator, inventory, mockPayment);
  const order = await service.createOrder(validOrderData);

  expect(order.status).toBe('confirmed');
});
```

### ❌ Anti-Pattern 3: Slow Tests

```typescript
// Bad: Tests take too long to run
it('should process order', async () => {
  await sleep(5000);  // ❌ Artificial delays
  await realDatabaseCall();  // ❌ Slow I/O in unit tests
  // ... more slow operations
});

// Good: Fast, focused unit tests
it('should process order', async () => {
  const mockDb = createMockDb();
  const result = await orderService.process(order);
  expect(result.status).toBe('processed');
});
// Run slow integration tests separately
```

### ❌ Anti-Pattern 4: Write Tests After Code

```typescript
// ❌ Anti-pattern: Write code first, tests later
// Result: Tests conform to existing code, miss edge cases

// ✅ Correct: TDD Cycle
// 1. Write failing test (RED)
// 2. Write minimal code to pass (GREEN)
// 3. Refactor (keep GREEN)
```

## Remember

1. **Red** → **Green** → **Refactor**
2. Write the **smallest** test that fails
3. Write the **minimum** code to pass
4. Refactor **while tests are green**
5. Test **behavior**, not implementation
6. Keep tests **fast** and **independent**

TDD leads to better design, comprehensive tests, and confidence in your code.
