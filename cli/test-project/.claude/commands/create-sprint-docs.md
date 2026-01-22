# Create Sprint Docs

Create documentation for a completed sprint.

## Usage

```
/create-sprint-docs [sprint_number]
```

**Example:** `/create-sprint-docs 0`

## Instructions

1. **Verify sprint completion**:
   - All tickets should be ✅ Done
   - No blockers remaining

2. **Create sprint folder**:
   - `sprints/sprint-[N]-[name]/`

3. **Generate documents**:
   - `summary.md` - Sprint overview
   - `qa-results.md` - Test results
   - `release-notes.md` - User-facing changes

4. **Update backlog**:
   - Mark sprint as ✅ COMPLETE
   - Add retrospective notes
