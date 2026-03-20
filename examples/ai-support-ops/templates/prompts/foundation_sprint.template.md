# Foundation Sprint (Sprint 0) Prompt Template

Use this template for Sprint 0 - the initial project setup sprint that establishes infrastructure, tooling, and development environment.

---

# Sprint 0: Foundation & Setup

**Sprint Type:** Foundation
**Goal:** Establish project infrastructure, development environment, and initial codebase structure.

## Project Overview

{{PROJECT_DESCRIPTION}}

### Tech Stack
| Layer | Technology | Version |
|-------|------------|---------|
| Backend Runtime | {{BACKEND_RUNTIME}} | {{BACKEND_VERSION}} |
| Backend Framework | {{BACKEND_FRAMEWORK}} | {{FRAMEWORK_VERSION}} |
| Frontend Framework | {{FRONTEND_FRAMEWORK}} | {{FRONTEND_VERSION}} |
| Database | {{DATABASE}} | {{DB_VERSION}} |
| Cache | {{CACHE}} | {{CACHE_VERSION}} |
| Language | {{LANGUAGE}} | {{LANG_VERSION}} |

### Repository Structure Goal
```
{{PROJECT_NAME}}/
├── api/                    # Backend service
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Data access
│   │   ├── routes/        # Route definitions
│   │   ├── schemas/       # Validation schemas
│   │   ├── middleware/    # Express middleware
│   │   ├── types/         # TypeScript types
│   │   ├── utils/         # Helpers
│   │   └── app.ts         # Express setup
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
├── web/                    # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API clients
│   │   ├── store/         # State management
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Helpers
│   ├── tests/
│   ├── package.json
│   └── tsconfig.json
├── specs/                  # Specifications
│   ├── 01_product_manager.md
│   ├── 02_backend_lead.md
│   ├── 03_frontend_lead.md
│   ├── 04_db_architect.md
│   ├── 05_qa_lead.md
│   ├── 06_devops_lead.md
│   └── backlog.md
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Sprint 0 Tickets

### Part A: Infrastructure

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 0.1 | Initialize git repository with .gitignore | 🔲 Todo | DevOps | haiku |
| 0.2 | Create docker-compose.yml for development | 🔲 Todo | DevOps | sonnet |
| 0.3 | Set up {{DATABASE}} database container | 🔲 Todo | DevOps | haiku |
| 0.4 | Set up {{CACHE}} cache container (if applicable) | 🔲 Todo | DevOps | haiku |
| 0.5 | Create .env.example with all required variables | 🔲 Todo | DevOps | haiku |

### Part B: Backend Initialization

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 0.6 | Initialize backend project with {{BACKEND_FRAMEWORK}} | 🔲 Todo | Backend | sonnet |
| 0.7 | Configure TypeScript with strict settings | 🔲 Todo | Backend | haiku |
| 0.8 | Set up database connection module | 🔲 Todo | Backend | sonnet |
| 0.9 | Create base error handling middleware | 🔲 Todo | Backend | sonnet |
| 0.10 | Implement health check endpoint (GET /health) | 🔲 Todo | Backend | haiku |
| 0.11 | Set up Zod for request validation | 🔲 Todo | Backend | haiku |

### Part C: Frontend Initialization

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 0.12 | Initialize frontend project with {{FRONTEND_FRAMEWORK}} | 🔲 Todo | Frontend | sonnet |
| 0.13 | Configure TypeScript and path aliases | 🔲 Todo | Frontend | haiku |
| 0.14 | Set up component library/design system base | 🔲 Todo | Frontend | sonnet |
| 0.15 | Create API client with base configuration | 🔲 Todo | Frontend | sonnet |
| 0.16 | Implement basic layout component | 🔲 Todo | Frontend | haiku |
| 0.17 | Create home/welcome page | 🔲 Todo | Frontend | haiku |

### Part D: Quality & Tooling

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 0.18 | Configure ESLint with recommended rules | 🔲 Todo | DevOps | haiku |
| 0.19 | Configure Prettier for consistent formatting | 🔲 Todo | DevOps | haiku |
| 0.20 | Set up Vitest for backend testing | 🔲 Todo | QA | sonnet |
| 0.21 | Set up Vitest for frontend testing | 🔲 Todo | QA | sonnet |
| 0.22 | Create initial CI pipeline (GitHub Actions) | 🔲 Todo | DevOps | sonnet |
| 0.23 | Write first tests (health check, home page render) | 🔲 Todo | QA | haiku |

### Part E: Documentation

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 0.24 | Create README.md with setup instructions | 🔲 Todo | Product | sonnet |
| 0.25 | Document development workflow | 🔲 Todo | Product | haiku |
| 0.26 | Create CONTRIBUTING.md (optional) | 🔲 Todo | Product | haiku |

---

## Execution Guidelines

### 1. Execution Order (Critical Dependencies)

Follow this order to avoid blocking:

```
Phase 1: Git & Docker (0.1-0.5)
    └── No dependencies, can start immediately

Phase 2: Backend Init (0.6-0.11)
    └── Depends on: Docker, database container

Phase 3: Frontend Init (0.12-0.17)
    └── Depends on: Git repo
    └── Can run parallel to Phase 2

Phase 4: Quality Tools (0.18-0.23)
    └── Depends on: Backend & Frontend initialized

Phase 5: Documentation (0.24-0.26)
    └── Depends on: All setup complete
```

### 2. Model Selection Strategy

**haiku** (use for simple, well-defined tasks):
- Git initialization
- TypeScript config
- ESLint/Prettier setup
- Health check endpoint
- Simple component scaffolding

**sonnet** (use for complex setup):
- Docker compose configuration
- Database connection setup
- CI pipeline creation
- Test framework setup
- API client configuration

**opus** (rarely needed in Sprint 0):
- Complex architecture decisions
- Custom build configurations

### 3. Verification After Each Ticket

After completing each ticket, verify it works:

```bash
# After Docker setup (0.2-0.4)
docker-compose up -d
docker-compose ps  # All services healthy

# After backend init (0.6-0.11)
cd api && npm install
npm run dev  # Starts without errors
curl http://localhost:3000/health  # Returns OK

# After frontend init (0.12-0.17)
cd web && npm install
npm run dev  # Starts without errors
# Browser: http://localhost:5173 shows welcome page

# After quality tools (0.18-0.23)
npm run lint  # No errors
npm run test  # All tests pass
```

### 4. File Templates

#### docker-compose.yml
```yaml
version: '3.8'

services:
  db:
    image: {{DATABASE_IMAGE}}
    environment:
      {{DATABASE_ENV_VARS}}
    ports:
      - "${DB_PORT:-5432}:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "${REDIS_PORT:-6379}:6379"

  api:
    build:
      context: ./api
      dockerfile: Dockerfile.dev
    ports:
      - "${API_PORT:-3000}:3000"
    environment:
      - DATABASE_URL=postgresql://{{DB_USER}}:{{DB_PASSWORD}}@db:5432/{{DB_NAME}}
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./api:/app
      - /app/node_modules
    depends_on:
      - db
      - redis

  web:
    build:
      context: ./web
      dockerfile: Dockerfile.dev
    ports:
      - "${WEB_PORT:-5173}:5173"
    volumes:
      - ./web:/app
      - /app/node_modules
    depends_on:
      - api

volumes:
  db_data:
```

#### .env.example
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/{{PROJECT_NAME_SNAKE}}
DB_PORT=5432

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PORT=6379

# API
API_PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production

# Web
WEB_PORT=5173
VITE_API_URL=http://localhost:3000/api/v1
```

#### api/src/config/env.ts
```typescript
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  REDIS_URL: z.string().optional(),
  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
```

---

## Multi-Agent Strategy for Sprint 0

### Parallel Workstreams

Sprint 0 has natural parallelization opportunities:

```
Agent A (Backend/DevOps - sonnet):
├── 0.1 Git init
├── 0.2 Docker compose
├── 0.3 Database setup
├── 0.6 Backend init
├── 0.7 TypeScript config
├── 0.8 Database connection
├── 0.9 Error middleware
├── 0.10 Health check
└── 0.11 Zod setup

Agent B (Frontend - sonnet):
├── 0.12 Frontend init
├── 0.13 TypeScript config
├── 0.14 Design system base
├── 0.15 API client
├── 0.16 Layout component
└── 0.17 Welcome page

Sync Point: After both agents complete their init
    ↓
Continue with tooling (can be either agent):
├── 0.18 ESLint
├── 0.19 Prettier
├── 0.20 Backend tests
├── 0.21 Frontend tests
├── 0.22 CI pipeline
└── 0.23 Initial tests
```

### Handoff Protocol

1. Agent A completes Git init (0.1) first
2. Both agents can then work in parallel
3. Sync at ticket 0.18 before quality tools
4. Either agent can complete documentation

---

## Definition of Done

### Sprint 0 Success Criteria

- [ ] `docker-compose up` runs all services successfully
- [ ] Backend responds to GET /health with 200 OK
- [ ] Frontend displays welcome page at localhost:{{WEB_PORT}}
- [ ] `npm run lint` passes in both api/ and web/
- [ ] `npm test` passes in both api/ and web/
- [ ] CI pipeline runs successfully on push
- [ ] README has clear setup instructions
- [ ] .env.example documents all required variables
- [ ] All code committed and pushed

### Verification Script

```bash
#!/bin/bash
# verify-sprint-0.sh

echo "=== Sprint 0 Verification ==="

# Start services
docker-compose up -d

# Wait for services
sleep 5

# Check backend
echo "Checking backend..."
curl -f http://localhost:3000/health || exit 1

# Check frontend
echo "Checking frontend..."
curl -f http://localhost:5173 || exit 1

# Run tests
echo "Running backend tests..."
cd api && npm test || exit 1

echo "Running frontend tests..."
cd ../web && npm test || exit 1

# Lint
echo "Running lint..."
cd ../api && npm run lint || exit 1
cd ../web && npm run lint || exit 1

echo "=== Sprint 0 Verified Successfully ==="
```

---

## Sprint Documentation

When Sprint 0 completes, create `sprints/sprint-0-foundation/`:

```
sprints/sprint-0-foundation/
├── summary.md          # Overview and decisions made
├── setup-guide.md      # Detailed setup instructions
└── architecture.md     # Architecture decisions documented
```

### summary.md Template

```markdown
# Sprint 0: Foundation - Summary

**Completed:** {{DATE}}
**Duration:** {{HOURS}} hours

## Deliverables

- [x] Git repository initialized
- [x] Docker development environment
- [x] Backend API with health check
- [x] Frontend with welcome page
- [x] Testing framework configured
- [x] CI pipeline operational

## Architecture Decisions

1. **Database**: {{DATABASE}} - {{REASONING}}
2. **Cache**: {{CACHE}} - {{REASONING}}
3. **State Management**: {{STATE_LIB}} - {{REASONING}}

## Next Sprint Setup

Sprint 1 can now begin with:
- Working development environment
- All tooling configured
- Base structure in place
```

---

## Backlog Updates

As you complete tickets:
1. Update status: 🔲 → 🔄 → ✅
2. Note any blockers immediately
3. Add any discovered tasks as new tickets
4. Track model usage for FinOps

---

## Starting Command

Begin execution:

1. **If single agent:** Start with 0.1 (Git init), follow dependency order
2. **If multi-agent:**
   - Agent A: Start with 0.1, then 0.2-0.11
   - Agent B: Wait for 0.1, then 0.12-0.17
3. Create todo list for tracking
4. Update backlog after each completed ticket

---

*Generated with SDD for All framework*
