# DataHub API Gateway - Security Architecture

## Overview

This document details the security architecture of DataHub API Gateway, including authentication flows, authorization mechanisms, and security best practices implemented throughout the system.

---

## Authentication Architecture

### ASCII Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       DataHub Authentication Flow                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐                                              ┌──────────────────┐
│  Client  │                                              │   DataHub API    │
└────┬─────┘                                              └────────┬─────────┘
     │                                                             │
     │  ══════════════════ USER AUTHENTICATION ══════════════════  │
     │                                                             │
     │  1. POST /api/v1/auth/login                                 │
     │     { email, password }                                     │
     │  ─────────────────────────────────────────────────────────► │
     │                                                             │
     │                              ┌─────────────────────────────┐│
     │                              │ Validate credentials        ││
     │                              │ bcrypt.compare(password)    ││
     │                              └─────────────────────────────┘│
     │                                                             │
     │  2. Return JWT tokens                                       │
     │     { accessToken, refreshToken }                           │
     │  ◄───────────────────────────────────────────────────────── │
     │                                                             │
     │  ══════════════════ API KEY AUTHENTICATION ═══════════════  │
     │                                                             │
     │  3. GET /api/v1/resource                                    │
     │     Header: X-API-Key: dh_live_xxx                          │
     │  ─────────────────────────────────────────────────────────► │
     │                                                             │
     │                              ┌─────────────────────────────┐│
     │                              │ Hash API key                ││
     │                              │ Lookup in Redis/PostgreSQL  ││
     │                              │ Verify not revoked/expired  ││
     │                              └─────────────────────────────┘│
     │                                                             │
     │  4. Return resource data                                    │
     │     { data: {...} }                                         │
     │  ◄───────────────────────────────────────────────────────── │
     │                                                             │
```

### Mermaid JWT Authentication Sequence

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Gateway
    participant A as Auth Service
    participant R as Redis
    participant DB as PostgreSQL

    Note over C,DB: User Login Flow

    C->>G: POST /auth/login {email, password}
    G->>A: Validate credentials
    A->>DB: SELECT user WHERE email = ?
    DB-->>A: User record
    A->>A: bcrypt.compare(password, hash)

    alt Password Valid
        A->>A: Generate JWT (15min expiry)
        A->>A: Generate Refresh Token (7d expiry)
        A->>DB: Store refresh_token hash
        A->>R: Cache user session
        A-->>G: {accessToken, refreshToken}
        G-->>C: 200 OK + tokens
    else Password Invalid
        A-->>G: Authentication failed
        G-->>C: 401 Unauthorized
    end

    Note over C,DB: Token Refresh Flow

    C->>G: POST /auth/refresh {refreshToken}
    G->>A: Validate refresh token
    A->>DB: Find token by hash

    alt Token Valid & Not Revoked
        A->>A: Generate new access token
        A->>A: Rotate refresh token
        A->>DB: Revoke old, store new
        A-->>G: {accessToken, refreshToken}
        G-->>C: 200 OK + new tokens
    else Token Invalid
        G-->>C: 401 Unauthorized
    end
```

---

## JWT Token Structure

### Token Anatomy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          JWT Token Structure                                 │
└─────────────────────────────────────────────────────────────────────────────┘

    Access Token (JWT)
    ═══════════════════════════════════════════════════════════════════════

    eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyXzEyMzQ1Ni...

    ┌─────────────────────────────────────────────────────────────────────┐
    │  HEADER (Base64)                                                     │
    │  {                                                                   │
    │    "alg": "RS256",        // RSA SHA-256 signature                  │
    │    "typ": "JWT",          // Token type                              │
    │    "kid": "key-2024-01"   // Key ID for rotation                    │
    │  }                                                                   │
    └─────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │  PAYLOAD (Base64)                                                    │
    │  {                                                                   │
    │    "sub": "user_123456",           // Subject (user ID)             │
    │    "email": "user@example.com",    // User email                    │
    │    "role": "developer",            // User role                     │
    │    "iat": 1706500000,              // Issued at                     │
    │    "exp": 1706500900,              // Expires (15 min)              │
    │    "iss": "datahub-api",           // Issuer                        │
    │    "aud": "datahub-clients"        // Audience                      │
    │  }                                                                   │
    └─────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
    ┌─────────────────────────────────────────────────────────────────────┐
    │  SIGNATURE                                                           │
    │                                                                      │
    │  RSASHA256(                                                          │
    │    base64UrlEncode(header) + "." +                                  │
    │    base64UrlEncode(payload),                                        │
    │    privateKey                                                        │
    │  )                                                                   │
    └─────────────────────────────────────────────────────────────────────┘
```

### Token Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Issued: Login/Refresh

    Issued --> Active: Token in use
    Active --> Active: Valid request
    Active --> Expired: TTL exceeded
    Active --> Revoked: Manual revocation
    Active --> Blacklisted: Logout

    Expired --> [*]: Requires refresh
    Revoked --> [*]: Cannot be renewed
    Blacklisted --> [*]: Must re-login
```

---

## API Key Security

### API Key Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  API Key Generation                          │
└─────────────────────────────────────────────────────────────┘

    Step 1: Generate Cryptographically Secure Key
    ───────────────────────────────────────────────

    crypto.randomBytes(32).toString('base64url')
    │
    ▼
    ┌────────────────────────────────────────────────┐
    │  Raw Key: dh_live_Kj8mN2pL9qR4sT6vW8xY0zA3bC5 │
    │                                                │
    │  Format: {prefix}_{env}_{random_32_bytes}     │
    │  • prefix: "dh" (DataHub)                     │
    │  • env: "live" or "test"                      │
    │  • random: 32 bytes, base64url encoded        │
    └────────────────────────────────────────────────┘
    │
    ▼
    Step 2: Hash for Storage
    ────────────────────────────

    SHA-256(raw_key)
    │
    ▼
    ┌────────────────────────────────────────────────┐
    │  Stored Hash: a1b2c3d4e5f6...                  │
    │  (Never store raw key!)                        │
    └────────────────────────────────────────────────┘
    │
    ▼
    Step 3: Return to User Once
    ────────────────────────────

    ┌────────────────────────────────────────────────┐
    │  Response:                                      │
    │  {                                              │
    │    "id": "key_uuid",                           │
    │    "name": "Production Key",                   │
    │    "key": "dh_live_Kj8m...",  // SHOWN ONCE   │
    │    "created_at": "2024-01-29T..."             │
    │  }                                              │
    │                                                │
    │  WARNING: Store this key securely.            │
    │  It will not be shown again.                  │
    └────────────────────────────────────────────────┘
```

### Mermaid API Key Validation Flow

```mermaid
flowchart TD
    A[Request with X-API-Key header] --> B{Key prefix valid?}

    B -->|No| C[401: Invalid API key format]
    B -->|Yes| D[Hash the key]

    D --> E{In Redis cache?}

    E -->|Yes| F[Get cached key data]
    E -->|No| G[Query PostgreSQL]

    G --> H{Key exists?}
    H -->|No| I[401: API key not found]
    H -->|Yes| J[Cache in Redis]
    J --> F

    F --> K{Key revoked?}
    K -->|Yes| L[401: API key revoked]
    K -->|No| M{Key expired?}

    M -->|Yes| N[401: API key expired]
    M -->|No| O{Has permission?}

    O -->|No| P[403: Insufficient permissions]
    O -->|Yes| Q[Allow request]

    Q --> R[Update last_used_at]
    R --> S[Continue to handler]
```

---

## Authorization Model

### Role-Based Access Control (RBAC)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          RBAC Permission Matrix                              │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────────┐
    │                              Roles                                       │
    │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
    │  │    Admin    │    │  Developer  │    │   Viewer    │                 │
    │  │             │    │             │    │             │                 │
    │  │  Full       │    │  API Keys   │    │  Read-only  │                 │
    │  │  Access     │    │  Analytics  │    │  Access     │                 │
    │  └─────────────┘    └─────────────┘    └─────────────┘                 │
    └─────────────────────────────────────────────────────────────────────────┘

    Permission Table:
    ┌────────────────────┬───────────┬───────────┬───────────┐
    │ Resource           │   Admin   │ Developer │  Viewer   │
    ├────────────────────┼───────────┼───────────┼───────────┤
    │ Users - Read       │     ✓     │     -     │     -     │
    │ Users - Write      │     ✓     │     -     │     -     │
    │ Users - Delete     │     ✓     │     -     │     -     │
    ├────────────────────┼───────────┼───────────┼───────────┤
    │ API Keys - Read    │     ✓     │  Own only │  Own only │
    │ API Keys - Create  │     ✓     │     ✓     │     -     │
    │ API Keys - Revoke  │     ✓     │  Own only │     -     │
    ├────────────────────┼───────────┼───────────┼───────────┤
    │ APIs - Read        │     ✓     │     ✓     │     ✓     │
    │ APIs - Write       │     ✓     │     -     │     -     │
    │ APIs - Delete      │     ✓     │     -     │     -     │
    ├────────────────────┼───────────┼───────────┼───────────┤
    │ Analytics - Read   │     ✓     │  Own only │  Own only │
    │ Analytics - Export │     ✓     │     ✓     │     -     │
    ├────────────────────┼───────────┼───────────┼───────────┤
    │ Rate Limits - Read │     ✓     │     ✓     │     ✓     │
    │ Rate Limits - Write│     ✓     │     -     │     -     │
    └────────────────────┴───────────┴───────────┴───────────┘
```

### Mermaid RBAC Diagram

```mermaid
graph TD
    subgraph Roles
        A[Admin]
        D[Developer]
        V[Viewer]
    end

    subgraph Permissions
        P1[users:read]
        P2[users:write]
        P3[keys:read]
        P4[keys:write]
        P5[keys:revoke]
        P6[apis:read]
        P7[apis:write]
        P8[analytics:read]
        P9[analytics:export]
        P10[rate-limits:write]
    end

    A --> P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9 & P10
    D --> P3 & P4 & P6 & P8 & P9
    V --> P3 & P6 & P8

    style A fill:#ff6b6b
    style D fill:#4ecdc4
    style V fill:#95a5a6
```

---

## Security Headers

### HTTP Security Headers Configuration

```
┌─────────────────────────────────────────────────────────────┐
│              Security Headers Configuration                  │
└─────────────────────────────────────────────────────────────┘

Response Headers:
═════════════════

┌─────────────────────────────────────────────────────────────┐
│ Strict-Transport-Security: max-age=31536000; includeSubDomains │
│ ───────────────────────────────────────────────────────────  │
│ Enforces HTTPS for 1 year, including subdomains              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ X-Content-Type-Options: nosniff                              │
│ ───────────────────────────────────────────────────────────  │
│ Prevents MIME type sniffing                                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ X-Frame-Options: DENY                                        │
│ ───────────────────────────────────────────────────────────  │
│ Prevents clickjacking by denying framing                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ Content-Security-Policy: default-src 'none'                  │
│ ───────────────────────────────────────────────────────────  │
│ API responses should not execute scripts                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ X-Request-ID: uuid-v4                                        │
│ ───────────────────────────────────────────────────────────  │
│ Request tracing for debugging and audit                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Rate Limiting Security

### Rate Limit Headers

```
Rate Limit Response Headers:
═══════════════════════════

┌─────────────────────────────────────────────────────────────┐
│ X-RateLimit-Limit: 1000                                      │
│ ───────────────────────────────────────────────────────────  │
│ Maximum requests allowed in the window                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ X-RateLimit-Remaining: 950                                   │
│ ───────────────────────────────────────────────────────────  │
│ Requests remaining in current window                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ X-RateLimit-Reset: 1706500000                                │
│ ───────────────────────────────────────────────────────────  │
│ Unix timestamp when the window resets                        │
└─────────────────────────────────────────────────────────────┘

When Rate Limited (429):
┌─────────────────────────────────────────────────────────────┐
│ Retry-After: 30                                              │
│ ───────────────────────────────────────────────────────────  │
│ Seconds to wait before retrying                              │
└─────────────────────────────────────────────────────────────┘
```

### Mermaid Rate Limit Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Gateway
    participant R as Redis
    participant U as Upstream

    C->>G: Request with API Key
    G->>R: INCR ratelimit:{key}:{window}
    R-->>G: Current count: 950

    alt Under Limit
        G->>G: Add rate limit headers
        G->>U: Forward request
        U-->>G: Response
        G-->>C: 200 OK + Rate Headers
    else Over Limit
        G-->>C: 429 Too Many Requests + Retry-After
    end

    Note over G,R: Rate limit check adds ~1ms latency
```

---

## Data Encryption

### Encryption at Rest and in Transit

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Encryption Architecture                              │
└─────────────────────────────────────────────────────────────────────────────┘

    In Transit (TLS 1.3)
    ════════════════════

    ┌──────────┐         TLS 1.3          ┌──────────┐
    │  Client  │ ◄═══════════════════════► │ Gateway  │
    └──────────┘                           └──────────┘
                    • ECDHE key exchange
                    • AES-256-GCM encryption
                    • SHA-384 integrity

    At Rest (AES-256)
    ═════════════════

    ┌─────────────────────────────────────────────────────────────┐
    │  PostgreSQL                                                  │
    │  ─────────────────────────────────────────────────────────  │
    │  • Transparent Data Encryption (TDE)                         │
    │  • AWS RDS encryption enabled                                │
    │  • KMS-managed encryption keys                               │
    └─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────┐
    │  Redis                                                       │
    │  ─────────────────────────────────────────────────────────  │
    │  • TLS for in-transit                                        │
    │  • Elasticache encryption at-rest                           │
    └─────────────────────────────────────────────────────────────┘

    Sensitive Data Handling
    ═══════════════════════

    ┌─────────────────────────────────────────────────────────────┐
    │  Passwords                                                   │
    │  ─────────────────────────────────────────────────────────  │
    │  • bcrypt with cost factor 12                               │
    │  • Never stored in plain text                               │
    │  • Compared using timing-safe comparison                    │
    └─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────┐
    │  API Keys                                                    │
    │  ─────────────────────────────────────────────────────────  │
    │  • SHA-256 hash stored                                      │
    │  • Raw key shown once, never stored                         │
    │  • Key prefix (dh_live_) not included in hash              │
    └─────────────────────────────────────────────────────────────┘
```

---

## Audit Logging

### Security Audit Events

```mermaid
flowchart LR
    subgraph Events["Security Events"]
        E1[Login Success]
        E2[Login Failure]
        E3[Token Refresh]
        E4[API Key Created]
        E5[API Key Revoked]
        E6[Permission Change]
        E7[Rate Limit Hit]
    end

    subgraph Processing["Event Processing"]
        P1[Add Metadata]
        P2[Timestamp]
        P3[User Context]
        P4[IP Address]
    end

    subgraph Storage["Audit Storage"]
        S1[(TimescaleDB)]
        S2[CloudWatch Logs]
        S3[SIEM Integration]
    end

    E1 & E2 & E3 & E4 & E5 & E6 & E7 --> P1
    P1 --> P2 --> P3 --> P4
    P4 --> S1 & S2
    S1 --> S3
```

### Audit Log Schema

```sql
-- Audit log entry structure
{
  "event_id": "uuid",
  "event_type": "AUTH_LOGIN_SUCCESS",
  "timestamp": "2024-01-29T12:00:00Z",
  "actor": {
    "user_id": "user_123",
    "email": "user@example.com",
    "role": "developer",
    "ip_address": "192.168.1.1"
  },
  "resource": {
    "type": "session",
    "id": "session_456"
  },
  "metadata": {
    "user_agent": "DataHub-SDK/1.0.0",
    "request_id": "req_789"
  }
}
```

---

## Security Checklist

| Category | Control | Status |
|----------|---------|--------|
| Authentication | JWT with RS256 signing | Implemented |
| Authentication | API key with SHA-256 hashing | Implemented |
| Authentication | Refresh token rotation | Implemented |
| Authorization | Role-based access control | Implemented |
| Authorization | Resource-level permissions | Implemented |
| Encryption | TLS 1.3 in transit | Implemented |
| Encryption | AES-256 at rest | Implemented |
| Rate Limiting | Per-key rate limits | Implemented |
| Rate Limiting | Sliding window algorithm | Implemented |
| Logging | Security audit trail | Implemented |
| Headers | HSTS, CSP, X-Frame-Options | Implemented |

---

## Related Documentation

- [Authentication Flow](../flows/authentication-flow.md) - Detailed auth flows
- [API Authentication](../api/authentication.md) - API auth documentation
- [Error Codes](../api/error-codes.md) - Security error codes
- [Environment Variables](../environments/environment-variables.md) - Security configuration
