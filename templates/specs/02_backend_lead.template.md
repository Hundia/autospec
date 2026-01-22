# SPEC: Backend Lead

**Version:** 1.0
**Created:** {{DATE}}
**Owner:** Backend Team

---

## 1. Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌──────────────┐                                              │
│   │   Clients    │                                              │
│   │  (Web/Mobile)│                                              │
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
│          ┌──────────────┐               ┌──────────▼─────────┐ │
│          │    Redis     │◄──────────────│    PostgreSQL      │ │
│          │   (Cache)    │               │    (Database)      │ │
│          └──────────────┘               └────────────────────┘ │
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
| Cache | Redis | 7.x |
| Validation | Zod | 3.x |
| Testing | Vitest | 1.x |

---

## 2. Project Structure

```
api/
├── src/
│   ├── config/           # Configuration files
│   │   ├── database.ts   # Database connection
│   │   ├── redis.ts      # Redis client
│   │   └── env.ts        # Environment variables
│   ├── controllers/      # Request handlers
│   │   └── user.controller.ts
│   ├── services/         # Business logic
│   │   └── user.service.ts
│   ├── repositories/     # Database access
│   │   └── user.repository.ts
│   ├── routes/           # Route definitions
│   │   ├── index.ts      # Route aggregator
│   │   └── user.routes.ts
│   ├── schemas/          # Zod validation schemas
│   │   └── user.schema.ts
│   ├── middleware/       # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   ├── utils/            # Helper functions
│   │   └── hash.ts
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
└── tsconfig.json
```

---

## 3. API Design Principles

### Base URL
```
/api/v1
```

### HTTP Methods

| Method | Usage | Example |
|--------|-------|---------|
| GET | Retrieve resource(s) | GET /users, GET /users/123 |
| POST | Create resource | POST /users |
| PUT | Replace resource | PUT /users/123 |
| PATCH | Partial update | PATCH /users/123 |
| DELETE | Remove resource | DELETE /users/123 |

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
    "limit": 20,
    "totalPages": 5
  }
}
```

**Error Response:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required",
    "details": [
      { "field": "email", "message": "Required" }
    ]
  }
}
```

---

## 4. Authentication & Authorization

### Authentication Flow

```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Client   │────►│  /login    │────►│   Return   │
│            │     │            │     │   JWT      │
└────────────┘     └────────────┘     └────────────┘
      │                                      │
      │                                      │
      ▼                                      ▼
┌────────────┐     ┌────────────┐     ┌────────────┐
│  Include   │────►│   Verify   │────►│  Process   │
│  JWT in    │     │   Token    │     │  Request   │
│  Header    │     │            │     │            │
└────────────┘     └────────────┘     └────────────┘
```

### JWT Structure

```typescript
interface TokenPayload {
  sub: string;        // User ID
  email: string;
  role: string;
  iat: number;        // Issued at
  exp: number;        // Expiration
}
```

### Auth Headers

```
Authorization: Bearer <jwt_token>
```

### Role-Based Access

| Role | Permissions |
|------|-------------|
| user | Read own data, update own profile |
| admin | Full access to all resources |

---

## 5. API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Login user | No |
| POST | /auth/logout | Logout user | Yes |
| POST | /auth/refresh | Refresh token | Yes |
| POST | /auth/forgot-password | Request password reset | No |
| POST | /auth/reset-password | Reset password | No |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /users | List all users | Admin |
| GET | /users/:id | Get user by ID | Yes |
| GET | /users/me | Get current user | Yes |
| PATCH | /users/:id | Update user | Yes |
| DELETE | /users/:id | Delete user | Admin |

### {{RESOURCE_NAME}}

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /{{resource}} | List all {{resource}} | Yes |
| GET | /{{resource}}/:id | Get {{resource}} by ID | Yes |
| POST | /{{resource}} | Create {{resource}} | Yes |
| PATCH | /{{resource}}/:id | Update {{resource}} | Yes |
| DELETE | /{{resource}}/:id | Delete {{resource}} | Yes |

---

## 6. Request/Response Examples

### POST /auth/register

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2026-01-21T00:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### POST /auth/login

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

## 7. Error Handling

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Request validation failed |
| UNAUTHORIZED | 401 | Not authenticated |
| FORBIDDEN | 403 | Not authorized |
| NOT_FOUND | 404 | Resource not found |
| CONFLICT | 409 | Resource conflict (e.g., duplicate) |
| INTERNAL_ERROR | 500 | Server error |

### Error Middleware

```typescript
// middleware/error.middleware.ts
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details
      }
    });
  }

  // Log unexpected errors
  console.error(err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred'
    }
  });
};
```

---

## 8. Validation Schemas

### User Schema

```typescript
// schemas/user.schema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase')
    .regex(/[0-9]/, 'Password must contain number'),
  name: z.string().min(1, 'Name is required').max(100)
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
```

---

## 9. Service Layer Pattern

```typescript
// services/user.service.ts
import { UserRepository } from '../repositories/user.repository';
import { hashPassword, verifyPassword } from '../utils/hash';
import { AppError } from '../utils/errors';

export class UserService {
  constructor(private userRepo: UserRepository) {}

  async createUser(data: CreateUserInput) {
    // Check for existing user
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new AppError('CONFLICT', 'Email already registered');
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await this.userRepo.create({
      ...data,
      passwordHash
    });

    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: User) {
    const { passwordHash, ...safe } = user;
    return safe;
  }
}
```

---

## 10. Security Requirements

### Input Validation
- All inputs validated via Zod schemas
- SQL injection prevented via parameterized queries
- XSS prevented via output encoding

### Authentication
- JWT tokens with short expiry (15min access, 7d refresh)
- Password hashing with bcrypt (cost factor 12)
- Rate limiting on auth endpoints

### Headers
```typescript
// Security headers middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));
```

### Environment Variables
- Never commit secrets
- Use `.env.example` for documentation
- Validate all env vars at startup

---

## 11. Testing Strategy

### Unit Tests

```typescript
// tests/unit/user.service.test.ts
describe('UserService', () => {
  let service: UserService;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepo = createMockRepo();
    service = new UserService(mockRepo);
  });

  describe('createUser', () => {
    it('should create user with hashed password', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({ id: '1', email: 'test@test.com' });

      const result = await service.createUser({
        email: 'test@test.com',
        password: 'Password123!'
      });

      expect(result).not.toHaveProperty('passwordHash');
      expect(mockRepo.create).toHaveBeenCalled();
    });
  });
});
```

### Integration Tests

```typescript
// tests/integration/auth.spec.ts
describe('POST /auth/register', () => {
  it('should register new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'new@example.com',
        password: 'Password123!',
        name: 'New User'
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('token');
  });
});
```

---

## 12. Performance Considerations

### Caching Strategy

| Data | TTL | Strategy |
|------|-----|----------|
| User sessions | 15 min | Redis |
| Config data | 1 hour | Redis |
| API responses | Varies | HTTP Cache-Control |

### Database Optimization

- Use indexes on frequently queried columns
- Implement pagination for list endpoints
- Use connection pooling

---

*This spec is maintained by the Backend team. Last updated: {{DATE}}*
