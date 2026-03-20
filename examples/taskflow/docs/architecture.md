---
title: TaskFlow Architecture
sprint: Sprint 0
created: 2026-03-13
---

# TaskFlow Architecture

## System Overview

TaskFlow is a full-stack task management application with a React frontend, Express backend, and PostgreSQL database. The system is designed around a REST API with a single-page application (SPA) frontend.

```
┌─────────────────────────────────────────────────────────────┐
│                        TaskFlow                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐        ┌──────────────┐                 │
│   │   Frontend   │◄──────►│   Backend    │                 │
│   │ React + Vite │  REST  │   Express    │                 │
│   │ Port: 5173   │  API   │  Port: 3000  │                 │
│   └──────────────┘        └──────┬───────┘                 │
│                                  │                          │
│                           ┌──────▼───────┐                 │
│                           │  PostgreSQL  │                 │
│                           │  Port: 5432  │                 │
│                           └──────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | React | 18.x | UI rendering |
| Frontend Build | Vite | 5.x | Build tool and dev server |
| Frontend Styling | Tailwind CSS | 3.x | Utility-first CSS |
| Frontend State | Zustand | 4.x | Client state management |
| Frontend HTTP | Axios | 1.x | API client with interceptors |
| Frontend Routing | React Router | 6.x | Client-side routing |
| Backend | Express | 4.x | HTTP server framework |
| Backend Language | TypeScript | 5.x | Type-safe JavaScript |
| Database | PostgreSQL | 15+ | Relational database |
| ORM | Drizzle ORM | 0.29+ | Type-safe query builder |
| Validation | Zod | 3.x | Runtime schema validation |
| Testing | Vitest | 1.x | Test runner (both FE and BE) |
| API Testing | Supertest | 6.x | HTTP integration tests |
| Component Testing | Testing Library | 14.x | React component tests |

## Project Structure

```
taskflow/
├── api/                         # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts      # Drizzle + pg Pool setup
│   │   │   └── env.ts           # Zod-validated env loader
│   │   ├── db/
│   │   │   └── schema.ts        # Drizzle ORM schema (users, tasks, projects)
│   │   ├── middleware/
│   │   │   └── error.middleware.ts  # AppError class + global handler
│   │   ├── routes/
│   │   │   ├── health.routes.ts # GET /api/v1/health
│   │   │   └── index.ts         # Route aggregator
│   │   ├── app.ts               # Express app with middleware
│   │   └── server.ts            # Server entry point
│   ├── tests/
│   │   └── health.test.ts       # Health endpoint tests
│   ├── drizzle.config.ts        # Drizzle Kit configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── vitest.config.ts
│
├── web/                         # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Header.tsx   # Navigation header
│   │   │       └── Layout.tsx   # Page layout with Outlet
│   │   ├── pages/
│   │   │   └── Home.tsx         # Landing/welcome page
│   │   ├── services/
│   │   │   └── api.ts           # Axios instance with 401 interceptor
│   │   ├── App.tsx              # Router setup
│   │   ├── main.tsx             # React entry point
│   │   └── index.css            # Tailwind directives + base styles
│   ├── tests/
│   │   ├── setup.ts             # @testing-library/jest-dom setup
│   │   └── App.test.tsx         # Component tests
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vitest.config.ts
│
├── docker-compose.yml           # PostgreSQL dev service
├── .env.example                 # Environment variable template
├── .gitignore
└── README.md
```

## Backend Architecture

The Express backend follows a layered architecture:

```
Routes → Controllers → Services → Repositories → Database
```

- **Routes**: Define endpoints and wire middleware
- **Controllers**: Handle HTTP req/res, delegate to services
- **Services**: Business logic, validation
- **Repositories**: Database access via Drizzle ORM
- **Middleware**: Error handling, auth, validation

### API Design

- Base URL: `/api/v1`
- All responses follow a consistent envelope format
- Errors use standard error codes (see [api.md](./api.md))

### Database Schema

Three main tables (defined in Drizzle ORM):
- `users` — authentication and user data
- `tasks` — core task management
- `projects` — task grouping (Sprint 1+)

See [database.md](./database.md) for full schema details.

## Frontend Architecture

The React frontend uses a standard SPA pattern:

- **React Router** for client-side routing
- **Zustand** stores for global state (auth, tasks)
- **Axios** for API calls with automatic credential handling
- **Tailwind CSS** for styling with a custom design system

### Design System Colors

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#3B82F6` | Buttons, links, focus rings |
| `primary-hover` | `#2563EB` | Hover states |
| `background` | `#FFFFFF` | Page background |
| `surface` | `#F9FAFB` | Cards, panels |
| `text` | `#111827` | Primary text |
| `text-secondary` | `#6B7280` | Secondary text |
| `border` | `#E5E7EB` | Borders, dividers |
| `success` | `#10B981` | Success states |
| `warning` | `#F59E0B` | Warning states |
| `error` | `#EF4444` | Error states |

## Key Design Decisions

1. **Drizzle ORM** over Prisma — lighter weight, better TypeScript inference, no code generation step
2. **Zustand** over Redux — minimal boilerplate for the scale of this app
3. **Vitest** for both FE and BE — unified test runner, fast, native ESM support
4. **Zod** for validation on both sides — runtime safety + TypeScript type inference
5. **HTTP-only cookies** for JWT tokens — XSS protection (Sprint 1)
