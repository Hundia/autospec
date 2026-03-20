# Development Workflow

1. Read `requirements/srs.md`, the ticket in `specs/backlog.md`, and the relevant role specs.
2. Use `gpt-5.4` to clarify architecture, policy, or debugging risks.
3. Hand off standard implementation to `gpt-5.3`.
4. Use `gpt-5.2` for boilerplate, tests, fixtures, and docs updates.
5. Run lint, typecheck, targeted tests, and build.
6. Update backlog status and note doc changes.
