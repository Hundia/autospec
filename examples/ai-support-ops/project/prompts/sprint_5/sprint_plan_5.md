# Sprint 5 Planning Guide: Production Readiness and Launch

## Environment: vscode-copilot

## Sprint Overview
- Goal: Finish enterprise auth, deployment hardening, observability, recovery, and launch validation artifacts.
- Total Tickets: 6
- Total Story Points: 25
- Dependencies: review prior sprint outputs before starting.

## Pre-Sprint Checklist
- [ ] Read `requirements/srs.md`
- [ ] Review `specs/*.md` and `specs/backlog.md`
- [ ] Confirm API, DB, and viewer data assumptions
- [ ] Confirm model routing for each ticket

## Tickets
| Ticket | Title | Owner | Model | Points | Dependencies |
| --- | --- | --- | --- | --- | --- |
| 5.1 | Integrate SSO, SAML, and MFA policies | Backend | gpt-5.4 | 5 | 0.2, 4.5 |
| 5.2 | Finalize AWS-compatible deployment topology | DevOps | gpt-5.3 | 5 | 0.5, 4.5 |
| 5.3 | Add health views, traces, and alerts | DevOps | gpt-5.3 | 5 | 5.2 |
| 5.4 | Write staging and rollback runbooks | DevOps | gpt-5.2 | 3 | 5.2 |
| 5.5 | Execute launch verification suite | QA | gpt-5.3 | 5 | 5.1, 5.2, 5.3, 5.4 |
| 5.6 | Assemble executive viewer validation pack | Frontend | gpt-5.2 | 2 | 5.5 |

## Execution Order
1. 5.1 - Integrate SSO, SAML, and MFA policies
2. 5.2 - Finalize AWS-compatible deployment topology
3. 5.3 - Add health views, traces, and alerts
4. 5.4 - Write staging and rollback runbooks
5. 5.5 - Execute launch verification suite
6. 5.6 - Assemble executive viewer validation pack

## Definition of Done
- implementation matches the spec and state rules
- tests pass for changed areas
- docs and backlog updated together
- `gpt-5.4` reviews architecture, security, or debugging-heavy changes

## Model Selection Guide
| Ticket | Recommended Model | Rationale |
| --- | --- | --- |
| 5.1 | gpt-5.4 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 5.2 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 5.3 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 5.4 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 5.5 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 5.6 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
