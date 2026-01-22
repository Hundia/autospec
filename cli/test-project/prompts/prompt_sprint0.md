# Sprint 0: Foundation & Setup

**Starting Sprint 0: Foundation & Setup**

Read `specs/backlog.md` for full project context. This is Task Manager.

## Project State
- Starting fresh project
- Stack: React + Node.js + PostgreSQL (TypeScript)

## Sprint 0 Scope (10 tickets)

Set up project infrastructure and development environment.

### Sprint 0 Tickets

**Part A: Infrastructure**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 0.1 | Initialize git repository with README | DevOps | haiku |
| 0.2 | Create Docker development environment | DevOps | sonnet |
| 0.3 | Set up PostgreSQL database | DevOps | haiku |

**Part B: Application Setup**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 0.4 | Initialize backend project (Node.js + TypeScript) | Backend | sonnet |
| 0.5 | Initialize frontend project (React + TypeScript) | Frontend | sonnet |
| 0.6 | Configure ESLint and Prettier | DevOps | haiku |

**Part C: Quality & Validation**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 0.7 | Set up testing frameworks (Vitest) | QA | sonnet |
| 0.8 | Create initial CI pipeline | DevOps | sonnet |
| 0.9 | Create health check endpoint | Backend | haiku |
| 0.10 | Validate full stack runs locally | QA | sonnet |

### Definition of Done
- [ ] `docker-compose up` runs successfully
- [ ] Backend responds to `/health` endpoint
- [ ] Frontend displays welcome page
- [ ] All lint checks pass
- [ ] CI pipeline runs successfully
- [ ] README has setup instructions

## Execution Guidelines

### 1. Spec-Driven Development
- Read relevant specs before implementing:
  - `specs/01_product_manager.md` - Product requirements
  - `specs/02_backend_lead.md` - API patterns
  - `specs/03_frontend_lead.md` - UI components
  - `specs/04_db_architect.md` - Database schema
  - `specs/05_qa_lead.md` - Testing requirements

### 2. Model Selection Strategy (FinOps-Optimized)

Track which model you use for each ticket. Guidelines:

**haiku** (cheapest, fastest - use for 40%+ of tasks):
- Simple database migrations with provided schema
- Basic CRUD endpoints following existing patterns
- Straightforward UI components from existing design system
- Seed scripts, config files, simple tests

**sonnet** (balanced - use for 45% of tasks):
- Standard services, controllers, routes
- Dashboard UI components
- API integrations following patterns
- Unit and integration tests

**opus** (most capable - use sparingly for 15% of complex tasks):
- Architecture decisions
- Security-critical code
- Complex algorithms
- Novel problem-solving

### 3. Implementation Order (Dependency-Aware)

Follow ticket dependencies for efficient execution:

**Phase 1: Foundation (0.1-0.3)**
- Git repo, Docker, Database

**Phase 2: Applications (0.4-0.6)**
- Backend, Frontend, Linting

**Phase 3: Quality (0.7-0.10)**
- Testing, CI, Validation

### 4. Testing Requirements
- Run `cd api && npm test` after backend changes
- Run `cd web && npm test` after frontend changes
- All tests must pass before marking tickets done

### 5. Backlog Updates
- Update `specs/backlog.md` as you complete tickets:
  - Change status: 🔲 Todo → 🔄 In Progress → ✅ Done
  - Model column already specified in backlog

### 6. Code Standards
- Follow existing patterns in codebase
- Use Zod for validation
- Repository → Service → Controller → Routes pattern for backend

## Starting Command

Begin by reading the Sprint 0 tickets in `specs/backlog.md`, then:
1. Create a todo list for tracking
2. Start with ticket 0.1
3. Follow the implementation order

---

*Generated with SDD for All framework on 2026-01-21*
