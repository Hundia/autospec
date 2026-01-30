# ShopFlow E-commerce - Sprint 1 Planning Guide

## Sprint Overview

**Sprint**: 1 - Shopping Cart & Checkout
**Duration**: 1-2 weeks
**Prerequisites**: Sprint 0 completed
**Focus**: Shopping cart, checkout flow, order management, reviews

---

## Sprint Goals

1. Implement shopping cart functionality
2. Build checkout flow with address management
3. Create order management system
4. Add product reviews and ratings
5. Implement user address book

---

## User Stories

### US-1.1: Shopping Cart
**As a** customer
**I want** to add products to my cart
**So that** I can purchase multiple items at once

**Acceptance Criteria:**
- [ ] Add to cart: `POST /api/v1/cart/items`
- [ ] View cart: `GET /api/v1/cart`
- [ ] Update quantity: `PUT /api/v1/cart/items/:id`
- [ ] Remove item: `DELETE /api/v1/cart/items/:id`
- [ ] Clear cart: `DELETE /api/v1/cart`
- [ ] Cart persists for logged-in users
- [ ] Guest cart with session ID

### US-1.2: Address Management
**As a** customer
**I want** to manage my addresses
**So that** I can ship orders to different locations

**Acceptance Criteria:**
- [ ] Add address: `POST /api/v1/addresses`
- [ ] List addresses: `GET /api/v1/addresses`
- [ ] Update address: `PUT /api/v1/addresses/:id`
- [ ] Delete address: `DELETE /api/v1/addresses/:id`
- [ ] Set default address
- [ ] Address types: shipping, billing

### US-1.3: Checkout & Orders
**As a** customer
**I want** to checkout my cart
**So that** I can place an order

**Acceptance Criteria:**
- [ ] Create order: `POST /api/v1/orders`
- [ ] View order: `GET /api/v1/orders/:id`
- [ ] List orders: `GET /api/v1/orders`
- [ ] Cancel order: `POST /api/v1/orders/:id/cancel`
- [ ] Order statuses: pending, paid, processing, shipped, delivered, cancelled
- [ ] Stock validation on checkout
- [ ] Order total calculation (subtotal + tax + shipping)

### US-1.4: Product Reviews
**As a** customer
**I want** to review products I've purchased
**So that** I can share my experience

**Acceptance Criteria:**
- [ ] Add review: `POST /api/v1/products/:id/reviews`
- [ ] List reviews: `GET /api/v1/products/:id/reviews`
- [ ] Update review: `PUT /api/v1/reviews/:id`
- [ ] Delete review: `DELETE /api/v1/reviews/:id`
- [ ] Rating 1-5 stars
- [ ] Only purchasers can review

---

## Technical Tasks

### Backend Tasks
| ID | Task | Estimate | Priority |
|----|------|----------|----------|
| BE-1.1 | Create Cart and CartItem models | 1h | P0 |
| BE-1.2 | Create Address model | 1h | P0 |
| BE-1.3 | Create Order and OrderItem models | 1h | P0 |
| BE-1.4 | Create Review model | 1h | P0 |
| BE-1.5 | Implement cart endpoints | 4h | P0 |
| BE-1.6 | Implement address endpoints | 3h | P0 |
| BE-1.7 | Implement order endpoints | 5h | P0 |
| BE-1.8 | Implement review endpoints | 3h | P0 |
| BE-1.9 | Implement checkout service | 4h | P0 |
| BE-1.10 | Stock validation logic | 2h | P0 |
| BE-1.11 | Order total calculation | 2h | P0 |
| BE-1.12 | Write tests | 6h | P1 |

### Frontend Tasks
| ID | Task | Estimate | Priority |
|----|------|----------|----------|
| FE-1.1 | Cart page and mini-cart | 4h | P0 |
| FE-1.2 | Add to cart functionality | 2h | P0 |
| FE-1.3 | Checkout page | 5h | P0 |
| FE-1.4 | Address form and list | 3h | P0 |
| FE-1.5 | Order history page | 3h | P0 |
| FE-1.6 | Order detail page | 3h | P0 |
| FE-1.7 | Product reviews section | 3h | P0 |
| FE-1.8 | Review form | 2h | P0 |

---

## API Endpoints Summary

### Cart
```
GET    /api/v1/cart              - Get current cart
POST   /api/v1/cart/items        - Add item to cart
PUT    /api/v1/cart/items/:id    - Update item quantity
DELETE /api/v1/cart/items/:id    - Remove item from cart
DELETE /api/v1/cart              - Clear cart
```

### Addresses
```
GET    /api/v1/addresses         - List user addresses
POST   /api/v1/addresses         - Add address
PUT    /api/v1/addresses/:id     - Update address
DELETE /api/v1/addresses/:id     - Delete address
```

### Orders
```
GET    /api/v1/orders            - List user orders
POST   /api/v1/orders            - Create order (checkout)
GET    /api/v1/orders/:id        - Get order details
POST   /api/v1/orders/:id/cancel - Cancel order
```

### Reviews
```
GET    /api/v1/products/:id/reviews  - List product reviews
POST   /api/v1/products/:id/reviews  - Add review
PUT    /api/v1/reviews/:id           - Update review
DELETE /api/v1/reviews/:id           - Delete review
```

---

## Database Schema Changes

### New Tables

```prisma
model Cart {
  id        String     @id @default(uuid())
  userId    String?    @map("user_id")
  sessionId String?    @map("session_id")
  expiresAt DateTime   @map("expires_at")
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt

  user  User?      @relation(fields: [userId], references: [id])
  items CartItem[]

  @@index([userId])
  @@index([sessionId])
  @@map("carts")
}

model CartItem {
  id        String   @id @default(uuid())
  cartId    String   @map("cart_id")
  productId String   @map("product_id")
  quantity  Int
  createdAt DateTime @default(now())

  cart    Cart    @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@unique([cartId, productId])
  @@map("cart_items")
}

model Address {
  id         String      @id @default(uuid())
  userId     String      @map("user_id")
  type       AddressType
  firstName  String      @map("first_name")
  lastName   String      @map("last_name")
  street     String
  city       String
  state      String
  postalCode String      @map("postal_code")
  country    String
  phone      String?
  isDefault  Boolean     @default(false) @map("is_default")
  createdAt  DateTime    @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("addresses")
}

enum AddressType {
  SHIPPING
  BILLING
}

model Order {
  id                String      @id @default(uuid())
  orderNumber       String      @unique @map("order_number")
  userId            String      @map("user_id")
  status            OrderStatus @default(PENDING)
  subtotal          Decimal     @db.Decimal(10, 2)
  tax               Decimal     @db.Decimal(10, 2)
  shippingCost      Decimal     @map("shipping_cost") @db.Decimal(10, 2)
  total             Decimal     @db.Decimal(10, 2)
  shippingAddressId String      @map("shipping_address_id")
  billingAddressId  String      @map("billing_address_id")
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt

  user            User        @relation(fields: [userId], references: [id])
  shippingAddress Address     @relation("ShippingAddress", fields: [shippingAddressId], references: [id])
  billingAddress  Address     @relation("BillingAddress", fields: [billingAddressId], references: [id])
  items           OrderItem[]

  @@index([userId])
  @@index([status])
  @@map("orders")
}

enum OrderStatus {
  PENDING
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

model OrderItem {
  id         String  @id @default(uuid())
  orderId    String  @map("order_id")
  productId  String  @map("product_id")
  quantity   Int
  unitPrice  Decimal @map("unit_price") @db.Decimal(10, 2)
  totalPrice Decimal @map("total_price") @db.Decimal(10, 2)

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product @relation(fields: [productId], references: [id])

  @@map("order_items")
}

model Review {
  id         String   @id @default(uuid())
  productId  String   @map("product_id")
  userId     String   @map("user_id")
  rating     Int
  title      String?
  content    String?
  isVerified Boolean  @default(false) @map("is_verified")
  createdAt  DateTime @default(now())

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([productId, userId])
  @@map("reviews")
}
```

---

## Definition of Done (DoD)

### Code Quality
- [ ] ESLint passes
- [ ] TypeScript compiles
- [ ] Code reviewed

### Testing
- [ ] Unit tests (>70%)
- [ ] Integration tests
- [ ] Sprint 0 regression passes

### Functionality
- [ ] Cart CRUD works
- [ ] Checkout creates order
- [ ] Stock validated
- [ ] Reviews work
- [ ] Address management works

---

## Sprint 1 Success Criteria

1. **Shopping Cart**
   - Add/remove/update items
   - Persists for logged-in users

2. **Checkout**
   - Creates order from cart
   - Validates stock
   - Calculates totals

3. **Order Management**
   - Order history viewable
   - Order status tracking

4. **Reviews**
   - Customers can leave reviews
   - Average ratings displayed
