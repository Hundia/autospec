# TaskFlow API Reference

**Version:** 1.0
**Base URL:** `/api/v1`
**Last Updated:** 2026-01-29

---

## 1. API Overview

TaskFlow provides a RESTful API for task and project management.

### Base URL

```
Development: http://localhost:3000/api/v1
Production:  https://api.taskflow.app/api/v1
```

### Authentication

All endpoints except `/auth/register` and `/auth/login` require authentication via HTTP-only cookies set during login.

### Response Format

**Success Response:**
```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2026-01-29T10:00:00.000Z"
  }
}
```

**List Response:**
```json
{
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

**Error Response:**
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": [ ... ]
  }
}
```

---

## 2. Authentication Endpoints

### POST /auth/register

Create a new user account.

| Property | Value |
|----------|-------|
| Method | POST |
| Path | /auth/register |
| Auth Required | No |
| Rate Limit | 5/minute |

**Request Body:**

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| email | string | Yes | Valid email format |
| password | string | Yes | Min 8 chars, 1 uppercase, 1 number |
| name | string | Yes | 1-100 characters |

**Request:**
```json
{
  "email": "alex@example.com",
  "password": "SecurePass123!",
  "name": "Alex Developer"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "alex@example.com",
    "name": "Alex Developer",
    "createdAt": "2026-01-29T10:00:00.000Z"
  }
}
```

**Errors:**

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Invalid input data |
| CONFLICT | 409 | Email already exists |

---

### POST /auth/login

Authenticate user and receive tokens.

| Property | Value |
|----------|-------|
| Method | POST |
| Path | /auth/login |
| Auth Required | No |
| Rate Limit | 5/minute |

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| email | string | Yes |
| password | string | Yes |

**Request:**
```json
{
  "email": "alex@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "alex@example.com",
    "name": "Alex Developer"
  }
}
```

**Cookies Set:**
- `accessToken` - JWT access token (15 min expiry)
- `refreshToken` - JWT refresh token (7 day expiry)

**Errors:**

| Code | Status | Description |
|------|--------|-------------|
| INVALID_CREDENTIALS | 401 | Wrong email or password |
| RATE_LIMITED | 429 | Too many attempts |

---

### POST /auth/logout

Logout user and invalidate tokens.

| Property | Value |
|----------|-------|
| Method | POST |
| Path | /auth/logout |
| Auth Required | Yes |

**Response (200):**
```json
{
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

### POST /auth/refresh

Refresh access token using refresh token.

| Property | Value |
|----------|-------|
| Method | POST |
| Path | /auth/refresh |
| Auth Required | Refresh token cookie |
| Rate Limit | 10/minute |

**Response (200):**

New cookies are set. No response body.

**Errors:**

| Code | Status | Description |
|------|--------|-------------|
| INVALID_TOKEN | 401 | Invalid or expired refresh token |

---

### GET /auth/me

Get current authenticated user.

| Property | Value |
|----------|-------|
| Method | GET |
| Path | /auth/me |
| Auth Required | Yes |

**Response (200):**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "alex@example.com",
    "name": "Alex Developer",
    "createdAt": "2026-01-29T10:00:00.000Z"
  }
}
```

---

## 3. Task Endpoints

### GET /tasks

List authenticated user's tasks with filtering and pagination.

| Property | Value |
|----------|-------|
| Method | GET |
| Path | /tasks |
| Auth Required | Yes |

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| status | string | - | Filter: pending, in_progress, completed |
| priority | string | - | Filter: low, medium, high, urgent |
| projectId | UUID | - | Filter by project |
| search | string | - | Search in title/description |
| page | number | 1 | Page number |
| limit | number | 20 | Items per page (max 100) |
| sortBy | string | createdAt | Sort field: createdAt, dueDate, priority |
| sortOrder | string | desc | Sort order: asc, desc |

**Response (200):**
```json
{
  "data": [
    {
      "id": "task-uuid-1",
      "title": "Review pull request",
      "description": "Check the auth implementation PR",
      "status": "pending",
      "priority": "high",
      "dueDate": "2026-01-30T17:00:00.000Z",
      "completedAt": null,
      "projectId": "project-uuid",
      "project": {
        "id": "project-uuid",
        "name": "Acme Corp",
        "color": "#3B82F6"
      },
      "createdAt": "2026-01-29T10:00:00.000Z",
      "updatedAt": "2026-01-29T10:00:00.000Z"
    }
  ],
  "meta": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### GET /tasks/:id

Get a single task by ID.

| Property | Value |
|----------|-------|
| Method | GET |
| Path | /tasks/:id |
| Auth Required | Yes |

**Response (200):**
```json
{
  "data": {
    "id": "task-uuid",
    "title": "Review pull request",
    "description": "Check the auth implementation PR",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-01-30T17:00:00.000Z",
    "completedAt": null,
    "projectId": "project-uuid",
    "project": {
      "id": "project-uuid",
      "name": "Acme Corp",
      "color": "#3B82F6"
    },
    "createdAt": "2026-01-29T10:00:00.000Z",
    "updatedAt": "2026-01-29T10:00:00.000Z"
  }
}
```

**Errors:**

| Code | Status | Description |
|------|--------|-------------|
| NOT_FOUND | 404 | Task not found |
| FORBIDDEN | 403 | Task belongs to another user |

---

### POST /tasks

Create a new task.

| Property | Value |
|----------|-------|
| Method | POST |
| Path | /tasks |
| Auth Required | Yes |

**Request Body:**

| Field | Type | Required | Default | Constraints |
|-------|------|----------|---------|-------------|
| title | string | Yes | - | 1-255 characters |
| description | string | No | null | Max 5000 characters |
| dueDate | ISO8601 | No | null | Future date |
| priority | string | No | medium | low, medium, high, urgent |
| projectId | UUID | No | null | Must exist and belong to user |

**Request:**
```json
{
  "title": "Review pull request",
  "description": "Check the auth implementation PR",
  "dueDate": "2026-01-30T17:00:00.000Z",
  "priority": "high",
  "projectId": "project-uuid"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "new-task-uuid",
    "title": "Review pull request",
    "description": "Check the auth implementation PR",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-01-30T17:00:00.000Z",
    "completedAt": null,
    "projectId": "project-uuid",
    "createdAt": "2026-01-29T10:00:00.000Z",
    "updatedAt": "2026-01-29T10:00:00.000Z"
  }
}
```

**Errors:**

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Invalid input data |
| NOT_FOUND | 404 | Project not found |

---

### PATCH /tasks/:id

Update an existing task.

| Property | Value |
|----------|-------|
| Method | PATCH |
| Path | /tasks/:id |
| Auth Required | Yes |

**Request Body (all optional):**

| Field | Type | Constraints |
|-------|------|-------------|
| title | string | 1-255 characters |
| description | string | Max 5000 characters |
| status | string | pending, in_progress, completed |
| priority | string | low, medium, high, urgent |
| dueDate | ISO8601 | - |
| projectId | UUID | - |

**Request:**
```json
{
  "status": "in_progress",
  "priority": "urgent"
}
```

**Response (200):**
```json
{
  "data": {
    "id": "task-uuid",
    "title": "Review pull request",
    "status": "in_progress",
    "priority": "urgent",
    "updatedAt": "2026-01-29T11:00:00.000Z"
  }
}
```

---

### DELETE /tasks/:id

Delete a task.

| Property | Value |
|----------|-------|
| Method | DELETE |
| Path | /tasks/:id |
| Auth Required | Yes |

**Response (204):** No content

---

### PATCH /tasks/:id/complete

Toggle task completion status.

| Property | Value |
|----------|-------|
| Method | PATCH |
| Path | /tasks/:id/complete |
| Auth Required | Yes |

**Response (200):**
```json
{
  "data": {
    "id": "task-uuid",
    "status": "completed",
    "completedAt": "2026-01-29T11:00:00.000Z"
  }
}
```

---

## 4. Project Endpoints (v1.1)

### GET /projects

List user's projects.

| Property | Value |
|----------|-------|
| Method | GET |
| Path | /projects |
| Auth Required | Yes |

**Response (200):**
```json
{
  "data": [
    {
      "id": "project-uuid",
      "name": "Acme Corp Website",
      "description": "Client website redesign",
      "color": "#3B82F6",
      "taskCount": 12,
      "completedCount": 5,
      "createdAt": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

---

### POST /projects

Create a new project.

| Property | Value |
|----------|-------|
| Method | POST |
| Path | /projects |
| Auth Required | Yes |

**Request:**
```json
{
  "name": "Acme Corp Website",
  "description": "Client website redesign",
  "color": "#3B82F6"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "new-project-uuid",
    "name": "Acme Corp Website",
    "description": "Client website redesign",
    "color": "#3B82F6",
    "createdAt": "2026-01-29T10:00:00.000Z"
  }
}
```

---

## 5. Health Check

### GET /health

Check API health status.

| Property | Value |
|----------|-------|
| Method | GET |
| Path | /health |
| Auth Required | No |

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2026-01-29T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 6. Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request body validation failed |
| INVALID_CREDENTIALS | 401 | Wrong email or password |
| UNAUTHORIZED | 401 | Missing or invalid token |
| INVALID_TOKEN | 401 | Token expired or malformed |
| FORBIDDEN | 403 | Access denied to resource |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## 7. Cross-References

- **Curl Examples:** See `docs/api/curl-examples.md`
- **Authentication Flow:** See `docs/flows/authentication-flow.md`
- **Backend Spec:** See `specs/02_backend_lead.md`

---

*This document is maintained by the API team. Last updated: 2026-01-29*
