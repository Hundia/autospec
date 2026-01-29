# Sprint 0 QA Review: Foundation

## Environment: claude-code

## Context — Read These Files First

**MANDATORY:** Read ALL these files to understand what should be tested:

- specs/* (all 10 specs + backlog.md)
- docs/testing/* (strategy, unit, integration, e2e, test-data)
- docs/api/reference.md — endpoint contracts to verify
- docs/api/authentication.md — auth flow to verify
- docs/api/error-codes.md — error responses to verify
- docs/architecture/security.md — security requirements
- docs/project/coding-standards.md — code quality standards

---

## QA Mission

Review and test ALL tickets completed in Sprint 0.

**Sprint Goal:** Establish project infrastructure, database schema, and core authentication system.
**Tickets to Review:** 25

---

## Pre-QA Setup

Before running tests, ensure the environment is ready:

```bash
# 1. Start PostgreSQL and Redis (via Docker)
docker-compose up -d postgres redis

# Or start them individually:
docker run -d --name shopflow-postgres -e POSTGRES_USER=shopflow -e POSTGRES_PASSWORD=shopflow -e POSTGRES_DB=shopflow -p 5432:5432 postgres:14
docker run -d --name shopflow-redis -p 6379:6379 redis:7

# 2. Set up backend
cd backend
cp .env.example .env
# Edit .env with correct DATABASE_URL and REDIS_URL

# 3. Run migrations
npx prisma migrate deploy

# 4. Seed test data (if available)
npm run db:seed

# 5. Start the backend server
npm run dev &
# Wait for server to be ready
sleep 5

# 6. Verify server is running
curl http://localhost:3001/health
# Expected: {"status":"ok","database":"ok","redis":"ok","timestamp":"..."}

# 7. Start frontend (in another terminal)
cd frontend
npm run dev &
sleep 5

# 8. Verify frontend is running
curl http://localhost:3000
# Expected: HTML page content
```

---

## Automated Test Suite

Run the full automated test suite:

```bash
# Backend unit tests
cd backend
npm run test:unit
# Expected: All tests pass

# Backend integration tests
npm run test:integration
# Expected: All tests pass

# Full test with coverage
npm run test:coverage
# Expected: Coverage report shows > 70% overall

# Frontend unit tests
cd ../frontend
npm test
# Expected: All tests pass

# Frontend build check
npm run build
# Expected: Build succeeds with no errors

# Type checking
cd ../backend && npm run typecheck
cd ../frontend && npm run typecheck
# Expected: No TypeScript errors

# Linting
cd ../backend && npm run lint
cd ../frontend && npm run lint
# Expected: No linting errors
```

---

## API Testing with Curl (MANDATORY)

**IMPORTANT:** These tests MUST be run with the backend server running.
Do not skip this section — it validates real API behavior.

### Setup: Define Environment Variables

```bash
export API_URL="http://localhost:3001/api/v1"
export TEST_EMAIL="qatest_$(date +%s)@example.com"
export TEST_PASSWORD="QaTest123!@#"
```

---

### Test 1: Health Check Endpoint

**Endpoint:** GET /health
**Ticket:** SF-004

```bash
# Health check
curl -s "$API_URL/../health" | jq .

# Expected Response (HTTP 200):
# {
#   "status": "ok",
#   "database": "ok",
#   "redis": "ok",
#   "timestamp": "2024-01-15T10:00:00.000Z"
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] status is "ok"
- [ ] database is "ok"
- [ ] redis is "ok"

---

### Test 2: User Registration

**Endpoint:** POST /api/v1/auth/register
**Ticket:** SF-010

#### Happy Path Test
```bash
# Register a new user
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'",
    "password": "'"$TEST_PASSWORD"'",
    "firstName": "QA",
    "lastName": "Tester"
  }' | jq .

# Expected Response (HTTP 201):
# {
#   "user": {
#     "id": "uuid-here",
#     "email": "qatest_xxx@example.com",
#     "firstName": "QA",
#     "lastName": "Tester",
#     "role": "CUSTOMER"
#   },
#   "accessToken": "eyJ...",
#   "refreshToken": "eyJ..."
# }

# Store tokens for later tests
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "qatest2_'"$(date +%s)"'@example.com",
    "password": "'"$TEST_PASSWORD"'",
    "firstName": "QA",
    "lastName": "Tester2"
  }')
export ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken')
export REFRESH_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.refreshToken')
echo "Access Token: ${ACCESS_TOKEN:0:50}..."
echo "Refresh Token: ${REFRESH_TOKEN:0:50}..."
```

**Pass Criteria:**
- [ ] Returns HTTP 201
- [ ] Response contains user object
- [ ] User has correct email and name
- [ ] accessToken is a valid JWT
- [ ] refreshToken is a valid JWT

#### Validation Error Test - Missing Fields
```bash
# Test missing required fields
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{}' | jq .

# Expected Response (HTTP 400):
# {
#   "error": "Validation failed",
#   "details": [
#     { "field": "email", "message": "Required" },
#     { "field": "password", "message": "Required" }
#   ]
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 400
- [ ] Error message indicates validation failure
- [ ] Details list missing fields

#### Validation Error Test - Invalid Email
```bash
# Test invalid email format
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "password": "'"$TEST_PASSWORD"'",
    "firstName": "Test",
    "lastName": "User"
  }' | jq .

# Expected Response (HTTP 400):
# {
#   "error": "Validation failed",
#   "details": [
#     { "field": "email", "message": "Invalid email format" }
#   ]
# }
```

#### Validation Error Test - Weak Password
```bash
# Test weak password
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "weakpass@example.com",
    "password": "123",
    "firstName": "Test",
    "lastName": "User"
  }' | jq .

# Expected Response (HTTP 400):
# {
#   "error": "Validation failed",
#   "details": [
#     { "field": "password", "message": "Password must be at least 8 characters..." }
#   ]
# }
```

#### Duplicate Email Test
```bash
# Test duplicate email registration
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'",
    "password": "'"$TEST_PASSWORD"'",
    "firstName": "Duplicate",
    "lastName": "User"
  }' | jq .

# Expected Response (HTTP 409):
# {
#   "error": "User already exists",
#   "code": "USER_EXISTS"
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 409
- [ ] Error indicates user exists

---

### Test 3: User Login

**Endpoint:** POST /api/v1/auth/login
**Ticket:** SF-011

#### Happy Path Test
```bash
# Login with valid credentials
curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'",
    "password": "'"$TEST_PASSWORD"'"
  }' | jq .

# Expected Response (HTTP 200):
# {
#   "user": {
#     "id": "uuid",
#     "email": "qatest_xxx@example.com",
#     "firstName": "QA",
#     "lastName": "Tester",
#     "role": "CUSTOMER"
#   },
#   "accessToken": "eyJ...",
#   "refreshToken": "eyJ..."
# }

# Store tokens
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'",
    "password": "'"$TEST_PASSWORD"'"
  }')
export ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.accessToken')
export REFRESH_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.refreshToken')
echo "Logged in. Access Token: ${ACCESS_TOKEN:0:50}..."
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] Response contains user object
- [ ] accessToken is a valid JWT
- [ ] refreshToken is a valid JWT

#### Invalid Email Test
```bash
# Test login with non-existent email
curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "'"$TEST_PASSWORD"'"
  }' | jq .

# Expected Response (HTTP 401):
# {
#   "error": "Invalid credentials",
#   "code": "INVALID_CREDENTIALS"
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 401
- [ ] Does NOT reveal whether email exists (security)

#### Invalid Password Test
```bash
# Test login with wrong password
curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'",
    "password": "WrongPassword123!"
  }' | jq .

# Expected Response (HTTP 401):
# {
#   "error": "Invalid credentials",
#   "code": "INVALID_CREDENTIALS"
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 401
- [ ] Same error as invalid email (security)

---

### Test 4: Get Current User

**Endpoint:** GET /api/v1/auth/me
**Ticket:** SF-014

#### Happy Path Test
```bash
# Get current user with valid token
curl -s "$API_URL/auth/me" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# Expected Response (HTTP 200):
# {
#   "id": "uuid",
#   "email": "qatest_xxx@example.com",
#   "firstName": "QA",
#   "lastName": "Tester",
#   "role": "CUSTOMER",
#   "emailVerified": false,
#   "createdAt": "2024-01-15T10:00:00.000Z"
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] Response contains user data
- [ ] Does NOT contain passwordHash

#### Unauthorized Test
```bash
# Test without token
curl -s "$API_URL/auth/me" | jq .

# Expected Response (HTTP 401):
# {
#   "error": "Unauthorized",
#   "code": "NO_TOKEN"
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 401

#### Invalid Token Test
```bash
# Test with invalid token
curl -s "$API_URL/auth/me" \
  -H "Authorization: Bearer invalid.token.here" | jq .

# Expected Response (HTTP 401):
# {
#   "error": "Invalid token",
#   "code": "INVALID_TOKEN"
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 401
- [ ] Error indicates invalid token

---

### Test 5: Token Refresh

**Endpoint:** POST /api/v1/auth/refresh
**Ticket:** SF-013

#### Happy Path Test
```bash
# Refresh access token
curl -s -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "'"$REFRESH_TOKEN"'"
  }' | jq .

# Expected Response (HTTP 200):
# {
#   "accessToken": "eyJ...",
#   "refreshToken": "eyJ..."
# }

# Store new tokens
REFRESH_RESPONSE=$(curl -s -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "'"$REFRESH_TOKEN"'"}')
export NEW_ACCESS_TOKEN=$(echo $REFRESH_RESPONSE | jq -r '.accessToken')
echo "New Access Token: ${NEW_ACCESS_TOKEN:0:50}..."
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] New accessToken is different from old one
- [ ] New token works for authenticated requests

#### Invalid Refresh Token Test
```bash
# Test with invalid refresh token
curl -s -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "invalid.refresh.token"
  }' | jq .

# Expected Response (HTTP 401):
# {
#   "error": "Invalid refresh token",
#   "code": "INVALID_REFRESH_TOKEN"
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 401

---

### Test 6: User Logout

**Endpoint:** POST /api/v1/auth/logout
**Ticket:** SF-012

#### Happy Path Test
```bash
# Logout
curl -s -X POST "$API_URL/auth/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# Expected Response (HTTP 200):
# {
#   "message": "Logged out successfully"
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] Message confirms logout

#### Verify Refresh Token Invalidated
```bash
# Try to use the old refresh token after logout
curl -s -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "'"$REFRESH_TOKEN"'"
  }' | jq .

# Expected Response (HTTP 401):
# {
#   "error": "Invalid refresh token",
#   "code": "INVALID_REFRESH_TOKEN"
# }
```

**Pass Criteria:**
- [ ] Old refresh token no longer works

---

### Test 7: Forgot Password

**Endpoint:** POST /api/v1/auth/forgot-password
**Ticket:** SF-015

#### Happy Path Test
```bash
# Request password reset
curl -s -X POST "$API_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "'"$TEST_EMAIL"'"
  }' | jq .

# Expected Response (HTTP 200):
# {
#   "message": "If the email exists, a reset link has been sent"
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] Generic message (doesn't reveal if email exists)

#### Non-existent Email Test
```bash
# Test with non-existent email
curl -s -X POST "$API_URL/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com"
  }' | jq .

# Expected: Same response as above (HTTP 200)
# Security: Should not reveal if email exists
```

**Pass Criteria:**
- [ ] Returns HTTP 200 (same as valid email)
- [ ] Same generic message

---

### Test 8: Rate Limiting

**Endpoint:** All auth endpoints
**Ticket:** SF-022

```bash
# Test rate limiting on login endpoint
for i in {1..10}; do
  RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"rate@test.com","password":"test"}')
  HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d':' -f2)
  echo "Request $i: HTTP $HTTP_CODE"
  if [ "$HTTP_CODE" == "429" ]; then
    echo "Rate limit hit on request $i"
    break
  fi
done

# Expected: After 5 requests, should receive HTTP 429
# Response headers should include:
#   X-RateLimit-Limit: 5
#   X-RateLimit-Remaining: 0
#   Retry-After: <seconds>
```

**Pass Criteria:**
- [ ] Rate limit kicks in after 5 requests
- [ ] Returns HTTP 429
- [ ] Rate limit headers present

---

## Frontend Testing

### Component Tests
```bash
cd frontend
npm run test:components
# Expected: All component tests pass
```

### Visual Verification Checklist

Open http://localhost:3000 in browser and verify:

#### Login Page (/login)
- [ ] Page renders without errors
- [ ] Email input present with placeholder
- [ ] Password input present (type="password")
- [ ] "Login" button present
- [ ] "Forgot password" link present
- [ ] "Create account" link present
- [ ] Form validates on submit
- [ ] Shows error for invalid email format
- [ ] Shows error for empty fields
- [ ] Loading spinner during submission
- [ ] Redirects to dashboard on success

#### Registration Page (/register)
- [ ] Page renders without errors
- [ ] All fields present: email, password, confirm password, first name, last name
- [ ] Password strength indicator updates as typing
- [ ] Password requirements checklist visible
- [ ] Terms and conditions checkbox
- [ ] Form validates all fields
- [ ] Passwords must match validation
- [ ] Loading spinner during submission
- [ ] Success state or redirect after registration

#### Forgot Password Page (/forgot-password)
- [ ] Page renders without errors
- [ ] Email input present
- [ ] Submit button present
- [ ] Shows success message after submission
- [ ] Back to login link present

### Responsive Design
- [ ] Mobile (375px): All forms usable, buttons full width
- [ ] Tablet (768px): Forms centered, reasonable width
- [ ] Desktop (1280px): Forms centered, max-width applied

### Accessibility
- [ ] All inputs have labels (visible or aria-label)
- [ ] Form errors announced to screen readers
- [ ] Tab navigation works correctly
- [ ] Focus visible on all interactive elements
- [ ] Color contrast meets WCAG AA

---

## Per-Ticket QA Review

### Ticket SF-001: Initialize Next.js project
#### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] TailwindCSS configured
- [ ] ESLint configured
- [ ] No build errors

#### Testing
- [ ] `npm run build` succeeds
- [ ] `npm run dev` starts without errors

#### Result: PASS / FAIL

---

### Ticket SF-004: Express.js backend setup
#### Code Quality
- [ ] TypeScript strict mode enabled
- [ ] Proper middleware order
- [ ] Error handling middleware present
- [ ] Health check endpoint works

#### Testing
- [ ] `npm run build` succeeds
- [ ] `npm run dev` starts without errors
- [ ] Health check returns 200

#### Result: PASS / FAIL

---

### Ticket SF-005: Prisma setup
#### Code Quality
- [ ] Prisma schema valid
- [ ] Client singleton pattern used
- [ ] Proper error handling for DB connection

#### Testing
- [ ] `npx prisma validate` passes
- [ ] `npx prisma studio` opens

#### Result: PASS / FAIL

---

### Ticket SF-006: Users migration
#### Code Quality
- [ ] All required columns present
- [ ] Proper data types
- [ ] Unique constraint on email
- [ ] Indexes defined

#### Testing
- [ ] Migration runs successfully
- [ ] Can insert and query users

#### Result: PASS / FAIL

---

### Ticket SF-009: JWT middleware
#### Code Quality
- [ ] Proper token validation
- [ ] Handles expired tokens
- [ ] Handles malformed tokens
- [ ] Sets user on request object

#### Testing
- [ ] Auth middleware unit tests pass
- [ ] Protected routes require token

#### Result: PASS / FAIL

---

### Ticket SF-010: Register endpoint
#### Code Quality
- [ ] Input validation with Zod
- [ ] Password hashed with bcrypt
- [ ] Proper error codes
- [ ] Returns user without password

#### Testing
- [ ] All curl tests pass
- [ ] Unit tests pass

#### Result: PASS / FAIL

---

### Ticket SF-011: Login endpoint
#### Code Quality
- [ ] Validates credentials
- [ ] Doesn't reveal if email exists
- [ ] Creates session record
- [ ] Returns tokens

#### Testing
- [ ] All curl tests pass
- [ ] Unit tests pass

#### Result: PASS / FAIL

---

### Ticket SF-022: Rate limiting
#### Code Quality
- [ ] Uses sliding window algorithm
- [ ] Proper rate limit headers
- [ ] Different limits per endpoint type

#### Testing
- [ ] Rate limit curl test passes
- [ ] Headers present in response

#### Result: PASS / FAIL

---

## QA Summary

### Test Results

| Category | Passed | Failed | Coverage |
|----------|--------|--------|----------|
| Backend Unit Tests | X/X | 0 | XX% |
| Backend Integration Tests | X/X | 0 | XX% |
| API Curl Tests | 8/8 | 0 | N/A |
| Frontend Unit Tests | X/X | 0 | XX% |
| Frontend Build | 1/1 | 0 | N/A |
| TypeScript Check | 2/2 | 0 | N/A |
| Lint Check | 2/2 | 0 | N/A |

### Issues Found

| Ticket | Issue | Severity | Action |
|--------|-------|----------|--------|
| - | No issues found | - | - |

### Security Review

- [ ] Passwords hashed with bcrypt (cost >= 10)
- [ ] JWT tokens have reasonable expiry
- [ ] Refresh tokens stored securely
- [ ] Rate limiting prevents brute force
- [ ] No sensitive data in error messages
- [ ] SQL injection prevented (Prisma parameterized queries)
- [ ] XSS prevented (React escapes by default)
- [ ] CORS configured correctly

### Performance Notes

- [ ] Health check responds in < 100ms
- [ ] Login responds in < 500ms
- [ ] Registration responds in < 500ms
- [ ] No N+1 queries in auth endpoints

### Overall Verdict

- [ ] **PASS** — All tests pass, ready for release
- [ ] **FAIL** — Issues found, needs fixes

---

## Post-QA Actions

### If PASS:
1. Update all ticket statuses to Done in specs/backlog.md
2. Run summary_sprint_0.md to generate sprint documentation
3. Merge to main branch

### If FAIL:
1. Document issues in Bug Backlog section of specs/backlog.md
2. Keep tickets in QA Review status
3. Fix issues and re-run QA

---

## Cleanup

```bash
# Stop the servers
pkill -f "npm run dev" || true

# Stop Docker services
docker-compose down

# Or stop individual containers
docker stop shopflow-postgres shopflow-redis
docker rm shopflow-postgres shopflow-redis
```
