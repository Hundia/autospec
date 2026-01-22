# Create Spec

Generate a new feature specification following the Spec-Driven Development template.

## Usage

```
/create-spec [feature_name]
```

**Example:** `/create-spec notifications`

## Instructions

When this command is invoked:

1. **Gather requirements** from the user:
   - Ask clarifying questions about the feature
   - Understand the problem being solved
   - Identify constraints and dependencies

2. **Read existing specs** for context:
   - `specs/01_product_manager.md` - Product vision and principles
   - `specs/02_backend_lead.md` - Backend patterns
   - `specs/03_frontend_lead.md` - Frontend patterns
   - `specs/04_db_architect.md` - Database conventions

3. **Determine spec number**:
   - Check existing specs in `specs/` folder
   - Use next available number (e.g., 10, 11, etc.)
   - Feature specs start at 10+

4. **Generate spec document** with these sections:

```markdown
# SPEC: [Feature Name]

**Version:** 1.0
**Created:** [Date]
**Status:** Draft

---

## 1. Vision

### Problem Statement
What problem does this solve?

### Success State
What does success look like?

### Who Benefits
Which users benefit from this feature?

---

## 2. Requirements

### Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
| FR-1 | [Requirement] | Must Have | |
| FR-2 | [Requirement] | Should Have | |
| FR-3 | [Requirement] | Nice to Have | |

### Non-Functional Requirements

| ID | Requirement | Metric |
|----|-------------|--------|
| NFR-1 | Performance | [Target] |
| NFR-2 | Security | [Standard] |
| NFR-3 | Scalability | [Target] |

---

## 3. Database Schema (if applicable)

```sql
-- New tables or alterations
CREATE TABLE feature_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- columns
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_feature_table_... ON feature_table(...);
```

---

## 4. API Endpoints (if applicable)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/... | Get items | Yes |
| POST | /api/v1/... | Create item | Yes |

### Request/Response Examples

**GET /api/v1/feature**
```json
// Response
{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1
  }
}
```

**POST /api/v1/feature**
```json
// Request
{
  "field": "value"
}

// Response
{
  "id": "uuid",
  "field": "value",
  "createdAt": "2026-01-21T00:00:00Z"
}
```

---

## 5. Frontend Components (if applicable)

### New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| FeaturePage | pages/feature/ | Main feature page |
| FeatureCard | components/Feature/ | Display item |
| FeatureForm | components/Feature/ | Create/edit form |

### State Changes

| Store | Change |
|-------|--------|
| featureStore | New store for feature state |

### Routes

| Route | Component | Auth |
|-------|-----------|------|
| /feature | FeaturePage | Yes |
| /feature/:id | FeatureDetailPage | Yes |

---

## 6. Integration Points

### With Existing Systems

| System | Integration | Notes |
|--------|-------------|-------|
| Auth | User must be authenticated | Use existing auth middleware |
| Notifications | Send on create | Use notification service |

---

## 7. Security Considerations

- [ ] Authentication required for all endpoints
- [ ] Authorization: [Who can access what]
- [ ] Input validation via Zod schemas
- [ ] Rate limiting: [X requests per minute]
- [ ] Data encryption: [Requirements]

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Adoption | X% of users | Analytics |
| Performance | < Xms response | Monitoring |
| Errors | < X% error rate | Logging |

---

## 9. Out of Scope

- [What this spec does NOT include]
- [Future considerations]
- [Related features not covered]

---

## 10. Open Questions

- [ ] [Question 1 to resolve]
- [ ] [Question 2 to resolve]

---

## Appendix

### Glossary
| Term | Definition |
|------|------------|
| | |

### References
- [Link to related docs]
```

5. **Save the spec**:
   - Write to `specs/XX_feature_name.md`

6. **Generate initial tickets**:
   - Break the spec into 2-4 hour tickets
   - Present as a draft sprint

## Output Format

```
## Created Spec: 10_notifications.md

### Summary
Push and in-app notification system for user engagement.

### Sections Completed
- Vision (problem, success state, beneficiaries)
- Requirements (5 functional, 3 non-functional)
- Database Schema (2 tables)
- API Endpoints (4 endpoints)
- Frontend Components (3 components)
- Security Considerations
- Success Metrics

### Suggested Sprint Tickets

| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| ?.1 | Create notifications table | DB | haiku |
| ?.2 | Create notification_preferences table | DB | haiku |
| ?.3 | Implement NotificationService | Backend | sonnet |
| ?.4 | Create notification API endpoints | Backend | sonnet |
| ?.5 | Build NotificationList component | Frontend | sonnet |
| ?.6 | Build NotificationBell component | Frontend | sonnet |
| ?.7 | Integrate push notifications | Backend | opus |
| ?.8 | Write notification tests | QA | sonnet |

**Estimated: 8 tickets, ~20 hours**

Would you like me to add these as a new sprint in the backlog?
```

## Important Rules

- Always ask clarifying questions before writing
- Follow existing naming conventions in the project
- Include concrete examples, not placeholders
- Reference existing patterns from other specs
- Break down into implementable, testable pieces
- Mark spec as "Draft" until validated
