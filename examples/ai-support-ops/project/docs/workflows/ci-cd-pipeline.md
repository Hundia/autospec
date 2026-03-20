# CI/CD Pipeline

```text
Push/PR -> lint -> typecheck -> unit -> integration -> build -> image scan
-> deploy staging on develop
-> smoke tests
-> release tag deploys production
```

- Fail fast on lint or type errors.
- Publish coverage report and Docker image digest.
- Production deploy requires migration check, smoke test, and rollback command readiness.
