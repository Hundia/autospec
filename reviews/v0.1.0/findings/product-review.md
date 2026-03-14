# Product Review — MealMap

**Date:** 2026-03-14
**Reviewer:** Product Review Agent
**Files Reviewed:**
- `examples/mealmap/specs/01_product_manager.md` (600 lines)
- `examples/mealmap/requirements/srs.md` (303 lines)

---

## Scores

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Completeness | 9/10 | All canonical PM sections are present: vision, mission, problem statement, personas, user stories with acceptance criteria, user flows, MoSCoW prioritization, success metrics, assumptions, and risks. Minor deduction: no competitive landscape section and non-functional requirements live entirely in the SRS rather than being summarized in the PM spec. |
| Specificity | 8/10 | Concrete MealMap examples throughout — specific URLs (`/recipes/:id`), persona names (Jamie, Morgan, Pat), realistic quantities ("2 cups flour" + "1 cup flour" → "3 cups"), debounce values (300ms), JWT TTLs (15 min / 7 days). Slight deduction: Flow 4 ends with "Morgan copies list mentally / takes screenshot" — a notable user journey gap with no export or print path documented. |
| Consistency | 9/10 | SRS and PM spec align tightly on features F1–F6, persona attributes, password rules, JWT config, soft-delete behavior, ingredient categories, and the "no SSO" exclusion. One minor divergence: the SRS lists F4.5 drag-and-drop as a functional requirement (labeled "nice-to-have"), while the PM spec classifies it as "Could Have (v2)" — a scope ambiguity developers reading both documents could interpret differently. |
| Actionability | 8/10 | A developer could begin implementation directly from these two documents. The SRS provides the full data model with column types and constraints, index strategy, tech stack with versions, and a three-sprint delivery plan. The PM spec supplies Given/When/Then acceptance criteria for every user story. Deduction: the SRS sprint plan is one paragraph per sprint with no ticket IDs or story-point estimates — a developer would need to open `specs/backlog.md` for actual ticket-level detail. |
| Quality | 9/10 | Both documents are well-organized, free of grammatical errors, and use consistent terminology. ASCII flow diagrams in the PM spec are unusually detailed and useful. The risk register in section 9 is honest and domain-aware. Minor deduction: the SRS has no document revision history or sign-off section, which is a standard SRS convention. |
| **Average** | **8.6/10** | Strong, implementation-ready documentation pair. |

---

## Key Findings

### Finding 1: Feature F4.5 Drag-and-Drop Creates a Scope Conflict Between Documents

The PM spec (`examples/mealmap/specs/01_product_manager.md`, section 6, "Could Have") explicitly defers drag-and-drop meal plan rearrangement to v2: "Drag-and-drop meal plan calendar — Nice UX but complex to implement." However, the SRS (`examples/mealmap/requirements/srs.md`, F4.5) lists it under Functional Requirements with the annotation "(frontend nice-to-have)" rather than placing it in the Out of Scope section.

This creates a concrete implementation risk: a backend lead reading the SRS would see F4.5 as a v1 requirement; a frontend lead reading the PM spec would treat it as out of scope. The SRS should move F4.5 to its Out of Scope section — which already lists social sharing, image upload, and others — and add a footnote referencing the PM spec's v2 designation. The discrepancy is small but on a real project this would trigger a missed-feature report at sprint review or cause unnecessary implementation work.

### Finding 2: Shopping List Check-Off Persistence Is Contradicted Between Documents

The PM spec (section 8, Assumption 5) states: "The API aggregates quantities; the frontend stores check-off state in component state (not persisted to DB)." It reinforces this in US-5.2 acceptance criteria: "persisted in local state, not server."

The SRS (F5.5) states: "Shopping list persists until the meal plan changes or is regenerated." This phrasing is ambiguous — it could mean the aggregated list is cached server-side, or that check-off toggle state persists. When read alongside F5.4 ("Check off items as purchased (toggle)") without the PM spec's clarification, a developer might add a database column for check-off state that the PM never intended.

The SRS should explicitly state: "Check-off state is client-side only (localStorage or component state); no `is_checked` column exists in the database schema." The data model section of the SRS already omits this column — which is correct — but the F5.4/F5.5 prose should be updated to match.

### Finding 3: Morgan Persona Goals Are Partially Stranded in "Should Have" Territory

The Morgan persona (`examples/mealmap/specs/01_product_manager.md`, section 3, Persona 2) establishes macro tracking as a primary goal: "Log calories, protein, carbs, and fat per recipe to hit daily macro targets" and "Plan meals that collectively hit weekly macro goals." Morgan's quote is "I need to see exactly what I'm eating before I make it, not after."

However, the MoSCoW table (section 6) places nutritional info fields in "Should Have" (stretch goal), not "Must Have." Meal plan macro aggregation is pushed further to "Could Have." This means Morgan's core value proposition is not guaranteed to be delivered in the MVP.

This is a defensible scoping decision, but the persona section does not communicate this hierarchy to the reader. A stakeholder finishing section 3 would believe macro tracking is a first-class requirement, then be surprised at section 6. The persona section should include a brief note such as: "Morgan's nutritional tracking goals are partially addressed in v1 — recipe-level macro storage is a stretch goal — with full meal plan macro aggregation deferred to v2." Without this, the product's promise to Morgan overstates what the MVP delivers.

### Finding 4: Recipe Scaling Flow Ends Without a Resolution Path

Flow 4 in the PM spec (`examples/mealmap/specs/01_product_manager.md`, section 5, "Flow 4: Recipe Scaling") concludes with: "Morgan copies list mentally / takes screenshot." This documents a product gap rather than a product capability. Every other flow in section 5 traces user actions to API calls and UI state changes. Flow 4 terminates with an improvised workaround.

The PM spec correctly defers "Print / Export" to the Could Have tier, but the flow should acknowledge what v1 actually provides at this point — for example, a note that the scaled ingredient list is displayed on screen with no further action available, or that a "Copy to clipboard" convenience button is the v1 mitigation. As written, a designer has no spec to work from for the page's final state after scaling, and a developer has no guidance on whether any affordance beyond the display is expected.

### Finding 5: SRS Sprint Plan Lacks F-Code Traceability

The SRS sprint plan (`examples/mealmap/requirements/srs.md`, section "Sprint Plan") describes three sprints in paragraph form with no ticket IDs and no reference to which F-codes (F1–F6) belong to which sprint. "Sprint 1: Recipes + Auth (~8 tickets)" does not enumerate which of F1, F2.1–F2.9, F3.1–F3.4 are included.

A developer consulting only the SRS cannot determine which requirements are sprint 1 vs. sprint 2 without opening `specs/backlog.md`. An improvement would be a simple mapping table:

| Sprint | Requirements Covered |
|--------|---------------------|
| Sprint 0 | Infrastructure, scaffolding |
| Sprint 1 | F1.1–F1.5, F2.1–F2.9, F3.1–F3.4 |
| Sprint 2 | F4.1–F4.7, F5.1–F5.5, F6.1–F6.4 |

This is a minor authoring gap, not an architectural one, but it degrades the document's standalone usefulness.

---

## Strengths

- **Persona authenticity**: Jamie, Morgan, and Pat are grounded in realistic demographics, daily routines, specific frustrations (e.g., "30 minutes every Sunday"), and distinctive quotes. Each has a different axis of concern (organization, macros, time/family) that maps cleanly to separate feature priorities, making them genuinely useful for prioritization decisions.
- **Acceptance criteria depth**: Every user story uses Given/When/Then with multiple scenarios, including error paths. US-2.2 specifies debounce timing (300ms); US-1.2 specifies the security-conscious "without revealing which field is wrong" error message. This level of specificity is production-grade.
- **Assumption register**: Section 8 of the PM spec documents 10 explicit assumptions covering JWT storage strategy, ingredient global/shared scope, unit aggregation behavior, concurrency model, and soft-delete semantics. This prevents scope creep and implementation surprises.
- **Risk register with likelihood and mitigation**: Section 9 documents five risks with likelihood, impact, and concrete mitigations. The "ingredient name normalization — Likelihood: High" entry demonstrates real domain knowledge about a data quality problem that recipe apps routinely underestimate.
- **Data model completeness**: The SRS includes DDL-level table definitions with types, constraints, default values, and a named index list. This is unusually thorough for an SRS and makes the document directly actionable for a DB architect without further elaboration.
- **Out of Scope is explicit and justified**: Both documents maintain a consistent Out of Scope list (SSO, image upload, URL import, PWA, i18n, payments) with brief rationales, reducing the risk of unplanned scope additions late in the sprint.
- **Flow diagrams use realistic data**: The ASCII flows reference specific recipe names ("Creamy Garlic Pasta"), specific API endpoints (`POST /meal-plans/:id/entries → 201`), and specific UI states rather than generic placeholders — a significant quality signal.

---

## Gaps & Improvement Opportunities

- **No competitive analysis**: The problem statement is strong, but there is no mention of how MealMap differentiates from Paprika, Mealime, Plan to Eat, or AnyList. A brief differentiation statement would sharpen the product positioning and help justify the MVP feature set.
- **No accessibility requirements**: The SRS non-functional requirements cover performance, security, scalability, and usability but contain no mention of WCAG compliance, keyboard navigation, or screen reader support. For an app targeting broad demographics including Pat (beginner tech comfort), this is a notable omission.
- **Morgan's macro aggregation path is undefined**: The SRS defines per-recipe nutritional fields (F2.9) but does not specify whether or how macros are summed across a meal plan. The PM spec lists "Macro targets and daily tracking" as v2 but does not document what partial macro support looks like in v1 for Morgan.
- **No pagination spec for the shopping list**: The SRS specifies recipe list pagination (F2.5: 20 per page) but does not address the shopping list. In practice a single meal plan is unlikely to generate hundreds of line items, but an explicit statement — "no pagination required, all items displayed on one page" — would close the gap.
- **Flow 4 has no resolution state**: The recipe scaling flow ends without a specified UI affordance (Finding 4 above).
- **SRS sprint plan lacks F-code mapping**: The three-sprint plan does not reference which F-code requirements each sprint covers (Finding 5 above).
- **"Active" plan enforcement mechanism is underspecified**: Both documents agree only one meal plan can be active at a time (US-4.3, F4.7), but neither specifies where enforcement happens — database trigger, application layer, or both — or whether deactivating the old plan and activating the new one is atomic.

---

## Verdict

The MealMap product specification and SRS are a strong, implementation-ready documentation pair that reflect genuine domain understanding and disciplined spec writing. The three personas are distinct and believable, the user stories carry real acceptance criteria rather than vague outcomes, and the data model is complete enough that a schema can be generated directly from the SRS without significant interpretation by the developer. The most significant structural issue is the F4.5 drag-and-drop inconsistency, where the PM spec and SRS classify the same feature in different priority tiers — this should be resolved before sprint planning to prevent a scope dispute between front-end and back-end implementors. The secondary concern is the shopping list check-off persistence ambiguity in F5.5, which could cause unintended schema additions. The Morgan persona's positioning slightly oversells macro tracking relative to its MoSCoW priority, which risks creating misaligned stakeholder expectations about what the MVP will deliver for fitness-oriented users. None of these are blockers for implementation; they are the calibration refinements that separate a good specification from an excellent one. Overall, at 8.6/10 average, these documents are well above the baseline for an MVP specification and provide a solid foundation for the three-sprint delivery plan.
