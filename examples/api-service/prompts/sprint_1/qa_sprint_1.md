# Sprint 1 QA Review: Core API Features

## Environment: claude-code

## Context - Read These Files First

**MANDATORY:** Read ALL these files to understand what should be tested:

- specs/02_backend_lead.md - API design, authentication, rate limiting
- specs/05_qa_lead.md - test strategy, coverage targets
- specs/backlog.md - Sprint 1 tickets
- docs/api/reference.md - endpoint contracts
- docs/api/authentication.md - auth flow
- docs/api/error-codes.md - error responses
- docs/api/rate-limiting.md - rate limit rules
- docs/testing/strategy.md - test pyramid
- docs/testing/integration-tests.md - integration test patterns

---

## QA Mission

Review and test ALL tickets completed in Sprint 1.

**Sprint Goal:** Implement API key management, authentication, and rate limiting.
**Tickets to Review:** 22

---

## Pre-QA Setup

Before running tests, ensure the environment is ready:

```bash
# 1. Navigate to project directory
cd /path/to/datahub-api-gateway

# 2. Start Docker services
docker-compose up -d postgres redis

# 3. Wait for services to be healthy
sleep 10

# 4. Run database migrations
npm run db:migrate

# 5. Seed an admin API key for testing
# Create a seed script or insert directly:
docker-compose exec postgres psql -U datahub -d datahub -c "
INSERT INTO api_keys (id, name, key_hash, key_prefix, scopes, rate_limit_tier, is_active)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Admin Test Key',
  '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  'dh_test_adm',
  '{admin}',
  'enterprise',
  true
);
"
# Note: The hash above is for 'test' - you'll need the actual admin key

# 6. Start the API server
npm run dev &
API_PID=$!

# 7. Wait for server to be ready
sleep 5

# 8. Set admin key variable (replace with actual generated key)
export ADMIN_KEY="dh_test_admin_key_here"

# 9. Verify server is running
curl -s http://localhost:3000/health | jq
```

---

## Automated Test Suite

Run the full automated test suite:

```bash
# All tests
npm test
# Expected: All tests pass

# Coverage report
npm run test:coverage
# Expected: Coverage > 80% for Sprint 1 code

# Specific test suites
npm test -- --testPathPattern="keyGenerator"
npm test -- --testPathPattern="keyHasher"
npm test -- --testPathPattern="apiKeyRepository"
npm test -- --testPathPattern="authenticate"
npm test -- --testPathPattern="authorize"
npm test -- --testPathPattern="rateLimiter"
```

---

## API Testing with Curl (MANDATORY)

**IMPORTANT:** These tests MUST be run with the server running.

### Setup: Create Test API Keys

```bash
# Create a key with full access for testing
curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QA Full Access Key",
    "scopes": ["read:keys", "write:keys", "read:requests", "write:webhooks"],
    "rate_limit_tier": "standard"
  }' | jq

# Save the returned key
export FULL_KEY="<key-from-response>"

# Create a read-only key
curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "QA Read Only Key",
    "scopes": ["read:keys"],
    "rate_limit_tier": "free"
  }' | jq

# Save the read-only key
export READONLY_KEY="<key-from-response>"
```

---

### Test: POST /api/v1/keys (Create Key)

**Endpoint:** POST /api/v1/keys
**Ticket:** DH-021

#### Happy Path Test
```bash
# Create a new API key
curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production Integration Key",
    "scopes": ["read:keys", "write:keys"],
    "rate_limit_tier": "premium",
    "expires_at": "2025-12-31T23:59:59Z",
    "metadata": { "environment": "production", "team": "platform" }
  }' | jq

# Expected Response (HTTP 201):
# {
#   "id": "<uuid>",
#   "name": "Production Integration Key",
#   "key": "dh_live_...",  <-- Full key returned ONLY on creation
#   "key_prefix": "dh_live_xxx",
#   "scopes": ["read:keys", "write:keys"],
#   "rate_limit_tier": "premium",
#   "is_active": true,
#   "expires_at": "2025-12-31T23:59:59.000Z",
#   "created_at": "..."
# }
```

#### Validation Error Test - Missing Name
```bash
curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "scopes": ["read:keys"]
  }' | jq

# Expected Response (HTTP 400):
# {
#   "error": "Validation Error",
#   "code": "VALIDATION_ERROR",
#   "message": "Request body validation failed",
#   "details": [
#     { "field": "name", "message": "Required" }
#   ]
# }
```

#### Validation Error Test - Empty Scopes
```bash
curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Key",
    "scopes": []
  }' | jq

# Expected Response (HTTP 400):
# {
#   "error": "Validation Error",
#   "details": [
#     { "field": "scopes", "message": "Array must contain at least 1 element" }
#   ]
# }
```

#### Validation Error Test - Invalid Rate Limit Tier
```bash
curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Key",
    "scopes": ["read:keys"],
    "rate_limit_tier": "ultra"
  }' | jq

# Expected Response (HTTP 400):
# {
#   "error": "Validation Error",
#   "details": [
#     { "field": "rate_limit_tier", "message": "Invalid enum value" }
#   ]
# }
```

#### Authorization Test - Insufficient Scopes
```bash
curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $READONLY_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Should Fail",
    "scopes": ["read:keys"]
  }' | jq

# Expected Response (HTTP 403):
# {
#   "error": "Forbidden",
#   "code": "INSUFFICIENT_PERMISSIONS",
#   "message": "Missing required scope: write:keys"
# }
```

---

### Test: GET /api/v1/keys (List Keys)

**Endpoint:** GET /api/v1/keys
**Ticket:** DH-022

#### Happy Path Test
```bash
# List all keys with default pagination
curl -s -X GET "http://localhost:3000/api/v1/keys" \
  -H "Authorization: Bearer $FULL_KEY" | jq

# Expected Response (HTTP 200):
# {
#   "data": [
#     { "id": "...", "name": "...", "key_prefix": "...", ... }
#   ],
#   "pagination": {
#     "page": 1,
#     "limit": 20,
#     "total": 5,
#     "total_pages": 1
#   }
# }
```

#### Pagination Test
```bash
# Page 1 with limit 2
curl -s -X GET "http://localhost:3000/api/v1/keys?page=1&limit=2" \
  -H "Authorization: Bearer $FULL_KEY" | jq

# Expected: 2 items, pagination shows correct totals

# Page 2
curl -s -X GET "http://localhost:3000/api/v1/keys?page=2&limit=2" \
  -H "Authorization: Bearer $FULL_KEY" | jq

# Expected: Next set of items
```

#### Filter by Status
```bash
# Only active keys
curl -s -X GET "http://localhost:3000/api/v1/keys?is_active=true" \
  -H "Authorization: Bearer $FULL_KEY" | jq

# Expected: Only active keys returned
```

#### Filter by Rate Limit Tier
```bash
curl -s -X GET "http://localhost:3000/api/v1/keys?rate_limit_tier=premium" \
  -H "Authorization: Bearer $FULL_KEY" | jq

# Expected: Only premium tier keys
```

#### Unauthorized Test
```bash
curl -s -X GET "http://localhost:3000/api/v1/keys" | jq

# Expected Response (HTTP 401):
# {
#   "error": "Unauthorized",
#   "message": "API key required"
# }
```

---

### Test: GET /api/v1/keys/:id (Get Single Key)

**Endpoint:** GET /api/v1/keys/:id
**Ticket:** DH-023

#### Happy Path Test
```bash
# Get a specific key by ID
KEY_ID="<uuid-from-create-response>"
curl -s -X GET "http://localhost:3000/api/v1/keys/$KEY_ID" \
  -H "Authorization: Bearer $FULL_KEY" | jq

# Expected Response (HTTP 200):
# {
#   "id": "<uuid>",
#   "name": "Production Integration Key",
#   "key_prefix": "dh_live_xxx",
#   "scopes": ["read:keys", "write:keys"],
#   "rate_limit_tier": "premium",
#   "is_active": true,
#   "expires_at": "2025-12-31T23:59:59.000Z",
#   "last_used_at": null,
#   "created_at": "...",
#   "updated_at": "...",
#   "metadata": { "environment": "production", "team": "platform" }
# }
```

#### Not Found Test
```bash
curl -s -X GET "http://localhost:3000/api/v1/keys/00000000-0000-0000-0000-000000000000" \
  -H "Authorization: Bearer $FULL_KEY" | jq

# Expected Response (HTTP 404):
# {
#   "error": "Not Found",
#   "message": "API key not found"
# }
```

#### Invalid UUID Test
```bash
curl -s -X GET "http://localhost:3000/api/v1/keys/not-a-uuid" \
  -H "Authorization: Bearer $FULL_KEY" | jq

# Expected Response (HTTP 400):
# {
#   "error": "Validation Error",
#   "message": "Invalid key ID format"
# }
```

---

### Test: PUT /api/v1/keys/:id (Update Key)

**Endpoint:** PUT /api/v1/keys/:id
**Ticket:** DH-024

#### Happy Path Test
```bash
curl -s -X PUT "http://localhost:3000/api/v1/keys/$KEY_ID" \
  -H "Authorization: Bearer $FULL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Key Name",
    "scopes": ["read:keys", "write:keys", "read:requests"],
    "rate_limit_tier": "enterprise",
    "metadata": { "team": "security" }
  }' | jq

# Expected Response (HTTP 200):
# {
#   "id": "<uuid>",
#   "name": "Updated Key Name",
#   "scopes": ["read:keys", "write:keys", "read:requests"],
#   "rate_limit_tier": "enterprise",
#   ...
# }
```

#### Partial Update Test
```bash
curl -s -X PUT "http://localhost:3000/api/v1/keys/$KEY_ID" \
  -H "Authorization: Bearer $FULL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Only Name Changed"
  }' | jq

# Expected: Only name changed, other fields unchanged
```

#### Clear Expiration Test
```bash
curl -s -X PUT "http://localhost:3000/api/v1/keys/$KEY_ID" \
  -H "Authorization: Bearer $FULL_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "expires_at": null
  }' | jq

# Expected: expires_at set to null (key never expires)
```

---

### Test: DELETE /api/v1/keys/:id (Revoke Key)

**Endpoint:** DELETE /api/v1/keys/:id
**Ticket:** DH-025

#### Create a Key to Delete
```bash
# Create a temporary key
TEMP_KEY=$(curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "To Be Deleted",
    "scopes": ["read:keys"]
  }')
TEMP_ID=$(echo $TEMP_KEY | jq -r '.id')
echo "Created key: $TEMP_ID"
```

#### Delete Key Test
```bash
curl -s -X DELETE "http://localhost:3000/api/v1/keys/$TEMP_ID" \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -w "\nHTTP Status: %{http_code}\n"

# Expected: HTTP 204 No Content (empty body)
```

#### Verify Key is Revoked
```bash
# Key should still exist but be inactive
curl -s -X GET "http://localhost:3000/api/v1/keys/$TEMP_ID" \
  -H "Authorization: Bearer $FULL_KEY" | jq '.is_active'

# Expected: false

# Using the deleted key should fail
DELETED_KEY=$(echo $TEMP_KEY | jq -r '.key')
curl -s http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $DELETED_KEY" | jq

# Expected Response (HTTP 401):
# {
#   "error": "Unauthorized",
#   "message": "API key has been revoked"
# }
```

---

### Test: POST /api/v1/keys/:id/rotate (Key Rotation)

**Endpoint:** POST /api/v1/keys/:id/rotate
**Ticket:** DH-026

#### Create a Key to Rotate
```bash
ROTATE_KEY=$(curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Key To Rotate",
    "scopes": ["read:keys"]
  }')
ROTATE_ID=$(echo $ROTATE_KEY | jq -r '.id')
OLD_KEY=$(echo $ROTATE_KEY | jq -r '.key')
echo "Created key ID: $ROTATE_ID"
```

#### Rotate Key Test
```bash
curl -s -X POST "http://localhost:3000/api/v1/keys/$ROTATE_ID/rotate" \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "deprecation_period_hours": 24
  }' | jq

# Expected Response (HTTP 200):
# {
#   "id": "<uuid>",
#   "name": "Key To Rotate",
#   "key": "dh_live_NEW_KEY...",
#   "key_prefix": "dh_live_new",
#   "old_key_expires_at": "2024-01-16T10:00:00.000Z",
#   "message": "Old key will continue working for 24 hours"
# }

# Save new key
NEW_KEY=$(curl -s -X POST "http://localhost:3000/api/v1/keys/$ROTATE_ID/rotate" \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"deprecation_period_hours": 24}' | jq -r '.key')
```

#### Both Keys Work During Deprecation Period
```bash
# Old key should still work
curl -s http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $OLD_KEY" | jq '.pagination'

# Expected: Success (200)

# New key should also work
curl -s http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $NEW_KEY" | jq '.pagination'

# Expected: Success (200)
```

---

### Test: Authentication Middleware

**Ticket:** DH-019

#### No Token Test
```bash
curl -s http://localhost:3000/api/v1/keys | jq

# Expected Response (HTTP 401):
# {
#   "error": "Unauthorized",
#   "message": "API key required"
# }
```

#### Invalid Token Format Test
```bash
curl -s http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer invalid_format" | jq

# Expected Response (HTTP 401):
# {
#   "error": "Unauthorized",
#   "message": "Invalid API key format"
# }
```

#### Expired Key Test
```bash
# Create an already-expired key (via direct DB insert for testing)
docker-compose exec postgres psql -U datahub -d datahub -c "
INSERT INTO api_keys (id, name, key_hash, key_prefix, scopes, expires_at)
VALUES (
  'expired00-0000-0000-0000-000000000000',
  'Expired Key',
  '$(echo -n 'test_expired_key' | sha256sum | cut -d' ' -f1)',
  'dh_test_exp',
  '{read:keys}',
  '2020-01-01 00:00:00'
);
"

curl -s http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer dh_test_exp_test_expired_key" | jq

# Expected Response (HTTP 401):
# {
#   "error": "Unauthorized",
#   "message": "API key has expired"
# }
```

#### X-API-Key Header Test
```bash
# Should also accept X-API-Key header
curl -s http://localhost:3000/api/v1/keys \
  -H "X-API-Key: $FULL_KEY" | jq

# Expected: Success (200)
```

---

### Test: Authorization (Scope Checking)

**Ticket:** DH-020

#### Read Scope for Read Endpoint
```bash
curl -s http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $READONLY_KEY" | jq

# Expected: Success (200) - read:keys scope is sufficient
```

#### Write Scope Required for Write Endpoint
```bash
curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $READONLY_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "scopes": ["read:keys"]}' | jq

# Expected Response (HTTP 403):
# {
#   "error": "Forbidden",
#   "code": "INSUFFICIENT_PERMISSIONS",
#   "message": "Missing required scope: write:keys"
# }
```

#### Admin Scope Has Full Access
```bash
# Admin should be able to do everything
curl -s http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" | jq

# Expected: Success
```

---

### Test: Rate Limiting

**Tickets:** DH-027, DH-028, DH-029

#### Check Rate Limit Headers
```bash
curl -s -D - http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $FULL_KEY" \
  -o /dev/null 2>&1 | grep -i "x-ratelimit"

# Expected Headers:
# X-RateLimit-Limit-Minute: 300
# X-RateLimit-Remaining-Minute: 299
# X-RateLimit-Reset-Minute: <timestamp>
# X-RateLimit-Limit-Hour: 10000
# X-RateLimit-Remaining-Hour: 9999
# X-RateLimit-Reset-Hour: <timestamp>
```

#### Rate Limit Status Endpoint
```bash
curl -s http://localhost:3000/api/v1/rate-limits/status \
  -H "Authorization: Bearer $FULL_KEY" | jq

# Expected Response (HTTP 200):
# {
#   "tier": "standard",
#   "limits": {
#     "minute": { "limit": 300, "remaining": 298, "reset": 1705315200 },
#     "hour": { "limit": 10000, "remaining": 9998, "reset": 1705316400 },
#     "day": { "limit": 100000, "remaining": 99998, "reset": 1705363200 }
#   }
# }
```

#### Exceed Rate Limit Test (Free Tier)
```bash
# Create a free tier key
FREE_KEY=$(curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Free Tier Test",
    "scopes": ["read:keys"],
    "rate_limit_tier": "free"
  }' | jq -r '.key')

# Make 61 requests quickly (free tier = 60/minute)
for i in {1..61}; do
  RESP=$(curl -s -w "\n%{http_code}" http://localhost:3000/api/v1/keys \
    -H "Authorization: Bearer $FREE_KEY")
  STATUS=$(echo "$RESP" | tail -1)
  if [ "$STATUS" = "429" ]; then
    echo "Rate limited at request $i"
    echo "$RESP" | head -n -1 | jq
    break
  fi
done

# Expected: Rate limited after ~60 requests
# {
#   "error": "Rate limit exceeded",
#   "message": "You have exceeded the minute rate limit",
#   "retry_after": 45,
#   "limits": { ... }
# }
```

#### Retry-After Header on 429
```bash
# When rate limited, check Retry-After header
curl -s -D - http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $FREE_KEY" \
  -o /dev/null 2>&1 | grep -i "retry-after"

# Expected: Retry-After: <seconds>
```

---

### Test: Error Handling

**Ticket:** DH-032

#### JSON Parse Error
```bash
curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d 'not valid json' | jq

# Expected Response (HTTP 400):
# {
#   "error": "Bad Request",
#   "message": "Invalid JSON"
# }
```

#### Request ID in Error Response
```bash
curl -s http://localhost:3000/api/v1/nonexistent \
  -H "Authorization: Bearer $FULL_KEY" | jq '.request_id'

# Expected: UUID present in response
```

---

### Test: Zod Validation

**Ticket:** DH-033

#### String Length Validation
```bash
# Name too long (> 255 chars)
curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$(printf 'x%.0s' {1..300})\",
    \"scopes\": [\"read:keys\"]
  }" | jq

# Expected Response (HTTP 400):
# {
#   "error": "Validation Error",
#   "details": [
#     { "field": "name", "message": "String must contain at most 255 character(s)" }
#   ]
# }
```

#### Invalid DateTime Format
```bash
curl -s -X POST http://localhost:3000/api/v1/keys \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "scopes": ["read:keys"],
    "expires_at": "not-a-date"
  }' | jq

# Expected Response (HTTP 400):
# {
#   "error": "Validation Error",
#   "details": [
#     { "field": "expires_at", "message": "Invalid datetime" }
#   ]
# }
```

---

## Per-Ticket QA Review

### Tickets DH-016, DH-017: Key Generation and Hashing
- [ ] Keys are 32+ bytes of random data
- [ ] Keys are base64url encoded
- [ ] Keys have correct prefix format
- [ ] Hash is SHA-256 hex encoded
- [ ] Same key always produces same hash

**QA Result:** [PASS/FAIL]

---

### Ticket DH-018: API Key Repository
- [ ] CRUD operations work correctly
- [ ] Pagination returns correct results
- [ ] Filters work as expected
- [ ] Soft delete sets is_active = false

**QA Result:** [PASS/FAIL]

---

### Ticket DH-019: Authentication Middleware
- [ ] Accepts Bearer token in Authorization header
- [ ] Accepts X-API-Key header
- [ ] Validates key format
- [ ] Rejects expired keys
- [ ] Rejects revoked keys
- [ ] Updates last_used_at timestamp

**QA Result:** [PASS/FAIL]

---

### Ticket DH-020: Authorization Middleware
- [ ] Checks required scopes
- [ ] Admin scope has full access
- [ ] Wildcard scopes work (read:*)
- [ ] Returns 403 for insufficient permissions

**QA Result:** [PASS/FAIL]

---

### Tickets DH-021 through DH-026: API Endpoints
- [ ] All CRUD operations work
- [ ] Validation prevents bad data
- [ ] Key rotation works correctly
- [ ] Both old and new keys work during deprecation

**QA Result:** [PASS/FAIL]

---

### Tickets DH-027, DH-028, DH-029: Rate Limiting
- [ ] Sliding window algorithm works
- [ ] All tiers enforce correct limits
- [ ] Headers returned on all responses
- [ ] 429 returned when limit exceeded
- [ ] Retry-After header present on 429

**QA Result:** [PASS/FAIL]

---

### Tickets DH-031, DH-032, DH-033: Middleware & Validation
- [ ] Request IDs generated and returned
- [ ] Error responses have consistent format
- [ ] Zod validation catches invalid input
- [ ] All error codes documented

**QA Result:** [PASS/FAIL]

---

### Tickets DH-034 through DH-037: Tests
- [ ] Unit tests for key service pass
- [ ] Unit tests for rate limiter pass
- [ ] Integration tests for auth pass
- [ ] Integration tests for endpoints pass
- [ ] Coverage > 80%

**QA Result:** [PASS/FAIL]

---

## QA Summary

### Test Results
| Category | Passed | Failed | Coverage |
|----------|--------|--------|----------|
| Unit Tests | /X | 0 | XX% |
| Integration Tests | /X | 0 | XX% |
| API Curl Tests | /30 | 0 | N/A |
| Security Tests | /5 | 0 | N/A |

### Issues Found
| Ticket | Issue | Severity | Action |
|--------|-------|----------|--------|
| | | | |

### Overall Verdict
- [ ] **PASS** - All tests pass, ready for release
- [ ] **FAIL** - Issues found, needs fixes

---

## Post-QA Actions

### If PASS:
1. Update all ticket statuses from qa-review to done in specs/backlog.md
2. Run summary_sprint_1.md to generate sprint documentation
3. Merge to main branch
4. Tag release: `git tag -a v0.2.0 -m "Sprint 1: Core API Features"`

### If FAIL:
1. Document issues in Bug Backlog section of specs/backlog.md
2. Keep tickets in qa-review status
3. Fix issues and re-run QA

---

## Cleanup

```bash
# Stop the server
kill $API_PID 2>/dev/null || pkill -f "npm run dev" || true

# Clean up test data (optional)
docker-compose exec postgres psql -U datahub -d datahub -c "
DELETE FROM api_keys WHERE name LIKE 'QA%' OR name LIKE 'Test%';
"

# Stop Docker services
docker-compose down
```
