import chalk from 'chalk';
import { listSessions } from '../session/session-manager.js';
import { formatDistanceToNow } from 'date-fns';

const STATUS_ICONS: Record<string, string> = {
  launching: '🔄',
  running: '▶',
  waiting_approval: '⏳',
  completed: '✅',
  error: '❌',
  killed: '💀',
};

interface ListOptions {
  all?: boolean;
  json?: boolean;
}

export async function runList(opts: ListOptions): Promise<void> {
  const sessions = await listSessions(opts.all);

  if (opts.json) {
    console.log(JSON.stringify(sessions, null, 2));
    return;
  }

  if (sessions.length === 0) {
    console.log(chalk.dim('\n  No active sessions.\n'));
    console.log(chalk.dim(`  Start one: ${chalk.cyan('pilot start "your prompt here"')}\n`));
    return;
  }

  console.log(chalk.bold('\n  Claude Pilot Sessions\n'));

  const header = `  ${'Name'.padEnd(20)} ${'Status'.padEnd(14)} ${'Duration'.padEnd(12)} ${'Tools'.padEnd(8)} Last Activity`;
  console.log(chalk.dim(header));
  console.log(chalk.dim('  ' + '─'.repeat(78)));

  for (const session of sessions) {
    const icon = STATUS_ICONS[session.status] ?? '?';
    const name = session.name.substring(0, 18).padEnd(20);
    const status = `${icon} ${session.status}`.padEnd(14);

    const startTime = session.startedAt ?? session.createdAt;
    const endTime = session.completedAt ?? Date.now();
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / 60_000);
    const duration = minutes < 60 ? `${minutes}m` : `${Math.floor(minutes / 60)}h ${minutes % 60}m`;

    const tools = String(session.toolCallCount).padEnd(8);
    const lastActivity = session.lastOutput
      ? session.lastOutput.substring(0, 30)
      : formatDistanceToNow(session.lastActivityAt, { addSuffix: true });

    const color = session.status === 'error' ? chalk.red
      : session.status === 'running' ? chalk.white
      : session.status === 'waiting_approval' ? chalk.yellow
      : chalk.dim;

    console.log(color(`  ${name} ${status} ${duration.padEnd(12)} ${tools} ${lastActivity}`));
  }

  console.log();
}
