# TaskFlow Docker Configuration

## Overview

This document covers Docker configuration for TaskFlow, including local development with Docker Compose, production builds, and container management.

---

## Docker Architecture

```mermaid
flowchart TB
    subgraph DockerCompose["Docker Compose Stack"]
        subgraph App["Application Containers"]
            FRONTEND[taskflow-frontend<br/>:3000]
            BACKEND[taskflow-backend<br/>:3001]
        end

        subgraph Data["Data Containers"]
            POSTGRES[(postgres<br/>:5432)]
            REDIS[(redis<br/>:6379)]
        end

        subgraph Dev["Development Tools"]
            MAILHOG[mailhog<br/>:8025]
            ADMINER[adminer<br/>:8080]
        end
    end

    FRONTEND -->|API| BACKEND
    BACKEND --> POSTGRES
    BACKEND --> REDIS
    BACKEND --> MAILHOG

    style App fill:#3b82f6,color:#fff
    style Data fill:#10b981,color:#fff
    style Dev fill:#f59e0b,color:#fff
```

---

## Docker Compose Configuration

### docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  # ─────────────────────────────────────────────
  # PostgreSQL Database
  # ─────────────────────────────────────────────
  postgres:
    image: postgres:15-alpine
    container_name: taskflow-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: taskflow
      POSTGRES_PASSWORD: taskflow_secret
      POSTGRES_DB: taskflow_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U taskflow -d taskflow_dev"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ─────────────────────────────────────────────
  # Redis Cache
  # ─────────────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: taskflow-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ─────────────────────────────────────────────
  # Backend API
  # ─────────────────────────────────────────────
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
      target: development
    container_name: taskflow-backend
    restart: unless-stopped
    environment:
      NODE_ENV: development
      PORT: 3001
      DATABASE_URL: postgresql://taskflow:taskflow_secret@postgres:5432/taskflow_dev
      REDIS_URL: redis://redis:6379
      JWT_SECRET: docker-dev-secret-change-me
      SMTP_HOST: mailhog
      SMTP_PORT: 1025
    ports:
      - "3001:3001"
      - "9229:9229"  # Debug port
    volumes:
      - ./src/backend:/app/src/backend
      - ./prisma:/app/prisma
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    command: npm run dev:backend

  # ─────────────────────────────────────────────
  # Frontend App
  # ─────────────────────────────────────────────
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
      target: development
    container_name: taskflow-frontend
    restart: unless-stopped
    environment:
      VITE_API_URL: http://localhost:3001
    ports:
      - "3000:3000"
    volumes:
      - ./src/frontend:/app/src/frontend
      - /app/node_modules
    depends_on:
      - backend
    command: npm run dev:frontend

  # ─────────────────────────────────────────────
  # Development Tools
  # ─────────────────────────────────────────────
  mailhog:
    image: mailhog/mailhog
    container_name: taskflow-mailhog
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI

  adminer:
    image: adminer
    container_name: taskflow-adminer
    restart: unless-stopped
    ports:
      - "8080:8080"
    environment:
      ADMINER_DEFAULT_SERVER: postgres

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    name: taskflow-network
```

---

## Dockerfiles

### Backend Dockerfile

```dockerfile
# Dockerfile.backend
# Multi-stage build for Node.js backend

# ─────────────────────────────────────────────
# Base Stage
# ─────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ─────────────────────────────────────────────
# Dependencies Stage
# ─────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma/
RUN npm ci

# ─────────────────────────────────────────────
# Development Stage
# ─────────────────────────────────────────────
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
EXPOSE 3001 9229
CMD ["npm", "run", "dev:backend"]

# ─────────────────────────────────────────────
# Builder Stage
# ─────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build:backend

# ─────────────────────────────────────────────
# Production Stage
# ─────────────────────────────────────────────
FROM base AS production
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 taskflow

COPY --from=builder --chown=taskflow:nodejs /app/dist ./dist
COPY --from=builder --chown=taskflow:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=taskflow:nodejs /app/prisma ./prisma
COPY --from=builder --chown=taskflow:nodejs /app/package.json ./

USER taskflow
EXPOSE 3001
CMD ["node", "dist/backend/server.js"]
```

### Frontend Dockerfile

```dockerfile
# Dockerfile.frontend
# Multi-stage build for React frontend

# ─────────────────────────────────────────────
# Base Stage
# ─────────────────────────────────────────────
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

# ─────────────────────────────────────────────
# Dependencies Stage
# ─────────────────────────────────────────────
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ─────────────────────────────────────────────
# Development Stage
# ─────────────────────────────────────────────
FROM base AS development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev:frontend"]

# ─────────────────────────────────────────────
# Builder Stage
# ─────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build:frontend

# ─────────────────────────────────────────────
# Production Stage (with nginx)
# ─────────────────────────────────────────────
FROM nginx:alpine AS production
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Docker Commands

### Development Commands

```bash
# ─────────────────────────────────────────────
# Starting Services
# ─────────────────────────────────────────────

# Start all services
docker compose up -d

# Start specific services
docker compose up -d postgres redis

# Start with build
docker compose up -d --build

# Start and follow logs
docker compose up

# ─────────────────────────────────────────────
# Viewing Status
# ─────────────────────────────────────────────

# List running containers
docker compose ps

# View logs
docker compose logs -f
docker compose logs -f backend
docker compose logs -f --tail=100 backend

# ─────────────────────────────────────────────
# Stopping Services
# ─────────────────────────────────────────────

# Stop all services
docker compose stop

# Stop and remove containers
docker compose down

# Remove volumes too (DELETES DATA)
docker compose down -v

# ─────────────────────────────────────────────
# Executing Commands
# ─────────────────────────────────────────────

# Run command in container
docker compose exec backend npm run test
docker compose exec postgres psql -U taskflow -d taskflow_dev

# Open shell in container
docker compose exec backend sh
docker compose exec postgres bash

# Run one-off container
docker compose run --rm backend npx prisma migrate dev
```

### Database Commands

```bash
# Run migrations
docker compose exec backend npx prisma migrate dev

# Reset database
docker compose exec backend npx prisma migrate reset

# Open Prisma Studio
docker compose exec backend npx prisma studio

# Seed database
docker compose exec backend npx prisma db seed

# Connect to PostgreSQL
docker compose exec postgres psql -U taskflow -d taskflow_dev

# Backup database
docker compose exec postgres pg_dump -U taskflow taskflow_dev > backup.sql

# Restore database
docker compose exec -T postgres psql -U taskflow taskflow_dev < backup.sql
```

### Build Commands

```bash
# Build all images
docker compose build

# Build specific service
docker compose build backend

# Build with no cache
docker compose build --no-cache

# Build production images
docker build -f Dockerfile.backend --target production -t taskflow-backend:latest .
docker build -f Dockerfile.frontend --target production -t taskflow-frontend:latest .
```

---

## Docker Compose Profiles

### docker-compose.override.yml

```yaml
# docker-compose.override.yml
# Development-specific overrides (auto-loaded)

version: '3.8'

services:
  backend:
    environment:
      LOG_LEVEL: debug
      LOG_FORMAT: pretty
    volumes:
      - ./src:/app/src:delegated

  frontend:
    environment:
      VITE_DEBUG: "true"
```

### docker-compose.prod.yml

```yaml
# docker-compose.prod.yml
# Production configuration

version: '3.8'

services:
  backend:
    build:
      target: production
    environment:
      NODE_ENV: production
      LOG_LEVEL: info
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M

  frontend:
    build:
      target: production
    restart: always
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
```

### Using Profiles

```bash
# Development (default)
docker compose up -d

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# With specific profile
docker compose --profile tools up -d
```

---

## Health Checks

### Service Health

```mermaid
flowchart LR
    subgraph HealthChecks["Health Check Flow"]
        DC[Docker Compose] --> PG{Postgres<br/>Ready?}
        PG -->|Yes| RD{Redis<br/>Ready?}
        PG -->|No| WAIT1[Wait 10s]
        WAIT1 --> PG
        RD -->|Yes| BE[Start Backend]
        RD -->|No| WAIT2[Wait 10s]
        WAIT2 --> RD
        BE --> FE[Start Frontend]
    end
```

### Checking Health

```bash
# Check container health
docker compose ps

# Output:
# NAME                STATUS                   PORTS
# taskflow-postgres   Up (healthy)            0.0.0.0:5432->5432/tcp
# taskflow-redis      Up (healthy)            0.0.0.0:6379->6379/tcp
# taskflow-backend    Up                      0.0.0.0:3001->3001/tcp
# taskflow-frontend   Up                      0.0.0.0:3000->3000/tcp

# Manual health check
curl http://localhost:3001/health
```

---

## Volume Management

### Named Volumes

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect taskflow_postgres_data

# Remove unused volumes
docker volume prune

# Backup volume
docker run --rm \
  -v taskflow_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar cvf /backup/postgres_backup.tar /data

# Restore volume
docker run --rm \
  -v taskflow_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar xvf /backup/postgres_backup.tar
```

---

## Troubleshooting

### Common Issues

```markdown
## Issue: Container Won't Start

Check logs:
```bash
docker compose logs backend
```

Common causes:
- Port already in use
- Missing environment variables
- Database not ready

---

## Issue: Database Connection Refused

1. Check if postgres is running:
```bash
docker compose ps postgres
```

2. Check postgres logs:
```bash
docker compose logs postgres
```

3. Verify network:
```bash
docker network inspect taskflow-network
```

---

## Issue: Volume Permission Denied

Fix permissions:
```bash
docker compose down
docker volume rm taskflow_postgres_data
docker compose up -d
```

---

## Issue: Build Cache Issues

Clear build cache:
```bash
docker compose build --no-cache
docker system prune -a
```
```

---

## Development Workflow

```mermaid
flowchart LR
    START[Start Day] --> UP[docker compose up -d]
    UP --> CODE[Write Code]
    CODE --> TEST[Run Tests]
    TEST --> LOGS[Check Logs]
    LOGS --> CODE
    CODE --> DOWN[docker compose down]
    DOWN --> END[End Day]
```

---

## Related Documents

- [Development Setup](./development.md)
- [Production Environment](./production.md)
- [Environment Variables](./environment-variables.md)
