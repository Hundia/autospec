# MealMap — Setup Guide

> **Sprint cross-reference:** Created in Sprint 0, completed in Sprint 2 (seed data added).
> **Related specs:** `specs/04_db_architect.md` (schema), `specs/02_backend_lead.md` (env vars)

---

## Prerequisites

| Tool | Minimum Version | Check |
|------|-----------------|-------|
| Node.js | 20 LTS | `node --version` |
| npm | 9+ | `npm --version` |
| Docker | 24+ | `docker --version` |
| Docker Compose | 2.x (Compose V2) | `docker compose version` |
| Git | 2.x | `git --version` |

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-org/mealmap.git
cd mealmap
```

Or if working within the AutoSpec examples directory:

```bash
cd /opt/FitnessAiManager/autospec/examples/mealmap
```

---

## 2. Configure Environment Variables

### Backend

```bash
cp api/.env.example api/.env
```

Edit `api/.env` with your values:

```env
# Database — matches docker-compose.yml service credentials
DATABASE_URL=postgresql://mealmap_user:mealmap_pass@localhost:5432/mealmap_db

# JWT secrets — generate secure random strings (min 32 chars)
JWT_ACCESS_SECRET=your-access-secret-minimum-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-minimum-32-characters-long

# Token expiry
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=4000
NODE_ENV=development

# Security
BCRYPT_ROUNDS=12
```

**Generate secure secrets:**
```bash
# Option 1: openssl
openssl rand -base64 48

# Option 2: Node
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

### Frontend

```bash
cp web/.env.example web/.env
```

```env
# Development: Vite proxies /api → http://localhost:4000/api
# No VITE_API_URL needed when using Vite proxy (default)
VITE_API_URL=http://localhost:4000/api
```

---

## 3. Start PostgreSQL Database

```bash
# From the mealmap root directory
docker compose up -d

# Verify it's running
docker compose ps
# Expected: mealmap-db   running   0.0.0.0:5432->5432/tcp

# Check PostgreSQL is accepting connections
docker compose logs db
# Expected: "database system is ready to accept connections"
```

### docker-compose.yml Services

```yaml
services:
  db:
    image: postgres:15-alpine
    container_name: mealmap-db
    environment:
      POSTGRES_USER: mealmap_user
      POSTGRES_PASSWORD: mealmap_pass
      POSTGRES_DB: mealmap_db
    ports:
      - "5432:5432"
    volumes:
      - mealmap_pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U mealmap_user -d mealmap_db"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  mealmap_pgdata:
```

---

## 4. Install Dependencies

```bash
# Backend
cd api && npm install

# Frontend
cd ../web && npm install

# Return to root
cd ..
```

---

## 5. Run Database Migrations

From the `api/` directory:

```bash
cd api

# Push the Drizzle schema to the database (development: no migration files)
npx drizzle-kit push

# Verify tables were created
docker exec -it mealmap-db psql -U mealmap_user -d mealmap_db -c "\dt"
```

Expected output — 6 tables listed:
```
             List of relations
 Schema |       Name        | Type  |    Owner
--------+-------------------+-------+-------------
 public | ingredients        | table | mealmap_user
 public | meal_plan_entries  | table | mealmap_user
 public | meal_plans         | table | mealmap_user
 public | recipe_ingredients | table | mealmap_user
 public | recipes            | table | mealmap_user
 public | users              | table | mealmap_user
```

---

## 6. Seed the Database (Optional)

Seed creates 2 demo users, 20 ingredients, 10 recipes, and a sample meal plan with entries:

```bash
cd api
npx ts-node scripts/seed.ts
```

**Demo Credentials (after seeding):**

| User | Email | Password | Role |
|------|-------|----------|------|
| Jamie Chen | jamie@mealmap.example | Password1 | Home cook — 8 recipes + active meal plan |
| Morgan Riley | morgan@mealmap.example | Password1 | Fitness enthusiast — 2 high-protein recipes |

---

## 7. Start the Backend API Server

```bash
cd api
npm run dev
```

Expected output:
```
[nodemon] starting `ts-node src/index.ts`
Server running on port 4000
Connected to PostgreSQL via Drizzle
```

### Verify the API

```bash
curl http://localhost:4000/api/health
```

Expected:
```json
{
  "status": "ok",
  "timestamp": "2026-03-14T10:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 8. Start the Frontend Dev Server

In a new terminal:

```bash
cd web
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

Open your browser at **http://localhost:5173**

---

## 9. Verify Full Stack

1. Navigate to `http://localhost:5173`
2. You should see the login page (redirected from `/`)
3. Click "Create account" and register with any email/password
4. After registration, you are redirected to `/recipes`
5. If seeded: log in as `jamie@mealmap.example` / `Password1` to see pre-populated recipes

---

## Running Tests

### Backend Unit + Integration Tests

```bash
cd api

# All tests
npx vitest run

# Watch mode (development)
npx vitest

# With coverage report
npx vitest run --coverage
```

**Important:** Integration tests require a separate test database. Set `DATABASE_URL` to a test DB in your test environment:

```bash
DATABASE_URL=postgresql://mealmap_user:mealmap_pass@localhost:5432/mealmap_test npx vitest run
```

Or create an `api/.env.test`:
```env
DATABASE_URL=postgresql://mealmap_user:mealmap_pass@localhost:5432/mealmap_test
```

Create the test database:
```bash
docker exec -it mealmap-db psql -U mealmap_user -c "CREATE DATABASE mealmap_test;"
cd api && DATABASE_URL=postgresql://mealmap_user:mealmap_pass@localhost:5432/mealmap_test npx drizzle-kit push
```

### Frontend Tests

```bash
cd web
npx vitest run
```

### E2E Tests (Playwright)

```bash
# From project root
npx playwright install  # First time only — installs browser binaries
npx playwright test

# With browser visible
npx playwright test --headed

# Specific file
npx playwright test e2e/recipes.spec.ts
```

---

## Common npm Scripts

### Backend (`api/`)

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `nodemon --exec ts-node src/index.ts` | Development with hot reload |
| `build` | `tsc` | Compile TypeScript to `dist/` |
| `start` | `node dist/index.js` | Run compiled production build |
| `test` | `vitest run` | Run all tests once |
| `test:watch` | `vitest` | Watch mode |
| `test:coverage` | `vitest run --coverage` | Coverage report |
| `typecheck` | `tsc --noEmit` | Type-check without emitting |
| `db:push` | `drizzle-kit push` | Sync schema to DB |
| `db:generate` | `drizzle-kit generate` | Generate migration SQL |
| `db:studio` | `drizzle-kit studio` | Open Drizzle Studio GUI |
| `seed` | `ts-node scripts/seed.ts` | Seed demo data |

### Frontend (`web/`)

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Preview production build locally |
| `test` | `vitest run` | Run component + util tests |
| `typecheck` | `tsc --noEmit` | Type-check without emitting |
| `lint` | `eslint src/` | Lint TypeScript/TSX files |

---

## Troubleshooting

### "Cannot connect to database"

1. Check Docker is running: `docker ps`
2. Check the container: `docker compose ps`
3. If container is not running: `docker compose up -d`
4. Verify credentials in `api/.env` match `docker-compose.yml` values
5. Try connecting directly: `docker exec -it mealmap-db psql -U mealmap_user -d mealmap_db`

### "Port 5432 already in use"

A local PostgreSQL installation is running on port 5432. Either:
- Stop it: `sudo systemctl stop postgresql` (Linux) or via System Preferences (macOS)
- Or change the mapped port in `docker-compose.yml`: `"5433:5432"` and update `DATABASE_URL` to use port 5433

### "Port 4000 already in use"

Change `PORT=4001` in `api/.env`. The Vite proxy in `web/vite.config.ts` must also be updated to point to port 4001.

### "Vite proxy not working" (API calls return 404)

Check `web/vite.config.ts` has the proxy configured:
```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
```

### "TypeScript errors on build"

```bash
cd api && npx tsc --noEmit   # Check backend type errors
cd web && npx tsc --noEmit   # Check frontend type errors
```

### Reset the database (destroy all data)

```bash
docker compose down -v          # Stop and remove volumes
docker compose up -d            # Restart with fresh database
cd api && npx drizzle-kit push  # Recreate schema
npx ts-node scripts/seed.ts     # Re-seed (optional)
```

---

## Production Build

### Backend

```bash
cd api
npm run build           # Compile to dist/
NODE_ENV=production node dist/index.js
```

### Frontend

```bash
cd web
npm run build           # Bundle to dist/
npm run preview         # Preview the production bundle locally
```

For deployment, serve the `web/dist/` directory from a static host (Nginx, Vercel, Netlify) and configure the API URL via environment variable.

---

*For API endpoint reference, see `docs/api.md`. For architecture decisions, see `docs/architecture.md`.*
