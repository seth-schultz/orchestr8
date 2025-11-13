---
id: testing-e2e-best-practices
category: skill
tags: [testing, e2e, playwright, cypress, ui-testing, flaky-tests, page-objects]
capabilities:
  - Page Object Pattern for maintainable E2E tests
  - Flaky test prevention (wait strategies, stable selectors)
  - Test data isolation with fixtures
  - Multi-step user journey testing
  - Visual regression testing
estimatedTokens: 470
useWhen:
  - Implementing E2E tests with Playwright or Cypress automating critical user journeys through full application stack
  - Building Page Object Pattern organizing selectors and actions for maintainable E2E test suites
  - Creating stable E2E tests with explicit waits, retry logic, and resilient selectors preventing test flakiness
  - Testing authenticated user workflows with fixture-based test data ensuring proper isolation between tests
  - Implementing visual regression testing with screenshot comparisons catching UI regressions
  - Designing E2E test execution pipeline with parallel workers, retries, and comprehensive failure reporting
---

# E2E Testing Best Practices

> **Parent skill:** orchestr8://skills/testing-strategies (Testing pyramid, flaky test prevention)
>
> **Related skills:**
> - orchestr8://skills/testing-integration - API and component integration testing
> - orchestr8://skills/testing-unit - Component unit testing

## Page Object Pattern

### Organize Selectors and Actions

```typescript
// pages/loginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  // Selectors as methods
  private emailInput = () => this.page.getByLabel('Email');
  private passwordInput = () => this.page.getByLabel('Password');
  private submitButton = () => this.page.getByRole('button', { name: 'Sign In' });
  private errorMessage = () => this.page.getByRole('alert');

  // Actions
  async login(email: string, password: string) {
    await this.emailInput().fill(email);
    await this.passwordInput().fill(password);
    await this.submitButton().click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage()).toContainText(message);
  }

  async expectSuccess() {
    await expect(this.page).toHaveURL('/dashboard');
  }
}

// tests/login.spec.ts
test('should login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('/login');

  await loginPage.login('test@example.com', 'password123');
  await loginPage.expectSuccess();
});
```

### Component Objects

```typescript
// components/navigation.ts
export class Navigation {
  constructor(private page: Page) {}

  private profileMenu = () => this.page.getByTestId('profile-menu');
  private logoutButton = () => this.page.getByRole('button', { name: 'Logout' });

  async openProfileMenu() {
    await this.profileMenu().click();
  }

  async logout() {
    await this.openProfileMenu();
    await this.logoutButton().click();
  }

  async expectUserName(name: string) {
    await expect(this.profileMenu()).toContainText(name);
  }
}
```

## Flaky Test Prevention

### Wait Strategies

```typescript
// ❌ Bad: Fixed delays
await page.click('#submit');
await page.waitForTimeout(2000); // Brittle and slow

// ✅ Good: Wait for specific conditions
await page.click('#submit');
await page.waitForSelector('.success-message');

// ✅ Better: Use built-in auto-waiting
await page.click('#submit');
await expect(page.locator('.success-message')).toBeVisible();

// ✅ Wait for network idle
await page.goto('/dashboard', { waitUntil: 'networkidle' });

// ✅ Wait for specific API response
await Promise.all([
  page.waitForResponse(resp => resp.url().includes('/api/users')),
  page.click('#load-users'),
]);
```

### Stable Selectors

```typescript
// ❌ Bad: Brittle selectors
await page.click('div > button:nth-child(2)');
await page.fill('input[type="text"]');

// ✅ Good: Semantic selectors
await page.click('button[name="submit"]');
await page.getByRole('button', { name: 'Submit' });
await page.getByLabel('Email');

// ✅ Best: Test IDs for complex components
await page.click('[data-testid="submit-order-button"]');

// ✅ Accessible selectors (preferred)
await page.getByRole('navigation');
await page.getByRole('button', { name: /submit/i });
await page.getByPlaceholder('Search...');
```

### Retry Logic

```typescript
// Playwright auto-retries, but sometimes you need custom logic
async function fillWithRetry(page: Page, selector: string, value: string) {
  await expect(async () => {
    await page.fill(selector, value);
    await expect(page.locator(selector)).toHaveValue(value);
  }).toPass({ timeout: 5000 });
}

// Handle intermittent network issues
test('should handle flaky API', async ({ page }) => {
  await page.route('**/api/users', async route => {
    // Simulate occasional failures
    if (Math.random() < 0.3) {
      await route.abort('failed');
    } else {
      await route.continue();
    }
  });

  await page.goto('/users');

  // Retry on failure
  await test.step('load users with retry', async () => {
    await expect(page.locator('.user-list')).toBeVisible({ timeout: 10000 });
  });
});
```

## Test Data Isolation

### Database Seeding per Test

```typescript
import { test as base } from '@playwright/test';

type TestFixtures = {
  authenticatedPage: Page;
  testUser: User;
};

export const test = base.extend<TestFixtures>({
  testUser: async ({}, use) => {
    // Create unique user for this test
    const user = await createTestUser({
      email: `test-${Date.now()}@example.com`,
    });

    await use(user);

    // Cleanup
    await deleteTestUser(user.id);
  },

  authenticatedPage: async ({ page, testUser }, use) => {
    // Login with test user
    await page.goto('/login');
    await page.fill('[name="email"]', testUser.email);
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await use(page);
  },
});

// Usage
test('should display user profile', async ({ authenticatedPage, testUser }) => {
  await authenticatedPage.goto('/profile');
  await expect(authenticatedPage.locator('h1')).toContainText(testUser.name);
});
```

### API Mocking for Consistency

```typescript
test.beforeEach(async ({ page }) => {
  // Mock external APIs for consistency
  await page.route('**/api/weather', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        temperature: 72,
        condition: 'sunny',
      }),
    });
  });
});

test('should display weather widget', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.locator('.weather')).toContainText('72°');
  await expect(page.locator('.weather')).toContainText('sunny');
});
```

## Workflow Testing

### Multi-Step User Journeys

```typescript
test('complete checkout flow', async ({ page }) => {
  await test.step('Add items to cart', async () => {
    await page.goto('/products');
    await page.click('[data-testid="add-to-cart-1"]');
    await page.click('[data-testid="add-to-cart-2"]');
    await expect(page.locator('.cart-count')).toHaveText('2');
  });

  await test.step('View cart', async () => {
    await page.click('[data-testid="cart-icon"]');
    await expect(page.locator('.cart-item')).toHaveCount(2);
  });

  await test.step('Enter shipping info', async () => {
    await page.click('button:has-text("Checkout")');
    await page.fill('[name="address"]', '123 Main St');
    await page.fill('[name="city"]', 'Boston');
    await page.fill('[name="zip"]', '02101');
    await page.click('button:has-text("Continue")');
  });

  await test.step('Complete payment', async () => {
    await page.fill('[name="cardNumber"]', '4242424242424242');
    await page.fill('[name="expiry"]', '12/25');
    await page.fill('[name="cvv"]', '123');
    await page.click('button:has-text("Place Order")');
  });

  await test.step('Verify confirmation', async () => {
    await expect(page).toHaveURL(/\/order\/\d+/);
    await expect(page.locator('h1')).toContainText('Order Confirmed');
  });
});
```

## Performance and Timing

### Parallel Test Execution

```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 4 : undefined,
  fullyParallel: true, // Run tests in parallel
});

// Mark tests that can't run in parallel
test.describe.serial('sequential tests', () => {
  test('step 1', async ({ page }) => {
    // Must run before step 2
  });

  test('step 2', async ({ page }) => {
    // Depends on step 1
  });
});
```

### Timeouts and Slowness

```typescript
// Set timeout for slow operations
test('slow operation', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds

  await page.goto('/large-dataset');
  await expect(page.locator('.data-grid')).toBeVisible({ timeout: 30000 });
});

// Mark slow tests
test('data export', async ({ page }) => {
  test.slow(); // 3x timeout multiplier

  await page.click('button:has-text("Export")');
  await page.waitForDownload({ timeout: 60000 });
});
```

## Visual Regression Testing

```typescript
test('homepage visual regression', async ({ page }) => {
  await page.goto('/');

  // Full page screenshot
  await expect(page).toHaveScreenshot('homepage.png', {
    fullPage: true,
  });

  // Component screenshot
  await expect(page.locator('.hero-section')).toHaveScreenshot('hero.png');

  // Threshold for acceptable differences
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100,
  });
});
```

## Key Principles

✅ **Test user workflows** - Full end-to-end scenarios
✅ **Use page objects** - Organize selectors and actions
✅ **Wait for conditions** - Never use fixed delays
✅ **Isolate test data** - Fresh data per test
✅ **Use semantic selectors** - Roles, labels, test IDs
✅ **Run in parallel** - Speed up execution
✅ **Mock external services** - Reduce flakiness

❌ **Don't use brittle selectors** - CSS nth-child, generic classes
❌ **Don't use fixed waits** - waitForTimeout is a code smell
❌ **Don't share test state** - Tests should be independent
❌ **Don't test implementation** - Test user-visible behavior
