# TaskFlow Product Backlog

**Created:** 2026-01-21
**Last Updated:** 2026-01-21

---

## Team Specs Reference

| # | Spec | Description |
|---|------|-------------|
| 01 | [product_manager.md](./01_product_manager.md) | Vision, personas, requirements |
| 02 | [backend_lead.md](./02_backend_lead.md) | API design, auth, patterns |
| 03 | [frontend_lead.md](./03_frontend_lead.md) | Design system, components |
| 04 | [db_architect.md](./04_db_architect.md) | Database schema |
| 05 | [qa_lead.md](./05_qa_lead.md) | Testing strategy |

---

## Architecture Vision

```
┌─────────────────────────────────────────────────────────────┐
│                        TaskFlow                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐        ┌──────────────┐                 │
│   │   Frontend   │◄──────►│   Backend    │                 │
│   │   (React)    │  API   │   (Express)  │                 │
│   └──────────────┘        └──────┬───────┘                 │
│                                  │                          │
│                           ┌──────▼───────┐                 │
│                           │  PostgreSQL  │                 │
│                           └──────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Status Legend

| Emoji | Status | Meaning |
|-------|--------|---------|
| 🔲 | Todo | Not started |
| 🔄 | In Progress | Currently being worked on |
| 🧪 | QA Review | Implementation complete, needs testing |
| ✅ | Done | Tested and verified |
| ⏸️ | Blocked | Cannot proceed (see notes) |

---

## ✅ Sprint 0: Foundation & Setup — COMPLETE

**Goal:** Set up project infrastructure and development environment.

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 0.1 | Initialize git repository with .gitignore and README | ✅ Done | DevOps | haiku |
| 0.2 | Create docker-compose.yml for PostgreSQL | ✅ Done | DevOps | sonnet |
| 0.3 | Create .env.example with all required variables | ✅ Done | DevOps | haiku |
| 0.4 | Initialize backend project (Express + TypeScript) | ✅ Done | Backend | sonnet |
| 0.5 | Configure backend TypeScript with strict settings | ✅ Done | Backend | haiku |
| 0.6 | Set up Drizzle ORM with PostgreSQL connection | ✅ Done | Backend | sonnet |
| 0.7 | Create base error handling middleware | ✅ Done | Backend | sonnet |
| 0.8 | Implement health check endpoint (GET /health) | ✅ Done | Backend | haiku |
| 0.9 | Initialize frontend project (React + Vite + TypeScript) | ✅ Done | Frontend | sonnet |
| 0.10 | Configure frontend TypeScript and path aliases | ✅ Done | Frontend | haiku |
| 0.11 | Set up Tailwind CSS with design system colors | ✅ Done | Frontend | sonnet |
| 0.12 | Create API client with Axios | ✅ Done | Frontend | haiku |
| 0.13 | Create basic Layout component | ✅ Done | Frontend | haiku |
| 0.14 | Configure ESLint and Prettier for both projects | ✅ Done | DevOps | haiku |
| 0.15 | Set up Vitest for backend testing | ✅ Done | QA | sonnet |
| 0.16 | Set up Vitest for frontend testing | ✅ Done | QA | sonnet |
| 0.17 | Write first tests (health check, component render) | ✅ Done | QA | haiku |
| 0.18 | Validate full stack runs locally | ✅ Done | QA | sonnet |

### Dependencies
- None (this is the first sprint)

### Definition of Done
- [x] `docker-compose up` starts PostgreSQL successfully
- [x] Backend starts and responds to GET /health with 200
- [x] Frontend builds and displays welcome page
- [x] All lint checks pass
- [x] All tests pass
- [x] README has clear setup instructions

---

## 🔲 Sprint 1: User Authentication & Tasks CRUD — PLANNED

**Goal:** Implement user authentication and core task management features.

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 1.1 | Create users table migration | 🔲 Todo | Backend | haiku |
| 1.2 | Create tasks table migration | 🔲 Todo | Backend | haiku |
| 1.3 | Implement password hashing utility (bcrypt) | 🔲 Todo | Backend | sonnet |
| 1.4 | Implement JWT utilities (sign, verify) | 🔲 Todo | Backend | sonnet |
| 1.5 | Create auth middleware for protected routes | 🔲 Todo | Backend | sonnet |
| 1.6 | Implement POST /auth/register endpoint | 🔲 Todo | Backend | sonnet |
| 1.7 | Implement POST /auth/login endpoint | 🔲 Todo | Backend | sonnet |
| 1.8 | Implement GET /auth/me endpoint | 🔲 Todo | Backend | haiku |
| 1.9 | Create TaskRepository with CRUD methods | 🔲 Todo | Backend | sonnet |
| 1.10 | Create TaskService with business logic | 🔲 Todo | Backend | sonnet |
| 1.11 | Implement GET /tasks endpoint with filters | 🔲 Todo | Backend | sonnet |
| 1.12 | Implement POST /tasks endpoint | 🔲 Todo | Backend | sonnet |
| 1.13 | Implement PATCH /tasks/:id endpoint | 🔲 Todo | Backend | sonnet |
| 1.14 | Implement DELETE /tasks/:id endpoint | 🔲 Todo | Backend | haiku |
| 1.15 | Implement PATCH /tasks/:id/complete endpoint | 🔲 Todo | Backend | haiku |
| 1.16 | Create Button UI component | 🔲 Todo | Frontend | sonnet |
| 1.17 | Create Input UI component | 🔲 Todo | Frontend | sonnet |
| 1.18 | Create Card UI component | 🔲 Todo | Frontend | haiku |
| 1.19 | Create Modal UI component | 🔲 Todo | Frontend | sonnet |
| 1.20 | Create auth store with Zustand | 🔲 Todo | Frontend | sonnet |
| 1.21 | Create LoginForm component | 🔲 Todo | Frontend | sonnet |
| 1.22 | Create RegisterForm component | 🔲 Todo | Frontend | sonnet |
| 1.23 | Create Login page | 🔲 Todo | Frontend | haiku |
| 1.24 | Create Register page | 🔲 Todo | Frontend | haiku |
| 1.25 | Implement ProtectedRoute component | 🔲 Todo | Frontend | sonnet |
| 1.26 | Create task store with Zustand | 🔲 Todo | Frontend | sonnet |
| 1.27 | Create TaskCard component | 🔲 Todo | Frontend | sonnet |
| 1.28 | Create TaskList component | 🔲 Todo | Frontend | haiku |
| 1.29 | Create TaskForm component | 🔲 Todo | Frontend | sonnet |
| 1.30 | Create Dashboard page | 🔲 Todo | Frontend | sonnet |
| 1.31 | Write unit tests for auth service | 🔲 Todo | QA | sonnet |
| 1.32 | Write unit tests for task service | 🔲 Todo | QA | sonnet |
| 1.33 | Write integration tests for auth routes | 🔲 Todo | QA | sonnet |
| 1.34 | Write integration tests for task routes | 🔲 Todo | QA | sonnet |
| 1.35 | Write component tests for TaskCard | 🔲 Todo | QA | sonnet |
| 1.36 | End-to-end validation of auth flow | 🔲 Todo | QA | opus |

### Dependencies
- Sprint 0 complete

### Definition of Done
- [ ] User can register with email/password
- [ ] User can login and receives JWT
- [ ] User can create, view, update, delete tasks
- [ ] User can mark tasks as complete/incomplete
- [ ] Tasks are filtered to current user only
- [ ] All tests pass with > 70% coverage
- [ ] No console errors in browser

---

## 🔲 Sprint 2: Projects & Filtering — PLANNED

**Goal:** Add projects for organization and filtering capabilities.

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 2.1 | Create projects table migration | 🔲 Todo | Backend | haiku |
| 2.2 | Add project_id to tasks table | 🔲 Todo | Backend | haiku |
| 2.3 | Create ProjectRepository | 🔲 Todo | Backend | sonnet |
| 2.4 | Create ProjectService | 🔲 Todo | Backend | sonnet |
| 2.5 | Implement projects CRUD endpoints | 🔲 Todo | Backend | sonnet |
| 2.6 | Add project filter to GET /tasks | 🔲 Todo | Backend | haiku |
| 2.7 | Add search parameter to GET /tasks | 🔲 Todo | Backend | sonnet |
| 2.8 | Add sorting to GET /tasks | 🔲 Todo | Backend | haiku |
| 2.9 | Create ProjectCard component | 🔲 Todo | Frontend | sonnet |
| 2.10 | Create ProjectList component | 🔲 Todo | Frontend | haiku |
| 2.11 | Create project store with Zustand | 🔲 Todo | Frontend | sonnet |
| 2.12 | Add project selector to TaskForm | 🔲 Todo | Frontend | haiku |
| 2.13 | Create TaskFilters component | 🔲 Todo | Frontend | sonnet |
| 2.14 | Create SearchInput component | 🔲 Todo | Frontend | haiku |
| 2.15 | Implement task search in Dashboard | 🔲 Todo | Frontend | sonnet |
| 2.16 | Add sidebar with project navigation | 🔲 Todo | Frontend | sonnet |
| 2.17 | Write tests for project endpoints | 🔲 Todo | QA | sonnet |
| 2.18 | Write tests for filter/search | 🔲 Todo | QA | sonnet |

### Dependencies
- Sprint 1 complete

### Definition of Done
- [ ] User can create and manage projects
- [ ] User can assign tasks to projects
- [ ] User can filter tasks by project, status, priority
- [ ] User can search tasks by title/description
- [ ] All tests pass

---

## Future Sprints (Planned)

| Sprint | Name | Description | Est. Tickets |
|--------|------|-------------|--------------|
| 3 | Due Dates & Reminders | Date picker, notifications | ~10 |
| 4 | Polish & Performance | UX improvements, optimization | ~10 |
| 5 | Collaboration | Shared projects, team features | ~15 |

---

## Bug Backlog

Bugs discovered during development:

| # | Bug | Status | Severity | Sprint |
|---|-----|--------|----------|--------|
| B.1 | (None yet) | - | - | - |

---

## Sprint Retrospectives

### Sprint 0
- ✅ Complete — All 18 tickets delivered. Full-stack foundation: Express + React + PostgreSQL + Drizzle ORM. Tests pass. See `sprints/sprint-0/summary.md`.

### Sprint 1
- (TBD after completion)

---

## Key Decisions

1. **Database:** PostgreSQL for reliability and JSON support
2. **ORM:** Drizzle ORM for type safety and performance
3. **State Management:** Zustand for simplicity
4. **Styling:** Tailwind CSS for rapid development
5. **Testing:** Vitest for unified testing across stack

---

*Last updated: 2026-01-21*
