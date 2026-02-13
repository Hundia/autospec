# DataHub Docker Configuration

## Overview

Docker configuration for local development and testing of the DataHub API Gateway.

---

## Docker Compose Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: datahub-postgres
    environment:
      POSTGRES_USER: datahub
      POSTGRES_PASSWORD: datahub_dev
      POSTGRES_DB: datahub_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U datahub"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: datahub-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  timescaledb:
    image: timescale/timescaledb:latest-pg15
    container_name: datahub-timescale
    environment:
      POSTGRES_USER: datahub
      POSTGRES_PASSWORD: datahub_dev
      POSTGRES_DB: analytics_dev
    ports:
      - "5433:5432"
    volumes:
      - timescale_data:/var/lib/postgresql/data

  mock-upstream:
    image: mockserver/mockserver:latest
    container_name: datahub-mock-upstream
    ports:
      - "4000:1080"
    environment:
      MOCKSERVER_INITIALIZATION_JSON_PATH: /config/init.json
    volumes:
      - ./docker/mock-upstream:/config

  gateway:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    container_name: datahub-gateway
    ports:
      - "3001:3001"
      - "9229:9229"
    volumes:
      - ./src:/app/src
      - ./prisma:/app/prisma
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://datahub:datahub_dev@postgres:5432/datahub_dev
      REDIS_URL: redis://redis:6379
      TIMESCALE_URL: postgresql://datahub:datahub_dev@timescaledb:5432/analytics_dev
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      timescaledb:
        condition: service_started
    command: npm run dev:gateway

volumes:
  postgres_data:
  redis_data:
  timescale_data:
```

---

## Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f gateway

# Stop services
docker compose down

# Reset data
docker compose down -v

# Rebuild
docker compose build --no-cache
```

---

## Related Documents

- [Development Setup](./development.md)
- [Environment Variables](./environment-variables.md)
