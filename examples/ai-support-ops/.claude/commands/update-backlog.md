# Update Backlog

Modify ticket statuses, add tickets, report bugs, or link documentation.

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
| `docs` | `docs [ticket] [doc_paths]` | `/update-backlog docs 4.3 docs/api/reference.md` |

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
   - Include model recommendation (haiku/sonnet/opus) based on complexity

   ### Bug Report
   - Create bug ticket in Bug Backlog section
   - Format: `B.XX` for bug tickets
   - Reference relevant `docs/` section if applicable
   - Include severity (Critical/High/Medium/Low)

   ### Add Note
   - Find the ticket
   - Add note as blockquote below ticket table

   ### Link Documentation
   - Find the ticket in the backlog
   - Add docs references to the ticket's Docs column
   - Verify the referenced doc files exist

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

### Bug Report
```
## Bug Ticket Created

### Bug
| B.5 | Login fails on Safari 17.x | High | Frontend | 🔲 Todo | `docs/architecture/security.md` |

### Added to Bug Backlog
Reference: docs/architecture/security.md (auth flow section)
```

### Link Documentation
```
## Documentation Linked

### Ticket 4.3
Docs: `docs/api/reference.md`, `docs/architecture/backend.md`
```

## Important Rules

- Always validate ticket numbers exist
- Preserve backlog formatting
- For status changes, only move in valid transitions
- Bug tickets get `B.XX` prefix with incrementing number
- Notes use blockquote format
- Model recommendations follow FinOps: haiku (simple), sonnet (standard), opus (complex)
- Confirm changes after making them
