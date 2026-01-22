/**
 * SDD Status Command
 * Show current sprint status from backlog
 */

import path from 'path';
import chalk from 'chalk';

import { readConfig } from '../utils/config.js';
import { readFile, exists } from '../utils/file.js';
import { parseBacklog, getBacklogStats, getSprintStats, Sprint } from '../parsers/backlog.parser.js';

/**
 * Create a visual progress bar
 */
function createProgressBar(percentage: number, width: number = 20): string {
  const filled = Math.round((percentage / 100) * width);
  const empty = width - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  return bar;
}

/**
 * Format status count with emoji
 */
function formatStatusCount(emoji: string, label: string, count: number, total: number): string {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
  const countStr = count.toString().padStart(2);
  return `  ${emoji} ${label.padEnd(14)} ${countStr}  (${percentage}%)`;
}

/**
 * Display sprint information
 */
function displaySprint(sprint: Sprint): void {
  const stats = getSprintStats(sprint);

  // Sprint header
  const statusEmoji = sprint.status === 'complete' ? '✅' : sprint.status === 'active' ? '🔄' : '🔲';
  console.log(chalk.bold(`\n  ${statusEmoji} Sprint ${sprint.number}: ${sprint.name}`));

  if (sprint.goal) {
    console.log(chalk.dim(`  ${sprint.goal}`));
  }

  // Progress bar
  const progressBar = createProgressBar(stats.percentage);
  console.log(`\n  Progress: [${chalk.green(progressBar)}] ${stats.percentage}% (${stats.done}/${stats.total})`);

  // Status breakdown
  console.log('');
  console.log(formatStatusCount('✅', 'Done', stats.done, stats.total));
  console.log(formatStatusCount('🔄', 'In Progress', stats.inProgress, stats.total));
  console.log(formatStatusCount('🧪', 'QA Review', stats.qa, stats.total));
  console.log(formatStatusCount('🔲', 'Todo', stats.todo, stats.total));

  if (stats.blocked > 0) {
    console.log(chalk.red(formatStatusCount('⏸️', 'Blocked', stats.blocked, stats.total)));
  }

  // List tickets by status
  const inProgressTickets = sprint.tickets.filter(t => t.status === 'in_progress');
  const qaTickets = sprint.tickets.filter(t => t.status === 'qa_review');
  const todoTickets = sprint.tickets.filter(t => t.status === 'todo');
  const blockedTickets = sprint.tickets.filter(t => t.status === 'blocked');

  if (inProgressTickets.length > 0) {
    console.log(chalk.bold('\n  Currently Working On:'));
    for (const ticket of inProgressTickets) {
      console.log(chalk.yellow(`    🔄 ${ticket.number}: ${ticket.description}`));
    }
  }

  if (qaTickets.length > 0) {
    console.log(chalk.bold('\n  Ready for QA:'));
    for (const ticket of qaTickets) {
      console.log(chalk.cyan(`    🧪 ${ticket.number}: ${ticket.description}`));
    }
  }

  if (blockedTickets.length > 0) {
    console.log(chalk.bold('\n  Blocked:'));
    for (const ticket of blockedTickets) {
      console.log(chalk.red(`    ⏸️ ${ticket.number}: ${ticket.description}`));
    }
  }

  if (todoTickets.length > 0 && todoTickets.length <= 5) {
    console.log(chalk.bold('\n  Next Up:'));
    for (const ticket of todoTickets.slice(0, 3)) {
      console.log(chalk.dim(`    🔲 ${ticket.number}: ${ticket.description}`));
    }
    if (todoTickets.length > 3) {
      console.log(chalk.dim(`    ... and ${todoTickets.length - 3} more`));
    }
  }
}

/**
 * Show current sprint status
 */
export async function statusCommand(sprintNumber?: number): Promise<void> {
  const projectDir = process.cwd();

  // Check for config
  const config = await readConfig(projectDir);
  if (!config) {
    console.log(chalk.yellow('\n  SDD not initialized in this directory.'));
    console.log(chalk.dim('  Run ' + chalk.cyan('sdd init') + ' to get started.\n'));
    return;
  }

  // Find backlog
  const backlogPath = path.join(projectDir, config.specsDir, 'backlog.md');
  if (!(await exists(backlogPath))) {
    console.log(chalk.yellow('\n  Backlog not found.'));
    console.log(chalk.dim(`  Expected at: ${backlogPath}\n`));
    return;
  }

  // Parse backlog
  const content = await readFile(backlogPath);
  const backlog = parseBacklog(content);
  const stats = getBacklogStats(backlog);

  // Header
  console.log(chalk.bold(`\n  📊 ${backlog.projectName} - Sprint Status\n`));
  console.log(chalk.dim(`  Last updated: ${backlog.lastUpdated || 'Unknown'}`));

  // Overall progress
  const overallBar = createProgressBar(stats.completionPercentage);
  console.log(
    `\n  Overall: [${chalk.green(overallBar)}] ${stats.completionPercentage}% (${stats.completedTickets}/${stats.totalTickets} tickets)`
  );

  // Display specific sprint or current sprint
  if (sprintNumber !== undefined) {
    const sprint = backlog.sprints.find(s => s.number === sprintNumber);
    if (sprint) {
      displaySprint(sprint);
    } else {
      console.log(chalk.yellow(`\n  Sprint ${sprintNumber} not found.`));
    }
  } else if (stats.currentSprint) {
    displaySprint(stats.currentSprint);
  } else {
    // Show all sprints summary
    console.log(chalk.bold('\n  Sprint Summary:'));
    for (const sprint of backlog.sprints) {
      const sprintStats = getSprintStats(sprint);
      const emoji = sprint.status === 'complete' ? '✅' : sprint.status === 'active' ? '🔄' : '🔲';
      console.log(
        `    ${emoji} Sprint ${sprint.number}: ${sprint.name.padEnd(20)} ${sprintStats.done}/${sprintStats.total} done`
      );
    }
  }

  // Bug count
  if (backlog.bugs.length > 0) {
    const activeBugs = backlog.bugs.filter(b => b.status !== 'done');
    if (activeBugs.length > 0) {
      console.log(chalk.red(`\n  🐛 Active Bugs: ${activeBugs.length}`));
    }
  }

  console.log('');
}
