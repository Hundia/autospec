---
description: "QA review a completed ticket or sprint following QA Lead guidelines"
mode: "agent"
---

# QA Review

Review completed tickets following QA Lead guidelines with change-appropriate verification.

Target to review: {{input}}

## Instructions

1. **Read QA standards**: Read `specs/05_qa_lead.md` for quality guidelines

2. **Identify tickets to review**:
   - Read `specs/backlog.md`
   - Find tickets with 🧪 QA Review status
   - If specific ticket provided, review only that one
   - If "sprint X" provided, review all 🧪 tickets in that sprint

3. **Scale QA to change type**:

   | Change Type | QA Required |
   |-------------|-------------|
   | Bug fix | Reproduce the bug first, apply fix, verify the exact user flow passes |
   | API change | Run API tests. Test via curl with happy path + error cases |
   | UI change | Run UI/component tests. Verify rendering |
   | Database migration | Verify migration applies cleanly, test affected endpoints |
   | Docs/config only | No QA needed — mark ✅ directly |
   | Full-stack feature | Run full test suite. Add test cases if coverage gaps exist |

4. **For each ticket, verify**:

   ### Code Quality
   - [ ] Follows project coding standards
   - [ ] No debug statements left
   - [ ] Error handling implemented
   - [ ] No hardcoded secrets/URLs
   - [ ] TypeScript types correct (no `any`)

   ### Testing
   - [ ] Tests written and pass
   - [ ] Edge cases covered
   - [ ] Tests are meaningful (not just coverage padding)

   ### Functionality
   - [ ] Feature works as specified in the linked spec
   - [ ] Handles error states gracefully
   - [ ] No regressions to existing features

   ### Documentation
   - [ ] Relevant `docs/` section updated
   - [ ] API/schema changes documented

5. **Run tests**:
   ```bash
   npm test
   npm run build
   ```

6. **Update backlog**:
   - **PASS**: Change status 🧪 → ✅ Done
   - **FAIL**: Keep at 🧪, create bug ticket (B.XX), document issues

## Output Format

```
## QA Review: Ticket [X.X] — [Title]

### Change Type: [Bug fix / API / UI / Full-stack]

### Checklist Results
#### Code Quality — [PASS/FAIL]
#### Testing — [PASS/FAIL]
#### Functionality — [PASS/FAIL]
#### Documentation — [PASS/FAIL]

### Test Results
| Suite | Pass | Fail |
|-------|------|------|

### Verdict: ✅ PASS / ❌ FAIL

### Issues Found
[List or "None"]

### Status Updated
🧪 QA Review → ✅ Done
```

## Important Rules

- Be thorough — this is the last gate before "done"
- Run ACTUAL tests, don't just check if files exist
- Scale QA effort to change type
- Create bug tickets (B.XX) for any issues found
- For bug fixes: MUST reproduce the original bug before verifying the fix
