# TaskFlow - Sprint 0 Development Execution Prompt

## Context

You are implementing Sprint 0 of TaskFlow, a task management application. This sprint focuses on project setup, authentication, and basic task CRUD operations.

---

## Tech Stack

- **Backend**: Node.js 20, Express.js 4.x, TypeScript 5.x
- **Database**: PostgreSQL 15, Prisma 5.x ORM
- **Frontend**: React 18, Vite 5.x, TypeScript, Tailwind CSS
- **Auth**: JWT (jsonwebtoken), bcryptjs
- **Validation**: Zod
- **Testing**: Vitest, Jest, Supertest

---

## Project Structure

```
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # Route definitions
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── types/           # TypeScript types
│   │   ├── utils/           # Helper functions
│   │   └── index.ts         # Entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── stores/          # Zustand stores
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   └── package.json
└── docker-compose.yml
```

---

## Implementation Tasks

### 1. Backend Setup

Initialize the Express.js backend with TypeScript:

```bash
cd backend
npm init -y
npm install express cors helmet morgan dotenv jsonwebtoken bcryptjs
npm install @prisma/client zod express-rate-limit
npm install -D typescript @types/node @types/express @types/cors
npm install -D @types/jsonwebtoken @types/bcryptjs
npm install -D prisma ts-node-dev jest @types/jest supertest
```

### 2. Prisma Schema

Create the database schema at `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  name         String
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  tasks Task[]

  @@map("users")
}

model Task {
  id          String     @id @default(uuid())
  userId      String     @map("user_id")
  title       String
  description String?
  status      TaskStatus @default(todo)
  priority    Priority   @default(medium)
  dueDate     DateTime?  @map("due_date") @db.Date
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")
  completedAt DateTime?  @map("completed_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([userId, status])
  @@map("tasks")
}

enum TaskStatus {
  todo
  in_progress
  done
}

enum Priority {
  low
  medium
  high
  urgent
}
```

### 3. Authentication Endpoints

Implement the following endpoints:

#### POST /api/v1/auth/register
```typescript
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}

// Response (201)
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2026-01-30T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### POST /api/v1/auth/login
```typescript
// Request
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

// Response (200)
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### GET /api/v1/auth/me (Protected)
```typescript
// Headers
Authorization: Bearer <accessToken>

// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2026-01-30T00:00:00.000Z"
  }
}
```

### 4. Task Endpoints

#### POST /api/v1/tasks (Protected)
```typescript
// Request
{
  "title": "Complete sprint documentation",
  "description": "Write comprehensive docs for Sprint 0",
  "priority": "high",
  "dueDate": "2026-02-15"
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Complete sprint documentation",
    "description": "Write comprehensive docs for Sprint 0",
    "status": "todo",
    "priority": "high",
    "dueDate": "2026-02-15",
    "createdAt": "2026-01-30T00:00:00.000Z"
  }
}
```

#### GET /api/v1/tasks (Protected)
```typescript
// Query params: ?status=todo&priority=high&page=1&limit=20

// Response (200)
{
  "success": true,
  "data": {
    "tasks": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

#### PUT /api/v1/tasks/:id (Protected)
```typescript
// Request
{
  "status": "in_progress"
}

// Response (200)
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Complete sprint documentation",
    "status": "in_progress",
    ...
  }
}
```

#### DELETE /api/v1/tasks/:id (Protected)
```typescript
// Response (200)
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Validation Schemas (Zod)

```typescript
// src/schemas/auth.schema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// src/schemas/task.schema.ts
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(255),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    dueDate: z.string().datetime().optional(),
  }),
});
```

---

## Error Handling

Use consistent error responses:

```typescript
// Error response format
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}

// Error codes
- VALIDATION_ERROR (400)
- UNAUTHORIZED (401)
- FORBIDDEN (403)
- NOT_FOUND (404)
- CONFLICT (409) - e.g., email already exists
- INTERNAL_ERROR (500)
```

---

## Environment Variables

```env
# Backend (.env)
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/taskflow
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

---

## Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: taskflow
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/taskflow
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## Testing Requirements

### Unit Tests
- Auth service: password hashing, token generation
- Task service: CRUD operations

### Integration Tests
- Auth endpoints: register, login, protected routes
- Task endpoints: full CRUD flow

### Test Examples

```typescript
// tests/auth.test.ts
describe('POST /api/v1/auth/register', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Test123!',
        name: 'Test User',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.accessToken).toBeDefined();
  });

  it('should reject duplicate email', async () => {
    // First registration
    await request(app).post('/api/v1/auth/register').send({...});

    // Second registration with same email
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ email: 'test@example.com', ... });

    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe('CONFLICT');
  });
});
```

---

## Checklist Before Completing Sprint 0

- [ ] All migrations applied successfully
- [ ] Auth endpoints working (register, login, me)
- [ ] Task CRUD endpoints working
- [ ] JWT authentication middleware in place
- [ ] Request validation with Zod
- [ ] Unit tests passing (>70% coverage)
- [ ] Integration tests passing
- [ ] ESLint + Prettier passing
- [ ] Docker Compose runs successfully
- [ ] README with setup instructions

---

## Commands Reference

```bash
# Backend
cd backend
npm run dev              # Start dev server
npm run build            # Build for production
npm run test             # Run tests
npm run lint             # Run ESLint
npx prisma migrate dev   # Run migrations
npx prisma generate      # Generate Prisma client
npx prisma studio        # Open Prisma Studio

# Frontend
cd frontend
npm run dev              # Start Vite dev server
npm run build            # Build for production
npm run test             # Run Vitest
npm run lint             # Run ESLint

# Docker
docker-compose up -d     # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
```
