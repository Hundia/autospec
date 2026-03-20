# Development Workflow

## Standard Ticket Flow

1. Read `requirements/srs.md`, the ticket in `specs/backlog.md`, and the relevant role specs.
2. If the ticket touches architecture, approvals, auth, privacy, policy, or repeated failures, start with a `gpt-5.4` planning pass.
3. Write a short execution brief containing:
   - scope
   - dependencies
   - affected files
   - acceptance checks
   - rollback concerns
4. Execute standard implementation with `gpt-5.3` against that brief.
5. Use `gpt-5.2` for boilerplate, tests, fixtures, docs updates, and viewer data refreshes.
6. Run lint, typecheck, targeted tests, and build.
7. Update backlog status and refresh impacted docs, prompts, and sprint evidence together.

## Escalation Rules

- Escalate back to `gpt-5.4` if:
  - two implementation attempts fail
  - a contract conflict appears between frontend and backend
  - a state-machine or security rule changes
  - QA reveals a cross-cutting bug

## Required Handoff Artifact

Each high-risk ticket should leave a short note in sprint evidence describing:
- what `gpt-5.4` decided
- what `gpt-5.3` implemented
- what `gpt-5.2` generated or refreshed
