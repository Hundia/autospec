---
name: create-sprint-docs
description: Generate documentation for completed sprints
invokable: true
---

# Create Sprint Docs

Generate comprehensive documentation for completed sprints.

## Input

The user may specify:
- A sprint number to document
- "all" to generate docs for all completed sprints missing documentation
- If not specified, document the most recently completed sprint

## Process

### 1. Identify Target Sprint

1. Read `specs/backlog.md` to find completed sprints
2. Check `sprints/` directory for existing documentation
3. Identify which sprints need documentation

### 2. Gather Sprint Data

For the target sprint, collect:
- All tickets and their final statuses from `specs/backlog.md`
- Sprint goal and theme
- Files changed (review git log if available)
- Documentation changes made
- Any bug tickets filed during the sprint

### 3. Generate Summary (`sprints/sprint-X/summary.md`)

Create the sprint summary document:

```markdown
# Sprint X Summary

## Overview
- **Goal**: [Sprint goal]
- **Duration**: [Start date] — [End date]
- **Completion**: X/Y tickets (XX%)

## Tickets

### Completed
| ID | Description | Type |
|----|-------------|------|
| X.1 | Description | Feature |
| X.2 | Description | Bug fix |

### Carried Over
| ID | Description | Reason |
|----|-------------|--------|
| X.3 | Description | Blocked by... |

## Key Deliverables
- [Major feature or change 1]
- [Major feature or change 2]

## Architecture Decisions
- [Any significant technical decisions made]
```

### 4. Generate QA Results (`sprints/sprint-X/qa-results.md`)

```markdown
# Sprint X QA Results

## Test Summary
- **Tests Run**: N
- **Tests Passed**: N
- **Tests Failed**: N
- **Coverage**: XX%

## Verification Matrix

| Ticket | Change Type | QA Method | Result |
|--------|-------------|-----------|--------|
| X.1 | API | Unit + Build | ✅ Pass |
| X.2 | UI | Build + Visual | ✅ Pass |

## Issues Found
- [Any issues discovered during QA]

## Regressions
- [Any regressions noted]
```

### 5. Generate Release Notes (`sprints/sprint-X/release-notes.md`)

```markdown
# Sprint X Release Notes

## What's New
- **Feature**: [User-facing description]
- **Improvement**: [User-facing description]

## Bug Fixes
- Fixed [description of bug fix]

## Breaking Changes
- [Any breaking changes, or "None"]

## Migration Steps
- [Any migration needed, or "None"]

## Known Issues
- [Any known issues carried forward]
```

### 6. Verify and Report

1. Ensure all generated files are properly formatted
2. Verify file paths exist: `sprints/sprint-X/`
3. Report what was generated:
   - Files created
   - Sprint metrics
   - Any missing data that should be filled in manually
