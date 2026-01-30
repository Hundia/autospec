# ShopFlow State Transitions

## Order State Machine

### ASCII State Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          ORDER STATE MACHINE                                 │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   PENDING   │
                              │  (Created)  │
                              └──────┬──────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
       ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
       │  CANCELLED  │        │    PAID     │        │   EXPIRED   │
       │ (By User)   │        │ (Payment OK)│        │ (Timeout)   │
       └─────────────┘        └──────┬──────┘        └─────────────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │ PROCESSING  │
                              │ (Warehouse) │
                              └──────┬──────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
       ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
       │  REFUNDED   │        │   SHIPPED   │        │ ON HOLD     │
       │(Issue Found)│        │(In Transit) │        │(Stock Issue)│
       └─────────────┘        └──────┬──────┘        └─────────────┘
                                     │
                                     ▼
                              ┌─────────────┐
                              │  DELIVERED  │
                              │ (Complete)  │
                              └──────┬──────┘
                                     │
              ┌──────────────────────┴──────────────────────┐
              │                                             │
              ▼                                             ▼
       ┌─────────────┐                               ┌─────────────┐
       │  RETURNED   │                               │  COMPLETED  │
       │(RMA Process)│                               │  (Final)    │
       └─────────────┘                               └─────────────┘
```

### Mermaid Order State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending: Order Created

    Pending --> Paid: Payment Confirmed
    Pending --> Cancelled: Customer Cancels
    Pending --> Expired: Payment Timeout (30 min)

    Paid --> Processing: Start Fulfillment
    Paid --> Refunded: Customer Requests Refund

    Processing --> Shipped: Package Shipped
    Processing --> OnHold: Stock Issue
    Processing --> Refunded: Fulfillment Issue

    OnHold --> Processing: Issue Resolved
    OnHold --> Refunded: Cannot Fulfill

    Shipped --> Delivered: Delivery Confirmed
    Shipped --> Returned: Return Initiated

    Delivered --> Returned: Return Requested (14 days)
    Delivered --> Completed: No Returns (15 days)

    Returned --> Refunded: Return Received

    Cancelled --> [*]: Closed
    Expired --> [*]: Closed
    Refunded --> [*]: Closed
    Completed --> [*]: Closed
```

## Order State Details

### State Definitions

| State | Description | Allowed Actions | Duration |
|-------|-------------|-----------------|----------|
| Pending | Order created, awaiting payment | Pay, Cancel | 30 min max |
| Paid | Payment received | Process, Refund | Until processed |
| Processing | Being prepared for shipment | Ship, Hold, Refund | 1-3 days |
| OnHold | Waiting for stock/issue | Resume, Refund | Until resolved |
| Shipped | Package in transit | Track, Return | 3-7 days |
| Delivered | Package delivered | Return, Review | 14 days |
| Completed | Order finalized | View History | Permanent |
| Cancelled | Cancelled before payment | None | Permanent |
| Expired | Payment timeout | None | Permanent |
| Returned | Return in progress | Track Return | 5-10 days |
| Refunded | Refund issued | None | Permanent |

### State Transitions

```mermaid
flowchart TD
    subgraph Transitions["Valid Transitions"]
        A[Pending] -->|payment_confirmed| B[Paid]
        A -->|customer_cancelled| C[Cancelled]
        A -->|timeout| D[Expired]

        B -->|fulfillment_started| E[Processing]
        B -->|refund_requested| F[Refunded]

        E -->|shipped| G[Shipped]
        E -->|stock_issue| H[OnHold]
        E -->|cannot_fulfill| F

        H -->|resolved| E
        H -->|cannot_resolve| F

        G -->|delivered| I[Delivered]
        G -->|return_started| J[Returned]

        I -->|return_requested| J
        I -->|return_window_closed| K[Completed]

        J -->|return_received| F
    end
```

## Payment State Machine

### Mermaid Payment States

```mermaid
stateDiagram-v2
    [*] --> Created: Payment Intent Created

    Created --> Processing: Payment Submitted
    Created --> Cancelled: Abandoned

    Processing --> RequiresAction: 3DS Required
    Processing --> Succeeded: Payment Approved
    Processing --> Failed: Payment Declined

    RequiresAction --> Processing: 3DS Completed
    RequiresAction --> Failed: 3DS Failed/Timeout

    Failed --> Processing: Retry Payment
    Failed --> Cancelled: Give Up

    Succeeded --> Refunding: Refund Initiated
    Succeeded --> [*]: Complete

    Refunding --> PartiallyRefunded: Partial Refund
    Refunding --> FullyRefunded: Full Refund

    PartiallyRefunded --> Refunding: Additional Refund
    PartiallyRefunded --> [*]: Complete

    FullyRefunded --> [*]: Complete
    Cancelled --> [*]: Closed
```

### Payment Transition Events

```typescript
enum PaymentEvent {
  PAYMENT_INTENT_CREATED = 'payment_intent.created',
  PAYMENT_SUBMITTED = 'payment_intent.processing',
  PAYMENT_REQUIRES_ACTION = 'payment_intent.requires_action',
  PAYMENT_SUCCEEDED = 'payment_intent.succeeded',
  PAYMENT_FAILED = 'payment_intent.payment_failed',
  CHARGE_REFUNDED = 'charge.refunded',
  CHARGE_DISPUTED = 'charge.dispute.created',
}
```

## Cart State Machine

### ASCII Cart States

```
┌─────────────────────────────────────────────────────────────────┐
│                      CART STATE MACHINE                          │
└─────────────────────────────────────────────────────────────────┘

  ┌───────────┐     add_item     ┌───────────┐
  │   EMPTY   │─────────────────▶│  ACTIVE   │
  └───────────┘                  └─────┬─────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             remove_last        checkout_start      no_activity
                    │                  │                  │
                    ▼                  ▼                  ▼
             ┌───────────┐     ┌───────────┐     ┌───────────┐
             │   EMPTY   │     │ CHECKOUT  │     │  EXPIRED  │
             └───────────┘     └─────┬─────┘     └───────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
            order_complete    checkout_abandon   payment_fail
                    │                │                │
                    ▼                ▼                ▼
             ┌───────────┐     ┌───────────┐     ┌───────────┐
             │ CONVERTED │     │  ACTIVE   │     │  ACTIVE   │
             └───────────┘     └───────────┘     └───────────┘
```

### Mermaid Cart States

```mermaid
stateDiagram-v2
    [*] --> Empty: Session Started

    Empty --> Active: Add First Item
    Active --> Empty: Remove All Items
    Active --> Active: Add/Update/Remove Items

    Active --> Checkout: Begin Checkout
    Active --> Expired: Inactive 7 days

    Checkout --> Active: Abandon Checkout
    Checkout --> Active: Payment Failed
    Checkout --> Converted: Order Placed

    Expired --> Empty: User Returns
    Converted --> [*]: Cart Cleared
```

## Inventory State Machine

### Mermaid Inventory States

```mermaid
stateDiagram-v2
    [*] --> Available: Stock Added

    Available --> Reserved: Cart Addition
    Available --> Available: Stock Replenished
    Available --> OutOfStock: Stock Depleted

    Reserved --> Available: Cart Expired (10 min)
    Reserved --> Reserved: Checkout Extended
    Reserved --> Sold: Order Completed
    Reserved --> Available: Order Cancelled

    Sold --> Available: Item Returned
    Sold --> [*]: Final

    OutOfStock --> Available: Restocked
    OutOfStock --> Discontinued: Product Discontinued

    Discontinued --> [*]: Removed from Catalog
```

### Inventory Transition Rules

```typescript
interface InventoryTransition {
  from: InventoryState;
  to: InventoryState;
  event: string;
  condition?: () => boolean;
  action?: () => void;
}

const transitions: InventoryTransition[] = [
  {
    from: 'AVAILABLE',
    to: 'RESERVED',
    event: 'ADD_TO_CART',
    condition: () => availableStock > 0,
    action: () => createReservation(10 * 60), // 10 min TTL
  },
  {
    from: 'RESERVED',
    to: 'AVAILABLE',
    event: 'RESERVATION_EXPIRED',
    action: () => releaseReservation(),
  },
  {
    from: 'RESERVED',
    to: 'SOLD',
    event: 'ORDER_COMPLETED',
    action: () => deductStock(),
  },
];
```

## Return/RMA State Machine

### Mermaid RMA States

```mermaid
stateDiagram-v2
    [*] --> Requested: Customer Requests Return

    Requested --> Approved: Return Approved
    Requested --> Rejected: Return Rejected

    Approved --> LabelSent: Shipping Label Sent
    LabelSent --> InTransit: Package Shipped
    InTransit --> Received: Package Received
    Received --> Inspecting: Inspecting Item

    Inspecting --> Approved_Refund: Condition OK
    Inspecting --> PartialRefund: Minor Issues
    Inspecting --> Rejected: Condition Not Met

    Approved_Refund --> Refunded: Refund Processed
    PartialRefund --> Refunded: Partial Refund Processed

    Rejected --> ReturnToCustomer: Ship Back to Customer
    ReturnToCustomer --> Closed: Package Delivered

    Refunded --> Closed: Complete
    Closed --> [*]
```

## State Transition Events (Event Sourcing)

```mermaid
sequenceDiagram
    participant System
    participant EventStore
    participant Projection
    participant ReadModel

    System->>EventStore: OrderCreated
    EventStore->>Projection: Process event
    Projection->>ReadModel: Update state

    System->>EventStore: PaymentReceived
    EventStore->>Projection: Process event
    Projection->>ReadModel: Update state

    System->>EventStore: OrderShipped
    EventStore->>Projection: Process event
    Projection->>ReadModel: Update state

    Note over EventStore: Event Log
    Note over ReadModel: Current State
```

### Event Log Example

```json
[
  {
    "eventId": "evt_001",
    "aggregateId": "order_123",
    "type": "OrderCreated",
    "timestamp": "2024-01-15T10:00:00Z",
    "data": { "customerId": "cust_456", "items": [...] }
  },
  {
    "eventId": "evt_002",
    "aggregateId": "order_123",
    "type": "PaymentReceived",
    "timestamp": "2024-01-15T10:05:00Z",
    "data": { "paymentId": "pay_789", "amount": 99.99 }
  },
  {
    "eventId": "evt_003",
    "aggregateId": "order_123",
    "type": "OrderShipped",
    "timestamp": "2024-01-16T14:30:00Z",
    "data": { "trackingNumber": "1Z999AA10123456784", "carrier": "UPS" }
  }
]
```
