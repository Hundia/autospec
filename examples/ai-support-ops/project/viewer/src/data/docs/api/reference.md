# API Reference

| Method | Path | Auth | Body | Response | Codes |
| --- | --- | --- | --- | --- | --- |
| GET | /health | none | none | status ok | 200 |
| POST | /api/v1/auth/login | public | email, password | session + user | 200, 401 |
| POST | /api/v1/auth/refresh | refresh cookie | none | new access token | 200, 401 |
| GET | /api/v1/queues | user | filters in query | queue list | 200 |
| POST | /api/v1/tickets/intake | api key | external payload | accepted ticket ref | 202, 409 |
| GET | /api/v1/tickets | user | filters in query | paginated tickets | 200 |
| GET | /api/v1/tickets/:id | user | none | ticket detail | 200, 404 |
| POST | /api/v1/tickets/:id/draft | user | mode, intent | draft payload | 200, 422 |
| POST | /api/v1/tickets/:id/approve-reply | manager | decision, notes | approval result | 200, 403 |
| POST | /api/v1/tickets/:id/escalate | user | targetTeam, reason | updated ticket | 200, 409 |
| GET | /api/v1/knowledge/articles | user | query params | article list | 200 |
| POST | /api/v1/knowledge/articles | manager | title, body, category | article draft | 201, 422 |
| POST | /api/v1/rules/dry-run | analyst | rule and sample context | execution preview | 200 |
| GET | /api/v1/analytics/overview | manager | filters | metric bundle | 200 |
| GET | /api/v1/audit/events | auditor | filters | audit events | 200 |
| POST | /api/v1/qa/reviews | manager | ticketId, rubric | review record | 201 |
