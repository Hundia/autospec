/**
 * Skill Generator
 * Generates AI skill/command files for different platforms
 */

import path from 'path';
import { writeFile, ensureDir } from '../utils/file.js';
import { getCurrentDate } from '../utils/file.js';

export interface SkillGeneratorOptions {
  projectDir: string;
  aiProvider: 'claude' | 'copilot' | 'gemini' | 'all';
}

/**
 * Execute Ticket skill content
 */
const EXECUTE_TICKET_SKILL = `# Execute Ticket

Execute a ticket from the backlog following Spec-Driven Development methodology.

## Usage

\`\`\`
/execute-ticket [ticket_number]
\`\`\`

**Example:** \`/execute-ticket 1.3\`

## Instructions

When this command is invoked:

1. **Read the backlog** to find the specified ticket:
   - Read \`specs/backlog.md\`
   - Locate the ticket by number (e.g., 1.3 = Sprint 1, Ticket 3)
   - Understand the ticket description and requirements

2. **Check dependencies**:
   - Verify prerequisite tickets are marked ✅ Done
   - If dependencies are incomplete, notify the user

3. **Read relevant specs** based on ticket type:
   - Backend tickets → \`specs/02_backend_lead.md\`
   - Frontend tickets → \`specs/03_frontend_lead.md\`
   - Database tickets → \`specs/04_db_architect.md\`
   - DevOps tickets → \`specs/06_devops_lead.md\`

4. **Update backlog status**:
   - Change ticket status from 🔲 Todo to 🔄 In Progress
   - Edit \`specs/backlog.md\` with the status change

5. **Implement the ticket**:
   - Follow patterns and conventions from the relevant spec files
   - Write clean, typed code following project standards
   - Add appropriate error handling

6. **Write tests** (if applicable):
   - Follow \`specs/05_qa_lead.md\` for testing guidelines
   - Unit tests for services/utilities
   - Integration tests for API endpoints

7. **Update backlog to QA Review**:
   - Change status from 🔄 In Progress to 🧪 QA Review

8. **Provide completion summary**:
   - List files changed
   - List tests added/modified
   - Note any follow-up items

## Important Rules

- Always read the spec files before implementing
- Follow existing code patterns in the project
- Update backlog.md status immediately after each phase
- Never skip the dependencies check
- If blocked, update status to ⏸️ Blocked with a note
`;

/**
 * Sprint Status skill content
 */
const SPRINT_STATUS_SKILL = `# Sprint Status

Display the current sprint status from the backlog.

## Usage

\`\`\`
/sprint-status
\`\`\`

## Instructions

When this command is invoked:

1. **Read the backlog**:
   - Read \`specs/backlog.md\`
   - Find the current active sprint (marked with 🔄 ACTIVE)

2. **Calculate statistics**:
   - Total tickets in sprint
   - Completed (✅ Done)
   - In Progress (🔄)
   - QA Review (🧪)
   - Todo (🔲)
   - Blocked (⏸️)

3. **Display status**:
   \`\`\`
   ## Sprint [N]: [Name]

   Progress: [====----] 50% (5/10)

   ✅ Done:        3
   🔄 In Progress: 2
   🧪 QA Review:   1
   🔲 Todo:        3
   ⏸️ Blocked:     1

   ### Next Actions
   - [List of todo tickets]
   \`\`\`

4. **Highlight blockers** if any exist

## Output Format

Use visual progress bars and emoji for clarity.
`;

/**
 * Update Backlog skill content
 */
const UPDATE_BACKLOG_SKILL = `# Update Backlog

Update a ticket's status in the backlog.

## Usage

\`\`\`
/update-backlog [ticket_number] [status]
\`\`\`

**Example:** \`/update-backlog 1.3 done\`

## Status Options

| Status | Emoji | Keyword |
|--------|-------|---------|
| Todo | 🔲 | todo |
| In Progress | 🔄 | in_progress, working |
| QA Review | 🧪 | qa, review |
| Done | ✅ | done, complete |
| Blocked | ⏸️ | blocked |

## Instructions

1. **Read the backlog**: Open \`specs/backlog.md\`
2. **Find the ticket**: Locate by ticket number
3. **Update status**: Change the emoji in the Status column
4. **Update timestamp**: Update "Last Updated" date at top
5. **Confirm change**: Show before/after

## Example

Before: \`| 1.3 | Create user API | 🔄 In Progress | Backend | sonnet |\`
After:  \`| 1.3 | Create user API | ✅ Done | Backend | sonnet |\`
`;

/**
 * QA Review skill content
 */
const QA_REVIEW_SKILL = `# QA Review

Perform QA review on completed tickets.

## Usage

\`\`\`
/qa-review [ticket_number]
\`\`\`

**Example:** \`/qa-review 1.3\`

## Instructions

1. **Verify implementation**:
   - Check the ticket is marked 🧪 QA Review in backlog
   - Review the implemented code

2. **Run tests**:
   - \`npm test\` for unit tests
   - \`npm run test:integration\` for integration tests

3. **Check code quality**:
   - No TypeScript errors
   - No ESLint warnings
   - Code follows project patterns

4. **Functional testing**:
   - Test the feature manually if UI-related
   - Verify API responses if backend-related

5. **Update status**:
   - If passing: Change to ✅ Done
   - If failing: Change back to 🔄 In Progress with notes

## Output Format

\`\`\`
## QA Review: Ticket [X.X]

### Tests
- [ ] Unit tests pass
- [ ] Integration tests pass

### Code Quality
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Follows patterns

### Functional
- [ ] Feature works as expected

### Result: [PASS/FAIL]
\`\`\`
`;

/**
 * Create Spec skill content
 */
const CREATE_SPEC_SKILL = `# Create Spec

Create a new feature specification document.

## Usage

\`\`\`
/create-spec [feature_name]
\`\`\`

**Example:** \`/create-spec user-authentication\`

## Instructions

1. **Gather requirements**:
   - Ask user for feature description
   - Identify user stories
   - Define acceptance criteria

2. **Create spec file**:
   - Create \`specs/features/[feature_name].md\`
   - Use feature spec template

3. **Include sections**:
   - Overview
   - User Stories
   - Acceptance Criteria
   - Technical Requirements
   - API Endpoints (if applicable)
   - UI Components (if applicable)
   - Dependencies
   - Out of Scope

4. **Link to backlog**:
   - Add reference to main backlog
   - Create placeholder tickets if needed
`;

/**
 * Plan Sprint skill content
 */
const PLAN_SPRINT_SKILL = `# Plan Sprint

Assemble a team of expert AI agents to collaboratively plan a sprint before building it. Experts analyze the goal in parallel, then three PMs (drafter → reviewer → finalizer) produce a production-ready sprint plan for the backlog.

## Usage

\`\`\`
/plan-sprint [goal description]
\`\`\`

**Examples:**
- \`/plan-sprint Add user authentication with JWT and social login\`
- \`/plan-sprint Refactor payment processing to support subscriptions\`
- \`/plan-sprint Build admin dashboard with analytics and user management\`

## Instructions

When this command is invoked, execute the 6-phase planning workflow below. The argument \`$ARGUMENTS\` is the sprint goal description.

---

### Phase 1: Goal Analysis & Expert Selection

1. **Validate the goal.** If \`$ARGUMENTS\` is empty or too vague (fewer than 5 words, no clear deliverable), ask the user to clarify.

2. **Read \`specs/backlog.md\`** — scan all sprint headers to determine the next sprint number.

3. **Read \`docs/\` index** — identify which subsystems the goal touches.

4. **Determine which experts to activate:**

| Expert | Activate When | Reads |
|--------|---------------|-------|
| **Architect** (ALWAYS) | Every sprint | \`specs/02_backend_lead.md\`, \`specs/03_frontend_lead.md\`, project entry points, relevant \`docs/\` |
| **UX/UI Expert** | Frontend/GUI work | \`specs/10_ui_designer.md\`, \`docs/ui-design-system/\`, \`docs/flows/\` |
| **Database Expert** | Schema changes | \`specs/04_db_architect.md\`, \`docs/architecture/database.md\`, schema file |
| **Human Experience Expert** | User-facing features | \`specs/01_product_manager.md\`, relevant \`docs/flows/\` |

5. **Announce** which experts are activated and which subsystems are affected.

---

### Phase 2: Expert Analysis (PARALLEL)

Launch all activated experts simultaneously as parallel Task agents. Each produces structured analysis:

- **Architect**: System impact, API design, file structure, technical approach, integration points, risks, complexity estimate
- **UX/UI Expert**: User flows, component design, page layout, accessibility, data-testid attributes, i18n keys
- **Database Expert**: Schema changes, migration plan, query patterns, data integrity, rollback strategy
- **Human Experience Expert**: Persona impact, user journey map, cognitive load, error recovery, edge cases, success metrics

---

### Phase 3: PM-A — Draft Sprint Plan

Runs SEQUENTIALLY after Phase 2. Reads \`specs/01_product_manager.md\`, receives all expert analyses, synthesizes into complete draft sprint with:
- Problem statement, user stories
- Technical decisions table
- Phased tickets (each with #, title, description, owner, model, points, status, dependencies)
- QA plan, docs impact, i18n

---

### Phase 4: PM-B — Review & Enhance

Runs SEQUENTIALLY after Phase 3. Reads \`specs/05_qa_lead.md\`, adversarially reviews PM-A's draft:
- Completeness, ticket granularity, dependency correctness
- Model assignment (FinOps), QA coverage gaps, documentation gaps
- Points realism (30-60 total), overlap with existing backlog
- Outputs: issues found, tickets to add/modify/remove, adjustments

---

### Phase 5: PM-C — Final Synthesis

Runs SEQUENTIALLY after Phase 4. Merges PM-A draft + PM-B review:
- Incorporates valid PM-B recommendations
- Resolves conflicts
- Validates: sequential numbering, no ticket >8 pts, total 30-60 pts, complete metadata
- Outputs FINAL sprint in exact backlog format

---

### Phase 6: Present & Commit to Backlog

1. Show planning team summary + full sprint preview
2. **Wait for user confirmation** before writing
3. If confirmed: append to \`specs/backlog.md\`, update dates and docs index
4. If modifications requested: apply and re-present

## Edge Cases

- **Goal too vague** → ask user to clarify
- **Overlaps existing tickets** → surface and ask how to handle
- **Blocking prerequisite found** → add Phase 0 prerequisites
- **Sprint too large (>60 pts)** → PM-C splits into sub-sprints
- **Backend-only** → skip UX/UI and HX experts
- **Frontend-only** → skip Database expert

## Important Rules

- ALWAYS run experts in PARALLEL — they are independent
- ALWAYS run PMs in SEQUENCE — each depends on the previous
- NEVER write to backlog without user confirmation
- ALWAYS match the exact backlog format from existing sprints
- Use FinOps model selection: haiku (40%), sonnet (45%), opus (15%)
`;

/**
 * Create Sprint Docs skill content
 */
const CREATE_SPRINT_DOCS_SKILL = `# Create Sprint Docs

Create documentation for a completed sprint.

## Usage

\`\`\`
/create-sprint-docs [sprint_number]
\`\`\`

**Example:** \`/create-sprint-docs 0\`

## Instructions

1. **Verify sprint completion**:
   - All tickets should be ✅ Done
   - No blockers remaining

2. **Create sprint folder**:
   - \`sprints/sprint-[N]-[name]/\`

3. **Generate documents**:
   - \`summary.md\` - Sprint overview
   - \`qa-results.md\` - Test results
   - \`release-notes.md\` - User-facing changes

4. **Update backlog**:
   - Mark sprint as ✅ COMPLETE
   - Add retrospective notes
`;

/**
 * GitHub Copilot instructions content
 */
const COPILOT_INSTRUCTIONS = `# GitHub Copilot Instructions

This project follows AutoSpec's Spec-Driven Development methodology.

## Core Principles

1. **Specs are Source of Truth**
   - Always read relevant specs before implementing
   - Specs are in the \`specs/\` directory
   - Follow patterns defined in specs

2. **Backlog-Driven Development**
   - Work from tickets in \`specs/backlog.md\`
   - Update ticket status as you work
   - Follow the status workflow: 🔲 → 🔄 → 🧪 → ✅

3. **Code Patterns**
   - Backend: Repository → Service → Controller → Routes
   - Frontend: Components in \`components/\`, pages in \`pages/\`
   - Use Zod for validation
   - Use TypeScript strict mode

## File Structure

\`\`\`
specs/
├── 01_product_manager.md  # Product requirements
├── 02_backend_lead.md     # API patterns
├── 03_frontend_lead.md    # UI patterns
├── 04_db_architect.md     # Database schema
├── 05_qa_lead.md          # Testing strategy
├── 06_devops_lead.md      # Infrastructure
└── backlog.md             # Sprint tickets
\`\`\`

## When Implementing

1. Read the relevant spec file first
2. Follow existing code patterns
3. Write tests for new code
4. Update backlog status

## Testing

- Run \`npm test\` for unit tests
- Run \`npm run test:integration\` for API tests
- Ensure all tests pass before completing tickets
`;

/**
 * Generate Claude skills (for .claude/commands/)
 */
async function generateClaudeSkills(projectDir: string): Promise<string[]> {
  const commandsDir = path.join(projectDir, '.claude', 'commands');
  await ensureDir(commandsDir);

  const skills = [
    { name: 'plan-sprint.md', content: PLAN_SPRINT_SKILL },
    { name: 'execute-ticket.md', content: EXECUTE_TICKET_SKILL },
    { name: 'sprint-status.md', content: SPRINT_STATUS_SKILL },
    { name: 'update-backlog.md', content: UPDATE_BACKLOG_SKILL },
    { name: 'qa-review.md', content: QA_REVIEW_SKILL },
    { name: 'create-spec.md', content: CREATE_SPEC_SKILL },
    { name: 'create-sprint-docs.md', content: CREATE_SPRINT_DOCS_SKILL },
  ];

  const generatedFiles: string[] = [];

  for (const skill of skills) {
    const filePath = path.join(commandsDir, skill.name);
    await writeFile(filePath, skill.content);
    generatedFiles.push(filePath);
  }

  return generatedFiles;
}

/**
 * Generate GitHub Copilot instructions
 */
async function generateCopilotSkills(projectDir: string): Promise<string[]> {
  const githubDir = path.join(projectDir, '.github');
  await ensureDir(githubDir);

  const filePath = path.join(githubDir, 'copilot-instructions.md');
  await writeFile(filePath, COPILOT_INSTRUCTIONS);

  return [filePath];
}

/**
 * Generate Gemini context file
 */
async function generateGeminiSkills(projectDir: string): Promise<string[]> {
  const content = `# Gemini Context

${COPILOT_INSTRUCTIONS}

## Additional Gemini Instructions

When working with this codebase:
1. Reference spec files for context
2. Follow established patterns
3. Update backlog status as you complete work

*Generated with AutoSpec on ${getCurrentDate()}*
`;

  const filePath = path.join(projectDir, '.gemini', 'context.md');
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, content);

  return [filePath];
}

/**
 * Generate all skill files based on AI provider
 */
export async function generateSkills(options: SkillGeneratorOptions): Promise<string[]> {
  const generatedFiles: string[] = [];

  switch (options.aiProvider) {
    case 'claude':
      generatedFiles.push(...await generateClaudeSkills(options.projectDir));
      break;
    case 'copilot':
      generatedFiles.push(...await generateCopilotSkills(options.projectDir));
      break;
    case 'gemini':
      generatedFiles.push(...await generateGeminiSkills(options.projectDir));
      break;
    case 'all':
      generatedFiles.push(...await generateClaudeSkills(options.projectDir));
      generatedFiles.push(...await generateCopilotSkills(options.projectDir));
      generatedFiles.push(...await generateGeminiSkills(options.projectDir));
      break;
  }

  return generatedFiles;
}
