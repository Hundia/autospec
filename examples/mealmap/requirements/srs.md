# MealMap — Software Requirements Specification

## Project Overview

**Name:** MealMap
**Description:** A recipe and meal planning web application that helps home cooks organize recipes, plan weekly meals, and auto-generate shopping lists. Designed for individuals and families who want to eat intentionally — whether for health, budget, or convenience.

**Domain:** Food / Nutrition / Meal Planning
**Version:** 1.0 (MVP)

---

## Target Users

### Persona 1: Jamie (Home Cook)

- **Age:** 34, lives with partner
- **Role:** Enthusiastic home cook who collects recipes from blogs, cookbooks, and family
- **Goals:**
  - Organize 100+ saved recipes in one searchable place
  - Plan meals for the week every Sunday
  - Generate a grocery list automatically from the meal plan
  - Reduce food waste by planning around what's already in the fridge
- **Frustrations:**
  - Recipes scattered across bookmarks, screenshots, and sticky notes
  - Forgets what ingredients are needed, buys duplicates
  - Spends 30 minutes every Sunday just deciding what to cook
- **Tech comfort:** Intermediate (uses apps daily, comfortable with web forms)

### Persona 2: Morgan (Fitness Enthusiast)

- **Age:** 28, lives alone
- **Role:** Tracks macros and nutritional info for fitness goals
- **Goals:**
  - Log nutritional data (calories, protein, carbs, fat) per recipe
  - Plan meals that hit daily macro targets
  - Quickly find high-protein or low-carb recipes
  - Scale recipes for meal prep (e.g., 4 servings → 8 servings)
- **Frustrations:**
  - Most recipe apps don't show macros per serving
  - Manually calculating nutrition for each recipe is tedious
  - Meal prep requires scaling ingredients, which is error-prone
- **Tech comfort:** Advanced (uses MyFitnessPal, spreadsheets)

### Persona 3: Pat (Busy Parent)

- **Age:** 41, family of 4
- **Role:** Manages family meals with limited time
- **Goals:**
  - Find quick recipes (under 30 minutes)
  - Plan family meals that kids will eat
  - Scale recipes for family size
  - Share the meal plan with spouse
- **Frustrations:**
  - No time to browse recipes during the week
  - Kids are picky, needs to tag "kid-friendly" recipes
  - Shopping trips take too long without an organized list
- **Tech comfort:** Beginner to Intermediate

---

## Functional Requirements

### F1: User Authentication

- **F1.1** Email + password registration
- **F1.2** JWT-based auth: 15-minute access token, 7-day refresh token
- **F1.3** Login / logout
- **F1.4** Password must be 8+ characters with at least one number
- **F1.5** No SSO or OAuth in v1

### F2: Recipe Management (CRUD)

- **F2.1** Create recipe with fields:
  - Title (required, max 200 chars)
  - Description (optional, max 1000 chars)
  - Prep time in minutes (required)
  - Cook time in minutes (required)
  - Servings (required, integer 1–50)
  - Difficulty: easy | medium | hard
  - Tags (array of strings, e.g., "vegetarian", "kid-friendly", "quick")
  - Instructions (rich text / markdown, required)
  - Image URL (optional)
- **F2.2** Add ingredients to a recipe:
  - Each ingredient: name, quantity (decimal), unit (cups, tbsp, oz, g, ml, whole, pinch)
  - Ingredients are linked via a many-to-many join table
  - If an ingredient doesn't exist, create it automatically
- **F2.3** Edit any recipe field
- **F2.4** Delete a recipe (soft delete — mark as deleted, don't remove from DB)
- **F2.5** List recipes with pagination (20 per page)
- **F2.6** Search recipes by title (partial match, case-insensitive)
- **F2.7** Filter recipes by tag, difficulty, max prep+cook time
- **F2.8** View single recipe with full details and ingredient list
- **F2.9** Nutritional info per recipe (optional fields on recipe):
  - Calories, protein (g), carbs (g), fat (g) — all per serving

### F3: Ingredient Management

- **F3.1** Ingredients are global (shared across recipes)
- **F3.2** Each ingredient has: name (unique, case-insensitive), category (produce, dairy, meat, pantry, frozen, other)
- **F3.3** List all ingredients with search
- **F3.4** Auto-suggest ingredients when typing in recipe form

### F4: Meal Planning

- **F4.1** Create a meal plan for a date range (typically 7 days)
- **F4.2** Each meal plan has: name (e.g., "Week of March 17"), start_date, end_date
- **F4.3** Add entries to a meal plan:
  - Each entry: date, meal_type (breakfast | lunch | dinner | snack), recipe_id, servings_override (optional)
- **F4.4** View meal plan as a calendar grid (rows = days, columns = meal types)
- **F4.5** Drag-and-drop to move entries between days/meals (frontend nice-to-have)
- **F4.6** Remove an entry from a meal plan
- **F4.7** Only one meal plan can be "active" at a time

### F5: Shopping List

- **F5.1** Generate a shopping list from an active meal plan
- **F5.2** Aggregation logic: combine same ingredients across recipes
  - E.g., Recipe A needs 2 cups flour + Recipe B needs 1 cup flour → "Flour: 3 cups"
  - Only aggregate when units match; otherwise list separately
- **F5.3** Group shopping list items by ingredient category (produce, dairy, etc.)
- **F5.4** Check off items as purchased (toggle)
- **F5.5** Shopping list persists until the meal plan changes or is regenerated

### F6: Recipe Scaling

- **F6.1** When viewing a recipe, user can change serving count
- **F6.2** All ingredient quantities scale proportionally
  - E.g., original 4 servings with 2 cups flour → 8 servings shows 4 cups flour
- **F6.3** Scaling is display-only (doesn't modify the stored recipe)
- **F6.4** Meal plan entries with servings_override use the override for shopping list calculation

---

## Non-Functional Requirements

### NF1: Performance

- API response time: p95 < 300ms for list endpoints, p95 < 100ms for single-resource
- Frontend LCP < 2.5s, FID < 100ms
- Database queries should use indexes on frequently filtered columns

### NF2: Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens with proper expiration
- All API endpoints require auth except registration and login
- Input validation on all endpoints (Zod schemas)
- SQL injection prevention via parameterized queries (Drizzle ORM)

### NF3: Scalability

- Designed for single-user MVP but schema supports multi-user
- All recipes are scoped to the creating user (user_id foreign key)
- Meal plans are scoped to user

### NF4: Usability

- Mobile-responsive design (Tailwind breakpoints)
- Hebrew and RTL are NOT required (English-only)
- Loading states for all async operations
- Toast notifications for success/error feedback

---

## Data Model

### Table: users

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, default gen_random_uuid() |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| name | VARCHAR(100) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL, default NOW() |
| updated_at | TIMESTAMP | NOT NULL, default NOW() |

### Table: recipes

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, default gen_random_uuid() |
| user_id | UUID | FK → users.id, NOT NULL |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | |
| instructions | TEXT | NOT NULL |
| prep_time_minutes | INTEGER | NOT NULL |
| cook_time_minutes | INTEGER | NOT NULL |
| servings | INTEGER | NOT NULL, default 4 |
| difficulty | VARCHAR(10) | NOT NULL, CHECK (easy/medium/hard) |
| image_url | VARCHAR(500) | |
| tags | TEXT[] | default '{}' |
| calories_per_serving | INTEGER | |
| protein_grams | DECIMAL(6,1) | |
| carbs_grams | DECIMAL(6,1) | |
| fat_grams | DECIMAL(6,1) | |
| is_deleted | BOOLEAN | default false |
| created_at | TIMESTAMP | NOT NULL, default NOW() |
| updated_at | TIMESTAMP | NOT NULL, default NOW() |

### Table: ingredients

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, default gen_random_uuid() |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| category | VARCHAR(20) | NOT NULL, default 'other' |
| created_at | TIMESTAMP | NOT NULL, default NOW() |

### Table: recipe_ingredients (M2M join)

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, default gen_random_uuid() |
| recipe_id | UUID | FK → recipes.id, NOT NULL |
| ingredient_id | UUID | FK → ingredients.id, NOT NULL |
| quantity | DECIMAL(8,2) | NOT NULL |
| unit | VARCHAR(20) | NOT NULL |
| UNIQUE | | (recipe_id, ingredient_id) |

### Table: meal_plans

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, default gen_random_uuid() |
| user_id | UUID | FK → users.id, NOT NULL |
| name | VARCHAR(200) | NOT NULL |
| start_date | DATE | NOT NULL |
| end_date | DATE | NOT NULL |
| is_active | BOOLEAN | default false |
| created_at | TIMESTAMP | NOT NULL, default NOW() |
| updated_at | TIMESTAMP | NOT NULL, default NOW() |

### Table: meal_plan_entries

| Column | Type | Constraints |
|--------|------|------------|
| id | UUID | PK, default gen_random_uuid() |
| meal_plan_id | UUID | FK → meal_plans.id, NOT NULL |
| recipe_id | UUID | FK → recipes.id, NOT NULL |
| date | DATE | NOT NULL |
| meal_type | VARCHAR(10) | NOT NULL, CHECK (breakfast/lunch/dinner/snack) |
| servings_override | INTEGER | |
| UNIQUE | | (meal_plan_id, date, meal_type) |

### Indexes

- `recipes.user_id` — filter recipes by user
- `recipes.is_deleted` — exclude soft-deleted
- `recipes.tags` — GIN index for array containment queries
- `recipe_ingredients.recipe_id` — load ingredients for a recipe
- `recipe_ingredients.ingredient_id` — find recipes using an ingredient
- `meal_plans.user_id` — filter meal plans by user
- `meal_plan_entries.meal_plan_id` — load entries for a meal plan

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend | Express | 4.x |
| Language | TypeScript | 5.x |
| ORM | Drizzle ORM | 0.29+ |
| Validation | Zod | 3.x |
| Database | PostgreSQL | 15 |
| Frontend | React | 18 |
| Build Tool | Vite | 5 |
| CSS | Tailwind CSS | 3.x |
| State Mgmt | Zustand | 4.x |
| HTTP Client | Axios | 1.x |
| Routing | React Router | 6.x |
| Testing | Vitest + Supertest | latest |

---

## Sprint Plan (3 Sprints)

### Sprint 0: Foundation (~8 tickets)

Project scaffolding, database setup, Docker, basic Express server with health check, React skeleton with routing, Tailwind config, API client setup.

### Sprint 1: Recipes + Auth (~8 tickets)

User registration and login, JWT middleware, recipe CRUD endpoints, ingredient management, recipe list page with search/filter, recipe detail page, create/edit recipe form.

### Sprint 2: Meal Planning + Shopping Lists (~6 tickets)

Meal plan CRUD, calendar view, assign recipes to days/meals, shopping list generation with ingredient aggregation, check-off functionality, meal plan overview page.

---

## Out of Scope (v1)

- Mobile native apps (web responsive only)
- Social features (sharing recipes with other users)
- Recipe import from URLs
- Image upload (URL only)
- Multi-language / i18n
- Payment / subscription
- Push notifications
- Offline mode / PWA
