# TaskFlow - Sprint 0 QA Testing Prompt

## Overview

This document provides comprehensive QA testing procedures for Sprint 0 of TaskFlow. Execute all curl commands to verify API functionality.

**Base URL**: `http://localhost:3000`

---

## Pre-Test Setup

### 1. Start the Application

```bash
# Start with Docker
docker-compose up -d

# Or start manually
cd backend && npm run dev
```

### 2. Verify Server is Running

```bash
curl -X GET http://localhost:3000/api/v1/health

# Expected Response (200):
# {"status":"ok","timestamp":"2026-01-30T..."}
```

### 3. Reset Test Database (Optional)

```bash
cd backend
npx prisma migrate reset --force
```

---

## Test Suite 1: User Registration

### Test 1.1: Successful Registration

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "user": {
#       "id": "...",
#       "email": "testuser@example.com",
#       "name": "Test User",
#       "createdAt": "..."
#     },
#     "accessToken": "eyJ...",
#     "refreshToken": "eyJ..."
#   }
# }
```

### Test 1.2: Duplicate Email Registration

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Test456!",
    "name": "Duplicate User"
  }'

# Expected Response (409):
# {
#   "success": false,
#   "error": {
#     "code": "CONFLICT",
#     "message": "Email already exists"
#   }
# }
```

### Test 1.3: Invalid Email Format

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "Test123!",
    "name": "Test User"
  }'

# Expected Response (400):
# {
#   "success": false,
#   "error": {
#     "code": "VALIDATION_ERROR",
#     "message": "Invalid request data",
#     "details": [{"field": "email", "message": "Invalid email format"}]
#   }
# }
```

### Test 1.4: Weak Password

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "weak@example.com",
    "password": "weak",
    "name": "Weak Password"
  }'

# Expected Response (400):
# {
#   "success": false,
#   "error": {
#     "code": "VALIDATION_ERROR",
#     "details": [{"field": "password", "message": "Password must be at least 8 characters"}]
#   }
# }
```

### Test 1.5: Missing Required Fields

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "missing@example.com"
  }'

# Expected Response (400):
# {
#   "success": false,
#   "error": {
#     "code": "VALIDATION_ERROR",
#     "details": [
#       {"field": "password", "message": "Required"},
#       {"field": "name", "message": "Required"}
#     ]
#   }
# }
```

---

## Test Suite 2: User Login

### Test 2.1: Successful Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "Test123!"
  }'

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "user": {...},
#     "accessToken": "eyJ...",
#     "refreshToken": "eyJ..."
#   }
# }

# SAVE THE ACCESS TOKEN FOR SUBSEQUENT TESTS:
export TOKEN="eyJ..."
```

### Test 2.2: Invalid Credentials

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "WrongPassword123!"
  }'

# Expected Response (401):
# {
#   "success": false,
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "Invalid email or password"
#   }
# }
```

### Test 2.3: Non-Existent User

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@example.com",
    "password": "Test123!"
  }'

# Expected Response (401):
# {
#   "success": false,
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "Invalid email or password"
#   }
# }
```

---

## Test Suite 3: Get Current User

### Test 3.1: Get Authenticated User Profile

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "email": "testuser@example.com",
#     "name": "Test User",
#     "createdAt": "..."
#   }
# }
```

### Test 3.2: Missing Authorization Header

```bash
curl -X GET http://localhost:3000/api/v1/auth/me

# Expected Response (401):
# {
#   "success": false,
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "No token provided"
#   }
# }
```

### Test 3.3: Invalid Token

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer invalid-token-here"

# Expected Response (401):
# {
#   "success": false,
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "Invalid or expired token"
#   }
# }
```

---

## Test Suite 4: Create Task

### Test 4.1: Create Task with All Fields

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Complete Sprint 0 Documentation",
    "description": "Write comprehensive documentation for all Sprint 0 features",
    "priority": "high",
    "dueDate": "2026-02-15"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "title": "Complete Sprint 0 Documentation",
#     "description": "Write comprehensive documentation...",
#     "status": "todo",
#     "priority": "high",
#     "dueDate": "2026-02-15",
#     "createdAt": "..."
#   }
# }

# SAVE THE TASK ID:
export TASK_ID="..."
```

### Test 4.2: Create Task with Minimum Fields

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Simple Task"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "title": "Simple Task",
#     "status": "todo",
#     "priority": "medium",
#     "dueDate": null
#   }
# }
```

### Test 4.3: Create Task Without Authentication

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Unauthorized Task"
  }'

# Expected Response (401):
# {
#   "success": false,
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "No token provided"
#   }
# }
```

### Test 4.4: Create Task with Missing Title

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "description": "Task without title"
  }'

# Expected Response (400):
# {
#   "success": false,
#   "error": {
#     "code": "VALIDATION_ERROR",
#     "details": [{"field": "title", "message": "Title is required"}]
#   }
# }
```

### Test 4.5: Create Task with Invalid Priority

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Invalid Priority Task",
    "priority": "super-urgent"
  }'

# Expected Response (400):
# {
#   "success": false,
#   "error": {
#     "code": "VALIDATION_ERROR",
#     "details": [{"field": "priority", "message": "Invalid enum value"}]
#   }
# }
```

---

## Test Suite 5: List Tasks

### Test 5.1: List All Tasks

```bash
curl -X GET http://localhost:3000/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "tasks": [...],
#     "pagination": {
#       "page": 1,
#       "limit": 20,
#       "total": 2,
#       "totalPages": 1
#     }
#   }
# }
```

### Test 5.2: List Tasks with Pagination

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "tasks": [...],
#     "pagination": {
#       "page": 1,
#       "limit": 10,
#       ...
#     }
#   }
# }
```

### Test 5.3: Filter Tasks by Status

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?status=todo" \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# All returned tasks should have status: "todo"
```

### Test 5.4: Filter Tasks by Priority

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?priority=high" \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# All returned tasks should have priority: "high"
```

---

## Test Suite 6: Get Single Task

### Test 6.1: Get Task by ID

```bash
curl -X GET http://localhost:3000/api/v1/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "title": "Complete Sprint 0 Documentation",
#     ...
#   }
# }
```

### Test 6.2: Get Non-Existent Task

```bash
curl -X GET http://localhost:3000/api/v1/tasks/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (404):
# {
#   "success": false,
#   "error": {
#     "code": "NOT_FOUND",
#     "message": "Task not found"
#   }
# }
```

### Test 6.3: Get Task with Invalid UUID

```bash
curl -X GET http://localhost:3000/api/v1/tasks/invalid-uuid \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (400):
# {
#   "success": false,
#   "error": {
#     "code": "VALIDATION_ERROR",
#     "message": "Invalid task ID format"
#   }
# }
```

---

## Test Suite 7: Update Task

### Test 7.1: Update Task Status

```bash
curl -X PUT http://localhost:3000/api/v1/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "in_progress"
  }'

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "status": "in_progress",
#     ...
#   }
# }
```

### Test 7.2: Update Multiple Fields

```bash
curl -X PUT http://localhost:3000/api/v1/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated Task Title",
    "description": "Updated description",
    "priority": "urgent"
  }'

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "title": "Updated Task Title",
#     "description": "Updated description",
#     "priority": "urgent",
#     ...
#   }
# }
```

### Test 7.3: Complete Task

```bash
curl -X PUT http://localhost:3000/api/v1/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "done"
  }'

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "status": "done",
#     "completedAt": "2026-01-30T...",
#     ...
#   }
# }
```

### Test 7.4: Update Non-Existent Task

```bash
curl -X PUT http://localhost:3000/api/v1/tasks/00000000-0000-0000-0000-000000000000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "done"
  }'

# Expected Response (404):
# {
#   "success": false,
#   "error": {
#     "code": "NOT_FOUND",
#     "message": "Task not found"
#   }
# }
```

---

## Test Suite 8: Delete Task

### Test 8.1: Delete Task Successfully

```bash
# First, create a task to delete
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Task to Delete"}'

# Save the returned ID as DELETE_TASK_ID

curl -X DELETE http://localhost:3000/api/v1/tasks/$DELETE_TASK_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "message": "Task deleted successfully"
# }
```

### Test 8.2: Verify Task is Deleted

```bash
curl -X GET http://localhost:3000/api/v1/tasks/$DELETE_TASK_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (404):
# {
#   "success": false,
#   "error": {
#     "code": "NOT_FOUND",
#     "message": "Task not found"
#   }
# }
```

### Test 8.3: Delete Non-Existent Task

```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/00000000-0000-0000-0000-000000000000 \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (404):
# {
#   "success": false,
#   "error": {
#     "code": "NOT_FOUND",
#     "message": "Task not found"
#   }
# }
```

---

## Test Suite 9: Authorization Tests

### Test 9.1: User Cannot Access Another User's Tasks

```bash
# Create a second user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seconduser@example.com",
    "password": "Test123!",
    "name": "Second User"
  }'

# Save second user's token as TOKEN2
export TOKEN2="eyJ..."

# Try to access first user's task with second user's token
curl -X GET http://localhost:3000/api/v1/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN2"

# Expected Response (404):
# {
#   "success": false,
#   "error": {
#     "code": "NOT_FOUND",
#     "message": "Task not found"
#   }
# }
```

### Test 9.2: User Cannot Update Another User's Tasks

```bash
curl -X PUT http://localhost:3000/api/v1/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN2" \
  -d '{"status": "done"}'

# Expected Response (404):
# Task should not be found (user isolation)
```

---

## Test Suite 10: Token Refresh

### Test 10.1: Refresh Access Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<refresh-token-from-login>"
  }'

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "accessToken": "eyJ...",
#     "refreshToken": "eyJ..."
#   }
# }
```

### Test 10.2: Invalid Refresh Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "invalid-refresh-token"
  }'

# Expected Response (401):
# {
#   "success": false,
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "Invalid refresh token"
#   }
# }
```

---

## Automated Test Script

Save this as `qa_tests.sh` and run with `bash qa_tests.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
PASS=0
FAIL=0

# Helper function
test_endpoint() {
  local name="$1"
  local expected_status="$2"
  local actual_status="$3"

  if [ "$actual_status" -eq "$expected_status" ]; then
    echo "[PASS] $name"
    ((PASS++))
  else
    echo "[FAIL] $name (expected $expected_status, got $actual_status)"
    ((FAIL++))
  fi
}

echo "Starting TaskFlow Sprint 0 QA Tests..."
echo "========================================"

# Test 1: Health Check
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/health")
test_endpoint "Health Check" 200 "$STATUS"

# Test 2: Register User
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"qatest@example.com","password":"Test123!","name":"QA Test"}')
test_endpoint "Register User" 201 "$STATUS"

# Test 3: Login
RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"qatest@example.com","password":"Test123!"}')
TOKEN=$(echo "$RESPONSE" | jq -r '.data.accessToken')
STATUS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$STATUS" = "true" ] && [ -n "$TOKEN" ]; then
  echo "[PASS] Login"
  ((PASS++))
else
  echo "[FAIL] Login"
  ((FAIL++))
fi

# Test 4: Get Current User
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/auth/me" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "Get Current User" 200 "$STATUS"

# Test 5: Create Task
RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/tasks" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"QA Test Task","priority":"high"}')
TASK_ID=$(echo "$RESPONSE" | jq -r '.data.id')
STATUS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$STATUS" = "true" ] && [ -n "$TASK_ID" ]; then
  echo "[PASS] Create Task"
  ((PASS++))
else
  echo "[FAIL] Create Task"
  ((FAIL++))
fi

# Test 6: List Tasks
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/tasks" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "List Tasks" 200 "$STATUS"

# Test 7: Update Task
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X PUT "$BASE_URL/api/v1/tasks/$TASK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"in_progress"}')
test_endpoint "Update Task" 200 "$STATUS"

# Test 8: Delete Task
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE "$BASE_URL/api/v1/tasks/$TASK_ID" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "Delete Task" 200 "$STATUS"

echo "========================================"
echo "Results: $PASS passed, $FAIL failed"
```

---

## QA Sign-Off Checklist

- [ ] All registration tests pass
- [ ] All login tests pass
- [ ] All task CRUD tests pass
- [ ] Authorization properly enforced
- [ ] Error responses are consistent
- [ ] Pagination works correctly
- [ ] Filtering works correctly
- [ ] Token refresh works
- [ ] No sensitive data exposed in responses
- [ ] Performance acceptable (<300ms for API calls)

---

## Bug Report Template

```markdown
## Bug Report

**Test Case**: [e.g., Test 1.3: Invalid Email Format]
**Severity**: [Critical/High/Medium/Low]
**Status**: [Open/In Progress/Resolved]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happened]

### Steps to Reproduce
1. [Step 1]
2. [Step 2]

### Request
```bash
curl -X POST ...
```

### Response
```json
{...}
```

### Environment
- OS: [e.g., macOS 14.0]
- Node.js: [e.g., 20.11.0]
- Docker: [e.g., 24.0.7]
```
