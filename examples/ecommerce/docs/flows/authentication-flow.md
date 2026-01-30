# ShopFlow Authentication Flow

## Overview

ShopFlow supports multiple authentication methods to provide a seamless user experience.

## Authentication Methods

### ASCII Auth Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AUTHENTICATION METHODS                               │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌───────────────┐    ┌───────────────┐    ┌───────────────┐
  │   Email/      │    │    Social     │    │    Magic      │
  │   Password    │    │    Login      │    │    Link       │
  └───────┬───────┘    └───────┬───────┘    └───────┬───────┘
          │                    │                    │
          │    ┌───────────────┼───────────────┐    │
          │    │               │               │    │
          ▼    ▼               ▼               ▼    ▼
       ┌──────────┐     ┌──────────┐     ┌──────────┐
       │  Google  │     │  Apple   │     │ Facebook │
       └──────────┘     └──────────┘     └──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Unified Session   │
                    │     Management      │
                    └─────────────────────┘
```

### Mermaid Auth Methods

```mermaid
graph TB
    subgraph Methods["Authentication Methods"]
        Email[Email/Password]
        Google[Google OAuth]
        Apple[Apple Sign In]
        Magic[Magic Link]
    end

    subgraph Process["Authentication Process"]
        Validate[Validate Credentials]
        CreateSession[Create Session]
        IssueTokens[Issue JWT Tokens]
    end

    subgraph Storage["Token Storage"]
        AccessToken[Access Token - Memory]
        RefreshToken[Refresh Token - HttpOnly Cookie]
    end

    Email --> Validate
    Google --> Validate
    Apple --> Validate
    Magic --> Validate

    Validate --> CreateSession
    CreateSession --> IssueTokens
    IssueTokens --> AccessToken
    IssueTokens --> RefreshToken
```

## Email/Password Authentication

### Registration Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Database
    participant Email Service

    User->>Frontend: Fill registration form
    Frontend->>Frontend: Client-side validation
    Frontend->>API: POST /auth/register
    API->>API: Validate input (Zod)
    API->>Database: Check email exists
    Database-->>API: Email available

    API->>API: Hash password (bcrypt)
    API->>Database: Create user
    Database-->>API: User created

    API->>Email Service: Send verification email
    Email Service-->>User: Verification email

    API-->>Frontend: Success response
    Frontend->>User: Show verification message

    User->>Email Service: Click verification link
    Email Service->>API: GET /auth/verify?token=xxx
    API->>Database: Mark email verified
    API-->>User: Redirect to login
```

### Login Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Auth Service
    participant Database
    participant Redis

    User->>Frontend: Enter email/password
    Frontend->>API: POST /auth/login
    API->>Auth Service: Authenticate

    Auth Service->>Database: Find user by email
    Database-->>Auth Service: User record

    Auth Service->>Auth Service: Verify password (bcrypt)

    alt Password Valid
        Auth Service->>Auth Service: Generate access token (15min)
        Auth Service->>Auth Service: Generate refresh token (7d)
        Auth Service->>Redis: Store refresh token
        Auth Service-->>API: Tokens
        API-->>Frontend: Set cookies + return access token
        Frontend->>Frontend: Store access token in memory
        Frontend->>User: Redirect to dashboard
    else Password Invalid
        Auth Service-->>API: Invalid credentials
        API-->>Frontend: 401 Unauthorized
        Frontend->>User: Show error message
    end
```

## Social Login (OAuth 2.0)

### ASCII OAuth Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      OAUTH 2.0 FLOW                              │
└─────────────────────────────────────────────────────────────────┘

  User          ShopFlow         OAuth Provider       ShopFlow API
   │               │                   │                   │
   │  Click        │                   │                   │
   │  Login        │                   │                   │
   │──────────────▶│                   │                   │
   │               │                   │                   │
   │               │    Redirect       │                   │
   │◀──────────────│──────────────────▶│                   │
   │                                   │                   │
   │          Consent Screen           │                   │
   │◀─────────────────────────────────▶│                   │
   │                                   │                   │
   │          Auth Code                │                   │
   │◀──────────────────────────────────│                   │
   │                                   │                   │
   │  Code                             │                   │
   │──────────────────────────────────────────────────────▶│
   │                                   │                   │
   │                                   │   Exchange Code   │
   │                                   │◀─────────────────▶│
   │                                   │                   │
   │                                   │   User Profile    │
   │                                   │◀─────────────────▶│
   │                                   │                   │
   │            JWT Tokens                                 │
   │◀──────────────────────────────────────────────────────│
```

### Mermaid Google OAuth

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Google
    participant API
    participant Database

    User->>Frontend: Click "Sign in with Google"
    Frontend->>Google: Redirect to Google OAuth

    Google->>User: Show consent screen
    User->>Google: Grant permission
    Google->>Frontend: Redirect with auth code

    Frontend->>API: POST /auth/oauth/google
    Note over Frontend,API: { code: "auth_code_here" }

    API->>Google: Exchange code for tokens
    Google-->>API: Access token + ID token

    API->>Google: Get user profile
    Google-->>API: User info (email, name, picture)

    API->>Database: Find or create user
    alt New User
        Database-->>API: Create new account
        API->>API: Link Google account
    else Existing User
        Database-->>API: Return existing user
        API->>API: Link if not already linked
    end

    API->>API: Generate ShopFlow JWT
    API-->>Frontend: JWT tokens
    Frontend->>User: Logged in successfully
```

## Magic Link Authentication

### Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Redis
    participant Email Service

    User->>Frontend: Enter email
    Frontend->>API: POST /auth/magic-link
    API->>API: Generate secure token
    API->>Redis: Store token (15min TTL)
    API->>Email Service: Send magic link email
    Email Service-->>User: Magic link email

    API-->>Frontend: Check your email

    User->>Email Service: Click magic link
    Email Service->>API: GET /auth/magic-link/verify?token=xxx
    API->>Redis: Validate token
    Redis-->>API: Token valid

    API->>Redis: Delete token (one-time use)
    API->>API: Generate JWT tokens
    API-->>User: Set cookies, redirect to app
```

## Token Management

### ASCII Token Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                      TOKEN LIFECYCLE                             │
└─────────────────────────────────────────────────────────────────┘

  Access Token (15min)                 Refresh Token (7 days)
  ┌─────────────────┐                 ┌─────────────────┐
  │  Short-lived    │                 │  Long-lived     │
  │  In memory      │                 │  HttpOnly cookie│
  │  API requests   │                 │  Token rotation │
  └────────┬────────┘                 └────────┬────────┘
           │                                   │
           │         Expired?                  │
           ▼                                   │
  ┌─────────────────┐                          │
  │   API returns   │                          │
  │      401        │──────────────────────────┘
  └────────┬────────┘                          │
           │                                   │
           │      Use refresh token            │
           ▼                                   ▼
  ┌─────────────────────────────────────────────────────────────┐
  │              POST /auth/refresh                              │
  │              Get new access token                            │
  └─────────────────────────────────────────────────────────────┘
```

### Mermaid Token Refresh

```mermaid
sequenceDiagram
    participant Frontend
    participant API
    participant Auth Service
    participant Redis

    Frontend->>API: Request with expired access token
    API-->>Frontend: 401 Unauthorized

    Frontend->>API: POST /auth/refresh
    Note over Frontend,API: Refresh token in HttpOnly cookie

    API->>Auth Service: Validate refresh token
    Auth Service->>Redis: Check token exists
    Redis-->>Auth Service: Token valid

    Auth Service->>Auth Service: Generate new access token
    Auth Service->>Auth Service: Rotate refresh token
    Auth Service->>Redis: Store new refresh token
    Auth Service->>Redis: Invalidate old refresh token

    Auth Service-->>API: New tokens
    API-->>Frontend: New access token + cookie

    Frontend->>Frontend: Retry original request
    Frontend->>API: Request with new access token
    API-->>Frontend: Success response
```

## Logout Flow

```mermaid
flowchart TD
    A[User clicks logout] --> B[Frontend clears access token]
    B --> C[POST /auth/logout]
    C --> D[API invalidates refresh token]
    D --> E[Clear all cookies]
    E --> F[Redis: Remove session]
    F --> G[Redirect to homepage]
```

## Password Reset

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant Redis
    participant Email

    User->>Frontend: Click "Forgot Password"
    Frontend->>Frontend: Show email form
    User->>Frontend: Enter email
    Frontend->>API: POST /auth/forgot-password

    API->>API: Generate reset token
    API->>Redis: Store token (1hr TTL)
    API->>Email: Send reset email
    API-->>Frontend: Check your email

    User->>Email: Click reset link
    Email->>Frontend: Open reset form

    User->>Frontend: Enter new password
    Frontend->>API: POST /auth/reset-password
    API->>Redis: Validate token
    API->>API: Hash new password
    API->>API: Update user password
    API->>Redis: Invalidate all sessions
    API-->>Frontend: Password updated
    Frontend->>User: Redirect to login
```

## Multi-Factor Authentication (MFA)

### MFA Setup Flow

```mermaid
stateDiagram-v2
    [*] --> NotEnabled: MFA Disabled

    NotEnabled --> Setup: User enables MFA
    Setup --> GenerateSecret: Generate TOTP secret
    GenerateSecret --> ShowQR: Display QR code
    ShowQR --> VerifyCode: User scans + enters code
    VerifyCode --> Enabled: Code valid
    VerifyCode --> ShowQR: Code invalid

    Enabled --> [*]: MFA Active

    state Enabled {
        [*] --> AwaitingCode
        AwaitingCode --> Verified: Valid TOTP
        Verified --> [*]
    }
```

## Security Headers

```typescript
// Authentication response headers
{
  "Set-Cookie": "refresh_token=xxx; HttpOnly; Secure; SameSite=Strict; Path=/api/auth",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains"
}
```

## Session Security

| Feature | Implementation |
|---------|---------------|
| Token Storage | Access in memory, refresh in HttpOnly cookie |
| Token Rotation | New refresh token on each use |
| Session Limit | Max 5 active sessions per user |
| Device Tracking | Track device/browser for sessions |
| Suspicious Activity | Flag unusual login locations |
| Brute Force Protection | Rate limit + account lockout |
