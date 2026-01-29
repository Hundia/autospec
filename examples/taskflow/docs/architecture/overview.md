# TaskFlow Architecture Overview

**Version:** 1.0
**Last Updated:** 2026-01-29

---

## 1. System Architecture

TaskFlow follows a three-tier architecture pattern with clear separation between presentation, business logic, and data layers.

### High-Level System Diagram

```
                                    TASKFLOW SYSTEM ARCHITECTURE

    ┌─────────────────────────────────────────────────────────────────────────────────┐
    │                                   CLIENTS                                        │
    │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                 │
    │  │  Web Browser    │  │  Mobile Browser │  │  Future: Apps   │                 │
    │  │  (React SPA)    │  │  (Responsive)   │  │  (iOS/Android)  │                 │
    │  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘                 │
    │           │                    │                    │                           │
    │           └────────────────────┴────────────────────┘                           │
    │                                │                                                │
    │                         HTTPS (TLS 1.3)                                         │
    │                                │                                                │
    └────────────────────────────────┼────────────────────────────────────────────────┘
                                     │
    ┌────────────────────────────────┼────────────────────────────────────────────────┐
    │                         API GATEWAY                                              │
    │                                │                                                │
    │  ┌─────────────────────────────▼─────────────────────────────────────────────┐  │
    │  │                        Express.js Server                                   │  │
    │  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
    │  │  │   Helmet     │  │    CORS      │  │ Rate Limiter │  │  Body Parser │  │  │
    │  │  │  (Security)  │  │  (Origins)   │  │ (DDoS Prot.) │  │   (JSON)     │  │  │
    │  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘  │  │
    │  └───────────────────────────────────────────────────────────────────────────┘  │
    │                                │                                                │
    └────────────────────────────────┼────────────────────────────────────────────────┘
                                     │
    ┌────────────────────────────────┼────────────────────────────────────────────────┐
    │                         APPLICATION LAYER                                        │
    │                                │                                                │
    │  ┌─────────────────────────────▼─────────────────────────────────────────────┐  │
    │  │                           Routes                                           │  │
    │  │  /api/v1/auth/*    /api/v1/tasks/*    /api/v1/projects/*    /health       │  │
    │  └─────────────────────────────┬─────────────────────────────────────────────┘  │
    │                                │                                                │
    │  ┌─────────────────────────────▼─────────────────────────────────────────────┐  │
    │  │                        Controllers                                         │  │
    │  │  AuthController         TaskController         ProjectController           │  │
    │  │  - register()           - list()               - list()                    │  │
    │  │  - login()              - create()             - create()                  │  │
    │  │  - logout()             - update()             - update()                  │  │
    │  │  - me()                 - delete()             - delete()                  │  │
    │  └─────────────────────────────┬─────────────────────────────────────────────┘  │
    │                                │                                                │
    │  ┌─────────────────────────────▼─────────────────────────────────────────────┐  │
    │  │                          Services                                          │  │
    │  │  AuthService            TaskService            ProjectService              │  │
    │  │  - validateCredentials  - createTask           - createProject             │  │
    │  │  - generateTokens       - updateTask           - getProjectStats           │  │
    │  │  - refreshToken         - toggleComplete       - archiveProject            │  │
    │  └─────────────────────────────┬─────────────────────────────────────────────┘  │
    │                                │                                                │
    │  ┌─────────────────────────────▼─────────────────────────────────────────────┐  │
    │  │                        Repositories                                        │  │
    │  │  UserRepository         TaskRepository         ProjectRepository           │  │
    │  │  - findByEmail          - findByUserId         - findByUserId              │  │
    │  │  - create               - create               - create                    │  │
    │  │  - update               - update               - update                    │  │
    │  └─────────────────────────────┬─────────────────────────────────────────────┘  │
    │                                │                                                │
    └────────────────────────────────┼────────────────────────────────────────────────┘
                                     │
    ┌────────────────────────────────┼────────────────────────────────────────────────┐
    │                           DATA LAYER                                             │
    │                                │                                                │
    │  ┌─────────────────────────────▼─────────────────────────────────────────────┐  │
    │  │                         Drizzle ORM                                        │  │
    │  │  - Type-safe queries    - Migration management    - Connection pooling     │  │
    │  └─────────────────────────────┬─────────────────────────────────────────────┘  │
    │                                │                                                │
    │  ┌─────────────────────────────▼─────────────────────────────────────────────┐  │
    │  │                        PostgreSQL 15+                                      │  │
    │  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐          │  │
    │  │  │   users    │  │   tasks    │  │  projects  │  │  tokens    │          │  │
    │  │  └────────────┘  └────────────┘  └────────────┘  └────────────┘          │  │
    │  └───────────────────────────────────────────────────────────────────────────┘  │
    │                                                                                 │
    └─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Tech Stack Summary

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend Framework | React | 18.x | UI component library |
| Frontend Build | Vite | 5.x | Fast development and bundling |
| Frontend Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 3.x | Utility-first CSS |
| State Management | Zustand | 4.x | Lightweight state management |
| Backend Runtime | Node.js | 20.x LTS | JavaScript runtime |
| Backend Framework | Express | 4.x | HTTP server framework |
| Database | PostgreSQL | 15+ | Relational database |
| ORM | Drizzle | 0.29+ | Type-safe database queries |
| Validation | Zod | 3.x | Schema validation |
| Testing | Vitest | 1.x | Unit and integration testing |
| E2E Testing | Playwright | Latest | End-to-end testing |

---

## 3. Request Lifecycle

A typical authenticated request flows through the system as follows:

```
1. CLIENT REQUEST
   │
   ▼
2. TLS TERMINATION (HTTPS)
   │
   ▼
3. MIDDLEWARE CHAIN
   ├── helmet() - Security headers
   ├── cors() - Origin validation
   ├── rateLimit() - Request throttling
   ├── express.json() - Body parsing
   └── authMiddleware() - JWT verification
   │
   ▼
4. ROUTER
   └── Match path to controller method
   │
   ▼
5. CONTROLLER
   ├── Validate request body with Zod
   ├── Extract user from req.user
   └── Call service method
   │
   ▼
6. SERVICE
   ├── Execute business logic
   ├── Call repository methods
   └── Handle errors
   │
   ▼
7. REPOSITORY
   ├── Build Drizzle query
   └── Execute against PostgreSQL
   │
   ▼
8. DATABASE
   └── Return query result
   │
   ▼
9. RESPONSE
   ├── Service transforms data
   ├── Controller formats response
   └── Express sends JSON
```

---

## 4. Non-Functional Requirements

| Requirement | Target | Measurement |
|-------------|--------|-------------|
| Page Load Time | < 2 seconds | Lighthouse FCP |
| API Response Time (P95) | < 300ms | APM metrics |
| API Response Time (P50) | < 100ms | APM metrics |
| Concurrent Users | 1000 | Load testing |
| Availability | 99.9% | Uptime monitoring |
| Test Coverage | > 70% | Coverage reports |

---

## 5. Key Architectural Decisions

### Decision 1: Drizzle ORM over Prisma

**Options Considered:**
- Prisma: Full-featured ORM with schema-first approach
- Drizzle: Lightweight, SQL-like syntax with better performance
- Raw SQL: Maximum control but no type safety

**Chosen:** Drizzle ORM

**Rationale:**
- Better TypeScript inference without code generation
- SQL-like syntax reduces learning curve
- Smaller bundle size and faster cold starts
- Better performance for complex queries

### Decision 2: Zustand over Redux

**Options Considered:**
- Redux Toolkit: Industry standard, powerful but verbose
- Zustand: Minimal boilerplate, intuitive API
- Context API: Built-in but limited for complex state

**Chosen:** Zustand

**Rationale:**
- TaskFlow has simple state requirements
- Zustand requires 80% less boilerplate than Redux
- Built-in devtools support
- No provider wrapper needed

### Decision 3: HTTP-only Cookies for JWT

**Options Considered:**
- localStorage: Simple but vulnerable to XSS
- HTTP-only cookies: Secure against XSS, requires CORS setup
- sessionStorage: Cleared on tab close

**Chosen:** HTTP-only Cookies

**Rationale:**
- Immune to XSS attacks (JavaScript cannot read cookies)
- Automatic inclusion in requests with credentials
- Server-side token rotation possible

---

## 6. Cross-References

- **Backend Details:** See `docs/architecture/backend.md`
- **Frontend Details:** See `docs/architecture/frontend.md`
- **Database Schema:** See `docs/architecture/database.md`
- **API Reference:** See `docs/api/reference.md`
- **Security Flow:** See `docs/flows/authentication-flow.md`

---

*This document is maintained by the Architecture team. Last updated: 2026-01-29*
