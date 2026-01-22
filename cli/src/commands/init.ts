/**
 * SDD Init Command
 * Initialize SDD in a new or existing project
 */

import path from 'path';
import { input, select, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import ora from 'ora';

import { createConfig, writeConfig, configExists, SDDConfig } from '../utils/config.js';
import { ensureDir, exists, readFile } from '../utils/file.js';
import { generateAllSpecs } from '../generators/spec.generator.js';
import { generateBacklog } from '../generators/backlog.generator.js';
import { generatePromptFile } from '../generators/prompt.generator.js';
import { generateSkills } from '../generators/skill.generator.js';
import { parseRequirements, ParsedRequirements } from '../parsers/requirements.parser.js';

export interface InitOptions {
  name?: string;
  provider?: 'claude' | 'copilot' | 'gemini' | 'all';
  force?: boolean;
  yes?: boolean;
}

/**
 * Run interactive prompts to gather project info
 */
async function gatherProjectInfo(options: InitOptions): Promise<{
  projectName: string;
  aiProvider: 'claude' | 'copilot' | 'gemini' | 'all';
  techStack: SDDConfig['techStack'];
  requirements?: ParsedRequirements;
}> {
  // Check for requirements file
  let requirements: ParsedRequirements | undefined;
  const possibleReqFiles = ['requirements.md', 'srs.md', 'prd.md', 'README.md'];

  for (const file of possibleReqFiles) {
    const filePath = path.join(process.cwd(), file);
    if (await exists(filePath)) {
      const content = await readFile(filePath);
      try {
        requirements = parseRequirements(content);
        console.log(chalk.dim(`  Found requirements in ${file}`));
        break;
      } catch {
        // Continue to next file
      }
    }
  }

  // If --yes flag, use defaults
  if (options.yes) {
    return {
      projectName: options.name || requirements?.projectName || path.basename(process.cwd()),
      aiProvider: options.provider || 'claude',
      techStack: requirements?.techStack || {
        frontend: 'React',
        backend: 'Node.js',
        database: 'PostgreSQL',
        language: 'TypeScript',
      },
      requirements,
    };
  }

  // Interactive prompts
  const projectName = await input({
    message: 'Project name:',
    default: options.name || requirements?.projectName || path.basename(process.cwd()),
  });

  const aiProvider = await select({
    message: 'AI provider:',
    choices: [
      { name: 'Claude Code', value: 'claude' as const },
      { name: 'GitHub Copilot', value: 'copilot' as const },
      { name: 'Google Gemini', value: 'gemini' as const },
      { name: 'All providers', value: 'all' as const },
    ],
    default: options.provider || 'claude',
  });

  const frontend = await input({
    message: 'Frontend framework:',
    default: requirements?.techStack?.frontend || 'React',
  });

  const backend = await input({
    message: 'Backend framework:',
    default: requirements?.techStack?.backend || 'Node.js',
  });

  const database = await input({
    message: 'Database:',
    default: requirements?.techStack?.database || 'PostgreSQL',
  });

  const language = await input({
    message: 'Primary language:',
    default: requirements?.techStack?.language || 'TypeScript',
  });

  return {
    projectName,
    aiProvider,
    techStack: { frontend, backend, database, language },
    requirements,
  };
}

/**
 * Initialize SDD in a project
 */
export async function initCommand(options: InitOptions = {}): Promise<void> {
  const projectDir = process.cwd();

  console.log(chalk.bold('\n  SDD Init - Spec-Driven Development Setup\n'));

  // Check if already initialized
  if (await configExists(projectDir)) {
    if (!options.force) {
      console.log(chalk.yellow('  SDD is already initialized in this directory.'));
      const shouldOverwrite = await confirm({
        message: 'Overwrite existing configuration?',
        default: false,
      });

      if (!shouldOverwrite) {
        console.log(chalk.dim('  Aborted.'));
        return;
      }
    }
  }

  // Gather project info
  const info = await gatherProjectInfo(options);

  const spinner = ora('Creating SDD project structure...').start();

  try {
    // Create directories
    const specsDir = path.join(projectDir, 'specs');
    const promptsDir = path.join(projectDir, 'prompts');

    await ensureDir(specsDir);
    await ensureDir(promptsDir);

    spinner.text = 'Generating spec files...';

    // Generate spec files
    const specFiles = await generateAllSpecs({
      projectName: info.projectName,
      outputDir: specsDir,
      requirements: info.requirements,
    });

    spinner.text = 'Generating backlog...';

    // Generate backlog
    const backlogPath = await generateBacklog({
      projectName: info.projectName,
      outputDir: specsDir,
      requirements: info.requirements,
    });

    spinner.text = 'Generating sprint prompt...';

    // Generate Sprint 0 prompt
    const promptPath = await generatePromptFile(0, {
      projectName: info.projectName,
      outputDir: promptsDir,
      techStack: info.techStack,
    });

    spinner.text = 'Generating AI skills...';

    // Generate AI skills
    const skillFiles = await generateSkills({
      projectDir,
      aiProvider: info.aiProvider,
    });

    spinner.text = 'Creating configuration...';

    // Create config
    const config = createConfig({
      projectName: info.projectName,
      aiProvider: info.aiProvider,
      techStack: info.techStack,
    });

    await writeConfig(config, projectDir);

    spinner.succeed('SDD initialized successfully!');

    // Summary
    console.log('\n' + chalk.bold('  Created files:\n'));
    console.log(chalk.dim('  specs/'));
    for (const file of specFiles) {
      console.log(chalk.green(`    ✓ ${path.basename(file)}`));
    }
    console.log(chalk.green(`    ✓ ${path.basename(backlogPath)}`));

    console.log(chalk.dim('\n  prompts/'));
    console.log(chalk.green(`    ✓ ${path.basename(promptPath)}`));

    console.log(chalk.dim('\n  ai skills/'));
    for (const file of skillFiles) {
      console.log(chalk.green(`    ✓ ${path.relative(projectDir, file)}`));
    }

    console.log(chalk.green('\n    ✓ .sddrc.json'));

    // Next steps
    console.log('\n' + chalk.bold('  Next steps:\n'));
    console.log(chalk.dim('  1. Review and customize specs in specs/'));
    console.log(chalk.dim('  2. Review Sprint 0 tickets in specs/backlog.md'));
    console.log(chalk.dim('  3. Start Sprint 0 with prompts/prompt_sprint0.md'));
    console.log(chalk.dim('  4. Run ' + chalk.cyan('sdd status') + ' to see progress'));

    console.log('');
  } catch (error) {
    spinner.fail('Failed to initialize SDD');
    console.error(chalk.red(`\n  Error: ${error}`));
    throw error;
  }
}
