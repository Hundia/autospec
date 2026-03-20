---
title: TaskFlow API Reference
sprint: Sprint 0
created: 2026-03-13
---

# TaskFlow API Reference

## Base URL

```
http://localhost:3000/api/v1
```

In production, replace with your deployed domain.

## Response Envelope

All responses follow a consistent format.

### Success Response

```json
{
  "data": { ... },
  "meta": {
    "timestamp": "2026-03-13T00:00:00.000Z"
  }
}
```

### List Response

```json
{
  "data": [ ... ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "timestamp": "2026-03-13T00:00:00.000Z"
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [ ... ]
  }
}
```

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body/params failed validation |
| `UNAUTHORIZED` | 401 | Not authenticated (missing or invalid token) |
| `FORBIDDEN` | 403 | Authenticated but not authorized |
| `NOT_FOUND` | 404 | Resource does not exist |
| `CONFLICT` | 409 | Resource conflict (e.g. duplicate email) |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## Health Check

### GET /health

Returns the API health status.

**Authentication:** None required

**Request:**
```http
GET /api/v1/health HTTP/1.1
Host: localhost:3000
```

**Response (200 OK):**
```json
{
  "data": {
    "status": "ok",
    "timestamp": "2026-03-13T12:00:00.000Z"
  },
  "meta": {
    "timestamp": "2026-03-13T12:00:00.000Z"
  }
}
```

**Example (curl):**
```bash
curl http://localhost:3000/api/v1/health
```

---

## Authentication (Sprint 1)

The following endpoints will be implemented in Sprint 1.

### POST /auth/register

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "Jane Doe"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "createdAt": "2026-03-13T00:00:00.000Z"
  }
}
```

### POST /auth/login

Login with email and password. Returns JWT in HTTP-only cookie.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Jane Doe"
    }
  }
}
```

### GET /auth/me

Get the currently authenticated user.

**Authentication:** Required (JWT cookie)

**Response (200 OK):**
```json
{
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "Jane Doe",
    "createdAt": "2026-03-13T00:00:00.000Z"
  }
}
```

---

## Tasks (Sprint 1)

The following endpoints will be implemented in Sprint 1.

### GET /tasks

List tasks for the authenticated user.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | string | - | Filter: `pending`, `in_progress`, `completed` |
| `priority` | string | - | Filter: `low`, `medium`, `high`, `urgent` |
| `projectId` | uuid | - | Filter by project |
| `search` | string | - | Search in title/description |
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max 100) |
| `sortBy` | string | `createdAt` | Sort field |
| `sortOrder` | string | `desc` | `asc` or `desc` |

### POST /tasks

Create a new task.

**Request Body:**
```json
{
  "title": "Review pull request",
  "description": "Check the auth implementation PR",
  "dueDate": "2026-01-25T17:00:00Z",
  "priority": "high",
  "projectId": "uuid-optional"
}
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "uuid",
    "title": "Review pull request",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-01-25T17:00:00Z",
    "userId": "user-uuid",
    "createdAt": "2026-03-13T00:00:00.000Z",
    "updatedAt": "2026-03-13T00:00:00.000Z"
  }
}
```

### PATCH /tasks/:id

Update a task by ID.

### DELETE /tasks/:id

Delete a task by ID. Returns 204 No Content.

### PATCH /tasks/:id/complete

Toggle task completion status.
