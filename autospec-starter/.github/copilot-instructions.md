# AutoSpec — GitHub Copilot Instructions

This project uses the AutoSpec Spec-Driven Development (SDD) framework.

## Getting Started

1. Read `requirements/` for project requirements
2. Run `@QUICKSTART.md` to generate the full project structure
3. Follow the SDD workflow below for all development

## SDD Workflow

### Before Writing Code
- Read the relevant spec from `specs/` (10 role-based specification files)
- Check `specs/backlog.md` for the current sprint and ticket context
- Read relevant `docs/` for architecture and API details

### During Development
- Track every change in `specs/backlog.md` (🔲 → 🔄 → ✅)
- Follow the sprint lifecycle: Plan → Document → Execute → QA → Summarize

### After Implementation
- Update the relevant `docs/` section
- Verify the change (run tests, check UI, test API)
- Mark the ticket as ✅ Done in `specs/backlog.md`

## Key Files

| File | Purpose |
|------|---------|
| `QUICKSTART.md` | Master generation prompt — generates full project structure |
| `requirements/` | Your project requirements (input for generation) |
| `specs/backlog.md` | Sprint tickets and tracking |
| `specs/` | 10 role-based specifications |
| `docs/` | Living documentation |
| `.autospec/config.yml` | Project and environment settings |

## SDD Skills Reference

The `.claude/commands/` folder contains SDD skill definitions. Use these as patterns:

- `sprint-run.md` — Full sprint lifecycle execution
- `execute-ticket.md` — Single ticket implementation
- `plan-sprint.md` — Sprint planning with expert agents
- `qa-review.md` — QA review process
- `sprint-close.md` — Sprint closure and summary
