# Project Memory — AutoSpec SDD

## About This Project

This project uses the AutoSpec Spec-Driven Development (SDD) framework.
All specifications, backlog, and documentation are generated from `QUICKSTART.md`.

## Development Workflow

### Rule 1: Specs First
- Read `specs/` before writing any code
- 10 role-based specifications cover every angle of the project

### Rule 2: Backlog-First Development
- Every fix, feature, or change MUST be tracked in `specs/backlog.md`
- Set status: 🔲 Todo → 🔄 In Progress → ✅ Done

### Rule 3: Living Documentation
- After implementing a feature, update `docs/`
- Database changes → `docs/database/`
- API changes → `docs/api/`
- Frontend changes → `docs/frontend/`

### Rule 4: QA Before Done
- No ticket is ✅ Done without verification
- Bug fixes: reproduce → fix → verify user flow
- API changes: test endpoints
- UI changes: verify rendering

## Sprint Lifecycle

```
Plan → Document → Execute → QA → Summarize
```

Use SDD skills in `.claude/commands/` for each phase:
- `/sprint-run` — Execute a full sprint
- `/execute-ticket` — Implement a single ticket
- `/plan-sprint` — Plan sprint with expert agents
- `/qa-review` — QA review process
- `/sprint-close` — Close sprint with summary
- `/sprint-status` — Check sprint progress

## Key Files

| File | Purpose |
|------|---------|
| `QUICKSTART.md` | Master generation prompt |
| `specs/backlog.md` | Sprint tickets (source of truth) |
| `specs/` | 10 role-based specifications |
| `docs/` | Living documentation |
| `sprints/` | Sprint summaries |
| `.autospec/config.yml` | Project settings |
