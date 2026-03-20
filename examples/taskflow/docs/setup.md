---
title: TaskFlow Setup Guide
sprint: Sprint 0
created: 2026-03-13
---

# TaskFlow Setup Guide

## Prerequisites

- **Node.js** 20.x LTS (`node --version` → v20.x.x)
- **npm** 9+ (`npm --version`)
- **Docker** and **Docker Compose** (`docker --version`)
- **Git** (`git --version`)

## 1. Clone the Repository

```bash
git clone <repository-url>
cd taskflow
```

## 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update the secrets:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://taskflow:taskflow_dev@localhost:5432/taskflow

# Generate strong secrets (at least 32 chars each)
JWT_SECRET=your-secret-key-min-32-characters-here
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=another-secret-key-min-32-characters-here
REFRESH_TOKEN_EXPIRES_IN=7d

ALLOWED_ORIGINS=http://localhost:5173
```

> For development, you can leave the database credentials as-is since they match the docker-compose defaults.

## 3. Start PostgreSQL

```bash
docker-compose up -d
```

Verify it's running:
```bash
docker-compose ps
# Should show: taskflow-postgres   Up   0.0.0.0:5432->5432/tcp
```

## 4. Install Dependencies

```bash
# Backend
cd api
npm install

# Frontend (in a new terminal or after backend)
cd ../web
npm install
```

## 5. Run Database Migrations

```bash
cd api
npx drizzle-kit push
```

This applies the schema to the running PostgreSQL instance.

## 6. Start Development Servers

### Backend (port 3000)

```bash
cd api
npm run dev
```

Verify: `curl http://localhost:3000/api/v1/health`
Expected: `{"data":{"status":"ok","timestamp":"..."}}`

### Frontend (port 5173)

In a new terminal:
```bash
cd web
npm run dev
```

Open http://localhost:5173 in your browser.

## Running Tests

### Backend Tests

```bash
cd api
npm test
# or with coverage
npm run test:coverage
```

### Frontend Tests

```bash
cd web
npm test
# or with coverage
npm run test:coverage
```

### Type Checking

```bash
# Backend
cd api && npx tsc --noEmit

# Frontend
cd web && npx tsc --noEmit
```

## Building for Production

### Frontend

```bash
cd web
npm run build
# Output: web/dist/
```

### Backend

```bash
cd api
npm run build
# Output: api/dist/
npm start
```

## Database Management

```bash
# Apply schema changes
cd api && npx drizzle-kit push

# Generate a new migration file
cd api && npx drizzle-kit generate

# Open Drizzle Studio (database GUI)
cd api && npx drizzle-kit studio
```

## Stopping Services

```bash
# Stop PostgreSQL
docker-compose down

# Stop with data removal (full reset)
docker-compose down -v
```

## Troubleshooting

### Port already in use

```bash
# Find what's using port 3000
lsof -i :3000
# Or on Windows
netstat -ano | findstr :3000
```

### Database connection error

1. Check PostgreSQL is running: `docker-compose ps`
2. Check `DATABASE_URL` in `.env` matches docker-compose credentials
3. Try: `docker-compose restart postgres`

### npm install fails

Make sure you're using Node.js 20.x:
```bash
node --version  # Should be v20.x.x
nvm use 20      # If using nvm
```
