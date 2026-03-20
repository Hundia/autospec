# TaskFlow Error Handling Flow

## Overview

This document describes how errors are handled throughout the TaskFlow application, from validation errors to network failures.

---

## Error Types

### Error Classification

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ERROR TYPES                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  CLIENT ERRORS (4xx)                                                     │
│  ──────────────────                                                      │
│  400 Bad Request      - Validation errors, malformed JSON                │
│  401 Unauthorized     - Missing or invalid JWT token                     │
│  403 Forbidden        - Valid token but not authorized for resource      │
│  404 Not Found        - Resource doesn't exist                           │
│  409 Conflict         - Duplicate resource (e.g., email already exists)  │
│  422 Unprocessable    - Semantic validation error                        │
│  429 Too Many Requests - Rate limit exceeded                             │
│                                                                          │
│  SERVER ERRORS (5xx)                                                     │
│  ──────────────────                                                      │
│  500 Internal Error   - Unexpected server error                          │
│  502 Bad Gateway      - Database connection failure                      │
│  503 Service Unavail  - Server overloaded or maintenance                 │
│                                                                          │
│  NETWORK ERRORS                                                          │
│  ──────────────                                                          │
│  Network Error        - No internet connection                           │
│  Timeout              - Request took too long                            │
│  CORS Error           - Cross-origin request blocked                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Error Propagation Flow

### Backend Error Flow

```mermaid
flowchart TB
    subgraph Repository["Repository Layer"]
        R1[Prisma Error]
        R2[Database Error]
    end

    subgraph Service["Service Layer"]
        S1[Business Logic Error]
        S2[Validation Error]
    end

    subgraph Controller["Controller Layer"]
        C1[Format API Error]
    end

    subgraph Middleware["Error Handler"]
        M1[Global Error Handler]
        M2[Format Response]
    end

    subgraph Response["HTTP Response"]
        RE[JSON Error Response]
    end

    R1 --> |wrap| S1
    R2 --> |wrap| S1
    S1 --> C1
    S2 --> C1
    C1 --> M1
    M1 --> M2
    M2 --> RE

    style R1 fill:#ef4444
    style RE fill:#f59e0b
```

### ASCII Error Propagation

```
ERROR PROPAGATION
═════════════════

Repository                Service                 Controller              Response
    │                        │                        │                      │
    │  PrismaError           │                        │                      │
    │  {code: P2025}         │                        │                      │
    │───────────────────────>│                        │                      │
    │                        │                        │                      │
    │                        │  NotFoundError         │                      │
    │                        │  "Task not found"      │                      │
    │                        │───────────────────────>│                      │
    │                        │                        │                      │
    │                        │                        │  throw error         │
    │                        │                        │──────────────────────┤
    │                        │                        │                      │
    │                        │                        │        ┌─────────────▼─────────┐
    │                        │                        │        │  Error Handler        │
    │                        │                        │        │  middleware           │
    │                        │                        │        │                       │
    │                        │                        │        │  - Log error          │
    │                        │                        │        │  - Map to HTTP code   │
    │                        │                        │        │  - Format response    │
    │                        │                        │        └─────────────┬─────────┘
    │                        │                        │                      │
    │                        │                        │                      ▼
    │                        │                        │        ┌─────────────────────┐
    │                        │                        │        │  404 Not Found      │
    │                        │                        │        │  {                  │
    │                        │                        │        │    error: {         │
    │                        │                        │        │      code: "...",   │
    │                        │                        │        │      message: "..." │
    │                        │                        │        │    }                │
    │                        │                        │        │  }                  │
    │                        │                        │        └─────────────────────┘
```

---

## Client-Side Error Handling

### Error Handling Flow

```mermaid
flowchart TB
    A[API Response] --> B{Status Code}
    B -->|2xx| C[Success Handler]
    B -->|4xx| D[Client Error Handler]
    B -->|5xx| E[Server Error Handler]
    B -->|Network| F[Network Error Handler]

    C --> G[Update Cache]
    D --> H{Error Type}
    E --> I[Show Generic Error]
    F --> J[Show Offline Message]

    H -->|401| K[Redirect to Login]
    H -->|403| L[Show Permission Error]
    H -->|404| M[Show Not Found]
    H -->|422| N[Show Validation Errors]
    H -->|429| O[Show Rate Limit]

    G --> P[Update UI]
    K --> Q[Clear Auth State]
    L --> P
    M --> P
    N --> R[Highlight Form Fields]
    O --> S[Show Retry Timer]
    I --> P
    J --> T[Enable Offline Mode]

    style C fill:#10b981
    style D fill:#f59e0b
    style E fill:#ef4444
    style F fill:#ef4444
```

### Error Response Format

```typescript
// Standard API Error Response
interface ApiError {
  error: {
    code: string;           // Machine-readable code
    message: string;        // User-friendly message
    details?: {             // Field-level errors (validation)
      field: string;
      message: string;
    }[];
    requestId?: string;     // For support debugging
  };
}

// Example: Validation Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "title", "message": "Title is required" },
      { "field": "dueDate", "message": "Due date must be in the future" }
    ],
    "requestId": "req_abc123"
  }
}

// Example: Not Found
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Task not found",
    "requestId": "req_def456"
  }
}
```

---

## Form Validation Flow

### Client-Side Validation

```mermaid
flowchart TB
    A[User Input] --> B[onChange Handler]
    B --> C[Zod Schema Validation]
    C --> D{Valid?}
    D -->|Yes| E[Clear field error]
    D -->|No| F[Set field error]
    E --> G[Enable submit]
    F --> H[Disable submit if required]

    G --> I[User clicks Submit]
    I --> J[Validate entire form]
    J --> K{All valid?}
    K -->|Yes| L[Submit to API]
    K -->|No| M[Show all errors]

    style D fill:#f59e0b
    style L fill:#10b981
    style M fill:#ef4444
```

### ASCII Form Validation

```
FORM VALIDATION STATES
══════════════════════

PRISTINE (Initial):
┌─────────────────────────────────────────┐
│  Title*:    [                         ] │
│                                         │
│  Due Date:  [__/__/____]               │
│                                         │
│             [Cancel]  [Create Task]     │
└─────────────────────────────────────────┘

TOUCHED WITH ERROR:
┌─────────────────────────────────────────┐
│  Title*:    [                         ] │
│             ⚠️ Title is required        │
│                                         │
│  Due Date:  [01/01/2020]               │
│             ⚠️ Due date must be future  │
│                                         │
│             [Cancel]  [Create Task]     │
│                       (disabled)        │
└─────────────────────────────────────────┘

VALID:
┌─────────────────────────────────────────┐
│  Title*:    [Review PR #123        ✓ ] │
│                                         │
│  Due Date:  [02/15/2026            ✓ ] │
│                                         │
│             [Cancel]  [Create Task]     │
│                       (enabled)         │
└─────────────────────────────────────────┘

SERVER ERROR:
┌─────────────────────────────────────────┐
│  ┌─────────────────────────────────┐   │
│  │ ❌ Failed to create task        │   │
│  │    Please try again later       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Title*:    [Review PR #123         ]  │
│                                         │
│             [Cancel]  [Retry]           │
└─────────────────────────────────────────┘
```

---

## Network Error Recovery

### Retry Strategy

```mermaid
flowchart TB
    A[Request Failed] --> B{Error Type}
    B -->|Network Error| C[Auto Retry]
    B -->|5xx Error| D[Auto Retry with Backoff]
    B -->|4xx Error| E[No Auto Retry]

    C --> F{Attempt < 3?}
    D --> F
    F -->|Yes| G[Wait with Exponential Backoff]
    G --> H[Retry Request]
    H --> I{Success?}
    I -->|Yes| J[Return Data]
    I -->|No| F

    F -->|No| K[Show Error to User]
    E --> L[Handle Specific Error]

    style J fill:#10b981
    style K fill:#ef4444
```

### Retry Configuration

```typescript
// React Query retry config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error.response?.status >= 400 && error.response?.status < 500) {
          return false;
        }
        // Retry up to 3 times for network/5xx errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

---

## Error UI Components

### Toast Notifications

```
ERROR TOAST TYPES
═════════════════

SUCCESS:
┌─────────────────────────────────────────┐
│ ✅ Task created successfully        ✕  │
└─────────────────────────────────────────┘

WARNING:
┌─────────────────────────────────────────┐
│ ⚠️ You're offline. Changes saved locally ✕ │
└─────────────────────────────────────────┘

ERROR:
┌─────────────────────────────────────────┐
│ ❌ Failed to save task. Please retry  ✕  │
└─────────────────────────────────────────┘

INFO:
┌─────────────────────────────────────────┐
│ ℹ️ Session expires in 5 minutes      ✕  │
└─────────────────────────────────────────┘
```

### Error Boundaries

```mermaid
flowchart TB
    A[Component Renders] --> B{Error thrown?}
    B -->|No| C[Normal Render]
    B -->|Yes| D[Error Boundary Catches]
    D --> E[Log Error]
    E --> F[Show Fallback UI]
    F --> G[User clicks 'Try Again']
    G --> H[Reset Error State]
    H --> A

    style C fill:#10b981
    style F fill:#f59e0b
```

---

## Error Logging

### Logging Strategy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          ERROR LOGGING                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  CLIENT SIDE                                                             │
│  ───────────                                                             │
│  - Console errors in development                                         │
│  - Send to error tracking service (Sentry) in production                 │
│  - Include: stack trace, user context, app state                        │
│                                                                          │
│  SERVER SIDE                                                             │
│  ───────────                                                             │
│  - Winston logger with JSON format                                       │
│  - Log levels: error, warn, info, debug                                 │
│  - Include: request ID, user ID, error stack                            │
│  - Ship to CloudWatch/DataDog in production                             │
│                                                                          │
│  ERROR LOG STRUCTURE:                                                    │
│  {                                                                       │
│    "level": "error",                                                     │
│    "timestamp": "2026-01-29T12:00:00Z",                                 │
│    "requestId": "req_abc123",                                           │
│    "userId": "user_xyz",                                                │
│    "message": "Task not found",                                          │
│    "error": {                                                            │
│      "name": "NotFoundError",                                           │
│      "code": "NOT_FOUND",                                               │
│      "stack": "..."                                                      │
│    },                                                                    │
│    "context": {                                                          │
│      "taskId": "task_123",                                              │
│      "action": "getTask"                                                │
│    }                                                                     │
│  }                                                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Error Codes Reference

| Code | HTTP | Description | User Action |
|------|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data | Fix form fields |
| `INVALID_JSON` | 400 | Malformed request body | Contact support |
| `UNAUTHORIZED` | 401 | Not logged in | Login again |
| `TOKEN_EXPIRED` | 401 | JWT expired | Auto-refresh or login |
| `FORBIDDEN` | 403 | No permission | Contact admin |
| `NOT_FOUND` | 404 | Resource missing | Check URL |
| `DUPLICATE_EMAIL` | 409 | Email already exists | Use different email |
| `RATE_LIMITED` | 429 | Too many requests | Wait and retry |
| `INTERNAL_ERROR` | 500 | Server error | Retry later |
| `DB_ERROR` | 500 | Database error | Retry later |
