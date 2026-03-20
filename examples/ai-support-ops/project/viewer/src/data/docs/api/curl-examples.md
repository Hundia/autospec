# Curl Examples

## Health
```bash
curl http://localhost:3000/health
```

## Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login   -H "Content-Type: application/json"   -d '{"email":"maya@acme.io","password":"Secret123!"}'
```

## Intake Ticket
```bash
curl -X POST http://localhost:3000/api/v1/tickets/intake   -H "Content-Type: application/json"   -H "X-API-Key: local-dev-key"   -d '{"channel":"email","externalId":"msg_1001","subject":"Refund blocked","body":"Customer asks for refund exception","accountTier":"enterprise"}'
```

## Draft Reply
```bash
curl -X POST http://localhost:3000/api/v1/tickets/tkt_123/draft   -H "Content-Type: application/json"   -H "Authorization: Bearer $TOKEN"   -d '{"mode":"reply","intent":"refund-policy-question"}'
```
