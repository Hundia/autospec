# DataHub API Gateway - API Reference

## Overview

This document provides the complete API reference for the DataHub API Gateway. All endpoints use JSON for request and response bodies.

**Base URL**: `https://api.datahub.example.com`

**API Version**: v1

---

## Authentication

All API endpoints (except health checks) require authentication via API key.

### Headers

| Header | Format | Example |
|--------|--------|---------|
| X-API-Key | `dh_{env}_{key}` | `X-API-Key: dh_live_abc123xyz789...` |
| Authorization | `Bearer {key}` | `Authorization: Bearer dh_live_abc123...` |

### Response Headers (All Requests)

| Header | Description |
|--------|-------------|
| X-Request-Id | Unique request identifier for tracing |
| X-RateLimit-Limit | Maximum requests in current window |
| X-RateLimit-Remaining | Remaining requests in current window |
| X-RateLimit-Reset | Unix timestamp when limit resets |

---

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "requestId": "req_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": { ... }
  },
  "meta": {
    "requestId": "req_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 156,
    "totalPages": 8
  },
  "meta": { ... }
}
```

---

## Health Endpoints

Health check endpoints do not require authentication.

### GET /health

Returns basic health status.

**Response**: `200 OK`

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /health/ready

Returns readiness status including dependency checks.

**Response**: `200 OK` (healthy) or `503 Service Unavailable`

```json
{
  "status": "ready",
  "checks": {
    "database": "connected",
    "redis": "connected"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### GET /health/live

Returns liveness status with uptime information.

**Response**: `200 OK`

```json
{
  "status": "alive",
  "uptime": 86400,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## API Keys

### POST /api/v1/keys

Creates a new API key.

**Required Scope**: `write:keys` or `admin`

**Request Body**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Key name (3-100 chars) |
| description | string | No | Key description |
| scopes | string[] | Yes | Permission scopes |
| rateLimit | object | No | Custom rate limits |
| expiresAt | string | No | ISO 8601 expiration date |
| metadata | object | No | Custom metadata |

```json
{
  "name": "Production API Key",
  "description": "Used for production backend",
  "scopes": ["read:requests", "write:webhooks"],
  "rateLimit": {
    "requestsPerMinute": 500,
    "requestsPerHour": 25000
  },
  "expiresAt": "2025-01-15T00:00:00Z",
  "metadata": {
    "environment": "production",
    "team": "backend"
  }
}
```

**Response**: `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "apiKey": "dh_live_abc123xyz789def456uvw012...",
    "keyPrefix": "dh_live_abc1...",
    "name": "Production API Key",
    "status": "active",
    "scopes": ["read:requests", "write:webhooks"],
    "rateLimit": {
      "requestsPerMinute": 500,
      "requestsPerHour": 25000,
      "requestsPerDay": 100000
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2025-01-15T00:00:00Z"
  }
}
```

**Note**: The `apiKey` field is only returned on creation. Store it securely.

---

### GET /api/v1/keys

Lists all API keys with pagination.

**Required Scope**: `read:keys` or `admin`

**Query Parameters**:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| pageSize | integer | 20 | Items per page (max 100) |
| status | string | all | Filter by status |
| search | string | | Search in name/description |
| sortBy | string | createdAt | Sort field |
| sortOrder | string | desc | Sort direction (asc/desc) |

**Response**: `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
      "keyPrefix": "dh_live_abc1...",
      "name": "Production API Key",
      "status": "active",
      "scopes": ["read:requests", "write:webhooks"],
      "totalRequests": 15420,
      "lastUsedAt": "2024-01-15T10:28:00Z",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 45,
    "totalPages": 3
  }
}
```

---

### GET /api/v1/keys/:id

Retrieves a single API key by ID.

**Required Scope**: `read:keys` or `admin`

**Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "keyPrefix": "dh_live_abc1...",
    "name": "Production API Key",
    "description": "Used for production backend",
    "status": "active",
    "scopes": ["read:requests", "write:webhooks"],
    "rateLimit": {
      "requestsPerMinute": 500,
      "requestsPerHour": 25000,
      "requestsPerDay": 100000
    },
    "metadata": {
      "environment": "production"
    },
    "totalRequests": 15420,
    "lastUsedAt": "2024-01-15T10:28:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "expiresAt": "2025-01-15T00:00:00Z"
  }
}
```

---

### PUT /api/v1/keys/:id

Updates an existing API key.

**Required Scope**: `write:keys` or `admin`

**Request Body** (all fields optional):

```json
{
  "name": "Updated Key Name",
  "description": "Updated description",
  "scopes": ["read:requests"],
  "metadata": { "team": "platform" }
}
```

**Response**: `200 OK`

---

### DELETE /api/v1/keys/:id

Revokes an API key (soft delete).

**Required Scope**: `write:keys` or `admin`

**Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "status": "revoked",
    "revokedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### POST /api/v1/keys/:id/rotate

Rotates an API key, creating a new key and deprecating the old one.

**Required Scope**: `write:keys` or `admin`

**Request Body**:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| deprecationPeriod | integer | 86400 | Seconds until old key is revoked |

```json
{
  "deprecationPeriod": 3600
}
```

**Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "newKey": {
      "id": "key_02I6Y5Z7A9B0C1D2E3F4G5H6I7",
      "apiKey": "dh_live_newkey123...",
      "keyPrefix": "dh_live_newk...",
      "status": "active"
    },
    "oldKey": {
      "id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
      "status": "deprecated",
      "deprecatedAt": "2024-01-15T10:30:00Z",
      "expiresAt": "2024-01-15T11:30:00Z"
    }
  }
}
```

---

## Request Logs

### GET /api/v1/requests

Lists request logs with filtering.

**Required Scope**: `read:requests` or `admin`

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| keyId | string | Filter by API key ID |
| method | string | Filter by HTTP method |
| path | string | Filter by path (prefix match) |
| status | integer | Filter by status code |
| startDate | string | Start of date range (ISO 8601) |
| endDate | string | End of date range |
| rateLimited | boolean | Filter rate-limited requests |
| page | integer | Page number |
| pageSize | integer | Items per page |

**Response**: `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "req_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
      "apiKeyId": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
      "method": "POST",
      "path": "/api/v1/keys",
      "statusCode": 201,
      "durationMs": 45,
      "ipAddress": "192.168.1.100",
      "rateLimited": false,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": { ... }
}
```

---

### GET /api/v1/requests/:id

Retrieves a single request log with full details.

**Required Scope**: `read:requests` or `admin`

**Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "req_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "apiKeyId": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "method": "POST",
    "path": "/api/v1/keys",
    "queryParams": {},
    "headers": { "content-type": "application/json" },
    "body": { "name": "Test" },
    "statusCode": 201,
    "responseBody": { "success": true, "data": { ... } },
    "durationMs": 45,
    "ipAddress": "192.168.1.100",
    "userAgent": "MyApp/1.0",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

### GET /api/v1/requests/stats

Retrieves request statistics.

**Required Scope**: `read:requests` or `admin`

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| keyId | string | Filter by API key ID |
| period | string | Aggregation period (minute/hour/day) |
| startDate | string | Start of date range |
| endDate | string | End of date range |

**Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRequests": 15420,
      "successfulRequests": 15100,
      "failedRequests": 320,
      "rateLimitedRequests": 85,
      "avgDurationMs": 42,
      "p95DurationMs": 98
    },
    "timeSeries": [
      {
        "timestamp": "2024-01-15T10:00:00Z",
        "requests": 245,
        "errors": 3,
        "avgDurationMs": 38
      }
    ]
  }
}
```

---

## Webhooks

### POST /api/v1/webhooks

Creates a new webhook subscription.

**Required Scope**: `write:webhooks` or `admin`

**Request Body**:

```json
{
  "name": "Security Alerts",
  "url": "https://alerts.example.com/webhook",
  "events": ["key.created", "key.revoked"],
  "secret": "whsec_mysecret123",
  "headers": {
    "X-Custom-Header": "value"
  }
}
```

**Response**: `201 Created`

---

### GET /api/v1/webhooks

Lists webhook subscriptions.

**Required Scope**: `read:webhooks` or `admin`

---

### GET /api/v1/webhooks/:id

Retrieves a single webhook.

**Required Scope**: `read:webhooks` or `admin`

---

### PUT /api/v1/webhooks/:id

Updates a webhook.

**Required Scope**: `write:webhooks` or `admin`

---

### DELETE /api/v1/webhooks/:id

Deletes a webhook.

**Required Scope**: `write:webhooks` or `admin`

---

### POST /api/v1/webhooks/:id/test

Sends a test webhook delivery.

**Required Scope**: `write:webhooks` or `admin`

**Request Body**:

```json
{
  "event": "test.ping",
  "payload": { "test": true }
}
```

**Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "deliveryId": "del_01H5X4Y6Z8...",
    "status": "success",
    "statusCode": 200,
    "durationMs": 150
  }
}
```

---

### GET /api/v1/webhooks/:id/deliveries

Lists webhook delivery history.

**Required Scope**: `read:webhooks` or `admin`

---

## Rate Limits

### GET /api/v1/rate-limits/status

Returns current rate limit status for the authenticated key.

**Required Scope**: Any valid key

**Response**: `200 OK`

```json
{
  "success": true,
  "data": {
    "limits": {
      "perMinute": {
        "limit": 100,
        "remaining": 85,
        "reset": 1705315860
      },
      "perHour": {
        "limit": 5000,
        "remaining": 4950,
        "reset": 1705317600
      },
      "perDay": {
        "limit": 100000,
        "remaining": 99500,
        "reset": 1705363200
      }
    }
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| MISSING_API_KEY | 401 | No API key provided |
| INVALID_API_KEY | 401 | API key invalid/expired/revoked |
| INSUFFICIENT_SCOPE | 403 | Key lacks required scope |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Request validation failed |
| RATE_LIMIT_EXCEEDED | 429 | Rate limit exceeded |
| INTERNAL_ERROR | 500 | Internal server error |

---

## Related Documentation

- [cURL Examples](./curl-examples.md) - Practical usage examples
- [Authentication Flow](../flows/authentication-flow.md) - Auth details
- [User Journeys](../flows/user-journeys.md) - Usage patterns

---

_This document provides the complete API reference for DataHub API Gateway._
