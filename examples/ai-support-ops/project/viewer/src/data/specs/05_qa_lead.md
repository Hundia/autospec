# QA Lead Spec - AI Support Ops

## Test Pyramid
- Unit 70 percent: services, validators, reducers, policy gates.
- Integration 20 percent: API contracts, DB flows, worker jobs.
- E2E 10 percent: queue triage, draft approval, knowledge approval, analytics filters.

## Coverage Targets
- Overall line coverage >= 70 percent.
- Critical services >= 80 percent: routing, auth, approvals, retention, AI policy checks.

## Naming and Locations
- Backend unit tests: `src/**/__tests__/*.test.ts`
- Frontend component tests: `src/**/*.spec.tsx`
- Integration tests: `tests/integration/*.test.ts`
- E2E tests: `tests/e2e/*.spec.ts`

## Critical Scenarios
1. Intake API deduplicates by idempotency key.
2. Ticket cannot enter Pending Customer without draft or sent response.
3. High-risk AI draft requires approval before send.
4. Reopened transition triggers only inside reopen window.
5. Automation recursion is blocked and logged.
6. AI disabled queue hides blocked actions and returns policy error.
7. Audit events capture model version, prompt template id, sources, latency, and tokens.
8. PII is redacted in exports and logs.

## Performance Benchmarks
- API p50 < 100 ms for non-AI reads.
- API p95 < 300 ms for queue and ticket reads.
- API p99 < 1 s except draft generation.
- AI draft generation p95 < 6 s.

## Security Checklist
- OWASP Top 10 mapped for auth, injection, broken access control, secrets, logging, and SSRF on webhook calls.
- RBAC must be tested per role and queue scope.
- MFA and SAML flows require session hardening tests.

## QA Process
- gpt-5.4 synthesizes sprint QA review and hard bug triage.
- gpt-5.3 authors standard test fixes and integration coverage.
- gpt-5.2 generates fixtures, mock data, regression docs, and low-risk tests.
- A ticket is done only after automated tests, curl checks, and the user flow pass list are updated.
