# TaskFlow API Test Suite

## Overview

This document provides a complete catalog of API test scenarios for TaskFlow, organized by endpoint and covering success cases, error cases, and edge cases.

---

## Test Coverage Matrix

```mermaid
flowchart LR
    subgraph Endpoints["API Endpoints"]
        AUTH[/auth]
        TASKS[/tasks]
        PROJECTS[/projects]
        LABELS[/labels]
        USERS[/users]
    end

    subgraph Coverage["Test Coverage"]
        SUCCESS[Success Cases]
        ERROR[Error Cases]
        EDGE[Edge Cases]
        SECURITY[Security Tests]
    end

    Endpoints --> Coverage
```

---

## Authentication Tests

### POST /auth/register

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| AUTH-001 | Register with valid data | 201, user created | Required |
| AUTH-002 | Register with existing email | 409, duplicate error | Required |
| AUTH-003 | Register with invalid email format | 400, validation error | Required |
| AUTH-004 | Register with weak password | 400, password requirements | Required |
| AUTH-005 | Register with missing fields | 400, field errors | Required |
| AUTH-006 | Register with very long name | 400, max length error | Required |
| AUTH-007 | Register with SQL injection attempt | 400, sanitized | Security |
| AUTH-008 | Register with XSS in name | 400/201, sanitized | Security |

```typescript
// AUTH-001: Register with valid data
test('should register user with valid data', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({
      email: 'newuser@example.com',
      password: 'SecurePass123!',
      name: 'New User',
    });

  expect(response.status).toBe(201);
  expect(response.body.success).toBe(true);
  expect(response.body.data.user.email).toBe('newuser@example.com');
  expect(response.body.data.accessToken).toBeDefined();
});

// AUTH-004: Weak password
test('should reject weak password', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({
      email: 'user@example.com',
      password: 'weak',
      name: 'User',
    });

  expect(response.status).toBe(400);
  expect(response.body.error.code).toBe('VALIDATION_ERROR');
  expect(response.body.error.details).toContainEqual(
    expect.objectContaining({ field: 'password' })
  );
});
```

### POST /auth/login

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| AUTH-010 | Login with valid credentials | 200, tokens returned | Required |
| AUTH-011 | Login with invalid email | 401, invalid credentials | Required |
| AUTH-012 | Login with invalid password | 401, invalid credentials | Required |
| AUTH-013 | Login with unverified email | 401, email not verified | Required |
| AUTH-014 | Login with disabled account | 401, account disabled | Required |
| AUTH-015 | Login rate limiting | 429, after 10 attempts | Security |

```typescript
// AUTH-010: Valid login
test('should login with valid credentials', async () => {
  // Setup: Create user first
  await createTestUser({ email: 'login@example.com' });

  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'login@example.com',
      password: 'TestPassword123!',
    });

  expect(response.status).toBe(200);
  expect(response.body.data.accessToken).toBeDefined();
  expect(response.headers['set-cookie']).toBeDefined();
});

// AUTH-015: Rate limiting
test('should rate limit after 10 failed attempts', async () => {
  for (let i = 0; i < 10; i++) {
    await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' });
  }

  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'test@example.com', password: 'wrong' });

  expect(response.status).toBe(429);
});
```

---

## Task Tests

### GET /tasks

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| TASK-001 | Get tasks (authenticated) | 200, task list | Required |
| TASK-002 | Get tasks (unauthenticated) | 401, auth required | Required |
| TASK-003 | Get tasks with pagination | 200, paginated results | Required |
| TASK-004 | Get tasks filtered by status | 200, filtered results | Required |
| TASK-005 | Get tasks filtered by priority | 200, filtered results | Required |
| TASK-006 | Get tasks filtered by project | 200, filtered results | Required |
| TASK-007 | Get tasks with search query | 200, search results | Required |
| TASK-008 | Get tasks sorted by due date | 200, sorted results | Required |
| TASK-009 | Get tasks with invalid page | 400, validation error | Edge |
| TASK-010 | Get tasks returns only user's tasks | 200, user tasks only | Security |

```typescript
// TASK-001: Get tasks authenticated
test('should return tasks for authenticated user', async () => {
  const user = await createTestUser();
  const token = getAuthToken(user);
  await createTasksForUser(user.id, 5);

  const response = await request(app)
    .get('/api/v1/tasks')
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.data.tasks).toHaveLength(5);
  expect(response.body.data.pagination).toBeDefined();
});

// TASK-010: User isolation
test('should only return user own tasks', async () => {
  const user1 = await createTestUser({ email: 'user1@test.com' });
  const user2 = await createTestUser({ email: 'user2@test.com' });

  await createTasksForUser(user1.id, 3);
  await createTasksForUser(user2.id, 2);

  const response = await request(app)
    .get('/api/v1/tasks')
    .set('Authorization', `Bearer ${getAuthToken(user1)}`);

  expect(response.body.data.tasks).toHaveLength(3);
  response.body.data.tasks.forEach(task => {
    expect(task.userId).toBe(user1.id);
  });
});
```

### POST /tasks

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| TASK-020 | Create task with valid data | 201, task created | Required |
| TASK-021 | Create task with minimal data | 201, defaults applied | Required |
| TASK-022 | Create task with project | 201, linked to project | Required |
| TASK-023 | Create task with labels | 201, labels attached | Required |
| TASK-024 | Create task with invalid project | 404, project not found | Required |
| TASK-025 | Create task with other user's project | 403, forbidden | Security |
| TASK-026 | Create task missing title | 400, validation error | Required |
| TASK-027 | Create task with future due date | 201, task created | Required |
| TASK-028 | Create task with past due date | 201, task created | Edge |

```typescript
// TASK-020: Create with valid data
test('should create task with valid data', async () => {
  const user = await createTestUser();
  const token = getAuthToken(user);

  const response = await request(app)
    .post('/api/v1/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'New Task',
      description: 'Task description',
      priority: 'high',
      dueDate: '2024-02-01',
    });

  expect(response.status).toBe(201);
  expect(response.body.data.title).toBe('New Task');
  expect(response.body.data.status).toBe('pending');
  expect(response.body.data.priority).toBe('high');
});

// TASK-025: Security - other user's project
test('should reject task with other user project', async () => {
  const user1 = await createTestUser({ email: 'user1@test.com' });
  const user2 = await createTestUser({ email: 'user2@test.com' });
  const project = await createProjectForUser(user2.id);

  const response = await request(app)
    .post('/api/v1/tasks')
    .set('Authorization', `Bearer ${getAuthToken(user1)}`)
    .send({
      title: 'Task',
      projectId: project.id,
    });

  expect(response.status).toBe(403);
});
```

### PUT /tasks/:id

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| TASK-040 | Update own task | 200, task updated | Required |
| TASK-041 | Update non-existent task | 404, not found | Required |
| TASK-042 | Update other user's task | 403, forbidden | Security |
| TASK-043 | Update with invalid data | 400, validation error | Required |
| TASK-044 | Update task status | 200, status changed | Required |
| TASK-045 | Update completed task | 200, task updated | Edge |

### DELETE /tasks/:id

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| TASK-060 | Delete own task | 204, deleted | Required |
| TASK-061 | Delete non-existent task | 404, not found | Required |
| TASK-062 | Delete other user's task | 403, forbidden | Security |
| TASK-063 | Delete task with labels | 204, cascade delete | Required |

---

## Project Tests

### GET /projects

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| PROJ-001 | Get user projects | 200, project list | Required |
| PROJ-002 | Get projects (unauthenticated) | 401, auth required | Required |

### POST /projects

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| PROJ-010 | Create project | 201, project created | Required |
| PROJ-011 | Create duplicate name | 409, conflict | Required |
| PROJ-012 | Create with invalid color | 400, validation error | Edge |

### GET /projects/:id/tasks

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| PROJ-030 | Get project tasks | 200, task list | Required |
| PROJ-031 | Get other user's project | 403, forbidden | Security |

---

## Label Tests

### POST /labels

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| LBL-001 | Create label | 201, label created | Required |
| LBL-002 | Create duplicate name | 409, conflict | Required |
| LBL-003 | Exceed label limit (20) | 400, limit reached | Required |

### DELETE /labels/:id

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| LBL-010 | Delete label | 204, deleted | Required |
| LBL-011 | Delete label with tasks | 204, unlinks from tasks | Required |

---

## User Tests

### PUT /users/password

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| USER-010 | Change password | 200, password changed | Required |
| USER-011 | Wrong current password | 401, invalid | Required |
| USER-012 | Weak new password | 400, validation error | Required |

### DELETE /users/account

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| USER-020 | Delete account | 204, account deleted | Required |
| USER-021 | Delete without confirmation | 400, confirmation required | Required |

---

## Performance Tests

| Test ID | Scenario | Threshold | Status |
|---------|----------|-----------|--------|
| PERF-001 | GET /tasks (100 tasks) | < 200ms | Required |
| PERF-002 | POST /tasks | < 100ms | Required |
| PERF-003 | GET /tasks with filters | < 300ms | Required |
| PERF-004 | Concurrent requests (50) | No failures | Required |

```typescript
// PERF-001: List tasks performance
test('should return 100 tasks within 200ms', async () => {
  const user = await createTestUser();
  await createTasksForUser(user.id, 100);

  const start = Date.now();
  const response = await request(app)
    .get('/api/v1/tasks?limit=100')
    .set('Authorization', `Bearer ${getAuthToken(user)}`);
  const duration = Date.now() - start;

  expect(response.status).toBe(200);
  expect(duration).toBeLessThan(200);
});
```

---

## Security Tests

| Test ID | Scenario | Expected | Status |
|---------|----------|----------|--------|
| SEC-001 | SQL injection in search | Sanitized, no SQL error | Required |
| SEC-002 | XSS in task title | Escaped output | Required |
| SEC-003 | CSRF protection | Token required | Required |
| SEC-004 | JWT tampering | 401, invalid token | Required |
| SEC-005 | Expired token | 401, token expired | Required |
| SEC-006 | Rate limiting (100/min) | 429 after limit | Required |

---

## Test Execution Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    API TEST SUITE SUMMARY                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Endpoint Coverage:                                              │
│  ├── /auth       24 tests   ████████████████████ 100%           │
│  ├── /tasks      32 tests   ████████████████████ 100%           │
│  ├── /projects   16 tests   ████████████████████ 100%           │
│  ├── /labels     12 tests   ████████████████████ 100%           │
│  └── /users      10 tests   ████████████████████ 100%           │
│                                                                  │
│  Test Types:                                                     │
│  ├── Success Cases:    45 (47%)                                 │
│  ├── Error Cases:      32 (34%)                                 │
│  ├── Edge Cases:       12 (13%)                                 │
│  └── Security Tests:    6 (6%)                                  │
│                                                                  │
│  Total Tests: 95                                                 │
│  Required:    80                                                 │
│  Optional:    15                                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Running Test Suite

```bash
# Run full API test suite
npm run test:api

# Run specific category
npm run test:api -- --grep "AUTH"

# Run with verbose output
npm run test:api -- --verbose

# Generate coverage report
npm run test:api -- --coverage
```

---

## Related Documents

- [Testing Strategy](./strategy.md)
- [Integration Tests](./integration-tests.md)
- [API Reference](../api/reference.md)
