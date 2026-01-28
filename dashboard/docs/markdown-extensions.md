# AutoSpec Dashboard - Markdown Extensions

This document describes the extended markdown formats used by the AutoSpec Dashboard to track agent activity, prompts, and execution metrics.

## Backlog Extensions

The `backlog.md` file now supports additional columns for tracking execution details:

### Standard Format
```markdown
| # | Ticket | Status | Owner | Model | Depends |
|---|--------|--------|-------|-------|---------|
| 1.1 | Create users table | ✅ Done | DB | haiku | - |
```

### Extended Format (with Agent Tracking)
```markdown
| # | Ticket | Status | Owner | Model | Depends | Agent | Started | Completed | Prompt |
|---|--------|--------|-------|-------|---------|-------|---------|-----------|--------|
| 1.1 | Create users table | ✅ Done | DB | haiku | - | agent-a | 10:30 | 10:45 | a1b2c3 |
| 1.2 | Auth service | 🔄 In Progress | Backend | sonnet | 1.1 | agent-b | 10:32 | - | d4e5f6 |
```

### Status Values
- `🔲 Todo` or `todo` - Not started
- `🔄 In Progress` or `in-progress` - Currently being worked on
- `👀 QA Review` or `qa-review` - In quality assurance review
- `✅ Done` or `done` - Completed
- `🚫 Blocked` or `blocked` - Blocked by dependency or issue

## Sprint Summary Extensions

Sprint summary files (`sprints/sprint-XX/summary.md`) now include detailed execution logs.

### Agent Activity Section
```markdown
## Agent Activity

| Agent | Role | Tickets | Start | End | Duration |
|-------|------|---------|-------|-----|----------|
| agent-a | Backend | 1.1, 1.2, 1.4 | 10:00 | 12:30 | 2.5h |
| agent-b | Frontend | 1.3, 1.5, 1.6 | 10:00 | 13:00 | 3.0h |

### Parallelization
- Agents used: 2
- Parallelization: 45%
- Time savings: ~45% vs sequential
```

### Model Distribution Section
```markdown
## Model Distribution

| Model | Tasks | Percentage | Cost |
|-------|-------|------------|------|
| Haiku | 8 | 40% | $0.80 |
| Sonnet | 9 | 45% | $4.50 |
| Opus | 3 | 15% | $6.00 |

Total: $11.30
```

### Prompt Log Section
```markdown
## Prompt Log

<details>
<summary>Prompt: a1b2c3</summary>

**Ticket:** 1.1 - Create users table
**Agent:** agent-a
**Model:** haiku
**Timestamp:** 2024-01-15T10:30:00Z

```
You are executing ticket 1.1 for Sprint 1.
Task: Create the users table with the following schema...
```

</details>

<details>
<summary>Prompt: d4e5f6</summary>

**Ticket:** 1.2 - Auth service
**Agent:** agent-b
**Model:** sonnet
**Timestamp:** 2024-01-15T10:32:00Z

```
You are executing ticket 1.2 for Sprint 1.
Task: Implement the authentication service...
```

</details>
```

### Execution Timeline Section
```markdown
## Execution Timeline

| Time | Event | Agent | Details |
|------|-------|-------|---------|
| 10:00 | Sprint Started | - | Sprint 1 execution begins |
| 10:00 | Agent Started | agent-a | Backend Lead role |
| 10:00 | Agent Started | agent-b | Frontend Lead role |
| 10:05 | Ticket Started | agent-a | 1.1 - Create users table |
| 10:15 | Ticket Completed | agent-a | 1.1 - Create users table |
| 10:15 | Ticket Started | agent-a | 1.2 - Auth service |
| ... | ... | ... | ... |
| 13:00 | Sprint Completed | - | All tickets done |
```

## Screen Specs Extensions

The UI Designer spec (`10_ui_designer.md`) includes screen definitions that the dashboard can visualize:

```markdown
## Screen: Login Page

**Route:** `/login`
**Components:** Header, LoginForm, Footer
**States:** default, loading, error, success

### Layout
```
┌─────────────────────────────────────┐
│            Header                    │
├─────────────────────────────────────┤
│                                     │
│         ┌───────────────┐           │
│         │  Login Form   │           │
│         │               │           │
│         │ [Email     ]  │           │
│         │ [Password  ]  │           │
│         │               │           │
│         │ [  Login   ]  │           │
│         └───────────────┘           │
│                                     │
├─────────────────────────────────────┤
│            Footer                    │
└─────────────────────────────────────┘
```

### Related Tickets
- 1.3 - Build login form
- 1.7 - Style login page
```

## Frontmatter Support

All markdown files can include YAML frontmatter for metadata:

### backlog.md
```yaml
---
project: ShopFlow
version: 1.0.0
created: 2024-01-15
updated: 2024-01-20
currentSprint: 2
---
```

### Sprint Summary
```yaml
---
sprint: 1
name: Authentication
started: 2024-01-15T10:00:00Z
completed: 2024-01-15T15:30:00Z
agents: 2
parallelization: 45
totalTickets: 10
completedTickets: 10
---
```

## Dashboard Integration

The dashboard reads these extended markdown files and provides:

1. **Real-time monitoring** - File watchers detect changes instantly
2. **Burndown charts** - Generated from ticket completion timestamps
3. **Agent activity** - Visual representation of parallel execution
4. **Cost tracking** - Model usage and estimated costs
5. **Prompt history** - Full log of prompts used for each ticket
6. **Screen visualization** - ASCII wireframes from UI specs
