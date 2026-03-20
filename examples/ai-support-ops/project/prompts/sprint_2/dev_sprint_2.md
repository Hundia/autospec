# Sprint 2 Development Prompt: Agent Workspace and AI Assist

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
Complete Sprint 2: Enable grounded AI summaries and reply drafting with required human review and approval-safe outbound flows.

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

## Routing Rules
- Use `gpt-5.4` before coding if the ticket changes architecture, policy, privacy, approvals, auth, or needs deep debugging.
- Use `gpt-5.3` for normal implementation once the plan is clear.
- Use `gpt-5.2` for fixtures, docs, tests, and repetitive scaffolding.

## Required Planner Handoff

For ticket `2.2`, capture a reusable `gpt-5.4` handoff note before execution:
- policy decisions
- blocked action matrix
- approval-state transitions
- API and UI contract updates
- QA checks required before merge

## Ticket 2.1: Assemble unified ticket context service
- Owner: Backend
- Model: gpt-5.3
- Implementation: Implement service, controller, and contract updates; log audit events; add integration coverage.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 2.2: Design high-risk AI planning and policy checks
- Owner: Backend
- Model: gpt-5.4
- Implementation: define blocked action matrix for refunds, legal risk, privacy, and policy exception intents; update draft endpoint contract; add approval-state transitions and audit telemetry fields; produce handoff note for frontend and QA.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 2.3: Build grounded reply composer
- Owner: Frontend
- Model: gpt-5.3
- Implementation: render draft body, confidence band, citation list, warning banner, telemetry snippet, and blocked-action state from the 2.2 handoff contract.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 2.4: Add approval workflow for outbound replies
- Owner: Frontend
- Model: gpt-5.3
- Implementation: add Awaiting Approval, Approved, Rejected, and Policy Blocked UI states; enforce manager-only approval actions; keep send action human-triggered.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 2.5: Implement approved knowledge retrieval index
- Owner: Backend
- Model: gpt-5.3
- Implementation: Implement service, controller, and contract updates; log audit events; add integration coverage.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 2.6: Create AI assist policy and regression tests
- Owner: QA
- Model: gpt-5.2
- Implementation: add regression cases for blocked drafts, approval transitions, missing citations, and AI-disabled queue behavior; record whether 2.2 planner note was followed.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 2.7: Package AI assist viewer artifacts
- Owner: Frontend
- Model: gpt-5.2
- Implementation: Build route, page, and state wiring; add component and accessibility checks.
- Verify: `npm run lint && npm run typecheck && npm test`

## After All Tickets
1. Re-run lint, typecheck, tests, and build.
2. Update backlog statuses to `qa-review`.
3. Refresh impacted docs and sprint evidence.
