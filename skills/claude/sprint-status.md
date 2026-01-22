# Sprint Status

Display current sprint progress and ticket status.

## Usage

```
/sprint-status [sprint_number or "all"]
```

**Examples:**
- `/sprint-status` - Show current active sprint
- `/sprint-status 4` - Show Sprint 4 status
- `/sprint-status all` - Show all sprints overview

## Instructions

When this command is invoked:

1. **Read the backlog**:
   - Read `specs/backlog.md`
   - Identify all sprints and their states

2. **Find target sprint**:
   - If no number: Find sprint marked as ACTIVE
   - If number provided: Find that specific sprint
   - If "all": Gather all sprints

3. **Calculate metrics**:
   - Count tickets by status
   - Calculate completion percentage
   - Identify blockers

4. **Display progress**:
   - Show visual progress bar
   - List all tickets with current status
   - Highlight next actionable tickets

## Output Format

### Single Sprint

```
## Sprint 4: Session Management — ACTIVE

### Progress
████████████░░░░░░░░ 60% (6/10 complete)

### Status Breakdown
- ✅ Done: 4
- 🧪 QA Review: 2
- 🔄 In Progress: 1
- 🔲 Todo: 2
- ⏸️ Blocked: 1

### Tickets
| # | Ticket | Status | Owner |
|---|--------|--------|-------|
| 4.1 | Create sessions table | ✅ Done | DB |
| 4.2 | Create SessionService | ✅ Done | Backend |
| 4.3 | Create session API | ✅ Done | Backend |
| 4.4 | Build SessionPage | 🧪 QA Review | Frontend |
| 4.5 | Build SessionCard | 🧪 QA Review | Frontend |
| 4.6 | Implement state machine | 🔄 In Progress | Backend |
| 4.7 | Add caching | 🔲 Todo | Backend |
| 4.8 | Write API tests | 🔲 Todo | QA |
| 4.9 | Integration test | ⏸️ Blocked | QA |
| 4.10 | Sprint docs | ✅ Done | Product |

### Blockers
- 4.9: Waiting for staging environment (DevOps)

### Next Actions
1. Complete QA review for 4.4, 4.5
2. Finish 4.6 implementation
3. Unblock 4.9

### Definition of Done Progress
- [x] All DB migrations applied
- [x] API endpoints functional
- [ ] All tests passing
- [ ] Sprint documentation complete
```

### All Sprints Overview

```
## Project Sprint Overview

### Completed
| Sprint | Name | Tickets | Completed |
|--------|------|---------|-----------|
| 0 | Foundation | 8 | 2026-01-10 |
| 1 | Authentication | 12 | 2026-01-12 |
| 2 | User Profiles | 10 | 2026-01-14 |
| 3 | Content Management | 11 | 2026-01-16 |

### Active
| Sprint | Name | Progress | Remaining |
|--------|------|----------|-----------|
| 4 | Session Management | 60% | 4 tickets |

### Planned
| Sprint | Name | Tickets | Dependencies |
|--------|------|---------|--------------|
| 5 | Progress Tracking | 15 | Sprint 4 |
| 6 | Gamification | 12 | Sprint 5 |

### Velocity
- Average tickets/sprint: 10.5
- Average sprint duration: 2 days
```

## Important Rules

- Always read from backlog.md for latest status
- Show clear progress visualization
- Highlight blockers prominently
- Suggest next actionable items
- Include Definition of Done progress for active sprint
