-- 002_request_logs.sql
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

CREATE TABLE request_logs_default PARTITION OF request_logs DEFAULT;

CREATE INDEX idx_request_logs_api_key_id ON request_logs(api_key_id);
CREATE INDEX idx_request_logs_started_at ON request_logs(started_at DESC);
CREATE INDEX idx_request_logs_status_code ON request_logs(status_code);
CREATE INDEX idx_request_logs_method ON request_logs(method);
CREATE INDEX idx_request_logs_path ON request_logs(path);
CREATE INDEX idx_request_logs_ip_address ON request_logs(ip_address);
CREATE INDEX idx_request_logs_duration ON request_logs(duration_ms DESC);
CREATE INDEX idx_request_logs_rate_limited ON request_logs(rate_limited) WHERE rate_limited = TRUE;
CREATE INDEX idx_request_logs_error ON request_logs(error_code) WHERE error_code IS NOT NULL;

CREATE INDEX idx_request_logs_key_time ON request_logs(api_key_id, started_at DESC);
CREATE INDEX idx_request_logs_path_time ON request_logs(path, started_at DESC);
