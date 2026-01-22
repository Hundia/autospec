# SPEC: QA Lead

**Version:** 1.0
**Created:** {{DATE}}
**Owner:** QA Team

---

## 1. Testing Philosophy

### Quality Principles

1. **Shift Left** - Test early, test often, catch issues before they compound
2. **Automation First** - Automate repeatable tests, reserve manual for exploratory
3. **Risk-Based** - Focus testing effort on high-risk, high-impact areas
4. **Continuous** - Testing integrated into CI/CD, not a phase after development
5. **Observable** - If you can't measure it, you can't improve it

### Testing Pyramid

```
                    ┌───────────┐
                    │    E2E    │  ~10%
                    │   Tests   │  Slow, Expensive
                   ┌┴───────────┴┐
                   │ Integration │  ~20%
                   │    Tests    │  Medium
                  ┌┴─────────────┴┐
                  │   Component   │  ~20%
                  │    Tests      │
                 ┌┴───────────────┴┐
                 │    Unit Tests    │  ~50%
                 │                  │  Fast, Cheap
                 └──────────────────┘
```

---

## 2. Test Types & Coverage Targets

### Coverage Requirements

| Test Type | Target Coverage | Minimum Threshold |
|-----------|----------------|-------------------|
| Unit Tests | 80% | 70% |
| Integration Tests | Key flows | 100% of critical paths |
| E2E Tests | Critical paths | 100% of user journeys |
| Component Tests | All components | 90% |

### Test Type Definitions

| Type | Scope | Speed | Dependencies |
|------|-------|-------|--------------|
| Unit | Single function/method | <10ms | None (mocked) |
| Component | Single component | <100ms | Minimal |
| Integration | Multiple modules | <1s | Real (testcontainers) |
| E2E | Full system | <30s | Full environment |

---

## 3. Testing Framework Stack

### Backend

| Purpose | Tool | Notes |
|---------|------|-------|
| Test Runner | Vitest | Fast, Vite-native |
| Assertions | Vitest (built-in) | Chai-compatible |
| Mocking | Vitest (vi) | Function/module mocks |
| API Testing | Supertest | HTTP assertions |
| Database | Testcontainers | Isolated test DB |
| Coverage | c8/istanbul | Via Vitest |

### Frontend

| Purpose | Tool | Notes |
|---------|------|-------|
| Test Runner | Vitest | Consistent with backend |
| Component Testing | Testing Library | User-centric testing |
| Rendering | @testing-library/react | DOM testing |
| User Events | @testing-library/user-event | Realistic interactions |
| E2E | Playwright | Cross-browser |
| Visual Regression | Playwright | Screenshot comparison |

---

## 4. Test Structure

### Directory Organization

```
project/
├── api/
│   ├── src/
│   └── tests/
│       ├── unit/           # Unit tests
│       │   ├── services/
│       │   └── utils/
│       ├── integration/    # Integration tests
│       │   ├── routes/
│       │   └── repositories/
│       ├── fixtures/       # Test data
│       ├── mocks/          # Shared mocks
│       └── setup.ts        # Test configuration
├── web/
│   ├── src/
│   └── tests/
│       ├── unit/           # Hook/util tests
│       ├── components/     # Component tests
│       ├── integration/    # Page tests
│       └── setup.ts
└── e2e/
    ├── tests/
    │   ├── auth.spec.ts
    │   ├── {{feature}}.spec.ts
    │   └── smoke.spec.ts
    ├── fixtures/
    └── playwright.config.ts
```

### Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Unit test | `{module}.test.ts` | `user.service.test.ts` |
| Component | `{Component}.test.tsx` | `Button.test.tsx` |
| Integration | `{feature}.spec.ts` | `auth.spec.ts` |
| E2E | `{flow}.e2e.ts` | `checkout.e2e.ts` |

---

## 5. Unit Testing Patterns

### Service Test Pattern

```typescript
// tests/unit/services/user.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '@/services/user.service';
import { UserRepository } from '@/repositories/user.repository';

describe('UserService', () => {
  let service: UserService;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepo = {
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    service = new UserService(mockRepo);
  });

  describe('createUser', () => {
    it('should create user with hashed password', async () => {
      const input = { email: 'test@example.com', password: 'Password123!', name: 'Test' };
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({ id: '1', ...input, passwordHash: 'hashed' });

      const result = await service.createUser(input);

      expect(result).not.toHaveProperty('passwordHash');
      expect(mockRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: input.email,
          passwordHash: expect.any(String),
        })
      );
    });

    it('should throw error if email already exists', async () => {
      mockRepo.findByEmail.mockResolvedValue({ id: '1', email: 'test@example.com' });

      await expect(service.createUser({ email: 'test@example.com', password: 'pass', name: 'Test' }))
        .rejects.toThrow('Email already registered');
    });
  });
});
```

### Utility Test Pattern

```typescript
// tests/unit/utils/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, formatCurrency, truncate } from '@/utils/format';

describe('format utilities', () => {
  describe('formatDate', () => {
    it('formats date in default locale', () => {
      const date = new Date('2026-01-21T10:00:00Z');
      expect(formatDate(date)).toBe('January 21, 2026');
    });

    it('handles invalid dates', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('truncate', () => {
    it('truncates long strings with ellipsis', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('returns original if shorter than limit', () => {
      expect(truncate('Hi', 10)).toBe('Hi');
    });
  });
});
```

---

## 6. Component Testing Patterns

### React Component Test

```tsx
// tests/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when isDisabled prop is true', () => {
    render(<Button isDisabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows loading spinner when isLoading', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant styles', () => {
    render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn-primary');
  });
});
```

### Form Component Test

```tsx
// tests/components/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/forms/LoginForm';

describe('LoginForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('submits with valid data', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123!',
      });
    });
  });

  it('shows validation errors for invalid email', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'invalid');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for empty password', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={mockOnSubmit} />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });
});
```

---

## 7. Integration Testing Patterns

### API Route Integration Test

```typescript
// tests/integration/routes/auth.spec.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { setupTestDatabase, teardownTestDatabase } from '../setup';

describe('Auth Routes', () => {
  beforeAll(async () => {
    await setupTestDatabase();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  describe('POST /api/v1/auth/register', () => {
    it('creates new user and returns token', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'Password123!',
          name: 'New User',
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe('newuser@example.com');
      expect(response.body.data.user).not.toHaveProperty('passwordHash');
    });

    it('returns 409 for duplicate email', async () => {
      // First registration
      await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'duplicate@example.com', password: 'Pass123!', name: 'User 1' });

      // Second registration with same email
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'duplicate@example.com', password: 'Pass123!', name: 'User 2' });

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('CONFLICT');
    });

    it('returns 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'invalid', password: '123', name: '' });

      expect(response.status).toBe(400);
      expect(response.body.error.details).toHaveLength(3);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeAll(async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'login@example.com', password: 'Password123!', name: 'Login User' });
    });

    it('returns token for valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@example.com', password: 'Password123!' });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('token');
    });

    it('returns 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@example.com', password: 'WrongPassword!' });

      expect(response.status).toBe(401);
    });
  });
});
```

### Database Integration Test

```typescript
// tests/integration/repositories/task.repository.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { TaskRepository } from '@/repositories/task.repository';
import { db } from '@/config/database';

describe('TaskRepository', () => {
  let repository: TaskRepository;
  let testUserId: string;

  beforeEach(async () => {
    // Clean database and create test user
    await db.query('DELETE FROM tasks');
    const userResult = await db.query(
      `INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id`,
      ['test@example.com', 'hash', 'Test']
    );
    testUserId = userResult.rows[0].id;
    repository = new TaskRepository(db);
  });

  describe('create', () => {
    it('creates task with all fields', async () => {
      const task = await repository.create({
        userId: testUserId,
        title: 'Test Task',
        description: 'Description',
        status: 'pending',
      });

      expect(task).toMatchObject({
        userId: testUserId,
        title: 'Test Task',
        status: 'pending',
      });
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('findByUserId', () => {
    it('returns only user tasks', async () => {
      await repository.create({ userId: testUserId, title: 'Task 1', status: 'pending' });
      await repository.create({ userId: testUserId, title: 'Task 2', status: 'pending' });

      const tasks = await repository.findByUserId(testUserId);

      expect(tasks).toHaveLength(2);
    });

    it('excludes soft-deleted tasks', async () => {
      const task = await repository.create({ userId: testUserId, title: 'Task', status: 'pending' });
      await repository.softDelete(task.id);

      const tasks = await repository.findByUserId(testUserId);

      expect(tasks).toHaveLength(0);
    });
  });
});
```

---

## 8. E2E Testing Patterns

### Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Pattern

```typescript
// e2e/tests/auth.e2e.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('user can register and login', async ({ page }) => {
    const email = `test-${Date.now()}@example.com`;

    // Register
    await page.goto('/register');
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', 'Password123!');
    await page.fill('[name="name"]', 'Test User');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome, Test User')).toBeVisible();

    // Logout
    await page.click('[data-testid="logout-button"]');
    await expect(page).toHaveURL('/');

    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
  });

  test('shows validation errors for invalid input', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'invalid');
    await page.click('button[type="submit"]');

    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });
});
```

### E2E Fixtures

```typescript
// e2e/fixtures/auth.ts
import { test as base } from '@playwright/test';

interface AuthFixtures {
  authenticatedPage: Page;
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Login before test
    await page.goto('/login');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    await use(page);
  },
});

// Usage in tests
test('authenticated user can create task', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/tasks/new');
  // ...
});
```

---

## 9. Test Data Management

### Fixtures

```typescript
// tests/fixtures/users.ts
export const testUsers = {
  admin: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
  },
  user: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'user@example.com',
    name: 'Test User',
    role: 'user',
  },
};

// tests/fixtures/tasks.ts
export const testTasks = {
  pending: {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    title: 'Pending Task',
    status: 'pending',
    userId: testUsers.user.id,
  },
  completed: {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    title: 'Completed Task',
    status: 'completed',
    userId: testUsers.user.id,
  },
};
```

### Factory Pattern

```typescript
// tests/factories/user.factory.ts
import { faker } from '@faker-js/faker';
import { User } from '@/types';

export const createUser = (overrides?: Partial<User>): User => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  name: faker.person.fullName(),
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createUsers = (count: number, overrides?: Partial<User>): User[] =>
  Array.from({ length: count }, () => createUser(overrides));
```

---

## 10. Mocking Strategies

### API Mocks (MSW)

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw';
import { testUsers, testTasks } from '../fixtures';

export const handlers = [
  rest.get('/api/v1/users/me', (req, res, ctx) => {
    return res(ctx.json({ data: testUsers.user }));
  }),

  rest.get('/api/v1/tasks', (req, res, ctx) => {
    return res(ctx.json({ data: Object.values(testTasks) }));
  }),

  rest.post('/api/v1/tasks', async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.status(201), ctx.json({
      data: { id: 'new-id', ...body, createdAt: new Date() }
    }));
  }),
];

// tests/setup.ts
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Module Mocks

```typescript
// Mock entire module
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

// Mock specific function
vi.mock('@/utils/hash', () => ({
  hashPassword: vi.fn().mockResolvedValue('hashed'),
  verifyPassword: vi.fn().mockResolvedValue(true),
}));
```

---

## 11. CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npm run test:integration

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 12. Quality Gates

### Pre-commit Checks

```json
// package.json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test"
  }
}
```

### Coverage Thresholds

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
  },
});
```

### PR Quality Requirements

| Check | Requirement |
|-------|-------------|
| Unit tests | All pass |
| Integration tests | All pass |
| E2E tests | All pass |
| Coverage | >= 70% |
| Lint | No errors |
| Type check | No errors |

---

## 13. Bug Tracking & Reporting

### Bug Template

```markdown
## Bug Report

**Severity:** Critical / High / Medium / Low
**Sprint:** {{SPRINT_NUMBER}}
**Environment:** Development / Staging / Production

### Description
[Clear description of the bug]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshots/Logs
[If applicable]

### Possible Fix
[If you have suggestions]
```

### Severity Definitions

| Severity | Definition | Response Time |
|----------|------------|---------------|
| Critical | System down, data loss | Immediate |
| High | Feature broken, no workaround | Same day |
| Medium | Feature impaired, workaround exists | This sprint |
| Low | Minor issue, cosmetic | Backlog |

---

*This spec is maintained by the QA team. Last updated: {{DATE}}*
