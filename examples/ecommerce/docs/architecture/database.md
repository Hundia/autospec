# ShopFlow Database Architecture

## Document Control
- **Version:** 1.0.0
- **Last Updated:** 2024-01-15
- **Status:** Approved
- **Owner:** Database Engineering

---

## 1. Entity-Relationship Diagram

### 1.1 Complete ERD

```
                                 USERS DOMAIN
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────────┐        ┌─────────────────┐        ┌─────────────────┐   │
│  │    users     │───────<│ user_addresses  │        │  user_sessions  │   │
│  ├──────────────┤  1:N   ├─────────────────┤        ├─────────────────┤   │
│  │ id (PK)      │        │ id (PK)         │        │ id (PK)         │   │
│  │ email        │        │ user_id (FK)    │        │ user_id (FK)    │   │
│  │ password_hash│        │ address_type    │        │ refresh_token   │   │
│  │ first_name   │        │ first_name      │        │ expires_at      │   │
│  │ last_name    │        │ last_name       │        │ created_at      │   │
│  │ role         │        │ address_line_1  │        └─────────────────┘   │
│  │ created_at   │        │ city, state     │                              │
│  └──────┬───────┘        │ postal_code     │        ┌─────────────────┐   │
│         │                │ country_code    │        │ password_resets │   │
│         │                └─────────────────┘        ├─────────────────┤   │
│         │                                           │ id (PK)         │   │
│         └──────────────────────────────────────────>│ user_id (FK)    │   │
│                                               1:N   │ token_hash      │   │
│                                                     │ expires_at      │   │
│                                                     └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘

                               PRODUCTS DOMAIN
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────────┐                              ┌──────────────┐            │
│  │  categories  │                              │    brands    │            │
│  ├──────────────┤                              ├──────────────┤            │
│  │ id (PK)      │<─┐                           │ id (PK)      │            │
│  │ parent_id(FK)│──┘ (self-ref)                │ name         │            │
│  │ name         │                              │ slug         │            │
│  │ slug         │                              │ logo_url     │            │
│  │ sort_order   │                              │ is_active    │            │
│  └──────┬───────┘                              └──────┬───────┘            │
│         │                                             │                    │
│         │ 1:N                                    1:N  │                    │
│         │         ┌──────────────────────┐           │                    │
│         └────────>│      products        │<──────────┘                    │
│                   ├──────────────────────┤                                │
│                   │ id (PK)              │                                │
│                   │ category_id (FK)     │                                │
│                   │ brand_id (FK)        │                                │
│                   │ name, slug, sku      │                                │
│                   │ price, compare_price │                                │
│                   │ stock_quantity       │                                │
│                   │ attributes (JSONB)   │                                │
│                   │ is_active, is_featured│                               │
│                   └──────────┬───────────┘                                │
│                              │                                             │
│         ┌────────────────────┼────────────────────┐                       │
│         │                    │                    │                       │
│         v 1:N                v 1:N                v 1:N                   │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐              │
│  │product_variants│    │product_images│    │product_reviews│              │
│  ├──────────────┤     ├──────────────┤     ├──────────────┤              │
│  │ id (PK)      │     │ id (PK)      │     │ id (PK)      │              │
│  │ product_id   │     │ product_id   │     │ product_id   │              │
│  │ name, sku    │     │ url, alt_text│     │ user_id      │              │
│  │ price        │     │ sort_order   │     │ rating       │              │
│  │ stock_qty    │     │ is_primary   │     │ title,content│              │
│  │ option_values│     └──────────────┘     │ is_approved  │              │
│  └──────────────┘                          └──────────────┘              │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────────┘

                                 CART DOMAIN
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│       ┌──────────────┐                                                     │
│       │    carts     │                                                     │
│       ├──────────────┤                                                     │
│       │ id (PK)      │                                                     │
│       │ user_id (FK) │ (nullable - for logged in users)                   │
│       │ session_id   │ (for guest carts)                                  │
│       │ coupon_id(FK)│                                                     │
│       │ updated_at   │                                                     │
│       └──────┬───────┘                                                     │
│              │                                                              │
│              │ 1:N                                                          │
│              v                                                              │
│       ┌──────────────┐                                                     │
│       │  cart_items  │                                                     │
│       ├──────────────┤                                                     │
│       │ id (PK)      │                                                     │
│       │ cart_id (FK) │                                                     │
│       │ product_id   │ ────────> products                                  │
│       │ variant_id   │ ────────> product_variants                          │
│       │ quantity     │                                                     │
│       │ unit_price   │                                                     │
│       └──────────────┘                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

                                ORDERS DOMAIN
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│       ┌──────────────────┐                                                 │
│       │      orders      │                                                 │
│       ├──────────────────┤                                                 │
│       │ id (PK)          │                                                 │
│       │ user_id (FK)     │ ────────> users                                 │
│       │ order_number     │                                                 │
│       │ status           │                                                 │
│       │ subtotal, tax    │                                                 │
│       │ shipping, total  │                                                 │
│       │ customer_email   │                                                 │
│       │ coupon_code      │                                                 │
│       │ placed_at        │                                                 │
│       └────────┬─────────┘                                                 │
│                │                                                            │
│     ┌──────────┼──────────┬──────────────┬──────────────┐                  │
│     │          │          │              │              │                  │
│     v 1:N      v 1:N      v 1:2          v 1:N          v 1:N             │
│  ┌─────────┐┌─────────┐┌───────────┐┌───────────┐┌──────────────┐         │
│  │ order_  ││ order_  ││  order_   ││  order_   ││order_status_ │         │
│  │ items   ││shipments││ addresses ││ payments  ││   history    │         │
│  ├─────────┤├─────────┤├───────────┤├───────────┤├──────────────┤         │
│  │ id (PK) ││ id (PK) ││ id (PK)   ││ id (PK)   ││ id (PK)      │         │
│  │order_id ││order_id ││ order_id  ││ order_id  ││ order_id     │         │
│  │product_id│|carrier ││ type      ││ amount    ││ status       │         │
│  │quantity ││tracking ││ first_name││ status    ││ notes        │         │
│  │price    ││status   ││ city,state││ card_last4││ created_by   │         │
│  │subtotal ││delivered││ postal    ││ captured  ││ created_at   │         │
│  └─────────┘└─────────┘└───────────┘└───────────┘└──────────────┘         │
│                                            │                               │
│                                            │ 1:N                           │
│                                            v                               │
│                                     ┌───────────┐                          │
│                                     │  refunds  │                          │
│                                     ├───────────┤                          │
│                                     │ id (PK)   │                          │
│                                     │payment_id │                          │
│                                     │ amount    │                          │
│                                     │ status    │                          │
│                                     │ reason    │                          │
│                                     └───────────┘                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

                              PROMOTIONS DOMAIN
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│       ┌──────────────┐                      ┌──────────────┐               │
│       │   coupons    │──────────────────────│ coupon_usage │               │
│       ├──────────────┤          1:N         ├──────────────┤               │
│       │ id (PK)      │                      │ id (PK)      │               │
│       │ code         │                      │ coupon_id(FK)│               │
│       │ discount_type│                      │ user_id      │               │
│       │ discount_val │                      │ order_id     │               │
│       │ min_order    │                      │ discount_amt │               │
│       │ max_discount │                      │ created_at   │               │
│       │ usage_limit  │                      └──────────────┘               │
│       │ starts_at    │                                                     │
│       │ expires_at   │                                                     │
│       └──────────────┘                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

                               SHIPPING DOMAIN
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│       ┌────────────────┐                    ┌─────────────────┐            │
│       │ shipping_zones │────────────────────│shipping_methods │            │
│       ├────────────────┤        1:N         ├─────────────────┤            │
│       │ id (PK)        │                    │ id (PK)         │            │
│       │ name           │                    │ zone_id (FK)    │            │
│       │ countries[]    │                    │ name            │            │
│       │ states[]       │                    │ carrier         │            │
│       │ is_active      │                    │ price           │            │
│       └────────────────┘                    │ estimated_days  │            │
│                                             │ free_above      │            │
│                                             └─────────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Table Catalog

### 2.1 Users Domain Tables

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| `users` | Customer, merchant, admin accounts | id, email, password_hash, role | Has many: addresses, sessions, orders, reviews |
| `user_addresses` | Saved shipping/billing addresses | id, user_id, address_type, is_default | Belongs to: users |
| `user_sessions` | Active refresh tokens | id, user_id, refresh_token_hash, expires_at | Belongs to: users |
| `password_resets` | Password reset tokens | id, user_id, token_hash, expires_at | Belongs to: users |

### 2.2 Products Domain Tables

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| `categories` | Product categories (hierarchical) | id, parent_id, name, slug | Self-referential, has many: products |
| `brands` | Product brands/manufacturers | id, name, slug, logo_url | Has many: products |
| `products` | Main product catalog | id, name, sku, price, stock_quantity | Belongs to: category, brand; Has many: variants, images, reviews |
| `product_variants` | Size/color combinations | id, product_id, name, sku, price, stock_quantity | Belongs to: products |
| `product_images` | Product media | id, product_id, url, alt_text, is_primary | Belongs to: products, variants |
| `product_reviews` | Customer reviews | id, product_id, user_id, rating, content | Belongs to: products, users |

### 2.3 Cart Domain Tables

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| `carts` | Shopping carts | id, user_id, session_id, coupon_id | Belongs to: users (optional), coupons; Has many: cart_items |
| `cart_items` | Cart line items | id, cart_id, product_id, variant_id, quantity | Belongs to: carts, products, variants |

### 2.4 Orders Domain Tables

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| `orders` | Customer orders | id, order_number, user_id, status, total_amount | Belongs to: users; Has many: items, addresses, shipments, payments |
| `order_items` | Order line items | id, order_id, product_id, quantity, price | Belongs to: orders, products |
| `order_addresses` | Shipping/billing addresses (snapshot) | id, order_id, address_type | Belongs to: orders |
| `order_shipments` | Shipment tracking | id, order_id, carrier, tracking_number, status | Belongs to: orders |
| `order_status_history` | Order status audit trail | id, order_id, status, created_by | Belongs to: orders |
| `payments` | Payment transactions | id, order_id, amount, status, card_last_four | Belongs to: orders; Has many: refunds |
| `refunds` | Refund transactions | id, payment_id, amount, status, reason | Belongs to: payments |

### 2.5 Promotions Domain Tables

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| `coupons` | Discount codes | id, code, discount_type, discount_value, expires_at | Has many: usage records |
| `coupon_usage` | Coupon usage tracking | id, coupon_id, user_id, order_id | Belongs to: coupons, users, orders |

### 2.6 Shipping Domain Tables

| Table | Purpose | Key Columns | Relationships |
|-------|---------|-------------|---------------|
| `shipping_zones` | Geographic regions | id, name, countries[], states[] | Has many: shipping_methods |
| `shipping_methods` | Available shipping options | id, zone_id, name, price, estimated_days | Belongs to: shipping_zones |

---

## 3. Index Strategy

### 3.1 Primary Indexes (Automatic)

All tables have primary key indexes on their `id` columns (UUID).

### 3.2 Performance Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;

-- Products
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_active ON products(is_active, deleted_at)
  WHERE is_active = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_products_featured ON products(is_featured)
  WHERE is_featured = TRUE AND is_active = TRUE;
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_stock ON products(stock_quantity)
  WHERE track_inventory = TRUE;

-- Full-text search
CREATE INDEX idx_products_search ON products USING GIN (
  to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
);

-- JSONB indexes
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);
CREATE INDEX idx_products_tags ON products USING GIN (tags);

-- Categories
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);

-- Cart
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_placed_at ON orders(placed_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Reviews
CREATE INDEX idx_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_reviews_approved ON product_reviews(product_id, is_approved)
  WHERE is_approved = TRUE;
```

### 3.3 Composite Indexes for Common Queries

```sql
-- Product listing with filters
CREATE INDEX idx_products_category_price ON products(category_id, price)
  WHERE is_active = TRUE AND deleted_at IS NULL;

-- User orders lookup
CREATE INDEX idx_orders_user_status_date ON orders(user_id, status, placed_at DESC);

-- Cart item lookup
CREATE INDEX idx_cart_items_product_variant ON cart_items(cart_id, product_id, variant_id);
```

---

## 4. Query Patterns

### 4.1 Product Listing with Filters

```sql
-- Get products with category, pagination, and filters
SELECT
  p.id,
  p.name,
  p.slug,
  p.price,
  p.compare_at_price,
  p.stock_quantity,
  c.name as category_name,
  b.name as brand_name,
  (SELECT url FROM product_images pi
   WHERE pi.product_id = p.id AND pi.is_primary = TRUE
   LIMIT 1) as primary_image,
  (SELECT AVG(rating) FROM product_reviews pr
   WHERE pr.product_id = p.id AND pr.is_approved = TRUE) as avg_rating,
  (SELECT COUNT(*) FROM product_reviews pr
   WHERE pr.product_id = p.id AND pr.is_approved = TRUE) as review_count
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
WHERE
  p.is_active = TRUE
  AND p.deleted_at IS NULL
  AND ($1::uuid IS NULL OR p.category_id = $1)
  AND ($2::numeric IS NULL OR p.price >= $2)
  AND ($3::numeric IS NULL OR p.price <= $3)
  AND ($4::uuid IS NULL OR p.brand_id = $4)
  AND ($5::boolean IS NULL OR ($5 = TRUE AND p.stock_quantity > 0))
ORDER BY
  CASE WHEN $6 = 'price_asc' THEN p.price END ASC,
  CASE WHEN $6 = 'price_desc' THEN p.price END DESC,
  CASE WHEN $6 = 'newest' THEN p.created_at END DESC,
  p.created_at DESC
LIMIT $7 OFFSET $8;
```

### 4.2 Product Detail with All Relations

```sql
-- Get full product details
SELECT
  p.*,
  json_build_object(
    'id', c.id,
    'name', c.name,
    'slug', c.slug
  ) as category,
  json_build_object(
    'id', b.id,
    'name', b.name
  ) as brand,
  (
    SELECT json_agg(json_build_object(
      'id', pi.id,
      'url', pi.url,
      'alt_text', pi.alt_text,
      'is_primary', pi.is_primary
    ) ORDER BY pi.sort_order)
    FROM product_images pi
    WHERE pi.product_id = p.id
  ) as images,
  (
    SELECT json_agg(json_build_object(
      'id', pv.id,
      'name', pv.name,
      'sku', pv.sku,
      'price', pv.price,
      'stock_quantity', pv.stock_quantity,
      'option_values', pv.option_values
    ) ORDER BY pv.sort_order)
    FROM product_variants pv
    WHERE pv.product_id = p.id AND pv.is_active = TRUE
  ) as variants
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN brands b ON p.brand_id = b.id
WHERE (p.id = $1 OR p.slug = $1)
  AND p.deleted_at IS NULL;
```

### 4.3 Cart with Items

```sql
-- Get cart with enriched item data
SELECT
  c.id,
  c.user_id,
  c.session_id,
  c.coupon_id,
  c.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', ci.id,
        'product_id', ci.product_id,
        'variant_id', ci.variant_id,
        'quantity', ci.quantity,
        'unit_price', ci.unit_price,
        'name', p.name,
        'slug', p.slug,
        'variant_name', pv.name,
        'image', (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = TRUE LIMIT 1),
        'in_stock', COALESCE(pv.stock_quantity, p.stock_quantity) >= ci.quantity,
        'max_quantity', COALESCE(pv.stock_quantity, p.stock_quantity)
      )
    ) FILTER (WHERE ci.id IS NOT NULL),
    '[]'
  ) as items,
  COALESCE(SUM(ci.quantity), 0) as item_count,
  COALESCE(SUM(ci.quantity * ci.unit_price), 0) as subtotal
FROM carts c
LEFT JOIN cart_items ci ON c.id = ci.cart_id
LEFT JOIN products p ON ci.product_id = p.id
LEFT JOIN product_variants pv ON ci.variant_id = pv.id
WHERE c.id = $1 OR c.user_id = $2 OR c.session_id = $3
GROUP BY c.id;
```

### 4.4 Order with All Details

```sql
-- Get complete order information
SELECT
  o.*,
  json_build_object(
    'id', u.id,
    'email', u.email,
    'first_name', u.first_name,
    'last_name', u.last_name
  ) as customer,
  (
    SELECT json_agg(json_build_object(
      'id', oi.id,
      'product_id', oi.product_id,
      'product_name', oi.product_name,
      'variant_name', oi.variant_name,
      'sku', oi.sku,
      'quantity', oi.quantity,
      'unit_price', oi.unit_price,
      'subtotal', oi.subtotal,
      'image_url', oi.image_url
    ))
    FROM order_items oi
    WHERE oi.order_id = o.id
  ) as items,
  (
    SELECT json_agg(json_build_object(
      'id', oa.id,
      'type', oa.address_type,
      'first_name', oa.first_name,
      'last_name', oa.last_name,
      'address_line_1', oa.address_line_1,
      'city', oa.city,
      'state', oa.state,
      'postal_code', oa.postal_code,
      'country_code', oa.country_code
    ))
    FROM order_addresses oa
    WHERE oa.order_id = o.id
  ) as addresses,
  (
    SELECT json_build_object(
      'id', os.id,
      'carrier', os.carrier,
      'tracking_number', os.tracking_number,
      'status', os.status,
      'estimated_delivery', os.estimated_delivery
    )
    FROM order_shipments os
    WHERE os.order_id = o.id
    LIMIT 1
  ) as shipment,
  (
    SELECT json_build_object(
      'id', pay.id,
      'method', pay.payment_method,
      'status', pay.status,
      'card_brand', pay.card_brand,
      'card_last_four', pay.card_last_four
    )
    FROM payments pay
    WHERE pay.order_id = o.id
    LIMIT 1
  ) as payment,
  (
    SELECT json_agg(json_build_object(
      'status', osh.status,
      'notes', osh.notes,
      'created_at', osh.created_at
    ) ORDER BY osh.created_at)
    FROM order_status_history osh
    WHERE osh.order_id = o.id
  ) as status_history
FROM orders o
LEFT JOIN users u ON o.user_id = u.id
WHERE o.id = $1;
```

---

## 5. Connection Pooling

### 5.1 Configuration

```typescript
// config/database.ts

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Maximum connections
  idleTimeoutMillis: 30000,   // Close idle connections after 30s
  connectionTimeoutMillis: 2000, // Timeout for new connections
  maxUses: 7500,              // Close connection after N uses
};

// For Prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}

generator client {
  provider = "prisma-client-js"
}
```

### 5.2 Connection Limits by Environment

| Environment | Max Connections | Idle Timeout |
|-------------|----------------|--------------|
| Development | 5 | 10s |
| Staging | 10 | 30s |
| Production | 20 | 30s |

---

## 6. Migration Strategy

### 6.1 Migration Naming Convention

```
YYYYMMDDHHMMSS_description.ts

Examples:
20240115100000_create_users_table.ts
20240115100100_create_products_table.ts
20240115100200_add_products_search_index.ts
20240120150000_add_coupon_max_discount_column.ts
```

### 6.2 Migration Best Practices

1. **Always reversible**: Include both `up` and `down` migrations
2. **Small and focused**: One logical change per migration
3. **No data loss**: Use additive changes, avoid destructive changes
4. **Test in staging**: Always run migrations in staging first
5. **Backup before**: Take database backup before production migrations

### 6.3 Migration Template

```typescript
// prisma/migrations/20240115100000_create_users_table/migration.sql

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "role" VARCHAR(20) NOT NULL DEFAULT 'customer',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "idx_users_email" ON "users"("email") WHERE "deleted_at" IS NULL;
CREATE INDEX "idx_users_role" ON "users"("role") WHERE "deleted_at" IS NULL;

-- Add Comment
COMMENT ON TABLE "users" IS 'User accounts for customers, merchants, and administrators';
```

---

## 7. Backup and Recovery

### 7.1 Backup Schedule

| Type | Frequency | Retention | Storage |
|------|-----------|-----------|---------|
| Full backup | Daily at 02:00 UTC | 30 days | S3 |
| Point-in-time | Continuous | 7 days | WAL |
| Weekly archive | Sunday 00:00 UTC | 1 year | Glacier |

### 7.2 Recovery Procedures

```bash
# Restore from latest full backup
pg_restore --dbname=shopflow_restore --clean latest_backup.dump

# Point-in-time recovery to specific timestamp
pg_restore --dbname=shopflow_restore \
  --target-time="2024-01-15 14:30:00" \
  base_backup.tar

# Verify restored data
psql -d shopflow_restore -c "SELECT COUNT(*) FROM orders;"
```

### 7.3 RTO/RPO Targets

| Metric | Target |
|--------|--------|
| Recovery Point Objective (RPO) | < 1 hour |
| Recovery Time Objective (RTO) | < 4 hours |

---

## 8. Data Integrity Rules

### 8.1 Foreign Key Constraints

| Relationship | On Delete | On Update |
|--------------|-----------|-----------|
| user_addresses -> users | CASCADE | CASCADE |
| products -> categories | SET NULL | CASCADE |
| products -> brands | SET NULL | CASCADE |
| product_variants -> products | CASCADE | CASCADE |
| cart_items -> carts | CASCADE | CASCADE |
| cart_items -> products | CASCADE | CASCADE |
| orders -> users | SET NULL | CASCADE |
| order_items -> orders | CASCADE | CASCADE |
| order_items -> products | RESTRICT | CASCADE |
| payments -> orders | RESTRICT | CASCADE |

### 8.2 Check Constraints

```sql
-- Prices must be non-negative
CONSTRAINT products_price_positive CHECK (price >= 0)
CONSTRAINT products_compare_price CHECK (compare_at_price IS NULL OR compare_at_price > price)

-- Stock must be non-negative
CONSTRAINT products_stock_non_negative CHECK (stock_quantity >= 0)

-- Quantity must be positive
CONSTRAINT cart_items_quantity_positive CHECK (quantity > 0)

-- Valid order status
CONSTRAINT orders_status_check CHECK (status IN (
  'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
))

-- Valid user roles
CONSTRAINT users_role_check CHECK (role IN ('customer', 'merchant', 'admin'))

-- Rating range
CONSTRAINT reviews_rating_check CHECK (rating BETWEEN 1 AND 5)
```

---

## 9. Soft Delete Policy

### 9.1 Tables with Soft Delete

| Table | Soft Delete Column | Reason |
|-------|-------------------|--------|
| `users` | `deleted_at` | Preserve order history, audit trail |
| `products` | `deleted_at` | Preserve order item references |

### 9.2 Tables with Hard Delete

| Table | Reason |
|-------|--------|
| `cart_items` | Ephemeral data, no audit requirement |
| `user_sessions` | Security - expired sessions should be removed |
| `password_resets` | Security - used tokens should be removed |

### 9.3 Cascade Delete Rules

```sql
-- When a user is deleted (soft), their cart is cleared
-- but orders are preserved (user_id set to NULL)

-- When a product is deleted (soft), it remains in:
-- - Existing orders (order_items reference preserved)
-- - But removed from:
--   - Active carts (cart_items deleted)
--   - Search results (filtered by deleted_at)
```

---

## 10. Performance Monitoring

### 10.1 Key Metrics to Monitor

| Metric | Warning | Critical |
|--------|---------|----------|
| Query time (p95) | > 200ms | > 500ms |
| Connection pool usage | > 70% | > 90% |
| Dead tuples ratio | > 10% | > 20% |
| Index hit ratio | < 95% | < 90% |
| Disk usage | > 70% | > 85% |

### 10.2 Slow Query Logging

```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 200; -- Log queries > 200ms
ALTER SYSTEM SET log_statement = 'ddl'; -- Log DDL statements
SELECT pg_reload_conf();
```

---

*Document End - Database Architecture*
