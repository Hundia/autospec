-- 005_rate_limits_audit.sql
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
    CONSTRAINT rate_limits_has_value
        CHECK (target_type = 'global' OR target_value IS NOT NULL),
    CONSTRAINT rate_limits_unique_target
        UNIQUE (target_type, target_value)
);

CREATE INDEX idx_rate_limits_target ON rate_limits(target_type, target_value);
CREATE INDEX idx_rate_limits_enabled ON rate_limits(enabled) WHERE enabled = TRUE;

CREATE TRIGGER rate_limits_updated_at
    BEFORE UPDATE ON rate_limits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

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

CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_type, actor_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

CREATE INDEX idx_audit_logs_resource_time
    ON audit_logs(resource_type, resource_id, created_at DESC);
