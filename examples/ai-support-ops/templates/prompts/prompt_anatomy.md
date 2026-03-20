# Prompt Anatomy: A Guide to SDD Prompt Templates

This document explains the structure, components, and best practices for creating effective sprint prompts in the SDD methodology.

---

## Table of Contents

1. [Why Prompts Matter](#1-why-prompts-matter)
2. [Prompt Structure Overview](#2-prompt-structure-overview)
3. [Core Components](#3-core-components)
4. [Variable System](#4-variable-system)
5. [Prompt Types](#5-prompt-types)
6. [Before/After Examples](#6-beforeafter-examples)
7. [Best Practices](#7-best-practices)
8. [Anti-Patterns](#8-anti-patterns)
9. [Template Customization](#9-template-customization)

---

## 1. Why Prompts Matter

In SDD, prompts are the **executable interface** between human intent and AI execution. A well-structured prompt:

- **Provides complete context** - AI doesn't need to ask clarifying questions
- **Defines clear boundaries** - What to do and what NOT to do
- **Enables parallel work** - Multiple agents can execute independently
- **Ensures consistency** - Every execution follows the same patterns
- **Supports handoffs** - Any AI can pick up where another left off

### The Prompt as Contract

Think of a sprint prompt as a contract:

```
┌─────────────────────────────────────────────────────────────┐
│                      SPRINT PROMPT                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Context (What exists)                                       │
│  ─────────────────────                                       │
│  - Project state                                             │
│  - Previous work                                             │
│  - Available resources                                       │
│                                                              │
│  Scope (What to do)                                          │
│  ─────────────────                                           │
│  - Specific tickets                                          │
│  - Acceptance criteria                                       │
│  - Deliverables                                              │
│                                                              │
│  Guidelines (How to do it)                                   │
│  ────────────────────────                                    │
│  - Patterns to follow                                        │
│  - Tools to use                                              │
│  - Quality standards                                         │
│                                                              │
│  Boundaries (What NOT to do)                                 │
│  ──────────────────────────                                  │
│  - Out of scope items                                        │
│  - Files not to modify                                       │
│  - Decisions not to make                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Prompt Structure Overview

Every SDD prompt follows this high-level structure:

```markdown
# Sprint [N]: [Name]

## Header
- Sprint number and name
- Goal statement
- Project description reference

## Context Section
- Project state
- Previous sprint deliverables
- Tech stack
- Relevant existing code

## Scope Section
- Sprint description
- Ticket tables (by category/agent)
- Definition of done

## Guidelines Section
- Specs to read
- Model selection strategy
- Implementation patterns
- Testing requirements
- Code standards

## Execution Section
- Agent assignments (if multi-agent)
- Dependency order
- Handoff points

## Documentation Section
- Sprint folder structure
- Summary templates
- Backlog update instructions

## Starting Command
- Clear first action
```

---

## 3. Core Components

### 3.1 Header Block

The header establishes context immediately:

```markdown
# Sprint 5: User Authentication

**Starting Sprint 5: User Authentication**

Read `specs/backlog.md` for full project context. This is a task management
application built with Node.js/Express backend and React frontend.

## Project State
- Sprints 0-4 complete (foundation, tasks CRUD, UI components, API refinement)
- Stack: Node.js 20, Express, PostgreSQL, React 18, TypeScript
- Previous sprint delivered: Task filtering and sorting
```

**Why it works:**
- Immediate orientation (what sprint, what project)
- Points to authoritative source (backlog)
- Summarizes current state
- No ambiguity about starting point

### 3.2 Ticket Tables

Tickets are presented in tables for scanability:

```markdown
| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 5.1 | Create users table migration | 🔲 Todo | Backend | haiku |
| 5.2 | Implement user registration endpoint | 🔲 Todo | Backend | sonnet |
| 5.3 | Add password hashing utility | 🔲 Todo | Backend | sonnet |
| 5.4 | Create login page component | 🔲 Todo | Frontend | sonnet |
```

**Components:**
- **#**: Sprint.ticket numbering (5.1, 5.2)
- **Ticket**: Action-oriented description
- **Status**: Current state (emoji system)
- **Owner**: Role responsible (Backend, Frontend, QA)
- **Model**: Recommended AI model (haiku, sonnet, opus)

### 3.3 Specs Reference

Always point to relevant specifications:

```markdown
## Specs to Read
Before implementing, read:
1. `specs/backlog.md` - Find Sprint 5 section
2. `specs/02_backend_lead.md` - API patterns and auth design
3. `specs/04_db_architect.md` - User table schema
4. `specs/05_qa_lead.md` - Auth testing requirements
```

**Why:**
- Specs contain the detailed requirements
- Prompts are summaries, specs are source of truth
- Enables AI to self-serve additional context

### 3.4 Model Selection Guidelines

Cost optimization is explicit:

```markdown
## Model Selection Strategy (FinOps-Optimized)

**haiku** (cheapest, fastest - use for 40%+ of tasks):
- Simple migrations with provided schema
- CRUD endpoints following existing patterns
- Config files, simple tests

**sonnet** (balanced - use for 45% of tasks):
- Standard services and controllers
- UI components with logic
- Integration tests

**opus** (most capable - use sparingly, 15% of tasks):
- Security-critical auth code
- Complex algorithms
- Architecture decisions
```

### 3.5 Definition of Done

Clear success criteria:

```markdown
## Definition of Done
- [ ] All tickets in ✅ Done status
- [ ] All tests pass: `npm test`
- [ ] Lint clean: `npm run lint`
- [ ] User can register and login
- [ ] JWT tokens issued and validated
- [ ] Sprint docs created
```

---

## 4. Variable System

Templates use Handlebars-style variables for customization.

### 4.1 Simple Variables

```markdown
# Sprint {{SPRINT_NUMBER}}: {{SPRINT_NAME}}

Project: {{PROJECT_NAME}}
Stack: {{TECH_STACK}}
```

### 4.2 List Variables

```markdown
{{#each TICKETS}}
| {{this.number}} | {{this.description}} | {{this.owner}} | {{this.model}} |
{{/each}}
```

### 4.3 Conditional Variables

```markdown
{{#if HAS_DATABASE}}
## Database Setup
Run migrations: `npm run migrate`
{{/if}}
```

### 4.4 Variable Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Strings | SCREAMING_SNAKE | `{{PROJECT_NAME}}` |
| Lists | Plural | `{{TICKETS}}` |
| Booleans | HAS_ or IS_ prefix | `{{HAS_AUTH}}` |
| Nested | dot notation | `{{this.number}}` |

---

## 5. Prompt Types

### 5.1 Sprint Execution Prompt

**Use for:** Standard feature development sprints

**Key sections:**
- Full ticket list
- Multi-agent assignments
- Implementation order
- Testing requirements

**Template:** `sprint_execution.template.md`

### 5.2 Foundation Sprint Prompt

**Use for:** Sprint 0, project initialization

**Key sections:**
- Infrastructure setup
- Project structure
- Tooling configuration
- Verification scripts

**Template:** `foundation_sprint.template.md`

### 5.3 Business Sprint Prompt

**Use for:** Non-code sprints (marketing, docs, planning)

**Key sections:**
- Content standards
- Deliverable formats
- Review criteria
- No testing sections

**Template:** `business_sprint.template.md`

### 5.4 QA Review Prompt

**Use for:** Post-sprint quality validation

**Key sections:**
- Test execution commands
- Functional verification checklists
- Security review
- Sign-off criteria

**Template:** `qa_review.template.md`

### 5.5 Multi-Agent Prompt

**Use for:** Parallel execution setup

**Key sections:**
- Agent role definitions
- Per-agent ticket assignments
- Sync points
- Handoff protocols

**Template:** `multi_agent.template.md`

---

## 6. Before/After Examples

### Example 1: Vague vs. Specific

**Before (Bad):**
```markdown
Create user authentication for the app.
Add login and registration.
Make sure it's secure.
```

**After (Good):**
```markdown
# Sprint 5: User Authentication

## Goal
Implement JWT-based authentication with email/password registration and login.

## Tickets
| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| 5.1 | Create users table (id, email, password_hash, created_at) | Backend | haiku |
| 5.2 | POST /auth/register - validate input, hash password, create user, return JWT | Backend | sonnet |
| 5.3 | POST /auth/login - verify credentials, return JWT | Backend | sonnet |
| 5.4 | Create auth middleware to verify JWT on protected routes | Backend | sonnet |
| 5.5 | Create LoginForm component with email/password fields | Frontend | sonnet |
| 5.6 | Create RegisterForm component with validation | Frontend | sonnet |

## Specs
- See `specs/02_backend_lead.md` Section 4 for JWT implementation pattern
- See `specs/04_db_architect.md` for users table schema

## Security Requirements
- Passwords hashed with bcrypt (cost factor 12)
- JWT expires in 15 minutes
- Refresh token flow required

## Definition of Done
- [ ] User can register with email/password
- [ ] User can login and receive JWT
- [ ] Protected routes reject invalid tokens
- [ ] All auth tests pass
```

### Example 2: Missing Context vs. Complete Context

**Before (Bad):**
```markdown
Continue working on the task management features.
Add the dashboard.
```

**After (Good):**
```markdown
# Sprint 3: Task Dashboard

**Project State:**
- Sprint 0-2 complete
- Tasks CRUD API exists at `/api/v1/tasks`
- Task model: id, title, description, status, userId, createdAt
- React app with basic layout

**What Exists:**
- `api/src/routes/tasks.routes.ts` - CRUD endpoints
- `api/src/services/task.service.ts` - Business logic
- `web/src/components/Layout.tsx` - App shell
- `web/src/services/api.ts` - Axios instance configured

**Sprint 3 Scope:**
Build the task dashboard showing user's tasks with filtering.

| # | Ticket | Details |
|---|--------|---------|
| 3.1 | GET /tasks/stats endpoint | Return {total, completed, pending} |
| 3.2 | TaskCard component | Display single task with status badge |
| 3.3 | TaskList component | Render array of TaskCards |
| 3.4 | Dashboard page | Fetch and display stats + tasks |
```

### Example 3: Single Agent vs. Multi-Agent

**Before (Single Agent - Sequential):**
```markdown
Complete these tickets in order:
1. Create tasks API
2. Create tasks UI
3. Connect them
```

**After (Multi-Agent - Parallel):**
```markdown
# Agent A: Backend Lead

## Your Tickets
| # | Ticket | Status |
|---|--------|--------|
| 3.1 | Tasks CRUD API | 🔲 Todo |
| 3.2 | Task validation schemas | 🔲 Todo |
| 3.3 | Task service layer | 🔲 Todo |

## Boundaries
- DO NOT modify frontend code
- DO NOT change database schema without approval

## Sync Point
After 3.1-3.3 complete, notify that API is ready.

---

# Agent B: Frontend Lead

## Your Tickets
| # | Ticket | Status |
|---|--------|--------|
| 3.4 | TaskCard component (mock data) | 🔲 Todo |
| 3.5 | TaskList component (mock data) | 🔲 Todo |
| 3.6 | API integration (after sync) | ⏸️ Blocked |

## Boundaries
- DO NOT modify backend code
- Use mock data until API ready

## Dependencies
- Ticket 3.6 blocked until Agent A completes
```

---

## 7. Best Practices

### 7.1 Context Loading

**Do:**
- Reference spec files, don't duplicate content
- Summarize project state concisely
- List what exists that's relevant to this sprint

**Don't:**
- Copy entire specs into prompts
- Assume AI remembers previous conversations
- Skip the "what exists" section

### 7.2 Ticket Granularity

**Good ticket sizes:**
- 2-4 hours of work
- Single responsibility
- Clear deliverable

**Examples:**
- Good: "Create user registration endpoint"
- Bad: "Build authentication system"
- Good: "Add password reset email template"
- Bad: "Do all the email stuff"

### 7.3 Model Assignment

**haiku triggers:**
- "following existing pattern"
- "simple", "basic", "straightforward"
- Config, migration, scaffold

**sonnet triggers:**
- Standard business logic
- UI components with state
- Tests with assertions

**opus triggers:**
- "security-critical"
- "novel algorithm"
- "architecture decision"

### 7.4 Verification

Always include verification steps:

```markdown
## Verification
After completing each ticket:

1. Run tests: `npm test`
2. Check lint: `npm run lint`
3. Manual verification: [specific steps]
4. Update backlog status
```

---

## 8. Anti-Patterns

### 8.1 The Ambiguous Prompt

```markdown
# Bad: What does "improve" mean?
- Improve the user experience
- Make the code better
- Enhance performance

# Good: Specific, measurable
- Reduce page load time from 3s to under 1s
- Add loading spinners to all async operations
- Implement pagination for task list (20 per page)
```

### 8.2 The Context-Free Prompt

```markdown
# Bad: No context
Add task filtering.

# Good: Full context
Sprint 4 adds filtering to the existing task list.

Existing:
- TaskList component at `web/src/components/TaskList.tsx`
- Tasks API at GET /api/v1/tasks
- Task statuses: 'pending', 'in_progress', 'completed'

Add:
- Filter dropdown component
- Query param support: GET /tasks?status=pending
- URL state sync for filters
```

### 8.3 The Over-Specified Prompt

```markdown
# Bad: Too prescriptive, limits AI capability
Use exactly this code:
```typescript
const filter = (tasks) => tasks.filter(t => t.status === status);
```

# Good: Specify what, not how
Implement client-side task filtering by status.
Requirements:
- Filter options: All, Pending, In Progress, Completed
- Preserve filter on page refresh (URL state)
- Follow existing component patterns
```

### 8.4 The Kitchen Sink Prompt

```markdown
# Bad: Too much in one sprint
Sprint 5: Add auth, payments, notifications, analytics, admin panel...

# Good: Focused scope
Sprint 5: User Authentication
Sprint 6: Email Notifications
Sprint 7: Payment Integration
```

---

## 9. Template Customization

### 9.1 Adding Project-Specific Sections

If your project has unique needs, add custom sections:

```markdown
## Mobile Considerations
- Test on iOS Safari and Chrome Android
- Ensure touch targets are 44x44px minimum
- Check offline behavior

## Localization
- All user-facing strings through i18n
- RTL layout support required
- Date/time formats per locale
```

### 9.2 Removing Unnecessary Sections

For simpler projects, remove unused sections:

```markdown
<!-- Remove if no multi-agent -->
## Multi-Agent Strategy
...

<!-- Remove if no caching -->
### Redis Configuration
...
```

### 9.3 Creating Domain-Specific Templates

For specialized domains, create new templates:

```markdown
# templates/prompts/ml_sprint.template.md

## Data Pipeline
- Input data source: {{DATA_SOURCE}}
- Preprocessing steps: {{PREPROCESSING}}
- Output format: {{OUTPUT_FORMAT}}

## Model Training
- Algorithm: {{ALGORITHM}}
- Hyperparameters: {{HYPERPARAMS}}
- Evaluation metrics: {{METRICS}}

## Deployment
- Serving infrastructure: {{SERVING}}
- Latency requirements: {{LATENCY}}
```

---

## Quick Reference

### Prompt Checklist

Before using a prompt, verify:

- [ ] Sprint number and name clear
- [ ] Project context provided
- [ ] All tickets have numbers, descriptions, owners, models
- [ ] Specs referenced (not duplicated)
- [ ] Definition of Done defined
- [ ] Model selection guidance included
- [ ] Testing requirements specified
- [ ] Backlog update instructions included
- [ ] Multi-agent assignments clear (if applicable)
- [ ] Sync points defined (if multi-agent)

### Variable Quick Reference

| Variable | Description | Example Value |
|----------|-------------|---------------|
| `{{SPRINT_NUMBER}}` | Current sprint number | 5 |
| `{{SPRINT_NAME}}` | Sprint name | User Authentication |
| `{{PROJECT_NAME}}` | Project name | TaskFlow |
| `{{TECH_STACK}}` | Technology stack | Node.js, React, PostgreSQL |
| `{{TICKETS}}` | Array of ticket objects | See template |
| `{{DEFINITION_OF_DONE}}` | Array of criteria | See template |

---

*This document is part of the SDD for All framework.*
