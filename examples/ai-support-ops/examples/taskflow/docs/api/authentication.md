# TaskFlow API Authentication

## Overview

TaskFlow uses JWT (JSON Web Token) based authentication. Access tokens are short-lived and must be refreshed using refresh tokens.

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant C as Client
    participant API as TaskFlow API
    participant DB as Database

    C->>API: POST /auth/login
    API->>DB: Validate credentials
    DB-->>API: User data
    API-->>C: Access Token + Refresh Token

    Note over C,API: Later requests...

    C->>API: GET /tasks (with access token)
    API->>API: Validate token
    API-->>C: Task data

    Note over C,API: When access token expires...

    C->>API: POST /auth/refresh
    API->>API: Validate refresh token
    API-->>C: New Access Token
```

---

## Token Types

| Token | Lifetime | Storage | Purpose |
|-------|----------|---------|---------|
| Access Token | 1 hour | Memory/State | API authentication |
| Refresh Token | 30 days | HTTP-only cookie | Token refresh |

---

## Authentication Endpoints

### Register User

Create a new user account.

```
POST /auth/register
```

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_abc123",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

**curl Example:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "name": "John Doe"
  }'
```

---

### Login

Authenticate and receive tokens.

```
POST /auth/login
```

**Request:**

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_abc123",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyX2FiYzEyMyIsImlhdCI6MTcwNTMxMjIwMCwiZXhwIjoxNzA1MzE1ODAwfQ.abc123",
    "expiresIn": 3600
  }
}
```

**Note:** Refresh token is set as HTTP-only cookie.

**curl Example:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'
```

---

### Refresh Token

Get a new access token using refresh token.

```
POST /auth/refresh
```

**Request:** No body required. Refresh token is read from cookie.

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": 3600
  }
}
```

**curl Example:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -c cookies.txt
```

---

### Logout

Invalidate the current session.

```
POST /auth/logout
```

**Headers:**

```http
Authorization: Bearer <access_token>
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**curl Example:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -b cookies.txt
```

---

### Get Current User

Get the authenticated user's information.

```
GET /auth/me
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "user_abc123",
    "email": "user@example.com",
    "name": "John Doe",
    "avatar": "https://...",
    "createdAt": "2024-01-15T10:30:00Z",
    "lastLoginAt": "2024-01-15T14:00:00Z"
  }
}
```

**curl Example:**

```bash
curl http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

### Forgot Password

Request a password reset email.

```
POST /auth/forgot-password
```

**Request:**

```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "If the email exists, a reset link has been sent"
}
```

**Note:** Response is always successful to prevent email enumeration.

**curl Example:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

---

### Reset Password

Reset password using token from email.

```
POST /auth/reset-password
```

**Request:**

```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePassword123!"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Password has been reset successfully"
}
```

**curl Example:**

```bash
curl -X POST http://localhost:3001/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "abc123def456",
    "password": "NewSecurePassword123!"
  }'
```

---

## Using Authentication

### Authorization Header

Include the access token in all authenticated requests:

```http
GET /api/v1/tasks HTTP/1.1
Host: api.taskflow.app
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Token Structure

Access tokens are JWTs with the following payload:

```json
{
  "userId": "user_abc123",
  "email": "user@example.com",
  "iat": 1705312200,
  "exp": 1705315800
}
```

### Token Validation

```mermaid
flowchart TD
    REQ[Request with Token] --> CHECK{Token Present?}
    CHECK -->|No| E401[401 Unauthorized]
    CHECK -->|Yes| VERIFY{Valid Signature?}
    VERIFY -->|No| E401
    VERIFY -->|Yes| EXPIRE{Expired?}
    EXPIRE -->|Yes| E401
    EXPIRE -->|No| PROCESS[Process Request]
```

---

## Error Responses

### Invalid Credentials

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

### Token Expired

```json
{
  "success": false,
  "error": {
    "code": "TOKEN_EXPIRED",
    "message": "Access token has expired"
  }
}
```

### Token Invalid

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Invalid or malformed token"
  }
}
```

---

## Client Implementation

### JavaScript Example

```javascript
// Authentication service
class AuthService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.accessToken = null;
  }

  async login(email, password) {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Include cookies
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
      this.accessToken = data.data.accessToken;
      this.scheduleTokenRefresh(data.data.expiresIn);
    }
    return data;
  }

  async refreshToken() {
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include'
    });

    const data = await response.json();
    if (data.success) {
      this.accessToken = data.data.accessToken;
      this.scheduleTokenRefresh(data.data.expiresIn);
    }
    return data;
  }

  scheduleTokenRefresh(expiresIn) {
    // Refresh 5 minutes before expiry
    const refreshTime = (expiresIn - 300) * 1000;
    setTimeout(() => this.refreshToken(), refreshTime);
  }

  getAuthHeader() {
    return this.accessToken
      ? { 'Authorization': `Bearer ${this.accessToken}` }
      : {};
  }
}
```

---

## Security Best Practices

### Token Storage

| Storage | Security | Recommendation |
|---------|----------|----------------|
| localStorage | Vulnerable to XSS | Not recommended |
| sessionStorage | Vulnerable to XSS | Not recommended |
| Memory | Secure, lost on refresh | Recommended |
| HTTP-only cookie | Secure | Recommended for refresh token |

### Security Headers

```http
# Response headers set by API
Set-Cookie: refresh_token=...; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

---

## Related Documents

- [API Reference](./reference.md)
- [Error Codes](./error-codes.md)
- [Rate Limiting](./rate-limiting.md)
