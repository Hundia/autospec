# ShopFlow Sprint 0 - Foundation Sprint

## Sprint Overview

**Sprint Goal:** Establish project infrastructure, database schema, and core authentication system.

**Duration:** 2 weeks

**Key Deliverables:**
- Next.js frontend with TypeScript and TailwindCSS
- Express.js backend with TypeScript
- PostgreSQL database with user tables
- Complete authentication system (register, login, logout, refresh, password reset)
- Redis session caching
- API rate limiting

---

## Ticket Breakdown

### SF-001: Initialize Next.js project with TypeScript and TailwindCSS

**Objective:** Create the frontend project foundation with proper configuration.

**Implementation Steps:**
1. Create Next.js 14 project with App Router
2. Configure TypeScript with strict mode
3. Install and configure TailwindCSS
4. Set up path aliases (@/ for src/)
5. Create .env.local template

**Acceptance Criteria:**
- [ ] `npm run dev` starts development server
- [ ] TypeScript compilation without errors
- [ ] TailwindCSS styles apply correctly
- [ ] Path aliases work in imports

---

### SF-002: Set up ESLint, Prettier, and Husky pre-commit hooks

**Objective:** Ensure code quality and consistency across the team.

**Implementation Steps:**
1. Install ESLint with Next.js and TypeScript plugins
2. Configure Prettier with consistent settings
3. Install and configure Husky
4. Add lint-staged for pre-commit checks
5. Create .eslintrc.json and .prettierrc files

**Configuration:**
```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "off"
  }
}
```

**Acceptance Criteria:**
- [ ] `npm run lint` passes without errors
- [ ] Pre-commit hook blocks commits with lint errors
- [ ] Prettier formats code on save

---

### SF-003: Configure project directory structure per spec

**Objective:** Set up the folder structure as defined in the frontend spec.

**Directory Structure:**
```
src/
├── app/
│   ├── (shop)/
│   │   └── page.tsx
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   └── layout.tsx
├── components/
│   ├── ui/
│   ├── forms/
│   ├── layout/
│   ├── product/
│   ├── cart/
│   └── checkout/
├── hooks/
├── lib/
├── services/
├── stores/
├── types/
└── styles/
```

**Acceptance Criteria:**
- [ ] All directories created with index files
- [ ] Components folder has subdirectories
- [ ] Types folder has base type definitions

---

### SF-004: Set up Express.js backend with TypeScript

**Objective:** Create the backend API foundation.

**Implementation Steps:**
1. Initialize Node.js project
2. Install Express.js and TypeScript
3. Configure tsconfig.json
4. Set up development with ts-node-dev
5. Create basic server.ts entry point
6. Configure CORS and JSON body parsing
7. Set up error handling middleware

**File Structure:**
```
server/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   └── server.ts
├── package.json
└── tsconfig.json
```

**Acceptance Criteria:**
- [ ] `npm run dev` starts server on port 4000
- [ ] Health check endpoint returns 200
- [ ] TypeScript compilation succeeds

---

### SF-005: Configure PostgreSQL database connection with Prisma ORM

**Objective:** Set up database connectivity and ORM.

**Implementation Steps:**
1. Install Prisma CLI and client
2. Initialize Prisma with PostgreSQL
3. Configure DATABASE_URL in .env
4. Create base schema.prisma file
5. Set up Prisma client singleton

**Code Example:**
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Acceptance Criteria:**
- [ ] Prisma connects to PostgreSQL
- [ ] `npx prisma db push` works
- [ ] Prisma Studio accessible

---

### SF-006: Create database migration for users table

**Objective:** Define and create the users table schema.

**Schema Definition:**
```prisma
model User {
  id                  String    @id @default(uuid())
  email               String    @unique
  passwordHash        String    @map("password_hash")
  firstName           String    @map("first_name")
  lastName            String    @map("last_name")
  phone               String?
  role                UserRole  @default(CUSTOMER)
  emailVerified       Boolean   @default(false) @map("email_verified")
  emailVerifiedAt     DateTime? @map("email_verified_at")
  acceptsMarketing    Boolean   @default(false) @map("accepts_marketing")
  lastLoginAt         DateTime? @map("last_login_at")
  failedLoginAttempts Int       @default(0) @map("failed_login_attempts")
  lockedUntil         DateTime? @map("locked_until")
  createdAt           DateTime  @default(now()) @map("created_at")
  updatedAt           DateTime  @updatedAt @map("updated_at")
  deletedAt           DateTime? @map("deleted_at")

  @@map("users")
}

enum UserRole {
  CUSTOMER
  MERCHANT
  ADMIN
}
```

**Acceptance Criteria:**
- [ ] Migration creates users table
- [ ] All columns match spec
- [ ] Indexes created properly

---

### SF-007: Create database migration for user_addresses table

**Objective:** Define the user addresses schema.

**Schema Definition:**
```prisma
model UserAddress {
  id          String      @id @default(uuid())
  userId      String      @map("user_id")
  addressType AddressType @default(SHIPPING) @map("address_type")
  isDefault   Boolean     @default(false) @map("is_default")
  firstName   String      @map("first_name")
  lastName    String      @map("last_name")
  company     String?
  addressLine1 String     @map("address_line_1")
  addressLine2 String?    @map("address_line_2")
  city        String
  state       String
  postalCode  String      @map("postal_code")
  countryCode String      @map("country_code") @db.Char(2)
  phone       String?
  createdAt   DateTime    @default(now()) @map("created_at")
  updatedAt   DateTime    @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_addresses")
}

enum AddressType {
  SHIPPING
  BILLING
}
```

**Acceptance Criteria:**
- [ ] Migration creates user_addresses table
- [ ] Foreign key to users works
- [ ] Cascade delete configured

---

### SF-008: Create database migration for user_sessions table

**Objective:** Store refresh tokens and session data.

**Schema Definition:**
```prisma
model UserSession {
  id               String    @id @default(uuid())
  userId           String    @map("user_id")
  refreshTokenHash String    @map("refresh_token_hash")
  userAgent        String?   @map("user_agent")
  ipAddress        String?   @map("ip_address")
  lastActiveAt     DateTime  @default(now()) @map("last_active_at")
  expiresAt        DateTime  @map("expires_at")
  revokedAt        DateTime? @map("revoked_at")
  createdAt        DateTime  @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_sessions")
}
```

**Acceptance Criteria:**
- [ ] Migration creates user_sessions table
- [ ] Index on refreshTokenHash
- [ ] Expiration tracking works

---

### SF-009: Implement JWT authentication middleware

**Objective:** Create middleware to verify and decode JWT tokens.

**Implementation Steps:**
1. Install jsonwebtoken and bcrypt
2. Create JWT utility functions (sign, verify)
3. Create auth middleware
4. Handle token expiration gracefully

**Code Example:**
```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'No token provided' },
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
    };

    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'TOKEN_EXPIRED', message: 'Token is invalid or expired' },
    });
  }
};
```

**Acceptance Criteria:**
- [ ] Valid tokens pass middleware
- [ ] Invalid tokens return 401
- [ ] Expired tokens handled gracefully
- [ ] User data attached to request

---

### SF-010: Implement POST /api/v1/auth/register endpoint

**Objective:** Allow new users to create accounts.

**Implementation Steps:**
1. Create auth controller
2. Implement input validation (email, password strength)
3. Hash password with bcrypt
4. Create user record
5. Generate access and refresh tokens
6. Return user data and tokens

**Validation Rules:**
- Email: Required, valid format, unique
- Password: Min 8 chars, 1 uppercase, 1 number, 1 special
- firstName: Required, 1-50 chars
- lastName: Required, 1-50 chars

**Response Format:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_abc123",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "tokens": {
      "accessToken": "eyJ...",
      "refreshToken": "eyJ...",
      "expiresIn": 3600
    }
  }
}
```

**Acceptance Criteria:**
- [ ] Creates user with hashed password
- [ ] Returns valid JWT tokens
- [ ] Validates input properly
- [ ] Returns 409 for duplicate email

---

### SF-011: Implement POST /api/v1/auth/login endpoint

**Objective:** Authenticate users and issue tokens.

**Implementation Steps:**
1. Validate credentials
2. Check for account lockout
3. Verify password with bcrypt
4. Increment/reset failed attempts
5. Generate tokens
6. Update lastLoginAt

**Security Features:**
- Lock account after 5 failed attempts
- Lock duration: 15 minutes
- Track failed attempts

**Acceptance Criteria:**
- [ ] Valid credentials return tokens
- [ ] Invalid credentials return 401
- [ ] Account lockout works after 5 attempts
- [ ] lastLoginAt updated on success

---

### SF-012: Implement POST /api/v1/auth/logout endpoint

**Objective:** Invalidate user's refresh token.

**Implementation Steps:**
1. Require authentication
2. Mark session as revoked
3. Return success message

**Acceptance Criteria:**
- [ ] Session marked as revoked
- [ ] Revoked token cannot be used
- [ ] Returns 200 on success

---

### SF-013: Implement POST /api/v1/auth/refresh endpoint

**Objective:** Issue new access token using refresh token.

**Implementation Steps:**
1. Validate refresh token
2. Check if session exists and not revoked
3. Check if session not expired
4. Generate new access token
5. Update session lastActiveAt

**Acceptance Criteria:**
- [ ] Valid refresh token returns new access token
- [ ] Revoked sessions rejected
- [ ] Expired sessions rejected

---

### SF-014: Implement GET /api/v1/auth/me endpoint

**Objective:** Return current user's profile.

**Implementation Steps:**
1. Require authentication
2. Fetch user by ID from token
3. Return user data (exclude sensitive fields)

**Acceptance Criteria:**
- [ ] Returns user profile
- [ ] Password hash not included
- [ ] Requires valid token

---

### SF-015: Implement password reset flow

**Objective:** Allow users to reset forgotten passwords.

**Endpoints:**
- POST /api/v1/auth/forgot-password
- POST /api/v1/auth/reset-password

**Implementation Steps:**
1. Create password_resets table migration
2. Generate secure reset token
3. Store hashed token with expiration (1 hour)
4. Send reset email (mock for now)
5. Verify token and update password

**Acceptance Criteria:**
- [ ] Reset token generated and stored
- [ ] Token expires after 1 hour
- [ ] Password updated with valid token
- [ ] Token marked as used

---

### SF-016: Create Zustand auth store with login/logout actions

**Objective:** Manage authentication state on frontend.

**Implementation:**
```typescript
// src/stores/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        // Implementation
      },

      register: async (data) => {
        // Implementation
      },

      logout: async () => {
        // Implementation
      },

      refreshToken: async () => {
        // Implementation
      },

      setUser: (user) => set({ user, isAuthenticated: !!user }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
    }
  )
);
```

**Acceptance Criteria:**
- [ ] Login stores user and token
- [ ] Logout clears state
- [ ] State persists in localStorage
- [ ] Token refresh works

---

### SF-017: Build Login page UI with form validation

**Objective:** Create the login page per UI spec.

**Components Needed:**
- Form container
- Email input
- Password input
- Remember me checkbox
- Forgot password link
- Submit button
- Social login buttons (placeholder)
- Error display

**Features:**
- Client-side validation
- Loading state on submit
- Error message display
- Redirect to dashboard on success

**Acceptance Criteria:**
- [ ] Matches UI wireframe
- [ ] Form validation works
- [ ] Loading state during submit
- [ ] Error messages display
- [ ] Redirects on success

---

### SF-018: Build Registration page UI with password requirements

**Objective:** Create the registration page per UI spec.

**Features:**
- Password strength indicator
- Real-time validation feedback
- Terms checkbox required
- Marketing opt-in checkbox

**Acceptance Criteria:**
- [ ] Matches UI wireframe
- [ ] Password requirements show dynamically
- [ ] Terms must be accepted
- [ ] Redirects on success

---

### SF-019: Build Forgot Password page UI

**Objective:** Create password reset request page.

**Features:**
- Email input
- Submit button
- Success message
- Back to login link

**Acceptance Criteria:**
- [ ] Simple form layout
- [ ] Success message after submit
- [ ] Validation on email

---

### SF-020: Integrate frontend auth with backend API

**Objective:** Connect auth UI to backend endpoints.

**Implementation Steps:**
1. Create API service layer
2. Configure axios with base URL
3. Add token interceptor
4. Connect login form to API
5. Connect register form to API
6. Handle API errors in UI

**Acceptance Criteria:**
- [ ] Login flow works end-to-end
- [ ] Registration flow works end-to-end
- [ ] Errors displayed properly
- [ ] Tokens stored and used

---

### SF-021: Set up Redis for session caching

**Objective:** Configure Redis for session and cache storage.

**Implementation Steps:**
1. Install ioredis
2. Create Redis client singleton
3. Configure connection settings
4. Implement session storage helpers

**Acceptance Criteria:**
- [ ] Redis connection works
- [ ] Session can be stored/retrieved
- [ ] Error handling for connection issues

---

### SF-022: Implement API rate limiting middleware

**Objective:** Prevent API abuse with rate limiting.

**Configuration:**
- Auth endpoints: 5 requests/minute
- General API: 100 requests/minute
- Use Redis for distributed counting

**Implementation:**
```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redis } from '../lib/redis';

export const authLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:auth:',
  }),
  windowMs: 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many requests' },
  },
});

export const apiLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:api:',
  }),
  windowMs: 60 * 1000,
  max: 100,
});
```

**Acceptance Criteria:**
- [ ] Rate limiting headers returned
- [ ] 429 returned when limit exceeded
- [ ] Redis stores counts

---

### SF-023: Set up Jest testing framework for frontend

**Objective:** Configure testing infrastructure for React components.

**Implementation Steps:**
1. Install Jest and React Testing Library
2. Configure jest.config.js
3. Set up test utilities
4. Create example test

**Acceptance Criteria:**
- [ ] `npm test` runs tests
- [ ] React components can be tested
- [ ] Coverage reports generated

---

### SF-024: Set up Jest testing framework for backend

**Objective:** Configure testing infrastructure for API.

**Implementation Steps:**
1. Install Jest and supertest
2. Configure jest.config.js
3. Set up test database
4. Create test utilities

**Acceptance Criteria:**
- [ ] `npm test` runs tests
- [ ] API endpoints can be tested
- [ ] Database isolated for tests

---

### SF-025: Write unit tests for auth endpoints

**Objective:** Ensure auth endpoints work correctly.

**Test Cases:**
- Register with valid data
- Register with invalid email
- Register with weak password
- Register with existing email
- Login with valid credentials
- Login with invalid credentials
- Login with locked account
- Token refresh with valid token
- Token refresh with expired token
- Logout invalidates session

**Acceptance Criteria:**
- [ ] All test cases pass
- [ ] Edge cases covered
- [ ] 80%+ coverage

---

## Sprint 0 Completion Checklist

- [ ] Frontend project running with hot reload
- [ ] Backend API running and healthy
- [ ] Database connected and migrated
- [ ] User registration works
- [ ] User login works
- [ ] Token refresh works
- [ ] Password reset works
- [ ] Rate limiting active
- [ ] All tests passing

---

## Notes for Implementation

1. **Environment Variables:**
   - DATABASE_URL
   - REDIS_URL
   - JWT_SECRET
   - JWT_EXPIRES_IN
   - REFRESH_TOKEN_EXPIRES_IN

2. **Security Considerations:**
   - Never log passwords or tokens
   - Use HTTPS in production
   - Validate all inputs
   - Sanitize error messages

3. **Dependencies to Install:**

   Frontend:
   ```
   next react react-dom typescript tailwindcss
   zustand @tanstack/react-query axios
   react-hook-form zod @hookform/resolvers
   ```

   Backend:
   ```
   express typescript ts-node-dev
   @prisma/client prisma
   jsonwebtoken bcryptjs ioredis
   express-rate-limit rate-limit-redis
   cors helmet dotenv
   ```

---

*End of Sprint 0 Prompt*
