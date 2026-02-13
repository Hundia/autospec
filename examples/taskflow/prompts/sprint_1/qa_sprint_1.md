# TaskFlow - Sprint 1 QA Testing Prompt

## Overview

This document provides comprehensive QA testing procedures for Sprint 1 of TaskFlow, covering projects, tags, dashboard, and enhanced filtering.

**Base URL**: `http://localhost:3000`

---

## Pre-Test Setup

### 1. Verify Sprint 0 Features Still Work

```bash
# Quick regression check
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "testuser@example.com", "password": "Test123!"}'

# Save the token
export TOKEN="<token-from-response>"

# Verify task creation still works
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Regression test task"}'
```

### 2. Create Test User (if needed)

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sprint1test@example.com",
    "password": "Test123!",
    "name": "Sprint 1 Tester"
  }'

export TOKEN="<token-from-response>"
```

---

## Test Suite 1: Project CRUD

### Test 1.1: Create Project with All Fields

```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Website Redesign",
    "description": "Complete overhaul of company website",
    "color": "#8b5cf6"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "name": "Website Redesign",
#     "description": "Complete overhaul of company website",
#     "color": "#8b5cf6",
#     "isArchived": false,
#     "createdAt": "...",
#     "taskCount": 0
#   }
# }

# Save project ID
export PROJECT_ID="<id-from-response>"
```

### Test 1.2: Create Project with Minimum Fields

```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Quick Project"
  }'

# Expected Response (201):
# Should use default color #3b82f6
```

### Test 1.3: Create Project with Invalid Color

```bash
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Invalid Color Project",
    "color": "not-a-color"
  }'

# Expected Response (400):
# {
#   "success": false,
#   "error": {
#     "code": "VALIDATION_ERROR",
#     "details": [{"field": "color", "message": "Invalid color format"}]
#   }
# }
```

### Test 1.4: List Projects

```bash
curl -X GET http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "projects": [
#       {
#         "id": "...",
#         "name": "Website Redesign",
#         "taskCount": 0,
#         "completedCount": 0,
#         "progress": 0
#       }
#     ],
#     "pagination": {...}
#   }
# }
```

### Test 1.5: Get Single Project

```bash
curl -X GET http://localhost:3000/api/v1/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "name": "Website Redesign",
#     ...
#   }
# }
```

### Test 1.6: Update Project

```bash
curl -X PUT http://localhost:3000/api/v1/projects/$PROJECT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Website Redesign v2",
    "color": "#10b981"
  }'

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "name": "Website Redesign v2",
#     "color": "#10b981",
#     ...
#   }
# }
```

### Test 1.7: Archive Project

```bash
curl -X PATCH http://localhost:3000/api/v1/projects/$PROJECT_ID/archive \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "isArchived": true
  }'

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "isArchived": true,
#     ...
#   }
# }
```

### Test 1.8: List Excludes Archived by Default

```bash
curl -X GET http://localhost:3000/api/v1/projects \
  -H "Authorization: Bearer $TOKEN"

# Expected: Archived project should NOT appear in list
```

### Test 1.9: List Include Archived

```bash
curl -X GET "http://localhost:3000/api/v1/projects?includeArchived=true" \
  -H "Authorization: Bearer $TOKEN"

# Expected: Archived project SHOULD appear in list
```

### Test 1.10: Unarchive Project

```bash
curl -X PATCH http://localhost:3000/api/v1/projects/$PROJECT_ID/archive \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "isArchived": false
  }'

# Expected Response (200): isArchived should be false
```

---

## Test Suite 2: Tag CRUD

### Test 2.1: Create Tag

```bash
curl -X POST http://localhost:3000/api/v1/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "urgent",
    "color": "#ef4444"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "name": "urgent",
#     "color": "#ef4444",
#     "taskCount": 0
#   }
# }

export TAG_URGENT_ID="<id-from-response>"
```

### Test 2.2: Create Multiple Tags

```bash
# Bug tag
curl -X POST http://localhost:3000/api/v1/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "bug", "color": "#f59e0b"}'

export TAG_BUG_ID="<id>"

# Feature tag
curl -X POST http://localhost:3000/api/v1/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "feature", "color": "#3b82f6"}'

export TAG_FEATURE_ID="<id>"
```

### Test 2.3: Create Duplicate Tag Name

```bash
curl -X POST http://localhost:3000/api/v1/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "urgent",
    "color": "#000000"
  }'

# Expected Response (409):
# {
#   "success": false,
#   "error": {
#     "code": "CONFLICT",
#     "message": "Tag with this name already exists"
#   }
# }
```

### Test 2.4: List Tags

```bash
curl -X GET http://localhost:3000/api/v1/tags \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "tags": [
#       {"id": "...", "name": "urgent", "color": "#ef4444", "taskCount": 0},
#       {"id": "...", "name": "bug", "color": "#f59e0b", "taskCount": 0}
#     ]
#   }
# }
```

### Test 2.5: Update Tag

```bash
curl -X PUT http://localhost:3000/api/v1/tags/$TAG_URGENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "color": "#dc2626"
  }'

# Expected Response (200):
# Color should be updated
```

---

## Test Suite 3: Task-Tag Assignment

### Test 3.1: Create Task for Tagging

```bash
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Fix critical login bug",
    "description": "Users cannot log in with special characters in password",
    "priority": "urgent",
    "projectId": "'$PROJECT_ID'"
  }'

export TASK_ID="<id-from-response>"
```

### Test 3.2: Add Tags to Task

```bash
curl -X POST http://localhost:3000/api/v1/tasks/$TASK_ID/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "tagIds": ["'$TAG_URGENT_ID'", "'$TAG_BUG_ID'"]
  }'

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "title": "Fix critical login bug",
#     "tags": [
#       {"id": "...", "name": "urgent", "color": "#dc2626"},
#       {"id": "...", "name": "bug", "color": "#f59e0b"}
#     ]
#   }
# }
```

### Test 3.3: Verify Task Has Tags

```bash
curl -X GET http://localhost:3000/api/v1/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected: Task should have tags array with 2 tags
```

### Test 3.4: Remove Tag from Task

```bash
curl -X DELETE http://localhost:3000/api/v1/tasks/$TASK_ID/tags/$TAG_BUG_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "message": "Tag removed from task"
# }

# Verify
curl -X GET http://localhost:3000/api/v1/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected: Task should only have 1 tag (urgent)
```

### Test 3.5: Add Invalid Tag ID

```bash
curl -X POST http://localhost:3000/api/v1/tasks/$TASK_ID/tags \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "tagIds": ["00000000-0000-0000-0000-000000000000"]
  }'

# Expected Response (404):
# {
#   "success": false,
#   "error": {
#     "code": "NOT_FOUND",
#     "message": "One or more tags not found"
#   }
# }
```

### Test 3.6: Tag Count Updates

```bash
# Check tag list - urgent should have taskCount: 1
curl -X GET http://localhost:3000/api/v1/tags \
  -H "Authorization: Bearer $TOKEN"

# Verify taskCount for urgent tag is 1
```

---

## Test Suite 4: Dashboard Statistics

### Test 4.1: Get Dashboard Stats

```bash
curl -X GET http://localhost:3000/api/v1/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "overview": {
#       "total": X,
#       "todo": X,
#       "inProgress": X,
#       "done": X,
#       "overdue": X
#     },
#     "dueThisWeek": X,
#     "completedThisWeek": X,
#     "projects": [
#       {
#         "id": "...",
#         "name": "Website Redesign v2",
#         "taskCount": 1,
#         "completedCount": 0,
#         "progress": 0
#       }
#     ],
#     "priorityBreakdown": {
#       "low": X,
#       "medium": X,
#       "high": X,
#       "urgent": X
#     }
#   }
# }
```

### Test 4.2: Dashboard Stats Accuracy

```bash
# Create tasks with different statuses to verify counts
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Todo task", "status": "todo"}'

curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "In progress task"}'

# Update to in_progress
TASK_IP_ID="<id>"
curl -X PUT http://localhost:3000/api/v1/tasks/$TASK_IP_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "in_progress"}'

# Complete a task
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Done task"}'

TASK_DONE_ID="<id>"
curl -X PUT http://localhost:3000/api/v1/tasks/$TASK_DONE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status": "done"}'

# Verify dashboard stats are accurate
curl -X GET http://localhost:3000/api/v1/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

### Test 4.3: Overdue Task Detection

```bash
# Create task with past due date
curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Overdue task",
    "dueDate": "2025-01-01"
  }'

# Check dashboard - overdue count should increase
curl -X GET http://localhost:3000/api/v1/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"

# Expected: overview.overdue should be >= 1
```

### Test 4.4: Get Activity Feed

```bash
curl -X GET "http://localhost:3000/api/v1/dashboard/activity?limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "activities": [
#       {
#         "id": "...",
#         "type": "task_completed",
#         "taskId": "...",
#         "taskTitle": "Done task",
#         "timestamp": "..."
#       },
#       ...
#     ]
#   }
# }
```

---

## Test Suite 5: Enhanced Task Filtering

### Test 5.1: Filter by Status (Single)

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?status=todo" \
  -H "Authorization: Bearer $TOKEN"

# Expected: All returned tasks have status: "todo"
```

### Test 5.2: Filter by Status (Multiple)

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?status=todo,in_progress" \
  -H "Authorization: Bearer $TOKEN"

# Expected: All returned tasks have status: "todo" OR "in_progress"
```

### Test 5.3: Filter by Priority (Multiple)

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?priority=high,urgent" \
  -H "Authorization: Bearer $TOKEN"

# Expected: All returned tasks have priority: "high" OR "urgent"
```

### Test 5.4: Filter by Project

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?projectId=$PROJECT_ID" \
  -H "Authorization: Bearer $TOKEN"

# Expected: All returned tasks belong to the specified project
```

### Test 5.5: Filter by Tags

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?tagIds=$TAG_URGENT_ID" \
  -H "Authorization: Bearer $TOKEN"

# Expected: All returned tasks have the urgent tag
```

### Test 5.6: Filter by Multiple Tags

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?tagIds=$TAG_URGENT_ID,$TAG_BUG_ID" \
  -H "Authorization: Bearer $TOKEN"

# Expected: Tasks with ANY of the specified tags
```

### Test 5.7: Search by Title

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?search=login" \
  -H "Authorization: Bearer $TOKEN"

# Expected: Tasks containing "login" in title or description
```

### Test 5.8: Filter by Due Date Range

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?dueAfter=2026-01-01&dueBefore=2026-02-01" \
  -H "Authorization: Bearer $TOKEN"

# Expected: Tasks with due date in January 2026
```

### Test 5.9: Combined Filters

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?status=todo&priority=high,urgent&projectId=$PROJECT_ID&search=bug" \
  -H "Authorization: Bearer $TOKEN"

# Expected: Tasks matching ALL filter criteria
```

### Test 5.10: Sorting

```bash
# Sort by due date ascending
curl -X GET "http://localhost:3000/api/v1/tasks?sortBy=dueDate&sortOrder=asc" \
  -H "Authorization: Bearer $TOKEN"

# Sort by priority descending
curl -X GET "http://localhost:3000/api/v1/tasks?sortBy=priority&sortOrder=desc" \
  -H "Authorization: Bearer $TOKEN"
```

### Test 5.11: Pagination with Filters

```bash
curl -X GET "http://localhost:3000/api/v1/tasks?status=todo&page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN"

# Expected: Pagination respects filters
```

---

## Test Suite 6: Project Tasks

### Test 6.1: Get Tasks in Project

```bash
curl -X GET http://localhost:3000/api/v1/projects/$PROJECT_ID/tasks \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "project": {
#       "id": "...",
#       "name": "Website Redesign v2"
#     },
#     "tasks": [...],
#     "pagination": {...}
#   }
# }
```

### Test 6.2: Filter Tasks Within Project

```bash
curl -X GET "http://localhost:3000/api/v1/projects/$PROJECT_ID/tasks?status=todo" \
  -H "Authorization: Bearer $TOKEN"

# Expected: Only todo tasks from the project
```

---

## Test Suite 7: Delete Operations

### Test 7.1: Delete Tag

```bash
curl -X DELETE http://localhost:3000/api/v1/tags/$TAG_FEATURE_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "message": "Tag deleted successfully"
# }
```

### Test 7.2: Delete Project (Tasks Should Remain)

```bash
# First, create a project with tasks
curl -X POST http://localhost:3000/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Project to Delete"}'

DELETE_PROJECT_ID="<id>"

curl -X POST http://localhost:3000/api/v1/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Task in deleted project", "projectId": "'$DELETE_PROJECT_ID'"}'

ORPHAN_TASK_ID="<id>"

# Delete the project
curl -X DELETE http://localhost:3000/api/v1/projects/$DELETE_PROJECT_ID \
  -H "Authorization: Bearer $TOKEN"

# Verify task still exists but project is null
curl -X GET http://localhost:3000/api/v1/tasks/$ORPHAN_TASK_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected: Task exists, projectId should be null
```

---

## Test Suite 8: Authorization Tests

### Test 8.1: Cannot Access Another User's Project

```bash
# Create second user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "otheruser@example.com",
    "password": "Test123!",
    "name": "Other User"
  }'

export TOKEN2="<token>"

# Try to access first user's project
curl -X GET http://localhost:3000/api/v1/projects/$PROJECT_ID \
  -H "Authorization: Bearer $TOKEN2"

# Expected Response (404)
```

### Test 8.2: Cannot Access Another User's Tags

```bash
curl -X GET http://localhost:3000/api/v1/tags/$TAG_URGENT_ID \
  -H "Authorization: Bearer $TOKEN2"

# Expected Response (404)
```

---

## Automated Test Script

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
PASS=0
FAIL=0

# Setup - Get token
RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"Test123!"}')
TOKEN=$(echo "$RESPONSE" | jq -r '.data.accessToken')

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

echo "Starting TaskFlow Sprint 1 QA Tests..."
echo "========================================"

# Project Tests
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/v1/projects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"QA Test Project"}')
test_endpoint "Create Project" 201 "$STATUS"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/projects" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "List Projects" 200 "$STATUS"

# Tag Tests
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/v1/tags" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"qa-test-tag","color":"#ff0000"}')
test_endpoint "Create Tag" 201 "$STATUS"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/tags" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "List Tags" 200 "$STATUS"

# Dashboard Tests
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/dashboard/stats" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "Dashboard Stats" 200 "$STATUS"

# Filter Tests
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/tasks?status=todo,in_progress" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "Filter by Multiple Statuses" 200 "$STATUS"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/tasks?search=test" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "Search Tasks" 200 "$STATUS"

echo "========================================"
echo "Results: $PASS passed, $FAIL failed"
```

---

## QA Sign-Off Checklist

### Project Management
- [ ] Create project works
- [ ] List projects with task counts works
- [ ] Update project works
- [ ] Archive/unarchive project works
- [ ] Delete project preserves tasks
- [ ] User isolation enforced

### Tag Management
- [ ] Create tag works
- [ ] Duplicate tag names rejected
- [ ] Update tag works
- [ ] Delete tag works
- [ ] Tag counts accurate

### Task-Tag Assignment
- [ ] Add tags to task works
- [ ] Remove tag from task works
- [ ] Tags display on task retrieval

### Dashboard
- [ ] Overview stats accurate
- [ ] Project progress calculated correctly
- [ ] Overdue detection works
- [ ] Activity feed works

### Enhanced Filtering
- [ ] Single status filter works
- [ ] Multiple status filter works
- [ ] Priority filter works
- [ ] Project filter works
- [ ] Tag filter works
- [ ] Search works
- [ ] Date range filter works
- [ ] Combined filters work
- [ ] Sorting works
- [ ] Pagination with filters works

### Regression
- [ ] Sprint 0 auth still works
- [ ] Sprint 0 task CRUD still works
- [ ] No breaking API changes
