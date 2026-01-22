# Update Backlog

Modify ticket statuses or add tickets to the backlog.

## Usage

```
/update-backlog [action] [details]
```

### Actions

| Action | Syntax | Example |
|--------|--------|---------|
| `status` | `status [ticket] [new_status]` | `/update-backlog status 4.3 done` |
| `add` | `add [sprint] [description] [owner] [model]` | `/update-backlog add 4 "Add caching" Backend sonnet` |
| `bug` | `bug [description]` | `/update-backlog bug "Login fails on Safari"` |
| `note` | `note [ticket] [text]` | `/update-backlog note 4.3 "Needs API key"` |

### Status Shortcuts

| Input | Status |
|-------|--------|
| `todo`, `t` | 🔲 Todo |
| `progress`, `wip`, `p` | 🔄 In Progress |
| `qa`, `review`, `r` | 🧪 QA Review |
| `done`, `d` | ✅ Done |
| `blocked`, `b` | ⏸️ Blocked |

## Instructions

When this command is invoked:

1. **Parse the action and details**

2. **Read current backlog**:
   - Read `specs/backlog.md`
   - Find the relevant sprint/ticket

3. **Execute the action**:

   ### Status Update
   - Find the ticket in the backlog
   - Change the status emoji
   - Add timestamp comment if significant

   ### Add Ticket
   - Find the target sprint
   - Add new row to ticket table
   - Assign next ticket number

   ### Bug Report
   - Create bug ticket in current sprint or dedicated bugs section
   - Format: `B.X` for bug tickets

   ### Add Note
   - Find the ticket
   - Add note as blockquote below ticket table

4. **Save the backlog**:
   - Write updated content to `specs/backlog.md`

5. **Confirm the change**:
   - Show what was changed
   - Show new ticket state

## Output Format

### Status Update

```
## Backlog Updated

### Change
Ticket 4.3: 🔄 In Progress → ✅ Done

### Current Sprint Status
Sprint 4: 7/10 complete (70%)
```

### Add Ticket

```
## Backlog Updated

### Added Ticket
| 4.11 | Add session caching to reduce DB load | 🔲 Todo | Backend | sonnet |

### Sprint 4 Now Has
11 tickets (7 done, 1 QA, 2 in progress, 1 todo)
```

### Bug Report

```
## Bug Ticket Created

### Bug
| B.3 | BUG: Login fails on Safari 17.x | 🔲 Todo | Frontend | sonnet |

### Details
- Reported during: QA review of ticket 3.5
- Severity: High (blocks Safari users)
- Added to: Sprint 3 bugs section
```

### Add Note

```
## Note Added

### Ticket 4.3 Note
> Requires AWS_SECRET_KEY environment variable to be set.
> Contact DevOps for staging credentials.
```

## Important Rules

- Always validate ticket numbers exist
- Preserve backlog formatting
- For status changes, only move in valid transitions
- Bug tickets get `B.X` prefix
- Notes use blockquote format
- Confirm changes after making them
