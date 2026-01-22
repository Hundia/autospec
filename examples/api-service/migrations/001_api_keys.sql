-- 001_api_keys.sql
-- Core functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

    timestamp_part := '';
    FOR i IN REVERSE 9..0 LOOP
        timestamp_part := timestamp_part || SUBSTR(encoding, (unix_ms >> (i * 5)) & 31 + 1, 1);
    END LOOP;

    random_part := '';
    FOR i IN 1..16 LOOP
        random_part := random_part || SUBSTR(encoding, FLOOR(RANDOM() * 32)::INT + 1, 1);
    END LOOP;

    RETURN timestamp_part || random_part;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_prefixed_id(prefix VARCHAR)
RETURNS VARCHAR(32) AS $$
BEGIN
    RETURN prefix || '_' || generate_ulid();
END;
$$ LANGUAGE plpgsql;

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
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
            partition_name,
            table_name,
            start_range,
            end_range
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- api_keys table
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
    rotated_from_id VARCHAR(32) REFERENCES api_keys(id),
    CONSTRAINT api_keys_status_check
        CHECK (status IN ('active', 'deprecated', 'revoked', 'expired')),
    CONSTRAINT api_keys_rate_limits_positive
        CHECK (rate_limit_minute > 0 AND rate_limit_hour > 0 AND rate_limit_day > 0)
);

CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_status ON api_keys(status);
CREATE INDEX idx_api_keys_created_at ON api_keys(created_at DESC);
CREATE INDEX idx_api_keys_expires_at ON api_keys(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX idx_api_keys_last_used ON api_keys(last_used_at DESC);
CREATE INDEX idx_api_keys_scopes ON api_keys USING GIN(scopes);

CREATE TRIGGER api_keys_updated_at
    BEFORE UPDATE ON api_keys
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
