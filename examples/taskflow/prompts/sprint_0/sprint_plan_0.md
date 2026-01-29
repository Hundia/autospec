# Sprint 0 Planning Guide: Foundation & Setup

## Environment: claude-code

---

## Sprint Overview

| Property | Value |
|----------|-------|
| Sprint | 0 - Foundation & Setup |
| Goal | Set up project infrastructure and development environment |
| Duration | 1-2 days |
| Total Tickets | 18 |
| Total Story Points | ~25 |
| Dependencies | None (this is the first sprint) |

---

## Pre-Sprint Checklist

Before starting Sprint 0, ensure:

- [ ] Node.js 20.x LTS installed (`node --version`)
- [ ] PostgreSQL 15+ installed or Docker available
- [ ] Git installed and configured
- [ ] Code editor set up (VS Code recommended)
- [ ] Terminal access ready
- [ ] All spec files reviewed:
  - [ ] `specs/01_product_manager.md` - Product requirements
  - [ ] `specs/02_backend_lead.md` - Backend architecture
  - [ ] `specs/03_frontend_lead.md` - Frontend architecture
  - [ ] `specs/04_db_architect.md` - Database schema
  - [ ] `specs/05_qa_lead.md` - Testing strategy

---

## Tickets Overview

| # | Ticket | Status | Owner | Model | Points |
|---|--------|--------|-------|-------|--------|
| 0.1 | Initialize git repository with .gitignore and README | Todo | DevOps | haiku | 1 |
| 0.2 | Create docker-compose.yml for PostgreSQL | Todo | DevOps | sonnet | 2 |
| 0.3 | Create .env.example with all required variables | Todo | DevOps | haiku | 1 |
| 0.4 | Initialize backend project (Express + TypeScript) | Todo | Backend | sonnet | 3 |
| 0.5 | Configure backend TypeScript with strict settings | Todo | Backend | haiku | 1 |
| 0.6 | Set up Drizzle ORM with PostgreSQL connection | Todo | Backend | sonnet | 3 |
| 0.7 | Create base error handling middleware | Todo | Backend | sonnet | 2 |
| 0.8 | Implement health check endpoint (GET /health) | Todo | Backend | haiku | 1 |
| 0.9 | Initialize frontend project (React + Vite + TypeScript) | Todo | Frontend | sonnet | 3 |
| 0.10 | Configure frontend TypeScript and path aliases | Todo | Frontend | haiku | 1 |
| 0.11 | Set up Tailwind CSS with design system colors | Todo | Frontend | sonnet | 2 |
| 0.12 | Create API client with Axios | Todo | Frontend | haiku | 1 |
| 0.13 | Create basic Layout component | Todo | Frontend | haiku | 1 |
| 0.14 | Configure ESLint and Prettier for both projects | Todo | DevOps | haiku | 1 |
| 0.15 | Set up Vitest for backend testing | Todo | QA | sonnet | 2 |
| 0.16 | Set up Vitest for frontend testing | Todo | QA | sonnet | 2 |
| 0.17 | Write first tests (health check, component render) | Todo | QA | haiku | 1 |
| 0.18 | Validate full stack runs locally | Todo | QA | sonnet | 2 |

---

## Execution Order

Based on dependencies, execute tickets in this order:

### Phase 1: Repository Setup (Tickets 0.1, 0.2, 0.3)
```
0.1 → Initialize git repo
0.2 → Docker compose (needs repo)
0.3 → Environment variables (needs repo)
```

### Phase 2: Backend Foundation (Tickets 0.4, 0.5, 0.6, 0.7, 0.8)
```
0.4 → Initialize Express project
0.5 → Configure TypeScript (needs 0.4)
0.6 → Set up Drizzle (needs 0.5)
0.7 → Error middleware (needs 0.4)
0.8 → Health endpoint (needs 0.7)
```

### Phase 3: Frontend Foundation (Tickets 0.9, 0.10, 0.11, 0.12, 0.13)
```
0.9 → Initialize React project
0.10 → Configure TypeScript (needs 0.9)
0.11 → Set up Tailwind (needs 0.9)
0.12 → API client (needs 0.9)
0.13 → Layout component (needs 0.11)
```

### Phase 4: Quality & Validation (Tickets 0.14, 0.15, 0.16, 0.17, 0.18)
```
0.14 → ESLint/Prettier (can run in parallel)
0.15 → Backend Vitest (needs 0.4)
0.16 → Frontend Vitest (needs 0.9)
0.17 → First tests (needs 0.15, 0.16)
0.18 → Full validation (needs all above)
```

---

## Definition of Done

### Per-Ticket DoD

Each ticket is DONE when:

- [ ] Implementation complete per spec
- [ ] Code follows patterns in `docs/project/coding-standards.md`
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] Committed with message: `Complete 0.X: [description]`
- [ ] Backlog status updated to Done in `specs/backlog.md`

### Sprint 0 DoD

Sprint 0 is COMPLETE when:

- [ ] `docker-compose up` starts PostgreSQL successfully
- [ ] Backend starts and responds to `GET /health` with 200
- [ ] Frontend builds and displays welcome page
- [ ] All lint checks pass
- [ ] All tests pass
- [ ] README has clear setup instructions

**Verification Commands:**
```bash
# Start database
docker-compose up -d

# Run backend
cd api && npm run dev
# Visit http://localhost:3000/health

# Run frontend
cd web && npm run dev
# Visit http://localhost:5173

# Run all checks
npm run lint
npm run typecheck
npm test
```

---

## Model Selection Guide (FinOps)

| Ticket | Model | Rationale |
|--------|-------|-----------|
| 0.1, 0.3, 0.5, 0.8, 0.10, 0.12, 0.13, 0.14, 0.17 | haiku | Simple config and boilerplate |
| 0.2, 0.4, 0.6, 0.7, 0.9, 0.11, 0.15, 0.16, 0.18 | sonnet | Moderate complexity, requires patterns |

**Cost Distribution:**
- Haiku (9 tickets): ~40% of tokens
- Sonnet (9 tickets): ~60% of tokens
- Opus: 0% (not needed for foundation)

---

## Risk Assessment

### Potential Blockers

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| PostgreSQL connection issues | Medium | High | Use Docker, check connection string |
| TypeScript config conflicts | Low | Medium | Use recommended configs from spec |
| Package version conflicts | Medium | Medium | Pin specific versions |

### Complexity Areas

- **High:** Drizzle ORM setup (Ticket 0.6) - ensure correct schema imports
- **Medium:** Docker compose networking
- **Low:** Most other tickets are standard setup

### Integration Points

- Backend ← Database (PostgreSQL via Drizzle)
- Frontend ← Backend (Axios API client to /health)

---

## Directory Structure After Sprint 0

```
taskflow/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
├── api/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   ├── middleware/
│   │   │   └── error.middleware.ts
│   │   ├── db/
│   │   │   └── schema.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   ├── drizzle.config.ts
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
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── specs/
    └── (existing spec files)
```

---

## Next Steps After Sprint 0

1. Run `prompts/sprint_0/dev_sprint_0.md` to execute development
2. After development, run `prompts/sprint_0/qa_sprint_0.md` for QA testing
3. Finally, run `prompts/sprint_0/summary_sprint_0.md` to generate sprint documentation
4. Proceed to Sprint 1: User Authentication & Tasks CRUD

---

*Sprint 0 Planning Guide - TaskFlow*
