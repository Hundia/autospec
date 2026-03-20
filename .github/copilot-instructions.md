# Copilot Instructions — AutoSpec

## About This Project

AutoSpec is a **Spec-Driven Development (SDD)** framework. This project develops itself using its own tools. Use the prompt files in `.github/prompts/` for sprint operations.

## MANDATORY Development Workflow

### Rule 1: Backlog-First Development

Every fix, feature, or change MUST be tracked in `specs/backlog.md` before or during implementation:

1. Determine if this is a **bug** (B.XX), **new feature**, or **enhancement**
2. Add ticket to `specs/backlog.md` in the appropriate sprint section
3. Set status to 🔄 In Progress when starting
4. Set status to ✅ Done when complete

**Skip ONLY when user explicitly says** "skip backlog", "don't track this"

### Rule 2: Living Documentation

Every implemented feature MUST update `docs/`:

- Viewer changes → `docs/viewer/`
- CLI changes → `docs/cli/`
- Methodology changes → `docs/methodology/`
- Deployment changes → `docs/deployment/`
- New subsystem → create new `docs/<subsystem>/` directory

### Rule 3: QA Before Done

No ticket is ✅ Done without verification:

| Change Type | QA Required |
|-------------|-------------|
| Bug fix | Reproduce first, fix, verify user flow passes |
| CLI change | `npm run build` + `npm test` in `cli/` |
| Viewer change | `npm run build` in `viewer/` + visual check |
| Docs/config only | No QA — mark ✅ directly |
| New feature | Full test suite + new test cases if needed |

### Rule 4: Orchestrator + Agent Execution Pattern

This project uses the **Orchestrator + Agent** pattern for sprint execution:

1. Orchestrator writes `agents/sprint-X-brief.md` before spawning agents
2. Agent reads brief + relevant specs + docs, implements tickets
3. Agent updates: `specs/backlog.md` (🔲→✅), docs/, `sprints/sprint-X/summary.md`
4. Orchestrator reviews summary, spawns next sprint(s)

## Project Structure

```
autospec/
├── .claude/commands/       # Claude Code skill files
├── .github/prompts/        # Copilot prompt files (YOU ARE HERE)
├── specs/                  # Role spec files (01-10) + backlog.md
├── agents/                 # Sprint briefing files (sprint-X-brief.md)
├── sprints/                # Sprint summaries (sprint-X/summary.md)
├── docs/                   # Living documentation
│   ├── methodology/        # SDD philosophy, roles, patterns
│   ├── viewer/             # Viewer app docs
│   ├── cli/                # CLI docs
│   └── deployment/         # CI/CD + GitHub Pages
├── skills/                 # Source skill files (claude/, copilot/, cursor/, etc.)
├── cli/                    # CLI tool source (Node/TypeScript)
├── viewer/                 # React viewer app
└── QUICKSTART.md           # Full usage guide
```

## Key Files

| File | Purpose |
|------|---------|
| `specs/backlog.md` | Sprint tickets (single source of truth) |
| `specs/01_product_manager.md` | Product vision and requirements |
| `specs/02_backend_lead.md` | Backend patterns |
| `specs/03_frontend_lead.md` | Frontend patterns |
| `specs/04_db_architect.md` | Database conventions |
| `specs/05_qa_lead.md` | QA standards and testing guidelines |
| `docs/` | Living documentation |

## Status Emojis

| Emoji | Status | Meaning |
|-------|--------|---------|
| 🔲 | Todo | Not started |
| 🔄 | In Progress | Being worked on |
| 🧪 | QA Review | Needs testing/review |
| ✅ | Done | Complete and verified |
| ⏸️ | Blocked | Cannot proceed |

## FinOps: Model Selection

Use the right model for the right task:

| Model | Use For | ~% of Tasks |
|-------|---------|-------------|
| **Small** | Migrations, configs, CRUD, boilerplate, docs | 40% |
| **Medium** | Services, components, tests, validation, forms | 45% |
| **Large** | Architecture, security, complex algorithms, debugging | 15% |

## Code Conventions

- TypeScript with strict types (no `any`)
- Zod for validation
- Functional components with hooks (frontend)
- Tailwind for styling
- Commit format: `type(scope): description`

## Design System Rules

- **Background:** `#f5f3ed` (parchment)
- **Primary:** `#698472` (sage)
- **Accent:** `#8e6a59` (terracotta)
- **Border:** `#d8d0ba` (sand)
- **Text:** `#1a1a1a` (charcoal)
- NO shadcn/ui, NO @radix-ui

## Available Prompt Commands

> **Note:** These prompt files live in `.github/prompts/` and are generated from `skills/copilot/prompts/` (the source of truth). If you modify them, update `skills/copilot/prompts/` first and sync to `.github/prompts/`.

Use these via Copilot Chat (type `@workspace /prompt-name`):

| Prompt | Description |
|--------|-------------|
| `plan-sprint` | Assemble expert AI agents to plan a sprint |
| `sprint-run` | Execute entire sprint: plan → implement → QA → docs → close |
| `sprint-status` | Show sprint progress with health indicators |
| `sprint-close` | Close sprint, generate summary with docs linkage |
| `execute-ticket` | Execute a single ticket with QA + docs update |
| `qa-review` | QA review a completed ticket or sprint |
| `update-backlog` | Add/update tickets, link docs, report bugs |
| `create-spec` | Generate a new feature specification |
| `create-sprint-docs` | Generate sprint summary documentation |
| `plan-presentation` | Plan and implement a presentation slide |
| `help` | Show all available commands |

**Remember: Specs are the source of truth. Docs are the living architecture. When in doubt, read both.**
