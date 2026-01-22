# Team Roles: The 9-Role Model

**Version:** 1.0
**Last Updated:** 2026-01-21

---

## Why Roles Matter

Even solo developers benefit from thinking in roles because:

1. **Completeness** - Each role asks different questions
2. **Quality** - Role boundaries prevent shortcuts
3. **Parallelization** - Roles can work simultaneously
4. **Handoffs** - Clear interfaces between concerns

The 9-role model ensures no perspective is neglected.

---

## Role Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     THE 9-ROLE MODEL                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PRODUCT                    TECHNICAL                           │
│  ┌──────────────┐           ┌──────────────┐                   │
│  │   Product    │           │   Backend    │                   │
│  │   Manager    │◄─────────►│    Lead      │                   │
│  └──────────────┘           └──────────────┘                   │
│         │                          │                            │
│         │                          ▼                            │
│         │                   ┌──────────────┐                   │
│         │                   │   Frontend   │                   │
│         ├──────────────────►│    Lead      │                   │
│         │                   └──────────────┘                   │
│         │                          │                            │
│         ▼                          ▼                            │
│  ┌──────────────┐           ┌──────────────┐                   │
│  │     QA       │◄─────────►│     DB       │                   │
│  │    Lead      │           │  Architect   │                   │
│  └──────────────┘           └──────────────┘                   │
│         │                          │                            │
│         └──────────────┬───────────┘                            │
│                        │                                        │
│                        ▼                                        │
│                 ┌──────────────┐                               │
│                 │   DevOps     │                               │
│                 │    Lead      │                               │
│                 └──────────────┘                               │
│                                                                 │
│  BUSINESS                                                       │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐           │
│  │  Marketing   │ │   Finance    │ │   Business   │           │
│  │    Lead      │ │    Lead      │ │    Lead      │           │
│  └──────────────┘ └──────────────┘ └──────────────┘           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Role 1: Product Manager

### Responsibility
Define WHAT we build and WHY. Represents the user.

### Owns
- Product vision and strategy
- User personas and journeys
- Feature prioritization
- Success metrics
- Roadmap

### Key Questions
- Who is this for?
- What problem does it solve?
- How will we know it's working?
- What's in scope vs. out?

### Interacts With
- **Frontend Lead:** UX requirements
- **Backend Lead:** Feature feasibility
- **Business Lead:** Strategic alignment
- **Marketing Lead:** Positioning

### Spec: 01_product_manager.md

```markdown
## Must Include
- Vision statement (1 paragraph)
- 2-3 detailed personas
- User flows with steps
- Functional requirements (numbered)
- Success metrics (measurable)
```

---

## Role 2: Backend Lead

### Responsibility
Design and implement server-side logic, APIs, and integrations.

### Owns
- API architecture
- Authentication/authorization
- Business logic services
- External integrations
- Performance optimization

### Key Questions
- What endpoints are needed?
- How is auth handled?
- What's the service layer structure?
- How do we handle errors?

### Interacts With
- **Frontend Lead:** API contracts
- **DB Architect:** Data access patterns
- **DevOps Lead:** Deployment requirements
- **QA Lead:** Testability

### Spec: 02_backend_lead.md

```markdown
## Must Include
- API endpoint table (method, path, auth, request, response)
- Request/response JSON examples
- Error code definitions
- Service layer diagram
- Security requirements
```

---

## Role 3: Frontend Lead

### Responsibility
Design and implement user interface and experience.

### Owns
- Design system
- Component library
- Page layouts
- State management
- Client-side performance

### Key Questions
- What components exist?
- What's the design system?
- How is state managed?
- What's the responsive strategy?

### Interacts With
- **Product Manager:** UX requirements
- **Backend Lead:** API integration
- **QA Lead:** UI testing
- **DevOps Lead:** Build optimization

### Spec: 03_frontend_lead.md

```markdown
## Must Include
- Color palette with hex values
- Typography scale
- Component inventory with props
- Page layouts with routes
- State stores and their shape
- Responsive breakpoints
```

---

## Role 4: DB Architect

### Responsibility
Design data storage, ensuring integrity and performance.

### Owns
- Database schema
- Naming conventions
- Migrations strategy
- Indexes and performance
- Data relationships

### Key Questions
- What entities exist?
- How are they related?
- What indexes are needed?
- How do we migrate safely?

### Interacts With
- **Backend Lead:** Data access patterns
- **QA Lead:** Test data management
- **DevOps Lead:** Database infrastructure

### Spec: 04_db_architect.md

```markdown
## Must Include
- Full CREATE TABLE statements
- Index definitions
- Foreign key relationships
- Migration naming convention
- Seed data strategy
```

---

## Role 5: QA Lead

### Responsibility
Ensure quality through testing strategy and standards.

### Owns
- Test pyramid definition
- Coverage targets
- Test patterns and examples
- QA review process
- Bug tracking

### Key Questions
- What's the test coverage target?
- What tools do we use?
- When does a ticket pass QA?
- How do we handle regressions?

### Interacts With
- **All Technical Roles:** Test requirements
- **Product Manager:** Acceptance criteria
- **DevOps Lead:** CI integration

### Spec: 05_qa_lead.md

```markdown
## Must Include
- Test pyramid percentages
- Coverage targets by area
- Test file conventions
- Unit test examples
- Integration test examples
- QA checklist
```

---

## Role 6: DevOps Lead

### Responsibility
Infrastructure, deployment, and operational reliability.

### Owns
- Infrastructure architecture
- CI/CD pipelines
- Environment configuration
- Monitoring and logging
- Security infrastructure

### Key Questions
- How do we deploy?
- What environments exist?
- How do we monitor?
- What's the security posture?

### Interacts With
- **All Technical Roles:** Infrastructure needs
- **QA Lead:** CI integration
- **Business Lead:** Uptime requirements

### Spec: 06_devops_lead.md

```markdown
## Must Include
- Infrastructure diagram
- Docker/container configuration
- CI/CD pipeline stages
- Environment variables list
- Monitoring stack
```

---

## Role 7: Marketing Lead

### Responsibility
Go-to-market strategy and user acquisition.

### Owns
- Market positioning
- Acquisition channels
- Messaging and content
- Launch strategy
- Growth metrics

### Key Questions
- Who are we targeting?
- How do we reach them?
- What's our positioning?
- What does success look like?

### Interacts With
- **Product Manager:** Feature messaging
- **Business Lead:** Budget and strategy
- **Finance Lead:** CAC targets

### Spec: 07_marketing_lead.md

```markdown
## Must Include
- TAM/SAM/SOM analysis
- Target segment definitions
- Channel strategy
- Messaging framework
- Acquisition metrics
```

---

## Role 8: Finance Lead

### Responsibility
Financial planning, pricing, and unit economics.

### Owns
- Pricing strategy
- Revenue projections
- Cost structure
- Unit economics
- Financial reporting

### Key Questions
- What are the pricing tiers?
- What's the unit economics?
- What's the burn rate?
- When do we break even?

### Interacts With
- **Business Lead:** Strategic alignment
- **Marketing Lead:** CAC/LTV
- **Product Manager:** Feature monetization

### Spec: 08_finance_lead.md

```markdown
## Must Include
- Pricing tiers table
- Unit economics (CAC, LTV, payback)
- Cost breakdown
- Revenue projections
- Financial milestones
```

---

## Role 9: Business Lead

### Responsibility
Strategic direction and competitive positioning.

### Owns
- Business strategy
- Competitive analysis
- Partnership development
- Funding strategy
- Risk management

### Key Questions
- What's our competitive advantage?
- Who are our competitors?
- What partnerships matter?
- How do we fund growth?

### Interacts With
- **All Leads:** Strategic alignment
- **Finance Lead:** Funding and budgets
- **Marketing Lead:** Go-to-market

### Spec: 09_business_lead.md

```markdown
## Must Include
- SWOT analysis
- Competitive matrix
- Partnership opportunities
- Funding strategy (if applicable)
- Risk register
```

---

## Role-to-Ticket Mapping

When creating tickets, assign to the appropriate role:

| Ticket Type | Owner Role | Example |
|-------------|------------|---------|
| Database migration | DB Architect | "Create users table" |
| API endpoint | Backend Lead | "Implement POST /users" |
| React component | Frontend Lead | "Build LoginForm component" |
| Unit tests | QA Lead | "Write UserService tests" |
| Docker config | DevOps Lead | "Add Redis to docker-compose" |
| User research | Product Manager | "Interview 5 users" |
| Pricing page | Marketing + Finance | "Design pricing comparison" |
| SWOT update | Business Lead | "Quarterly strategy review" |

---

## Multi-Agent Role Assignments

When using multiple AI agents, assign by role:

```
Agent A (Backend Focus):
- Role: Backend Lead + DB Architect
- Tickets: Database, API, services

Agent B (Frontend Focus):
- Role: Frontend Lead
- Tickets: Components, pages, styling

Agent C (QA Focus):
- Role: QA Lead
- Tickets: Tests, review, coverage

Human (Product Focus):
- Role: Product Manager + Business Lead
- Tickets: Requirements, validation, strategy
```

---

## Adapting for Team Size

### Solo Developer

You wear all 9 hats. The specs ensure you don't skip any perspective.

```
Day 1: Product Manager hat - Define requirements
Day 2: Backend + DB hat - Design API and schema
Day 3: Frontend hat - Design components
Day 4: DevOps hat - Set up infrastructure
Day 5: Execute with AI agents
Ongoing: QA hat reviews all work
```

### Small Team (2-5)

```
Person A: Product + Marketing + Business
Person B: Backend + DB
Person C: Frontend
Person D: DevOps + QA
```

### Large Team

Each role has a dedicated person or team. Specs become contracts between teams.

---

## Role Handoff Points

Critical moments where roles must coordinate:

| From | To | Handoff | Artifact |
|------|----|---------|----------|
| Product | Backend | API requirements | User flows → endpoint list |
| Backend | Frontend | API contract | Endpoint spec → integration |
| Backend | DB | Data needs | Service design → schema |
| All | QA | Implementation | Code → tests |
| QA | DevOps | Release | Passing tests → deployment |

---

## Next Steps

- [04_backlog_management.md](./04_backlog_management.md) - How to manage sprints
- [05_multi_agent.md](./05_multi_agent.md) - Parallel agent execution
- [Templates](../../templates/specs/) - Get started with templates
