---
name: sprint-run
description: "Execute entire sprint: plan → implement → QA → docs → close"
invokable: true
---

# Sprint Run

Execute an entire sprint from start to finish, following all SDD phases sequentially.

## Input

The user should specify which sprint to run (e.g., "Sprint 14"). If not provided, read `specs/backlog.md` to identify the current active sprint.

## Important Note

Continue does not support spawning sub-agents. This command executes all phases sequentially in a single session. For large sprints, consider running `/execute-ticket` on individual tickets instead.

## Execution Phases

### Phase 1: Briefing
1. Read `specs/backlog.md` to identify all tickets in the target sprint
2. List all tickets with their statuses, dependencies, and descriptions
3. Determine execution order based on dependencies
4. Estimate effort and identify any blockers
5. Present the sprint plan to the user for confirmation

### Phase 2: Execution
For each ticket in dependency order:
1. Update status to 🔄 In Progress
2. Read relevant specs and docs
3. Implement the ticket (code, tests, etc.)
4. Run initial verification (build + tests)
5. If a ticket fails, note it and continue to the next independent ticket

### Phase 3: QA Review
For all implemented tickets:
1. Run full test suites: `cd cli && npm test` and/or `cd viewer && npm run build`
2. Verify each ticket's acceptance criteria
3. Check for regressions across the sprint's changes
4. Mark passing tickets as 🧪 → ✅
5. Mark failing tickets with notes for follow-up

### Phase 4: Documentation
1. Update `docs/` for every completed ticket
2. Ensure new subsystems have their `docs/<subsystem>/` directories
3. Verify doc changes match actual implementation

### Phase 5: Close
1. Create `sprints/sprint-X/` directory if it doesn't exist
2. Generate `sprints/sprint-X/summary.md` with:
   - Sprint goal and scope
   - Completed tickets list
   - Failed/deferred tickets (if any)
   - Key decisions and trade-offs
   - Metrics (tickets planned vs completed)
3. Update `specs/backlog.md` sprint section status

### Phase 6: Report
Present a final summary:
- Tickets completed vs planned
- Tests passed/failed
- Documentation updated
- Any follow-up items for the next sprint
- Overall sprint health assessment

## Output

Final sprint report with completion metrics and any carry-over items.
