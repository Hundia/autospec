# Sprint 3 Development Prompt: Knowledge, Automation, and Escalations

## Environment: vscode-copilot

## Read First
- `requirements/srs.md`
- `specs/01_product_manager.md`
- `specs/02_backend_lead.md`
- `specs/03_frontend_lead.md`
- `specs/04_db_architect.md`
- `specs/05_qa_lead.md`
- `specs/06_devops_lead.md`
- `specs/10_ui_designer.md`
- `specs/backlog.md`
- relevant files under `docs/architecture/`, `docs/flows/`, `docs/api/`, `docs/testing/`, and `docs/project/`

## Mission
Complete Sprint 3: Operationalize approved knowledge, automation rules, escalations, collaboration, and admin AI controls.

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

## Routing Rules
- Use `gpt-5.4` before coding if the ticket changes architecture, policy, privacy, approvals, auth, or needs deep debugging.
- Use `gpt-5.3` for normal implementation once the plan is clear.
- Use `gpt-5.2` for fixtures, docs, tests, and repetitive scaffolding.

## Ticket 3.1: Ship knowledge lifecycle workflows
- Owner: Backend
- Model: gpt-5.3
- Implementation: Implement service, controller, and contract updates; log audit events; add integration coverage.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 3.2: Create macro and canned response admin UI
- Owner: Frontend
- Model: gpt-5.2
- Implementation: Build route, page, and state wiring; add component and accessibility checks.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 3.3: Build automation rule engine with dry-run
- Owner: Backend
- Model: gpt-5.4
- Implementation: Implement service, controller, and contract updates; log audit events; add integration coverage.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 3.4: Implement escalations and collaboration
- Owner: Frontend
- Model: gpt-5.3
- Implementation: Build route, page, and state wiring; add component and accessibility checks.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 3.5: Add queue-level AI control settings
- Owner: Frontend
- Model: gpt-5.2
- Implementation: Build route, page, and state wiring; add component and accessibility checks.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 3.6: Create integration and webhook framework
- Owner: Backend
- Model: gpt-5.3
- Implementation: Implement service, controller, and contract updates; log audit events; add integration coverage.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 3.7: Expand knowledge and automation QA suites
- Owner: QA
- Model: gpt-5.2
- Implementation: Add regression cases, curl checks, and summary evidence for target flows.
- Verify: `npm run lint && npm run typecheck && npm test`

## After All Tickets
1. Re-run lint, typecheck, tests, and build.
2. Update backlog statuses to `qa-review`.
3. Refresh impacted docs and sprint evidence.
