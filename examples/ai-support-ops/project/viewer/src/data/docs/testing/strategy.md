# Testing Strategy

- Unit: services, reducers, validators, policy logic.
- Integration: Fastify routes with test database and Redis.
- E2E: Playwright flows for queue triage, approval, publish, analytics filters.
- CI gates: lint, typecheck, unit, integration, build, then e2e smoke on staging.
