# AutoSpec Generation Plan

> **What this section covers:** This section defines the complete output directory structure that AutoSpec generates. Read this first to understand what files will be produced.
>
> **When to read:** Before starting any generation task. This is the master map of all outputs.

---

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

---
*Source: QUICKSTART.md — Part 1 of 7*
