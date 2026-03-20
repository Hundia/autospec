# Project Memory - AI Support Ops

This generated project is optimized for VS Code Copilot workflows.

## Source of Truth
- `requirements/srs.md`
- `specs/*.md`
- `specs/backlog.md`
- `docs/` for living architecture, workflow, API, and test guidance

## Required Routing
- Use `gpt-5.4` for backlog shaping, architecture decisions, security review, debugging, and cross-ticket review.
- Use `gpt-5.3` for standard feature delivery.
- Use `gpt-5.2` for boilerplate, docs, tests, and low-risk repetitive work.

## Operating Rules
- Human review is mandatory before any external AI reply leaves draft state.
- High-risk actions must run planning plus policy validation before approval.
- AI settings can be disabled by queue, channel, or action type and must remain auditable.
- Every completed ticket updates the backlog, docs, and sprint evidence.
