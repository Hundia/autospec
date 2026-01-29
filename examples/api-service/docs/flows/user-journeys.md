# DataHub API Gateway - User Journeys

## Overview

This document maps the key user journeys through the DataHub API Gateway, organized by persona. Each journey describes the steps, API calls, and expected outcomes.

---

## Persona: Platform Developer (Alex)

### Journey 1: First-Time API Key Setup

**Goal**: Alex needs to get started with DataHub and secure his first API endpoint.

```
Step 1: Request Admin Credentials
        |
        | (Obtain admin key from system admin)
        v
Step 2: Create First API Key
        |
        | POST /api/v1/keys
        | { "name": "Alex Dev Key", "scopes": ["read:requests", "write:requests"] }
        v
Step 3: Receive API Key
        |
        | Response includes: apiKey: "dh_live_abc123..."
        | (Store securely - only shown once!)
        v
Step 4: Test Authentication
        |
        | GET /api/v1/rate-limits/status
        | X-API-Key: dh_live_abc123...
        v
Step 5: Verify Success
        |
        | Response: { "success": true, "data": { "limits": {...} } }
        |
        v
    Journey Complete
```

**API Calls:**

```bash
# Step 2: Create API key
curl -X POST https://api.datahub.example.com/api/v1/keys \
  -H "X-API-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alex Dev Key",
    "scopes": ["read:requests", "write:requests"]
  }'

# Step 4: Test the new key
curl https://api.datahub.example.com/api/v1/rate-limits/status \
  -H "X-API-Key: dh_live_abc123..."
```

---

### Journey 2: Debugging Production Issue

**Goal**: Alex needs to investigate why certain API calls are failing.

```
Step 1: Identify Time Window
        |
        | (User reports issues between 2pm-3pm)
        v
Step 2: Query Request Logs
        |
        | GET /api/v1/requests?status=500&startDate=2024-01-15T14:00:00Z
        v
Step 3: Analyze Failed Requests
        |
        | Review response.body for error details
        | Note patterns: path, keyId, error codes
        v
Step 4: Get Statistics
        |
        | GET /api/v1/requests/stats?keyId=key_123&period=hour
        v
Step 5: Identify Root Cause
        |
        | Spike in 500 errors correlates with deployment
        v
Step 6: Check Specific Key
        |
        | GET /api/v1/keys/key_123
        | Verify key status and rate limits
        |
        v
    Issue Identified
```

**API Calls:**

```bash
# Step 2: Get failed requests
curl "https://api.datahub.example.com/api/v1/requests?status=500&startDate=2024-01-15T14:00:00Z&pageSize=100" \
  -H "X-API-Key: $API_KEY"

# Step 4: Get statistics
curl "https://api.datahub.example.com/api/v1/requests/stats?keyId=key_123&period=hour&startDate=2024-01-15T13:00:00Z" \
  -H "X-API-Key: $API_KEY"

# Step 6: Check key details
curl "https://api.datahub.example.com/api/v1/keys/key_123" \
  -H "X-API-Key: $ADMIN_KEY"
```

---

## Persona: DevOps Engineer (Jordan)

### Journey 3: Setting Up Webhook Notifications

**Goal**: Jordan wants to receive alerts when API keys are created or revoked.

```
Step 1: Create Webhook Endpoint
        |
        | (Deploy receiving endpoint: https://alerts.company.com/webhook)
        v
Step 2: Register Webhook
        |
        | POST /api/v1/webhooks
        | { "url": "https://alerts.company.com/webhook",
        |   "events": ["key.created", "key.revoked"] }
        v
Step 3: Receive Webhook Secret
        |
        | Save secret for signature verification
        v
Step 4: Test Webhook
        |
        | POST /api/v1/webhooks/:id/test
        v
Step 5: Verify Delivery
        |
        | Check alerts endpoint received test payload
        v
Step 6: Monitor Deliveries
        |
        | GET /api/v1/webhooks/:id/deliveries
        |
        v
    Webhook Active
```

**API Calls:**

```bash
# Step 2: Register webhook
curl -X POST https://api.datahub.example.com/api/v1/webhooks \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Security Alerts",
    "url": "https://alerts.company.com/webhook",
    "events": ["key.created", "key.revoked"],
    "secret": "whsec_mywebhooksecret123"
  }'

# Step 4: Test webhook
curl -X POST https://api.datahub.example.com/api/v1/webhooks/whk_abc123/test \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"event": "test.ping"}'

# Step 6: Check deliveries
curl https://api.datahub.example.com/api/v1/webhooks/whk_abc123/deliveries \
  -H "X-API-Key: $API_KEY"
```

---

### Journey 4: Monitoring System Health

**Goal**: Jordan wants to verify the API gateway is operating correctly.

```
Step 1: Check Basic Health
        |
        | GET /health
        | (No authentication required)
        v
Step 2: Check Dependencies
        |
        | GET /health/ready
        | Verify database and Redis connections
        v
Step 3: Check Liveness
        |
        | GET /health/live
        | Verify uptime and responsiveness
        v
Step 4: Review Request Stats
        |
        | GET /api/v1/requests/stats?period=hour
        | Check error rates and latency
        v
Step 5: Configure Monitoring
        |
        | Set up Prometheus scraping on /metrics
        | Configure alerting rules
        |
        v
    Monitoring Active
```

---

## Persona: Security Engineer (Morgan)

### Journey 5: Security Audit

**Goal**: Morgan needs to audit API key usage and access patterns.

```
Step 1: List All Active Keys
        |
        | GET /api/v1/keys?status=active
        v
Step 2: Review Key Scopes
        |
        | Check for overly permissive scopes
        | Identify admin keys
        v
Step 3: Check Unused Keys
        |
        | GET /api/v1/keys?sortBy=lastUsedAt&sortOrder=asc
        | Identify keys not used in 30+ days
        v
Step 4: Review Request Logs
        |
        | GET /api/v1/requests?status=401&startDate=...
        | Check for authentication failures
        v
Step 5: Check Rate Limit Hits
        |
        | GET /api/v1/requests?rateLimited=true
        | Identify potential abuse
        v
Step 6: Generate Report
        |
        | Export audit findings
        | Recommend key revocations
        |
        v
    Audit Complete
```

---

### Journey 6: Key Rotation

**Goal**: Morgan needs to rotate a potentially compromised API key.

```
Step 1: Identify Compromised Key
        |
        | GET /api/v1/keys/key_compromised
        | Document current configuration
        v
Step 2: Initiate Rotation
        |
        | POST /api/v1/keys/key_compromised/rotate
        | Set deprecation period: 24 hours
        v
Step 3: Receive New Key
        |
        | Response includes new key credentials
        v
Step 4: Update Applications
        |
        | Deploy new key to affected services
        | (24-hour window while old key still works)
        v
Step 5: Verify New Key Works
        |
        | Test API calls with new key
        v
Step 6: Monitor Old Key Usage
        |
        | GET /api/v1/requests?keyId=key_old
        | Ensure traffic migrates to new key
        v
Step 7: Old Key Auto-Revokes
        |
        | After deprecation period expires
        |
        v
    Rotation Complete
```

**API Calls:**

```bash
# Step 2: Rotate the key
curl -X POST https://api.datahub.example.com/api/v1/keys/key_compromised/rotate \
  -H "X-API-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"deprecationPeriod": 86400}'

# Response:
# {
#   "newKey": { "id": "key_new", "apiKey": "dh_live_new..." },
#   "oldKey": { "id": "key_old", "status": "deprecated", "expiresAt": "..." }
# }
```

---

## Persona: API Product Manager (Sam)

### Journey 7: Partner Onboarding

**Goal**: Sam needs to provision API access for a new partner integration.

```
Step 1: Determine Access Level
        |
        | Partner needs: read:requests, write:webhooks
        | Rate limit: 1000 req/min (premium tier)
        v
Step 2: Create Partner Key
        |
        | POST /api/v1/keys
        | Include partner metadata for tracking
        v
Step 3: Document Key Details
        |
        | Record key ID (not the key itself)
        | Note expiration date if set
        v
Step 4: Communicate to Partner
        |
        | Send API key securely (one-time view)
        | Share API documentation
        v
Step 5: Monitor Adoption
        |
        | GET /api/v1/requests/stats?keyId=key_partner
        | Track usage patterns
        v
Step 6: Adjust Limits if Needed
        |
        | PUT /api/v1/rate-limits/keys/key_partner
        |
        v
    Partner Onboarded
```

**API Calls:**

```bash
# Step 2: Create partner key with metadata
curl -X POST https://api.datahub.example.com/api/v1/keys \
  -H "X-API-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Partner: Acme Corp",
    "description": "API access for Acme Corp integration",
    "scopes": ["read:requests", "write:webhooks"],
    "rateLimit": {
      "requestsPerMinute": 1000,
      "requestsPerHour": 50000
    },
    "metadata": {
      "partner": "acme-corp",
      "contract": "PARTNER-2024-001",
      "tier": "premium"
    },
    "expiresAt": "2025-01-15T00:00:00Z"
  }'
```

---

## Journey Summary Matrix

| Persona | Journey | Primary Endpoints Used |
|---------|---------|----------------------|
| Developer | First-Time Setup | POST /keys, GET /rate-limits/status |
| Developer | Debug Issues | GET /requests, GET /requests/stats |
| DevOps | Setup Webhooks | POST /webhooks, POST /webhooks/:id/test |
| DevOps | Monitor Health | GET /health, GET /requests/stats |
| Security | Audit | GET /keys, GET /requests |
| Security | Key Rotation | POST /keys/:id/rotate |
| Product | Partner Onboarding | POST /keys, GET /requests/stats |

---

## Related Documentation

- [Authentication Flow](./authentication-flow.md) - Detailed auth flow
- [Data Flow](./data-flow.md) - How data moves through the system
- [API Reference](../api/reference.md) - Complete endpoint documentation

---

_This document maps the key user journeys for DataHub API Gateway._
