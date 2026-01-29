# DataHub API Gateway - Architecture Diagrams

## Overview

This document contains visual diagrams for the DataHub API Gateway architecture. Diagrams are provided in both ASCII art and Mermaid format for different rendering contexts.

---

## System Architecture Diagram

### ASCII Version

```
                            Internet
                               |
                               |
                    +----------v----------+
                    |    Load Balancer    |
                    |   (TLS Termination) |
                    +----------+----------+
                               |
          +--------------------+--------------------+
          |                    |                    |
    +-----v-----+        +-----v-----+        +-----v-----+
    |  DataHub  |        |  DataHub  |        |  DataHub  |
    |    API    |        |    API    |        |    API    |
    | Instance 1|        | Instance 2|        | Instance 3|
    +-----+-----+        +-----+-----+        +-----+-----+
          |                    |                    |
          +--------------------+--------------------+
                               |
          +--------------------+--------------------+
          |                    |                    |
    +-----v-----+        +-----v-----+        +-----v-----+
    |           |        |           |        |           |
    |PostgreSQL |        |   Redis   |        |  BullMQ   |
    |  Primary  |        |  Cluster  |        |   Queue   |
    |           |        |           |        |           |
    +-----------+        +-----------+        +-----------+
```

### Mermaid Version

```mermaid
graph TB
    subgraph Internet
        C[Clients]
    end

    subgraph LoadBalancer
        LB[Load Balancer<br/>TLS Termination]
    end

    subgraph APILayer["API Layer (Stateless)"]
        API1[DataHub API<br/>Instance 1]
        API2[DataHub API<br/>Instance 2]
        API3[DataHub API<br/>Instance 3]
    end

    subgraph DataLayer["Data Layer"]
        PG[(PostgreSQL<br/>Primary)]
        REDIS[(Redis<br/>Cluster)]
        QUEUE[(BullMQ<br/>Queue)]
    end

    C --> LB
    LB --> API1
    LB --> API2
    LB --> API3

    API1 --> PG
    API2 --> PG
    API3 --> PG

    API1 --> REDIS
    API2 --> REDIS
    API3 --> REDIS

    API1 --> QUEUE
    API2 --> QUEUE
    API3 --> QUEUE
```

---

## Request Processing Pipeline

### ASCII Version

```
Request Received
       |
       v
+------+------+
| Request ID  |  Generate unique ID
+------+------+
       |
       v
+------+------+
|   Timing    |  Start performance timer
+------+------+
       |
       v
+------+------+
|    Auth     |---> Invalid --> 401 Unauthorized
+------+------+
       |
       v
+------+------+
| Rate Limit  |---> Exceeded --> 429 Too Many Requests
+------+------+
       |
       v
+------+------+
| Authorize   |---> Forbidden --> 403 Forbidden
+------+------+
       |
       v
+------+------+
|   Handler   |  Execute business logic
+------+------+
       |
       v
+------+------+
|  Logging    |  Persist request log
+------+------+
       |
       v
Response Sent
```

### Mermaid Version

```mermaid
flowchart TD
    A[Request Received] --> B[Generate Request ID]
    B --> C[Start Timing]
    C --> D{Authenticate}

    D -->|Invalid Key| E[401 Unauthorized]
    D -->|Valid Key| F{Check Rate Limit}

    F -->|Exceeded| G[429 Too Many Requests]
    F -->|OK| H{Check Scope}

    H -->|Insufficient| I[403 Forbidden]
    H -->|Authorized| J[Execute Handler]

    J --> K[Log Request]
    K --> L[Send Response]

    E --> M[Log Error]
    G --> M
    I --> M
    M --> L
```

---

## Database Schema Diagram

### Mermaid ERD

```mermaid
erDiagram
    api_keys ||--o{ request_logs : "logs"
    api_keys ||--o{ webhooks : "owns"
    api_keys ||--o{ audit_logs : "actor"
    webhooks ||--o{ webhook_events : "subscribes"
    webhooks ||--o{ webhook_deliveries : "delivers"

    api_keys {
        varchar id PK
        varchar key_hash UK
        varchar key_prefix
        varchar name
        varchar status
        text[] scopes
        int rate_limit_minute
        int rate_limit_hour
        jsonb metadata
        timestamp created_at
        timestamp expires_at
    }

    request_logs {
        varchar id PK
        varchar api_key_id FK
        varchar method
        varchar path
        int status_code
        int duration_ms
        inet ip_address
        timestamp started_at
    }

    webhooks {
        varchar id PK
        varchar api_key_id FK
        varchar name
        varchar url
        varchar secret
        boolean enabled
        varchar status
        timestamp created_at
    }

    webhook_events {
        int id PK
        varchar webhook_id FK
        varchar event_type
    }

    webhook_deliveries {
        varchar id PK
        varchar webhook_id FK
        varchar event_type
        varchar status
        int attempt
        int response_status
        timestamp scheduled_at
    }

    audit_logs {
        varchar id PK
        varchar actor_id
        varchar action
        varchar resource_type
        varchar resource_id
        jsonb old_values
        jsonb new_values
        timestamp created_at
    }
```

---

## Authentication Flow

### Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Gateway
    participant R as Redis
    participant DB as PostgreSQL

    C->>G: Request with X-API-Key
    G->>G: Extract API Key
    G->>G: Hash Key (SHA-256)

    G->>R: Check Cache
    alt Cache Hit
        R-->>G: Return Key Record
    else Cache Miss
        G->>DB: SELECT by key_hash
        DB-->>G: Return Key Record
        G->>R: Store in Cache (5min TTL)
    end

    G->>G: Validate Status & Expiry

    alt Valid
        G->>G: Update last_used_at
        G-->>C: Continue to Handler
    else Invalid
        G-->>C: 401 Unauthorized
    end
```

---

## Rate Limiting Flow

### ASCII Version

```
Request with API Key
         |
         v
+--------+--------+
| Identify Key ID |
+--------+--------+
         |
         v
+--------+--------+
|  Check Minute   |---> Exceeded --> Return 429
|    Counter      |                  with Retry-After
+--------+--------+
         |
         v
+--------+--------+
|   Check Hour    |---> Exceeded --> Return 429
|    Counter      |
+--------+--------+
         |
         v
+--------+--------+
|   Check Day     |---> Exceeded --> Return 429
|    Counter      |
+--------+--------+
         |
         v
   All Checks Pass
         |
         v
+--------+--------+
| Increment All   |
| Counters        |
+--------+--------+
         |
         v
   Add Rate Limit
   Headers to Response
```

---

## Webhook Delivery Flow

### Mermaid Version

```mermaid
flowchart TD
    A[Event Triggered] --> B[Find Subscribed Webhooks]
    B --> C[Filter by Event Type]
    C --> D[Queue Delivery Jobs]

    D --> E{Attempt Delivery}
    E -->|Success| F[Mark Delivered]
    E -->|Failure| G{Max Retries?}

    G -->|No| H[Calculate Backoff]
    H --> I[Schedule Retry]
    I --> E

    G -->|Yes| J[Mark Failed]
    J --> K[Update Consecutive Failures]
    K --> L{Failures > 10?}

    L -->|Yes| M[Disable Webhook]
    M --> N[Send Alert]
    L -->|No| O[Log Failure]

    F --> P[Update Statistics]
    O --> P
```

---

## CI/CD Pipeline

### Mermaid Version

```mermaid
flowchart LR
    subgraph Trigger
        A[Push to main/develop]
    end

    subgraph Lint
        B[ESLint]
        C[TypeScript Check]
    end

    subgraph Test
        D[Unit Tests]
        E[Integration Tests]
        F[Coverage Report]
    end

    subgraph Security
        G[npm audit]
        H[Trivy Scan]
    end

    subgraph Build
        I[Docker Build]
        J[Push to Registry]
    end

    subgraph Deploy
        K{Branch?}
        L[Deploy Staging]
        M[Deploy Production]
    end

    A --> B
    A --> C
    B --> D
    C --> D
    D --> E
    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K

    K -->|develop| L
    K -->|main| M
```

---

## Component Interaction Diagram

### Mermaid Version

```mermaid
graph LR
    subgraph External
        Client[API Client]
        WebhookTarget[Webhook Target]
    end

    subgraph Gateway["DataHub Gateway"]
        Routes[Routes]
        Auth[Auth Middleware]
        RateLimit[Rate Limiter]
        Handlers[Handlers]
    end

    subgraph Services
        KeyService[Key Service]
        RequestService[Request Service]
        WebhookService[Webhook Service]
        RateLimitService[Rate Limit Service]
    end

    subgraph Repositories
        KeyRepo[Key Repository]
        RequestRepo[Request Repository]
        WebhookRepo[Webhook Repository]
    end

    subgraph Data
        PostgreSQL[(PostgreSQL)]
        Redis[(Redis)]
        BullMQ[(BullMQ)]
    end

    Client --> Routes
    Routes --> Auth
    Auth --> RateLimit
    RateLimit --> Handlers

    Handlers --> KeyService
    Handlers --> RequestService
    Handlers --> WebhookService

    KeyService --> KeyRepo
    RequestService --> RequestRepo
    WebhookService --> WebhookRepo

    RateLimit --> RateLimitService
    RateLimitService --> Redis

    KeyRepo --> PostgreSQL
    RequestRepo --> PostgreSQL
    WebhookRepo --> PostgreSQL

    WebhookService --> BullMQ
    BullMQ --> WebhookTarget
```

---

## Deployment Architecture (Kubernetes)

### ASCII Version

```
+----------------------------------------------------------+
|                    Kubernetes Cluster                      |
|                                                            |
|  +------------+  +------------+  +------------+            |
|  | Namespace: |  | Namespace: |  | Namespace: |            |
|  |  datahub   |  |  datahub-  |  |  monitoring|            |
|  |            |  |  staging   |  |            |            |
|  +------------+  +------------+  +------------+            |
|                                                            |
|  Within datahub namespace:                                 |
|  +------------------------+  +------------------------+   |
|  | Deployment: datahub-api|  | Service: datahub-api   |   |
|  | Replicas: 3            |  | Type: ClusterIP        |   |
|  | Image: datahub:latest  |  | Port: 80 -> 3000       |   |
|  +------------------------+  +------------------------+   |
|                                                            |
|  +------------------------+  +------------------------+   |
|  | HPA: datahub-api       |  | PDB: datahub-api       |   |
|  | Min: 3, Max: 20        |  | minAvailable: 2        |   |
|  | CPU Target: 70%        |  |                        |   |
|  +------------------------+  +------------------------+   |
|                                                            |
|  +------------------------+                               |
|  | Ingress: datahub-api   |                               |
|  | Host: api.datahub.com  |                               |
|  | TLS: letsencrypt       |                               |
|  +------------------------+                               |
|                                                            |
+----------------------------------------------------------+
```

---

## Usage Notes

### Rendering Mermaid Diagrams

These diagrams can be rendered in:

1. **GitHub** - Native Mermaid support in markdown
2. **VS Code** - Mermaid Preview extension
3. **Online** - [mermaid.live](https://mermaid.live)
4. **Documentation** - Docusaurus, GitBook, etc.

### Exporting Diagrams

Use mermaid-cli for PNG/SVG export:

```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i diagrams.md -o diagram.png
```

---

## Related Documentation

- [Architecture Overview](./overview.md) - High-level system design
- [Backend Architecture](./backend.md) - Component details
- [Database Architecture](./database.md) - Schema design

---

_This document contains visual representations of the DataHub API Gateway architecture._
