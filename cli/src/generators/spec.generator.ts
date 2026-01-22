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
