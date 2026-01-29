# DataHub API Gateway - Architecture Overview

## System Overview

DataHub is a centralized API Gateway that provides authentication, rate limiting, request logging, and webhook dispatch capabilities for organizations managing API traffic.

---

## High-Level Architecture

```
                                    DataHub API Gateway

    +-----------+                   +---------------------------+
    |           |                   |      Load Balancer        |
    |  Clients  |  ---- HTTPS --->  |     (Nginx/Traefik)       |
    |           |                   +-----------+---------------+
    +-----------+                               |
                                                |
                    +---------------------------+---------------------------+
                    |                           |                           |
           +--------v--------+         +--------v--------+         +--------v--------+
           |   DataHub API   |         |   DataHub API   |         |   DataHub API   |
           |   Instance 1    |         |   Instance 2    |         |   Instance 3    |
           +--------+--------+         +--------+--------+         +--------+--------+
                    |                           |                           |
                    +---------------------------+---------------------------+
                                                |
                    +---------------------------+---------------------------+
                    |                           |                           |
           +--------v--------+         +--------v--------+         +--------v--------+
           |                 |         |                 |         |                 |
           |   PostgreSQL    |         |     Redis       |         |  Webhook Queue  |
           |   (Primary)     |         |   (Cluster)     |         |   (BullMQ)      |
           |                 |         |                 |         |                 |
           +-----------------+         +-----------------+         +-----------------+
```

---

## Component Responsibilities

| Component | Responsibility | Technology |
|-----------|---------------|------------|
| API Gateway | Request handling, routing, middleware | Express.js + TypeScript |
| PostgreSQL | Persistent storage, audit logs, key records | PostgreSQL 14+ |
| Redis | Rate limit counters, caching, session data | Redis 7+ |
| Webhook Queue | Async webhook delivery processing | BullMQ |
| Load Balancer | TLS termination, request distribution | Nginx/Kubernetes Ingress |

---

## Request Lifecycle

### 1. Request Ingress

```
Client Request
      |
      v
[TLS Termination] --> Load Balancer
      |
      v
[Select Backend] --> Round-robin to healthy instance
      |
      v
[Forward Request] --> DataHub API Instance
```

### 2. Gateway Processing Pipeline

```
Incoming Request
      |
      v
+------------------+
| Request ID       |  <-- Generate unique ID for tracing
+------------------+
      |
      v
+------------------+
| Request Timing   |  <-- Start performance timer
+------------------+
      |
      v
+------------------+
| Authentication   |  <-- Validate API key from header
+------------------+
      |
      |-- Invalid --> 401 Unauthorized
      |
      v
+------------------+
| Rate Limiting    |  <-- Check Redis counters
+------------------+
      |
      |-- Exceeded --> 429 Too Many Requests
      |
      v
+------------------+
| Authorization    |  <-- Verify scope permissions
+------------------+
      |
      |-- Forbidden --> 403 Forbidden
      |
      v
+------------------+
| Route Handler    |  <-- Execute business logic
+------------------+
      |
      v
+------------------+
| Request Logging  |  <-- Persist to PostgreSQL
+------------------+
      |
      v
Response to Client
```

---

## Technology Stack Summary

### Runtime Environment

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Node.js | 20 LTS |
| Language | TypeScript | 5.x |
| Framework | Express.js | 4.x |

### Data Layer

| Purpose | Technology | Version |
|---------|------------|---------|
| Primary Database | PostgreSQL | 14+ |
| Cache/Rate Limiting | Redis | 7+ |
| ORM/Query Builder | Raw SQL with pg | 8.x |

### Infrastructure

| Component | Technology |
|-----------|------------|
| Containerization | Docker |
| Orchestration | Kubernetes |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana |

---

## Non-Functional Requirements

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Latency (p50) | < 20ms | Gateway overhead only |
| Latency (p95) | < 100ms | Gateway overhead only |
| Latency (p99) | < 250ms | Gateway overhead only |
| Throughput | > 10,000 RPS | Per node, sustained |
| Concurrent connections | > 50,000 | Per node |

### Availability Targets

| Metric | Target |
|--------|--------|
| Uptime SLA | 99.9% |
| Recovery Time Objective (RTO) | < 5 minutes |
| Recovery Point Objective (RPO) | < 1 minute |

### Scalability

| Dimension | Strategy |
|-----------|----------|
| Horizontal | Stateless nodes, add instances |
| Database | Read replicas, connection pooling |
| Cache | Redis cluster with partitioning |
| Queue | BullMQ with multiple workers |

---

## Key Architectural Decisions

### ADR-001: API Key Authentication Over JWT

**Decision**: Use API key authentication instead of JWT tokens.

**Rationale**:
- Simpler for machine-to-machine communication
- No token refresh complexity
- Immediate revocation capability
- Lower overhead per request

**Trade-offs**:
- Keys must be stored securely (hashed in DB)
- No built-in expiration without DB lookup

---

### ADR-002: PostgreSQL for Primary Storage

**Decision**: Use PostgreSQL as the primary database.

**Rationale**:
- ACID compliance for key management
- Partitioning support for request logs
- JSONB for flexible metadata
- Mature ecosystem and tooling

---

### ADR-003: Redis for Rate Limiting

**Decision**: Use Redis sorted sets for sliding window rate limiting.

**Rationale**:
- Sub-millisecond operations
- Atomic operations prevent race conditions
- Built-in key expiration
- Cluster support for high availability

---

### ADR-004: Stateless Application Layer

**Decision**: Keep API instances completely stateless.

**Rationale**:
- Enables horizontal scaling
- Simplifies deployment and rollback
- No session affinity required
- Easy container orchestration

---

## Cross-Cutting Concerns

### Logging

- Structured JSON logging (Pino)
- Request correlation IDs
- Sensitive data redaction
- Log levels: error, warn, info, debug

### Monitoring

- Prometheus metrics endpoint
- Custom business metrics
- Health check endpoints
- Alert rules for anomalies

### Security

- TLS 1.3 in transit
- API keys hashed at rest
- CORS configuration
- Helmet security headers
- Rate limiting per key/IP

---

## Related Documentation

- [Backend Architecture](./backend.md) - Detailed backend layer design
- [Database Architecture](./database.md) - ERD and schema details
- [Security Architecture](./security.md) - Authentication and authorization flows
- [Architecture Diagrams](./diagrams.md) - Visual representations

---

_This document provides the high-level architectural overview for DataHub API Gateway._
