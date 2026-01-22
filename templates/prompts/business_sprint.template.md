# Business Sprint Prompt Template

Use this template for non-technical sprints focused on marketing, documentation, business planning, or other non-code deliverables.

---

# Sprint {{SPRINT_NUMBER}}: {{SPRINT_NAME}} (Business)

**Sprint Type:** Business/Non-Technical
**Goal:** {{SPRINT_GOAL}}

Read `specs/backlog.md` for full project context. This is {{PROJECT_DESCRIPTION}}.

## Project Context

### Product Overview
{{PRODUCT_OVERVIEW}}

### Current State
- Previous sprints: {{COMPLETED_SPRINTS}}
- Product maturity: {{MATURITY_LEVEL}}
- Target audience: {{TARGET_AUDIENCE}}

### Business Objectives
{{#each BUSINESS_OBJECTIVES}}
- {{this}}
{{/each}}

---

## Sprint {{SPRINT_NUMBER}} Scope

### Focus Area: {{FOCUS_AREA}}

{{SPRINT_DESCRIPTION}}

### Deliverables
{{#each DELIVERABLES}}
- {{this}}
{{/each}}

---

## Sprint Tickets

### Marketing & Communications

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
{{#each MARKETING_TICKETS}}
| {{this.number}} | {{this.description}} | 🔲 Todo | {{this.owner}} | {{this.model}} |
{{/each}}

### Documentation & Content

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
{{#each DOCUMENTATION_TICKETS}}
| {{this.number}} | {{this.description}} | 🔲 Todo | {{this.owner}} | {{this.model}} |
{{/each}}

### Business Planning & Strategy

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
{{#each BUSINESS_TICKETS}}
| {{this.number}} | {{this.description}} | 🔲 Todo | {{this.owner}} | {{this.model}} |
{{/each}}

### Finance & Operations

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
{{#each FINANCE_TICKETS}}
| {{this.number}} | {{this.description}} | 🔲 Todo | {{this.owner}} | {{this.model}} |
{{/each}}

---

## Execution Guidelines

### 1. Specs to Reference

Before starting, read relevant specs:
- `specs/01_product_manager.md` - Product vision and personas
- `specs/07_marketing_lead.md` - Brand guidelines and messaging
- `specs/08_finance_lead.md` - Budget and financial constraints
- `specs/09_business_lead.md` - Business model and strategy

### 2. Model Selection for Business Tasks

**haiku** (cheapest - use for routine tasks):
- Simple documentation updates
- Template-based content generation
- Data formatting and cleanup
- Meeting notes and summaries

**sonnet** (balanced - use for most tasks):
- Marketing copy and messaging
- Documentation writing
- Business process documentation
- Standard reports and analysis

**opus** (premium - use for strategic work):
- Strategic planning documents
- Complex market analysis
- Brand strategy development
- Executive presentations

### 3. Content Standards

#### Writing Style
- {{BRAND_VOICE}} brand voice
- {{READING_LEVEL}} reading level
- {{TONE}} tone
- {{FORMALITY}} formality

#### Formatting
- Use Markdown for all documents
- Include table of contents for long docs
- Use consistent heading hierarchy
- Include visuals/diagrams where helpful

#### File Organization
```
docs/
├── marketing/
│   ├── brand-guidelines.md
│   ├── messaging-framework.md
│   └── campaigns/
├── business/
│   ├── business-model.md
│   ├── roadmap.md
│   └── reports/
└── user-docs/
    ├── getting-started.md
    ├── features/
    └── api/
```

### 4. Review Process

Business deliverables require different review criteria:

#### Marketing Content
- [ ] On-brand voice and tone
- [ ] Accurate product claims
- [ ] Clear call-to-action
- [ ] Legal/compliance review (if needed)

#### Documentation
- [ ] Technically accurate
- [ ] Clear and understandable
- [ ] Complete with examples
- [ ] Follows style guide

#### Business Documents
- [ ] Data-driven conclusions
- [ ] Clear recommendations
- [ ] Stakeholder appropriate
- [ ] Action items defined

---

## Ticket Templates

### Marketing Ticket Template

#### {{TICKET_NUMBER}}: {{TICKET_DESCRIPTION}}

**Objective:** {{OBJECTIVE}}

**Target Audience:** {{AUDIENCE}}

**Key Messages:**
{{#each KEY_MESSAGES}}
- {{this}}
{{/each}}

**Deliverables:**
- [ ] {{DELIVERABLE_1}}
- [ ] {{DELIVERABLE_2}}

**Success Criteria:**
- {{SUCCESS_CRITERION_1}}
- {{SUCCESS_CRITERION_2}}

**Brand Guidelines Reference:**
- Voice: {{BRAND_VOICE}}
- Tone: {{BRAND_TONE}}
- Prohibited terms: {{PROHIBITED_TERMS}}

---

### Documentation Ticket Template

#### {{TICKET_NUMBER}}: {{TICKET_DESCRIPTION}}

**Document Type:** {{DOC_TYPE}}

**Purpose:** {{PURPOSE}}

**Audience:** {{AUDIENCE}}

**Outline:**
1. {{SECTION_1}}
2. {{SECTION_2}}
3. {{SECTION_3}}

**Requirements:**
- Word count: {{WORD_COUNT}}
- Include code examples: {{YES_NO}}
- Include diagrams: {{YES_NO}}
- Screenshots required: {{YES_NO}}

**Acceptance Criteria:**
- [ ] Covers all required topics
- [ ] Follows documentation style guide
- [ ] Examples tested and working
- [ ] Reviewed by {{REVIEWER}}

---

### Business Analysis Ticket Template

#### {{TICKET_NUMBER}}: {{TICKET_DESCRIPTION}}

**Analysis Type:** {{ANALYSIS_TYPE}}

**Questions to Answer:**
{{#each QUESTIONS}}
- {{this}}
{{/each}}

**Data Sources:**
{{#each DATA_SOURCES}}
- {{this}}
{{/each}}

**Deliverables:**
- [ ] Analysis document
- [ ] Executive summary
- [ ] Recommendations

**Format:**
- Length: {{LENGTH}}
- Charts/visualizations: {{CHART_COUNT}}
- Appendix with raw data: {{YES_NO}}

---

## Multi-Agent Strategy for Business Sprints

### Agent Roles

**Agent A (Content Creator - sonnet):**
- Marketing copy
- User documentation
- Blog posts
- Social media content

**Agent B (Analyst - sonnet/opus):**
- Market research
- Competitive analysis
- Financial modeling
- Data analysis

### Parallel Work Opportunities

```
Agent A: Content creation (no dependencies)
Agent B: Analysis work (no dependencies)
         ↓
     Merge insights into final deliverables
```

### Handoff Points
{{#each HANDOFF_POINTS}}
- {{this}}
{{/each}}

---

## Definition of Done

### Sprint-Level DoD
{{#each DEFINITION_OF_DONE}}
- [ ] {{this}}
{{/each}}

### Per-Deliverable DoD

#### Marketing Deliverables
- [ ] Content reviewed for brand consistency
- [ ] Legal/compliance approved (if applicable)
- [ ] Published or scheduled for publication
- [ ] Tracking/analytics set up

#### Documentation
- [ ] Technically accurate (verified by developer)
- [ ] User-tested or peer-reviewed
- [ ] Published to documentation site
- [ ] Search optimized

#### Business Documents
- [ ] Data sources cited
- [ ] Assumptions documented
- [ ] Stakeholders reviewed
- [ ] Action items assigned

---

## Sprint Documentation

When sprint completes, create `sprints/sprint-{{SPRINT_NUMBER}}-{{SPRINT_SLUG}}/`:
- `summary.md` - Overview, completed deliverables, key decisions
- `deliverables.md` - Links to all completed work
- `metrics.md` - KPIs and measurements (if applicable)

---

## Backlog Updates

As you complete tickets:
1. Update status in `specs/backlog.md`: 🔲 → 🔄 → ✅
2. Link to deliverable location
3. Note any dependencies or blockers
4. Track time/model used for FinOps

---

## Starting Command

Begin with the first ticket in your assigned area:
1. Read the ticket requirements
2. Review relevant specs
3. Update backlog status to 🔄
4. Create deliverable
5. Submit for review
6. Update status to ✅

---

*Generated with SDD for All framework*
