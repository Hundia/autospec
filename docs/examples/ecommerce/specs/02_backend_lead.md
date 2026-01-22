# ShopFlow - Backend Lead Specification

## Document Control
- **Version:** 1.0.0
- **Last Updated:** 2024-01-15
- **Status:** Approved
- **Owner:** Backend Engineering

---

## 1. Architecture Overview

### 1.1 Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Runtime | Node.js 20 LTS | Async I/O, ecosystem |
| Framework | Express.js | Mature, flexible |
| Database | PostgreSQL 16 | ACID compliance, JSON support |
| Cache | Redis 7 | Session storage, caching |
| Search | Elasticsearch 8 | Full-text product search |
| Queue | Bull (Redis) | Background job processing |
| Storage | AWS S3 | Image and file storage |
| Email | SendGrid | Transactional emails |
| Payments | Stripe | Payment processing |

### 1.2 Service Architecture

```
                    [Load Balancer]
                          |
                    [API Gateway]
                          |
        +-----------------+-----------------+
        |                 |                 |
   [Auth Service]   [Product Service]  [Order Service]
        |                 |                 |
        +-----------------+-----------------+
                          |
                    [PostgreSQL]
                          |
                    [Redis Cache]
```

### 1.3 API Design Principles

- RESTful design with resource-based URLs
- JSON request/response bodies
- JWT-based authentication
- Consistent error response format
- Pagination for list endpoints
- Rate limiting for all endpoints
- API versioning via URL prefix (/api/v1)

---

## 2. Authentication API

### 2.1 POST /api/v1/auth/register

**Description:** Register a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "acceptsMarketing": true
}
```

**Validation Rules:**
| Field | Rules |
|-------|-------|
| email | Required, valid email format, unique |
| password | Required, min 8 chars, 1 uppercase, 1 number, 1 special |
| firstName | Required, 1-50 chars, letters only |
| lastName | Required, 1-50 chars, letters only |
| acceptsMarketing | Optional, boolean, default false |

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```

**Error Responses:**
| Code | Scenario | Response |
|------|----------|----------|
| 400 | Validation failed | `{"success": false, "error": {"code": "VALIDATION_ERROR", "message": "...", "details": [...]}}` |
| 409 | Email exists | `{"success": false, "error": {"code": "EMAIL_EXISTS", "message": "Email already registered"}}` |

### 2.2 POST /api/v1/auth/login

**Description:** Authenticate user and receive tokens

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "rememberMe": true
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "customer"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```

**Error Responses:**
| Code | Scenario | Response |
|------|----------|----------|
| 401 | Invalid credentials | `{"success": false, "error": {"code": "INVALID_CREDENTIALS", "message": "Invalid email or password"}}` |
| 423 | Account locked | `{"success": false, "error": {"code": "ACCOUNT_LOCKED", "message": "Account temporarily locked"}}` |

### 2.3 POST /api/v1/auth/logout

**Description:** Invalidate refresh token

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 2.4 POST /api/v1/auth/refresh

**Description:** Refresh access token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

### 2.5 POST /api/v1/auth/forgot-password

**Description:** Request password reset email

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "If an account exists, a reset email has been sent"
}
```

### 2.6 POST /api/v1/auth/reset-password

**Description:** Reset password with token

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### 2.7 GET /api/v1/auth/me

**Description:** Get current user profile

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "role": "customer",
    "emailVerified": true,
    "acceptsMarketing": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 2.8 PATCH /api/v1/auth/me

**Description:** Update current user profile

**Request Body:**
```json
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "phone": "+1987654321"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "firstName": "Johnny",
    "lastName": "Doe",
    "phone": "+1987654321",
    "updatedAt": "2024-01-16T08:00:00Z"
  }
}
```

---

## 3. Products API

### 3.1 GET /api/v1/products

**Description:** List products with filtering, sorting, and pagination

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 20 | Items per page (max 100) |
| sort | string | -createdAt | Sort field with direction |
| category | string | - | Filter by category slug |
| minPrice | number | - | Minimum price filter |
| maxPrice | number | - | Maximum price filter |
| brand | string | - | Filter by brand |
| inStock | boolean | - | Only show in-stock items |
| search | string | - | Full-text search query |
| ids | string | - | Comma-separated product IDs |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_abc123",
        "name": "Premium Wireless Headphones",
        "slug": "premium-wireless-headphones",
        "description": "High-quality wireless headphones with noise cancellation",
        "shortDescription": "Premium audio experience",
        "sku": "WH-PRO-001",
        "price": 199.99,
        "compareAtPrice": 249.99,
        "currency": "USD",
        "images": [
          {
            "id": "img_001",
            "url": "https://cdn.shopflow.com/images/headphones-1.jpg",
            "alt": "Headphones front view",
            "position": 0
          }
        ],
        "category": {
          "id": "cat_electronics",
          "name": "Electronics",
          "slug": "electronics"
        },
        "brand": "AudioTech",
        "rating": 4.5,
        "reviewCount": 128,
        "inStock": true,
        "stockQuantity": 45,
        "variants": [
          {
            "id": "var_black",
            "name": "Black",
            "sku": "WH-PRO-001-BLK",
            "price": 199.99,
            "inStock": true,
            "stockQuantity": 25
          },
          {
            "id": "var_white",
            "name": "White",
            "sku": "WH-PRO-001-WHT",
            "price": 199.99,
            "inStock": true,
            "stockQuantity": 20
          }
        ],
        "attributes": {
          "color": ["Black", "White"],
          "connectivity": "Bluetooth 5.0",
          "batteryLife": "30 hours"
        },
        "tags": ["wireless", "noise-cancelling", "premium"],
        "createdAt": "2024-01-10T10:00:00Z",
        "updatedAt": "2024-01-15T14:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 5,
      "totalItems": 98
    }
  }
}
```

### 3.2 GET /api/v1/products/:id

**Description:** Get single product by ID or slug

**Path Parameters:**
| Parameter | Description |
|-----------|-------------|
| id | Product ID (prod_xxx) or slug |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "prod_abc123",
    "name": "Premium Wireless Headphones",
    "slug": "premium-wireless-headphones",
    "description": "High-quality wireless headphones with active noise cancellation. Features include premium drivers, comfortable ear cups, and 30-hour battery life.",
    "shortDescription": "Premium audio experience",
    "sku": "WH-PRO-001",
    "price": 199.99,
    "compareAtPrice": 249.99,
    "currency": "USD",
    "images": [
      {
        "id": "img_001",
        "url": "https://cdn.shopflow.com/images/headphones-1.jpg",
        "alt": "Headphones front view",
        "position": 0
      },
      {
        "id": "img_002",
        "url": "https://cdn.shopflow.com/images/headphones-2.jpg",
        "alt": "Headphones side view",
        "position": 1
      }
    ],
    "category": {
      "id": "cat_electronics",
      "name": "Electronics",
      "slug": "electronics",
      "breadcrumbs": [
        {"id": "cat_root", "name": "All Products", "slug": "all"},
        {"id": "cat_electronics", "name": "Electronics", "slug": "electronics"}
      ]
    },
    "brand": "AudioTech",
    "rating": 4.5,
    "reviewCount": 128,
    "inStock": true,
    "stockQuantity": 45,
    "lowStockThreshold": 10,
    "variants": [
      {
        "id": "var_black",
        "name": "Black",
        "sku": "WH-PRO-001-BLK",
        "price": 199.99,
        "inStock": true,
        "stockQuantity": 25,
        "images": ["img_001"]
      }
    ],
    "attributes": {
      "color": ["Black", "White"],
      "connectivity": "Bluetooth 5.0",
      "batteryLife": "30 hours",
      "weight": "250g",
      "noiseCancellation": "Active"
    },
    "specifications": [
      {"name": "Driver Size", "value": "40mm"},
      {"name": "Frequency Response", "value": "20Hz - 20kHz"},
      {"name": "Impedance", "value": "32 Ohms"}
    ],
    "relatedProducts": ["prod_def456", "prod_ghi789"],
    "tags": ["wireless", "noise-cancelling", "premium"],
    "seo": {
      "title": "Premium Wireless Headphones | ShopFlow",
      "description": "Shop our premium wireless headphones with noise cancellation",
      "keywords": ["headphones", "wireless", "audio"]
    },
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-15T14:30:00Z"
  }
}
```

### 3.3 POST /api/v1/products (Admin)

**Description:** Create a new product

**Headers:**
```
Authorization: Bearer <adminAccessToken>
```

**Request Body:**
```json
{
  "name": "Ergonomic Keyboard",
  "description": "Split ergonomic keyboard with mechanical switches",
  "shortDescription": "Comfortable typing experience",
  "sku": "KB-ERGO-001",
  "price": 149.99,
  "compareAtPrice": 179.99,
  "categoryId": "cat_electronics",
  "brand": "TechComfort",
  "stockQuantity": 100,
  "lowStockThreshold": 15,
  "images": [
    {
      "url": "https://cdn.shopflow.com/images/keyboard-1.jpg",
      "alt": "Keyboard top view"
    }
  ],
  "variants": [
    {
      "name": "Black - US Layout",
      "sku": "KB-ERGO-001-BLK-US",
      "price": 149.99,
      "stockQuantity": 50
    },
    {
      "name": "White - US Layout",
      "sku": "KB-ERGO-001-WHT-US",
      "price": 149.99,
      "stockQuantity": 50
    }
  ],
  "attributes": {
    "switchType": "Cherry MX Brown",
    "connectivity": "USB-C / Bluetooth"
  },
  "tags": ["ergonomic", "mechanical", "keyboard"],
  "status": "active"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "prod_xyz789",
    "name": "Ergonomic Keyboard",
    "slug": "ergonomic-keyboard",
    "... (full product object)"
  }
}
```

### 3.4 PATCH /api/v1/products/:id (Admin)

**Description:** Update a product

**Request Body (partial update):**
```json
{
  "price": 139.99,
  "stockQuantity": 80,
  "status": "active"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "prod_xyz789",
    "... (updated product object)"
  }
}
```

### 3.5 DELETE /api/v1/products/:id (Admin)

**Description:** Soft delete a product

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### 3.6 GET /api/v1/products/:id/reviews

**Description:** Get product reviews

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Reviews per page |
| sort | string | -createdAt | Sort by rating or date |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": "rev_abc123",
        "userId": "usr_xyz789",
        "userName": "John D.",
        "rating": 5,
        "title": "Excellent headphones!",
        "content": "Best purchase I've made. Sound quality is amazing.",
        "verified": true,
        "helpful": 24,
        "createdAt": "2024-01-12T09:00:00Z"
      }
    ],
    "summary": {
      "averageRating": 4.5,
      "totalReviews": 128,
      "distribution": {
        "5": 78,
        "4": 32,
        "3": 12,
        "2": 4,
        "1": 2
      }
    },
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 13,
      "totalItems": 128
    }
  }
}
```

### 3.7 POST /api/v1/products/:id/reviews

**Description:** Create a product review (authenticated)

**Request Body:**
```json
{
  "rating": 5,
  "title": "Great product!",
  "content": "Exactly as described. Fast shipping too."
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "rev_def456",
    "rating": 5,
    "title": "Great product!",
    "content": "Exactly as described. Fast shipping too.",
    "verified": true,
    "createdAt": "2024-01-16T10:00:00Z"
  }
}
```

---

## 4. Categories API

### 4.1 GET /api/v1/categories

**Description:** Get all categories as tree structure

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "cat_electronics",
        "name": "Electronics",
        "slug": "electronics",
        "description": "Electronic devices and accessories",
        "image": "https://cdn.shopflow.com/categories/electronics.jpg",
        "productCount": 156,
        "children": [
          {
            "id": "cat_headphones",
            "name": "Headphones",
            "slug": "headphones",
            "productCount": 42,
            "children": []
          },
          {
            "id": "cat_keyboards",
            "name": "Keyboards",
            "slug": "keyboards",
            "productCount": 28,
            "children": []
          }
        ]
      },
      {
        "id": "cat_clothing",
        "name": "Clothing",
        "slug": "clothing",
        "productCount": 324,
        "children": [...]
      }
    ]
  }
}
```

### 4.2 GET /api/v1/categories/:slug

**Description:** Get single category with metadata

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cat_electronics",
    "name": "Electronics",
    "slug": "electronics",
    "description": "Electronic devices and accessories",
    "image": "https://cdn.shopflow.com/categories/electronics.jpg",
    "productCount": 156,
    "breadcrumbs": [
      {"id": "cat_root", "name": "All", "slug": "all"},
      {"id": "cat_electronics", "name": "Electronics", "slug": "electronics"}
    ],
    "children": [...],
    "filters": {
      "brands": ["AudioTech", "TechComfort", "SoundMax"],
      "priceRange": {"min": 19.99, "max": 999.99},
      "attributes": {
        "color": ["Black", "White", "Silver"],
        "connectivity": ["Bluetooth", "USB", "Wireless"]
      }
    }
  }
}
```

---

## 5. Cart API

### 5.1 GET /api/v1/cart

**Description:** Get current cart (authenticated or by session)

**Headers:**
```
Authorization: Bearer <accessToken>  (optional)
X-Session-ID: sess_abc123  (for guest cart)
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cart_abc123",
    "items": [
      {
        "id": "item_001",
        "productId": "prod_abc123",
        "variantId": "var_black",
        "name": "Premium Wireless Headphones",
        "variantName": "Black",
        "sku": "WH-PRO-001-BLK",
        "image": "https://cdn.shopflow.com/images/headphones-1.jpg",
        "price": 199.99,
        "quantity": 2,
        "subtotal": 399.98,
        "inStock": true,
        "stockQuantity": 25
      }
    ],
    "itemCount": 2,
    "subtotal": 399.98,
    "discount": {
      "code": "SAVE10",
      "type": "percentage",
      "value": 10,
      "amount": 39.99
    },
    "shipping": {
      "estimated": true,
      "amount": 9.99
    },
    "tax": {
      "estimated": true,
      "rate": 0.08,
      "amount": 28.80
    },
    "total": 398.78,
    "currency": "USD",
    "updatedAt": "2024-01-16T10:00:00Z"
  }
}
```

### 5.2 POST /api/v1/cart/items

**Description:** Add item to cart

**Request Body:**
```json
{
  "productId": "prod_abc123",
  "variantId": "var_black",
  "quantity": 1
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "... (full cart object)"
  }
}
```

**Error Responses:**
| Code | Scenario | Response |
|------|----------|----------|
| 400 | Invalid quantity | `{"success": false, "error": {"code": "INVALID_QUANTITY"}}` |
| 404 | Product not found | `{"success": false, "error": {"code": "PRODUCT_NOT_FOUND"}}` |
| 409 | Insufficient stock | `{"success": false, "error": {"code": "INSUFFICIENT_STOCK", "available": 5}}` |

### 5.3 PATCH /api/v1/cart/items/:itemId

**Description:** Update cart item quantity

**Request Body:**
```json
{
  "quantity": 3
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "... (full cart object)"
  }
}
```

### 5.4 DELETE /api/v1/cart/items/:itemId

**Description:** Remove item from cart

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "... (full cart object)"
  }
}
```

### 5.5 POST /api/v1/cart/coupon

**Description:** Apply coupon code to cart

**Request Body:**
```json
{
  "code": "SAVE10"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "... (cart with discount applied)"
  }
}
```

**Error Responses:**
| Code | Scenario |
|------|----------|
| 400 | Invalid or expired code |
| 400 | Minimum order not met |
| 400 | Coupon already applied |

### 5.6 DELETE /api/v1/cart/coupon

**Description:** Remove coupon from cart

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "... (cart without discount)"
  }
}
```

### 5.7 DELETE /api/v1/cart

**Description:** Clear all items from cart

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "cart_abc123",
    "items": [],
    "itemCount": 0,
    "subtotal": 0,
    "total": 0
  }
}
```

---

## 6. Checkout API

### 6.1 POST /api/v1/checkout/session

**Description:** Create checkout session from cart

**Request Body:**
```json
{
  "email": "customer@example.com"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "sessionId": "chk_abc123",
    "email": "customer@example.com",
    "cart": {
      "... (cart snapshot)"
    },
    "steps": {
      "shipping": "pending",
      "payment": "pending",
      "review": "pending"
    },
    "expiresAt": "2024-01-16T12:00:00Z"
  }
}
```

### 6.2 PATCH /api/v1/checkout/:sessionId/shipping

**Description:** Set shipping address and method

**Request Body:**
```json
{
  "address": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main Street",
    "address2": "Apt 4B",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US",
    "phone": "+1234567890"
  },
  "shippingMethodId": "ship_standard"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "chk_abc123",
    "shipping": {
      "address": {
        "firstName": "John",
        "lastName": "Doe",
        "address1": "123 Main Street",
        "address2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "US",
        "phone": "+1234567890",
        "validated": true
      },
      "method": {
        "id": "ship_standard",
        "name": "Standard Shipping",
        "description": "5-7 business days",
        "price": 9.99
      }
    },
    "availableShippingMethods": [
      {
        "id": "ship_standard",
        "name": "Standard Shipping",
        "description": "5-7 business days",
        "price": 9.99
      },
      {
        "id": "ship_express",
        "name": "Express Shipping",
        "description": "2-3 business days",
        "price": 19.99
      },
      {
        "id": "ship_overnight",
        "name": "Overnight",
        "description": "Next business day",
        "price": 39.99
      }
    ],
    "steps": {
      "shipping": "completed",
      "payment": "pending",
      "review": "pending"
    },
    "totals": {
      "subtotal": 399.98,
      "shipping": 9.99,
      "tax": 32.80,
      "total": 442.77
    }
  }
}
```

### 6.3 POST /api/v1/checkout/:sessionId/payment

**Description:** Submit payment information

**Request Body:**
```json
{
  "paymentMethodId": "pm_card_visa",
  "billingAddress": {
    "sameAsShipping": true
  }
}
```

**Alternative - New Card:**
```json
{
  "card": {
    "number": "4242424242424242",
    "expMonth": 12,
    "expYear": 2025,
    "cvc": "123"
  },
  "billingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US"
  },
  "saveCard": true
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "chk_abc123",
    "payment": {
      "method": "card",
      "brand": "visa",
      "last4": "4242",
      "expMonth": 12,
      "expYear": 2025
    },
    "steps": {
      "shipping": "completed",
      "payment": "completed",
      "review": "pending"
    }
  }
}
```

### 6.4 POST /api/v1/checkout/:sessionId/complete

**Description:** Complete checkout and create order

**Request Body:**
```json
{
  "notes": "Please leave at door"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": "ord_abc123",
      "orderNumber": "SF-2024-001234",
      "status": "confirmed",
      "items": [...],
      "shipping": {...},
      "payment": {
        "status": "captured",
        "method": "card",
        "last4": "4242"
      },
      "totals": {
        "subtotal": 399.98,
        "discount": 39.99,
        "shipping": 9.99,
        "tax": 32.80,
        "total": 402.78
      },
      "createdAt": "2024-01-16T11:00:00Z"
    },
    "confirmation": {
      "emailSent": true,
      "estimatedDelivery": "2024-01-23"
    }
  }
}
```

**Error Responses:**
| Code | Scenario |
|------|----------|
| 400 | Incomplete checkout steps |
| 402 | Payment declined |
| 409 | Inventory changed during checkout |

---

## 7. Orders API

### 7.1 GET /api/v1/orders

**Description:** Get user's order history

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 1 | Page number |
| limit | integer | 10 | Orders per page |
| status | string | - | Filter by status |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "ord_abc123",
        "orderNumber": "SF-2024-001234",
        "status": "shipped",
        "itemCount": 2,
        "total": 402.78,
        "currency": "USD",
        "createdAt": "2024-01-16T11:00:00Z",
        "shipping": {
          "method": "Standard Shipping",
          "trackingNumber": "1Z999AA10123456784",
          "carrier": "UPS",
          "estimatedDelivery": "2024-01-23"
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalPages": 3,
      "totalItems": 25
    }
  }
}
```

### 7.2 GET /api/v1/orders/:id

**Description:** Get single order details

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "ord_abc123",
    "orderNumber": "SF-2024-001234",
    "status": "shipped",
    "statusHistory": [
      {"status": "pending", "timestamp": "2024-01-16T11:00:00Z"},
      {"status": "confirmed", "timestamp": "2024-01-16T11:00:05Z"},
      {"status": "processing", "timestamp": "2024-01-17T09:00:00Z"},
      {"status": "shipped", "timestamp": "2024-01-18T14:00:00Z"}
    ],
    "items": [
      {
        "id": "item_001",
        "productId": "prod_abc123",
        "name": "Premium Wireless Headphones",
        "variantName": "Black",
        "sku": "WH-PRO-001-BLK",
        "image": "https://cdn.shopflow.com/images/headphones-1.jpg",
        "price": 199.99,
        "quantity": 2,
        "subtotal": 399.98
      }
    ],
    "shipping": {
      "address": {
        "firstName": "John",
        "lastName": "Doe",
        "address1": "123 Main Street",
        "address2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "US"
      },
      "method": "Standard Shipping",
      "trackingNumber": "1Z999AA10123456784",
      "carrier": "UPS",
      "trackingUrl": "https://ups.com/track?num=1Z999AA10123456784",
      "estimatedDelivery": "2024-01-23"
    },
    "payment": {
      "method": "card",
      "brand": "visa",
      "last4": "4242",
      "status": "captured"
    },
    "totals": {
      "subtotal": 399.98,
      "discount": 39.99,
      "shipping": 9.99,
      "tax": 32.80,
      "total": 402.78
    },
    "notes": "Please leave at door",
    "createdAt": "2024-01-16T11:00:00Z",
    "updatedAt": "2024-01-18T14:00:00Z"
  }
}
```

### 7.3 POST /api/v1/orders/:id/cancel

**Description:** Cancel an order (if not yet shipped)

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "ord_abc123",
    "status": "cancelled",
    "refund": {
      "id": "ref_xyz789",
      "amount": 402.78,
      "status": "pending",
      "estimatedArrival": "5-7 business days"
    }
  }
}
```

### 7.4 POST /api/v1/orders/:id/return

**Description:** Request a return

**Request Body:**
```json
{
  "items": [
    {
      "itemId": "item_001",
      "quantity": 1,
      "reason": "defective",
      "description": "Left speaker not working"
    }
  ]
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "returnId": "ret_abc123",
    "orderId": "ord_abc123",
    "status": "pending_approval",
    "items": [...],
    "returnLabel": {
      "url": "https://cdn.shopflow.com/labels/ret_abc123.pdf",
      "carrier": "UPS",
      "trackingNumber": "1Z999AA10123456785"
    },
    "refundAmount": 199.99,
    "createdAt": "2024-01-25T10:00:00Z"
  }
}
```

---

## 8. User Addresses API

### 8.1 GET /api/v1/users/me/addresses

**Description:** Get user's saved addresses

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "addresses": [
      {
        "id": "addr_abc123",
        "firstName": "John",
        "lastName": "Doe",
        "address1": "123 Main Street",
        "address2": "Apt 4B",
        "city": "New York",
        "state": "NY",
        "postalCode": "10001",
        "country": "US",
        "phone": "+1234567890",
        "isDefault": true,
        "type": "shipping"
      }
    ]
  }
}
```

### 8.2 POST /api/v1/users/me/addresses

**Description:** Add new address

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "address1": "456 Oak Avenue",
  "city": "Los Angeles",
  "state": "CA",
  "postalCode": "90001",
  "country": "US",
  "phone": "+1987654321",
  "isDefault": false,
  "type": "shipping"
}
```

### 8.3 PATCH /api/v1/users/me/addresses/:id

**Description:** Update address

### 8.4 DELETE /api/v1/users/me/addresses/:id

**Description:** Delete address

---

## 9. Search API

### 9.1 GET /api/v1/search

**Description:** Full-text product search with facets

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query (required) |
| page | integer | Page number |
| limit | integer | Results per page |
| filters | object | Facet filters (JSON) |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "query": "wireless headphones",
    "results": [
      {
        "id": "prod_abc123",
        "name": "Premium Wireless Headphones",
        "... (product fields)",
        "score": 0.95,
        "highlights": {
          "name": "<em>Wireless</em> <em>Headphones</em>",
          "description": "High-quality <em>wireless</em> <em>headphones</em> with..."
        }
      }
    ],
    "facets": {
      "category": [
        {"value": "Electronics", "count": 45},
        {"value": "Accessories", "count": 12}
      ],
      "brand": [
        {"value": "AudioTech", "count": 15},
        {"value": "SoundMax", "count": 10}
      ],
      "price": {
        "min": 29.99,
        "max": 499.99,
        "ranges": [
          {"label": "Under $50", "min": 0, "max": 50, "count": 8},
          {"label": "$50-$100", "min": 50, "max": 100, "count": 12},
          {"label": "$100-$200", "min": 100, "max": 200, "count": 18},
          {"label": "Over $200", "min": 200, "max": null, "count": 19}
        ]
      }
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "totalPages": 3,
      "totalItems": 57
    },
    "suggestions": ["wireless earbuds", "bluetooth headphones"]
  }
}
```

### 9.2 GET /api/v1/search/autocomplete

**Description:** Search suggestions for autocomplete

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Partial query |
| limit | integer | Max suggestions (default 5) |

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {"text": "wireless headphones", "type": "query"},
      {"text": "wireless earbuds", "type": "query"},
      {"text": "Premium Wireless Headphones", "type": "product", "id": "prod_abc123"},
      {"text": "Wireless Keyboard", "type": "product", "id": "prod_def456"}
    ]
  }
}
```

---

## 10. Webhooks

### 10.1 Available Events

| Event | Trigger | Payload |
|-------|---------|---------|
| order.created | New order placed | Order object |
| order.paid | Payment confirmed | Order + payment |
| order.shipped | Tracking added | Order + shipping |
| order.delivered | Delivery confirmed | Order object |
| order.cancelled | Order cancelled | Order + refund |
| product.created | New product | Product object |
| product.updated | Product changed | Product object |
| product.low_stock | Stock below threshold | Product + quantity |
| customer.created | New registration | User object |

### 10.2 Webhook Payload Format

```json
{
  "id": "evt_abc123",
  "type": "order.created",
  "timestamp": "2024-01-16T11:00:00Z",
  "data": {
    "... (relevant object)"
  }
}
```

### 10.3 Webhook Security

- HMAC-SHA256 signature in `X-Shopflow-Signature` header
- Timestamp validation within 5 minutes
- Retry with exponential backoff (3 attempts)

---

## 11. Error Handling

### 11.1 Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [
      {"field": "email", "message": "Invalid email format"}
    ],
    "requestId": "req_abc123"
  }
}
```

### 11.2 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| INVALID_CREDENTIALS | 401 | Login failed |
| TOKEN_EXPIRED | 401 | JWT token expired |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| EMAIL_EXISTS | 409 | Email already registered |
| INSUFFICIENT_STOCK | 409 | Not enough inventory |
| PAYMENT_DECLINED | 402 | Payment failed |
| RATE_LIMITED | 429 | Too many requests |
| INTERNAL_ERROR | 500 | Server error |

---

## 12. Rate Limiting

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| Authentication | 5 requests | 1 minute |
| Search | 30 requests | 1 minute |
| Cart operations | 60 requests | 1 minute |
| General API | 100 requests | 1 minute |

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705402800
```

---

*Document End - Backend Lead Specification*
