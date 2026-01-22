# DataHub API Gateway - Database Architecture

## Overview

This document defines the complete database architecture for DataHub API Gateway. The system uses PostgreSQL as the primary data store with Redis for caching and rate limiting.

**Database**: PostgreSQL 14+
**Connection Pool**: 20 connections (configurable)
**Migrations**: Sequential, versioned SQL files

---

## Schema Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DataHub Schema Overview                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐         ┌─────────────────────┐                    │
│  │  api_keys   │────────▶│   request_logs      │                    │
│  └─────────────┘         └─────────────────────┘                    │
│        │                                                             │
│        │                                                             │
│        ▼                                                             │
│  ┌─────────────┐         ┌─────────────────────┐                    │
│  │  webhooks   │────────▶│ webhook_deliveries  │                    │
│  └─────────────┘         └─────────────────────┘                    │
│        │                                                             │
│        │                                                             │
│        ▼                                                             │
│  ┌──────────────────┐    ┌─────────────────────┐                    │
│  │ webhook_events   │    │    rate_limits      │                    │
│  └──────────────────┘    └─────────────────────┘                    │
│                                                                      │
│  ┌─────────────────────┐                                            │
│  │    audit_logs       │                                            │
│  └─────────────────────┘                                            │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Core Tables

### 1. api_keys

Stores API key records for authentication.

```sql
CREATE TABLE api_keys (
    -- Primary identification
    id              VARCHAR(32) PRIMARY KEY,  -- ULID format: key_01H5X4Y6Z8...

    -- Key storage (hashed)
    key_hash        VARCHAR(64) NOT NULL UNIQUE,  -- SHA-256 hash
    key_prefix      VARCHAR(20) NOT NULL,         -- First 12 chars for display

    -- Descriptive fields
    name            VARCHAR(100) NOT NULL,
    description     TEXT,

    -- Status management
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
        -- CONSTRAINT: CHECK (status IN ('active', 'deprecated', 'revoked', 'expired'))

    -- Permissions
    scopes          TEXT[] NOT NULL DEFAULT '{}',

    -- Rate limiting
    rate_limit_minute   INTEGER NOT NULL DEFAULT 100,
    rate_limit_hour     INTEGER NOT NULL DEFAULT 5000,
    rate_limit_day      INTEGER NOT NULL DEFAULT 100000,
    burst_limit         INTEGER NOT NULL DEFAULT 10,

    -- Metadata
    metadata        JSONB NOT NULL DEFAULT '{}',

    -- Usage tracking
    total_requests      BIGINT NOT NULL DEFAULT 0,
    last_used_at        TIMESTAMPTZ,

    -- Lifecycle
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    deprecated_at   TIMESTAMPTZ,
    revoked_at      TIMESTAMPTZ,

    -- Rotation support
    rotated_from_id VARCHAR(32) REFERENCES api_keys(id),

    -- Constraints
    CONSTRAINT api_keys_status_check
        CHECK (status IN ('active', 'deprecated', 'revoked', 'expired')),
    CONSTRAINT api_keys_rate_limits_positive
        CHECK (rate_limit_minute > 0 AND rate_limit_hour > 0 AND rate_limit_day > 0)
);

-- Indexes
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_status ON api_keys(status);
CREATE INDEX idx_api_keys_created_at ON api_keys(created_at DESC);
CREATE INDEX idx_api_keys_expires_at ON api_keys(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_api_keys_last_used ON api_keys(last_used_at DESC);
CREATE INDEX idx_api_keys_scopes ON api_keys USING GIN(scopes);

-- Trigger for updated_at
CREATE TRIGGER api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

**Field Descriptions:**

| Field             | Type         | Description                       |
| ----------------- | ------------ | --------------------------------- |
| id                | VARCHAR(32)  | ULID-based unique identifier      |
| key_hash          | VARCHAR(64)  | SHA-256 hash of the API key       |
| key_prefix        | VARCHAR(20)  | Visible prefix for identification |
| name              | VARCHAR(100) | Human-readable key name           |
| description       | TEXT         | Optional detailed description     |
| status            | VARCHAR(20)  | Current key status                |
| scopes            | TEXT[]       | Array of permission scopes        |
| rate_limit_minute | INTEGER      | Max requests per minute           |
| rate_limit_hour   | INTEGER      | Max requests per hour             |
| rate_limit_day    | INTEGER      | Max requests per day              |
| burst_limit       | INTEGER      | Max concurrent requests           |
| metadata          | JSONB        | Custom key-value metadata         |
| total_requests    | BIGINT       | Lifetime request count            |
| last_used_at      | TIMESTAMPTZ  | Last successful authentication    |
| expires_at        | TIMESTAMPTZ  | Automatic expiration time         |
| rotated_from_id   | VARCHAR(32)  | Link to previous key (rotation)   |

---

### 2. request_logs

Stores all API request and response logs.

```sql
CREATE TABLE request_logs (
    -- Primary identification
    id              VARCHAR(32) PRIMARY KEY,  -- req_01H5X4Y6Z8...

    -- Relationship
    api_key_id      VARCHAR(32) REFERENCES api_keys(id) ON DELETE SET NULL,

    -- Request details
    method          VARCHAR(10) NOT NULL,
    path            VARCHAR(2000) NOT NULL,
    query_params    JSONB NOT NULL DEFAULT '{}',
    headers         JSONB NOT NULL DEFAULT '{}',
    body            JSONB,
    body_size       INTEGER NOT NULL DEFAULT 0,

    -- Client information
    ip_address      INET NOT NULL,
    user_agent      VARCHAR(500),

    -- Response details
    status_code     SMALLINT NOT NULL,
    response_headers JSONB NOT NULL DEFAULT '{}',
    response_body   JSONB,
    response_size   INTEGER NOT NULL DEFAULT 0,

    -- Performance metrics
    duration_ms     INTEGER NOT NULL,

    -- Rate limiting info
    rate_limit_remaining INTEGER,
    rate_limited    BOOLEAN NOT NULL DEFAULT FALSE,

    -- Error tracking
    error_code      VARCHAR(50),
    error_message   TEXT,

    -- Timestamps
    started_at      TIMESTAMPTZ NOT NULL,
    completed_at    TIMESTAMPTZ NOT NULL,

    -- Partitioning support
    created_date    DATE NOT NULL DEFAULT CURRENT_DATE
) PARTITION BY RANGE (created_date);

-- Create partitions (example for monthly partitioning)
CREATE TABLE request_logs_2024_01 PARTITION OF request_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE request_logs_2024_02 PARTITION OF request_logs
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
-- Continue for each month...

-- Indexes (on parent table, inherited by partitions)
CREATE INDEX idx_request_logs_api_key_id ON request_logs(api_key_id);
CREATE INDEX idx_request_logs_started_at ON request_logs(started_at DESC);
CREATE INDEX idx_request_logs_status_code ON request_logs(status_code);
CREATE INDEX idx_request_logs_method ON request_logs(method);
CREATE INDEX idx_request_logs_path ON request_logs(path);
CREATE INDEX idx_request_logs_ip_address ON request_logs(ip_address);
CREATE INDEX idx_request_logs_duration ON request_logs(duration_ms DESC);
CREATE INDEX idx_request_logs_rate_limited ON request_logs(rate_limited) WHERE rate_limited = TRUE;
CREATE INDEX idx_request_logs_error ON request_logs(error_code) WHERE error_code IS NOT NULL;

-- Composite indexes for common queries
CREATE INDEX idx_request_logs_key_time ON request_logs(api_key_id, started_at DESC);
CREATE INDEX idx_request_logs_path_time ON request_logs(path, started_at DESC);
```

**Field Descriptions:**

| Field            | Type          | Description                      |
| ---------------- | ------------- | -------------------------------- |
| id               | VARCHAR(32)   | ULID-based unique identifier     |
| api_key_id       | VARCHAR(32)   | Reference to authenticated key   |
| method           | VARCHAR(10)   | HTTP method (GET, POST, etc.)    |
| path             | VARCHAR(2000) | Request path                     |
| query_params     | JSONB         | URL query parameters             |
| headers          | JSONB         | Request headers (sanitized)      |
| body             | JSONB         | Request body (if applicable)     |
| body_size        | INTEGER       | Request body size in bytes       |
| ip_address       | INET          | Client IP address                |
| user_agent       | VARCHAR(500)  | Client user agent string         |
| status_code      | SMALLINT      | HTTP response status code        |
| response_headers | JSONB         | Response headers                 |
| response_body    | JSONB         | Response body                    |
| response_size    | INTEGER       | Response size in bytes           |
| duration_ms      | INTEGER       | Request duration in milliseconds |
| rate_limited     | BOOLEAN       | Whether request was rate limited |
| error_code       | VARCHAR(50)   | Error code if applicable         |

---

### 3. webhooks

Stores webhook subscription configurations.

```sql
CREATE TABLE webhooks (
    -- Primary identification
    id              VARCHAR(32) PRIMARY KEY,  -- whk_01H5X4Y6Z8...

    -- Ownership
    api_key_id      VARCHAR(32) NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,

    -- Configuration
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    url             VARCHAR(2000) NOT NULL,

    -- Security
    secret          VARCHAR(64),  -- For signature verification

    -- Custom headers
    headers         JSONB NOT NULL DEFAULT '{}',

    -- Status
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
        -- CONSTRAINT: CHECK (status IN ('active', 'paused', 'failing', 'disabled'))

    -- Retry configuration
    max_retries         SMALLINT NOT NULL DEFAULT 5,
    retry_delay_ms      INTEGER NOT NULL DEFAULT 1000,
    backoff_multiplier  DECIMAL(3,1) NOT NULL DEFAULT 2.0,
    timeout_ms          INTEGER NOT NULL DEFAULT 30000,

    -- Statistics (denormalized for performance)
    total_deliveries        BIGINT NOT NULL DEFAULT 0,
    successful_deliveries   BIGINT NOT NULL DEFAULT 0,
    failed_deliveries       BIGINT NOT NULL DEFAULT 0,
    last_delivery_at        TIMESTAMPTZ,
    last_success_at         TIMESTAMPTZ,
    last_failure_at         TIMESTAMPTZ,
    consecutive_failures    SMALLINT NOT NULL DEFAULT 0,

    -- Timestamps
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT webhooks_status_check
        CHECK (status IN ('active', 'paused', 'failing', 'disabled')),
    CONSTRAINT webhooks_retry_config_valid
        CHECK (max_retries BETWEEN 1 AND 10 AND retry_delay_ms BETWEEN 100 AND 60000),
    CONSTRAINT webhooks_url_https
        CHECK (url LIKE 'https://%')
);

-- Indexes
CREATE INDEX idx_webhooks_api_key_id ON webhooks(api_key_id);
CREATE INDEX idx_webhooks_enabled ON webhooks(enabled) WHERE enabled = TRUE;
CREATE INDEX idx_webhooks_status ON webhooks(status);
CREATE INDEX idx_webhooks_failing ON webhooks(consecutive_failures DESC)
    WHERE consecutive_failures > 0;

-- Trigger for updated_at
CREATE TRIGGER webhooks_updated_at
    BEFORE UPDATE ON webhooks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

### 4. webhook_events

Junction table linking webhooks to their subscribed events.

```sql
CREATE TABLE webhook_events (
    -- Primary key
    id              SERIAL PRIMARY KEY,

    -- Relationships
    webhook_id      VARCHAR(32) NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,

    -- Event configuration
    event_type      VARCHAR(100) NOT NULL,  -- e.g., 'order.created'

    -- Timestamps
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Unique constraint
    CONSTRAINT webhook_events_unique UNIQUE (webhook_id, event_type)
);

-- Indexes
CREATE INDEX idx_webhook_events_webhook_id ON webhook_events(webhook_id);
CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
```

**Valid Event Types:**

| Event Type            | Description                  |
| --------------------- | ---------------------------- |
| `key.created`         | API key created              |
| `key.updated`         | API key updated              |
| `key.rotated`         | API key rotated              |
| `key.revoked`         | API key revoked              |
| `rate_limit.exceeded` | Rate limit exceeded          |
| `webhook.failing`     | Webhook consecutive failures |
| `request.error`       | Request resulted in error    |

---

### 5. webhook_deliveries

Stores webhook delivery attempts and results.

```sql
CREATE TABLE webhook_deliveries (
    -- Primary identification
    id              VARCHAR(32) PRIMARY KEY,  -- del_01H5X4Y6Z8...

    -- Relationships
    webhook_id      VARCHAR(32) NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,

    -- Event information
    event_type      VARCHAR(100) NOT NULL,
    event_id        VARCHAR(32) NOT NULL,  -- Original event ID

    -- Delivery details
    url             VARCHAR(2000) NOT NULL,  -- URL at time of delivery
    payload         JSONB NOT NULL,

    -- Attempt tracking
    attempt         SMALLINT NOT NULL DEFAULT 1,
    max_attempts    SMALLINT NOT NULL,

    -- Status
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
        -- CONSTRAINT: CHECK (status IN ('pending', 'success', 'failed', 'retrying'))

    -- Response information
    response_status SMALLINT,
    response_body   TEXT,
    response_headers JSONB,

    -- Timing
    duration_ms     INTEGER,

    -- Error information
    error_message   TEXT,
    error_code      VARCHAR(50),

    -- Timestamps
    scheduled_at    TIMESTAMPTZ NOT NULL,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    next_retry_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Partitioning support
    created_date    DATE NOT NULL DEFAULT CURRENT_DATE,

    -- Constraints
    CONSTRAINT webhook_deliveries_status_check
        CHECK (status IN ('pending', 'success', 'failed', 'retrying'))
) PARTITION BY RANGE (created_date);

-- Create partitions
CREATE TABLE webhook_deliveries_2024_01 PARTITION OF webhook_deliveries
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Indexes
CREATE INDEX idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX idx_webhook_deliveries_event_type ON webhook_deliveries(event_type);
CREATE INDEX idx_webhook_deliveries_scheduled ON webhook_deliveries(scheduled_at)
    WHERE status = 'pending';
CREATE INDEX idx_webhook_deliveries_retry ON webhook_deliveries(next_retry_at)
    WHERE status = 'retrying';
CREATE INDEX idx_webhook_deliveries_created ON webhook_deliveries(created_at DESC);

-- Composite indexes
CREATE INDEX idx_webhook_deliveries_webhook_time
    ON webhook_deliveries(webhook_id, created_at DESC);
```

---

### 6. rate_limits

Stores custom rate limit configurations (beyond key defaults).

```sql
CREATE TABLE rate_limits (
    -- Primary identification
    id              VARCHAR(32) PRIMARY KEY,

    -- Target specification
    target_type     VARCHAR(20) NOT NULL,  -- 'key', 'ip', 'endpoint', 'global'
    target_value    VARCHAR(255),          -- key_id, IP address, endpoint path, or NULL for global

    -- Limits
    requests_per_minute INTEGER,
    requests_per_hour   INTEGER,
    requests_per_day    INTEGER,
    burst_limit         INTEGER,

    -- Status
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,

    -- Timestamps
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,

    -- Constraints
    CONSTRAINT rate_limits_target_type_check
        CHECK (target_type IN ('key', 'ip', 'endpoint', 'global')),
    CONSTRAINT rate_limits_has_value
        CHECK (target_type = 'global' OR target_value IS NOT NULL),
    CONSTRAINT rate_limits_unique_target
        UNIQUE (target_type, target_value)
);

-- Indexes
CREATE INDEX idx_rate_limits_target ON rate_limits(target_type, target_value);
CREATE INDEX idx_rate_limits_enabled ON rate_limits(enabled) WHERE enabled = TRUE;

-- Trigger for updated_at
CREATE TRIGGER rate_limits_updated_at
    BEFORE UPDATE ON rate_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

---

### 7. audit_logs

Stores audit trail for sensitive operations.

```sql
CREATE TABLE audit_logs (
    -- Primary identification
    id              VARCHAR(32) PRIMARY KEY,

    -- Actor information
    actor_type      VARCHAR(20) NOT NULL,  -- 'api_key', 'system', 'admin'
    actor_id        VARCHAR(32),           -- API key ID or admin ID
    actor_ip        INET,

    -- Action details
    action          VARCHAR(50) NOT NULL,  -- 'key.create', 'key.revoke', etc.
    resource_type   VARCHAR(50) NOT NULL,  -- 'api_key', 'webhook', etc.
    resource_id     VARCHAR(32),

    -- Change tracking
    old_values      JSONB,
    new_values      JSONB,

    -- Additional context
    metadata        JSONB NOT NULL DEFAULT '{}',

    -- Timestamps
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Partitioning support
    created_date    DATE NOT NULL DEFAULT CURRENT_DATE
) PARTITION BY RANGE (created_date);

-- Create partitions
CREATE TABLE audit_logs_2024_01 PARTITION OF audit_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Indexes
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_type, actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

-- Composite indexes
CREATE INDEX idx_audit_logs_resource_time
    ON audit_logs(resource_type, resource_id, created_at DESC);
```

**Audit Actions:**

| Action              | Description        |
| ------------------- | ------------------ |
| `key.create`        | API key created    |
| `key.update`        | API key updated    |
| `key.rotate`        | API key rotated    |
| `key.revoke`        | API key revoked    |
| `webhook.create`    | Webhook created    |
| `webhook.update`    | Webhook updated    |
| `webhook.delete`    | Webhook deleted    |
| `rate_limit.update` | Rate limit changed |

---

## Common Functions

### Updated At Trigger Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Generate ULID Function

```sql
CREATE OR REPLACE FUNCTION generate_ulid()
RETURNS VARCHAR(26) AS $$
DECLARE
    timestamp_part VARCHAR(10);
    random_part VARCHAR(16);
    encoding VARCHAR(32) := '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    unix_ms BIGINT;
    i INT;
BEGIN
    unix_ms := (EXTRACT(EPOCH FROM NOW()) * 1000)::BIGINT;

    -- Encode timestamp (10 characters)
    timestamp_part := '';
    FOR i IN REVERSE 9..0 LOOP
        timestamp_part := timestamp_part || SUBSTR(encoding, (unix_ms >> (i * 5)) & 31 + 1, 1);
    END LOOP;

    -- Generate random part (16 characters)
    random_part := '';
    FOR i IN 1..16 LOOP
        random_part := random_part || SUBSTR(encoding, FLOOR(RANDOM() * 32)::INT + 1, 1);
    END LOOP;

    RETURN timestamp_part || random_part;
END;
$$ LANGUAGE plpgsql;

-- Prefixed ID generator
CREATE OR REPLACE FUNCTION generate_prefixed_id(prefix VARCHAR)
RETURNS VARCHAR(32) AS $$
BEGIN
    RETURN prefix || '_' || generate_ulid();
END;
$$ LANGUAGE plpgsql;
```

### Partition Maintenance Function

```sql
CREATE OR REPLACE FUNCTION create_monthly_partitions(
    table_name TEXT,
    start_date DATE,
    months_ahead INT DEFAULT 3
)
RETURNS VOID AS $$
DECLARE
    partition_date DATE;
    partition_name TEXT;
    start_range DATE;
    end_range DATE;
BEGIN
    partition_date := DATE_TRUNC('month', start_date)::DATE;

    FOR i IN 0..months_ahead LOOP
        start_range := partition_date + (i || ' months')::INTERVAL;
        end_range := partition_date + ((i + 1) || ' months')::INTERVAL;
        partition_name := table_name || '_' || TO_CHAR(start_range, 'YYYY_MM');

        EXECUTE FORMAT(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I
             FOR VALUES FROM (%L) TO (%L)',
            partition_name,
            table_name,
            start_range,
            end_range
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

---

## Redis Schema

### Rate Limiting Keys

```
# Sliding window rate limit (sorted set)
datahub:rl:min:{key_id}     # Per-minute window
datahub:rl:hour:{key_id}    # Per-hour window
datahub:rl:day:{key_id}     # Per-day window

# Member: {timestamp}:{request_id}
# Score: timestamp in milliseconds
# TTL: Window size + buffer
```

### Caching Keys

```
# API Key cache
datahub:cache:key:{key_hash}
# Value: JSON serialized key record
# TTL: 5 minutes

# Webhook cache
datahub:cache:webhook:{webhook_id}
# Value: JSON serialized webhook config
# TTL: 10 minutes

# Rate limit config cache
datahub:cache:ratelimit:{target_type}:{target_value}
# Value: JSON serialized rate limit config
# TTL: 5 minutes
```

### Queue Keys

```
# Webhook delivery queue
datahub:queue:webhooks
# Type: Bull/BullMQ queue

# Pending deliveries (sorted set)
datahub:queue:pending:{webhook_id}
# Score: scheduled timestamp
# Member: delivery_id
```

---

## Migrations

### Migration 001: Initial Schema

```sql
-- migrations/001_initial_schema.sql

BEGIN;

-- Create updated_at function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create api_keys table
CREATE TABLE api_keys (
    id              VARCHAR(32) PRIMARY KEY,
    key_hash        VARCHAR(64) NOT NULL UNIQUE,
    key_prefix      VARCHAR(20) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    scopes          TEXT[] NOT NULL DEFAULT '{}',
    rate_limit_minute   INTEGER NOT NULL DEFAULT 100,
    rate_limit_hour     INTEGER NOT NULL DEFAULT 5000,
    rate_limit_day      INTEGER NOT NULL DEFAULT 100000,
    burst_limit         INTEGER NOT NULL DEFAULT 10,
    metadata        JSONB NOT NULL DEFAULT '{}',
    total_requests      BIGINT NOT NULL DEFAULT 0,
    last_used_at        TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    deprecated_at   TIMESTAMPTZ,
    revoked_at      TIMESTAMPTZ,
    rotated_from_id VARCHAR(32),
    CONSTRAINT api_keys_status_check
        CHECK (status IN ('active', 'deprecated', 'revoked', 'expired'))
);

CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_status ON api_keys(status);
CREATE INDEX idx_api_keys_created_at ON api_keys(created_at DESC);

CREATE TRIGGER api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

### Migration 002: Request Logs

```sql
-- migrations/002_request_logs.sql

BEGIN;

CREATE TABLE request_logs (
    id              VARCHAR(32) PRIMARY KEY,
    api_key_id      VARCHAR(32) REFERENCES api_keys(id) ON DELETE SET NULL,
    method          VARCHAR(10) NOT NULL,
    path            VARCHAR(2000) NOT NULL,
    query_params    JSONB NOT NULL DEFAULT '{}',
    headers         JSONB NOT NULL DEFAULT '{}',
    body            JSONB,
    body_size       INTEGER NOT NULL DEFAULT 0,
    ip_address      INET NOT NULL,
    user_agent      VARCHAR(500),
    status_code     SMALLINT NOT NULL,
    response_headers JSONB NOT NULL DEFAULT '{}',
    response_body   JSONB,
    response_size   INTEGER NOT NULL DEFAULT 0,
    duration_ms     INTEGER NOT NULL,
    rate_limit_remaining INTEGER,
    rate_limited    BOOLEAN NOT NULL DEFAULT FALSE,
    error_code      VARCHAR(50),
    error_message   TEXT,
    started_at      TIMESTAMPTZ NOT NULL,
    completed_at    TIMESTAMPTZ NOT NULL,
    created_date    DATE NOT NULL DEFAULT CURRENT_DATE
) PARTITION BY RANGE (created_date);

-- Create initial partition
CREATE TABLE request_logs_default PARTITION OF request_logs DEFAULT;

CREATE INDEX idx_request_logs_api_key_id ON request_logs(api_key_id);
CREATE INDEX idx_request_logs_started_at ON request_logs(started_at DESC);
CREATE INDEX idx_request_logs_status_code ON request_logs(status_code);

COMMIT;
```

### Migration 003: Webhooks

```sql
-- migrations/003_webhooks.sql

BEGIN;

CREATE TABLE webhooks (
    id              VARCHAR(32) PRIMARY KEY,
    api_key_id      VARCHAR(32) NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    url             VARCHAR(2000) NOT NULL,
    secret          VARCHAR(64),
    headers         JSONB NOT NULL DEFAULT '{}',
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    max_retries         SMALLINT NOT NULL DEFAULT 5,
    retry_delay_ms      INTEGER NOT NULL DEFAULT 1000,
    backoff_multiplier  DECIMAL(3,1) NOT NULL DEFAULT 2.0,
    timeout_ms          INTEGER NOT NULL DEFAULT 30000,
    total_deliveries        BIGINT NOT NULL DEFAULT 0,
    successful_deliveries   BIGINT NOT NULL DEFAULT 0,
    failed_deliveries       BIGINT NOT NULL DEFAULT 0,
    last_delivery_at        TIMESTAMPTZ,
    last_success_at         TIMESTAMPTZ,
    last_failure_at         TIMESTAMPTZ,
    consecutive_failures    SMALLINT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT webhooks_status_check
        CHECK (status IN ('active', 'paused', 'failing', 'disabled'))
);

CREATE TABLE webhook_events (
    id              SERIAL PRIMARY KEY,
    webhook_id      VARCHAR(32) NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type      VARCHAR(100) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT webhook_events_unique UNIQUE (webhook_id, event_type)
);

CREATE TABLE webhook_deliveries (
    id              VARCHAR(32) PRIMARY KEY,
    webhook_id      VARCHAR(32) NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type      VARCHAR(100) NOT NULL,
    event_id        VARCHAR(32) NOT NULL,
    url             VARCHAR(2000) NOT NULL,
    payload         JSONB NOT NULL,
    attempt         SMALLINT NOT NULL DEFAULT 1,
    max_attempts    SMALLINT NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
    response_status SMALLINT,
    response_body   TEXT,
    response_headers JSONB,
    duration_ms     INTEGER,
    error_message   TEXT,
    error_code      VARCHAR(50),
    scheduled_at    TIMESTAMPTZ NOT NULL,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    next_retry_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_date    DATE NOT NULL DEFAULT CURRENT_DATE,
    CONSTRAINT webhook_deliveries_status_check
        CHECK (status IN ('pending', 'success', 'failed', 'retrying'))
) PARTITION BY RANGE (created_date);

CREATE TABLE webhook_deliveries_default PARTITION OF webhook_deliveries DEFAULT;

CREATE INDEX idx_webhooks_api_key_id ON webhooks(api_key_id);
CREATE INDEX idx_webhooks_enabled ON webhooks(enabled);
CREATE INDEX idx_webhook_events_webhook_id ON webhook_events(webhook_id);
CREATE INDEX idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(status);

CREATE TRIGGER webhooks_updated_at
    BEFORE UPDATE ON webhooks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

### Migration 004: Rate Limits and Audit

```sql
-- migrations/004_rate_limits_audit.sql

BEGIN;

CREATE TABLE rate_limits (
    id              VARCHAR(32) PRIMARY KEY,
    target_type     VARCHAR(20) NOT NULL,
    target_value    VARCHAR(255),
    requests_per_minute INTEGER,
    requests_per_hour   INTEGER,
    requests_per_day    INTEGER,
    burst_limit         INTEGER,
    enabled         BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    CONSTRAINT rate_limits_target_type_check
        CHECK (target_type IN ('key', 'ip', 'endpoint', 'global')),
    CONSTRAINT rate_limits_unique_target
        UNIQUE (target_type, target_value)
);

CREATE TABLE audit_logs (
    id              VARCHAR(32) PRIMARY KEY,
    actor_type      VARCHAR(20) NOT NULL,
    actor_id        VARCHAR(32),
    actor_ip        INET,
    action          VARCHAR(50) NOT NULL,
    resource_type   VARCHAR(50) NOT NULL,
    resource_id     VARCHAR(32),
    old_values      JSONB,
    new_values      JSONB,
    metadata        JSONB NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_date    DATE NOT NULL DEFAULT CURRENT_DATE
) PARTITION BY RANGE (created_date);

CREATE TABLE audit_logs_default PARTITION OF audit_logs DEFAULT;

CREATE INDEX idx_rate_limits_target ON rate_limits(target_type, target_value);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_type, actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

CREATE TRIGGER rate_limits_updated_at
    BEFORE UPDATE ON rate_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

---

## Data Retention Policy

| Table              | Retention  | Strategy                     |
| ------------------ | ---------- | ---------------------------- |
| api_keys           | Indefinite | Soft delete (revoked status) |
| request_logs       | 30 days    | Partition drop               |
| webhooks           | Indefinite | Cascade delete with key      |
| webhook_deliveries | 30 days    | Partition drop               |
| audit_logs         | 1 year     | Partition drop               |
| rate_limits        | Indefinite | Manual cleanup               |

### Cleanup Job

```sql
-- Run daily via cron
CREATE OR REPLACE FUNCTION cleanup_old_partitions()
RETURNS VOID AS $$
DECLARE
    partition_name TEXT;
    cutoff_date DATE;
BEGIN
    -- Request logs: 30 days
    cutoff_date := CURRENT_DATE - INTERVAL '30 days';
    FOR partition_name IN
        SELECT tablename FROM pg_tables
        WHERE tablename LIKE 'request_logs_____\___'
        AND tablename < 'request_logs_' || TO_CHAR(cutoff_date, 'YYYY_MM')
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || partition_name;
    END LOOP;

    -- Similar for webhook_deliveries and audit_logs...
END;
$$ LANGUAGE plpgsql;
```

---

## Performance Considerations

### Connection Pooling

```
max_connections = 100
shared_buffers = 256MB
work_mem = 16MB
maintenance_work_mem = 128MB
effective_cache_size = 768MB
```

### Query Optimization

1. **Use partial indexes** for status filters
2. **Partition large tables** by date
3. **Use JSONB** for flexible schemas
4. **Index GIN** for array/JSONB queries

### Monitoring Queries

```sql
-- Slow queries
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Table sizes
SELECT relname, pg_size_pretty(pg_relation_size(relid))
FROM pg_stat_user_tables
ORDER BY pg_relation_size(relid) DESC;

-- Index usage
SELECT indexrelname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

_This schema supports the complete DataHub API Gateway functionality with proper indexing, partitioning, and performance optimizations._
