# Frontend/UX Review — MealMap

**Date:** 2026-03-14
**Reviewer:** Frontend Review Agent
**Files Reviewed:**
- `/opt/FitnessAiManager/autospec/examples/mealmap/specs/03_frontend_lead.md` (757 lines)
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/App.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/components/layout/Layout.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/components/layout/Sidebar.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/components/layout/Header.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/components/primitives/Card.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/components/primitives/Badge.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/components/charts/AnimatedCounter.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/components/charts/ProgressRing.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/pages/DashboardPage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/pages/BacklogPage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/pages/SpecsPage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/pages/DocsPage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/pages/ArchitecturePage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/pages/DesignSystemPage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/data/backlog.ts`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/data/specs.ts`
- `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/data/docs.ts`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/App.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/components/atoms/Button.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/components/atoms/Badge.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/components/atoms/Card.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/components/layout/AppLayout.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/components/layout/Sidebar.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/pages/auth/LoginPage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/pages/recipes/RecipeListPage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/pages/recipes/RecipeDetailPage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/pages/recipes/CreateRecipePage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/pages/meal-plans/MealPlanListPage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/pages/meal-plans/MealPlanCalendarPage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/pages/shopping/ShoppingListPage.tsx`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/stores/authStore.ts`
- `/opt/FitnessAiManager/autospec/quickstart/06-viewer.md`

---

## Scores

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Completeness | 6/10 | Spec is exhaustive (14 sections, 757 lines). Viewer delivers 6 of 10 required pages. Web app is intentionally Sprint 0 skeletal — only atoms and layout are implemented; all feature pages are stubs. |
| Specificity | 9/10 | Spec includes exact TypeScript interfaces, Zod schema patterns, complete routing table with lazy-load code, utility function implementations (scaleIngredients, formatQuantity), Axios interceptor code, and explicit Tailwind class tables. Developer could start writing code immediately from this doc. |
| Consistency | 8/10 | Brand color tokens (#22c55e brand-500) match across spec, viewer DesignSystemPage, and web Button/Badge. Routing table in spec matches web/src/App.tsx exactly. Store interfaces in spec match authStore.ts structure. Minor divergence: viewer uses light palette instead of the dark-slate theme from quickstart/06-viewer.md. |
| Actionability | 9/10 | Every key interface is typed, every form has a Zod schema, every API call has an error pattern, every store has method signatures. The spec is a direct implementation blueprint. |
| Quality | 7/10 | Viewer primitives (Card, Badge, AnimatedCounter, ProgressRing) are clean and polished. Dashboard has real Recharts charts with dynamic cell coloring. BacklogPage kanban/table toggle is practical. App atoms (Button, Input, Card) match spec interfaces. Missing: Header in AppLayout, react-markdown in viewer, ReactFlow for architecture. |
| **Average** | **7.8/10** | Strong spec; viewer is 60% complete; app is correctly Sprint 0 scoped. |

---

## Key Findings

### Finding 1 — CRITICAL: Viewer Missing 4 of 10 Required Pages

**Severity:** High

The `quickstart/06-viewer.md` specification (section 7.2, page list) requires 10 pages: DashboardPage, DesignSystemPage, SpecsPage, DocsPage, BacklogPage, WorkflowsPage, FlowsPage, ArchitecturePage, SprintsPage, and RequirementsPage.

The viewer's `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/App.tsx` (lines 14–21) defines only 6 routes:

```
/              → DashboardPage
/backlog       → BacklogPage
/specs         → SpecsPage
/docs          → DocsPage
/design-system → DesignSystemPage
/architecture  → ArchitecturePage
```

Missing entirely: **WorkflowsPage** (`/workflows`), **FlowsPage** (`/flows`), **SprintsPage** (`/sprints`), and **RequirementsPage** (`/requirements`). The sidebar in `Sidebar.tsx` (lines 14–21) also lists only 6 nav items — these four sections are absent from navigation as well.

The missing pages are the most visually differentiated content per the spec. WorkflowsPage requires `@xyflow/react` for animated edge diagrams showing request/response flows. FlowsPage renders user journeys and state transitions. SprintsPage displays QA results per sprint. RequirementsPage is a traceability matrix. None of the supporting data files (`workflows.json`, `flows.json`) are present in the `data/` directory — only `backlog.ts`, `specs.ts`, and `docs.ts` were found.

**Recommendation:** Create `workflows.json` and `flows.json` data files encoding the MealMap auth flow, recipe CRUD flow, and meal plan assignment flow. Implement WorkflowsPage using a simple SVG swimlane or placeholder ReactFlow canvas. Add SprintsPage reading from sprint summaries. Add RequirementsPage as a table linking spec tickets to implementation status.

---

### Finding 2 — HIGH: ArchitecturePage Uses ASCII Pre-Block, Not Visual Diagram

**Severity:** High

`/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/pages/ArchitecturePage.tsx` lines 19–58 define `architectureDiagram` as a 39-line JavaScript string containing ASCII box-art, then render it inside a `<pre>` tag (line 74):

```tsx
<pre className="text-xs font-mono text-gray-600 bg-gray-50 p-4 rounded-lg overflow-x-auto leading-relaxed whitespace-pre">
  {architectureDiagram}
</pre>
```

The `quickstart/06-viewer.md` spec explicitly states (section 7.4, emphasis original): "Every page MUST include at least ONE of: A Recharts chart, An interactive diagram (React Flow graph / SVG diagram), A data-rich shadcn/ui Card grid with Badges + progress bars, An interactive shadcn/ui Table with filters and sorting. Pages that are ONLY text/markdown rendering are NOT acceptable."

The ArchitecturePage does have a tech stack table (lines 86–104) with Recharts-free tabular data — this satisfies the "data-rich Card grid" requirement only marginally, since it is a plain HTML `<table>` without sorting, filtering, or badges. The page has no chart and no diagram beyond the ASCII block.

The spec's architecture section (section 7.2) specifies `SystemDiagram.tsx`, `ERDiagram.tsx`, `ComponentTree.tsx`, and `LayerDiagram.tsx` as sub-components of ArchitecturePage. None of these exist in the viewer.

**Recommendation:** At minimum, replace the `<pre>` ASCII diagram with an inline SVG that uses `<rect>`, `<text>`, and `<line>` elements to render the Browser → React SPA → Express API → PostgreSQL flow with styled boxes. This requires no additional dependencies and would visually satisfy the spec mandate.

---

### Finding 3 — HIGH: Web App Feature Pages Are Sprint 0 Stubs — No Component Implementation Beyond Atoms

**Severity:** High (contextual — expected for Sprint 0, but important to flag)

Every feature page in the web app beyond `LoginPage.tsx` and `RegisterPage.tsx` is a placeholder returning a single centered message. Reviewed files:

- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/pages/recipes/RecipeDetailPage.tsx` (9 lines total) — returns `<p>Recipe detail coming in Sprint 1</p>`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/pages/recipes/CreateRecipePage.tsx` (10 lines) — returns `<p>Recipe form coming in Sprint 1</p>`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/pages/meal-plans/MealPlanCalendarPage.tsx` (10 lines) — returns `<p>Calendar view coming in Sprint 2</p>`
- `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/pages/shopping/ShoppingListPage.tsx` (12 lines) — returns `<p>Shopping list generation coming in Sprint 2</p>`

The spec (`specs/03_frontend_lead.md`) defines fully specified component trees for these pages. Section 3 (Component Hierarchy) documents 28 distinct components across atoms, molecules, and organisms. Section 10 (Key Page Behaviors) gives detailed mount/interaction/state logic for each page. None of the molecules or organisms from the spec exist in the codebase — there is no `RecipeCard.tsx`, no `MealCalendar.tsx`, no `ShoppingList.tsx`, no `IngredientRow.tsx`.

The atoms that do exist (`Button.tsx`, `Input.tsx`, `Badge.tsx`, `Card.tsx`, `Spinner.tsx`) correctly match the spec interfaces. The missing molecules/organisms are Sprint 1 and Sprint 2 deliverables and the viewer backlog correctly marks those sprints as `todo`.

**Impact:** While this is expected Sprint 0 behavior, it means the spec-to-implementation alignment can only be assessed at the atom and routing layer. The rich organism-level detail in the spec (RecipeForm with useFieldArray, MealCalendar 7×4 grid, IngredientAutosuggest with debounced search) cannot be verified until Sprint 1 executes.

**Recommendation:** Sprint 1 agents should implement the 9 molecules listed in spec section 2 (FormField, RecipeCard, IngredientRow, IngredientAutosuggest, MealSlot, TagInput, DifficultyBadge, NutritionPanel, SearchBar) in strict spec-adherent order before building pages. Each molecule has a clear spec definition that should make implementation straightforward.

---

### Finding 4 — MEDIUM: DocsPage Data Manifest Has Only 3 Entries

**Severity:** Medium

`/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/data/docs.ts` (lines 7–11) defines exactly 3 doc entries across 2 sections:

```typescript
export const docsManifest: DocEntry[] = [
  { slug: 'architecture', title: 'Architecture', section: 'system' },
  { slug: 'api', title: 'API Reference', section: 'system' },
  { slug: 'setup', title: 'Setup Guide', section: 'guides' },
]
```

The `quickstart/06-viewer.md` (section 7.2 data directory) enumerates a documentation structure with 8 folders containing 40+ files (architecture, flows, workflows, environments, api, testing, ui-design-system, project). Even accounting for MealMap being a simpler three-sprint project, the spec (`specs/03_frontend_lead.md`, which cross-references several doc files) and `CLAUDE.md` rule (Rule 2: Living Documentation) both indicate docs should expand significantly.

The DocsPage (`/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/pages/DocsPage.tsx`) renders two sections with one card each — it has almost no visual density and cannot convey the project's documentation breadth to stakeholders.

**Recommendation:** Expand `docs.ts` to 8–12 entries spanning sections: system (architecture, api, database-schema), guides (setup, deployment), flows (auth-flow, recipe-crud-flow), and testing (test-strategy, coverage-report). Even if the markdown files don't exist yet, adding manifest entries with a `status: 'planned'` field makes the viewer honest and informative.

---

### Finding 5 — MEDIUM: AppLayout Missing Header Component

**Severity:** Medium

`/opt/FitnessAiManager/autospec/examples/mealmap/web/src/components/layout/AppLayout.tsx` (lines 4–13) renders only `<Sidebar />` and `<main><Outlet /></main>` — there is no Header component:

```tsx
export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
```

The spec (`specs/03_frontend_lead.md` line 87–88) explicitly lists `Header.tsx` in the layout directory with purpose "page title + user menu". Section 3 (Component Hierarchy, line 139) shows `AppLayout` containing `Sidebar`, `Header`, and page content as siblings. The viewer's own `Layout.tsx` correctly implements this three-part shell (`Sidebar` + `Header` + `<main>`), providing a working reference pattern.

Without a Header, authenticated pages have no page title display, no breadcrumb, and no user menu (the only logout affordance is the sidebar button in `Sidebar.tsx` lines 49–57). The UX is navigable but lacks the standard app chrome that users expect.

**Recommendation:** Create `web/src/components/layout/Header.tsx` following the same pattern as the viewer's `Header.tsx`. It should display the current page title (from `useLocation` + a page title map) and a user avatar/name dropdown with a logout option, matching the spec's stated purpose.

---

### Finding 6 — LOW: Viewer Badge Variants Are Status-Workflow Focused, Not MealMap Domain-Specific

**Severity:** Low

The viewer's `/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/components/primitives/Badge.tsx` (lines 3–10) defines variants: `default`, `done`, `in-progress`, `todo`, `blocked`, `qa`. These are project management status variants — correct for the viewer's backlog display.

However, the web app's `/opt/FitnessAiManager/autospec/examples/mealmap/web/src/components/atoms/Badge.tsx` (lines 3–7) defines different variants: `green`, `amber`, `red`, `gray`, `blue`. The spec (`specs/03_frontend_lead.md` line 360–365) shows this same color-semantic interface.

The two Badge components serve different purposes (viewer = SDD status, app = recipe difficulty/tags), so divergence is appropriate. The concern is documentation: there is no comment in either file explaining why they differ, which could confuse a Sprint 1 developer working across both codebases. The `DesignSystemPage.tsx` (lines 23–111) showcases only the viewer's status-variants and does not mention or demonstrate the app's color-semantic variants.

**Recommendation:** Add a brief comment at the top of each Badge file explaining its domain context. In `DesignSystemPage.tsx`, add a second badge showcase section labeled "Recipe Difficulty Badges" showing the `green/amber/red` variants that the app uses for `easy/medium/hard` difficulty display.

---

## Strengths

**1. Spec Specificity and Implementation Readiness**
The frontend spec (`specs/03_frontend_lead.md`) is the strongest individual artifact in the MealMap project. It includes executable code for every major pattern: the Axios interceptor (section 8), the Zod form schema (section 9), the `scaleIngredients` utility (section 11), the `formatQuantity` fractional display logic (section 11), and the `ProtectedRoute` component (section 4). A developer opening this spec can begin writing production code without any further design discussions.

**2. Routing Implementation is Specification-Perfect**
`/opt/FitnessAiManager/autospec/examples/mealmap/web/src/App.tsx` implements every one of the 10 routes from spec section 4 with the correct lazy/non-lazy split, correct auth guard placement, and the correct root redirect logic (user → /recipes, anonymous → /login). The `Suspense` fallback uses `brand-500` in the spinner border — even this detail aligns with the brand token spec.

**3. DashboardPage is a Showcase-Quality Viewer Page**
`/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/pages/DashboardPage.tsx` (182 lines) delivers: animated KPI counters (AnimatedCounter), an SVG progress ring (ProgressRing), a Recharts BarChart with status-colored cells (green for done, amber for in-progress, light green for todo), a Recharts donut PieChart with legend, and a sprint summary table with badges. This page demonstrates what the rest of the viewer could look like with complete implementation.

**4. authStore Security Architecture Matches Spec**
`/opt/FitnessAiManager/autospec/examples/mealmap/web/src/stores/authStore.ts` (lines 83–92) correctly implements the spec's security requirement: `refreshToken` and `user` are persisted via `zustand/middleware/persist`, but `accessToken` stays in memory only. The `partialize` function explicitly excludes accessToken from localStorage, preventing token theft via XSS. This is a non-trivial security pattern that the spec documents and the implementation honors.

**5. BacklogPage Dual-View Implementation**
`/opt/FitnessAiManager/autospec/examples/mealmap/viewer/src/pages/BacklogPage.tsx` provides both kanban and table views with a clean toggle (lines 49, 68–70, 117–120). The kanban organizes tickets across 5 status columns including the `blocked` state that most kanban implementations omit. Ticket cards show ID, title, dependency list, points badge, and owner — all the data fields from `backlog.ts`.

---

## Gaps & Improvement Opportunities

1. **Viewer missing 4 pages** (WorkflowsPage, FlowsPage, SprintsPage, RequirementsPage) — the most impactful gap, requiring new data files and potentially @xyflow/react integration.

2. **No react-markdown in viewer** — SpecsPage and DocsPage render only list cards with file path labels. The spec content (757 lines of rich documentation) cannot be read in the viewer. Adding `react-markdown` + `remark-gfm` would transform these pages from link lists to readable documents.

3. **ArchitecturePage ASCII diagram** — should be replaced with at least a static SVG to satisfy the "visual diagram" mandate from `quickstart/06-viewer.md`.

4. **BacklogPage missing Recharts charts** — the spec requires burndown/velocity charts on this page; current implementation shows only text totals (`{totalPoints} pts total · {donePoints} done`). A small stacked BarChart reusing the existing Recharts import from DashboardPage would fill this gap.

5. **docs.ts manifest is minimal** (3 entries vs ~40 expected) — reduces DocsPage to near-empty state even though the page component is well-implemented.

6. **AppLayout missing Header** — authenticated pages lack page title and user menu chrome.

7. **No test files present for atoms or utilities** — `specs/03_frontend_lead.md` section 2 (directory structure, lines 112–119) defines a `tests/` tree with `RecipeCard.test.tsx`, `IngredientRow.test.tsx`, `scaleIngredients.test.ts`, `formatQuantity.test.ts`. None of these files exist in the web app. The `scaleIngredients` and `formatQuantity` utilities (defined verbatim in spec section 11) are particularly testable and should have unit tests before Sprint 1 completes.

8. **Performance targets not instrumented** — spec section 12 sets concrete Lighthouse targets (LCP < 2.5s, CLS < 0.1, bundle < 200KB gzipped). There is no `vite-bundle-visualizer` config or Lighthouse CI integration in the project to verify these targets.

---

## Viewer Quality Assessment (per quickstart/06-viewer.md)

The spec (`quickstart/06-viewer.md`) defines a visual-first standard: "Every page MUST include at least ONE of: A Recharts chart, An interactive diagram, A data-rich Card grid with Badges + progress bars, An interactive Table with filters and sorting."

Scoring each viewer page against this mandate:

| Page | Visual Element Present | Passes Mandate |
|------|----------------------|----------------|
| DashboardPage | BarChart + PieChart + AnimatedCounter + ProgressRing | Yes |
| BacklogPage | Kanban board + interactive table | Yes (marginally — table has no sorting/filtering) |
| SpecsPage | Card grid with owner color badges | Yes (marginally) |
| DocsPage | Card grid with section badges | Yes (marginally) |
| DesignSystemPage | Color swatches + badge gallery + card variants | Yes |
| ArchitecturePage | ASCII pre-block + plain HTML table | No — ASCII is not a visual diagram |

**2 pages pass confidently, 3 pass marginally, 1 fails.**

The spec also requires `shadcn/ui` as the component library ("REQUIRED — do NOT build custom UI primitives"). The viewer uses custom primitives sourced from the FitnessAiManager design system — this is a deliberate documented divergence per `MEMORY.md` (warm palette, no shadcn). The custom primitives are of good quality but are missing richness that shadcn provides: no Tabs (DocsPage and DesignSystemPage would benefit), no Sheet/Drawer, no Command palette for search, no Dialog for confirmation modals.

The viewer also omits `@xyflow/react`, `react-markdown`, and `framer-motion` — three of the five required packages from `quickstart/06-viewer.md` section 7.1. These absences directly cause the missing pages problem: WorkflowsPage cannot exist without ReactFlow, and SpecsPage/DocsPage cannot render spec content without react-markdown.

Overall viewer quality: **solid foundation (Dashboard is excellent), incomplete coverage (60% of pages), missing three critical npm packages**.

---

## Verdict

The MealMap frontend spec is among the most actionable reviewed in this sprint. A developer handed `specs/03_frontend_lead.md` has everything needed to implement the full UI — TypeScript interfaces, Zod schemas, Axios patterns, utility implementations, routing table, component hierarchy, and performance targets. The spec earns a **9/10 for actionability**.

The viewer implementation is a strong but incomplete start. The DashboardPage, BacklogPage, and the custom primitive library demonstrate that the right approach was chosen. The three critical gaps — missing 4 pages, ASCII architecture diagram, and absent react-markdown — represent achievable Sprint 1 viewer work. Estimated effort to reach 90% viewer completeness: 3 additional pages (WorkflowsPage as SVG, SprintsPage, RequirementsPage) + react-markdown integration + ArchitecturePage SVG replacement.

The web app is correctly scoped for Sprint 0. The auth system (LoginPage, RegisterPage, ProtectedRoute, authStore) is production-ready. The atoms (Button, Input, Badge, Card, Spinner) match spec interfaces. The routing is specification-perfect. Sprint 1 agents should begin with molecules (FormField, RecipeCard, DifficultyBadge) before tackling organisms and pages.

**Aggregate score: 7.8/10.** Spec quality is high; implementation completeness reflects early sprint stage appropriately.
