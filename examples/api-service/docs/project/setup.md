# DataHub Project Setup

## Overview

Complete guide for setting up the DataHub API Gateway development environment from scratch.

---

## Setup Flow

```mermaid
flowchart TB
    subgraph Prerequisites["Prerequisites"]
        NODE[Node.js 20.x]
        DOCKER[Docker 24.x]
        GIT[Git 2.x]
    end

    subgraph Setup["Setup Steps"]
        CLONE[Clone Repository]
        INSTALL[Install Dependencies]
        ENV[Configure Environment]
        DOCKER_UP[Start Docker Services]
        MIGRATE[Run Migrations]
        SEED[Seed Database]
    end

    subgraph Verify["Verification"]
        TEST[Run Tests]
        START[Start Development]
    end

    Prerequisites --> CLONE
    CLONE --> INSTALL --> ENV --> DOCKER_UP --> MIGRATE --> SEED
    SEED --> TEST --> START
```

---

## Prerequisites

### Required Software

| Software | Version | Purpose | Installation |
|----------|---------|---------|--------------|
| Node.js | 20.x LTS | Runtime | [nodejs.org](https://nodejs.org) |
| npm | 10.x | Package manager | Included with Node.js |
| Docker | 24.x | Containerization | [docker.com](https://docker.com) |
| Docker Compose | 2.x | Service orchestration | Included with Docker |
| Git | 2.x | Version control | [git-scm.com](https://git-scm.com) |

### Verify Prerequisites

```bash
# Check Node.js version
node --version
# Expected: v20.x.x

# Check npm version
npm --version
# Expected: 10.x.x

# Check Docker version
docker --version
# Expected: Docker version 24.x.x

# Check Docker Compose
docker compose version
# Expected: Docker Compose version v2.x.x

# Check Git
git --version
# Expected: git version 2.x.x
```

---

## Step-by-Step Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-org/datahub-gateway.git

# Navigate to project directory
cd datahub-gateway

# Verify you're on the main branch
git branch
```

### 2. Install Dependencies

```bash
# Install all dependencies
npm install

# This installs:
# - Gateway dependencies
# - Admin API dependencies
# - Development tools
# - Testing frameworks
```

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Open and edit the .env file
# Update any necessary values for your local setup
```

#### Environment Variables

```bash
# .env file
NODE_ENV=development

# Application Ports
GATEWAY_PORT=3001
ADMIN_PORT=3002

# PostgreSQL Connection
DATABASE_URL="postgresql://datahub:datahub_dev@localhost:5432/datahub_dev"

# Redis Connection
REDIS_URL="redis://localhost:6379"

# TimescaleDB Connection
TIMESCALE_URL="postgresql://datahub:datahub_dev@localhost:5433/analytics_dev"

# JWT Configuration
JWT_SECRET="your-local-dev-secret-change-in-production"
JWT_EXPIRES_IN="15m"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_DEFAULT=1000

# Logging
LOG_LEVEL=debug
LOG_FORMAT=pretty
```

### 4. Start Docker Services

```bash
# Start all required services
docker compose up -d

# Verify services are running
docker compose ps

# Expected output:
# NAME                  STATUS
# datahub-postgres      running
# datahub-redis         running
# datahub-timescale     running
# datahub-mock-upstream running
```

### 5. Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Verify database schema
npx prisma studio
# Opens browser at http://localhost:5555
```

### 6. Seed Development Data

```bash
# Seed the database with test data
npm run db:seed

# This creates:
# - Admin user (admin@datahub.io / dev-password)
# - Sample API keys
# - Test services configuration
```

---

## Verification

### Run Test Suite

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Expected: All tests passing
```

### Start Development Servers

```bash
# Start both gateway and admin servers
npm run dev

# Or start separately:
npm run dev:gateway  # http://localhost:3001
npm run dev:admin    # http://localhost:3002
```

### Verify Gateway

```bash
# Check health endpoint
curl http://localhost:3001/health

# Expected response:
# {
#   "status": "healthy",
#   "version": "2.1.0",
#   "checks": {
#     "database": "healthy",
#     "redis": "healthy",
#     "timescale": "healthy"
#   }
# }
```

### Verify Admin API

```bash
# Login to admin API
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@datahub.io", "password": "dev-password"}'

# Expected: Access token in response
```

---

## Project Structure

```
datahub-gateway/
  src/
    gateway/           # Gateway service code
      middleware/      # Request middleware
      proxy/           # Proxy engine
      rate-limiter/    # Rate limiting logic
    admin/             # Admin API code
      controllers/     # API controllers
      services/        # Business logic
    shared/            # Shared utilities
      database/        # Prisma client
      cache/           # Redis client
      analytics/       # TimescaleDB client
  prisma/
    schema.prisma      # Database schema
    migrations/        # Migration files
    seed.ts            # Seed script
  tests/
    unit/              # Unit tests
    integration/       # Integration tests
    e2e/               # End-to-end tests
  docker/
    docker-compose.yml # Local services
  docs/                # Documentation
```

---

## IDE Setup

### VS Code

Recommended extensions:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker"
  ]
}
```

### Settings

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

## Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
docker compose ps postgres

# View PostgreSQL logs
docker compose logs postgres

# Reset database
docker compose down -v
docker compose up -d
npm run db:migrate
npm run db:seed
```

### Redis Connection Issues

```bash
# Check Redis status
docker compose exec redis redis-cli ping
# Expected: PONG

# View Redis logs
docker compose logs redis
```

### Port Conflicts

```bash
# Check what's using a port
lsof -i :3001

# Kill process using port
kill -9 <PID>
```

---

## Related Documents

- [Development Environment](../environments/development.md)
- [Docker Setup](../environments/docker.md)
- [Coding Standards](./coding-standards.md)
