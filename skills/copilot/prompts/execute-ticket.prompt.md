---
description: "Execute a ticket from the backlog following Spec-Driven Development methodology"
mode: "agent"
---

# Execute Ticket

Execute a ticket from the backlog following SDD methodology.

Ticket to execute: {{input}}

## Instructions

1. **Read the backlog** to find the specified ticket:
   - Read `specs/backlog.md`
   - Locate the ticket by number (e.g., 4.3 = Sprint 4, Ticket 3)
   - Note the ticket's owner, model recommendation, status, and dependencies

2. **Check dependencies**:
   - Verify prerequisite tickets are marked ✅ Done
   - If dependencies are incomplete, notify the user and stop

3. **Read relevant docs FIRST** (before touching code):
   - Check `docs/` for existing documentation related to this ticket's subsystem

4. **Update backlog status**: Change ticket status from 🔲 to 🔄 In Progress in `specs/backlog.md`

5. **Read relevant spec file** based on ticket type:
   - Backend → `specs/02_backend_lead.md`
   - Frontend → `specs/03_frontend_lead.md`
   - Database → `specs/04_db_architect.md`
   - DevOps → `specs/06_devops_lead.md`
   - QA → `specs/05_qa_lead.md`

6. **Implement the ticket**: Follow patterns and conventions from spec files

7. **QA Verification** (MANDATORY — scale to change type):

   | Change Type | QA Required |
   |-------------|-------------|
   | Bug fix | Reproduce bug first, apply fix, verify the exact user flow passes |
   | API change | Run API test suite. If new endpoint, demonstrate it works |
   | UI change | Run UI tests. Verify page renders correctly |
   | Database migration | Verify migration applies cleanly, test affected endpoints |
   | Docs/config only | No QA needed — mark ✅ directly |
   | Full-stack feature | Run full test suite. Add test cases if needed |

   ```bash
   npm test                    # Full suite
   npm run build               # Build verification
   ```

8. **Update documentation** (MANDATORY): Update relevant `docs/` section

9. **Update backlog with final status**:
   - QA passes → ✅ Done (or 🧪 QA Review for user verification)
   - Blocked → ⏸️ Blocked with a note

## Output Format

```
## Executing Ticket [X.X]: [Description]

### Dependencies Check
- [x] Ticket X.1 ✅ Done

### Implementation
[Description of what was implemented]

### Files Changed
| File | Change |
|------|--------|

### QA Results
| Suite | Pass | Fail | Notes |
|-------|------|------|-------|

### Documentation Updated
| Doc File | Change |
|----------|--------|

### Status Updated
🔲 Todo → 🔄 In Progress → ✅ Done
```

## Important Rules

- Always read docs and spec files before implementing
- Follow existing code patterns in the project
- Update `specs/backlog.md` status immediately after each phase
- Never skip the dependencies check
- Never skip QA (unless docs/config only)
- Never skip documentation updates
