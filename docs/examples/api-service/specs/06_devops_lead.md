# DataHub API Gateway - DevOps & Infrastructure Specification

## Overview

This document defines the complete DevOps infrastructure for DataHub API Gateway, including containerization, CI/CD pipelines, monitoring, logging, and deployment strategies.

**Target Platforms:**

- Docker / Docker Compose (development)
- Kubernetes (production)
- Cloud agnostic (AWS, GCP, Azure compatible)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Production Architecture                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                           ┌─────────────────┐                               │
│                           │  Load Balancer  │                               │
│                           │    (L7/HTTPS)   │                               │
│                           └────────┬────────┘                               │
│                                    │                                         │
│              ┌─────────────────────┼─────────────────────┐                  │
│              │                     │                     │                  │
│       ┌──────▼──────┐       ┌──────▼──────┐       ┌──────▼──────┐          │
│       │  DataHub    │       │  DataHub    │       │  DataHub    │          │
│       │  Instance 1 │       │  Instance 2 │       │  Instance 3 │          │
│       └──────┬──────┘       └──────┬──────┘       └──────┬──────┘          │
│              │                     │                     │                  │
│              └─────────────────────┼─────────────────────┘                  │
│                                    │                                         │
│         ┌──────────────────────────┼──────────────────────────┐             │
│         │                          │                          │             │
│  ┌──────▼──────┐           ┌───────▼──────┐          ┌───────▼──────┐      │
│  │  PostgreSQL │           │    Redis     │          │   Webhook    │      │
│  │   Primary   │           │   Cluster    │          │    Queue     │      │
│  └──────┬──────┘           └──────────────┘          └──────────────┘      │
│         │                                                                   │
│  ┌──────▼──────┐                                                           │
│  │  PostgreSQL │                                                           │
│  │   Replica   │                                                           │
│  └─────────────┘                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Docker Configuration

### Dockerfile (Production)

```dockerfile
# Dockerfile
# Multi-stage build for DataHub API Gateway

# ============================================
# Stage 1: Dependencies
# ============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --only=production

# ============================================
# Stage 2: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy all dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build TypeScript
RUN npm run build

# Prune dev dependencies
RUN npm prune --production

# ============================================
# Stage 3: Production Runner
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Security: Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 datahub

# Copy production files
COPY --from=builder --chown=datahub:nodejs /app/dist ./dist
COPY --from=builder --chown=datahub:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=datahub:nodejs /app/package.json ./

# Copy migrations
COPY --chown=datahub:nodejs migrations ./migrations

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Run as non-root
USER datahub

# Start application
CMD ["node", "dist/index.js"]
```

### Dockerfile (Development)

```dockerfile
# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Install development tools
RUN apk add --no-cache libc6-compat python3 make g++ curl

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci

# Copy source (will be overridden by volume mount)
COPY . .

# Expose port and debug port
EXPOSE 3000 9229

# Development with hot reload
CMD ["npm", "run", "dev"]
```

### Docker Compose (Development)

```yaml
# docker-compose.yml
version: '3.8'

services:
  datahub:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - '3000:3000'
      - '9229:9229' # Debug port
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
      PORT: 3000
      DATABASE_URL: postgresql://datahub:datahub@postgres:5432/datahub
      REDIS_URL: redis://redis:6379
      LOG_LEVEL: debug
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - datahub-network

  postgres:
    image: postgres:14-alpine
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: datahub
      POSTGRES_PASSWORD: datahub
      POSTGRES_DB: datahub
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U datahub']
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - datahub-network

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - datahub-network

  # Optional: Redis Commander for debugging
  redis-commander:
    image: rediscommander/redis-commander:latest
    ports:
      - '8081:8081'
    environment:
      REDIS_HOSTS: local:redis:6379
    depends_on:
      - redis
    networks:
      - datahub-network
    profiles:
      - debug

volumes:
  postgres-data:
  redis-data:

networks:
  datahub-network:
    driver: bridge
```

### Docker Compose (Production)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  datahub:
    image: datahub/api-gateway:${VERSION:-latest}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      LOG_LEVEL: info
    healthcheck:
      test: ['CMD', 'wget', '--spider', '-q', 'http://localhost:3000/health']
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - datahub-network
    logging:
      driver: 'json-file'
      options:
        max-size: '100m'
        max-file: '3'

networks:
  datahub-network:
    external: true
```

---

## Kubernetes Configuration

### Namespace and ConfigMap

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: datahub
  labels:
    app: datahub
    environment: production
---
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: datahub-config
  namespace: datahub
data:
  NODE_ENV: 'production'
  PORT: '3000'
  LOG_LEVEL: 'info'
  LOG_FORMAT: 'json'
  WEBHOOK_TIMEOUT_MS: '30000'
  WEBHOOK_MAX_RETRIES: '5'
  DEFAULT_RATE_LIMIT_MINUTE: '100'
  DEFAULT_RATE_LIMIT_HOUR: '5000'
```

### Secrets

```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: datahub-secrets
  namespace: datahub
type: Opaque
stringData:
  DATABASE_URL: 'postgresql://user:password@postgres:5432/datahub'
  REDIS_URL: 'redis://redis:6379'
  API_KEY_SALT: 'your-secret-salt-here'
  ADMIN_API_KEY: 'dh_live_initial_admin_key'
```

### Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: datahub-api
  namespace: datahub
  labels:
    app: datahub
    component: api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: datahub
      component: api
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    metadata:
      labels:
        app: datahub
        component: api
      annotations:
        prometheus.io/scrape: 'true'
        prometheus.io/port: '3000'
        prometheus.io/path: '/metrics'
    spec:
      serviceAccountName: datahub
      securityContext:
        runAsNonRoot: true
        runAsUser: 1001
        fsGroup: 1001
      containers:
        - name: datahub
          image: datahub/api-gateway:latest
          imagePullPolicy: Always
          ports:
            - name: http
              containerPort: 3000
              protocol: TCP
          envFrom:
            - configMapRef:
                name: datahub-config
            - secretRef:
                name: datahub-secrets
          resources:
            requests:
              cpu: '250m'
              memory: '256Mi'
            limits:
              cpu: '1000m'
              memory: '512Mi'
          livenessProbe:
            httpGet:
              path: /health/live
              port: http
            initialDelaySeconds: 10
            periodSeconds: 15
            timeoutSeconds: 5
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /health/ready
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
            timeoutSeconds: 5
            failureThreshold: 3
          startupProbe:
            httpGet:
              path: /health
              port: http
            initialDelaySeconds: 5
            periodSeconds: 5
            failureThreshold: 30
          volumeMounts:
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: tmp
          emptyDir: {}
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 100
              podAffinityTerm:
                labelSelector:
                  matchLabels:
                    app: datahub
                topologyKey: kubernetes.io/hostname
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: ScheduleAnyway
          labelSelector:
            matchLabels:
              app: datahub
```

### Service

```yaml
# k8s/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: datahub-api
  namespace: datahub
  labels:
    app: datahub
    component: api
spec:
  type: ClusterIP
  ports:
    - port: 80
      targetPort: http
      protocol: TCP
      name: http
  selector:
    app: datahub
    component: api
```

### Ingress

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: datahub-api
  namespace: datahub
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: '100'
    nginx.ingress.kubernetes.io/rate-limit-window: '1m'
    nginx.ingress.kubernetes.io/proxy-body-size: '10m'
    nginx.ingress.kubernetes.io/proxy-read-timeout: '60'
spec:
  tls:
    - hosts:
        - api.datahub.example.com
      secretName: datahub-api-tls
  rules:
    - host: api.datahub.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: datahub-api
                port:
                  number: 80
```

### Horizontal Pod Autoscaler

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: datahub-api
  namespace: datahub
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: datahub-api
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Percent
          value: 10
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
        - type: Percent
          value: 100
          periodSeconds: 15
        - type: Pods
          value: 4
          periodSeconds: 15
```

### Pod Disruption Budget

```yaml
# k8s/pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: datahub-api
  namespace: datahub
spec:
  minAvailable: 2
  selector:
    matchLabels:
      app: datahub
      component: api
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

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
    services:
      postgres:
        image: postgres:14-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: datahub_test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
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
      - name: Run migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/datahub_test
      - name: Run tests
        run: npm run test:coverage
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/datahub_test
          REDIS_URL: redis://localhost:6379
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run security audit
        run: npm audit --audit-level=high
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          ignore-unfixed: true
          severity: 'CRITICAL,HIGH'

  build:
    needs: [lint, test, security]
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
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
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix=
            type=raw,value=latest,enable=${{ github.ref == 'refs/heads/main' }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to staging
        uses: azure/k8s-deploy@v4
        with:
          namespace: datahub-staging
          manifests: |
            k8s/deployment.yaml
            k8s/service.yaml
          images: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to production
        uses: azure/k8s-deploy@v4
        with:
          namespace: datahub
          manifests: |
            k8s/deployment.yaml
            k8s/service.yaml
            k8s/hpa.yaml
          images: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          strategy: canary
          percentage: 20
```

### Database Migration Pipeline

```yaml
# .github/workflows/migrate.yml
name: Database Migration

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  migrate:
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci

      - name: Run migrations
        run: npm run db:migrate
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Verify migration
        run: npm run db:status
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## Monitoring & Observability

### Prometheus Metrics

```typescript
// src/metrics/index.ts
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

export const register = new Registry();

// HTTP metrics
export const httpRequestsTotal = new Counter({
  name: 'datahub_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
  registers: [register],
});

export const httpRequestDuration = new Histogram({
  name: 'datahub_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'path', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
  registers: [register],
});

// Rate limiting metrics
export const rateLimitHits = new Counter({
  name: 'datahub_rate_limit_hits_total',
  help: 'Total number of rate limit hits',
  labelNames: ['key_id', 'limit_type'],
  registers: [register],
});

// API key metrics
export const activeApiKeys = new Gauge({
  name: 'datahub_active_api_keys',
  help: 'Number of active API keys',
  registers: [register],
});

// Webhook metrics
export const webhookDeliveriesTotal = new Counter({
  name: 'datahub_webhook_deliveries_total',
  help: 'Total webhook deliveries',
  labelNames: ['webhook_id', 'event', 'status'],
  registers: [register],
});

export const webhookDeliveryDuration = new Histogram({
  name: 'datahub_webhook_delivery_duration_seconds',
  help: 'Webhook delivery duration',
  labelNames: ['webhook_id'],
  buckets: [0.1, 0.5, 1, 2, 5, 10, 30],
  registers: [register],
});

// Database metrics
export const dbQueryDuration = new Histogram({
  name: 'datahub_db_query_duration_seconds',
  help: 'Database query duration',
  labelNames: ['operation', 'table'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
  registers: [register],
});

export const dbConnectionPool = new Gauge({
  name: 'datahub_db_connection_pool',
  help: 'Database connection pool status',
  labelNames: ['status'],
  registers: [register],
});

// Redis metrics
export const redisOperations = new Counter({
  name: 'datahub_redis_operations_total',
  help: 'Total Redis operations',
  labelNames: ['operation', 'status'],
  registers: [register],
});
```

### Prometheus ServiceMonitor

```yaml
# k8s/servicemonitor.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: datahub-api
  namespace: datahub
  labels:
    app: datahub
spec:
  selector:
    matchLabels:
      app: datahub
      component: api
  endpoints:
    - port: http
      path: /metrics
      interval: 30s
      scrapeTimeout: 10s
```

### Grafana Dashboard (JSON)

```json
{
  "dashboard": {
    "title": "DataHub API Gateway",
    "panels": [
      {
        "title": "Request Rate",
        "type": "timeseries",
        "targets": [
          {
            "expr": "sum(rate(datahub_http_requests_total[5m])) by (status)",
            "legendFormat": "{{status}}"
          }
        ]
      },
      {
        "title": "Request Latency (p95)",
        "type": "timeseries",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(datahub_http_request_duration_seconds_bucket[5m])) by (le))"
          }
        ]
      },
      {
        "title": "Rate Limit Hits",
        "type": "stat",
        "targets": [
          {
            "expr": "sum(increase(datahub_rate_limit_hits_total[1h]))"
          }
        ]
      },
      {
        "title": "Active API Keys",
        "type": "stat",
        "targets": [
          {
            "expr": "datahub_active_api_keys"
          }
        ]
      },
      {
        "title": "Webhook Delivery Success Rate",
        "type": "gauge",
        "targets": [
          {
            "expr": "sum(rate(datahub_webhook_deliveries_total{status='success'}[5m])) / sum(rate(datahub_webhook_deliveries_total[5m])) * 100"
          }
        ]
      },
      {
        "title": "Database Connection Pool",
        "type": "timeseries",
        "targets": [
          {
            "expr": "datahub_db_connection_pool",
            "legendFormat": "{{status}}"
          }
        ]
      }
    ]
  }
}
```

### Alerting Rules

```yaml
# k8s/alerts.yaml
apiVersion: monitoring.coreos.com/v1
kind: PrometheusRule
metadata:
  name: datahub-alerts
  namespace: datahub
spec:
  groups:
    - name: datahub
      rules:
        - alert: HighErrorRate
          expr: |
            sum(rate(datahub_http_requests_total{status=~"5.."}[5m])) /
            sum(rate(datahub_http_requests_total[5m])) > 0.05
          for: 5m
          labels:
            severity: critical
          annotations:
            summary: 'High error rate detected'
            description: 'Error rate is above 5% for the last 5 minutes'

        - alert: HighLatency
          expr: |
            histogram_quantile(0.95, sum(rate(datahub_http_request_duration_seconds_bucket[5m])) by (le)) > 1
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: 'High latency detected'
            description: '95th percentile latency is above 1 second'

        - alert: RateLimitExceeded
          expr: |
            sum(increase(datahub_rate_limit_hits_total[5m])) > 1000
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: 'High rate of rate limit hits'
            description: 'Over 1000 rate limit hits in 5 minutes'

        - alert: WebhookDeliveryFailures
          expr: |
            sum(rate(datahub_webhook_deliveries_total{status="failed"}[5m])) /
            sum(rate(datahub_webhook_deliveries_total[5m])) > 0.1
          for: 10m
          labels:
            severity: warning
          annotations:
            summary: 'High webhook delivery failure rate'
            description: 'More than 10% of webhooks failing'

        - alert: DatabaseConnectionPoolExhausted
          expr: |
            datahub_db_connection_pool{status="waiting"} > 5
          for: 2m
          labels:
            severity: critical
          annotations:
            summary: 'Database connection pool exhausted'
            description: 'More than 5 queries waiting for connections'

        - alert: PodRestarting
          expr: |
            increase(kube_pod_container_status_restarts_total{namespace="datahub"}[1h]) > 3
          for: 5m
          labels:
            severity: warning
          annotations:
            summary: 'Pod restarting frequently'
            description: 'Pod has restarted more than 3 times in the last hour'
```

---

## Logging Configuration

### Structured Logging

```typescript
// src/utils/logger.ts
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    service: 'datahub-api',
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers["x-api-key"]',
      'body.apiKey',
      'body.secret',
      'body.password',
    ],
    censor: '[REDACTED]',
  },
});

export default logger;
```

### Log Format Example

```json
{
  "level": "info",
  "time": "2024-01-15T10:30:00.000Z",
  "service": "datahub-api",
  "version": "1.0.0",
  "environment": "production",
  "requestId": "req_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
  "method": "POST",
  "path": "/api/v1/keys",
  "statusCode": 201,
  "duration": 45,
  "keyId": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
  "msg": "Request completed"
}
```

### Fluentd Configuration

```yaml
# k8s/fluentd-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: fluentd-config
  namespace: datahub
data:
  fluent.conf: |
    <source>
      @type tail
      path /var/log/containers/datahub-*.log
      pos_file /var/log/fluentd-containers.log.pos
      tag kubernetes.*
      read_from_head true
      <parse>
        @type json
        time_key time
        time_format %Y-%m-%dT%H:%M:%S.%NZ
      </parse>
    </source>

    <filter kubernetes.**>
      @type kubernetes_metadata
    </filter>

    <match kubernetes.**>
      @type elasticsearch
      host elasticsearch.logging.svc
      port 9200
      logstash_format true
      logstash_prefix datahub
      include_timestamp true
      <buffer>
        @type file
        path /var/log/fluentd-buffers
        flush_mode interval
        flush_interval 5s
        retry_type exponential_backoff
      </buffer>
    </match>
```

---

## Backup & Recovery

### Database Backup Script

```bash
#!/bin/bash
# scripts/backup-db.sh

set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
BACKUP_FILE="${BACKUP_DIR}/datahub_${TIMESTAMP}.sql.gz"

# Create backup
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_FILE"

# Upload to S3
aws s3 cp "$BACKUP_FILE" "s3://${BACKUP_BUCKET}/database/"

# Cleanup old local backups (keep last 7 days)
find "$BACKUP_DIR" -name "datahub_*.sql.gz" -mtime +7 -delete

# Cleanup old S3 backups (keep last 30 days)
aws s3 ls "s3://${BACKUP_BUCKET}/database/" | \
  awk '{print $4}' | \
  sort | \
  head -n -30 | \
  xargs -I {} aws s3 rm "s3://${BACKUP_BUCKET}/database/{}"

echo "Backup completed: $BACKUP_FILE"
```

### Backup CronJob

```yaml
# k8s/backup-cronjob.yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: datahub-backup
  namespace: datahub
spec:
  schedule: '0 */6 * * *' # Every 6 hours
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: backup
              image: postgres:14-alpine
              command: ['/scripts/backup-db.sh']
              env:
                - name: DATABASE_URL
                  valueFrom:
                    secretKeyRef:
                      name: datahub-secrets
                      key: DATABASE_URL
                - name: BACKUP_BUCKET
                  value: 'datahub-backups'
              volumeMounts:
                - name: scripts
                  mountPath: /scripts
                - name: backups
                  mountPath: /backups
          volumes:
            - name: scripts
              configMap:
                name: backup-scripts
                defaultMode: 0755
            - name: backups
              emptyDir: {}
          restartPolicy: OnFailure
```

---

## Security Configuration

### Network Policies

```yaml
# k8s/network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: datahub-api
  namespace: datahub
spec:
  podSelector:
    matchLabels:
      app: datahub
      component: api
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
        - podSelector:
            matchLabels:
              app: prometheus
      ports:
        - protocol: TCP
          port: 3000
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: postgresql
      ports:
        - protocol: TCP
          port: 5432
    - to:
        - podSelector:
            matchLabels:
              app: redis
      ports:
        - protocol: TCP
          port: 6379
    - to: # Allow webhook deliveries
        - ipBlock:
            cidr: 0.0.0.0/0
            except:
              - 10.0.0.0/8
              - 172.16.0.0/12
              - 192.168.0.0/16
      ports:
        - protocol: TCP
          port: 443
```

### Pod Security Policy

```yaml
# k8s/pod-security.yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: datahub-restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'secret'
  hostNetwork: false
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: MustRunAsNonRoot
  seLinux:
    rule: RunAsAny
  fsGroup:
    rule: RunAsAny
  readOnlyRootFilesystem: true
```

---

## Environment Management

### Environment Variables Summary

| Variable              | Description           | Default     | Required        |
| --------------------- | --------------------- | ----------- | --------------- |
| `NODE_ENV`            | Environment mode      | development | Yes             |
| `PORT`                | Server port           | 3000        | No              |
| `DATABASE_URL`        | PostgreSQL connection | -           | Yes             |
| `REDIS_URL`           | Redis connection      | -           | Yes             |
| `LOG_LEVEL`           | Logging level         | info        | No              |
| `API_KEY_SALT`        | Salt for key hashing  | -           | Yes             |
| `ADMIN_API_KEY`       | Initial admin key     | -           | Yes (first run) |
| `WEBHOOK_TIMEOUT_MS`  | Webhook timeout       | 30000       | No              |
| `WEBHOOK_MAX_RETRIES` | Max webhook retries   | 5           | No              |

### Secrets Management

Recommended: Use external secrets management:

- **AWS**: AWS Secrets Manager with External Secrets Operator
- **GCP**: Google Secret Manager
- **Azure**: Azure Key Vault
- **HashiCorp**: Vault

```yaml
# k8s/external-secret.yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: datahub-secrets
  namespace: datahub
spec:
  refreshInterval: 1h
  secretStoreRef:
    kind: ClusterSecretStore
    name: aws-secrets-manager
  target:
    name: datahub-secrets
    creationPolicy: Owner
  data:
    - secretKey: DATABASE_URL
      remoteRef:
        key: datahub/production
        property: database_url
    - secretKey: REDIS_URL
      remoteRef:
        key: datahub/production
        property: redis_url
    - secretKey: API_KEY_SALT
      remoteRef:
        key: datahub/production
        property: api_key_salt
```

---

## Runbooks

### Runbook: High Error Rate

1. Check Grafana dashboard for error patterns
2. Review recent deployments: `kubectl rollout history deployment/datahub-api -n datahub`
3. Check pod logs: `kubectl logs -l app=datahub -n datahub --tail=100`
4. Verify database connectivity: `kubectl exec -it deploy/datahub-api -n datahub -- wget -q -O- http://localhost:3000/health/ready`
5. If deployment related, rollback: `kubectl rollout undo deployment/datahub-api -n datahub`

### Runbook: Database Connection Issues

1. Check database pod status: `kubectl get pods -l app=postgresql -n datahub`
2. Verify connection pool: Check `datahub_db_connection_pool` metric
3. Check for long-running queries in PostgreSQL
4. Restart application if pool exhausted: `kubectl rollout restart deployment/datahub-api -n datahub`

### Runbook: Rate Limit Issues

1. Identify affected keys from logs
2. Check if legitimate traffic or abuse
3. If legitimate, update rate limits via API
4. If abuse, revoke key: `curl -X DELETE .../api/v1/keys/{key_id}`

---

_This DevOps specification provides complete infrastructure configuration for deploying and operating DataHub API Gateway in production environments._
