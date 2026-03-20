# Sprint 3 QA Prompt: Knowledge, Automation, and Escalations

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
### Create article draft
```bash
curl -X POST http://localhost:3000/api/v1/knowledge/articles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Refund exceptions","category":"billing","reviewDate":"2026-04-01"}' \
# Expected HTTP 201
# {"articleId":"kb_101","status":"draft"}
```
### Dry-run automation rule
```bash
curl -X POST http://localhost:3000/api/v1/rules/dry-run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"trigger":"ticket.updated","sampleTicketId":"tkt_440"}' \
# Expected HTTP 200
# {"matched":true,"prevented":false}
```
### Escalate ticket
```bash
curl -X POST http://localhost:3000/api/v1/tickets/tkt_440/escalate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"targetTeam":"engineering","reason":"incident-correlation"}' \
# Expected HTTP 200
# {"status":"Escalated"}
```

## Review Focus
- verify state rules, RBAC, audit logging, and AI routing requirements
- ensure any `gpt-5.4` ticket received plan/review evidence
- confirm viewer data artifacts stay in sync with backlog and docs
