# ShopFlow E-commerce - Sprint 1 QA Testing Prompt

## Overview

QA testing for Sprint 1: Shopping Cart, Checkout, Orders, and Reviews.

**Base URL**: `http://localhost:3000`

---

## Pre-Test Setup

```bash
# Login as customer
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@shopflow.com","password":"Customer123!"}')
export TOKEN=$(echo $RESPONSE | jq -r '.data.accessToken')

# Get a product ID
export PRODUCT_ID=$(curl -s http://localhost:3000/api/v1/products | jq -r '.data.products[0].id')
```

---

## Test Suite 1: Shopping Cart

### Test 1.1: Add Item to Cart

```bash
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": "'$PRODUCT_ID'",
    "quantity": 2
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "productId": "...",
#     "quantity": 2,
#     "product": {...}
#   }
# }

export CART_ITEM_ID="<id>"
```

### Test 1.2: View Cart

```bash
curl -X GET http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "items": [...],
#     "itemCount": 2,
#     "subtotal": "59.98"
#   }
# }
```

### Test 1.3: Update Cart Item Quantity

```bash
curl -X PUT http://localhost:3000/api/v1/cart/items/$CART_ITEM_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"quantity": 3}'

# Expected Response (200): quantity updated to 3
```

### Test 1.4: Add Same Product Again (Should Increase Quantity)

```bash
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": "'$PRODUCT_ID'",
    "quantity": 1
  }'

# Expected: Quantity should be 4 (3 + 1)
```

### Test 1.5: Remove Item from Cart

```bash
curl -X DELETE http://localhost:3000/api/v1/cart/items/$CART_ITEM_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200): Item removed
```

### Test 1.6: Add Item Exceeding Stock

```bash
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "productId": "'$PRODUCT_ID'",
    "quantity": 99999
  }'

# Expected Response (400): Insufficient stock
```

### Test 1.7: Clear Cart

```bash
# First add items
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":"'$PRODUCT_ID'","quantity":1}'

# Clear
curl -X DELETE http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200): Cart cleared
```

---

## Test Suite 2: Address Management

### Test 2.1: Create Shipping Address

```bash
curl -X POST http://localhost:3000/api/v1/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "SHIPPING",
    "firstName": "John",
    "lastName": "Doe",
    "street": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US",
    "phone": "+1234567890",
    "isDefault": true
  }'

# Expected Response (201)
export SHIPPING_ADDRESS_ID="<id>"
```

### Test 2.2: Create Billing Address

```bash
curl -X POST http://localhost:3000/api/v1/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "BILLING",
    "firstName": "John",
    "lastName": "Doe",
    "street": "456 Oak Avenue",
    "city": "New York",
    "state": "NY",
    "postalCode": "10002",
    "country": "US"
  }'

export BILLING_ADDRESS_ID="<id>"
```

### Test 2.3: List Addresses

```bash
curl -X GET http://localhost:3000/api/v1/addresses \
  -H "Authorization: Bearer $TOKEN"

# Expected: Array of addresses
```

### Test 2.4: Update Address

```bash
curl -X PUT http://localhost:3000/api/v1/addresses/$SHIPPING_ADDRESS_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "street": "789 Updated Street"
  }'

# Expected Response (200): Updated address
```

### Test 2.5: Delete Address

```bash
# Create a test address first
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/addresses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"type":"SHIPPING","firstName":"Test","lastName":"Delete","street":"Delete St","city":"Test","state":"TS","postalCode":"00000","country":"US"}')
DELETE_ID=$(echo $RESPONSE | jq -r '.data.id')

curl -X DELETE http://localhost:3000/api/v1/addresses/$DELETE_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200): Deleted
```

---

## Test Suite 3: Checkout & Orders

### Test 3.1: Checkout (Create Order)

```bash
# First add items to cart
curl -X POST http://localhost:3000/api/v1/cart/items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"productId":"'$PRODUCT_ID'","quantity":2}'

# Checkout
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "shippingAddressId": "'$SHIPPING_ADDRESS_ID'",
    "billingAddressId": "'$BILLING_ADDRESS_ID'"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "orderNumber": "ORD-20260130-001",
#     "status": "PENDING",
#     "items": [...],
#     "subtotal": "59.98",
#     "tax": "5.40",
#     "shippingCost": "9.99",
#     "total": "75.37"
#   }
# }

export ORDER_ID="<id>"
```

### Test 3.2: Verify Cart Cleared After Checkout

```bash
curl -X GET http://localhost:3000/api/v1/cart \
  -H "Authorization: Bearer $TOKEN"

# Expected: Empty cart or no items
```

### Test 3.3: Checkout with Empty Cart

```bash
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "shippingAddressId": "'$SHIPPING_ADDRESS_ID'",
    "billingAddressId": "'$BILLING_ADDRESS_ID'"
  }'

# Expected Response (400): Cart is empty
```

### Test 3.4: List Orders

```bash
curl -X GET http://localhost:3000/api/v1/orders \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "orders": [...],
#     "pagination": {...}
#   }
# }
```

### Test 3.5: Get Order Details

```bash
curl -X GET http://localhost:3000/api/v1/orders/$ORDER_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200): Full order details
```

### Test 3.6: Cancel Order

```bash
curl -X POST http://localhost:3000/api/v1/orders/$ORDER_ID/cancel \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "status": "CANCELLED"
#   }
# }
```

### Test 3.7: Cannot Cancel Already Cancelled Order

```bash
curl -X POST http://localhost:3000/api/v1/orders/$ORDER_ID/cancel \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (400): Order already cancelled
```

### Test 3.8: Filter Orders by Status

```bash
curl -X GET "http://localhost:3000/api/v1/orders?status=CANCELLED" \
  -H "Authorization: Bearer $TOKEN"

# Expected: Only cancelled orders
```

---

## Test Suite 4: Product Reviews

### Test 4.1: Add Review

```bash
curl -X POST http://localhost:3000/api/v1/products/$PRODUCT_ID/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "rating": 5,
    "title": "Excellent product!",
    "content": "Great quality and fast shipping. Highly recommend!"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "rating": 5,
#     "title": "Excellent product!",
#     "content": "...",
#     "isVerified": true
#   }
# }

export REVIEW_ID="<id>"
```

### Test 4.2: List Product Reviews

```bash
curl -X GET http://localhost:3000/api/v1/products/$PRODUCT_ID/reviews

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "reviews": [...],
#     "summary": {
#       "averageRating": 5.0,
#       "totalReviews": 1,
#       "distribution": {"5": 1, "4": 0, ...}
#     },
#     "pagination": {...}
#   }
# }
```

### Test 4.3: Update Review

```bash
curl -X PUT http://localhost:3000/api/v1/reviews/$REVIEW_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "rating": 4,
    "content": "Updated review content"
  }'

# Expected Response (200): Updated review
```

### Test 4.4: Cannot Review Same Product Twice

```bash
curl -X POST http://localhost:3000/api/v1/products/$PRODUCT_ID/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "rating": 3,
    "title": "Second review"
  }'

# Expected Response (409): Already reviewed this product
```

### Test 4.5: Invalid Rating

```bash
# Get another product ID
PRODUCT2_ID=$(curl -s http://localhost:3000/api/v1/products | jq -r '.data.products[1].id')

curl -X POST http://localhost:3000/api/v1/products/$PRODUCT2_ID/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "rating": 10,
    "title": "Invalid rating"
  }'

# Expected Response (400): Rating must be 1-5
```

### Test 4.6: Delete Review

```bash
curl -X DELETE http://localhost:3000/api/v1/reviews/$REVIEW_ID \
  -H "Authorization: Bearer $TOKEN"

# Expected Response (200): Review deleted
```

---

## Test Suite 5: Regression Tests (Sprint 0)

### Test 5.1: Auth Still Works

```bash
curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@shopflow.com","password":"Customer123!"}' | jq -e '.success == true' && echo "PASS" || echo "FAIL"
```

### Test 5.2: Products Still Work

```bash
curl -s http://localhost:3000/api/v1/products | jq -e '.success == true' && echo "PASS" || echo "FAIL"
```

### Test 5.3: Categories Still Work

```bash
curl -s http://localhost:3000/api/v1/categories | jq -e '.success == true' && echo "PASS" || echo "FAIL"
```

---

## Automated Test Script

```bash
#!/bin/bash

BASE_URL="http://localhost:3000"
PASS=0
FAIL=0

test_endpoint() {
  if [ "$3" -eq "$2" ]; then
    echo "[PASS] $1"
    ((PASS++))
  else
    echo "[FAIL] $1 (expected $2, got $3)"
    ((FAIL++))
  fi
}

echo "ShopFlow Sprint 1 QA Tests"
echo "=========================="

# Setup
RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"customer@shopflow.com","password":"Customer123!"}')
TOKEN=$(echo "$RESPONSE" | jq -r '.data.accessToken')
PRODUCT_ID=$(curl -s "$BASE_URL/api/v1/products" | jq -r '.data.products[0].id')

# Cart Tests
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/v1/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"productId\":\"$PRODUCT_ID\",\"quantity\":1}")
test_endpoint "Add to Cart" 201 "$STATUS"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/cart" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "View Cart" 200 "$STATUS"

# Address Tests
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/v1/addresses" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"type":"SHIPPING","firstName":"QA","lastName":"Test","street":"123 Test","city":"Test","state":"TS","postalCode":"00000","country":"US"}')
test_endpoint "Create Address" 201 "$STATUS"

STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/addresses" \
  -H "Authorization: Bearer $TOKEN")
test_endpoint "List Addresses" 200 "$STATUS"

echo "=========================="
echo "Results: $PASS passed, $FAIL failed"
```

---

## QA Sign-Off Checklist

### Cart
- [ ] Add to cart works
- [ ] Update quantity works
- [ ] Remove item works
- [ ] Clear cart works
- [ ] Stock validation works

### Addresses
- [ ] Create address works
- [ ] List addresses works
- [ ] Update address works
- [ ] Delete address works
- [ ] Default address works

### Orders
- [ ] Checkout creates order
- [ ] Cart clears after checkout
- [ ] Order totals correct
- [ ] Order list works
- [ ] Order details work
- [ ] Order cancellation works

### Reviews
- [ ] Add review works
- [ ] List reviews works
- [ ] Update review works
- [ ] Delete review works
- [ ] Rating validation works
- [ ] One review per product enforced

### Regression
- [ ] Auth still works
- [ ] Products still work
- [ ] Categories still work
