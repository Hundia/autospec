# Plan Sprint

Assemble a team of expert AI agents to collaboratively plan a sprint before building it. Experts analyze the goal in parallel, then three PMs (drafter → reviewer → finalizer) produce a production-ready sprint plan for the backlog.

## Usage

```
/plan-sprint [goal description]
```

**Examples:**
- `/plan-sprint Add user authentication with JWT and social login`
- `/plan-sprint Refactor payment processing to support subscriptions`
- `/plan-sprint Build admin dashboard with analytics and user management`

## Instructions

When this command is invoked, execute the 6-phase planning workflow below. The argument `$ARGUMENTS` is the sprint goal description.

---

### Phase 1: Goal Analysis & Expert Selection

1. **Validate the goal.** If `$ARGUMENTS` is empty or too vague (fewer than 5 words, no clear deliverable), ask the user to clarify:
   ```
   I need a clearer sprint goal. Please describe:
   - What feature/fix/improvement you want
   - Who it's for (which user personas)
   - Any specific subsystems involved

   Example: "Add user authentication with JWT, social login, and role-based access control"
   ```

2. **Read `specs/backlog.md`** — scan all `## Sprint X` headers to determine the next sprint number.

3. **Read `docs/` index** — identify which subsystems the goal touches. Cross-reference with existing documentation sections.

4. **Determine which experts to activate** based on the goal:

   | Expert | Role | Activate When | Reads |
   |--------|------|---------------|-------|
   | **Architect** | System design, API contracts, integration | ALWAYS | `specs/02_backend_lead.md`, `specs/03_frontend_lead.md`, project entry points, relevant `docs/` |
   | **UX/UI Expert** | User flows, components, accessibility | Sprint has ANY frontend/GUI work | `specs/10_ui_designer.md`, `docs/ui-design-system/`, `docs/flows/` |
   | **Database Expert** | Schema changes, migrations, query patterns | Sprint has schema changes or new models | `specs/04_db_architect.md`, `docs/architecture/database.md`, schema file |
   | **Human Experience Expert** | User journeys, personas, cognitive load | Sprint has user-facing features | `specs/01_product_manager.md`, relevant `docs/flows/` for affected user journeys |

5. **Announce the plan** to the user:
   ```
   ## Sprint [N] Planning: [Goal Title]

   ### Activated Experts
   | Expert | Reason |
   |--------|--------|
   | Architect | [why] |
   | UX/UI | [why, or "Skipped — no frontend work"] |
   | Database | [why, or "Skipped — no schema changes"] |
   | Human Experience | [why, or "Skipped — no user-facing features"] |

   ### Subsystems Affected
   [List of docs/ sections that will be consulted]

   Starting expert analysis...
   ```

---

### Phase 2: Expert Analysis (PARALLEL)

Launch all activated experts simultaneously as **parallel Task agents**. Each expert reads its assigned spec files and docs, then produces a structured analysis.

**IMPORTANT:** Run all expert agents in parallel — they are independent of each other.

#### Architect Agent

Reads: `specs/02_backend_lead.md`, `specs/03_frontend_lead.md`, project entry points, relevant `docs/` sections.

Produces:
- **System Impact Assessment** — new/modified modules, cross-module dependencies
- **API Design** — endpoint table (path, method, auth, description)
- **File Structure** — proposed new/modified files
- **Technical Approach** — step-by-step implementation plan
- **Integration Points** — how this connects to existing subsystems
- **Risks & Mitigations** — risk table with impact and mitigation
- **Estimated Complexity** — backend/frontend complexity rating + total points estimate

#### UX/UI Expert (when activated)

Reads: `specs/10_ui_designer.md`, `docs/ui-design-system/`, `docs/flows/`.

Produces:
- **User Flows** — step-by-step or Mermaid flowchart for each new/modified flow
- **Component Design** — table of new/modified components with props and notes
- **Page Layout** — layout description for new/modified pages
- **Accessibility Requirements** — ARIA, keyboard nav, screen reader, color contrast
- **data-testid Attributes** — testable element identifiers
- **i18n Keys Needed** — new translation keys with values

#### Database Expert (when activated)

Reads: `specs/04_db_architect.md`, `docs/architecture/database.md`, database schema file.

Produces:
- **Schema Changes** — model/table changes with fields, constraints, indexes
- **Migration Plan** — ordered migration steps with data backfill notes
- **Multi-Tenant Impact** — how tenant isolation is maintained (if applicable)
- **Query Patterns** — new queries with complexity and index recommendations
- **Data Integrity** — foreign keys, cascades, unique constraints, edge cases
- **Rollback Strategy** — how to safely reverse the migration

#### Human Experience Expert (when activated)

Reads: `specs/01_product_manager.md`, relevant `docs/flows/` sections.

Produces:
- **Persona Impact** — how each user persona is affected, with priority
- **User Journey Map** — primary flow with touchpoints and emotions
- **Cognitive Load Assessment** — new concepts, learning curve, discoverability
- **Error Recovery** — error scenarios with user-facing messages and recovery paths
- **Edge Cases** — connectivity loss, empty states, data overflow
- **Success Metrics** — what to measure, baseline, target

---

### Phase 3: PM-A — Draft Sprint Plan

**Runs SEQUENTIALLY after Phase 2.** PM-A needs all expert analyses.

Launch a Task agent that:
1. Reads `specs/01_product_manager.md` for PM methodology
2. Receives all expert analyses from Phase 2
3. Synthesizes into a complete draft sprint plan

**Draft output format:**
```markdown
## Sprint [N]: [Title]

**Goal:** [1-2 sentence goal]
**Duration:** [estimate]
**Status:** 🔲 Planned

### Problem Statement
[What problem does this sprint solve? Who feels the pain?]

### User Stories
- As a [persona], I want [action] so that [benefit]

### Technical Decisions
| Decision | Choice | Rationale |
|----------|--------|-----------|

### Schema Changes
[From Database Expert, or "None"]

### Phased Tickets

#### Phase 1: [Phase Name] ([total points] pts)

| # | Ticket | Description | Owner | Model | Points | Status | Depends On |
|---|--------|-------------|-------|-------|--------|--------|------------|
| [N].1 | [Title] | [Detailed description] | [Backend/Frontend/Fullstack/DB] | [haiku/sonnet/opus] | [1-8] | 🔲 | — |

[Continue phases...]

### QA Plan
| TC | Test | Type | Description |
|----|------|------|-------------|

### Docs Impact
| Doc File | Action | Description |
|----------|--------|-------------|

### i18n
[From UX/UI expert, or "No new strings needed"]

**Total: [X] points, [Y] tickets**
```

---

### Phase 4: PM-B — Review & Enhance

**Runs SEQUENTIALLY after Phase 3.** PM-B adversarially reviews PM-A's draft.

Launch a Task agent that:
1. Reads `specs/05_qa_lead.md` for QA requirements
2. Receives PM-A's draft plan + expert analyses
3. Critically reviews against this checklist:

**Review checklist:**
1. **Completeness** — all expert recommendations addressed?
2. **Ticket granularity** — no tickets >8 points or <1 point?
3. **Dependencies** — correct and complete?
4. **Model assignment** — FinOps-optimal? (haiku=simple, sonnet=complex, opus=architectural)
5. **QA coverage** — every user-facing ticket has a test case?
6. **Documentation gaps** — all docs/ sections that need updating listed?
7. **Points realism** — total 30-60 for standard sprint?
8. **Overlap** — duplicates existing backlog items?

**Review output format:**
- Issues Found (severity, category, issue, recommendation)
- Tickets to Add/Modify/Remove
- QA Coverage Gaps
- Documentation Gaps
- Model/Points Adjustments
- Overall Assessment

---

### Phase 5: PM-C — Final Synthesis

**Runs SEQUENTIALLY after Phase 4.** PM-C merges draft + review.

Launch a Task agent that:
1. Incorporates all valid PM-B recommendations
2. Resolves conflicts between PM-A and PM-B
3. Produces the FINAL sprint plan matching **exact backlog format**

**Validation checklist (PM-C must verify):**
- [ ] Sprint number is sequential (next after highest in backlog)
- [ ] Every ticket has: #, title, description, owner, model, points, status (🔲)
- [ ] No ticket exceeds 8 points
- [ ] Total points between 30–60 (if over 60, split into sub-sprints N.1, N.2)
- [ ] QA plan covers every user-facing ticket
- [ ] Docs Impact lists every docs/ file that needs creation or update
- [ ] No overlap with existing backlog tickets
- [ ] Dependencies between tickets noted in descriptions

**Output:** Only the final sprint plan in exact backlog format, ready to append to `specs/backlog.md`.

---

### Phase 6: Present & Commit to Backlog

1. **Show sprint summary** to the user:
   ```
   ## Sprint [N] Plan Ready

   ### Planning Team
   | Role | Contribution |
   |------|-------------|
   | Architect | [1-line summary] |
   | UX/UI | [1-line summary, or "Not activated"] |
   | Database | [1-line summary, or "Not activated"] |
   | Human Experience | [1-line summary, or "Not activated"] |
   | PM-A (Drafter) | Created [X]-ticket plan across [Y] phases |
   | PM-B (Reviewer) | Found [X] issues, recommended [Y] changes |
   | PM-C (Finalizer) | Resolved conflicts, validated format |

   ### Sprint Preview
   [Full final sprint plan from PM-C]

   **Commit this sprint to `specs/backlog.md`?**
   ```

2. **Wait for user confirmation** before writing anything:
   - "Commit to backlog" → append sprint to `specs/backlog.md`
   - "Modify first" → ask what to change, apply, re-present
   - "Discard" → do nothing

3. **If confirmed:**
   - Append final sprint plan to `specs/backlog.md` (before Bug Backlog section if one exists)
   - Update "Last Updated" date in backlog
   - Update docs index if new documentation sections are introduced
   - Report what was written

---

## Edge Cases

### Sprint goal too vague
Ask user to clarify with specific examples (see Phase 1 step 1).

### Goal overlaps with existing tickets
Surface the overlap and ask: "(a) build on existing, (b) replace it, (c) treat as separate?"

### Expert finds blocking prerequisite
Add a "Phase 0: Prerequisites" section with the blocking work.

### Sprint too large (>60 points)
PM-C splits into sub-sprints: Sprint N.1, N.2, etc. Each is self-contained and independently deployable.

### Backend-only sprint
Skip UX/UI Expert and Human Experience Expert. Only Architect (+ Database if schema changes).

### Frontend-only sprint
Skip Database Expert. Activate Architect + UX/UI Expert + Human Experience Expert.

### Goal requires research first
Add "Phase 0: Research & Spike" with investigation tickets (1-2 points each).

## Important Rules

- ALWAYS run experts in PARALLEL (Phase 2) — they are independent
- ALWAYS run PMs in SEQUENCE — each depends on the previous
- NEVER write to backlog without user confirmation
- ALWAYS match the exact backlog format from existing sprints in `specs/backlog.md`
- Use today's date for the planned date field
- Test case numbers continue from the highest existing TC-XX in the backlog
- Sprint numbers must be sequential
- Keep expert analyses in structured templates for auditability
- Use FinOps model selection: haiku (40% — simple), sonnet (45% — complex), opus (15% — architectural)
