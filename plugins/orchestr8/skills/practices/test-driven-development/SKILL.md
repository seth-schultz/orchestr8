---
name: test-driven-development
description: Expertise in Test-Driven Development (TDD) methodology. Activate when implementing new features, fixing bugs, or refactoring code. Guides writing tests first, then implementing code to pass tests, ensuring high quality and comprehensive test coverage.
---

# Test-Driven Development (TDD) Skill

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

## When to Use TDD

**Use TDD for:**
- ✅ Business logic and algorithms
- ✅ Data transformations
- ✅ API endpoints
- ✅ Bug fixes (write test that fails, then fix)
- ✅ Complex state management
- ✅ Security-critical code

**TDD Less Critical for:**
- UI components (test behavior, not rendering)
- Experimental/prototype code
- Simple CRUD with well-tested frameworks
- Scripts run once

## Remember

1. **Red** → **Green** → **Refactor**
2. Write the **smallest** test that fails
3. Write the **minimum** code to pass
4. Refactor **while tests are green**
5. Test **behavior**, not implementation
6. Keep tests **fast** and **independent**

TDD leads to better design, comprehensive tests, and confidence in your code.
