# DataHub API Gateway - Authentication Flow

## Overview

This document provides detailed documentation of the authentication and authorization flows in DataHub API Gateway.

---

## Authentication Methods

DataHub supports two methods for providing API keys:

### Method 1: X-API-Key Header (Recommended)

```http
GET /api/v1/keys HTTP/1.1
Host: api.datahub.example.com
X-API-Key: dh_live_abc123xyz789def456uvw012
```

### Method 2: Authorization Bearer

```http
GET /api/v1/keys HTTP/1.1
Host: api.datahub.example.com
Authorization: Bearer dh_live_abc123xyz789def456uvw012
```

---

## Complete Authentication Flow

```
                                    AUTHENTICATION FLOW
+-----------------------------------------------------------------------------------------+
|                                                                                          |
|  +---------------+                                                                       |
|  |    Client     |                                                                       |
|  +-------+-------+                                                                       |
|          |                                                                               |
|          | 1. HTTP Request with API Key                                                  |
|          |    X-API-Key: dh_live_abc123...                                               |
|          v                                                                               |
|  +-------+-------+                                                                       |
|  |    Gateway    |                                                                       |
|  +-------+-------+                                                                       |
|          |                                                                               |
|          | 2. Extract API Key from Header                                                |
|          |                                                                               |
|          v                                                                               |
|  +-------+-------+                                                                       |
|  | Key Present?  |---- No ----> Return 401: MISSING_API_KEY                             |
|  +-------+-------+                                                                       |
|          |                                                                               |
|          | Yes                                                                           |
|          |                                                                               |
|          | 3. Validate Key Format                                                        |
|          |    Pattern: /^dh_(live|test)_[A-Za-z0-9_-]{32}$/                             |
|          v                                                                               |
|  +-------+-------+                                                                       |
|  | Valid Format? |---- No ----> Return 401: INVALID_API_KEY                             |
|  +-------+-------+                                                                       |
|          |                                                                               |
|          | Yes                                                                           |
|          |                                                                               |
|          | 4. Hash API Key (SHA-256)                                                     |
|          |    hash = SHA256(apiKey)                                                      |
|          v                                                                               |
|  +-------+-------+                                                                       |
|  | Check Cache   |                                                                       |
|  +-------+-------+                                                                       |
|          |                                                                               |
|     +----+----+                                                                          |
|     |         |                                                                          |
|  Hit|      Miss|                                                                         |
|     v         v                                                                          |
|  Return   +---+---+                                                                      |
|  Cached   | Query |                                                                      |
|  Record   |  DB   |                                                                      |
|     |     +---+---+                                                                      |
|     |         |                                                                          |
|     |         | 5. SELECT * FROM api_keys WHERE key_hash = $1                           |
|     |         |                                                                          |
|     |     +---+---+                                                                      |
|     |     | Found |---- No ----> Return 401: INVALID_API_KEY                            |
|     |     +---+---+                                                                      |
|     |         |                                                                          |
|     |         | Yes                                                                      |
|     |         |                                                                          |
|     |         | Cache record (TTL: 5 min)                                               |
|     |         |                                                                          |
|     +----+----+                                                                          |
|          |                                                                               |
|          | 6. Validate Key Status                                                        |
|          v                                                                               |
|  +-------+-------+                                                                       |
|  |status=active? |---- No ----> Return 401: INVALID_API_KEY                             |
|  +-------+-------+              (Key revoked or deprecated)                              |
|          |                                                                               |
|          | Yes                                                                           |
|          |                                                                               |
|          | 7. Check Expiration                                                           |
|          v                                                                               |
|  +-------+-------+                                                                       |
|  | Not Expired?  |---- No ----> Return 401: INVALID_API_KEY                             |
|  +-------+-------+              (Key expired)                                            |
|          |                                                                               |
|          | Yes                                                                           |
|          |                                                                               |
|          | 8. Update last_used_at (async)                                               |
|          |                                                                               |
|          | 9. Attach key record to request context                                       |
|          |    req.apiKey = keyRecord                                                    |
|          v                                                                               |
|  +-------+-------+                                                                       |
|  |  AUTHENTICATED|----> Continue to Rate Limiting                                        |
|  +---------------+                                                                       |
|                                                                                          |
+-----------------------------------------------------------------------------------------+
```

---

## Authorization (Scope Checking) Flow

After successful authentication, the authorization middleware verifies the API key has required scopes.

```
                                    AUTHORIZATION FLOW
+-----------------------------------------------------------------------------------------+
|                                                                                          |
|  From: Authentication (req.apiKey populated)                                            |
|          |                                                                               |
|          | 1. Get required scope for endpoint                                            |
|          |    endpoint: POST /api/v1/keys --> requiredScope: 'write:keys'               |
|          v                                                                               |
|  +-------+-------+                                                                       |
|  | Get Required  |                                                                       |
|  | Scope         |                                                                       |
|  +-------+-------+                                                                       |
|          |                                                                               |
|          | 2. Check if key has 'admin' scope                                             |
|          v                                                                               |
|  +-------+-------+                                                                       |
|  | Has 'admin'?  |---- Yes ----> AUTHORIZED (admin bypasses all checks)                 |
|  +-------+-------+                                                                       |
|          |                                                                               |
|          | No                                                                            |
|          |                                                                               |
|          | 3. Check if key has the specific required scope                               |
|          v                                                                               |
|  +-------+-------+                                                                       |
|  | Has Required  |---- No ----> Return 403: INSUFFICIENT_SCOPE                          |
|  | Scope?        |                                                                       |
|  +-------+-------+                                                                       |
|          |                                                                               |
|          | Yes                                                                           |
|          |                                                                               |
|          v                                                                               |
|  +-------+-------+                                                                       |
|  |  AUTHORIZED   |----> Continue to Route Handler                                        |
|  +---------------+                                                                       |
|                                                                                          |
+-----------------------------------------------------------------------------------------+
```

---

## Endpoint Scope Requirements

| Endpoint | HTTP Method | Required Scope |
|----------|-------------|----------------|
| `/api/v1/keys` | POST | `write:keys` |
| `/api/v1/keys` | GET | `read:keys` |
| `/api/v1/keys/:id` | GET | `read:keys` |
| `/api/v1/keys/:id` | PUT | `write:keys` |
| `/api/v1/keys/:id` | DELETE | `write:keys` |
| `/api/v1/keys/:id/rotate` | POST | `write:keys` |
| `/api/v1/requests` | GET | `read:requests` |
| `/api/v1/requests/:id` | GET | `read:requests` |
| `/api/v1/requests/stats` | GET | `read:requests` |
| `/api/v1/webhooks` | POST | `write:webhooks` |
| `/api/v1/webhooks` | GET | `read:webhooks` |
| `/api/v1/webhooks/:id` | GET | `read:webhooks` |
| `/api/v1/webhooks/:id` | PUT | `write:webhooks` |
| `/api/v1/webhooks/:id` | DELETE | `write:webhooks` |
| `/api/v1/webhooks/:id/test` | POST | `write:webhooks` |
| `/api/v1/webhooks/:id/deliveries` | GET | `read:webhooks` |
| `/api/v1/rate-limits/status` | GET | (any valid key) |
| `/api/v1/rate-limits/keys/:id` | PUT | `admin` |
| `/api/v1/audit-logs` | GET | `admin` |

---

## API Key Lifecycle States

```
                         API KEY STATE TRANSITIONS

     +----------+
     |  CREATE  |
     +----+-----+
          |
          v
     +----+-----+
     |  ACTIVE  |<-----------------------------------------+
     +----+-----+                                          |
          |                                                |
          |                                                |
    +-----+-----+-----+                                    |
    |           |     |                                    |
    v           v     v                                    |
+---+---+ +-----+---+ +---+----+                          |
|EXPIRED| |DEPRECATED| |REVOKED |                          |
+-------+ +----+----+ +--------+                          |
               |                                           |
               | (After deprecation period)                |
               +-------------------------------------------+
                    Becomes REVOKED automatically


State Descriptions:
- ACTIVE: Key is valid and can authenticate requests
- DEPRECATED: Key still works but will become REVOKED (used during rotation)
- EXPIRED: Key has passed its expires_at timestamp
- REVOKED: Key has been manually revoked or rotation period ended
```

---

## Authentication Error Responses

### 401 Unauthorized - Missing API Key

```json
{
  "success": false,
  "error": {
    "code": "MISSING_API_KEY",
    "message": "API key is required. Provide it via X-API-Key header or Authorization: Bearer token."
  },
  "meta": {
    "requestId": "req_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### 401 Unauthorized - Invalid API Key

```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid, expired, or has been revoked."
  },
  "meta": {
    "requestId": "req_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### 403 Forbidden - Insufficient Scope

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_SCOPE",
    "message": "The API key does not have the required scope: write:keys",
    "details": {
      "requiredScope": "write:keys",
      "keyScopes": ["read:keys", "read:requests"]
    }
  },
  "meta": {
    "requestId": "req_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## Key Validation Implementation

```typescript
// middleware/auth.ts

async function validateApiKey(req: Request): Promise<ApiKeyRecord> {
  // 1. Extract API key
  const apiKey = extractApiKey(req);
  if (!apiKey) {
    throw new AuthenticationError('API key is required');
  }

  // 2. Validate format
  if (!isValidKeyFormat(apiKey)) {
    throw new AuthenticationError('Invalid API key format');
  }

  // 3. Hash the key
  const keyHash = hashApiKey(apiKey);

  // 4. Check cache first
  let keyRecord = await cache.get(`key:${keyHash}`);

  // 5. If not in cache, query database
  if (!keyRecord) {
    keyRecord = await keyRepository.findByHash(keyHash);
    if (keyRecord) {
      await cache.set(`key:${keyHash}`, keyRecord, 300); // 5 min TTL
    }
  }

  // 6. Key not found
  if (!keyRecord) {
    throw new AuthenticationError('Invalid API key');
  }

  // 7. Check status
  if (keyRecord.status !== 'active' && keyRecord.status !== 'deprecated') {
    throw new AuthenticationError('API key has been revoked or expired');
  }

  // 8. Check expiration
  if (keyRecord.expiresAt && new Date(keyRecord.expiresAt) < new Date()) {
    throw new AuthenticationError('API key has expired');
  }

  // 9. Update last used (async, don't wait)
  keyRepository.updateLastUsed(keyRecord.id).catch(console.error);

  return keyRecord;
}

function extractApiKey(req: Request): string | undefined {
  // Try X-API-Key header first
  const xApiKey = req.headers['x-api-key'];
  if (xApiKey && typeof xApiKey === 'string') {
    return xApiKey;
  }

  // Try Authorization: Bearer
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    return auth.substring(7);
  }

  return undefined;
}

function isValidKeyFormat(key: string): boolean {
  return /^dh_(live|test)_[A-Za-z0-9_-]{24,}$/.test(key);
}

function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}
```

---

## Caching Strategy

```
+----------+                      +----------+                    +-----------+
|  Request |                      |  Redis   |                    | PostgreSQL|
+----+-----+                      +----+-----+                    +-----+-----+
     |                                 |                                |
     | 1. Hash key                     |                                |
     |                                 |                                |
     | 2. GET key:{hash}               |                                |
     |-------------------------------->|                                |
     |                                 |                                |
     |     Cache Hit                   |                                |
     |<--------------------------------|                                |
     |                                 |                                |
     |     Cache Miss                  |                                |
     |<- - - - - - - - - - - - - - - - |                                |
     |                                 |                                |
     | 3. SELECT by key_hash           |                                |
     |------------------------------------------------------------------->
     |                                 |                                |
     |     Key Record                  |                                |
     |<------------------------------------------------------------------|
     |                                 |                                |
     | 4. SET key:{hash} (TTL 5min)    |                                |
     |-------------------------------->|                                |
     |                                 |                                |

Cache Invalidation:
- On key update: DELETE key:{hash}
- On key revoke: DELETE key:{hash}
- TTL expiration: Automatic
```

---

## Security Considerations

### Key Hashing

- API keys are hashed using SHA-256 before storage
- Only the hash is stored in the database
- Full key is only returned once at creation time

### Rate Limiting on Auth Failures

- Failed authentication attempts are logged
- IP-based rate limiting on auth failures: 10 per minute
- Helps prevent brute force attacks

### Key Prefix for Identification

- Key prefix (`dh_live_abc1...`) is stored for display
- Allows key identification without exposing full key
- Useful for audit logs and admin interfaces

---

## Related Documentation

- [Security Architecture](../architecture/security.md) - Overall security design
- [User Journeys](./user-journeys.md) - Authentication in context
- [API Reference](../api/reference.md) - Endpoint authentication requirements

---

_This document details the authentication and authorization flows for DataHub API Gateway._
