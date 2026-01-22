# Backlog Management: Sprints, Tickets, and Progress Tracking

**Version:** 1.0
**Last Updated:** 2026-01-21

---

## The Backlog is Everything

In SDD, `backlog.md` is the single source of truth for all work. It contains:

- Sprint definitions
- Ticket details
- Status tracking
- Dependencies
- Definition of Done

If it's not in the backlog, it doesn't exist.

---

## Backlog Structure

```markdown
# Project Backlog

## Team Specs Reference
[Table linking to all 9 specs]

## Status Legend
[Emoji definitions]

## ✅ Sprint 0: Foundation — COMPLETE
[Completed sprint with all Done tickets]

## 🔄 Sprint 1: [Name] — ACTIVE
[Current sprint with mixed statuses]

## 🔲 Sprint 2: [Name] — PLANNED
[Future sprint with all Todo tickets]
```

---

## Status System

### Status Emoji Legend

| Emoji | Status | Meaning | Transitions To |
|-------|--------|---------|----------------|
| 🔲 | Todo | Not started | 🔄 In Progress |
| 🔄 | In Progress | Being worked on | 🧪 QA Review, ⏸️ Blocked |
| 🧪 | QA Review | Implementation complete | ✅ Done, 🔄 In Progress (if failed) |
| ✅ | Done | Tested and verified | - |
| ⏸️ | Blocked | Cannot proceed | 🔲 Todo (when unblocked) |

### Status Flow

```
                                    ┌───────────┐
                                    │  ⏸️ Blocked │
                                    └─────▲─────┘
                                          │
    ┌──────────┐    ┌──────────────┐    │    ┌───────────┐    ┌─────────┐
    │  🔲 Todo  │───►│ 🔄 In Progress│───┴───►│ 🧪 QA Review│───►│  ✅ Done │
    └──────────┘    └──────────────┘         └───────────┘    └─────────┘
                           ▲                       │
                           │                       │
                           └───────────────────────┘
                              (if QA fails)
```

---

## Sprint Anatomy

### Sprint Header

```markdown
## [Status] Sprint X: [Name] — [STATE]

**Goal:** [One sentence describing what this sprint delivers]

> **Spec:** [Link to feature spec if applicable]
```

**States:**
- `COMPLETE` - All tickets done, sprint closed
- `ACTIVE` - Currently being worked on
- `PLANNED` - Future work, not yet started
- `BLOCKED` - Cannot proceed due to external dependency

### Ticket Table

```markdown
| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| X.1 | [Clear, actionable description] | [Status emoji] | [Role] | [Model] |
```

**Columns:**
- **#** - Sprint.Ticket number (e.g., 1.3 = Sprint 1, Ticket 3)
- **Ticket** - What needs to be done (imperative verb)
- **Status** - Current state (emoji)
- **Owner** - Responsible role (Backend, Frontend, QA, etc.)
- **Model** - AI model to use (haiku, sonnet, opus)

### Dependencies

```markdown
### Dependencies
- Sprint X complete
- Ticket Y.Z complete (if within-sprint dependency)
```

### Definition of Done

```markdown
### Definition of Done
- [ ] All tickets ✅ Done
- [ ] Tests pass (X/X)
- [ ] No blockers
- [ ] Sprint documentation created
```

---

## Ticket Best Practices

### Good Tickets

```markdown
| 4.3 | Create POST /api/v1/sessions endpoint with Zod validation | 🔲 | Backend | sonnet |
| 4.4 | Build SessionCard component with timer and progress | 🔲 | Frontend | sonnet |
| 4.5 | Write integration tests for session API | 🔲 | QA | sonnet |
```

**Characteristics:**
- Action verb (Create, Build, Write, Implement)
- Specific scope (one component, one endpoint)
- 2-4 hours of work
- Clear done criteria implied

### Bad Tickets

```markdown
| 4.1 | Build authentication | 🔲 | Backend | - |
| 4.2 | Make it look good | 🔲 | Frontend | - |
| 4.3 | Test everything | 🔲 | QA | - |
```

**Problems:**
- Too vague ("Build authentication" = 20 hours)
- No clear scope ("look good" = subjective)
- No model specified (cost unpredictable)

### Ticket Sizing Guide

| Size | Hours | Indicators |
|------|-------|------------|
| XS | 0.5-1 | Config change, simple fix |
| S | 1-2 | One function, one component |
| M | 2-4 | Service with logic, complex component |
| L | 4-8 | **Too big - split it** |
| XL | 8+ | **WAY too big - split it** |

**Rule:** If you can't complete it in a half-day, split it.

---

## Sprint Types

### Sprint 0: Foundation

Every project starts with Sprint 0 - infrastructure setup.

```markdown
## 🔄 Sprint 0: Foundation — ACTIVE

**Goal:** Set up project infrastructure and development environment

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 0.1 | Initialize git repo with README | 🔲 | DevOps | haiku |
| 0.2 | Create Docker development environment | 🔲 | DevOps | sonnet |
| 0.3 | Set up database with initial migration | 🔲 | DB | sonnet |
| 0.4 | Initialize backend with health check endpoint | 🔲 | Backend | sonnet |
| 0.5 | Initialize frontend with routing | 🔲 | Frontend | sonnet |
| 0.6 | Configure CI pipeline | 🔲 | DevOps | sonnet |
| 0.7 | Create initial seed data | 🔲 | DB | haiku |
| 0.8 | Validate full stack works locally | 🔲 | QA | sonnet |

### Definition of Done
- [ ] `docker-compose up` runs successfully
- [ ] Frontend shows welcome page
- [ ] Backend responds to /health
- [ ] Database has tables
- [ ] CI runs and passes
```

### Feature Sprints

Regular sprints that deliver user-facing features.

```markdown
## 🔲 Sprint 3: User Authentication — PLANNED

**Goal:** Users can register, login, and manage their accounts

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 3.1 | Create users table migration | 🔲 | DB | haiku |
| 3.2 | Implement password hashing utility | 🔲 | Backend | sonnet |
| 3.3 | Create POST /auth/register endpoint | 🔲 | Backend | sonnet |
| 3.4 | Create POST /auth/login endpoint | 🔲 | Backend | sonnet |
| 3.5 | Implement JWT token generation | 🔲 | Backend | sonnet |
| 3.6 | Create auth middleware | 🔲 | Backend | sonnet |
| 3.7 | Build RegistrationForm component | 🔲 | Frontend | sonnet |
| 3.8 | Build LoginForm component | 🔲 | Frontend | sonnet |
| 3.9 | Create authStore for state management | 🔲 | Frontend | sonnet |
| 3.10 | Wire up protected routes | 🔲 | Frontend | sonnet |
| 3.11 | Write auth API tests | 🔲 | QA | sonnet |
| 3.12 | Write auth component tests | 🔲 | QA | sonnet |

### Dependencies
- Sprint 0 complete
- Sprint 1 (if exists) complete

### Definition of Done
- [ ] User can register with email/password
- [ ] User can login and receive token
- [ ] Protected routes require auth
- [ ] All tests pass (12/12)
```

### Business Sprints

Non-code sprints for planning and strategy.

```markdown
## 🔲 Sprint B: Business Planning — PLANNED

**Goal:** Complete investor-ready business documentation

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| B.1 | Complete SWOT analysis | 🔲 | Business | sonnet |
| B.2 | Research TAM/SAM/SOM | 🔲 | Marketing | sonnet |
| B.3 | Create 5-year financial projection | 🔲 | Finance | opus |
| B.4 | Design pricing strategy | 🔲 | Finance | sonnet |
| B.5 | Draft pitch deck | 🔲 | Business | opus |
```

### QA Sprints

Dedicated quality assurance sprints.

```markdown
## 🔲 Sprint QA1: Pre-Launch Quality Pass — PLANNED

**Goal:** Ensure production readiness

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| QA1.1 | Full regression test suite | 🔲 | QA | opus |
| QA1.2 | Performance testing | 🔲 | QA | sonnet |
| QA1.3 | Security audit | 🔲 | QA | opus |
| QA1.4 | Accessibility review | 🔲 | QA | sonnet |
| QA1.5 | Fix critical issues found | 🔲 | Full Stack | sonnet |
```

---

## Managing Sprint Progress

### Starting a Sprint

1. **Copy template** to backlog if not already there
2. **Review dependencies** - ensure predecessors complete
3. **Validate tickets** - each should be actionable
4. **Generate sprint prompt** - for AI execution
5. **Mark sprint ACTIVE**

### During a Sprint

1. **Pick ticket** - select 🔲 Todo ticket
2. **Mark In Progress** - update to 🔄
3. **Execute** - implement per specs
4. **Mark QA Review** - update to 🧪 when code complete
5. **Run QA** - test and verify
6. **Mark Done** - update to ✅

### Completing a Sprint

1. **Verify all ✅ Done** - no tickets left behind
2. **Update sprint state** - change to COMPLETE
3. **Create sprint docs** - summary, QA results, release notes
4. **Commit changes** - with sprint completion message
5. **Start next sprint** - if applicable

---

## Dependency Management

### Sprint Dependencies

```markdown
### Dependencies
- Sprint 2: User Management complete
- Sprint 3: Database migrations complete
```

Sprint doesn't start until dependencies are complete.

### Ticket Dependencies

Within a sprint, use ordering and notes:

```markdown
| 4.1 | Create sessions table | 🔲 | DB | haiku |
| 4.2 | Create SessionService (needs 4.1) | 🔲 | Backend | sonnet |
| 4.3 | Build SessionPage (needs 4.2) | 🔲 | Frontend | sonnet |
```

Or explicit dependency notes:

```markdown
| 4.3 | Build SessionPage | 🔲 | Frontend | sonnet |

> Note: 4.3 depends on 4.2 API being complete
```

### Handling Blockers

When a ticket is blocked:

```markdown
| 4.5 | Integrate payment gateway | ⏸️ Blocked | Backend | opus |

> Blocked: Waiting for Stripe API keys from finance team
```

Create follow-up ticket or track externally.

---

## Sprint Metrics

Track these for continuous improvement:

| Metric | Formula | Target |
|--------|---------|--------|
| Velocity | Tickets completed / Sprint | Consistent |
| Completion Rate | Done / Total tickets | > 90% |
| Blocked Rate | Blocked / Total tickets | < 5% |
| QA Pass Rate | First-pass passes / Total | > 80% |
| Sprint Duration | Days start to complete | As planned |

---

## Common Backlog Anti-Patterns

### 1. Zombie Tickets

Tickets that never complete, just roll forward.

**Fix:** Redefine scope, split into smaller pieces, or drop.

### 2. Scope Creep

Adding tickets mid-sprint.

**Fix:** New work goes to next sprint unless critical bug.

### 3. Ticket Pile-Up

100+ tickets in backlog, no progress visible.

**Fix:** Prune aggressively. If it won't happen in 3 sprints, archive it.

### 4. No QA Phase

Tickets go directly from In Progress to Done.

**Fix:** Enforce 🧪 QA Review as mandatory step.

### 5. Missing Model Assignment

Tickets without model specified.

**Fix:** Always specify. Default to `sonnet` if unsure.

---

## Backlog Maintenance

### Weekly Review

- Remove obsolete tickets
- Re-estimate if scope changed
- Update dependencies
- Groom next sprint

### Sprint Retrospective

After each sprint:

- What went well?
- What didn't?
- What should change?

Update methodology based on learnings.

---

## Next Steps

- [05_multi_agent.md](./05_multi_agent.md) - Parallel execution strategies
- [06_qa_methodology.md](./06_qa_methodology.md) - Quality assurance
- [Templates](../../templates/specs/backlog.template.md) - Backlog template
