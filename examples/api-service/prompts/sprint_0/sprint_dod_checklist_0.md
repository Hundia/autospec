# DataHub API Gateway - Sprint 0 Definition of Done Checklist

## Overview

This checklist verifies that Sprint 0 meets all Definition of Done criteria.

---

## 1. Code Quality Checks

### 1.1 Linting

```bash
cd /path/to/datahub
npm run lint && echo "PASS: Linting" || echo "FAIL: Linting"
```

**Status**: [ ] PASS  [ ] FAIL

### 1.2 TypeScript Compilation

```bash
cd /path/to/datahub
npx tsc --noEmit && echo "PASS: TypeScript" || echo "FAIL: TypeScript"
```

**Status**: [ ] PASS  [ ] FAIL

### 1.3 Code Formatting

```bash
npx prettier --check "src/**/*.ts" && echo "PASS: Formatting" || echo "FAIL: Formatting"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 2. Testing Checks

### 2.1 Unit Tests

```bash
npm run test && echo "PASS: Unit tests" || echo "FAIL: Unit tests"
```

**Status**: [ ] PASS  [ ] FAIL

### 2.2 Test Coverage

```bash
npm run test:coverage

# Verify coverage >= 70%
COVERAGE=$(npm run test:coverage 2>&1 | grep "All files" | awk '{print $4}' | tr -d '%')
if [ "$COVERAGE" -ge 70 ]; then
  echo "PASS: Coverage at ${COVERAGE}%"
else
  echo "FAIL: Coverage at ${COVERAGE}% (required: 70%)"
fi
```

**Status**: [ ] PASS  [ ] FAIL
**Coverage**: _____%

### 2.3 Integration Tests

```bash
npm run test:integration && echo "PASS: Integration tests" || echo "FAIL: Integration tests"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 3. Database Checks

### 3.1 Migrations

```bash
npx prisma migrate status
npx prisma migrate deploy && echo "PASS: Migrations" || echo "FAIL: Migrations"
```

**Status**: [ ] PASS  [ ] FAIL

### 3.2 Seed Data

```bash
npx prisma db seed && echo "PASS: Seed data" || echo "FAIL: Seed data"

# Verify rate limit tiers exist
psql $DATABASE_URL -c "SELECT tier_name FROM rate_limits"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 4. Build Checks

### 4.1 Application Build

```bash
npm run build && echo "PASS: Build" || echo "FAIL: Build"
```

**Status**: [ ] PASS  [ ] FAIL

### 4.2 Docker Build

```bash
docker-compose build && echo "PASS: Docker build" || echo "FAIL: Docker build"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 5. API Verification

### 5.1 Setup

```bash
# Start services
docker-compose up -d

# Wait for services
sleep 10

# Get token
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"dod@datahub.com","password":"DodTest123!"}')
TOKEN=$(echo "$RESPONSE" | jq -r '.data.accessToken')
```

### 5.2 Auth Endpoints

```bash
# Health
curl -s http://localhost:3000/api/v1/health | jq -e '.status == "ok"' && echo "PASS: Health" || echo "FAIL: Health"

# Login
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dod@datahub.com","password":"DodTest123!"}' | jq -e '.success == true' && echo "PASS: Login" || echo "FAIL: Login"

# Get me
curl -s http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Get me" || echo "FAIL: Get me"
```

**Status**: [ ] PASS  [ ] FAIL

### 5.3 API Key Endpoints

```bash
# Create API key
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"DoD Test Key"}')

echo "$RESPONSE" | jq -e '.success == true' && echo "PASS: Create API key" || echo "FAIL: Create API key"

API_KEY=$(echo "$RESPONSE" | jq -r '.data.apiKey')
KEY_ID=$(echo "$RESPONSE" | jq -r '.data.id')

# List API keys
curl -s http://localhost:3000/api/v1/api-keys \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: List API keys" || echo "FAIL: List API keys"

# Revoke API key
curl -s -X DELETE "http://localhost:3000/api/v1/api-keys/$KEY_ID" \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Revoke API key" || echo "FAIL: Revoke API key"
```

**Status**: [ ] PASS  [ ] FAIL

### 5.4 Rate Limiting

```bash
# Create new key for rate limit test
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/api-keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"Rate Test Key","rateLimitTier":"free"}')
API_KEY=$(echo "$RESPONSE" | jq -r '.data.apiKey')

# Check rate limit headers
HEADERS=$(curl -s -I http://localhost:3000/api/v1/health -H "X-API-Key: $API_KEY")

if echo "$HEADERS" | grep -q "X-RateLimit-Limit: 60"; then
  echo "PASS: Rate limit headers"
else
  echo "FAIL: Rate limit headers"
fi

# Test rate limit enforcement (run 65 requests)
EXCEEDED=false
for i in {1..65}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    http://localhost:3000/api/v1/health \
    -H "X-API-Key: $API_KEY")
  if [ "$STATUS" = "429" ]; then
    EXCEEDED=true
    break
  fi
done

if [ "$EXCEEDED" = true ]; then
  echo "PASS: Rate limit enforcement"
else
  echo "FAIL: Rate limit enforcement"
fi
```

**Status**: [ ] PASS  [ ] FAIL

### 5.5 Rate Limit Tiers

```bash
curl -s http://localhost:3000/api/v1/rate-limits \
  -H "Authorization: Bearer $TOKEN" | jq -e '.data.tiers | length == 4' && echo "PASS: Rate limit tiers" || echo "FAIL: Rate limit tiers"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 6. Security Checks

### 6.1 Dependency Audit

```bash
npm audit --audit-level=high && echo "PASS: Security audit" || echo "FAIL: Security audit"
```

**Status**: [ ] PASS  [ ] FAIL

### 6.2 API Key Hashing

```bash
# Verify keys are hashed in database
psql $DATABASE_URL -c "SELECT key_hash FROM api_keys LIMIT 1"

# Key hash should NOT start with 'dh_live_'
# Should be bcrypt hash starting with '$2'
```

**Status**: [ ] PASS  [ ] FAIL

### 6.3 Password Hashing

```bash
# Verify passwords are hashed
psql $DATABASE_URL -c "SELECT password_hash FROM users LIMIT 1"

# Should be bcrypt hash starting with '$2'
```

**Status**: [ ] PASS  [ ] FAIL

---

## 7. Redis Verification

### 7.1 Redis Connection

```bash
docker exec datahub-redis-1 redis-cli ping && echo "PASS: Redis ping" || echo "FAIL: Redis ping"
```

**Status**: [ ] PASS  [ ] FAIL

### 7.2 Rate Limit Keys

```bash
# After making requests with API key
docker exec datahub-redis-1 redis-cli KEYS "ratelimit:*"

# Should show rate limit keys
```

**Status**: [ ] PASS  [ ] FAIL

---

## 8. Full Verification Script

```bash
#!/bin/bash

echo "=== DataHub Sprint 0 DoD Full Verification ==="
echo ""

PASS_COUNT=0
FAIL_COUNT=0

run_check() {
  local name="$1"
  local command="$2"

  if eval "$command" > /dev/null 2>&1; then
    echo "[PASS] $name"
    ((PASS_COUNT++))
  else
    echo "[FAIL] $name"
    ((FAIL_COUNT++))
  fi
}

# Code Quality
run_check "Lint" "npm run lint"
run_check "TypeScript" "npx tsc --noEmit"
run_check "Prettier" "npx prettier --check 'src/**/*.ts'"

# Tests
run_check "Unit Tests" "npm test"
run_check "Integration Tests" "npm run test:integration"

# Build
run_check "Build" "npm run build"
run_check "Docker Build" "docker-compose build"

# Database
run_check "Prisma Validate" "npx prisma validate"
run_check "Migrations" "npx prisma migrate status"

# Security
run_check "Security Audit" "npm audit --audit-level=high"

echo ""
echo "=== Summary ==="
echo "Passed: $PASS_COUNT"
echo "Failed: $FAIL_COUNT"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo "DoD VERIFICATION: PASSED"
  exit 0
else
  echo "DoD VERIFICATION: FAILED"
  exit 1
fi
```

---

## DoD Summary

| Category | Status | Notes |
|----------|--------|-------|
| Code Quality | [ ] PASS [ ] FAIL | |
| Testing | [ ] PASS [ ] FAIL | Coverage: ___% |
| Database | [ ] PASS [ ] FAIL | |
| Build | [ ] PASS [ ] FAIL | |
| Auth API | [ ] PASS [ ] FAIL | |
| API Key API | [ ] PASS [ ] FAIL | |
| Rate Limiting | [ ] PASS [ ] FAIL | |
| Security | [ ] PASS [ ] FAIL | |
| Redis | [ ] PASS [ ] FAIL | |

### Final Sign-Off

**DoD Status**: [ ] PASSED  [ ] FAILED

**Date**: _______________

**Verified By**: _______________

### If PASSED - Create Git Tag

```bash
git tag -a sprint-0-complete -m "Sprint 0 Complete: Foundation & Core Setup

DoD Verification: PASSED
Date: $(date +%Y-%m-%d)

Features:
- User authentication (register, login, JWT, refresh)
- API key management (generate, list, revoke)
- Rate limiting (tiers, Redis counters, 429)
- PostgreSQL + Redis infrastructure

Test Coverage: XX%
All quality gates passed.
"

git push origin sprint-0-complete
```
