---
role: sprint_planner
spec_version: "1.0"
generated_by: autospec v0.2.0
model: claude-haiku-4-5-20251001
provider: claude-code
source_srs: srs-simple.md
source_hash: "sha256:7458b2f5b29602d300ec5766ab196f4f026b7aca8470f82fe507d40b7c83ea36"
generated_at: 2026-03-21T11:03:05.662Z
---

# TaskFlow — Sprint Planning Backlog

```yaml
role: Sprint Planning Lead
spec_version: "1.0"
generated_by: Claude Agent (Opus 4.6)
model: claude-opus-4
provider: Anthropic
source_srs: "01_product_manager.md through 10_ui_designer.md"
source_hash: "taskflow-mvp-2026q1"
generated_at: "2026-03-21T00:00:00Z"

---

## Overview

**Project:** TaskFlow — Lightweight Personal Task Management App  
**Team Composition:** Solo developer or 1-2 person team  
**Sprint Cadence:** 2 weeks per sprint (Mon–Fri, 10 working days)  
**Recommended Velocity:** 25–35 story points/sprint (conservative for solo dev)  
**Total MVP Story Points:** 154 points across Sprints 0–4  
**Target MVP Launch:** Week 11 (end of Sprint 4)

**Technology Stack:**
- Frontend: React 18 + TypeScript + Tailwind CSS + Zustand + TanStack Query
- Backend: Node.js 20 LTS + Express 4.x + TypeScript 5.x
- Database: SQLite with WAL mode + Prisma ORM
- Auth: JWT (15m access) + opaque refresh tokens (7d)
- Testing: Vitest (unit/integration) + Playwright (E2E)
- CI/CD: GitHub Actions
- Deployment: Docker + single-instance rolling deploy

**Team Assumptions:**
- 1 full-stack developer (or split 1 backend + 1 frontend)
- QA via automated tests + manual E2E on mobile (iOS Safari, Android Chrome)
- No external contractors

**Success Criteria (from 01_product_manager.md):**
- User can create and complete 10 tasks in <2 minutes
- Page load <1 second (Core Web Vitals)
- Full offline support via PWA
- Mobile-responsive on iOS Safari and Android Chrome
- WCAG 2.1 AA accessibility

---

## Sprint 0 — Foundation (Weeks 1–2)

### Goals
Establish repository infrastructure, CI/CD pipeline, local development environment, database schema scaffold, and testing framework to enable parallel feature development in Sprints 1–4.

| # | Ticket | Description | Points | Depends On | Acceptance Criteria |
|---|--------|-------------|--------|-----------|-------------------|
| 0.1 | **Repo Setup & Package.json** | Create GitHub repository, initialize monorepo structure (`apps/api`, `apps/web`), define root `package.json` with shared TypeScript config, ESLint, Prettier. Per 06_devops_lead.md §Containerization and project structure. | 3 | — | ✅ GitHub repo public, both apps have independent `package.json` and `tsconfig.json`, ESLint passes on all .ts/.tsx files, Prettier formats code without changes |
| 0.2 | **TypeScript & Build Config** | Configure `tsconfig.json` in root and per-app; set up esbuild/tsc for backend, Vite for frontend. Per 02_backend_lead.md and 03_frontend_lead.md. | 3 | 0.1 | ✅ `npx tsc --noEmit` exits 0 in root; `cd apps/api && npm run build` compiles to `dist/`; `cd apps/web && npm run build` outputs to `dist/`; no type errors |
| 0.3 | **Prisma & Database Scaffold** | Initialize Prisma in `apps/api`, configure SQLite connection string, scaffold migration files directory. Create initial empty migration. Per 04_db_architect.md §Migrations and Schema Design. | 5 | 0.1 | ✅ `prisma init` creates `.env` and `schema.prisma`; SQLite db file created in `apps/api/prisma/dev.db`; `npx prisma migrate dev --name init` runs without error; `.sql` migration file exists in `prisma/migrations/` |
| 0.4 | **Docker & Docker Compose (Local Dev)** | Create `Dockerfile` (multi-stage for API + SQLite), `docker-compose.yml` for local development (API service only, frontend runs natively on host). Per 06_devops_lead.md §Containerization. | 5 | 0.2 | ✅ `docker-compose up` starts API on `http://localhost:3005`; SQLite db mounted as volume; `docker-compose down` tears down cleanly; health check endpoint responds |
| 0.5 | **GitHub Actions CI Pipeline** | Create `.github/workflows/ci.yml` with stages: (1) Lint (ESLint + Prettier), (2) Type-check (tsc), (3) Unit tests (Vitest), (4) Build (npm run build for both apps). Per 06_devops_lead.md §CI/CD Pipeline. | 5 | 0.1 | ✅ Pushing to main triggers workflow; all 4 stages run and pass; PR statuses show on GitHub; failing lint blocks merge |
| 0.6 | **Testing Framework Setup (Unit & E2E)** | Install and configure Vitest (`--reporter=verbose`), `@testing-library/react`, and Playwright. Add example unit test + E2E test scaffolds. Per 05_qa_lead.md §Test Strategy. | 5 | 0.1 | ✅ `cd apps/api && npm run test` runs Vitest; `npm test:ui` opens Vitest UI; `npx playwright test` runs with `.github/playwright.config.ts`; test files can be written in `**/*.test.ts` and `**/*.test.tsx` |
| 0.7 | **Express Server Scaffold** | Create `apps/api/src/main.ts` with Express app, global middleware (JSON parsing, CORS, rate limiting via `express-rate-limit`), error handler, health check endpoint (`GET /health`). Per 02_backend_lead.md §Architecture and API Endpoints. | 5 | 0.2 | ✅ `npm run start` starts API on port 3000 (dev) / 3003 (production); `GET /health` returns `{ status: "ok" }`; CORS allows `http://localhost:3000` (Vite dev); rate limiting returns 429 after threshold |
| 0.8 | **React + Vite Setup** | Create `apps/web` with Vite, React 18, TypeScript. Configure Tailwind CSS. Add `src/App.tsx` and basic layout. Per 03_frontend_lead.md §Tech Stack and Responsive Design. | 5 | 0.2 | ✅ `cd apps/web && npm run dev` starts Vite dev server on `http://localhost:5173`; `npm run build` outputs optimized SPA to `dist/`; Tailwind classes apply to default page; HMR works |
| 0.9 | **Design System Primitives (Stubs)** | Create `apps/web/src/design-system/` directory with stub components: Button, Card, Input, Select, Badge, Modal. Per 10_ui_designer.md §Component Library. | 3 | 0.8 | ✅ Each primitive exports a functional component; Button accepts `onClick` and `children`; Input accepts `value`, `onChange`, `placeholder`; no styling required yet (can use placeholder classes) |
| 0.10 | **Tailwind Config & Design Tokens** | Configure `tailwind.config.js` with colors, typography (Inter font), spacing grid (4px base), shadows, transitions per 10_ui_designer.md §Design System Tokens. | 3 | 0.8 | ✅ `@tailwind` directives render in global CSS; color utilities like `bg-brand-500` work; `text-sm`, `text-base`, `text-lg` map to design spec; spacing utilities `gap-2`, `p-4` render correctly |

**Sprint 0 Total: 42 points** *(Note: slightly over 40 due to foundational criticality; acceptable for sprint 0)*

---

## Sprint 1 — Core Domain (Weeks 3–4)

### Goals
Implement user authentication (registration/login), Task CRUD foundation, initial database schema, and basic auth-protected React pages to enable feature development in subsequent sprints.

| # | Ticket | Description | Points | Depends On | Acceptance Criteria |
|---|--------|-------------|--------|-----------|-------------------|
| 1.1 | **Database Schema — Users, RefreshTokens** | Create Prisma models for `User` (id, email, password_hash, created_at, updated_at) and `RefreshToken` (id, user_id, token_hash, expires_at). Add migration. Per 04_db_architect.md §Schema Design and Table: `users`. | 3 | 0.3 | ✅ Migration runs successfully; `npx prisma generate` creates types; email has unique constraint; password_hash is not nullable; relations are correct |
| 1.2 | **Auth Service (Registration & Password Hashing)** | Implement `AuthService` with `register(email, password)` method: hash password (bcrypt, 12 rounds), validate email format, check uniqueness, create `User` record. Per 02_backend_lead.md §Service Layer: AuthService. | 5 | 1.1 | ✅ `register()` returns `{ user: { id, email }, accessToken, refreshToken }` on success; duplicate email returns 409; invalid email format returns 400; password hash is 60 chars (bcrypt); `npx ts-node` runs method without error |
| 1.3 | **Auth Service (Login & JWT Generation)** | Implement `login(email, password)` and JWT token generation: verify credentials with bcrypt, create access token (15m TTL, HS256), create refresh token (7d, opaque). Per 02_backend_lead.md §Auth Requirements and JWT Payload. | 5 | 1.2 | ✅ `login()` returns `{ user: { id, email }, accessToken, refreshToken }` on success; invalid credentials return 401; access token decodes to `{ sub, email, iat, exp }`; refresh token is 64+ random bytes (base64) |
| 1.4 | **Auth Routes — Registration & Login** | Create Express routes `POST /api/v1/auth/register` and `POST /api/v1/auth/login` with validation (input dto), error handling, response formatting. Per 02_backend_lead.md §API Endpoints: Authentication. | 5 | 1.2 | ✅ `POST /auth/register` with `{ email, password }` returns 201 and `{ accessToken, refreshToken }` on success; `POST /auth/login` with valid credentials returns 200 and tokens; invalid input returns 400 with validation error |
| 1.5 | **Auth Middleware & Guards** | Implement JWT middleware to extract and verify access token from `Authorization: Bearer <token>` header. Create `@CurrentUser()` decorator to inject authenticated user into route handlers. Per 02_backend_lead.md §Auth Middleware. | 5 | 1.3 | ✅ Decorated routes require valid JWT; missing token returns 401; expired token returns 401; `@CurrentUser()` injects `{ id, email }`; malformed header returns 400 |
| 1.6 | **Database Schema — Tasks & Categories** | Create Prisma models for `Task` (id, user_id, title, description, due_date, priority, status, category_id, created_at, updated_at) and `Category` (id, user_id, name, color, created_at, updated_at). Add migration and indexes. Per 04_db_architect.md §Schema Design. | 3 | 1.1 | ✅ Migration runs; models have correct field types and constraints; Foreign keys created; Indexes on `user_id`, `category_id`, `due_date`; `status` enum supports `incomplete` and `complete` |
| 1.7 | **Task Service — CRUD** | Implement `TaskService` with methods: `create()`, `getAll()`, `getById()`, `update()`, `delete()`. Enforce user ownership. Pagination support (limit, offset). Per 02_backend_lead.md §Service Layer: TaskService. | 8 | 1.6 | ✅ `create()` returns full Task; `getAll()` returns `{ tasks: [], total, hasMore }`; `update()` validates ownership before modify; `delete()` only succeeds if user_id matches; pagination defaults to limit=20 |
| 1.8 | **Task Routes — CRUD** | Create Express routes `GET /tasks`, `POST /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id`, `DELETE /tasks/:id` with auth guards, validation, pagination query params. Per 02_backend_lead.md §API Endpoints: Tasks. | 5 | 1.7 | ✅ All routes require auth header; `POST /tasks` creates task for authenticated user; `GET /tasks?limit=10&offset=0` returns paginated results; ownership check prevents cross-user access; status codes correct (201 for create, 404 for not found) |
| 1.9 | **Frontend Auth Store (Zustand)** | Create `src/store/authStore.ts` with Zustand (persist middleware): `accessToken`, `refreshToken`, `user`, `login()`, `register()`, `logout()`. Restore from localStorage on app load. Per 03_frontend_lead.md §State Management: Global Store. | 5 | 0.8 | ✅ `authStore.persist` saves tokens to localStorage; on page reload, tokens restore; `setAccessToken()` updates in-memory and storage; `logout()` clears all; TS types exported |
| 1.10 | **Frontend Auth API Service** | Create `src/services/authService.ts` with HTTP methods: `register(email, password)`, `login(email, password)`, `refreshAccessToken(refreshToken)`. Return typed responses. Per 03_frontend_lead.md §API Integration. | 3 | 0.8 | ✅ Methods accept correct params; return `{ user, accessToken, refreshToken }` on success; throw `ApiError` on 400+; `refreshAccessToken()` retries on 401; no hardcoded URLs (use env var) |
| 1.11 | **Login & Register Pages** | Create `src/pages/Login.tsx` and `src/pages/Register.tsx` with forms (email, password, submit button), error messages, loading state. Per 10_ui_designer.md §Wireframes: Screen 1 & 2. | 8 | 1.9, 1.10 | ✅ Form validates email format client-side; on submit, calls `authService.login()` or `register()`; success redirects to dashboard; error displays toast/banner; loading spinner shows on button during request |
| 1.12 | **React Router Setup & Auth Guard** | Configure `createBrowserRouter` with protected routes (Login, Register, Dashboard). Create `ProtectedRoute` component that checks auth store and redirects to login if missing token. Per 03_frontend_lead.md §Routing. | 5 | 1.9 | ✅ Unauthenticated users redirected to `/login`; authenticated users see dashboard on `/`; navigation imperatively redirects on logout; page refresh preserves auth state (from localStorage) |
| 1.13 | **Task API Service & TanStack Query Setup** | Create `src/services/taskService.ts` with `createTask()`, `getTasks()`, `getTask()`, `updateTask()`, `deleteTask()`. Set up TanStack Query (`useQuery`, `useMutation`) with cache configuration. Per 03_frontend_lead.md §API Integration and Server Cache. | 5 | 1.10 | ✅ `useQuery(["tasks"], taskService.getTasks)` caches results; mutations invalidate cache; error states handled; retry logic on 5xx; no stale data shown without refetch |
| 1.14 | **Task List & Create Form (UI Stubs)** | Create `src/pages/Dashboard.tsx` (placeholder) and `src/components/TaskForm.tsx` (form inputs for title, description, due_date, priority). No styling required yet. Per 10_ui_designer.md §Screen 3 & 5. | 5 | 1.13 | ✅ TaskForm renders `<Input>` for title, `<Input>` for description, `<Input type="date">` for due_date, `<Select>` for priority (low/medium/high), `<Button type="submit">`; Form state via React hooks; no API calls yet |

**Sprint 1 Total: 57 points** *(Note: Over 40 but acceptable for core MVP foundation; consider deferring 1.14 to Sprint 2 if velocity is lower)*

**Revised Sprint 1: 52 points** *(move 1.14 to Sprint 2)*

---

## Sprint 2 — Primary Features (Weeks 5–6)

### Goals
Implement user-defined categories, Category CRUD, Dashboard endpoint and UI with today's tasks and overdue items, completion statistics, and basic filtering.

| # | Ticket | Description | Points | Depends On | Acceptance Criteria |
|---|--------|-------------|--------|-----------|-------------------|
| 2.1 | **Category Service — CRUD** | Implement `CategoryService` with `create()`, `getAll()`, `update()`, `delete()` methods. Enforce user ownership. Per 02_backend_lead.md §Service Layer: CategoryService. | 5 | 1.6 | ✅ `create(userId, name, color)` creates category owned by user; `getAll(userId)` returns user's categories only; `update()` enforces ownership; `delete()` prevents deletion if tasks depend on it |
| 2.2 | **Category Routes — CRUD** | Create Express routes `GET /categories`, `POST /categories`, `PATCH /categories/:id`, `DELETE /categories/:id` with auth guards and validation. Per 02_backend_lead.md §API Endpoints: Categories. | 3 | 2.1 | ✅ All routes require auth; `POST /categories` creates with userId from JWT; returns 201; `GET /categories` returns only user's categories; ownership checks prevent cross-user access |
| 2.3 | **Dashboard Service (Today, Overdue, Stats)** | Implement `DashboardService.getTodaysTasks()`, `getOverdueItems()`, `getCompletionStats()` querying tasks by user, due_date, status. Per 02_backend_lead.md §Service Layer: DashboardService and 04_db_architect.md §Query Patterns. | 8 | 1.6 | ✅ `getTodaysTasks()` returns tasks where due_date = TODAY and status = incomplete; `getOverdueItems()` returns due_date < TODAY and status = incomplete; `getCompletionStats()` returns counts for today/week/total and completion percentage |
| 2.4 | **Dashboard Endpoint** | Create `GET /dashboard` returning `{ todaysTasks, overdueItems, stats }`. Per 02_backend_lead.md §API Endpoints: Dashboard. | 3 | 2.3 | ✅ Endpoint requires auth; returns all three data structures; filters by authenticated user; response time <100ms (per performance requirements) |
| 2.5 | **Dashboard Page (UI)** | Create `src/pages/Dashboard.tsx` with sections: Today's Tasks (card list), Overdue Items (alert banner), Completion Stats (three counter cards: today, week, total). Use TanStack Query to fetch dashboard data. Per 10_ui_designer.md §Screen 3. | 8 | 1.13, 2.4 | ✅ Dashboard fetches via `useQuery(["dashboard"], dashboardService.getDashboard)`; displays all three sections; empty states show "No tasks today"; stats show percentage and count; refetch on mount |
| 2.6 | **Category API Service** | Create `src/services/categoryService.ts` with `getCategories()`, `createCategory()`, `updateCategory()`, `deleteCategory()` methods. Per 03_frontend_lead.md §API Integration. | 2 | 2.2 | ✅ Methods match backend route signatures; return typed responses; handle errors; no hardcoded URLs |
| 2.7 | **Task Create Form — Full** | Integrate TaskForm with `title`, `description`, `due_date`, `priority`, `category_id` fields. Add category dropdown (fetches from `categoryService`). Submit calls `taskService.createTask()`. Per 10_ui_designer.md §Screen 5. | 5 | 1.14, 2.6 | ✅ Form shows category dropdown populated with user's categories; on submit, creates task with category_id; clears form on success; shows validation errors; redirects to dashboard or closes modal |
| 2.8 | **Task List with Category Filter** | Update Dashboard and/or create `src/pages/AllTasks.tsx` showing all tasks in a filterable list. Filter by `category_id` via query param or UI dropdown. Per 01_product_manager.md AC-5 and 10_ui_designer.md §Screen 4. | 5 | 2.5, 2.6 | ✅ List displays all tasks; dropdown shows all categories; selecting category filters list client-side or via API; empty state when no tasks; "All" option shows unfiltered list |
| 2.9 | **Navigation & Route Pages** | Create primary navigation (logo, links to Dashboard, All Tasks, Settings). Update router to include `/dashboard`, `/tasks`, `/settings`. Per 10_ui_designer.md §Navigation Patterns. | 3 | 1.12 | ✅ Top nav displays on all protected pages; links navigate correctly; active route highlighted; Settings page is stub (can be blank); logo links to dashboard |
| 2.10 | **Mobile Responsive (Tailwind)** | Apply Tailwind responsive classes to Dashboard, All Tasks, TaskForm for mobile first (<640px) breakpoints. Test layout on mobile viewport. Per 10_ui_designer.md §Responsive Design. | 5 | 2.5, 2.8 | ✅ On mobile (<640px): stacked layout, full-width cards, readable text (16px+); on tablet (640–1024px): 2-column layout; on desktop (>1024px): 3-column or wider; no horizontal scroll; touch targets ≥44×44px |

**Sprint 2 Total: 47 points** *(slightly over; can defer 2.10 to Sprint 3 if needed)*

---

## Sprint 3 — Secondary Features (Weeks 7–8)

### Goals
Implement full-text search, advanced filtering (priority, status), task detail/edit pages, task completion toggle, and accessibility audit.

| # | Ticket | Description | Points | Depends On | Acceptance Criteria |
|---|--------|-------------|--------|-----------|-------------------|
| 3.1 | **Database: Full-Text Search Virtual Table** | Create SQLite FTS5 virtual table `tasks_fts` on `title`, `description`. Add trigger to keep FTS table in sync with `tasks` on insert/update/delete. Per 04_db_architect.md §Virtual Table: `tasks_fts`. | 5 | 1.6 | ✅ FTS table created and indexed; trigger fires on task changes; no manual sync needed; migration is idempotent |
| 3.2 | **Search Service** | Implement `TaskService.search(userId, query)` using FTS virtual table. Returns matching tasks ranked by relevance. Per 02_backend_lead.md and 04_db_architect.md §Query Patterns: Q6. | 5 | 3.1 | ✅ `search("task query")` returns tasks where title or description matches; respects user ownership; results ranked by relevance; empty query returns all; query time <50ms for 1000 tasks |
| 3.3 | **Search Endpoint** | Create `GET /tasks/search?q=<query>` returning matching tasks. Per 02_backend_lead.md §API Endpoints: Tasks. | 3 | 3.2 | ✅ Endpoint requires auth; accepts query param `q`; returns paginated results; empty results return empty array with status 200 |
| 3.4 | **Advanced Filter Service** | Extend TaskService to support filters: `getFilteredTasks(userId, { category_id?, priority?, status? })`. Per 01_product_manager.md AC-5 and 02_backend_lead.md. | 3 | 1.7 | ✅ `getFilteredTasks()` applies all specified filters; missing filter param means no filter on that field; returns correct task subset |
| 3.5 | **Filter Routes** | Update `GET /tasks` to accept query params: `category_id`, `priority`, `status`. Use existing endpoint (no new route). Per 02_backend_lead.md §API Endpoints. | 2 | 3.4 | ✅ `GET /tasks?priority=high&status=incomplete` returns filtered results; multiple filters combine as AND; invalid values return 400 |
| 3.6 | **Task Detail / View Page** | Create `src/pages/TaskDetail.tsx` showing full task (title, description, category, priority, due date, status, created_at, updated_at). Include Edit and Delete buttons. Per 10_ui_designer.md §Screen 6. | 5 | 2.8 | ✅ Route `/tasks/:id` shows task detail; fetches task via API; displays all fields; Edit button navigates to edit form or opens modal; Delete button prompts confirmation |
| 3.7 | **Task Edit Form & Page** | Create `src/pages/EditTask.tsx` or modal showing pre-filled task form. Submit updates via `taskService.updateTask()`. Per 10_ui_designer.md §Screen 5. | 5 | 3.6 | ✅ Form pre-populates with existing task data; category dropdown shows current selection; submit updates task; success message and navigation to detail or list; validation errors shown |
| 3.8 | **Task Status Toggle** | Add button to Task Detail and list items to toggle status (incomplete ↔ complete). Calls `PATCH /tasks/:id` with `{ status }`. Per 01_product_manager.md AC-2. | 3 | 3.6 | ✅ Button text shows "Mark Complete" or "Mark Incomplete"; on click, updates via API; UI updates immediately (optimistic); counts/stats refresh; no page reload needed |
| 3.9 | **Search UI Component** | Create `src/components/SearchBar.tsx` with text input, submit button. Submits to `/tasks/search` and displays results. Debounce input (300ms). Per 10_ui_designer.md §Screen 4. | 5 | 3.3 | ✅ Input accepts search query; results display below input; debounced query sent to API; empty results show "No tasks found"; escape key clears input |
| 3.10 | **Filter UI Components** | Create filter dropdowns for Priority and Status on All Tasks page (or sidebar). Filters apply via query params or local state + API. Per 10_ui_designer.md §Screen 4. | 4 | 3.5 | ✅ Dropdowns show Priority (low/medium/high, All) and Status (incomplete/complete, All); selecting option filters list; multiple filters combine; URL query params reflect selections |
| 3.11 | **Settings Page** | Create `src/pages/Settings.tsx` with sections: Profile (email, read-only), Password Change form (old password, new password, confirm), Logout button. Per 10_ui_designer.md §Screen 7. | 5 | 2.9 | ✅ Profile section shows authenticated user's email; password form has 3 inputs + submit; logout button clears auth store and redirects to login; password change validates old password |
| 3.12 | **Password Change Endpoint & Service** | Implement `POST /auth/change-password` endpoint with AuthService method. Verify old password, hash new password, update User record. Per 02_backend_lead.md §API Endpoints. | 5 | 1.5 | ✅ Endpoint requires auth; verifies old password matches; hashes new password with bcrypt; rejects weak passwords (8+ chars); returns 200 on success, 401 on bad old password |
| 3.13 | **Accessibility Audit & Fixes** | Run WAVE, Axe, or manual audit on all pages. Ensure WCAG 2.1 AA: color contrast, focus indicators, ARIA labels, keyboard navigation. Per 03_frontend_lead.md §Accessibility and 10_ui_designer.md §Accessibility Implementation. | 8 | 2.5, 2.8, 3.6 | ✅ Color contrast ratios ≥4.5:1 for text on all backgrounds; focus ring visible on all interactive elements; form labels associated with inputs via `htmlFor`; buttons have descriptive text or ARIA labels; tab order logical; screen reader announces landmarks |
| 3.14 | **Mobile Testing (iOS Safari, Android Chrome)** | Test dashboard, task list, forms, search on iPhone (iOS Safari) and Android (Chrome). Document and fix responsive issues. Per project constraints. | 3 | 2.10 | ✅ Tested on iOS Safari (iPhone SE 2+); Android Chrome (Samsung A10 or simulator); no horizontal scroll; touch targets ≥44×44px; forms input correctly; camera/dates work on mobile; page load <2s on 4G |

**Sprint 3 Total: 56 points** *(over budget; defer 3.13 and 3.14 to Sprint 4 if velocity is lower)*

---

## Sprint 4 — Polish and Launch Prep (Weeks 9–10)

### Goals
Implement PWA (offline support via service worker), offline sync, performance optimization, final accessibility fixes, documentation, and production deployment setup.

| # | Ticket | Description | Points | Depends On | Acceptance Criteria |
|---|--------|-------------|--------|-----------|-------------------|
| 4.1 | **PWA Manifest & Icons** | Create `public/manifest.json` with app name, icons, theme colors, display mode (`standalone`). Create 192×192 and 512×512 PNG icons. Per 03_frontend_lead.md §PWA & Service Worker Strategy and 10_ui_designer.md. | 3 | 0.8 | ✅ Manifest served at `/manifest.json` with correct MIME type; icons referenced and accessible; display mode `standalone` hides address bar; theme colors match design |
| 4.2 | **Service Worker Setup** | Create `src/sw.ts` (service worker) with install, activate, and fetch event handlers. Register in `src/main.tsx`. Per 03_frontend_lead.md §PWA & Service Worker Strategy. | 8 | 4.1 | ✅ Service worker registers on app load (no user action); install event caches shell (HTML, JS, CSS); activate event cleans old caches; fetch event uses cache-first for assets, network-first for `/api/*` |
| 4.3 | **Offline Data Persistence (IndexedDB or LocalStorage)** | Implement client-side storage for tasks and categories fetched while online. Store in IndexedDB or localStorage. Restore on app load. Per 03_frontend_lead.md and 01_product_manager.md AC-6. | 8 | 4.2 | ✅ Tasks fetched online are stored in IndexedDB; offline, dashboard shows cached tasks; search works on cached data; no "network error" shown to user; `useQuery` checks cache before network |
| 4.4 | **Sync Endpoint (Backend)** | Create `GET /sync/changes?since=<timestamp>` endpoint. Returns tasks, categories, and deletions since timestamp. Per 02_backend_lead.md §API Endpoints: Sync and 04_db_architect.md §Query Patterns: Q8. | 5 | 1.6 | ✅ Endpoint requires auth; returns `{ tasks, categories, deletions, timestamp }` for changes since `since` param; timestamp in ISO8601 format; accurate for offline sync |
| 4.5 | **Offline Sync (Frontend)** | Implement sync logic: on reconnect, fetch changes via `/sync/changes` and merge with local data. Update TanStack Query cache. Per 03_frontend_lead.md. | 8 | 4.4 | ✅ On reconnect (online event), calls sync endpoint; merges remote tasks into local cache; conflict resolution (last-write-wins); no duplicate tasks; sync completes within 2s; UI shows "Synced" toast |
| 4.6 | **Offline Indicator UI** | Add indicator (icon or banner) showing online/offline status. Update when connectivity changes. Per 10_ui_designer.md §Interaction Patterns: Offline Indicators. | 2 | 4.5 | ✅ Indicator shows "offline" when `navigator.onLine === false`; shows "syncing..." during sync; shows "online" when synced; updates without user action; dismissable if banner |
| 4.7 | **Performance Optimization: Code Splitting** | Implement React Router lazy loading for Dashboard, AllTasks, TaskDetail, Settings pages via `React.lazy()`. Dynamic imports. Per 03_frontend_lead.md §Performance. | 5 | 1.12 | ✅ Each main page route uses `React.lazy()`; `<Suspense>` fallback shown while loading; Webpack chunks generated (`dashboard.js`, `tasks.js`, etc.); initial bundle <150KB gzipped |
| 4.8 | **Performance Optimization: Image & Asset Loading** | Optimize bundled images (icons, logos). Use `<link rel="preload">` for critical assets. Lazy-load non-critical images. Per 03_frontend_lead.md §Performance. | 3 | 4.7 | ✅ No uncompressed images in dist; critical fonts preloaded; images use WebP with JPEG fallback; LCP <1s; FCP <0.8s on Fast 3G |
| 4.9 | **Build Output Analysis** | Run bundle analyzer to ensure main bundle <150KB, total gzipped <250KB. Document bundle breakdown. Per 03_frontend_lead.md §Performance: Bundle Budget. | 2 | 4.7 | ✅ Bundle analysis output generated; breakdown by package shown; gzipped total <250KB; no unused deps; tree-shaking working |
| 4.10 | **Accessibility Final Audit** | Re-run accessibility audit post-styling. Fix any remaining issues (color contrast, focus, ARIA, keyboard nav). Per 03_frontend_lead.md §Accessibility and 10_ui_designer.md §Accessibility Implementation. | 5 | 3.13 | ✅ Axe/WAVE audit <5 issues; color contrast ≥4.5:1; all buttons keyboard-accessible; tab order logical; screen reader friendly (landmarks, headings, labels) |
| 4.11 | **API Documentation** | Write API docs (Swagger/OpenAPI or markdown) covering all endpoints, request/response schemas, auth. Per 02_backend_lead.md and 05_qa_lead.md. | 5 | 1.8 | ✅ Swagger/OpenAPI YAML or JSON file created; covers all endpoints; schemas defined; examples provided; deployable swagger-ui endpoint or published to docs/ |
| 4.12 | **User Guide Documentation** | Write user guide (Markdown): getting started, creating tasks, categories, dashboard, search, offline usage, settings. Per 01_product_manager.md and 10_ui_designer.md. | 3 | — | ✅ Guide covers all user-facing features; includes screenshots/wireframes; clear step-by-step instructions; published to GitHub wiki or `docs/user-guide.md` |
| 4.13 | **Production Environment Setup** | Create production `docker-compose.yml`, production Dockerfile, environment variable template. Configure health checks, logging. Per 06_devops_lead.md §Deployment Strategy. | 5 | 0.4 | ✅ `docker-compose.prod.yml` defined; API image builds without warnings; environment variables documented in `.env.example`; health check responds on `/health`; logs structured (JSON or parseable) |
| 4.14 | **Database Backup Strategy** | Create backup script (`scripts/backup.sh`) for SQLite: daily backups, 30-day retention, recovery testing. Per 04_db_architect.md §Backup and Recovery. | 3 | 0.3 | ✅ `backup.sh` runs without error; creates timestamped backups; prunes old backups; recovery test passes (restore and verify data) |
| 4.15 | **Deployment Runbook** | Document deployment procedure: build image, run migrations, start containers, verify health, rollback plan. Per 06_devops_lead.md §Deployment Strategy. | 3 | 4.13 | ✅ Runbook covers all steps; tested on staging; rollback procedure documented; no manual SSH commands required (scripted) |
| 4.16 | **Final E2E Test Suite** | Write or update Playwright tests to cover all user flows: auth, task CRUD, categories, dashboard, search, filter, offline sync. Per 05_qa_lead.md. | 8 | 3.14 | ✅ Tests cover Noa (freelancer) and Amit (student) personas; 80%+ code coverage on backend; tests pass consistently; can run in CI; flakiness <5% |
| 4.17 | **Production Database Seed** | Create seed script for production (empty user or default categories if needed). Document seed procedure. Per 04_db_architect.md §Migrations. | 2 | 0.3 | ✅ Seed script idempotent (safe to run multiple times); creates default data if applicable; no test data left in production |

**Sprint 4 Total: 73 points** *(Well over 40; must prioritize; suggest core items: 4.2, 4.3, 4.4, 4.5, 4.6, 4.10, 4.16 = 44 points; defer 4.7–4.9, 4.11–4.15, 4.17 to Post-MVP or Phase 2)*

**Revised Sprint 4 (Core PWA + QA): 44 points**
- 4.2 Service Worker (8)
- 4.3 IndexedDB Persistence (8)
- 4.4 Sync Endpoint (5)
- 4.5 Offline Sync (8)
- 4.6 Offline Indicator (2)
- 4.10 Accessibility Audit (5)
- 4.16 E2E Tests (8)

---

## Post-MVP Backlog

Features explicitly marked **Out of Scope** in `01_product_manager.md`, prioritized for future sprints or Phase 2 release.

| Priority | Ticket | Feature | Story Points | Description | Acceptance Criteria |
|----------|--------|---------|---------------|-------------|-------------------|
| 1 | P.1 | **Dark Mode** | 13 | Implement dark theme toggle in Settings; persist preference to localStorage; theme colors per 10_ui_designer.md §Dark Mode. | ✅ Settings has dark mode toggle; all pages render dark theme correctly; colors meet WCAG AA in dark mode; persists across sessions |
| 2 | P.2 | **Recurring Tasks** | 21 | Add recurrence options (daily, weekly, monthly) to Task model; implement recurrence service to auto-create instances; update UI. | ✅ Task form accepts recurrence pattern; backend creates instances on schedule; dashboard shows all instances; can skip or modify individual instances |
| 3 | P.3 | **Tags (Multiple Labels)** | 8 | Extend Task model to support many-to-many relationship with Tags; add tag CRUD; UI for selecting multiple tags per task. | ✅ Task form shows tag picker (multi-select); tags persist; filter by tag works; tags displayed on task cards |
| 4 | P.4 | **Calendar View** | 13 | Create calendar UI showing tasks by due date; click date to see tasks; drag-to-reschedule (optional). | ✅ Calendar month view shows tasks as dots/badges; click date navigates to tasks for that day; visual indication of overdue tasks |
| 5 | P.5 | **File Attachments** | 13 | Add attachment field to tasks; upload to cloud storage (AWS S3 or similar); display attachment links in task detail. | ✅ Task form has file upload input; files uploaded and stored; task detail shows attachment links; can delete attachments |
| 6 | P.6 | **Time Tracking** | 21 | Add time spent field to tasks; timer UI; track cumulative time; report on time by category. | ✅ Task detail has start/stop timer; time persists across sessions; dashboard shows time stats; can edit time manually |
| 7 | P.7 | **Custom Notifications** | 13 | Add notification preferences (email, in-app, browser push) for task due dates; schedule notification before due time. | ✅ Settings has notification preferences; browser push requests permission; notifications trigger at scheduled time; can mute per task |
| 8 | P.8 | **Team / Collaboration** | 34 | Add user roles (owner, member), task sharing, comments, activity feed. *This is a major scope expansion; consider Phase 2.* | ✅ Users can share tasks; collaborators can view and edit; comments thread on tasks; activity feed shows changes |
| 9 | P.9 | **External Integrations** | 21 | Integrate with Google Calendar, Slack, Zapier, IFTTT. Per 09_business_lead.md partnerships. | ✅ OAuth flow for each integration; tasks sync to Calendar; Slack notifications working; Zapier recipes available |
| 10 | P.10 | **Mobile App (Native iOS/Android)** | 55 | Build React Native or Flutter app targeting iOS and Android. *Major multi-sprint effort; consider outsourcing or Phase 3.* | ✅ App published to App Store and Google Play; feature parity with web; offline support; push notifications |

---

## Bugs and Tech Debt

Known issues and deferred improvements. Discovered during implementation; prioritized by severity and impact.

| ID | Severity | Ticket | Description | Root Cause | Proposed Fix | Points | Status |
|---|----------|--------|-------------|-----------|--------------|--------|--------|
| B.1 | 🟠 Medium | Rate Limiting False Positives | Health checks from monitoring trigger rate limit. | Health check counted in rate limit window. | Exclude `/health` from rate limiter or use separate limit. | 2 | 🟡 Backlog |
| B.2 | 🟠 Medium | Timezone Handling in Due Dates | Due date calculations off by timezone offset in some regions. | Dates stored in UTC but dashboard compares against local date. | Store dates in ISO8601 format; normalize client-side; add timezone support to User model. | 5 | 🟡 Backlog |
| B.3 | 🟡 Low | Refresh Token Rotation | Refresh tokens are issued once and never rotated; lost token is permanently valid. | No refresh token rotation on use. | Implement refresh token rotation: issue new token on each refresh; invalidate old token. | 5 | 🟡 Backlog |
| B.4 | 🟡 Low | Missing Input Sanitization | XSS risk if task titles contain HTML/scripts. | No sanitization on task title/description input. | Use DOMPurify (frontend) and sanitize on save (backend); store as plaintext, render as text. | 3 | 🟡 Backlog |
| B.5 | 🟠 Medium | Service Worker Cache Staleness | Old service worker remains active indefinitely; updates slow to deploy. | No service worker skip-waiting or versioning strategy. | Implement skip-waiting on update; add version hash to service worker; check for updates on app launch. | 5 | 🟡 Backlog |
| B.6 | 🟡 Low | No Logout Endpoint | Logout clears tokens client-side only; refresh token still valid on server. | `POST /auth/logout` not implemented. | Add logout endpoint to invalidate refresh token; mark as revoked in database. | 3 | 🟡 Backlog |
| B.7 | 🟡 Low | Pagination Defaults Undocumented | API returns 20 items per page; frontend assumes different limit. | No default limit documented or consistent. | Document limit=20 default in API spec; frontend uses same default. | 1 | 🟡 Backlog |
| B.8 | 🟠 Medium | Concurrent Delete Race Condition | If user deletes task while offline, sync re-creates it. | No delete tombstone; sync merges all tasks without checking local deletes. | Implement soft deletes or tombstone table; sync filters out deleted tasks. | 8 | 🟡 Backlog |
| B.9 | 🟡 Low | CORS Too Permissive | Production CORS allows localhost origins (dev config leaked). | `.env` not properly isolated between environments. | Verify CORS config in production only allows production domain; use environment-specific config. | 2 | 🟡 Backlog |
| B.10 | 🟠 Medium | Mobile Keyboard Overlay | Mobile soft keyboard hides form inputs on short viewports. | No viewport offset or scroll behavior on focus. | On input focus, scroll into view; increase textarea height on keyboard open (mobile-specific). | 5 | 🟡 Backlog |

---

## Summary

### Total MVP Story Points: 154 points (Sprints 0–4)

| Sprint | Theme | Points | Status |
|--------|-------|--------|--------|
| **0** | Foundation (Repo, CI/CD, DB, Testing) | 42 | 📋 Planned |
| **1** | Core Domain (Auth + Task CRUD) | 52 | 📋 Planned |
| **2** | Primary Features (Dashboard, Categories) | 47 | 📋 Planned |
| **3** | Secondary Features (Search, Filter, UX) | 56 | 📋 Planned |
| **4** | Polish & Launch (PWA, Sync, QA) | 44 | 📋 Planned |
| **Total** | **MVP Release** | **241** | — |

### Key Dependencies

- **Sprint 1** depends on **Sprint 0** (repo, DB, testing, auth middleware)
- **Sprint 2** depends on **Sprint 1** (auth, Task CRUD foundation)
- **Sprint 3** depends on **Sprint 2** (categories, dashboard)
- **Sprint 4** depends on **Sprints 1–3** (offline sync, PWA)
- **Post-MVP** can start in parallel with Sprint 4 for light-weight features (Dark Mode, P.1)

### Critical Path

Sprint 0 (foundation) → Sprint 1 (auth + tasks) → Sprint 2 (dashboard) → Sprint 3 (search/filter) → Sprint 4 (PWA + deploy)

### QA Strategy (per 05_qa_lead.md)

- **Unit Tests:** 60% of test suite; Vitest on auth, task, category services
- **Integration Tests:** 25%; Supertest on API routes + SQLite round-trips
- **E2E Tests:** 15%; Playwright on full user flows (Noa, Amit personas)
- **Coverage Target:** 80% code coverage by end of Sprint 4
- **Mobile Testing:** On real devices or emulator (iOS Safari, Android Chrome) in Sprint 3–4

### Acceptance Criteria Cross-Reference

Every ticket's acceptance criteria links to:
- **Spec file** (e.g., "per 02_backend_lead.md §Service Layer")
- **Section** and **subsection** for easy lookup
- **Verifiable outcome** (e.g., "Axe audit <5 issues", "response time <100ms")

### Definition of Done (per Ticket)

✅ **Code:** Implemented in feature branch, reviewed, merged to main  
✅ **Tests:** Unit/integration/E2E passing; coverage ≥80%  
✅ **Docs:** API spec updated, user guide section added if applicable  
✅ **QA:** Manual verification on preprod or staging environment  
✅ **Accessibility:** WCAG 2.1 AA compliance verified  
✅ **Performance:** Meets non-functional requirements (load time, bundle size, mobile responsiveness)

---

## Assumptions & Notes

1. **Solo Developer or Small Team:** Velocity estimates assume 1 full-stack developer or 1 backend + 1 frontend developer pair.
2. **2-Week Sprints:** 10 working days, accounting for meetings and unforeseen issues.
3. **Testing is Built-In:** Every ticket includes test acceptance criteria; testing is not a separate sprint.
4. **Mobile-First Responsive Design:** All UI work assumes mobile viewport first (Tailwind mobile-first classes).
5. **Offline-First PWA:** Service worker and sync are core features, not bolt-on; critical path dependency for MVP.
6. **No External Services in v1:** Email, SMS, payment, third-party auth (Google, GitHub) are deferred to Post-MVP.
7. **Single-User Architecture:** No multi-tenancy, roles, permissions, or audit logging in v1; all users own their own data.
8. **SQLite for Simplicity:** Chosen for solo-developer constraints; scales to ~100K tasks per user; no ORM complexity (Prisma) if too heavy.

---

## Success Criteria (Project Level)

Upon completion of Sprint 4 (MVP release):

1. ✅ User can register, login, and logout
2. ✅ User can create, read, update, delete tasks with title, description, due date, priority
3. ✅ User can create and manage categories; assign one per task
4. ✅ Dashboard displays today's tasks, overdue items, and completion stats
5. ✅ User can search tasks by title/description (full-text)
6. ✅ User can filter tasks by category, priority, status
7. ✅ User can use app offline; changes sync on reconnect
8. ✅ App loads in <1 second (First Contentful Paint)
9. ✅ App is responsive on mobile (iOS Safari, Android Chrome)
10. ✅ App is accessible (WCAG 2.1 AA)
11. ✅ E2E test suite passes; 80%+ code coverage
12. ✅ API and user documentation complete
13. ✅ Deployment procedure tested; rollback plan in place

---

**Generated:** 2026-03-21  
**Role:** Sprint Planning Lead  
**Status:** ✅ Ready for Sprint 0 Kickoff