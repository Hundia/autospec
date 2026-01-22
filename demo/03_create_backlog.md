# Step 3: Create Sprint Backlog

## Prompt for AI Assistant

```
You have generated 10 specs for ShopFlow E-Commerce.

## Context
Read all specs in `shopflow_demo/specs/`

## Task
Create `shopflow_demo/backlog.md` with ALL tickets extracted from the specs.

## Backlog Structure

### Header
# ShopFlow Backlog

Generated: [date]
Total Tickets: [count]
Total Story Points: [sum]

### Epic Sections
Group tickets by epic:

## Epic: Foundation
Infrastructure, tooling, project setup

| ID | Title | Description | Points | Status | Dependencies |
|----|-------|-------------|--------|--------|--------------|
| SF-001 | Initialize project | Set up monorepo with TypeScript | 2 | todo | - |
| SF-002 | Configure CI/CD | GitHub Actions pipeline | 3 | todo | SF-001 |

## Epic: Authentication
User registration, login, sessions, roles

| ID | Title | Description | Points | Status | Dependencies |
|----|-------|-------------|--------|--------|--------------|
| SF-010 | Create users table | Schema with constraints | 2 | todo | SF-001 |
| SF-011 | Implement JWT auth | Login/register endpoints | 5 | todo | SF-010 |

[Continue for all epics...]

### Story Points Guide
- **1 point**: Trivial (config change, copy update)
- **2 points**: Small (simple component, basic CRUD)
- **3 points**: Medium (feature with logic, API endpoint)
- **5 points**: Large (complex feature, integrations)
- **8 points**: XL (major feature, consider splitting)

### Status Values
- `todo` - Ready to be picked up
- `in-progress` - Currently being worked on
- `qa-review` - Code complete, needs testing
- `done` - Tested and merged
- `blocked` - Waiting on dependency

### Epics to Include
1. **Foundation** - Project setup, tooling, CI/CD
2. **Authentication** - Registration, login, sessions, roles
3. **Products** - Catalog, search, categories, detail pages
4. **Cart** - Add/remove items, persistence, calculations
5. **Checkout** - Payment flow, address, order creation
6. **Orders** - History, tracking, status updates
7. **Admin** - Dashboard, product CRUD, user management
8. **Search** - Full-text search, filters, sorting
9. **Reviews** - Product ratings, comments
10. **Analytics** - Tracking, reports, dashboards

## Also Create: shopflow_demo/sprints/sprint_0.md

### Sprint 0 Plan
Sprint Goal: Walking skeleton with basic auth

| ID | Title | Points | Assignee |
|----|-------|--------|----------|
| SF-001 | Initialize project | 2 | - |
| SF-002 | Configure CI/CD | 3 | - |
| SF-010 | Create users table | 2 | - |
| SF-011 | Implement JWT auth | 5 | - |
| SF-012 | Login page UI | 3 | - |
| SF-013 | Register page UI | 3 | - |
| SF-020 | Create products table | 2 | - |
| SF-021 | Products API (list) | 3 | - |
| SF-022 | Product list page | 3 | - |

**Total: ~26 points**

Target: 35-45 story points
Focus: Minimal end-to-end flow (register → login → view products)
```

---

## Expected Output
```
shopflow_demo/
├── backlog.md          # All tickets (~150-200)
└── sprints/
    └── sprint_0.md     # First sprint plan
```

## Demo Script

> "From our specs, we extract every actionable item into tickets. Each ticket has a unique ID, clear description, story points, and dependencies. The backlog becomes our single source of truth for what needs to be built."

Show the backlog structure, explain ticket statuses, highlight dependencies.
