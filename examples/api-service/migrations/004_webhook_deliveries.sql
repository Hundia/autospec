-- 004_webhook_deliveries.sql
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

CREATE INDEX idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX idx_webhook_deliveries_event_type ON webhook_deliveries(event_type);
CREATE INDEX idx_webhook_deliveries_scheduled ON webhook_deliveries(scheduled_at)
    WHERE status = 'pending';
CREATE INDEX idx_webhook_deliveries_retry ON webhook_deliveries(next_retry_at)
    WHERE status = 'retrying';
CREATE INDEX idx_webhook_deliveries_created ON webhook_deliveries(created_at DESC);

CREATE INDEX idx_webhook_deliveries_webhook_time
    ON webhook_deliveries(webhook_id, created_at DESC);
