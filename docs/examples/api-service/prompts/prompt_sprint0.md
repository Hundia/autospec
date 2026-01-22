# Sprint 0: Foundation & Infrastructure

## Sprint Goal

Establish project foundation, database schema, and development environment for DataHub API Gateway.

## Sprint Context

- **Project**: DataHub API Gateway
- **Type**: API-only service (no frontend)
- **Tech Stack**: Node.js, TypeScript, Express.js, PostgreSQL, Redis
- **Duration**: 2 weeks
- **Total Points**: 45

## Reference Specifications

- `specs/01_product_manager.md` - Product vision and integration flows
- `specs/02_backend_lead.md` - API design and architecture
- `specs/04_db_architect.md` - Database schema definitions
- `specs/05_qa_lead.md` - Testing strategy
- `specs/06_devops_lead.md` - Docker and infrastructure

---

## Sprint 0 Tickets

| #      | Ticket                                                                      | Status  | Owner   | Model  | Depends        | Points |
| ------ | --------------------------------------------------------------------------- | ------- | ------- | ------ | -------------- | ------ |
| DH-001 | Initialize Node.js project with TypeScript configuration                    | Pending | Backend | Sonnet | -              | 2      |
| DH-002 | Configure ESLint, Prettier, and Husky pre-commit hooks                      | Pending | Backend | Sonnet | DH-001         | 2      |
| DH-003 | Set up Express.js application structure with middleware stack               | Pending | Backend | Sonnet | DH-001         | 3      |
| DH-004 | Create PostgreSQL database connection with connection pooling               | Pending | Backend | Sonnet | DH-003         | 3      |
| DH-005 | Create Redis connection service for caching and rate limiting               | Pending | Backend | Sonnet | DH-003         | 3      |
| DH-006 | Implement database migration system with versioned SQL files                | Pending | Backend | Sonnet | DH-004         | 3      |
| DH-007 | Create api_keys table migration with all fields and indexes                 | Pending | Backend | Sonnet | DH-006         | 3      |
| DH-008 | Create request_logs table migration with partitioning support               | Pending | Backend | Sonnet | DH-006         | 5      |
| DH-009 | Create webhooks and webhook_events table migrations                         | Pending | Backend | Sonnet | DH-006         | 3      |
| DH-010 | Create webhook_deliveries table migration with partitioning                 | Pending | Backend | Sonnet | DH-006         | 3      |
| DH-011 | Create rate_limits and audit_logs table migrations                          | Pending | Backend | Sonnet | DH-006         | 3      |
| DH-012 | Implement health check endpoints (GET /health, /health/ready, /health/live) | Pending | Backend | Sonnet | DH-004, DH-005 | 3      |
| DH-013 | Create Dockerfile for production with multi-stage build                     | Pending | DevOps  | Sonnet | DH-003         | 3      |
| DH-014 | Create Docker Compose configuration for local development                   | Pending | DevOps  | Sonnet | DH-013         | 3      |
| DH-015 | Set up Jest testing framework with Supertest for API tests                  | Pending | QA      | Sonnet | DH-003         | 3      |

---

## Ticket Details

### DH-001: Initialize Node.js project with TypeScript configuration

**Description**: Set up the foundational Node.js project with TypeScript.

**Requirements**:

- Initialize npm project with `package.json`
- Configure TypeScript with strict mode
- Set up path aliases for clean imports
- Configure build output to `dist/` directory
- Add npm scripts: `build`, `dev`, `start`

**Files to Create**:

- `package.json`
- `tsconfig.json`
- `src/index.ts` (entry point placeholder)

**Acceptance Criteria**:

- [ ] `npm run build` compiles TypeScript successfully
- [ ] `npm run dev` starts development server with hot reload
- [ ] Path aliases work correctly (e.g., `@/services`)

---

### DH-002: Configure ESLint, Prettier, and Husky pre-commit hooks

**Description**: Set up code quality tools for consistent code style.

**Requirements**:

- Configure ESLint with TypeScript support
- Configure Prettier for code formatting
- Set up Husky for pre-commit hooks
- Add lint-staged for efficient linting

**Files to Create**:

- `.eslintrc.js`
- `.prettierrc`
- `.husky/pre-commit`
- `lint-staged.config.js`

**Acceptance Criteria**:

- [ ] `npm run lint` checks code without errors
- [ ] `npm run format` formats code correctly
- [ ] Pre-commit hook runs linting on staged files

---

### DH-003: Set up Express.js application structure with middleware stack

**Description**: Create the Express.js application with proper middleware ordering.

**Requirements**:

- Create Express app with TypeScript
- Add security middleware (helmet, cors)
- Add JSON body parser with size limit
- Set up basic error handling
- Create modular route structure

**File Structure**:

```
src/
├── app.ts           # Express app setup
├── index.ts         # Server entry point
├── config/
│   └── index.ts     # Configuration loading
├── middleware/
│   └── errorHandler.ts
└── routes/
    └── index.ts     # Route aggregation
```

**Acceptance Criteria**:

- [ ] Server starts on configured port
- [ ] CORS configured correctly
- [ ] Security headers present via helmet
- [ ] JSON parsing works with 10mb limit

---

### DH-004: Create PostgreSQL database connection with connection pooling

**Description**: Set up PostgreSQL connection with proper pooling.

**Requirements**:

- Use `pg` package for PostgreSQL
- Implement connection pooling
- Add connection health checking
- Handle connection errors gracefully
- Support DATABASE_URL environment variable

**Files to Create**:

- `src/db/index.ts` - Database connection
- `src/db/pool.ts` - Connection pool configuration

**Configuration**:

```typescript
{
  max: 20,           // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
}
```

**Acceptance Criteria**:

- [ ] Connection established successfully
- [ ] Pool limits enforced
- [ ] Connection errors logged appropriately

---

### DH-005: Create Redis connection service for caching and rate limiting

**Description**: Set up Redis connection for caching and rate limiting.

**Requirements**:

- Use `ioredis` package
- Support REDIS_URL environment variable
- Implement connection health checking
- Add key prefix configuration
- Handle reconnection gracefully

**Files to Create**:

- `src/redis/index.ts` - Redis connection
- `src/redis/client.ts` - Redis client configuration

**Acceptance Criteria**:

- [ ] Connection established successfully
- [ ] Reconnection works on disconnect
- [ ] Health check returns connection status

---

### DH-006: Implement database migration system with versioned SQL files

**Description**: Create a migration system for database schema management.

**Requirements**:

- Store migrations in `migrations/` directory
- Track applied migrations in database
- Support up migrations
- Add npm scripts for migration commands
- Validate migration file naming convention

**Files to Create**:

- `src/db/migrate.ts` - Migration runner
- `migrations/.gitkeep` - Migrations directory

**Migration Naming**: `NNN_description.sql` (e.g., `001_initial_schema.sql`)

**Acceptance Criteria**:

- [ ] `npm run db:migrate` runs pending migrations
- [ ] `npm run db:status` shows migration status
- [ ] Migrations run in order

---

### DH-007: Create api_keys table migration with all fields and indexes

**Description**: Create the api_keys table as defined in `04_db_architect.md`.

**Requirements**:

- Create api_keys table with all columns
- Add status constraint
- Create all indexes
- Add updated_at trigger

**File**: `migrations/001_api_keys.sql`

**Key Fields**:

- id (VARCHAR(32) PRIMARY KEY)
- key_hash (VARCHAR(64) UNIQUE)
- name, description
- status, scopes
- rate_limit_minute/hour/day
- metadata (JSONB)
- timestamps

**Acceptance Criteria**:

- [ ] Migration runs successfully
- [ ] All indexes created
- [ ] Trigger updates updated_at

---

### DH-008: Create request_logs table migration with partitioning support

**Description**: Create partitioned request_logs table for high-volume logging.

**Requirements**:

- Create parent request_logs table
- Set up RANGE partitioning by created_date
- Create default partition
- Add all indexes

**File**: `migrations/002_request_logs.sql`

**Acceptance Criteria**:

- [ ] Partitioned table created
- [ ] Default partition exists
- [ ] Indexes created on parent table

---

### DH-009: Create webhooks and webhook_events table migrations

**Description**: Create webhook subscription tables.

**Requirements**:

- Create webhooks table with all fields
- Create webhook_events junction table
- Add foreign key constraints
- Create indexes

**File**: `migrations/003_webhooks.sql`

**Acceptance Criteria**:

- [ ] Tables created with relationships
- [ ] Cascade delete configured
- [ ] Unique constraint on webhook_events

---

### DH-010: Create webhook_deliveries table migration with partitioning

**Description**: Create partitioned webhook_deliveries table.

**Requirements**:

- Create parent table with partitioning
- Create default partition
- Add all status constraints
- Create indexes for common queries

**File**: `migrations/004_webhook_deliveries.sql`

**Acceptance Criteria**:

- [ ] Partitioned table created
- [ ] Status constraint working
- [ ] Indexes created

---

### DH-011: Create rate_limits and audit_logs table migrations

**Description**: Create rate_limits and audit_logs tables.

**Requirements**:

- Create rate_limits table with target_type constraint
- Create partitioned audit_logs table
- Add unique constraint on rate_limits

**File**: `migrations/005_rate_limits_audit.sql`

**Acceptance Criteria**:

- [ ] Tables created
- [ ] Constraints working
- [ ] Audit logs partitioned

---

### DH-012: Implement health check endpoints

**Description**: Create health check endpoints for monitoring.

**Endpoints**:

- `GET /health` - Basic liveness check
- `GET /health/ready` - Readiness with dependency checks
- `GET /health/live` - Liveness with uptime

**Requirements**:

- Check database connectivity in ready endpoint
- Check Redis connectivity in ready endpoint
- Return appropriate status codes (200/503)

**Files to Create**:

- `src/routes/health.ts`

**Response Format**:

```json
{
  "status": "healthy",
  "checks": {
    "database": "connected",
    "redis": "connected"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

**Acceptance Criteria**:

- [ ] All three endpoints working
- [ ] Dependency checks accurate
- [ ] 503 returned when dependencies down

---

### DH-013: Create Dockerfile for production with multi-stage build

**Description**: Create optimized production Dockerfile.

**Requirements**:

- Multi-stage build (deps, builder, runner)
- Non-root user for security
- Health check instruction
- Minimize final image size

**File**: `Dockerfile`

**Stages**:

1. `deps` - Install dependencies
2. `builder` - Build TypeScript
3. `runner` - Production image

**Acceptance Criteria**:

- [ ] Image builds successfully
- [ ] Image size < 200MB
- [ ] Health check configured
- [ ] Runs as non-root

---

### DH-014: Create Docker Compose configuration for local development

**Description**: Set up Docker Compose for local development environment.

**Services**:

- datahub (application)
- postgres (database)
- redis (cache)

**Requirements**:

- Volume mounts for hot reload
- Health checks for dependencies
- Port mappings
- Environment variables

**File**: `docker-compose.yml`

**Acceptance Criteria**:

- [ ] `docker-compose up` starts all services
- [ ] Application connects to database
- [ ] Application connects to Redis
- [ ] Hot reload working

---

### DH-015: Set up Jest testing framework with Supertest

**Description**: Configure Jest for unit and integration testing.

**Requirements**:

- Configure Jest with TypeScript support
- Add Supertest for API testing
- Create test utilities and helpers
- Set up test database configuration

**Files to Create**:

- `jest.config.js`
- `tests/setup.ts`
- `tests/helpers/index.ts`

**Acceptance Criteria**:

- [ ] `npm test` runs tests
- [ ] Coverage report generated
- [ ] Test database isolated

---

## Sprint 0 Completion Checklist

- [ ] All 15 tickets completed
- [ ] Project builds with `npm run build`
- [ ] Docker Compose starts successfully
- [ ] All migrations run without errors
- [ ] Health endpoints return correct status
- [ ] Test framework passing with sample test
- [ ] Code follows linting rules

---

## Notes for Implementation

1. **Order of Execution**: Follow the dependency chain. Start with DH-001, then DH-002 and DH-003 in parallel (after DH-001), etc.

2. **Database Schema**: Refer to `specs/04_db_architect.md` for exact column definitions and constraints.

3. **Configuration**: Use environment variables for all configurable values. See `specs/06_devops_lead.md` for the complete list.

4. **Testing**: Even though this is foundation sprint, add basic smoke tests where possible.

5. **Documentation**: Add inline comments for complex logic and maintain README with setup instructions.
