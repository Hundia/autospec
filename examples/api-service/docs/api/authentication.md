# DataHub Authentication

## Overview

DataHub API Gateway uses API key authentication for gateway access and JWT tokens for admin API access.

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Gateway
    participant R as Redis Cache
    participant DB as PostgreSQL

    C->>G: Request + X-API-Key header
    G->>R: Check key in cache

    alt Key in cache
        R-->>G: Key data (cached)
    else Key not cached
        G->>DB: Query key details
        DB-->>G: Key record
        G->>R: Cache key (5 min TTL)
    end

    G->>G: Validate key status
    G->>G: Check IP allowlist
    G->>G: Check origin allowlist

    alt Validation passed
        G-->>C: Process request
    else Validation failed
        G-->>C: 401 Unauthorized
    end
```

---

## API Key Authentication

### Key Format

DataHub API keys follow a structured format:

```
dh_{environment}_{type}_{random}

Examples:
- dh_prod_sk_live_a1b2c3d4e5f6g7h8
- dh_staging_sk_test_x9y8z7w6v5u4t3s2
- dh_dev_pk_test_m1n2o3p4q5r6s7t8
```

| Prefix | Description |
|--------|-------------|
| `dh_prod_sk_` | Production secret key |
| `dh_prod_pk_` | Production publishable key |
| `dh_staging_sk_` | Staging secret key |
| `dh_dev_sk_` | Development secret key |

### Using API Keys

Include the API key in the `X-API-Key` header:

```bash
curl https://gateway.datahub.io/api/proxy/users \
  -H "X-API-Key: dh_prod_sk_live_a1b2c3d4e5f6g7h8"
```

---

## Key Permissions

```mermaid
flowchart TB
    subgraph KeyTypes["API Key Types"]
        SK[Secret Key<br/>Full Access]
        PK[Publishable Key<br/>Limited Access]
    end

    subgraph Permissions["Permissions"]
        READ[Read Operations]
        WRITE[Write Operations]
        ADMIN[Admin Operations]
        PROXY[Proxy Requests]
    end

    SK --> READ
    SK --> WRITE
    SK --> ADMIN
    SK --> PROXY
    PK --> READ
    PK --> PROXY
```

### Permission Levels

| Permission | Secret Key | Publishable Key |
|------------|------------|-----------------|
| Proxy requests | Yes | Yes |
| Read analytics | Yes | Yes |
| Manage services | Yes | No |
| Manage keys | Yes | No |
| Access admin API | Yes | No |

---

## Admin API Authentication

The Admin API uses JWT tokens for authentication.

### Login Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as Admin API
    participant DB as PostgreSQL
    participant R as Redis

    U->>A: POST /auth/login (email, password)
    A->>DB: Verify credentials
    DB-->>A: User record
    A->>A: Generate JWT (15min)
    A->>A: Generate refresh token (7d)
    A->>R: Store refresh token
    A-->>U: { accessToken, refreshToken }
```

### JWT Token Structure

```json
{
  "header": {
    "alg": "RS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_abc123",
    "email": "admin@datahub.io",
    "role": "admin",
    "permissions": ["keys:read", "keys:write", "analytics:read"],
    "iat": 1705750800,
    "exp": 1705751700
  }
}
```

### Using JWT Tokens

```bash
# Login to get tokens
curl -X POST https://admin.datahub.io/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@datahub.io", "password": "secure-password"}'

# Use access token
curl https://admin.datahub.io/api/keys \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIs..."

# Refresh token
curl -X POST https://admin.datahub.io/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "rt_abc123xyz789"}'
```

---

## IP Allowlisting

Restrict API key usage to specific IP addresses or CIDR ranges.

### Configuration

```json
{
  "allowedIPs": [
    "203.0.113.10",
    "203.0.113.0/24",
    "2001:db8::/32"
  ]
}
```

### Validation Flow

```mermaid
flowchart TD
    REQ[Incoming Request] --> EXTRACT[Extract Client IP]
    EXTRACT --> CHECK{IP Allowlist<br/>Configured?}

    CHECK -->|No| ALLOW[Allow Request]
    CHECK -->|Yes| MATCH{IP Matches<br/>Allowlist?}

    MATCH -->|Yes| ALLOW
    MATCH -->|No| DENY[Deny Request<br/>403 Forbidden]
```

---

## Origin Validation

Restrict API key usage to specific domains (CORS).

### Configuration

```json
{
  "allowedOrigins": [
    "https://app.example.com",
    "https://*.example.com"
  ]
}
```

---

## Security Best Practices

### Key Rotation

```mermaid
flowchart LR
    subgraph Rotation["Key Rotation Process"]
        CREATE[Create New Key] --> DEPLOY[Deploy to App]
        DEPLOY --> VERIFY[Verify Working]
        VERIFY --> REVOKE[Revoke Old Key]
    end
```

1. Create a new API key
2. Deploy the new key to your application
3. Verify the new key is working
4. Revoke the old key

### Environment Separation

| Environment | Key Prefix | Usage |
|-------------|------------|-------|
| Development | `dh_dev_` | Local testing |
| Staging | `dh_staging_` | Pre-production |
| Production | `dh_prod_` | Live traffic |

### Secret Storage

- Never commit API keys to version control
- Use environment variables or secret managers
- Rotate keys regularly (90-day recommendation)
- Monitor key usage for anomalies

---

## Token Expiration

| Token Type | Expiration | Refresh |
|------------|------------|---------|
| Access Token | 15 minutes | Use refresh token |
| Refresh Token | 7 days | Re-authenticate |
| API Key | No expiration | Manual rotation |

---

## Related Documents

- [API Reference](./reference.md)
- [Error Codes](./error-codes.md)
- [Rate Limiting](./rate-limiting.md)
