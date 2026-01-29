# Sprint 0 Planning Guide: Foundation & Infrastructure

## Environment: claude-code

## Sprint Overview
- **Goal:** Establish project foundation, database schema, and development environment.
- **Duration:** 2 weeks (estimated based on 45 story points)
- **Total Tickets:** 15
- **Total Story Points:** 45
- **Dependencies:** None (this is the foundation sprint)

## Pre-Sprint Checklist
- [ ] Node.js 18+ installed
- [ ] Docker and Docker Compose installed
- [ ] PostgreSQL 15+ available (or via Docker)
- [ ] Redis 7+ available (or via Docker)
- [ ] Git repository initialized
- [ ] IDE/editor configured with TypeScript support

## Tickets Overview

| #      | Ticket                                                                      | Status    | Owner   | Model  | Depends        | Points |
| ------ | --------------------------------------------------------------------------- | --------- | ------- | ------ | -------------- | ------ |
| DH-001 | Initialize Node.js project with TypeScript configuration                    | todo      | Backend | Sonnet | -              | 2      |
| DH-002 | Configure ESLint, Prettier, and Husky pre-commit hooks                      | todo      | Backend | Sonnet | DH-001         | 2      |
| DH-003 | Set up Express.js application structure with middleware stack               | todo      | Backend | Sonnet | DH-001         | 3      |
| DH-004 | Create PostgreSQL database connection with connection pooling               | todo      | Backend | Sonnet | DH-003         | 3      |
| DH-005 | Create Redis connection service for caching and rate limiting               | todo      | Backend | Sonnet | DH-003         | 3      |
| DH-006 | Implement database migration system with versioned SQL files                | todo      | Backend | Sonnet | DH-004         | 3      |
| DH-007 | Create api_keys table migration with all fields and indexes                 | todo      | Backend | Sonnet | DH-006         | 3      |
| DH-008 | Create request_logs table migration with partitioning support               | todo      | Backend | Sonnet | DH-006         | 5      |
| DH-009 | Create webhooks and webhook_events table migrations                         | todo      | Backend | Sonnet | DH-006         | 3      |
| DH-010 | Create webhook_deliveries table migration with partitioning                 | todo      | Backend | Sonnet | DH-006         | 3      |
| DH-011 | Create rate_limits and audit_logs table migrations                          | todo      | Backend | Sonnet | DH-006         | 3      |
| DH-012 | Implement health check endpoints (GET /health, /health/ready, /health/live) | todo      | Backend | Sonnet | DH-004, DH-005 | 3      |
| DH-013 | Create Dockerfile for production with multi-stage build                     | todo      | DevOps  | Sonnet | DH-003         | 3      |
| DH-014 | Create Docker Compose configuration for local development                   | todo      | DevOps  | Sonnet | DH-013         | 3      |
| DH-015 | Set up Jest testing framework with Supertest for API tests                  | todo      | QA      | Sonnet | DH-003         | 3      |

## Execution Order

Based on dependencies, execute in this order:

### Phase 1: Project Foundation (DH-001, DH-002)
1. **DH-001** - Initialize Node.js project with TypeScript configuration
2. **DH-002** - Configure ESLint, Prettier, and Husky pre-commit hooks (depends on DH-001)

### Phase 2: Application Structure (DH-003, DH-013, DH-015)
3. **DH-003** - Set up Express.js application structure with middleware stack (depends on DH-001)
4. **DH-013** - Create Dockerfile for production with multi-stage build (depends on DH-003)
5. **DH-015** - Set up Jest testing framework with Supertest (depends on DH-003)

### Phase 3: Database & Cache Connections (DH-004, DH-005, DH-014)
6. **DH-004** - Create PostgreSQL database connection with connection pooling (depends on DH-003)
7. **DH-005** - Create Redis connection service for caching (depends on DH-003)
8. **DH-014** - Create Docker Compose configuration for local development (depends on DH-013)

### Phase 4: Database Migrations (DH-006 through DH-011)
9. **DH-006** - Implement database migration system with versioned SQL files (depends on DH-004)
10. **DH-007** - Create api_keys table migration (depends on DH-006)
11. **DH-008** - Create request_logs table migration with partitioning (depends on DH-006)
12. **DH-009** - Create webhooks and webhook_events table migrations (depends on DH-006)
13. **DH-010** - Create webhook_deliveries table migration with partitioning (depends on DH-006)
14. **DH-011** - Create rate_limits and audit_logs table migrations (depends on DH-006)

### Phase 5: Health Endpoints (DH-012)
15. **DH-012** - Implement health check endpoints (depends on DH-004, DH-005)

## Definition of Done

### Per-Ticket DoD
Each ticket is DONE when:
- [ ] Implementation complete per spec
- [ ] Unit tests written and passing (where applicable)
- [ ] Code follows coding standards (ESLint, Prettier pass)
- [ ] No TypeScript errors (`npm run typecheck` passes)
- [ ] Committed with message: "Complete DH-XXX: [description]"
- [ ] Backlog status updated to Done

### Sprint 0 DoD
Sprint is COMPLETE when:
- [ ] All 15 tickets show Done status
- [ ] All tests pass: `npm test` exits 0
- [ ] Lint passes: `npm run lint` exits 0
- [ ] Type check passes: `npm run typecheck` exits 0
- [ ] Build succeeds: `npm run build` exits 0
- [ ] Docker containers start: `docker-compose up` works
- [ ] Health endpoints respond correctly:
  - GET /health returns 200 with status
  - GET /health/ready returns 200 when DB/Redis connected
  - GET /health/live returns 200 (always)
- [ ] All database migrations run successfully: `npm run db:migrate`
- [ ] QA review complete (see qa_sprint_0.md)
- [ ] Sprint summary created (see summary_sprint_0.md)
- [ ] All changes committed and pushed

## Model Selection Guide (FinOps)
Based on ticket complexity:

| Ticket | Recommended Model | Rationale |
|--------|-------------------|-----------|
| DH-001 | Sonnet | Standard project setup, well-defined patterns |
| DH-002 | Haiku | Configuration files, boilerplate |
| DH-003 | Sonnet | Express setup with middleware requires some thought |
| DH-004 | Sonnet | Connection pooling configuration |
| DH-005 | Sonnet | Redis client setup with reconnection logic |
| DH-006 | Sonnet | Migration system design |
| DH-007 | Haiku | Standard table migration SQL |
| DH-008 | Sonnet | Partitioning requires PostgreSQL expertise |
| DH-009 | Haiku | Standard table migrations |
| DH-010 | Sonnet | Partitioning requires PostgreSQL expertise |
| DH-011 | Haiku | Standard table migrations |
| DH-012 | Sonnet | Health checks with dependency verification |
| DH-013 | Haiku | Standard multi-stage Dockerfile |
| DH-014 | Haiku | Docker Compose configuration |
| DH-015 | Sonnet | Test framework setup with configuration |

**Model Distribution:** Haiku (5/15 = 33%), Sonnet (10/15 = 67%), Opus (0%)

## Risk Assessment
- **Blockers:**
  - Docker/Docker Compose installation issues
  - PostgreSQL/Redis connectivity problems
  - TypeScript configuration conflicts
- **Complexity:**
  - Medium: Table partitioning (DH-008, DH-010)
  - Low: Most other tickets are standard setup
- **Integration Points:**
  - DH-012 (health checks) depends on both DH-004 (PostgreSQL) and DH-005 (Redis)
  - All migrations depend on DH-006 (migration system)

## Environment Variables Required

Create a `.env` file with these variables:

```bash
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://datahub:datahub@localhost:5432/datahub
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=20

# Redis
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=debug
```

## Next Steps
1. Run `dev_sprint_0.md` prompt to execute development
2. After development, run `qa_sprint_0.md` for QA testing
3. Finally, run `summary_sprint_0.md` to generate sprint documentation
