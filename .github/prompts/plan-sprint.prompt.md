---
description: "Assemble expert AI agents to collaboratively plan a sprint before building it"
mode: "agent"
---

# Plan Sprint

Assemble a team of expert AI agents to collaboratively plan a sprint. Experts analyze the goal in parallel, then three PMs (drafter → reviewer → finalizer) produce a production-ready sprint plan for the backlog.

The user's sprint goal: {{input}}

## Phase 1: Goal Analysis & Expert Selection

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

## Phase 2: Expert Analysis (PARALLEL)

Run all activated experts simultaneously. Each expert reads its assigned spec files and docs, then produces a structured analysis.

### Architect Agent
- System Impact Assessment, API Design, File Structure, Technical Approach, Integration Points, Risks & Mitigations, Estimated Complexity

### UX/UI Expert (when activated)
- User Flows, Component Design, Page Layout, Accessibility Requirements, data-testid Attributes, i18n Keys

### Database Expert (when activated)
- Schema Changes, Migration Plan, Query Patterns, Data Integrity, Rollback Strategy

### Human Experience Expert (when activated)
- Persona Impact, User Journey Map, Cognitive Load Assessment, Error Recovery, Edge Cases, Success Metrics

## Phase 3: PM-A — Draft Sprint Plan

Synthesize expert analyses into a complete draft with:
- Problem Statement, User Stories, Technical Decisions
- Schema Changes (from DB Expert)
- Phased Tickets table: `| # | Ticket | Description | Owner | Model | Points | Status | Depends On |`
- QA Plan, Docs Impact, i18n

## Phase 4: PM-B — Review & Enhance

Critically review PM-A's draft against:
1. Completeness — all expert recommendations addressed?
2. Ticket granularity — no tickets >8 points or <1 point?
3. Dependencies — correct and complete?
4. Model assignment — FinOps-optimal?
5. QA coverage — every user-facing ticket has a test case?
6. Documentation gaps — all docs/ sections that need updating listed?
7. Points realism — total 30-60 for standard sprint?
8. Overlap — duplicates existing backlog items?

## Phase 5: PM-C — Final Synthesis

Merge PM-A draft + PM-B review into the FINAL sprint plan. Validate:
- Sprint number is sequential
- Every ticket has: #, title, description, owner, model, points, status (🔲)
- No ticket exceeds 8 points
- Total points between 30–60 (if over 60, split into sub-sprints)
- QA plan covers every user-facing ticket
- No overlap with existing backlog tickets

## Phase 6: Present & Commit to Backlog

1. Show the complete sprint plan to the user
2. **Wait for user confirmation** before writing anything
3. If confirmed: append to `specs/backlog.md`, update "Last Updated" date

## Important Rules

- Run experts in PARALLEL (Phase 2) — they are independent
- Run PMs in SEQUENCE — each depends on the previous
- NEVER write to backlog without user confirmation
- Match the exact backlog format from existing sprints
- Use FinOps model selection: small (40%), medium (45%), large (15%)
