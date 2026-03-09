# Create Sprint Docs

Generate documentation for completed sprints.

## Usage

```
/create-sprint-docs [sprint_number]
```

**Example:** `/create-sprint-docs 4`

## Instructions

When this command is invoked:

1. **Verify sprint is complete**:
   - Read `specs/backlog.md`
   - Ensure all tickets are ✅ Done
   - If not complete, warn user

2. **Gather sprint data**:
   - Sprint name and goal
   - All tickets with final status
   - Files changed (via git)
   - Test results

3. **Create sprint folder**:
   - Create `sprints/sprint-XX-[name]/`

4. **Generate three documents**:

### Document 1: summary.md

```markdown
# Sprint [X]: [Name]

**Date:** [Completion Date]
**Status:** ✅ Complete
**QA:** [X/X Tests Passed](./qa-results.md)

## Goal
[Sprint goal from backlog]

## What's New (User-Facing)
- [Feature 1]: [Brief description]
- [Feature 2]: [Brief description]

## Technical Summary

### Backend Changes
| File | Change |
|------|--------|
| [path] | [description] |

### Frontend Changes
| File | Change |
|------|--------|
| [path] | [description] |

### Database Changes
| Migration | Description |
|-----------|-------------|
| [number] | [description] |

## Configuration Changes
- [New env var or config, or "None"]

## Breaking Changes
- [Description, or "None"]

## Dependencies Added
- [Package: version, or "None"]

## Tickets Completed
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| X.1 | [Description] | [Role] | [Model] |

## Notes
[Any important notes for future reference]
```

### Document 2: qa-results.md

```markdown
# Sprint [X]: QA Test Results

**Date:** [Date]
**Tester:** [Automated/Name]
**Result:** ✅ [X/X] Tests Passed

## Test Summary
| Category | Passed | Failed | Skipped |
|----------|--------|--------|---------|
| Unit | X | 0 | 0 |
| Integration | X | 0 | 0 |
| E2E | X | 0 | 0 |
| **Total** | **X** | **0** | **0** |

## Test Results by Ticket

### Ticket X.1: [Description]
- ✅ Unit tests (X/X)
- ✅ Integration tests (X/X)

### Ticket X.2: [Description]
- ✅ Unit tests (X/X)
- ✅ Component tests (X/X)

## Test Environment
| Component | Version |
|-----------|---------|
| Node.js | X.X.X |
| Database | PostgreSQL X.X |
| OS | [Platform] |

## Coverage Report
| Metric | Value | Target |
|--------|-------|--------|
| Lines | X% | 70% |
| Functions | X% | 70% |
| Branches | X% | 60% |

## Issues Found & Resolved
| Issue | Severity | Ticket | Resolution |
|-------|----------|--------|------------|
| [Description] | [H/M/L] | B.X | [How fixed] |

## Known Limitations
- [Any known issues not blocking release]
```

### Document 3: release-notes.md

```markdown
# Sprint [X]: [Name]

**Release Date:** [Date]
**Version:** [If applicable]

---

## What's New

### [Feature 1 Name]
[User-friendly description of what users can now do]

### [Feature 2 Name]
[User-friendly description]

---

## Improvements
- [Improvement 1]
- [Improvement 2]

---

## Bug Fixes
- Fixed: [Bug description, if any]

---

## Coming Soon
[Teaser for next sprint, if appropriate]

---

## Feedback
[How to provide feedback or report issues]
```

5. **Update backlog**:
   - Mark sprint as COMPLETE
   - Add link to sprint docs

## Output Format

```
## Sprint Documentation Created

### Files Generated
- `sprints/sprint-04-sessions/summary.md`
- `sprints/sprint-04-sessions/qa-results.md`
- `sprints/sprint-04-sessions/release-notes.md`

### Sprint Marked Complete
Sprint 4: Session Management — ✅ COMPLETE

### Next Steps
- Review generated docs for accuracy
- Commit: `git add sprints/ && git commit -m "docs: Sprint 4 documentation"`
- Start Sprint 5 planning
```

## Important Rules

- Don't generate docs for incomplete sprints
- Use git diff to find actual file changes
- Run tests to get real coverage numbers
- Release notes should be user-friendly, not technical
- Link documents together where appropriate
