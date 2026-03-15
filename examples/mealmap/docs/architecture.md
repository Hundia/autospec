# MealMap — Architecture

> **Sprint cross-reference:** Created in Sprint 0, updated after each sprint.
> **Related specs:** `specs/02_backend_lead.md`, `specs/03_frontend_lead.md`, `specs/04_db_architect.md`

---

## High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    User's Browser                                │
│                                                                  │
│   ┌─────────────────────────────────────────────────────┐       │
│   │              React 18 SPA (Vite 5)                   │       │
│   │                                                      │       │
│   │  ┌────────────┐  ┌────────────┐  ┌───────────────┐  │       │
│   │  │ Zustand    │  │React Router│  │  Tailwind CSS │  │       │
│   │  │ Stores     │  │ v6 Routes  │  │  Components   │  │       │
│   │  └──────┬─────┘  └─────┬──────┘  └───────────────┘  │       │
│   │         │               │                             │       │
│   │         └───────────────▼────────────────────────    │       │
│   │                    Axios HTTP Client                  │       │
│   └───────────────────────┬─────────────────────────────┘       │
└───────────────────────────┼─────────────────────────────────────┘
                            │ HTTP/HTTPS (JSON)
                            │ Authorization: Bearer <JWT>
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Express 4.x API Server (Node 20)                  │
│                      localhost:4000/api                           │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Middleware Chain                         │  │
│  │  cors() → express.json() → morgan() → authMiddleware       │  │
│  │  → validate(zodSchema) → controller → errorMiddleware       │  │
│  └────────────────────────────┬───────────────────────────────┘  │
│                               │                                  │
│  ┌────────────┐  ┌────────────▼──────────────┐  ┌────────────┐  │
│  │  Routes    │  │       Controllers          │  │  Services  │  │
│  │  /auth     │→ │  auth.controller.ts        │→ │ AuthService│  │
│  │  /recipes  │→ │  recipes.controller.ts     │→ │ RecipesSvc │  │
│  │  /ingred.  │→ │  ingredients.controller.ts │→ │ IngredSvc  │  │
│  │  /meal-p.  │→ │  mealPlans.controller.ts   │→ │ PlansSvc   │  │
│  │  /shop-l.  │→ │  shoppingList.controller   │→ │ ShopSvc    │  │
│  │  /health   │→ │  health: inline handler    │  │            │  │
│  └────────────┘  └───────────────────────────┘  └─────┬──────┘  │
│                                                        │         │
│                                                 ┌──────▼──────┐  │
│                                                 │ Drizzle ORM  │  │
│                                                 │ 0.29+        │  │
│                                                 └──────┬───────┘  │
└────────────────────────────────────────────────────────┼────────┘
                                                         │
                                                         │ TCP 5432
                                                         ▼
                                        ┌──────────────────────────┐
                                        │  PostgreSQL 15            │
                                        │  (Docker container)       │
                                        │                           │
                                        │  Tables:                  │
                                        │  • users                  │
                                        │  • recipes                │
                                        │  • ingredients            │
                                        │  • recipe_ingredients     │
                                        │  • meal_plans             │
                                        │  • meal_plan_entries      │
                                        └──────────────────────────┘
```

---

## Tech Stack Summary

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Frontend framework | React | 18.x | Concurrent mode, lazy loading |
| Frontend build | Vite | 5.x | HMR, optimized production bundles |
| Frontend state | Zustand | 4.x | Minimal boilerplate, no context required |
| Frontend routing | React Router | 6.x | Nested routes, lazy pages |
| Frontend CSS | Tailwind CSS | 3.x | Utility-first, no custom CSS files |
| Frontend forms | react-hook-form + Zod | latest | Performant, schema-validated |
| Backend framework | Express | 4.x | Minimal, middleware-first |
| Backend language | TypeScript | 5.x | Strict mode across both layers |
| ORM | Drizzle ORM | 0.29+ | Type-safe, no runtime engine |
| Validation | Zod | 3.x | Shared shape between backend and frontend |
| Database | PostgreSQL | 15 | ACID, UUID, GIN indexes, arrays |
| Auth | jsonwebtoken + bcrypt | 9.x / 5.x | JWT (15m access, 7d refresh), bcrypt 12 rounds |
| Testing | Vitest + Supertest | latest | Unit + integration; Playwright for E2E |
| Container | Docker + Docker Compose | — | PostgreSQL in container, API runs locally in dev |

---

## Request Lifecycle

1. **User action** (e.g., clicks "Save Recipe") triggers an Axios call from the React component
2. **Axios request interceptor** reads `accessToken` from Zustand `authStore` and attaches `Authorization: Bearer <token>`
3. **Express** receives request on port 4000
4. **cors()** validates the `Origin` header (allows `http://localhost:5173` in dev)
5. **express.json()** parses the JSON body; body is available as `req.body`
6. **morgan()** logs the request line for debugging
7. **authMiddleware** verifies JWT signature and expiry. On success, attaches `req.user = { sub, email, name }`. On failure, returns 401.
8. **validate(schema)** runs the Zod schema against `req.body` (or `req.query`). On failure, returns 400 with field-level errors.
9. **Controller** calls the appropriate **Service** method with validated input
10. **Service** implements business logic, calls **Drizzle ORM** queries (parameterized SQL)
11. **Drizzle** executes SQL against PostgreSQL; returns typed result objects
12. **Service** returns the result or throws a typed `AppError` subclass
13. **Controller** formats the JSON response and calls `res.json()`
14. **errorMiddleware** (registered last) catches any thrown `AppError` and maps to the correct HTTP status code + body
15. **Axios response interceptor** on the frontend: if 401 is returned, silently calls `/auth/refresh` to get a new access token, then retries the original request once

---

## Key Architectural Decisions

### Decision 1: Drizzle ORM over Prisma

**Options considered:** Prisma 5.x (industry standard), Drizzle ORM 0.29+, raw SQL with `pg`

**Chosen:** Drizzle ORM

**Rationale:**
- Drizzle has no query engine binary — zero native dependency, works in any environment
- Schema is pure TypeScript (no separate `.prisma` language), enabling better IDE integration
- Drizzle is lighter: ~47KB vs Prisma's multi-MB engine
- SQL-like query builder makes generated queries predictable and debuggable
- Drizzle Kit generates SQL migrations as plain `.sql` files (easy to inspect and audit)

**Trade-off:** Drizzle is newer and has a smaller community than Prisma. Some complex query patterns require more verbose code.

---

### Decision 2: Zustand over Redux or React Context

**Options considered:** Redux Toolkit, React Context + useReducer, Zustand 4.x, Jotai

**Chosen:** Zustand

**Rationale:**
- Minimal boilerplate: a store is a single TypeScript function with no actions/reducers/selectors split
- Built-in persistence middleware (used for `refreshToken` in localStorage)
- Excellent TypeScript inference without extra configuration
- Small bundle size (~3KB gzipped)
- Selectors work naturally without `createSelector` boilerplate

**Trade-off:** No DevTools as powerful as Redux DevTools. For MealMap's simple global state (auth, recipes, meal plans), this is acceptable.

---

### Decision 3: Stateless JWT (no refresh token DB storage)

**Options considered:** Store refresh tokens in DB (invalidatable), stateless JWT (signed, not stored), Redis-based session

**Chosen:** Stateless JWT (refresh tokens not stored in DB)

**Rationale:**
- MealMap v1 has no admin "revoke all sessions" requirement
- Simpler implementation — no additional DB table or Redis dependency
- For a personal recipe app, the security tradeoff (can't revoke tokens early) is acceptable
- 15-minute access token window limits exposure if a token is compromised

**Trade-off:** Logout only removes tokens from the client side. A stolen refresh token remains valid for up to 7 days. Acceptable for v1 — add DB-stored refresh tokens in v2 if needed.

---

### Decision 4: Shopping List Generated Server-Side (not client-side)

**Options considered:** Calculate aggregation in the browser from cached recipe data, generate in Express service, pre-compute and cache in PostgreSQL

**Chosen:** Server-side generation per request (no caching)

**Rationale:**
- Aggregation logic (scale by servingsOverride, sum by unit, group by category) requires joining multiple tables
- Ensuring freshness: regenerating on every request guarantees the list reflects the latest meal plan state
- The data volume is small (< 50 ingredients in any realistic meal plan), so p95 < 300ms without caching
- No cache invalidation complexity

**Trade-off:** Slightly slower than a cached result. Acceptable for v1.

---

## Non-Functional Requirements Summary

| Requirement | Target | Implementation |
|-------------|--------|----------------|
| API p95 response | < 300ms (list), < 100ms (single) | Indexes on user_id, is_deleted, recipe_id |
| Frontend LCP | < 2.5s | Code splitting, lazy pages, image lazy load |
| Security: passwords | bcrypt 12 rounds | ~150ms hash time is intentional |
| Security: queries | No SQL injection | Drizzle parameterized queries |
| Security: auth | JWT HS256, 15m expiry | authMiddleware on all protected routes |
| Test coverage | ≥ 70% lines | Vitest with @vitest/coverage-v8 |
| Mobile responsive | Tailwind breakpoints | sm:, md:, lg: prefixes throughout |

---

## Deployment Model (Development)

```
Host machine:
├── Docker: postgres:15-alpine (port 5432)
├── Node 20: Express API (port 4000) — npm run dev
└── Node 20: Vite dev server (port 5173) — npm run dev

Frontend dev proxy (vite.config.ts):
  /api → http://localhost:4000/api  (avoids CORS in dev)

Production (future):
  Both served behind Nginx or a PaaS (Render, Fly.io)
```

---

*This document is updated after each sprint. Last updated: Sprint 0.*
