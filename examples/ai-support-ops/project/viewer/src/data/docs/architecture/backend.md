# Backend Architecture

## Layers
Routes -> Middleware -> Controllers -> Services -> Repositories -> PostgreSQL/Redis

## Directory Shape
- `src/routes`: Fastify route modules by resource
- `src/controllers`: HTTP mapping and response shaping
- `src/services`: ticket, routing, AI, approval, knowledge, analytics logic
- `src/repositories`: Prisma and SQL access
- `src/workers`: BullMQ jobs for async processing
- `src/lib`: auth, telemetry, errors, config

## Dependency Injection
Create service factories from config, repositories, queue clients, and external adapters. Keep provider wiring at app bootstrap.

## Error Propagation
- Repositories throw typed infra errors.
- Services map infra errors to domain errors.
- Controllers never branch on string messages.
- Global handler maps domain errors to API error codes.

## Logging
- request start/end, actor, tenant, route, status
- ticket transition and rule decision logs
- AI request, model, template id, latency, tokens, sources
- webhook and worker retry logs
