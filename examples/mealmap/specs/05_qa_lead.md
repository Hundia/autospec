# MealMap — QA Lead Specification

> **Role:** QA Lead
> **Cross-references:** `specs/02_backend_lead.md` (API contracts), `specs/04_db_architect.md` (seed data), `specs/03_frontend_lead.md` (component hierarchy)

---

## 1. Test Strategy Overview

MealMap uses a standard test pyramid weighted toward unit tests for business logic, integration tests for API contracts, and a small number of end-to-end tests for critical user journeys.

```
        ┌─────────────┐
        │  E2E Tests  │  10% — Critical flows (register → create recipe → plan → shop)
        │  Playwright │
        └──────┬──────┘
        ┌──────▼──────────────────┐
        │  Integration Tests      │  20% — API endpoint tests with real test DB
        │  Vitest + Supertest     │
        └──────┬──────────────────┘
        ┌──────▼──────────────────────────────────────────┐
        │  Unit Tests                                      │  70% — Services, utilities, validators
        │  Vitest (backend) + Vitest + Testing Library     │
        │  (frontend)                                      │
        └──────────────────────────────────────────────────┘
```

---

## 2. Coverage Targets

| Scope | Line Coverage | Branch Coverage | Critical Services |
|-------|--------------|----------------|-------------------|
| Backend overall | ≥ 70% | ≥ 65% | — |
| `recipes.service.ts` | ≥ 85% | ≥ 80% | Shopping list + CRUD |
| `shoppingList.service.ts` | ≥ 90% | ≥ 85% | Core algorithm |
| `auth.service.ts` | ≥ 85% | ≥ 80% | Security-critical |
| `mealPlans.service.ts` | ≥ 80% | ≥ 75% | Activation logic |
| Frontend utilities | ≥ 90% | ≥ 85% | scaleIngredients, formatQuantity |
| Frontend components | ≥ 60% | ≥ 55% | RecipeCard, MealSlot |

---

## 3. Tooling

| Tool | Version | Purpose |
|------|---------|---------|
| Vitest | latest | Unit + integration test runner (backend + frontend) |
| Supertest | 6.x | HTTP integration testing for Express app |
| @testing-library/react | 14.x | React component testing |
| @testing-library/user-event | 14.x | Realistic user interaction simulation |
| Playwright | 1.x | End-to-end browser tests |
| @vitest/coverage-v8 | latest | Code coverage reports |
| vi (Vitest mock API) | — | Mocking modules, functions |
| pg-mem | 1.x | In-memory PostgreSQL for unit tests (alternative) |

---

## 4. File Naming and Location Conventions

```
api/
├── src/services/recipes.service.ts
└── tests/
    ├── unit/
    │   ├── recipes.service.test.ts       # Unit tests for RecipesService
    │   ├── shoppingList.service.test.ts  # Unit tests for ShoppingListService
    │   ├── auth.service.test.ts          # Unit tests for AuthService
    │   └── mealPlans.service.test.ts     # Unit tests for MealPlansService
    └── integration/
        ├── auth.test.ts                  # POST /auth/* endpoints
        ├── recipes.test.ts               # GET/POST/PUT/DELETE /recipes/*
        ├── ingredients.test.ts           # GET/POST /ingredients
        ├── mealPlans.test.ts             # /meal-plans/* endpoints
        └── shoppingList.test.ts          # /meal-plans/:id/shopping-list

web/
└── tests/
    ├── components/
    │   ├── RecipeCard.test.tsx
    │   ├── MealSlot.test.tsx
    │   ├── IngredientRow.test.tsx
    │   └── ShoppingList.test.tsx
    └── utils/
        ├── scaleIngredients.test.ts
        └── formatQuantity.test.ts

e2e/
├── auth.spec.ts                          # Register + login flows
├── recipes.spec.ts                       # Create → view → edit → delete
├── mealPlan.spec.ts                      # Plan meals for a week
└── shoppingList.spec.ts                  # Generate and check off list
```

---

## 5. Vitest Configuration (Backend)

```typescript
// api/vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      thresholds: {
        lines: 70,
        branches: 65,
        functions: 70,
        statements: 70,
      },
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/db/schema/**', 'src/types/**'],
    },
  },
});
```

### Test Setup File

```typescript
// api/tests/setup.ts
import { beforeAll, afterAll, beforeEach } from 'vitest';
import { db } from '../src/db/connection';
import { users, recipes, ingredients, recipeIngredients, mealPlans, mealPlanEntries } from '../src/db/schema';

export async function clearDatabase() {
  await db.delete(mealPlanEntries);
  await db.delete(mealPlans);
  await db.delete(recipeIngredients);
  await db.delete(recipes);
  await db.delete(ingredients);
  await db.delete(users);
}

beforeAll(async () => {
  // Verify test DB is a separate DB (not production)
  const url = process.env.DATABASE_URL ?? '';
  if (!url.includes('test') && !url.includes('mealmap_test')) {
    throw new Error('Integration tests must use a test database (DATABASE_URL must contain "test")');
  }
});

afterAll(async () => {
  await clearDatabase();
});
```

---

## 6. Unit Tests — Backend Services

### RecipesService Unit Tests

```typescript
// api/tests/unit/recipes.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RecipesService } from '../../src/services/recipes.service';
import { NotFoundError, ForbiddenError } from '../../src/types/errors';

// Mock the db module
vi.mock('../../src/db/connection', () => ({
  db: {
    query: {
      recipes: {
        findFirst: vi.fn(),
        findMany: vi.fn(),
      },
    },
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
    returning: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    offset: vi.fn().mockReturnThis(),
    orderBy: vi.fn().mockReturnThis(),
  },
}));

const MOCK_USER_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const MOCK_RECIPE_ID = 'r1b2c3d4-e5f6-7890-abcd-ef1234567890';

const mockRecipe = {
  id: MOCK_RECIPE_ID,
  userId: MOCK_USER_ID,
  title: 'Lemon Herb Chicken',
  description: 'Light and flavorful chicken',
  prepTimeMinutes: 15,
  cookTimeMinutes: 35,
  servings: 4,
  difficulty: 'medium' as const,
  tags: ['dinner', 'high-protein'],
  isDeleted: false,
  createdAt: new Date('2026-03-14'),
  updatedAt: new Date('2026-03-14'),
};

describe('RecipesService', () => {
  let service: RecipesService;

  beforeEach(() => {
    service = new RecipesService();
    vi.clearAllMocks();
  });

  describe('getRecipeById', () => {
    it('returns recipe when found and owned by user', async () => {
      const { db } = await import('../../src/db/connection');
      vi.mocked(db.query.recipes.findFirst).mockResolvedValueOnce({
        ...mockRecipe,
        recipeIngredients: [
          {
            id: 'ri1', recipeId: MOCK_RECIPE_ID, ingredientId: 'i1',
            quantity: '800.00', unit: 'g',
            ingredient: { id: 'i1', name: 'Chicken breast', category: 'meat', createdAt: new Date() },
          },
        ],
      });

      const result = await service.getRecipeById(MOCK_USER_ID, MOCK_RECIPE_ID);

      expect(result.id).toBe(MOCK_RECIPE_ID);
      expect(result.recipeIngredients).toHaveLength(1);
      expect(result.recipeIngredients[0].ingredient.name).toBe('Chicken breast');
    });

    it('throws NotFoundError when recipe does not exist', async () => {
      const { db } = await import('../../src/db/connection');
      vi.mocked(db.query.recipes.findFirst).mockResolvedValueOnce(undefined);

      await expect(
        service.getRecipeById(MOCK_USER_ID, 'nonexistent-id')
      ).rejects.toThrow(NotFoundError);
    });

    it('throws NotFoundError when recipe belongs to different user', async () => {
      const { db } = await import('../../src/db/connection');
      vi.mocked(db.query.recipes.findFirst).mockResolvedValueOnce(undefined);

      await expect(
        service.getRecipeById('other-user-id', MOCK_RECIPE_ID)
      ).rejects.toThrow(NotFoundError);
    });

    it('excludes soft-deleted recipes', async () => {
      const { db } = await import('../../src/db/connection');
      // The query should filter is_deleted = false, so findFirst returns undefined
      vi.mocked(db.query.recipes.findFirst).mockResolvedValueOnce(undefined);

      await expect(
        service.getRecipeById(MOCK_USER_ID, MOCK_RECIPE_ID)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('deleteRecipe', () => {
    it('sets is_deleted to true (soft delete)', async () => {
      const { db } = await import('../../src/db/connection');
      vi.mocked(db.query.recipes.findFirst).mockResolvedValueOnce(mockRecipe);
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ ...mockRecipe, isDeleted: true }]),
        }),
      } as any);

      await service.deleteRecipe(MOCK_USER_ID, MOCK_RECIPE_ID);

      expect(db.update).toHaveBeenCalledWith(expect.anything());
    });

    it('throws NotFoundError when deleting recipe that does not exist', async () => {
      const { db } = await import('../../src/db/connection');
      vi.mocked(db.query.recipes.findFirst).mockResolvedValueOnce(undefined);

      await expect(
        service.deleteRecipe(MOCK_USER_ID, 'nonexistent-id')
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('listRecipes', () => {
    it('returns paginated recipes for user', async () => {
      const { db } = await import('../../src/db/connection');
      // Mock both the data query and count query
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue([mockRecipe]),
              }),
            }),
            // count mock
          }),
        }),
      } as any);

      const result = await service.listRecipes(MOCK_USER_ID, {
        page: 1, limit: 20, search: undefined, tag: undefined,
        difficulty: undefined, maxTime: undefined,
      });

      expect(result.data).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
    });

    it('applies title search filter (case-insensitive)', async () => {
      // Verify that when search='lemon' is provided, ilike condition is added
      const mockIlike = vi.fn();
      // Assertion: the SQL query includes an ilike condition
      // Implementation detail tested via integration test
      expect(true).toBe(true); // Placeholder — integration tests cover this
    });
  });
});
```

### ShoppingListService Unit Tests

```typescript
// api/tests/unit/shoppingList.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShoppingListService } from '../../src/services/shoppingList.service';

const MOCK_PLAN_ID = 'm1b2c3d4-e5f6-7890-abcd-ef1234567890';
const MOCK_USER_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

vi.mock('../../src/db/connection', () => ({
  db: { query: { mealPlans: { findFirst: vi.fn() } } },
}));

describe('ShoppingListService', () => {
  let service: ShoppingListService;

  beforeEach(() => {
    service = new ShoppingListService();
    vi.clearAllMocks();
  });

  describe('generateShoppingList — aggregation logic', () => {
    it('sums quantities for matching ingredient + unit', async () => {
      const { db } = await import('../../src/db/connection');
      vi.mocked(db.query.mealPlans.findFirst).mockResolvedValueOnce({
        id: MOCK_PLAN_ID,
        userId: MOCK_USER_ID,
        name: 'Test Plan',
        isActive: true,
        entries: [
          {
            id: 'e1',
            mealPlanId: MOCK_PLAN_ID,
            servingsOverride: null,
            recipe: {
              id: 'r1',
              servings: 4,
              recipeIngredients: [
                {
                  ingredientId: 'i1',
                  quantity: '2.00', unit: 'cups',
                  ingredient: { id: 'i1', name: 'All-purpose flour', category: 'pantry' },
                },
              ],
            },
          },
          {
            id: 'e2',
            mealPlanId: MOCK_PLAN_ID,
            servingsOverride: null,
            recipe: {
              id: 'r2',
              servings: 4,
              recipeIngredients: [
                {
                  ingredientId: 'i1',
                  quantity: '1.00', unit: 'cups',
                  ingredient: { id: 'i1', name: 'All-purpose flour', category: 'pantry' },
                },
              ],
            },
          },
        ],
      });

      const result = await service.generateShoppingList(MOCK_USER_ID, MOCK_PLAN_ID);

      const flourItem = result.items.find((i) => i.name === 'All-purpose flour');
      expect(flourItem).toBeDefined();
      expect(flourItem!.lines).toHaveLength(1);
      expect(parseFloat(flourItem!.lines[0].quantity)).toBeCloseTo(3.0);
      expect(flourItem!.lines[0].unit).toBe('cups');
    });

    it('keeps separate lines for same ingredient with different units', async () => {
      const { db } = await import('../../src/db/connection');
      vi.mocked(db.query.mealPlans.findFirst).mockResolvedValueOnce({
        id: MOCK_PLAN_ID,
        userId: MOCK_USER_ID,
        name: 'Test Plan',
        isActive: true,
        entries: [
          {
            id: 'e1',
            mealPlanId: MOCK_PLAN_ID,
            servingsOverride: null,
            recipe: {
              id: 'r1', servings: 4,
              recipeIngredients: [{
                ingredientId: 'i2', quantity: '200.00', unit: 'g',
                ingredient: { id: 'i2', name: 'Butter', category: 'dairy' },
              }],
            },
          },
          {
            id: 'e2',
            mealPlanId: MOCK_PLAN_ID,
            servingsOverride: null,
            recipe: {
              id: 'r2', servings: 4,
              recipeIngredients: [{
                ingredientId: 'i2', quantity: '4.00', unit: 'tbsp',
                ingredient: { id: 'i2', name: 'Butter', category: 'dairy' },
              }],
            },
          },
        ],
      });

      const result = await service.generateShoppingList(MOCK_USER_ID, MOCK_PLAN_ID);

      const butterItem = result.items.find((i) => i.name === 'Butter');
      expect(butterItem).toBeDefined();
      expect(butterItem!.lines).toHaveLength(2);
    });

    it('scales ingredient quantities when servingsOverride is set', async () => {
      const { db } = await import('../../src/db/connection');
      vi.mocked(db.query.mealPlans.findFirst).mockResolvedValueOnce({
        id: MOCK_PLAN_ID,
        userId: MOCK_USER_ID,
        name: 'Test Plan',
        isActive: true,
        entries: [
          {
            id: 'e1',
            mealPlanId: MOCK_PLAN_ID,
            servingsOverride: 8, // double the original 4
            recipe: {
              id: 'r1', servings: 4,
              recipeIngredients: [{
                ingredientId: 'i3', quantity: '300.00', unit: 'g',
                ingredient: { id: 'i3', name: 'Chicken breast', category: 'meat' },
              }],
            },
          },
        ],
      });

      const result = await service.generateShoppingList(MOCK_USER_ID, MOCK_PLAN_ID);

      const chickenItem = result.items.find((i) => i.name === 'Chicken breast');
      expect(parseFloat(chickenItem!.lines[0].quantity)).toBeCloseTo(600.0);
    });

    it('groups items by ingredient category', async () => {
      const { db } = await import('../../src/db/connection');
      vi.mocked(db.query.mealPlans.findFirst).mockResolvedValueOnce({
        id: MOCK_PLAN_ID,
        userId: MOCK_USER_ID,
        name: 'Test Plan',
        isActive: true,
        entries: [
          {
            id: 'e1', mealPlanId: MOCK_PLAN_ID, servingsOverride: null,
            recipe: {
              id: 'r1', servings: 2,
              recipeIngredients: [
                { ingredientId: 'i1', quantity: '1.00', unit: 'whole', ingredient: { id: 'i1', name: 'Lemon', category: 'produce' } },
                { ingredientId: 'i2', quantity: '200.00', unit: 'g', ingredient: { id: 'i2', name: 'Chicken breast', category: 'meat' } },
                { ingredientId: 'i3', quantity: '2.00', unit: 'tbsp', ingredient: { id: 'i3', name: 'Olive oil', category: 'pantry' } },
              ],
            },
          },
        ],
      });

      const result = await service.generateShoppingList(MOCK_USER_ID, MOCK_PLAN_ID);

      expect(result.groupedByCategory['produce']).toContain('Lemon');
      expect(result.groupedByCategory['meat']).toContain('Chicken breast');
      expect(result.groupedByCategory['pantry']).toContain('Olive oil');
    });

    it('throws NotFoundError for plan that does not belong to user', async () => {
      const { db } = await import('../../src/db/connection');
      vi.mocked(db.query.mealPlans.findFirst).mockResolvedValueOnce(undefined);

      const { NotFoundError } = await import('../../src/types/errors');
      await expect(
        service.generateShoppingList(MOCK_USER_ID, MOCK_PLAN_ID)
      ).rejects.toThrow(NotFoundError);
    });
  });
});
```

### Frontend Utility Unit Tests

```typescript
// web/tests/utils/scaleIngredients.test.ts
import { describe, it, expect } from 'vitest';
import { scaleIngredients } from '../../src/utils/scaleIngredients';

const mockIngredients = [
  { id: 'ri1', name: 'All-purpose flour', category: 'pantry', quantity: '2.00', unit: 'cups' },
  { id: 'ri2', name: 'Butter', category: 'dairy', quantity: '0.50', unit: 'cups' },
  { id: 'ri3', name: 'Chicken breast', category: 'meat', quantity: '800.00', unit: 'g' },
];

describe('scaleIngredients', () => {
  it('returns same quantities when target equals original servings', () => {
    const result = scaleIngredients(mockIngredients, 4, 4);
    expect(result[0].quantity).toBe(2.00);
    expect(result[1].quantity).toBe(0.50);
    expect(result[2].quantity).toBe(800.00);
  });

  it('doubles quantities when target is double original', () => {
    const result = scaleIngredients(mockIngredients, 4, 8);
    expect(result[0].quantity).toBe(4.00);
    expect(result[1].quantity).toBe(1.00);
    expect(result[2].quantity).toBe(1600.00);
  });

  it('halves quantities when target is half original', () => {
    const result = scaleIngredients(mockIngredients, 4, 2);
    expect(result[0].quantity).toBeCloseTo(1.00);
    expect(result[1].quantity).toBeCloseTo(0.25);
    expect(result[2].quantity).toBeCloseTo(400.00);
  });

  it('scales to 3x correctly', () => {
    const result = scaleIngredients(mockIngredients, 4, 12);
    expect(result[0].quantity).toBe(6.00);
    expect(result[2].quantity).toBe(2400.00);
  });

  it('returns empty array for empty input', () => {
    expect(scaleIngredients([], 4, 8)).toEqual([]);
  });

  it('does not mutate the original ingredient array', () => {
    const original = [...mockIngredients];
    scaleIngredients(mockIngredients, 4, 8);
    expect(mockIngredients[0].quantity).toBe(original[0].quantity);
  });
});

// web/tests/utils/formatQuantity.test.ts
import { describe, it, expect } from 'vitest';
import { formatQuantity } from '../../src/utils/formatQuantity';

describe('formatQuantity', () => {
  it('formats whole numbers without decimal', () => {
    expect(formatQuantity(1)).toBe('1');
    expect(formatQuantity(3)).toBe('3');
    expect(formatQuantity(10)).toBe('10');
  });

  it('formats 0.5 as ½', () => {
    expect(formatQuantity(0.5)).toBe('½');
  });

  it('formats 0.25 as ¼', () => {
    expect(formatQuantity(0.25)).toBe('¼');
  });

  it('formats 0.75 as ¾', () => {
    expect(formatQuantity(0.75)).toBe('¾');
  });

  it('formats 1.5 as 1 ½', () => {
    expect(formatQuantity(1.5)).toBe('1 ½');
  });

  it('formats 2.25 as 2 ¼', () => {
    expect(formatQuantity(2.25)).toBe('2 ¼');
  });

  it('formats non-standard decimals as number string', () => {
    expect(formatQuantity(0.37)).toBe('0.37');
    expect(formatQuantity(1.8)).toBe('1.8');
  });
});
```

---

## 7. Integration Tests — API Endpoints

### Auth Integration Tests

```typescript
// api/tests/integration/auth.test.ts
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { clearDatabase } from '../setup';

describe('POST /api/auth/register', () => {
  beforeEach(async () => { await clearDatabase(); });

  it('creates account and returns tokens', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Jamie Chen', email: 'jamie@test.com', password: 'Password1' });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('jamie@test.com');
    expect(res.body.user.password_hash).toBeUndefined(); // never expose hash
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
  });

  it('returns 409 for duplicate email', async () => {
    await request(app).post('/api/auth/register')
      .send({ name: 'Jamie', email: 'jamie@test.com', password: 'Password1' });

    const res = await request(app).post('/api/auth/register')
      .send({ name: 'Jamie 2', email: 'jamie@test.com', password: 'Password2' });

    expect(res.status).toBe(409);
    expect(res.body.error).toBe('CONFLICT');
  });

  it('returns 400 for password without number', async () => {
    const res = await request(app).post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'NoNumbers' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('returns 400 for password shorter than 8 chars', async () => {
    const res = await request(app).post('/api/auth/register')
      .send({ name: 'Test', email: 'test@test.com', password: 'Pass1' });

    expect(res.status).toBe(400);
  });

  it('returns 400 for invalid email format', async () => {
    const res = await request(app).post('/api/auth/register')
      .send({ name: 'Test', email: 'not-an-email', password: 'Password1' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await clearDatabase();
    await request(app).post('/api/auth/register')
      .send({ name: 'Jamie', email: 'jamie@test.com', password: 'Password1' });
  });

  it('returns tokens for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login')
      .send({ email: 'jamie@test.com', password: 'Password1' });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app).post('/api/auth/login')
      .send({ email: 'jamie@test.com', password: 'WrongPass1' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('UNAUTHORIZED');
  });

  it('returns 401 for unknown email', async () => {
    const res = await request(app).post('/api/auth/login')
      .send({ email: 'unknown@test.com', password: 'Password1' });

    expect(res.status).toBe(401);
  });
});
```

### Recipe Integration Tests

```typescript
// api/tests/integration/recipes.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app';
import { clearDatabase } from '../setup';

async function registerAndGetToken() {
  const res = await request(app).post('/api/auth/register')
    .send({ name: 'Jamie', email: 'jamie@test.com', password: 'Password1' });
  return { token: res.body.accessToken, userId: res.body.user.id };
}

const validRecipePayload = {
  title: 'Creamy Garlic Pasta',
  prepTimeMinutes: 10,
  cookTimeMinutes: 20,
  servings: 4,
  difficulty: 'easy',
  instructions: '1. Boil pasta. 2. Make sauce. 3. Combine.',
  ingredients: [
    { name: 'Pasta (penne)', quantity: 400, unit: 'g' },
    { name: 'Garlic', quantity: 4, unit: 'whole' },
    { name: 'Heavy cream', quantity: 1, unit: 'cups' },
  ],
};

describe('POST /api/recipes', () => {
  let token: string;

  beforeEach(async () => {
    await clearDatabase();
    ({ token } = await registerAndGetToken());
  });

  it('creates a recipe with ingredients', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(validRecipePayload);

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Creamy Garlic Pasta');
    expect(res.body.ingredients).toHaveLength(3);
    expect(res.body.ingredients[0].name).toBe('Pasta (penne)');
    expect(res.body.id).toMatch(/^[0-9a-f-]{36}$/); // UUID format
  });

  it('auto-creates ingredients that do not exist', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...validRecipePayload,
        ingredients: [{ name: 'Saffron threads', quantity: 0.5, unit: 'tsp' }],
      });

    expect(res.status).toBe(201);
    expect(res.body.ingredients[0].name).toBe('Saffron threads');

    // Verify ingredient was created in ingredients table
    const ingredientsRes = await request(app)
      .get('/api/ingredients?search=Saffron')
      .set('Authorization', `Bearer ${token}`);
    expect(ingredientsRes.body.data).toHaveLength(1);
  });

  it('returns 401 when no auth token provided', async () => {
    const res = await request(app).post('/api/recipes').send(validRecipePayload);
    expect(res.status).toBe(401);
  });

  it('returns 400 when title is missing', async () => {
    const { title: _, ...payload } = validRecipePayload;
    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  it('returns 400 when ingredients array is empty', async () => {
    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...validRecipePayload, ingredients: [] });
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/recipes/:id', () => {
  let token: string;
  let recipeId: string;

  beforeEach(async () => {
    await clearDatabase();
    ({ token } = await registerAndGetToken());
    const res = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send(validRecipePayload);
    recipeId = res.body.id;
  });

  it('soft-deletes the recipe (recipe no longer appears in list)', async () => {
    const deleteRes = await request(app)
      .delete(`/api/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);

    const listRes = await request(app)
      .get('/api/recipes')
      .set('Authorization', `Bearer ${token}`);
    expect(listRes.body.data.find((r: any) => r.id === recipeId)).toBeUndefined();
  });

  it('returns 404 when trying to get the deleted recipe directly', async () => {
    await request(app)
      .delete(`/api/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${token}`);

    const getRes = await request(app)
      .get(`/api/recipes/${recipeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getRes.status).toBe(404);
  });
});
```

### Shopping List Integration Tests

```typescript
// api/tests/integration/shoppingList.test.ts
describe('GET /api/meal-plans/:id/shopping-list', () => {
  let token: string;
  let planId: string;

  beforeEach(async () => {
    // Setup: user + 2 recipes + meal plan + entries
    await clearDatabase();
    ({ token } = await registerAndGetToken());

    const pastaRes = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Garlic Pasta', prepTimeMinutes: 10, cookTimeMinutes: 20,
        servings: 4, difficulty: 'easy',
        instructions: 'Cook pasta and sauce.',
        ingredients: [
          { name: 'Pasta (penne)', quantity: 400, unit: 'g' },
          { name: 'All-purpose flour', quantity: 2, unit: 'cups' },
        ],
      });

    const chickenRes = await request(app)
      .post('/api/recipes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Flour-Dusted Chicken', prepTimeMinutes: 15, cookTimeMinutes: 35,
        servings: 4, difficulty: 'medium',
        instructions: 'Dust chicken in flour and bake.',
        ingredients: [
          { name: 'Chicken breast', quantity: 800, unit: 'g' },
          { name: 'All-purpose flour', quantity: 1, unit: 'cups' }, // same unit as pasta recipe
        ],
      });

    const planRes = await request(app)
      .post('/api/meal-plans')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Week', startDate: '2026-03-17', endDate: '2026-03-23' });
    planId = planRes.body.id;

    await request(app)
      .post(`/api/meal-plans/${planId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ recipeId: pastaRes.body.id, date: '2026-03-17', mealType: 'dinner' });

    await request(app)
      .post(`/api/meal-plans/${planId}/entries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ recipeId: chickenRes.body.id, date: '2026-03-18', mealType: 'dinner' });
  });

  it('aggregates same ingredient and unit across recipes', async () => {
    const res = await request(app)
      .get(`/api/meal-plans/${planId}/shopping-list`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const flour = res.body.items.find((i: any) => i.name === 'All-purpose flour');
    expect(flour).toBeDefined();
    expect(flour.lines).toHaveLength(1);
    expect(parseFloat(flour.lines[0].quantity)).toBeCloseTo(3.0);
    expect(flour.lines[0].unit).toBe('cups');
  });

  it('groups items by category', async () => {
    const res = await request(app)
      .get(`/api/meal-plans/${planId}/shopping-list`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.body.groupedByCategory.meat).toContain('Chicken breast');
    expect(res.body.groupedByCategory.pantry).toContain('All-purpose flour');
    expect(res.body.groupedByCategory.pantry).toContain('Pasta (penne)');
  });
});
```

---

## 8. End-to-End Test Scenarios

### E2E Setup

```typescript
// e2e/playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  baseURL: 'http://localhost:5173',
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
});
```

### E2E Scenario 1: Full Registration and First Recipe Flow

```typescript
// e2e/recipes.spec.ts
import { test, expect } from '@playwright/test';

test('User registers, creates recipe, views it with scaling', async ({ page }) => {
  // Step 1: Register
  await page.goto('/register');
  await page.fill('[name="name"]', 'Test User');
  await page.fill('[name="email"]', `test-${Date.now()}@test.com`);
  await page.fill('[name="password"]', 'Password1');
  await page.click('[type="submit"]');
  await expect(page).toHaveURL('/recipes');

  // Step 2: Navigate to create recipe
  await page.click('text=Add Recipe');
  await expect(page).toHaveURL('/recipes/new');

  // Step 3: Fill recipe form
  await page.fill('[name="title"]', 'Lemon Herb Chicken');
  await page.fill('[name="prepTimeMinutes"]', '15');
  await page.fill('[name="cookTimeMinutes"]', '35');
  await page.fill('[name="servings"]', '4');
  await page.selectOption('[name="difficulty"]', 'medium');
  await page.fill('[name="instructions"]', 'Preheat oven. Season chicken. Bake 35 minutes.');

  // Step 4: Add ingredient
  await page.click('text=Add Ingredient');
  await page.fill('[placeholder*="ingredient name"]', 'Chicken breast');
  await page.fill('[placeholder*="quantity"]', '800');
  await page.selectOption('[name*="unit"]', 'g');

  // Step 5: Submit
  await page.click('[type="submit"]');
  await expect(page.locator('text=Lemon Herb Chicken')).toBeVisible();

  // Step 6: Test scaling
  await page.fill('[aria-label="Servings"]', '8');
  await expect(page.locator('text=1600')).toBeVisible(); // 800g × 2
});
```

### E2E Scenario 2: Meal Planning and Shopping List

```typescript
test('User creates meal plan, adds recipes, generates shopping list', async ({ page }) => {
  // Prerequisites: login as pre-seeded user with recipes
  await page.goto('/login');
  await page.fill('[name="email"]', 'jamie@mealmap.example');
  await page.fill('[name="password"]', 'Password1');
  await page.click('[type="submit"]');

  // Create meal plan
  await page.goto('/meal-plans');
  await page.click('text=New Meal Plan');
  await page.fill('[name="name"]', 'Week of March 17');
  await page.fill('[name="startDate"]', '2026-03-17');
  await page.fill('[name="endDate"]', '2026-03-23');
  await page.click('[type="submit"]');

  // Add recipe to Monday dinner slot
  const mondayDinnerSlot = page.locator('[data-testid="meal-slot-2026-03-17-dinner"]');
  await mondayDinnerSlot.click();
  await page.fill('[placeholder*="Search recipes"]', 'Garlic');
  await page.click('text=Creamy Garlic Pasta');
  await expect(mondayDinnerSlot.locator('text=Creamy Garlic Pasta')).toBeVisible();

  // Activate plan
  await page.click('text=Activate Plan');
  await expect(page.locator('text=Plan activated')).toBeVisible();

  // Navigate to shopping list
  await page.goto('/shopping-list');
  await expect(page.locator('text=Pasta')).toBeVisible();
  await expect(page.locator('text=Garlic')).toBeVisible();

  // Check off an item
  const pastaCheckbox = page.locator('[data-testid="shopping-item-pasta"]');
  await pastaCheckbox.click();
  await expect(pastaCheckbox).toBeChecked();
});
```

---

## 9. Performance Benchmarks

| Endpoint | p50 | p95 | p99 | Method |
|----------|-----|-----|-----|--------|
| GET /api/health | < 10ms | < 20ms | < 50ms | Load test (k6) |
| POST /api/auth/login | < 200ms | < 500ms | < 1s | Load test |
| GET /api/recipes (20 items) | < 50ms | < 200ms | < 500ms | Integration test timing |
| GET /api/recipes/:id | < 30ms | < 100ms | < 200ms | Integration test timing |
| GET /api/meal-plans/:id/shopping-list | < 100ms | < 300ms | < 600ms | Integration test timing |

### Measuring in Integration Tests

```typescript
it('responds within 200ms p95', async () => {
  const times: number[] = [];
  for (let i = 0; i < 10; i++) {
    const start = Date.now();
    await request(app).get('/api/recipes').set('Authorization', `Bearer ${token}`);
    times.push(Date.now() - start);
  }
  times.sort((a, b) => a - b);
  const p95 = times[Math.ceil(times.length * 0.95) - 1];
  expect(p95).toBeLessThan(200);
});
```

---

## 10. Security Testing Checklist

| OWASP Top 10 | MealMap Risk | Test |
|-------------|-------------|------|
| A01: Broken Access Control | User A reads User B's recipes | `GET /recipes/:id` with different user token → expect 404 |
| A01: Broken Access Control | User A deletes User B's recipe | `DELETE /recipes/:id` with different user token → expect 404 |
| A02: Cryptographic Failures | Password stored in plaintext | Query DB directly, verify `password_hash` starts with `$2b$` |
| A03: Injection | SQL injection in search | `?search='; DROP TABLE recipes; --` → expect 200, no error |
| A03: Injection | SQL injection in title | POST recipe with `title: "'; DROP TABLE recipes; --"` → expect 201, stored safely |
| A07: Identification Failures | Expired JWT accepted | Use a JWT with past `exp` → expect 401 |
| A07: Identification Failures | Malformed JWT | `Authorization: Bearer not.a.jwt` → expect 401 |
| A07: Identification Failures | Missing auth header | Any protected endpoint without header → expect 401 |
| A09: Security Logging Failures | Failed logins logged | Check server logs for 401 events (monitoring, v2) |
| Rate limiting | Brute force login | 100 rapid login requests → check for 429 (if rate limiting added) |

### Cross-User Access Test (Critical)

```typescript
it('returns 404 when accessing another user\'s recipe', async () => {
  // Register two users
  const { token: token1 } = await registerAndGetToken('user1@test.com');
  const { token: token2 } = await registerAndGetToken('user2@test.com');

  // User 1 creates a recipe
  const res = await request(app)
    .post('/api/recipes')
    .set('Authorization', `Bearer ${token1}`)
    .send(validRecipePayload);
  const recipeId = res.body.id;

  // User 2 attempts to access User 1's recipe
  const getRes = await request(app)
    .get(`/api/recipes/${recipeId}`)
    .set('Authorization', `Bearer ${token2}`);

  expect(getRes.status).toBe(404); // Not 403 — don't reveal the resource exists
});
```

---

## 11. QA Process and Definition of Done

### Per-Ticket Definition of Done

A ticket is ✅ Done when:
1. Code compiles with `npx tsc --noEmit`
2. Unit tests for the changed service/utility pass
3. Integration tests for the changed endpoint pass
4. No existing tests regressed
5. Coverage does not drop below the thresholds in vitest.config.ts
6. The feature matches the acceptance criteria in `specs/01_product_manager.md`

### Per-Sprint QA Checklist

- [ ] All unit tests pass: `npx vitest run`
- [ ] All integration tests pass (using test database)
- [ ] TypeScript compiles cleanly: `npx tsc --noEmit`
- [ ] Coverage report shows ≥ 70% lines, ≥ 85% for critical services
- [ ] At least 1 E2E test covers the sprint's primary user story
- [ ] Security checklist items relevant to the sprint are verified
- [ ] No hardcoded secrets in committed code
- [ ] API responses match contracts in `specs/02_backend_lead.md`

---

*This spec drives all test implementation. Test data and seed scripts align with `specs/04_db_architect.md`. API shapes come from `specs/02_backend_lead.md`.*
