# Sprint Status

Display the current sprint status from the backlog.

## Usage

```
/sprint-status
```

## Instructions

When this command is invoked:

1. **Read the backlog**:
   - Read `specs/backlog.md`
   - Find the current active sprint (marked with 🔄 ACTIVE)

2. **Calculate statistics**:
   - Total tickets in sprint
   - Completed (✅ Done)
   - In Progress (🔄)
   - QA Review (🧪)
   - Todo (🔲)
   - Blocked (⏸️)

3. **Display status**:
   ```
   ## Sprint [N]: [Name]

   Progress: [====----] 50% (5/10)

   ✅ Done:        3
   🔄 In Progress: 2
   🧪 QA Review:   1
   🔲 Todo:        3
   ⏸️ Blocked:     1

   ### Next Actions
   - [List of todo tickets]
   ```

4. **Highlight blockers** if any exist

## Output Format

Use visual progress bars and emoji for clarity.
