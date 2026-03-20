# Sprint 4 Development Prompt: QA, Compliance, and Analytics

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
Complete Sprint 4: Deliver QA sampling, audit visibility, operational analytics, privacy tooling, and production-grade accessibility and performance.

## Tickets
| Ticket | Title | Owner | Model | Points | Dependencies |
| --- | --- | --- | --- | --- | --- |
| 4.1 | Implement QA sampling and scorecards | Backend | gpt-5.3 | 5 | 2.4, 3.4 |
| 4.2 | Build audit log explorer | Frontend | gpt-5.3 | 5 | 1.6, 2.2, 3.3 |
| 4.3 | Launch analytics dashboards and exports | Frontend | gpt-5.3 | 5 | 4.1, 4.2 |
| 4.4 | Schedule recurring ops summaries | Backend | gpt-5.2 | 3 | 4.3 |
| 4.5 | Implement privacy retention and redaction controls | Backend | gpt-5.4 | 5 | 4.2 |
| 4.6 | Complete accessibility and performance hardening | QA | gpt-5.2 | 4 | 4.2, 4.3 |

## Routing Rules
- Use `gpt-5.4` before coding if the ticket changes architecture, policy, privacy, approvals, auth, or needs deep debugging.
- Use `gpt-5.3` for normal implementation once the plan is clear.
- Use `gpt-5.2` for fixtures, docs, tests, and repetitive scaffolding.

## Ticket 4.1: Implement QA sampling and scorecards
- Owner: Backend
- Model: gpt-5.3
- Implementation: Implement service, controller, and contract updates; log audit events; add integration coverage.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 4.2: Build audit log explorer
- Owner: Frontend
- Model: gpt-5.3
- Implementation: Build route, page, and state wiring; add component and accessibility checks.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 4.3: Launch analytics dashboards and exports
- Owner: Frontend
- Model: gpt-5.3
- Implementation: Build route, page, and state wiring; add component and accessibility checks.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 4.4: Schedule recurring ops summaries
- Owner: Backend
- Model: gpt-5.2
- Implementation: Implement service, controller, and contract updates; log audit events; add integration coverage.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 4.5: Implement privacy retention and redaction controls
- Owner: Backend
- Model: gpt-5.4
- Implementation: Implement service, controller, and contract updates; log audit events; add integration coverage.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 4.6: Complete accessibility and performance hardening
- Owner: QA
- Model: gpt-5.2
- Implementation: Add regression cases, curl checks, and summary evidence for target flows.
- Verify: `npm run lint && npm run typecheck && npm test`

## After All Tickets
1. Re-run lint, typecheck, tests, and build.
2. Update backlog statuses to `qa-review`.
3. Refresh impacted docs and sprint evidence.
