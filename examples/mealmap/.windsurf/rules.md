# AutoSpec Rules for Windsurf

## What is AutoSpec?

AutoSpec is a Spec-Driven Development (SDD) framework. Your AI assistant thinks like a team of 10 expert roles before writing any code — generating complete specifications, sprint plans, and documentation from your requirements.

## How to Generate Your Project

1. Add your requirements to the `requirements/` folder
2. Tell Windsurf's AI (Cascade): **"Run @QUICKSTART.md"**
3. AutoSpec generates everything in one pass

## Mandatory Development Workflow

Once your project is generated, follow these rules for every task:

### Rule 1: Specs First

Before writing any code:
- Read the relevant spec from `specs/` (10 role-based spec files)
- Read the relevant doc from `docs/` (architecture, API, flows, etc.)
- Check `specs/backlog.md` for the current sprint and ticket context

### Rule 2: Backlog-First Development

Every fix, feature, or change MUST be tracked in `specs/backlog.md`:
1. Add the ticket before starting work
2. Set status to 🔄 In Progress when starting
3. Set status to ✅ Done when complete

### Rule 3: Living Documentation

After implementing a feature, update the relevant `docs/` section:
- Database changes → `docs/database/`
- API changes → `docs/api/`
- Frontend changes → `docs/frontend/`
- New subsystem → create `docs/<subsystem>/`

### Rule 4: QA Before Done

No ticket is ✅ Done without verification:
- Bug fixes: reproduce the bug first, apply the fix, verify the user flow passes
- API changes: run the relevant endpoint tests
- UI changes: verify the page renders and functions correctly
- Docs-only changes: no QA needed, mark ✅ directly

## SDD Sprint Lifecycle

```
Plan → Document → Execute → QA → Summarize
```

1. **Plan** — `/plan-sprint [goal]` — Expert AI agents plan the sprint
2. **Document** — Specs and backlog created before any code
3. **Execute** — `/sprint-run X` — Implement all tickets in order
4. **QA** — `/qa-review X.Y` — Verify each ticket
5. **Summarize** — `/sprint-close X` — Create sprint summary with docs linkage

## Key Files

| File | Purpose |
|------|---------|
| `QUICKSTART.md` | Master generation prompt — tell your AI to "Run @QUICKSTART.md" |
| `requirements/` | Your project requirements go here |
| `specs/backlog.md` | Sprint tickets (single source of truth) |
| `specs/01_product_manager.md` | Product vision and requirements |
| `docs/` | Living documentation |
| `sprints/` | Sprint summaries and retrospectives |
| `.autospec/config.yml` | Project settings |

## Environment Setting

Update `.autospec/config.yml` to target Windsurf:

```yaml
environment: windsurf
```

This tells AutoSpec to generate Windsurf-optimized prompts (Flow-based, context-aware patterns).
