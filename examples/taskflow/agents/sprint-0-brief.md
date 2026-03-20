# Sprint 0 Brief: Foundation & Setup

**Sprint:** 0
**Agent:** Sonnet
**Working Directory:** `examples/taskflow/`
**Date:** 2026-03-13

---

## Mission

Execute all 18 tickets in Sprint 0 to create a working full-stack project foundation. You must produce:

1. **Real working code** — Express backend + React frontend that compiles and runs
2. **Docker setup** — docker-compose.yml with PostgreSQL
3. **SDD artifacts** — updated backlog, docs, sprint summary

---

## Spec Files (READ THESE FIRST)

| File | What to extract |
|------|-----------------|
| `examples/taskflow/CLAUDE.md` | Project rules, structure, commands |
| `examples/taskflow/specs/02_backend_lead.md` | API structure (`api/src/`), Express patterns, Drizzle ORM config, env vars, error handling |
| `examples/taskflow/specs/03_frontend_lead.md` | React structure (`web/src/`), Tailwind colors, component specs, routing, Zustand stores |
| `examples/taskflow/specs/04_db_architect.md` | PostgreSQL schema (users, tasks, projects tables), Drizzle schema definition, indexes |
| `examples/taskflow/specs/05_qa_lead.md` | Vitest setup, test examples, coverage targets |
| `examples/taskflow/specs/backlog.md` | Ticket list — update status 🔲→✅ as you complete each |

---

## Tech Stack (from specs)

| Layer | Package | Version |
|-------|---------|---------|
| Runtime | Node.js | 20.x LTS |
| Backend framework | express | 4.x |
| Backend language | typescript | 5.x |
| Database | PostgreSQL | 15+ |
| ORM | drizzle-orm | 0.29+ |
| Drizzle kit | drizzle-kit | latest |
| DB driver | postgres (pg) | latest |
| Validation | zod | 3.x |
| Security | helmet, cors, bcryptjs | latest |
| Frontend framework | react | 18.x |
| Build tool | vite | 5.x |
| Styling | tailwindcss | 3.x |
| State management | zustand | 4.x |
| HTTP client | axios | 1.x |
| Routing | react-router-dom | 6.x |
| Testing | vitest | 1.x |
| API testing | supertest | latest |
| Component testing | @testing-library/react | latest |
| Linting | eslint | 8.x |
| Formatting | prettier | 3.x |

---

## Ticket Execution Plan

### Batch 1: Infrastructure (0.1-0.3)

**0.1 — Initialize git repo with .gitignore and README**
- Create `examples/taskflow/.gitignore` covering node_modules, dist, .env, coverage, etc.
- Create `examples/taskflow/README.md` with project description and setup instructions

**0.2 — Create docker-compose.yml for PostgreSQL**
- File: `examples/taskflow/docker-compose.yml`
- Service: `postgres` with image `postgres:15-alpine`
- Port: 5432
- Environment: `POSTGRES_USER=taskflow`, `POSTGRES_PASSWORD=taskflow_dev`, `POSTGRES_DB=taskflow`
- Volume: `taskflow_data:/var/lib/postgresql/data`

**0.3 — Create .env.example**
- File: `examples/taskflow/.env.example`
- Variables (from spec `02_backend_lead.md` section 10):
  ```
  NODE_ENV=development
  PORT=3000
  DATABASE_URL=postgresql://taskflow:taskflow_dev@localhost:5432/taskflow
  JWT_SECRET=your-secret-key-min-32-characters
  JWT_EXPIRES_IN=15m
  REFRESH_TOKEN_SECRET=another-secret-key-min-32-characters
  REFRESH_TOKEN_EXPIRES_IN=7d
  ALLOWED_ORIGINS=http://localhost:5173
  ```

### Batch 2: Backend Setup (0.4-0.8)

**0.4 — Initialize Express + TypeScript backend**
- Directory: `examples/taskflow/api/`
- `package.json` with dependencies: express, typescript, ts-node-dev, @types/express, @types/node, dotenv
- Entry point: `api/src/server.ts` (starts Express on PORT)
- App setup: `api/src/app.ts` (Express app with JSON parsing, CORS, helmet)

**0.5 — Configure TypeScript strict settings**
- File: `api/tsconfig.json`
- Strict mode enabled, target ES2022, module NodeNext, outDir dist, rootDir src
- Path aliases: `@/*` → `src/*`

**0.6 — Set up Drizzle ORM with PostgreSQL**
- Add deps: drizzle-orm, pg, @types/pg, drizzle-kit
- File: `api/src/config/database.ts` — create Drizzle instance from DATABASE_URL
- File: `api/src/config/env.ts` — Zod-validated env loader
- File: `api/src/db/schema.ts` — Drizzle schema for users table (from spec `04_db_architect.md` section 4):
  ```typescript
  export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  }, (table) => ({
    emailIdx: index('idx_users_email').on(table.email),
  }));
  ```
- File: `api/drizzle.config.ts` — Drizzle Kit config pointing to schema.ts

**0.7 — Create error handling middleware**
- File: `api/src/middleware/error.middleware.ts`
- AppError class (from spec `02_backend_lead.md` section 7):
  ```typescript
  export class AppError extends Error {
    constructor(
      public code: string,
      public message: string,
      public statusCode: number = 400,
      public details?: unknown
    ) { super(message); }
  }
  ```
- Error handler middleware that catches AppError and formats JSON response per spec format

**0.8 — Health check endpoint**
- File: `api/src/routes/health.routes.ts`
- `GET /health` → returns `{ status: 'ok', timestamp: ISO string }`
- Register in app.ts

### Batch 3: Frontend Setup (0.9-0.13)

**0.9 — Initialize React + Vite + TypeScript frontend**
- Directory: `examples/taskflow/web/`
- Create with Vite: `package.json` with react, react-dom, react-router-dom, typescript, @types/react, @types/react-dom
- Entry: `web/src/main.tsx`, `web/src/App.tsx`, `web/index.html`

**0.10 — Configure TypeScript and path aliases**
- File: `web/tsconfig.json` — strict mode, JSX react-jsx, paths `@/*` → `src/*`
- File: `web/vite.config.ts` — resolve alias `@` → `src`

**0.11 — Set up Tailwind CSS with design system colors**
- Add deps: tailwindcss, postcss, autoprefixer
- File: `web/tailwind.config.js` — extend colors from spec `03_frontend_lead.md` section 3:
  - primary: `#3B82F6`, primary-hover: `#2563EB`
  - background: `#FFFFFF`, surface: `#F9FAFB`
  - text: `#111827`, text-secondary: `#6B7280`
  - border: `#E5E7EB`
  - success: `#10B981`, warning: `#F59E0B`, error: `#EF4444`
- File: `web/postcss.config.js`
- File: `web/src/index.css` with Tailwind directives

**0.12 — Create API client with Axios**
- Add dep: axios
- File: `web/src/services/api.ts` — Axios instance with baseURL from VITE_API_URL, withCredentials, 401 interceptor (from spec `03_frontend_lead.md` section 7)

**0.13 — Create basic Layout component**
- File: `web/src/components/layout/Layout.tsx` — header with "TaskFlow" title, main content area with `<Outlet />`
- File: `web/src/components/layout/Header.tsx` — navigation header
- Wire up in App.tsx with React Router (from spec `03_frontend_lead.md` section 8)
- Create a simple Home page: `web/src/pages/Home.tsx` — welcome message

### Batch 4: Dev Tooling (0.14)

**0.14 — Configure ESLint and Prettier**
- Backend: `api/.eslintrc.cjs` + `api/.prettierrc`
- Frontend: `web/.eslintrc.cjs` + `web/.prettierrc`
- Both: TypeScript-aware ESLint, Prettier for formatting

### Batch 5: Testing (0.15-0.18)

**0.15 — Set up Vitest for backend**
- Add dev deps: vitest, supertest, @types/supertest
- File: `api/vitest.config.ts` — environment node, include `tests/**/*.test.ts`

**0.16 — Set up Vitest for frontend**
- Add dev deps: vitest, @testing-library/react, @testing-library/jest-dom, jsdom
- File: `web/vitest.config.ts` — environment jsdom, include `tests/**/*.test.ts`

**0.17 — Write first tests**
- Backend: `api/tests/health.test.ts` — test GET /health returns 200 with status ok
- Frontend: `web/tests/App.test.tsx` — test App component renders without crashing

**0.18 — Validate full stack**
- Ensure `npx tsc --noEmit` passes in both api/ and web/
- Ensure `npx vite build` succeeds in web/
- Ensure vitest runs in both

---

## SDD Artifacts to Produce

### 1. Update Backlog
- File: `examples/taskflow/specs/backlog.md`
- Change each ticket 0.1–0.18 from `🔲 Todo` to `✅ Done`

### 2. Create Documentation
- File: `examples/taskflow/docs/architecture.md` — system overview, tech stack, project structure
- File: `examples/taskflow/docs/setup.md` — how to clone, install, run (docker-compose up, npm install, npm run dev)
- File: `examples/taskflow/docs/api.md` — health endpoint documentation

### 3. Write Sprint Summary
- File: `examples/taskflow/sprints/sprint-0/summary.md`
- Follow template from `CLAUDE.md` Rule 4
- Include: completed tickets table, docs updated table, key files, QA results, retrospective

---

## Verification Checklist

Before finishing, verify:

- [ ] `api/package.json` exists with all dependencies
- [ ] `web/package.json` exists with all dependencies
- [ ] `docker-compose.yml` is valid YAML
- [ ] `api/src/app.ts` creates Express app with middleware
- [ ] `api/src/server.ts` starts server
- [ ] `api/src/db/schema.ts` has Drizzle users table
- [ ] `api/src/routes/health.routes.ts` has GET /health
- [ ] `api/src/middleware/error.middleware.ts` has AppError + handler
- [ ] `web/src/main.tsx` renders React app
- [ ] `web/src/App.tsx` has Router with Layout
- [ ] `web/tailwind.config.js` has design system colors
- [ ] `web/src/services/api.ts` has Axios client
- [ ] `web/src/components/layout/Layout.tsx` exists
- [ ] `api/vitest.config.ts` + `web/vitest.config.ts` exist
- [ ] `api/tests/health.test.ts` + `web/tests/App.test.tsx` exist
- [ ] `specs/backlog.md` has all 0.x tickets marked ✅
- [ ] `docs/architecture.md`, `docs/setup.md`, `docs/api.md` exist with real content
- [ ] `sprints/sprint-0/summary.md` follows template

---

## Important Notes

- All paths are relative to `examples/taskflow/`
- Do NOT install node_modules — just create package.json files with correct deps
- Do NOT run docker-compose — just create the YAML
- Focus on creating correct, compilable source files
- Use the exact patterns and code from the spec files
- The backend directory is `api/` (not `backend/` or `server/`)
- The frontend directory is `web/` (not `frontend/` or `client/`)
