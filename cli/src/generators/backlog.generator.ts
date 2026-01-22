/**
 * Backlog Generator
 * Generates backlog.md file from templates and requirements
 */

import path from 'path';
import { writeFile } from '../utils/file.js';
import { getCurrentDate } from '../utils/file.js';
import { ParsedRequirements } from '../parsers/requirements.parser.js';
import { SDDConfig } from '../utils/config.js';

export interface BacklogGeneratorOptions {
  projectName: string;
  outputDir: string;
  requirements?: ParsedRequirements;
  config?: Partial<SDDConfig>;
}

/**
 * Generate a Sprint 0 (Foundation) with typical setup tasks
 */
function generateSprint0(techStack: ParsedRequirements['techStack']): string {
  const backend = techStack.backend || 'Node.js';
  const frontend = techStack.frontend || 'React';
  const database = techStack.database || 'PostgreSQL';
  const language = techStack.language || 'TypeScript';

  return `## 🔄 Sprint 0: Foundation & Setup — ACTIVE

**Goal:** Set up project infrastructure and development environment.

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
| 0.1 | Initialize git repository with README | 🔲 Todo | DevOps | haiku |
| 0.2 | Create Docker development environment | 🔲 Todo | DevOps | sonnet |
| 0.3 | Set up ${database} database | 🔲 Todo | DevOps | haiku |
| 0.4 | Initialize backend project (${backend} + ${language}) | 🔲 Todo | Backend | sonnet |
| 0.5 | Initialize frontend project (${frontend} + ${language}) | 🔲 Todo | Frontend | sonnet |
| 0.6 | Configure ESLint and Prettier | 🔲 Todo | DevOps | haiku |
| 0.7 | Set up testing frameworks (Vitest) | 🔲 Todo | QA | sonnet |
| 0.8 | Create initial CI pipeline | 🔲 Todo | DevOps | sonnet |
| 0.9 | Create health check endpoint | 🔲 Todo | Backend | haiku |
| 0.10 | Validate full stack runs locally | 🔲 Todo | QA | sonnet |

### Dependencies
- None (this is the first sprint)

### Definition of Done
- [ ] \`docker-compose up\` runs successfully
- [ ] Backend responds to \`/health\` endpoint
- [ ] Frontend displays welcome page
- [ ] All lint checks pass
- [ ] CI pipeline runs successfully
- [ ] README has setup instructions`;
}

/**
 * Generate Sprint 1 based on requirements
 */
function generateSprint1(requirements: ParsedRequirements): string {
  const tickets: string[] = [];
  let ticketNum = 1;

  // Generate tickets from functional requirements
  const mustHave = requirements.requirements.filter(
    r => r.type === 'functional' && r.priority === 'must_have'
  ).slice(0, 5);

  const shouldHave = requirements.requirements.filter(
    r => r.type === 'functional' && r.priority === 'should_have'
  ).slice(0, 3);

  const reqs = [...mustHave, ...shouldHave].slice(0, 8);

  for (const req of reqs) {
    // Determine owner based on keywords
    let owner = 'Full Stack';
    let model = 'sonnet';

    const desc = req.description.toLowerCase();
    if (desc.includes('api') || desc.includes('backend') || desc.includes('endpoint') || desc.includes('database')) {
      owner = 'Backend';
    } else if (desc.includes('ui') || desc.includes('frontend') || desc.includes('component') || desc.includes('page')) {
      owner = 'Frontend';
    } else if (desc.includes('test') || desc.includes('qa')) {
      owner = 'QA';
    } else if (desc.includes('deploy') || desc.includes('ci') || desc.includes('docker')) {
      owner = 'DevOps';
      model = 'haiku';
    }

    // Simple tasks can use haiku
    if (desc.includes('simple') || desc.includes('basic') || desc.includes('add') || desc.includes('create')) {
      model = desc.length < 50 ? 'haiku' : 'sonnet';
    }

    tickets.push(`| 1.${ticketNum} | ${req.description} | 🔲 Todo | ${owner} | ${model} |`);
    ticketNum++;
  }

  // If no requirements, add placeholder
  if (tickets.length === 0) {
    tickets.push('| 1.1 | Define first feature requirements | 🔲 Todo | Product | sonnet |');
    tickets.push('| 1.2 | Create database schema for core entities | 🔲 Todo | Backend | sonnet |');
    tickets.push('| 1.3 | Implement API endpoints for core features | 🔲 Todo | Backend | sonnet |');
    tickets.push('| 1.4 | Build UI components for main page | 🔲 Todo | Frontend | sonnet |');
    tickets.push('| 1.5 | Write tests for Sprint 1 features | 🔲 Todo | QA | sonnet |');
  }

  const sprintName = requirements.requirements.length > 0
    ? 'Core Features'
    : 'First Feature';

  return `## 🔲 Sprint 1: ${sprintName} — PLANNED

**Goal:** Implement the first set of core features.

| # | Ticket | Status | Owner | Model |
|---|--------|--------|-------|-------|
${tickets.join('\n')}

### Dependencies
- Sprint 0 complete

### Definition of Done
- [ ] All tickets implemented and tested
- [ ] Code reviewed
- [ ] No console errors
- [ ] Documentation updated`;
}

/**
 * Generate future sprints placeholder
 */
function generateFutureSprints(): string {
  return `## Future Sprints (Planned)

| Sprint | Name | Description | Est. Tickets |
|--------|------|-------------|--------------|
| 2 | Enhanced Features | Build on Sprint 1 functionality | ~10 |
| 3 | User Experience | Polish and UX improvements | ~8 |
| 4 | Integration | Third-party integrations | ~10 |
| 5 | Performance | Optimization and scaling | ~8 |`;
}

/**
 * Generate complete backlog.md content
 */
export function generateBacklogContent(options: BacklogGeneratorOptions): string {
  const date = getCurrentDate();
  const techStack = options.requirements?.techStack || {
    frontend: 'React',
    backend: 'Node.js',
    database: 'PostgreSQL',
    language: 'TypeScript',
  };

  return `# ${options.projectName} Product Backlog

**Created:** ${date}
**Last Updated:** ${date}

---

## Team Specs Reference

| # | Spec | Description | Lines |
|---|------|-------------|-------|
| 01 | [product_manager.md](./01_product_manager.md) | Vision, personas, requirements | - |
| 02 | [backend_lead.md](./02_backend_lead.md) | API design, auth, patterns | - |
| 03 | [frontend_lead.md](./03_frontend_lead.md) | Design system, components | - |
| 04 | [db_architect.md](./04_db_architect.md) | Database schema | - |
| 05 | [qa_lead.md](./05_qa_lead.md) | Testing strategy | - |
| 06 | [devops_lead.md](./06_devops_lead.md) | Infrastructure, CI/CD | - |

---

## Architecture Vision

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     ${options.projectName.padEnd(30)}                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐        ┌──────────────┐                 │
│   │   Frontend   │◄──────►│   Backend    │                 │
│   │   (${(techStack.frontend || 'React').padEnd(8)})    │  API   │   (${(techStack.backend || 'Node.js').padEnd(8)})  │                 │
│   └──────────────┘        └──────┬───────┘                 │
│                                  │                          │
│                           ┌──────▼───────┐                 │
│                           │   Database   │                 │
│                           │ (${(techStack.database || 'PostgreSQL').padEnd(10)}) │                 │
│                           └──────────────┘                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
\`\`\`

---

## Status Legend

| Emoji | Status | Meaning |
|-------|--------|---------|
| 🔲 | Todo | Not started |
| 🔄 | In Progress | Currently being worked on |
| 🧪 | QA Review | Implementation complete, needs testing |
| ✅ | Done | Tested and verified |
| ⏸️ | Blocked | Cannot proceed (see notes) |

---

${generateSprint0(techStack)}

---

${generateSprint1(options.requirements || { projectName: options.projectName, description: '', personas: [], userFlows: [], requirements: [], techStack, constraints: [], assumptions: [], outOfScope: [] })}

---

${generateFutureSprints()}

---

## Bug Backlog

Bugs discovered during development:

| # | Bug | Status | Severity | Sprint |
|---|-----|--------|----------|--------|
| B.1 | (None yet) | - | - | - |

---

## Notes

### Sprint Retrospectives
- Sprint 0: (TBD after completion)

### Important Decisions
- (Document key architecture or process decisions here)

---

*Last updated: ${date}*
`;
}

/**
 * Generate backlog.md file
 */
export async function generateBacklog(options: BacklogGeneratorOptions): Promise<string> {
  const content = generateBacklogContent(options);
  const outputPath = path.join(options.outputDir, 'backlog.md');
  await writeFile(outputPath, content);
  return outputPath;
}
