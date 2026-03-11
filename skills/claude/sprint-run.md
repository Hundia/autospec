# Sprint Run

Execute an entire sprint end-to-end: plan → implement → QA → docs → close.

## Usage

```
/sprint-run [sprint_number]
```

**Example:** `/sprint-run 4`

## Instructions

Execute the sprint through 8 phases. Get user confirmation after Phase 1 before proceeding.

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

### Phase 1.5: Viewer Planning Data

After the user approves the execution plan, populate the viewer with planning visualizations so stakeholders can review the sprint plan visually before implementation begins.

1. Open `viewer/src/data/sprints.ts`
2. Add a new `SprintVisualization` entry for this sprint:
   - `planning.overview`: 2-3 sentence summary of what the sprint builds
   - `planning.flowSteps` + `planning.flowConnections`: FlowDiagram data showing the key workflow being built (start → process → decision → end pattern)
   - `planning.dependencyGraph`: If the sprint has multi-component changes, include nodes + edges showing ticket dependencies
   - `planning.sequenceDiagram`: If the sprint involves multi-actor interactions, include actors + messages
3. Update `viewer/src/data/backlog.ts` if the sprint isn't already there — add the Sprint entry with all tickets
4. Build and verify the viewer: `cd viewer && npm run build`
5. The user can now review planning visualizations at `/sprint/:id` → Planning tab before approving execution

**Skip conditions:** If the sprint is trivially small (< 5 pts) or docs-only, skip this phase.

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

### Phase 5b: Viewer Retrospective Data

After closing the sprint, populate the viewer with retrospective visualizations.

1. Open `viewer/src/data/sprints.ts`
2. Update the sprint's `SprintVisualization` entry with retrospective data:
   - `retrospective.completedAt`: Today's date
   - `retrospective.timeline`: If the sprint had execution phases, add TimelinePhase data showing the Gantt-style execution
   - `retrospective.agentRadar`: If multiple agents were used (Opus orchestrator + Sonnet agents), include AgentData showing capabilities used
   - `retrospective.keyMetrics`: Points delivered, tickets completed, files changed, etc.
   - `retrospective.highlights`: What went well (2-4 bullet points)
   - `retrospective.challenges`: What was difficult (1-3 bullet points)
3. Update `viewer/src/data/backlog.ts` — ensure all ticket statuses match final state
4. Build and verify the viewer: `cd viewer && npm run build`

**Skip conditions:** If the sprint is trivially small (< 5 pts) or docs-only, skip this phase.

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
