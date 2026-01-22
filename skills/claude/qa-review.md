# QA Review

Review completed tickets following the QA Lead guidelines.

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
   - Understand Definition of Done checklist

2. **Identify tickets to review**:
   - Read `specs/backlog.md`
   - Find tickets with 🧪 QA Review status
   - If specific ticket provided, review only that one

3. **For each ticket, verify**:

   ### Code Quality
   - [ ] Follows project coding standards
   - [ ] No console.log/print statements left
   - [ ] Error handling implemented
   - [ ] No hardcoded secrets/URLs
   - [ ] TypeScript types are correct (no `any`)

   ### Testing
   - [ ] Unit tests written and pass
   - [ ] Integration tests if applicable
   - [ ] Edge cases covered
   - [ ] Tests are meaningful (not just coverage)

   ### Functionality
   - [ ] Feature works as specified in the linked spec
   - [ ] Works on target viewport/devices (if UI)
   - [ ] Handles error states gracefully
   - [ ] No regressions to existing features

   ### Security (if applicable)
   - [ ] Input validation present
   - [ ] Auth/authz enforced where needed
   - [ ] No SQL injection vulnerabilities
   - [ ] No XSS vulnerabilities

   ### Documentation
   - [ ] Code comments where needed
   - [ ] API documentation updated (if endpoints added)

4. **Run tests**:
   - Execute relevant test suites
   - Report results

5. **Update backlog**:
   - **If PASS**: Change status 🧪 QA Review → ✅ Done
   - **If FAIL**: Keep at 🧪, create bug ticket, document issues

## Output Format

```
## QA Review: Ticket [X.X]

### Checklist Results

#### Code Quality
- [x] Follows coding standards
- [x] No debug statements
- [x] Error handling present
- [x] No hardcoded values

#### Testing
- [x] Unit tests pass (X/X)
- [x] Integration tests pass
- [x] Edge cases covered

#### Functionality
- [x] Works as specified
- [x] Error states handled

#### Security
- [x] Input validation
- [x] Auth enforced

### Test Results
```
npm test
✓ 12 tests passed
```

### Verdict: ✅ PASS / ❌ FAIL

### Issues Found (if any)
1. [Issue description]
   - Severity: High/Medium/Low
   - Bug ticket created: B.X

### Status Updated
🧪 QA Review → ✅ Done
```

## Important Rules

- Be thorough - this is the last gate before "done"
- Run actual tests, don't just check if files exist
- Create bug tickets for any issues found
- Document all findings even if passing
- For child-facing features, verify child-appropriate content
