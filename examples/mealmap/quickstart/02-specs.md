# AutoSpec Specs — Role-Based Specifications & Backlog

> **What this section covers:** This section defines the 10 role-based specification files and the backlog format. Read this when generating specs and backlog.
>
> **When to read:** When generating `specs/01_product_manager.md` through `specs/10_ui_designer.md`, or when generating/updating `specs/backlog.md`.

---

══════════════════════════════════════════════════════════════
SECTION 1 — SPECS (10 Role-Based Specifications)
══════════════════════════════════════════════════════════════

Generate 10 specification files in specs/. Each must be 300–800 lines,
specific to THIS project, with concrete examples — never generic placeholders.
Cross-reference other specs by filename where relevant.

### specs/01_product_manager.md
- Project vision, elevator pitch (one paragraph)
- Problem statement (what pain does this solve?)
- 3–5 detailed user personas: name, role, goals, frustrations, tech comfort
- User stories with acceptance criteria (Given/When/Then)
- Complete user flows (registration, core actions, edge cases) with ASCII diagrams
- Feature prioritization (MoSCoW: Must/Should/Could/Won't for v1)
- Success metrics with numeric targets
- Assumptions stated explicitly

### specs/02_backend_lead.md
- System architecture overview with ASCII diagram
- Tech stack table (framework, ORM, validation, auth, testing)
- Project directory structure
- Complete API contracts table: Method | Path | Auth | Request Body | Response | Status Codes
- Request/response JSON examples for EVERY endpoint
- Authentication flow (JWT access + refresh tokens, or sessions)
- Service layer design with responsibility boundaries
- Error handling: custom error classes, error code enum, HTTP mapping
- Rate limiting rules per endpoint category
- Middleware chain order

### specs/03_frontend_lead.md
- Tech stack (framework, build tool, CSS approach, state management)
- Component hierarchy: atoms → molecules → organisms → pages
- State management: what is global (auth, theme) vs local (form, modal)
- Complete routing table with auth guards and lazy loading
- Design system tokens: colors (hex), spacing scale (px), typography (font, sizes, weights)
- Form handling pattern (library, validation, error display)
- API client abstraction (base URL, interceptors, error handling)
- Performance targets (LCP < 2.5s, FID < 100ms, CLS < 0.1)

### specs/04_db_architect.md
- Database technology and ORM/query builder
- Entity-Relationship diagram (ASCII)
- Complete CREATE TABLE SQL for every table: columns, types, constraints, defaults
- Index definitions with purpose (what query each index optimises)
- Migration strategy: naming convention (YYYYMMDDHHMMSS_desc), tooling
- Common query patterns (list with pagination, search, joins)
- Seed data plan: what tables, how many rows, realistic data
- Soft delete vs hard delete policy

### specs/05_qa_lead.md
- Test pyramid: unit (70%) / integration (20%) / e2e (10%)
- Coverage target: 70%+ lines, 80%+ for critical services
- Test file naming and location conventions
- Unit test examples for services (with mock setup)
- Integration test examples for API endpoints (with test DB)
- E2E critical path scenarios (list every flow to test)
- Performance benchmarks: p50 < 100ms, p95 < 300ms, p99 < 1s
- Security testing checklist (OWASP top 10 mapped to this project)
- QA process: when to test, who reviews, definition of done

### specs/06_devops_lead.md
- Infrastructure diagram (ASCII)
- CI/CD pipeline: stages (lint → typecheck → test → build → deploy), triggers
- Docker setup: base images, multi-stage builds, compose services
- Environment matrix: dev | staging | production differences
- Deployment strategy (blue-green, rolling, or canary)
- Monitoring: what metrics, what alerts, what thresholds
- Logging: structured JSON, log levels, retention policy
- Backup: database backup schedule, recovery procedure, RTO/RPO

### specs/07_marketing_lead.md
- Go-to-market strategy (phased: beta → launch → growth)
- Target audience segments with estimated sizes
- Messaging framework: value props, taglines, elevator pitch
- Launch timeline with milestones
- Channel strategy: which channels, why, expected CAC per channel
- Content plan: blog posts, social, email sequences
- Success metrics: signups, activation rate, retention targets

### specs/08_finance_lead.md
- Infrastructure cost estimate (monthly: compute, DB, storage, CDN, monitoring)
- AI/LLM cost estimate (tokens per sprint, model tier breakdown)
- Pricing strategy (if SaaS: free tier, paid tiers with limits)
- Revenue projections (3, 6, 12 month)
- Unit economics: CAC, LTV, LTV:CAC ratio, payback period
- Budget allocation by phase
- Break-even analysis

### specs/09_business_lead.md
- Business model overview (how it makes money or delivers value)
- Competitive analysis: 3–5 competitors with strengths/weaknesses table
- SWOT analysis
- Value proposition canvas (jobs, pains, gains)
- KPIs with targets and measurement method
- Risk assessment: 5+ risks with likelihood, impact, mitigation
- Growth strategy: phases with triggers to advance

### specs/10_ui_designer.md
- Complete screen inventory: every page, modal, drawer, toast
- Wireframe descriptions for each screen (layout, elements, interactions)
- Component states: default, hover, active, disabled, error, loading, empty
- Responsive breakpoints: mobile (< 640), tablet (640–1024), desktop (> 1024)
- Design tokens repeated from frontend spec for self-containment
- Interaction patterns: navigation, forms, tables, cards, drag-and-drop
- Accessibility: WCAG 2.1 AA compliance, color contrast ratios, focus management
- Animation principles: micro-interactions, transitions, loading states

══════════════════════════════════════════════════════════════
SECTION 2 — BACKLOG
══════════════════════════════════════════════════════════════

Generate specs/backlog.md.

Format:

# [Project Name] Backlog

Generated: [date]
Total Tickets: [count]
Total Story Points: [sum]

## Sprint 0: Foundation
Goal: Project setup, infrastructure, walking skeleton.

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
|----|-------|-------------|--------|--------|-------|-------|-------------|

## Sprint 1: [Theme]
Goal: [description]

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
|----|-------|-------------|--------|--------|-------|-------|-------------|

[Continue for all sprints]

## Bug Backlog
| ID | Title | Severity | Status | Sprint | Notes |
|----|-------|----------|--------|--------|-------|

Rules:
- Extract EVERY actionable item from all 10 specs.
- Sprint 0: 15–25 points (setup + skeleton).
- Feature sprints: 25–40 points each.
- Each ticket: 1–5 points (split anything > 5).
- Story points: 1 = ~30 min, 2 = ~1–2h, 3 = ~2–4h, 5 = ~4–8h.
- Model column: haiku (40%), sonnet (45%), opus (15%).
- Owner: DB, Backend, Frontend, DevOps, QA.
- All statuses start as "todo".
- Include dependencies (e.g., "1.3" means ticket 1.3 must complete first).

---
*Source: QUICKSTART.md — Part 2 of 7*
