# Feature Spec: {{FEATURE_NAME}}

**Version:** 1.0
**Created:** {{DATE}}
**Owner:** {{OWNER}}
**Sprint:** {{SPRINT_NUMBER}}

---

## 1. Overview

### Feature Summary

| Attribute | Value |
|-----------|-------|
| Feature Name | {{FEATURE_NAME}} |
| Epic | {{EPIC_NAME}} |
| Priority | {{PRIORITY}} (P0/P1/P2/P3) |
| Estimated Effort | {{EFFORT}} story points |
| Target Sprint | Sprint {{SPRINT_NUMBER}} |

### Problem Statement

{{PROBLEM_STATEMENT}}

### Solution Summary

{{SOLUTION_SUMMARY}}

---

## 2. User Stories

### Primary User Story

```
As a {{USER_TYPE}},
I want to {{ACTION}},
So that {{BENEFIT}}.
```

### Additional User Stories

| # | User Story | Priority | Acceptance Criteria |
|---|------------|----------|---------------------|
| US-1 | As a {{USER}}, I want {{ACTION}} so that {{BENEFIT}} | {{PRIORITY}} | {{CRITERIA}} |
| US-2 | As a {{USER}}, I want {{ACTION}} so that {{BENEFIT}} | {{PRIORITY}} | {{CRITERIA}} |
| US-3 | As a {{USER}}, I want {{ACTION}} so that {{BENEFIT}} | {{PRIORITY}} | {{CRITERIA}} |

---

## 3. Functional Requirements

### Core Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-{{N}}.1 | {{REQUIREMENT}} | Must Have | |
| FR-{{N}}.2 | {{REQUIREMENT}} | Must Have | |
| FR-{{N}}.3 | {{REQUIREMENT}} | Should Have | |
| FR-{{N}}.4 | {{REQUIREMENT}} | Nice to Have | |

### Business Rules

| Rule | Description | Validation |
|------|-------------|------------|
| BR-1 | {{RULE}} | {{VALIDATION}} |
| BR-2 | {{RULE}} | {{VALIDATION}} |
| BR-3 | {{RULE}} | {{VALIDATION}} |

---

## 4. User Interface

### Wireframes/Mockups

```
[Link to designs: {{FIGMA_LINK}}]

Or ASCII mockup:

┌─────────────────────────────────────────────────────────┐
│  Header                                        [User ▼] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   {{FEATURE_NAME}}                                       │
│   ─────────────────                                      │
│                                                          │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│   │   Card 1    │  │   Card 2    │  │   Card 3    │    │
│   │             │  │             │  │             │    │
│   │  [Action]   │  │  [Action]   │  │  [Action]   │    │
│   └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                          │
│                                    [Primary Action]      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### UI Components Required

| Component | New/Existing | Spec Reference |
|-----------|--------------|----------------|
| {{COMPONENT_1}} | New | See below |
| {{COMPONENT_2}} | Existing | `03_frontend_lead.md` |
| {{COMPONENT_3}} | New | See below |

### New Component Specs

#### {{COMPONENT_NAME}}

```tsx
interface {{COMPONENT_NAME}}Props {
  {{prop}}: {{type}};
  {{prop}}: {{type}};
  onChange?: (value: {{type}}) => void;
}
```

**States:**
- Default: {{DESCRIPTION}}
- Loading: {{DESCRIPTION}}
- Error: {{DESCRIPTION}}
- Success: {{DESCRIPTION}}

---

## 5. API Design

### New Endpoints

#### {{METHOD}} {{ENDPOINT}}

**Description:** {{DESCRIPTION}}

**Request:**
```json
{
  "{{field}}": "{{type}}",
  "{{field}}": {{type}}
}
```

**Response (200):**
```json
{
  "data": {
    "id": "uuid",
    "{{field}}": "{{value}}"
  }
}
```

**Error Responses:**

| Code | Scenario | Response |
|------|----------|----------|
| 400 | Invalid input | `{"error": {"code": "VALIDATION_ERROR", ...}}` |
| 401 | Not authenticated | `{"error": {"code": "UNAUTHORIZED", ...}}` |
| 404 | Not found | `{"error": {"code": "NOT_FOUND", ...}}` |

### API Changes to Existing Endpoints

| Endpoint | Change Type | Description |
|----------|-------------|-------------|
| {{ENDPOINT}} | New field | Add `{{field}}` to response |
| {{ENDPOINT}} | New query param | Add `{{param}}` filter |

---

## 6. Data Model

### New Tables/Collections

#### {{TABLE_NAME}}

```sql
CREATE TABLE {{table_name}} (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    {{column}} {{TYPE}} {{CONSTRAINTS}},
    {{column}} {{TYPE}} {{CONSTRAINTS}},
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PK | Unique identifier |
| {{column}} | {{TYPE}} | {{CONSTRAINTS}} | {{DESCRIPTION}} |

### Schema Changes

| Table | Change | Migration |
|-------|--------|-----------|
| {{TABLE}} | Add column `{{column}}` | `ALTER TABLE {{table}} ADD COLUMN {{column}} {{type}}` |
| {{TABLE}} | Add index | `CREATE INDEX idx_{{table}}_{{column}} ON {{table}}({{column}})` |

### Relationships

```
{{TABLE_1}} 1:N {{TABLE_2}}
{{TABLE_2}} N:M {{TABLE_3}}
```

---

## 7. Business Logic

### Process Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  Start  │────►│ Step 1  │────►│ Step 2  │────►│   End   │
│         │     │{{DESC}} │     │{{DESC}} │     │{{DESC}} │
└─────────┘     └────┬────┘     └────┬────┘     └─────────┘
                     │               │
                     ▼               ▼
                ┌─────────┐     ┌─────────┐
                │ Error   │     │ Branch  │
                │ Handler │     │ {{DESC}}│
                └─────────┘     └─────────┘
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| {{FIELD}} | {{RULE}} | "{{MESSAGE}}" |
| {{FIELD}} | {{RULE}} | "{{MESSAGE}}" |

### Service Layer Logic

```typescript
// services/{{feature}}.service.ts

async {{methodName}}(input: {{InputType}}): Promise<{{OutputType}}> {
  // 1. Validate input
  // 2. Check permissions
  // 3. Execute business logic
  // 4. Persist changes
  // 5. Return result
}
```

---

## 8. Testing Requirements

### Unit Tests

| Test Case | Input | Expected Output |
|-----------|-------|-----------------|
| {{TEST_CASE}} | {{INPUT}} | {{OUTPUT}} |
| {{TEST_CASE}} | {{INPUT}} | {{OUTPUT}} |
| {{ERROR_CASE}} | {{INPUT}} | Throws {{ERROR}} |

### Integration Tests

| Scenario | Steps | Expected Result |
|----------|-------|-----------------|
| Happy path | {{STEPS}} | {{RESULT}} |
| Error handling | {{STEPS}} | {{RESULT}} |
| Edge case | {{STEPS}} | {{RESULT}} |

### E2E Test Scenarios

```gherkin
Feature: {{FEATURE_NAME}}

Scenario: {{SCENARIO_NAME}}
  Given {{PRECONDITION}}
  When {{ACTION}}
  Then {{EXPECTED_RESULT}}
```

---

## 9. Non-Functional Requirements

### Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Response time (P95) | < {{TARGET}}ms | API metrics |
| Page load time | < {{TARGET}}s | Lighthouse |
| Database query time | < {{TARGET}}ms | Query logs |

### Scalability

- Expected load: {{EXPECTED_LOAD}}
- Concurrent users: {{CONCURRENT_USERS}}
- Data volume: {{DATA_VOLUME}}

### Security

- [ ] Authentication required: {{YES/NO}}
- [ ] Authorization level: {{LEVEL}}
- [ ] Data sensitivity: {{LEVEL}}
- [ ] Input validation: {{APPROACH}}
- [ ] Rate limiting: {{LIMIT}}

### Accessibility

- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigable
- [ ] Screen reader compatible
- [ ] Color contrast compliant

---

## 10. Dependencies

### Technical Dependencies

| Dependency | Type | Impact if Unavailable |
|------------|------|----------------------|
| {{DEPENDENCY}} | {{TYPE}} | {{IMPACT}} |
| {{DEPENDENCY}} | {{TYPE}} | {{IMPACT}} |

### Feature Dependencies

| Feature | Status | Impact |
|---------|--------|--------|
| {{FEATURE}} | {{STATUS}} | Blocks {{WHAT}} |
| {{FEATURE}} | {{STATUS}} | Blocks {{WHAT}} |

### External Dependencies

| Service/API | Purpose | Fallback |
|-------------|---------|----------|
| {{SERVICE}} | {{PURPOSE}} | {{FALLBACK}} |

---

## 11. Implementation Plan

### Tickets

| # | Ticket | Owner | Model | Effort |
|---|--------|-------|-------|--------|
| {{SPRINT}}.1 | {{DESCRIPTION}} | Backend | sonnet | {{SP}} |
| {{SPRINT}}.2 | {{DESCRIPTION}} | Backend | sonnet | {{SP}} |
| {{SPRINT}}.3 | {{DESCRIPTION}} | Frontend | sonnet | {{SP}} |
| {{SPRINT}}.4 | {{DESCRIPTION}} | Frontend | sonnet | {{SP}} |
| {{SPRINT}}.5 | {{DESCRIPTION}} | QA | sonnet | {{SP}} |

### Implementation Order

```
1. Database migration ({{TICKET}})
   └── 2. API endpoint ({{TICKET}})
       └── 3. Service logic ({{TICKET}})
           └── 4. Frontend component ({{TICKET}})
               └── 5. Integration ({{TICKET}})
                   └── 6. Tests ({{TICKET}})
```

### Parallel Work Opportunities

```
Agent A (Backend): Tickets {{TICKETS}}
Agent B (Frontend): Tickets {{TICKETS}} (start with mocks)
Sync point: After API complete, integrate
```

---

## 12. Rollout Plan

### Feature Flags

```typescript
// Feature flag configuration
{
  "{{FEATURE_FLAG_NAME}}": {
    "enabled": false,
    "rollout_percentage": 0,
    "allowed_users": [],
    "allowed_organizations": []
  }
}
```

### Rollout Phases

| Phase | Audience | Duration | Success Criteria |
|-------|----------|----------|------------------|
| Alpha | Internal team | 1 week | No critical bugs |
| Beta | {{BETA_GROUP}} | 2 weeks | Error rate < 1% |
| GA | All users | - | All metrics met |

### Monitoring

| Metric | Alert Threshold | Dashboard |
|--------|-----------------|-----------|
| Error rate | > {{THRESHOLD}}% | {{LINK}} |
| Latency P95 | > {{THRESHOLD}}ms | {{LINK}} |
| Feature usage | < {{THRESHOLD}} | {{LINK}} |

### Rollback Plan

```
Trigger: {{ROLLBACK_TRIGGER}}
Action:
1. Disable feature flag
2. Notify users (if needed)
3. Investigate root cause
4. Fix and re-release
```

---

## 13. Success Metrics

### Feature Success Criteria

| Metric | Definition | Target | Measurement |
|--------|------------|--------|-------------|
| {{METRIC_1}} | {{DEFINITION}} | {{TARGET}} | {{HOW}} |
| {{METRIC_2}} | {{DEFINITION}} | {{TARGET}} | {{HOW}} |
| {{METRIC_3}} | {{DEFINITION}} | {{TARGET}} | {{HOW}} |

### Post-Launch Review

Schedule: {{DAYS}} days after GA

Review checklist:
- [ ] Success metrics achieved
- [ ] Error rates acceptable
- [ ] User feedback collected
- [ ] Technical debt documented
- [ ] Lessons learned documented

---

## Appendix

### Glossary

| Term | Definition |
|------|------------|
| {{TERM}} | {{DEFINITION}} |

### References

- [Design mockups]({{LINK}})
- [Technical RFC]({{LINK}})
- [Related spec]({{LINK}})

### Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | {{DATE}} | {{AUTHOR}} | Initial version |

---

*This spec is maintained by {{OWNER}}. Last updated: {{DATE}}*
