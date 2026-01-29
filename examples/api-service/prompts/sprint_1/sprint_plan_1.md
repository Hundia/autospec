# Sprint 1 Planning Guide: Core API Features

## Environment: claude-code

## Sprint Overview
- **Goal:** Implement API key management, authentication, and rate limiting.
- **Duration:** 2 weeks (estimated based on 52 story points)
- **Total Tickets:** 22
- **Total Story Points:** 52
- **Dependencies:** Sprint 0 must be complete (DH-001 through DH-015)

## Pre-Sprint Checklist
- [ ] Sprint 0 complete and all tickets Done
- [ ] All database migrations applied
- [ ] Docker services running (PostgreSQL, Redis)
- [ ] Health endpoints responding correctly
- [ ] All tests passing from Sprint 0
- [ ] spec files reviewed for Sprint 1 requirements

## Tickets Overview

| #      | Ticket                                                         | Status  | Owner   | Model  | Depends        | Points |
| ------ | -------------------------------------------------------------- | ------- | ------- | ------ | -------------- | ------ |
| DH-016 | Implement API key generation utility with secure random tokens | Pending | Backend | Sonnet | DH-007         | 3      |
| DH-017 | Implement API key hashing service using SHA-256                | Pending | Backend | Sonnet | DH-016         | 2      |
| DH-018 | Create API key repository with CRUD database operations        | Pending | Backend | Sonnet | DH-007, DH-017 | 5      |
| DH-019 | Implement authentication middleware for API key validation     | Pending | Backend | Opus   | DH-018         | 5      |
| DH-020 | Implement scope-based authorization middleware                 | Pending | Backend | Opus   | DH-019         | 5      |
| DH-021 | Create POST /api/v1/keys endpoint for key creation             | Pending | Backend | Sonnet | DH-018, DH-020 | 3      |
| DH-022 | Create GET /api/v1/keys endpoint with pagination and filtering | Pending | Backend | Sonnet | DH-018, DH-020 | 3      |
| DH-023 | Create GET /api/v1/keys/:id endpoint for single key retrieval  | Pending | Backend | Sonnet | DH-018, DH-020 | 2      |
| DH-024 | Create PUT /api/v1/keys/:id endpoint for key updates           | Pending | Backend | Sonnet | DH-018, DH-020 | 2      |
| DH-025 | Create DELETE /api/v1/keys/:id endpoint for key revocation     | Pending | Backend | Sonnet | DH-018, DH-020 | 2      |
| DH-026 | Implement POST /api/v1/keys/:id/rotate for key rotation        | Pending | Backend | Opus   | DH-018, DH-020 | 5      |
| DH-027 | Implement sliding window rate limiter service using Redis      | Pending | Backend | Opus   | DH-005         | 8      |
| DH-028 | Create rate limiting middleware with multi-tier support        | Pending | Backend | Opus   | DH-027         | 5      |
| DH-029 | Implement rate limit headers in responses                      | Pending | Backend | Sonnet | DH-028         | 2      |
| DH-030 | Create GET /api/v1/rate-limits/status endpoint                 | Pending | Backend | Sonnet | DH-027, DH-020 | 2      |
| DH-031 | Implement request ID middleware for tracing                    | Pending | Backend | Sonnet | DH-003         | 2      |
| DH-032 | Create standardized error handling middleware                  | Pending | Backend | Sonnet | DH-003         | 3      |
| DH-033 | Implement Zod validation schemas for all endpoints             | Pending | Backend | Sonnet | DH-021         | 3      |
| DH-034 | Write unit tests for API key service                           | Pending | QA      | Sonnet | DH-018         | 3      |
| DH-035 | Write unit tests for rate limiter service                      | Pending | QA      | Sonnet | DH-027         | 3      |
| DH-036 | Write integration tests for authentication flow                | Pending | QA      | Sonnet | DH-019, DH-020 | 3      |
| DH-037 | Write integration tests for API key endpoints                  | Pending | QA      | Sonnet | DH-021, DH-026 | 3      |

## Execution Order

Based on dependencies, execute in this order:

### Phase 1: Utilities & Services (DH-016, DH-017, DH-031, DH-032)
1. **DH-031** - Request ID middleware for tracing (no Sprint 1 deps)
2. **DH-032** - Standardized error handling middleware (no Sprint 1 deps)
3. **DH-016** - API key generation utility (depends on DH-007 from Sprint 0)
4. **DH-017** - API key hashing service (depends on DH-016)

### Phase 2: Data Access Layer (DH-018)
5. **DH-018** - API key repository with CRUD operations (depends on DH-017)

### Phase 3: Authentication & Authorization (DH-019, DH-020)
6. **DH-019** - Authentication middleware (depends on DH-018) **[OPUS]**
7. **DH-020** - Scope-based authorization middleware (depends on DH-019) **[OPUS]**

### Phase 4: Rate Limiting (DH-027, DH-028, DH-029)
8. **DH-027** - Sliding window rate limiter service (depends on DH-005) **[OPUS]**
9. **DH-028** - Rate limiting middleware (depends on DH-027) **[OPUS]**
10. **DH-029** - Rate limit headers (depends on DH-028)

### Phase 5: API Endpoints (DH-021 through DH-026, DH-030, DH-033)
11. **DH-021** - POST /api/v1/keys (create key)
12. **DH-022** - GET /api/v1/keys (list keys)
13. **DH-023** - GET /api/v1/keys/:id (get key)
14. **DH-024** - PUT /api/v1/keys/:id (update key)
15. **DH-025** - DELETE /api/v1/keys/:id (revoke key)
16. **DH-026** - POST /api/v1/keys/:id/rotate (rotate key) **[OPUS]**
17. **DH-030** - GET /api/v1/rate-limits/status
18. **DH-033** - Zod validation schemas for all endpoints

### Phase 6: Testing (DH-034 through DH-037)
19. **DH-034** - Unit tests for API key service
20. **DH-035** - Unit tests for rate limiter service
21. **DH-036** - Integration tests for authentication flow
22. **DH-037** - Integration tests for API key endpoints

## Definition of Done

### Per-Ticket DoD
Each ticket is DONE when:
- [ ] Implementation complete per spec
- [ ] Unit tests written and passing
- [ ] Integration tests (if API endpoint)
- [ ] Code follows coding-standards.md
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Input validation with Zod
- [ ] Error handling implemented
- [ ] Committed with message: "Complete DH-XXX: [description]"
- [ ] Backlog status updated to Done

### Sprint 1 DoD
Sprint is COMPLETE when:
- [ ] All 22 tickets show Done status
- [ ] All tests pass: `npm test` exits 0
- [ ] Lint passes: `npm run lint` exits 0
- [ ] Type check passes: `npm run typecheck` exits 0
- [ ] Build succeeds: `npm run build` exits 0
- [ ] Test coverage > 80% for new code
- [ ] All API endpoints functional with curl tests
- [ ] Authentication working correctly
- [ ] Rate limiting enforced
- [ ] QA review complete (see qa_sprint_1.md)
- [ ] Sprint summary created (see summary_sprint_1.md)
- [ ] All changes committed and pushed

## Model Selection Guide (FinOps)
Based on ticket complexity:

| Ticket | Recommended Model | Rationale |
|--------|-------------------|-----------|
| DH-016 | Sonnet | Crypto random generation, straightforward |
| DH-017 | Sonnet | SHA-256 hashing, standard crypto |
| DH-018 | Sonnet | CRUD operations with proper error handling |
| DH-019 | **Opus** | Multi-step auth flow, caching, edge cases |
| DH-020 | **Opus** | Scope inheritance, wildcard matching, complex logic |
| DH-021 | Sonnet | Standard POST endpoint |
| DH-022 | Sonnet | Pagination and filtering logic |
| DH-023 | Sonnet | Simple GET by ID |
| DH-024 | Sonnet | Standard PUT endpoint |
| DH-025 | Sonnet | Soft delete logic |
| DH-026 | **Opus** | Transaction handling, key deprecation, complex flow |
| DH-027 | **Opus** | Redis sliding window algorithm, performance critical |
| DH-028 | **Opus** | Multi-tier rate limiting, header generation |
| DH-029 | Sonnet | Header formatting, straightforward |
| DH-030 | Sonnet | Simple status endpoint |
| DH-031 | Sonnet | Request ID generation |
| DH-032 | Sonnet | Error formatting with codes |
| DH-033 | Sonnet | Zod schema definitions |
| DH-034 | Sonnet | Unit test writing |
| DH-035 | Sonnet | Unit test writing |
| DH-036 | Sonnet | Integration test writing |
| DH-037 | Sonnet | Integration test writing |

**Model Distribution:**
- Haiku: 0/22 = 0%
- Sonnet: 16/22 = 73%
- Opus: 6/22 = 27%

**Note:** This sprint has higher Opus usage due to security-critical auth and performance-critical rate limiting components.

## Risk Assessment
- **Blockers:**
  - Sprint 0 incomplete (all Sprint 1 depends on foundation)
  - Redis connectivity issues affect rate limiting
  - PostgreSQL performance with partitioned tables
- **Complexity:**
  - High: DH-019 (auth), DH-020 (authz), DH-027 (rate limiter), DH-026 (key rotation)
  - Medium: DH-018 (repository), DH-028 (rate limit middleware)
  - Low: All other tickets
- **Integration Points:**
  - Auth middleware must integrate with all protected endpoints
  - Rate limiter must check Redis on every request
  - Key rotation must handle in-flight requests gracefully

## API Endpoints Summary

After Sprint 1, these endpoints will be available:

| Method | Endpoint                | Auth Required | Scope     | Rate Limited |
|--------|-------------------------|---------------|-----------|--------------|
| GET    | /health                 | No            | -         | No           |
| GET    | /health/ready           | No            | -         | No           |
| GET    | /health/live            | No            | -         | No           |
| POST   | /api/v1/keys            | Yes           | write:keys | Yes          |
| GET    | /api/v1/keys            | Yes           | read:keys  | Yes          |
| GET    | /api/v1/keys/:id        | Yes           | read:keys  | Yes          |
| PUT    | /api/v1/keys/:id        | Yes           | write:keys | Yes          |
| DELETE | /api/v1/keys/:id        | Yes           | write:keys | Yes          |
| POST   | /api/v1/keys/:id/rotate | Yes           | write:keys | Yes          |
| GET    | /api/v1/rate-limits/status | Yes        | (any)     | Yes          |

## Rate Limit Tiers

| Tier       | Requests/Minute | Requests/Hour | Requests/Day |
|------------|-----------------|---------------|--------------|
| free       | 60              | 1,000         | 10,000       |
| standard   | 300             | 10,000        | 100,000      |
| premium    | 1,000           | 50,000        | 500,000      |
| enterprise | 5,000           | 200,000       | 2,000,000    |

## Scopes

| Scope        | Description |
|--------------|-------------|
| read:keys    | Read API key information |
| write:keys   | Create, update, delete API keys |
| read:requests | Read request logs |
| write:webhooks | Manage webhooks |
| read:webhooks | Read webhook information |
| admin        | Full administrative access |

## Next Steps
1. Verify Sprint 0 is complete
2. Run `dev_sprint_1.md` prompt to execute development
3. After development, run `qa_sprint_1.md` for QA testing
4. Finally, run `summary_sprint_1.md` to generate sprint documentation
