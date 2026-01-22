# GitHub Copilot for SDD

**Version:** 1.0
**Last Updated:** 2026-01-21

---

## Overview

GitHub Copilot is ideal for SDD because:
- Native VSCode integration
- Multi-chat support (Agent A/B)
- Context from workspace files
- Inline completions + chat

---

## Setup

### Prerequisites

1. GitHub Copilot subscription (Individual or Business)
2. VSCode with Copilot extensions installed
3. Signed into GitHub in VSCode

### Extensions Required

```bash
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat
```

### Verify Installation

1. Open any code file
2. Start typing - should see ghost text suggestions
3. Open chat with `Ctrl+Shift+I`

---

## Project Context with Instructions

### Create Copilot Instructions

Create `.github/copilot-instructions.md` in your project root:

```markdown
# Copilot Instructions

## Project Overview
[Brief description of your project]

## Spec-Driven Development

This project follows SDD methodology. Key files:

### Specifications
- `specs/backlog.md` - Master work tracker (ALWAYS check before starting)
- `specs/01_product_manager.md` - Product vision and requirements
- `specs/02_backend_lead.md` - API design and patterns
- `specs/03_frontend_lead.md` - UI components and design system
- `specs/04_db_architect.md` - Database schema
- `specs/05_qa_lead.md` - Testing requirements

### Conventions

**Code Style:**
- TypeScript with strict types
- Zod for validation
- Repository → Service → Controller pattern
- React functional components with hooks

**File Naming:**
- Components: PascalCase.tsx
- Services: kebab-case.service.ts
- Tests: *.test.ts or *.spec.ts

**Backlog Status:**
- 🔲 Todo - Not started
- 🔄 In Progress - Being worked on
- 🧪 QA Review - Needs testing
- ✅ Done - Complete

### When Working on Tickets

1. Read the relevant spec file first
2. Update backlog.md status to 🔄 In Progress
3. Follow existing patterns in codebase
4. Write tests per specs/05_qa_lead.md
5. Update backlog.md to 🧪 QA Review when done
```

---

## Agent A/B Pattern with Copilot

### Setting Up Dual Agents

**Step 1:** Open first chat (`Ctrl+Shift+I`)

**Step 2:** Open second chat:
- Command Palette (`Ctrl+Shift+P`)
- "GitHub Copilot: New Chat"

**Step 3:** Position side-by-side:
- Drag one chat panel to opposite side of editor

### Agent A Initialization Prompt

```markdown
# Agent A - Backend Lead

You are Agent A, the Backend Lead for Sprint [X]: [Name].

## Your Context
- Project specs: specs/02_backend_lead.md, specs/04_db_architect.md
- Backlog: specs/backlog.md (Sprint [X] section)

## Your Tickets
| # | Ticket | Status |
|---|--------|--------|
| [X.1] | [Description] | 🔲 |
| [X.3] | [Description] | 🔲 |
| [X.5] | [Description] | 🔲 |

## Rules
1. Read the spec files before implementing
2. Update backlog.md status as you work
3. Run tests after each change: `npm test`
4. Commit after each ticket: `git commit -m "Complete X.Y: description"`
5. Do NOT modify frontend code

## Start
Begin with ticket [X.1]. Read the spec, update status, implement.
```

### Agent B Initialization Prompt

```markdown
# Agent B - Frontend Lead

You are Agent B, the Frontend Lead for Sprint [X]: [Name].

## Your Context
- Project specs: specs/03_frontend_lead.md
- Backlog: specs/backlog.md (Sprint [X] section)

## Your Tickets
| # | Ticket | Status |
|---|--------|--------|
| [X.2] | [Description] | 🔲 |
| [X.4] | [Description] | 🔲 |
| [X.6] | [Description] | 🔲 |

## Dependencies
- Ticket [X.4] requires [X.3] (API from Agent A)
- Start with [X.2] while waiting

## Rules
1. Read the spec files before implementing
2. Update backlog.md status as you work
3. Run tests: `npm test`
4. Do NOT modify backend code

## Start
Begin with ticket [X.2]. Read the spec, update status, implement.
```

---

## Copilot Chat Best Practices

### Be Specific with Context

**Bad:**
```
Create a login form
```

**Good:**
```
Create the LoginForm component per specs/03_frontend_lead.md (line 145-180).
Use the Button and Input components from our design system.
Integrate with authStore per the spec.
```

### Reference Files Explicitly

```
Read specs/backlog.md and show me the Sprint 4 tickets.
```

```
According to specs/02_backend_lead.md, what's the error response format?
```

### Use @workspace for Context

Copilot can reference workspace files:

```
@workspace What's the pattern for creating API endpoints in this project?
```

```
@workspace Show me how other components use the Button from design system.
```

### Multi-Step Tasks

Break complex work into steps:

```
I need to implement ticket 4.3 - Create session API endpoint.

Step 1: First, read specs/02_backend_lead.md for the API patterns.
Step 2: Then read specs/04_db_architect.md for the sessions table schema.
Step 3: Update backlog.md to mark 4.3 as 🔄 In Progress.
Step 4: Implement the endpoint following the patterns.
Step 5: Write tests per specs/05_qa_lead.md.
Step 6: Update backlog.md to 🧪 QA Review.
```

---

## Inline Copilot Usage

### Trigger Suggestions

Start typing and Copilot suggests:

```typescript
// Create user service following repository pattern
class UserService {
  // Copilot will suggest based on context
```

### Inline Chat (`Ctrl+I`)

Select code and ask questions:

```
Selected: function validateEmail(email: string)
Prompt: Add Zod validation per specs/02_backend_lead.md
```

### Fix Errors

When you see errors:

```
Prompt: Fix the TypeScript error on line 45
```

---

## Model Selection

GitHub Copilot uses GPT-4 by default. You can't directly select models, but you can guide complexity:

### For Simple Tasks

```
Simple CRUD operation - just follow the existing pattern in user.service.ts
```

### For Complex Tasks

```
This is a complex state machine. Think carefully about edge cases.
Consider: [list scenarios]
```

---

## Copilot Slash Commands

Built-in commands for common tasks:

| Command | Purpose |
|---------|---------|
| `/explain` | Explain selected code |
| `/fix` | Fix errors in selection |
| `/tests` | Generate tests |
| `/doc` | Generate documentation |
| `/simplify` | Simplify code |

### Usage in SDD

```
/tests for this service following specs/05_qa_lead.md patterns
```

```
/explain this function so I can document it in the spec
```

---

## Handling Agent Conflicts

### File Conflicts

Both agents modify `backlog.md`:

**Prevention:**
```
When updating backlog.md, ONLY modify YOUR tickets.
Agent A: tickets ending in odd numbers
Agent B: tickets ending in even numbers
```

### Sync Points

When Agent B needs Agent A's work:

**Agent B Prompt:**
```
Check if ticket [X.3] in backlog.md shows ✅ Done or 🧪 QA Review.
If yes, proceed with [X.4].
If no, work on [X.6] instead.
```

---

## Troubleshooting

### Copilot Ignores Context

If Copilot doesn't follow your project patterns:

1. Ensure `.github/copilot-instructions.md` exists
2. Reference spec files explicitly in prompts
3. Restart chat session for fresh context

### Suggestions Are Wrong

```
That's incorrect. Per specs/02_backend_lead.md, we use [correct pattern].
Please regenerate following the spec.
```

### Chat Runs Out of Context

For long sprints, Copilot may lose context:

1. Start new chat session
2. Re-paste agent initialization prompt
3. Reference specific ticket: "Continue with ticket X.Y"

---

## Tips for SDD Success

1. **Always reference specs** - "Per specs/..." keeps Copilot aligned
2. **Update backlog immediately** - Status tracking keeps you organized
3. **Use dual chats** - Agent A/B doubles velocity
4. **Commit often** - Small commits are easier to review
5. **Run tests** - Verify each ticket before moving on

---

## Next Steps

- [VSCode Setup](./setup.md) - General VSCode configuration
- [Multi-Agent Patterns](../../methodology/05_multi_agent.md) - Advanced workflows
- [Copilot Instructions Template](../../../templates/skills/copilot/instructions.md) - Full template
