# ShopFlow - Database Architect Specification

## Document Control
- **Version:** 1.0.0
- **Last Updated:** 2024-01-15
- **Status:** Approved
- **Owner:** Database Engineering

---

## 1. Database Overview

### 1.1 Technology Selection

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Primary Database | PostgreSQL 16 | ACID compliance, JSON support, full-text search |
| Cache Layer | Redis 7 | Session storage, cart data, rate limiting |
| Search Index | Elasticsearch 8 | Product search, autocomplete, faceted filtering |
| File Storage | AWS S3 | Product images, documents |

### 1.2 Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Tables | snake_case, plural | `users`, `order_items` |
| Columns | snake_case | `first_name`, `created_at` |
| Primary Keys | `id` (UUID) | `id` |
| Foreign Keys | `{table}_id` | `user_id`, `product_id` |
| Indexes | `idx_{table}_{columns}` | `idx_products_category_id` |
| Constraints | `{type}_{table}_{column}` | `fk_orders_user_id` |
| Enums | snake_case, singular | `order_status`, `payment_method` |

### 1.3 Common Column Patterns

```sql
-- Timestamp columns (all tables)
created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()

-- Soft delete (where applicable)
deleted_at TIMESTAMP WITH TIME ZONE NULL

-- Audit columns (admin tables)
created_by UUID REFERENCES users(id),
updated_by UUID REFERENCES users(id)
```

---

## 2. Schema Definitions

### 2.1 Users Domain

#### users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE NULL,
    accepts_marketing BOOLEAN NOT NULL DEFAULT FALSE,
    last_login_at TIMESTAMP WITH TIME ZONE NULL,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,

    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_role_check CHECK (role IN ('customer', 'merchant', 'admin'))
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_created_at ON users(created_at);

COMMENT ON TABLE users IS 'User accounts for customers, merchants, and administrators';
COMMENT ON COLUMN users.password_hash IS 'bcrypt hashed password';
COMMENT ON COLUMN users.role IS 'User role: customer, merchant, or admin';
```

#### user_addresses

```sql
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    address_type VARCHAR(20) NOT NULL DEFAULT 'shipping',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(200) NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country_code CHAR(2) NOT NULL,
    phone VARCHAR(20) NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT user_addresses_type_check CHECK (address_type IN ('shipping', 'billing'))
);

CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_default ON user_addresses(user_id, is_default) WHERE is_default = TRUE;

COMMENT ON TABLE user_addresses IS 'Saved shipping and billing addresses for users';
```

#### user_sessions

```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    user_agent TEXT NULL,
    ip_address INET NULL,
    last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_refresh_token ON user_sessions(refresh_token_hash);

COMMENT ON TABLE user_sessions IS 'Active user sessions for token refresh';
```

#### password_resets

```sql
CREATE TABLE password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_password_resets_token ON password_resets(token_hash);
CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);

COMMENT ON TABLE password_resets IS 'Password reset tokens';
```

### 2.2 Products Domain

#### categories

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID NULL REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT NULL,
    image_url VARCHAR(500) NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    meta_title VARCHAR(200) NULL,
    meta_description VARCHAR(500) NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT categories_slug_unique UNIQUE (slug)
);

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = TRUE;

COMMENT ON TABLE categories IS 'Product categories with hierarchical structure';
COMMENT ON COLUMN categories.parent_id IS 'Parent category for nested hierarchy';
```

#### brands

```sql
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT NULL,
    logo_url VARCHAR(500) NULL,
    website_url VARCHAR(500) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT brands_slug_unique UNIQUE (slug)
);

CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_active ON brands(is_active) WHERE is_active = TRUE;

COMMENT ON TABLE brands IS 'Product brands/manufacturers';
```

#### products

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NULL REFERENCES categories(id) ON DELETE SET NULL,
    brand_id UUID NULL REFERENCES brands(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    description TEXT NULL,
    short_description VARCHAR(500) NULL,
    price DECIMAL(10, 2) NOT NULL,
    compare_at_price DECIMAL(10, 2) NULL,
    cost_price DECIMAL(10, 2) NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    track_inventory BOOLEAN NOT NULL DEFAULT TRUE,
    allow_backorder BOOLEAN NOT NULL DEFAULT FALSE,
    weight_grams INTEGER NULL,
    length_cm DECIMAL(8, 2) NULL,
    width_cm DECIMAL(8, 2) NULL,
    height_cm DECIMAL(8, 2) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    meta_title VARCHAR(200) NULL,
    meta_description VARCHAR(500) NULL,
    attributes JSONB NOT NULL DEFAULT '{}',
    tags TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,

    CONSTRAINT products_slug_unique UNIQUE (slug),
    CONSTRAINT products_sku_unique UNIQUE (sku),
    CONSTRAINT products_price_positive CHECK (price >= 0),
    CONSTRAINT products_stock_positive CHECK (stock_quantity >= 0)
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_brand_id ON products(brand_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE AND is_active = TRUE;
CREATE INDEX idx_products_stock ON products(stock_quantity) WHERE track_inventory = TRUE;
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_attributes ON products USING GIN (attributes);
CREATE INDEX idx_products_tags ON products USING GIN (tags);

-- Full-text search index
CREATE INDEX idx_products_search ON products USING GIN (
    to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''))
);

COMMENT ON TABLE products IS 'Main product catalog';
COMMENT ON COLUMN products.attributes IS 'Flexible JSON attributes (color, size, material, etc.)';
COMMENT ON COLUMN products.compare_at_price IS 'Original price for showing discounts';
```

#### product_variants

```sql
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NULL,
    compare_at_price DECIMAL(10, 2) NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    weight_grams INTEGER NULL,
    option_values JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT product_variants_sku_unique UNIQUE (sku),
    CONSTRAINT product_variants_stock_positive CHECK (stock_quantity >= 0)
);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_product_variants_active ON product_variants(product_id, is_active) WHERE is_active = TRUE;

COMMENT ON TABLE product_variants IS 'Product variants (size, color combinations)';
COMMENT ON COLUMN product_variants.option_values IS 'JSON object of variant options, e.g., {"color": "Red", "size": "M"}';
COMMENT ON COLUMN product_variants.price IS 'Override price, NULL uses parent product price';
```

#### product_images

```sql
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID NULL REFERENCES product_variants(id) ON DELETE SET NULL,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255) NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    width INTEGER NULL,
    height INTEGER NULL,
    file_size INTEGER NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_variant_id ON product_images(variant_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary) WHERE is_primary = TRUE;

COMMENT ON TABLE product_images IS 'Product and variant images';
```

#### product_reviews

```sql
CREATE TABLE product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id UUID NULL REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER NOT NULL,
    title VARCHAR(200) NULL,
    content TEXT NULL,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    approved_at TIMESTAMP WITH TIME ZONE NULL,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT product_reviews_rating_check CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT product_reviews_unique_user UNIQUE (product_id, user_id)
);

CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX idx_product_reviews_rating ON product_reviews(product_id, rating);
CREATE INDEX idx_product_reviews_approved ON product_reviews(product_id, is_approved) WHERE is_approved = TRUE;

COMMENT ON TABLE product_reviews IS 'Customer product reviews and ratings';
```

### 2.3 Cart Domain

#### carts

```sql
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NULL,
    coupon_id UUID NULL REFERENCES coupons(id) ON DELETE SET NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    notes TEXT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT carts_session_unique UNIQUE (session_id),
    CONSTRAINT carts_user_session_check CHECK (user_id IS NOT NULL OR session_id IS NOT NULL)
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
CREATE INDEX idx_carts_expires_at ON carts(expires_at);

COMMENT ON TABLE carts IS 'Shopping carts for users and guests';
COMMENT ON COLUMN carts.session_id IS 'Session identifier for guest carts';
```

#### cart_items

```sql
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    variant_id UUID NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT cart_items_quantity_positive CHECK (quantity > 0),
    CONSTRAINT cart_items_unique_product UNIQUE (cart_id, product_id, variant_id)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

COMMENT ON TABLE cart_items IS 'Items in shopping carts';
```

### 2.4 Orders Domain

#### orders

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    order_number VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    shipping_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    item_count INTEGER NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NULL,
    notes TEXT NULL,
    internal_notes TEXT NULL,
    coupon_code VARCHAR(50) NULL,
    ip_address INET NULL,
    user_agent TEXT NULL,
    placed_at TIMESTAMP WITH TIME ZONE NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE NULL,
    shipped_at TIMESTAMP WITH TIME ZONE NULL,
    delivered_at TIMESTAMP WITH TIME ZONE NULL,
    cancelled_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT orders_number_unique UNIQUE (order_number),
    CONSTRAINT orders_status_check CHECK (status IN (
        'pending', 'confirmed', 'processing', 'shipped',
        'delivered', 'cancelled', 'refunded'
    )),
    CONSTRAINT orders_amounts_positive CHECK (
        subtotal >= 0 AND discount_amount >= 0 AND
        shipping_amount >= 0 AND tax_amount >= 0 AND total_amount >= 0
    )
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_placed_at ON orders(placed_at);
CREATE INDEX idx_orders_created_at ON orders(created_at);

COMMENT ON TABLE orders IS 'Customer orders';
COMMENT ON COLUMN orders.order_number IS 'Human-readable order number (SF-2024-001234)';
```

#### order_items

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    variant_id UUID NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    product_name VARCHAR(255) NOT NULL,
    variant_name VARCHAR(100) NULL,
    sku VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500) NULL,
    product_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT order_items_quantity_positive CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

COMMENT ON TABLE order_items IS 'Line items in orders';
COMMENT ON COLUMN order_items.product_data IS 'Snapshot of product data at time of order';
```

#### order_addresses

```sql
CREATE TABLE order_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    address_type VARCHAR(20) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(200) NULL,
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country_code CHAR(2) NOT NULL,
    phone VARCHAR(20) NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT order_addresses_type_check CHECK (address_type IN ('shipping', 'billing'))
);

CREATE INDEX idx_order_addresses_order_id ON order_addresses(order_id);

COMMENT ON TABLE order_addresses IS 'Shipping and billing addresses for orders';
```

#### order_shipments

```sql
CREATE TABLE order_shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    carrier VARCHAR(100) NOT NULL,
    service_level VARCHAR(100) NULL,
    tracking_number VARCHAR(100) NULL,
    tracking_url VARCHAR(500) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    estimated_delivery DATE NULL,
    shipped_at TIMESTAMP WITH TIME ZONE NULL,
    delivered_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT order_shipments_status_check CHECK (status IN (
        'pending', 'label_created', 'in_transit', 'out_for_delivery',
        'delivered', 'failed', 'returned'
    ))
);

CREATE INDEX idx_order_shipments_order_id ON order_shipments(order_id);
CREATE INDEX idx_order_shipments_tracking ON order_shipments(tracking_number);
CREATE INDEX idx_order_shipments_status ON order_shipments(status);

COMMENT ON TABLE order_shipments IS 'Shipment tracking for orders';
```

#### order_status_history

```sql
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    notes TEXT NULL,
    created_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_created_at ON order_status_history(created_at);

COMMENT ON TABLE order_status_history IS 'Audit trail of order status changes';
```

### 2.5 Payments Domain

#### payments

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    payment_method VARCHAR(50) NOT NULL,
    payment_provider VARCHAR(50) NOT NULL,
    provider_payment_id VARCHAR(255) NULL,
    provider_charge_id VARCHAR(255) NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    card_brand VARCHAR(20) NULL,
    card_last_four CHAR(4) NULL,
    card_exp_month INTEGER NULL,
    card_exp_year INTEGER NULL,
    billing_name VARCHAR(200) NULL,
    error_code VARCHAR(50) NULL,
    error_message TEXT NULL,
    metadata JSONB NOT NULL DEFAULT '{}',
    authorized_at TIMESTAMP WITH TIME ZONE NULL,
    captured_at TIMESTAMP WITH TIME ZONE NULL,
    failed_at TIMESTAMP WITH TIME ZONE NULL,
    refunded_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT payments_status_check CHECK (status IN (
        'pending', 'authorized', 'captured', 'failed',
        'cancelled', 'refunded', 'partially_refunded'
    )),
    CONSTRAINT payments_method_check CHECK (payment_method IN (
        'card', 'paypal', 'apple_pay', 'google_pay'
    ))
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_provider_payment_id ON payments(provider_payment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

COMMENT ON TABLE payments IS 'Payment transactions for orders';
```

#### refunds

```sql
CREATE TABLE refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE RESTRICT,
    provider_refund_id VARCHAR(255) NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    reason VARCHAR(50) NOT NULL,
    notes TEXT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    processed_at TIMESTAMP WITH TIME ZONE NULL,
    created_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT refunds_status_check CHECK (status IN (
        'pending', 'processing', 'completed', 'failed'
    )),
    CONSTRAINT refunds_reason_check CHECK (reason IN (
        'customer_request', 'defective', 'wrong_item',
        'not_received', 'duplicate', 'fraud', 'other'
    ))
);

CREATE INDEX idx_refunds_order_id ON refunds(order_id);
CREATE INDEX idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX idx_refunds_status ON refunds(status);

COMMENT ON TABLE refunds IS 'Refund transactions';
```

### 2.6 Promotions Domain

#### coupons

```sql
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL,
    description TEXT NULL,
    discount_type VARCHAR(20) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    minimum_order_amount DECIMAL(10, 2) NULL,
    maximum_discount_amount DECIMAL(10, 2) NULL,
    usage_limit INTEGER NULL,
    usage_count INTEGER NOT NULL DEFAULT 0,
    usage_limit_per_user INTEGER NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    starts_at TIMESTAMP WITH TIME ZONE NULL,
    expires_at TIMESTAMP WITH TIME ZONE NULL,
    created_by UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT coupons_code_unique UNIQUE (code),
    CONSTRAINT coupons_discount_type_check CHECK (discount_type IN (
        'percentage', 'fixed_amount', 'free_shipping'
    )),
    CONSTRAINT coupons_discount_value_positive CHECK (discount_value > 0)
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active, starts_at, expires_at);

COMMENT ON TABLE coupons IS 'Discount coupon codes';
```

#### coupon_usage

```sql
CREATE TABLE coupon_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
    user_id UUID NULL REFERENCES users(id) ON DELETE SET NULL,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    discount_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user_id ON coupon_usage(user_id);
CREATE INDEX idx_coupon_usage_order_id ON coupon_usage(order_id);

COMMENT ON TABLE coupon_usage IS 'Track coupon usage per order and user';
```

### 2.7 Shipping Domain

#### shipping_zones

```sql
CREATE TABLE shipping_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    countries TEXT[] NOT NULL DEFAULT '{}',
    states TEXT[] NULL,
    postal_codes TEXT[] NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shipping_zones_countries ON shipping_zones USING GIN (countries);

COMMENT ON TABLE shipping_zones IS 'Geographic shipping zones';
```

#### shipping_methods

```sql
CREATE TABLE shipping_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID NOT NULL REFERENCES shipping_zones(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    carrier VARCHAR(100) NULL,
    price DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) NULL,
    free_above_amount DECIMAL(10, 2) NULL,
    estimated_days_min INTEGER NULL,
    estimated_days_max INTEGER NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_shipping_methods_zone_id ON shipping_methods(zone_id);
CREATE INDEX idx_shipping_methods_active ON shipping_methods(is_active) WHERE is_active = TRUE;

COMMENT ON TABLE shipping_methods IS 'Available shipping methods per zone';
```

---

## 3. Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │  categories │       │   brands    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │       │ id (PK)     │
│ email       │       │ parent_id   │◄──┐   │ name        │
│ first_name  │       │ name        │   │   │ slug        │
│ last_name   │       │ slug        │   │   └─────────────┘
│ role        │       └──────┬──────┘   │          │
└──────┬──────┘              │          │          │
       │                     │          │          │
       │              ┌──────▼──────────┴──────────▼───┐
       │              │          products              │
       │              ├────────────────────────────────┤
       │              │ id (PK)                        │
       │              │ category_id (FK)               │
       │              │ brand_id (FK)                  │
       │              │ name, sku, price, stock        │
       │              └──────┬─────────────────────────┘
       │                     │
       │         ┌───────────┼───────────┐
       │         │           │           │
       │    ┌────▼────┐ ┌────▼────┐ ┌────▼────┐
       │    │ variants│ │ images  │ │ reviews │
       │    └─────────┘ └─────────┘ └────┬────┘
       │                                  │
       ▼                                  │
┌──────────────┐                          │
│user_addresses│                          │
└──────────────┘                          │
       │                                  │
       │    ┌──────────────┐              │
       │    │    carts     │◄─────────────┘
       │    ├──────────────┤
       │    │ id (PK)      │
       └───►│ user_id (FK) │
            │ session_id   │
            └──────┬───────┘
                   │
            ┌──────▼───────┐
            │  cart_items  │
            └──────────────┘
                   │
                   ▼
            ┌──────────────┐       ┌──────────────┐
            │    orders    │──────►│   payments   │
            ├──────────────┤       └──────────────┘
            │ id (PK)      │              │
            │ user_id (FK) │              ▼
            │ order_number │       ┌──────────────┐
            │ status       │       │   refunds    │
            └──────┬───────┘       └──────────────┘
                   │
       ┌───────────┼───────────┐
       │           │           │
┌──────▼──────┐ ┌──▼───────┐ ┌─▼────────┐
│ order_items │ │addresses │ │shipments │
└─────────────┘ └──────────┘ └──────────┘
```

---

## 4. Indexes Strategy

### 4.1 Index Types Used

| Type | Use Case | Example |
|------|----------|---------|
| B-tree | Equality, range queries | `idx_products_price` |
| GIN | Array, JSONB, full-text | `idx_products_tags` |
| Partial | Filtered queries | `idx_products_active WHERE is_active = TRUE` |
| Composite | Multi-column queries | `idx_orders_user_status(user_id, status)` |

### 4.2 Query Optimization Guidelines

```sql
-- Use partial indexes for filtered queries
CREATE INDEX idx_products_active_in_stock
ON products(category_id, price)
WHERE is_active = TRUE AND stock_quantity > 0;

-- Use composite indexes matching query patterns
CREATE INDEX idx_orders_user_status_date
ON orders(user_id, status, placed_at DESC);

-- Use covering indexes for frequent queries
CREATE INDEX idx_cart_items_cart_total
ON cart_items(cart_id)
INCLUDE (quantity, unit_price);
```

---

## 5. Data Integrity

### 5.1 Foreign Key Constraints

| Relationship | On Delete | On Update |
|--------------|-----------|-----------|
| user_addresses -> users | CASCADE | CASCADE |
| products -> categories | SET NULL | CASCADE |
| order_items -> products | RESTRICT | CASCADE |
| payments -> orders | RESTRICT | CASCADE |

### 5.2 Check Constraints

```sql
-- Price validations
CONSTRAINT products_price_positive CHECK (price >= 0)
CONSTRAINT products_compare_price CHECK (compare_at_price IS NULL OR compare_at_price > price)

-- Quantity validations
CONSTRAINT cart_items_quantity_positive CHECK (quantity > 0)
CONSTRAINT products_stock_non_negative CHECK (stock_quantity >= 0)

-- Status enums
CONSTRAINT orders_status_check CHECK (status IN ('pending', 'confirmed', ...))
```

### 5.3 Triggers

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.order_number = 'SF-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
        LPAD(nextval('order_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## 6. Migration Strategy

### 6.1 Migration Naming

```
YYYYMMDDHHMMSS_description.sql

Example:
20240115100000_create_users_table.sql
20240115100100_create_products_table.sql
20240115100200_add_products_search_index.sql
```

### 6.2 Migration Template

```sql
-- Migration: 20240115100000_create_users_table
-- Description: Create users table with indexes
-- Author: DB Architect

BEGIN;

-- Create table
CREATE TABLE users (
    -- columns
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);

-- Add comments
COMMENT ON TABLE users IS 'User accounts';

COMMIT;
```

---

## 7. Seed Data

### 7.1 Categories

```sql
INSERT INTO categories (id, parent_id, name, slug, sort_order) VALUES
('cat_electronics', NULL, 'Electronics', 'electronics', 1),
('cat_headphones', 'cat_electronics', 'Headphones', 'headphones', 1),
('cat_keyboards', 'cat_electronics', 'Keyboards', 'keyboards', 2),
('cat_clothing', NULL, 'Clothing', 'clothing', 2),
('cat_mens', 'cat_clothing', 'Men''s', 'mens', 1),
('cat_womens', 'cat_clothing', 'Women''s', 'womens', 2);
```

### 7.2 Shipping Zones

```sql
INSERT INTO shipping_zones (name, countries) VALUES
('Domestic US', ARRAY['US']),
('North America', ARRAY['US', 'CA', 'MX']),
('International', ARRAY['GB', 'DE', 'FR', 'AU']);

INSERT INTO shipping_methods (zone_id, name, price, estimated_days_min, estimated_days_max) VALUES
((SELECT id FROM shipping_zones WHERE name = 'Domestic US'), 'Standard', 9.99, 5, 7),
((SELECT id FROM shipping_zones WHERE name = 'Domestic US'), 'Express', 19.99, 2, 3),
((SELECT id FROM shipping_zones WHERE name = 'Domestic US'), 'Overnight', 39.99, 1, 1);
```

---

*Document End - Database Architect Specification*
