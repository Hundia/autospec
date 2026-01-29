# TaskFlow Database Architecture

**Version:** 1.0
**Last Updated:** 2026-01-29

---

## 1. Database Overview

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Version | 15+ |
| ORM | Drizzle ORM |
| Connection | pg (node-postgres) |
| Pool Size | 10 connections |

---

## 2. Entity-Relationship Diagram

```
    ┌─────────────────────────────────────────────────────────────────────────────────┐
    │                           TASKFLOW DATABASE SCHEMA                               │
    └─────────────────────────────────────────────────────────────────────────────────┘


    ┌───────────────────────────────────────────────────────────────────────────────┐
    │                                   users                                        │
    ├───────────────────────────────────────────────────────────────────────────────┤
    │  PK   id              UUID        NOT NULL  DEFAULT gen_random_uuid()         │
    │       email           VARCHAR(255) NOT NULL  UNIQUE                            │
    │       password_hash   VARCHAR(255) NOT NULL                                    │
    │       name            VARCHAR(100) NOT NULL                                    │
    │       created_at      TIMESTAMPTZ  NOT NULL  DEFAULT NOW()                     │
    │       updated_at      TIMESTAMPTZ  NOT NULL  DEFAULT NOW()                     │
    ├───────────────────────────────────────────────────────────────────────────────┤
    │  INDEX idx_users_email ON email                                                │
    └───────────────────────────────────┬───────────────────────────────────────────┘
                                        │
                                        │ 1
                                        │
                                        ├───────────────────────────────────────────┐
                                        │                                           │
                                        │ *                                         │ *
    ┌───────────────────────────────────▼───────────────────────────────────────────┐
    │                                  tasks                                         │
    ├────────────────────────────────────────────────────────────────────────────────┤
    │  PK   id              UUID        NOT NULL  DEFAULT gen_random_uuid()          │
    │  FK   user_id         UUID        NOT NULL  REFERENCES users(id) ON DELETE CASCADE
    │  FK   project_id      UUID        NULL      REFERENCES projects(id) ON DELETE SET NULL
    │       title           VARCHAR(255) NOT NULL                                     │
    │       description     TEXT        NULL                                          │
    │       status          VARCHAR(20)  NOT NULL  DEFAULT 'pending'                  │
    │       priority        VARCHAR(20)  NOT NULL  DEFAULT 'medium'                   │
    │       due_date        TIMESTAMPTZ  NULL                                         │
    │       completed_at    TIMESTAMPTZ  NULL                                         │
    │       created_at      TIMESTAMPTZ  NOT NULL  DEFAULT NOW()                      │
    │       updated_at      TIMESTAMPTZ  NOT NULL  DEFAULT NOW()                      │
    ├────────────────────────────────────────────────────────────────────────────────┤
    │  INDEX idx_tasks_user_id ON user_id                                             │
    │  INDEX idx_tasks_project_id ON project_id                                       │
    │  INDEX idx_tasks_status ON status                                               │
    │  INDEX idx_tasks_due_date ON due_date                                           │
    │  INDEX idx_tasks_user_status ON (user_id, status)                               │
    └────────────────────────────────────────────────────────────────────────────────┘
                                        ▲
                                        │ *
                                        │
                                        │ 1
    ┌───────────────────────────────────┴───────────────────────────────────────────┐
    │                                 projects                                       │
    ├────────────────────────────────────────────────────────────────────────────────┤
    │  PK   id              UUID        NOT NULL  DEFAULT gen_random_uuid()          │
    │  FK   user_id         UUID        NOT NULL  REFERENCES users(id) ON DELETE CASCADE
    │       name            VARCHAR(100) NOT NULL                                     │
    │       description     TEXT        NULL                                          │
    │       color           VARCHAR(7)   NULL      DEFAULT '#3B82F6'                  │
    │       archived_at     TIMESTAMPTZ  NULL                                         │
    │       created_at      TIMESTAMPTZ  NOT NULL  DEFAULT NOW()                      │
    │       updated_at      TIMESTAMPTZ  NOT NULL  DEFAULT NOW()                      │
    ├────────────────────────────────────────────────────────────────────────────────┤
    │  INDEX idx_projects_user_id ON user_id                                          │
    └────────────────────────────────────────────────────────────────────────────────┘


    ┌────────────────────────────────────────────────────────────────────────────────┐
    │                              refresh_tokens                                     │
    ├────────────────────────────────────────────────────────────────────────────────┤
    │  PK   id              UUID        NOT NULL  DEFAULT gen_random_uuid()          │
    │  FK   user_id         UUID        NOT NULL  REFERENCES users(id) ON DELETE CASCADE
    │       token_hash      VARCHAR(255) NOT NULL                                     │
    │       expires_at      TIMESTAMPTZ  NOT NULL                                     │
    │       created_at      TIMESTAMPTZ  NOT NULL  DEFAULT NOW()                      │
    ├────────────────────────────────────────────────────────────────────────────────┤
    │  INDEX idx_refresh_tokens_user_id ON user_id                                    │
    │  INDEX idx_refresh_tokens_expires ON expires_at                                 │
    └────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Table Catalog

### users

Stores user account information.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| email | VARCHAR(255) | NO | - | Unique email address |
| password_hash | VARCHAR(255) | NO | - | Bcrypt password hash |
| name | VARCHAR(100) | NO | - | Display name |
| created_at | TIMESTAMPTZ | NO | NOW() | Account creation time |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last modification time |

### tasks

Stores user tasks with metadata.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | NO | - | Owner reference |
| project_id | UUID | YES | NULL | Optional project reference |
| title | VARCHAR(255) | NO | - | Task title |
| description | TEXT | YES | NULL | Task description |
| status | VARCHAR(20) | NO | 'pending' | pending, in_progress, completed |
| priority | VARCHAR(20) | NO | 'medium' | low, medium, high, urgent |
| due_date | TIMESTAMPTZ | YES | NULL | Optional due date |
| completed_at | TIMESTAMPTZ | YES | NULL | Completion timestamp |
| created_at | TIMESTAMPTZ | NO | NOW() | Creation time |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last modification time |

### projects

Stores project containers for tasks.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | NO | - | Owner reference |
| name | VARCHAR(100) | NO | - | Project name |
| description | TEXT | YES | NULL | Project description |
| color | VARCHAR(7) | YES | '#3B82F6' | Hex color code |
| archived_at | TIMESTAMPTZ | YES | NULL | Archive timestamp |
| created_at | TIMESTAMPTZ | NO | NOW() | Creation time |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last modification time |

### refresh_tokens

Stores JWT refresh token hashes for token rotation.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | gen_random_uuid() | Primary key |
| user_id | UUID | NO | - | User reference |
| token_hash | VARCHAR(255) | NO | - | SHA-256 token hash |
| expires_at | TIMESTAMPTZ | NO | - | Expiration time |
| created_at | TIMESTAMPTZ | NO | NOW() | Creation time |

---

## 4. Index Strategy

### Primary Indexes

| Table | Index Name | Columns | Purpose |
|-------|------------|---------|---------|
| users | idx_users_email | email | Fast email lookup for login |
| tasks | idx_tasks_user_id | user_id | Filter tasks by user |
| tasks | idx_tasks_project_id | project_id | Filter tasks by project |
| tasks | idx_tasks_status | status | Filter by status |
| tasks | idx_tasks_due_date | due_date | Sort by due date |
| tasks | idx_tasks_user_status | (user_id, status) | Combined filter |
| projects | idx_projects_user_id | user_id | Filter projects by user |
| refresh_tokens | idx_refresh_tokens_user_id | user_id | Find user tokens |
| refresh_tokens | idx_refresh_tokens_expires | expires_at | Cleanup expired |

### Query-to-Index Mapping

| Query Pattern | Index Used |
|---------------|------------|
| `SELECT * FROM users WHERE email = ?` | idx_users_email |
| `SELECT * FROM tasks WHERE user_id = ?` | idx_tasks_user_id |
| `SELECT * FROM tasks WHERE user_id = ? AND status = ?` | idx_tasks_user_status |
| `SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date` | idx_tasks_user_id + idx_tasks_due_date |

---

## 5. Common Queries

### Get User's Tasks with Filters

```sql
SELECT
  t.id, t.title, t.description, t.status, t.priority,
  t.due_date, t.completed_at, t.created_at, t.updated_at,
  p.name as project_name, p.color as project_color
FROM tasks t
LEFT JOIN projects p ON t.project_id = p.id
WHERE t.user_id = $1
  AND ($2::varchar IS NULL OR t.status = $2)
  AND ($3::varchar IS NULL OR t.priority = $3)
  AND ($4::uuid IS NULL OR t.project_id = $4)
  AND ($5::text IS NULL OR t.title ILIKE '%' || $5 || '%')
ORDER BY
  CASE WHEN $6 = 'due_date' THEN t.due_date END ASC NULLS LAST,
  CASE WHEN $6 = 'priority' THEN
    CASE t.priority
      WHEN 'urgent' THEN 1
      WHEN 'high' THEN 2
      WHEN 'medium' THEN 3
      WHEN 'low' THEN 4
    END
  END ASC,
  CASE WHEN $6 = 'created_at' OR $6 IS NULL THEN t.created_at END DESC
LIMIT $7 OFFSET $8;
```

### Get Task Statistics for User

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

### Get Project with Task Count

```sql
SELECT
  p.*,
  COUNT(t.id) as task_count,
  COUNT(t.id) FILTER (WHERE t.status = 'completed') as completed_count
FROM projects p
LEFT JOIN tasks t ON t.project_id = p.id
WHERE p.user_id = $1 AND p.archived_at IS NULL
GROUP BY p.id
ORDER BY p.created_at DESC;
```

---

## 6. Connection Pooling

```typescript
// config/database.ts
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                // Maximum connections
  idleTimeoutMillis: 30000, // Close idle connections after 30s
  connectionTimeoutMillis: 5000, // Fail after 5s if no connection
});

export const db = drizzle(pool, { schema });
```

---

## 7. Migration Strategy

### Naming Convention

```
YYYYMMDDHHMMSS_description.sql

Examples:
20260129100000_create_users.sql
20260129100100_create_tasks.sql
20260129100200_create_projects.sql
20260129100300_add_project_id_to_tasks.sql
```

### Migration Commands

```bash
# Generate migration from schema changes
npm run db:generate

# Run pending migrations
npm run db:migrate

# Drop all tables and re-run migrations
npm run db:reset

# Open Drizzle Studio
npm run db:studio
```

---

## 8. Soft Delete Policy

TaskFlow uses **soft delete** for projects (archived_at) but **hard delete** for tasks.

| Entity | Delete Type | Reason |
|--------|------------|--------|
| users | Hard delete | GDPR compliance, cascade to tasks |
| tasks | Hard delete | User expectation, no recovery needed |
| projects | Soft delete | Archive for historical reference |
| refresh_tokens | Hard delete | No recovery needed |

---

## 9. Cross-References

- **Schema Definition:** See `specs/04_db_architect.md`
- **Backend Queries:** See `docs/architecture/backend.md`
- **API Endpoints:** See `docs/api/reference.md`
- **Migration Files:** See `api/src/db/migrations/`

---

*This document is maintained by the Database team. Last updated: 2026-01-29*
