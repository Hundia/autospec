# AutoSpec Docs — Architecture, Workflows, Environments, API, Testing, UI Design System, Project

> **What this section covers:** This section defines all documentation files to generate: architecture, workflows, environments, API, testing, UI design system, and project docs.
>
> **When to read:** When generating any file under `docs/`. Each subsection maps to a docs folder and describes what content each file must contain.

---

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

---
*Source: QUICKSTART.md — Part 3 of 7*
