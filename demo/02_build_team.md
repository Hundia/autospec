# Step 2: Build the 10-Role Team (Generate All Specs)

## Prompt for AI Assistant

```
You are executing the AutoSpec methodology for ShopFlow E-Commerce.

## Context
Read the methodology at:
- docs/methodology/02_ten_role_model.md
- templates/specs/*.md (all 10 templates)

## Input
Read: docs/examples/ecommerce/requirements.md

## Task
Generate the complete 10-role spec suite. Create these files in `shopflow_demo/specs/`:

### 1. Product Manager (01_product_manager.md)
- Product vision and objectives
- User personas (3-5 detailed personas)
- User stories with acceptance criteria
- User flows (registration, purchase, checkout)
- Feature prioritization (MoSCoW)

### 2. Backend Lead (02_backend_lead.md)
- System architecture overview
- API contracts (RESTful endpoints with request/response schemas)
- Authentication & authorization (JWT, roles, permissions)
- Service layer design
- Error handling standards (error codes, messages)
- Rate limiting strategy

### 3. Frontend Lead (03_frontend_lead.md)
- Component hierarchy (atomic design)
- State management approach (what goes where)
- Design system tokens (colors, spacing, typography)
- Routing structure (all routes with guards)
- Form handling patterns
- Performance requirements (Core Web Vitals)

### 4. DB Architect (04_db_architect.md)
- Entity-Relationship diagram (ASCII or description)
- Table schemas with column types, constraints
- Indexes for query optimization
- Migration strategy (versioning approach)
- Query patterns for common operations
- Data seeding plan (test data)

### 5. QA Lead (05_qa_lead.md)
- Test strategy (unit, integration, e2e split)
- Test cases for critical user paths
- Coverage requirements (70%+ target)
- Performance benchmarks (response times, load)
- Security testing checklist (OWASP top 10)

### 6. DevOps Lead (06_devops_lead.md)
- CI/CD pipeline design (stages, triggers)
- Environment configuration (dev, staging, prod)
- Deployment strategy (blue-green, rolling)
- Monitoring & logging (what to track)
- Backup & recovery procedures

### 7. Marketing Lead (07_marketing_lead.md)
- Go-to-market strategy
- Target audience segments
- Messaging framework (value props, taglines)
- Launch timeline with milestones
- Success metrics (CAC, LTV, conversion)

### 8. Finance Lead (08_finance_lead.md)
- Cost analysis (infrastructure, tools, labor)
- Pricing strategy (if applicable)
- Revenue projections (3-6-12 month)
- ROI calculations
- Budget allocation by phase

### 9. Business Lead (09_business_lead.md)
- Business model canvas
- Competitive analysis (3-5 competitors)
- KPIs and success metrics
- Risk assessment with mitigations
- Growth strategy (phases)

### 10. UI Designer (10_ui_designer.md)
- Screen inventory (all pages/views)
- Wireframe descriptions (layout, elements)
- Component states (default, hover, active, disabled, error, loading)
- Responsive breakpoints (mobile, tablet, desktop)
- Accessibility requirements (WCAG 2.1 AA)

## Output Requirements
- Each spec should be 500-1500 lines
- Include specific details, not generic placeholders
- Cross-reference other specs where relevant
- Use consistent naming conventions
- Include examples where helpful
```

---

## Expected Output
After running this prompt, you should have:
```
shopflow_demo/
└── specs/
    ├── 01_product_manager.md
    ├── 02_backend_lead.md
    ├── 03_frontend_lead.md
    ├── 04_db_architect.md
    ├── 05_qa_lead.md
    ├── 06_devops_lead.md
    ├── 07_marketing_lead.md
    ├── 08_finance_lead.md
    ├── 09_business_lead.md
    └── 10_ui_designer.md
```

## Demo Script

> "Now we generate 10 comprehensive specs from our requirements. Each spec is written from a specialist's perspective - backend, frontend, QA, DevOps, and more. This ensures nothing falls through the cracks."

Show the AI generating specs in real-time, then open 2-3 to show depth.
