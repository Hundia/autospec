# Database Architect Spec - AI Support Ops

## Database Choice
PostgreSQL 16 with Prisma migrations. Redis supports caching, rate limits, and BullMQ jobs but PostgreSQL remains the system of record.

## Core ERD
```text
workspaces 1---N users
workspaces 1---N queues
queues 1---N tickets
accounts 1---N customers
customers 1---N tickets
tickets 1---N timeline_events
tickets 1---N messages
tickets 1---N approvals
tickets 1---N qa_reviews
knowledge_articles 1---N knowledge_versions
automation_rules 1---N automation_runs
users 1---N audit_events
```

## Key Tables
```sql
CREATE TABLE workspaces (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  ai_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  email CITEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','manager','analyst','agent','auditor','readonly')),
  display_name TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(workspace_id, email)
);

CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  queue_id UUID REFERENCES queues(id),
  customer_id UUID REFERENCES customers(id),
  account_id UUID REFERENCES accounts(id),
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  severity TEXT NOT NULL,
  sentiment TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  source_channel TEXT NOT NULL,
  sla_state TEXT NOT NULL DEFAULT 'healthy',
  risk_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  merged_into_ticket_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
```

## Additional Tables
- `messages`: inbound/outbound content, author, channel, sent_at, external flag.
- `timeline_events`: immutable audit-like business timeline with event type and payload.
- `approvals`: reason code, approver, status, decision notes.
- `knowledge_articles` and `knowledge_versions`: owner, category, review date, approval status.
- `automation_rules` and `automation_runs`: trigger, condition JSON, action JSON, recursion guard hash.
- `qa_reviews`: rubric scores, reviewer, override reason, ai_assisted flag.
- `audit_events`: prompt template id, model version, latency ms, token usage, source refs.

## Indexes
- `tickets(workspace_id, status, queue_id, updated_at desc)` for queue views.
- `tickets(workspace_id, sla_state, severity)` for breach monitoring.
- `timeline_events(ticket_id, created_at)` for immutable timeline reads.
- `audit_events(workspace_id, created_at desc)` for compliance explorer.
- `knowledge_articles(workspace_id, category, status)` for retrieval filters.
- GIN full-text index on article title and body.

## Migration Strategy
- File pattern: `YYYYMMDDHHMMSS_description.sql`.
- Forward-only migrations in git.
- Destructive changes require expand-migrate-contract approach.

## Query Patterns
- Cursor pagination on ticket lists using `updated_at, id`.
- Search on tickets by subject, account, customer, tags, and article keywords.
- Dashboard queries pre-aggregate metrics by day, queue, team, and AI usage.

## Data Policies
- Soft delete tickets and articles; hard delete only on compliant erase workflow.
- Merged child tickets keep history but reject direct outbound messages.
- Partitioning is not needed at v1 scale; revisit after 50M timeline events.
