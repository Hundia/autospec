# Windsurf Setup for SDD Projects

**Version:** 1.0
**Last Updated:** 2026-03-11

---

## Overview

Windsurf is an AI-native IDE featuring Cascade, a multi-step AI assistant that can execute complex workflows autonomously. It is well-suited for SDD because:

- Cascade flows handle multi-step ticket execution naturally
- @mention support for referencing specs and docs
- Integrated terminal for running builds and tests
- System prompt customization via `.windsurfrules`

---

## Prerequisites

1. Windsurf IDE ([windsurf.com](https://windsurf.com))
2. Windsurf account (free tier available, Pro for advanced models)

---

## Installation

### Download and Install

1. Download Windsurf from [windsurf.com](https://windsurf.com)
2. Install and launch
3. Sign in with your Windsurf account
4. Import VS Code extensions if prompted (recommended)

---

## Project Configuration

### Create .windsurfrules

Windsurf loads project-level instructions from a `.windsurfrules` file in your project root. Use the template provided in `skills/windsurf/instructions.md`:

```bash
# Copy the Windsurf instructions template
cp skills/windsurf/instructions.md .windsurfrules
```

### Alternative: Cascade System Prompt

If you prefer not to use a project-level file, paste the contents of `skills/windsurf/instructions.md` directly into Cascade's system prompt settings:

1. Open Windsurf Settings
2. Navigate to Cascade > System Prompt
3. Paste the SDD instructions

### Verify Setup

1. Open your project in Windsurf
2. Open Cascade (`Ctrl+L` or `Cmd+L`)
3. Ask: "What methodology does this project use?"
4. Cascade should reference SDD and the project specs

---

## SDD Workflow in Windsurf

### Planning

Use Cascade to review and plan sprints:

```
Read specs/backlog.md and summarize the current sprint status.
What tickets are pending? Suggest an execution order.
```

### Ticket Execution with Cascade Flows

Cascade excels at multi-step workflows. Give it a ticket and let it flow:

```
Execute ticket 5.3 from specs/backlog.md.

Steps:
1. Read the relevant spec files
2. Update backlog status to In Progress
3. Implement the changes
4. Write tests
5. Run the test suite
6. Update backlog status to QA Review
```

Cascade will execute each step sequentially, creating and editing files as needed. You can review and approve each step before it proceeds.

### QA Review

```
Review ticket 5.3 against specs/05_qa_lead.md.
Run tests, check code quality, and verify the implementation
matches the spec requirements.
```

### Sprint Close

```
Read specs/backlog.md Sprint 5 section.
Verify all tickets are marked Done.
Generate a sprint summary at sprints/sprint-5/summary.md
following the pattern in existing sprint summaries.
```

---

## Using @mentions for Context

Windsurf supports @mentions to pull specific files into context:

### Reference Specs

```
Per @specs/02_backend_lead.md, implement the session endpoint.
```

### Reference Backlog

```
@specs/backlog.md What's the status of Sprint 5?
```

### Reference Multiple Files

```
Using @specs/03_frontend_lead.md and @specs/04_db_architect.md,
implement ticket 5.4 (SessionPage component with data fetching).
```

---

## Multi-Agent Workflow

Windsurf's Cascade operates as a single agent per window. For an Agent A/B pattern:

### Option 1: Two Windsurf Windows

1. Open your project in two separate Windsurf windows
2. Window A: Initialize as Backend Lead
3. Window B: Initialize as Frontend Lead

### Option 2: Sequential Execution

Execute backend tickets first, then frontend tickets:

```
Execute backend tickets 5.1, 5.3, 5.5 in order.
Then execute frontend tickets 5.2, 5.4, 5.6.
```

---

## Limitations

| Capability | Windsurf | Claude Code |
|------------|----------|-------------|
| Multi-step flows | Yes (Cascade) | Yes (tool use) |
| Slash commands | No | Yes (via .claude/commands/) |
| Project rules | Yes (.windsurfrules) | Yes (CLAUDE.md) |
| Sub-agent spawning | No | Yes (native) |
| Multi-agent parallel | Manual (two windows) | Yes (tmux/tabs) |
| Model flexibility | Windsurf models | Anthropic models |
| File context | @mentions | Direct file access |

Windsurf does not support custom slash commands. All SDD workflows are invoked through natural language prompts, guided by the `.windsurfrules` context. Cascade's strength is its ability to execute multi-step flows with approval gates at each step.

---

## Tips

### Let Cascade Flow

Cascade works best when given a clear multi-step objective. Rather than issuing one command at a time, describe the full workflow and let Cascade plan and execute the steps.

### Approve Each Step

Cascade shows previews before making changes. Use the approval step to verify that file edits match your expectations, especially for spec and backlog updates.

### Keep .windsurfrules Updated

As your project evolves, update `.windsurfrules` to reflect new conventions, patterns, and file structures. This keeps Cascade aligned with your current architecture.

### Use Terminal Integration

Cascade can run terminal commands. Ask it to run tests, build the project, or check linting after implementing a ticket:

```
Run npm test in the cli/ directory and show me the results.
```

### Start Fresh for Complex Tickets

For tickets that involve many files, start a new Cascade conversation to ensure a clean context window. Reference the specific ticket and specs at the start.

---

## Troubleshooting

### Cascade Ignores Project Rules

1. Verify `.windsurfrules` exists in your project root
2. Restart Windsurf
3. Check that the file is not empty or malformed

### Cascade Loses Context

For long sessions:

1. Start a new Cascade conversation
2. Re-reference the relevant specs and tickets
3. Provide a brief summary of work completed so far

### Changes Not Applied

If Cascade shows a diff but changes do not appear:

1. Check the file is not locked or read-only
2. Verify you approved the change in the Cascade UI
3. Save all files (`Ctrl+Shift+S`)

---

## Next Steps

- [VSCode Setup](./setup.md) - General editor configuration tips
- [Continue Extension](./continue.md) - Alternative with slash command support
- [Multi-Agent Patterns](../../methodology/05_multi_agent.md) - Coordination strategies
