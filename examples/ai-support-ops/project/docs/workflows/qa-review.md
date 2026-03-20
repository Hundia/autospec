# QA Review Checklist

## Functional

- ticket state rules follow `docs/flows/state-transitions.md`
- approval gates block risky external AI replies
- knowledge publish flow updates retrieval and freshness state
- AI disable settings hide or reject blocked actions

## Security

- RBAC enforced by role and tenant scope
- audit events include actor, model, prompt template id, sources, latency, and token usage
- sensitive exports apply privacy redaction
- SSO, refresh, and session hardening flows behave as documented

## Performance

- queue read, search, and ticket detail stay within p95 targets
- draft latency and worker lag stay within sprint budget

## Accessibility

- keyboard triage flow works end-to-end
- focus order is preserved on queue, detail, and approval screens
- contrast and live region updates meet WCAG goals

## Documentation And Evidence

- API reference matches changed endpoints
- environment variables reflect changed services or model routing
- architecture and flow docs reflect changed contracts or states
- sprint evidence records what planning, implementation, and QA models contributed
