# Production Environment

- URL: `https://app.ai-support-ops.example`
- Release gate: tests, smoke checks, migration review, rollback plan.
- Checklist: backup healthy, alert rules active, status page updated, feature flags confirmed.
- Rollback: restore prior image, disable risky feature flags, verify queue processing and auth.
