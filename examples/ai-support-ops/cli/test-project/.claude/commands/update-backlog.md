# Update Backlog

Update a ticket's status in the backlog.

## Usage

```
/update-backlog [ticket_number] [status]
```

**Example:** `/update-backlog 1.3 done`

## Status Options

| Status | Emoji | Keyword |
|--------|-------|---------|
| Todo | 🔲 | todo |
| In Progress | 🔄 | in_progress, working |
| QA Review | 🧪 | qa, review |
| Done | ✅ | done, complete |
| Blocked | ⏸️ | blocked |

## Instructions

1. **Read the backlog**: Open `specs/backlog.md`
2. **Find the ticket**: Locate by ticket number
3. **Update status**: Change the emoji in the Status column
4. **Update timestamp**: Update "Last Updated" date at top
5. **Confirm change**: Show before/after

## Example

Before: `| 1.3 | Create user API | 🔄 In Progress | Backend | sonnet |`
After:  `| 1.3 | Create user API | ✅ Done | Backend | sonnet |`
