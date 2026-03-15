# Sprint 0 Summary

**Date:** 2026-03-14
**Status:** ✅ COMPLETE
**Theme:** Foundation — Docker, Express API skeleton, React frontend shell, Drizzle schema

---

## Overview

Sprint 0 establishes the full-stack project foundation for MealMap. A PostgreSQL database runs in Docker, an Express + TypeScript API provides a health check endpoint with global error middleware and Zod env validation, and a React + Vite + Tailwind frontend has routing, Zustand auth store, Axios client, and placeholder pages for all routes. All 6 database tables are defined in Drizzle ORM schema files.

---

## Completed Tickets

| # | Ticket | Status | Docs |
|---|--------|--------|------|
| 0.1 | docker-compose.yml with PostgreSQL | ✅ | [docs/setup.md] |
| 0.2 | Initialize Express + TypeScript backend | ✅ | [docs/architecture.md] |
| 0.3 | Drizzle ORM setup + schema | ✅ | [docs/architecture.md] |
| 0.4 | Zod env validation + config module | ✅ | [docs/api.md] |
| 0.5 | Health check endpoint | ✅ | [docs/api.md] |
| 0.6 | Global error middleware | ✅ | [docs/architecture.md] |
| 0.7 | Initialize React + Vite + Tailwind frontend | ✅ | [docs/setup.md] |
| 0.8 | Atom components + AppLayout | ✅ | [docs/architecture.md] |
| 0.9 | Axios API client + auth store skeleton | ✅ | [docs/architecture.md] |
| 0.10 | Sprint 0 summary + docs scaffold | ✅ | [docs/architecture.md, docs/api.md, docs/setup.md] |

---

## Documentation Updated

| Doc File | Change |
|----------|--------|
| `docs/architecture.md` | Exists from pre-generation (orchestrator-authored); reflects Sprint 0 architecture |
| `docs/api.md` | Exists from pre-generation; Sprint 0 adds /health endpoint |
| `docs/setup.md` | Exists from pre-generation; Sprint 0 completes the setup guide |

---

## Key Files Created/Modified

### Infrastructure
- `docker-compose.yml` — PostgreSQL 15-alpine with health check + named volume `mealmap_pgdata`
- `.env.example` — All env vars documented
- `.gitignore` — Updated with coverage/, drizzle/, .vitest/

### API (`api/`)
- `package.json` — All deps: express, drizzle-orm, zod, bcryptjs, jsonwebtoken, etc.
- `tsconfig.json` — strict: true, target: ES2022, module: NodeNext
- `drizzle.config.ts` — Points to schema/index.ts, outputs to drizzle/migrations/
- `src/index.ts` — Express server entry, graceful shutdown
- `src/app.ts` — Express factory: cors, helmet, morgan, routes, error handler
- `src/config/env.ts` — Zod env schema, fails fast on missing vars
- `src/types/errors.ts` — AppError, NotFoundError, ConflictError, UnauthorizedError, ForbiddenError, ValidationError
- `src/types/express.d.ts` — Augments Request with `user: JwtPayload`
- `src/middleware/error.middleware.ts` — Global error handler
- `src/middleware/validate.middleware.ts` — Zod schema validation factory
- `src/middleware/auth.middleware.ts` — JWT Bearer token verification
- `src/utils/jwt.ts` — signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken
- `src/utils/hash.ts` — hashPassword, comparePassword (bcryptjs)
- `src/routes/health.routes.ts` — GET /api/health → { status, timestamp, version }
- `src/routes/index.ts` — Router mount point (ready for Sprint 1 routes)
- `src/db/connection.ts` — Drizzle + postgres connection singleton
- `src/db/schema/users.ts` — users table
- `src/db/schema/ingredients.ts` — ingredients table + ingredientCategoryEnum
- `src/db/schema/recipes.ts` — recipes table + difficultyEnum
- `src/db/schema/recipeIngredients.ts` — recipe_ingredients M2M join table
- `src/db/schema/mealPlans.ts` — meal_plans table
- `src/db/schema/mealPlanEntries.ts` — meal_plan_entries table + mealTypeEnum
- `src/db/schema/index.ts` — All relations defined here (avoids circular imports) + barrel exports

### Web (`web/`)
- `package.json` — react, react-router-dom, zustand, axios, tailwindcss, react-hook-form, etc.
- `tsconfig.json` — strict: true, bundler module resolution
- `vite.config.ts` — React plugin, /api proxy to localhost:4000
- `tailwind.config.js` — brand color palette (green), Inter font
- `postcss.config.js` — tailwindcss + autoprefixer
- `index.html` — Root HTML with Inter font preload
- `src/main.tsx` — React 18 createRoot + BrowserRouter
- `src/App.tsx` — All routes with lazy loading + Suspense + ProtectedRoute
- `src/index.css` — Tailwind directives
- `src/types/` — auth.types.ts, recipe.types.ts, ingredient.types.ts, mealPlan.types.ts, shoppingList.types.ts
- `src/api/client.ts` — Axios instance + request/response interceptors (JWT attach, 401 refresh-retry)
- `src/api/auth.api.ts` — register, login, refresh, logout stubs
- `src/api/recipes.api.ts` — CRUD API stubs
- `src/api/ingredients.api.ts` — list, create stubs
- `src/api/mealPlans.api.ts` — CRUD + activate stubs
- `src/api/mealPlanEntries.api.ts` — add/remove stubs
- `src/api/shoppingList.api.ts` — getShoppingList stub
- `src/stores/authStore.ts` — Zustand store: user, accessToken, refreshToken, login/register/logout/refresh actions + API handler wiring
- `src/stores/recipeStore.ts` — Zustand store: recipes, filters, pagination, CRUD actions
- `src/stores/mealPlanStore.ts` — Zustand store: plans, activePlan, entries, CRUD + entry actions
- `src/components/atoms/` — Button, Input, Badge, Card, Spinner
- `src/components/layout/` — AppLayout, Sidebar, AuthLayout, ProtectedRoute
- `src/pages/auth/` — LoginPage, RegisterPage (with inline validation)
- `src/pages/recipes/` — RecipeListPage (placeholder), RecipeDetailPage, CreateRecipePage, EditRecipePage
- `src/pages/meal-plans/` — MealPlanListPage, MealPlanCalendarPage (placeholders)
- `src/pages/shopping/` — ShoppingListPage (placeholder)
- `src/utils/` — scaleIngredients.ts, formatQuantity.ts, groupByCategory.ts

---

## QA Results

| Check | Result | Notes |
|-------|--------|-------|
| TypeScript compiles (api) | ✅ | strict mode, NodeNext module |
| TypeScript compiles (web) | ✅ | strict mode, bundler resolution |
| Vite build (web) | ✅ | All lazy-loaded pages |
| Health check route | ✅ | GET /api/health defined |
| All 6 DB tables defined | ✅ | Drizzle schema with relations in index.ts |
| Env validation | ✅ | Zod schema, process.exit(1) on missing vars |
| Error middleware | ✅ | AppError hierarchy, global handler |
| Auth store | ✅ | Zustand persist (refreshToken only) |
| API interceptors | ✅ | Bearer attach, 401 refresh-retry |

---

## Retrospective

**What went well:**
- Drizzle schema structure is clean — centralizing relations in `schema/index.ts` avoids circular import issues that would occur if each schema file imported from others in both directions
- Zustand store pattern with `setApiAuthHandlers()` callback avoids the circular import between `client.ts` and `authStore.ts`
- TypeScript strict mode enforced from the start across both layers

**What to improve in Sprint 1:**
- Auth endpoints need a concrete test against the real DB (or a test DB)
- Consider adding a `morgan` request logging format configuration
- The `web/tsconfig.node.json` should reference `postcss.config.js` and `tailwind.config.js` if they need type-checking
