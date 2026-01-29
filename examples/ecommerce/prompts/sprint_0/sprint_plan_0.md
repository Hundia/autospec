# Sprint 0 Planning Guide: Foundation

## Environment: claude-code

## Sprint Overview
- **Goal:** Establish project infrastructure, database schema, and core authentication system.
- **Duration:** 2 weeks
- **Total Tickets:** 25
- **Total Story Points:** 80
- **Dependencies:** None (this is the foundation sprint)

## Pre-Sprint Checklist
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ running locally or via Docker
- [ ] Redis 7+ running locally or via Docker
- [ ] Git initialized
- [ ] IDE/editor configured with TypeScript support
- [ ] All spec files reviewed and understood

## Tickets Overview

| # | Ticket | Status | Owner | Model | Points | Depends |
|---|--------|--------|-------|-------|--------|---------|
| SF-001 | Initialize Next.js project with TypeScript and TailwindCSS | ready | Frontend | Sonnet | 2 | - |
| SF-002 | Set up ESLint, Prettier, and Husky pre-commit hooks | ready | Frontend | Sonnet | 2 | SF-001 |
| SF-003 | Configure project directory structure per spec | ready | Frontend | Sonnet | 1 | SF-001 |
| SF-004 | Set up Express.js backend with TypeScript | ready | Backend | Sonnet | 3 | - |
| SF-005 | Configure PostgreSQL database connection with Prisma ORM | ready | Backend | Sonnet | 3 | SF-004 |
| SF-006 | Create database migration for users table | ready | Backend | Sonnet | 3 | SF-005 |
| SF-007 | Create database migration for user_addresses table | ready | Backend | Sonnet | 2 | SF-006 |
| SF-008 | Create database migration for user_sessions table | ready | Backend | Sonnet | 2 | SF-006 |
| SF-009 | Implement JWT authentication middleware | ready | Backend | Sonnet | 5 | SF-004 |
| SF-010 | Implement POST /api/v1/auth/register endpoint | ready | Backend | Sonnet | 5 | SF-006, SF-009 |
| SF-011 | Implement POST /api/v1/auth/login endpoint | ready | Backend | Sonnet | 5 | SF-006, SF-009 |
| SF-012 | Implement POST /api/v1/auth/logout endpoint | ready | Backend | Sonnet | 2 | SF-009 |
| SF-013 | Implement POST /api/v1/auth/refresh endpoint | ready | Backend | Sonnet | 3 | SF-008, SF-009 |
| SF-014 | Implement GET /api/v1/auth/me endpoint | ready | Backend | Sonnet | 2 | SF-009 |
| SF-015 | Implement password reset flow (forgot/reset endpoints) | ready | Backend | Sonnet | 5 | SF-006 |
| SF-016 | Create Zustand auth store with login/logout actions | ready | Frontend | Sonnet | 3 | SF-001 |
| SF-017 | Build Login page UI with form validation | ready | Frontend | Sonnet | 5 | SF-002, SF-016 |
| SF-018 | Build Registration page UI with password requirements | ready | Frontend | Sonnet | 5 | SF-002, SF-016 |
| SF-019 | Build Forgot Password page UI | ready | Frontend | Sonnet | 3 | SF-002 |
| SF-020 | Integrate frontend auth with backend API | ready | Frontend | Sonnet | 5 | SF-010, SF-011, SF-016, SF-017, SF-018 |
| SF-021 | Set up Redis for session caching | ready | Backend | Sonnet | 3 | SF-004 |
| SF-022 | Implement API rate limiting middleware | ready | Backend | Sonnet | 3 | SF-021 |
| SF-023 | Set up Jest testing framework for frontend | ready | Frontend | Sonnet | 2 | SF-001 |
| SF-024 | Set up Jest testing framework for backend | ready | Backend | Sonnet | 2 | SF-004 |
| SF-025 | Write unit tests for auth endpoints | ready | Backend | Sonnet | 5 | SF-010, SF-011, SF-024 |

## Execution Order

Based on dependencies, execute in this optimal order:

### Phase 1: Project Setup (Parallel)
1. **SF-001** - Initialize Next.js project (Frontend)
2. **SF-004** - Set up Express.js backend (Backend)

### Phase 2: Configuration (Parallel after Phase 1)
3. **SF-002** - ESLint, Prettier, Husky (depends on SF-001)
4. **SF-003** - Directory structure (depends on SF-001)
5. **SF-005** - PostgreSQL + Prisma (depends on SF-004)
6. **SF-021** - Redis setup (depends on SF-004)
7. **SF-023** - Jest frontend (depends on SF-001)
8. **SF-024** - Jest backend (depends on SF-004)

### Phase 3: Database Migrations (Sequential)
9. **SF-006** - Users table migration (depends on SF-005)
10. **SF-007** - User addresses table (depends on SF-006)
11. **SF-008** - User sessions table (depends on SF-006)

### Phase 4: Auth System (Backend)
12. **SF-009** - JWT middleware (depends on SF-004)
13. **SF-022** - Rate limiting (depends on SF-021)
14. **SF-010** - Register endpoint (depends on SF-006, SF-009)
15. **SF-011** - Login endpoint (depends on SF-006, SF-009)
16. **SF-012** - Logout endpoint (depends on SF-009)
17. **SF-013** - Refresh endpoint (depends on SF-008, SF-009)
18. **SF-014** - Get me endpoint (depends on SF-009)
19. **SF-015** - Password reset flow (depends on SF-006)

### Phase 5: Frontend Auth UI
20. **SF-016** - Zustand auth store (depends on SF-001)
21. **SF-017** - Login page UI (depends on SF-002, SF-016)
22. **SF-018** - Registration page UI (depends on SF-002, SF-016)
23. **SF-019** - Forgot password page (depends on SF-002)

### Phase 6: Integration & Testing
24. **SF-020** - Frontend-backend integration (depends on SF-010, SF-011, SF-016, SF-017, SF-018)
25. **SF-025** - Auth endpoint tests (depends on SF-010, SF-011, SF-024)

## Definition of Done

### Per-Ticket DoD
Each ticket is DONE when:
- [ ] Implementation complete per spec
- [ ] Unit tests written and passing
- [ ] Integration tests (if applicable)
- [ ] Code follows coding-standards.md
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Committed with message: "Complete SF-XXX: [description]"
- [ ] Backlog status updated to Done

### Sprint DoD
Sprint 0 is COMPLETE when:
- [ ] All 25 tickets show Done status
- [ ] All tests pass: `npm test` exits 0
- [ ] Lint passes: `npm run lint` exits 0
- [ ] Type check passes: `npm run typecheck` exits 0
- [ ] Build succeeds: `npm run build` exits 0
- [ ] Health check endpoint responds: `curl http://localhost:3001/health`
- [ ] Register endpoint works: `curl -X POST http://localhost:3001/api/v1/auth/register`
- [ ] Login endpoint works: `curl -X POST http://localhost:3001/api/v1/auth/login`
- [ ] QA review complete (see qa_sprint_0.md)
- [ ] Sprint summary created (see summary_sprint_0.md)
- [ ] All changes committed and pushed

## Model Selection Guide (FinOps)

Based on ticket complexity:

| Ticket | Recommended Model | Rationale |
|--------|-------------------|-----------|
| SF-001 | Sonnet | Standard Next.js scaffolding |
| SF-002 | Haiku | Config file setup, simple task |
| SF-003 | Haiku | Directory creation, trivial |
| SF-004 | Sonnet | Express + TypeScript requires patterns |
| SF-005 | Sonnet | Prisma setup with proper config |
| SF-006 | Sonnet | User table with proper constraints |
| SF-007 | Haiku | Simple address table |
| SF-008 | Haiku | Simple session table |
| SF-009 | Opus | Security-critical JWT middleware |
| SF-010 | Sonnet | Standard registration with validation |
| SF-011 | Sonnet | Standard login with validation |
| SF-012 | Haiku | Simple logout, minimal logic |
| SF-013 | Sonnet | Token refresh requires careful handling |
| SF-014 | Haiku | Simple profile retrieval |
| SF-015 | Opus | Security-critical password reset |
| SF-016 | Sonnet | Zustand store with async actions |
| SF-017 | Sonnet | Form with validation states |
| SF-018 | Sonnet | Form with password requirements |
| SF-019 | Haiku | Simple form UI |
| SF-020 | Sonnet | API integration with error handling |
| SF-021 | Haiku | Redis client setup |
| SF-022 | Sonnet | Rate limiting with sliding window |
| SF-023 | Haiku | Jest config, standard setup |
| SF-024 | Haiku | Jest config, standard setup |
| SF-025 | Sonnet | Auth tests with mocking |

**Distribution:** Haiku: 9 tickets (36%), Sonnet: 14 tickets (56%), Opus: 2 tickets (8%)

## Risk Assessment

### Blockers
- PostgreSQL must be running before SF-005
- Redis must be running before SF-021
- Backend must be running before frontend integration (SF-020)

### Complexity Areas
- **High:** SF-009 (JWT middleware), SF-015 (password reset)
- **Medium:** SF-010, SF-011 (auth endpoints with validation)
- **Low:** Configuration and setup tickets

### Integration Points
- Backend API <-> Frontend Zustand store (SF-020)
- Prisma <-> PostgreSQL (SF-005)
- Redis <-> Express middleware (SF-021, SF-022)

## Next Steps

1. Run `dev_sprint_0.md` prompt to execute development
2. After development, run `qa_sprint_0.md` for QA testing
3. Finally, run `summary_sprint_0.md` to generate sprint documentation
