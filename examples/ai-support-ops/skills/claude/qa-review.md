# QA Review

Review completed tickets following the QA Lead guidelines with change-appropriate verification.

## Usage

```
/qa-review [ticket_number or "sprint X"]
```

**Examples:**
- `/qa-review 4.3` - Review single ticket
- `/qa-review sprint 4` - Review all 🧪 QA Review tickets in Sprint 4

## Instructions

When this command is invoked:

1. **Read QA standards**:
   - Read `specs/05_qa_lead.md` for quality guidelines
   - Read `docs/testing/strategy.md` for test patterns
   - Understand Definition of Done checklist

2. **Identify tickets to review**:
   - Read `specs/backlog.md`
   - Find tickets with 🧪 QA Review status
   - If specific ticket provided, review only that one

3. **Scale QA to change type**:

   | Change Type | QA Required |
   |-------------|-------------|
   | **Bug fix** | Reproduce the bug first, apply fix, verify the exact user flow passes |
   | **API change** | Run API tests. If new endpoint, test via curl with happy path + error cases |
   | **UI change** | Run UI/component tests. Verify rendering on target viewports |
   | **Database migration** | Verify migration applies cleanly, test affected API endpoints |
   | **Docs/config only** | No QA needed — mark ✅ directly |
   | **Full-stack feature** | Run full test suite. Add test cases if coverage gaps exist |

4. **For each ticket, verify**:

   ### Code Quality
   - [ ] Follows project coding standards (`docs/project/coding-standards.md`)
   - [ ] No console.log/print statements left
   - [ ] Error handling implemented
   - [ ] No hardcoded secrets/URLs
   - [ ] TypeScript types correct (no `any`)

   ### Testing
   - [ ] Unit tests written and pass
   - [ ] Integration tests if applicable
   - [ ] Edge cases covered
   - [ ] Tests are meaningful (not just coverage padding)

   ### Functionality
   - [ ] Feature works as specified in the linked spec
   - [ ] Handles error states gracefully
   - [ ] No regressions to existing features

   ### Security (if applicable)
   - [ ] Input validation present
   - [ ] Auth/authz enforced where needed
   - [ ] No SQL injection, XSS, or CSRF vulnerabilities

   ### Documentation
   - [ ] Relevant `docs/` section updated
   - [ ] API changes documented in `docs/api/reference.md`
   - [ ] Database changes documented in `docs/architecture/database.md`

5. **Run tests**:
   ```bash
   npm test                    # Full suite
   npm run test:unit           # Unit only
   npm run test:integration    # Integration only
   npm run test:e2e            # E2E if applicable
   ```

6. **Update backlog**:
   - **If PASS**: Change status 🧪 QA Review → ✅ Done
   - **If FAIL**: Keep at 🧪, create bug ticket (`B.XX`), document issues

## Output Format

```
## QA Review: Ticket [X.X] — [Title]

### Change Type: [Bug fix / API change / UI change / Full-stack]

### Checklist Results

#### Code Quality
- [x] Follows coding standards
- [x] No debug statements
- [x] Error handling present
- [x] No hardcoded values
- [x] Types correct

#### Testing
- [x] Unit tests pass (X/X)
- [x] Integration tests pass (X/X)
- [x] Edge cases covered

#### Functionality
- [x] Works as specified
- [x] Error states handled
- [x] No regressions

#### Documentation
- [x] docs/api/reference.md updated
- [x] docs/architecture/database.md updated

### Test Results
| Suite | Pass | Fail | Coverage |
|-------|------|------|----------|
| Unit | X | 0 | XX% |
| Integration | X | 0 | XX% |

### Verdict: ✅ PASS

### Issues Found
None

### Status Updated
🧪 QA Review → ✅ Done
```

## Important Rules

- Be thorough — this is the last gate before "done"
- Run ACTUAL tests, don't just check if files exist
- Scale QA effort to change type (don't over-test config changes)
- Create bug tickets (B.XX) for any issues found
- Document all findings even if passing
- Verify documentation was updated alongside code
- For bug fixes: MUST reproduce the original bug before verifying the fix
