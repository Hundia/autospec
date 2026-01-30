# ShopFlow E-commerce - Sprint 0 QA Testing Prompt

## Overview

QA testing procedures for Sprint 0 of ShopFlow, covering authentication and product catalog.

**Base URL**: `http://localhost:3000`

---

## Pre-Test Setup

### 1. Start Application

```bash
docker-compose up -d
sleep 10

# Run seed data
cd backend && npx prisma db seed
```

### 2. Verify Health

```bash
curl -X GET http://localhost:3000/api/v1/health

# Expected: {"status":"ok"}
```

---

## Test Suite 1: User Registration

### Test 1.1: Successful Customer Registration

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@shopflow.com",
    "password": "Customer123!",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Expected Response (201):
# {
#   "success": true,
#   "data": {
#     "user": {
#       "id": "...",
#       "email": "customer@shopflow.com",
#       "firstName": "John",
#       "lastName": "Doe",
#       "role": "CUSTOMER"
#     },
#     "accessToken": "eyJ...",
#     "refreshToken": "eyJ..."
#   }
# }

export CUSTOMER_TOKEN="<accessToken>"
```

### Test 1.2: Register Admin (For Testing)

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@shopflow.com",
    "password": "Admin123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }'

export ADMIN_TOKEN="<accessToken>"
```

### Test 1.3: Duplicate Email

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@shopflow.com",
    "password": "Different123!",
    "firstName": "Jane",
    "lastName": "Doe"
  }'

# Expected Response (409): Email already exists
```

### Test 1.4: Invalid Password

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "weak@shopflow.com",
    "password": "weak",
    "firstName": "Weak",
    "lastName": "Password"
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
    "email": "customer@shopflow.com",
    "password": "Customer123!"
  }'

# Expected Response (200): User data with tokens
```

### Test 2.2: Invalid Credentials

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@shopflow.com",
    "password": "WrongPassword!"
  }'

# Expected Response (401): Invalid email or password
```

### Test 2.3: Get Current User

```bash
curl -X GET http://localhost:3000/api/v1/auth/me \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"

# Expected Response (200): User profile
```

---

## Test Suite 3: Category Management

### Test 3.1: List Categories

```bash
curl -X GET http://localhost:3000/api/v1/categories

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "categories": [
#       {
#         "id": "...",
#         "name": "Clothing",
#         "slug": "clothing",
#         "productCount": X,
#         "children": [...]
#       }
#     ]
#   }
# }
```

### Test 3.2: Create Category (Admin)

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Accessories",
    "slug": "accessories",
    "description": "Fashion accessories"
  }'

# Expected Response (201)
export CATEGORY_ID="<id>"
```

### Test 3.3: Create Category (Non-Admin - Fail)

```bash
curl -X POST http://localhost:3000/api/v1/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d '{
    "name": "Unauthorized",
    "slug": "unauthorized"
  }'

# Expected Response (403): Admin access required
```

### Test 3.4: Get Category with Products

```bash
curl -X GET http://localhost:3000/api/v1/categories/$CATEGORY_ID

# Expected: Category details with products list
```

---

## Test Suite 4: Product Management

### Test 4.1: List Products

```bash
curl -X GET http://localhost:3000/api/v1/products

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "products": [...],
#     "pagination": {
#       "page": 1,
#       "limit": 20,
#       "total": X,
#       "totalPages": X
#     }
#   }
# }
```

### Test 4.2: List Products with Pagination

```bash
curl -X GET "http://localhost:3000/api/v1/products?page=1&limit=5"

# Expected: 5 products per page
```

### Test 4.3: Filter Products by Category

```bash
# Get a category ID first
CLOTHING_ID=$(curl -s http://localhost:3000/api/v1/categories | jq -r '.data.categories[0].id')

curl -X GET "http://localhost:3000/api/v1/products?categoryId=$CLOTHING_ID"

# Expected: Only products in that category
```

### Test 4.4: Filter Products by Price Range

```bash
curl -X GET "http://localhost:3000/api/v1/products?minPrice=20&maxPrice=50"

# Expected: Products with price between 20 and 50
```

### Test 4.5: Search Products

```bash
curl -X GET "http://localhost:3000/api/v1/products?search=shirt"

# Expected: Products matching "shirt" in name or description
```

### Test 4.6: Sort Products

```bash
# Sort by price ascending
curl -X GET "http://localhost:3000/api/v1/products?sortBy=price&sortOrder=asc"

# Sort by newest
curl -X GET "http://localhost:3000/api/v1/products?sortBy=createdAt&sortOrder=desc"
```

### Test 4.7: Get Single Product

```bash
PRODUCT_ID=$(curl -s http://localhost:3000/api/v1/products | jq -r '.data.products[0].id')

curl -X GET http://localhost:3000/api/v1/products/$PRODUCT_ID

# Expected Response (200):
# {
#   "success": true,
#   "data": {
#     "id": "...",
#     "sku": "...",
#     "name": "...",
#     "price": "...",
#     "category": {...},
#     "images": [...]
#   }
# }
```

### Test 4.8: Get Product by Slug

```bash
curl -X GET http://localhost:3000/api/v1/products/slug/classic-cotton-t-shirt

# Expected: Product details
```

### Test 4.9: Create Product (Admin)

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "sku": "TEST-001",
    "name": "Test Product",
    "slug": "test-product",
    "description": "A test product for QA",
    "price": 49.99,
    "compareAtPrice": 69.99,
    "categoryId": "'$CATEGORY_ID'",
    "stockQuantity": 100,
    "images": [
      {
        "url": "https://example.com/product.jpg",
        "altText": "Test Product Image",
        "isPrimary": true
      }
    ]
  }'

# Expected Response (201)
export NEW_PRODUCT_ID="<id>"
```

### Test 4.10: Create Product (Non-Admin - Fail)

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $CUSTOMER_TOKEN" \
  -d '{
    "sku": "FAIL-001",
    "name": "Should Fail",
    "price": 10,
    "categoryId": "'$CATEGORY_ID'"
  }'

# Expected Response (403): Admin access required
```

### Test 4.11: Update Product (Admin)

```bash
curl -X PUT http://localhost:3000/api/v1/products/$NEW_PRODUCT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "price": 39.99,
    "stockQuantity": 150
  }'

# Expected Response (200): Updated product
```

### Test 4.12: Delete Product (Admin)

```bash
curl -X DELETE http://localhost:3000/api/v1/products/$NEW_PRODUCT_ID \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Expected Response (200): Product deleted
```

### Test 4.13: Get Non-Existent Product

```bash
curl -X GET http://localhost:3000/api/v1/products/00000000-0000-0000-0000-000000000000

# Expected Response (404): Product not found
```

---

## Test Suite 5: Validation Tests

### Test 5.1: Invalid SKU (Duplicate)

```bash
# First create a product
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"sku":"DUP-001","name":"First Product","price":10,"categoryId":"'$CATEGORY_ID'"}'

# Try to create another with same SKU
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"sku":"DUP-001","name":"Duplicate SKU","price":20,"categoryId":"'$CATEGORY_ID'"}'

# Expected Response (409): SKU already exists
```

### Test 5.2: Invalid Price

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"sku":"NEG-001","name":"Negative Price","price":-10,"categoryId":"'$CATEGORY_ID'"}'

# Expected Response (400): Price must be positive
```

### Test 5.3: Missing Required Fields

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"name":"Missing SKU and Price"}'

# Expected Response (400): Validation errors
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
  local expected="$2"
  local actual="$3"

  if [ "$actual" -eq "$expected" ]; then
    echo "[PASS] $name"
    ((PASS++))
  else
    echo "[FAIL] $name (expected $expected, got $actual)"
    ((FAIL++))
  fi
}

echo "ShopFlow Sprint 0 QA Tests"
echo "=========================="

# Health Check
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/health")
test_endpoint "Health Check" 200 "$STATUS"

# Register Customer
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$BASE_URL/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"qatest@shopflow.com","password":"QaTest123!","firstName":"QA","lastName":"Test"}')
test_endpoint "Register Customer" 201 "$STATUS"

# Login
RESPONSE=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"qatest@shopflow.com","password":"QaTest123!"}')
TOKEN=$(echo "$RESPONSE" | jq -r '.data.accessToken')
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  echo "[PASS] Login"
  ((PASS++))
else
  echo "[FAIL] Login"
  ((FAIL++))
fi

# List Categories
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/categories")
test_endpoint "List Categories" 200 "$STATUS"

# List Products
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/products")
test_endpoint "List Products" 200 "$STATUS"

# Product Search
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/products?search=test")
test_endpoint "Product Search" 200 "$STATUS"

echo "=========================="
echo "Results: $PASS passed, $FAIL failed"
```

---

## QA Sign-Off Checklist

### Authentication
- [ ] Registration works
- [ ] Login works
- [ ] Token refresh works
- [ ] Invalid credentials rejected
- [ ] Password validation enforced

### Categories
- [ ] List categories works
- [ ] Hierarchical structure correct
- [ ] Product counts accurate
- [ ] Admin CRUD works
- [ ] Non-admin rejected

### Products
- [ ] List products works
- [ ] Pagination works
- [ ] Category filter works
- [ ] Price range filter works
- [ ] Search works
- [ ] Sorting works
- [ ] Single product retrieval works
- [ ] Admin CRUD works
- [ ] Non-admin rejected
- [ ] Validation enforced
