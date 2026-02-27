# GitHub Copilot Instructions for SDD Projects

Copy this file to `.github/copilot-instructions.md` in your project root.

---

# Copilot Instructions

## Project Overview

This project uses **Spec-Driven Development (SDD)** methodology. All code must align with specifications in the `specs/` folder and documentation in `docs/`.

## MANDATORY Development Workflow

These rules apply to EVERY development task:

### Rule 1: Backlog-First Development

Every fix, feature, or change MUST be tracked in `specs/backlog.md`:
1. Before starting work, determine if this is a bug (`B.XX`), new feature, or enhancement
2. Add/update the ticket in `specs/backlog.md`
3. Set status to 🔄 In Progress when starting
4. Set status to ✅ Done when complete

### Rule 2: Docs-First Development

Before modifying code, READ the relevant `docs/` section:
- Database → `docs/architecture/database.md`
- API → `docs/api/reference.md`
- Frontend → `docs/architecture/frontend.md`
- Flows → `docs/flows/`
- Security → `docs/architecture/security.md`

### Rule 3: QA Before Done

No ticket is marked ✅ Done without verification:

| Change Type | QA Required |
|-------------|-------------|
| Bug fix | Reproduce → fix → verify same flow passes |
| API change | Run API tests, test via curl |
| UI change | Run UI/component tests |
| Database migration | Verify migration, test affected endpoints |
| Docs/config only | No QA needed |
| Full-stack feature | Run full test suite |

### Rule 4: Living Documentation

Every implemented feature MUST have corresponding documentation in `docs/`:
- After completing a feature, update relevant `docs/` sections
- Sprint summaries must reference `docs/` files
- Documentation links to sprint tickets and vice versa

## Key Files

### Specifications (Read Before Implementing)

| File | Purpose |
|------|---------|
| `specs/backlog.md` | Master work tracker — check before starting |
| `specs/01_product_manager.md` | Product vision, personas, requirements |
| `specs/02_backend_lead.md` | API patterns, services, error handling |
| `specs/03_frontend_lead.md` | Components, routing, design system |
| `specs/04_db_architect.md` | Database schema, migrations, queries |
| `specs/05_qa_lead.md` | Testing requirements, QA process |
| `specs/06_devops_lead.md` | Infrastructure, CI/CD, deployment |
| `specs/10_ui_designer.md` | Screens, wireframes, responsive design |

### Documentation (Living Docs)

| Section | Path | Covers |
|---------|------|--------|
| Architecture | `docs/architecture/` | System, backend, frontend, database, security |
| Flows | `docs/flows/` | User journeys, auth, data flow, state machines |
| API | `docs/api/` | Endpoints, auth, errors, curl examples |
| Testing | `docs/testing/` | Strategy, unit, integration, e2e patterns |
| Design System | `docs/ui-design-system/` | Tokens, components, layouts, a11y |
| Workflows | `docs/workflows/` | Development, sprint execution, QA, deployment |

## When Implementing a Ticket

```
1. Read specs/backlog.md to find ticket [X.Y]
2. Read relevant docs/ section for context
3. Read relevant spec file (02-06, 10 based on type)
4. Update backlog: 🔲 → 🔄
5. Implement following patterns from specs and docs
6. Write tests per specs/05_qa_lead.md
7. Run tests to verify
8. Update relevant docs/ section
9. Update backlog: 🔄 → ✅ (or 🧪 for user review)
```

## Status Emojis

| Emoji | Status | Meaning |
|-------|--------|---------|
| 🔲 | Todo | Not started |
| 🔄 | In Progress | Being worked on |
| 🧪 | QA Review | Needs testing/review |
| ✅ | Done | Complete and verified |
| ⏸️ | Blocked | Cannot proceed |

## FinOps: Model Selection

Use the right model for the right task to optimize costs:

| Model | Use For | ~% of Tasks |
|-------|---------|-------------|
| **Haiku** | Migrations, configs, CRUD, boilerplate, docs | 40% |
| **Sonnet** | Services, components, tests, validation, forms | 45% |
| **Opus** | Architecture, security, complex algorithms, debugging | 15% |

The `Model` column in `specs/backlog.md` recommends the model for each ticket.

## Code Conventions

### TypeScript
- Use strict types (no `any`)
- Zod for validation
- Interfaces over types where possible

### Backend
- Repository → Service → Controller pattern
- Error handling with custom error classes
- Consistent response format: `{ data: T, meta?: { total, page } }`

### Frontend
- Functional components with hooks
- Zustand for state management
- Tailwind for styling
- Component location: `src/components/[Feature]/`

### Database
- Snake_case for tables and columns
- UUID primary keys
- Always include created_at, updated_at
- Migrations in `database/migrations/`

### Testing
- Unit tests: `*.test.ts`
- Integration tests: `*.spec.ts`
- Follow AAA pattern (Arrange, Act, Assert)
- Target 70%+ coverage

## Multi-Agent Coordination

### Agent A (Backend)
- Focus: Database, API, Services
- Tickets: Owner = "Backend" or "DB"
- DO NOT modify frontend code

### Agent B (Frontend)
- Focus: Components, Pages, State
- Tickets: Owner = "Frontend"
- DO NOT modify backend code
- Check backlog before starting tickets that depend on Agent A

## Sprint Closing

When closing a sprint, generate `sprints/sprint_X/summary.md` with:
1. Completed tickets table (with docs references)
2. Documentation Updated section
3. Key files modified
4. QA test results
5. Retrospective

## Commit Messages

Format: `type(scope): description`

Types: feat, fix, docs, style, refactor, test, chore

Example: `feat(auth): implement JWT token refresh`

---

**Remember: Specs are the source of truth. Docs are the living architecture. When in doubt, read both.**
