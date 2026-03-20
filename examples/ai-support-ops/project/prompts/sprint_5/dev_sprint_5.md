# Sprint 5 Development Prompt: Production Readiness and Launch

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
Complete Sprint 5: Finish enterprise auth, deployment hardening, observability, recovery, and launch validation artifacts.

## Tickets
| Ticket | Title | Owner | Model | Points | Dependencies |
| --- | --- | --- | --- | --- | --- |
| 5.1 | Integrate SSO, SAML, and MFA policies | Backend | gpt-5.4 | 5 | 0.2, 4.5 |
| 5.2 | Finalize AWS-compatible deployment topology | DevOps | gpt-5.3 | 5 | 0.5, 4.5 |
| 5.3 | Add health views, traces, and alerts | DevOps | gpt-5.3 | 5 | 5.2 |
| 5.4 | Write staging and rollback runbooks | DevOps | gpt-5.2 | 3 | 5.2 |
| 5.5 | Execute launch verification suite | QA | gpt-5.3 | 5 | 5.1, 5.2, 5.3, 5.4 |
| 5.6 | Assemble executive viewer validation pack | Frontend | gpt-5.2 | 2 | 5.5 |

## Routing Rules
- Use `gpt-5.4` before coding if the ticket changes architecture, policy, privacy, approvals, auth, or needs deep debugging.
- Use `gpt-5.3` for normal implementation once the plan is clear.
- Use `gpt-5.2` for fixtures, docs, tests, and repetitive scaffolding.

## Ticket 5.1: Integrate SSO, SAML, and MFA policies
- Owner: Backend
- Model: gpt-5.4
- Implementation: Implement service, controller, and contract updates; log audit events; add integration coverage.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 5.2: Finalize AWS-compatible deployment topology
- Owner: DevOps
- Model: gpt-5.3
- Implementation: Update environment, pipeline, Docker, and deployment docs; verify build and health checks.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 5.3: Add health views, traces, and alerts
- Owner: DevOps
- Model: gpt-5.3
- Implementation: Update environment, pipeline, Docker, and deployment docs; verify build and health checks.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 5.4: Write staging and rollback runbooks
- Owner: DevOps
- Model: gpt-5.2
- Implementation: Update environment, pipeline, Docker, and deployment docs; verify build and health checks.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 5.5: Execute launch verification suite
- Owner: QA
- Model: gpt-5.3
- Implementation: Add regression cases, curl checks, and summary evidence for target flows.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 5.6: Assemble executive viewer validation pack
- Owner: Frontend
- Model: gpt-5.2
- Implementation: Build route, page, and state wiring; add component and accessibility checks.
- Verify: `npm run lint && npm run typecheck && npm test`

## After All Tickets
1. Re-run lint, typecheck, tests, and build.
2. Update backlog statuses to `qa-review`.
3. Refresh impacted docs and sprint evidence.
