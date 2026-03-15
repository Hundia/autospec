---
description: "Assemble expert AI agents (via /fleet) to collaboratively plan a sprint"
mode: "agent"
---

# Plan Sprint

Assemble a team of expert AI agents to collaboratively plan a sprint. Use `/fleet` to run experts in parallel, then three PMs (drafter → reviewer → finalizer) produce a production-ready sprint plan.

The user's sprint goal: {{input}}

---

## Phase 1: Goal Analysis & Expert Selection (orchestrator — sequential)

1. **Validate the goal.** If the input is empty or too vague (fewer than 5 words, no clear deliverable), ask the user to clarify:
   - What feature/fix/improvement they want
   - Who it's for (which user personas)
   - Any specific subsystems involved

2. **Read `specs/backlog.md`** — scan all `## Sprint X` headers to determine the next sprint number.

3. **Read `docs/` index** — identify which subsystems the goal touches.

4. **Determine which experts to activate** based on the goal:

   | Expert | Role | Activate When | Reads |
   |--------|------|---------------|-------|
   | **Architect** | System design, API contracts, integration | ALWAYS | `specs/02_backend_lead.md`, `specs/03_frontend_lead.md`, relevant `docs/` |
   | **UX/UI Expert** | User flows, components, accessibility | Sprint has ANY frontend/GUI work | `specs/10_ui_designer.md`, `docs/viewer/` |
   | **Database Expert** | Schema changes, migrations, query patterns | Sprint has schema changes or new models | `specs/04_db_architect.md` |
   | **Human Experience Expert** | User journeys, personas, cognitive load | Sprint has user-facing features | `specs/01_product_manager.md` |

5. **Announce the plan** to the user with activated experts and subsystems affected.

---

## Phase 2: Expert Analysis (via `/fleet` — PARALLEL)

Use `/fleet` to dispatch all activated experts as parallel subagents. Each expert reads its assigned files and produces a structured analysis. Experts are **read-only** — they analyze and report, they do NOT modify any files.

```
/fleet Analyze this sprint goal from different expert perspectives. Each expert is independent — run in parallel. Do NOT modify any files, only produce analysis.

Sprint goal: [goal]
Next sprint number: [N]

Subagent 1 — Architect:
Read specs/02_backend_lead.md, specs/03_frontend_lead.md, and relevant docs/ sections.
Produce: System Impact Assessment, API Design (endpoint table), File Structure (new/modified files), Technical Approach (step-by-step), Integration Points, Risks & Mitigations (table with impact + mitigation), Estimated Complexity (backend/frontend rating + total points).

Subagent 2 — UX/UI Expert:
Read specs/10_ui_designer.md and docs/viewer/.
Produce: User Flows (Mermaid flowchart), Component Design (table: component, props, notes), Page Layout, Accessibility Requirements (ARIA, keyboard, screen reader), data-testid Attributes, i18n Keys Needed.

Subagent 3 — Database Expert:
Read specs/04_db_architect.md and the database schema.
Produce: Schema Changes (models, fields, constraints, indexes), Migration Plan (ordered steps), Query Patterns (new queries + index recommendations), Data Integrity (FKs, cascades, unique constraints), Rollback Strategy.

Subagent 4 — Human Experience Expert:
Read specs/01_product_manager.md and relevant docs/flows/.
Produce: Persona Impact (per persona, with priority), User Journey Map (touchpoints + emotions), Cognitive Load Assessment (new concepts, learning curve), Error Recovery (error scenarios + messages), Edge Cases, Success Metrics (what to measure + targets).
```

**Monitor with `/tasks`** until all expert subagents complete.

Skip experts that don't apply (e.g., skip UX/UI for backend-only sprints, skip DB for frontend-only sprints).

---

## Phase 3: PM-A — Draft Sprint Plan (orchestrator — sequential)

**Runs AFTER Phase 2 completes.** PM-A needs all expert analyses.

Synthesize all expert analyses into a complete draft sprint plan:

- **Problem Statement** — what problem does this sprint solve?
- **User Stories** — `As a [persona], I want [action] so that [benefit]`
- **Technical Decisions** — table: decision, choice, rationale
- **Schema Changes** — from Database Expert (or "None")
- **Phased Tickets** — grouped by implementation phase:

```markdown
#### Phase 1: [Phase Name] ([total points] pts)

| # | Ticket | Description | Owner | Model | Points | Status | Depends On |
|---|--------|-------------|-------|-------|--------|--------|------------|
| N.1 | [Title] | [Detailed description] | [Backend/Frontend/DB] | [small/medium/large] | [1-8] | 🔲 | — |
```

- **QA Plan** — test case table
- **Docs Impact** — which docs/ files need creation or update
- **i18n** — from UX/UI expert (or "No new strings")

---

## Phase 4: PM-B — Review & Enhance (orchestrator — sequential)

**Runs AFTER Phase 3.** PM-B adversarially reviews PM-A's draft.

Critically review against this checklist:
1. **Completeness** — all expert recommendations addressed?
2. **Ticket granularity** — no tickets >8 points or <1 point?
3. **Dependencies** — correct and complete?
4. **Model assignment** — FinOps-optimal?
5. **QA coverage** — every user-facing ticket has a test case?
6. **Documentation gaps** — all docs/ sections that need updating listed?
7. **Points realism** — total 30-60 for standard sprint?
8. **Overlap** — duplicates existing backlog items?
9. **Fleet-readiness** — are ticket file boundaries clean enough for `/fleet` parallel execution? Flag tickets that touch the same files.

Output: Issues Found, Tickets to Add/Modify/Remove, QA Gaps, Fleet Conflict Risks.

---

## Phase 5: PM-C — Final Synthesis (orchestrator — sequential)

**Runs AFTER Phase 4.** Merge PM-A draft + PM-B review.

Validate:
- Sprint number is sequential
- Every ticket has: #, title, description, owner, model, points, status (🔲)
- No ticket exceeds 8 points
- Total points between 30–60 (if over 60, split into sub-sprints)
- QA plan covers every user-facing ticket
- No overlap with existing backlog tickets
- **Fleet batches are annotated** — mark which tickets can run in parallel and which are sequential

Output: The FINAL sprint plan in exact backlog format, ready to append.

---

## Phase 6: Present & Commit to Backlog (orchestrator — sequential)

1. **Show sprint summary** to the user:

```
## Sprint [N] Plan Ready

### Planning Team (via /fleet)
| Role | Contribution |
|------|-------------|
| Architect | [1-line summary] |
| UX/UI | [1-line summary, or "Not activated"] |
| Database | [1-line summary, or "Not activated"] |
| Human Experience | [1-line summary, or "Not activated"] |
| PM-A (Drafter) | Created [X]-ticket plan across [Y] phases |
| PM-B (Reviewer) | Found [X] issues, recommended [Y] changes |
| PM-C (Finalizer) | Resolved conflicts, validated format |

### Fleet Execution Preview
| Batch | Tickets (parallel) | Sequential | Reason |
|-------|-------------------|------------|--------|
| 1 | N.1, N.2, N.3 | — | No shared files |
| 2 | N.5, N.6 | N.4 | N.4 depends on N.1 |

### Sprint Preview
[Full final sprint plan from PM-C]

**Commit this sprint to specs/backlog.md?**
```

2. **Wait for user confirmation** before writing anything
3. If confirmed: append sprint to `specs/backlog.md`, update "Last Updated" date

---

## Important Rules

- **ALWAYS** use `/fleet` for Phase 2 expert analysis — they are independent
- **ALWAYS** run PMs in SEQUENCE (Phase 3 → 4 → 5) — each depends on the previous
- **NEVER** write to backlog without user confirmation
- Match the exact backlog format from existing sprints in `specs/backlog.md`
- Use FinOps model selection: small (40%), medium (45%), large (15%)
- Annotate fleet batches in the final plan so `sprint-run` knows how to dispatch
