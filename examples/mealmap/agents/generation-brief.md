# Generation Brief: MealMap Specs + Docs

**Agent:** Sonnet
**Working Directory:** `examples/mealmap/`
**Date:** 2026-03-14

---

## Mission

Generate 5 role-based specification files, a sprint backlog, and 3 documentation files for the MealMap recipe and meal planning application. All output must be MealMap-specific with concrete examples — no generic placeholders.

---

## Input Files (READ THESE FIRST)

| File | What to extract |
|------|-----------------|
| `examples/mealmap/requirements/srs.md` | Full SRS: 3 personas, 6 features (F1-F6), 6 tables, tech stack, sprint plan |
| `examples/mealmap/quickstart/02-specs.md` | Spec format requirements for all 10 role files + backlog format |
| `examples/mealmap/quickstart/03-docs.md` | Docs format requirements |
| `examples/mealmap/quickstart/07-quality-gates.md` | Quality validation rules |
| `examples/mealmap/CLAUDE.md` | Project rules and structure |

---

## What to Generate

### 1. Specs (5 files in `examples/mealmap/specs/`)

Generate only these 5 specs (skip 06-10 — not needed for this example):

#### `specs/01_product_manager.md` (300+ lines)
- Project vision and elevator pitch for MealMap
- Problem statement: recipes scattered, meal planning is manual, shopping lists are guesswork
- 3 personas from SRS: Jamie, Morgan, Pat — expand with user stories and acceptance criteria
- User flows: registration, create recipe, plan meals, generate shopping list
- MoSCoW prioritization of F1-F6 features
- Success metrics: recipes per user, meal plans created per week, shopping list generation rate

#### `specs/02_backend_lead.md` (300+ lines)
- Express 4.x + TypeScript architecture
- Directory structure: `api/src/{routes,controllers,services,middleware,db,schemas,utils}`
- Complete API contracts table for ALL endpoints:
  - Auth: POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout
  - Recipes: GET/POST /recipes, GET/PUT/DELETE /recipes/:id
  - Ingredients: GET /ingredients, POST /ingredients
  - Meal Plans: GET/POST /meal-plans, GET/PUT/DELETE /meal-plans/:id, POST /meal-plans/:id/activate
  - Meal Plan Entries: GET/POST /meal-plans/:id/entries, DELETE /meal-plans/:id/entries/:entryId
  - Shopping List: GET /meal-plans/:id/shopping-list
  - Health: GET /health
- Request/response JSON examples for every endpoint
- JWT auth flow, middleware chain, error handling with custom error classes
- Zod validation schemas for all request bodies

#### `specs/03_frontend_lead.md` (300+ lines)
- React 18 + Vite 5 + Tailwind 3 + Zustand
- Component hierarchy: atoms (Button, Input, Badge, Card) → molecules (RecipeCard, IngredientRow, MealSlot) → organisms (RecipeList, MealCalendar, ShoppingList) → pages
- Routing table:
  - / → redirect to /recipes
  - /login, /register → public
  - /recipes → RecipeListPage (auth required)
  - /recipes/new → CreateRecipePage
  - /recipes/:id → RecipeDetailPage
  - /recipes/:id/edit → EditRecipePage
  - /meal-plans → MealPlanListPage
  - /meal-plans/:id → MealPlanCalendarPage
  - /shopping-list → ShoppingListPage
- Design system tokens: clean food/cooking theme colors
- State: authStore (global), recipeStore (global), mealPlanStore (global)
- Form handling with react-hook-form + Zod

#### `specs/04_db_architect.md` (300+ lines)
- PostgreSQL 15 + Drizzle ORM
- Full ERD (ASCII) showing all 6 tables and relationships
- Complete Drizzle schema definitions for: users, recipes, ingredients, recipe_ingredients, meal_plans, meal_plan_entries
- Use the exact column definitions from the SRS data model section
- Index definitions with purpose
- Seed data: 2 users, 10 recipes, 20 ingredients, sample meal plan
- Soft delete for recipes (is_deleted flag), hard delete for entries

#### `specs/05_qa_lead.md` (300+ lines)
- Test pyramid: unit 70%, integration 20%, e2e 10%
- Vitest + Supertest + Testing Library
- Unit test examples: recipe service (create, list with filters, soft delete)
- Integration test examples: auth flow, recipe CRUD, shopping list generation
- E2E scenarios: register → create recipe → plan meal → generate list
- Coverage target: 70%+
- Security checklist mapped to MealMap

### 2. Backlog (`examples/mealmap/specs/backlog.md`)

Follow the exact format from `quickstart/02-specs.md`:

```
| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
```

3 sprints:

**Sprint 0: Foundation** (~20 pts, ~8 tickets)
- 0.1: docker-compose.yml with PostgreSQL (2pts)
- 0.2: .env.example with all env vars (1pt)
- 0.3: Initialize Express + TypeScript backend (3pts)
- 0.4: Configure TypeScript strict mode (1pt)
- 0.5: Drizzle ORM setup + schema (3pts)
- 0.6: Health check endpoint (1pt)
- 0.7: Initialize React + Vite + Tailwind frontend (3pts)
- 0.8: API client + auth store skeleton (3pts)
- 0.9: Create docs (architecture.md, api.md, setup.md) (2pts)
- 0.10: Sprint 0 summary (1pt)

**Sprint 1: Recipes + Auth** (~30 pts, ~8 tickets)
- Auth endpoints (register, login, refresh)
- JWT middleware
- Recipe CRUD endpoints
- Ingredient management
- Recipe list page with search/filter
- Recipe detail page
- Create/edit recipe form
- Unit + integration tests

**Sprint 2: Meal Planning + Shopping Lists** (~25 pts, ~6 tickets)
- Meal plan CRUD endpoints
- Meal plan entries (add/remove recipes to days)
- Calendar view page
- Shopping list generation endpoint
- Shopping list page with check-off
- E2E tests

All statuses: 🔲 (todo)
Model column: haiku (40%), sonnet (45%), opus (15%)

### 3. Docs (3 files in `examples/mealmap/docs/`)

#### `docs/architecture.md` (100+ lines)
- High-level system diagram (ASCII): Browser → React SPA → Express API → PostgreSQL
- Tech stack summary
- Request lifecycle
- Key architectural decisions (Drizzle over Prisma, Zustand over Redux, etc.)

#### `docs/api.md` (100+ lines)
- Full endpoint catalog (same as backend spec but formatted as quick reference)
- Auth flow with curl examples
- Error response format
- Pagination format

#### `docs/setup.md` (100+ lines)
- Prerequisites (Node 20, Docker)
- Clone, install, configure env
- Start database, run migrations, seed
- Start backend and frontend dev servers
- Verify health check

---

## Output Checklist

Before finishing, verify:
- [ ] 5 spec files exist in `examples/mealmap/specs/`, each ≥300 lines
- [ ] `specs/backlog.md` has 3 sprints with proper table format
- [ ] No `[insert here]`, `TODO`, `TBD`, or `[placeholder]` text anywhere
- [ ] 3 doc files exist in `examples/mealmap/docs/`
- [ ] All examples use MealMap-specific names (recipes, ingredients, meal_plans)
- [ ] Cross-references between specs use correct filenames
