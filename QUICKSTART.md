# AutoSpec — Master Generation Prompt

**The single prompt that generates everything.** Paste this into your AI assistant alongside your SRS / requirements documents. No CLI needed.

---

## How To Use

1. Place your SRS, PRD, or requirements documents in a folder.
2. Copy the **Generation Prompt** below into your AI assistant.
3. Replace `{{INPUT_FOLDER}}` with the path to your documents folder.
4. The AI generates the complete output structure in one pass.

---

## Generation Prompt

Copy everything between the `---START---` and `---END---` markers.

---START---

```
You are executing the AutoSpec Spec-Driven Development methodology.

Read ALL documents in the input folder. Use them as the single source of truth.

## Input

Read every file in: {{INPUT_FOLDER}}
These are the project's SRS, PRD, and/or requirements documents.

Extract from them:
  - Project name and description
  - Target users / personas
  - All functional and non-functional requirements
  - Technical stack (frontend, backend, database, language, hosting)
  - Constraints, assumptions, and out-of-scope items
  - User flows and business rules

If any of the above are missing from the input documents, state your assumptions
explicitly at the top of 01_product_manager.md and continue generating.

══════════════════════════════════════════════════════════════
GENERATION PLAN — WHAT YOU MUST PRODUCE
══════════════════════════════════════════════════════════════

Generate the COMPLETE output structure below.
Every file must be specific to THIS project — no generic placeholders.

project/
│
├── specs/                              # 10 role-based specifications
│   ├── 01_product_manager.md
│   ├── 02_backend_lead.md
│   ├── 03_frontend_lead.md
│   ├── 04_db_architect.md
│   ├── 05_qa_lead.md
│   ├── 06_devops_lead.md
│   ├── 07_marketing_lead.md
│   ├── 08_finance_lead.md
│   ├── 09_business_lead.md
│   ├── 10_ui_designer.md
│   └── backlog.md                      # Sprint-organized ticket backlog
│
├── docs/                               # Comprehensive project documentation
│   ├── architecture/
│   │   ├── overview.md                 # High-level system architecture
│   │   ├── backend.md                  # Backend layers, patterns, structure
│   │   ├── frontend.md                 # Component architecture, state, routing
│   │   ├── database.md                 # ERD, schemas, migrations, queries
│   │   ├── security.md                 # Auth flow, encryption, OWASP checklist
│   │   ├── cloud.md                    # Cloud provider architecture (AWS/GCP/Azure)
│   │   └── deep-dive.md               # Detailed technical decisions and trade-offs
│   │
│   ├── workflows/
│   │   ├── development.md              # Feature development step-by-step
│   │   ├── sprint-execution.md         # How to run a sprint (single + multi-agent)
│   │   ├── git-workflow.md             # Branching strategy, commit conventions, PR flow
│   │   ├── ci-cd-pipeline.md           # Pipeline stages, triggers, artifacts
│   │   ├── bug-fix.md                  # Triage → reproduce → fix → verify flow
│   │   ├── deployment.md               # Dev → staging → production deployment
│   │   ├── multi-agent.md              # Parallel agent execution rules
│   │   └── qa-review.md               # QA checklist and review process
│   │
│   ├── environments/
│   │   ├── development.md              # Local setup guide with prerequisites
│   │   ├── docker.md                   # docker-compose, Dockerfiles, commands
│   │   ├── staging.md                  # Staging environment config
│   │   ├── production.md               # Production environment + checklist
│   │   └── environment-variables.md    # Complete .env reference with every variable
│   │
│   ├── api/
│   │   ├── reference.md                # Full REST API reference (all endpoints)
│   │   ├── authentication.md           # Auth endpoints, token flow, refresh
│   │   ├── error-codes.md              # Error code catalog with HTTP mappings
│   │   └── rate-limiting.md            # Rate limit rules per endpoint
│   │
│   ├── testing/
│   │   ├── strategy.md                 # Test pyramid, coverage targets
│   │   ├── unit-tests.md               # Unit test patterns with examples
│   │   ├── integration-tests.md        # API integration test patterns
│   │   ├── e2e-tests.md                # End-to-end test scenarios
│   │   └── test-data.md                # Seed data, fixtures, factories
│   │
│   ├── ui-design-system/
│   │   ├── tokens.md                   # Colors, typography, spacing, radii, shadows
│   │   ├── components.md               # Component inventory with states
│   │   ├── layouts.md                  # Page layouts, grid system, breakpoints
│   │   ├── accessibility.md            # WCAG 2.1 AA checklist, screen reader notes
│   │   └── icons-assets.md             # Icon set, image guidelines, loading strategy
│   │
│   └── project/
│       ├── setup.md                    # Repo structure, configs, IDE setup
│       ├── coding-standards.md         # Naming, patterns, linting rules
│       └── glossary.md                 # Project-specific terms defined
│
├── sprint_prompts/                     # Ready-to-paste sprint execution prompts
│   ├── sprint-0-foundation.md          # Foundation sprint with phase breakdown
│   ├── sprint-N-template.md            # Feature sprint template (replace N)
│   ├── multi-agent.md                  # Agent A (backend) + Agent B (frontend) prompts
│   ├── qa-review.md                    # QA review checklist prompt
│   └── finops.md                       # Model selection optimizer (haiku/sonnet/opus)
│
└── viewer/                             # Project monitor website (React app)
    └── (see Section 7 for full spec)

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

══════════════════════════════════════════════════════════════
SECTION 3 — DOCS: ARCHITECTURE
══════════════════════════════════════════════════════════════

Generate every file in docs/architecture/.

### docs/architecture/overview.md
- High-level system diagram (ASCII): client → API → DB → cache → queue
- Tech stack summary table
- Request lifecycle from browser to database and back
- Non-functional requirements summary (latency, throughput, availability)
- Key architectural decisions with rationale

### docs/architecture/backend.md
- Layered architecture: Routes → Middleware → Controllers → Services → Repositories
- Directory structure with file purposes
- Dependency injection approach
- Error propagation through layers
- Logging at each layer

### docs/architecture/frontend.md
- Component tree from App root to leaf components
- State flow: global store → context → local state → derived
- Data fetching strategy (React Query / SWR / fetch)
- Code splitting and lazy loading plan
- Asset pipeline (images, fonts, icons)

### docs/architecture/database.md
- Full ERD with all relationships (ASCII)
- Table catalog: every table with column list and purpose
- Query performance expectations
- Connection pooling configuration
- Partitioning or sharding strategy (if applicable, else state "not needed at this scale")

### docs/architecture/security.md
- Authentication flow diagram (ASCII): register → login → token → refresh → logout
- Authorization model (RBAC/ABAC) with role definitions
- Input validation layer (where, how, which library)
- SQL injection, XSS, CSRF prevention
- Secret management (env vars, vault, rotation policy)
- HTTPS, CORS, CSP, rate limiting
- Data encryption: at rest (DB) and in transit (TLS)

### docs/architecture/cloud.md
- Target cloud provider architecture
- Service mapping: which cloud service for each component
- Networking: VPC, subnets, security groups
- Scaling strategy: horizontal auto-scaling rules
- Cost optimisation notes
- If cloud provider is unknown, generate for AWS with notes on GCP/Azure equivalents

### docs/architecture/deep-dive.md
- Technical decisions log: decision, options considered, chosen option, rationale
- Trade-offs acknowledged
- Known limitations and future migration paths
- Performance bottleneck analysis
- Caching strategy (what, where, TTL, invalidation)

══════════════════════════════════════════════════════════════
SECTION 4 — DOCS: WORKFLOWS, ENVIRONMENTS, API, TESTING,
             UI DESIGN SYSTEM, PROJECT
══════════════════════════════════════════════════════════════

Generate every file in docs/workflows/, docs/environments/, docs/api/,
docs/testing/, docs/ui-design-system/, and docs/project/.

Each file should be 100–300 lines, specific to THIS project.

### docs/workflows/
- development.md: Feature development flow from ticket to done (step-by-step)
- sprint-execution.md: How to run a sprint with AutoSpec (read specs, execute tickets, update backlog)
- git-workflow.md: Branch naming, commit format (type(scope): desc), PR template, merge strategy
- ci-cd-pipeline.md: Pipeline diagram, stage details, failure handling, artifact outputs
- bug-fix.md: Triage → reproduce → failing test → fix → verify → update backlog
- deployment.md: Dev auto-deploy, staging on merge to develop, production on release tag
- multi-agent.md: Agent A (backend) + Agent B (frontend) rules, shared backlog, integration phase
- qa-review.md: Code quality, test coverage, security, functional, performance, accessibility checklists

### docs/environments/
- development.md: Prerequisites, clone, install, env vars, start services, verify health
- docker.md: docker-compose.yml content, Dockerfiles, common commands, troubleshooting
- staging.md: Staging URL, deployment, data seeding, access control
- production.md: Production URL, deployment, checklist, rollback procedure
- environment-variables.md: Every env var with name, description, example value, required/optional

### docs/api/
- reference.md: Full endpoint catalog with Method | Path | Auth | Body | Response | Codes
- authentication.md: Register, login, refresh, logout flows with curl examples
- error-codes.md: Every error code, HTTP status, user message, developer message
- rate-limiting.md: Rules table, headers returned, retry-after handling

### docs/testing/
- strategy.md: Test pyramid, tooling, coverage targets, CI integration
- unit-tests.md: Service test pattern (arrange/act/assert), mocking guide, examples
- integration-tests.md: API test pattern (supertest), test DB setup/teardown, examples
- e2e-tests.md: Critical user journeys as test scenarios, Playwright/Cypress patterns
- test-data.md: Seed script, factory functions, fixture files

### docs/ui-design-system/
- tokens.md: Full token table: colors (hex + semantic name), spacing (scale), font sizes, weights, line heights, border radii, shadows, z-index scale
- components.md: Every UI component: name, props, variants, states (default/hover/active/disabled/error/loading)
- layouts.md: Page layout templates, grid system (12-col), sidebar width, header height, breakpoints
- accessibility.md: WCAG 2.1 AA checklist applied to this project, focus management, aria attributes, skip links
- icons-assets.md: Icon library (Lucide/Heroicons), image optimisation (WebP, lazy loading), favicon, OG image

### docs/project/
- setup.md: Full repo structure tree, config files explained (tsconfig, eslint, prettier, vite)
- coding-standards.md: Naming conventions (camelCase vars, PascalCase types, snake_case DB), patterns, import order
- glossary.md: Every project-specific term defined (domain language)

══════════════════════════════════════════════════════════════
SECTION 5 — SPRINT PROMPTS
══════════════════════════════════════════════════════════════

Generate every file in sprint_prompts/.

### sprint_prompts/sprint-0-foundation.md
A complete, ready-to-paste prompt for executing Sprint 0 with:
- Full project context (name, stack, what the specs say)
- Phase breakdown: Infrastructure → Backend setup → Frontend setup → Quality gates
- Per-ticket instructions referencing the exact spec file and section
- Definition of done checklist
- Commands to verify each phase (health check, lint, test)

### sprint_prompts/sprint-N-template.md
A template prompt for any feature sprint with:
- [N] placeholder for sprint number
- Instructions to read specs/backlog.md for the sprint's tickets
- Backend ticket pattern: migration → schema → repo → service → controller → routes → tests
- Frontend ticket pattern: types → API service → components → page → routes → tests
- Backlog update reminders after every ticket
- Sprint completion checklist

### sprint_prompts/multi-agent.md
- Agent A (Backend) prompt: scope, directory, specs to read, pattern, rules
- Agent B (Frontend) prompt: scope, directory, specs to read, pattern, rules
- Integration phase prompt: merge, connect APIs, full test suite, fix issues
- Rules: no cross-directory work, shared backlog, dependency order

### sprint_prompts/qa-review.md
- Prompt for QA review after a sprint
- Checklist sections: code quality, test coverage, security, functional, performance, accessibility
- Per-ticket output format: status (PASS/FAIL), issues found, verdict
- Final actions: mark tickets done, add bugs to backlog

### sprint_prompts/finops.md
- Model selection guide: haiku (40%), sonnet (45%), opus (15%)
- Per-task-type recommendations
- Cost comparison table
- Sprint cost forecast template

══════════════════════════════════════════════════════════════
SECTION 6 — VIEWER / PROJECT MONITOR WEBSITE
══════════════════════════════════════════════════════════════

Generate a complete, self-contained React application in viewer/ that
provides a visual dashboard for ALL generated artefacts (specs, docs,
backlog, workflows).

### 6.1 Tech Stack

  React 18 + TypeScript + Vite + Tailwind CSS + React Router
  @xyflow/react (React Flow v12) — workflow graph visualisation
  framer-motion — panel transitions ONLY (NOT for mass edge animation)
  lucide-react — icons
  react-markdown + remark-gfm — Markdown rendering

### 6.2 Project Structure

viewer/
├── public/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css                    # Tailwind + global tokens + @keyframes
│   │
│   ├── data/                        # Static artefacts (import at build time)
│   │   ├── specs/                   # All 10 spec .md files
│   │   ├── docs/                    # All docs .md files (mirrored structure)
│   │   ├── backlog.json             # Parsed backlog (sprints + tickets)
│   │   ├── workflows.json           # Graph definitions (nodes + edges)
│   │   └── requirements.md          # Original SRS
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx        # "/"
│   │   ├── SpecsPage.tsx            # "/specs" + "/specs/:slug"
│   │   ├── DocsPage.tsx             # "/docs" + "/docs/:section/:slug"
│   │   ├── BacklogPage.tsx          # "/backlog"
│   │   ├── WorkflowsPage.tsx        # "/workflows"
│   │   ├── ArchitecturePage.tsx     # "/architecture"
│   │   └── RequirementsPage.tsx     # "/requirements"
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # Collapsible nav (260 px → 64 px)
│   │   │   ├── Header.tsx           # Search, breadcrumb, theme toggle
│   │   │   ├── DetailsPanel.tsx     # Right drawer (380 px, slide-in)
│   │   │   └── Layout.tsx           # Three-column shell
│   │   │
│   │   ├── specs/
│   │   │   ├── SpecViewer.tsx       # Markdown renderer + sticky TOC
│   │   │   └── SpecCard.tsx         # Grid card for spec list
│   │   │
│   │   ├── docs/
│   │   │   ├── DocViewer.tsx        # Markdown renderer for docs
│   │   │   ├── DocTree.tsx          # Nested folder tree navigation
│   │   │   └── DocCard.tsx          # Card for doc section
│   │   │
│   │   ├── backlog/
│   │   │   ├── BacklogBoard.tsx     # Tab per sprint + table
│   │   │   ├── SprintTab.tsx
│   │   │   └── TicketRow.tsx
│   │   │
│   │   ├── workflows/
│   │   │   ├── WorkflowCanvas.tsx   # React Flow wrapper
│   │   │   ├── AnimatedEdge.tsx     # SVG stroke-dashoffset animation
│   │   │   ├── WorkflowNode.tsx     # Memoised node component
│   │   │   ├── AnimationController.tsx  # Play/Pause/Speed/Focus toolbar
│   │   │   ├── WorkflowLegend.tsx   # Collapsible legend overlay
│   │   │   ├── WorkflowSearch.tsx   # Search + filter bar
│   │   │   └── PlayTour.tsx         # Auto-walk critical path
│   │   │
│   │   ├── dashboard/
│   │   │   ├── OverviewCards.tsx
│   │   │   ├── ProgressRing.tsx
│   │   │   └── RecentTickets.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Toggle.tsx
│   │       └── Tooltip.tsx
│   │
│   ├── hooks/
│   │   ├── useAnimationEngine.ts    # Central animation state
│   │   ├── useAnimationSettings.ts  # localStorage persistence
│   │   └── useReducedMotion.ts      # prefers-reduced-motion
│   │
│   └── lib/
│       ├── animation.ts             # Constants, easing, helpers
│       ├── graph.ts                 # BFS, critical path, subgraph
│       └── theme.ts                 # Design tokens
│
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json

### 6.3 Design System (Dark Theme)

Colours:
  --bg:           #0f172a   (slate-950)
  --surface:      #1e293b   (slate-800)
  --surface-2:    #334155   (slate-700)
  --border:       rgba(255,255,255,0.08)
  --text:         #f1f5f9   (slate-100)
  --text-muted:   #94a3b8   (slate-400)
  --primary:      #3b82f6   (blue-500)
  --secondary:    #a855f7   (purple-500)
  --success:      #10b981   (emerald-500)
  --warning:      #f59e0b   (amber-500)
  --error:        #ef4444   (red-500)
  --info:         #06b6d4   (cyan-500)

Typography: Inter (headings 600–700, body 400), JetBrains Mono (code)
Base: 16 px, scale: 1.25
Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px
Radii: sm 6, md 10, lg 16, full 9999

### 6.4 Pages

Dashboard ("/"):
  - Project name, description, tech stack badges
  - Sprint progress ring (% done)
  - Stat cards: tickets, done, in-progress, blocked
  - Top 5 in-progress tickets table
  - Quick-links grid to all 10 specs and all doc sections
  - "View Workflows" CTA

Specs ("/specs"):
  - 10 spec cards in responsive grid (2 col md, 3 col lg)
  - Card: role icon, title, excerpt, word count
  - Detail ("/specs/:slug"): full Markdown, sticky TOC from ## headings

Docs ("/docs"):
  - Nested tree navigation mirroring docs/ folder structure
  - Cards per folder (architecture, workflows, environments, etc.)
  - Detail ("/docs/:section/:slug"): full Markdown with TOC
  - Breadcrumb: Docs > Architecture > Security

Backlog ("/backlog"):
  - Tab per sprint (Sprint 0, 1, 2, …)
  - Table with ticket rows, status badges (colour-coded), owner, model
  - Filters: status, owner, model
  - Search: free-text across descriptions
  - Sprint progress bar per tab

Workflows ("/workflows"):
  - Full-screen React Flow canvas (see Section 6.5)
  - Top toolbar: animation controls + search + filters
  - Bottom-right: legend overlay (collapsible)
  - Sidebar auto-collapses on this page

Architecture ("/architecture"):
  - Renders docs/architecture/overview.md as Markdown
  - ASCII diagrams in styled <pre> blocks
  - Links to other architecture docs

Requirements ("/requirements"):
  - Renders original SRS as Markdown
  - Functional vs non-functional badges

### 6.5 Workflow Animation Engine

DATA MODEL:

  interface WorkflowGraph {
    id: string;
    name: string;
    description: string;
    nodes: WorkflowNode[];
    edges: WorkflowEdge[];
  }

  interface WorkflowNode {
    id: string;
    label: string;
    type: 'process' | 'decision' | 'start' | 'end' | 'external';
    metadata?: Record<string, string>;
    position: { x: number; y: number };
  }

  interface WorkflowEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
    animated: boolean;
    animationDirection: 'forward' | 'reverse';
    priority: number;   // 0 = critical path, 1+ = secondary
  }

Generate workflows.json with at LEAST these graphs:
  1. Feature Development Flow (8–12 nodes)
  2. Sprint Execution Flow (6–10 nodes)
  3. System Request Lifecycle (8–12 nodes, from client to DB and back)
  4. CI/CD Pipeline (8–10 nodes with parallel stages)
  5. User Authentication Flow (8–10 nodes)
  6. One additional flow derived from the project's specific user flows

EDGE ANIMATION (AnimatedEdge.tsx):

  Technique: SVG stroke-dasharray + stroke-dashoffset via CSS @keyframes.
  NO JavaScript timers. Pure CSS on an SVG <path>.

  The edge draws a second <path> overlay (the "pulse"):
    - strokeDasharray = pathLength
    - strokeDashoffset animates from pathLength → 0 (forward)
    - animation-duration reads from CSS variable --edge-anim-duration
    - animationTimingFunction: ease-in-out
    - animationIterationCount: infinite

  @keyframes edgeFlow {
    0%   { stroke-dashoffset: var(--path-length); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { stroke-dashoffset: 0; opacity: 0; }
  }

  Speed mapping (set as CSS custom property on wrapper):
    0.5x → --edge-anim-duration: 6s
    1.0x → --edge-anim-duration: 3s
    1.5x → --edge-anim-duration: 2s

NODE SELECTION — CAUSAL TRACE:

  Click a node →
    Step 1 (0 ms): Dim all nodes/edges to opacity 0.15.
                    Highlight clicked node (opacity 1 + ring).
    Step 2 (0–600 ms): Incoming edges animate (pulse travels TO node).
                        Source nodes fade to 0.8.
    Step 3 (600–900 ms): Pause. Clicked node pulses (scale 1.0 → 1.03 → 1.0).
    Step 4 (900–1500 ms): Outgoing edges animate (pulse travels AWAY).
                           Target nodes fade to 0.8.
                           Multiple outgoing edges stagger 150 ms each.
    Step 5 (1500 ms+): Hold. Edges loop. Click another node or canvas bg to reset.

  Implementation: CSS classes toggled by useAnimationEngine hook.
  NO per-node/per-edge React state. Only hook holds selectedNodeId.

CONTROLS (AnimationController.tsx):

  ┌──────────────────────────────────────────────────────────┐
  │ ▶ Play │ ⏸ Pause │ 0.5x  1x  1.5x │ 🔍 Focus │ ⚙ │
  └──────────────────────────────────────────────────────────┘

  - Play / Pause: toggle edge CSS animation-name.
  - Speed: set --edge-anim-duration CSS property. No React re-render.
  - Focus Mode: only selected node's subgraph (BFS depth 2) visible.
    If no node selected: auto-highlight critical path (longest path heuristic).
  - Settings gear (⚙) popover: master ON/OFF + reduced-motion override.
  - Persist to localStorage: animationsEnabled, speed, focusMode.

PLAY TOUR (PlayTour.tsx):

  1. Compute critical path (longest start→end path).
  2. fitView to start node (800 ms pan).
  3. Trigger causal trace on current node.
  4. Open DetailsPanel with node metadata.
  5. Wait 1500 ms / speed multiplier.
  6. Advance to next node.
  7. On final node: fitView to full graph (1200 ms).
  Cancel: click canvas, press Escape, or click Pause.

LEGEND (WorkflowLegend.tsx):

  Bottom-right corner, semi-transparent, collapsible.
  ──▶  Animated pulse = active data flow
  - -▶  Dashed = secondary / inactive path
  ● Blue   = process step
  ◆ Yellow = decision point
  ○ Grey   = external system
  Click a node to trace its flow. "Play Tour" auto-walks the main path.
  Hidden on viewports < 768 px.

ACCESSIBILITY:

  - Read prefers-reduced-motion on mount and on change.
  - If active: animations default OFF, edges show static dashes,
    node selection uses instant opacity (0 ms transition).
    User can still opt-in via Settings toggle.
  - All controls: keyboard-accessible (Tab, Enter, Space).
  - Animated edges: aria-hidden="true" (decorative).

PERFORMANCE (>50 nodes or >80 edges):

  1. Only animate priority-0 edges by default.
  2. Enable React Flow viewport virtualisation.
  3. React.memo on EVERY node and edge component.
  4. Memo comparator ignores: playing, speed, focusedNodeId.
  5. ONE requestAnimationFrame loop (if needed) via useAnimationEngine.
  6. Only GPU-composited properties: opacity, transform, stroke-dashoffset.
  7. Framer Motion: panels/pages ONLY. Never on canvas elements.
  8. Zero setInterval / setTimeout for animation.

### 6.6 Viewer Data Files

Generate these inside viewer/src/data/:

- Copy all 10 spec .md files into data/specs/.
- Copy all docs .md files into data/docs/ (preserving folder structure).
- Generate backlog.json from specs/backlog.md (structured JSON).
- Generate workflows.json with 6+ graphs (per Section 6.5).
- Copy the original requirements into data/requirements.md.

══════════════════════════════════════════════════════════════
SECTION 7 — QUALITY GATES
══════════════════════════════════════════════════════════════

Every generated file must:

  ✓ Be SPECIFIC to this project — no "[insert here]" placeholders.
  ✓ Cross-reference other files by name (e.g., "See specs/02_backend_lead.md").
  ✓ Use consistent naming across all files.
  ✓ Contain concrete examples (real endpoint paths, real table names).

Specs: 300–800 lines each.
Docs: 100–300 lines each.
Viewer: must build with zero TypeScript errors (strict mode).

══════════════════════════════════════════════════════════════
BEGIN GENERATION
══════════════════════════════════════════════════════════════

Read all documents in {{INPUT_FOLDER}}.
Generate every file listed above.
Start now.
```

---END---

---

## After Generation — What To Do Next

Once the AI has generated everything, your project folder contains:

| Folder | Contents | Files |
|--------|----------|-------|
| `specs/` | 10 role specs + backlog | 11 |
| `docs/architecture/` | System design, cloud, security, deep-dive | 7 |
| `docs/workflows/` | Dev, sprint, git, CI/CD, deploy, bug, multi-agent, QA | 8 |
| `docs/environments/` | Dev, Docker, staging, prod, env vars | 5 |
| `docs/api/` | Reference, auth, errors, rate limits | 4 |
| `docs/testing/` | Strategy, unit, integration, e2e, test data | 5 |
| `docs/ui-design-system/` | Tokens, components, layouts, a11y, assets | 5 |
| `docs/project/` | Setup, coding standards, glossary | 3 |
| `sprint_prompts/` | Sprint 0, sprint N, multi-agent, QA, finops | 5 |
| `viewer/` | React monitor app | Full project |

**Next steps:**

1. **Review specs** — Skim for accuracy, correct any assumptions.
2. **Open the viewer** — `cd viewer && npm install && npm run dev` — see everything visually.
3. **Start Sprint 0** — Paste `sprint_prompts/sprint-0-foundation.md` into your AI.
4. **Execute sprints** — Repeat with `sprint_prompts/sprint-N-template.md`.

---

## Quick Reference — Sprint Execution

```
# Sprint 0 (Foundation)
Paste sprint_prompts/sprint-0-foundation.md into AI.

# Sprint 1+ (Features)
Copy sprint_prompts/sprint-N-template.md, replace [N], paste into AI.

# Parallel execution
Paste sprint_prompts/multi-agent.md — run two AI sessions.

# QA Review
Paste sprint_prompts/qa-review.md after a sprint completes.

# Cost optimisation
Read sprint_prompts/finops.md before each sprint.
```

---

## Using the CLI (Optional)

If you prefer scaffolding, the CLI generates templates for everything above:

```bash
npm install -g autospec
autospec init          # Scaffold specs + docs + prompts + viewer prompts
autospec status        # Sprint progress
autospec sprint 1      # Generate sprint prompt
```

---

## Examples

- **ShopFlow E-commerce** — [examples/ecommerce/](./examples/ecommerce/) (7 sprints, 174 tickets)
- **DataHub API Service** — [examples/api-service/](./examples/api-service/) (4 sprints, 89 tickets)

---

*"The best code is the code you never have to debug. AutoSpec catches issues in specs before they become bugs."*
