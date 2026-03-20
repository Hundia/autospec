/**
 * Sprint Prompts Generator
 * Generates sprint_prompts/ folder with elaboration prompts
 * for executing each sprint with full AutoSpec methodology context
 */

import path from 'path';
import { writeFile, ensureDir } from '../utils/file.js';
import { getCurrentDate } from '../utils/file.js';
import { ParsedRequirements } from '../parsers/requirements.parser.js';

export interface SprintPromptsGeneratorOptions {
  projectName: string;
  outputDir: string;
  requirements?: ParsedRequirements;
  techStack?: {
    frontend?: string;
    backend?: string;
    database?: string;
    language?: string;
  };
}

/**
 * Generate the master sprint execution prompt (reusable template)
 */
function generateMasterSprintPrompt(options: SprintPromptsGeneratorOptions): string {
  const ts = options.techStack || { frontend: 'React', backend: 'Node.js', database: 'PostgreSQL', language: 'TypeScript' };

  return `# Master Sprint Execution Prompt

**Project:** ${options.projectName}
**Generated:** ${getCurrentDate()}

---

## How to Use This Prompt

Copy this prompt and replace the \`[SPRINT_NUMBER]\` placeholders with the actual sprint number you are executing. Then paste it into your AI assistant (Claude, Copilot, Gemini).

---

## The Prompt

\`\`\`
You are executing Sprint [SPRINT_NUMBER] of "${options.projectName}" using the AutoSpec Spec-Driven Development methodology.

## Critical Rules

1. **ALWAYS read specs before implementing.** Every ticket has a relevant spec file. Read it first.
2. **ALWAYS update backlog.md** after completing each ticket (🔲 → 🔄 → 🧪 → ✅).
3. **ALWAYS follow the layered architecture:** Routes → Middleware → Controllers → Services → Repositories.
4. **ALWAYS write tests** for new code. Minimum: unit tests for services, integration tests for APIs.
5. **ALWAYS use the recommended model** specified in the backlog for each ticket (haiku/sonnet/opus).

## Project Context

- **Project:** ${options.projectName}
- **Stack:** ${ts.frontend} + ${ts.backend} + ${ts.database} (${ts.language})
- **Spec Files:** Read from \`specs/\` directory
- **Backlog:** \`specs/backlog.md\`
- **Documentation:** \`docs/\` directory

## Step-by-Step Execution

### Step 1: Read Context
Read these files in order:
1. \`specs/backlog.md\` — Find Sprint [SPRINT_NUMBER] tickets
2. \`specs/01_product_manager.md\` — Understand product requirements
3. \`specs/02_backend_lead.md\` — API patterns and architecture
4. \`specs/03_frontend_lead.md\` — UI component patterns
5. \`specs/04_db_architect.md\` — Database schema
6. \`specs/05_qa_lead.md\` — Testing requirements

### Step 2: Plan Execution Order
Review Sprint [SPRINT_NUMBER] tickets and determine:
- Which tickets have dependencies on others
- Which can run in parallel (backend vs frontend)
- Which model (haiku/sonnet/opus) is recommended for each

Create a todo list to track progress.

### Step 3: Execute Tickets
For each ticket:
1. Update backlog status to 🔄 In Progress
2. Read the relevant spec file
3. Implement following spec patterns
4. Write tests (unit + integration where applicable)
5. Run tests: \`cd api && npm test\` or \`cd web && npm test\`
6. Update backlog status to 🧪 QA Review
7. Self-review, then mark ✅ Done

### Step 4: Model Selection (FinOps)

**haiku** (40% of tasks — cheapest, fastest):
- Database migrations with provided schema
- Basic CRUD endpoints following existing patterns
- Simple UI components from design system
- Config files, seed scripts, simple tests

**sonnet** (45% of tasks — balanced):
- Standard services with business logic
- Dashboard UI components
- API integrations
- Unit and integration tests

**opus** (15% of tasks — complex only):
- Architecture decisions
- Security-critical code (auth, encryption)
- Complex algorithms
- Novel problem-solving

### Step 5: Backlog Updates
After each ticket, edit \`specs/backlog.md\`:
- Change status emoji: 🔲 → 🔄 → 🧪 → ✅
- Add notes for blocked tickets: ⏸️

### Step 6: Sprint Completion
When all tickets are done:
1. Run full test suite
2. Verify all tickets marked ✅ in backlog.md
3. Update sprint status to COMPLETE
4. Create sprint summary in sprints/ folder

## Code Standards

- **Validation:** Zod schemas for all inputs
- **Error Handling:** Custom error classes, consistent error responses
- **Types:** Strict TypeScript, no \`any\`
- **Tests:** Vitest for unit/integration, follow test pyramid
- **Patterns:** Repository → Service → Controller → Routes
- **Naming:** camelCase for variables, PascalCase for types, snake_case for DB

## Starting Command

Begin now. Read \`specs/backlog.md\` to find Sprint [SPRINT_NUMBER] tickets, then start executing.
\`\`\`

---

*Generated with AutoSpec on ${getCurrentDate()}*
`;
}

/**
 * Generate Sprint 0 elaboration prompt
 */
function generateSprint0ElaborationPrompt(options: SprintPromptsGeneratorOptions): string {
  const ts = options.techStack || { frontend: 'React', backend: 'Node.js', database: 'PostgreSQL', language: 'TypeScript' };

  return `# Sprint 0: Foundation — Elaboration Prompt

**Project:** ${options.projectName}
**Sprint:** 0 (Foundation & Setup)
**Generated:** ${getCurrentDate()}

---

## Paste This Into Your AI Assistant

\`\`\`
You are setting up the foundation for "${options.projectName}" using AutoSpec methodology.

## Your Mission
Execute Sprint 0: Create the complete project infrastructure so that future sprints can build features on a solid foundation.

## Tech Stack
- Frontend: ${ts.frontend} with ${ts.language}
- Backend: ${ts.backend} with ${ts.language}
- Database: ${ts.database}
- Testing: Vitest
- Containerization: Docker & Docker Compose
- Linting: ESLint + Prettier

## Context Files to Read First
1. \`specs/backlog.md\` — Sprint 0 tickets
2. \`specs/02_backend_lead.md\` — Backend architecture patterns
3. \`specs/03_frontend_lead.md\` — Frontend component patterns
4. \`specs/04_db_architect.md\` — Database schema conventions
5. \`specs/06_devops_lead.md\` — Infrastructure requirements
6. \`docs/docker.md\` — Docker configuration reference
7. \`docs/environments.md\` — Environment setup guide
8. \`docs/project-setup.md\` — Project structure reference

## Sprint 0 Execution Plan

### Phase 1: Infrastructure (Tickets 0.1–0.3) — Use haiku/sonnet

**0.1 Initialize Git Repository**
- Create README.md with project overview
- Create .gitignore (Node.js template)
- Create .env.example with all env vars
- Initialize npm workspaces (if monorepo)

**0.2 Docker Development Environment**
- Create docker-compose.yml per \`docs/docker.md\`
- Create Dockerfile for API (multi-stage: dev/build/prod)
- Create Dockerfile for Web (multi-stage: dev/build/prod)
- Verify: \`docker-compose up -d\` works

**0.3 Database Setup**
- Configure ${ts.database} in Docker
- Create initial migration with base tables (users, sessions)
- Create seed script with test data
- Verify: Database accepts connections

### Phase 2: Application Setup (Tickets 0.4–0.6) — Use sonnet

**0.4 Backend Project**
- Initialize ${ts.backend} project with ${ts.language}
- Set up project structure per \`specs/02_backend_lead.md\`:
  \`\`\`
  api/src/{config,controllers,services,repositories,routes,schemas,middleware,types,utils}
  \`\`\`
- Configure TypeScript (strict mode)
- Set up Zod for validation
- Create base error handling middleware
- Create base response format utilities

**0.5 Frontend Project**
- Initialize ${ts.frontend} project with Vite + ${ts.language}
- Set up project structure per \`specs/03_frontend_lead.md\`:
  \`\`\`
  web/src/{components/ui,components/layout,components/features,pages,hooks,services,stores,types,utils}
  \`\`\`
- Configure Tailwind CSS with design tokens from \`specs/10_ui_designer.md\`
- Create base Layout component (Header, Sidebar, Footer)

**0.6 Linting & Formatting**
- Configure ESLint for ${ts.language}
- Configure Prettier
- Add lint-staged + husky for pre-commit hooks
- Verify: \`npm run lint\` passes

### Phase 3: Quality & Validation (Tickets 0.7–0.10) — Use sonnet

**0.7 Testing Frameworks**
- Configure Vitest for backend unit tests
- Configure Vitest + Testing Library for frontend
- Create test setup files (mocks, utilities)
- Write first example test for each

**0.8 CI Pipeline**
- Create GitHub Actions workflow (.github/workflows/ci.yml)
- Stages: Install → Lint → Typecheck → Test → Build
- Run on: push to main/develop, pull requests

**0.9 Health Check Endpoint**
- Create GET /health endpoint
- Return: { status: "ok", timestamp, uptime, version }
- Add database connectivity check
- Verify: \`curl localhost:4000/health\` returns 200

**0.10 Full Stack Validation**
- Start all services via docker-compose
- Verify backend health check
- Verify frontend renders
- Run full test suite
- Document any issues

## Backlog Updates
After EACH ticket:
1. Edit \`specs/backlog.md\`
2. Change ticket status: 🔲 Todo → 🔄 In Progress → ✅ Done
3. Continue to next ticket

## Definition of Done
- [ ] \`docker-compose up\` runs all services
- [ ] Backend: GET /health returns 200
- [ ] Frontend: Welcome page renders at localhost:3000
- [ ] All lint checks pass
- [ ] All tests pass
- [ ] CI pipeline runs successfully
- [ ] README has setup instructions

Begin execution now. Start by reading specs/backlog.md.
\`\`\`

---

*Generated with AutoSpec on ${getCurrentDate()}*
`;
}

/**
 * Generate Sprint N elaboration prompt (template for feature sprints)
 */
function generateFeatureSprintElaborationPrompt(options: SprintPromptsGeneratorOptions): string {
  const ts = options.techStack || { frontend: 'React', backend: 'Node.js', database: 'PostgreSQL', language: 'TypeScript' };

  return `# Sprint N: Feature Sprint — Elaboration Prompt Template

**Project:** ${options.projectName}
**Sprint:** [Replace N with sprint number]
**Generated:** ${getCurrentDate()}

---

## Paste This Into Your AI Assistant

\`\`\`
You are executing Sprint [N] of "${options.projectName}" using AutoSpec Spec-Driven Development.

## Prerequisites
- Sprint 0 (Foundation) is COMPLETE ✅
- All previous sprints are COMPLETE ✅
- Project runs locally via docker-compose

## Context Files to Read First
1. \`specs/backlog.md\` — Find Sprint [N] tickets
2. \`specs/01_product_manager.md\` — Product requirements & user flows
3. \`specs/02_backend_lead.md\` — API patterns, endpoint conventions
4. \`specs/03_frontend_lead.md\` — Component architecture, design system
5. \`specs/04_db_architect.md\` — Database schema, migration patterns
6. \`specs/05_qa_lead.md\` — Testing requirements, coverage targets
7. \`docs/architecture.md\` — System architecture overview
8. \`docs/workflows.md\` — Development workflow reference

## Execution Strategy

### For Each Backend Ticket:
1. Read \`specs/02_backend_lead.md\` for patterns
2. Create database migration if needed (follow \`specs/04_db_architect.md\`)
3. Create Zod validation schema in \`api/src/schemas/\`
4. Create repository in \`api/src/repositories/\`
5. Create service in \`api/src/services/\`
6. Create controller in \`api/src/controllers/\`
7. Create routes in \`api/src/routes/\`
8. Write unit tests for service
9. Write integration test for endpoint
10. Run \`cd api && npm test\`

### For Each Frontend Ticket:
1. Read \`specs/03_frontend_lead.md\` for component patterns
2. Read \`specs/10_ui_designer.md\` for design tokens
3. Create/update TypeScript types in \`web/src/types/\`
4. Create API service call in \`web/src/services/\`
5. Create components in \`web/src/components/\`
6. Create or update page in \`web/src/pages/\`
7. Add routes if needed
8. Write component tests
9. Run \`cd web && npm test\`

### FinOps Model Selection
Check the "Model" column in backlog.md for each ticket:
- **haiku**: Simple CRUD, configs, seeds, straightforward UI
- **sonnet**: Services with logic, dashboard components, API integrations
- **opus**: Architecture decisions, security code, complex algorithms

### Multi-Agent Option (for faster execution)
If using two AI agents in parallel:

**Agent A (Backend):**
- Execute all backend-tagged tickets
- Work in \`api/\` directory only
- Read: specs/02_backend_lead.md, specs/04_db_architect.md

**Agent B (Frontend):**
- Execute all frontend-tagged tickets
- Work in \`web/\` directory only
- Read: specs/03_frontend_lead.md, specs/10_ui_designer.md

**Integration Phase (single agent):**
- Connect frontend to backend APIs
- Run full test suite
- Fix integration issues

## Backlog Updates
After EACH ticket:
1. Edit \`specs/backlog.md\`
2. Change status: 🔲 → 🔄 → 🧪 → ✅
3. If blocked: ⏸️ with note explaining why

## Sprint Completion Checklist
- [ ] All Sprint [N] tickets marked ✅ in backlog.md
- [ ] All tests passing (\`npm test\` in api/ and web/)
- [ ] No TypeScript errors (\`npm run typecheck\`)
- [ ] No ESLint errors (\`npm run lint\`)
- [ ] Feature works end-to-end (manual verification)
- [ ] Sprint status updated to COMPLETE in backlog.md

Begin execution now. Start by reading specs/backlog.md to find Sprint [N] tickets.
\`\`\`

---

*Generated with AutoSpec on ${getCurrentDate()}*
`;
}

/**
 * Generate multi-agent sprint prompt
 */
function generateMultiAgentSprintPrompt(options: SprintPromptsGeneratorOptions): string {
  const ts = options.techStack || { frontend: 'React', backend: 'Node.js', database: 'PostgreSQL', language: 'TypeScript' };

  return `# Multi-Agent Sprint Execution Prompt

**Project:** ${options.projectName}
**Generated:** ${getCurrentDate()}

---

## When to Use Multi-Agent Execution

Use this when a sprint has both backend and frontend tickets that can run in parallel. This saves ~45% execution time.

---

## Agent A Prompt: Backend

\`\`\`
You are Agent A (Backend) executing Sprint [N] of "${options.projectName}".

## Your Scope
You ONLY work on backend tickets. Do NOT touch frontend code.

## Your Directory
Work exclusively in: \`api/\`

## Your Specs
Read these before starting:
- \`specs/backlog.md\` — Your assigned tickets (Backend/DevOps owner)
- \`specs/02_backend_lead.md\` — API patterns (YOUR PRIMARY REFERENCE)
- \`specs/04_db_architect.md\` — Database schema
- \`specs/05_qa_lead.md\` — Testing requirements
- \`docs/architecture.md\` — System architecture

## Your Pattern
For each ticket:
1. Database migration (if needed) → \`api/src/config/\`
2. Zod schema → \`api/src/schemas/\`
3. Repository → \`api/src/repositories/\`
4. Service → \`api/src/services/\`
5. Controller → \`api/src/controllers/\`
6. Routes → \`api/src/routes/\`
7. Tests → \`api/tests/\`

## Your Rules
- Update \`specs/backlog.md\` after each ticket
- Run \`cd api && npm test\` after each implementation
- Use the model specified in backlog (haiku/sonnet/opus)
- Do NOT modify any files in \`web/\` directory

Begin by reading specs/backlog.md and executing backend tickets for Sprint [N].
\`\`\`

---

## Agent B Prompt: Frontend

\`\`\`
You are Agent B (Frontend) executing Sprint [N] of "${options.projectName}".

## Your Scope
You ONLY work on frontend tickets. Do NOT touch backend code.

## Your Directory
Work exclusively in: \`web/\`

## Your Specs
Read these before starting:
- \`specs/backlog.md\` — Your assigned tickets (Frontend owner)
- \`specs/03_frontend_lead.md\` — Component patterns (YOUR PRIMARY REFERENCE)
- \`specs/10_ui_designer.md\` — Design system, colors, typography
- \`specs/05_qa_lead.md\` — Testing requirements
- \`docs/architecture.md\` — System architecture

## Your Pattern
For each ticket:
1. TypeScript types → \`web/src/types/\`
2. API service → \`web/src/services/\`
3. Components → \`web/src/components/\`
4. Page → \`web/src/pages/\`
5. Routes (if new page)
6. Tests → \`web/tests/\`

## Your Rules
- Update \`specs/backlog.md\` after each ticket
- Run \`cd web && npm test\` after each implementation
- Follow design tokens from specs/10_ui_designer.md
- Use Tailwind CSS for styling
- Do NOT modify any files in \`api/\` directory

## API Assumptions
While Agent A builds the API, stub your API calls with:
\`\`\`typescript
// web/src/services/api.ts
// Agent A is building these endpoints. Use this interface for now:
const API_BASE = import.meta.env.VITE_API_URL;
\`\`\`

Begin by reading specs/backlog.md and executing frontend tickets for Sprint [N].
\`\`\`

---

## Integration Phase Prompt (After Both Agents Complete)

\`\`\`
Both Agent A (Backend) and Agent B (Frontend) have completed their Sprint [N] tickets for "${options.projectName}".

## Your Mission
Integrate their work and verify everything works end-to-end.

## Steps

1. **Review backlog.md** — Verify all Sprint [N] tickets are marked 🧪 or ✅

2. **Connect Frontend to Backend**
   - Update API service URLs in web/src/services/
   - Replace any stubbed API calls with real endpoints
   - Ensure API response types match frontend interfaces

3. **Run Integration Tests**
   \`\`\`bash
   cd api && npm test
   cd web && npm test
   docker-compose up -d && npm run test:e2e
   \`\`\`

4. **Fix Integration Issues**
   - Type mismatches between API responses and frontend
   - CORS configuration
   - Authentication token flow
   - Error handling alignment

5. **Final Verification**
   - All tests pass
   - Feature works end-to-end in browser
   - No console errors
   - No TypeScript errors

6. **Update Backlog**
   - Mark all Sprint [N] tickets ✅ Done
   - Update sprint status to COMPLETE
   - Add any bugs found to Bug Backlog

Complete the integration now. Start by reading specs/backlog.md.
\`\`\`

---

*Generated with AutoSpec on ${getCurrentDate()}*
`;
}

/**
 * Generate QA review sprint prompt
 */
function generateQAReviewPrompt(options: SprintPromptsGeneratorOptions): string {
  return `# QA Review Sprint Prompt

**Project:** ${options.projectName}
**Generated:** ${getCurrentDate()}

---

## Paste This Into Your AI Assistant After Sprint Completion

\`\`\`
You are the QA Lead reviewing Sprint [N] of "${options.projectName}".

## Your Mission
Perform a thorough QA review of all Sprint [N] deliverables.

## Context Files
1. \`specs/backlog.md\` — Sprint [N] tickets (should be 🧪 QA Review)
2. \`specs/05_qa_lead.md\` — QA strategy and testing standards
3. \`docs/testing-guide.md\` — Testing patterns and examples

## QA Checklist

### 1. Code Quality
For each file changed in Sprint [N]:
- [ ] No TypeScript errors (\`npm run typecheck\`)
- [ ] No ESLint warnings (\`npm run lint\`)
- [ ] Follows project patterns (Repository → Service → Controller)
- [ ] No hardcoded values (use env vars or config)
- [ ] No console.log statements (use logger)
- [ ] Error handling is comprehensive

### 2. Test Coverage
- [ ] Unit tests exist for all new services
- [ ] Integration tests exist for all new API endpoints
- [ ] Frontend component tests exist for new components
- [ ] All tests pass: \`cd api && npm test && cd ../web && npm test\`
- [ ] Coverage meets target (80%+ for unit tests)

### 3. Security Review
- [ ] All inputs validated with Zod schemas
- [ ] No SQL injection vulnerabilities (using ORM/parameterized)
- [ ] Authentication required on protected endpoints
- [ ] No sensitive data in logs
- [ ] Passwords hashed with bcrypt
- [ ] JWT tokens have expiry

### 4. Functional Testing
For each user-facing feature:
- [ ] Happy path works as expected
- [ ] Error states handled gracefully
- [ ] Loading states shown
- [ ] Empty states handled
- [ ] Edge cases covered (long text, special chars, etc.)

### 5. Performance
- [ ] No N+1 database queries
- [ ] Proper database indexes exist
- [ ] No unnecessary re-renders in React
- [ ] Images optimized (if applicable)

### 6. Accessibility (from specs/10_ui_designer.md)
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1)
- [ ] All interactive elements keyboard accessible
- [ ] Form labels associated with inputs
- [ ] Alt text on images
- [ ] Focus indicators visible

## Output Format

For each ticket reviewed, produce:

\`\`\`
### Ticket [X.Y]: [Description]

**Status:** PASS / FAIL / NEEDS FIXES

**Tests:**
- Unit: ✅ Pass (X tests)
- Integration: ✅ Pass (Y tests)

**Issues Found:**
1. [Issue description] — Severity: [High/Medium/Low]

**Verdict:** [Ready for production / Needs fixes]
\`\`\`

## Final Actions
1. Mark passing tickets: 🧪 → ✅ Done
2. Mark failing tickets: 🧪 → 🔄 In Progress (with notes)
3. Add any bugs to Bug Backlog section of backlog.md
4. Update sprint status if all tickets pass

Begin the QA review now. Read specs/backlog.md to find Sprint [N] tickets.
\`\`\`

---

*Generated with AutoSpec on ${getCurrentDate()}*
`;
}

/**
 * Generate FinOps optimization prompt
 */
function generateFinOpsPrompt(options: SprintPromptsGeneratorOptions): string {
  return `# FinOps Optimization Prompt

**Project:** ${options.projectName}
**Generated:** ${getCurrentDate()}

---

## Purpose

Use this prompt to optimize AI model usage costs across sprints. Feed this to your AI assistant at the start of each sprint to ensure cost-efficient model selection.

---

## Paste This Into Your AI Assistant

\`\`\`
Before executing Sprint [N] of "${options.projectName}", optimize model selection for cost efficiency.

## Model Cost Tiers

| Model | Relative Cost | Speed | Use For |
|-------|--------------|-------|---------|
| haiku | $1 (baseline) | Fastest | 40% of tasks |
| sonnet | ~$5x haiku | Medium | 45% of tasks |
| opus | ~$25x haiku | Slowest | 15% of tasks |

## Optimization Rules

### Use haiku (cheapest) for:
- Database migrations with provided SQL/schema
- Simple CRUD endpoints following existing patterns
- Basic UI components from design system (buttons, cards, inputs)
- Configuration files (.env, docker-compose, tsconfig)
- Seed scripts and fixtures
- Simple unit tests following existing test patterns
- README updates and documentation
- Git operations and file organization

### Use sonnet (balanced) for:
- Services with business logic
- Controllers with request validation
- Dashboard pages with multiple components
- API integrations with external services
- Complex forms with validation
- Unit tests requiring mock setup
- Integration tests with database
- State management implementation

### Use opus (premium) ONLY for:
- System architecture decisions
- Security-critical code (auth, encryption, token management)
- Complex algorithms (search, sorting, data processing)
- Performance optimization
- Debugging complex integration issues
- Novel problems without existing patterns

## Sprint [N] Cost Forecast

Review the tickets in specs/backlog.md for Sprint [N] and classify each:

| Ticket | Description | Recommended Model | Reason |
|--------|-------------|-------------------|--------|
| [N.1] | [desc] | [haiku/sonnet/opus] | [why] |
| ... | ... | ... | ... |

**Expected Cost Distribution:**
- haiku tasks: [count] (~40%)
- sonnet tasks: [count] (~45%)
- opus tasks: [count] (~15%)

**Estimated Cost Savings vs. All-Opus:** ~60-70%

## Action
Apply these model selections as you execute each ticket. Track actual model used in backlog.md.
\`\`\`

---

*Generated with AutoSpec on ${getCurrentDate()}*
`;
}

/**
 * Generate all sprint prompt files
 */
export async function generateSprintPrompts(options: SprintPromptsGeneratorOptions): Promise<string[]> {
  const sprintPromptsDir = options.outputDir;
  await ensureDir(sprintPromptsDir);

  const prompts = [
    { filename: 'master-sprint-prompt.md', content: generateMasterSprintPrompt(options) },
    { filename: 'sprint-0-foundation.md', content: generateSprint0ElaborationPrompt(options) },
    { filename: 'sprint-n-feature-template.md', content: generateFeatureSprintElaborationPrompt(options) },
    { filename: 'multi-agent-execution.md', content: generateMultiAgentSprintPrompt(options) },
    { filename: 'qa-review.md', content: generateQAReviewPrompt(options) },
    { filename: 'finops-optimization.md', content: generateFinOpsPrompt(options) },
  ];

  const generatedFiles: string[] = [];

  for (const prompt of prompts) {
    const outputPath = path.join(sprintPromptsDir, prompt.filename);
    await writeFile(outputPath, prompt.content);
    generatedFiles.push(outputPath);
  }

  return generatedFiles;
}
