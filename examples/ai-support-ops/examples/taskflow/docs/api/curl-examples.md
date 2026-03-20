# TaskFlow API curl Examples

## Overview

This document provides ready-to-run curl commands for all TaskFlow API endpoints. All examples use the local development server. Replace `localhost:3001` with your environment URL.

---

## Quick Start

### Set Environment Variables

```bash
# Set base URL
export API_URL="http://localhost:3001/api/v1"

# After login, set your token
export TOKEN="your_access_token_here"
```

---

## Authentication

### Register New User

```bash
curl -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePassword123!",
    "name": "New User"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_abc123",
      "email": "newuser@example.com",
      "name": "New User"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Login

```bash
curl -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

**Save the token:**
```bash
export TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### Get Current User

```bash
curl "${API_URL}/auth/me" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Refresh Token

```bash
curl -X POST "${API_URL}/auth/refresh" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -c cookies.txt
```

### Logout

```bash
curl -X POST "${API_URL}/auth/logout" \
  -H "Authorization: Bearer ${TOKEN}" \
  -b cookies.txt
```

### Forgot Password

```bash
curl -X POST "${API_URL}/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

### Reset Password

```bash
curl -X POST "${API_URL}/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset_token_from_email",
    "password": "NewSecurePassword123!"
  }'
```

---

## Tasks

### List All Tasks

```bash
curl "${API_URL}/tasks" \
  -H "Authorization: Bearer ${TOKEN}"
```

### List Tasks with Pagination

```bash
curl "${API_URL}/tasks?page=1&limit=10" \
  -H "Authorization: Bearer ${TOKEN}"
```

### List Tasks with Filters

```bash
# Filter by status
curl "${API_URL}/tasks?status=pending" \
  -H "Authorization: Bearer ${TOKEN}"

# Filter by project
curl "${API_URL}/tasks?projectId=proj_xyz789" \
  -H "Authorization: Bearer ${TOKEN}"

# Filter by label
curl "${API_URL}/tasks?labelId=lbl_abc123" \
  -H "Authorization: Bearer ${TOKEN}"

# Multiple filters
curl "${API_URL}/tasks?status=pending&priority=high&projectId=proj_xyz789" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Search Tasks

```bash
curl "${API_URL}/tasks?search=documentation" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Sort Tasks

```bash
# Sort by due date ascending
curl "${API_URL}/tasks?sortBy=dueDate&sortOrder=asc" \
  -H "Authorization: Bearer ${TOKEN}"

# Sort by priority descending
curl "${API_URL}/tasks?sortBy=priority&sortOrder=desc" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Create Task

```bash
curl -X POST "${API_URL}/tasks" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete API documentation",
    "description": "Write comprehensive documentation for all API endpoints",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-20T00:00:00Z",
    "projectId": "proj_xyz789"
  }'
```

### Create Task with Labels

```bash
curl -X POST "${API_URL}/tasks" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Urgent bug fix",
    "description": "Fix critical login issue",
    "status": "pending",
    "priority": "high",
    "labelIds": ["lbl_urgent", "lbl_bug"]
  }'
```

### Get Task by ID

```bash
curl "${API_URL}/tasks/task_abc123" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Update Task

```bash
curl -X PUT "${API_URL}/tasks/task_abc123" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "description": "Updated description",
    "priority": "medium"
  }'
```

### Update Task Status

```bash
curl -X PATCH "${API_URL}/tasks/task_abc123/status" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### Delete Task

```bash
curl -X DELETE "${API_URL}/tasks/task_abc123" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Add Label to Task

```bash
curl -X POST "${API_URL}/tasks/task_abc123/labels" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "labelId": "lbl_urgent"
  }'
```

### Remove Label from Task

```bash
curl -X DELETE "${API_URL}/tasks/task_abc123/labels/lbl_urgent" \
  -H "Authorization: Bearer ${TOKEN}"
```

---

## Projects

### List All Projects

```bash
curl "${API_URL}/projects" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Create Project

```bash
curl -X POST "${API_URL}/projects" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Documentation",
    "description": "All documentation-related tasks",
    "color": "#3b82f6"
  }'
```

### Get Project by ID

```bash
curl "${API_URL}/projects/proj_xyz789" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Update Project

```bash
curl -X PUT "${API_URL}/projects/proj_xyz789" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Project Name",
    "description": "Updated description",
    "color": "#10b981"
  }'
```

### Delete Project

```bash
curl -X DELETE "${API_URL}/projects/proj_xyz789" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Get Project Tasks

```bash
curl "${API_URL}/projects/proj_xyz789/tasks" \
  -H "Authorization: Bearer ${TOKEN}"
```

---

## Labels

### List All Labels

```bash
curl "${API_URL}/labels" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Create Label

```bash
curl -X POST "${API_URL}/labels" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "urgent",
    "color": "#ef4444"
  }'
```

### Get Label by ID

```bash
curl "${API_URL}/labels/lbl_abc123" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Update Label

```bash
curl -X PUT "${API_URL}/labels/lbl_abc123" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "critical",
    "color": "#dc2626"
  }'
```

### Delete Label

```bash
curl -X DELETE "${API_URL}/labels/lbl_abc123" \
  -H "Authorization: Bearer ${TOKEN}"
```

---

## User Profile

### Get Profile

```bash
curl "${API_URL}/users/profile" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Update Profile

```bash
curl -X PUT "${API_URL}/users/profile" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

### Change Password

```bash
curl -X PUT "${API_URL}/users/password" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "OldPassword123!",
    "newPassword": "NewPassword123!"
  }'
```

### Get Preferences

```bash
curl "${API_URL}/users/preferences" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Update Preferences

```bash
curl -X PUT "${API_URL}/users/preferences" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "theme": "dark",
    "emailNotifications": true,
    "timezone": "America/New_York"
  }'
```

### Delete Account

```bash
curl -X DELETE "${API_URL}/users/account" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "YourPassword123!",
    "confirmation": "DELETE"
  }'
```

---

## Utility Endpoints

### Health Check

```bash
curl "${API_URL/api\/v1/}/health"
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### API Status

```bash
curl "${API_URL}/status"
```

**Response:**
```json
{
  "version": "1.0.0",
  "environment": "development"
}
```

---

## Complete Workflow Example

### Full Task Management Workflow

```bash
#!/bin/bash
# Complete workflow script

API_URL="http://localhost:3001/api/v1"

# 1. Login and get token
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')
echo "Token obtained: ${TOKEN:0:20}..."

# 2. Create a project
echo "Creating project..."
PROJECT_RESPONSE=$(curl -s -X POST "${API_URL}/projects" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Project",
    "color": "#3b82f6"
  }')

PROJECT_ID=$(echo $PROJECT_RESPONSE | jq -r '.data.id')
echo "Project created: ${PROJECT_ID}"

# 3. Create a label
echo "Creating label..."
LABEL_RESPONSE=$(curl -s -X POST "${API_URL}/labels" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "important",
    "color": "#ef4444"
  }')

LABEL_ID=$(echo $LABEL_RESPONSE | jq -r '.data.id')
echo "Label created: ${LABEL_ID}"

# 4. Create a task in the project
echo "Creating task..."
TASK_RESPONSE=$(curl -s -X POST "${API_URL}/tasks" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Complete documentation\",
    \"description\": \"Write API docs\",
    \"projectId\": \"${PROJECT_ID}\",
    \"labelIds\": [\"${LABEL_ID}\"],
    \"priority\": \"high\"
  }")

TASK_ID=$(echo $TASK_RESPONSE | jq -r '.data.id')
echo "Task created: ${TASK_ID}"

# 5. Update task status to in_progress
echo "Updating task status..."
curl -s -X PATCH "${API_URL}/tasks/${TASK_ID}/status" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'

# 6. List all tasks
echo "Listing tasks..."
curl -s "${API_URL}/tasks" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.data.tasks'

# 7. Complete the task
echo "Completing task..."
curl -s -X PATCH "${API_URL}/tasks/${TASK_ID}/status" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"status": "completed"}'

echo "Workflow complete!"
```

---

## Error Handling Examples

### Handle 401 Unauthorized

```bash
# When you get a 401, refresh your token
RESPONSE=$(curl -s -w "\n%{http_code}" "${API_URL}/tasks" \
  -H "Authorization: Bearer ${TOKEN}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "401" ]; then
  echo "Token expired, refreshing..."
  NEW_TOKEN=$(curl -s -X POST "${API_URL}/auth/refresh" \
    -b cookies.txt -c cookies.txt | jq -r '.data.accessToken')
  export TOKEN=$NEW_TOKEN
fi
```

### Handle 429 Rate Limit

```bash
# Check rate limit headers
curl -s -D headers.txt "${API_URL}/tasks" \
  -H "Authorization: Bearer ${TOKEN}" > /dev/null

REMAINING=$(grep -i "X-RateLimit-Remaining" headers.txt | cut -d' ' -f2 | tr -d '\r')
echo "Requests remaining: ${REMAINING}"

if [ "$REMAINING" -lt "5" ]; then
  echo "Approaching rate limit, waiting..."
  sleep 60
fi
```

---

## Tips

### Pretty Print JSON

```bash
curl "${API_URL}/tasks" \
  -H "Authorization: Bearer ${TOKEN}" | jq '.'
```

### Save Response to File

```bash
curl "${API_URL}/tasks" \
  -H "Authorization: Bearer ${TOKEN}" \
  -o tasks.json
```

### Verbose Mode (Debugging)

```bash
curl -v "${API_URL}/tasks" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Timing Information

```bash
curl -w "@curl-format.txt" -o /dev/null -s "${API_URL}/tasks" \
  -H "Authorization: Bearer ${TOKEN}"

# curl-format.txt:
#      time_total:  %{time_total}s\n
#      time_connect:  %{time_connect}s\n
```

---

## Related Documents

- [API Reference](./reference.md)
- [Authentication](./authentication.md)
- [Error Codes](./error-codes.md)
