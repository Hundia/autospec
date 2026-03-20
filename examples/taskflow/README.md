# TaskFlow

A task management application built with Express + React + PostgreSQL using the AutoSpec Spec-Driven Development (SDD) framework.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Express 4.x + TypeScript 5.x |
| Database | PostgreSQL 15+ with Drizzle ORM |
| Frontend | React 18 + Vite 5 + Tailwind CSS 3.x |
| State | Zustand 4.x |
| HTTP Client | Axios 1.x |
| Routing | React Router 6.x |
| Testing | Vitest + Testing Library + Supertest |

## Project Structure

```
taskflow/
├── api/                  # Express backend
│   ├── src/
│   │   ├── config/       # Database and env configuration
│   │   ├── db/           # Drizzle schema and migrations
│   │   ├── middleware/   # Error handling, auth, validation
│   │   ├── routes/       # Route definitions
│   │   ├── app.ts        # Express app setup
│   │   └── server.ts     # Server entry point
│   ├── tests/            # Backend tests
│   └── package.json
├── web/                  # React frontend
│   ├── src/
│   │   ├── components/   # UI components and layout
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API client
│   │   ├── App.tsx       # App root
│   │   └── main.tsx      # Entry point
│   ├── tests/            # Frontend tests
│   └── package.json
├── docker-compose.yml    # PostgreSQL service
└── .env.example          # Environment variable template
```

## Prerequisites

- Node.js 20.x LTS
- Docker and Docker Compose
- npm 9+

## Setup

### 1. Clone and configure environment

```bash
git clone <repository-url>
cd taskflow
cp .env.example .env
# Edit .env with your secrets
```

### 2. Start PostgreSQL

```bash
docker-compose up -d
```

### 3. Install dependencies

```bash
# Backend
cd api && npm install

# Frontend
cd ../web && npm install
```

### 4. Run database migrations

```bash
cd api && npx drizzle-kit push
```

### 5. Start development servers

```bash
# Backend (port 3000)
cd api && npm run dev

# Frontend (port 5173)
cd web && npm run dev
```

The frontend will be available at http://localhost:5173 and the API at http://localhost:3000.

## API

Base URL: `http://localhost:3000/api/v1`

### Health Check

```
GET /api/v1/health
Response: { "status": "ok", "timestamp": "2026-01-21T00:00:00.000Z" }
```

See [docs/api.md](docs/api.md) for full API documentation.

## Testing

```bash
# Backend tests
cd api && npx vitest run

# Frontend tests
cd web && npx vitest run

# Type check
cd api && npx tsc --noEmit
cd web && npx tsc --noEmit
```

## Architecture

See [docs/architecture.md](docs/architecture.md) for system design overview.
