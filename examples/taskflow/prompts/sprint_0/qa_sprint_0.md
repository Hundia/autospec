# Sprint 0 QA Review: Foundation & Setup

## Environment: claude-code

---

## Context - Read These Files First

**MANDATORY:** Read ALL these files to understand what should be tested:

- `specs/05_qa_lead.md` - Testing strategy, coverage targets
- `specs/backlog.md` - Sprint 0 tickets to verify
- `docs/architecture/overview.md` - System architecture
- `docs/architecture/backend.md` - Backend patterns
- `docs/architecture/frontend.md` - Frontend patterns
- `docs/api/reference.md` - API endpoints

---

## QA Mission

Review and test ALL tickets completed in Sprint 0.

| Property | Value |
|----------|-------|
| Sprint | 0 - Foundation & Setup |
| Goal | Verify project infrastructure is correctly configured |
| Tickets to Review | 18 |

---

## Pre-QA Setup

Before running tests, ensure the environment is ready:

```bash
# 1. Navigate to project root
cd /path/to/taskflow

# 2. Copy environment file
cp .env.example .env
# Edit .env if needed

# 3. Start the database
docker-compose up -d

# 4. Wait for PostgreSQL to be ready
sleep 5
docker-compose ps
# Should show "healthy" status

# 5. Install dependencies
cd api && npm install
cd ../web && npm install
cd ..

# 6. Start the backend (in background or separate terminal)
cd api && npm run dev &
# Wait for server to be ready
sleep 3

# 7. Verify backend is running
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"..."}

# 8. Start the frontend (in background or separate terminal)
cd web && npm run dev &
# Wait for Vite to start
sleep 3

# 9. Verify frontend is running
curl -I http://localhost:5173
# Expected: HTTP/1.1 200 OK
```

---

## Automated Test Suite

Run the full automated test suite:

```bash
# Backend tests
cd api
npm test
# Expected: All tests pass

# Frontend tests
cd ../web
npm test
# Expected: All tests pass

# Full test with coverage (if configured)
cd ../api
npm run test:coverage
# Expected: Coverage report generated
```

---

## API Testing with Curl (MANDATORY)

**IMPORTANT:** These tests MUST be run with the server running.

### Test: Health Check Endpoint

**Endpoint:** GET /health
**Spec Reference:** `specs/02_backend_lead.md`

#### Happy Path Test
```bash
# Test health endpoint
curl -X GET http://localhost:3000/health \
  -H "Content-Type: application/json"

# Expected Response (HTTP 200):
# {
#   "status": "ok",
#   "timestamp": "2026-01-29T10:00:00.000Z"
# }

# Verify response format
curl -s http://localhost:3000/health | jq '.status'
# Expected: "ok"
```

#### Response Time Test
```bash
# Test response time (should be < 100ms)
time curl -s http://localhost:3000/health > /dev/null
# Expected: real < 0.100s
```

### Test: 404 Handler

```bash
# Test non-existent route
curl -X GET http://localhost:3000/api/v1/nonexistent \
  -H "Content-Type: application/json"

# Expected Response (HTTP 404):
# Should return appropriate error response
```

### Test: CORS Headers

```bash
# Test CORS preflight
curl -X OPTIONS http://localhost:3000/health \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v 2>&1 | grep -i "access-control"

# Expected: Access-Control-Allow-Origin header present
```

---

## Database Connection Test

```bash
# Test database connection via health check or direct query
docker-compose exec db psql -U postgres -d taskflow -c "SELECT 1"

# Expected: Returns "1"

# Verify database exists
docker-compose exec db psql -U postgres -c "\l" | grep taskflow

# Expected: taskflow database listed
```

---

## Frontend Verification

### Build Test
```bash
cd web

# Verify TypeScript compilation
npm run typecheck
# Expected: No errors

# Verify production build
npm run build
# Expected: Build completes successfully, outputs to dist/

# Check bundle size
ls -la dist/assets/
# Expected: JS bundle < 200KB gzipped
```

### Component Render Test
```bash
# Run component tests
npm test

# Expected output:
# PASS  src/components/layout/Layout.test.tsx
#   Layout component
#     ✓ renders without crashing
#     ✓ displays children content
```

### Visual Verification Checklist
- [ ] Page renders at http://localhost:5173
- [ ] No console errors in browser DevTools
- [ ] Welcome message or placeholder displayed
- [ ] Page is responsive (resize browser)

---

## Per-Ticket QA Review

### Ticket 0.1: Git Repository
#### Checklist
- [ ] `.gitignore` exists and contains node_modules, .env, dist
- [ ] `README.md` exists with setup instructions
- [ ] Git repository initialized (`.git` folder exists)

#### Verification
```bash
cat .gitignore | grep node_modules
cat README.md | head -20
ls -la .git
```

---

### Ticket 0.2: Docker Compose
#### Checklist
- [ ] `docker-compose.yml` exists
- [ ] PostgreSQL service defined
- [ ] Volume for persistence defined
- [ ] Health check configured

#### Verification
```bash
docker-compose config
docker-compose ps
docker-compose logs db | tail -10
```

---

### Ticket 0.3: Environment Variables
#### Checklist
- [ ] `.env.example` exists
- [ ] All required variables documented
- [ ] No actual secrets in example file

#### Verification
```bash
cat .env.example
grep -c "=" .env.example
# Expected: At least 8 variables
```

---

### Ticket 0.4-0.5: Backend Project Structure
#### Checklist
- [ ] `api/package.json` exists with correct scripts
- [ ] `api/tsconfig.json` has strict mode enabled
- [ ] Directory structure matches spec

#### Verification
```bash
cat api/package.json | jq '.scripts'
cat api/tsconfig.json | jq '.compilerOptions.strict'
ls -la api/src/
```

---

### Ticket 0.6: Drizzle ORM Setup
#### Checklist
- [ ] `drizzle.config.ts` exists
- [ ] `src/db/schema.ts` exists
- [ ] `src/config/database.ts` has connection pool

#### Verification
```bash
ls api/src/db/
ls api/drizzle.config.ts
```

---

### Ticket 0.7: Error Handling Middleware
#### Checklist
- [ ] `src/middleware/error.middleware.ts` exists
- [ ] Error handler exports correctly
- [ ] AppError class defined

#### Verification
```bash
cat api/src/middleware/error.middleware.ts
```

---

### Ticket 0.8: Health Endpoint
#### Checklist
- [ ] GET /health returns 200
- [ ] Response includes status and timestamp
- [ ] Response time < 100ms

#### Verification
```bash
curl -w "\nTime: %{time_total}s\n" http://localhost:3000/health
```

---

### Ticket 0.9-0.13: Frontend Setup
#### Checklist
- [ ] `web/package.json` has correct dependencies
- [ ] Vite config exists
- [ ] Tailwind configured with design tokens
- [ ] API client created
- [ ] Layout component exists

#### Verification
```bash
cat web/package.json | jq '.dependencies'
cat web/tailwind.config.js
ls web/src/components/layout/
ls web/src/services/
```

---

### Ticket 0.14: Linting Configuration
#### Checklist
- [ ] ESLint configured for both projects
- [ ] Prettier configured
- [ ] Lint passes without errors

#### Verification
```bash
cd api && npm run lint
cd ../web && npm run lint
```

---

### Ticket 0.15-0.17: Testing Setup
#### Checklist
- [ ] Vitest configured for backend
- [ ] Vitest configured for frontend
- [ ] At least one test file exists
- [ ] Tests pass

#### Verification
```bash
cd api && npm test
cd ../web && npm test
```

---

### Ticket 0.18: Full Stack Validation
#### Checklist
- [ ] Database starts and accepts connections
- [ ] Backend starts without errors
- [ ] Frontend builds and runs
- [ ] Frontend can reach backend (CORS working)

#### Verification
```bash
# Full stack smoke test
docker-compose up -d
cd api && npm run dev &
cd ../web && npm run dev &
sleep 5
curl http://localhost:3000/health
curl -I http://localhost:5173
```

---

## QA Summary

### Test Results

| Category | Passed | Failed | Coverage |
|----------|--------|--------|----------|
| Unit Tests | -/- | 0 | -% |
| Integration Tests | -/- | 0 | N/A |
| API Curl Tests | -/- | 0 | N/A |
| Build Tests | -/- | 0 | N/A |

### Issues Found

| Ticket | Issue | Severity | Action |
|--------|-------|----------|--------|
| - | No issues expected for new setup | - | - |

### Overall Verdict

- [ ] **PASS** - All tests pass, ready for Sprint 1
- [ ] **FAIL** - Issues found, needs fixes

---

## Post-QA Actions

### If PASS:
1. Update all ticket statuses to Done in `specs/backlog.md`
2. Run `prompts/sprint_0/summary_sprint_0.md` to generate sprint documentation
3. Proceed to Sprint 1

### If FAIL:
1. Document issues in Bug Backlog section of `specs/backlog.md`
2. Fix issues
3. Re-run QA

---

## Cleanup

```bash
# Stop the backend and frontend processes
pkill -f "npm run dev" || true

# Stop Docker services (optional)
docker-compose down

# Or keep database running for Sprint 1
# docker-compose stop
```

---

*Sprint 0 QA Review - TaskFlow*
