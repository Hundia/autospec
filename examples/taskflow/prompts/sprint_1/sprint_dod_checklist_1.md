# TaskFlow - Sprint 1 Definition of Done Checklist

## Overview

This checklist verifies that Sprint 1 meets all Definition of Done criteria, including regression testing for Sprint 0 features.

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
cd /path/to/taskflow/backend
npx prettier --check "src/**/*.ts" && echo "PASS" || echo "FAIL"

cd /path/to/taskflow/frontend
npx prettier --check "src/**/*.{ts,tsx}" && echo "PASS" || echo "FAIL"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 2. Testing Checks

### 2.1 Unit Tests

```bash
cd /path/to/taskflow/backend
npm run test && echo "PASS: Backend tests" || echo "FAIL: Backend tests"

cd /path/to/taskflow/frontend
npm run test && echo "PASS: Frontend tests" || echo "FAIL: Frontend tests"
```

**Status**: [ ] PASS  [ ] FAIL

### 2.2 Test Coverage

```bash
cd /path/to/taskflow/backend
npm run test:coverage

# Verify coverage >= 70%
COVERAGE=$(npm run test:coverage 2>&1 | grep "All files" | awk '{print $4}' | tr -d '%')
if [ "$COVERAGE" -ge 70 ]; then
  echo "PASS: Coverage at ${COVERAGE}%"
else
  echo "FAIL: Coverage at ${COVERAGE}% (required: 70%)"
fi
```

**Status**: [ ] PASS  [ ] FAIL
**Coverage**: _____%

### 2.3 Sprint 0 Regression Tests

```bash
cd /path/to/taskflow/backend

# Run Sprint 0 specific tests
npm run test -- auth.test.ts && echo "PASS: Auth tests" || echo "FAIL: Auth tests"
npm run test -- task.test.ts && echo "PASS: Task tests" || echo "FAIL: Task tests"
```

**Status**: [ ] PASS  [ ] FAIL

### 2.4 Sprint 1 Feature Tests

```bash
cd /path/to/taskflow/backend

npm run test -- project.test.ts && echo "PASS: Project tests" || echo "FAIL: Project tests"
npm run test -- tag.test.ts && echo "PASS: Tag tests" || echo "FAIL: Tag tests"
npm run test -- dashboard.test.ts && echo "PASS: Dashboard tests" || echo "FAIL: Dashboard tests"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 3. Database Checks

### 3.1 Migrations Status

```bash
cd /path/to/taskflow/backend
npx prisma migrate status

# All migrations should be applied
npx prisma migrate deploy && echo "PASS" || echo "FAIL"
```

**Status**: [ ] PASS  [ ] FAIL

### 3.2 Schema Validation

```bash
cd /path/to/taskflow/backend
npx prisma validate && echo "PASS" || echo "FAIL"
```

**Status**: [ ] PASS  [ ] FAIL

### 3.3 New Tables Exist

```bash
# Connect to database and verify tables
psql $DATABASE_URL -c "\dt"

# Expected tables:
# - users
# - tasks
# - projects (NEW)
# - tags (NEW)
# - task_tags (NEW)
```

**Status**: [ ] PASS  [ ] FAIL

---

## 4. Build Checks

### 4.1 Backend Build

```bash
cd /path/to/taskflow/backend
npm run build && echo "PASS" || echo "FAIL"
```

**Status**: [ ] PASS  [ ] FAIL

### 4.2 Frontend Build

```bash
cd /path/to/taskflow/frontend
npm run build && echo "PASS" || echo "FAIL"
```

**Status**: [ ] PASS  [ ] FAIL

### 4.3 Docker Build

```bash
cd /path/to/taskflow
docker-compose build && echo "PASS" || echo "FAIL"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 5. API Verification

### 5.1 Setup Test User

```bash
# Login to get token
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dod-test@example.com","password":"Test123!"}')

TOKEN=$(echo "$RESPONSE" | jq -r '.data.accessToken')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  # Create user if doesn't exist
  curl -s -X POST http://localhost:3000/api/v1/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"dod-test@example.com","password":"Test123!","name":"DoD Test"}'

  RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"dod-test@example.com","password":"Test123!"}')
  TOKEN=$(echo "$RESPONSE" | jq -r '.data.accessToken')
fi

echo "Token acquired: ${TOKEN:0:20}..."
```

### 5.2 Sprint 0 API Regression

```bash
# Health check
curl -s http://localhost:3000/api/v1/health | jq -e '.status == "ok"' && echo "PASS: Health" || echo "FAIL: Health"

# Auth endpoints
curl -s http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Auth/me" || echo "FAIL: Auth/me"

# Task CRUD
TASK=$(curl -s -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"DoD Regression Test"}')

echo "$TASK" | jq -e '.success == true' && echo "PASS: Create task" || echo "FAIL: Create task"

TASK_ID=$(echo "$TASK" | jq -r '.data.id')

curl -s http://localhost:3000/api/v1/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Get task" || echo "FAIL: Get task"

curl -s -X PUT http://localhost:3000/api/v1/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"done"}' | jq -e '.success == true' && echo "PASS: Update task" || echo "FAIL: Update task"

curl -s -X DELETE http://localhost:3000/api/v1/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Delete task" || echo "FAIL: Delete task"
```

**Status**: [ ] PASS  [ ] FAIL

### 5.3 Project Endpoints

```bash
# Create project
PROJECT=$(curl -s -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"DoD Test Project","color":"#8b5cf6"}')

echo "$PROJECT" | jq -e '.success == true' && echo "PASS: Create project" || echo "FAIL: Create project"

PROJECT_ID=$(echo "$PROJECT" | jq -r '.data.id')

# List projects
curl -s http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: List projects" || echo "FAIL: List projects"

# Get project
curl -s http://localhost:3000/api/v1/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Get project" || echo "FAIL: Get project"

# Update project
curl -s -X PUT http://localhost:3000/api/v1/projects/$PROJECT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Updated Project"}' | jq -e '.success == true' && echo "PASS: Update project" || echo "FAIL: Update project"

# Archive project
curl -s -X PATCH http://localhost:3000/api/v1/projects/$PROJECT_ID/archive \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"isArchived":true}' | jq -e '.success == true' && echo "PASS: Archive project" || echo "FAIL: Archive project"
```

**Status**: [ ] PASS  [ ] FAIL

### 5.4 Tag Endpoints

```bash
# Create tag
TAG=$(curl -s -X POST http://localhost:3000/api/v1/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"dod-test-tag","color":"#ef4444"}')

echo "$TAG" | jq -e '.success == true' && echo "PASS: Create tag" || echo "FAIL: Create tag"

TAG_ID=$(echo "$TAG" | jq -r '.data.id')

# List tags
curl -s http://localhost:3000/api/v1/tags \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: List tags" || echo "FAIL: List tags"

# Update tag
curl -s -X PUT http://localhost:3000/api/v1/tags/$TAG_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"color":"#dc2626"}' | jq -e '.success == true' && echo "PASS: Update tag" || echo "FAIL: Update tag"
```

**Status**: [ ] PASS  [ ] FAIL

### 5.5 Task-Tag Assignment

```bash
# Create task
TASK=$(curl -s -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Task for tagging"}')

TASK_ID=$(echo "$TASK" | jq -r '.data.id')

# Add tags to task
curl -s -X POST http://localhost:3000/api/v1/tasks/$TASK_ID/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"tagIds":["'$TAG_ID'"]}' | jq -e '.success == true' && echo "PASS: Add tags" || echo "FAIL: Add tags"

# Verify task has tags
curl -s http://localhost:3000/api/v1/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN" | jq -e '.data.tags | length > 0' && echo "PASS: Task has tags" || echo "FAIL: Task has tags"

# Remove tag
curl -s -X DELETE http://localhost:3000/api/v1/tasks/$TASK_ID/tags/$TAG_ID \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Remove tag" || echo "FAIL: Remove tag"
```

**Status**: [ ] PASS  [ ] FAIL

### 5.6 Dashboard Endpoints

```bash
# Dashboard stats
curl -s http://localhost:3000/api/v1/dashboard/stats \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true and .data.overview' && echo "PASS: Dashboard stats" || echo "FAIL: Dashboard stats"

# Activity feed
curl -s "http://localhost:3000/api/v1/dashboard/activity?limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Activity feed" || echo "FAIL: Activity feed"
```

**Status**: [ ] PASS  [ ] FAIL

### 5.7 Enhanced Filtering

```bash
# Multi-status filter
curl -s "http://localhost:3000/api/v1/tasks?status=todo,in_progress" \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Multi-status" || echo "FAIL: Multi-status"

# Priority filter
curl -s "http://localhost:3000/api/v1/tasks?priority=high,urgent" \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Priority filter" || echo "FAIL: Priority filter"

# Search
curl -s "http://localhost:3000/api/v1/tasks?search=test" \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Search" || echo "FAIL: Search"

# Combined filters
curl -s "http://localhost:3000/api/v1/tasks?status=todo&priority=high&search=test" \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Combined filters" || echo "FAIL: Combined filters"

# Sorting
curl -s "http://localhost:3000/api/v1/tasks?sortBy=dueDate&sortOrder=asc" \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Sorting" || echo "FAIL: Sorting"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 6. Security Checks

### 6.1 Dependency Audit

```bash
cd /path/to/taskflow/backend
npm audit --audit-level=high && echo "PASS" || echo "FAIL (high vulnerabilities)"

cd /path/to/taskflow/frontend
npm audit --audit-level=high && echo "PASS" || echo "FAIL (high vulnerabilities)"
```

**Status**: [ ] PASS  [ ] FAIL

### 6.2 User Isolation

```bash
# Create second user
curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"dod-other@example.com","password":"Test123!","name":"Other User"}'

RESPONSE2=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dod-other@example.com","password":"Test123!"}')
TOKEN2=$(echo "$RESPONSE2" | jq -r '.data.accessToken')

# Try to access first user's project
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/v1/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN2")

if [ "$STATUS" = "404" ]; then
  echo "PASS: Project isolation"
else
  echo "FAIL: Project isolation (got $STATUS, expected 404)"
fi

# Try to access first user's tag
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/v1/tags/$TAG_ID \
  -H "Authorization: Bearer $TOKEN2")

if [ "$STATUS" = "404" ]; then
  echo "PASS: Tag isolation"
else
  echo "FAIL: Tag isolation (got $STATUS, expected 404)"
fi
```

**Status**: [ ] PASS  [ ] FAIL

---

## 7. Performance Checks

### 7.1 API Response Times

```bash
echo "Testing API response times..."

# Dashboard stats (complex query)
TIME=$(curl -s -o /dev/null -w "%{time_total}" http://localhost:3000/api/v1/dashboard/stats \
  -H "Authorization: Bearer $TOKEN")
echo "Dashboard stats: ${TIME}s"
if (( $(echo "$TIME < 0.5" | bc -l) )); then
  echo "PASS: Dashboard under 500ms"
else
  echo "WARN: Dashboard over 500ms"
fi

# Filtered tasks
TIME=$(curl -s -o /dev/null -w "%{time_total}" "http://localhost:3000/api/v1/tasks?status=todo,in_progress&priority=high" \
  -H "Authorization: Bearer $TOKEN")
echo "Filtered tasks: ${TIME}s"
if (( $(echo "$TIME < 0.3" | bc -l) )); then
  echo "PASS: Filtering under 300ms"
else
  echo "WARN: Filtering over 300ms"
fi
```

**Status**: [ ] PASS  [ ] WARN  [ ] FAIL

---

## 8. Full Verification Script

```bash
#!/bin/bash

echo "=== TaskFlow Sprint 1 DoD Full Verification ==="
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
run_check "Migrations Status" "cd backend && npx prisma migrate status"

# Security
run_check "Backend Audit" "cd backend && npm audit --audit-level=high"
run_check "Frontend Audit" "cd frontend && npm audit --audit-level=high"

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
| Sprint 0 Regression | [ ] PASS [ ] FAIL | |
| Database | [ ] PASS [ ] FAIL | Migrations: X applied |
| Build | [ ] PASS [ ] FAIL | |
| Project API | [ ] PASS [ ] FAIL | |
| Tag API | [ ] PASS [ ] FAIL | |
| Dashboard API | [ ] PASS [ ] FAIL | |
| Filtering | [ ] PASS [ ] FAIL | |
| Security | [ ] PASS [ ] FAIL | |
| Performance | [ ] PASS [ ] FAIL | |

### Final Sign-Off

**DoD Status**: [ ] PASSED  [ ] FAILED

**Date**: _______________

**Verified By**: _______________

### If PASSED - Create Git Tag

```bash
git tag -a sprint-1-complete -m "Sprint 1 Complete: Projects, Tags & Enhanced Task Management

DoD Verification: PASSED
Date: $(date +%Y-%m-%d)

Features Delivered:
- Project management (CRUD, archive)
- Tagging system (create, assign, filter)
- Dashboard statistics
- Enhanced filtering (multi-filter, search, sorting)
- Activity feed

New API Endpoints: 15
New Database Tables: 3 (projects, tags, task_tags)
Test Coverage: XX%

Regression Status: All Sprint 0 tests passing
Backward Compatibility: Maintained
"

git push origin sprint-1-complete

echo "Sprint 1 tagged as complete!"
```

### If FAILED - Document Issues

```markdown
## DoD Failure Report

**Failed Checks**:
1. [Check name]: [Reason]
2. [Check name]: [Reason]

**Required Actions**:
1. [Action]
2. [Action]

**Estimated Time to Fix**: [X hours/days]

**Assigned To**: [Name]
```
