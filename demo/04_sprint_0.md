# Step 4: Execute Sprint 0

## Prompt for AI Assistant

```
Execute Sprint 0 for ShopFlow E-Commerce.

## Context
- Specs: `shopflow_demo/specs/`
- Backlog: `shopflow_demo/backlog.md`
- Sprint plan: `shopflow_demo/sprints/sprint_0.md`

## Sprint 0 Goal
Create a "walking skeleton" - minimal end-to-end functionality:
- User can register
- User can login
- User can view product list
- Basic CI/CD in place

## Execution Process

For EACH ticket in sprint_0.md:

### 1. Start Ticket
- Read ticket requirements
- Check dependencies (all must be `done`)
- Update backlog.md: status → `in-progress`

### 2. Reference Specs
- Backend work → Read 02_backend_lead.md
- Frontend work → Read 03_frontend_lead.md
- Database work → Read 04_db_architect.md
- Use exact schemas, endpoints, types from specs

### 3. Implement
- Create files in `shopflow_demo/src/`
- Follow project structure from specs
- Add inline comments for complex logic

### 4. Write Tests
- Create test files in `shopflow_demo/tests/`
- Reference test cases from 05_qa_lead.md
- Cover happy path + key edge cases

### 5. Complete Ticket
- Update backlog.md: status → `qa-review`
- Run tests locally
- If passing: status → `done`
- If failing: fix or create [BUG] ticket

## Project Structure
Create this structure:

shopflow_demo/
├── src/
│   ├── backend/
│   │   ├── index.ts           # Express app entry
│   │   ├── routes/
│   │   │   ├── auth.ts        # /api/auth/*
│   │   │   └── products.ts    # /api/products/*
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── product.service.ts
│   │   ├── models/
│   │   │   ├── user.model.ts
│   │   │   └── product.model.ts
│   │   └── middleware/
│   │       └── auth.middleware.ts
│   └── frontend/
│       ├── src/
│       │   ├── App.tsx
│       │   ├── pages/
│       │   │   ├── Login.tsx
│       │   │   ├── Register.tsx
│       │   │   └── Products.tsx
│       │   ├── components/
│       │   │   └── ProductCard.tsx
│       │   └── services/
│       │       └── api.ts
│       └── package.json
├── tests/
│   ├── auth.test.ts
│   └── products.test.ts
├── package.json
└── docker-compose.yml

## Multi-Agent Strategy (Optional)
If using parallel agents:

**Agent A (Backend)**:
- SF-001: Initialize project
- SF-002: Configure CI/CD
- SF-010: Create users table
- SF-011: Implement JWT auth
- SF-020: Create products table
- SF-021: Products API

**Agent B (Frontend)**:
- SF-012: Login page UI
- SF-013: Register page UI
- SF-022: Product list page

Sync point: Agent B waits for SF-011 before testing auth flow.

## Deliverables

### 1. Working Code
All files in `shopflow_demo/src/`

### 2. Tests
All files in `shopflow_demo/tests/`

### 3. Updated Backlog
`shopflow_demo/backlog.md` with updated statuses

### 4. QA Report
Create `shopflow_demo/sprints/sprint_0_qa_report.md`:

# Sprint 0 QA Report

## Summary
- **Planned**: X tickets, Y story points
- **Completed**: X tickets, Y story points
- **Velocity**: Y points/sprint

## Test Results
- Total tests: X
- Passing: X
- Failing: X
- Coverage: X%

## Tickets Completed
| ID | Title | Status | Notes |
|----|-------|--------|-------|
| SF-001 | Initialize project | done | - |
| ... | ... | ... | ... |

## Bugs Found
| ID | Description | Severity | Related |
|----|-------------|----------|---------|
| BUG-001 | Description | High | SF-011 |

## Notes for Sprint 1
- What's ready
- What's blocked
- Recommendations
```

---

## Expected Output
```
shopflow_demo/
├── src/
│   ├── backend/         # API code
│   └── frontend/        # React app
├── tests/               # Test files
├── backlog.md           # Updated statuses
└── sprints/
    ├── sprint_0.md
    └── sprint_0_qa_report.md
```

## Demo Script

> "Now we execute the sprint. Watch as the AI implements each ticket following our specs exactly. It updates the backlog in real-time, writes tests, and produces a QA report when done."

Show tickets being worked on, code being generated, tests running.
