---
name: help
description: List all available SDD commands and workflow guidance
invokable: true
---

# AutoSpec SDD Help

Display the full list of available commands and workflow guidance for Spec-Driven Development.

## Instructions

Print the following command reference table and workflow summary:

---

## Available Commands

| Command | Description |
|---------|-------------|
| `/help` | Show this command reference |
| `/execute-ticket` | Execute a ticket from the backlog following SDD methodology |
| `/update-backlog` | Modify ticket statuses, add tickets, report bugs, or link docs |
| `/qa-review` | QA review completed tickets with change-appropriate verification |
| `/sprint-run` | Execute an entire sprint: plan → implement → QA → docs → close |
| `/plan-sprint` | Collaboratively plan a sprint with expert analysis |
| `/sprint-status` | Show sprint progress with health indicators |
| `/sprint-close` | Close a sprint and generate summary documentation |
| `/create-spec` | Generate a new feature specification from requirements |
| `/create-sprint-docs` | Generate documentation for completed sprints |

## Quick Start Workflow

1. **Check status:** `/sprint-status` to see current sprint progress
2. **Pick a ticket:** Look at `specs/backlog.md` for 🔲 Todo tickets
3. **Execute:** `/execute-ticket` with the ticket ID
4. **Review:** `/qa-review` to verify the implementation
5. **Repeat** until all sprint tickets are done
6. **Close:** `/sprint-close` to finalize the sprint

## Key Files

- `specs/backlog.md` — Sprint backlog and ticket tracking
- `specs/01-06` — Project specifications
- `docs/` — Living documentation (must be updated with every feature)
- `sprints/` — Sprint summaries and reports

## Status Legend

| Emoji | Meaning |
|-------|---------|
| 🔲 | Todo |
| 🔄 | In Progress |
| 🧪 | QA Review |
| ✅ | Done |
| ⏸️ | Blocked |
