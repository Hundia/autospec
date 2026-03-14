# Architecture Review — MealMap

**Date:** 2026-03-14
**Reviewer:** Architecture Review Agent (Sprint 23, Ticket 23.3)
**Files Reviewed:**
- `examples/mealmap/specs/02_backend_lead.md` (984 lines)
- `examples/mealmap/specs/04_db_architect.md` (780 lines)
- `examples/mealmap/docs/architecture.md` (213 lines)
- `examples/mealmap/docs/api.md` (460 lines)
- `examples/mealmap/api/src/app.ts`
- `examples/mealmap/api/src/index.ts`
- `examples/mealmap/api/src/routes/health.routes.ts`
- `examples/mealmap/api/src/routes/index.ts`
- `examples/mealmap/api/src/db/connection.ts`
- `examples/mealmap/api/src/db/schema/*.ts` (all 6 schema files + index)
- `examples/mealmap/api/src/middleware/auth.middleware.ts`
- `examples/mealmap/api/src/middleware/validate.middleware.ts`
- `examples/mealmap/api/src/middleware/error.middleware.ts`
- `examples/mealmap/api/src/config/env.ts`
- `examples/mealmap/api/src/types/errors.ts`
- `examples/mealmap/api/src/types/express.d.ts`
- `examples/mealmap/api/src/utils/jwt.ts`
- `examples/mealmap/api/src/utils/hash.ts`

---

## Scores

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Completeness | 9/10 | All 6 tables defined, all 17 endpoints specified with full request/response JSON, all middleware described, performance targets included. Minor gap: no rate limiting specified in specs, and `PUT /recipes/:id` ingredient update strategy (replace vs. merge) is only described in prose, not a JSON example. |
| Specificity | 9/10 | Concrete Drizzle schema code is provided in `specs/04_db_architect.md` (not just prose descriptions), actual Zod schemas with exact constraints in `specs/02_backend_lead.md`, real service method signatures with algorithm pseudocode. Closest to production-ready specs seen in practice. |
| Consistency | 8/10 | Spec, docs, and generated code agree on all core patterns. One notable divergence: the spec (`specs/02_backend_lead.md`, section 2) lists `bcrypt` as the password library while the generated code at `api/src/utils/hash.ts` uses `bcryptjs`. The `errorMiddleware` in `app.ts` is inlined rather than imported from `middleware/error.middleware.ts`, creating two implementations of the same handler. |
| Actionability | 9/10 | A developer could implement Sprint 1 (auth + recipes) directly from `specs/02_backend_lead.md` without guesswork. Every service method is named, every SQL query pattern is shown, every Zod schema is complete. The shopping list aggregation algorithm (section 10) is detailed enough to implement without interpretation. The one missing piece is pagination for the ingredients endpoint — it is listed as returning `{ "data": [...] }` without a pagination wrapper, which is a deliberate choice but not explicitly flagged as intentionally unpaginated. |
| Quality | 8/10 | Architecture decisions are justified with trade-offs (Drizzle vs Prisma, stateless JWT, server-side shopping list). The generated Sprint 0 code is production-quality: `helmet()` included (not in spec), `ALLOWED_ORIGINS` configurable via env (spec showed hardcoded localhost), graceful SIGTERM/SIGINT shutdown in `index.ts`. Relations are centralized in `schema/index.ts` to avoid circular imports — a practical improvement over the per-file relations shown in the spec examples. |
| **Average** | **8.6/10** | |

---

## Key Findings

### Finding 1: Helmet Added in Code but Absent from Spec — Good Surprise, But Creates Doc Debt

The generated `api/src/app.ts` (line 13) applies `helmet()` as the first middleware, which sets security headers (X-Frame-Options, HSTS, CSP, etc.). This is correct and desirable.

However, `specs/02_backend_lead.md` section 8 ("Middleware Chain") describes the chain as:
```
cors() → express.json() → morgan('dev')
```

`helmet` is not mentioned anywhere in the spec, `docs/architecture.md`, or `docs/api.md`. A developer reading only the spec would not know helmet is expected or installed. If a future agent regenerates `app.ts` strictly from the spec, helmet will be dropped silently.

The same issue applies to `ALLOWED_ORIGINS`: the env spec (section 11) hardcodes `http://localhost:5173` in the example comment, but the generated `config/env.ts` (line 15) makes it a Zod-validated env var with a default. The actual implementation is more flexible, but the spec does not reflect this.

**Recommendation:** Add `helmet()` to the middleware chain diagram in `specs/02_backend_lead.md` section 8, and document the `ALLOWED_ORIGINS` env var in section 11.

---

### Finding 2: Duplicate Error Handler — Spec Shows Import, Code Inlines

`specs/02_backend_lead.md` section 9 specifies the global error handler as a function in `src/middleware/error.middleware.ts`, and the directory structure in section 3 lists that file. The implementation correctly creates `api/src/middleware/error.middleware.ts` with the `errorMiddleware` function (24 lines, correct logic).

However, `api/src/app.ts` (lines 44–58) contains a second, inline `ErrorRequestHandler` that duplicates the logic — it is not the imported `errorMiddleware` from the middleware file. The `error.middleware.ts` file exists but is **never imported or used** anywhere in the generated Sprint 0 code.

This creates two problems:
1. Any future bug fix applied to `error.middleware.ts` will not affect the live app.
2. A developer adding routes in Sprint 1 who reads the spec will import `errorMiddleware` from the middleware file, not knowing the app already has a different handler registered in `app.ts`.

**Recommendation:** In `app.ts`, replace the inline handler with `import { errorMiddleware } from './middleware/error.middleware.js'` and `app.use(errorMiddleware)`. The middleware file should be the single source of truth.

---

### Finding 3: `bcrypt` vs `bcryptjs` — Spec-Code Mismatch in Dependency

`specs/02_backend_lead.md` section 2 (tech stack table) specifies `bcrypt` version `5.x` as the password library. The generated `api/src/utils/hash.ts` (line 1) imports from `bcryptjs`, which is a pure-JavaScript port — not the same npm package.

This is a reasonable real-world substitution (`bcryptjs` avoids native binding compilation issues in CI environments and Docker images), but it is an undocumented deviation. The spec's tech stack table is the authoritative reference for dependency decisions. If a QA spec references bcrypt-specific mocking patterns (e.g., `vi.mock('bcrypt', ...)`), tests would fail because the actual import path differs.

**Recommendation:** Update `specs/02_backend_lead.md` section 2 to list `bcryptjs` and explain the portability rationale, or document the substitution in `docs/architecture.md` as a decision record (alongside the existing Decision 1–4 entries).

---

### Finding 4: Circular Import Risk in Spec Schema Examples — Resolved by Code, Not Documented

`specs/04_db_architect.md` sections 3.3 and 3.4 define `recipesRelations` inline in `recipes.ts` and `recipeIngredientsRelations` inline in `recipeIngredients.ts`. Since `recipes.ts` imports from `recipeIngredients.ts` for the relation type, and `recipeIngredients.ts` imports from `recipes.ts` for the same reason, the spec's code samples would create a circular import at module evaluation time in Node.js ESM.

The generated code correctly identifies and solves this: `api/src/db/schema/recipes.ts` (line 40) leaves a comment "Relations are defined in schema/index.ts to avoid circular imports," and all six relation definitions are centralized in `api/src/db/schema/index.ts` (lines 11–50).

This is a genuine improvement over the spec. However, the spec's code samples remain misleading for any developer who tries to implement directly from them. The spec acts as the source of truth and it currently prescribes a pattern that would produce broken code.

**Recommendation:** Update `specs/04_db_architect.md` section 3 to show the centralized relations pattern (barrel-export from `index.ts`), or add a callout warning about the circular import risk and pointing to `index.ts` as the correct location.

---

### Finding 5: `updatedAt` Not Auto-Updated — Drizzle Behavior Undocumented

`specs/04_db_architect.md` sections 3.3 and 3.5 define `updatedAt` fields on `recipes` and `meal_plans` with `.defaultNow()`. The generated schema correctly defines the column default.

However, Drizzle ORM does not automatically update `updatedAt` on `UPDATE` statements the way Prisma's `@updatedAt` directive does. The spec's `MealPlansService.activateMealPlan` query pattern in section 6 explicitly sets `updatedAt: new Date()` in the update payload, demonstrating that the spec author was aware of this. But `RecipesService.updateRecipe` (section 10, table row) has no such note, and none of the other UPDATE patterns explicitly mention it.

A Sprint 1 agent implementing `updateRecipe` and following the spec table literally — without noticing the `activateMealPlan` example — will produce code where `updatedAt` silently stays stale on all recipe edits. This is a data integrity issue that will be invisible until a user notices their "last updated" timestamp never changes.

**Recommendation:** Add a prominent note in `specs/04_db_architect.md` (section 6 or section 8) stating: "Drizzle does not auto-update `updatedAt`; all UPDATE calls must explicitly include `updatedAt: new Date()` in the set payload."

---

## Strengths

**Exceptional contract depth.** `specs/02_backend_lead.md` provides both the API table (method, path, auth, description) and full JSON request/response examples for every endpoint. This dual format means a developer can grep for an endpoint name and immediately see both the shape and a concrete example — this is better than the majority of real-world internal API specs.

**Schema as executable TypeScript.** Rather than describing the database in prose or ERD diagrams only, `specs/04_db_architect.md` provides copy-paste Drizzle schema code that is immediately executable (modulo the circular import issue in Finding 4). The SQL migration reference in section 4 provides a second representation for cross-checking, and both agree exactly on column names, types, constraints, and defaults.

**Index rationale documented.** Every index in `specs/04_db_architect.md` section 5 is followed by a comment explaining which query it optimizes, and section 5 ends with a summary table mapping each index to its query. This is rarely seen in specs but invaluable when diagnosing slow queries later. The partial indexes (`WHERE is_deleted = false`, `WHERE is_active = true`) are particularly well-chosen.

**Performance targets are concrete.** `specs/02_backend_lead.md` section 12 gives p50/p95/p99 targets per endpoint category, including the deliberate note that auth endpoints are slow due to bcrypt. This prevents a future developer from filing a performance bug against expected behavior.

**Generated code exceeds spec quality in several areas.** Sprint 0 adds `helmet()`, makes CORS origins configurable via env, implements graceful shutdown with SIGTERM/SIGINT handlers, separates access and refresh token signing/verification into named functions (spec showed generic `signToken`/`verifyToken`), and centralizes Drizzle relations to avoid circular imports. All are correct improvements.

**Soft delete policy is explicit and complete.** `specs/04_db_architect.md` section 8 states clearly which tables use hard delete vs. soft delete, the rationale for each decision, and the edge case of soft-deleted recipes still referenced by meal plan entries (with the UI behavior: "Recipe unavailable"). This prevents a common class of data integrity bugs.

**Architectural decisions are justified.** `docs/architecture.md` (Decision 1–4) documents the reasoning and trade-offs behind Drizzle vs. Prisma, Zustand vs. Redux, stateless JWT, and server-side shopping list generation. This is the correct level of documentation for decisions that new team members will question.

---

## Gaps and Improvement Opportunities

1. **Rate limiting absent from auth endpoints.** Neither the spec, docs, nor generated code mentions rate limiting. `POST /auth/login` is the obvious brute-force target. Even a statement like "add rate limiting in v2 using express-rate-limit" in the spec would clarify intent and prevent a security review flag.

2. **Refresh token reuse not addressed.** `docs/architecture.md` Decision 3 documents stateless JWT and the acceptable risk of no early revocation. However, it does not address what happens if a refresh token is presented twice (e.g., after a man-in-the-middle intercept). Since tokens are stateless, both uses succeed. This is known-acceptable for v1 but should be called out explicitly rather than silently.

3. **`PUT /recipes/:id` ingredient update strategy under-specified.** Section 10 states `updateRecipe` "replaces ingredient associations," but there is no JSON example for a PUT request that changes ingredients, and no discussion of what happens to the old `recipe_ingredients` rows. The `updateRecipeSchema` uses `.partial()` making `ingredients` optional — does omitting `ingredients` keep existing associations or clear them? This will cause an implementation decision that could go either way without specification guidance.

4. **Index CREATE statements absent from migration SQL.** The index DDL in `specs/04_db_architect.md` section 5 is presented separately from the migration SQL in section 4. A developer running only the migration script would get a working schema with no indexes, leading to unexpectedly poor performance in load tests. The indexes should be part of the migration, not a separate SQL block.

5. **`JwtPayload` exported from a `.d.ts` file.** `api/src/types/express.d.ts` both augments the Express `Request` interface and exports the `JwtPayload` interface. The `jwt.ts` utility uses `import type { JwtPayload } from '../types/express.js'`. This pattern works with `import type` but is semantically confusing — declaration files augment global types, they are not the conventional location for application-specific type exports. A separate `types/jwt.ts` would be cleaner and easier to locate.

6. **Ingredients list intentionally unpaginated — not documented as a decision.** `GET /ingredients` returns `{ "data": [...] }` with no pagination. This is probably deliberate (global ingredient table, shared across all users, bounded in size). However, unlike the four explicit decision records in `docs/architecture.md`, this is not documented as a deliberate choice. A future developer may add unnecessary pagination or open a consistency bug ticket.

---

## Code Quality Assessment

The Sprint 0 generated code is high quality for a project foundation. Key observations:

**Correct prototype chain fix in custom errors.** `api/src/types/errors.ts` (line 18) calls `Object.setPrototypeOf(this, new.target.prototype)` in the `AppError` constructor. This is a subtle but important step often missing from TypeScript custom error classes — without it, `instanceof AppError` checks fail in transpiled code targeting older ES versions. Its presence here indicates attention to TypeScript-specific runtime behavior.

**ESM-first import style.** All imports use `.js` extensions (e.g., `'./config/env.js'`) which is correct for Node.js native ESM with TypeScript source files. This is consistent across all reviewed files.

**Testability by design.** `createApp()` is exported as a factory from `app.ts`, separate from the server start in `index.ts`. This is the correct pattern for Supertest-based integration tests — the test can call `createApp()` and pass the result to `supertest()` without binding a port.

**Env validation pattern.** `config/env.ts` uses `safeParse` with structured error output and `process.exit(1)` on invalid configuration. This is the correct 12-factor behavior — fail fast at startup rather than failing at the first request that uses the invalid env var.

**JWT helper improvements over spec.** `utils/jwt.ts` correctly separates `signAccessToken`/`signRefreshToken` (using different secrets) and `verifyAccessToken`/`verifyRefreshToken`. The spec (section 6, auth middleware) showed a single generic `verifyToken` function. The separate functions with separate secrets in the generated code are safer.

**Minor redundancy in `auth.middleware.ts`.** Lines 11–14 check `!authHeader?.startsWith('Bearer ')`, which returns true both when the header is absent and when it does not start with "Bearer ". If the check passes (header starts with "Bearer "), lines 17–20 check `!token` again — which can only be true if the token is an empty string after "Bearer " (e.g., `"Bearer "`). This second check is nearly dead code but harmless; a comment would clarify intent.

---

## Verdict

This is a well-architected, thoroughly specified system. The specs cross the threshold from "architectural guidance" into "implementation blueprint," which is the correct goal for SDD. A mid-level developer could implement all Sprint 1 and Sprint 2 features directly from `specs/02_backend_lead.md` and `specs/04_db_architect.md` without asking clarifying questions — the hardest test for a spec to pass, and one that most project specs fail.

The two issues requiring prompt attention are:

1. **The duplicate error handler** (`app.ts` lines 44–58 vs `middleware/error.middleware.ts`) — `error.middleware.ts` is dead code in Sprint 0. Any Sprint 1 agent that imports and registers it per the spec will have two error handlers registered, with undefined precedence. Fix: replace the inline handler in `app.ts` with an import.

2. **The `updatedAt` auto-update assumption** (Finding 5) — if Sprint 1 implements `updateRecipe` without explicitly setting `updatedAt: new Date()`, timestamps will silently stale. Fix: add a one-sentence note to the spec.

The spec-code divergences (bcrypt vs bcryptjs, helm et missing from middleware chain, CORS origins hardcoded in spec but configurable in code) are documentation debt rather than functional bugs, but they erode the spec's role as the authoritative source of truth. In SDD, the spec is the contract — code that improves on the spec should drive a spec update, not the reverse.

The database schema design is particularly strong: appropriate normalization (shared ingredients table avoids duplication), correct soft-delete strategy for recipes, GIN index for tag array containment queries, partial indexes for common filter patterns, and transactions for the activate-plan operation. These are not defaults — they require deliberate design decisions.

**Overall rating: 8.6/10 — Production-ready spec foundation with a critical dead-code issue and three documentation gaps that must be addressed before Sprint 1 agents are briefed.**
