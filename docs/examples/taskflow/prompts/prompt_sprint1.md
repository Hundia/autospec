# Sprint 1: User Authentication & Tasks CRUD

**Starting Sprint 1: User Authentication & Tasks CRUD**

Read `specs/backlog.md` for full project context. This is TaskFlow - a task management application.

## Project State
- Sprint 0 complete (foundation, project structure, tooling)
- Stack: Node.js 20, Express, PostgreSQL, Drizzle ORM, React 18, Vite, TypeScript, Tailwind CSS
- Previous sprint delivered: Working dev environment, health check, basic layout

## What Exists from Sprint 0
- `api/` - Express backend with health check
- `web/` - React frontend with Tailwind
- `docker-compose.yml` - PostgreSQL database
- Testing framework configured (Vitest)
- ESLint/Prettier configured

## Sprint 1 Scope (36 tickets)

Implement user authentication and core task management so users can register, login, and manage their tasks.

### Sprint 1 Tickets

**Part A: Database Migrations**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 1.1 | Create users table migration | Backend | haiku |
| 1.2 | Create tasks table migration | Backend | haiku |

**Part B: Auth Backend**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 1.3 | Implement password hashing utility (bcrypt) | Backend | sonnet |
| 1.4 | Implement JWT utilities (sign, verify) | Backend | sonnet |
| 1.5 | Create auth middleware for protected routes | Backend | sonnet |
| 1.6 | Implement POST /auth/register endpoint | Backend | sonnet |
| 1.7 | Implement POST /auth/login endpoint | Backend | sonnet |
| 1.8 | Implement GET /auth/me endpoint | Backend | haiku |

**Part C: Tasks Backend**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 1.9 | Create TaskRepository with CRUD methods | Backend | sonnet |
| 1.10 | Create TaskService with business logic | Backend | sonnet |
| 1.11 | Implement GET /tasks endpoint with filters | Backend | sonnet |
| 1.12 | Implement POST /tasks endpoint | Backend | sonnet |
| 1.13 | Implement PATCH /tasks/:id endpoint | Backend | sonnet |
| 1.14 | Implement DELETE /tasks/:id endpoint | Backend | haiku |
| 1.15 | Implement PATCH /tasks/:id/complete endpoint | Backend | haiku |

**Part D: UI Components**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 1.16 | Create Button UI component | Frontend | sonnet |
| 1.17 | Create Input UI component | Frontend | sonnet |
| 1.18 | Create Card UI component | Frontend | haiku |
| 1.19 | Create Modal UI component | Frontend | sonnet |

**Part E: Auth Frontend**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 1.20 | Create auth store with Zustand | Frontend | sonnet |
| 1.21 | Create LoginForm component | Frontend | sonnet |
| 1.22 | Create RegisterForm component | Frontend | sonnet |
| 1.23 | Create Login page | Frontend | haiku |
| 1.24 | Create Register page | Frontend | haiku |
| 1.25 | Implement ProtectedRoute component | Frontend | sonnet |

**Part F: Tasks Frontend**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 1.26 | Create task store with Zustand | Frontend | sonnet |
| 1.27 | Create TaskCard component | Frontend | sonnet |
| 1.28 | Create TaskList component | Frontend | haiku |
| 1.29 | Create TaskForm component | Frontend | sonnet |
| 1.30 | Create Dashboard page | Frontend | sonnet |

**Part G: Testing**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 1.31 | Write unit tests for auth service | QA | sonnet |
| 1.32 | Write unit tests for task service | QA | sonnet |
| 1.33 | Write integration tests for auth routes | QA | sonnet |
| 1.34 | Write integration tests for task routes | QA | sonnet |
| 1.35 | Write component tests for TaskCard | QA | sonnet |
| 1.36 | End-to-end validation of auth flow | QA | opus |

### Definition of Done
- [ ] User can register with email/password
- [ ] User can login and receives JWT
- [ ] User can create, view, update, delete tasks
- [ ] User can mark tasks as complete/incomplete
- [ ] Tasks are filtered to current user only
- [ ] All tests pass with > 70% coverage
- [ ] No console errors in browser

## Execution Guidelines

### 1. Specs to Read
- `specs/02_backend_lead.md` - API patterns, auth, validation
- `specs/03_frontend_lead.md` - Component specs, state management
- `specs/04_db_architect.md` - Table schemas
- `specs/05_qa_lead.md` - Test scenarios

### 2. Model Selection
**haiku**: 1.1, 1.2, 1.8, 1.14, 1.15, 1.18, 1.23, 1.24, 1.28
**sonnet**: 1.3-1.7, 1.9-1.13, 1.16-1.17, 1.19-1.22, 1.25-1.27, 1.29-1.35
**opus**: 1.36 (complex E2E validation)

### 3. Implementation Order

```
Phase 1: Database (1.1-1.2)
    └── Must run first

Phase 2: Auth Backend (1.3-1.8)
    └── Depends on: Users table

Phase 3: Tasks Backend (1.9-1.15)
    └── Depends on: Tasks table, Auth middleware

Phase 4: UI Components (1.16-1.19)
    └── Can start after Sprint 0

Phase 5: Auth Frontend (1.20-1.25)
    └── Depends on: Auth Backend, UI Components

Phase 6: Tasks Frontend (1.26-1.30)
    └── Depends on: Tasks Backend, UI Components

Phase 7: Testing (1.31-1.36)
    └── Can start partially in parallel
```

### 4. Key Technical Notes

**Users Table Schema:**
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Tasks Table Schema:**
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**JWT Config:**
- Access token: 15 min expiry
- Use HTTP-only cookies or Authorization header

**Validation (Zod):**
- Email: valid format
- Password: min 8 chars, 1 uppercase, 1 number
- Task title: required, max 255 chars

### 5. Testing Requirements

After backend changes:
```bash
cd api && npm test
```

After frontend changes:
```bash
cd web && npm test
```

All tests must pass before marking tickets done.

### 6. Backlog Updates

Update `specs/backlog.md` as you complete:
- 🔲 Todo → 🔄 In Progress → ✅ Done

## Multi-Agent Strategy

### Agent A (Backend)
Tickets: 1.1-1.15 (all database and API work)

**Execution Order:**
1. 1.1-1.2 (migrations)
2. 1.3-1.4 (utilities)
3. 1.5 (auth middleware)
4. 1.6-1.8 (auth endpoints)
5. 1.9-1.15 (task endpoints)

### Agent B (Frontend)
Tickets: 1.16-1.30 (all UI work)

**Execution Order:**
1. 1.16-1.19 (UI components) - can start immediately
2. 1.20-1.25 (auth) - after UI components, can use mock data
3. 1.26-1.30 (tasks) - after auth ready

### Sync Points
- After 1.8: Auth API ready, Agent B can integrate
- After 1.15: Tasks API ready, Agent B can integrate

### QA (After sync)
Tickets: 1.31-1.36

## Starting Command

**Agent A:** Begin with 1.1 (users migration), update backlog, implement.
**Agent B:** Begin with 1.16 (Button component), update backlog, implement.

Track progress with todo list. Update backlog after each ticket.

---

*Generated with SDD for All framework*
