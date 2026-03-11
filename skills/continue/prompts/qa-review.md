---
name: qa-review
description: QA review completed tickets with change-appropriate verification
invokable: true
---

# QA Review

Perform QA review on completed tickets, scaling verification to the type of change.

## Input

The user should provide a ticket ID or "all" to review all 🧪 QA Review tickets. If not provided, scan for tickets in 🧪 status.

## Review Process

### 1. Identify Tickets
- Read `specs/backlog.md`
- Find tickets in 🧪 QA Review status (or the specified ticket)
- List them for the user

### 2. Classify Change Type
For each ticket, determine the change type:
- **Bug fix** — reproducing and verifying a fix
- **API change** — contract validation and integration testing
- **UI change** — visual verification and build check
- **DB migration** — data integrity check
- **Docs/config only** — quick review, no runtime testing needed
- **Full-stack** — comprehensive testing required

### 3. Run Verification

**Code Quality Checklist:**
- [ ] No `any` types in TypeScript code
- [ ] No `console.log` statements in production code
- [ ] Proper error handling (try/catch, typed errors)
- [ ] No hardcoded secrets or credentials
- [ ] Input validation with Zod schemas where applicable

**Testing Checklist:**
- [ ] All existing tests pass (`npm test` in affected package)
- [ ] New tests added for new functionality
- [ ] Build succeeds (`npm run build` in affected package)
- [ ] Edge cases considered (null, empty, boundary values)

**Functionality Checklist:**
- [ ] All acceptance criteria from the ticket are met
- [ ] No regressions in existing functionality
- [ ] Changes are scoped to the ticket (no unrelated modifications)

**Security Checklist:**
- [ ] No sensitive data exposed in logs or responses
- [ ] Input sanitization in place
- [ ] Authentication/authorization not bypassed

**Documentation Checklist:**
- [ ] Relevant `docs/` section updated
- [ ] Code comments for complex logic
- [ ] API changes reflected in `specs/06-api-contracts.md` if applicable

### 4. Verdict

For each ticket:
- **PASS** → Update status to ✅ Done in `specs/backlog.md`
- **FAIL** → List specific failures, keep status at 🧪 or revert to 🔄, add notes to ticket

## Output

Summary table:
| Ticket | Title | Verdict | Notes |
|--------|-------|---------|-------|
| X.Y | ... | PASS/FAIL | ... |
