---
name: sprint-status
description: Show sprint progress with health indicators
invokable: true
---

# Sprint Status

Display current sprint progress with metrics, health indicators, and FinOps distribution.

## Input

Optional: sprint number. If not provided, show the most recent/active sprint.

## Execution Steps

### 1. Read Backlog
- Open `specs/backlog.md`
- Identify the current/specified sprint section
- Parse all tickets and their statuses

### 2. Calculate Metrics
Count tickets by status:
- 🔲 Todo
- 🔄 In Progress
- 🧪 QA Review
- ✅ Done
- ⏸️ Blocked

Calculate:
- **Completion rate:** Done / Total tickets (percentage)
- **Active rate:** In Progress / Total tickets
- **Block rate:** Blocked / Total tickets
- **Remaining:** Todo + In Progress + QA Review + Blocked

### 3. Generate Progress Bar
Create a visual progress bar (20 characters wide):

```
Progress: [████████████░░░░░░░░] 60% (12/20)
```

Use filled blocks (█) for done, partial (▓) for in-progress, empty (░) for remaining.

### 4. Health Indicator
Assess sprint health:

| Health | Condition |
|--------|-----------|
| 🟢 Healthy | Block rate < 10%, completion on track |
| 🟡 At Risk | Block rate 10-25% or behind schedule |
| 🔴 Critical | Block rate > 25% or significantly behind |

### 5. FinOps Distribution
Show recommended model usage for remaining work:

| Model | Target % | Suggested Tasks |
|-------|----------|----------------|
| Haiku | ~40% | Status checks, doc reads, formatting |
| Sonnet | ~45% | Implementation, testing, code review |
| Opus | ~15% | Architecture, complex debugging |

## Output Format

```
╔══════════════════════════════════════════╗
║          Sprint X Status                 ║
╠══════════════════════════════════════════╣
║ Progress: [████████████░░░░░░░░] 60%    ║
║ Health:   🟢 Healthy                     ║
╠══════════════════════════════════════════╣
║ ✅ Done:        12                        ║
║ 🔄 In Progress:  3                        ║
║ 🧪 QA Review:    1                        ║
║ 🔲 Todo:         3                        ║
║ ⏸️ Blocked:      1                        ║
║ Total:          20                        ║
╠══════════════════════════════════════════╣
║ Blocked Tickets:                         ║
║  - X.5: Waiting on API spec             ║
╚══════════════════════════════════════════╝
```

Then list each ticket with its current status for quick reference.
