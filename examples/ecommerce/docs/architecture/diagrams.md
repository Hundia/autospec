# ShopFlow Diagrams Collection

This file contains all Mermaid diagrams for the ShopFlow E-commerce platform, optimized for the AutoSpec viewer.

## System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph Clients["Client Layer"]
        Browser[Browser Client]
        Mobile[Mobile App]
        Admin[Admin Portal]
    end

    subgraph CDN["Content Delivery"]
        CloudFront[CloudFront CDN]
    end

    subgraph LoadBalancer["Load Balancing"]
        ALB[Application Load Balancer]
    end

    subgraph API["API Layer - ECS Fargate"]
        API1[API Instance 1]
        API2[API Instance 2]
        API3[API Instance 3]
    end

    subgraph Services["Service Layer"]
        AuthService[Auth Service]
        ProductService[Product Service]
        CartService[Cart Service]
        OrderService[Order Service]
        PaymentService[Payment Service]
        NotificationService[Notification Service]
    end

    subgraph Data["Data Layer"]
        PostgreSQL[(PostgreSQL RDS)]
        Redis[(Redis ElastiCache)]
        S3[(S3 Storage)]
    end

    subgraph Queue["Message Queue"]
        SQS[Amazon SQS]
        Worker[Worker Service]
    end

    Browser --> CloudFront
    Mobile --> CloudFront
    Admin --> CloudFront
    CloudFront --> ALB
    ALB --> API1
    ALB --> API2
    ALB --> API3

    API1 --> AuthService
    API1 --> ProductService
    API1 --> CartService
    API2 --> OrderService
    API2 --> PaymentService
    API3 --> NotificationService

    AuthService --> PostgreSQL
    AuthService --> Redis
    ProductService --> PostgreSQL
    ProductService --> Redis
    CartService --> Redis
    OrderService --> PostgreSQL
    OrderService --> SQS
    PaymentService --> PostgreSQL
    NotificationService --> SQS

    SQS --> Worker
    Worker --> PostgreSQL
```

## Database Diagrams

### Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ orders : places
    users ||--o{ addresses : has
    users ||--o{ reviews : writes
    users ||--o{ carts : owns

    orders ||--|{ order_items : contains
    orders ||--|| payments : has
    orders }o--|| addresses : ships_to
    orders }o--|| addresses : bills_to

    products ||--o{ order_items : includes
    products ||--o{ product_images : has
    products ||--o{ product_variants : has
    products ||--o{ reviews : receives
    products ||--o{ cart_items : in
    products }o--|| categories : belongs_to
    products }o--|| brands : made_by

    categories ||--o{ categories : parent_of

    carts ||--|{ cart_items : contains
    cart_items }o--|| product_variants : references

    users {
        uuid id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        string phone
        enum role
        timestamp created_at
        timestamp updated_at
    }

    products {
        uuid id PK
        string sku UK
        string name
        string slug UK
        text description
        decimal price
        decimal compare_at_price
        uuid category_id FK
        uuid brand_id FK
        int stock_quantity
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    orders {
        uuid id PK
        string order_number UK
        uuid user_id FK
        enum status
        decimal subtotal
        decimal tax
        decimal shipping_cost
        decimal total
        uuid shipping_address_id FK
        uuid billing_address_id FK
        timestamp created_at
        timestamp updated_at
    }

    order_items {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        uuid variant_id FK
        int quantity
        decimal unit_price
        decimal total_price
    }

    carts {
        uuid id PK
        uuid user_id FK
        string session_id
        timestamp expires_at
        timestamp created_at
        timestamp updated_at
    }

    cart_items {
        uuid id PK
        uuid cart_id FK
        uuid product_id FK
        uuid variant_id FK
        int quantity
        timestamp created_at
    }

    categories {
        uuid id PK
        string name
        string slug UK
        uuid parent_id FK
        text description
        string image_url
        int sort_order
    }

    addresses {
        uuid id PK
        uuid user_id FK
        enum type
        string street
        string city
        string state
        string postal_code
        string country
        boolean is_default
        timestamp created_at
    }

    payments {
        uuid id PK
        uuid order_id FK
        string stripe_payment_id
        decimal amount
        string currency
        enum status
        string method
        timestamp created_at
    }

    reviews {
        uuid id PK
        uuid product_id FK
        uuid user_id FK
        int rating
        string title
        text content
        boolean is_verified
        timestamp created_at
    }
```

## User Flow Diagrams

### Shopping Journey

```mermaid
journey
    title Customer Shopping Journey
    section Discovery
      Browse homepage: 5: Customer
      Search for product: 4: Customer
      View category: 4: Customer
    section Product Selection
      View product details: 5: Customer
      Read reviews: 4: Customer
      Select variant: 4: Customer
      Add to cart: 5: Customer
    section Checkout
      View cart: 5: Customer
      Enter shipping info: 3: Customer
      Enter payment info: 3: Customer
      Review order: 4: Customer
      Place order: 5: Customer
    section Post-Purchase
      Receive confirmation: 5: Customer
      Track order: 4: Customer
      Receive delivery: 5: Customer
      Write review: 3: Customer
```

### Checkout Flow

```mermaid
stateDiagram-v2
    [*] --> Cart
    Cart --> Shipping: Proceed to Checkout
    Cart --> [*]: Continue Shopping

    Shipping --> Payment: Address Validated
    Shipping --> Shipping: Invalid Address

    Payment --> Review: Payment Method Added
    Payment --> Payment: Invalid Payment

    Review --> Processing: Place Order
    Review --> Cart: Edit Cart
    Review --> Shipping: Edit Address
    Review --> Payment: Edit Payment

    Processing --> Confirmed: Payment Success
    Processing --> Payment: Payment Failed

    Confirmed --> [*]: Done
```

### Order State Machine

```mermaid
stateDiagram-v2
    [*] --> Pending: Order Created

    Pending --> Paid: Payment Confirmed
    Pending --> Cancelled: Customer Cancels
    Pending --> Cancelled: Payment Timeout

    Paid --> Processing: Start Fulfillment
    Paid --> Refunded: Customer Requests Refund

    Processing --> Shipped: Package Shipped
    Processing --> Refunded: Issue Detected

    Shipped --> Delivered: Delivery Confirmed
    Shipped --> Returned: Return Initiated

    Delivered --> Returned: Return Requested
    Delivered --> [*]: Complete

    Returned --> Refunded: Return Received

    Refunded --> [*]: Closed
    Cancelled --> [*]: Closed
```

## Sequence Diagrams

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Auth Service
    participant Database
    participant Redis

    User->>Frontend: Enter credentials
    Frontend->>API: POST /auth/login
    API->>Auth Service: Validate credentials
    Auth Service->>Database: Check user
    Database-->>Auth Service: User record
    Auth Service->>Auth Service: Verify password (bcrypt)
    Auth Service->>Auth Service: Generate JWT
    Auth Service->>Redis: Store refresh token
    Auth Service-->>API: Tokens
    API-->>Frontend: Access + Refresh tokens
    Frontend->>Frontend: Store tokens securely

    Note over User,Frontend: Subsequent requests
    Frontend->>API: Request + Bearer token
    API->>Auth Service: Verify JWT
    Auth Service-->>API: Valid
    API-->>Frontend: Protected resource
```

### Add to Cart Flow

```mermaid
sequenceDiagram
    participant Customer
    participant ProductPage
    participant CartStore
    participant API
    participant Cache
    participant Database

    Customer->>ProductPage: Click "Add to Cart"
    ProductPage->>CartStore: addItem(product, quantity)
    CartStore->>CartStore: Optimistic Update UI
    CartStore->>API: POST /cart/items
    API->>Cache: Check inventory
    Cache-->>API: Stock available
    API->>Database: Add cart item
    Database-->>API: Item added
    API->>Cache: Update cart cache
    API-->>CartStore: Confirm added
    CartStore->>ProductPage: Show success toast
    ProductPage->>Customer: "Added to cart!"
```

### Payment Processing

```mermaid
sequenceDiagram
    participant Customer
    participant Checkout
    participant API
    participant Stripe
    participant Database
    participant Queue

    Customer->>Checkout: Submit Payment
    Checkout->>Stripe: Create Payment Intent
    Stripe-->>Checkout: Client Secret
    Checkout->>Stripe: Confirm Payment
    Stripe->>Stripe: Process Card
    Stripe-->>Checkout: Payment Success
    Checkout->>API: POST /orders
    API->>Database: Create Order
    Database-->>API: Order Created
    API->>Queue: OrderCreated Event
    Queue-->>API: Queued
    API-->>Checkout: Order Confirmation
    Checkout->>Customer: Show Confirmation

    Note over Queue: Async Processing
    Queue->>Queue: Send Confirmation Email
    Queue->>Queue: Update Inventory
    Queue->>Queue: Notify Warehouse
```

## Component Diagrams

### Frontend Component Hierarchy

```mermaid
graph TB
    subgraph App["Application Shell"]
        Root[App Root]
        Providers[Provider Stack]
        Router[React Router]
    end

    subgraph Layouts["Layout Components"]
        MainLayout[Main Layout]
        AuthLayout[Auth Layout]
        CheckoutLayout[Checkout Layout]
    end

    subgraph Pages["Page Components"]
        HomePage[Home Page]
        PLPPage[Product List Page]
        PDPPage[Product Detail Page]
        CartPage[Cart Page]
        CheckoutPage[Checkout Page]
        AccountPage[Account Page]
    end

    subgraph Features["Feature Components"]
        ProductCard[Product Card]
        CartItem[Cart Item]
        CheckoutForm[Checkout Form]
        OrderSummary[Order Summary]
        ReviewWidget[Review Widget]
    end

    subgraph Shared["Shared Components"]
        Header[Header]
        Footer[Footer]
        Navigation[Navigation]
        SearchBar[Search Bar]
        CartDrawer[Cart Drawer]
    end

    Root --> Providers
    Providers --> Router
    Router --> MainLayout
    Router --> AuthLayout
    Router --> CheckoutLayout

    MainLayout --> Header
    MainLayout --> Footer
    MainLayout --> HomePage
    MainLayout --> PLPPage
    MainLayout --> PDPPage
    MainLayout --> AccountPage

    CheckoutLayout --> CartPage
    CheckoutLayout --> CheckoutPage

    PLPPage --> ProductCard
    CartPage --> CartItem
    CheckoutPage --> CheckoutForm
    CheckoutPage --> OrderSummary
    PDPPage --> ReviewWidget

    Header --> Navigation
    Header --> SearchBar
    Header --> CartDrawer
```

### Backend Service Architecture

```mermaid
graph TB
    subgraph Presentation["Presentation Layer"]
        Routes[Routes]
        Controllers[Controllers]
        Middleware[Middleware]
        Validators[Request Validators]
    end

    subgraph Application["Application Layer"]
        ProductService[Product Service]
        CartService[Cart Service]
        OrderService[Order Service]
        UserService[User Service]
        PaymentService[Payment Service]
    end

    subgraph Domain["Domain Layer"]
        ProductEntity[Product Entity]
        OrderEntity[Order Entity]
        UserEntity[User Entity]
        CartEntity[Cart Entity]
        DomainEvents[Domain Events]
    end

    subgraph Infrastructure["Infrastructure Layer"]
        PrismaRepo[Prisma Repositories]
        RedisCache[Redis Cache]
        StripeAPI[Stripe API]
        EmailService[Email Service]
        S3Client[S3 Client]
    end

    Routes --> Controllers
    Controllers --> Middleware
    Middleware --> Validators
    Validators --> ProductService
    Validators --> CartService
    Validators --> OrderService

    ProductService --> ProductEntity
    CartService --> CartEntity
    OrderService --> OrderEntity
    OrderService --> DomainEvents

    ProductEntity --> PrismaRepo
    OrderEntity --> PrismaRepo
    CartEntity --> RedisCache
    DomainEvents --> EmailService
    PaymentService --> StripeAPI
```

## Infrastructure Diagrams

### AWS Architecture

```mermaid
graph TB
    subgraph Global["Global Services"]
        Route53[Route 53 DNS]
        CloudFront[CloudFront CDN]
        WAF[AWS WAF]
        ACM[ACM Certificates]
    end

    subgraph Storage["Storage Services"]
        S3Static[S3 Static Assets]
        S3Media[S3 Product Images]
        S3Logs[S3 Logs Bucket]
    end

    subgraph VPC["VPC - us-east-1"]
        subgraph PublicSubnets["Public Subnets"]
            ALB[Application Load Balancer]
            NATa[NAT Gateway AZ-a]
            NATb[NAT Gateway AZ-b]
        end

        subgraph PrivateSubnets["Private Subnets"]
            ECSa[ECS Tasks AZ-a]
            ECSb[ECS Tasks AZ-b]
        end

        subgraph DataSubnets["Data Subnets"]
            RDS[(RDS PostgreSQL)]
            Redis[(ElastiCache Redis)]
        end
    end

    subgraph Async["Async Processing"]
        SQS[SQS Queue]
        Worker[Worker Service]
    end

    subgraph Monitoring["Monitoring"]
        CloudWatch[CloudWatch]
        XRay[X-Ray Tracing]
    end

    Route53 --> CloudFront
    CloudFront --> WAF
    WAF --> ALB
    CloudFront --> S3Static

    ALB --> ECSa
    ALB --> ECSb

    ECSa --> RDS
    ECSb --> RDS
    ECSa --> Redis
    ECSb --> Redis
    ECSa --> SQS
    ECSb --> SQS
    ECSa --> S3Media

    SQS --> Worker
    Worker --> RDS

    ECSa --> CloudWatch
    ECSb --> CloudWatch
    ECSa --> XRay
```

### CI/CD Pipeline

```mermaid
graph LR
    subgraph Source["Source"]
        GitHub[GitHub]
    end

    subgraph Build["Build"]
        CodeBuild[CodeBuild]
        ECR[ECR Registry]
    end

    subgraph Deploy["Deploy"]
        CodeDeploy[CodeDeploy]
        ECS[ECS Service]
    end

    subgraph Stages["Environments"]
        Dev[Development]
        Staging[Staging]
        Prod[Production]
    end

    GitHub -->|Push| CodeBuild
    CodeBuild -->|Image| ECR
    ECR -->|Deploy| CodeDeploy
    CodeDeploy -->|Blue/Green| ECS

    ECS --> Dev
    Dev -->|Approve| Staging
    Staging -->|Approve| Prod
```

## Security Diagrams

### Security Architecture

```mermaid
graph TB
    subgraph Edge["Edge Security"]
        CloudFront[CloudFront CDN]
        WAF[AWS WAF]
        Shield[AWS Shield]
    end

    subgraph Network["Network Security"]
        VPC[VPC]
        SG[Security Groups]
        PrivateSubnet[Private Subnets]
        PublicSubnet[Public Subnets]
    end

    subgraph Application["Application Security"]
        JWT[JWT Authentication]
        RateLimit[Rate Limiting]
        Validation[Input Validation]
        CORS[CORS Policy]
        Helmet[Security Headers]
    end

    subgraph Data["Data Security"]
        Encryption[AES-256 Encryption]
        Hashing[bcrypt Hashing]
        Masking[PII Masking]
        Audit[Audit Logging]
    end

    subgraph Payment["Payment Security"]
        Stripe[Stripe PCI DSS]
        Tokenization[Card Tokenization]
        ThreeDS[3D Secure]
    end

    CloudFront --> WAF
    WAF --> Shield
    Shield --> VPC
    VPC --> PublicSubnet
    VPC --> PrivateSubnet
    PublicSubnet --> SG
    SG --> JWT
    JWT --> RateLimit
    RateLimit --> Validation
    Validation --> CORS
    CORS --> Helmet
    Helmet --> Encryption
    Encryption --> Hashing
    Hashing --> Stripe
    Stripe --> Tokenization
```

## Data Flow Diagrams

### Product Data Flow

```mermaid
flowchart LR
    subgraph Admin["Admin Portal"]
        Create[Create Product]
        Update[Update Product]
        Upload[Upload Images]
    end

    subgraph API["API Layer"]
        ProductAPI[Product Service]
        ImageAPI[Image Service]
    end

    subgraph Storage["Storage"]
        DB[(PostgreSQL)]
        S3[(S3 Bucket)]
        Cache[(Redis)]
    end

    subgraph CDN["Delivery"]
        CloudFront[CloudFront]
    end

    subgraph Frontend["Customer"]
        PLP[Product List]
        PDP[Product Detail]
    end

    Create --> ProductAPI
    Update --> ProductAPI
    Upload --> ImageAPI

    ProductAPI --> DB
    ProductAPI --> Cache
    ImageAPI --> S3

    S3 --> CloudFront

    Cache --> PLP
    Cache --> PDP
    CloudFront --> PLP
    CloudFront --> PDP
```

### Order Data Flow

```mermaid
flowchart TB
    subgraph Customer["Customer Actions"]
        Cart[Shopping Cart]
        Checkout[Checkout]
    end

    subgraph Processing["Order Processing"]
        OrderService[Order Service]
        PaymentService[Payment Service]
        InventoryService[Inventory Service]
    end

    subgraph External["External Services"]
        Stripe[Stripe]
        Warehouse[Warehouse System]
        Shipping[Shipping Provider]
    end

    subgraph Notifications["Notifications"]
        Email[Email Service]
        SMS[SMS Service]
    end

    Cart --> Checkout
    Checkout --> OrderService
    OrderService --> PaymentService
    PaymentService --> Stripe
    Stripe --> PaymentService
    PaymentService --> OrderService
    OrderService --> InventoryService
    InventoryService --> Warehouse
    Warehouse --> Shipping

    OrderService --> Email
    Shipping --> Email
    Shipping --> SMS
```
