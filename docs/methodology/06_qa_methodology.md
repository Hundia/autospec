# QA Methodology: Testing & Quality Gates

**Version:** 1.0
**Last Updated:** 2026-01-21

---

## The QA Philosophy

> "Quality is not an act, it is a habit." - Aristotle

In SDD, quality is built-in, not bolted-on. The 🧪 QA Review status ensures nothing ships without verification.

### Core Principles

1. **Test Early** - Write tests alongside code, not after
2. **Test What Matters** - Focus on behavior, not implementation
3. **Automate Everything** - Manual testing doesn't scale
4. **QA is a Gate** - No ticket passes without verification

---

## The Test Pyramid

```
                    ┌───────────┐
                   /│    E2E    │\          10%
                  / │  (Slow)   │ \         User flows
                 /  └───────────┘  \
                /                   \
               /   ┌─────────────┐   \      30%
              /    │ Integration │    \     API & DB
             /     │  (Medium)   │     \
            /      └─────────────┘      \
           /                             \
          /       ┌───────────────┐       \  60%
         /        │     Unit      │        \ Functions
        /         │   (Fast)      │         \& Services
       ───────────┴───────────────┴───────────
```

### Test Levels

| Level | Percentage | Speed | What It Tests | Tools |
|-------|------------|-------|---------------|-------|
| Unit | 60% | Fast (ms) | Functions, services, utilities | Jest, Vitest |
| Integration | 30% | Medium (s) | API endpoints, DB queries, services together | Supertest, TestContainers |
| E2E | 10% | Slow (min) | Full user flows | Playwright, Cypress |

---

## Coverage Targets

### By Area

| Area | Target | Rationale |
|------|--------|-----------|
| Critical paths (auth, payments) | 90%+ | Failures are catastrophic |
| Business logic | 80%+ | Core value, must work |
| API endpoints | 80%+ | Contract must be reliable |
| UI components | 60%+ | Behavior over pixels |
| Utilities | 70%+ | Used everywhere |
| Config/setup | 40%+ | Usually trivial |

### Enforcement

| Coverage | Action |
|----------|--------|
| Below 50% | CI fails, merge blocked |
| 50-70% | Warning, review required |
| 70%+ | Pass |
| 80%+ | Great job |

---

## Test File Conventions

### Location

Tests live adjacent to source code:

```
src/
├── services/
│   ├── user.service.ts
│   └── __tests__/
│       └── user.service.test.ts
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx
└── utils/
    ├── format.ts
    └── format.test.ts
```

### Naming

```
[module-name].test.ts     # Unit tests
[module-name].spec.ts     # Integration/E2E tests
```

### Structure

```typescript
describe('[Module Name]', () => {
  describe('[Function/Method]', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      const input = 'test';

      // Act
      const result = functionUnderTest(input);

      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

---

## Unit Testing Patterns

### Service Tests

```typescript
// user.service.test.ts
import { UserService } from '../user.service';
import { mockUserRepository } from './__mocks__/user.repository';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      const userData = { email: 'test@example.com', name: 'Test' };
      mockUserRepository.create.mockResolvedValue({ id: '1', ...userData });

      // Act
      const user = await service.createUser(userData);

      // Assert
      expect(user).toMatchObject(userData);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
    });

    it('should throw on duplicate email', async () => {
      // Arrange
      mockUserRepository.create.mockRejectedValue(new Error('duplicate'));

      // Act & Assert
      await expect(service.createUser({ email: 'exists@test.com' }))
        .rejects.toThrow('duplicate');
    });
  });
});
```

### Component Tests (React)

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });
});
```

---

## Integration Testing Patterns

### API Endpoint Tests

```typescript
// auth.routes.spec.ts
import request from 'supertest';
import { app } from '../app';
import { db } from '../config/database';

describe('POST /api/v1/auth/register', () => {
  beforeEach(async () => {
    await db.query('DELETE FROM users');
  });

  it('should register new user with valid data', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'new@example.com',
        password: 'securePassword123',
        name: 'New User'
      });

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      user: {
        email: 'new@example.com',
        name: 'New User'
      },
      token: expect.any(String)
    });
  });

  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'not-an-email',
        password: 'password123'
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('email');
  });

  it('should return 409 for duplicate email', async () => {
    // First registration
    await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'exists@test.com', password: 'pass123' });

    // Duplicate attempt
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'exists@test.com', password: 'pass123' });

    expect(response.status).toBe(409);
  });
});
```

### Database Tests

```typescript
// user.repository.spec.ts
import { UserRepository } from '../user.repository';
import { createTestDatabase, destroyTestDatabase } from '../test-utils';

describe('UserRepository', () => {
  let repo: UserRepository;
  let db;

  beforeAll(async () => {
    db = await createTestDatabase();
    repo = new UserRepository(db);
  });

  afterAll(async () => {
    await destroyTestDatabase(db);
  });

  beforeEach(async () => {
    await db.query('TRUNCATE users CASCADE');
  });

  it('should insert and retrieve user', async () => {
    const created = await repo.create({
      email: 'test@test.com',
      password_hash: 'hash'
    });

    const found = await repo.findById(created.id);

    expect(found).toMatchObject({
      email: 'test@test.com',
      id: created.id
    });
  });
});
```

---

## E2E Testing Patterns

### User Flow Tests (Playwright)

```typescript
// login-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('user can login with valid credentials', async ({ page }) => {
    // Navigate to login
    await page.click('text=Login');

    // Fill form
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');

    // Submit
    await page.click('button[type="submit"]');

    // Verify redirect and state
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.click('text=Login');
    await page.fill('[name="email"]', 'wrong@email.com');
    await page.fill('[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error-message')).toContainText('Invalid credentials');
    await expect(page).toHaveURL('/login');
  });
});
```

---

## The QA Review Process

### Status Flow

```
🔄 In Progress → 🧪 QA Review → ✅ Done
                      │
                      ├── (pass) → ✅ Done
                      │
                      └── (fail) → 🔄 In Progress (fix issues)
```

### QA Review Checklist

Every ticket in 🧪 QA Review must pass this checklist:

#### Code Quality
- [ ] Follows project coding standards
- [ ] No console.log/print left in production code
- [ ] Error handling implemented
- [ ] No hardcoded values (use constants/env)
- [ ] TypeScript types are correct (no `any`)
- [ ] No obvious security issues

#### Testing
- [ ] Unit tests written and pass
- [ ] Integration tests if applicable
- [ ] Edge cases covered
- [ ] Tests are meaningful (not just coverage)
- [ ] Test data is realistic

#### Functionality
- [ ] Feature works as specified
- [ ] Works on target viewports (mobile/desktop)
- [ ] Handles error states gracefully
- [ ] No regressions to existing features

#### Security (if applicable)
- [ ] Input validation present
- [ ] Auth/authz enforced
- [ ] No injection vulnerabilities
- [ ] Sensitive data protected

#### Documentation
- [ ] Code comments where logic is complex
- [ ] API documentation updated (if endpoints added)

### QA Review Output

```markdown
## QA Review: Ticket 4.3 - Create Sessions API

### Checklist Results

#### Code Quality
- [x] Follows coding standards
- [x] No debug statements
- [x] Error handling present
- [x] No hardcoded values
- [x] Types correct

#### Testing
- [x] Unit tests pass (8/8)
- [x] Integration tests pass (4/4)
- [x] Edge cases covered

#### Functionality
- [x] Works as specified
- [x] Error states handled

#### Security
- [x] Input validation via Zod
- [x] Auth required for endpoints

### Test Results
```
npm test
✓ SessionService.create (3 tests)
✓ SessionService.getById (2 tests)
✓ SessionService.update (3 tests)
✓ POST /api/sessions (2 tests)
✓ GET /api/sessions/:id (2 tests)

12 tests passed
```

### Verdict: ✅ PASS

### Status Updated
🧪 QA Review → ✅ Done
```

---

## Handling QA Failures

### Minor Issues

If issues are small and fixable quickly:

1. Document the issues
2. Send back to 🔄 In Progress
3. Implementer fixes
4. Returns to 🧪 QA Review

### Major Issues

If fundamental problems exist:

1. Document issues in detail
2. Create bug ticket(s)
3. May require spec clarification
4. Potentially impacts sprint completion

### Bug Ticket Format

```markdown
| B.1 | BUG: Sessions API returns 500 on empty body | ⏸️ Blocked | Backend | sonnet |

> **From QA of 4.3**
> Steps to reproduce:
> 1. POST /api/sessions with empty body
> 2. Observe 500 error
>
> Expected: 400 with validation error
> Actual: 500 server error
>
> Blocking: 4.4 (frontend depends on proper error handling)
```

---

## Automated QA in CI

### CI Pipeline Stages

```yaml
# .github/workflows/ci.yml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Unit tests
        run: npm run test:unit

      - name: Integration tests
        run: npm run test:integration

      - name: Coverage check
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Pre-commit Hooks

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  }
}
```

---

## Special QA Considerations

### Security-Critical Features

For auth, payments, personal data:

- [ ] Additional manual review
- [ ] Security-focused test cases
- [ ] Penetration testing (if applicable)
- [ ] Compliance check (GDPR, COPPA, etc.)

### Child-Facing Features

For applications targeting children:

- [ ] Age-appropriate content verification
- [ ] No inappropriate suggestions
- [ ] COPPA compliance
- [ ] Parental consent flows work
- [ ] Data minimization

### Performance-Critical Features

For high-traffic or real-time features:

- [ ] Load testing performed
- [ ] Response times within SLA
- [ ] Memory leaks checked
- [ ] Database queries optimized

---

## Test Data Management

### Test Fixtures

```typescript
// fixtures/users.ts
export const testUsers = {
  valid: {
    email: 'test@example.com',
    password: 'SecurePass123!',
    name: 'Test User'
  },
  admin: {
    email: 'admin@example.com',
    password: 'AdminPass123!',
    name: 'Admin User',
    role: 'admin'
  },
  invalid: {
    email: 'not-an-email',
    password: '123' // too short
  }
};
```

### Test Database

```typescript
// test-utils/database.ts
export async function setupTestDatabase() {
  const db = await createConnection(TEST_DATABASE_URL);
  await db.migrate.latest();
  return db;
}

export async function teardownTestDatabase(db) {
  await db.migrate.rollback();
  await db.destroy();
}

export async function resetTestData(db) {
  await db.raw('TRUNCATE users, sessions, profiles CASCADE');
}
```

---

## QA Metrics

Track these to improve quality over time:

| Metric | Formula | Target |
|--------|---------|--------|
| QA Pass Rate | First-pass passes / Total reviews | > 80% |
| Bug Escape Rate | Bugs found in prod / Total tickets | < 5% |
| Test Coverage | Lines covered / Total lines | > 70% |
| Test Execution Time | Total CI test time | < 10 min |
| Flaky Test Rate | Flaky tests / Total tests | < 1% |

---

## Next Steps

- [07_model_selection.md](./07_model_selection.md) - Optimize AI model costs
- [QA Review Skill](../../skills/claude/qa-review.md) - Automate QA with AI
- [Templates](../../templates/specs/05_qa_lead.template.md) - QA spec template
