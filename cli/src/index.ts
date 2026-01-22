#!/usr/bin/env node

/**
 * SDD CLI - Spec-Driven Development Command Line Interface
 *
 * A toolkit for bootstrapping and managing SDD projects.
 */

import { Command } from 'commander';
import chalk from 'chalk';

import { initCommand, InitOptions } from './commands/init.js';
import { statusCommand } from './commands/status.js';
import { sprintCommand, SprintOptions } from './commands/sprint.js';
import { specCommand, SpecOptions } from './commands/spec.js';

const VERSION = '1.0.0';

// ASCII art banner
const BANNER = `
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   ${chalk.bold.cyan('SDD')} - Spec-Driven Development CLI           ║
  ║                                                   ║
  ║   Bootstrap and manage SDD projects with ease     ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
`;

// Create the main program
const program = new Command();

program
  .name('sdd')
  .description('Spec-Driven Development CLI - Bootstrap and manage SDD projects')
  .version(VERSION);

// Init command
program
  .command('init')
  .description('Initialize SDD in a new or existing project')
  .option('-n, --name <name>', 'Project name')
  .option('-p, --provider <provider>', 'AI provider (claude, copilot, gemini, all)', 'claude')
  .option('-f, --force', 'Overwrite existing configuration')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .action(async (options: InitOptions) => {
    try {
      await initCommand(options);
    } catch (error) {
      process.exit(1);
    }
  });

// Status command
program
  .command('status')
  .description('Show current sprint status from backlog')
  .argument('[sprint]', 'Sprint number to show (default: active sprint)')
  .action(async (sprint?: string) => {
    try {
      const sprintNum = sprint ? parseInt(sprint, 10) : undefined;
      await statusCommand(sprintNum);
    } catch (error) {
      process.exit(1);
    }
  });

// Sprint command
program
  .command('sprint')
  .description('Generate sprint execution prompt')
  .argument('<number>', 'Sprint number')
  .option('-o, --output <path>', 'Output file path')
  .action(async (number: string, options: SprintOptions) => {
    try {
      const sprintNum = parseInt(number, 10);
      if (isNaN(sprintNum)) {
        console.error(chalk.red('\n  Error: Sprint number must be a number\n'));
        process.exit(1);
      }
      await sprintCommand(sprintNum, options);
    } catch (error) {
      process.exit(1);
    }
  });

// Spec command
program
  .command('spec')
  .description('Generate a new feature specification')
  .argument('<name>', 'Feature name')
  .option('-d, --description <text>', 'Brief description of the feature')
  .option('-i, --interactive', 'Interactive mode with prompts')
  .action(async (name: string, options: SpecOptions) => {
    try {
      await specCommand(name, options);
    } catch (error) {
      process.exit(1);
    }
  });

// Help command with banner
program
  .command('help')
  .description('Show help information')
  .action(() => {
    console.log(BANNER);
    program.help();
  });

// Default action (show help with banner)
program.action(() => {
  console.log(BANNER);
  console.log(chalk.bold('  Commands:\n'));
  console.log(chalk.cyan('    sdd init') + '            Initialize SDD in a project');
  console.log(chalk.cyan('    sdd status') + '          Show current sprint status');
  console.log(chalk.cyan('    sdd sprint <num>') + '    Generate sprint prompt');
  console.log(chalk.cyan('    sdd spec <name>') + '     Create a new feature spec');
  console.log('');
  console.log(chalk.dim('  Run ' + chalk.cyan('sdd <command> --help') + ' for more info\n'));
});

// Parse arguments
program.parse();
