# DataHub API Gateway - Sprint 0 QA Testing Prompt

## Overview

This document provides comprehensive QA testing procedures for Sprint 0 of DataHub API Gateway. Execute all curl commands to verify functionality.

**Base URL**: `http://localhost:3000`

---

## Pre-Test Setup

### 1. Start the Application

```bash
# Start with Docker
docker-compose up -d

# Verify all services are running
docker-compose ps

# Check API health
curl -X GET http://localhost:3000/api/v1/health
```

### 2. Verify Redis Connection

```bash
# Connect to Redis and check
docker exec -it datahub-redis-1 redis-cli ping

# Expected: PONG
```

### 3. Seed Database

```bash
npx prisma db seed
```

---

## Test Suite 1: User Registration

### Test 1.1: Successful Registration

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@datahub.com",
    "password": "SecurePass123!"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "user": {
#       "id": "...",
#       "email": "developer@datahub.com",
#       "role": "developer",
#       "createdAt": "..."
#     },
#     "accessToken": "eyJ...",
#     "refreshToken": "eyJ..."
#   }
# }
```

### Test 1.2: Register Admin User

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@datahub.com",
    "password": "AdminPass123!",
    "role": "admin"
  }'

# Expected: User created with role "admin"
```

### Test 1.3: Duplicate Email

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@datahub.com",
    "password": "AnotherPass123!"
  }'

# Expected Response (409):
# {
#   "success": false,
#   "error": {
#     "code": "CONFLICT",
#     "message": "Email already exists"
#   }
# }
```

### Test 1.4: Invalid Email Format

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "password": "SecurePass123!"
  }'

# Expected Response (400):
# {
#   "success": false,
#   "error": {
#     "code": "VALIDATION_ERROR",
#     "details": [{"field": "email", "message": "Invalid email format"}]
#   }
# }
```

### Test 1.5: Weak Password

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "weak@datahub.com",
    "password": "weak"
  }'

# Expected Response (400): Password validation error
```

---

## Test Suite 2: User Login

### Test 2.1: Successful Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@datahub.com",
    "password": "SecurePass123!"
  }'

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "user": {...},
#     "accessToken": "eyJ...",
#     "refreshToken": "eyJ..."
#   }
# }

# Save token for subsequent tests
export TOKEN="<accessToken>"
export REFRESH_TOKEN="<refreshToken>"
```

### Test 2.2: Invalid Credentials

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "developer@datahub.com",
    "password": "WrongPassword!"
  }'

# Expected Response (401):
# {
#   "success": false,
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "Invalid email or password"
#   }
# }
```

### Test 2.3: Token Refresh

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "'$REFRESH_TOKEN'"
  }'

# Expected Response (200): New access and refresh tokens
```

### Test 2.4: Get Current User

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "email": "developer@datahub.com",
#     "role": "developer"
#   }
# }
```

---

## Test Suite 3: API Key Generation

### Test 3.1: Create API Key with Defaults

```bash
curl -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Development Key"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "name": "Development Key",
#     "apiKey": "dh_live_...",
#     "rateLimitTier": "standard",
#     "createdAt": "..."
#   },
#   "warning": "Save this API key securely. It will not be shown again."
# }

# IMPORTANT: Save the API key!
export API_KEY="dh_live_..."
```

### Test 3.2: Create API Key with Custom Tier

```bash
curl -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Premium Production Key",
    "rateLimitTier": "premium",
    "expiresAt": "2027-01-30T00:00:00.000Z"
  }'

# Expected: API key with premium tier and expiration
```

### Test 3.3: Create API Key with Invalid Tier

```bash
curl -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Invalid Tier Key",
    "rateLimitTier": "ultra-mega"
  }'

# Expected Response (400): Validation error for invalid tier
```

### Test 3.4: List API Keys

```bash
curl -X GET http://localhost:3000/api/v1/api-keys \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "apiKeys": [
#       {
#         "id": "...",
#         "name": "Development Key",
#         "keyPrefix": "dh_live_a1b...",
#         "rateLimitTier": "standard",
#         "isActive": true,
#         "lastUsedAt": null,
#         "createdAt": "..."
#       }
#     ]
#   }
# }
```

### Test 3.5: Get Single API Key

```bash
# Get key ID from list response
export KEY_ID="<id-from-list>"

curl -X GET http://localhost:3000/api/v1/api-keys/$KEY_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200): API key details (without full key)
```

### Test 3.6: Revoke API Key

```bash
curl -X DELETE http://localhost:3000/api/v1/api-keys/$KEY_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "message": "API key revoked successfully"
# }
```

### Test 3.7: Verify Revoked Key in List

```bash
curl -X GET http://localhost:3000/api/v1/api-keys \
  -H "Authorization: Bearer $TOKEN"

# Expected: Revoked key should show isActive: false
```

---

## Test Suite 4: Rate Limit Tiers

### Test 4.1: List Rate Limit Tiers

```bash
curl -X GET http://localhost:3000/api/v1/rate-limits \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "tiers": [
#       {"tierName": "free", "requestsPerMin": 60, ...},
#       {"tierName": "standard", "requestsPerMin": 300, ...},
#       {"tierName": "premium", "requestsPerMin": 1000, ...},
#       {"tierName": "enterprise", "requestsPerMin": 5000, ...}
#     ]
#   }
# }
```

---

## Test Suite 5: Rate Limiting

### Test 5.1: Create Free Tier Key for Testing

```bash
curl -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Free Tier Test Key",
    "rateLimitTier": "free"
  }'

export FREE_API_KEY="dh_live_..."
```

### Test 5.2: Verify Rate Limit Headers

```bash
curl -X GET http://localhost:3000/api/v1/health \
  -H "X-API-Key: $FREE_API_KEY" \
  -v 2>&1 | grep -i "x-ratelimit"

# Expected Headers:
# X-RateLimit-Limit: 60
# X-RateLimit-Remaining: 59
# X-RateLimit-Reset: <timestamp>
```

### Test 5.3: Test Rate Limit Exhaustion (Free Tier)

```bash
#!/bin/bash
# Run 65 requests rapidly to exceed free tier (60/min)

for i in {1..65}; do
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "X-API-Key: $FREE_API_KEY" \
    http://localhost:3000/api/v1/health)
  echo "Request $i: $RESPONSE"

  if [ "$RESPONSE" = "429" ]; then
    echo "Rate limit hit at request $i"
    break
  fi
done
```

### Test 5.4: Rate Limit Exceeded Response

```bash
# After exhausting rate limit:
curl -X GET http://localhost:3000/api/v1/health \
  -H "X-API-Key: $FREE_API_KEY"

# Expected Response (429):
# {
#   "success": false,
#   "error": {
#     "code": "RATE_LIMIT_EXCEEDED",
#     "message": "Too many requests",
#     "retryAfter": <seconds>
#   }
# }
```

### Test 5.5: Verify Different Tier Limits

```bash
# Create premium key
curl -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name": "Premium Test", "rateLimitTier": "premium"}'

export PREMIUM_API_KEY="dh_live_..."

# Check limit header
curl -X GET http://localhost:3000/api/v1/health \
  -H "X-API-Key: $PREMIUM_API_KEY" \
  -v 2>&1 | grep "X-RateLimit-Limit"

# Expected: X-RateLimit-Limit: 1000
```

---

## Test Suite 6: API Key Authentication

### Test 6.1: Valid API Key Access

```bash
curl -X GET http://localhost:3000/api/v1/health \
  -H "X-API-Key: $API_KEY"

# Expected Response (200): Success with rate limit headers
```

### Test 6.2: Invalid API Key

```bash
curl -X GET http://localhost:3000/api/v1/health \
  -H "X-API-Key: dh_live_invalid_key_here"

# Expected Response (401):
# {
#   "success": false,
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "Invalid API key"
#   }
# }
```

### Test 6.3: Expired API Key

```bash
# Create a key with past expiration (would need to manually update DB)
# Or create a key and test after expiration

curl -X GET http://localhost:3000/api/v1/health \
  -H "X-API-Key: <expired-key>"

# Expected Response (401): API key expired
```

### Test 6.4: Revoked API Key Access

```bash
# Use the previously revoked key
curl -X GET http://localhost:3000/api/v1/health \
  -H "X-API-Key: <revoked-key>"

# Expected Response (401):
# {
#   "success": false,
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "API key has been revoked"
#   }
# }
```

---

## Test Suite 7: Authorization Tests

### Test 7.1: User Cannot Access Another User's API Keys

```bash
# Create second user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "other@datahub.com",
    "password": "Other123!"
  }'

# Login as second user
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"other@datahub.com","password":"Other123!"}')
TOKEN2=$(echo $RESPONSE | jq -r '.data.accessToken')

# Try to access first user's API key
curl -X GET http://localhost:3000/api/v1/api-keys/$KEY_ID \
  -H "Authorization: Bearer $TOKEN2"

# Expected Response (404): Key not found (or 403)
```

### Test 7.2: User Cannot Revoke Another User's API Key

```bash
curl -X DELETE http://localhost:3000/api/v1/api-keys/$KEY_ID \
  -H "Authorization: Bearer $TOKEN2"

# Expected Response (404 or 403)
```

---

## Test Suite 8: Last Used Tracking

### Test 8.1: Verify lastUsedAt Updates

```bash
# Use an API key
curl -X GET http://localhost:3000/api/v1/health \
  -H "X-API-Key: $API_KEY"

# Check the key details
curl -X GET http://localhost:3000/api/v1/api-keys \
  -H "Authorization: Bearer $TOKEN"

# Expected: lastUsedAt should be updated with recent timestamp
```

---

## Automated Test Script

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
PASS=0
FAIL=0

test_endpoint() {
  local name="$1"
  local expected_status="$2"
  local actual_status="$3"

  if [ "$actual_status" -eq "$expected_status" ]; then
    echo "[PASS] $name"
    ((PASS++))
  else
    echo "[FAIL] $name (expected $expected_status, got $actual_status)"
    ((FAIL++))
  fi
}

echo "Starting DataHub Sprint 0 QA Tests..."
echo "========================================"

# Test 1: Health Check
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/health")
test_endpoint "Health Check" 200 "$STATUS"

# Test 2: Register User
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"qatest@datahub.com","password":"QaTest123!"}')
test_endpoint "Register User" 201 "$STATUS"

# Test 3: Login
RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"qatest@datahub.com","password":"QaTest123!"}')
TOKEN=$(echo "$RESPONSE" | jq -r '.data.accessToken')

if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo "[PASS] Login"
  ((PASS++))
else
  echo "[FAIL] Login"
  ((FAIL++))
fi

# Test 4: Get Current User
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/auth/me" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "Get Current User" 200 "$STATUS"

# Test 5: Create API Key
RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/api-keys" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"QA Test Key"}')
API_KEY=$(echo "$RESPONSE" | jq -r '.data.apiKey')

if [ -n "$API_KEY" ] && [ "$API_KEY" != "null" ]; then
  echo "[PASS] Create API Key"
  ((PASS++))
else
  echo "[FAIL] Create API Key"
  ((FAIL++))
fi

# Test 6: List API Keys
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/api-keys" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "List API Keys" 200 "$STATUS"

# Test 7: Rate Limit Headers Present
HEADERS=$(curl -s -I "$BASE_URL/api/v1/health" -H "X-API-Key: $API_KEY")
if echo "$HEADERS" | grep -q "X-RateLimit-Limit"; then
  echo "[PASS] Rate Limit Headers"
  ((PASS++))
else
  echo "[FAIL] Rate Limit Headers"
  ((FAIL++))
fi

# Test 8: List Rate Limits
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/rate-limits" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "List Rate Limits" 200 "$STATUS"

echo "========================================"
echo "Results: $PASS passed, $FAIL failed"
```

---

## QA Sign-Off Checklist

- [ ] All registration tests pass
- [ ] All login tests pass
- [ ] API key generation works
- [ ] API key revocation works
- [ ] Rate limit tiers returned correctly
- [ ] Rate limit headers present
- [ ] Rate limiting enforces limits
- [ ] 429 response when limit exceeded
- [ ] API key authentication works
- [ ] Invalid/revoked keys rejected
- [ ] User isolation enforced
- [ ] lastUsedAt tracking works
