# TaskFlow Diagrams Collection

This file contains all Mermaid diagram definitions for the TaskFlow project, collected for viewer rendering.

## System Architecture

### High-Level System Diagram

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser[Web Browser]
        SPA[React SPA]
    end

    subgraph Gateway["Gateway Layer"]
        NGINX[NGINX Reverse Proxy]
    end

    subgraph API["API Layer"]
        Express[Express.js Server]
        Routes[Routes]
        Middleware[Middleware]
        Controllers[Controllers]
        Services[Services]
        Repositories[Repositories]
    end

    subgraph Data["Data Layer"]
        Prisma[Prisma ORM]
        PostgreSQL[(PostgreSQL)]
    end

    Browser --> SPA
    SPA --> NGINX
    NGINX --> Express
    Express --> Routes
    Routes --> Middleware
    Middleware --> Controllers
    Controllers --> Services
    Services --> Repositories
    Repositories --> Prisma
    Prisma --> PostgreSQL

    style Browser fill:#3b82f6
    style PostgreSQL fill:#10b981
    style Express fill:#f59e0b
```

### Request Lifecycle

```mermaid
sequenceDiagram
    participant U as User
    participant R as React SPA
    participant RQ as React Query
    participant A as Axios Client
    participant N as NGINX
    participant E as Express Router
    participant M as Middleware
    participant C as Controller
    participant S as Service
    participant P as Prisma
    participant DB as PostgreSQL

    U->>R: Click Button
    R->>RQ: Trigger Query/Mutation
    RQ->>A: HTTP Request
    A->>N: HTTPS Request + JWT
    N->>E: Forward to Backend
    E->>M: Route Match
    M->>M: Auth + Validation
    M->>C: Validated Request
    C->>S: Business Logic
    S->>P: Data Operation
    P->>DB: SQL Query
    DB-->>P: Result Set
    P-->>S: Typed Data
    S-->>C: Response Data
    C-->>E: HTTP Response
    E-->>N: JSON Response
    N-->>A: HTTPS Response
    A-->>RQ: Update Cache
    RQ-->>R: Re-render
    R-->>U: UI Update
```

## Backend Architecture

### Layer Diagram

```mermaid
graph TB
    subgraph Routes["Routes Layer"]
        R1[authRoutes.ts]
        R2[taskRoutes.ts]
        R3[projectRoutes.ts]
        R4[tagRoutes.ts]
    end

    subgraph Middleware["Middleware Layer"]
        M1[authenticate.ts]
        M2[validate.ts]
        M3[errorHandler.ts]
        M4[rateLimiter.ts]
    end

    subgraph Controllers["Controllers Layer"]
        C1[AuthController]
        C2[TaskController]
        C3[ProjectController]
        C4[TagController]
    end

    subgraph Services["Services Layer"]
        S1[AuthService]
        S2[TaskService]
        S3[ProjectService]
        S4[TagService]
    end

    subgraph Repositories["Repositories Layer"]
        RP1[UserRepository]
        RP2[TaskRepository]
        RP3[ProjectRepository]
        RP4[TagRepository]
    end

    subgraph ORM["Prisma ORM"]
        P[PrismaClient]
    end

    subgraph Database["PostgreSQL"]
        DB[(Database)]
    end

    R1 --> M1
    R2 --> M1
    R3 --> M1
    R4 --> M1

    M1 --> M2
    M2 --> C1
    M2 --> C2
    M2 --> C3
    M2 --> C4

    C1 --> S1
    C2 --> S2
    C3 --> S3
    C4 --> S4

    S1 --> RP1
    S2 --> RP2
    S3 --> RP3
    S4 --> RP4

    RP1 --> P
    RP2 --> P
    RP3 --> P
    RP4 --> P

    P --> DB
```

### Middleware Chain

```mermaid
graph LR
    A[Request] --> B[requestLogger]
    B --> C[cors]
    C --> D[helmet]
    D --> E[rateLimiter]
    E --> F[bodyParser]
    F --> G[authenticate]
    G --> H[validate]
    H --> I[Controller]
    I --> J[Response]

    style A fill:#3b82f6
    style J fill:#10b981
```

## Frontend Architecture

### Component Hierarchy

```mermaid
graph TB
    subgraph App["App Root"]
        AP[AuthProvider]
        QP[QueryClientProvider]
        RP[RouterProvider]
    end

    subgraph Layouts["Layouts"]
        PL[PublicLayout]
        PRL[ProtectedLayout]
    end

    subgraph Public["Public Pages"]
        LP[LandingPage]
        LIP[LoginPage]
        REP[RegisterPage]
    end

    subgraph Protected["Protected Pages"]
        DP[DashboardPage]
        TP[TasksPage]
        PP[ProjectsPage]
        PDP[ProjectDetailPage]
        SP[SettingsPage]
    end

    subgraph Organisms["Organisms"]
        SB[Sidebar]
        HD[Header]
        TL[TaskList]
        FB[FilterBar]
        TM[TaskModal]
        PG[ProjectGrid]
    end

    subgraph Molecules["Molecules"]
        TC[TaskCard]
        PC[ProjectCard]
        SC[StatCard]
        NL[NavLink]
        SF[SearchForm]
    end

    subgraph Atoms["Atoms"]
        BTN[Button]
        INP[Input]
        BDG[Badge]
        CHK[Checkbox]
        AVT[Avatar]
    end

    AP --> QP --> RP
    RP --> PL
    RP --> PRL

    PL --> LP
    PL --> LIP
    PL --> REP

    PRL --> SB
    PRL --> HD
    PRL --> DP
    PRL --> TP
    PRL --> PP
    PRL --> PDP
    PRL --> SP

    DP --> SC
    TP --> TL
    TP --> FB
    TP --> TM
    TL --> TC
    PP --> PG
    PG --> PC

    TC --> BTN
    TC --> CHK
    TC --> BDG
    PC --> BTN
    PC --> BDG
```

### State Flow

```mermaid
flowchart TB
    subgraph Global["Global State (Zustand)"]
        Auth[Auth Store]
        UI[UI Store]
    end

    subgraph Server["Server State (React Query)"]
        Tasks[Tasks Cache]
        Projects[Projects Cache]
        User[User Cache]
    end

    subgraph Local["Local State (useState)"]
        Form[Form State]
        Modal[Modal State]
        Filter[Filter State]
    end

    subgraph Derived["Derived State"]
        Filtered[Filtered Tasks]
        Stats[Dashboard Stats]
    end

    Auth --> |isAuthenticated| Server
    Tasks --> Filtered
    Tasks --> Stats
    Filter --> Filtered
    UI --> Modal

    style Auth fill:#3b82f6
    style Tasks fill:#10b981
    style Form fill:#f59e0b
```

## Database Architecture

### Entity-Relationship Diagram

```mermaid
erDiagram
    users {
        uuid id PK
        varchar email UK
        varchar password_hash
        varchar name
        timestamp created_at
        timestamp updated_at
    }

    projects {
        uuid id PK
        uuid user_id FK
        varchar name
        text description
        varchar color
        boolean is_archived
        timestamp created_at
        timestamp updated_at
    }

    tasks {
        uuid id PK
        uuid user_id FK
        uuid project_id FK
        varchar title
        text description
        enum status
        enum priority
        date due_date
        timestamp created_at
        timestamp updated_at
        timestamp completed_at
    }

    tags {
        uuid id PK
        uuid user_id FK
        varchar name
        varchar color
        timestamp created_at
    }

    task_tags {
        uuid task_id PK,FK
        uuid tag_id PK,FK
    }

    users ||--o{ projects : "owns"
    users ||--o{ tasks : "owns"
    users ||--o{ tags : "owns"
    projects ||--o{ tasks : "contains"
    tasks ||--o{ task_tags : "has"
    tags ||--o{ task_tags : "has"
```

## Authentication Flow

### Full Auth Sequence

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant DB as Database

    rect rgb(59, 130, 246, 0.1)
        Note over C,DB: Registration Flow
        C->>A: POST /auth/register {email, password, name}
        A->>DB: Check email exists
        DB-->>A: Not found
        A->>A: Hash password (bcrypt, 12 rounds)
        A->>DB: INSERT user
        DB-->>A: User created
        A->>A: Generate JWT + Refresh Token
        A-->>C: 201 {accessToken, refreshToken, user}
    end

    rect rgb(16, 185, 129, 0.1)
        Note over C,DB: Login Flow
        C->>A: POST /auth/login {email, password}
        A->>DB: Find user by email
        DB-->>A: User record
        A->>A: Verify password (bcrypt.compare)
        A->>A: Generate JWT + Refresh Token
        A-->>C: 200 {accessToken, refreshToken, user}
    end

    rect rgb(245, 158, 11, 0.1)
        Note over C,DB: Authenticated Request
        C->>A: GET /tasks (Authorization: Bearer xxx)
        A->>A: Verify JWT signature
        A->>A: Extract userId from payload
        A->>DB: SELECT tasks WHERE user_id = userId
        DB-->>A: Task records
        A-->>C: 200 {tasks: [...]}
    end

    rect rgb(168, 85, 247, 0.1)
        Note over C,DB: Token Refresh
        C->>A: POST /auth/refresh {refreshToken}
        A->>A: Verify refresh token
        A->>A: Generate new access token
        A-->>C: 200 {accessToken}
    end
```

## Task State Machine

### Task Status Transitions

```mermaid
stateDiagram-v2
    [*] --> todo: Create Task

    todo --> in_progress: Start Work
    todo --> done: Quick Complete

    in_progress --> todo: Pause
    in_progress --> done: Complete

    done --> todo: Reopen
    done --> in_progress: Needs More Work

    done --> [*]: Archive/Delete
```

## Cloud Architecture

### AWS Infrastructure

```mermaid
graph TB
    subgraph Internet["Internet"]
        Users[Users]
    end

    subgraph CDN["Cloudflare"]
        CF[CDN + WAF]
    end

    subgraph DNS["AWS Route 53"]
        R53[DNS + Health Checks]
    end

    subgraph VPC["AWS VPC"]
        subgraph PublicA["Public Subnet AZ-A"]
            ALB1[Application Load Balancer]
            NAT1[NAT Gateway]
        end

        subgraph PublicB["Public Subnet AZ-B"]
            ALB2[ALB Standby]
            NAT2[NAT Gateway]
        end

        subgraph PrivateA["Private Subnet AZ-A"]
            ECS1[ECS Fargate<br/>TaskFlow API]
        end

        subgraph PrivateB["Private Subnet AZ-B"]
            ECS2[ECS Fargate<br/>TaskFlow API]
        end

        subgraph DataA["Data Subnet AZ-A"]
            RDS1[(RDS Primary)]
        end

        subgraph DataB["Data Subnet AZ-B"]
            RDS2[(RDS Standby)]
        end
    end

    subgraph External["AWS Services"]
        S3[S3 Static Assets]
        CW[CloudWatch]
        ECR[ECR Registry]
    end

    Users --> CF
    CF --> R53
    R53 --> ALB1
    R53 --> ALB2
    ALB1 --> ECS1
    ALB2 --> ECS2
    ECS1 --> RDS1
    ECS2 --> RDS1
    RDS1 -.-> RDS2
    ECS1 --> S3
    ECS1 --> CW
    ECS1 -.-> ECR

    style Users fill:#3b82f6
    style RDS1 fill:#10b981
    style RDS2 fill:#10b981
```

## CI/CD Pipeline

### Pipeline Flow

```mermaid
flowchart LR
    subgraph Trigger["Trigger"]
        PR[Pull Request]
        Push[Push to main]
    end

    subgraph Build["Build Stage"]
        Lint[ESLint]
        Type[TypeScript]
        Test[Vitest]
    end

    subgraph Package["Package Stage"]
        Docker[Docker Build]
        Push2[Push to ECR]
    end

    subgraph Deploy["Deploy Stage"]
        Staging[Deploy Staging]
        Smoke[Smoke Tests]
        Prod[Deploy Production]
    end

    PR --> Lint
    Push --> Lint
    Lint --> Type
    Type --> Test
    Test --> Docker
    Docker --> Push2
    Push2 --> Staging
    Staging --> Smoke
    Smoke --> Prod

    style PR fill:#3b82f6
    style Push fill:#3b82f6
    style Prod fill:#10b981
```

## User Journey Flows

### Create Task Flow

```mermaid
flowchart TB
    A[User clicks New Task] --> B[Task Modal Opens]
    B --> C[User fills form]
    C --> D{Valid?}
    D -->|No| E[Show validation errors]
    E --> C
    D -->|Yes| F[API: POST /tasks]
    F --> G{Success?}
    G -->|No| H[Show error toast]
    H --> C
    G -->|Yes| I[Close modal]
    I --> J[Show success toast]
    J --> K[Task appears in list]

    style A fill:#3b82f6
    style K fill:#10b981
    style H fill:#ef4444
```

### Complete Task Flow

```mermaid
flowchart LR
    A[Click checkbox] --> B[Optimistic update]
    B --> C[API: PATCH /tasks/:id]
    C --> D{Success?}
    D -->|Yes| E[Confirm UI change]
    D -->|No| F[Revert UI]
    F --> G[Show error]

    style A fill:#3b82f6
    style E fill:#10b981
    style F fill:#ef4444
```

## Data Flow

### Task Data Flow

```mermaid
flowchart TB
    subgraph Client["Client"]
        UI[React Component]
        RQ[React Query Cache]
        Store[Zustand Store]
    end

    subgraph API["API"]
        Route[Express Route]
        Service[TaskService]
        Repo[TaskRepository]
    end

    subgraph DB["Database"]
        PG[(PostgreSQL)]
    end

    UI -->|Query| RQ
    RQ -->|Cache Miss| Route
    Route --> Service
    Service --> Repo
    Repo --> PG
    PG --> Repo
    Repo --> Service
    Service --> Route
    Route --> RQ
    RQ --> UI

    UI -->|Auth State| Store
    Store -->|Token| RQ

    style UI fill:#3b82f6
    style PG fill:#10b981
```

## Auto Scaling

### Scaling Rules

```mermaid
graph LR
    subgraph Metrics["CloudWatch Metrics"]
        CPU[CPU Utilization]
        MEM[Memory Utilization]
        REQ[Request Count]
    end

    subgraph Scaling["Auto Scaling"]
        ASG[ECS Auto Scaling]
    end

    subgraph Targets["Scale Targets"]
        MIN[Min: 2 tasks]
        DES[Desired: 2 tasks]
        MAX[Max: 10 tasks]
    end

    CPU --> ASG
    MEM --> ASG
    REQ --> ASG
    ASG --> MIN
    ASG --> DES
    ASG --> MAX
```

## Cache Invalidation

### Invalidation Flow

```mermaid
flowchart LR
    A[Task Created] --> B[Invalidate Task List Cache]
    A --> C[Invalidate Project Stats Cache]
    A --> D[Invalidate Dashboard Stats Cache]

    E[Task Updated] --> B
    E --> C
    E --> D

    F[Task Deleted] --> B
    F --> C
    F --> D

    style A fill:#10b981
    style E fill:#f59e0b
    style F fill:#ef4444
```
