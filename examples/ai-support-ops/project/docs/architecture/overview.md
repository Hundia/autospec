# Architecture Overview

## System Diagram
```text
React web client
  -> Fastify API
     -> Auth, ticket, routing, AI, knowledge, automation, analytics services
     -> PostgreSQL
     -> Redis cache and BullMQ workers
     -> S3-compatible attachments
     -> CRM, billing, telemetry, incident webhooks
```

## Stack Summary
| Layer | Choice |
| --- | --- |
| Frontend | React 18, Vite, TanStack Router, Zustand, TanStack Query |
| Backend | Fastify, TypeScript, Zod, Prisma |
| Data | PostgreSQL, Redis, BullMQ, S3-compatible storage |
| Auth | SAML SSO, JWT sessions, MFA policy |
| QA | Vitest, Playwright, curl smoke tests |

## Request Lifecycle
1. Client sends tenant-scoped request with session token.
2. API resolves tenant and role.
3. Controller validates input and calls domain service.
4. Service reads PostgreSQL and Redis, optionally queues async work.
5. Response returns domain payload plus trace metadata.
6. Audit event records actor, model, policy, and outcome when AI is involved.

## Non-Functional Targets
- Workspace load p95 under 2.5 s.
- Search p95 under 800 ms.
- AI draft generation p95 under 6 s.
- 99.9 percent uptime for core ticketing workflows.
