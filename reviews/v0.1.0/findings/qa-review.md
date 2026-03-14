# QA Coverage Review — MealMap

**Date:** 2026-03-14
**Reviewer:** QA Review Agent (Sprint 23, Ticket 23.5)
**Files Reviewed:**
- `/opt/FitnessAiManager/autospec/examples/mealmap/specs/05_qa_lead.md` — QA Lead specification (1116 lines)
- `/opt/FitnessAiManager/autospec/examples/mealmap/specs/backlog.md` — Sprint backlog (QA tickets: 0.10, 1.9, 1.10, 2.6, 2.8)
- `/opt/FitnessAiManager/autospec/examples/mealmap/api/package.json` — API dependencies and test scripts
- `/opt/FitnessAiManager/autospec/examples/mealmap/api/vitest.config.ts` — Backend Vitest configuration
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/package.json` — Web dependencies and test scripts
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/vitest.config.ts` — Frontend Vitest configuration
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/test/setup.ts` — Frontend test setup file
- `/opt/FitnessAiManager/autospec/examples/mealmap/api/src/` — Source tree (services absent post-Sprint 0)

---

## Scores

| Dimension | Score | Notes |
|-----------|-------|-------|
| Completeness | 8/10 | Spec covers all major test types and services with detail; config files exist; actual test files are absent post-Sprint 0 |
| Specificity | 9/10 | Concrete mock data with real UUIDs, specific assertion values (3.0 cups, 600g scaled), named error types; one placeholder test (search filter) is a gap |
| Consistency | 7/10 | Coverage thresholds in spec (≥85% for critical services) are stricter than what the actual vitest.config.ts enforces (no thresholds configured at all); setup.ts in spec differs from the minimal setup.ts that was actually created |
| Actionability | 8/10 | Tests could be copy-pasted from the spec with minor adaptation; integration test setup requires a separate test DB which the spec documents but the config does not enforce |
| Quality | 9/10 | Well-organized, logical flow from unit → integration → E2E → security; OWASP checklist and performance benchmarks add professional depth |
| **Average** | **8.2/10** | Strong specification, significant implementation gap at Sprint 0 completion |

---

## Findings

### Finding 1: Zero Test Files Exist — All Test Coverage Is Spec-Only

**Severity:** High

**Evidence:** Glob searches of `examples/mealmap/api/tests/`, `examples/mealmap/web/tests/`, and `examples/mealmap/e2e/` return no results. The only test-related file created during Sprint 0 is `web/src/test/setup.ts`, which contains a single line: `import '@testing-library/jest-dom';`. No unit tests, no integration tests, and no E2E test files exist anywhere in the project source tree (excluding `node_modules`).

**Impact:** The QA spec (`05_qa_lead.md`) contains ~700 lines of detailed, runnable test code for RecipesService, ShoppingListService, auth endpoints, recipe CRUD, and shopping list aggregation. None of it has been instantiated as actual files. The Sprint 0 summary's QA Results section reports TypeScript compilation passing and the health route working, but makes no claim that any tests were written or run — because ticket 0.10 only required docs scaffold, not test implementation. Tests are deferred entirely to Sprint 1 (ticket 1.9) and Sprint 2 (ticket 2.6), which are both status 🔲 (not started).

**Recommendation:** The orchestrator should treat ticket 1.9 as a prerequisite blocker for marking Sprint 1 complete. When the agent executes Sprint 1, it must create the actual files at the paths defined in the spec: `api/tests/unit/recipes.service.test.ts`, `api/tests/unit/auth.service.test.ts`, `api/tests/integration/auth.test.ts`, `api/tests/integration/recipes.test.ts`, etc. The spec content is ready to drop in — the gap is solely file creation.

---

### Finding 2: Vitest Config Does Not Enforce Coverage Thresholds

**Severity:** Medium

**Evidence:** The `api/vitest.config.ts` that was actually created in Sprint 0 (`/opt/FitnessAiManager/autospec/examples/mealmap/api/vitest.config.ts`) configures coverage with `provider: 'v8'` and reporters `['text', 'html']`, but contains **no `thresholds` block**. The QA spec (`05_qa_lead.md`, section 5) defines a precise threshold configuration:

```typescript
thresholds: {
  lines: 70,
  branches: 65,
  functions: 70,
  statements: 70,
},
```

The spec also sets per-service targets (≥85% lines for `recipes.service.ts`, ≥90% for `shoppingList.service.ts`) which are not enforceable via standard Vitest thresholds without a custom reporter. Similarly, the web `vitest.config.ts` has no thresholds, and also omits the `setupFiles` reference — though a `web/src/test/setup.ts` file does exist, it is not wired into the config, meaning `@testing-library/jest-dom` matchers would not be available when tests run.

**Impact:** Tests can pass with 0% coverage and CI/CD will not fail. The coverage targets in the spec become aspirational rather than enforced gates.

**Recommendation:** The Sprint 1 agent should update both `api/vitest.config.ts` and `web/vitest.config.ts` to match the spec's threshold configuration. The web config also needs `setupFiles: ['./src/test/setup.ts']` added (it is present in the spec's proposed config but missing from the implemented file).

---

### Finding 3: One Test in the Spec Is a Placeholder (Fails Its Own QA Standard)

**Severity:** Medium

**Evidence:** In `05_qa_lead.md`, section 6, within the `listRecipes` describe block, the following test appears:

```typescript
it('applies title search filter (case-insensitive)', async () => {
  const mockIlike = vi.fn();
  // Assertion: the SQL query includes an ilike condition
  // Implementation detail tested via integration test
  expect(true).toBe(true); // Placeholder — integration tests cover this
});
```

This test always passes regardless of implementation. It exists because mocking Drizzle ORM's `ilike` condition is difficult at the unit level, and the spec acknowledges it defers to integration tests. However, the spec does not include a corresponding integration test that explicitly verifies case-insensitive search behavior — the `recipes.test.ts` integration scenarios cover create, auth guard, validation errors, and soft-delete, but not search filter behavior.

**Impact:** The search-filter path (`?search=` query param) is tested neither at the unit level (placeholder) nor explicitly at the integration level. This is a gap in a feature that the product manager spec (`01_product_manager.md`) lists as a core requirement (recipe search by title).

**Recommendation:** Remove the placeholder unit test. Add an explicit integration test case to `api/tests/integration/recipes.test.ts` that creates two recipes with different titles, calls `GET /api/recipes?search=<term>`, and asserts only the matching recipe is returned.

---

### Finding 4: No Component-Level Frontend Tests in the Spec for the RecipeForm Organism

**Severity:** Medium

**Evidence:** The QA spec (section 4, file naming conventions) lists four frontend component test files: `RecipeCard.test.tsx`, `MealSlot.test.tsx`, `IngredientRow.test.tsx`, and `ShoppingList.test.tsx`. No test file is listed for `RecipeForm` — the most complex frontend component (`specs/03_frontend_lead.md` describes it as an organism with dynamic ingredient rows via `useFieldArray`, autosuggest, tag input, nutrition panel, and conditional edit vs. create behavior).

The frontend utility tests for `scaleIngredients` and `formatQuantity` are well-specified and detailed. But the component test gap for `RecipeForm` is a meaningful omission: the AutoSpec project's own CLAUDE.md cites a real-world bug pattern (B.39/B.49 incident) where form → API field mapping bugs are missed because tests bypass the form layer.

**Impact:** The most error-prone frontend component (dynamic form with ingredient autosuggest and scaling calculations) has no specified test coverage. A user can submit a recipe with wrong field mappings or broken ingredient row state and no test will catch it.

**Recommendation:** Add `web/tests/components/RecipeForm.test.tsx` to the spec covering: adding/removing ingredient rows, form validation error display, pre-population of fields on edit, and the submit payload shape (verify the correct field names reach the API call mock).

---

### Finding 5: E2E Tests Depend on Pre-Seeded Data Without a Guaranteed Seed Step

**Severity:** Low

**Evidence:** E2E Scenario 2 (`e2e/mealPlan.spec.ts`, section 8) logs in as `jamie@mealmap.example` — a seeded demo user — and assumes pre-existing recipes exist for the recipe picker. The Playwright config (`e2e/playwright.config.ts`) shown in the spec does not include a `globalSetup` file to run the seed script before tests. The seed script (`api/scripts/seed.ts`) is specified in ticket 2.7 (Sprint 2, status 🔲) and the `docs/setup.md` documents it as an optional step run manually.

**Impact:** E2E tests will fail on a fresh environment where seeding has not been manually performed. This creates a dependency on environment state that violates test isolation principles and will cause CI failures.

**Recommendation:** Add a `globalSetup` to `playwright.config.ts` that runs the seed script against the test database before the E2E suite begins. Alternatively, make E2E Scenario 2 self-contained by having it register a new user and create recipes programmatically (as Scenario 1 does), removing the dependency on `jamie@mealmap.example`.

---

## Detailed Assessment

### Test Pyramid

The spec defines the target pyramid as 70% unit / 20% integration / 10% E2E — a standard and healthy distribution weighted toward fast, isolated tests. The specification content reflects this intent well:

- **Unit tests:** 4 backend service files + 2 frontend utility files are fully specified with realistic mock data. The ShoppingListService tests are the strongest — 5 discrete scenarios covering the core aggregation algorithm with specific numerical assertions (3.0 cups, 600g scaling).
- **Integration tests:** 5 integration test files are specified (auth, recipes, ingredients, mealPlans, shoppingList). Auth and recipe integration tests are written in detail. The `ingredients.test.ts` and `mealPlans.test.ts` files are listed in the conventions section but have no test body content in the spec — they are mentioned but not elaborated.
- **E2E tests:** 2 of 4 planned scenarios have detailed step-by-step Playwright code. The other two (`auth.spec.ts` and `shoppingList.spec.ts`) are named in the conventions but contain no test body in the spec.

**Current state:** The pyramid exists entirely on paper. No layer has any implemented files.

### Scenario Completeness

| Flow | Unit Spec | Integration Spec | E2E Spec | Status |
|------|-----------|------------------|----------|--------|
| Register / Login | AuthService (implied, not written) | auth.test.ts ✅ detailed | recipes.spec.ts step 1 ✅ | Spec complete |
| Create Recipe | RecipesService.createRecipe | recipes.test.ts ✅ detailed | recipes.spec.ts steps 2-5 ✅ | Spec complete |
| Recipe search/filter | Placeholder test only | Not explicitly covered | Not covered | Gap |
| Soft delete | RecipesService.deleteRecipe ✅ | recipes.test.ts ✅ | Not covered | Spec adequate |
| Shopping list generation | ShoppingListService ✅ 5 scenarios | shoppingList.test.ts ✅ | mealPlan.spec.ts ✅ | Spec complete |
| Meal plan activation | Not specified | mealPlans.test.ts (listed, no body) | mealPlan.spec.ts (activate button) | Gap |
| Cross-user access | Not in unit spec | Cross-user test ✅ (security section) | Not covered | Spec adequate |
| Token refresh | Not specified | Not specified | Not specified | Gap |

The token refresh flow — where an expired access token triggers a silent refresh using the refresh token — is a critical path handled by the Axios interceptor in `web/src/api/client.ts`. It is entirely absent from the test spec. If the refresh interceptor breaks, all authenticated sessions silently fail after 15 minutes.

### Coverage Targets

The coverage targets in `05_qa_lead.md` section 2 are realistic and well-calibrated:

- **Backend overall ≥70%** — achievable when unit + integration tests are written
- **`shoppingList.service.ts` ≥90%** — appropriate; this is the most algorithmically complex service and the one most likely to have edge-case bugs (unit aggregation, decimal arithmetic)
- **`auth.service.ts` ≥85%** — appropriate for security-critical code
- **Frontend components ≥60%** — intentionally lower; the spec acknowledges component testing is harder and a 60% floor is pragmatic
- **Frontend utilities ≥90%** — correct; pure functions like `scaleIngredients` and `formatQuantity` should be near-100% testable

The gap is enforcement: the actual `vitest.config.ts` files have no threshold blocks. Without thresholds, coverage reports are informational only and cannot gate PRs or CI runs.

### Gap Analysis

**Specified but not tested:**
1. `AuthService.register` / `AuthService.login` — unit test file is listed in spec conventions but no test body is written for it (the integration tests cover the HTTP layer, but not the service in isolation)
2. `MealPlansService` — unit test file listed, no content specified
3. `IngredientsService` — no unit or integration test content specified beyond a file name reference
4. Token refresh happy path and retry logic
5. Recipe search/filter (ilike query) — explicitly deferred to integration but integration scenario is missing

**Critical paths missing from spec entirely:**
1. Concurrent duplicate booking — meal plan entries have a `UNIQUE(meal_plan_id, date, meal_type)` constraint; the 409 conflict test is mentioned in ticket 2.2 description but not written in the spec
2. JWT expiry edge cases — spec OWASP checklist mentions expired JWT test but no test code is provided
3. Decimal precision in shopping list — quantities are stored as `decimal(10,2)`; floating-point rounding in aggregation (e.g., 0.1 + 0.2 ≠ 0.3) is not addressed in test scenarios

**What is tested well by the spec:**
- Shopping list aggregation algorithm (5 unit scenarios)
- Recipe ownership isolation (cross-user 404 test)
- Soft delete visibility (confirmed in list + direct GET)
- Password validation rules (multiple edge cases)
- Ingredient auto-creation on recipe POST

### Test Data Strategy

The spec defines a clear test data approach:

**Unit tests:** Inline mock objects with real-looking UUIDs (e.g., `'a1b2c3d4-e5f6-7890-abcd-ef1234567890'`) and domain-realistic values (Lemon Herb Chicken, All-purpose flour, 800g chicken breast). Mock isolation via `vi.mock('../../src/db/connection')`. The mock structure is appropriate for Drizzle ORM's query builder pattern.

**Integration tests:** A `clearDatabase()` utility is fully specified in `api/tests/setup.ts` with the correct deletion order respecting foreign key constraints (entries → plans → recipeIngredients → recipes → ingredients → users). A `registerAndGetToken()` helper reduces test setup boilerplate. Each `describe` block uses `beforeEach` to clear and re-seed, ensuring test isolation.

**E2E tests:** The `jamie@mealmap.example` pre-seeded user is used in Scenario 2, creating implicit environment dependency (see Finding 5). Scenario 1 uses a unique email via `Date.now()` suffix, which is good practice. No `globalSetup` is specified to guarantee seed state.

**Missing:** No fixture factories or builder patterns are specified. For Sprint 2 integration tests that require multi-step setup (user + 2 recipes + plan + 2 entries before the actual test assertion), a `recipeFactory` or `planFactory` helper would significantly reduce duplication. The spec does not mention this, though the integration test in section 7 does inline the full setup chain.

The seed script (`api/scripts/seed.ts`, ticket 2.7) is documented in `docs/setup.md` with demo credentials and expected data volume (2 users, 20 ingredients, 10 recipes, 1 active plan with 5 entries). This is well-specified for manual development use, but its relationship to the test suite is not formalized — it is not referenced from `tests/setup.ts` or the Playwright global setup.

---

## Summary

The MealMap QA specification (`05_qa_lead.md`) is a high-quality, actionable document that defines a complete test strategy: realistic unit tests with precise assertions, integration tests with proper database isolation, E2E flows covering the primary user journey, an OWASP security checklist, and performance benchmarks. The spec content is detailed enough that tests could be created by directly instantiating the code blocks into their specified file paths. However, as of Sprint 0 completion, zero test files exist in the project — all QA work is deferred to tickets 1.9 and 2.6, which are unstarted. The implemented Vitest configuration files also diverge from the spec by omitting coverage thresholds and the frontend setup file reference, meaning that when tests are eventually written, coverage gates will not be enforced automatically. The most significant gaps in the spec itself are the absent `AuthService` unit tests, the missing recipe search integration test, and the lack of a token refresh test for the Axios interceptor.
