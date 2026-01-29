# AutoSpec — Master Generation Prompt

**The single prompt that generates everything.** Paste this into your AI assistant alongside your SRS / requirements documents. No CLI needed.

---

## How To Use

1. Place your SRS, PRD, or requirements documents in a folder.
2. **Specify your development environment** (see Environment Options below).
3. Copy the **Generation Prompt** below into your AI assistant.
4. Replace `{{INPUT_FOLDER}}` with the path to your documents folder.
5. Replace `{{ENVIRONMENT}}` with your chosen environment.
6. The AI generates the complete output structure in one pass.

---

## Environment Options

Choose the environment that matches your AI-assisted development setup:

| Environment | Description | Recommended Model | Prompt Style |
|-------------|-------------|-------------------|--------------|
| `claude-code` | Claude Code CLI (terminal-based) | Claude Sonnet/Opus | Conversational, file-focused |
| `vscode-copilot` | VS Code with GitHub Copilot | GPT-4/Copilot | IDE-integrated, inline suggestions |
| `cursor` | Cursor IDE with AI | Claude/GPT-4 | Composer-style, multi-file edits |
| `windsurf` | Windsurf/Codeium IDE | Various | Flow-based, context-aware |
| `jetbrains-ai` | JetBrains IDEs with AI Assistant | Various | IDE-native, refactoring-focused |
| `aider` | Aider CLI tool | Claude/GPT-4 | Git-integrated, diff-based |

**Environment affects:**
- Sprint prompt formatting (how instructions are structured)
- Model recommendations in backlog (optimized for your environment's strengths)
- Multi-agent coordination patterns (parallel sessions vs split windows)
- QA testing commands (environment-specific execution)

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
│   │   └── summary_sprint_0.md         # Sprint summary generation prompt
│   │
│   ├── sprint_1/                       # Feature sprint 1 folder
│   │   ├── sprint_plan_1.md            # Sprint 1 planning guide
│   │   ├── dev_sprint_1.md             # Development execution prompt
│   │   ├── qa_sprint_1.md              # QA testing prompt
│   │   └── summary_sprint_1.md         # Sprint summary generation prompt
│   │
│   ├── sprint_N/                       # (Repeat for ALL sprints in backlog.md)
│   │   ├── sprint_plan_N.md
│   │   ├── dev_sprint_N.md
│   │   ├── qa_sprint_N.md
│   │   └── summary_sprint_N.md
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
│   │   └── summary.md                  # Sprint retrospective
│   │
│   └── sprint_N/                       # (Generated after each sprint completes)
│       ├── qa_result.md
│       ├── release_notes.md
│       └── summary.md
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
```

---

## After Generating Summary

1. Create the sprints/sprint_X/ folder if it doesn't exist
2. Generate all three files with actual data
3. Commit the sprint documentation:
   ```bash
   git add sprints/sprint_X/
   git commit -m "Add Sprint [X] documentation"
   ```
4. Update specs/backlog.md sprint status to COMPLETE
```

══════════════════════════════════════════════════════════════
SECTION 5.5 — SHARED PROMPTS
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

Generate a complete, self-contained React application in viewer/ that
provides a visual dashboard for ALL generated artefacts (specs, docs,
backlog, workflows).

### 7.1 Tech Stack

  React 18 + TypeScript + Vite + Tailwind CSS + React Router
  @xyflow/react (React Flow v12) — workflow graph visualisation
  framer-motion — panel transitions ONLY (NOT for mass edge animation)
  lucide-react — icons
  react-markdown + remark-gfm — Markdown rendering

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
│   │   ├── SpecsPage.tsx            # "/specs" + "/specs/:slug"
│   │   ├── DocsPage.tsx             # "/docs" + "/docs/:section/:slug"
│   │   ├── BacklogPage.tsx          # "/backlog" — kanban + charts
│   │   ├── WorkflowsPage.tsx        # "/workflows" — animated flows
│   │   ├── FlowsPage.tsx            # "/flows" — user/system flows (NEW)
│   │   ├── ArchitecturePage.tsx     # "/architecture" — interactive diagrams
│   │   ├── SprintsPage.tsx          # "/sprints" — sprint results (NEW)
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
│   │   ├── sprints/                 # NEW — Sprint results components
│   │   │   ├── SprintSummaryCard.tsx     # Sprint overview card
│   │   │   ├── SprintCompletionChart.tsx # Pie chart completion
│   │   │   ├── QAResultsViewer.tsx       # Test results with badges
│   │   │   ├── ReleaseNotesViewer.tsx    # Feature highlights
│   │   │   └── VelocityChart.tsx         # Velocity over sprints
│   │   │
│   │   ├── dashboard/
│   │   │   ├── OverviewCards.tsx         # Stat cards with animations
│   │   │   ├── ProgressRing.tsx          # SVG animated ring
│   │   │   ├── SprintTimeline.tsx        # Timeline chart (NEW)
│   │   │   ├── ModelDistribution.tsx     # Pie chart (NEW)
│   │   │   ├── VelocityMini.tsx          # Mini velocity chart (NEW)
│   │   │   ├── MiniArchitecture.tsx      # Clickable mini diagram (NEW)
│   │   │   └── RecentTickets.tsx
│   │   │
│   │   ├── charts/                  # NEW — Reusable chart components
│   │   │   ├── PieChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   ├── LineChart.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   └── AnimatedCounter.tsx
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       ├── Card.tsx
│   │       ├── Toggle.tsx
│   │       ├── Tooltip.tsx
│   │       ├── Tabs.tsx             # Tab navigation (NEW)
│   │       ├── Dropdown.tsx         # Selector dropdown (NEW)
│   │       └── ExportButton.tsx     # Export functionality (NEW)
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

### 7.3 Design System (Dark Theme)

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

### 7.4 Pages

**CRITICAL: The viewer must VISUALIZE data, not just render markdown. Each page
should include interactive diagrams, charts, and animations where applicable.**

Dashboard ("/"):
  - Project name, description, tech stack badges with icons
  - **VISUAL: Animated sprint progress ring** (SVG ring that fills based on completion %)
  - **VISUAL: Sprint timeline chart** showing all sprints with status colours
  - Stat cards with animated counters: total tickets, done, in-progress, blocked
  - **VISUAL: Velocity chart** (if multiple sprints completed)
  - **VISUAL: Model distribution pie chart** (haiku/sonnet/opus usage)
  - Top 5 in-progress tickets with progress indicators
  - Quick-links grid to ALL 10 specs with role icons
  - Quick-links grid to ALL doc folders with folder icons
  - **VISUAL: Mini architecture diagram** (clickable, links to /architecture)
  - "View Workflows" and "View Backlog" CTAs with ticket counts

Specs ("/specs"):
  - 10 spec cards in responsive grid (2 col md, 3 col lg)
  - Card: animated role icon, title, excerpt, word count badge, reading time
  - **VISUAL: Spec completion indicator** (sections covered vs total)
  - Must render ALL 10 specs with consistent styling
  - Detail ("/specs/:slug"): full Markdown with:
    - Sticky TOC auto-generated from ## headings
    - **VISUAL: Mermaid diagram rendering** (if spec contains ```mermaid blocks)
    - **VISUAL: ASCII diagrams in styled <pre>** with syntax highlighting
    - **VISUAL: JSON/code blocks** with copy button and syntax highlighting
    - Reading progress bar at top
  - "Back to all specs" breadcrumb

Docs ("/docs"):
  - Nested tree navigation with expand/collapse animations
  - Top-level cards per folder with file count badge and preview icons:
    📁 architecture/ (8 files)  — WITH mini diagram preview
    📁 flows/ (6 files)         — WITH animated flow preview (NEW)
    📁 workflows/ (8 files)     — WITH process preview
    📁 environments/ (5 files)  — WITH env comparison table preview
    📁 api/ (5 files)           — WITH endpoint count badge
    📁 testing/ (6 files)       — WITH test pyramid preview
    📁 ui-design-system/ (6 files) — WITH colour swatch preview
    📁 project/ (4 files)       — WITH structure preview
  - **VISUAL: Each doc card shows a mini visual preview** (not just text)
  - Detail ("/docs/:section/:slug"): full Markdown with:
    - **VISUAL: Mermaid diagrams rendered** (flowcharts, sequence diagrams, ERD)
    - **VISUAL: Tables styled** with alternating rows and sorting
    - **VISUAL: Code blocks** with syntax highlighting and copy
    - Breadcrumb: Docs > Architecture > Security

Flows ("/flows") — **NEW VISUAL PAGE**:
  **This page visualizes ALL user and system flows as interactive diagrams.**

  - **VISUAL: User Journey Visualizer**
    - Parse docs/flows/user-journeys.md
    - Render as horizontal swimlane diagram
    - Each step is a clickable node
    - Animate user movement through journey on hover/play
    - Show persona icon at start

  - **VISUAL: Authentication Flow Diagram**
    - Parse docs/flows/authentication-flow.md
    - Render as animated sequence diagram
    - Show request/response arrows between Client, API, DB
    - Token lifecycle visualization
    - Animate on play button

  - **VISUAL: Core Features Flow**
    - Parse docs/flows/core-features-flow.md
    - Render as multi-lane process flow diagram
    - Show main feature workflows extracted from SRS
    - Clickable nodes link to relevant specs

  - **VISUAL: Data Flow Diagram**
    - Parse docs/flows/data-flow.md
    - Render as React Flow graph
    - Show data moving between components
    - Colour-coded by data type

  - **VISUAL: Error Handling Flow**
    - Parse docs/flows/error-handling-flow.md
    - Render as decision tree diagram
    - Show error types, propagation paths, recovery actions
    - Colour-coded by severity (warning=yellow, error=red, fatal=dark red)

  - **VISUAL: State Transition Diagrams**
    - Parse docs/flows/state-transitions.md
    - Render as state machine diagrams
    - Highlight current state on click
    - Show valid transitions as animated edges

  Flow selector dropdown to switch between flows
  Play/Pause controls for animations
  Export as PNG/SVG button

Backlog ("/backlog"):
  THIS IS THE MOST CRITICAL DATA PAGE — fully interactive board with visuals.

  - **VISUAL: Kanban Board View** (drag-disabled, display only)
    - Columns: Todo | In Progress | QA Review | Done | Blocked
    - Cards show ticket summary, owner badge, model badge
    - Column headers show count and total points

  - **VISUAL: Sprint Burndown Chart** (per sprint tab)
    - X-axis: time/tickets, Y-axis: remaining points
    - Ideal line vs actual progress

  - **VISUAL: Sprint Progress Bar** (animated fill)

  - Tab per sprint (Sprint 0, 1, 2, …) with visual indicators
  - Per-sprint header: goal, points, animated progress bar
  - Table view with:
    - Status badges colour-coded with icons:
      🔲 todo = slate, 🔄 in-progress = blue pulse, 🧪 qa = purple, ✅ done = emerald, ⏸️ blocked = red
    - Owner badges with role icons
    - Model badges (haiku=green, sonnet=blue, opus=purple)
    - Dependency links (clickable to jump to ticket)
  - Filters: status, owner, model (with badge previews)
  - Search: instant filter with highlight
  - Overall stats: animated counters
  - Bug Backlog tab with severity colour badges
  - Click ticket → DetailsPanel with full info + dependency graph

Workflows ("/workflows"):
  - Full-screen React Flow canvas (see Section 7.5)
  - **VISUAL: Multiple workflow graphs** selectable via dropdown:
    1. Feature Development Flow
    2. Sprint Execution Flow
    3. System Request Lifecycle
    4. CI/CD Pipeline (with parallel lanes)
    5. Authentication Flow
    6. Project-specific user flows
  - Top toolbar: animation controls + search + workflow selector
  - **VISUAL: Animated edges** showing data/process flow
  - **VISUAL: Node highlighting** on hover with info tooltip
  - Bottom-right: legend overlay (collapsible)
  - Export graph as PNG/SVG

Architecture ("/architecture") — **ENHANCED WITH VISUALS**:
  **Must show diagrams, not just markdown text.**

  - **VISUAL: System Architecture Diagram** (main view)
    - Interactive diagram from docs/architecture/overview.md
    - Components: Client, API Gateway, Services, Database, Cache, Queue
    - Click component → show details panel
    - Animated connection lines

  - **VISUAL: Database ERD**
    - Parse docs/architecture/database.md
    - Render actual ERD diagram (not just ASCII)
    - Tables as boxes with columns
    - Relationship lines with cardinality labels
    - Click table → show schema details

  - **VISUAL: Frontend Component Tree**
    - Parse docs/architecture/frontend.md
    - Render as collapsible tree diagram
    - Show: App → Layouts → Pages → Components
    - Click component → show props/state info

  - **VISUAL: Backend Layer Diagram**
    - Parse docs/architecture/backend.md
    - Show: Routes → Middleware → Controllers → Services → Repositories → DB
    - Animated request flow on play

  - **VISUAL: Security Flow Diagram**
    - Parse docs/architecture/security.md
    - Show auth flow, token lifecycle, permission checks

  - **VISUAL: Cloud Infrastructure Diagram**
    - Parse docs/architecture/cloud.md
    - Show: VPC, subnets, services, load balancer
    - Cloud provider icons (AWS/GCP/Azure)

  - Tab navigation between diagrams
  - Each tab also has "View Source" to see the markdown
  - Export diagrams as PNG/SVG

Sprints ("/sprints") — **NEW PAGE FOR SPRINT RESULTS**:
  View completed sprint documentation from sprints/ folder.

  - List of completed sprints with status badges
  - Per-sprint view shows:
    - **VISUAL: Sprint Summary Card** with key metrics
    - **VISUAL: Completion Chart** (pie: completed vs remaining)
    - qa_result.md rendered with test result badges
    - release_notes.md rendered with feature highlights
    - summary.md rendered with retrospective insights
  - Compare sprints view (velocity over time)

Requirements ("/requirements"):
  - Renders original SRS/PRD as Markdown
  - **VISUAL: Requirements Traceability Matrix**
    - Table mapping requirements → specs → tickets
    - Colour-coded by implementation status
  - Functional vs non-functional sections with colour badges
  - **VISUAL: Coverage indicator** (% of requirements with tickets)

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

**CRITICAL: Include structured JSON files for visual rendering, not just markdown.**

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
├── architecture.json             # NEW — Structured architecture data:
│                                 #   {
│                                 #     system: { components: [...], connections: [...] },
│                                 #     database: { tables: [...], relationships: [...] },
│                                 #     frontend: { components: [...], hierarchy: [...] },
│                                 #     backend: { layers: [...], flow: [...] },
│                                 #     security: { authFlow: [...], permissions: [...] },
│                                 #     cloud: { services: [...], network: [...] }
│                                 #   }
│
├── flows.json                    # NEW — Structured flow data:
│                                 #   {
│                                 #     userJourneys: [{ persona, steps: [...] }],
│                                 #     authFlow: { steps: [...], tokens: [...] },
│                                 #     dataFlow: { sources: [...], transforms: [...], sinks: [...] },
│                                 #     stateMachines: [{ entity, states: [...], transitions: [...] }]
│                                 #   }
│
├── metrics.json                  # NEW — Project metrics for dashboard:
│                                 #   {
│                                 #     velocity: [{ sprint, points }],
│                                 #     modelDistribution: { haiku: N, sonnet: N, opus: N },
│                                 #     coverage: { unit: N, integration: N, e2e: N },
│                                 #     burndown: [{ date, remaining }]
│                                 #   }
│
└── requirements.md               # Original SRS/PRD input documents

Import strategy:
- Use Vite's ?raw import for .md files so they are embedded at build time
- For .json files, use standard import
- Generate architecture.json and flows.json by parsing the markdown files
- These JSON files enable the visual diagram rendering (not just text)

JSON Generation Rules:
- Parse Mermaid blocks from markdown and convert to node/edge format
- Extract tables and convert to structured data
- Parse ASCII diagrams and infer component relationships
- All JSON must be valid and complete — no placeholders

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
2. **Open the viewer** — `cd viewer && npm install && npm run dev` — see everything visually with diagrams and charts.
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
