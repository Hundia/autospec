# ShopFlow Backend Architecture

## Technology Stack

- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 4.x
- **Language**: TypeScript 5.x
- **ORM**: Prisma 5.x
- **Validation**: Zod
- **Authentication**: Passport.js + JWT

## Layered Architecture

### ASCII Layer Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Routes    │  │ Controllers │  │ Middleware  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Services   │  │    DTOs     │  │  Mappers    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DOMAIN LAYER                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Entities   │  │   Events    │  │   Rules     │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      INFRASTRUCTURE LAYER                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │Repositories │  │  External   │  │   Cache     │              │
│  │  (Prisma)   │  │   APIs      │  │  (Redis)    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Mermaid Architecture Diagram

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

## Directory Structure

```
src/
├── api/
│   ├── routes/
│   │   ├── products.routes.ts
│   │   ├── cart.routes.ts
│   │   ├── orders.routes.ts
│   │   ├── users.routes.ts
│   │   └── payments.routes.ts
│   ├── controllers/
│   │   ├── products.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── orders.controller.ts
│   │   └── payments.controller.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── error.middleware.ts
│   └── validators/
│       ├── product.validator.ts
│       ├── cart.validator.ts
│       └── order.validator.ts
├── services/
│   ├── product.service.ts
│   ├── cart.service.ts
│   ├── order.service.ts
│   ├── user.service.ts
│   ├── payment.service.ts
│   └── notification.service.ts
├── domain/
│   ├── entities/
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── User.ts
│   │   └── Cart.ts
│   ├── events/
│   │   ├── OrderCreated.ts
│   │   ├── PaymentReceived.ts
│   │   └── OrderShipped.ts
│   └── rules/
│       ├── pricing.rules.ts
│       └── inventory.rules.ts
├── infrastructure/
│   ├── database/
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── repositories/
│   │       ├── product.repository.ts
│   │       └── order.repository.ts
│   ├── cache/
│   │   └── redis.client.ts
│   ├── external/
│   │   ├── stripe.client.ts
│   │   └── email.client.ts
│   └── queue/
│       └── sqs.client.ts
├── config/
│   ├── database.config.ts
│   ├── auth.config.ts
│   └── app.config.ts
└── utils/
    ├── logger.ts
    ├── errors.ts
    └── helpers.ts
```

## Request Flow

### ASCII Request Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Incoming │───▶│  Auth    │───▶│  Rate    │───▶│ Validate │
│ Request  │    │Middleware│    │  Limit   │    │  Input   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                                                      │
┌──────────┐    ┌──────────┐    ┌──────────┐          │
│ Response │◀───│Transform │◀───│ Service  │◀─────────┘
│          │    │ Response │    │  Logic   │
└──────────┘    └──────────┘    └──────────┘
```

### Mermaid Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant Router
    participant AuthMiddleware
    participant RateLimiter
    participant Validator
    participant Controller
    participant Service
    participant Repository
    participant Database

    Client->>Router: HTTP Request
    Router->>AuthMiddleware: Verify JWT
    AuthMiddleware->>RateLimiter: Check Limits
    RateLimiter->>Validator: Validate Body
    Validator->>Controller: Valid Request
    Controller->>Service: Business Logic
    Service->>Repository: Data Access
    Repository->>Database: Query
    Database-->>Repository: Result
    Repository-->>Service: Entity
    Service-->>Controller: DTO
    Controller-->>Client: JSON Response
```

## Service Patterns

### Product Service Example

```typescript
// src/services/product.service.ts
export class ProductService {
  constructor(
    private productRepo: ProductRepository,
    private cache: RedisCache,
    private eventBus: EventBus
  ) {}

  async getProduct(id: string): Promise<ProductDTO> {
    // Check cache first
    const cached = await this.cache.get(`product:${id}`);
    if (cached) return cached;

    // Fetch from database
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundError('Product not found');

    // Cache for 5 minutes
    await this.cache.set(`product:${id}`, product, 300);

    return ProductMapper.toDTO(product);
  }

  async updateInventory(id: string, quantity: number): Promise<void> {
    const product = await this.productRepo.findById(id);

    // Apply domain rules
    product.updateStock(quantity);

    await this.productRepo.save(product);
    await this.cache.del(`product:${id}`);

    // Emit domain event
    if (product.isLowStock()) {
      this.eventBus.emit(new LowStockEvent(product));
    }
  }
}
```

## Error Handling

```mermaid
graph TD
    A[Error Occurs] --> B{Error Type}
    B -->|Validation| C[400 Bad Request]
    B -->|Auth| D[401 Unauthorized]
    B -->|Permission| E[403 Forbidden]
    B -->|Not Found| F[404 Not Found]
    B -->|Business| G[422 Unprocessable]
    B -->|Server| H[500 Internal Error]

    C --> I[Error Response]
    D --> I
    E --> I
    F --> I
    G --> I
    H --> I

    I --> J[Log Error]
    J --> K[Return to Client]
```

## Middleware Chain

| Order | Middleware | Purpose |
|-------|-----------|---------|
| 1 | CORS | Cross-origin requests |
| 2 | Helmet | Security headers |
| 3 | Rate Limiter | Prevent abuse |
| 4 | Body Parser | Parse JSON |
| 5 | Request ID | Trace requests |
| 6 | Logger | Log requests |
| 7 | Auth | Verify JWT |
| 8 | Validator | Validate input |

## Database Connection Pool

```typescript
// Prisma client with connection pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
});

// Connection pool settings in DATABASE_URL
// postgresql://user:pass@host:5432/db?connection_limit=20&pool_timeout=10
```
