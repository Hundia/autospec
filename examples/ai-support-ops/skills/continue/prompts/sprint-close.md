---
name: sprint-close
description: Close sprint and generate summary documentation
invokable: true
---

# Sprint Close

Close the current sprint and generate summary documentation.

## Input

The user may specify a sprint number. If not provided, read `specs/backlog.md` to identify the current active sprint.

## Process

### 1. Verify Ready to Close

Read `specs/backlog.md` and check:
- Are all tickets in a terminal state (✅ Done or ⏸️ Blocked)?
- Are there any tickets still 🔄 In Progress or 🧪 QA Review?
- If non-terminal tickets exist, list them and ask the user how to proceed:
  - Complete them now
  - Carry them to the next sprint
  - Mark as blocked with a reason

### 2. Gather Sprint Data

Collect from `specs/backlog.md`:
- Sprint number and goal
- All ticket IDs, descriptions, and final statuses
- Any notes or implementation details on tickets
- Bug tickets filed during the sprint

Read from the codebase:
- Key files changed during the sprint
- Documentation updated

### 3. Create Summary Directory

```bash
mkdir -p sprints/sprint-X
```

### 4. Generate Summary

Create `sprints/sprint-X/summary.md` with:

```markdown
# Sprint X Summary

## Goal
[Sprint goal from backlog]

## Dates
- **Started**: [date]
- **Closed**: [today's date]

## Results

| Metric | Count |
|--------|-------|
| Planned | N |
| Completed | N |
| Blocked/Carried | N |
| Completion Rate | XX% |

## Completed Tickets
- ✅ **X.1** — Description
- ✅ **X.2** — Description

## Carried Over
- ⏸️ **X.3** — Description (Reason: ...)

## Key Changes
- [Major change 1]
- [Major change 2]

## Documentation Updated
- [doc path 1]
- [doc path 2]

## Lessons Learned
- [Any issues encountered and how they were resolved]

## Next Sprint Recommendations
- [Carry-over items]
- [New items discovered during this sprint]
```

### 5. Update Backlog

In `specs/backlog.md`:
- Mark the sprint section as closed
- Move carry-over tickets to the next sprint section
- Ensure all completed tickets show ✅

### 6. Report

Confirm the sprint closure to the user with a summary of outcomes.
