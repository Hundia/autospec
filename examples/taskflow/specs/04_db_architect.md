# SPEC: Database Architect - TaskFlow

**Version:** 1.0
**Created:** 2026-01-21
**Owner:** Database Team

---

## 1. Database Overview

| Attribute | Value |
|-----------|-------|
| Database | PostgreSQL |
| Version | 15+ |
| ORM | Drizzle ORM |

---

## 2. Schema Design

### Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           TASKFLOW SCHEMA                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌─────────────┐        ┌─────────────┐        ┌─────────────┐         │
│   │    users    │        │    tasks    │        │  projects   │         │
│   ├─────────────┤        ├─────────────┤        ├─────────────┤         │
│   │ id (PK)     │───┐    │ id (PK)     │   ┌───│ id (PK)     │         │
│   │ email       │   │    │ user_id(FK) │◄──┘   │ user_id(FK) │◄──┐     │
│   │ password    │   │    │ project_id  │◄──────│ name        │   │     │
│   │ name        │   │    │ title       │       │ description │   │     │
│   │ created_at  │   │    │ description │       │ color       │   │     │
│   │ updated_at  │   │    │ status      │       │ created_at  │   │     │
│   └─────────────┘   │    │ priority    │       │ updated_at  │   │     │
│                     │    │ due_date    │       └─────────────┘   │     │
│                     │    │ created_at  │                         │     │
│                     │    │ updated_at  │                         │     │
│                     │    └─────────────┘                         │     │
│                     │                                            │     │
│                     └────────────────────────────────────────────┘     │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Table Definitions

### users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User email |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hash |
| name | VARCHAR(100) | NOT NULL | Display name |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

---

### tasks

```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → users(id), NOT NULL | Owner |
| project_id | UUID | FK → projects(id), NULL | Optional project |
| title | VARCHAR(255) | NOT NULL | Task title |
| description | TEXT | - | Detailed description |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'pending' | pending, in_progress, completed |
| priority | VARCHAR(20) | NOT NULL, DEFAULT 'medium' | low, medium, high, urgent |
| due_date | TIMESTAMPTZ | - | Due date/time |
| completed_at | TIMESTAMPTZ | - | When marked complete |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

---

### projects (v1.1)

```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → users(id), NOT NULL | Owner |
| name | VARCHAR(100) | NOT NULL | Project name |
| description | TEXT | - | Project description |
| color | VARCHAR(7) | DEFAULT '#3B82F6' | Hex color code |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation time |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |

---

### refresh_tokens

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
```

---

## 4. Drizzle ORM Schema

```typescript
// db/schema.ts
import { pgTable, uuid, varchar, text, timestamp, index } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
}));

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  priority: varchar('priority', { length: 20 }).notNull().default('medium'),
  dueDate: timestamp('due_date', { withTimezone: true }),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_tasks_user_id').on(table.userId),
  statusIdx: index('idx_tasks_status').on(table.status),
  dueDateIdx: index('idx_tasks_due_date').on(table.dueDate),
}));

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 7 }).default('#3B82F6'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_projects_user_id').on(table.userId),
}));
```

---

## 5. Migrations

### Migration 001: Create users table

```sql
-- 001_create_users.sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

### Migration 002: Create tasks table

```sql
-- 002_create_tasks.sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

### Migration 003: Create projects table (v1.1)

```sql
-- 003_create_projects.sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);

-- Add project_id to tasks
ALTER TABLE tasks ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
```

---

## 6. Common Queries

### Get user's tasks with filters

```sql
SELECT * FROM tasks
WHERE user_id = $1
  AND ($2::varchar IS NULL OR status = $2)
  AND ($3::varchar IS NULL OR priority = $3)
ORDER BY
  CASE WHEN $4 = 'due_date' THEN due_date END ASC,
  CASE WHEN $4 = 'created_at' THEN created_at END DESC,
  CASE WHEN $4 = 'priority' THEN
    CASE priority
      WHEN 'urgent' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'low' THEN 4
    END
  END ASC
LIMIT $5 OFFSET $6;
```

### Get task statistics

```sql
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'completed') as completed,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
  COUNT(*) FILTER (WHERE due_date < NOW() AND status != 'completed') as overdue
FROM tasks
WHERE user_id = $1;
```

---

## 7. Seed Data

```sql
-- Development seed data
INSERT INTO users (id, email, password_hash, name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'demo@taskflow.dev', '$2b$12$...', 'Demo User');

INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Complete TaskFlow MVP', 'Build the core task management features', 'in_progress', 'high', '2026-01-30'),
  ('11111111-1111-1111-1111-111111111111', 'Write documentation', 'Create user guides and API docs', 'pending', 'medium', '2026-02-01'),
  ('11111111-1111-1111-1111-111111111111', 'Add filtering', 'Implement task filtering by status and priority', 'pending', 'medium', NULL);
```

---

*This spec is maintained by the Database team. Last updated: 2026-01-21*
