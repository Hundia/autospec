---
name: update-backlog
description: Modify ticket statuses, add tickets, report bugs, or link documentation
invokable: true
---

# Update Backlog

Modify `specs/backlog.md` to update ticket statuses, add new tickets, report bugs, or link documentation.

## Input

The user should specify an action and relevant details. If not clear, ask which action they want.

## Actions

### Status Update
Change a ticket's status emoji in `specs/backlog.md`.

**Status shortcuts:**
| Shortcut | Status | Emoji |
|----------|--------|-------|
| `todo` | Todo | 🔲 |
| `start` / `wip` | In Progress | 🔄 |
| `qa` / `review` | QA Review | 🧪 |
| `done` | Done | ✅ |
| `block` / `blocked` | Blocked | ⏸️ |

**Steps:**
1. Open `specs/backlog.md`
2. Find the ticket by ID
3. Replace the status emoji
4. Save the file

### Add Ticket
Add a new ticket to the backlog.

**Steps:**
1. Determine the sprint section (current or next)
2. Determine the ticket number (next available in that sprint)
3. Classify: feature, enhancement, or bug (B.XX)
4. Add the ticket with this format:
```markdown
### X.Y Ticket Title
- **Status:** 🔲 Todo
- **Dependencies:** [ticket IDs or "none"]
- **Description:** What needs to be done
- **Acceptance Criteria:**
  - [ ] Criterion 1
  - [ ] Criterion 2
```

### Report Bug
Add a bug ticket to the backlog.

**Steps:**
1. Assign the next available B.XX number
2. Document: what's broken, steps to reproduce, expected vs actual behavior
3. Add to the current sprint's bug section or create one

### Add Note
Add a note or comment to an existing ticket.

**Steps:**
1. Find the ticket by ID
2. Append the note under the ticket's description

### Link Documentation
Link a documentation file to a ticket.

**Steps:**
1. Find the ticket by ID
2. Add a docs reference to the ticket

## Output

Report what was changed in `specs/backlog.md` with before/after status if applicable.
