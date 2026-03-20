# Docker Guide

## Compose Services
- `postgres`: primary relational store
- `redis`: cache, rate limits, BullMQ
- `minio`: local S3-compatible attachments
- `api`, `worker`, `web`

## Common Commands
- `docker compose up -d`
- `docker compose logs -f api`
- `docker compose down -v` for full reset in local only
