# DataHub Environment Variables

## Overview

Complete reference for all environment variables used in the DataHub API Gateway.

---

## Gateway Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | - | Environment mode |
| `GATEWAY_PORT` | No | 3001 | Gateway server port |
| `GATEWAY_TIMEOUT_MS` | No | 30000 | Request timeout |
| `GATEWAY_MAX_BODY_SIZE` | No | 10mb | Max request body |

```bash
NODE_ENV=production
GATEWAY_PORT=3001
GATEWAY_TIMEOUT_MS=30000
GATEWAY_MAX_BODY_SIZE=10mb
```

---

## Database Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection |
| `DATABASE_POOL_MIN` | No | 5 | Min connections |
| `DATABASE_POOL_MAX` | No | 20 | Max connections |

```bash
DATABASE_URL="postgresql://user:pass@host:5432/datahub"
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20
```

---

## Redis Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDIS_URL` | Yes | - | Redis connection |
| `REDIS_CLUSTER_MODE` | No | false | Enable cluster |
| `REDIS_KEY_PREFIX` | No | dh: | Key prefix |

```bash
REDIS_URL="redis://localhost:6379"
REDIS_CLUSTER_MODE=false
REDIS_KEY_PREFIX=dh:
```

---

## TimescaleDB Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `TIMESCALE_URL` | Yes | - | TimescaleDB connection |
| `ANALYTICS_RETENTION_DAYS` | No | 90 | Data retention |

```bash
TIMESCALE_URL="postgresql://user:pass@host:5432/analytics"
ANALYTICS_RETENTION_DAYS=90
```

---

## Rate Limiting

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RATE_LIMIT_WINDOW_MS` | No | 60000 | Window duration |
| `RATE_LIMIT_DEFAULT` | No | 100 | Default limit |
| `RATE_LIMIT_BURST` | No | 20 | Burst allowance |

```bash
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_DEFAULT=100
RATE_LIMIT_BURST=20
```

---

## Security

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | Yes | - | JWT signing key |
| `API_KEY_HASH_ROUNDS` | No | 10 | Bcrypt rounds |
| `CORS_ORIGINS` | No | * | Allowed origins |

```bash
JWT_SECRET=your-secret-key
API_KEY_HASH_ROUNDS=10
CORS_ORIGINS=https://app.datahub.io,https://admin.datahub.io
```

---

## Logging & Monitoring

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LOG_LEVEL` | No | info | Log verbosity |
| `LOG_FORMAT` | No | json | Log format |
| `METRICS_PORT` | No | 9090 | Prometheus port |
| `SENTRY_DSN` | No | - | Error tracking |

```bash
LOG_LEVEL=info
LOG_FORMAT=json
METRICS_PORT=9090
SENTRY_DSN=https://xxx@sentry.io/123
```

---

## Environment Comparison

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| NODE_ENV | development | staging | production |
| LOG_LEVEL | debug | info | info |
| LOG_FORMAT | pretty | json | json |
| RATE_LIMIT_DEFAULT | 1000 | 100 | 100 |
| DATABASE_POOL_MAX | 10 | 20 | 50 |

---

## Related Documents

- [Development Setup](./development.md)
- [Production Environment](./production.md)
