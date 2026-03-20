# Environment Variables

| Name | Required | Example | Purpose |
| --- | --- | --- | --- |
| APP_ENV | yes | production | environment name |
| PORT | yes | 3000 | api port |
| DATABASE_URL | yes | postgres://user:pass@db/app | postgres connection |
| REDIS_URL | yes | redis://redis:6379 | redis and BullMQ |
| S3_ENDPOINT | yes | https://s3.local | object storage endpoint |
| S3_BUCKET | yes | ai-support-ops-files | attachment bucket |
| JWT_ISSUER | yes | ai-support-ops | access token issuer |
| JWT_ACCESS_TTL_MIN | yes | 15 | access token ttl |
| JWT_REFRESH_TTL_DAYS | yes | 7 | refresh session ttl |
| SAML_ENTRYPOINT | no | https://idp.example/sso | saml login url |
| SAML_CERT | no | -----BEGIN CERTIFICATE----- | saml cert |
| AI_PLANNER_MODEL | yes | gpt-5.4 | planning and policy review model |
| AI_STANDARD_MODEL | yes | gpt-5.3 | standard execution model |
| AI_LIGHT_MODEL | yes | gpt-5.2 | docs, tests, boilerplate model |
| AI_DISABLED_QUEUES | no | billing-appeals | comma-separated queue disable list |
| RETENTION_DAYS_AUDIT | yes | 365 | audit retention |
