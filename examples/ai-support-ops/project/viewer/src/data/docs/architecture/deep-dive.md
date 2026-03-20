# Architecture Deep Dive

## Key Decisions
| Decision | Chosen Option | Why |
| --- | --- | --- |
| Search | PostgreSQL full-text | lower ops overhead for v1 |
| Queue processing | BullMQ | simple retries and delayed jobs |
| Auth | SAML plus JWT session layer | enterprise readiness with app-level control |
| AI safety | planner plus policy gate | matches human-accountability requirement |
| Audit logging | append-only event table | compliance and explainability |

## Trade-Offs
- PostgreSQL search is simpler than a separate search cluster but limits advanced ranking.
- Human approval adds latency but protects compliance-sensitive flows.
- Rich audit logs increase storage cost; retention controls offset growth.

## Known Limits
- No native mobile app.
- No active-active multi-region.
- Chat intake is simulated in v1.

## Caching Strategy
- Queue summaries: 30 s TTL.
- Knowledge article snippets: 5 min TTL with publish invalidation.
- Analytics overview: 2 min TTL per filter set.
