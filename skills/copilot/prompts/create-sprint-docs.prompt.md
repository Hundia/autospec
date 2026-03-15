---
description: "Generate documentation for completed sprints (summary, QA results, release notes)"
mode: "agent"
---

# Create Sprint Docs

Generate documentation for a completed sprint.

Sprint number: {{input}}

## Instructions

1. **Verify sprint is complete**:
   - Read `specs/backlog.md`
   - Ensure all tickets are ✅ Done
   - If not complete, warn user

2. **Gather sprint data**:
   - Sprint name and goal
   - All tickets with final status
   - Files changed (via git)
   - Test results

3. **Create sprint folder**: `sprints/sprint-XX-[name]/`

4. **Generate three documents**:

### Document 1: summary.md
- Goal, What's New (user-facing), Technical Summary (backend/frontend/database changes)
- Configuration Changes, Breaking Changes, Dependencies Added
- Tickets Completed table, Notes

### Document 2: qa-results.md
- Test Summary (unit/integration/e2e counts)
- Test Results by Ticket
- Test Environment info
- Coverage Report
- Issues Found & Resolved

### Document 3: release-notes.md
- What's New (user-friendly descriptions)
- Improvements, Bug Fixes
- Coming Soon teaser

5. **Update backlog**: Mark sprint as COMPLETE, add link to sprint docs

## Output Format

```
## Sprint Documentation Created

### Files Generated
- `sprints/sprint-XX-name/summary.md`
- `sprints/sprint-XX-name/qa-results.md`
- `sprints/sprint-XX-name/release-notes.md`

### Sprint Marked Complete

### Next Steps
- Review generated docs for accuracy
- Commit: `git add sprints/ && git commit -m "docs: Sprint X documentation"`
```

## Important Rules

- Don't generate docs for incomplete sprints
- Use git diff to find actual file changes
- Run tests to get real coverage numbers
- Release notes should be user-friendly, not technical
- Link documents together where appropriate
