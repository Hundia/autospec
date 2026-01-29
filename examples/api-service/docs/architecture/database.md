# DataHub API Gateway - Database Architecture

## Overview

DataHub uses PostgreSQL as the primary data store for persistent data and Redis for caching and rate limiting. This document covers the complete database design.

---

## Entity Relationship Diagram

```
+------------------+       +----------------------+
|    api_keys      |       |    request_logs      |
+------------------+       +----------------------+
| PK id            |<------| FK api_key_id        |
|    key_hash      |       | PK id                |
|    key_prefix    |       |    method            |
|    name          |       |    path              |
|    status        |       |    status_code       |
|    scopes[]      |       |    duration_ms       |
|    rate_limits   |       |    ip_address        |
|    metadata      |       |    timestamp         |
|    created_at    |       +----------------------+
|    expires_at    |
+--------+---------+
         |
         |                 +----------------------+
         +---------------->|      webhooks        |
         |                 +----------------------+
         |                 | PK id                |
         |                 | FK api_key_id        |
         |                 |    name              |
         |                 |    url               |
         |                 |    secret            |
         |                 |    enabled           |
         |                 |    status            |
         |                 +----------+-----------+
         |                            |
         |                            |
         |                 +----------v-----------+
         |                 |   webhook_events     |
         |                 +----------------------+
         |                 | FK webhook_id        |
         |                 |    event_type        |
         |                 +----------------------+
         |                            |
         |                 +----------v-----------+
         |                 | webhook_deliveries   |
         |                 +----------------------+
         |                 | FK webhook_id        |
         |                 | PK id                |
         |                 |    event_type        |
         |                 |    status            |
         |                 |    attempt           |
         |                 |    response_status   |
         |                 +----------------------+
         |
         |                 +----------------------+
         +---------------->|     audit_logs       |
                           +----------------------+
                           | PK id                |
                           |    actor_id          |
                           |    action            |
                           |    resource_type     |
                           |    resource_id       |
                           |    old_values        |
                           |    new_values        |
                           +----------------------+
```

---

## Core Tables

### api_keys

Primary table for API key storage and configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(32) | PRIMARY KEY | ULID format: key_01H5X4... |
| key_hash | VARCHAR(64) | NOT NULL, UNIQUE | SHA-256 hash |
| key_prefix | VARCHAR(20) | NOT NULL | First 12 chars for display |
| name | VARCHAR(100) | NOT NULL | Human-readable name |
| description | TEXT | | Optional description |
| status | VARCHAR(20) | NOT NULL | active/deprecated/revoked/expired |
| scopes | TEXT[] | NOT NULL | Permission scopes array |
| rate_limit_minute | INTEGER | NOT NULL | Requests per minute |
| rate_limit_hour | INTEGER | NOT NULL | Requests per hour |
| rate_limit_day | INTEGER | NOT NULL | Requests per day |
| metadata | JSONB | NOT NULL | Custom key-value data |
| total_requests | BIGINT | NOT NULL | Lifetime request count |
| last_used_at | TIMESTAMPTZ | | Last authentication time |
| created_at | TIMESTAMPTZ | NOT NULL | Creation timestamp |
| expires_at | TIMESTAMPTZ | | Expiration time |
| revoked_at | TIMESTAMPTZ | | Revocation time |

**Indexes:**

```sql
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_status ON api_keys(status);
CREATE INDEX idx_api_keys_created_at ON api_keys(created_at DESC);
CREATE INDEX idx_api_keys_expires_at ON api_keys(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_api_keys_scopes ON api_keys USING GIN(scopes);
```

---

### request_logs

Partitioned table for API request/response logging.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(32) | PRIMARY KEY | ULID format: req_01H5X4... |
| api_key_id | VARCHAR(32) | FK (SET NULL) | Reference to api_keys |
| method | VARCHAR(10) | NOT NULL | HTTP method |
| path | VARCHAR(2000) | NOT NULL | Request path |
| query_params | JSONB | NOT NULL | URL query parameters |
| headers | JSONB | NOT NULL | Request headers (sanitized) |
| body | JSONB | | Request body |
| ip_address | INET | NOT NULL | Client IP |
| user_agent | VARCHAR(500) | | User agent string |
| status_code | SMALLINT | NOT NULL | HTTP response status |
| response_body | JSONB | | Response body |
| duration_ms | INTEGER | NOT NULL | Request duration |
| rate_limited | BOOLEAN | NOT NULL | Was rate limited |
| created_date | DATE | NOT NULL | Partition key |

**Partitioning Strategy:**

```sql
-- Monthly partitions for efficient data retention
CREATE TABLE request_logs (
    ...
) PARTITION BY RANGE (created_date);

-- Create partitions
CREATE TABLE request_logs_2024_01 PARTITION OF request_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

**Indexes:**

```sql
CREATE INDEX idx_request_logs_api_key_id ON request_logs(api_key_id);
CREATE INDEX idx_request_logs_started_at ON request_logs(started_at DESC);
CREATE INDEX idx_request_logs_status_code ON request_logs(status_code);
CREATE INDEX idx_request_logs_key_time ON request_logs(api_key_id, started_at DESC);
```

---

### webhooks

Webhook subscription configuration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(32) | PRIMARY KEY | ULID format: whk_01H5X4... |
| api_key_id | VARCHAR(32) | FK (CASCADE) | Owner API key |
| name | VARCHAR(100) | NOT NULL | Webhook name |
| url | VARCHAR(2000) | NOT NULL | Delivery URL (HTTPS) |
| secret | VARCHAR(64) | | HMAC signing secret |
| headers | JSONB | NOT NULL | Custom headers |
| enabled | BOOLEAN | NOT NULL | Active status |
| status | VARCHAR(20) | NOT NULL | active/paused/failing |
| max_retries | SMALLINT | NOT NULL | Max delivery attempts |
| timeout_ms | INTEGER | NOT NULL | Delivery timeout |
| total_deliveries | BIGINT | NOT NULL | Total delivery count |
| successful_deliveries | BIGINT | NOT NULL | Success count |
| last_delivery_at | TIMESTAMPTZ | | Last delivery time |

---

### webhook_deliveries

Webhook delivery attempts and results.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(32) | PRIMARY KEY | ULID format: del_01H5X4... |
| webhook_id | VARCHAR(32) | FK (CASCADE) | Parent webhook |
| event_type | VARCHAR(100) | NOT NULL | Event that triggered |
| payload | JSONB | NOT NULL | Delivered payload |
| status | VARCHAR(20) | NOT NULL | pending/success/failed |
| attempt | SMALLINT | NOT NULL | Current attempt number |
| response_status | SMALLINT | | HTTP response code |
| response_body | TEXT | | Response content |
| duration_ms | INTEGER | | Delivery duration |
| error_message | TEXT | | Error if failed |
| scheduled_at | TIMESTAMPTZ | NOT NULL | Scheduled delivery time |
| completed_at | TIMESTAMPTZ | | Completion time |

---

### audit_logs

Audit trail for sensitive operations.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR(32) | PRIMARY KEY | ULID format |
| actor_type | VARCHAR(20) | NOT NULL | api_key/system/admin |
| actor_id | VARCHAR(32) | | Actor identifier |
| actor_ip | INET | | Actor IP address |
| action | VARCHAR(50) | NOT NULL | key.create, key.revoke, etc. |
| resource_type | VARCHAR(50) | NOT NULL | api_key, webhook, etc. |
| resource_id | VARCHAR(32) | | Affected resource |
| old_values | JSONB | | State before change |
| new_values | JSONB | | State after change |
| created_at | TIMESTAMPTZ | NOT NULL | Event timestamp |

---

## Redis Schema

### Rate Limiting Keys

```
# Sliding window rate limit (sorted sets)
datahub:rl:min:{key_id}     # Per-minute counter
datahub:rl:hour:{key_id}    # Per-hour counter
datahub:rl:day:{key_id}     # Per-day counter

# Entry format
Member: {timestamp}:{request_uuid}
Score:  timestamp_ms
TTL:    window_size + 60s buffer
```

### Cache Keys

```
# API key cache (JSON string)
datahub:cache:key:{key_hash}
TTL: 5 minutes

# Webhook config cache (JSON string)
datahub:cache:webhook:{webhook_id}
TTL: 10 minutes

# Rate limit config cache (JSON string)
datahub:cache:ratelimit:{target_type}:{target_value}
TTL: 5 minutes
```

---

## Common Query Patterns

### Find Key by Hash

```sql
SELECT * FROM api_keys
WHERE key_hash = $1
  AND status = 'active'
  AND (expires_at IS NULL OR expires_at > NOW());
```

### List Keys with Pagination

```sql
SELECT id, key_prefix, name, status, scopes, created_at
FROM api_keys
WHERE status = ANY($1)
  AND (name ILIKE $2 OR description ILIKE $2)
ORDER BY created_at DESC
LIMIT $3 OFFSET $4;
```

### Request Log Statistics

```sql
SELECT
    DATE_TRUNC('hour', started_at) as time_bucket,
    COUNT(*) as total_requests,
    COUNT(*) FILTER (WHERE status_code >= 500) as errors,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY duration_ms) as p95_latency
FROM request_logs
WHERE api_key_id = $1
  AND started_at >= $2
  AND started_at < $3
GROUP BY time_bucket
ORDER BY time_bucket;
```

---

## Data Retention Policy

| Table | Retention | Cleanup Method |
|-------|-----------|----------------|
| api_keys | Indefinite | Soft delete (status=revoked) |
| request_logs | 30 days | Partition drop |
| webhook_deliveries | 30 days | Partition drop |
| audit_logs | 1 year | Partition drop |

---

## Connection Pool Configuration

```typescript
// Recommended production settings
const poolConfig = {
  max: 20,              // Max connections
  min: 5,               // Min idle connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};
```

---

## Related Documentation

- [Backend Architecture](./backend.md) - Repository layer details
- [Security Architecture](./security.md) - Data encryption
- [DevOps Spec](../../specs/06_devops_lead.md) - Backup procedures

---

_This document describes the database architecture for DataHub API Gateway._
