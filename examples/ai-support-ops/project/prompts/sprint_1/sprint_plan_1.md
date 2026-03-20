# Sprint 1 Planning Guide: Intake, Routing, and SLA Control

## Environment: vscode-copilot

## Sprint Overview
- Goal: Ship ticket intake channels, metadata normalization, routing rules, SLA timers, and queue operations dashboards.
- Total Tickets: 7
- Total Story Points: 26
- Dependencies: review prior sprint outputs before starting.

## Pre-Sprint Checklist
- [ ] Read `requirements/srs.md`
- [ ] Review `specs/*.md` and `specs/backlog.md`
- [ ] Confirm API, DB, and viewer data assumptions
- [ ] Confirm model routing for each ticket

## Tickets
| Ticket | Title | Owner | Model | Points | Dependencies |
| --- | --- | --- | --- | --- | --- |
| 1.1 | Build multichannel ticket intake adapters | Backend | gpt-5.3 | 5 | 0.3 |
| 1.2 | Extend ticket schema for timeline and metadata | DB | gpt-5.2 | 3 | 0.2 |
| 1.3 | Implement routing and SLA policy engine | Backend | gpt-5.4 | 5 | 1.1, 1.2 |
| 1.4 | Deliver queue workspace and SLA views | Frontend | gpt-5.3 | 5 | 1.1, 1.3 |
| 1.5 | Create intake and routing test packs | QA | gpt-5.2 | 3 | 1.1, 1.3 |
| 1.6 | Log AI telemetry envelope fields | Backend | gpt-5.2 | 3 | 1.2 |
| 1.7 | Publish viewer backlog and flow seeds | Frontend | gpt-5.2 | 2 | 1.3, 1.4 |

## Execution Order
1. 1.1 - Build multichannel ticket intake adapters
2. 1.2 - Extend ticket schema for timeline and metadata
3. 1.3 - Implement routing and SLA policy engine
4. 1.4 - Deliver queue workspace and SLA views
5. 1.5 - Create intake and routing test packs
6. 1.6 - Log AI telemetry envelope fields
7. 1.7 - Publish viewer backlog and flow seeds

## Definition of Done
- implementation matches the spec and state rules
- tests pass for changed areas
- docs and backlog updated together
- `gpt-5.4` reviews architecture, security, or debugging-heavy changes

## Model Selection Guide
| Ticket | Recommended Model | Rationale |
| --- | --- | --- |
| 1.1 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 1.2 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 1.3 | gpt-5.4 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 1.4 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 1.5 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 1.6 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 1.7 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
