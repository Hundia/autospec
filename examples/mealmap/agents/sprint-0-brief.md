# Sprint 0 Brief: Foundation & Setup

**Sprint:** 0
**Agent:** Sonnet
**Working Directory:** `examples/mealmap/`
**Date:** 2026-03-14

---

## Mission

Execute all Sprint 0 tickets from `specs/backlog.md` to create a working full-stack project foundation. You must produce:

1. **Real working code** — Express backend + React frontend that compiles
2. **Docker setup** — docker-compose.yml with PostgreSQL
3. **SDD artifacts** — updated backlog (🔲→✅), docs, sprint summary

---

## Spec Files (READ THESE FIRST)

| File | What to extract |
|------|-----------------|
| `examples/mealmap/CLAUDE.md` | Project rules, structure, commands |
| `examples/mealmap/specs/02_backend_lead.md` | API structure, Express patterns, Drizzle config, env vars |
| `examples/mealmap/specs/03_frontend_lead.md` | React structure, Tailwind config, component specs, routing |
| `examples/mealmap/specs/04_db_architect.md` | PostgreSQL schema (6 tables), Drizzle schema definition |
| `examples/mealmap/specs/backlog.md` | Ticket list — update status 🔲→✅ as you complete each |

---

## Tech Stack

| Layer | Package | Version |
|-------|---------|---------|
| Runtime | Node.js | 20.x LTS |
| Backend framework | express | 4.x |
| Backend language | typescript | 5.x |
| Database | PostgreSQL | 15+ |
| ORM | drizzle-orm | 0.29+ |
| Drizzle kit | drizzle-kit | latest |
| DB driver | postgres | latest |
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

---

## Ticket Execution Plan

### Batch 1: Infrastructure (0.1-0.2)

**0.1 — docker-compose.yml with PostgreSQL**
- File: `examples/mealmap/docker-compose.yml`
- Service: `postgres` with image `postgres:15-alpine`
- Port: 5432:5432
- Environment: `POSTGRES_USER=mealmap`, `POSTGRES_PASSWORD=mealmap_dev`, `POSTGRES_DB=mealmap`
- Volume: `mealmap_data:/var/lib/postgresql/data`
- Also add `.gitignore` covering node_modules, dist, .env, coverage

**0.2 — .env.example**
- File: `examples/mealmap/.env.example`
- Variables:
  ```
  NODE_ENV=development
  PORT=3001
  DATABASE_URL=postgresql://mealmap:mealmap_dev@localhost:5432/mealmap
  JWT_SECRET=your-secret-key-min-32-characters-here
  JWT_EXPIRES_IN=15m
  REFRESH_TOKEN_SECRET=another-secret-key-min-32-chars
  REFRESH_TOKEN_EXPIRES_IN=7d
  ALLOWED_ORIGINS=http://localhost:5173
  ```

### Batch 2: Backend Setup (0.3-0.6)

**0.3 — Initialize Express + TypeScript backend**
- Directory: `examples/mealmap/api/`
- `api/package.json`:
  ```json
  {
    "name": "mealmap-api",
    "version": "0.1.0",
    "scripts": {
      "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
      "build": "tsc",
      "start": "node dist/server.js"
    },
    "dependencies": {
      "express": "^4.18.2",
      "cors": "^2.8.5",
      "helmet": "^7.1.0",
      "dotenv": "^16.3.1",
      "drizzle-orm": "^0.29.0",
      "postgres": "^3.4.3",
      "zod": "^3.22.0",
      "bcryptjs": "^2.4.3",
      "jsonwebtoken": "^9.0.2",
      "uuid": "^9.0.0"
    },
    "devDependencies": {
      "typescript": "^5.3.0",
      "@types/express": "^4.17.21",
      "@types/node": "^20.10.0",
      "@types/cors": "^2.8.17",
      "@types/bcryptjs": "^2.4.6",
      "@types/jsonwebtoken": "^9.0.5",
      "@types/uuid": "^9.0.7",
      "ts-node-dev": "^2.0.0",
      "drizzle-kit": "^0.20.0",
      "vitest": "^1.0.0",
      "supertest": "^6.3.3",
      "@types/supertest": "^6.0.2"
    }
  }
  ```
- `api/tsconfig.json`: strict mode, target ES2022, module NodeNext, outDir dist, rootDir src
- `api/src/server.ts`: starts Express on PORT from env
- `api/src/app.ts`: Express app with JSON parsing, CORS, helmet, error handler

**0.4 — TypeScript strict config**
- File: `api/tsconfig.json`
- strict: true, target: ES2022, module: NodeNext, moduleResolution: NodeNext
- outDir: dist, rootDir: src
- esModuleInterop: true, resolveJsonModule: true, skipLibCheck: true

**0.5 — Drizzle ORM setup + schema**
- `api/src/db/index.ts`: database connection using postgres driver
- `api/src/db/schema.ts`: Drizzle schema for ALL 6 tables from SRS:
  - users (id uuid PK, email unique, password_hash, name, created_at, updated_at)
  - recipes (id uuid PK, user_id FK, title, description, instructions, prep_time_minutes, cook_time_minutes, servings, difficulty, image_url, tags text[], calories_per_serving, protein_grams, carbs_grams, fat_grams, is_deleted boolean, created_at, updated_at)
  - ingredients (id uuid PK, name unique, category, created_at)
  - recipe_ingredients (id uuid PK, recipe_id FK, ingredient_id FK, quantity decimal, unit, unique(recipe_id, ingredient_id))
  - meal_plans (id uuid PK, user_id FK, name, start_date, end_date, is_active boolean, created_at, updated_at)
  - meal_plan_entries (id uuid PK, meal_plan_id FK, recipe_id FK, date, meal_type, servings_override, unique(meal_plan_id, date, meal_type))
- `api/drizzle.config.ts`: drizzle-kit config pointing to schema and DATABASE_URL

**0.6 — Health check endpoint**
- `api/src/routes/health.ts`: GET /health returns `{ status: "ok", timestamp: ISO string }`
- Register route in app.ts

### Batch 3: Frontend Setup (0.7-0.8)

**0.7 — Initialize React + Vite + Tailwind frontend**
- Directory: `examples/mealmap/web/`
- Create with standard Vite React-TS template structure:
  - `web/package.json` with react, react-dom, react-router-dom, zustand, axios, tailwindcss, postcss, autoprefixer
  - `web/tsconfig.json` with strict mode
  - `web/vite.config.ts` with React plugin and API proxy to localhost:3001
  - `web/tailwind.config.js` with content paths
  - `web/postcss.config.js`
  - `web/index.html` with root div
  - `web/src/main.tsx` with React DOM render + BrowserRouter
  - `web/src/App.tsx` with routes skeleton (/, /login, /register, /recipes)
  - `web/src/index.css` with Tailwind directives

**0.8 — API client + auth store skeleton**
- `web/src/lib/api.ts`: Axios instance with baseURL `/api`, interceptors for JWT token
- `web/src/stores/authStore.ts`: Zustand store with user, token, login(), logout(), isAuthenticated
- `web/src/pages/HomePage.tsx`: simple landing page
- `web/src/pages/LoginPage.tsx`: login form skeleton
- `web/src/pages/RegisterPage.tsx`: register form skeleton
- `web/src/pages/RecipeListPage.tsx`: placeholder with "Recipes coming in Sprint 1"

### Batch 4: Documentation + Close (0.9-0.10)

**0.9 — Update docs**
- Update `examples/mealmap/docs/architecture.md`, `docs/api.md`, `docs/setup.md` if they exist, or create them if the generation agent hasn't run yet

**0.10 — Sprint 0 summary**
- Create `examples/mealmap/sprints/sprint-0/summary.md` following the template in CLAUDE.md
- Update `specs/backlog.md`: mark all Sprint 0 tickets ✅

---

## Verification Checklist

Before finishing, confirm:
- [ ] `api/package.json` exists with all dependencies
- [ ] `api/tsconfig.json` has strict: true
- [ ] `api/src/server.ts` exists and is valid TypeScript
- [ ] `api/src/db/schema.ts` defines all 6 tables
- [ ] `api/src/routes/health.ts` exists
- [ ] `web/package.json` exists with all dependencies
- [ ] `web/vite.config.ts` exists
- [ ] `web/src/main.tsx` exists
- [ ] `web/src/App.tsx` has route definitions
- [ ] `docker-compose.yml` exists
- [ ] `.env.example` exists
- [ ] All Sprint 0 tickets in backlog marked ✅
- [ ] `sprints/sprint-0/summary.md` exists

---

## Important Notes

- ALL files go under `examples/mealmap/` — never write outside this directory
- Use the EXACT table/column names from the SRS and specs
- TypeScript must be strict mode
- Express global prefix: no prefix needed (just /health, /auth/register, etc.)
- Frontend Vite dev server proxies /api to backend
