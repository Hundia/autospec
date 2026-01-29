# ShopFlow Architecture Overview

## Document Control
- **Version:** 1.0.0
- **Last Updated:** 2024-01-15
- **Status:** Approved
- **Owner:** Architecture Team

---

## 1. System Architecture

### 1.1 High-Level Architecture Diagram

```
                                    +------------------+
                                    |     Browser      |
                                    |  (React/Next.js) |
                                    +--------+---------+
                                             |
                                             | HTTPS
                                             v
                                    +------------------+
                                    |   CDN (Images)   |
                                    |  Cloudflare/AWS  |
                                    +--------+---------+
                                             |
                    +------------------------+------------------------+
                    |                                                 |
                    v                                                 v
           +----------------+                               +------------------+
           |   Next.js SSR  |                               |   Static Assets  |
           |   (Frontend)   |                               |   (S3 Bucket)    |
           +-------+--------+                               +------------------+
                   |
                   | API Calls (JSON/REST)
                   v
           +------------------+
           |  Load Balancer   |
           |   (AWS ALB)      |
           +--------+---------+
                    |
        +-----------+-----------+
        |                       |
        v                       v
+---------------+       +---------------+
|  API Server   |       |  API Server   |
|  (Express.js) |       |  (Express.js) |
|   Node.js 20  |       |   Node.js 20  |
+-------+-------+       +-------+-------+
        |                       |
        +-----------+-----------+
                    |
    +---------------+---------------+
    |               |               |
    v               v               v
+--------+   +----------+   +-------------+
| Redis  |   | PostgreSQL|   |Elasticsearch|
| Cache  |   |    16     |   |     8       |
+--------+   +----------+   +-------------+
                    |
                    v
            +---------------+
            |  AWS S3       |
            |  (File Store) |
            +---------------+
```

### 1.2 Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | Next.js | 14.x | React framework with SSR |
| Frontend | React | 18.x | UI library |
| Frontend | TypeScript | 5.x | Type safety |
| Frontend | TailwindCSS | 3.x | Utility-first CSS |
| Frontend | Zustand | 4.x | Client state management |
| Frontend | React Query | 5.x | Server state management |
| Backend | Node.js | 20 LTS | Runtime environment |
| Backend | Express.js | 4.x | Web framework |
| Backend | TypeScript | 5.x | Type safety |
| Database | PostgreSQL | 16 | Primary data store |
| Database | Prisma | 5.x | ORM |
| Cache | Redis | 7.x | Session/data caching |
| Search | Elasticsearch | 8.x | Full-text search |
| Storage | AWS S3 | - | File/image storage |
| Payments | Stripe | - | Payment processing |
| Email | SendGrid | - | Transactional emails |

---

## 2. Request Lifecycle

### 2.1 Typical Page Request Flow

```
1. User navigates to /products/wireless-headphones
                         |
                         v
2. Browser sends request to Next.js server
                         |
                         v
3. Next.js checks if page is cached (ISR)
         |                              |
    [Cache Hit]                    [Cache Miss]
         |                              |
         v                              v
4a. Return cached HTML      4b. Fetch data from API
                                       |
                                       v
                            5. API Gateway receives request
                                       |
                                       v
                            6. Auth middleware validates JWT
                                       |
                                       v
                            7. Controller processes request
                                       |
                                       v
                            8. Service layer executes logic
                                       |
                                       v
                            9. Repository queries PostgreSQL
                                       |
                                       v
                           10. Response flows back through layers
                                       |
                                       v
                           11. Next.js renders React components
                                       |
                                       v
                           12. HTML sent to browser
                                       |
                                       v
                           13. React hydrates on client
```

### 2.2 API Request Flow

```
HTTP Request
     |
     v
+----------------+
|  Rate Limiter  | --> [429 Too Many Requests]
+----------------+
     |
     v
+----------------+
|  Auth Guard    | --> [401 Unauthorized]
+----------------+
     |
     v
+----------------+
|  Validation    | --> [400 Bad Request]
+----------------+
     |
     v
+----------------+
|  Controller    |
+----------------+
     |
     v
+----------------+
|   Service      |
+----------------+
     |
     v
+----------------+
|  Repository    |
+----------------+
     |
     v
+----------------+
|   Database     |
+----------------+
     |
     v
JSON Response
```

---

## 3. Core Components

### 3.1 Frontend Architecture

```
Next.js App Router
├── App Shell (layout.tsx)
│   ├── Header Component
│   ├── Main Content (page.tsx)
│   └── Footer Component
│
├── Route Groups
│   ├── (shop)/ - Public shopping pages
│   ├── (auth)/ - Authentication pages
│   └── (account)/ - Protected user pages
│
├── State Management
│   ├── Zustand Stores (client state)
│   │   ├── authStore - User authentication
│   │   ├── cartStore - Shopping cart
│   │   └── uiStore - UI state (modals, toasts)
│   │
│   └── React Query (server state)
│       ├── Product queries
│       ├── Order queries
│       └── User queries
│
└── API Client (axios)
    ├── Request interceptors (auth token)
    └── Response interceptors (token refresh)
```

### 3.2 Backend Architecture

```
Express.js Application
├── Middleware Chain
│   ├── CORS
│   ├── Helmet (security headers)
│   ├── Rate Limiter
│   ├── Request Logger
│   ├── JSON Parser
│   └── Error Handler
│
├── Routes (/api/v1)
│   ├── /auth - Authentication
│   ├── /products - Product catalog
│   ├── /categories - Category management
│   ├── /cart - Shopping cart
│   ├── /checkout - Checkout process
│   ├── /orders - Order management
│   └── /admin - Admin operations
│
├── Controllers
│   └── Handle HTTP request/response
│
├── Services
│   └── Business logic layer
│
├── Repositories
│   └── Database access layer
│
└── Utilities
    ├── JWT handling
    ├── Email sending
    └── Error classes
```

---

## 4. Data Flow Patterns

### 4.1 Shopping Cart Flow

```
Add to Cart Click
       |
       v
+------------------+
| Frontend Zustand |  (optimistic update)
| cartStore        |
+------------------+
       |
       v
+------------------+
| POST /cart/items |
| API Request      |
+------------------+
       |
       v
+------------------+
| CartService      |
| - Validate stock |
| - Calculate price|
+------------------+
       |
       v
+------------------+
| CartRepository   |
| - Save to DB     |
+------------------+
       |
       v
+------------------+
| Redis Cache      |
| - Invalidate     |
+------------------+
       |
       v
+------------------+
| Response to      |
| Frontend         |
+------------------+
```

### 4.2 Checkout Flow

```
Checkout Initiated
        |
        v
+-------------------+
| Create Checkout   |
| Session           |
+-------------------+
        |
        v
+-------------------+
| Shipping Address  |
| + Method Selection|
+-------------------+
        |
        v
+-------------------+
| Payment Info      |
| (Stripe Elements) |
+-------------------+
        |
        v
+-------------------+
| Stripe Payment    |
| Intent Creation   |
+-------------------+
        |
        v
+-------------------+
| Order Creation    |
| (Transaction)     |
+-------------------+
        |
    +---+---+
    |       |
    v       v
+------+ +------+
|Order | |Stock |
|Record| |Update|
+------+ +------+
        |
        v
+-------------------+
| Confirmation      |
| Email Queued      |
+-------------------+
```

---

## 5. Non-Functional Requirements

### 5.1 Performance Targets

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Page Load Time (LCP) | < 2.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| API Response Time (p50) | < 100ms | APM Monitoring |
| API Response Time (p95) | < 200ms | APM Monitoring |
| API Response Time (p99) | < 500ms | APM Monitoring |
| Database Query Time (avg) | < 50ms | Query logging |
| Search Response Time | < 150ms | Elasticsearch metrics |

### 5.2 Availability Targets

| Component | Target Uptime | Recovery Time |
|-----------|--------------|---------------|
| Frontend (CDN) | 99.9% | < 5 minutes |
| API Servers | 99.9% | < 5 minutes |
| Database | 99.95% | < 15 minutes |
| Cache (Redis) | 99.9% | < 5 minutes |
| Search | 99.5% | < 30 minutes |

### 5.3 Scalability Requirements

| Metric | Current | Target (6 months) |
|--------|---------|-------------------|
| Concurrent Users | 1,000 | 10,000 |
| Products | 10,000 | 100,000 |
| Orders per Day | 1,000 | 10,000 |
| API Requests/sec | 100 | 1,000 |

---

## 6. Key Architectural Decisions

### 6.1 Decision Log

| Decision | Options Considered | Chosen | Rationale |
|----------|-------------------|--------|-----------|
| Frontend Framework | React SPA, Next.js, Remix | Next.js 14 | SSR for SEO, App Router, React ecosystem |
| Backend Framework | Express, Fastify, NestJS | Express.js | Team familiarity, ecosystem, flexibility |
| Database | PostgreSQL, MySQL, MongoDB | PostgreSQL 16 | ACID compliance, JSON support, full-text search |
| ORM | Prisma, TypeORM, Drizzle | Prisma | Type safety, migrations, dev experience |
| State Management | Redux, Zustand, Jotai | Zustand | Simplicity, TypeScript support, no boilerplate |
| Styling | CSS Modules, Styled Components, Tailwind | TailwindCSS | Utility-first, consistent design, small bundle |
| Authentication | Sessions, JWT | JWT | Stateless API, scalability |
| Search | PostgreSQL FTS, Elasticsearch | Elasticsearch | Advanced features, scalability, relevance |
| Payments | Stripe, PayPal SDK | Stripe | Developer experience, PCI compliance |

### 6.2 Trade-offs Acknowledged

1. **JWT vs Sessions**: JWT tokens cannot be revoked immediately; mitigated with short expiry + refresh tokens
2. **Elasticsearch**: Added infrastructure complexity; justified by search requirements at scale
3. **Redis**: Additional dependency; necessary for session management and caching
4. **Server Components**: Learning curve for team; benefits outweigh costs for SEO

---

## 7. Integration Points

### 7.1 External Services

```
ShopFlow Platform
       |
       +---> Stripe (Payments)
       |     - Payment intents
       |     - Refunds
       |     - Webhooks
       |
       +---> SendGrid (Email)
       |     - Order confirmations
       |     - Shipping updates
       |     - Password resets
       |
       +---> AWS S3 (Storage)
       |     - Product images
       |     - Invoice PDFs
       |
       +---> Shipping APIs (Future)
             - Rate calculation
             - Label generation
             - Tracking
```

### 7.2 Webhook Endpoints

| Service | Event | Endpoint | Action |
|---------|-------|----------|--------|
| Stripe | payment_intent.succeeded | /webhooks/stripe | Update order status |
| Stripe | payment_intent.failed | /webhooks/stripe | Mark order failed |
| Stripe | refund.created | /webhooks/stripe | Process refund |

---

## 8. Monitoring and Observability

### 8.1 Logging Strategy

```
Log Levels:
├── ERROR - Application errors, exceptions
├── WARN  - Unusual conditions, deprecations
├── INFO  - Business events (orders, signups)
├── DEBUG - Detailed debugging (dev only)
└── TRACE - Very detailed tracing (dev only)

Log Format (JSON):
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "INFO",
  "message": "Order placed",
  "orderId": "ord_abc123",
  "userId": "usr_xyz789",
  "total": 199.99,
  "requestId": "req_123456"
}
```

### 8.2 Metrics to Collect

| Category | Metrics |
|----------|---------|
| Business | Orders/hour, Revenue, Cart abandonment rate |
| Performance | Response times, Error rates, Throughput |
| Infrastructure | CPU, Memory, Disk I/O, Network |
| Database | Query times, Connection pool, Deadlocks |

---

## 9. Security Architecture

See `docs/architecture/security.md` for detailed security architecture including:
- Authentication flow
- Authorization model
- Data encryption
- OWASP compliance

---

## 10. References

- Backend Architecture: `docs/architecture/backend.md`
- Frontend Architecture: `docs/architecture/frontend.md`
- Database Schema: `docs/architecture/database.md`
- Security Details: `docs/architecture/security.md`
- API Reference: `docs/api/reference.md`

---

*Document End - Architecture Overview*
