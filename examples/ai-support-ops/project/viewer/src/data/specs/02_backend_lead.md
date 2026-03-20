# Backend Lead Spec - AI Support Ops

## Architecture Overview
```text
Clients -> Fastify API -> Controllers -> Services -> Repositories -> PostgreSQL
                                   |-> Redis cache
                                   |-> BullMQ workers
                                   |-> S3 object storage
                                   `-> External CRM/Billing/Incident webhooks
```

## Stack
| Area | Choice |
| --- | --- |
| Runtime | Node.js 22 + TypeScript |
| Framework | Fastify |
| Validation | Zod |
| ORM | Prisma for core CRUD plus SQL for search-heavy queries |
| Queue | BullMQ on Redis |
| Auth | SAML SSO plus JWT access and refresh sessions |
| Testing | Vitest + Supertest |

## Service Boundaries
- `auth-service`: login, SSO callback, refresh, role sync, MFA policy.
- `ticket-service`: intake, merge/split, assignment, status transitions, timeline.
- `routing-service`: classification, queue assignment, SLA timers, breach risk.
- `ai-service`: prompt execution, telemetry envelope, citation packaging, policy checks.
- `knowledge-service`: article approval, macro retrieval, freshness flags.
- `automation-service`: rule evaluation, dry-run mode, loop protection, webhook execution.
- `analytics-service`: aggregates SLA, QA, AI acceptance, and export jobs.

## API Contracts
| Method | Path | Auth | Purpose | Success |
| --- | --- | --- | --- | --- |
| GET | /health | none | Liveness check | 200 |
| POST | /api/v1/auth/login | public | Password login | 200 |
| POST | /api/v1/auth/refresh | refresh cookie | Renew access token | 200 |
| GET | /api/v1/queues | user | List visible queues | 200 |
| POST | /api/v1/tickets/intake | api key | Ingest external ticket | 202 |
| GET | /api/v1/tickets | user | Filtered ticket list | 200 |
| POST | /api/v1/tickets | user | Manual ticket create | 201 |
| GET | /api/v1/tickets/:id | user | Ticket detail and timeline | 200 |
| POST | /api/v1/tickets/:id/draft | user | Create grounded summary or reply draft | 200 |
| POST | /api/v1/tickets/:id/approve-reply | manager | Approve or reject outbound draft | 200 |
| POST | /api/v1/tickets/:id/escalate | user | Move ticket to specialist queue | 200 |
| GET | /api/v1/knowledge/articles | user | Search approved knowledge | 200 |
| POST | /api/v1/knowledge/articles | manager | Create or update article draft | 201 |
| POST | /api/v1/rules/dry-run | analyst | Simulate automation rules | 200 |
| GET | /api/v1/analytics/overview | manager | Dashboard aggregates | 200 |
| GET | /api/v1/audit/events | auditor | Immutable audit stream | 200 |
| POST | /api/v1/qa/reviews | manager | Submit QA scorecard | 201 |

## Representative JSON
```json
POST /api/v1/tickets/:id/draft
{
  "mode": "reply",
  "intent": "refund-policy-question",
  "language": "en",
  "requestedBy": "user_123"
}

200 OK
{
  "draftId": "drf_891",
  "state": "draft",
  "model": "gpt-5.3",
  "confidence": "medium",
  "warnings": ["refund approval required"],
  "sources": [
    {"articleId": "kb_44", "title": "Refund Exceptions", "version": 7}
  ]
}
```

## Auth Flow
- Access token: 15 minutes, bearer token.
- Refresh token: 7 days, httpOnly cookie bound to tenant and device.
- SAML callback exchanges identity for local session and RBAC claims.
- Sensitive actions re-check session age and role.

## Error Handling
| Code | HTTP | Meaning |
| --- | --- | --- |
| AUTH_401_INVALID | 401 | Login or token invalid |
| AUTH_403_ROLE | 403 | Role lacks permission |
| TICKET_409_TRANSITION | 409 | Invalid ticket state change |
| AI_422_POLICY_BLOCK | 422 | Draft blocked by policy gate |
| RULE_409_RECURSION | 409 | Automation loop prevented |
| RATE_429_LIMIT | 429 | Rate limit exceeded |

## Middleware Order
1. request id
2. tenant resolution
3. auth/session decode
4. RBAC guard
5. rate limit
6. schema validation
7. controller
8. domain error mapper
9. audit log sink

## Rate Limits
- Login: 5 per minute per IP.
- Draft generation: 20 per minute per user, 60 per minute per tenant.
- Intake API: 120 per minute per tenant with idempotency keys.
- Analytics export: 10 per hour per manager.

## Copilot Routing
- gpt-5.4 handles service contracts, policy gates, security review, and tricky bugs.
- gpt-5.3 handles controllers, services, and integration work.
- gpt-5.2 handles boilerplate routes, schemas, fixtures, and straightforward tests.
