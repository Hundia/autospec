---
name: SDD Workflow
globs: "**/*"
alwaysApply: true
description: Core Spec-Driven Development workflow rules for AutoSpec
---

# Spec-Driven Development (SDD) Workflow

## Philosophy

AutoSpec uses **Spec-Driven Development**: specifications are written first, then code is implemented to match them. All code must align with specs in `specs/` and docs in `docs/`.

## Docs-First Rule

Before modifying any code, **read the relevant `docs/` section first**:

- Viewer changes → read `docs/viewer/`
- CLI changes → read `docs/cli/`
- Methodology changes → read `docs/methodology/`
- Deployment changes → read `docs/deployment/`
- New subsystem → check if `docs/<subsystem>/` exists

## Key Files

| File | Purpose |
|------|---------|
| `specs/backlog.md` | Sprint backlog with all tickets and statuses |
| `specs/01-project-overview.md` | Project vision, goals, constraints |
| `specs/02-user-roles.md` | User roles and personas |
| `specs/03-functional-requirements.md` | Feature requirements |
| `specs/04-non-functional-requirements.md` | Performance, security, accessibility |
| `specs/05-data-models.md` | Data schemas and relationships |
| `specs/06-api-contracts.md` | API endpoints and contracts |
| `specs/10-sdd-methodology.md` | SDD methodology reference |

## Status Emojis

| Emoji | Status |
|-------|--------|
| 🔲 | Todo — not yet started |
| 🔄 | In Progress — actively being worked on |
| 🧪 | QA Review — implementation complete, needs verification |
| ✅ | Done — verified and complete |
| ⏸️ | Blocked — waiting on dependency or decision |

## Code Conventions

- **TypeScript strict mode** — no `any` types, strict null checks enabled
- **Zod validation** — use Zod schemas for runtime validation of inputs
- **Architecture pattern** — repository → service → controller layering
- **Error handling** — always use typed errors, never swallow exceptions
- **Imports** — use path aliases where configured, prefer named exports
- **Testing** — colocate test files (`*.test.ts` / `*.spec.ts`) or use `__tests__/`

## Commit Message Format

```
type(scope): description

Types: feat, fix, refactor, docs, test, chore, ci
Scopes: cli, viewer, specs, docs, skills, agents
```

Examples:
- `feat(cli): add spec validation command`
- `fix(viewer): correct dark mode toggle state`
- `docs(methodology): update sprint workflow guide`
