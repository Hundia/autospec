# JetBrains IDE Setup for SDD Projects

**Version:** 1.0
**Last Updated:** 2026-03-11

---

## Overview

JetBrains IDEs (IntelliJ IDEA, WebStorm, PyCharm, etc.) can be configured for SDD workflows using either the built-in JetBrains AI Assistant or the Continue extension for JetBrains. Both options provide AI-assisted development with SDD context.

---

## Prerequisites

1. JetBrains IDE (2024.1 or later recommended)
2. One of the following:
   - JetBrains AI Assistant subscription (bundled with some plans)
   - Continue extension + API key for your preferred model provider

---

## Option A: JetBrains AI Assistant

### Installation

JetBrains AI Assistant is available as a built-in plugin in recent JetBrains IDEs.

1. Open Settings (`Ctrl+Alt+S` or `Cmd+,`)
2. Navigate to Plugins > Marketplace
3. Search "AI Assistant" and install if not already present
4. Restart the IDE

### Configuration for SDD

JetBrains AI Assistant supports custom instructions that are included in every conversation. Paste the contents of `skills/jetbrains/instructions.md` into the custom prompt:

1. Open Settings (`Ctrl+Alt+S` or `Cmd+,`)
2. Navigate to Tools > AI Assistant
3. Find the "Custom Instructions" or "System Prompt" field
4. Paste the contents of `skills/jetbrains/instructions.md`
5. Apply and close

```bash
# View the instructions template
cat skills/jetbrains/instructions.md
```

### Using AI Assistant for SDD

**Chat Panel:**

Open the AI Assistant chat panel and reference project files:

```
Read specs/backlog.md and show me the current sprint status.
```

```
Execute ticket 5.3 following the patterns in specs/02_backend_lead.md.
Update specs/backlog.md status to In Progress.
```

**Inline Prompts:**

Select code and use AI Assistant inline (`Alt+Enter` > AI Actions):

- Explain selected code
- Generate tests following spec patterns
- Refactor per project conventions

### Best For

- Single-ticket execution with guided context
- Code review against spec requirements
- Quick status checks and backlog queries
- Teams already using JetBrains AI subscriptions

---

## Option B: Continue Extension for JetBrains

### Installation

Continue is available for JetBrains IDEs and provides the same slash command support as the VS Code version.

1. Open Settings (`Ctrl+Alt+S` or `Cmd+,`)
2. Navigate to Plugins > Marketplace
3. Search "Continue" and install
4. Restart the IDE

### Configuration for SDD

Copy the SDD rules and prompts into your project:

```bash
# Copy rules (persistent project context)
cp -r skills/continue/rules/ .continue/rules/

# Copy prompts (slash commands)
cp -r skills/continue/prompts/ .continue/prompts/
```

### Configure Model Provider

Open Continue settings and add your model provider:

```yaml
# .continue/config.yaml
models:
  - name: Claude Sonnet
    provider: anthropic
    model: claude-sonnet-4-20250514
    apiKey: ${ANTHROPIC_API_KEY}
```

### Available Commands and Rules

Continue for JetBrains includes the same 10 slash commands (`/help`, `/execute-ticket`, `/sprint-run`, `/qa-review`, etc.) and 3 rules files as the VS Code version. See the [Continue Extension docs](../vscode/continue.md) for the full reference tables.

### Best For

- Teams wanting slash command workflows in JetBrains
- Multi-model flexibility (Claude, GPT, local models)
- Consistency with VS Code Continue users on the same team

---

## SDD Workflow

Regardless of which option you choose, the SDD workflow follows the same pattern:

### 1. Check Status

Review `specs/backlog.md` for current sprint progress.

### 2. Execute Tickets

**With AI Assistant:** Describe the ticket and reference the relevant spec files in natural language.

**With Continue:** Use `/execute-ticket 5.3` for guided execution.

### 3. Review

**With AI Assistant:** Ask for a review against `specs/05_qa_lead.md`.

**With Continue:** Use `/qa-review 5.3`.

### 4. Close Sprint

Verify all tickets are Done, then generate a sprint summary.

---

## Limitations

| Capability | JetBrains AI | Continue (JB) | Claude Code |
|------------|--------------|---------------|-------------|
| Slash commands | No | Yes | Yes |
| Custom instructions | Yes | Yes (rules) | Yes (CLAUDE.md) |
| Multi-file edits | Limited | Yes | Yes |
| Sub-agent spawning | No | No | Yes (native) |
| Model flexibility | JetBrains models | Any provider | Anthropic only |
| File context | IDE context | @file, @codebase | Direct access |

Neither JetBrains option supports native sub-agent spawning. For parallel Agent A/B workflows, use two IDE windows or combine with Claude Code in a terminal.

---

## Tips

### Use IDE Strengths

JetBrains IDEs excel at refactoring, navigation, and code analysis. Combine these native features with AI assistance:

- Use IDE refactoring tools for safe renames and moves
- Use AI for implementing new functionality per specs
- Use built-in test runners to verify ticket completion

### Reference Specs Explicitly

Always point the AI at relevant spec files:

```
Per specs/02_backend_lead.md (service layer section),
implement the SessionService class.
```

### Keep Instructions Updated

Whether using AI Assistant custom instructions or Continue rules, update them as your project conventions evolve. Stale instructions lead to inconsistent output.

### Leverage JetBrains Terminal

Use the built-in terminal (`Alt+F12`) to run builds and tests without leaving the IDE:

```bash
cd cli && npm run build && npm test
```

### Combine with Claude Code

For parallel Agent A/B workflows, use JetBrains for one agent and Claude Code in a terminal for the other.

---

## Troubleshooting

### AI Assistant Not Available

1. Verify your JetBrains subscription includes AI Assistant
2. Check Plugin is installed and enabled
3. Restart the IDE
4. Check internet connection

### Continue Commands Not Working

1. Verify `.continue/prompts/` directory exists in project root
2. Check that prompt `.md` files are present
3. Restart the IDE
4. Open Continue settings and verify model configuration

### Context Window Exhausted

For long ticket execution sessions:

1. Start a new chat/conversation
2. Re-reference the specific ticket and specs
3. Provide a brief status update of work completed

---

## Next Steps

- [Continue Extension (VS Code)](../vscode/continue.md) - Continue setup for VS Code
- [Claude Code CLI](../terminal/claude_code.md) - Terminal-based SDD workflow
- [Multi-Agent Patterns](../../methodology/05_multi_agent.md) - Coordination strategies
