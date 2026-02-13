# ShopFlow Authentication

## Overview

Authentication flows and security for the ShopFlow e-commerce API.

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant DB as Database
    participant R as Redis

    C->>A: POST /auth/login
    A->>DB: Verify Credentials
    DB-->>A: User Record
    A->>A: Generate Tokens
    A->>R: Store Refresh Token
    A-->>C: Access + Refresh Tokens

    C->>A: GET /api/cart (with Access Token)
    A->>A: Verify JWT
    A-->>C: Cart Data

    Note over C,A: Token Expires

    C->>A: POST /auth/refresh
    A->>R: Verify Refresh Token
    R-->>A: Valid
    A->>A: Generate New Access Token
    A-->>C: New Access Token
```

---

## Registration

### Register New User

```
POST /auth/register
```

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "firstName": "John",
  "lastName": "Doe",
  "acceptTerms": true,
  "marketingOptIn": false
}
```

**Response:**

```json
{
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2024-01-20T10:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "rt_xyz789abc123",
  "expiresIn": 604800
}
```

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## Login

### Email/Password Login

```
POST /auth/login
```

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123"
}
```

**Response:**

```json
{
  "user": {
    "id": "usr_abc123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "rt_xyz789abc123",
  "expiresIn": 604800
}
```

### Social Login

```mermaid
flowchart LR
    subgraph Providers["OAuth Providers"]
        GOOGLE[Google]
        APPLE[Apple]
        FACEBOOK[Facebook]
    end

    CLIENT[Client] --> Providers
    Providers --> API[ShopFlow API]
    API --> DB[(Database)]
```

#### Google OAuth

```
GET /auth/google
```

Redirects to Google OAuth consent screen.

```
GET /auth/google/callback
```

Handles OAuth callback and returns tokens.

---

## Token Management

### Access Token

- JWT format
- 7-day expiration
- Contains user ID and email
- Used in Authorization header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### JWT Payload Structure

```json
{
  "sub": "usr_abc123",
  "email": "user@example.com",
  "role": "customer",
  "iat": 1705750800,
  "exp": 1706355600
}
```

### Refresh Token

```
POST /auth/refresh
```

**Request:**

```json
{
  "refreshToken": "rt_xyz789abc123"
}
```

**Response:**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": 604800
}
```

### Token Rotation

```mermaid
stateDiagram-v2
    [*] --> Active: Login
    Active --> Expired: 7 days
    Active --> Refreshed: Refresh Token
    Refreshed --> Active: New Access Token
    Expired --> [*]: Re-login Required
```

---

## Logout

```
POST /auth/logout
```

**Request:**

```json
{
  "refreshToken": "rt_xyz789abc123"
}
```

Invalidates the refresh token.

---

## Password Reset

### Request Reset

```
POST /auth/forgot-password
```

**Request:**

```json
{
  "email": "user@example.com"
}
```

### Reset Password

```
POST /auth/reset-password
```

**Request:**

```json
{
  "token": "reset_token_from_email",
  "password": "NewSecureP@ss456"
}
```

---

## Email Verification

### Request Verification

```
POST /auth/verify-email/send
```

### Verify Email

```
POST /auth/verify-email
```

**Request:**

```json
{
  "token": "verification_token_from_email"
}
```

---

## Admin Authentication

Admin users have elevated permissions for back-office operations.

### Admin Login

```
POST /admin/auth/login
```

**Request:**

```json
{
  "email": "admin@shopflow.io",
  "password": "AdminP@ss123",
  "mfaCode": "123456"
}
```

### MFA Requirement

```mermaid
flowchart TD
    LOGIN[Admin Login] --> MFA{MFA Enabled?}
    MFA -->|No| TOKEN[Issue Token]
    MFA -->|Yes| CODE[Request MFA Code]
    CODE --> VERIFY{Code Valid?}
    VERIFY -->|Yes| TOKEN
    VERIFY -->|No| REJECT[Reject Login]
```

---

## Security Best Practices

### For API Consumers

- Store tokens securely (httpOnly cookies or secure storage)
- Never expose tokens in URLs
- Implement token refresh before expiration
- Clear tokens on logout

### Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/auth/login` | 5 per minute |
| `/auth/register` | 3 per minute |
| `/auth/forgot-password` | 3 per hour |

### Brute Force Protection

- Account lockout after 5 failed attempts
- 15-minute lockout duration
- Progressive delay on repeated failures

---

## Error Responses

### Invalid Credentials

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email or password is incorrect"
  }
}
```

### Account Locked

```json
{
  "error": {
    "code": "ACCOUNT_LOCKED",
    "message": "Account locked due to too many failed attempts",
    "details": {
      "unlockAt": "2024-01-20T10:15:00Z"
    }
  }
}
```

### Token Expired

```json
{
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Access token has expired"
  }
}
```

---

## Related Documents

- [API Reference](./reference.md)
- [Error Codes](./error-codes.md)
- [cURL Examples](./curl-examples.md)
