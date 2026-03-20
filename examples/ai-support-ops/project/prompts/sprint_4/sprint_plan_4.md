# Sprint 4 Planning Guide: QA, Compliance, and Analytics

## Environment: vscode-copilot

## Sprint Overview
- Goal: Deliver QA sampling, audit visibility, operational analytics, privacy tooling, and production-grade accessibility and performance.
- Total Tickets: 6
- Total Story Points: 27
- Dependencies: review prior sprint outputs before starting.

## Pre-Sprint Checklist
- [ ] Read `requirements/srs.md`
- [ ] Review `specs/*.md` and `specs/backlog.md`
- [ ] Confirm API, DB, and viewer data assumptions
- [ ] Confirm model routing for each ticket

## Tickets
| Ticket | Title | Owner | Model | Points | Dependencies |
| --- | --- | --- | --- | --- | --- |
| 4.1 | Implement QA sampling and scorecards | Backend | gpt-5.3 | 5 | 2.4, 3.4 |
| 4.2 | Build audit log explorer | Frontend | gpt-5.3 | 5 | 1.6, 2.2, 3.3 |
| 4.3 | Launch analytics dashboards and exports | Frontend | gpt-5.3 | 5 | 4.1, 4.2 |
| 4.4 | Schedule recurring ops summaries | Backend | gpt-5.2 | 3 | 4.3 |
| 4.5 | Implement privacy retention and redaction controls | Backend | gpt-5.4 | 5 | 4.2 |
| 4.6 | Complete accessibility and performance hardening | QA | gpt-5.2 | 4 | 4.2, 4.3 |

## Execution Order
1. 4.1 - Implement QA sampling and scorecards
2. 4.2 - Build audit log explorer
3. 4.3 - Launch analytics dashboards and exports
4. 4.4 - Schedule recurring ops summaries
5. 4.5 - Implement privacy retention and redaction controls
6. 4.6 - Complete accessibility and performance hardening

## Definition of Done
- implementation matches the spec and state rules
- tests pass for changed areas
- docs and backlog updated together
- `gpt-5.4` reviews architecture, security, or debugging-heavy changes

## Model Selection Guide
| Ticket | Recommended Model | Rationale |
| --- | --- | --- |
| 4.1 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 4.2 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 4.3 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 4.4 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 4.5 | gpt-5.4 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 4.6 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
