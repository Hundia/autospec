# DataHub API Gateway - Diagram Collection

## Overview

This document consolidates all Mermaid diagrams used throughout the DataHub documentation. These diagrams are rendered by the AutoSpec Viewer for visual presentation.

---

## System Architecture Diagrams

### High-Level System Architecture

```mermaid
graph TB
    subgraph Clients
        MA[Mobile App]
        WA[Web App]
        SDK[CLI/SDK]
    end

    subgraph LoadBalancing["Load Balancing Layer"]
        ALB[AWS Application Load Balancer]
    end

    subgraph GatewayCluster["Gateway Cluster"]
        GW1[Gateway Node 1]
        GW2[Gateway Node 2]
        GWN[Gateway Node N]
    end

    subgraph DataLayer["Data Layer"]
        PG[(PostgreSQL 15)]
        RD[(Redis 7)]
        TS[(TimescaleDB)]
        REP[(Read Replicas)]
    end

    subgraph UpstreamServices["Upstream Services"]
        US1[Service A]
        US2[Service B]
        US3[Service C]
    end

    MA --> ALB
    WA --> ALB
    SDK --> ALB

    ALB --> GW1
    ALB --> GW2
    ALB --> GWN

    GW1 --> PG
    GW1 --> RD
    GW1 --> TS
    GW2 --> PG
    GW2 --> RD
    GW2 --> TS
    GWN --> PG
    GWN --> RD
    GWN --> TS

    PG --> REP

    GW1 --> US1
    GW1 --> US2
    GW1 --> US3
    GW2 --> US1
    GW2 --> US2
    GW2 --> US3
```

### Cache Strategy Flowchart

```mermaid
flowchart LR
    subgraph CacheStrategy["Cache Strategy"]
        direction TB
        L1[L1: In-Memory<br/>Node.js LRU Cache<br/>TTL: 1 min]
        L2[L2: Redis<br/>Distributed Cache<br/>TTL: 5-15 min]
        L3[L3: PostgreSQL<br/>Source of Truth<br/>Persistent]
    end

    REQ[Request] --> L1
    L1 -->|Miss| L2
    L2 -->|Miss| L3
    L3 -->|Populate| L2
    L2 -->|Populate| L1
```

### Scaling Architecture

```mermaid
graph TB
    subgraph Monitoring["Monitoring & Scaling"]
        CW[CloudWatch Metrics]
        ASG[Auto Scaling Group]
        ALB[Load Balancer]
    end

    subgraph GatewayPods["Gateway Pods"]
        G1[Pod 1]
        G2[Pod 2]
        G3[Pod 3]
        GN[Pod N...]
    end

    subgraph DataStores["Stateful Services"]
        PG[(PostgreSQL<br/>Primary)]
        PGR[(PostgreSQL<br/>Replica)]
        RC[(Redis<br/>Cluster)]
    end

    CW -->|Trigger Scale| ASG
    ASG -->|Manage| G1
    ASG -->|Manage| G2
    ASG -->|Manage| G3
    ASG -->|Manage| GN

    ALB --> G1
    ALB --> G2
    ALB --> G3
    ALB --> GN

    G1 --> PG
    G1 --> PGR
    G1 --> RC
    G2 --> PG
    G2 --> PGR
    G2 --> RC
```

---

## Backend Architecture Diagrams

### Layer Flow Diagram

```mermaid
flowchart TB
    subgraph Routes["Routes Layer"]
        R1["/api/v1/auth/*"]
        R2["/api/v1/keys/*"]
        R3["/api/v1/admin/*"]
        R4["/api/v1/analytics/*"]
        R5["/gateway/*"]
    end

    subgraph Middleware["Middleware Stack"]
        M1[CORS]
        M2[Body Parser]
        M3[Auth Middleware]
        M4[Rate Limiter]
        M5[Request Logger]
        M6[Error Handler]
    end

    subgraph Controllers["Controllers"]
        C1[AuthController]
        C2[ApiKeyController]
        C3[AdminController]
        C4[AnalyticsController]
        C5[GatewayController]
    end

    subgraph Services["Services"]
        S1[AuthService]
        S2[ApiKeyService]
        S3[UserService]
        S4[AnalyticsService]
        S5[GatewayService]
        S6[RateLimitService]
    end

    subgraph Repositories["Repositories"]
        RP1[UserRepository]
        RP2[ApiKeyRepository]
        RP3[ApiRepository]
        RP4[RequestLogRepository]
    end

    subgraph DataSources["Data Sources"]
        DB1[(PostgreSQL)]
        DB2[(Redis)]
        DB3[(TimescaleDB)]
    end

    R1 & R2 & R3 & R4 & R5 --> M1
    M1 --> M2 --> M3 --> M4 --> M5
    M5 --> C1 & C2 & C3 & C4 & C5
    C1 --> S1
    C2 --> S2
    C3 --> S3
    C4 --> S4
    C5 --> S5 & S6
    S1 & S2 & S3 --> RP1 & RP2 & RP3
    S4 --> RP4
    S6 --> DB2
    RP1 & RP2 & RP3 --> DB1
    RP4 --> DB3
    M5 --> M6
```

### Middleware Pipeline Sequence

```mermaid
sequenceDiagram
    participant C as Client
    participant CORS as CORS
    participant BP as Body Parser
    participant RL as Rate Limiter
    participant AU as Auth
    participant LG as Logger
    participant CT as Controller
    participant EH as Error Handler

    C->>CORS: HTTP Request
    CORS->>BP: Add CORS Headers
    BP->>RL: Parse Body

    alt Rate Limit Exceeded
        RL-->>C: 429 Too Many Requests
    else
        RL->>AU: Check Rate
        alt Auth Failed
            AU-->>C: 401 Unauthorized
        else
            AU->>LG: Validate Token
            LG->>CT: Log Request
            CT->>LG: Process Request
            LG->>EH: Return Response

            alt Error Occurred
                EH-->>C: Error Response
            else
                EH-->>C: Success Response
            end
        end
    end
```

### Error Handler Flow

```mermaid
flowchart TD
    E[Error Thrown] --> T{Error Type?}

    T -->|ValidationError| V[400 Bad Request]
    T -->|AuthenticationError| A[401 Unauthorized]
    T -->|ForbiddenError| F[403 Forbidden]
    T -->|NotFoundError| N[404 Not Found]
    T -->|RateLimitError| R[429 Too Many Requests]
    T -->|Unknown| U[500 Internal Server Error]

    V & A & F & N & R --> L[Log Error]
    U --> LS[Log Stack Trace]

    L & LS --> RES[Return JSON Response]
```

---

## Database Diagrams

### Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o{ api_keys : "owns"
    users ||--o{ refresh_tokens : "has"
    api_keys ||--o{ api_permissions : "grants"
    api_keys ||--o{ request_logs : "generates"
    apis ||--o{ api_permissions : "defines"
    apis ||--o{ request_logs : "receives"
    rate_limits ||--o{ api_keys : "applies_to"

    users {
        uuid id PK
        varchar email UK
        varchar password_hash
        enum role
        timestamp created_at
        timestamp updated_at
    }

    api_keys {
        uuid id PK
        uuid user_id FK
        varchar key_hash UK
        varchar name
        varchar rate_limit_tier FK
        timestamp expires_at
        timestamp last_used_at
        timestamp created_at
        timestamp revoked_at
    }

    apis {
        uuid id PK
        varchar name UK
        varchar upstream_url
        int rate_limit
        boolean auth_required
        timestamp created_at
        timestamp updated_at
    }

    api_permissions {
        uuid id PK
        uuid api_key_id FK
        uuid api_id FK
        enum permission
        timestamp created_at
    }

    request_logs {
        uuid id PK
        uuid api_key_id FK
        uuid api_id FK
        varchar method
        varchar path
        int status_code
        int latency_ms
        timestamp timestamp
        jsonb metadata
    }

    rate_limits {
        uuid id PK
        varchar tier_name UK
        int requests_per_min
        int requests_per_hour
        int burst_limit
        timestamp created_at
        timestamp updated_at
    }

    refresh_tokens {
        uuid id PK
        uuid user_id FK
        varchar token_hash UK
        timestamp expires_at
        timestamp created_at
        timestamp revoked_at
    }
```

### Database Flow Diagram

```mermaid
flowchart TB
    subgraph App["Application Layer"]
        GW1[Gateway Node 1]
        GW2[Gateway Node 2]
        GWN[Gateway Node N]
    end

    subgraph Pools["Connection Pools"]
        PGP[PostgreSQL Pool<br/>Max: 20 connections]
        RDP[Redis Pool<br/>Max: 50 connections]
    end

    subgraph PostgreSQL["PostgreSQL Cluster"]
        PGM[(Primary)]
        PGR1[(Replica 1)]
        PGR2[(Replica 2)]
    end

    subgraph Redis["Redis Cluster"]
        RDM[(Master)]
        RDR1[(Replica 1)]
        RDR2[(Replica 2)]
    end

    subgraph TimescaleDB["TimescaleDB"]
        TS[(Hypertable<br/>request_logs)]
    end

    GW1 & GW2 & GWN --> PGP
    GW1 & GW2 & GWN --> RDP

    PGP -->|Writes| PGM
    PGP -->|Reads| PGR1
    PGP -->|Reads| PGR2
    PGM --> PGR1
    PGM --> PGR2

    RDP --> RDM
    RDM --> RDR1
    RDM --> RDR2

    GW1 & GW2 & GWN --> TS
```

### Migration Flow

```mermaid
flowchart TD
    A[Start Migration] --> B{Environment?}

    B -->|Development| C[Run migrations directly]
    B -->|Staging/Production| D[Create migration plan]

    D --> E[Backup database]
    E --> F[Run in transaction]
    F --> G{Migration successful?}

    G -->|Yes| H[Commit transaction]
    G -->|No| I[Rollback transaction]

    H --> J[Update schema version]
    I --> K[Alert team]
    K --> L[Investigate failure]

    C --> M[End]
    J --> M
    L --> M
```

---

## Security Diagrams

### JWT Authentication Sequence

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Gateway
    participant A as Auth Service
    participant R as Redis
    participant DB as PostgreSQL

    Note over C,DB: User Login Flow

    C->>G: POST /auth/login {email, password}
    G->>A: Validate credentials
    A->>DB: SELECT user WHERE email = ?
    DB-->>A: User record
    A->>A: bcrypt.compare(password, hash)

    alt Password Valid
        A->>A: Generate JWT (15min expiry)
        A->>A: Generate Refresh Token (7d expiry)
        A->>DB: Store refresh_token hash
        A->>R: Cache user session
        A-->>G: {accessToken, refreshToken}
        G-->>C: 200 OK + tokens
    else Password Invalid
        A-->>G: Authentication failed
        G-->>C: 401 Unauthorized
    end

    Note over C,DB: Token Refresh Flow

    C->>G: POST /auth/refresh {refreshToken}
    G->>A: Validate refresh token
    A->>DB: Find token by hash

    alt Token Valid & Not Revoked
        A->>A: Generate new access token
        A->>A: Rotate refresh token
        A->>DB: Revoke old, store new
        A-->>G: {accessToken, refreshToken}
        G-->>C: 200 OK + new tokens
    else Token Invalid
        G-->>C: 401 Unauthorized
    end
```

### API Key Validation Flow

```mermaid
flowchart TD
    A[Request with X-API-Key header] --> B{Key prefix valid?}

    B -->|No| C[401: Invalid API key format]
    B -->|Yes| D[Hash the key]

    D --> E{In Redis cache?}

    E -->|Yes| F[Get cached key data]
    E -->|No| G[Query PostgreSQL]

    G --> H{Key exists?}
    H -->|No| I[401: API key not found]
    H -->|Yes| J[Cache in Redis]
    J --> F

    F --> K{Key revoked?}
    K -->|Yes| L[401: API key revoked]
    K -->|No| M{Key expired?}

    M -->|Yes| N[401: API key expired]
    M -->|No| O{Has permission?}

    O -->|No| P[403: Insufficient permissions]
    O -->|Yes| Q[Allow request]

    Q --> R[Update last_used_at]
    R --> S[Continue to handler]
```

### Token Lifecycle State Machine

```mermaid
stateDiagram-v2
    [*] --> Issued: Login/Refresh

    Issued --> Active: Token in use
    Active --> Active: Valid request
    Active --> Expired: TTL exceeded
    Active --> Revoked: Manual revocation
    Active --> Blacklisted: Logout

    Expired --> [*]: Requires refresh
    Revoked --> [*]: Cannot be renewed
    Blacklisted --> [*]: Must re-login
```

### RBAC Permission Graph

```mermaid
graph TD
    subgraph Roles
        A[Admin]
        D[Developer]
        V[Viewer]
    end

    subgraph Permissions
        P1[users:read]
        P2[users:write]
        P3[keys:read]
        P4[keys:write]
        P5[keys:revoke]
        P6[apis:read]
        P7[apis:write]
        P8[analytics:read]
        P9[analytics:export]
        P10[rate-limits:write]
    end

    A --> P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9 & P10
    D --> P3 & P4 & P6 & P8 & P9
    V --> P3 & P6 & P8

    style A fill:#ff6b6b
    style D fill:#4ecdc4
    style V fill:#95a5a6
```

### Rate Limit Sequence

```mermaid
sequenceDiagram
    participant C as Client
    participant G as Gateway
    participant R as Redis
    participant U as Upstream

    C->>G: Request with API Key
    G->>R: INCR ratelimit:{key}:{window}
    R-->>G: Current count: 950

    alt Under Limit
        G->>G: Add rate limit headers
        G->>U: Forward request
        U-->>G: Response
        G-->>C: 200 OK + Rate Headers
    else Over Limit
        G-->>C: 429 Too Many Requests + Retry-After
    end

    Note over G,R: Rate limit check adds ~1ms latency
```

### Audit Event Flow

```mermaid
flowchart LR
    subgraph Events["Security Events"]
        E1[Login Success]
        E2[Login Failure]
        E3[Token Refresh]
        E4[API Key Created]
        E5[API Key Revoked]
        E6[Permission Change]
        E7[Rate Limit Hit]
    end

    subgraph Processing["Event Processing"]
        P1[Add Metadata]
        P2[Timestamp]
        P3[User Context]
        P4[IP Address]
    end

    subgraph Storage["Audit Storage"]
        S1[(TimescaleDB)]
        S2[CloudWatch Logs]
        S3[SIEM Integration]
    end

    E1 & E2 & E3 & E4 & E5 & E6 & E7 --> P1
    P1 --> P2 --> P3 --> P4
    P4 --> S1 & S2
    S1 --> S3
```

---

## Cloud Architecture Diagrams

### AWS Cloud Architecture

```mermaid
graph TB
    subgraph Internet
        U[Users]
        CF[CloudFront CDN]
    end

    subgraph AWS["AWS Region: us-east-1"]
        subgraph Edge
            R53[Route 53]
            WAF[AWS WAF]
            ALB[Application Load Balancer]
        end

        subgraph VPC["VPC 10.0.0.0/16"]
            subgraph PublicSubnets["Public Subnets"]
                NAT1[NAT Gateway AZ-a]
                NAT2[NAT Gateway AZ-b]
            end

            subgraph AppSubnets["Private Subnets - Application"]
                ECS1[ECS Task AZ-a]
                ECS2[ECS Task AZ-b]
                ECS3[ECS Task AZ-c]
            end

            subgraph DBSubnets["Private Subnets - Database"]
                RDS1[(RDS Primary)]
                RDS2[(RDS Replica)]
                EC[(ElastiCache Redis)]
            end
        end

        subgraph ManagedServices["Managed Services"]
            ECR[ECR]
            SM[Secrets Manager]
            KMS[KMS]
            S3[S3]
            CW[CloudWatch]
        end
    end

    U --> CF
    CF --> R53
    R53 --> WAF
    WAF --> ALB
    ALB --> ECS1 & ECS2 & ECS3

    ECS1 & ECS2 & ECS3 --> NAT1 & NAT2
    ECS1 & ECS2 & ECS3 --> RDS1
    ECS1 & ECS2 & ECS3 --> RDS2
    ECS1 & ECS2 & ECS3 --> EC

    RDS1 --> RDS2

    ECS1 & ECS2 & ECS3 --> SM
    ECS1 & ECS2 & ECS3 --> CW
```

### ECS Service Architecture

```mermaid
flowchart TB
    subgraph ECSCluster["ECS Cluster: datahub-cluster"]
        subgraph Service["ECS Service: datahub-gateway"]
            direction TB
            T1[Task 1<br/>AZ-a]
            T2[Task 2<br/>AZ-b]
            T3[Task 3<br/>AZ-c]
        end

        subgraph AutoScaling["Auto Scaling"]
            ASP[Target Tracking Policy<br/>CPU > 70%]
            MIN[Min: 2 tasks]
            MAX[Max: 10 tasks]
            DES[Desired: 3 tasks]
        end
    end

    subgraph ALBConfig["ALB Target Group"]
        TG[Target Group<br/>Protocol: HTTP<br/>Port: 3000]
        HC[Health Check<br/>Path: /health<br/>Interval: 30s]
    end

    ALB[Application Load Balancer] --> TG
    TG --> T1 & T2 & T3
    HC --> T1 & T2 & T3
    ASP --> Service
```

### Redis Cluster Topology

```mermaid
graph TB
    subgraph RedisCluster["ElastiCache Redis Cluster"]
        subgraph Shard1["Shard 1"]
            P1[Primary Node<br/>AZ-a]
            R1[Replica Node<br/>AZ-b]
        end

        subgraph Shard2["Shard 2"]
            P2[Primary Node<br/>AZ-b]
            R2[Replica Node<br/>AZ-c]
        end

        subgraph Shard3["Shard 3"]
            P3[Primary Node<br/>AZ-c]
            R3[Replica Node<br/>AZ-a]
        end
    end

    P1 --> R1
    P2 --> R2
    P3 --> R3
```

### CI/CD Pipeline

```mermaid
flowchart LR
    subgraph Trigger
        P[Push/PR]
    end

    subgraph Build["Build Stage"]
        B1[Install Dependencies]
        B2[TypeScript Compile]
        B3[Build Docker Image]
        B4[Security Scan]
    end

    subgraph Test["Test Stage"]
        T1[Unit Tests]
        T2[Integration Tests]
        T3[E2E Tests]
        T4[Coverage Report]
    end

    subgraph Deploy["Deploy Stage"]
        D1[Push to ECR]
        D2[Update Task Definition]
        D3[ECS Rolling Update]
        D4[Health Check]
        D5[Smoke Tests]
    end

    subgraph Notify
        N1[Slack Notification]
        N2[GitHub Status]
    end

    P --> B1 --> B2 --> B3 --> B4
    B4 --> T1 --> T2 --> T3 --> T4
    T4 --> D1 --> D2 --> D3 --> D4 --> D5
    D5 --> N1 & N2
```

### Disaster Recovery

```mermaid
flowchart TD
    subgraph Primary["Primary Region: us-east-1"]
        P1[ECS Cluster]
        P2[(RDS Primary)]
        P3[(Redis)]
    end

    subgraph DR["DR Region: us-west-2"]
        D1[ECS Cluster<br/>Standby]
        D2[(RDS Replica<br/>Cross-Region)]
        D3[(Redis<br/>Standby)]
    end

    subgraph Global
        R53[Route 53<br/>Health Checks]
        S3R[S3 Cross-Region<br/>Replication]
    end

    P2 -->|Async Replication| D2
    P1 -->|Image Sync| D1
    R53 --> P1
    R53 -.->|Failover| D1
    S3R --> Primary
    S3R --> DR
```

---

## Flow Diagrams

### Request Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Received: Request arrives
    Received --> Authenticated: Auth check passed
    Received --> Rejected: Auth failed

    Authenticated --> RateLimited: Rate limit check
    RateLimited --> Processing: Under limit
    RateLimited --> Throttled: Over limit

    Processing --> Proxied: Gateway request
    Processing --> Completed: Direct response

    Proxied --> Completed: Upstream response
    Proxied --> Failed: Upstream error

    Completed --> Logged: Request logged
    Failed --> Logged: Error logged
    Rejected --> Logged: Auth failure logged
    Throttled --> Logged: Rate limit logged

    Logged --> [*]
```

### SDK Auth Flow

```mermaid
sequenceDiagram
    participant App as Application
    participant SDK as DataHub SDK
    participant API as DataHub API

    App->>SDK: new DataHubClient({ apiKey })
    SDK->>SDK: Store API key

    App->>SDK: client.auth.login(email, password)
    SDK->>API: POST /api/v1/auth/login
    API-->>SDK: { accessToken, refreshToken }
    SDK->>SDK: Store tokens

    App->>SDK: client.apiKeys.list()
    SDK->>SDK: Attach Bearer token
    SDK->>API: GET /api/v1/keys
    API-->>SDK: { data: [...] }
    SDK-->>App: List of API keys

    Note over SDK,API: Token expires after 15 min

    App->>SDK: client.apiKeys.create({...})
    SDK->>API: POST /api/v1/keys (expired token)
    API-->>SDK: 401 Unauthorized
    SDK->>API: POST /api/v1/auth/refresh
    API-->>SDK: { accessToken, refreshToken }
    SDK->>API: POST /api/v1/keys (new token)
    API-->>SDK: { data: newKey }
    SDK-->>App: New API key
```

### SDK Retry Logic

```mermaid
flowchart TD
    A[Make Request] --> B{Response?}
    B -->|Success| C[Return Data]
    B -->|429 Rate Limited| D[Get Retry-After]
    D --> E[Call onRateLimited]
    E --> F{Retry Count < Max?}
    F -->|Yes| G[Wait with Backoff]
    G --> A
    F -->|No| H[Throw RateLimitError]
    B -->|Other Error| I{Retryable?}
    I -->|Yes| F
    I -->|No| J[Throw Error]
```

---

## Usage in AutoSpec Viewer

All diagrams in this collection use Mermaid syntax and are compatible with:

- AutoSpec Viewer (recommended)
- GitHub Markdown preview
- VS Code Mermaid extension
- Mermaid Live Editor

To render these diagrams, ensure your viewer supports Mermaid.js v10+.
