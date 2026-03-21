---
role: devops_lead
spec_version: "1.0"
generated_by: autospec v0.2.0
model: auto
provider: claude-code
source_srs: srs-simple.md
source_hash: "sha256:7458b2f5b29602d300ec5766ab196f4f026b7aca8470f82fe507d40b7c83ea36"
generated_at: 2026-03-21T10:15:08.510Z
---

role: devops_lead
spec_version: "1.0"
generated_by: autospec
model: claude-opus-4-0-20250514
provider: anthropic
source_srs: taskflow_srs.md
source_hash: sha256:taskflow-srs-v1
generated_at: "2026-03-21T00:00:00Z"
---

# 06 — DevOps Lead Specification: TaskFlow

## Infrastructure Overview

### Cloud Provider & Hosting

TaskFlow is a **solo-developer, open-source, single-user** personal task management app. The infrastructure is designed for minimal cost and operational simplicity, matching the project's constraints.

| Property | Value | Rationale |
|----------|-------|-----------|
| **Hosting** | Single VPS (DigitalOcean Droplet or equivalent) | $6–12/mo; single-user app needs no horizontal scaling |
| **OS** | Ubuntu 22.04 LTS | Stable, well-supported, Docker-compatible |
| **Region** | Closest to user (configurable) | Single-user app — deploy near the user |
| **Reverse Proxy** | Nginx | SSL termination, static file serving, API proxy |
| **Container Runtime** | Docker + Docker Compose | Consistent environments, simple orchestration |
| **DNS** | Cloudflare (free tier) | DNS, DDoS protection, SSL via origin certs |
| **Registry** | GitHub Container Registry (ghcr.io) | Free for public repos, integrated with GitHub Actions |

### Topology Diagram

```mermaid
graph TB
    subgraph "Client"
        Browser["Browser / PWA"]
    end

    subgraph "Cloudflare"
        CF["Cloudflare DNS + CDN"]
    end

    subgraph "VPS (Ubuntu 22.04)"
        Nginx["Nginx :443"]

        subgraph "Docker Compose"
            API["taskflow-api :3000\nNode.js + Express"]
            SQLite[("SQLite\ntaskflow.db")]
        end

        Backups["Backup CronJob\nDaily 02:00 UTC"]
        BackupDir["/backups/"]
    end

    subgraph "External"
        GHCR["ghcr.io\nContainer Registry"]
        GHA["GitHub Actions\nCI/CD"]
        S3["S3-compatible Storage\n(backup offsite)"]
    end

    Browser -->|HTTPS| CF
    CF -->|HTTPS| Nginx
    Nginx -->|"/* static files"| API
    Nginx -->|"/api/* proxy"| API
    API --> SQLite
    Backups -->|"sqlite3 .backup"| BackupDir
    BackupDir -->|"rclone sync"| S3
    GHA -->|"docker push"| GHCR
    GHA -->|"ssh deploy"| Nginx

> **Note:** SQLite is an embedded file database — no separate database container is needed. The API process accesses `taskflow.db` directly via a Docker volume mount. This is appropriate per `04_db_architect.md` which selected SQLite for the single-user, no-concurrency use case.

---

## Environments

| Property | Development | Staging | Production |
|----------|-------------|---------|------------|
| **URL** | `http://localhost:5173` (Vite) + `:3000` (API) | `https://staging.taskflow.example.com` | `https://taskflow.example.com` |
| **Runs on** | Developer's machine (Docker Compose) | VPS (same host, separate compose project) | VPS (primary compose project) |
| **Database** | `taskflow-dev.db` (local file) | `taskflow-staging.db` (Docker volume) | `taskflow.db` (Docker volume) |
| **JWT Expiry** | Access: 1h / Refresh: 7d | Access: 30m / Refresh: 7d | Access: 15m / Refresh: 7d |
| **Rate Limiting** | Disabled | 200 req/min | 100 req/min |
| **Log Level** | `debug` | `info` | `warn` |
| **Source Maps** | Enabled | Enabled | Disabled |
| **Service Worker** | Disabled (Vite dev) | Enabled | Enabled |
| **CORS Origin** | `http://localhost:5173` | `https://staging.taskflow.example.com` | `https://taskflow.example.com` |
| **Bcrypt Rounds** | 10 | 12 | 12 |
| **Node ENV** | `development` | `staging` | `production` |
| **Docker Compose File** | `docker-compose.yml` | `docker-compose.staging.yml` | `docker-compose.prod.yml` |
| **Env File** | `.env.development` | `.env.staging` | `.env.production` |

---

## CI/CD Pipeline

### Pipeline Stages

Per `05_qa_lead.md` CI Integration section, the pipeline uses GitHub Actions with the following stages:

```mermaid
graph LR
    A["Push / PR"] --> B["Lint & Type Check"]
    B --> C["Unit Tests"]
    C --> D["Integration Tests"]
    D --> E["Build"]
    E --> F["E2E Tests"]
    F --> G["Security Scan"]
    G --> H{"Branch?"}
    H -->|main| I["Deploy Staging"]
    I --> J["Smoke Tests"]
    J --> K["Manual Approval"]
    K --> L["Deploy Production"]
    H -->|"feature/*"| M["PR Status ✓"]

### Stage Details

| Stage | Trigger | Gate (must pass) | Timeout | Runner |
|-------|---------|------------------|---------|--------|
| **Lint & Type Check** | Every push, every PR | `eslint .` + `tsc --noEmit` exit 0 | 3 min | `ubuntu-latest` |
| **Unit Tests** | After lint passes | 60% of test suite — Vitest unit tests, all pass (ref: `05_qa_lead.md` testing pyramid) | 5 min | `ubuntu-latest` |
| **Integration Tests** | After unit tests pass | 25% of test suite — Vitest + Supertest API contract tests, all pass (ref: `05_qa_lead.md` API contract tests) | 5 min | `ubuntu-latest` |
| **Build** | After integration tests pass | `docker build` exits 0, image < 200MB | 5 min | `ubuntu-latest` |
| **E2E Tests** | After build succeeds | 15% of test suite — Playwright persona flows against Docker Compose stack (ref: `05_qa_lead.md` E2E test cases: Noa + Amit flows) | 10 min | `ubuntu-latest` |
| **Security Scan** | After E2E tests pass | `npm audit --production` has 0 critical/high vulns; Trivy container scan has 0 critical | 3 min | `ubuntu-latest` |
| **Deploy Staging** | Merge to `main` | All above gates passed | 5 min | `ubuntu-latest` |
| **Smoke Tests** | After staging deploy | Health endpoint returns 200; login flow succeeds | 2 min | `ubuntu-latest` |
| **Deploy Production** | Manual approval after smoke tests | Approved by repository owner | 5 min | `ubuntu-latest` |

### Trigger Rules

| Event | Pipeline Scope |
|-------|----------------|
| Push to `feature/*` branch | Lint → Unit → Integration → Build |
| PR opened/updated against `main` | Full pipeline through E2E + Security Scan |
| Merge to `main` | Full pipeline + Deploy Staging + Smoke Tests |
| Manual dispatch (`workflow_dispatch`) | Full pipeline + Deploy Staging + optional Production |
| Tag `v*` | Full pipeline + Deploy Staging + Auto-deploy Production |

### Production Deploy Approval

- **Who can approve:** Repository owner (solo developer)
- **Approval mechanism:** GitHub Actions environment protection rule on `production` environment
- **Approval timeout:** 72 hours (auto-reject if not approved)

### Rollback Mechanism

```bash
# Immediate rollback to previous version
ssh deploy@taskflow-vps "cd /opt/taskflow && \
  docker tag taskflow-api:current taskflow-api:failed && \
  docker tag taskflow-api:previous taskflow-api:current && \
  docker compose -f docker-compose.prod.yml up -d api"

# Database rollback (if migration was applied)
# Per 04_db_architect.md: each migration has a down script
ssh deploy@taskflow-vps "cd /opt/taskflow && \
  docker compose -f docker-compose.prod.yml run --rm api node dist/migrate.js down --to <previous_version>"

# Restore database from pre-deploy backup if needed
ssh deploy@taskflow-vps "cp /opt/taskflow/backups/taskflow-pre-deploy-latest.db \
  /opt/taskflow/data/taskflow.db && \
  docker compose -f docker-compose.prod.yml restart api"

---

## Containerization

### Docker Setup

#### API Dockerfile (`Dockerfile`)

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig*.json ./
RUN npm ci
COPY src/ src/
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
RUN addgroup -g 1001 -S taskflow && \
    adduser -S taskflow -u 1001
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
# SQLite needs native bindings — ensure better-sqlite3 is rebuilt for Alpine
RUN npm rebuild better-sqlite3
USER taskflow
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/api/v1/health || exit 1
CMD ["node", "dist/index.js"]

#### Base Images

| Image | Purpose | Tag Policy |
|-------|---------|------------|
| `node:20-alpine` | Build + runtime | Pin to `20-alpine` (LTS), update monthly |

#### Registry

- **Registry:** `ghcr.io/<owner>/taskflow-api`
- **Tag strategy:** `latest`, `sha-<short-commit>`, `v<semver>`
- **Retention:** Keep last 10 tagged images; prune untagged after 7 days

### Docker Compose — Local Development

```yaml
# docker-compose.yml — Local development environment
version: "3.8"

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: builder
    command: npx ts-node-dev --respawn src/index.ts
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src:delegated        # Hot reload source files
      - ./data:/app/data                # SQLite database file
      - /app/node_modules               # Prevent host override
    env_file:
      - .env.development
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:3000/api/v1/health"]
      interval: 10s
      timeout: 5s
      retries: 3
    restart: unless-stopped

volumes:
  taskflow-data:

# Usage:
#   docker compose up          # Start API (hot-reload)
#   cd frontend && npm run dev # Start Vite dev server on :5173 (run on host)
#
# Why no frontend container?
#   Vite HMR is fastest natively on the host.
#   Production serves static files via Nginx — no container needed.

---

## Deployment Strategy

### Strategy: Rolling Deployment (Single Instance)

**Justification for TaskFlow specifically:**

1. **Single user** — There is exactly one user. Deployment windows are trivially coordinated (the developer _is_ the user). Blue-green requires two instances; canary requires traffic splitting — both are over-engineered for N=1 users.
2. **PWA with offline support** — Per `03_frontend_lead.md` service worker strategy, the app shell and task data are cached in IndexedDB. The user can continue working during the ~10-second container restart. This provides an inherent zero-downtime experience from the user's perspective.
3. **SQLite embedded database** — No connection draining, no multi-instance write conflicts. A single API process owns the database file exclusively.
4. **Solo developer budget** — Multi-instance hosting doubles the VPS cost for no measurable benefit.

### Deployment Procedure

```mermaid
sequenceDiagram
    participant GHA as GitHub Actions
    participant VPS as VPS (ssh)
    participant Docker as Docker Compose
    participant Nginx as Nginx

    GHA->>GHA: Build & push image to ghcr.io
    GHA->>VPS: SSH: pull new image
    VPS->>VPS: sqlite3 .backup (pre-deploy snapshot)
    VPS->>Docker: docker compose run --rm api node dist/migrate.js up
    VPS->>Docker: docker compose up -d api (new image)
    Docker->>Docker: Health check (30s interval, 3 retries)
    GHA->>VPS: Smoke test: GET /api/v1/health
    alt Health check fails
        VPS->>Docker: Rollback: restore previous image tag
        VPS->>VPS: Restore database from pre-deploy backup
        VPS->>Docker: docker compose up -d api (previous image)
    end

### Deploy Script (`scripts/deploy.sh`)

```bash
#!/bin/bash
set -euo pipefail

IMAGE="ghcr.io/${GITHUB_REPOSITORY}/taskflow-api"
TAG="${1:-latest}"
DEPLOY_DIR="/opt/taskflow"

echo "=== TaskFlow Deploy: $IMAGE:$TAG ==="

# 1. Pre-deploy backup (per 04_db_architect.md backup strategy)
sqlite3 "$DEPLOY_DIR/data/taskflow.db" ".backup '$DEPLOY_DIR/backups/taskflow-pre-deploy-$(date +%Y%m%d-%H%M%S).db'"

# 2. Pull new image and tag for rollback
docker pull "$IMAGE:$TAG"
docker tag taskflow-api:current taskflow-api:previous 2>/dev/null || true
docker tag "$IMAGE:$TAG" taskflow-api:current

# 3. Run migrations
docker compose -f "$DEPLOY_DIR/docker-compose.prod.yml" run --rm api node dist/migrate.js up

# 4. Restart with new image
docker compose -f "$DEPLOY_DIR/docker-compose.prod.yml" up -d api

# 5. Wait for health check
echo "Waiting for health check..."
for i in $(seq 1 10); do
  if curl -sf http://localhost:3000/api/v1/health > /dev/null 2>&1; then
    echo "✓ Health check passed on attempt $i"
    exit 0
  fi
  sleep 3
done

# 6. Rollback on failure
echo "✗ Health check failed after 30s — rolling back"
docker tag taskflow-api:previous taskflow-api:current
docker compose -f "$DEPLOY_DIR/docker-compose.prod.yml" up -d api
exit 1

---

## Configuration and Secrets Management

### Environment Variables

| Variable | Dev | Staging | Production | Sensitive? |
|----------|-----|---------|------------|------------|
| `NODE_ENV` | `development` | `staging` | `production` | No |
| `PORT` | `3000` | `3001` | `3000` | No |
| `DATABASE_PATH` | `./data/taskflow-dev.db` | `/app/data/taskflow-staging.db` | `/app/data/taskflow.db` | No |
| `JWT_SECRET` | `dev-jwt-secret-do-not-use-in-prod` | (generated 64-char random) | (generated 64-char random) | **Yes** |
| `JWT_ACCESS_EXPIRY` | `1h` | `30m` | `15m` | No |
| `JWT_REFRESH_EXPIRY` | `7d` | `7d` | `7d` | No |
| `CORS_ORIGIN` | `http://localhost:5173` | `https://staging.taskflow.example.com` | `https://taskflow.example.com` | No |
| `BCRYPT_ROUNDS` | `10` | `12` | `12` | No |
| `LOG_LEVEL` | `debug` | `info` | `warn` | No |
| `RATE_LIMIT_WINDOW_MS` | `60000` | `60000` | `60000` | No |
| `RATE_LIMIT_MAX` | `0` (disabled) | `200` | `100` | No |
| `BACKUP_S3_BUCKET` | — | — | `taskflow-backups` | No |
| `BACKUP_S3_ACCESS_KEY` | — | — | (from provider) | **Yes** |
| `BACKUP_S3_SECRET_KEY` | — | — | (from provider) | **Yes** |

### Secrets Storage

| Secret | Storage Location | Access Method |
|--------|-----------------|---------------|
| `JWT_SECRET` | **GitHub Actions Repository Secrets** (CI) + `.env.production` file on VPS (runtime) | Injected via Docker Compose `env_file` directive |
| `BACKUP_S3_ACCESS_KEY` | **GitHub Actions Repository Secrets** + `.env.production` on VPS | Injected as env var to backup cron script |
| `BACKUP_S3_SECRET_KEY` | **GitHub Actions Repository Secrets** + `.env.production` on VPS | Injected as env var to backup cron script |
| SSH deploy key | **GitHub Actions Repository Secrets** (`DEPLOY_SSH_KEY`) | Used by `appleboy/ssh-action` in deploy workflow |
| `GHCR_TOKEN` | **GitHub Actions** automatic `GITHUB_TOKEN` | Used by `docker/login-action` for ghcr.io push |

### Secret Generation

```bash
# Generate JWT_SECRET (64 random bytes, base64-encoded)
openssl rand -base64 64 | tr -d '\n'

# Generate SSH deploy key
ssh-keygen -t ed25519 -f taskflow-deploy -C "taskflow-deploy@github-actions" -N ""
# Add taskflow-deploy.pub to VPS ~/.ssh/authorized_keys
# Add taskflow-deploy (private) to GitHub Actions secret DEPLOY_SSH_KEY

### Rotation Policy

| Secret | Rotation Frequency | Procedure |
|--------|-------------------|-----------|
| `JWT_SECRET` | Every 90 days or on suspected compromise | Update in `.env.production` + GitHub Secrets, restart API. All existing JWTs are invalidated — user must re-login (acceptable for single-user app). |
| `BACKUP_S3_*` | Every 180 days | Rotate in cloud provider console, update `.env.production` + GitHub Secrets |
| SSH deploy key | Every 365 days | Generate new ed25519 keypair, update `authorized_keys` on VPS + GitHub Secret |

### File Permissions on VPS

```bash
chmod 600 /opt/taskflow/.env.production
chmod 600 /opt/taskflow/.env.staging
chown deploy:deploy /opt/taskflow/.env.*

---

## Monitoring and Alerting

### Monitoring Stack

For a solo-developer, single-user app, a lightweight, low-cost monitoring stack:

| Component | Tool | Cost | Rationale |
|-----------|------|------|-----------|
| **Uptime monitoring** | UptimeRobot (free tier) | $0 | External HTTP checks every 5 min, email/SMS alerts |
| **Error tracking** | Sentry (free tier — 5K events/mo) | $0 | Stack traces, release tracking, performance monitoring |
| **Application logs** | Docker `json-file` log driver + `journalctl` | $0 | Structured JSON logs, rotated automatically |
| **VPS metrics** | Netdata (self-hosted agent) | $0 | Real-time CPU, memory, disk, network dashboard |

### Application Metrics

Collected via Express middleware, exposed at `GET /api/v1/health` (public) and `GET /api/v1/health/metrics` (JWT-authenticated):

| Metric | Collection Method | Purpose |
|--------|------------------|---------|
| `http_requests_total` | Express middleware counter | Request volume |
| `http_request_duration_ms` | Express middleware histogram (p50/p95/p99) | Latency — SRS requires "page load under 1 second" |
| `http_errors_5xx_total` | Express error handler counter | Server error rate |
| `http_errors_4xx_total` | Express error handler counter | Client error rate |
| `db_query_duration_ms` | SQLite query wrapper timing | Database performance (ref: `04_db_architect.md` query performance budget) |
| `db_file_size_bytes` | Periodic `fs.stat()` on `taskflow.db` | Database growth tracking |
| `active_refresh_tokens` | Count of non-expired rows in `refresh_tokens` table | Session tracking |
| `node_heap_used_bytes` | `process.memoryUsage().heapUsed` | Memory leak detection |
| `uptime_seconds` | `process.uptime()` | Restart detection |

### Alert Thresholds

| Alert | Condition | Severity | Notification | Action |
|-------|-----------|----------|--------------|--------|
| **Site Down** | Health endpoint unreachable for 2 consecutive checks (10 min) | Critical | UptimeRobot → Email + SMS | SSH to VPS, run `docker ps`, check logs, restart container |
| **High Error Rate** | HTTP 5xx rate > 5% of total requests over 5 min | High | Sentry alert rule → Email | Check Sentry for stack trace, review `docker logs taskflow-api` |
| **Slow Response** | p95 latency > 1000ms for 5 min (per SRS: "page load under 1 second") | Medium | Sentry performance alert → Email | Profile slow queries per `04_db_architect.md` query performance budget, check WAL checkpoint status |
| **Disk Space Low** | VPS disk usage > 85% | High | Netdata → Email | Prune Docker images (`docker system prune`), rotate old backups, expand VPS disk |
| **Memory High** | API container memory > 256MB (of 512MB limit) | Medium | Netdata → Email | Check for memory leaks (heap snapshot), restart container |
| **Database Large** | `taskflow.db` > 500MB | Low | Weekly cron check → Email | Evaluate data archival per `04_db_architect.md` database file size guidance |
| **SSL Certificate Expiry** | Certificate expires within 14 days | High | UptimeRobot SSL check → Email | Renew via Cloudflare dashboard or `certbot renew` |
| **Backup Failed** | Backup cron script exits non-zero | Critical | Cron `MAILTO=owner@example.com` → Email | Check disk space, verify S3 credentials, manually run backup script |

### Structured Log Format

All API logs use structured JSON for machine parsing and grep-ability:

```json
{
  "timestamp": "2026-03-21T12:00:00.000Z",
  "level": "info",
  "message": "POST /api/v1/tasks 201",
  "method": "POST",
  "path": "/api/v1/tasks",
  "statusCode": 201,
  "durationMs": 45,
  "userId": "a1b2c3d4-...",
  "requestId": "req-abc123"
}

### Docker Log Configuration

```yaml
# In docker-compose.prod.yml
services:
  api:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "5"   # Total: 50MB max log retention

### On-Call Policy

Solo developer project — no formal rotation:

- **Primary contact:** Repository owner (receives all alerts via email/SMS)
- **Response SLA:** Best effort; this is a personal productivity app, not a revenue-critical service
- **Escalation:** N/A (single developer)

---

## Scaling Strategy

### Current Scale Targets

Per the SRS constraints ("single-user app with no team features in v1"):

| Metric | Target | Basis |
|--------|--------|-------|
| Concurrent users | 1 | SRS: "Single-user app" |
| Tasks in database | < 10,000 | Personal task manager, ~10 tasks/day over 3 years |
| Requests per minute | < 10 | Single user interacting with dashboard/task lists |
| Database file size | < 100MB | SQLite with < 10K rows of task data |
| API memory | < 256 MB | Express + SQLite, no heavy processing |

### Vertical Scaling (Primary Strategy)

| Resource | Starting Allocation | Scale Trigger | Scale To |
|----------|-------------------|---------------|----------|
| **VPS CPU** | 1 vCPU | Sustained > 80% CPU for 1 hour (Netdata alert) | 2 vCPU (upgrade VPS plan) |
| **VPS RAM** | 1 GB | Container OOM or sustained > 85% memory (Netdata alert) | 2 GB |
| **VPS Disk** | 25 GB SSD | Usage > 85% (Netdata alert) | 50 GB |
| **Container Memory Limit** | 256 MB | OOM kills in `docker inspect` | 512 MB (`mem_limit` in compose) |

### Horizontal Scaling

**Not applicable for v1.** SQLite does not support concurrent writers from multiple processes. If TaskFlow evolves to multi-user:

1. Migrate from SQLite → PostgreSQL (per `04_db_architect.md` open questions)
2. Add a separate database container
3. Deploy multiple API replicas behind Nginx upstream
4. Add connection pooling (PgBouncer)

### Auto-Scaling

**Not implemented.** A single-user app on a fixed VPS does not benefit from auto-scaling. Resource exhaustion is detected via Netdata alerts; the developer manually upgrades the VPS plan as needed.

---

## Database Operations

### Backup Schedule

Per `04_db_architect.md` backup strategy:

| Backup Type | Schedule | Retention | Storage Location |
|-------------|----------|-----------|------------------|
| **Daily full backup** | Cron at 02:00 UTC daily | 30 days local, 90 days offsite | VPS `/opt/taskflow/backups/` + S3-compatible bucket |
| **Pre-deploy backup** | Automatically before every deployment | 7 days local | VPS `/opt/taskflow/backups/` |
| **Manual backup** | On-demand via `scripts/backup.sh` | Until manually deleted | VPS `/opt/taskflow/backups/` |

### Backup Script

Aligned with `04_db_architect.md` backup script specification:

```bash
#!/bin/bash
# scripts/backup.sh — called by cron daily at 02:00 UTC
set -euo pipefail

BACKUP_DIR="/opt/taskflow/backups"
DB_PATH="/opt/taskflow/data/taskflow.db"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_FILE="$BACKUP_DIR/taskflow-$DATE.db"

mkdir -p "$BACKUP_DIR"

# Use SQLite .backup for a consistent copy (safe with WAL mode per 04_db_architect.md)
sqlite3 "$DB_PATH" ".backup '$BACKUP_FILE'"

# Compress
gzip "$BACKUP_FILE"

# Sync to offsite storage (if configured)
if [ -n "${BACKUP_S3_BUCKET:-}" ]; then
  rclone copy "$BACKUP_FILE.gz" "s3:$BACKUP_S3_BUCKET/daily/"
fi

# Prune local backups older than 30 days (per 04_db_architect.md retention)
find "$BACKUP_DIR" -name "taskflow-*.db.gz" -mtime +30 -delete

echo "[$(date -Iseconds)] Backup completed: $BACKUP_FILE.gz"

### Cron Entry

```cron
# Daily backup at 02:00 UTC
0 2 * * * /opt/taskflow/scripts/backup.sh >> /var/log/taskflow-backup.log 2>&1
# Weekly backup log rotation
0 3 * * 0 truncate -s 0 /var/log/taskflow-backup.log

### Restore Procedure

```bash
# 1. Stop the API container
docker compose -f /opt/taskflow/docker-compose.prod.yml stop api

# 2. Locate and decompress the desired backup
ls -la /opt/taskflow/backups/   # List available backups
gunzip /opt/taskflow/backups/taskflow-20260321-020000.db.gz

# 3. Preserve current database (safety net)
cp /opt/taskflow/data/taskflow.db /opt/taskflow/data/taskflow.db.pre-restore

# 4. Replace with backup
cp /opt/taskflow/backups/taskflow-20260321-020000.db /opt/taskflow/data/taskflow.db

# 5. Restart API
docker compose -f /opt/taskflow/docker-compose.prod.yml start api

# 6. Verify health
curl -sf http://localhost:3000/api/v1/health && echo "Restore successful"

# 7. Re-compress used backup
gzip /opt/taskflow/backups/taskflow-20260321-020000.db

### Migration in CI/CD

Per `04_db_architect.md` migration strategy:

1. **Migrations run as a pre-deploy step** in the deploy script: `docker compose run --rm api node dist/migrate.js up`
2. **Each migration has `up()` and `down()` functions** for forward and rollback capability
3. **Migration state** is tracked in a `_migrations` table inside the SQLite database
4. **CI validates migrations** by running them against a fresh database during the integration test stage (ref: `05_qa_lead.md` pipeline stages)
5. **Zero-downtime migrations** are not needed — SQLite is single-file with one user (per `04_db_architect.md` zero-downtime section)
6. **Migration rollback**: If a deploy fails, run `node dist/migrate.js down --to <version>` then restore from pre-deploy backup

---

## Disaster Recovery

### RTO/RPO Targets

| Metric | Target | Justification |
|--------|--------|---------------|
| **RPO (Recovery Point Objective)** | 24 hours | Daily backups at 02:00 UTC. Personal task data is low-criticality. PWA offline data in IndexedDB (per `03_frontend_lead.md` and `04_db_architect.md` PWA offline data section) provides client-side resilience — user retains local copy of all tasks. |
| **RTO (Recovery Time Objective)** | 4 hours | Time to provision new VPS, install Docker, restore from S3 backup, update DNS. Acceptable for a personal productivity app with PWA fallback. |

### Failure Scenarios & Recovery

| Scenario | Impact | Recovery | Estimated Time |
|----------|--------|----------|----------------|
| **API container crash** | Service temporarily unavailable | Docker `restart: unless-stopped` auto-recovers | < 30 seconds |
| **VPS reboot** | All services temporarily unavailable | Docker Compose services auto-restart | < 2 minutes |
| **Database file corruption** | Data inaccessible | Stop API, restore from latest daily backup (see Restore Procedure) | 15 minutes |
| **Accidental data deletion** | Partial data loss | Restore from backup + sync offline data from PWA via `POST /api/v1/sync` | 30 minutes |
| **VPS total failure** | Complete outage | Full recovery runbook (below) | 2–4 hours |
| **DNS/Cloudflare outage** | Domain unreachable | PWA continues working offline; wait for provider recovery | N/A (external) |

### Runbook: VPS Total Failure Recovery

```bash
#!/bin/bash
# RUNBOOK: VPS Total Failure Recovery
# Estimated time: 2-4 hours
# Prerequisites: Access to cloud provider console, GitHub, Cloudflare, S3 backup

# === STEP 1: Provision New VPS (15 min) ===
# Create new VPS: Ubuntu 22.04 LTS, 1 vCPU, 1 GB RAM, 25 GB SSD
# Note the new IP address: NEW_IP=<new.ip.address>

# === STEP 2: Install Dependencies (10 min) ===
ssh root@$NEW_IP << 'SETUP'
apt update && apt upgrade -y
apt install -y docker.io docker-compose-plugin nginx sqlite3 rclone
systemctl enable docker
useradd -m -s /bin/bash -G docker deploy
mkdir -p /opt/taskflow/{data,backups,scripts}
chown -R deploy:deploy /opt/taskflow
SETUP

# === STEP 3: Restore Configuration (10 min) ===
# Copy from local backup or password manager:
scp .env.production deploy@$NEW_IP:/opt/taskflow/
scp docker-compose.prod.yml deploy@$NEW_IP:/opt/taskflow/
scp nginx/taskflow.conf deploy@$NEW_IP:/etc/nginx/sites-enabled/
scp scripts/backup.sh deploy@$NEW_IP:/opt/taskflow/scripts/
scp scripts/deploy.sh deploy@$NEW_IP:/opt/taskflow/scripts/

# === STEP 4: Restore Database from S3 (5 min) ===
ssh deploy@$NEW_IP << 'RESTORE'
rclone copy s3:taskflow-backups/daily/ /opt/taskflow/backups/ --include "taskflow-*.db.gz" --max-count 1 --order-by modtime,desc
LATEST=$(ls -t /opt/taskflow/backups/taskflow-*.db.gz | head -1)
gunzip "$LATEST"
cp "${LATEST%.gz}" /opt/taskflow/data/taskflow.db
RESTORE

# === STEP 5: Pull and Start Application (5 min) ===
ssh deploy@$NEW_IP << 'START'
cd /opt/taskflow
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
sleep 10
curl -sf http://localhost:3000/api/v1/health && echo "API healthy" || echo "API UNHEALTHY"
START

# === STEP 6: Restore SSL & Nginx (5 min) ===
ssh root@$NEW_IP << 'SSL'
# Option A: Cloudflare origin cert (download from Cloudflare dashboard)
# Place at /etc/nginx/ssl/taskflow.{crt,key}
# Option B: Let's Encrypt
# apt install certbot python3-certbot-nginx && certbot --nginx -d taskflow.example.com
nginx -t && systemctl reload nginx
SSL

# === STEP 7: Update DNS (5 min, then propagation ~5-30 min) ===
# In Cloudflare dashboard: Update A record for taskflow.example.com → $NEW_IP

# === STEP 8: Verify End-to-End ===
curl -sf https://taskflow.example.com/api/v1/health && echo "Recovery COMPLETE"

# === STEP 9: Restore Cron Jobs ===
ssh deploy@$NEW_IP "crontab -l; echo '0 2 * * * /opt/taskflow/scripts/backup.sh >> /var/log/taskflow-backup.log 2>&1' | crontab -"

# === STEP 10: Post-Recovery ===
# - User opens PWA → service worker syncs offline changes via POST /api/v1/sync
# - Verify data integrity: compare task count before/after
# - Monitor logs for 24 hours for any issues

### PWA Offline Resilience

Per `03_frontend_lead.md` PWA strategy and `04_db_architect.md` PWA offline data section:

- The service worker caches the full app shell (HTML, JS, CSS) and static assets
- IndexedDB stores task data locally for full offline functionality
- The user **can continue creating, editing, and completing tasks** during any server outage
- On server recovery, the sync endpoint (`POST /api/v1/sync`) reconciles offline changes using timestamp-based conflict resolution (per `02_backend_lead.md` sync endpoint)
- **Effective user-perceived downtime is near zero** for most failure scenarios

---

## GitHub Actions Workflow

### `.github/workflows/ci-cd.yml`

```yaml
name: TaskFlow CI/CD

on:
  push:
    branches: [main, "feature/**"]
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      deploy_production:
        description: "Deploy to production after staging"
        type: boolean
        default: false

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/taskflow-api

jobs:
  lint-and-typecheck:
    runs-on: ubuntu-latest
    timeout-minutes: 3
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx eslint .
      - run: npx tsc --noEmit

  unit-tests:
    needs: lint-and-typecheck
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx vitest run --reporter=junit --outputFile=test-results/unit.xml
        env:
          NODE_ENV: test
          DATABASE_PATH: ":memory:"
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: unit-test-results
          path: test-results/

  integration-tests:
    needs: unit-tests
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx vitest run --config vitest.integration.config.ts --reporter=junit --outputFile=test-results/integration.xml
        env:
          NODE_ENV: test
          DATABASE_PATH: ./test-taskflow.db
          JWT_SECRET: test-secret-ci
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: integration-test-results
          path: test-results/

  build:
    needs: integration-tests
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

  e2e-tests:
    needs: build
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - name: Start services via Docker Compose
        run: |
          docker compose -f docker-compose.yml up -d
          for i in $(seq 1 30); do
            curl -sf http://localhost:3000/api/v1/health && break || sleep 2
          done
        env:
          DATABASE_PATH: /app/data/test-e2e.db
      - run: npx playwright test
        env:
          BASE_URL: http://localhost:3000
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
      - name: Stop services
        if: always()
        run: docker compose down -v

  security-scan:
    needs: build
    runs-on: ubuntu-latest
    timeout-minutes: 3
    steps:
      - uses: actions/checkout@v4
      - run: npm ci --omit=dev
      - run: npm audit --omit=dev --audit-level=high
      - uses: aquasecurity/trivy-action@master
        with:
          image-ref: "${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}"
          severity: "CRITICAL"
          exit-code: "1"

  deploy-staging:
    needs: [e2e-tests, security-scan]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: staging
    timeout-minutes: 5
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: deploy
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            cd /opt/taskflow
            docker pull ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            docker tag ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} taskflow-api:staging
            docker compose -f docker-compose.staging.yml up -d api
            sleep 5
            curl -sf http://localhost:3001/api/v1/health || exit 1
            echo "Staging deploy successful"

  deploy-production:
    needs: deploy-staging
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production   # GitHub environment with required reviewers
    timeout-minutes: 5
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: deploy
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            cd /opt/taskflow
            # Pre-deploy backup
            ./scripts/backup.sh
            # Tag for rollback
            docker tag taskflow-api:current taskflow-api:previous 2>/dev/null || true
            # Pull and deploy
            docker pull ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
            docker tag ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} taskflow-api:current
            # Run migrations
            docker compose -f docker-compose.prod.yml run --rm api node dist/migrate.js up
            # Restart
            docker compose -f docker-compose.prod.yml up -d api
            sleep 5
            # Health check with rollback
            if ! curl -sf http://localhost:3000/api/v1/health; then
              echo "ROLLBACK: Health check failed"
              docker tag taskflow-api:previous taskflow-api:current
              docker compose -f docker-compose.prod.yml up -d api
              exit 1
            fi
            echo "Production deploy successful"

---

## Open Questions

| # | Question | Impact | Decision Needed By |
|---|----------|--------|--------------------|
| OQ-1 | **VPS provider selection** — DigitalOcean ($6/mo), Hetzner ($4/mo, best EU price), or other? Choice affects latency and available regions. | Cost, performance | Before first deployment |
| OQ-2 | **SSL strategy** — Cloudflare origin certs (free, 15-year validity, zero maintenance) vs. Let's Encrypt (free, auto-renew every 90 days via certbot)? Cloudflare requires proxying traffic through their CDN. | Operational overhead | Before first deployment |
| OQ-3 | **Offsite backup storage** — Cloudflare R2 (free egress, S3-compatible), Backblaze B2 ($0.005/GB), or AWS S3? R2's free egress simplifies restores. | Cost, restore speed | Before first deployment |
| OQ-4 | **Error tracking tool** — Sentry free tier (5K errors/mo, more than enough for single-user) vs. self-hosted GlitchTip (open source, uses VPS resources)? | Cost vs. VPS resource usage | Before v1 launch |
| OQ-5 | **PWA cache update notification** — When a new version is deployed, how should the service worker notify the user? Options: (a) toast notification with "Update available — click to refresh", (b) auto-update on next navigation, (c) force refresh. Cross-ref `03_frontend_lead.md` service worker strategy. | User experience | Before v1 launch |
| OQ-6 | **Multi-user migration path** — If TaskFlow adds multi-user support post-v1, the entire infrastructure changes (PostgreSQL, connection pooling, horizontal scaling, auth per user). Should any groundwork be laid now? Per `04_db_architect.md` open questions, this is explicitly deferred. | Architecture | Post-v1 |
| OQ-7 | **Monitoring dashboard** — Is Netdata's built-in UI sufficient, or should we add a lightweight Grafana instance for custom dashboards? Netdata alone covers VPS metrics but not application-level metrics visualization. | Observability | Post-v1 launch |

This is the complete DevOps Lead specification for TaskFlow. Key design decisions reflect the project's unique constraints:

1. **Single VPS with Docker Compose** — appropriate for a single-user, solo-developer budget app (no Kubernetes, no managed services)
2. **Rolling deployment with PWA fallback** — the ~10-second restart is invisible to the user since the service worker serves the cached app shell
3. **SQLite backup via `.backup` command** — safe with WAL mode, aligned with `04_db_architect.md`
4. **GitHub Actions CI/CD** — gates aligned with `05_qa_lead.md` test pyramid (unit → integration → E2E)
5. **Secrets in `.env.production` files + GitHub Secrets** — simple and appropriate; no need for HashiCorp Vault at this scale
6. **24h RPO / 4h RTO** — realistic for a personal productivity app with PWA offline resilience