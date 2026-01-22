# AutoSpec Quickstart

**Go from requirements to working code in 5 steps.**

This guide shows you how to use AutoSpec manually with any AI assistant (Claude, Copilot, ChatGPT, etc.). No CLI required.

---

## Overview

```
Requirements → Specs → Backlog → Sprint 0 → Sprint 1+
   (5 min)    (15 min)  (10 min)  (2-4 hrs)   (repeat)
```

Each step produces artifacts that feed the next. By the end, you'll have:
- 10 specification documents covering all aspects of your project
- A structured backlog with sized tickets
- Working code with tests
- Clear documentation of what was built

---

## Before You Start

1. **Create a project folder** for your new project
2. **Have an AI assistant ready** (Claude Code, VS Code + Copilot, etc.)
3. **Know what you want to build** (even a rough idea works)

---

## Step 1: Write Your Requirements

Create a `requirements.md` file describing what you want to build.

### Option A: Start from Template

Copy this template and fill it in:

```markdown
# [Project Name] - Requirements

## Vision
[One paragraph describing what you're building and why]

## Target Users
- Primary: [Who is the main user?]
- Secondary: [Other users?]

## Core Features
1. [Feature 1] - [Brief description]
2. [Feature 2] - [Brief description]
3. [Feature 3] - [Brief description]
4. [Feature 4] - [Brief description]
5. [Feature 5] - [Brief description]

## Technical Requirements
- **Frontend**: [React/Vue/etc.]
- **Backend**: [Node/Python/etc.]
- **Database**: [PostgreSQL/MongoDB/etc.]
- **Hosting**: [Vercel/AWS/etc.]

## Success Metrics
- [Metric 1]: [Target]
- [Metric 2]: [Target]

## Constraints
- Timeline: [Deadline if any]
- Budget: [If relevant]
- Must integrate with: [Existing systems]

## Out of Scope (for now)
- [What you're NOT building in v1]
```

### Option B: Look at Examples

See complete examples:
- **E-commerce (ShopFlow)**: [examples/ecommerce/requirements.md](./examples/ecommerce/requirements.md)
- **API Service (DataHub)**: [examples/api-service/requirements.md](./examples/api-service/requirements.md)

---

## Step 2: Generate Your Team (10 Specs)

Use this prompt to generate all 10 specification documents from your requirements.

### The Prompt

Copy and paste this into your AI assistant:

```
You are executing the AutoSpec methodology to generate specifications.

## Your Task
Read my requirements document and generate 10 comprehensive specification files, one for each role in the 10-role model.

## Input
[PASTE YOUR requirements.md CONTENT HERE]

## Output Structure
Create these files in a `specs/` folder:

### 1. specs/01_product_manager.md
- Product vision and objectives (specific to this project)
- 3-5 detailed user personas with goals, frustrations, behaviors
- User stories with acceptance criteria (Given/When/Then format)
- User flows (registration, core actions, edge cases)
- Feature prioritization using MoSCoW method

### 2. specs/02_backend_lead.md
- System architecture overview with diagram
- Complete API contracts table (Method, Path, Auth, Request, Response)
- Request/response JSON examples for each endpoint
- Authentication flow (JWT, sessions, OAuth if needed)
- Service layer design with responsibilities
- Error handling standards (error codes, messages, HTTP status mapping)
- Rate limiting strategy

### 3. specs/03_frontend_lead.md
- Component hierarchy using atomic design (atoms, molecules, organisms)
- State management approach (what goes in global vs local state)
- Design system tokens (colors with hex, spacing scale, typography)
- Complete routing structure with auth guards
- Form handling patterns with validation
- Performance requirements (Core Web Vitals targets)

### 4. specs/04_db_architect.md
- Entity-Relationship diagram (ASCII art or description)
- Complete CREATE TABLE statements with all columns, types, constraints
- Index definitions for query optimization
- Migration strategy (naming convention, versioning)
- Common query patterns
- Seed data plan for development/testing

### 5. specs/05_qa_lead.md
- Test strategy (unit/integration/e2e percentages)
- Test cases for critical user paths
- Coverage requirements (target 70%+)
- Performance benchmarks (response times, load capacity)
- Security testing checklist based on OWASP top 10

### 6. specs/06_devops_lead.md
- Infrastructure architecture diagram
- CI/CD pipeline design (stages, triggers, artifacts)
- Environment configuration (dev, staging, prod differences)
- Deployment strategy (blue-green, rolling, etc.)
- Monitoring stack (what metrics, what alerts)
- Logging strategy
- Backup and recovery procedures

### 7. specs/07_marketing_lead.md
- Go-to-market strategy
- Target audience segments with size estimates
- Messaging framework (value props, taglines, elevator pitch)
- Launch timeline with milestones
- Channel strategy (which channels, why)
- Success metrics (CAC, conversion, retention targets)

### 8. specs/08_finance_lead.md
- Cost analysis (infrastructure, tools, labor estimates)
- Pricing strategy (if applicable)
- Revenue projections (3-6-12 month)
- Unit economics (CAC, LTV, payback period)
- Budget allocation by phase

### 9. specs/09_business_lead.md
- Business model overview
- Competitive analysis (3-5 competitors with strengths/weaknesses)
- SWOT analysis
- KPIs and success metrics with targets
- Risk assessment with mitigations
- Growth strategy (phases)

### 10. specs/10_ui_designer.md
- Complete screen inventory (all pages/views/modals)
- Wireframe descriptions for each screen (layout, elements, interactions)
- Component states (default, hover, active, disabled, error, loading)
- Responsive breakpoints (mobile, tablet, desktop layouts)
- Accessibility requirements (WCAG 2.1 AA compliance)

## Requirements for All Specs
- Be SPECIFIC to my project, not generic
- Include concrete examples, not placeholders
- Cross-reference other specs where relevant (e.g., "See API in 02_backend_lead.md")
- Use consistent naming conventions across all specs
- Each spec should be 300-800 lines with real detail

Create all 10 files now.
```

### What You Get

```
your-project/
└── specs/
    ├── 01_product_manager.md
    ├── 02_backend_lead.md
    ├── 03_frontend_lead.md
    ├── 04_db_architect.md
    ├── 05_qa_lead.md
    ├── 06_devops_lead.md
    ├── 07_marketing_lead.md
    ├── 08_finance_lead.md
    ├── 09_business_lead.md
    └── 10_ui_designer.md
```

**Tip:** Review the generated specs. The AI might ask clarifying questions - answer them to improve the specs.

---

## Step 3: Generate Backlog

Now extract all actionable work items from your specs into a single backlog.

### The Prompt

```
You have generated 10 specs for my project.

## Your Task
Create `specs/backlog.md` extracting ALL actionable tickets from the specs.

## Backlog Format

# [Project Name] Backlog

Generated: [Today's date]
Total Tickets: [Count]
Total Story Points: [Sum]

## Sprint 0: Foundation
Goal: Project setup, basic infrastructure, "walking skeleton"

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
|----|-------|-------------|--------|--------|-------|-------|--------------|
| 0.1 | Initialize project | Set up monorepo with TypeScript, ESLint, Prettier | 2 | todo | DevOps | haiku | - |
| 0.2 | Configure CI/CD | GitHub Actions for lint, test, build | 3 | todo | DevOps | haiku | 0.1 |
| 0.3 | Create database schema | Initial tables from 04_db_architect.md | 3 | todo | DB | haiku | 0.1 |
| ... | ... | ... | ... | ... | ... | ... | ... |

## Sprint 1: [Theme]
Goal: [What this sprint delivers]

| ID | Title | Description | Points | Status | Owner | Model | Dependencies |
|----|-------|-------------|--------|--------|-------|-------|--------------|
| 1.1 | ... | ... | ... | todo | ... | ... | ... |

[Continue for all sprints...]

## Ticket Guidelines

### Story Points
- 1: Trivial (config change, copy update) - ~30 min
- 2: Small (simple component, basic CRUD) - ~1-2 hours
- 3: Medium (feature with logic, API endpoint) - ~2-4 hours
- 5: Large (complex feature, integrations) - ~4-8 hours
- 8: XL (major feature - consider splitting) - ~1-2 days

### Status Values
- `todo` - Ready to start
- `in-progress` - Currently being worked
- `qa-review` - Code complete, needs testing
- `done` - Tested and merged
- `blocked` - Waiting on something

### Owner (Role)
- DB: Database work
- Backend: API, services, auth
- Frontend: UI components, pages
- DevOps: Infrastructure, CI/CD
- QA: Test writing, reviews

### Model (AI complexity)
- haiku: Simple tasks (40% of tickets) - migrations, configs, CRUD
- sonnet: Standard tasks (45%) - services, components, tests
- opus: Complex tasks (15%) - architecture, security, debugging

## Your Output
- Extract EVERY actionable item from all 10 specs
- Group into logical sprints (Foundation, then feature-based)
- Sprint 0 should be 15-25 points (setup + minimal working feature)
- Subsequent sprints: 25-40 points each
- Target 2-4 hour tickets (split larger ones)
- Include clear dependencies
- Assign appropriate model tier

Read all specs in `specs/` and create the complete backlog now.
```

### What You Get

A `specs/backlog.md` file with every ticket needed to build your project, organized into sprints.

---

## Step 4: Run Sprint 0 (Foundation)

Sprint 0 sets up the project and creates a "walking skeleton" - minimal end-to-end functionality.

### The Prompt

```
Execute Sprint 0 for my project.

## Context
- Specs: Read all files in `specs/`
- Backlog: `specs/backlog.md`
- Sprint tickets: All tickets with IDs starting with "0."

## Sprint 0 Goal
Create a working foundation:
- Project initialized with tooling
- Database schema created
- Basic API running
- Minimal UI showing data
- CI/CD pipeline working

## Execution Process

For EACH ticket in Sprint 0:

### 1. Start
- Update backlog.md: change status to `in-progress`
- Read the relevant spec for requirements

### 2. Implement
- Create code following the specs EXACTLY
- Use naming conventions from specs
- Add comments for complex logic

### 3. Test
- Write tests as specified in 05_qa_lead.md
- Cover happy path + key edge cases

### 4. Complete
- Run tests to verify
- Update backlog.md: change status to `done`
- Move to next ticket

## Deliverables

### 1. Working Code
- All source files in `src/`
- Follow structure from specs

### 2. Tests
- Test files in `tests/` or alongside source
- Should pass when run

### 3. Updated Backlog
- `specs/backlog.md` with Sprint 0 tickets marked `done`

### 4. Sprint Report
Create `sprints/sprint-0/summary.md`:

# Sprint 0 Summary

## Completed
- [x] Ticket 0.1: Description
- [x] Ticket 0.2: Description
...

## Test Results
- Tests: X passing
- Coverage: X%

## What's Working
- [Describe what a user can do now]

## Known Issues
- [Any bugs or technical debt]

## Ready for Sprint 1
- [What's now possible to build]

Execute all Sprint 0 tickets now, updating the backlog as you go.
```

### What You Get

- Working project with foundation code
- Tests passing
- CI/CD running (if configured)
- Backlog updated with completed tickets
- Sprint summary documenting what was built

---

## Step 5: Run Sprint 1+ (Features)

Repeat for each subsequent sprint.

### The Prompt

```
Execute Sprint [N] for my project.

## Context
- Specs: Read all files in `specs/`
- Backlog: `specs/backlog.md`
- Previous sprints: `sprints/sprint-*/summary.md`
- Sprint tickets: All tickets with IDs starting with "[N]."

## Sprint [N] Goal
[Copy the goal from your backlog for this sprint]

## Execution Process

Same as Sprint 0:
1. Start ticket (update status to in-progress)
2. Reference relevant specs
3. Implement code
4. Write tests
5. Complete ticket (update status to done)
6. Repeat

## Multi-Agent Strategy (Optional)

If using two AI sessions in parallel:

**Agent A (Backend)**:
- Tickets: [List backend ticket IDs]
- Focus: Database, API, services
- Specs to read: 02_backend_lead.md, 04_db_architect.md

**Agent B (Frontend)**:
- Tickets: [List frontend ticket IDs]
- Focus: Components, pages, styling
- Specs to read: 03_frontend_lead.md, 10_ui_designer.md

**Sync Points**:
- Agent B waits for [ticket ID] before starting [dependent ticket ID]

## Deliverables

1. All Sprint [N] tickets implemented and tested
2. Backlog updated with `done` status
3. Sprint summary: `sprints/sprint-[N]/summary.md`
4. QA report if issues found: `sprints/sprint-[N]/qa-results.md`

Execute all Sprint [N] tickets now.
```

---

## Tips for Success

### 1. Review Specs Before Executing

Don't blindly execute. Skim the generated specs to catch:
- Missing features you forgot to mention
- Incorrect assumptions
- Over-engineering

### 2. Small Tickets Win

If a ticket feels too big (>5 points), split it. Small tickets:
- Show visible progress
- Are easier for AI to complete correctly
- Allow parallel work

### 3. Update the Backlog

Always update ticket status. The backlog is your single source of truth.

### 4. Use the Right Model

- **Haiku/GPT-3.5**: Migrations, configs, simple CRUD
- **Sonnet/GPT-4**: Services, components, tests
- **Opus/GPT-4+**: Architecture, security, complex debugging

Using expensive models for simple tasks wastes money.

### 5. Reference Specs in Prompts

Instead of "build a login page", say:
```
Build the login page per specs/03_frontend_lead.md (lines 45-80)
using the auth API from specs/02_backend_lead.md
```

---

## Using the CLI (Optional)

If you prefer automation, install the AutoSpec CLI:

```bash
npm install -g autospec

# Initialize project
autospec init

# Check status
autospec status

# Generate sprint prompt
autospec sprint 1
```

See [cli/README.md](./cli/README.md) for full documentation.

---

## Example Walkthroughs

See complete worked examples:

- **[ShopFlow E-commerce](./examples/ecommerce/)** - Full e-commerce platform (7 sprints, 174 tickets)
- **[DataHub API Service](./examples/api-service/)** - API gateway with auth (4 sprints, 89 tickets)

---

## Next Steps

1. **Read the methodology** - [docs/methodology/](./docs/methodology/) explains the "why"
2. **Explore templates** - [templates/](./templates/) has detailed templates for each spec
3. **Set up your IDE** - [docs/environments/](./docs/environments/) has guides for VS Code, terminal, etc.

---

## FAQ

### How long does this take?

- Step 1 (Requirements): 5-30 minutes depending on complexity
- Step 2 (Specs): 15-30 minutes for AI generation + 15 minutes review
- Step 3 (Backlog): 10-15 minutes
- Step 4 (Sprint 0): 2-4 hours
- Each additional sprint: 4-8 hours

### Can I skip the business specs (Marketing, Finance, Business)?

Yes. For personal projects, focus on:
- 01_product_manager.md (what you're building)
- 02_backend_lead.md
- 03_frontend_lead.md
- 04_db_architect.md
- 05_qa_lead.md

### What if the AI generates something wrong?

1. Correct it in the spec before executing
2. Or note the issue and have the AI fix it
3. Specs are living documents - update them as you learn

### Do I need multiple AI sessions for multi-agent?

No. Multi-agent is optional and helps with speed. Single-agent works fine.

---

*"The best code is the code you never have to debug. AutoSpec catches issues in specs before they become bugs."*
