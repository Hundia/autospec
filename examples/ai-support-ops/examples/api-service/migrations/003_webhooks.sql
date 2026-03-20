-- 003_webhooks.sql
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
        CHECK (status IN ('active', 'paused', 'failing', 'disabled')),
    CONSTRAINT webhooks_retry_config_valid
        CHECK (max_retries BETWEEN 1 AND 10 AND retry_delay_ms BETWEEN 100 AND 60000),
    CONSTRAINT webhooks_url_https
        CHECK (url LIKE 'https://%')
);

CREATE INDEX idx_webhooks_api_key_id ON webhooks(api_key_id);
CREATE INDEX idx_webhooks_enabled ON webhooks(enabled) WHERE enabled = TRUE;
CREATE INDEX idx_webhooks_status ON webhooks(status);
CREATE INDEX idx_webhooks_failing ON webhooks(consecutive_failures DESC)
    WHERE consecutive_failures > 0;

CREATE TRIGGER webhooks_updated_at
    BEFORE UPDATE ON webhooks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE webhook_events (
    id              SERIAL PRIMARY KEY,
    webhook_id      VARCHAR(32) NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event_type      VARCHAR(100) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT webhook_events_unique UNIQUE (webhook_id, event_type)
);

CREATE INDEX idx_webhook_events_webhook_id ON webhook_events(webhook_id);
CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
