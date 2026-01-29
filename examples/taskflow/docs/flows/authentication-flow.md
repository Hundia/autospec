# TaskFlow Authentication Flow

**Version:** 1.0
**Last Updated:** 2026-01-29

---

## 1. Authentication Overview

TaskFlow uses JWT-based authentication with HTTP-only cookies for secure token storage.

| Property | Value |
|----------|-------|
| Access Token Expiry | 15 minutes |
| Refresh Token Expiry | 7 days |
| Token Storage | HTTP-only cookies |
| Password Hashing | bcrypt (cost factor 12) |

---

## 2. Registration Flow

### Sequence Diagram

```
    ┌────────┐          ┌────────┐          ┌────────┐          ┌────────┐
    │ Client │          │  API   │          │Service │          │   DB   │
    └───┬────┘          └───┬────┘          └───┬────┘          └───┬────┘
        │                   │                   │                   │
        │ POST /auth/register                   │                   │
        │ {email, password, name}               │                   │
        │──────────────────►│                   │                   │
        │                   │                   │                   │
        │                   │ Validate schema   │                   │
        │                   │──────────────────►│                   │
        │                   │                   │                   │
        │                   │                   │ Check email exists│
        │                   │                   │──────────────────►│
        │                   │                   │                   │
        │                   │                   │◄──────────────────│
        │                   │                   │ null (not found)  │
        │                   │                   │                   │
        │                   │                   │ Hash password     │
        │                   │                   │ (bcrypt)          │
        │                   │                   │                   │
        │                   │                   │ INSERT user       │
        │                   │                   │──────────────────►│
        │                   │                   │                   │
        │                   │                   │◄──────────────────│
        │                   │                   │ user record       │
        │                   │                   │                   │
        │                   │                   │ Generate tokens   │
        │                   │                   │                   │
        │                   │◄──────────────────│                   │
        │                   │ {user, tokens}    │                   │
        │                   │                   │                   │
        │ Set-Cookie: accessToken (HttpOnly)    │                   │
        │ Set-Cookie: refreshToken (HttpOnly)   │                   │
        │ 201 {data: user}  │                   │                   │
        │◄──────────────────│                   │                   │
        │                   │                   │                   │
        │ Redirect to /dashboard                │                   │
        │                   │                   │                   │
```

### Request/Response

**Request:**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "alex@example.com",
  "password": "SecurePass123!",
  "name": "Alex Developer"
}
```

**Response (201 Created):**
```http
HTTP/1.1 201 Created
Set-Cookie: accessToken=eyJ...; HttpOnly; Secure; SameSite=Strict; Max-Age=900
Set-Cookie: refreshToken=eyJ...; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth; Max-Age=604800
Content-Type: application/json

{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "alex@example.com",
    "name": "Alex Developer",
    "createdAt": "2026-01-29T10:00:00.000Z"
  }
}
```

---

## 3. Login Flow

### Sequence Diagram

```
    ┌────────┐          ┌────────┐          ┌────────┐          ┌────────┐
    │ Client │          │  API   │          │Service │          │   DB   │
    └───┬────┘          └───┬────┘          └───┬────┘          └───┬────┘
        │                   │                   │                   │
        │ POST /auth/login  │                   │                   │
        │ {email, password} │                   │                   │
        │──────────────────►│                   │                   │
        │                   │                   │                   │
        │                   │ Validate schema   │                   │
        │                   │──────────────────►│                   │
        │                   │                   │                   │
        │                   │                   │ Find user by email│
        │                   │                   │──────────────────►│
        │                   │                   │                   │
        │                   │                   │◄──────────────────│
        │                   │                   │ user record       │
        │                   │                   │                   │
        │                   │                   │ Compare password  │
        │                   │                   │ bcrypt.compare()  │
        │                   │                   │                   │
        │                   │                   │ ✓ Password match  │
        │                   │                   │                   │
        │                   │                   │ Generate tokens   │
        │                   │                   │                   │
        │                   │                   │ Store refresh hash│
        │                   │                   │──────────────────►│
        │                   │                   │                   │
        │                   │◄──────────────────│                   │
        │                   │ {user, tokens}    │                   │
        │                   │                   │                   │
        │ Set-Cookie: accessToken               │                   │
        │ Set-Cookie: refreshToken              │                   │
        │ 200 {data: user}  │                   │                   │
        │◄──────────────────│                   │                   │
```

### Error Cases

**Invalid Credentials (401):**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

**Rate Limited (429):**
```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many login attempts. Try again in 60 seconds."
  }
}
```

---

## 4. Token Refresh Flow

### Sequence Diagram

```
    ┌────────┐          ┌────────┐          ┌────────┐          ┌────────┐
    │ Client │          │  API   │          │Service │          │   DB   │
    └───┬────┘          └───┬────┘          └───┬────┘          └───┬────┘
        │                   │                   │                   │
        │ POST /auth/refresh│                   │                   │
        │ Cookie: refreshToken                  │                   │
        │──────────────────►│                   │                   │
        │                   │                   │                   │
        │                   │ Extract refresh   │                   │
        │                   │ token from cookie │                   │
        │                   │──────────────────►│                   │
        │                   │                   │                   │
        │                   │                   │ Verify JWT        │
        │                   │                   │                   │
        │                   │                   │ Hash token        │
        │                   │                   │                   │
        │                   │                   │ Find in DB        │
        │                   │                   │──────────────────►│
        │                   │                   │                   │
        │                   │                   │◄──────────────────│
        │                   │                   │ token record      │
        │                   │                   │                   │
        │                   │                   │ Delete old token  │
        │                   │                   │──────────────────►│
        │                   │                   │                   │
        │                   │                   │ Generate new pair │
        │                   │                   │                   │
        │                   │                   │ Store new refresh │
        │                   │                   │──────────────────►│
        │                   │                   │                   │
        │                   │◄──────────────────│                   │
        │                   │ new tokens        │                   │
        │                   │                   │                   │
        │ Set-Cookie: accessToken (new)         │                   │
        │ Set-Cookie: refreshToken (new)        │                   │
        │ 200 OK            │                   │                   │
        │◄──────────────────│                   │                   │
```

### Token Rotation

Each refresh request:
1. Invalidates the old refresh token
2. Issues a new access token
3. Issues a new refresh token
4. This prevents token reuse attacks

---

## 5. Logout Flow

### Sequence Diagram

```
    ┌────────┐          ┌────────┐          ┌────────┐          ┌────────┐
    │ Client │          │  API   │          │Service │          │   DB   │
    └───┬────┘          └───┬────┘          └───┬────┘          └───┬────┘
        │                   │                   │                   │
        │ POST /auth/logout │                   │                   │
        │ Cookie: refreshToken                  │                   │
        │──────────────────►│                   │                   │
        │                   │                   │                   │
        │                   │ Extract user ID   │                   │
        │                   │──────────────────►│                   │
        │                   │                   │                   │
        │                   │                   │ Delete refresh    │
        │                   │                   │ tokens for user   │
        │                   │                   │──────────────────►│
        │                   │                   │                   │
        │                   │◄──────────────────│                   │
        │                   │                   │                   │
        │ Set-Cookie: accessToken=; Max-Age=0   │                   │
        │ Set-Cookie: refreshToken=; Max-Age=0  │                   │
        │ 200 OK            │                   │                   │
        │◄──────────────────│                   │                   │
        │                   │                   │                   │
        │ Redirect to /login│                   │                   │
```

---

## 6. Protected Route Access

### Middleware Flow

```
    ┌────────┐          ┌────────┐          ┌────────┐
    │ Client │          │  Auth  │          │  Route │
    │        │          │Middleware          │Handler │
    └───┬────┘          └───┬────┘          └───┬────┘
        │                   │                   │
        │ GET /api/v1/tasks │                   │
        │ Cookie: accessToken                   │
        │──────────────────►│                   │
        │                   │                   │
        │                   │ Extract token     │
        │                   │ from cookie       │
        │                   │                   │
        │                   │ Verify JWT        │
        │                   │ signature         │
        │                   │                   │
        │                   │ Check expiry      │
        │                   │                   │
        │                   │ Attach user to    │
        │                   │ req.user          │
        │                   │                   │
        │                   │ next()            │
        │                   │──────────────────►│
        │                   │                   │
        │                   │                   │ Process request
        │                   │                   │
        │◄──────────────────────────────────────│
        │ 200 {data: tasks} │                   │
```

### Access Token Expired

```
    ┌────────┐          ┌────────┐          ┌────────┐
    │ Client │          │  Auth  │          │ Axios  │
    │        │          │Middleware          │Intercept│
    └───┬────┘          └───┬────┘          └───┬────┘
        │                   │                   │
        │ GET /api/v1/tasks │                   │
        │ Cookie: accessToken (expired)         │
        │──────────────────►│                   │
        │                   │                   │
        │                   │ Verify JWT        │
        │                   │ ✗ Expired         │
        │                   │                   │
        │ 401 Unauthorized  │                   │
        │◄──────────────────│                   │
        │                   │                   │
        │ Interceptor catches 401               │
        │──────────────────────────────────────►│
        │                   │                   │
        │                   │                   │ POST /auth/refresh
        │                   │◄──────────────────│
        │                   │                   │
        │                   │ New tokens set    │
        │                   │──────────────────►│
        │                   │                   │
        │                   │                   │ Retry original
        │                   │                   │ request
        │                   │◄──────────────────│
        │                   │                   │
        │ 200 {data: tasks} │                   │
        │◄──────────────────────────────────────│
```

---

## 7. Token Payload Structure

### Access Token

```typescript
interface AccessTokenPayload {
  sub: string;        // User ID (UUID)
  email: string;      // User email
  iat: number;        // Issued at (Unix timestamp)
  exp: number;        // Expires at (Unix timestamp)
}
```

### Refresh Token

```typescript
interface RefreshTokenPayload {
  sub: string;        // User ID (UUID)
  jti: string;        // JWT ID (for token lookup)
  iat: number;        // Issued at
  exp: number;        // Expires at
}
```

---

## 8. Security Considerations

### Cookie Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| HttpOnly | true | Prevent XSS access |
| Secure | true (prod) | HTTPS only |
| SameSite | Strict | Prevent CSRF |
| Path | / (access), /api/v1/auth (refresh) | Limit scope |

### Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/register | 5 | 1 minute |
| POST /auth/login | 5 | 1 minute |
| POST /auth/refresh | 10 | 1 minute |

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one number
- Validated with Zod schema

---

## 9. Cross-References

- **Backend Implementation:** See `specs/02_backend_lead.md`
- **API Endpoints:** See `docs/api/reference.md`
- **Security Architecture:** See `docs/architecture/security.md` (future)
- **Curl Examples:** See `docs/api/curl-examples.md`

---

*This document is maintained by the Security team. Last updated: 2026-01-29*
