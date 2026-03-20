# Sprint 0 Planning Guide: Foundation and Walking Skeleton

## Environment: vscode-copilot

## Sprint Overview
- Goal: Stand up the tenant-aware platform skeleton, baseline auth, queue intake, UI shell, and delivery pipeline.
- Total Tickets: 5
- Total Story Points: 20
- Dependencies: review prior sprint outputs before starting.

## Pre-Sprint Checklist
- [ ] Read `requirements/srs.md`
- [ ] Review `specs/*.md` and `specs/backlog.md`
- [ ] Confirm API, DB, and viewer data assumptions
- [ ] Confirm model routing for each ticket

## Tickets
| Ticket | Title | Owner | Model | Points | Dependencies |
| --- | --- | --- | --- | --- | --- |
| 0.1 | Scaffold mono-repo service layout | DevOps | gpt-5.2 | 5 | - |
| 0.2 | Create tenant and identity schema baseline | DB | gpt-5.3 | 3 | 0.1 |
| 0.3 | Implement queue and ticket walking skeleton | Backend | gpt-5.3 | 5 | 0.2 |
| 0.4 | Build support workspace shell | Frontend | gpt-5.2 | 3 | 0.1 |
| 0.5 | Add CI, Docker, and quality gates | DevOps | gpt-5.4 | 4 | 0.1, 0.2, 0.3, 0.4 |

## Execution Order
1. 0.1 - Scaffold mono-repo service layout
2. 0.2 - Create tenant and identity schema baseline
3. 0.3 - Implement queue and ticket walking skeleton
4. 0.4 - Build support workspace shell
5. 0.5 - Add CI, Docker, and quality gates

## Definition of Done
- implementation matches the spec and state rules
- tests pass for changed areas
- docs and backlog updated together
- `gpt-5.4` reviews architecture, security, or debugging-heavy changes

## Model Selection Guide
| Ticket | Recommended Model | Rationale |
| --- | --- | --- |
| 0.1 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 0.2 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 0.3 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 0.4 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 0.5 | gpt-5.4 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
