# SPEC: Database Architect

**Version:** 1.0
**Created:** 2026-01-21
**Owner:** Database Team

---

## 1. Database Overview

### Technology
- **Database:** PostgreSQL
- **ORM/Query Builder:** Drizzle/Prisma/Raw SQL
- **Migrations:** Version controlled

---

## 2. Schema Design Principles

### Naming Conventions
- Tables: snake_case, plural (e.g., `users`, `orders`)
- Columns: snake_case (e.g., `created_at`, `user_id`)
- Primary Keys: `id` (UUID or serial)
- Foreign Keys: `{table}_id`

### Common Columns
All tables should have:
- `id` - Primary key
- `created_at` - Timestamp
- `updated_at` - Timestamp

---

## 3. Tables

Define your database tables here based on the requirements.

### Example: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 4. Indexes

| Table | Column(s) | Type | Purpose |
|-------|-----------|------|---------|
| users | email | UNIQUE | Fast lookup by email |

---

*This spec is maintained by the Database team. Last updated: 2026-01-21*
