/**
 * SDD Sprint Command
 * Generate sprint execution prompts
 */

import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

import { readConfig } from '../utils/config.js';
import { readFile, exists, writeFile } from '../utils/file.js';
import { parseBacklog, Sprint } from '../parsers/backlog.parser.js';
import { generateSprintPrompt, generateSprint0Prompt } from '../generators/prompt.generator.js';

export interface SprintOptions {
  output?: string;
}

/**
 * Generate a sprint prompt
 */
export async function sprintCommand(sprintNumber: number, options: SprintOptions = {}): Promise<void> {
  const projectDir = process.cwd();

  console.log(chalk.bold(`\n  Generating Sprint ${sprintNumber} Prompt\n`));

  // Check for config
  const config = await readConfig(projectDir);
  if (!config) {
    console.log(chalk.yellow('  SDD not initialized in this directory.'));
    console.log(chalk.dim('  Run ' + chalk.cyan('sdd init') + ' to get started.\n'));
    return;
  }

  // Find backlog
  const backlogPath = path.join(projectDir, config.specsDir, 'backlog.md');
  if (!(await exists(backlogPath))) {
    console.log(chalk.yellow('  Backlog not found.'));
    console.log(chalk.dim(`  Expected at: ${backlogPath}\n`));
    return;
  }

  const spinner = ora('Parsing backlog...').start();

  try {
    // Parse backlog
    const content = await readFile(backlogPath);
    const backlog = parseBacklog(content);

    // Find the sprint
    const sprint = backlog.sprints.find(s => s.number === sprintNumber);

    if (!sprint && sprintNumber !== 0) {
      spinner.fail(`Sprint ${sprintNumber} not found in backlog`);
      console.log(chalk.dim('\n  Available sprints:'));
      for (const s of backlog.sprints) {
        console.log(chalk.dim(`    - Sprint ${s.number}: ${s.name}`));
      }
      return;
    }

    spinner.text = 'Generating prompt...';

    // Generate prompt content
    let promptContent: string;

    if (sprintNumber === 0 || !sprint) {
      promptContent = generateSprint0Prompt({
        projectName: config.projectName,
        outputDir: path.join(projectDir, config.promptsDir),
        techStack: config.techStack,
      });
    } else {
      // Find previous sprint for context
      const previousSprint = backlog.sprints.find(s => s.number === sprintNumber - 1);

      promptContent = generateSprintPrompt(sprint, {
        projectName: config.projectName,
        outputDir: path.join(projectDir, config.promptsDir),
        techStack: config.techStack,
      }, previousSprint);
    }

    // Determine output path
    const outputPath = options.output || path.join(
      projectDir,
      config.promptsDir,
      `prompt_sprint${sprintNumber}.md`
    );

    // Write prompt file
    await writeFile(outputPath, promptContent);

    spinner.succeed('Sprint prompt generated');

    console.log(chalk.green(`\n  ✓ Created: ${path.relative(projectDir, outputPath)}`));

    // Show sprint info
    if (sprint) {
      console.log(chalk.dim(`\n  Sprint ${sprintNumber}: ${sprint.name}`));
      console.log(chalk.dim(`  Tickets: ${sprint.tickets.length}`));
      console.log(chalk.dim(`  Goal: ${sprint.goal || 'Not specified'}`));
    }

    console.log(chalk.bold('\n  Next steps:'));
    console.log(chalk.dim(`  1. Open ${path.relative(projectDir, outputPath)}`));
    console.log(chalk.dim('  2. Copy the prompt to your AI assistant'));
    console.log(chalk.dim('  3. Start executing tickets!'));

    console.log('');
  } catch (error) {
    spinner.fail('Failed to generate sprint prompt');
    console.error(chalk.red(`\n  Error: ${error}`));
    throw error;
  }
}
