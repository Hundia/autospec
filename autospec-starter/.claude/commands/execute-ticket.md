# Execute Ticket

Execute a ticket from the backlog following Spec-Driven Development methodology.

## Usage

```
/execute-ticket [ticket_number]
```

**Example:** `/execute-ticket 4.3`

## Instructions

**Note:** When running inside an Orchestrator+Agent session, the agent briefing file (`agents/sprint-X-brief.md`) takes precedence over interactive backlog discovery. Read it first.

When this command is invoked:

1. **Read the backlog** to find the specified ticket:
   - Read `specs/backlog.md`
   - Locate the ticket by number (e.g., 4.3 = Sprint 4, Ticket 3)
   - Note the ticket's owner, model recommendation, status, and dependencies

2. **Check dependencies**:
   - Verify prerequisite tickets are marked ✅ Done
   - If dependencies are incomplete, notify the user and stop

3. **Read relevant docs FIRST** (before touching code):
   - Check `docs/` for existing documentation related to this ticket's subsystem
   - Understanding existing architecture prevents rework and regressions

4. **Update backlog status**:
   - Change ticket status from 🔲 Todo to 🔄 In Progress
   - Edit `specs/backlog.md` with the status change

5. **Read relevant spec file** based on ticket type:
   - Backend tickets → `specs/02_backend_lead.md`
   - Frontend tickets → `specs/03_frontend_lead.md`
   - Database tickets → `specs/04_db_architect.md`
   - DevOps tickets → `specs/06_devops_lead.md`
   - QA tickets → `specs/05_qa_lead.md`
   - UI tickets → `specs/10_ui_designer.md`
   - Check for linked feature specs mentioned in the sprint

6. **Implement the ticket**:
   - Follow patterns and conventions from the relevant spec files
   - Write clean, typed code following project standards
   - Add appropriate error handling

7. **QA Verification** (MANDATORY — scale to change type):

   | Change Type | QA Required |
   |-------------|-------------|
   | Bug fix | Reproduce bug first, apply fix, verify the exact user flow passes |
   | API change | Run API test suite. If new endpoint, demonstrate it works via curl/fetch |
   | UI change | Run UI tests. Verify page renders correctly |
   | Database migration | Verify migration applies cleanly, test affected endpoints |
   | Docs/config only | No QA needed — mark ✅ directly |
   | Full-stack feature | Run full test suite. Add test cases if needed |

   ```bash
   # Run relevant tests
   npm test                    # Full suite
   npm run test:unit           # Unit only
   npm run test:integration    # Integration only
   ```

8. **Update documentation** (MANDATORY):
   - Update or create documentation in the relevant `docs/` section
   - Database changes → `docs/architecture/database.md`
   - API changes → `docs/api/reference.md`
   - Frontend changes → `docs/architecture/frontend.md`
   - New flows → `docs/flows/`

9. **Update backlog with final status**:
   - If QA passes: Change status to ✅ Done (or 🧪 QA Review if you want user verification)
   - Add docs references to the ticket description
   - If blocked: Change to ⏸️ Blocked with a note

## Output Format

```
## Executing Ticket [X.X]: [Description]

### Dependencies Check
- [x] Ticket X.1 ✅ Done
- [x] Ticket X.2 ✅ Done

### Implementation
[Description of what was implemented]

### Files Changed
| File | Change |
|------|--------|
| `path/to/file.ts` | [change description] |

### QA Results
| Suite | Pass | Fail | Notes |
|-------|------|------|-------|
| Unit | X | 0 | |
| Integration | X | 0 | |

### Documentation Updated
| Doc File | Change |
|----------|--------|
| `docs/api/reference.md` | Added POST /endpoint |

### Status Updated
🔲 Todo → 🔄 In Progress → ✅ Done
```

## Important Rules

- Always read docs and spec files before implementing
- Follow existing code patterns in the project
- Update backlog.md status immediately after each phase
- Never skip the dependencies check
- Never skip QA (unless docs/config only)
- Never skip documentation updates
- If blocked, update status to ⏸️ Blocked with a note
- Use the model recommended in the backlog for cost efficiency (FinOps)
