# TaskFlow - Sprint 0 Planning Guide

## Sprint Overview

**Sprint**: 0 - Foundation & Core Setup
**Duration**: 1-2 weeks
**Focus**: Project scaffolding, authentication, and basic task CRUD

---

## Sprint Goals

1. Set up project infrastructure (frontend + backend + database)
2. Implement user authentication (register, login, logout)
3. Create basic task CRUD operations
4. Establish testing framework and CI/CD pipeline

---

## User Stories

### US-0.1: Project Setup
**As a** developer
**I want** a fully configured development environment
**So that** I can start building features immediately

**Acceptance Criteria:**
- [ ] Backend Express.js project initialized with TypeScript
- [ ] Frontend React project initialized with Vite + TypeScript
- [ ] PostgreSQL database configured with Prisma ORM
- [ ] Docker Compose for local development
- [ ] ESLint + Prettier configured for both projects
- [ ] Environment variables properly configured (.env.example provided)

### US-0.2: User Registration
**As a** new user
**I want** to create an account
**So that** I can access TaskFlow

**Acceptance Criteria:**
- [ ] Registration endpoint: `POST /api/v1/auth/register`
- [ ] Email validation (valid format, unique)
- [ ] Password requirements (min 8 chars, 1 uppercase, 1 number)
- [ ] Password hashed with bcrypt
- [ ] Returns JWT token on success
- [ ] Proper error messages for validation failures

### US-0.3: User Login
**As a** registered user
**I want** to log into my account
**So that** I can access my tasks

**Acceptance Criteria:**
- [ ] Login endpoint: `POST /api/v1/auth/login`
- [ ] Validates credentials against database
- [ ] Returns JWT access token (1h expiry)
- [ ] Returns refresh token (7d expiry)
- [ ] Rate limiting on login attempts

### US-0.4: Task CRUD
**As a** logged-in user
**I want** to create, read, update, and delete tasks
**So that** I can manage my work

**Acceptance Criteria:**
- [ ] `POST /api/v1/tasks` - Create task
- [ ] `GET /api/v1/tasks` - List user's tasks
- [ ] `GET /api/v1/tasks/:id` - Get single task
- [ ] `PUT /api/v1/tasks/:id` - Update task
- [ ] `DELETE /api/v1/tasks/:id` - Delete task
- [ ] All endpoints require authentication
- [ ] Users can only access their own tasks

---

## Technical Tasks

### Backend Tasks
| ID | Task | Estimate | Priority |
|----|------|----------|----------|
| BE-0.1 | Initialize Express.js with TypeScript | 2h | P0 |
| BE-0.2 | Configure Prisma with PostgreSQL | 2h | P0 |
| BE-0.3 | Create User model and migration | 1h | P0 |
| BE-0.4 | Create Task model and migration | 1h | P0 |
| BE-0.5 | Implement auth middleware (JWT) | 3h | P0 |
| BE-0.6 | Implement auth routes (register/login) | 4h | P0 |
| BE-0.7 | Implement task CRUD routes | 4h | P0 |
| BE-0.8 | Add request validation (Zod) | 2h | P1 |
| BE-0.9 | Set up Jest for unit tests | 2h | P1 |
| BE-0.10 | Write auth endpoint tests | 3h | P1 |
| BE-0.11 | Write task endpoint tests | 3h | P1 |

### Frontend Tasks
| ID | Task | Estimate | Priority |
|----|------|----------|----------|
| FE-0.1 | Initialize React with Vite + TypeScript | 1h | P0 |
| FE-0.2 | Configure Tailwind CSS | 1h | P0 |
| FE-0.3 | Set up React Router | 1h | P0 |
| FE-0.4 | Create auth pages (Login/Register) | 4h | P0 |
| FE-0.5 | Implement auth state (Zustand) | 2h | P0 |
| FE-0.6 | Create task list component | 3h | P0 |
| FE-0.7 | Create task form component | 3h | P0 |
| FE-0.8 | Set up React Query for API calls | 2h | P1 |
| FE-0.9 | Add form validation | 2h | P1 |
| FE-0.10 | Set up Vitest for component tests | 2h | P1 |

### Infrastructure Tasks
| ID | Task | Estimate | Priority |
|----|------|----------|----------|
| INF-0.1 | Create Docker Compose configuration | 2h | P0 |
| INF-0.2 | Set up GitHub Actions CI pipeline | 2h | P1 |
| INF-0.3 | Configure environment variables | 1h | P0 |

---

## API Endpoints Summary

### Authentication
```
POST   /api/v1/auth/register   - Create new user account
POST   /api/v1/auth/login      - Authenticate user
POST   /api/v1/auth/logout     - Invalidate tokens
POST   /api/v1/auth/refresh    - Refresh access token
GET    /api/v1/auth/me         - Get current user profile
```

### Tasks
```
GET    /api/v1/tasks           - List all tasks (paginated)
POST   /api/v1/tasks           - Create new task
GET    /api/v1/tasks/:id       - Get task by ID
PUT    /api/v1/tasks/:id       - Update task
DELETE /api/v1/tasks/:id       - Delete task
```

---

## Definition of Done (DoD)

A feature is considered DONE when:

### Code Quality
- [ ] Code follows established style guide (ESLint passes)
- [ ] Code is properly formatted (Prettier passes)
- [ ] No TypeScript errors
- [ ] Code has been reviewed (or self-reviewed for solo devs)

### Testing
- [ ] Unit tests written and passing (>70% coverage)
- [ ] Integration tests for API endpoints
- [ ] Manual testing completed
- [ ] No critical bugs

### Documentation
- [ ] API endpoints documented with request/response examples
- [ ] Environment variables documented in .env.example
- [ ] README updated with setup instructions

### Deployment
- [ ] Code merged to main branch
- [ ] CI pipeline passes
- [ ] Application runs successfully in Docker

---

## Dependencies & Blockers

### Dependencies
- PostgreSQL instance available
- Node.js 20+ installed
- Docker installed for local development

### Potential Blockers
- Database connection issues
- JWT secret configuration
- CORS configuration between frontend and backend

---

## Sprint 0 Success Criteria

At the end of Sprint 0, we should have:

1. **Working Authentication**
   - Users can register with email/password
   - Users can log in and receive JWT tokens
   - Protected routes require valid JWT

2. **Basic Task Management**
   - Users can create tasks with title and description
   - Users can view their task list
   - Users can update task details
   - Users can delete tasks

3. **Development Environment**
   - `npm run dev` starts backend server
   - `npm run dev` starts frontend dev server
   - `docker-compose up` runs full stack
   - Tests pass with `npm test`

---

## Notes for Developers

- Use the docs in `/docs/architecture/` for implementation details
- Follow the database schema in `/docs/architecture/database.md`
- API responses should follow REST conventions
- All dates should be ISO 8601 format
- Passwords must be hashed before storage
