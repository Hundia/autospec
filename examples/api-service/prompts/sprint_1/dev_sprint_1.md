# Sprint 1 Development Execution: Core API Features

## Environment: claude-code

## Context - Read These Files First

**MANDATORY:** Read ALL these files before writing any code:

### Specs (Read ALL):
- specs/01_product_manager.md - requirements, personas, user flows
- specs/02_backend_lead.md - API design, service layer, error handling
- specs/04_db_architect.md - database schema, migrations, queries
- specs/05_qa_lead.md - test strategy, coverage targets
- specs/backlog.md - Sprint 1 tickets (your work items)

### Docs (Read ALL relevant):
- docs/architecture/overview.md - system architecture
- docs/architecture/backend.md - backend layer design
- docs/architecture/database.md - ERD, tables, relationships
- docs/architecture/security.md - auth flow, security rules
- docs/api/reference.md - endpoint contracts
- docs/api/authentication.md - auth endpoints, token flow
- docs/api/error-codes.md - error code catalog
- docs/api/rate-limiting.md - rate limit rules
- docs/testing/strategy.md - test pyramid, tooling
- docs/testing/unit-tests.md - unit test patterns
- docs/testing/integration-tests.md - integration test patterns
- docs/project/coding-standards.md - naming conventions, patterns

---

## Your Mission

Execute Sprint 1: Core API Features

**Goal:** Implement API key management, authentication, and rate limiting.

---

## Tickets to Complete

| #      | Ticket                                                         | Points | Status  | Owner   | Model  | Depends        |
| ------ | -------------------------------------------------------------- | ------ | ------- | ------- | ------ | -------------- |
| DH-016 | Implement API key generation utility with secure random tokens | 3      | Pending | Backend | Sonnet | DH-007         |
| DH-017 | Implement API key hashing service using SHA-256                | 2      | Pending | Backend | Sonnet | DH-016         |
| DH-018 | Create API key repository with CRUD database operations        | 5      | Pending | Backend | Sonnet | DH-007, DH-017 |
| DH-019 | Implement authentication middleware for API key validation     | 5      | Pending | Backend | Opus   | DH-018         |
| DH-020 | Implement scope-based authorization middleware                 | 5      | Pending | Backend | Opus   | DH-019         |
| DH-021 | Create POST /api/v1/keys endpoint for key creation             | 3      | Pending | Backend | Sonnet | DH-018, DH-020 |
| DH-022 | Create GET /api/v1/keys endpoint with pagination and filtering | 3      | Pending | Backend | Sonnet | DH-018, DH-020 |
| DH-023 | Create GET /api/v1/keys/:id endpoint for single key retrieval  | 2      | Pending | Backend | Sonnet | DH-018, DH-020 |
| DH-024 | Create PUT /api/v1/keys/:id endpoint for key updates           | 2      | Pending | Backend | Sonnet | DH-018, DH-020 |
| DH-025 | Create DELETE /api/v1/keys/:id endpoint for key revocation     | 2      | Pending | Backend | Sonnet | DH-018, DH-020 |
| DH-026 | Implement POST /api/v1/keys/:id/rotate for key rotation        | 5      | Pending | Backend | Opus   | DH-018, DH-020 |
| DH-027 | Implement sliding window rate limiter service using Redis      | 8      | Pending | Backend | Opus   | DH-005         |
| DH-028 | Create rate limiting middleware with multi-tier support        | 5      | Pending | Backend | Opus   | DH-027         |
| DH-029 | Implement rate limit headers in responses                      | 2      | Pending | Backend | Sonnet | DH-028         |
| DH-030 | Create GET /api/v1/rate-limits/status endpoint                 | 2      | Pending | Backend | Sonnet | DH-027, DH-020 |
| DH-031 | Implement request ID middleware for tracing                    | 2      | Pending | Backend | Sonnet | DH-003         |
| DH-032 | Create standardized error handling middleware                  | 3      | Pending | Backend | Sonnet | DH-003         |
| DH-033 | Implement Zod validation schemas for all endpoints             | 3      | Pending | Backend | Sonnet | DH-021         |
| DH-034 | Write unit tests for API key service                           | 3      | Pending | QA      | Sonnet | DH-018         |
| DH-035 | Write unit tests for rate limiter service                      | 3      | Pending | QA      | Sonnet | DH-027         |
| DH-036 | Write integration tests for authentication flow                | 3      | Pending | QA      | Sonnet | DH-019, DH-020 |
| DH-037 | Write integration tests for API key endpoints                  | 3      | Pending | QA      | Sonnet | DH-021, DH-026 |

---

## Execution Instructions

### For Each Ticket:

1. **Update Status:** Change ticket from Pending to in-progress in specs/backlog.md
2. **Read Relevant Spec:** Find the specific section in the appropriate spec file
3. **Implement:** Write code following patterns in docs/
4. **Test:** Write tests per docs/testing/ patterns
5. **Verify:** Run `npm test`, `npm run lint`, `npm run typecheck`
6. **Commit:** `git commit -m "Complete DH-XXX: [ticket description]"`
7. **Update Status:** Change ticket from in-progress to qa-review in specs/backlog.md

---

## Ticket-by-Ticket Breakdown

### Ticket DH-016: Implement API key generation utility
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Spec Reference:** specs/02_backend_lead.md, Section: API Key Management

**Implementation Steps:**
1. Install crypto module (built-in Node.js)
2. Create key generation function using crypto.randomBytes
3. Generate 32-byte random token
4. Encode as base64url for safe transport
5. Add 8-character prefix for easy identification (e.g., "dh_live_" or "dh_test_")
6. Return both the full key and the prefix

**API Key Format:**
```
dh_live_[base64url-encoded-32-bytes]
Example: dh_live_abc123XYZ789...
```

**Files to Create/Modify:**
- `src/services/keyGenerator.ts` - Key generation service
- `src/services/keyGenerator.test.ts` - Unit tests

**Verification:**
```bash
npm test -- keyGenerator
```

**Dependencies:** DH-007 (api_keys table must exist)

---

### Ticket DH-017: Implement API key hashing service using SHA-256
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 2

**Spec Reference:** specs/02_backend_lead.md, Section: Security

**Implementation Steps:**
1. Create hashing function using crypto.createHash('sha256')
2. Hash the full API key (after prefix removal)
3. Return hex-encoded hash for storage
4. Create comparison function for validation

**Security Notes:**
- Never store plaintext API keys
- Use constant-time comparison to prevent timing attacks

**Files to Create/Modify:**
- `src/services/keyHasher.ts` - Hashing service
- `src/services/keyHasher.test.ts` - Unit tests

**Verification:**
```bash
npm test -- keyHasher
```

**Dependencies:** DH-016

---

### Ticket DH-018: Create API key repository with CRUD operations
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 5

**Spec Reference:** specs/04_db_architect.md, Section: api_keys table

**Implementation Steps:**
1. Create ApiKeyRepository class
2. Implement create() - insert new key
3. Implement findById() - get by UUID
4. Implement findByHash() - lookup by key hash
5. Implement findByPrefix() - lookup by prefix
6. Implement list() - paginated listing with filters
7. Implement update() - update key metadata
8. Implement delete() - soft delete (set is_active = false)
9. Implement updateLastUsed() - touch last_used_at timestamp

**Repository Interface:**
```typescript
interface ApiKeyRepository {
  create(data: CreateApiKeyDto): Promise<ApiKey>;
  findById(id: string): Promise<ApiKey | null>;
  findByHash(hash: string): Promise<ApiKey | null>;
  findByPrefix(prefix: string): Promise<ApiKey | null>;
  list(options: ListOptions): Promise<PaginatedResult<ApiKey>>;
  update(id: string, data: UpdateApiKeyDto): Promise<ApiKey>;
  delete(id: string): Promise<void>;
  updateLastUsed(id: string): Promise<void>;
}
```

**Files to Create/Modify:**
- `src/repositories/apiKeyRepository.ts` - Repository implementation
- `src/types/apiKey.ts` - Type definitions
- `src/repositories/apiKeyRepository.test.ts` - Unit tests

**Verification:**
```bash
npm test -- apiKeyRepository
```

**Dependencies:** DH-007, DH-017

---

### Ticket DH-019: Implement authentication middleware (OPUS)
**Owner:** Backend  |  **Model:** Opus  |  **Points:** 5

**Spec Reference:** specs/02_backend_lead.md, Section: Authentication

**Implementation Steps:**
1. Extract API key from Authorization header (Bearer token) or X-API-Key header
2. Validate key format (prefix + hash length)
3. Hash the key using DH-017 service
4. Look up key in database
5. Verify key is active and not expired
6. Attach key metadata to request context
7. Handle caching (optional: cache valid keys in Redis for 60s)
8. Return 401 for invalid/expired keys

**Auth Flow:**
```
1. Request arrives with Authorization: Bearer dh_live_xxx...
2. Extract token from header
3. Validate format
4. Hash token
5. Query database for matching hash
6. Check is_active = true
7. Check expires_at > now (if set)
8. Update last_used_at (async, don't block)
9. Attach api_key to req.context
10. Call next()
```

**Error Cases:**
- No token: 401 "API key required"
- Invalid format: 401 "Invalid API key format"
- Key not found: 401 "Invalid API key"
- Key inactive: 401 "API key has been revoked"
- Key expired: 401 "API key has expired"

**Files to Create/Modify:**
- `src/middleware/authenticate.ts` - Auth middleware
- `src/types/request.ts` - Extended request type
- `src/middleware/authenticate.test.ts` - Unit tests

**Verification:**
```bash
npm test -- authenticate
```

**Dependencies:** DH-018

---

### Ticket DH-020: Implement scope-based authorization middleware (OPUS)
**Owner:** Backend  |  **Model:** Opus  |  **Points:** 5

**Spec Reference:** specs/02_backend_lead.md, Section: Authorization

**Implementation Steps:**
1. Create requireScopes() middleware factory
2. Read scopes from authenticated API key
3. Check if required scope(s) are present
4. Support scope inheritance (admin includes all)
5. Support wildcard scopes (read:* for all read operations)
6. Return 403 for insufficient permissions

**Scope Hierarchy:**
```
admin (full access)
├── read:*
│   ├── read:keys
│   ├── read:requests
│   └── read:webhooks
└── write:*
    ├── write:keys
    └── write:webhooks
```

**Usage Example:**
```typescript
router.post('/keys', authenticate, requireScopes('write:keys'), createKey);
router.get('/keys', authenticate, requireScopes('read:keys'), listKeys);
```

**Files to Create/Modify:**
- `src/middleware/authorize.ts` - Authorization middleware
- `src/utils/scopes.ts` - Scope checking utilities
- `src/middleware/authorize.test.ts` - Unit tests

**Verification:**
```bash
npm test -- authorize
```

**Dependencies:** DH-019

---

### Ticket DH-021: Create POST /api/v1/keys endpoint
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Spec Reference:** specs/02_backend_lead.md, Section: Key Management API

**Request:**
```json
POST /api/v1/keys
Authorization: Bearer <admin-key>
Content-Type: application/json

{
  "name": "Production Key",
  "scopes": ["read:keys", "write:keys"],
  "rate_limit_tier": "standard",
  "expires_at": "2025-12-31T23:59:59Z",
  "metadata": { "environment": "production" }
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "name": "Production Key",
  "key": "dh_live_xxxxx...",  // Only returned on creation!
  "key_prefix": "dh_live_xxx",
  "scopes": ["read:keys", "write:keys"],
  "rate_limit_tier": "standard",
  "is_active": true,
  "expires_at": "2025-12-31T23:59:59Z",
  "created_at": "2024-01-15T10:00:00Z"
}
```

**Implementation Notes:**
- Generate key using DH-016
- Hash key using DH-017
- Store hash in database, return plaintext key once
- Key is NEVER returned again after creation

**Files to Create/Modify:**
- `src/routes/keys.ts` - Route handler
- `src/controllers/keysController.ts` - Controller logic
- `src/services/apiKeyService.ts` - Business logic

**Verification:**
```bash
curl -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Key", "scopes": ["read:keys"]}'
```

**Dependencies:** DH-018, DH-020

---

### Ticket DH-022: Create GET /api/v1/keys endpoint with pagination
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Spec Reference:** specs/02_backend_lead.md, Section: Key Management API

**Request:**
```
GET /api/v1/keys?page=1&limit=20&is_active=true&rate_limit_tier=standard
Authorization: Bearer <key-with-read:keys>
```

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Production Key",
      "key_prefix": "dh_live_xxx",
      "scopes": ["read:keys"],
      "rate_limit_tier": "standard",
      "is_active": true,
      "expires_at": null,
      "last_used_at": "2024-01-15T09:30:00Z",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

**Files to Create/Modify:**
- `src/routes/keys.ts` - Add GET route
- `src/controllers/keysController.ts` - Add list handler

**Dependencies:** DH-018, DH-020

---

### Ticket DH-023: Create GET /api/v1/keys/:id endpoint
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 2

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Production Key",
  "key_prefix": "dh_live_xxx",
  "scopes": ["read:keys"],
  "rate_limit_tier": "standard",
  "is_active": true,
  "expires_at": null,
  "last_used_at": "2024-01-15T09:30:00Z",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-10T12:00:00Z",
  "metadata": {}
}
```

**Error Cases:**
- Key not found: 404

**Dependencies:** DH-018, DH-020

---

### Ticket DH-024: Create PUT /api/v1/keys/:id endpoint
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 2

**Request:**
```json
PUT /api/v1/keys/:id

{
  "name": "Updated Name",
  "scopes": ["read:keys", "write:keys"],
  "rate_limit_tier": "premium",
  "expires_at": "2026-01-01T00:00:00Z",
  "metadata": { "team": "platform" }
}
```

**Notes:**
- Cannot change key_hash or key_prefix
- Can update name, scopes, rate_limit_tier, expires_at, metadata
- Create audit log entry for changes

**Dependencies:** DH-018, DH-020

---

### Ticket DH-025: Create DELETE /api/v1/keys/:id endpoint
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 2

**Implementation:**
- Soft delete: set is_active = false
- Key remains in database for audit purposes
- Returns 204 No Content on success

**Dependencies:** DH-018, DH-020

---

### Ticket DH-026: Implement POST /api/v1/keys/:id/rotate (OPUS)
**Owner:** Backend  |  **Model:** Opus  |  **Points:** 5

**Spec Reference:** specs/02_backend_lead.md, Section: Key Rotation

**Request:**
```json
POST /api/v1/keys/:id/rotate

{
  "deprecation_period_hours": 24
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Production Key",
  "key": "dh_live_NEW_KEY...",
  "key_prefix": "dh_live_new",
  "old_key_expires_at": "2024-01-16T10:00:00Z",
  "message": "Old key will continue working for 24 hours"
}
```

**Implementation (Complex):**
1. Generate new key
2. Store new key hash
3. Keep old key valid for deprecation period
4. Both keys work during overlap period
5. After deprecation period, old key returns 401
6. Create audit log entry

**Transaction Safety:**
- Use database transaction for atomic update
- Handle concurrent rotation attempts

**Dependencies:** DH-018, DH-020

---

### Ticket DH-027: Implement sliding window rate limiter (OPUS)
**Owner:** Backend  |  **Model:** Opus  |  **Points:** 8

**Spec Reference:** specs/02_backend_lead.md, Section: Rate Limiting

**Implementation Steps:**
1. Use Redis sorted sets for sliding window
2. Key format: `ratelimit:{api_key_id}:{window}`
3. Window types: minute, hour, day
4. Use ZADD with timestamp scores
5. Use ZREMRANGEBYSCORE to prune old entries
6. Use ZCARD to count current window
7. Return remaining, limit, reset time

**Redis Commands (per request):**
```lua
-- Lua script for atomic rate limit check
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

-- Remove old entries
redis.call('ZREMRANGEBYSCORE', key, 0, now - window)

-- Count current entries
local count = redis.call('ZCARD', key)

if count < limit then
    -- Add new entry
    redis.call('ZADD', key, now, now .. ':' .. math.random())
    redis.call('EXPIRE', key, window)
    return {1, limit - count - 1, window}  -- allowed, remaining, reset
else
    return {0, 0, window}  -- blocked, remaining, reset
end
```

**Rate Limit Tiers:**
```typescript
const RATE_LIMITS = {
  free: { minute: 60, hour: 1000, day: 10000 },
  standard: { minute: 300, hour: 10000, day: 100000 },
  premium: { minute: 1000, hour: 50000, day: 500000 },
  enterprise: { minute: 5000, hour: 200000, day: 2000000 }
};
```

**Files to Create/Modify:**
- `src/services/rateLimiter.ts` - Rate limiter service
- `src/services/rateLimiter.test.ts` - Unit tests

**Dependencies:** DH-005

---

### Ticket DH-028: Create rate limiting middleware (OPUS)
**Owner:** Backend  |  **Model:** Opus  |  **Points:** 5

**Implementation Steps:**
1. Get API key from request context
2. Look up rate limit tier
3. Check all windows (minute, hour, day)
4. If any limit exceeded, return 429
5. If allowed, proceed with request
6. Add rate limit info to response headers (DH-029)

**429 Response:**
```json
{
  "error": "Rate limit exceeded",
  "message": "You have exceeded the minute rate limit",
  "retry_after": 45,
  "limits": {
    "minute": { "limit": 60, "remaining": 0, "reset": 1705315200 },
    "hour": { "limit": 1000, "remaining": 450, "reset": 1705316400 }
  }
}
```

**Files to Create/Modify:**
- `src/middleware/rateLimit.ts` - Rate limit middleware

**Dependencies:** DH-027

---

### Ticket DH-029: Implement rate limit headers
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 2

**Headers to Add:**
```
X-RateLimit-Limit-Minute: 300
X-RateLimit-Remaining-Minute: 285
X-RateLimit-Reset-Minute: 1705315200
X-RateLimit-Limit-Hour: 10000
X-RateLimit-Remaining-Hour: 9500
X-RateLimit-Reset-Hour: 1705316400
Retry-After: 45  (only on 429)
```

**Dependencies:** DH-028

---

### Ticket DH-030: Create GET /api/v1/rate-limits/status endpoint
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 2

**Response (200):**
```json
{
  "tier": "standard",
  "limits": {
    "minute": { "limit": 300, "remaining": 285, "reset": 1705315200 },
    "hour": { "limit": 10000, "remaining": 9500, "reset": 1705316400 },
    "day": { "limit": 100000, "remaining": 95000, "reset": 1705363200 }
  }
}
```

**Dependencies:** DH-027, DH-020

---

### Ticket DH-031: Implement request ID middleware
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 2

**Implementation:**
1. Check for incoming X-Request-ID header
2. If present, use it (for distributed tracing)
3. If not, generate UUID v4
4. Attach to request context
5. Add to response headers

**Already partially done in Sprint 0, enhance if needed.**

**Dependencies:** DH-003

---

### Ticket DH-032: Create standardized error handling middleware
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Error Response Format:**
```json
{
  "error": "Validation Error",
  "code": "VALIDATION_ERROR",
  "message": "Request body validation failed",
  "details": [
    { "field": "name", "message": "Name is required" }
  ],
  "request_id": "uuid"
}
```

**Error Classes:**
```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) { super(message); }
}

class ValidationError extends AppError { /* 400 */ }
class UnauthorizedError extends AppError { /* 401 */ }
class ForbiddenError extends AppError { /* 403 */ }
class NotFoundError extends AppError { /* 404 */ }
class RateLimitError extends AppError { /* 429 */ }
class InternalError extends AppError { /* 500 */ }
```

**Dependencies:** DH-003

---

### Ticket DH-033: Implement Zod validation schemas
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Schemas to Create:**
```typescript
// POST /api/v1/keys
const createKeySchema = z.object({
  name: z.string().min(1).max(255),
  scopes: z.array(z.string()).min(1),
  rate_limit_tier: z.enum(['free', 'standard', 'premium', 'enterprise']).optional(),
  expires_at: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional()
});

// PUT /api/v1/keys/:id
const updateKeySchema = z.object({
  name: z.string().min(1).max(255).optional(),
  scopes: z.array(z.string()).optional(),
  rate_limit_tier: z.enum(['free', 'standard', 'premium', 'enterprise']).optional(),
  expires_at: z.string().datetime().nullable().optional(),
  metadata: z.record(z.unknown()).optional()
});

// GET /api/v1/keys query params
const listKeysQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  is_active: z.enum(['true', 'false']).optional(),
  rate_limit_tier: z.enum(['free', 'standard', 'premium', 'enterprise']).optional()
});

// POST /api/v1/keys/:id/rotate
const rotateKeySchema = z.object({
  deprecation_period_hours: z.number().int().min(0).max(168).default(24)
});
```

**Files to Create/Modify:**
- `src/schemas/keys.ts` - Key validation schemas
- `src/middleware/validate.ts` - Validation middleware

**Dependencies:** DH-021

---

### Tickets DH-034 through DH-037: Tests
**Owner:** QA  |  **Model:** Sonnet  |  **Points:** 3 each

Write comprehensive tests following patterns in docs/testing/. Include:
- Happy path tests
- Error case tests
- Edge case tests
- Mock external dependencies

**Dependencies:** Respective implementation tickets

---

## After All Tickets Complete

1. Run full verification:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run test:coverage
   npm run build
   ```

2. Manual API testing:
   ```bash
   # Start server
   docker-compose up -d
   npm run dev

   # Create admin key (first key must be created via DB seed or special endpoint)
   # Test all endpoints with curl
   ```

3. Update all ticket statuses to qa-review in specs/backlog.md

4. Commit all changes:
   ```bash
   git add -A
   git commit -m "Complete Sprint 1: Core API Features"
   ```

5. Proceed to QA: Run prompts/sprint_1/qa_sprint_1.md
