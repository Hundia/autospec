# Sprint Run

Execute an entire sprint end-to-end: plan → implement → QA → docs → close.

## Usage

```
/sprint-run [sprint_number]
```

**Example:** `/sprint-run 4`

## Instructions

Execute the sprint through 6 phases. Get user confirmation after Phase 1 before proceeding.

---

### Phase 1: Sprint Briefing

1. Read `specs/backlog.md` — find the target sprint
2. Read ALL relevant spec files referenced by the sprint's tickets
3. Read relevant `docs/` sections for context
4. Build execution plan:
   - Order tickets by dependencies (DAG sort)
   - Identify parallelizable batches (tickets with no mutual dependencies)
   - Map each ticket to recommended model (FinOps)
5. **Present plan to user and WAIT for confirmation before proceeding**

**Output:**
```
## Sprint X: [Name] — Execution Plan

### Tickets (ordered by dependencies)
| # | Ticket | Owner | Model | Dependencies | Batch |
|---|--------|-------|-------|-------------|-------|

### Estimated Batches
- Batch 1 (parallel): X.1, X.2, X.3
- Batch 2 (sequential): X.4 (depends on X.1)
- Batch 3 (parallel): X.5, X.6

Shall I proceed with execution?
```

---

### Orchestrator + Agent Execution Pattern (Recommended for multi-sprint)

When running multiple sprints or large batches, use the **Opus Orchestrator + Sonnet Agent** pattern:

1. **Orchestrator (Opus 4.6)** — never implements directly. Instead:
   - Writes `agents/sprint-X-brief.md` with full context package
   - Spawns `Agent(subagent_type=general-purpose)` for each sprint
   - Reviews results, merges, then spawns next batch

2. **Sprint Agent (Sonnet 4.6)** — reads brief, implements all tickets:
   - Reads `agents/sprint-X-brief.md` for full context
   - Executes tickets per `execute-ticket.md` conventions
   - Updates `specs/backlog.md` (🔲→✅), docs/, sprint summary

3. **Parallel batches** — sprints with no dependencies run as parallel agents in ONE message:
   ```
   Turn N: spawn Agent A (Sprint 2) + Agent B (Sprint 3) + Agent C (Sprint 4)
   Turn N+1: merge results → spawn Agent D (Sprint 5)
   ```

**Brief file format:** `agents/sprint-X-brief.md`
- Exact file paths to read
- Code snippets (no hallucination of values)
- File tree to create
- Conventions and forbidden patterns
- Verification checklist

---

### Phase 2: Ticket Execution

For each ticket (in dependency order):
1. Update backlog: 🔲 → 🔄
2. Read relevant docs + specs
3. Implement the ticket
4. Write tests
5. Update backlog: 🔄 → 🧪

**Parallelize independent tickets** using Task agents where possible.

---

### Phase 3: QA Verification

1. Run full test suite
2. Fix any regressions
3. For bug fixes: verify the original bug is resolved
4. Add new test cases for untested features
5. Re-run until all tests pass

```bash
npm test                     # Full suite
npm run lint                 # Code quality
npm run typecheck            # Type safety
npm run build                # Build verification
```

---

### Phase 4: Documentation Update

For each completed ticket:
1. Update relevant `docs/` section
2. Ensure architecture/flow docs reflect changes
3. Update `docs/` index or navigation if new sections added

---

### Phase 5: Sprint Close

1. Mark all tickets ✅ Done in `specs/backlog.md`
2. Create `sprints/sprint_X/` directory
3. Generate `sprints/sprint_X/summary.md` with:
   - Completed tickets table with docs references
   - Key files modified
   - QA & test results
   - Documentation updated section
   - Retrospective
4. Update sprint status to COMPLETE in backlog
5. Create git tag: `sprint-X-complete`

---

### Phase 6: Final Report

Present summary to user:
- Tickets completed vs planned
- Test results (pass/fail/coverage)
- Docs updated
- Files ready for git commit

## Important Rules

- ALWAYS get user confirmation after Phase 1 before executing
- ALWAYS run QA before closing (Phase 3 before Phase 5)
- ALWAYS update docs (Phase 4 before Phase 5)
- Parallelize independent tickets where possible
- Use recommended models from backlog for cost efficiency
- Never mark sprint complete with failing tests
