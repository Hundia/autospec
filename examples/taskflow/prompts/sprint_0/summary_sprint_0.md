# TaskFlow - Sprint 0 Summary Generation Prompt

## Overview

Use this prompt to generate the Sprint 0 summary document after completing all sprint tasks.

---

## Sprint Summary Template

Generate a summary document following this structure:

### 1. Sprint Information

```markdown
# TaskFlow - Sprint 0 Summary

**Sprint**: 0 - Foundation & Core Setup
**Duration**: [Start Date] - [End Date]
**Status**: [Completed / Partially Completed / Not Completed]

## Team
- Developer(s): [Names]
- QA: [Names]
- Reviewer: [Names]
```

### 2. Objectives vs. Outcomes

```markdown
## Sprint Objectives

| Objective | Status | Notes |
|-----------|--------|-------|
| Project scaffolding (backend + frontend) | [Done/Partial/Not Done] | |
| User authentication (register/login) | [Done/Partial/Not Done] | |
| Task CRUD operations | [Done/Partial/Not Done] | |
| Testing framework setup | [Done/Partial/Not Done] | |
| Docker development environment | [Done/Partial/Not Done] | |
```

### 3. Features Delivered

```markdown
## Features Delivered

### Authentication System
- User registration with email/password
- JWT-based authentication
- Password hashing with bcrypt
- Token refresh mechanism

### Task Management
- Create tasks with title, description, priority, due date
- List tasks with pagination and filtering
- Update task status and details
- Delete tasks
- Task status workflow: todo -> in_progress -> done

### API Endpoints Implemented

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | /api/v1/auth/register | User registration | Done |
| POST | /api/v1/auth/login | User login | Done |
| GET | /api/v1/auth/me | Get current user | Done |
| POST | /api/v1/auth/refresh | Refresh token | Done |
| GET | /api/v1/tasks | List tasks | Done |
| POST | /api/v1/tasks | Create task | Done |
| GET | /api/v1/tasks/:id | Get task | Done |
| PUT | /api/v1/tasks/:id | Update task | Done |
| DELETE | /api/v1/tasks/:id | Delete task | Done |
```

### 4. Technical Metrics

```markdown
## Technical Metrics

### Code Statistics
- Total Lines of Code: [X]
- Backend LOC: [X]
- Frontend LOC: [X]
- Test LOC: [X]

### Test Coverage
- Backend Unit Tests: [X]%
- Backend Integration Tests: [X]%
- Overall Coverage: [X]%

### Quality Metrics
- ESLint Warnings: [X]
- TypeScript Errors: 0
- Security Vulnerabilities: [X] (from npm audit)
```

### 5. Testing Summary

```markdown
## Testing Summary

### Automated Tests
| Test Suite | Tests | Passed | Failed | Skipped |
|------------|-------|--------|--------|---------|
| Auth Unit Tests | [X] | [X] | [X] | [X] |
| Task Unit Tests | [X] | [X] | [X] | [X] |
| Integration Tests | [X] | [X] | [X] | [X] |
| **Total** | [X] | [X] | [X] | [X] |

### Manual QA Results
- Total Test Cases: [X]
- Passed: [X]
- Failed: [X]
- Blocked: [X]

### Known Issues
1. [Issue description] - [Severity] - [Ticket #]
2. [Issue description] - [Severity] - [Ticket #]
```

### 6. Deployment Information

```markdown
## Deployment

### Development Environment
- Docker Compose: Working
- Local Development: Working
- Database Migrations: Applied

### Commands to Run
```bash
# Start development environment
docker-compose up -d

# Run backend
cd backend && npm run dev

# Run frontend
cd frontend && npm run dev

# Run tests
npm run test

# Run linting
npm run lint
```

### Environment Variables Required
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN
- REFRESH_TOKEN_EXPIRES_IN
- CORS_ORIGIN
```

### 7. Lessons Learned

```markdown
## Lessons Learned

### What Went Well
1. [Item 1]
2. [Item 2]
3. [Item 3]

### What Could Be Improved
1. [Item 1]
2. [Item 2]
3. [Item 3]

### Action Items for Next Sprint
1. [Action item 1]
2. [Action item 2]
3. [Action item 3]
```

### 8. Sprint Velocity

```markdown
## Velocity

### Story Points
- Planned: [X] points
- Completed: [X] points
- Velocity: [X]%

### Time Tracking
| Task Category | Estimated | Actual |
|---------------|-----------|--------|
| Development | [X]h | [X]h |
| Testing | [X]h | [X]h |
| Code Review | [X]h | [X]h |
| Bug Fixes | [X]h | [X]h |
| Documentation | [X]h | [X]h |
| **Total** | [X]h | [X]h |
```

### 9. Carryover Items

```markdown
## Carryover to Sprint 1

### Incomplete Items
| Item | Reason | Priority for Sprint 1 |
|------|--------|----------------------|
| [Item 1] | [Reason] | [P0/P1/P2] |

### Technical Debt
1. [Tech debt item 1]
2. [Tech debt item 2]
```

### 10. Sign-Off

```markdown
## Sign-Off

### Definition of Done Verification

- [x] All code merged to main branch
- [x] All tests passing
- [x] Code reviewed and approved
- [x] Documentation updated
- [x] No critical bugs open
- [x] QA sign-off received
- [ ] Sprint demo completed
- [ ] Stakeholder approval

### Git Tag Creation

```bash
# Create sprint completion tag
git tag -a sprint-0-complete -m "Sprint 0 Complete: Foundation & Core Setup

Features:
- User authentication (register, login, JWT)
- Task CRUD operations
- PostgreSQL database with Prisma ORM
- Docker development environment
- Unit and integration tests

Endpoints:
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/auth/me
- POST /api/v1/auth/refresh
- GET/POST/PUT/DELETE /api/v1/tasks

Test Coverage: XX%
"

# Push the tag
git push origin sprint-0-complete
```

### Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Dev Lead | | | |
| QA Lead | | | |
| Product Owner | | | |
```

---

## Summary Generation Checklist

Before generating the summary, ensure:

- [ ] All sprint tasks are completed or documented as carryover
- [ ] All tests have been run and results recorded
- [ ] Code coverage report generated
- [ ] QA testing completed
- [ ] All PRs merged
- [ ] Documentation updated
- [ ] Known issues documented
- [ ] Metrics collected

---

## Automated Metrics Collection

Run these commands to collect metrics:

```bash
# Code statistics
cloc backend/src frontend/src --md

# Test coverage
cd backend && npm run test:coverage
cd frontend && npm run test:coverage

# Lint check
cd backend && npm run lint
cd frontend && npm run lint

# Security audit
cd backend && npm audit
cd frontend && npm audit

# Git statistics
git log --oneline --since="2 weeks ago" | wc -l  # Commits
git shortlog -sn --since="2 weeks ago"           # Commits by author
```

---

## Sprint 0 Completion Criteria

Sprint 0 is considered COMPLETE when:

1. **All P0 items delivered**
   - User can register and login
   - User can create, read, update, delete tasks
   - JWT authentication working

2. **Quality gates passed**
   - Test coverage > 70%
   - No critical bugs
   - ESLint passes
   - TypeScript compiles without errors

3. **Documentation complete**
   - API documentation available
   - README with setup instructions
   - Environment variables documented

4. **Infrastructure ready**
   - Docker Compose working
   - CI pipeline configured
   - Database migrations working

---

## Next Sprint Preview

### Sprint 1 Focus Areas
1. Project management (create projects, assign tasks to projects)
2. Tags system (create tags, assign to tasks)
3. Task filtering and search
4. Dashboard with task statistics
5. Frontend UI improvements
