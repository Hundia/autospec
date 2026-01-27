/**
 * Docs Generator
 * Generates comprehensive documentation folder with .md files
 * covering architecture, workflows, environments, Docker, and more
 */

import path from 'path';
import { writeFile, ensureDir } from '../utils/file.js';
import { getCurrentDate } from '../utils/file.js';
import { ParsedRequirements } from '../parsers/requirements.parser.js';

export interface DocsGeneratorOptions {
  projectName: string;
  outputDir: string;
  requirements?: ParsedRequirements;
  techStack?: {
    frontend?: string;
    backend?: string;
    database?: string;
    language?: string;
  };
}

/**
 * Generate architecture.md
 */
function generateArchitectureDoc(options: DocsGeneratorOptions): string {
  const ts = options.techStack || { frontend: 'React', backend: 'Node.js', database: 'PostgreSQL', language: 'TypeScript' };
  const name = options.projectName;

  return `# ${name} — Architecture Documentation

**Version:** 1.0
**Created:** ${getCurrentDate()}
**Last Updated:** ${getCurrentDate()}

---

## 1. System Overview

### High-Level Architecture

\`\`\`
┌─────────────────────────────────────────────────────────────────────┐
│                        ${name}                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐     HTTP/REST     ┌──────────────────┐       │
│  │                  │◄────────────────►│                  │       │
│  │   Frontend App   │                  │   Backend API    │       │
│  │   (${(ts.frontend || 'React').padEnd(12)})   │                  │   (${(ts.backend || 'Node.js').padEnd(12)})  │       │
│  │                  │                  │                  │       │
│  └──────────────────┘                  └────────┬─────────┘       │
│                                                  │                 │
│                                           ┌──────▼─────────┐      │
│                                           │                │      │
│                                           │   Database     │      │
│                                           │   (${(ts.database || 'PostgreSQL').padEnd(12)}) │      │
│                                           │                │      │
│                                           └────────────────┘      │
│                                                                     │
│  ┌──────────────────┐     ┌──────────────────┐                     │
│  │   Cache Layer    │     │   Message Queue   │                     │
│  │   (Redis)        │     │   (Optional)      │                     │
│  └──────────────────┘     └──────────────────┘                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
\`\`\`

### Tech Stack Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | ${ts.frontend} | User interface |
| Backend | ${ts.backend} | API & business logic |
| Database | ${ts.database} | Data persistence |
| Language | ${ts.language} | Primary language |
| Containerization | Docker | Dev & prod environments |
| CI/CD | GitHub Actions | Automated pipeline |
| Testing | Vitest | Unit & integration tests |

---

## 2. Backend Architecture

### Layered Architecture Pattern

\`\`\`
Request Flow:

  HTTP Request
       │
       ▼
  ┌─────────────┐
  │   Routes    │  ← Route definitions, path mapping
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ Middleware   │  ← Auth, validation, rate limiting
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │ Controllers │  ← Request parsing, response formatting
  └──────┬──────┘
         │
         ▼
  ┌─────────────┐
  │  Services   │  ← Business logic, orchestration
  └──────┬──────┘
         │
         ▼
  ┌──────────────┐
  │ Repositories │  ← Database access, queries
  └──────┬───────┘
         │
         ▼
  ┌─────────────┐
  │  Database   │  ← ${ts.database}
  └─────────────┘
\`\`\`

### Directory Structure

\`\`\`
api/
├── src/
│   ├── config/           # Environment config, database config
│   │   ├── database.ts
│   │   ├── env.ts
│   │   └── index.ts
│   ├── controllers/      # Request handlers
│   │   ├── auth.controller.ts
│   │   └── health.controller.ts
│   ├── services/         # Business logic
│   │   ├── auth.service.ts
│   │   └── user.service.ts
│   ├── repositories/     # Database access layer
│   │   └── user.repository.ts
│   ├── routes/           # Express route definitions
│   │   ├── auth.routes.ts
│   │   └── index.ts
│   ├── schemas/          # Zod validation schemas
│   │   ├── auth.schema.ts
│   │   └── user.schema.ts
│   ├── middleware/       # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── utils/            # Helper functions
│       ├── logger.ts
│       └── errors.ts
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
├── tsconfig.json
└── Dockerfile
\`\`\`

---

## 3. Frontend Architecture

### Component Architecture

\`\`\`
Application Structure:

  ┌─────────────────────────────────────────┐
  │              App Shell                   │
  │  ┌─────────────────────────────────┐    │
  │  │         Router Provider          │    │
  │  │  ┌───────────────────────────┐  │    │
  │  │  │      Layout Component     │  │    │
  │  │  │  ┌─────┐ ┌────────────┐  │  │    │
  │  │  │  │ Nav │ │   Page     │  │  │    │
  │  │  │  │     │ │ Component  │  │  │    │
  │  │  │  │     │ │            │  │  │    │
  │  │  │  └─────┘ └────────────┘  │  │    │
  │  │  └───────────────────────────┘  │    │
  │  └─────────────────────────────────┘    │
  └─────────────────────────────────────────┘
\`\`\`

### Directory Structure

\`\`\`
web/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base design system components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   ├── layout/      # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   └── features/    # Feature-specific components
│   ├── pages/           # Route page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API client calls
│   ├── stores/          # State management (Zustand/Context)
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Helper functions
│   └── App.tsx          # Root component
├── tests/
├── public/
└── package.json
\`\`\`

---

## 4. Database Architecture

### Entity-Relationship Overview

\`\`\`
┌──────────────┐       ┌──────────────┐
│    users     │       │   sessions   │
├──────────────┤       ├──────────────┤
│ id (PK)      │──────<│ user_id (FK) │
│ email        │       │ token        │
│ password_hash│       │ expires_at   │
│ name         │       │ created_at   │
│ role         │       └──────────────┘
│ created_at   │
│ updated_at   │
└──────────────┘
\`\`\`

### Migration Strategy

- **Tool:** Database migration tool (Drizzle/Prisma/Knex)
- **Naming:** \`YYYYMMDDHHMMSS_description.ts\`
- **Rules:**
  - Every schema change requires a migration
  - Migrations must be reversible
  - Never modify existing migrations
  - Test migrations on staging before production

---

## 5. Security Architecture

### Authentication Flow

\`\`\`
Client                    Backend                   Database
  │                          │                          │
  │  POST /api/v1/auth/login │                          │
  │  { email, password }     │                          │
  │────────────────────────►│                          │
  │                          │  SELECT user by email    │
  │                          │────────────────────────►│
  │                          │◄────────────────────────│
  │                          │                          │
  │                          │  Verify password hash    │
  │                          │  Generate JWT token      │
  │  { token, user }         │                          │
  │◄────────────────────────│                          │
  │                          │                          │
  │  GET /api/v1/resource    │                          │
  │  Authorization: Bearer   │                          │
  │────────────────────────►│                          │
  │                          │  Verify JWT              │
  │                          │  Extract user context    │
  │  { data }                │                          │
  │◄────────────────────────│                          │
\`\`\`

### Security Layers

| Layer | Protection | Implementation |
|-------|-----------|----------------|
| Input | Validation | Zod schemas on all inputs |
| Transport | Encryption | HTTPS/TLS in production |
| Auth | JWT | Short-lived access tokens |
| Data | Hashing | bcrypt for passwords |
| API | Rate Limiting | Express rate-limit middleware |
| DB | Parameterized | ORM prevents SQL injection |

---

## 6. API Design

### RESTful Conventions

| Method | Path | Action | Example |
|--------|------|--------|---------|
| GET | /resources | List all | GET /api/v1/users |
| GET | /resources/:id | Get one | GET /api/v1/users/123 |
| POST | /resources | Create | POST /api/v1/users |
| PUT | /resources/:id | Replace | PUT /api/v1/users/123 |
| PATCH | /resources/:id | Update | PATCH /api/v1/users/123 |
| DELETE | /resources/:id | Remove | DELETE /api/v1/users/123 |

### Response Format

\`\`\`json
// Success
{
  "data": { ... },
  "meta": {
    "timestamp": "2026-01-27T00:00:00Z",
    "requestId": "uuid"
  }
}

// Error
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [{ "field": "email", "message": "Required" }]
  }
}

// Paginated
{
  "data": [...],
  "meta": {
    "page": 1,
    "perPage": 20,
    "total": 100,
    "totalPages": 5
  }
}
\`\`\`

---

*This document is auto-generated by AutoSpec. Update as architecture evolves.*
`;
}

/**
 * Generate workflows.md
 */
function generateWorkflowsDoc(options: DocsGeneratorOptions): string {
  const name = options.projectName;

  return `# ${name} — Development Workflows

**Version:** 1.0
**Created:** ${getCurrentDate()}

---

## 1. Development Workflow

### Feature Development Flow

\`\`\`
  ┌──────────────┐
  │ Pick Ticket  │  Read specs/backlog.md, choose next ticket
  │ from Backlog │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Read Specs   │  Read relevant spec files (02_backend, 03_frontend, etc.)
  │              │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Update       │  Change ticket status: 🔲 → 🔄
  │ Backlog      │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Create       │  git checkout -b feature/ticket-X.Y-description
  │ Branch       │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Implement    │  Write code following spec patterns
  │ Feature      │  Follow Repository → Service → Controller pattern
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Write Tests  │  Unit + integration tests per QA spec
  │              │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Run Tests    │  npm test && npm run lint
  │ & Lint       │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Update       │  Change ticket status: 🔄 → 🧪 QA Review
  │ Backlog      │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ QA Review    │  Run full test suite, manual testing
  │              │
  └──────┬───────┘
         │
    ┌────┴────┐
    │  Pass?  │
    └────┬────┘
    Yes  │  No → Back to Implement
         ▼
  ┌──────────────┐
  │ Mark Done    │  Change ticket status: 🧪 → ✅ Done
  │              │
  └──────────────┘
\`\`\`

---

## 2. Sprint Workflow

### Sprint Lifecycle

\`\`\`
  Sprint Planning          Sprint Execution           Sprint Review
  ┌─────────────┐         ┌─────────────────┐        ┌─────────────┐
  │ Review      │         │ Execute tickets  │        │ Demo        │
  │ backlog.md  │────────►│ following the    │───────►│ features    │
  │             │         │ feature workflow │        │             │
  │ Generate    │         │                 │        │ Update      │
  │ sprint      │         │ Daily: update   │        │ backlog     │
  │ prompt      │         │ backlog status  │        │ status      │
  └─────────────┘         └─────────────────┘        └─────────────┘
\`\`\`

### Sprint Execution with AI

1. **Load sprint prompt** from \`prompts/prompt_sprintN.md\`
2. **Paste into AI assistant** (Claude, Copilot, Gemini)
3. **Execute tickets** in dependency order
4. **Update backlog** after each ticket
5. **Run tests** after each implementation
6. **Mark sprint complete** when all tickets are done

---

## 3. Multi-Agent Workflow

### Parallel Execution Pattern

\`\`\`
                    ┌───────────────────┐
                    │   Sprint Prompt   │
                    │   (Full Context)  │
                    └────────┬──────────┘
                             │
                    ┌────────┴──────────┐
                    │                   │
              ┌─────▼─────┐      ┌─────▼─────┐
              │  Agent A  │      │  Agent B  │
              │  Backend  │      │  Frontend │
              │           │      │           │
              │ Tickets:  │      │ Tickets:  │
              │ X.1, X.3  │      │ X.2, X.4  │
              │ X.5       │      │ X.6       │
              └─────┬─────┘      └─────┬─────┘
                    │                   │
                    └────────┬──────────┘
                             │
                    ┌────────▼──────────┐
                    │  Integration      │
                    │  & QA Review      │
                    │  (Single Agent)   │
                    └───────────────────┘
\`\`\`

### Multi-Agent Rules

1. **Split by domain:** Backend vs Frontend tickets
2. **Shared backlog:** Both agents update \`specs/backlog.md\`
3. **No conflicts:** Agents work on separate files/directories
4. **Integration phase:** Single agent merges and tests
5. **Spec reference:** Both agents read the same spec files

---

## 4. Bug Fix Workflow

\`\`\`
  ┌──────────────┐
  │ Bug Reported │  Add to Bug Backlog in backlog.md
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Triage       │  Assess severity: Critical/High/Medium/Low
  │              │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Write Failing│  Reproduce the bug as a test
  │ Test First   │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Fix the Bug  │  Implement the fix
  │              │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Verify Tests │  Ensure the failing test now passes
  │ Pass         │  + all other tests still pass
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │ Update Bug   │  Mark as ✅ Done in Bug Backlog
  │ Backlog      │
  └──────────────┘
\`\`\`

---

## 5. Git Workflow

### Branch Strategy

\`\`\`
main (production)
  │
  ├── develop (integration)
  │     │
  │     ├── feature/0.1-init-repo
  │     ├── feature/1.1-user-auth
  │     ├── feature/1.2-dashboard-ui
  │     └── bugfix/B.1-login-error
  │
  └── release/v1.0.0
\`\`\`

### Commit Convention

\`\`\`
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Scope: api, web, db, ci, docs

Examples:
  feat(api): add user registration endpoint
  fix(web): resolve login form validation
  test(api): add integration tests for auth
  docs: update architecture diagram
\`\`\`

---

## 6. Deployment Workflow

### CI/CD Pipeline

\`\`\`
  Push to Branch          CI Pipeline              Deployment
  ┌─────────────┐   ┌──────────────────┐    ┌─────────────────┐
  │ git push    │──►│ 1. Install deps  │    │                 │
  │             │   │ 2. Lint check    │    │  Staging        │
  │             │   │ 3. Type check    │──►│  (auto-deploy   │
  │             │   │ 4. Unit tests    │    │   on develop)   │
  │             │   │ 5. Build         │    │                 │
  │             │   │ 6. Integration   │    │  Production     │
  │             │   │    tests         │    │  (manual on     │
  │             │   └──────────────────┘    │   main/release) │
  └─────────────┘                          └─────────────────┘
\`\`\`

---

*This document is auto-generated by AutoSpec. Update as workflows evolve.*
`;
}

/**
 * Generate docker.md
 */
function generateDockerDoc(options: DocsGeneratorOptions): string {
  const ts = options.techStack || { frontend: 'React', backend: 'Node.js', database: 'PostgreSQL', language: 'TypeScript' };
  const dbImage = (ts.database || 'PostgreSQL').toLowerCase().includes('postgres') ? 'postgres:16-alpine' :
                  (ts.database || '').toLowerCase().includes('mysql') ? 'mysql:8' :
                  (ts.database || '').toLowerCase().includes('mongo') ? 'mongo:7' : 'postgres:16-alpine';

  return `# ${options.projectName} — Docker & Container Documentation

**Version:** 1.0
**Created:** ${getCurrentDate()}

---

## 1. Overview

All services run in Docker containers for consistent development and production environments.

### Container Architecture

\`\`\`
┌─────────────────────────────────────────────────────┐
│                  Docker Network                       │
│                                                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐    │
│  │   web      │  │   api      │  │   db       │    │
│  │ Port: 3000 │  │ Port: 4000 │  │ Port: 5432 │    │
│  │ ${(ts.frontend || 'React').padEnd(10)} │  │ ${(ts.backend || 'Node.js').padEnd(10)} │  │ ${(ts.database || 'PostgreSQL').padEnd(10)} │    │
│  └────────────┘  └────────────┘  └────────────┘    │
│                                                       │
│  ┌────────────┐  ┌────────────┐                      │
│  │   redis    │  │  mailhog   │                      │
│  │ Port: 6379 │  │ Port: 8025 │                      │
│  │ Cache      │  │ Email test │                      │
│  └────────────┘  └────────────┘                      │
│                                                       │
└─────────────────────────────────────────────────────┘
\`\`\`

---

## 2. docker-compose.yml (Development)

\`\`\`yaml
version: '3.8'

services:
  db:
    image: ${dbImage}
    restart: unless-stopped
    environment:
      POSTGRES_DB: \${DB_NAME:-app_dev}
      POSTGRES_USER: \${DB_USER:-dev}
      POSTGRES_PASSWORD: \${DB_PASSWORD:-dev_password}
    ports:
      - "\${DB_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api:
    build:
      context: ./api
      dockerfile: Dockerfile
      target: development
    restart: unless-stopped
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://\${DB_USER:-dev}:\${DB_PASSWORD:-dev_password}@db:5432/\${DB_NAME:-app_dev}
      REDIS_URL: redis://redis:6379
      PORT: 4000
    ports:
      - "4000:4000"
    volumes:
      - ./api/src:/app/src
      - /app/node_modules
    depends_on:
      db:
        condition: service_healthy
    command: npm run dev

  web:
    build:
      context: ./web
      dockerfile: Dockerfile
      target: development
    restart: unless-stopped
    environment:
      VITE_API_URL: http://localhost:4000/api/v1
    ports:
      - "3000:3000"
    volumes:
      - ./web/src:/app/src
      - /app/node_modules
    depends_on:
      - api
    command: npm run dev

volumes:
  postgres_data:
  redis_data:
\`\`\`

---

## 3. Dockerfile (Backend API)

\`\`\`dockerfile
# ===== Development =====
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

# ===== Build =====
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ===== Production =====
FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/package*.json ./
RUN npm ci --only=production && npm cache clean --force
USER nodejs
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost:4000/health || exit 1
CMD ["node", "dist/index.js"]
\`\`\`

---

## 4. Dockerfile (Frontend Web)

\`\`\`dockerfile
# ===== Development =====
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ===== Build =====
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=\${VITE_API_URL}
RUN npm run build

# ===== Production =====
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost/ || exit 1
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

---

## 5. Common Docker Commands

\`\`\`bash
# Start all services
docker-compose up -d

# Start with build
docker-compose up -d --build

# View logs
docker-compose logs -f api
docker-compose logs -f web

# Stop all services
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v

# Rebuild single service
docker-compose build api
docker-compose up -d api

# Enter container shell
docker-compose exec api sh
docker-compose exec db psql -U dev app_dev

# Run migrations inside container
docker-compose exec api npm run migrate

# Production build
docker-compose -f docker-compose.prod.yml up -d --build
\`\`\`

---

## 6. Environment Variables

### .env.example

\`\`\`env
# Database
DB_NAME=app_dev
DB_USER=dev
DB_PASSWORD=dev_password
DB_PORT=5432
DATABASE_URL=postgresql://dev:dev_password@localhost:5432/app_dev

# API
API_PORT=4000
NODE_ENV=development
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=7d

# Frontend
VITE_API_URL=http://localhost:4000/api/v1

# Redis
REDIS_URL=redis://localhost:6379

# Email (development)
SMTP_HOST=localhost
SMTP_PORT=1025
\`\`\`

---

*This document is auto-generated by AutoSpec. Update as infrastructure evolves.*
`;
}

/**
 * Generate environments.md
 */
function generateEnvironmentsDoc(options: DocsGeneratorOptions): string {
  return `# ${options.projectName} — Environment Setup Guide

**Version:** 1.0
**Created:** ${getCurrentDate()}

---

## 1. Development Environment

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ LTS | Runtime |
| npm | 9+ | Package manager |
| Docker | 24+ | Container runtime |
| Docker Compose | 2.x | Multi-container orchestration |
| Git | 2.x | Version control |

### Quick Start

\`\`\`bash
# 1. Clone the repository
git clone <repository-url>
cd ${options.projectName.toLowerCase().replace(/\s+/g, '-')}

# 2. Copy environment variables
cp .env.example .env

# 3. Start infrastructure (database, redis)
docker-compose up -d db redis

# 4. Install backend dependencies & run migrations
cd api
npm install
npm run migrate
npm run seed    # Optional: seed test data

# 5. Install frontend dependencies
cd ../web
npm install

# 6. Start development servers
# Terminal 1: Backend
cd api && npm run dev

# Terminal 2: Frontend
cd web && npm run dev

# Or start everything with Docker
docker-compose up -d
\`\`\`

### Verification

\`\`\`bash
# Backend health check
curl http://localhost:4000/health
# Expected: { "status": "ok" }

# Frontend
open http://localhost:3000
# Expected: Welcome page renders

# Database connection
docker-compose exec db psql -U dev app_dev -c "SELECT 1"
# Expected: Returns 1
\`\`\`

---

## 2. Staging Environment

### Purpose
- Pre-production testing
- QA and integration testing
- Demo environment for stakeholders

### Configuration

| Setting | Value |
|---------|-------|
| URL | staging.${options.projectName.toLowerCase().replace(/\s+/g, '-')}.com |
| Database | Separate staging database |
| Data | Seeded test data (no production data) |
| Deploy | Auto-deploy from \`develop\` branch |

### Deployment

\`\`\`bash
# Auto-deployed via CI/CD on push to develop branch
git push origin develop

# Manual deploy (if needed)
./scripts/deploy-staging.sh
\`\`\`

---

## 3. Production Environment

### Configuration

| Setting | Value |
|---------|-------|
| URL | ${options.projectName.toLowerCase().replace(/\s+/g, '-')}.com |
| Database | Production database with backups |
| Scaling | Horizontal scaling enabled |
| SSL | Required (TLS 1.3) |
| Deploy | Manual from \`main\` branch via release |

### Production Checklist

- [ ] All environment variables set and verified
- [ ] Database migrations applied
- [ ] SSL certificates configured
- [ ] Logging and monitoring enabled
- [ ] Backup strategy configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Error tracking (Sentry) configured
- [ ] Health checks responding
- [ ] Load testing completed

### Deployment

\`\`\`bash
# 1. Create release branch
git checkout -b release/v1.0.0 develop

# 2. Run full test suite
npm test && npm run test:integration && npm run test:e2e

# 3. Build production images
docker-compose -f docker-compose.prod.yml build

# 4. Deploy
./scripts/deploy-production.sh

# 5. Verify
curl https://${options.projectName.toLowerCase().replace(/\s+/g, '-')}.com/health
\`\`\`

---

## 4. Environment Comparison

| Feature | Development | Staging | Production |
|---------|-------------|---------|------------|
| Database | Local Docker | Cloud managed | Cloud managed (HA) |
| Cache | Local Redis | Cloud Redis | Cloud Redis (cluster) |
| SSL | None (HTTP) | Yes (HTTPS) | Yes (HTTPS) |
| Logging | Console | Cloud logging | Cloud logging + alerts |
| Monitoring | None | Basic | Full APM |
| Backups | None | Daily | Continuous + snapshots |
| Scaling | Single instance | Single instance | Auto-scaling |
| Debug | Full debug mode | Limited debug | No debug |

---

*This document is auto-generated by AutoSpec. Update as environments evolve.*
`;
}

/**
 * Generate project-setup.md
 */
function generateProjectSetupDoc(options: DocsGeneratorOptions): string {
  const ts = options.techStack || { frontend: 'React', backend: 'Node.js', database: 'PostgreSQL', language: 'TypeScript' };

  return `# ${options.projectName} — Project Setup Guide

**Version:** 1.0
**Created:** ${getCurrentDate()}

---

## 1. Initial Project Setup

### Repository Structure

\`\`\`
${options.projectName.toLowerCase().replace(/\s+/g, '-')}/
├── api/                    # Backend API (${ts.backend})
│   ├── src/
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── web/                    # Frontend App (${ts.frontend})
│   ├── src/
│   ├── tests/
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── specs/                  # AutoSpec specification files
│   ├── 01_product_manager.md
│   ├── 02_backend_lead.md
│   ├── ...
│   └── backlog.md
├── prompts/                # Sprint execution prompts
├── docs/                   # Project documentation
├── sprint_prompts/         # Sprint elaboration prompts
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
\`\`\`

---

## 2. Key Configuration Files

### TypeScript Configuration (tsconfig.json)

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
\`\`\`

### ESLint Configuration

\`\`\`json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "rules": {
    "no-console": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
\`\`\`

### .gitignore

\`\`\`
node_modules/
dist/
.env
.env.local
*.log
.DS_Store
coverage/
.turbo/
\`\`\`

---

## 3. NPM Scripts

### Backend (api/package.json)

\`\`\`json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "migrate": "drizzle-kit push",
    "seed": "tsx src/scripts/seed.ts"
  }
}
\`\`\`

### Frontend (web/package.json)

\`\`\`json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  }
}
\`\`\`

---

## 4. IDE Setup

### VS Code Extensions (Recommended)

\`\`\`json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-azuretools.vscode-docker",
    "vitest.explorer"
  ]
}
\`\`\`

### VS Code Settings

\`\`\`json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
\`\`\`

---

*This document is auto-generated by AutoSpec. Update as project evolves.*
`;
}

/**
 * Generate api-reference.md
 */
function generateApiReferenceDoc(options: DocsGeneratorOptions): string {
  return `# ${options.projectName} — API Reference

**Version:** 1.0
**Created:** ${getCurrentDate()}
**Base URL:** \`http://localhost:4000/api/v1\`

---

## Authentication

### Register

\`\`\`http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "data": {
    "user": { "id": "uuid", "email": "user@example.com", "name": "John Doe" },
    "token": "jwt-token"
  }
}
\`\`\`

### Login

\`\`\`http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "data": {
    "user": { "id": "uuid", "email": "user@example.com", "name": "John Doe" },
    "token": "jwt-token"
  }
}
\`\`\`

---

## Health Check

\`\`\`http
GET /health
\`\`\`

**Response (200):**
\`\`\`json
{
  "status": "ok",
  "timestamp": "2026-01-27T00:00:00Z",
  "uptime": 12345
}
\`\`\`

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Input validation failed |
| UNAUTHORIZED | 401 | Missing or invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource already exists |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /auth/login | 5 requests | 15 minutes |
| POST /auth/register | 3 requests | 1 hour |
| All other endpoints | 100 requests | 1 minute |

**Rate limit headers:**
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1706400000
\`\`\`

---

*Endpoints are defined in \`specs/02_backend_lead.md\`. Update this reference as new endpoints are added.*
`;
}

/**
 * Generate Gemini workflow/architecture prompt
 */
function generateGeminiDiagramPrompt(options: DocsGeneratorOptions): string {
  const ts = options.techStack || { frontend: 'React', backend: 'Node.js', database: 'PostgreSQL', language: 'TypeScript' };

  return `# ${options.projectName} — AI Diagram Generation Prompt

**Purpose:** Feed this prompt to Google Gemini (or similar AI) to generate visual diagrams of the architecture and workflows.

---

## Prompt: System Architecture Diagram

\`\`\`
Create a detailed, professional system architecture diagram for a web application called "${options.projectName}" with the following specifications:

**Tech Stack:**
- Frontend: ${ts.frontend} with ${ts.language}
- Backend: ${ts.backend} with ${ts.language}
- Database: ${ts.database}
- Containerization: Docker & Docker Compose
- CI/CD: GitHub Actions

**Architecture Components:**

1. Client Layer:
   - ${ts.frontend} SPA served via Nginx (port 3000)
   - Communicates with backend via REST API

2. API Layer:
   - ${ts.backend} REST API (port 4000)
   - Layered architecture: Routes → Middleware → Controllers → Services → Repositories
   - JWT authentication
   - Zod input validation
   - Rate limiting middleware

3. Data Layer:
   - ${ts.database} primary database (port 5432)
   - Redis cache layer (port 6379)
   - Database migrations via ORM

4. Infrastructure Layer:
   - Docker containers for all services
   - Docker Compose for orchestration
   - GitHub Actions CI/CD pipeline
   - Three environments: Development, Staging, Production

**Style:** Clean, modern, use boxes with rounded corners, arrows showing data flow direction, color-coded layers (blue for frontend, green for backend, orange for data, purple for infrastructure).

**Format:** Generate as a high-resolution PNG or SVG diagram suitable for documentation.
\`\`\`

---

## Prompt: Database Schema Diagram

\`\`\`
Create an Entity-Relationship Diagram (ERD) for "${options.projectName}" with the following specifications:

**Database:** ${ts.database}

**Core Tables:**

1. users
   - id (UUID, PK)
   - email (VARCHAR, UNIQUE, NOT NULL)
   - password_hash (VARCHAR, NOT NULL)
   - name (VARCHAR)
   - role (ENUM: user, admin)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

2. sessions
   - id (UUID, PK)
   - user_id (UUID, FK → users.id)
   - token (VARCHAR, UNIQUE)
   - expires_at (TIMESTAMP)
   - created_at (TIMESTAMP)

[Add more tables based on your specs/04_db_architect.md]

**Relationships:**
- users 1:N sessions
- [Add more relationships based on your specs]

**Style:** Use crow's foot notation, show data types, highlight primary and foreign keys, use different colors for different entity groups.

**Format:** Generate as SVG or PNG suitable for documentation.
\`\`\`

---

## Prompt: User Flow Diagram

\`\`\`
Create a user flow diagram for "${options.projectName}" showing the main user journeys:

**Flow 1: Authentication**
1. User visits landing page
2. Clicks "Sign Up" or "Log In"
3. Fills in credentials
4. System validates input
5. On success → redirect to dashboard
6. On failure → show error, retry

**Flow 2: Main Feature Flow**
[Customize based on your specs/01_product_manager.md user flows]

**Style:** Flowchart style with:
- Rounded rectangles for pages/screens
- Diamonds for decisions
- Arrows for navigation flow
- Color coding: green for success paths, red for error paths
- Include page titles and key actions

**Format:** Generate as SVG or PNG.
\`\`\`

---

## Prompt: CI/CD Pipeline Diagram

\`\`\`
Create a CI/CD pipeline visualization for "${options.projectName}":

**Pipeline Stages:**

1. Code Push (trigger)
   → Push to any branch triggers pipeline

2. Build Stage
   - Install dependencies (npm ci)
   - TypeScript compilation
   - Build frontend assets

3. Test Stage (parallel)
   - Lint check (ESLint)
   - Type check (tsc --noEmit)
   - Unit tests (Vitest)
   - Integration tests (with test DB)

4. Quality Gate
   - All tests must pass
   - Code coverage ≥ 80%
   - No lint errors

5. Deploy Stage
   - develop branch → Staging (auto)
   - main branch → Production (manual approval)

6. Post-Deploy
   - Health check verification
   - Smoke tests
   - Notification (Slack/Email)

**Style:** Horizontal pipeline flow, use status icons (checkmarks, X marks), show parallel stages side by side, use GitHub Actions branding colors.
\`\`\`

---

## Prompt: Sprint Workflow Diagram

\`\`\`
Create a visual diagram showing the AutoSpec Sprint Workflow for "${options.projectName}":

**Workflow Steps:**

1. Sprint Planning
   - Read specs/backlog.md
   - Generate sprint prompt
   - Assign tickets to agents

2. Sprint Execution (parallel tracks)
   Track A - Backend Agent:
   - Read specs/02_backend_lead.md
   - Execute backend tickets
   - Update backlog status

   Track B - Frontend Agent:
   - Read specs/03_frontend_lead.md
   - Execute frontend tickets
   - Update backlog status

3. Integration
   - Merge parallel work
   - Run full test suite
   - Fix integration issues

4. QA Review
   - Run all tests
   - Manual testing
   - Update backlog: 🧪 → ✅

5. Sprint Complete
   - All tickets ✅ Done
   - Sprint documentation
   - Retrospective notes

**Style:** Swim lane diagram with parallel tracks, use AutoSpec branding colors (blue/purple gradient), show ticket status emoji transitions.
\`\`\`

---

*Feed these prompts to Google Gemini, Claude, or any AI image generator to create professional diagrams for your project documentation.*
`;
}

/**
 * Generate Remotion video generation prompt
 */
function generateRemotionPrompt(options: DocsGeneratorOptions): string {
  const ts = options.techStack || { frontend: 'React', backend: 'Node.js', database: 'PostgreSQL', language: 'TypeScript' };
  const desc = options.requirements?.description || 'A modern web application';

  return `# ${options.projectName} — Remotion Video Generation Prompt

**Purpose:** Feed this prompt to Claude (with Remotion MCP or knowledge) to generate a professional project demo/explainer video.

---

## Prompt: Generate Remotion Video Project

\`\`\`
Create a Remotion video project that generates a professional explainer/demo video for "${options.projectName}".

**Project Description:** ${desc}

**Video Structure (60-90 seconds, 30fps, 1920x1080):**

### Scene 1: Title Card (0-3s)
- Dark gradient background (slate-900 to slate-800)
- "${options.projectName}" text with gradient animation (blue → purple)
- Subtitle: "${desc}"
- Fade in with scale animation

### Scene 2: The Problem (3-10s)
- Header: "The Challenge"
- Animated bullet points appearing one by one:
  - Traditional development is slow and error-prone
  - AI assistants without structure produce inconsistent results
  - Integration chaos between different components
  - Endless back-and-forth iterations
- Red accent color for problem indicators
- Icons sliding in from left

### Scene 3: The Solution (10-20s)
- Header: "Meet ${options.projectName}"
- Animated flow diagram:
  Requirements → 10 Role Specs → Sprint Backlog → AI Execution → Shipping Code
- Each step animates with a green checkmark
- Green/blue accent colors
- Smooth transitions between steps

### Scene 4: Tech Stack (20-28s)
- Header: "Built With"
- Tech logos/badges appearing in a grid:
  - ${ts.frontend} (Frontend)
  - ${ts.backend} (Backend)
  - ${ts.database} (Database)
  - ${ts.language} (Language)
  - Docker (Containerization)
  - Vitest (Testing)
- Each badge scales in with a bounce effect
- Clean, modern card design

### Scene 5: Architecture (28-40s)
- Header: "Architecture"
- Animated architecture diagram:
  - Frontend box appears → arrow → Backend box appears → arrow → Database
  - Connection lines draw themselves
  - Data flow animations (dots moving along arrows)
- Clean, technical style with monospace labels

### Scene 6: Key Features (40-55s)
- Header: "Key Features"
- Feature cards sliding in:
  1. "10-Role Specification Model" - icon + description
  2. "Sprint-Based Execution" - icon + description
  3. "Multi-Agent Support" - icon + description
  4. "FinOps Optimization" - icon + description
  5. "Built-in QA Process" - icon + description
- Each card has a subtle glow effect

### Scene 7: Results/Metrics (55-65s)
- Header: "Proven Results"
- Counter animations (numbers counting up):
  - "263+ Tickets Executed"
  - "~45% Time Savings"
  - "~40% Cost Reduction"
  - "70%+ Test Coverage"
- Circular progress indicators
- Gold/yellow accent colors

### Scene 8: Call to Action (65-75s)
- Header: "Get Started Today"
- Terminal animation typing:
  \`npx autospec init\`
- GitHub stars badge
- URL: github.com/Hundia/autospec
- Gradient CTA button animation

### Scene 9: Closing (75-80s)
- "${options.projectName}" logo
- "Open Source | MIT License"
- Fade out

**Design Guidelines:**
- Dark theme (slate-900 background)
- Font: Inter for headings, JetBrains Mono for code
- Color palette:
  - Primary: #3B82F6 (blue)
  - Secondary: #A855F7 (purple)
  - Accent: #10B981 (green)
  - Warning: #F59E0B (yellow)
  - Error: #EF4444 (red)
- Smooth spring animations (Remotion's spring())
- Use interpolate() for scroll-based transitions
- AbsoluteFill for layered compositions
- Sequence components for scene timing

**Remotion Technical Setup:**

\`\`\`tsx
// Root.tsx
import { Composition } from 'remotion';
import { ExplainerVideo } from './ExplainerVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="${options.projectName.toLowerCase().replace(/\s+/g, '-')}-explainer"
      component={ExplainerVideo}
      durationInFrames={80 * 30}  // 80 seconds at 30fps
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        projectName: "${options.projectName}",
        techStack: ${JSON.stringify(ts, null, 8)},
      }}
    />
  );
};
\`\`\`

**Generate the following files:**
1. src/Root.tsx - Composition setup
2. src/ExplainerVideo.tsx - Main video component with Sequences
3. src/scenes/TitleScene.tsx
4. src/scenes/ProblemScene.tsx
5. src/scenes/SolutionScene.tsx
6. src/scenes/TechStackScene.tsx
7. src/scenes/ArchitectureScene.tsx
8. src/scenes/FeaturesScene.tsx
9. src/scenes/MetricsScene.tsx
10. src/scenes/CTAScene.tsx
11. src/scenes/ClosingScene.tsx
12. src/components/AnimatedText.tsx - Reusable text animation
13. src/components/FlowDiagram.tsx - Reusable flow diagram
14. src/components/Counter.tsx - Number counter animation
15. src/styles.ts - Shared style constants

**Render command:**
\`\`\`bash
npx remotion render src/index.ts ${options.projectName.toLowerCase().replace(/\s+/g, '-')}-explainer out/video.mp4
\`\`\`
\`\`\`

---

*Feed this prompt to Claude with Remotion knowledge to generate a complete video project.*
`;
}

/**
 * Generate testing-guide.md
 */
function generateTestingGuideDoc(options: DocsGeneratorOptions): string {
  return `# ${options.projectName} — Testing Guide

**Version:** 1.0
**Created:** ${getCurrentDate()}

---

## 1. Testing Strategy

### Test Pyramid

\`\`\`
              /\\
             /  \\
            / E2E\\           5-10 tests (critical paths)
           /──────\\
          /        \\
         / Integr.  \\        20-30 tests (API + DB)
        /────────────\\
       /              \\
      /    Unit Tests   \\     100+ tests (functions, components)
     /────────────────────\\
\`\`\`

### Coverage Targets

| Type | Target | Tool |
|------|--------|------|
| Unit | 80%+ | Vitest |
| Integration | Key APIs | Vitest + Supertest |
| E2E | Critical flows | Playwright |
| Overall | 70%+ | Combined |

---

## 2. Running Tests

\`\`\`bash
# Unit tests
cd api && npm test
cd web && npm test

# Watch mode
cd api && npm run test:watch

# Integration tests
cd api && npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm test -- --coverage

# Specific file
npm test -- auth.service.test.ts
\`\`\`

---

## 3. Writing Tests

### Backend Unit Test Example

\`\`\`typescript
import { describe, it, expect, vi } from 'vitest';
import { UserService } from '../services/user.service';

describe('UserService', () => {
  it('should create a user with hashed password', async () => {
    const mockRepo = {
      create: vi.fn().mockResolvedValue({ id: '1', email: 'test@test.com' }),
    };
    const service = new UserService(mockRepo);

    const result = await service.create({
      email: 'test@test.com',
      password: 'password123',
    });

    expect(result.email).toBe('test@test.com');
    expect(mockRepo.create).toHaveBeenCalledOnce();
  });
});
\`\`\`

### Frontend Component Test Example

\`\`\`typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from '../components/ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
\`\`\`

### Integration Test Example

\`\`\`typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../app';
import { db } from '../config/database';

describe('POST /api/v1/auth/register', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.destroy();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'new@test.com',
        password: 'password123',
        name: 'Test User',
      });

    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe('new@test.com');
    expect(res.body.data.token).toBeDefined();
  });
});
\`\`\`

---

## 4. Test Organization

\`\`\`
api/tests/
├── unit/
│   ├── services/
│   │   ├── auth.service.test.ts
│   │   └── user.service.test.ts
│   └── utils/
│       └── validators.test.ts
├── integration/
│   ├── auth.test.ts
│   └── users.test.ts
└── setup.ts

web/tests/
├── components/
│   ├── Button.test.tsx
│   └── LoginForm.test.tsx
├── pages/
│   └── Dashboard.test.tsx
└── setup.ts
\`\`\`

---

*Follow \`specs/05_qa_lead.md\` for complete testing strategy.*
`;
}

/**
 * Generate all documentation files
 */
export async function generateDocs(options: DocsGeneratorOptions): Promise<string[]> {
  const docsDir = options.outputDir;
  await ensureDir(docsDir);

  const docs = [
    { filename: 'architecture.md', content: generateArchitectureDoc(options) },
    { filename: 'workflows.md', content: generateWorkflowsDoc(options) },
    { filename: 'docker.md', content: generateDockerDoc(options) },
    { filename: 'environments.md', content: generateEnvironmentsDoc(options) },
    { filename: 'project-setup.md', content: generateProjectSetupDoc(options) },
    { filename: 'api-reference.md', content: generateApiReferenceDoc(options) },
    { filename: 'testing-guide.md', content: generateTestingGuideDoc(options) },
    { filename: 'gemini-diagram-prompts.md', content: generateGeminiDiagramPrompt(options) },
    { filename: 'remotion-video-prompt.md', content: generateRemotionPrompt(options) },
  ];

  const generatedFiles: string[] = [];

  for (const doc of docs) {
    const outputPath = path.join(docsDir, doc.filename);
    await writeFile(outputPath, doc.content);
    generatedFiles.push(outputPath);
  }

  return generatedFiles;
}
