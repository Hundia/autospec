# AutoSpec Sprint Prompts — Planning, Development, QA, Summary, DoD, Multi-Agent, FinOps

> **What this section covers:** This section defines all sprint prompt templates: planning, development execution, QA testing, summary generation, DoD checklist, and shared multi-agent/finops prompts. Read this when generating sprint prompts.
>
> **When to read:** When generating any file under `prompts/sprint_X/`, or when generating `prompts/multi-agent.md` or `prompts/finops.md`.

---

══════════════════════════════════════════════════════════════
SECTION 5 — SPRINT PROMPTS (Per-Sprint Folder Structure)
══════════════════════════════════════════════════════════════

Generate prompts for EVERY sprint defined in specs/backlog.md. Each sprint
gets its own folder with 4 prompt files. This ensures complete coverage
of the entire project backlog, not just the first sprint.

CRITICAL RULES:
1. Generate prompts for ALL sprints (Sprint 0, 1, 2, ... N) found in backlog.md
2. Each prompt must be COMPLETE and READY TO PASTE — no placeholders
3. Every prompt must begin with files to read for full context
4. Include environment-specific instructions based on {{ENVIRONMENT}}
5. QA prompts must include ACTUAL runnable tests (curl, API calls, etc.)

══════════════════════════════════════════════════════════════
SECTION 5.1 — SPRINT PLAN PROMPT (sprint_plan_X.md)
══════════════════════════════════════════════════════════════

For each sprint, generate prompts/sprint_X/sprint_plan_X.md:

```markdown
# Sprint [X] Planning Guide: [Sprint Name]

## Environment: {{ENVIRONMENT}}

## Sprint Overview
- **Goal:** [One sentence from backlog.md]
- **Duration:** [Estimated based on total story points]
- **Total Tickets:** [Count]
- **Total Story Points:** [Sum]
- **Dependencies:** [List any sprint dependencies]

## Pre-Sprint Checklist
- [ ] Previous sprint(s) complete (if applicable)
- [ ] All spec files reviewed and understood
- [ ] Development environment ready
- [ ] Database running and accessible
- [ ] All team members (or AI agents) briefed

## Tickets Overview
[Table from backlog.md for this sprint]

## Execution Order
Based on dependencies, execute in this order:
1. [Ticket X.1] - No dependencies, start here
2. [Ticket X.2] - Depends on X.1
3. ...

## Definition of Done

### Per-Ticket DoD
Each ticket is DONE when:
- [ ] Implementation complete per spec
- [ ] Unit tests written and passing
- [ ] Integration tests (if applicable)
- [ ] Code follows coding-standards.md
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Committed with message: "Complete X.Y: [description]"
- [ ] Backlog status updated to ✅

### Sprint DoD
Sprint is COMPLETE when:
- [ ] All tickets show ✅ Done status
- [ ] All tests pass: `npm test` exits 0
- [ ] Lint passes: `npm run lint` exits 0
- [ ] Type check passes: `npm run typecheck` exits 0
- [ ] Build succeeds: `npm run build` exits 0
- [ ] QA review complete (see qa_sprint_X.md)
- [ ] Sprint summary created (see summary_sprint_X.md)
- [ ] All changes committed and pushed

## Model Selection Guide (FinOps)
Based on ticket complexity:

| Ticket | Recommended Model | Rationale |
|--------|-------------------|-----------|
[Generate based on ticket content - haiku for simple, sonnet for standard, opus for complex]

## Risk Assessment
- **Blockers:** [Potential blockers identified from dependencies]
- **Complexity:** [High/Medium/Low areas]
- **Integration Points:** [Where different components connect]

## Next Steps
1. Run `dev_sprint_X.md` prompt to execute development
2. After development, run `qa_sprint_X.md` for QA testing
3. Finally, run `summary_sprint_X.md` to generate sprint documentation
```

══════════════════════════════════════════════════════════════
SECTION 5.2 — DEVELOPMENT SPRINT PROMPT (dev_sprint_X.md)
══════════════════════════════════════════════════════════════

For each sprint, generate prompts/sprint_X/dev_sprint_X.md:

```markdown
# Sprint [X] Development Execution: [Sprint Name]

## Environment: {{ENVIRONMENT}}

## Context — Read These Files First

**MANDATORY:** Read ALL these files before writing any code:

### Specs (Read ALL):
- specs/01_product_manager.md   — requirements, personas, user flows
- specs/02_backend_lead.md      — API design, service layer, error handling
- specs/03_frontend_lead.md     — components, state, routing, design tokens
- specs/04_db_architect.md      — database schema, migrations, queries
- specs/05_qa_lead.md           — test strategy, coverage targets
- specs/06_devops_lead.md       — infrastructure, CI/CD, Docker
- specs/10_ui_designer.md       — screens, wireframes, responsive design
- specs/backlog.md              — Sprint [X] tickets (your work items)

### Docs (Read ALL relevant):
- docs/architecture/overview.md     — system architecture
- docs/architecture/backend.md      — backend layer design
- docs/architecture/frontend.md     — frontend component architecture
- docs/architecture/database.md     — ERD, tables, relationships
- docs/architecture/security.md     — auth flow, security rules
- docs/flows/user-journeys.md       — user flow diagrams
- docs/flows/data-flow.md           — data movement patterns
- docs/environments/development.md  — local setup prerequisites
- docs/environments/docker.md       — Docker setup
- docs/environments/environment-variables.md — all env vars
- docs/api/reference.md             — endpoint contracts
- docs/api/curl-examples.md         — curl command examples
- docs/testing/strategy.md          — test pyramid, tooling
- docs/testing/unit-tests.md        — unit test patterns
- docs/testing/integration-tests.md — integration test patterns
- docs/ui-design-system/tokens.md   — design tokens
- docs/project/setup.md             — repo structure, config files
- docs/project/coding-standards.md  — naming conventions, patterns

---

## Your Mission

Execute Sprint [X]: [Sprint Name]

**Goal:** [Sprint goal from backlog.md]

---

## Tickets to Complete

[Full ticket table from backlog.md for this sprint]

---

## Execution Instructions

### For Each Ticket:

1. **Update Status:** Change ticket from 🔲 to 🔄 in specs/backlog.md
2. **Read Relevant Spec:** Find the specific section in the appropriate spec file
3. **Implement:** Write code following patterns in docs/
4. **Test:** Write tests per docs/testing/ patterns
5. **Verify:** Run `npm test`, `npm run lint`, `npm run typecheck`
6. **Commit:** `git commit -m "Complete X.Y: [ticket description]"`
7. **Update Status:** Change ticket from 🔄 to 🧪 in specs/backlog.md

### Ticket-by-Ticket Breakdown:

[For each ticket in this sprint, generate:]

#### Ticket X.Y: [Title]
**Owner:** [Role]  |  **Model:** [haiku/sonnet/opus]  |  **Points:** [N]

**Spec Reference:** specs/[XX]_[role].md, Section: [relevant section]

**Implementation Steps:**
1. [Specific step based on ticket type]
2. [Next step]
3. [...]

**Files to Create/Modify:**
- `src/[path]/[file].ts` — [purpose]
- `src/[path]/[file].test.ts` — [test file]

**Verification:**
```bash
npm test -- [specific test file]
npm run lint
```

**Dependencies:** [List or "None"]

---

## After All Tickets Complete

1. Run full verification:
   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run build
   ```

2. Update all ticket statuses to 🧪 QA Review

3. Commit all changes:
   ```bash
   git add -A
   git commit -m "Complete Sprint [X]: [Sprint Name]"
   ```

4. Proceed to QA: Run prompts/sprint_X/qa_sprint_X.md
```

══════════════════════════════════════════════════════════════
SECTION 5.3 — QA SPRINT PROMPT (qa_sprint_X.md)
══════════════════════════════════════════════════════════════

CRITICAL: QA prompts must include ACTUAL runnable tests, not just static analysis.
Include curl commands, API tests with the server running, and real validation.

For each sprint, generate prompts/sprint_X/qa_sprint_X.md:

```markdown
# Sprint [X] QA Review: [Sprint Name]

## Environment: {{ENVIRONMENT}}

## Context — Read These Files First

**MANDATORY:** Read ALL these files to understand what should be tested:

- specs/* (all 10 specs + backlog.md)
- docs/testing/* (strategy, unit, integration, e2e, test-data)
- docs/api/reference.md — endpoint contracts to verify
- docs/api/curl-examples.md — curl commands to run
- docs/api/error-codes.md — error responses to verify
- docs/architecture/security.md — security requirements
- docs/ui-design-system/accessibility.md — a11y requirements
- docs/workflows/qa-review.md — QA process

---

## QA Mission

Review and test ALL tickets completed in Sprint [X].

**Sprint Goal:** [Sprint goal]
**Tickets to Review:** [Count]

---

## Pre-QA Setup

Before running tests, ensure the environment is ready:

```bash
# 1. Start the database
docker-compose up -d db

# 2. Run migrations
npm run db:migrate

# 3. Seed test data
npm run db:seed

# 4. Start the server (in background or separate terminal)
npm run dev &
# Wait for server to be ready
sleep 5

# 5. Verify server is running
curl http://localhost:3000/health
# Expected: {"status":"ok"}
```

---

## Automated Test Suite

Run the full automated test suite:

```bash
# Unit tests
npm run test:unit
# Expected: All tests pass, coverage > 70%

# Integration tests
npm run test:integration
# Expected: All tests pass

# E2E tests (if applicable)
npm run test:e2e
# Expected: All critical paths pass

# Full test with coverage
npm run test:coverage
# Expected: Coverage report shows > 70% overall
```

---

## API Testing with Curl (MANDATORY)

**IMPORTANT:** These tests MUST be run with the server running.
Do not skip this section — it validates real API behavior.

[For each API endpoint added/modified in this sprint, generate:]

### Test: [Endpoint Name]

**Endpoint:** [METHOD] [PATH]
**Spec Reference:** specs/02_backend_lead.md, Section: [section]

#### Happy Path Test
```bash
# [Description of what this tests]
curl -X [METHOD] http://localhost:3000/api/v1/[path] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "field1": "value1",
    "field2": "value2"
  }'

# Expected Response (HTTP [STATUS]):
# {
#   "id": "...",
#   "field1": "value1",
#   ...
# }
```

#### Validation Error Test
```bash
# Test missing required fields
curl -X [METHOD] http://localhost:3000/api/v1/[path] \
  -H "Content-Type: application/json" \
  -d '{}'

# Expected Response (HTTP 400):
# {
#   "error": "Validation failed",
#   "details": [...]
# }
```

#### Authentication Test
```bash
# Test without auth token
curl -X [METHOD] http://localhost:3000/api/v1/[path] \
  -H "Content-Type: application/json"

# Expected Response (HTTP 401):
# {
#   "error": "Unauthorized"
# }
```

#### Edge Case Tests
```bash
# [Specific edge case for this endpoint]
curl -X [METHOD] http://localhost:3000/api/v1/[path] \
  -H "Content-Type: application/json" \
  -d '{ ... }'

# Expected: [Expected behavior]
```

---

## Frontend Testing (if applicable)

### Component Tests
```bash
# Run component tests
npm run test:components

# Expected: All component tests pass
```

### Visual Verification Checklist
- [ ] Page renders without errors
- [ ] All components display correctly
- [ ] Responsive design works (mobile/tablet/desktop)
- [ ] Loading states display properly
- [ ] Error states handled gracefully
- [ ] Forms validate correctly
- [ ] Navigation works as expected

### Accessibility Tests
```bash
# Run accessibility audit
npm run test:a11y

# Or manually with axe-core in browser
```

- [ ] Color contrast meets WCAG AA
- [ ] All interactive elements focusable
- [ ] Screen reader compatible
- [ ] Keyboard navigation works

---

## Per-Ticket QA Review

[For each ticket in this sprint, generate:]

### Ticket X.Y: [Title]

#### Code Quality Checklist
- [ ] Follows coding standards (docs/project/coding-standards.md)
- [ ] No console.log/print in production code
- [ ] Error handling implemented
- [ ] No hardcoded values (uses constants/env)
- [ ] TypeScript types correct (no `any`)
- [ ] No obvious security issues

#### Testing Checklist
- [ ] Unit tests written and pass
- [ ] Integration tests (if API endpoint)
- [ ] Edge cases covered
- [ ] Test coverage adequate

#### Functionality Checklist
- [ ] Works as specified in spec
- [ ] Handles error states gracefully
- [ ] No regressions to existing features

#### Security Checklist (if applicable)
- [ ] Input validation present
- [ ] Auth/authz enforced
- [ ] No injection vulnerabilities
- [ ] Sensitive data protected

#### QA Result
- **Status:** [PASS/FAIL]
- **Issues Found:** [List or "None"]
- **Notes:** [Any observations]

---

## QA Summary

### Test Results
| Category | Passed | Failed | Coverage |
|----------|--------|--------|----------|
| Unit Tests | X/X | 0 | XX% |
| Integration Tests | X/X | 0 | XX% |
| API Curl Tests | X/X | 0 | N/A |
| E2E Tests | X/X | 0 | N/A |

### Issues Found
| Ticket | Issue | Severity | Action |
|--------|-------|----------|--------|
[List any issues or "No issues found"]

### Overall Verdict
- [ ] **PASS** — All tests pass, ready for release
- [ ] **FAIL** — Issues found, needs fixes

---

## Post-QA Actions

### If PASS:
1. Update all ticket statuses from 🧪 to ✅ in specs/backlog.md
2. Run summary_sprint_X.md to generate sprint documentation
3. Merge to main branch

### If FAIL:
1. Document issues in Bug Backlog section of specs/backlog.md
2. Keep tickets in 🧪 status
3. Fix issues and re-run QA

---

## Cleanup

```bash
# Stop the server
pkill -f "npm run dev" || true

# Stop Docker services
docker-compose down
```
```

══════════════════════════════════════════════════════════════
SECTION 5.4 — SPRINT SUMMARY PROMPT (summary_sprint_X.md)
══════════════════════════════════════════════════════════════

For each sprint, generate prompts/sprint_X/summary_sprint_X.md:

```markdown
# Sprint [X] Summary Generation: [Sprint Name]

## Context

Read these files to generate the sprint summary:
- specs/backlog.md — ticket statuses and details
- All commit messages from this sprint
- QA results from qa_sprint_X.md execution

---

## Generate Sprint Documentation

Create the following files in sprints/sprint_X/:

### 1. sprints/sprint_X/qa_result.md

```markdown
# Sprint [X] QA Results

**Sprint:** [X] - [Sprint Name]
**QA Date:** [Date]
**QA Status:** [PASS/FAIL]

## Test Summary

| Category | Passed | Failed | Skipped | Coverage |
|----------|--------|--------|---------|----------|
| Unit Tests | [X] | [X] | [X] | [XX]% |
| Integration Tests | [X] | [X] | [X] | [XX]% |
| E2E Tests | [X] | [X] | [X] | N/A |
| API Tests (curl) | [X] | [X] | [X] | N/A |

## Per-Ticket Results

| Ticket | Title | QA Status | Issues |
|--------|-------|-----------|--------|
[For each ticket in sprint]

## Issues Found

[List any issues discovered during QA]

## Security Review

- [ ] No vulnerabilities found
- [ ] Auth/authz working correctly
- [ ] Input validation in place
- [ ] No sensitive data exposed

## Performance Notes

[Any performance observations]

## Recommendations

[Any recommendations for future sprints]
```

### 2. sprints/sprint_X/release_notes.md

```markdown
# Release Notes: Sprint [X] - [Sprint Name]

**Version:** [X].0.0
**Release Date:** [Date]

## 🎉 What's New

### Features
[List new features implemented in this sprint]
- **[Feature Name]:** [Description]

### Improvements
[List improvements]
- [Improvement description]

### Bug Fixes
[List any bugs fixed]
- Fixed: [Bug description]

## 📊 Sprint Statistics

- **Tickets Completed:** [X]/[X]
- **Story Points Delivered:** [X]
- **Test Coverage:** [XX]%

## 🔧 Technical Changes

### Database
[List any schema changes]

### API
[List new or modified endpoints]

### Frontend
[List new pages/components]

## ⚠️ Known Issues

[List any known issues or limitations]

## 📋 Upgrade Notes

[Any notes for upgrading from previous version]

## 🙏 Contributors

[List contributors or agents that worked on this sprint]
```

### 3. sprints/sprint_X/summary.md

```markdown
# Sprint [X] Summary: [Sprint Name]

**Sprint Duration:** [Start Date] - [End Date]
**Status:** COMPLETE

## Sprint Goal

[Sprint goal from backlog.md]

**Goal Achieved:** [Yes/No/Partial]

## Completed Tickets

| # | Ticket | Owner | Model | Points | Status |
|---|--------|-------|-------|--------|--------|
[All tickets from this sprint with final status]

## Metrics

- **Velocity:** [X] story points
- **Completion Rate:** [X]%
- **QA Pass Rate:** [X]%
- **Bugs Found:** [X]
- **Bugs Fixed:** [X]

## What Went Well

1. [Positive observation]
2. [Positive observation]
3. [Positive observation]

## What Could Be Improved

1. [Improvement area]
2. [Improvement area]

## Blockers Encountered

[List any blockers and how they were resolved]

## Technical Debt Added

[List any shortcuts or debt introduced]

## Lessons Learned

1. [Lesson]
2. [Lesson]

## Next Sprint Preparation

- **Next Sprint:** [X+1] - [Name]
- **Dependencies Resolved:** [Yes/No]
- **Ready to Start:** [Yes/No]

## Files Changed

```
[List of files created/modified in this sprint]
```

## Commits

```
[List of commit messages from this sprint]
```

## Git Tag (CRITICAL FOR TRACEABILITY)

**Tag Name:** `sprint-[X]-complete`
**Tag Command:**
```bash
git tag -a sprint-[X]-complete -m "Sprint [X] Complete: [Sprint Name]"
git push origin sprint-[X]-complete
```

**Why This Matters:**
- Creates a permanent reference point in the repository
- Allows tracing all commits that built this sprint
- Enables rollback to sprint completion state
- Provides clear audit trail for project history

**To view commits in this sprint:**
```bash
# If this is Sprint 0:
git log sprint-0-complete

# If this is Sprint 1+:
git log sprint-[X-1]-complete..sprint-[X]-complete
```
```

---

## After Generating Summary

1. Create the sprints/sprint_X/ folder if it doesn't exist
2. Generate all four files with actual data (qa_result.md, release_notes.md, summary.md, dod_verified.md)
3. Commit the sprint documentation:
   ```bash
   git add sprints/sprint_X/
   git commit -m "Complete Sprint [X]: [Sprint Name]"
   ```
4. **CREATE GIT TAG** to mark this sprint's completion (CRITICAL for traceability):
   ```bash
   git tag -a sprint-[X]-complete -m "Sprint [X] Complete: [Sprint Name]

   Goal: [Sprint goal]
   Tickets completed: [count]
   Story points: [sum]
   QA Status: PASS

   See sprints/sprint_X/summary.md for details"
   ```
5. Push the tag to remote:
   ```bash
   git push origin sprint-[X]-complete
   ```
6. Update specs/backlog.md sprint status to COMPLETE
7. Record the git tag in summary.md under "## Git Tag" section

**IMPORTANT:** The git tag creates a permanent reference point in the repository history.
This allows future developers to:
- Easily find all commits that built this sprint
- Trace back what work was done
- Compare changes between sprints
- Roll back to a specific sprint's state if needed
```

══════════════════════════════════════════════════════════════
SECTION 5.5 — SPRINT DOD CHECKLIST (sprint_dod_checklist_X.md)
══════════════════════════════════════════════════════════════

For each sprint, generate prompts/sprint_X/sprint_dod_checklist_X.md:

```markdown
# Sprint [X] Definition of Done Checklist: [Sprint Name]

## Purpose

This checklist MUST be completed before marking the sprint as COMPLETE.
Run through each item and verify it passes. This creates the dod_verified.md file.

---

## Pre-Completion Verification

Execute these commands and verify they pass:

### Code Quality
```bash
# Lint check - must exit 0
npm run lint
echo "Lint: $([[ $? -eq 0 ]] && echo 'PASS ✅' || echo 'FAIL ❌')"

# Type check - must exit 0
npm run typecheck
echo "Typecheck: $([[ $? -eq 0 ]] && echo 'PASS ✅' || echo 'FAIL ❌')"

# Build - must exit 0
npm run build
echo "Build: $([[ $? -eq 0 ]] && echo 'PASS ✅' || echo 'FAIL ❌')"
```

### Tests
```bash
# Unit tests - must pass
npm run test:unit
echo "Unit Tests: $([[ $? -eq 0 ]] && echo 'PASS ✅' || echo 'FAIL ❌')"

# Integration tests - must pass
npm run test:integration
echo "Integration Tests: $([[ $? -eq 0 ]] && echo 'PASS ✅' || echo 'FAIL ❌')"

# Coverage check - must meet threshold
npm run test:coverage
echo "Coverage: $([[ $? -eq 0 ]] && echo 'PASS ✅' || echo 'FAIL ❌')"
```

### API Tests (with server running)
```bash
# Start server and run curl tests from qa_sprint_X.md
# Document results below
```

---

## Checklist Items

Mark each item as PASS or FAIL:

### Ticket Completion
| Ticket | Title | Tests Pass | Code Quality | Status |
|--------|-------|------------|--------------|--------|
[For each ticket in sprint - verify individually]

### Sprint-Level Verification
- [ ] All tickets show ✅ Done in backlog.md
- [ ] No tickets left in 🔄 or 🧪 status
- [ ] All dependencies resolved
- [ ] No merge conflicts

### Code Quality Verification
- [ ] `npm run lint` exits 0
- [ ] `npm run typecheck` exits 0
- [ ] `npm run build` exits 0
- [ ] No console.log statements in production code
- [ ] No hardcoded secrets or API keys
- [ ] All new code follows coding-standards.md

### Test Verification
- [ ] `npm test` exits 0
- [ ] Unit test coverage ≥ 70%
- [ ] Integration tests pass
- [ ] All API endpoints tested with curl
- [ ] No skipped tests without justification

### Documentation Verification
- [ ] All new code has appropriate comments
- [ ] API changes documented in docs/api/reference.md
- [ ] Database changes documented in docs/architecture/database.md
- [ ] Environment variables documented in docs/environments/environment-variables.md

### Security Verification
- [ ] No new security vulnerabilities introduced
- [ ] Input validation on all new endpoints
- [ ] Auth/authz enforced where required
- [ ] No SQL injection, XSS, or CSRF vulnerabilities

### Git Verification
- [ ] All changes committed
- [ ] Commit messages follow convention
- [ ] No untracked files that should be committed
- [ ] Branch is up to date with main

---

## Final Actions

After all items pass:

1. **Generate sprint documentation:**
   ```bash
   # Run summary_sprint_X.md prompt to create:
   # - sprints/sprint_X/qa_result.md
   # - sprints/sprint_X/release_notes.md
   # - sprints/sprint_X/summary.md
   # - sprints/sprint_X/dod_verified.md
   ```

2. **Create final commit:**
   ```bash
   git add .
   git commit -m "Complete Sprint [X]: [Sprint Name]

   - All tickets completed and verified
   - Tests passing with X% coverage
   - QA review passed
   - DoD checklist verified

   See sprints/sprint_X/ for full documentation"
   ```

3. **Create git tag (CRITICAL):**
   ```bash
   git tag -a sprint-[X]-complete -m "Sprint [X] Complete: [Sprint Name]"
   git push origin sprint-[X]-complete
   ```

4. **Verify tag creation:**
   ```bash
   git tag -l "sprint-*"
   # Should show: sprint-[X]-complete
   ```

---

## DoD Verification Result

**Overall Status:** [PASS/FAIL]
**Verified By:** [Agent/Human]
**Date:** [Date]
**Git Tag:** `sprint-[X]-complete`

**Notes:**
[Any observations or exceptions]
```

══════════════════════════════════════════════════════════════
SECTION 5.6 — SHARED PROMPTS
══════════════════════════════════════════════════════════════

### prompts/multi-agent.md

Two separate prompts (Agent A and Agent B) for parallel execution:

**Agent A (Backend) Prompt:**
```markdown
# Agent A: Backend Development - Sprint [X]

## Your Role
You are Agent A - Backend Lead. You handle:
- Database migrations and schemas
- API endpoints and services
- Backend tests

## Read These Files First
- specs/02_backend_lead.md
- specs/04_db_architect.md
- specs/05_qa_lead.md
- specs/backlog.md (your tickets: Owner = "Backend" or "DB")
- docs/architecture/backend.md
- docs/architecture/database.md
- docs/architecture/security.md
- docs/api/reference.md
- docs/api/authentication.md
- docs/api/error-codes.md
- docs/api/curl-examples.md
- docs/testing/unit-tests.md
- docs/testing/integration-tests.md
- docs/project/coding-standards.md

## Your Tickets
[Filter backlog for Backend/DB owner tickets]

## Rules
1. Update backlog status as you work (🔲 → 🔄 → 🧪)
2. Run tests after each ticket
3. Commit after each ticket
4. Do NOT touch frontend code (src/components, src/pages)
5. Notify when API endpoints are ready for Agent B

## Sync Points
[List dependencies where Agent B needs your output]
```

**Agent B (Frontend) Prompt:**
```markdown
# Agent B: Frontend Development - Sprint [X]

## Your Role
You are Agent B - Frontend Lead. You handle:
- React components and pages
- State management
- Frontend tests

## Read These Files First
- specs/03_frontend_lead.md
- specs/10_ui_designer.md
- specs/05_qa_lead.md
- specs/backlog.md (your tickets: Owner = "Frontend")
- docs/architecture/frontend.md
- docs/flows/user-journeys.md
- docs/ui-design-system/tokens.md
- docs/ui-design-system/components.md
- docs/ui-design-system/layouts.md
- docs/ui-design-system/accessibility.md
- docs/testing/unit-tests.md
- docs/testing/e2e-tests.md
- docs/project/coding-standards.md

## Your Tickets
[Filter backlog for Frontend owner tickets]

## Rules
1. Update backlog status as you work (🔲 → 🔄 → 🧪)
2. Run tests after each ticket
3. Commit after each ticket
4. Do NOT touch backend code (src/services, src/routes, migrations)
5. Check backlog before starting tickets that depend on Agent A

## Sync Points
[List dependencies on Agent A's outputs]
```

**Integration Phase Prompt:**
```markdown
# Integration Phase: Sprint [X]

After both agents complete their tickets:

1. Merge branches if using separate branches
2. Run full test suite: `npm test`
3. Start server and test API integration
4. Run E2E tests: `npm run test:e2e`
5. Fix any integration issues
6. Run QA review: prompts/sprint_X/qa_sprint_X.md
```

### prompts/finops.md

```markdown
# Model Selection Guide (FinOps)

## Model Distribution Target
- **Haiku (40%):** Simple, repetitive tasks
- **Sonnet (45%):** Standard complexity features
- **Opus (15%):** Complex architecture, security, novel algorithms

## Task-to-Model Mapping

### Use Haiku For:
- Database migrations (CREATE TABLE statements)
- Configuration files (tsconfig, eslint, docker)
- Simple CRUD endpoints (no business logic)
- Seed data generation
- Boilerplate code
- Documentation updates
- Simple component shells

### Use Sonnet For:
- Services with business logic
- React components with state
- API endpoints with validation
- Unit and integration tests
- Standard authentication flows
- Form handling
- State management

### Use Opus For:
- System architecture decisions
- Security-critical code (auth, encryption)
- Complex algorithms
- Performance optimization
- Novel problem solving
- Multi-step debugging
- Code review and refactoring

## Cost Estimation

| Model | Cost per 1K tokens | Typical Sprint Usage |
|-------|-------------------|---------------------|
| Haiku | $0.25 | 40% of tokens |
| Sonnet | $3.00 | 45% of tokens |
| Opus | $15.00 | 15% of tokens |

## Sprint Cost Forecast

For a 12-ticket sprint:
- 4 tickets × Haiku = ~$X
- 6 tickets × Sonnet = ~$Y
- 2 tickets × Opus = ~$Z
- **Total:** ~$[X+Y+Z]

**Savings vs all-Opus:** ~60%
**Savings vs all-Sonnet:** ~30%
```

---
*Source: QUICKSTART.md — Part 4 of 7*
