# Claude Code — TaskFlow

## About This Project

TaskFlow is a task management application built using the AutoSpec Spec-Driven Development (SDD) framework. All implementation is driven by the specs in `specs/`.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Express 4.x + TypeScript 5.x |
| Database | PostgreSQL 15+ |
| ORM | Drizzle ORM 0.29+ |
| Validation | Zod 3.x |
| Frontend | React 18 + Vite 5 + TypeScript |
| Styling | Tailwind CSS 3.x |
| State | Zustand 4.x |
| HTTP Client | Axios 1.x |
| Routing | React Router 6.x |
| Testing | Vitest + Testing Library + Supertest |

## Project Structure

```
taskflow/
├── CLAUDE.md                # This file — SDD rules
├── requirements.md          # Product requirements document
├── specs/                   # Role specifications (input)
│   ├── 01_product_manager.md
│   ├── 02_backend_lead.md
│   ├── 03_frontend_lead.md
│   ├── 04_db_architect.md
│   ├── 05_qa_lead.md
│   └── backlog.md           # Sprint tickets
├── agents/                  # Sprint briefing files
├── sprints/                 # Sprint summaries (output)
├── docs/                    # Living documentation (output)
├── api/                     # Express backend (generated)
│   ├── src/
│   ├── tests/
│   ├── drizzle.config.ts
│   ├── package.json
│   └── tsconfig.json
├── web/                     # React frontend (generated)
│   ├── src/
│   ├── tests/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml       # PostgreSQL + dev services
```

## Mandatory Development Workflow

### Rule 1: Backlog-First

Every change MUST be tracked in `specs/backlog.md`:
- Set 🔄 In Progress when starting a ticket
- Set ✅ Done when complete
- Never skip a ticket or work out of order within a sprint

### Rule 2: Spec-Driven

All implementation decisions come from the specs:
- API design → `specs/02_backend_lead.md`
- Components/pages → `specs/03_frontend_lead.md`
- Database schema → `specs/04_db_architect.md`
- Test scenarios → `specs/05_qa_lead.md`

If a spec doesn't cover something, make a reasonable choice and document it.

### Rule 3: Living Documentation

After completing a sprint, create/update docs:
- `docs/architecture.md` — system overview, tech decisions
- `docs/api.md` — endpoint reference
- `docs/setup.md` — how to run the project
- `docs/database.md` — schema, migrations

### Rule 4: Sprint Summary

After completing a sprint, write `sprints/sprint-X/summary.md` following this template:

```markdown
# Sprint X Summary

**Date:** YYYY-MM-DD
**Status:** ✅ COMPLETE

## Overview
[2-3 sentence summary]

## Completed Tickets
| # | Ticket | Status | Docs |
|---|--------|--------|------|
| X.Y | Title | ✅ | [docs/file.md] |

## Documentation Updated
| Doc File | Change |
|----------|--------|
| `docs/file.md` | What changed |

## Key Files Created/Modified
[List of files]

## QA Results
| Check | Result |
|-------|--------|
| TypeScript compiles | ✅/❌ |
| Tests pass | ✅/❌ |
| Lint passes | ✅/❌ |

## Retrospective
[What went well / what to improve]
```

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
cd api && npx drizzle-kit generate    # Generate migration
```
