# DataHub API Gateway - Security Architecture

## Overview

This document describes the security architecture for DataHub API Gateway, including authentication, authorization, data protection, and security best practices.

---

## Authentication Flow

### API Key Authentication

```
+--------+                                      +----------+
| Client |                                      | DataHub  |
+---+----+                                      +----+-----+
    |                                                |
    | 1. Request with API Key                        |
    |  X-API-Key: dh_live_abc123...                  |
    |----------------------------------------------->|
    |                                                |
    |                              2. Extract Key    |
    |                              from header       |
    |                                                |
    |                              3. Hash Key       |
    |                              SHA-256           |
    |                                                |
    |                              4. Lookup in      |
    |                              Cache/Database    |
    |                                                |
    |                              5. Validate:      |
    |                              - Status = active |
    |                              - Not expired     |
    |                              - Has scopes      |
    |                                                |
    |      6a. Success: Continue to handler          |
    |<-----------------------------------------------|
    |                                                |
    |      6b. Failure: 401 Unauthorized             |
    |<-----------------------------------------------|
    |                                                |
```

### Key Extraction

API keys can be provided via:

1. **X-API-Key Header** (Recommended)
   ```
   X-API-Key: dh_live_abc123xyz789def456uvw012
   ```

2. **Authorization Bearer Header**
   ```
   Authorization: Bearer dh_live_abc123xyz789def456uvw012
   ```

---

## API Key Security

### Key Format

```
dh_{environment}_{random_string}

Examples:
- dh_live_abc123xyz789def456uvw012  (Production)
- dh_test_xyz789abc123def456uvw012  (Testing)

Components:
- Prefix: dh_ (DataHub identifier)
- Environment: live_ or test_
- Random: 32 characters, cryptographically random
```

### Key Generation

```typescript
import crypto from 'crypto';

function generateApiKey(environment: 'live' | 'test'): string {
  // Generate 24 bytes of random data, encode as base64url (32 chars)
  const randomPart = crypto.randomBytes(24).toString('base64url');
  return `dh_${environment}_${randomPart}`;
}
```

### Key Storage

**Keys are NEVER stored in plaintext.**

```typescript
function hashApiKey(apiKey: string): string {
  return crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');
}

// Storage in database:
// key_hash: 64-character hex string
// key_prefix: First 12 characters for display (e.g., "dh_live_abc1...")
```

### Key Lifecycle

```
+----------+     +------------+     +-----------+     +---------+
|  Create  | --> |   Active   | --> | Deprecated| --> | Revoked |
+----------+     +------------+     +-----------+     +---------+
                       |                  |
                       |   (rotation)     |  (auto after
                       +------------------+   deprecation period)

                 +------------+
                 |  Expired   |  (after expires_at)
                 +------------+
```

---

## Authorization (Scope System)

### Available Scopes

| Scope | Description |
|-------|-------------|
| `admin` | Full administrative access |
| `read:keys` | View API keys |
| `write:keys` | Create/update/delete API keys |
| `read:requests` | View request logs |
| `read:webhooks` | View webhooks |
| `write:webhooks` | Create/update/delete webhooks |
| `read:rate-limits` | View rate limit status |
| `write:rate-limits` | Modify rate limits |

### Scope Inheritance

The `admin` scope grants access to all endpoints:

```typescript
function hasRequiredScope(keyScopes: string[], required: string): boolean {
  if (keyScopes.includes('admin')) {
    return true;
  }
  return keyScopes.includes(required);
}
```

### Endpoint Scope Requirements

| Endpoint | Required Scope |
|----------|---------------|
| `POST /api/v1/keys` | `write:keys` |
| `GET /api/v1/keys` | `read:keys` |
| `GET /api/v1/requests` | `read:requests` |
| `POST /api/v1/webhooks` | `write:webhooks` |
| `GET /api/v1/rate-limits/status` | (any valid key) |
| `PUT /api/v1/rate-limits/keys/:id` | `admin` |

---

## Rate Limiting Security

### Protection Against Abuse

```
Per-Key Limits:
- requestsPerMinute: 100 (default)
- requestsPerHour: 5000 (default)
- requestsPerDay: 100000 (default)

Per-IP Limits (unauthenticated):
- 60 requests per minute

Global Limits:
- 10,000 requests per minute (total)
```

### Rate Limit Headers

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1705315860
X-RateLimit-Window: minute

# On limit exceeded:
HTTP/1.1 429 Too Many Requests
Retry-After: 45
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705315860
```

---

## Data Protection

### Encryption at Rest

| Data | Encryption Method |
|------|-------------------|
| API Keys | SHA-256 hashed before storage |
| Webhook Secrets | Stored encrypted (AES-256) |
| Request Bodies | Stored in JSONB (DB encryption) |
| Database | PostgreSQL with disk encryption |

### Encryption in Transit

- All external communication over TLS 1.3
- Internal services communicate over encrypted channels
- Redis connections use TLS in production

### Sensitive Data Handling

```typescript
// Headers that are redacted in logs
const SENSITIVE_HEADERS = [
  'authorization',
  'x-api-key',
  'cookie',
  'set-cookie',
];

// Request body fields that are redacted
const SENSITIVE_FIELDS = [
  'password',
  'secret',
  'apiKey',
  'token',
];

function sanitizeForLogging(data: any): any {
  // Recursively replace sensitive values with [REDACTED]
}
```

---

## Input Validation

### Request Validation

All requests are validated using Zod schemas:

```typescript
const createKeySchema = z.object({
  name: z.string().min(3).max(100),
  scopes: z.array(z.enum(VALID_SCOPES)).min(1),
  rateLimit: z.object({
    requestsPerMinute: z.number().min(1).max(100000).optional(),
    requestsPerHour: z.number().min(1).max(10000000).optional(),
  }).optional(),
  expiresAt: z.string().datetime().optional()
    .refine(date => !date || new Date(date) > new Date(), {
      message: 'Expiration must be in the future'
    }),
});
```

### SQL Injection Prevention

All database queries use parameterized statements:

```typescript
// SAFE - Parameterized query
const result = await db.query(
  'SELECT * FROM api_keys WHERE key_hash = $1',
  [keyHash]
);

// NEVER do this:
// const result = await db.query(`SELECT * FROM api_keys WHERE key_hash = '${keyHash}'`);
```

---

## Security Headers

Applied via Helmet middleware:

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      scriptSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
}));
```

### CORS Configuration

```typescript
const corsConfig = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'Retry-After',
  ],
  maxAge: 86400,
};
```

---

## Audit Logging

### Audited Actions

| Action | Description |
|--------|-------------|
| `key.create` | New API key created |
| `key.update` | Key properties modified |
| `key.rotate` | Key rotated |
| `key.revoke` | Key revoked |
| `webhook.create` | Webhook created |
| `webhook.update` | Webhook modified |
| `webhook.delete` | Webhook deleted |
| `rate_limit.update` | Rate limits changed |

### Audit Log Format

```json
{
  "id": "aud_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
  "actor_type": "api_key",
  "actor_id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
  "actor_ip": "192.168.1.100",
  "action": "key.revoke",
  "resource_type": "api_key",
  "resource_id": "key_02I6Y5Z7A9B0C1D2E3F4G5H6I7",
  "old_values": { "status": "active" },
  "new_values": { "status": "revoked" },
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## Webhook Security

### Signature Verification

Webhooks are signed using HMAC-SHA256:

```typescript
function signWebhookPayload(
  payload: object,
  secret: string,
  timestamp: number
): string {
  const body = JSON.stringify(payload);
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${body}`)
    .digest('hex');

  return `t=${timestamp},v1=${signature}`;
}

// Header sent with webhook:
// X-Webhook-Signature: t=1705315200,v1=abc123...
```

### Verification on Receiver Side

```typescript
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string,
  tolerance: number = 300
): boolean {
  const parts = Object.fromEntries(
    signature.split(',').map(p => p.split('='))
  );

  const timestamp = parseInt(parts.t);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${payload}`)
    .digest('hex');

  // Check timestamp is within tolerance
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > tolerance) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(parts.v1),
    Buffer.from(expectedSignature)
  );
}
```

---

## Security Checklist

### Development

- [ ] All API keys hashed before storage
- [ ] Parameterized queries only
- [ ] Input validation on all endpoints
- [ ] Sensitive data redacted in logs
- [ ] HTTPS enforced in production

### Deployment

- [ ] TLS 1.3 configured
- [ ] Security headers enabled
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Audit logging enabled

### Operations

- [ ] Regular security audits
- [ ] Dependency vulnerability scanning
- [ ] Key rotation procedures documented
- [ ] Incident response plan in place

---

## Related Documentation

- [Backend Architecture](./backend.md) - Middleware implementation
- [API Reference](../api/reference.md) - Authentication details
- [DevOps Spec](../../specs/06_devops_lead.md) - Security deployment

---

_This document describes the security architecture for DataHub API Gateway._
