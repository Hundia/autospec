/**
 * SDD Spec Command
 * Generate new feature specification files
 */

import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { input, editor } from '@inquirer/prompts';

import { readConfig } from '../utils/config.js';
import { writeFile, ensureDir, exists } from '../utils/file.js';
import { getCurrentDate } from '../utils/file.js';

export interface SpecOptions {
  description?: string;
  interactive?: boolean;
}

/**
 * Convert name to filename slug
 */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Generate feature spec template
 */
function generateFeatureSpec(name: string, description?: string): string {
  return `# Feature Spec: ${name}

**Version:** 1.0
**Created:** ${getCurrentDate()}
**Owner:** Product Team
**Status:** Draft

---

## Overview

${description || 'Describe the feature and its purpose.'}

---

## User Stories

### Story 1: [Primary user action]
**As a** [user type]
**I want to** [action]
**So that** [benefit]

#### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Story 2: [Secondary user action]
**As a** [user type]
**I want to** [action]
**So that** [benefit]

#### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

---

## Technical Requirements

### Backend
- [ ] API endpoint: \`[METHOD] /api/v1/[resource]\`
- [ ] Database changes: [describe]
- [ ] Validation: [describe]

### Frontend
- [ ] Component: [name]
- [ ] Page: [path]
- [ ] State management: [describe]

---

## API Design

### Endpoint: [Method] /api/v1/[resource]

**Request:**
\`\`\`json
{
  "field": "value"
}
\`\`\`

**Response (Success):**
\`\`\`json
{
  "data": {
    "id": "uuid",
    "field": "value"
  }
}
\`\`\`

**Response (Error):**
\`\`\`json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Description"
  }
}
\`\`\`

---

## UI/UX Design

### Wireframe
\`\`\`
┌────────────────────────────────────┐
│  Header                            │
├────────────────────────────────────┤
│                                    │
│  [Component sketch here]           │
│                                    │
├────────────────────────────────────┤
│  Footer                            │
└────────────────────────────────────┘
\`\`\`

### Component States
1. **Loading** - Show skeleton/spinner
2. **Empty** - Show empty state message
3. **Error** - Show error message with retry
4. **Success** - Show data

---

## Database Schema

\`\`\`sql
-- Add any new tables or columns here
-- Example:
-- ALTER TABLE users ADD COLUMN new_field VARCHAR(255);
\`\`\`

---

## Testing Requirements

### Unit Tests
- [ ] Test case 1
- [ ] Test case 2

### Integration Tests
- [ ] API endpoint test
- [ ] Database integration test

### E2E Tests
- [ ] User flow test

---

## Dependencies

### Blocking
- [List any features/tickets that must be complete first]

### Blocked By This
- [List any features/tickets that depend on this]

---

## Out of Scope

- [Feature/aspect not included in this version]
- [Feature/aspect not included in this version]

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Risk 1 | High/Medium/Low | Mitigation strategy |

---

## Sprint Tickets

| # | Ticket | Owner | Model |
|---|--------|-------|-------|
| X.1 | [First task] | Backend | sonnet |
| X.2 | [Second task] | Frontend | sonnet |
| X.3 | [Third task] | QA | sonnet |

---

## Notes

[Additional notes, references, or discussion points]

---

*Last updated: ${getCurrentDate()}*
`;
}

/**
 * Generate a new feature spec
 */
export async function specCommand(name: string, options: SpecOptions = {}): Promise<void> {
  const projectDir = process.cwd();

  console.log(chalk.bold(`\n  Creating Feature Spec: ${name}\n`));

  // Check for config
  const config = await readConfig(projectDir);
  if (!config) {
    console.log(chalk.yellow('  SDD not initialized in this directory.'));
    console.log(chalk.dim('  Run ' + chalk.cyan('sdd init') + ' to get started.\n'));
    return;
  }

  // Get description if interactive
  let description = options.description;
  if (options.interactive && !description) {
    description = await input({
      message: 'Brief description of the feature:',
      default: '',
    });
  }

  const spinner = ora('Creating spec file...').start();

  try {
    // Create features directory
    const featuresDir = path.join(projectDir, config.specsDir, 'features');
    await ensureDir(featuresDir);

    // Generate filename
    const slug = toSlug(name);
    const filename = `${slug}.md`;
    const outputPath = path.join(featuresDir, filename);

    // Check if file exists
    if (await exists(outputPath)) {
      spinner.fail('Spec file already exists');
      console.log(chalk.yellow(`\n  File exists: ${path.relative(projectDir, outputPath)}`));
      console.log(chalk.dim('  Use a different name or delete the existing file.\n'));
      return;
    }

    // Generate spec content
    const content = generateFeatureSpec(name, description);

    // Write file
    await writeFile(outputPath, content);

    spinner.succeed('Feature spec created');

    console.log(chalk.green(`\n  ✓ Created: ${path.relative(projectDir, outputPath)}`));

    console.log(chalk.bold('\n  Next steps:'));
    console.log(chalk.dim(`  1. Open ${path.relative(projectDir, outputPath)}`));
    console.log(chalk.dim('  2. Fill in the user stories and acceptance criteria'));
    console.log(chalk.dim('  3. Define technical requirements'));
    console.log(chalk.dim('  4. Add sprint tickets to backlog.md'));

    console.log('');
  } catch (error) {
    spinner.fail('Failed to create spec');
    console.error(chalk.red(`\n  Error: ${error}`));
    throw error;
  }
}
