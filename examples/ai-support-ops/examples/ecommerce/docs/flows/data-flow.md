# ShopFlow Data Flow

## Overview

This document describes how data flows through the ShopFlow system from order creation to fulfillment.

## Order Data Flow

### ASCII Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ORDER DATA FLOW                                     │
└─────────────────────────────────────────────────────────────────────────────┘

  CART              ORDER             PAYMENT           FULFILLMENT
    │                 │                  │                  │
    ▼                 ▼                  ▼                  ▼
┌─────────┐     ┌─────────┐       ┌─────────┐       ┌─────────┐
│ Redis   │────▶│PostgreSQL────▶│ Stripe  │──────▶│Warehouse│
│ Cache   │     │   DB    │       │   API   │       │  System │
└─────────┘     └─────────┘       └─────────┘       └─────────┘
    │                 │                  │                  │
    │                 │                  │                  │
    ▼                 ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SQS MESSAGE QUEUE                        │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐    │
│  │OrderCreated  │PaymentDone│  │OrderShipped│  │Delivered │    │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘    │
└─────────────────────────────────────────────────────────────────┘
    │                 │                  │                  │
    ▼                 ▼                  ▼                  ▼
┌─────────┐     ┌─────────┐       ┌─────────┐       ┌─────────┐
│  Email  │     │Inventory│       │ Tracking│       │ Review  │
│ Service │     │ Update  │       │ Update  │       │ Request │
└─────────┘     └─────────┘       └─────────┘       └─────────┘
```

### Mermaid Order Flow

```mermaid
flowchart TD
    subgraph Customer["Customer Actions"]
        Cart[Shopping Cart]
        Checkout[Checkout Process]
    end

    subgraph OrderCreation["Order Creation"]
        Validate[Validate Cart]
        CreateOrder[Create Order Record]
        ReserveInventory[Reserve Inventory]
    end

    subgraph Payment["Payment Processing"]
        PaymentIntent[Create Payment Intent]
        ProcessPayment[Process Payment]
        ConfirmPayment[Confirm Payment]
    end

    subgraph Fulfillment["Fulfillment"]
        Queue[Order Queue]
        Warehouse[Warehouse System]
        Packing[Pack Order]
        Ship[Ship Package]
    end

    subgraph Delivery["Delivery"]
        Carrier[Carrier Pickup]
        Transit[In Transit]
        Delivered[Delivered]
    end

    subgraph Notifications["Notifications"]
        EmailConfirm[Order Confirmation]
        EmailShipped[Shipping Notification]
        EmailDelivered[Delivery Confirmation]
    end

    Cart --> Checkout
    Checkout --> Validate
    Validate --> CreateOrder
    CreateOrder --> ReserveInventory
    ReserveInventory --> PaymentIntent
    PaymentIntent --> ProcessPayment
    ProcessPayment --> ConfirmPayment

    ConfirmPayment --> Queue
    ConfirmPayment --> EmailConfirm

    Queue --> Warehouse
    Warehouse --> Packing
    Packing --> Ship
    Ship --> EmailShipped

    Ship --> Carrier
    Carrier --> Transit
    Transit --> Delivered
    Delivered --> EmailDelivered
```

## Event-Driven Architecture

### Domain Events

```mermaid
graph LR
    subgraph Events["Domain Events"]
        E1[OrderCreated]
        E2[PaymentReceived]
        E3[OrderFulfilled]
        E4[OrderShipped]
        E5[OrderDelivered]
        E6[OrderCancelled]
        E7[RefundProcessed]
    end

    subgraph Handlers["Event Handlers"]
        H1[Email Service]
        H2[Inventory Service]
        H3[Analytics Service]
        H4[Warehouse Service]
        H5[Notification Service]
    end

    E1 --> H1
    E1 --> H2
    E1 --> H3
    E1 --> H4

    E2 --> H1
    E2 --> H3

    E3 --> H4
    E3 --> H1

    E4 --> H1
    E4 --> H5

    E5 --> H1
    E5 --> H3

    E6 --> H1
    E6 --> H2

    E7 --> H1
    E7 --> H3
```

### Event Sequence

```mermaid
sequenceDiagram
    participant Order Service
    participant SQS
    participant Email Worker
    participant Inventory Worker
    participant Analytics Worker
    participant Warehouse Worker

    Order Service->>SQS: Publish OrderCreated
    SQS->>Email Worker: OrderCreated
    SQS->>Inventory Worker: OrderCreated
    SQS->>Analytics Worker: OrderCreated
    SQS->>Warehouse Worker: OrderCreated

    par Email Processing
        Email Worker->>Email Worker: Send confirmation email
    and Inventory Processing
        Inventory Worker->>Inventory Worker: Deduct stock
    and Analytics Processing
        Analytics Worker->>Analytics Worker: Record sale
    and Warehouse Processing
        Warehouse Worker->>Warehouse Worker: Create pick list
    end
```

## Product Data Flow

### ASCII Product Lifecycle

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRODUCT DATA LIFECYCLE                               │
└─────────────────────────────────────────────────────────────────────────────┘

  ADMIN CREATES          SYNCED TO           DISPLAYED TO
      │                      │                    │
      ▼                      ▼                    ▼
┌─────────────┐        ┌─────────────┐      ┌─────────────┐
│ Admin Portal│───────▶│   Primary   │─────▶│   Redis     │
│  (Create)   │        │   Database  │      │   Cache     │
└─────────────┘        └─────────────┘      └─────────────┘
      │                      │                    │
      ▼                      │                    ▼
┌─────────────┐              │              ┌─────────────┐
│   Image     │              │              │   Product   │
│   Upload    │──────────────┤              │   Listing   │
└─────────────┘              │              │    Page     │
      │                      │              └─────────────┘
      ▼                      │                    │
┌─────────────┐              │              ┌─────────────┐
│     S3      │              └─────────────▶│   Product   │
│   Bucket    │──────────────────────────▶  │   Detail    │
└─────────────┘                            │    Page     │
      │                                    └─────────────┘
      ▼
┌─────────────┐
│ CloudFront  │
│    CDN      │
└─────────────┘
```

### Mermaid Product Data Flow

```mermaid
flowchart LR
    subgraph Admin["Admin Operations"]
        Create[Create Product]
        Update[Update Product]
        Delete[Delete Product]
    end

    subgraph Storage["Data Storage"]
        DB[(PostgreSQL)]
        S3[(S3 Images)]
        Cache[(Redis Cache)]
    end

    subgraph Delivery["Content Delivery"]
        CDN[CloudFront CDN]
        API[Product API]
    end

    subgraph Customer["Customer Views"]
        PLP[Product List]
        PDP[Product Detail]
        Search[Search Results]
    end

    Create --> DB
    Create --> S3
    Update --> DB
    Update --> Cache
    Delete --> DB
    Delete --> Cache

    DB --> API
    API --> Cache
    S3 --> CDN
    Cache --> PLP
    Cache --> PDP
    Cache --> Search
    CDN --> PDP
```

## Inventory Data Flow

### Real-Time Inventory Sync

```mermaid
sequenceDiagram
    participant Product Page
    participant API
    participant Redis
    participant Database
    participant Warehouse

    Product Page->>API: GET /products/:id/inventory
    API->>Redis: Check cached inventory
    Redis-->>API: Stock: 45

    Note over API,Redis: Real-time updates via pub/sub

    Warehouse->>Database: Update inventory
    Database->>Redis: Invalidate cache
    Redis->>API: Publish inventory change
    API->>Product Page: WebSocket: stock updated

    Product Page->>Product Page: Update UI (Stock: 42)
```

### Inventory Reservation

```mermaid
stateDiagram-v2
    [*] --> Available: Product in stock

    Available --> Reserved: Added to cart
    Reserved --> Available: Cart expires (10min)
    Reserved --> Reserved: Checkout started
    Reserved --> Sold: Order completed
    Reserved --> Available: Order cancelled

    Sold --> [*]: Deducted from inventory

    state Reserved {
        [*] --> CartReserve
        CartReserve --> CheckoutReserve: Checkout begins
        CheckoutReserve --> PaymentReserve: Payment processing
    }
```

## Customer Data Flow

### ASCII Customer Data

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CUSTOMER DATA FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

  Registration         Profile Data          Activity Data
       │                    │                      │
       ▼                    ▼                      ▼
  ┌─────────┐         ┌─────────┐           ┌─────────┐
  │  Email  │         │ Orders  │           │  Views  │
  │Password │         │Addresses│           │ Clicks  │
  │  Name   │         │ Reviews │           │  Cart   │
  └────┬────┘         └────┬────┘           └────┬────┘
       │                   │                      │
       └───────────────────┼──────────────────────┘
                           │
                           ▼
                   ┌─────────────────┐
                   │   PostgreSQL    │
                   │   (encrypted)   │
                   └────────┬────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
       ┌───────────┐ ┌───────────┐ ┌───────────┐
       │   Auth    │ │  Order    │ │ Analytics │
       │  Service  │ │  Service  │ │  Service  │
       └───────────┘ └───────────┘ └───────────┘
```

### Mermaid Customer Journey Data

```mermaid
flowchart TD
    subgraph Touchpoints["Customer Touchpoints"]
        Web[Website]
        Mobile[Mobile App]
        Email[Email Links]
    end

    subgraph Collection["Data Collection"]
        Browse[Browse History]
        Search[Search Queries]
        Cart[Cart Activity]
        Purchase[Purchases]
    end

    subgraph Storage["Data Storage"]
        Profile[(Customer Profile)]
        Activity[(Activity Log)]
        Orders[(Order History)]
    end

    subgraph Usage["Data Usage"]
        Personalization[Personalized Recs]
        Marketing[Email Campaigns]
        Analytics[Business Analytics]
    end

    Web --> Browse
    Web --> Search
    Mobile --> Browse
    Mobile --> Cart
    Email --> Browse

    Browse --> Activity
    Search --> Activity
    Cart --> Activity
    Purchase --> Orders
    Purchase --> Profile

    Activity --> Personalization
    Profile --> Marketing
    Orders --> Analytics
```

## Data Synchronization

### Cross-System Sync

```mermaid
graph TB
    subgraph Primary["Primary Systems"]
        API[ShopFlow API]
        DB[(PostgreSQL)]
    end

    subgraph Cache["Caching Layer"]
        Redis[(Redis)]
    end

    subgraph External["External Systems"]
        Stripe[Stripe]
        Warehouse[Warehouse]
        Shipping[Shipping]
    end

    subgraph Sync["Sync Patterns"]
        Webhook[Webhooks]
        Polling[Polling]
        EventBus[Event Bus]
    end

    API --> DB
    DB --> Redis
    Stripe -->|Webhook| API
    Warehouse -->|Polling| API
    Shipping -->|Webhook| API
    API -->|EventBus| Warehouse
    API -->|EventBus| Shipping
```

## Data Retention

| Data Type | Retention | Storage | Archival |
|-----------|-----------|---------|----------|
| Orders | 7 years | PostgreSQL | S3 Glacier |
| Customer PII | Account lifetime + 30 days | PostgreSQL | Deleted |
| Activity Logs | 90 days | PostgreSQL | S3 |
| Cart Data | 30 days | Redis | None |
| Session Data | 24 hours | Redis | None |
| Product Images | Indefinite | S3 | None |
