# Rate Limiting

| Endpoint Group | Rule |
| --- | --- |
| login | 5 requests/minute/IP |
| intake api | 120 requests/minute/tenant |
| draft generation | 20 requests/minute/user, 60/minute/tenant |
| analytics export | 10 requests/hour/manager |
| webhook retries | capped by worker queue policy |

Responses return `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `Retry-After` when blocked.
