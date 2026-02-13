# DataHub API Gateway - Sprint 1 QA Testing Prompt

## Overview

This document provides QA testing procedures for Sprint 1 of DataHub, covering API configuration, permissions, proxying, and analytics.

**Base URL**: `http://localhost:3000`

---

## Pre-Test Setup

### 1. Verify Sprint 0 Working

```bash
# Login as existing user
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "developer@datahub.com", "password": "SecurePass123!"}'

export DEV_TOKEN="<token>"

# Login as admin
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@datahub.com", "password": "AdminPass123!"}'

export ADMIN_TOKEN="<token>"
```

### 2. Create Test API Key

```bash
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"name": "Sprint 1 Test Key"}')

export API_KEY=$(echo $RESPONSE | jq -r '.data.apiKey')
export KEY_ID=$(echo $RESPONSE | jq -r '.data.id')
```

---

## Test Suite 1: API Configuration (Admin Only)

### Test 1.1: Create API (Admin)

```bash
curl -X POST http://localhost:3000/api/v1/apis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "users-service",
    "upstreamUrl": "http://jsonplaceholder.typicode.com",
    "rateLimit": 1000,
    "authRequired": true
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "name": "users-service",
#     "upstreamUrl": "http://jsonplaceholder.typicode.com",
#     "rateLimit": 1000,
#     "authRequired": true
#   }
# }

export API_ID="<id-from-response>"
```

### Test 1.2: Create API (Non-Admin - Should Fail)

```bash
curl -X POST http://localhost:3000/api/v1/apis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{
    "name": "unauthorized-api",
    "upstreamUrl": "http://example.com"
  }'

# Expected Response (403):
# {
#   "success": false,
#   "error": {
#     "code": "FORBIDDEN",
#     "message": "Admin access required"
#   }
# }
```

### Test 1.3: Create Second API

```bash
curl -X POST http://localhost:3000/api/v1/apis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "posts-service",
    "upstreamUrl": "http://jsonplaceholder.typicode.com",
    "rateLimit": 500,
    "authRequired": true
  }'

export API2_ID="<id>"
```

### Test 1.4: List APIs

```bash
curl -X GET http://localhost:3000/api/v1/apis \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Expected: List of registered APIs
```

### Test 1.5: Get Single API

```bash
curl -X GET http://localhost:3000/api/v1/apis/$API_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Expected Response (200): API details
```

### Test 1.6: Update API

```bash
curl -X PUT http://localhost:3000/api/v1/apis/$API_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "rateLimit": 2000
  }'

# Expected Response (200): Updated API with rateLimit: 2000
```

### Test 1.7: Invalid API Name

```bash
curl -X POST http://localhost:3000/api/v1/apis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Invalid Name With Spaces",
    "upstreamUrl": "http://example.com"
  }'

# Expected Response (400): Validation error
```

---

## Test Suite 2: API Permissions

### Test 2.1: Grant Read Permission

```bash
curl -X POST http://localhost:3000/api/v1/api-keys/$KEY_ID/permissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{
    "apiId": "'$API_ID'",
    "permission": "read"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "apiKeyId": "...",
#     "apiId": "...",
#     "apiName": "users-service",
#     "permission": "read"
#   }
# }
```

### Test 2.2: Grant Write Permission to Second API

```bash
curl -X POST http://localhost:3000/api/v1/api-keys/$KEY_ID/permissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{
    "apiId": "'$API2_ID'",
    "permission": "write"
  }'

# Expected Response (201)
```

### Test 2.3: List Permissions

```bash
curl -X GET http://localhost:3000/api/v1/api-keys/$KEY_ID/permissions \
  -H "Authorization: Bearer $DEV_TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "permissions": [
#       {"apiName": "users-service", "permission": "read"},
#       {"apiName": "posts-service", "permission": "write"}
#     ]
#   }
# }
```

### Test 2.4: Duplicate Permission (Should Fail)

```bash
curl -X POST http://localhost:3000/api/v1/api-keys/$KEY_ID/permissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{
    "apiId": "'$API_ID'",
    "permission": "write"
  }'

# Expected Response (409): Permission already exists
```

### Test 2.5: Revoke Permission

```bash
curl -X DELETE http://localhost:3000/api/v1/api-keys/$KEY_ID/permissions/$API2_ID \
  -H "Authorization: Bearer $DEV_TOKEN"

# Expected Response (200): Permission revoked
```

---

## Test Suite 3: Request Proxy

### Test 3.1: Proxy GET Request (With Permission)

```bash
curl -X GET http://localhost:3000/proxy/users-service/users/1 \
  -H "X-API-Key: $API_KEY"

# Expected Response (200): User data from JSONPlaceholder
# {
#   "id": 1,
#   "name": "Leanne Graham",
#   ...
# }
```

### Test 3.2: Proxy Request Without Permission

```bash
curl -X GET http://localhost:3000/proxy/posts-service/posts/1 \
  -H "X-API-Key: $API_KEY"

# Expected Response (403):
# {
#   "success": false,
#   "error": {
#     "code": "FORBIDDEN",
#     "message": "No permission for this API"
#   }
# }
```

### Test 3.3: Proxy POST with Read-Only Permission

```bash
curl -X POST http://localhost:3000/proxy/users-service/users \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"name": "Test User"}'

# Expected Response (403):
# {
#   "success": false,
#   "error": {
#     "code": "FORBIDDEN",
#     "message": "Write permission required"
#   }
# }
```

### Test 3.4: Proxy to Non-Existent API

```bash
curl -X GET http://localhost:3000/proxy/nonexistent-api/test \
  -H "X-API-Key: $API_KEY"

# Expected Response (404):
# {
#   "success": false,
#   "error": {
#     "code": "NOT_FOUND",
#     "message": "API not found"
#   }
# }
```

### Test 3.5: Proxy Without API Key (Auth Required)

```bash
curl -X GET http://localhost:3000/proxy/users-service/users/1

# Expected Response (401):
# {
#   "success": false,
#   "error": {
#     "code": "UNAUTHORIZED",
#     "message": "API key required"
#   }
# }
```

### Test 3.6: Grant Write Permission and Retry POST

```bash
# Grant write permission
curl -X DELETE http://localhost:3000/api/v1/api-keys/$KEY_ID/permissions/$API_ID \
  -H "Authorization: Bearer $DEV_TOKEN"

curl -X POST http://localhost:3000/api/v1/api-keys/$KEY_ID/permissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"apiId": "'$API_ID'", "permission": "write"}'

# Now POST should work
curl -X POST http://localhost:3000/proxy/users-service/users \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"name": "Test User", "email": "test@example.com"}'

# Expected Response (201): Created user
```

---

## Test Suite 4: Request Logging

### Test 4.1: Make Several Requests

```bash
# Make 10 requests to generate logs
for i in {1..10}; do
  curl -s -o /dev/null http://localhost:3000/proxy/users-service/users/$i \
    -H "X-API-Key: $API_KEY"
  sleep 0.1
done

echo "Made 10 requests"
```

### Test 4.2: Verify Logs in Database

```bash
# Connect to database and check logs
docker exec -it datahub-timescaledb-1 psql -U postgres -d datahub -c \
  "SELECT method, path, status_code, latency_ms, timestamp FROM request_logs ORDER BY timestamp DESC LIMIT 10"

# Expected: 10 rows with request details
```

---

## Test Suite 5: Analytics Endpoints

### Test 5.1: Get Request Counts

```bash
FROM=$(date -d "1 hour ago" -u +"%Y-%m-%dT%H:%M:%SZ")
TO=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

curl -X GET "http://localhost:3000/api/v1/analytics/requests?from=$FROM&to=$TO&interval=hour" \
  -H "Authorization: Bearer $DEV_TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "timeSeries": [
#       {"timestamp": "...", "count": 10}
#     ],
#     "total": 10
#   }
# }
```

### Test 5.2: Get Request Counts by API Key

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/requests?apiKeyId=$KEY_ID&from=$FROM&to=$TO" \
  -H "Authorization: Bearer $DEV_TOKEN"

# Expected: Filtered by specific API key
```

### Test 5.3: Get Error Rates

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/errors?from=$FROM&to=$TO" \
  -H "Authorization: Bearer $DEV_TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "totalErrors": X,
#     "errorRate": X.X,
#     "byStatusCode": {...}
#   }
# }
```

### Test 5.4: Get Latency Percentiles

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/latency?from=$FROM&to=$TO" \
  -H "Authorization: Bearer $DEV_TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "percentiles": {
#       "p50": XX,
#       "p75": XX,
#       "p90": XX,
#       "p95": XX,
#       "p99": XX
#     },
#     "average": XX,
#     "min": XX,
#     "max": XX
#   }
# }
```

### Test 5.5: Get Top APIs

```bash
curl -X GET "http://localhost:3000/api/v1/analytics/top-apis?from=$FROM&to=$TO&limit=10" \
  -H "Authorization: Bearer $DEV_TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "apis": [
#       {
#         "name": "users-service",
#         "requestCount": 10,
#         "errorRate": 0,
#         "avgLatencyMs": XX
#       }
#     ]
#   }
# }
```

---

## Test Suite 6: Regression Tests (Sprint 0)

### Test 6.1: Auth Still Works

```bash
# Login
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"developer@datahub.com","password":"SecurePass123!"}' | jq -e '.success == true' && echo "PASS: Login" || echo "FAIL: Login"
```

### Test 6.2: API Key Creation Still Works

```bash
curl -s -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"name":"Regression Test Key"}' | jq -e '.success == true' && echo "PASS: Create API Key" || echo "FAIL: Create API Key"
```

### Test 6.3: Rate Limiting Still Works

```bash
# Create free tier key and test rate limit
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"name":"Rate Test","rateLimitTier":"free"}')
FREE_KEY=$(echo $RESPONSE | jq -r '.data.apiKey')

# Check headers
curl -s -I http://localhost:3000/api/v1/health -H "X-API-Key: $FREE_KEY" | grep -q "X-RateLimit-Limit" && echo "PASS: Rate Limit Headers" || echo "FAIL: Rate Limit Headers"
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

echo "DataHub Sprint 1 QA Tests"
echo "========================="

# Setup
ADMIN_RESP=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@datahub.com","password":"AdminPass123!"}')
ADMIN_TOKEN=$(echo "$ADMIN_RESP" | jq -r '.data.accessToken')

DEV_RESP=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"developer@datahub.com","password":"SecurePass123!"}')
DEV_TOKEN=$(echo "$DEV_RESP" | jq -r '.data.accessToken')

# API Configuration Tests
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/v1/apis" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"qa-api","upstreamUrl":"http://example.com"}')
test_endpoint "Create API (Admin)" 201 "$STATUS"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/v1/apis" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"name":"qa-api-2","upstreamUrl":"http://example.com"}')
test_endpoint "Create API (Non-Admin Rejected)" 403 "$STATUS"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/apis" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
test_endpoint "List APIs" 200 "$STATUS"

echo "========================="
echo "Results: $PASS passed, $FAIL failed"
```

---

## QA Sign-Off Checklist

### API Configuration
- [ ] Create API (admin only)
- [ ] Non-admin rejected
- [ ] List APIs works
- [ ] Update API works
- [ ] Delete API works

### Permissions
- [ ] Grant permission works
- [ ] List permissions works
- [ ] Revoke permission works
- [ ] Duplicate permission rejected

### Proxy
- [ ] GET with permission works
- [ ] POST with write permission works
- [ ] POST with read-only rejected
- [ ] No permission rejected
- [ ] Non-existent API returns 404
- [ ] Missing API key returns 401

### Analytics
- [ ] Request counts accurate
- [ ] Error rates calculated
- [ ] Latency percentiles work
- [ ] Top APIs sorted correctly

### Regression
- [ ] Auth endpoints work
- [ ] API key CRUD works
- [ ] Rate limiting works
