# DataHub Development Environment Setup

## Overview

This guide covers setting up a local development environment for the DataHub API Gateway platform.

---

## Prerequisites

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 20.x LTS | Runtime |
| Docker | 24.x | Containerization |
| Docker Compose | 2.x | Local services |
| PostgreSQL | 15.x | Primary database |
| Redis | 7.x | Caching & rate limiting |
| TimescaleDB | 2.x | Analytics storage |

---

## Architecture

```mermaid
flowchart TB
    subgraph Local["Local Development"]
        GW[Gateway Service<br/>:3001]
        ADMIN[Admin API<br/>:3002]
    end

    subgraph Docker["Docker Services"]
        PG[(PostgreSQL<br/>:5432)]
        REDIS[(Redis<br/>:6379)]
        TS[(TimescaleDB<br/>:5433)]
        UPSTREAM[Mock Upstream<br/>:4000]
    end

    GW --> PG
    GW --> REDIS
    GW --> TS
    GW --> UPSTREAM
    ADMIN --> PG
```

---

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/your-org/datahub-gateway.git
cd datahub-gateway

# 2. Install dependencies
npm install

# 3. Start Docker services
docker compose up -d

# 4. Setup environment
cp .env.example .env

# 5. Run migrations
npm run db:migrate

# 6. Seed test data
npm run db:seed

# 7. Start development servers
npm run dev

# Gateway: http://localhost:3001
# Admin API: http://localhost:3002
```

---

## Environment Variables

```bash
# .env - Development Environment

# ─────────────────────────────────────────────
# Application
# ─────────────────────────────────────────────
NODE_ENV=development
GATEWAY_PORT=3001
ADMIN_PORT=3002

# ─────────────────────────────────────────────
# PostgreSQL (Primary Database)
# ─────────────────────────────────────────────
DATABASE_URL="postgresql://datahub:datahub_dev@localhost:5432/datahub_dev"

# ─────────────────────────────────────────────
# Redis (Caching & Rate Limiting)
# ─────────────────────────────────────────────
REDIS_URL="redis://localhost:6379"

# ─────────────────────────────────────────────
# TimescaleDB (Analytics)
# ─────────────────────────────────────────────
TIMESCALE_URL="postgresql://datahub:datahub_dev@localhost:5433/analytics_dev"

# ─────────────────────────────────────────────
# Gateway Configuration
# ─────────────────────────────────────────────
GATEWAY_TIMEOUT_MS=30000
GATEWAY_MAX_BODY_SIZE=10mb
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_DEFAULT=100

# ─────────────────────────────────────────────
# Logging
# ─────────────────────────────────────────────
LOG_LEVEL=debug
LOG_FORMAT=pretty
```

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services |
| `npm run dev:gateway` | Start gateway only |
| `npm run dev:admin` | Start admin API only |
| `npm run test` | Run tests |
| `npm run test:load` | Run load tests |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Prisma Studio |

---

## Testing Gateway Locally

```bash
# Create test API key
curl -X POST http://localhost:3002/api/keys \
  -H "Content-Type: application/json" \
  -d '{"name": "test-key", "rateLimit": 100}'

# Test gateway proxy
curl http://localhost:3001/api/proxy/test \
  -H "X-API-Key: <your-key>"

# Test rate limiting
for i in {1..110}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    http://localhost:3001/api/proxy/test \
    -H "X-API-Key: <your-key>"
done
```

---

## Related Documents

- [Docker Setup](./docker.md)
- [Environment Variables](./environment-variables.md)
