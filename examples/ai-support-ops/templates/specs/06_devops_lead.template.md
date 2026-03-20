# SPEC: DevOps Lead

**Version:** 1.0
**Created:** {{DATE}}
**Owner:** DevOps Team

---

## 1. Infrastructure Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           INFRASTRUCTURE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                              ┌─────────────┐                                │
│                              │    Users    │                                │
│                              └──────┬──────┘                                │
│                                     │                                        │
│                              ┌──────▼──────┐                                │
│                              │   CDN/DNS   │                                │
│                              │ (Cloudflare)│                                │
│                              └──────┬──────┘                                │
│                                     │                                        │
│   ┌─────────────────────────────────┼─────────────────────────────────┐    │
│   │                    Load Balancer / Ingress                         │    │
│   └─────────────────────────────────┼─────────────────────────────────┘    │
│                                     │                                        │
│           ┌─────────────────────────┼─────────────────────────┐            │
│           │                         │                         │            │
│   ┌───────▼───────┐         ┌───────▼───────┐         ┌───────▼───────┐   │
│   │   Frontend    │         │    Backend    │         │    Backend    │   │
│   │   (Static)    │         │   Instance 1  │         │   Instance 2  │   │
│   └───────────────┘         └───────┬───────┘         └───────┬───────┘   │
│                                     │                         │            │
│                              ┌──────┴─────────────────────────┘            │
│                              │                                              │
│           ┌──────────────────┼──────────────────┐                          │
│           │                  │                  │                          │
│   ┌───────▼───────┐  ┌───────▼───────┐  ┌───────▼───────┐                 │
│   │  PostgreSQL   │  │    Redis      │  │   Object      │                 │
│   │   (Primary)   │  │   (Cache)     │  │   Storage     │                 │
│   └───────┬───────┘  └───────────────┘  └───────────────┘                 │
│           │                                                                 │
│   ┌───────▼───────┐                                                        │
│   │  PostgreSQL   │                                                        │
│   │   (Replica)   │                                                        │
│   └───────────────┘                                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Environment Overview

| Environment | Purpose | URL | Auto-deploy |
|-------------|---------|-----|-------------|
| Development | Local development | localhost | N/A |
| Staging | Pre-production testing | staging.{{DOMAIN}} | develop branch |
| Production | Live system | {{DOMAIN}} | main branch |

---

## 2. Technology Stack

### Infrastructure

| Component | Technology | Provider |
|-----------|------------|----------|
| Cloud Provider | {{CLOUD_PROVIDER}} | AWS / GCP / Azure |
| Container Runtime | Docker | - |
| Orchestration | {{ORCHESTRATION}} | Kubernetes / ECS / Cloud Run |
| CI/CD | {{CI_CD_PLATFORM}} | GitHub Actions / GitLab CI |
| DNS & CDN | {{CDN_PROVIDER}} | Cloudflare / AWS CloudFront |
| SSL | {{SSL_PROVIDER}} | Let's Encrypt / AWS ACM |

### Monitoring & Observability

| Component | Technology |
|-----------|------------|
| Logging | {{LOGGING_SOLUTION}} |
| Metrics | {{METRICS_SOLUTION}} |
| Tracing | {{TRACING_SOLUTION}} |
| Alerting | {{ALERTING_SOLUTION}} |
| Error Tracking | {{ERROR_TRACKING}} |

---

## 3. Development Environment

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Docker | 24.x | Containerization |
| Docker Compose | 2.x | Local orchestration |
| Node.js | 20.x LTS | Runtime |
| npm | 10.x | Package manager |
| Git | 2.x | Version control |

### Local Setup

```bash
# Clone repository
git clone {{REPO_URL}}
cd {{PROJECT_NAME}}

# Copy environment files
cp .env.example .env

# Start services
docker-compose up -d

# Install dependencies
npm install

# Run database migrations
npm run db:migrate

# Seed development data
npm run db:seed

# Start development servers
npm run dev
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-postgres}
      POSTGRES_DB: ${DB_NAME:-{{PROJECT_NAME_SNAKE}}}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "${REDIS_PORT:-6379}:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev
    ports:
      - "${API_PORT:-3000}:3000"
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD:-postgres}@db:5432/${DB_NAME:-{{PROJECT_NAME_SNAKE}}}
      REDIS_URL: redis://redis:6379
    volumes:
      - ./api:/app
      - /app/node_modules
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  web:
    build:
      context: ./web
      dockerfile: Dockerfile.dev
    ports:
      - "${WEB_PORT:-5173}:5173"
    environment:
      VITE_API_URL: http://localhost:${API_PORT:-3000}/api/v1
    volumes:
      - ./web:/app
      - /app/node_modules
    depends_on:
      - api

volumes:
  postgres_data:
  redis_data:
```

---

## 4. Dockerfiles

### Backend Dockerfile

```dockerfile
# api/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package*.json ./
RUN npm ci --only=production

# Builder stage
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS production
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy built application
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

USER nodejs
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Backend Development Dockerfile

```dockerfile
# api/Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### Frontend Dockerfile

```dockerfile
# web/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production with nginx
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 5. CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run lint
      - run: npm run type-check

  test:
    runs-on: ubuntu-latest
    needs: lint
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/test_db

      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  build:
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push'
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}

      - name: Build and push API
        uses: docker/build-push-action@v5
        with:
          context: ./api
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-api:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push Web
        uses: docker/build-push-action@v5
        with:
          context: ./web
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-web:${{ github.sha }}

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - name: Deploy to staging
        run: |
          # Deploy using kubectl, AWS CLI, or deployment tool
          echo "Deploying to staging..."

  deploy-production:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
```

---

## 6. Environment Variables

### .env.example

```env
# Application
NODE_ENV=development
PORT=3000
APP_NAME={{PROJECT_NAME}}
APP_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/{{PROJECT_NAME_SNAKE}}
DB_HOST=localhost
DB_PORT=5432
DB_NAME={{PROJECT_NAME_SNAKE}}
DB_USER=postgres
DB_PASSWORD=postgres

# Redis
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# Frontend
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_NAME={{PROJECT_NAME}}

# External Services
{{EXTERNAL_SERVICE}}_API_KEY=
{{EXTERNAL_SERVICE}}_API_URL=

# Monitoring
SENTRY_DSN=
LOG_LEVEL=debug
```

### Secrets Management

| Environment | Method |
|-------------|--------|
| Development | .env file (gitignored) |
| CI/CD | GitHub Secrets |
| Staging | {{SECRET_MANAGER}} |
| Production | {{SECRET_MANAGER}} |

**Never commit secrets to version control.**

---

## 7. Monitoring & Observability

### Logging Configuration

```typescript
// api/src/config/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  redact: ['password', 'token', 'authorization'],
});
```

### Log Levels

| Level | Usage |
|-------|-------|
| error | System errors, exceptions |
| warn | Warnings, deprecations |
| info | Business events, audit logs |
| debug | Development debugging |
| trace | Detailed tracing |

### Health Checks

```typescript
// api/src/routes/health.ts
import { Router } from 'express';
import { db } from '@/config/database';
import { redis } from '@/config/redis';

const router = Router();

router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: 'unknown',
      redis: 'unknown',
    },
  };

  try {
    await db.query('SELECT 1');
    health.checks.database = 'ok';
  } catch (error) {
    health.checks.database = 'error';
    health.status = 'degraded';
  }

  try {
    await redis.ping();
    health.checks.redis = 'ok';
  } catch (error) {
    health.checks.redis = 'error';
    health.status = 'degraded';
  }

  res.status(health.status === 'ok' ? 200 : 503).json(health);
});

router.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready' });
});

export default router;
```

---

## 8. Database Operations

### Migrations

```bash
# Create migration
npm run db:migrate:create -- --name add_users_table

# Run migrations
npm run db:migrate

# Rollback last migration
npm run db:migrate:rollback

# Reset database
npm run db:reset
```

### Backups

```bash
# Manual backup
pg_dump -h localhost -U postgres -d {{PROJECT_NAME_SNAKE}} -F c -f backup.dump

# Restore
pg_restore -h localhost -U postgres -d {{PROJECT_NAME_SNAKE}} backup.dump

# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="backup_${DATE}.dump"
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME -F c -f $FILENAME
aws s3 cp $FILENAME s3://{{BACKUP_BUCKET}}/$FILENAME
rm $FILENAME
```

---

## 9. Security

### Security Headers

```typescript
// api/src/middleware/security.ts
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

export const securityMiddleware = [
  helmet(),
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
    credentials: true,
  }),
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
  }),
];
```

### SSL/TLS

| Environment | SSL Configuration |
|-------------|-------------------|
| Development | Not required (HTTP) |
| Staging | Let's Encrypt (auto-renewed) |
| Production | Let's Encrypt or AWS ACM |

### Security Checklist

- [ ] HTTPS enforced in production
- [ ] Security headers configured (helmet)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Secrets not in version control
- [ ] Database credentials rotated regularly
- [ ] Dependencies regularly updated
- [ ] Security scanning in CI/CD

---

## 10. Scaling Strategy

### Horizontal Scaling

| Component | Scaling Method | Trigger |
|-----------|----------------|---------|
| API | Auto-scaling group | CPU > 70% |
| Database | Read replicas | Read load |
| Cache | Redis cluster | Memory usage |

### Performance Targets

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| API Response Time (p95) | < 200ms | > 500ms |
| API Error Rate | < 0.1% | > 1% |
| Database Query Time | < 50ms | > 200ms |
| Uptime | 99.9% | < 99.5% |

---

## 11. Disaster Recovery

### Backup Strategy

| Data | Frequency | Retention | Location |
|------|-----------|-----------|----------|
| Database | Daily | 30 days | {{BACKUP_LOCATION}} |
| Database (WAL) | Continuous | 7 days | {{BACKUP_LOCATION}} |
| User uploads | Real-time | Indefinite | {{STORAGE_LOCATION}} |
| Configs | Per commit | Git history | GitHub |

### Recovery Procedures

#### Database Recovery

```bash
# 1. Stop application
kubectl scale deployment api --replicas=0

# 2. Restore from backup
pg_restore -h $DB_HOST -U $DB_USER -d $DB_NAME -c backup.dump

# 3. Verify data integrity
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM users;"

# 4. Restart application
kubectl scale deployment api --replicas=3
```

### RTO/RPO Targets

| Metric | Target |
|--------|--------|
| RTO (Recovery Time Objective) | < 1 hour |
| RPO (Recovery Point Objective) | < 1 hour |

---

## 12. Runbooks

### Incident Response

```markdown
## High CPU on API Servers

**Severity:** High
**On-call:** {{ON_CALL_ROTATION}}

### Symptoms
- API latency > 500ms
- CPU utilization > 90%
- Alert: "High CPU on api-server-*"

### Steps
1. Check current load: `kubectl top pods`
2. Check for unusual traffic: `kubectl logs -f deployment/api`
3. Scale up if needed: `kubectl scale deployment api --replicas=5`
4. Identify root cause (bad query, traffic spike, etc.)
5. Fix root cause or implement rate limiting

### Escalation
If not resolved in 15 minutes, escalate to {{ESCALATION_CONTACT}}.
```

---

*This spec is maintained by the DevOps team. Last updated: {{DATE}}*
