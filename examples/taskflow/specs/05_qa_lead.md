# SPEC: QA Lead - TaskFlow

**Version:** 1.0
**Created:** 2026-01-21
**Owner:** QA Team

---

## 1. Testing Strategy

### Coverage Targets

| Test Type | Target | Minimum |
|-----------|--------|---------|
| Unit Tests | 80% | 70% |
| Integration Tests | Critical paths | 100% |
| E2E Tests | User journeys | 100% |

### Test Pyramid

```
         ┌─────────┐
         │   E2E   │  ~10% - 5 tests
        ┌┴─────────┴┐
        │Integration │  ~20% - 15 tests
       ┌┴───────────┴┐
       │    Unit     │  ~70% - 50+ tests
       └─────────────┘
```

---

## 2. Testing Framework

| Area | Tool |
|------|------|
| Test Runner | Vitest |
| API Testing | Supertest |
| Component Testing | Testing Library |
| E2E | Playwright |
| Mocking | Vitest (vi) |
| Coverage | c8 |

---

## 3. Critical Test Scenarios

### Authentication

| # | Scenario | Priority |
|---|----------|----------|
| AUTH-1 | User can register with valid email/password | Critical |
| AUTH-2 | Registration fails with existing email | Critical |
| AUTH-3 | User can login with correct credentials | Critical |
| AUTH-4 | Login fails with wrong password | Critical |
| AUTH-5 | Protected routes reject unauthenticated requests | Critical |
| AUTH-6 | Token refresh works correctly | High |
| AUTH-7 | User can logout | High |

### Tasks CRUD

| # | Scenario | Priority |
|---|----------|----------|
| TASK-1 | User can create task with title | Critical |
| TASK-2 | User can create task with all fields | High |
| TASK-3 | User can view their tasks | Critical |
| TASK-4 | User cannot view others' tasks | Critical |
| TASK-5 | User can update task | Critical |
| TASK-6 | User can delete task | Critical |
| TASK-7 | User can mark task complete | Critical |
| TASK-8 | User can mark task incomplete | High |
| TASK-9 | Tasks ordered by creation date | Medium |
| TASK-10 | Filter by status works | High |
| TASK-11 | Filter by priority works | High |
| TASK-12 | Search by title works | Medium |

### Input Validation

| # | Scenario | Priority |
|---|----------|----------|
| VAL-1 | Empty title rejected | Critical |
| VAL-2 | Title > 255 chars rejected | High |
| VAL-3 | Invalid email format rejected | Critical |
| VAL-4 | Password < 8 chars rejected | Critical |
| VAL-5 | Invalid priority value rejected | High |
| VAL-6 | Invalid status value rejected | High |

---

## 4. Test Examples

### Unit Test: Task Service

```typescript
describe('TaskService', () => {
  describe('createTask', () => {
    it('creates task with defaults', async () => {
      const task = await taskService.createTask(userId, {
        title: 'New task',
      });

      expect(task).toMatchObject({
        title: 'New task',
        status: 'pending',
        priority: 'medium',
        userId,
      });
    });

    it('throws if title empty', async () => {
      await expect(
        taskService.createTask(userId, { title: '' })
      ).rejects.toThrow('Title is required');
    });
  });
});
```

### Integration Test: Tasks API

```typescript
describe('POST /api/v1/tasks', () => {
  it('creates task when authenticated', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Test task' });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Test task');
  });

  it('returns 401 when not authenticated', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .send({ title: 'Test task' });

    expect(res.status).toBe(401);
  });

  it('returns 400 for empty title', async () => {
    const res = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '' });

    expect(res.status).toBe(400);
  });
});
```

### E2E Test: Task Workflow

```typescript
test('user can create and complete task', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');

  // Create task
  await page.click('[data-testid="add-task-btn"]');
  await page.fill('[name="title"]', 'E2E Test Task');
  await page.click('button[type="submit"]');
  await expect(page.getByText('E2E Test Task')).toBeVisible();

  // Complete task
  await page.click('[data-testid="task-checkbox"]');
  await expect(page.getByTestId('task-card')).toHaveClass(/completed/);
});
```

---

## 5. Test Data

### Fixtures

```typescript
export const testUser = {
  id: '11111111-1111-1111-1111-111111111111',
  email: 'test@example.com',
  name: 'Test User',
  password: 'Password123!',
};

export const testTasks = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    title: 'Pending task',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    title: 'Completed task',
    status: 'completed',
    priority: 'high',
  },
];
```

---

## 6. QA Checklist by Sprint

### Sprint 0: Foundation
- [ ] Docker containers start without errors
- [ ] Database migrations run successfully
- [ ] API health check returns 200
- [ ] Frontend builds and serves
- [ ] Lint passes

### Sprint 1: Auth & Tasks
- [ ] All AUTH-* tests pass
- [ ] All TASK-* tests pass
- [ ] All VAL-* tests pass
- [ ] Coverage > 70%
- [ ] No console errors in browser
- [ ] Responsive on mobile

### Sprint 2: Projects & Filters
- [ ] Project CRUD works
- [ ] Filter by project works
- [ ] Search works
- [ ] Sort works
- [ ] No performance degradation

---

## 7. Bug Severity Levels

| Level | Definition | Response |
|-------|------------|----------|
| Critical | App unusable, data loss | Immediate fix |
| High | Feature broken, no workaround | Same day |
| Medium | Feature impaired, workaround exists | This sprint |
| Low | Minor issue, cosmetic | Backlog |

---

*This spec is maintained by the QA team. Last updated: 2026-01-21*
