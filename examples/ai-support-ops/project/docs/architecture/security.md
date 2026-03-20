# Security Architecture

## Auth Flow
```text
Login or SSO -> session issue -> access token -> request with tenant claims
-> role check -> resource access -> refresh if access token expires -> logout revokes refresh session
```

## Authorization
RBAC roles: admin, manager, analyst, agent, auditor, readonly. Queue visibility and sensitive action checks are enforced in services, not only UI.

## Validation and Hardening
- Zod validates all input at route boundary.
- Parameterized SQL and Prisma prevent injection.
- CSP, secure cookies, CSRF checks on session endpoints, and strict CORS by tenant admin config.
- Secrets live in env or a secret manager with quarterly rotation.
- TLS in transit and encrypted managed storage at rest.

## AI Safety Controls
- High-risk drafts require planner and policy gate before approval.
- Queues can disable AI per action type.
- Sensitive fields can be excluded from retrieval and prompt context.
