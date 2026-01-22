# DataHub API Gateway - Product Backlog

## Overview

This backlog defines all development work for DataHub API Gateway, organized into sprints. The project follows an API-first approach with no frontend components.

**Sprint Duration**: 2 weeks
**Story Points Scale**: 1, 2, 3, 5, 8, 13
**Team Velocity Target**: 40-50 points per sprint

---

## Sprint 0: Foundation & Infrastructure

**Goal**: Establish project foundation, database schema, and development environment.
**Duration**: 2 weeks
**Total Points**: 45

### Tickets

| #      | Ticket                                                                      | Status    | Owner   | Model  | Depends        | Points |
| ------ | --------------------------------------------------------------------------- | --------- | ------- | ------ | -------------- | ------ |
| DH-001 | Initialize Node.js project with TypeScript configuration                    | done      | Backend | Sonnet | -              | 2      |
| DH-002 | Configure ESLint, Prettier, and Husky pre-commit hooks                      | qa-review | Backend | Sonnet | DH-001         | 2      |
| DH-003 | Set up Express.js application structure with middleware stack               | done      | Backend | Sonnet | DH-001         | 3      |
| DH-004 | Create PostgreSQL database connection with connection pooling               | done      | Backend | Sonnet | DH-003         | 3      |
| DH-005 | Create Redis connection service for caching and rate limiting               | done      | Backend | Sonnet | DH-003         | 3      |
| DH-006 | Implement database migration system with versioned SQL files                | done      | Backend | Sonnet | DH-004         | 3      |
| DH-007 | Create api_keys table migration with all fields and indexes                 | qa-review | Backend | Sonnet | DH-006         | 3      |
| DH-008 | Create request_logs table migration with partitioning support               | qa-review | Backend | Sonnet | DH-006         | 5      |
| DH-009 | Create webhooks and webhook_events table migrations                         | qa-review | Backend | Sonnet | DH-006         | 3      |
| DH-010 | Create webhook_deliveries table migration with partitioning                 | qa-review | Backend | Sonnet | DH-006         | 3      |
| DH-011 | Create rate_limits and audit_logs table migrations                          | qa-review | Backend | Sonnet | DH-006         | 3      |
| DH-012 | Implement health check endpoints (GET /health, /health/ready, /health/live) | done      | Backend | Sonnet | DH-004, DH-005 | 3      |
| DH-013 | Create Dockerfile for production with multi-stage build                     | qa-review | DevOps  | Sonnet | DH-003         | 3      |
| DH-014 | Create Docker Compose configuration for local development                   | qa-review | DevOps  | Sonnet | DH-013         | 3      |
| DH-015 | Set up Jest testing framework with Supertest for API tests                  | qa-review | QA      | Sonnet | DH-003         | 3      |

### Sprint 0 Acceptance Criteria

### QA Checks Required

- DH-002: Run linting and formatting checks ($npm run lint$, $npm run format$).
- DH-007..DH-011: Run database migrations and verify schema objects ($npm run db:migrate$).
- DH-013: Build production container image and confirm health check ($docker build -t datahub-api-gateway .$, then verify `/health`).
- DH-014: Bring up local stack and confirm service health checks ($docker-compose up$).
- DH-015: Run test suite and coverage report ($npm test$, $npm run test:coverage$).

- [ ] Project builds successfully with TypeScript
- [ ] All migrations run without errors
- [ ] Docker Compose starts all services
- [ ] Health endpoints return correct status
- [ ] Test framework configured and passing

### Sprint 0 QA Checks (Required)

- DH-001: Run `npm run build` and verify compiled output in dist/. Validate `npm run dev` starts without errors and `@/` path aliases resolve in runtime.
- DH-003: Start server and confirm CORS headers, Helmet security headers, and JSON body limit of 10mb are enforced.
- DH-004: With DATABASE_URL set, verify pool connection success and `SELECT 1` works; confirm pool limits with max=20.
- DH-005: With REDIS_URL set, verify Redis client can `PING` and reconnect after a forced disconnect.
- DH-006: Run `npm run db:migrate` and `npm run db:status` to ensure migration ordering and status reporting.
- DH-012: Validate `/health`, `/health/ready`, and `/health/live` return expected payloads and 503 on dependency failure.

---

## Sprint 1: Core API Features

**Goal**: Implement API key management, authentication, and rate limiting.
**Duration**: 2 weeks
**Total Points**: 52

### Tickets

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

### Sprint 1 Acceptance Criteria

- [ ] API keys can be created, listed, updated, and revoked
- [ ] Authentication rejects invalid/expired/revoked keys
- [ ] Rate limiting enforces limits per minute/hour/day
- [ ] Rate limit headers included in all responses
- [ ] All endpoint validation working correctly
- [ ] Test coverage > 80% for new code

---

## Sprint 2: Request Logging & Webhooks (Planned)

**Goal**: Implement request/response logging and webhook subscription system.
**Duration**: 2 weeks
**Estimated Points**: 48

### Tickets

| #      | Ticket                                                    | Status  | Owner   | Model  | Depends | Points |
| ------ | --------------------------------------------------------- | ------- | ------- | ------ | ------- | ------ |
| DH-038 | Implement request logging middleware                      | Planned | Backend | Sonnet | DH-008  | 5      |
| DH-039 | Create response capture middleware for logging            | Planned | Backend | Sonnet | DH-038  | 3      |
| DH-040 | Implement request log repository with partitioned queries | Planned | Backend | Sonnet | DH-008  | 5      |
| DH-041 | Create GET /api/v1/requests endpoint with filtering       | Planned | Backend | Sonnet | DH-040  | 3      |
| DH-042 | Create GET /api/v1/requests/:id endpoint                  | Planned | Backend | Sonnet | DH-040  | 2      |
| DH-043 | Create GET /api/v1/requests/stats endpoint                | Planned | Backend | Sonnet | DH-040  | 5      |
| DH-044 | Implement sensitive data redaction in logs                | Planned | Backend | Sonnet | DH-038  | 3      |
| DH-045 | Create webhook repository with CRUD operations            | Planned | Backend | Sonnet | DH-009  | 3      |
| DH-046 | Implement webhook signature generation using HMAC         | Planned | Backend | Sonnet | DH-045  | 3      |
| DH-047 | Create POST /api/v1/webhooks endpoint                     | Planned | Backend | Sonnet | DH-045  | 3      |
| DH-048 | Create GET /api/v1/webhooks endpoint with pagination      | Planned | Backend | Sonnet | DH-045  | 2      |
| DH-049 | Create GET /api/v1/webhooks/:id endpoint                  | Planned | Backend | Sonnet | DH-045  | 2      |
| DH-050 | Create PUT /api/v1/webhooks/:id endpoint                  | Planned | Backend | Sonnet | DH-045  | 2      |
| DH-051 | Create DELETE /api/v1/webhooks/:id endpoint               | Planned | Backend | Sonnet | DH-045  | 2      |
| DH-052 | Write integration tests for request logging               | Planned | QA      | Sonnet | DH-041  | 3      |
| DH-053 | Write integration tests for webhook CRUD                  | Planned | QA      | Sonnet | DH-047  | 3      |

---

## Sprint 3: Webhook Delivery System (Planned)

**Goal**: Implement webhook delivery queue, retry logic, and delivery tracking.
**Duration**: 2 weeks
**Estimated Points**: 45

### Tickets

| #      | Ticket                                                         | Status  | Owner   | Model  | Depends        | Points |
| ------ | -------------------------------------------------------------- | ------- | ------- | ------ | -------------- | ------ |
| DH-054 | Set up BullMQ for webhook delivery queue                       | Planned | Backend | Sonnet | DH-005         | 3      |
| DH-055 | Implement webhook delivery worker/processor                    | Planned | Backend | Opus   | DH-054, DH-046 | 8      |
| DH-056 | Implement exponential backoff retry logic                      | Planned | Backend | Sonnet | DH-055         | 3      |
| DH-057 | Create webhook delivery repository                             | Planned | Backend | Sonnet | DH-010         | 3      |
| DH-058 | Implement delivery status tracking and updates                 | Planned | Backend | Sonnet | DH-057         | 3      |
| DH-059 | Create POST /api/v1/webhooks/:id/test endpoint                 | Planned | Backend | Sonnet | DH-055         | 3      |
| DH-060 | Create GET /api/v1/webhooks/:id/deliveries endpoint            | Planned | Backend | Sonnet | DH-057         | 3      |
| DH-061 | Create POST /api/v1/webhooks/:id/deliveries/:id/retry endpoint | Planned | Backend | Sonnet | DH-055         | 3      |
| DH-062 | Implement webhook event triggering service                     | Planned | Backend | Opus   | DH-055         | 5      |
| DH-063 | Add webhook statistics to webhook model                        | Planned | Backend | Sonnet | DH-057         | 2      |
| DH-064 | Implement consecutive failure tracking and auto-disable        | Planned | Backend | Sonnet | DH-057         | 3      |
| DH-065 | Write unit tests for webhook delivery service                  | Planned | QA      | Sonnet | DH-055         | 3      |
| DH-066 | Write integration tests for webhook delivery                   | Planned | QA      | Sonnet | DH-059         | 3      |

---

## Sprint 4: Monitoring & Production Readiness (Planned)

**Goal**: Add monitoring, metrics, CI/CD pipeline, and production hardening.
**Duration**: 2 weeks
**Estimated Points**: 42

### Tickets

| #      | Ticket                                              | Status  | Owner   | Model  | Depends        | Points |
| ------ | --------------------------------------------------- | ------- | ------- | ------ | -------------- | ------ |
| DH-067 | Implement Prometheus metrics collection             | Planned | Backend | Sonnet | DH-003         | 5      |
| DH-068 | Add HTTP request metrics (count, latency, status)   | Planned | Backend | Sonnet | DH-067         | 3      |
| DH-069 | Add rate limit metrics                              | Planned | Backend | Sonnet | DH-067         | 2      |
| DH-070 | Add webhook delivery metrics                        | Planned | Backend | Sonnet | DH-067         | 2      |
| DH-071 | Add database connection pool metrics                | Planned | Backend | Sonnet | DH-067         | 2      |
| DH-072 | Create Grafana dashboard JSON                       | Planned | DevOps  | Sonnet | DH-067         | 3      |
| DH-073 | Create Prometheus alerting rules                    | Planned | DevOps  | Sonnet | DH-067         | 3      |
| DH-074 | Implement structured JSON logging with Pino         | Planned | Backend | Sonnet | DH-003         | 3      |
| DH-075 | Add request correlation ID to all logs              | Planned | Backend | Sonnet | DH-074, DH-031 | 2      |
| DH-076 | Create Kubernetes deployment manifests              | Planned | DevOps  | Sonnet | DH-013         | 5      |
| DH-077 | Create Kubernetes HPA and PDB configurations        | Planned | DevOps  | Sonnet | DH-076         | 3      |
| DH-078 | Set up GitHub Actions CI pipeline                   | Planned | DevOps  | Sonnet | DH-015         | 5      |
| DH-079 | Set up GitHub Actions CD pipeline with staging/prod | Planned | DevOps  | Opus   | DH-078         | 5      |
| DH-080 | Create database backup CronJob                      | Planned | DevOps  | Sonnet | DH-076         | 3      |
| DH-081 | Write k6 load tests for API endpoints               | Planned | QA      | Sonnet | DH-037         | 5      |
| DH-082 | Document API with OpenAPI/Swagger spec              | Planned | Backend | Sonnet | DH-037         | 5      |

---

## Sprint 5: Advanced Features (Planned)

**Goal**: Add audit logging, advanced rate limiting, and administrative features.
**Duration**: 2 weeks
**Estimated Points**: 38

### Tickets

| #      | Ticket                                              | Status  | Owner   | Model  | Depends | Points |
| ------ | --------------------------------------------------- | ------- | ------- | ------ | ------- | ------ |
| DH-083 | Implement audit logging service                     | Planned | Backend | Sonnet | DH-011  | 5      |
| DH-084 | Add audit logging for all key management operations | Planned | Backend | Sonnet | DH-083  | 3      |
| DH-085 | Add audit logging for webhook operations            | Planned | Backend | Sonnet | DH-083  | 2      |
| DH-086 | Create GET /api/v1/audit-logs endpoint              | Planned | Backend | Sonnet | DH-083  | 3      |
| DH-087 | Implement custom rate limits per endpoint           | Planned | Backend | Sonnet | DH-028  | 5      |
| DH-088 | Implement IP-based rate limiting                    | Planned | Backend | Sonnet | DH-028  | 3      |
| DH-089 | Create PUT /api/v1/rate-limits/keys/:keyId endpoint | Planned | Backend | Sonnet | DH-027  | 3      |
| DH-090 | Implement global rate limit configuration           | Planned | Backend | Sonnet | DH-027  | 3      |
| DH-091 | Add key expiration notification webhook events      | Planned | Backend | Sonnet | DH-062  | 3      |
| DH-092 | Implement automatic expired key cleanup job         | Planned | Backend | Sonnet | DH-018  | 3      |
| DH-093 | Implement request log retention/cleanup job         | Planned | Backend | Sonnet | DH-040  | 3      |
| DH-094 | Write integration tests for audit logging           | Planned | QA      | Sonnet | DH-086  | 3      |

---

## Backlog Summary

### By Sprint

| Sprint    | Focus              | Tickets | Points  |
| --------- | ------------------ | ------- | ------- |
| Sprint 0  | Foundation         | 15      | 45      |
| Sprint 1  | Core API           | 22      | 52      |
| Sprint 2  | Logging & Webhooks | 16      | 48      |
| Sprint 3  | Webhook Delivery   | 13      | 45      |
| Sprint 4  | Monitoring         | 16      | 42      |
| Sprint 5  | Advanced           | 12      | 38      |
| **Total** |                    | **94**  | **270** |

### By Owner

| Owner   | Tickets | Points |
| ------- | ------- | ------ |
| Backend | 70      | 210    |
| DevOps  | 12      | 36     |
| QA      | 12      | 24     |

### By Model Recommendation

| Model  | Tickets | Rationale                                   |
| ------ | ------- | ------------------------------------------- |
| Sonnet | 84      | Standard implementation tasks               |
| Opus   | 10      | Complex auth, rate limiting, delivery logic |

---

## Dependency Graph

### Sprint 0 Dependencies

```
DH-001 (Project Init)
  ├── DH-002 (Linting)
  ├── DH-003 (Express Setup)
  │     ├── DH-004 (PostgreSQL)
  │     │     └── DH-006 (Migrations)
  │     │           ├── DH-007 (api_keys)
  │     │           ├── DH-008 (request_logs)
  │     │           ├── DH-009 (webhooks)
  │     │           ├── DH-010 (webhook_deliveries)
  │     │           └── DH-011 (rate_limits/audit)
  │     ├── DH-005 (Redis)
  │     ├── DH-013 (Dockerfile)
  │     │     └── DH-014 (Docker Compose)
  │     └── DH-015 (Jest Setup)
  └── DH-012 (Health Checks) ← needs DH-004 + DH-005
```

### Sprint 1 Dependencies

```
DH-007 (api_keys table)
  └── DH-016 (Key Generator)
        └── DH-017 (Key Hasher)
              └── DH-018 (Key Repository)
                    └── DH-019 (Auth Middleware)
                          └── DH-020 (Scope Middleware)
                                ├── DH-021 (POST /keys)
                                ├── DH-022 (GET /keys)
                                ├── DH-023 (GET /keys/:id)
                                ├── DH-024 (PUT /keys/:id)
                                ├── DH-025 (DELETE /keys/:id)
                                ├── DH-026 (POST /keys/:id/rotate)
                                └── DH-030 (Rate Limit Status)

DH-005 (Redis)
  └── DH-027 (Rate Limiter Service)
        └── DH-028 (Rate Limit Middleware)
              └── DH-029 (Rate Limit Headers)

DH-003 (Express)
  ├── DH-031 (Request ID)
  └── DH-032 (Error Handler)
```

---

## Ticket Complexity Analysis

### High Complexity (Opus Recommended)

| Ticket | Complexity Factors                            |
| ------ | --------------------------------------------- |
| DH-019 | Multi-step auth flow, caching, error handling |
| DH-020 | Scope inheritance, wildcard matching, context |
| DH-026 | Transaction handling, deprecation logic       |
| DH-027 | Redis algorithm, sliding window math          |
| DH-028 | Multi-tier logic, header generation           |
| DH-055 | Async processing, retry logic, error handling |
| DH-062 | Event system, subscription matching           |
| DH-079 | Multi-environment deployment, secrets         |

### Medium Complexity (Sonnet)

| Ticket | Notes                           |
| ------ | ------------------------------- |
| DH-008 | Partitioning syntax knowledge   |
| DH-018 | Standard CRUD but comprehensive |
| DH-040 | Partitioned table queries       |
| DH-043 | Aggregation queries             |
| DH-076 | K8s manifest knowledge          |

---

## API Endpoint Summary

### Key Management (/api/v1/keys)

| Method | Endpoint                | Ticket | Scope Required |
| ------ | ----------------------- | ------ | -------------- |
| POST   | /api/v1/keys            | DH-021 | write:keys     |
| GET    | /api/v1/keys            | DH-022 | read:keys      |
| GET    | /api/v1/keys/:id        | DH-023 | read:keys      |
| PUT    | /api/v1/keys/:id        | DH-024 | write:keys     |
| DELETE | /api/v1/keys/:id        | DH-025 | write:keys     |
| POST   | /api/v1/keys/:id/rotate | DH-026 | write:keys     |

### Request Logging (/api/v1/requests)

| Method | Endpoint               | Ticket | Scope Required |
| ------ | ---------------------- | ------ | -------------- |
| GET    | /api/v1/requests       | DH-041 | read:requests  |
| GET    | /api/v1/requests/:id   | DH-042 | read:requests  |
| GET    | /api/v1/requests/stats | DH-043 | read:requests  |

### Webhooks (/api/v1/webhooks)

| Method | Endpoint                                  | Ticket | Scope Required |
| ------ | ----------------------------------------- | ------ | -------------- |
| POST   | /api/v1/webhooks                          | DH-047 | write:webhooks |
| GET    | /api/v1/webhooks                          | DH-048 | read:webhooks  |
| GET    | /api/v1/webhooks/:id                      | DH-049 | read:webhooks  |
| PUT    | /api/v1/webhooks/:id                      | DH-050 | write:webhooks |
| DELETE | /api/v1/webhooks/:id                      | DH-051 | write:webhooks |
| POST   | /api/v1/webhooks/:id/test                 | DH-059 | write:webhooks |
| GET    | /api/v1/webhooks/:id/deliveries           | DH-060 | read:webhooks  |
| POST   | /api/v1/webhooks/:id/deliveries/:id/retry | DH-061 | write:webhooks |

### Rate Limits (/api/v1/rate-limits)

| Method | Endpoint                        | Ticket | Scope Required |
| ------ | ------------------------------- | ------ | -------------- |
| GET    | /api/v1/rate-limits/status      | DH-030 | (any)          |
| PUT    | /api/v1/rate-limits/keys/:keyId | DH-089 | admin          |

### Audit Logs (/api/v1/audit-logs)

| Method | Endpoint           | Ticket | Scope Required |
| ------ | ------------------ | ------ | -------------- |
| GET    | /api/v1/audit-logs | DH-086 | admin          |

### Health (/health)

| Method | Endpoint      | Ticket | Auth |
| ------ | ------------- | ------ | ---- |
| GET    | /health       | DH-012 | None |
| GET    | /health/ready | DH-012 | None |
| GET    | /health/live  | DH-012 | None |

---

## Sprint Planning Notes

### Sprint 0 Parallelization

- DH-001 must complete first (foundation)
- After DH-001: DH-002, DH-003 can run in parallel
- After DH-003: DH-004, DH-005, DH-013, DH-015 can run in parallel
- DH-012 needs both DH-004 and DH-005

### Sprint 1 Parallelization

- DH-016/DH-017/DH-018 chain must be sequential
- DH-027/DH-028/DH-029 chain can run parallel to key chain
- DH-031, DH-032 have no deps on Sprint 1 tickets
- Tests (DH-034-037) can start as soon as their targets complete

### Critical Path

```
DH-001 → DH-003 → DH-004 → DH-006 → DH-007 → DH-016 → DH-017 →
DH-018 → DH-019 → DH-020 → DH-021 (first API endpoint)
```

---

## Priority Definitions

| Priority      | Definition                             |
| ------------- | -------------------------------------- |
| P0 - Critical | Blocks other work, required for MVP    |
| P1 - High     | Core functionality, needed this sprint |
| P2 - Medium   | Important but can slip to next sprint  |
| P3 - Low      | Nice to have, can be deferred          |

---

## Definition of Done

### Code

- [ ] Implementation complete and working
- [ ] TypeScript types properly defined
- [ ] Error handling implemented
- [ ] Input validation complete
- [ ] Code reviewed and approved

### Testing

- [ ] Unit tests written and passing
- [ ] Integration tests passing
- [ ] Test coverage meets minimum threshold

### Documentation

- [ ] API endpoints documented
- [ ] Code comments for complex logic
- [ ] README updated if needed

### Operations

- [ ] Logging implemented
- [ ] Metrics exposed
- [ ] Health checks working

---

## Risk Register

| Risk                          | Impact | Likelihood | Mitigation                                    |
| ----------------------------- | ------ | ---------- | --------------------------------------------- |
| Rate limiter performance      | High   | Medium     | Load test early, use efficient Redis patterns |
| Webhook delivery delays       | Medium | Medium     | Queue with proper concurrency, monitoring     |
| Database partition management | Medium | Low        | Automate partition creation, monitor          |
| Key rotation downtime         | High   | Low        | Implement deprecation period, test thoroughly |

---

## Technical Debt Tracking

| Item             | Severity | Sprint to Address |
| ---------------- | -------- | ----------------- |
| (None currently) | -        | -                 |

---

## Future Considerations (Post-MVP)

- Multi-tenant support
- GraphQL API option
- Custom plugin system
- Geographic rate limiting
- API versioning strategy
- SDK generation from OpenAPI
- Admin UI (separate project)

---

_This backlog is maintained by the Product Manager and reviewed weekly with the development team._
