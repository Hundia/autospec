# Sprint 4 QA Prompt: QA, Compliance, and Analytics

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
### Submit QA review
```bash
curl -X POST http://localhost:3000/api/v1/qa/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"ticketId":"tkt_550","accuracy":5,"empathy":4,"compliance":5,"completeness":4}' \
# Expected HTTP 201
# {"reviewId":"qa_12"}
```
### Read analytics overview
```bash
curl -X GET http://localhost:3000/api/v1/analytics/overview?range=last-30-days \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
# Expected HTTP 200
# {"slaAttainment":0.97,"qaScore":93.5}
```
### Read audit events
```bash
curl -X GET http://localhost:3000/api/v1/audit/events?type=ai.draft.generated \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
# Expected HTTP 200
# {"items":[...]}
```

## Review Focus
- verify state rules, RBAC, audit logging, and AI routing requirements
- ensure any `gpt-5.4` ticket received plan/review evidence
- confirm viewer data artifacts stay in sync with backlog and docs
