# TaskFlow - Sprint 0 Definition of Done Checklist

## Overview

This checklist verifies that Sprint 0 meets all Definition of Done criteria. Execute each verification step and mark as PASS or FAIL.

---

## 1. Code Quality Checks

### 1.1 Linting

```bash
# Backend linting
cd /path/to/taskflow/backend
npm run lint && echo "PASS: Backend linting" || echo "FAIL: Backend linting"

# Frontend linting
cd /path/to/taskflow/frontend
npm run lint && echo "PASS: Frontend linting" || echo "FAIL: Frontend linting"
```

**Status**: [ ] PASS  [ ] FAIL

### 1.2 TypeScript Compilation

```bash
# Backend TypeScript
cd /path/to/taskflow/backend
npx tsc --noEmit && echo "PASS: Backend TypeScript" || echo "FAIL: Backend TypeScript"

# Frontend TypeScript
cd /path/to/taskflow/frontend
npx tsc --noEmit && echo "PASS: Frontend TypeScript" || echo "FAIL: Frontend TypeScript"
```

**Status**: [ ] PASS  [ ] FAIL

### 1.3 Code Formatting

```bash
# Check Prettier formatting
cd /path/to/taskflow/backend
npx prettier --check "src/**/*.ts" && echo "PASS: Backend formatting" || echo "FAIL: Backend formatting"

cd /path/to/taskflow/frontend
npx prettier --check "src/**/*.{ts,tsx}" && echo "PASS: Frontend formatting" || echo "FAIL: Frontend formatting"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 2. Testing Checks

### 2.1 Unit Tests

```bash
# Backend unit tests
cd /path/to/taskflow/backend
npm run test && echo "PASS: Backend unit tests" || echo "FAIL: Backend unit tests"

# Frontend unit tests
cd /path/to/taskflow/frontend
npm run test && echo "PASS: Frontend unit tests" || echo "FAIL: Frontend unit tests"
```

**Status**: [ ] PASS  [ ] FAIL

### 2.2 Test Coverage

```bash
# Backend coverage (must be > 70%)
cd /path/to/taskflow/backend
npm run test:coverage

# Check coverage threshold
COVERAGE=$(npm run test:coverage 2>&1 | grep "All files" | awk '{print $4}' | tr -d '%')
if [ "$COVERAGE" -ge 70 ]; then
  echo "PASS: Backend coverage at ${COVERAGE}%"
else
  echo "FAIL: Backend coverage at ${COVERAGE}% (required: 70%)"
fi
```

**Status**: [ ] PASS  [ ] FAIL
**Coverage**: _____%

### 2.3 Integration Tests

```bash
# Run integration tests
cd /path/to/taskflow/backend
npm run test:integration && echo "PASS: Integration tests" || echo "FAIL: Integration tests"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 3. Build Checks

### 3.1 Backend Build

```bash
cd /path/to/taskflow/backend
npm run build && echo "PASS: Backend build" || echo "FAIL: Backend build"
```

**Status**: [ ] PASS  [ ] FAIL

### 3.2 Frontend Build

```bash
cd /path/to/taskflow/frontend
npm run build && echo "PASS: Frontend build" || echo "FAIL: Frontend build"
```

**Status**: [ ] PASS  [ ] FAIL

### 3.3 Docker Build

```bash
cd /path/to/taskflow
docker-compose build && echo "PASS: Docker build" || echo "FAIL: Docker build"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 4. Database Checks

### 4.1 Migrations

```bash
cd /path/to/taskflow/backend
npx prisma migrate status

# Verify all migrations applied
npx prisma migrate deploy && echo "PASS: Migrations" || echo "FAIL: Migrations"
```

**Status**: [ ] PASS  [ ] FAIL

### 4.2 Database Schema Validation

```bash
cd /path/to/taskflow/backend
npx prisma validate && echo "PASS: Schema validation" || echo "FAIL: Schema validation"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 5. Security Checks

### 5.1 Dependency Audit

```bash
# Backend audit
cd /path/to/taskflow/backend
npm audit --audit-level=high && echo "PASS: Backend security" || echo "FAIL: Backend security (high vulnerabilities found)"

# Frontend audit
cd /path/to/taskflow/frontend
npm audit --audit-level=high && echo "PASS: Frontend security" || echo "FAIL: Frontend security (high vulnerabilities found)"
```

**Status**: [ ] PASS  [ ] FAIL

### 5.2 Environment Variables

```bash
# Verify .env.example exists and is complete
cd /path/to/taskflow/backend

if [ -f ".env.example" ]; then
  echo "PASS: .env.example exists"
else
  echo "FAIL: .env.example missing"
fi

# Check required variables are documented
required_vars=("DATABASE_URL" "JWT_SECRET" "JWT_EXPIRES_IN" "CORS_ORIGIN")
for var in "${required_vars[@]}"; do
  if grep -q "$var" .env.example; then
    echo "PASS: $var documented"
  else
    echo "FAIL: $var not documented in .env.example"
  fi
done
```

**Status**: [ ] PASS  [ ] FAIL

### 5.3 No Secrets in Code

```bash
# Check for hardcoded secrets
cd /path/to/taskflow
grep -r "password\s*=" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | grep -v ".env" | grep -v "test" && echo "FAIL: Possible hardcoded passwords" || echo "PASS: No hardcoded passwords found"

grep -r "secret\s*=" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | grep -v ".env" | grep -v "test" && echo "FAIL: Possible hardcoded secrets" || echo "PASS: No hardcoded secrets found"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 6. API Verification

### 6.1 Health Endpoint

```bash
curl -s http://localhost:3000/api/v1/health | jq -e '.status == "ok"' && echo "PASS: Health endpoint" || echo "FAIL: Health endpoint"
```

**Status**: [ ] PASS  [ ] FAIL

### 6.2 Authentication Endpoints

```bash
# Test registration
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"dod-test@example.com","password":"Test123!","name":"DoD Test"}')

echo "$REGISTER_RESPONSE" | jq -e '.success == true' && echo "PASS: Registration endpoint" || echo "FAIL: Registration endpoint"

# Test login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dod-test@example.com","password":"Test123!"}')

echo "$LOGIN_RESPONSE" | jq -e '.success == true' && echo "PASS: Login endpoint" || echo "FAIL: Login endpoint"

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')

# Test protected endpoint
curl -s http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Protected endpoint" || echo "FAIL: Protected endpoint"
```

**Status**: [ ] PASS  [ ] FAIL

### 6.3 Task CRUD Endpoints

```bash
# Create task
CREATE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"DoD Test Task","priority":"high"}')

echo "$CREATE_RESPONSE" | jq -e '.success == true' && echo "PASS: Create task" || echo "FAIL: Create task"

TASK_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.id')

# List tasks
curl -s http://localhost:3000/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: List tasks" || echo "FAIL: List tasks"

# Get single task
curl -s "http://localhost:3000/api/v1/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Get task" || echo "FAIL: Get task"

# Update task
curl -s -X PUT "http://localhost:3000/api/v1/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"done"}' | jq -e '.success == true' && echo "PASS: Update task" || echo "FAIL: Update task"

# Delete task
curl -s -X DELETE "http://localhost:3000/api/v1/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Delete task" || echo "FAIL: Delete task"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 7. Documentation Checks

### 7.1 README Exists

```bash
if [ -f "/path/to/taskflow/README.md" ]; then
  echo "PASS: README.md exists"
else
  echo "FAIL: README.md missing"
fi
```

**Status**: [ ] PASS  [ ] FAIL

### 7.2 API Documentation

```bash
# Check for API documentation
if [ -f "/path/to/taskflow/docs/api/reference.md" ] || [ -f "/path/to/taskflow/backend/README.md" ]; then
  echo "PASS: API documentation exists"
else
  echo "FAIL: API documentation missing"
fi
```

**Status**: [ ] PASS  [ ] FAIL

---

## 8. Git Checks

### 8.1 Branch Status

```bash
cd /path/to/taskflow
git status

# Check if working directory is clean
if [ -z "$(git status --porcelain)" ]; then
  echo "PASS: Working directory clean"
else
  echo "FAIL: Uncommitted changes present"
fi
```

**Status**: [ ] PASS  [ ] FAIL

### 8.2 All Changes Merged to Main

```bash
cd /path/to/taskflow

# Check current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
  echo "PASS: On main branch"
else
  echo "INFO: Currently on branch $CURRENT_BRANCH"
fi

# Check if branch is up to date with remote
git fetch origin
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "no-upstream")

if [ "$LOCAL" = "$REMOTE" ]; then
  echo "PASS: Branch is up to date with remote"
else
  echo "FAIL: Branch is not up to date with remote"
fi
```

**Status**: [ ] PASS  [ ] FAIL

---

## 9. Performance Checks

### 9.1 API Response Time

```bash
# Measure API response times
echo "Testing API response times..."

# Health endpoint
TIME_HEALTH=$(curl -s -o /dev/null -w "%{time_total}" http://localhost:3000/api/v1/health)
echo "Health endpoint: ${TIME_HEALTH}s"

# Login endpoint
TIME_LOGIN=$(curl -s -o /dev/null -w "%{time_total}" -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dod-test@example.com","password":"Test123!"}')
echo "Login endpoint: ${TIME_LOGIN}s"

# Check if under 300ms (0.3s)
if (( $(echo "$TIME_LOGIN < 0.3" | bc -l) )); then
  echo "PASS: Login response time under 300ms"
else
  echo "FAIL: Login response time over 300ms"
fi
```

**Status**: [ ] PASS  [ ] FAIL

---

## 10. Final Verification

### Full Stack Smoke Test

```bash
#!/bin/bash
echo "=== TaskFlow Sprint 0 DoD Full Verification ==="
echo ""

PASS_COUNT=0
FAIL_COUNT=0

run_check() {
  local name="$1"
  local command="$2"

  if eval "$command" > /dev/null 2>&1; then
    echo "[PASS] $name"
    ((PASS_COUNT++))
  else
    echo "[FAIL] $name"
    ((FAIL_COUNT++))
  fi
}

# Code Quality
run_check "Backend Lint" "cd backend && npm run lint"
run_check "Frontend Lint" "cd frontend && npm run lint"
run_check "Backend TypeScript" "cd backend && npx tsc --noEmit"
run_check "Frontend TypeScript" "cd frontend && npx tsc --noEmit"

# Tests
run_check "Backend Tests" "cd backend && npm test"
run_check "Frontend Tests" "cd frontend && npm test"

# Build
run_check "Backend Build" "cd backend && npm run build"
run_check "Frontend Build" "cd frontend && npm run build"
run_check "Docker Build" "docker-compose build"

# Database
run_check "Prisma Validate" "cd backend && npx prisma validate"
run_check "Migrations Applied" "cd backend && npx prisma migrate status"

# Security
run_check "Backend Security Audit" "cd backend && npm audit --audit-level=high"
run_check "Frontend Security Audit" "cd frontend && npm audit --audit-level=high"

echo ""
echo "=== Summary ==="
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo "DoD VERIFICATION: PASSED"
  exit 0
else
  echo "DoD VERIFICATION: FAILED"
  exit 1
fi
```

---

## DoD Summary

### Checklist Summary

| Category | Status | Notes |
|----------|--------|-------|
| Code Quality | [ ] PASS [ ] FAIL | |
| Testing | [ ] PASS [ ] FAIL | Coverage: ___% |
| Build | [ ] PASS [ ] FAIL | |
| Database | [ ] PASS [ ] FAIL | |
| Security | [ ] PASS [ ] FAIL | |
| API Verification | [ ] PASS [ ] FAIL | |
| Documentation | [ ] PASS [ ] FAIL | |
| Git Status | [ ] PASS [ ] FAIL | |
| Performance | [ ] PASS [ ] FAIL | |

### Final Sign-Off

**DoD Status**: [ ] PASSED  [ ] FAILED

**Date**: _______________

**Verified By**: _______________

**Notes**:
```
[Add any notes about the verification process or outstanding items]
```

### If PASSED - Create Git Tag

```bash
# Create and push sprint completion tag
git tag -a sprint-0-complete -m "Sprint 0 Complete: Foundation & Core Setup

DoD Verification: PASSED
Date: $(date +%Y-%m-%d)

Features Delivered:
- User authentication (register, login, JWT)
- Task CRUD operations
- PostgreSQL with Prisma ORM
- Docker development environment

Test Coverage: XX%
All quality gates passed.
"

git push origin sprint-0-complete

echo "Sprint 0 tagged as complete!"
```

### If FAILED - Document Issues

```markdown
## DoD Failure Report

**Failed Checks**:
1. [Check name]: [Reason for failure]
2. [Check name]: [Reason for failure]

**Required Actions**:
1. [Action needed]
2. [Action needed]

**Estimated Time to Fix**: [X hours/days]

**Assigned To**: [Name]
```
