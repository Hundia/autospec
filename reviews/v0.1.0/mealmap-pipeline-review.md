# MealMap Pipeline Review — AutoSpec v0.1.0

**Date:** 2026-03-14
**Scope:** `examples/mealmap/` — Full QUICKSTART pipeline output (SRS → specs → docs → Sprint 0 code → viewer)
**Framework version:** v0.1.0 (`cli/package.json`)
**Review method:** 5 Sonnet reviewer agents + Playwright validation + Opus synthesis
**Cross-model validation:** GPT-5.4 FRAMEWORK_PROPOSAL findings incorporated

---

## Executive Verdict

MealMap proves that AutoSpec v0.1.0 can transform a 303-line SRS into a compiling full-stack TypeScript project (Express + React), a 28-ticket backlog across 3 sprints, 5 role specs totaling 4,237 lines, and a 6-page viewer dashboard — all in a single orchestrated session. This decisively closes the most critical gap from the ai-support-ops validation: Sprint 0 is now literally executable, not docs-only.

The pipeline scores **8.3/10 average** across all reviewers (vs ai-support-ops's 6.8/10). The viewer scores **24/40** on the VIEWER_BENCHMARK (vs 21/40), placing it at the top of the "moderate" band. Two of three pipeline phases achieved **zero-fix one-shot generation**; the third required 3 predictable Express TypeScript fixes.

The framework has crossed the threshold from planning tool to execution tool. The remaining gaps are calibration issues (viewer quality gate contradictions, missing prompts/ directory, thin viewer data density), not architectural ones.

---

## Review Board Scores

### Per-Reviewer Averages (1-10 scale)

| Reviewer | Completeness | Specificity | Consistency | Actionability | Quality | Average |
|----------|-------------|-------------|-------------|---------------|---------|---------|
| Product (23.2) | 9 | 8 | 9 | 8 | 9 | **8.6** |
| Architecture (23.3) | 9 | 9 | 8 | 9 | 8 | **8.6** |
| Frontend/UX (23.4) | 6 | 9 | 8 | 9 | 7 | **7.8** |
| QA Coverage (23.5) | 8 | 9 | 7 | 8 | 9 | **8.2** |
| Pipeline Process (23.6) | 8 | 9 | 8 | 8 | 8 | **8.2** |
| **Cross-Reviewer Average** | **8.0** | **8.8** | **8.0** | **8.4** | **8.2** | **8.3** |

**Strongest dimension:** Specificity (8.8) — all specs contain concrete MealMap examples, TypeScript interfaces, Zod schemas, and Drizzle code rather than generic boilerplate.

**Weakest dimension:** Completeness (8.0) — pulled down by the viewer's 6-of-10 pages and the missing prompts/ directory.

### VIEWER_BENCHMARK Scores (0-5 scale, max 40)

| Category | ai-support-ops | MealMap | Delta | Notes |
|----------|---------------|---------|-------|-------|
| 1. Information Architecture | 2 | 3 | +1 | 378-line viewer brief with page map and component interfaces |
| 2. Structured Data Richness | 3 | 3 | 0 | Clean Sprint/Ticket types; missing annotations and drill-down |
| 3. Content Density | 3 | 2 | -1 | Only 3 docs and 5 spec manifest entries; thinner narrative base |
| 4. Visual Design Direction | 3 | 4 | +1 | Complete hex tokens, Tailwind config, component-level class assignments |
| 5. Cross-Artifact Consistency | 4 | 4 | 0 | Spec/backlog/viewer data agree; Model column stripped from viewer data |
| 6. Sample Operational Data | 1 | 2 | +1 | Three sprints with status progression; no timestamps or velocity |
| 7. Diagram Readiness | 3 | 2 | -1 | ASCII pre-block replaces node-edge graph data |
| 8. One-Shot Generation Confidence | 2 | 4 | +2 | Pre-seeded TypeScript data enabled zero-fix viewer generation |
| **Total** | **21/40** | **24/40** | **+3** | Top of "moderate" band (16-24); 1 point below "strong" (25-32) |

### Playwright Validation

| Metric | Result |
|--------|--------|
| Tests run | 37 |
| Passed | **37** |
| Failed | 0 |
| Pages validated | 6/6 |
| Screenshots saved | 7 |
| Data accuracy | 5/5 metrics correct (75pts, 28 tickets, 3 sprints, 5 specs, 10 done) |

All 6 pages render correctly. Sidebar navigation works with active link highlighting. Recharts SVGs render. AnimatedCounter values settle correctly. Kanban board shows correct ticket counts (Done: 10, Todo: 18). Full results: `reviews/v0.1.0/mealmap-viewer-playwright.md`.

---

## Strongest Artifacts

1. **`specs/02_backend_lead.md`** (984 lines) — Dual-format API contracts (table + JSON examples), Zod schemas, p50/p95/p99 performance targets. A mid-level developer could implement all Sprint 1 endpoints directly from this document.

2. **`specs/05_qa_lead.md`** (1,116 lines) — Complete test pyramid with runnable code blocks, ShoppingListService unit tests with specific numerical assertions (3.0 cups, 600g scaled), OWASP security checklist.

3. **`agents/sprint-0-brief.md`** (208 lines) — Machine-executable brief with complete package.json, per-ticket file paths, and 13-item binary verification checklist. Achieved compiling code in one Sonnet pass.

4. **`agents/viewer-brief.md`** (378 lines) — Pre-seeded TypeScript data structures and hex color tokens. Enabled zero-fix viewer generation.

5. **`viewer/src/pages/DashboardPage.tsx`** (182 lines) — Showcase-quality page with Recharts BarChart/PieChart, AnimatedCounter, ProgressRing, and sprint summary table.

---

## Weakest Artifacts

1. **Viewer ArchitecturePage** — Renders ASCII text in a `<pre>` block instead of a visual diagram. Fails the quality gate mandate.

2. **`viewer/src/data/docs.ts`** (19 lines) — Only 3 entries across 2 sections. DocsPage is near-empty.

3. **Missing `prompts/` directory** — QUICKSTART mandates per-sprint prompt folders. MealMap has none.

4. **`viewer/src/data/backlog.ts`** (77 lines) — 28 tickets with 6 fields each. Missing descriptions, model assignments, timestamps, velocity data.

5. **Duplicate error handler** — `api/src/app.ts` contains an inline ErrorRequestHandler that duplicates `middleware/error.middleware.ts`. The middleware file is dead code.

---

## Main Findings

### Finding 1: Three-Brief Orchestration Pattern Outperforms Template Prompts

The MealMap pipeline demonstrates that purpose-built agent briefs (generation → sprint → viewer) achieve higher one-shot success rates than QUICKSTART template prompts. Briefs embed project-specific data directly (exact package.json, TypeScript data structures, hex color values), eliminating interpretation overhead. Two of three phases succeeded with zero fix passes. This should become the documented standard for Claude Code orchestration.

### Finding 2: Viewer Quality Gate Contradiction Creates Irreconcilable Instructions

`quickstart/07-quality-gates.md` mandates shadcn/ui and ReactFlow. `agents/viewer-brief.md` explicitly prohibits both. The MealMap viewer passes `npx vite build` but fails multiple documented quality gates. Resolution required: either update quality gates to document a "bare-Tailwind" variant, or rebuild the MealMap viewer with shadcn.

### Finding 3: Spec-Code Divergences Create Documentation Debt

The generated Sprint 0 code correctly improves on specs in several areas (helmet(), configurable CORS origins, centralized Drizzle relations, graceful shutdown). However, these improvements are not reflected back into the specs. Key divergences: bcrypt vs bcryptjs, error handler inline vs imported, helmet absent from middleware chain diagram. In SDD, code that exceeds the spec should drive a spec update.

### Finding 4: QA Coverage Is Spec-Complete But Implementation-Absent

The QA spec contains ~700 lines of runnable test code. Zero test files exist. Vitest configs omit coverage thresholds. When tests are eventually written in Sprint 1/2, coverage gates won't be enforced without config updates.

### Finding 5: Product Spec Has Minor SRS Contradictions

F4.5 drag-and-drop is classified differently between SRS (functional requirement) and PM spec (Could Have v2). Shopping list check-off persistence is ambiguous in SRS F5.5 but clarified in PM spec. These are scope disambiguation issues, not blocking problems.

---

## GPT-5.4 FRAMEWORK_PROPOSAL Status

| # | Finding | Status | Evidence |
|---|---------|--------|----------|
| 1 | "Planning generator only" | **Refuted** | Sprint 0 compiles; code generation works |
| 2 | "Model routing needs enforcement" | **Partially addressed** | Sound routing logic in backlog; no planner handoff protocol |
| 3 | "Sprint 0 must be executable" | **Closed** | API + web compile cleanly; 3 typing fixes only |
| 4 | "Viewer needs first-class spec" | **Partially addressed** | 378-line + 1,095-line specs; quality gate contradiction |
| 5 | "Viewer data needs operational depth" | **Open** | Scores 2/5; thin by design due to brief spec |
| 6 | "Prompts need ticket specificity" | **Bypassed** | Agent briefs replace prompts; intentional simplification |

---

## Practical Conclusion

MealMap validates AutoSpec v0.1.0 as a working SDD execution framework. The pipeline produces:
- Implementation-ready specs (8.8/10 specificity)
- Compiling code from a single orchestrated session
- A viewer that passes all Playwright tests (37/37)

The framework is **ready for real project use** with these caveats:
1. Quality gates need reconciliation with the bare-Tailwind viewer approach
2. Viewer data needs enrichment for executive-grade dashboards
3. Sprint 0 briefs need Express TypeScript patterns to achieve first-pass compilation
4. The prompts/ directory remains unvalidated; the agent-brief alternative should be formally documented

The cross-model validation (GPT-5.4 identifying gaps → Claude closing them) confirms that SDD evaluation is tool-agnostic — the framework's quality is independent of which model family exercises it.

---

*Generated by Sprint 23 review pipeline: 5 Sonnet reviewer agents + Playwright validation + Opus synthesis.*
