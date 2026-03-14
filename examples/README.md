# AutoSpec Examples

Spec-only starter projects showing the input format for the AutoSpec SDD pipeline.

Each example contains only the **requirements document** and **role specifications** — the raw inputs that AutoSpec's agents consume to produce working software.

---

## Available Examples

### 1. TaskFlow (Minimal)

**Path:** [`taskflow/`](./taskflow/)

A simple task management app — the recommended starting point.

| Attribute | Value |
|-----------|-------|
| Sprints | 2 (Foundation + Auth/CRUD) |
| Tickets | ~54 |
| Complexity | Low |
| Tech Stack | Express, React, PostgreSQL, Drizzle ORM, Tailwind CSS |

**Contents:**
```
taskflow/
├── requirements.md          # Product requirements document
└── specs/
    ├── 01_product_manager.md  # Vision, personas, requirements
    ├── 02_backend_lead.md     # API design, Express, Drizzle ORM
    ├── 03_frontend_lead.md    # React, Tailwind, Zustand
    ├── 04_db_architect.md     # PostgreSQL schema, migrations
    ├── 05_qa_lead.md          # Testing strategy, Vitest
    └── backlog.md             # Sprint tickets (0-2)
```

---

### 2. DataHub API Service

**Path:** [`api-service/`](./api-service/)

A production-ready API gateway with authentication, rate limiting, and webhooks.

| Attribute | Value |
|-----------|-------|
| Sprints | 4 |
| Tickets | 89 |
| Complexity | Medium |
| Tech Stack | Node.js, Express, PostgreSQL |

---

### 3. ShopFlow E-Commerce

**Path:** [`ecommerce/`](./ecommerce/)

A full-featured e-commerce platform — the most complex example.

| Attribute | Value |
|-----------|-------|
| Sprints | 7 |
| Tickets | 174 |
| Complexity | High |
| Tech Stack | React, Node.js, PostgreSQL |

---

## How to Use

1. Pick an example (start with `taskflow/`)
2. Read `requirements.md` to understand the product
3. Read `specs/` to see how role specifications break down the work
4. Read `specs/backlog.md` to see sprint planning and ticket structure
5. Follow [QUICKSTART.md](../QUICKSTART.md) to run the SDD pipeline on any example

---

## What's Included

Each example contains **only specs** — the inputs to the SDD pipeline:

| File | Purpose |
|------|---------|
| `requirements.md` | Product requirements document (PRD) |
| `specs/01_product_manager.md` | Vision, personas, success metrics |
| `specs/02_backend_lead.md` | API design, architecture, patterns |
| `specs/03_frontend_lead.md` | UI components, design system, routing |
| `specs/04_db_architect.md` | Database schema, migrations, queries |
| `specs/05_qa_lead.md` | Testing strategy, scenarios, coverage |
| `specs/backlog.md` | Sprint tickets with status tracking |

The SDD pipeline (agents) produces everything else: source code, docs, tests, docker config, sprint summaries.

---

*These examples are part of [AutoSpec](https://github.com/Hundia/autospec) — AI-powered spec-driven development.*
