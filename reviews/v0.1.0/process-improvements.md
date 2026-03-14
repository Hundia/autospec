# AutoSpec Process Improvements — Candidates from MealMap Review

**Date:** 2026-03-14
**Source:** Sprint 23 MealMap Pipeline Review + GPT-5.4 FRAMEWORK_PROPOSAL
**Framework version:** v0.1.0
**Target:** Future QUICKSTART hardening sprint

---

## Improvement Tickets

### QS-01: Resolve Viewer Quality Gate Contradiction

**QUICKSTART Section:** `quickstart/07-quality-gates.md`
**GPT-5.4 Priority:** P4 (viewer-specific output pack)
**Severity:** High
**Source finding:** Pipeline review Finding 1

`quickstart/07-quality-gates.md` mandates shadcn/ui and ReactFlow. The MealMap viewer brief prohibits both. The MealMap viewer succeeded in one shot without them. **Action:** Update quality gates to define two valid viewer variants:
- **Full variant:** shadcn/ui + ReactFlow + framer-motion (10 pages, dark theme default)
- **Lite variant:** bare Tailwind + Recharts only (6+ pages, any theme)

Document MealMap as the Lite variant reference, ai-support-ops as the Full variant reference.

---

### QS-02: Generate Planner Handoff Artifacts Per Sprint

**QUICKSTART Section:** `quickstart/04-sprint-prompts.md`
**GPT-5.4 Priority:** P2 (planner handoff artifacts)
**Severity:** Medium
**Source finding:** Pipeline review, GPT-5.4 Finding 2

Model routing in the backlog (haiku/sonnet/opus column) is advisory, not enforced. **Action:** Add a `planner-brief.template.md` that the QUICKSTART generates per sprint, containing:
- Architectural decisions made for this sprint
- Contract changes from previous sprints
- High-risk tickets with acceptance criteria and escalation triggers
- Explicit model assignments with rationale

---

### QS-03: Add Walking-Skeleton Phase to Pipeline

**QUICKSTART Section:** `quickstart/01-generation-plan.md`
**GPT-5.4 Priority:** P3 (minimal runnable skeleton)
**Severity:** Medium (already partially closed by MealMap)
**Source finding:** GPT-5.4 Finding 3, Pipeline review Finding 1

MealMap proves Sprint 0 can produce compiling code. **Action:** Formalize the walking-skeleton phase:
- Add an "Express/NestJS TypeScript Patterns" section to `sprint-0-brief.md` template covering known compilation friction points
- Document the three-brief pattern (generation → sprint-0 → viewer) as the standard orchestration approach
- Add a post-generation verification checklist to the pipeline

---

### QS-04: Enrich Viewer Data Specification

**QUICKSTART Section:** `quickstart/06-viewer.md`
**GPT-5.4 Priority:** P4 (viewer-specific output pack)
**Severity:** Medium
**Source finding:** Frontend review Finding 4, Pipeline review Finding 5

Viewer data files are too thin for executive-grade dashboards. **Action:** Extend the viewer brief template's data specification to include:
- Ticket descriptions (one sentence each)
- Model assignment field
- Completion timestamps for done tickets
- Sprint velocity summary object
- 8-12 doc manifest entries (even for planned docs)
- Sprint summary excerpts for the SprintsPage

---

### QS-05: Add Validation Rubrics to Framework Output

**QUICKSTART Section:** New — `quickstart/08-validation.md`
**GPT-5.4 Priority:** P5 (validation rubrics)
**Severity:** Low
**Source finding:** GPT-5.4 Priority 5

No self-assessment mechanism exists in the QUICKSTART output. **Action:** Generate `review/` templates:
- `review/quickstart-validation.md` — checklist of all expected outputs with pass/fail criteria
- `review/viewer-readiness.md` — 8-category VIEWER_BENCHMARK scoring template
- `review/sprint-executability.md` — compilation and test pass verification

---

### QS-06: Document Agent-Brief Pattern as First-Class Alternative to Prompts

**QUICKSTART Section:** `quickstart/05-generation-prompts.md`
**GPT-5.4 Priority:** P1 (honest promise)
**Severity:** Medium
**Source finding:** Pipeline review Finding 2

MealMap has no `prompts/` directory. It uses three purpose-built agent briefs that achieved higher one-shot success rates. **Action:**
- Document the agent-brief pattern in `quickstart/05-generation-prompts.md`
- Provide templates for generation-brief.md, sprint-N-brief.md, and viewer-brief.md
- Document when to use briefs (Claude Code orchestration) vs prompts (Copilot/VS Code workflows)

---

### QS-07: Reconcile Spec-Code Divergences in Sprint 0

**QUICKSTART Section:** `quickstart/04-sprint-prompts.md`
**GPT-5.4 Priority:** P1 (honest promise)
**Severity:** Medium
**Source finding:** Architecture review Findings 1-4

Sprint 0 code correctly improves on specs (helmet, configurable CORS, centralized Drizzle relations) but doesn't update specs. **Action:** Add a "spec reconciliation" step to the Sprint 0 brief template:
- After code generation, diff spec claims against actual code
- Update spec sections that code diverged from
- Document intentional substitutions (e.g., bcryptjs for bcrypt)

---

### QS-08: Add Vitest Coverage Threshold Enforcement

**QUICKSTART Section:** `quickstart/02-specs.md` (QA Lead spec template)
**Severity:** Low
**Source finding:** QA review Finding 2

MealMap's Vitest configs omit coverage thresholds despite the QA spec defining them. **Action:** Include coverage threshold configuration in the Sprint 0 brief's Vitest config section and ensure `setupFiles` references are included.

---

### QS-09: Replace ASCII Architecture Diagrams with SVG

**QUICKSTART Section:** `quickstart/06-viewer.md`
**Severity:** Low
**Source finding:** Frontend review Finding 2

ArchitecturePage renders ASCII text in `<pre>`. **Action:** Update the viewer brief template to specify inline SVG for architecture diagrams. Provide a minimal SVG template with `<rect>`, `<text>`, and `<line>` elements.

---

### QS-10: Add Missing Test Case Specifications

**QUICKSTART Section:** `quickstart/02-specs.md` (QA Lead spec template)
**Severity:** Low
**Source finding:** QA review Findings 3-5

Gaps in QA spec: placeholder search filter test, no RecipeForm component test, E2E dependency on pre-seeded data. **Action:** Add to QA Lead spec template:
- Integration test for case-insensitive search
- RecipeForm component test covering dynamic ingredient rows
- E2E globalSetup for seed script execution

---

## Priority Summary

| Priority | Tickets | Theme |
|----------|---------|-------|
| **High** | QS-01 | Resolve quality gate contradiction |
| **Medium** | QS-02, QS-03, QS-04, QS-06, QS-07 | Pipeline strengthening + documentation |
| **Low** | QS-05, QS-08, QS-09, QS-10 | Polish and coverage |

## GPT-5.4 Priority → Ticket Mapping

| GPT-5.4 Priority | Proposed Ticket | Status |
|-------------------|-----------------|--------|
| P1: Make promise honest or output deeper | QS-06 (document briefs), QS-07 (reconcile divergences) | Mapped |
| P2: Add planner handoff artifacts | QS-02 (planner-brief template) | Mapped |
| P3: Generate minimal runnable skeleton | QS-03 (walking-skeleton phase) | Partially closed by MealMap |
| P4: Add viewer-specific output pack | QS-01 (quality gates), QS-04 (data enrichment), QS-09 (SVG diagrams) | Mapped |
| P5: Add validation rubrics to framework | QS-05 (review templates) | Mapped |

---

*These tickets are candidates for a future QUICKSTART hardening sprint. Prioritize QS-01 (quality gate contradiction) as a blocking issue for MealMap's use as a reference implementation.*
