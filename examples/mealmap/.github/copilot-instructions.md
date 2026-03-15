# Copilot Instructions — MealMap (AutoSpec SDD Project)

Environment: vscode-copilot
Model: GPT 5.4 (primary)

This project uses the **AutoSpec Spec-Driven Development (SDD)** framework. All code must align with specifications in `specs/` and documentation in `docs/`.

---

## Model Routing (FinOps)

Use the right model tier for the right task to optimize cost and quality:

| Model | Use For | ~% of Tasks |
|-------|---------|-------------|
| **GPT 5.4** | Planning, architecture, security, debugging, reviews, QA synthesis, complex algorithms, sprint planning | 15% |
| **GPT 5.3** | Standard implementation, business logic, UI wiring, integration work, services, components | 45% |
| **GPT 5.2** | Boilerplate, CRUD, docs, tests, fixtures, repetitive edits, configs, migrations | 40% |

The `Model` column in `specs/backlog.md` maps to these tiers:
- `opus` → use GPT 5.4
- `sonnet` → use GPT 5.3
- `haiku` → use GPT 5.2

### Handoff Pattern

When a ticket is marked for GPT 5.4 (opus-tier):
1. **GPT 5.4** writes a short planner brief with decisions, dependencies, contracts, and acceptance checks
2. **GPT 5.3** implements against that brief — no re-planning
3. **GPT 5.2** handles low-risk follow-up: tests, docs, scaffolding
4. If implementation fails twice or a contract conflict appears, escalate back to GPT 5.4

---

## MANDATORY Development Workflow

### Rule 1: Backlog-First Development

Every fix, feature, or change MUST be tracked in `specs/backlog.md`:
1. Before starting work, determine if this is a bug (`B.XX`), new feature, or enhancement
2. Add/update the ticket in `specs/backlog.md`
3. Set status to 🔄 In Progress when starting
4. Set status to ✅ Done when complete

### Rule 2: Docs-First Development

Before modifying code, READ the relevant `docs/` section:
- Architecture → `docs/architecture.md`
- API endpoints → `docs/api.md`
- Setup/dev guide → `docs/setup.md`

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

Every implemented feature MUST update `docs/`:
- API changes → update `docs/api.md`
- Architecture changes → update `docs/architecture.md`
- Setup changes → update `docs/setup.md`
- Sprint summaries reference `docs/` files and vice versa

---

## SDD Skills Reference

These are the 11 SDD workflow commands. In Copilot Chat, use the prompt patterns below:

### Sprint Lifecycle

| Skill | Copilot Chat Prompt | Purpose |
|-------|---------------------|---------|
| **Plan Sprint** | `Plan a sprint for: [goal]. Read specs/backlog.md for next sprint number. Use the 6-phase expert planning workflow from .github/copilot-instructions.md` | Multi-expert sprint planning (Architect + UX + DB + HX experts → PM draft → PM review → PM finalize) |
| **Sprint Run** | `Execute Sprint [N]. Read specs/backlog.md, read all relevant specs, order tickets by dependencies, present execution plan, then implement each ticket.` | Full sprint execution: plan → implement → QA → docs → close |
| **Sprint Status** | `Show sprint status. Read specs/backlog.md, calculate completion %, show health indicator (🟢🟡🔴), list tickets by status, show next actions.` | Progress dashboard with health indicators |
| **Sprint Close** | `Close Sprint [N]. Verify all tickets are ✅, create sprints/sprint-[N]/summary.md with completed tickets, docs updated, QA results, retrospective.` | Generate sprint summary and mark complete |

### Ticket Execution

| Skill | Copilot Chat Prompt | Purpose |
|-------|---------------------|---------|
| **Execute Ticket** | `Execute ticket [X.Y]. Read specs/backlog.md to find it, check dependencies, read relevant spec file, update status to 🔄, implement, write tests, update docs, mark ✅.` | Single ticket implementation with full SDD flow |
| **Update Backlog** | `Update specs/backlog.md: set ticket [X.Y] status to [status emoji]` | Quick backlog status updates |

### Quality & Documentation

| Skill | Copilot Chat Prompt | Purpose |
|-------|---------------------|---------|
| **QA Review** | `QA review ticket [X.Y]. Read specs/05_qa_lead.md, check code quality, run tests, verify functionality, check docs updated, verdict PASS/FAIL.` | Structured QA review with checklists |
| **Create Spec** | `Create a new spec for [feature]. Follow the role-based template pattern from specs/.` | Generate new specification files |
| **Create Sprint Docs** | `Create sprint documentation structure for Sprint [N].` | Generate sprint doc scaffolding |

### Information

| Skill | Copilot Chat Prompt | Purpose |
|-------|---------------------|---------|
| **Help** | `Show all available SDD skills and how to use them.` | Overview of all commands |

---

## Sprint Planning Workflow (Detail)

For planning new sprints, use the multi-expert approach:

### Phase 1: Goal Analysis
Read `specs/backlog.md` for next sprint number. Determine which experts to activate.

### Phase 2: Expert Analysis (PARALLEL)
| Expert | Activate When | Reads |
|--------|---------------|-------|
| **Architect** | ALWAYS | `specs/02_backend_lead.md`, `specs/03_frontend_lead.md`, `docs/architecture.md` |
| **UX/UI Expert** | Frontend/GUI work | `specs/03_frontend_lead.md`, design tokens |
| **Database Expert** | Schema changes | `specs/04_db_architect.md`, `docs/architecture.md` |
| **Human Experience** | User-facing features | `specs/01_product_manager.md`, personas |

### Phase 3-5: PM Pipeline (SEQUENTIAL)
- **PM-A (Drafter):** Synthesize expert analyses into phased sprint plan
- **PM-B (Reviewer):** Adversarial review — gaps, risks, improvements
- **PM-C (Finalizer):** Merge draft + review, validate format

### Phase 6: Present & Commit
Show plan to user. Only write to `specs/backlog.md` after explicit confirmation.

---

## Ticket Execution Flow

When implementing any ticket, follow this exact sequence:

```
1. Read specs/backlog.md → find ticket [X.Y]
2. Read relevant docs/ section for context
3. Read relevant spec file (02-06 based on ticket type)
4. Update backlog: 🔲 → 🔄
5. Implement following patterns from specs and docs
6. Write tests per specs/05_qa_lead.md
7. Run tests to verify
8. Update relevant docs/ section
9. Update backlog: 🔄 → ✅ (or 🧪 for user review)
```

---

## Key Files

### Specifications (Read Before Implementing)

| File | Purpose |
|------|---------|
| `specs/backlog.md` | Master work tracker — check before starting |
| `specs/01_product_manager.md` | Product vision, personas (Jamie, Morgan, Pat), user flows |
| `specs/02_backend_lead.md` | API patterns, Express services, Zod validation, error handling |
| `specs/03_frontend_lead.md` | React components, routing, Tailwind design tokens, Zustand stores |
| `specs/04_db_architect.md` | PostgreSQL schema (6 tables), Drizzle ORM, indexes |
| `specs/05_qa_lead.md` | Test strategies, coverage targets (≥70%), Vitest + Supertest |

### Documentation (Living Docs)

| File | Covers |
|------|--------|
| `docs/architecture.md` | System diagram, tech stack, request lifecycle |
| `docs/api.md` | API endpoint reference |
| `docs/setup.md` | Installation, Docker, env vars, dev/test/build commands |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Express 4.x + TypeScript 5.x |
| Database | PostgreSQL 15+ (Docker) |
| ORM | Drizzle ORM 0.29+ |
| Validation | Zod 3.x |
| Frontend | React 18 + Vite 5 + TypeScript |
| Styling | Tailwind CSS 3.x |
| State | Zustand 4.x |
| HTTP Client | Axios 1.x |
| Routing | React Router 6.x |
| Testing | Vitest + Supertest |

## Status Emojis

| Emoji | Status | Meaning |
|-------|--------|---------|
| 🔲 | Todo | Not started |
| 🔄 | In Progress | Being worked on |
| 🧪 | QA Review | Needs testing/review |
| ✅ | Done | Complete and verified |
| ⏸️ | Blocked | Cannot proceed |

## Code Conventions

### TypeScript
- Use strict types (no `any`)
- Zod for all request/response validation
- Interfaces over types where possible

### Backend (Express)
- Service → Route handler pattern
- Custom error classes (AppError, NotFoundError, ConflictError, UnauthorizedError)
- Response format: `{ data: T, meta?: { total, page, limit } }`
- All endpoints validated with Zod middleware

### Frontend (React)
- Functional components with hooks
- Zustand stores (authStore, recipeStore, mealPlanStore)
- Tailwind CSS for styling
- react-hook-form + Zod for forms
- Lazy-loaded route pages

### Database (Drizzle)
- Snake_case for tables and columns
- UUID primary keys
- Always include created_at, updated_at
- Soft-delete via deleted_at

### Testing
- Unit tests: `*.test.ts` (Vitest)
- Integration tests: `*.spec.ts` (Supertest)
- Follow AAA pattern (Arrange, Act, Assert)
- Target ≥70% coverage

## Key Commands

```bash
# Backend
cd api && npm install && npm run dev
cd api && npx tsc --noEmit            # Type check
cd api && npx vitest run              # Tests

# Frontend
cd web && npm install && npm run dev
cd web && npx vite build              # Build
cd web && npx vitest run              # Tests

# Database
docker-compose up -d                   # Start PostgreSQL
cd api && npx drizzle-kit push        # Apply schema

# Viewer
cd viewer && npm run dev              # Dev server
cd viewer && npm run build            # Production build

# Commit format
# type(scope): description
# feat(auth): implement JWT token refresh
```

---

**Remember: Specs are the source of truth. Docs are the living architecture. When in doubt, read both.**
