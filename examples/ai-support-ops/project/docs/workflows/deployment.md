# Deployment Workflow

- Dev deploy: local compose or preview environment.
- Staging: merge to `develop`, run seed and smoke checks.
- Production: create release tag after QA pass and rollback validation.
- Rollback: restore prior image, disable risky feature flags, verify queue processing and auth.
