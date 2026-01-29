# TaskFlow API Curl Examples

**Version:** 1.0
**Last Updated:** 2026-01-29

Ready-to-run curl commands for all TaskFlow API endpoints.

---

## Setup

Set the base URL for your environment:

```bash
# Development
export API_URL="http://localhost:3000/api/v1"

# Production
export API_URL="https://api.taskflow.app/api/v1"

# Cookie file for session persistence
export COOKIE_FILE="/tmp/taskflow-cookies.txt"
```

---

## 1. Health Check

```bash
# Check API health
curl -X GET "$API_URL/health" \
  -H "Content-Type: application/json"

# Expected Response:
# {
#   "status": "ok",
#   "timestamp": "2026-01-29T10:00:00.000Z",
#   "version": "1.0.0"
# }
```

---

## 2. Authentication

### Register New User

```bash
# Register a new account
curl -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -c "$COOKIE_FILE" \
  -d '{
    "email": "alex@example.com",
    "password": "SecurePass123!",
    "name": "Alex Developer"
  }'

# Expected Response (201):
# {
#   "data": {
#     "id": "550e8400-e29b-41d4-a716-446655440000",
#     "email": "alex@example.com",
#     "name": "Alex Developer",
#     "createdAt": "2026-01-29T10:00:00.000Z"
#   }
# }
```

### Login

```bash
# Login with credentials
curl -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -c "$COOKIE_FILE" \
  -d '{
    "email": "alex@example.com",
    "password": "SecurePass123!"
  }'

# Expected Response (200):
# {
#   "data": {
#     "id": "550e8400-e29b-41d4-a716-446655440000",
#     "email": "alex@example.com",
#     "name": "Alex Developer"
#   }
# }
```

### Get Current User

```bash
# Get authenticated user info
curl -X GET "$API_URL/auth/me" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# Expected Response (200):
# {
#   "data": {
#     "id": "550e8400-e29b-41d4-a716-446655440000",
#     "email": "alex@example.com",
#     "name": "Alex Developer",
#     "createdAt": "2026-01-29T10:00:00.000Z"
#   }
# }
```

### Refresh Token

```bash
# Refresh access token
curl -X POST "$API_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE" \
  -c "$COOKIE_FILE"

# Expected Response (200): No body, new cookies set
```

### Logout

```bash
# Logout user
curl -X POST "$API_URL/auth/logout" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# Expected Response (200):
# {
#   "data": {
#     "message": "Logged out successfully"
#   }
# }
```

---

## 3. Tasks

### List Tasks

```bash
# List all tasks
curl -X GET "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# List with filters
curl -X GET "$API_URL/tasks?status=pending&priority=high&page=1&limit=10" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# Search tasks
curl -X GET "$API_URL/tasks?search=review" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# Sort by due date
curl -X GET "$API_URL/tasks?sortBy=dueDate&sortOrder=asc" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# Filter by project
curl -X GET "$API_URL/tasks?projectId=550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# Expected Response (200):
# {
#   "data": [
#     {
#       "id": "task-uuid",
#       "title": "Review pull request",
#       "status": "pending",
#       "priority": "high",
#       "dueDate": "2026-01-30T17:00:00.000Z",
#       "createdAt": "2026-01-29T10:00:00.000Z"
#     }
#   ],
#   "meta": {
#     "total": 45,
#     "page": 1,
#     "limit": 20,
#     "totalPages": 3
#   }
# }
```

### Get Single Task

```bash
# Get task by ID
curl -X GET "$API_URL/tasks/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# Expected Response (200):
# {
#   "data": {
#     "id": "550e8400-e29b-41d4-a716-446655440000",
#     "title": "Review pull request",
#     "description": "Check the auth implementation PR",
#     "status": "pending",
#     "priority": "high",
#     "dueDate": "2026-01-30T17:00:00.000Z",
#     "project": {
#       "id": "project-uuid",
#       "name": "Acme Corp",
#       "color": "#3B82F6"
#     }
#   }
# }
```

### Create Task

```bash
# Create task with all fields
curl -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE" \
  -d '{
    "title": "Review pull request",
    "description": "Check the auth implementation PR",
    "dueDate": "2026-01-30T17:00:00.000Z",
    "priority": "high",
    "projectId": "project-uuid"
  }'

# Create minimal task (title only)
curl -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE" \
  -d '{
    "title": "Quick task"
  }'

# Expected Response (201):
# {
#   "data": {
#     "id": "new-task-uuid",
#     "title": "Review pull request",
#     "status": "pending",
#     "priority": "high",
#     "createdAt": "2026-01-29T10:00:00.000Z"
#   }
# }
```

### Update Task

```bash
# Update task status
curl -X PATCH "$API_URL/tasks/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE" \
  -d '{
    "status": "in_progress"
  }'

# Update multiple fields
curl -X PATCH "$API_URL/tasks/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE" \
  -d '{
    "title": "Updated title",
    "priority": "urgent",
    "dueDate": "2026-01-31T12:00:00.000Z"
  }'

# Expected Response (200):
# {
#   "data": {
#     "id": "550e8400-e29b-41d4-a716-446655440000",
#     "title": "Updated title",
#     "status": "in_progress",
#     "updatedAt": "2026-01-29T11:00:00.000Z"
#   }
# }
```

### Delete Task

```bash
# Delete task
curl -X DELETE "$API_URL/tasks/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# Expected Response: 204 No Content
```

### Toggle Task Completion

```bash
# Mark task as complete (or incomplete if already complete)
curl -X PATCH "$API_URL/tasks/550e8400-e29b-41d4-a716-446655440000/complete" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# Expected Response (200):
# {
#   "data": {
#     "id": "550e8400-e29b-41d4-a716-446655440000",
#     "status": "completed",
#     "completedAt": "2026-01-29T11:00:00.000Z"
#   }
# }
```

---

## 4. Projects (v1.1)

### List Projects

```bash
# List all projects
curl -X GET "$API_URL/projects" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# Expected Response (200):
# {
#   "data": [
#     {
#       "id": "project-uuid",
#       "name": "Acme Corp Website",
#       "description": "Client website redesign",
#       "color": "#3B82F6",
#       "taskCount": 12,
#       "completedCount": 5
#     }
#   ]
# }
```

### Create Project

```bash
# Create project
curl -X POST "$API_URL/projects" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE" \
  -d '{
    "name": "Acme Corp Website",
    "description": "Client website redesign",
    "color": "#3B82F6"
  }'

# Expected Response (201):
# {
#   "data": {
#     "id": "new-project-uuid",
#     "name": "Acme Corp Website",
#     "description": "Client website redesign",
#     "color": "#3B82F6"
#   }
# }
```

### Update Project

```bash
# Update project
curl -X PATCH "$API_URL/projects/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE" \
  -d '{
    "name": "Acme Corp Website v2",
    "color": "#10B981"
  }'

# Expected Response (200):
# {
#   "data": {
#     "id": "550e8400-e29b-41d4-a716-446655440000",
#     "name": "Acme Corp Website v2",
#     "color": "#10B981"
#   }
# }
```

### Delete Project

```bash
# Delete project (tasks will have projectId set to null)
curl -X DELETE "$API_URL/projects/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# Expected Response: 204 No Content
```

---

## 5. Error Response Examples

### Validation Error (400)

```bash
# Empty title
curl -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE" \
  -d '{"title": ""}'

# Response:
# {
#   "error": {
#     "code": "VALIDATION_ERROR",
#     "message": "Validation failed",
#     "details": [
#       { "field": "title", "message": "String must contain at least 1 character(s)" }
#     ]
#   }
# }
```

### Unauthorized (401)

```bash
# Request without auth cookies
curl -X GET "$API_URL/tasks" \
  -H "Content-Type: application/json"

# Response:
# {
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "Authentication required"
#   }
# }
```

### Not Found (404)

```bash
# Non-existent task
curl -X GET "$API_URL/tasks/00000000-0000-0000-0000-000000000000" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE"

# Response:
# {
#   "error": {
#     "code": "NOT_FOUND",
#     "message": "Task not found"
#   }
# }
```

---

## 6. Helper Scripts

### Full Test Workflow

```bash
#!/bin/bash
# test-api.sh - Full API test workflow

API_URL="http://localhost:3000/api/v1"
COOKIE_FILE="/tmp/taskflow-test-cookies.txt"

echo "1. Health check..."
curl -s "$API_URL/health" | jq .

echo "2. Register user..."
curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -c "$COOKIE_FILE" \
  -d '{"email": "test@example.com", "password": "Test1234!", "name": "Test User"}' | jq .

echo "3. Create task..."
TASK=$(curl -s -X POST "$API_URL/tasks" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE" \
  -d '{"title": "Test task", "priority": "high"}')
echo "$TASK" | jq .
TASK_ID=$(echo "$TASK" | jq -r '.data.id')

echo "4. List tasks..."
curl -s "$API_URL/tasks" -b "$COOKIE_FILE" | jq .

echo "5. Complete task..."
curl -s -X PATCH "$API_URL/tasks/$TASK_ID/complete" \
  -H "Content-Type: application/json" \
  -b "$COOKIE_FILE" | jq .

echo "6. Delete task..."
curl -s -X DELETE "$API_URL/tasks/$TASK_ID" -b "$COOKIE_FILE"
echo "Done!"

echo "7. Logout..."
curl -s -X POST "$API_URL/auth/logout" -b "$COOKIE_FILE" | jq .

# Cleanup
rm -f "$COOKIE_FILE"
echo "All tests completed!"
```

---

## 7. Cross-References

- **API Reference:** See `docs/api/reference.md`
- **Authentication Flow:** See `docs/flows/authentication-flow.md`
- **QA Test Suite:** See `docs/testing/api-test-suite.md` (future)

---

*This document is maintained by the API team. Last updated: 2026-01-29*
