# Sprint 2 QA Prompt: Agent Workspace and AI Assist

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
### Generate grounded draft
```bash
curl -X POST http://localhost:3000/api/v1/tickets/tkt_301/draft \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"mode":"reply","intent":"refund-policy-question"}' \
# Expected HTTP 200
# {"draftId":"drf_301","model":"gpt-5.3","warnings":["approval required"]}
```
### Approve outbound reply
```bash
curl -X POST http://localhost:3000/api/v1/tickets/tkt_301/approve-reply \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"decision":"approve","notes":"Policy exception allowed"}' \
# Expected HTTP 200
# {"approvalId":"apr_88","status":"approved"}
```
### Search knowledge
```bash
curl -X GET http://localhost:3000/api/v1/knowledge/articles?q=refund+exception \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
# Expected HTTP 200
# {"items":[...]}
```

## Review Focus
- verify state rules, RBAC, audit logging, and AI routing requirements
- ensure any `gpt-5.4` ticket received plan/review evidence
- confirm viewer data artifacts stay in sync with backlog and docs
