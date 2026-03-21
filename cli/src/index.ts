#!/usr/bin/env node

/**
 * AutoSpec CLI - Spec-Driven Development Command Line Interface
 *
 * A toolkit for bootstrapping and managing AutoSpec projects.
 */

import { Command } from 'commander';
import chalk from 'chalk';

import { initCommand, InitOptions } from './commands/init.js';
import { statusCommand } from './commands/status.js';
import { sprintCommand, SprintOptions } from './commands/sprint.js';
import { specCommand, SpecOptions } from './commands/spec.js';
import { dashboardCommand, DashboardOptions } from './commands/dashboard.js';
import { doctorCommand } from './commands/doctor.js';

const VERSION = '0.1.0';

// ASCII art banner
const BANNER = `
  ╔═══════════════════════════════════════════════════╗
  ║                                                   ║
  ║   ${chalk.bold.cyan('AutoSpec')} - Spec-Driven Development CLI      ║
  ║                                                   ║
  ║   Bootstrap and manage AutoSpec projects           ║
  ║                                                   ║
  ╚═══════════════════════════════════════════════════╝
`;

// Create the main program
const program = new Command();

program
  .name('autospec')
  .description('AutoSpec CLI - Spec-Driven Development for AI-assisted projects')
  .version(VERSION);

// Init command
program
  .command('init')
  .description('Initialize AutoSpec in a new or existing project')
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

// Dashboard command
program
  .command('dashboard')
  .description('Launch the monitoring dashboard')
  .option('-p, --port <port>', 'Port to run dashboard on', '3847')
  .action(async (options: DashboardOptions) => {
    try {
      await dashboardCommand(options);
    } catch (error) {
      process.exit(1);
    }
  });

// Doctor command
program
  .command('doctor')
  .description('Check system readiness and available LLM providers')
  .action(async () => {
    try {
      await doctorCommand();
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
  console.log(chalk.cyan('    autospec init') + '        Initialize AutoSpec in a project');
  console.log(chalk.cyan('    autospec status') + '      Show current sprint status');
  console.log(chalk.cyan('    autospec sprint <num>') + ' Generate sprint prompt');
  console.log(chalk.cyan('    autospec spec <name>') + ' Create a new feature spec');
  console.log(chalk.cyan('    autospec dashboard') + '   Launch monitoring dashboard');
  console.log(chalk.cyan('    autospec doctor') + '      Check system readiness');
  console.log('');
  console.log(chalk.dim('  Run ' + chalk.cyan('autospec <command> --help') + ' for more info\n'));
});

// Parse arguments
program.parse();
