# Sprint 0 Development Execution: Foundation & Infrastructure

## Environment: claude-code

## Context - Read These Files First

**MANDATORY:** Read ALL these files before writing any code:

### Specs (Read ALL):
- specs/01_product_manager.md - requirements, personas, user flows
- specs/02_backend_lead.md - API design, service layer, error handling
- specs/04_db_architect.md - database schema, migrations, queries
- specs/05_qa_lead.md - test strategy, coverage targets
- specs/06_devops_lead.md - infrastructure, CI/CD, Docker
- specs/backlog.md - Sprint 0 tickets (your work items)

### Docs (Read ALL relevant):
- docs/architecture/overview.md - system architecture
- docs/architecture/backend.md - backend layer design
- docs/architecture/database.md - ERD, tables, relationships
- docs/environments/development.md - local setup prerequisites
- docs/environments/docker.md - Docker setup
- docs/environments/environment-variables.md - all env vars
- docs/testing/strategy.md - test pyramid, tooling
- docs/project/setup.md - repo structure, config files
- docs/project/coding-standards.md - naming conventions, patterns

---

## Your Mission

Execute Sprint 0: Foundation & Infrastructure

**Goal:** Establish project foundation, database schema, and development environment.

---

## Tickets to Complete

| #      | Ticket                                                                      | Points | Status | Owner   | Model  | Depends        |
| ------ | --------------------------------------------------------------------------- | ------ | ------ | ------- | ------ | -------------- |
| DH-001 | Initialize Node.js project with TypeScript configuration                    | 2      | todo   | Backend | Sonnet | -              |
| DH-002 | Configure ESLint, Prettier, and Husky pre-commit hooks                      | 2      | todo   | Backend | Sonnet | DH-001         |
| DH-003 | Set up Express.js application structure with middleware stack               | 3      | todo   | Backend | Sonnet | DH-001         |
| DH-004 | Create PostgreSQL database connection with connection pooling               | 3      | todo   | Backend | Sonnet | DH-003         |
| DH-005 | Create Redis connection service for caching and rate limiting               | 3      | todo   | Backend | Sonnet | DH-003         |
| DH-006 | Implement database migration system with versioned SQL files                | 3      | todo   | Backend | Sonnet | DH-004         |
| DH-007 | Create api_keys table migration with all fields and indexes                 | 3      | todo   | Backend | Sonnet | DH-006         |
| DH-008 | Create request_logs table migration with partitioning support               | 5      | todo   | Backend | Sonnet | DH-006         |
| DH-009 | Create webhooks and webhook_events table migrations                         | 3      | todo   | Backend | Sonnet | DH-006         |
| DH-010 | Create webhook_deliveries table migration with partitioning                 | 3      | todo   | Backend | Sonnet | DH-006         |
| DH-011 | Create rate_limits and audit_logs table migrations                          | 3      | todo   | Backend | Sonnet | DH-006         |
| DH-012 | Implement health check endpoints (GET /health, /health/ready, /health/live) | 3      | todo   | Backend | Sonnet | DH-004, DH-005 |
| DH-013 | Create Dockerfile for production with multi-stage build                     | 3      | todo   | DevOps  | Sonnet | DH-003         |
| DH-014 | Create Docker Compose configuration for local development                   | 3      | todo   | DevOps  | Sonnet | DH-013         |
| DH-015 | Set up Jest testing framework with Supertest for API tests                  | 3      | todo   | QA      | Sonnet | DH-003         |

---

## Execution Instructions

### For Each Ticket:

1. **Update Status:** Change ticket from todo to in-progress in specs/backlog.md
2. **Read Relevant Spec:** Find the specific section in the appropriate spec file
3. **Implement:** Write code following patterns in docs/
4. **Test:** Write tests per docs/testing/ patterns
5. **Verify:** Run `npm test`, `npm run lint`, `npm run typecheck`
6. **Commit:** `git commit -m "Complete DH-XXX: [ticket description]"`
7. **Update Status:** Change ticket from in-progress to qa-review in specs/backlog.md

---

## Ticket-by-Ticket Breakdown

### Ticket DH-001: Initialize Node.js project with TypeScript configuration
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 2

**Implementation Steps:**
1. Initialize npm project with `npm init -y`
2. Install TypeScript and Node types: `npm install -D typescript @types/node ts-node`
3. Create tsconfig.json with strict mode, ES2022 target, NodeNext module
4. Configure path aliases (@/ for src/)
5. Create src/ directory structure
6. Add build script to package.json

**Files to Create/Modify:**
- `package.json` - project configuration
- `tsconfig.json` - TypeScript configuration
- `src/index.ts` - entry point placeholder

**Directory Structure:**
```
src/
├── config/           # Configuration files
├── middleware/       # Express middleware
├── routes/           # Route handlers
├── services/         # Business logic
├── repositories/     # Data access layer
├── utils/            # Utility functions
├── types/            # TypeScript type definitions
└── index.ts          # Application entry point
```

**Verification:**
```bash
npm run build
# Should compile without errors
```

**Dependencies:** None

---

### Ticket DH-002: Configure ESLint, Prettier, and Husky pre-commit hooks
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 2

**Implementation Steps:**
1. Install ESLint with TypeScript plugins
2. Install Prettier
3. Install Husky and lint-staged
4. Create .eslintrc.js with recommended rules
5. Create .prettierrc with formatting rules
6. Configure Husky pre-commit hook
7. Add lint and format scripts to package.json

**Files to Create/Modify:**
- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `.husky/pre-commit` - Pre-commit hook
- `package.json` - scripts and devDependencies

**Verification:**
```bash
npm run lint
npm run format
# Both should complete without errors
```

**Dependencies:** DH-001

---

### Ticket DH-003: Set up Express.js application structure with middleware stack
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Implementation Steps:**
1. Install Express and types: `npm install express` and `npm install -D @types/express`
2. Install middleware: helmet, cors, compression, express-rate-limit
3. Create Express app factory in src/app.ts
4. Configure middleware stack in correct order:
   - helmet (security headers)
   - cors (cross-origin)
   - compression (gzip)
   - express.json (body parsing with 10mb limit)
   - express.urlencoded (form parsing)
   - requestId middleware
5. Create error handling middleware
6. Create not-found handler
7. Update src/index.ts to start server

**Middleware Order:**
```typescript
// 1. Security headers (helmet)
// 2. CORS
// 3. Compression
// 4. Body parsing (JSON, URL-encoded)
// 5. Request ID generation
// 6. Request logging
// 7. Routes
// 8. 404 handler
// 9. Error handler
```

**Files to Create/Modify:**
- `src/app.ts` - Express application factory
- `src/index.ts` - Server startup
- `src/middleware/requestId.ts` - Request ID middleware
- `src/middleware/errorHandler.ts` - Error handling middleware
- `src/middleware/notFound.ts` - 404 handler

**Verification:**
```bash
npm run dev
curl http://localhost:3000/
# Should return 404 JSON response
```

**Dependencies:** DH-001

---

### Ticket DH-004: Create PostgreSQL database connection with connection pooling
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Implementation Steps:**
1. Install pg and types: `npm install pg` and `npm install -D @types/pg`
2. Create database configuration from environment variables
3. Create connection pool with configurable min/max connections
4. Implement connection health check function
5. Add graceful shutdown handling
6. Export pool for use in repositories

**Configuration:**
```typescript
{
  connectionString: process.env.DATABASE_URL,
  min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
  max: parseInt(process.env.DATABASE_POOL_MAX || '20'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
}
```

**Files to Create/Modify:**
- `src/config/database.ts` - Database configuration
- `src/services/database.ts` - Database connection service
- `.env.example` - Environment variable template

**Verification:**
```bash
# With PostgreSQL running
npm run dev
# Check logs for "Database connected" message
```

**Dependencies:** DH-003

---

### Ticket DH-005: Create Redis connection service for caching and rate limiting
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Implementation Steps:**
1. Install ioredis: `npm install ioredis`
2. Create Redis configuration from environment variables
3. Create Redis client with reconnection logic
4. Implement connection health check function
5. Add graceful shutdown handling
6. Export client for use in services

**Configuration:**
```typescript
{
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  maxRetriesPerRequest: 3,
}
```

**Files to Create/Modify:**
- `src/config/redis.ts` - Redis configuration
- `src/services/redis.ts` - Redis connection service

**Verification:**
```bash
# With Redis running
npm run dev
# Check logs for "Redis connected" message
```

**Dependencies:** DH-003

---

### Ticket DH-006: Implement database migration system with versioned SQL files
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Implementation Steps:**
1. Create migrations directory structure
2. Create migrations table in database
3. Implement migration runner that:
   - Reads SQL files in order (by timestamp prefix)
   - Tracks applied migrations in migrations table
   - Runs pending migrations in transaction
4. Create CLI commands: migrate, rollback, status
5. Add npm scripts for migration commands

**Migration File Naming:** `YYYYMMDDHHMMSS_description.sql`

**Files to Create/Modify:**
- `src/database/migrator.ts` - Migration runner
- `src/database/migrations/` - Migration files directory
- `src/cli/migrate.ts` - CLI command
- `package.json` - Add migration scripts

**Verification:**
```bash
npm run db:migrate
npm run db:status
# Should show migrations table created
```

**Dependencies:** DH-004

---

### Ticket DH-007: Create api_keys table migration with all fields and indexes
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 3

**Implementation Steps:**
1. Create migration file with timestamp prefix
2. Define api_keys table with all columns
3. Add indexes for common queries
4. Add foreign key constraints

**Table Schema:**
```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(64) NOT NULL UNIQUE,
    key_prefix VARCHAR(12) NOT NULL,
    scopes TEXT[] NOT NULL DEFAULT '{}',
    rate_limit_tier VARCHAR(50) DEFAULT 'standard',
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255),
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_api_keys_key_prefix ON api_keys(key_prefix);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active) WHERE is_active = true;
CREATE INDEX idx_api_keys_expires_at ON api_keys(expires_at) WHERE expires_at IS NOT NULL;
```

**Files to Create/Modify:**
- `src/database/migrations/20240101000001_create_api_keys.sql`

**Verification:**
```bash
npm run db:migrate
# Verify table exists with \dt api_keys in psql
```

**Dependencies:** DH-006

---

### Ticket DH-008: Create request_logs table migration with partitioning support
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 5

**Implementation Steps:**
1. Create migration file with timestamp prefix
2. Define request_logs as partitioned table (by created_at, monthly)
3. Create initial partition for current month
4. Add indexes on partitions
5. Document partition maintenance procedure

**Table Schema:**
```sql
CREATE TABLE request_logs (
    id UUID DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES api_keys(id),
    request_id VARCHAR(36) NOT NULL,
    method VARCHAR(10) NOT NULL,
    path VARCHAR(2048) NOT NULL,
    query_params JSONB,
    request_headers JSONB,
    request_body JSONB,
    response_status INTEGER,
    response_headers JSONB,
    response_body JSONB,
    response_time_ms INTEGER,
    ip_address INET,
    user_agent VARCHAR(1024),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id, created_at)
) PARTITION BY RANGE (created_at);

-- Create partition for current month
CREATE TABLE request_logs_2024_01 PARTITION OF request_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

**Files to Create/Modify:**
- `src/database/migrations/20240101000002_create_request_logs.sql`

**Verification:**
```bash
npm run db:migrate
# Verify partitioned table with \d+ request_logs in psql
```

**Dependencies:** DH-006

---

### Ticket DH-009: Create webhooks and webhook_events table migrations
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 3

**Implementation Steps:**
1. Create migration file with timestamp prefix
2. Define webhooks table
3. Define webhook_events table (event types)
4. Add indexes and constraints

**Table Schemas:**
```sql
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
    url VARCHAR(2048) NOT NULL,
    secret VARCHAR(64) NOT NULL,
    events TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT true,
    description VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    payload_schema JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_webhooks_api_key_id ON webhooks(api_key_id);
CREATE INDEX idx_webhooks_is_active ON webhooks(is_active) WHERE is_active = true;
```

**Files to Create/Modify:**
- `src/database/migrations/20240101000003_create_webhooks.sql`

**Verification:**
```bash
npm run db:migrate
```

**Dependencies:** DH-006

---

### Ticket DH-010: Create webhook_deliveries table migration with partitioning
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Implementation Steps:**
1. Create migration file with timestamp prefix
2. Define webhook_deliveries as partitioned table (by created_at)
3. Create initial partition
4. Add indexes for common queries

**Table Schema:**
```sql
CREATE TABLE webhook_deliveries (
    id UUID DEFAULT gen_random_uuid(),
    webhook_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    response_status INTEGER,
    response_body TEXT,
    response_time_ms INTEGER,
    attempt_count INTEGER DEFAULT 1,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id, created_at),
    CONSTRAINT fk_webhook FOREIGN KEY (webhook_id) REFERENCES webhooks(id) ON DELETE CASCADE
) PARTITION BY RANGE (created_at);

CREATE TABLE webhook_deliveries_2024_01 PARTITION OF webhook_deliveries
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE INDEX idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(status);
CREATE INDEX idx_webhook_deliveries_next_retry ON webhook_deliveries(next_retry_at)
    WHERE status = 'pending';
```

**Files to Create/Modify:**
- `src/database/migrations/20240101000004_create_webhook_deliveries.sql`

**Verification:**
```bash
npm run db:migrate
```

**Dependencies:** DH-006

---

### Ticket DH-011: Create rate_limits and audit_logs table migrations
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 3

**Implementation Steps:**
1. Create migration file with timestamp prefix
2. Define rate_limits table (custom rate limit overrides)
3. Define audit_logs table
4. Add indexes

**Table Schemas:**
```sql
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE,
    endpoint_pattern VARCHAR(255),
    requests_per_minute INTEGER,
    requests_per_hour INTEGER,
    requests_per_day INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(api_key_id, endpoint_pattern)
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id UUID REFERENCES api_keys(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent VARCHAR(1024),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_api_key_id ON audit_logs(api_key_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

**Files to Create/Modify:**
- `src/database/migrations/20240101000005_create_rate_limits_audit_logs.sql`

**Verification:**
```bash
npm run db:migrate
npm run db:status
# Should show all migrations applied
```

**Dependencies:** DH-006

---

### Ticket DH-012: Implement health check endpoints
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Implementation Steps:**
1. Create health check router
2. Implement GET /health - basic status
3. Implement GET /health/ready - checks DB and Redis connectivity
4. Implement GET /health/live - always returns 200 (for k8s liveness)
5. Add appropriate response schemas
6. Register routes in app

**Response Schemas:**
```typescript
// GET /health
{
  status: 'ok' | 'degraded' | 'error',
  timestamp: string,
  version: string
}

// GET /health/ready
{
  status: 'ok' | 'error',
  checks: {
    database: { status: 'ok' | 'error', latency_ms: number },
    redis: { status: 'ok' | 'error', latency_ms: number }
  }
}

// GET /health/live
{
  status: 'ok'
}
```

**Files to Create/Modify:**
- `src/routes/health.ts` - Health check routes
- `src/services/healthCheck.ts` - Health check service
- `src/app.ts` - Register health routes

**Verification:**
```bash
npm run dev
curl http://localhost:3000/health
curl http://localhost:3000/health/ready
curl http://localhost:3000/health/live
```

**Dependencies:** DH-004, DH-005

---

### Ticket DH-013: Create Dockerfile for production with multi-stage build
**Owner:** DevOps  |  **Model:** Haiku  |  **Points:** 3

**Implementation Steps:**
1. Create Dockerfile with multi-stage build
2. Stage 1: Build (install deps, compile TypeScript)
3. Stage 2: Production (copy dist, install prod deps only)
4. Use node:20-alpine as base image
5. Configure non-root user
6. Add .dockerignore file

**Dockerfile Structure:**
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
USER nodejs
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

**Files to Create/Modify:**
- `Dockerfile` - Multi-stage Dockerfile
- `.dockerignore` - Docker ignore file

**Verification:**
```bash
docker build -t datahub-api-gateway .
docker run -p 3000:3000 datahub-api-gateway
curl http://localhost:3000/health
```

**Dependencies:** DH-003

---

### Ticket DH-014: Create Docker Compose configuration for local development
**Owner:** DevOps  |  **Model:** Haiku  |  **Points:** 3

**Implementation Steps:**
1. Create docker-compose.yml with services:
   - api (the application)
   - postgres (database)
   - redis (cache)
2. Configure volumes for data persistence
3. Configure networks
4. Add health checks for dependencies
5. Create docker-compose.override.yml for dev overrides

**Services:**
```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://datahub:datahub@postgres:5432/datahub
      - REDIS_URL=redis://redis:6379
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: datahub
      POSTGRES_PASSWORD: datahub
      POSTGRES_DB: datahub
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U datahub"]

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
```

**Files to Create/Modify:**
- `docker-compose.yml` - Main compose file
- `docker-compose.override.yml` - Development overrides

**Verification:**
```bash
docker-compose up -d
docker-compose ps
curl http://localhost:3000/health
```

**Dependencies:** DH-013

---

### Ticket DH-015: Set up Jest testing framework with Supertest for API tests
**Owner:** QA  |  **Model:** Sonnet  |  **Points:** 3

**Implementation Steps:**
1. Install Jest and types: `npm install -D jest @types/jest ts-jest`
2. Install Supertest: `npm install -D supertest @types/supertest`
3. Create jest.config.js with TypeScript support
4. Create test setup file for database/redis mocking
5. Create example unit test
6. Create example integration test for health endpoint
7. Add test scripts to package.json

**Jest Configuration:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts']
};
```

**Files to Create/Modify:**
- `jest.config.js` - Jest configuration
- `src/test/setup.ts` - Test setup
- `src/routes/health.test.ts` - Health endpoint tests
- `package.json` - Test scripts

**Verification:**
```bash
npm test
npm run test:coverage
```

**Dependencies:** DH-003

---

## After All Tickets Complete

1. Run full verification:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   docker-compose up -d
   curl http://localhost:3000/health
   npm run db:migrate
   npm run db:status
   ```

2. Update all ticket statuses to qa-review in specs/backlog.md

3. Commit all changes:
   ```bash
   git add -A
   git commit -m "Complete Sprint 0: Foundation & Infrastructure"
   ```

4. Proceed to QA: Run prompts/sprint_0/qa_sprint_0.md
