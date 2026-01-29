# TaskFlow Backend Architecture

**Version:** 1.0
**Last Updated:** 2026-01-29

---

## 1. Layered Architecture

TaskFlow backend follows a strict layered architecture pattern to ensure separation of concerns and testability.

```
    ┌─────────────────────────────────────────────────────────────────┐
    │                          Routes Layer                            │
    │  - HTTP method + path matching                                   │
    │  - Middleware chain setup                                        │
    │  - Delegates to controllers                                      │
    └───────────────────────────────┬─────────────────────────────────┘
                                    │
    ┌───────────────────────────────▼─────────────────────────────────┐
    │                        Middleware Layer                          │
    │  - Authentication (JWT verification)                             │
    │  - Validation (Zod schema validation)                            │
    │  - Error handling (centralized error responses)                  │
    │  - Logging (request/response logging)                            │
    └───────────────────────────────┬─────────────────────────────────┘
                                    │
    ┌───────────────────────────────▼─────────────────────────────────┐
    │                       Controllers Layer                          │
    │  - Request parsing and response formatting                       │
    │  - Input validation orchestration                                │
    │  - HTTP status code selection                                    │
    │  - Delegates business logic to services                          │
    └───────────────────────────────┬─────────────────────────────────┘
                                    │
    ┌───────────────────────────────▼─────────────────────────────────┐
    │                        Services Layer                            │
    │  - Business logic implementation                                 │
    │  - Transaction management                                        │
    │  - Cross-repository operations                                   │
    │  - Domain validation and rules                                   │
    └───────────────────────────────┬─────────────────────────────────┘
                                    │
    ┌───────────────────────────────▼─────────────────────────────────┐
    │                      Repositories Layer                          │
    │  - Database queries via Drizzle ORM                              │
    │  - CRUD operations                                               │
    │  - Query building and optimization                               │
    │  - Data mapping to domain entities                               │
    └───────────────────────────────┬─────────────────────────────────┘
                                    │
    ┌───────────────────────────────▼─────────────────────────────────┐
    │                        Database Layer                            │
    │  - PostgreSQL connection pool                                    │
    │  - Migrations and schema                                         │
    │  - Indexes and constraints                                       │
    └─────────────────────────────────────────────────────────────────┘
```

---

## 2. Directory Structure

```
api/
├── src/
│   ├── config/
│   │   ├── database.ts         # Drizzle database connection and pool
│   │   └── env.ts              # Environment variable validation with Zod
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts  # Authentication request handlers
│   │   ├── task.controller.ts  # Task CRUD request handlers
│   │   └── project.controller.ts # Project CRUD request handlers
│   │
│   ├── services/
│   │   ├── auth.service.ts     # Authentication business logic
│   │   ├── task.service.ts     # Task management business logic
│   │   └── project.service.ts  # Project management business logic
│   │
│   ├── repositories/
│   │   ├── user.repository.ts  # User database operations
│   │   ├── task.repository.ts  # Task database operations
│   │   └── project.repository.ts # Project database operations
│   │
│   ├── routes/
│   │   ├── index.ts            # Route aggregation
│   │   ├── auth.routes.ts      # /api/v1/auth/* routes
│   │   ├── task.routes.ts      # /api/v1/tasks/* routes
│   │   └── project.routes.ts   # /api/v1/projects/* routes
│   │
│   ├── schemas/
│   │   ├── auth.schema.ts      # Auth request validation schemas
│   │   ├── task.schema.ts      # Task request validation schemas
│   │   └── project.schema.ts   # Project request validation schemas
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts  # JWT verification middleware
│   │   ├── error.middleware.ts # Global error handler
│   │   └── validation.middleware.ts # Zod validation wrapper
│   │
│   ├── db/
│   │   ├── schema.ts           # Drizzle schema definitions
│   │   └── migrations/         # SQL migration files
│   │       ├── 001_create_users.sql
│   │       ├── 002_create_tasks.sql
│   │       └── 003_create_projects.sql
│   │
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   │
│   ├── utils/
│   │   ├── hash.ts             # Password hashing with bcrypt
│   │   ├── jwt.ts              # JWT sign/verify utilities
│   │   └── errors.ts           # Custom error classes
│   │
│   ├── app.ts                  # Express app configuration
│   └── server.ts               # Server entry point
│
├── tests/
│   ├── unit/                   # Unit tests for services
│   │   ├── auth.service.test.ts
│   │   └── task.service.test.ts
│   └── integration/            # Integration tests for routes
│       ├── auth.routes.test.ts
│       └── task.routes.test.ts
│
├── drizzle.config.ts           # Drizzle migration configuration
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

---

## 3. Dependency Flow

Dependencies flow downward only. Upper layers depend on lower layers.

```
Routes → Controllers → Services → Repositories → Database

Rules:
- Routes NEVER import Services directly
- Controllers NEVER import Repositories directly
- Services NEVER import from Controllers or Routes
- Repositories NEVER contain business logic
```

### Dependency Injection Pattern

```typescript
// repositories/task.repository.ts
export const createTaskRepository = (db: DrizzleDB) => ({
  findByUserId: async (userId: string) => {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  },
  // ... other methods
});

// services/task.service.ts
export const createTaskService = (taskRepo: TaskRepository) => ({
  getUserTasks: async (userId: string, filters: TaskFilters) => {
    const tasks = await taskRepo.findByUserId(userId);
    // Business logic here
    return tasks;
  },
  // ... other methods
});

// controllers/task.controller.ts
export const createTaskController = (taskService: TaskService) => ({
  list: async (req: Request, res: Response) => {
    const tasks = await taskService.getUserTasks(req.user.id, req.query);
    res.json({ data: tasks });
  },
  // ... other methods
});
```

---

## 4. Error Propagation

Errors propagate up through the layers and are caught by the global error handler.

### Custom Error Classes

```typescript
// utils/errors.ts
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super('VALIDATION_ERROR', message, 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super('UNAUTHORIZED', message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super('FORBIDDEN', message, 403);
  }
}
```

### Error Middleware

```typescript
// middleware/error.middleware.ts
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
  }

  // Log unexpected errors
  console.error('Unexpected error:', err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
};
```

---

## 5. Logging Strategy

### Log Levels

| Level | Usage |
|-------|-------|
| ERROR | Unhandled exceptions, failed operations |
| WARN | Deprecated usage, rate limit hits |
| INFO | Request/response, business events |
| DEBUG | Detailed debugging (dev only) |

### Structured Logging Format

```json
{
  "timestamp": "2026-01-29T10:00:00.000Z",
  "level": "INFO",
  "message": "Request completed",
  "requestId": "abc-123",
  "method": "POST",
  "path": "/api/v1/tasks",
  "statusCode": 201,
  "duration": 45,
  "userId": "user-uuid"
}
```

### Logging at Each Layer

```typescript
// Routes: Request received
logger.info({ method: req.method, path: req.path }, 'Request received');

// Controllers: Business operation
logger.info({ userId, action: 'createTask' }, 'Creating task');

// Services: Business event
logger.info({ taskId, status: 'completed' }, 'Task marked complete');

// Repositories: Database operation
logger.debug({ query: 'SELECT * FROM tasks' }, 'Database query');

// Error middleware: Error occurred
logger.error({ err, requestId }, 'Request failed');
```

---

## 6. Middleware Chain Order

The middleware chain executes in the following order:

```typescript
// app.ts
const app = express();

// 1. Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// 2. Security headers (Helmet)
app.use(helmet());

// 3. CORS (before routes)
app.use(cors({
  origin: env.ALLOWED_ORIGINS.split(','),
  credentials: true,
}));

// 4. Rate limiting (before body parsing)
app.use('/api/', rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
}));

// 5. Body parsing
app.use(express.json({ limit: '10kb' }));

// 6. Request logging
app.use(requestLogger);

// 7. Routes (includes auth middleware per-route)
app.use('/api/v1', routes);

// 8. 404 handler (after routes)
app.use(notFoundHandler);

// 9. Global error handler (must be last)
app.use(errorHandler);
```

---

## 7. Cross-References

- **Database Schema:** See `docs/architecture/database.md`
- **API Endpoints:** See `docs/api/reference.md`
- **Authentication Flow:** See `docs/flows/authentication-flow.md`
- **Error Codes:** See `docs/api/error-codes.md` (future)
- **Backend Spec:** See `specs/02_backend_lead.md`

---

*This document is maintained by the Backend team. Last updated: 2026-01-29*
