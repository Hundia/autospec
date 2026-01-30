# TaskFlow Authentication Flow

## Overview

TaskFlow uses JWT-based authentication with access tokens (1 hour) and refresh tokens (7 days).

## Registration Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant DB as Database

    U->>F: Fill registration form
    F->>F: Client-side validation
    F->>A: POST /api/v1/auth/register
    Note over A: {email, password, name}

    A->>A: Validate with Zod schema
    A->>DB: Check email exists
    DB-->>A: Not found

    A->>A: Hash password (bcrypt, 12 rounds)
    A->>DB: INSERT INTO users

    DB-->>A: User record created
    A->>A: Generate access token (1h)
    A->>A: Generate refresh token (7d)

    A-->>F: 201 Created
    Note over F: {user, accessToken, refreshToken}

    F->>F: Store tokens
    F->>F: Update auth state
    F->>U: Redirect to Dashboard
```

### ASCII Flow

```
REGISTRATION FLOW
═════════════════

User                   Frontend                  API                    Database
 │                        │                       │                        │
 │  Fill form             │                       │                        │
 │───────────────────────>│                       │                        │
 │                        │                       │                        │
 │                        │  Validate locally     │                        │
 │                        │  ─────────────────    │                        │
 │                        │                       │                        │
 │                        │  POST /auth/register  │                        │
 │                        │──────────────────────>│                        │
 │                        │                       │                        │
 │                        │                       │  Check email unique    │
 │                        │                       │───────────────────────>│
 │                        │                       │<───────────────────────│
 │                        │                       │                        │
 │                        │                       │  Hash password         │
 │                        │                       │  ───────────────       │
 │                        │                       │                        │
 │                        │                       │  INSERT user           │
 │                        │                       │───────────────────────>│
 │                        │                       │<───────────────────────│
 │                        │                       │                        │
 │                        │                       │  Generate tokens       │
 │                        │                       │  ────────────────      │
 │                        │                       │                        │
 │                        │  201 {user, tokens}   │                        │
 │                        │<──────────────────────│                        │
 │                        │                       │                        │
 │                        │  Store tokens         │                        │
 │                        │  Update auth state    │                        │
 │                        │  ─────────────────    │                        │
 │                        │                       │                        │
 │  Redirect to Dashboard │                       │                        │
 │<───────────────────────│                       │                        │
```

---

## Login Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant DB as Database

    U->>F: Enter email & password
    F->>F: Client-side validation
    F->>A: POST /api/v1/auth/login
    Note over A: {email, password}

    A->>A: Validate with Zod schema
    A->>DB: SELECT user WHERE email
    DB-->>A: User record

    alt User not found
        A-->>F: 401 Invalid credentials
        F->>U: Show error message
    else User found
        A->>A: Compare password (bcrypt)
        alt Password incorrect
            A-->>F: 401 Invalid credentials
            F->>U: Show error message
        else Password correct
            A->>A: Generate access token (1h)
            A->>A: Generate refresh token (7d)
            A-->>F: 200 OK
            Note over F: {user, accessToken, refreshToken}
            F->>F: Store tokens
            F->>F: Update auth state
            F->>U: Redirect to Dashboard
        end
    end
```

---

## Token Refresh Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant F as Frontend
    participant A as API

    Note over F: Access token expired

    F->>A: POST /api/v1/auth/refresh
    Note over A: {refreshToken}

    A->>A: Verify refresh token signature
    A->>A: Check token expiry
    A->>A: Extract userId from token

    alt Refresh token valid
        A->>A: Generate new access token
        A-->>F: 200 OK {accessToken}
        F->>F: Store new access token
        F->>F: Retry failed request
    else Refresh token invalid/expired
        A-->>F: 401 Unauthorized
        F->>F: Clear tokens
        F->>F: Redirect to login
    end
```

### ASCII Flow

```
TOKEN REFRESH FLOW
══════════════════

Frontend                              API
   │                                   │
   │  Access token expired (401)       │
   │  ─────────────────────────        │
   │                                   │
   │  POST /auth/refresh               │
   │  {refreshToken: "xxx"}            │
   │──────────────────────────────────>│
   │                                   │
   │                                   │  Verify signature
   │                                   │  Check expiry
   │                                   │  Extract userId
   │                                   │  ────────────────
   │                                   │
   │          ┌────────────────────────┤
   │          │ VALID                  │
   │          │                        │
   │          │  Generate new token    │
   │          │  ──────────────────    │
   │          │                        │
   │  200 {accessToken: "new"}         │
   │<─────────┴────────────────────────│
   │                                   │
   │  Store new token                  │
   │  Retry failed request             │
   │  ────────────────────             │
   │                                   │
   │          ┌────────────────────────┤
   │          │ INVALID/EXPIRED        │
   │          │                        │
   │  401 Unauthorized                 │
   │<─────────┴────────────────────────│
   │                                   │
   │  Clear all tokens                 │
   │  Redirect to /login               │
   │  ─────────────────────            │
```

---

## Logout Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API

    U->>F: Click Logout button
    F->>A: POST /api/v1/auth/logout
    Note over A: Authorization: Bearer xxx

    A->>A: (Optional) Invalidate refresh token
    A-->>F: 200 OK {message: "Logged out"}

    F->>F: Clear access token
    F->>F: Clear refresh token
    F->>F: Clear auth state
    F->>F: Clear React Query cache
    F->>U: Redirect to landing page
```

---

## Password Reset Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant E as Email Service
    participant DB as Database

    U->>F: Click "Forgot Password"
    F->>U: Show email input form
    U->>F: Enter email
    F->>A: POST /api/v1/auth/forgot-password
    Note over A: {email}

    A->>DB: Find user by email

    alt User not found
        A-->>F: 200 OK (silent fail for security)
        F->>U: "If email exists, check inbox"
    else User found
        A->>A: Generate reset token (1 hour)
        A->>DB: Store reset token hash
        A->>E: Send reset email with link
        A-->>F: 200 OK
        F->>U: "If email exists, check inbox"
    end

    Note over U: User clicks email link

    U->>F: Visit /reset-password?token=xxx
    F->>U: Show new password form
    U->>F: Enter new password
    F->>A: POST /api/v1/auth/reset-password
    Note over A: {token, password}

    A->>DB: Find user by token hash
    A->>A: Verify token not expired
    A->>A: Hash new password
    A->>DB: Update password, clear token
    A-->>F: 200 OK
    F->>U: "Password reset. Please login."
```

---

## Session Management

### Token Storage Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        TOKEN STORAGE                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Access Token                      │  Refresh Token                      │
│  ────────────                      │  ─────────────                      │
│                                    │                                     │
│  Storage: Memory (Zustand)         │  Storage: localStorage              │
│  Lifetime: 1 hour                  │  Lifetime: 7 days                   │
│  Sent: Authorization header        │  Sent: Refresh endpoint body        │
│                                    │                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                                                                  │   │
│  │  Why memory for access token?                                    │   │
│  │  - More secure (no XSS access)                                   │   │
│  │  - Cleared on tab close                                          │   │
│  │  - Refresh token restores session                                │   │
│  │                                                                  │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Auto-Refresh Logic

```mermaid
flowchart TB
    A[API Request] --> B{Token Expired?}
    B -->|No| C[Add to Header]
    B -->|Yes| D[Token Refresh]
    D --> E{Refresh OK?}
    E -->|Yes| F[Store New Token]
    F --> C
    E -->|No| G[Logout User]
    C --> H[Send Request]
    H --> I{Response OK?}
    I -->|Yes| J[Return Data]
    I -->|401| K[Token Invalid]
    K --> D
    I -->|Other Error| L[Handle Error]

    style J fill:#10b981
    style G fill:#ef4444
```

---

## Auth State Machine

```mermaid
stateDiagram-v2
    [*] --> Unknown: App Start

    Unknown --> Loading: Check stored token
    Loading --> Authenticated: Valid refresh token
    Loading --> Unauthenticated: No/invalid token

    Unauthenticated --> Authenticating: Login/Register
    Authenticating --> Authenticated: Success
    Authenticating --> Unauthenticated: Failure

    Authenticated --> Refreshing: Access token expired
    Refreshing --> Authenticated: New token
    Refreshing --> Unauthenticated: Refresh failed

    Authenticated --> Unauthenticated: Logout
```

---

## Security Considerations

### Checklist

| Item | Status | Implementation |
|------|--------|----------------|
| Password hashing | Required | bcrypt, 12 rounds |
| JWT signing | Required | HS256 with secret |
| Token expiry | Required | 1h access, 7d refresh |
| Rate limiting | Required | 10 attempts / 15 min |
| HTTPS only | Required | TLS 1.3 |
| Secure headers | Required | helmet middleware |
| Input validation | Required | Zod schemas |
| Error messages | Required | Generic (no user enumeration) |
