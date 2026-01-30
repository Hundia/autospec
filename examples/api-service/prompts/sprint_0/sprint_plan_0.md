# DataHub API Gateway - Sprint 0 Planning Guide

## Sprint Overview

**Sprint**: 0 - Foundation & Core Setup
**Duration**: 1-2 weeks
**Focus**: Project scaffolding, user authentication, API key management basics

---

## Sprint Goals

1. Set up project infrastructure (API Gateway + databases)
2. Implement user authentication (register, login, JWT)
3. Create basic API key generation and management
4. Establish rate limiting foundation
5. Set up testing framework and CI/CD

---

## User Stories

### US-0.1: Project Setup
**As a** developer
**I want** a fully configured development environment
**So that** I can start building the API Gateway

**Acceptance Criteria:**
- [ ] Express.js project initialized with TypeScript
- [ ] PostgreSQL database configured with Prisma ORM
- [ ] Redis configured for caching/rate limiting
- [ ] Docker Compose for local development
- [ ] ESLint + Prettier configured
- [ ] Environment variables configured (.env.example provided)

### US-0.2: User Registration & Authentication
**As a** new user
**I want** to create an account and log in
**So that** I can access the DataHub platform

**Acceptance Criteria:**
- [ ] Registration endpoint: `POST /api/v1/auth/register`
- [ ] Login endpoint: `POST /api/v1/auth/login`
- [ ] Role support: admin, developer, viewer
- [ ] JWT access token (1h expiry)
- [ ] Refresh token support (7d expiry)
- [ ] Password hashing with bcrypt

### US-0.3: API Key Generation
**As a** developer user
**I want** to generate API keys
**So that** I can authenticate my applications

**Acceptance Criteria:**
- [ ] Generate API key: `POST /api/v1/api-keys`
- [ ] List user's API keys: `GET /api/v1/api-keys`
- [ ] Revoke API key: `DELETE /api/v1/api-keys/:id`
- [ ] API keys are hashed before storage
- [ ] Support key expiration dates
- [ ] Support rate limit tier assignment

### US-0.4: Basic Rate Limiting
**As a** platform administrator
**I want** to enforce rate limits on API keys
**So that** I can prevent abuse

**Acceptance Criteria:**
- [ ] Define rate limit tiers (free, standard, premium, enterprise)
- [ ] Store rate counters in Redis
- [ ] Return rate limit headers in responses
- [ ] Return 429 Too Many Requests when exceeded

---

## Technical Tasks

### Backend Tasks
| ID | Task | Estimate | Priority |
|----|------|----------|----------|
| BE-0.1 | Initialize Express.js with TypeScript | 2h | P0 |
| BE-0.2 | Configure Prisma with PostgreSQL | 2h | P0 |
| BE-0.3 | Configure Redis client | 1h | P0 |
| BE-0.4 | Create User model and migration | 1h | P0 |
| BE-0.5 | Create ApiKey model and migration | 1h | P0 |
| BE-0.6 | Create RateLimit model and seed data | 1h | P0 |
| BE-0.7 | Implement auth middleware (JWT) | 3h | P0 |
| BE-0.8 | Implement auth routes | 4h | P0 |
| BE-0.9 | Implement API key routes | 4h | P0 |
| BE-0.10 | Implement rate limiter middleware | 4h | P0 |
| BE-0.11 | Add request validation (Zod) | 2h | P1 |
| BE-0.12 | Set up Jest for testing | 2h | P1 |
| BE-0.13 | Write auth endpoint tests | 3h | P1 |
| BE-0.14 | Write API key endpoint tests | 3h | P1 |

### Infrastructure Tasks
| ID | Task | Estimate | Priority |
|----|------|----------|----------|
| INF-0.1 | Create Docker Compose (Postgres + Redis) | 2h | P0 |
| INF-0.2 | Set up GitHub Actions CI pipeline | 2h | P1 |
| INF-0.3 | Configure environment variables | 1h | P0 |

---

## API Endpoints Summary

### Authentication
```
POST   /api/v1/auth/register   - Create new user account
POST   /api/v1/auth/login      - Authenticate user
POST   /api/v1/auth/logout     - Invalidate tokens
POST   /api/v1/auth/refresh    - Refresh access token
GET    /api/v1/auth/me         - Get current user profile
```

### API Keys
```
GET    /api/v1/api-keys        - List user's API keys
POST   /api/v1/api-keys        - Generate new API key
GET    /api/v1/api-keys/:id    - Get API key details
DELETE /api/v1/api-keys/:id    - Revoke API key
```

### Rate Limits (Admin)
```
GET    /api/v1/rate-limits     - List rate limit tiers
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'developer',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### API Keys Table
```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    rate_limit_tier VARCHAR(50) DEFAULT 'standard',
    expires_at TIMESTAMP,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    revoked_at TIMESTAMP
);
```

### Rate Limits Table
```sql
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY,
    tier_name VARCHAR(50) UNIQUE NOT NULL,
    requests_per_min INTEGER NOT NULL,
    requests_per_hour INTEGER NOT NULL,
    burst_limit INTEGER NOT NULL
);

-- Seed data
INSERT INTO rate_limits VALUES
  ('free', 60, 1000, 10),
  ('standard', 300, 10000, 50),
  ('premium', 1000, 50000, 100),
  ('enterprise', 5000, 200000, 500);
```

---

## Definition of Done (DoD)

A feature is considered DONE when:

### Code Quality
- [ ] Code follows established style guide (ESLint passes)
- [ ] Code is properly formatted (Prettier passes)
- [ ] No TypeScript errors
- [ ] Code has been reviewed

### Testing
- [ ] Unit tests written and passing (>70% coverage)
- [ ] Integration tests for API endpoints
- [ ] Rate limiting tested manually
- [ ] No critical bugs

### Documentation
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] README with setup instructions

### Deployment
- [ ] Code merged to main branch
- [ ] CI pipeline passes
- [ ] Docker Compose runs successfully

---

## Dependencies & Blockers

### Dependencies
- PostgreSQL and Redis instances
- Node.js 20+ installed
- Docker for local development

### Potential Blockers
- Redis connection configuration
- API key hashing strategy
- Rate limit algorithm selection

---

## Sprint 0 Success Criteria

At the end of Sprint 0, we should have:

1. **Working Authentication**
   - Users can register with email/password
   - Users can log in and receive tokens
   - Role-based access (admin, developer, viewer)

2. **API Key Management**
   - Users can generate API keys
   - Keys are hashed and stored securely
   - Keys can be revoked

3. **Rate Limiting Foundation**
   - Rate limit tiers defined
   - Redis-based counter storage
   - Rate limit headers returned

4. **Development Environment**
   - `docker-compose up` starts all services
   - Tests pass with `npm test`
