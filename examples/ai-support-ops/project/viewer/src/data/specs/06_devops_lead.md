# DevOps Lead Spec - AI Support Ops

## Infrastructure Diagram
```text
CloudFront/CDN -> ALB -> web service
                       -> api service -> PostgreSQL
                                      -> Redis/BullMQ
                                      -> S3 storage
                                      -> CloudWatch/OpenSearch
                                      -> external SaaS integrations
```

## CI/CD
- Stages: lint -> typecheck -> unit -> integration -> build -> image scan -> deploy -> smoke test.
- Triggers: PR to main for checks, merge to develop for staging, release tag for production.
- Artifacts: coverage report, build bundle, Docker images, migration plan, smoke test logs.

## Docker
- API and worker use Node 22 slim multi-stage builds.
- Web uses Vite build served by nginx.
- Compose services: postgres, redis, minio, api, worker, web.

## Environment Matrix
| Area | Dev | Staging | Prod |
| --- | --- | --- | --- |
| Auth | local login | SAML sandbox | enterprise SSO |
| Data | seeded sample | masked copy | live tenant data |
| AI | sandbox keys | capped usage | governed quotas |
| Observability | stdout + local UI | full metrics | full metrics + alerts |

## Deployment Strategy
- Rolling deploy for web and API.
- Zero-downtime migration policy for schema changes.
- Blue-green optional for high-risk auth changes.

## Monitoring and Alerts
- Alert on p95 workspace > 2.5 s, draft latency > 6 s, queue lag > 30 s, SLA breach spike > 15 percent, auth error spike > 3x baseline.
- Structured JSON logs with request id, tenant id, actor id, model version, and action type.
- Backups: nightly full PostgreSQL backup, 15-minute WAL archive, object storage versioning.
- Recovery targets: RPO 15 minutes, RTO 2 hours.

## Copilot Routing
- gpt-5.4 for pipeline design, security posture, and incident debugging.
- gpt-5.3 for Terraform-adjacent docs, deployment scripts, and standard observability work.
- gpt-5.2 for Dockerfiles, compose updates, and runbook editing.
