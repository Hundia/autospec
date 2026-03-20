# Development Environment

## Prerequisites
- Node.js 22
- npm 10
- Docker and Docker Compose
- PostgreSQL client tools

## Setup
1. Copy `.env.example` to `.env`.
2. Start `docker compose up -d postgres redis minio`.
3. Run migrations and seed.
4. Start api, worker, and web services.
5. Verify `/health`, queue list, and sample dashboard.
