# DataHub cURL Examples

## Overview

Runnable cURL examples for all DataHub API Gateway endpoints.

---

## Environment Setup

```bash
# Set environment variables for easier testing
export DATAHUB_BASE_URL="http://localhost:3001"
export DATAHUB_ADMIN_URL="http://localhost:3002"
export DATAHUB_API_KEY="dh_dev_sk_test_abc123xyz789"
export DATAHUB_ACCESS_TOKEN="eyJhbGciOiJSUzI1NiIs..."
```

---

## Gateway API

### Health Check

```bash
# Basic health check
curl -X GET "${DATAHUB_BASE_URL}/health"

# Pretty-printed output
curl -s "${DATAHUB_BASE_URL}/health" | jq

# Expected response:
# {
#   "status": "healthy",
#   "version": "2.1.0",
#   "uptime": 86400,
#   "checks": {
#     "database": "healthy",
#     "redis": "healthy",
#     "timescale": "healthy"
#   }
# }
```

### Proxy Requests

```bash
# Basic proxy request
curl -X GET "${DATAHUB_BASE_URL}/api/proxy/users" \
  -H "X-API-Key: ${DATAHUB_API_KEY}"

# Proxy with custom request ID
curl -X GET "${DATAHUB_BASE_URL}/api/proxy/users/123" \
  -H "X-API-Key: ${DATAHUB_API_KEY}" \
  -H "X-Request-ID: custom-req-$(date +%s)"

# POST request through proxy
curl -X POST "${DATAHUB_BASE_URL}/api/proxy/users" \
  -H "X-API-Key: ${DATAHUB_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'

# PUT request through proxy
curl -X PUT "${DATAHUB_BASE_URL}/api/proxy/users/123" \
  -H "X-API-Key: ${DATAHUB_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated"
  }'

# DELETE request through proxy
curl -X DELETE "${DATAHUB_BASE_URL}/api/proxy/users/123" \
  -H "X-API-Key: ${DATAHUB_API_KEY}"

# Proxy to specific service
curl -X GET "${DATAHUB_BASE_URL}/api/proxy/products" \
  -H "X-API-Key: ${DATAHUB_API_KEY}" \
  -H "X-Target-Service: inventory-service"
```

### Check Rate Limit Headers

```bash
# Include response headers to see rate limits
curl -i -X GET "${DATAHUB_BASE_URL}/api/proxy/health" \
  -H "X-API-Key: ${DATAHUB_API_KEY}"

# Expected headers:
# X-Rate-Limit-Limit: 1000
# X-Rate-Limit-Remaining: 999
# X-Rate-Limit-Reset: 1705750860
# X-Response-Time: 45ms
```

---

## Authentication

### Admin Login

```bash
# Login to get access token
curl -X POST "${DATAHUB_ADMIN_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@datahub.io",
    "password": "your-secure-password"
  }'

# Expected response:
# {
#   "accessToken": "eyJhbGciOiJSUzI1NiIs...",
#   "refreshToken": "rt_abc123xyz789",
#   "expiresIn": 900
# }

# Store the token
export DATAHUB_ACCESS_TOKEN=$(curl -s -X POST "${DATAHUB_ADMIN_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@datahub.io", "password": "your-password"}' | jq -r '.accessToken')
```

### Refresh Token

```bash
# Refresh access token
curl -X POST "${DATAHUB_ADMIN_URL}/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "rt_abc123xyz789"
  }'
```

### Logout

```bash
# Logout and invalidate tokens
curl -X POST "${DATAHUB_ADMIN_URL}/auth/logout" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"
```

---

## API Key Management

### List API Keys

```bash
# List all API keys
curl -X GET "${DATAHUB_ADMIN_URL}/api/keys" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"

# With pagination
curl -X GET "${DATAHUB_ADMIN_URL}/api/keys?page=1&limit=10" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"

# Filter by status
curl -X GET "${DATAHUB_ADMIN_URL}/api/keys?status=active" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"

# Search by name
curl -X GET "${DATAHUB_ADMIN_URL}/api/keys?search=production" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"
```

### Create API Key

```bash
# Create basic API key
curl -X POST "${DATAHUB_ADMIN_URL}/api/keys" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Production API Key",
    "rateLimit": 1000
  }'

# Create API key with IP allowlist
curl -X POST "${DATAHUB_ADMIN_URL}/api/keys" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Restricted API Key",
    "rateLimit": 500,
    "allowedIPs": ["203.0.113.0/24", "198.51.100.10"]
  }'

# Create API key with origin restrictions
curl -X POST "${DATAHUB_ADMIN_URL}/api/keys" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Frontend API Key",
    "rateLimit": 2000,
    "allowedOrigins": ["https://app.example.com", "https://admin.example.com"]
  }'

# Create API key with metadata
curl -X POST "${DATAHUB_ADMIN_URL}/api/keys" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Team Backend Key",
    "rateLimit": 5000,
    "metadata": {
      "team": "backend",
      "project": "user-service",
      "environment": "production"
    }
  }'
```

### Get API Key Details

```bash
# Get single API key
curl -X GET "${DATAHUB_ADMIN_URL}/api/keys/key_abc123" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"

# Get key with usage statistics
curl -X GET "${DATAHUB_ADMIN_URL}/api/keys/key_abc123?include=usage" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"
```

### Update API Key

```bash
# Update rate limit
curl -X PATCH "${DATAHUB_ADMIN_URL}/api/keys/key_abc123" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "rateLimit": 2000
  }'

# Update name and status
curl -X PATCH "${DATAHUB_ADMIN_URL}/api/keys/key_abc123" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Key Name",
    "status": "active"
  }'

# Add IP restrictions
curl -X PATCH "${DATAHUB_ADMIN_URL}/api/keys/key_abc123" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "allowedIPs": ["203.0.113.50", "203.0.113.51"]
  }'
```

### Revoke API Key

```bash
# Revoke (soft delete)
curl -X PATCH "${DATAHUB_ADMIN_URL}/api/keys/key_abc123" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "revoked"
  }'

# Hard delete
curl -X DELETE "${DATAHUB_ADMIN_URL}/api/keys/key_abc123" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"
```

---

## Service Configuration

### List Services

```bash
# List all configured services
curl -X GET "${DATAHUB_ADMIN_URL}/api/services" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"
```

### Create Service

```bash
# Configure new upstream service
curl -X POST "${DATAHUB_ADMIN_URL}/api/services" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "User Service",
    "upstreamUrl": "https://users.internal.datahub.io",
    "healthEndpoint": "/health",
    "timeout": 30000,
    "retries": 3
  }'

# Configure service with circuit breaker
curl -X POST "${DATAHUB_ADMIN_URL}/api/services" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Payment Service",
    "upstreamUrl": "https://payments.internal.datahub.io",
    "healthEndpoint": "/health",
    "timeout": 60000,
    "retries": 2,
    "circuitBreaker": {
      "enabled": true,
      "threshold": 5,
      "timeout": 30000
    }
  }'
```

### Update Service

```bash
# Update service configuration
curl -X PATCH "${DATAHUB_ADMIN_URL}/api/services/svc_users" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "timeout": 45000,
    "retries": 5
  }'
```

---

## Analytics

### Request Analytics

```bash
# Get request analytics for today
curl -X GET "${DATAHUB_ADMIN_URL}/api/analytics/requests?from=$(date -I)&to=$(date -I)" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"

# Get analytics for specific API key
curl -X GET "${DATAHUB_ADMIN_URL}/api/analytics/requests?keyId=key_abc123&from=2024-01-01&to=2024-01-31" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"

# Get hourly analytics
curl -X GET "${DATAHUB_ADMIN_URL}/api/analytics/requests?interval=1h&from=2024-01-20&to=2024-01-21" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"
```

### Error Analytics

```bash
# Get error breakdown
curl -X GET "${DATAHUB_ADMIN_URL}/api/analytics/errors?from=2024-01-01&to=2024-01-31" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"
```

### Latency Analytics

```bash
# Get latency percentiles
curl -X GET "${DATAHUB_ADMIN_URL}/api/analytics/latency?from=2024-01-01&to=2024-01-31" \
  -H "Authorization: Bearer ${DATAHUB_ACCESS_TOKEN}"
```

---

## Testing Rate Limits

```bash
# Test rate limiting (send 110 requests quickly)
for i in {1..110}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
    "${DATAHUB_BASE_URL}/api/proxy/health" \
    -H "X-API-Key: ${DATAHUB_API_KEY}")
  echo "Request $i: $STATUS"
  if [ "$STATUS" = "429" ]; then
    echo "Rate limit hit at request $i"
    break
  fi
done

# Check remaining rate limit
curl -s -I "${DATAHUB_BASE_URL}/api/proxy/health" \
  -H "X-API-Key: ${DATAHUB_API_KEY}" | grep -i "x-rate-limit"
```

---

## Debugging

```bash
# Verbose output for debugging
curl -v -X GET "${DATAHUB_BASE_URL}/api/proxy/users" \
  -H "X-API-Key: ${DATAHUB_API_KEY}"

# Time the request
curl -w "\nTime: %{time_total}s\n" \
  "${DATAHUB_BASE_URL}/api/proxy/users" \
  -H "X-API-Key: ${DATAHUB_API_KEY}"

# Save response headers and body separately
curl -D headers.txt -o response.json \
  "${DATAHUB_BASE_URL}/api/proxy/users" \
  -H "X-API-Key: ${DATAHUB_API_KEY}"
```

---

## Related Documents

- [API Reference](./reference.md)
- [Authentication](./authentication.md)
- [Error Codes](./error-codes.md)
- [Rate Limiting](./rate-limiting.md)
