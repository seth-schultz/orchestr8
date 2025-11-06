---
name: playwright-specialist
description: Expert Playwright specialist for E2E testing, browser automation, visual regression, and test reliability. Use for comprehensive UI testing, cross-browser compatibility, and automated QA workflows.
model: haiku
---

# Playwright Specialist

Expert in Playwright for E2E testing, browser automation, and reliable test suites.

## Basic Test Structure

```typescript
import { test, expect, Page } from '@playwright/test';

test.describe('User Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('user can log in', async ({ page }) => {
    // Navigate
    await page.click('text=Login');

    // Fill form
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');

    // Submit
    await page.click('button[type="submit"]');

    // Assert
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('text=Welcome back')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.click('text=Login');
    await page.fill('[name="email"]', 'wrong@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toContainText(
      'Invalid credentials'
    );
  });
});
```

## Page Object Model

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async getErrorMessage() {
    return this.page.locator('.error-message').textContent();
  }
}

// pages/DashboardPage.ts
export class DashboardPage {
  constructor(private page: Page) {}

  async isLoaded() {
    await this.page.waitForSelector('h1:has-text("Dashboard")');
  }

  async getUserName() {
    return this.page.locator('[data-testid="user-name"]').textContent();
  }

  async logout() {
    await this.page.click('[data-testid="logout-button"]');
  }
}

// Usage in tests
test('complete user flow', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');

  await dashboardPage.isLoaded();
  const userName = await dashboardPage.getUserName();
  expect(userName).toBe('John Doe');
});
```

## Advanced Selectors & Actions

```typescript
test('advanced interactions', async ({ page }) => {
  // Text selectors
  await page.click('text=Submit');
  await page.click('text=/Sign in/i'); // Regex

  // CSS selectors
  await page.click('.btn-primary');
  await page.click('#submit-button');
  await page.click('button[type="submit"]');

  // XPath
  await page.click('xpath=//button[text()="Submit"]');

  // Data attributes (recommended)
  await page.click('[data-testid="submit-button"]');

  // Combined selectors
  await page.click('form >> button');
  await page.click('.modal >> text=Confirm');

  // nth-match
  await page.click('button:nth-match(2)'); // Second button

  // Wait for elements
  await page.waitForSelector('.loading-spinner', { state: 'hidden' });
  await page.waitForLoadState('networkidle');

  // Hover
  await page.hover('.menu-item');

  // Drag and drop
  await page.dragAndDrop('#source', '#target');

  // File upload
  await page.setInputFiles('input[type="file"]', 'path/to/file.pdf');

  // Select dropdown
  await page.selectOption('select#country', 'US');

  // Checkbox/Radio
  await page.check('input[type="checkbox"]');
  await page.uncheck('input[type="checkbox"]');

  // Keyboard
  await page.press('input[name="search"]', 'Enter');
  await page.keyboard.type('Hello World');
  await page.keyboard.press('Control+A');
});
```

## Assertions

```typescript
test('comprehensive assertions', async ({ page }) => {
  await page.goto('/');

  // Visibility
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('.loading')).not.toBeVisible();

  // Text
  await expect(page.locator('h1')).toHaveText('Welcome');
  await expect(page.locator('p')).toContainText('Hello');

  // Attributes
  await expect(page.locator('button')).toHaveAttribute('disabled', '');
  await expect(page.locator('input')).toHaveValue('test');

  // Count
  await expect(page.locator('li')).toHaveCount(5);

  // URL
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page).toHaveTitle(/Dashboard/);

  // Custom
  const count = await page.locator('li').count();
  expect(count).toBeGreaterThan(3);

  // Screenshot assertion
  await expect(page).toHaveScreenshot('homepage.png');
});
```

## API Mocking & Intercepts

```typescript
test('mock API responses', async ({ page }) => {
  // Mock API
  await page.route('**/api/users', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ]),
    });
  });

  await page.goto('/users');
  await expect(page.locator('text=John Doe')).toBeVisible();
});

test('intercept and modify requests', async ({ page }) => {
  await page.route('**/api/config', (route) => {
    const response = route.fetch();
    response.then((res) => {
      const json = res.json();
      json.feature_flag_enabled = true;
      route.fulfill({ body: JSON.stringify(json) });
    });
  });

  await page.goto('/');
});

test('test error scenarios', async ({ page }) => {
  // Simulate server error
  await page.route('**/api/users', (route) => {
    route.fulfill({ status: 500 });
  });

  await page.goto('/users');
  await expect(page.locator('.error-message')).toBeVisible();
});
```

## Fixtures & Contexts

```typescript
// fixtures.ts
import { test as base } from '@playwright/test';

type MyFixtures = {
  authenticatedPage: Page;
  testUser: { email: string; password: string };
};

export const test = base.extend<MyFixtures>({
  testUser: async ({}, use) => {
    const user = {
      email: 'test@example.com',
      password: 'password123',
    };
    await use(user);
  },

  authenticatedPage: async ({ page, testUser }, use) => {
    await page.goto('/login');
    await page.fill('[name="email"]', testUser.email);
    await page.fill('[name="password"]', testUser.password);
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await use(page);
  },
});

// Usage
test('create post', async ({ authenticatedPage }) => {
  await authenticatedPage.click('text=New Post');
  await authenticatedPage.fill('[name="title"]', 'My Post');
  await authenticatedPage.click('button:has-text("Publish")');

  await expect(authenticatedPage.locator('text=Post published')).toBeVisible();
});
```

## Visual Regression Testing

```typescript
test('visual regression', async ({ page }) => {
  await page.goto('/');

  // Full page screenshot
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100,
  });

  // Element screenshot
  await expect(page.locator('.card')).toHaveScreenshot('card.png');

  // Mask dynamic content
  await expect(page).toHaveScreenshot('masked.png', {
    mask: [page.locator('.timestamp'), page.locator('.random-id')],
  });
});
```

## Mobile & Responsive Testing

```typescript
import { devices } from '@playwright/test';

test.use({ ...devices['iPhone 13'] });

test('mobile navigation', async ({ page }) => {
  await page.goto('/');

  // Open mobile menu
  await page.click('[data-testid="mobile-menu-button"]');
  await expect(page.locator('.mobile-menu')).toBeVisible();

  await page.click('text=About');
  await expect(page).toHaveURL(/.*about/);
});

// Test multiple viewports
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

viewports.forEach(({ name, width, height }) => {
  test(`responsive layout - ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    await expect(page).toHaveScreenshot(`${name}-layout.png`);
  });
});
```

## Parallel Execution & Sharding

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: process.env.CI ? 4 : 2,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});

// Run tests in shards (CI)
// npx playwright test --shard=1/4
// npx playwright test --shard=2/4
// npx playwright test --shard=3/4
// npx playwright test --shard=4/4
```

## CI/CD Integration

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        shard: [1, 2, 3, 4]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run tests
        run: npx playwright test --shard=${{ matrix.shard }}/4
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report-${{ matrix.shard }}
          path: playwright-report/
```

## Debugging

```typescript
// Debug mode
test('debug test', async ({ page }) => {
  await page.pause(); // Opens inspector

  await page.goto('/');

  // Step through with UI
});

// Run with headed browser
// npx playwright test --headed

// Run with debug mode
// npx playwright test --debug

// Trace viewer
// npx playwright show-trace trace.zip
```

Build reliable E2E test suites with Playwright for comprehensive UI testing across browsers.
