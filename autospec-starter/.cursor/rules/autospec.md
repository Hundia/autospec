# AutoSpec Rules for Cursor

## What is AutoSpec?

AutoSpec is a Spec-Driven Development (SDD) framework. Your AI assistant thinks like a team of 10 expert roles before writing any code, generating complete specifications, sprint plans, and documentation from your requirements.

## How to Generate Your Project

1. Add your requirements to the `requirements/` folder
2. Tell Cursor's AI: **"Run @QUICKSTART.md"**
3. AutoSpec generates everything in one pass

## Mandatory Development Workflow

Once your project is generated, follow these rules for every task:

### Rule 1: Specs First
- Read `specs/` before writing any code
- Every feature must be described in a spec before implementation
- 10 role-based specs cover all angles: product, backend, frontend, DB, QA, DevOps, marketing, finance, business, and UI

### Rule 2: Backlog-First Development
- Every fix, feature, or change MUST be tracked in `specs/backlog.md`
- Set status to 🔄 In Progress when starting
- Set status to ✅ Done when complete

### Rule 3: Living Documentation
- After implementing a feature, update the relevant `docs/` section
- Database changes → `docs/database/`
- API changes → `docs/api/`
- Frontend changes → `docs/frontend/`

### Rule 4: QA Before Done
- No ticket is ✅ Done without verification
- Bug fixes: reproduce first, fix, verify the exact user flow passes
- API changes: test the endpoint with curl or the test suite
- UI changes: verify the page renders and functions correctly

## Using SDD Skills

The `.claude/commands/` folder contains 11 SDD skills. In Cursor, use these as reference patterns:

| Skill File | Purpose |
|-----------|---------|
| `sprint-run.md` | Full sprint lifecycle |
| `execute-ticket.md` | Single ticket execution |
| `plan-sprint.md` | Sprint planning with expert agents |
| `qa-review.md` | QA review process |
| `sprint-close.md` | Sprint closure and summary |
| `sprint-status.md` | Sprint progress tracking |
| `update-backlog.md` | Backlog management |
| `create-spec.md` | New feature specification |
| `create-sprint-docs.md` | Sprint documentation |
| `plan-presentation.md` | Presentation planning |
| `help.md` | Command reference |

## Key Files

| File | Purpose |
|------|---------|
| `QUICKSTART.md` | Master generation prompt |
| `specs/backlog.md` | Sprint tickets (single source of truth) |
| `specs/01_product_manager.md` | Product vision and requirements |
| `docs/` | Living documentation (updated after every feature) |
| `sprints/` | Sprint summaries and retrospectives |
| `.autospec/config.yml` | Project settings |

## Environment Setting

Your current environment is set in `.autospec/config.yml`:

```yaml
environment: cursor
```

This tells AutoSpec to generate Cursor-optimized prompts (Composer-style, multi-file edit patterns).
