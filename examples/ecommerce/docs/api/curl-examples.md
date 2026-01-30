# ShopFlow cURL Examples

## Overview

Runnable cURL examples for all ShopFlow e-commerce API endpoints.

---

## Setup

```bash
# Set base URL
export API_URL="http://localhost:4000"

# For staging
# export API_URL="https://staging-api.shopflow.io"

# For production
# export API_URL="https://api.shopflow.io"
```

---

## Authentication

### Register New User

```bash
curl -X POST "${API_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecureP@ss123",
    "firstName": "John",
    "lastName": "Doe",
    "acceptTerms": true
  }'

# Response:
# {
#   "user": { "id": "usr_abc123", "email": "customer@example.com" },
#   "accessToken": "eyJhbGciOiJIUzI1NiIs...",
#   "refreshToken": "rt_xyz789"
# }
```

### Login

```bash
curl -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com",
    "password": "SecureP@ss123"
  }'

# Store the token
export TOKEN=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "customer@example.com", "password": "SecureP@ss123"}' | jq -r '.accessToken')
```

### Refresh Token

```bash
curl -X POST "${API_URL}/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "rt_xyz789"
  }'
```

### Logout

```bash
curl -X POST "${API_URL}/auth/logout" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "rt_xyz789"
  }'
```

### Forgot Password

```bash
curl -X POST "${API_URL}/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "customer@example.com"
  }'
```

---

## Products

### List Products

```bash
# Basic list
curl -X GET "${API_URL}/api/products" \
  -H "Authorization: Bearer ${TOKEN}"

# With pagination
curl -X GET "${API_URL}/api/products?page=1&limit=20" \
  -H "Authorization: Bearer ${TOKEN}"

# Filter by category
curl -X GET "${API_URL}/api/products?category=clothing" \
  -H "Authorization: Bearer ${TOKEN}"

# Filter by price range
curl -X GET "${API_URL}/api/products?minPrice=10&maxPrice=100" \
  -H "Authorization: Bearer ${TOKEN}"

# Sort by price
curl -X GET "${API_URL}/api/products?sort=price" \
  -H "Authorization: Bearer ${TOKEN}"

# Combined filters
curl -X GET "${API_URL}/api/products?category=electronics&minPrice=50&maxPrice=500&sort=-rating&page=1&limit=10" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Get Single Product

```bash
curl -X GET "${API_URL}/api/products/prod_abc123" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Search Products

```bash
curl -X GET "${API_URL}/api/products/search?q=wireless+headphones" \
  -H "Authorization: Bearer ${TOKEN}"

# With filters
curl -X GET "${API_URL}/api/products/search?q=shirt&category=clothing&minPrice=20" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Get Product Reviews

```bash
curl -X GET "${API_URL}/api/products/prod_abc123/reviews?page=1&limit=10" \
  -H "Authorization: Bearer ${TOKEN}"
```

---

## Shopping Cart

### Get Cart

```bash
curl -X GET "${API_URL}/api/cart" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Add Item to Cart

```bash
curl -X POST "${API_URL}/api/cart/items" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_abc123",
    "variantId": "var_xyz789",
    "quantity": 2
  }'
```

### Update Cart Item

```bash
curl -X PATCH "${API_URL}/api/cart/items/item_123" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

### Remove Cart Item

```bash
curl -X DELETE "${API_URL}/api/cart/items/item_123" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Clear Cart

```bash
curl -X DELETE "${API_URL}/api/cart" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Apply Coupon

```bash
curl -X POST "${API_URL}/api/cart/coupon" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "SAVE10"
  }'
```

### Remove Coupon

```bash
curl -X DELETE "${API_URL}/api/cart/coupon" \
  -H "Authorization: Bearer ${TOKEN}"
```

---

## Orders

### Create Order (Checkout)

```bash
curl -X POST "${API_URL}/api/orders" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": {
      "firstName": "John",
      "lastName": "Doe",
      "address1": "123 Main Street",
      "address2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "US",
      "phone": "+12125551234"
    },
    "billingAddress": {
      "sameAsShipping": true
    },
    "shippingMethod": "standard",
    "paymentMethodId": "pm_card_visa"
  }'
```

### List Orders

```bash
# All orders
curl -X GET "${API_URL}/api/orders" \
  -H "Authorization: Bearer ${TOKEN}"

# With pagination
curl -X GET "${API_URL}/api/orders?page=1&limit=10" \
  -H "Authorization: Bearer ${TOKEN}"

# Filter by status
curl -X GET "${API_URL}/api/orders?status=delivered" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Get Order Details

```bash
curl -X GET "${API_URL}/api/orders/order_abc123" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Cancel Order

```bash
curl -X POST "${API_URL}/api/orders/order_abc123/cancel" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Changed my mind"
  }'
```

### Track Order

```bash
curl -X GET "${API_URL}/api/orders/order_abc123/tracking" \
  -H "Authorization: Bearer ${TOKEN}"
```

---

## User Profile

### Get Profile

```bash
curl -X GET "${API_URL}/api/users/me" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Update Profile

```bash
curl -X PATCH "${API_URL}/api/users/me" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Smith",
    "phone": "+12125551234"
  }'
```

### Change Password

```bash
curl -X POST "${API_URL}/api/users/me/change-password" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "SecureP@ss123",
    "newPassword": "NewSecureP@ss456"
  }'
```

### List Addresses

```bash
curl -X GET "${API_URL}/api/users/me/addresses" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Add Address

```bash
curl -X POST "${API_URL}/api/users/me/addresses" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Home",
    "firstName": "John",
    "lastName": "Doe",
    "address1": "456 Oak Avenue",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "country": "US",
    "isDefault": true
  }'
```

---

## Wishlist

### Get Wishlist

```bash
curl -X GET "${API_URL}/api/wishlist" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Add to Wishlist

```bash
curl -X POST "${API_URL}/api/wishlist" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "prod_abc123"
  }'
```

### Remove from Wishlist

```bash
curl -X DELETE "${API_URL}/api/wishlist/prod_abc123" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Move to Cart

```bash
curl -X POST "${API_URL}/api/wishlist/prod_abc123/move-to-cart" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "variantId": "var_xyz789",
    "quantity": 1
  }'
```

---

## Health & Status

### Health Check

```bash
curl -X GET "${API_URL}/health"

# Expected:
# {
#   "status": "healthy",
#   "version": "1.5.0",
#   "timestamp": "2024-01-20T10:30:00Z"
# }
```

### Detailed Health

```bash
curl -X GET "${API_URL}/health/detailed"

# Expected:
# {
#   "status": "healthy",
#   "services": {
#     "database": "healthy",
#     "redis": "healthy",
#     "elasticsearch": "healthy"
#   }
# }
```

---

## Debugging

### Verbose Output

```bash
curl -v -X GET "${API_URL}/api/products" \
  -H "Authorization: Bearer ${TOKEN}"
```

### Check Rate Limits

```bash
curl -s -I -X GET "${API_URL}/api/products" \
  -H "Authorization: Bearer ${TOKEN}" | grep -i "x-ratelimit"
```

### Time Request

```bash
curl -w "\nTime: %{time_total}s\n" \
  "${API_URL}/api/products" \
  -H "Authorization: Bearer ${TOKEN}"
```

---

## Related Documents

- [API Reference](./reference.md)
- [Authentication](./authentication.md)
- [Error Codes](./error-codes.md)
- [Rate Limiting](./rate-limiting.md)
