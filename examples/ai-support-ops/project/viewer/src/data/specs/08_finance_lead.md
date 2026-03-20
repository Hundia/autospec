# Finance Lead Spec - AI Support Ops

## Monthly Infrastructure Estimate
| Item | Estimate |
| --- | ---: |
| API and worker compute | 2200 |
| PostgreSQL managed instance | 900 |
| Redis/BullMQ | 280 |
| Object storage and egress | 220 |
| Monitoring and logs | 450 |
| CDN and web hosting | 180 |
| Total base infra | 4230 |

## AI Cost Estimate
- Planning and reviews: gpt-5.4 at roughly 15 percent of internal development-assist volume.
- Standard implementation: gpt-5.3 at roughly 45 percent.
- Boilerplate, docs, and tests: gpt-5.2 at roughly 40 percent.
- Production-side AI suggestions should log model version and usage; initial budget target is 1800 USD/month for beta tenants.

## Pricing Strategy
- Starter: 79 USD/agent/month, capped AI suggestions and one approval policy.
- Growth: 119 USD/agent/month, full workflow automation and analytics exports.
- Enterprise: custom pricing, SSO/SAML, retention controls, advanced audit exports.

## Revenue Projection
- Month 3: 25k ARR from design partners.
- Month 6: 180k ARR with 6 growth accounts.
- Month 12: 850k ARR with 10 growth and 4 enterprise accounts.

## Unit Economics
- Target LTV:CAC above 3.5.
- Gross margin target 78 percent after AI and infra costs.
- Payback target under 12 months.

## Budget Priorities
1. Engineering and QA for trust-critical workflows.
2. AI usage controls and observability.
3. Customer education and design partner enablement.
