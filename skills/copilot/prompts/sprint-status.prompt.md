---
description: "Display current sprint progress with health indicators and model cost tracking"
mode: "ask"
---

# Sprint Status

Display sprint progress with health indicators and model cost tracking.

Sprint to check: {{input}}

## Instructions

1. **Read the backlog**: Read `specs/backlog.md` and identify all sprints and their states.

2. **Find target sprint**:
   - If no number provided: Find sprint marked as ACTIVE
   - If number provided: Find that specific sprint
   - If "all": Gather all sprints

3. **Calculate metrics**:
   - Count tickets by status (🔲, 🔄, 🧪, ✅, ⏸️)
   - Calculate completion percentage
   - Identify blockers
   - Calculate model distribution (FinOps)

4. **Determine health**:
   - 🟢 On Track: ≥ 80% of expected progress
   - 🟡 At Risk: 60-79%
   - 🔴 Behind: < 60%

5. **Display progress**:

### Single Sprint Format
```
## Sprint X: [Name] — 🟢 On Track

### Progress
████████████░░░░░░░░ 60% (6/10 complete)

### Status Breakdown
| Status | Count |
|--------|-------|
| ✅ Done | 4 |
| 🧪 QA Review | 2 |
| 🔄 In Progress | 1 |
| 🔲 Todo | 2 |
| ⏸️ Blocked | 1 |

### Tickets
| # | Ticket | Status | Owner | Model | Deps |
|---|--------|--------|-------|-------|------|

### Blockers
- ⏸️ X.Y: [Description]

### Next Actions
1. [Actionable item]
```

### All Sprints Format
```
## Project Sprint Overview

| Sprint | Name | Status | Progress | Tickets |
|--------|------|--------|----------|---------|

### Velocity
- Average: X tickets/sprint
- Projected completion: Sprint Y
```

## Important Rules

- Always read from `specs/backlog.md` for latest status
- Show clear progress visualization
- Include health indicator (🟢🟡🔴)
- Highlight blockers prominently
- Include FinOps model distribution
- Suggest next actionable items
