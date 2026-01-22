# DataHub API Gateway - Release Notes

## Version 1.0.0 - Sprint 1: Core API Features

**Release Date**: 2026-01-19
**Release Type**: Major Release (Initial)
**API Version**: v1

---

## Overview

This release introduces the foundational features of the DataHub API Gateway, including secure API key management, authentication, authorization, and rate limiting. This establishes the core infrastructure for all subsequent features.

---

## New Features

### API Key Management

The API Gateway now supports full lifecycle management of API keys with the following capabilities:

#### Create API Keys
Generate secure API keys for authenticating requests to your services.

```bash
# Create a new API key
curl -X POST https://api.datahub.example.com/api/v1/keys \
  -H "X-API-Key: YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Service",
    "description": "API key for production environment",
    "scopes": ["read:requests", "write:requests"],
    "rateLimit": {
      "requestsPerMinute": 1000,
      "requestsPerHour": 50000,
      "requestsPerDay": 500000
    },
    "expiresAt": "2027-01-15T00:00:00Z",
    "metadata": {
      "team": "platform",
      "environment": "production"
    }
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "key_01HQ3X4Y5Z6W7V8U9T0S",
    "key": "dh_live_abc123def456ghi789jkl012mno345pq",
    "prefix": "dh_live_abc123de",
    "name": "Production Service",
    "description": "API key for production environment",
    "environment": "live",
    "status": "active",
    "scopes": ["read:requests", "write:requests"],
    "rateLimit": {
      "requestsPerMinute": 1000,
      "requestsPerHour": 50000,
      "requestsPerDay": 500000
    },
    "createdAt": "2026-01-19T10:30:00Z",
    "expiresAt": "2027-01-15T00:00:00Z"
  }
}
```

> **Important**: The full API key is only returned once at creation time. Store it securely immediately.

#### List API Keys
Retrieve all API keys with pagination, filtering, and search capabilities.

```bash
# List all active keys
curl https://api.datahub.example.com/api/v1/keys?status=active&page=1&pageSize=20 \
  -H "X-API-Key: YOUR_ADMIN_KEY"
```

**Query Parameters**:
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| pageSize | integer | 20 | Items per page (max: 100) |
| status | string | all | Filter: active, revoked, expired, deprecated, all |
| search | string | - | Search in name and description |
| sortBy | string | createdAt | Sort field: createdAt, name, lastUsedAt |
| sortOrder | string | desc | Sort order: asc, desc |

#### Get API Key Details
Retrieve detailed information about a specific API key.

```bash
curl https://api.datahub.example.com/api/v1/keys/key_01HQ3X4Y5Z6W7V8U9T0S \
  -H "X-API-Key: YOUR_ADMIN_KEY"
```

#### Update API Keys
Modify API key properties (name, description, scopes, rate limits).

```bash
curl -X PUT https://api.datahub.example.com/api/v1/keys/key_01HQ3X4Y5Z6W7V8U9T0S \
  -H "X-API-Key: YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Service Name",
    "scopes": ["read:requests", "write:requests", "read:webhooks"],
    "rateLimit": {
      "requestsPerMinute": 2000,
      "requestsPerHour": 100000,
      "requestsPerDay": 1000000
    }
  }'
```

#### Revoke API Keys
Immediately disable an API key. This action cannot be undone.

```bash
curl -X DELETE https://api.datahub.example.com/api/v1/keys/key_01HQ3X4Y5Z6W7V8U9T0S \
  -H "X-API-Key: YOUR_ADMIN_KEY"
```

#### Rotate API Keys
Generate a new API key while gracefully deprecating the old one.

```bash
curl -X POST https://api.datahub.example.com/api/v1/keys/key_01HQ3X4Y5Z6W7V8U9T0S/rotate \
  -H "X-API-Key: YOUR_ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "deprecationPeriod": 86400
  }'
```

**Response**:
```json
{
  "success": true,
  "data": {
    "newKey": {
      "id": "key_01HQ3X5A6B7C8D9E0F1G",
      "key": "dh_live_xyz789abc123def456ghi012jkl345mn",
      "prefix": "dh_live_xyz789ab",
      "createdAt": "2026-01-19T15:00:00Z"
    },
    "oldKey": {
      "id": "key_01HQ3X4Y5Z6W7V8U9T0S",
      "status": "deprecated",
      "expiresAt": "2026-01-20T15:00:00Z"
    },
    "deprecationPeriod": 86400
  }
}
```

> **Note**: Both keys will work during the deprecation period. After expiry, the old key will stop working automatically.

---

### Authentication

All API endpoints (except health checks) require authentication via API key.

#### Supported Authentication Methods

**1. X-API-Key Header (Recommended)**
```bash
curl https://api.datahub.example.com/api/v1/keys \
  -H "X-API-Key: dh_live_your_api_key_here"
```

**2. Authorization Bearer Header**
```bash
curl https://api.datahub.example.com/api/v1/keys \
  -H "Authorization: Bearer dh_live_your_api_key_here"
```

#### API Key Format

All API keys follow the format: `dh_{environment}_{random}`

| Component | Description | Example |
|-----------|-------------|---------|
| Prefix | Always `dh_` | `dh_` |
| Environment | `live_` or `test_` | `live_` |
| Random | 32 base64url characters | `abc123...` |

**Example**: `dh_live_aBcD1234eFgH5678iJkL9012mNoP3456`

#### Authentication Errors

| Status | Code | Description |
|--------|------|-------------|
| 401 | MISSING_API_KEY | No API key provided in request |
| 401 | INVALID_API_KEY | API key not found or malformed |
| 401 | KEY_EXPIRED | API key has passed its expiration date |
| 401 | KEY_REVOKED | API key has been revoked |

**Error Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_API_KEY",
    "message": "The provided API key is invalid"
  },
  "meta": {
    "timestamp": "2026-01-19T10:30:00Z",
    "requestId": "req_01HQ3X4Y5Z6W7V8U9T0S"
  }
}
```

---

### Authorization (Scopes)

API keys are granted specific scopes that determine what operations they can perform.

#### Available Scopes

| Scope | Description | Endpoints |
|-------|-------------|-----------|
| `admin` | Full access to all endpoints | All |
| `read:keys` | View API keys | GET /api/v1/keys, GET /api/v1/keys/:id |
| `write:keys` | Manage API keys | POST, PUT, DELETE /api/v1/keys/* |
| `read:requests` | View request logs | GET /api/v1/requests/* (Sprint 2) |
| `read:webhooks` | View webhooks | GET /api/v1/webhooks/* (Sprint 2) |
| `write:webhooks` | Manage webhooks | POST, PUT, DELETE /api/v1/webhooks/* (Sprint 2) |

#### Scope Authorization Errors

| Status | Code | Description |
|--------|------|-------------|
| 403 | INSUFFICIENT_SCOPE | API key lacks required scope(s) |

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_SCOPE",
    "message": "Required scopes: write:keys",
    "details": {
      "required": ["write:keys"],
      "provided": ["read:keys"]
    }
  }
}
```

---

### Rate Limiting

All API requests are subject to rate limiting based on the API key's configuration.

#### Rate Limit Tiers

Each API key can have limits configured for three time windows:

| Tier | Window | Default Limit |
|------|--------|---------------|
| Per-Minute | 60 seconds | 1,000 requests |
| Per-Hour | 3,600 seconds | 50,000 requests |
| Per-Day | 86,400 seconds | 500,000 requests |

#### Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1705665060
X-RateLimit-Window: minute
```

| Header | Description |
|--------|-------------|
| X-RateLimit-Limit | Maximum requests allowed in current window |
| X-RateLimit-Remaining | Requests remaining in current window |
| X-RateLimit-Reset | Unix timestamp when window resets |
| X-RateLimit-Window | Current limiting window (minute, hour, day) |

#### Rate Limit Exceeded Response

When rate limited, you'll receive a 429 response:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded for minute window",
    "details": {
      "limit": 1000,
      "window": "minute",
      "retryAfter": 45
    }
  }
}
```

**Headers on 429**:
```
Retry-After: 45
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705665060
```

#### Check Rate Limit Status

```bash
curl https://api.datahub.example.com/api/v1/rate-limits/status \
  -H "X-API-Key: YOUR_API_KEY"
```

**Response**:
```json
{
  "success": true,
  "data": {
    "keyId": "key_01HQ3X4Y5Z6W7V8U9T0S",
    "limits": {
      "perMinute": {
        "limit": 1000,
        "remaining": 847,
        "resetsAt": "2026-01-19T10:31:00Z"
      },
      "perHour": {
        "limit": 50000,
        "remaining": 49153,
        "resetsAt": "2026-01-19T11:00:00Z"
      },
      "perDay": {
        "limit": 500000,
        "remaining": 499153,
        "resetsAt": "2026-01-20T00:00:00Z"
      }
    }
  }
}
```

---

## New API Endpoints

### Key Management

| Method | Endpoint | Description | Scope |
|--------|----------|-------------|-------|
| POST | /api/v1/keys | Create new API key | write:keys |
| GET | /api/v1/keys | List API keys | read:keys |
| GET | /api/v1/keys/:id | Get API key details | read:keys |
| PUT | /api/v1/keys/:id | Update API key | write:keys |
| DELETE | /api/v1/keys/:id | Revoke API key | write:keys |
| POST | /api/v1/keys/:id/rotate | Rotate API key | write:keys |

### Rate Limits

| Method | Endpoint | Description | Scope |
|--------|----------|-------------|-------|
| GET | /api/v1/rate-limits/status | Get current rate limit status | any |

### Health (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /health | Overall health status |
| GET | /health/ready | Readiness probe |
| GET | /health/live | Liveness probe |

---

## Migration Notes

### For New Integrations

1. **Request an API Key**: Contact your administrator to create an API key with appropriate scopes.

2. **Store Securely**: The API key is only shown once at creation. Store it in a secure secrets manager.

3. **Configure Authentication**: Add the API key to your requests:
   ```javascript
   // Node.js example
   const response = await fetch('https://api.datahub.example.com/api/v1/keys', {
     headers: {
       'X-API-Key': process.env.DATAHUB_API_KEY
     }
   });
   ```

4. **Handle Rate Limits**: Implement exponential backoff when receiving 429 responses:
   ```javascript
   async function fetchWithRetry(url, options, maxRetries = 3) {
     for (let i = 0; i < maxRetries; i++) {
       const response = await fetch(url, options);

       if (response.status === 429) {
         const retryAfter = parseInt(response.headers.get('Retry-After') || '60');
         await sleep(retryAfter * 1000);
         continue;
       }

       return response;
     }
     throw new Error('Max retries exceeded');
   }
   ```

5. **Monitor Usage**: Check your rate limit status periodically to avoid hitting limits.

### For Existing Systems

This is the initial release. No migration from previous versions required.

---

## SDK Examples

### JavaScript/TypeScript

```typescript
import { DataHubClient } from '@datahub/api-client';

const client = new DataHubClient({
  apiKey: process.env.DATAHUB_API_KEY,
  baseUrl: 'https://api.datahub.example.com'
});

// Create a new API key
const newKey = await client.keys.create({
  name: 'My Service Key',
  scopes: ['read:requests'],
  rateLimit: {
    requestsPerMinute: 500
  }
});

console.log('Save this key:', newKey.key);

// List keys
const keys = await client.keys.list({
  status: 'active',
  pageSize: 10
});

// Rotate a key
const rotated = await client.keys.rotate(keyId, {
  deprecationPeriod: 3600 // 1 hour
});
```

### Python

```python
from datahub import DataHubClient
import os

client = DataHubClient(
    api_key=os.environ['DATAHUB_API_KEY'],
    base_url='https://api.datahub.example.com'
)

# Create a new API key
new_key = client.keys.create(
    name='My Service Key',
    scopes=['read:requests'],
    rate_limit={
        'requests_per_minute': 500
    }
)

print(f'Save this key: {new_key.key}')

# List keys
keys = client.keys.list(status='active', page_size=10)

# Rotate a key
rotated = client.keys.rotate(key_id, deprecation_period=3600)
```

### cURL

```bash
# Set your API key
export DATAHUB_API_KEY="dh_live_your_key_here"
export DATAHUB_URL="https://api.datahub.example.com"

# Create a key
curl -X POST "$DATAHUB_URL/api/v1/keys" \
  -H "X-API-Key: $DATAHUB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Key", "scopes": ["read:keys"]}'

# List keys
curl "$DATAHUB_URL/api/v1/keys?status=active" \
  -H "X-API-Key: $DATAHUB_API_KEY"

# Check rate limits
curl "$DATAHUB_URL/api/v1/rate-limits/status" \
  -H "X-API-Key: $DATAHUB_API_KEY"
```

---

## Error Codes Reference

### Authentication Errors (401)

| Code | Description | Resolution |
|------|-------------|------------|
| MISSING_API_KEY | No API key in request | Add X-API-Key header |
| INVALID_API_KEY | Key not found/malformed | Check key is correct |
| KEY_EXPIRED | Key past expiration | Create new key or rotate |
| KEY_REVOKED | Key has been revoked | Create new key |

### Authorization Errors (403)

| Code | Description | Resolution |
|------|-------------|------------|
| INSUFFICIENT_SCOPE | Missing required scope | Request key with needed scopes |

### Rate Limit Errors (429)

| Code | Description | Resolution |
|------|-------------|------------|
| RATE_LIMIT_EXCEEDED | Too many requests | Wait for Retry-After period |

### Validation Errors (400)

| Code | Description | Resolution |
|------|-------------|------------|
| VALIDATION_ERROR | Invalid request data | Check request body format |
| INVALID_KEY_STATUS | Cannot perform action on key | Check key status first |

### Not Found Errors (404)

| Code | Description | Resolution |
|------|-------------|------------|
| KEY_NOT_FOUND | API key ID not found | Verify key ID exists |
| RESOURCE_NOT_FOUND | Requested resource missing | Check resource ID |

### Server Errors (500)

| Code | Description | Resolution |
|------|-------------|------------|
| INTERNAL_ERROR | Unexpected server error | Retry or contact support |

---

## Security Best Practices

### API Key Storage

1. **Never hardcode keys** in source code
2. **Use environment variables** or secrets managers
3. **Rotate keys regularly** using the rotation endpoint
4. **Use different keys** for different environments

### Key Scope Principle

1. **Request minimum scopes** needed for your use case
2. **Use separate keys** for read and write operations
3. **Audit key usage** via the lastUsedAt timestamp

### Rate Limit Handling

1. **Implement backoff** when rate limited
2. **Cache responses** where appropriate
3. **Monitor X-RateLimit-Remaining** proactively
4. **Batch requests** when possible

---

## Performance Characteristics

| Metric | Value | Notes |
|--------|-------|-------|
| Authentication latency | <10ms | Cached key lookup |
| Rate limit check | <5ms | Redis-based |
| Key creation | <100ms | Includes DB write |
| Key rotation | <200ms | Transactional |

---

## Breaking Changes

None - this is the initial release.

---

## Deprecations

None - this is the initial release.

---

## Known Limitations

1. **API Key Recovery**: Lost API keys cannot be recovered. Always store keys securely at creation.

2. **Rate Limit Granularity**: Rate limits are per-key only. Per-endpoint limits coming in Sprint 5.

3. **Key Metadata Size**: Metadata field limited to 16KB.

4. **Concurrent Rotations**: Only one rotation per key can be in progress at a time.

---

## Coming in Future Releases

### Sprint 2: Request Logging & Webhooks
- Request/response logging
- Webhook subscriptions
- Event notifications

### Sprint 3: Webhook Delivery
- Async webhook delivery
- Retry with exponential backoff
- Delivery tracking

### Sprint 4: Monitoring & Production
- Prometheus metrics
- Grafana dashboards
- Kubernetes deployment

### Sprint 5: Advanced Features
- Audit logging
- Per-endpoint rate limits
- IP-based rate limiting

---

## Support

- **Documentation**: https://docs.datahub.example.com
- **API Reference**: https://api.datahub.example.com/docs
- **Status Page**: https://status.datahub.example.com
- **Support Email**: support@datahub.example.com

---

## Changelog

### v1.0.0 (2026-01-19)

#### Added
- API key generation with secure random tokens (DH-016)
- API key hashing using SHA-256 (DH-017)
- API key repository with CRUD operations (DH-018)
- Authentication middleware for API key validation (DH-019)
- Scope-based authorization middleware (DH-020)
- POST /api/v1/keys endpoint (DH-021)
- GET /api/v1/keys endpoint with pagination (DH-022)
- GET /api/v1/keys/:id endpoint (DH-023)
- PUT /api/v1/keys/:id endpoint (DH-024)
- DELETE /api/v1/keys/:id endpoint (DH-025)
- POST /api/v1/keys/:id/rotate endpoint (DH-026)
- Sliding window rate limiter using Redis (DH-027)
- Rate limiting middleware with multi-tier support (DH-028)
- Rate limit headers on all responses (DH-029)
- GET /api/v1/rate-limits/status endpoint (DH-030)
- Request ID middleware for tracing (DH-031)
- Standardized error handling (DH-032)
- Zod validation schemas (DH-033)
- Comprehensive unit tests (DH-034, DH-035)
- Integration tests for auth and keys (DH-036, DH-037)

---

*DataHub API Gateway v1.0.0*
*Released: 2026-01-19*
*API Version: v1*
