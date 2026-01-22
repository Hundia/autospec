# ShopFlow Sprint 1 - Core Shopping Experience

## Sprint Overview

**Sprint Goal:** Enable users to browse products, manage cart, and complete basic checkout.

**Duration:** 2 weeks

**Prerequisites:** Sprint 0 completed (auth, infrastructure)

**Key Deliverables:**
- Product catalog with categories and filtering
- Product detail pages with variants
- Shopping cart with persistence
- Complete checkout flow
- Order creation and confirmation

---

## Ticket Breakdown

### SF-026: Create database migration for categories table

**Objective:** Define the product categories schema.

**Schema Definition:**
```prisma
model Category {
  id          String     @id @default(uuid())
  parentId    String?    @map("parent_id")
  name        String
  slug        String     @unique
  description String?
  imageUrl    String?    @map("image_url")
  sortOrder   Int        @default(0) @map("sort_order")
  isActive    Boolean    @default(true) @map("is_active")
  metaTitle   String?    @map("meta_title")
  metaDesc    String?    @map("meta_description")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
  products Product[]

  @@map("categories")
}
```

**Seed Data:**
```typescript
const categories = [
  { name: 'Electronics', slug: 'electronics', sortOrder: 1 },
  { name: 'Headphones', slug: 'headphones', parentSlug: 'electronics', sortOrder: 1 },
  { name: 'Keyboards', slug: 'keyboards', parentSlug: 'electronics', sortOrder: 2 },
  { name: 'Clothing', slug: 'clothing', sortOrder: 2 },
  { name: "Men's", slug: 'mens', parentSlug: 'clothing', sortOrder: 1 },
  { name: "Women's", slug: 'womens', parentSlug: 'clothing', sortOrder: 2 },
];
```

**Acceptance Criteria:**
- [ ] Migration creates categories table
- [ ] Self-referential relation works
- [ ] Seed data loads correctly

---

### SF-027: Create database migration for brands table

**Schema Definition:**
```prisma
model Brand {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  logoUrl     String?   @map("logo_url")
  websiteUrl  String?   @map("website_url")
  isActive    Boolean   @default(true) @map("is_active")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  products Product[]

  @@map("brands")
}
```

---

### SF-028: Create database migration for products table

**Schema Definition:**
```prisma
model Product {
  id                String    @id @default(uuid())
  categoryId        String?   @map("category_id")
  brandId           String?   @map("brand_id")
  name              String
  slug              String    @unique
  sku               String    @unique
  description       String?
  shortDescription  String?   @map("short_description")
  price             Decimal   @db.Decimal(10, 2)
  compareAtPrice    Decimal?  @map("compare_at_price") @db.Decimal(10, 2)
  costPrice         Decimal?  @map("cost_price") @db.Decimal(10, 2)
  currency          String    @default("USD") @db.Char(3)
  stockQuantity     Int       @default(0) @map("stock_quantity")
  lowStockThreshold Int       @default(10) @map("low_stock_threshold")
  trackInventory    Boolean   @default(true) @map("track_inventory")
  allowBackorder    Boolean   @default(false) @map("allow_backorder")
  weightGrams       Int?      @map("weight_grams")
  isActive          Boolean   @default(true) @map("is_active")
  isFeatured        Boolean   @default(false) @map("is_featured")
  metaTitle         String?   @map("meta_title")
  metaDescription   String?   @map("meta_description")
  attributes        Json      @default("{}")
  tags              String[]  @default([])
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  deletedAt         DateTime? @map("deleted_at")

  category Category? @relation(fields: [categoryId], references: [id])
  brand    Brand?    @relation(fields: [brandId], references: [id])
  variants ProductVariant[]
  images   ProductImage[]

  @@map("products")
}
```

---

### SF-029: Create database migration for product_variants table

**Schema Definition:**
```prisma
model ProductVariant {
  id             String   @id @default(uuid())
  productId      String   @map("product_id")
  name           String
  sku            String   @unique
  price          Decimal? @db.Decimal(10, 2)
  compareAtPrice Decimal? @map("compare_at_price") @db.Decimal(10, 2)
  stockQuantity  Int      @default(0) @map("stock_quantity")
  weightGrams    Int?     @map("weight_grams")
  optionValues   Json     @default("{}") @map("option_values")
  isActive       Boolean  @default(true) @map("is_active")
  sortOrder      Int      @default(0) @map("sort_order")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_variants")
}
```

---

### SF-030: Create database migration for product_images table

**Schema Definition:**
```prisma
model ProductImage {
  id        String   @id @default(uuid())
  productId String   @map("product_id")
  variantId String?  @map("variant_id")
  url       String
  altText   String?  @map("alt_text")
  sortOrder Int      @default(0) @map("sort_order")
  isPrimary Boolean  @default(false) @map("is_primary")
  width     Int?
  height    Int?
  fileSize  Int?     @map("file_size")
  createdAt DateTime @default(now()) @map("created_at")

  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@map("product_images")
}
```

---

### SF-031: Implement GET /api/v1/products endpoint with pagination

**Objective:** Return paginated product list.

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)
- `sort` (default: -createdAt)

**Implementation:**
```typescript
// src/controllers/products.controller.ts
export const getProducts = async (req: Request, res: Response) => {
  const { page = 1, limit = 20, sort = '-createdAt' } = req.query;

  const skip = (Number(page) - 1) * Number(limit);
  const take = Math.min(Number(limit), 100);

  const [sortField, sortOrder] = sort.startsWith('-')
    ? [sort.slice(1), 'desc']
    : [sort, 'asc'];

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true, deletedAt: null },
      include: {
        category: true,
        brand: true,
        images: { where: { isPrimary: true }, take: 1 },
        variants: { where: { isActive: true } },
      },
      skip,
      take,
      orderBy: { [sortField]: sortOrder },
    }),
    prisma.product.count({ where: { isActive: true, deletedAt: null } }),
  ]);

  return res.json({
    success: true,
    data: {
      products: products.map(formatProduct),
      pagination: {
        page: Number(page),
        limit: take,
        totalPages: Math.ceil(total / take),
        totalItems: total,
      },
    },
  });
};
```

**Acceptance Criteria:**
- [ ] Returns paginated products
- [ ] Includes category, brand, primary image
- [ ] Sorting works correctly
- [ ] Pagination metadata accurate

---

### SF-032: Implement product filtering

**Query Parameters:**
- `category` - category slug
- `brand` - brand slug
- `minPrice`, `maxPrice` - price range
- `inStock` - boolean
- `ids` - comma-separated product IDs

**Implementation:**
```typescript
const buildWhereClause = (query: any) => {
  const where: any = { isActive: true, deletedAt: null };

  if (query.category) {
    where.category = { slug: query.category };
  }

  if (query.brand) {
    where.brand = { slug: query.brand };
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) where.price.gte = Number(query.minPrice);
    if (query.maxPrice) where.price.lte = Number(query.maxPrice);
  }

  if (query.inStock === 'true') {
    where.stockQuantity = { gt: 0 };
  }

  if (query.ids) {
    where.id = { in: query.ids.split(',') };
  }

  return where;
};
```

**Acceptance Criteria:**
- [ ] Category filter works
- [ ] Price range filter works
- [ ] In-stock filter works
- [ ] Multiple filters combine with AND

---

### SF-033: Implement product sorting

**Sort Options:**
- `-createdAt` - Newest first
- `createdAt` - Oldest first
- `price` - Price low to high
- `-price` - Price high to low
- `name` - Alphabetical
- `-rating` - Best rated (future)

**Acceptance Criteria:**
- [ ] All sort options work
- [ ] Default sort is newest first
- [ ] Invalid sort falls back to default

---

### SF-034: Implement GET /api/v1/products/:id endpoint

**Objective:** Return full product details.

**Features:**
- Accept ID or slug
- Include all variants
- Include all images
- Include category breadcrumbs
- Include related products (optional)

**Response includes:**
- Full product data
- All variants with stock
- All images sorted
- Category with breadcrumbs
- Brand info
- Specifications from attributes

**Acceptance Criteria:**
- [ ] Returns complete product
- [ ] Works with ID or slug
- [ ] 404 for non-existent product
- [ ] Includes all relations

---

### SF-035: Implement GET /api/v1/categories endpoint

**Objective:** Return category tree structure.

**Response Format:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "...",
        "name": "Electronics",
        "slug": "electronics",
        "productCount": 156,
        "children": [
          {
            "id": "...",
            "name": "Headphones",
            "slug": "headphones",
            "productCount": 42,
            "children": []
          }
        ]
      }
    ]
  }
}
```

**Acceptance Criteria:**
- [ ] Returns nested tree structure
- [ ] Includes product counts
- [ ] Only active categories

---

### SF-036: Create database migration for carts and cart_items

**Schema Definition:**
```prisma
model Cart {
  id        String     @id @default(uuid())
  userId    String?    @map("user_id")
  sessionId String?    @unique @map("session_id")
  couponId  String?    @map("coupon_id")
  currency  String     @default("USD") @db.Char(3)
  notes     String?
  expiresAt DateTime?  @map("expires_at")
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")

  user  User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items CartItem[]

  @@map("carts")
}

model CartItem {
  id        String   @id @default(uuid())
  cartId    String   @map("cart_id")
  productId String   @map("product_id")
  variantId String?  @map("variant_id")
  quantity  Int      @default(1)
  unitPrice Decimal  @map("unit_price") @db.Decimal(10, 2)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  cart    Cart            @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product Product         @relation(fields: [productId], references: [id])
  variant ProductVariant? @relation(fields: [variantId], references: [id])

  @@unique([cartId, productId, variantId])
  @@map("cart_items")
}
```

---

### SF-037: Implement GET /api/v1/cart endpoint

**Objective:** Return current user's cart.

**Features:**
- Return cart for authenticated user
- Return cart for session (guest)
- Calculate totals
- Validate stock availability

**Response includes:**
- Cart items with product details
- Item count
- Subtotal
- Applied discount (if coupon)
- Estimated shipping
- Estimated tax
- Total

**Acceptance Criteria:**
- [ ] Returns user cart if authenticated
- [ ] Returns session cart for guests
- [ ] Creates empty cart if none exists
- [ ] Calculates totals correctly

---

### SF-038: Implement POST /api/v1/cart/items endpoint

**Request Body:**
```json
{
  "productId": "prod_123",
  "variantId": "var_abc",
  "quantity": 2
}
```

**Logic:**
1. Validate product exists and is active
2. Validate variant if specified
3. Check stock availability
4. Add to cart or update quantity if exists
5. Return updated cart

**Error Handling:**
- 404: Product not found
- 409: Insufficient stock (return available quantity)
- 400: Invalid quantity

**Acceptance Criteria:**
- [ ] Adds new item to cart
- [ ] Updates quantity if item exists
- [ ] Validates stock
- [ ] Returns full cart

---

### SF-039: Implement PATCH /api/v1/cart/items/:id endpoint

**Request Body:**
```json
{
  "quantity": 5
}
```

**Logic:**
1. Find cart item
2. Validate new quantity against stock
3. Update quantity
4. Return updated cart

**Acceptance Criteria:**
- [ ] Updates quantity
- [ ] Validates stock
- [ ] 404 for invalid item ID
- [ ] Returns updated cart

---

### SF-040: Implement DELETE /api/v1/cart/items/:id endpoint

**Logic:**
1. Find cart item
2. Remove from cart
3. Return updated cart

**Acceptance Criteria:**
- [ ] Removes item from cart
- [ ] 404 for invalid item ID
- [ ] Returns updated cart

---

### SF-041: Build reusable Button component

**Variants:**
- primary, secondary, outline, ghost, danger

**Sizes:**
- sm, md, lg

**States:**
- default, hover, active, disabled, loading

**Props:**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
  onClick?: () => void;
}
```

**Acceptance Criteria:**
- [ ] All variants styled correctly
- [ ] All sizes correct
- [ ] Loading state shows spinner
- [ ] Disabled state prevents clicks

---

### SF-042: Build reusable Input component

**Types:**
- text, email, password, number, tel, search

**Features:**
- Label
- Helper text
- Error message
- Left/right icons
- Disabled state

**Acceptance Criteria:**
- [ ] All types work
- [ ] Error state styled
- [ ] Icons positioned correctly
- [ ] Accessible (label linked)

---

### SF-043: Build reusable Card component

**Props:**
```typescript
interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  border?: boolean;
  hoverable?: boolean;
  children: ReactNode;
}
```

**Acceptance Criteria:**
- [ ] Padding variants work
- [ ] Shadow variants work
- [ ] Hover effect on hoverable
- [ ] Border optional

---

### SF-044: Build Header component

**Features:**
- Logo (linked to home)
- Search bar (placeholder for now)
- Main navigation
- Cart icon with count badge
- User menu (login/account dropdown)
- Mobile hamburger menu

**Acceptance Criteria:**
- [ ] Sticky on scroll
- [ ] Responsive layout
- [ ] Cart badge updates
- [ ] User menu works

---

### SF-045: Build Footer component

**Sections:**
- Company info
- Shop links
- Support links
- Newsletter signup
- Social icons
- Payment icons
- Copyright

**Acceptance Criteria:**
- [ ] All sections present
- [ ] Links work
- [ ] Responsive layout

---

### SF-046: Build ProductCard component

**Features:**
- Product image
- Sale badge
- Out of stock overlay
- Product name
- Price (and compare price)
- Rating stars
- Quick add button on hover
- Wishlist heart icon

**Acceptance Criteria:**
- [ ] Image displays
- [ ] Sale badge shows when applicable
- [ ] Out of stock state works
- [ ] Hover effects work

---

### SF-047: Build ProductGrid component

**Props:**
```typescript
interface ProductGridProps {
  products: Product[];
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  isLoading?: boolean;
}
```

**Features:**
- Responsive grid
- Loading skeleton
- Empty state

**Acceptance Criteria:**
- [ ] Responsive columns
- [ ] Loading skeletons show
- [ ] Empty state message

---

### SF-048: Build ProductFilters component

**Filter Types:**
- Category tree (collapsible)
- Price range slider
- Brand checkboxes
- In-stock toggle
- Clear all button

**Acceptance Criteria:**
- [ ] All filter types work
- [ ] Collapsible sections
- [ ] Clear all resets filters
- [ ] Mobile drawer version

---

### SF-049: Build Product Listing Page (PLP)

**Layout:**
- Breadcrumbs
- Category header
- Filters sidebar (left)
- Sort dropdown
- View toggle (grid/list)
- Product count
- Product grid
- Pagination

**Acceptance Criteria:**
- [ ] Layout matches wireframe
- [ ] Responsive design
- [ ] All components integrated

---

### SF-050: Integrate PLP with products API

**Features:**
- Fetch products on mount
- Apply filters from URL
- Update URL when filters change
- Loading states
- Error handling

**Acceptance Criteria:**
- [ ] Products load from API
- [ ] Filters update results
- [ ] URL reflects state
- [ ] Loading skeleton shows

---

### SF-051: Build ProductGallery component

**Features:**
- Main image display
- Thumbnail navigation
- Zoom on hover
- Lightbox on click
- Swipe on mobile

**Acceptance Criteria:**
- [ ] Thumbnails select main image
- [ ] Zoom works on hover
- [ ] Lightbox opens on click

---

### SF-052: Build ProductInfo component

**Sections:**
- Product name
- Brand
- Rating and reviews link
- Price (with sale price)
- Variant selectors
- Quantity input
- Add to Cart button
- Stock status
- Shipping info

**Acceptance Criteria:**
- [ ] All sections display
- [ ] Variant selection works
- [ ] Price updates with variant
- [ ] Add to cart calls API

---

### SF-053: Build Product Detail Page (PDP)

**Layout:**
- Breadcrumbs
- Gallery (left)
- Product info (right)
- Tabs (description, specs, reviews)
- Related products
- Recently viewed

**Acceptance Criteria:**
- [ ] Layout matches wireframe
- [ ] Responsive design
- [ ] Tabs switch content

---

### SF-054: Integrate PDP with API

**Features:**
- Fetch product by slug
- Handle 404
- SEO meta tags
- Structured data

**Acceptance Criteria:**
- [ ] Product loads from API
- [ ] 404 page for invalid slug
- [ ] Meta tags set

---

### SF-055: Create Zustand cart store

**State:**
```typescript
interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId: string | null, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}
```

**Acceptance Criteria:**
- [ ] All actions work
- [ ] State updates on API response
- [ ] Error handling

---

### SF-056: Build CartItem component

**Features:**
- Product image
- Name and variant
- Price
- Quantity +/- buttons
- Remove button
- Subtotal
- Stock warning

**Acceptance Criteria:**
- [ ] All elements display
- [ ] Quantity update works
- [ ] Remove works
- [ ] Stock warning shows

---

### SF-057: Build CartSidebar component

**Features:**
- Slide in from right
- Item list (scrollable)
- Summary totals
- Checkout button
- Continue shopping link

**Acceptance Criteria:**
- [ ] Slides in/out
- [ ] Items scroll
- [ ] Checkout navigates

---

### SF-058: Build Cart Page

**Layout:**
- Cart items (left)
- Order summary (right)
- Coupon input
- Checkout button
- Continue shopping link

**Acceptance Criteria:**
- [ ] Layout matches wireframe
- [ ] Empty cart state
- [ ] Totals accurate

---

### SF-059: Integrate cart with backend API

**Features:**
- Fetch cart on mount
- Add item updates cart
- Update quantity updates cart
- Remove item updates cart
- Real-time totals

**Acceptance Criteria:**
- [ ] All operations work
- [ ] Optimistic updates
- [ ] Error handling

---

### SF-060 to SF-066: Checkout Backend

**Tables:**
- orders
- order_items
- order_addresses
- payments

**Endpoints:**
- POST /api/v1/checkout/session - Create session from cart
- PATCH /api/v1/checkout/:id/shipping - Set shipping info
- POST /api/v1/checkout/:id/payment - Process payment
- POST /api/v1/checkout/:id/complete - Finalize order

**Acceptance Criteria:**
- [ ] Checkout session created
- [ ] Shipping info saved
- [ ] Payment processed (Stripe mock)
- [ ] Order created
- [ ] Inventory decremented

---

### SF-067 to SF-076: Checkout Frontend

**Pages:**
- Information (email, shipping address)
- Shipping (method selection)
- Payment (card form)
- Review (order summary)
- Confirmation

**Components:**
- AddressForm
- ShippingMethodSelector
- PaymentForm (Stripe Elements)
- CheckoutSteps
- OrderSummaryPanel

**Acceptance Criteria:**
- [ ] All steps navigable
- [ ] Progress indicator
- [ ] Validation per step
- [ ] Order placed successfully
- [ ] Confirmation page shows

---

### SF-077: Write E2E test for purchase flow

**Test Scenario:**
1. Browse to product
2. Add to cart
3. Go to checkout
4. Fill shipping info
5. Select shipping method
6. Enter payment
7. Review and place order
8. Verify confirmation

**Acceptance Criteria:**
- [ ] Test passes end-to-end
- [ ] Covers happy path
- [ ] Uses test card

---

## Sprint 1 Completion Checklist

- [ ] Products API with filtering/sorting
- [ ] Product listing page works
- [ ] Product detail page works
- [ ] Cart add/update/remove works
- [ ] Cart persists for users
- [ ] Checkout flow complete
- [ ] Orders created in database
- [ ] Order confirmation displays
- [ ] E2E test passes

---

## Technical Notes

### API Patterns

**Standard Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": [...]
  }
}
```

### State Management

**React Query for Server State:**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => productsService.getProducts(filters),
});
```

**Zustand for Client State:**
```typescript
const { cart, addItem } = useCartStore();
```

### Performance Targets

- PLP load: < 2s
- PDP load: < 1.5s
- Add to cart: < 500ms
- Checkout step: < 1s

---

*End of Sprint 1 Prompt*
