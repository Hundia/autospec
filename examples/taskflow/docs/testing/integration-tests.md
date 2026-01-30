# TaskFlow Integration Testing Guide

## Overview

Integration tests verify that multiple components work together correctly, particularly API endpoints, database operations, and service integrations.

---

## Integration Test Architecture

```mermaid
flowchart TB
    subgraph IntTests["Integration Tests"]
        API[API Route Tests]
        DB[Database Tests]
        AUTH[Auth Flow Tests]
    end

    subgraph Stack["Test Stack"]
        EXPRESS[Express App]
        PRISMA[Prisma Client]
        TESTDB[(Test Database)]
    end

    IntTests --> EXPRESS
    EXPRESS --> PRISMA
    PRISMA --> TESTDB

    style IntTests fill:#f59e0b,color:#fff
```

---

## Test Setup

### Database Setup

```typescript
// tests/setup/testDatabase.ts
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

export async function setupTestDatabase() {
  // Reset database
  execSync('npx prisma migrate reset --force', {
    env: {
      ...process.env,
      DATABASE_URL: process.env.TEST_DATABASE_URL,
    },
  });
}

export async function clearDatabase() {
  const tables = ['task_labels', 'tasks', 'labels', 'projects', 'users'];

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
  }
}

export async function closeDatabase() {
  await prisma.$disconnect();
}

export { prisma };
```

### Test Configuration

```typescript
// tests/setup/vitest.integration.ts
import { beforeAll, afterAll, beforeEach } from 'vitest';
import { setupTestDatabase, clearDatabase, closeDatabase } from './testDatabase';

beforeAll(async () => {
  await setupTestDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});
```

---

## API Integration Tests

### Authentication Tests

```typescript
// tests/integration/api/auth.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { prisma, clearDatabase } from '@tests/setup/testDatabase';
import { createUser } from '@tests/factories/userFactory';
import bcrypt from 'bcrypt';

describe('Auth API', () => {
  beforeEach(async () => {
    await clearDatabase();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      // Act
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'SecurePassword123!',
          name: 'New User',
        });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe('newuser@example.com');
      expect(response.body.data.accessToken).toBeDefined();

      // Verify database
      const user = await prisma.user.findUnique({
        where: { email: 'newuser@example.com' },
      });
      expect(user).toBeDefined();
      expect(user?.name).toBe('New User');
    });

    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'SecurePassword123!',
          name: 'New User',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 409 for duplicate email', async () => {
      // Arrange
      await prisma.user.create({
        data: {
          email: 'existing@example.com',
          password: 'hashed',
          name: 'Existing User',
        },
      });

      // Act
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'SecurePassword123!',
          name: 'New User',
        });

      // Assert
      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('DUPLICATE_EMAIL');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Arrange
      const password = 'SecurePassword123!';
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          email: 'user@example.com',
          password: hashedPassword,
          name: 'Test User',
        },
      });

      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: password,
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 401 for invalid password', async () => {
      // Arrange
      const hashedPassword = await bcrypt.hash('correctpassword', 10);
      await prisma.user.create({
        data: {
          email: 'user@example.com',
          password: hashedPassword,
          name: 'Test User',
        },
      });

      // Act
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'user@example.com',
          password: 'wrongpassword',
        });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
    });
  });
});
```

### Task API Tests

```typescript
// tests/integration/api/tasks.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@/app';
import { prisma, clearDatabase } from '@tests/setup/testDatabase';
import { createTestUser, getAuthToken } from '@tests/helpers/auth';
import { createTask } from '@tests/factories/taskFactory';

describe('Tasks API', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    await clearDatabase();
    const user = await createTestUser();
    userId = user.id;
    token = await getAuthToken(user);
  });

  describe('GET /api/v1/tasks', () => {
    it('should return user tasks', async () => {
      // Arrange
      await prisma.task.createMany({
        data: [
          { title: 'Task 1', userId, status: 'pending', priority: 'medium' },
          { title: 'Task 2', userId, status: 'pending', priority: 'high' },
        ],
      });

      // Act
      const response = await request(app)
        .get('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.tasks).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it('should filter by status', async () => {
      // Arrange
      await prisma.task.createMany({
        data: [
          { title: 'Pending Task', userId, status: 'pending', priority: 'medium' },
          { title: 'Completed Task', userId, status: 'completed', priority: 'medium' },
        ],
      });

      // Act
      const response = await request(app)
        .get('/api/v1/tasks?status=pending')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].title).toBe('Pending Task');
    });

    it('should paginate results', async () => {
      // Arrange
      const tasks = Array.from({ length: 25 }, (_, i) => ({
        title: `Task ${i + 1}`,
        userId,
        status: 'pending',
        priority: 'medium',
      }));
      await prisma.task.createMany({ data: tasks });

      // Act
      const response = await request(app)
        .get('/api/v1/tasks?page=2&limit=10')
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.tasks).toHaveLength(10);
      expect(response.body.data.pagination.page).toBe(2);
      expect(response.body.data.pagination.totalPages).toBe(3);
    });

    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/v1/tasks');

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('AUTH_REQUIRED');
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a task', async () => {
      // Act
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'New Task',
          description: 'Task description',
          priority: 'high',
        });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe('New Task');
      expect(response.body.data.status).toBe('pending');

      // Verify in database
      const task = await prisma.task.findFirst({
        where: { title: 'New Task' },
      });
      expect(task).toBeDefined();
      expect(task?.userId).toBe(userId);
    });

    it('should create task with project', async () => {
      // Arrange
      const project = await prisma.project.create({
        data: { name: 'Test Project', userId },
      });

      // Act
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Project Task',
          projectId: project.id,
        });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body.data.projectId).toBe(project.id);
    });

    it('should return 400 for missing title', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'No title provided',
        });

      expect(response.status).toBe(400);
      expect(response.body.error.details).toContainEqual(
        expect.objectContaining({ field: 'title' })
      );
    });
  });

  describe('PUT /api/v1/tasks/:id', () => {
    it('should update own task', async () => {
      // Arrange
      const task = await prisma.task.create({
        data: { title: 'Original', userId, status: 'pending', priority: 'low' },
      });

      // Act
      const response = await request(app)
        .put(`/api/v1/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated',
          priority: 'high',
        });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Updated');
      expect(response.body.data.priority).toBe('high');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/v1/tasks/non_existent_id')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body.error.code).toBe('TASK_NOT_FOUND');
    });

    it('should return 403 for other user task', async () => {
      // Arrange
      const otherUser = await createTestUser({ email: 'other@example.com' });
      const task = await prisma.task.create({
        data: { title: 'Other Task', userId: otherUser.id, status: 'pending', priority: 'medium' },
      });

      // Act
      const response = await request(app)
        .put(`/api/v1/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Hacked' });

      // Assert
      expect(response.status).toBe(403);
      expect(response.body.error.code).toBe('RESOURCE_FORBIDDEN');
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete own task', async () => {
      // Arrange
      const task = await prisma.task.create({
        data: { title: 'To Delete', userId, status: 'pending', priority: 'medium' },
      });

      // Act
      const response = await request(app)
        .delete(`/api/v1/tasks/${task.id}`)
        .set('Authorization', `Bearer ${token}`);

      // Assert
      expect(response.status).toBe(204);

      // Verify deletion
      const deleted = await prisma.task.findUnique({
        where: { id: task.id },
      });
      expect(deleted).toBeNull();
    });
  });
});
```

---

## Database Integration Tests

```typescript
// tests/integration/database/taskRepository.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { prisma, clearDatabase } from '@tests/setup/testDatabase';
import { taskRepository } from '@/repositories/taskRepository';
import { createTestUser } from '@tests/helpers/auth';

describe('TaskRepository', () => {
  let userId: string;

  beforeEach(async () => {
    await clearDatabase();
    const user = await createTestUser();
    userId = user.id;
  });

  describe('create', () => {
    it('should create task with all fields', async () => {
      // Act
      const task = await taskRepository.create({
        title: 'New Task',
        description: 'Description',
        status: 'pending',
        priority: 'high',
        dueDate: new Date('2024-01-20'),
        userId,
      });

      // Assert
      expect(task.id).toBeDefined();
      expect(task.title).toBe('New Task');
      expect(task.priority).toBe('high');
    });
  });

  describe('findByUser', () => {
    it('should return only user tasks', async () => {
      // Arrange
      const otherUser = await createTestUser({ email: 'other@test.com' });

      await prisma.task.createMany({
        data: [
          { title: 'My Task', userId, status: 'pending', priority: 'medium' },
          { title: 'Other Task', userId: otherUser.id, status: 'pending', priority: 'medium' },
        ],
      });

      // Act
      const result = await taskRepository.findByUser(userId, {});

      // Assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].title).toBe('My Task');
    });

    it('should apply complex filters', async () => {
      // Arrange
      await prisma.task.createMany({
        data: [
          { title: 'High Pending', userId, status: 'pending', priority: 'high' },
          { title: 'Low Pending', userId, status: 'pending', priority: 'low' },
          { title: 'High Completed', userId, status: 'completed', priority: 'high' },
        ],
      });

      // Act
      const result = await taskRepository.findByUser(userId, {
        status: 'pending',
        priority: 'high',
      });

      // Assert
      expect(result.tasks).toHaveLength(1);
      expect(result.tasks[0].title).toBe('High Pending');
    });
  });

  describe('update', () => {
    it('should update task and return updated data', async () => {
      // Arrange
      const task = await prisma.task.create({
        data: { title: 'Original', userId, status: 'pending', priority: 'low' },
      });

      // Act
      const updated = await taskRepository.update(task.id, {
        title: 'Updated',
        status: 'completed',
      });

      // Assert
      expect(updated.title).toBe('Updated');
      expect(updated.status).toBe('completed');
      expect(updated.updatedAt.getTime()).toBeGreaterThan(task.updatedAt.getTime());
    });
  });

  describe('delete', () => {
    it('should soft delete task', async () => {
      // Arrange
      const task = await prisma.task.create({
        data: { title: 'To Delete', userId, status: 'pending', priority: 'medium' },
      });

      // Act
      await taskRepository.delete(task.id);

      // Assert - task should be soft deleted
      const deleted = await prisma.task.findUnique({
        where: { id: task.id },
      });
      expect(deleted?.deletedAt).toBeDefined();
    });
  });
});
```

---

## Running Integration Tests

```bash
# Run all integration tests
npm run test:integration

# Run with specific database
DATABASE_URL=postgresql://test:test@localhost:5432/taskflow_test \
  npm run test:integration

# Run specific file
npm run test:integration -- auth.test.ts

# Run with coverage
npm run test:integration -- --coverage
```

---

## Related Documents

- [Testing Strategy](./strategy.md)
- [Unit Tests](./unit-tests.md)
- [E2E Tests](./e2e-tests.md)
