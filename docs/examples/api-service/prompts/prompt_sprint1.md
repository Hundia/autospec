# Sprint 1: Core API Features

## Sprint Goal
Implement API key management, authentication, rate limiting, and core request processing for DataHub API Gateway.

## Sprint Context
- **Project**: DataHub API Gateway
- **Type**: API-only service (no frontend)
- **Tech Stack**: Node.js, TypeScript, Express.js, PostgreSQL, Redis
- **Duration**: 2 weeks
- **Total Points**: 52
- **Prerequisites**: Sprint 0 completed

## Reference Specifications
- `specs/02_backend_lead.md` - API design, authentication, rate limiting
- `specs/04_db_architect.md` - Database schema (api_keys table)
- `specs/05_qa_lead.md` - Testing patterns and examples

---

## Sprint 1 Tickets

| # | Ticket | Status | Owner | Model | Depends | Points |
|---|--------|--------|-------|-------|---------|--------|
| DH-016 | Implement API key generation utility with secure random tokens | Pending | Backend | Sonnet | DH-007 | 3 |
| DH-017 | Implement API key hashing service using SHA-256 | Pending | Backend | Sonnet | DH-016 | 2 |
| DH-018 | Create API key repository with CRUD database operations | Pending | Backend | Sonnet | DH-007, DH-017 | 5 |
| DH-019 | Implement authentication middleware for API key validation | Pending | Backend | Opus | DH-018 | 5 |
| DH-020 | Implement scope-based authorization middleware | Pending | Backend | Opus | DH-019 | 5 |
| DH-021 | Create POST /api/v1/keys endpoint for key creation | Pending | Backend | Sonnet | DH-018, DH-020 | 3 |
| DH-022 | Create GET /api/v1/keys endpoint with pagination and filtering | Pending | Backend | Sonnet | DH-018, DH-020 | 3 |
| DH-023 | Create GET /api/v1/keys/:id endpoint for single key retrieval | Pending | Backend | Sonnet | DH-018, DH-020 | 2 |
| DH-024 | Create PUT /api/v1/keys/:id endpoint for key updates | Pending | Backend | Sonnet | DH-018, DH-020 | 2 |
| DH-025 | Create DELETE /api/v1/keys/:id endpoint for key revocation | Pending | Backend | Sonnet | DH-018, DH-020 | 2 |
| DH-026 | Implement POST /api/v1/keys/:id/rotate for key rotation | Pending | Backend | Opus | DH-018, DH-020 | 5 |
| DH-027 | Implement sliding window rate limiter service using Redis | Pending | Backend | Opus | DH-005 | 8 |
| DH-028 | Create rate limiting middleware with multi-tier support | Pending | Backend | Opus | DH-027 | 5 |
| DH-029 | Implement rate limit headers in responses | Pending | Backend | Sonnet | DH-028 | 2 |
| DH-030 | Create GET /api/v1/rate-limits/status endpoint | Pending | Backend | Sonnet | DH-027, DH-020 | 2 |
| DH-031 | Implement request ID middleware for tracing | Pending | Backend | Sonnet | DH-003 | 2 |
| DH-032 | Create standardized error handling middleware | Pending | Backend | Sonnet | DH-003 | 3 |
| DH-033 | Implement Zod validation schemas for all endpoints | Pending | Backend | Sonnet | DH-021 | 3 |
| DH-034 | Write unit tests for API key service | Pending | QA | Sonnet | DH-018 | 3 |
| DH-035 | Write unit tests for rate limiter service | Pending | QA | Sonnet | DH-027 | 3 |
| DH-036 | Write integration tests for authentication flow | Pending | QA | Sonnet | DH-019, DH-020 | 3 |
| DH-037 | Write integration tests for API key endpoints | Pending | QA | Sonnet | DH-021, DH-026 | 3 |

---

## Ticket Details

### DH-016: Implement API key generation utility

**Description**: Create a secure API key generation utility following the defined format.

**Key Format**: `dh_{environment}_{random_string}`
- Prefix: `dh_`
- Environment: `live_` or `test_`
- Random: 32 character base64url string

**Requirements**:
- Use `crypto.randomBytes()` for secure generation
- Support both live and test environments
- Generate cryptographically secure random strings
- Validate key format

**Files to Create**:
- `src/services/keyGenerator.ts`

**Implementation Reference** (from `specs/02_backend_lead.md`):
```typescript
const generateApiKey = (environment: 'live' | 'test'): string => {
  const randomPart = crypto.randomBytes(24).toString('base64url');
  return `dh_${environment}_${randomPart}`;
};
```

**Acceptance Criteria**:
- [ ] Keys match format `dh_{env}_{32chars}`
- [ ] Keys are unique (test with 1000 generations)
- [ ] Format validation function works

---

### DH-017: Implement API key hashing service

**Description**: Create SHA-256 hashing service for secure API key storage.

**Requirements**:
- Use SHA-256 for consistent hashing
- Produce 64 character hex output
- Support optional salt from environment

**Files to Create**:
- `src/services/keyHasher.ts`

**Implementation Reference**:
```typescript
const hashApiKey = (apiKey: string): string => {
  return crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');
};
```

**Acceptance Criteria**:
- [ ] Same input produces same hash
- [ ] Different inputs produce different hashes
- [ ] Output is 64 character hex string

---

### DH-018: Create API key repository

**Description**: Implement database operations for API keys.

**Methods Required**:
- `create(data)` - Insert new key
- `findById(id)` - Get key by ID
- `findByHash(hash)` - Get key by hash (for auth)
- `findAll(options)` - List with pagination/filtering
- `update(id, data)` - Update key properties
- `revoke(id)` - Soft delete (set status)
- `updateLastUsed(id)` - Update usage timestamp

**Files to Create**:
- `src/repositories/keyRepository.ts`
- `src/types/apiKey.ts`

**Acceptance Criteria**:
- [ ] All CRUD operations working
- [ ] Pagination working correctly
- [ ] Filtering by status working
- [ ] Search by name working

---

### DH-019: Implement authentication middleware (Opus)

**Description**: Create middleware to validate API keys on protected routes.

**Authentication Flow**:
1. Extract API key from header (`X-API-Key` or `Authorization: Bearer`)
2. Hash the key
3. Look up in database/cache
4. Validate status (active, not expired)
5. Attach key info to request context

**Requirements**:
- Support both header formats
- Cache validated keys in Redis (5 min TTL)
- Log authentication failures
- Return appropriate error codes

**Error Responses**:
- 401 `MISSING_API_KEY` - No key provided
- 401 `INVALID_API_KEY` - Key not found or invalid
- 401 `KEY_EXPIRED` - Key has expired
- 401 `KEY_REVOKED` - Key has been revoked

**Files to Create**:
- `src/middleware/auth.ts`

**Acceptance Criteria**:
- [ ] Valid keys pass authentication
- [ ] Invalid keys return 401
- [ ] Revoked keys return 401
- [ ] Expired keys return 401
- [ ] Key caching working

---

### DH-020: Implement scope-based authorization middleware (Opus)

**Description**: Create middleware to check API key scopes for endpoint access.

**Scope System**:
| Scope | Description |
|-------|-------------|
| `admin` | Full access to all endpoints |
| `read:keys` | View API keys |
| `write:keys` | Create/update/delete keys |
| `read:requests` | View request logs |
| `read:webhooks` | View webhooks |
| `write:webhooks` | Manage webhooks |

**Requirements**:
- Check if key has required scope(s)
- Support multiple required scopes (AND logic)
- `admin` scope grants all permissions
- Return 403 for insufficient scope

**Usage**:
```typescript
router.post('/keys',
  requireScope('write:keys'),
  createKeyHandler
);
```

**Files to Create**:
- `src/middleware/authorize.ts`
- `src/types/scopes.ts`

**Acceptance Criteria**:
- [ ] Correct scope allows access
- [ ] Missing scope returns 403
- [ ] Admin scope grants all access
- [ ] Multiple scopes checked correctly

---

### DH-021: Create POST /api/v1/keys endpoint

**Description**: Implement API key creation endpoint.

**Request Body**:
```json
{
  "name": "Production Service",
  "description": "API key for production",
  "scopes": ["read:requests", "write:requests"],
  "rateLimit": {
    "requestsPerMinute": 1000,
    "requestsPerHour": 50000
  },
  "expiresAt": "2025-01-15T00:00:00Z",
  "metadata": {}
}
```

**Required Scope**: `admin` or `write:keys`

**Response 201**:
- Return full key details including the actual API key
- Note: API key only shown once at creation

**Files to Create**:
- `src/routes/keys.ts`
- `src/handlers/keys/create.ts`

**Acceptance Criteria**:
- [ ] Key created with correct data
- [ ] API key returned in response
- [ ] Validation errors return 400
- [ ] Scope authorization enforced

---

### DH-022: Create GET /api/v1/keys endpoint

**Description**: List API keys with pagination and filtering.

**Query Parameters**:
- `page` (default: 1)
- `pageSize` (default: 20, max: 100)
- `status` (active, revoked, expired, all)
- `search` (name/description search)
- `sortBy`, `sortOrder`

**Required Scope**: `admin` or `read:keys`

**Response**: Paginated list without full API keys (only prefix)

**Files to Create**:
- `src/handlers/keys/list.ts`

**Acceptance Criteria**:
- [ ] Pagination working
- [ ] Filtering by status working
- [ ] Search working
- [ ] API keys not exposed (only prefix)

---

### DH-023: Create GET /api/v1/keys/:id endpoint

**Description**: Get single API key details.

**Required Scope**: `admin` or `read:keys`

**Response**: Full key details without the actual API key

**Files to Create**:
- `src/handlers/keys/get.ts`

**Acceptance Criteria**:
- [ ] Returns correct key data
- [ ] 404 for non-existent key
- [ ] API key not exposed

---

### DH-024: Create PUT /api/v1/keys/:id endpoint

**Description**: Update API key properties.

**Updatable Fields**:
- name
- description
- scopes
- rateLimit
- metadata
- expiresAt

**Required Scope**: `admin` or `write:keys`

**Files to Create**:
- `src/handlers/keys/update.ts`

**Acceptance Criteria**:
- [ ] Fields updated correctly
- [ ] 404 for non-existent key
- [ ] Cannot update revoked key
- [ ] Validation working

---

### DH-025: Create DELETE /api/v1/keys/:id endpoint

**Description**: Revoke (soft delete) an API key.

**Required Scope**: `admin` or `write:keys`

**Behavior**:
- Set status to `revoked`
- Set revokedAt timestamp
- Key immediately unusable

**Files to Create**:
- `src/handlers/keys/revoke.ts`

**Acceptance Criteria**:
- [ ] Key status set to revoked
- [ ] Key immediately unusable
- [ ] 404 for non-existent key

---

### DH-026: Implement POST /api/v1/keys/:id/rotate (Opus)

**Description**: Rotate an API key by creating new one and deprecating old.

**Request Body**:
```json
{
  "deprecationPeriod": 86400
}
```

**Behavior**:
1. Create new key with same config
2. Set old key status to `deprecated`
3. Set old key expiry based on deprecation period
4. Link new key to old key (rotated_from_id)

**Required Scope**: `admin` or `write:keys`

**Files to Create**:
- `src/handlers/keys/rotate.ts`

**Acceptance Criteria**:
- [ ] New key created with correct config
- [ ] Old key deprecated
- [ ] Both keys work during deprecation period
- [ ] Old key expires after period

---

### DH-027: Implement sliding window rate limiter (Opus)

**Description**: Create Redis-based sliding window rate limiter.

**Algorithm**: Sliding Window Log
- Use Redis sorted sets
- Store request timestamps as scores
- Remove entries outside window
- Count remaining entries

**Configuration Per Key**:
- requestsPerMinute
- requestsPerHour
- requestsPerDay
- burstLimit

**Files to Create**:
- `src/services/rateLimiter.ts`

**Implementation Reference** (from `specs/02_backend_lead.md`):
```typescript
interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;
  retryAfter?: number;
}
```

**Acceptance Criteria**:
- [ ] Correctly counts requests in window
- [ ] Blocks when limit exceeded
- [ ] Provides accurate remaining count
- [ ] Calculates correct reset time

---

### DH-028: Create rate limiting middleware (Opus)

**Description**: Apply rate limiting to all authenticated requests.

**Multi-Tier Checking**:
1. Check per-minute limit
2. Check per-hour limit
3. Check per-day limit
4. All must pass

**Requirements**:
- Get limits from authenticated key
- Check all tiers
- Return 429 when exceeded
- Include retry-after header

**Files to Create**:
- `src/middleware/rateLimit.ts`

**Acceptance Criteria**:
- [ ] Rate limiting enforced
- [ ] Multi-tier working
- [ ] 429 returned with correct headers
- [ ] Limits from key config used

---

### DH-029: Implement rate limit headers

**Description**: Add rate limit headers to all responses.

**Headers**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 850
X-RateLimit-Reset: 1705315860
X-RateLimit-Window: minute
```

**For 429 Responses**:
```
Retry-After: 45
```

**Files to Modify**:
- `src/middleware/rateLimit.ts`

**Acceptance Criteria**:
- [ ] Headers present on all responses
- [ ] Values accurate
- [ ] Retry-After on 429

---

### DH-030: Create GET /api/v1/rate-limits/status endpoint

**Description**: Return current rate limit status for the requesting key.

**Required Scope**: Any valid key

**Response**:
```json
{
  "keyId": "key_xxx",
  "limits": {
    "perMinute": {
      "limit": 1000,
      "remaining": 850,
      "resetsAt": "2024-01-15T10:31:00Z"
    },
    "perHour": { ... },
    "perDay": { ... }
  }
}
```

**Files to Create**:
- `src/routes/rateLimits.ts`
- `src/handlers/rateLimits/status.ts`

**Acceptance Criteria**:
- [ ] Returns correct limits
- [ ] Returns accurate remaining
- [ ] Reset times correct

---

### DH-031: Implement request ID middleware

**Description**: Add unique request ID to all requests for tracing.

**Requirements**:
- Generate UUID for each request
- Check for existing `X-Request-ID` header
- Attach to request context
- Include in response headers

**Files to Create**:
- `src/middleware/requestId.ts`

**Acceptance Criteria**:
- [ ] Unique ID on every request
- [ ] Preserves incoming X-Request-ID
- [ ] ID in response header

---

### DH-032: Create standardized error handling middleware

**Description**: Implement consistent error response format.

**Error Response Format**:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  },
  "meta": {
    "timestamp": "...",
    "requestId": "..."
  }
}
```

**Error Codes**: See `specs/02_backend_lead.md` for complete list.

**Files to Create/Modify**:
- `src/middleware/errorHandler.ts`
- `src/utils/ApiError.ts`

**Acceptance Criteria**:
- [ ] Consistent error format
- [ ] Correct status codes
- [ ] Request ID included
- [ ] Stack trace hidden in production

---

### DH-033: Implement Zod validation schemas

**Description**: Create validation schemas for all request bodies.

**Schemas Needed**:
- `createKeySchema`
- `updateKeySchema`
- `rotateKeySchema`
- `paginationSchema`
- `keyFilterSchema`

**Files to Create**:
- `src/validation/schemas.ts`
- `src/middleware/validate.ts`

**Acceptance Criteria**:
- [ ] All endpoints validated
- [ ] Detailed validation errors returned
- [ ] Types inferred from schemas

---

### DH-034: Write unit tests for API key service

**Description**: Comprehensive unit tests for key management.

**Test Cases**:
- Key generation format
- Key hashing consistency
- Repository CRUD operations
- Validation logic

**Files to Create**:
- `tests/unit/services/keyService.test.ts`

**Reference**: See `specs/05_qa_lead.md` for test patterns.

**Acceptance Criteria**:
- [ ] > 80% code coverage
- [ ] All edge cases tested
- [ ] Mocking used appropriately

---

### DH-035: Write unit tests for rate limiter service

**Description**: Unit tests for rate limiting logic.

**Test Cases**:
- Under limit allows request
- At limit blocks request
- Remaining count accuracy
- Reset time calculation
- Window expiration

**Files to Create**:
- `tests/unit/services/rateLimiter.test.ts`

**Acceptance Criteria**:
- [ ] > 80% code coverage
- [ ] Redis mocked correctly
- [ ] Edge cases covered

---

### DH-036: Write integration tests for authentication

**Description**: End-to-end tests for authentication flow.

**Test Cases**:
- Request without API key (401)
- Invalid API key (401)
- Valid API key (success)
- Revoked key (401)
- Expired key (401)
- Key in header formats

**Files to Create**:
- `tests/integration/auth.test.ts`

**Acceptance Criteria**:
- [ ] All auth scenarios tested
- [ ] Uses test database
- [ ] Clean isolation between tests

---

### DH-037: Write integration tests for API key endpoints

**Description**: Integration tests for all key management endpoints.

**Test Cases**:
- Create key with valid data
- Create key with invalid data
- List keys with pagination
- List keys with filters
- Get single key
- Update key
- Revoke key
- Rotate key

**Files to Create**:
- `tests/integration/keys.test.ts`

**Acceptance Criteria**:
- [ ] All endpoints tested
- [ ] Authorization tested
- [ ] Error cases tested
- [ ] Test data cleanup

---

## Sprint 1 Completion Checklist

- [ ] All 22 tickets completed
- [ ] API keys can be created, listed, updated, revoked
- [ ] Key rotation working
- [ ] Authentication rejects invalid keys
- [ ] Rate limiting working at all tiers
- [ ] Rate limit headers in responses
- [ ] Validation on all endpoints
- [ ] Unit test coverage > 80%
- [ ] Integration tests passing
- [ ] No linting errors

---

## Notes for Implementation

1. **Opus Model Tickets**: DH-019, DH-020, DH-026, DH-027, DH-028 are marked for Opus due to their complexity. These involve:
   - Complex authentication flows
   - Rate limiting algorithms
   - Multi-step business logic

2. **Dependency Order**:
   - Start with DH-016, DH-017 (no deps)
   - Then DH-018 (needs DH-017)
   - Then DH-019, DH-020 (needs DH-018)
   - Endpoint handlers after DH-020
   - DH-027 can run parallel (only needs DH-005)

3. **Testing Strategy**:
   - Write tests alongside implementation
   - Use factories for test data
   - Mock Redis for rate limiter tests

4. **API Design**: Follow patterns in `specs/02_backend_lead.md` for:
   - Request/response formats
   - Error codes
   - Header conventions
