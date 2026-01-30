# ShopFlow Error Handling Flow

## Overview

This document describes how ShopFlow handles errors across payment failures, inventory issues, and delivery problems.

## Payment Failure Handling

### ASCII Payment Error Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PAYMENT FAILURE HANDLING                               │
└─────────────────────────────────────────────────────────────────────────────┘

  Payment Attempt          Error Type           Recovery Action
        │                      │                      │
        ▼                      ▼                      ▼
   ┌─────────┐          ┌───────────────┐      ┌─────────────┐
   │ Stripe  │─────────▶│ Card Declined │─────▶│  Retry with │
   │  API    │          │               │      │  diff card  │
   └─────────┘          └───────────────┘      └─────────────┘
        │                      │
        │               ┌───────────────┐      ┌─────────────┐
        └──────────────▶│ Insufficient  │─────▶│   Update    │
                        │    Funds      │      │   Amount    │
                        └───────────────┘      └─────────────┘
        │                      │
        │               ┌───────────────┐      ┌─────────────┐
        └──────────────▶│   Expired     │─────▶│ Enter new   │
                        │    Card       │      │    card     │
                        └───────────────┘      └─────────────┘
        │                      │
        │               ┌───────────────┐      ┌─────────────┐
        └──────────────▶│   3DS Auth    │─────▶│  Complete   │
                        │   Required    │      │  3DS flow   │
                        └───────────────┘      └─────────────┘
```

### Mermaid Payment Error Flow

```mermaid
flowchart TD
    Payment[Initiate Payment] --> Stripe[Stripe API]
    Stripe --> Result{Payment Result}

    Result -->|Success| Complete[Order Complete]
    Result -->|Failed| ErrorType{Error Type}

    ErrorType -->|card_declined| Declined[Card Declined]
    ErrorType -->|insufficient_funds| Funds[Insufficient Funds]
    ErrorType -->|expired_card| Expired[Expired Card]
    ErrorType -->|authentication_required| Auth[3DS Required]
    ErrorType -->|processing_error| Processing[Processing Error]
    ErrorType -->|rate_limit| RateLimit[Rate Limited]

    Declined --> ShowError[Show User-Friendly Error]
    Funds --> ShowError
    Expired --> ShowError
    Processing --> ShowError

    ShowError --> Retry{User Action}
    Retry -->|Try Different Card| Payment
    Retry -->|Cancel| Cancelled[Order Cancelled]

    Auth --> ThreeDS[3D Secure Flow]
    ThreeDS --> Payment

    RateLimit --> Wait[Wait & Retry]
    Wait --> Payment
```

### Payment Error Sequence

```mermaid
sequenceDiagram
    participant User
    participant Checkout
    participant API
    participant Stripe
    participant Logger

    User->>Checkout: Submit payment
    Checkout->>API: POST /orders/payment
    API->>Stripe: Create charge

    alt Card Declined
        Stripe-->>API: Error: card_declined
        API->>Logger: Log payment failure
        API-->>Checkout: { error: "card_declined", message: "..." }
        Checkout->>User: "Your card was declined. Please try another card."
    else 3DS Required
        Stripe-->>API: requires_action
        API-->>Checkout: { action: "3ds", clientSecret }
        Checkout->>Stripe: Show 3DS modal
        User->>Stripe: Complete authentication
        Stripe-->>Checkout: Authentication result
        Checkout->>API: Confirm payment
    else Success
        Stripe-->>API: Success
        API-->>Checkout: Order confirmed
        Checkout->>User: Show confirmation
    end
```

### Payment Error Codes

| Error Code | User Message | Recovery Action |
|------------|-------------|-----------------|
| card_declined | Your card was declined | Try a different card |
| insufficient_funds | Insufficient funds | Use a different card or reduce order |
| expired_card | Card has expired | Update card details |
| incorrect_cvc | Security code is incorrect | Re-enter CVC |
| processing_error | Processing error | Try again in a moment |
| authentication_required | Additional authentication needed | Complete 3D Secure |

## Inventory Error Handling

### ASCII Inventory Errors

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      INVENTORY ERROR HANDLING                                │
└─────────────────────────────────────────────────────────────────────────────┘

  Add to Cart              Check Stock              Handle Error
       │                       │                        │
       ▼                       ▼                        ▼
  ┌─────────┐           ┌───────────────┐        ┌─────────────┐
  │ Product │──────────▶│ Stock = 0     │───────▶│  Show "Out  │
  │ Request │           │               │        │  of Stock"  │
  └─────────┘           └───────────────┘        └─────────────┘
       │                       │                        │
       │                ┌───────────────┐        ┌─────────────┐
       └───────────────▶│ Stock < Qty   │───────▶│ Show "Only  │
                        │               │        │  X left"    │
                        └───────────────┘        └─────────────┘
       │                       │                        │
       │                ┌───────────────┐        ┌─────────────┐
       └───────────────▶│ Reserved by   │───────▶│  Waitlist   │
                        │ other user    │        │  Option     │
                        └───────────────┘        └─────────────┘
```

### Mermaid Inventory Flow

```mermaid
flowchart TD
    subgraph AddToCart["Add to Cart"]
        Request[User adds item]
        CheckStock{Check Inventory}
    end

    subgraph Outcomes["Possible Outcomes"]
        Available[In Stock]
        LowStock[Low Stock Warning]
        OutOfStock[Out of Stock]
        Reserved[Reserved by Others]
    end

    subgraph Actions["User Actions"]
        AddSuccess[Add to Cart]
        PartialAdd[Add Available Qty]
        Waitlist[Join Waitlist]
        Notify[Get Notified]
    end

    Request --> CheckStock
    CheckStock -->|qty <= stock| Available
    CheckStock -->|qty > stock && stock > 0| LowStock
    CheckStock -->|stock = 0| OutOfStock
    CheckStock -->|reserved| Reserved

    Available --> AddSuccess
    LowStock --> PartialAdd
    OutOfStock --> Waitlist
    OutOfStock --> Notify
    Reserved --> Notify
```

### Checkout Inventory Validation

```mermaid
sequenceDiagram
    participant User
    participant Checkout
    participant API
    participant Inventory
    participant Database

    User->>Checkout: Proceed to checkout
    Checkout->>API: Validate cart

    loop For each cart item
        API->>Inventory: Check stock
        Inventory->>Database: SELECT stock_quantity
        Database-->>Inventory: Current stock
    end

    alt All items available
        Inventory-->>API: All valid
        API->>Inventory: Reserve items (10 min)
        API-->>Checkout: Proceed to payment
    else Some items unavailable
        Inventory-->>API: Items unavailable list
        API-->>Checkout: Cart validation errors
        Checkout->>User: "Some items are no longer available"
        Note over User,Checkout: Show options to update or remove items
    end
```

## Delivery Error Handling

### ASCII Delivery Errors

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DELIVERY ERROR HANDLING                                 │
└─────────────────────────────────────────────────────────────────────────────┘

  Shipping Stage          Error Type            Resolution
       │                      │                     │
       ▼                      ▼                     ▼
  ┌───────────┐        ┌───────────────┐     ┌─────────────┐
  │  Pickup   │───────▶│ Pickup Failed │────▶│  Reschedule │
  │           │        │               │     │   Pickup    │
  └───────────┘        └───────────────┘     └─────────────┘
       │                      │                     │
       ▼                      ▼                     ▼
  ┌───────────┐        ┌───────────────┐     ┌─────────────┐
  │ In Transit│───────▶│    Delayed    │────▶│   Update    │
  │           │        │               │     │   Customer  │
  └───────────┘        └───────────────┘     └─────────────┘
       │                      │                     │
       ▼                      ▼                     ▼
  ┌───────────┐        ┌───────────────┐     ┌─────────────┐
  │ Delivery  │───────▶│   Address     │────▶│  Contact    │
  │  Attempt  │        │   Invalid     │     │  Customer   │
  └───────────┘        └───────────────┘     └─────────────┘
       │                      │                     │
       ▼                      ▼                     ▼
  ┌───────────┐        ┌───────────────┐     ┌─────────────┐
  │ Delivered │───────▶│    Lost/      │────▶│  Reship or  │
  │           │        │   Damaged     │     │   Refund    │
  └───────────┘        └───────────────┘     └─────────────┘
```

### Mermaid Delivery Flow

```mermaid
stateDiagram-v2
    [*] --> Shipped: Package shipped

    Shipped --> InTransit: Carrier picked up
    Shipped --> PickupFailed: Pickup failed

    PickupFailed --> Shipped: Retry pickup
    PickupFailed --> Cancelled: 3 failed attempts

    InTransit --> OutForDelivery: Arrived at local hub
    InTransit --> Delayed: Weather/carrier issue
    InTransit --> Lost: Package lost

    Delayed --> InTransit: Issue resolved
    Delayed --> Lost: Package lost

    OutForDelivery --> Delivered: Successful delivery
    OutForDelivery --> DeliveryFailed: Address issue
    OutForDelivery --> Returned: Refused by recipient

    DeliveryFailed --> OutForDelivery: Reattempt
    DeliveryFailed --> Returned: Return to sender

    Lost --> Refund: Issue refund
    Lost --> Reship: Reship order

    Returned --> Refund: Process refund
    Delivered --> [*]: Complete
    Refund --> [*]: Complete
    Reship --> Shipped: New shipment
```

### Delivery Exception Handling

```mermaid
sequenceDiagram
    participant Carrier
    participant Webhook
    participant API
    participant Database
    participant Notification
    participant Support

    Carrier->>Webhook: Delivery exception event
    Webhook->>API: Process webhook
    API->>Database: Update order status

    alt Address Issue
        API->>Notification: Email customer
        Notification-->>Customer: "Please update address"
        Customer->>API: Update address
        API->>Carrier: Reroute package
    else Package Damaged
        API->>Support: Create support ticket
        Support->>Customer: Contact customer
        API->>Database: Mark for replacement
    else Delivery Refused
        API->>Notification: Email customer
        API->>Database: Mark for return/refund
    end
```

## Error Recovery Patterns

### Retry Strategy

```mermaid
graph TD
    A[Error Occurs] --> B{Retryable?}

    B -->|Yes| C[Wait & Retry]
    B -->|No| D[Fail Immediately]

    C --> E{Attempt #}
    E -->|1| F[Wait 1s]
    E -->|2| G[Wait 2s]
    E -->|3| H[Wait 4s]
    E -->|>3| I[Give up]

    F --> J[Retry Request]
    G --> J
    H --> J
    J --> K{Success?}
    K -->|Yes| L[Continue]
    K -->|No| E

    I --> M[Log Error]
    M --> N[Alert Team]
    N --> O[User Notification]

    D --> M
```

### Circuit Breaker

```mermaid
stateDiagram-v2
    [*] --> Closed: Initial state

    Closed --> Closed: Request success
    Closed --> Open: Failure threshold reached

    Open --> HalfOpen: Timeout expires
    Open --> Open: Reject requests

    HalfOpen --> Closed: Test request succeeds
    HalfOpen --> Open: Test request fails
```

## Error Logging & Monitoring

### Error Event Structure

```typescript
interface ErrorEvent {
  timestamp: string;
  errorId: string;
  type: 'payment' | 'inventory' | 'delivery' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  code: string;
  message: string;
  context: {
    userId?: string;
    orderId?: string;
    productId?: string;
    endpoint?: string;
    requestId?: string;
  };
  stack?: string;
  metadata?: Record<string, unknown>;
}
```

### Alert Thresholds

| Error Type | Threshold | Alert Channel |
|------------|-----------|---------------|
| Payment failures | > 5% in 5 min | PagerDuty |
| Out of stock | Trending product | Slack |
| Delivery exceptions | > 10/hour | Email |
| System errors | Any 500 | PagerDuty |
| API latency | > 2s p95 | Slack |
