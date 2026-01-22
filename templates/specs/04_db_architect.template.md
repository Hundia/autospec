# SPEC: Database Architect

**Version:** 1.0
**Created:** {{DATE}}
**Owner:** Database Team

---

## 1. Database Overview

### Database Selection

| Attribute | Value |
|-----------|-------|
| Database | {{DATABASE_NAME}} |
| Version | {{DATABASE_VERSION}} |
| Hosting | {{HOSTING_PROVIDER}} |
| Connection Pooling | {{POOLING_SOLUTION}} |

### Why {{DATABASE_NAME}}?

{{DATABASE_REASONING}}

---

## 2. Schema Design

### Entity Relationship Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA                                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   ┌─────────────┐        ┌─────────────┐        ┌─────────────┐         │
│   │    users    │        │   {{MAIN}}  │        │ {{RELATED}} │         │
│   ├─────────────┤        ├─────────────┤        ├─────────────┤         │
│   │ id (PK)     │───┐    │ id (PK)     │───┐    │ id (PK)     │         │
│   │ email       │   │    │ user_id(FK) │◄──┘    │ {{MAIN}}_id │◄────┐   │
│   │ password    │   │    │ title       │────────│ (FK)        │     │   │
│   │ name        │   │    │ description │        │ content     │     │   │
│   │ role        │   │    │ status      │        │ created_at  │     │   │
│   │ created_at  │   │    │ created_at  │        └─────────────┘     │   │
│   │ updated_at  │   │    │ updated_at  │                            │   │
│   └─────────────┘   │    └─────────────┘                            │   │
│                     │                                                │   │
│                     └────────────────────────────────────────────────┘   │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Table Definitions

### users

Core user accounts table.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    email_verified BOOLEAN NOT NULL DEFAULT false,
    avatar_url VARCHAR(500),
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Trigger for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| email | VARCHAR(255) | NOT NULL, UNIQUE | User email address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| name | VARCHAR(100) | NOT NULL | Display name |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'user' | user, admin |
| email_verified | BOOLEAN | NOT NULL, DEFAULT false | Email verification status |
| avatar_url | VARCHAR(500) | - | Profile image URL |
| last_login_at | TIMESTAMPTZ | - | Last successful login |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |
| deleted_at | TIMESTAMPTZ | - | Soft delete timestamp |

---

### {{MAIN_TABLE}}

{{MAIN_TABLE_DESCRIPTION}}

```sql
CREATE TABLE {{MAIN_TABLE}} (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT '{{DEFAULT_STATUS}}',
    {{ADDITIONAL_COLUMNS}}
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_{{MAIN_TABLE}}_user_id ON {{MAIN_TABLE}}(user_id);
CREATE INDEX idx_{{MAIN_TABLE}}_status ON {{MAIN_TABLE}}(status);
CREATE INDEX idx_{{MAIN_TABLE}}_created_at ON {{MAIN_TABLE}}(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_{{MAIN_TABLE}}_user_status ON {{MAIN_TABLE}}(user_id, status);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| user_id | UUID | FK → users(id), NOT NULL | Owner reference |
| title | VARCHAR(255) | NOT NULL | {{MAIN_TABLE}} title |
| description | TEXT | - | Detailed description |
| status | VARCHAR(20) | NOT NULL | {{STATUS_VALUES}} |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Record creation |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update |
| deleted_at | TIMESTAMPTZ | - | Soft delete timestamp |

---

### {{RELATED_TABLE}}

{{RELATED_TABLE_DESCRIPTION}}

```sql
CREATE TABLE {{RELATED_TABLE}} (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    {{MAIN_TABLE}}_id UUID NOT NULL REFERENCES {{MAIN_TABLE}}(id) ON DELETE CASCADE,
    {{RELATED_COLUMNS}}
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_{{RELATED_TABLE}}_{{MAIN_TABLE}}_id ON {{RELATED_TABLE}}({{MAIN_TABLE}}_id);
```

---

### refresh_tokens

JWT refresh token storage.

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- Clean up expired tokens periodically
CREATE INDEX idx_refresh_tokens_cleanup ON refresh_tokens(expires_at) WHERE revoked_at IS NULL;
```

---

## 4. Naming Conventions

### Tables
- Lowercase, snake_case
- Plural nouns (users, tasks, comments)
- Junction tables: `{table1}_{table2}` alphabetically (user_roles)

### Columns
- Lowercase, snake_case
- Primary key: `id`
- Foreign keys: `{referenced_table_singular}_id` (user_id)
- Timestamps: `{action}_at` (created_at, updated_at, deleted_at)
- Booleans: `is_{condition}` or `has_{thing}` (is_active, has_notifications)

### Indexes
- Format: `idx_{table}_{columns}`
- Unique: `uniq_{table}_{columns}`
- Example: `idx_tasks_user_id`, `uniq_users_email`

### Constraints
- Primary key: `pk_{table}`
- Foreign key: `fk_{table}_{referenced_table}`
- Check: `chk_{table}_{column}`
- Unique: `uniq_{table}_{columns}`

---

## 5. Common Patterns

### Soft Deletes

All main tables support soft deletion:

```sql
-- Add soft delete column
deleted_at TIMESTAMP WITH TIME ZONE

-- Query with soft delete filter (default)
SELECT * FROM {{MAIN_TABLE}} WHERE deleted_at IS NULL;

-- Include soft deleted records
SELECT * FROM {{MAIN_TABLE}}; -- Shows all

-- Soft delete a record
UPDATE {{MAIN_TABLE}} SET deleted_at = NOW() WHERE id = $1;

-- Restore soft deleted record
UPDATE {{MAIN_TABLE}} SET deleted_at = NULL WHERE id = $1;
```

### Timestamps

Auto-update timestamps using triggers:

```sql
-- Function for updating timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to each table
CREATE TRIGGER update_{{TABLE}}_updated_at
    BEFORE UPDATE ON {{TABLE}}
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

### UUID Primary Keys

All tables use UUIDs:

```sql
-- Enable UUID extension (once per database)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Or use built-in gen_random_uuid() in PostgreSQL 13+
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

---

## 6. Migration Strategy

### Migration File Structure

```
migrations/
├── 001_create_users_table.sql
├── 002_create_{{MAIN_TABLE}}_table.sql
├── 003_create_{{RELATED_TABLE}}_table.sql
├── 004_create_refresh_tokens_table.sql
├── 005_add_indexes.sql
└── ...
```

### Migration File Format

```sql
-- migrations/001_create_users_table.sql

-- Up Migration
CREATE TABLE users (
    -- ... table definition
);

-- Down Migration (in separate file or section)
DROP TABLE IF EXISTS users;
```

### Running Migrations

```bash
# Using Prisma
npx prisma migrate dev --name init
npx prisma migrate deploy

# Using Drizzle
npx drizzle-kit push:pg
npx drizzle-kit migrate

# Using raw SQL
psql -d {{DATABASE_NAME}} -f migrations/001_create_users_table.sql
```

---

## 7. Indexing Strategy

### Index Types

| Type | Use Case | Example |
|------|----------|---------|
| B-tree | Equality, range queries (default) | `CREATE INDEX idx_users_email ON users(email)` |
| Hash | Equality only | `CREATE INDEX idx_users_email ON users USING hash(email)` |
| GIN | Full-text search, JSONB | `CREATE INDEX idx_tasks_tags ON tasks USING gin(tags)` |
| GiST | Geometric, full-text | `CREATE INDEX idx_locations_geo ON locations USING gist(coordinates)` |

### When to Create Indexes

| Create Index | Skip Index |
|--------------|------------|
| Foreign keys | Low-cardinality columns |
| Frequently queried columns | Rarely queried columns |
| WHERE clause columns | Small tables (<1000 rows) |
| ORDER BY columns | Frequently updated columns |
| JOIN columns | |

### Composite Index Order

Order columns by:
1. Equality conditions first
2. Then range conditions
3. Most selective first

```sql
-- Query: WHERE user_id = ? AND status = ? AND created_at > ?
-- Index: (user_id, status, created_at) -- equality, equality, range
CREATE INDEX idx_tasks_query ON tasks(user_id, status, created_at);
```

---

## 8. Query Patterns

### List with Pagination

```sql
-- Offset pagination (simple but slow for large offsets)
SELECT * FROM {{MAIN_TABLE}}
WHERE user_id = $1 AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT $2 OFFSET $3;

-- Cursor pagination (recommended for large datasets)
SELECT * FROM {{MAIN_TABLE}}
WHERE user_id = $1
  AND deleted_at IS NULL
  AND (created_at, id) < ($2, $3)  -- cursor
ORDER BY created_at DESC, id DESC
LIMIT $4;
```

### Search

```sql
-- Simple LIKE search
SELECT * FROM {{MAIN_TABLE}}
WHERE title ILIKE '%' || $1 || '%'
  AND deleted_at IS NULL;

-- Full-text search (PostgreSQL)
SELECT * FROM {{MAIN_TABLE}}
WHERE to_tsvector('english', title || ' ' || description)
      @@ plainto_tsquery('english', $1)
  AND deleted_at IS NULL;
```

### Aggregations

```sql
-- Count by status
SELECT status, COUNT(*) as count
FROM {{MAIN_TABLE}}
WHERE user_id = $1 AND deleted_at IS NULL
GROUP BY status;

-- Stats query
SELECT
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE status = 'completed') as completed,
    COUNT(*) FILTER (WHERE status = 'pending') as pending
FROM {{MAIN_TABLE}}
WHERE user_id = $1 AND deleted_at IS NULL;
```

---

## 9. Data Types

### Standard Type Mappings

| Data | PostgreSQL Type | Notes |
|------|-----------------|-------|
| Primary Key | UUID | Or BIGSERIAL for simpler apps |
| Foreign Key | UUID | Match referenced table |
| Short text | VARCHAR(n) | Specify max length |
| Long text | TEXT | Unlimited length |
| Integers | INTEGER | -2B to +2B |
| Large integers | BIGINT | -9 quintillion to +9 quintillion |
| Decimals | DECIMAL(p,s) | Exact precision (money) |
| Floats | DOUBLE PRECISION | Approximate (scientific) |
| Boolean | BOOLEAN | true/false |
| Timestamp | TIMESTAMPTZ | Always use timezone |
| Date | DATE | Date only |
| JSON | JSONB | Binary JSON (indexed) |
| Array | TYPE[] | e.g., TEXT[] |
| Enum | VARCHAR(20) | Avoid PostgreSQL ENUM type |

### Type Guidelines

- **Always use TIMESTAMPTZ** - Stores UTC, converts to/from client timezone
- **Prefer JSONB over JSON** - Binary, indexable, more operators
- **Avoid PostgreSQL ENUM** - Hard to modify; use VARCHAR with CHECK
- **Use DECIMAL for money** - Never use FLOAT for financial data

---

## 10. Security

### Access Control

```sql
-- Create application user with limited privileges
CREATE USER {{APP_USER}} WITH PASSWORD '{{PASSWORD}}';

-- Grant specific permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO {{APP_USER}};
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO {{APP_USER}};

-- Revoke dangerous permissions
REVOKE DROP, TRUNCATE ON ALL TABLES IN SCHEMA public FROM {{APP_USER}};
```

### Row-Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE {{MAIN_TABLE}} ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own records
CREATE POLICY user_isolation ON {{MAIN_TABLE}}
    FOR ALL
    USING (user_id = current_setting('app.current_user_id')::UUID);

-- Set user context in application
SET app.current_user_id = '{{USER_UUID}}';
```

### SQL Injection Prevention

- **Always use parameterized queries**
- Never concatenate user input into SQL
- Use ORM or query builder

```typescript
// WRONG - SQL Injection vulnerable
const query = `SELECT * FROM users WHERE email = '${email}'`;

// RIGHT - Parameterized query
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);
```

---

## 11. Performance

### Connection Pooling

```typescript
// Using pg-pool
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,              // Max connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Query Optimization

```sql
-- Use EXPLAIN ANALYZE to understand query performance
EXPLAIN ANALYZE
SELECT * FROM {{MAIN_TABLE}}
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT 20;

-- Look for:
-- - Seq Scan (might need index)
-- - High cost numbers
-- - Actual time vs planned time
```

### Batch Operations

```sql
-- Batch insert
INSERT INTO {{MAIN_TABLE}} (user_id, title, status)
VALUES
    ($1, $2, $3),
    ($4, $5, $6),
    ($7, $8, $9);

-- Batch update
UPDATE {{MAIN_TABLE}}
SET status = $1
WHERE id = ANY($2::UUID[]);
```

---

## 12. Backup & Recovery

### Backup Strategy

| Type | Frequency | Retention | Tool |
|------|-----------|-----------|------|
| Full backup | Daily | 30 days | pg_dump |
| Incremental | Hourly | 7 days | WAL archiving |
| Point-in-time | Continuous | 7 days | pg_basebackup + WAL |

### Backup Commands

```bash
# Full backup
pg_dump -h localhost -U {{DB_USER}} -d {{DB_NAME}} -F c -f backup.dump

# Restore
pg_restore -h localhost -U {{DB_USER}} -d {{DB_NAME}} backup.dump

# SQL dump (for small databases)
pg_dump -h localhost -U {{DB_USER}} -d {{DB_NAME}} > backup.sql
```

---

## 13. Seed Data

### Development Seeds

```sql
-- seeds/001_users.sql
INSERT INTO users (id, email, password_hash, name, role) VALUES
    ('11111111-1111-1111-1111-111111111111', 'admin@example.com', '$2b$12$...', 'Admin User', 'admin'),
    ('22222222-2222-2222-2222-222222222222', 'user@example.com', '$2b$12$...', 'Test User', 'user');

-- seeds/002_{{MAIN_TABLE}}.sql
INSERT INTO {{MAIN_TABLE}} (id, user_id, title, status) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'Sample Item 1', '{{DEFAULT_STATUS}}'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Sample Item 2', '{{DEFAULT_STATUS}}');
```

---

*This spec is maintained by the Database team. Last updated: {{DATE}}*
