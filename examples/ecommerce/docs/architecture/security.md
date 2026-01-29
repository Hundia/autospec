# ShopFlow Security Architecture

## Document Control
- **Version:** 1.0.0
- **Last Updated:** 2024-01-15
- **Status:** Approved
- **Owner:** Security Team

---

## 1. Authentication Flow

### 1.1 JWT Token Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TOKEN LIFECYCLE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  User Login                                                                 │
│      │                                                                      │
│      v                                                                      │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    AUTH SERVER                                      │    │
│  │                                                                     │    │
│  │  1. Validate credentials (email/password)                          │    │
│  │  2. Generate Access Token (15 min expiry)                          │    │
│  │  3. Generate Refresh Token (7 days expiry)                         │    │
│  │  4. Store refresh token hash in database                           │    │
│  │  5. Return both tokens to client                                   │    │
│  │                                                                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│      │                                                                      │
│      v                                                                      │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                      CLIENT                                         │    │
│  │                                                                     │    │
│  │  - Store access token in memory (Zustand)                          │    │
│  │  - Store refresh token in httpOnly cookie OR localStorage          │    │
│  │  - Send access token in Authorization header for API calls         │    │
│  │                                                                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│      │                                                                      │
│      │  API Request with Access Token                                       │
│      v                                                                      │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    API SERVER                                       │    │
│  │                                                                     │    │
│  │  1. Extract token from Authorization header                        │    │
│  │  2. Verify signature with JWT_SECRET                               │    │
│  │  3. Check expiration                                               │    │
│  │  4. Attach user to request                                         │    │
│  │                                                                     │    │
│  │  If token expired:                                                  │    │
│  │  - Return 401 with code "TOKEN_EXPIRED"                            │    │
│  │  - Client uses refresh token to get new access token               │    │
│  │                                                                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Registration Flow

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │   API    │                    │ Database │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ POST /auth/register           │                               │
     │ {email, password, name}       │                               │
     │──────────────────────────────>│                               │
     │                               │                               │
     │                               │ 1. Validate input             │
     │                               │ 2. Check email uniqueness     │
     │                               │─────────────────────────────>│
     │                               │                               │
     │                               │    Email exists?              │
     │                               │<─────────────────────────────│
     │                               │                               │
     │                               │ 3. Hash password (bcrypt)     │
     │                               │ 4. Create user record         │
     │                               │─────────────────────────────>│
     │                               │                               │
     │                               │ 5. Generate tokens            │
     │                               │ 6. Store refresh token hash   │
     │                               │─────────────────────────────>│
     │                               │                               │
     │                               │ 7. Queue verification email   │
     │                               │                               │
     │ 201 Created                   │                               │
     │ {user, tokens}                │                               │
     │<──────────────────────────────│                               │
     │                               │                               │
```

### 1.3 Login Flow

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │   API    │                    │ Database │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ POST /auth/login              │                               │
     │ {email, password}             │                               │
     │──────────────────────────────>│                               │
     │                               │                               │
     │                               │ 1. Find user by email         │
     │                               │─────────────────────────────>│
     │                               │                               │
     │                               │    User record                │
     │                               │<─────────────────────────────│
     │                               │                               │
     │                               │ 2. Verify password (bcrypt)   │
     │                               │                               │
     │                               │ 3. Check account status       │
     │                               │    - Not locked               │
     │                               │    - Not deleted              │
     │                               │                               │
     │                               │ 4. Generate tokens            │
     │                               │                               │
     │                               │ 5. Create session record      │
     │                               │─────────────────────────────>│
     │                               │                               │
     │                               │ 6. Update last_login_at       │
     │                               │─────────────────────────────>│
     │                               │                               │
     │ 200 OK                        │                               │
     │ {user, tokens}                │                               │
     │<──────────────────────────────│                               │
     │                               │                               │
```

### 1.4 Token Refresh Flow

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │   API    │                    │ Database │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ POST /auth/refresh            │                               │
     │ {refreshToken}                │                               │
     │──────────────────────────────>│                               │
     │                               │                               │
     │                               │ 1. Verify refresh token JWT   │
     │                               │                               │
     │                               │ 2. Hash token and find session│
     │                               │─────────────────────────────>│
     │                               │                               │
     │                               │    Session record             │
     │                               │<─────────────────────────────│
     │                               │                               │
     │                               │ 3. Check session not revoked  │
     │                               │ 4. Check session not expired  │
     │                               │                               │
     │                               │ 5. Generate new access token  │
     │                               │                               │
     │                               │ 6. Update session last_active │
     │                               │─────────────────────────────>│
     │                               │                               │
     │ 200 OK                        │                               │
     │ {accessToken}                 │                               │
     │<──────────────────────────────│                               │
     │                               │                               │
```

### 1.5 Logout Flow

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│  Client  │                    │   API    │                    │ Database │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │ POST /auth/logout             │                               │
     │ Authorization: Bearer <token> │                               │
     │──────────────────────────────>│                               │
     │                               │                               │
     │                               │ 1. Verify access token        │
     │                               │                               │
     │                               │ 2. Revoke refresh token       │
     │                               │    (set revoked_at)           │
     │                               │─────────────────────────────>│
     │                               │                               │
     │ 200 OK                        │                               │
     │ {message: "Logged out"}       │                               │
     │<──────────────────────────────│                               │
     │                               │                               │
     │ Client: Clear stored tokens   │                               │
     │                               │                               │
```

---

## 2. Authorization Model

### 2.1 Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ROLE HIERARCHY                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              ┌─────────┐                                    │
│                              │  admin  │                                    │
│                              └────┬────┘                                    │
│                                   │                                         │
│                          ┌───────┴───────┐                                  │
│                          │               │                                  │
│                     ┌────▼────┐     ┌────▼────┐                            │
│                     │merchant │     │ support │                            │
│                     └────┬────┘     └─────────┘                            │
│                          │                                                  │
│                     ┌────▼────┐                                            │
│                     │customer │                                            │
│                     └─────────┘                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Role Permissions Matrix

| Resource | Action | Customer | Merchant | Admin |
|----------|--------|----------|----------|-------|
| Products | View | Yes | Yes | Yes |
| Products | Create | No | Yes | Yes |
| Products | Edit Own | No | Yes | Yes |
| Products | Edit Any | No | No | Yes |
| Products | Delete | No | Yes (own) | Yes |
| Orders | View Own | Yes | Yes | Yes |
| Orders | View Any | No | No | Yes |
| Orders | Update Status | No | Yes (own) | Yes |
| Orders | Refund | No | Yes (own) | Yes |
| Users | View Own | Yes | Yes | Yes |
| Users | View Any | No | No | Yes |
| Users | Edit Own | Yes | Yes | Yes |
| Users | Edit Any | No | No | Yes |
| Users | Delete | No | No | Yes |
| Coupons | Create | No | No | Yes |
| Coupons | View | No | No | Yes |
| Reports | View | No | Yes (own) | Yes |

### 2.3 Authorization Implementation

```typescript
// middleware/authorize.ts

type Permission =
  | 'products:read'
  | 'products:create'
  | 'products:update'
  | 'products:delete'
  | 'orders:read'
  | 'orders:update'
  | 'users:read'
  | 'users:update'
  | 'admin:access';

const rolePermissions: Record<string, Permission[]> = {
  customer: [
    'products:read',
    'orders:read',
    'users:read',
    'users:update'
  ],
  merchant: [
    'products:read',
    'products:create',
    'products:update',
    'products:delete',
    'orders:read',
    'orders:update',
    'users:read',
    'users:update'
  ],
  admin: [
    'products:read',
    'products:create',
    'products:update',
    'products:delete',
    'orders:read',
    'orders:update',
    'users:read',
    'users:update',
    'admin:access'
  ]
};

export const authorize = (...requiredPermissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      throw new AuthError('Authentication required', 'UNAUTHENTICATED');
    }

    const userPermissions = rolePermissions[userRole] || [];
    const hasPermission = requiredPermissions.every(
      permission => userPermissions.includes(permission)
    );

    if (!hasPermission) {
      throw new AuthError('Insufficient permissions', 'FORBIDDEN');
    }

    next();
  };
};
```

---

## 3. Password Security

### 3.1 Password Requirements

| Requirement | Value |
|-------------|-------|
| Minimum length | 8 characters |
| Maximum length | 128 characters |
| Uppercase letters | At least 1 |
| Lowercase letters | At least 1 |
| Numbers | At least 1 |
| Special characters | At least 1 |
| Common password check | Enabled |

### 3.2 Password Hashing

```typescript
// utils/password.ts

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### 3.3 Password Reset Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │         │   API    │         │ Database │         │  Email   │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │                    │
     │ POST /auth/forgot  │                    │                    │
     │ {email}            │                    │                    │
     │───────────────────>│                    │                    │
     │                    │                    │                    │
     │                    │ Find user by email │                    │
     │                    │───────────────────>│                    │
     │                    │                    │                    │
     │                    │ Generate token     │                    │
     │                    │ Hash token         │                    │
     │                    │ Store hash + expiry│                    │
     │                    │───────────────────>│                    │
     │                    │                    │                    │
     │                    │ Queue reset email  │                    │
     │                    │────────────────────────────────────────>│
     │                    │                    │                    │
     │ 200 OK             │                    │                    │
     │ {generic message}  │                    │                    │
     │<───────────────────│                    │                    │
     │                    │                    │                    │
     │                    │                    │     Email with     │
     │<──────────────────────────────────────────────reset link────│
     │                    │                    │                    │
     │ POST /auth/reset   │                    │                    │
     │ {token, password}  │                    │                    │
     │───────────────────>│                    │                    │
     │                    │                    │                    │
     │                    │ Hash token         │                    │
     │                    │ Find & validate    │                    │
     │                    │───────────────────>│                    │
     │                    │                    │                    │
     │                    │ Update password    │                    │
     │                    │ Mark token used    │                    │
     │                    │ Invalidate sessions│                    │
     │                    │───────────────────>│                    │
     │                    │                    │                    │
     │ 200 OK             │                    │                    │
     │<───────────────────│                    │                    │
```

---

## 4. Input Validation

### 4.1 Validation Strategy

```typescript
// validators/auth.validator.ts

import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(255, 'Email too long'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain an uppercase letter')
    .regex(/[a-z]/, 'Password must contain a lowercase letter')
    .regex(/[0-9]/, 'Password must contain a number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain a special character'),

  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Invalid characters in first name'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Invalid characters in last name'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});
```

### 4.2 SQL Injection Prevention

```typescript
// Always use parameterized queries via Prisma ORM

// GOOD - Parameterized
const user = await prisma.user.findUnique({
  where: { email: userInput }
});

// GOOD - Prisma raw with parameters
const users = await prisma.$queryRaw`
  SELECT * FROM users WHERE email = ${userInput}
`;

// BAD - Never do this
const users = await prisma.$queryRawUnsafe(
  `SELECT * FROM users WHERE email = '${userInput}'` // VULNERABLE!
);
```

### 4.3 XSS Prevention

```typescript
// Response headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://js.stripe.com"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "https://cdn.shopflow.com", "data:"],
      frameSrc: ["https://js.stripe.com"],
      connectSrc: ["'self'", "https://api.stripe.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// React automatically escapes content
// But be careful with dangerouslySetInnerHTML
```

---

## 5. HTTPS and Transport Security

### 5.1 TLS Configuration

```nginx
# nginx.conf

server {
    listen 443 ssl http2;
    server_name api.shopflow.com;

    # TLS 1.2 and 1.3 only
    ssl_protocols TLSv1.2 TLSv1.3;

    # Strong cipher suites
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Certificate
    ssl_certificate /etc/ssl/certs/shopflow.crt;
    ssl_certificate_key /etc/ssl/private/shopflow.key;
}
```

### 5.2 Security Headers

```typescript
// Applied via Helmet middleware

const securityHeaders = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=()',
};
```

---

## 6. CORS Configuration

### 6.1 CORS Policy

```typescript
// config/cors.ts

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://shopflow.com',
      'https://www.shopflow.com',
      'https://admin.shopflow.com',
    ];

    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Session-ID'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400, // 24 hours
};
```

---

## 7. Rate Limiting

### 7.1 Rate Limit Configuration

| Endpoint Category | Limit | Window | Key |
|-------------------|-------|--------|-----|
| Authentication | 5 requests | 1 minute | IP |
| Password Reset | 3 requests | 15 minutes | Email |
| Search | 30 requests | 1 minute | IP + User |
| Cart Operations | 60 requests | 1 minute | Session/User |
| General API | 100 requests | 1 minute | IP + User |
| Webhooks | 1000 requests | 1 minute | IP |

### 7.2 Implementation

```typescript
// middleware/rateLimiter.ts

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../config/redis';

export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.sendCommand(args),
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many login attempts. Please try again later.',
    },
  },
  keyGenerator: (req) => req.ip,
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.sendCommand(args),
  }),
  windowMs: 60 * 1000,
  max: 100,
  keyGenerator: (req) => req.user?.id || req.ip,
});
```

---

## 8. Data Encryption

### 8.1 Encryption at Rest

| Data Type | Encryption Method |
|-----------|-------------------|
| Database | AWS RDS encryption (AES-256) |
| Backups | AWS S3 server-side encryption |
| File uploads | AWS S3 server-side encryption |
| Redis cache | AWS ElastiCache encryption |

### 8.2 Encryption in Transit

| Connection | Encryption |
|------------|------------|
| Client to API | TLS 1.3 |
| API to Database | TLS 1.2+ |
| API to Redis | TLS 1.2+ |
| API to S3 | HTTPS |

### 8.3 Sensitive Data Handling

```typescript
// Never log sensitive data
logger.info('User login', {
  email: user.email,
  // password: password,  // NEVER!
  ip: req.ip,
});

// Mask card numbers
function maskCardNumber(cardNumber: string): string {
  return '**** **** **** ' + cardNumber.slice(-4);
}

// Redact from error responses
function sanitizeError(error: any) {
  const sanitized = { ...error };
  delete sanitized.password;
  delete sanitized.cardNumber;
  delete sanitized.cvv;
  return sanitized;
}
```

---

## 9. PCI DSS Compliance

### 9.1 Stripe Integration (PCI DSS Level 1)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PAYMENT FLOW (PCI COMPLIANT)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐                                        ┌──────────────┐      │
│  │  Client  │                                        │    Stripe    │      │
│  │ (Browser)│                                        │              │      │
│  └────┬─────┘                                        └──────┬───────┘      │
│       │                                                     │              │
│       │  1. Load Stripe.js                                  │              │
│       │────────────────────────────────────────────────────>│              │
│       │                                                     │              │
│       │  2. Create card element                             │              │
│       │     (Card data NEVER touches our server)            │              │
│       │                                                     │              │
│       │  3. User enters card details                        │              │
│       │     (Directly into Stripe iframe)                   │              │
│       │                                                     │              │
│       │  4. Create payment method                           │              │
│       │────────────────────────────────────────────────────>│              │
│       │                                                     │              │
│       │  5. Receive payment_method_id                       │              │
│       │<────────────────────────────────────────────────────│              │
│       │                                                     │              │
│  ┌────┴─────┐                                        ┌──────┴───────┐      │
│  │  Client  │                                        │  Our Server  │      │
│  └────┬─────┘                                        └──────┬───────┘      │
│       │                                                     │              │
│       │  6. Send payment_method_id to our API               │              │
│       │────────────────────────────────────────────────────>│              │
│       │     (No card data, just Stripe token)               │              │
│       │                                                     │              │
│       │                          7. Create PaymentIntent    │              │
│       │                          ──────────────────────────>│              │
│       │                                                     │              │
│       │                          8. Confirm payment         │              │
│       │                          <──────────────────────────│              │
│       │                                                     │              │
│       │  9. Payment result                                  │              │
│       │<────────────────────────────────────────────────────│              │
│       │                                                     │              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 What We Store vs What Stripe Stores

| Data | ShopFlow | Stripe |
|------|----------|--------|
| Full card number | Never | Yes (encrypted) |
| CVV | Never | Temporarily |
| Card last 4 | Yes | Yes |
| Card brand | Yes | Yes |
| Expiry date | Yes | Yes |
| Billing address | Yes | Yes |

---

## 10. OWASP Top 10 Checklist

### 10.1 Compliance Matrix

| # | Risk | Status | Implementation |
|---|------|--------|----------------|
| A01 | Broken Access Control | Mitigated | RBAC, route guards, ownership checks |
| A02 | Cryptographic Failures | Mitigated | TLS 1.3, bcrypt, AES-256 |
| A03 | Injection | Mitigated | Prisma ORM, input validation, parameterized queries |
| A04 | Insecure Design | Mitigated | Threat modeling, security reviews |
| A05 | Security Misconfiguration | Mitigated | Helmet, CORS, secure defaults |
| A06 | Vulnerable Components | Mitigated | npm audit, Dependabot |
| A07 | Auth Failures | Mitigated | JWT, rate limiting, MFA (future) |
| A08 | Software & Data Integrity | Mitigated | Code signing, integrity checks |
| A09 | Security Logging | Mitigated | Audit logs, monitoring |
| A10 | SSRF | Mitigated | URL validation, allowlists |

---

## 11. Security Monitoring

### 11.1 Audit Logging

```typescript
// All security events are logged
const securityEvents = [
  'user.login.success',
  'user.login.failure',
  'user.logout',
  'user.password.changed',
  'user.password.reset.requested',
  'user.password.reset.completed',
  'user.created',
  'user.deleted',
  'admin.access',
  'payment.created',
  'payment.failed',
  'suspicious.activity',
];

// Log format
logger.audit({
  event: 'user.login.success',
  userId: user.id,
  ip: req.ip,
  userAgent: req.headers['user-agent'],
  timestamp: new Date().toISOString(),
});
```

### 11.2 Alerting Rules

| Event | Threshold | Action |
|-------|-----------|--------|
| Failed logins (same IP) | 10 in 5 min | Block IP, alert |
| Failed logins (same account) | 5 in 5 min | Lock account, alert |
| Password reset requests | 5 in 15 min | Alert |
| Admin access from new IP | Any | Alert |
| Payment failures | 5 in 1 min | Alert |
| 5xx errors | 10 in 1 min | Alert |

---

## 12. Incident Response

### 12.1 Security Incident Procedure

1. **Detection**: Automated monitoring alerts or user reports
2. **Assessment**: Determine severity and scope
3. **Containment**: Isolate affected systems
4. **Eradication**: Remove threat
5. **Recovery**: Restore services
6. **Lessons Learned**: Document and improve

### 12.2 Contact Information

| Role | Contact |
|------|---------|
| Security Lead | security@shopflow.com |
| On-call Engineer | PagerDuty |
| Legal/Compliance | legal@shopflow.com |

---

*Document End - Security Architecture*
