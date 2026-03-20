# SPEC: Backend Lead - TaskFlow

**Version:** 1.0
**Created:** 2026-01-21
**Owner:** Backend Team

---

## 1. Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      TASKFLOW ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐                                              │
│   │   Clients    │                                              │
│   │  (Web App)   │                                              │
│   └──────┬───────┘                                              │
│          │ HTTPS                                                 │
│          ▼                                                       │
│   ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
│   │    Routes    │────►│  Controllers │────►│   Services   │   │
│   │  (Express)   │     │              │     │              │   │
│   └──────────────┘     └──────────────┘     └──────┬───────┘   │
│                                                     │           │
│                                              ┌──────▼───────┐   │
│                                              │ Repositories │   │
│                                              │              │   │
│                                              └──────┬───────┘   │
│                                                     │           │
│                                              ┌──────▼───────┐   │
│                                              │  PostgreSQL  │   │
│                                              │  (Database)  │   │
│                                              └──────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | Node.js | 20.x LTS |
| Framework | Express | 4.x |
| Language | TypeScript | 5.x |
| Database | PostgreSQL | 15+ |
| ORM/Query Builder | Drizzle ORM | 0.29+ |
| Validation | Zod | 3.x |
| Testing | Vitest | 1.x |

---

## 2. Project Structure

```
api/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── env.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── task.controller.ts
│   │   └── project.controller.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── task.service.ts
│   │   └── project.service.ts
│   ├── repositories/
│   │   ├── user.repository.ts
│   │   ├── task.repository.ts
│   │   └── project.repository.ts
│   ├── routes/
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── task.routes.ts
│   │   └── project.routes.ts
│   ├── schemas/
│   │   ├── auth.schema.ts
│   │   ├── task.schema.ts
│   │   └── project.schema.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── db/
│   │   ├── schema.ts
│   │   └── migrations/
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── hash.ts
│   │   └── jwt.ts
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── unit/
│   └── integration/
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

---

## 3. API Design

### Base URL
```
/api/v1
```

### Response Format

**Success Response:**
```json
{
  "data": {
    "id": "uuid",
    "field": "value"
  },
  "meta": {
    "timestamp": "2026-01-21T00:00:00Z"
  }
}
```

**List Response:**
```json
{
  "data": [
    { "id": "uuid", "field": "value" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

**Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Title is required",
    "details": [
      { "field": "title", "message": "Required" }
    ]
  }
}
```

---

## 4. Authentication

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login user | No |
| POST | /auth/logout | Logout user | Yes |
| POST | /auth/refresh | Refresh token | Yes |
| GET | /auth/me | Get current user | Yes |

### JWT Implementation

```typescript
interface TokenPayload {
  sub: string;        // User ID
  email: string;
  iat: number;
  exp: number;
}
```

- Access Token: 15 minute expiry
- Refresh Token: 7 day expiry
- Stored in HTTP-only cookies

---

## 5. API Endpoints

### Tasks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /tasks | List user's tasks | Yes |
| GET | /tasks/:id | Get task by ID | Yes |
| POST | /tasks | Create task | Yes |
| PATCH | /tasks/:id | Update task | Yes |
| DELETE | /tasks/:id | Delete task | Yes |
| PATCH | /tasks/:id/complete | Toggle completion | Yes |

### Request/Response Examples

#### POST /tasks

**Request:**
```json
{
  "title": "Review pull request",
  "description": "Check the auth implementation PR",
  "dueDate": "2026-01-25T17:00:00Z",
  "priority": "high",
  "projectId": "uuid-optional"
}
```

**Response (201):**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Review pull request",
    "description": "Check the auth implementation PR",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-01-25T17:00:00Z",
    "projectId": null,
    "userId": "user-uuid",
    "createdAt": "2026-01-21T10:00:00Z",
    "updatedAt": "2026-01-21T10:00:00Z"
  }
}
```

#### GET /tasks

**Query Parameters:**
- `status`: Filter by status (pending, in_progress, completed)
- `priority`: Filter by priority (low, medium, high, urgent)
- `projectId`: Filter by project
- `search`: Search in title/description
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sortBy`: Sort field (createdAt, dueDate, priority)
- `sortOrder`: asc or desc

### Projects (v1.1)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /projects | List user's projects | Yes |
| GET | /projects/:id | Get project by ID | Yes |
| POST | /projects | Create project | Yes |
| PATCH | /projects/:id | Update project | Yes |
| DELETE | /projects/:id | Delete project | Yes |

---

## 6. Validation Schemas

### Task Schema

```typescript
import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(5000).optional(),
  dueDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  projectId: z.string().uuid().optional(),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(['pending', 'in_progress', 'completed']).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
```

### Auth Schema

```typescript
export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number'),
  name: z.string().min(1).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
```

---

## 7. Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | Not authorized for resource |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict |
| INTERNAL_ERROR | 500 | Server error |

### Error Class

```typescript
export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 400,
    public details?: unknown
  ) {
    super(message);
  }
}
```

---

## 8. Security

### Password Hashing
- Algorithm: bcrypt
- Cost factor: 12

### Rate Limiting
- Auth endpoints: 5 requests/minute
- API endpoints: 100 requests/minute

### Headers
```typescript
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
}));
```

---

## 9. Testing

### Unit Test Example

```typescript
describe('TaskService', () => {
  describe('createTask', () => {
    it('should create task for user', async () => {
      const task = await taskService.createTask(userId, {
        title: 'Test task',
        priority: 'high',
      });

      expect(task).toMatchObject({
        title: 'Test task',
        priority: 'high',
        status: 'pending',
        userId,
      });
    });
  });
});
```

### Integration Test Example

```typescript
describe('POST /api/v1/tasks', () => {
  it('should create task when authenticated', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'New task' });

    expect(response.status).toBe(201);
    expect(response.body.data.title).toBe('New task');
  });

  it('should return 401 when not authenticated', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .send({ title: 'New task' });

    expect(response.status).toBe(401);
  });
});
```

---

## 10. Environment Variables

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow

# JWT
JWT_SECRET=your-secret-key-min-32-characters
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=another-secret-key-min-32-characters
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

---

*This spec is maintained by the Backend team. Last updated: 2026-01-21*
