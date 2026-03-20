# Model Selection: FinOps-Optimized AI Development

**Version:** 1.0
**Last Updated:** 2026-01-21

---

## The Cost Problem

AI-assisted development is powerful but expensive. Using premium models for every task is wasteful:

| Model | Relative Cost | Capability |
|-------|---------------|------------|
| GPT-4/Claude Opus | 10x | Best reasoning |
| GPT-3.5/Claude Sonnet | 3x | Good for most tasks |
| Claude Haiku | 1x | Fast, simple tasks |

**Insight:** 70% of development tasks don't need premium models.

---

## The Model Selection Framework

### Decision Tree

```
                        ┌─────────────────┐
                        │ What's the task?│
                        └────────┬────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │ Simple/Repetitive│ │ Standard Logic  │ │ Complex/Novel   │
    │                 │ │                 │ │                 │
    │ • Config files  │ │ • Services      │ │ • Architecture  │
    │ • Migrations    │ │ • Components    │ │ • Security      │
    │ • Seeds         │ │ • Tests         │ │ • Debugging     │
    │ • CRUD          │ │ • APIs          │ │ • Research      │
    └────────┬────────┘ └────────┬────────┘ └────────┬────────┘
             │                   │                   │
             ▼                   ▼                   ▼
    ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
    │     HAIKU       │ │     SONNET      │ │      OPUS       │
    │   (40% tasks)   │ │   (45% tasks)   │ │   (15% tasks)   │
    │   Cheapest      │ │   Balanced      │ │   Most capable  │
    └─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## Model Characteristics

### Haiku (Claude) / GPT-3.5-Turbo (OpenAI)

**Strengths:**
- Very fast response time
- Lowest cost
- Good at following patterns
- Handles repetitive tasks well

**Weaknesses:**
- May miss edge cases
- Limited reasoning depth
- Can struggle with complex logic

**Best For:**
| Task Type | Example |
|-----------|---------|
| Database migrations | CREATE TABLE with defined schema |
| Seed scripts | Generate sample data |
| Config files | docker-compose, .env templates |
| Simple CRUD | Basic endpoints with no logic |
| Boilerplate | File structure, imports |
| Documentation | JSDoc, README sections |

### Sonnet (Claude) / GPT-4-Turbo (OpenAI)

**Strengths:**
- Good balance of speed and capability
- Handles most production code well
- Strong at following patterns
- Reliable for standard tasks

**Weaknesses:**
- May not catch subtle issues
- Less creative problem-solving
- Can miss optimization opportunities

**Best For:**
| Task Type | Example |
|-----------|---------|
| Services | Business logic implementation |
| Controllers | Request handling with validation |
| Components | React/Vue components with state |
| API endpoints | Full REST implementation |
| Unit tests | Comprehensive test coverage |
| Integration code | Third-party API integration |

### Opus (Claude) / GPT-4 (OpenAI)

**Strengths:**
- Best reasoning capability
- Catches edge cases
- Creative problem-solving
- Deep understanding of context

**Weaknesses:**
- Slowest response time
- Highest cost
- Overkill for simple tasks

**Best For:**
| Task Type | Example |
|-----------|---------|
| Architecture | System design decisions |
| Security code | Auth, encryption, sensitive data |
| Complex algorithms | State machines, data processing |
| Debugging | Finding root cause of issues |
| Research | Evaluating options, trade-offs |
| Code review | Catching subtle bugs |

---

## Ticket-to-Model Mapping

### By Ticket Type

| Ticket Pattern | Model | Rationale |
|----------------|-------|-----------|
| Create [table] migration | haiku | Schema from spec, no logic |
| Implement [CRUD] endpoint | sonnet | Standard pattern + validation |
| Build [component] | sonnet | UI logic, state management |
| Write tests for [feature] | sonnet | Requires understanding logic |
| Design [architecture] | opus | Complex decisions, trade-offs |
| Debug [issue] | opus | Root cause analysis |
| Research [options] | opus | Evaluation, recommendations |
| Create seed data | haiku | Data generation, no logic |
| Add [config] file | haiku | Following templates |
| Implement [complex feature] | opus | Novel logic, edge cases |

### By Owner Role

| Role | Default Model | Upgrade To |
|------|---------------|------------|
| DB Architect | haiku | sonnet (complex schemas) |
| Backend Lead | sonnet | opus (security, payments) |
| Frontend Lead | sonnet | opus (complex state) |
| QA Lead | sonnet | opus (integration tests) |
| DevOps Lead | haiku | sonnet (CI/CD logic) |

---

## Sprint Model Distribution

### Recommended Distribution

```
┌────────────────────────────────────────┐
│        SPRINT MODEL DISTRIBUTION       │
├────────────────────────────────────────┤
│                                         │
│  ████████████████░░░░░░░░░░░░ Haiku 40%│
│  █████████████████████████░░░ Sonnet 45%│
│  ██████░░░░░░░░░░░░░░░░░░░░░ Opus  15%│
│                                         │
└────────────────────────────────────────┘
```

### Example Sprint Breakdown

```markdown
## Sprint 4: Session Management (20 tickets)

| # | Ticket | Model | Cost Tier |
|---|--------|-------|-----------|
| 4.1 | Create sessions table | haiku | $ |
| 4.2 | Create session_items table | haiku | $ |
| 4.3 | Implement SessionService | sonnet | $$ |
| 4.4 | Implement SessionRepository | sonnet | $$ |
| 4.5 | Create POST /sessions endpoint | sonnet | $$ |
| 4.6 | Create GET /sessions/:id endpoint | sonnet | $$ |
| 4.7 | Add session caching | sonnet | $$ |
| 4.8 | Build SessionPage component | sonnet | $$ |
| 4.9 | Build SessionCard component | sonnet | $$ |
| 4.10 | Implement session state machine | opus | $$$ |
| 4.11 | Add real-time session updates | opus | $$$ |
| 4.12 | Write SessionService tests | sonnet | $$ |
| 4.13 | Write session API tests | sonnet | $$ |
| 4.14 | Write SessionPage tests | sonnet | $$ |
| 4.15 | Create session seed data | haiku | $ |
| 4.16 | Add session config | haiku | $ |
| 4.17 | Design session analytics | opus | $$$ |
| 4.18 | Document session API | haiku | $ |
| 4.19 | QA review all tickets | sonnet | $$ |
| 4.20 | Final integration test | sonnet | $$ |

Distribution: 6 haiku (30%) | 11 sonnet (55%) | 3 opus (15%)
```

---

## Cost Optimization Strategies

### 1. Batch Similar Tasks

Instead of:
```
Ticket 1 (haiku): Create users table
Ticket 2 (haiku): Create profiles table
Ticket 3 (haiku): Create sessions table
```

Do:
```
Ticket 1 (haiku): Create database migrations (users, profiles, sessions)
```

**Savings:** Reduced context overhead.

### 2. Start Simple, Escalate

```
1. Try haiku first
2. If result inadequate, retry with sonnet
3. Only use opus if sonnet fails
```

**Tip:** For ambiguous tasks, start cheap.

### 3. Use Opus for Planning Only

```
Opus: "Design the architecture for session management"
       → Output: Design document with implementation steps

Sonnet: "Implement step 1 per the design"
        → Output: Actual code
```

**Savings:** Opus does thinking, sonnet does coding.

### 4. Cache and Reuse

If you've done a task before:
```
Previous sprint: Implemented auth middleware (sonnet)
This sprint: Implement rate limiting middleware (haiku - follow pattern)
```

**Savings:** Patterns reduce complexity.

---

## Model Assignment in Backlog

### Format

```markdown
| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 4.1 | Create sessions table | 🔲 | DB | haiku |
| 4.2 | Implement SessionService | 🔲 | Backend | sonnet |
| 4.3 | Design session state machine | 🔲 | Backend | opus |
```

### When to Override

| Situation | Override |
|-----------|----------|
| First implementation of pattern | ↑ upgrade |
| Following established pattern | ↓ downgrade |
| Security/payment related | ↑ always opus |
| Simple but critical | ↑ sonnet minimum |
| POC/experimental | ↓ haiku is fine |

---

## Multi-Model Agent Strategy

### Pattern: Tiered Agents

```
┌──────────────────────────────────────────────────┐
│               TIERED AGENT PATTERN               │
├──────────────────────────────────────────────────┤
│                                                  │
│   ┌─────────────┐                               │
│   │ OPUS Agent  │ ◄── Architecture decisions    │
│   │ (Architect) │     Complex debugging         │
│   └──────┬──────┘     Security review           │
│          │                                       │
│          ▼ designs/specs                         │
│   ┌─────────────┐                               │
│   │SONNET Agent │ ◄── Implementation            │
│   │ (Builder)   │     Standard features         │
│   └──────┬──────┘     Tests                     │
│          │                                       │
│          ▼ patterns established                  │
│   ┌─────────────┐                               │
│   │ HAIKU Agent │ ◄── Repetitive tasks          │
│   │ (Worker)    │     Config files              │
│   └─────────────┘     Seeds, migrations         │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Implementation

**Step 1:** Opus designs the feature
```
Agent (Opus): "Design the authentication system architecture"
Output: Architecture document with components and patterns
```

**Step 2:** Sonnet implements core logic
```
Agent (Sonnet): "Implement auth service per the architecture"
Output: Working auth service code
```

**Step 3:** Haiku handles boilerplate
```
Agent (Haiku): "Create user migration following project patterns"
Output: Migration file
```

---

## Measuring Cost Effectiveness

### Track Per Sprint

| Sprint | Haiku % | Sonnet % | Opus % | Est. Cost | Actual Cost |
|--------|---------|----------|--------|-----------|-------------|
| 1 | 35% | 50% | 15% | $X | $Y |
| 2 | 40% | 45% | 15% | $X | $Y |
| 3 | 45% | 45% | 10% | $X | $Y |

### Optimization Indicators

| Metric | Target | Action if Exceeded |
|--------|--------|-------------------|
| Opus usage | < 20% | Review if tasks need complexity |
| Haiku success rate | > 90% | If lower, tasks may need sonnet |
| Retry rate | < 10% | If higher, upgrade initial models |
| Cost per ticket | Baseline | Compare sprint over sprint |

---

## Model Selection by Platform

### Claude (Anthropic)

| Model | Use For |
|-------|---------|
| claude-3-opus | Complex reasoning, architecture |
| claude-3-sonnet | Standard development |
| claude-3-haiku | Simple, fast tasks |

### OpenAI

| Model | Use For |
|-------|---------|
| gpt-4 | Complex reasoning |
| gpt-4-turbo | Standard development |
| gpt-3.5-turbo | Simple, fast tasks |

### GitHub Copilot

| Mode | Use For |
|------|---------|
| Full context | Complex, multi-file |
| Inline completion | Simple additions |

---

## Common Mistakes

### 1. "Just Use Opus for Everything"

**Problem:** 10x cost for marginal improvement on simple tasks.

**Fix:** Reserve opus for genuinely complex work.

### 2. "Haiku Can Do It"

**Problem:** Multiple retries and fixes cost more than sonnet once.

**Fix:** If task has business logic, start with sonnet.

### 3. "No Model Specified"

**Problem:** Unpredictable costs, inconsistent quality.

**Fix:** Always specify model in ticket.

### 4. "Same Model for Whole Sprint"

**Problem:** Either overpaying or under-delivering.

**Fix:** Match each ticket to appropriate model.

---

## Quick Reference

### When to Use Haiku
- [ ] Task follows established pattern
- [ ] No business logic involved
- [ ] Output is mostly boilerplate
- [ ] Schema/structure already defined

### When to Use Sonnet
- [ ] Standard business logic
- [ ] New feature following patterns
- [ ] Tests with some complexity
- [ ] Most UI components

### When to Use Opus
- [ ] Novel problem, no pattern
- [ ] Security-critical code
- [ ] Complex state management
- [ ] Debugging mysterious issues
- [ ] Architecture decisions

---

## Next Steps

- [Backlog Management](./04_backlog_management.md) - Assign models to tickets
- [Multi-Agent](./05_multi_agent.md) - Combine models effectively
- [Templates](../../templates/specs/backlog.template.md) - Model column included
