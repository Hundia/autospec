# Copilot Instructions - AI Support Ops

Environment: vscode-copilot

Always read `requirements/srs.md`, `specs/backlog.md`, and the relevant spec before writing code or docs.

## Model Routing
- `gpt-5.4`: planning, architecture, security, debugging, reviews, QA synthesis.
- `gpt-5.3`: normal implementation, business logic, UI wiring, integration work.
- `gpt-5.2`: boilerplate, CRUD, docs, tests, fixtures, repetitive edits.

## Required Handoff Pattern
- If a ticket is marked `gpt-5.4`, start by writing a short planner brief with decisions, dependencies, contracts, and acceptance checks.
- `gpt-5.3` should implement against that brief rather than re-planning.
- `gpt-5.2` should only handle low-risk follow-up work like tests, docs, and scaffolding unless the brief explicitly expands scope.
- If implementation fails twice or a contract conflict appears, escalate back to `gpt-5.4`.

## Delivery Rules
- Keep AI Support Ops specific. Do not leave placeholder roles, tickets, queues, or endpoints.
- Preserve human review for every external AI reply.
- Log model version, template id, sources, latency, token usage, and human outcome for every AI action.
- Update `specs/backlog.md`, relevant files in `docs/`, and sprint records in `sprints/` together.
- Favor small reusable plans from `gpt-5.4` that `gpt-5.3` and `gpt-5.2` can execute without re-planning.
