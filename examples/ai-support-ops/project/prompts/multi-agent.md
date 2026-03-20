# Multi-Agent Prompt Pack

## Agent A - Backend and Data
Read `specs/02_backend_lead.md`, `specs/04_db_architect.md`, `specs/05_qa_lead.md`, `docs/architecture/backend.md`, `docs/architecture/database.md`, and `docs/api/reference.md`.
Use `gpt-5.4` for API contracts, policy gates, schema risks, and debugging.
Use `gpt-5.3` for standard services and integrations.
Use `gpt-5.2` for migrations, fixtures, and straightforward tests.

## Agent B - Frontend and Experience
Read `specs/03_frontend_lead.md`, `specs/10_ui_designer.md`, `docs/architecture/frontend.md`, `docs/ui-design-system/*`, and `docs/flows/*`.
Use `gpt-5.4` for interaction architecture and accessibility review.
Use `gpt-5.3` for normal page and component work.
Use `gpt-5.2` for story fixtures, docs, and component tests.

## Integration Phase
- Lock API contracts first.
- Share route payload examples.
- Run curl tests before UI merge.
- Re-run sprint QA prompt after integration.
