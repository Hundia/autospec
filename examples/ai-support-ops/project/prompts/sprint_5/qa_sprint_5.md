# Sprint 5 QA Prompt: Production Readiness and Launch

## Environment: vscode-copilot

## Read First
- `specs/*.md`
- `docs/testing/*`
- `docs/api/reference.md`
- `docs/api/error-codes.md`
- `docs/architecture/security.md`
- `docs/workflows/qa-review.md`

## Setup
```bash
docker compose up -d postgres redis minio
npm run db:migrate
npm run db:seed
npm run dev
curl http://localhost:3000/health
```

## Automated Checks
```bash
npm run lint
npm run typecheck
npm run test:unit
npm run test:integration
npm run build
```

## Curl Validation
### Refresh enterprise session
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
# Expected HTTP 200
# {"accessToken":"..."}
```
### Read health with dependencies
```bash
curl -X GET http://localhost:3000/health?verbose=true \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
# Expected HTTP 200
# {"status":"ok","db":"ok","redis":"ok"}
```
### Read final analytics overview
```bash
curl -X GET http://localhost:3000/api/v1/analytics/overview?range=last-7-days \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
# Expected HTTP 200
# {"aiAcceptanceRate":0.58}
```

## Review Focus
- verify state rules, RBAC, audit logging, and AI routing requirements
- ensure any `gpt-5.4` ticket received plan/review evidence
- confirm viewer data artifacts stay in sync with backlog and docs
