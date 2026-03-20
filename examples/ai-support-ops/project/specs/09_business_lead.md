# Business Lead Spec - AI Support Ops

## Business Model
Sell a multi-tenant SaaS platform to B2B support organizations that need both AI acceleration and controlled human approvals. Revenue comes from seat-based pricing with enterprise controls as the expansion lever.

## Competitive Analysis
| Competitor | Strengths | Weaknesses |
| --- | --- | --- |
| Zendesk AI | installed base, mature ticketing | less transparent AI telemetry |
| Intercom Fin | polished AI reply experience | lighter approval and audit controls |
| Freshdesk Freddy | broad SMB appeal | weaker ops governance depth |
| Salesforce Service Cloud | enterprise integration breadth | slower setup and higher admin overhead |
| Ada | automation maturity | not centered on human-in-the-loop agent workspace |

## SWOT
- Strengths: grounded AI visibility, approval-first workflows, rich operational telemetry.
- Weaknesses: narrower v1 scope than incumbents, no voice or mobile.
- Opportunities: regulated SaaS support teams, AI governance mandates, knowledge freshness pain.
- Threats: incumbent bundling, rapid AI price shifts, security scrutiny.

## Value Proposition Canvas
- Jobs: triage tickets, respond consistently, manage SLA and QA risk.
- Pains: tool sprawl, weak audit trails, low trust in AI, stale knowledge.
- Gains: faster first response, explainable suggestions, measurable quality, cleaner approvals.

## KPIs
- Net revenue retention > 115 percent.
- AI-assisted acceptance > 55 percent.
- Weekly active managers > 85 percent of paid workspaces.
- Escalation rate down 10 percent after 90 days.

## Risk Register
| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Wrong AI reply grounding | medium | high | citations, warnings, human send gate |
| Tenant data leakage | low | critical | tenant scoping, RBAC, audit review |
| Automation loop | medium | high | recursion guard, dry-run, kill switch |
| Slow AI latency | medium | medium | caching, retries, model routing |
| Stale knowledge | high | medium | review dates, stale flags, owner SLA |
