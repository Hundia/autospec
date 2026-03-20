# Multi-Agent Workflow

## Split
- Backend/DB agent owns schema, routes, services, workers, and API docs.
- Frontend agent owns pages, data fetching, forms, and interaction docs.
- QA agent validates contracts, curl tests, accessibility, and regression coverage.

## Routing
- `gpt-5.4` prepares shared plan and contract notes.
- `gpt-5.3` executes most tickets.
- `gpt-5.2` fills fixtures, docs, and simple tests.
