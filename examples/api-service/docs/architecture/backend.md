# DataHub API Gateway - Backend Architecture

## Layered Architecture

DataHub follows a layered architecture pattern that separates concerns and promotes maintainability.

```
+------------------------------------------------------------------+
|                        Routes Layer                               |
|  - Endpoint definitions                                           |
|  - Request/response mapping                                       |
|  - Swagger annotations                                            |
+------------------------------------------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                      Middleware Layer                             |
|  - Authentication       - Rate Limiting                           |
|  - Authorization        - Request Logging                         |
|  - Validation           - Error Handling                          |
+------------------------------------------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                       Service Layer                               |
|  - Business logic                                                 |
|  - Orchestration                                                  |
|  - Transaction management                                         |
+------------------------------------------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                      Repository Layer                             |
|  - Database operations                                            |
|  - Query building                                                 |
|  - Data mapping                                                   |
+------------------------------------------------------------------+
                               |
                               v
+------------------------------------------------------------------+
|                        Data Layer                                 |
|  - PostgreSQL          - Redis                                    |
|  - Connection pools    - Queue (BullMQ)                          |
+------------------------------------------------------------------+
```

---

## Directory Structure

```
src/
├── index.ts                 # Application entry point
├── app.ts                   # Express app configuration
│
├── config/
│   ├── index.ts             # Configuration loader
│   ├── database.ts          # Database connection config
│   ├── redis.ts             # Redis connection config
│   └── validation.ts        # Config validation schemas
│
├── middleware/
│   ├── auth.ts              # API key authentication
│   ├── authorize.ts         # Scope-based authorization
│   ├── rateLimit.ts         # Rate limiting middleware
│   ├── requestLogger.ts     # Request/response logging
│   ├── requestId.ts         # Request ID generation
│   ├── errorHandler.ts      # Global error handler
│   └── validate.ts          # Request validation wrapper
│
├── routes/
│   ├── index.ts             # Route aggregator
│   ├── health.ts            # Health check routes
│   ├── keys.ts              # API key management routes
│   ├── requests.ts          # Request log routes
│   ├── webhooks.ts          # Webhook management routes
│   └── rateLimits.ts        # Rate limit configuration routes
│
├── services/
│   ├── keyService.ts        # API key business logic
│   ├── requestService.ts    # Request logging logic
│   ├── webhookService.ts    # Webhook management logic
│   ├── rateLimitService.ts  # Rate limiting logic
│   └── auditService.ts      # Audit logging logic
│
├── repositories/
│   ├── keyRepository.ts     # API key database operations
│   ├── requestRepository.ts # Request log operations
│   ├── webhookRepository.ts # Webhook database operations
│   └── auditRepository.ts   # Audit log operations
│
├── queue/
│   ├── webhookQueue.ts      # Webhook delivery queue
│   └── processor.ts         # Queue job processor
│
├── utils/
│   ├── crypto.ts            # Cryptographic utilities
│   ├── logger.ts            # Logging configuration
│   └── errors.ts            # Custom error classes
│
├── validation/
│   ├── keySchemas.ts        # API key validation schemas
│   ├── webhookSchemas.ts    # Webhook validation schemas
│   └── common.ts            # Shared validation utilities
│
└── types/
    ├── index.ts             # Type exports
    ├── api.ts               # API request/response types
    ├── models.ts            # Domain model types
    └── middleware.ts        # Middleware types
```

---

## Middleware Chain

Middleware executes in a specific order for each request:

```typescript
// app.ts - Middleware registration order

// 1. Security headers (no dependencies)
app.use(helmet());

// 2. CORS handling (before routing)
app.use(cors(corsConfig));

// 3. Body parsing (needed for auth and validation)
app.use(express.json({ limit: '10mb' }));

// 4. Request ID generation (before logging)
app.use(requestIdMiddleware);

// 5. Request timing start (before processing)
app.use(requestTimingMiddleware);

// 6. Health checks (no auth required)
app.use('/health', healthRouter);

// 7. Authentication (required for API routes)
app.use('/api', authenticationMiddleware);

// 8. Rate limiting (after auth, uses key info)
app.use('/api', rateLimitMiddleware);

// 9. API routes
app.use('/api/v1/keys', keysRouter);
app.use('/api/v1/requests', requestsRouter);
app.use('/api/v1/webhooks', webhooksRouter);
app.use('/api/v1/rate-limits', rateLimitsRouter);

// 10. 404 handler
app.use(notFoundHandler);

// 11. Global error handler (must be last)
app.use(errorHandler);
```

---

## Service Layer Design

### Service Responsibilities

| Service | Responsibility |
|---------|---------------|
| KeyService | API key CRUD, rotation, validation |
| RateLimitService | Rate limit checking, counter updates |
| RequestService | Request log storage, querying, stats |
| WebhookService | Webhook CRUD, signature generation |
| AuditService | Audit log recording, querying |

### Service Interaction Pattern

```
Controller/Route
      |
      | (DTO)
      v
   Service
      |
      | (Domain Model)
      v
  Repository
      |
      | (SQL/Commands)
      v
   Database
```

### Example: Key Creation Flow

```typescript
// routes/keys.ts
router.post('/', authorize(['admin', 'write:keys']), async (req, res) => {
  const result = await keyService.createKey(req.body, req.apiKey);
  res.status(201).json({ success: true, data: result });
});

// services/keyService.ts
async createKey(input: CreateKeyInput, actor: ApiKeyRecord): Promise<KeyResponse> {
  // 1. Validate input
  const validated = createKeySchema.parse(input);

  // 2. Generate secure key
  const apiKey = this.generateApiKey(validated.environment);
  const keyHash = this.hashApiKey(apiKey);

  // 3. Persist to database
  const record = await this.keyRepository.create({
    ...validated,
    keyHash,
    keyPrefix: apiKey.substring(0, 12),
  });

  // 4. Audit the action
  await this.auditService.log({
    action: 'key.create',
    actorId: actor.id,
    resourceId: record.id,
    newValues: { name: record.name, scopes: record.scopes },
  });

  // 5. Return response (include key only on creation)
  return { ...record, apiKey };
}
```

---

## Error Handling Strategy

### Error Class Hierarchy

```typescript
// utils/errors.ts

class ApiError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
  }
}

// Specific error types
class ValidationError extends ApiError {
  constructor(details: ZodError) {
    super('VALIDATION_ERROR', 'Request validation failed', 400, details.errors);
  }
}

class AuthenticationError extends ApiError {
  constructor(message = 'Invalid or missing API key') {
    super('AUTHENTICATION_ERROR', message, 401);
  }
}

class AuthorizationError extends ApiError {
  constructor(requiredScope: string) {
    super('INSUFFICIENT_SCOPE', `Missing required scope: ${requiredScope}`, 403);
  }
}

class RateLimitError extends ApiError {
  constructor(retryAfter: number) {
    super('RATE_LIMIT_EXCEEDED', 'Rate limit exceeded', 429, { retryAfter });
  }
}

class NotFoundError extends ApiError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}
```

### Error Propagation

```
Route Handler
      |
      | throws ApiError
      v
Error Handler Middleware
      |
      | formats response
      v
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "details": { "retryAfter": 45 }
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

---

## Dependency Injection Pattern

DataHub uses manual constructor injection for testability:

```typescript
// services/keyService.ts
export class KeyService {
  constructor(
    private keyRepository: KeyRepository,
    private auditService: AuditService,
    private cache: RedisClient
  ) {}
}

// Composition root (index.ts)
const redis = createRedisClient(config.redis);
const db = createDatabasePool(config.database);

const keyRepository = new KeyRepository(db);
const auditService = new AuditService(new AuditRepository(db));
const keyService = new KeyService(keyRepository, auditService, redis);
```

---

## Logging Strategy

### Log Levels

| Level | Usage |
|-------|-------|
| error | Unrecoverable errors, exceptions |
| warn | Recoverable issues, deprecations |
| info | Business events, request completion |
| debug | Detailed debugging information |

### Structured Log Format

```json
{
  "level": "info",
  "time": "2024-01-15T10:30:00.000Z",
  "service": "datahub-api",
  "requestId": "req_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
  "method": "POST",
  "path": "/api/v1/keys",
  "statusCode": 201,
  "duration": 45,
  "keyId": "key_01H5X4Y6Z8A9B0C1D2E3F4G5H6",
  "msg": "Request completed"
}
```

---

## Related Documentation

- [Database Architecture](./database.md) - Data layer details
- [Security Architecture](./security.md) - Authentication implementation
- [API Reference](../api/reference.md) - Endpoint documentation

---

_This document describes the backend architectural patterns for DataHub API Gateway._
