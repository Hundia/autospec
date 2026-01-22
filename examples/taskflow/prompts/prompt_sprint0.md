# Sprint 0: Foundation & Setup

**Starting Sprint 0: Foundation & Setup**

Read `specs/backlog.md` for full project context. This is TaskFlow - a task management application built with Express/TypeScript backend and React/TypeScript frontend.

## Project State
- This is a greenfield project
- Stack: Node.js 20, Express, PostgreSQL, Drizzle ORM, React 18, Vite, TypeScript, Tailwind CSS

## Sprint 0 Scope (18 tickets)

Set up project infrastructure and development environment so that Sprint 1 can begin with a solid foundation.

### Sprint 0 Tickets

**Part A: Infrastructure**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 0.1 | Initialize git repository with .gitignore and README | DevOps | haiku |
| 0.2 | Create docker-compose.yml for PostgreSQL | DevOps | sonnet |
| 0.3 | Create .env.example with all required variables | DevOps | haiku |

**Part B: Backend Setup**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 0.4 | Initialize backend project (Express + TypeScript) | Backend | sonnet |
| 0.5 | Configure backend TypeScript with strict settings | Backend | haiku |
| 0.6 | Set up Drizzle ORM with PostgreSQL connection | Backend | sonnet |
| 0.7 | Create base error handling middleware | Backend | sonnet |
| 0.8 | Implement health check endpoint (GET /health) | Backend | haiku |

**Part C: Frontend Setup**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 0.9 | Initialize frontend project (React + Vite + TypeScript) | Frontend | sonnet |
| 0.10 | Configure frontend TypeScript and path aliases | Frontend | haiku |
| 0.11 | Set up Tailwind CSS with design system colors | Frontend | sonnet |
| 0.12 | Create API client with Axios | Frontend | haiku |
| 0.13 | Create basic Layout component | Frontend | haiku |

**Part D: Quality & Tooling**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 0.14 | Configure ESLint and Prettier for both projects | DevOps | haiku |
| 0.15 | Set up Vitest for backend testing | QA | sonnet |
| 0.16 | Set up Vitest for frontend testing | QA | sonnet |
| 0.17 | Write first tests (health check, component render) | QA | haiku |
| 0.18 | Validate full stack runs locally | QA | sonnet |

### Definition of Done
- [ ] `docker-compose up` starts PostgreSQL successfully
- [ ] Backend starts and responds to GET /health with 200
- [ ] Frontend builds and displays welcome page
- [ ] All lint checks pass
- [ ] All tests pass
- [ ] README has clear setup instructions

## Execution Guidelines

### 1. Specs to Read
- `specs/02_backend_lead.md` - Project structure and patterns
- `specs/03_frontend_lead.md` - Component structure and design system
- `specs/04_db_architect.md` - Database setup

### 2. Model Selection
**haiku** (use for simple scaffolding):
- 0.1, 0.3, 0.5, 0.8, 0.10, 0.12, 0.13, 0.14, 0.17

**sonnet** (use for setup requiring thought):
- 0.2, 0.4, 0.6, 0.7, 0.9, 0.11, 0.15, 0.16, 0.18

### 3. Implementation Order (Critical)

```
Phase 1: Git & Docker (0.1-0.3)
    └── No dependencies

Phase 2: Backend (0.4-0.8)
    └── Depends on: Docker for database

Phase 3: Frontend (0.9-0.13)
    └── Can run parallel to Phase 2

Phase 4: Quality (0.14-0.18)
    └── Depends on: Backend & Frontend complete
```

### 4. File Structure to Create

```
taskflow/
├── api/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   ├── middleware/
│   │   │   └── error.middleware.ts
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   └── health.routes.ts
│   │   ├── db/
│   │   │   └── schema.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   │   └── health.test.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
├── web/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       └── Layout.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tests/
│   │   └── App.test.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

### 5. Verification

After each section, verify:

```bash
# After Docker (0.2)
docker-compose up -d
docker-compose ps  # Should show postgres healthy

# After Backend (0.8)
cd api && npm install && npm run dev
curl http://localhost:3000/health  # Should return 200

# After Frontend (0.13)
cd web && npm install && npm run dev
# Browser: http://localhost:5173 shows layout

# After Quality (0.18)
cd api && npm run lint && npm test
cd web && npm run lint && npm test
```

### 6. Backlog Updates

As you complete tickets:
1. Update status in `specs/backlog.md`: 🔲 → 🔄 → ✅
2. If blocked, mark ⏸️ and note the reason

### 7. Sprint Documentation

When complete, create `sprints/sprint-0-foundation/summary.md`:
- Overview of what was set up
- Any decisions made
- Issues encountered

## Multi-Agent Strategy

### Agent A (Backend/DevOps)
Tickets: 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8

### Agent B (Frontend)
Tickets: 0.9, 0.10, 0.11, 0.12, 0.13

### Sync Point
After both complete, proceed with quality tickets (0.14-0.18)

## Starting Command

Begin with 0.1 (git init), then proceed through tickets in order. Create a todo list to track progress.

---

*Generated with SDD for All framework*
