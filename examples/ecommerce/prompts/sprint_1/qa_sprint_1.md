# Sprint 1 QA Review: Core Shopping Experience

## Environment: claude-code

## Context — Read These Files First

**MANDATORY:** Read ALL these files to understand what should be tested:

- specs/* (all specs + backlog.md)
- docs/testing/* (strategy, unit, integration, e2e)
- docs/api/reference.md — product, cart, checkout endpoint contracts
- docs/api/curl-examples.md — curl commands
- docs/api/error-codes.md — error responses

---

## QA Mission

Review and test ALL tickets completed in Sprint 1.

**Sprint Goal:** Enable users to browse products, manage cart, and complete basic checkout.
**Tickets to Review:** 52

---

## Pre-QA Setup

```bash
# 1. Start all services
docker-compose up -d

# 2. Run database migrations
cd backend
npx prisma migrate deploy

# 3. Seed product data
npm run db:seed
# This should create:
# - 3+ categories
# - 3+ brands
# - 20+ products with images and variants

# 4. Start backend
npm run dev &
sleep 5

# 5. Start frontend
cd ../frontend
npm run dev &
sleep 5

# 6. Verify services are running
curl http://localhost:3001/health
curl http://localhost:3000

# 7. Set up test variables
export API_URL="http://localhost:3001/api/v1"

# Create test user and get tokens
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sprint1test_'"$(date +%s)"'@example.com",
    "password": "Test123!@#",
    "firstName": "QA",
    "lastName": "Tester"
  }')
export ACCESS_TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.accessToken')
export USER_ID=$(echo $REGISTER_RESPONSE | jq -r '.user.id')
echo "Access Token: ${ACCESS_TOKEN:0:50}..."
```

---

## Automated Test Suite

```bash
# Backend tests
cd backend
npm run test:unit
npm run test:integration
npm run test:coverage
# Expected: >70% coverage

# Frontend tests
cd ../frontend
npm test
npm run build
# Expected: Build succeeds

# E2E tests
npm run test:e2e
# Expected: Purchase flow passes
```

---

## API Testing with Curl (MANDATORY)

### Test 1: Get Categories

**Endpoint:** GET /api/v1/categories
**Ticket:** SF-035

```bash
# Get all categories
curl -s "$API_URL/categories" | jq .

# Expected Response (HTTP 200):
# {
#   "categories": [
#     {
#       "id": "cat-uuid",
#       "name": "Electronics",
#       "slug": "electronics",
#       "children": [...]
#     }
#   ]
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] Returns array of categories
- [ ] Categories have id, name, slug
- [ ] Nested children if any

---

### Test 2: Get Products (Pagination)

**Endpoint:** GET /api/v1/products
**Ticket:** SF-031

```bash
# Get first page of products
curl -s "$API_URL/products?page=1&limit=5" | jq .

# Expected Response (HTTP 200):
# {
#   "products": [...],
#   "pagination": {
#     "page": 1,
#     "limit": 5,
#     "total": 20,
#     "totalPages": 4
#   }
# }

# Get second page
curl -s "$API_URL/products?page=2&limit=5" | jq .
# Should return different products

# Store a product ID for later tests
export PRODUCT_ID=$(curl -s "$API_URL/products?limit=1" | jq -r '.products[0].id')
echo "Test Product ID: $PRODUCT_ID"
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] Pagination object correct
- [ ] Page 2 has different products
- [ ] Products have images, price, category

---

### Test 3: Product Filtering

**Endpoint:** GET /api/v1/products?filters
**Ticket:** SF-032

```bash
# Get a category slug first
CATEGORY_SLUG=$(curl -s "$API_URL/categories" | jq -r '.categories[0].slug')
echo "Testing with category: $CATEGORY_SLUG"

# Filter by category
curl -s "$API_URL/products?category=$CATEGORY_SLUG" | jq .
# Expected: Only products in that category

# Filter by price range
curl -s "$API_URL/products?minPrice=50&maxPrice=200" | jq .
# Expected: Products within price range

# Filter by in-stock only
curl -s "$API_URL/products?inStock=true" | jq .
# Expected: Only products with inventory > 0

# Combined filters
curl -s "$API_URL/products?category=$CATEGORY_SLUG&minPrice=50&inStock=true" | jq .
```

**Pass Criteria:**
- [ ] Category filter works
- [ ] Price range filter works
- [ ] In-stock filter works
- [ ] Multiple filters combine correctly

---

### Test 4: Product Sorting

**Endpoint:** GET /api/v1/products?sort=
**Ticket:** SF-033

```bash
# Sort by price ascending
curl -s "$API_URL/products?sort=price&order=asc" | jq '.products[].price'
# Expected: Prices in ascending order

# Sort by price descending
curl -s "$API_URL/products?sort=price&order=desc" | jq '.products[].price'
# Expected: Prices in descending order

# Sort by name
curl -s "$API_URL/products?sort=name&order=asc" | jq '.products[].name'
# Expected: Alphabetical order

# Sort by newest
curl -s "$API_URL/products?sort=createdAt&order=desc" | jq '.products[].createdAt'
# Expected: Newest first
```

**Pass Criteria:**
- [ ] Price sort ascending works
- [ ] Price sort descending works
- [ ] Name sort works
- [ ] Date sort works

---

### Test 5: Get Single Product

**Endpoint:** GET /api/v1/products/:id
**Ticket:** SF-034

```bash
# Get product details
curl -s "$API_URL/products/$PRODUCT_ID" | jq .

# Expected Response (HTTP 200):
# {
#   "id": "uuid",
#   "name": "Product Name",
#   "slug": "product-name",
#   "description": "...",
#   "price": "99.99",
#   "sku": "SKU-001",
#   "inventory": 50,
#   "images": [...],
#   "variants": [...],
#   "category": {...},
#   "brand": {...}
# }

# Test 404 for non-existent product
curl -s "$API_URL/products/non-existent-id" | jq .
# Expected: HTTP 404
```

**Pass Criteria:**
- [ ] Returns HTTP 200 for valid ID
- [ ] Includes all product fields
- [ ] Includes images array
- [ ] Includes variants array
- [ ] Returns 404 for invalid ID

---

### Test 6: Get Cart (Empty)

**Endpoint:** GET /api/v1/cart
**Ticket:** SF-037

```bash
# Get cart (should be empty initially)
curl -s "$API_URL/cart" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# Expected Response (HTTP 200):
# {
#   "id": "cart-uuid",
#   "items": [],
#   "subtotal": "0.00",
#   "itemCount": 0
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] Empty items array
- [ ] subtotal is 0
- [ ] itemCount is 0

---

### Test 7: Add Item to Cart

**Endpoint:** POST /api/v1/cart/items
**Ticket:** SF-038

```bash
# Add product to cart
curl -s -X POST "$API_URL/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "productId": "'"$PRODUCT_ID"'",
    "quantity": 2
  }' | jq .

# Expected Response (HTTP 201):
# {
#   "item": {
#     "id": "item-uuid",
#     "product": {...},
#     "quantity": 2,
#     "subtotal": "199.98"
#   },
#   "cart": {
#     "items": [...],
#     "subtotal": "199.98",
#     "itemCount": 2
#   }
# }

# Store item ID
export CART_ITEM_ID=$(curl -s "$API_URL/cart" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq -r '.items[0].id')
echo "Cart Item ID: $CART_ITEM_ID"
```

**Pass Criteria:**
- [ ] Returns HTTP 201
- [ ] Item added to cart
- [ ] Subtotal calculated correctly
- [ ] itemCount matches quantity

#### Test adding same product again
```bash
# Add same product - should increase quantity
curl -s -X POST "$API_URL/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "productId": "'"$PRODUCT_ID"'",
    "quantity": 1
  }' | jq '.cart.items[0].quantity'
# Expected: 3 (2 + 1)
```

#### Test adding invalid product
```bash
curl -s -X POST "$API_URL/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "productId": "invalid-id",
    "quantity": 1
  }' | jq .
# Expected: HTTP 404
```

---

### Test 8: Update Cart Item Quantity

**Endpoint:** PATCH /api/v1/cart/items/:id
**Ticket:** SF-039

```bash
# Update quantity
curl -s -X PATCH "$API_URL/cart/items/$CART_ITEM_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "quantity": 5
  }' | jq .

# Expected: quantity updated to 5

# Test invalid quantity (0)
curl -s -X PATCH "$API_URL/cart/items/$CART_ITEM_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "quantity": 0
  }' | jq .
# Expected: HTTP 400 or item removed

# Test negative quantity
curl -s -X PATCH "$API_URL/cart/items/$CART_ITEM_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "quantity": -1
  }' | jq .
# Expected: HTTP 400
```

**Pass Criteria:**
- [ ] Quantity updated correctly
- [ ] Subtotal recalculated
- [ ] Rejects invalid quantities

---

### Test 9: Remove Cart Item

**Endpoint:** DELETE /api/v1/cart/items/:id
**Ticket:** SF-040

```bash
# First, add a new item to remove
curl -s -X POST "$API_URL/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "productId": "'"$PRODUCT_ID"'",
    "quantity": 1
  }' > /dev/null

# Get new item ID
NEW_ITEM_ID=$(curl -s "$API_URL/cart" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq -r '.items[-1].id')

# Remove item
curl -s -X DELETE "$API_URL/cart/items/$NEW_ITEM_ID" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# Expected Response (HTTP 200):
# {
#   "message": "Item removed",
#   "cart": {...}
# }

# Verify item removed
curl -s "$API_URL/cart" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.items | length'
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] Item removed from cart
- [ ] Cart totals recalculated

---

### Test 10: Create Checkout Session

**Endpoint:** POST /api/v1/checkout/session
**Ticket:** SF-063

```bash
# Ensure cart has items
curl -s -X POST "$API_URL/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "productId": "'"$PRODUCT_ID"'",
    "quantity": 2
  }' > /dev/null

# Create checkout session
CHECKOUT_RESPONSE=$(curl -s -X POST "$API_URL/checkout/session" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
echo $CHECKOUT_RESPONSE | jq .

export CHECKOUT_ID=$(echo $CHECKOUT_RESPONSE | jq -r '.checkoutId')
echo "Checkout ID: $CHECKOUT_ID"

# Expected Response (HTTP 201):
# {
#   "checkoutId": "uuid",
#   "items": [...],
#   "subtotal": "199.98",
#   "tax": "16.00",
#   "shipping": "0.00",
#   "total": "215.98"
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 201
- [ ] checkoutId returned
- [ ] Items match cart
- [ ] Totals calculated

#### Test with empty cart
```bash
# Clear cart first
curl -s "$API_URL/cart" -H "Authorization: Bearer $ACCESS_TOKEN" | \
  jq -r '.items[].id' | while read id; do
    curl -s -X DELETE "$API_URL/cart/items/$id" \
      -H "Authorization: Bearer $ACCESS_TOKEN" > /dev/null
  done

# Try to create checkout with empty cart
curl -s -X POST "$API_URL/checkout/session" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
# Expected: HTTP 400 - Cart is empty
```

---

### Test 11: Update Shipping Address

**Endpoint:** PATCH /api/v1/checkout/:id/shipping
**Ticket:** SF-064

```bash
# Add items back and create new checkout
curl -s -X POST "$API_URL/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"productId": "'"$PRODUCT_ID"'", "quantity": 2}' > /dev/null

CHECKOUT_RESPONSE=$(curl -s -X POST "$API_URL/checkout/session" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
export CHECKOUT_ID=$(echo $CHECKOUT_RESPONSE | jq -r '.checkoutId')

# Update shipping address
curl -s -X PATCH "$API_URL/checkout/$CHECKOUT_ID/shipping" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "shippingAddress": {
      "firstName": "QA",
      "lastName": "Tester",
      "street1": "123 Test Street",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US",
      "phone": "555-123-4567"
    },
    "shippingMethod": "standard"
  }' | jq .

# Expected Response (HTTP 200):
# {
#   "checkoutId": "...",
#   "shippingAddress": {...},
#   "shippingMethod": "standard",
#   "shipping": "9.99",
#   "total": "..."
# }
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] Address saved
- [ ] Shipping cost calculated
- [ ] Total updated

#### Test validation
```bash
# Missing required fields
curl -s -X PATCH "$API_URL/checkout/$CHECKOUT_ID/shipping" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{
    "shippingAddress": {
      "firstName": "QA"
    }
  }' | jq .
# Expected: HTTP 400 with validation errors
```

---

### Test 12: Create Payment Intent

**Endpoint:** POST /api/v1/checkout/:id/payment
**Ticket:** SF-065

```bash
# Create payment intent
curl -s -X POST "$API_URL/checkout/$CHECKOUT_ID/payment" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# Expected Response (HTTP 200):
# {
#   "clientSecret": "pi_xxx_secret_xxx",
#   "paymentId": "uuid"
# }

# Store for later
export PAYMENT_RESPONSE=$(curl -s -X POST "$API_URL/checkout/$CHECKOUT_ID/payment" \
  -H "Authorization: Bearer $ACCESS_TOKEN")
export CLIENT_SECRET=$(echo $PAYMENT_RESPONSE | jq -r '.clientSecret')
echo "Client Secret: ${CLIENT_SECRET:0:30}..."
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] clientSecret is a valid Stripe format
- [ ] paymentId returned

---

### Test 13: Complete Checkout

**Endpoint:** POST /api/v1/checkout/:id/complete
**Ticket:** SF-066

```bash
# Note: In real testing, you would use Stripe.js to confirm payment first
# For API testing, we can test the endpoint with a mock/test payment

# Complete checkout (assuming payment succeeded)
curl -s -X POST "$API_URL/checkout/$CHECKOUT_ID/complete" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .

# Expected Response (HTTP 200):
# {
#   "orderId": "uuid",
#   "orderNumber": "SF-10001",
#   "status": "PAID",
#   "total": "...",
#   "message": "Order placed successfully"
# }

# Verify cart is cleared
curl -s "$API_URL/cart" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.items | length'
# Expected: 0
```

**Pass Criteria:**
- [ ] Returns HTTP 200
- [ ] Order created with orderId
- [ ] Status is PAID
- [ ] Cart is cleared

---

## Frontend Visual Testing

### Product Listing Page (/products)

Open http://localhost:3000/products and verify:

- [ ] Header displays with logo, navigation, cart icon
- [ ] Product grid displays with images
- [ ] Filters sidebar visible on desktop
- [ ] Filter by category works
- [ ] Filter by price range works
- [ ] Sort dropdown works
- [ ] Pagination works
- [ ] Product cards have hover effect
- [ ] "Add to Cart" quick button works
- [ ] Mobile: Filters collapse to drawer
- [ ] Tablet: 3-column grid
- [ ] Desktop: 4-column grid

### Product Detail Page (/products/[slug])

Click on a product and verify:

- [ ] Product images display
- [ ] Thumbnail navigation works
- [ ] Image zoom on hover (desktop)
- [ ] Product name and price display
- [ ] Variant selector works (if variants exist)
- [ ] Quantity selector works
- [ ] "Add to Cart" button works
- [ ] Stock status displays
- [ ] Description displays
- [ ] Breadcrumb navigation works

### Cart Page (/cart)

Add items and go to /cart:

- [ ] Cart items display with images
- [ ] Quantity can be updated
- [ ] Items can be removed
- [ ] Subtotal calculates correctly
- [ ] "Proceed to Checkout" button works
- [ ] Empty cart message displays when empty

### Cart Sidebar

Click cart icon in header:

- [ ] Sidebar slides in from right
- [ ] Items display
- [ ] Subtotal shown
- [ ] "Checkout" button works
- [ ] Can close sidebar

### Checkout Flow

Go through complete checkout:

#### Information Step (/checkout)
- [ ] Email pre-filled if logged in
- [ ] Address form displays all fields
- [ ] Validation works (required fields)
- [ ] "Continue to Shipping" button works

#### Shipping Step (/checkout/shipping)
- [ ] Shipping address displayed
- [ ] Shipping methods available
- [ ] Shipping cost updates
- [ ] "Continue to Payment" button works

#### Payment Step (/checkout/payment)
- [ ] Stripe card input displays
- [ ] Order summary visible
- [ ] "Pay Now" button works
- [ ] Loading state during payment

#### Confirmation (/checkout/confirmation/[orderId])
- [ ] Success message displays
- [ ] Order number shown
- [ ] Order summary displayed
- [ ] "Continue Shopping" link works

---

## Per-Ticket QA Summary

| Range | Tickets | Category | Status |
|-------|---------|----------|--------|
| SF-026-030 | 5 | Database Migrations | PASS/FAIL |
| SF-031-035 | 5 | Product API | PASS/FAIL |
| SF-036-040 | 5 | Cart API | PASS/FAIL |
| SF-041-045 | 5 | Base UI Components | PASS/FAIL |
| SF-046-050 | 5 | Product Components | PASS/FAIL |
| SF-051-054 | 4 | Product Detail | PASS/FAIL |
| SF-055-059 | 5 | Cart Components | PASS/FAIL |
| SF-060-066 | 7 | Checkout Backend | PASS/FAIL |
| SF-067-076 | 10 | Checkout Frontend | PASS/FAIL |
| SF-077 | 1 | E2E Test | PASS/FAIL |

---

## QA Summary

### Test Results

| Category | Passed | Failed | Coverage |
|----------|--------|--------|----------|
| Backend Unit Tests | X/X | 0 | XX% |
| Backend Integration Tests | X/X | 0 | XX% |
| API Curl Tests | 13/13 | 0 | N/A |
| Frontend Unit Tests | X/X | 0 | XX% |
| E2E Tests | 1/1 | 0 | N/A |

### Issues Found

| Ticket | Issue | Severity | Action |
|--------|-------|----------|--------|
| - | No issues found | - | - |

### Security Review

- [ ] Cart only accessible to owner
- [ ] Checkout requires authentication
- [ ] Payment data never logged
- [ ] Price not modifiable by client
- [ ] Inventory checked before order

### Performance Notes

- [ ] Product list: < 200ms
- [ ] Product detail: < 100ms
- [ ] Cart operations: < 100ms
- [ ] Checkout session: < 300ms

### Overall Verdict

- [ ] **PASS** — All tests pass, ready for release
- [ ] **FAIL** — Issues found, needs fixes

---

## Cleanup

```bash
pkill -f "npm run dev" || true
docker-compose down
```
