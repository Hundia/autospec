# MealMap — Database Architect Specification

> **Role:** Database Architect
> **Cross-references:** `specs/02_backend_lead.md` (service layer uses these schemas), `specs/05_qa_lead.md` (seed data for tests)

---

## 1. Database Technology

| Component | Choice | Version | Rationale |
|-----------|--------|---------|-----------|
| Database | PostgreSQL | 15 | ACID compliance, rich query features, UUID support, GIN indexes for array columns |
| ORM / Query Builder | Drizzle ORM | 0.29+ | Type-safe queries generated from TypeScript schema, no code generation step needed at runtime, lightweight compared to Prisma |
| Migration tool | Drizzle Kit | 0.20+ | Schema push for dev, generate SQL migrations for production |
| Driver | `postgres` (pg-native) | latest | Required by Drizzle for PostgreSQL |
| Connection pooling | Built-in Drizzle + postgres | — | Max 10 connections, min 2 idle |

### Why Drizzle over Prisma

- **No query engine binary:** Prisma ships a Rust query engine; Drizzle compiles to plain SQL
- **Zero runtime overhead:** Drizzle generates SQL at compile time; excellent for serverless (though MealMap is traditional Node)
- **Full TypeScript inference:** Drizzle schema is TypeScript code, so queries are type-safe without generating types
- **Lightweight:** ~47KB vs Prisma's multi-MB engine

---

## 2. Entity-Relationship Diagram (ASCII)

```
┌──────────────────────┐
│        users          │
├──────────────────────┤
│ PK  id (UUID)        │
│     email (UNIQUE)   │
│     password_hash    │
│     name             │
│     created_at       │
│     updated_at       │
└──────────┬───────────┘
           │ 1
           │
           │ N
┌──────────▼───────────┐         ┌───────────────────────┐
│       recipes         │         │      ingredients       │
├──────────────────────┤         ├───────────────────────┤
│ PK  id (UUID)        │         │ PK  id (UUID)         │
│ FK  user_id → users  │         │     name (UNIQUE)     │
│     title            │         │     category          │
│     description      │         │     created_at        │
│     instructions     │         └───────────┬───────────┘
│     prep_time_minutes│                     │ 1
│     cook_time_minutes│                     │
│     servings         │                     │ N
│     difficulty       ├──────────┐          │
│     image_url        │          │          │
│     tags[]           │          │   ┌──────▼────────────────────┐
│     calories_per_...  │          │   │    recipe_ingredients      │
│     protein_grams    │          └──►├───────────────────────────┤
│     carbs_grams      │              │ PK  id (UUID)             │
│     fat_grams        │              │ FK  recipe_id → recipes   │
│     is_deleted       │              │ FK  ingredient_id → ingr. │
│     created_at       │              │     quantity (DECIMAL)    │
│     updated_at       │              │     unit                  │
└──────────┬───────────┘              │     UNIQUE(recipe_id,     │
           │ 1                        │            ingredient_id) │
           │                          └───────────────────────────┘
           │ N
┌──────────▼───────────┐
│      meal_plans       │
├──────────────────────┤
│ PK  id (UUID)        │
│ FK  user_id → users  │
│     name             │
│     start_date (DATE)│
│     end_date (DATE)  │
│     is_active        │
│     created_at       │
│     updated_at       │
└──────────┬───────────┘
           │ 1
           │
           │ N
┌──────────▼───────────┐
│   meal_plan_entries   │
├──────────────────────┤
│ PK  id (UUID)        │
│ FK  meal_plan_id     │
│ FK  recipe_id        │
│     date (DATE)      │
│     meal_type        │
│     servings_override│
│     UNIQUE(plan_id,  │
│            date,     │
│            meal_type)│
└──────────────────────┘
```

---

## 3. Complete Drizzle Schema Definitions

### Setup and Connection

```typescript
// api/src/db/connection.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env';
import * as schema from './schema';

const sql = postgres(env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(sql, { schema });
export type DB = typeof db;
```

### users Table

```typescript
// api/src/db/schema/users.ts
import { pgTable, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

### ingredients Table

```typescript
// api/src/db/schema/ingredients.ts
import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const ingredientCategoryEnum = pgEnum('ingredient_category', [
  'produce', 'dairy', 'meat', 'pantry', 'frozen', 'other',
]);

export const ingredients = pgTable('ingredients', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  name: varchar('name', { length: 100 }).notNull().unique(),
  category: ingredientCategoryEnum('category').notNull().default('other'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Ingredient = typeof ingredients.$inferSelect;
export type NewIngredient = typeof ingredients.$inferInsert;
```

### recipes Table

```typescript
// api/src/db/schema/recipes.ts
import { pgTable, uuid, varchar, text, integer, boolean, timestamp, decimal, pgEnum } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';
import { users } from './users';
import { recipeIngredients } from './recipeIngredients';

export const difficultyEnum = pgEnum('difficulty', ['easy', 'medium', 'hard']);

export const recipes = pgTable('recipes', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description'),
  instructions: text('instructions').notNull(),
  prepTimeMinutes: integer('prep_time_minutes').notNull(),
  cookTimeMinutes: integer('cook_time_minutes').notNull(),
  servings: integer('servings').notNull().default(4),
  difficulty: difficultyEnum('difficulty').notNull(),
  imageUrl: varchar('image_url', { length: 500 }),
  tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
  caloriesPerServing: integer('calories_per_serving'),
  proteinGrams: decimal('protein_grams', { precision: 6, scale: 1 }),
  carbsGrams: decimal('carbs_grams', { precision: 6, scale: 1 }),
  fatGrams: decimal('fat_grams', { precision: 6, scale: 1 }),
  isDeleted: boolean('is_deleted').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  user: one(users, { fields: [recipes.userId], references: [users.id] }),
  recipeIngredients: many(recipeIngredients),
}));

export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
```

### recipe_ingredients Table (M2M Join)

```typescript
// api/src/db/schema/recipeIngredients.ts
import { pgTable, uuid, decimal, varchar, unique } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';
import { recipes } from './recipes';
import { ingredients } from './ingredients';

export const recipeIngredients = pgTable(
  'recipe_ingredients',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    recipeId: uuid('recipe_id').notNull().references(() => recipes.id, { onDelete: 'cascade' }),
    ingredientId: uuid('ingredient_id').notNull().references(() => ingredients.id),
    quantity: decimal('quantity', { precision: 8, scale: 2 }).notNull(),
    unit: varchar('unit', { length: 20 }).notNull(),
  },
  (table) => ({
    uniqRecipeIngredient: unique().on(table.recipeId, table.ingredientId),
  })
);

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
  recipe: one(recipes, { fields: [recipeIngredients.recipeId], references: [recipes.id] }),
  ingredient: one(ingredients, { fields: [recipeIngredients.ingredientId], references: [ingredients.id] }),
}));

export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type NewRecipeIngredient = typeof recipeIngredients.$inferInsert;
```

### meal_plans Table

```typescript
// api/src/db/schema/mealPlans.ts
import { pgTable, uuid, varchar, date, boolean, timestamp } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';
import { users } from './users';
import { mealPlanEntries } from './mealPlanEntries';

export const mealPlans = pgTable('meal_plans', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 200 }).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const mealPlansRelations = relations(mealPlans, ({ one, many }) => ({
  user: one(users, { fields: [mealPlans.userId], references: [users.id] }),
  entries: many(mealPlanEntries),
}));

export type MealPlan = typeof mealPlans.$inferSelect;
export type NewMealPlan = typeof mealPlans.$inferInsert;
```

### meal_plan_entries Table

```typescript
// api/src/db/schema/mealPlanEntries.ts
import { pgTable, uuid, date, integer, varchar, unique, pgEnum } from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';
import { mealPlans } from './mealPlans';
import { recipes } from './recipes';

export const mealTypeEnum = pgEnum('meal_type', ['breakfast', 'lunch', 'dinner', 'snack']);

export const mealPlanEntries = pgTable(
  'meal_plan_entries',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    mealPlanId: uuid('meal_plan_id').notNull().references(() => mealPlans.id, { onDelete: 'cascade' }),
    recipeId: uuid('recipe_id').notNull().references(() => recipes.id),
    date: date('date').notNull(),
    mealType: mealTypeEnum('meal_type').notNull(),
    servingsOverride: integer('servings_override'),
  },
  (table) => ({
    uniqSlot: unique().on(table.mealPlanId, table.date, table.mealType),
  })
);

export const mealPlanEntriesRelations = relations(mealPlanEntries, ({ one }) => ({
  mealPlan: one(mealPlans, { fields: [mealPlanEntries.mealPlanId], references: [mealPlans.id] }),
  recipe: one(recipes, { fields: [mealPlanEntries.recipeId], references: [recipes.id] }),
}));

export type MealPlanEntry = typeof mealPlanEntries.$inferSelect;
export type NewMealPlanEntry = typeof mealPlanEntries.$inferInsert;
```

### Schema Barrel Export

```typescript
// api/src/db/schema/index.ts
export * from './users';
export * from './ingredients';
export * from './recipes';
export * from './recipeIngredients';
export * from './mealPlans';
export * from './mealPlanEntries';
```

---

## 4. SQL Schema (Migration Reference)

```sql
-- migrations/20260314_000001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
CREATE TYPE ingredient_category AS ENUM ('produce', 'dairy', 'meat', 'pantry', 'frozen', 'other');

-- users
CREATE TABLE users (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255)  NOT NULL UNIQUE,
  password_hash   VARCHAR(255)  NOT NULL,
  name            VARCHAR(100)  NOT NULL,
  created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ingredients
CREATE TABLE ingredients (
  id          UUID                  PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100)          NOT NULL UNIQUE,
  category    ingredient_category   NOT NULL DEFAULT 'other',
  created_at  TIMESTAMP             NOT NULL DEFAULT NOW()
);

-- recipes
CREATE TABLE recipes (
  id                   UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title                VARCHAR(200) NOT NULL,
  description          TEXT,
  instructions         TEXT         NOT NULL,
  prep_time_minutes    INTEGER      NOT NULL,
  cook_time_minutes    INTEGER      NOT NULL,
  servings             INTEGER      NOT NULL DEFAULT 4,
  difficulty           difficulty   NOT NULL,
  image_url            VARCHAR(500),
  tags                 TEXT[]       NOT NULL DEFAULT '{}',
  calories_per_serving INTEGER,
  protein_grams        DECIMAL(6,1),
  carbs_grams          DECIMAL(6,1),
  fat_grams            DECIMAL(6,1),
  is_deleted           BOOLEAN      NOT NULL DEFAULT false,
  created_at           TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- recipe_ingredients
CREATE TABLE recipe_ingredients (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id       UUID          NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id   UUID          NOT NULL REFERENCES ingredients(id),
  quantity        DECIMAL(8,2)  NOT NULL,
  unit            VARCHAR(20)   NOT NULL,
  UNIQUE (recipe_id, ingredient_id)
);

-- meal_plans
CREATE TABLE meal_plans (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(200) NOT NULL,
  start_date  DATE         NOT NULL,
  end_date    DATE         NOT NULL,
  is_active   BOOLEAN      NOT NULL DEFAULT false,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- meal_plan_entries
CREATE TABLE meal_plan_entries (
  id                UUID       PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id      UUID       NOT NULL REFERENCES meal_plans(id) ON DELETE CASCADE,
  recipe_id         UUID       NOT NULL REFERENCES recipes(id),
  date              DATE       NOT NULL,
  meal_type         meal_type  NOT NULL,
  servings_override INTEGER,
  UNIQUE (meal_plan_id, date, meal_type)
);
```

---

## 5. Indexes

```sql
-- Filter recipes by user (most common query: list user's recipes)
CREATE INDEX idx_recipes_user_id ON recipes(user_id);

-- Exclude soft-deleted recipes efficiently
CREATE INDEX idx_recipes_is_deleted ON recipes(is_deleted);

-- Composite index: user + not-deleted (covers the most common query pattern)
CREATE INDEX idx_recipes_user_not_deleted ON recipes(user_id, is_deleted)
  WHERE is_deleted = false;

-- Full-text or ILIKE search on title (supports %search% queries)
-- Using a functional index on lower(title) for case-insensitive prefix/contains search
CREATE INDEX idx_recipes_title_lower ON recipes(lower(title));

-- GIN index for tags array containment queries (@> operator)
CREATE INDEX idx_recipes_tags ON recipes USING GIN(tags);

-- Load all ingredients for a recipe (join in recipe detail)
CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);

-- Find all recipes using a specific ingredient (used in ingredient detail, future feature)
CREATE INDEX idx_recipe_ingredients_ingredient_id ON recipe_ingredients(ingredient_id);

-- Filter meal plans by user
CREATE INDEX idx_meal_plans_user_id ON meal_plans(user_id);

-- Find active meal plan for user (used in shopping list page)
CREATE INDEX idx_meal_plans_user_active ON meal_plans(user_id, is_active)
  WHERE is_active = true;

-- Load all entries for a meal plan (used in calendar view)
CREATE INDEX idx_meal_plan_entries_plan_id ON meal_plan_entries(meal_plan_id);
```

### Index Purpose Summary

| Index | Query it Optimizes |
|-------|-------------------|
| `idx_recipes_user_id` | `WHERE user_id = $1` on recipe list |
| `idx_recipes_user_not_deleted` | `WHERE user_id = $1 AND is_deleted = false` (primary recipe list query) |
| `idx_recipes_title_lower` | `WHERE lower(title) LIKE lower('%$1%')` for title search |
| `idx_recipes_tags` | `WHERE tags @> ARRAY[$1]` for tag filter |
| `idx_recipe_ingredients_recipe_id` | JOIN on recipe_id when loading recipe with ingredients |
| `idx_recipe_ingredients_ingredient_id` | Future: find recipes that use ingredient X |
| `idx_meal_plans_user_id` | `WHERE user_id = $1` on meal plan list |
| `idx_meal_plans_user_active` | `WHERE user_id = $1 AND is_active = true` (shopping list) |
| `idx_meal_plan_entries_plan_id` | `WHERE meal_plan_id = $1` for calendar view |

---

## 6. Common Query Patterns

### List Recipes (paginated, with search and filters)

```typescript
// src/services/recipes.service.ts (pattern)
async listRecipes(userId: string, query: RecipeQuery) {
  const { page, limit, search, tag, difficulty, maxTime } = query;
  const offset = (page - 1) * limit;

  const conditions = [
    eq(recipes.userId, userId),
    eq(recipes.isDeleted, false),
  ];

  if (search) {
    conditions.push(ilike(recipes.title, `%${search}%`));
  }
  if (difficulty) {
    conditions.push(eq(recipes.difficulty, difficulty));
  }
  if (maxTime) {
    conditions.push(
      lte(sql`${recipes.prepTimeMinutes} + ${recipes.cookTimeMinutes}`, maxTime)
    );
  }
  if (tag) {
    conditions.push(sql`${recipes.tags} @> ARRAY[${tag}]::text[]`);
  }

  const [rows, [{ count }]] = await Promise.all([
    db.select().from(recipes)
      .where(and(...conditions))
      .orderBy(desc(recipes.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` })
      .from(recipes)
      .where(and(...conditions)),
  ]);

  return {
    data: rows,
    pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
  };
}
```

### Load Recipe with Ingredients (JOIN)

```typescript
async getRecipeById(userId: string, id: string) {
  const recipe = await db.query.recipes.findFirst({
    where: and(
      eq(recipes.id, id),
      eq(recipes.userId, userId),
      eq(recipes.isDeleted, false)
    ),
    with: {
      recipeIngredients: {
        with: { ingredient: true },
      },
    },
  });

  if (!recipe) throw new NotFoundError('Recipe');
  return recipe;
}
```

### Generate Shopping List (aggregation)

```typescript
async generateShoppingList(userId: string, mealPlanId: string) {
  // Verify plan ownership
  const plan = await db.query.mealPlans.findFirst({
    where: and(eq(mealPlans.id, mealPlanId), eq(mealPlans.userId, userId)),
    with: {
      entries: {
        with: {
          recipe: {
            with: { recipeIngredients: { with: { ingredient: true } } },
          },
        },
      },
    },
  });

  if (!plan) throw new NotFoundError('Meal plan');

  // Aggregate: Map<`${ingredientId}_${unit}`, { name, category, total }>
  const aggregated = new Map<string, { ingredientId: string; name: string; category: string; total: number; unit: string }>();

  for (const entry of plan.entries) {
    const scalingFactor =
      (entry.servingsOverride ?? entry.recipe.servings) / entry.recipe.servings;

    for (const ri of entry.recipe.recipeIngredients) {
      const key = `${ri.ingredientId}_${ri.unit}`;
      const existing = aggregated.get(key);
      const qty = parseFloat(ri.quantity) * scalingFactor;
      if (existing) {
        existing.total += qty;
      } else {
        aggregated.set(key, {
          ingredientId: ri.ingredientId,
          name: ri.ingredient.name,
          category: ri.ingredient.category,
          total: qty,
          unit: ri.unit,
        });
      }
    }
  }

  // Group by ingredient, then by category
  // ... (build response structure)
}
```

### Activate Meal Plan (transaction)

```typescript
async activateMealPlan(userId: string, planId: string) {
  return db.transaction(async (tx) => {
    // Deactivate all user's plans
    await tx.update(mealPlans)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(mealPlans.userId, userId));

    // Activate target plan (verify ownership)
    const [updated] = await tx.update(mealPlans)
      .set({ isActive: true, updatedAt: new Date() })
      .where(and(eq(mealPlans.id, planId), eq(mealPlans.userId, userId)))
      .returning();

    if (!updated) throw new NotFoundError('Meal plan');
    return updated;
  });
}
```

---

## 7. Migration Strategy

### Naming Convention

```
YYYYMMDDHHMMSS_description.sql
```

Examples:
- `20260314000001_initial_schema.sql`
- `20260320120000_add_nutritional_fields_to_recipes.sql`
- `20260401090000_add_ingredient_notes.sql`

### Drizzle Kit Config

```typescript
// api/drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import { env } from './src/config/env';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: env.DATABASE_URL },
});
```

### Migration Commands

```bash
# Development: push schema changes directly (no migration files)
npx drizzle-kit push

# Generate SQL migration file for a schema change
npx drizzle-kit generate

# Apply all pending migrations (production)
npx drizzle-kit migrate

# Open Drizzle Studio (browser GUI)
npx drizzle-kit studio
```

---

## 8. Soft Delete Policy

| Table | Delete Strategy | Rationale |
|-------|----------------|-----------|
| `users` | Hard delete (cascade) | Full GDPR deletion if requested; cascades to all user data |
| `recipes` | **Soft delete** (`is_deleted = true`) | Preserve data integrity — recipe may still be referenced in old meal plan entries |
| `ingredients` | No delete (immutable) | Global ingredient table; removing breaks recipe_ingredients |
| `recipe_ingredients` | Hard delete | Cascade from recipe delete; replaced on recipe edit |
| `meal_plans` | Hard delete (cascade to entries) | User explicitly deletes a plan; no value in keeping |
| `meal_plan_entries` | Hard delete | User removes a slot explicitly |

### Soft Delete Rules

1. All `SELECT` queries on `recipes` must include `WHERE is_deleted = false`
2. The Drizzle query layer enforces this via the `listRecipes` and `getRecipeById` service methods
3. Soft-deleted recipes remain in the database indefinitely (no TTL or cleanup job in v1)
4. If a recipe is soft-deleted while it has `meal_plan_entries`, those entries are NOT automatically removed — the entry's recipe will 404 on load, and the calendar shows "Recipe unavailable"

---

## 9. Seed Data

### Seed Script Structure

```typescript
// api/scripts/seed.ts
async function seed() {
  // 1. Clear all tables in dependency order
  await db.delete(mealPlanEntries);
  await db.delete(mealPlans);
  await db.delete(recipeIngredients);
  await db.delete(recipes);
  await db.delete(ingredients);
  await db.delete(users);

  // 2. Create users
  const [jamie, morgan] = await db.insert(users).values([
    { name: 'Jamie Chen', email: 'jamie@mealmap.example', passwordHash: await hash('Password1') },
    { name: 'Morgan Riley', email: 'morgan@mealmap.example', passwordHash: await hash('Password1') },
  ]).returning();

  // 3. Create ingredients (20 realistic ingredients)
  const ingredientData = [
    { name: 'Chicken breast', category: 'meat' },
    { name: 'Chicken thigh', category: 'meat' },
    { name: 'Ground beef', category: 'meat' },
    { name: 'Salmon fillet', category: 'meat' },
    { name: 'Garlic', category: 'produce' },
    { name: 'Onion', category: 'produce' },
    { name: 'Lemon', category: 'produce' },
    { name: 'Cherry tomatoes', category: 'produce' },
    { name: 'Spinach', category: 'produce' },
    { name: 'Broccoli', category: 'produce' },
    { name: 'All-purpose flour', category: 'pantry' },
    { name: 'Olive oil', category: 'pantry' },
    { name: 'Soy sauce', category: 'pantry' },
    { name: 'Pasta (penne)', category: 'pantry' },
    { name: 'Canned tomatoes', category: 'pantry' },
    { name: 'Butter', category: 'dairy' },
    { name: 'Heavy cream', category: 'dairy' },
    { name: 'Parmesan cheese', category: 'dairy' },
    { name: 'Eggs', category: 'dairy' },
    { name: 'Chickpeas', category: 'pantry' },
  ] as const;
  const createdIngredients = await db.insert(ingredients).values(ingredientData).returning();

  // 4. Create 10 recipes for Jamie
  // (recipe data elided for brevity — see seed script for full values)

  // 5. Create meal plan for Jamie (current week)
  const [plan] = await db.insert(mealPlans).values({
    userId: jamie.id,
    name: 'Week of March 17',
    startDate: '2026-03-17',
    endDate: '2026-03-23',
    isActive: true,
  }).returning();

  // 6. Add sample entries
  // Monday dinner: Creamy Garlic Pasta
  // Tuesday dinner: Lemon Herb Chicken
  // Wednesday dinner: Beef Stir Fry
  // etc.
}

seed().catch(console.error);
```

### Seed Data Summary

| Table | Rows | Notes |
|-------|------|-------|
| `users` | 2 | Jamie (home cook), Morgan (fitness) |
| `ingredients` | 20 | Across all 6 categories |
| `recipes` | 10 | 8 for Jamie, 2 for Morgan; vary by difficulty and tags |
| `recipe_ingredients` | ~50 | Average 5 ingredients per recipe |
| `meal_plans` | 1 | Jamie's current week, is_active = true |
| `meal_plan_entries` | 5 | Mon–Fri dinners for Jamie |

### Sample Recipes

| Title | Difficulty | Tags | Time |
|-------|-----------|------|------|
| Creamy Garlic Pasta | easy | vegetarian, quick, pasta | 10+20 min |
| Lemon Herb Chicken | medium | dinner, high-protein, gluten-free | 15+35 min |
| Beef and Broccoli Stir Fry | easy | dinner, quick | 10+15 min |
| Salmon with Cherry Tomatoes | medium | dinner, high-protein, pescatarian | 10+20 min |
| Spinach and Chickpea Curry | easy | vegetarian, vegan, dinner | 10+25 min |
| Classic French Omelette | easy | breakfast, quick, vegetarian | 5+5 min |
| Chicken Thigh Traybake | easy | dinner, kid-friendly | 15+45 min |
| Pasta Bolognese | medium | dinner, pasta | 20+45 min |
| High-Protein Egg Bowl | easy | breakfast, high-protein, quick | 5+10 min |
| Baked Salmon with Broccoli | easy | dinner, high-protein, gluten-free | 10+25 min |

---

## 10. Connection Pooling

```typescript
// Development: small pool
const sql = postgres(DATABASE_URL, { max: 5, idle_timeout: 20 });

// Production: larger pool
const sql = postgres(DATABASE_URL, { max: 10, idle_timeout: 30, connect_timeout: 10 });
```

### Pool Sizing Rationale

- MealMap is a single-user MVP; 10 connections is more than sufficient
- PostgreSQL default max_connections = 100; Docker default inherits OS limits
- Each Express request holds a connection for the duration of one DB operation (not session-long)

---

*This spec is the source of truth for all database implementation. Schema definitions here drive both the Drizzle ORM layer (`specs/02_backend_lead.md`) and test seed data (`specs/05_qa_lead.md`).*
