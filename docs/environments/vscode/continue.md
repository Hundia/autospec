# Continue Extension Setup for SDD Projects

**Version:** 1.0
**Last Updated:** 2026-03-11

---

## Overview

Continue is an open-source AI code assistant for VS Code that supports custom rules and prompt commands. It is well-suited for SDD because:

- Custom slash commands map directly to SDD workflows
- Rules files provide persistent project context
- Multi-model support (Claude, GPT, local models)
- Open-source and self-hostable

---

## Prerequisites

1. VS Code (1.80+)
2. Continue extension from the VS Code Marketplace
3. API key for your chosen model provider (Anthropic, OpenAI, Ollama, etc.)

---

## Installation

### Install the Extension

```bash
code --install-extension Continue.continue
```

Or search "Continue" in the VS Code Extensions panel (`Ctrl+Shift+X`).

### Authenticate

1. Open Continue sidebar (`Ctrl+L`)
2. Click the gear icon to open settings
3. Add your model provider and API key in `config.yaml`

---

## Project Configuration

### Copy SDD Skills into Your Project

Continue loads rules from `.continue/rules/` and prompts from `.continue/prompts/` in your project root.

```bash
# Copy rules (project context for every conversation)
cp -r skills/continue/rules/ .continue/rules/

# Copy prompts (slash commands)
cp -r skills/continue/prompts/ .continue/prompts/
```

### Alternative: Reference in config.yaml

If you prefer a centralized config, reference the skill paths directly in your Continue `config.yaml`:

```yaml
rules:
  - path: skills/continue/rules/01-sdd-workflow.md
  - path: skills/continue/rules/02-backlog-first.md
  - path: skills/continue/rules/03-qa-before-done.md
```

### Verify Setup

1. Open Continue sidebar (`Ctrl+L`)
2. Type `/help` - you should see the SDD help output
3. If commands do not appear, restart VS Code

---

## Available Commands

The following slash commands are available from `skills/continue/prompts/`:

| Command | File | Purpose |
|---------|------|---------|
| `/help` | `help.md` | Show all SDD commands and usage |
| `/plan-sprint` | `plan-sprint.md` | Plan a new sprint from backlog |
| `/sprint-run` | `sprint-run.md` | Execute all tickets in a sprint |
| `/sprint-status` | `sprint-status.md` | Check current sprint progress |
| `/sprint-close` | `sprint-close.md` | Close a sprint and generate summary |
| `/execute-ticket` | `execute-ticket.md` | Execute a single backlog ticket |
| `/qa-review` | `qa-review.md` | Run QA review on a ticket or sprint |
| `/update-backlog` | `update-backlog.md` | Update ticket status in backlog |
| `/create-spec` | `create-spec.md` | Generate a new feature specification |
| `/create-sprint-docs` | `create-sprint-docs.md` | Generate sprint documentation |

---

## Rules Overview

Rules are loaded automatically into every Continue conversation, providing persistent SDD context.

| Rule File | Purpose |
|-----------|---------|
| `01-sdd-workflow.md` | Core SDD methodology, project structure, and role definitions |
| `02-backlog-first.md` | Backlog-first development mandate and ticket lifecycle |
| `03-qa-before-done.md` | QA requirements by change type before marking tickets done |

---

## Multi-Model Setup

Continue supports multiple model providers simultaneously. Configure them in `config.yaml`:

```yaml
models:
  - name: Claude Sonnet
    provider: anthropic
    model: claude-sonnet-4-20250514
    apiKey: ${ANTHROPIC_API_KEY}

  - name: Claude Opus
    provider: anthropic
    model: claude-opus-4-0-20250514
    apiKey: ${ANTHROPIC_API_KEY}

  - name: GPT-4o
    provider: openai
    model: gpt-4o
    apiKey: ${OPENAI_API_KEY}

  - name: Local (Ollama)
    provider: ollama
    model: llama3
```

### Model Selection Strategy

| Task Type | Recommended Model |
|-----------|-------------------|
| Simple ticket execution | Sonnet or GPT-4o |
| Complex architecture | Opus |
| Quick status checks | Haiku or local model |
| Code review | Sonnet |

Switch models using the model selector dropdown in the Continue sidebar.

---

## SDD Workflow in Continue

### 1. Start

Open the Continue sidebar and type `/help` to see all available commands and usage instructions.

### 2. Plan

```
/plan-sprint [goal description]
```

This reads `specs/backlog.md` and helps organize tickets for the next sprint.

### 3. Execute

```
/sprint-run 5
```

Or execute tickets individually:

```
/execute-ticket 5.1
/execute-ticket 5.2
```

### 4. Review

```
/qa-review 5.1
```

Runs the QA checklist from `specs/05_qa_lead.md` against the implemented ticket.

### 5. Close

```
/sprint-close 5
```

Generates sprint summary, updates backlog statuses, and creates documentation.

---

## Limitations vs Claude Code

| Capability | Continue | Claude Code |
|------------|----------|-------------|
| Slash commands | Yes (via prompts/) | Yes (via .claude/commands/) |
| Persistent rules | Yes (via rules/) | Yes (via CLAUDE.md) |
| Sub-agent spawning | No | Yes (native) |
| Multi-agent parallel | Manual (two sidebars) | Yes (tmux/tabs) |
| File system access | Via VS Code workspace | Full terminal access |
| Model flexibility | Any provider | Anthropic models only |
| Conversation model | Single-chat | Single-chat with tool use |

The main limitation is that Continue cannot natively spawn sub-agents the way Claude Code can with its orchestrator pattern. Sprint execution happens in a single conversation thread rather than parallel agent instances.

---

## Tips

### Use @codebase for Broad Context

```
@codebase What patterns does this project use for API endpoints?
```

Continue will search your workspace and include relevant files as context.

### Use @file for Specific Files

```
@file specs/backlog.md Show me Sprint 5 tickets
@file specs/02_backend_lead.md What's the service layer pattern?
```

### Reference Specs in Every Prompt

For best results, always point Continue at the relevant spec:

```
Per @file specs/03_frontend_lead.md, implement the SessionPage component.
```

### Keep Conversations Focused

Start a new conversation for each ticket or logical unit of work. This prevents context window overflow and keeps responses accurate.

### Pin Important Files

Use the Continue context panel to pin frequently referenced files like `specs/backlog.md` so they are included in every message.

---

## Next Steps

- [VSCode Setup](./setup.md) - General VS Code configuration
- [GitHub Copilot Guide](./github_copilot.md) - Alternative AI assistant setup
- [Multi-Agent Patterns](../../methodology/05_multi_agent.md) - Coordination strategies
