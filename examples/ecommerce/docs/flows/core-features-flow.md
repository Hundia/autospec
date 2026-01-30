# ShopFlow Core Features Flow

## Overview

This document details the core e-commerce feature flows: Product Listing, Cart Management, and Checkout.

## Product Listing Flow

### ASCII Product Listing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRODUCT LISTING FLOW                                 │
└─────────────────────────────────────────────────────────────────────────────┘

  Request             Cache Check          Database            Response
     │                    │                   │                   │
     ▼                    ▼                   ▼                   ▼
┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐
│  User   │────────▶│  Redis  │────────▶│PostgreSQL────────▶│  JSON   │
│ Request │         │  Cache  │         │  Query  │         │Response │
└─────────┘         └─────────┘         └─────────┘         └─────────┘
     │                    │                   │                   │
     │  Filters:         │  Cache Hit?       │  Indexes:         │  Transform:
     │  - Category       │  - Return cached  │  - category_id    │  - Map to DTO
     │  - Price Range    │  - TTL: 5 min     │  - price          │  - Add images
     │  - Brand          │                   │  - is_active      │  - Pagination
     │  - Sort           │                   │                   │
```

### Mermaid Product Listing

```mermaid
sequenceDiagram
    participant Client
    participant API
    participant Cache
    participant Database
    participant CDN

    Client->>API: GET /products?category=shoes&page=1
    API->>API: Validate query params
    API->>Cache: Check cache key

    alt Cache Hit
        Cache-->>API: Cached products
        API-->>Client: Return products
    else Cache Miss
        API->>Database: Query products
        Database-->>API: Product records
        API->>Cache: Store in cache (5min TTL)
        API->>API: Transform to DTOs
        API-->>Client: Return products
    end

    Client->>CDN: Load product images
    CDN-->>Client: Optimized images
```

### Product Search Flow

```mermaid
flowchart TD
    A[User enters search] --> B{Search Type}

    B -->|Text Search| C[PostgreSQL Full-Text]
    B -->|Category Browse| D[Category Filter]
    B -->|Price Filter| E[Price Range Query]

    C --> F[Combine Results]
    D --> F
    E --> F

    F --> G[Apply Sorting]
    G --> H{Sort Type}

    H -->|Relevance| I[Score-based]
    H -->|Price Low-High| J[ASC price]
    H -->|Price High-Low| K[DESC price]
    H -->|Newest| L[DESC created_at]
    H -->|Best Selling| M[DESC sales_count]

    I --> N[Paginate Results]
    J --> N
    K --> N
    L --> N
    M --> N

    N --> O[Return Products]
```

### Filter Combinations

```mermaid
graph LR
    subgraph Filters["Available Filters"]
        Category[Category]
        Price[Price Range]
        Brand[Brand]
        Size[Size]
        Color[Color]
        Rating[Rating]
        InStock[In Stock Only]
    end

    subgraph Logic["Filter Logic"]
        AND[AND combination]
        OR[OR within group]
    end

    Category --> AND
    Price --> AND
    Brand --> OR
    Size --> OR
    Color --> OR
    Rating --> AND
    InStock --> AND

    AND --> Results[Filtered Products]
```

## Cart Management Flow

### ASCII Cart Operations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CART OPERATIONS                                    │
└─────────────────────────────────────────────────────────────────────────────┘

  ADD TO CART                UPDATE QUANTITY              REMOVE ITEM
       │                           │                           │
       ▼                           ▼                           ▼
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│  Validate   │            │   Check     │            │  Remove     │
│  Product    │            │   Stock     │            │   Item      │
└──────┬──────┘            └──────┬──────┘            └──────┬──────┘
       │                          │                          │
       ▼                          ▼                          ▼
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│   Check     │            │  Update     │            │ Recalculate │
│   Stock     │            │  Quantity   │            │   Totals    │
└──────┬──────┘            └──────┬──────┘            └──────┬──────┘
       │                          │                          │
       ▼                          ▼                          ▼
┌─────────────┐            ┌─────────────┐            ┌─────────────┐
│    Add      │            │ Recalculate │            │   Update    │
│  to Cart    │            │   Totals    │            │    Cart     │
└──────┬──────┘            └──────┬──────┘            └──────┬──────┘
       │                          │                          │
       └──────────────────────────┴──────────────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   Sync with     │
                         │   Redis Cache   │
                         └─────────────────┘
```

### Mermaid Add to Cart

```mermaid
sequenceDiagram
    participant User
    participant ProductPage
    participant CartStore
    participant API
    participant Redis
    participant Database

    User->>ProductPage: Select variant, quantity
    User->>ProductPage: Click "Add to Cart"

    ProductPage->>CartStore: addItem(product, variant, qty)
    CartStore->>CartStore: Optimistic UI update
    CartStore->>API: POST /cart/items

    API->>Database: Check product exists
    Database-->>API: Product found

    API->>Redis: Check inventory
    Redis-->>API: Stock: 50 available

    alt Stock Available
        API->>Redis: Add to cart
        API->>Redis: Reserve inventory (10min)
        API-->>CartStore: Item added
        CartStore->>ProductPage: Show success toast
        ProductPage->>User: "Added to cart!"
    else Out of Stock
        API-->>CartStore: Insufficient stock
        CartStore->>CartStore: Rollback optimistic update
        CartStore->>ProductPage: Show error
        ProductPage->>User: "Sorry, only X available"
    end
```

### Cart Sync Strategy

```mermaid
flowchart TD
    subgraph Guest["Guest User"]
        A[Local Storage Cart] --> B{User Logs In?}
        B -->|No| A
        B -->|Yes| C[Merge Carts]
    end

    subgraph LoggedIn["Logged In User"]
        D[Server Cart in Redis]
        C --> D
        D --> E[Sync on Tab Focus]
        D --> F[Sync on Add/Remove]
    end

    subgraph Merge["Cart Merge Logic"]
        G[Local Items + Server Items]
        G --> H{Duplicate Products?}
        H -->|Yes| I[Keep higher quantity]
        H -->|No| J[Add all items]
        I --> K[Merged Cart]
        J --> K
    end

    C --> G
```

### Cart Expiration

```mermaid
stateDiagram-v2
    [*] --> Active: Item added

    Active --> Active: Activity within 7 days
    Active --> Warning: No activity for 5 days
    Warning --> Active: User returns
    Warning --> Expiring: Day 6
    Expiring --> Expired: Day 7

    Expired --> [*]: Cart cleared

    state Active {
        [*] --> Synced
        Synced --> Modified: User changes
        Modified --> Synced: Saved to server
    }
```

## Checkout Flow

### ASCII Checkout Steps

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CHECKOUT PROCESS                                   │
└─────────────────────────────────────────────────────────────────────────────┘

  Step 1             Step 2            Step 3            Step 4
  SHIPPING           DELIVERY          PAYMENT           REVIEW
     │                  │                 │                 │
     ▼                  ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Address    │──▶│   Method    │──▶│   Card      │──▶│   Summary   │
│   Form      │   │  Selection  │   │   Details   │   │  & Confirm  │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
     │                  │                 │                 │
     │                  │                 │                 │
     ▼                  ▼                 ▼                 ▼
  Validate         Calculate          Tokenize          Process
  Address          Shipping           w/ Stripe         Order
```

### Mermaid Checkout Flow

```mermaid
flowchart TD
    Cart[View Cart] --> Review{Cart Valid?}
    Review -->|Empty| Empty[Show empty cart]
    Review -->|Items unavailable| Unavailable[Remove items]
    Review -->|Valid| Checkout[Start Checkout]

    Checkout --> Auth{Logged in?}
    Auth -->|No| GuestCheckout[Guest Checkout]
    Auth -->|Yes| SavedAddresses[Load saved addresses]
    GuestCheckout --> Shipping
    SavedAddresses --> Shipping

    Shipping[Enter Shipping] --> ValidateAddress{Address Valid?}
    ValidateAddress -->|No| Shipping
    ValidateAddress -->|Yes| DeliveryOptions

    DeliveryOptions[Select Delivery] --> CalculateShipping
    CalculateShipping --> Payment

    Payment[Enter Payment] --> Stripe[Stripe Elements]
    Stripe --> TokenizeCard
    TokenizeCard --> ValidatePayment{Valid?}
    ValidatePayment -->|No| Payment
    ValidatePayment -->|Yes| OrderReview

    OrderReview[Review Order] --> PlaceOrder
    PlaceOrder --> ProcessPayment
    ProcessPayment --> Success{Payment OK?}
    Success -->|Yes| Confirmation
    Success -->|No| PaymentError[Show Error]
    PaymentError --> Payment

    Confirmation[Order Confirmed] --> SendEmail
    SendEmail --> UpdateInventory
    UpdateInventory --> Done[Complete]
```

### Checkout Sequence

```mermaid
sequenceDiagram
    participant User
    participant Checkout
    participant API
    participant Stripe
    participant Database
    participant Queue

    User->>Checkout: Click "Place Order"
    Checkout->>API: POST /orders

    API->>Database: Validate cart items
    Database-->>API: Items valid

    API->>Database: Check inventory
    Database-->>API: Stock available

    API->>Database: Lock inventory
    Note over Database: Prevent overselling

    API->>Stripe: Create PaymentIntent
    Stripe-->>API: Client secret

    API-->>Checkout: Payment intent
    Checkout->>Stripe: Confirm payment
    Stripe->>Stripe: Process card
    Stripe-->>Checkout: Payment successful

    Checkout->>API: POST /orders/confirm
    API->>Database: Create order record
    API->>Database: Create order items
    API->>Database: Update inventory
    API->>Database: Clear cart

    API->>Queue: Emit OrderCreated event
    Queue-->>Queue: Send confirmation email
    Queue-->>Queue: Notify warehouse

    API-->>Checkout: Order confirmation
    Checkout->>User: Show confirmation page
```

### Shipping Calculation

```mermaid
graph TD
    subgraph Input["Shipping Input"]
        Address[Delivery Address]
        Items[Cart Items]
        Weight[Total Weight]
    end

    subgraph Calculate["Calculation"]
        Zone[Determine Zone]
        Method[Available Methods]
        Cost[Calculate Cost]
    end

    subgraph Methods["Shipping Methods"]
        Standard[Standard 5-7 days - $5.99]
        Express[Express 2-3 days - $12.99]
        Overnight[Overnight - $24.99]
        Free[Free Standard - Orders $50+]
    end

    Address --> Zone
    Zone --> Method
    Items --> Weight
    Weight --> Cost
    Method --> Cost

    Cost --> Standard
    Cost --> Express
    Cost --> Overnight
    Cost --> Free
```

### Order Total Calculation

```
┌─────────────────────────────────────────────────────────────────┐
│                    ORDER TOTAL CALCULATION                       │
└─────────────────────────────────────────────────────────────────┘

  Subtotal     = Σ (item.price × item.quantity)
  Discount     = Apply coupon code (% or fixed)
  Tax          = (Subtotal - Discount) × tax_rate
  Shipping     = Based on method and weight
  ─────────────────────────────────────────────
  Total        = Subtotal - Discount + Tax + Shipping

  Example:
  ┌────────────────────────────────────┐
  │  Subtotal:           $124.97       │
  │  Discount (10%):     -$12.50       │
  │  Tax (8.25%):         $9.28        │
  │  Shipping:            $5.99        │
  │  ────────────────────────────      │
  │  Total:             $127.74        │
  └────────────────────────────────────┘
```

## Error Handling

```mermaid
flowchart TD
    subgraph Errors["Checkout Errors"]
        A[Out of Stock]
        B[Address Invalid]
        C[Payment Declined]
        D[Session Expired]
        E[Price Changed]
    end

    subgraph Handling["Error Handling"]
        A --> F[Remove/update item]
        B --> G[Address validation service]
        C --> H[Show payment error, retry]
        D --> I[Re-authenticate]
        E --> J[Show new price, confirm]
    end

    subgraph Recovery["Recovery Actions"]
        F --> K[Update cart, continue]
        G --> K
        H --> K
        I --> K
        J --> K
    end
```
