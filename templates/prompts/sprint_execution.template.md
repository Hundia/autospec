# Sprint Execution Prompt Template

Use this template to generate sprint execution prompts for AI agents.

---

# Sprint {{SPRINT_NUMBER}}: {{SPRINT_NAME}}

**Starting Sprint {{SPRINT_NUMBER}}: {{SPRINT_NAME}}**

Read `specs/backlog.md` for full project context. This is {{PROJECT_DESCRIPTION}}.

## Project State
- Sprints 0-{{PREVIOUS_SPRINT}} complete ({{COMPLETED_FEATURES}})
- Stack: {{TECH_STACK}}
- Previous sprint delivered: {{PREVIOUS_DELIVERABLES}}

## What Exists from Previous Sprints (Relevant to Sprint {{SPRINT_NUMBER}})
{{#each EXISTING_RESOURCES}}
- {{this}}
{{/each}}

## Sprint {{SPRINT_NUMBER}} Scope ({{TICKET_COUNT}} tickets)

{{SPRINT_DESCRIPTION}}

### Sprint {{SPRINT_NUMBER}} Tickets

**Part A: {{PART_A_NAME}}**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
{{#each PART_A_TICKETS}}
| {{this.number}} | {{this.description}} | {{this.owner}} | {{this.model}} |
{{/each}}

**Part B: {{PART_B_NAME}}**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
{{#each PART_B_TICKETS}}
| {{this.number}} | {{this.description}} | {{this.owner}} | {{this.model}} |
{{/each}}

**Part C: {{PART_C_NAME}}**
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
{{#each PART_C_TICKETS}}
| {{this.number}} | {{this.description}} | {{this.owner}} | {{this.model}} |
{{/each}}

### Definition of Done
{{#each DEFINITION_OF_DONE}}
- [ ] {{this}}
{{/each}}

## Execution Guidelines

### 1. Spec-Driven Development
- Read relevant specs before implementing:
  - `specs/01_product_manager.md` - Product requirements
  - `specs/02_backend_lead.md` - API patterns
  - `specs/03_frontend_lead.md` - UI components
  - `specs/04_db_architect.md` - Database schema
  - `specs/05_qa_lead.md` - Testing requirements

### 2. Model Selection Strategy (FinOps-Optimized)

Track which model you use for each ticket. Guidelines:

**haiku** (cheapest, fastest - use for 40%+ of tasks):
- Simple database migrations with provided schema
- Basic CRUD endpoints following existing patterns
- Straightforward UI components from existing design system
- Seed scripts, config files, simple tests

**sonnet** (balanced - use for 45% of tasks):
- Standard services, controllers, routes
- Dashboard UI components
- API integrations following patterns
- Unit and integration tests

**opus** (most capable - use sparingly for 15% of complex tasks):
- Architecture decisions
- Security-critical code
- Complex algorithms
- Novel problem-solving

### 3. Implementation Order (Dependency-Aware)

Follow ticket dependencies for efficient execution:

**Phase 1: Foundation**
{{#each PHASE_1}}
- {{this}}
{{/each}}

**Phase 2: Core Features**
{{#each PHASE_2}}
- {{this}}
{{/each}}

**Phase 3: Integration**
{{#each PHASE_3}}
- {{this}}
{{/each}}

### 4. Testing Requirements
- Run `cd api && npm test` after backend changes
- Run `cd web && npm test` after frontend changes
- All tests must pass before marking tickets done

### 5. Backlog Updates
- Update `specs/backlog.md` as you complete tickets:
  - Change status: 🔲 Todo → 🔄 In Progress → ✅ Done
  - Model column already specified in backlog

### 6. Sprint Documentation
When sprint completes, create `sprints/sprint-{{SPRINT_NUMBER}}-{{SPRINT_SLUG}}/`:
- `summary.md` - Overview, completed tickets, architecture notes
- `qa-results.md` - Test results, coverage
- `release-notes.md` - User-facing changes

### 7. Code Standards
- Follow existing patterns in codebase
- Use Zod for validation (see `api/src/schemas/`)
- Use existing design system components
- Repository → Service → Controller → Routes pattern for backend

## Key Technical Considerations

### Database Schema
{{DATABASE_SCHEMA}}

### API Endpoints
{{API_ENDPOINTS}}

### Frontend Components
{{FRONTEND_COMPONENTS}}

## Multi-Agent Execution Strategy

### Parallel Workstreams

**Agent A (Backend - sonnet)**: {{AGENT_A_TICKETS}}
- Database migrations
- API endpoints
- Services

**Agent B (Frontend - sonnet)**: {{AGENT_B_TICKETS}}
- UI components
- Pages
- State management

### Handoff Points
{{#each HANDOFF_POINTS}}
- {{this}}
{{/each}}

## Starting Command

Begin by reading the Sprint {{SPRINT_NUMBER}} tickets in `specs/backlog.md`, then:
1. Create a todo list for tracking
2. Start with the first ticket in your assignment
3. Follow the implementation order

---

*Generated with SDD for All framework*
