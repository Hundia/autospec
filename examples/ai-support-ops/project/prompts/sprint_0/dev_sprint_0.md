# Sprint 0 Development Prompt: Foundation and Walking Skeleton

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
Complete Sprint 0: Stand up the tenant-aware platform skeleton, baseline auth, queue intake, UI shell, and delivery pipeline.

## Tickets
| Ticket | Title | Owner | Model | Points | Dependencies |
| --- | --- | --- | --- | --- | --- |
| 0.1 | Scaffold mono-repo service layout | DevOps | gpt-5.2 | 5 | - |
| 0.2 | Create tenant and identity schema baseline | DB | gpt-5.3 | 3 | 0.1 |
| 0.3 | Implement queue and ticket walking skeleton | Backend | gpt-5.3 | 5 | 0.2 |
| 0.4 | Build support workspace shell | Frontend | gpt-5.2 | 3 | 0.1 |
| 0.5 | Add CI, Docker, and quality gates | DevOps | gpt-5.4 | 4 | 0.1, 0.2, 0.3, 0.4 |

## Routing Rules
- Use `gpt-5.4` before coding if the ticket changes architecture, policy, privacy, approvals, auth, or needs deep debugging.
- Use `gpt-5.3` for normal implementation once the plan is clear.
- Use `gpt-5.2` for fixtures, docs, tests, and repetitive scaffolding.

## Required Planner Handoff

For any ticket assigned `gpt-5.4`, create a short handoff note before implementation with:
- decision summary
- dependencies and blocked paths
- exact acceptance checks
- files or contracts other chats must not improvise

## Ticket 0.1: Scaffold mono-repo service layout
- Owner: DevOps
- Model: gpt-5.2
- Implementation: create `apps/api`, `apps/web`, `apps/worker`, `packages/ui`, `packages/config`, and `packages/test-utils`; wire shared tsconfig, lint config, and root scripts; seed viewer data folder structure.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 0.2: Create tenant and identity schema baseline
- Owner: DB
- Model: gpt-5.3
- Implementation: add workspace, user, role, queue, membership, and session tables; define core indexes for tenant and queue lookups; add seed fixtures for one workspace, one manager, and one agent.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 0.3: Implement queue and ticket walking skeleton
- Owner: Backend
- Model: gpt-5.3
- Implementation: add `/health`, `/api/v1/queues`, `POST /api/v1/tickets`, and `GET /api/v1/tickets/:id`; return tenant-scoped payloads; write audit event for ticket creation; include one integration test per route.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 0.4: Build support workspace shell
- Owner: Frontend
- Model: gpt-5.2
- Implementation: create app shell with sidebar, header, dashboard route, queue list shell, and empty ticket detail state; include keyboard focus order and loading states.
- Verify: `npm run lint && npm run typecheck && npm test`

## Ticket 0.5: Add CI, Docker, and quality gates
- Owner: DevOps
- Model: gpt-5.4
- Implementation: produce planner handoff first, then define Docker Compose for postgres, redis, and minio; add CI steps for lint, typecheck, test, build; define failure policy and required artifacts.
- Verify: `npm run lint && npm run typecheck && npm test`

## After All Tickets
1. Re-run lint, typecheck, tests, and build.
2. Update backlog statuses to `qa-review`.
3. Refresh impacted docs and sprint evidence.
4. Record the `gpt-5.4` planner handoff note for ticket 0.5 in sprint evidence.
