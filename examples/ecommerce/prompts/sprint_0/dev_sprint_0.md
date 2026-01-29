# Sprint 0 Development Execution: Foundation

## Environment: claude-code

## Context — Read These Files First

**MANDATORY:** Read ALL these files before writing any code:

### Specs (Read ALL):
- specs/01_product_manager.md   — requirements, personas, user flows
- specs/02_backend_lead.md      — API design, service layer, error handling
- specs/03_frontend_lead.md     — components, state, routing, design tokens
- specs/04_db_architect.md      — database schema, migrations, queries
- specs/05_qa_lead.md           — test strategy, coverage targets
- specs/06_devops_lead.md       — infrastructure, CI/CD, Docker
- specs/10_ui_designer.md       — screens, wireframes, responsive design
- specs/backlog.md              — Sprint 0 tickets (your work items)

### Docs (Read ALL relevant):
- docs/architecture/overview.md     — system architecture
- docs/architecture/backend.md      — backend layer design
- docs/architecture/frontend.md     — frontend component architecture
- docs/architecture/database.md     — ERD, tables, relationships
- docs/architecture/security.md     — auth flow, security rules
- docs/environments/development.md  — local setup prerequisites
- docs/environments/docker.md       — Docker setup
- docs/environments/environment-variables.md — all env vars
- docs/api/reference.md             — endpoint contracts
- docs/testing/strategy.md          — test pyramid, tooling
- docs/testing/unit-tests.md        — unit test patterns
- docs/testing/integration-tests.md — integration test patterns
- docs/project/setup.md             — repo structure, config files
- docs/project/coding-standards.md  — naming conventions, patterns

---

## Your Mission

Execute Sprint 0: Foundation

**Goal:** Establish project infrastructure, database schema, and core authentication system.

---

## Tickets to Complete

| # | Ticket | Owner | Model | Points | Depends |
|---|--------|-------|-------|--------|---------|
| SF-001 | Initialize Next.js project with TypeScript and TailwindCSS | Frontend | Sonnet | 2 | - |
| SF-002 | Set up ESLint, Prettier, and Husky pre-commit hooks | Frontend | Sonnet | 2 | SF-001 |
| SF-003 | Configure project directory structure per spec | Frontend | Sonnet | 1 | SF-001 |
| SF-004 | Set up Express.js backend with TypeScript | Backend | Sonnet | 3 | - |
| SF-005 | Configure PostgreSQL database connection with Prisma ORM | Backend | Sonnet | 3 | SF-004 |
| SF-006 | Create database migration for users table | Backend | Sonnet | 3 | SF-005 |
| SF-007 | Create database migration for user_addresses table | Backend | Sonnet | 2 | SF-006 |
| SF-008 | Create database migration for user_sessions table | Backend | Sonnet | 2 | SF-006 |
| SF-009 | Implement JWT authentication middleware | Backend | Sonnet | 5 | SF-004 |
| SF-010 | Implement POST /api/v1/auth/register endpoint | Backend | Sonnet | 5 | SF-006, SF-009 |
| SF-011 | Implement POST /api/v1/auth/login endpoint | Backend | Sonnet | 5 | SF-006, SF-009 |
| SF-012 | Implement POST /api/v1/auth/logout endpoint | Backend | Sonnet | 2 | SF-009 |
| SF-013 | Implement POST /api/v1/auth/refresh endpoint | Backend | Sonnet | 3 | SF-008, SF-009 |
| SF-014 | Implement GET /api/v1/auth/me endpoint | Backend | Sonnet | 2 | SF-009 |
| SF-015 | Implement password reset flow (forgot/reset endpoints) | Backend | Sonnet | 5 | SF-006 |
| SF-016 | Create Zustand auth store with login/logout actions | Frontend | Sonnet | 3 | SF-001 |
| SF-017 | Build Login page UI with form validation | Frontend | Sonnet | 5 | SF-002, SF-016 |
| SF-018 | Build Registration page UI with password requirements | Frontend | Sonnet | 5 | SF-002, SF-016 |
| SF-019 | Build Forgot Password page UI | Frontend | Sonnet | 3 | SF-002 |
| SF-020 | Integrate frontend auth with backend API | Frontend | Sonnet | 5 | SF-010, SF-011, SF-016, SF-017, SF-018 |
| SF-021 | Set up Redis for session caching | Backend | Sonnet | 3 | SF-004 |
| SF-022 | Implement API rate limiting middleware | Backend | Sonnet | 3 | SF-021 |
| SF-023 | Set up Jest testing framework for frontend | Frontend | Sonnet | 2 | SF-001 |
| SF-024 | Set up Jest testing framework for backend | Backend | Sonnet | 2 | SF-004 |
| SF-025 | Write unit tests for auth endpoints | Backend | Sonnet | 5 | SF-010, SF-011, SF-024 |

---

## Execution Instructions

### For Each Ticket:

1. **Update Status:** Change ticket status to in-progress in specs/backlog.md
2. **Read Relevant Spec:** Find the specific section in the appropriate spec file
3. **Implement:** Write code following patterns in docs/
4. **Test:** Write tests per docs/testing/ patterns
5. **Verify:** Run `npm test`, `npm run lint`, `npm run typecheck`
6. **Commit:** `git commit -m "Complete SF-XXX: [ticket description]"`
7. **Update Status:** Change ticket status to QA Review in specs/backlog.md

---

## Ticket-by-Ticket Breakdown

### Ticket SF-001: Initialize Next.js project with TypeScript and TailwindCSS
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 2

**Spec Reference:** specs/03_frontend_lead.md, Section: Tech Stack

**Implementation Steps:**
1. Create frontend directory: `mkdir -p frontend`
2. Initialize Next.js: `npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir`
3. Configure `next.config.js` for API proxy
4. Set up environment variables in `.env.local`
5. Create basic layout structure

**Files to Create/Modify:**
- `frontend/package.json` — dependencies
- `frontend/next.config.js` — configuration
- `frontend/tailwind.config.ts` — Tailwind config
- `frontend/.env.local` — environment variables
- `frontend/src/app/layout.tsx` — root layout

**Verification:**
```bash
cd frontend && npm run dev
# Open http://localhost:3000 - should see Next.js default page
```

**Dependencies:** None

---

### Ticket SF-002: Set up ESLint, Prettier, and Husky pre-commit hooks
**Owner:** Frontend  |  **Model:** Haiku  |  **Points:** 2

**Spec Reference:** specs/03_frontend_lead.md, Section: Code Quality

**Implementation Steps:**
1. Install Prettier and ESLint plugins
2. Create `.prettierrc` configuration
3. Create `.eslintrc.json` with custom rules
4. Install Husky and lint-staged
5. Configure pre-commit hooks

**Files to Create/Modify:**
- `frontend/.prettierrc` — Prettier config
- `frontend/.eslintrc.json` — ESLint rules
- `frontend/package.json` — add scripts and lint-staged config

**Verification:**
```bash
cd frontend
npm run lint
npm run format:check
```

**Dependencies:** SF-001

---

### Ticket SF-003: Configure project directory structure per spec
**Owner:** Frontend  |  **Model:** Haiku  |  **Points:** 1

**Spec Reference:** specs/03_frontend_lead.md, Section: Directory Structure

**Implementation Steps:**
1. Create component directories (atoms, molecules, organisms, templates)
2. Create feature directories (auth, cart, products, checkout, account)
3. Create shared directories (hooks, lib, types, utils, stores)
4. Create placeholder index files

**Files to Create:**
- `frontend/src/components/atoms/.gitkeep`
- `frontend/src/components/molecules/.gitkeep`
- `frontend/src/components/organisms/.gitkeep`
- `frontend/src/components/templates/.gitkeep`
- `frontend/src/features/auth/`
- `frontend/src/features/cart/`
- `frontend/src/features/products/`
- `frontend/src/hooks/`
- `frontend/src/lib/`
- `frontend/src/stores/`
- `frontend/src/types/`

**Verification:**
```bash
cd frontend && find src -type d | head -20
```

**Dependencies:** SF-001

---

### Ticket SF-004: Set up Express.js backend with TypeScript
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Spec Reference:** specs/02_backend_lead.md, Section: Tech Stack

**Implementation Steps:**
1. Create backend directory and initialize npm
2. Install Express, TypeScript, and dependencies
3. Configure `tsconfig.json` for Node.js
4. Create src directory structure (routes, controllers, services, middleware)
5. Create Express app with basic middleware (cors, helmet, json parser)
6. Add health check endpoint
7. Create development and build scripts

**Files to Create/Modify:**
- `backend/package.json` — dependencies and scripts
- `backend/tsconfig.json` — TypeScript config
- `backend/src/index.ts` — entry point
- `backend/src/app.ts` — Express app setup
- `backend/src/routes/index.ts` — route aggregator
- `backend/src/routes/health.routes.ts` — health check
- `backend/src/middleware/error.middleware.ts` — error handler
- `backend/src/config/index.ts` — configuration

**Verification:**
```bash
cd backend
npm run dev
# In another terminal:
curl http://localhost:3001/health
# Expected: {"status":"ok","timestamp":"..."}
```

**Dependencies:** None

---

### Ticket SF-005: Configure PostgreSQL database connection with Prisma ORM
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Spec Reference:** specs/04_db_architect.md, Section: ORM Setup

**Implementation Steps:**
1. Install Prisma CLI and client
2. Initialize Prisma with PostgreSQL provider
3. Configure `DATABASE_URL` in `.env`
4. Create Prisma client singleton
5. Add database connection health check

**Files to Create/Modify:**
- `backend/prisma/schema.prisma` — Prisma schema
- `backend/.env` — database URL
- `backend/src/lib/prisma.ts` — Prisma client singleton
- `backend/src/routes/health.routes.ts` — add DB health check

**Verification:**
```bash
cd backend
npx prisma db push
npx prisma studio
# Prisma Studio should open in browser
```

**Dependencies:** SF-004

---

### Ticket SF-006: Create database migration for users table
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Spec Reference:** specs/04_db_architect.md, Section: Users Table

**Implementation Steps:**
1. Define User model in Prisma schema
2. Add fields: id, email, password_hash, first_name, last_name, phone, role, email_verified, created_at, updated_at
3. Add unique constraint on email
4. Add indexes for email lookup
5. Generate and run migration

**Files to Create/Modify:**
- `backend/prisma/schema.prisma` — add User model
- `backend/prisma/migrations/` — generated migration

**Prisma Schema:**
```prisma
model User {
  id             String    @id @default(uuid())
  email          String    @unique
  passwordHash   String    @map("password_hash")
  firstName      String?   @map("first_name")
  lastName       String?   @map("last_name")
  phone          String?
  role           UserRole  @default(CUSTOMER)
  emailVerified  Boolean   @default(false) @map("email_verified")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")

  addresses      Address[]
  sessions       Session[]

  @@map("users")
}

enum UserRole {
  CUSTOMER
  ADMIN
  MERCHANT
}
```

**Verification:**
```bash
cd backend
npx prisma migrate dev --name create_users_table
npx prisma generate
```

**Dependencies:** SF-005

---

### Ticket SF-007: Create database migration for user_addresses table
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 2

**Spec Reference:** specs/04_db_architect.md, Section: Addresses Table

**Implementation Steps:**
1. Define Address model in Prisma schema
2. Add fields: id, user_id, type, first_name, last_name, street_1, street_2, city, state, postal_code, country, is_default
3. Add foreign key to users
4. Generate and run migration

**Files to Modify:**
- `backend/prisma/schema.prisma` — add Address model

**Verification:**
```bash
cd backend
npx prisma migrate dev --name create_addresses_table
```

**Dependencies:** SF-006

---

### Ticket SF-008: Create database migration for user_sessions table
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 2

**Spec Reference:** specs/04_db_architect.md, Section: Sessions Table

**Implementation Steps:**
1. Define Session model for refresh tokens
2. Add fields: id, user_id, refresh_token, user_agent, ip_address, expires_at, created_at
3. Add foreign key to users
4. Add index on refresh_token
5. Generate and run migration

**Files to Modify:**
- `backend/prisma/schema.prisma` — add Session model

**Verification:**
```bash
cd backend
npx prisma migrate dev --name create_sessions_table
```

**Dependencies:** SF-006

---

### Ticket SF-009: Implement JWT authentication middleware
**Owner:** Backend  |  **Model:** Opus  |  **Points:** 5

**Spec Reference:** specs/02_backend_lead.md, Section: Authentication

**Implementation Steps:**
1. Install jsonwebtoken and bcrypt packages
2. Create JWT utility functions (sign, verify, decode)
3. Create auth middleware to validate access tokens
4. Create optional auth middleware for public routes
5. Handle token expiration and invalid tokens
6. Add proper error responses

**Files to Create:**
- `backend/src/lib/jwt.ts` — JWT utilities
- `backend/src/lib/password.ts` — bcrypt utilities
- `backend/src/middleware/auth.middleware.ts` — auth middleware
- `backend/src/types/express.d.ts` — extend Express Request type

**Key Implementation:**
```typescript
// Access token: 15 minutes
// Refresh token: 7 days
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';
```

**Verification:**
```bash
cd backend && npm run test:unit -- auth.middleware
```

**Dependencies:** SF-004

---

### Ticket SF-010: Implement POST /api/v1/auth/register endpoint
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 5

**Spec Reference:** specs/02_backend_lead.md, Section: Auth Endpoints

**Implementation Steps:**
1. Create auth controller with register method
2. Create auth service with createUser method
3. Validate request body (email, password, firstName, lastName)
4. Hash password before storing
5. Check for existing user
6. Generate tokens and return user data
7. Add input validation with Zod

**Files to Create:**
- `backend/src/routes/auth.routes.ts` — auth routes
- `backend/src/controllers/auth.controller.ts` — auth controller
- `backend/src/services/auth.service.ts` — auth business logic
- `backend/src/validators/auth.validator.ts` — Zod schemas

**API Contract:**
```
POST /api/v1/auth/register
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}

Response (201):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Verification:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#","firstName":"Test","lastName":"User"}'
```

**Dependencies:** SF-006, SF-009

---

### Ticket SF-011: Implement POST /api/v1/auth/login endpoint
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 5

**Spec Reference:** specs/02_backend_lead.md, Section: Auth Endpoints

**Implementation Steps:**
1. Add login method to auth controller
2. Add login method to auth service
3. Validate email and password
4. Compare password with hash
5. Generate new access and refresh tokens
6. Create session record
7. Return user data with tokens

**Files to Modify:**
- `backend/src/controllers/auth.controller.ts` — add login
- `backend/src/services/auth.service.ts` — add login logic

**API Contract:**
```
POST /api/v1/auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..."
}
```

**Verification:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#"}'
```

**Dependencies:** SF-006, SF-009

---

### Ticket SF-012: Implement POST /api/v1/auth/logout endpoint
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 2

**Spec Reference:** specs/02_backend_lead.md, Section: Auth Endpoints

**Implementation Steps:**
1. Add logout method to auth controller
2. Invalidate refresh token (delete session)
3. Return success response

**API Contract:**
```
POST /api/v1/auth/logout
Authorization: Bearer <accessToken>

Response (200):
{
  "message": "Logged out successfully"
}
```

**Verification:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Dependencies:** SF-009

---

### Ticket SF-013: Implement POST /api/v1/auth/refresh endpoint
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Spec Reference:** specs/02_backend_lead.md, Section: Auth Endpoints

**Implementation Steps:**
1. Add refresh method to auth controller
2. Validate refresh token
3. Check session exists and not expired
4. Generate new access token
5. Optionally rotate refresh token
6. Return new tokens

**API Contract:**
```
POST /api/v1/auth/refresh
Content-Type: application/json

Request:
{
  "refreshToken": "eyJ..."
}

Response (200):
{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..." // rotated
}
```

**Verification:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"'"$REFRESH_TOKEN"'"}'
```

**Dependencies:** SF-008, SF-009

---

### Ticket SF-014: Implement GET /api/v1/auth/me endpoint
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 2

**Spec Reference:** specs/02_backend_lead.md, Section: Auth Endpoints

**Implementation Steps:**
1. Add getMe method to auth controller
2. Return current user from request (set by auth middleware)
3. Exclude sensitive fields (passwordHash)

**API Contract:**
```
GET /api/v1/auth/me
Authorization: Bearer <accessToken>

Response (200):
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER",
  "emailVerified": false,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

**Verification:**
```bash
curl http://localhost:3001/api/v1/auth/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

**Dependencies:** SF-009

---

### Ticket SF-015: Implement password reset flow (forgot/reset endpoints)
**Owner:** Backend  |  **Model:** Opus  |  **Points:** 5

**Spec Reference:** specs/02_backend_lead.md, Section: Password Reset

**Implementation Steps:**
1. Add forgot-password endpoint (POST /api/v1/auth/forgot-password)
2. Generate secure reset token with expiry (1 hour)
3. Store reset token hash in database (add to User model)
4. Add reset-password endpoint (POST /api/v1/auth/reset-password)
5. Validate reset token
6. Update password and invalidate token
7. Log out all sessions for security

**Files to Modify:**
- `backend/prisma/schema.prisma` — add reset token fields to User
- `backend/src/controllers/auth.controller.ts` — add endpoints
- `backend/src/services/auth.service.ts` — add reset logic

**API Contract:**
```
POST /api/v1/auth/forgot-password
{
  "email": "user@example.com"
}
Response (200): { "message": "If the email exists, a reset link has been sent" }

POST /api/v1/auth/reset-password
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!"
}
Response (200): { "message": "Password reset successfully" }
```

**Verification:**
```bash
curl -X POST http://localhost:3001/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Dependencies:** SF-006

---

### Ticket SF-016: Create Zustand auth store with login/logout actions
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 3

**Spec Reference:** specs/03_frontend_lead.md, Section: State Management

**Implementation Steps:**
1. Install Zustand
2. Create auth store with user state
3. Add login action (call API, store tokens, set user)
4. Add logout action (clear tokens, clear user)
5. Add refresh token logic
6. Persist tokens to localStorage
7. Add isAuthenticated computed state

**Files to Create:**
- `frontend/src/stores/auth.store.ts` — Zustand auth store
- `frontend/src/lib/api.ts` — API client with interceptors
- `frontend/src/types/auth.ts` — Auth types

**Verification:**
```bash
cd frontend && npm run test -- auth.store
```

**Dependencies:** SF-001

---

### Ticket SF-017: Build Login page UI with form validation
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 5

**Spec Reference:** specs/10_ui_designer.md, Section: Login Page

**Implementation Steps:**
1. Create Login page component
2. Add email and password inputs with validation
3. Add "Remember me" checkbox
4. Add "Forgot password" link
5. Add form error display
6. Add loading state during submission
7. Redirect to dashboard on success

**Files to Create:**
- `frontend/src/app/(auth)/login/page.tsx` — Login page
- `frontend/src/components/molecules/LoginForm.tsx` — Login form
- `frontend/src/components/atoms/Input.tsx` — Input component
- `frontend/src/components/atoms/Button.tsx` — Button component

**Verification:**
```bash
cd frontend && npm run dev
# Navigate to http://localhost:3000/login
```

**Dependencies:** SF-002, SF-016

---

### Ticket SF-018: Build Registration page UI with password requirements
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 5

**Spec Reference:** specs/10_ui_designer.md, Section: Registration Page

**Implementation Steps:**
1. Create Registration page component
2. Add form fields: email, password, confirm password, first name, last name
3. Add password strength indicator
4. Show password requirements checklist
5. Add terms and conditions checkbox
6. Add form validation
7. Redirect to email verification or dashboard on success

**Files to Create:**
- `frontend/src/app/(auth)/register/page.tsx` — Register page
- `frontend/src/components/molecules/RegisterForm.tsx` — Register form
- `frontend/src/components/atoms/PasswordStrength.tsx` — Password strength indicator

**Verification:**
```bash
cd frontend && npm run dev
# Navigate to http://localhost:3000/register
```

**Dependencies:** SF-002, SF-016

---

### Ticket SF-019: Build Forgot Password page UI
**Owner:** Frontend  |  **Model:** Haiku  |  **Points:** 3

**Spec Reference:** specs/10_ui_designer.md, Section: Forgot Password Page

**Implementation Steps:**
1. Create Forgot Password page component
2. Add email input with validation
3. Add submit button
4. Show success message after submission
5. Add link back to login

**Files to Create:**
- `frontend/src/app/(auth)/forgot-password/page.tsx` — Forgot password page
- `frontend/src/components/molecules/ForgotPasswordForm.tsx` — Form component

**Verification:**
```bash
cd frontend && npm run dev
# Navigate to http://localhost:3000/forgot-password
```

**Dependencies:** SF-002

---

### Ticket SF-020: Integrate frontend auth with backend API
**Owner:** Frontend  |  **Model:** Sonnet  |  **Points:** 5

**Spec Reference:** specs/03_frontend_lead.md, Section: API Integration

**Implementation Steps:**
1. Configure API base URL in environment
2. Set up axios instance with interceptors
3. Add token refresh interceptor
4. Connect Login form to login API
5. Connect Register form to register API
6. Connect Forgot Password form to API
7. Add error handling and display
8. Test full auth flow

**Files to Modify:**
- `frontend/src/lib/api.ts` — add auth endpoints
- `frontend/src/stores/auth.store.ts` — connect to API
- `frontend/src/components/molecules/LoginForm.tsx` — use auth store
- `frontend/src/components/molecules/RegisterForm.tsx` — use auth store

**Verification:**
```bash
# Start backend: cd backend && npm run dev
# Start frontend: cd frontend && npm run dev
# Test full registration and login flow in browser
```

**Dependencies:** SF-010, SF-011, SF-016, SF-017, SF-018

---

### Ticket SF-021: Set up Redis for session caching
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 3

**Spec Reference:** specs/06_devops_lead.md, Section: Redis Setup

**Implementation Steps:**
1. Install ioredis package
2. Create Redis client singleton
3. Add Redis connection to environment config
4. Add Redis health check
5. Create cache utility functions (get, set, del, expire)

**Files to Create:**
- `backend/src/lib/redis.ts` — Redis client singleton
- `backend/src/lib/cache.ts` — Cache utilities

**Verification:**
```bash
cd backend
# Ensure Redis is running: docker run -d -p 6379:6379 redis
npm run dev
curl http://localhost:3001/health
# Should include redis: "ok"
```

**Dependencies:** SF-004

---

### Ticket SF-022: Implement API rate limiting middleware
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 3

**Spec Reference:** specs/02_backend_lead.md, Section: Rate Limiting

**Implementation Steps:**
1. Create rate limiting middleware using Redis
2. Implement sliding window algorithm
3. Configure different limits for different endpoints:
   - Auth endpoints: 5 requests/minute
   - General API: 100 requests/minute
   - Search: 30 requests/minute
4. Add rate limit headers to response
5. Return 429 when limit exceeded

**Files to Create:**
- `backend/src/middleware/rateLimit.middleware.ts` — rate limiter

**Verification:**
```bash
# Test rate limiting by making rapid requests
for i in {1..10}; do curl http://localhost:3001/api/v1/auth/login -X POST -d '{}' -H "Content-Type: application/json"; done
# Should see 429 after 5 requests
```

**Dependencies:** SF-021

---

### Ticket SF-023: Set up Jest testing framework for frontend
**Owner:** Frontend  |  **Model:** Haiku  |  **Points:** 2

**Spec Reference:** specs/05_qa_lead.md, Section: Frontend Testing

**Implementation Steps:**
1. Install Jest and React Testing Library
2. Configure jest.config.js for Next.js
3. Add test scripts to package.json
4. Create test utilities and mocks
5. Add example component test

**Files to Create:**
- `frontend/jest.config.js` — Jest config
- `frontend/jest.setup.js` — Test setup
- `frontend/src/__tests__/example.test.tsx` — Example test

**Verification:**
```bash
cd frontend && npm test
```

**Dependencies:** SF-001

---

### Ticket SF-024: Set up Jest testing framework for backend
**Owner:** Backend  |  **Model:** Haiku  |  **Points:** 2

**Spec Reference:** specs/05_qa_lead.md, Section: Backend Testing

**Implementation Steps:**
1. Install Jest and ts-jest
2. Configure jest.config.js for TypeScript
3. Add test scripts to package.json
4. Create test utilities and database mocks
5. Add example service test

**Files to Create:**
- `backend/jest.config.js` — Jest config
- `backend/src/__tests__/setup.ts` — Test setup
- `backend/src/__tests__/example.test.ts` — Example test

**Verification:**
```bash
cd backend && npm test
```

**Dependencies:** SF-004

---

### Ticket SF-025: Write unit tests for auth endpoints
**Owner:** Backend  |  **Model:** Sonnet  |  **Points:** 5

**Spec Reference:** specs/05_qa_lead.md, Section: Auth Tests

**Implementation Steps:**
1. Create auth service test file
2. Test register: valid input, duplicate email, invalid password
3. Test login: valid credentials, invalid email, invalid password
4. Test logout: valid token, invalid token
5. Test refresh: valid token, expired token, invalid token
6. Mock Prisma client for unit tests
7. Achieve 80% coverage for auth service

**Files to Create:**
- `backend/src/services/__tests__/auth.service.test.ts` — Auth service tests
- `backend/src/controllers/__tests__/auth.controller.test.ts` — Auth controller tests

**Verification:**
```bash
cd backend && npm test -- --coverage --collectCoverageFrom="src/services/auth.service.ts"
# Coverage should be >80%
```

**Dependencies:** SF-010, SF-011, SF-024

---

## After All Tickets Complete

1. Run full verification:
   ```bash
   # Backend
   cd backend
   npm run lint
   npm run typecheck
   npm test
   npm run build

   # Frontend
   cd ../frontend
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```

2. Update all ticket statuses to QA Review in specs/backlog.md

3. Commit all changes:
   ```bash
   git add -A
   git commit -m "Complete Sprint 0: Foundation - Infrastructure, Database, Authentication"
   ```

4. Proceed to QA: Run prompts/sprint_0/qa_sprint_0.md
