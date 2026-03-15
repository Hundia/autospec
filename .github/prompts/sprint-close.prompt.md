---
description: "Close a completed sprint and generate summary documentation with docs cross-references"
mode: "agent"
---

# Sprint Close

Close a completed sprint and generate summary documentation.

Sprint to close: {{input}}

## Instructions

1. **Verify sprint is ready to close**:
   - Read `specs/backlog.md`
   - Check all tickets are ✅ Done or ⏸️ Blocked (with justification)
   - If any tickets are still 🔄 or 🧪, warn the user

2. **Gather sprint data**:
   - Sprint name, goal, and metadata
   - All tickets with final status
   - Files changed (via `git diff` or `git log`)
   - Test results from latest test run
   - Documentation files created or updated

3. **Create sprint summary directory**: `sprints/sprint_X/` if it doesn't exist

4. **Generate `sprints/sprint_X/summary.md`**:

```markdown
# Sprint X Summary

**Date:** YYYY-MM-DD
**Status:** ✅ COMPLETE
**Theme:** [Sprint theme]

## Overview
[2-3 sentence executive summary]

## Completed Tickets
| # | Ticket | Description | Status | Docs |
|---|--------|-------------|--------|------|

## Documentation Updated
| Doc File | Change | Related Tickets |
|----------|--------|-----------------|

## Key Files Modified
[Table of files changed]

## QA & Test Results
| Suite | Pass | Fail | Total | Notes |
|-------|------|------|-------|-------|

## Retrospective
### What went well
### What to improve
```

5. **Update viewer data**:
   - Update `viewer/src/data/backlog.ts` — match all ticket statuses
   - Update `viewer/src/data/sprints.ts` — add retrospective data
   - Build viewer: `cd viewer && npm run build`

6. **Update backlog**: Mark sprint as COMPLETE with completion date

7. **Recommend git tag**: `git tag -a sprint-X-complete -m "Sprint X Complete: [Name]"`

## Important Rules

- Never close a sprint with failing tests
- ALWAYS include "Documentation Updated" section in summary
- ALWAYS cross-reference docs files in ticket table
- Generate actual test data, not placeholders
