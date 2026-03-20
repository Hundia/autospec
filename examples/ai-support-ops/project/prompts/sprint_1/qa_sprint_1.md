# Sprint 1 QA Prompt: Intake, Routing, and SLA Control

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
### Ingest email ticket
```bash
curl -X POST http://localhost:3000/api/v1/tickets/intake \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"channel":"email","externalId":"msg_2001","subject":"Unable to reset API key","body":"Admin reset link fails","accountTier":"growth"}' \
# Expected HTTP 202
# {"ticketId":"tkt_201","status":"New"}
```
### List routed queue tickets
```bash
curl -X GET http://localhost:3000/api/v1/tickets?queue=billing&slaState=at-risk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
# Expected HTTP 200
# {"items":[...]}
```
### Dry route preview
```bash
curl -X POST http://localhost:3000/api/v1/rules/dry-run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"ruleId":"rule_sla_billing","ticketId":"tkt_201"}' \
# Expected HTTP 200
# {"matched":true,"actions":[...]}
```

## Review Focus
- verify state rules, RBAC, audit logging, and AI routing requirements
- ensure any `gpt-5.4` ticket received plan/review evidence
- confirm viewer data artifacts stay in sync with backlog and docs
