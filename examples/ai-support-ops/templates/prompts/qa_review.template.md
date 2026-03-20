# QA Review Prompt Template

Use this template to generate QA review prompts after sprint implementation.

---

# QA Review: Sprint {{SPRINT_NUMBER}} - {{SPRINT_NAME}}

**Sprint:** {{SPRINT_NUMBER}} - {{SPRINT_NAME}}
**Review Date:** {{DATE}}
**QA Lead:** {{QA_LEAD_NAME}}

## Overview

Sprint {{SPRINT_NUMBER}} implementation is complete. This QA review validates all tickets meet acceptance criteria, tests pass, and code quality standards are maintained.

## Review Scope

### Sprint Deliverables
{{#each DELIVERABLES}}
- {{this}}
{{/each}}

### Tickets to Verify
| # | Ticket | Implemented By | Status |
|---|--------|----------------|--------|
{{#each TICKETS}}
| {{this.number}} | {{this.description}} | {{this.owner}} | {{this.status}} |
{{/each}}

---

## 1. Automated Testing

### Test Execution Commands

```bash
# Backend tests
cd {{API_PATH}} && npm test

# Frontend tests
cd {{WEB_PATH}} && npm test

# E2E tests (if applicable)
cd {{E2E_PATH}} && npm run test:e2e

# Full test suite
npm test
```

### Expected Coverage Targets

| Area | Target | Threshold |
|------|--------|-----------|
| Backend Unit Tests | {{BACKEND_COVERAGE_TARGET}}% | {{BACKEND_COVERAGE_MIN}}% |
| Frontend Unit Tests | {{FRONTEND_COVERAGE_TARGET}}% | {{FRONTEND_COVERAGE_MIN}}% |
| Integration Tests | {{INTEGRATION_COVERAGE_TARGET}}% | {{INTEGRATION_COVERAGE_MIN}}% |
| E2E Critical Paths | 100% | 100% |

### Test Verification Checklist

- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Coverage meets minimum thresholds
- [ ] No skipped tests without documented reason
- [ ] No flaky tests identified

---

## 2. Functional Verification

### Ticket-by-Ticket Verification

#### {{TICKET_1_NUMBER}}: {{TICKET_1_DESCRIPTION}}

**Acceptance Criteria:**
{{#each TICKET_1_CRITERIA}}
- [ ] {{this}}
{{/each}}

**Verification Steps:**
1. {{VERIFICATION_STEP_1}}
2. {{VERIFICATION_STEP_2}}
3. {{VERIFICATION_STEP_3}}

**Expected Result:** {{TICKET_1_EXPECTED_RESULT}}

**Actual Result:** ________________

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

---

#### {{TICKET_2_NUMBER}}: {{TICKET_2_DESCRIPTION}}

**Acceptance Criteria:**
{{#each TICKET_2_CRITERIA}}
- [ ] {{this}}
{{/each}}

**Verification Steps:**
1. {{VERIFICATION_STEP_1}}
2. {{VERIFICATION_STEP_2}}

**Expected Result:** {{TICKET_2_EXPECTED_RESULT}}

**Actual Result:** ________________

**Status:** [ ] Pass / [ ] Fail / [ ] Blocked

---

## 3. API Testing (Backend)

### Endpoint Verification

| Endpoint | Method | Test Case | Expected | Result |
|----------|--------|-----------|----------|--------|
{{#each API_ENDPOINTS}}
| {{this.endpoint}} | {{this.method}} | {{this.testCase}} | {{this.expected}} | [ ] Pass |
{{/each}}

### API Test Scenarios

#### Happy Path Tests
{{#each HAPPY_PATH_TESTS}}
- [ ] {{this}}
{{/each}}

#### Error Handling Tests
{{#each ERROR_TESTS}}
- [ ] {{this}}
{{/each}}

#### Edge Case Tests
{{#each EDGE_CASE_TESTS}}
- [ ] {{this}}
{{/each}}

---

## 4. UI Testing (Frontend)

### Component Verification

| Component | Renders | Interactive | Accessible | Result |
|-----------|---------|-------------|------------|--------|
{{#each COMPONENTS}}
| {{this.name}} | [ ] | [ ] | [ ] | [ ] Pass |
{{/each}}

### User Flow Verification

#### Flow 1: {{FLOW_1_NAME}}
1. [ ] Navigate to {{FLOW_1_START}}
2. [ ] {{FLOW_1_STEP_1}}
3. [ ] {{FLOW_1_STEP_2}}
4. [ ] Verify {{FLOW_1_END_STATE}}

#### Flow 2: {{FLOW_2_NAME}}
1. [ ] Navigate to {{FLOW_2_START}}
2. [ ] {{FLOW_2_STEP_1}}
3. [ ] Verify {{FLOW_2_END_STATE}}

### Responsive Testing

| Breakpoint | Width | Layout Correct | No Overflow | Result |
|------------|-------|----------------|-------------|--------|
| Mobile | 320px | [ ] | [ ] | [ ] Pass |
| Mobile | 375px | [ ] | [ ] | [ ] Pass |
| Tablet | 768px | [ ] | [ ] | [ ] Pass |
| Desktop | 1024px | [ ] | [ ] | [ ] Pass |
| Large | 1440px | [ ] | [ ] | [ ] Pass |

---

## 5. Integration Testing

### Backend-Frontend Integration

| API Call | Frontend Component | Data Flow | Result |
|----------|-------------------|-----------|--------|
{{#each INTEGRATIONS}}
| {{this.api}} | {{this.component}} | {{this.dataFlow}} | [ ] Pass |
{{/each}}

### Database Integration

- [ ] Data persists correctly after create operations
- [ ] Updates reflect in subsequent reads
- [ ] Deletes properly cascade/clean up
- [ ] Transactions rollback on errors

---

## 6. Security Verification

### Authentication
- [ ] Unauthenticated requests properly rejected (401)
- [ ] Invalid tokens properly rejected
- [ ] Token expiration works correctly
- [ ] Refresh token flow works

### Authorization
- [ ] Users can only access own resources
- [ ] Admin-only endpoints reject regular users (403)
- [ ] Role-based access works correctly

### Input Validation
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized
- [ ] Invalid input returns proper error messages
- [ ] File upload validation (if applicable)

---

## 7. Performance Verification

### Response Time Targets

| Endpoint/Page | Target | Actual | Result |
|---------------|--------|--------|--------|
{{#each PERFORMANCE_TARGETS}}
| {{this.name}} | {{this.target}} | _______ | [ ] Pass |
{{/each}}

### Load Testing (if applicable)
- [ ] Handles {{CONCURRENT_USERS}} concurrent users
- [ ] No memory leaks over {{TEST_DURATION}}
- [ ] Database connection pool stable

---

## 8. Code Quality Review

### Static Analysis
```bash
# Lint check
npm run lint

# Type check
npm run type-check
```

### Code Quality Checklist
- [ ] No lint errors or warnings
- [ ] No TypeScript errors
- [ ] No console.log statements in production code
- [ ] No hardcoded secrets or credentials
- [ ] Proper error handling in place
- [ ] Consistent naming conventions
- [ ] Adequate code comments for complex logic

### Documentation
- [ ] API documentation updated (if applicable)
- [ ] README updated with new features
- [ ] Code comments adequate

---

## 9. Regression Testing

### Critical Paths (Must Pass)
{{#each CRITICAL_PATHS}}
- [ ] {{this}}
{{/each}}

### Smoke Test Suite
```bash
npm run test:smoke
```

### Areas Potentially Affected
{{#each AFFECTED_AREAS}}
- [ ] {{this}} - Verify no regression
{{/each}}

---

## 10. Bug Tracking

### Bugs Found During Review

| # | Severity | Description | Ticket | Blocker? |
|---|----------|-------------|--------|----------|
| B.1 | | | | [ ] |
| B.2 | | | | [ ] |

### Severity Definitions
- **Critical**: System unusable, data loss risk
- **High**: Feature broken, no workaround
- **Medium**: Feature impaired, workaround exists
- **Low**: Minor issue, cosmetic

---

## 11. Sign-Off Criteria

### Sprint {{SPRINT_NUMBER}} Release Criteria

| Criterion | Required | Status |
|-----------|----------|--------|
| All tickets pass functional verification | Yes | [ ] |
| All automated tests pass | Yes | [ ] |
| Coverage meets minimum thresholds | Yes | [ ] |
| No critical or high severity bugs | Yes | [ ] |
| Security verification complete | Yes | [ ] |
| Code quality checks pass | Yes | [ ] |
| Regression tests pass | Yes | [ ] |

### Overall Sprint Status

- [ ] **APPROVED** - Sprint {{SPRINT_NUMBER}} ready for release
- [ ] **CONDITIONAL** - Approved with noted issues (see bugs)
- [ ] **REJECTED** - Critical issues must be resolved

---

## 12. QA Summary

### Test Execution Summary

| Category | Total | Passed | Failed | Skipped |
|----------|-------|--------|--------|---------|
| Unit Tests | | | | |
| Integration Tests | | | | |
| E2E Tests | | | | |
| Manual Tests | | | | |

### Coverage Summary

| Area | Current | Target | Status |
|------|---------|--------|--------|
| Backend | | | |
| Frontend | | | |
| Overall | | | |

### Issues Summary

| Severity | Count | Blockers |
|----------|-------|----------|
| Critical | | |
| High | | |
| Medium | | |
| Low | | |

---

## QA Completion Checklist

- [ ] All verification sections completed
- [ ] Test results documented
- [ ] Bugs logged and prioritized
- [ ] Sign-off criteria evaluated
- [ ] QA summary filled out
- [ ] Backlog updated with final status
- [ ] QA results saved to `sprints/sprint-{{SPRINT_NUMBER}}-*/qa-results.md`

---

*Generated with SDD for All framework*
