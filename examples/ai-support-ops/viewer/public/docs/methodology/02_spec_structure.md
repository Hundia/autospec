# Spec Structure: How to Write Effective Specifications

**Version:** 1.0
**Last Updated:** 2026-01-21

---

## Why Specs Matter

Specifications are the contract between intent and implementation. A well-written spec:

- Eliminates ambiguity for AI agents
- Enables parallel development
- Serves as documentation
- Provides acceptance criteria
- Survives team changes

A poorly-written spec causes:

- Misaligned implementations
- Endless revisions
- Wasted AI tokens
- Frustrated developers

---

## The 9-Spec Model

SDD uses 9 specification files, each representing a team role:

| # | Spec File | Purpose | Typical Lines |
|---|-----------|---------|---------------|
| 01 | product_manager.md | Vision, personas, user flows | 200-400 |
| 02 | backend_lead.md | API design, auth, patterns | 400-800 |
| 03 | frontend_lead.md | Design system, components, UX | 600-1500 |
| 04 | db_architect.md | Schema, migrations, naming | 400-800 |
| 05 | qa_lead.md | Testing strategy, coverage | 400-800 |
| 06 | devops_lead.md | Infrastructure, CI/CD | 400-1000 |
| 07 | marketing_lead.md | Go-to-market, positioning | 200-500 |
| 08 | finance_lead.md | Pricing, unit economics | 200-500 |
| 09 | business_lead.md | Strategy, competitive analysis | 200-500 |

Plus: **backlog.md** - The master work tracker (evolves continuously).

---

## Spec Anatomy

Every spec follows a consistent structure:

```markdown
# SPEC: [Role Name]

**Version:** X.X
**Last Updated:** YYYY-MM-DD
**Owner:** [Name or "Team"]

---

## 1. Role Definition
What this role is responsible for.

## 2. Scope
What's included and explicitly excluded.

## 3. Standards & Conventions
Naming, patterns, rules to follow.

## 4. Architecture/Design
Diagrams, structures, relationships.

## 5. Detailed Specifications
The meat - tables, schemas, endpoints, components.

## 6. Integration Points
How this connects to other specs.

## 7. Success Criteria
How we know this spec is satisfied.

---

## Appendix
References, glossary, examples.
```

---

## Writing Each Spec Type

### 01_product_manager.md

**Purpose:** Define WHAT we're building and WHY.

**Key Sections:**

```markdown
## 1. Product Vision
One paragraph: What is this product and why does it exist?

## 2. Elevator Pitch
30-second explanation for anyone.

## 3. User Personas
| Persona | Description | Goals | Pain Points |
|---------|-------------|-------|-------------|
| Primary User | Demographics, context | What they want | What frustrates them |

## 4. User Flows
### Flow 1: [Name]
1. User does X
2. System responds Y
3. User sees Z

## 5. Success Metrics
| Metric | Target | Measurement |
|--------|--------|-------------|
| DAU | 1000 | Analytics |

## 6. Requirements (High-Level)
- FR-1: The system shall...
- NFR-1: The system must...
```

**Tips:**
- Be specific about personas (age, context, goals)
- User flows should be step-by-step, not abstract
- Success metrics must be measurable

---

### 02_backend_lead.md

**Purpose:** Define HOW the server-side works.

**Key Sections:**

```markdown
## 1. Architecture Overview
[Diagram or description of system architecture]

## 2. API Design Principles
- RESTful conventions
- Response format standards
- Error handling patterns

## 3. Authentication & Authorization
- Auth flow (JWT, sessions, OAuth)
- Role-based access control rules

## 4. API Endpoints
| Method | Endpoint | Description | Auth | Request | Response |
|--------|----------|-------------|------|---------|----------|
| POST | /api/v1/users | Create user | No | {...} | {...} |

## 5. Services Layer
| Service | Responsibility | Dependencies |
|---------|---------------|--------------|
| UserService | User CRUD, validation | UserRepository |

## 6. Error Handling
| Code | Meaning | When Used |
|------|---------|-----------|
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | Not authenticated |

## 7. Security Requirements
- Input validation rules
- Rate limiting
- Data encryption
```

**Tips:**
- Include actual request/response examples
- Define all error codes upfront
- Be explicit about auth requirements per endpoint

---

### 03_frontend_lead.md

**Purpose:** Define the visual layer and user experience.

**Key Sections:**

```markdown
## 1. Design System
### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Primary | #3B82F6 | CTAs, links |

### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Inter | 32px | Bold |

### Spacing
Base unit: 4px (0.25rem)

## 2. Component Library
| Component | Location | Props | Usage |
|-----------|----------|-------|-------|
| Button | /components/Button | variant, size, onClick | Primary actions |

## 3. Page Layouts
### [Page Name]
- Route: /path
- Components used: [List]
- State requirements: [List]
- [Wireframe or description]

## 4. State Management
| Store | Purpose | Key State |
|-------|---------|-----------|
| userStore | Auth state | user, isLoggedIn |

## 5. Responsive Breakpoints
| Breakpoint | Width | Behavior |
|------------|-------|----------|
| mobile | <640px | Stack layout |

## 6. Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
```

**Tips:**
- Include actual color values, not "blue"
- Define every reusable component
- Specify mobile-first or desktop-first

---

### 04_db_architect.md

**Purpose:** Define data storage and integrity.

**Key Sections:**

```markdown
## 1. Database Technology
- PostgreSQL 15+
- Connection pooling: PgBouncer

## 2. Naming Conventions
| Element | Convention | Example |
|---------|------------|---------|
| Tables | snake_case, plural | user_profiles |
| Columns | snake_case | created_at |
| Indexes | idx_table_column | idx_users_email |

## 3. Schema Overview
[ERD diagram or text representation]

## 4. Table Definitions
### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

## 5. Relationships
| From | To | Type | FK |
|------|----|------|-----|
| profiles | users | many-to-one | user_id |

## 6. Migration Strategy
- Sequential numbered migrations: 001_*, 002_*
- Up and down migrations required
- No destructive changes without data migration

## 7. Seeding
- Development seeds in /database/seeds/
- Production requires explicit seeding command
```

**Tips:**
- Include full CREATE TABLE statements
- Define all indexes explicitly
- Specify ON DELETE behavior for FKs

---

### 05_qa_lead.md

**Purpose:** Define quality standards and testing strategy.

**Key Sections:**

```markdown
## 1. Testing Philosophy
"Test behavior, not implementation."

## 2. Test Pyramid
| Level | Percentage | Focus | Tools |
|-------|------------|-------|-------|
| Unit | 60% | Functions, services | Jest/Vitest |
| Integration | 30% | API endpoints, DB | Supertest |
| E2E | 10% | User flows | Playwright |

## 3. Coverage Targets
| Area | Target | Enforcement |
|------|--------|-------------|
| Critical paths | 90% | CI blocks merge |
| Overall | 70% | Warning only |

## 4. Test File Conventions
- Location: Adjacent to source (__tests__/ or .test.ts)
- Naming: [module].test.ts

## 5. Unit Test Patterns
```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

## 6. Integration Test Patterns
[Examples of API tests]

## 7. QA Review Checklist
- [ ] All tests pass
- [ ] No console.log left
- [ ] Error handling present
- [ ] Types correct (no `any`)
```

**Tips:**
- Include actual test code examples
- Be explicit about coverage numbers
- Define what blocks merge vs. what's advisory

---

### 06_devops_lead.md

**Purpose:** Define infrastructure and deployment.

**Key Sections:**

```markdown
## 1. Infrastructure Overview
[Architecture diagram]

## 2. Environment Configuration
| Env | Purpose | URL | Database |
|-----|---------|-----|----------|
| development | Local | localhost:3000 | docker |
| staging | Testing | staging.app.com | managed |
| production | Users | app.com | managed |

## 3. Docker Configuration
```yaml
# docker-compose.yml structure
services:
  api:
    build: ./api
    ports: ["3001:3001"]
  web:
    build: ./web
    ports: ["3000:3000"]
  db:
    image: postgres:15
```

## 4. CI/CD Pipeline
| Stage | Trigger | Actions |
|-------|---------|---------|
| Test | PR opened | Run tests, lint |
| Build | Merge to main | Build images |
| Deploy | Tag pushed | Deploy to production |

## 5. Environment Variables
| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection |
| JWT_SECRET | Yes | Token signing key |

## 6. Monitoring & Logging
- Error tracking: Sentry
- Logging: Structured JSON
- Metrics: Prometheus/Grafana

## 7. Security
- Secrets in env vars, never committed
- HTTPS everywhere
- Regular dependency updates
```

---

### 07_marketing_lead.md, 08_finance_lead.md, 09_business_lead.md

These follow similar patterns but focus on:

- **Marketing:** Channels, messaging, user acquisition, content strategy
- **Finance:** Pricing tiers, unit economics, revenue projections, cost structure
- **Business:** SWOT analysis, competitive landscape, partnerships, funding

Include specific numbers, not just placeholders.

---

## The Backlog: backlog.md

The backlog is special - it's a living document that evolves throughout the project.

```markdown
# Project Backlog

## Team Specs Reference
| # | Spec | Lines | Last Updated |
|---|------|-------|--------------|
| 01 | product_manager.md | 284 | 2026-01-15 |

## Status Legend
| Emoji | Status | Meaning |
|-------|--------|---------|
| 🔲 | Todo | Not started |
| 🔄 | In Progress | Being worked on |
| 🧪 | QA Review | Needs testing |
| ✅ | Done | Complete |
| ⏸️ | Blocked | Cannot proceed |

## ✅ Sprint 0: Foundation — COMPLETE

**Goal:** Set up project infrastructure

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 0.1 | Initialize repo | ✅ Done | DevOps | haiku |

### Definition of Done
- [x] All tickets complete
- [x] Tests pass

## 🔄 Sprint 1: [Name] — ACTIVE

**Goal:** [One-liner]

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|

### Dependencies
- Sprint 0 complete

### Definition of Done
- [ ] Criteria 1
- [ ] Criteria 2
```

---

## Common Spec Mistakes

### 1. Too Vague

**Bad:**
```
Users can log in.
```

**Good:**
```
POST /api/v1/auth/login
Request: { email: string, password: string }
Response: { token: string, user: { id, email, name } }
Errors: 401 if credentials invalid, 400 if fields missing
```

### 2. No Examples

**Bad:**
```
API returns user data.
```

**Good:**
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "name": "Jane Doe",
  "createdAt": "2026-01-15T10:30:00Z"
}
```

### 3. Missing Edge Cases

**Bad:**
```
Handle file upload.
```

**Good:**
```
File upload:
- Max size: 5MB
- Allowed types: jpg, png, webp
- If > 5MB: Return 413 with message "File too large (max 5MB)"
- If wrong type: Return 415 with message "Unsupported file type"
- If success: Return 201 with { url, filename, size }
```

### 4. No Ownership

**Bad:**
```
| Ticket | Status |
| Do the thing | Todo |
```

**Good:**
```
| # | Ticket | Status | Owner | Model |
| 1.3 | Implement JWT refresh | 🔲 Todo | Backend | sonnet |
```

---

## Spec Review Checklist

Before considering a spec complete:

- [ ] Every feature has explicit acceptance criteria
- [ ] All API endpoints have request/response examples
- [ ] Database schemas include full SQL
- [ ] UI components have props defined
- [ ] Error states are specified
- [ ] Security requirements are explicit
- [ ] Testing requirements are clear
- [ ] No TBD/TODO placeholders remain

---

## Next Steps

- [03_team_roles.md](./03_team_roles.md) - Understand each role's responsibility
- [04_backlog_management.md](./04_backlog_management.md) - Learn sprint patterns
- [Templates](../../templates/specs/) - Start with pre-built templates
