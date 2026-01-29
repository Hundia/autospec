# Sprint 0 QA Review: Foundation & Infrastructure

## Environment: claude-code

## Context - Read These Files First

**MANDATORY:** Read ALL these files to understand what should be tested:

- specs/02_backend_lead.md - API design, service layer, error handling
- specs/04_db_architect.md - database schema, migrations
- specs/05_qa_lead.md - test strategy, coverage targets
- specs/06_devops_lead.md - infrastructure, Docker
- specs/backlog.md - Sprint 0 tickets
- docs/testing/strategy.md - test pyramid, tooling
- docs/environments/environment-variables.md - required env vars

---

## QA Mission

Review and test ALL tickets completed in Sprint 0.

**Sprint Goal:** Establish project foundation, database schema, and development environment.
**Tickets to Review:** 15

---

## Pre-QA Setup

Before running tests, ensure the environment is ready:

```bash
# 1. Navigate to project directory
cd /path/to/datahub-api-gateway

# 2. Install dependencies
npm install

# 3. Start Docker containers (PostgreSQL and Redis)
docker-compose up -d postgres redis

# 4. Wait for services to be healthy
sleep 10

# 5. Verify Docker services are running
docker-compose ps
# Expected: postgres and redis should show "healthy" status

# 6. Run database migrations
npm run db:migrate

# 7. Start the API server (in background)
npm run dev &
API_PID=$!

# 8. Wait for server to be ready
sleep 5

# 9. Verify server is running
curl -s http://localhost:3000/health | jq
# Expected: {"status":"ok","timestamp":"...","version":"..."}
```

---

## Automated Test Suite

Run the full automated test suite:

```bash
# Unit tests
npm run test
# Expected: All tests pass

# Test with coverage
npm run test:coverage
# Expected: Coverage report shows > 70% overall

# Lint check
npm run lint
# Expected: No errors or warnings

# TypeScript check
npm run typecheck
# Expected: No type errors

# Build check
npm run build
# Expected: Build succeeds, dist/ folder created
```

---

## API Testing with Curl (MANDATORY)

**IMPORTANT:** These tests MUST be run with the server running.
Do not skip this section - it validates real API behavior.

### Test: Health Check Endpoint (Basic)

**Endpoint:** GET /health
**Spec Reference:** specs/02_backend_lead.md, Section: Health Endpoints
**Ticket:** DH-012

#### Happy Path Test
```bash
# Basic health check
curl -s -X GET http://localhost:3000/health \
  -H "Content-Type: application/json" | jq

# Expected Response (HTTP 200):
# {
#   "status": "ok",
#   "timestamp": "2024-01-15T10:30:00.000Z",
#   "version": "1.0.0"
# }
```

#### Verify Response Headers
```bash
# Check response headers
curl -s -I http://localhost:3000/health

# Expected:
# HTTP/1.1 200 OK
# Content-Type: application/json; charset=utf-8
# X-Request-ID: <uuid>
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
```

---

### Test: Readiness Check Endpoint

**Endpoint:** GET /health/ready
**Spec Reference:** specs/02_backend_lead.md, Section: Health Endpoints
**Ticket:** DH-012

#### Happy Path Test (All Dependencies Up)
```bash
# Readiness check - should verify DB and Redis
curl -s -X GET http://localhost:3000/health/ready \
  -H "Content-Type: application/json" | jq

# Expected Response (HTTP 200):
# {
#   "status": "ok",
#   "checks": {
#     "database": {
#       "status": "ok",
#       "latency_ms": 5
#     },
#     "redis": {
#       "status": "ok",
#       "latency_ms": 2
#     }
#   }
# }
```

#### Failure Test (Database Down)
```bash
# Stop PostgreSQL
docker-compose stop postgres

# Wait a moment
sleep 2

# Readiness check should fail
curl -s -X GET http://localhost:3000/health/ready \
  -H "Content-Type: application/json" | jq

# Expected Response (HTTP 503):
# {
#   "status": "error",
#   "checks": {
#     "database": {
#       "status": "error",
#       "error": "Connection refused"
#     },
#     "redis": {
#       "status": "ok",
#       "latency_ms": 2
#     }
#   }
# }

# Restart PostgreSQL
docker-compose start postgres
sleep 5
```

#### Failure Test (Redis Down)
```bash
# Stop Redis
docker-compose stop redis

# Wait a moment
sleep 2

# Readiness check should fail
curl -s -X GET http://localhost:3000/health/ready \
  -H "Content-Type: application/json" | jq

# Expected Response (HTTP 503):
# {
#   "status": "error",
#   "checks": {
#     "database": {
#       "status": "ok",
#       "latency_ms": 5
#     },
#     "redis": {
#       "status": "error",
#       "error": "Connection refused"
#     }
#   }
# }

# Restart Redis
docker-compose start redis
sleep 5
```

---

### Test: Liveness Check Endpoint

**Endpoint:** GET /health/live
**Spec Reference:** specs/02_backend_lead.md, Section: Health Endpoints
**Ticket:** DH-012

#### Happy Path Test
```bash
# Liveness check - should always return ok if server is running
curl -s -X GET http://localhost:3000/health/live \
  -H "Content-Type: application/json" | jq

# Expected Response (HTTP 200):
# {
#   "status": "ok"
# }
```

#### Liveness Should Succeed Even If Dependencies Down
```bash
# Stop both dependencies
docker-compose stop postgres redis

# Liveness should still return ok
curl -s -X GET http://localhost:3000/health/live \
  -H "Content-Type: application/json" | jq

# Expected Response (HTTP 200):
# {
#   "status": "ok"
# }

# Restart dependencies
docker-compose start postgres redis
sleep 5
```

---

### Test: 404 Handler

**Endpoint:** GET /nonexistent
**Ticket:** DH-003

```bash
# Request to non-existent endpoint
curl -s -X GET http://localhost:3000/api/v1/nonexistent \
  -H "Content-Type: application/json" | jq

# Expected Response (HTTP 404):
# {
#   "error": "Not Found",
#   "message": "The requested resource was not found",
#   "path": "/api/v1/nonexistent"
# }
```

---

### Test: Request ID Middleware

**Ticket:** DH-003

```bash
# Verify request ID is returned in response headers
curl -s -I http://localhost:3000/health

# Expected: X-Request-ID header present with UUID format
# X-Request-ID: 550e8400-e29b-41d4-a716-446655440000

# Verify request ID is passed through if provided
curl -s -I http://localhost:3000/health \
  -H "X-Request-ID: my-custom-request-id-123"

# Expected: Same request ID returned
# X-Request-ID: my-custom-request-id-123
```

---

### Test: Security Headers (Helmet)

**Ticket:** DH-003

```bash
# Check security headers are present
curl -s -I http://localhost:3000/health | grep -E "(X-Content-Type|X-Frame|X-XSS|Strict-Transport)"

# Expected Headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 0
# Strict-Transport-Security: max-age=15552000; includeSubDomains
```

---

### Test: CORS Headers

**Ticket:** DH-003

```bash
# Check CORS preflight response
curl -s -X OPTIONS http://localhost:3000/health \
  -H "Origin: http://example.com" \
  -H "Access-Control-Request-Method: GET" \
  -I | grep -i "access-control"

# Expected:
# Access-Control-Allow-Origin: *
# Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
```

---

### Test: JSON Body Parsing

**Ticket:** DH-003

```bash
# Test JSON body parsing works
curl -s -X POST http://localhost:3000/api/v1/test \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}' | jq

# Expected: 404 (endpoint doesn't exist yet) but not a parsing error

# Test body size limit (should reject > 10MB)
# Generate 11MB file
dd if=/dev/zero bs=1M count=11 2>/dev/null | base64 > /tmp/large_payload.txt
curl -s -X POST http://localhost:3000/api/v1/test \
  -H "Content-Type: application/json" \
  -d "{\"data\": \"$(cat /tmp/large_payload.txt)\"}" | jq

# Expected Response (HTTP 413):
# {
#   "error": "Payload Too Large",
#   "message": "Request entity too large"
# }

# Cleanup
rm /tmp/large_payload.txt
```

---

## Database Migration Verification

**Tickets:** DH-006, DH-007, DH-008, DH-009, DH-010, DH-011

### Check Migration Status
```bash
npm run db:status

# Expected output showing all migrations applied:
# Applied migrations:
# - 20240101000001_create_api_keys.sql
# - 20240101000002_create_request_logs.sql
# - 20240101000003_create_webhooks.sql
# - 20240101000004_create_webhook_deliveries.sql
# - 20240101000005_create_rate_limits_audit_logs.sql
```

### Verify Tables Exist
```bash
# Connect to PostgreSQL and list tables
docker-compose exec postgres psql -U datahub -d datahub -c "\dt"

# Expected tables:
#              List of relations
#  Schema |        Name         | Type  |  Owner
# --------+---------------------+-------+---------
#  public | api_keys            | table | datahub
#  public | audit_logs          | table | datahub
#  public | migrations          | table | datahub
#  public | rate_limits         | table | datahub
#  public | request_logs        | table | datahub (partitioned)
#  public | webhook_deliveries  | table | datahub (partitioned)
#  public | webhook_events      | table | datahub
#  public | webhooks            | table | datahub
```

### Verify Table Schemas

#### api_keys Table (DH-007)
```bash
docker-compose exec postgres psql -U datahub -d datahub -c "\d api_keys"

# Expected columns:
# - id (uuid, primary key)
# - name (varchar(255), not null)
# - key_hash (varchar(64), unique, not null)
# - key_prefix (varchar(12), not null)
# - scopes (text[], default '{}')
# - rate_limit_tier (varchar(50))
# - is_active (boolean, default true)
# - expires_at (timestamp with time zone)
# - last_used_at (timestamp with time zone)
# - created_at (timestamp with time zone)
# - updated_at (timestamp with time zone)
# - created_by (varchar(255))
# - metadata (jsonb)
```

#### request_logs Table (DH-008) - Partitioned
```bash
docker-compose exec postgres psql -U datahub -d datahub -c "\d+ request_logs"

# Expected: Partitioned table by RANGE (created_at)
# With at least one partition created
```

#### webhooks Table (DH-009)
```bash
docker-compose exec postgres psql -U datahub -d datahub -c "\d webhooks"

# Expected columns:
# - id (uuid, primary key)
# - api_key_id (uuid, foreign key)
# - url (varchar(2048), not null)
# - secret (varchar(64), not null)
# - events (text[], not null)
# - is_active (boolean)
# - description (varchar(500))
# - created_at, updated_at (timestamps)
```

#### webhook_deliveries Table (DH-010) - Partitioned
```bash
docker-compose exec postgres psql -U datahub -d datahub -c "\d+ webhook_deliveries"

# Expected: Partitioned table by RANGE (created_at)
```

#### rate_limits and audit_logs Tables (DH-011)
```bash
docker-compose exec postgres psql -U datahub -d datahub -c "\d rate_limits"
docker-compose exec postgres psql -U datahub -d datahub -c "\d audit_logs"

# Verify both tables have correct columns and constraints
```

### Verify Indexes
```bash
docker-compose exec postgres psql -U datahub -d datahub -c "\di"

# Expected indexes:
# - idx_api_keys_key_prefix
# - idx_api_keys_is_active
# - idx_api_keys_expires_at
# - idx_webhooks_api_key_id
# - idx_webhooks_is_active
# - idx_webhook_deliveries_webhook_id
# - idx_webhook_deliveries_status
# - idx_audit_logs_api_key_id
# - idx_audit_logs_resource
# - idx_audit_logs_created_at
```

---

## Docker Verification

**Tickets:** DH-013, DH-014

### Build Docker Image
```bash
# Build production image
docker build -t datahub-api-gateway:test .

# Expected: Build succeeds without errors

# Verify image size (should be small due to multi-stage build)
docker images datahub-api-gateway:test

# Expected: Image size < 200MB
```

### Run Production Container
```bash
# Run container
docker run -d --name test-api \
  -p 3001:3000 \
  -e DATABASE_URL=postgresql://datahub:datahub@host.docker.internal:5432/datahub \
  -e REDIS_URL=redis://host.docker.internal:6379 \
  datahub-api-gateway:test

# Wait for startup
sleep 5

# Test health endpoint
curl -s http://localhost:3001/health | jq

# Expected: {"status":"ok",...}

# Verify non-root user
docker exec test-api whoami
# Expected: nodejs (not root)

# Cleanup
docker stop test-api && docker rm test-api
```

### Docker Compose Full Stack
```bash
# Start all services
docker-compose up -d

# Wait for all services to be healthy
sleep 15

# Check service status
docker-compose ps

# Expected: All services running and healthy

# Test API through compose
curl -s http://localhost:3000/health/ready | jq

# Expected: All checks pass

# View logs
docker-compose logs api --tail=20

# Cleanup
docker-compose down
```

---

## Code Quality Verification

**Ticket:** DH-002

### ESLint
```bash
npm run lint

# Expected: No errors or warnings
# 0 problems (0 errors, 0 warnings)
```

### Prettier
```bash
npm run format:check

# Expected: All files formatted correctly
```

### TypeScript Strict Mode
```bash
npm run typecheck

# Expected: No type errors
```

### Pre-commit Hook
```bash
# Stage a file with lint error and try to commit
echo "const x = 1" > test-file.ts
git add test-file.ts
git commit -m "test"

# Expected: Commit blocked by husky/lint-staged

# Cleanup
git checkout -- .
rm -f test-file.ts
```

---

## Per-Ticket QA Review

### Ticket DH-001: Initialize Node.js project with TypeScript
#### Code Quality Checklist
- [ ] package.json has correct name and version
- [ ] tsconfig.json has strict mode enabled
- [ ] Path aliases (@/) configured and working
- [ ] Build output goes to dist/
- [ ] ES2022 target and NodeNext module

#### Verification
```bash
npm run build
ls -la dist/
node dist/index.js
```

**QA Result:** [PASS/FAIL]

---

### Ticket DH-002: Configure ESLint, Prettier, Husky
#### Code Quality Checklist
- [ ] ESLint config with TypeScript rules
- [ ] Prettier config with consistent formatting
- [ ] Husky pre-commit hook installed
- [ ] lint-staged configured

#### Verification
```bash
npm run lint
npm run format:check
```

**QA Result:** [PASS/FAIL]

---

### Ticket DH-003: Express.js application structure
#### Code Quality Checklist
- [ ] Middleware applied in correct order
- [ ] Error handler catches all errors
- [ ] 404 handler returns JSON
- [ ] Request ID middleware works
- [ ] Security headers (Helmet) applied
- [ ] CORS configured
- [ ] Body size limit enforced

**QA Result:** [PASS/FAIL]

---

### Ticket DH-004: PostgreSQL connection
#### Code Quality Checklist
- [ ] Connection pooling configured
- [ ] Health check function works
- [ ] Graceful shutdown implemented
- [ ] Error handling for connection failures

**QA Result:** [PASS/FAIL]

---

### Ticket DH-005: Redis connection
#### Code Quality Checklist
- [ ] Reconnection logic works
- [ ] Health check function works
- [ ] Graceful shutdown implemented
- [ ] Error handling for connection failures

**QA Result:** [PASS/FAIL]

---

### Ticket DH-006: Database migration system
#### Code Quality Checklist
- [ ] Migrations run in order
- [ ] Migration status tracking works
- [ ] Transactions used for safety
- [ ] CLI commands available

**QA Result:** [PASS/FAIL]

---

### Tickets DH-007 through DH-011: Database migrations
#### Code Quality Checklist
- [ ] All tables created with correct schema
- [ ] Indexes created for common queries
- [ ] Foreign keys properly defined
- [ ] Partitioning works (DH-008, DH-010)
- [ ] Default values set correctly

**QA Result:** [PASS/FAIL]

---

### Ticket DH-012: Health check endpoints
#### Code Quality Checklist
- [ ] /health returns basic status
- [ ] /health/ready checks dependencies
- [ ] /health/live always returns ok
- [ ] 503 returned when dependencies down
- [ ] Latency measurements included

**QA Result:** [PASS/FAIL]

---

### Tickets DH-013, DH-014: Docker configuration
#### Code Quality Checklist
- [ ] Multi-stage build reduces image size
- [ ] Non-root user in production image
- [ ] Docker Compose starts all services
- [ ] Health checks configured
- [ ] Volumes persist data

**QA Result:** [PASS/FAIL]

---

### Ticket DH-015: Jest testing framework
#### Code Quality Checklist
- [ ] Jest configured with TypeScript
- [ ] Supertest available for API tests
- [ ] Test setup file created
- [ ] Coverage reporting works
- [ ] Example tests passing

**QA Result:** [PASS/FAIL]

---

## QA Summary

### Test Results
| Category | Passed | Failed | Coverage |
|----------|--------|--------|----------|
| Unit Tests | /15 | 0 | % |
| Integration Tests | /5 | 0 | % |
| API Curl Tests | /8 | 0 | N/A |
| Build Tests | /3 | 0 | N/A |

### Issues Found
| Ticket | Issue | Severity | Action |
|--------|-------|----------|--------|
| | | | |

### Overall Verdict
- [ ] **PASS** - All tests pass, ready for release
- [ ] **FAIL** - Issues found, needs fixes

---

## Post-QA Actions

### If PASS:
1. Update all ticket statuses from qa-review to done in specs/backlog.md
2. Run summary_sprint_0.md to generate sprint documentation
3. Merge to main branch

### If FAIL:
1. Document issues in Bug Backlog section of specs/backlog.md
2. Keep tickets in qa-review status
3. Fix issues and re-run QA

---

## Cleanup

```bash
# Stop the server
kill $API_PID 2>/dev/null || pkill -f "npm run dev" || true

# Stop Docker services
docker-compose down

# Remove test artifacts
rm -rf coverage/
rm -rf dist/
```
