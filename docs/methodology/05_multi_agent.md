# Multi-Agent Execution: Parallel AI Development

**Version:** 1.0
**Last Updated:** 2026-01-21

---

## Why Multi-Agent?

Single-agent development is a bottleneck. While one agent implements an API endpoint, another could be building the UI component that will use it. Multi-agent execution:

- **Doubles (or more) velocity** - Parallel work streams
- **Reduces context switching** - Each agent stays focused
- **Leverages specialization** - Backend agent has backend context
- **Optimizes costs** - Match model to task complexity

---

## The Agent A/B Pattern

The simplest and most effective pattern: two agents working in parallel.

```
┌─────────────────────────────────────────────────────────────────┐
│                    AGENT A/B PATTERN                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   ┌─────────────┐                    ┌─────────────┐            │
│   │   AGENT A   │                    │   AGENT B   │            │
│   │  (Backend)  │                    │ (Frontend)  │            │
│   └──────┬──────┘                    └──────┬──────┘            │
│          │                                  │                    │
│          ▼                                  ▼                    │
│   ┌─────────────┐                    ┌─────────────┐            │
│   │ 4.1 DB      │                    │ 4.2 Store   │            │
│   │ Migration   │                    │ Setup       │            │
│   └──────┬──────┘                    └──────┬──────┘            │
│          │                                  │                    │
│          ▼                                  ▼                    │
│   ┌─────────────┐                    ┌─────────────┐            │
│   │ 4.3 API     │───── SYNC ────────►│ 4.4 API    │            │
│   │ Endpoint    │     POINT          │ Integration │            │
│   └──────┬──────┘                    └──────┬──────┘            │
│          │                                  │                    │
│          ▼                                  ▼                    │
│   ┌─────────────┐                    ┌─────────────┐            │
│   │ 4.5 Tests   │                    │ 4.6 UI      │            │
│   │             │                    │ Components  │            │
│   └─────────────┘                    └─────────────┘            │
│                                                                  │
│                    ┌─────────────┐                              │
│                    │   AGENT C   │                              │
│                    │    (QA)     │                              │
│                    └──────┬──────┘                              │
│                           │                                      │
│                           ▼                                      │
│                    ┌─────────────┐                              │
│                    │ 4.7 QA All  │                              │
│                    │             │                              │
│                    └─────────────┘                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Setting Up Agent A/B

### Environment: VSCode with GitHub Copilot

1. **Open two Copilot Chat windows**
   - View → Command Palette → "GitHub Copilot: New Chat"
   - Repeat for second window

2. **Position side by side**
   - Drag one chat to right panel
   - Keep one in left panel

3. **Initialize with role prompts**

**Agent A (Left - Backend):**
```
You are Agent A - Backend Lead for this sprint.

Project: [Project Name]
Sprint: [Sprint Number]
Your tickets: [List of backend tickets]

Read these specs before starting:
- specs/02_backend_lead.md
- specs/04_db_architect.md
- specs/backlog.md (Sprint X section)

Execute tickets in order. Update backlog.md status as you work:
- 🔲 → 🔄 when starting
- 🔄 → 🧪 when code complete

Do NOT work on frontend tickets - Agent B handles those.
```

**Agent B (Right - Frontend):**
```
You are Agent B - Frontend Lead for this sprint.

Project: [Project Name]
Sprint: [Sprint Number]
Your tickets: [List of frontend tickets]

Read these specs before starting:
- specs/03_frontend_lead.md
- specs/backlog.md (Sprint X section)

Execute tickets in order. Update backlog.md status as you work:
- 🔲 → 🔄 when starting
- 🔄 → 🧪 when code complete

Do NOT work on backend tickets - Agent A handles those.

NOTE: Ticket 4.4 requires 4.3 API from Agent A. Start with 4.2 while waiting.
```

### Environment: Claude Code CLI

1. **Open two terminal windows/tabs**

2. **Start Claude in each**
   ```bash
   # Terminal 1 - Agent A
   claude

   # Terminal 2 - Agent B
   claude
   ```

3. **Initialize with prompts** (same as above)

### Environment: JetBrains with AI Assistant

1. **Open AI Assistant in two tool windows**
   - View → Tool Windows → AI Assistant
   - Right-click tab → Split Right

2. **Start new conversations in each**

3. **Initialize with role prompts**

---

## Sync Points

Agents must sync at dependency boundaries.

### Identifying Sync Points

Look for tickets where one agent's output is another's input:

```markdown
| 4.3 | Create GET /api/users endpoint | Backend |  ← Agent A
| 4.4 | Integrate user API in UserList | Frontend | ← Agent B (needs 4.3)
```

### Handling Sync Points

**Option 1: Sequential at Boundaries**

Agent B works on non-dependent tickets while waiting:

```
Agent A: 4.1 → 4.3 → 4.5
Agent B: 4.2 → (wait for 4.3) → 4.4 → 4.6

Parallel timeline:
A: [4.1][4.3][4.5]
B: [4.2]--[4.4][4.6]
```

**Option 2: Mock-First Development**

Agent B uses mocks, replaces with real API later:

```typescript
// Agent B starts with mock
const mockUsers = [{ id: 1, name: 'Test' }];
const users = USE_MOCKS ? mockUsers : await fetchUsers();

// Later: Remove mock when Agent A completes 4.3
```

**Option 3: Contract-First**

Both agents agree on API shape before implementing:

```typescript
// API Contract (from spec)
interface UsersResponse {
  users: Array<{ id: string; email: string; name: string }>;
  total: number;
}

// Agent A implements to this contract
// Agent B consumes this contract
```

---

## Agent Specialization Patterns

### Pattern 1: Layer Split (Most Common)

```
Agent A: Backend + Database
Agent B: Frontend
Agent C: QA (joins after implementation)
```

**Best for:** Standard web applications

### Pattern 2: Feature Split

```
Agent A: Feature X (full stack)
Agent B: Feature Y (full stack)
Agent C: Feature Z (full stack)
```

**Best for:** Independent features with minimal overlap

### Pattern 3: Research + Implementation

```
Agent A (Opus): Research, architecture, complex decisions
Agent B (Sonnet): Implementation based on A's decisions
Agent C (Haiku): Repetitive tasks, configs, simple code
```

**Best for:** Novel problems requiring exploration

### Pattern 4: Code + QA

```
Agent A: Write code
Agent B: Write tests for Agent A's code
```

**Best for:** Ensuring comprehensive test coverage

---

## Sprint Prompt Templates for Multi-Agent

### Sprint Prompt: Agent A (Backend)

```markdown
**Starting Sprint [X]: [Name] - Agent A (Backend)**

Read `specs/backlog.md` for full context.

## Your Role
You are Agent A - Backend Lead responsible for server-side implementation.

## Your Tickets
| # | Ticket | Status | Model |
|---|--------|--------|-------|
| X.1 | [Description] | 🔲 | [model] |
| X.3 | [Description] | 🔲 | [model] |
| X.5 | [Description] | 🔲 | [model] |

## Specs to Read
- specs/02_backend_lead.md - API patterns
- specs/04_db_architect.md - Database schema
- specs/backlog.md - Full sprint context

## Execution Rules
1. Update backlog status as you work
2. Run `npm test` after each ticket
3. Commit after each ticket with message: "Complete X.Y: [description]"
4. Do NOT touch frontend code (Agent B's domain)

## Sync Points
- After X.3: Notify that API is ready for Agent B's X.4

## Starting Command
Begin with ticket X.1. Read the spec, update status to 🔄, implement, test, update to 🧪.
```

### Sprint Prompt: Agent B (Frontend)

```markdown
**Starting Sprint [X]: [Name] - Agent B (Frontend)**

Read `specs/backlog.md` for full context.

## Your Role
You are Agent B - Frontend Lead responsible for UI implementation.

## Your Tickets
| # | Ticket | Status | Model |
|---|--------|--------|-------|
| X.2 | [Description] | 🔲 | [model] |
| X.4 | [Description - needs X.3] | 🔲 | [model] |
| X.6 | [Description] | 🔲 | [model] |

## Specs to Read
- specs/03_frontend_lead.md - Component patterns
- specs/backlog.md - Full sprint context

## Execution Rules
1. Update backlog status as you work
2. Run `npm test` after each ticket
3. Commit after each ticket
4. Do NOT touch backend code (Agent A's domain)

## Sync Points
- X.4 requires X.3 API from Agent A
- Start with X.2 while waiting for X.3
- Check if X.3 shows ✅ before starting X.4

## Starting Command
Begin with ticket X.2 (no dependencies). Read the spec, update status, implement.
```

---

## Coordination Strategies

### Strategy 1: Human Coordinator

You monitor both agents and manage sync points.

```
You: "Agent A, start Sprint 4 tickets"
Agent A: [Works on 4.1, 4.3]
You: "Agent A completed 4.3. Agent B, you can start 4.4"
Agent B: [Starts 4.4]
```

**Pros:** Full control, handle edge cases
**Cons:** Your time required

### Strategy 2: File-Based Coordination

Agents check backlog.md before dependent work.

```markdown
// Agent B's instruction:
Before starting 4.4, check if 4.3 shows ✅ in backlog.md.
If not, work on another ticket or wait.
```

**Pros:** Automated coordination
**Cons:** Agents must re-check file

### Strategy 3: Handoff Messages

Agents write coordination notes.

```markdown
// coordination.md
## Agent A Notes
- 10:30: Started 4.1
- 11:00: Completed 4.1, starting 4.3
- 11:45: 4.3 COMPLETE - API ready at GET /api/users

## Agent B Notes
- 10:30: Started 4.2
- 11:30: Completed 4.2, checking for 4.3...
- 11:46: Saw 4.3 complete, starting 4.4
```

**Pros:** Full visibility
**Cons:** Extra file to manage

---

## Conflict Resolution

### File Conflicts

When agents modify the same file (should be rare with good splits):

1. **Prevention:** Assign files to one agent
2. **Detection:** Git will show conflicts
3. **Resolution:** Human review, merge manually

### Backlog Conflicts

Both agents update backlog.md:

1. **Prevention:** Each agent only updates their tickets
2. **Detection:** Git merge conflict
3. **Resolution:** Accept both changes (different lines)

### Architecture Conflicts

Agents make incompatible decisions:

1. **Prevention:** Detailed specs with explicit patterns
2. **Detection:** Integration testing fails
3. **Resolution:** Revert to spec, have human decide

---

## Model Assignment for Multi-Agent

Match models to agent roles:

| Agent Role | Recommended Model | Reason |
|------------|-------------------|--------|
| Backend Lead | Sonnet | Standard complexity |
| Frontend Lead | Sonnet | Standard complexity |
| DB Architect | Haiku | Schema work is templated |
| QA Lead | Sonnet | Test logic requires reasoning |
| Research/Architecture | Opus | Complex decisions |
| Config/Setup | Haiku | Repetitive, pattern-based |

### Cost Example

Sprint with 12 tickets:

**Single Opus Agent:**
- 12 tickets × Opus rate = $$$

**Multi-Agent (Optimized):**
- 4 tickets (haiku) × Haiku rate = $
- 6 tickets (sonnet) × Sonnet rate = $$
- 2 tickets (opus) × Opus rate = $$
- **Total: ~40% less**

---

## Environment-Specific Setup

### VSCode + GitHub Copilot

```
┌─────────────────────────────────────────────┐
│ VSCode                                       │
├─────────────────┬───────────────────────────┤
│ Copilot Chat    │ Copilot Chat              │
│ (Agent A)       │ (Agent B)                 │
│                 │                           │
│ Backend focus   │ Frontend focus            │
│                 │                           │
├─────────────────┴───────────────────────────┤
│ Editor (shared workspace)                   │
└─────────────────────────────────────────────┘
```

### Terminal + Claude Code

```bash
# Terminal layout (tmux or split terminals)
┌─────────────────┬───────────────────────────┐
│ claude (A)      │ claude (B)                │
│                 │                           │
│ Backend agent   │ Frontend agent            │
└─────────────────┴───────────────────────────┘
```

### JetBrains + AI Assistant

```
┌─────────────────────────────────────────────┐
│ IntelliJ/WebStorm                           │
├─────────────────┬───────────────────────────┤
│ AI Assistant    │ AI Assistant              │
│ (Agent A)       │ (Agent B)                 │
└─────────────────┴───────────────────────────┘
```

---

## Troubleshooting

### Agent Goes Off-Script

**Symptom:** Agent starts working on wrong tickets.

**Fix:** Restart with clearer prompt, explicit ticket list.

### Agents Conflict

**Symptom:** Both agents modify same file.

**Fix:** Review ticket assignment, ensure clear boundaries.

### Agent Stuck Waiting

**Symptom:** Agent B blocked on Agent A indefinitely.

**Fix:**
- Check Agent A's progress
- Give Agent B independent work
- Consider mock-first approach

### Inconsistent Progress

**Symptom:** Backlog shows wrong statuses.

**Fix:**
- Have agents re-read backlog
- Human intervention to sync state
- Use coordination file

---

## Best Practices Summary

1. **Clear boundaries** - Each agent owns specific tickets
2. **Explicit sync points** - Document dependencies
3. **Parallel-first** - Design sprints for parallelization
4. **Model matching** - Use right model for task complexity
5. **Human oversight** - Check in regularly, resolve conflicts
6. **Commit often** - Small commits avoid merge hell
7. **Test after each ticket** - Catch issues early

---

## Next Steps

- [06_qa_methodology.md](./06_qa_methodology.md) - How QA agent reviews work
- [07_model_selection.md](./07_model_selection.md) - Cost optimization
- [Environment Guides](../environments/) - Platform-specific setup
