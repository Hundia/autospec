---
description: "Execute a ticket from the backlog (designed to work as a /fleet subagent or standalone)"
mode: "agent"
---

# Execute Ticket

Execute a ticket from the backlog following SDD methodology.

> **Fleet-compatible:** This prompt is designed to work both standalone AND as a subagent task dispatched by `/fleet` from `sprint-run`. When running as a subagent, respect the file ownership boundaries in your brief.

Ticket to execute: {{input}}

---

## Instructions

### Step 1: Read context

1. **Read `specs/backlog.md`** — locate the ticket by number (e.g., 4.3 = Sprint 4, Ticket 3)
2. Note the ticket's owner, model recommendation, status, and dependencies
3. **If running as a `/fleet` subagent:** Your brief specifies which files you may/must not modify. Respect those boundaries strictly.

### Step 2: Check dependencies

- Verify prerequisite tickets are marked ✅ Done
- If dependencies are incomplete:
  - **Standalone:** Notify the user and stop
  - **As subagent:** Report back that the ticket is blocked

### Step 3: Read docs first (before touching code)

- Check `docs/` for existing documentation related to this ticket's subsystem
- Read the relevant spec file based on ticket type:

| Ticket Type | Spec File |
|-------------|-----------|
| Backend | `specs/02_backend_lead.md` |
| Frontend | `specs/03_frontend_lead.md` |
| Database | `specs/04_db_architect.md` |
| DevOps | `specs/06_devops_lead.md` |
| QA | `specs/05_qa_lead.md` |

### Step 4: Update backlog status

Change ticket status from 🔲 to 🔄 In Progress in `specs/backlog.md`.

> **Fleet safety:** Only modify YOUR ticket's row. Do not touch other tickets' rows — other subagents may be updating them simultaneously.

### Step 5: Implement

Follow patterns and conventions from spec files. Only modify files listed in your ownership scope (if running as subagent).

### Step 6: QA Verification (MANDATORY)

Scale to change type:

| Change Type | QA Required |
|-------------|-------------|
| Bug fix | Reproduce bug first, apply fix, verify the exact user flow passes |
| API change | Run API test suite. If new endpoint, demonstrate it works |
| UI change | Run UI tests. Verify page renders correctly |
| Database migration | Verify migration applies cleanly, test affected endpoints |
| Docs/config only | No QA needed — mark ✅ directly |
| Full-stack feature | Run full test suite. Add test cases if needed |

```bash
npm test
npm run build
```

### Step 7: Update documentation (MANDATORY)

Update the relevant `docs/` section for your changes.

### Step 8: Update backlog with final status

- QA passes → change status to ✅ Done (or 🧪 QA Review for user verification)
- Blocked → change status to ⏸️ Blocked with a note
- **Fleet safety:** Only modify YOUR ticket's row

---

## Output Format

```
## Ticket [X.X]: [Description] — ✅ Done

### Dependencies: [all met / blocked on X.Y]

### Implementation
[What was implemented]

### Files Changed
| File | Change |
|------|--------|

### Files NOT Modified (fleet boundary)
[List files you intentionally did not touch due to subagent boundaries, or "N/A — standalone"]

### QA Results
| Suite | Pass | Fail | Notes |
|-------|------|------|-------|

### Documentation Updated
| Doc File | Change |
|----------|--------|

### Status: 🔲 → 🔄 → ✅
```

---

## Important Rules

- Always read docs and spec files before implementing
- Follow existing code patterns in the project
- Update `specs/backlog.md` status after each phase — **only your ticket's row**
- Never skip dependencies check
- Never skip QA (unless docs/config only)
- Never skip documentation updates
- **When running as a `/fleet` subagent:**
  - Only modify files explicitly assigned to you
  - Do NOT modify shared config files (barrel exports, index files) — the orchestrator handles those
  - If you discover you need to modify a file outside your scope, note it in your output and let the orchestrator handle it
  - Do NOT update other tickets' status rows in `specs/backlog.md`
