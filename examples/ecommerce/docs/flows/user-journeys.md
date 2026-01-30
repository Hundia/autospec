# ShopFlow User Journeys

## Overview

This document maps the complete user journeys through ShopFlow E-commerce platform.

## Primary Shopper Journey

### ASCII Journey Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        COMPLETE SHOPPING JOURNEY                             │
└─────────────────────────────────────────────────────────────────────────────┘

  DISCOVER          BROWSE           SELECT           PURCHASE         RECEIVE
     │                │                │                 │                │
     ▼                ▼                ▼                 ▼                ▼
┌─────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
│ Landing │───▶│  Search/  │───▶│  Product  │───▶│ Checkout  │───▶│  Order    │
│  Page   │    │  Browse   │    │  Detail   │    │   Flow    │    │ Tracking  │
└─────────┘    └───────────┘    └───────────┘    └───────────┘    └───────────┘
     │                │                │                 │                │
     │                │                │                 │                │
     ▼                ▼                ▼                 ▼                ▼
  • Hero          • Categories     • Images         • Shipping      • Status
  • Featured      • Filters        • Variants       • Payment       • Updates
  • Categories    • Sort           • Reviews        • Review        • Delivery
  • Search        • Pagination     • Add Cart       • Confirm       • Support
```

### Mermaid Journey Diagram

```mermaid
journey
    title Customer Shopping Journey
    section Discovery
      Land on homepage: 5: Customer
      Browse hero banner: 4: Customer
      View featured products: 4: Customer
    section Search & Browse
      Use search bar: 4: Customer
      Browse categories: 5: Customer
      Apply filters: 3: Customer
      Sort results: 4: Customer
    section Product Selection
      View product details: 5: Customer
      Check variants/sizes: 4: Customer
      Read customer reviews: 4: Customer
      View related products: 3: Customer
    section Cart Management
      Add item to cart: 5: Customer
      View cart drawer: 4: Customer
      Update quantities: 4: Customer
      Apply coupon code: 3: Customer
    section Checkout
      Enter shipping address: 3: Customer
      Select shipping method: 4: Customer
      Enter payment details: 3: Customer
      Review order: 4: Customer
      Place order: 5: Customer
    section Post-Purchase
      Receive confirmation email: 5: Customer
      Track order status: 4: Customer
      Receive shipping updates: 4: Customer
      Receive package: 5: Customer
      Write product review: 3: Customer
```

## Journey 1: Browse to Purchase

### User Story
As a new visitor, I want to browse products by category and purchase items.

### Flow

```mermaid
flowchart TD
    Start([Visitor lands on site]) --> Home[View Homepage]
    Home --> Action{User Action}

    Action -->|Browse| Category[Select Category]
    Action -->|Search| Search[Enter Search Term]
    Action -->|Featured| Featured[Click Featured Product]

    Category --> PLP[Product Listing Page]
    Search --> PLP
    Featured --> PDP[Product Detail Page]

    PLP --> Filter{Apply Filters?}
    Filter -->|Yes| ApplyFilters[Price/Size/Color]
    Filter -->|No| ViewProducts[Browse Products]
    ApplyFilters --> ViewProducts

    ViewProducts --> SelectProduct[Click Product]
    SelectProduct --> PDP

    PDP --> SelectVariant[Select Size/Color]
    SelectVariant --> AddToCart[Add to Cart]
    AddToCart --> CartDrawer[Cart Drawer Opens]

    CartDrawer --> ContinueShopping{Continue?}
    ContinueShopping -->|Yes| Home
    ContinueShopping -->|No| Checkout[Proceed to Checkout]

    Checkout --> ShippingForm[Enter Shipping]
    ShippingForm --> PaymentForm[Enter Payment]
    PaymentForm --> Review[Review Order]
    Review --> PlaceOrder[Place Order]
    PlaceOrder --> Confirmation[Order Confirmation]
    Confirmation --> End([Journey Complete])
```

### Touchpoints

| Stage | Page | Key Elements | Success Metric |
|-------|------|--------------|----------------|
| Discover | Homepage | Hero, Categories, Search | Bounce Rate < 40% |
| Browse | PLP | Filters, Sort, Grid | Time on Page > 2min |
| Select | PDP | Images, Variants, Reviews | Add to Cart Rate > 15% |
| Purchase | Checkout | Forms, Summary, Pay | Conversion Rate > 3% |
| Receive | Tracking | Status, Updates | CSAT > 4.5 |

## Journey 2: Returning Customer Quick Purchase

### ASCII Quick Purchase Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                 RETURNING CUSTOMER QUICK PURCHASE                │
└─────────────────────────────────────────────────────────────────┘

  Login            Search           Quick Add        Express Checkout
    │                │                 │                  │
    ▼                ▼                 ▼                  ▼
┌─────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
│  Sign   │───▶│  Search   │───▶│   Add     │───▶│ One-Click │
│   In    │    │ Product   │    │ to Cart   │    │ Purchase  │
└─────────┘    └───────────┘    └───────────┘    └───────────┘
    │                │                 │                  │
    │                │                 │                  │
    ▼                ▼                 ▼                  ▼
  Saved            Recent           Saved              Saved
  Address          Orders           Payment            Method
```

### Mermaid Quick Purchase

```mermaid
sequenceDiagram
    participant Customer
    participant Site
    participant Account
    participant Payment

    Customer->>Site: Visit ShopFlow
    Site->>Site: Detect returning visitor
    Site->>Customer: Show personalized homepage
    Customer->>Site: Search for product
    Site->>Customer: Show results + quick add
    Customer->>Site: Quick add to cart
    Site->>Account: Load saved addresses
    Account->>Site: Default shipping address
    Customer->>Site: Express checkout
    Site->>Account: Load saved payment
    Account->>Payment: Charge saved card
    Payment->>Site: Payment confirmed
    Site->>Customer: Order confirmation
```

## Journey 3: Mobile Shopping

```mermaid
flowchart LR
    subgraph Mobile["Mobile Experience"]
        A[Tap to open] --> B[Browse categories]
        B --> C[Swipe products]
        C --> D[Tap to view]
        D --> E[Pinch to zoom]
        E --> F[Tap add to cart]
        F --> G[Mobile checkout]
        G --> H[Apple/Google Pay]
        H --> I[Face/Touch ID]
    end
```

### Mobile-Specific Considerations

| Feature | Desktop | Mobile |
|---------|---------|--------|
| Navigation | Top nav + sidebar | Bottom nav + hamburger |
| Product Grid | 4 columns | 2 columns |
| Image Gallery | Click to expand | Swipe carousel |
| Add to Cart | Button | Sticky bottom bar |
| Checkout | Form | Digital wallet priority |

## Journey 4: Gift Purchase

### ASCII Gift Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        GIFT PURCHASE JOURNEY                     │
└─────────────────────────────────────────────────────────────────┘

  Select Gift      Gift Options      Recipient         Gift Sent
      │                │                │                  │
      ▼                ▼                ▼                  ▼
┌───────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐
│  Browse   │───▶│   Gift    │───▶│  Enter    │───▶│ Schedule  │
│ Products  │    │  Wrapping │    │ Recipient │    │  Delivery │
└───────────┘    └───────────┘    └───────────┘    └───────────┘
                       │                │
                       ▼                ▼
                 Gift Message      Different
                 Added             Shipping Addr
```

### Mermaid Gift Journey

```mermaid
stateDiagram-v2
    [*] --> Shopping: Start gift shopping

    Shopping --> ProductSelected: Select product
    ProductSelected --> GiftOptions: Mark as gift

    GiftOptions --> Wrapping: Add gift wrap ($5)
    GiftOptions --> Message: Add gift message
    GiftOptions --> Both: Both options

    Wrapping --> RecipientInfo
    Message --> RecipientInfo
    Both --> RecipientInfo

    RecipientInfo --> DifferentAddress: Enter recipient address
    DifferentAddress --> Schedule: Select delivery date

    Schedule --> Checkout: Proceed
    Checkout --> Confirmation: Complete purchase
    Confirmation --> [*]: Gift scheduled
```

## Journey 5: Order Tracking

```mermaid
flowchart TD
    subgraph OrderPlaced["Order Placed"]
        A[Confirmation Email] --> B[Order Number]
    end

    subgraph Tracking["Order Tracking"]
        C[Login to Account] --> D[View Orders]
        D --> E[Select Order]
        E --> F[View Status]
    end

    subgraph Status["Status Updates"]
        F --> G{Current Status}
        G -->|Processing| H[Being prepared]
        G -->|Shipped| I[Track package]
        G -->|Delivered| J[Confirm receipt]
    end

    subgraph Notifications["Notifications"]
        K[Email Updates]
        L[SMS Updates]
        M[Push Notifications]
    end

    B --> C
    H --> K
    I --> L
    J --> M
```

## Pain Points & Solutions

| Journey Stage | Pain Point | Solution |
|---------------|------------|----------|
| Search | No results | Smart suggestions, fuzzy search |
| Browse | Too many products | Better filters, AI recommendations |
| Product | Unclear sizing | Size guide, customer photos |
| Cart | Abandoned cart | Email reminders, exit intent popup |
| Checkout | Long forms | Autofill, address validation |
| Payment | Payment failure | Clear error, alternative methods |
| Tracking | No updates | Real-time tracking, push notifications |

## Conversion Funnel

```mermaid
graph TD
    A[Homepage Visitors: 100,000] --> B[Product Views: 60,000]
    B --> C[Add to Cart: 15,000]
    C --> D[Begin Checkout: 8,000]
    D --> E[Complete Purchase: 3,000]

    style A fill:#f9f,stroke:#333
    style B fill:#fcf,stroke:#333
    style C fill:#ffc,stroke:#333
    style D fill:#cfc,stroke:#333
    style E fill:#9f9,stroke:#333
```

### Funnel Metrics

| Stage | Count | Rate | Target |
|-------|-------|------|--------|
| Visitors | 100,000 | 100% | - |
| Product Views | 60,000 | 60% | 65% |
| Add to Cart | 15,000 | 25% | 30% |
| Begin Checkout | 8,000 | 53% | 60% |
| Purchase | 3,000 | 37% | 45% |
| **Overall Conversion** | - | **3%** | **4%** |
