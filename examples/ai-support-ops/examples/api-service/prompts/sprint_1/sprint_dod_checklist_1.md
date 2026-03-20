# DataHub API Gateway - Sprint 1 Definition of Done Checklist

## Overview

This checklist verifies Sprint 1 meets all DoD criteria.

---

## 1. Code Quality Checks

```bash
npm run lint && echo "PASS: Lint" || echo "FAIL: Lint"
npx tsc --noEmit && echo "PASS: TypeScript" || echo "FAIL: TypeScript"
npx prettier --check "src/**/*.ts" && echo "PASS: Prettier" || echo "FAIL: Prettier"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 2. Testing Checks

### 2.1 Unit Tests

```bash
npm run test && echo "PASS: Tests" || echo "FAIL: Tests"
```

### 2.2 Test Coverage

```bash
npm run test:coverage
# Verify >= 70%
```

**Coverage**: _____%

### 2.3 Sprint 0 Regression

```bash
npm run test -- auth.test.ts && echo "PASS: Auth" || echo "FAIL: Auth"
npm run test -- apiKey.test.ts && echo "PASS: API Keys" || echo "FAIL: API Keys"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 3. Database Checks

### 3.1 Migrations

```bash
npx prisma migrate status
npx prisma migrate deploy && echo "PASS" || echo "FAIL"
```

### 3.2 TimescaleDB Hypertable

```bash
psql $DATABASE_URL -c "SELECT * FROM timescaledb_information.hypertables WHERE hypertable_name = 'request_logs'"

# Should return 1 row
```

### 3.3 Tables Exist

```bash
psql $DATABASE_URL -c "\dt"

# Should include: apis, api_permissions, request_logs
```

**Status**: [ ] PASS  [ ] FAIL

---

## 4. API Verification

### 4.1 Setup

```bash
# Get admin token
ADMIN_RESP=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@datahub.com","password":"AdminPass123!"}')
ADMIN_TOKEN=$(echo "$ADMIN_RESP" | jq -r '.data.accessToken')

# Get dev token
DEV_RESP=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"developer@datahub.com","password":"SecurePass123!"}')
DEV_TOKEN=$(echo "$DEV_RESP" | jq -r '.data.accessToken')
```

### 4.2 API Configuration

```bash
# Create API
API_RESP=$(curl -s -X POST http://localhost:3000/api/v1/apis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"dod-api","upstreamUrl":"http://jsonplaceholder.typicode.com"}')

echo "$API_RESP" | jq -e '.success == true' && echo "PASS: Create API" || echo "FAIL: Create API"

API_ID=$(echo "$API_RESP" | jq -r '.data.id')

# List APIs
curl -s http://localhost:3000/api/v1/apis \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq -e '.success == true' && echo "PASS: List APIs" || echo "FAIL: List APIs"

# Non-admin rejected
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/v1/apis \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"name":"test","upstreamUrl":"http://test.com"}')

[ "$STATUS" = "403" ] && echo "PASS: Admin-only" || echo "FAIL: Admin-only"
```

**Status**: [ ] PASS  [ ] FAIL

### 4.3 Permissions

```bash
# Create API key
KEY_RESP=$(curl -s -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"name":"DoD Key"}')

API_KEY=$(echo "$KEY_RESP" | jq -r '.data.apiKey')
KEY_ID=$(echo "$KEY_RESP" | jq -r '.data.id')

# Grant permission
curl -s -X POST http://localhost:3000/api/v1/api-keys/$KEY_ID/permissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEV_TOKEN" \
  -d '{"apiId":"'$API_ID'","permission":"read"}' | jq -e '.success == true' && echo "PASS: Grant permission" || echo "FAIL: Grant permission"

# List permissions
curl -s http://localhost:3000/api/v1/api-keys/$KEY_ID/permissions \
  -H "Authorization: Bearer $DEV_TOKEN" | jq -e '.data.permissions | length > 0' && echo "PASS: List permissions" || echo "FAIL: List permissions"
```

**Status**: [ ] PASS  [ ] FAIL

### 4.4 Proxy

```bash
# With permission
curl -s http://localhost:3000/proxy/dod-api/users/1 \
  -H "X-API-Key: $API_KEY" | jq -e '.id == 1' && echo "PASS: Proxy GET" || echo "FAIL: Proxy GET"

# Write rejected (read-only)
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/proxy/dod-api/users \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{}')

[ "$STATUS" = "403" ] && echo "PASS: Read-only enforced" || echo "FAIL: Read-only enforced"
```

**Status**: [ ] PASS  [ ] FAIL

### 4.5 Analytics

```bash
FROM=$(date -d "1 hour ago" -u +"%Y-%m-%dT%H:%M:%SZ")
TO=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Request counts
curl -s "http://localhost:3000/api/v1/analytics/requests?from=$FROM&to=$TO" \
  -H "Authorization: Bearer $DEV_TOKEN" | jq -e '.success == true' && echo "PASS: Request counts" || echo "FAIL: Request counts"

# Latency
curl -s "http://localhost:3000/api/v1/analytics/latency?from=$FROM&to=$TO" \
  -H "Authorization: Bearer $DEV_TOKEN" | jq -e '.data.percentiles' && echo "PASS: Latency" || echo "FAIL: Latency"

# Top APIs
curl -s "http://localhost:3000/api/v1/analytics/top-apis?from=$FROM&to=$TO&limit=10" \
  -H "Authorization: Bearer $DEV_TOKEN" | jq -e '.success == true' && echo "PASS: Top APIs" || echo "FAIL: Top APIs"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 5. Full Verification Script

```bash
#!/bin/bash

echo "=== DataHub Sprint 1 DoD Verification ==="

PASS=0
FAIL=0

run_check() {
  if eval "$2" > /dev/null 2>&1; then
    echo "[PASS] $1"
    ((PASS++))
  else
    echo "[FAIL] $1"
    ((FAIL++))
  fi
}

run_check "Lint" "npm run lint"
run_check "TypeScript" "npx tsc --noEmit"
run_check "Unit Tests" "npm test"
run_check "Build" "npm run build"
run_check "Prisma Validate" "npx prisma validate"

echo ""
echo "Passed: $PASS, Failed: $FAIL"

[ $FAIL -eq 0 ] && echo "DoD: PASSED" || echo "DoD: FAILED"
```

---

## DoD Summary

| Category | Status |
|----------|--------|
| Code Quality | [ ] PASS [ ] FAIL |
| Testing | [ ] PASS [ ] FAIL |
| Sprint 0 Regression | [ ] PASS [ ] FAIL |
| Database | [ ] PASS [ ] FAIL |
| API Configuration | [ ] PASS [ ] FAIL |
| Permissions | [ ] PASS [ ] FAIL |
| Proxy | [ ] PASS [ ] FAIL |
| Analytics | [ ] PASS [ ] FAIL |

**DoD Status**: [ ] PASSED  [ ] FAILED

**Date**: _______________

**Verified By**: _______________

### If PASSED - Create Git Tag

```bash
git tag -a sprint-1-complete -m "Sprint 1 Complete: API Management, Permissions & Analytics

DoD Verification: PASSED
Date: $(date +%Y-%m-%d)

Features:
- API configuration (admin CRUD)
- Permission system (read/write/admin)
- Request proxy with auth
- Request logging (TimescaleDB)
- Analytics endpoints

Test Coverage: XX%
All quality gates passed.
"

git push origin sprint-1-complete
```
