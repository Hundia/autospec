---
name: Backlog-First Development
globs: "specs/**/*"
alwaysApply: true
description: Every change must be tracked in the backlog before implementation
---

# Backlog-First Development

## Mandatory Tracking

Every fix, feature, or change **MUST** be tracked in `specs/backlog.md` before or during implementation. No exceptions unless the user explicitly says "skip backlog" or "don't track this".

## Ticket Classification

1. **Determine the ticket type:**
   - **Bug (B.XX)** — something broken that needs fixing
   - **Feature** — new capability not yet in the system
   - **Enhancement** — improvement to existing functionality

2. **Add the ticket** to the appropriate sprint section in `specs/backlog.md`

3. **Update status** as work progresses:
   - Set to 🔄 In Progress when starting work
   - Set to 🧪 QA Review when implementation is complete
   - Set to ✅ Done when verified and complete
   - Set to ⏸️ Blocked if waiting on a dependency

## Living Documentation

Every implemented feature **MUST** update the corresponding `docs/` section:

| Change Area | Documentation Target |
|-------------|---------------------|
| Viewer changes | `docs/viewer/` |
| CLI changes | `docs/cli/` |
| Methodology changes | `docs/methodology/` |
| Deployment changes | `docs/deployment/` |
| New subsystem | Create new `docs/<subsystem>/` directory |

## FinOps Model Selection

Choose the appropriate model tier for each task to optimize cost:

| Model Tier | Usage % | Use For |
|-----------|---------|---------|
| Haiku (fast/cheap) | ~40% | Simple lookups, status checks, formatting, doc reads |
| Sonnet (balanced) | ~45% | Implementation, code review, testing, most development |
| Opus (powerful) | ~15% | Architecture decisions, complex debugging, sprint planning |

## Ticket Format

```markdown
### X.Y Ticket Title
- **Status:** 🔲 Todo
- **Assignee:** [agent or user]
- **Dependencies:** [ticket IDs or "none"]
- **Description:** Brief description of the work
- **Acceptance Criteria:**
  - [ ] Criterion 1
  - [ ] Criterion 2
```
