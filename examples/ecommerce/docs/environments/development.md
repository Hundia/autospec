# ShopFlow Development Environment

## Overview

Local development environment setup for the ShopFlow e-commerce platform.

---

## Architecture

```mermaid
flowchart TB
    subgraph Local["Local Development"]
        WEB[Web App<br/>:3000]
        API[API Server<br/>:4000]
        ADMIN[Admin Panel<br/>:3001]
    end

    subgraph Docker["Docker Services"]
        PG[(PostgreSQL<br/>:5432)]
        REDIS[(Redis<br/>:6379)]
        MINIO[MinIO<br/>:9000]
        LOCALSTACK[LocalStack<br/>:4566]
    end

    WEB --> API
    ADMIN --> API
    API --> PG
    API --> REDIS
    API --> MINIO
    API --> LOCALSTACK
```

---

## Prerequisites

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 20.x LTS | Runtime |
| npm | 10.x | Package manager |
| Docker | 24.x | Containerization |
| Docker Compose | 2.x | Service orchestration |
| Git | 2.x | Version control |

---

## Quick Start

```bash
# 1. Clone repository
git clone https://github.com/your-org/shopflow.git
cd shopflow

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Start Docker services
docker compose up -d

# 5. Run database migrations
npm run db:migrate

# 6. Seed development data
npm run db:seed

# 7. Start development servers
npm run dev

# Web App: http://localhost:3000
# API Server: http://localhost:4000
# Admin Panel: http://localhost:3001
```

---

## Environment Variables

```bash
# .env - Development Configuration

# ─────────────────────────────────────────────
# Application
# ─────────────────────────────────────────────
NODE_ENV=development
APP_URL=http://localhost:3000
API_URL=http://localhost:4000
ADMIN_URL=http://localhost:3001

# ─────────────────────────────────────────────
# Database
# ─────────────────────────────────────────────
DATABASE_URL="postgresql://shopflow:shopflow_dev@localhost:5432/shopflow_dev"

# ─────────────────────────────────────────────
# Redis
# ─────────────────────────────────────────────
REDIS_URL="redis://localhost:6379"

# ─────────────────────────────────────────────
# Storage (MinIO)
# ─────────────────────────────────────────────
S3_ENDPOINT=http://localhost:9000
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_BUCKET=shopflow-uploads

# ─────────────────────────────────────────────
# AWS Services (LocalStack)
# ─────────────────────────────────────────────
AWS_ENDPOINT=http://localhost:4566
AWS_REGION=us-east-1
SQS_ORDER_QUEUE=shopflow-orders-dev

# ─────────────────────────────────────────────
# Authentication
# ─────────────────────────────────────────────
JWT_SECRET=development-secret-change-in-production
JWT_EXPIRES_IN=7d

# ─────────────────────────────────────────────
# Payment (Stripe Test Mode)
# ─────────────────────────────────────────────
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# ─────────────────────────────────────────────
# Email (Mailhog)
# ─────────────────────────────────────────────
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_FROM=noreply@shopflow.local
```

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services |
| `npm run dev:web` | Start web app only |
| `npm run dev:api` | Start API server only |
| `npm run dev:admin` | Start admin panel only |
| `npm run build` | Build all packages |
| `npm run test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint all packages |
| `npm run lint:fix` | Fix linting issues |
| `npm run db:migrate` | Run migrations |
| `npm run db:seed` | Seed database |
| `npm run db:studio` | Open Prisma Studio |

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@shopflow.local | password123 |
| Admin | admin@shopflow.local | admin123 |
| Support | support@shopflow.local | support123 |

---

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Web App | http://localhost:3000 | Customer storefront |
| API Server | http://localhost:4000 | REST API |
| API Docs | http://localhost:4000/docs | Swagger documentation |
| Admin Panel | http://localhost:3001 | Back-office management |
| Prisma Studio | http://localhost:5555 | Database browser |
| MinIO Console | http://localhost:9001 | File storage |
| Mailhog | http://localhost:8025 | Email testing |

---

## Debugging

### VS Code Configuration

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug API",
      "type": "node",
      "request": "launch",
      "runtimeArgs": ["-r", "ts-node/register"],
      "args": ["${workspaceFolder}/apps/api/src/main.ts"],
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand", "${file}"],
      "console": "integratedTerminal"
    }
  ]
}
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Restart PostgreSQL
docker compose restart postgres

# Check logs
docker compose logs postgres

# Reset database
npm run db:reset
```

### Redis Connection Issues

```bash
# Test Redis connection
docker compose exec redis redis-cli ping

# Restart Redis
docker compose restart redis
```

---

## Related Documents

- [Docker Setup](./docker.md)
- [Environment Variables](./environment-variables.md)
- [Project Setup](../project/setup.md)
