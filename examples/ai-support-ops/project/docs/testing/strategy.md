# Testing Strategy

## Pyramid

- Unit: services, reducers, validators, policy logic, and automation guards
- Integration: Fastify routes with test database, Redis, and worker contracts
- E2E: Playwright flows for queue triage, approval, publish, analytics filters, and AI disable rules

## Coverage Targets

- overall line coverage >= 70 percent
- routing, approvals, auth, privacy, and policy services >= 80 percent

## Minimum Suite By Sprint

- Sprint 0: health, auth bootstrap, queue list, ticket create, build pipeline smoke
- Sprint 1: intake dedupe, timeline metadata, routing rules, SLA timers
- Sprint 2: AI draft gating, approval states, citations, policy block responses
- Sprint 3: knowledge approvals, automation dry-run, escalation, AI disablement
- Sprint 4: QA scorecards, audit search, analytics exports, privacy redaction
- Sprint 5: SSO/MFA, deployment smoke, backup/restore verification, alerting

## CI Gates

1. lint
2. typecheck
3. unit tests
4. integration tests
5. build
6. targeted e2e smoke on staging-ready flows

## Evidence Required

- curl checks for every new or changed API contract
- viewer data refresh for backlog, flows, and sprint evidence after meaningful scope changes
- test summary note in sprint QA results describing what `gpt-5.4`, `gpt-5.3`, and `gpt-5.2` each contributed
