# Claude Code CLI for SDD

**Version:** 1.0
**Last Updated:** 2026-01-21

---

## Overview

Claude Code is Anthropic's official CLI for Claude, providing a terminal-native AI development experience. It's ideal for SDD because:

- Direct file access and manipulation
- Custom commands (skills) for SDD workflows
- Multiple terminal instances for Agent A/B
- Model selection (Haiku, Sonnet, Opus)

---

## Installation

### Prerequisites

- Node.js 18+ or direct install via Anthropic
- Anthropic API key (or Claude Max subscription)

### Install Claude Code

```bash
# Via npm
npm install -g @anthropic-ai/claude-code

# Or direct download from Anthropic
# Follow instructions at: https://claude.ai/code
```

### Authenticate

```bash
# First run will prompt for authentication
claude

# Or set API key
export ANTHROPIC_API_KEY=your-key-here
```

---

## Project Setup

### Initialize SDD Commands

Claude Code uses `.claude/commands/` for custom skills. Create them:

```bash
mkdir -p .claude/commands
```

Copy SDD commands from templates:

```bash
cp sdd-for-all/skills/claude/* .claude/commands/
```

### Verify Installation

```bash
cd your-project
claude

# Test a command
/execute-ticket 1.1
```

---

## Core SDD Commands

### /execute-ticket

Execute a single ticket from the backlog.

```bash
/execute-ticket 4.3
```

**What it does:**
1. Reads `specs/backlog.md` to find ticket 4.3
2. Checks dependencies
3. Reads relevant spec files
4. Updates status to 🔄 In Progress
5. Implements the ticket
6. Runs tests
7. Updates status to 🧪 QA Review

### /qa-review

Review completed tickets for quality.

```bash
/qa-review 4.3
# or
/qa-review sprint 4
```

**What it does:**
1. Runs QA checklist from `specs/05_qa_lead.md`
2. Executes tests
3. Checks code quality
4. Updates status to ✅ Done or flags issues

### /sprint-status

Check current sprint progress.

```bash
/sprint-status
# or
/sprint-status 4
```

**Output:**
```
Sprint 4: Session Management

Progress: ████████░░ 80%

| # | Ticket | Status |
|---|--------|--------|
| 4.1 | Create sessions table | ✅ Done |
| 4.2 | SessionService | ✅ Done |
| 4.3 | Session API | 🧪 QA Review |
| 4.4 | SessionPage | 🔄 In Progress |
| 4.5 | Tests | 🔲 Todo |
```

### /update-backlog

Manually update ticket status.

```bash
/update-backlog status 4.3 done
/update-backlog add 4.6 "Add session caching" Backend sonnet
```

### /create-spec

Generate a new feature specification.

```bash
/create-spec notifications
```

---

## Multi-Agent Setup (Terminal)

### Option 1: Split Terminal (tmux)

```bash
# Start tmux
tmux new-session -s sdd

# Split horizontally
Ctrl+B %

# Left pane: Agent A
claude

# Right pane: Agent B
# (Ctrl+B → to switch panes)
claude
```

**Layout:**
```
┌─────────────────────┬─────────────────────┐
│ claude (Agent A)    │ claude (Agent B)    │
│ Backend Lead        │ Frontend Lead       │
│                     │                     │
│ > /execute 4.1      │ > /execute 4.2      │
└─────────────────────┴─────────────────────┘
```

### Option 2: Multiple Terminal Tabs

Open two terminal windows/tabs and run `claude` in each.

### Agent A Initialization

```
You are Agent A - Backend Lead for Sprint 4.

Read:
- specs/backlog.md (Sprint 4)
- specs/02_backend_lead.md
- specs/04_db_architect.md

Your tickets: 4.1, 4.3, 4.5, 4.7

Execute with: /execute-ticket [number]

Do NOT work on frontend tickets.
```

### Agent B Initialization

```
You are Agent B - Frontend Lead for Sprint 4.

Read:
- specs/backlog.md (Sprint 4)
- specs/03_frontend_lead.md

Your tickets: 4.2, 4.4, 4.6, 4.8

Ticket 4.4 needs 4.3 (API). Start with 4.2.

Execute with: /execute-ticket [number]

Do NOT work on backend tickets.
```

---

## Model Selection

Claude Code supports model selection for cost optimization.

### Default Model

Set in your config or environment:

```bash
export CLAUDE_MODEL=claude-3-sonnet-20240229
```

### Per-Command Model

```bash
# Use haiku for simple tasks
claude --model haiku "Create the database migration for users table"

# Use opus for complex tasks
claude --model opus "Design the authentication architecture"
```

### In Sprint Prompts

Tickets specify model:

```markdown
| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 4.1 | Create sessions table | 🔲 | DB | haiku |
| 4.2 | Implement SessionService | 🔲 | Backend | sonnet |
| 4.3 | Design state machine | 🔲 | Backend | opus |
```

---

## Sprint Execution Workflow

### 1. Start Sprint

```bash
cd your-project
claude

# Load sprint context
cat specs/backlog.md | head -200

# Or read specific sprint
Read Sprint 4 from specs/backlog.md
```

### 2. Execute Tickets

```bash
# As Agent A
/execute-ticket 4.1
/execute-ticket 4.3
/execute-ticket 4.5

# As Agent B (different terminal)
/execute-ticket 4.2
/execute-ticket 4.4
/execute-ticket 4.6
```

### 3. QA Review

```bash
/qa-review sprint 4
```

### 4. Generate Sprint Docs

```bash
/create-sprint-docs 4
```

Creates:
- `sprints/sprint-04-sessions/summary.md`
- `sprints/sprint-04-sessions/qa-results.md`
- `sprints/sprint-04-sessions/release-notes.md`

### 5. Commit

```bash
git add .
git commit -m "Complete Sprint 4: Session Management"
```

---

## File Operations

Claude Code has full file system access:

### Reading Files

```
Read specs/02_backend_lead.md
```

### Writing Files

```
Create api/src/services/session.service.ts with the SessionService class
```

### Editing Files

```
Update specs/backlog.md: change ticket 4.3 status to ✅ Done
```

---

## Common Workflows

### Starting a New Project

```bash
# Create project
mkdir my-project && cd my-project
git init

# Initialize SDD
# (Using SDD CLI when available)
sdd init

# Or manually
mkdir -p specs prompts .claude/commands

# Start Claude and create specs
claude
```

### Resuming Work

```bash
cd my-project
claude

# Check status
/sprint-status

# Continue where you left off
/execute-ticket [next-todo-ticket]
```

### Debugging Issues

```bash
claude --model opus

# Describe the problem
I'm seeing an error in SessionService. Here's the stack trace:
[paste error]

Please debug and fix.
```

---

## Tips for Efficiency

### 1. Use Command History

Claude Code remembers conversation context. Reference earlier work:

```
Continue implementing the service we discussed earlier.
```

### 2. Batch Similar Tasks

```
Execute tickets 4.1, 4.2, and 4.3 - they're all database migrations.
```

### 3. Let Claude Read First

```
Before implementing, read:
1. specs/02_backend_lead.md
2. api/src/services/user.service.ts (for patterns)
Then implement the session service following the same patterns.
```

### 4. Verify with Tests

```
After implementing, run npm test and show me the results.
```

---

## Troubleshooting

### Command Not Found

```
/execute-ticket: command not found
```

**Fix:** Ensure `.claude/commands/execute-ticket.md` exists.

### Context Too Long

If Claude loses context on long sprints:

```
Let's start fresh. Read specs/backlog.md Sprint 4 section and continue from ticket 4.5.
```

### API Rate Limits

If you hit rate limits:

1. Wait a few minutes
2. Use lighter model (haiku) for simple tasks
3. Batch requests when possible

---

## Configuration

### Claude Code Config

Create `.claude/config.json`:

```json
{
  "defaultModel": "sonnet",
  "commandsPath": ".claude/commands",
  "autoSave": true
}
```

### Environment Variables

```bash
export CLAUDE_MODEL=claude-3-sonnet-20240229
export ANTHROPIC_API_KEY=your-key
```

---

## Next Steps

- [Shell Workflows](./shell_workflows.md) - Advanced terminal patterns
- [Claude Commands](../../../skills/claude/) - Full command reference
- [Multi-Agent Patterns](../../methodology/05_multi_agent.md) - Coordination strategies
