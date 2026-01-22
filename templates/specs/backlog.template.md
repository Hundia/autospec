# {{PROJECT_NAME}} Product Backlog

**Created:** {{DATE}}
**Last Updated:** {{DATE}}

---

## Team Specs Reference

| # | Spec | Description | Lines |
|---|------|-------------|-------|
| 01 | [product_manager.md](./01_product_manager.md) | Vision, personas, requirements | - |
| 02 | [backend_lead.md](./02_backend_lead.md) | API design, auth, patterns | - |
| 03 | [frontend_lead.md](./03_frontend_lead.md) | Design system, components | - |
| 04 | [db_architect.md](./04_db_architect.md) | Database schema | - |
| 05 | [qa_lead.md](./05_qa_lead.md) | Testing strategy | - |
| 06 | [devops_lead.md](./06_devops_lead.md) | Infrastructure, CI/CD | - |

---

## Architecture Vision

```
┌─────────────────────────────────────────────────────────────┐
│                     {{PROJECT_NAME}}                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐        ┌──────────────┐                 │
│   │   Frontend   │◄──────►│   Backend    │                 │
│   │   (React)    │  API   │   (Node.js)  │                 │
│   └──────────────┘        └──────┬───────┘                 │
│                                  │                          │
│                           ┌──────▼───────┐                 │
│                           │   Database   │                 │
│                           │ (PostgreSQL) │                 │
│                           └──────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Status Legend

| Emoji | Status | Meaning |
|-------|--------|---------|
| 🔲 | Todo | Not started |
| 🔄 | In Progress | Currently being worked on |
| 🧪 | QA Review | Implementation complete, needs testing |
| ✅ | Done | Tested and verified |
| ⏸️ | Blocked | Cannot proceed (see notes) |

---

## 🔄 Sprint 0: Foundation & Setup — ACTIVE

**Goal:** Set up project infrastructure and development environment.

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 0.1 | Initialize git repository with README | 🔲 Todo | DevOps | haiku |
| 0.2 | Create Docker development environment | 🔲 Todo | DevOps | sonnet |
| 0.3 | Set up PostgreSQL database | 🔲 Todo | DevOps | haiku |
| 0.4 | Initialize backend project (Node.js + Express + TypeScript) | 🔲 Todo | Backend | sonnet |
| 0.5 | Initialize frontend project (React + Vite + TypeScript) | 🔲 Todo | Frontend | sonnet |
| 0.6 | Configure ESLint and Prettier | 🔲 Todo | DevOps | haiku |
| 0.7 | Set up testing frameworks (Jest/Vitest) | 🔲 Todo | QA | sonnet |
| 0.8 | Create initial CI pipeline | 🔲 Todo | DevOps | sonnet |
| 0.9 | Create health check endpoint | 🔲 Todo | Backend | haiku |
| 0.10 | Validate full stack runs locally | 🔲 Todo | QA | sonnet |

### Dependencies
- None (this is the first sprint)

### Definition of Done
- [ ] `docker-compose up` runs successfully
- [ ] Backend responds to `/health` endpoint
- [ ] Frontend displays welcome page
- [ ] All lint checks pass
- [ ] CI pipeline runs successfully
- [ ] README has setup instructions

---

## 🔲 Sprint 1: {{FIRST_FEATURE_NAME}} — PLANNED

**Goal:** {{FIRST_FEATURE_DESCRIPTION}}

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 1.1 | {{TICKET_DESCRIPTION}} | 🔲 Todo | {{OWNER}} | {{MODEL}} |
| 1.2 | {{TICKET_DESCRIPTION}} | 🔲 Todo | {{OWNER}} | {{MODEL}} |
| 1.3 | {{TICKET_DESCRIPTION}} | 🔲 Todo | {{OWNER}} | {{MODEL}} |
| 1.4 | {{TICKET_DESCRIPTION}} | 🔲 Todo | {{OWNER}} | {{MODEL}} |
| 1.5 | {{TICKET_DESCRIPTION}} | 🔲 Todo | {{OWNER}} | {{MODEL}} |

### Dependencies
- Sprint 0 complete

### Definition of Done
- [ ] {{ACCEPTANCE_CRITERION_1}}
- [ ] {{ACCEPTANCE_CRITERION_2}}
- [ ] All tests pass
- [ ] Code reviewed

---

## 🔲 Sprint 2: {{SECOND_FEATURE_NAME}} — PLANNED

**Goal:** {{SECOND_FEATURE_DESCRIPTION}}

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 2.1 | {{TICKET_DESCRIPTION}} | 🔲 Todo | {{OWNER}} | {{MODEL}} |

### Dependencies
- Sprint 1 complete

### Definition of Done
- [ ] {{ACCEPTANCE_CRITERION}}
- [ ] All tests pass

---

## Future Sprints (Planned)

| Sprint | Name | Description | Est. Tickets |
|--------|------|-------------|--------------|
| 3 | {{NAME}} | {{DESCRIPTION}} | ~10 |
| 4 | {{NAME}} | {{DESCRIPTION}} | ~10 |
| 5 | {{NAME}} | {{DESCRIPTION}} | ~10 |

---

## Bug Backlog

Bugs discovered during development:

| # | Bug | Status | Severity | Sprint |
|---|-----|--------|----------|--------|
| B.1 | (None yet) | - | - | - |

---

## Notes

### Sprint Retrospectives
- Sprint 0: (TBD after completion)

### Important Decisions
- (Document key architecture or process decisions here)

---

*Last updated: {{DATE}}*
