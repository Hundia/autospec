# Authentication API

## Login
`POST /api/v1/auth/login`
- Accepts email and password.
- Returns access token plus refresh cookie.
- Records login audit event.

## Refresh
`POST /api/v1/auth/refresh`
- Rotates refresh token.
- Reissues access token with current role claims.

## Logout
`POST /api/v1/auth/logout`
- Revokes refresh session.
- Clears client auth state.

## Enterprise Notes
- SAML callback maps groups to local roles.
- MFA policy applies to admin and manager sessions.
