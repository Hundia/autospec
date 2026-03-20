# Screen Inventory

| Screen | Route | Purpose | Key States |
| --- | --- | --- | --- |
| Login | /login | email and SSO entry | default, MFA required, auth error |
| Dashboard | /dashboard | queue and SLA overview | normal, breach-heavy, empty shift |
| Queue Board | /queues/:id | operational triage | loading, filtered, no results, breach spike |
| Ticket Detail | /tickets/:id | full agent workspace | AI disabled, draft ready, awaiting approval, policy blocked |
| Knowledge Center | /knowledge | article and macro management | draft, awaiting approval, stale, archived |
| Rules Console | /rules | automation builder and logs | dry-run success, conflict, recursion blocked |
| QA Desk | /qa | sampled ticket review | review queue, score submitted, coaching required |
| Analytics | /analytics | metrics and exports | loading, filtered, export queued, export failed |
| Admin | /admin | security, retention, AI controls | restricted, config saved, validation error |

## Viewer-Specific Validation Screens

- Executive Overview: show product scope, sprint progress, and GPT-5.x model distribution
- Backlog Explorer: sprint tabs, model badges, dependency graph, and bug backlog
- Workflow Gallery: architecture, user flow, approval flow, and sprint execution diagrams
- Evidence Browser: sprint summaries, QA notes, release notes, and validation drill output
