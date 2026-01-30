# TaskFlow Environment Variables

## Overview

This document provides a comprehensive reference for all environment variables used in TaskFlow across different environments.

---

## Variable Categories

```mermaid
flowchart TB
    subgraph Variables["Environment Variables"]
        APP[Application Config]
        DB[Database]
        AUTH[Authentication]
        CACHE[Cache/Redis]
        EMAIL[Email/SMTP]
        LOG[Logging]
        EXT[External Services]
    end

    ENV[.env File] --> Variables
    SECRETS[AWS Secrets Manager] --> Variables
    Variables --> RUNTIME[Application Runtime]
```

---

## Complete Variable Reference

### Application Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | - | Environment: development, staging, production |
| `PORT` | No | 3001 | API server port |
| `FRONTEND_URL` | Yes | - | Frontend application URL |
| `API_VERSION` | No | v1 | API version prefix |
| `CORS_ORIGINS` | No | FRONTEND_URL | Allowed CORS origins (comma-separated) |

```bash
# Example values
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
API_VERSION=v1
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Database Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `DATABASE_POOL_MIN` | No | 2 | Minimum pool connections |
| `DATABASE_POOL_MAX` | No | 10 | Maximum pool connections |
| `DATABASE_SSL` | No | false | Enable SSL connection |

```bash
# Development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/taskflow_dev"
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Production
DATABASE_URL="postgresql://user:password@host:5432/taskflow?sslmode=require"
DATABASE_SSL=true
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=50
```

### Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]?[params]

Parameters:
  sslmode=require     - Require SSL connection
  connection_limit=10 - Connection pool limit
  pool_timeout=10     - Pool timeout in seconds
  schema=public       - Database schema
```

### Authentication Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | Yes | - | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | No | 7d | Access token expiration |
| `REFRESH_TOKEN_EXPIRES_IN` | No | 30d | Refresh token expiration |
| `BCRYPT_ROUNDS` | No | 12 | Password hashing rounds |
| `SESSION_SECRET` | No | - | Session secret (if using sessions) |

```bash
# Development (use weak secret for local only)
JWT_SECRET=dev-secret-key-not-for-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
BCRYPT_ROUNDS=10

# Production (use strong random secret)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

### Cache Configuration (Redis)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDIS_URL` | No | - | Redis connection string |
| `REDIS_HOST` | No | localhost | Redis host (if not using URL) |
| `REDIS_PORT` | No | 6379 | Redis port |
| `REDIS_PASSWORD` | No | - | Redis password |
| `REDIS_TLS` | No | false | Enable TLS |
| `CACHE_TTL` | No | 3600 | Default cache TTL in seconds |

```bash
# Development
REDIS_URL=redis://localhost:6379

# Production
REDIS_URL=rediss://user:password@redis-cluster.xxxxx.cache.amazonaws.com:6379
REDIS_TLS=true
CACHE_TTL=3600
```

### Email Configuration (SMTP)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMTP_HOST` | Yes* | - | SMTP server host |
| `SMTP_PORT` | No | 587 | SMTP server port |
| `SMTP_USER` | No | - | SMTP username |
| `SMTP_PASS` | No | - | SMTP password |
| `SMTP_SECURE` | No | false | Use TLS |
| `EMAIL_FROM` | Yes* | - | Default from address |
| `EMAIL_FROM_NAME` | No | TaskFlow | From name |

```bash
# Development (using MailHog)
SMTP_HOST=localhost
SMTP_PORT=1025
EMAIL_FROM=noreply@taskflow.local
EMAIL_FROM_NAME=TaskFlow Dev

# Production (using SES)
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=AKIAXXXXXXXXXX
SMTP_PASS=secretpassword
SMTP_SECURE=true
EMAIL_FROM=noreply@taskflow.app
EMAIL_FROM_NAME=TaskFlow
```

### Logging Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LOG_LEVEL` | No | info | Log level: error, warn, info, debug |
| `LOG_FORMAT` | No | json | Log format: json, pretty |
| `LOG_REQUESTS` | No | true | Log HTTP requests |
| `LOG_QUERIES` | No | false | Log database queries |

```bash
# Development
LOG_LEVEL=debug
LOG_FORMAT=pretty
LOG_REQUESTS=true
LOG_QUERIES=true

# Production
LOG_LEVEL=info
LOG_FORMAT=json
LOG_REQUESTS=true
LOG_QUERIES=false
```

### External Services

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SENTRY_DSN` | No | - | Sentry error tracking DSN |
| `ANALYTICS_ID` | No | - | Analytics tracking ID |
| `STORAGE_BUCKET` | No | - | S3 bucket for file uploads |
| `AWS_REGION` | No | us-east-1 | AWS region |

```bash
# Production
SENTRY_DSN=https://xxxx@sentry.io/12345
ANALYTICS_ID=UA-XXXXXXXXX-X
STORAGE_BUCKET=taskflow-uploads-prod
AWS_REGION=us-east-1
```

---

## Environment-Specific Files

### File Structure

```
taskflow/
├── .env.example          # Template with all variables
├── .env                  # Local development (gitignored)
├── .env.test             # Test environment
├── .env.development      # Development defaults
└── docker/
    ├── .env.docker       # Docker compose environment
    └── .env.staging      # Staging environment
```

### .env.example Template

```bash
# TaskFlow Environment Variables
# Copy this file to .env and fill in values

# ═══════════════════════════════════════════════════════════════
# APPLICATION
# ═══════════════════════════════════════════════════════════════
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
API_VERSION=v1

# ═══════════════════════════════════════════════════════════════
# DATABASE
# ═══════════════════════════════════════════════════════════════
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow_dev
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# ═══════════════════════════════════════════════════════════════
# AUTHENTICATION
# ═══════════════════════════════════════════════════════════════
JWT_SECRET=change-this-in-production
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d
BCRYPT_ROUNDS=12

# ═══════════════════════════════════════════════════════════════
# CACHE (Optional - Redis)
# ═══════════════════════════════════════════════════════════════
# REDIS_URL=redis://localhost:6379
# CACHE_TTL=3600

# ═══════════════════════════════════════════════════════════════
# EMAIL
# ═══════════════════════════════════════════════════════════════
SMTP_HOST=localhost
SMTP_PORT=1025
EMAIL_FROM=noreply@taskflow.local

# ═══════════════════════════════════════════════════════════════
# LOGGING
# ═══════════════════════════════════════════════════════════════
LOG_LEVEL=debug
LOG_FORMAT=pretty

# ═══════════════════════════════════════════════════════════════
# EXTERNAL SERVICES (Optional)
# ═══════════════════════════════════════════════════════════════
# SENTRY_DSN=
# ANALYTICS_ID=
# STORAGE_BUCKET=
```

---

## Secrets Management

### AWS Secrets Manager

```mermaid
flowchart LR
    subgraph Storage["Secrets Manager"]
        SECRET[taskflow/production/secrets]
    end

    subgraph Deployment["ECS Task"]
        TASK[Task Definition]
        CONTAINER[Container]
    end

    SECRET -->|Inject at startup| TASK
    TASK --> CONTAINER
```

### Secret Structure

```json
{
  "DATABASE_URL": "postgresql://...",
  "JWT_SECRET": "...",
  "SMTP_PASS": "...",
  "SENTRY_DSN": "..."
}
```

### Accessing Secrets

```bash
# Retrieve secret (CLI)
aws secretsmanager get-secret-value \
  --secret-id taskflow/production/secrets \
  --query SecretString \
  --output text

# In ECS Task Definition
{
  "secrets": [
    {
      "name": "DATABASE_URL",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:xxx:secret:taskflow/production/secrets:DATABASE_URL::"
    },
    {
      "name": "JWT_SECRET",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:xxx:secret:taskflow/production/secrets:JWT_SECRET::"
    }
  ]
}
```

---

## Validation

### Startup Validation

```typescript
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().default(3001),
  FRONTEND_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

export const env = envSchema.parse(process.env);
```

### Validation Script

```bash
#!/bin/bash
# scripts/validate-env.sh

required_vars=(
  "NODE_ENV"
  "DATABASE_URL"
  "JWT_SECRET"
  "FRONTEND_URL"
)

missing=()

for var in "${required_vars[@]}"; do
  if [ -z "${!var}" ]; then
    missing+=("$var")
  fi
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "Missing required environment variables:"
  printf '  - %s\n' "${missing[@]}"
  exit 1
fi

echo "All required environment variables are set."
```

---

## Environment Comparison

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| NODE_ENV | development | staging | production |
| PORT | 3001 | 3001 | 3001 |
| DATABASE_URL | localhost | RDS staging | RDS production |
| JWT_SECRET | dev-secret | [Secrets Manager] | [Secrets Manager] |
| JWT_EXPIRES_IN | 7d | 1d | 1h |
| REDIS_URL | localhost | ElastiCache | ElastiCache |
| LOG_LEVEL | debug | info | info |
| LOG_FORMAT | pretty | json | json |
| SENTRY_DSN | - | staging DSN | production DSN |

---

## Security Guidelines

### DO

```markdown
- Store secrets in AWS Secrets Manager (production)
- Use strong, unique values for secrets
- Rotate secrets regularly (90 days)
- Use different values per environment
- Validate variables at startup
- Document all variables
```

### DON'T

```markdown
- Commit .env files to git
- Use production secrets in development
- Log sensitive variables
- Share secrets via chat/email
- Use weak secrets even in development
- Hardcode secrets in code
```

---

## Troubleshooting

### Common Issues

```markdown
## Missing Variable Error

Error: Environment variable JWT_SECRET is not set

Solution:
1. Check .env file exists
2. Verify variable is in .env
3. Restart the application
4. Check for typos in variable name

---

## Invalid Database URL

Error: Invalid connection string

Solution:
1. Verify URL format: postgresql://user:pass@host:port/db
2. Check special characters are URL-encoded
3. Verify database server is running
4. Check network connectivity

---

## Secret Not Found

Error: Secrets Manager secret not found

Solution:
1. Verify secret ARN is correct
2. Check IAM permissions
3. Verify AWS region matches
4. Check secret exists in console
```

---

## Related Documents

- [Development Setup](./development.md)
- [Docker Configuration](./docker.md)
- [Production Environment](./production.md)
