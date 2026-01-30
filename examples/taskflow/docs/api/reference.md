# TaskFlow API Reference

## Overview

The TaskFlow API is a RESTful JSON API that provides programmatic access to task management functionality. All endpoints require authentication unless otherwise noted.

---

## Base URL

| Environment | Base URL |
|-------------|----------|
| Development | `http://localhost:3001/api/v1` |
| Staging | `https://staging-api.taskflow.app/api/v1` |
| Production | `https://api.taskflow.app/api/v1` |

---

## API Architecture

```mermaid
flowchart LR
    CLIENT[Client] --> AUTH{Authenticated?}
    AUTH -->|No| LOGIN[/auth/login]
    AUTH -->|Yes| API[API Endpoints]

    API --> TASKS[/tasks]
    API --> PROJECTS[/projects]
    API --> LABELS[/labels]
    API --> USERS[/users]

    subgraph Response
        SUCCESS[200 OK]
        ERROR[4xx/5xx Error]
    end

    TASKS --> Response
    PROJECTS --> Response
    LABELS --> Response
    USERS --> Response
```

---

## Endpoint Summary

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| POST | `/auth/refresh` | Refresh access token | No |
| POST | `/auth/logout` | Logout user | Yes |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password | No |
| GET | `/auth/me` | Get current user | Yes |

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/tasks` | List all tasks | Yes |
| POST | `/tasks` | Create new task | Yes |
| GET | `/tasks/:id` | Get task by ID | Yes |
| PUT | `/tasks/:id` | Update task | Yes |
| DELETE | `/tasks/:id` | Delete task | Yes |
| PATCH | `/tasks/:id/status` | Update task status | Yes |
| POST | `/tasks/:id/labels` | Add label to task | Yes |
| DELETE | `/tasks/:id/labels/:labelId` | Remove label from task | Yes |

### Projects

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/projects` | List all projects | Yes |
| POST | `/projects` | Create new project | Yes |
| GET | `/projects/:id` | Get project by ID | Yes |
| PUT | `/projects/:id` | Update project | Yes |
| DELETE | `/projects/:id` | Delete project | Yes |
| GET | `/projects/:id/tasks` | Get project tasks | Yes |

### Labels

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/labels` | List all labels | Yes |
| POST | `/labels` | Create new label | Yes |
| GET | `/labels/:id` | Get label by ID | Yes |
| PUT | `/labels/:id` | Update label | Yes |
| DELETE | `/labels/:id` | Delete label | Yes |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Get user profile | Yes |
| PUT | `/users/profile` | Update user profile | Yes |
| PUT | `/users/password` | Change password | Yes |
| DELETE | `/users/account` | Delete account | Yes |
| GET | `/users/preferences` | Get preferences | Yes |
| PUT | `/users/preferences` | Update preferences | Yes |

---

## Request/Response Format

### Request Headers

```http
Content-Type: application/json
Authorization: Bearer <access_token>
Accept: application/json
X-Request-ID: <optional-correlation-id>
```

### Response Format

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "title",
        "message": "Title is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

---

## Detailed Endpoints

### Tasks

#### List Tasks

```
GET /tasks
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page (max 100) |
| status | string | - | Filter by status |
| projectId | string | - | Filter by project |
| labelId | string | - | Filter by label |
| search | string | - | Search in title/description |
| sortBy | string | createdAt | Sort field |
| sortOrder | string | desc | Sort direction (asc/desc) |

**Response:**

```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task_abc123",
        "title": "Complete API documentation",
        "description": "Write comprehensive API docs",
        "status": "in_progress",
        "priority": "high",
        "dueDate": "2024-01-20T00:00:00Z",
        "projectId": "proj_xyz789",
        "labels": [
          { "id": "lbl_001", "name": "documentation", "color": "#3b82f6" }
        ],
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T14:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

#### Create Task

```
POST /tasks
```

**Request Body:**

```json
{
  "title": "Complete API documentation",
  "description": "Write comprehensive API docs",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-20T00:00:00Z",
  "projectId": "proj_xyz789",
  "labelIds": ["lbl_001", "lbl_002"]
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "task_abc123",
    "title": "Complete API documentation",
    "description": "Write comprehensive API docs",
    "status": "pending",
    "priority": "high",
    "dueDate": "2024-01-20T00:00:00Z",
    "projectId": "proj_xyz789",
    "labels": [...],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Task

```
GET /tasks/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "task_abc123",
    "title": "Complete API documentation",
    "description": "Write comprehensive API docs",
    "status": "in_progress",
    "priority": "high",
    "dueDate": "2024-01-20T00:00:00Z",
    "project": {
      "id": "proj_xyz789",
      "name": "Documentation"
    },
    "labels": [...],
    "createdBy": {
      "id": "user_123",
      "name": "John Doe"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T14:00:00Z"
  }
}
```

#### Update Task

```
PUT /tasks/:id
```

**Request Body:**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed",
  "priority": "medium",
  "dueDate": "2024-01-25T00:00:00Z"
}
```

#### Delete Task

```
DELETE /tasks/:id
```

**Response:** `204 No Content`

---

### Projects

#### Create Project

```
POST /projects
```

**Request Body:**

```json
{
  "name": "Documentation",
  "description": "All documentation tasks",
  "color": "#3b82f6"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "proj_xyz789",
    "name": "Documentation",
    "description": "All documentation tasks",
    "color": "#3b82f6",
    "taskCount": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### Labels

#### Create Label

```
POST /labels
```

**Request Body:**

```json
{
  "name": "urgent",
  "color": "#ef4444"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "lbl_abc123",
    "name": "urgent",
    "color": "#ef4444",
    "taskCount": 0,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## Data Models

### Task

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | - | Unique identifier (auto-generated) |
| title | string | Yes | Task title (1-255 chars) |
| description | string | No | Task description (max 5000 chars) |
| status | enum | No | pending, in_progress, completed |
| priority | enum | No | low, medium, high |
| dueDate | datetime | No | Due date (ISO 8601) |
| projectId | string | No | Associated project ID |
| labelIds | string[] | No | Associated label IDs |

### Project

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | - | Unique identifier |
| name | string | Yes | Project name (1-100 chars) |
| description | string | No | Project description |
| color | string | No | Hex color code |

### Label

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | - | Unique identifier |
| name | string | Yes | Label name (1-50 chars) |
| color | string | Yes | Hex color code |

---

## Pagination

All list endpoints support pagination:

```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Filtering & Sorting

### Filter Examples

```bash
# Filter by status
GET /tasks?status=pending

# Filter by multiple values
GET /tasks?status=pending,in_progress

# Filter by project
GET /tasks?projectId=proj_xyz789

# Search
GET /tasks?search=documentation

# Date range
GET /tasks?dueDateFrom=2024-01-01&dueDateTo=2024-01-31
```

### Sort Examples

```bash
# Sort by due date
GET /tasks?sortBy=dueDate&sortOrder=asc

# Sort by priority
GET /tasks?sortBy=priority&sortOrder=desc
```

---

## Related Documents

- [Authentication](./authentication.md)
- [Error Codes](./error-codes.md)
- [Rate Limiting](./rate-limiting.md)
- [curl Examples](./curl-examples.md)
