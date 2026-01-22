# AutoSpec Examples

Complete worked examples showing the AutoSpec methodology in action.

---

## Available Examples

### 1. ShopFlow E-Commerce

**Path:** [`ecommerce/`](./ecommerce/)

A full-featured e-commerce platform demonstrating the complete AutoSpec workflow.

| Metric | Value |
|--------|-------|
| Total Sprints | 7 |
| Total Tickets | 174 |
| Complexity | High |
| Tech Stack | React, Node.js, PostgreSQL |

**Features Built:**
- User authentication (register, login, password reset)
- Product catalog with search and filtering
- Shopping cart with persistence
- Checkout flow with payments
- Order management and history
- Admin dashboard

**Contents:**
```
ecommerce/
├── requirements.md          # Input: What we wanted to build
├── specs/                   # Generated: 10 role specifications
│   ├── 01_product_manager.md
│   ├── 02_backend_lead.md
│   ├── 03_frontend_lead.md
│   ├── 04_db_architect.md
│   ├── 05_qa_lead.md
│   ├── 10_ui_designer.md
│   └── backlog.md           # All tickets organized by sprint
├── prompts/                 # Sprint execution prompts
│   ├── prompt_sprint0.md
│   └── prompt_sprint1.md
└── sprints/                 # Sprint documentation
    ├── sprint-0-foundation/
    │   ├── summary.md
    │   └── qa-results.md
    └── sprint-1-core-shopping/
        ├── summary.md
        ├── qa-results.md
        └── release-notes.md
```

**Use this example to see:**
- How detailed specs should be
- How to organize a large backlog
- Multi-agent execution patterns
- QA report format

---

### 2. DataHub API Service

**Path:** [`api-service/`](./api-service/)

A production-ready API gateway with authentication, rate limiting, and webhooks.

| Metric | Value |
|--------|-------|
| Total Sprints | 4 |
| Total Tickets | 89 |
| Complexity | Medium |
| Tech Stack | Node.js, Express, PostgreSQL |

**Features Built:**
- API key management
- Rate limiting per key
- Request logging and analytics
- Webhook delivery system
- Health checks and monitoring

**Contents:**
```
api-service/
├── requirements.md          # Input requirements
├── specs/                   # Role specifications
├── prompts/                 # Sprint prompts
├── sprints/                 # Sprint documentation
├── src/                     # Actual source code!
│   ├── index.ts
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   └── models/
├── tests/                   # Test files
├── migrations/              # Database migrations
├── docker-compose.yml       # Container setup
└── package.json
```

**Use this example to see:**
- A complete runnable codebase generated with AutoSpec
- Backend-focused project structure
- Database migrations and schema
- Test organization

---

### 3. TaskFlow (Minimal)

**Path:** [`taskflow/`](./taskflow/)

A simple task management app showing the minimal AutoSpec setup.

| Metric | Value |
|--------|-------|
| Total Sprints | 2 |
| Total Tickets | ~25 |
| Complexity | Low |
| Tech Stack | React, Node.js |

**Use this example to see:**
- Minimal viable spec structure
- Quick project bootstrapping
- How to start small and iterate

---

## How to Use These Examples

### 1. Learning AutoSpec

1. Start with `ecommerce/requirements.md` to see a well-written requirements doc
2. Read `ecommerce/specs/01_product_manager.md` to see spec quality expectations
3. Check `ecommerce/specs/backlog.md` to understand ticket organization
4. Review `ecommerce/sprints/sprint-0-foundation/summary.md` for documentation patterns

### 2. Starting Your Own Project

1. Copy `ecommerce/requirements.md` as a starting template
2. Adapt it to your project
3. Follow [QUICKSTART.md](../QUICKSTART.md) to generate your own specs

### 3. Running the API Service

The `api-service` example includes runnable code:

```bash
cd examples/api-service

# Install dependencies
npm install

# Start database
docker-compose up -d postgres

# Run migrations
npm run migrate

# Start server
npm run dev
```

---

## Example Comparison

| Aspect | E-Commerce | API Service | TaskFlow |
|--------|------------|-------------|----------|
| Frontend | Full React app | None (API only) | Simple React |
| Backend | Express + complex | Express + middleware | Express basic |
| Database | 15+ tables | 6 tables | 3 tables |
| Auth | JWT + OAuth ready | API keys | Simple JWT |
| Tests | Unit + E2E | Unit + Integration | Unit only |
| Docs | Comprehensive | Good | Minimal |

---

## Contributing Examples

Want to add an example? See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

Good example projects:
- Mobile app (React Native/Flutter)
- CLI tool
- SaaS with subscriptions
- Data pipeline
- ML/AI application

---

*These examples are part of [AutoSpec](https://github.com/user/autospec) - AI-powered spec-driven development.*
