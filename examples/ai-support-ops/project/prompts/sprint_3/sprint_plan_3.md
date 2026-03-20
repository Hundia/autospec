# Sprint 3 Planning Guide: Knowledge, Automation, and Escalations

## Environment: vscode-copilot

## Sprint Overview
- Goal: Operationalize approved knowledge, automation rules, escalations, collaboration, and admin AI controls.
- Total Tickets: 7
- Total Story Points: 29
- Dependencies: review prior sprint outputs before starting.

## Pre-Sprint Checklist
- [ ] Read `requirements/srs.md`
- [ ] Review `specs/*.md` and `specs/backlog.md`
- [ ] Confirm API, DB, and viewer data assumptions
- [ ] Confirm model routing for each ticket

## Tickets
| Ticket | Title | Owner | Model | Points | Dependencies |
| --- | --- | --- | --- | --- | --- |
| 3.1 | Ship knowledge lifecycle workflows | Backend | gpt-5.3 | 5 | 2.5 |
| 3.2 | Create macro and canned response admin UI | Frontend | gpt-5.2 | 3 | 3.1 |
| 3.3 | Build automation rule engine with dry-run | Backend | gpt-5.4 | 5 | 1.3, 3.1 |
| 3.4 | Implement escalations and collaboration | Frontend | gpt-5.3 | 5 | 3.3 |
| 3.5 | Add queue-level AI control settings | Frontend | gpt-5.2 | 3 | 2.2, 3.3 |
| 3.6 | Create integration and webhook framework | Backend | gpt-5.3 | 5 | 3.3 |
| 3.7 | Expand knowledge and automation QA suites | QA | gpt-5.2 | 3 | 3.1, 3.3, 3.4, 3.5, 3.6 |

## Execution Order
1. 3.1 - Ship knowledge lifecycle workflows
2. 3.2 - Create macro and canned response admin UI
3. 3.3 - Build automation rule engine with dry-run
4. 3.4 - Implement escalations and collaboration
5. 3.5 - Add queue-level AI control settings
6. 3.6 - Create integration and webhook framework
7. 3.7 - Expand knowledge and automation QA suites

## Definition of Done
- implementation matches the spec and state rules
- tests pass for changed areas
- docs and backlog updated together
- `gpt-5.4` reviews architecture, security, or debugging-heavy changes

## Model Selection Guide
| Ticket | Recommended Model | Rationale |
| --- | --- | --- |
| 3.1 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 3.2 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 3.3 | gpt-5.4 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 3.4 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 3.5 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 3.6 | gpt-5.3 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
| 3.7 | gpt-5.2 | Use gpt-5.4 for planning/security/review, gpt-5.3 for normal delivery, gpt-5.2 for low-risk boilerplate and tests. |
