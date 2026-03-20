---
title: "10. Orchestrator + Agent Execution Pattern"
sprint: "0.7"
created: "2026-03-09"
---

# Orchestrator + Agent Execution Pattern

## Overview

AutoSpec uses a two-tier AI execution model for sprint development:

- **Opus 4.6 Orchestrator** — high-level planning, briefing writing, result review
- **Sonnet 4.6 Sprint Agents** — implementation, focused execution

This keeps the orchestrator's context clean (no implementation details) while giving agents rich, precise context packages.

## Why This Pattern

Without structure, AI agents in long conversations suffer from:
- Context drift (forgets conventions from turn 1 by turn 50)
- Hallucinated values (invents hex colors, API paths, file names)
- Sequential bottleneck (no parallelism)

The briefing file pattern solves all three:
- Conventions are re-stated in every brief (no drift)
- Exact values are copy-pasted into the brief (no hallucination)
- Independent sprints get separate agents (full parallelism)

## Execution Flow

```
Turn 1: User approves plan
Turn 2: Opus writes agents/sprint-0-brief.md
        Opus spawns Agent(sonnet-4.6, sprint-0-brief.md)
Turn 3: Sonnet executes Sprint 0 → reports results
Turn 4: Opus reviews, writes sprint-1-brief.md
        Opus spawns Agent(sonnet-4.6, sprint-1-brief.md)
Turn 5: Sonnet executes Sprint 1 → viewer scaffold done
Turn 6: Opus spawns 3 PARALLEL agents in ONE message:
        Agent A: sprint-2-brief.md (Docs/Specs/Backlog pages)
        Agent B: sprint-3-brief.md (Skills/Environments/Charts)
        Agent C: sprint-4-brief.md (CLI/QUICKSTART)
Turn 7: All 3 return → Opus merges
Turn 8: Opus spawns sprint-5-brief.md (Polish/Launch)
```

## Agent Briefing File Format

Location: `agents/sprint-X-brief.md`

Required sections:
1. **Agent + Sprint metadata** — model, sprint number, dependencies
2. **Tickets to execute** — ordered list from specs/backlog.md
3. **Key source files** — exact paths to read before implementing
4. **Code snippets** — exact values (no hallucination possible)
5. **Conventions** — forbidden patterns, required patterns
6. **Verification checklist** — what must be true for sprint to be "done"

## How to Spawn an Agent

```javascript
// In Opus orchestrator turn:
Agent({
  subagent_type: "general-purpose",
  description: "Sprint 1: viewer scaffold",
  isolation: "worktree",  // or omit for direct main
  prompt: `
    Read /opt/FitnessAiManager/autospec/agents/sprint-1-brief.md first.
    Execute all tickets in order.
    Update specs/backlog.md as you complete each ticket.
    Create sprints/sprint-1/summary.md when done.
    Return the summary contents when complete.
  `
})
```

## Parallelism Rules

| Sprint | Depends on | Can parallelize with |
|--------|-----------|---------------------|
| 0 | Nothing | Serial (first) |
| 1 | 0 complete | Serial after 0 |
| 2 | 1 complete | 3, 4 |
| 3 | 1 complete | 2, 4 |
| 4 | 0 complete | 2, 3 |
| 5 | 1–4 complete | Serial (last) |

## Embedding in Generated Projects

When `autospec init` generates a new project, its `skills/claude/sprint-run.md` includes this pattern in Phase 2. The generated `CLAUDE.md` includes the Orchestrator rules section.

See: `cli/src/generators/viewer-prompt.generator.ts` for how this is embedded in viewer generation prompts.
