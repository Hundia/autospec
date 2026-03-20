# Authentication Flow

```text
Login page -> email/password or SSO -> identity verified -> session issued
-> access token stored in memory -> refresh cookie stored httpOnly
-> protected request -> role + tenant check -> response
-> logout clears refresh session and cached user state
```

- MFA policy applies to admin and manager roles.
- Session refresh rotates refresh token.
- SAML role mapping updates local role grants on login.
