---
description: "Execute an entire sprint end-to-end: plan → implement → QA → docs → close"
mode: "agent"
---

# Sprint Run

Execute an entire sprint end-to-end: plan → implement → QA → docs → close.

Sprint to execute: {{input}}

## Phase 1: Sprint Briefing

1. Read `specs/backlog.md` — find the target sprint
2. Read ALL relevant spec files referenced by the sprint's tickets
3. Read relevant `docs/` sections for context
4. Build execution plan:
   - Order tickets by dependencies (DAG sort)
   - Identify parallelizable batches (tickets with no mutual dependencies)
   - Map each ticket to recommended model
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

Shall I proceed with execution?
```

## Phase 1.5: Viewer Planning Data

After user approves, populate viewer with planning visualizations:
1. Update `viewer/src/data/sprints.ts` with `SprintVisualization` entry
2. Update `viewer/src/data/backlog.ts` if sprint isn't already there
3. Build and verify: `cd viewer && npm run build`

**Skip if:** sprint is < 5 pts or docs-only.

## Phase 2: Ticket Execution

For each ticket (in dependency order):
1. Update backlog: 🔲 → 🔄
2. Read relevant docs + specs
3. Implement the ticket
4. Write tests
5. Update backlog: 🔄 → 🧪

Parallelize independent tickets where possible.

## Phase 3: QA Verification

1. Run full test suite
2. Fix any regressions
3. For bug fixes: verify the original bug is resolved
4. Add new test cases for untested features
5. Re-run until all tests pass

```bash
npm test                     # Full suite
npm run lint                 # Code quality
npm run build                # Build verification
```

## Phase 4: Documentation Update

For each completed ticket:
1. Update relevant `docs/` section
2. Ensure architecture/flow docs reflect changes
3. Update `docs/` index if new sections added

## Phase 5: Sprint Close

1. Mark all tickets ✅ Done in `specs/backlog.md`
2. Create `sprints/sprint_X/` directory
3. Generate `sprints/sprint_X/summary.md` with:
   - Completed tickets table with docs references
   - Key files modified
   - QA & test results
   - Documentation updated section
   - Retrospective
4. Update sprint status to COMPLETE in backlog

## Phase 5b: Viewer Retrospective Data

Update viewer with retrospective visualizations:
1. Update sprint's `SprintVisualization` in `viewer/src/data/sprints.ts`
2. Update `viewer/src/data/backlog.ts` — match all ticket statuses
3. Build viewer: `cd viewer && npm run build`

**Skip if:** sprint is < 5 pts or docs-only.

## Phase 6: Final Report

Present summary:
- Tickets completed vs planned
- Test results
- Docs updated
- Files ready for git commit

## Important Rules

- ALWAYS get user confirmation after Phase 1 before executing
- ALWAYS run QA before closing (Phase 3 before Phase 5)
- ALWAYS update docs (Phase 4 before Phase 5)
- Parallelize independent tickets where possible
- Never mark sprint complete with failing tests
