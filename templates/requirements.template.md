# {{PROJECT_NAME}} - Requirements

**Version:** 1.0
**Created:** {{DATE}}
**Author:** {{AUTHOR}}

---

## 1. Vision

### What We're Building
{{One paragraph describing the product and its purpose}}

### Problem Statement
{{What problem does this solve? Who has this problem?}}

### Success State
{{What does the world look like when this project succeeds?}}

---

## 2. Target Users

### Primary User: {{PERSONA_NAME}}
- **Who:** {{Description of primary user}}
- **Goals:** {{What do they want to accomplish?}}
- **Pain Points:** {{What frustrates them today?}}
- **Tech Savvy:** {{Low / Medium / High}}

### Secondary User: {{PERSONA_NAME}}
- **Who:** {{Description of secondary user}}
- **Goals:** {{What do they want to accomplish?}}
- **Pain Points:** {{What frustrates them today?}}

---

## 3. Core Features

List the main features in priority order. Be specific about what each feature does.

### Feature 1: {{FEATURE_NAME}}
**Priority:** Must Have
**Description:** {{What does this feature do?}}
- {{Specific capability}}
- {{Specific capability}}
- {{Specific capability}}

### Feature 2: {{FEATURE_NAME}}
**Priority:** Must Have
**Description:** {{What does this feature do?}}
- {{Specific capability}}
- {{Specific capability}}

### Feature 3: {{FEATURE_NAME}}
**Priority:** Should Have
**Description:** {{What does this feature do?}}
- {{Specific capability}}
- {{Specific capability}}

### Feature 4: {{FEATURE_NAME}}
**Priority:** Should Have
**Description:** {{What does this feature do?}}
- {{Specific capability}}

### Feature 5: {{FEATURE_NAME}}
**Priority:** Nice to Have
**Description:** {{What does this feature do?}}
- {{Specific capability}}

---

## 4. Technical Requirements

### Frontend
- **Framework:** {{React / Vue / Svelte / etc.}}
- **Styling:** {{Tailwind / CSS Modules / Styled Components / etc.}}
- **State Management:** {{Redux / Zustand / Context / etc.}}
- **Key Libraries:** {{List any specific libraries needed}}

### Backend
- **Runtime:** {{Node.js / Python / Go / etc.}}
- **Framework:** {{Express / FastAPI / Gin / etc.}}
- **API Style:** {{REST / GraphQL}}
- **Key Libraries:** {{List any specific libraries needed}}

### Database
- **Primary:** {{PostgreSQL / MongoDB / MySQL / etc.}}
- **Cache:** {{Redis / none}}
- **File Storage:** {{S3 / local / Cloudflare R2 / etc.}}

### Infrastructure
- **Hosting:** {{Vercel / AWS / Railway / etc.}}
- **CI/CD:** {{GitHub Actions / GitLab CI / etc.}}
- **Monitoring:** {{Datadog / Sentry / etc. / none for MVP}}

### Authentication
- **Method:** {{Email/password / OAuth / Magic links / etc.}}
- **Providers:** {{Google / GitHub / etc. if using OAuth}}
- **Session Management:** {{JWT / Sessions}}

---

## 5. Non-Functional Requirements

### Performance
- Page load: < {{X}} seconds
- API response: < {{X}} ms for 95th percentile
- Support {{X}} concurrent users

### Security
- {{HTTPS everywhere}}
- {{Password hashing with bcrypt/argon2}}
- {{Rate limiting on auth endpoints}}
- {{Input validation on all user data}}
- {{SQL injection prevention}}
- {{XSS prevention}}

### Accessibility
- {{WCAG 2.1 AA compliance / basic accessibility / N/A}}
- {{Keyboard navigation support}}
- {{Screen reader compatible}}

### Browser Support
- {{Chrome (latest)}}
- {{Firefox (latest)}}
- {{Safari (latest)}}
- {{Edge (latest)}}
- {{Mobile browsers}}

---

## 6. Success Metrics

Define how you'll measure if the project is successful.

| Metric | Target | How to Measure |
|--------|--------|----------------|
| {{Metric name}} | {{Target value}} | {{Measurement method}} |
| {{Metric name}} | {{Target value}} | {{Measurement method}} |
| {{Metric name}} | {{Target value}} | {{Measurement method}} |

**Examples:**
- User signup conversion: > 5%
- Page load time: < 2 seconds
- Test coverage: > 70%
- API uptime: 99.9%

---

## 7. Constraints

### Timeline
- MVP deadline: {{Date or "None"}}
- Phase 1 complete by: {{Date or "None"}}

### Budget
- Infrastructure: {{Budget per month or "Minimal"}}
- Third-party services: {{Budget or "None"}}

### Team
- Developers: {{Number}}
- Using AI assistance: {{Yes/No}}

### Dependencies
- Must integrate with: {{List existing systems}}
- Must use: {{Required technologies}}

---

## 8. Out of Scope (v1)

Be explicit about what you're NOT building to prevent scope creep.

- {{Feature or capability to defer}}
- {{Feature or capability to defer}}
- {{Feature or capability to defer}}
- {{Feature or capability to defer}}

---

## 9. Open Questions

List any decisions that still need to be made.

- [ ] {{Question 1}}
- [ ] {{Question 2}}
- [ ] {{Question 3}}

---

## 10. Reference Materials

Links to related documents, designs, or examples.

- Inspiration: {{Links to similar products}}
- Design files: {{Figma / Sketch links if any}}
- Existing docs: {{Links to any existing documentation}}

---

## Next Steps

After completing this requirements document:

1. **Generate specs:** Use the prompt in [QUICKSTART.md](../QUICKSTART.md) Step 2
2. **Review & refine:** Check generated specs for accuracy
3. **Create backlog:** Use the prompt in QUICKSTART.md Step 3
4. **Start Sprint 0:** Build your foundation

---

*This template is part of [AutoSpec](https://github.com/user/autospec) - AI-powered spec-driven development.*
