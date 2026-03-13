# Sprint Status

Display current sprint progress with health indicators and model cost tracking.

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
   - Calculate model distribution (FinOps)

4. **Determine health**:
   - 🟢 On Track: ≥ 80% of expected progress
   - 🟡 At Risk: 60-79%
   - 🔴 Behind: < 60%

5. **Display progress**:
   - Show visual progress bar
   - List all tickets with current status
   - Show model distribution
   - Highlight next actionable tickets

## Output Format

### Single Sprint

```
## Sprint 4: Session Management — 🟢 On Track

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

### Model Distribution (FinOps)
| Model | Tickets | % | Target |
|-------|---------|---|--------|
| Haiku | 4 | 40% | 40% ✅ |
| Sonnet | 5 | 50% | 45% ✅ |
| Opus | 1 | 10% | 15% ✅ |

### Tickets
| # | Ticket | Status | Owner | Model | Deps |
|---|--------|--------|-------|-------|------|
| 4.1 | Create sessions table | ✅ | DB | haiku | — |
| 4.2 | Create SessionService | ✅ | Backend | sonnet | 4.1 |
| 4.6 | State machine | 🔄 | Backend | opus | 4.2 |

### Blockers
- ⏸️ 4.9: Waiting for staging environment (DevOps)

### Next Actions
1. Complete QA review for 4.4, 4.5
2. Finish 4.6 implementation
3. Unblock 4.9 (DevOps dependency)
```

### All Sprints Overview

```
## Project Sprint Overview

### Health: 🟢 On Track

| Sprint | Name | Status | Progress | Tickets |
|--------|------|--------|----------|---------|
| 0 | Foundation | ✅ Complete | 100% | 8/8 |
| 1 | Auth | ✅ Complete | 100% | 12/12 |
| 4 | Sessions | 🔄 Active | 60% | 6/10 |
| 5 | Progress | 🔲 Planned | 0% | 0/15 |

### Velocity
- Average: 10.5 tickets/sprint
- Last sprint: 12 tickets
- Projected completion: Sprint 6

### FinOps Summary
| Model | Total Tickets | Cost Share |
|-------|--------------|------------|
| Haiku | 24 (42%) | ~$12 |
| Sonnet | 26 (45%) | ~$45 |
| Opus | 8 (14%) | ~$28 |
```

## Important Rules

- Always read from backlog.md for latest status
- Show clear progress visualization
- Include health indicator (🟢🟡🔴)
- Highlight blockers prominently
- Include FinOps model distribution
- Suggest next actionable items
