# JetBrains AI Assistant Instructions for SDD Projects

Paste these instructions into JetBrains AI Assistant's custom prompt settings, or use with the Continue extension for JetBrains (which supports `.continue/rules/` format).

---

# AI Assistant Instructions

## Project Overview

This project uses **Spec-Driven Development (SDD)** methodology. All code must align with specifications in the `specs/` folder and documentation in `docs/`.

> **JetBrains Note:** JetBrains AI Assistant works best for single-ticket execution and code review. For full sprint orchestration, consider using the Continue extension for JetBrains which supports custom prompt files. Leverage JetBrains' built-in test runners and code analysis tools alongside these instructions.

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
- Database -> `docs/architecture/database.md`
- API -> `docs/api/reference.md`
- Frontend -> `docs/architecture/frontend.md`
- Flows -> `docs/flows/`
- Security -> `docs/architecture/security.md`

### Rule 3: QA Before Done

No ticket is marked ✅ Done without verification:

| Change Type | QA Required |
|-------------|-------------|
| Bug fix | Reproduce -> fix -> verify same flow passes |
| API change | Run API tests, test via curl |
| UI change | Run UI/component tests |
| Database migration | Verify migration, test affected endpoints |
| Docs/config only | No QA needed |
| Full-stack feature | Run full test suite |

Use JetBrains' built-in test runners (Run/Debug configurations) to execute tests directly from the IDE. Right-click test files or use the gutter icons to run individual tests.

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

Follow these steps for each ticket:

```
1. Read specs/backlog.md to find ticket [X.Y]
2. Read relevant docs/ section for context
3. Read relevant spec file (02-06, 10 based on type)
4. Update backlog: 🔲 → 🔄
5. Implement following patterns from specs and docs
6. Write tests per specs/05_qa_lead.md
7. Run tests using JetBrains' test runner to verify
8. Update relevant docs/ section
9. Update backlog: 🔄 → ✅ (or 🧪 for user review)
```

For multi-file changes, use JetBrains' refactoring tools (Shift+F6 for rename, Ctrl+F6 for change signature) to ensure consistency across the codebase.

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
- Repository -> Service -> Controller pattern
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

## Testing

JetBrains IDEs provide first-class test runner integration:

- Unit tests: `*.test.ts` — run via gutter icons or Run Configuration
- Integration tests: `*.spec.ts` — use dedicated Run Configurations
- Follow AAA pattern (Arrange, Act, Assert)
- Target 70%+ coverage — use JetBrains' built-in coverage tool (Run with Coverage)
- Use the Test Results panel to track pass/fail status across test suites

## Sprint Workflow

For single-ticket execution (recommended with JetBrains AI Assistant):
1. Open `specs/backlog.md` and identify the next ticket
2. Ask AI Assistant to implement the ticket following the steps above
3. Use AI Assistant for code review via the inline diff view
4. Run tests using JetBrains' test runner
5. Ask AI Assistant to update docs and backlog status

For full sprint orchestration with multiple tickets, consider using the Continue extension which supports multi-step prompt chains similar to other AI coding tools.

## Sprint Planning

For planning new sprints, use the multi-expert approach:
1. **Expert Analysis**: Architect, UX/UI, Database, Human Experience experts analyze the goal
2. **PM-A Draft**: Synthesize expert analyses into a phased sprint plan with tickets
3. **PM-B Review**: Adversarial review for gaps, risks, and improvements
4. **PM-C Finalize**: Merge draft + review into backlog-ready sprint plan
5. **Commit**: Append to `specs/backlog.md` after user confirmation

Experts are conditionally activated: backend-only sprints skip UX/UI and HX; frontend-only skip Database. The Architect always participates.

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
