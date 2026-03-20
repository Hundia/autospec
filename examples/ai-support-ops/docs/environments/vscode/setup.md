# VSCode Setup for SDD

**Version:** 1.0
**Last Updated:** 2026-01-21

---

## Overview

VSCode is the most flexible environment for SDD, supporting multiple AI assistants and multi-window workflows.

---

## Recommended Extensions

### Required

| Extension | Purpose | Install |
|-----------|---------|---------|
| GitHub Copilot | AI code completion | `ext install GitHub.copilot` |
| GitHub Copilot Chat | AI conversations | `ext install GitHub.copilot-chat` |

### Recommended

| Extension | Purpose | Install |
|-----------|---------|---------|
| Markdown All in One | Better spec editing | `ext install yzhang.markdown-all-in-one` |
| Todo Tree | Track TODOs in code | `ext install Gruntfuggly.todo-tree` |
| GitLens | Git history visibility | `ext install eamodio.gitlens` |
| Error Lens | Inline error display | `ext install usernamehw.errorlens` |

### Optional (Claude Users)

| Extension | Purpose | Install |
|-----------|---------|---------|
| Claude for VSCode | Claude in VSCode | Check marketplace |

---

## Workspace Setup

### 1. Open Project

```bash
cd your-project
code .
```

### 2. Configure Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.associations": {
    "*.md": "markdown"
  },
  "markdown.preview.breaks": true,
  "[markdown]": {
    "editor.wordWrap": "on",
    "editor.quickSuggestions": false
  },
  "github.copilot.enable": {
    "*": true,
    "markdown": true
  }
}
```

### 3. Set Up File Explorer

Pin these folders for quick access:
- `specs/` - Specification documents
- `prompts/` - Sprint prompts
- `.claude/commands/` - AI skills (if using Claude)

---

## Multi-Window Layout for Agent A/B

### Step 1: Open Two Chat Windows

1. Open Copilot Chat: `Ctrl+Shift+I` (or `Cmd+Shift+I` on Mac)
2. Dock it to the left panel

3. Open another Copilot Chat:
   - Command Palette (`Ctrl+Shift+P`)
   - Search "GitHub Copilot: New Chat"

4. Drag second chat to right panel

### Step 2: Result Layout

```
┌─────────────────────────────────────────────────────┐
│ Activity Bar │ Copilot Chat A │ Editor │ Copilot B │
├──────────────┼────────────────┼────────┼───────────┤
│              │                │        │           │
│  Explorer    │  Agent A       │  Code  │  Agent B  │
│  Search      │  (Backend)     │  View  │ (Frontend)│
│  Git         │                │        │           │
│              │                │        │           │
└──────────────┴────────────────┴────────┴───────────┘
```

### Step 3: Initialize Agents

**Agent A (Left Chat):**
```
You are Agent A - Backend Lead for this sprint.
Read specs/02_backend_lead.md and specs/backlog.md.
Your tickets: [list backend tickets]
Update backlog.md status as you work.
```

**Agent B (Right Chat):**
```
You are Agent B - Frontend Lead for this sprint.
Read specs/03_frontend_lead.md and specs/backlog.md.
Your tickets: [list frontend tickets]
Update backlog.md status as you work.
```

---

## Keyboard Shortcuts

### Essential Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Copilot Chat | `Ctrl+Shift+I` | `Cmd+Shift+I` |
| Inline Chat | `Ctrl+I` | `Cmd+I` |
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Go to File | `Ctrl+P` | `Cmd+P` |
| Search in Files | `Ctrl+Shift+F` | `Cmd+Shift+F` |

### Custom Shortcuts for SDD

Add to `keybindings.json`:

```json
[
  {
    "key": "ctrl+alt+b",
    "command": "workbench.action.quickOpen",
    "args": "specs/backlog.md"
  },
  {
    "key": "ctrl+alt+s",
    "command": "workbench.action.quickOpen",
    "args": "specs/"
  }
]
```

---

## Copilot Configuration

### Enable for All Files

In `settings.json`:

```json
{
  "github.copilot.enable": {
    "*": true,
    "markdown": true,
    "plaintext": true,
    "yaml": true,
    "json": true
  }
}
```

### Custom Instructions

Create `.github/copilot-instructions.md`:

```markdown
## Project Context

This project uses Spec-Driven Development (SDD).

### Key Files
- specs/backlog.md - Master work tracker
- specs/02_backend_lead.md - API patterns
- specs/03_frontend_lead.md - Component patterns

### Conventions
- Follow patterns in spec files
- Update backlog.md status when completing tickets
- Use TypeScript with strict types
- Follow existing code patterns

### Status Emojis
- 🔲 Todo
- 🔄 In Progress
- 🧪 QA Review
- ✅ Done
```

---

## Project-Specific Setup

### For TypeScript Projects

```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

### For React Projects

```json
{
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

### For Node.js Projects

```json
{
  "debug.node.autoAttach": "on"
}
```

---

## Troubleshooting

### Copilot Not Responding

1. Check subscription status
2. Verify internet connection
3. Restart VSCode
4. Check `Output > GitHub Copilot` for errors

### Chat History Lost

Copilot Chat doesn't persist history between sessions. For important conversations:
- Copy key decisions to a file
- Use the sprint prompt as your context source

### Markdown Preview Issues

If spec files render incorrectly:
1. Install "Markdown All in One" extension
2. Ensure line endings are LF (not CRLF)

---

## Next Steps

- [GitHub Copilot Guide](./github_copilot.md) - Detailed Copilot usage
- [Claude Extension Guide](./claude_extension.md) - Using Claude in VSCode
- [Multi-Agent Patterns](../../methodology/05_multi_agent.md) - Advanced workflows
