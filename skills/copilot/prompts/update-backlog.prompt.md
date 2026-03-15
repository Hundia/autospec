---
description: "Modify ticket statuses, add tickets, report bugs, or link documentation in the backlog"
mode: "agent"
---

# Update Backlog

Modify ticket statuses, add tickets, report bugs, or link documentation.

Action and details: {{input}}

## Actions

| Action | Syntax | Example |
|--------|--------|---------|
| `status` | `status [ticket] [new_status]` | `status 4.3 done` |
| `add` | `add [sprint] [description] [owner] [model]` | `add 4 "Add caching" Backend sonnet` |
| `bug` | `bug [description]` | `bug "Login fails on Safari"` |
| `note` | `note [ticket] [text]` | `note 4.3 "Needs API key"` |
| `docs` | `docs [ticket] [doc_paths]` | `docs 4.3 docs/api/reference.md` |

## Status Shortcuts

| Input | Status |
|-------|--------|
| `todo`, `t` | 🔲 Todo |
| `progress`, `wip`, `p` | 🔄 In Progress |
| `qa`, `review`, `r` | 🧪 QA Review |
| `done`, `d` | ✅ Done |
| `blocked`, `b` | ⏸️ Blocked |

## Instructions

1. **Parse the action and details** from the input
2. **Read `specs/backlog.md`** — find the relevant sprint/ticket
3. **Execute the action**:
   - **Status Update**: Find ticket, change status emoji
   - **Add Ticket**: Find sprint, add new row with next ticket number, include model recommendation
   - **Bug Report**: Create `B.XX` ticket in Bug Backlog section with severity
   - **Add Note**: Find ticket, add note as blockquote below ticket table
   - **Link Docs**: Find ticket, add docs references to Docs column
4. **Save** updated content to `specs/backlog.md`
5. **Confirm** the change with what was modified

## Important Rules

- Always validate ticket numbers exist
- Preserve backlog formatting
- Bug tickets get `B.XX` prefix with incrementing number
- Model recommendations follow FinOps: small (simple), medium (standard), large (complex)
- Confirm changes after making them
