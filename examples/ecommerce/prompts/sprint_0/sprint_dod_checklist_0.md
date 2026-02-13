# ShopFlow E-commerce - Sprint 0 Definition of Done Checklist

## Overview

This checklist verifies Sprint 0 meets all DoD criteria.

---

## 1. Code Quality Checks

```bash
# Backend
cd /path/to/shopflow/backend
npm run lint && echo "PASS: Backend lint" || echo "FAIL: Backend lint"
npx tsc --noEmit && echo "PASS: Backend TS" || echo "FAIL: Backend TS"

# Frontend
cd /path/to/shopflow/frontend
npm run lint && echo "PASS: Frontend lint" || echo "FAIL: Frontend lint"
npx tsc --noEmit && echo "PASS: Frontend TS" || echo "FAIL: Frontend TS"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 2. Testing Checks

```bash
# Backend tests
cd backend
npm run test && echo "PASS: Tests" || echo "FAIL: Tests"

# Coverage
npm run test:coverage
# Verify >= 70%
```

**Coverage**: _____%
**Status**: [ ] PASS  [ ] FAIL

---

## 3. Database Checks

```bash
cd backend
npx prisma migrate status
npx prisma validate && echo "PASS: Schema" || echo "FAIL: Schema"

# Verify tables
psql $DATABASE_URL -c "\dt"
# Expected: users, products, categories, product_images
```

**Status**: [ ] PASS  [ ] FAIL

---

## 4. API Verification

```bash
# Setup
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"dod@shopflow.com","password":"DodTest123!","firstName":"DoD","lastName":"Test"}')
TOKEN=$(echo "$RESPONSE" | jq -r '.data.accessToken')

# Auth
curl -s http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Auth" || echo "FAIL: Auth"

# Products
curl -s http://localhost:3000/api/v1/products | jq -e '.success == true' && echo "PASS: Products" || echo "FAIL: Products"

# Categories
curl -s http://localhost:3000/api/v1/categories | jq -e '.success == true' && echo "PASS: Categories" || echo "FAIL: Categories"

# Filtering
curl -s "http://localhost:3000/api/v1/products?minPrice=10&maxPrice=100" | jq -e '.success == true' && echo "PASS: Filters" || echo "FAIL: Filters"

# Pagination
curl -s "http://localhost:3000/api/v1/products?page=1&limit=5" | jq -e '.data.pagination.limit == 5' && echo "PASS: Pagination" || echo "FAIL: Pagination"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 5. Build Checks

```bash
# Backend
cd backend
npm run build && echo "PASS: Backend build" || echo "FAIL: Backend build"

# Frontend
cd frontend
npm run build && echo "PASS: Frontend build" || echo "FAIL: Frontend build"

# Docker
docker-compose build && echo "PASS: Docker" || echo "FAIL: Docker"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 6. Full Verification Script

```bash
#!/bin/bash

echo "=== ShopFlow Sprint 0 DoD Verification ==="

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

run_check "Backend Lint" "cd backend && npm run lint"
run_check "Frontend Lint" "cd frontend && npm run lint"
run_check "Backend TS" "cd backend && npx tsc --noEmit"
run_check "Frontend TS" "cd frontend && npx tsc --noEmit"
run_check "Backend Tests" "cd backend && npm test"
run_check "Backend Build" "cd backend && npm run build"
run_check "Frontend Build" "cd frontend && npm run build"
run_check "Docker Build" "docker-compose build"
run_check "Prisma Validate" "cd backend && npx prisma validate"

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
| Database | [ ] PASS [ ] FAIL |
| Auth API | [ ] PASS [ ] FAIL |
| Products API | [ ] PASS [ ] FAIL |
| Categories API | [ ] PASS [ ] FAIL |
| Build | [ ] PASS [ ] FAIL |

**DoD Status**: [ ] PASSED  [ ] FAILED

**Date**: _______________

**Verified By**: _______________

### If PASSED - Create Git Tag

```bash
git tag -a sprint-0-complete -m "Sprint 0 Complete: Foundation & Core Setup

DoD Verification: PASSED
Date: $(date +%Y-%m-%d)

Features:
- User authentication (register, login, JWT)
- Product catalog (CRUD, filtering, pagination)
- Category management (hierarchical)
- Admin access control

Database Tables: users, products, categories, product_images
Test Coverage: XX%
All quality gates passed.
"

git push origin sprint-0-complete
```
