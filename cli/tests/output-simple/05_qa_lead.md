---
role: qa_lead
spec_version: "1.0"
generated_by: autospec v0.2.0
model: auto
provider: claude-code
source_srs: srs-simple.md
source_hash: "sha256:7458b2f5b29602d300ec5766ab196f4f026b7aca8470f82fe507d40b7c83ea36"
generated_at: 2026-03-21T10:08:25.174Z
---

# 05 — QA Lead Specification: TaskFlow

## Test Strategy

### Testing Pyramid

| Layer | Target Split | Tooling | Scope |
|-------|-------------|---------|-------|
| **Unit** | 60% of tests | Vitest + @testing-library/react | Pure functions, service methods, utilities, React components in isolation |
| **Integration** | 25% of tests | Vitest + Supertest | API route → service → SQLite round-trips, middleware chains, auth flows |
| **E2E** | 15% of tests | Playwright | Full user flows through browser, PWA offline scenarios, mobile viewports |

### Tooling Choices

| Tool | Purpose | Rationale |
|------|---------|-----------|
| **Vitest** | Unit + integration test runner | Native TypeScript, fast HMR, compatible with Jest API, works with both React and Express |
| **@testing-library/react** | Component testing | Encourages accessible queries, aligns with WCAG goals |
| **Supertest** | HTTP integration tests | In-process Express testing without spinning up a server |
| **Playwright** | E2E browser tests | Cross-browser (Chromium, WebKit, Firefox), mobile emulation, offline/service-worker support |
| **msw (Mock Service Worker)** | Frontend API mocking for unit tests | Intercepts at the network level, realistic mocking |
| **c8 / istanbul** | Code coverage | Built into Vitest, lcov + text reporters |
| **Faker.js** | Test data generation | Realistic seed data for tasks, categories, users |

---

## Test Environment Setup

### Environment Variables

```env
# .env.test
NODE_ENV=test
PORT=0
DATABASE_URL=:memory:
JWT_SECRET=test-jwt-secret-do-not-use-in-prod
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
BCRYPT_ROUNDS=4
RATE_LIMIT_MAX=1000
RATE_LIMIT_WINDOW_MS=60000

- `DATABASE_URL=:memory:` — SQLite in-memory database for fast, isolated test runs.
- `BCRYPT_ROUNDS=4` — Reduced from 12 to speed up auth tests (hashing is the bottleneck).
- `RATE_LIMIT_MAX=1000` — Relaxed to prevent test flakiness from rate limiting.

### Seed Scripts

#### `tests/seed/seedTestUser.ts`
Creates a default test user: `testuser@taskflow.test` / `Test1234!` with a pre-generated JWT pair.

#### `tests/seed/seedTestData.ts`
Creates:
- 3 categories: "Work", "Personal", "Health"
- 15 tasks across categories with varied priorities, statuses, and due dates (past, today, future)
- 5 completed tasks, 3 overdue tasks, 7 upcoming tasks

#### `tests/helpers/setupTestDb.ts`
- Runs all migrations against in-memory SQLite
- Seeds test user + test data
- Exports `getTestDb()`, `getTestApp()` (Express app with test DB), and `getAuthHeaders()` (valid JWT)

#### Bootstrap Sequence (per test suite)
1. Create in-memory SQLite database
2. Apply migrations via `better-sqlite3` migrate API
3. Enable WAL mode (`PRAGMA journal_mode=WAL`)
4. Enable foreign keys (`PRAGMA foreign_keys=ON`)
5. Run seed scripts
6. Return app instance + auth tokens

### E2E Environment
- Playwright targets `http://localhost:5173` (Vite dev server) or a static build
- Uses `globalSetup.ts` to start backend + frontend, wait for health check at `/api/v1/health`
- `globalTeardown.ts` kills processes and cleans up SQLite file

---

## Unit Test Cases

### Auth Module

| Test ID | Module | Scenario | Expected Outcome |
|---------|--------|----------|------------------|
| UT-A01 | AuthService | Register with valid email and strong password | Returns user object with hashed password, no plain-text password in response |
| UT-A02 | AuthService | Register with duplicate email | Throws ConflictError with code `AUTH_EMAIL_EXISTS` |
| UT-A03 | AuthService | Register with weak password (no uppercase) | Throws ValidationError listing password requirements |
| UT-A04 | AuthService | Register with invalid email format | Throws ValidationError with `email` field error |
| UT-A05 | AuthService | Login with correct credentials | Returns `{ accessToken, refreshToken }` with valid JWT payload |
| UT-A06 | AuthService | Login with wrong password | Throws UnauthorizedError with code `AUTH_INVALID_CREDENTIALS` |
| UT-A07 | AuthService | Login with non-existent email | Throws UnauthorizedError (same error as wrong password to prevent enumeration) |
| UT-A08 | AuthService | Refresh token with valid refresh token | Returns new access token, rotates refresh token |
| UT-A09 | AuthService | Refresh token with expired refresh token | Throws UnauthorizedError with code `AUTH_TOKEN_EXPIRED` |
| UT-A10 | AuthService | Refresh token with revoked refresh token | Throws UnauthorizedError with code `AUTH_TOKEN_REVOKED` |
| UT-A11 | AuthService | Logout revokes refresh token | Refresh token marked inactive in DB, subsequent refresh fails |
| UT-A12 | AuthMiddleware | Request with valid JWT in Authorization header | Sets `req.user` with decoded payload, calls `next()` |
| UT-A13 | AuthMiddleware | Request with expired JWT | Returns 401 with `AUTH_TOKEN_EXPIRED` error |
| UT-A14 | AuthMiddleware | Request with malformed JWT | Returns 401 with `AUTH_INVALID_TOKEN` error |
| UT-A15 | AuthMiddleware | Request with no Authorization header | Returns 401 with `AUTH_MISSING_TOKEN` error |

### Task Module

| Test ID | Module | Scenario | Expected Outcome |
|---------|--------|----------|------------------|
| UT-T01 | TaskService | Create task with all fields (title, description, dueDate, priority, categoryId) | Returns task with auto-generated `id`, `createdAt`, `updatedAt`, `status=incomplete` |
| UT-T02 | TaskService | Create task with only required field (title) | Returns task with `description=null`, `dueDate=null`, `priority=medium`, `categoryId=null` |
| UT-T03 | TaskService | Create task with empty title | Throws ValidationError: title is required |
| UT-T04 | TaskService | Create task with title exceeding 255 characters | Throws ValidationError: title max length 255 |
| UT-T05 | TaskService | Create task with invalid priority value | Throws ValidationError: priority must be low, medium, or high |
| UT-T06 | TaskService | Create task with non-existent categoryId | Throws NotFoundError: category not found |
| UT-T07 | TaskService | Create task with categoryId owned by different user | Throws ForbiddenError: category does not belong to user |
| UT-T08 | TaskService | Get task by ID (own task) | Returns full task object with category relation |
| UT-T09 | TaskService | Get task by ID (another user's task) | Throws ForbiddenError |
| UT-T10 | TaskService | Get task by non-existent ID | Throws NotFoundError |
| UT-T11 | TaskService | Update task title | Returns updated task with new title, `updatedAt` changed |
| UT-T12 | TaskService | Update task status to complete | Sets `status=complete`, `completedAt=now()` |
| UT-T13 | TaskService | Update task status back to incomplete | Sets `status=incomplete`, `completedAt=null` |
| UT-T14 | TaskService | Delete task (own task) | Task removed from DB, returns 204 |
| UT-T15 | TaskService | Delete task (another user's task) | Throws ForbiddenError |
| UT-T16 | TaskService | List tasks with no filters | Returns paginated list of user's tasks, default sort by `createdAt desc` |
| UT-T17 | TaskService | List tasks filtered by priority=high | Returns only high-priority tasks |
| UT-T18 | TaskService | List tasks filtered by status=complete | Returns only completed tasks |
| UT-T19 | TaskService | List tasks filtered by categoryId | Returns only tasks in that category |
| UT-T20 | TaskService | Full-text search matching title | Returns tasks where title matches search term via `tasks_fts` |
| UT-T21 | TaskService | Full-text search matching description | Returns tasks where description matches search term |
| UT-T22 | TaskService | Full-text search with no results | Returns empty array with `total=0` |
| UT-T23 | TaskService | List tasks with pagination (page=2, limit=5) | Returns correct slice, `total` reflects all matching tasks |

### Category Module

| Test ID | Module | Scenario | Expected Outcome |
|---------|--------|----------|------------------|
| UT-C01 | CategoryService | Create category with valid name and color | Returns category with `id`, `name`, `color`, `createdAt` |
| UT-C02 | CategoryService | Create category with duplicate name (same user) | Throws ConflictError: category name must be unique |
| UT-C03 | CategoryService | Create category with empty name | Throws ValidationError: name is required |
| UT-C04 | CategoryService | List categories for user | Returns all user's categories sorted alphabetically |
| UT-C05 | CategoryService | Update category name | Returns updated category |
| UT-C06 | CategoryService | Delete category with no tasks | Category removed, returns 204 |
| UT-C07 | CategoryService | Delete category with tasks | Tasks have `categoryId` set to null, category deleted |
| UT-C08 | CategoryService | Delete category owned by another user | Throws ForbiddenError |

### Dashboard Module

| Test ID | Module | Scenario | Expected Outcome |
|---------|--------|----------|------------------|
| UT-D01 | DashboardService | Get today's tasks | Returns only tasks with `dueDate = today` and `status=incomplete` |
| UT-D02 | DashboardService | Get overdue tasks | Returns tasks with `dueDate < today` and `status=incomplete`, sorted by dueDate asc |
| UT-D03 | DashboardService | Get completion stats | Returns `{ today: { completed, total }, week: { completed, total }, overall: { completed, total } }` |
| UT-D04 | DashboardService | Dashboard with zero tasks | Returns empty arrays and `{ completed: 0, total: 0 }` for all stat periods |

### Sync Module

| Test ID | Module | Scenario | Expected Outcome |
|---------|--------|----------|------------------|
| UT-S01 | SyncService | Get changes since timestamp | Returns tasks and categories modified after the given `updatedAt` timestamp |
| UT-S02 | SyncService | Push offline changes (new tasks) | Creates tasks server-side, returns server-assigned IDs |
| UT-S03 | SyncService | Push offline changes with conflict (server is newer) | Server version wins, returns conflict list with server values |
| UT-S04 | SyncService | Push offline changes with conflict (client is newer) | Client version applied, returns merged result |

### Frontend Components

| Test ID | Module | Scenario | Expected Outcome |
|---------|--------|----------|------------------|
| UT-F01 | TaskCard | Render task with all fields | Displays title, due date formatted, priority badge, category tag |
| UT-F02 | TaskCard | Toggle task completion | Calls `onToggle` callback, checkbox reflects new state |
| UT-F03 | TaskCard | Overdue task styling | Shows red text/border for overdue due date |
| UT-F04 | TaskForm | Submit with valid data | Calls `onSubmit` with form values, clears form |
| UT-F05 | TaskForm | Submit with empty title | Shows validation error, does not call `onSubmit` |
| UT-F06 | TaskForm | Date picker sets due date | Form state includes selected date in ISO format |
| UT-F07 | CategoryBadge | Render with color | Displays category name with correct background color |
| UT-F08 | DashboardStats | Render completion stats | Shows correct numbers for today/week/total completions |
| UT-F09 | SearchBar | Type and debounce | Calls `onSearch` after 300ms debounce with input value |
| UT-F10 | FilterPanel | Select multiple filters | Calls `onFilterChange` with `{ priority, status, categoryId }` |
| UT-F11 | PriorityBadge | Render each priority level | Low=green, Medium=yellow, High=red badge colors |
| UT-F12 | EmptyState | Render when no tasks | Shows illustration and "No tasks yet" message with CTA |

---

## Integration Test Cases

### API Contract Tests — Authentication

| Test ID | Endpoint | Method | Scenario | Expected |
|---------|----------|--------|----------|----------|
| IT-A01 | `/api/v1/auth/register` | POST | Valid registration payload | 201, returns `{ user, accessToken, refreshToken }` |
| IT-A02 | `/api/v1/auth/register` | POST | Duplicate email | 409, `{ error: { code: "AUTH_EMAIL_EXISTS" } }` |
| IT-A03 | `/api/v1/auth/register` | POST | Missing required fields | 400, validation errors array |
| IT-A04 | `/api/v1/auth/login` | POST | Valid credentials | 200, returns tokens, sets refresh token cookie |
| IT-A05 | `/api/v1/auth/login` | POST | Invalid credentials | 401, generic error (no email enumeration) |
| IT-A06 | `/api/v1/auth/refresh` | POST | Valid refresh token | 200, new access token, rotated refresh token |
| IT-A07 | `/api/v1/auth/refresh` | POST | Expired refresh token | 401 |
| IT-A08 | `/api/v1/auth/logout` | POST | With valid access token | 200, refresh token invalidated |
| IT-A09 | `/api/v1/auth/logout` | POST | Without auth | 401 |

### API Contract Tests — Tasks

| Test ID | Endpoint | Method | Scenario | Expected |
|---------|----------|--------|----------|----------|
| IT-T01 | `/api/v1/tasks` | POST | Create task with all fields | 201, task object with generated ID |
| IT-T02 | `/api/v1/tasks` | POST | Create task without auth | 401 |
| IT-T03 | `/api/v1/tasks` | POST | Create with invalid priority | 400, validation error |
| IT-T04 | `/api/v1/tasks` | POST | Create with past due date | 201 (allowed — user may log past items) |
| IT-T05 | `/api/v1/tasks` | GET | List tasks (default pagination) | 200, `{ data: [...], total, page, limit }` |
| IT-T06 | `/api/v1/tasks` | GET | List with `?priority=high&status=incomplete` | 200, only matching tasks |
| IT-T07 | `/api/v1/tasks` | GET | List with `?search=meeting` | 200, full-text search results |
| IT-T08 | `/api/v1/tasks` | GET | List with `?page=999` (beyond data) | 200, `{ data: [], total: N }` |
| IT-T09 | `/api/v1/tasks` | GET | Without auth | 401 |
| IT-T10 | `/api/v1/tasks/:id` | GET | Get own task | 200, full task with category |
| IT-T11 | `/api/v1/tasks/:id` | GET | Get non-existent task | 404 |
| IT-T12 | `/api/v1/tasks/:id` | PUT | Update title and priority | 200, updated fields, `updatedAt` changed |
| IT-T13 | `/api/v1/tasks/:id` | PUT | Update with empty body | 400, validation error |
| IT-T14 | `/api/v1/tasks/:id` | PATCH | Toggle status to complete | 200, `status=complete`, `completedAt` set |
| IT-T15 | `/api/v1/tasks/:id` | PATCH | Toggle status back to incomplete | 200, `status=incomplete`, `completedAt=null` |
| IT-T16 | `/api/v1/tasks/:id` | DELETE | Delete own task | 204 |
| IT-T17 | `/api/v1/tasks/:id` | DELETE | Delete non-existent task | 404 |

### API Contract Tests — Categories

| Test ID | Endpoint | Method | Scenario | Expected |
|---------|----------|--------|----------|----------|
| IT-C01 | `/api/v1/categories` | POST | Create category | 201, category object |
| IT-C02 | `/api/v1/categories` | POST | Duplicate name | 409 |
| IT-C03 | `/api/v1/categories` | POST | Without auth | 401 |
| IT-C04 | `/api/v1/categories` | GET | List user's categories | 200, array of categories |
| IT-C05 | `/api/v1/categories/:id` | PUT | Update category name | 200, updated category |
| IT-C06 | `/api/v1/categories/:id` | DELETE | Delete category (tasks nullified) | 204 |
| IT-C07 | `/api/v1/categories/:id` | DELETE | Delete another user's category | 403 |

### API Contract Tests — Dashboard

| Test ID | Endpoint | Method | Scenario | Expected |
|---------|----------|--------|----------|----------|
| IT-D01 | `/api/v1/dashboard` | GET | Authenticated user with tasks | 200, `{ todayTasks, overdueTasks, stats }` |
| IT-D02 | `/api/v1/dashboard` | GET | Without auth | 401 |
| IT-D03 | `/api/v1/dashboard` | GET | User with zero tasks | 200, empty arrays and zero stats |

### API Contract Tests — Sync

| Test ID | Endpoint | Method | Scenario | Expected |
|---------|----------|--------|----------|----------|
| IT-S01 | `/api/v1/sync/changes` | GET | `?since=<ISO timestamp>` | 200, `{ tasks: [...], categories: [...], serverTime }` |
| IT-S02 | `/api/v1/sync/push` | POST | Array of offline changes | 200, `{ applied: [...], conflicts: [...] }` |
| IT-S03 | `/api/v1/sync/push` | POST | Without auth | 401 |

### API Contract Tests — Health

| Test ID | Endpoint | Method | Scenario | Expected |
|---------|----------|--------|----------|----------|
| IT-H01 | `/api/v1/health` | GET | Server is running | 200, `{ status: "ok", uptime, version }` |

### Service-to-Service Integration

| Test ID | Services | Scenario | Expected |
|---------|----------|----------|----------|
| IT-SS01 | TaskService → CategoryService | Create task referencing existing category | Task created with valid `categoryId` FK |
| IT-SS02 | CategoryService → TaskService | Delete category with linked tasks | All linked tasks have `categoryId` set to null |
| IT-SS03 | DashboardService → TaskService | Dashboard aggregates match task list | Stats counts match filtered task list lengths |
| IT-SS04 | AuthMiddleware → TaskService | Expired token on task creation | 401 returned before TaskService is invoked |
| IT-SS05 | SyncService → TaskService + CategoryService | Sync push creates tasks and categories atomically | Either all changes apply or none (transaction rollback on error) |

---

## End-to-End Test Cases

### Persona: Noa (Freelance UX Designer)

| Test ID | Flow | Steps | Expected Outcome |
|---------|------|-------|------------------|
| E2E-N01 | First-Time Registration → First Task (Flow 1) | 1. Navigate to `/register` 2. Fill email + password 3. Submit 4. Redirected to dashboard 5. Click "Add Task" 6. Enter title "Client wireframes", set priority=high, category="Work", due date=tomorrow 7. Save | Task appears in dashboard under today's or upcoming section; category "Work" created |
| E2E-N02 | Morning Triage (Flow 2) | 1. Login as Noa 2. View dashboard 3. See overdue task "Submit invoice" 4. Click to complete it 5. See today's tasks 6. Edit priority on a task 7. Check completion stats update | Overdue count decreases by 1, completed count increases, stats reflect change in real-time |
| E2E-N03 | Create and Organize Multiple Tasks | 1. Login 2. Create 5 tasks across "Work" and "Personal" categories 3. Set mixed priorities 4. Navigate to task list 5. Filter by category="Work" 6. Verify only Work tasks shown | Filter correctly narrows results; task count matches |
| E2E-N04 | Edit and Delete Task | 1. Login 2. Open existing task 3. Change title, priority, due date 4. Save 5. Verify changes persisted 6. Delete a different task 7. Verify it's removed from list | Updates persist across page reload; deleted task gone |
| E2E-N05 | Search for a Specific Task (Flow 3) | 1. Login 2. Click search bar 3. Type "wireframe" 4. See matching tasks highlighted 5. Click a result 6. View task detail | Full-text search returns tasks matching title or description; navigation works |

### Persona: Amit (Computer Science Student)

| Test ID | Flow | Steps | Expected Outcome |
|---------|------|-------|------------------|
| E2E-A01 | Student Assignment Tracking | 1. Register as Amit 2. Create category "CS 101" 3. Create task "Data Structures HW3" with due date next Friday, priority=high 4. Create task "OS Reading" with priority=low 5. View dashboard | Dashboard shows tasks organized by due date; high priority visually distinct |
| E2E-A02 | Complete Tasks and Track Progress | 1. Login 2. Complete 3 tasks 3. View dashboard stats 4. Verify weekly completion count = 3 5. Check overall completion percentage updates | Stats update immediately; completion count matches |
| E2E-A03 | Offline Usage (Flow 4) | 1. Login and load app 2. Go offline (Playwright network emulation) 3. Create a new task "Study for midterm" 4. Edit existing task 5. Complete a task 6. Go back online 7. Verify all changes synced | PWA serves cached shell; offline mutations queued; sync resolves on reconnect |
| E2E-A04 | Mobile Responsive Layout | 1. Set viewport to 375×812 (iPhone X) 2. Login 3. Navigate dashboard, task list, task form 4. Verify no horizontal scroll 5. Verify tap targets ≥ 44px 6. Verify hamburger menu works | All pages render correctly at mobile breakpoint; no layout overflow |
| E2E-A05 | PWA Install and Service Worker | 1. Navigate to app in Chromium 2. Verify service worker registered 3. Verify manifest.json served 4. Check `beforeinstallprompt` event fires | App is installable; service worker caches critical assets |

### Cross-Persona Flows

| Test ID | Flow | Steps | Expected Outcome |
|---------|------|-------|------------------|
| E2E-X01 | Multi-Filter Combination | 1. Login 2. Apply filters: priority=high + status=incomplete + category="Work" 3. Verify results match all three criteria 4. Clear filters 5. Verify full list returns | Filters combine with AND logic; clearing restores full list |
| E2E-X02 | Rapid Task Creation (Performance) | 1. Login 2. Create 10 tasks in sequence via UI 3. Measure total time | Completing 10 task creations in under 2 minutes (per success criteria) |
| E2E-X03 | Session Expiry and Refresh | 1. Login 2. Wait/mock JWT expiry 3. Perform an action 4. Verify silent token refresh 5. Action succeeds without re-login | Transparent token refresh; no user-facing error |

---

## Edge Cases and Negative Tests

### Concurrent Requests

| Test ID | Scenario | Expected |
|---------|----------|----------|
| EC-01 | Two simultaneous PUT requests to the same task with different titles | Last-write-wins; no database corruption; both return 200 |
| EC-02 | DELETE task while a PUT update is in flight | One succeeds, one gets 404; no 500 errors |
| EC-03 | Simultaneous task creation and category deletion (category being assigned) | Task creation fails with 404 for category or succeeds with null category; DB consistent |
| EC-04 | Two concurrent sync pushes from the same user | Both processed; no duplicate tasks; conflict resolution applied |

### Empty States

| Test ID | Scenario | Expected |
|---------|----------|----------|
| EC-05 | Dashboard with zero tasks | Shows empty state illustration, "No tasks yet — create your first task" CTA |
| EC-06 | Task list with no matching filters | Shows "No tasks match your filters" with clear-filters button |
| EC-07 | Search with zero results | Shows "No results for 'xyz'" message |
| EC-08 | Categories list when none created | Shows "Create your first category" prompt |

### Pagination Boundaries

| Test ID | Scenario | Expected |
|---------|----------|----------|
| EC-09 | Request `page=0` | Returns 400 validation error (page must be ≥ 1) |
| EC-10 | Request `limit=0` | Returns 400 validation error (limit must be ≥ 1) |
| EC-11 | Request `limit=1000` | Capped at max limit (100); returns at most 100 items |
| EC-12 | Request page beyond total pages | Returns 200 with empty `data` array and correct `total` |
| EC-13 | Exactly one page of results (total = limit) | No "next page" indicator; pagination metadata correct |

### Auth Token Expiry

| Test ID | Scenario | Expected |
|---------|----------|----------|
| EC-14 | Access token expires mid-session | Frontend intercepts 401, uses refresh token, retries original request |
| EC-15 | Both access and refresh tokens expired | Redirect to login page with "Session expired" message |
| EC-16 | Refresh token used twice (replay attack) | Second use returns 401; all tokens for user revoked (token family rotation) |
| EC-17 | Malformed JWT (tampered payload) | Returns 401 with `AUTH_INVALID_TOKEN` |

### Input Validation Boundaries

| Test ID | Scenario | Expected |
|---------|----------|----------|
| EC-18 | Task title with exactly 255 characters | Accepted |
| EC-19 | Task title with 256 characters | Rejected with validation error |
| EC-20 | Task description with 5000 characters | Accepted (max limit) |
| EC-21 | Task description with 5001 characters | Rejected with validation error |
| EC-22 | Category name with special characters (emoji, unicode) | Accepted; stored and displayed correctly |
| EC-23 | Due date in far future (year 2099) | Accepted |
| EC-24 | Due date as invalid string ("not-a-date") | Rejected with validation error |
| EC-25 | Email with plus addressing (`user+tag@example.com`) | Accepted as valid email |
| EC-26 | Password with exactly 8 characters meeting all rules | Accepted |
| EC-27 | Password with 7 characters | Rejected |
| EC-28 | XSS payload in task title (`<script>alert(1)</script>`) | Stored safely; rendered as escaped text, not executed |

### Offline / PWA Edge Cases

| Test ID | Scenario | Expected |
|---------|----------|----------|
| EC-29 | Create task offline, then create same task online before sync | Sync detects duplicate (client-generated ID), deduplicates |
| EC-30 | Edit task offline that was deleted on server | Sync returns conflict; UI shows "task was deleted" notice |
| EC-31 | App opened after 30 days offline | Service worker serves cached shell; sync pulls all changes since last sync timestamp |
| EC-32 | Service worker update available | User prompted to refresh; new SW activates on next navigation |

---

## Coverage Requirements

| Layer | Metric | Target | Rationale |
|-------|--------|--------|-----------|
| **Backend services** (`src/services/`) | Line coverage | ≥ 90% | Core business logic; highest risk |
| **Backend routes** (`src/routes/`) | Line coverage | ≥ 85% | Request validation and routing |
| **Backend middleware** (`src/middleware/`) | Line coverage | ≥ 90% | Auth and error handling are security-critical |
| **Frontend components** (`src/components/`) | Line coverage | ≥ 80% | UI rendering logic |
| **Frontend pages** (`src/pages/`) | Line coverage | ≥ 75% | Pages are covered more by E2E than unit tests |
| **Frontend stores** (`src/store/`) | Line coverage | ≥ 85% | State management is business-critical |
| **Frontend API services** (`src/services/`) | Line coverage | ≥ 80% | API integration layer |
| **Utility functions** (`src/utils/`) | Line coverage | ≥ 95% | Pure functions, easy to test exhaustively |
| **Overall project** | Line coverage | ≥ 80% | Industry standard for application code |

### Excluded from Coverage

| Exclusion | Reason |
|-----------|--------|
| `src/main.ts` (backend entry) | Server bootstrap code; tested implicitly by integration tests |
| `vite.config.ts`, `tailwind.config.ts` | Build configuration, not runtime code |
| `src/migrations/` | Auto-generated migration files |
| `*.d.ts` type declaration files | No runtime behavior |
| `src/serviceWorker.ts` registration | Tested via E2E Playwright, not unit-testable |

---

## CI Integration

### Pipeline Stages

┌─────────┐    ┌───────────┐    ┌─────────────┐    ┌──────────┐    ┌────────────┐
│  Lint   │ →  │   Unit    │ →  │ Integration │ →  │   E2E    │ →  │  Deploy    │
│         │    │  Tests    │    │   Tests     │    │  Tests   │    │ (staging)  │
└─────────┘    └───────────┘    └─────────────┘    └──────────┘    └────────────┘

| Stage | Runs | Parallelization | Timeout | Blocking? |
|-------|------|----------------|---------|-----------|
| **Lint** | `eslint . && tsc --noEmit` | Single job | 2 min | Yes — any lint error blocks pipeline |
| **Unit Tests** | `vitest run --coverage` | 4 parallel shards (by file hash) | 5 min | Yes — any failure blocks |
| **Integration Tests** | `vitest run --project=integration` | 2 parallel shards | 5 min | Yes — any failure blocks |
| **E2E Tests** | `playwright test` | 3 workers (Chromium, WebKit, mobile Chrome) | 10 min | Yes — any failure blocks |
| **Coverage Gate** | `c8 check-coverage` | Single job | 30 sec | Yes — below thresholds blocks merge |
| **Deploy to Staging** | Build + deploy | Single job | 5 min | N/A (only on `main` branch) |

### Trigger Rules

| Event | Stages Run |
|-------|-----------|
| Pull request opened/updated | Lint → Unit → Integration → E2E → Coverage Gate |
| Push to `main` | All stages + Deploy to Staging |
| Nightly schedule (02:00 UTC) | Full suite + Performance tests + Security scan |

### Flakiness Policy

1. **Automatic retry**: E2E tests get 1 automatic retry on failure (Playwright `retries: 1`).
2. **Flaky test quarantine**: If a test fails intermittently 3+ times in 7 days, it is moved to a `@flaky` tag and excluded from blocking pipeline. A ticket is created to fix it within 5 business days.
3. **No flaky unit/integration tests**: Unit and integration tests must be deterministic. Any flaky unit test is a bug and must be fixed immediately.
4. **Time-dependent tests**: All tests use mocked clocks (`vi.useFakeTimers()`) for date-dependent logic. No reliance on wall-clock time.

---

## Performance Tests

### Load Test Scenarios (k6)

| Test ID | Scenario | VUs | Duration | Acceptance Threshold |
|---------|----------|-----|----------|---------------------|
| PT-01 | Dashboard load | 50 concurrent users | 3 min | p95 < 200ms, p99 < 500ms |
| PT-02 | Task list with filters | 50 concurrent users | 3 min | p95 < 300ms, p99 < 700ms |
| PT-03 | Full-text search | 30 concurrent users | 3 min | p95 < 400ms, p99 < 1000ms |
| PT-04 | Task CRUD cycle (create→read→update→delete) | 20 concurrent users | 5 min | p95 < 250ms per operation |
| PT-05 | Auth flow (register→login→refresh→logout) | 30 concurrent users | 3 min | p95 < 300ms per step |
| PT-06 | Sync push with 50 offline changes | 10 concurrent users | 2 min | p95 < 2000ms |

### Frontend Performance

| Test ID | Metric | Threshold | Tool |
|---------|--------|-----------|------|
| PT-F01 | Largest Contentful Paint (LCP) | < 1.0s | Lighthouse CI |
| PT-F02 | First Input Delay (FID) | < 100ms | Lighthouse CI |
| PT-F03 | Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse CI |
| PT-F04 | Time to Interactive (TTI) | < 1.5s | Lighthouse CI |
| PT-F05 | Bundle size (gzipped) | < 150KB JS + 30KB CSS | `vite build` + `bundlesize` |
| PT-F06 | Page load time (3G throttled) | < 3s | Playwright network emulation |

### Database Performance

| Test ID | Query | Threshold | Notes |
|---------|-------|-----------|-------|
| PT-DB01 | Dashboard — today's tasks (Q2) | < 5ms for 1000 tasks | Indexed on `user_id + due_date + status` |
| PT-DB02 | Dashboard — overdue tasks (Q3) | < 5ms for 1000 tasks | Same index |
| PT-DB03 | Task list with filters (Q5) | < 10ms for 1000 tasks | Composite index |
| PT-DB04 | Full-text search (Q6) | < 20ms for 1000 tasks | FTS5 virtual table |
| PT-DB05 | Token refresh lookup (Q7) | < 2ms | Indexed on token hash |

---

## Security Tests

### Authentication Bypass Attempts

| Test ID | Attack | Expected Defense |
|---------|--------|-----------------|
| ST-01 | Access protected endpoint without token | 401 Unauthorized |
| ST-02 | Use token signed with different secret | 401 Invalid token |
| ST-03 | Use token with `alg: none` (JWT algorithm confusion) | 401 Invalid token (library rejects `none` algorithm) |
| ST-04 | Brute-force login (>5 attempts) | 429 Rate limited after 5 failed attempts; 15-min lockout |
| ST-05 | Use refresh token as access token | 401 (different token structure/claims) |
| ST-06 | Access another user's task by guessing task ID | 403 Forbidden (ownership check) |
| ST-07 | Enumerate valid emails via registration error messages | Registration returns generic error that doesn't confirm email existence |

### Injection Tests

| Test ID | Attack | Expected Defense |
|---------|--------|-----------------|
| ST-08 | SQL injection in search query (`'; DROP TABLE tasks;--`) | Parameterized queries prevent execution; search returns no results |
| ST-09 | SQL injection in task title | Stored safely via parameterized insert; no SQL execution |
| ST-10 | XSS in task title (`<img onerror=alert(1) src=x>`) | React auto-escapes JSX output; no script execution |
| ST-11 | XSS in category name | Same React escaping defense |
| ST-12 | NoSQL-style injection in JSON body (`{ "$gt": "" }`) | Express JSON parser + validation rejects; SQLite not vulnerable to NoSQL injection |
| ST-13 | Path traversal in API routes (`/api/v1/tasks/../../admin`) | Express routing ignores traversal; returns 404 |

### OWASP Top 10 (2021) Checklist

| # | Category | Test | Status |
|---|----------|------|--------|
| A01 | Broken Access Control | ST-06: Cross-user task access; ownership verified per request | Covered |
| A02 | Cryptographic Failures | Verify bcrypt rounds ≥ 10; JWT uses HS256 with 256-bit+ secret; no secrets in client bundle | Covered |
| A03 | Injection | ST-08, ST-09: SQL injection via parameterized queries; ST-10, ST-11: XSS via React escaping | Covered |
| A04 | Insecure Design | Rate limiting on auth endpoints; account lockout after failed attempts | Covered |
| A05 | Security Misconfiguration | Verify no stack traces in production errors; CORS restricted to app origin; security headers set (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection) | Covered |
| A06 | Vulnerable Components | `npm audit` in CI pipeline; Dependabot/Renovate for dependency updates | Covered |
| A07 | Auth Failures | ST-01–ST-07: Token validation, brute force protection, secure token storage | Covered |
| A08 | Data Integrity Failures | Verify JWT signature validation; no `eval()` or `Function()` usage in codebase | Covered |
| A09 | Logging Failures | Verify auth events logged (login, failed login, token refresh); no PII in logs | Covered |
| A10 | SSRF | N/A — TaskFlow v1 makes no server-side outbound HTTP requests | Not applicable |

### Additional Security Tests

| Test ID | Test | Expected |
|---------|------|----------|
| ST-14 | Verify `HttpOnly`, `Secure`, `SameSite=Strict` on refresh token cookie | Cookie not accessible via JavaScript; sent only over HTTPS |
| ST-15 | Verify CORS rejects requests from unauthorized origins | `Access-Control-Allow-Origin` only includes app domain |
| ST-16 | Verify `Content-Security-Policy` header present | CSP prevents inline scripts and unauthorized resource loading |
| ST-17 | Verify `Referrer-Policy: strict-origin-when-cross-origin` | Referrer not leaked to third parties |
| ST-18 | Verify no sensitive data in URL query parameters | Auth tokens never in URL; passwords never in GET requests |
| ST-19 | Verify password not returned in any API response | User objects omit `passwordHash` field |
| ST-20 | Run `npm audit --production` with zero high/critical vulnerabilities | All high/critical vulns resolved or mitigated |

---

## Open Questions

| # | Question | Impact | Proposed Resolution |
|---|----------|--------|-------------------|
| OQ-1 | Should offline sync conflicts show a UI resolution dialog or auto-resolve with last-write-wins? | Affects E2E test cases EC-29, EC-30 and E2E-A03 | Recommend last-write-wins for v1 with a toast notification showing what was overwritten |
| OQ-2 | What is the maximum number of tasks per user before performance degrades? | Affects PT-DB01–DB04 thresholds | Propose testing up to 10,000 tasks; set soft limit warning at 5,000 |
| OQ-3 | Should the full-text search index description field or only title? | Affects UT-T21 and search performance | SRS says title + description; confirm with product manager the FTS5 virtual table covers both columns |
| OQ-4 | How should the app behave when SQLite file becomes corrupted? | Not currently tested | Propose backup-restore mechanism documented in 04_db_architect.md; add a smoke test that verifies backup recovery |
| OQ-5 | Should E2E tests run against Chromium only or also WebKit/Firefox? | Affects CI time (3× with all browsers) | Recommend Chromium + mobile WebKit for CI; full cross-browser nightly |
| OQ-6 | Is there a specific mobile browser version matrix to support? | Affects E2E device emulation targets | Propose: iOS Safari 16+, Android Chrome 110+; test via Playwright device emulation |
| OQ-7 | Should rate limiting tests use real timers or mocked timers? | Affects test reliability and speed | Recommend mocked timers for unit tests; real timers for one dedicated integration test |