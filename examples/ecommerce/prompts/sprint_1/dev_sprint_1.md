# Sprint 1 Development Execution: Core Shopping Experience

## Environment: claude-code

## Context — Read These Files First

**MANDATORY:** Read ALL these files before writing any code:

### Specs (Read ALL):
- specs/01_product_manager.md   — product requirements, user flows
- specs/02_backend_lead.md      — API design for products, cart, checkout
- specs/03_frontend_lead.md     — component architecture, state management
- specs/04_db_architect.md      — product schema, cart schema, order schema
- specs/05_qa_lead.md           — test strategy
- specs/10_ui_designer.md       — product pages, cart, checkout wireframes
- specs/backlog.md              — Sprint 1 tickets (SF-026 to SF-077)

### Docs (Read ALL relevant):
- docs/architecture/database.md     — ERD with product tables
- docs/api/reference.md             — product, cart, checkout endpoints
- docs/api/curl-examples.md         — API testing commands
- docs/ui-design-system/tokens.md   — design tokens
- docs/ui-design-system/components.md — component specs
- docs/testing/strategy.md          — test pyramid

---

## Your Mission

Execute Sprint 1: Core Shopping Experience

**Goal:** Enable users to browse products, manage cart, and complete basic checkout.

**Prerequisites:**
- Sprint 0 complete (auth working)
- Database running with migrations
- Redis running for sessions

---

## Tickets to Complete (52 Total)

### Phase 1: Database Migrations

#### Ticket SF-026: Create categories table migration
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 2

**Implementation:**
```prisma
model Category {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  imageUrl    String?   @map("image_url")
  parentId    String?   @map("parent_id")
  parent      Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children    Category[] @relation("CategoryHierarchy")
  products    Product[]
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@map("categories")
}
```

**Verification:**
```bash
npx prisma migrate dev --name create_categories_table
```

---

#### Ticket SF-027: Create brands table migration
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 2

**Implementation:**
```prisma
model Brand {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  logoUrl     String?   @map("logo_url")
  products    Product[]
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@map("brands")
}
```

---

#### Ticket SF-028: Create products table migration
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 2

**Implementation:**
```prisma
model Product {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  sku         String    @unique
  price       Decimal   @db.Decimal(10, 2)
  compareAt   Decimal?  @map("compare_at_price") @db.Decimal(10, 2)
  categoryId  String    @map("category_id")
  category    Category  @relation(fields: [categoryId], references: [id])
  brandId     String?   @map("brand_id")
  brand       Brand?    @relation(fields: [brandId], references: [id])
  status      ProductStatus @default(DRAFT)
  inventory   Int       @default(0)
  variants    ProductVariant[]
  images      ProductImage[]
  cartItems   CartItem[]
  orderItems  OrderItem[]
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@index([categoryId])
  @@index([brandId])
  @@index([status])
  @@map("products")
}

enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}
```

---

#### Ticket SF-029: Create product_variants table migration
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 2

```prisma
model ProductVariant {
  id          String    @id @default(uuid())
  productId   String    @map("product_id")
  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  sku         String    @unique
  name        String    // e.g., "Size: Large, Color: Blue"
  price       Decimal   @db.Decimal(10, 2)
  inventory   Int       @default(0)
  options     Json      // { size: "L", color: "Blue" }
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@index([productId])
  @@map("product_variants")
}
```

---

#### Ticket SF-030: Create product_images table migration
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 2

```prisma
model ProductImage {
  id          String    @id @default(uuid())
  productId   String    @map("product_id")
  product     Product   @relation(fields: [productId], references: [id], onDelete: Cascade)
  url         String
  alt         String?
  position    Int       @default(0)
  createdAt   DateTime  @default(now()) @map("created_at")

  @@index([productId])
  @@map("product_images")
}
```

---

### Phase 2: Product API

#### Ticket SF-031: Implement GET /products with pagination
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Files to Create:**
- `backend/src/routes/products.routes.ts`
- `backend/src/controllers/products.controller.ts`
- `backend/src/services/products.service.ts`

**API Contract:**
```
GET /api/v1/products?page=1&limit=20

Response (200):
{
  "products": [
    {
      "id": "uuid",
      "name": "Product Name",
      "slug": "product-name",
      "price": "99.99",
      "compareAtPrice": "129.99",
      "images": [{ "url": "...", "alt": "..." }],
      "category": { "id": "...", "name": "..." },
      "brand": { "id": "...", "name": "..." }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Verification:**
```bash
curl "http://localhost:3001/api/v1/products?page=1&limit=10" | jq .
```

---

#### Ticket SF-032: Implement product filtering
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Add query parameters:**
- `category` - Filter by category slug
- `brand` - Filter by brand slug
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `inStock` - Boolean, filter by availability

**Verification:**
```bash
curl "http://localhost:3001/api/v1/products?category=electronics&minPrice=50&maxPrice=200" | jq .
```

---

#### Ticket SF-033: Implement product sorting
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Add query parameters:**
- `sort` - Field to sort by (price, name, createdAt)
- `order` - asc or desc

**Verification:**
```bash
curl "http://localhost:3001/api/v1/products?sort=price&order=asc" | jq .
```

---

#### Ticket SF-034: Implement GET /products/:id
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**API Contract:**
```
GET /api/v1/products/:id

Response (200):
{
  "id": "uuid",
  "name": "Product Name",
  "slug": "product-name",
  "description": "Full description...",
  "price": "99.99",
  "compareAtPrice": "129.99",
  "sku": "SKU-001",
  "inventory": 50,
  "images": [...],
  "variants": [...],
  "category": {...},
  "brand": {...}
}
```

**Verification:**
```bash
curl "http://localhost:3001/api/v1/products/$PRODUCT_ID" | jq .
```

---

#### Ticket SF-035: Implement GET /categories
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 3

**API Contract:**
```
GET /api/v1/categories

Response (200):
{
  "categories": [
    {
      "id": "uuid",
      "name": "Electronics",
      "slug": "electronics",
      "children": [
        { "id": "...", "name": "Phones", "slug": "phones" }
      ]
    }
  ]
}
```

---

### Phase 3: Cart API

#### Ticket SF-036: Create carts and cart_items tables
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

```prisma
model Cart {
  id          String    @id @default(uuid())
  userId      String?   @map("user_id")
  user        User?     @relation(fields: [userId], references: [id])
  sessionId   String?   @map("session_id") // For guest carts
  items       CartItem[]
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@index([userId])
  @@index([sessionId])
  @@map("carts")
}

model CartItem {
  id          String    @id @default(uuid())
  cartId      String    @map("cart_id")
  cart        Cart      @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId   String    @map("product_id")
  product     Product   @relation(fields: [productId], references: [id])
  variantId   String?   @map("variant_id")
  quantity    Int       @default(1)
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@unique([cartId, productId, variantId])
  @@map("cart_items")
}
```

---

#### Ticket SF-037: Implement GET /cart
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**API Contract:**
```
GET /api/v1/cart
Authorization: Bearer <token> (optional - uses session for guests)

Response (200):
{
  "id": "cart-uuid",
  "items": [
    {
      "id": "item-uuid",
      "product": {
        "id": "prod-uuid",
        "name": "Product",
        "price": "99.99",
        "image": "url"
      },
      "quantity": 2,
      "subtotal": "199.98"
    }
  ],
  "subtotal": "199.98",
  "itemCount": 2
}
```

**Verification:**
```bash
curl "http://localhost:3001/api/v1/cart" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
```

---

#### Ticket SF-038: Implement POST /cart/items
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**API Contract:**
```
POST /api/v1/cart/items
{
  "productId": "uuid",
  "variantId": "uuid", // optional
  "quantity": 1
}

Response (201):
{
  "item": {...},
  "cart": {...}
}
```

**Verification:**
```bash
curl -X POST "http://localhost:3001/api/v1/cart/items" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d '{"productId":"'$PRODUCT_ID'","quantity":1}' | jq .
```

---

#### Ticket SF-039: Implement PATCH /cart/items/:id
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**API Contract:**
```
PATCH /api/v1/cart/items/:itemId
{
  "quantity": 3
}

Response (200):
{
  "item": {...},
  "cart": {...}
}
```

---

#### Ticket SF-040: Implement DELETE /cart/items/:id
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 3

**API Contract:**
```
DELETE /api/v1/cart/items/:itemId

Response (200):
{
  "message": "Item removed",
  "cart": {...}
}
```

---

### Phase 4: Base UI Components

#### Ticket SF-041: Build Button component
**Owner:** Frontend  |  **Model:** Haiku  |  **Points:** 3

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `loading`: boolean
- `fullWidth`: boolean

**File:** `frontend/src/components/atoms/Button.tsx`

---

#### Ticket SF-042: Build Input component with validation
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 3

**Props:**
- `type`: 'text' | 'email' | 'password' | 'number'
- `error`: string
- `label`: string
- `placeholder`: string

**File:** `frontend/src/components/atoms/Input.tsx`

---

#### Ticket SF-043: Build Card component
**Owner:** Frontend  |  **Model:** Haiku  |  **Points:** 3

**File:** `frontend/src/components/atoms/Card.tsx`

---

#### Ticket SF-044: Build Header component
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 3

**Features:**
- Logo with link to home
- Navigation links (Shop, Categories)
- Search bar
- Cart icon with item count badge
- User menu (login/account)

**File:** `frontend/src/components/organisms/Header.tsx`

---

#### Ticket SF-045: Build Footer component
**Owner:** Frontend  |  **Model:** Haiku  |  **Points:** 3

**File:** `frontend/src/components/organisms/Footer.tsx`

---

### Phase 5: Product Components

#### Ticket SF-046: Build ProductCard component
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 4

**Features:**
- Product image with hover effect
- Product name and price
- Sale badge if compareAtPrice exists
- Add to cart button (quick add)
- Link to product detail page

**File:** `frontend/src/components/molecules/ProductCard.tsx`

---

#### Ticket SF-047: Build ProductGrid component
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 4

**Features:**
- Responsive grid (2 col mobile, 3 col tablet, 4 col desktop)
- Loading skeleton state
- Empty state

**File:** `frontend/src/components/organisms/ProductGrid.tsx`

---

#### Ticket SF-048: Build ProductFilters component
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 4

**Features:**
- Category filter (checkbox list)
- Brand filter (checkbox list)
- Price range slider
- Sort dropdown
- Clear filters button

**File:** `frontend/src/components/organisms/ProductFilters.tsx`

---

#### Ticket SF-049: Build Product Listing Page (PLP)
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 4

**Features:**
- Header and Footer
- Sidebar with filters
- Product grid
- Pagination
- URL state for filters

**File:** `frontend/src/app/products/page.tsx`

---

#### Ticket SF-050: Integrate PLP with products API
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 4

**Implementation:**
- Create products API client
- Fetch products with filters
- Handle loading and error states
- Update URL with filter state

---

### Phase 6: Product Detail

#### Ticket SF-051: Build ProductGallery component
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 4

**Features:**
- Main image display
- Thumbnail navigation
- Image zoom on hover
- Swipeable on mobile

**File:** `frontend/src/components/organisms/ProductGallery.tsx`

---

#### Ticket SF-052: Build ProductInfo component
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 4

**Features:**
- Product title and price
- Variant selector (size, color)
- Quantity selector
- Add to cart button
- Stock status
- Description

**File:** `frontend/src/components/organisms/ProductInfo.tsx`

---

#### Ticket SF-053: Build Product Detail Page (PDP)
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 4

**File:** `frontend/src/app/products/[slug]/page.tsx`

---

#### Ticket SF-054: Integrate PDP with product API
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 3

---

### Phase 7: Cart Components

#### Ticket SF-055: Create Zustand cart store
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 3

**Features:**
- Cart items state
- Add to cart action
- Update quantity action
- Remove item action
- Clear cart action
- Sync with backend API

**File:** `frontend/src/stores/cart.store.ts`

---

#### Ticket SF-056: Build CartItem component
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 3

**File:** `frontend/src/components/molecules/CartItem.tsx`

---

#### Ticket SF-057: Build CartSidebar component
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 3

**Features:**
- Slide-in drawer from right
- List of cart items
- Subtotal
- Checkout button

**File:** `frontend/src/components/organisms/CartSidebar.tsx`

---

#### Ticket SF-058: Build Cart Page
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 3

**File:** `frontend/src/app/cart/page.tsx`

---

#### Ticket SF-059: Integrate cart with backend API
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 3

---

### Phase 8: Checkout Backend

#### Ticket SF-060: Create orders and order_items tables
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 4

```prisma
model Order {
  id              String      @id @default(uuid())
  userId          String      @map("user_id")
  user            User        @relation(fields: [userId], references: [id])
  status          OrderStatus @default(PENDING)
  subtotal        Decimal     @db.Decimal(10, 2)
  tax             Decimal     @db.Decimal(10, 2)
  shipping        Decimal     @db.Decimal(10, 2)
  total           Decimal     @db.Decimal(10, 2)
  items           OrderItem[]
  shippingAddress OrderAddress?
  billingAddress  OrderAddress?
  payment         Payment?
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")

  @@index([userId])
  @@map("orders")
}

enum OrderStatus {
  PENDING
  PROCESSING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

model OrderItem {
  id          String    @id @default(uuid())
  orderId     String    @map("order_id")
  order       Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String    @map("product_id")
  product     Product   @relation(fields: [productId], references: [id])
  variantId   String?   @map("variant_id")
  name        String    // Snapshot at time of order
  price       Decimal   @db.Decimal(10, 2)
  quantity    Int

  @@map("order_items")
}
```

---

#### Ticket SF-061: Create order_addresses table
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 3

```prisma
model OrderAddress {
  id          String    @id @default(uuid())
  orderId     String    @map("order_id")
  order       Order     @relation(fields: [orderId], references: [id])
  type        AddressType
  firstName   String    @map("first_name")
  lastName    String    @map("last_name")
  street1     String
  street2     String?
  city        String
  state       String
  postalCode  String    @map("postal_code")
  country     String
  phone       String?

  @@map("order_addresses")
}

enum AddressType {
  SHIPPING
  BILLING
}
```

---

#### Ticket SF-062: Create payments table
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

```prisma
model Payment {
  id                String        @id @default(uuid())
  orderId           String        @unique @map("order_id")
  order             Order         @relation(fields: [orderId], references: [id])
  stripePaymentId   String?       @map("stripe_payment_id")
  stripeCustomerId  String?       @map("stripe_customer_id")
  amount            Decimal       @db.Decimal(10, 2)
  currency          String        @default("usd")
  status            PaymentStatus @default(PENDING)
  method            String?       // card, paypal, etc.
  last4             String?       // Last 4 digits of card
  createdAt         DateTime      @default(now()) @map("created_at")
  updatedAt         DateTime      @updatedAt @map("updated_at")

  @@map("payments")
}

enum PaymentStatus {
  PENDING
  PROCESSING
  SUCCEEDED
  FAILED
  CANCELLED
  REFUNDED
}
```

---

#### Ticket SF-063: Implement POST /checkout/session
**Owner:** Backend  |  **Model:** Opus  |  **Points:** 5

**API Contract:**
```
POST /api/v1/checkout/session
Authorization: Bearer <token>

Response (201):
{
  "checkoutId": "uuid",
  "items": [...],
  "subtotal": "199.98",
  "tax": "16.00",
  "shipping": "9.99",
  "total": "225.97"
}
```

**Implementation:**
1. Get cart items
2. Create order with PENDING status
3. Copy cart items to order items
4. Calculate tax and shipping
5. Return checkout session

---

#### Ticket SF-064: Implement PATCH /checkout/:id/shipping
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**API Contract:**
```
PATCH /api/v1/checkout/:checkoutId/shipping
{
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "street1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "US"
  },
  "shippingMethod": "standard"
}
```

---

#### Ticket SF-065: Implement POST /checkout/:id/payment
**Owner:** Backend  |  **Model:** Opus  |  **Points:** 4

**Implementation:**
1. Create Stripe PaymentIntent
2. Store payment record
3. Return client secret for frontend

**API Contract:**
```
POST /api/v1/checkout/:checkoutId/payment

Response (200):
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentId": "uuid"
}
```

---

#### Ticket SF-066: Implement POST /checkout/:id/complete
**Owner:** Backend  |  **Model:** Opus  |  **Points:** 3

**Implementation:**
1. Verify payment succeeded
2. Update order status to PAID
3. Clear cart
4. Decrement inventory
5. Return order confirmation

---

### Phase 9: Checkout Frontend

#### Ticket SF-067: Build AddressForm component
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 3

**File:** `frontend/src/components/organisms/AddressForm.tsx`

---

#### Ticket SF-068: Build ShippingMethodSelector
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 3

**File:** `frontend/src/components/molecules/ShippingMethodSelector.tsx`

---

#### Ticket SF-069: Build PaymentForm (Stripe)
**Owner:** Frontend  |  **Model:** Opus  |  **Points:** 4

**Implementation:**
- Use @stripe/react-stripe-js
- CardElement for card input
- Handle payment confirmation

**File:** `frontend/src/components/organisms/PaymentForm.tsx`

---

#### Ticket SF-070: Build CheckoutSteps indicator
**Owner:** Frontend  |  **Model:** Haiku  |  **Points:** 2

**File:** `frontend/src/components/molecules/CheckoutSteps.tsx`

---

#### Tickets SF-071 to SF-075: Checkout Pages

Build the following pages:
- `frontend/src/app/checkout/page.tsx` - Information step
- `frontend/src/app/checkout/shipping/page.tsx` - Shipping step
- `frontend/src/app/checkout/payment/page.tsx` - Payment step
- `frontend/src/app/checkout/review/page.tsx` - Review step
- `frontend/src/app/checkout/confirmation/[orderId]/page.tsx` - Success

---

#### Ticket SF-076: Integrate checkout with backend
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 3

---

### Phase 10: E2E Testing

#### Ticket SF-077: Write E2E test for purchase flow
**Owner:** QA  |  **Model:** Sonnet  |  **Points:** 5

**Test Scenario:**
1. Browse to products page
2. Filter by category
3. Click on a product
4. Add to cart
5. Go to cart
6. Proceed to checkout
7. Enter shipping address
8. Select shipping method
9. Enter payment (Stripe test card)
10. Complete order
11. Verify confirmation page

**File:** `frontend/e2e/purchase-flow.spec.ts`

---

## After All Tickets Complete

1. Run full verification:
   ```bash
   cd backend && npm run lint && npm run typecheck && npm test && npm run build
   cd ../frontend && npm run lint && npm run typecheck && npm test && npm run build
   ```

2. Run E2E test:
   ```bash
   cd frontend && npm run test:e2e
   ```

3. Commit:
   ```bash
   git add -A
   git commit -m "Complete Sprint 1: Core Shopping Experience"
   ```

4. Proceed to QA: Run `prompts/sprint_1/qa_sprint_1.md`
