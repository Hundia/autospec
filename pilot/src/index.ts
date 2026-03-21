#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { ensurePilotDirs } from './utils/config.js';
import { setupSignalHandlers } from './utils/signals.js';
import { setLogFile } from './utils/logger.js';

const program = new Command();

program
  .name('pilot')
  .description('Claude Pilot — Resilient Claude Code session manager')
  .version('0.1.0');

// --- pilot start ---
program
  .command('start')
  .description('Start a new Claude Code session in tmux')
  .argument('<prompt>', 'The prompt or task for Claude')
  .option('-n, --name <name>', 'Session display name')
  .option('-d, --cwd <dir>', 'Working directory')
  .option('--auto-approve', 'Skip all permission prompts')
  .option('--approve-reads', 'Auto-approve Read/Glob/Grep')
  .option('--timeout <minutes>', 'Approval timeout in minutes', '5')
  .option('--skill <name>', 'Run a Claude Code skill (e.g., sprint-run)')
  .option('--resume <session-id>', 'Resume a previous Claude session')
  .option('--model <model>', 'Claude model override')
  .option('--attach', 'Attach to tmux session after start')
  .action(async (prompt: string, opts) => {
    const { runStart } = await import('./commands/start.js');
    await runStart(prompt, opts);
  });

// --- pilot list ---
program
  .command('list')
  .description('List all sessions')
  .option('--all', 'Include completed/killed sessions')
  .option('--json', 'Output as JSON')
  .action(async (opts) => {
    const { runList } = await import('./commands/list.js');
    await runList(opts);
  });

// --- pilot attach ---
program
  .command('attach')
  .description('Attach to a tmux session')
  .argument('<name>', 'Session name or ID')
  .action(async (name: string) => {
    const { runAttach } = await import('./commands/attach.js');
    await runAttach(name);
  });

// --- pilot logs ---
program
  .command('logs')
  .description('Stream session logs')
  .argument('<name>', 'Session name or ID')
  .option('-f, --follow', 'Follow mode (like tail -f)')
  .option('-n, --tail <lines>', 'Number of lines', '50')
  .action(async (name: string, opts) => {
    const { runLogs } = await import('./commands/logs.js');
    await runLogs(name, { follow: opts.follow, tail: parseInt(opts.tail) });
  });

// --- pilot kill ---
program
  .command('kill')
  .description('Kill a session')
  .argument('<name>', 'Session name or ID')
  .option('--force', 'Force kill (SIGKILL)')
  .action(async (name: string, opts) => {
    const { runKill } = await import('./commands/kill.js');
    await runKill(name, opts);
  });

// --- pilot approve ---
program
  .command('approve')
  .description('Approve a pending permission request')
  .argument('[id]', 'Approval ID (latest if omitted)')
  .option('--always', 'Auto-approve this tool for the session')
  .action(async (id: string | undefined, opts) => {
    const { runApprove } = await import('./commands/approve.js');
    await runApprove(id ?? '', opts);
  });

// --- pilot deny ---
program
  .command('deny')
  .description('Deny a pending permission request')
  .argument('[id]', 'Approval ID (latest if omitted)')
  .action(async (id: string | undefined) => {
    const { runDeny } = await import('./commands/approve.js');
    await runDeny(id ?? '');
  });

// --- pilot daemon ---
program
  .command('daemon')
  .description('Manage the background daemon')
  .argument('<action>', 'start | stop | status | logs')
  .action(async (action: string) => {
    const { runDaemon } = await import('./commands/daemon.js');
    await runDaemon(action);
  });

// --- pilot dashboard ---
program
  .command('dashboard')
  .description('Launch TUI dashboard')
  .action(async () => {
    const { runDashboard } = await import('./commands/dashboard.js');
    await runDashboard();
  });

// --- pilot doctor ---
program
  .command('doctor')
  .description('Check system readiness')
  .action(async () => {
    const { runDoctor } = await import('./commands/doctor.js');
    await runDoctor();
  });

// --- pilot whatsapp ---
program
  .command('whatsapp')
  .description('Manage WhatsApp integration')
  .argument('<action>', 'status | qr | test')
  .action(async (action: string) => {
    const { runWhatsApp } = await import('./commands/whatsapp.js');
    await runWhatsApp(action);
  });

// --- pilot config ---
program
  .command('config')
  .description('View or update configuration')
  .argument('[key]', 'Config key to get/set')
  .argument('[value]', 'Value to set')
  .action(async (key?: string, value?: string) => {
    const { loadConfig, setConfigValue, getConfigValue } = await import('./utils/config.js');

    if (!key) {
      const config = await loadConfig();
      console.log(JSON.stringify(config, null, 2));
      return;
    }

    if (value !== undefined) {
      await setConfigValue(key, value);
      console.log(chalk.green(`  Set ${key} = ${value}`));
    } else {
      const val = await getConfigValue(key);
      console.log(val !== undefined ? JSON.stringify(val, null, 2) : chalk.dim('  (not set)'));
    }
  });

// --- Init & run ---
async function main(): Promise<void> {
  await ensurePilotDirs();
  setLogFile('pilot.log');
  setupSignalHandlers();

  await program.parseAsync(process.argv);
}

main().catch((err) => {
  console.error(chalk.red(`  Error: ${err.message}`));
  process.exit(1);
});
