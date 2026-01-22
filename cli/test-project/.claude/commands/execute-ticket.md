# Execute Ticket

Execute a ticket from the backlog following Spec-Driven Development methodology.

## Usage

```
/execute-ticket [ticket_number]
```

**Example:** `/execute-ticket 1.3`

## Instructions

When this command is invoked:

1. **Read the backlog** to find the specified ticket:
   - Read `specs/backlog.md`
   - Locate the ticket by number (e.g., 1.3 = Sprint 1, Ticket 3)
   - Understand the ticket description and requirements

2. **Check dependencies**:
   - Verify prerequisite tickets are marked ✅ Done
   - If dependencies are incomplete, notify the user

3. **Read relevant specs** based on ticket type:
   - Backend tickets → `specs/02_backend_lead.md`
   - Frontend tickets → `specs/03_frontend_lead.md`
   - Database tickets → `specs/04_db_architect.md`
   - DevOps tickets → `specs/06_devops_lead.md`

4. **Update backlog status**:
   - Change ticket status from 🔲 Todo to 🔄 In Progress
   - Edit `specs/backlog.md` with the status change

5. **Implement the ticket**:
   - Follow patterns and conventions from the relevant spec files
   - Write clean, typed code following project standards
   - Add appropriate error handling

6. **Write tests** (if applicable):
   - Follow `specs/05_qa_lead.md` for testing guidelines
   - Unit tests for services/utilities
   - Integration tests for API endpoints

7. **Update backlog to QA Review**:
   - Change status from 🔄 In Progress to 🧪 QA Review

8. **Provide completion summary**:
   - List files changed
   - List tests added/modified
   - Note any follow-up items

## Important Rules

- Always read the spec files before implementing
- Follow existing code patterns in the project
- Update backlog.md status immediately after each phase
- Never skip the dependencies check
- If blocked, update status to ⏸️ Blocked with a note
