# Error Codes

| Code | HTTP | User Message | Developer Message |
| --- | --- | --- | --- |
| AUTH_401_INVALID | 401 | Check your credentials. | Login or token validation failed. |
| AUTH_403_ROLE | 403 | You do not have access. | RBAC denied this action. |
| TICKET_404_NOT_FOUND | 404 | Ticket not found. | Ticket id missing or outside tenant. |
| TICKET_409_TRANSITION | 409 | That status change is not allowed. | Invalid state transition. |
| AI_422_POLICY_BLOCK | 422 | Draft blocked pending policy review. | High-risk AI action requires planner or approval. |
| RULE_409_RECURSION | 409 | Rule execution stopped for safety. | Recursive automation loop prevented. |
| PRIVACY_403_REDACTED | 403 | Sensitive data is hidden. | Field excluded by privacy policy. |
| RATE_429_LIMIT | 429 | Too many requests. Retry soon. | Endpoint throttle exceeded. |
