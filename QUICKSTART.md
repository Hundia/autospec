# QUICKSTART.md — AutoSpec Generation Prompt

> **What is this?** The single file that turns your requirements into a complete, AI-ready project structure. No CLI required.

## Prerequisites

- An AI coding assistant (Claude Code, Cursor, Copilot, Windsurf, or any LLM-based IDE)
- Your requirements document(s) in the `requirements/` folder
- A `.autospec/config.yml` with your environment set (optional — defaults to `claude-code`)

## 3 Steps

1. **Add your requirements** — Place your SRS, PRD, or project brief in `requirements/`
2. **Tell your AI** — "Run @QUICKSTART.md" (or paste the content below into any AI assistant)
3. **Watch it generate** — 10 expert specifications, sprint backlog, docs structure, environment-optimized prompts

## What Gets Generated

```
your-project/
├── specs/           # 10 role-based specifications
│   ├── 01_product_manager.md
│   ├── 02_backend_lead.md
│   ├── ...
│   └── backlog.md   # Sprint tickets with estimates
├── docs/            # Living documentation
├── sprints/         # Sprint plans & summaries
├── prompts/         # Environment-optimized AI prompts
└── CLAUDE.md        # Project memory & conventions
```

## What's NOT Generated (pre-installed in template)

- `QUICKSTART.md` (this file)
- `requirements/` (your input)
- `.claude/commands/` (11 SDD skills)
- `.autospec/config.yml` (your settings)

## Environment Options

| Environment | Description | Recommended Model |
|-------------|-------------|-------------------|
| `claude-code` | Claude Code CLI | Claude Sonnet/Opus |
| `cursor` | Cursor IDE | Claude/GPT-4 |
| `vscode-copilot` | VS Code + GitHub Copilot | GPT-4/Copilot |
| `windsurf` | Windsurf/Codeium IDE | Various |
| `jetbrains-ai` | JetBrains AI Assistant | Various |
| `aider` | Aider CLI | Claude/GPT-4 |

---

**Everything below this line is consumed by your AI assistant.**
**Do not edit unless you know what you're doing.**

---

<!-- GENERATION PROMPT START -->

```
You are executing the AutoSpec Spec-Driven Development methodology.

Read ALL documents in the input folder. Use them as the single source of truth.

## Input

Read every file in: {{INPUT_FOLDER}}
These are the project's SRS, PRD, and/or requirements documents.

Development Environment: {{ENVIRONMENT}}
(Options: claude-code, vscode-copilot, cursor, windsurf, jetbrains-ai, aider)

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
│   │   ├── overview.md                 # High-level system architecture with ASCII diagrams
│   │   ├── backend.md                  # Backend layers, patterns, structure
│   │   ├── frontend.md                 # Component architecture, state, routing
│   │   ├── database.md                 # ERD, schemas, migrations, queries
│   │   ├── security.md                 # Auth flow, encryption, OWASP checklist
│   │   ├── cloud.md                    # Cloud provider architecture (AWS/GCP/Azure)
│   │   ├── deep-dive.md                # Detailed technical decisions and trade-offs
│   │   └── diagrams.md                 # Mermaid/PlantUML diagram definitions for visualization
│   │
│   ├── flows/                          # User and system flow documentation (NEW)
│   │   ├── user-journeys.md            # Complete user journey maps with steps
│   │   ├── authentication-flow.md      # Login/register/logout/refresh flow diagrams
│   │   ├── core-features-flow.md       # Main feature flows (extracted from SRS)
│   │   ├── data-flow.md                # How data moves through the system
│   │   ├── error-handling-flow.md      # Error propagation and recovery flows
│   │   └── state-transitions.md        # State machine definitions for key entities
│   │
│   ├── workflows/
│   │   ├── development.md              # Feature development step-by-step
│   │   ├── sprint-execution.md         # How to run a sprint (single + multi-agent)
│   │   ├── git-workflow.md             # Branching strategy, commit conventions, PR flow
│   │   ├── ci-cd-pipeline.md           # Pipeline stages, triggers, artifacts
│   │   ├── bug-fix.md                  # Triage → reproduce → fix → verify flow
│   │   ├── deployment.md               # Dev → staging → production deployment
│   │   ├── multi-agent.md              # Parallel agent execution rules
│   │   └── qa-review.md                # QA checklist and review process
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
│   │   ├── rate-limiting.md            # Rate limit rules per endpoint
│   │   └── curl-examples.md            # Ready-to-run curl commands for all endpoints (NEW)
│   │
│   ├── testing/
│   │   ├── strategy.md                 # Test pyramid, coverage targets
│   │   ├── unit-tests.md               # Unit test patterns with examples
│   │   ├── integration-tests.md        # API integration test patterns
│   │   ├── e2e-tests.md                # End-to-end test scenarios
│   │   ├── test-data.md                # Seed data, fixtures, factories
│   │   └── api-test-suite.md           # Complete API test scenarios with curl (NEW)
│   │
│   ├── ui-design-system/
│   │   ├── tokens.md                   # Colors, typography, spacing, radii, shadows
│   │   ├── components.md               # Component inventory with states
│   │   ├── layouts.md                  # Page layouts, grid system, breakpoints
│   │   ├── accessibility.md            # WCAG 2.1 AA checklist, screen reader notes
│   │   ├── icons-assets.md             # Icon set, image guidelines, loading strategy
│   │   └── screens.md                  # Screen inventory with wireframe descriptions (NEW)
│   │
│   └── project/
│       ├── setup.md                    # Repo structure, configs, IDE setup
│       ├── coding-standards.md         # Naming, patterns, linting rules
│       ├── glossary.md                 # Project-specific terms defined
│       └── dependencies.md             # Package dependencies and rationale (NEW)
│
├── prompts/                            # Sprint execution prompts (organized by sprint)
│   ├── sprint_0/                       # Foundation sprint folder
│   │   ├── sprint_plan_0.md            # Sprint 0 planning guide & definition of done
│   │   ├── dev_sprint_0.md             # Development execution prompt
│   │   ├── qa_sprint_0.md              # QA testing prompt with curl/API tests
│   │   ├── summary_sprint_0.md         # Sprint summary generation prompt
│   │   └── sprint_dod_checklist_0.md   # Definition of Done verification checklist (NEW)
│   │
│   ├── sprint_1/                       # Feature sprint 1 folder
│   │   ├── sprint_plan_1.md            # Sprint 1 planning guide
│   │   ├── dev_sprint_1.md             # Development execution prompt
│   │   ├── qa_sprint_1.md              # QA testing prompt
│   │   ├── summary_sprint_1.md         # Sprint summary generation prompt
│   │   └── sprint_dod_checklist_1.md   # Definition of Done verification checklist (NEW)
│   │
│   ├── sprint_N/                       # (Repeat for ALL sprints in backlog.md)
│   │   ├── sprint_plan_N.md
│   │   ├── dev_sprint_N.md
│   │   ├── qa_sprint_N.md
│   │   ├── summary_sprint_N.md
│   │   └── sprint_dod_checklist_N.md   # Definition of Done verification checklist (NEW)
│   │
│   ├── multi-agent.md                  # Agent A (backend) + Agent B (frontend) prompts
│   ├── finops.md                       # Model selection optimizer (haiku/sonnet/opus)
│   ├── gemini-diagram-prompts.md       # Prompts for Gemini to generate architecture diagrams
│   └── remotion-video-prompt.md        # Prompt for Remotion video generation
│
├── sprints/                            # Sprint execution results (generated after each sprint)
│   ├── sprint_0/                       # Sprint 0 results
│   │   ├── qa_result.md                # QA test results and coverage
│   │   ├── release_notes.md            # What was delivered
│   │   ├── summary.md                  # Sprint retrospective (includes git tag reference)
│   │   └── dod_verified.md             # DoD checklist verification results (NEW)
│   │
│   └── sprint_N/                       # (Generated after each sprint completes)
│       ├── qa_result.md
│       ├── release_notes.md
│       ├── summary.md                  # Contains git tag: sprint-N-complete
│       └── dod_verified.md             # DoD verification with pass/fail per item
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
SECTION 5 — SPRINT PROMPTS (Per-Sprint Folder Structure)
══════════════════════════════════════════════════════════════

Generate prompts for EVERY sprint defined in specs/backlog.md. Each sprint
gets its own folder with 4 prompt files. This ensures complete coverage
of the entire project backlog, not just the first sprint.

CRITICAL RULES:
1. Generate prompts for ALL sprints (Sprint 0, 1, 2, ... N) found in backlog.md
2. Each prompt must be COMPLETE and READY TO PASTE — no placeholders
3. Every prompt must begin with files to read for full context
4. Include environment-specific instructions based on {{ENVIRONMENT}}
5. QA prompts must include ACTUAL runnable tests (curl, API calls, etc.)

══════════════════════════════════════════════════════════════
SECTION 5.1 — SPRINT PLAN PROMPT (sprint_plan_X.md)
══════════════════════════════════════════════════════════════

For each sprint, generate prompts/sprint_X/sprint_plan_X.md:

```markdown
# Sprint [X] Planning Guide: [Sprint Name]

## Environment: {{ENVIRONMENT}}

## Sprint Overview
- **Goal:** [One sentence from backlog.md]
- **Duration:** [Estimated based on total story points]
- **Total Tickets:** [Count]
- **Total Story Points:** [Sum]
- **Dependencies:** [List any sprint dependencies]

## Pre-Sprint Checklist
- [ ] Previous sprint(s) complete (if applicable)
- [ ] All spec files reviewed and understood
- [ ] Development environment ready
- [ ] Database running and accessible
- [ ] All team members (or AI agents) briefed

## Tickets Overview
[Table from backlog.md for this sprint]

## Execution Order
Based on dependencies, execute in this order:
1. [Ticket X.1] - No dependencies, start here
2. [Ticket X.2] - Depends on X.1
3. ...

## Definition of Done

### Per-Ticket DoD
Each ticket is DONE when:
- [ ] Implementation complete per spec
- [ ] Unit tests written and passing
- [ ] Integration tests (if applicable)
- [ ] Code follows coding-standards.md
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Committed with message: "Complete X.Y: [description]"
- [ ] Backlog status updated to ✅

### Sprint DoD
Sprint is COMPLETE when:
- [ ] All tickets show ✅ Done status
- [ ] All tests pass: `npm test` exits 0
- [ ] Lint passes: `npm run lint` exits 0
- [ ] Type check passes: `npm run typecheck` exits 0
- [ ] Build succeeds: `npm run build` exits 0
- [ ] QA review complete (see qa_sprint_X.md)
- [ ] Sprint summary created (see summary_sprint_X.md)
- [ ] All changes committed and pushed

## Model Selection Guide (FinOps)
Based on ticket complexity:

| Ticket | Recommended Model | Rationale |
|--------|-------------------|-----------|
[Generate based on ticket content - haiku for simple, sonnet for standard, opus for complex]

## Risk Assessment
- **Blockers:** [Potential blockers identified from dependencies]
- **Complexity:** [High/Medium/Low areas]
- **Integration Points:** [Where different components connect]

## Next Steps
1. Run `dev_sprint_X.md` prompt to execute development
2. After development, run `qa_sprint_X.md` for QA testing
3. Finally, run `summary_sprint_X.md` to generate sprint documentation
```

══════════════════════════════════════════════════════════════
SECTION 5.2 — DEVELOPMENT SPRINT PROMPT (dev_sprint_X.md)
══════════════════════════════════════════════════════════════

For each sprint, generate prompts/sprint_X/dev_sprint_X.md:

```markdown
# Sprint [X] Development Execution: [Sprint Name]

## Environment: {{ENVIRONMENT}}

## Context — Read These Files First

**MANDATORY:** Read ALL these files before writing any code:

### Specs (Read ALL):
- specs/01_product_manager.md   — requirements, personas, user flows
- specs/02_backend_lead.md      — API design, service layer, error handling
- specs/03_frontend_lead.md     — components, state, routing, design tokens
- specs/04_db_architect.md      — database schema, migrations, queries
- specs/05_qa_lead.md           — test strategy, coverage targets
- specs/06_devops_lead.md       — infrastructure, CI/CD, Docker
- specs/10_ui_designer.md       — screens, wireframes, responsive design
- specs/backlog.md              — Sprint [X] tickets (your work items)

### Docs (Read ALL relevant):
- docs/architecture/overview.md     — system architecture
- docs/architecture/backend.md      — backend layer design
- docs/architecture/frontend.md     — frontend component architecture
- docs/architecture/database.md     — ERD, tables, relationships
- docs/architecture/security.md     — auth flow, security rules
- docs/flows/user-journeys.md       — user flow diagrams
- docs/flows/data-flow.md           — data movement patterns
- docs/environments/development.md  — local setup prerequisites
- docs/environments/docker.md       — Docker setup
- docs/environments/environment-variables.md — all env vars
- docs/api/reference.md             — endpoint contracts
- docs/api/curl-examples.md         — curl command examples
- docs/testing/strategy.md          — test pyramid, tooling
- docs/testing/unit-tests.md        — unit test patterns
- docs/testing/integration-tests.md — integration test patterns
- docs/ui-design-system/tokens.md   — design tokens
- docs/project/setup.md             — repo structure, config files
- docs/project/coding-standards.md  — naming conventions, patterns

---

## Your Mission

Execute Sprint [X]: [Sprint Name]

**Goal:** [Sprint goal from backlog.md]

---

## Tickets to Complete

[Full ticket table from backlog.md for this sprint]

---

## Execution Instructions

### For Each Ticket:

1. **Update Status:** Change ticket from 🔲 to 🔄 in specs/backlog.md
2. **Read Relevant Spec:** Find the specific section in the appropriate spec file
3. **Implement:** Write code following patterns in docs/
4. **Test:** Write tests per docs/testing/ patterns
5. **Verify:** Run `npm test`, `npm run lint`, `npm run typecheck`
6. **Commit:** `git commit -m "Complete X.Y: [ticket description]"`
7. **Update Status:** Change ticket from 🔄 to 🧪 in specs/backlog.md

### Ticket-by-Ticket Breakdown:

[For each ticket in this sprint, generate:]

#### Ticket X.Y: [Title]
**Owner:** [Role]  |  **Model:** [haiku/sonnet/opus]  |  **Points:** [N]

**Spec Reference:** specs/[XX]_[role].md, Section: [relevant section]

**Implementation Steps:**
1. [Specific step based on ticket type]
2. [Next step]
3. [...]

**Files to Create/Modify:**
- `src/[path]/[file].ts` — [purpose]
- `src/[path]/[file].test.ts` — [test file]

**Verification:**
```bash
npm test -- [specific test file]
npm run lint
```

**Dependencies:** [List or "None"]

---

## After All Tickets Complete

1. Run full verification:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```

2. Update all ticket statuses to 🧪 QA Review

3. Commit all changes:
   ```bash
   git add -A
   git commit -m "Complete Sprint [X]: [Sprint Name]"
   ```

4. Proceed to QA: Run prompts/sprint_X/qa_sprint_X.md
```

══════════════════════════════════════════════════════════════
SECTION 5.3 — QA SPRINT PROMPT (qa_sprint_X.md)
══════════════════════════════════════════════════════════════

CRITICAL: QA prompts must include ACTUAL runnable tests, not just static analysis.
Include curl commands, API tests with the server running, and real validation.

For each sprint, generate prompts/sprint_X/qa_sprint_X.md:

```markdown
# Sprint [X] QA Review: [Sprint Name]

## Environment: {{ENVIRONMENT}}

## Context — Read These Files First

**MANDATORY:** Read ALL these files to understand what should be tested:

- specs/* (all 10 specs + backlog.md)
- docs/testing/* (strategy, unit, integration, e2e, test-data)
- docs/api/reference.md — endpoint contracts to verify
- docs/api/curl-examples.md — curl commands to run
- docs/api/error-codes.md — error responses to verify
- docs/architecture/security.md — security requirements
- docs/ui-design-system/accessibility.md — a11y requirements
- docs/workflows/qa-review.md — QA process

---

## QA Mission

Review and test ALL tickets completed in Sprint [X].

**Sprint Goal:** [Sprint goal]
**Tickets to Review:** [Count]

---

## Pre-QA Setup

Before running tests, ensure the environment is ready:

```bash
# 1. Start the database
docker-compose up -d db

# 2. Run migrations
npm run db:migrate

# 3. Seed test data
npm run db:seed

# 4. Start the server (in background or separate terminal)
npm run dev &
# Wait for server to be ready
sleep 5

# 5. Verify server is running
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

---

## Automated Test Suite

Run the full automated test suite:

```bash
# Unit tests
npm run test:unit
# Expected: All tests pass, coverage > 70%

# Integration tests
npm run test:integration
# Expected: All tests pass

# E2E tests (if applicable)
npm run test:e2e
# Expected: All critical paths pass

# Full test with coverage
npm run test:coverage
# Expected: Coverage report shows > 70% overall
```

---

## API Testing with Curl (MANDATORY)

**IMPORTANT:** These tests MUST be run with the server running.
Do not skip this section — it validates real API behavior.

[For each API endpoint added/modified in this sprint, generate:]

### Test: [Endpoint Name]

**Endpoint:** [METHOD] [PATH]
**Spec Reference:** specs/02_backend_lead.md, Section: [section]

#### Happy Path Test
```bash
# [Description of what this tests]
curl -X [METHOD] http://localhost:3000/api/v1/[path] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "field1": "value1",
    "field2": "value2"
  }'

# Expected Response (HTTP [STATUS]):
# {
#   "id": "...",
#   "field1": "value1",
#   ...
# }
```

#### Validation Error Test
```bash
# Test missing required fields
curl -X [METHOD] http://localhost:3000/api/v1/[path] \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected Response (HTTP 400):
# {
#   "error": "Validation failed",
#   "details": [...]
# }
```

#### Authentication Test
```bash
# Test without auth token
curl -X [METHOD] http://localhost:3000/api/v1/[path] \
  -H "Content-Type: application/json"

# Expected Response (HTTP 401):
# {
#   "error": "Unauthorized"
# }
```

#### Edge Case Tests
```bash
# [Specific edge case for this endpoint]
curl -X [METHOD] http://localhost:3000/api/v1/[path] \
  -H "Content-Type: application/json" \
  -d '{ ... }'

# Expected: [Expected behavior]
```

---

## Frontend Testing (if applicable)

### Component Tests
```bash
# Run component tests
npm run test:components

# Expected: All component tests pass
```

### Visual Verification Checklist
- [ ] Page renders without errors
- [ ] All components display correctly
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Loading states display properly
- [ ] Error states handled gracefully
- [ ] Forms validate correctly
- [ ] Navigation works as expected

### Accessibility Tests
```bash
# Run accessibility audit
npm run test:a11y

# Or manually with axe-core in browser
```

- [ ] Color contrast meets WCAG AA
- [ ] All interactive elements focusable
- [ ] Screen reader compatible
- [ ] Keyboard navigation works

---

## Per-Ticket QA Review

[For each ticket in this sprint, generate:]

### Ticket X.Y: [Title]

#### Code Quality Checklist
- [ ] Follows coding standards (docs/project/coding-standards.md)
- [ ] No console.log/print in production code
- [ ] Error handling implemented
- [ ] No hardcoded values (uses constants/env)
- [ ] TypeScript types correct (no `any`)
- [ ] No obvious security issues

#### Testing Checklist
- [ ] Unit tests written and pass
- [ ] Integration tests (if API endpoint)
- [ ] Edge cases covered
- [ ] Test coverage adequate

#### Functionality Checklist
- [ ] Works as specified in spec
- [ ] Handles error states gracefully
- [ ] No regressions to existing features

#### Security Checklist (if applicable)
- [ ] Input validation present
- [ ] Auth/authz enforced
- [ ] No injection vulnerabilities
- [ ] Sensitive data protected

#### QA Result
- **Status:** [PASS/FAIL]
- **Issues Found:** [List or "None"]
- **Notes:** [Any observations]

---

## QA Summary

### Test Results
| Category | Passed | Failed | Coverage |
|----------|--------|--------|----------|
| Unit Tests | X/X | 0 | XX% |
| Integration Tests | X/X | 0 | XX% |
| API Curl Tests | X/X | 0 | N/A |
| E2E Tests | X/X | 0 | N/A |

### Issues Found
| Ticket | Issue | Severity | Action |
|--------|-------|----------|--------|
[List any issues or "No issues found"]

### Overall Verdict
- [ ] **PASS** — All tests pass, ready for release
- [ ] **FAIL** — Issues found, needs fixes

---

## Post-QA Actions

### If PASS:
1. Update all ticket statuses from 🧪 to ✅ in specs/backlog.md
2. Run summary_sprint_X.md to generate sprint documentation
3. Merge to main branch

### If FAIL:
1. Document issues in Bug Backlog section of specs/backlog.md
2. Keep tickets in 🧪 status
3. Fix issues and re-run QA

---

## Cleanup

```bash
# Stop the server
pkill -f "npm run dev" || true

# Stop Docker services
docker-compose down
```
```

══════════════════════════════════════════════════════════════
SECTION 5.4 — SPRINT SUMMARY PROMPT (summary_sprint_X.md)
══════════════════════════════════════════════════════════════

For each sprint, generate prompts/sprint_X/summary_sprint_X.md:

```markdown
# Sprint [X] Summary Generation: [Sprint Name]

## Context

Read these files to generate the sprint summary:
- specs/backlog.md — ticket statuses and details
- All commit messages from this sprint
- QA results from qa_sprint_X.md execution

---

## Generate Sprint Documentation

Create the following files in sprints/sprint_X/:

### 1. sprints/sprint_X/qa_result.md

```markdown
# Sprint [X] QA Results

**Sprint:** [X] - [Sprint Name]
**QA Date:** [Date]
**QA Status:** [PASS/FAIL]

## Test Summary

| Category | Passed | Failed | Skipped | Coverage |
|----------|--------|--------|---------|----------|
| Unit Tests | [X] | [X] | [X] | [XX]% |
| Integration Tests | [X] | [X] | [X] | [XX]% |
| E2E Tests | [X] | [X] | [X] | N/A |
| API Tests (curl) | [X] | [X] | [X] | N/A |

## Per-Ticket Results

| Ticket | Title | QA Status | Issues |
|--------|-------|-----------|--------|
[For each ticket in sprint]

## Issues Found

[List any issues discovered during QA]

## Security Review

- [ ] No vulnerabilities found
- [ ] Auth/authz working correctly
- [ ] Input validation in place
- [ ] No sensitive data exposed

## Performance Notes

[Any performance observations]

## Recommendations

[Any recommendations for future sprints]
```

### 2. sprints/sprint_X/release_notes.md

```markdown
# Release Notes: Sprint [X] - [Sprint Name]

**Version:** [X].0.0
**Release Date:** [Date]

## 🎉 What's New

### Features
[List new features implemented in this sprint]
- **[Feature Name]:** [Description]

### Improvements
[List improvements]
- [Improvement description]

### Bug Fixes
[List any bugs fixed]
- Fixed: [Bug description]

## 📊 Sprint Statistics

- **Tickets Completed:** [X]/[X]
- **Story Points Delivered:** [X]
- **Test Coverage:** [XX]%

## 🔧 Technical Changes

### Database
[List any schema changes]

### API
[List new or modified endpoints]

### Frontend
[List new pages/components]

## ⚠️ Known Issues

[List any known issues or limitations]

## 📋 Upgrade Notes

[Any notes for upgrading from previous version]

## 🙏 Contributors

[List contributors or agents that worked on this sprint]
```

### 3. sprints/sprint_X/summary.md

```markdown
# Sprint [X] Summary: [Sprint Name]

**Sprint Duration:** [Start Date] - [End Date]
**Status:** COMPLETE

## Sprint Goal

[Sprint goal from backlog.md]

**Goal Achieved:** [Yes/No/Partial]

## Completed Tickets

| # | Ticket | Owner | Model | Points | Status |
|---|--------|-------|-------|--------|--------|
[All tickets from this sprint with final status]

## Metrics

- **Velocity:** [X] story points
- **Completion Rate:** [X]%
- **QA Pass Rate:** [X]%
- **Bugs Found:** [X]
- **Bugs Fixed:** [X]

## What Went Well

1. [Positive observation]
2. [Positive observation]
3. [Positive observation]

## What Could Be Improved

1. [Improvement area]
2. [Improvement area]

## Blockers Encountered

[List any blockers and how they were resolved]

## Technical Debt Added

[List any shortcuts or debt introduced]

## Lessons Learned

1. [Lesson]
2. [Lesson]

## Next Sprint Preparation

- **Next Sprint:** [X+1] - [Name]
- **Dependencies Resolved:** [Yes/No]
- **Ready to Start:** [Yes/No]

## Files Changed

```
[List of files created/modified in this sprint]
```

## Commits

```
[List of commit messages from this sprint]
```

## Git Tag (CRITICAL FOR TRACEABILITY)

**Tag Name:** `sprint-[X]-complete`
**Tag Command:**
```bash
git tag -a sprint-[X]-complete -m "Sprint [X] Complete: [Sprint Name]"
git push origin sprint-[X]-complete
```

**Why This Matters:**
- Creates a permanent reference point in the repository
- Allows tracing all commits that built this sprint
- Enables rollback to sprint completion state
- Provides clear audit trail for project history

**To view commits in this sprint:**
```bash
# If this is Sprint 0:
git log sprint-0-complete

# If this is Sprint 1+:
git log sprint-[X-1]-complete..sprint-[X]-complete
```
```

---

## After Generating Summary

1. Create the sprints/sprint_X/ folder if it doesn't exist
2. Generate all four files with actual data (qa_result.md, release_notes.md, summary.md, dod_verified.md)
3. Commit the sprint documentation:
   ```bash
   git add sprints/sprint_X/
   git commit -m "Complete Sprint [X]: [Sprint Name]"
   ```
4. **CREATE GIT TAG** to mark this sprint's completion (CRITICAL for traceability):
   ```bash
   git tag -a sprint-[X]-complete -m "Sprint [X] Complete: [Sprint Name]

   Goal: [Sprint goal]
   Tickets completed: [count]
   Story points: [sum]
   QA Status: PASS

   See sprints/sprint_X/summary.md for details"
   ```
5. Push the tag to remote:
   ```bash
   git push origin sprint-[X]-complete
   ```
6. Update specs/backlog.md sprint status to COMPLETE
7. Record the git tag in summary.md under "## Git Tag" section

**IMPORTANT:** The git tag creates a permanent reference point in the repository history.
This allows future developers to:
- Easily find all commits that built this sprint
- Trace back what work was done
- Compare changes between sprints
- Roll back to a specific sprint's state if needed
```

══════════════════════════════════════════════════════════════
SECTION 5.5 — SPRINT DOD CHECKLIST (sprint_dod_checklist_X.md)
══════════════════════════════════════════════════════════════

For each sprint, generate prompts/sprint_X/sprint_dod_checklist_X.md:

```markdown
# Sprint [X] Definition of Done Checklist: [Sprint Name]

## Purpose

This checklist MUST be completed before marking the sprint as COMPLETE.
Run through each item and verify it passes. This creates the dod_verified.md file.

---

## Pre-Completion Verification

Execute these commands and verify they pass:

### Code Quality
```bash
# Lint check - must exit 0
npm run lint
echo "Lint: $([[ $? -eq 0 ]] && echo 'PASS ✅' || echo 'FAIL ❌')"

# Type check - must exit 0
npm run typecheck
echo "Typecheck: $([[ $? -eq 0 ]] && echo 'PASS ✅' || echo 'FAIL ❌')"

# Build - must exit 0
npm run build
echo "Build: $([[ $? -eq 0 ]] && echo 'PASS ✅' || echo 'FAIL ❌')"
```

### Tests
```bash
# Unit tests - must pass
npm run test:unit
echo "Unit Tests: $([[ $? -eq 0 ]] && echo 'PASS ✅' || echo 'FAIL ❌')"

# Integration tests - must pass
npm run test:integration
echo "Integration Tests: $([[ $? -eq 0 ]] && echo 'PASS ✅' || echo 'FAIL ❌')"

# Coverage check - must meet threshold
npm run test:coverage
echo "Coverage: $([[ $? -eq 0 ]] && echo 'PASS ✅' || echo 'FAIL ❌')"
```

### API Tests (with server running)
```bash
# Start server and run curl tests from qa_sprint_X.md
# Document results below
```

---

## Checklist Items

Mark each item as PASS or FAIL:

### Ticket Completion
| Ticket | Title | Tests Pass | Code Quality | Status |
|--------|-------|------------|--------------|--------|
[For each ticket in sprint - verify individually]

### Sprint-Level Verification
- [ ] All tickets show ✅ Done in backlog.md
- [ ] No tickets left in 🔄 or 🧪 status
- [ ] All dependencies resolved
- [ ] No merge conflicts

### Code Quality Verification
- [ ] `npm run lint` exits 0
- [ ] `npm run typecheck` exits 0
- [ ] `npm run build` exits 0
- [ ] No console.log statements in production code
- [ ] No hardcoded secrets or API keys
- [ ] All new code follows coding-standards.md

### Test Verification
- [ ] `npm test` exits 0
- [ ] Unit test coverage ≥ 70%
- [ ] Integration tests pass
- [ ] All API endpoints tested with curl
- [ ] No skipped tests without justification

### Documentation Verification
- [ ] All new code has appropriate comments
- [ ] API changes documented in docs/api/reference.md
- [ ] Database changes documented in docs/architecture/database.md
- [ ] Environment variables documented in docs/environments/environment-variables.md

### Security Verification
- [ ] No new security vulnerabilities introduced
- [ ] Input validation on all new endpoints
- [ ] Auth/authz enforced where required
- [ ] No SQL injection, XSS, or CSRF vulnerabilities

### Git Verification
- [ ] All changes committed
- [ ] Commit messages follow convention
- [ ] No untracked files that should be committed
- [ ] Branch is up to date with main

---

## Final Actions

After all items pass:

1. **Generate sprint documentation:**
   ```bash
   # Run summary_sprint_X.md prompt to create:
   # - sprints/sprint_X/qa_result.md
   # - sprints/sprint_X/release_notes.md
   # - sprints/sprint_X/summary.md
   # - sprints/sprint_X/dod_verified.md
   ```

2. **Create final commit:**
   ```bash
   git add .
   git commit -m "Complete Sprint [X]: [Sprint Name]

   - All tickets completed and verified
   - Tests passing with X% coverage
   - QA review passed
   - DoD checklist verified

   See sprints/sprint_X/ for full documentation"
   ```

3. **Create git tag (CRITICAL):**
   ```bash
   git tag -a sprint-[X]-complete -m "Sprint [X] Complete: [Sprint Name]"
   git push origin sprint-[X]-complete
   ```

4. **Verify tag creation:**
   ```bash
   git tag -l "sprint-*"
   # Should show: sprint-[X]-complete
   ```

---

## DoD Verification Result

**Overall Status:** [PASS/FAIL]
**Verified By:** [Agent/Human]
**Date:** [Date]
**Git Tag:** `sprint-[X]-complete`

**Notes:**
[Any observations or exceptions]
```

══════════════════════════════════════════════════════════════
SECTION 5.6 — SHARED PROMPTS
══════════════════════════════════════════════════════════════

### prompts/multi-agent.md

Two separate prompts (Agent A and Agent B) for parallel execution:

**Agent A (Backend) Prompt:**
```markdown
# Agent A: Backend Development - Sprint [X]

## Your Role
You are Agent A - Backend Lead. You handle:
- Database migrations and schemas
- API endpoints and services
- Backend tests

## Read These Files First
- specs/02_backend_lead.md
- specs/04_db_architect.md
- specs/05_qa_lead.md
- specs/backlog.md (your tickets: Owner = "Backend" or "DB")
- docs/architecture/backend.md
- docs/architecture/database.md
- docs/architecture/security.md
- docs/api/reference.md
- docs/api/authentication.md
- docs/api/error-codes.md
- docs/api/curl-examples.md
- docs/testing/unit-tests.md
- docs/testing/integration-tests.md
- docs/project/coding-standards.md

## Your Tickets
[Filter backlog for Backend/DB owner tickets]

## Rules
1. Update backlog status as you work (🔲 → 🔄 → 🧪)
2. Run tests after each ticket
3. Commit after each ticket
4. Do NOT touch frontend code (src/components, src/pages)
5. Notify when API endpoints are ready for Agent B

## Sync Points
[List dependencies where Agent B needs your output]
```

**Agent B (Frontend) Prompt:**
```markdown
# Agent B: Frontend Development - Sprint [X]

## Your Role
You are Agent B - Frontend Lead. You handle:
- React components and pages
- State management
- Frontend tests

## Read These Files First
- specs/03_frontend_lead.md
- specs/10_ui_designer.md
- specs/05_qa_lead.md
- specs/backlog.md (your tickets: Owner = "Frontend")
- docs/architecture/frontend.md
- docs/flows/user-journeys.md
- docs/ui-design-system/tokens.md
- docs/ui-design-system/components.md
- docs/ui-design-system/layouts.md
- docs/ui-design-system/accessibility.md
- docs/testing/unit-tests.md
- docs/testing/e2e-tests.md
- docs/project/coding-standards.md

## Your Tickets
[Filter backlog for Frontend owner tickets]

## Rules
1. Update backlog status as you work (🔲 → 🔄 → 🧪)
2. Run tests after each ticket
3. Commit after each ticket
4. Do NOT touch backend code (src/services, src/routes, migrations)
5. Check backlog before starting tickets that depend on Agent A

## Sync Points
[List dependencies on Agent A's outputs]
```

**Integration Phase Prompt:**
```markdown
# Integration Phase: Sprint [X]

After both agents complete their tickets:

1. Merge branches if using separate branches
2. Run full test suite: `npm test`
3. Start server and test API integration
4. Run E2E tests: `npm run test:e2e`
5. Fix any integration issues
6. Run QA review: prompts/sprint_X/qa_sprint_X.md
```

### prompts/finops.md

```markdown
# Model Selection Guide (FinOps)

## Model Distribution Target
- **Haiku (40%):** Simple, repetitive tasks
- **Sonnet (45%):** Standard complexity features
- **Opus (15%):** Complex architecture, security, novel algorithms

## Task-to-Model Mapping

### Use Haiku For:
- Database migrations (CREATE TABLE statements)
- Configuration files (tsconfig, eslint, docker)
- Simple CRUD endpoints (no business logic)
- Seed data generation
- Boilerplate code
- Documentation updates
- Simple component shells

### Use Sonnet For:
- Services with business logic
- React components with state
- API endpoints with validation
- Unit and integration tests
- Standard authentication flows
- Form handling
- State management

### Use Opus For:
- System architecture decisions
- Security-critical code (auth, encryption)
- Complex algorithms
- Performance optimization
- Novel problem solving
- Multi-step debugging
- Code review and refactoring

## Cost Estimation

| Model | Cost per 1K tokens | Typical Sprint Usage |
|-------|-------------------|---------------------|
| Haiku | $0.25 | 40% of tokens |
| Sonnet | $3.00 | 45% of tokens |
| Opus | $15.00 | 15% of tokens |

## Sprint Cost Forecast

For a 12-ticket sprint:
- 4 tickets × Haiku = ~$X
- 6 tickets × Sonnet = ~$Y
- 2 tickets × Opus = ~$Z
- **Total:** ~$[X+Y+Z]

**Savings vs all-Opus:** ~60%
**Savings vs all-Sonnet:** ~30%
```

══════════════════════════════════════════════════════════════
SECTION 6 — GENERATION PROMPTS (GEMINI DIAGRAMS + REMOTION VIDEO)
══════════════════════════════════════════════════════════════

Generate the following prompt files in prompts/.

### prompts/gemini-diagram-prompts.md

A ready-to-paste prompt for Google Gemini (or any image-capable AI) to generate
architecture and workflow diagrams. The prompt must instruct the AI to:

- Read ALL generated files to understand the full project
- Generate these diagrams:
  1. System Architecture Diagram — from docs/architecture/overview.md
     (client → API → services → DB → cache → queue → external)
  2. Database ERD — from specs/04_db_architect.md and docs/architecture/database.md
     (all tables, relationships, cardinality, key columns)
  3. Frontend Component Tree — from specs/03_frontend_lead.md and docs/architecture/frontend.md
     (App → layouts → pages → organisms → molecules → atoms)
  4. CI/CD Pipeline — from specs/06_devops_lead.md and docs/workflows/ci-cd-pipeline.md
     (stages with parallel branches, triggers, artifacts)
  5. Authentication Flow — from docs/architecture/security.md and docs/api/authentication.md
     (register → login → JWT → refresh → logout, with token storage)
  6. Cloud Infrastructure — from docs/architecture/cloud.md
     (VPC, subnets, services, load balancer, CDN, monitoring)
  7. User Journey Map — from specs/01_product_manager.md
     (persona → entry point → core actions → completion → edge cases)
  8. Sprint Workflow — from docs/workflows/sprint-execution.md
     (ticket pickup → implement → test → review → merge → deploy)

- Style: clean, professional, consistent colour palette, legible at 1x zoom
- Format: SVG or high-res PNG (300 DPI)
- Include a legend on each diagram

### prompts/remotion-video-prompt.md

A ready-to-paste prompt for generating a Remotion (React video framework)
project that creates an animated project overview video.

The prompt must instruct the AI to:

1. READ ALL GENERATED PROJECT FILES to understand every aspect:
   - All 10 specs in specs/ (01_product_manager.md through 10_ui_designer.md)
   - The complete backlog in specs/backlog.md (all sprints, tickets, story points)
   - All 37 docs across docs/architecture/, docs/workflows/, docs/environments/,
     docs/api/, docs/testing/, docs/ui-design-system/, docs/project/
   - The sprint prompts in sprint_prompts/

2. GENERATE A REMOTION PROJECT with these scenes (in order):

   Scene 1 — Title Card (3s):
     Project name, tagline from 01_product_manager.md, tech stack badges

   Scene 2 — Problem & Solution (8s):
     Problem statement from 01_product_manager.md
     Animated bullet points of key pain points → solution value props

   Scene 3 — Architecture Overview (10s):
     Animate the system architecture from docs/architecture/overview.md
     Components fly in: client → API → services → DB → cache
     Connection lines draw between components
     Tech stack labels appear on each component

   Scene 4 — Database Schema (8s):
     Animate ERD from specs/04_db_architect.md
     Tables slide in, relationships draw as lines
     Show key columns and data types per table

   Scene 5 — User Flows (10s):
     Animate 2-3 key user flows from specs/01_product_manager.md
     Show persona → screens → actions → outcomes
     Use screen mockup shapes from specs/10_ui_designer.md

   Scene 6 — API Overview (6s):
     Animate endpoint groups from docs/api/reference.md
     Show request → response flow with status codes
     Group by resource (auth, users, core features)

   Scene 7 — Frontend Architecture (8s):
     Component tree animation from docs/architecture/frontend.md
     App root → pages → layouts → components (cascade reveal)
     Show state management flow arrows

   Scene 8 — Sprint Roadmap (10s):
     Animate sprint timeline from specs/backlog.md
     Each sprint slides in as a card with:
       Sprint name, goal, ticket count, story points
     Progress bar fills for each sprint
     Total project: X sprints, Y tickets, Z story points

   Scene 9 — DevOps & Deployment (6s):
     CI/CD pipeline animation from docs/workflows/ci-cd-pipeline.md
     Pipeline stages flow: lint → test → build → deploy
     Docker + cloud infrastructure from docs/architecture/cloud.md

   Scene 10 — Security (5s):
     Auth flow animation from docs/architecture/security.md
     Show JWT token lifecycle, RBAC roles
     Security checklist items check off

   Scene 11 — Testing Strategy (5s):
     Test pyramid animation from docs/testing/strategy.md
     Unit (70%) → Integration (20%) → E2E (10%)
     Coverage targets and CI gates

   Scene 12 — Team & Roles (6s):
     Show all 10 AutoSpec roles animating in:
     Product Manager, Backend Lead, Frontend Lead, DB Architect,
     QA Lead, DevOps Lead, Marketing Lead, Finance Lead,
     Business Lead, UI Designer
     Each with an icon and one-line responsibility

   Scene 13 — Closing Card (4s):
     Project name, "Built with AutoSpec"
     Key stats: X specs, Y docs, Z sprint prompts
     GitHub URL / project URL

3. TECHNICAL REQUIREMENTS:
   - Remotion v4 + TypeScript
   - 1920x1080 (1080p), 30fps
   - Total duration: ~90 seconds
   - Use @remotion/transitions for scene transitions (slide, fade, wipe)
   - Use @remotion/paths for SVG path drawing animations
   - Use spring() for physics-based animations
   - Consistent colour palette matching the project's design tokens from
     docs/ui-design-system/tokens.md
   - Font: Inter (headings) + JetBrains Mono (code)
   - Background: dark gradient (#0f172a → #1e293b)
   - Export as MP4 (H.264) and WebM

══════════════════════════════════════════════════════════════
SECTION 7 — VIEWER / PROJECT MONITOR WEBSITE
══════════════════════════════════════════════════════════════

╔══════════════════════════════════════════════════════════════════╗
║  CRITICAL: The viewer is a FULL VISUAL WEBSITE — NOT a simple   ║
║  markdown file reader. Every page MUST include interactive       ║
║  charts, diagrams, animated components, and rich UI built with  ║
║  shadcn/ui + Recharts. Think of it as an executive PRESENTATION ║
║  of the entire project. If a page only renders raw markdown     ║
║  text without visualizations, it is WRONG and must be redone.   ║
╚══════════════════════════════════════════════════════════════════╝

Generate a complete, self-contained React application in viewer/ that
provides a visually impressive dashboard for ALL generated artefacts
(specs, docs, backlog, workflows, architecture, flows, sprints).

### 7.1 Tech Stack

  React 18 + TypeScript + Vite + Tailwind CSS v4 + React Router
  shadcn/ui — complete component library (REQUIRED — do NOT build custom
              UI primitives). Initialize:
                npx shadcn@latest init -d
                npx shadcn@latest add button card badge tabs dialog
                tooltip table dropdown-menu sheet separator select
                command popover scroll-area toggle-group avatar
  recharts — charts and data visualisation (REQUIRED for every data page):
              PieChart, BarChart, LineChart, AreaChart, RadarChart
  @xyflow/react (React Flow v12) — workflow graph visualisation
  framer-motion — panel transitions ONLY (NOT for mass edge animation)
  lucide-react — icons (used by shadcn/ui)
  react-markdown + remark-gfm — Markdown rendering
  react-syntax-highlighter — code block highlighting

### 7.2 Project Structure

viewer/
├── public/
│   └── icons/                       # Role and status icons
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css                    # Tailwind + global tokens + @keyframes
│   │
│   ├── data/                        # Static artefacts (import at build time)
│   │   ├── specs/                   # All 10 spec .md files
│   │   ├── docs/                    # All docs .md files (mirrored structure)
│   │   │   ├── architecture/        # 8 files including diagrams.md
│   │   │   ├── flows/               # 6 flow definition files (NEW)
│   │   │   ├── workflows/           # 8 files
│   │   │   ├── environments/        # 5 files
│   │   │   ├── api/                 # 5 files including curl-examples.md
│   │   │   ├── testing/             # 6 files including api-test-suite.md
│   │   │   ├── ui-design-system/    # 6 files including screens.md
│   │   │   └── project/             # 4 files including dependencies.md
│   │   ├── sprints/                 # Sprint result folders (NEW)
│   │   │   └── sprint_X/            # qa_result.md, release_notes.md, summary.md
│   │   ├── backlog.json             # Parsed backlog (sprints + tickets)
│   │   ├── workflows.json           # Graph definitions (nodes + edges)
│   │   ├── architecture.json        # Parsed architecture diagrams (NEW)
│   │   ├── flows.json               # Parsed flow definitions (NEW)
│   │   └── requirements.md          # Original SRS
│   │
│   ├── pages/
│   │   ├── DashboardPage.tsx        # "/" — with visual charts
│   │   ├── DesignSystemPage.tsx     # "/design-system" — FULL design system showcase
│   │   ├── SpecsPage.tsx            # "/specs" + "/specs/:slug"
│   │   ├── DocsPage.tsx             # "/docs" + "/docs/:section/:slug"
│   │   ├── BacklogPage.tsx          # "/backlog" — kanban + charts
│   │   ├── WorkflowsPage.tsx        # "/workflows" — animated flows
│   │   ├── FlowsPage.tsx            # "/flows" — user/system flows
│   │   ├── ArchitecturePage.tsx     # "/architecture" — interactive diagrams
│   │   ├── SprintsPage.tsx          # "/sprints" — sprint results
│   │   └── RequirementsPage.tsx     # "/requirements" — traceability matrix
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
│   │   │   ├── SpecCard.tsx         # Grid card for spec list
│   │   │   └── MermaidRenderer.tsx  # Mermaid diagram rendering (NEW)
│   │   │
│   │   ├── docs/
│   │   │   ├── DocViewer.tsx        # Markdown renderer for docs
│   │   │   ├── DocTree.tsx          # Nested folder tree navigation
│   │   │   ├── DocCard.tsx          # Card with visual preview
│   │   │   └── CodeBlock.tsx        # Syntax highlighted code (NEW)
│   │   │
│   │   ├── backlog/
│   │   │   ├── BacklogBoard.tsx     # Tab per sprint + table
│   │   │   ├── KanbanBoard.tsx      # Visual kanban view (NEW)
│   │   │   ├── BurndownChart.tsx    # Sprint burndown (NEW)
│   │   │   ├── SprintTab.tsx
│   │   │   ├── TicketRow.tsx
│   │   │   └── TicketCard.tsx       # Kanban card (NEW)
│   │   │
│   │   ├── workflows/
│   │   │   ├── WorkflowCanvas.tsx   # React Flow wrapper
│   │   │   ├── AnimatedEdge.tsx     # SVG stroke-dashoffset animation
│   │   │   ├── WorkflowNode.tsx     # Memoised node component
│   │   │   ├── AnimationController.tsx  # Play/Pause/Speed/Focus toolbar
│   │   │   ├── WorkflowLegend.tsx   # Collapsible legend overlay
│   │   │   ├── WorkflowSearch.tsx   # Search + filter bar
│   │   │   ├── WorkflowSelector.tsx # Dropdown to select flow (NEW)
│   │   │   └── PlayTour.tsx         # Auto-walk critical path
│   │   │
│   │   ├── flows/                   # NEW — Flow visualization components
│   │   │   ├── UserJourneyDiagram.tsx    # Swimlane user journey
│   │   │   ├── SequenceDiagram.tsx       # Request/response sequence
│   │   │   ├── DataFlowDiagram.tsx       # Data movement visualization
│   │   │   ├── StateMachine.tsx          # State transition diagram
│   │   │   └── FlowSelector.tsx          # Flow type selector
│   │   │
│   │   ├── architecture/            # NEW — Architecture visualization
│   │   │   ├── SystemDiagram.tsx         # Main architecture view
│   │   │   ├── ERDiagram.tsx             # Database ERD
│   │   │   ├── ComponentTree.tsx         # Frontend component hierarchy
│   │   │   ├── LayerDiagram.tsx          # Backend layer visualization
│   │   │   ├── SecurityFlowDiagram.tsx   # Auth/security flow
│   │   │   ├── CloudDiagram.tsx          # Infrastructure visualization
│   │   │   └── DiagramExport.tsx         # Export as PNG/SVG
│   │   │
│   │   ├── sprints/                 # Sprint results components
│   │   │   ├── SprintSummaryCard.tsx     # Sprint overview card
│   │   │   ├── SprintCompletionChart.tsx # Pie chart completion
│   │   │   ├── QAResultsViewer.tsx       # Test results with badges
│   │   │   ├── ReleaseNotesViewer.tsx    # Feature highlights
│   │   │   └── VelocityChart.tsx         # Velocity over sprints
│   │   │
│   │   ├── design-system/          # Design System showcase components
│   │   │   ├── ColorPalette.tsx         # Interactive colour swatch grid
│   │   │   ├── TypographyScale.tsx      # Font scale + weight showcase
│   │   │   ├── SpacingScale.tsx         # Visual spacing/sizing reference
│   │   │   ├── ComponentGallery.tsx     # Live rendered component examples
│   │   │   ├── ScreenInventory.tsx      # Screen wireframes / mockups gallery
│   │   │   ├── IconLibrary.tsx          # Icon grid with search
│   │   │   ├── ResponsivePreview.tsx    # Breakpoint visualizer
│   │   │   └── AccessibilityMatrix.tsx  # A11y compliance checklist
│   │   │
│   │   ├── dashboard/
│   │   │   ├── OverviewCards.tsx         # Stat cards with AnimatedCounter
│   │   │   ├── ProgressRing.tsx          # SVG animated circular progress
│   │   │   ├── SprintTimeline.tsx        # Recharts BarChart (stacked)
│   │   │   ├── ModelDistribution.tsx     # Recharts PieChart
│   │   │   ├── VelocityMini.tsx          # Recharts LineChart
│   │   │   ├── MiniArchitecture.tsx      # Clickable mini diagram → /arch
│   │   │   └── RecentTickets.tsx         # shadcn/ui Table with Badges
│   │   │
│   │   ├── charts/                  # Reusable Recharts wrappers
│   │   │   ├── PieChart.tsx              # Recharts PieChart wrapper
│   │   │   ├── BarChart.tsx              # Recharts BarChart wrapper
│   │   │   ├── LineChart.tsx             # Recharts LineChart wrapper
│   │   │   ├── AreaChart.tsx             # Recharts AreaChart wrapper
│   │   │   ├── ProgressBar.tsx           # Animated progress bar
│   │   │   └── AnimatedCounter.tsx       # Count-up number animation
│   │   │
│   │   └── ui/                      # shadcn/ui components (auto-generated)
│   │       # Generated by: npx shadcn@latest add button card badge tabs
│   │       # dialog tooltip table dropdown-menu sheet separator select
│   │       # command popover scroll-area toggle-group avatar
│   │       # Do NOT build custom UI primitives — use shadcn/ui
│   │
│   ├── hooks/
│   │   ├── useAnimationEngine.ts    # Central animation state
│   │   ├── useAnimationSettings.ts  # localStorage persistence
│   │   ├── useReducedMotion.ts      # prefers-reduced-motion
│   │   ├── useBacklogData.ts        # Parse and filter backlog (NEW)
│   │   └── useDiagramExport.ts      # Export diagrams (NEW)
│   │
│   └── lib/
│       ├── animation.ts             # Constants, easing, helpers
│       ├── graph.ts                 # BFS, critical path, subgraph
│       ├── theme.ts                 # Design tokens
│       ├── mermaid.ts               # Mermaid parsing helpers (NEW)
│       ├── markdown.ts              # Markdown parsing with diagrams (NEW)
│       └── export.ts                # PNG/SVG export utilities (NEW)
│
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json

### 7.3 Design System (shadcn/ui Dark Theme)

Use shadcn/ui "new-york" style. Configure dark theme as default.

Colours (CSS variables for shadcn/ui):
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

Recharts theme (use consistently across ALL charts):
  CHART_COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b',
                   '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6']

Typography: Inter (headings 600–700, body 400), JetBrains Mono (code)
Base: 16 px, scale: 1.25
Spacing: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px
Radii: sm 6, md 10, lg 16, full 9999

Component rules (MANDATORY):
  - ALL buttons → shadcn/ui <Button> (never custom)
  - ALL cards → shadcn/ui <Card> with CardHeader, CardContent, CardFooter
  - ALL badges → shadcn/ui <Badge> (variant: default, secondary, destructive, outline)
  - ALL tabs → shadcn/ui <Tabs> with TabsList, TabsTrigger, TabsContent
  - ALL tables → shadcn/ui <Table> with proper header/body/row/cell
  - ALL tooltips → shadcn/ui <Tooltip>
  - ALL dropdowns → shadcn/ui <Select> or <DropdownMenu>
  - ALL charts → Recharts with CHART_COLORS theme
  - NEVER build custom UI primitives — use shadcn/ui for everything

### 7.4 Pages

╔══════════════════════════════════════════════════════════════════╗
║  VISUAL MANDATE: Every page MUST include at least ONE of:       ║
║  - A Recharts chart (PieChart, BarChart, LineChart, AreaChart)  ║
║  - An interactive diagram (React Flow graph / SVG diagram)      ║
║  - A data-rich shadcn/ui Card grid with Badges + progress bars  ║
║  - An interactive shadcn/ui Table with filters and sorting      ║
║  Pages that are ONLY text/markdown rendering are NOT acceptable.║
║  The viewer must look like a premium SaaS dashboard product.    ║
╚══════════════════════════════════════════════════════════════════╝

Dashboard ("/"):
  THIS IS THE FIRST PAGE USERS SEE — it must be visually stunning.

  REQUIRED visual components (ALL must be present):
  - Project name as large heading + description + tech stack shadcn/ui Badges
  - **Recharts PieChart**: Sprint completion (done vs remaining tickets)
  - **SVG ProgressRing**: Animated circular progress (% overall completion)
  - **Recharts BarChart**: Tickets per sprint (stacked by status: done/progress/todo)
  - **Recharts LineChart**: Velocity trend line (points completed per sprint)
  - **Recharts PieChart**: Model distribution (haiku=green, sonnet=blue, opus=purple)
  - **AnimatedCounter** shadcn/ui Cards: Total Tickets, Done, In Progress,
    QA Review, Blocked — each with icon, count-up animation, and colour
  - **shadcn/ui Table**: Top 5 in-progress tickets with status Badges
  - Quick-links grid: 10 shadcn/ui Cards for specs (role icon + title)
  - Quick-links grid: doc folder Cards (folder icon + file count Badge)
  - **MiniArchitecture**: Clickable mini system diagram → links to /architecture
  - CTA Buttons: "View Workflows", "View Backlog" with ticket count Badges

Design System ("/design-system") — **VISUAL DESIGN SHOWCASE**:
  ╔══════════════════════════════════════════════════════════╗
  ║  THIS PAGE IS CRITICAL. It must prove to stakeholders   ║
  ║  that the project's visual identity, components,        ║
  ║  screens, and UX patterns are fully designed BEFORE     ║
  ║  development begins. It is an interactive visual        ║
  ║  catalogue — NOT rendered markdown text.                ║
  ╚══════════════════════════════════════════════════════════╝

  Data sources: specs/10_ui_designer.md + docs/ui-design-system/ + design-system.json

  shadcn/ui Tabs navigation across 7 sections:

  **Tab 1: Colour Palette** (ColorPalette.tsx)
    - Every project colour rendered as large interactive swatch Cards
    - Groups: Primary, Secondary, Success, Warning, Error, Info, Neutrals
    - Each swatch: hex code, CSS variable name, Tailwind class, copy-on-click
    - WCAG contrast ratio displayed per colour (against bg and text)
    - Dark/light mode side-by-side comparison
    - Semantic usage map: "primary → buttons, links; error → validation, alerts"

  **Tab 2: Typography** (TypographyScale.tsx)
    - Live rendered type scale: H1 → H2 → H3 → H4 → Body → Small → Caption
    - Each level: font family, weight, size (px + rem), line height
    - Rendered with actual project fonts (Inter / JetBrains Mono)
    - Body paragraph + code block examples for readability preview

  **Tab 3: Components** (ComponentGallery.tsx)
    - Live interactive gallery of ALL UI components the project uses:
      - Buttons: all variants × sizes, rendered live
      - Inputs: text, select, textarea with states (default, focus, error, disabled)
      - Cards: all variants with example content
      - Badges: status/role/model badges with all colour options
      - Modals/Dialogs: example with open button
      - Tables: sample data with sorting
      - Toasts: success, error, warning examples
      - Navigation: sidebar, breadcrumbs, tabs
      - Loading states: skeleton, spinner, progress bar
    - Component hierarchy diagram (Atoms → Molecules → Organisms)
    - Component status matrix: designed/built/planned with Badges

  **Tab 4: Screens** (ScreenInventory.tsx)
    - Grid of ALL application screens as visual Cards
    - Each Card: screen name, route, description, wireframe preview
    - Grouped: Public, Authenticated, Admin, Modal, Error screens
    - Click → expanded view with:
      - ASCII wireframe in styled <pre> (monospace)
      - Screen states: loading, empty, error, populated
      - User flows involving this screen
      - Components used on this screen
    - **Screen navigation map**: visual flow diagram showing screen connections
      (React Flow or simple graph: screen → screen transitions)
    - Screen state matrix: shadcn/ui Table with screens × states

  **Tab 5: Spacing & Layout** (SpacingScale.tsx)
    - Visual spacing scale: 4px → 64px shown as coloured bars with labels
    - Border radius scale: sm → full with rendered examples
    - Shadow scale: sm → xl with Card examples
    - Responsive grid system preview
    - Breakpoint visualizer: mobile / tablet / desktop layout examples

  **Tab 6: Icons & Assets** (IconLibrary.tsx)
    - Grid of all project icons (lucide-react) with search
    - Grouped by: navigation, actions, status, content
    - Click icon → copy import code
    - Size comparison: xs → xl side by side

  **Tab 7: Accessibility** (AccessibilityMatrix.tsx)
    - WCAG 2.1 AA checklist as interactive checkboxes
    - Contrast ratio checker between any two palette colours
    - Keyboard navigation map
    - ARIA label requirements per component
    - Reduced motion behaviour summary

  Design System MUST be the SECOND item in sidebar navigation (after Dashboard).
  Stakeholders review design before development starts.

Specs ("/specs"):
  - 10 shadcn/ui Card components in responsive grid (2 col md, 3 col lg)
  - Each Card: lucide-react role icon, title, description excerpt,
    Badge (word count), Badge (reading time), hover animation
  - **VISUAL: ProgressBar** per spec (sections covered vs total)
  - Must render ALL 10 specs with consistent styling
  - Detail ("/specs/:slug"): full Markdown rendered with:
    - Sticky TOC sidebar (auto-generated from ## headings, scrollspy active)
    - **VISUAL: Reading progress bar** at top (scroll-based)
    - **VISUAL: Mermaid diagram rendering** (if spec contains mermaid blocks)
    - **VISUAL: Code blocks** with react-syntax-highlighter + copy Button
    - Breadcrumb navigation with shadcn/ui components

Docs ("/docs"):
  - shadcn/ui Card grid showing each doc folder as a visual tile
  - Each Card: lucide-react folder icon, folder name, file count Badge,
    mini visual preview (not just text — show a small icon/illustration)
  - Cards for:
    📁 architecture/ — mini diagram icon
    📁 flows/ — mini flow arrow icon
    📁 workflows/ — mini process icon
    📁 environments/ — server icon
    📁 api/ — endpoint count Badge
    📁 testing/ — test pyramid icon
    📁 ui-design-system/ — colour swatch preview
    📁 project/ — folder tree icon
  - Nested tree navigation with expand/collapse (shadcn/ui Collapsible)
  - Detail ("/docs/:section/:slug"): full Markdown rendered with:
    - **VISUAL: Mermaid diagrams rendered** (flowcharts, sequence, ERD)
    - **VISUAL: Tables** using shadcn/ui Table with alternating rows
    - **VISUAL: Code blocks** with react-syntax-highlighter + copy Button
    - Breadcrumb: Docs > Architecture > Security

Flows ("/flows") — **REACT FLOW DIAGRAMS (NEVER TEXT)**:
  ╔══════════════════════════════════════════════════════════════════╗
  ║  CRITICAL: Every flow MUST render as a React Flow <ReactFlow>  ║
  ║  graph with nodes and edges. Read from flows.json which has    ║
  ║  pre-computed node positions. NEVER render flows as markdown   ║
  ║  text, bullet lists, ASCII art, or numbered steps.             ║
  ║                                                                ║
  ║  ANTI-PATTERN (WRONG):                                         ║
  ║    1. User visits app                                          ║
  ║    2. User clicks login → shows form                           ║
  ║    3. User submits credentials → API validates                 ║
  ║                                                                ║
  ║  CORRECT PATTERN:                                              ║
  ║    <ReactFlow nodes={flow.nodes} edges={flow.edges} />         ║
  ║    with styled custom nodes, animated edges, and interactivity ║
  ╚══════════════════════════════════════════════════════════════════╝

  Data source: flows.json (each flow has nodes[] with positions + edges[])

  shadcn/ui Tabs to switch between flow diagrams:

  **Each flow renders as a full React Flow canvas:**

  - **User Journey** (type: "swimlane")
    - React Flow graph with horizontal swim lanes (coloured background rows)
    - Lane headers on the left: "User", "Frontend", "API", "Database"
    - Custom nodes positioned within their lane's Y range
    - Animated edges showing request/response flow between lanes
    - Persona icon on the start node
    - Click node → Sheet with step details

  - **Authentication Flow** (type: "sequence")
    - React Flow graph with participant columns (Client, API, Auth, DB)
    - Column headers at top
    - Nodes arranged vertically in time order within columns
    - Animated edges as request arrows (→) and response arrows (←)
    - Edge labels: "POST /login", "200 OK + JWT", "SELECT user"
    - Token lifecycle shown as node colour transitions

  - **Core Features Flow** (type: "process")
    - React Flow graph of main feature workflows
    - Decision nodes (diamond shape) for branching
    - Clickable nodes link to relevant spec files
    - Colour-coded by feature area

  - **Data Flow** (type: "dataflow")
    - React Flow graph showing data movement between components
    - Node colour indicates data type (user data=blue, config=green, etc.)
    - Edge labels show data transformation descriptions
    - Animated edges showing direction of data flow

  - **Error Handling** (type: "decision-tree")
    - React Flow decision tree diagram
    - Decision nodes with Yes/No branches
    - Colour-coded by severity: warning=amber, error=red, fatal=dark red
    - Leaf nodes show recovery actions

  - **State Transitions** (type: "state-machine")
    - React Flow graph with state nodes (rounded rectangles)
    - Transition edges with event labels: "submit()", "approve()", "reject()"
    - Click state → highlight valid transitions (dim others)
    - Current/initial state highlighted with accent ring

  Each flow tab: Play/Pause for edge animations, Export PNG/SVG
  Custom node component per flow type (SwimLaneNode, SequenceNode, StateNode, etc.)
  All nodes use React.memo for performance

Backlog ("/backlog"):
  THIS IS THE MOST DATA-RICH PAGE — must be highly visual and interactive.

  Top section (always visible, above the fold):
  - **Recharts BarChart**: Tickets by status per sprint (stacked bars)
  - **Recharts PieChart**: Overall status distribution
  - **AnimatedCounter** shadcn/ui Cards: Total, Done, In Progress, Blocked
  - **ProgressBar**: Overall project completion with animated fill

  Main content (shadcn/ui Tabs):

  **Tab 1: Kanban Board** (default view, drag-disabled display only):
    - 5 columns: Todo | In Progress | QA Review | Done | Blocked
    - Each column: header with count Badge, point total
    - shadcn/ui Cards per ticket: title, owner Avatar/Badge, model Badge
      (haiku=green, sonnet=blue, opus=purple), points, dependency indicator
    - Column colour coding matching status

  **Tab 2: Sprint Table** (per-sprint view):
    - Sprint selector using shadcn/ui Tabs (Sprint 0, 1, 2, …)
    - Per-sprint: goal text, **animated ProgressBar**, points summary
    - shadcn/ui Table with sortable columns:
      - Status Badge (colour-coded):
        🔲 todo=slate, 🔄 in-progress=blue, 🧪 qa=purple,
        ✅ done=emerald, ⏸️ blocked=red
      - Owner Badge with role colour
      - Model Badge (haiku=green, sonnet=blue, opus=purple)
      - Points column
      - Dependency links (clickable)
    - **Recharts LineChart**: Sprint burndown (ideal vs actual line)

  - Filter bar: shadcn/ui Select for status, owner, model
  - Search: instant filter with debounced input
  - Bug Backlog tab with severity colour Badges
  - Click ticket → Sheet/DetailsPanel with full info + dependency graph

Workflows ("/workflows"):
  - Full-screen React Flow canvas (see Section 7.5 for animation details)
  - **VISUAL: Multiple workflow graphs** selectable via shadcn/ui Select:
    1. Feature Development Flow
    2. Sprint Execution Flow
    3. System Request Lifecycle
    4. CI/CD Pipeline (with parallel lanes)
    5. Authentication Flow
    6. Project-specific user flows
  - Top toolbar: AnimationController + search + workflow selector
  - **VISUAL: Animated edges** (CSS stroke-dasharray animation)
  - **VISUAL: Node highlighting** on hover with shadcn/ui Tooltip
  - Bottom-right: legend overlay (collapsible)
  - Export graph as PNG/SVG via shadcn/ui Button

Architecture ("/architecture") — **REACT FLOW DIAGRAMS (NEVER TEXT)**:
  ╔══════════════════════════════════════════════════════════════════╗
  ║  CRITICAL: Every architecture diagram MUST render as a React   ║
  ║  Flow <ReactFlow> graph with nodes and edges. Read from        ║
  ║  architecture.json which has pre-computed node positions.      ║
  ║  NEVER render architecture as markdown text, bullet lists,     ║
  ║  ASCII boxes, or <pre> blocks. Every tab must show a visual    ║
  ║  interactive graph that users can zoom, pan, and click.        ║
  ║                                                                ║
  ║  ANTI-PATTERN (WRONG):                                         ║
  ║    ## System Architecture                                      ║
  ║    - Client (React SPA)                                        ║
  ║      - API Gateway (Express)                                   ║
  ║        - Auth Service                                          ║
  ║        - User Service                                          ║
  ║                                                                ║
  ║  ALSO WRONG:                                                   ║
  ║    ┌──────────┐    ┌──────────┐    ┌──────────┐               ║
  ║    │  Client  │───▶│   API    │───▶│    DB    │               ║
  ║    └──────────┘    └──────────┘    └──────────┘               ║
  ║                                                                ║
  ║  CORRECT PATTERN:                                              ║
  ║    <ReactFlow nodes={diagram.nodes} edges={diagram.edges}      ║
  ║      nodeTypes={customNodeTypes} fitView />                    ║
  ╚══════════════════════════════════════════════════════════════════╝

  Data source: architecture.json (each diagram has nodes[] with positions + edges[])

  shadcn/ui Tabs navigation. Each tab renders a React Flow canvas:

  **Tab 1: System Architecture** (id: "system-architecture", default view)
    - React Flow graph with custom node components per type:
      - "frontend" nodes: blue background, Monitor icon
      - "backend" nodes: purple background, Server icon
      - "database" nodes: green background, Database icon
      - "cache" nodes: amber background, Zap icon
      - "queue" nodes: cyan background, List icon
      - "external" nodes: grey dashed border, Globe icon
    - Each node: rounded Card with icon + label + tech badge
    - Click node → shadcn/ui Sheet with metadata (tech stack, description,
      endpoints, responsibilities)
    - Animated edges showing data flow direction
    - Edge labels: "HTTP/REST", "WebSocket", "SQL", "Redis", "gRPC"
    - Zoom, pan, fitView enabled

  **Tab 2: Database ERD** (id: "database-erd")
    - React Flow graph with custom ERD node component:
      - Each node = one database table
      - Node renders as a Card with:
        - Header: table name (bold, coloured)
        - Body: list of columns with type badges
        - PK columns marked with key icon
        - FK columns marked with link icon
    - Edges = relationships with cardinality labels ("1:N", "N:M", "1:1")
    - Edge style: different colours per relationship type
    - Click table node → Sheet with full schema, indexes, constraints

  **Tab 3: Frontend Component Tree** (id: "frontend-tree")
    - React Flow graph with tree layout (top-down):
      - Root: App
      - Level 1: Layout components
      - Level 2: Page components
      - Level 3: Feature components
      - Level 4: UI primitives
    - Nodes as rounded Cards with component name
    - Edges as parent→child arrows
    - Click node → Sheet with props, state, children info
    - Collapsible subtrees (click group to expand/collapse)

  **Tab 4: Backend Layers** (id: "backend-layers")
    - React Flow graph showing layered architecture:
      - Horizontal layers (top to bottom): Routes → Middleware →
        Controllers → Services → Repositories → Database
      - Multiple nodes per layer (one per route/controller/service)
      - Animated request flow on play button (edge pulse top → bottom)
      - Response flow (edge pulse bottom → top) in different colour
    - Layer background colours for visual grouping

  **Tab 5: Security Flow** (id: "security-flow")
    - React Flow graph showing auth flow:
      - Login request → credential validation → token generation →
        token storage → subsequent request → token verification →
        permission check → resource access
    - Nodes colour-coded: auth=blue, token=green, permission=amber
    - Edge labels: "JWT", "bcrypt", "RBAC check"
    - Animated flow on play

  Each tab: "View Source" toggle (shows raw markdown), Export PNG/SVG
  All custom nodes wrapped in React.memo
  All diagrams must be zoomable, pannable, and responsive

Sprints ("/sprints") — **SPRINT RESULTS WITH CHARTS**:
  View completed sprint documentation from sprints/ folder.

  - Sprint list as shadcn/ui Cards with status Badges
  - Per-sprint view shows:
    - **Recharts PieChart**: Completion (done vs remaining tickets)
    - **shadcn/ui Card**: Sprint summary with key metric Badges
    - qa_result.md rendered with test result Badges (pass/fail/skip)
    - release_notes.md rendered with feature highlight Cards
    - summary.md rendered with retrospective insights
  - **Recharts LineChart**: Velocity comparison across all sprints

Requirements ("/requirements"):
  - Rendered SRS/PRD markdown with syntax highlighting
  - **VISUAL: Requirements Traceability Matrix**
    - shadcn/ui Table mapping: requirement → spec → ticket
    - Status Badges colour-coded by implementation status
  - Functional vs non-functional sections with shadcn/ui Badges
  - **Recharts/ProgressBar**: Coverage (% of requirements with tickets)

### 7.5 Workflow Animation Engine

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

### 7.6 Viewer Data Files

Generate these inside viewer/src/data/. The viewer must have access to
EVERY SINGLE generated .md file so it can render them all.

╔══════════════════════════════════════════════════════════════════╗
║  CRITICAL: The JSON data files are what enable visual rendering.║
║  Without properly structured JSON, the viewer can only show     ║
║  markdown text — which defeats the entire purpose.              ║
║  Every JSON file below MUST be generated with complete,         ║
║  realistic data. This is what powers the charts, diagrams,      ║
║  kanban boards, and interactive components.                     ║
╚══════════════════════════════════════════════════════════════════╝

viewer/src/data/
├── specs/
│   ├── 01_product_manager.md
│   ├── 02_backend_lead.md
│   ├── 03_frontend_lead.md
│   ├── 04_db_architect.md
│   ├── 05_qa_lead.md
│   ├── 06_devops_lead.md
│   ├── 07_marketing_lead.md
│   ├── 08_finance_lead.md
│   ├── 09_business_lead.md
│   └── 10_ui_designer.md
│
├── docs/
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── backend.md
│   │   ├── frontend.md
│   │   ├── database.md
│   │   ├── security.md
│   │   ├── cloud.md
│   │   ├── deep-dive.md
│   │   └── diagrams.md           # Mermaid/PlantUML definitions (NEW)
│   │
│   ├── flows/                    # NEW — Flow documentation
│   │   ├── user-journeys.md      # User journey descriptions
│   │   ├── authentication-flow.md # Auth flow steps
│   │   ├── core-features-flow.md  # Main feature flows
│   │   ├── data-flow.md          # Data movement descriptions
│   │   ├── error-handling-flow.md # Error flows
│   │   └── state-transitions.md   # State machine definitions
│   │
│   ├── workflows/
│   │   ├── development.md
│   │   ├── sprint-execution.md
│   │   ├── git-workflow.md
│   │   ├── ci-cd-pipeline.md
│   │   ├── bug-fix.md
│   │   ├── deployment.md
│   │   ├── multi-agent.md
│   │   └── qa-review.md
│   │
│   ├── environments/
│   │   ├── development.md
│   │   ├── docker.md
│   │   ├── staging.md
│   │   ├── production.md
│   │   └── environment-variables.md
│   │
│   ├── api/
│   │   ├── reference.md
│   │   ├── authentication.md
│   │   ├── error-codes.md
│   │   ├── rate-limiting.md
│   │   └── curl-examples.md      # Ready-to-run curl commands (NEW)
│   │
│   ├── testing/
│   │   ├── strategy.md
│   │   ├── unit-tests.md
│   │   ├── integration-tests.md
│   │   ├── e2e-tests.md
│   │   ├── test-data.md
│   │   └── api-test-suite.md     # Complete API test scenarios (NEW)
│   │
│   ├── ui-design-system/
│   │   ├── tokens.md
│   │   ├── components.md
│   │   ├── layouts.md
│   │   ├── accessibility.md
│   │   ├── icons-assets.md
│   │   └── screens.md            # Screen inventory (NEW)
│   │
│   └── project/
│       ├── setup.md
│       ├── coding-standards.md
│       ├── glossary.md
│       └── dependencies.md       # Package dependencies (NEW)
│
├── sprints/                      # NEW — Sprint execution results
│   ├── sprint_0/
│   │   ├── qa_result.md
│   │   ├── release_notes.md
│   │   └── summary.md
│   └── sprint_N/                 # (One folder per completed sprint)
│       ├── qa_result.md
│       ├── release_notes.md
│       └── summary.md
│
├── backlog.json                  # Parsed from specs/backlog.md into structured JSON:
│                                 #   {
│                                 #     project: { name, description, totalSprints, totalTickets, totalPoints },
│                                 #     sprints: [{
│                                 #       id, name, goal, status, totalPoints, completedPoints,
│                                 #       tickets: [{ id, title, description, points, status,
│                                 #                   owner, model, dependencies, notes }]
│                                 #     }],
│                                 #     bugs: [{ id, title, severity, status, sprint, notes }],
│                                 #     stats: { todo, inProgress, qaReview, done, blocked }
│                                 #   }
│
├── workflows.json                # Graph definitions for workflow visualization:
│                                 #   [{
│                                 #     id, name, description,
│                                 #     nodes: [{ id, label, type, position, metadata }],
│                                 #     edges: [{ id, source, target, label, animated, priority }]
│                                 #   }]
│
├── architecture.json             # Structured architecture data AS REACT FLOW GRAPHS:
│                                 #   {
│                                 #     "diagrams": [
│                                 #       {
│                                 #         "id": "system-architecture",
│                                 #         "name": "System Architecture",
│                                 #         "description": "High-level system components",
│                                 #         "nodes": [
│                                 #           {
│                                 #             "id": "client",
│                                 #             "label": "React SPA",
│                                 #             "type": "frontend",
│                                 #             "icon": "monitor",
│                                 #             "metadata": { "tech": "React 18", "desc": "..." },
│                                 #             "position": { "x": 400, "y": 0 }
│                                 #           },
│                                 #           {
│                                 #             "id": "api-gateway",
│                                 #             "label": "API Gateway",
│                                 #             "type": "backend",
│                                 #             "icon": "server",
│                                 #             "metadata": { "tech": "Express.js", "desc": "..." },
│                                 #             "position": { "x": 400, "y": 150 }
│                                 #           }
│                                 #           // ... more nodes for each component
│                                 #         ],
│                                 #         "edges": [
│                                 #           {
│                                 #             "id": "e-client-api",
│                                 #             "source": "client",
│                                 #             "target": "api-gateway",
│                                 #             "label": "HTTP/REST",
│                                 #             "animated": true
│                                 #           }
│                                 #           // ... more edges for each connection
│                                 #         ]
│                                 #       },
│                                 #       {
│                                 #         "id": "database-erd",
│                                 #         "name": "Database ERD",
│                                 #         "nodes": [
│                                 #           {
│                                 #             "id": "users-table",
│                                 #             "label": "users",
│                                 #             "type": "table",
│                                 #             "metadata": {
│                                 #               "columns": [
│                                 #                 { "name": "id", "type": "UUID", "pk": true },
│                                 #                 { "name": "email", "type": "VARCHAR(255)" },
│                                 #                 { "name": "name", "type": "VARCHAR(100)" }
│                                 #               ]
│                                 #             },
│                                 #             "position": { "x": 0, "y": 0 }
│                                 #           }
│                                 #         ],
│                                 #         "edges": [
│                                 #           {
│                                 #             "id": "e-users-orders",
│                                 #             "source": "users-table",
│                                 #             "target": "orders-table",
│                                 #             "label": "1:N",
│                                 #             "animated": false
│                                 #           }
│                                 #         ]
│                                 #       },
│                                 #       { "id": "backend-layers", ... },
│                                 #       { "id": "frontend-tree", ... },
│                                 #       { "id": "security-flow", ... }
│                                 #     ]
│                                 #   }
│                                 #
│                                 #   Node types: "frontend"|"backend"|"database"|"cache"|
│                                 #     "queue"|"external"|"table"|"service"|"middleware"
│                                 #   Every diagram MUST have nodes with positions + edges.
│                                 #   This is what React Flow renders — not text!
│
├── flows.json                    # Structured flow data AS REACT FLOW GRAPHS:
│                                 #   {
│                                 #     "flows": [
│                                 #       {
│                                 #         "id": "user-journey",
│                                 #         "name": "User Journey",
│                                 #         "type": "swimlane",
│                                 #         "description": "End-to-end user journey",
│                                 #         "lanes": ["User", "Frontend", "API", "Database"],
│                                 #         "nodes": [
│                                 #           {
│                                 #             "id": "visit-app",
│                                 #             "label": "Visit Application",
│                                 #             "lane": "User",
│                                 #             "type": "start",
│                                 #             "position": { "x": 0, "y": 50 }
│                                 #           },
│                                 #           {
│                                 #             "id": "render-page",
│                                 #             "label": "Render Landing Page",
│                                 #             "lane": "Frontend",
│                                 #             "type": "process",
│                                 #             "position": { "x": 250, "y": 50 }
│                                 #           }
│                                 #         ],
│                                 #         "edges": [
│                                 #           {
│                                 #             "id": "e-visit-render",
│                                 #             "source": "visit-app",
│                                 #             "target": "render-page",
│                                 #             "label": "HTTP GET /",
│                                 #             "animated": true
│                                 #           }
│                                 #         ]
│                                 #       },
│                                 #       {
│                                 #         "id": "auth-flow",
│                                 #         "name": "Authentication Flow",
│                                 #         "type": "sequence",
│                                 #         "participants": ["Client", "API", "Auth Service", "DB"],
│                                 #         "nodes": [...],
│                                 #         "edges": [...]
│                                 #       },
│                                 #       {
│                                 #         "id": "data-flow",
│                                 #         "name": "Data Flow",
│                                 #         "type": "dataflow",
│                                 #         "nodes": [...],
│                                 #         "edges": [...]
│                                 #       },
│                                 #       {
│                                 #         "id": "state-machine-order",
│                                 #         "name": "Order State Machine",
│                                 #         "type": "state-machine",
│                                 #         "nodes": [
│                                 #           { "id": "draft", "label": "Draft", "type": "state",
│                                 #             "position": { "x": 0, "y": 100 } },
│                                 #           { "id": "submitted", "label": "Submitted", "type": "state",
│                                 #             "position": { "x": 250, "y": 100 } }
│                                 #         ],
│                                 #         "edges": [
│                                 #           { "id": "e-draft-submit", "source": "draft",
│                                 #             "target": "submitted", "label": "submit()",
│                                 #             "animated": true }
│                                 #         ]
│                                 #       },
│                                 #       { "id": "error-flow", ... },
│                                 #       { "id": "core-features", ... }
│                                 #     ]
│                                 #   }
│                                 #
│                                 #   Flow types: "swimlane"|"sequence"|"dataflow"|
│                                 #     "state-machine"|"decision-tree"|"process"
│                                 #   Every flow MUST have nodes with positions + edges.
│                                 #   This is what React Flow renders — not text!
│
├── metrics.json                  # Project metrics for dashboard:
│                                 #   {
│                                 #     velocity: [{ sprint, points }],
│                                 #     modelDistribution: { haiku: N, sonnet: N, opus: N },
│                                 #     coverage: { unit: N, integration: N, e2e: N },
│                                 #     burndown: [{ date, remaining }]
│                                 #   }
│
├── design-system.json            # Structured design system data for visual rendering:
│                                 #   {
│                                 #     colors: {
│                                 #       primary, secondary, success, warning, error, info,
│                                 #       neutrals: [{ name, hex, usage }],
│                                 #       semantic: [{ usage, colorRef }]
│                                 #     },
│                                 #     typography: {
│                                 #       scale: [{ level, family, size, weight, lineHeight }]
│                                 #     },
│                                 #     spacing: [{ name, px, rem }],
│                                 #     radii: [{ name, px }],
│                                 #     shadows: [{ name, value }],
│                                 #     components: [{ name, category, variants, status }],
│                                 #     screens: [{
│                                 #       name, route, category, description, wireframe,
│                                 #       states: ['loading','empty','error','populated'],
│                                 #       componentsUsed: [...]
│                                 #     }],
│                                 #     screenFlow: { nodes: [...], edges: [...] },
│                                 #     breakpoints: [{ name, minWidth, columns, behavior }],
│                                 #     icons: [{ name, category, usage }],
│                                 #     accessibility: { wcagLevel, checklist: [{ item, status }] }
│                                 #   }
│
└── requirements.md               # Original SRS/PRD input documents

Import strategy:
- Use Vite's ?raw import for .md files so they are embedded at build time
- For .json files, use standard import
- Generate architecture.json, flows.json, and design-system.json by parsing markdown
- design-system.json is parsed from specs/10_ui_designer.md + docs/ui-design-system/
- These JSON files enable the visual diagram rendering (not just text)

JSON Generation Rules:
- Parse Mermaid blocks from markdown and convert to React Flow node/edge format
- Extract tables and convert to structured data with positions
- Parse ASCII diagrams and infer component relationships as nodes + edges
- ALL diagram JSON files (architecture.json, flows.json, workflows.json) MUST
  use React Flow-compatible format: nodes[] with { id, label, type, position }
  and edges[] with { id, source, target, label, animated }
- Every node MUST have a position: { x, y } — this is what React Flow needs
  to render the graph. Without positions, React Flow cannot display nodes.
- All JSON must be valid and complete — no placeholders

╔══════════════════════════════════════════════════════════════════╗
║  DIAGRAM RENDERING RULES — READ THIS CAREFULLY                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  The Architecture, Flows, and Workflows pages MUST render        ║
║  diagrams using <ReactFlow> components reading from JSON data.   ║
║                                                                  ║
║  NEVER DO ANY OF THESE (these are ALL wrong):                    ║
║  ✗ Render markdown text and call it a "diagram"                  ║
║  ✗ Render ASCII art boxes (┌──────┐) in <pre> tags              ║
║  ✗ Render numbered step lists ("1. User logs in, 2. API…")      ║
║  ✗ Render bullet-point hierarchies as the diagram                ║
║  ✗ Render Mermaid source code as text instead of a graph         ║
║  ✗ Show a markdown file with "```mermaid" blocks unrendered     ║
║  ✗ Use only <div> boxes with CSS borders to fake a diagram       ║
║                                                                  ║
║  ALWAYS DO THIS (the only correct approach):                     ║
║  ✓ Use <ReactFlow nodes={data.nodes} edges={data.edges} />      ║
║  ✓ Define custom nodeTypes for each diagram type                 ║
║  ✓ Every node has position: { x, y } from the JSON              ║
║  ✓ Edges connect nodes with animated or styled lines             ║
║  ✓ Users can zoom, pan, and click on nodes                       ║
║  ✓ Click node → opens Sheet/panel with metadata details          ║
║  ✓ Diagrams have fitView for auto-zoom on load                   ║
║                                                                  ║
║  Architecture → architecture.json → React Flow per tab           ║
║  Flows → flows.json → React Flow per tab                         ║
║  Workflows → workflows.json → React Flow per tab                 ║
║                                                                  ║
║  If a diagram renders as text, it is WRONG. Fix it.              ║
╚══════════════════════════════════════════════════════════════════╝

══════════════════════════════════════════════════════════════
SECTION 8 — QUALITY GATES
══════════════════════════════════════════════════════════════

Every generated file must:

  ✓ Be SPECIFIC to this project — no "[insert here]" placeholders.
  ✓ Cross-reference other files by name (e.g., "See specs/02_backend_lead.md").
  ✓ Use consistent naming across all files.
  ✓ Contain concrete examples (real endpoint paths, real table names).

Specs: 300–800 lines each.
Docs: 100–300 lines each.
Viewer: must build with zero TypeScript errors (strict mode).

VIEWER-SPECIFIC QUALITY GATES (all must pass):

  ✓ shadcn/ui is used for ALL UI primitives (Button, Card, Badge, Tabs,
    Table, Select, Dialog, Sheet, Tooltip, etc.) — NO custom implementations
  ✓ Recharts is used for ALL charts with consistent CHART_COLORS theme
  ✓ Dashboard page has at LEAST 3 different Recharts charts visible
  ✓ Dashboard page has animated stat counter Cards
  ✓ Dashboard page has a clickable mini architecture diagram
  ✓ Design System page EXISTS with 7 tabs (colours, typography, components,
    screens, spacing, icons, accessibility)
  ✓ Design System page renders live colour swatches (not just hex text)
  ✓ Design System page renders live interactive component examples
  ✓ Design System page shows screen inventory with wireframe previews
  ✓ Design System is the SECOND item in sidebar (after Dashboard)
  ✓ Specs page shows a visual Card grid (not a text list)
  ✓ Docs page shows folder Cards with file count Badges
  ✓ Backlog page has BOTH kanban board view AND table view
  ✓ Backlog page has at least 2 charts (status distribution, burndown)
  ✓ Workflows page renders <ReactFlow> graphs with animated edges
  ✓ Architecture page renders <ReactFlow> graphs from architecture.json
    (NOT markdown text, NOT ASCII boxes, NOT bullet lists — React Flow only)
  ✓ Flows page renders <ReactFlow> graphs from flows.json
    (NOT markdown text, NOT numbered steps, NOT bullet lists — React Flow only)
  ✓ Every page has at least one interactive/visual element beyond text
  ✓ Dark theme is the default with proper contrast ratios
  ✓ Sidebar navigation links to all 10 pages and works correctly
  ✓ The app looks like a premium SaaS dashboard, NOT a markdown reader

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
| `docs/architecture/` | System design, cloud, security, deep-dive, diagrams | 8 |
| `docs/flows/` | User journeys, auth flow, data flow, state transitions | 6 |
| `docs/workflows/` | Dev, sprint, git, CI/CD, deploy, bug, multi-agent, QA | 8 |
| `docs/environments/` | Dev, Docker, staging, prod, env vars | 5 |
| `docs/api/` | Reference, auth, errors, rate limits, curl examples | 5 |
| `docs/testing/` | Strategy, unit, integration, e2e, test data, API suite | 6 |
| `docs/ui-design-system/` | Tokens, components, layouts, a11y, assets, screens | 6 |
| `docs/project/` | Setup, coding standards, glossary, dependencies | 4 |
| `prompts/sprint_X/` | Per-sprint: plan, dev, qa, summary prompts | 4 per sprint |
| `prompts/` | Multi-agent, finops, Gemini diagrams, Remotion video | 4 |
| `sprints/sprint_X/` | Per-sprint results: qa_result, release_notes, summary | 3 per sprint |
| `viewer/` | React monitor app with visual dashboards | Full project |

**Total: 10 specs + ~50 docs + prompts for ALL sprints + viewer**

**Next steps:**

1. **Review specs** — Skim for accuracy, correct any assumptions.
2. **Open the viewer** — set up and run the visual dashboard:
   ```
   cd viewer
   npm install
   npx shadcn@latest init -d
   npx shadcn@latest add button card badge tabs dialog tooltip table dropdown-menu sheet separator select command popover scroll-area toggle-group avatar
   npm run dev
   ```
   This gives you an interactive dashboard with charts, diagrams, kanban boards, and more.
3. **Review sprint plan** — Read `prompts/sprint_0/sprint_plan_0.md` for Definition of Done.
4. **Execute Sprint 0** — Paste `prompts/sprint_0/dev_sprint_0.md` into your AI.
5. **Run QA** — Paste `prompts/sprint_0/qa_sprint_0.md` to test with curl commands.
6. **Generate summary** — Paste `prompts/sprint_0/summary_sprint_0.md` to create sprint docs.
7. **Repeat for all sprints** — Each sprint has its own folder with 4 prompts.

---

## Quick Reference — Sprint Execution

```
# Sprint 0 (Foundation)
1. Review: prompts/sprint_0/sprint_plan_0.md
2. Execute: prompts/sprint_0/dev_sprint_0.md
3. Test: prompts/sprint_0/qa_sprint_0.md (includes curl API tests!)
4. Document: prompts/sprint_0/summary_sprint_0.md
   → Creates sprints/sprint_0/ with qa_result.md, release_notes.md, summary.md

# Sprint N (Features) — prompts exist for ALL sprints in backlog!
1. Review: prompts/sprint_N/sprint_plan_N.md
2. Execute: prompts/sprint_N/dev_sprint_N.md
3. Test: prompts/sprint_N/qa_sprint_N.md
4. Document: prompts/sprint_N/summary_sprint_N.md

# Parallel execution (Multi-Agent)
Paste prompts/multi-agent.md — run two AI sessions (Backend + Frontend).

# Cost optimisation
Read prompts/finops.md before each sprint for model selection.
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
