# Sprint 1 Development Prompt: Intake, Routing, and SLA Control

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
Complete Sprint 1: Ship ticket intake channels, metadata normalization, routing rules, SLA timers, and queue operations dashboards.

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

## Routing Rules
- Use `gpt-5.4` before coding if the ticket changes architecture, policy, privacy, approvals, auth, or needs deep debugging.
- Use `gpt-5.3` for normal implementation once the plan is clear.
- Use `gpt-5.2` for fixtures, docs, tests, and repetitive scaffolding.

## Ticket 1.1: Build multichannel ticket intake adapters
- Owner: Backend
- Model: gpt-5.3
- Implementation: Implement service, controller, and contract updates; log audit events; add integration coverage.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 1.2: Extend ticket schema for timeline and metadata
- Owner: DB
- Model: gpt-5.2
- Implementation: Add or update schema, indexes, and seed fixtures; verify migration safety.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 1.3: Implement routing and SLA policy engine
- Owner: Backend
- Model: gpt-5.4
- Implementation: Implement service, controller, and contract updates; log audit events; add integration coverage.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 1.4: Deliver queue workspace and SLA views
- Owner: Frontend
- Model: gpt-5.3
- Implementation: Build route, page, and state wiring; add component and accessibility checks.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 1.5: Create intake and routing test packs
- Owner: QA
- Model: gpt-5.2
- Implementation: Add regression cases, curl checks, and summary evidence for target flows.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 1.6: Log AI telemetry envelope fields
- Owner: Backend
- Model: gpt-5.2
- Implementation: Implement service, controller, and contract updates; log audit events; add integration coverage.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 1.7: Publish viewer backlog and flow seeds
- Owner: Frontend
- Model: gpt-5.2
- Implementation: Build route, page, and state wiring; add component and accessibility checks.
- Verify: `npm run lint && npm run typecheck && npm test`

## After All Tickets
1. Re-run lint, typecheck, tests, and build.
2. Update backlog statuses to `qa-review`.
3. Refresh impacted docs and sprint evidence.
