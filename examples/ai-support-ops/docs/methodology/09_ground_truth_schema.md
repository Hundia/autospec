# SDD Ground Truth Schema

**Version:** 1.0
**Last Updated:** 2026-01-21

This document defines the **minimum required artifacts** for a valid SDD project and provides validation criteria.

---

## 1. Project Structure Schema

A complete SDD project MUST have the following structure:

```
project-root/
├── specs/                              # REQUIRED - Specification documents
│   ├── 01_product_manager.md           # REQUIRED - Vision, personas, flows
│   ├── 02_backend_lead.md              # REQUIRED* - API, auth, services
│   ├── 03_frontend_lead.md             # REQUIRED* - Design system, components
│   ├── 04_db_architect.md              # REQUIRED* - Schema, migrations
│   ├── 05_qa_lead.md                   # REQUIRED - Testing strategy
│   ├── 06_devops_lead.md               # REQUIRED - Infrastructure, CI/CD
│   ├── 07_marketing_lead.md            # OPTIONAL - Go-to-market
│   ├── 08_finance_lead.md              # OPTIONAL - Pricing, economics
│   ├── 09_business_lead.md             # OPTIONAL - Strategy, competition
│   ├── 10_ui_designer.md               # REQUIRED* - Screen specs, wireframes
│   └── backlog.md                      # REQUIRED - Sprint tickets
│
├── prompts/                            # REQUIRED - Sprint execution prompts
│   ├── prompt_sprint0.md               # REQUIRED - Foundation sprint
│   └── prompt_sprint{N}.md             # As needed per sprint
│
├── sprints/                            # GENERATED - Sprint documentation
│   └── sprint-{N}-{name}/
│       ├── summary.md                  # Technical summary
│       ├── qa-results.md               # Test results
│       └── release-notes.md            # User-facing notes
│
├── .claude/commands/                   # REQUIRED for Claude users
│   ├── execute-ticket.md
│   ├── qa-review.md
│   ├── sprint-status.md
│   ├── update-backlog.md
│   ├── create-sprint-docs.md
│   └── create-spec.md
│
├── .github/                            # REQUIRED for Copilot users
│   └── copilot-instructions.md
│
├── .sddrc.json                         # OPTIONAL - SDD configuration
├── CONTRIBUTING.md                     # RECOMMENDED - Dev workflow
└── README.md                           # REQUIRED - Project overview

* = Required based on project type (see Project Types below)
```

---

## 2. Project Types & Required Specs

### Full Stack Web Application
```
REQUIRED: 01, 02, 03, 04, 05, 06, 10, backlog
OPTIONAL: 07, 08, 09
```

### Backend API Only
```
REQUIRED: 01, 02, 04, 05, 06, backlog
OPTIONAL: 07, 08, 09
NOT NEEDED: 03, 10
```

### Frontend Only (SPA)
```
REQUIRED: 01, 03, 05, 06, 10, backlog
OPTIONAL: 07, 08, 09
NOT NEEDED: 02, 04
```

### Mobile Application
```
REQUIRED: 01, 02, 03, 04, 05, 06, 10, backlog
OPTIONAL: 07, 08, 09
```

### Business/Marketing Project
```
REQUIRED: 01, 07, 08, 09, backlog
OPTIONAL: 05
NOT NEEDED: 02, 03, 04, 06, 10
```

---

## 3. Spec File Minimum Requirements

Each spec file must meet these criteria:

### 01_product_manager.md (Min: 200 lines)

| Section | Required | Min Content |
|---------|----------|-------------|
| Vision Statement | ✅ | 1 paragraph elevator pitch |
| Success State | ✅ | 3+ measurable outcomes |
| Personas | ✅ | 2+ detailed personas with goals/frustrations |
| User Flows | ✅ | 3+ flows with numbered steps |
| Functional Requirements | ✅ | 10+ numbered requirements |
| Non-Functional Requirements | ✅ | 5+ requirements (performance, security) |
| Success Metrics | ✅ | 5+ measurable KPIs |
| Out of Scope | ✅ | Explicit boundaries |

### 02_backend_lead.md (Min: 400 lines)

| Section | Required | Min Content |
|---------|----------|-------------|
| Architecture Diagram | ✅ | ASCII or description |
| Tech Stack | ✅ | Runtime, framework, database, etc. |
| Project Structure | ✅ | Folder tree with descriptions |
| API Design Principles | ✅ | REST conventions, versioning |
| Authentication Flow | ✅ | Diagram + token structure |
| Endpoint Table | ✅ | ALL endpoints with method/path/auth/description |
| Request/Response Examples | ✅ | JSON examples for key endpoints |
| Error Handling | ✅ | Error codes table |
| Validation Schemas | ✅ | Zod/Yup schemas for inputs |
| Security Requirements | ✅ | OWASP considerations |

### 03_frontend_lead.md (Min: 600 lines)

| Section | Required | Min Content |
|---------|----------|-------------|
| Design System | ✅ | Colors, typography, spacing |
| Color Palette | ✅ | Primary, secondary, semantic colors with hex |
| Typography Scale | ✅ | Font families, sizes, weights |
| Component Inventory | ✅ | ALL components with props |
| Page Layouts | ✅ | ALL pages with routes |
| State Management | ✅ | Stores, their shape, actions |
| Responsive Strategy | ✅ | Breakpoints, mobile-first rules |
| Accessibility | ✅ | WCAG compliance approach |
| Animation Guidelines | ✅ | Transitions, motion principles |

### 04_db_architect.md (Min: 400 lines)

| Section | Required | Min Content |
|---------|----------|-------------|
| Schema Overview | ✅ | ERD or table relationships |
| Naming Conventions | ✅ | Tables, columns, indexes |
| Full CREATE TABLE | ✅ | ALL tables with constraints |
| Index Definitions | ✅ | Performance indexes |
| Foreign Keys | ✅ | Relationship constraints |
| Migration Strategy | ✅ | Naming, ordering, rollback |
| Seed Data Strategy | ✅ | Test data approach |
| Data Types | ✅ | UUID vs serial, timestamps |

### 05_qa_lead.md (Min: 500 lines)

| Section | Required | Min Content |
|---------|----------|-------------|
| Testing Philosophy | ✅ | Approach and principles |
| Test Pyramid | ✅ | Unit/Integration/E2E percentages |
| Coverage Targets | ✅ | Per-layer targets |
| Unit Test Patterns | ✅ | Examples with mocking |
| Integration Test Patterns | ✅ | Examples with setup/teardown |
| E2E Test Patterns | ✅ | User journey tests |
| Test File Conventions | ✅ | Naming, organization |
| QA Checklist | ✅ | Review criteria |
| CI Integration | ✅ | Pipeline stages |

### 06_devops_lead.md (Min: 500 lines)

| Section | Required | Min Content |
|---------|----------|-------------|
| Infrastructure Diagram | ✅ | Architecture overview |
| Docker Configuration | ✅ | Dockerfile, docker-compose |
| Environment Variables | ✅ | ALL env vars with descriptions |
| CI/CD Pipeline | ✅ | Stages, triggers, artifacts |
| Deployment Strategy | ✅ | Blue/green, rolling, etc. |
| Monitoring | ✅ | Logging, metrics, alerts |
| Security | ✅ | Secrets management, network |
| Scaling Strategy | ✅ | Horizontal/vertical approach |

### 10_ui_designer.md (Min: 500 lines) **NEW**

| Section | Required | Min Content |
|---------|----------|-------------|
| Design Philosophy | ✅ | Visual principles |
| Screen Inventory | ✅ | ALL screens with purposes |
| Screen Specifications | ✅ | Wireframes/ASCII for each screen |
| Component Placement | ✅ | Layout grid, spacing |
| User Interactions | ✅ | Click, hover, focus states |
| Navigation Flow | ✅ | Screen-to-screen diagram |
| Responsive Layouts | ✅ | Mobile, tablet, desktop |
| Empty States | ✅ | No data, loading, error |
| Micro-interactions | ✅ | Animations, feedback |

### backlog.md (Min: 200 lines)

| Section | Required | Min Content |
|---------|----------|-------------|
| Team Specs Reference | ✅ | Links to all spec files |
| Status Legend | ✅ | Emoji definitions |
| Sprint 0 | ✅ | Foundation tickets (8-15) |
| Sprint 1+ | ✅ | Feature tickets (10-25 per sprint) |
| Ticket Format | ✅ | #, Description, Status, Owner, Model |
| Definition of Done | ✅ | Per-sprint success criteria |
| Dependencies | ✅ | Inter-sprint dependencies |

---

## 4. Backlog Ticket Requirements

Every ticket in the backlog MUST have:

```markdown
| # | Ticket | Status | Owner | Model | Depends |
|---|--------|--------|-------|-------|---------|
| X.Y | [Clear action verb] [specific deliverable] | [Emoji] | [Role] | [haiku/sonnet/opus] | [X.Z or -] |
```

### Valid Ticket Examples
```
| 1.1 | Create users table with auth columns | 🔲 | DB | haiku | - |
| 1.2 | Implement JWT auth service | 🔲 | Backend | sonnet | 1.1 |
| 1.3 | Build LoginForm component | 🔲 | Frontend | sonnet | 1.2 |
```

### Invalid Ticket Examples
```
| 1.1 | User stuff | 🔲 | Dev | - |           # Too vague
| 1.2 | Implement feature | 🔲 | Backend | sonnet |  # No specificity
| 1.3 | Do the login | 🔲 | - | - |             # Missing owner/model
```

---

## 5. Sprint Prompt Requirements

Each sprint prompt (prompts/prompt_sprintN.md) MUST include:

```markdown
# Sprint N: [Name]

## Context
- Project: [name]
- Sprint Goal: [one-liner]
- Tech Stack: [brief]

## Specs to Read
1. specs/backlog.md (Sprint N section)
2. specs/[relevant_specs].md

## Tickets
| # | Ticket | Status | Owner | Model | Depends |
|---|--------|--------|-------|-------|---------|
[Full ticket table for this sprint]

## Execution Guidelines
- Model selection strategy
- Testing requirements
- Commit message format

## Definition of Done
- [ ] All tickets ✅
- [ ] Tests pass
- [ ] Documentation updated
```

---

## 6. Validation Checklist

### Phase 1: Structure Validation
```
[ ] specs/ folder exists
[ ] backlog.md exists and has content
[ ] At least Sprint 0 defined
[ ] Required specs present based on project type
[ ] prompts/ folder exists
[ ] prompt_sprint0.md exists
```

### Phase 2: Content Validation
```
[ ] Each spec meets minimum line count
[ ] Each spec has all required sections
[ ] Backlog has valid ticket format
[ ] Tickets have clear owners and models
[ ] Sprint 0 has 8+ foundation tickets
```

### Phase 3: Consistency Validation
```
[ ] API endpoints in backend spec match frontend integration
[ ] Database tables match backend models
[ ] Component inventory matches page layouts
[ ] Test strategy covers all features in backlog
```

### Phase 4: Completeness Validation
```
[ ] All user flows have corresponding tickets
[ ] All database tables have CREATE statements
[ ] All API endpoints have request/response examples
[ ] All components have prop definitions
[ ] All screens have wireframe specs
```

---

## 7. CLI Validation Output

When running `sdd validate`, output should be:

```
SDD Project Validation Report
=============================

Project: my-app
Type: Full Stack Web Application

Structure Check:
  ✅ specs/ folder exists
  ✅ backlog.md exists (1,250 lines)
  ✅ prompts/ folder exists
  ✅ prompt_sprint0.md exists
  ⚠️  .claude/commands/ missing (recommended for Claude users)

Spec Coverage:
  ✅ 01_product_manager.md (312 lines) - PASS
  ✅ 02_backend_lead.md (584 lines) - PASS
  ✅ 03_frontend_lead.md (892 lines) - PASS
  ✅ 04_db_architect.md (445 lines) - PASS
  ✅ 05_qa_lead.md (567 lines) - PASS
  ✅ 06_devops_lead.md (623 lines) - PASS
  ⚠️  10_ui_designer.md missing (recommended for frontend projects)

Backlog Health:
  ✅ Valid ticket format
  ✅ Sprint 0: 12 tickets (8 minimum met)
  ✅ Sprint 1: 18 tickets
  ⚠️  3 tickets missing model assignment
  ⚠️  5 tickets missing dependencies

Overall: PASS with warnings
  - Add .claude/commands/ for Claude Code support
  - Add 10_ui_designer.md for UI specifications
  - Assign models to tickets: 2.3, 2.7, 3.1
  - Add dependencies to tickets: 1.5, 1.8, 2.1, 2.4, 2.9
```

---

## 8. Minimum Viable SDD Project

For the quickest valid project, you need:

```
project/
├── specs/
│   ├── 01_product_manager.md    # 200+ lines
│   ├── 05_qa_lead.md            # 500+ lines
│   └── backlog.md               # 200+ lines with Sprint 0
└── prompts/
    └── prompt_sprint0.md        # Foundation sprint
```

This allows you to:
1. Define what you're building (01)
2. Define how you'll test it (05)
3. Track work (backlog)
4. Execute Sprint 0 (prompt)

Everything else can be added incrementally.

---

## 9. Generation Pipeline

When using `sdd init`, the pipeline should:

```
1. GATHER
   └── Read requirements.md / SRS / PRD
   └── Interactive prompts for missing info

2. PARSE
   └── Extract project name, type, tech stack
   └── Extract features and user flows
   └── Extract constraints and requirements

3. GENERATE SPECS
   └── 01_product_manager.md (from requirements)
   └── 02_backend_lead.md (if has backend)
   └── 03_frontend_lead.md (if has frontend)
   └── 04_db_architect.md (if has database)
   └── 05_qa_lead.md (always)
   └── 06_devops_lead.md (always)
   └── 10_ui_designer.md (if has frontend)

4. GENERATE BACKLOG
   └── Sprint 0: Foundation tickets
   └── Sprint 1: Core feature tickets
   └── Assign owners based on ticket type
   └── Assign models based on complexity

5. GENERATE PROMPTS
   └── prompt_sprint0.md
   └── prompt_sprint1.md (if enough content)

6. GENERATE SKILLS
   └── .claude/commands/ (6 files)
   └── OR .github/copilot-instructions.md

7. VALIDATE
   └── Run validation checklist
   └── Report warnings
   └── Suggest improvements
```

---

## 10. Quality Tiers

### Tier 1: Minimum (Quick Start)
- 3 specs (01, 05, backlog)
- Sprint 0 only
- Basic prompts
- ~500 total lines

### Tier 2: Standard (Recommended)
- 6 specs (01-05, backlog)
- Sprint 0-1
- Full prompts with guidelines
- ~2,000 total lines

### Tier 3: Complete (Production Ready)
- All 10 specs
- Sprint 0-2+
- Multi-agent prompts
- Full validation passing
- ~5,000+ total lines

### Tier 4: Enterprise (Full Methodology)
- All 10 specs with maximum detail
- Business specs (07, 08, 09)
- Complete UI wireframes
- Comprehensive test strategy
- ~10,000+ total lines

---

*This schema ensures every SDD project has the foundation needed for successful AI-assisted development.*
