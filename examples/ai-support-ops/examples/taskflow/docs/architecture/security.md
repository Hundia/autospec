# TaskFlow Security Architecture

## Authentication Flow

TaskFlow uses JWT-based authentication with access tokens and refresh tokens.

### ASCII Authentication Flow

```
                         TASKFLOW AUTHENTICATION FLOW
    ========================================================================

    REGISTRATION:
    ─────────────
    Client                          API                          Database
      │                              │                              │
      │  POST /auth/register         │                              │
      │  {email, password, name}     │                              │
      │ ────────────────────────────>│                              │
      │                              │  Check email exists          │
      │                              │ ────────────────────────────>│
      │                              │<─────────────────────────────│
      │                              │                              │
      │                              │  Hash password (bcrypt)      │
      │                              │  ────────────────            │
      │                              │                              │
      │                              │  INSERT user                 │
      │                              │ ────────────────────────────>│
      │                              │<─────────────────────────────│
      │                              │                              │
      │                              │  Generate tokens             │
      │                              │  ────────────────            │
      │                              │                              │
      │  201 {accessToken,           │                              │
      │       refreshToken, user}    │                              │
      │<─────────────────────────────│                              │
      │                              │                              │

    LOGIN:
    ──────
    Client                          API                          Database
      │                              │                              │
      │  POST /auth/login            │                              │
      │  {email, password}           │                              │
      │ ────────────────────────────>│                              │
      │                              │  Find user by email          │
      │                              │ ────────────────────────────>│
      │                              │<─────────────────────────────│
      │                              │                              │
      │                              │  Verify password (bcrypt)    │
      │                              │  ─────────────────────       │
      │                              │                              │
      │                              │  Generate tokens             │
      │                              │  ────────────────            │
      │                              │                              │
      │  200 {accessToken,           │                              │
      │       refreshToken, user}    │                              │
      │<─────────────────────────────│                              │
      │                              │                              │

    AUTHENTICATED REQUEST:
    ──────────────────────
    Client                          API                          Database
      │                              │                              │
      │  GET /tasks                  │                              │
      │  Authorization: Bearer xxx   │                              │
      │ ────────────────────────────>│                              │
      │                              │  Verify JWT                  │
      │                              │  Extract userId              │
      │                              │  ──────────────              │
      │                              │                              │
      │                              │  Fetch tasks                 │
      │                              │ ────────────────────────────>│
      │                              │<─────────────────────────────│
      │                              │                              │
      │  200 {tasks: [...]}          │                              │
      │<─────────────────────────────│                              │
      │                              │                              │

    TOKEN REFRESH:
    ──────────────
    Client                          API                          Database
      │                              │                              │
      │  POST /auth/refresh          │                              │
      │  {refreshToken}              │                              │
      │ ────────────────────────────>│                              │
      │                              │  Verify refresh token        │
      │                              │  ────────────────────        │
      │                              │                              │
      │                              │  Generate new access token   │
      │                              │  ─────────────────────────   │
      │                              │                              │
      │  200 {accessToken}           │                              │
      │<─────────────────────────────│                              │
      │                              │                              │

    LOGOUT:
    ───────
    Client                          API
      │                              │
      │  POST /auth/logout           │
      │  Authorization: Bearer xxx   │
      │ ────────────────────────────>│
      │                              │  (Client discards tokens)
      │  200 {message: "Logged out"} │
      │<─────────────────────────────│
      │                              │
```

### Mermaid Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant DB as Database

    rect rgb(59, 130, 246, 0.1)
        Note over C,DB: Registration Flow
        C->>A: POST /auth/register {email, password, name}
        A->>DB: Check email exists
        DB-->>A: Not found
        A->>A: Hash password (bcrypt, 12 rounds)
        A->>DB: INSERT user
        DB-->>A: User created
        A->>A: Generate JWT + Refresh Token
        A-->>C: 201 {accessToken, refreshToken, user}
    end

    rect rgb(16, 185, 129, 0.1)
        Note over C,DB: Login Flow
        C->>A: POST /auth/login {email, password}
        A->>DB: Find user by email
        DB-->>A: User record
        A->>A: Verify password (bcrypt.compare)
        A->>A: Generate JWT + Refresh Token
        A-->>C: 200 {accessToken, refreshToken, user}
    end

    rect rgb(245, 158, 11, 0.1)
        Note over C,DB: Authenticated Request
        C->>A: GET /tasks (Authorization: Bearer xxx)
        A->>A: Verify JWT signature
        A->>A: Extract userId from payload
        A->>DB: SELECT tasks WHERE user_id = userId
        DB-->>A: Task records
        A-->>C: 200 {tasks: [...]}
    end

    rect rgb(168, 85, 247, 0.1)
        Note over C,DB: Token Refresh
        C->>A: POST /auth/refresh {refreshToken}
        A->>A: Verify refresh token
        A->>A: Generate new access token
        A-->>C: 200 {accessToken}
    end
```

## JWT Token Structure

### Access Token

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid-here",
    "email": "user@example.com",
    "iat": 1706500000,
    "exp": 1706503600
  }
}
```

- **Algorithm:** HS256 (HMAC-SHA256)
- **Expiry:** 1 hour
- **Secret:** 256-bit key from `JWT_SECRET` env var

### Refresh Token

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user-uuid-here",
    "type": "refresh",
    "iat": 1706500000,
    "exp": 1707104800
  }
}
```

- **Algorithm:** HS256
- **Expiry:** 7 days
- **Secret:** Separate `JWT_REFRESH_SECRET` env var

## Authorization Model

TaskFlow uses a simple ownership-based authorization model:

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHORIZATION RULES                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Resource: Tasks                                             │
│  ─────────────────                                           │
│  - CREATE: Any authenticated user                            │
│  - READ:   Only owner (task.user_id === currentUser.id)      │
│  - UPDATE: Only owner                                        │
│  - DELETE: Only owner                                        │
│                                                              │
│  Resource: Projects                                          │
│  ─────────────────                                           │
│  - CREATE: Any authenticated user                            │
│  - READ:   Only owner (project.user_id === currentUser.id)   │
│  - UPDATE: Only owner                                        │
│  - DELETE: Only owner                                        │
│                                                              │
│  Resource: Tags                                              │
│  ─────────────────                                           │
│  - CREATE: Any authenticated user                            │
│  - READ:   Only owner (tag.user_id === currentUser.id)       │
│  - UPDATE: Only owner                                        │
│  - DELETE: Only owner                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Authorization Middleware

```typescript
// src/middleware/authorize.ts
export const authorizeResource = (
  getResource: (id: string) => Promise<{ userId: string } | null>
) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const resource = await getResource(req.params.id);

    if (!resource) {
      throw new NotFoundError('Resource');
    }

    if (resource.userId !== req.user.id) {
      throw new ForbiddenError('Not authorized to access this resource');
    }

    next();
  };
};
```

## Input Validation

### Validation Layer

```mermaid
flowchart LR
    A[Request] --> B{Zod Schema}
    B -->|Valid| C[Controller]
    B -->|Invalid| D[400 Error]

    style B fill:#f59e0b
    style D fill:#ef4444
```

### Validation Examples

```typescript
// src/schemas/taskSchemas.ts
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  dueDate: z.coerce.date().optional(),
  projectId: z.string().uuid().optional(),
  tagIds: z.array(z.string().uuid()).optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
```

## Security Measures

### SQL Injection Prevention

- All queries use Prisma ORM with parameterized queries
- No raw SQL queries with user input
- Prisma automatically escapes all values

### XSS Prevention

- React automatically escapes rendered content
- `dangerouslySetInnerHTML` is never used
- HTTP-only cookies for refresh tokens (when implemented)
- Content-Security-Policy header

### CSRF Protection

- SameSite cookie attribute
- Origin header validation
- JWT tokens prevent traditional CSRF

### Security Headers (Helmet)

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
  },
}));
```

## Secret Management

| Secret | Storage | Rotation |
|--------|---------|----------|
| `JWT_SECRET` | Environment variable | Every 90 days |
| `JWT_REFRESH_SECRET` | Environment variable | Every 90 days |
| `DATABASE_URL` | Environment variable | On compromise |
| API keys | Environment variable | Every 90 days |

### Environment Variable Handling

```bash
# Never commit these files
.env
.env.local
.env.production

# Use .env.example as template
JWT_SECRET=your-256-bit-secret-here
JWT_REFRESH_SECRET=your-256-bit-refresh-secret-here
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow
```

## HTTPS and CORS

### HTTPS

- All production traffic must use HTTPS
- SSL termination at NGINX/load balancer
- HSTS header enforces HTTPS

### CORS Configuration

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later' },
});

// Auth endpoints (stricter)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 auth attempts per 15 minutes
  message: { error: 'Too many authentication attempts' },
});
```

## Data Encryption

### At Rest

- PostgreSQL with encrypted storage (if using managed database)
- Passwords hashed with bcrypt (cost factor 12)
- Sensitive fields can be encrypted with AES-256

### In Transit

- TLS 1.3 for all connections
- Certificate from trusted CA (Let's Encrypt)
- Strong cipher suites only

## OWASP Top 10 Checklist

| Vulnerability | Mitigation |
|--------------|------------|
| A01 Broken Access Control | Ownership checks on all resources |
| A02 Cryptographic Failures | bcrypt passwords, HTTPS, JWT signatures |
| A03 Injection | Prisma parameterized queries, Zod validation |
| A04 Insecure Design | Least privilege, input validation |
| A05 Security Misconfiguration | Helmet headers, env vars, no defaults |
| A06 Vulnerable Components | npm audit, Dependabot alerts |
| A07 Auth Failures | Rate limiting, strong passwords, JWT |
| A08 Data Integrity Failures | Input validation, signed tokens |
| A09 Logging Failures | Request logging, error logging |
| A10 SSRF | No user-controlled URLs for server requests |
