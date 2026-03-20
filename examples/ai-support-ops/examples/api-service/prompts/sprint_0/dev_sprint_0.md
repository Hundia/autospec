# DataHub API Gateway - Sprint 0 Development Execution Prompt

## Context

You are implementing Sprint 0 of DataHub, a centralized API Gateway platform. This sprint focuses on project setup, user authentication, API key management, and rate limiting foundation.

---

## Tech Stack

- **Backend**: Node.js 20, Express.js 4.x, TypeScript 5.x
- **Primary Database**: PostgreSQL 15, Prisma 5.x ORM
- **Cache/Rate Limiting**: Redis 7
- **Auth**: JWT (jsonwebtoken), bcryptjs
- **Validation**: Zod
- **Testing**: Jest, Supertest

---

## Project Structure

```
datahub/
├── src/
│   ├── config/          # Database, Redis, auth config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, rate limit, validation
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── repositories/    # Data access layer
│   ├── schemas/         # Zod validation schemas
│   ├── types/           # TypeScript types
│   ├── utils/           # Helpers (hashing, tokens)
│   └── index.ts         # Entry point
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed rate limit tiers
├── tests/
└── package.json
```

---

## Implementation Tasks

### 1. Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String    @map("password_hash")
  role         UserRole  @default(developer)
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  apiKeys       ApiKey[]
  refreshTokens RefreshToken[]

  @@map("users")
}

enum UserRole {
  admin
  developer
  viewer
}

model ApiKey {
  id            String    @id @default(uuid())
  userId        String    @map("user_id")
  keyHash       String    @unique @map("key_hash")
  name          String
  rateLimitTier String    @default("standard") @map("rate_limit_tier")
  expiresAt     DateTime? @map("expires_at")
  lastUsedAt    DateTime? @map("last_used_at")
  createdAt     DateTime  @default(now()) @map("created_at")
  revokedAt     DateTime? @map("revoked_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([keyHash])
  @@map("api_keys")
}

model RateLimit {
  id              String   @id @default(uuid())
  tierName        String   @unique @map("tier_name")
  requestsPerMin  Int      @map("requests_per_min")
  requestsPerHour Int      @map("requests_per_hour")
  burstLimit      Int      @map("burst_limit")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("rate_limits")
}

model RefreshToken {
  id        String    @id @default(uuid())
  userId    String    @map("user_id")
  tokenHash String    @unique @map("token_hash")
  expiresAt DateTime  @map("expires_at")
  createdAt DateTime  @default(now()) @map("created_at")
  revokedAt DateTime? @map("revoked_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("refresh_tokens")
}
```

### 2. Authentication Endpoints

#### POST /api/v1/auth/register
```typescript
// Request
{
  "email": "developer@example.com",
  "password": "SecurePass123!",
  "role": "developer"  // Optional, defaults to developer
}

// Response (201)
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "developer@example.com",
      "role": "developer",
      "createdAt": "2026-01-30T00:00:00.000Z"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

#### POST /api/v1/auth/login
```typescript
// Request
{
  "email": "developer@example.com",
  "password": "SecurePass123!"
}

// Response (200)
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "developer@example.com",
      "role": "developer"
    },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### 3. API Key Endpoints

#### POST /api/v1/api-keys
```typescript
// Request
{
  "name": "Production API Key",
  "rateLimitTier": "premium",  // Optional
  "expiresAt": "2027-01-30T00:00:00.000Z"  // Optional
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Production API Key",
    "apiKey": "dh_live_a1b2c3d4e5f6...",  // Only shown once!
    "rateLimitTier": "premium",
    "expiresAt": "2027-01-30T00:00:00.000Z",
    "createdAt": "2026-01-30T00:00:00.000Z"
  },
  "warning": "Save this API key securely. It will not be shown again."
}
```

#### GET /api/v1/api-keys
```typescript
// Response (200)
{
  "success": true,
  "data": {
    "apiKeys": [
      {
        "id": "uuid",
        "name": "Production API Key",
        "keyPrefix": "dh_live_a1b2...",  // First 12 chars only
        "rateLimitTier": "premium",
        "expiresAt": "2027-01-30T00:00:00.000Z",
        "lastUsedAt": "2026-01-30T10:30:00.000Z",
        "createdAt": "2026-01-30T00:00:00.000Z",
        "isActive": true
      }
    ]
  }
}
```

#### DELETE /api/v1/api-keys/:id
```typescript
// Response (200)
{
  "success": true,
  "message": "API key revoked successfully"
}
```

### 4. Rate Limit Tiers

#### GET /api/v1/rate-limits
```typescript
// Response (200)
{
  "success": true,
  "data": {
    "tiers": [
      {
        "tierName": "free",
        "requestsPerMin": 60,
        "requestsPerHour": 1000,
        "burstLimit": 10
      },
      {
        "tierName": "standard",
        "requestsPerMin": 300,
        "requestsPerHour": 10000,
        "burstLimit": 50
      },
      {
        "tierName": "premium",
        "requestsPerMin": 1000,
        "requestsPerHour": 50000,
        "burstLimit": 100
      },
      {
        "tierName": "enterprise",
        "requestsPerMin": 5000,
        "requestsPerHour": 200000,
        "burstLimit": 500
      }
    ]
  }
}
```

---

## API Key Generation Strategy

```typescript
// src/utils/apiKey.ts
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const API_KEY_PREFIX = 'dh_live_';

export function generateApiKey(): { key: string; hash: string } {
  // Generate 32 random bytes (256 bits of entropy)
  const randomBytes = crypto.randomBytes(32);
  const keyBody = randomBytes.toString('base64url');

  // Full key returned to user
  const key = `${API_KEY_PREFIX}${keyBody}`;

  // Hash for storage
  const hash = bcrypt.hashSync(key, 10);

  return { key, hash };
}

export function verifyApiKey(key: string, hash: string): boolean {
  return bcrypt.compareSync(key, hash);
}

export function getKeyPrefix(key: string): string {
  return key.substring(0, 12) + '...';
}
```

---

## Rate Limiting Implementation

### Redis Key Structure

```
ratelimit:{api_key_id}:{minute_bucket} -> count
TTL: 120 seconds
```

### Rate Limiter Middleware

```typescript
// src/middleware/rateLimiter.ts
import { Redis } from 'ioredis';
import { Request, Response, NextFunction } from 'express';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export class RateLimiter {
  constructor(private redis: Redis) {}

  async checkLimit(
    apiKeyId: string,
    tier: { requestsPerMin: number; burstLimit: number }
  ): Promise<RateLimitResult> {
    const now = Date.now();
    const minuteBucket = Math.floor(now / 60000);
    const key = `ratelimit:${apiKeyId}:${minuteBucket}`;

    const count = await this.redis.incr(key);

    // Set TTL on first request
    if (count === 1) {
      await this.redis.expire(key, 120);
    }

    const allowed = count <= tier.requestsPerMin;
    const remaining = Math.max(0, tier.requestsPerMin - count);
    const resetAt = (minuteBucket + 1) * 60000;

    return { allowed, remaining, resetAt };
  }
}

export function rateLimitMiddleware(rateLimiter: RateLimiter) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.apiKey; // Set by API key auth middleware

    if (!apiKey) {
      return next(); // No rate limiting for JWT auth
    }

    const result = await rateLimiter.checkLimit(apiKey.id, apiKey.rateLimit);

    // Set headers
    res.setHeader('X-RateLimit-Limit', apiKey.rateLimit.requestsPerMin);
    res.setHeader('X-RateLimit-Remaining', result.remaining);
    res.setHeader('X-RateLimit-Reset', result.resetAt);

    if (!result.allowed) {
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests',
          retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000)
        }
      });
    }

    next();
  };
}
```

---

## Validation Schemas

```typescript
// src/schemas/auth.schema.ts
import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain uppercase letter')
      .regex(/[0-9]/, 'Password must contain number'),
    role: z.enum(['admin', 'developer', 'viewer']).optional(),
  }),
});

// src/schemas/apiKey.schema.ts
export const createApiKeySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name required').max(100),
    rateLimitTier: z.enum(['free', 'standard', 'premium', 'enterprise']).optional(),
    expiresAt: z.string().datetime().optional(),
  }),
});
```

---

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/datahub

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
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
      POSTGRES_DB: datahub
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/datahub
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
```

---

## Seed Script

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed rate limit tiers
  const tiers = [
    { tierName: 'free', requestsPerMin: 60, requestsPerHour: 1000, burstLimit: 10 },
    { tierName: 'standard', requestsPerMin: 300, requestsPerHour: 10000, burstLimit: 50 },
    { tierName: 'premium', requestsPerMin: 1000, requestsPerHour: 50000, burstLimit: 100 },
    { tierName: 'enterprise', requestsPerMin: 5000, requestsPerHour: 200000, burstLimit: 500 },
  ];

  for (const tier of tiers) {
    await prisma.rateLimit.upsert({
      where: { tierName: tier.tierName },
      update: tier,
      create: tier,
    });
  }

  console.log('Seeded rate limit tiers');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## Testing Requirements

### Unit Tests
- Auth service: password hashing, token generation
- API key service: key generation, hashing
- Rate limiter: counter logic

### Integration Tests

```typescript
// tests/auth.test.ts
describe('POST /api/v1/auth/register', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'test@example.com',
        password: 'Test123!',
      });

    expect(response.status).toBe(201);
    expect(response.body.data.accessToken).toBeDefined();
  });
});

// tests/apiKey.test.ts
describe('POST /api/v1/api-keys', () => {
  it('should generate API key', async () => {
    const response = await request(app)
      .post('/api/v1/api-keys')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Key' });

    expect(response.status).toBe(201);
    expect(response.body.data.apiKey).toMatch(/^dh_live_/);
  });
});
```

---

## Commands Reference

```bash
# Setup
npm install
cp .env.example .env

# Database
npx prisma migrate dev
npx prisma generate
npx prisma db seed

# Development
npm run dev

# Testing
npm run test
npm run test:coverage

# Docker
docker-compose up -d
docker-compose logs -f api

# Redis CLI (for debugging)
docker exec -it datahub-redis-1 redis-cli
> KEYS ratelimit:*
> GET ratelimit:xxx:yyy
```

---

## Checklist Before Completing Sprint 0

- [ ] Migrations applied successfully
- [ ] Rate limit tiers seeded
- [ ] Auth endpoints working (register, login, refresh)
- [ ] API key generation working
- [ ] API key revocation working
- [ ] Rate limit headers returned
- [ ] Rate limit 429 response working
- [ ] Unit tests passing
- [ ] Integration tests passing
- [ ] Docker Compose runs successfully
- [ ] README with setup instructions
