# Cursor IDE Setup for SDD Projects

**Version:** 1.0
**Last Updated:** 2026-03-11

---

## Overview

Cursor is an AI-first code editor built on VS Code with built-in Composer and Chat capabilities. It is well-suited for SDD because:

- Composer handles multi-file changes (ideal for ticket execution)
- Chat provides planning and status checking
- Rules files (`.mdc`) auto-load context when matching files are edited
- Supports multiple AI models (Claude, GPT, custom)

---

## Prerequisites

1. Cursor IDE ([cursor.com](https://cursor.com))
2. API key for your preferred model provider, or Cursor Pro subscription

---

## Installation

### Download and Install

1. Download Cursor from [cursor.com](https://cursor.com)
2. Install and launch
3. Import VS Code settings if prompted (recommended)

### Configure Model

1. Open Settings (`Ctrl+Shift+J` or `Cmd+Shift+J`)
2. Navigate to Models
3. Select your preferred model or add an API key

---

## Project Configuration

### Copy SDD Rules

Cursor loads `.mdc` rule files from `.cursor/rules/` in your project root. These rules are automatically injected into context when matching files are open.

```bash
# Copy rules into your project
cp -r skills/cursor/rules/ .cursor/rules/
```

### Verify Setup

1. Open any project file in Cursor
2. Open Composer (`Ctrl+I` or `Cmd+I`)
3. Rules will be auto-loaded based on the files in your context

---

## Available Rules

The following rule files are available from `skills/cursor/rules/`:

| Rule File | Purpose | Auto-Triggers On |
|-----------|---------|-------------------|
| `sdd-workflow.mdc` | Core SDD methodology and project structure | All project files |
| `execute-ticket.mdc` | Ticket execution workflow and checklist | Spec and source files |
| `plan-sprint.mdc` | Sprint planning from backlog | `specs/backlog.md` |
| `sprint-run.mdc` | Full sprint execution flow | Sprint-related files |
| `qa-review.mdc` | QA review checklist and process | Test files |
| `update-backlog.mdc` | Backlog status update conventions | `specs/backlog.md` |

Rules are context-aware: they activate automatically when you open or reference files that match their trigger patterns. You do not need to invoke them manually.

---

## SDD Workflow in Cursor

### Planning with Chat

Use Cursor Chat (`Ctrl+L` or `Cmd+L`) for planning and status checks:

```
Read specs/backlog.md and summarize the current sprint status.
```

```
Based on specs/backlog.md, what tickets are still pending in Sprint 5?
```

### Executing Tickets with Composer

Use Composer (`Ctrl+I` or `Cmd+I`) for multi-file changes when executing tickets:

```
Execute ticket 5.3 from specs/backlog.md.
Read specs/02_backend_lead.md for the API patterns.
Update backlog status to In Progress, implement the endpoint,
write tests, then update status to QA Review.
```

Composer can create, edit, and delete files across your project in a single operation, making it ideal for ticket execution.

### QA Review

After implementing a ticket, use Chat for review:

```
Review the changes for ticket 5.3.
Check against specs/05_qa_lead.md requirements.
Run the test suite and report results.
```

### Closing a Sprint

```
Read specs/backlog.md Sprint 5 section.
Verify all tickets are Done.
Generate a sprint summary in sprints/sprint-5/summary.md.
```

---

## Multi-Agent Setup

Cursor supports multiple Composer instances, enabling an Agent A/B workflow.

### Agent A (Backend)

1. Open Composer (`Ctrl+I`)
2. Initialize with backend context:

```
You are Agent A - Backend Lead for Sprint 5.
Read specs/02_backend_lead.md and specs/04_db_architect.md.
Your tickets: 5.1, 5.3, 5.5
Execute them in order, updating specs/backlog.md as you go.
Do NOT modify frontend code.
```

### Agent B (Frontend)

1. Open a second Composer instance (`Ctrl+I` again, or use Command Palette)
2. Initialize with frontend context:

```
You are Agent B - Frontend Lead for Sprint 5.
Read specs/03_frontend_lead.md.
Your tickets: 5.2, 5.4, 5.6
Ticket 5.4 depends on 5.3 (API). Start with 5.2.
Do NOT modify backend code.
```

### Managing Conflicts

Both agents may modify `specs/backlog.md`. Assign clear ownership:

- Agent A updates odd-numbered tickets only
- Agent B updates even-numbered tickets only
- Review and merge backlog changes after each sprint

---

## Limitations vs Claude Code

| Capability | Cursor | Claude Code |
|------------|--------|-------------|
| Slash commands | No (use rules instead) | Yes (via .claude/commands/) |
| Persistent rules | Yes (via .mdc files) | Yes (via CLAUDE.md) |
| Multi-file edits | Yes (Composer) | Yes (tool use) |
| Sub-agent spawning | No | Yes (native) |
| Terminal integration | Built-in terminal | Native terminal |
| Model flexibility | Multiple providers | Anthropic models only |
| File context | @file, @codebase | Direct file access |

Cursor does not support native slash commands like Continue or Claude Code. Instead, SDD workflows are provided through `.mdc` rule files that inject context automatically. You invoke workflows by describing what you want in natural language, and the rules guide the model's behavior.

---

## Tips

### Use @codebase for Broad Searches

```
@codebase How are API endpoints structured in this project?
```

Cursor indexes your entire workspace and retrieves relevant code snippets.

### Use @file for Specific Context

```
@file specs/backlog.md What's the status of Sprint 5?
@file specs/02_backend_lead.md Show the service layer pattern.
```

### Composer for Multi-File Edits

Always use Composer (not Chat) when a ticket requires changes across multiple files. Composer can stage all changes for review before applying them.

### Review Before Accepting

Composer shows a diff preview of all changes. Always review the diff before accepting, especially when executing tickets that touch shared files like `specs/backlog.md`.

### Iterate in Chat, Execute in Composer

Use Chat to discuss approach and clarify requirements. Once the plan is clear, switch to Composer for implementation. This keeps your Composer context focused on execution.

---

## Troubleshooting

### Rules Not Loading

1. Verify `.cursor/rules/` directory exists in your project root
2. Check that `.mdc` files are present
3. Restart Cursor
4. Open a file that should trigger the rule

### Composer Loses Context

For long ticket execution sessions:

1. Start a new Composer instance
2. Re-state the ticket and relevant specs
3. Reference specific files with @file

### Model Errors

If the model produces incorrect output:

```
That doesn't match the pattern in specs/02_backend_lead.md.
Please re-read the spec and follow the existing conventions.
```

---

## Next Steps

- [VSCode Setup](./setup.md) - General editor configuration (applies to Cursor)
- [Continue Extension](./continue.md) - Alternative with slash command support
- [Multi-Agent Patterns](../../methodology/05_multi_agent.md) - Coordination strategies
