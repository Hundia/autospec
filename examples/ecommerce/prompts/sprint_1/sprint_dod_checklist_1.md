# ShopFlow E-commerce - Sprint 1 Definition of Done Checklist

## Overview

This checklist verifies Sprint 1 meets all DoD criteria.

---

## 1. Code Quality Checks

```bash
# Backend
cd backend
npm run lint && echo "PASS: Lint" || echo "FAIL: Lint"
npx tsc --noEmit && echo "PASS: TS" || echo "FAIL: TS"

# Frontend
cd frontend
npm run lint && echo "PASS: Lint" || echo "FAIL: Lint"
npx tsc --noEmit && echo "PASS: TS" || echo "FAIL: TS"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 2. Testing Checks

```bash
cd backend
npm run test && echo "PASS: Tests" || echo "FAIL: Tests"
npm run test:coverage
# Verify >= 70%
```

**Coverage**: _____%
**Status**: [ ] PASS  [ ] FAIL

---

## 3. Database Checks

```bash
cd backend
npx prisma validate && echo "PASS" || echo "FAIL"

# Verify new tables
psql $DATABASE_URL -c "\dt"
# Should include: carts, cart_items, addresses, orders, order_items, reviews
```

**Status**: [ ] PASS  [ ] FAIL

---

## 4. API Verification

### Setup

```bash
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@shopflow.com","password":"Customer123!"}')
TOKEN=$(echo "$RESPONSE" | jq -r '.data.accessToken')
PRODUCT_ID=$(curl -s http://localhost:3000/api/v1/products | jq -r '.data.products[0].id')
```

### Cart

```bash
# Add to cart
curl -s -X POST http://localhost:3000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"productId\":\"$PRODUCT_ID\",\"quantity\":1}" | jq -e '.success == true' && echo "PASS: Add to cart" || echo "FAIL"

# View cart
curl -s http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: View cart" || echo "FAIL"
```

**Status**: [ ] PASS  [ ] FAIL

### Address

```bash
# Create address
ADDR=$(curl -s -X POST http://localhost:3000/api/v1/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"type":"SHIPPING","firstName":"DoD","lastName":"Test","street":"123 Test","city":"Test","state":"TS","postalCode":"00000","country":"US"}')

echo "$ADDR" | jq -e '.success == true' && echo "PASS: Create address" || echo "FAIL"

ADDR_ID=$(echo "$ADDR" | jq -r '.data.id')

# List addresses
curl -s http://localhost:3000/api/v1/addresses \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: List addresses" || echo "FAIL"
```

**Status**: [ ] PASS  [ ] FAIL

### Checkout

```bash
# Create order
ORDER=$(curl -s -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"shippingAddressId\":\"$ADDR_ID\",\"billingAddressId\":\"$ADDR_ID\"}")

echo "$ORDER" | jq -e '.success == true' && echo "PASS: Create order" || echo "FAIL"

ORDER_ID=$(echo "$ORDER" | jq -r '.data.id')

# List orders
curl -s http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: List orders" || echo "FAIL"

# Order details
curl -s http://localhost:3000/api/v1/orders/$ORDER_ID \
  -H "Authorization: Bearer $TOKEN" | jq -e '.success == true' && echo "PASS: Order details" || echo "FAIL"
```

**Status**: [ ] PASS  [ ] FAIL

### Reviews

```bash
# Add review
REVIEW=$(curl -s -X POST http://localhost:3000/api/v1/products/$PRODUCT_ID/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"rating":5,"title":"DoD Test","content":"Test review"}')

echo "$REVIEW" | jq -e '.success == true' && echo "PASS: Add review" || echo "FAIL"

# List reviews
curl -s http://localhost:3000/api/v1/products/$PRODUCT_ID/reviews | jq -e '.success == true' && echo "PASS: List reviews" || echo "FAIL"
```

**Status**: [ ] PASS  [ ] FAIL

### Sprint 0 Regression

```bash
curl -s http://localhost:3000/api/v1/products | jq -e '.success == true' && echo "PASS: Products" || echo "FAIL"
curl -s http://localhost:3000/api/v1/categories | jq -e '.success == true' && echo "PASS: Categories" || echo "FAIL"
```

**Status**: [ ] PASS  [ ] FAIL

---

## 5. Full Verification Script

```bash
#!/bin/bash

echo "=== ShopFlow Sprint 1 DoD Verification ==="

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
| Cart API | [ ] PASS [ ] FAIL |
| Address API | [ ] PASS [ ] FAIL |
| Order API | [ ] PASS [ ] FAIL |
| Review API | [ ] PASS [ ] FAIL |
| Sprint 0 Regression | [ ] PASS [ ] FAIL |

**DoD Status**: [ ] PASSED  [ ] FAILED

**Date**: _______________

**Verified By**: _______________

### If PASSED - Create Git Tag

```bash
git tag -a sprint-1-complete -m "Sprint 1 Complete: Shopping Cart & Checkout

DoD Verification: PASSED
Date: $(date +%Y-%m-%d)

Features:
- Shopping cart (CRUD, stock validation)
- Address management (shipping/billing)
- Checkout flow (order creation)
- Order management (list, detail, cancel)
- Product reviews (CRUD, ratings)

New Tables: carts, cart_items, addresses, orders, order_items, reviews
Test Coverage: XX%
All quality gates passed.
"

git push origin sprint-1-complete
```
