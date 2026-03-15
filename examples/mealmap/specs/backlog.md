# MealMap Backlog

Generated: 2026-03-14
Total Tickets: 24
Total Story Points: 75

---

## Sprint 0: Foundation

**Goal:** Project setup, infrastructure, walking skeleton — working Docker + PostgreSQL + Express health check + React shell with routing.

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
|----|-------|-------------|--------|--------|-------|-------|--------------|
| 0.1 | docker-compose.yml with PostgreSQL | Create docker-compose.yml with a `db` service (postgres:15-alpine), health check, named volume `mealmap_pgdata`, env vars for POSTGRES_USER/PASSWORD/DB. Add `.env.example` with DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, PORT. | 2 | ✅ | DevOps | haiku | — |
| 0.2 | Initialize Express + TypeScript backend | Scaffold `api/` directory with `package.json`, `tsconfig.json` (strict mode), `src/index.ts`, `src/app.ts`. Install express, typescript, @types/express, ts-node, nodemon. Configure `dev` and `build` npm scripts. | 3 | ✅ | Backend | sonnet | 0.1 |
| 0.3 | Drizzle ORM setup + schema | Install drizzle-orm, drizzle-kit, postgres driver. Create `src/db/connection.ts` and all 6 schema files (users, recipes, ingredients, recipe_ingredients, meal_plans, meal_plan_entries) per `specs/04_db_architect.md`. Create `drizzle.config.ts`. Run `npx drizzle-kit push` against test DB. | 3 | ✅ | DB | sonnet | 0.1 |
| 0.4 | Zod env validation + config module | Create `src/config/env.ts` with Zod schema validating DATABASE_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_ACCESS_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, PORT, NODE_ENV, BCRYPT_ROUNDS. App fails fast on startup if any required var is missing. | 1 | ✅ | Backend | haiku | 0.2 |
| 0.5 | Health check endpoint | Implement `GET /api/health` returning `{ status: "ok", timestamp, version }`. Register route in Express. No auth required. | 1 | ✅ | Backend | haiku | 0.2 |
| 0.6 | Global error middleware | Create `src/middleware/error.middleware.ts` with AppError, NotFoundError, ConflictError, UnauthorizedError, ForbiddenError custom classes. Register as last Express middleware. Return structured JSON error responses per `specs/02_backend_lead.md`. | 2 | ✅ | Backend | sonnet | 0.2 |
| 0.7 | Initialize React + Vite + Tailwind frontend | Scaffold `web/` with Vite 5 + React 18 + TypeScript template. Install Tailwind 3, configure `tailwind.config.js` per `specs/03_frontend_lead.md` design tokens. Install react-router-dom 6, zustand, axios, react-hook-form, zod, lucide-react, react-hot-toast. Create `src/main.tsx`, `src/App.tsx`, `src/router.tsx` with all routes (lazy-loaded pages) and ProtectedRoute component. | 3 | ✅ | Frontend | sonnet | — |
| 0.8 | Atom components + AppLayout | Implement Button, Input, Textarea, Select, Badge, Card, Spinner, Checkbox atoms per `specs/03_frontend_lead.md`. Implement AppLayout (sidebar + header), Sidebar with nav links (/recipes, /meal-plans, /shopping-list), AuthLayout centered card. | 3 | ✅ | Frontend | sonnet | 0.7 |
| 0.9 | Axios API client + auth store skeleton | Create `src/api/client.ts` with Axios instance (baseURL from VITE_API_URL), request interceptor (attach Bearer token), response interceptor (401 → refresh → retry). Create `src/stores/authStore.ts` with Zustand (user, tokens, login/logout/refresh actions). Connect to `src/api/auth.api.ts` stubs. | 3 | ✅ | Frontend | sonnet | 0.7 |
| 0.10 | Sprint 0 summary + docs scaffold | Write `sprints/sprint-0/summary.md`. Create `docs/architecture.md`, `docs/api.md`, `docs/setup.md` scaffolds (filled with actual content per sprint). | 2 | ✅ | QA | haiku | 0.1–0.9 |

---

## Sprint 1: Recipes + Auth

**Goal:** Working authentication (register, login, JWT refresh), full recipe CRUD backend, ingredient management, recipe list/detail/create/edit pages with search, filter, and scaling.

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
|----|-------|-------------|--------|--------|-------|-------|--------------|
| 1.1 | Auth endpoints (register, login, refresh, logout) | Implement AuthService (register with bcrypt hash, login with compare, signToken/verifyToken helpers). Create POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout routes with Zod validation middleware. Return accessToken (15m) + refreshToken (7d) per `specs/02_backend_lead.md`. | 5 | 🔲 | Backend | sonnet | 0.3, 0.6 |
| 1.2 | JWT auth middleware | Implement `src/middleware/auth.middleware.ts` — extract Bearer token, verify with JWT_ACCESS_SECRET, attach `req.user: JwtPayload`. Register on all non-auth routes. Augment Express Request type in `src/types/express.d.ts`. | 2 | 🔲 | Backend | haiku | 1.1 |
| 1.3 | Recipe CRUD endpoints | Implement RecipesService (createRecipe with ingredient upsert, listRecipes with pagination + search/filter, getRecipeById, updateRecipe, deleteRecipe soft-delete). Create all routes per `specs/02_backend_lead.md`. Zod validation on body and query params. | 5 | 🔲 | Backend | opus | 1.2 |
| 1.4 | Ingredient endpoints | Implement IngredientsService (listIngredients with name search, findOrCreate). Create GET /ingredients?search= and POST /ingredients. findOrCreate used internally by RecipesService to handle new ingredient names. | 2 | 🔲 | Backend | haiku | 1.2 |
| 1.5 | Login + Register pages | Implement LoginPage and RegisterPage with react-hook-form + Zod validation. Connect to authStore.login() and authStore.register(). Redirect to /recipes on success. Show inline field errors. Show toast on server error. Auto-redirect to /recipes if already logged in. | 3 | 🔲 | Frontend | sonnet | 0.9, 1.1 |
| 1.6 | Recipe list page + filters | Implement RecipeListPage: fetch recipes on mount, SearchBar with 300ms debounce, RecipeFilters (tag, difficulty, maxTime), RecipeList grid with RecipeCard (title, difficulty badge, prep+cook time, tags). Empty state. Loading skeleton. Pagination (load more). Connect to recipeStore. | 5 | 🔲 | Frontend | sonnet | 0.8, 1.3 |
| 1.7 | Recipe detail page with scaling | Implement RecipeDetailPage: fetch recipe by id, display all fields. Serving count number input connected to local state. IngredientList renders scaled quantities using scaleIngredients() + formatQuantity(). NutritionPanel for macro fields. Edit and Delete buttons. Confirmation dialog on delete (soft-delete). | 3 | 🔲 | Frontend | sonnet | 1.6 |
| 1.8 | Create + Edit recipe form | Implement RecipeForm organism with dynamic ingredient rows (useFieldArray), IngredientAutosuggest (GET /ingredients?search=), TagInput, difficulty Select, NutritionPanel optional fields. CreateRecipePage and EditRecipePage (EditRecipePage pre-fetches recipe and populates form defaultValues). Success redirects to /recipes/:id. | 5 | 🔲 | Frontend | opus | 1.6, 1.4 |
| 1.9 | Unit + integration tests (Sprint 1) | Write unit tests for RecipesService (create, list with filters, soft-delete, getById ownership), AuthService (register, login, compare), scaleIngredients util, formatQuantity util. Write integration tests for all auth endpoints and recipe CRUD per `specs/05_qa_lead.md`. Achieve ≥ 70% overall coverage. | 3 | 🔲 | QA | sonnet | 1.1–1.8 |
| 1.10 | Sprint 1 summary + docs update | Write `sprints/sprint-1/summary.md`. Update `docs/api.md` with auth + recipe endpoints. Update `docs/setup.md` with seed instructions. | 2 | 🔲 | QA | haiku | 1.9 |

---

## Sprint 2: Meal Planning + Shopping Lists

**Goal:** Full meal planning workflow — create plans, assign recipes to calendar slots, activate a plan, generate an aggregated shopping list, check off items. E2E tests for the full flow.

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
|----|-------|-------------|--------|--------|-------|-------|--------------|
| 2.1 | Meal plan CRUD endpoints | Implement MealPlansService (createMealPlan, listMealPlans, getMealPlanWithEntries, updateMealPlan, deleteMealPlan, activateMealPlan). activateMealPlan uses a DB transaction to deactivate all user plans then activate the target. Create all /meal-plans/* routes with Zod validation per `specs/02_backend_lead.md`. | 5 | 🔲 | Backend | sonnet | 1.2 |
| 2.2 | Meal plan entry endpoints | Implement MealPlanEntriesService (addEntry, removeEntry). Enforce UNIQUE(meal_plan_id, date, meal_type) constraint — return 409 ConflictError on duplicate. Verify meal plan belongs to authenticated user before allowing entry modifications. Create POST and DELETE routes. | 3 | 🔲 | Backend | sonnet | 2.1 |
| 2.3 | Shopping list generation endpoint | Implement ShoppingListService.generateShoppingList() — load plan entries with recipe+ingredients, scale quantities by servingsOverride, aggregate by (ingredient_id, unit), group by ingredient category. Create GET /meal-plans/:id/shopping-list per `specs/02_backend_lead.md`. | 5 | 🔲 | Backend | opus | 2.2 |
| 2.4 | Meal plan list + calendar page | Implement MealPlanListPage (list of plans, "New Meal Plan" button opens modal with name/startDate/endDate form). Implement MealPlanCalendarPage: MealCalendar grid (days × meal types), each MealSlot shows assigned recipe or "+ Add". Clicking an empty slot opens RecipePicker modal (search recipes, select to POST /entries). X button on filled slot calls DELETE /entries/:id after confirm. "Activate Plan" button. Connect to mealPlanStore. | 5 | 🔲 | Frontend | sonnet | 0.8, 2.1, 2.2 |
| 2.5 | Shopping list page | Implement ShoppingListPage: check if active plan exists (from mealPlanStore); if none, show empty state with link to /meal-plans. Fetch GET /meal-plans/:id/shopping-list. Render ShoppingList organism: category headers (Produce, Dairy, Meat, Pantry, Frozen, Other), checkbox + item name + aggregated quantity+unit per row. Check-off toggles local Set<string> state (not persisted to server). "Regenerate" button refetches. | 3 | 🔲 | Frontend | sonnet | 2.3, 0.8 |
| 2.6 | Unit + integration tests (Sprint 2) | Write ShoppingListService unit tests: aggregate same unit, keep separate lines for different units, scale by servingsOverride, throw on missing plan, group by category. Write integration tests for meal-plan CRUD, activate (deactivates others), entry conflict, shopping list generation (per `specs/05_qa_lead.md`). Write E2E: register → create recipe → create plan → add entry → activate → shopping list. Achieve ≥ 70% overall coverage. | 5 | 🔲 | QA | sonnet | 2.1–2.5 |
| 2.7 | Database seed script | Create `api/scripts/seed.ts`: clear all tables, insert 2 users (Jamie + Morgan), 20 ingredients across all categories, 10 recipes for Jamie (see `specs/04_db_architect.md` sample recipes), recipe_ingredients associations, 1 active meal plan with 5 entries for Jamie. Add `seed` npm script. | 2 | 🔲 | DB | haiku | 0.3 |
| 2.8 | Sprint 2 summary + docs final | Write `sprints/sprint-2/summary.md`. Update `docs/api.md` with meal plan + shopping list endpoints. Update `docs/architecture.md` with final system diagram. Update `docs/setup.md` with full setup instructions including seed. | 2 | 🔲 | QA | haiku | 2.6 |

---

## Bug Backlog

| ID | Title | Severity | Status | Sprint | Notes |
|----|-------|----------|--------|--------|-------|
| — | No bugs reported yet | — | — | — | Will be populated during implementation |

---

*Source: `specs/backlog.md` — drives all sprint execution. Update ticket status to 🔄 when starting, ✅ when done.*
