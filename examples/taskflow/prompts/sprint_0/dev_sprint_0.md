# Sprint 0 Development Execution: Foundation & Setup

## Environment: claude-code

---

## Context - Read These Files First

**MANDATORY:** Read ALL these files before writing any code:

### Specs (Read ALL):
- `specs/01_product_manager.md` - Requirements, personas, user flows
- `specs/02_backend_lead.md` - API design, service layer, error handling
- `specs/03_frontend_lead.md` - Components, state, routing, design tokens
- `specs/04_db_architect.md` - Database schema, migrations, queries
- `specs/05_qa_lead.md` - Test strategy, coverage targets
- `specs/backlog.md` - Sprint 0 tickets (your work items)

### Docs (Read ALL relevant):
- `docs/architecture/overview.md` - System architecture
- `docs/architecture/backend.md` - Backend layer design
- `docs/architecture/frontend.md` - Frontend component architecture
- `docs/architecture/database.md` - ERD, tables, relationships

---

## Your Mission

Execute Sprint 0: Foundation & Setup

**Goal:** Set up project infrastructure and development environment so that:
- Database runs via Docker
- Backend serves health endpoint
- Frontend displays welcome page
- All tests pass

---

## Tickets to Complete

| # | Ticket | Owner | Model | Points |
|---|--------|-------|-------|--------|
| 0.1 | Initialize git repository with .gitignore and README | DevOps | haiku | 1 |
| 0.2 | Create docker-compose.yml for PostgreSQL | DevOps | sonnet | 2 |
| 0.3 | Create .env.example with all required variables | DevOps | haiku | 1 |
| 0.4 | Initialize backend project (Express + TypeScript) | Backend | sonnet | 3 |
| 0.5 | Configure backend TypeScript with strict settings | Backend | haiku | 1 |
| 0.6 | Set up Drizzle ORM with PostgreSQL connection | Backend | sonnet | 3 |
| 0.7 | Create base error handling middleware | Backend | sonnet | 2 |
| 0.8 | Implement health check endpoint (GET /health) | Backend | haiku | 1 |
| 0.9 | Initialize frontend project (React + Vite + TypeScript) | Frontend | sonnet | 3 |
| 0.10 | Configure frontend TypeScript and path aliases | Frontend | haiku | 1 |
| 0.11 | Set up Tailwind CSS with design system colors | Frontend | sonnet | 2 |
| 0.12 | Create API client with Axios | Frontend | haiku | 1 |
| 0.13 | Create basic Layout component | Frontend | haiku | 1 |
| 0.14 | Configure ESLint and Prettier for both projects | DevOps | haiku | 1 |
| 0.15 | Set up Vitest for backend testing | QA | sonnet | 2 |
| 0.16 | Set up Vitest for frontend testing | QA | sonnet | 2 |
| 0.17 | Write first tests (health check, component render) | QA | haiku | 1 |
| 0.18 | Validate full stack runs locally | QA | sonnet | 2 |

---

## Execution Instructions

### For Each Ticket:

1. **Read Relevant Spec:** Find the specific section in the appropriate spec file
2. **Implement:** Write code following patterns in docs/
3. **Verify:** Run `npm run lint`, `npm run typecheck` if applicable
4. **Commit:** `git commit -m "Complete 0.X: [ticket description]"`

---

## Ticket-by-Ticket Implementation Guide

### Ticket 0.1: Initialize Git Repository
**Owner:** DevOps | **Model:** haiku | **Points:** 1

**Spec Reference:** `specs/backlog.md`

**Implementation Steps:**
1. Create root project directory
2. Initialize git repository
3. Create comprehensive .gitignore
4. Create README.md with project overview

**Files to Create:**
- `.gitignore` - Node, TypeScript, IDE, OS ignores
- `README.md` - Project setup instructions

**.gitignore content:**
```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.next/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/
.nyc_output/

# Database
*.db
*.sqlite
```

**Verification:**
```bash
git status
```

---

### Ticket 0.2: Create Docker Compose for PostgreSQL
**Owner:** DevOps | **Model:** sonnet | **Points:** 2

**Spec Reference:** `specs/04_db_architect.md`, Section 1

**Implementation Steps:**
1. Create docker-compose.yml at project root
2. Configure PostgreSQL 15 service
3. Configure volume for data persistence
4. Set up health check

**Files to Create:**
- `docker-compose.yml`

**docker-compose.yml content:**
```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    container_name: taskflow-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: taskflow
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

**Verification:**
```bash
docker-compose up -d
docker-compose ps
```

---

### Ticket 0.3: Create Environment Variables Template
**Owner:** DevOps | **Model:** haiku | **Points:** 1

**Spec Reference:** `specs/02_backend_lead.md`, Section 10

**Files to Create:**
- `.env.example`

**.env.example content:**
```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow

# JWT
JWT_SECRET=your-super-secret-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=another-super-secret-key-change-in-production
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173

# Frontend
VITE_API_URL=http://localhost:3000/api/v1
```

**Verification:**
```bash
cat .env.example
```

---

### Ticket 0.4: Initialize Backend Project
**Owner:** Backend | **Model:** sonnet | **Points:** 3

**Spec Reference:** `specs/02_backend_lead.md`, Section 2

**Implementation Steps:**
1. Create api/ directory
2. Initialize npm project
3. Install dependencies
4. Create basic directory structure
5. Create entry files

**Commands:**
```bash
mkdir -p api/src/{config,controllers,services,repositories,routes,schemas,middleware,db,types,utils}
cd api
npm init -y
npm install express cors helmet dotenv zod
npm install -D typescript @types/node @types/express ts-node-dev
```

**Files to Create:**
- `api/package.json` (update scripts)
- `api/src/app.ts`
- `api/src/server.ts`

**api/src/app.ts:**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173',
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10kb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
```

**api/src/server.ts:**
```typescript
import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

### Ticket 0.5: Configure Backend TypeScript
**Owner:** Backend | **Model:** haiku | **Points:** 1

**Spec Reference:** `specs/02_backend_lead.md`

**Files to Create:**
- `api/tsconfig.json`

**api/tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

### Ticket 0.6: Set Up Drizzle ORM
**Owner:** Backend | **Model:** sonnet | **Points:** 3

**Spec Reference:** `specs/04_db_architect.md`, Section 4

**Commands:**
```bash
cd api
npm install drizzle-orm pg
npm install -D drizzle-kit @types/pg
```

**Files to Create:**
- `api/src/config/database.ts`
- `api/src/config/env.ts`
- `api/src/db/schema.ts`
- `api/drizzle.config.ts`

**api/src/config/env.ts:**
```typescript
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().min(32),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
});

export const env = envSchema.parse(process.env);
```

---

### Tickets 0.7-0.18: Continue with remaining tickets

Follow the same pattern for each remaining ticket:
1. Reference the appropriate spec section
2. Create the necessary files
3. Verify with the specified commands
4. Commit with proper message

---

## After All Tickets Complete

1. Run full verification:
```bash
# Check lint
npm run lint

# Check types
npm run typecheck

# Run tests
npm test

# Start full stack
docker-compose up -d
cd api && npm run dev &
cd web && npm run dev &

# Test health endpoint
curl http://localhost:3000/health
```

2. Commit all changes:
```bash
git add -A
git commit -m "Complete Sprint 0: Foundation & Setup"
```

3. Proceed to QA: Run `prompts/sprint_0/qa_sprint_0.md`

---

*Sprint 0 Development Execution - TaskFlow*
