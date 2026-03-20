# ShopFlow Environment Variables

## Overview

Complete reference for all environment variables used in the ShopFlow e-commerce platform.

---

## Application Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | Yes | - | Environment mode |
| `APP_URL` | Yes | - | Web application URL |
| `API_URL` | Yes | - | API server URL |
| `ADMIN_URL` | No | - | Admin panel URL |
| `PORT` | No | 4000 | API server port |
| `WEB_PORT` | No | 3000 | Web app port |

```bash
NODE_ENV=production
APP_URL=https://www.shopflow.io
API_URL=https://api.shopflow.io
ADMIN_URL=https://admin.shopflow.io
PORT=4000
```

---

## Database Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `DATABASE_POOL_MIN` | No | 5 | Minimum pool connections |
| `DATABASE_POOL_MAX` | No | 20 | Maximum pool connections |
| `DATABASE_SSL` | No | false | Enable SSL connection |

```bash
DATABASE_URL="postgresql://user:password@host:5432/shopflow"
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20
DATABASE_SSL=true
```

---

## Redis Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `REDIS_URL` | Yes | - | Redis connection URL |
| `REDIS_PASSWORD` | No | - | Redis password |
| `REDIS_TLS` | No | false | Enable TLS |
| `REDIS_KEY_PREFIX` | No | sf: | Key prefix |

```bash
REDIS_URL="redis://localhost:6379"
REDIS_PASSWORD=secure-password
REDIS_TLS=true
REDIS_KEY_PREFIX=shopflow:
```

---

## Authentication

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `JWT_SECRET` | Yes | - | JWT signing secret |
| `JWT_EXPIRES_IN` | No | 7d | Token expiration |
| `JWT_REFRESH_EXPIRES_IN` | No | 30d | Refresh token expiration |
| `BCRYPT_ROUNDS` | No | 12 | Password hash rounds |

```bash
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
BCRYPT_ROUNDS=12
```

---

## Payment Processing (Stripe)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STRIPE_SECRET_KEY` | Yes | - | Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Yes | - | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Yes | - | Webhook signing secret |
| `STRIPE_API_VERSION` | No | 2023-10-16 | API version |

```bash
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_API_VERSION=2023-10-16
```

---

## AWS Services

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AWS_REGION` | Yes | - | AWS region |
| `AWS_ACCESS_KEY_ID` | No | - | AWS access key (or use IAM role) |
| `AWS_SECRET_ACCESS_KEY` | No | - | AWS secret key |

### S3 Storage

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `S3_BUCKET` | Yes | - | S3 bucket name |
| `S3_REGION` | No | AWS_REGION | Bucket region |
| `S3_CDN_URL` | No | - | CloudFront URL |

```bash
AWS_REGION=us-east-1
S3_BUCKET=shopflow-production-uploads
S3_CDN_URL=https://cdn.shopflow.io
```

### SQS Queues

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SQS_ORDER_QUEUE_URL` | Yes | - | Order processing queue |
| `SQS_NOTIFICATION_QUEUE_URL` | Yes | - | Notification queue |
| `SQS_EMAIL_QUEUE_URL` | Yes | - | Email queue |

```bash
SQS_ORDER_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/xxx/shopflow-orders
SQS_NOTIFICATION_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/xxx/shopflow-notifications
SQS_EMAIL_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/xxx/shopflow-emails
```

---

## Email Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SMTP_HOST` | Yes | - | SMTP server host |
| `SMTP_PORT` | No | 587 | SMTP port |
| `SMTP_USER` | Yes | - | SMTP username |
| `SMTP_PASSWORD` | Yes | - | SMTP password |
| `SMTP_FROM` | Yes | - | Default from address |
| `SMTP_FROM_NAME` | No | ShopFlow | From name |

```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=AKIAXXXXXXXX
SMTP_PASSWORD=xxx
SMTP_FROM=noreply@shopflow.io
SMTP_FROM_NAME=ShopFlow
```

---

## Search (Elasticsearch)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ELASTICSEARCH_URL` | Yes | - | Elasticsearch endpoint |
| `ELASTICSEARCH_INDEX_PREFIX` | No | shopflow | Index prefix |

```bash
ELASTICSEARCH_URL=https://search.shopflow.io
ELASTICSEARCH_INDEX_PREFIX=shopflow-prod
```

---

## Monitoring & Logging

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `LOG_LEVEL` | No | info | Log verbosity |
| `LOG_FORMAT` | No | json | Log format |
| `SENTRY_DSN` | No | - | Sentry error tracking |
| `DD_API_KEY` | No | - | Datadog API key |

```bash
LOG_LEVEL=info
LOG_FORMAT=json
SENTRY_DSN=https://xxx@sentry.io/xxx
DD_API_KEY=xxx
```

---

## Feature Flags

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `FEATURE_NEW_CHECKOUT` | No | false | New checkout flow |
| `FEATURE_WISHLIST` | No | true | Wishlist feature |
| `FEATURE_REVIEWS` | No | true | Product reviews |
| `FEATURE_RECOMMENDATIONS` | No | false | AI recommendations |

```bash
FEATURE_NEW_CHECKOUT=true
FEATURE_WISHLIST=true
FEATURE_REVIEWS=true
FEATURE_RECOMMENDATIONS=false
```

---

## Environment Comparison

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| NODE_ENV | development | staging | production |
| LOG_LEVEL | debug | info | info |
| LOG_FORMAT | pretty | json | json |
| DATABASE_POOL_MAX | 10 | 20 | 50 |
| BCRYPT_ROUNDS | 10 | 12 | 12 |
| STRIPE_SECRET_KEY | sk_test_xxx | sk_test_xxx | sk_live_xxx |

---

## Secret Management

### Local Development

```bash
# Use .env file
cp .env.example .env
# Edit .env with your values
```

### Production

```bash
# Use AWS Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id shopflow/production/api \
  --query SecretString \
  --output text | jq
```

### Required Secrets (Not in Code)

- `JWT_SECRET`
- `DATABASE_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SMTP_PASSWORD`

---

## Related Documents

- [Development Environment](./development.md)
- [Production Environment](./production.md)
- [Docker Configuration](./docker.md)
