# SPEC: QA Lead

**Version:** 1.0
**Created:** 2026-01-21
**Owner:** QA Team

---

## 1. Testing Strategy

### Test Pyramid

```
         /\
        /  \
       / E2E\       <- Few, critical paths
      /------\
     /  Integ \     <- Medium, API & DB
    /----------\
   /    Unit    \   <- Many, fast
  /--------------\
```

### Coverage Targets
- Unit Tests: 80%+
- Integration Tests: Key APIs
- E2E Tests: Critical user flows

---

## 2. Test Types

### Unit Tests
- Test individual functions/components
- Mock external dependencies
- Run: `npm test`

### Integration Tests
- Test API endpoints with database
- Use test database
- Run: `npm run test:integration`

### E2E Tests
- Test complete user flows
- Use Playwright/Cypress
- Run: `npm run test:e2e`

---

## 3. QA Process

### Definition of Done
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] No console errors
- [ ] Code reviewed
- [ ] Documentation updated

### Bug Reporting Format
```
**Bug:** [Brief description]
**Steps to Reproduce:**
1. ...
**Expected:** ...
**Actual:** ...
**Severity:** Critical/High/Medium/Low
```

---

*This spec is maintained by the QA team. Last updated: 2026-01-21*
