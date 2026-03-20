# Sprint 2 Planning Guide: Agent Workspace and AI Assist

## Environment: vscode-copilot

## Sprint Overview
- Goal: Enable grounded AI summaries and reply drafting with required human review and approval-safe outbound flows.
- Total Tickets: 7
- Total Story Points: 30
- Dependencies: review prior sprint outputs before starting.

## Pre-Sprint Checklist
- [ ] Read `requirements/srs.md`
- [ ] Review `specs/*.md` and `specs/backlog.md`
- [ ] Confirm API, DB, and viewer data assumptions
- [ ] Confirm model routing for each ticket

## Tickets
| Ticket | Title | Owner | Model | Points | Dependencies |
| --- | --- | --- | --- | --- | --- |
| 2.1 | Assemble unified ticket context service | Backend | gpt-5.3 | 5 | 1.1, 1.2 |
| 2.2 | Design high-risk AI planning and policy checks | Backend | gpt-5.4 | 5 | 2.1, 1.6 |
| 2.3 | Build grounded reply composer | Frontend | gpt-5.3 | 5 | 2.1, 2.2 |
| 2.4 | Add approval workflow for outbound replies | Frontend | gpt-5.3 | 5 | 2.2, 2.3 |
| 2.5 | Implement approved knowledge retrieval index | Backend | gpt-5.3 | 5 | 1.2 |
| 2.6 | Create AI assist policy and regression tests | QA | gpt-5.2 | 3 | 2.2, 2.3, 2.4, 2.5 |
| 2.7 | Package AI assist viewer artifacts | Frontend | gpt-5.2 | 2 | 2.3, 2.4 |

## Execution Order
1. 2.1 - Assemble unified ticket context service
2. 2.2 - Design high-risk AI planning and policy checks
3. 2.3 - Build grounded reply composer
4. 2.4 - Add approval workflow for outbound replies
5. 2.5 - Implement approved knowledge retrieval index
6. 2.6 - Create AI assist policy and regression tests
7. 2.7 - Package AI assist viewer artifacts

## Definition of Done
- implementation matches the spec and state rules
- tests pass for changed areas
- docs and backlog updated together
- `gpt-5.4` reviews architecture, security, or debugging-heavy changes

## Model Selection Guide
| Ticket | Recommended Model | Rationale |
| --- | --- | --- |
| 2.1 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 2.2 | gpt-5.4 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 2.3 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 2.4 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 2.5 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 2.6 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 2.7 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
