# ShopFlow Security Architecture

## Security Overview

ShopFlow implements defense-in-depth security across all layers of the application stack.

### ASCII Security Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SECURITY ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  EDGE LAYER                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ CloudFront  │  │     WAF     │  │   Shield    │  │     ACM     │         │
│  │     CDN     │  │   Rules     │  │    DDoS     │  │    TLS      │         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  NETWORK LAYER                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │     VPC     │  │   Security  │  │   Private   │  │    NAT      │         │
│  │   Isolation │  │   Groups    │  │   Subnets   │  │  Gateway    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  APPLICATION LAYER                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │    JWT      │  │    Rate     │  │   Input     │  │    CORS     │         │
│  │    Auth     │  │  Limiting   │  │ Validation  │  │   Policy    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  DATA LAYER                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Encryption  │  │   Password  │  │    PII      │  │   Audit     │         │
│  │  at Rest    │  │   Hashing   │  │  Masking    │  │    Logs     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mermaid Security Architecture

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

## Authentication Flow

### ASCII Auth Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Client  │────▶│  Login   │────▶│ Validate │────▶│  Issue   │
│          │     │ Request  │     │  Creds   │     │   JWT    │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                         │
                                                         ▼
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│Protected │◀────│  Attach  │◀────│  Verify  │◀────│  Store   │
│   API    │     │  Bearer  │     │   JWT    │     │  Token   │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

### Mermaid Auth Sequence

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

## OAuth2 Social Login

```mermaid
sequenceDiagram
    participant User
    participant App
    participant OAuth Provider
    participant API
    participant Database

    User->>App: Click "Login with Google"
    App->>OAuth Provider: Redirect to OAuth
    OAuth Provider->>User: Show consent screen
    User->>OAuth Provider: Grant access
    OAuth Provider->>App: Redirect with auth code
    App->>API: POST /auth/oauth/google
    API->>OAuth Provider: Exchange code for tokens
    OAuth Provider-->>API: Access token + ID token
    API->>API: Validate ID token
    API->>Database: Find or create user
    Database-->>API: User record
    API->>API: Generate JWT
    API-->>App: ShopFlow tokens
```

## Payment Security (PCI DSS)

### ASCII Payment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      PCI DSS COMPLIANT FLOW                      │
└─────────────────────────────────────────────────────────────────┘

  Browser                 ShopFlow API              Stripe
     │                         │                      │
     │   Card Details          │                      │
     │ ───────────────────────────────────────────▶   │
     │   (Direct to Stripe)    │                      │
     │                         │                      │
     │   ◀─────────────────────────────────────────   │
     │   Payment Token         │                      │
     │                         │                      │
     │   Token + Order         │                      │
     │ ───────────────────────▶│                      │
     │                         │                      │
     │                         │   Create Charge      │
     │                         │─────────────────────▶│
     │                         │                      │
     │                         │◀─────────────────────│
     │                         │   Charge Result      │
     │                         │                      │
     │◀────────────────────────│                      │
     │   Order Confirmation    │                      │
```

### Mermaid Payment Security

```mermaid
flowchart LR
    subgraph Browser["Client Browser"]
        CardForm[Card Input Form]
        StripeJS[Stripe.js]
    end

    subgraph Stripe["Stripe (PCI Level 1)"]
        Tokenize[Tokenization]
        ThreeDS[3D Secure]
        Charge[Process Charge]
    end

    subgraph ShopFlow["ShopFlow API"]
        OrderAPI[Order Service]
        PaymentAPI[Payment Service]
    end

    CardForm -->|Card data| StripeJS
    StripeJS -->|Secure iframe| Tokenize
    Tokenize -->|Payment token| CardForm
    CardForm -->|Token only| OrderAPI
    OrderAPI -->|Create payment| PaymentAPI
    PaymentAPI -->|Token + amount| Charge
    Charge -->|3DS required| ThreeDS
    ThreeDS -->|Authenticated| Charge
    Charge -->|Result| PaymentAPI
```

## OWASP Top 10 Checklist

| Risk | Mitigation | Status |
|------|-----------|--------|
| A01:2021 Broken Access Control | Role-based access, JWT validation | Implemented |
| A02:2021 Cryptographic Failures | TLS 1.3, AES-256, bcrypt | Implemented |
| A03:2021 Injection | Prisma ORM, parameterized queries | Implemented |
| A04:2021 Insecure Design | Security architecture review | Implemented |
| A05:2021 Security Misconfiguration | Helmet.js, CSP headers | Implemented |
| A06:2021 Vulnerable Components | npm audit, Dependabot | Implemented |
| A07:2021 Auth Failures | JWT + refresh tokens, MFA | Implemented |
| A08:2021 Data Integrity | HMAC signatures, input validation | Implemented |
| A09:2021 Logging Failures | Structured logging, audit trails | Implemented |
| A10:2021 SSRF | URL validation, allowlist | Implemented |

## Security Headers

```typescript
// Helmet.js configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      frameSrc: ["https://js.stripe.com", "https://hooks.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
}));
```

## Rate Limiting

```mermaid
graph TD
    Request[Incoming Request] --> Extract[Extract IP/User ID]
    Extract --> Check{Check Rate Limit}
    Check -->|Under Limit| Process[Process Request]
    Check -->|Over Limit| Block[429 Too Many Requests]
    Process --> Increment[Increment Counter]
    Increment --> Redis[(Redis)]
    Block --> Log[Log Abuse]
```

### Rate Limit Configuration

| Endpoint | Limit | Window | By |
|----------|-------|--------|-----|
| /auth/login | 5 | 15 min | IP |
| /auth/register | 3 | 1 hour | IP |
| /api/products | 100 | 1 min | User |
| /api/orders | 30 | 1 min | User |
| /api/payments | 10 | 1 min | User |

## Input Validation

```typescript
// Zod schema for order creation
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(100),
  })).min(1).max(50),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
  paymentMethodId: z.string().min(1).max(255),
});

// XSS prevention
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};
```

## Audit Logging

```typescript
interface AuditLog {
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent: string;
  changes?: Record<string, { old: any; new: any }>;
  success: boolean;
}

// Example audit log
{
  "timestamp": "2024-01-15T10:30:00Z",
  "userId": "user_123",
  "action": "ORDER_CREATED",
  "resource": "orders",
  "resourceId": "order_456",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0...",
  "success": true
}
```

## Secrets Management

```mermaid
graph LR
    App[Application] --> SM[AWS Secrets Manager]
    SM --> DB[(Database Credentials)]
    SM --> API[(API Keys)]
    SM --> JWT[(JWT Secrets)]

    App --> SSM[Parameter Store]
    SSM --> Config[(App Config)]
    SSM --> Feature[(Feature Flags)]
```

| Secret Type | Storage | Rotation |
|------------|---------|----------|
| Database credentials | Secrets Manager | 30 days |
| JWT signing key | Secrets Manager | 90 days |
| Stripe API keys | Secrets Manager | Manual |
| OAuth client secrets | Secrets Manager | Annual |
