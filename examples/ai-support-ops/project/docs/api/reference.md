# API Reference

## Conventions

- Base path: `/api/v1`
- Authenticated endpoints require bearer access token unless stated otherwise.
- Tenant is resolved from session and request context; cross-tenant access returns `AUTH_403_ROLE` or `TICKET_404_NOT_FOUND`.
- List endpoints return `{ data, meta }` where `meta` includes paging and filter echo.

## Endpoint Catalog

| Method | Path | Auth | Body | Response | Codes |
| --- | --- | --- | --- | --- | --- |
| GET | /health | none | none | status payload | 200 |
| POST | /api/v1/auth/login | public | email, password | session + user + tenant | 200, 401 |
| POST | /api/v1/auth/refresh | refresh cookie | none | new access token | 200, 401 |
| POST | /api/v1/auth/logout | user | none | logout result | 200 |
| GET | /api/v1/queues | user | query filters | queue list | 200 |
| POST | /api/v1/tickets/intake | api key | external payload | accepted ticket ref | 202, 409, 422 |
| POST | /api/v1/tickets | user | manual ticket payload | created ticket | 201, 422 |
| GET | /api/v1/tickets | user | query filters | paginated tickets | 200 |
| GET | /api/v1/tickets/:id | user | none | ticket detail | 200, 404 |
| POST | /api/v1/tickets/:id/draft | user | mode, intent, language | draft payload | 200, 403, 422 |
| POST | /api/v1/tickets/:id/approve-reply | manager | decision, notes | approval result | 200, 403, 409 |
| POST | /api/v1/tickets/:id/escalate | user | targetTeam, reason | updated ticket | 200, 409 |
| GET | /api/v1/knowledge/articles | user | query params | article list | 200 |
| POST | /api/v1/knowledge/articles | manager | title, body, category | article draft | 201, 422 |
| POST | /api/v1/rules/dry-run | analyst | rule and sample context | execution preview | 200, 422 |
| GET | /api/v1/analytics/overview | manager | filters | metric bundle | 200 |
| GET | /api/v1/audit/events | auditor | filters | audit events | 200 |
| POST | /api/v1/qa/reviews | manager | ticketId, rubric | review record | 201, 422 |

## Representative Contracts

### GET /health

Response:

```json
{
  "status": "ok",
  "time": "2026-03-14T12:00:00Z",
  "services": {
    "postgres": "ok",
    "redis": "ok",
    "queue": "ok"
  }
}
```

### POST /api/v1/auth/login

Request:

```json
{
  "email": "maya@acme.io",
  "password": "correct-horse-battery-staple"
}
```

Response:

```json
{
  "accessToken": "jwt-access-token",
  "refreshCookie": "httpOnly",
  "user": {
    "id": "usr_123",
    "name": "Maya Chen",
    "role": "agent"
  },
  "tenant": {
    "id": "ten_acme",
    "name": "Acme Cloud"
  }
}
```

### GET /api/v1/queues

Query params:
- `team`
- `region`
- `includeSla=true|false`

Response:

```json
{
  "data": [
    {
      "id": "que_billing",
      "name": "Billing",
      "backlogCount": 42,
      "atRiskCount": 6,
      "breachedCount": 1,
      "aiDisabled": true
    }
  ],
  "meta": {
    "total": 4,
    "filters": {
      "team": "na-support"
    }
  }
}
```

### POST /api/v1/tickets/intake

Request:

```json
{
  "source": "email",
  "externalId": "zendesk-99102",
  "subject": "Refund still pending",
  "body": "Customer reports refund missing after 8 days",
  "accountId": "acct_44",
  "language": "en",
  "priorityHint": "high"
}
```

Response:

```json
{
  "ticketId": "tkt_8821",
  "status": "New",
  "timelineEventId": "evt_5001",
  "dedupe": false
}
```

### GET /api/v1/tickets

Query params:
- `queueId`
- `status`
- `assigneeId`
- `slaRisk`
- `search`
- `page`
- `pageSize`

Response:

```json
{
  "data": [
    {
      "id": "tkt_8821",
      "subject": "Refund still pending",
      "status": "Assigned",
      "severity": "high",
      "queue": "Billing",
      "slaRisk": "at-risk",
      "assignee": "usr_123"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 128
  }
}
```

### GET /api/v1/tickets/:id

Response sections:
- ticket summary
- customer and account context
- timeline events
- approvals
- latest AI telemetry envelope

### POST /api/v1/tickets/:id/draft

Request:

```json
{
  "mode": "reply",
  "intent": "refund-policy-question",
  "language": "en"
}
```

Response:

```json
{
  "draftId": "drf_891",
  "state": "draft",
  "model": "gpt-5.3",
  "confidence": "medium",
  "warnings": ["refund approval required"],
  "sources": [
    {
      "articleId": "kb_44",
      "title": "Refund Exceptions",
      "version": 7
    }
  ],
  "telemetry": {
    "templateId": "reply-v3",
    "latencyMs": 3180,
    "tokenUsage": 2440
  }
}
```

### POST /api/v1/tickets/:id/approve-reply

Request:

```json
{
  "decision": "approve",
  "notes": "Allowed under enterprise goodwill policy"
}
```

Response:

```json
{
  "ticketId": "tkt_8821",
  "draftId": "drf_891",
  "approvalState": "Approved",
  "approvedBy": "usr_manager_22"
}
```

### POST /api/v1/tickets/:id/escalate

Request:

```json
{
  "targetTeam": "billing-specialists",
  "reason": "refund-exception-review"
}
```

### GET /api/v1/knowledge/articles

Response items include:
- `status`
- `owner`
- `reviewDate`
- `freshness`
- `retrievalScore`

### POST /api/v1/rules/dry-run

Response includes:
- matched rules
- blocked recursive steps
- resulting field changes
- simulated webhooks

### GET /api/v1/analytics/overview

Response includes:
- backlog by queue
- SLA attainment
- reopen rate
- escalation rate
- QA score trend
- AI acceptance rate

### GET /api/v1/audit/events

Response includes:
- actor
- target entity
- action type
- model version
- prompt template id
- latency and token usage
- redaction flags

### POST /api/v1/qa/reviews

Request includes:
- `ticketId`
- rubric dimensions for accuracy, empathy, compliance, and completeness
- optional coaching note
