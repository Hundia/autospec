---
role: backend_lead
spec_version: "1.0"
generated_by: autospec v0.2.0
model: auto
provider: claude-code
source_srs: srs-simple.md
source_hash: "sha256:7458b2f5b29602d300ec5766ab196f4f026b7aca8470f82fe507d40b7c83ea36"
generated_at: 2026-03-21T09:34:19.615Z
---

# 02 — Backend Lead Specification: TaskFlow

## Architecture Overview

### Tech Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Runtime | Node.js | 20 LTS | Stable, TypeScript-native, large ecosystem |
| Framework | Express.js | 4.x | Lightweight, minimal overhead for a single-user app; avoids NestJS complexity for a solo-developer scope |
| Language | TypeScript | 5.x | Type safety across full stack, shared interfaces with React frontend (`03_frontend_lead.md`) |
| Database | SQLite | 3.x (via `better-sqlite3`) | Zero-config, file-based, perfect for single-user deployment; no DB server needed |
| ORM | Drizzle ORM | 0.30+ | Type-safe SQL, lightweight, excellent SQLite support, migration tooling |
| Auth | JWT (jsonwebtoken) + bcrypt | — | Stateless auth suitable for PWA; bcrypt for password hashing |
| Validation | Zod | 3.x | Runtime schema validation, TypeScript type inference, shared with frontend |
| Testing | Vitest + Supertest | — | Fast, TypeScript-native test runner |

### Architecture Pattern

┌─────────────────────────────────────────────────┐
│                  Express App                     │
│                                                  │
│  Middleware Stack:                                │
│  ┌─────────┐ ┌──────────┐ ┌───────────────────┐ │
│  │  CORS   │→│ RateLimit│→│ JSON Body Parser  │ │
│  └─────────┘ └──────────┘ └───────────────────┘ │
│                     │                            │
│  ┌──────────────────▼──────────────────────────┐ │
│  │              Router Layer                    │ │
│  │  /api/v1/auth/*  /api/v1/tasks/*            │ │
│  │  /api/v1/categories/*  /api/v1/dashboard/*  │ │
│  └──────────────────┬──────────────────────────┘ │
│                     │                            │
│  ┌──────────────────▼──────────────────────────┐ │
│  │           Auth Middleware (JWT)              │ │
│  └──────────────────┬──────────────────────────┘ │
│                     │                            │
│  ┌──────────────────▼──────────────────────────┐ │
│  │          Validation (Zod schemas)           │ │
│  └──────────────────┬──────────────────────────┘ │
│                     │                            │
│  ┌──────────────────▼──────────────────────────┐ │
│  │            Service Layer                     │ │
│  │  AuthService  TaskService  CategoryService  │ │
│  │  DashboardService  SearchService            │ │
│  └──────────────────┬──────────────────────────┘ │
│                     │                            │
│  ┌──────────────────▼──────────────────────────┐ │
│  │         Drizzle ORM → SQLite                │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘

**Global API prefix:** `/api/v1`

**Rationale:** A layered architecture with clear separation of routes → middleware → services → data access. Single-user constraint eliminates the need for multi-tenancy, connection pooling, or horizontal scaling. SQLite runs in-process, making the entire backend deployable as a single binary/process.

---

## API Endpoints

All paths are prefixed with `/api/v1`. Rate limits are per-IP unless noted.

### Authentication

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| POST | `/auth/register` | Public | 5/min | Register new user |
| POST | `/auth/login` | Public | 10/min | Login, returns tokens |
| POST | `/auth/refresh` | Public (refresh token in body) | 10/min | Refresh access token |
| POST | `/auth/logout` | User JWT | 10/min | Invalidate refresh token |

#### POST `/auth/register`

Used by **Noa** and **Amit** during first-time onboarding (Flow 1 in `01_product_manager.md`).

**Request:**
```json
{
  "email": "string (valid email, max 255 chars)",
  "password": "string (min 8 chars, max 128 chars)",
  "name": "string (min 1, max 100 chars)"
}

**Response (201):**
```json
{
  "user": {
    "id": "string (UUID)",
    "email": "string",
    "name": "string",
    "createdAt": "string (ISO 8601)"
  },
  "accessToken": "string (JWT)",
  "refreshToken": "string (opaque)"
}

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid email format, password too short, missing fields |
| 409 | `EMAIL_ALREADY_EXISTS` | Email already registered |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many registration attempts |

#### POST `/auth/login`

**Request:**
```json
{
  "email": "string",
  "password": "string"
}

**Response (200):**
```json
{
  "user": {
    "id": "string (UUID)",
    "email": "string",
    "name": "string",
    "createdAt": "string (ISO 8601)"
  },
  "accessToken": "string (JWT)",
  "refreshToken": "string (opaque)"
}

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Missing fields |
| 401 | `INVALID_CREDENTIALS` | Wrong email or password |
| 429 | `RATE_LIMIT_EXCEEDED` | Too many login attempts |

#### POST `/auth/refresh`

**Request:**
```json
{
  "refreshToken": "string"
}

**Response (200):**
```json
{
  "accessToken": "string (JWT)",
  "refreshToken": "string (opaque, rotated)"
}

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 401 | `INVALID_REFRESH_TOKEN` | Token expired, revoked, or malformed |

#### POST `/auth/logout`

**Request:**
```json
{
  "refreshToken": "string"
}

**Response (204):** No content.

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 401 | `UNAUTHORIZED` | Missing or invalid access token |

---

### Tasks

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| GET | `/tasks` | User JWT | 60/min | List tasks with filters |
| POST | `/tasks` | User JWT | 30/min | Create a task |
| GET | `/tasks/:id` | User JWT | 60/min | Get single task |
| PATCH | `/tasks/:id` | User JWT | 30/min | Update task fields |
| DELETE | `/tasks/:id` | User JWT | 30/min | Delete a task |
| PATCH | `/tasks/:id/status` | User JWT | 60/min | Toggle task status |

#### GET `/tasks`

Used by **Noa** during morning triage (Flow 2) and by **Amit** for filtering assignments. Consumed by the frontend task list and dashboard components (`03_frontend_lead.md`).

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | `incomplete \| complete` | — | Filter by status |
| `priority` | `low \| medium \| high` | — | Filter by priority |
| `categoryId` | `string (UUID)` | — | Filter by category |
| `q` | `string` | — | Full-text search on title + description |
| `dueDate` | `string (ISO date)` | — | Filter tasks due on this date |
| `dueBefore` | `string (ISO date)` | — | Tasks due before this date |
| `dueAfter` | `string (ISO date)` | — | Tasks due after this date |
| `overdue` | `boolean` | — | If `true`, tasks where dueDate < today and status = incomplete |
| `sortBy` | `dueDate \| priority \| createdAt` | `createdAt` | Sort field |
| `sortOrder` | `asc \| desc` | `desc` | Sort direction |
| `page` | `integer (≥1)` | `1` | Page number |
| `limit` | `integer (1–100)` | `20` | Items per page |

**Response (200):**
```json
{
  "tasks": [
    {
      "id": "string (UUID)",
      "title": "string",
      "description": "string | null",
      "status": "incomplete | complete",
      "priority": "low | medium | high",
      "dueDate": "string (ISO 8601) | null",
      "categoryId": "string (UUID) | null",
      "category": {
        "id": "string (UUID)",
        "name": "string",
        "color": "string (hex)"
      } | null,
      "completedAt": "string (ISO 8601) | null",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid query params |
| 401 | `UNAUTHORIZED` | Missing/invalid JWT |

#### POST `/tasks`

Used by **Noa** after morning triage and by **Amit** when creating assignment tasks (Flow 1).

**Request:**
```json
{
  "title": "string (min 1, max 255 chars, required)",
  "description": "string (max 2000 chars) | null",
  "priority": "low | medium | high (default: medium)",
  "dueDate": "string (ISO 8601 date) | null",
  "categoryId": "string (UUID) | null"
}

**Response (201):**
```json
{
  "id": "string (UUID)",
  "title": "string",
  "description": "string | null",
  "status": "incomplete",
  "priority": "low | medium | high",
  "dueDate": "string (ISO 8601) | null",
  "categoryId": "string (UUID) | null",
  "category": { "id": "string", "name": "string", "color": "string" } | null,
  "completedAt": null,
  "createdAt": "string (ISO 8601)",
  "updatedAt": "string (ISO 8601)"
}

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Title missing, invalid priority, invalid date format |
| 401 | `UNAUTHORIZED` | Missing/invalid JWT |
| 404 | `CATEGORY_NOT_FOUND` | Referenced categoryId doesn't exist |

#### GET `/tasks/:id`

**Response (200):** Single task object (same shape as list item).

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 401 | `UNAUTHORIZED` | Missing/invalid JWT |
| 404 | `TASK_NOT_FOUND` | Task does not exist or belongs to another user |

#### PATCH `/tasks/:id`

**Request:** Partial update — any subset of task fields:
```json
{
  "title?": "string (min 1, max 255)",
  "description?": "string (max 2000) | null",
  "priority?": "low | medium | high",
  "dueDate?": "string (ISO 8601) | null",
  "categoryId?": "string (UUID) | null"
}

**Response (200):** Updated task object.

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid field values |
| 401 | `UNAUTHORIZED` | Missing/invalid JWT |
| 404 | `TASK_NOT_FOUND` | Task not found |
| 404 | `CATEGORY_NOT_FOUND` | Referenced categoryId doesn't exist |

#### DELETE `/tasks/:id`

**Response (204):** No content.

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 401 | `UNAUTHORIZED` | Missing/invalid JWT |
| 404 | `TASK_NOT_FOUND` | Task not found |

#### PATCH `/tasks/:id/status`

Dedicated endpoint for toggling status, used heavily by **Noa** and **Amit** in dashboard quick-actions.

**Request:**
```json
{
  "status": "incomplete | complete"
}

**Response (200):** Updated task object. When `status` changes to `complete`, `completedAt` is set to current timestamp. When changed to `incomplete`, `completedAt` is set to `null`.

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid status value |
| 401 | `UNAUTHORIZED` | Missing/invalid JWT |
| 404 | `TASK_NOT_FOUND` | Task not found |

---

### Categories

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| GET | `/categories` | User JWT | 60/min | List all categories |
| POST | `/categories` | User JWT | 20/min | Create a category |
| PATCH | `/categories/:id` | User JWT | 20/min | Update a category |
| DELETE | `/categories/:id` | User JWT | 20/min | Delete a category |

#### GET `/categories`

**Response (200):**
```json
{
  "categories": [
    {
      "id": "string (UUID)",
      "name": "string",
      "color": "string (hex, e.g. #4A90D9)",
      "taskCount": "number",
      "createdAt": "string (ISO 8601)",
      "updatedAt": "string (ISO 8601)"
    }
  ]
}

No pagination — categories are expected to be a small set (<50). `taskCount` is computed as an aggregate of incomplete tasks in that category.

#### POST `/categories`

**Request:**
```json
{
  "name": "string (min 1, max 50 chars, required)",
  "color": "string (hex color, e.g. #FF5733, required)"
}

**Response (201):** Category object.

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Missing name, invalid color format |
| 401 | `UNAUTHORIZED` | Missing/invalid JWT |
| 409 | `CATEGORY_NAME_EXISTS` | User already has a category with this name |

#### PATCH `/categories/:id`

**Request:** Partial — `name` and/or `color`.

**Response (200):** Updated category object.

#### DELETE `/categories/:id`

Deleting a category sets `categoryId = null` on all associated tasks (soft dissociation, not cascade delete). See `04_db_architect.md` for ON DELETE SET NULL constraint.

**Response (204):** No content.

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 401 | `UNAUTHORIZED` | Missing/invalid JWT |
| 404 | `CATEGORY_NOT_FOUND` | Category not found |

---

### Dashboard

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| GET | `/dashboard` | User JWT | 30/min | Aggregated dashboard data |

#### GET `/dashboard`

Primary endpoint for the dashboard view consumed by `03_frontend_lead.md`. Used by **Noa** during morning triage (Flow 2) and by **Amit** to check due assignments.

**Response (200):**
```json
{
  "todayTasks": [
    { /* Task object */ }
  ],
  "overdueTasks": [
    { /* Task object */ }
  ],
  "stats": {
    "completedToday": "number",
    "completedThisWeek": "number",
    "completedTotal": "number",
    "totalTasks": "number",
    "incompleteTasks": "number"
  }
}

`todayTasks`: Tasks with `dueDate = today` and `status = incomplete`, sorted by priority (high → low).
`overdueTasks`: Tasks with `dueDate < today` and `status = incomplete`, sorted by dueDate ascending.

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 401 | `UNAUTHORIZED` | Missing/invalid JWT |

---

### Sync (Offline Support)

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| POST | `/sync` | User JWT | 10/min | Push offline changes, pull updates |

#### POST `/sync`

Supports the PWA offline workflow described in `01_product_manager.md` Flow 4. The frontend (`03_frontend_lead.md`) queues mutations while offline and pushes them when connectivity resumes.

**Request:**
```json
{
  "lastSyncedAt": "string (ISO 8601) | null",
  "changes": [
    {
      "type": "create | update | delete",
      "entity": "task | category",
      "tempId": "string (client-generated UUID, for creates)",
      "id": "string (UUID, for updates/deletes)",
      "data": { /* entity fields */ },
      "timestamp": "string (ISO 8601, when change was made offline)"
    }
  ]
}

**Response (200):**
```json
{
  "syncedAt": "string (ISO 8601)",
  "idMappings": [
    { "tempId": "string", "serverId": "string (UUID)" }
  ],
  "serverChanges": [
    {
      "type": "create | update | delete",
      "entity": "task | category",
      "id": "string (UUID)",
      "data": { /* entity fields */ },
      "updatedAt": "string (ISO 8601)"
    }
  ],
  "conflicts": [
    {
      "clientChange": { /* change object */ },
      "serverVersion": { /* current server state */ },
      "resolution": "server_wins"
    }
  ]
}

**Conflict resolution strategy:** Server-wins (last-write-wins based on `updatedAt` timestamp). If a task was modified on both client and server, the server version takes precedence and the conflict is reported so the frontend can notify the user.

**Error Cases:**
| Status | Code | Description |
|--------|------|-------------|
| 400 | `VALIDATION_ERROR` | Malformed changes array |
| 401 | `UNAUTHORIZED` | Missing/invalid JWT |
| 413 | `PAYLOAD_TOO_LARGE` | More than 100 changes in a single sync |

---

### Health

| Method | Path | Auth | Rate Limit | Description |
|--------|------|------|------------|-------------|
| GET | `/health` | Public | None | Health check |

#### GET `/health`

**Response (200):**
```json
{
  "status": "ok",
  "version": "string",
  "uptime": "number (seconds)"
}

---

## Data Models

All models correspond to tables defined in `04_db_architect.md`. TypeScript interfaces are shared between backend services and can be imported by the frontend (`03_frontend_lead.md`).

### User

```typescript
interface User {
  id: string;            // UUID, primary key
  email: string;         // unique, max 255 chars
  name: string;          // max 100 chars
  passwordHash: string;  // bcrypt hash (never returned in API responses)
  createdAt: string;     // ISO 8601
  updatedAt: string;     // ISO 8601
}

### RefreshToken

```typescript
interface RefreshToken {
  id: string;            // UUID, primary key
  userId: string;        // FK → User.id
  token: string;         // opaque token (SHA-256 hash stored)
  expiresAt: string;     // ISO 8601
  createdAt: string;     // ISO 8601
  revokedAt: string | null; // ISO 8601, set on logout
}

### Task

```typescript
interface Task {
  id: string;            // UUID, primary key
  userId: string;        // FK → User.id, NOT NULL
  title: string;         // max 255 chars, NOT NULL
  description: string | null; // max 2000 chars
  status: 'incomplete' | 'complete'; // default: 'incomplete'
  priority: 'low' | 'medium' | 'high'; // default: 'medium'
  dueDate: string | null;   // ISO 8601 date (date only, no time)
  categoryId: string | null; // FK → Category.id, ON DELETE SET NULL
  completedAt: string | null; // ISO 8601, set when status → complete
  createdAt: string;     // ISO 8601
  updatedAt: string;     // ISO 8601
}

### Category

```typescript
interface Category {
  id: string;            // UUID, primary key
  userId: string;        // FK → User.id, NOT NULL
  name: string;          // max 50 chars, NOT NULL
  color: string;         // hex color string (#RRGGBB), NOT NULL
  createdAt: string;     // ISO 8601
  updatedAt: string;     // ISO 8601
}

// Unique constraint: (userId, name) — no duplicate category names per user

### API Response Types

```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface TaskListResponse {
  tasks: TaskWithCategory[];
  pagination: PaginationMeta;
}

interface TaskWithCategory extends Omit<Task, 'userId' | 'passwordHash'> {
  category: Pick<Category, 'id' | 'name' | 'color'> | null;
}

interface CategoryWithCount extends Omit<Category, 'userId'> {
  taskCount: number;
}

interface DashboardResponse {
  todayTasks: TaskWithCategory[];
  overdueTasks: TaskWithCategory[];
  stats: {
    completedToday: number;
    completedThisWeek: number;
    completedTotal: number;
    totalTasks: number;
    incompleteTasks: number;
  };
}

interface AuthResponse {
  user: Pick<User, 'id' | 'email' | 'name' | 'createdAt'>;
  accessToken: string;
  refreshToken: string;
}

interface SyncRequest {
  lastSyncedAt: string | null;
  changes: SyncChange[];
}

interface SyncChange {
  type: 'create' | 'update' | 'delete';
  entity: 'task' | 'category';
  tempId?: string;
  id?: string;
  data?: Record<string, unknown>;
  timestamp: string;
}

interface SyncResponse {
  syncedAt: string;
  idMappings: Array<{ tempId: string; serverId: string }>;
  serverChanges: SyncChange[];
  conflicts: Array<{
    clientChange: SyncChange;
    serverVersion: Record<string, unknown>;
    resolution: 'server_wins';
  }>;
}

---

## Auth Requirements

### Strategy: JWT Access + Opaque Refresh Tokens

| Token | Format | Lifetime | Storage |
|-------|--------|----------|---------|
| Access Token | JWT (HS256) | 15 minutes | Frontend: memory (not localStorage) — see `03_frontend_lead.md` |
| Refresh Token | Opaque (crypto.randomBytes) | 7 days | Frontend: httpOnly cookie or localStorage; Backend: hashed in `refresh_tokens` table |

**Rationale:** Short-lived JWTs minimize the window of compromise. Refresh token rotation (new refresh token on each use, old one revoked) prevents replay attacks. For a single-user PWA, the risk profile is low, but we follow best practices.

### JWT Payload

```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "iat": 1710000000,
  "exp": 1710000900
}

### Authorization Rules

Since TaskFlow v1 is single-user with no roles, authorization is simple ownership verification:

| Resource | Rule |
|----------|------|
| Tasks | User can only access tasks where `task.userId === jwt.sub` |
| Categories | User can only access categories where `category.userId === jwt.sub` |
| Dashboard | Scoped to authenticated user's data |
| Sync | Scoped to authenticated user's data |

**No admin role** in v1. If a second user registers, they see only their own data. The schema supports multi-user even though the app targets single-user usage.

### Auth Middleware

```typescript
// Applied to all routes except /auth/* and /health
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHORIZED' } });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: { code: 'INVALID_TOKEN' } });
  }
}

### Password Policy

- Minimum 8 characters
- Maximum 128 characters
- Hashed with bcrypt, 12 salt rounds
- No complexity requirements in v1 (keep friction low for **Amit** and **Noa**)

---

## Service Layer

### AuthService

| Method | Description |
|--------|-------------|
| `register(email, password, name)` | Hash password, create user, generate tokens |
| `login(email, password)` | Verify credentials, generate tokens |
| `refreshToken(token)` | Validate refresh token, rotate, return new pair |
| `logout(refreshToken)` | Revoke refresh token |
| `hashPassword(password)` | bcrypt hash with 12 rounds |
| `verifyPassword(password, hash)` | bcrypt compare |
| `generateTokens(userId, email)` | Create JWT access + opaque refresh token |

### TaskService

| Method | Description |
|--------|-------------|
| `list(userId, filters, pagination)` | Query tasks with filtering, sorting, pagination |
| `create(userId, data)` | Create task, validate categoryId if provided |
| `getById(userId, taskId)` | Get single task with ownership check |
| `update(userId, taskId, data)` | Partial update with ownership check |
| `delete(userId, taskId)` | Delete task with ownership check |
| `updateStatus(userId, taskId, status)` | Toggle status, manage completedAt timestamp |
| `search(userId, query)` | Full-text search on title and description using SQLite FTS5 |

### CategoryService

| Method | Description |
|--------|-------------|
| `list(userId)` | All categories with task counts |
| `create(userId, data)` | Create category, enforce unique name per user |
| `update(userId, categoryId, data)` | Update with ownership check |
| `delete(userId, categoryId)` | Delete category, nullify tasks' categoryId |

### DashboardService

| Method | Description |
|--------|-------------|
| `getDashboard(userId)` | Aggregate today's tasks, overdue tasks, and completion stats |

Internally calls TaskService queries. Stats computation:
- `completedToday`: tasks where `completedAt` is today
- `completedThisWeek`: tasks where `completedAt` is within the current ISO week (Mon–Sun)
- `completedTotal`: all tasks with `status = complete`

### SyncService

| Method | Description |
|--------|-------------|
| `processSync(userId, request)` | Apply client changes, detect conflicts, return server changes since lastSyncedAt |
| `applyChange(userId, change)` | Apply a single create/update/delete operation |
| `getChangesSince(userId, since)` | Query tasks and categories modified after `since` timestamp |
| `resolveConflict(clientChange, serverState)` | Server-wins resolution |

---

## Integration Points

### Third-Party Services

TaskFlow v1 has **no external service dependencies** beyond the core stack. This is intentional for the solo-developer, offline-first constraint.

| Integration | Status | Notes |
|-------------|--------|-------|
| Email verification | **Out of scope v1** | No email service; trust registration |
| Push notifications | **Out of scope v1** | Could add Web Push API in v2 |
| OAuth providers | **Out of scope v1** | Email/password only per SRS |
| Cloud backup | **Out of scope v1** | SQLite file can be manually backed up |

### Internal Integration Points

| Integration | Description |
|-------------|-------------|
| Frontend (React) | REST API consumed via fetch/axios; see `03_frontend_lead.md` for client-side API layer |
| Service Worker | Frontend service worker caches API responses for offline support; sync endpoint handles reconnection |
| SQLite file | Single `taskflow.db` file; see `04_db_architect.md` for schema, indexes, and migration strategy |

### Webhook / Event System

None in v1. The app is synchronous request-response only.

---

## Error Handling

### Error Response Format

All errors follow a consistent JSON structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": {} // optional, for validation errors
  }
}

### Validation Error Detail Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "fields": {
        "title": "Title is required",
        "priority": "Must be one of: low, medium, high"
      }
    }
  }
}

### Error Code Registry

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request body/params failed Zod validation |
| `UNAUTHORIZED` | 401 | Missing or expired access token |
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `INVALID_TOKEN` | 401 | Malformed or expired JWT |
| `INVALID_REFRESH_TOKEN` | 401 | Refresh token expired/revoked |
| `TASK_NOT_FOUND` | 404 | Task doesn't exist or wrong owner |
| `CATEGORY_NOT_FOUND` | 404 | Category doesn't exist or wrong owner |
| `EMAIL_ALREADY_EXISTS` | 409 | Registration with duplicate email |
| `CATEGORY_NAME_EXISTS` | 409 | Duplicate category name for user |
| `PAYLOAD_TOO_LARGE` | 413 | Sync payload exceeds 100 changes |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Unexpected server error (details logged, not exposed) |

### Global Error Handler

```typescript
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details }
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' }
  });
}

### Retry Strategy

No server-side retry logic is needed for v1 (no external services). The frontend (`03_frontend_lead.md`) handles retry logic for failed API calls, with exponential backoff for the sync endpoint.

---

## Performance Considerations

### Caching Strategy

| Resource | Cache Strategy | TTL | Rationale |
|----------|---------------|-----|-----------|
| Dashboard | No server-side cache | — | SQLite queries are fast enough (<10ms) for a single-user dataset |
| Task list | No server-side cache | — | Data changes frequently; SQLite is fast |
| Categories | No server-side cache | — | Small dataset, infrequent changes |
| Static assets | Served by frontend/Nginx | 1 year | Versioned filenames via Vite build |

**Rationale:** SQLite operates in-process with no network overhead. For a single-user app with <10,000 tasks, query times will be sub-millisecond. Server-side caching adds complexity without measurable benefit. The frontend handles its own caching via service worker (`03_frontend_lead.md`).

### Rate Limiting

Implemented via `express-rate-limit`:

| Endpoint Group | Window | Max Requests | Key |
|---------------|--------|-------------|-----|
| Auth (register) | 1 min | 5 | IP |
| Auth (login/refresh) | 1 min | 10 | IP |
| Task mutations | 1 min | 30 | User ID |
| Task reads | 1 min | 60 | User ID |
| Category mutations | 1 min | 20 | User ID |
| Dashboard | 1 min | 30 | User ID |
| Sync | 1 min | 10 | User ID |

### Pagination

- Default page size: 20 items
- Maximum page size: 100 items
- Cursor-based pagination is not needed for v1 (offset pagination is simpler and sufficient for <10K tasks)
- Dashboard endpoints return all today/overdue tasks without pagination (expected to be <50 items)

### Database Performance

- FTS5 virtual table for full-text search on `title` and `description` (see `04_db_architect.md`)
- Indexes on: `tasks(userId, status)`, `tasks(userId, dueDate)`, `tasks(userId, categoryId)`, `tasks(userId, updatedAt)`
- WAL mode enabled for concurrent reads during sync operations
- All date comparisons use ISO 8601 strings (SQLite text comparison works correctly for ISO dates)

### Request Size Limits

- JSON body limit: 1 MB (Express default, sufficient for all endpoints)
- Sync endpoint: max 100 changes per request

---

## Security Checklist

Based on OWASP Top 10 (2021), applied to TaskFlow:

| # | OWASP Category | Mitigation | Status |
|---|---------------|------------|--------|
| A01 | Broken Access Control | All endpoints check `userId` ownership; tasks/categories scoped to authenticated user; no horizontal privilege escalation possible | ✅ Designed |
| A02 | Cryptographic Failures | Passwords hashed with bcrypt (12 rounds); JWT signed with HS256; refresh tokens stored as SHA-256 hashes; HTTPS enforced | ✅ Designed |
| A03 | Injection | Drizzle ORM parameterized queries (no raw SQL); Zod input validation on all endpoints; FTS5 queries use parameterized `MATCH` | ✅ Designed |
| A04 | Insecure Design | Principle of least privilege (user sees only own data); rate limiting on auth endpoints; refresh token rotation | ✅ Designed |
| A05 | Security Misconfiguration | CORS restricted to frontend origin; security headers via `helmet`; no debug info in production errors; `.env` not committed | ✅ Designed |
| A06 | Vulnerable Components | Minimal dependencies; npm audit in CI; Dependabot or Renovate for updates | 🔲 CI setup |
| A07 | Auth Failures | Account lockout after 5 failed logins (15 min); bcrypt timing-safe comparison; rate limiting on login | ✅ Designed |
| A08 | Data Integrity Failures | No deserialization of untrusted data; Zod validation on all inputs; no eval/Function constructors | ✅ Designed |
| A09 | Logging & Monitoring | Request logging (method, path, status, duration); auth failure logging; no sensitive data in logs | ✅ Designed |
| A10 | SSRF | No server-side HTTP requests to external services in v1; no URL inputs processed | N/A |

### Additional Security Measures

- **Helmet.js** for HTTP security headers (X-Content-Type-Options, X-Frame-Options, CSP, etc.)
- **CORS** restricted to the frontend origin only
- **JWT secret** loaded from environment variable, minimum 32 characters
- **No sensitive data in JWT payload** — only `sub` (user ID) and `email`
- **Password not returned** in any API response — `passwordHash` excluded from all serialization
- **SQLite file permissions** set to 600 (owner read/write only)

---

## Open Questions

| # | Question | Impact | Proposed Decision | Needs Input From |
|---|----------|--------|-------------------|-----------------|
| OQ-1 | Should refresh tokens be stored in httpOnly cookies or localStorage? | Security vs PWA offline compatibility | **localStorage** — httpOnly cookies don't work well with service workers intercepting requests. Accept the XSS risk (mitigated by CSP headers). | `03_frontend_lead.md` |
| OQ-2 | Should the sync endpoint support conflict resolution UI, or is server-wins sufficient for v1? | UX complexity | **Server-wins only** for v1. Conflicts are rare in a single-user app (only occurs if user has multiple browser tabs/devices). | `01_product_manager.md` |
| OQ-3 | Should we add request logging to SQLite or just stdout? | Disk usage, debugging | **stdout only** — use PM2 or systemd for log rotation. SQLite DB should only contain application data. | Ops |
| OQ-4 | How should the backend be deployed — PM2, systemd, or Docker? | Ops complexity | **PM2** — simplest for solo developer, auto-restart, log management. Docker is overkill for a single-process SQLite app. | `01_product_manager.md` |
| OQ-5 | Should we pre-create default categories (Work, Personal, Health) on registration? | Onboarding experience | **Yes** — reduces first-time friction for **Noa** and **Amit**. Create 3 default categories with predefined colors. | `01_product_manager.md` |
| OQ-6 | What timezone should be used for "today" in dashboard queries? | Correctness for overdue/today logic | **Client timezone** — frontend sends `timezone` header (e.g., `America/New_York`), backend uses it for date comparisons. Fallback: UTC. | `03_frontend_lead.md` |