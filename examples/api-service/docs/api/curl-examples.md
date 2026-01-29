# DataHub API Gateway - cURL Examples

## Overview

This document provides practical cURL examples for interacting with the DataHub API Gateway. All examples use `$API_KEY` as a placeholder for your actual API key.

---

## Setup

### Environment Variables

Set these environment variables before running the examples:

```bash
# Your DataHub API base URL
export DATAHUB_URL="https://api.datahub.example.com"

# Your API key
export API_KEY="dh_live_your_api_key_here"

# Admin key (for admin operations)
export ADMIN_KEY="dh_live_your_admin_key_here"
```

---

## Health Checks

### Basic Health Check

```bash
curl "$DATAHUB_URL/health"
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Readiness Check (Dependencies)

```bash
curl "$DATAHUB_URL/health/ready"
```

### Liveness Check (Uptime)

```bash
curl "$DATAHUB_URL/health/live"
```

---

## API Key Management

### Create a New API Key

```bash
curl -X POST "$DATAHUB_URL/api/v1/keys" \
  -H "X-API-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Backend Service Key",
    "description": "Used by the backend service for API calls",
    "scopes": ["read:requests", "write:requests"],
    "rateLimit": {
      "requestsPerMinute": 500,
      "requestsPerHour": 25000
    },
    "metadata": {
      "service": "backend",
      "environment": "production"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
    "apiKey": "dh_live_abc123xyz789def456uvw012ghi345jkl678",
    "keyPrefix": "dh_live_abc1...",
    "name": "Backend Service Key",
    "status": "active",
    "scopes": ["read:requests", "write:requests"],
    "rateLimit": {
      "requestsPerMinute": 500,
      "requestsPerHour": 25000,
      "requestsPerDay": 100000
    },
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### Create Key with Expiration

```bash
curl -X POST "$DATAHUB_URL/api/v1/keys" \
  -H "X-API-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Temporary Key",
    "scopes": ["read:requests"],
    "expiresAt": "2024-02-15T00:00:00Z"
  }'
```

### List All API Keys

```bash
curl "$DATAHUB_URL/api/v1/keys" \
  -H "X-API-Key: $ADMIN_KEY"
```

### List Active Keys with Search

```bash
curl "$DATAHUB_URL/api/v1/keys?status=active&search=backend&pageSize=10" \
  -H "X-API-Key: $ADMIN_KEY"
```

### Get Single Key Details

```bash
curl "$DATAHUB_URL/api/v1/keys/key_01H5X4Y6Z8A9B0C1D2E3F4G5H6" \
  -H "X-API-Key: $ADMIN_KEY"
```

### Update API Key

```bash
curl -X PUT "$DATAHUB_URL/api/v1/keys/key_01H5X4Y6Z8A9B0C1D2E3F4G5H6" \
  -H "X-API-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Key Name",
    "description": "New description",
    "metadata": {
      "team": "platform",
      "updated": "2024-01-15"
    }
  }'
```

### Revoke API Key

```bash
curl -X DELETE "$DATAHUB_URL/api/v1/keys/key_01H5X4Y6Z8A9B0C1D2E3F4G5H6" \
  -H "X-API-Key: $ADMIN_KEY"
```

### Rotate API Key

Rotate a key with a 24-hour deprecation period:

```bash
curl -X POST "$DATAHUB_URL/api/v1/keys/key_01H5X4Y6Z8A9B0C1D2E3F4G5H6/rotate" \
  -H "X-API-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "deprecationPeriod": 86400
  }'
```

Rotate with a 1-hour deprecation period (emergency):

```bash
curl -X POST "$DATAHUB_URL/api/v1/keys/key_01H5X4Y6Z8A9B0C1D2E3F4G5H6/rotate" \
  -H "X-API-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "deprecationPeriod": 3600
  }'
```

---

## Request Logs

### List Recent Requests

```bash
curl "$DATAHUB_URL/api/v1/requests?pageSize=20" \
  -H "X-API-Key: $API_KEY"
```

### Filter Requests by API Key

```bash
curl "$DATAHUB_URL/api/v1/requests?keyId=key_01H5X4Y6Z8A9B0C1D2E3F4G5H6" \
  -H "X-API-Key: $API_KEY"
```

### Filter Failed Requests (5xx)

```bash
curl "$DATAHUB_URL/api/v1/requests?status=500" \
  -H "X-API-Key: $API_KEY"
```

### Filter Requests by Date Range

```bash
curl "$DATAHUB_URL/api/v1/requests?startDate=2024-01-15T00:00:00Z&endDate=2024-01-15T23:59:59Z" \
  -H "X-API-Key: $API_KEY"
```

### Filter Rate-Limited Requests

```bash
curl "$DATAHUB_URL/api/v1/requests?rateLimited=true" \
  -H "X-API-Key: $API_KEY"
```

### Get Single Request Details

```bash
curl "$DATAHUB_URL/api/v1/requests/req_01H5X4Y6Z8A9B0C1D2E3F4G5H6" \
  -H "X-API-Key: $API_KEY"
```

### Get Request Statistics

Hourly stats for the last 24 hours:

```bash
curl "$DATAHUB_URL/api/v1/requests/stats?period=hour&startDate=$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ)" \
  -H "X-API-Key: $API_KEY"
```

Stats for a specific key:

```bash
curl "$DATAHUB_URL/api/v1/requests/stats?keyId=key_01H5X4Y6Z8A9B0C1D2E3F4G5H6&period=day" \
  -H "X-API-Key: $API_KEY"
```

---

## Webhooks

### Create a Webhook

```bash
curl -X POST "$DATAHUB_URL/api/v1/webhooks" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Security Alerts",
    "url": "https://hooks.example.com/datahub/security",
    "events": ["key.created", "key.revoked", "key.rotated"],
    "secret": "whsec_my_webhook_secret_123"
  }'
```

### Create Webhook with Custom Headers

```bash
curl -X POST "$DATAHUB_URL/api/v1/webhooks" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Slack Integration",
    "url": "https://hooks.slack.com/services/XXX/YYY/ZZZ",
    "events": ["key.created"],
    "headers": {
      "X-Slack-Token": "my-slack-token"
    }
  }'
```

### List Webhooks

```bash
curl "$DATAHUB_URL/api/v1/webhooks" \
  -H "X-API-Key: $API_KEY"
```

### Get Webhook Details

```bash
curl "$DATAHUB_URL/api/v1/webhooks/whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6" \
  -H "X-API-Key: $API_KEY"
```

### Update Webhook

```bash
curl -X PUT "$DATAHUB_URL/api/v1/webhooks/whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Webhook Name",
    "enabled": true,
    "events": ["key.created", "key.revoked"]
  }'
```

### Disable Webhook

```bash
curl -X PUT "$DATAHUB_URL/api/v1/webhooks/whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": false
  }'
```

### Delete Webhook

```bash
curl -X DELETE "$DATAHUB_URL/api/v1/webhooks/whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6" \
  -H "X-API-Key: $API_KEY"
```

### Test Webhook Delivery

```bash
curl -X POST "$DATAHUB_URL/api/v1/webhooks/whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6/test" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "event": "test.ping",
    "payload": {
      "message": "Test webhook delivery"
    }
  }'
```

### List Webhook Deliveries

```bash
curl "$DATAHUB_URL/api/v1/webhooks/whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6/deliveries" \
  -H "X-API-Key: $API_KEY"
```

### Filter Failed Deliveries

```bash
curl "$DATAHUB_URL/api/v1/webhooks/whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6/deliveries?status=failed" \
  -H "X-API-Key: $API_KEY"
```

### Retry Failed Delivery

```bash
curl -X POST "$DATAHUB_URL/api/v1/webhooks/whk_01H5X4Y6Z8A9B0C1D2E3F4G5H6/deliveries/del_01H5X4Y6Z8A9B0C1D2E3F4G5H6/retry" \
  -H "X-API-Key: $API_KEY"
```

---

## Rate Limits

### Check Current Rate Limit Status

```bash
curl "$DATAHUB_URL/api/v1/rate-limits/status" \
  -H "X-API-Key: $API_KEY"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "limits": {
      "perMinute": {
        "limit": 100,
        "remaining": 85,
        "reset": 1705315860
      },
      "perHour": {
        "limit": 5000,
        "remaining": 4950,
        "reset": 1705317600
      }
    }
  }
}
```

### Update Rate Limits for a Key (Admin)

```bash
curl -X PUT "$DATAHUB_URL/api/v1/rate-limits/keys/key_01H5X4Y6Z8A9B0C1D2E3F4G5H6" \
  -H "X-API-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "requestsPerMinute": 1000,
    "requestsPerHour": 50000
  }'
```

---

## Useful Shell Scripts

### Check API Health

```bash
#!/bin/bash
# health-check.sh

DATAHUB_URL="${DATAHUB_URL:-https://api.datahub.example.com}"

echo "Checking DataHub health..."

# Basic health
HEALTH=$(curl -s "$DATAHUB_URL/health")
echo "Health: $(echo $HEALTH | jq -r '.status')"

# Readiness
READY=$(curl -s "$DATAHUB_URL/health/ready")
echo "Database: $(echo $READY | jq -r '.checks.database')"
echo "Redis: $(echo $READY | jq -r '.checks.redis')"
```

### List All Active Keys

```bash
#!/bin/bash
# list-keys.sh

curl -s "$DATAHUB_URL/api/v1/keys?status=active" \
  -H "X-API-Key: $ADMIN_KEY" | jq -r '.data[] | "\(.id)\t\(.name)\t\(.lastUsedAt)"'
```

### Monitor Error Rate

```bash
#!/bin/bash
# monitor-errors.sh

while true; do
  STATS=$(curl -s "$DATAHUB_URL/api/v1/requests/stats?period=minute" \
    -H "X-API-Key: $API_KEY")

  TOTAL=$(echo $STATS | jq '.data.summary.totalRequests')
  ERRORS=$(echo $STATS | jq '.data.summary.failedRequests')

  if [ "$TOTAL" -gt 0 ]; then
    ERROR_RATE=$(echo "scale=2; $ERRORS * 100 / $TOTAL" | bc)
    echo "$(date): Error rate: ${ERROR_RATE}%"
  fi

  sleep 60
done
```

---

## Common Patterns

### Using jq for Response Processing

Extract just the API key from creation response:

```bash
NEW_KEY=$(curl -s -X POST "$DATAHUB_URL/api/v1/keys" \
  -H "X-API-Key: $ADMIN_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "Test", "scopes": ["read:requests"]}' | jq -r '.data.apiKey')

echo "New key: $NEW_KEY"
```

### Verbose Output for Debugging

```bash
curl -v "$DATAHUB_URL/api/v1/keys" \
  -H "X-API-Key: $API_KEY" 2>&1 | grep -E "^(<|>|{)"
```

### Check Rate Limit Headers

```bash
curl -i "$DATAHUB_URL/api/v1/rate-limits/status" \
  -H "X-API-Key: $API_KEY" 2>&1 | grep -i "x-ratelimit"
```

---

## Related Documentation

- [API Reference](./reference.md) - Complete endpoint documentation
- [Authentication Flow](../flows/authentication-flow.md) - How authentication works
- [User Journeys](../flows/user-journeys.md) - Common use cases

---

_This document provides practical cURL examples for the DataHub API Gateway._
