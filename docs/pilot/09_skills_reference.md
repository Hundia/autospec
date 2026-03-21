---
title: Skills Reference
created: 2026-03-21
sprint: 34
status: complete
---

# Skills Reference

Complete reference for the 11 SDD (Spec-Driven Development) skills available in AutoSpec, including how to invoke them via Claude Pilot.

---

## Overview

**SDD skills** are prompt-level instruction files that tell Claude Code how to behave when you invoke a slash command. Each skill is a Markdown document in `skills/claude/` that contains phases, rules, output formats, and execution patterns.

When you type `/sprint-run 7` in Claude Code, the `sprint-run.md` skill is loaded as an instruction set. Claude reads the phases, follows the rules, and executes the entire sprint lifecycle — plan, implement, QA, document, close.

**How skills work:**

```
User: /sprint-run 7
  → Claude Code loads skills/claude/sprint-run.md
  → Claude follows the phases defined in the file
  → Claude uses its tools (Read, Write, Bash, Agent) to implement each phase
  → Claude reports results back
```

Skills are plain Markdown — they contain no code that "runs". They are instruction manuals for Claude. This means:
- Any AI provider that can read and follow instructions can use them
- The quality of execution depends on the model's reasoning capability
- Multi-agent orchestration (spawning sub-agents) requires Claude's `Agent` tool

**Running skills via Pilot:**

Rather than typing slash commands manually in Claude Code, you can trigger skills through the Pilot daemon:

```bash
pilot start "<task description>" --skill <skill-name> --name <session-name>
```

Pilot starts a Claude Code session, injects the skill, and manages the session lifecycle (notifications, approvals, logs).

---

## All Skills

| Skill | Command | Description | Typical Usage | Est. Duration |
|-------|---------|-------------|---------------|---------------|
| **sprint-run** | `/sprint-run [N]` | Execute an entire sprint end-to-end: plan → implement → QA → docs → close using Orchestrator + Sonnet agent pattern | Running a planned sprint from backlog | 30–90 min |
| **plan-sprint** | `/plan-sprint [goal]` | Assemble expert AI agents (Architect, UX/UI, DB, HX) in parallel, then three PM agents (draft → review → finalize) to produce a backlog-ready sprint plan | Planning a new sprint before building | 10–20 min |
| **execute-ticket** | `/execute-ticket [X.Y]` | Execute a single backlog ticket: check deps, read docs, implement, QA, update docs, mark done | Working through one ticket at a time | 5–20 min |
| **sprint-status** | `/sprint-status [N\|all]` | Display sprint progress with health indicators (🟢🟡🔴), ticket breakdown, FinOps model distribution, and next actions | Checking in on an active sprint | < 1 min |
| **sprint-close** | `/sprint-close [N]` | Verify sprint is complete, generate `sprints/sprint_N/summary.md` with docs linkage, update viewer data, recommend git tag | Closing a finished sprint | 5–10 min |
| **update-backlog** | `/update-backlog [action]` | Modify ticket statuses, add new tickets, report bugs (B.XX), add notes, or link documentation to tickets | Ongoing backlog maintenance | < 1 min |
| **create-spec** | `/create-spec [name]` | Generate a new feature specification (vision, requirements, schema, API endpoints, components, security) and suggest initial sprint tickets | Starting a new feature from scratch | 5–15 min |
| **create-sprint-docs** | `/create-sprint-docs [N]` | Generate three sprint documents: `summary.md`, `qa-results.md`, and `release-notes.md` in `sprints/sprint-XX-name/` | Producing documentation after a sprint completes | 5–10 min |
| **qa-review** | `/qa-review [X.Y\|sprint N]` | Run QA review on a ticket or all 🧪 QA Review tickets in a sprint: code quality, tests, functionality, security, docs checklist | Final quality gate before marking done | 5–15 min |
| **plan-presentation** | `/plan-presentation [description]` | Plan and implement a new presentation slide using parallel agent team (Layout, Visualization, Data, Integration agents) | Adding or overhauling a slide in the AutoSpec presentation | 15–30 min |
| **help** | `/help` | Display all available commands with descriptions, workflow guidance, and key file references | Quick reference / onboarding | Instant |

---

## Using Skills with Pilot

Instead of manually opening Claude Code and typing commands, Pilot can orchestrate skill execution as managed sessions:

### Run a full sprint

```bash
pilot start "Sprint 7" --skill sprint-run --name sprint-7
```

Pilot starts Claude Code with the `sprint-run` skill, passes "7" as the argument, and monitors the session. You receive a WhatsApp notification when the sprint completes (or fails).

### Plan a new feature

```bash
pilot start "Plan notification system" --skill plan-sprint --name plan-notifications
```

Claude assembles expert agents to analyze the goal, then three PM agents refine the plan. When done, Pilot asks for your approval before writing to `specs/backlog.md`.

### Execute a single ticket

```bash
pilot start "Ticket 7.3" --skill execute-ticket --name ticket-7-3
```

Claude finds ticket 7.3 in the backlog, checks dependencies, reads relevant docs, implements the ticket, runs QA, and updates documentation.

### Check sprint status

```bash
pilot start "Sprint 7 status" --skill sprint-status --name status-7
```

### Close a finished sprint

```bash
pilot start "Close sprint 7" --skill sprint-close --name close-7
```

### Using `--approve-reads`

For skills that only read files and generate output (like `sprint-status` or `plan-sprint`), add `--approve-reads` to auto-approve all file read operations without prompting:

```bash
pilot start "Sprint 7 status" --skill sprint-status --name status-7 --approve-reads
```

---

## Deep Dive: /sprint-run

The `sprint-run` skill is the most comprehensive skill in AutoSpec. It executes an entire sprint through 6 phases (plus two optional viewer phases).

### Execution Phases

**Phase 1: Sprint Briefing**

Claude reads `specs/backlog.md`, identifies the target sprint and all its tickets, reads every relevant `docs/` section referenced by the tickets, and builds an execution plan. Tickets are sorted by dependencies (DAG order) and grouped into parallelizable batches.

Claude presents the plan and **waits for user confirmation** before proceeding:

```
## Sprint 7: Notification System — Execution Plan

### Tickets (ordered by dependencies)
| # | Ticket | Owner | Model | Dependencies | Batch |
|---|--------|-------|-------|-------------|-------|
| 7.1 | Create notifications table | DB | haiku | — | 1 |
| 7.2 | NotificationService | Backend | sonnet | 7.1 | 2 |
...

Shall I proceed with execution?
```

**Phase 1.5: Viewer Planning Data** (skip for sprints < 5 pts)

Populate `viewer/src/data/sprints.ts` with planning visualizations so stakeholders can review the sprint plan before execution begins.

**Phase 2: Ticket Execution**

The Orchestrator + Sonnet Agent pattern (see below) executes all tickets. Independent tickets are parallelized — multiple Sonnet agents run simultaneously in one message.

**Phase 3: QA Verification**

Build verification runs for all affected apps:

```bash
cd cli && npm run build && npm test
cd viewer && npm run build
```

For CLI changes, end-to-end testing with real input files. For UI changes, visual verification via Playwright.

**Phase 4: Documentation Update**

Every file of code written must be reflected in `docs/`. New doc files are copied to `viewer/public/docs/` and registered in `viewer/src/data/docs.ts`. Viewer is rebuilt.

**Phase 5: Sprint Close**

All tickets marked ✅ in `specs/backlog.md`. Sprint summary generated at `sprints/sprint_N/summary.md`.

**Phase 5b: Viewer Retrospective Data** (skip for sprints < 5 pts)

Sprint visualization updated with actual completion data: timeline, agent radar chart, key metrics, highlights, and challenges.

**Phase 6: Final Report**

Summary of tickets completed, test results, docs updated, and files ready for git commit.

### Orchestrator + Agent Pattern

`/sprint-run` always uses this two-tier execution model for FinOps efficiency:

```
Opus 4.6 (Orchestrator)
  → writes agents/sprint-N-brief.md with full context package
  → spawns Agent(subagent_type=general-purpose, model="sonnet")
  → reviews results, spawns next batch

Sonnet 4.6 (Sprint Agent)
  → reads agents/sprint-N-brief.md
  → reads all docs/ files listed in the brief FIRST
  → executes tickets per execute-ticket.md conventions
  → updates backlog, docs, sprint summary
```

**Parallel batch execution:**

```
Turn N:   spawn Agent A (tickets 7.1, 7.2) + Agent B (ticket 7.3)
Turn N+1: merge results → spawn Agent C (ticket 7.4, depends on 7.1)
```

The brief file at `agents/sprint-N-brief.md` contains exact file paths, code snippets (no hallucinated values), the file tree to create, conventions, forbidden patterns, and a verification checklist. This keeps the orchestrator's context clean and makes agent execution deterministic.

---

## Deep Dive: /plan-sprint

The `plan-sprint` skill assembles a team of specialized AI experts to analyze a sprint goal before a single ticket is written.

### Expert Assembly

Based on the sprint goal, Claude activates relevant experts:

| Expert | Activated when | Reads |
|--------|----------------|-------|
| **Architect** | Always | `specs/02_backend_lead.md`, `specs/03_frontend_lead.md`, relevant `docs/` |
| **UX/UI Expert** | Sprint has any frontend/GUI work | `specs/10_ui_designer.md`, `docs/ui-design-system/`, `docs/flows/` |
| **Database Expert** | Sprint has schema changes or new models | `specs/04_db_architect.md`, database schema file |
| **Human Experience Expert** | Sprint has user-facing features | `specs/01_product_manager.md`, relevant `docs/flows/` |

### Planning Workflow

**Phase 2: Expert Analysis (parallel)**

All activated experts run simultaneously as independent agents. Each produces a structured analysis: system impact, API design, UX flows, schema changes, or user journey maps — depending on their role.

**Phases 3, 4, 5: Three-PM Review (sequential)**

Three PM agents run in sequence, each depending on the previous:

1. **PM-A (Drafter)** — synthesizes expert analyses into a draft sprint plan with phased tickets, story points (1–8 per ticket), model assignments, QA plan, and docs impact
2. **PM-B (Reviewer)** — adversarially reviews PM-A's draft against a completeness checklist: granularity, dependencies, FinOps model assignments, QA coverage, docs gaps, points realism (30–60 pts per sprint)
3. **PM-C (Finalizer)** — incorporates valid PM-B recommendations and produces the final plan in exact backlog format

**Phase 6: Present and Commit**

Claude shows the full sprint plan and **waits for your confirmation** before writing anything to `specs/backlog.md`:

- **"Commit to backlog"** — appends sprint to `specs/backlog.md`
- **"Modify first"** — apply changes and re-present
- **"Discard"** — do nothing

### Producing Tickets

Each ticket in the output follows the standard backlog format:

```markdown
| 7.1 | Create notifications table | DB | haiku | 2 | 🔲 | — |
```

FinOps model selection:
- `haiku` — simple, well-defined work (migrations, config, boilerplate)
- `sonnet` — standard implementation (services, components, integrations)
- `opus` — architectural decisions, complex system design

---

## Provider Compatibility

SDD skills are plain Markdown instruction files. They work at the prompt level, so they are compatible with any AI provider that can follow structured instructions:

| Provider | Basic skills | Multi-agent (`/sprint-run`) |
|----------|--------------|-----------------------------|
| **Claude (Anthropic)** | Full support | Full support — uses Agent tool for Sonnet sub-agents |
| **Gemini (Google)** | Full support | Partial — orchestration logic works, no Agent tool |
| **GitHub Copilot** | Full support | Limited — no sub-agent spawning |
| **OpenAI** | Full support | Limited — no Agent tool |

The `/sprint-run` Orchestrator + Sonnet Agent pattern relies on Claude's `Agent` tool to spawn parallel sub-agents. With other providers, the orchestrator can still follow the phases sequentially, but parallel batch execution is not available.

For maximum effectiveness with multi-sprint orchestration, use Claude Opus 4.6 as orchestrator and Claude Sonnet 4.6 as the implementation agent.

---

## Example: Complete Workflow

The recommended end-to-end workflow for a new feature sprint:

```bash
# 1. Plan the sprint with expert analysis + 3-PM review
pilot start "Plan sprint 8 for payment system" --skill plan-sprint --name plan-8

# Review the output:
# - Check specs/backlog.md for the new Sprint 8 tickets
# - Confirm story points and model assignments look right
# - Approve or request changes via Pilot's approval prompt

# 2. Execute the sprint (Opus orchestrates, Sonnet agents implement)
pilot start "8" --skill sprint-run --name sprint-8 --approve-reads

# Pilot will:
# - Send a WhatsApp notification when execution starts
# - Ask for confirmation after Phase 1 (execution plan)
# - Notify you when each phase completes
# - Alert you if any phase fails

# 3. Review QA results
pilot logs sprint-8 | grep -A5 "Phase 3"

# 4. Close the sprint and generate documentation
pilot start "8" --skill sprint-close --name close-8

# After close:
# - sprints/sprint_8/summary.md is generated
# - All tickets marked ✅ in specs/backlog.md
# - Viewer data updated and rebuilt
# - Git tag sprint-8-complete is recommended
```

**Monitoring a running sprint:**

```bash
# Check status in another terminal
pilot start "Sprint 8 status" --skill sprint-status --name status-check --approve-reads

# Or tail the session logs directly
pilot logs sprint-8 --follow
```

**If something goes wrong mid-sprint:**

```bash
# Check which tickets are stuck
pilot start "8" --skill sprint-status --name debug-8 --approve-reads

# Resume a specific blocked ticket
pilot start "8.4" --skill execute-ticket --name ticket-8-4
```

---

## Key Files

| File | Purpose |
|------|---------|
| `skills/claude/` | Source skill `.md` files — authoritative instruction sets |
| `.claude/commands/` | Symlinks to `skills/claude/` — loaded by Claude Code as slash commands |
| `specs/backlog.md` | Single source of truth for all sprint tickets and statuses |
| `agents/sprint-N-brief.md` | Context package written by Orchestrator before spawning agents |
| `sprints/sprint_N/summary.md` | Sprint completion summary with docs cross-references |
| `docs/` | Living documentation — agents read this before implementing |
