# DataHub API Gateway - Backend Technical Specification

## Overview

This document provides the complete backend technical specification for DataHub API Gateway. It covers all REST API endpoints, authentication mechanisms, rate limiting implementation, request processing pipeline, and internal service architecture.

**Tech Stack:**

- **Language**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Validation**: Zod
- **Testing**: Jest + Supertest

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DataHub API Gateway                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │   Client    │───▶│   Gateway   │───▶│  Backend    │              │
│  │  Request    │    │   Layer     │    │  Services   │              │
│  └─────────────┘    └─────────────┘    └─────────────┘              │
│                            │                                         │
│         ┌──────────────────┼──────────────────┐                     │
│         ▼                  ▼                  ▼                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │   Redis     │    │ PostgreSQL  │    │  Webhook    │              │
│  │   Cache     │    │  Database   │    │   Queue     │              │
│  └─────────────┘    └─────────────┘    └─────────────┘              │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component     | Responsibility                     |
| ------------- | ---------------------------------- |
| Gateway Layer | Auth, rate limiting, routing       |
| Redis Cache   | Rate limit counters, session cache |
| PostgreSQL    | Persistent storage, audit logs     |
| Webhook Queue | Async webhook delivery             |

---

## API Design Principles

### RESTful Conventions

1. **Resource-Based URLs**: `/api/v1/keys`, `/api/v1/requests`
2. **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (remove)
3. **Status Codes**: Use appropriate HTTP status codes
4. **JSON Responses**: All responses in JSON format
5. **Versioning**: URL-based versioning (`/api/v1/`)

### Standard Response Format

**Success Response:**

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

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Retry after 60 seconds.",
    "details": {
      "limit": 100,
      "remaining": 0,
      "resetAt": "2024-01-15T10:31:00Z"
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

### Pagination Format

```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## API Endpoints

### 1. Health Check Endpoints

#### GET /health

Basic health check for load balancers.

**Authentication**: None required

**Response 200:**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### GET /health/ready

Readiness check including dependencies.

**Authentication**: None required

**Response 200:**

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

**Response 503:**

```json
{
  "status": "not_ready",
  "checks": {
    "database": "connected",
    "redis": "disconnected"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

#### GET /health/live

Liveness check for container orchestration.

**Authentication**: None required

**Response 200:**

```json
{
  "status": "alive",
  "uptime": 3600,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

### 2. API Key Management

#### POST /api/v1/keys

Create a new API key.

**Authentication**: Admin API key required

**Request Body:**

```json
{
  "name": "Production Service",
  "description": "API key for production backend service",
  "scopes": ["read:requests", "write:requests"],
  "rateLimit": {
    "requestsPerMinute": 1000,
    "requestsPerHour": 50000,
    "requestsPerDay": 1000000
  },
  "expiresAt": "2025-01-15T00:00:00Z",
  "metadata": {
    "environment": "production",
    "team": "backend"
  }
}
```

**Validation Rules:**

- `name`: Required, 3-100 characters
- `scopes`: Required, array of valid scope strings
- `rateLimit.requestsPerMinute`: Optional, 1-100000
- `rateLimit.requestsPerHour`: Optional, 1-10000000
- `expiresAt`: Optional, must be future date

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "apiKey": "dh_live_abc123xyz789...",
    "name": "Production Service",
    "description": "API key for production backend service",
    "scopes": ["read:requests", "write:requests"],
    "rateLimit": {
      "requestsPerMinute": 1000,
      "requestsPerHour": 50000,
      "requestsPerDay": 1000000
    },
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2025-01-15T00:00:00Z"
  }
}
```

**Note**: The full API key is only returned once at creation. Store it securely.

#### GET /api/v1/keys

List all API keys.

**Authentication**: Admin API key required

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| pageSize | integer | 20 | Items per page (max 100) |
| status | string | all | Filter: active, revoked, expired |
| search | string | - | Search by name or description |
| sortBy | string | createdAt | Sort field |
| sortOrder | string | desc | asc or desc |

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
      "keyPrefix": "dh_live_abc1...",
      "name": "Production Service",
      "scopes": ["read:requests", "write:requests"],
      "status": "active",
      "lastUsedAt": "2024-01-15T10:25:00Z",
      "createdAt": "2024-01-15T10:30:00Z"
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

#### GET /api/v1/keys/:id

Get a single API key by ID.

**Authentication**: Admin API key required

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "keyPrefix": "dh_live_abc1...",
    "name": "Production Service",
    "description": "API key for production backend service",
    "scopes": ["read:requests", "write:requests"],
    "rateLimit": {
      "requestsPerMinute": 1000,
      "requestsPerHour": 50000,
      "requestsPerDay": 1000000
    },
    "status": "active",
    "metadata": {
      "environment": "production",
      "team": "backend"
    },
    "usage": {
      "totalRequests": 15420,
      "lastUsedAt": "2024-01-15T10:25:00Z"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "expiresAt": "2025-01-15T00:00:00Z"
  }
}
```

#### PUT /api/v1/keys/:id

Update an API key.

**Authentication**: Admin API key required

**Request Body:**

```json
{
  "name": "Updated Service Name",
  "description": "Updated description",
  "scopes": ["read:requests"],
  "rateLimit": {
    "requestsPerMinute": 500
  },
  "metadata": {
    "environment": "staging"
  }
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "name": "Updated Service Name",
    "status": "active",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### DELETE /api/v1/keys/:id

Revoke an API key (soft delete).

**Authentication**: Admin API key required

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "status": "revoked",
    "revokedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### POST /api/v1/keys/:id/rotate

Rotate an API key (create new, deprecate old).

**Authentication**: Admin API key required

**Request Body:**

```json
{
  "deprecationPeriod": 86400
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "newKey": {
      "id": "key_02I6Y5Z7A9B0C1D2E3F4G5H6I7",
      "apiKey": "dh_live_def456uvw012...",
      "status": "active"
    },
    "oldKey": {
      "id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
      "status": "deprecated",
      "deprecatedAt": "2024-01-15T11:00:00Z",
      "expiresAt": "2024-01-16T11:00:00Z"
    }
  }
}
```

---

### 3. Request Logging

#### GET /api/v1/requests

List logged requests.

**Authentication**: API key with `read:requests` scope

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| pageSize | integer | 50 | Items per page (max 200) |
| keyId | string | - | Filter by API key ID |
| method | string | - | Filter by HTTP method |
| path | string | - | Filter by path prefix |
| status | integer | - | Filter by status code |
| startDate | datetime | -24h | Start of time range |
| endDate | datetime | now | End of time range |
| minDuration | integer | - | Min response time (ms) |
| maxDuration | integer | - | Max response time (ms) |

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "req_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
      "keyId": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
      "method": "POST",
      "path": "/api/v1/users",
      "statusCode": 201,
      "duration": 45,
      "requestSize": 256,
      "responseSize": 512,
      "ipAddress": "192.168.1.100",
      "userAgent": "MyApp/1.0",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalItems": 15420
  }
}
```

#### GET /api/v1/requests/:id

Get detailed request log.

**Authentication**: API key with `read:requests` scope

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "req_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "keyId": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "keyName": "Production Service",
    "method": "POST",
    "path": "/api/v1/users",
    "query": {},
    "headers": {
      "content-type": "application/json",
      "user-agent": "MyApp/1.0"
    },
    "body": {
      "email": "user@example.com",
      "name": "John Doe"
    },
    "response": {
      "statusCode": 201,
      "headers": {
        "content-type": "application/json"
      },
      "body": {
        "id": "user_123",
        "email": "user@example.com"
      }
    },
    "duration": 45,
    "ipAddress": "192.168.1.100",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /api/v1/requests/stats

Get request statistics.

**Authentication**: API key with `read:requests` scope

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| keyId | string | - | Filter by API key ID |
| period | string | hour | hour, day, week, month |
| startDate | datetime | -24h | Start of time range |
| endDate | datetime | now | End of time range |

**Response 200:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRequests": 15420,
      "successfulRequests": 15100,
      "failedRequests": 320,
      "averageDuration": 42,
      "p95Duration": 120,
      "p99Duration": 250
    },
    "byStatusCode": {
      "200": 10500,
      "201": 3200,
      "400": 150,
      "401": 50,
      "429": 100,
      "500": 20
    },
    "byMethod": {
      "GET": 8000,
      "POST": 5000,
      "PUT": 2000,
      "DELETE": 420
    },
    "timeSeries": [
      {
        "timestamp": "2024-01-15T10:00:00Z",
        "requests": 520,
        "errors": 12,
        "avgDuration": 38
      }
    ]
  }
}
```

---

### 4. Rate Limit Management

#### GET /api/v1/rate-limits

Get rate limit configurations.

**Authentication**: Admin API key required

**Response 200:**

```json
{
  "success": true,
  "data": {
    "global": {
      "requestsPerMinute": 10000,
      "requestsPerHour": 500000,
      "burstLimit": 100
    },
    "byTier": {
      "free": {
        "requestsPerMinute": 60,
        "requestsPerHour": 1000
      },
      "standard": {
        "requestsPerMinute": 500,
        "requestsPerHour": 25000
      },
      "premium": {
        "requestsPerMinute": 5000,
        "requestsPerHour": 250000
      }
    }
  }
}
```

#### GET /api/v1/rate-limits/status

Get current rate limit status for the requesting key.

**Authentication**: Any valid API key

**Response 200:**

```json
{
  "success": true,
  "data": {
    "keyId": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "limits": {
      "perMinute": {
        "limit": 1000,
        "remaining": 850,
        "resetsAt": "2024-01-15T10:31:00Z"
      },
      "perHour": {
        "limit": 50000,
        "remaining": 48500,
        "resetsAt": "2024-01-15T11:00:00Z"
      },
      "perDay": {
        "limit": 1000000,
        "remaining": 985000,
        "resetsAt": "2024-01-16T00:00:00Z"
      }
    }
  }
}
```

#### PUT /api/v1/rate-limits/keys/:keyId

Update rate limits for a specific key.

**Authentication**: Admin API key required

**Request Body:**

```json
{
  "requestsPerMinute": 2000,
  "requestsPerHour": 100000,
  "requestsPerDay": 2000000,
  "burstLimit": 50
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "keyId": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "rateLimit": {
      "requestsPerMinute": 2000,
      "requestsPerHour": 100000,
      "requestsPerDay": 2000000,
      "burstLimit": 50
    },
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 5. Webhook Management

#### POST /api/v1/webhooks

Create a webhook subscription.

**Authentication**: API key with `write:webhooks` scope

**Request Body:**

```json
{
  "name": "Order Notifications",
  "url": "https://example.com/webhooks/orders",
  "events": ["order.created", "order.updated", "order.completed"],
  "secret": "whsec_abc123xyz789",
  "headers": {
    "X-Custom-Header": "custom-value"
  },
  "enabled": true,
  "retryPolicy": {
    "maxRetries": 5,
    "backoffMultiplier": 2,
    "initialDelay": 1000
  }
}
```

**Validation Rules:**

- `name`: Required, 3-100 characters
- `url`: Required, valid HTTPS URL
- `events`: Required, array of valid event types
- `secret`: Optional, used for signature verification
- `retryPolicy.maxRetries`: Optional, 1-10
- `retryPolicy.initialDelay`: Optional, 100-60000 ms

**Response 201:**

```json
{
  "success": true,
  "data": {
    "id": "whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "name": "Order Notifications",
    "url": "https://example.com/webhooks/orders",
    "events": ["order.created", "order.updated", "order.completed"],
    "enabled": true,
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

#### GET /api/v1/webhooks

List webhook subscriptions.

**Authentication**: API key with `read:webhooks` scope

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| pageSize | integer | 20 | Items per page |
| enabled | boolean | - | Filter by enabled status |
| event | string | - | Filter by event type |

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
      "name": "Order Notifications",
      "url": "https://example.com/webhooks/orders",
      "events": ["order.created", "order.updated"],
      "enabled": true,
      "status": "active",
      "stats": {
        "totalDeliveries": 1520,
        "successfulDeliveries": 1500,
        "failedDeliveries": 20,
        "lastDeliveryAt": "2024-01-15T10:25:00Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 12
  }
}
```

#### GET /api/v1/webhooks/:id

Get webhook details.

**Authentication**: API key with `read:webhooks` scope

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "name": "Order Notifications",
    "url": "https://example.com/webhooks/orders",
    "events": ["order.created", "order.updated", "order.completed"],
    "headers": {
      "X-Custom-Header": "custom-value"
    },
    "enabled": true,
    "status": "active",
    "retryPolicy": {
      "maxRetries": 5,
      "backoffMultiplier": 2,
      "initialDelay": 1000
    },
    "stats": {
      "totalDeliveries": 1520,
      "successfulDeliveries": 1500,
      "failedDeliveries": 20,
      "averageLatency": 250,
      "lastDeliveryAt": "2024-01-15T10:25:00Z",
      "lastSuccessAt": "2024-01-15T10:25:00Z",
      "lastFailureAt": "2024-01-15T09:15:00Z"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### PUT /api/v1/webhooks/:id

Update a webhook subscription.

**Authentication**: API key with `write:webhooks` scope

**Request Body:**

```json
{
  "name": "Updated Webhook Name",
  "url": "https://example.com/webhooks/v2/orders",
  "events": ["order.created"],
  "enabled": false
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "id": "whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "name": "Updated Webhook Name",
    "enabled": false,
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

#### DELETE /api/v1/webhooks/:id

Delete a webhook subscription.

**Authentication**: API key with `write:webhooks` scope

**Response 204:** No content

#### GET /api/v1/webhooks/:id/deliveries

Get webhook delivery history.

**Authentication**: API key with `read:webhooks` scope

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| pageSize | integer | 50 | Items per page |
| status | string | - | Filter: success, failed, pending |
| startDate | datetime | -24h | Start of time range |
| endDate | datetime | now | End of time range |

**Response 200:**

```json
{
  "success": true,
  "data": [
    {
      "id": "del_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
      "webhookId": "whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
      "event": "order.created",
      "status": "success",
      "statusCode": 200,
      "duration": 145,
      "attempts": 1,
      "payload": {
        "event": "order.created",
        "data": { "orderId": "ord_123" }
      },
      "response": {
        "statusCode": 200,
        "body": "OK"
      },
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 50,
    "totalItems": 1520
  }
}
```

#### POST /api/v1/webhooks/:id/test

Send a test webhook delivery.

**Authentication**: API key with `write:webhooks` scope

**Request Body:**

```json
{
  "event": "test.ping",
  "payload": {
    "message": "Test webhook delivery"
  }
}
```

**Response 200:**

```json
{
  "success": true,
  "data": {
    "deliveryId": "del_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "status": "success",
    "statusCode": 200,
    "duration": 145,
    "response": {
      "statusCode": 200,
      "body": "OK"
    }
  }
}
```

#### POST /api/v1/webhooks/:id/deliveries/:deliveryId/retry

Retry a failed webhook delivery.

**Authentication**: API key with `write:webhooks` scope

**Response 200:**

```json
{
  "success": true,
  "data": {
    "deliveryId": "del_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "status": "pending",
    "scheduledAt": "2024-01-15T10:31:00Z",
    "attempt": 2
  }
}
```

---

## Authentication System

### API Key Structure

API keys follow a specific format for easy identification:

```
dh_{environment}_{random_string}

Examples:
- dh_live_abc123xyz789def456uvw012
- dh_test_xyz789abc123def456uvw012
```

**Key Components:**
| Component | Description |
|-----------|-------------|
| Prefix | `dh_` - DataHub identifier |
| Environment | `live_` or `test_` - Environment indicator |
| Random String | 32 character cryptographically random string |

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Authentication Flow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Request Received]                                              │
│         │                                                        │
│         ▼                                                        │
│  [Extract API Key from Header]                                   │
│  (X-API-Key or Authorization: Bearer)                           │
│         │                                                        │
│         ├── No Key ──▶ [Return 401 Unauthorized]                │
│         │                                                        │
│         ▼                                                        │
│  [Hash API Key]                                                  │
│  (SHA-256)                                                       │
│         │                                                        │
│         ▼                                                        │
│  [Lookup in Cache/Database]                                      │
│         │                                                        │
│         ├── Not Found ──▶ [Return 401 Unauthorized]             │
│         │                                                        │
│         ▼                                                        │
│  [Validate Key Status]                                           │
│         │                                                        │
│         ├── Revoked/Expired ──▶ [Return 401 Unauthorized]       │
│         │                                                        │
│         ▼                                                        │
│  [Check Scope for Endpoint]                                      │
│         │                                                        │
│         ├── Insufficient ──▶ [Return 403 Forbidden]             │
│         │                                                        │
│         ▼                                                        │
│  [Update Last Used Timestamp]                                    │
│         │                                                        │
│         ▼                                                        │
│  [Attach Key Info to Request Context]                           │
│         │                                                        │
│         ▼                                                        │
│  [Continue to Rate Limiting]                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Scope System

**Available Scopes:**

| Scope               | Description                   |
| ------------------- | ----------------------------- |
| `admin`             | Full administrative access    |
| `read:keys`         | View API keys                 |
| `write:keys`        | Create/update/delete API keys |
| `read:requests`     | View request logs             |
| `read:webhooks`     | View webhooks                 |
| `write:webhooks`    | Create/update/delete webhooks |
| `read:rate-limits`  | View rate limit status        |
| `write:rate-limits` | Modify rate limits            |

**Endpoint Scope Requirements:**

| Endpoint                         | Required Scope          |
| -------------------------------- | ----------------------- |
| `POST /api/v1/keys`              | `admin` or `write:keys` |
| `GET /api/v1/keys`               | `admin` or `read:keys`  |
| `GET /api/v1/requests`           | `read:requests`         |
| `POST /api/v1/webhooks`          | `write:webhooks`        |
| `GET /api/v1/rate-limits/status` | (any valid key)         |

### Security Implementation

```typescript
// Key hashing for storage
const hashApiKey = (apiKey: string): string => {
  return crypto.createHash('sha256').update(apiKey).digest('hex');
};

// Key generation
const generateApiKey = (environment: 'live' | 'test'): string => {
  const randomPart = crypto.randomBytes(24).toString('base64url');
  return `dh_${environment}_${randomPart}`;
};

// Key validation middleware
const validateApiKey = async (req, res, next) => {
  const apiKey = extractApiKey(req);

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'MISSING_API_KEY',
        message: 'API key is required',
      },
    });
  }

  const keyHash = hashApiKey(apiKey);
  const keyRecord = await getKeyByHash(keyHash);

  if (!keyRecord || keyRecord.status !== 'active') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'INVALID_API_KEY',
        message: 'Invalid or expired API key',
      },
    });
  }

  req.apiKey = keyRecord;
  next();
};
```

---

## Rate Limiting Implementation

### Algorithm: Sliding Window Log

DataHub uses a sliding window log algorithm for precise rate limiting:

```typescript
interface RateLimitConfig {
  windowSize: number; // Window size in seconds
  maxRequests: number; // Max requests per window
  keyPrefix: string; // Redis key prefix
}

interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
}

class SlidingWindowRateLimiter {
  private redis: Redis;

  async checkLimit(identifier: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - config.windowSize * 1000;
    const key = `${config.keyPrefix}:${identifier}`;

    // Use Redis MULTI for atomic operations
    const pipeline = this.redis.pipeline();

    // Remove old entries outside window
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Count current entries in window
    pipeline.zcard(key);

    // Add current request
    pipeline.zadd(key, now, `${now}:${crypto.randomUUID()}`);

    // Set expiry
    pipeline.expire(key, config.windowSize);

    const results = await pipeline.exec();
    const currentCount = results[1][1] as number;

    const resetAt = new Date(now + config.windowSize * 1000);

    if (currentCount >= config.maxRequests) {
      // Find oldest entry to calculate retry time
      const oldest = await this.redis.zrange(key, 0, 0, 'WITHSCORES');
      const retryAfter =
        oldest.length > 1
          ? Math.ceil((parseInt(oldest[1]) + config.windowSize * 1000 - now) / 1000)
          : config.windowSize;

      return {
        allowed: false,
        limit: config.maxRequests,
        remaining: 0,
        resetAt,
        retryAfter,
      };
    }

    return {
      allowed: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - currentCount - 1,
      resetAt,
    };
  }
}
```

### Rate Limit Headers

All responses include rate limit headers:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 850
X-RateLimit-Reset: 1705315860
X-RateLimit-Window: minute
```

For 429 responses:

```
Retry-After: 45
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705315860
```

### Multi-Tier Rate Limiting

```typescript
const rateLimitMiddleware = async (req, res, next) => {
  const keyId = req.apiKey.id;
  const limits = req.apiKey.rateLimit;

  // Check all tiers
  const checks = await Promise.all([
    rateLimiter.checkLimit(keyId, {
      windowSize: 60,
      maxRequests: limits.requestsPerMinute,
      keyPrefix: 'rl:min',
    }),
    rateLimiter.checkLimit(keyId, {
      windowSize: 3600,
      maxRequests: limits.requestsPerHour,
      keyPrefix: 'rl:hour',
    }),
    rateLimiter.checkLimit(keyId, {
      windowSize: 86400,
      maxRequests: limits.requestsPerDay,
      keyPrefix: 'rl:day',
    }),
  ]);

  // Find the most restrictive limit that was exceeded
  const exceeded = checks.find((c) => !c.allowed);

  if (exceeded) {
    setRateLimitHeaders(res, exceeded);
    return res.status(429).json({
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded. Retry after ${exceeded.retryAfter} seconds.`,
        details: {
          limit: exceeded.limit,
          remaining: exceeded.remaining,
          resetAt: exceeded.resetAt.toISOString(),
        },
      },
    });
  }

  // Set headers for the most restrictive remaining limit
  const mostRestrictive = checks.reduce((min, check) =>
    check.remaining < min.remaining ? check : min,
  );
  setRateLimitHeaders(res, mostRestrictive);

  next();
};
```

---

## Request Processing Pipeline

### Middleware Stack

```typescript
const app = express();

// 1. Basic middleware
app.use(helmet()); // Security headers
app.use(cors(corsConfig)); // CORS handling
app.use(express.json({ limit: '10mb' })); // JSON parsing

// 2. Request context
app.use(requestIdMiddleware); // Add request ID
app.use(requestTimingMiddleware); // Start timing

// 3. Logging (pre-auth)
app.use(requestLoggerMiddleware); // Log incoming request

// 4. Health checks (no auth)
app.use('/health', healthRouter);

// 5. Authentication
app.use('/api', authenticationMiddleware);

// 6. Rate limiting
app.use('/api', rateLimitMiddleware);

// 7. API routes
app.use('/api/v1/keys', keysRouter);
app.use('/api/v1/requests', requestsRouter);
app.use('/api/v1/webhooks', webhooksRouter);
app.use('/api/v1/rate-limits', rateLimitsRouter);

// 8. Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// 9. Response logging
app.use(responseLoggerMiddleware);
```

### Request Logging Implementation

```typescript
interface RequestLog {
  id: string;
  keyId: string;
  method: string;
  path: string;
  query: Record<string, any>;
  headers: Record<string, string>;
  body: any;
  ipAddress: string;
  userAgent: string;
  startedAt: Date;
}

interface ResponseLog {
  requestId: string;
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  duration: number;
  completedAt: Date;
}

const requestLoggerMiddleware = (req, res, next) => {
  const requestLog: RequestLog = {
    id: req.id,
    keyId: req.apiKey?.id,
    method: req.method,
    path: req.path,
    query: req.query,
    headers: sanitizeHeaders(req.headers),
    body: sanitizeBody(req.body),
    ipAddress: getClientIp(req),
    userAgent: req.get('user-agent'),
    startedAt: new Date(),
  };

  // Store for later completion
  req.requestLog = requestLog;

  // Capture response
  const originalSend = res.send;
  res.send = function (body) {
    res.responseBody = body;
    return originalSend.call(this, body);
  };

  res.on('finish', async () => {
    const responseLog: ResponseLog = {
      requestId: req.id,
      statusCode: res.statusCode,
      headers: res.getHeaders(),
      body: parseResponseBody(res.responseBody),
      duration: Date.now() - requestLog.startedAt.getTime(),
      completedAt: new Date(),
    };

    // Async log to database
    await logRequest(requestLog, responseLog);
  });

  next();
};

// Sanitize sensitive data
const sanitizeHeaders = (headers: Record<string, string>) => {
  const sanitized = { ...headers };
  const sensitiveHeaders = ['authorization', 'x-api-key', 'cookie'];

  for (const header of sensitiveHeaders) {
    if (sanitized[header]) {
      sanitized[header] = '[REDACTED]';
    }
  }

  return sanitized;
};
```

---

## Error Handling

### Error Codes

| Code                  | HTTP Status | Description                |
| --------------------- | ----------- | -------------------------- |
| `MISSING_API_KEY`     | 401         | API key not provided       |
| `INVALID_API_KEY`     | 401         | API key invalid or expired |
| `INSUFFICIENT_SCOPE`  | 403         | Key lacks required scope   |
| `RATE_LIMIT_EXCEEDED` | 429         | Rate limit exceeded        |
| `VALIDATION_ERROR`    | 400         | Request validation failed  |
| `RESOURCE_NOT_FOUND`  | 404         | Resource not found         |
| `CONFLICT`            | 409         | Resource conflict          |
| `INTERNAL_ERROR`      | 500         | Internal server error      |

### Error Handler Implementation

```typescript
class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error({
    requestId: req.id,
    error: err.message,
    stack: err.stack,
    code: err.code,
  });

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.id,
      },
    });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: req.id,
      },
    });
  }

  // Generic error
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
    meta: {
      timestamp: new Date().toISOString(),
      requestId: req.id,
    },
  });
};
```

---

## Webhook Delivery System

### Delivery Queue

```typescript
interface WebhookJob {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  attempt: number;
  maxRetries: number;
  scheduledAt: Date;
}

class WebhookDeliveryQueue {
  private queue: Queue;

  async enqueue(job: WebhookJob): Promise<void> {
    await this.queue.add('webhook-delivery', job, {
      attempts: job.maxRetries,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async processJob(job: Job<WebhookJob>): Promise<void> {
    const webhook = await getWebhook(job.data.webhookId);

    if (!webhook || !webhook.enabled) {
      throw new Error('Webhook not found or disabled');
    }

    const signature = this.signPayload(job.data.payload, webhook.secret);

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-Event': job.data.event,
        'X-Webhook-Delivery': job.data.id,
        ...webhook.headers,
      },
      body: JSON.stringify(job.data.payload),
      timeout: 30000,
    });

    await logDelivery({
      id: job.data.id,
      webhookId: webhook.id,
      event: job.data.event,
      attempt: job.attemptsMade + 1,
      statusCode: response.status,
      success: response.ok,
      responseBody: await response.text(),
    });

    if (!response.ok) {
      throw new Error(`Webhook delivery failed: ${response.status}`);
    }
  }

  private signPayload(payload: any, secret: string): string {
    const timestamp = Date.now();
    const body = JSON.stringify(payload);
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${timestamp}.${body}`)
      .digest('hex');

    return `t=${timestamp},v1=${signature}`;
  }
}
```

### Webhook Payload Format

```json
{
  "id": "evt_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
  "type": "order.created",
  "created": "2024-01-15T10:30:00Z",
  "data": {
    "object": {
      "id": "ord_123",
      "status": "pending",
      "total": 99.99
    }
  }
}
```

---

## Configuration

### Environment Variables

```bash
# Server
PORT=3000
NODE_ENV=production
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/datahub
DATABASE_POOL_SIZE=20

# Redis
REDIS_URL=redis://localhost:6379
REDIS_KEY_PREFIX=datahub:

# Security
API_KEY_SALT=<random-32-bytes>
ADMIN_API_KEY=<initial-admin-key>

# Rate Limiting
DEFAULT_RATE_LIMIT_MINUTE=100
DEFAULT_RATE_LIMIT_HOUR=5000
DEFAULT_RATE_LIMIT_DAY=100000

# Webhooks
WEBHOOK_TIMEOUT_MS=30000
WEBHOOK_MAX_RETRIES=5
WEBHOOK_QUEUE_CONCURRENCY=10

# Logging
LOG_RETENTION_DAYS=30
LOG_SENSITIVE_DATA=false
```

### Configuration Schema

```typescript
const configSchema = z.object({
  server: z.object({
    port: z.number().default(3000),
    env: z.enum(['development', 'staging', 'production']).default('development'),
  }),
  database: z.object({
    url: z.string().url(),
    poolSize: z.number().min(1).max(100).default(20),
  }),
  redis: z.object({
    url: z.string().url(),
    keyPrefix: z.string().default('datahub:'),
  }),
  rateLimits: z.object({
    defaultPerMinute: z.number().default(100),
    defaultPerHour: z.number().default(5000),
    defaultPerDay: z.number().default(100000),
  }),
  webhooks: z.object({
    timeoutMs: z.number().default(30000),
    maxRetries: z.number().min(1).max(10).default(5),
    concurrency: z.number().min(1).max(50).default(10),
  }),
  logging: z.object({
    level: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    retentionDays: z.number().min(1).max(365).default(30),
    logSensitiveData: z.boolean().default(false),
  }),
});
```

---

## File Structure

```
src/
├── index.ts                 # Application entry point
├── app.ts                   # Express app setup
├── config/
│   └── index.ts             # Configuration loading
├── middleware/
│   ├── auth.ts              # Authentication middleware
│   ├── rateLimit.ts         # Rate limiting middleware
│   ├── requestLogger.ts     # Request logging middleware
│   ├── errorHandler.ts      # Error handling middleware
│   └── requestId.ts         # Request ID middleware
├── routes/
│   ├── health.ts            # Health check routes
│   ├── keys.ts              # API key routes
│   ├── requests.ts          # Request log routes
│   ├── webhooks.ts          # Webhook routes
│   └── rateLimits.ts        # Rate limit routes
├── services/
│   ├── keyService.ts        # API key business logic
│   ├── requestService.ts    # Request logging logic
│   ├── webhookService.ts    # Webhook business logic
│   └── rateLimitService.ts  # Rate limit logic
├── repositories/
│   ├── keyRepository.ts     # Key database operations
│   ├── requestRepository.ts # Request log operations
│   └── webhookRepository.ts # Webhook operations
├── queue/
│   ├── webhookQueue.ts      # Webhook delivery queue
│   └── processor.ts         # Queue job processor
├── utils/
│   ├── crypto.ts            # Cryptographic utilities
│   ├── validation.ts        # Validation schemas
│   └── logger.ts            # Logging utilities
└── types/
    └── index.ts             # TypeScript type definitions
```

---

## Performance Considerations

### Caching Strategy

| Data                | Cache Location | TTL         | Invalidation      |
| ------------------- | -------------- | ----------- | ----------------- |
| API Key (validated) | Redis          | 5 min       | On update/revoke  |
| Rate Limit Counters | Redis          | Window size | Automatic         |
| Request Logs        | PostgreSQL     | 30 days     | Scheduled cleanup |
| Webhook Config      | Redis          | 10 min      | On update         |

### Database Indexing

See `04_db_architect.md` for complete index definitions.

### Connection Pooling

- PostgreSQL: Pool size 20, idle timeout 30s
- Redis: Pool size 10, min idle 2

---

## Security Checklist

- [ ] API keys hashed before storage
- [ ] Sensitive headers redacted in logs
- [ ] Request body sanitization
- [ ] Rate limiting enforced
- [ ] HTTPS required in production
- [ ] CORS configured appropriately
- [ ] Security headers via Helmet
- [ ] SQL injection prevention (parameterized queries)
- [ ] Input validation on all endpoints

---

_This specification provides the complete backend implementation details for DataHub API Gateway. Refer to individual sprint tickets for implementation tasks._
