/**
 * Spec Generator
 * Generates spec files from templates and parsed requirements
 */

import path from 'path';
import Handlebars from 'handlebars';
import { readFile, writeFile, exists } from '../utils/file.js';
import { ParsedRequirements } from '../parsers/requirements.parser.js';
import { getCurrentDate } from '../utils/file.js';

export interface SpecGeneratorOptions {
  projectName: string;
  outputDir: string;
  requirements?: ParsedRequirements;
  templateDir?: string;
}

// Default templates if external templates are not available
const DEFAULT_TEMPLATES: Record<string, string> = {
  'product_manager': `# SPEC: Product Manager

**Version:** 1.0
**Created:** {{date}}
**Owner:** Product Team

---

## 1. Product Vision

### Elevator Pitch
{{projectName}} is a {{description}}

### Problem Statement
{{problemStatement}}

### Success State
{{successState}}

---

## 2. Target Users

{{#each personas}}
### {{#if @first}}Primary{{else}}Secondary{{/if}} Persona: {{name}}

| Attribute | Description |
|-----------|-------------|
| Goals | {{#each goals}}{{this}}{{#unless @last}}, {{/unless}}{{/each}} |
| Pain Points | {{#each painPoints}}{{this}}{{#unless @last}}, {{/unless}}{{/each}} |

{{/each}}

---

## 3. User Flows

{{#each userFlows}}
### Flow {{@index}}: {{name}}

**Steps:**
{{#each steps}}
{{@index}}. {{this}}
{{/each}}

**Success Criteria:**
{{#each successCriteria}}
- {{this}}
{{/each}}

{{/each}}

---

## 4. Functional Requirements

| ID | Requirement | Priority | Notes |
|----|-------------|----------|-------|
{{#each functionalRequirements}}
| {{id}} | {{description}} | {{priority}} | |
{{/each}}

---

## 5. Non-Functional Requirements

| ID | Requirement | Metric | Target |
|----|-------------|--------|--------|
{{#each nonFunctionalRequirements}}
| {{id}} | {{description}} | TBD | TBD |
{{/each}}

---

## 6. Constraints & Assumptions

### Constraints
{{#each constraints}}
- {{this}}
{{/each}}

### Assumptions
{{#each assumptions}}
- {{this}}
{{/each}}

---

## 7. Out of Scope (v1.0)

{{#each outOfScope}}
- {{this}}
{{/each}}

---

*This spec is maintained by the Product team. Last updated: {{date}}*
`,

  'backend_lead': `# SPEC: Backend Lead

**Version:** 1.0
**Created:** {{date}}
**Owner:** Backend Team

---

## 1. Architecture Overview

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Runtime | {{techStack.backend}} | Latest LTS |
| Language | {{techStack.language}} | Latest |
| Database | {{techStack.database}} | Latest |
| Validation | Zod | 3.x |
| Testing | Vitest | 1.x |

---

## 2. Project Structure

\`\`\`
api/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Database access
│   ├── routes/           # Route definitions
│   ├── schemas/          # Validation schemas
│   ├── middleware/       # Express middleware
│   ├── types/            # TypeScript types
│   └── utils/            # Helper functions
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
└── tsconfig.json
\`\`\`

---

## 3. API Design Principles

### Base URL
\`\`\`
/api/v1
\`\`\`

### Response Format

**Success Response:**
\`\`\`json
{
  "data": { ... },
  "meta": { "timestamp": "..." }
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
\`\`\`

---

## 4. API Endpoints

Define your API endpoints here based on the functional requirements.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /health | Health check | No |

---

## 5. Security Requirements

### Input Validation
- All inputs validated via Zod schemas
- SQL injection prevented via parameterized queries

### Authentication
- JWT tokens for authentication
- Password hashing with bcrypt

---

*This spec is maintained by the Backend team. Last updated: {{date}}*
`,

  'frontend_lead': `# SPEC: Frontend Lead

**Version:** 1.0
**Created:** {{date}}
**Owner:** Frontend Team

---

## 1. Architecture Overview

### Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | {{techStack.frontend}} | Latest |
| Language | {{techStack.language}} | Latest |
| State | Zustand/Context | Latest |
| Styling | Tailwind CSS | 3.x |
| Testing | Vitest + Testing Library | Latest |

---

## 2. Project Structure

\`\`\`
web/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── ui/          # Base components
│   │   └── features/    # Feature-specific
│   ├── pages/           # Route pages
│   ├── hooks/           # Custom hooks
│   ├── services/        # API calls
│   ├── stores/          # State management
│   ├── types/           # TypeScript types
│   └── utils/           # Helper functions
├── tests/
├── public/
└── package.json
\`\`\`

---

## 3. Design System

### Colors
| Name | Value | Usage |
|------|-------|-------|
| Primary | #3B82F6 | Main actions |
| Secondary | #6B7280 | Secondary text |
| Success | #10B981 | Success states |
| Error | #EF4444 | Error states |

### Typography
- Headings: Inter, semi-bold
- Body: Inter, regular
- Code: JetBrains Mono

---

## 4. Component Patterns

### Button Component
\`\`\`tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
\`\`\`

---

*This spec is maintained by the Frontend team. Last updated: {{date}}*
`,

  'db_architect': `# SPEC: Database Architect

**Version:** 1.0
**Created:** {{date}}
**Owner:** Database Team

---

## 1. Database Overview

### Technology
- **Database:** {{techStack.database}}
- **ORM/Query Builder:** Drizzle/Prisma/Raw SQL
- **Migrations:** Version controlled

---

## 2. Schema Design Principles

### Naming Conventions
- Tables: snake_case, plural (e.g., \`users\`, \`orders\`)
- Columns: snake_case (e.g., \`created_at\`, \`user_id\`)
- Primary Keys: \`id\` (UUID or serial)
- Foreign Keys: \`{table}_id\`

### Common Columns
All tables should have:
- \`id\` - Primary key
- \`created_at\` - Timestamp
- \`updated_at\` - Timestamp

---

## 3. Tables

Define your database tables here based on the requirements.

### Example: users
\`\`\`sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

---

## 4. Indexes

| Table | Column(s) | Type | Purpose |
|-------|-----------|------|---------|
| users | email | UNIQUE | Fast lookup by email |

---

*This spec is maintained by the Database team. Last updated: {{date}}*
`,

  'qa_lead': `# SPEC: QA Lead

**Version:** 1.0
**Created:** {{date}}
**Owner:** QA Team

---

## 1. Testing Strategy

### Test Pyramid

\`\`\`
         /\\
        /  \\
       / E2E\\       <- Few, critical paths
      /------\\
     /  Integ \\     <- Medium, API & DB
    /----------\\
   /    Unit    \\   <- Many, fast
  /--------------\\
\`\`\`

### Coverage Targets
- Unit Tests: 80%+
- Integration Tests: Key APIs
- E2E Tests: Critical user flows

---

## 2. Test Types

### Unit Tests
- Test individual functions/components
- Mock external dependencies
- Run: \`npm test\`

### Integration Tests
- Test API endpoints with database
- Use test database
- Run: \`npm run test:integration\`

### E2E Tests
- Test complete user flows
- Use Playwright/Cypress
- Run: \`npm run test:e2e\`

---

## 3. QA Process

### Definition of Done
- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] No console errors
- [ ] Code reviewed
- [ ] Documentation updated

### Bug Reporting Format
\`\`\`
**Bug:** [Brief description]
**Steps to Reproduce:**
1. ...
**Expected:** ...
**Actual:** ...
**Severity:** Critical/High/Medium/Low
\`\`\`

---

*This spec is maintained by the QA team. Last updated: {{date}}*
`,

  'devops_lead': `# SPEC: DevOps Lead

**Version:** 1.0
**Created:** {{date}}
**Owner:** DevOps Team

---

## 1. Infrastructure Overview

### Environments
| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local development | localhost |
| Staging | Pre-production testing | TBD |
| Production | Live application | TBD |

---

## 2. Development Setup

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Quick Start
\`\`\`bash
# Clone repository
git clone <repo-url>

# Install dependencies
npm install

# Start development environment
docker-compose up -d

# Run application
npm run dev
\`\`\`

---

## 3. Docker Configuration

### docker-compose.yml
\`\`\`yaml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: app_dev
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
\`\`\`

---

## 4. CI/CD Pipeline

### Stages
1. **Build** - Compile TypeScript
2. **Test** - Run unit & integration tests
3. **Lint** - Check code quality
4. **Deploy** - Deploy to environment

---

*This spec is maintained by the DevOps team. Last updated: {{date}}*
`,

  'marketing_lead': `# SPEC: Marketing Lead

**Version:** 1.0
**Created:** {{date}}
**Owner:** Marketing Team

---

## 1. Market Overview

### Target Market
{{#if personas}}
{{#each personas}}
- **{{name}}**: {{#each goals}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}
{{/each}}
{{else}}
- Define your target market segments here
{{/if}}

### Market Size
| Segment | TAM | SAM | SOM |
|---------|-----|-----|-----|
| Primary | TBD | TBD | TBD |

---

## 2. Positioning

### Value Proposition
{{projectName}} helps [target users] to [achieve goal] by [key differentiator].

### Competitive Positioning
| Competitor | Strength | Weakness | Our Advantage |
|------------|----------|----------|---------------|
| Competitor A | TBD | TBD | TBD |
| Competitor B | TBD | TBD | TBD |

---

## 3. Messaging Framework

### Tagline
[One line that captures the essence]

### Elevator Pitch (30 seconds)
{{description}}

### Key Messages
1. **For [persona 1]**: [Message focused on their pain point]
2. **For [persona 2]**: [Message focused on their pain point]

---

## 4. Go-to-Market Strategy

### Launch Phases
| Phase | Timeline | Focus | Channels |
|-------|----------|-------|----------|
| Soft Launch | Week 1-2 | Beta users | Direct outreach |
| Public Launch | Week 3-4 | Early adopters | Product Hunt, social |
| Growth | Week 5+ | Scale | Content, ads |

### Channel Strategy
| Channel | Purpose | Investment | Expected CAC |
|---------|---------|------------|--------------|
| Organic Search | Long-term traffic | Content creation | Low |
| Social Media | Brand awareness | Time | Medium |
| Paid Ads | Quick scale | Budget | Higher |

---

## 5. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Sign-ups (Month 1) | TBD | Analytics |
| Activation Rate | TBD% | Product analytics |
| CAC | $TBD | Marketing spend / customers |

---

*This spec is maintained by the Marketing team. Last updated: {{date}}*
`,

  'finance_lead': `# SPEC: Finance Lead

**Version:** 1.0
**Created:** {{date}}
**Owner:** Finance Team

---

## 1. Cost Structure

### Development Costs
| Category | Monthly | Annual | Notes |
|----------|---------|--------|-------|
| Infrastructure | $TBD | $TBD | Cloud hosting |
| Tools & Services | $TBD | $TBD | SaaS subscriptions |
| AI/API Costs | $TBD | $TBD | Model usage |

### Operational Costs
| Category | Monthly | Notes |
|----------|---------|-------|
| Hosting | $TBD | Based on traffic |
| Database | $TBD | Storage + compute |
| Third-party APIs | $TBD | Per-usage |

---

## 2. Pricing Strategy

### Pricing Model
- [ ] Freemium
- [ ] Subscription
- [ ] Usage-based
- [ ] One-time purchase

### Pricing Tiers
| Tier | Price | Features | Target |
|------|-------|----------|--------|
| Free | $0 | Basic features | Trial users |
| Pro | $TBD/mo | Full features | Power users |
| Enterprise | Custom | Custom + support | Large teams |

---

## 3. Unit Economics

### Key Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Customer Acquisition Cost (CAC) | $TBD | - |
| Lifetime Value (LTV) | $TBD | - |
| LTV:CAC Ratio | 3:1+ | - |
| Payback Period | TBD months | - |
| Gross Margin | TBD% | - |

### Revenue Model
\`\`\`
Monthly Recurring Revenue = Active Subscribers × Average Price
Annual Run Rate = MRR × 12
\`\`\`

---

## 4. Financial Projections

### 12-Month Forecast
| Month | Users | Revenue | Costs | Net |
|-------|-------|---------|-------|-----|
| 1 | TBD | $TBD | $TBD | $TBD |
| 3 | TBD | $TBD | $TBD | $TBD |
| 6 | TBD | $TBD | $TBD | $TBD |
| 12 | TBD | $TBD | $TBD | $TBD |

### Break-even Analysis
- **Fixed Costs**: $TBD/month
- **Variable Cost per User**: $TBD
- **Break-even Point**: TBD users

---

## 5. Budget Allocation

| Category | % of Budget | Purpose |
|----------|-------------|---------|
| Development | 50% | Building the product |
| Marketing | 25% | User acquisition |
| Operations | 15% | Running the service |
| Reserve | 10% | Buffer |

---

*This spec is maintained by the Finance team. Last updated: {{date}}*
`,

  'business_lead': `# SPEC: Business Lead

**Version:** 1.0
**Created:** {{date}}
**Owner:** Business Strategy Team

---

## 1. Business Model

### Value Proposition Canvas
| Customer Segment | Jobs to be Done | Pains | Gains |
|------------------|-----------------|-------|-------|
{{#each personas}}
| {{name}} | {{#each goals}}{{this}}{{#unless @last}}, {{/unless}}{{/each}} | {{#each painPoints}}{{this}}{{#unless @last}}, {{/unless}}{{/each}} | TBD |
{{/each}}
{{#unless personas}}
| Target User | Primary task | Current frustrations | Desired outcome |
{{/unless}}

### Revenue Streams
- Primary: [Main revenue source]
- Secondary: [Additional revenue sources]

---

## 2. Competitive Analysis

### Competitive Landscape
| Competitor | Market Position | Key Features | Pricing | Our Differentiation |
|------------|-----------------|--------------|---------|---------------------|
| Competitor A | Market leader | Feature set | $X/mo | TBD |
| Competitor B | Challenger | Feature set | $Y/mo | TBD |
| Competitor C | Niche player | Feature set | $Z/mo | TBD |

### Competitive Advantages
1. **[Advantage 1]**: How we're different
2. **[Advantage 2]**: Why it matters

---

## 3. SWOT Analysis

| Strengths | Weaknesses |
|-----------|------------|
| • TBD | • TBD |
| • TBD | • TBD |

| Opportunities | Threats |
|---------------|---------|
| • TBD | • TBD |
| • TBD | • TBD |

---

## 4. Key Performance Indicators

### Growth Metrics
| KPI | Target (Q1) | Target (Q2) | Target (Year 1) |
|-----|-------------|-------------|-----------------|
| Active Users | TBD | TBD | TBD |
| Revenue | $TBD | $TBD | $TBD |
| Retention Rate | TBD% | TBD% | TBD% |

### Health Metrics
| KPI | Target | Red Flag |
|-----|--------|----------|
| Churn Rate | <5% | >10% |
| NPS Score | >40 | <20 |
| Support Tickets | <X/user | >Y/user |

---

## 5. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Technical failure | Low | High | Redundancy, backups |
| Market competition | Medium | Medium | Differentiation |
| Funding runway | Medium | High | Revenue focus |

---

## 6. Growth Strategy

### Phase 1: Foundation (Months 1-3)
- Build MVP
- Acquire first 100 users
- Validate product-market fit

### Phase 2: Growth (Months 4-6)
- Scale marketing
- Add key features
- Target 1,000 users

### Phase 3: Scale (Months 7-12)
- Expand market
- Optimize unit economics
- Target profitability

---

*This spec is maintained by the Business Strategy team. Last updated: {{date}}*
`,

  'ui_designer': `# SPEC: UI Designer

**Version:** 1.0
**Created:** {{date}}
**Owner:** Design Team

---

## 1. Design System

### Color Palette
| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| Primary | #3B82F6 | 59, 130, 246 | Main actions, links |
| Primary Dark | #2563EB | 37, 99, 235 | Hover states |
| Secondary | #6B7280 | 107, 114, 128 | Secondary text |
| Success | #10B981 | 16, 185, 129 | Success states |
| Warning | #F59E0B | 245, 158, 11 | Warning states |
| Error | #EF4444 | 239, 68, 68 | Error states |
| Background | #FFFFFF | 255, 255, 255 | Page background |
| Surface | #F9FAFB | 249, 250, 251 | Card backgrounds |
| Border | #E5E7EB | 229, 231, 235 | Borders, dividers |

### Typography
| Style | Font | Size | Weight | Line Height |
|-------|------|------|--------|-------------|
| H1 | Inter | 36px | 700 | 1.2 |
| H2 | Inter | 30px | 600 | 1.3 |
| H3 | Inter | 24px | 600 | 1.4 |
| H4 | Inter | 20px | 500 | 1.4 |
| Body | Inter | 16px | 400 | 1.5 |
| Small | Inter | 14px | 400 | 1.5 |
| Caption | Inter | 12px | 400 | 1.4 |

### Spacing Scale
| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Small gaps |
| md | 16px | Standard spacing |
| lg | 24px | Section spacing |
| xl | 32px | Large sections |
| 2xl | 48px | Page sections |

---

## 2. Screen Inventory

### Public Pages
| Screen | Route | Purpose | Priority |
|--------|-------|---------|----------|
| Landing | / | Marketing, conversion | High |
| Login | /login | Authentication | High |
| Register | /register | User signup | High |

### Authenticated Pages
| Screen | Route | Purpose | Priority |
|--------|-------|---------|----------|
| Dashboard | /dashboard | Main app view | High |
| Settings | /settings | User preferences | Medium |
| Profile | /profile | User profile | Medium |

---

## 3. Component States

### Button States
| State | Background | Text | Border |
|-------|------------|------|--------|
| Default | Primary | White | None |
| Hover | Primary Dark | White | None |
| Active | Primary Dark | White | None |
| Disabled | Gray 200 | Gray 400 | None |
| Loading | Primary | Spinner | None |

### Input States
| State | Border | Background | Label |
|-------|--------|------------|-------|
| Default | Gray 300 | White | Gray 600 |
| Focus | Primary | White | Primary |
| Error | Error | Error/10 | Error |
| Disabled | Gray 200 | Gray 50 | Gray 400 |

---

## 4. Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| Mobile | 0-639px | Phones |
| Tablet | 640-1023px | Tablets |
| Desktop | 1024-1279px | Laptops |
| Large | 1280px+ | Desktops |

### Layout Guidelines
- **Mobile**: Single column, stacked elements
- **Tablet**: 2 columns where appropriate
- **Desktop**: Full layout with sidebar

---

## 5. Accessibility Requirements

### WCAG 2.1 AA Compliance
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Color contrast ratio ≥ 3:1 for large text
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible
- [ ] Alt text for all images
- [ ] Form labels associated with inputs
- [ ] Error messages descriptive and helpful

### Interaction Patterns
- Tab order follows visual order
- Skip links for navigation
- ARIA labels where needed
- Reduced motion option supported

---

## 6. Wireframe Descriptions

### Landing Page
\`\`\`
┌─────────────────────────────────────┐
│ [Logo]              [Login] [Start] │ ← Header
├─────────────────────────────────────┤
│                                     │
│     Hero: Value Proposition         │
│     [Primary CTA Button]            │
│                                     │
├─────────────────────────────────────┤
│  Feature 1  │  Feature 2  │  Feature 3  │ ← Features
├─────────────────────────────────────┤
│           Social Proof              │
├─────────────────────────────────────┤
│           Final CTA                 │
├─────────────────────────────────────┤
│           Footer                    │
└─────────────────────────────────────┘
\`\`\`

### Dashboard
\`\`\`
┌──────┬──────────────────────────────┐
│      │ Header: Search, User Menu   │
│ Side │────────────────────────────│
│ bar  │                              │
│      │     Main Content Area        │
│ Nav  │                              │
│      │     Cards / Tables / etc     │
│      │                              │
└──────┴──────────────────────────────┘
\`\`\`

---

*This spec is maintained by the Design team. Last updated: {{date}}*
`,
};

/**
 * Compile a Handlebars template
 */
function compileTemplate(templateContent: string): HandlebarsTemplateDelegate {
  return Handlebars.compile(templateContent);
}

/**
 * Get template content - first try external templates, then fall back to defaults
 */
async function getTemplateContent(templateName: string, templateDir?: string): Promise<string> {
  // Try external template first
  if (templateDir) {
    const externalPath = path.join(templateDir, 'specs', `${templateName}.template.md`);
    if (await exists(externalPath)) {
      return readFile(externalPath);
    }

    // Try numbered format (e.g., 01_product_manager.template.md)
    const numberedPath = path.join(templateDir, 'specs', `*_${templateName}.template.md`);
    // Simple glob fallback - check common numbered patterns
    for (let i = 1; i <= 10; i++) {
      const numPath = path.join(templateDir, 'specs', `0${i}_${templateName}.template.md`);
      if (await exists(numPath)) {
        return readFile(numPath);
      }
    }
  }

  // Fall back to default templates
  if (DEFAULT_TEMPLATES[templateName]) {
    return DEFAULT_TEMPLATES[templateName];
  }

  throw new Error(`Template not found: ${templateName}`);
}

/**
 * Generate spec file from template
 */
export async function generateSpec(
  templateName: string,
  options: SpecGeneratorOptions
): Promise<string> {
  const templateContent = await getTemplateContent(templateName, options.templateDir);
  const template = compileTemplate(templateContent);

  const data = {
    date: getCurrentDate(),
    projectName: options.projectName,
    description: options.requirements?.description || 'A new project',
    problemStatement: options.requirements?.problemStatement || 'TBD',
    successState: options.requirements?.successState || 'TBD',
    personas: options.requirements?.personas || [],
    userFlows: options.requirements?.userFlows || [],
    functionalRequirements: options.requirements?.requirements.filter(r => r.type === 'functional') || [],
    nonFunctionalRequirements: options.requirements?.requirements.filter(r => r.type === 'non_functional') || [],
    techStack: options.requirements?.techStack || {
      frontend: 'React',
      backend: 'Node.js',
      database: 'PostgreSQL',
      language: 'TypeScript',
    },
    constraints: options.requirements?.constraints || [],
    assumptions: options.requirements?.assumptions || [],
    outOfScope: options.requirements?.outOfScope || [],
  };

  return template(data);
}

/**
 * Generate all spec files
 */
export async function generateAllSpecs(options: SpecGeneratorOptions): Promise<string[]> {
  const specTypes = [
    { name: 'product_manager', filename: '01_product_manager.md' },
    { name: 'backend_lead', filename: '02_backend_lead.md' },
    { name: 'frontend_lead', filename: '03_frontend_lead.md' },
    { name: 'db_architect', filename: '04_db_architect.md' },
    { name: 'qa_lead', filename: '05_qa_lead.md' },
    { name: 'devops_lead', filename: '06_devops_lead.md' },
    { name: 'marketing_lead', filename: '07_marketing_lead.md' },
    { name: 'finance_lead', filename: '08_finance_lead.md' },
    { name: 'business_lead', filename: '09_business_lead.md' },
    { name: 'ui_designer', filename: '10_ui_designer.md' },
  ];

  const generatedFiles: string[] = [];

  for (const spec of specTypes) {
    try {
      const content = await generateSpec(spec.name, options);
      const outputPath = path.join(options.outputDir, spec.filename);
      await writeFile(outputPath, content);
      generatedFiles.push(outputPath);
    } catch (error) {
      console.error(`Failed to generate ${spec.name}: ${error}`);
    }
  }

  return generatedFiles;
}
