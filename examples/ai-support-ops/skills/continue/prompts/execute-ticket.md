---
name: execute-ticket
description: Execute a ticket from the backlog following SDD methodology
invokable: true
---

# Execute Ticket

Execute a single ticket from `specs/backlog.md` following the full SDD workflow.

## Input

The user should provide a ticket ID (e.g., "14.3" or "B.05"). If not provided, ask for it.

## Execution Steps

### 1. Read Backlog
- Open `specs/backlog.md`
- Locate the specified ticket
- Verify it exists and is in 🔲 Todo or ⏸️ Blocked status
- If already ✅ Done or 🔄 In Progress, inform the user and ask how to proceed

### 2. Check Dependencies
- Read the ticket's dependencies field
- Verify all dependency tickets are ✅ Done
- If any dependency is not complete, report which ones are blocking and set status to ⏸️ Blocked

### 3. Read Documentation
- Identify which area the ticket affects (CLI, viewer, methodology, deployment, etc.)
- Read the relevant `docs/` section before making any changes
- Read the relevant spec files referenced by the ticket

### 4. Update Status to In Progress
- Set the ticket status to 🔄 In Progress in `specs/backlog.md`

### 5. Read Specification
- Read the full spec file(s) that define the expected behavior
- Understand acceptance criteria from the ticket
- Note any constraints from `specs/04-non-functional-requirements.md` if relevant

### 6. Implement
- Write code that fulfills all acceptance criteria
- Follow conventions: TypeScript strict, Zod validation, repository→service→controller
- Add or update tests for new/changed functionality
- Keep changes focused on the ticket scope — avoid unrelated refactors

### 7. QA Verification
- Run the appropriate test commands based on change type:
  - CLI: `cd cli && npm run build && npm test`
  - Viewer: `cd viewer && npm run build`
  - Full-stack: both of the above
- Verify all acceptance criteria are met
- Check for regressions

### 8. Update Documentation
- Update the relevant `docs/` section to reflect changes
- If a new subsystem was created, create its `docs/<subsystem>/` directory

### 9. Update Backlog
- Set ticket status to ✅ Done in `specs/backlog.md`
- Add any notes about implementation decisions

## Output

Report:
- Ticket ID and title
- What was implemented
- Tests run and results
- Documentation updated
- Any follow-up items discovered
